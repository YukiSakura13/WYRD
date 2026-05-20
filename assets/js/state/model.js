import { CARDS } from "../data/cards.js";

const CARD_BY_ID = new Map(CARDS.map((card) => [card.id, card]));

export const DEFAULT_STATE = Object.freeze({
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
  ritualStack: [],
});

const HISTORY_RETENTION_MONTHS = 3;

export function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

export function normalizeState(value) {
  const base = cloneState(DEFAULT_STATE);
  const next = value && typeof value === "object" ? { ...base, ...value } : base;

  next.history = Array.isArray(next.history) ? pruneExpiredHistory(next.history.map(normalizeHistoryEntry).filter(Boolean)) : [];
  next.lastSpread = Array.isArray(next.lastSpread) ? next.lastSpread.map(normalizeSpreadCard).filter(Boolean) : [];
  next.lastOracleReading =
    next.lastOracleReading && typeof next.lastOracleReading === "object" ? next.lastOracleReading : null;
  next.ritualStack = Array.isArray(next.ritualStack) ? next.ritualStack.map(normalizeRitualLayer).filter(Boolean) : [];
  next.currentReading =
    next.currentReading && typeof next.currentReading === "object" ? normalizeReading(next.currentReading) : null;
  next.dailyFreeUsedAt = typeof next.dailyFreeUsedAt === "string" ? next.dailyFreeUsedAt : null;
  next.profileName = typeof next.profileName === "string" ? next.profileName : base.profileName;
  next.soundEnabled = Boolean(next.soundEnabled);
  next.ambienceVolume = normalizeAmbienceVolume(next.ambienceVolume, base.ambienceVolume);
  next.onboardingSeen = Boolean(next.onboardingSeen);
  next.selectedMode = normalizeSelectedMode(next.selectedMode);

  return enforceStateInvariants(next);
}

export function clearExpiredDailyFreeUsedAt(state, now = new Date()) {
  if (!state.dailyFreeUsedAt) {
    return cloneState(state);
  }

  const usedAt = new Date(state.dailyFreeUsedAt);
  if (usedAt.toDateString() === now.toDateString()) {
    return cloneState(state);
  }

  return normalizeState({
    ...state,
    dailyFreeUsedAt: null,
  });
}

export function hasFreeDrawAvailable(state, now = new Date()) {
  return !clearExpiredDailyFreeUsedAt(state, now).dailyFreeUsedAt;
}

export function createReadingState(state, reading, options = {}) {
  const nextHistory =
    options.saveDailyTrace === false
      ? state.history
      : saveDailyTrace(state.history, reading, {
          date: options.date || reading.createdAt || new Date().toISOString(),
          message: options.message,
          question: options.question,
        });

  return normalizeState({
    ...state,
    currentReading: reading,
    lastSpread: [],
    lastOracleReading: null,
    ritualStack: createSingleRitualStack(reading),
    history: nextHistory,
  });
}

export function unlockReadingDepth(state) {
  if (!state.currentReading) {
    return cloneState(state);
  }

  const currentReading = {
    ...state.currentReading,
    depthUnlocked: true,
  };

  return normalizeState({
    ...state,
    currentReading,
  });
}

export function createSpreadState(state, lastSpread, lastOracleReading = null, options = {}) {
  return normalizeState({
    ...state,
    currentReading: null,
    lastSpread,
    lastOracleReading,
    ritualStack: createSpreadRitualStack(state, lastSpread, lastOracleReading, options),
  });
}

export function popRitualLayer(state) {
  const stack = Array.isArray(state.ritualStack) ? state.ritualStack : [];

  if (stack.length < 2) {
    return normalizeState({
      ...state,
      currentReading: null,
      lastSpread: [],
      lastOracleReading: null,
      ritualStack: [],
    });
  }

  const nextStack = stack.slice(0, -1);
  const previousLayer = nextStack[nextStack.length - 1];

  if (previousLayer.type === "single") {
    return normalizeState({
      ...state,
      currentReading: previousLayer.reading,
      lastSpread: [],
      lastOracleReading: null,
      ritualStack: nextStack,
    });
  }

  return normalizeState({
    ...state,
    currentReading: null,
    lastSpread: previousLayer.spread,
    lastOracleReading: previousLayer.oracleReading,
    ritualStack: nextStack,
  });
}

export function clearCurrentRitual(state) {
  return normalizeState({
    ...state,
    currentReading: null,
    lastSpread: [],
    lastOracleReading: null,
    ritualStack: [],
  });
}

export function resetState() {
  return cloneState(DEFAULT_STATE);
}

function enforceStateInvariants(state) {
  const next = { ...state };

  if (next.lastSpread.length) {
    next.currentReading = null;
  }

  if (next.currentReading) {
    next.lastSpread = [];
    next.lastOracleReading = null;
  }

  return next;
}

function createSingleRitualStack(reading) {
  return reading ? [{ type: "single", reading }] : [];
}

function createSpreadRitualStack(state, lastSpread, lastOracleReading, options) {
  const spreadSize = Array.isArray(lastSpread) ? lastSpread.length : 0;
  const layer = {
    type: "spread",
    size: spreadSize,
    spread: lastSpread,
    oracleReading: lastOracleReading,
  };
  const existingStack = Array.isArray(state.ritualStack) ? state.ritualStack : [];

  if (options.replaceCurrentLayer) {
    return [...existingStack.slice(0, -1), layer].filter(Boolean);
  }

  if (spreadSize === 3) {
    const singleLayer = state.currentReading ? { type: "single", reading: state.currentReading } : existingStack[0];
    return [singleLayer, layer].filter(Boolean);
  }

  if (spreadSize === 5) {
    return [...existingStack.filter((item) => item.type !== "spread" || item.size !== 5), layer];
  }

  return [...existingStack, layer];
}

function normalizeSelectedMode(selectedMode) {
  return selectedMode === "spread-3" || selectedMode === "spread-5" ? selectedMode : "single";
}

function normalizeAmbienceVolume(ambienceVolume, fallback) {
  const nextValue = typeof ambienceVolume === "number" ? ambienceVolume : fallback;
  return Math.max(0, Math.min(1, nextValue));
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

function normalizeRitualLayer(layer) {
  if (!layer || typeof layer !== "object") {
    return null;
  }

  if (layer.type === "single") {
    const reading = normalizeReading(layer.reading);
    return reading ? { type: "single", reading } : null;
  }

  if (layer.type === "spread") {
    const spread = Array.isArray(layer.spread) ? layer.spread.map(normalizeSpreadCard).filter(Boolean) : [];

    if (!spread.length) {
      return null;
    }

    return {
      type: "spread",
      size: spread.length,
      spread,
      oracleReading: layer.oracleReading && typeof layer.oracleReading === "object" ? layer.oracleReading : null,
    };
  }

  return null;
}

function normalizeHistoryEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  if (typeof entry.cardId === "string") {
    const date = normalizeDateString(entry.date || entry.createdAt);
    if (!date) {
      return null;
    }

    const dayKey = normalizeDayKey(entry.dayKey) || getLocalDayKey(new Date(date));
    const id = typeof entry.id === "string" && entry.id ? entry.id : `daily-trace-${dayKey}`;

    return {
      id,
      dayKey,
      date,
      cardId: entry.cardId,
      question: typeof entry.question === "string" ? entry.question : "",
      message: typeof entry.message === "string" ? entry.message : "",
    };
  }

  // Migrate legacy reading history entries from the pre-trace model.
  if (entry.card && typeof entry.card.id === "string") {
    const date = normalizeDateString(entry.createdAt);
    if (!date) {
      return null;
    }
    const card = normalizeCard(entry.card);
    const dayKey = getLocalDayKey(new Date(date));

    return {
      id: `daily-trace-${dayKey}`,
      dayKey,
      date,
      cardId: card.id,
      question: typeof entry.question === "string" ? entry.question : "",
      message: typeof entry.message === "string" ? entry.message : card.message || "",
    };
  }

  return null;
}

function saveDailyTrace(history, reading, options) {
  if (!reading || !reading.card || typeof reading.card.id !== "string") {
    return history;
  }

  const date = normalizeDateString(options.date) || new Date().toISOString();
  const dayKey = getLocalDayKey(new Date(date));

  if (history.some((entry) => entry.dayKey === dayKey)) {
    return pruneExpiredHistory(history);
  }

  return pruneExpiredHistory([
    {
      id: `daily-trace-${dayKey}`,
      dayKey,
      date,
      cardId: reading.card.id,
      question: typeof options.question === "string" ? options.question : "",
      message: typeof options.message === "string" && options.message ? options.message : reading.card.message || "",
    },
    ...history,
  ]);
}

function pruneExpiredHistory(history, now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - HISTORY_RETENTION_MONTHS);
  const seenDayKeys = new Set();

  return history
    .filter((entry) => new Date(entry.date) >= cutoff)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((entry) => {
      if (seenDayKeys.has(entry.dayKey)) {
        return false;
      }
      seenDayKeys.add(entry.dayKey);
      return true;
    });
}

function normalizeDateString(value) {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function normalizeDayKey(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
