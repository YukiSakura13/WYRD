export const EMPTY_FATE_PATH_COPY = "Эта карта пришла как послание для твоего пути сейчас";

const KEYWORD_WEIGHT = 3;
const CONTEXT_PAIR_WEIGHT = 4;
const PRIMARY_GROUP_MULTIPLIER = 4;
const SECONDARY_GROUP_MULTIPLIER = 2;
const FALLBACK_FATE_PATH_MULTIPLIER = 2.5;

export const QUESTION_ROUTE_CONFIG = {
  love_romance: {
    title: "Любовь и романтика",
    defaultWeight: 0,
    keywords: [
      "люб",
      "отнош",
      "партнер",
      "партнёр",
      "чувств",
      "страст",
      "расстав",
      "бывш",
      "вернет",
      "вернёт",
      "взаимн",
      "нравлюсь",
      "нравит",
      "симпат",
      "влюб",
      "поцел",
      "ревност",
      "измен",
      "свидан",
      "флирт",
      "сердц",
      "вместе",
      "мы пара",
    ],
    contextPairs: [["любит", "меня"], ["верн", "бывш"], ["что", "между нами"], ["есть", "чувства"], ["будем", "вместе"]],
    cards: [
      "Лунные Влюблённые",
      "Скреплённые Ветви",
      "Хранительница Тихой Верности",
      "Ткач Возвращённого Света",
      "Хранитель Прощающего Сердца",
      "Пламя Под Кожей",
      "Поцелуй Тени",
      "Плакальщица",
      "Судьбоносная Встреча",
    ],
  },
  family_circle: {
    title: "Семья и окружение",
    defaultWeight: 0,
    keywords: [
      "семь",
      "дом",
      "друз",
      "окруж",
      "родн",
      "поддерж",
      "манипуля",
      "враг",
      "мама",
      "папа",
      "родител",
      "брат",
      "сестр",
      "сын",
      "дочь",
      "близк",
      "довер",
      "сво",
      "чуж",
      "токсич",
    ],
    contextPairs: [["кому", "доверять"], ["семья", "конфликт"], ["друг", "совет"], ["кто", "поддержит"], ["родные", "отношения"]],
    cards: [
      "Свой Костёр",
      "Дом Под Корой",
      "Родная Стая",
      "Чужая Стая",
      "Тропа Домой",
      "Дружеский Совет",
      "Тёмный Гость",
    ],
  },
  career_money: {
    title: "Карьера и деньги",
    defaultWeight: 0,
    keywords: [
      "работ",
      "карьер",
      "деньг",
      "проект",
      "бизнес",
      "доход",
      "професс",
      "повышен",
      "зарплат",
      "прибавк",
      "заработ",
      "преми",
      "подработ",
      "ваканс",
      "собесед",
      "увол",
      "уволь",
      "клиент",
      "заказ",
      "продаж",
      "должност",
    ],
    contextPairs: [["деньги", "придут"], ["работ", "менять"], ["проект", "получится"], ["будет", "прибавка"], ["найду", "работу"]],
    cards: [
      "Жаба Верного Часа",
      "Золотой Олень",
      "Крыса Тёмных Троп",
      "Бурундук Лесных Троп",
      "Зерно Урожая",
      "Лесной Резчик",
      "Лестница Ветвей",
      "Золотая Мера",
      "Узел Живого Дела",
      "Старейшина Леса",
      "Знак Главного Пути",
      "Золотой Ручей",
      "Эхо Вершин",
    ],
  },
  fate_path: {
    title: "Судьба и путь",
    defaultWeight: 1,
    keywords: [
      "путь",
      "выбор",
      "судьб",
      "знак",
      "сон",
      "сны",
      "интуиц",
      "предназнач",
      "куда идти",
      "куда дальше",
      "куда",
      "зачем",
      "смысл",
      "направлен",
      "переезд",
      "решен",
      "решить",
      "дорог",
    ],
    contextPairs: [["что", "выбрать"], ["куда", "идти"], ["знак", "судьб"], ["какой", "путь"], ["что", "делать дальше"]],
    cards: [
      "Хранитель Леса",
      "Страж Порога",
      "Страж с Ключом",
      "Выбор",
      "Текущая Река",
      "Хранитель Фонаря",
      "Русалка",
      "Ткачиха Судьбы",
      "Уроборос",
      "Всевидящий Плащ",
      "Хранитель Времени",
      "Хранительница Лунной Вуали",
      "Вещий Ворон",
      "Свеча",
      "Волк с Зеркалом",
      "Орёл",
      "Паук Звёздной Сети",
      "Лисий Огонь",
      "Искра Леса",
      "Скрытый Исток",
      "Соловей Рассвета",
      "Перо Ветра",
      "Светляк в Ночи",
    ],
  },
  trials_growth: {
    title: "Испытания и рост",
    defaultWeight: 0,
    keywords: [
      "криз",
      "страх",
      "боюс",
      "боюсь",
      "испыт",
      "потер",
      "границ",
      "трансформ",
      "отпуст",
      "тяжело",
      "слом",
      "разрыв",
      "больно",
      "тревог",
      "конфликт",
      "давлен",
      "не справ",
      "выжить",
      "пережит",
    ],
    contextPairs: [["как", "пережить"], ["что", "отпустить"], ["страх", "шаг"], ["как", "справиться"], ["боюсь", "сделать шаг"]],
    cards: [
      "Алтарь Пустоты",
      "Рой",
      "Водяной",
      "Туман",
      "Разлом",
      "Венец После Бури",
      "Прыжок Через Огонь",
      "Леший",
      "Ёж Тайной Калитки",
      "Жертвенный Огонь",
      "Цветущая Ветвь",
      "Вестник Чёрных Крыльев",
      "Заря",
    ],
  },
  health_recovery: {
    title: "Здоровье и восстановление",
    defaultWeight: 0,
    keywords: [
      "здоров",
      "сон",
      "устал",
      "сил",
      "отдых",
      "энерг",
      "тело",
      "восстанов",
      "устала",
      "усталость",
      "нет сил",
      "сил нет",
      "выгор",
      "болит",
      "болез",
      "самочувств",
      "ресурс",
      "истощ",
      "отпуск",
      "уехать",
      "поездк",
      "путешеств",
    ],
    contextPairs: [["нет", "сил"], ["нужен", "отдых"], ["устал", "тело"], ["стоит ли", "ехать"], ["поможет", "отдых"]],
    cards: [
      "Зимний Сон",
      "Корень",
      "Собиратель Орехов",
      "Лесной Знахарь",
      "Тишина",
      "Грибница",
      "Круг",
      "Древо Возрождения",
    ],
  },
};

const BRIDGE_CARD_GROUPS = {
  "Хранитель Нитей": ["fate_path", "family_circle", "love_romance"],
};

const CARD_GROUPS = buildCardGroups();

export function normalizeQuestion(question) {
  return typeof question === "string" ? question.trim().toLowerCase().replaceAll("ё", "е") : "";
}

export function scoreQuestionGroups(question) {
  const normalizedQuestion = normalizeQuestion(question);
  const scores = {};

  Object.entries(QUESTION_ROUTE_CONFIG).forEach(function scoreGroup([groupId, config]) {
    let score = config.defaultWeight || 0;

    if (normalizedQuestion) {
      config.keywords.forEach(function scoreKeyword(keyword) {
        if (normalizedQuestion.includes(keyword)) {
          score += KEYWORD_WEIGHT;
        }
      });

      config.contextPairs.forEach(function scoreContextPair(pair) {
        const [first, second] = pair;
        if (normalizedQuestion.includes(first) && normalizedQuestion.includes(second)) {
          score += CONTEXT_PAIR_WEIGHT;
        }
      });
    }

    scores[groupId] = score;
  });

  return {
    normalizedQuestion,
    scores,
  };
}

export function detectQuestionRoute(question) {
  const { normalizedQuestion, scores } = scoreQuestionGroups(question);

  if (!normalizedQuestion) {
    return {
      normalizedQuestion,
      scores,
      primaryGroup: "fate_path",
      secondaryGroup: null,
      reason: "empty",
      matched: false,
      displayQuestion: EMPTY_FATE_PATH_COPY,
    };
  }

  const rankedGroups = Object.entries(scores)
    .map(function buildRankedGroup([groupId, score]) {
      return { groupId, score };
    })
    .sort(function sortByScore(left, right) {
      return right.score - left.score;
    });

  const topGroup = rankedGroups[0];

  if (!topGroup || topGroup.score <= 0) {
    return {
      normalizedQuestion,
      scores,
      primaryGroup: "fate_path",
      secondaryGroup: null,
      reason: "unrecognized",
      matched: false,
      displayQuestion: EMPTY_FATE_PATH_COPY,
    };
  }

  const secondGroup = rankedGroups[1];
  const secondaryGroup =
    secondGroup && secondGroup.score > 0 && topGroup.score - secondGroup.score <= 1 ? secondGroup.groupId : null;

  return {
    normalizedQuestion,
    scores,
    primaryGroup: topGroup.groupId,
    secondaryGroup,
    reason: "matched",
    matched: true,
    displayQuestion: question,
  };
}

export function cardBelongsToGroup(cardName, groupId) {
  const groups = CARD_GROUPS[cardName];
  return Array.isArray(groups) && groups.includes(groupId);
}

export function getRouteWeightMultiplier(cardName, route) {
  if (!route || !route.primaryGroup) {
    return 1;
  }

  let multiplier = 1;

  if (cardBelongsToGroup(cardName, route.primaryGroup)) {
    multiplier *= route.matched ? PRIMARY_GROUP_MULTIPLIER : FALLBACK_FATE_PATH_MULTIPLIER;
  }

  if (route.secondaryGroup && cardBelongsToGroup(cardName, route.secondaryGroup)) {
    multiplier *= SECONDARY_GROUP_MULTIPLIER;
  }

  return multiplier;
}

export function filterCardsByPrimaryGroup(cards, route) {
  if (!route || !route.primaryGroup) {
    return cards;
  }

  const filteredCards = cards.filter(function filterCard(card) {
    return cardBelongsToGroup(card.name, route.primaryGroup);
  });

  return filteredCards.length ? filteredCards : cards;
}

function buildCardGroups() {
  const cardGroups = {};

  Object.entries(QUESTION_ROUTE_CONFIG).forEach(function registerGroup([groupId, config]) {
    config.cards.forEach(function registerCard(cardName) {
      if (!cardGroups[cardName]) {
        cardGroups[cardName] = [];
      }

      if (!cardGroups[cardName].includes(groupId)) {
        cardGroups[cardName].push(groupId);
      }
    });
  });

  Object.entries(BRIDGE_CARD_GROUPS).forEach(function registerBridgeGroups([cardName, groups]) {
    if (!cardGroups[cardName]) {
      cardGroups[cardName] = [];
    }

    groups.forEach(function addBridgeGroup(groupId) {
      if (!cardGroups[cardName].includes(groupId)) {
        cardGroups[cardName].push(groupId);
      }
    });
  });

  return cardGroups;
}
