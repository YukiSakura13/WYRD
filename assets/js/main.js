import { createForestAudioController } from "./audio.js";
import { CARDS, COVER_IMAGE } from "./data/cards.js";
import { registerServiceWorker } from "./pwa.js";
import { createStateStore } from "./state/storage.js";
import { createActionHandler, createInitialUIState } from "./ui/actions.js";
import { createRenderer, getElements } from "./ui/render.js";
import { SCENES, isKnownScene } from "./ui/scenes.js";

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
