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
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function enterForest() {
        uiState.entered = true;
        uiState.forceDeck = false;
        uiState.overlay = "onboarding";
        renderApp();
        audio.sync({
          allowInit: true,
          enabled: store.getState().soundEnabled,
          scene: "onboarding",
        });
        window.setTimeout(function scrollToOnboarding() {
          renderer.scrollTo("onboarding");
        }, 80);
      });
      return;
    }

    if (action === "enter-ritual") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function continueToDeck() {
        uiState.forceDeck = true;
        uiState.overlay = "none";
        renderApp();
        audio.sync({
          enabled: store.getState().soundEnabled,
          scene: "deck",
        }
        renderer.scrollTo("deck");
      });
      return;
    }

    if (action === "toggle-sound") {
      const nextState = store.toggleSound();
      audio.sync({ enabled: nextState.soundEnabled, scene: uiState.contentPanel });
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

    if (action === "hook-open-path") {
      audio.playSelect(store.getState().soundEnabled);
      openPaywall("spread-3");
      return;
    }

    if (action === "extra-draw" || action === "deep-reading" || action === "spread-3" || action === "spread-5") {
      audio.playSelect(store.getState().soundEnabled);
      openPaywall(action);
      return;
    }

    if (action === "confirm-paywall") {
      if (uiState.paywallOffer) {
        audio.playSelect(store.getState().soundEnabled);
        startRitual(uiState.paywallOffer);
      }
      return;
    }

    if (action === "open-profile") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.overlay = "profile";
      audio.sync({ enabled: store.getState().soundEnabled, scene: "profile" });
      renderApp();
      renderer.scrollTo("profile");
      return;
    }

    if (action === "close-profile") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.overlay = "none";
      audio.sync({ enabled: store.getState().soundEnabled, scene: uiState.contentPanel });
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
    audio.sync({ enabled: store.getState().soundEnabled, scene: "paywall" });
    renderApp();
    renderer.scrollTo("paywall");
  }

  function startRitual(mode) {
    uiState.forceDeck = false;
    uiState.overlay = "none";
    uiState.paywallOffer = null;
    renderApp();
    runTransition(function resolveAfterTransition() {
      resolveRitual(deps, mode);
    });
  }

  function runTransition(callback) {
    uiState.transitioning = true;
    renderApp();
    window.setTimeout(function finishTransition() {
      callback();
      window.setTimeout(function clearTransition() {
        uiState.transitioning = false;
        renderApp();
      }, 280);
    }, 360);
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
    store.saveReading(
      createReading(cards, true, new Date(), {
        previousReading: currentState.history[0] || null,
      }),
    );
    renderApp();
    renderer.animateDeck();
    audio.sync({ enabled: currentState.soundEnabled, scene: "result" });
    window.setTimeout(function playSingleReveal() {
      audio.playReveal(currentState.soundEnabled);
    }, 380);
    renderer.scrollTo("result");
    return;
  }

  if (mode === "extra-draw") {
    store.saveReading(
      createReading(cards, false, new Date(), {
        previousReading: currentState.history[0] || null,
      }),
    );
    renderApp();
    renderer.animateDeck();
    audio.sync({ enabled: currentState.soundEnabled, scene: "result" });
    window.setTimeout(function playSingleReveal() {
      audio.playReveal(currentState.soundEnabled);
    }, 380);
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
    store.saveSpread(
      createSpread(cards, count, {
        previousReading: currentState.history[0] || null,
      }),
    );
    renderApp();
    audio.sync({ enabled: currentState.soundEnabled, scene: "spread" });
    playSpreadSequence(audio, currentState.soundEnabled, count);
    renderer.scrollTo("spread");
    return;
  }

  renderApp();
}

export function createInitialUIState(state) {
  return {
    entered: false,
    forceDeck: false,
    overlay: "none",
    paywallOffer: null,
    contentPanel: deriveContentPanel(state),
    transitioning: false,
  };
}

function playSpreadSequence(audio, enabled, count) {
  const interval = count === 5 ? 860 : 460;

  for (let index = 0; index < count; index += 1) {
    window.setTimeout(function revealNextCard() {
      audio.playReveal(enabled, {
        bright: index === count - 1,
      });
    }, 260 + index * interval);
  }
}
