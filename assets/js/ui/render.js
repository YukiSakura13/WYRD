import { SCENES } from "./scenes.js";
import { CARDS } from "../data/cards.js";
import { AVATAR_OPTIONS, PRONOUN_OPTIONS, ZODIAC_OPTIONS } from "../data/personalization.js";
import { SPIRIT_BOOK_PAGES } from "../data/spirit-book.js";
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
    forestSection: doc.getElementById("forest-home"),
    forestAvatarButton: doc.getElementById("forest-avatar-button"),
    forestAvatarImage: doc.getElementById("forest-avatar-image"),
    settingsSection: doc.getElementById("settings-screen"),
    remindersSection: doc.getElementById("reminders-screen"),
    appInfoSection: doc.getElementById("app-info-screen"),
    spiritBookSection: doc.getElementById("spirit-book"),
    spiritBookArt: doc.getElementById("spirit-book-art"),
    spiritBookImage: doc.getElementById("spirit-book-image"),
    spiritBookCounter: doc.getElementById("spirit-book-counter"),
    spiritBookTitle: doc.getElementById("spirit-book-title"),
    spiritBookText: doc.getElementById("spirit-book-text"),
    spiritBookDots: doc.getElementById("spirit-book-dots"),
    spiritBookPrev: doc.querySelector("[data-action='spirit-book-prev']"),
    spiritBookNext: doc.querySelector("[data-action='spirit-book-next']"),
    settingsProfileSummary: doc.getElementById("settings-profile-summary"),
    settingSoundToggle: doc.getElementById("setting-sound-toggle"),
    settingVibrationToggle: doc.getElementById("setting-vibration-toggle"),
    aboutYouSection: doc.getElementById("about-you-screen"),
    aboutAvatarTrack: doc.getElementById("about-avatar-track"),
    aboutAvatarUpload: doc.getElementById("about-avatar-upload"),
    aboutNameInput: doc.getElementById("about-name-input"),
    aboutPronounGroup: doc.getElementById("about-pronoun-group"),
    aboutZodiacSelect: doc.getElementById("about-zodiac-select"),
    aboutSaveButton: doc.getElementById("about-save-button"),
    aboutSaveStatus: doc.getElementById("about-save-status"),
    remindersTimeValue: doc.getElementById("reminders-time-value"),
    remindersTimeSheet: doc.getElementById("reminders-time-sheet"),
    remindersTimeHour: doc.getElementById("reminders-time-hour"),
    remindersTimeMinute: doc.getElementById("reminders-time-minute"),
    remindersDaysSummary: doc.getElementById("reminders-days-summary"),
    remindersDays: doc.getElementById("reminders-days"),
    remindersMonthlyToggle: doc.getElementById("reminders-monthly-toggle"),
    remindersNewMoonToggle: doc.getElementById("reminders-new-moon-toggle"),
    remindersFullMoonToggle: doc.getElementById("reminders-full-moon-toggle"),
    remindersSaveButton: doc.getElementById("reminders-save-button"),
    remindersSaveStatus: doc.getElementById("reminders-save-status"),
    aboutSection: doc.getElementById("about-wyrd"),
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

  function render(state, uiState) {
    renderShell(uiState);
    renderForestAvatar(state);
    renderSettings(state);
    renderAboutYou(state, uiState);
    renderReminders(state, uiState);
    renderSpiritBook(uiState);
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
      forest: elements.forestSection,
      settings: elements.settingsSection,
      "about-you": elements.aboutYouSection,
      reminders: elements.remindersSection,
      "app-info": elements.appInfoSection,
      "spirit-book": elements.spiritBookSection,
      about: elements.aboutSection,
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

  function renderSettings(state) {
    syncSettingsToggle(elements.settingSoundToggle, state.soundEnabled, "Звук леса");
    syncSettingsToggle(elements.settingVibrationToggle, state.vibrationEnabled, "Тихий отклик");

    if (!elements.settingsProfileSummary) {
      return;
    }

    const profile = state.userProfile || {};
    const parts = [];

    if (profile.name) {
      parts.push(profile.name);
    }

    if (profile.avatarId) {
      parts.push("аватар выбран");
    }

    const pronoun = PRONOUN_OPTIONS.find((option) => option.id === profile.pronoun);
    if (pronoun && pronoun.id !== "neutral") {
      parts.push(pronoun.label);
    }

    const zodiac = ZODIAC_OPTIONS.find((option) => option.id === profile.zodiac);
    if (zodiac?.id) {
      parts.push(zodiac.label);
    }

    elements.settingsProfileSummary.textContent = parts.length
      ? parts.join(" · ")
      : "Имя, аватар и обращение";
  }

  function renderForestAvatar(state) {
    if (!elements.forestAvatarButton || !elements.forestAvatarImage) {
      return;
    }

    const image = getAvatarImage(state.userProfile);
    elements.forestAvatarButton.classList.toggle("has-avatar", Boolean(image));
    elements.forestAvatarImage.hidden = !image;

    if (image && elements.forestAvatarImage.src !== image) {
      elements.forestAvatarImage.src = image;
    }

    if (!image) {
      elements.forestAvatarImage.removeAttribute("src");
    }
  }

  function syncSettingsToggle(button, enabled, title) {
    if (!button) {
      return;
    }

    button.classList.toggle("is-on", Boolean(enabled));
    button.setAttribute("aria-pressed", String(Boolean(enabled)));
    button.setAttribute("aria-label", `${title}: ${enabled ? "включено" : "выключено"}`);
  }

  function getAvatarImage(profile = {}) {
    if (profile.avatarId === "custom" && profile.customAvatarImage) {
      return profile.customAvatarImage;
    }

    return AVATAR_OPTIONS.find((option) => option.id === profile.avatarId)?.image || "";
  }

  function formatReminderDays(days) {
    if (!days.length) {
      return "Не выбрано";
    }

    if (days.length === 7) {
      return "Все";
    }

    const labels = {
      mon: "Пн",
      tue: "Вт",
      wed: "Ср",
      thu: "Чт",
      fri: "Пт",
      sat: "Сб",
      sun: "Вс",
    };

    return days.map((day) => labels[day]).filter(Boolean).join(", ");
  }

  function renderAboutYou(state, uiState) {
    if (!elements.aboutYouSection) {
      return;
    }

    const profile = uiState.aboutDraft || state.userProfile || {};
    renderAvatarOptions(profile);
    renderPronounOptions(profile.pronoun || "neutral");

    if (elements.aboutNameInput && elements.aboutNameInput.value !== (profile.name || "")) {
      elements.aboutNameInput.value = profile.name || "";
    }

    if (elements.aboutZodiacSelect && elements.aboutZodiacSelect.value !== (profile.zodiac || "")) {
      elements.aboutZodiacSelect.value = profile.zodiac || "";
    }

    if (elements.aboutSaveButton) {
      const hasChanges = hasProfileChanges(profile, state.userProfile || {});
      elements.aboutSaveButton.disabled = !hasChanges;
      elements.aboutSaveButton.setAttribute("aria-disabled", String(!hasChanges));
    }
  }

  function hasProfileChanges(profile, savedProfile) {
    const current = normalizeProfileSnapshot(profile);
    const saved = normalizeProfileSnapshot(savedProfile);

    return (
      current.avatarId !== saved.avatarId ||
      current.customAvatarImage !== saved.customAvatarImage ||
      current.name !== saved.name ||
      current.pronoun !== saved.pronoun ||
      current.zodiac !== saved.zodiac
    );
  }

  function normalizeProfileSnapshot(profile = {}) {
    return {
      avatarId: profile.avatarId || "",
      customAvatarImage: profile.customAvatarImage || "",
      name: typeof profile.name === "string" ? profile.name.replace(/\s+/g, " ").trim() : "",
      pronoun: profile.pronoun || "neutral",
      zodiac: profile.zodiac || "",
    };
  }

  function renderAvatarOptions(profile) {
    if (!elements.aboutAvatarTrack) {
      return;
    }

    const activeAvatar = profile.avatarId || "";
    elements.aboutAvatarTrack.replaceChildren(
      ...AVATAR_OPTIONS.map(function createAvatarButton(option) {
        const isSelected = activeAvatar === option.id;
        const button = document.createElement("button");
        button.className = "about-avatar";
        button.type = "button";
        button.dataset.action = "select-avatar";
        button.dataset.avatarId = option.id;
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", String(isSelected));
        button.setAttribute("aria-label", `Выбрать облик: ${option.title}`);
        button.classList.toggle("is-selected", isSelected);

        const image = document.createElement("img");
        image.src = option.image;
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";
        button.appendChild(image);

        return button;
      }),
      createAvatarUploadButton(profile),
    );
  }

  function createAvatarUploadButton(profile) {
    const hasCustomImage = Boolean(profile.customAvatarImage);
    const isSelected = profile.avatarId === "custom" && hasCustomImage;
    const button = document.createElement("button");
    button.className = "about-upload-avatar";
    button.type = "button";
    button.dataset.action = "upload-avatar";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(isSelected));
    button.setAttribute("aria-label", hasCustomImage ? "Заменить свой аватар" : "Загрузить свой аватар");
    button.classList.toggle("is-selected", isSelected);

    if (hasCustomImage) {
      const image = document.createElement("img");
      image.src = profile.customAvatarImage;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      button.appendChild(image);
      return button;
    }

    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
    return button;
  }

  function renderPronounOptions(pronoun) {
    if (!elements.aboutPronounGroup) {
      return;
    }

    PRONOUN_OPTIONS.forEach(function updatePronoun(option) {
      const button = elements.aboutPronounGroup.querySelector(`[data-pronoun="${option.id}"]`);
      const isSelected = option.id === pronoun;

      if (!button) {
        return;
      }

      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-checked", String(isSelected));
    });
  }

  function renderReminders(state, uiState) {
    const reminders = uiState.remindersDraft || state.reminders || {};
    const selectedDays = Array.isArray(reminders.days) ? reminders.days : [];

    const reminderTime = reminders.time || "11:00";

    if (elements.remindersTimeValue) {
      elements.remindersTimeValue.textContent = reminderTime;
    }

    ensureTimeSelectOptions();

    if (elements.remindersTimeHour && elements.remindersTimeMinute) {
      const pickerTime = uiState.timePickerOpen ? uiState.timePickerDraft || reminderTime : reminderTime;
      const timeParts = pickerTime.split(":");
      const hour = timeParts[0] || "11";
      const minute = timeParts[1] || "00";

      if (elements.remindersTimeHour.value !== hour) {
        elements.remindersTimeHour.value = hour;
      }

      if (elements.remindersTimeMinute.value !== minute) {
        elements.remindersTimeMinute.value = minute;
      }
    }

    if (elements.remindersDaysSummary) {
      elements.remindersDaysSummary.textContent = formatReminderDays(selectedDays);
    }

    if (elements.remindersDays) {
      Array.from(elements.remindersDays.querySelectorAll("[data-day]")).forEach(function updateDay(button) {
        const isSelected = selectedDays.includes(button.dataset.day);
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });
    }

    syncSettingsToggle(elements.remindersMonthlyToggle, Boolean(reminders.monthlyFirst), "Первое число месяца");
    syncSettingsToggle(elements.remindersNewMoonToggle, Boolean(reminders.moonPhases?.newMoon), "Новолуние");
    syncSettingsToggle(elements.remindersFullMoonToggle, Boolean(reminders.moonPhases?.fullMoon), "Полнолуние");

    if (elements.remindersTimeSheet) {
      elements.remindersTimeSheet.hidden = !uiState.timePickerOpen;
    }

    if (elements.remindersSaveButton) {
      elements.remindersSaveButton.textContent = reminders.enabled ? "Сохранить" : "Включить уведомления";
    }
  }

  function ensureTimeSelectOptions() {
    if (!elements.remindersTimeHour || !elements.remindersTimeMinute || elements.remindersTimeHour.options.length) {
      return;
    }

    Array.from({ length: 24 }, function createHour(_, index) {
      return String(index).padStart(2, "0");
    }).forEach(function appendHour(hour) {
      elements.remindersTimeHour.append(new Option(hour, hour));
    });

    Array.from({ length: 12 }, function createMinute(_, index) {
      return String(index * 5).padStart(2, "0");
    }).forEach(function appendMinute(minute) {
      elements.remindersTimeMinute.append(new Option(minute, minute));
    });
  }

  function renderSpiritBook(uiState) {
    if (!elements.spiritBookTitle || !elements.spiritBookImage || !elements.spiritBookText) {
      return;
    }

    const lastPageIndex = SPIRIT_BOOK_PAGES.length - 1;
    const pageIndex = Math.max(0, Math.min(lastPageIndex, uiState.spiritBookPage || 0));
    const page = SPIRIT_BOOK_PAGES[pageIndex];

    uiState.spiritBookPage = pageIndex;

    if (elements.spiritBookArt) {
      elements.spiritBookArt.dataset.page = String(pageIndex + 1);
    }

    elements.spiritBookImage.hidden = !page.image;
    if (page.image) {
      elements.spiritBookImage.src = page.image;
      elements.spiritBookImage.alt = page.alt;
    } else {
      elements.spiritBookImage.removeAttribute("src");
      elements.spiritBookImage.alt = "";
    }

    elements.spiritBookCounter.textContent = `Глава ${pageIndex + 1} из ${SPIRIT_BOOK_PAGES.length}`;
    elements.spiritBookTitle.textContent = page.title;
    elements.spiritBookText.replaceChildren(
      ...page.paragraphs.map(function createParagraph(text) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        return paragraph;
      }),
    );

    if (elements.spiritBookPrev) {
      elements.spiritBookPrev.disabled = pageIndex === 0;
    }

    if (elements.spiritBookNext) {
      elements.spiritBookNext.disabled = pageIndex === lastPageIndex;
    }

    renderSpiritBookDots(pageIndex);
  }

  function renderSpiritBookDots(activeIndex) {
    if (!elements.spiritBookDots) {
      return;
    }

    elements.spiritBookDots.replaceChildren(
      ...SPIRIT_BOOK_PAGES.map(function createDot(page, index) {
        const dot = document.createElement("button");
        dot.className = "spirit-book-dot";
        dot.type = "button";
        dot.dataset.action = "spirit-book-page";
        dot.dataset.page = String(index);
        dot.setAttribute("aria-label", `Открыть главу ${index + 1}: ${page.title}`);
        dot.setAttribute("aria-current", index === activeIndex ? "page" : "false");
        return dot;
      }),
    );
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
      const title = document.createElement("span");
      title.className = "gift-title";
      title.textContent = giftMeta.title;
      front.append(symbol, title);

      const back = document.createElement("span");
      back.className = "gift-card-face gift-card-back";
      const backImprint = giftMeta.image ? document.createElement("img") : document.createElement("span");
      backImprint.className = giftMeta.image ? "gift-back-imprint" : "gift-back-symbol";
      if (giftMeta.image) {
        backImprint.src = giftMeta.image;
        backImprint.alt = "";
        backImprint.loading = "lazy";
        backImprint.decoding = "async";
      } else {
        backImprint.textContent = giftMeta.symbol;
      }
      const backTitle = document.createElement("span");
      backTitle.className = "gift-title";
      backTitle.textContent = giftMeta.title;
      const divider = document.createElement("span");
      divider.className = "gift-divider";
      const caption = document.createElement("span");
      caption.className = "gift-caption";
      const captionLines = giftMeta.captionLines || [giftMeta.caption];
      captionLines.forEach(function appendCaptionLine(line, index) {
        const lineNode = document.createElement("span");
        lineNode.className = index === captionLines.length - 1 ? "gift-caption-line gift-caption-line--closing" : "gift-caption-line";
        lineNode.textContent = line;
        caption.appendChild(lineNode);
      });
      const date = document.createElement("span");
      date.className = "gift-date";
      date.textContent = `Обретено ${formatTraceDate(receivedAt)}`;
      back.append(backImprint, backTitle, divider, caption, date);

      inner.append(front, back);
      card.append(inner);
      elements.giftShelfTrack.appendChild(card);
    });
  }

  function getVisibleGifts(state) {
    const gifts = Array.isArray(state.gifts) ? state.gifts : [];

    if (gifts.length || !hasGiftPreview()) {
      return gifts;
    }

    return [
      {
        id: "gift-moon-preview",
        receivedAt: new Date(2026, 4, 29, 12, 0, 0).toISOString(),
        giftKey: "moon",
        pendingReveal: false,
        schemaVersion: 1,
      },
    ];
  }

  function hasGiftPreview() {
    try {
      return new URLSearchParams(window.location.search).get("previewGift") === "moon";
    } catch (error) {
      return false;
    }
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
        caption: "Луна не спешит менять форму. Всему своё время.",
        captionLines: ["Луна не спешит", "менять форму.", "Всему своё время."],
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

    elements.forestSection.hidden = scene !== SCENES.FOREST;
    elements.settingsSection.hidden = scene !== SCENES.SETTINGS;
    elements.aboutYouSection.hidden = scene !== SCENES.ABOUT_YOU;
    elements.remindersSection.hidden = scene !== SCENES.REMINDERS;
    elements.appInfoSection.hidden = scene !== SCENES.APP_INFO;
    elements.spiritBookSection.hidden = scene !== SCENES.SPIRIT_BOOK;
    elements.aboutSection.hidden = scene !== SCENES.ABOUT;
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
