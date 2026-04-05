import { createReading, createSpread } from "../cards/reading.js";
import { deriveContentPanel } from "./render.js";

export function createActionHandler(deps) {
  const { audio, cards, renderApp, renderer, ritual, store, uiState } = deps;

  return function onClick(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) {
      return;
    }

    const action = trigger.dataset.action;

    if (action === "enter") {
      uiState.entered = true;
      renderApp();
      audio.sync({
        allowInit: true,
        enabled: store.getState().soundEnabled,
        ambienceVolume: store.getState().ambienceVolume,
      });
      return;
    }

    if (action === "toggle-sound") {
      const nextState = store.toggleSound();
      audio.sync({
        enabled: nextState.soundEnabled,
        ambienceVolume: nextState.ambienceVolume,
      });
      renderApp();
      return;
    }

    if (action === "draw") {
      if (store.hasFreeDraw()) {
        startRitual("free");
      } else {
        openPaywall("extra-draw");
      }
      return;
    }

    if (action === "extra-draw" || action === "deep-reading" || action === "spread-3" || action === "spread-5") {
      openPaywall(action);
      return;
    }

    if (action === "confirm-paywall") {
      if (uiState.paywallOffer) {
        startRitual(uiState.paywallOffer);
      }
      return;
    }

    if (action === "open-profile") {
      uiState.overlay = "profile";
      renderApp();
      renderer.scrollTo("profile");
      return;
    }

    if (action === "close-profile") {
      uiState.overlay = "none";
      renderApp();
      return;
    }

    if (action === "reset-local") {
      ritual.stop();
      audio.stop();
      store.reset();
      uiState.entered = false;
      uiState.overlay = "none";
      uiState.paywallOffer = null;
      uiState.ritualCountdown = 3;
      renderApp();
    }
  };

  function openPaywall(offer) {
    uiState.overlay = "paywall";
    uiState.paywallOffer = offer;
    renderApp();
    renderer.scrollTo("paywall");
  }

  function startRitual(mode) {
    uiState.overlay = "ritual";
    uiState.paywallOffer = null;
    uiState.ritualCountdown = 3;
    renderApp();
    ritual.start(mode);
  }
}

export function createInputHandler(deps) {
  const { audio, renderApp, store } = deps;

  return function onInput(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) {
      return;
    }

    const action = trigger.dataset.action;
    if (action !== "set-ambience-volume") {
      return;
    }

    const value = Number(trigger.value);
    if (Number.isNaN(value)) {
      return;
    }

    const nextState = store.setAmbienceVolume(value / 100);
    audio.sync({
      enabled: nextState.soundEnabled,
      ambienceVolume: nextState.ambienceVolume,
    });
    renderApp();
  };
}

export function createKnobHandler(doc = document) {
  let activeKnob = null;

  return function onPointer(event) {
    const knob = event.target.closest("#ambience-knob");

    if (event.type === "pointerdown" && knob) {
      activeKnob = knob;
      knob.setPointerCapture(event.pointerId);
      updateFromPointer(event, knob);
      return;
    }

    if (!activeKnob) {
      return;
    }

    if (event.type === "pointermove") {
      updateFromPointer(event, activeKnob);
      return;
    }

    if (event.type === "pointerup" || event.type === "pointercancel") {
      updateFromPointer(event, activeKnob);
      activeKnob.releasePointerCapture?.(event.pointerId);
      activeKnob = null;
    }
  };

  function updateFromPointer(event, knob) {
    const input = doc.getElementById("ambience-volume");
    if (!input) {
      return;
    }

    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    if (angle < 0) {
      angle += 360;
    }

    if (angle < 135) {
      angle += 360;
    }

    const normalized = Math.max(0, Math.min(1, (angle - 135) / 270));
    const value = Math.round(normalized * 100);

    input.value = String(value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

export function resolveRitual(deps, mode) {
  const { audio, cards, renderApp, renderer, store, uiState } = deps;
  const currentState = store.getState();

  uiState.overlay = "none";
  uiState.paywallOffer = null;
  uiState.ritualCountdown = 3;
  audio.playRustle(currentState.soundEnabled);

  if (mode === "free") {
    store.markDailyFreeUsed(new Date().toISOString());
    store.saveReading(createReading(cards, true));
    renderApp();
    renderer.animateDeck();
    renderer.scrollTo("result");
    return;
  }

  if (mode === "extra-draw") {
    store.saveReading(createReading(cards, false));
    renderApp();
    renderer.animateDeck();
    renderer.scrollTo("result");
    return;
  }

  if (mode === "deep-reading") {
    store.unlockCurrentReadingDepth();
    renderApp();
    renderer.scrollTo("result");
    return;
  }

  if (mode === "spread-3" || mode === "spread-5") {
    const count = mode === "spread-3" ? 3 : 5;
    store.saveSpread(createSpread(cards, count));
    renderApp();
    renderer.scrollTo("spread");
    return;
  }

  renderApp();
}

export function createInitialUIState(state) {
  return {
    entered: false,
    overlay: "none",
    paywallOffer: null,
    ritualCountdown: 3,
    contentPanel: deriveContentPanel(state),
  };
}
