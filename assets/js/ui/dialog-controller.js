const controllers = new WeakMap();

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getDialogController(doc = document) {
  if (!controllers.has(doc)) {
    controllers.set(doc, createDialogController(doc));
  }

  return controllers.get(doc);
}

function createDialogController(doc) {
  const records = new Map();
  const stack = [];
  const inertRegistry = new WeakMap();
  let connected = false;
  let openCount = 0;
  let scrollLockSnapshot = null;

  const controller = {
    connect,
    sync,
  };

  connect();
  return controller;

  function connect() {
    if (connected) {
      return;
    }

    connected = true;
    doc.addEventListener("keydown", handleKeydown, true);
  }

  function sync(layer, shouldOpen, options = {}) {
    if (!layer) {
      return;
    }

    const record = records.get(layer);

    if (shouldOpen) {
      if (record?.open) {
        record.options = { ...record.options, ...options };
        return;
      }

      open(layer, options, record);
      return;
    }

    if (!record) {
      layer.hidden = true;
      return;
    }

    record.options = { ...record.options, ...options };
    close(record);
  }

  function open(layer, options, existingRecord) {
    const view = doc.defaultView;
    const record = existingRecord || {
      layer,
      inerted: [],
      restoreTarget: null,
      timer: 0,
      transitionTarget: null,
      transitionHandler: null,
      viewportCleanup: null,
    };

    cancelPendingClose(record, view);
    record.open = true;
    record.options = { ...record.options, ...options };
    record.restoreTarget = isUsableFocusTarget(doc.activeElement, layer) ? doc.activeElement : record.restoreTarget;
    records.set(layer, record);

    layer.hidden = false;
    layer.classList.remove("is-dialog-closing");
    layer.dataset.dialogState = "opening";
    if (!existingRecord) {
      if (openCount === 0) {
        acquireScrollLock();
      }
      acquireOutsideInert(record);
      openCount += 1;
    }
    attachViewportAdapter(record);
    stack.push(record);
    doc.body.classList.add("has-open-dialog");

    view?.requestAnimationFrame(function revealDialog() {
      if (!record.open) {
        return;
      }

      layer.classList.add("is-dialog-visible");
      layer.dataset.dialogState = "open";
      focusInitial(record);
    });
  }

  function close(record) {
    if (!record.open) {
      return;
    }

    const view = doc.defaultView;
    record.open = false;
    record.layer.classList.remove("is-dialog-visible");
    record.layer.classList.add("is-dialog-closing");
    record.layer.dataset.dialogState = "closing";
    removeFromStack(record);

    scheduleFinalizeClose(record, view);
  }

  function finalizeClose(record) {
    if (record.open) {
      return;
    }

    record.layer.hidden = true;
    record.layer.classList.remove("is-dialog-closing");
    delete record.layer.dataset.dialogState;
    detachViewportAdapter(record);
    releaseOutsideInert(record);
    records.delete(record.layer);
    openCount = Math.max(0, openCount - 1);

    if (openCount === 0) {
      doc.body.classList.remove("has-open-dialog");
      releaseScrollLock();
    }

    const returnTarget = resolveReturnFocus(record) || record.restoreTarget;
    if (record.options.restoreFocus !== false && isVisibleFocusTarget(returnTarget)) {
      returnTarget.focus({ preventScroll: true });
    }
  }

  function focusInitial(record) {
    const panel = record.layer.querySelector("[data-dialog-panel]") || record.layer;
    const requested = resolveInitialFocus(record, panel);
    const focusTarget = requested || getFocusable(panel)[0] || panel;

    if (!focusTarget.hasAttribute("tabindex") && focusTarget === panel) {
      focusTarget.setAttribute("tabindex", "-1");
    }

    focusTarget.focus({ preventScroll: true });
  }

  function resolveInitialFocus(record, panel) {
    const { initialFocus } = record.options;

    if (typeof initialFocus === "string") {
      return panel.querySelector(initialFocus) || record.layer.querySelector(initialFocus);
    }

    return initialFocus instanceof doc.defaultView.HTMLElement ? initialFocus : null;
  }

  function resolveReturnFocus(record) {
    const { returnFocus } = record.options;
    if (typeof returnFocus === "function") {
      return returnFocus();
    }

    if (typeof returnFocus === "string") {
      return doc.querySelector(returnFocus);
    }

    return returnFocus instanceof doc.defaultView.HTMLElement ? returnFocus : null;
  }

  function handleKeydown(event) {
    const record = getTopRecord();
    if (!record) {
      return;
    }

    if (event.key === "Escape") {
      const dismiss = record.layer.querySelector("[data-dialog-dismiss-primary]");
      if (!dismiss) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      dismiss.click();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const panel = record.layer.querySelector("[data-dialog-panel]") || record.layer;
    const focusable = getFocusable(panel);
    if (!focusable.length) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (doc.activeElement === first || !panel.contains(doc.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (doc.activeElement === last || !panel.contains(doc.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  function getTopRecord() {
    for (let index = stack.length - 1; index >= 0; index -= 1) {
      if (stack[index].open) {
        return stack[index];
      }
    }

    return null;
  }

  function acquireOutsideInert(record) {
    let current = record.layer;

    while (current && current !== doc.body) {
      const parent = current.parentElement;
      if (!parent) {
        break;
      }

      Array.from(parent.children).forEach(function inertSibling(sibling) {
        if (sibling === current || sibling.hasAttribute("data-dialog-exempt")) {
          return;
        }

        const inertState = inertRegistry.get(sibling) || {
          count: 0,
          original: sibling.inert,
        };
        inertState.count += 1;
        inertRegistry.set(sibling, inertState);
        sibling.inert = true;
        record.inerted.push(sibling);
      });

      current = parent;
    }
  }

  function releaseOutsideInert(record) {
    record.inerted.forEach(function restoreSibling(sibling) {
      const inertState = inertRegistry.get(sibling);
      if (!inertState) {
        return;
      }

      inertState.count -= 1;
      if (inertState.count <= 0) {
        sibling.inert = inertState.original;
        inertRegistry.delete(sibling);
      }
    });
    record.inerted = [];
  }

  function removeFromStack(record) {
    const index = stack.lastIndexOf(record);
    if (index >= 0) {
      stack.splice(index, 1);
    }
  }

  function scheduleFinalizeClose(record, view) {
    cancelPendingClose(record, view);

    const panel = record.layer.querySelector("[data-dialog-panel]") || record.layer;
    const transition = getLongestTransition(panel, view);
    const finish = () => {
      cancelPendingClose(record, view);
      finalizeClose(record);
    };

    if (transition.total <= 0) {
      record.timer = view?.setTimeout(finish, 0) || 0;
      return;
    }

    record.transitionTarget = panel;
    record.transitionHandler = (event) => {
      if (
        event.target === panel &&
        (transition.property === "all" || event.propertyName === transition.property)
      ) {
        finish();
      }
    };
    panel.addEventListener("transitionend", record.transitionHandler);
    record.timer = view?.setTimeout(finish, transition.total + 80) || 0;
  }

  function cancelPendingClose(record, view) {
    view?.clearTimeout(record.timer);
    record.timer = 0;
    if (record.transitionTarget && record.transitionHandler) {
      record.transitionTarget.removeEventListener("transitionend", record.transitionHandler);
    }
    record.transitionTarget = null;
    record.transitionHandler = null;
  }

  function acquireScrollLock() {
    const view = doc.defaultView;
    if (!view || scrollLockSnapshot) {
      return;
    }

    const bodyStyle = doc.body.style;
    const rootStyle = doc.documentElement.style;
    const scrollX = view.scrollX || 0;
    const scrollY = view.scrollY || 0;
    const useFixedBody = isIOSWebView(view) && !isStandalone(view);
    scrollLockSnapshot = {
      scrollX,
      scrollY,
      useFixedBody,
      body: captureInlineStyles(bodyStyle, ["position", "top", "left", "right", "width"]),
      root: captureInlineStyles(rootStyle, ["padding-right"]),
    };

    if (useFixedBody) {
      bodyStyle.setProperty("position", "fixed");
      bodyStyle.setProperty("top", `${-scrollY}px`);
      bodyStyle.setProperty("left", `${-scrollX}px`);
      bodyStyle.setProperty("right", "0");
      bodyStyle.setProperty("width", "100%");
      return;
    }

    const scrollbarGap = Math.max(0, view.innerWidth - doc.documentElement.clientWidth);
    if (scrollbarGap > 0) {
      const currentPadding = Number.parseFloat(view.getComputedStyle(doc.documentElement).paddingRight) || 0;
      rootStyle.setProperty("padding-right", `${currentPadding + scrollbarGap}px`);
    }
  }

  function releaseScrollLock() {
    const view = doc.defaultView;
    const snapshot = scrollLockSnapshot;
    if (!view || !snapshot) {
      return;
    }

    restoreInlineStyles(doc.body.style, snapshot.body);
    restoreInlineStyles(doc.documentElement.style, snapshot.root);
    scrollLockSnapshot = null;

    if (snapshot.useFixedBody) {
      view.requestAnimationFrame(() => view.scrollTo(snapshot.scrollX, snapshot.scrollY));
    }
  }

  function attachViewportAdapter(record) {
    if (record.viewportCleanup) {
      return;
    }

    const view = doc.defaultView;
    const panel = record.layer.querySelector('[data-dialog-panel][data-dialog-motion="sheet"]');
    if (!view || !panel) {
      return;
    }

    const viewport = view.visualViewport;
    const update = () => {
      const viewportHeight = Math.max(1, Math.round(viewport?.height || view.innerHeight));
      const viewportTop = Math.max(0, Math.round(viewport?.offsetTop || 0));
      const occludedBottom = Math.max(
        0,
        Math.round(view.innerHeight - (viewportHeight + viewportTop)),
      );
      const focusedInput = isKeyboardInput(doc.activeElement);

      record.layer.style.setProperty("--dialog-viewport-height", `${viewportHeight}px`);
      record.layer.style.setProperty(
        "--dialog-viewport-bottom",
        `${focusedInput && occludedBottom > 80 ? occludedBottom : 0}px`,
      );

      if (focusedInput && panel.contains(doc.activeElement)) {
        view.requestAnimationFrame(() => keepFocusInsideViewport(doc.activeElement, panel, viewport, view));
      }
    };

    const handleFocus = () => view.requestAnimationFrame(update);
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    record.layer.addEventListener("focusin", handleFocus);
    record.layer.addEventListener("focusout", handleFocus);
    view.addEventListener("resize", update);
    update();

    record.viewportCleanup = () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      record.layer.removeEventListener("focusin", handleFocus);
      record.layer.removeEventListener("focusout", handleFocus);
      view.removeEventListener("resize", update);
      record.layer.style.removeProperty("--dialog-viewport-height");
      record.layer.style.removeProperty("--dialog-viewport-bottom");
    };
  }

  function detachViewportAdapter(record) {
    record.viewportCleanup?.();
    record.viewportCleanup = null;
  }
}

function getFocusable(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisibleFocusTarget);
}

function isUsableFocusTarget(element, layer) {
  return element && element !== layer.ownerDocument.body && !layer.contains(element) && typeof element.focus === "function";
}

function isVisibleFocusTarget(element) {
  if (!element || typeof element.focus !== "function" || !element.isConnected || element.closest("[inert]")) {
    return false;
  }

  return element.getClientRects().length > 0 && element.getAttribute("aria-hidden") !== "true";
}

function getLongestTransition(element, view) {
  if (!element || !view) {
    return { property: "all", total: 0 };
  }

  const style = view.getComputedStyle(element);
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

function splitCssList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseCssTime(value) {
  const duration = Number.parseFloat(value) || 0;
  return value.endsWith("ms") ? duration : duration * 1000;
}

function captureInlineStyles(style, properties) {
  return properties.map((property) => ({
    property,
    value: style.getPropertyValue(property),
    priority: style.getPropertyPriority(property),
  }));
}

function restoreInlineStyles(style, snapshot) {
  snapshot.forEach(({ property, value, priority }) => {
    if (value) {
      style.setProperty(property, value, priority);
    } else {
      style.removeProperty(property);
    }
  });
}

function isIOSWebView(view) {
  const navigator = view.navigator;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone(view) {
  return view.matchMedia?.("(display-mode: standalone)")?.matches || view.navigator.standalone === true;
}

function isKeyboardInput(element) {
  if (!element || element.getAttribute?.("contenteditable") === "false") {
    return false;
  }

  if (element.matches?.("textarea, [contenteditable]:not([contenteditable='false'])")) {
    return true;
  }

  if (!element.matches?.("input")) {
    return false;
  }

  return !new Set([
    "button",
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "file",
    "hidden",
    "image",
    "month",
    "radio",
    "range",
    "reset",
    "submit",
    "time",
    "week",
  ]).has(element.type);
}

function keepFocusInsideViewport(element, panel, visualViewport, view) {
  if (!element?.isConnected) {
    return;
  }

  const viewportTop = visualViewport?.offsetTop || 0;
  const viewportBottom = viewportTop + (visualViewport?.height || view.innerHeight);
  const rect = element.getBoundingClientRect();
  const margin = 12;
  let correction = 0;

  if (rect.bottom > viewportBottom - margin) {
    correction = rect.bottom - viewportBottom + margin;
  } else if (rect.top < viewportTop + margin) {
    correction = rect.top - viewportTop - margin;
  }

  if (correction) {
    panel.scrollTop += correction;
  }
}
