const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 4200;
let sequence = 0;
let center = null;

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
      window.clearTimeout(existing.timer);
      existing.timer = 0;
      existing.message.textContent = options.message;
      existing.remaining = options.duration ?? DEFAULT_DURATION;
      resume(existing);
      return id;
    }

    while (records.length >= MAX_VISIBLE) {
      dismiss(records[0], true);
    }

    const item = doc.createElement("article");
    item.className = `wyrd-notification wyrd-notification--${options.kind || "info"}`;
    item.dataset.notificationId = id;

    const message = doc.createElement("p");
    message.className = "wyrd-notification__message";
    message.textContent = options.message;
    item.appendChild(message);

    if (options.action?.label && typeof options.action.onClick === "function") {
      const action = doc.createElement("button");
      action.className = "wyrd-notification__action";
      action.type = "button";
      action.textContent = options.action.label;
      action.addEventListener("click", function runAction() {
        options.action.onClick();
        dismiss(record);
      });
      item.appendChild(action);
    }

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
      remaining: options.duration ?? DEFAULT_DURATION,
      startedAt: 0,
      timer: 0,
      pausedByFocus: false,
      pausedByHover: false,
    };
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
    doc.defaultView?.requestAnimationFrame(() => item.classList.add("is-visible"));
    if (!doc.hidden) {
      resume(record);
    }
    return id;
  }

  function pause(record) {
    if (!record.timer) {
      return;
    }

    window.clearTimeout(record.timer);
    record.timer = 0;
    record.remaining = Math.max(0, record.remaining - (performance.now() - record.startedAt));
  }

  function resume(record) {
    if (record.timer || doc.hidden || record.pausedByFocus || record.pausedByHover || record.remaining <= 0) {
      return;
    }

    record.startedAt = performance.now();
    record.timer = window.setTimeout(() => dismiss(record), record.remaining);
  }

  function dismiss(record, immediate = false) {
    window.clearTimeout(record.timer);
    record.timer = 0;
    const index = records.indexOf(record);
    if (index >= 0) {
      records.splice(index, 1);
    }

    if (immediate) {
      record.item.remove();
      return;
    }

    record.item.classList.remove("is-visible");
    record.item.classList.add("is-leaving");
    window.setTimeout(() => record.item.remove(), 180);
  }
}
