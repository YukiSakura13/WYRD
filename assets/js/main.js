import { createForestAudioController } from "./audio.js";
import { CARDS, COVER_IMAGE } from "./data/cards.js";
import { registerServiceWorker } from "./pwa.js";
import { createStateStore } from "./state/storage.js";
import { createActionHandler, createInitialUIState } from "./ui/actions.js";
import { createRenderer, deriveContentPanel, getElements } from "./ui/render.js";

const store = createStateStore();
const uiState = createInitialUIState(store.getState());
const elements = getElements();
const renderer = createRenderer(elements);
const audio = createForestAudioController();

if (elements.coverArt) {
  elements.coverArt.src = COVER_IMAGE;
}

function renderApp() {
  const state = store.syncDayBoundary();
  uiState.contentPanel = deriveContentPanel(state);
  if (uiState.forceDeck && uiState.overlay === "none") {
    uiState.contentPanel = "deck";
  }
  renderer.render(state, uiState);
}

document.addEventListener(
  "click",
  createActionHandler({
    audio,
    cards: CARDS,
    renderApp,
    renderer,
    store,
    uiState,
  }),
);

renderApp();
registerServiceWorker();
