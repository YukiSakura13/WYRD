import { buildMeaningSummary } from "./meaning-engine.js";

const OPENINGS = {
  hidden_tension: [
    "Путь уже дрогнул под твоими ногами.",
    "То, что скрыто, уже меняет рисунок пути.",
    "В тени уже зреет поворот.",
  ],
  contrast: [
    "Свет и тень уже встретились на одной тропе.",
    "На этом пути сошлись ясность и тень.",
    "Сейчас лес открывает поворот, в котором встречаются свет и тень.",
  ],
  inner_conflict: [
    "Выбор стоит ближе, чем кажется.",
    "Сердце уже знает, где начинается верная тропа.",
    "Развилка уже рядом, даже если тишина ещё держит ответ.",
  ],
  emotional_core: [
    "Ответ уже движется к тебе.",
    "Тропа медленно проступает из тишины.",
    "Сейчас лес открывает не весь путь, а его первый верный знак.",
  ],
};

const MIDDLES = {
  uncertainty: [
    "То, что скрыто, скоро станет яснее.",
    "Неясность держится недолго, знак уже проступает сквозь вуаль.",
    "Ответ ещё не назван, но его очертания уже собираются.",
  ],
  grief: [
    "Память сердца больше не держит тебя на месте, она ведёт к новому шагу.",
    "То, что болело дольше других знаков, начинает отпускать дорогу вперёд.",
    "Старый узел ослабевает, и путь становится мягче.",
  ],
  hope: [
    "То, что зреет в тишине, скоро станет видимее.",
    "Рядом уже растёт то, что откроется в своё время.",
    "Скрытый рост скоро даст о себе знать.",
  ],
  tension: [
    "То, что было натянуто слишком долго, уже просит нового движения.",
    "Старый способ держаться теряет силу, и путь просит ясности.",
    "Узел уже назрел, теперь ему нужен верный поворот.",
  ],
  clarity: [
    "Знак уже рядом, теперь важно увидеть его без лишнего шума.",
    "Ясность приходит ближе, когда сердце перестаёт спорить с собой.",
    "То, что казалось далёким, уже подходит к самой границе выбора.",
  ],
  stillness: [
    "Тишина сейчас хранит больше, чем любое поспешное слово.",
    "Пауза не задерживает путь, она собирает его в одно целое.",
    "Сейчас молчание работает точнее любого ответа.",
  ],
  acceptance: [
    "Путь становится легче там, где исчезает лишняя борьба.",
    "Что-то важное уже просит не силы, а согласия.",
    "Следующий шаг открывается там, где ты перестаёшь тянуть старый узел.",
  ],
  transformation: [
    "Перемена уже началась, даже если снаружи всё ещё тихо.",
    "Старый рисунок пути треснул, и в этой трещине уже виден новый свет.",
    "То, что уходит, освобождает место для другого хода.",
  ],
  default: [
    "Скрытый смысл уже касается твоего пути.",
    "Сейчас важен не шум, а самый точный знак.",
    "Следующее движение уже собирается в тишине.",
  ],
};

const CLOSINGS = {
  guidance: [
    "Иди туда, где внутренний свет не гаснет.",
    "Следуй за знаком, который повторяется тише других.",
    "Держись той тропы, где становится спокойнее внутри.",
  ],
  acceptance: [
    "Пусть шаг созреет в своём времени.",
    "Позволь пути открыться без лишней борьбы.",
    "Дай ответу приблизиться в своём ритме.",
  ],
  clarity: [
    "Смотри туда, где становится яснее.",
    "Выбирай то, что собирает тебя, а не рассеивает.",
    "Держись того, что даёт тихую ясность.",
  ],
  rest: [
    "Передышка тоже ведёт вперёд.",
    "Пауза сейчас работает на твой путь.",
    "Пусть тишина договорит то, что ещё не названо.",
  ],
  flow: [
    "Доверься движению, которое уже началось.",
    "Иди туда, где путь течёт свободнее.",
    "Следуй за тем, что двигается без насилия.",
  ],
  softening: [
    "Мягкость сейчас откроет больше, чем усилие.",
    "Позволь пути стать мягче, и знак проявится точнее.",
    "Там, где исчезает лишнее напряжение, становится ближе ответ.",
  ],
  default: [
    "Иди туда, где сердце не спорит с выбором.",
    "Доверься шагу, который уже назрел.",
    "Следуй за тем, что отзывается тихой уверенностью.",
  ],
};

const QUESTION_ECHOES = {
  love: [
    "То, что касается сердца, уже набирает силу.",
    "Нить близости уже тянется к тебе, даже если её шаг ещё тих.",
    "Чувство, о котором ты думаешь, уже ищет свой верный жест.",
  ],
  body: [
    "То, что ты меняешь в себе, любит верный ритм и терпение.",
    "Перемена в теле приходит туда, где шаг становится ровнее.",
    "Твой путь к новой форме просит не рывка, а устойчивого движения.",
  ],
  money: [
    "То, о чём ты спрашиваешь, любит внимательность и зрелый шаг.",
    "Плод, которого ты ждёшь, собирается там, где есть верность делу.",
    "Материя отвечает тем, кто держит путь ровно и без суеты.",
  ],
  study: [
    "То, чему ты сейчас учишься, скоро покажет свою силу.",
    "Усилие уже не пропадает в тишине, оно собирает будущий ответ.",
    "Знание, к которому ты идёшь, уже складывается в верный узор.",
  ],
  choice: [
    "Развилка, о которой ты думаешь, скоро покажет свой настоящий знак.",
    "Ответ на этот выбор уже зреет, даже если имя ему ещё не найдено.",
    "Тропа, о которой ты спрашиваешь, скоро станет различимее.",
  ],
  waiting: [
    "То, чего ты ждёшь, уже движется ближе.",
    "Ожидание не пусто, в нём уже собирается следующий знак.",
    "То, о чём ты спрашиваешь, любит своё время, но не стоит на месте.",
  ],
};

const TONE_BY_GROUP = {
  health_recovery: "Тело знает раньше, чем разум успевает заметить.",
  love_romance: "Сердце уже чувствует то, что ум боится признать.",
  family_circle: "Корни держат крепче, чем кажется снаружи.",
  career_money: "Лес не торопится — и всё равно успевает.",
  trials_growth: "Испытание не останавливает путь — оно и есть путь.",
  fate_path: "Знак уже пришёл. Вопрос только в том, готов ли ты его увидеть.",
};

const GROUP_OPENINGS = {
  health_recovery: [
    "Тело уже подаёт сигнал тише, чем боль, но настойчивее слов.",
    "Сейчас лес отвечает не про путь, а про восстановление и бережность к себе.",
    "То, о чём ты спрашиваешь, касается не рывка, а возвращения сил.",
  ],
};

const GROUP_MIDDLES = {
  health_recovery: [
    "Сейчас важны пауза, сон, ровный ритм и всё, что снимает перегруз с тела.",
    "Ответ лежит в восстановлении: меньше давления, больше покоя, воздуха и времени на передышку.",
    "То, что кажется помехой, может быть просьбой тела замедлиться и перестать тянуть лишнее.",
  ],
};

const GROUP_CLOSINGS = {
  health_recovery: [
    "Слушай не тревогу, а то, где становится легче дышать и спокойнее внутри тела.",
    "Выбирай то, что возвращает силы, а не забирает их остаток.",
    "Пусть восстановление станет ответом раньше, чем следующий рывок.",
  ],
};

const POSITION_VOICE = {
  surface: { lead: "Снаружи:", side: "message" },
  hidden: { lead: "Скрыто:", side: "shadow" },
  shift: { lead: "Ответ:", side: "message" },
  now: { lead: "Сейчас:", side: "message" },
  node: { lead: "Узел:", side: "shadow" },
  past: { lead: "Было:", side: "shadow" },
  root: { lead: "Корень:", side: "shadow" },
  lock: { lead: "Держит:", side: "shadow" },
  movement: { lead: "Уже меняется:", side: "message" },
  vector: { lead: "Ведёт к:", side: "message" },
  start: { lead: "Старт:", side: "message" },
  force: { lead: "Движет:", side: "message" },
  outcome: { lead: "Итог:", side: "message" },
  other: { lead: "В другой стороне:", side: "shadow" },
  between: { lead: "Между вами:", side: "shadow" },
  factor: { lead: "Фактор:", side: "shadow" },
  block: { lead: "Мешает:", side: "shadow" },
  support: { lead: "Держит:", side: "shadow" },
  resource: { lead: "Опора:", side: "message" },
  release: { lead: "Отпустить:", side: "shadow" },
  step: { lead: "Шаг:", side: "message" },
  sign: { lead: "После шага:", side: "message" },
  face: { lead: "Снаружи:", side: "message" },
  person: { lead: "Человек:", side: "message" },
  core: { lead: "Внутри:", side: "shadow" },
  nature: { lead: "Природа:", side: "shadow" },
  motive: { lead: "Мотив:", side: "shadow" },
};

export function buildLocalOracleReading(spreadId, cards, options = {}) {
  const meaning = buildMeaningSummary({ spreadId, cards });
  const question = normalizeQuestion(options.question);
  const questionRoute = options.questionRoute || null;
  const routeGroup = questionRoute?.primaryGroup || questionRoute?.group || null;
  const archetype = options.archetype || null;
  const positions = Array.isArray(options.positions) ? options.positions : null;
  const questionTopic = detectQuestionTopic(question);
  const questionEcho = questionTopic
    ? pickForMeaning(QUESTION_ECHOES[questionTopic] || QUESTION_ECHOES.waiting, meaning, `question:${questionTopic}`)
    : "";

  return {
    spreadId,
    question,
    questionRoute,
    routeGroup,
    archetype,
    positions,
    questionTopic,
    meaning,
    oracle_message: buildOracleMessage(meaning, questionEcho, routeGroup, {
      archetype,
      cards,
      positions,
    }),
  };
}

function buildOracleMessage(meaning, questionEcho = "", routeGroup = null, options = {}) {
  const groupTone = routeGroup && TONE_BY_GROUP[routeGroup] ? TONE_BY_GROUP[routeGroup] : "";

  if (options.positions) {
    return buildPositionAwareOracleMessage({
      cards: options.cards,
      groupTone,
      meaning,
      positions: options.positions,
      questionEcho,
      routeGroup,
    });
  }

  if (routeGroup && GROUP_OPENINGS[routeGroup] && GROUP_MIDDLES[routeGroup] && GROUP_CLOSINGS[routeGroup]) {
    const opening = pickForMeaning(GROUP_OPENINGS[routeGroup], meaning, `group:${routeGroup}:opening`);
    const middle =
      questionEcho || pickForMeaning(GROUP_MIDDLES[routeGroup], meaning, `group:${routeGroup}:middle`);
    const closing = pickForMeaning(GROUP_CLOSINGS[routeGroup], meaning, `group:${routeGroup}:closing`);
    return [groupTone, opening, middle, closing].filter(Boolean).join(" ");
  }

  const opening = pickForMeaning(OPENINGS[meaning.centralTension?.type] || OPENINGS.emotional_core, meaning, 0);
  const middle = questionEcho || pickForMeaning(MIDDLES[meaning.dominantEmotion] || MIDDLES.default, meaning, 1);
  const closing = pickForMeaning(CLOSINGS[meaning.supportSignal?.theme] || CLOSINGS.default, meaning, 2);

  return [groupTone, opening, middle, closing].filter(Boolean).join(" ");
}

function buildPositionAwareOracleMessage({ cards, positions }) {
  const positionLines = positions
    .map(function buildPositionLine(position, index) {
      return buildPositionLineForCard(position, cards[index]);
    })
    .filter(Boolean);

  return positionLines.join(" ");
}

function buildPositionLineForCard(position, card) {
  if (!position || !card) {
    return "";
  }

  const voice = POSITION_VOICE[position.id] || { lead: position.label || "Здесь проявляется", side: "message" };
  const sourceText = voice.side === "shadow" ? card.shadow || card.message : card.message || card.shadow;
  const cardPhrase = makeCardPhrase(sourceText, position.id);

  return `${voice.lead} ${cardPhrase}`;
}

function makeCardPhrase(text, positionId = "") {
  const sentence = getFirstSentence(text);

  if (!sentence) {
    return "ответ становится ближе.";
  }

  return lowercaseFirstLetter(shortenSentence(ensurePeriod(sentence), getPositionPhraseLimit(positionId)));
}

function getFirstSentence(text) {
  const value = typeof text === "string" ? text.trim() : "";

  if (!value) {
    return "";
  }

  const match = value.match(/^[^.!?]+[.!?]?/u);
  return match ? match[0].trim() : value;
}

function lowercaseFirstLetter(text) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function ensurePeriod(text) {
  return /[.!?]$/u.test(text) ? text : `${text}.`;
}

function shortenSentence(sentence, maxLength) {
  const clause = getFirstClause(sentence);

  if (clause.length <= maxLength) {
    return clause;
  }

  const trimmed = clause.slice(0, maxLength).replace(/\s+\S*$/u, "").trim();
  return ensurePeriod(trimmed);
}

function getFirstClause(sentence) {
  const [clause] = sentence.split(/\s+[—–-]\s+|,\s+|;\s+|:\s+/u);
  const trimmedClause = (clause || "").trim();

  if (!trimmedClause || ["то", "того", "там"].includes(trimmedClause.split(/\s+/u).pop()?.toLowerCase())) {
    return sentence;
  }

  return ensurePeriod(trimmedClause);
}

function getPositionPhraseLimit(positionId) {
  return positionId === "outcome" || positionId === "vector" || positionId === "step" ? 96 : 82;
}

function pickForMeaning(options, meaning, salt) {
  const index = hashString(`${meaning.spreadSignature || "wyrd"}:${salt}`) % options.length;
  return options[index];
}

function detectQuestionTopic(question) {
  if (!question) {
    return null;
  }

  const normalized = question.toLowerCase().replaceAll("ё", "е");

  if (matchesAny(normalized, ["люб", "отнош", "встрет", "нрав", "симпат", "поцел", "замуж", "пар", "сердц"])) {
    return "love";
  }

  if (matchesAny(normalized, ["похуд", "вес", "тел", "фигур", "стройн", "внешн", "красив"])) {
    return "body";
  }

  if (matchesAny(normalized, ["деньг", "финанс", "доход", "зарплат", "работ", "бизнес", "клиент", "проект"])) {
    return "money";
  }

  if (matchesAny(normalized, ["учеб", "экзам", "школ", "универ", "оценк", "урок", "сдам", "поступ"])) {
    return "study";
  }

  if (matchesAny(normalized, ["выбор", "решен", "стоит ли", "куда", "какой путь", "переезд"])) {
    return "choice";
  }

  if (matchesAny(normalized, ["получ", "получится", "когда", "ждат", "дожд", "скоро", "успе", "вернет", "ответит"])) {
    return "waiting";
  }

  return null;
}

function matchesAny(question, needles) {
  return needles.some(function matchNeedle(needle) {
    return question.includes(needle);
  });
}

function normalizeQuestion(question) {
  return typeof question === "string" ? question.trim() : "";
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}
