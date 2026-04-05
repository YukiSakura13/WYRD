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

export function createReading(cards, isFree, now = new Date()) {
  const sourceCards = isFree ? cards.filter((card) => card.layer === "present") : cards;
  const card = pickRandomCards(sourceCards, 1)[0];

  return {
    id: `${card.id}-${now.getTime()}`,
    createdAt: now.toISOString(),
    free: isFree,
    depthUnlocked: false,
    card,
  };
}

export function createSpread(cards, count) {
  if (count === 3) {
    return createThreeCardSpread(cards);
  }

  if (count === 5) {
    return createFiveCardSpread(cards);
  }

  return pickRandomCards(cards, count);
}

function pickRandomCards(cards, count) {
  return shuffle(cards.slice()).slice(0, count);
}

function createThreeCardSpread(cards) {
  const present = takeOne(cards, "present");
  const past = takeOne(cards, "past", [present.id]);
  const future = takeOne(cards, "future", [present.id, past.id]);

  return [
    { ...past, slot: 1, revealOrder: 2, spreadRole: "past", spreadLabel: "Прошлое" },
    { ...present, slot: 2, revealOrder: 1, spreadRole: "present", spreadLabel: "Настоящее" },
    { ...future, slot: 3, revealOrder: 3, spreadRole: "future", spreadLabel: "Будущее" },
  ];
}

function createFiveCardSpread(cards) {
  const presentSelf = takeOne(cards, "present");
  const past = takeOne(cards, "past", [presentSelf.id]);
  const presentLead = takeOne(cards, "present", [presentSelf.id, past.id]);
  const hidden = takeOne(cards, null, [presentSelf.id, past.id, presentLead.id]);
  const future = takeOne(cards, "future", [presentSelf.id, past.id, presentLead.id, hidden.id]);

  return [
    { ...presentSelf, slot: 1, revealOrder: 1, spreadRole: "present", spreadLabel: "Ты" },
    { ...past, slot: 2, revealOrder: 2, spreadRole: "past", spreadLabel: "Что держит" },
    { ...presentLead, slot: 3, revealOrder: 3, spreadRole: "present", spreadLabel: "Что ведёт" },
    { ...hidden, slot: 4, revealOrder: 4, spreadRole: "hidden", spreadLabel: "Что скрыто" },
    { ...future, slot: 5, revealOrder: 5, spreadRole: "future", spreadLabel: "Куда ведёт" },
  ];
}

function takeOne(cards, layer, excludedIds = []) {
  const pool = cards.filter((card) => {
    if (excludedIds.includes(card.id)) {
      return false;
    }

    if (!layer) {
      return true;
    }

    return card.layer === layer;
  });

  return pickRandomCards(pool, 1)[0];
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
