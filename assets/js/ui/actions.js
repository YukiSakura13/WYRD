import { createReading, createSpread } from "../cards/reading.js";
import { buildLocalOracleReading } from "../cards/oracle-local.js";
import { ARCHETYPE_POSITIONS, detectArchetype, detectQuestionRoute } from "../cards/question-routing.js";
import { createTransitionRunner, getAudioScene, getReturnScene, playSpreadSequence, resetViewport } from "./flow.js";
import { SCENES } from "./scenes.js";
import { closeSaveScreen, saveCurrentCard, shareCurrentCard } from "./share.js";

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
      updatePressedSoundControl(trigger, nextState.soundEnabled);
      audio.sync({ enabled: nextState.soundEnabled, scene: getAudioScene(uiState.activeScene) });
      renderApp();
      return;
    }

    if (action === "open-history-entry") {
      const traceId = trigger.dataset.traceId;
      if (!traceId) {
        return;
      }
      audio.playSelect(store.getState().soundEnabled);
      uiState.activeHistoryTraceId = traceId;
      uiState.historyReturnTraceId = traceId;
      renderApp();
      return;
    }

    if (action === "close-history-entry") {
      closeHistoryEntry(uiState, renderApp);
      return;
    }

    if (action === "draw") {
      // Save raw question for routing and a display question for the result screen.
      syncQuestionFromInput(uiState);
      startRitual("free");
      return;
    }

    if (action === "hook-open-path") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.pinCurrentReadingForSpread = true;
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

    if (action === "ritual-back") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToPreviousRitualLayer() {
        const nextState = store.goBackRitualLayer();

        if (nextState.currentReading) {
          setScene(SCENES.RESULT);
          audio.sync({ enabled: nextState.soundEnabled, scene: SCENES.RESULT });
          renderer.scrollTo(SCENES.RESULT);
          return;
        }

        if (nextState.lastSpread.length) {
          setScene(SCENES.SPREAD);
          audio.sync({ enabled: nextState.soundEnabled, scene: SCENES.SPREAD });
          renderer.scrollTo(SCENES.SPREAD);
          return;
        }

        setScene(SCENES.DECK);
        audio.sync({ enabled: nextState.soundEnabled, scene: SCENES.DECK });
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
        uiState.recentCardNames = [];
        store.clearCurrentRitual();
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

    if (action === "save-card") {
      saveCurrentCard(store);
      return;
    }

    if (action === "close-save-screen") {
      closeSaveScreen();
      return;
    }

    if (action === "extra-draw" || action === "deep-reading" || action === "spread-3" || action === "spread-5") {
      audio.playSelect(store.getState().soundEnabled);
      if (action === "extra-draw" || action === "spread-3" || action === "spread-5") {
        syncQuestionFromInput(uiState);
      }
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

function updatePressedSoundControl(trigger, soundEnabled) {
  const isMuted = !soundEnabled;
  trigger.classList.toggle("sound-off", isMuted);
  trigger.setAttribute("aria-pressed", isMuted ? "true" : "false");
  trigger.setAttribute("aria-label", isMuted ? "Звук выключен" : "Звук включён");
  trigger.dataset.soundState = isMuted ? "off" : "on";

  const label = trigger.querySelector("#cover-sound-label");
  if (label) {
    label.textContent = isMuted ? "Без звука" : "Звук";
  }
}

export function resolveRitual(deps, mode) {
  const { audio, cards, renderApp, renderer, setScene, store, uiState } = deps;
  const currentState = store.getState();

  uiState.continuationOffer = null;
  audio.playRustle(currentState.soundEnabled);

  if (mode === "free") {
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    uiState.currentQuestion = uiState.rawQuestion;
    const reading = createReading(cards, true, new Date(), {
      previousReading: getPreviousTraceReading(currentState, cards),
      question: uiState.rawQuestion,
      questionRoute,
      recentCardNames: uiState.recentCardNames,
    });
    rememberRecentCards(uiState, [reading.card]);

    store.markDailyFreeUsed(new Date().toISOString());
    store.saveReading(reading, {
      date: reading.createdAt,
      message: reading.card.message,
      question: uiState.currentQuestion,
    });
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
    uiState.currentQuestion = uiState.rawQuestion;
    const reading = createReading(cards, false, new Date(), {
      previousReading: getPreviousTraceReading(currentState, cards),
      question: uiState.rawQuestion,
      questionRoute,
      recentCardNames: uiState.recentCardNames,
    });
    rememberRecentCards(uiState, [reading.card]);

    store.saveReading(reading, {
      saveDailyTrace: false,
    });
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
    const shouldPinCurrentReading = uiState.pinCurrentReadingForSpread === true;
    uiState.pinCurrentReadingForSpread = false;
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    const archetype = detectArchetype(uiState.rawQuestion);
    const positions = getArchetypePositions(archetype, count);
    const spreadCards = applyArchetypePositionLabels(
      createSpread(cards, count, {
        previousReading: shouldPinCurrentReading ? getPreviousTraceReading(currentState, cards) : null,
        currentReading: shouldPinCurrentReading ? currentState.currentReading : null,
        previousSpread: currentState.lastSpread,
        question: uiState.rawQuestion,
        questionRoute,
        recentCardNames: uiState.recentCardNames,
      }),
      positions,
    );
    rememberRecentCards(uiState, spreadCards);
    const oracleReading = buildLocalOracleReading(count === 3 ? "deepening" : "oracle_reading", spreadCards, {
      archetype,
      positions,
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
    activeHistoryTraceId: null,
    historyReturnTraceId: null,
    pinCurrentReadingForSpread: false,
    recentCardNames: [],
    transitioning: false,
  };
}

function syncQuestionFromInput(uiState) {
  const questionEl = document.getElementById("question-input");

  if (!questionEl) {
    return;
  }

  uiState.rawQuestion = questionEl.value.trim();
  uiState.currentQuestion = uiState.rawQuestion;
}

export function createKeyboardHandler(deps) {
  const { renderApp, uiState } = deps;

  return function onKeyDown(event) {
    const trigger = event.target.closest?.("[data-action='open-history-entry']");
    if (trigger && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      trigger.click();
      return;
    }

    if (event.key === "Escape" && uiState.activeHistoryTraceId) {
      event.preventDefault();
      closeHistoryEntry(uiState, renderApp);
    }
  };
}

function getArchetypePositions(archetype, cardCount) {
  const spreadSize = cardCount === 3 ? "spread3" : cardCount === 5 ? "spread5" : null;

  return spreadSize ? ARCHETYPE_POSITIONS[archetype]?.[spreadSize] || ARCHETYPE_POSITIONS.A[spreadSize] : null;
}

function applyArchetypePositionLabels(spreadCards, positions) {
  if (!Array.isArray(spreadCards) || !Array.isArray(positions)) {
    return spreadCards;
  }

  return spreadCards.map(function mapSpreadPosition(card) {
    const position = positions[Math.max(Number(card.slot || 1) - 1, 0)];

    if (!position) {
      return card;
    }

    return {
      ...card,
      spreadPositionId: position.id,
      spreadLabel: position.label,
    };
  });
}

function rememberRecentCards(uiState, cards) {
  const cardNames = (Array.isArray(cards) ? cards : [])
    .map(function mapCardName(card) {
      return card?.name;
    })
    .filter(Boolean);

  uiState.recentCardNames = [...cardNames, ...(uiState.recentCardNames || [])].slice(0, 7);
}

function getPreviousTraceReading(state, cards) {
  const trace = Array.isArray(state.history) ? state.history[0] : null;
  const card = trace ? cards.find((candidate) => candidate.id === trace.cardId) : null;

  return card ? { card } : state.currentReading || null;
}

function closeHistoryEntry(uiState, renderApp) {
  const returnTraceId = uiState.historyReturnTraceId;
  uiState.activeHistoryTraceId = null;
  renderApp();

  if (!returnTraceId) {
    return;
  }

  window.requestAnimationFrame(function restoreHistoryFocus() {
    document.querySelector(`[data-trace-id="${returnTraceId}"]`)?.focus();
  });
}
