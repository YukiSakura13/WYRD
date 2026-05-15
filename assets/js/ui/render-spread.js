import { SCENES } from "./scenes.js";
import { createMoonIcon, formatTraceDate, getMoonPhase } from "./moon.js";
import { getCardImage, getSpreadDelay, getSpreadStageNote, layerLabel } from "./render-helpers.js";

export function createSpreadRenderer(elements) {
  let openSpreadCardId = null;
  let lastModalTrigger = null;

  return {
    renderHistory,
    renderOracleVoice,
    renderSpread,
    renderSpreadContinuation,
  };

  function renderSpread(lastSpread, oracleReading = null) {
    elements.spreadTitle.textContent = getSpreadTitle(lastSpread.length);
    elements.spreadStageNote.textContent = getSpreadStageNote(lastSpread.length);
    elements.spreadGrid.replaceChildren();
    elements.spreadGrid.className = "spread-grid";
    elements.spreadGrid.classList.add(`spread-grid--archetype-${getArchetypeId(oracleReading)}`);

    if (!lastSpread.length) {
      openSpreadCardId = null;
      renderSpreadDetail(null);
      renderSpreadModal(null);
      return;
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
      item.dataset.anchor = String(Number(card.slot) === 1);
      item.dataset.active = String(card.id === openSpreadCardId);
      item.setAttribute("aria-haspopup", "dialog");
      item.setAttribute("aria-label", `Открыть карту ${card.spreadLabel || layerLabel(card.layer)} — ${card.name}`);
      item.style.setProperty("--spread-delay", getSpreadDelay(card, lastSpread.length));
      item.addEventListener("click", function handleSelect() {
        openSpreadCardId = card.id;
        lastModalTrigger = item;
        renderSpreadModal(card);
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

    renderSpreadDetail(null);
    renderSpreadModal(lastSpread.find((card) => card.id === openSpreadCardId) || null);
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

  function renderSpreadModal(card) {
    if (!elements.spreadModal) {
      return;
    }

    if (!card) {
      elements.spreadModal.hidden = true;
      elements.body?.classList.remove("spread-modal-open");
      return;
    }

    elements.spreadModal.hidden = false;
    elements.body?.classList.add("spread-modal-open");
    elements.spreadModalImage.src = getCardImage(card);
    elements.spreadModalImage.alt = card.name;
    elements.spreadModalRole.textContent = card.spreadLabel || layerLabel(card.layer);
    elements.spreadModalKeyword.textContent = `✦ ${card.keyword} ✦`;
    elements.spreadModalName.textContent = card.name;
    elements.spreadModalSubtitle.textContent = card.subtitle;
    elements.spreadModalMessage.textContent = card.message;
    elements.spreadModalShadow.textContent = card.shadow;
    bindSpreadModalEvents();

    window.setTimeout(function focusModalClose() {
      elements.spreadModalClose?.focus();
    }, 0);
  }

  function closeSpreadModal() {
    openSpreadCardId = null;
    renderSpreadModal(null);

    if (lastModalTrigger && typeof lastModalTrigger.focus === "function") {
      lastModalTrigger.focus();
    }
  }

  function bindSpreadModalEvents() {
    if (!elements.spreadModal || elements.spreadModal.dataset.bound === "true") {
      return;
    }

    elements.spreadModal.dataset.bound = "true";
    elements.spreadModalClose?.addEventListener("click", closeSpreadModal);
    elements.spreadModalBackdrop?.addEventListener("click", closeSpreadModal);
    document.addEventListener("keydown", function handleModalEscape(event) {
      if (event.key === "Escape" && !elements.spreadModal.hidden) {
        closeSpreadModal();
      }
    });
  }

  function renderSpreadContinuation(lastSpread, uiState) {
    if (!elements.spreadContinuation) {
      return;
    }

    const shouldShow = uiState.activeScene === SCENES.SPREAD && (lastSpread.length === 3 || lastSpread.length === 5);
    elements.spreadContinuation.hidden = !shouldShow;

    if (!shouldShow) {
      return;
    }

    const copy = elements.spreadContinuation.querySelector(".spread-continuation-copy");
    const button = elements.spreadContinuation.querySelector(".spread-continuation-btn");

    if (lastSpread.length === 5) {
      if (copy) {
        copy.textContent = "Расклад завершён. Можно вернуться к колоде и задать новый вопрос.";
      }

      if (button) {
        button.dataset.action = "new-question";
        button.textContent = "Задать новый вопрос";
      }
      return;
    }

    if (copy) {
      copy.textContent = "История уже открылась. Следующий слой ждёт твоего шага.";
    }

    if (button) {
      button.dataset.action = "spread-5";
      button.textContent = "Продолжить путь";
    }
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
      return;
    }

    history.forEach(function renderHistoryItem(trace) {
      const item = document.createElement("article");
      item.className = "history-item";
      item.dataset.action = "open-history-entry";
      item.dataset.traceId = trace.id;
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", `Открыть послание ${trace.card.name}`);
      item.dataset.tone = trace.card.tone || "neutral";

      const image = document.createElement("img");
      image.src = getCardImage(trace.card);
      image.alt = trace.card.name;
      image.classList.toggle("is-empty", !trace.card.image);

      const content = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = trace.card.name;

      const message = document.createElement("p");
      message.textContent = trace.question || trace.message || trace.card.message;

      const meta = document.createElement("div");
      meta.className = "history-item-meta";
      const date = new Date(trace.date);
      const moon = getMoonPhase(date);
      const dateText = document.createElement("span");
      dateText.textContent = formatTraceDate(date);
      meta.append(dateText, createMoonIcon(moon.type));

      content.append(title, message);
      item.append(image, content, meta);
      elements.historyList.appendChild(item);
    });
  }
}

function getArchetypeId(oracleReading) {
  const archetype = typeof oracleReading?.archetype === "string" ? oracleReading.archetype.toLowerCase() : "a";

  return ["a", "b", "c", "d"].includes(archetype) ? archetype : "a";
}

function getSpreadTitle(cardCount) {
  if (cardCount === 3) {
    return "Расклад на 3 карты";
  }

  if (cardCount === 5) {
    return "Расклад на 5 карт";
  }

  return `Расклад на ${cardCount} карт`;
}
