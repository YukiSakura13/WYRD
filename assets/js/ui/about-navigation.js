import { SCENES } from "./scenes.js";

export const ABOUT_HASH = "#about-wyrd";
const DEFAULT_TITLE = "WYRD — Оракул духов леса";
const ABOUT_TITLE = "О WYRD — Книга леса";

export function isAboutHash(hash = "") {
  return hash === ABOUT_HASH || hash.startsWith(`${ABOUT_HASH}-`);
}

export function getAboutTargetId(hash = "") {
  return isAboutHash(hash) ? hash.slice(1) : ABOUT_HASH.slice(1);
}

export function createAboutNavigation(deps) {
  const { setScene, uiState } = deps;
  const win = deps.windowObject || window;
  const doc = deps.documentObject || document;
  let connected = false;
  let ownsHistoryEntry = false;
  let returnFocusElement = null;

  return {
    clearRoute,
    close,
    connect,
    jump,
    open,
    rememberScroll,
    restoreFromOnboarding,
    syncFromLocation,
  };

  function connect() {
    if (connected) {
      return;
    }

    connected = true;
    win.addEventListener("popstate", syncFromLocation);
    win.addEventListener("hashchange", syncFromLocation);
  }

  function open(trigger) {
    if (uiState.activeScene === SCENES.ABOUT) {
      return;
    }

    uiState.aboutReturnScene = normalizeReturnScene(uiState.activeScene);
    uiState.aboutReturnScrollTop = win.scrollY;
    returnFocusElement = trigger || null;
    ownsHistoryEntry = true;
    win.history.pushState({ wyrdScene: SCENES.ABOUT }, "", ABOUT_HASH);
    showAbout({ focus: true, restoreScroll: false });
  }

  function close() {
    rememberScroll();

    if (ownsHistoryEntry && win.history.length > 1) {
      ownsHistoryEntry = false;
      win.history.back();
      return;
    }

    clearRoute();
    leaveAbout();
  }

  function jump(hash) {
    if (!isAboutHash(hash)) {
      return;
    }

    win.history.replaceState({ wyrdScene: SCENES.ABOUT }, "", hash);
    scheduleAboutPosition({ focus: true, restoreScroll: false });
  }

  function rememberScroll() {
    if (uiState.activeScene === SCENES.ABOUT) {
      uiState.aboutScrollTop = win.scrollY;
    }
  }

  function restoreFromOnboarding() {
    showAbout({ focus: false, restoreScroll: true });
    win.requestAnimationFrame(function restoreReplayFocus() {
      doc.querySelector('[data-action="replay-onboarding"]')?.focus({ preventScroll: true });
    });
  }

  function syncFromLocation(options = {}) {
    const shouldShowAbout = isAboutHash(win.location.hash);

    if (shouldShowAbout) {
      if (uiState.activeScene !== SCENES.ABOUT && uiState.activeScene !== SCENES.ONBOARDING) {
        uiState.aboutReturnScene = normalizeReturnScene(uiState.activeScene);
        uiState.aboutReturnScrollTop = win.scrollY;
        showAbout({ focus: options.focus === true, restoreScroll: false });
      } else if (uiState.activeScene === SCENES.ABOUT) {
        scheduleAboutPosition({ focus: options.focus === true, restoreScroll: false });
      }
      return true;
    }

    if (uiState.activeScene === SCENES.ABOUT) {
      rememberScroll();
      leaveAbout();
    }

    return false;
  }

  function showAbout(options) {
    setScene(SCENES.ABOUT);
    doc.title = ABOUT_TITLE;
    scheduleAboutPosition(options);
  }

  function scheduleAboutPosition({ focus, restoreScroll }) {
    win.requestAnimationFrame(function positionAboutPage() {
      const targetId = getAboutTargetId(win.location.hash);
      const target = doc.getElementById(targetId) || doc.getElementById(ABOUT_HASH.slice(1));
      const isRootTarget = targetId === ABOUT_HASH.slice(1);

      if (isRootTarget) {
        win.scrollTo({ top: restoreScroll ? uiState.aboutScrollTop || 0 : 0, behavior: "auto" });
      } else {
        target?.scrollIntoView({ block: "start", behavior: "auto" });
      }

      if (focus) {
        const focusTarget = isRootTarget ? doc.getElementById("about-wyrd-title") : target;
        focusTarget?.focus({ preventScroll: true });
      }
    });
  }

  function leaveAbout() {
    const returnScene = normalizeReturnScene(uiState.aboutReturnScene);
    setScene(returnScene);
    doc.title = DEFAULT_TITLE;

    win.requestAnimationFrame(function restorePreviousScene() {
      if (returnScene === SCENES.COVER) {
        win.scrollTo({ top: 0, behavior: "auto" });
      } else {
        win.scrollTo({ top: uiState.aboutReturnScrollTop || 0, behavior: "auto" });
      }

      const fallback = returnScene === SCENES.COVER ? doc.querySelector('[data-action="open-about"]') : null;
      const focusTarget = returnFocusElement?.isConnected ? returnFocusElement : fallback;
      focusTarget?.focus({ preventScroll: true });
    });
  }

  function clearRoute() {
    if (!isAboutHash(win.location.hash)) {
      ownsHistoryEntry = false;
      return;
    }

    win.history.replaceState(null, "", `${win.location.pathname}${win.location.search}`);
    ownsHistoryEntry = false;
  }
}

function normalizeReturnScene(scene) {
  if (
    scene === SCENES.COVER ||
    scene === SCENES.DECK ||
    scene === SCENES.RESULT ||
    scene === SCENES.SPREAD ||
    scene === SCENES.PROFILE
  ) {
    return scene;
  }

  return SCENES.COVER;
}
