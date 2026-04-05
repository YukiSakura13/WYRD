export const PAYWALL_COPY = {
  "extra-draw": {
    title: "Ещё одна карта",
    text: "Бесплатная карта на сегодня уже раскрыта. Если хочешь услышать лес снова, открой ещё один ритуал.",
    cta: "Открыть ещё карту",
  },
  "deep-reading": {
    title: "Углубить значение",
    text: "Тень уже сказала своё. Теперь можно спуститься глубже и услышать второй слой послания.",
    cta: "Открыть глубину",
  },
  "spread-3": {
    title: "Расклад на 3 карты",
    text: "Тройной узор покажет прошлое, настоящее и направление следующего шага.",
    cta: "Открыть расклад",
  },
  "spread-5": {
    title: "Расклад на 5 карт",
    text: "Пятикарточный расклад раскроет более глубокий узор и покажет скрытые связи.",
    cta: "Открыть расклад",
  },
};

export function createReading(cards, isFree, now = new Date()) {
  const card = pickRandomCards(cards, 1)[0];

  return {
    id: `${card.id}-${now.getTime()}`,
    createdAt: now.toISOString(),
    free: isFree,
    depthUnlocked: false,
    card,
  };
}

export function createSpread(cards, count) {
  return pickRandomCards(cards, count);
}

function pickRandomCards(cards, count) {
  return shuffle(cards.slice()).slice(0, count);
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
