import { createReading, createSpread } from "../cards/reading.js";
import { buildLocalOracleReading } from "../cards/oracle-local.js";
import { SPIRIT_BOOK_PAGES } from "../data/spirit-book.js";
import { ARCHETYPE_POSITIONS, detectArchetype, detectQuestionRoute } from "../cards/question-routing.js";
import { createTransitionRunner, getAudioScene, getReturnScene, playSpreadSequence, resetViewport } from "./flow.js";
import { SCENES } from "./scenes.js";
import { closeSaveScreen, saveCurrentCard, shareCurrentCard } from "./share.js";
import { notify } from "./notification-center.js";
import { acceptSpiritBookNavigation } from "./spirit-book-navigation.js";

const REMINDER_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function createActionHandler(deps) {
  const { audio, cards, renderApp, renderer, setScene, store, uiState } = deps;
  const runTransition = createTransitionRunner(renderApp, uiState);

  return function onClick(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) {
      return;
    }

    const action = trigger.dataset.action;

    if (action === "enter") {
      if (trigger.classList.contains("is-activating")) {
        return;
      }

      trigger.classList.add("is-activating");
      trigger.setAttribute("aria-disabled", "true");
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function enterForest() {
        trigger.classList.remove("is-activating");
        trigger.removeAttribute("aria-disabled");
        setScene(SCENES.FOREST);
        audio.sync({
          allowInit: true,
          enabled: store.getState().soundEnabled,
          scene: SCENES.FOREST,
        });
        window.setTimeout(function scrollAfterEntry() {
          renderer.scrollTo(SCENES.FOREST);
        }, 80);
      }, {
        leadIn: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 240,
      });
      return;
    }

    if (action === "open-daily-card") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openDailyCard() {
        setScene(SCENES.DECK);
        audio.sync({
          enabled: store.getState().soundEnabled,
          scene: SCENES.DECK,
        });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "open-lunar-day") {
      openForestPath(SCENES.LUNAR_DAY, { audio, renderer, setScene, store, runTransition });
      return;
    }

    if (action === "open-yes-no") {
      openForestPath(SCENES.YES_NO, { audio, renderer, setScene, store, runTransition });
      return;
    }

    if (action === "open-night-images") {
      openForestPath(SCENES.NIGHT_IMAGES, { audio, renderer, setScene, store, runTransition });
      return;
    }

    if (action === "enter-ritual") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function continueToDeck() {
        store.markOnboardingSeen();
        setScene(SCENES.DECK);
        audio.sync({
          enabled: store.getState().soundEnabled,
          scene: SCENES.DECK,
        });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "back-from-onboarding") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function leaveOnboarding() {
        const returnTarget = uiState.onboardingReturn || SCENES.COVER;

        if (returnTarget === SCENES.COVER) {
          setScene(SCENES.COVER);
          audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        if (returnTarget === SCENES.FOREST) {
          setScene(SCENES.FOREST);
          audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
          renderer.scrollTo(SCENES.FOREST);
          return;
        }

        setScene(SCENES.DECK);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "toggle-sound") {
      const nextState = store.toggleAudio();
      const audioEnabled = nextState.soundEnabled || nextState.musicEnabled;
      updatePressedSoundControl(trigger, audioEnabled);
      audio.sync({ enabled: audioEnabled, scene: getAudioScene(uiState.activeScene) });
      renderApp();
      return;
    }

    if (action === "open-sound-settings") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.soundSettingsOpen = true;
      renderApp();
      return;
    }

    if (action === "close-sound-settings") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.soundSettingsOpen = false;
      renderApp();
      return;
    }

    if (action === "toggle-music") {
      audio.playSelect(store.getState().soundEnabled);
      const nextState = store.toggleMusic();
      audio.sync({
        allowInit: nextState.musicEnabled,
        enabled: nextState.musicEnabled,
        scene: getAudioScene(uiState.activeScene),
      });
      renderApp();
      return;
    }

    if (action === "toggle-sound-effects") {
      const nextState = store.toggleSound();
      if (nextState.soundEnabled) {
        audio.playSelect(true);
      }
      renderApp();
      return;
    }

    if (action === "toggle-vibration") {
      store.toggleVibration();
      renderApp();
      return;
    }

    if (action === "open-settings") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openSettings() {
        uiState.soundSettingsOpen = false;
        setScene(SCENES.SETTINGS);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.SETTINGS });
        renderer.scrollTo(SCENES.SETTINGS);
      });
      return;
    }

    if (action === "open-app-info") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openAppInfo() {
        setScene(SCENES.APP_INFO);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.SETTINGS });
        renderer.scrollTo(SCENES.APP_INFO);
      });
      return;
    }

    if (action === "open-spirit-book") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openSpiritBook() {
        uiState.spiritBookPage = 0;
        uiState.spiritBookNavigationLockedUntil = 0;
        setScene(SCENES.SPIRIT_BOOK);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
        renderer.scrollTo(SCENES.SPIRIT_BOOK);
      });
      return;
    }

    if (action === "spirit-book-prev") {
      if (!acceptSpiritBookNavigation(uiState)) {
        return;
      }
      audio.playSelect(store.getState().soundEnabled);
      uiState.spiritBookPage = Math.max(0, (uiState.spiritBookPage || 0) - 1);
      renderApp();
      return;
    }

    if (action === "spirit-book-next") {
      if (!acceptSpiritBookNavigation(uiState)) {
        return;
      }
      audio.playSelect(store.getState().soundEnabled);
      uiState.spiritBookPage = Math.min(SPIRIT_BOOK_PAGES.length - 1, (uiState.spiritBookPage || 0) + 1);
      renderApp();
      return;
    }

    if (action === "spirit-book-page") {
      const page = Number(trigger.dataset.page);
      if (!Number.isInteger(page)) {
        return;
      }
      if (!acceptSpiritBookNavigation(uiState)) {
        return;
      }
      audio.playSelect(store.getState().soundEnabled);
      uiState.spiritBookPage = Math.max(0, Math.min(SPIRIT_BOOK_PAGES.length - 1, page));
      renderApp();
      return;
    }

    if (action === "open-about-you") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openAboutYou() {
        uiState.aboutReturnScene = uiState.activeScene === SCENES.SETTINGS ? SCENES.SETTINGS : SCENES.FOREST;
        uiState.aboutDraft = { ...store.getState().userProfile };
        uiState.aboutUnsavedSheetOpen = false;
        setScene(SCENES.ABOUT_YOU);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.ABOUT_YOU });
        renderer.scrollTo(SCENES.ABOUT_YOU);
      });
      return;
    }

    if (action === "close-about-you") {
      audio.playSelect(store.getState().soundEnabled);
      if (hasAboutChanges(store, uiState)) {
        uiState.aboutUnsavedSheetOpen = true;
        renderApp();
        return;
      }

      closeAboutYouScreen({ audio, renderer, setScene, store, uiState, renderApp, runTransition });
      return;
    }

    if (action === "keep-editing-about-you") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.aboutUnsavedSheetOpen = false;
      renderApp();
      return;
    }

    if (action === "discard-about-changes") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.aboutUnsavedSheetOpen = false;
      uiState.aboutDraft = null;
      closeAboutYouScreen({ audio, renderer, setScene, store, uiState, renderApp, runTransition, keepDraft: true });
      return;
    }

    if (action === "save-about-and-close") {
      audio.playSelect(store.getState().soundEnabled);
      const nextState = store.saveUserProfile(readAboutDraftFromForm(store, uiState));
      uiState.aboutDraft = { ...nextState.userProfile };
      uiState.aboutUnsavedSheetOpen = false;
      updateAboutStatus("Сохранено.");
      notify({
        id: "profile-saved",
        kind: "success",
        message: "Профиль сохранён.",
        dismissible: true,
      });
      window.setTimeout(function closeAfterSheetSave() {
        closeAboutYouScreen({ audio, renderer, setScene, store, uiState, renderApp, runTransition });
      }, 120);
      return;
    }

    if (action === "select-avatar") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.aboutDraft = {
        ...readAboutDraftFromForm(store, uiState),
        avatarId: trigger.dataset.avatarId || "wolf",
      };
      renderApp();
      return;
    }

    if (action === "upload-avatar") {
      audio.playSelect(store.getState().soundEnabled);
      document.getElementById("about-avatar-upload")?.click();
      return;
    }

    if (action === "select-pronoun") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.aboutDraft = {
        ...readAboutDraftFromForm(store, uiState),
        pronoun: trigger.dataset.pronoun || "neutral",
      };
      renderApp();
      return;
    }

    if (action === "save-about-you") {
      if (trigger.disabled) {
        return;
      }

      audio.playSelect(store.getState().soundEnabled);
      const nextState = store.saveUserProfile(readAboutDraftFromForm(store, uiState));
      uiState.aboutDraft = { ...nextState.userProfile };
      uiState.aboutUnsavedSheetOpen = false;
      updateAboutStatus("Сохранено.");
      notify({
        id: "profile-saved",
        kind: "success",
        message: "Профиль сохранён.",
        dismissible: true,
      });
      window.setTimeout(function returnAfterSave() {
        const returnScene = uiState.aboutReturnScene || SCENES.FOREST;
        uiState.aboutDraft = null;
        uiState.aboutUnsavedSheetOpen = false;
        setScene(returnScene);
        audio.sync({ enabled: store.getState().soundEnabled, scene: getAudioScene(returnScene) });
        renderer.scrollTo(returnScene);
      }, 220);
      return;
    }

    if (action === "open-reminders") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function openReminders() {
        uiState.remindersDraft = { ...store.getState().reminders };
        uiState.timePickerOpen = false;
        uiState.timePickerDraft = null;
        setScene(SCENES.REMINDERS);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
        renderer.scrollTo(SCENES.REMINDERS);
      });
      return;
    }

    if (action === "open-time-picker") {
      audio.playSelect(store.getState().soundEnabled);
      const draft = readRemindersDraftFromForm(store, uiState);
      uiState.remindersDraft = draft;
      uiState.timePickerOpen = true;
      uiState.timePickerDraft = draft.time || "11:00";
      renderApp();
      return;
    }

    if (action === "cancel-time-picker") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.timePickerOpen = false;
      uiState.timePickerDraft = null;
      renderApp();
      return;
    }

    if (action === "confirm-time-picker") {
      audio.playSelect(store.getState().soundEnabled);
      const draft = readRemindersDraftFromForm(store, uiState);
      const timeValue = readTimePickerValue() || uiState.timePickerDraft;
      uiState.remindersDraft = {
        ...draft,
        time: normalizeReminderTime(timeValue, draft.time || "11:00"),
      };
      uiState.timePickerOpen = false;
      uiState.timePickerDraft = null;
      renderApp();
      return;
    }

    if (action === "toggle-reminder-day") {
      audio.playSelect(store.getState().soundEnabled);
      const draft = readRemindersDraftFromForm(store, uiState);
      const day = trigger.dataset.day;
      const days = new Set(draft.days);

      if (days.has(day)) {
        days.delete(day);
      } else if (REMINDER_DAYS.includes(day)) {
        days.add(day);
      }

      uiState.remindersDraft = {
        ...draft,
        days: REMINDER_DAYS.filter((item) => days.has(item)),
      };
      renderApp();
      return;
    }

    if (action === "toggle-all-reminder-days") {
      audio.playSelect(store.getState().soundEnabled);
      const draft = readRemindersDraftFromForm(store, uiState);
      uiState.remindersDraft = {
        ...draft,
        days: draft.days.length === REMINDER_DAYS.length ? [] : REMINDER_DAYS,
      };
      renderApp();
      return;
    }

    if (action === "toggle-monthly-reminder") {
      audio.playSelect(store.getState().soundEnabled);
      const draft = readRemindersDraftFromForm(store, uiState);
      uiState.remindersDraft = {
        ...draft,
        monthlyFirst: !draft.monthlyFirst,
      };
      renderApp();
      return;
    }

    if (action === "toggle-moon-phase-reminder") {
      audio.playSelect(store.getState().soundEnabled);
      const phase = trigger.dataset.phase;
      const draft = readRemindersDraftFromForm(store, uiState);
      const moonPhases = {
        newMoon: Boolean(draft.moonPhases?.newMoon),
        fullMoon: Boolean(draft.moonPhases?.fullMoon),
      };

      if (phase === "newMoon" || phase === "fullMoon") {
        moonPhases[phase] = !moonPhases[phase];
      }

      uiState.remindersDraft = {
        ...draft,
        moonPhases,
      };
      renderApp();
      return;
    }

    if (action === "save-reminders") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.remindersDraft = {
        ...readRemindersDraftFromForm(store, uiState),
        enabled: true,
      };
      store.saveReminders(uiState.remindersDraft);
      updateRemindersStatus("Уведомления сохранены.");
      notify({
        id: "reminders-status",
        kind: "success",
        message: "Уведомления сохранены.",
        dismissible: true,
      });
      renderApp();
      return;
    }

    if (action === "disable-reminders") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.remindersDraft = {
        ...readRemindersDraftFromForm(store, uiState),
        enabled: false,
      };
      store.saveReminders(uiState.remindersDraft);
      updateRemindersStatus("Уведомления отключены.");
      notify({
        id: "reminders-status",
        kind: "info",
        message: "Уведомления отключены.",
        dismissible: true,
      });
      renderApp();
      return;
    }

    if (action === "back-to-settings") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToSettings() {
        uiState.remindersDraft = null;
        uiState.timePickerOpen = false;
        uiState.timePickerDraft = null;
        setScene(SCENES.SETTINGS);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.SETTINGS });
        renderer.scrollTo(SCENES.SETTINGS);
      });
      return;
    }

    if (action === "back-to-forest") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToForest() {
        uiState.soundSettingsOpen = false;
        setScene(SCENES.FOREST);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
        renderer.scrollTo(SCENES.FOREST);
      });
      return;
    }

    if (action === "open-history-entry") {
      const traceId = trigger.dataset.traceId;
      if (!traceId) {
        return;
      }
      audio.playSelect(store.getState().soundEnabled);
      uiState.activeHistoryTraceId = traceId;
      uiState.historySheetOpenedWithKeyboard = event.detail === 0;
      renderApp();
      return;
    }

    if (action === "close-history-entry") {
      closeHistoryEntry(uiState, renderApp);
      return;
    }

    if (action === "draw") {
      // Save raw question for routing and a display question for the result screen.
      syncQuestionFromInput(uiState);
      startRitual("free");
      return;
    }

    if (action === "hook-open-path") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.pinCurrentReadingForSpread = true;
      startRitual("spread-3");
      return;
    }

    if (action === "back-to-deck") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToDeck() {
        setScene(SCENES.DECK);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "ritual-back") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToPreviousRitualLayer() {
        const nextState = store.goBackRitualLayer();

        if (nextState.currentReading) {
          setScene(SCENES.RESULT);
          audio.sync({ enabled: nextState.soundEnabled, scene: SCENES.RESULT });
          renderer.scrollTo(SCENES.RESULT);
          return;
        }

        if (nextState.lastSpread.length) {
          setScene(SCENES.SPREAD);
          audio.sync({ enabled: nextState.soundEnabled, scene: SCENES.SPREAD });
          renderer.scrollTo(SCENES.SPREAD);
          return;
        }

        setScene(SCENES.DECK);
        audio.sync({ enabled: nextState.soundEnabled, scene: SCENES.DECK });
        renderer.scrollTo(SCENES.DECK);
      });
      return;
    }

    if (action === "back-to-cover") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function returnToCover() {
        setScene(SCENES.COVER);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      return;
    }

    if (action === "new-question" || action === "ask-spirits") {
      audio.playSelect(store.getState().soundEnabled);
      runTransition(function backToDeck() {
        uiState.currentQuestion = "";
        uiState.rawQuestion = "";
        uiState.continuationOffer = null;
        uiState.recentCardNames = [];
        store.clearCurrentRitual();
        setScene(SCENES.DECK);
        audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.DECK });
        renderer.scrollTo(SCENES.DECK);
        const questionEl = document.getElementById("question-input");
        if (questionEl) {
          questionEl.value = "";
          window.setTimeout(function focusQuestion() {
            questionEl.focus();
          }, 400);
        }
      });
      return;
    }

    if (action === "share-card") {
      shareCurrentCard(store);
      return;
    }

    if (action === "save-card") {
      saveCurrentCard(store);
      return;
    }

    if (action === "close-save-screen") {
      closeSaveScreen();
      return;
    }

    if (action === "extra-draw" || action === "deep-reading" || action === "spread-3" || action === "spread-5") {
      audio.playSelect(store.getState().soundEnabled);
      if (action === "extra-draw" || action === "spread-3" || action === "spread-5") {
        syncQuestionFromInput(uiState);
      }
      startRitual(action);
      return;
    }

    if (action === "open-traces") {
      audio.playSelect(store.getState().soundEnabled);
      uiState.tracesReturnScene = getReturnScene(uiState.activeScene, store.getState());
      setScene(SCENES.TRACES);
      audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.TRACES });
      renderer.scrollTo(SCENES.TRACES);
      revealPendingGiftsAfterAnimation(store, renderApp);
      return;
    }

    if (action === "flip-gift") {
      audio.playSelect(store.getState().soundEnabled);
      trigger.classList.toggle("is-flipped");
      trigger.setAttribute("aria-pressed", String(trigger.classList.contains("is-flipped")));
      return;
    }

    if (action === "close-traces") {
      audio.playSelect(store.getState().soundEnabled);
      const returnScene = getReturnScene(uiState.tracesReturnScene, store.getState());
      setScene(returnScene);
      audio.sync({ enabled: store.getState().soundEnabled, scene: getAudioScene(returnScene) });
      return;
    }

    if (action === "reset-local") {
      audio.stop();
      store.reset();
      uiState.continuationOffer = null;
      setScene(SCENES.COVER);
    }
  };

  function startRitual(mode) {
    uiState.continuationOffer = null;
    renderApp();
    runTransition(function resolveAfterTransition() {
      resolveRitual(deps, mode);
    });
  }
}

function revealPendingGiftsAfterAnimation(store, renderApp) {
  const previewGiftRevealKey = getPreviewGiftRevealKey();
  const hasPendingGift = store.getState().gifts?.some((gift) => gift.pendingReveal);
  const hasPreviewGiftReveal = Boolean(previewGiftRevealKey && !isPreviewGiftRevealShown(previewGiftRevealKey));

  if (!hasPendingGift && !hasPreviewGiftReveal) {
    return;
  }

  window.setTimeout(function clearPendingGiftReveal() {
    if (previewGiftRevealKey) {
      markPreviewGiftRevealShown(previewGiftRevealKey);
    } else {
      store.revealPendingGifts();
    }
    renderApp();
  }, 5900);
}

function getPreviewGiftRevealKey() {
  try {
    return new URLSearchParams(window.location.search).get("previewGiftReveal") || "";
  } catch (error) {
    return "";
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

function markPreviewGiftRevealShown(giftKey) {
  try {
    window.sessionStorage.setItem(getPreviewGiftRevealSessionKey(giftKey), "1");
  } catch (error) {
    // Preview cleanup should never block the real gift flow.
  }
}

function readAboutDraftFromForm(store, uiState) {
  const stateProfile = store.getState().userProfile || {};
  const draft = uiState.aboutDraft || stateProfile;
  const nameInput = document.getElementById("about-name-input");
  const zodiacSelect = document.getElementById("about-zodiac-select");

  return {
    ...stateProfile,
    ...draft,
    name: nameInput ? nameInput.value.replace(/\s+/g, " ").trim().slice(0, 36) : draft.name || "",
    zodiac: zodiacSelect ? zodiacSelect.value : draft.zodiac || "",
  };
}

function hasAboutChanges(store, uiState) {
  const stateProfile = store.getState().userProfile || {};
  const draft = readAboutDraftFromForm(store, uiState);
  const current = normalizeProfileSnapshot(draft);
  const saved = normalizeProfileSnapshot(stateProfile);

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

function openForestPath(scene, deps) {
  const { audio, renderer, setScene, store, runTransition } = deps;

  audio.playSelect(store.getState().soundEnabled);
  runTransition(function openPath() {
    setScene(scene);
    audio.sync({ enabled: store.getState().soundEnabled, scene: SCENES.FOREST });
    renderer.scrollTo(scene);
  });
}

function closeAboutYouScreen(deps) {
  const { audio, renderer, setScene, store, uiState, runTransition } = deps;

  runTransition(function closeAboutYou() {
    const returnScene = uiState.aboutReturnScene || SCENES.FOREST;
    uiState.aboutDraft = null;
    uiState.aboutUnsavedSheetOpen = false;
    setScene(returnScene);
    audio.sync({ enabled: store.getState().soundEnabled, scene: getAudioScene(returnScene) });
    renderer.scrollTo(returnScene);
  });
}

function readRemindersDraftFromForm(store, uiState) {
  const stateReminders = store.getState().reminders || {};
  const draft = uiState.remindersDraft || stateReminders;

  return {
    ...stateReminders,
    ...draft,
    time: normalizeReminderTime(draft.time, stateReminders.time || "11:00"),
    days: Array.isArray(draft.days) ? draft.days.filter((day) => REMINDER_DAYS.includes(day)) : [],
    monthlyFirst: Boolean(draft.monthlyFirst),
    moonPhases: {
      newMoon: Boolean(draft.moonPhases?.newMoon),
      fullMoon: Boolean(draft.moonPhases?.fullMoon),
    },
  };
}

function readTimePickerValue() {
  const hourSelect = document.getElementById("reminders-time-hour");
  const minuteSelect = document.getElementById("reminders-time-minute");
  const hour = hourSelect?.value;
  const minute = minuteSelect?.value;

  if (!hour || !minute) {
    return "";
  }

  return `${hour}:${minute}`;
}

function normalizeReminderTime(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const compact = value.replace(/[^\d]/g, "");
  const normalized = compact.length === 3 ? `0${compact}` : compact;

  if (normalized.length !== 4) {
    return fallback;
  }

  const hours = Number(normalized.slice(0, 2));
  const minutes = Number(normalized.slice(2, 4));

  if (hours > 23 || minutes > 59) {
    return fallback;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function updateAboutStatus(message) {
  const status = document.getElementById("about-save-status");
  if (status) {
    status.textContent = message;
  }
}

function updateRemindersStatus(message) {
  const status = document.getElementById("reminders-save-status");
  if (status) {
    status.textContent = message;
  }
}

export function createInputChangeHandler(deps) {
  const { audio, renderApp, store, uiState } = deps;

  return function onInputChange(event) {
    if (event.target?.id === "about-name-input" || event.target?.id === "about-zodiac-select") {
      uiState.aboutDraft = readAboutDraftFromForm(store, uiState);
      renderApp();
      return;
    }

    if (event.target?.id === "about-avatar-upload") {
      handleAvatarUpload(event.target, store, uiState, renderApp);
      return;
    }

    if (event.target?.id === "reminders-time-hour" || event.target?.id === "reminders-time-minute") {
      uiState.timePickerDraft = normalizeReminderTime(readTimePickerValue(), uiState.timePickerDraft || "11:00");
      renderApp();
      return;
    }

    if (event.target?.id === "settings-music-volume") {
      const volume = Math.max(0, Math.min(100, Number(event.target.value))) / 100;
      const nextState = store.setAmbienceVolume(volume);
      audio?.sync({
        enabled: nextState.musicEnabled,
        scene: getAudioScene(uiState.activeScene),
        volume: nextState.ambienceVolume,
      });
      renderApp();
    }
  };
}

function handleAvatarUpload(input, store, uiState, renderApp) {
  const file = input.files?.[0];

  if (!file || !file.type.startsWith("image/")) {
    input.value = "";
    return;
  }

  resizeAvatarImage(file)
    .then(function selectCustomAvatar(dataUrl) {
      uiState.aboutDraft = {
        ...readAboutDraftFromForm(store, uiState),
        avatarId: "custom",
        customAvatarImage: dataUrl,
      };
      input.value = "";
      renderApp();
    })
    .catch(function clearFailedUpload() {
      input.value = "";
      updateAboutStatus("Не удалось загрузить изображение.");
    });
}

function resizeAvatarImage(file) {
  return new Promise(function loadFile(resolve, reject) {
    const reader = new FileReader();

    reader.onload = function handleRead() {
      const image = new Image();

      image.onload = function handleImageLoad() {
        const size = 512;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - sourceSize) / 2;
        const sourceY = (image.naturalHeight - sourceSize) / 2;

        canvas.width = size;
        canvas.height = size;
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);

        const mimeType = canvas.toDataURL("image/webp", 0.82).startsWith("data:image/webp")
          ? "image/webp"
          : "image/jpeg";

        resolve(canvas.toDataURL(mimeType, 0.82));
      };

      image.onerror = reject;
      image.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function updatePressedSoundControl(trigger, soundEnabled) {
  const isMuted = !soundEnabled;
  trigger.classList.toggle("sound-off", isMuted);
  trigger.setAttribute("aria-pressed", isMuted ? "true" : "false");
  trigger.setAttribute("aria-label", isMuted ? "Звук выключен" : "Звук включён");
  trigger.dataset.soundState = isMuted ? "off" : "on";

  const label = trigger.querySelector("#cover-sound-label");
  if (label) {
    label.textContent = isMuted ? "Без звука" : "Звук";
  }
}

export function resolveRitual(deps, mode) {
  const { audio, cards, renderApp, renderer, setScene, store, uiState } = deps;
  const currentState = store.getState();

  uiState.continuationOffer = null;
  audio.playRustle(currentState.soundEnabled);

  if (mode === "free") {
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    uiState.currentQuestion = uiState.rawQuestion;
    const reading = createReading(cards, true, new Date(), {
      previousReading: getPreviousTraceReading(currentState, cards),
      question: uiState.rawQuestion,
      questionRoute,
      recentCardNames: uiState.recentCardNames,
    });
    rememberRecentCards(uiState, [reading.card]);

    store.markDailyFreeUsed(new Date().toISOString());
    store.saveReading(reading, {
      date: reading.createdAt,
      message: reading.card.message,
      question: uiState.currentQuestion,
    });
    setScene(SCENES.RESULT);
    renderer.animateDeck();
    audio.sync({ enabled: currentState.soundEnabled, scene: SCENES.RESULT });
    window.setTimeout(function playSingleReveal() {
      audio.playReveal(currentState.soundEnabled);
    }, 380);
    resetViewport(SCENES.RESULT);
    return;
  }

  if (mode === "extra-draw") {
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    uiState.currentQuestion = uiState.rawQuestion;
    const reading = createReading(cards, false, new Date(), {
      previousReading: getPreviousTraceReading(currentState, cards),
      question: uiState.rawQuestion,
      questionRoute,
      recentCardNames: uiState.recentCardNames,
    });
    rememberRecentCards(uiState, [reading.card]);

    store.saveReading(reading, {
      saveDailyTrace: false,
    });
    setScene(SCENES.RESULT);
    renderer.animateDeck();
    audio.sync({ enabled: currentState.soundEnabled, scene: SCENES.RESULT });
    window.setTimeout(function playSingleReveal() {
      audio.playReveal(currentState.soundEnabled);
    }, 380);
    resetViewport(SCENES.RESULT);
    return;
  }

  if (mode === "deep-reading") {
    store.unlockCurrentReadingDepth();
    setScene(SCENES.RESULT);
    renderApp();
    resetViewport(SCENES.RESULT);
    return;
  }

  if (mode === "spread-3" || mode === "spread-5") {
    const count = mode === "spread-3" ? 3 : 5;
    const shouldPinCurrentReading = uiState.pinCurrentReadingForSpread === true;
    uiState.pinCurrentReadingForSpread = false;
    const questionRoute = detectQuestionRoute(uiState.rawQuestion);
    const archetype = detectArchetype(uiState.rawQuestion);
    const positions = getArchetypePositions(archetype, count);
    const spreadCards = applyArchetypePositionLabels(
      createSpread(cards, count, {
        previousReading: shouldPinCurrentReading ? getPreviousTraceReading(currentState, cards) : null,
        currentReading: shouldPinCurrentReading ? currentState.currentReading : null,
        previousSpread: currentState.lastSpread,
        question: uiState.rawQuestion,
        questionRoute,
        recentCardNames: uiState.recentCardNames,
      }),
      positions,
    );
    rememberRecentCards(uiState, spreadCards);
    const oracleReading = buildLocalOracleReading(count === 3 ? "deepening" : "oracle_reading", spreadCards, {
      archetype,
      positions,
      question: uiState.rawQuestion,
      questionRoute,
    });
    store.saveSpread(spreadCards, oracleReading);
    setScene(SCENES.SPREAD);
    audio.sync({ enabled: currentState.soundEnabled, scene: SCENES.SPREAD });
    playSpreadSequence(audio, currentState.soundEnabled, count);
    resetViewport(SCENES.SPREAD);
    return;
  }

  renderApp();
}

export function createInitialUIState(state) {
  return {
    activeScene: SCENES.COVER,
    aboutReturnScene: SCENES.COVER,
    aboutDraft: null,
    aboutUnsavedSheetOpen: false,
    continuationOffer: null,
    currentQuestion: "",
    tracesReturnScene: getReturnScene(null, state),
    rawQuestion: "",
    remindersDraft: null,
    soundSettingsOpen: false,
    timePickerOpen: false,
    timePickerDraft: null,
    spiritBookPage: 0,
    spiritBookNavigationLockedUntil: 0,
    onboardingReturn: SCENES.COVER,
    activeHistoryTraceId: null,
    historySheetOpenedWithKeyboard: false,
    pinCurrentReadingForSpread: false,
    recentCardNames: [],
    transitioning: false,
  };
}

export function createDeckQuestionGuidance() {
  let questionHeldInHeart = false;
  let lineBreakMode = null;
  let lineBreakModeTimer = 0;

  return {
    connect,
    sync: updateDeckQuestionState,
  };

  function connect() {
    const questionEl = document.getElementById("question-input");
    const deckCard = document.querySelector("[data-action='draw']");

    if (!questionEl || !deckCard) {
      return;
    }

    questionEl.addEventListener("input", function handleQuestionInput() {
      questionHeldInHeart = false;
      updateDeckQuestionState("input");
    });

    questionEl.addEventListener("focus", function handleQuestionFocus() {
      questionHeldInHeart = false;
      updateDeckQuestionState("focus");
    });

    questionEl.addEventListener("blur", function handleQuestionBlur() {
      updateDeckQuestionState("blur");
    });

    questionEl.addEventListener("keydown", function handleQuestionEnter(event) {
      if (event.key !== "Enter") {
        return;
      }

      window.clearTimeout(lineBreakModeTimer);
      lineBreakMode = event.shiftKey ? "newline" : "accept";
      lineBreakModeTimer = window.setTimeout(function resetLineBreakMode() {
        lineBreakMode = null;
      }, 0);

      if (event.shiftKey) {
        return;
      }

      event.preventDefault();
      acceptQuestionIntent(questionEl, deckCard);
    });

    questionEl.addEventListener("beforeinput", function handleQuestionLineBreak(event) {
      if (event.inputType !== "insertLineBreak") {
        return;
      }

      if (lineBreakMode === "newline") {
        lineBreakMode = null;
        return;
      }

      event.preventDefault();
      if (lineBreakMode !== "accept") {
        acceptQuestionIntent(questionEl, deckCard);
      }
      lineBreakMode = null;
    });

    updateDeckQuestionState("init");
  }

  function acceptQuestionIntent(questionEl, deckCard) {
    const hasQuestion = questionEl.value.trim().length > 0;

    questionHeldInHeart = !hasQuestion;
    if (!hasQuestion) {
      questionEl.value = "";
    }

    questionEl.blur();
    updateDeckQuestionState(hasQuestion ? "accept" : "hold");
    deckCard.focus({ preventScroll: true });
  }

  function updateDeckQuestionState(source) {
    const deckWrap = document.getElementById("deck-wrap");
    const questionEl = document.getElementById("question-input");
    const touchMain = document.getElementById("deck-touch-main");
    const status = document.getElementById("deck-question-status");

    if (!deckWrap || !questionEl) {
      return;
    }

    const hasQuestion = questionEl.value.trim().length > 0;
    const isFocused = document.activeElement === questionEl;
    const isQuestionHeld = questionHeldInHeart && !hasQuestion && !isFocused;
    const isReady = hasQuestion && (!isFocused || source === "accept");
    const isWriting = hasQuestion && isFocused && source !== "accept";
    const isDeckReady = isReady || isQuestionHeld;

    deckWrap.classList.toggle("is-question-empty", !hasQuestion);
    deckWrap.classList.toggle("is-question-writing", isWriting);
    deckWrap.classList.toggle("is-question-ready", isDeckReady);

    if (touchMain) {
      touchMain.textContent = "Коснись колоды";
    }

    if (status) {
      status.textContent = isReady || isQuestionHeld
        ? "Вопрос принят. Теперь коснись колоды."
        : hasQuestion
            ? "Когда вопрос готов, нажми Enter или коснись колоды."
            : "Сначала задай вопрос. Потом коснись колоды.";
    }
  }

}

function syncQuestionFromInput(uiState) {
  const questionEl = document.getElementById("question-input");

  if (!questionEl) {
    return;
  }

  uiState.rawQuestion = questionEl.value.trim();
  uiState.currentQuestion = uiState.rawQuestion;
}

function getArchetypePositions(archetype, cardCount) {
  const spreadSize = cardCount === 3 ? "spread3" : cardCount === 5 ? "spread5" : null;

  return spreadSize ? ARCHETYPE_POSITIONS[archetype]?.[spreadSize] || ARCHETYPE_POSITIONS.A[spreadSize] : null;
}

function applyArchetypePositionLabels(spreadCards, positions) {
  if (!Array.isArray(spreadCards) || !Array.isArray(positions)) {
    return spreadCards;
  }

  return spreadCards.map(function mapSpreadPosition(card) {
    const position = positions[Math.max(Number(card.slot || 1) - 1, 0)];

    if (!position) {
      return card;
    }

    return {
      ...card,
      spreadPositionId: position.id,
      spreadLabel: position.label,
    };
  });
}

function rememberRecentCards(uiState, cards) {
  const cardNames = (Array.isArray(cards) ? cards : [])
    .map(function mapCardName(card) {
      return card?.name;
    })
    .filter(Boolean);

  uiState.recentCardNames = [...cardNames, ...(uiState.recentCardNames || [])].slice(0, 7);
}

function getPreviousTraceReading(state, cards) {
  const trace = Array.isArray(state.history) ? state.history[0] : null;
  const card = trace ? cards.find((candidate) => candidate.id === trace.cardId) : null;

  return card ? { card } : state.currentReading || null;
}

function closeHistoryEntry(uiState, renderApp) {
  uiState.activeHistoryTraceId = null;
  uiState.historySheetOpenedWithKeyboard = false;
  renderApp();
}
