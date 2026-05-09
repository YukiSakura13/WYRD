import { createForestAudioController } from "./audio.js?v=2026-05-09-scene-fix-hotfix-2";
import { CARDS, COVER_IMAGE } from "./data/cards.js?v=2026-05-09-scene-fix-hotfix-2";
import { registerServiceWorker } from "./pwa.js?v=2026-05-09-scene-fix-hotfix-2";
import { createStateStore } from "./state/storage.js?v=2026-05-09-scene-fix-hotfix-2";
import { createActionHandler, createInitialUIState } from "./ui/actions.js?v=2026-05-09-scene-fix-hotfix-2";
import { createRenderer, getElements } from "./ui/render.js?v=2026-05-09-scene-fix-hotfix-2";
import { SCENES, isKnownScene } from "./ui/scenes.js?v=2026-05-09-scene-fix-hotfix-2";

const store = createStateStore();
const uiState = createInitialUIState(store.getState());
const elements = getElements();
const renderer = createRenderer(elements);
const audio = createForestAudioController();

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

function renderApp() {
  const state = store.syncDayBoundary();
  renderer.render(state, uiState);
}

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

if (uiState.activeScene !== SCENES.COVER) {
  setScene(uiState.activeScene);
} else {
  renderApp();
}
registerServiceWorker();
