const BASE_CARD_META = {
  "Хранитель Леса": { state: "path", tone: "neutral", links: ["choice", "vision", "flow"] },
  "Вестник Чёрных Крыльев": { state: "ending", tone: "dark", links: ["rebirth", "dawn", "fracture"] },
  "Всевидящий Плащ": { state: "insight", tone: "neutral", links: ["stillness", "choice", "vision"] },
  "Хранитель Времени": { state: "timing", tone: "light", links: ["stillness", "winter_rest", "dawn"] },
  "Страж Ночи": { state: "protection", tone: "neutral", links: ["boundary", "stillness", "root"] },
  "Хранитель Фонаря": { state: "attraction", tone: "neutral", links: ["vision", "light", "choice"] },
  Леший: { state: "ritual", tone: "dark", links: ["choice", "root", "sacrifice"] },
  "Лисица Девяти Хвостов": { state: "deception", tone: "dark", links: ["insight", "stillness", "threads"] },
  "Хранитель Лунной Вуали": { state: "stillness", tone: "light", links: ["flow", "choice", "acceptance"] },
  "Алтарь Пустоты": { state: "sacrifice", tone: "dark", links: ["fracture", "rebirth", "sacred_fire"] },
  "Древо Возрождения": { state: "rebirth", tone: "neutral", links: ["dawn", "growth", "circle"] },
  Плакальщица: { state: "grief", tone: "dark", links: ["rebirth", "stillness", "flow"] },
  "Страж Порога": { state: "threshold", tone: "light", links: ["choice", "future_path", "key"] },
  "Волк с Зеркалом": { state: "memory", tone: "dark", links: ["fracture", "root", "threshold"] },
  "Ткачиха Судьбы": { state: "threads", tone: "neutral", links: ["fate", "circle", "key"] },
  Уроборос: { state: "cycle", tone: "dark", links: ["rebirth", "circle", "fracture"] },
  "Лесной Знахарь": { state: "remedy", tone: "neutral", links: ["balance", "flow", "choice"] },
  "Вещий Ворон": { state: "prophecy", tone: "light", links: ["vision", "key", "future_path"] },
  Рой: { state: "awakening", tone: "neutral", links: ["fracture", "flow", "future_path"] },
  "Хранитель Нитей": { state: "fate", tone: "dark", links: ["threads", "choice", "circle"] },
  "Страж с Ключом": { state: "key", tone: "light", links: ["threshold", "prophecy", "vision"] },
  "Паук Звёздной Сети": { state: "web", tone: "neutral", links: ["threads", "fate", "insight"] },
  Ёж: { state: "boundary", tone: "neutral", links: ["protection", "stillness", "choice"] },
  Жаба: { state: "patience", tone: "neutral", links: ["timing", "winter_rest", "dawn"] },
  Русалка: { state: "depth", tone: "dark", links: ["flow", "water_memory", "vision"] },
  Свеча: { state: "light", tone: "light", links: ["dawn", "future_path", "spark"] },
  Грибница: { state: "connection", tone: "neutral", links: ["threads", "fate", "joy"] },
  "Золотой Олень": { state: "blessing", tone: "light", links: ["dawn", "growth", "future_path"] },
  Заря: { state: "dawn", tone: "light", links: ["light", "growth", "future_path"] },
  Орёл: { state: "vision", tone: "light", links: ["prophecy", "choice", "future_path"] },
  "Цветущая Ветвь": { state: "growth", tone: "light", links: ["rebirth", "dawn", "blessing"] },
  Крыса: { state: "survival", tone: "dark", links: ["root", "fracture", "choice"] },
  Водяной: { state: "water_memory", tone: "dark", links: ["depth", "grief", "flow"] },
  Туман: { state: "uncertainty", tone: "neutral", links: ["choice", "vision", "stillness"] },
  "Зимний Сон": { state: "winter_rest", tone: "light", links: ["timing", "patience", "dawn"] },
  Выбор: { state: "choice", tone: "neutral", links: ["path", "flow", "future_path"] },
  Разлом: { state: "fracture", tone: "dark", links: ["rebirth", "awakening", "future_path"] },
  Тишина: { state: "stillness", tone: "neutral", links: ["flow", "choice", "acceptance"] },
  "Жертвенный Огонь": { state: "sacred_fire", tone: "dark", links: ["sacrifice", "fracture", "rebirth"] },
  Корень: { state: "root", tone: "dark", links: ["survival", "memory", "choice"] },
  Круг: { state: "circle", tone: "light", links: ["cycle", "threads", "joy"] },
  "Искра Леса": { state: "spark", tone: "light", links: ["joy", "flow", "light"] },
  "Собиратель Орехов": { state: "joy", tone: "light", links: ["spark", "circle", "light"] },
  "Текущая Река": { state: "flow", tone: "light", links: ["stillness", "choice", "acceptance"] },
  "Перо Ветра": { state: "release", tone: "light", links: ["flow", "stillness", "joy"] },
  "Соловей Рассвета": { state: "voice", tone: "light", links: ["dawn", "light", "choice"] },
  "Бурундук Лесных Троп": { state: "small_steps", tone: "light", links: ["path", "choice", "joy"] },
  Светляк: { state: "guidance", tone: "light", links: ["light", "future_path", "choice"] },
};

const STATE_EMOTIONS = {
  grief: "grief",
  stillness: "stillness",
  choice: "tension",
  uncertainty: "uncertainty",
  blessing: "hope",
  dawn: "hope",
  growth: "hope",
  light: "clarity",
  vision: "clarity",
  prophecy: "clarity",
  guidance: "clarity",
  root: "tension",
  sacrifice: "tension",
  sacred_fire: "tension",
  fracture: "fear",
  deception: "fear",
  threshold: "tension",
  memory: "longing",
  water_memory: "longing",
  winter_rest: "rest",
  patience: "rest",
  joy: "tenderness",
  flow: "acceptance",
  release: "acceptance",
  voice: "power",
  spark: "hope",
  rebirth: "transformation",
  ending: "transformation",
  awakening: "transformation",
};

const STATE_ARCHETYPES = {
  path: "guide",
  choice: "threshold_keeper",
  threshold: "threshold_keeper",
  prophecy: "messenger",
  voice: "messenger",
  guidance: "guide",
  blessing: "guardian",
  protection: "guardian",
  root: "witness",
  memory: "witness",
  grief: "mourner",
  rebirth: "transformer",
  ending: "harbinger",
  awakening: "seer",
  deception: "trickster",
  web: "seer",
  threads: "seer",
  fate: "seer",
  remedy: "healer",
  light: "guide",
  spark: "guide",
};

const STATE_INTENSITY = {
  grief: 5,
  fracture: 5,
  sacred_fire: 5,
  sacrifice: 5,
  threshold: 4,
  choice: 4,
  prophecy: 4,
  guidance: 4,
  vision: 4,
  memory: 4,
  water_memory: 4,
  ending: 4,
  rebirth: 4,
  awakening: 4,
  path: 3,
  stillness: 3,
  patience: 3,
  winter_rest: 3,
  flow: 3,
  release: 3,
  joy: 2,
  spark: 2,
  light: 2,
  dawn: 2,
};

const CARD_META_V2_OVERRIDES = {
  Выбор: {
    short: "Развилка уже рядом, даже если ты ещё не назвала её вслух.",
    advice: "Смотри туда, где внутри появляется ясность, а не лишний шум.",
  },
  Тишина: {
    short: "Тишина хранит ответ дольше, чем любой поспешный голос.",
    advice: "Подержи вопрос в тишине ещё немного, ответ созревает.",
  },
  Туман: {
    short: "Неясность тоже знак, она просит внимательности, а не спешки.",
    advice: "Иди за тем, что даёт хоть малую ясность следующего шага.",
  },
  Разлом: {
    short: "Трещина появилась там, где старая форма уже не могла удержаться.",
    advice: "Смотри на разрыв как на поворот, а не только как на потерю.",
  },
  Корень: {
    short: "То, что держит тебя, уходит глубже, чем кажется.",
    advice: "Вернись к началу узла, там уже лежит первый ответ.",
  },
  "Золотой Олень": {
    short: "Редкий знак приходит тогда, когда путь уже готов открыться.",
    advice: "Иди за тем, что даёт тихую радость и внутренний свет.",
  },
  "Текущая Река": {
    short: "Путь любит движение, даже если оно едва заметно со стороны.",
    advice: "Доверься течению там, где борьба только сужает дорогу.",
  },
  "Жертвенный Огонь": {
    short: "Огонь очищает только то, что уже созрело для перемены.",
    advice: "Отдай пламени то, что уже не умеет вести тебя дальше.",
  },
};

export const CARD_META = Object.fromEntries(
  Object.entries(BASE_CARD_META).map(function buildEntry([name, meta]) {
    const overrides = CARD_META_V2_OVERRIDES[name] || {};
    const state = meta.state;
    const links = Array.isArray(meta.links) ? meta.links : [];
    const themes = Array.from(new Set([state, ...links])).slice(0, 4);

    return [
      name,
      {
        ...meta,
        short: overrides.short || "",
        depth: overrides.depth || "",
        advice: overrides.advice || "",
        themes: overrides.themes || themes,
        emotion: overrides.emotion || STATE_EMOTIONS[state] || fallbackEmotion(meta.tone),
        archetype: overrides.archetype || STATE_ARCHETYPES[state] || fallbackArchetype(meta.tone),
        intensity: overrides.intensity || STATE_INTENSITY[state] || fallbackIntensity(meta.tone),
        spread_variants: overrides.spread_variants || {},
      },
    ];
  }),
);

function fallbackEmotion(tone) {
  if (tone === "light") {
    return "hope";
  }

  if (tone === "dark") {
    return "tension";
  }

  return "uncertainty";
}

function fallbackArchetype(tone) {
  if (tone === "light") {
    return "guide";
  }

  if (tone === "dark") {
    return "witness";
  }

  return "seer";
}

function fallbackIntensity(tone) {
  if (tone === "light") {
    return 2;
  }

  if (tone === "dark") {
    return 4;
  }

  return 3;
}
