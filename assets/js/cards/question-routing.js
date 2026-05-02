export const EMPTY_FATE_PATH_COPY = "Эта карта пришла как послание для твоего пути сейчас";

const KEYWORD_WEIGHT = 3;
const CONTEXT_PAIR_WEIGHT = 4;
const SOFT_KEYWORD_WEIGHT = 1;
const SOFT_CONTEXT_PAIR_WEIGHT = 1;
const PRIMARY_GROUP_MULTIPLIER = 4;
const SECONDARY_GROUP_MULTIPLIER = 2;
const FALLBACK_FATE_PATH_MULTIPLIER = 2.5;

export const QUESTION_ROUTE_CONFIG = {
  love_romance: {
    title: "Любовь и романтика",
    defaultWeight: 0,
    keywords: [
      "люб",
      "любов",
      "влюблен",
      "влюблена",
      "отнош",
      "партнер",
      "партнёр",
      "чувств",
      "страст",
      "сексуал",
      "секс",
      "расстав",
      "бывш",
      "бывшая",
      "бывший",
      "вернет",
      "вернёт",
      "вернется",
      "вернётся",
      "взаимн",
      "нравлюсь",
      "нравит",
      "симпат",
      "влюб",
      "поцел",
      "ревност",
      "измен",
      "свидан",
      "встреча",
      "флирт",
      "сердц",
      "вместе",
      "пара",
      "союз",
      "серьезно",
      "серьёзно",
      "женится",
      "замуж",
      "жениться",
      "шанс",
      "знакомство",
      "пишет",
      "написал",
      "напишет",
      "ответит",
      "молчит",
      "игнор",
      "скучает",
      "мы пара",
    ],
    contextPairs: [
      ["любит", "меня"],
      ["верн", "бывш"],
      ["что", "между нами"],
      ["есть", "чувства"],
      ["будем", "вместе"],
      ["что он", "чувствует"],
      ["что она", "чувствует"],
      ["я ему", "нравлюсь"],
      ["я еи", "нравлюсь"],
      ["будет ли", "встреча"],
      ["есть ли", "шанс"],
      ["пишет ли", "он"],
      ["ответит ли", "она"],
      ["вернется ли", "он"],
      ["скучает ли", "по мне"],
      ["новая", "любовь"],
      ["встретить", "любовь"],
      ["думает", "обо мне"],
    ],
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
      "семья",
      "дом",
      "домаш",
      "друз",
      "друзья",
      "подруг",
      "друг",
      "окруж",
      "родн",
      "родствен",
      "поддерж",
      "помощ",
      "забот",
      "ссор",
      "манипуля",
      "враг",
      "мама",
      "папа",
      "родител",
      "мать",
      "отец",
      "брат",
      "сестр",
      "сын",
      "дочь",
      "дети",
      "ребенок",
      "ребёнок",
      "близк",
      "близкие",
      "довер",
      "доверять",
      "свои",
      "своих",
      "своим",
      "свой",
      "своя",
      "свою",
      "свой",
      "чуж",
      "токсич",
      "давление",
      "обид",
      "примир",
      "помир",
      "атмосфера дома",
    ],
    contextPairs: [
      ["кому", "доверять"],
      ["семья", "конфликт"],
      ["друг", "совет"],
      ["кто", "поддержит"],
      ["родные", "отношения"],
      ["свои", "люди"],
      ["можно ли", "доверять"],
      ["отношения", "с близкими"],
      ["семейные", "отношения"],
      ["что с", "мамой"],
      ["что с", "папой"],
      ["поссорились", "что делать"],
      ["помиримся", "ли"],
      ["как", "поговорить"],
      ["что с", "близкими"],
    ],
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
      "работа",
      "карьер",
      "деньг",
      "денег",
      "деньги",
      "проект",
      "бизнес",
      "доход",
      "професс",
      "должность",
      "повышен",
      "повышение",
      "повысят",
      "зарплат",
      "зарплата",
      "прибавк",
      "прибавка",
      "заработ",
      "заработок",
      "преми",
      "премия",
      "подработ",
      "подработка",
      "ваканс",
      "вакансия",
      "собесед",
      "собеседование",
      "увол",
      "уволь",
      "уволят",
      "увольняться",
      "клиент",
      "заказ",
      "продаж",
      "продажи",
      "должност",
      "начальник",
      "коллектив",
      "офис",
      "возьмут",
      "платить больше",
      "больше денег",
      "когда деньги",
      "хватит ли денег",
      "хватит ли на жизнь",
    ],
    contextPairs: [
      ["деньги", "придут"],
      ["работ", "менять"],
      ["проект", "получится"],
      ["будет", "прибавка"],
      ["найду", "работу"],
      ["нет", "денег"],
      ["дадут ли", "премию"],
      ["повысят ли", "зарплату"],
      ["стоит ли", "менять работу"],
      ["стоит ли", "уходить с работы"],
      ["возьмут ли", "на работу"],
      ["будет ли", "заказ"],
      ["будет ли", "клиент"],
      ["когда", "деньги"],
    ],
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
      "дорога",
      "выбор",
      "судьб",
      "судьба",
      "знак",
      "знаки",
      "сон",
      "сны",
      "интуиц",
      "внутренний голос",
      "предназнач",
      "призвание",
      "поиск",
      "искать себя",
      "куда идти",
      "куда дальше",
      "куда",
      "зачем",
      "смысл",
      "будущее",
      "впереди",
      "направлен",
      "направление",
      "переезд",
      "уехать",
      "ехать",
      "ехать ли",
      "решен",
      "решить",
      "решение",
      "стоит ли",
      "как поступить",
      "новый этап",
      "этап",
      "поворот",
      "перемены",
      "изменить жизнь",
      "смена",
      "идти дальше",
      "начинать сначала",
      "начать заново",
      "новый путь",
      "что дальше",
      "что ждёт",
      "что ждет",
      "что меня ждёт",
      "что меня ждет",
      "куда двигаться",
      "дорог",
    ],
    softKeywords: ["что делать", "что мне делать"],
    contextPairs: [
      ["что", "выбрать"],
      ["куда", "идти"],
      ["знак", "судьб"],
      ["какой", "путь"],
      ["правильный", "путь"],
      ["верный", "путь"],
      ["стоит ли", "ехать"],
      ["что", "делать дальше"],
      ["куда", "двигаться"],
      ["как", "поступить"],
      ["начинать ли", "сначала"],
    ],
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
      "кризис",
      "страх",
      "боюс",
      "боюсь",
      "боязнь",
      "паника",
      "испыт",
      "испытание",
      "потер",
      "потеря",
      "границ",
      "границы",
      "защит",
      "пространств",
      "отсто",
      "давят",
      "давить",
      "трансформ",
      "отпуст",
      "тяжело",
      "трудно",
      "очень тяжело",
      "слом",
      "сломалась",
      "сломался",
      "разрыв",
      "больно",
      "боль",
      "рана",
      "травм",
      "травма",
      "тревог",
      "конфликт",
      "напряж",
      "напряжение",
      "давлен",
      "давление",
      "наруш",
      "неуют",
      "изоляц",
      "сказать нет",
      "не справ",
      "не справляюсь",
      "выжить",
      "пережит",
      "горе",
      "разочар",
      "шок",
      "трудный период",
      "тяжелый период",
      "тяжёлый период",
      "когда все рушится",
      "когда всё рушится",
    ],
    contextPairs: [
      ["как", "пережить"],
      ["что", "отпустить"],
      ["страх", "шаг"],
      ["как", "справиться"],
      ["боюсь", "сделать шаг"],
      ["что делать", "когда тяжело"],
      ["что делать", "когда больно"],
      ["что делать", "когда страшно"],
      ["как", "не сломаться"],
      ["почему", "так тяжело"],
      ["что если", "все рушится"],
      ["что если", "всё рушится"],
      ["сказать", "нет"],
      ["защитить", "себя"],
      ["личные", "границы"],
      ["мои", "границы"],
      ["отстоять", "пространство"],
      ["нарушают", "границы"],
      ["впускать", "близко"],
    ],
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
      "здоровье",
      "боль",
      "сон",
      "спать",
      "бессон",
      "бессонница",
      "устал",
      "сил",
      "силы",
      "отдых",
      "отдохнуть",
      "отдыхать",
      "энерг",
      "тело",
      "восстанов",
      "восстановление",
      "восстановиться",
      "восстановить",
      "устала",
      "усталость",
      "нет сил",
      "сил нет",
      "выгор",
      "выгорание",
      "болит",
      "болит голова",
      "болит тело",
      "болез",
      "самочувств",
      "самочувствие",
      "ресурс",
      "истощ",
      "истощение",
      "отпуск",
      "уехать",
      "поездк",
      "поездка",
      "путешеств",
      "перегруз",
      "перегорел",
      "перегорела",
      "слабость",
      "слабый",
      "утомлен",
      "утомлена",
      "измотан",
      "измотана",
      "обессилен",
      "обессилена",
      "пауза",
      "тишина",
      "режим",
      "ритм",
      "режим сна",
      "нагрузки",
    ],
    contextPairs: [
      ["нет", "сил"],
      ["нужен", "отдых"],
      ["устал", "тело"],
      ["стоит ли", "ехать"],
      ["поможет", "отдых"],
      ["я", "устала"],
      ["как", "восстановиться"],
      ["как", "прийти в себя"],
      ["как", "отдохнуть"],
      ["когда", "станет легче"],
      ["хочу", "спать"],
      ["хочу", "отдых"],
      ["где", "взять силы"],
      ["что", "лечит"],
    ],
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

      (config.softKeywords || []).forEach(function scoreSoftKeyword(keyword) {
        if (normalizedQuestion.includes(keyword)) {
          score += SOFT_KEYWORD_WEIGHT;
        }
      });

      config.contextPairs.forEach(function scoreContextPair(pair) {
        const [first, second] = pair;
        if (normalizedQuestion.includes(first) && normalizedQuestion.includes(second)) {
          score += CONTEXT_PAIR_WEIGHT;
        }
      });

      (config.softContextPairs || []).forEach(function scoreSoftContextPair(pair) {
        const [first, second] = pair;
        if (normalizedQuestion.includes(first) && normalizedQuestion.includes(second)) {
          score += SOFT_CONTEXT_PAIR_WEIGHT;
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
