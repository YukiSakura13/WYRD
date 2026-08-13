import { SCENES } from "./scenes.js";
import { getCardImage, getSpreadDelay, layerLabel } from "./render-helpers.js";
import { getDialogController } from "./dialog-controller.js";

export function createSpreadRenderer(elements) {
  let openSpreadCardId = null;
  const dialogs = getDialogController();

  return {
    renderHistory,
    renderOracleVoice,
    renderSpread,
    renderSpreadContinuation,
  };

  function renderSpread(lastSpread, oracleReading = null, question = "") {
    renderSpreadQuestion(oracleReading ? oracleReading.question || "" : question || "");
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
      item.className = "spread-card ui-card-action";
      item.dataset.slot = String(card.slot || "");
      item.dataset.layer = card.layer || "";
      item.dataset.anchor = String(Number(card.slot) === 1);
      item.dataset.active = String(card.id === openSpreadCardId);
      item.setAttribute("aria-haspopup", "dialog");
      item.setAttribute("aria-label", `Открыть карту ${card.spreadLabel || layerLabel(card.layer)} — ${card.name}`);
      item.style.setProperty("--spread-delay", getSpreadDelay(card, lastSpread.length));
      item.addEventListener("click", function handleSelect() {
        openSpreadCardId = card.id;
        renderSpreadModal(card);
      });

      const image = document.createElement("img");
      image.src = getCardImage(card);
      image.alt = card.name;
      image.classList.toggle("is-empty", !card.image);

      const caption = document.createElement("span");
      caption.className = "spread-card-caption";

      const role = document.createElement("span");
      role.className = "spread-card-role";
      role.textContent = card.spreadLabel || layerLabel(card.layer);

      const name = document.createElement("span");
      name.className = "spread-card-name";
      name.textContent = card.name;

      caption.append(role, name);

      item.append(image, caption);
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
    elements.spreadDetailKeyword.textContent = card.keyword;
    elements.spreadDetailName.textContent = card.name;
    elements.spreadDetailMessage.textContent = card.message;
    elements.spreadDetailShadow.textContent = card.shadow;
  }

  function renderSpreadModal(card) {
    if (!elements.spreadModal) {
      return;
    }

    if (!card) {
      dialogs.sync(elements.spreadModal, false);
      return;
    }

    elements.spreadModalImage.src = getCardImage(card);
    elements.spreadModalImage.alt = card.name;
    elements.spreadModalRole.textContent = card.spreadLabel || layerLabel(card.layer);
    elements.spreadModalKeyword.textContent = card.keyword;
    elements.spreadModalName.textContent = card.name;
    elements.spreadModalMessage.textContent = card.message;
    elements.spreadModalShadow.textContent = card.shadow;
    elements.spreadModal.scrollTop = 0;
    elements.spreadModalPanel.scrollTop = 0;
    bindSpreadModalEvents();
    dialogs.sync(elements.spreadModal, true, {
      initialFocus: "#spread-card-modal-close",
    });
  }

  function closeSpreadModal() {
    openSpreadCardId = null;
    renderSpreadModal(null);
  }

  function bindSpreadModalEvents() {
    if (!elements.spreadModal || elements.spreadModal.dataset.bound === "true") {
      return;
    }

    elements.spreadModal.dataset.bound = "true";
    elements.spreadModalClose?.addEventListener("click", closeSpreadModal);
    elements.spreadModalBackdrop?.addEventListener("click", closeSpreadModal);
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
    const link = elements.spreadContinuation.querySelector(".spread-continuation-link");
    elements.spreadContinuation.dataset.size = String(lastSpread.length);

    if (lastSpread.length === 5) {
      if (copy) {
        copy.textContent = "Лес открылся тебе до конца. Путь теперь твой.";
      }

      if (button) {
        button.hidden = false;
        button.dataset.action = "new-question";
        button.textContent = "Новый вопрос";
        button.classList.remove("ui-action--primary", "wyrd-action-frame--secondary");
        button.classList.add("ui-action--quiet", "wyrd-action-frame--quiet");
      }

      if (link) {
        link.hidden = true;
      }
      return;
    }

    if (copy) {
      copy.textContent = "Пять карт откроют то, что три не сказали.";
    }

    if (button) {
      button.hidden = false;
      button.dataset.action = "spread-5";
      button.textContent = "Раскрыть пять карт";
      button.classList.remove("ui-action--quiet", "wyrd-action-frame--quiet");
      button.classList.add("ui-action--primary", "wyrd-action-frame--secondary");
    }

    if (link) {
      link.hidden = false;
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
        elements.oracleVoiceMessage.replaceChildren();
      }
      return;
    }

    const prefix = document.createElement("span");
    prefix.className = "oracle-voice-prefix";
    prefix.textContent = "Духи леса шепчут:";

    const lines = String(oracleReading.oracle_message || "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line, index, allLines) => line || allLines[index - 1]);
    const fragments = [prefix];

    lines.forEach(function appendOracleLine(line) {
      const item = document.createElement("span");
      item.className = line ? "oracle-voice-line" : "oracle-voice-gap";
      item.textContent = line;
      fragments.push(item);
    });

    elements.oracleVoiceMessage.replaceChildren(...fragments);
  }

  function renderSpreadQuestion(question) {
    if (!elements.spreadQuestion || !elements.spreadQuestionText || !elements.spreadQuestionLabel) {
      return;
    }

    if (question) {
      elements.spreadQuestionLabel.textContent = "Твой вопрос";
      elements.spreadQuestionLabel.hidden = false;
      elements.spreadQuestionText.textContent = question;
      elements.spreadQuestion.classList.remove("is-muted");
      return;
    }

    elements.spreadQuestionLabel.hidden = true;
    elements.spreadQuestionText.textContent = "Тайна приоткроется сама...";
    elements.spreadQuestion.classList.add("is-muted");
  }

  function renderHistory(history) {
    elements.historyList.replaceChildren();

    if (!history.length) {
      return;
    }

    history.forEach(function renderHistoryItem(trace) {
      const item = document.createElement("button");
      item.className = "history-item history-card-specimen card-context-action ui-card-action";
      item.type = "button";
      item.dataset.action = "open-history-entry";
      item.dataset.traceId = trace.id;
      item.setAttribute("aria-label", `Открыть след ${trace.snapshot.cardTitle}`);
      item.dataset.tone = trace.card.tone || "neutral";

      const image = document.createElement("img");
      image.src = getCardImage(trace.card);
      image.alt = trace.snapshot.cardTitle;
      image.classList.toggle("is-empty", !trace.card.image);

      const content = document.createElement("div");
      content.className = "history-item-copy";
      const title = document.createElement("h3");
      title.textContent = trace.snapshot.cardTitle;

      content.append(title);
      item.append(image, content);
      elements.historyList.appendChild(item);
    });
  }
}

function getArchetypeId(oracleReading) {
  const archetype = typeof oracleReading?.archetype === "string" ? oracleReading.archetype.toLowerCase() : "a";

  return ["a", "b", "c", "d"].includes(archetype) ? archetype : "a";
}
