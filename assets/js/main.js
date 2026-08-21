import { createForestAudioController } from "./audio.js";
import { CARDS, COVER_IMAGE } from "./data/cards.js";
import { registerServiceWorker } from "./pwa.js";
import { detectQuestionRoute } from "./cards/question-routing.js";
import { createStateStore } from "./state/storage.js";
import {
  createActionHandler,
  createDeckQuestionGuidance,
  createInitialUIState,
  createInputChangeHandler,
} from "./ui/actions.js";
import { createCoverCtaAnimation } from "./ui/cover-cta.js";
import { createForestMotion } from "./ui/forest-motion.js";
import { createHistorySheetDrag } from "./ui/history-sheet-drag.js";
import { createRenderer, getElements } from "./ui/render.js";
import { SCENES, isKnownScene } from "./ui/scenes.js";

const store = createStateStore();
const uiState = createInitialUIState(store.getState());
const elements = getElements();
const renderer = createRenderer(elements);
const audio = createForestAudioController(() => store.getState());
const deckQuestionGuidance = createDeckQuestionGuidance();
window.debugRoute = function debugRoute(question) {
  const route = detectQuestionRoute(question);
  const rankedScores = Object.entries(route.scores).sort(function sortByScore(left, right) {
    return right[1] - left[1];
  });

  console.table(
    rankedScores.map(function mapScore([group, score]) {
      return {
        group,
        score,
        winner: group === route.primaryGroup ? "← winner" : "",
      };
    }),
  );
  console.log("winner:", route.primaryGroup);
  console.log("secondary:", route.secondaryGroup);
  console.log("matched:", route.matched);
  console.log("normalized:", route.normalizedQuestion);

  return route;
};

function setScene(scene) {
  if (!isKnownScene(scene)) {
    console.error(`Unknown WYRD scene: ${scene}`);
    return;
  }

  uiState.activeScene = scene;
  renderApp();
}

if (elements.coverArt) {
  elements.coverArt.src = COVER_IMAGE;
}

createCoverCtaAnimation(document.querySelector(".cover-cta-button"));
createForestMotion(document);
createHistorySheetDrag(document).connect();

if (elements.aboutAvatarTrack) {
  elements.aboutAvatarTrack.addEventListener("focusin", function keepFocusedAvatarVisible(event) {
    const avatar = event.target.closest(".about-avatar, .about-upload-avatar");

    if (!avatar) {
      return;
    }

    window.requestAnimationFrame(function revealFocusedAvatar() {
      if (!avatar.isConnected) {
        return;
      }

      const avatarBounds = avatar.getBoundingClientRect();
      const trackBounds = elements.aboutAvatarTrack.getBoundingClientRect();
      const focusClearance = 8;
      const visibleLeft = Math.max(0, trackBounds.left) + focusClearance;
      const visibleRight = Math.min(window.innerWidth, trackBounds.right) - focusClearance;

      if (avatarBounds.left < visibleLeft || avatarBounds.right > visibleRight) {
        avatar.scrollIntoView({
          behavior: "auto",
          block: "nearest",
          inline: "center",
        });
      }
    });
  });
}

function renderApp() {
  const state = store.syncDayBoundary();
  renderer.render(state, uiState);
  deckQuestionGuidance.sync("render");
}

function renderCoverSoundState(soundEnabled) {
  if (!elements.coverSoundButton) {
    return;
  }

  const isMuted = !soundEnabled;
  elements.coverSoundButton.classList.toggle("sound-off", isMuted);
  elements.coverSoundButton.setAttribute("aria-pressed", isMuted ? "true" : "false");
  elements.coverSoundButton.setAttribute("aria-label", isMuted ? "Звук выключен" : "Звук включён");
  elements.coverSoundButton.dataset.soundState = isMuted ? "off" : "on";

  if (elements.coverSoundLabel) {
    elements.coverSoundLabel.textContent = isMuted ? "Без звука" : "Звук";
  }
}

document.addEventListener(
  "click",
  function handleCoverSoundClick(event) {
    const trigger = event.target.closest("#cover-sound-btn");

    if (!trigger) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const nextState = store.toggleAudio();
    const audioEnabled = nextState.soundEnabled || nextState.musicEnabled;
    renderCoverSoundState(audioEnabled);
    audio.sync({ enabled: audioEnabled, scene: SCENES.DECK });
    renderApp();
  },
  { capture: true },
);

document.addEventListener(
  "click",
  createActionHandler({
    audio,
    cards: CARDS,
    renderApp,
    renderer,
    setScene,
    store,
    uiState,
  }),
);

document.addEventListener(
  "change",
  createInputChangeHandler({
    audio,
    renderApp,
    store,
    uiState,
  }),
);

document.addEventListener(
  "input",
  createInputChangeHandler({
    audio,
    renderApp,
    store,
    uiState,
  }),
);

document.addEventListener("visibilitychange", function refreshLunarDayAfterReturn() {
  if (!document.hidden && uiState.activeScene === SCENES.LUNAR_DAY) {
    renderApp();
  }
});

if (uiState.activeScene !== SCENES.COVER) {
  setScene(uiState.activeScene);
} else {
  renderApp();
}
deckQuestionGuidance.connect();
registerServiceWorker();
