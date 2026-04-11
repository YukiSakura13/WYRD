import { PAYWALL_COPY } from "../cards/reading.js";

const DEEP_READING_TEXT =
  'Этот знак просит не ответа, а внутренней тишины. Вернись к нему вечером и проверь, где в течение дня уже проявился образ "%CARD_NAME%".';
const EMPTY_CARD_IMAGE = createEmptyCardImage();

export function getElements(doc = document) {
  return {
    body: doc.body,
    cover: doc.getElementById("cover"),
    coverArt: doc.getElementById("cover-art"),
    main: doc.getElementById("main"),
    transitionVeil: doc.getElementById("transition-veil"),
    onboardingSection: doc.getElementById("ritual-onboarding"),
    deckWrap: doc.getElementById("deck-wrap"),
    drawButton: doc.getElementById("draw-button"),
    deckModeCopy: doc.getElementById("deck-mode-copy"),
    resultQuestion: doc.getElementById("result-question"),
    resultSection: doc.getElementById("result"),
    spreadResultSection: doc.getElementById("spread-result"),
    paywallSection: doc.getElementById("paywall"),
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
    deckTop: doc.querySelector(".dc-top"),
    soundButton: doc.querySelector('[data-action="toggle-sound"]'),
    profileName: doc.getElementById("profile-name"),
    profileMeta: doc.getElementById("profile-meta"),
    historyList: doc.getElementById("history-list"),
    spreadGrid: doc.getElementById("spread-grid"),
    spreadTitle: doc.getElementById("spread-title"),
    spreadStageNote: doc.getElementById("spread-stage-note"),
    spreadContinuation: doc.getElementById("spread-continuation"),
    oracleVoice: doc.getElementById("oracle-voice"),
    oracleVoiceMessage: doc.getElementById("oracle-voice-message"),
    paywallTitle: doc.getElementById("paywall-title"),
    paywallCopy: doc.getElementById("paywall-copy"),
    paywallPreview: doc.getElementById("paywall-preview"),
    paywallCta: doc.getElementById("paywall-cta"),
  };
}

export function deriveContentPanel(state) {
  if (state.lastSpread.length) {
    return "spread";
  }

  if (state.currentReading) {
    return "result";
  }

  return "deck";
}

export function createRenderer(elements) {
  let readingRevealTimers = [];
  let lastReadingId = null;

  function render(state, uiState) {
    renderShell(uiState);
    renderDeckCopy(state, uiState);
    renderProfile(state);
    renderCurrentReading(state.currentReading, uiState.currentQuestion);
    renderHook(state, uiState);
    renderSpread(state.lastSpread);
    renderOracleVoice(state.lastSpread, state.lastOracleReading);
    renderSpreadContinuation(state.lastSpread, uiState);
    renderHistory(state.history);
    renderPaywall(uiState.paywallOffer);
    renderVisibility(state, uiState);
  }

  function scrollTo(name) {
    const targetMap = {
      deck: elements.deckWrap,
      paywall: elements.paywallSection,
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

    elements.deckTop.style.transition = "all .5s ease";
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
    elements.cover.classList.toggle("gone", uiState.entered);
    elements.main.classList.toggle("on", uiState.entered);
    elements.transitionVeil.classList.toggle("is-active", Boolean(uiState.transitioning));
    elements.body.dataset.scene =
      uiState.overlay !== "none" || !uiState.hasDrawnThisSession
        ? uiState.overlay !== "none"
          ? uiState.overlay
          : "deck"
        : uiState.forceDeck
          ? "deck"
          : uiState.contentPanel;
  }

  function renderDeckCopy(state, uiState) {
    const usedFree = Boolean(state.dailyFreeUsedAt);
    if (elements.deckModeCopy) {
      elements.deckModeCopy.textContent = usedFree
        ? "Первый знак уже открыт. Лес ждёт, решишься ли ты продолжить путь."
        : "Одна карта в день. Лес открывает только первый слой.";
    }

    if (elements.drawButton) {
      elements.drawButton.textContent = usedFree ? "Открыть путь" : "Коснуться колоды";
    }
  }

  function renderProfile(state) {
    elements.soundButton.textContent = state.soundEnabled ? "Звук леса: вкл" : "Звук леса: выкл";
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
    elements.cardMessage.textContent = `« ${reading.card.message} »`;
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
      uiState.overlay === "none" &&
      Boolean(state.currentReading && state.currentReading.free) &&
      !state.lastSpread.length;

    elements.hookBlock.hidden = !shouldShowHook;
    if (elements.actionsPanel) {
      elements.actionsPanel.hidden = shouldShowHook;
    }
  }

  function renderSpread(lastSpread) {
    elements.spreadTitle.textContent = `Расклад на ${lastSpread.length} карт`;
    elements.spreadStageNote.textContent = getSpreadStageNote(lastSpread.length);
    elements.spreadGrid.replaceChildren();
    elements.spreadGrid.className = "spread-grid";

    if (lastSpread.length === 3) {
      elements.spreadGrid.classList.add("spread-grid--three");
    } else if (lastSpread.length === 5) {
      elements.spreadGrid.classList.add("spread-grid--five");
    }

    lastSpread.forEach(function (card) {
      const item = document.createElement("article");
      item.className = "spread-card";
      item.dataset.slot = String(card.slot || "");
      item.dataset.layer = card.layer || "";
      item.style.setProperty("--spread-delay", getSpreadDelay(card, lastSpread.length));

      const image = document.createElement("img");
      image.src = getCardImage(card);
      image.alt = card.name;
      image.classList.toggle("is-empty", !card.image);

      const title = document.createElement("h3");
      title.textContent = card.name;

      const role = document.createElement("p");
      role.className = "spread-role";
      role.textContent = card.spreadLabel || layerLabel(card.layer);

      const subtitle = document.createElement("p");
      subtitle.className = "card-en";
      subtitle.textContent = card.subtitle;

      const message = document.createElement("p");
      message.className = "spread-message";
      message.textContent = card.message;

      const veil = document.createElement("div");
      veil.className = "spread-veil";
      veil.textContent = card.spreadLabel || layerLabel(card.layer);

      item.append(image, role, title, subtitle, message, veil);
      elements.spreadGrid.appendChild(item);
    });
  }

  function renderSpreadContinuation(lastSpread, uiState) {
    if (!elements.spreadContinuation) {
      return;
    }

    elements.spreadContinuation.hidden = uiState.overlay !== "none" || lastSpread.length !== 3;
  }

  function renderOracleVoice(lastSpread, oracleReading) {
    if (!elements.oracleVoice) {
      return;
    }

    const shouldShow = lastSpread.length === 3 || lastSpread.length === 5;
    elements.oracleVoice.hidden = !shouldShow || !oracleReading;

    if (!shouldShow || !oracleReading) {
      if (elements.oracleVoiceMessage) {
        elements.oracleVoiceMessage.textContent = "";
      }
      return;
    }

    elements.oracleVoiceMessage.textContent = oracleReading.oracle_message || "";
  }

  function renderHistory(history) {
    elements.historyList.replaceChildren();

    if (!history.length) {
      const empty = document.createElement("p");
      empty.className = "history-empty";
      empty.textContent = "История пока молчит.";
      elements.historyList.appendChild(empty);
      return;
    }

    history.forEach(function (reading) {
      const item = document.createElement("article");
      item.className = "history-item";

      const image = document.createElement("img");
      image.src = getCardImage(reading.card);
      image.alt = reading.card.name;
      image.classList.toggle("is-empty", !reading.card.image);

      const content = document.createElement("div");
      const keyword = document.createElement("p");
      keyword.className = "lbl";
      keyword.textContent = reading.card.keyword;

      const title = document.createElement("h3");
      title.textContent = reading.card.name;

      const message = document.createElement("p");
      message.textContent = reading.card.message;

      content.append(keyword, title, message);
      item.append(image, content);
      elements.historyList.appendChild(item);
    });
  }

  function renderPaywall(_paywallOffer) {
    // Paywall removed — no-op
  }

  function renderVisibility(state, uiState) {
    const contentPanel = deriveContentPanel(state);
    const overlay = uiState.overlay;
    const showingDeck = overlay === "none" && (!uiState.hasDrawnThisSession || uiState.forceDeck || contentPanel === "deck");

    if (elements.paywallSection) elements.paywallSection.hidden = overlay !== "paywall";
    elements.profileSection.hidden = overlay !== "profile";
    elements.onboardingSection.hidden = overlay !== "onboarding";
    elements.deckWrap.hidden = !showingDeck;
    elements.resultSection.hidden = overlay !== "none" || !uiState.hasDrawnThisSession || uiState.forceDeck || contentPanel !== "result";
    elements.spreadResultSection.hidden =
      overlay !== "none" || !uiState.hasDrawnThisSession || uiState.forceDeck || contentPanel !== "spread";
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

function getCardImage(card) {
  return card.image || EMPTY_CARD_IMAGE;
}

function layerLabel(layer) {
  if (layer === "past") {
    return "Прошлое";
  }

  if (layer === "future") {
    return "Будущее";
  }

  return "Настоящее";
}

function renderPaywallPreview(offer) {
  const container = document.getElementById("paywall-preview");
  if (!container) {
    return;
  }

  container.replaceChildren();

  const preset = getPaywallPreviewPreset(offer);
  container.dataset.layout = preset.layout;

  preset.items.forEach(function (item) {
    const card = document.createElement("article");
    card.className = "paywall-preview-card";

    const image = document.createElement("div");
    image.className = "paywall-preview-image";

    const veil = document.createElement("span");
    veil.className = "paywall-preview-veil";
    veil.textContent = "лес говорит больше";
    image.appendChild(veil);

    const role = document.createElement("p");
    role.className = "paywall-preview-role";
    role.textContent = item.role;

    const line = document.createElement("p");
    line.className = "paywall-preview-text";
    line.textContent = item.line;

    card.append(image, role, line);
    container.appendChild(card);
  });
}

function getSpreadDelay(card, count) {
  const revealOrder = Math.max((card.revealOrder || 1) - 1, 0);

  if (count === 5) {
    return `${revealOrder * 860}ms`;
  }

  return `${revealOrder * 460}ms`;
}

function getSpreadStageNote(count) {
  if (count === 5) {
    return "Лес открывает каждый знак по очереди: ты, узел, импульс, скрытое, путь.";
  }

  if (count === 3) {
    return "Центральный знак уже знаком тебе. Теперь лес открывает корень, а затем вектор пути.";
  }

  return "";
}

function getPaywallPreviewPreset(offer) {
  if (offer === "deep-reading") {
    return {
      layout: "single",
      items: [{ role: "Второй слой", line: "Лес говорит больше, но..." }],
    };
  }

  if (offer === "spread-3") {
    return {
      layout: "double",
      items: [
        { role: "Прошлое", line: "То, что держало..." },
        { role: "Будущее", line: "То, что уже зовёт..." },
      ],
    };
  }

  if (offer === "spread-5") {
    return {
      layout: "five",
      items: [
        { role: "Ты", line: "Точка входа..." },
        { role: "Что держит", line: "Старый узел..." },
        { role: "Что ведёт", line: "Текущий импульс..." },
        { role: "Что скрыто", line: "Лес прячет..." },
        { role: "Куда ведёт", line: "Дальнейший путь..." },
      ],
    };
  }

  return {
    layout: "single",
    items: [{ role: "Следующий знак", line: "Лес говорит больше..." }],
  };
}

function createEmptyCardImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
      <rect width="300" height="400" fill="#14141d"/>
      <rect x="10" y="10" width="280" height="380" rx="2" fill="none" stroke="rgba(201,161,74,0.26)"/>
      <rect x="22" y="22" width="256" height="356" rx="2" fill="none" stroke="rgba(201,161,74,0.12)"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
