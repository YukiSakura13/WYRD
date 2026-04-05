import { createReading, createSpread } from "../cards/reading.js";
import { deriveContentPanel } from "./render.js";

export function createActionHandler(deps) {
  const { audio, cards, renderApp, renderer, store, uiState } = deps;

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
      });
      return;
    }

    if (action === "toggle-sound") {
      const nextState = store.toggleSound();
      audio.sync({ enabled: nextState.soundEnabled });
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
      audio.stop();
      store.reset();
      uiState.entered = false;
      uiState.overlay = "none";
      uiState.paywallOffer = null;
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
    uiState.overlay = "none";
    uiState.paywallOffer = null;
    renderApp();
    resolveRitual(deps, mode);
  }
}

export function resolveRitual(deps, mode) {
  const { audio, cards, renderApp, renderer, store, uiState } = deps;
  const currentState = store.getState();

  uiState.overlay = "none";
  uiState.paywallOffer = null;
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
    contentPanel: deriveContentPanel(state),
  };
}
