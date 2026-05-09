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
});

export function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

export function normalizeState(value) {
  const base = cloneState(DEFAULT_STATE);
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

export function createReadingState(state, reading) {
  return normalizeState({
    ...state,
    currentReading: reading,
    lastSpread: [],
    lastOracleReading: null,
    history: [reading, ...state.history],
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
    history: state.history.map((reading) =>
      reading.id === currentReading.id
        ? {
            ...reading,
            depthUnlocked: true,
          }
        : reading,
    ),
  });
}

export function createSpreadState(state, lastSpread, lastOracleReading = null) {
  return normalizeState({
    ...state,
    currentReading: null,
    lastSpread,
    lastOracleReading,
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
