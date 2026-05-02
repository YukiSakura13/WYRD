import { CARDS } from "../data/cards.js";

export const STORAGE_KEY = "wyrd-local-state-v2";

const CARD_BY_ID = new Map(CARDS.map((card) => [card.id, card]));

const defaultState = Object.freeze({
  profileName: "Странник",
  soundEnabled: true,
  ambienceVolume: 0.58,
  onboardingSeen: false,
  selectedMode: "single",
  dailyFreeUsedAt: null,
  history: [],
  currentReading: null,
  lastSpread: [],
  lastOracleReading: null,
});

export function createStateStore(storage = window.localStorage) {
  let state = loadState(storage);

  function commit(nextState) {
    state = normalizeState(nextState);
    persistState(storage, state);
    return clone(state);
  }

  function syncDayBoundary() {
    if (!state.dailyFreeUsedAt) {
      return clone(state);
    }

    const usedAt = new Date(state.dailyFreeUsedAt);
    const now = new Date();

    if (usedAt.toDateString() !== now.toDateString()) {
      return commit({
        ...state,
        dailyFreeUsedAt: null,
      });
    }

    return clone(state);
  }

  return {
    getState() {
      return clone(state);
    },
    syncDayBoundary,
    hasFreeDraw() {
      return !syncDayBoundary().dailyFreeUsedAt;
    },
    toggleSound() {
      return commit({
        ...state,
        soundEnabled: !state.soundEnabled,
      });
    },
    setAmbienceVolume(ambienceVolume) {
      return commit({
        ...state,
        ambienceVolume,
      });
    },
    markOnboardingSeen() {
      return commit({
        ...state,
        onboardingSeen: true,
      });
    },
    resetOnboardingSeen() {
      return commit({
        ...state,
        onboardingSeen: false,
      });
    },
    setSelectedMode(selectedMode) {
      return commit({
        ...state,
        selectedMode,
      });
    },
    markDailyFreeUsed(usedAt) {
      return commit({
        ...state,
        dailyFreeUsedAt: usedAt,
      });
    },
    saveReading(reading) {
      return commit({
        ...state,
        currentReading: reading,
        lastSpread: [],
        lastOracleReading: null,
        history: [reading, ...state.history],
      });
    },
    unlockCurrentReadingDepth() {
      if (!state.currentReading) {
        return clone(state);
      }

      const currentReading = {
        ...state.currentReading,
        depthUnlocked: true,
      };

      return commit({
        ...state,
        currentReading,
        history: state.history.map((reading) =>
          reading.id === currentReading.id
            ? {
                ...reading,
                depthUnlocked: true,
              }
            : reading,
        ),
      });
    },
    saveSpread(lastSpread, lastOracleReading = null) {
      return commit({
        ...state,
        currentReading: null,
        lastSpread,
        lastOracleReading,
      });
    },
    reset() {
      return commit(defaultState);
    },
  };
}

function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(defaultState);
    }

    return normalizeState(JSON.parse(raw));
  } catch (error) {
    return clone(defaultState);
  }
}

function persistState(storage, state) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeState(value) {
  const base = clone(defaultState);
  const next = value && typeof value === "object" ? { ...base, ...value } : base;

  next.history = Array.isArray(next.history) ? next.history.map(normalizeReading).filter(Boolean) : [];
  next.lastSpread = Array.isArray(next.lastSpread) ? next.lastSpread.map(normalizeSpreadCard).filter(Boolean) : [];
  next.lastOracleReading =
    next.lastOracleReading && typeof next.lastOracleReading === "object" ? next.lastOracleReading : null;
  next.currentReading =
    next.currentReading && typeof next.currentReading === "object" ? normalizeReading(next.currentReading) : null;
  next.dailyFreeUsedAt = typeof next.dailyFreeUsedAt === "string" ? next.dailyFreeUsedAt : null;
  next.profileName = typeof next.profileName === "string" ? next.profileName : base.profileName;
  next.soundEnabled = Boolean(next.soundEnabled);
  next.ambienceVolume = typeof next.ambienceVolume === "number" ? next.ambienceVolume : base.ambienceVolume;
  next.ambienceVolume = Math.max(0, Math.min(1, next.ambienceVolume));
  next.onboardingSeen = Boolean(next.onboardingSeen);
  next.selectedMode =
    next.selectedMode === "spread-3" || next.selectedMode === "spread-5" ? next.selectedMode : "single";

  if (next.lastSpread.length) {
    next.currentReading = null;
  }

  if (next.currentReading) {
    next.lastSpread = [];
    next.lastOracleReading = null;
  }

  return next;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeReading(reading) {
  if (!reading || typeof reading !== "object" || !reading.card) {
    return null;
  }

  const card = normalizeCard(reading.card);
  if (!card) {
    return null;
  }

  return {
    ...reading,
    card,
  };
}

function normalizeSpreadCard(card) {
  return normalizeCard(card);
}

function normalizeCard(card) {
  if (!card || typeof card !== "object" || typeof card.id !== "string") {
    return null;
  }

  const canonicalCard = CARD_BY_ID.get(card.id);
  if (!canonicalCard) {
    return card;
  }

  return {
    ...card,
    ...canonicalCard,
  };
}
