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
  gifts: [],
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
  next.gifts = Array.isArray(next.gifts) ? normalizeGifts(next.gifts) : [];
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
  const nextGifts =
    options.saveDailyTrace === false
      ? state.gifts
      : createGiftsAfterTrace(state.gifts, nextHistory, state.history);

  return normalizeState({
    ...state,
    currentReading: reading,
    lastSpread: [],
    lastOracleReading: null,
    ritualStack: createSingleRitualStack(reading),
    history: nextHistory,
    gifts: nextGifts,
  });
}

export function revealPendingGifts(state) {
  if (!Array.isArray(state.gifts) || !state.gifts.some((gift) => gift.pendingReveal)) {
    return cloneState(state);
  }

  return normalizeState({
    ...state,
    gifts: state.gifts.map((gift) => ({
      ...gift,
      pendingReveal: false,
    })),
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
    const timezone = normalizeTimezone(entry.timezone);
    const id = typeof entry.id === "string" && entry.id ? entry.id : `daily-trace-${dayKey}`;
    const card = CARD_BY_ID.get(entry.cardId) || null;
    const snapshot = normalizeTraceSnapshot(entry.snapshot, entry, card);

    return {
      id,
      dayKey,
      timezone,
      date,
      cardId: entry.cardId,
      question: typeof entry.question === "string" ? entry.question : "",
      moonPhase: normalizeMoonPhase(entry.moonPhase) || getMoonPhaseType(new Date(date)),
      snapshot,
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
      timezone: getLocalTimezone(),
      date,
      cardId: card.id,
      question: typeof entry.question === "string" ? entry.question : "",
      moonPhase: getMoonPhaseType(new Date(date)),
      snapshot: {
        cardTitle: card.name || "",
        oracleMessage: typeof entry.message === "string" ? entry.message : card.message || "",
        shadowMessage: card.shadow || "",
      },
    };
  }

  return null;
}

function saveDailyTrace(history, reading, options) {
  if (!reading || !reading.card || typeof reading.card.id !== "string") {
    return history;
  }

  const date = normalizeDateString(options.date) || new Date().toISOString();
  const traceDate = new Date(date);
  const dayKey = getLocalDayKey(traceDate);
  const timezone = getLocalTimezone();

  if (history.some((entry) => entry.dayKey === dayKey)) {
    return pruneExpiredHistory(history);
  }

  return pruneExpiredHistory([
    {
      id: `daily-trace-${dayKey}`,
      dayKey,
      timezone,
      date,
      cardId: reading.card.id,
      question: typeof options.question === "string" ? options.question : "",
      moonPhase: getMoonPhaseType(traceDate),
      snapshot: {
        cardTitle: reading.card.name || "",
        oracleMessage: typeof options.message === "string" && options.message ? options.message : reading.card.message || "",
        shadowMessage: reading.card.shadow || "",
      },
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

function getLocalTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch (error) {
    return "UTC";
  }
}

function normalizeTimezone(value) {
  return typeof value === "string" && value.trim() ? value : getLocalTimezone();
}

function normalizeTraceSnapshot(snapshot, entry, card) {
  const source = snapshot && typeof snapshot === "object" ? snapshot : {};

  return {
    cardTitle:
      typeof source.cardTitle === "string" && source.cardTitle
        ? source.cardTitle
        : card?.name || "",
    oracleMessage:
      typeof source.oracleMessage === "string" && source.oracleMessage
        ? source.oracleMessage
        : typeof entry.message === "string" && entry.message
          ? entry.message
          : card?.message || "",
    shadowMessage:
      typeof source.shadowMessage === "string" && source.shadowMessage
        ? source.shadowMessage
        : card?.shadow || "",
  };
}

function normalizeMoonPhase(value) {
  return ["nm", "wc", "fq", "wg", "fm", "wag", "lq", "wac"].includes(value) ? value : null;
}

function getMoonPhaseType(date) {
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const msPerDay = 86400000;
  const lunarCycle = 29.53058770576;
  const daysSince = (date - knownNewMoon) / msPerDay;
  const phase = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;

  if (phase < 1.85) {
    return "nm";
  }
  if (phase < 7.38) {
    return "wc";
  }
  if (phase < 11.08) {
    return "fq";
  }
  if (phase < 14.77) {
    return "wg";
  }
  if (phase < 16.62) {
    return "fm";
  }
  if (phase < 20.31) {
    return "wag";
  }
  if (phase < 24) {
    return "lq";
  }

  return "wac";
}

function normalizeGifts(gifts) {
  const seen = new Set();

  return gifts
    .map(normalizeGiftEntry)
    .filter(Boolean)
    .filter((gift) => {
      if (seen.has(gift.id)) {
        return false;
      }
      seen.add(gift.id);
      return true;
    })
    .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
}

function normalizeGiftEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const receivedAt = normalizeDateString(entry.receivedAt);
  if (!receivedAt) {
    return null;
  }

  const giftKey = typeof entry.giftKey === "string" && entry.giftKey ? entry.giftKey : "moon";

  return {
    id: typeof entry.id === "string" && entry.id ? entry.id : `gift-${giftKey}-${receivedAt}`,
    receivedAt,
    giftKey,
    pendingReveal: Boolean(entry.pendingReveal),
    schemaVersion: Number.isInteger(entry.schemaVersion) ? entry.schemaVersion : 1,
  };
}

function createGiftsAfterTrace(gifts, nextHistory, previousHistory) {
  if (nextHistory.length === previousHistory.length) {
    return gifts;
  }

  const newestTrace = nextHistory[0];
  const streakLength = getConsecutiveTraceCount(nextHistory, newestTrace.dayKey);
  const expectedGiftCount = Math.floor(streakLength / 7);
  const currentStreakGiftCount = countGiftsInCurrentStreak(gifts, newestTrace.dayKey, streakLength);

  if (expectedGiftCount <= currentStreakGiftCount || streakLength < 7) {
    return gifts;
  }

  const giftKey = getGiftKey(gifts.length);

  return [
    {
      id: `gift-${giftKey}-${newestTrace.dayKey}`,
      receivedAt: newestTrace.date,
      giftKey,
      pendingReveal: true,
      schemaVersion: 1,
    },
    ...gifts,
  ];
}

function countGiftsInCurrentStreak(gifts, startDayKey, streakLength) {
  const streakDays = new Set();
  const cursor = parseLocalDayKey(startDayKey);

  for (let index = 0; cursor && index < streakLength; index += 1) {
    streakDays.add(formatLocalDayKey(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }

  return gifts.filter((gift) => streakDays.has(getLocalDayKey(new Date(gift.receivedAt)))).length;
}

function getConsecutiveTraceCount(history, startDayKey) {
  const dayKeys = new Set(history.map((entry) => entry.dayKey).filter(Boolean));
  const cursor = parseLocalDayKey(startDayKey);
  let count = 0;

  while (cursor && dayKeys.has(formatLocalDayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return count;
}

function parseLocalDayKey(dayKey) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!match) {
    return null;
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function formatLocalDayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getGiftKey(index) {
  const giftKeys = [
    "moon",
    "ammonite",
    "resonant",
    "flower",
    "honey",
    "night",
    "fragile",
    "malachite",
    "wild",
    "moss",
    "forest",
    "cedar",
    "crystal",
    "river",
    "transparent",
    "ringing",
    "quiet",
    "morning",
    "root",
    "star",
    "threshold",
  ];

  return giftKeys[index % giftKeys.length];
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
