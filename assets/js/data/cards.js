import { CARD_META } from "../cards/card-meta.js";
import { CARD_LAYERS } from "../cards/layer-map.js";

export const COVER_IMAGE = "./assets/images/cover.webp";

const RAW_CARDS = [
  {
    id: "wyrd_001",
    name: "Хранитель Леса",
    subtitle: "Timekeeper of the Forest",
    keyword: "Путь",
    message:
      "Ты уже знаешь, куда идти. Компас у тебя в руках — он всегда указывал верно. Ты просто ещё не решилась назвать это вслух, потому что выбор делает путь настоящим.",
    shadow: "Ты ждёшь, пока кто-то другой укажет направление. Но проводник сюда не придёт.",
    image: "./assets/images/cards/wyrd_001.webp",
  },
  {
    id: "wyrd_002",
    name: "Вестник Чёрных Крыльев",
    subtitle: "Harbinger of the Black Wings",
    keyword: "Трансформация",
    message:
      "Что-то заканчивается. И это правильно. Не цепляйся за уходящее — в каждом конце спрятано начало чего-то, что ты ещё не умеешь назвать.",
    shadow: "Ты цепляешься за то, что уже ушло. Держишь форму, которая давно пуста.",
    image: "./assets/images/cards/wyrd_002.webp",
  },
  {
    id: "wyrd_003",
    name: "Всевидящий Плащ",
    subtitle: "All-Seeing Cloak",
    keyword: "Тайное знание",
    message:
      "Ты давно знаешь правду. Она живёт в тебе тихо, терпеливо ждёт. Ты просто делаешь вид, что всё ещё ищешь.",
    shadow: "Чужие взгляды не должны определять твой путь. Смотри внутрь, а не вовне.",
    image: "./assets/images/cards/wyrd_003.webp",
  },
  {
    id: "wyrd_004",
    name: "Хранитель Времени",
    subtitle: "Timekeeper Owl",
    keyword: "Мудрость",
    message:
      "Не всё происходит сразу. И это нормально. Мудрость не терпит спешки — она приходит к тем, кто умеет стоять и слушать тишину.",
    shadow: "Ты откладываешь жизнь, ожидая идеального момента. Он уже здесь.",
    image: "./assets/images/cards/wyrd_004.webp",
  },
  {
    id: "wyrd_005",
    name: "Страж Ночи",
    subtitle: "Guardian of the Night",
    keyword: "Защита",
    message:
      "Ты защищаешь что-то важное. Но от кого? Граница между мирами тонка — и иногда то, что ты охраняешь снаружи, живёт внутри.",
    shadow: "Ты держишься за страх и называешь это осторожностью.",
    image: "./assets/images/cards/wyrd_005.webp",
  },
  {
    id: "wyrd_006",
    name: "Хранитель Фонаря",
    subtitle: "Lantern Keeper Moth",
    keyword: "Притяжение",
    message:
      "Тебя тянет туда — но это не значит, что тебе туда нужно. Убедись, что летишь к своему свету, а не к чужому огню.",
    shadow: "Ты идёшь за тем, что тебя сожжёт.",
    image: "./assets/images/cards/wyrd_006.webp",
  },
  {
    id: "wyrd_007",
    name: "Леший",
    subtitle: "Spirit of the Forest",
    keyword: "Ритуал",
    message:
      "Прежде чем двигаться — пойми, зачем. Каждый шаг в лесу оставляет след. Освяти намерение, прежде чем действовать.",
    shadow: "Ты делаешь шаги, которые никуда не ведут.",
    image: "./assets/images/cards/wyrd_007.webp",
  },
  {
    id: "wyrd_008",
    name: "Лисица Девяти Хвостов",
    subtitle: "The Fox of Nine Paths",
    keyword: "Обман",
    message:
      "Ты уже видишь обман. Не всё, что ведёт тебя — ведёт туда, куда ты думаешь. Смотри внимательнее.",
    shadow: "Ты выбираешь верить, потому что так легче.",
    image: "./assets/images/cards/wyrd_008.webp",
  },
  {
    id: "wyrd_009",
    name: "Хранитель Лунной Вуали",
    subtitle: "Keeper of the Moon Veil",
    keyword: "Тишина",
    message:
      "Сейчас не время отвечать. Просто побудь. Не каждый вопрос требует слов — некоторые растворяются в лунном свете.",
    shadow: "Ты прячешься за тишиной, чтобы ничего не менять.",
    image: "./assets/images/cards/wyrd_009.webp",
  },
  {
    id: "wyrd_010",
    name: "Алтарь Пустоты",
    subtitle: "The Void Altar",
    keyword: "Жертва",
    message:
      "Ты не можешь сохранить всё. Настоящая сила всегда требует цены — плати осознанно, а не по привычке.",
    shadow: "Ты отдаёшь себя вместо того, что действительно важно.",
    image: "./assets/images/cards/wyrd_010.webp",
  },
  {
    id: "wyrd_011",
    name: "Древо Возрождения",
    subtitle: "The Bone Tree",
    keyword: "Возрождение",
    message:
      "Из этого вырастет что-то новое. Из того, что умерло, прорастает живое. Не бойся стать почвой для чего-то большего.",
    shadow: "Ты держишься за то, что уже умерло.",
    image: "./assets/images/cards/wyrd_011.webp",
  },
  {
    id: "wyrd_012",
    name: "Плакальщица",
    subtitle: "The Mourning One",
    keyword: "Горе",
    message:
      "Тебе можно чувствовать это. Позволь себе оплакать. Слёзы — не слабость. Это река, которая несёт тебя дальше.",
    shadow: "Ты застрял в этом и не хочешь выходить. Горе стало домом.",
    image: "./assets/images/cards/wyrd_012.webp",
  },
  {
    id: "wyrd_013",
    name: "Страж Порога",
    subtitle: "The Threshold Guardian",
    keyword: "Граница",
    message:
      "Ты уже на границе. Одна рука в прошлом, другая — в будущем. Стоять между — не выбор. Шагни.",
    shadow: "Ты стоишь между и не выбираешь ни одну сторону.",
    image: "./assets/images/cards/wyrd_013.webp",
  },
  {
    id: "wyrd_014",
    name: "Волк с Зеркалом",
    subtitle: "The Mirror Wolf",
    keyword: "Память",
    message:
      "Ты смотришь в прошлое и не замечаешь настоящее. Зеркало показывает не то, что есть — а то, что было. Помни, откуда пришла.",
    shadow: "Ты держишься за версию себя, которой уже нет.",
    image: "./assets/images/cards/wyrd_014.webp",
  },
  {
    id: "wyrd_015",
    name: "Ткачиха Судьбы",
    subtitle: "The Fate Weaver",
    keyword: "Нити судьбы",
    message:
      "Всё связано. Даже то, что ты считаешь случайным — часть большого узора. Ищи связи там, где видишь только хаос.",
    shadow: "Ты живёшь чужими нитями. Найди свою.",
    image: "./assets/images/cards/wyrd_015.webp",
  },
  {
    id: "wyrd_016",
    name: "Уроборос",
    subtitle: "The Eternal Serpent",
    keyword: "Цикл",
    message:
      "Ты снова здесь. Всё возвращается — конец и есть начало. Свеча горит внутри круга вечности.",
    shadow: "Ты ходишь по кругу и называешь это судьбой.",
    image: "./assets/images/cards/wyrd_016.webp",
  },
  {
    id: "wyrd_017",
    name: "Лесной Знахарь",
    subtitle: "The Forest Shaman",
    keyword: "Яд / Лекарство",
    message:
      "Одно и то же растение лечит и убивает. Всё зависит от дозы и намерения. Что ты несёшь в своей чаше — и кому?",
    shadow: "Ты даёшь другим то, в чём сам нуждаешься.",
    image: "./assets/images/cards/wyrd_017.webp",
  },
  {
    id: "wyrd_018",
    name: "Вещий Ворон",
    subtitle: "The Oracle Raven",
    keyword: "Пророчество",
    message:
      "Ты уже получил ответ. Знак был дан — ты его видела, слышала, чувствовала. Поверь теперь.",
    shadow: "Ты игнорируешь то, что тебе не нравится.",
    image: "./assets/images/cards/wyrd_018.webp",
  },
  {
    id: "wyrd_019",
    name: "Рой",
    subtitle: "The Swarm",
    keyword: "Пробуждение",
    message:
      "Ты увидел. Что-то внутри тебя сдвинулось и уже не вернётся на место. Это не конец — это начало движения.",
    shadow: "Ты сделал вид, что ничего не произошло.",
    image: "./assets/images/cards/wyrd_019.webp",
  },
  {
    id: "wyrd_020",
    name: "Хранитель Нитей",
    subtitle: "The Thread Keeper",
    keyword: "Судьба",
    message:
      "Он знает, где начинается твоя нить и где она узлом сходится с чужой. Распутай то, что сам же завязал.",
    shadow: "Ты называешь это судьбой — но это твои собственные узлы.",
    image: "./assets/images/cards/wyrd_020.webp",
  },
  {
    id: "wyrd_021",
    name: "Страж с Ключом",
    subtitle: "The Keykeeper",
    keyword: "Тайна",
    message:
      "Ключ уже у тебя. Дверь давно ждёт. Ты ходишь вокруг и смотришь в замочную скважину, вместо того чтобы войти.",
    shadow: "Ты боишься не того, что за дверью. Ты боишься, что там пусто.",
    image: "./assets/images/cards/wyrd_021.webp",
  },
  {
    id: "wyrd_022",
    name: "Паук Звёздной Сети",
    subtitle: "The Star Spider",
    keyword: "Паутина",
    message:
      "Все нити связаны. То, что кажется случайным — часть космического узора, который ткётся давно. Ищи смысл в совпадениях.",
    shadow: "Ты запуталась в чужих нитях. Найди свою.",
    image: "./assets/images/cards/wyrd_022.webp",
  },
  {
    id: "wyrd_023",
    name: "Ёж",
    subtitle: "The Hedgehog",
    keyword: "Граница",
    message:
      "Твои иглы — не злоба. Это мудрость тела, которое знает, когда сворачиваться. Граница — это не стена, это забота о себе.",
    shadow: "Ты прячешься под иглами от тех, кто хочет тебя согреть.",
    image: "./assets/images/cards/wyrd_023.webp",
  },
  {
    id: "wyrd_024",
    name: "Жаба",
    subtitle: "The Toad",
    keyword: "Терпение",
    message:
      "Она сидит и ждёт. Не из слабости — из знания, что момент придёт. Твоё терпение — это не пассивность, это сила.",
    shadow: "Ты ждёшь так долго, что забыла, чего ждёшь.",
    image: "./assets/images/cards/wyrd_024.webp",
  },
  {
    id: "wyrd_025",
    name: "Русалка",
    subtitle: "The Water Spirit",
    keyword: "Глубина",
    message:
      "Что-то тянет тебя вниз. Это не обязательно плохо — но знай, куда ныряешь. Глубина требует осознанности.",
    shadow: "Ты идёшь на зов, не спросив, кто зовёт.",
    image: "./assets/images/cards/wyrd_025.webp",
  },
  {
    id: "wyrd_026",
    name: "Свеча",
    subtitle: "The Candle Spirit",
    keyword: "Свет",
    message:
      "Не нужен факел. Одна свеча освещает достаточно для следующего шага. Ты уже несёшь достаточно света.",
    shadow: "Ты сжигаешь себя ради тех, кто не замечает твоего огня.",
    image: "./assets/images/cards/wyrd_026.webp",
  },
  {
    id: "wyrd_027",
    name: "Грибница",
    subtitle: "The Mycelium",
    keyword: "Связь",
    message:
      "Под землёй всё связано. То, что кажется отдельным — часть одного живого. Ты не одна — даже когда кажется иначе.",
    shadow: "Ты оборвала нити, которые тебя держали. И называешь это свободой.",
    image: "./assets/images/cards/wyrd_027.webp",
  },
  {
    id: "wyrd_028",
    name: "Золотой Олень",
    subtitle: "The Golden Deer",
    keyword: "Дар",
    message:
      "Редкое существо вышло к тебе. Это знак — не спугни его тревогой. Позволь удаче случиться.",
    shadow: "Ты не веришь, что это для тебя. И уходишь раньше, чем дар успевает дойти.",
    image: "./assets/images/cards/wyrd_028.webp",
  },
  {
    id: "wyrd_029",
    name: "Заря",
    subtitle: "The Dawn Spirit",
    keyword: "Рассвет",
    message:
      "Лес ещё тёмный, но свет уже касается верхушек деревьев. Ночь не длится вечно — даже самая долгая.",
    shadow: "Ты так привыкла к темноте, что не замечаешь, что уже рассветает.",
    image: "./assets/images/cards/wyrd_029.webp",
  },
  {
    id: "wyrd_030",
    name: "Орёл",
    subtitle: "The Eagle",
    keyword: "Видение",
    message:
      "Скоро ты увидишь картину целиком. Поднимись выше своей боли — оттуда видно то, чего не видно изнутри.",
    shadow: "Ты смотришь так далеко, что не видишь того, что прямо перед тобой.",
    image: "./assets/images/cards/wyrd_030.webp",
  },
  {
    id: "wyrd_031",
    name: "Цветущая Ветвь",
    subtitle: "The Flowering Branch",
    keyword: "Рост",
    message:
      "Из мёртвого дерева вырастает цветок. Это не метафора — это то, что происходит прямо сейчас с тобой.",
    shadow: "Ты держишься за мёртвую форму и не даёшь новому прорасти.",
    image: "./assets/images/cards/wyrd_031.webp",
  },
  {
    id: "wyrd_032",
    name: "Крыса",
    subtitle: "The Rat",
    keyword: "Выживание",
    message:
      "Ты выжила там, где другие сдались. Этот опыт — не стыд, это сила. Признай его.",
    shadow: "Ты так привыкла выживать, что забыла, как просто жить.",
    image: "./assets/images/cards/wyrd_032.webp",
  },
  {
    id: "wyrd_033",
    name: "Водяной",
    subtitle: "The Water Spirit",
    keyword: "Подъём",
    message:
      "Что-то было утоплено давно. Оно не исчезло — оно лежит на дне и ждёт, когда ты будешь готова его поднять.",
    shadow: "Ты продолжаешь топить то, что просится на поверхность.",
    image: "./assets/images/cards/wyrd_033.webp",
  },
  {
    id: "wyrd_034",
    name: "Туман",
    subtitle: "The Fog",
    keyword: "Неясность",
    message:
      "Ты не видишь следующего шага. Это не опасность — это пространство между. Туман не врёт.",
    shadow: "Ты называешь неопределённость провалом.",
    image: "./assets/images/cards/wyrd_034.webp",
  },
  {
    id: "wyrd_035",
    name: "Зимний Сон",
    subtitle: "The Winter Sleep",
    keyword: "Пауза",
    message:
      "Это не смерть и не слабость. Это медведь под снегом — живой, дышащий, копящий силу. Ты имеешь право на паузу.",
    shadow: "Ты путаешь отдых с бегством.",
    image: "./assets/images/cards/wyrd_035.webp",
  },
  {
    id: "wyrd_036",
    name: "Выбор",
    subtitle: "The Crossroads",
    keyword: "Решение",
    message:
      "Оба пути настоящие. Оба ведут куда-то. Стоять здесь вечно — тоже выбор.",
    shadow: "Ты ждёшь знака, которого не будет. Знак — это ты.",
    image: "./assets/images/cards/wyrd_036.webp",
  },
  {
    id: "wyrd_037",
    name: "Разлом",
    subtitle: "The Fracture",
    keyword: "Трещина",
    message:
      "Это уже сломалось. Не чини. Из трещины растёт то, что было заперто внутри.",
    shadow: "Ты продолжаешь притворяться, что всё в порядке.",
    image: "./assets/images/cards/wyrd_037.webp",
  },
  {
    id: "wyrd_038",
    name: "Тишина",
    subtitle: "The Stillness",
    keyword: "Присутствие",
    message:
      "Не молчание как отсутствие — а тишина как присутствие. В ней говорит то, что важно.",
    shadow: "Ты боишься того, что услышишь, если замолчишь.",
    image: "./assets/images/cards/wyrd_038.webp",
  },
  {
    id: "wyrd_039",
    name: "Жертвенный Огонь",
    subtitle: "The Sacred Fire",
    keyword: "Отдача",
    message:
      "Что ты готова отдать огню? Не потерять — именно отдать. Осознанно. Это разные вещи.",
    shadow: "Ты держишь то, что давно просится в огонь.",
    image: "./assets/images/cards/wyrd_039.webp",
  },
  {
    id: "wyrd_040",
    name: "Корень",
    subtitle: "The Root",
    keyword: "Исток",
    message:
      "Ты знаешь, откуда растёшь. Это держит тебя сильнее, чем ты думаешь — и это не всегда плохо.",
    shadow: "Ты сам не хочешь отпускать корень, который тебя душит.",
    image: "./assets/images/cards/wyrd_040.webp",
  },
  {
    id: "wyrd_041",
    name: "Круг",
    subtitle: "The Circle",
    keyword: "Целостность",
    message:
      "Ты на своём месте. Не где-то потом — прямо сейчас. Это редкое ощущение. Не спугни его анализом.",
    shadow: "Ты боишься выйти за пределы того, что уже понятно.",
    image: "./assets/images/cards/wyrd_041.webp",
  },
  {
    id: "wyrd_042",
    name: "Искра Леса",
    subtitle: "The Forest Spark",
    keyword: "Игра",
    message:
      "Ты слишком серьёзна для того, кто всё равно не знает, чем всё закончится. Лес смеётся — не над тобой, а вместе с тобой. Попробуй сделать шаг не ради результата, а ради движения.",
    shadow: "Ты прячешься в лёгкости, чтобы не встречаться с важным. Не вся игра — свобода.",
    image: "./assets/images/cards/wyrd_042.webp",
  },
  {
    id: "wyrd_043",
    name: "Собиратель Орехов",
    subtitle: "The Joy Gatherer",
    keyword: "Радость",
    message:
      "Радость — не громкая. Она тихо складывается в ладонях: в тёплом воздухе, в случайной мысли, в чём-то маленьком. Ты уже держишь больше, чем замечаешь.",
    shadow: "Ты ищешь большой свет и не замечаешь маленьких огней. И говоришь, что радости нет.",
    image: "./assets/images/cards/wyrd_043.webp",
  },
  {
    id: "wyrd_044",
    name: "Текущая Река",
    subtitle: "The Living Current",
    keyword: "Поток",
    message:
      "Ты не должна толкать воду, чтобы она текла. Отпусти сопротивление — и почувствуй, как движение уже происходит. Тебя несёт, даже если ты не доверяешь этому.",
    shadow: "Ты плывёшь по течению там, где нужно было выбрать направление.",
    image: "./assets/images/cards/wyrd_044.webp",
  },
  {
    id: "wyrd_045",
    name: "Перо Ветра",
    subtitle: "The Wind Feather",
    keyword: "Лёгкость",
    message:
      "Не всё нужно нести. Некоторые вещи можно просто отпустить — и они сами найдут своё место. Лёгкость — это не пустота, это отсутствие лишнего.",
    shadow: "Ты делаешь вид, что тебе легко, чтобы не признавать тяжесть.",
    image: "./assets/images/cards/wyrd_045.webp",
  },
  {
    id: "wyrd_046",
    name: "Соловей Рассвета",
    subtitle: "The Dawn Nightingale",
    keyword: "Голос",
    message:
      "Ты долго молчала. Но внутри тебя уже звучит песня. Не идеальная — живая. Лес не ждёт совершенства. Он слушает, когда ты начинаешь звучать.",
    shadow: "Ты боишься своего голоса и называешь это тишиной.",
    image: "./assets/images/cards/wyrd_046.webp",
  },
  {
    id: "wyrd_047",
    name: "Бурундук Лесных Троп",
    subtitle: "The Path Chipmunk",
    keyword: "Шаг",
    message:
      "Не каждый шаг должен быть большим. Маленькие движения тоже ведут вперёд. Ты уже в пути — даже если просто перебегаешь с ветки на ветку.",
    shadow: "Ты распыляешься на мелочи, чтобы не делать главное.",
    image: "./assets/images/cards/wyrd_047.webp",
  },
  {
    id: "wyrd_048",
    name: "Светляк",
    subtitle: "The Firefly",
    keyword: "Свет",
    message:
      "Тебе не нужно освещать весь лес. Достаточно увидеть следующий шаг. Твой свет маленький — и этого достаточно.",
    shadow: "Ты ждёшь большого света и не идёшь, пока его нет.",
    image: "./assets/images/cards/wyrd_048.webp",
  },
];

export const CARDS = RAW_CARDS.map(function enrichCard(card) {
  const meta = CARD_META[card.name] || {};

  return {
    ...card,
    layer: CARD_LAYERS[card.name] || "present",
    state: meta.state || slugify(card.keyword),
    tone: meta.tone || "neutral",
    links: Array.isArray(meta.links) ? meta.links : [],
  };
});

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s*\/\s*/g, "_")
    .replace(/\s+/g, "_")
    .replace(/[^a-zа-я0-9_]/gi, "")
    .replace(/^_+|_+$/g, "");
}
