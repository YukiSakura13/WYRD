import { SCENES } from "./scenes.js";
import { createSpreadRenderer } from "./render-spread.js";
import { DEEP_READING_TEXT, getCardImage } from "./render-helpers.js";

export function getElements(doc = document) {
  return {
    body: doc.body,
    cover: doc.getElementById("cover"),
    coverArt: doc.getElementById("cover-art"),
    coverSoundButton: doc.getElementById("cover-sound-btn"),
    main: doc.getElementById("main"),
    transitionVeil: doc.getElementById("transition-veil"),
    onboardingSection: doc.getElementById("ritual-onboarding"),
    deckWrap: doc.getElementById("deck-wrap"),
    resultQuestion: doc.getElementById("result-question"),
    resultSection: doc.getElementById("result"),
    spreadResultSection: doc.getElementById("spread-result"),
    profileSection: doc.getElementById("profile"),
    cardBox: doc.getElementById("card-box"),
    cardImage: doc.getElementById("card-image"),
    cardKeyword: doc.getElementById("card-keyword"),
    cardName: doc.getElementById("card-name"),
    cardSubtitle: doc.getElementById("card-subtitle"),
    cardMessage: doc.getElementById("card-message"),
    cardShadowWrap: doc.getElementById("card-shadow-wrap"),
    cardShadow: doc.getElementById("card-shadow"),
    deepWrap: doc.getElementById("deep-wrap"),
    deepMessage: doc.getElementById("deep-message"),
    hookBlock: doc.getElementById("hook-block"),
    actionsPanel: doc.querySelector(".actions-panel"),
    deckTop: doc.querySelector(".deck-card-face"),
    soundButton: doc.querySelector('.top-actions [data-action="toggle-sound"]'),
    profileName: doc.getElementById("profile-name"),
    profileMeta: doc.getElementById("profile-meta"),
    historyList: doc.getElementById("history-list"),
    spreadGrid: doc.getElementById("spread-grid"),
    spreadTitle: doc.getElementById("spread-title"),
    spreadStageNote: doc.getElementById("spread-stage-note"),
    spreadDetail: doc.getElementById("spread-detail"),
    spreadDetailRole: doc.getElementById("spread-detail-role"),
    spreadDetailImage: doc.getElementById("spread-detail-image"),
    spreadDetailKeyword: doc.getElementById("spread-detail-keyword"),
    spreadDetailName: doc.getElementById("spread-detail-name"),
    spreadDetailSubtitle: doc.getElementById("spread-detail-subtitle"),
    spreadDetailMessage: doc.getElementById("spread-detail-message"),
    spreadDetailShadow: doc.getElementById("spread-detail-shadow"),
    spreadContinuation: doc.getElementById("spread-continuation"),
    oracleVoice: doc.getElementById("oracle-voice"),
    oracleVoiceMessage: doc.getElementById("oracle-voice-message"),
  };
}

export function createRenderer(elements) {
  let readingRevealTimers = [];
  let lastReadingId = null;
  const spreadRenderer = createSpreadRenderer(elements);

  function render(state, uiState) {
    renderShell(uiState);
    renderProfile(state);
    renderCurrentReading(state.currentReading, uiState.currentQuestion);
    renderHook(state, uiState);
    spreadRenderer.renderSpread(state.lastSpread);
    spreadRenderer.renderOracleVoice(state.lastSpread, state.lastOracleReading);
    spreadRenderer.renderSpreadContinuation(state.lastSpread, uiState);
    spreadRenderer.renderHistory(state.history);
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

    elements.cover.classList.toggle("gone", !isCoverScene);
    elements.transitionVeil.classList.toggle("is-active", Boolean(uiState.transitioning));
    elements.main.classList.toggle("on", !isCoverScene);
    elements.body.dataset.scene = uiState.activeScene;
  }

  function renderProfile(state) {
    if (elements.soundButton) {
      elements.soundButton.textContent = state.soundEnabled ? "Звук леса: вкл" : "Звук леса: выкл";
    }
    if (elements.coverSoundButton) {
      elements.coverSoundButton.classList.toggle("sound-off", !state.soundEnabled);
    }
    elements.profileName.textContent = state.profileName;
    elements.profileMeta.textContent = state.dailyFreeUsedAt
      ? "Сегодняшняя бесплатная карта уже раскрыта."
      : "Бесплатная карта ещё не раскрыта.";
  }

  function renderCurrentReading(reading, question) {
    if (!reading) {
      lastReadingId = null;
      resetReadingReveal();
      if (elements.resultQuestion) {
        elements.resultQuestion.hidden = true;
        elements.resultQuestion.textContent = "";
      }
      return;
    }

    // Show question if provided
    if (elements.resultQuestion) {
      if (question) {
        elements.resultQuestion.textContent = question;
        elements.resultQuestion.hidden = false;
      } else {
        elements.resultQuestion.hidden = true;
      }
    }

    const hasImage = Boolean(reading.card.image);
    elements.cardImage.src = getCardImage(reading.card);
    elements.cardImage.alt = reading.card.name;
    elements.cardImage.classList.toggle("is-empty", !hasImage);
    elements.cardKeyword.textContent = `✦ ${reading.card.keyword} ✦`;
    elements.cardName.textContent = reading.card.name;
    elements.cardSubtitle.textContent = reading.card.subtitle;
    elements.cardMessage.textContent = reading.card.message;
    elements.cardShadow.textContent = reading.card.shadow;

    if (reading.depthUnlocked) {
      elements.deepWrap.hidden = false;
      elements.deepMessage.textContent = DEEP_READING_TEXT.replace("%CARD_NAME%", reading.card.name);
      if (reading.id === lastReadingId) {
        window.setTimeout(function revealDeepImmediately() {
          elements.deepWrap?.classList.add("is-visible");
        }, 120);
      }
    } else {
      elements.deepWrap.hidden = true;
      elements.deepMessage.textContent = "";
    }

    if (reading.id !== lastReadingId) {
      lastReadingId = reading.id;
      startReadingReveal();
    }
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
    elements.deepWrap?.classList.remove("is-visible");
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
    if (!elements.deepWrap?.hidden) {
      readingRevealTimers.push(
        window.setTimeout(function revealDeep() {
          elements.deepWrap?.classList.add("is-visible");
        }, 1320),
      );
    }
  }
}
