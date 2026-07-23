const DRAG_THRESHOLD_PX = 10;
const FLICK_MIN_DISTANCE_PX = 40;
const DISMISS_VELOCITY_PX_MS = 0.45;

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
    if (layer.hidden || panel.scrollTop > 0 || reducedMotion?.matches || event.button > 0) {
      return;
    }

    drag = {
      active: false,
      pointerId: event.pointerId,
      startTime: performance.now(),
      startY: event.clientY,
      y: 0,
    };
    handle.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    const distance = Math.max(0, event.clientY - drag.startY);
    if (!drag.active && distance < DRAG_THRESHOLD_PX) {
      return;
    }

    drag.active = true;
    drag.y = distance;
    event.preventDefault();
    layer.classList.add("is-dragging");
    panel.classList.add("is-dragging");
    panel.style.setProperty("--history-drag-y", `${distance}px`);
    layer.style.setProperty("--history-drag-progress", String(Math.min(distance / Math.max(panel.offsetHeight, 1), 1)));
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
        panelHeight: panel.offsetHeight,
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
