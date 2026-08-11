const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 4000;
const NOTIFICATION_KINDS = ["info", "success", "warning", "error"];
let sequence = 0;
let center = null;

export function getNotificationSemantics(kind = "info") {
  return kind === "error"
    ? { role: "alert", live: "assertive" }
    : { role: "status", live: "polite" };
}

export function getNotificationPolicy(options = {}) {
  const kind = NOTIFICATION_KINDS.includes(options.kind) ? options.kind : "info";
  const hasAction = Boolean(options.action?.label && typeof options.action.onClick === "function");
  const persistentByDefault = kind === "error" || hasAction;

  return {
    kind,
    duration:
      options.duration === undefined
        ? persistentByDefault
          ? Number.POSITIVE_INFINITY
          : DEFAULT_DURATION
        : normalizeDuration(options.duration),
    dismissible: options.dismissible ?? persistentByDefault,
  };
}

export function notify(options) {
  const normalized = typeof options === "string" ? { message: options } : options;
  if (!normalized?.message) {
    return null;
  }

  return getCenter().show(normalized);
}

function getCenter() {
  if (!center) {
    center = createNotificationCenter(document);
  }

  return center;
}

function createNotificationCenter(doc) {
  const root = doc.getElementById("wyrd-notifications");
  const records = [];
  const view = doc.defaultView;

  doc.addEventListener("visibilitychange", function syncVisibility() {
    records.forEach((record) => (doc.hidden ? pause(record) : resume(record)));
  });

  return {
    show,
  };

  function show(options) {
    if (!root) {
      return null;
    }

    const id = options.id || `wyrd-notification-${++sequence}`;
    const existing = records.find((record) => record.id === id);
    if (existing) {
      pause(existing);
      existing.remaining = applyOptions(existing, options);
      resume(existing);
      return id;
    }

    while (records.length >= MAX_VISIBLE) {
      dismiss(records[0], true);
    }

    const item = doc.createElement("article");
    item.className = "wyrd-notification";
    item.dataset.notificationId = id;
    item.setAttribute("aria-atomic", "true");

    const message = doc.createElement("p");
    message.className = "wyrd-notification__message";
    item.appendChild(message);

    const close = doc.createElement("button");
    close.className = "wyrd-notification__close";
    close.type = "button";
    close.setAttribute("aria-label", "Закрыть уведомление");
    close.textContent = "×";
    item.appendChild(close);

    const record = {
      id,
      item,
      message,
      close,
      action: null,
      remaining: 0,
      startedAt: 0,
      timer: 0,
      removalTimer: 0,
      exitTarget: null,
      exitHandler: null,
      pausedByFocus: false,
      pausedByHover: false,
      dismissed: false,
    };
    record.remaining = applyOptions(record, options);
    records.push(record);

    close.addEventListener("click", () => dismiss(record));
    item.addEventListener("pointerenter", () => {
      record.pausedByHover = true;
      pause(record);
    });
    item.addEventListener("pointerleave", () => {
      record.pausedByHover = false;
      resume(record);
    });
    item.addEventListener("focusin", () => {
      record.pausedByFocus = true;
      pause(record);
    });
    item.addEventListener("focusout", (event) => {
      if (!item.contains(event.relatedTarget)) {
        record.pausedByFocus = false;
        resume(record);
      }
    });

    root.appendChild(item);
    view?.requestAnimationFrame(() => item.classList.add("is-visible"));
    if (!doc.hidden) {
      resume(record);
    }
    return id;
  }

  function applyOptions(record, options) {
    const policy = getNotificationPolicy(options);
    const semantics = getNotificationSemantics(policy.kind);

    NOTIFICATION_KINDS.forEach((name) => record.item.classList.remove(`wyrd-notification--${name}`));
    record.item.classList.add(`wyrd-notification--${policy.kind}`);
    record.item.setAttribute("role", semantics.role);
    record.item.setAttribute("aria-live", semantics.live);
    record.message.textContent = options.message;
    record.close.hidden = !policy.dismissible;
    record.item.classList.toggle("is-dismissible", policy.dismissible);
    syncAction(record, options.action);
    return policy.duration;
  }

  function syncAction(record, actionOptions) {
    record.action?.remove();
    record.action = null;
    record.item.classList.remove("has-action");

    if (!actionOptions?.label || typeof actionOptions.onClick !== "function") {
      return;
    }

    const action = doc.createElement("button");
    action.className = "wyrd-notification__action";
    action.type = "button";
    action.textContent = actionOptions.label;
    action.addEventListener("click", function runAction(event) {
      actionOptions.onClick(event);
      dismiss(record);
    });
    record.item.insertBefore(action, record.close);
    record.action = action;
    record.item.classList.add("has-action");
  }

  function pause(record) {
    if (!record.timer) {
      return;
    }

    view?.clearTimeout(record.timer);
    record.timer = 0;
    record.remaining = Math.max(0, record.remaining - (now() - record.startedAt));
  }

  function resume(record) {
    if (
      record.dismissed ||
      record.timer ||
      doc.hidden ||
      record.pausedByFocus ||
      record.pausedByHover ||
      !Number.isFinite(record.remaining) ||
      record.remaining <= 0
    ) {
      return;
    }

    record.startedAt = now();
    record.timer = view?.setTimeout(() => dismiss(record), record.remaining) || 0;
  }

  function dismiss(record, immediate = false) {
    if (record.dismissed) {
      return;
    }

    record.dismissed = true;
    pause(record);
    const index = records.indexOf(record);
    if (index >= 0) {
      records.splice(index, 1);
    }

    if (immediate) {
      cleanupExit(record);
      record.item.remove();
      return;
    }

    record.item.classList.remove("is-visible");
    record.item.classList.add("is-leaving");
    removeAfterTransition(record);
  }

  function removeAfterTransition(record) {
    cleanupExit(record);
    const transition = getLongestTransition(record.item);
    const finish = () => {
      cleanupExit(record);
      record.item.remove();
    };

    if (transition.total <= 0) {
      record.removalTimer = view?.setTimeout(finish, 0) || 0;
      return;
    }

    record.exitTarget = record.item;
    record.exitHandler = (event) => {
      if (
        event.target === record.item &&
        (transition.property === "all" || event.propertyName === transition.property)
      ) {
        finish();
      }
    };
    record.item.addEventListener("transitionend", record.exitHandler);
    record.removalTimer = view?.setTimeout(finish, transition.total + 80) || 0;
  }

  function cleanupExit(record) {
    view?.clearTimeout(record.removalTimer);
    record.removalTimer = 0;
    if (record.exitTarget && record.exitHandler) {
      record.exitTarget.removeEventListener("transitionend", record.exitHandler);
    }
    record.exitTarget = null;
    record.exitHandler = null;
  }

  function getLongestTransition(element) {
    const style = view?.getComputedStyle(element);
    if (!style) {
      return { property: "all", total: 0 };
    }

    const properties = splitCssList(style.transitionProperty || "all");
    const durations = splitCssList(style.transitionDuration || "0s").map(parseCssTime);
    const delays = splitCssList(style.transitionDelay || "0s").map(parseCssTime);
    const count = Math.max(properties.length, durations.length, delays.length);
    let longest = { property: "all", total: 0 };

    for (let index = 0; index < count; index += 1) {
      const property = properties[index % properties.length] || "all";
      const total = (durations[index % durations.length] || 0) + (delays[index % delays.length] || 0);
      if (property !== "none" && total > longest.total) {
        longest = { property, total };
      }
    }

    return longest;
  }

  function now() {
    return view?.performance?.now?.() ?? Date.now();
  }
}

function normalizeDuration(duration) {
  if (duration === undefined) {
    return DEFAULT_DURATION;
  }

  return Number.isFinite(duration) && duration > 0 ? duration : Number.POSITIVE_INFINITY;
}

function splitCssList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseCssTime(value) {
  const duration = Number.parseFloat(value) || 0;
  return value.endsWith("ms") ? duration : duration * 1000;
}
