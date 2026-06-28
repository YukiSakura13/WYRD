import { createReading, createSpread } from "../cards/reading.js";
import { buildLocalOracleReading } from "../cards/oracle-local.js";
import { SPIRIT_BOOK_PAGES } from "../data/spirit-book.js";
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
        if (!store.getState().onboardingSeen) {
          uiState.onboardingReturn = SCENES.COVER;
          setScene(SCENES.ONBOARDING);
          audio.sync({
            allowInit: true,
            enabled: store.getState().soundEnabled,
            scene: SCENES.ONBOARDING,
          });
          renderer.scrollTo(SCENES.ONBOARDING);
          return;
        }

        setScene(SCENES.FOREST);
        audio.sync({
          allowInit: true,
          enabled: store.getState().soundEnabled,
          scene: SCENES.FOREST,
        });
        window.setTimeout(function scrollAfterEntry() {
          renderer.scrollTo(SCENES.FOREST);
        }, 80);
      });
      return;
    }

    if (action === "enter-ritual") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function continueToDeck() {
        const nextState = store.markOnboardingSeen();
        if (!nextState.userProfile?.personalizationSeen) {
          uiState.aboutReturnScene = SCENES.FOREST;
          uiState.aboutDraft = { ...nextState.userProfile };
          setScene(SCENES.ABOUT_YOU);
          audio.sync({
            enabled: store.getState().soundEnabled,
            scene: SCENES.ABOUT_YOU,
          });
          renderer.scrollTo(SCENES.ABOUT_YOU);
          return;
        }

        setScene(SCENES.FOREST);
        audio.sync({
          enabled: store.getState().soundEnabled,
          scene: SCENES.FOREST,
        });
        renderer.scrollTo(SCENES.FOREST);
      });
      return;
    }

    if (action === "back-from-onboarding") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function leaveOnboarding() {
        const returnTarget = uiState.onboardingReturn || SCENES.COVER;

        if (returnTarget === SCENES.COVER) {
          setScene(SCENES.COVER);
          audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        setScene(SCENES.FOREST);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
        renderer.scrollTo(SCENES.FOREST);
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

    if (action === "toggle-music") {
      store.toggleMusic();
      renderApp();
      return;
    }

    if (action === "toggle-vibration") {
      store.toggleVibration();
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

    if (action === "open-daily-card") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openDailyCard() {
        setScene(SCENES.DECK);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "open-lunar-day") {
      openForestPlaceholder(SCENES.LUNAR_DAY);
      return;
    }

    if (action === "open-yes-no") {
      openForestPlaceholder(SCENES.YES_NO);
      return;
    }

    if (action === "open-night-images") {
      openForestPlaceholder(SCENES.NIGHT_IMAGES);
      return;
    }

    if (action === "open-spirit-book") {
      uiState.spiritBookPage = 0;
      openForestPlaceholder(SCENES.SPIRIT_BOOK);
      return;
    }

    if (action === "spirit-book-prev") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.spiritBookPage = Math.max(0, (uiState.spiritBookPage || 0) - 1);
      renderApp();
      return;
    }

    if (action === "spirit-book-next") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.spiritBookPage = Math.min(SPIRIT_BOOK_PAGES.length - 1, (uiState.spiritBookPage || 0) + 1);
      renderApp();
      return;
    }

    if (action === "spirit-book-page") {
      const page = Number(trigger.dataset.page);
      if (!Number.isInteger(page)) {
        return;
      }
      audio.playSelect(store.getState().soundEnabled);
      uiState.spiritBookPage = Math.max(0, Math.min(SPIRIT_BOOK_PAGES.length - 1, page));
      renderApp();
      return;
    }

    if (action === "open-settings") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openSettings() {
        setScene(SCENES.SETTINGS);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.SETTINGS });
        renderer.scrollTo(SCENES.SETTINGS);
      });
      return;
    }

    if (action === "open-about-you") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openAboutYou() {
        uiState.aboutReturnScene = SCENES.SETTINGS;
        uiState.aboutDraft = { ...store.getState().userProfile };
        setScene(SCENES.ABOUT_YOU);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.ABOUT_YOU });
        renderer.scrollTo(SCENES.ABOUT_YOU);
      });
      return;
    }

    if (action === "close-about-you") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function closeAboutYou() {
        const returnScene = uiState.aboutReturnScene || SCENES.SETTINGS;
        uiState.aboutDraft = null;
        setScene(returnScene);
        audio.sync({ enabled: store.getState().soundEnabled, scene: getAudioScene(returnScene) });
        renderer.scrollTo(returnScene);
      });
      return;
    }

    if (action === "select-avatar") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.aboutDraft = {
        ...readAboutDraftFromForm(store, uiState),
        avatarId: trigger.dataset.avatarId || "wolf",
      };
      renderApp();
      return;
    }

    if (action === "select-custom-avatar") {
      audio.playSelect(store.getState().soundEnabled);
      const draft = readAboutDraftFromForm(store, uiState);
      if (draft.customAvatar) {
        uiState.aboutDraft = {
          ...draft,
          avatarId: "custom",
        };
        renderApp();
        return;
      }

      document.getElementById("about-avatar-upload")?.click();
      return;
    }

    if (action === "select-pronoun") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.aboutDraft = {
        ...readAboutDraftFromForm(store, uiState),
        pronoun: trigger.dataset.pronoun || "neutral",
      };
      renderApp();
      return;
    }

    if (action === "save-about-you" || action === "skip-about-you") {
      audio.playSelect(store.getState().soundEnabled);
      const nextProfile = action === "skip-about-you"
        ? { ...readAboutDraftFromForm(store, uiState), name: "", zodiac: "" }
        : readAboutDraftFromForm(store, uiState);
      const nextState = store.saveUserProfile(nextProfile);
      uiState.aboutDraft = { ...nextState.userProfile };
      updateAboutStatus(action === "skip-about-you" ? "Можно будет вернуться позже." : "Духи запомнили.");
      window.setTimeout(function returnAfterSave() {
        const returnScene = uiState.aboutReturnScene || SCENES.SETTINGS;
        uiState.aboutDraft = null;
        setScene(returnScene);
        audio.sync({ enabled: store.getState().soundEnabled, scene: getAudioScene(returnScene) });
        renderer.scrollTo(returnScene);
      }, 320);
      return;
    }

    if (action === "open-reminders") {
      openForestPlaceholder(SCENES.REMINDERS);
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

    if (action === "back-to-forest") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToForest() {
        setScene(SCENES.FOREST);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
        renderer.scrollTo(SCENES.FOREST);
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
      revealPendingGiftsAfterAnimation(store, renderApp);
      return;
    }

    if (action === "flip-gift") {
      audio.playSelect(store.getState().soundEnabled);
      trigger.classList.toggle("is-flipped");
      trigger.setAttribute("aria-pressed", String(trigger.classList.contains("is-flipped")));
      return;
    }

    if (action === "replay-onboarding") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.onboardingReturn = uiState.activeScene === SCENES.COVER ? SCENES.COVER : SCENES.FOREST;
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

  function openForestPlaceholder(scene) {
    audio.playSelect(store.getState().soundEnabled);
    runTransition(function showForestPlaceholder() {
      setScene(scene);
      audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
      renderer.scrollTo(scene);
    });
  }
}

export function createChangeHandler(deps) {
  const { renderApp, store, uiState } = deps;

  return function onChange(event) {
    const input = event.target.closest?.("#about-avatar-upload");
    if (!input) {
      return;
    }

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      updateAboutStatus("Не удалось прочитать изображение.");
      input.value = "";
      return;
    }

    createAvatarDataUrl(file)
      .then(function applyAvatar(dataUrl) {
        uiState.aboutDraft = {
          ...readAboutDraftFromForm(store, uiState),
          avatarId: "custom",
          customAvatar: dataUrl,
        };
        input.value = "";
        updateAboutStatus("Облик загружен.");
        renderApp();
      })
      .catch(function handleAvatarError() {
        input.value = "";
        updateAboutStatus("Не удалось прочитать изображение.");
      });
  };
}

function readAboutDraftFromForm(store, uiState) {
  const stateProfile = store.getState().userProfile || {};
  const draft = uiState.aboutDraft || stateProfile;
  const nameInput = document.getElementById("about-name-input");
  const zodiacSelect = document.getElementById("about-zodiac-select");

  return {
    ...stateProfile,
    ...draft,
    name: nameInput ? nameInput.value.replace(/\s+/g, " ").trim().slice(0, 36) : draft.name || "",
    zodiac: zodiacSelect ? zodiacSelect.value : draft.zodiac || "",
  };
}

function updateAboutStatus(message) {
  const status = document.getElementById("about-save-status");
  if (status) {
    status.textContent = message;
  }
}

function createAvatarDataUrl(file) {
  return new Promise(function avatarPromise(resolve, reject) {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = function handleImageLoad() {
      try {
        const size = 512;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const side = Math.min(image.naturalWidth || image.width, image.naturalHeight || image.height);
        const sourceX = ((image.naturalWidth || image.width) - side) / 2;
        const sourceY = ((image.naturalHeight || image.height) - side) / 2;

        canvas.width = size;
        canvas.height = size;
        context.drawImage(image, sourceX, sourceY, side, side, 0, 0, size, size);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/webp", 0.82));
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    image.onerror = function handleImageError() {
      URL.revokeObjectURL(url);
      reject(new Error("Avatar image cannot be loaded"));
    };

    image.src = url;
  });
}

function revealPendingGiftsAfterAnimation(store, renderApp) {
  const previewGiftRevealKey = getPreviewGiftRevealKey();
  const hasPendingGift = store.getState().gifts?.some((gift) => gift.pendingReveal);
  const hasPreviewGiftReveal = Boolean(previewGiftRevealKey && !isPreviewGiftRevealShown(previewGiftRevealKey));

  if (!hasPendingGift && !hasPreviewGiftReveal) {
    return;
  }

  window.setTimeout(function clearPendingGiftReveal() {
    if (previewGiftRevealKey) {
      markPreviewGiftRevealShown(previewGiftRevealKey);
    } else {
      store.revealPendingGifts();
    }
    renderApp();
  }, 5900);
}

function getPreviewGiftRevealKey() {
  try {
    return new URLSearchParams(window.location.search).get("previewGiftReveal") || "";
  } catch (error) {
    return "";
  }
}

function getPreviewGiftRevealSessionKey(giftKey) {
  try {
    const params = new URLSearchParams(window.location.search);
    return `wyrd.previewGiftRevealShown:${giftKey}:${params.get("v") || ""}`;
  } catch (error) {
    return `wyrd.previewGiftRevealShown:${giftKey}`;
  }
}

function isPreviewGiftRevealShown(giftKey) {
  try {
    return window.sessionStorage.getItem(getPreviewGiftRevealSessionKey(giftKey)) === "1";
  } catch (error) {
    return false;
  }
}

function markPreviewGiftRevealShown(giftKey) {
  try {
    window.sessionStorage.setItem(getPreviewGiftRevealSessionKey(giftKey), "1");
  } catch (error) {
    // Preview cleanup should never block the real gift flow.
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
    aboutReturnScene: SCENES.SETTINGS,
    aboutDraft: null,
    rawQuestion: "",
    onboardingReturn: SCENES.COVER,
    activeHistoryTraceId: null,
    historyReturnTraceId: null,
    pinCurrentReadingForSpread: false,
    recentCardNames: [],
    spiritBookPage: 0,
    transitioning: false,
  };
}

export function createDeckQuestionGuidance() {
  let transferTimer = null;
  let questionHeldInHeart = false;

  return {
    connect,
    sync: updateDeckQuestionState,
  };

  function connect() {
    const questionEl = document.getElementById("question-input");
    const deckCard = document.querySelector("[data-action='draw']");

    if (!questionEl || !deckCard) {
      return;
    }

    questionEl.addEventListener("input", function handleQuestionInput() {
      questionHeldInHeart = false;
      updateDeckQuestionState("input");
    });

    questionEl.addEventListener("focus", function handleQuestionFocus() {
      questionHeldInHeart = false;
      updateDeckQuestionState("focus");
    });

    questionEl.addEventListener("blur", function handleQuestionBlur() {
      updateDeckQuestionState("blur");
    });

    questionEl.addEventListener("beforeinput", function handleQuestionLineBreak(event) {
      if (event.inputType !== "insertLineBreak") {
        return;
      }

      event.preventDefault();
      acceptQuestionIntent(questionEl, deckCard);
    });

    questionEl.addEventListener("keydown", function handleQuestionEnter(event) {
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }

      event.preventDefault();
      acceptQuestionIntent(questionEl, deckCard);
    });

    updateDeckQuestionState("init");
  }

  function acceptQuestionIntent(questionEl, deckCard) {
    const hasQuestion = questionEl.value.trim().length > 0;

    questionHeldInHeart = !hasQuestion;
    if (!hasQuestion) {
      questionEl.value = "";
    }

    questionEl.blur();
    updateDeckQuestionState(hasQuestion ? "accept" : "hold");
    transferIntentToDeck(deckCard);
  }

  function updateDeckQuestionState(source) {
    const deckWrap = document.getElementById("deck-wrap");
    const questionEl = document.getElementById("question-input");
    const touchMain = document.getElementById("deck-touch-main");
    const status = document.getElementById("deck-question-status");

    if (!deckWrap || !questionEl) {
      return;
    }

    const hasQuestion = questionEl.value.trim().length > 0;
    const isFocused = document.activeElement === questionEl;
    const isQuestionHeld = questionHeldInHeart && !hasQuestion && !isFocused;
    const isReady = hasQuestion && (!isFocused || source === "accept");
    const isWriting = hasQuestion && isFocused && source !== "accept";
    const isDeckReady = isReady || isQuestionHeld;

    deckWrap.classList.toggle("is-question-empty", !hasQuestion);
    deckWrap.classList.toggle("is-question-writing", isWriting);
    deckWrap.classList.toggle("is-question-ready", isDeckReady);

    if (touchMain) {
      touchMain.textContent = isReady
        ? "✦ коснись колоды, чтобы начать расклад ✦"
        : isQuestionHeld
          ? "✦ коснись колоды, чтобы начать ✦"
          : "✦ коснись колоды ✦";
    }

    if (status) {
      status.textContent = isReady
        ? "Вопрос принят. Теперь коснись колоды."
        : isQuestionHeld
          ? "Вопрос оставлен в сердце. Теперь коснись колоды."
          : hasQuestion
            ? "Когда вопрос готов, нажми Enter или коснись колоды."
            : "Сначала задай вопрос. Потом коснись колоды.";
    }
  }

  function transferIntentToDeck(deckCard) {
    const deckWrap = document.getElementById("deck-wrap");

    if (!deckWrap) {
      return;
    }

    window.clearTimeout(transferTimer);
    deckWrap.classList.add("is-intent-transferred");
    deckCard.focus({ preventScroll: true });

    transferTimer = window.setTimeout(function clearTransferState() {
      deckWrap.classList.remove("is-intent-transferred");
    }, 920);
  }

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
      return;
    }

    if (uiState.activeScene === SCENES.SPIRIT_BOOK) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        uiState.spiritBookPage = Math.max(0, (uiState.spiritBookPage || 0) - 1);
        renderApp();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        uiState.spiritBookPage = Math.min(SPIRIT_BOOK_PAGES.length - 1, (uiState.spiritBookPage || 0) + 1);
        renderApp();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        document.querySelector("#spirit-book [data-action='back-to-forest']")?.click();
      }
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
