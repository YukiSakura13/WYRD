import { SCENES } from "./scenes.js";

export function getAudioScene(scene) {
  if (scene === SCENES.FOREST) {
    return scene;
  }

  if (scene === SCENES.RESULT || scene === SCENES.SPREAD || scene === SCENES.ONBOARDING || scene === SCENES.TRACES) {
    return scene;
  }

  return SCENES.DECK;
}

export function getReturnScene(scene, state) {
  if (scene === SCENES.COVER || scene === SCENES.FOREST || scene === SCENES.DECK || scene === SCENES.RESULT || scene === SCENES.SPREAD) {
    return scene;
  }

  if (state.lastSpread.length) {
    return SCENES.SPREAD;
  }

  if (state.currentReading) {
    return SCENES.RESULT;
  }

  return SCENES.DECK;
}

export function resetViewport(scene) {
  window.requestAnimationFrame(function applyViewportReset() {
    if (scene === SCENES.DECK) {
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

export function playSpreadSequence(audio, enabled, count) {
  const interval = count === 5 ? 860 : 460;

  for (let index = 0; index < count; index += 1) {
    window.setTimeout(function revealNextCard() {
      audio.playReveal(enabled, {
        bright: index === count - 1,
      });
    }, 260 + index * interval);
  }
}

export function createTransitionRunner(renderApp, uiState) {
  return function runTransition(callback, options = {}) {
    const leadIn = options.leadIn ?? 0;

    function beginTransition() {
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

    if (leadIn > 0) {
      window.setTimeout(beginTransition, leadIn);
      return;
    }

    beginTransition();
  };
}
