export const PAYWALL_COPY = {
  "extra-draw": {
    title: "Ещё одна карта",
    text: "Лес говорит больше, но следующий знак скрыт за дымкой. Открой ещё одну карту, чтобы услышать продолжение.",
    cta: "Открыть ещё карту",
  },
  "deep-reading": {
    title: "Углубить значение",
    text: "Лес говорит больше. Второй слой уже проступает под поверхностью, но полное значение ещё скрыто.",
    cta: "Открыть глубину",
  },
  "spread-3": {
    title: "Расклад на 3 карты",
    text: "Лес говорит больше. Прошлое, настоящее и вектор уже сложились в узор, но карта пути ещё под вуалью.",
    cta: "Открыть расклад",
  },
  "spread-5": {
    title: "Расклад на 5 карт",
    text: "Лес говорит больше. Пять знаков уже шевелятся под туманом, но скрытые связи не откроются без полного расклада.",
    cta: "Открыть расклад",
  },
};

const TONE_WEIGHT_PRESETS = {
  free_present: { light: 0.875, neutral: 1.0, dark: 0.625 },
  past: { light: 0.08, neutral: 0.67, dark: 1.0 },
  present: { light: 0.875, neutral: 1.0, dark: 0.625 },
  future: { light: 1.0, neutral: 0.6, dark: 0.4 },
  hidden: { light: 0.4, neutral: 0.6, dark: 1.0 },
  any: { light: 1.0, neutral: 1.0, dark: 1.0 },
};

const SAME_SPREAD_STATE_MULTIPLIER = 0.25;
const PREVIOUS_READING_STATE_MULTIPLIER = 0.6;
const LINK_BONUS_MULTIPLIER = 1.35;

export function createReading(cards, isFree, now = new Date(), options = {}) {
  const previousReading = options.previousReading || null;
  const card = pickWeightedCard({
    cards,
    layer: isFree ? "present" : null,
    toneWeights: isFree ? TONE_WEIGHT_PRESETS.free_present : TONE_WEIGHT_PRESETS.any,
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
    return createThreeCardSpread(cards, options.previousReading || null);
  }

  if (count === 5) {
    return createFiveCardSpread(cards, options.previousReading || null);
  }

  return pickDistinctCards(cards, count);
}

function createThreeCardSpread(cards, previousReading) {
  const selected = [];

  const present = pickWeightedCard({
    cards,
    layer: "present",
    toneWeights: TONE_WEIGHT_PRESETS.present,
    previousCard: previousReading ? previousReading.card : null,
    usedStates: collectStates(selected),
    excludeIds: collectIds(selected),
  });
  selected.push(present);

  const past = pickWeightedCard({
    cards,
    layer: "past",
    toneWeights: TONE_WEIGHT_PRESETS.past,
    previousCard: present,
    usedStates: collectStates(selected),
    excludeIds: collectIds(selected),
  });
  selected.push(past);

  const future = pickWeightedCard({
    cards,
    layer: "future",
    toneWeights: TONE_WEIGHT_PRESETS.future,
    previousCard: present,
    usedStates: collectStates(selected),
    excludeIds: collectIds(selected),
  });

  return [
    { ...past, slot: 1, revealOrder: 2, spreadRole: "past", spreadLabel: "Прошлое" },
    { ...present, slot: 2, revealOrder: 1, spreadRole: "present", spreadLabel: "Настоящее" },
    { ...future, slot: 3, revealOrder: 3, spreadRole: "future", spreadLabel: "Будущее" },
  ];
}

function createFiveCardSpread(cards, previousReading) {
  const selected = [];

  const presentSelf = pickWeightedCard({
    cards,
    layer: "present",
    toneWeights: TONE_WEIGHT_PRESETS.present,
    previousCard: previousReading ? previousReading.card : null,
    usedStates: collectStates(selected),
    excludeIds: collectIds(selected),
  });
  selected.push(presentSelf);

  const past = pickWeightedCard({
    cards,
    layer: "past",
    toneWeights: TONE_WEIGHT_PRESETS.past,
    previousCard: presentSelf,
    usedStates: collectStates(selected),
    excludeIds: collectIds(selected),
  });
  selected.push(past);

  const presentLead = pickWeightedCard({
    cards,
    layer: "present",
    toneWeights: TONE_WEIGHT_PRESETS.present,
    previousCard: presentSelf,
    usedStates: collectStates(selected),
    excludeIds: collectIds(selected),
  });
  selected.push(presentLead);

  const hidden = pickWeightedCard({
    cards,
    layer: null,
    toneWeights: TONE_WEIGHT_PRESETS.hidden,
    previousCard: past,
    usedStates: collectStates(selected),
    excludeIds: collectIds(selected),
  });
  selected.push(hidden);

  const future = pickWeightedCard({
    cards,
    layer: "future",
    toneWeights: TONE_WEIGHT_PRESETS.future,
    previousCard: presentLead,
    usedStates: collectStates(selected),
    excludeIds: collectIds(selected),
  });

  return [
    { ...presentSelf, slot: 1, revealOrder: 1, spreadRole: "present", spreadLabel: "Ты" },
    { ...past, slot: 2, revealOrder: 2, spreadRole: "past", spreadLabel: "Что держит" },
    { ...presentLead, slot: 3, revealOrder: 3, spreadRole: "present", spreadLabel: "Что ведёт" },
    { ...hidden, slot: 4, revealOrder: 4, spreadRole: "hidden", spreadLabel: "Что скрыто" },
    { ...future, slot: 5, revealOrder: 5, spreadRole: "future", spreadLabel: "Куда ведёт" },
  ];
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
      weight *= SAME_SPREAD_STATE_MULTIPLIER;
    }

    if (previousCard && previousCard.state === card.state) {
      weight *= PREVIOUS_READING_STATE_MULTIPLIER;
    }

    if (previousCard && Array.isArray(previousCard.links) && previousCard.links.includes(card.state)) {
      weight *= LINK_BONUS_MULTIPLIER;
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
