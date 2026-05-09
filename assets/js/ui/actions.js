import { createReading, createSpread } from "../cards/reading.js";
import { buildLocalOracleReading } from "../cards/oracle-local.js";
import { detectQuestionRoute } from "../cards/question-routing.js";
import { createTransitionRunner, getAudioScene, getReturnScene, playSpreadSequence, resetViewport } from "./flow.js";
import { SCENES } from "./scenes.js";
import { shareCurrentCard } from "./share.js";

export function createActionHandler(deps) {
  const { audio, cards, renderApp, renderer, setScene, store, uiState } = deps;
  const runTransition = createTransitionRunner(renderApp, uiState);

  return function onClick(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) {
      return;
    }

    const action = trigger.dataset.action;

    if (action === "enter") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function enterForest() {
        setScene(SCENES.DECK);
        audio.sync({
          allowInit: true,
          enabled: store.getState().soundEnabled,
          scene: SCENES.DECK,
        });
        window.setTimeout(function scrollAfterEntry() {
          renderer.scrollTo(SCENES.DECK);
        }, 80);
      });
      return;
    }

    if (action === "enter-ritual") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function continueToDeck() {
        store.markOnboardingSeen();
        setScene(SCENES.DECK);
        audio.sync({
          enabled: store.getState().soundEnabled,
          scene: SCENES.DECK,
        });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "back-from-onboarding") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function leaveOnboarding() {
        const returnTarget = uiState.onboardingReturn || SCENES.COVER;

        if (returnTarget === SCENES.COVER) {
          setScene(SCENES.COVER);
          audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        setScene(SCENES.DECK);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "toggle-sound") {
      const nextState = store.toggleSound();
      audio.sync({ enabled: nextState.soundEnabled, scene: getAudioScene(uiState.activeScene) });
      renderApp();
      const soundBtn = document.getElementById("cover-sound-btn");
      if (soundBtn) {
        soundBtn.classList.toggle("sound-off", !nextState.soundEnabled);
      }
      return;
    }

    if (action === "draw") {
      // Save raw question for routing and a display question for the result screen.
      const questionEl = document.getElementById("question-input");
      uiState.rawQuestion = questionEl ? questionEl.value.trim() : "";
      uiState.currentQuestion = uiState.rawQuestion;
      startRitual("free");
      return;
    }

    if (action === "hook-open-path") {
      audio.playSelect(store.getState().soundEnabled);
      startRitual("spread-3");
      return;
    }

    if (action === "back-to-deck") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToDeck() {
        setScene(SCENES.DECK);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "back-to-cover") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToCover() {
        setScene(SCENES.COVER);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      return;
    }

    if (action === "new-question") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function backToDeck() {
        uiState.currentQuestion = "";
        uiState.rawQuestion = "";
        uiState.continuationOffer = null;
        setScene(SCENES.DECK);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        renderer.scrollTo(SCENES.DECK);
        const questionEl = document.getElementById("question-input");
        if (questionEl) {
          questionEl.value = "";
          window.setTimeout(function focusQuestion() {
            questionEl.focus();
          }, 400);
        }
      });
      return;
    }

    if (action === "share-card") {
      shareCurrentCard(store);
      return;
    }

    if (action === "extra-draw" || action === "deep-reading" || action === "spread-3" || action === "spread-5") {
      audio.playSelect(store.getState().soundEnabled);
      startRitual(action);
      return;
    }

    if (action === "open-profile") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.profileReturnScene = getReturnScene(uiState.activeScene, store.getState());
      setScene(SCENES.PROFILE);
      audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.PROFILE });
      renderer.scrollTo(SCENES.PROFILE);
      return;
    }

    if (action === "replay-onboarding") {
      audio.playSelect(store.getState().soundEnabled);
      store.resetOnboardingSeen();
      uiState.onboardingReturn = uiState.activeScene === SCENES.COVER ? SCENES.COVER : SCENES.DECK;
      setScene(SCENES.ONBOARDING);
      audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.ONBOARDING });
      renderer.scrollTo(SCENES.ONBOARDING);
      return;
    }

    if (action === "close-profile") {
      audio.playSelect(store.getState().soundEnabled);
      const returnScene = getReturnScene(uiState.profileReturnScene, store.getState());
      setScene(returnScene);
      audio.sync({ enabled: store.getState().soundEnabled, scene: getAudioScene(returnScene) });
      return;
    }

    if (action === "reset-local") {
      audio.stop();
      store.reset();
      uiState.continuationOffer = null;
      setScene(SCENES.COVER);
    }
  };

  function startRitual(mode) {
    uiState.continuationOffer = null;
    renderApp();
    runTransition(function resolveAfterTransition() {
      resolveRitual(deps, mode);
    });
  }
}

export function resolveRitual(deps, mode) {
  const { audio, cards, renderApp, renderer, setScene, store, uiState } = deps;
  const currentState = store.getState();

  uiState.continuationOffer = null;
  audio.playRustle(currentState.soundEnabled);

  if (mode === "free") {
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    uiState.currentQuestion = questionRoute.displayQuestion || "";

    store.markDailyFreeUsed(new Date().toISOString());
    store.saveReading(
      createReading(cards, true, new Date(), {
        previousReading: currentState.history[0] || null,
        question: uiState.rawQuestion,
        questionRoute,
      }),
    );
    setScene(SCENES.RESULT);
    renderer.animateDeck();
    audio.sync({ enabled: currentState.soundEnabled, scene: SCENES.RESULT });
    window.setTimeout(function playSingleReveal() {
      audio.playReveal(currentState.soundEnabled);
    }, 380);
    resetViewport(SCENES.RESULT);
    return;
  }

  if (mode === "extra-draw") {
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    uiState.currentQuestion = questionRoute.displayQuestion || "";

    store.saveReading(
      createReading(cards, false, new Date(), {
        previousReading: currentState.history[0] || null,
        question: uiState.rawQuestion,
        questionRoute,
      }),
    );
    setScene(SCENES.RESULT);
    renderer.animateDeck();
    audio.sync({ enabled: currentState.soundEnabled, scene: SCENES.RESULT });
    window.setTimeout(function playSingleReveal() {
      audio.playReveal(currentState.soundEnabled);
    }, 380);
    resetViewport(SCENES.RESULT);
    return;
  }

  if (mode === "deep-reading") {
    store.unlockCurrentReadingDepth();
    setScene(SCENES.RESULT);
    renderApp();
    resetViewport(SCENES.RESULT);
    return;
  }

  if (mode === "spread-3" || mode === "spread-5") {
    const count = mode === "spread-3" ? 3 : 5;
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    const spreadCards = createSpread(cards, count, {
      previousReading: currentState.history[0] || null,
      currentReading: currentState.currentReading,
      previousSpread: currentState.lastSpread,
      question: uiState.rawQuestion,
      questionRoute,
    });
    const oracleReading = buildLocalOracleReading(count === 3 ? "deepening" : "oracle_reading", spreadCards, {
      question: uiState.rawQuestion,
      questionRoute,
    });
    store.saveSpread(spreadCards, oracleReading);
    setScene(SCENES.SPREAD);
    audio.sync({ enabled: currentState.soundEnabled, scene: SCENES.SPREAD });
    playSpreadSequence(audio, currentState.soundEnabled, count);
    resetViewport(SCENES.SPREAD);
    return;
  }

  renderApp();
}

export function createInitialUIState(state) {
  return {
    activeScene: SCENES.COVER,
    continuationOffer: null,
    currentQuestion: "",
    profileReturnScene: getReturnScene(null, state),
    rawQuestion: "",
    onboardingReturn: SCENES.COVER,
    transitioning: false,
  };
}
