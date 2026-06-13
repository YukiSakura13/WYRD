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
    cardMoonMeta: doc.getElementById("card-moon-meta"),
    cardMessage: doc.getElementById("card-message"),
    cardShadowWrap: doc.getElementById("card-shadow-wrap"),
    cardShadow: doc.getElementById("card-shadow"),
    hookBlock: doc.getElementById("hook-block"),
    shareButton: doc.querySelector('#result [data-action="share-card"]'),
    shareButtonLabel: doc.getElementById("share-button-label"),
    saveButton: doc.querySelector('#result [data-action="save-card"]'),
    saveButtonLabel: doc.getElementById("save-button-label"),
    shareFeedback: doc.getElementById("share-feedback"),
    actionsPanel: doc.querySelector(".actions-panel"),
    deckTop: doc.querySelector(".deck-card-face"),
    soundButton: doc.querySelector('.top-actions [data-action="toggle-sound"]'),
    profileName: doc.getElementById("profile-name"),
    historyEmptyState: doc.getElementById("history-empty-state"),
    giftShelf: doc.getElementById("gift-shelf"),
    giftShelfTrack: doc.getElementById("gift-shelf-track"),
    historyGiftReveal: doc.getElementById("history-gift-reveal"),
    historyTrailsHeading: doc.getElementById("history-trails-heading"),
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
  const giftStarPoints = [
    { x: 23, y: 17 },
    { x: 75, y: 14 },
    { x: 18, y: 38 },
    { x: 83, y: 34 },
    { x: 27, y: 61 },
    { x: 72, y: 58 },
    { x: 36, y: 86 },
    { x: 62, y: 78 },
    { x: 79, y: 88 },
  ];

  function render(state, uiState) {
    renderShell(uiState);
    renderProfile(state);
    renderCurrentReading(state.currentReading, uiState.currentQuestion);
    renderHook(state, uiState);
    spreadRenderer.renderSpread(state.lastSpread, state.lastOracleReading, uiState.currentQuestion);
    spreadRenderer.renderOracleVoice(state.lastSpread, state.lastOracleReading);
    spreadRenderer.renderSpreadContinuation(state.lastSpread, uiState);
    const historyView = getHistoryView(state);
    spreadRenderer.renderHistory(historyView.traces);
    renderGifts(getVisibleGifts(state));
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
    elements.historyEmptyState.hidden = state.history.length > 0;
    if (elements.historyTrailsHeading) {
      elements.historyTrailsHeading.hidden = state.history.length === 0;
    }
  }

  function getHistoryView(state) {
    const traces = state.history.map(hydrateTrace).filter(Boolean);

    return {
      traces,
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
    const moon = getStoredMoon(trace, date);
    elements.historySheetQuestion.hidden = !trace.question;
    elements.historySheetQuestionText.textContent = trace.question;
    elements.historySheetImage.src = getCardImage(card);
    elements.historySheetImage.alt = trace.snapshot.cardTitle;
    elements.historySheetImage.classList.toggle("is-empty", !card.image);
    elements.historySheetTitle.textContent = trace.snapshot.cardTitle;
    elements.historySheetMessage.textContent = trace.snapshot.oracleMessage;
    elements.historySheetShadow.hidden = !trace.snapshot.shadowMessage;
    elements.historySheetShadowText.textContent = trace.snapshot.shadowMessage || "";
    elements.historySheetFooter.replaceChildren();
    elements.historySheetFooter.append(createMoonIcon(moon.type), document.createTextNode(`${formatTraceDate(date)} · ${moon.name}`));

    window.requestAnimationFrame(function focusSheetClose() {
      elements.historySheetClose?.focus();
    });
  }

  function renderGifts(gifts) {
    if (!elements.giftShelf || !elements.giftShelfTrack) {
      return;
    }

    elements.giftShelf.hidden = gifts.length === 0;
    elements.giftShelfTrack.classList.toggle("has-one-gift", gifts.length === 1);
    elements.giftShelfTrack.replaceChildren();

    const hasPendingGift = gifts.some((gift) => gift.pendingReveal);
    if (elements.historyGiftReveal) {
      elements.historyGiftReveal.hidden = !hasPendingGift;
      elements.historyGiftReveal.classList.toggle("is-active", hasPendingGift);
    }

    gifts.forEach(function renderGift(gift) {
      const giftMeta = getGiftMeta(gift.giftKey);
      const receivedAt = new Date(gift.receivedAt);
      const card = document.createElement("button");
      card.className = "gift-card";
      card.type = "button";
      card.dataset.action = "flip-gift";
      card.setAttribute("aria-pressed", "false");
      card.setAttribute("aria-label", `Дар ${giftMeta.title}`);
      card.classList.toggle("is-pending-reveal", gift.pendingReveal);

      const inner = document.createElement("span");
      inner.className = "gift-card-inner";

      const front = document.createElement("span");
      front.className = "gift-card-face gift-card-front";
      const symbol = giftMeta.image ? document.createElement("img") : document.createElement("span");
      symbol.className = giftMeta.image ? "gift-image" : "gift-symbol";
      if (giftMeta.image) {
        symbol.src = giftMeta.image;
        symbol.alt = "";
        symbol.loading = "lazy";
        symbol.decoding = "async";
      } else {
        symbol.textContent = giftMeta.symbol;
      }
      front.append(symbol);

      const back = document.createElement("span");
      back.className = "gift-card-face gift-card-back";
      const starField = createGiftStarField();
      const mainStar = createGiftMainStar();
      const backTitle = document.createElement("span");
      backTitle.className = "gift-title gift-title-back";
      backTitle.textContent = giftMeta.title;
      backTitle.style.setProperty("--gift-title-size", `${getGiftTitleSize(giftMeta.title)}rem`);
      const date = document.createElement("span");
      date.className = "gift-date";
      const dateLabel = document.createElement("span");
      dateLabel.className = "gift-date-label";
      dateLabel.textContent = "Обретено";
      const dateValue = document.createElement("span");
      dateValue.className = "gift-date-value";
      dateValue.textContent = formatGiftDate(receivedAt);
      date.append(dateLabel, dateValue);
      back.append(starField, mainStar, backTitle, date);

      inner.append(front, back);
      card.append(inner);
      elements.giftShelfTrack.appendChild(card);
      startGiftTwinkle(back);
    });
  }

  function getVisibleGifts(state) {
    const gifts = Array.isArray(state.gifts) ? state.gifts : [];

    const previewGiftKeys = getPreviewGiftKeys();
    if (gifts.length || previewGiftKeys.length === 0) {
      return gifts;
    }

    return previewGiftKeys.map(function createPreviewGift(giftKey, index) {
      return {
        id: `gift-${giftKey}-preview`,
        receivedAt: new Date(2026, 4, 29 + index, 12, 0, 0).toISOString(),
        giftKey,
        pendingReveal: false,
        schemaVersion: 1,
      };
    });
  }

  function formatGiftDate(date) {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    return `${date.getDate()}\u00a0${months[date.getMonth()]}`;
  }

  function getPreviewGiftKeys() {
    if (!isGiftPreviewEnabled()) {
      return [];
    }

    try {
      const giftParam = new URLSearchParams(window.location.search).get("previewGift");
      if (!giftParam) {
        return [];
      }

      const giftKeys = giftParam
        .split(",")
        .map((value) => normalizeGiftKey(value.trim()))
        .filter(Boolean);

      return Array.from(new Set(giftKeys));
    } catch (error) {
      return [];
    }
  }

  function isGiftPreviewEnabled() {
    if (window.WYRD_ENABLE_GIFT_PREVIEW === true) {
      return true;
    }

    const buildId = document.querySelector('meta[name="wyrd-build"]')?.content || window.WYRD_BUILD_ID || "";
    if (/^(prod|production)$/i.test(buildId)) {
      return false;
    }

    return (
      window.location.protocol === "file:" ||
      ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ||
      /^(dev|staging)$/i.test(buildId)
    );
  }

  function normalizeGiftKey(value) {
    const giftAliases = {
      lunnaya: "moon",
      moon: "moon",
      ammonite: "ammonite",
      ammonitovaya: "ammonite",
      flower: "flower",
      floral: "flower",
      tsvetochnaya: "flower",
      honey: "honey",
      medovaya: "honey",
      night: "night",
      nochnaya: "night",
      forest: "forest",
      lesnaya: "forest",
      crystal: "crystal",
      kristalnaya: "crystal",
      river: "river",
      rechnaya: "river",
      transparent: "transparent",
      prozrachnaya: "transparent",
    };

    return giftAliases[value.toLowerCase()] || null;
  }

  function createGiftStarField() {
    const starField = document.createElement("span");
    starField.className = "gift-star-field";
    starField.setAttribute("aria-hidden", "true");

    giftStarPoints.forEach(function appendStarPoint(point) {
      const star = document.createElement("span");
      star.className = "gift-star-point";
      star.style.setProperty("--x", `${point.x}%`);
      star.style.setProperty("--y", `${point.y}%`);
      starField.appendChild(star);
    });

    return starField;
  }

  function createGiftMainStar() {
    const mainStar = document.createElement("span");
    mainStar.className = "gift-main-star";
    mainStar.setAttribute("aria-hidden", "true");
    return mainStar;
  }

  function getGiftTitleSize(title) {
    const length = Array.from(title || "").length;
    return Math.max(1.36, Math.min(1.86, 2.12 - length * 0.07));
  }

  function startGiftTwinkle(container) {
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const mainStar = container.querySelector(".gift-main-star");
    const starPoints = Array.from(container.querySelectorAll(".gift-star-point"));

    scheduleGiftStarBreath(mainStar);

    starPoints.forEach(function twinkleStarPoint(star, index) {
      window.setTimeout(function startPointTwinkle() {
        scheduleTwinkle(star, {
          min: 0.24,
          max: 0.72,
          delayMin: 3000,
          delayMax: 6000,
        });
      }, index * 260 + Math.random() * 1200);
    });
  }

  function scheduleTwinkle(element, options) {
    if (!element || !document.contains(element)) {
      return;
    }

    const delay = randomBetween(options.delayMin, options.delayMax);
    window.setTimeout(function updateTwinkle() {
      if (!element || !document.contains(element)) {
        return;
      }

      const max = options.rareMax && Math.random() > 0.86 ? options.rareMax : options.max;
      element.style.opacity = randomBetween(options.min, max).toFixed(2);
      scheduleTwinkle(element, options);
    }, delay);
  }

  function scheduleGiftStarBreath(star) {
    if (!star || !document.contains(star)) {
      return;
    }

    const delay = randomBetween(8000, 14000);
    window.setTimeout(function breatheGiftStar() {
      if (!star || !document.contains(star)) {
        return;
      }

      star.classList.add("is-lit");
      window.setTimeout(function dimGiftStar() {
        star.classList.remove("is-lit");
        scheduleGiftStarBreath(star);
      }, randomBetween(2200, 3200));
    }, delay);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function getStoredMoon(trace, fallbackDate) {
    const moon = trace.moonPhase ? getMoonByType(trace.moonPhase) : null;

    return moon || getMoonPhase(fallbackDate);
  }

  function getMoonByType(type) {
    const names = {
      nm: "новолуние",
      wc: "растущий серп",
      fq: "первая четверть",
      wg: "растущая луна",
      fm: "полнолуние",
      wag: "убывающая луна",
      lq: "последняя четверть",
      wac: "убывающий серп",
    };

    return names[type] ? { type, name: names[type] } : null;
  }

  function getGiftMeta(giftKey) {
    const gifts = {
      moon: {
        title: "Лунная",
        symbol: "☾",
        image: "./assets/images/gifts/lunnaya.webp",
      },
      ammonite: {
        title: "Аммонитовая",
        symbol: "✦",
        image: "./assets/images/gifts/ammonitovaya.webp",
      },
      flower: {
        title: "Цветочная",
        symbol: "✧",
        image: "./assets/images/gifts/tsvetochnaya.webp",
      },
      honey: {
        title: "Медовая",
        symbol: "✦",
        image: "./assets/images/gifts/medovaya.webp",
      },
      night: {
        title: "Ночная",
        symbol: "✦",
        image: "./assets/images/gifts/nochnaya.webp",
      },
      forest: {
        title: "Лесная",
        symbol: "✦",
        image: "./assets/images/gifts/lesnaya.webp",
      },
      crystal: {
        title: "Кристальная",
        symbol: "✦",
        image: "./assets/images/gifts/kristalnaya.webp",
      },
      river: {
        title: "Речная",
        symbol: "✦",
        image: "./assets/images/gifts/rechnaya.webp",
      },
      transparent: {
        title: "Прозрачная",
        symbol: "✦",
        image: "./assets/images/gifts/prozrachnaya.webp?v=2",
      },
      root: {
        title: "Корневая",
        symbol: "✦",
        caption: "То, что держит тебя, растёт глубже видимого.",
      },
      star: {
        title: "Звёздная",
        symbol: "✧",
        caption: "Малый свет тоже указывает дорогу.",
      },
      threshold: {
        title: "Пороговая",
        symbol: "◇",
        caption: "Лес открывает проход тем, кто возвращается.",
      },
    };

    return gifts[giftKey] || gifts.moon;
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
    renderCardMoonMeta(reading);
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

  function renderCardMoonMeta(reading) {
    if (!elements.cardMoonMeta) {
      return;
    }

    const date = new Date(reading.createdAt || Date.now());
    const moon = getMoonPhase(date);
    elements.cardMoonMeta.replaceChildren(createMoonIcon(moon.type), document.createTextNode(`${capitalizeFirst(moon.name)} · ${formatTraceDate(date)}`));
  }

  function capitalizeFirst(value) {
    if (!value) {
      return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
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

    const saveScreen = document.getElementById("save-screen");
    const saveScreenBackdrop = document.getElementById("save-screen-backdrop");
    const saveScreenImage = document.getElementById("save-screen-image");
    const saveScreenLink = document.getElementById("save-screen-link");
    const saveScreenLoading = document.getElementById("save-screen-loading");
    const saveScreenCopy = document.getElementById("save-screen-copy");
    if (saveScreen) {
      if (saveScreen.dataset.objectUrl) {
        URL.revokeObjectURL(saveScreen.dataset.objectUrl);
        delete saveScreen.dataset.objectUrl;
      }
      saveScreen.hidden = true;
    }
    if (saveScreenBackdrop) {
      saveScreenBackdrop.hidden = true;
    }
    if (saveScreenImage) {
      saveScreenImage.hidden = true;
      saveScreenImage.removeAttribute("src");
    }
    if (saveScreenLink) {
      saveScreenLink.href = "#";
      saveScreenLink.setAttribute("aria-disabled", "true");
    }
    if (saveScreenLoading) {
      saveScreenLoading.hidden = false;
    }
    if (saveScreenCopy) {
      saveScreenCopy.textContent = "Готовим изображение для Stories...";
    }

    if (elements.shareButton) {
      elements.shareButton.disabled = false;
      elements.shareButton.classList.remove("is-loading");
    }

    if (elements.shareButtonLabel) {
      elements.shareButtonLabel.textContent = "ПОДЕЛИТЬСЯ";
    }

    if (elements.saveButton) {
      elements.saveButton.disabled = false;
      elements.saveButton.classList.remove("is-loading");
    }

    if (elements.saveButtonLabel) {
      elements.saveButtonLabel.textContent = "СОХРАНИТЬ";
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
