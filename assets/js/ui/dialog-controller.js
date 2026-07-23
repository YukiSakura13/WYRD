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
  const reducedMotion = doc.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)");
  let connected = false;
  let openCount = 0;

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
    };

    view?.clearTimeout(record.timer);
    record.open = true;
    record.options = { ...record.options, ...options };
    record.restoreTarget = isUsableFocusTarget(doc.activeElement, layer) ? doc.activeElement : record.restoreTarget;
    records.set(layer, record);

    layer.hidden = false;
    layer.classList.remove("is-dialog-closing");
    layer.dataset.dialogState = "opening";
    if (!existingRecord) {
      acquireOutsideInert(record);
      openCount += 1;
    }
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

    const delay = reducedMotion?.matches ? 0 : getDialogDuration(record.layer, view);
    view?.clearTimeout(record.timer);
    record.timer = view?.setTimeout(() => finalizeClose(record), delay) || 0;
  }

  function finalizeClose(record) {
    if (record.open) {
      return;
    }

    record.layer.hidden = true;
    record.layer.classList.remove("is-dialog-closing");
    delete record.layer.dataset.dialogState;
    releaseOutsideInert(record);
    records.delete(record.layer);
    openCount = Math.max(0, openCount - 1);

    if (openCount === 0) {
      doc.body.classList.remove("has-open-dialog");
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

function getDialogDuration(layer, view) {
  const rawValue = view?.getComputedStyle(layer).getPropertyValue("--dialog-duration").trim() || "220ms";
  const duration = Number.parseFloat(rawValue);

  return rawValue.endsWith("s") && !rawValue.endsWith("ms") ? duration * 1000 : duration;
}
