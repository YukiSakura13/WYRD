import { ORACLE_CONFIG } from "./oracle-config.js";
import { SPREADS_CONFIG } from "./spreads-config.js";

export const CONTINUATION_COPY = ORACLE_CONFIG.continuationCopy;

export function createReading(cards, isFree, now = new Date(), options = {}) {
  const previousReading = options.previousReading || null;
  const card = pickWeightedCard({
    cards,
    layer: isFree ? "present" : null,
    toneWeights: isFree ? ORACLE_CONFIG.toneWeightPresets.free_present : ORACLE_CONFIG.toneWeightPresets.any,
    previousCard: previousReading ? previousReading.card : null,
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
  if (count === 3) {
    return createThreeCardSpread(cards, options);
  }

  if (count === 5) {
    return createFiveCardSpread(cards, options);
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
  });
}

function createFiveCardSpread(cards, options = {}) {
  return buildConfiguredSpread(cards, SPREADS_CONFIG.oracle_reading.slots, {
    previousReading: options.previousReading || null,
  });
}

function buildConfiguredSpread(cards, slotConfig, options = {}) {
  const selected = [];
  const pinnedCardsByRole = options.pinnedCardsByRole || {};
  let anchorCard = options.previousReading ? options.previousReading.card : null;

  return slotConfig.map(function pickSlot(configItem) {
    const pinnedCard = pinnedCardsByRole[configItem.spreadRole];
    if (pinnedCard) {
      selected.push(pinnedCard);
      anchorCard = pinnedCard;

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
    });

    selected.push(card);
    anchorCard = card;

    return {
      ...card,
      slot: configItem.slot,
      revealOrder: configItem.revealOrder,
      spreadRole: configItem.spreadRole,
      spreadLabel: configItem.spreadLabel,
    };
  });
}

function pickWeightedCard({ cards, layer, toneWeights, previousCard = null, usedStates = [], excludeIds = [] }) {
  const pool = cards.filter(function filterCard(card) {
    if (excludeIds.includes(card.id)) {
      return false;
    }

    if (layer && card.layer !== layer) {
      return false;
    }

    return true;
  });

  const weightedPool = pool.map(function mapWeight(card) {
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
