import { ORACLE_CONFIG } from "./oracle-config.js";
import {
  detectQuestionRoute,
  filterCardsByPrimaryGroup,
  getRouteWeightMultiplier,
} from "./question-routing.js";
import { SPREADS_CONFIG } from "./spreads-config.js";

export const CONTINUATION_COPY = ORACLE_CONFIG.continuationCopy;

export function createReading(cards, isFree, now = new Date(), options = {}) {
  const previousReading = options.previousReading || null;
  const questionRoute = options.questionRoute || detectQuestionRoute(options.question || "");
  const recentCardNames = normalizeRecentCardNames(options.recentCardNames);
  const card = pickWeightedCard({
    cards,
    layer: isFree ? "present" : null,
    toneWeights: isFree ? ORACLE_CONFIG.toneWeightPresets.free_present : ORACLE_CONFIG.toneWeightPresets.any,
    previousCard: previousReading ? previousReading.card : null,
    questionRoute,
    primaryGroupOnly: true,
    recentCardNames,
  });

  return {
    id: `${card.id}-${now.getTime()}`,
    createdAt: now.toISOString(),
    free: isFree,
    depthUnlocked: false,
    card,
  };
}

export function createSpread(cards, count, options = {}) {
  const questionRoute = options.questionRoute || detectQuestionRoute(options.question || "");

  if (count === 3) {
    return createThreeCardSpread(cards, {
      ...options,
      questionRoute,
    });
  }

  if (count === 5) {
    return createFiveCardSpread(cards, {
      ...options,
      questionRoute,
    });
  }

  return pickDistinctCards(cards, count);
}

function createThreeCardSpread(cards, options = {}) {
  const pinnedCardsByRole = {};

  if (options.currentReading && options.currentReading.card) {
    pinnedCardsByRole.what_is_happening = {
      ...options.currentReading.card,
      alreadyKnown: true,
    };
  }

  return buildConfiguredSpread(cards, SPREADS_CONFIG.deepening.slots, {
    previousReading: options.previousReading || null,
    pinnedCardsByRole,
    questionRoute: options.questionRoute || null,
    recentCardNames: options.recentCardNames,
  });
}

function createFiveCardSpread(cards, options = {}) {
  const pinnedCardsByRole = {};
  const previousAnchor = Array.isArray(options.previousSpread)
    ? options.previousSpread.find((card) => Number(card.slot) === 1)
    : null;

  if (previousAnchor) {
    pinnedCardsByRole.current_message = {
      ...previousAnchor,
      alreadyKnown: true,
    };
  } else if (options.previousReading && options.previousReading.card) {
    pinnedCardsByRole.current_message = {
      ...options.previousReading.card,
      alreadyKnown: true,
    };
  }

  return buildConfiguredSpread(cards, SPREADS_CONFIG.oracle_reading.slots, {
    previousReading: options.previousReading || null,
    pinnedCardsByRole,
    questionRoute: options.questionRoute || null,
    recentCardNames: options.recentCardNames,
  });
}

function buildConfiguredSpread(cards, slotConfig, options = {}) {
  const selected = [];
  const pinnedCardsByRole = options.pinnedCardsByRole || {};
  const questionRoute = options.questionRoute || null;
  let anchorCard = options.previousReading ? options.previousReading.card : null;
  let recentCardNames = normalizeRecentCardNames(options.recentCardNames);

  return slotConfig.map(function pickSlot(configItem) {
    const pinnedCard = pinnedCardsByRole[configItem.spreadRole];
    if (pinnedCard) {
      selected.push(pinnedCard);
      anchorCard = pinnedCard;
      recentCardNames = rememberRecentCardName(pinnedCard.name, recentCardNames);

      return {
        ...pinnedCard,
        slot: configItem.slot,
        revealOrder: configItem.revealOrder,
        spreadRole: configItem.spreadRole,
        spreadLabel: configItem.spreadLabel,
      };
    }

    const card = pickWeightedCard({
      cards,
      layer: configItem.layer,
      toneWeights: ORACLE_CONFIG.toneWeightPresets[configItem.preset] || ORACLE_CONFIG.toneWeightPresets.any,
      previousCard: anchorCard,
      usedStates: collectStates(selected),
      excludeIds: collectIds(selected),
      questionRoute,
      primaryGroupOnly: Boolean(questionRoute?.primaryGroup && questionRoute?.matched),
      recentCardNames,
    });

    selected.push(card);
    anchorCard = card;
    recentCardNames = rememberRecentCardName(card.name, recentCardNames);

    return {
      ...card,
      slot: configItem.slot,
      revealOrder: configItem.revealOrder,
      spreadRole: configItem.spreadRole,
      spreadLabel: configItem.spreadLabel,
    };
  });
}

function pickWeightedCard({
  cards,
  layer,
  toneWeights,
  previousCard = null,
  usedStates = [],
  excludeIds = [],
  questionRoute = null,
  primaryGroupOnly = false,
  recentCardNames = [],
}) {
  const filteredCards = cards.filter(function filterCard(card) {
    if (excludeIds.includes(card.id)) {
      return false;
    }

    if (layer && card.layer !== layer) {
      return false;
    }

    return true;
  });

  const pool =
    primaryGroupOnly && questionRoute ? filterCardsByPrimaryGroup(filteredCards, questionRoute) : filteredCards;
  const antiRepeatPool = applyRecentCardFilter(pool, recentCardNames);

  const weightedPool = antiRepeatPool.map(function mapWeight(card) {
    let weight = toneWeights[card.tone] ?? 1;

    if (usedStates.includes(card.state)) {
      weight *= ORACLE_CONFIG.multipliers.sameSpreadState;
    }

    if (previousCard && previousCard.state === card.state) {
      weight *= ORACLE_CONFIG.multipliers.previousReadingState;
    }

    if (previousCard && Array.isArray(previousCard.links) && previousCard.links.includes(card.state)) {
      weight *= ORACLE_CONFIG.multipliers.linkBonus;
    }

    weight *= getRouteWeightMultiplier(card.name, questionRoute);

    return {
      card,
      weight: Math.max(weight, 0.0001),
    };
  });

  return weightedRandom(weightedPool);
}

function weightedRandom(weightedPool) {
  const totalWeight = weightedPool.reduce(function sum(accumulator, entry) {
    return accumulator + entry.weight;
  }, 0);

  let threshold = Math.random() * totalWeight;

  for (const entry of weightedPool) {
    threshold -= entry.weight;
    if (threshold <= 0) {
      return entry.card;
    }
  }

  return weightedPool[weightedPool.length - 1].card;
}

function pickDistinctCards(cards, count) {
  return shuffle(cards.slice()).slice(0, count);
}

function applyRecentCardFilter(cards, recentCardNames = []) {
  if (!recentCardNames.length) {
    return cards;
  }

  const availableCards = cards.filter(function filterRecent(card) {
    return !recentCardNames.includes(card.name);
  });
  const uniqueAvailableNames = new Set(availableCards.map(function mapName(card) {
    return card.name;
  }));

  return uniqueAvailableNames.size >= 3 ? availableCards : cards;
}

function normalizeRecentCardNames(recentCardNames) {
  return Array.isArray(recentCardNames) ? recentCardNames.filter(Boolean) : [];
}

function rememberRecentCardName(cardName, recentCardNames) {
  return cardName ? [cardName, ...recentCardNames].slice(0, 7) : recentCardNames;
}

function collectStates(cards) {
  return cards.map(function mapState(card) {
    return card.state;
  });
}

function collectIds(cards) {
  return cards.map(function mapId(card) {
    return card.id;
  });
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = items[index];
    items[index] = items[swapIndex];
    items[swapIndex] = current;
  }

  return items;
}
