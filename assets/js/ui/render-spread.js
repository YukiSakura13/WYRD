import { SCENES } from "./scenes.js";
import { getCardImage, getSpreadDelay, getSpreadStageNote, layerLabel } from "./render-helpers.js";

export function createSpreadRenderer(elements) {
  let selectedSpreadCardId = null;

  return {
    renderHistory,
    renderOracleVoice,
    renderSpread,
    renderSpreadContinuation,
  };

  function renderSpread(lastSpread) {
    elements.spreadTitle.textContent = `Расклад на ${lastSpread.length} карт`;
    elements.spreadStageNote.textContent = getSpreadStageNote(lastSpread.length);
    elements.spreadGrid.replaceChildren();
    elements.spreadGrid.className = "spread-grid";

    if (!lastSpread.length) {
      selectedSpreadCardId = null;
      renderSpreadDetail(null);
      return;
    }

    if (!lastSpread.some((card) => card.id === selectedSpreadCardId)) {
      selectedSpreadCardId = lastSpread[0]?.id || null;
    }

    if (lastSpread.length === 3) {
      elements.spreadGrid.classList.add("spread-grid--three");
    } else if (lastSpread.length === 5) {
      elements.spreadGrid.classList.add("spread-grid--five");
    }

    lastSpread.forEach(function renderSpreadCard(card) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "spread-card";
      item.dataset.slot = String(card.slot || "");
      item.dataset.layer = card.layer || "";
      item.dataset.selected = String(card.id === selectedSpreadCardId);
      item.setAttribute("aria-pressed", String(card.id === selectedSpreadCardId));
      item.setAttribute("aria-label", `${card.spreadLabel || layerLabel(card.layer)} — ${card.name}`);
      item.style.setProperty("--spread-delay", getSpreadDelay(card, lastSpread.length));
      item.addEventListener("click", function handleSelect() {
        selectedSpreadCardId = card.id;
        renderSpread(lastSpread);
      });

      const image = document.createElement("img");
      image.src = getCardImage(card);
      image.alt = card.name;
      image.classList.toggle("is-empty", !card.image);

      const srRole = document.createElement("span");
      srRole.className = "sr-only";
      srRole.textContent = card.spreadLabel || layerLabel(card.layer);

      item.append(image, srRole);
      elements.spreadGrid.appendChild(item);
    });

    renderSpreadDetail(lastSpread.find((card) => card.id === selectedSpreadCardId) || lastSpread[0]);
  }

  function renderSpreadDetail(card) {
    if (!elements.spreadDetail) {
      return;
    }

    if (!card) {
      elements.spreadDetail.hidden = true;
      return;
    }

    elements.spreadDetail.hidden = false;
    elements.spreadDetailRole.textContent = card.spreadLabel || layerLabel(card.layer);
    elements.spreadDetailImage.src = getCardImage(card);
    elements.spreadDetailImage.alt = card.name;
    elements.spreadDetailKeyword.textContent = `✦ ${card.keyword} ✦`;
    elements.spreadDetailName.textContent = card.name;
    elements.spreadDetailSubtitle.textContent = card.subtitle;
    elements.spreadDetailMessage.textContent = card.message;
    elements.spreadDetailShadow.textContent = card.shadow;
  }

  function renderSpreadContinuation(lastSpread, uiState) {
    if (!elements.spreadContinuation) {
      return;
    }

    elements.spreadContinuation.hidden = uiState.activeScene !== SCENES.SPREAD || lastSpread.length !== 3;
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

    history.forEach(function renderHistoryItem(reading) {
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
}
