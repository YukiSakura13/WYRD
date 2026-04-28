const BASE_CARD_META = {
  "Хранитель Леса": { state: "path", tone: "neutral", links: ["choice", "vision", "flow"] },
  "Вестник Чёрных Крыльев": { state: "ending", tone: "dark", links: ["rebirth", "dawn", "fracture"] },
  "Всевидящий Плащ": { state: "insight", tone: "neutral", links: ["stillness", "choice", "vision"] },
  "Хранитель Времени": { state: "timing", tone: "light", links: ["stillness", "winter_rest", "dawn"] },
  "Тёмный Гость": { state: "manipulation", tone: "dark", links: ["alienation", "deception", "boundary"] },
  "Хранитель Фонаря": { state: "attraction", tone: "neutral", links: ["vision", "light", "choice"] },
  Леший: { state: "ritual", tone: "dark", links: ["choice", "root", "sacrifice"] },
  "Лисий Огонь": { state: "deception", tone: "dark", links: ["insight", "stillness", "threads"] },
  "Хранительница Лунной Вуали": { state: "stillness", tone: "light", links: ["flow", "choice", "acceptance"] },
  "Алтарь Пустоты": { state: "sacrifice", tone: "dark", links: ["fracture", "rebirth", "sacred_fire"] },
  "Древо Возрождения": { state: "rebirth", tone: "neutral", links: ["dawn", "growth", "circle"] },
  Плакальщица: { state: "grief", tone: "dark", links: ["rebirth", "stillness", "flow"] },
  "Страж Порога": { state: "threshold", tone: "light", links: ["choice", "future_path", "key"] },
  "Волк с Зеркалом": { state: "memory", tone: "dark", links: ["fracture", "root", "threshold"] },
  "Ткачиха Судьбы": { state: "threads", tone: "neutral", links: ["fate", "circle", "key"] },
  Уроборос: { state: "cycle", tone: "dark", links: ["rebirth", "circle", "fracture"] },
  "Лесной Знахарь": { state: "remedy", tone: "neutral", links: ["balance", "flow", "choice"] },
  "Вещий Ворон": { state: "prophecy", tone: "neutral", links: ["vision", "key", "future_path"] },
  Рой: { state: "awakening", tone: "neutral", links: ["fracture", "flow", "future_path"] },
  "Хранитель Нитей": { state: "fate", tone: "dark", links: ["threads", "choice", "circle"] },
  "Страж с Ключом": { state: "key", tone: "light", links: ["threshold", "prophecy", "vision"] },
  "Паук Звёздной Сети": { state: "web", tone: "neutral", links: ["threads", "fate", "insight"] },
  Ёж: { state: "boundary", tone: "neutral", links: ["protection", "stillness", "choice"] },
  "Жаба Верного Часа": { state: "patience", tone: "neutral", links: ["timing", "winter_rest", "dawn"] },
  Русалка: { state: "depth", tone: "dark", links: ["flow", "water_memory", "vision"] },
  Свеча: { state: "light", tone: "light", links: ["dawn", "future_path", "spark"] },
  Грибница: { state: "connection", tone: "neutral", links: ["threads", "fate", "joy"] },
  "Золотой Олень": { state: "blessing", tone: "light", links: ["dawn", "growth", "future_path"] },
  Заря: { state: "dawn", tone: "light", links: ["light", "growth", "future_path"] },
  Орёл: { state: "vision", tone: "light", links: ["prophecy", "choice", "future_path"] },
  "Цветущая Ветвь": { state: "growth", tone: "light", links: ["rebirth", "dawn", "blessing"] },
  "Крыса Тёмных Троп": { state: "survival", tone: "dark", links: ["root", "fracture", "choice"] },
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
  "Светляк в Ночи": { state: "guidance", tone: "light", links: ["light", "future_path", "choice"] },
  "Лунные Влюблённые": { state: "love", tone: "light", links: ["connection", "union", "blessing"] },
  "Пламя Под Кожей": { state: "passion", tone: "neutral", links: ["attraction", "spark", "choice"] },
  "Поцелуй Тени": { state: "temptation", tone: "dark", links: ["deception", "attraction", "boundary"] },
  "Скреплённые Ветви": { state: "union", tone: "light", links: ["connection", "threads", "circle"] },
  "Зерно Урожая": { state: "harvest", tone: "light", links: ["growth", "root", "blessing"] },
  "Лесной Резчик": { state: "craft", tone: "neutral", links: ["root", "growth", "voice"] },
  "Лестница Ветвей": { state: "ascent", tone: "light", links: ["future_path", "vision", "growth"] },
  "Золотая Мера": { state: "fair_measure", tone: "neutral", links: ["balance", "harvest", "root"] },
  "Хранитель Прощающего Сердца": {
    state: "forgiveness",
    tone: "light",
    links: ["grief", "love", "release"],
  },
  "Ткач Возвращённого Света": {
    state: "returning_light",
    tone: "light",
    links: ["love", "threads", "dawn"],
  },
  "Хранительница Тихой Верности": {
    state: "fidelity",
    tone: "neutral",
    links: ["union", "threads", "stillness"],
  },
  "Узел Живого Дела": { state: "teamwork", tone: "light", links: ["craft", "root", "growth"] },
  "Старейшина Леса": {
    state: "leadership",
    tone: "neutral",
    links: ["root", "ascent", "fair_measure"],
  },
  "Знак Главного Пути": {
    state: "calling",
    tone: "light",
    links: ["path", "vision", "craft"],
  },
  "Золотой Ручей": { state: "golden_flow", tone: "light", links: ["harvest", "flow", "blessing"] },
  "Венец После Бури": { state: "triumph", tone: "light", links: ["fracture", "ascent", "dawn"] },
  "Прыжок Через Огонь": {
    state: "courage",
    tone: "neutral",
    links: ["sacred_fire", "threshold", "ascent"],
  },
  "Эхо Вершин": {
    state: "recognition",
    tone: "light",
    links: ["voice", "vision", "dawn"],
  },
  "Свой Костёр": {
    state: "kinship_fire",
    tone: "light",
    links: ["connection", "guidance", "love"],
  },
  "Дом Под Корой": {
    state: "family_home",
    tone: "light",
    links: ["root", "connection", "light"],
  },
  "Родная Стая": {
    state: "belonging",
    tone: "light",
    links: ["union", "joy", "guidance"],
  },
  "Чужая Стая": {
    state: "alienation",
    tone: "dark",
    links: ["boundary", "choice", "deception"],
  },
  "Тропа Домой": {
    state: "homecoming",
    tone: "light",
    links: ["path", "connection", "dawn"],
  },
  "Дружеский Совет": {
    state: "counsel",
    tone: "neutral",
    links: ["guidance", "voice", "choice"],
  },
  "Скрытый Исток": {
    state: "creative_source",
    tone: "light",
    links: ["spark", "voice", "release"],
  },
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
  love: "tenderness",
  passion: "power",
  temptation: "tension",
  union: "tenderness",
  harvest: "hope",
  craft: "clarity",
  ascent: "power",
  fair_measure: "clarity",
  forgiveness: "tenderness",
  returning_light: "hope",
  fidelity: "tenderness",
  teamwork: "power",
  leadership: "power",
  calling: "clarity",
  golden_flow: "hope",
  triumph: "power",
  courage: "power",
  recognition: "power",
  kinship_fire: "tenderness",
  family_home: "tenderness",
  belonging: "hope",
  alienation: "tension",
  homecoming: "longing",
  counsel: "clarity",
  creative_source: "power",
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
  love: "guide",
  passion: "transformer",
  temptation: "trickster",
  union: "guardian",
  harvest: "guide",
  craft: "guide",
  ascent: "messenger",
  fair_measure: "witness",
  forgiveness: "healer",
  returning_light: "guide",
  fidelity: "guardian",
  teamwork: "guardian",
  leadership: "guardian",
  calling: "guide",
  golden_flow: "guide",
  triumph: "messenger",
  courage: "guardian",
  recognition: "messenger",
  kinship_fire: "guardian",
  family_home: "guardian",
  belonging: "guide",
  alienation: "witness",
  homecoming: "guide",
  counsel: "messenger",
  creative_source: "guide",
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
  love: 3,
  passion: 4,
  temptation: 4,
  union: 3,
  harvest: 3,
  craft: 3,
  ascent: 4,
  fair_measure: 3,
  forgiveness: 3,
  returning_light: 3,
  fidelity: 3,
  teamwork: 3,
  leadership: 4,
  calling: 4,
  golden_flow: 3,
  triumph: 4,
  courage: 4,
  recognition: 3,
  kinship_fire: 2,
  family_home: 3,
  belonging: 2,
  alienation: 4,
  homecoming: 3,
  counsel: 3,
  creative_source: 3,
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
  "Лунные Влюблённые": {
    short: "Тихая взаимность уже ищет форму, в которой сможет стать явной.",
    advice: "Смотри туда, где чувство не только зовёт, но и откликается.",
  },
  "Пламя Под Кожей": {
    short: "Живой огонь уже проснулся, теперь важно различить его силу и цену.",
    advice: "Прими влечение, но не позволяй ему заглушить внутреннюю ясность.",
  },
  "Поцелуй Тени": {
    short: "Соблазн приходит красивым, но его правда всегда требует близкого взгляда.",
    advice: "Не путай жар желания с глубиной настоящего чувства.",
  },
  "Скреплённые Ветви": {
    short: "Союз крепнет там, где доверие растёт медленно, но верно.",
    advice: "Береги связь, если в ней есть не только чувство, но и живая опора.",
  },
  "Зерно Урожая": {
    short: "Посеянное однажды уже движется к своему видимому плоду.",
    advice: "Продолжай то, что уже дало корень, и не отворачивайся от медленного роста.",
  },
  "Лесной Резчик": {
    short: "Мастерство начинает говорить за тебя сильнее любых обещаний.",
    advice: "Укрепляй качество своего дела, и признание соберётся вокруг него естественно.",
  },
  "Лестница Ветвей": {
    short: "Следующая высота уже видна, если не отводить взгляд от собственного роста.",
    advice: "Поднимайся туда, где усилие становится больше старой привычки оставаться ниже.",
  },
  "Золотая Мера": {
    short: "У этого пути есть своя честная цена, и она уже начинает проявляться.",
    advice: "Смотри трезво на ценность своего труда и не уменьшай её из страха.",
  },
  "Хранитель Прощающего Сердца": {
    short: "Прощение возвращает тепло туда, где слишком долго жила одна только боль.",
    advice: "Отпускай обиду там, где сердце уже готово выбрать исцеление вместо повторения раны.",
  },
  "Ткач Возвращённого Света": {
    short: "Живая связь может снова вспыхнуть, если в ней осталось настоящее взаимное движение.",
    advice: "Смотри не только на память, а на то, есть ли сейчас живой отклик с другой стороны.",
  },
  "Хранительница Тихой Верности": {
    short: "Тихая преданность держится не на клятвах, а на ежедневной честности чувства.",
    advice: "Береги ту связь, где глубина подтверждается не словами, а устойчивым присутствием.",
  },
  "Узел Живого Дела": {
    short: "Общее дело крепнет там, где усилия не спорят друг с другом, а связываются в один ритм.",
    advice: "Ищи союзников, с которыми твоя сила не теряется, а становится точнее и полезнее.",
  },
  "Старейшина Леса": {
    short: "Заслуженное лидерство узнаётся по внутренней опоре и праву вести без лишнего доказательства.",
    advice: "Перестань ждать разрешения на место, которое уже признано твоим, и веди из опоры, а не из сомнения.",
  },
  "Знак Главного Пути": {
    short: "Свой путь уже начинает светиться там, где дело совпадает с твоей внутренней правдой.",
    advice: "Смотри туда, где движение даёт не только рост, но и чувство точного внутреннего совпадения.",
  },
  "Золотой Ручей": {
    short: "Поток ресурса усиливается там, где ценность не застаивается, а начинает двигаться.",
    advice: "Поддерживай движение денег там, где оно идёт живо, естественно и не требует лишнего насилия.",
  },
  "Венец После Бури": {
    short: "После самой тяжёлой части пути уже начинает проступать заслуженный итог.",
    advice: "Не обесценивай свою стойкость в момент, когда она уже превращается в результат.",
  },
  "Прыжок Через Огонь": {
    short: "Мужество приходит не после страха, а в тот миг, когда ты идёшь через него.",
    advice: "Сделай шаг, даже если внутри ещё дрожит, именно так и рождается настоящая сила.",
  },
  "Эхо Вершин": {
    short: "Твоё звучание начинает находить отклик там, где раньше его ещё не слышали.",
    advice: "Позволь себе быть видимой в тот момент, когда мир уже готов откликнуться на твою ценность.",
  },
  "Свой Костёр": {
    short: "Рядом уже есть круг, в котором можно согреться и перестать держать всё в одиночку.",
    advice: "Подойди ближе к тем, рядом с кем не нужно лишних объяснений, и позволь поддержке стать реальной.",
  },
  "Дом Под Корой": {
    short: "Связь с родными держится глубже, чем может показаться в моменте.",
    advice: "Верни внимание туда, где живёт твоя семейная опора, и не откладывай этот шаг надолго.",
  },
  "Родная Стая": {
    short: "Свои узнаются по тишине, в которой всё равно остаётся чувство принятия.",
    advice: "Ищи среду, рядом с которой не нужно сжиматься или объяснять себя слишком долго.",
  },
  "Чужая Стая": {
    short: "Чужая среда умеет становиться привычной раньше, чем ты замечаешь цену этого.",
    advice: "Проверь, действительно ли это место поддерживает тебя, и не бойся менять круг, если он искажает.",
  },
  "Тропа Домой": {
    short: "Обратная дорога к своим уже существует, даже если между вами накопилось расстояние.",
    advice: "Сделай шаг к тем, рядом с кем в тебе оживает опора, а не только память о ней.",
  },
  "Дружеский Совет": {
    short: "Нужная ясность может прийти через простой разговор с теми, кому ты доверяешь.",
    advice: "Не тащи этот узел в одиночку, прислушайся к слову друга и переведи услышанное в шаг.",
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
