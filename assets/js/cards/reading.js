import { ORACLE_CONFIG } from "./oracle-config.js";
import {
  detectQuestionRoute,
  filterCardsByPrimaryGroup,
  getRouteWeightMultiplier,
  normalizeQuestion,
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
    message: buildSingleCardMessage(card, options.question || "", questionRoute),
    shadow: buildSingleCardShadow(card, options.question || "", questionRoute),
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

  if (options.previousReading && options.previousReading.card) {
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

function buildSingleCardMessage(card, question, questionRoute) {
  const normalizedQuestion = normalizeQuestion(question);
  const group = questionRoute?.primaryGroup;

  if (!questionRoute?.matched || !normalizedQuestion) {
    return card.message;
  }

  if (group === "career_money") {
    if (hasAny(normalizedQuestion, ["деловая встреч", "клиент"])) {
      return "Встреча может состояться, но её лучше держать в ясных рамках: меньше угадывать чужое настроение, больше опираться на факты. Подготовь главный вопрос и один спокойный следующий шаг.";
    }

    if (hasAny(normalizedQuestion, ["повышен", "повысят", "должност"])) {
      return "Шанс на повышение есть там, где ты показываешь не только старание, но и ценность своей роли. Сейчас важно назвать свой вклад вслух и не ждать, что его заметят без твоего движения.";
    }

    if (hasAny(normalizedQuestion, ["конфликт", "начальник", "начальником"])) {
      return "В конфликте с начальником тебе нужна не резкость, а твёрдая ясность. Сначала отдели обиду от сути дела, потом говори коротко: что происходит, что тебе нужно и где граница.";
    }

    if (hasAny(normalizedQuestion, ["бизнес", "проект", "партнером", "партнер"])) {
      return "У этого дела есть почва, если вы заранее разделите роли, деньги и ответственность. Не проверяй бизнес только доверием: пусть у него будут правила, тогда союз выдержит реальность.";
    }

    return "Вопрос упирается не в удачу, а в ясное действие. Там, где ты называешь цену, роль и следующий шаг, дорога становится заметнее.";
  }

  if (group === "health_recovery") {
    if (hasAny(normalizedQuestion, ["устал", "нет сил", "сил нет", "выгор", "работаю из дома"])) {
      return "Это не лень и не слабость, а перегруз. Сейчас ответ не в том, чтобы сильнее собраться, а в том, чтобы вернуть телу паузу и убрать хотя бы одну лишнюю нагрузку.";
    }

    if (hasAny(normalizedQuestion, ["отпуск", "улет", "поезд", "путешеств", "за границу", "другую страну"])) {
      return "Поездка выглядит как попытка вернуть себе воздух, а не просто сменить место. Дай ей шанс, но не тащи с собой всё, от чего ты едешь отдыхать.";
    }

    return "Тело просит бережности раньше, чем появится идеальный момент для отдыха. Начни с малого восстановления: сон, тишина, меньше давления на себя.";
  }

  if (group === "love_romance") {
    return "Здесь важно не только то, что чувствует другой человек, но и что эта связь делает с тобой. Если рядом с надеждой всё время стоит тревога, лес просит смотреть не на обещания, а на живые поступки.";
  }

  if (group === "family_circle") {
    return "Этот вопрос про близость, доверие и то, рядом с кем тебе становится теплее. Не всем нужно объяснять своё сердце: ищи тех, кто умеет быть рядом без лишнего шума.";
  }

  if (group === "trials_growth") {
    return "Ты стоишь не перед наказанием, а перед трудным местом роста. Не пытайся решить всё сразу: выбери один честный шаг, который вернёт тебе опору.";
  }

  if (group === "fate_path") {
    return "Ответ пока не раскрывается одной прямой линией. Смотри на то, куда тебя тянет спокойнее, а не громче: там путь начинает показывать себя.";
  }

  return card.message;
}

function buildSingleCardShadow(card, question, questionRoute) {
  const normalizedQuestion = normalizeQuestion(question);

  if (!questionRoute?.matched || !normalizedQuestion) {
    return card.shadow;
  }

  if (questionRoute.primaryGroup === "career_money") {
    return "Что ты пытаешься решить тревогой вместо ясного разговора или конкретного условия?";
  }

  if (questionRoute.primaryGroup === "health_recovery") {
    return "Где ты называешь усталость слабостью, хотя на самом деле это просьба о восстановлении?";
  }

  return card.shadow;
}

function hasAny(value, fragments) {
  return fragments.some(function hasFragment(fragment) {
    return value.includes(normalizeQuestion(fragment));
  });
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
