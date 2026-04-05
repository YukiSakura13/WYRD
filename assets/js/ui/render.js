import { PAYWALL_COPY } from "../cards/reading.js";

const DEEP_READING_TEXT =
  'Этот знак просит не ответа, а внутренней тишины. Вернись к нему вечером и проверь, где в течение дня уже проявился образ "%CARD_NAME%".';

export function getElements(doc = document) {
  return {
    cover: doc.getElementById("cover"),
    coverArt: doc.getElementById("cover-art"),
    main: doc.getElementById("main"),
    deckWrap: doc.getElementById("deck-wrap"),
    ritualSection: doc.getElementById("ritual"),
    ritualCountdown: doc.getElementById("ritual-countdown"),
    resultSection: doc.getElementById("result"),
    spreadResultSection: doc.getElementById("spread-result"),
    paywallSection: doc.getElementById("paywall"),
    profileSection: doc.getElementById("profile"),
    cardImage: doc.getElementById("card-image"),
    cardKeyword: doc.getElementById("card-keyword"),
    cardName: doc.getElementById("card-name"),
    cardSubtitle: doc.getElementById("card-subtitle"),
    cardMessage: doc.getElementById("card-message"),
    cardShadow: doc.getElementById("card-shadow"),
    deepWrap: doc.getElementById("deep-wrap"),
    deepMessage: doc.getElementById("deep-message"),
    deckTop: doc.querySelector(".dc-top"),
    soundButton: doc.querySelector('[data-action="toggle-sound"]'),
    ambienceSlider: doc.querySelector('[data-action="set-ambience-volume"]'),
    ambienceValue: doc.getElementById("ambience-volume-value"),
    profileName: doc.getElementById("profile-name"),
    profileMeta: doc.getElementById("profile-meta"),
    historyList: doc.getElementById("history-list"),
    spreadGrid: doc.getElementById("spread-grid"),
    spreadTitle: doc.getElementById("spread-title"),
    paywallTitle: doc.getElementById("paywall-title"),
    paywallCopy: doc.getElementById("paywall-copy"),
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
  function render(state, uiState) {
    renderShell(uiState);
    renderProfile(state);
    renderCurrentReading(state.currentReading);
    renderSpread(state.lastSpread);
    renderHistory(state.history);
    renderPaywall(uiState.paywallOffer);
    renderVisibility(state, uiState);
  }

  function scrollTo(name) {
    const targetMap = {
      paywall: elements.paywallSection,
      profile: elements.profileSection,
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
    elements.ritualCountdown.textContent = String(uiState.ritualCountdown);
  }

  function renderProfile(state) {
    elements.soundButton.textContent = state.soundEnabled ? "Звук леса: вкл" : "Звук леса: выкл";
    if (elements.ambienceSlider) {
      elements.ambienceSlider.value = String(Math.round(state.ambienceVolume * 100));
    }
    if (elements.ambienceValue) {
      elements.ambienceValue.textContent = `${Math.round(state.ambienceVolume * 100)}%`;
    }
    elements.profileName.textContent = state.profileName;
    elements.profileMeta.textContent = state.dailyFreeUsedAt
      ? "Сегодняшняя бесплатная карта уже раскрыта."
      : "Бесплатная карта ещё не раскрыта.";
  }

  function renderCurrentReading(reading) {
    if (!reading) {
      return;
    }

    elements.cardImage.src = reading.card.image;
    elements.cardImage.alt = reading.card.name;
    elements.cardKeyword.textContent = `✦ ${reading.card.keyword} ✦`;
    elements.cardName.textContent = reading.card.name;
    elements.cardSubtitle.textContent = reading.card.subtitle;
    elements.cardMessage.textContent = `« ${reading.card.message} »`;
    elements.cardShadow.textContent = reading.card.shadow;

    if (reading.depthUnlocked) {
      elements.deepWrap.hidden = false;
      elements.deepMessage.textContent = DEEP_READING_TEXT.replace("%CARD_NAME%", reading.card.name);
      return;
    }

    elements.deepWrap.hidden = true;
    elements.deepMessage.textContent = "";
  }

  function renderSpread(lastSpread) {
    elements.spreadTitle.textContent = `Расклад на ${lastSpread.length} карт`;
    elements.spreadGrid.replaceChildren();

    lastSpread.forEach(function (card) {
      const item = document.createElement("article");
      item.className = "spread-card";

      const image = document.createElement("img");
      image.src = card.image;
      image.alt = card.name;

      const title = document.createElement("h3");
      title.textContent = card.name;

      const subtitle = document.createElement("p");
      subtitle.className = "card-en";
      subtitle.textContent = card.subtitle;

      const message = document.createElement("p");
      message.textContent = card.message;

      item.append(image, title, subtitle, message);
      elements.spreadGrid.appendChild(item);
    });
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
      image.src = reading.card.image;
      image.alt = reading.card.name;

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

  function renderPaywall(paywallOffer) {
    if (!paywallOffer) {
      elements.paywallTitle.textContent = "";
      elements.paywallCopy.textContent = "";
      elements.paywallCta.textContent = "";
      return;
    }

    const offer = PAYWALL_COPY[paywallOffer];
    elements.paywallTitle.textContent = offer.title;
    elements.paywallCopy.textContent = offer.text;
    elements.paywallCta.textContent = offer.cta;
  }

  function renderVisibility(state, uiState) {
    const contentPanel = deriveContentPanel(state);
    const overlay = uiState.overlay;

    elements.ritualSection.hidden = overlay !== "ritual";
    elements.paywallSection.hidden = overlay !== "paywall";
    elements.profileSection.hidden = overlay !== "profile";
    elements.resultSection.hidden = overlay !== "none" || contentPanel !== "result";
    elements.spreadResultSection.hidden = overlay !== "none" || contentPanel !== "spread";
  }
}
