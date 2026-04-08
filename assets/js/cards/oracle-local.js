import { buildMeaningSummary } from "./meaning-engine.js";

const THEME_LABELS = {
  path: "путь",
  choice: "выбор",
  vision: "видение",
  flow: "течение",
  ending: "завершение",
  rebirth: "перерождение",
  fracture: "разлом",
  insight: "прозрение",
  stillness: "тишина",
  timing: "время",
  winter_rest: "передышка",
  dawn: "рассвет",
  protection: "защита",
  root: "корень",
  attraction: "зов",
  light: "свет",
  ritual: "ритуал",
  deception: "обман",
  sacrifice: "жертва",
  grief: "память сердца",
  threshold: "порог",
  memory: "память",
  threads: "нити судьбы",
  cycle: "круг",
  remedy: "исцеление",
  prophecy: "знак",
  awakening: "пробуждение",
  fate: "судьба",
  key: "ключ",
  web: "связь",
  boundary: "граница",
  patience: "терпение",
  depth: "глубина",
  connection: "связь",
  blessing: "благословение",
  growth: "рост",
  survival: "выживание",
  water_memory: "зов воды",
  uncertainty: "неясность",
  sacred_fire: "огонь перемены",
  circle: "круг",
  spark: "искра",
  joy: "радость",
  release: "освобождение",
  voice: "голос",
  small_steps: "малые шаги",
  guidance: "путеводный свет",
  acceptance: "принятие",
  future_path: "будущий путь",
};

const EMOTION_LABELS = {
  grief: "памяти сердца",
  fear: "напряжения",
  tension: "внутреннего напряжения",
  stillness: "тихого ожидания",
  hope: "надежды",
  clarity: "ясности",
  longing: "ожидания",
  trust: "доверия",
  uncertainty: "неясности",
  acceptance: "принятия",
  power: "силы",
  tenderness: "мягкости",
  rest: "передышки",
  desire: "зова",
  transformation: "перемены",
};

const PATH_TEMPLATES = [
  "Путь уже шевельнулся, он ведёт от %FROM% к %TO%.",
  "Этот знак движется от %FROM% к %TO%, через %THROUGH%.",
  "Лес ведёт тебя от темы %FROM% к теме %TO%, и поворот уже зреет.",
];

export function buildLocalOracleReading(spreadId, cards) {
  const meaning = buildMeaningSummary({ spreadId, cards });
  const oracle_message = buildOracleMessage(meaning);

  return {
    spreadId,
    meaning,
    oracle_message,
    summary: buildSummary(meaning),
    tension: buildTension(meaning),
    path: buildPath(meaning),
    integration_hint: buildHint(meaning),
  };
}

function buildOracleMessage(meaning) {
  const leadTheme = labelTheme(meaning.dominantThemes[0]);
  const secondTheme = labelTheme(meaning.directionalVector.to);
  const support = meaning.supportSignal?.summary || "";

  const opening = `Духи леса говорят: ${buildOpening(meaning, leadTheme)}`;
  const middle = randomFrom(PATH_TEMPLATES)
    .replace("%FROM%", labelTheme(meaning.directionalVector.from))
    .replace("%THROUGH%", labelTheme(meaning.directionalVector.through))
    .replace("%TO%", secondTheme);
  const closing = buildClosing(meaning, support, leadTheme, secondTheme);

  return [opening, middle, closing].filter(Boolean).join(" ");
}

function buildOpening(meaning, leadTheme) {
  if (meaning.centralTension?.type === "hidden_tension") {
    return `в тени уже зреет тема ${leadTheme}, и именно она меняет твой путь.`;
  }

  if (meaning.centralTension?.type === "contrast") {
    return `свет и тень уже встретились, из этой встречи рождается новый поворот.`;
  }

  if (meaning.centralTension?.type === "inner_conflict") {
    return `сердце уже стоит между двумя тропами, и узел этого чтения просит ясности.`;
  }

  return `сейчас путь говорит языком ${labelEmotion(meaning.dominantEmotion)}.`;
}

function buildClosing(meaning, support, leadTheme, secondTheme) {
  if (support) {
    return `${support} ${buildAffirmation(meaning, leadTheme, secondTheme)}`;
  }

  return buildAffirmation(meaning, leadTheme, secondTheme);
}

function buildAffirmation(meaning, leadTheme, secondTheme) {
  if (meaning.dominantEmotion === "hope") {
    return `То, что зреет рядом с темой ${secondTheme}, скоро станет видимее.`;
  }

  if (meaning.dominantEmotion === "uncertainty") {
    return `Ясность уже собирается вокруг темы ${leadTheme}, смотри на самый тихий знак.`;
  }

  if (meaning.dominantEmotion === "grief") {
    return `Память сердца постепенно открывает дорогу туда, где ${secondTheme} становится опорой.`;
  }

  return `Следующий шаг уже связан с темой ${secondTheme}, и лес просит увидеть его вовремя.`;
}

function buildSummary(meaning) {
  const leadTheme = labelTheme(meaning.dominantThemes[0]);
  const toTheme = labelTheme(meaning.directionalVector.to);
  return `Главная нить расклада связана с темой ${leadTheme}, и ведёт к теме ${toTheme}.`;
}

function buildTension(meaning) {
  return meaning.centralTension?.summary || `Сейчас узел чтения связан с темой ${labelTheme(meaning.dominantThemes[0])}.`;
}

function buildPath(meaning) {
  return `Путь идёт от ${labelTheme(meaning.directionalVector.from)} через ${labelTheme(meaning.directionalVector.through)} к ${labelTheme(meaning.directionalVector.to)}.`;
}

function buildHint(meaning) {
  return meaning.supportSignal?.summary || "Смотри внимательнее на знак, который повторяется тише других.";
}

function labelTheme(value) {
  if (!value || value === "unknown") {
    return "скрытому знаку";
  }

  return THEME_LABELS[value] || value.replace(/_/g, " ");
}

function labelEmotion(value) {
  return EMOTION_LABELS[value] || "тихого движения";
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}
