import { SCENES } from "./scenes.js";
import { CARDS } from "../data/cards.js";
import { createSpreadRenderer } from "./render-spread.js";
import { getCardImage } from "./render-helpers.js";
import { createMoonIcon, formatFullTraceDate, formatTraceDate, getMoonPhase } from "./moon.js";
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
    historyGiftRevealStatus: doc.getElementById("history-gift-reveal-status"),
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
    elements.giftShelf.classList.toggle("has-pending-gift", gifts.some((gift) => gift.pendingReveal));
    elements.giftShelfTrack.classList.toggle("has-one-gift", gifts.length === 1);
    elements.giftShelfTrack.classList.remove("is-making-room");
    elements.giftShelfTrack.replaceChildren();

    gifts.forEach(function renderGift(gift) {
      const giftMeta = getGiftMeta(gift.giftKey);
      const receivedAt = new Date(gift.receivedAt);
      const card = document.createElement("button");
      card.className = "gift-card";
      card.type = "button";
      card.dataset.action = "flip-gift";
      card.dataset.giftId = gift.id;
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
      dateValue.textContent = formatFullTraceDate(receivedAt);
      date.append(dateLabel, dateValue);
      back.append(starField, mainStar, backTitle, date);

      inner.append(front, back);
      card.append(inner);
      elements.giftShelfTrack.appendChild(card);
      startGiftTwinkle(back);
    });

    renderGiftRevealRitual(gifts);
  }

  function getVisibleGifts(state) {
    const gifts = Array.isArray(state.gifts) ? state.gifts : [];

    const previewGiftKeys = getPreviewGiftKeys();
    if (gifts.length) {
      return gifts;
    }

    const previewRevealGiftKey = getPreviewGiftRevealKey();
    if (previewGiftKeys.length === 0 && !previewRevealGiftKey) {
      return [];
    }

    const giftKeys = previewRevealGiftKey && !previewGiftKeys.includes(previewRevealGiftKey)
      ? [previewRevealGiftKey, ...previewGiftKeys]
      : previewGiftKeys;

    return giftKeys.map(function createPreviewGift(giftKey, index) {
      return {
        id: `gift-${giftKey}-preview`,
        receivedAt: new Date(2026, 4, 29 + index, 12, 0, 0).toISOString(),
        giftKey,
        pendingReveal: giftKey === previewRevealGiftKey && !isPreviewGiftRevealShown(giftKey),
        schemaVersion: 1,
      };
    });
  }

  function renderGiftRevealRitual(gifts) {
    if (!elements.historyGiftReveal) {
      return;
    }

    const pendingGift = gifts.find((gift) => gift.pendingReveal);
    elements.historyGiftReveal.hidden = !pendingGift;
    elements.historyGiftReveal.classList.toggle("is-active", Boolean(pendingGift));
    elements.historyGiftReveal.replaceChildren();

    if (!pendingGift) {
      elements.giftShelfTrack?.classList.remove("is-making-room");
      if (elements.historyGiftRevealStatus) {
        elements.historyGiftRevealStatus.textContent = "";
      }
      return;
    }

    const giftMeta = getGiftMeta(pendingGift.giftKey);
    const veil = document.createElement("span");
    veil.className = "gift-reveal-veil";
    const glimmer = document.createElement("span");
    glimmer.className = "gift-reveal-glimmer";
    const star = document.createElement("span");
    star.className = "gift-reveal-star";
    const card = document.createElement("span");
    card.className = "gift-reveal-card";
    const cardFrame = document.createElement("span");
    cardFrame.className = "gift-reveal-card-frame";
    const image = giftMeta.image ? document.createElement("img") : document.createElement("span");

    image.className = giftMeta.image ? "gift-reveal-image" : "gift-reveal-symbol";
    if (giftMeta.image) {
      image.src = giftMeta.image;
      image.alt = "";
      image.decoding = "async";
    } else {
      image.textContent = giftMeta.symbol;
    }

    cardFrame.append(image);
    card.append(cardFrame);
    elements.historyGiftReveal.append(veil, glimmer, star, card, ...createGiftRevealParticles());
    runGiftRevealTimeline(card, pendingGift);

    if (elements.historyGiftRevealStatus) {
      elements.historyGiftRevealStatus.textContent = `Лес оставил новый дар: ${giftMeta.title}.`;
    }
  }

  function runGiftRevealTimeline(card, gift) {
    if (!card || !gift) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.classList.add("is-manifesting");

    if (prefersReducedMotion) {
      positionGiftRevealCard(card, gift);
      return;
    }

    window.setTimeout(function holdManifestedGift() {
      if (!document.contains(card)) {
        return;
      }

      card.classList.add("is-holding");
    }, 1800);

    window.setTimeout(function settleManifestedGift() {
      if (!document.contains(card)) {
        return;
      }

      positionGiftRevealCard(card, gift);
    }, 2450);
  }

  function positionGiftRevealCard(card, gift) {
    if (!card || !gift) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.setTimeout(function prepareGiftFlight() {
      const track = elements.giftShelfTrack;
      const target = elements.giftShelfTrack?.querySelector(`[data-gift-id="${gift.id}"]`);
      const targetRect = target?.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      if (!document.contains(card) || !target || !track || !targetRect || !cardRect.width || !cardRect.height) {
        return;
      }

      const currentScrollLeft = track.scrollLeft;
      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const targetCenterOffset = target.offsetLeft + target.offsetWidth / 2;
      const desiredScrollLeft = Math.max(0, Math.min(maxScrollLeft, targetCenterOffset - track.clientWidth / 2));
      const scrollDelta = desiredScrollLeft - currentScrollLeft;
      const targetCenterX = targetRect.left + targetRect.width / 2 - scrollDelta;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const cardCenterX = window.innerWidth / 2;
      const cardCenterY = window.innerHeight / 2;
      const finalScale = Math.max(0.24, Math.min(0.58, targetRect.width / cardRect.width));

      track.classList.add("is-making-room");
      if (typeof track.scrollTo === "function") {
        track.scrollTo({
          left: desiredScrollLeft,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      } else {
        track.scrollLeft = desiredScrollLeft;
      }

      card.style.setProperty("--gift-reveal-to-x", `${targetCenterX - cardCenterX}px`);
      card.style.setProperty("--gift-reveal-to-y", `${targetCenterY - cardCenterY}px`);
      card.style.setProperty("--gift-reveal-mid-x", `${(targetCenterX - cardCenterX) * 0.78}px`);
      card.style.setProperty("--gift-reveal-mid-y", `${(targetCenterY - cardCenterY) * 0.78}px`);
      card.style.setProperty("--gift-reveal-mid-scale", (finalScale * 1.18).toFixed(3));
      card.style.setProperty("--gift-reveal-final-scale", finalScale.toFixed(3));

      window.setTimeout(function startGiftFlight() {
        if (!document.contains(card)) {
          return;
        }

        card.classList.add("is-flying", "is-positioned");
      }, prefersReducedMotion ? 0 : 340);
    }, 0);
  }

  function createGiftRevealParticles() {
    return [
      { x: 43, y: 34, dx: -8, dy: -6, size: 3, delay: 0 },
      { x: 57, y: 34, dx: 8, dy: -6, size: 4, delay: 180 },
      { x: 35, y: 48, dx: -12, dy: 0, size: 3, delay: 320 },
      { x: 65, y: 48, dx: 12, dy: 0, size: 3, delay: 120 },
      { x: 40, y: 64, dx: -9, dy: 8, size: 5, delay: 420 },
      { x: 60, y: 64, dx: 9, dy: 8, size: 4, delay: 260 },
      { x: 50, y: 29, dx: 0, dy: -12, size: 3, delay: 540 },
      { x: 50, y: 70, dx: 0, dy: 12, size: 3, delay: 700 },
      { x: 50, y: 50, dx: 0, dy: 0, size: 2, delay: 380 },
    ].map(function createParticle(point) {
      const particle = document.createElement("span");
      particle.className = "gift-reveal-particle";
      particle.style.setProperty("--x", `${point.x}%`);
      particle.style.setProperty("--y", `${point.y}%`);
      particle.style.setProperty("--dx", `${point.dx}px`);
      particle.style.setProperty("--dy", `${point.dy}px`);
      particle.style.setProperty("--dx-soft", `${point.dx * 0.65}px`);
      particle.style.setProperty("--dy-soft", `${point.dy * 0.65}px`);
      particle.style.setProperty("--dx-wide", `${point.dx * 1.3}px`);
      particle.style.setProperty("--dy-wide", `${point.dy * 1.3}px`);
      particle.style.setProperty("--dx-far", `${point.dx * 1.8}px`);
      particle.style.setProperty("--dy-far", `${point.dy * 1.8}px`);
      particle.style.setProperty("--size", `${point.size}px`);
      particle.style.setProperty("--delay", `${point.delay}ms`);
      return particle;
    });
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

  function getPreviewGiftRevealKey() {
    if (!isGiftPreviewEnabled()) {
      return null;
    }

    try {
      return normalizeGiftKey(new URLSearchParams(window.location.search).get("previewGiftReveal") || "");
    } catch (error) {
      return null;
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
      free: "free",
      volnaya: "free",
      ammonite: "ammonite",
      ammonitovaya: "ammonite",
      resonant: "resonant",
      zvenyashaya: "resonant",
      flower: "flower",
      floral: "flower",
      tsvetochnaya: "flower",
      honey: "honey",
      medovaya: "honey",
      ancient: "ancient",
      drevnyaya: "ancient",
      night: "night",
      nochnaya: "night",
      fragile: "fragile",
      hrupkaya: "fragile",
      malachite: "malachite",
      malahitovaya: "malachite",
      wild: "wild",
      dikaya: "wild",
      moss: "moss",
      mohovaya: "moss",
      quiet: "quiet",
      tihaya: "quiet",
      forest: "forest",
      lesnaya: "forest",
      cedar: "cedar",
      kedrovaya: "cedar",
      crystal: "crystal",
      kristalnaya: "crystal",
      river: "river",
      rechnaya: "river",
      transparent: "transparent",
      prozrachnaya: "transparent",
      ringing: "ringing",
      zvonkaya: "ringing",
      morning: "morning",
      utrennyaya: "morning",
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
      free: {
        title: "Вольная",
        symbol: "✦",
        image: "./assets/images/gifts/volnaya.webp",
      },
      ammonite: {
        title: "Аммонитовая",
        symbol: "✦",
        image: "./assets/images/gifts/ammonitovaya.webp",
      },
      resonant: {
        title: "Звенящая",
        symbol: "✦",
        image: "./assets/images/gifts/zvenyashaya.webp",
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
      ancient: {
        title: "Древняя",
        symbol: "✦",
        image: "./assets/images/gifts/drevnyaya.webp",
      },
      night: {
        title: "Ночная",
        symbol: "✦",
        image: "./assets/images/gifts/nochnaya.webp",
      },
      fragile: {
        title: "Хрупкая",
        symbol: "✦",
        image: "./assets/images/gifts/hrupkaya.webp",
      },
      malachite: {
        title: "Малахитовая",
        symbol: "✦",
        image: "./assets/images/gifts/malahitovaya.webp",
      },
      wild: {
        title: "Дикая",
        symbol: "✦",
        image: "./assets/images/gifts/dikaya.webp",
      },
      moss: {
        title: "Моховая",
        symbol: "✦",
        image: "./assets/images/gifts/mohovaya.webp",
      },
      quiet: {
        title: "Тихая",
        symbol: "✦",
        image: "./assets/images/gifts/tihaya.webp",
      },
      forest: {
        title: "Лесная",
        symbol: "✦",
        image: "./assets/images/gifts/lesnaya.webp",
      },
      cedar: {
        title: "Кедровая",
        symbol: "✦",
        image: "./assets/images/gifts/kedrovaya.webp",
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
      ringing: {
        title: "Звонкая",
        symbol: "✦",
        image: "./assets/images/gifts/zvonkaya.webp",
      },
      morning: {
        title: "Утренняя",
        symbol: "✦",
        image: "./assets/images/gifts/utrennyaya.webp",
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
    const phaseName = capitalizeFirst(moon.name);
    const formattedDate = formatFullTraceDate(date);
    const phase = document.createElement("span");
    const dateLine = document.createElement("span");

    phase.className = "card-moon-phase";
    phase.append(createMoonIcon(moon.type), document.createTextNode(phaseName));
    dateLine.className = "card-moon-date";
    dateLine.textContent = formattedDate;

    elements.cardMoonMeta.setAttribute("aria-label", `${phaseName}, ${formattedDate}`);
    elements.cardMoonMeta.replaceChildren(phase, dateLine);
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
