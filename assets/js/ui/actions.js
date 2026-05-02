import { createReading, createSpread } from "../cards/reading.js";
import { buildLocalOracleReading } from "../cards/oracle-local.js";
import { detectQuestionRoute } from "../cards/question-routing.js";
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
        const currentState = store.getState();
        uiState.entered = true;
        uiState.forceDeck = true;
        uiState.hasDrawnThisSession = false;
        uiState.overlay = currentState.onboardingSeen ? "none" : "onboarding";
        renderApp();
        audio.sync({
          allowInit: true,
          enabled: store.getState().soundEnabled,
          scene: currentState.onboardingSeen ? "deck" : "onboarding",
        });
        window.setTimeout(function scrollAfterEntry() {
          renderer.scrollTo(currentState.onboardingSeen ? "deck" : "onboarding");
        }, 80);
      });
      return;
    }

    if (action === "enter-ritual") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function continueToDeck() {
        store.markOnboardingSeen();
        uiState.forceDeck = true;
        uiState.hasDrawnThisSession = false;
        uiState.overlay = "none";
        uiState.contentPanel = "deck";
        renderApp();
        audio.sync({
          enabled: store.getState().soundEnabled,
          scene: "deck",
        });
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
      uiState.forceDeck = false;
      uiState.hasDrawnThisSession = true;
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
        uiState.forceDeck = true;
        uiState.overlay = "none";
        renderApp();
        audio.sync({ enabled: store.getState().soundEnabled, scene: "deck" });
        renderer.scrollTo("deck");
      });
      return;
    }

    if (action === "new-question") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function backToDeck() {
        uiState.hasDrawnThisSession = false;
        uiState.forceDeck = true;
        uiState.currentQuestion = "";
        uiState.rawQuestion = "";
        uiState.overlay = "none";
        uiState.continuationOffer = null;
        renderApp();
        audio.sync({ enabled: store.getState().soundEnabled, scene: "deck" });
        renderer.scrollTo("deck");
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
      const shareCard = document.querySelector(".share-card");
      if (!shareCard) return;

      if (typeof window.html2canvas !== "function") {
        if (navigator.share) {
          navigator.share({
            title: "WYRD — оракул духов леса",
            url: "https://yukisakura13.github.io/WYRD/",
          }).catch(function() {});
        }
        return;
      }

      window.html2canvas(shareCard, {
        backgroundColor: "#1a1810",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      }).then(function(canvas) {
        canvas.toBlob(function(blob) {
          if (!blob) return;
          const file = new File([blob], "wyrd-card.png", { type: "image/png" });
          if (navigator.share && navigator.canShare({ files: [file] })) {
            navigator.share({
              files: [file],
              title: "WYRD — оракул духов леса",
              url: "https://yukisakura13.github.io/WYRD/",
            }).catch(function() {});
          } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "wyrd-card.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      });
      return;
    }

    if (action === "extra-draw" || action === "deep-reading" || action === "spread-3" || action === "spread-5") {
      audio.playSelect(store.getState().soundEnabled);
      startRitual(action);
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

    if (action === "replay-onboarding") {
      audio.playSelect(store.getState().soundEnabled);
      store.resetOnboardingSeen();
      uiState.forceDeck = false;
      uiState.hasDrawnThisSession = false;
      uiState.overlay = "onboarding";
      renderApp();
      audio.sync({ enabled: store.getState().soundEnabled, scene: "onboarding" });
      renderer.scrollTo("onboarding");
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
      uiState.forceDeck = false;
      uiState.hasDrawnThisSession = false;
      uiState.overlay = "none";
      uiState.continuationOffer = null;
      renderApp();
    }
  };

  function startRitual(mode) {
    uiState.forceDeck = false;
    uiState.overlay = "none";
    uiState.continuationOffer = null;
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
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    uiState.currentQuestion = questionRoute.displayQuestion || "";

    store.saveReading(
      createReading(cards, false, new Date(), {
        previousReading: currentState.history[0] || null,
        question: uiState.rawQuestion,
        questionRoute,
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
    hasDrawnThisSession: false,
    overlay: "none",
    continuationOffer: null,
    currentQuestion: "",
    rawQuestion: "",
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
