import { createForestAudioController } from "./audio.js";
import { CARDS, COVER_IMAGE } from "./data/cards.js";
import { registerServiceWorker } from "./pwa.js";
import { createRitualController } from "./ritual.js";
import { createStateStore } from "./state/storage.js";
import { createActionHandler, createInitialUIState, resolveRitual } from "./ui/actions.js";
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
  renderer.render(state, uiState);
}

const ritual = createRitualController({
  duration: 3,
  onTick(value) {
    uiState.overlay = "ritual";
    uiState.ritualCountdown = value;
    renderApp();
  },
  onComplete(mode) {
    resolveRitual(
      {
        audio,
        cards: CARDS,
        renderApp,
        renderer,
        store,
        uiState,
      },
      mode,
    );
  },
});

document.addEventListener(
  "click",
  createActionHandler({
    audio,
    cards: CARDS,
    renderApp,
    renderer,
    ritual,
    store,
    uiState,
  }),
);

renderApp();
registerServiceWorker();
