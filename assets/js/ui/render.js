import { SCENES } from "./scenes.js";
import { CARDS } from "../data/cards.js";
import { createSpreadRenderer } from "./render-spread.js";
import { getCardImage } from "./render-helpers.js";
import { createMoonIcon, formatTraceDate, getMoonPhase } from "./moon.js";
import { primeShareCard } from "./share.js";

export function getElements(doc = document) {
  return {
    body: doc.body,
    cover: doc.getElementById("cover"),
    coverArt: doc.getElementById("cover-art"),
    coverSoundButton: doc.getElementById("cover-sound-btn"),
    coverSoundLabel: doc.getElementById("cover-sound-label"),
    coverBreathNodes: Array.from(doc.querySelectorAll(".cover-cta-button")),
    main: doc.getElementById("main"),
    transitionVeil: doc.getElementById("transition-veil"),
    onboardingSection: doc.getElementById("ritual-onboarding"),
    deckWrap: doc.getElementById("deck-wrap"),
    resultQuestion: doc.getElementById("result-question"),
    resultQuestionLabel: doc.getElementById("result-question-label"),
    resultQuestionText: doc.getElementById("result-question-text"),
    resultSection: doc.getElementById("result"),
    spreadResultSection: doc.getElementById("spread-result"),
    profileSection: doc.getElementById("profile"),
    cardBox: doc.getElementById("share-card"),
    cardMedia: doc.querySelector("#share-card .share-card-media"),
    cardImage: doc.getElementById("card-image"),
    cardName: doc.getElementById("card-name"),
    cardMessage: doc.getElementById("card-message"),
    cardShadowWrap: doc.getElementById("card-shadow-wrap"),
    cardShadow: doc.getElementById("card-shadow"),
    hookBlock: doc.getElementById("hook-block"),
    shareButton: doc.querySelector('#result [data-action="share-card"]'),
    shareButtonLabel: doc.getElementById("share-button-label"),
    shareFeedback: doc.getElementById("share-feedback"),
    actionsPanel: doc.querySelector(".actions-panel"),
    deckTop: doc.querySelector(".deck-card-face"),
    soundButton: doc.querySelector('.top-actions [data-action="toggle-sound"]'),
    profileName: doc.getElementById("profile-name"),
    profileMeta: doc.getElementById("profile-meta"),
    profileTodaySection: doc.getElementById("profile-today-section"),
    historyEmptyState: doc.getElementById("history-empty-state"),
    historyPreviousHeading: doc.getElementById("history-previous-heading"),
    profileTodayCard: doc.getElementById("profile-today-card"),
    profileDeckAction: doc.getElementById("profile-deck-action"),
    profileTodayImage: doc.getElementById("profile-today-image"),
    profileTodayKicker: doc.getElementById("profile-today-kicker"),
    profileTodayTitle: doc.getElementById("profile-today-title"),
    profileTodayMessage: doc.getElementById("profile-today-message"),
    historyList: doc.getElementById("history-list"),
    historySheetBackdrop: doc.getElementById("history-sheet-backdrop"),
    historySheet: doc.getElementById("history-sheet"),
    historySheetClose: doc.querySelector("#history-sheet [data-action='close-history-entry']"),
    historySheetQuestion: doc.getElementById("history-sheet-question"),
    historySheetQuestionText: doc.getElementById("history-sheet-question-text"),
    historySheetImage: doc.getElementById("history-sheet-image"),
    historySheetTitle: doc.getElementById("history-sheet-title"),
    historySheetMessage: doc.getElementById("history-sheet-message"),
    historySheetShadow: doc.getElementById("history-sheet-shadow"),
    historySheetShadowText: doc.getElementById("history-sheet-shadow-text"),
    historySheetFooter: doc.getElementById("history-sheet-footer"),
    spreadGrid: doc.getElementById("spread-grid"),
    spreadQuestion: doc.getElementById("spread-question"),
    spreadQuestionLabel: doc.getElementById("spread-question-label"),
    spreadQuestionText: doc.getElementById("spread-question-text"),
    spreadDetail: doc.getElementById("spread-detail"),
    spreadDetailRole: doc.getElementById("spread-detail-role"),
    spreadDetailImage: doc.getElementById("spread-detail-image"),
    spreadDetailKeyword: doc.getElementById("spread-detail-keyword"),
    spreadDetailName: doc.getElementById("spread-detail-name"),
    spreadDetailSubtitle: doc.getElementById("spread-detail-subtitle"),
    spreadDetailMessage: doc.getElementById("spread-detail-message"),
    spreadDetailShadow: doc.getElementById("spread-detail-shadow"),
    spreadModal: doc.getElementById("spread-card-modal"),
    spreadModalBackdrop: doc.getElementById("spread-card-modal-backdrop"),
    spreadModalPanel: doc.getElementById("spread-card-modal-panel"),
    spreadModalClose: doc.getElementById("spread-card-modal-close"),
    spreadModalImage: doc.getElementById("spread-modal-image"),
    spreadModalRole: doc.getElementById("spread-modal-role"),
    spreadModalKeyword: doc.getElementById("spread-modal-keyword"),
    spreadModalName: doc.getElementById("spread-modal-name"),
    spreadModalSubtitle: doc.getElementById("spread-modal-subtitle"),
    spreadModalMessage: doc.getElementById("spread-modal-message"),
    spreadModalShadow: doc.getElementById("spread-modal-shadow"),
    spreadContinuation: doc.getElementById("spread-continuation"),
    oracleVoice: doc.getElementById("oracle-voice"),
    oracleVoiceMessage: doc.getElementById("oracle-voice-message"),
  };
}

export function createRenderer(elements) {
  let readingRevealTimers = [];
  let lastReadingId = null;
  let previousScene = null;
  const spreadRenderer = createSpreadRenderer(elements);
  const cardsById = new Map(CARDS.map((card) => [card.id, card]));

  function render(state, uiState) {
    renderShell(uiState);
    renderProfile(state);
    renderCurrentReading(state.currentReading, uiState.currentQuestion);
    renderHook(state, uiState);
    spreadRenderer.renderSpread(state.lastSpread, state.lastOracleReading, uiState.currentQuestion);
    spreadRenderer.renderOracleVoice(state.lastSpread, state.lastOracleReading);
    spreadRenderer.renderSpreadContinuation(state.lastSpread, uiState);
    const historyView = getHistoryView(state);
    spreadRenderer.renderHistory(historyView.previous);
    renderHistorySheet(state, uiState);
    renderContinuation(uiState.continuationOffer);
    renderVisibility(state, uiState);
  }

  function scrollTo(name) {
    const targetMap = {
      deck: elements.deckWrap,
      profile: elements.profileSection,
      onboarding: elements.onboardingSection,
      result: elements.resultSection,
      spread: elements.spreadResultSection,
    };

    const target = targetMap[name];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function animateDeck() {
    if (!elements.deckTop) {
      return;
    }

    elements.deckTop.style.transition = "transform .5s ease, opacity .5s ease";
    elements.deckTop.style.transform = "translateY(-50px) rotate(12deg)";
    elements.deckTop.style.opacity = "0";

    window.setTimeout(function () {
      elements.deckTop.style.transform = "";
      elements.deckTop.style.opacity = "1";
    }, 800);
  }

  return {
    animateDeck,
    render,
    scrollTo,
  };

  function renderShell(uiState) {
    const isCoverScene = uiState.activeScene === SCENES.COVER;

    elements.cover.hidden = !isCoverScene;
    elements.cover.setAttribute("aria-hidden", String(!isCoverScene));
    elements.cover.classList.toggle("gone", !isCoverScene);
    elements.transitionVeil.classList.toggle("is-active", Boolean(uiState.transitioning));
    elements.main.classList.toggle("on", !isCoverScene);
    elements.body.dataset.scene = uiState.activeScene;
    if (isCoverScene && previousScene !== SCENES.COVER) {
      resetCoverBreathAnimations();
    }
    previousScene = uiState.activeScene;
  }

  function renderProfile(state) {
    if (elements.soundButton) {
      elements.soundButton.textContent = state.soundEnabled ? "Звук леса: вкл" : "Звук леса: выкл";
      elements.soundButton.setAttribute("aria-pressed", String(state.soundEnabled));
    }
    if (elements.coverSoundButton) {
      updateCoverSoundButton(!state.soundEnabled);
    }
    const historyView = getHistoryView(state);
    const todayReading = historyView.today;
    const hasAnyTrace = state.history.length > 0;

    elements.historyEmptyState.hidden = hasAnyTrace;
    elements.profileTodaySection.hidden = !hasAnyTrace;
    elements.historyPreviousHeading.hidden = historyView.previous.length === 0;
    elements.profileMeta.textContent = "Первый след сегодня ещё не оставлен.";
    elements.profileMeta.hidden = Boolean(todayReading);
    elements.profileDeckAction.hidden = Boolean(todayReading);

    if (!elements.profileTodayCard) {
      return;
    }

    elements.profileTodayCard.dataset.traceId = todayReading ? todayReading.id : "";
    elements.profileTodayCard.hidden = !todayReading;

    if (!todayReading) {
      return;
    }

    renderTraceCard(elements, todayReading);
  }

  function getHistoryView(state) {
    const todayKey = getLocalDayKey(new Date());
    const traces = state.history.map(hydrateTrace).filter(Boolean);
    const today = traces.find((entry) => entry.dayKey === todayKey) || null;

    return {
      today,
      previous: traces.filter((entry) => entry.dayKey !== todayKey),
    };
  }

  function hydrateTrace(trace) {
    const card = cardsById.get(trace.cardId);
    if (!card) {
      return null;
    }

    return {
      ...trace,
      card,
    };
  }

  function getLocalDayKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function renderTraceCard(targets, trace) {
    const card = trace.card;
    const hasImage = Boolean(card.image);
    targets.profileTodayImage.src = getCardImage(card);
    targets.profileTodayImage.alt = card.name;
    targets.profileTodayImage.classList.toggle("is-empty", !hasImage);
    targets.profileTodayKicker.textContent = card.keyword;
    targets.profileTodayTitle.textContent = card.name;
    targets.profileTodayMessage.textContent = trace.question || card.message;
  }

  function renderHistorySheet(state, uiState) {
    const trace = state.history.map(hydrateTrace).find((entry) => entry.id === uiState.activeHistoryTraceId) || null;
    const isOpen = Boolean(trace);

    elements.historySheet.hidden = !isOpen;
    elements.historySheetBackdrop.hidden = !isOpen;
    elements.historySheet.classList.toggle("is-open", isOpen);
    elements.historySheetBackdrop.classList.toggle("is-open", isOpen);

    if (!isOpen) {
      return;
    }

    const card = trace.card;
    const date = new Date(trace.date);
    const moon = getMoonPhase(date);
    elements.historySheetQuestion.hidden = !trace.question;
    elements.historySheetQuestionText.textContent = trace.question;
    elements.historySheetImage.src = getCardImage(card);
    elements.historySheetImage.alt = card.name;
    elements.historySheetImage.classList.toggle("is-empty", !card.image);
    elements.historySheetTitle.textContent = card.name;
    elements.historySheetMessage.textContent = trace.message || card.message;
    elements.historySheetShadow.hidden = !card.shadow;
    elements.historySheetShadowText.textContent = card.shadow || "";
    elements.historySheetFooter.replaceChildren();
    elements.historySheetFooter.append(createMoonIcon(moon.type), document.createTextNode(`${formatTraceDate(date)} · ${moon.name}`));

    window.requestAnimationFrame(function focusSheetClose() {
      elements.historySheetClose?.focus();
    });
  }

  function renderCurrentReading(reading, question) {
    if (!reading) {
      lastReadingId = null;
      resetReadingReveal();
      renderQuestionText("");
      resetShareFeedback();
      return;
    }

    renderQuestionText(question);
    resetShareFeedback();

    const hasImage = Boolean(reading.card.image);
    elements.cardImage.src = getCardImage(reading.card);
    elements.cardImage.alt = reading.card.name;
    elements.cardImage.classList.toggle("is-empty", !hasImage);
    elements.cardName.textContent = reading.card.name;
    elements.cardMessage.textContent = reading.card.message;
    elements.cardShadow.textContent = reading.card.shadow;
    updateCopyDensity(elements.cardMessage, {
      compactClass: "is-compact",
      condensedClass: "is-condensed",
    });
    updateCopyDensity(elements.cardShadow, {
      condensedClass: "is-condensed-shadow",
    });

    if (reading.id !== lastReadingId) {
      lastReadingId = reading.id;
      startReadingReveal();
    }

    window.setTimeout(function warmShareCard() {
      primeShareCard(reading);
    }, 120);
  }

  function renderHook(state, uiState) {
    if (!elements.hookBlock) {
      return;
    }

    const shouldShowHook =
      uiState.activeScene === SCENES.RESULT &&
      Boolean(state.currentReading && state.currentReading.free) &&
      !state.lastSpread.length;

    elements.hookBlock.hidden = !shouldShowHook;
    if (elements.actionsPanel) {
      elements.actionsPanel.hidden = shouldShowHook;
    }
  }

  function renderContinuation(_continuationOffer) {
    // Free beta launch — no-op
  }

  function renderVisibility(state, uiState) {
    const scene = uiState.activeScene;
    const isOnboarding = scene === SCENES.ONBOARDING;

    elements.profileSection.hidden = scene !== SCENES.PROFILE;
    elements.onboardingSection.hidden = !isOnboarding;
    elements.onboardingSection.classList.toggle("is-visible", isOnboarding);
    elements.deckWrap.hidden = scene !== SCENES.DECK;
    elements.resultSection.hidden = scene !== SCENES.RESULT;
    elements.spreadResultSection.hidden = scene !== SCENES.SPREAD;
  }

  function resetReadingReveal() {
    readingRevealTimers.forEach(function clearTimer(timerId) {
      window.clearTimeout(timerId);
    });
    readingRevealTimers = [];
    elements.cardBox?.classList.remove("is-visible");
    elements.cardMessage?.classList.remove("is-visible");
    elements.cardShadowWrap?.classList.remove("is-visible");
  }

  function startReadingReveal() {
    resetReadingReveal();
    readingRevealTimers.push(
      window.setTimeout(function revealCard() {
        elements.cardBox?.classList.add("is-visible");
      }, 40),
    );
    readingRevealTimers.push(
      window.setTimeout(function revealMessage() {
        elements.cardMessage?.classList.add("is-visible");
      }, 420),
    );
    readingRevealTimers.push(
      window.setTimeout(function revealShadow() {
        elements.cardShadowWrap?.classList.add("is-visible");
      }, 980),
    );
  }

  function renderQuestionText(question) {
    if (!elements.resultQuestionText || !elements.resultQuestionLabel) {
      return;
    }

    if (question) {
      elements.resultQuestionLabel.hidden = false;
      elements.resultQuestionText.textContent = question;
      elements.resultQuestion.classList.remove("is-muted");
      return;
    }

    elements.resultQuestionLabel.hidden = false;
    elements.resultQuestionText.textContent = "Тайна приоткроется сама...";
    elements.resultQuestion.classList.add("is-muted");
  }

  function updateCopyDensity(element, classNames) {
    if (!element) {
      return;
    }

    const { compactClass = "", condensedClass = "" } = classNames;

    if (compactClass) {
      element.classList.remove(compactClass);
    }
    if (condensedClass) {
      element.classList.remove(condensedClass);
    }

    const lineHeight = Number.parseFloat(window.getComputedStyle(element).lineHeight);
    if (!lineHeight) {
      return;
    }

    const lineCount = Math.round(element.scrollHeight / lineHeight);
    if (condensedClass && lineCount > 5) {
      element.classList.add(condensedClass);
      return;
    }

    if (compactClass && lineCount > 3) {
      element.classList.add(compactClass);
    }
  }

  function resetShareFeedback() {
    if (elements.shareFeedback) {
      elements.shareFeedback.hidden = true;
      elements.shareFeedback.textContent = "";
    }

    if (elements.shareButton) {
      elements.shareButton.disabled = false;
      elements.shareButton.classList.remove("is-loading");
    }

    if (elements.shareButtonLabel) {
      elements.shareButtonLabel.textContent = "ПОДЕЛИТЬСЯ КАРТОЙ";
    }
  }

  function updateCoverSoundButton(isMuted) {
    elements.coverSoundButton.classList.toggle("sound-off", isMuted);
    elements.coverSoundButton.setAttribute("aria-pressed", isMuted ? "true" : "false");
    elements.coverSoundButton.setAttribute("aria-label", isMuted ? "Звук выключен" : "Звук включён");
    elements.coverSoundButton.dataset.soundState = isMuted ? "off" : "on";
    if (elements.coverSoundLabel) {
      elements.coverSoundLabel.textContent = isMuted ? "Без звука" : "Звук";
    }
  }

  function resetCoverBreathAnimations() {
    elements.coverBreathNodes.forEach(function resetAnimation(node) {
      if (!node) {
        return;
      }
      node.style.animation = "none";
      node.offsetHeight;
      node.style.animation = "";
    });
  }
}
