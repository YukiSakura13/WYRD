const DRAG_THRESHOLD_PX = 10;
const FLICK_MIN_DISTANCE_PX = 40;
const DISMISS_VELOCITY_PX_MS = 0.45;
const MAX_UPWARD_RESISTANCE_PX = 8;

export function resolveHistoryDragAxis({ deltaX, deltaY, threshold = DRAG_THRESHOLD_PX }) {
  const horizontal = Math.abs(deltaX);
  const vertical = Math.abs(deltaY);

  if (Math.max(horizontal, vertical) < threshold) {
    return null;
  }

  return vertical >= horizontal ? "vertical" : "horizontal";
}

export function getHistoryUpwardResistance(distance) {
  const normalized = Math.max(0, distance);
  return MAX_UPWARD_RESISTANCE_PX * (1 - Math.exp(-normalized / 32));
}

export function shouldDismissHistoryDrag({ distance, elapsed, panelHeight }) {
  const velocity = distance / Math.max(elapsed, 1);
  const distanceThreshold = Math.min(panelHeight * 0.25, 160);

  return distance >= distanceThreshold || (distance >= FLICK_MIN_DISTANCE_PX && velocity >= DISMISS_VELOCITY_PX_MS);
}

export function createHistorySheetDrag(doc = document) {
  const layer = doc.getElementById("history-sheet-layer");
  const panel = doc.getElementById("history-sheet");
  const handle = doc.querySelector("[data-history-sheet-handle]");
  const closeControl = panel?.querySelector("[data-action='close-history-entry']");
  const reducedMotion = doc.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)");
  let drag = null;

  return {
    connect,
  };

  function connect() {
    if (!layer || !panel || !handle || handle.dataset.dragBound === "true") {
      return;
    }

    handle.dataset.dragBound = "true";
    handle.addEventListener("pointerdown", startDrag);
    handle.addEventListener("pointermove", moveDrag);
    handle.addEventListener("pointerup", finishDrag);
    handle.addEventListener("pointercancel", cancelDrag);
    layer.addEventListener("transitionend", resetWhenClosed);
  }

  function startDrag(event) {
    if (
      drag ||
      layer.hidden ||
      panel.scrollTop > 0 ||
      reducedMotion?.matches ||
      event.isPrimary === false ||
      event.button > 0
    ) {
      return;
    }

    drag = {
      active: false,
      axis: null,
      panelHeight: panel.offsetHeight,
      pointerId: event.pointerId,
      startTime: performance.now(),
      startX: event.clientX,
      startY: event.clientY,
      y: 0,
    };
    handle.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.axis) {
      drag.axis = resolveHistoryDragAxis({ deltaX, deltaY });
    }

    if (!drag.axis) {
      return;
    }

    if (drag.axis === "horizontal") {
      releasePointer(event.pointerId);
      drag = null;
      return;
    }

    drag.active = true;
    drag.y = Math.max(0, deltaY);
    event.preventDefault();
    layer.classList.add("is-dragging");
    panel.classList.add("is-dragging");
    panel.style.setProperty(
      "--history-drag-y",
      `${deltaY >= 0 ? drag.y : -getHistoryUpwardResistance(-deltaY)}px`,
    );
    layer.style.setProperty(
      "--history-drag-progress",
      String(Math.min(drag.y / Math.max(drag.panelHeight, 1), 1)),
    );
  }

  function finishDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    const shouldDismiss =
      drag.active &&
      shouldDismissHistoryDrag({
        distance: drag.y,
        elapsed: performance.now() - drag.startTime,
        panelHeight: drag.panelHeight,
      });
    releasePointer(event.pointerId);

    if (shouldDismiss) {
      layer.classList.remove("is-dragging");
      panel.classList.remove("is-dragging");
      closeControl?.click();
      window.setTimeout(resetStyles, 420);
    } else {
      settleBack();
    }

    drag = null;
  }

  function cancelDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    releasePointer(event.pointerId);
    settleBack();
    drag = null;
  }

  function settleBack() {
    layer.classList.remove("is-dragging");
    panel.classList.remove("is-dragging");
    panel.style.setProperty("--history-drag-y", "0px");
    layer.style.setProperty("--history-drag-progress", "0");
  }

  function releasePointer(pointerId) {
    if (handle.hasPointerCapture(pointerId)) {
      handle.releasePointerCapture(pointerId);
    }
  }

  function resetWhenClosed(event) {
    if (event.target === panel && !layer.classList.contains("is-dialog-visible")) {
      resetStyles();
    }
  }

  function resetStyles() {
    layer.classList.remove("is-dragging");
    panel.classList.remove("is-dragging");
    panel.style.removeProperty("--history-drag-y");
    layer.style.removeProperty("--history-drag-progress");
  }
}
