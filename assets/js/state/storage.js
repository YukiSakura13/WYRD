import {
  clearExpiredDailyFreeUsedAt,
  clearCurrentRitual,
  cloneState,
  createReadingState,
  createSpreadState,
  DEFAULT_STATE,
  hasFreeDrawAvailable,
  normalizeState,
  popRitualLayer,
  resetState,
  unlockReadingDepth,
} from "./model.js";

export const STORAGE_KEY = "wyrd-local-state-v2";

export function createStateStore(storage = getSafeStorage()) {
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
    saveReading(reading, options = {}) {
      return commit(createReadingState(state, reading, options));
    },
    unlockCurrentReadingDepth() {
      return commit(unlockReadingDepth(state));
    },
    saveSpread(lastSpread, lastOracleReading = null, options = {}) {
      return commit(createSpreadState(state, lastSpread, lastOracleReading, options));
    },
    goBackRitualLayer() {
      return commit(popRitualLayer(state));
    },
    clearCurrentRitual() {
      return commit(clearCurrentRitual(state));
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
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Some file:// and private browsing contexts block persistent storage.
  }
}

function getSafeStorage() {
  try {
    const storage = window.localStorage;
    const testKey = `${STORAGE_KEY}:test`;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return storage;
  } catch (error) {
    return createMemoryStorage();
  }
}

function createMemoryStorage() {
  const data = new Map();

  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}
