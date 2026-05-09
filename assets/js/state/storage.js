import {
  clearExpiredDailyFreeUsedAt,
  cloneState,
  createReadingState,
  createSpreadState,
  DEFAULT_STATE,
  hasFreeDrawAvailable,
  normalizeState,
  resetState,
  unlockReadingDepth,
} from "./model.js";

export const STORAGE_KEY = "wyrd-local-state-v2";

export function createStateStore(storage = window.localStorage) {
  let state = loadState(storage);

  function commit(nextState) {
    state = normalizeState(nextState);
    persistState(storage, state);
    return cloneState(state);
  }

  function syncDayBoundary() {
    const nextState = clearExpiredDailyFreeUsedAt(state);

    if (nextState.dailyFreeUsedAt === state.dailyFreeUsedAt) {
      return cloneState(state);
    }

    return commit(nextState);
  }

  return {
    getState() {
      return cloneState(state);
    },
    syncDayBoundary,
    hasFreeDraw() {
      return hasFreeDrawAvailable(syncDayBoundary());
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
      return commit(createReadingState(state, reading));
    },
    unlockCurrentReadingDepth() {
      return commit(unlockReadingDepth(state));
    },
    saveSpread(lastSpread, lastOracleReading = null) {
      return commit(createSpreadState(state, lastSpread, lastOracleReading));
    },
    reset() {
      return commit(resetState());
    },
  };
}

function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return resetState();
    }

    return normalizeState(JSON.parse(raw));
  } catch (error) {
    return resetState();
  }
}

function persistState(storage, state) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
