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
  {
    id: "wyrd_049",
    name: "Лунные Влюблённые",
    subtitle: "The Moon Lovers",
    keyword: "Любовь",
    message:
      "Между двумя сердцами уже может рождаться нечто настоящее. Там, где есть взаимность, чувство не рвётся наружу силой, а становится всё яснее и тише.",
    shadow: "Ты можешь принять надежду за взаимность и не заметить, где чувство остаётся односторонним.",
    image: "./assets/images/cards/lunnye_vlyublennye.webp",
  },
  {
    id: "wyrd_050",
    name: "Пламя Под Кожей",
    subtitle: "The Flame Beneath the Skin",
    keyword: "Страсть",
    message:
      "То, что тянет тебя сейчас, может быть очень сильным и живым. Страсть уже говорит своим языком, и потому особенно важно различить, где в ней свобода, а где потеря равновесия.",
    shadow: "Ты можешь принять вспышку желания за более глубокую истину, чем она есть на самом деле.",
    image: "./assets/images/cards/plamya_pod_kozhey.webp",
  },
  {
    id: "wyrd_051",
    name: "Поцелуй Тени",
    subtitle: "The Kiss of Shadow",
    keyword: "Соблазн",
    message:
      "Между вами или вокруг тебя может рождаться притяжение, в котором больше жара, чем правды. Такой знак нельзя игнорировать, но и доверять ему без остатка опасно.",
    shadow: "Ты можешь выбрать сладкое ослепление вместо ясного чувства.",
    image: "./assets/images/cards/potseluy_teni.webp",
  },
  {
    id: "wyrd_052",
    name: "Скреплённые Ветви",
    subtitle: "The Bound Branches",
    keyword: "Союз",
    message:
      "Связь, о которой идёт речь, может стать чем-то устойчивым и зрелым. Там, где есть доверие и готовность расти вместе, союз становится не случайной встречей, а общей дорогой.",
    shadow: "Ты можешь желать союза раньше, чем для него созрела взаимная опора.",
    image: "./assets/images/cards/skreplennye_vetvi.webp",
  },
  {
    id: "wyrd_053",
    name: "Зерно Урожая",
    subtitle: "The Grain of Harvest",
    keyword: "Плод труда",
    message:
      "Твои усилия не пропали. То, во что ты уже вложилась, начинает двигаться к материальному результату. Урожай приходит не сразу, но верно.",
    shadow: "Ты можешь отвернуться от плода слишком рано, решив, что ничего уже не вырастет.",
    image: "./assets/images/cards/zerno_urozhaya.webp",
  },
  {
    id: "wyrd_054",
    name: "Лесной Резчик",
    subtitle: "The Forest Carver",
    keyword: "Мастерство",
    message:
      "Сейчас твоей опорой становится не случай, а умение. То, что сделано с точностью, терпением и верностью делу, начинает говорить за тебя сильнее любых обещаний.",
    shadow: "Ты можешь недооценивать собственное ремесло только потому, что привыкла считать его чем-то обычным.",
    image: "./assets/images/cards/lesnoi_rezchik.webp",
  },
  {
    id: "wyrd_055",
    name: "Лестница Ветвей",
    subtitle: "The Branch Ladder",
    keyword: "Восхождение",
    message:
      "Ты уже подошла к точке, где возможен подъём. Новый уровень не приходит случайно, но путь к нему уже начал складываться под твоими шагами.",
    shadow: "Ты можешь бояться собственной высоты и поэтому оставаться ниже, чем уже можешь быть.",
    image: "./assets/images/cards/lestnica_vetvei.webp",
  },
  {
    id: "wyrd_056",
    name: "Золотая Мера",
    subtitle: "The Golden Measure",
    keyword: "Мера",
    message:
      "То, что ты вкладываешь сейчас, ищет честную отдачу. Результат может прийти не мгновенно, но у этого пути есть своя мера, и она уже начинает складываться в твою пользу.",
    shadow: "Ты можешь соглашаться на меньшее, чем действительно соответствует твоей ценности.",
    image: "./assets/images/cards/zolotaya_mera.webp",
  },
  {
    id: "wyrd_057",
    name: "Хранитель Прощающего Сердца",
    subtitle: "Keeper of the Forgiving Heart",
    keyword: "Прощение",
    message:
      "Рана ещё помнит боль, но в ней уже появилось место для мягкости. Прощение здесь не про забвение, а про возвращение живого тепла туда, где слишком долго жил только холод.",
    shadow: "Ты можешь держаться за обиду как за доказательство своей правоты и не замечать, как она продолжает связывать тебя с прошлым.",
    image: "./assets/images/cards/khranitel_proshchayushchego_serdtsa.webp",
  },
  {
    id: "wyrd_058",
    name: "Ткач Возвращённого Света",
    subtitle: "Weaver of the Returned Light",
    keyword: "Возвращение",
    message:
      "То, что казалось угасшим, может снова откликнуться. Нить чувства ещё жива, и если обе стороны готовы, свет способен вернуться не как повтор старого, а как более зрелая близость.",
    shadow: "Ты можешь принять тоску по прошлому за настоящий второй шанс и пытаться вернуть не живую связь, а её воспоминание.",
    image: "./assets/images/cards/tkach_vozvrashchennogo_sveta.webp",
  },
  {
    id: "wyrd_059",
    name: "Хранительница Тихой Верности",
    subtitle: "Keeper of Quiet Fidelity",
    keyword: "Верность",
    message:
      "Подлинное чувство не всегда звучит громко. Здесь любовь держится на внутреннем выборе, честности и спокойной устойчивости, которая не требует лишних доказательств.",
    shadow: "Ты можешь молчать о важном слишком долго и называть это верностью, хотя связь уже нуждается в ясности и живом подтверждении.",
    image: "./assets/images/cards/khranitelnitsa_tikhoy_vernosti.webp",
  },
  {
    id: "wyrd_060",
    name: "Узел Живого Дела",
    subtitle: "Knot of Living Work",
    keyword: "Команда",
    message:
      "Сейчас сила собирается не в одиночном рывке, а в согласованном труде. Когда роли распределены верно, общее дело начинает расти быстрее, чем мог бы любой отдельный шаг.",
    shadow: "Ты можешь тащить всё на себе или, наоборот, растворяться в общем деле так, что пропадает твоя собственная функция внутри него.",
    image: "./assets/images/cards/uzel_zhivogo_dela.webp",
  },
  {
    id: "wyrd_061",
    name: "Трон Корней",
    subtitle: "The Throne of Roots",
    keyword: "Лидерство",
    message:
      "Место силы уже вырастает из того, что ты умеешь держать и направлять. Здесь лидерство не про громкость, а про устойчивость, ответственность и право вести других, не теряя связи с основой.",
    shadow: "Ты можешь бояться своей власти или, наоборот, тянуться к высоте раньше, чем внутренняя опора успела окрепнуть.",
    image: "./assets/images/cards/tron_korney.webp",
  },
  {
    id: "wyrd_062",
    name: "Знак Главного Пути",
    subtitle: "The Mark of the Main Path",
    keyword: "Призвание",
    message:
      "Перед тобой начинает проступать не просто ещё одна возможность, а путь, в котором дело совпадает с твоей внутренней правдой. Это не развилка ради сомнения, а знак того, где твоя сила может стать ремеслом и судьбой одновременно.",
    shadow: "Ты можешь всё ещё искать среди чужих дорог и не замечать, что твой собственный знак уже давно светится прямо перед тобой.",
    image: "./assets/images/cards/znak_glavnogo_puti.webp",
  },
];

export const CARDS = RAW_CARDS.map(function enrichCard(card) {
  const meta = CARD_META[card.name] || {};
  const tone = meta.tone || "neutral";

  return {
    ...card,
    title_ru: card.name,
    title_en: card.subtitle,
    layer: CARD_LAYERS[card.name] || "present",
    state: meta.state || slugify(card.keyword),
    tone,
    links: Array.isArray(meta.links) ? meta.links : [],
    short: meta.short || extractLeadSentence(card.message),
    depth: meta.depth || card.message,
    advice: meta.advice || fallbackAdvice(tone),
    themes: Array.isArray(meta.themes) && meta.themes.length ? meta.themes : [meta.state || slugify(card.keyword)],
    emotion: meta.emotion || fallbackEmotion(tone),
    archetype: meta.archetype || fallbackArchetype(tone),
    intensity: Number.isFinite(meta.intensity) ? meta.intensity : fallbackIntensity(tone),
    spread_variants: meta.spread_variants || buildDefaultSpreadVariants(card),
  };
});

function buildDefaultSpreadVariants(card) {
  const short = extractLeadSentence(card.message);

  return {
    current_message: short,
    what_is_happening: card.message,
    what_is_hidden: card.shadow,
    where_it_leads: short,
    root_of_question: card.message,
    hidden_tension: card.shadow,
    what_supports_you: fallbackAdvice("neutral"),
    nearest_shift: short,
    integrated_message: fallbackAdvice("light"),
  };
}

function extractLeadSentence(value) {
  const match = String(value || "").trim().match(/^(.+?[.!?])(?:\s|$)/);
  return match ? match[1].trim() : String(value || "").trim();
}

function fallbackAdvice(tone) {
  if (tone === "light") {
    return "Держись того, что даёт ясность и мягкое движение вперёд.";
  }

  if (tone === "dark") {
    return "Смотри прямо на главный узел и не отворачивайся от того, что уже назрело.";
  }

  return "Смотри внимательнее на повторяющийся знак и двигайся без лишней спешки.";
}

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

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s*\/\s*/g, "_")
    .replace(/\s+/g, "_")
    .replace(/[^a-zа-я0-9_]/gi, "")
    .replace(/^_+|_+$/g, "");
}
