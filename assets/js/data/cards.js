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
      "Внутренний компас не ошибается. Он и раньше не ошибался. Довериться и пойти — вот что осталось.",
    shadow:
      "Ожидание проводника затянулось. Но если дорога уже видна, зачем ждать, что кто-то на неё укажет?",
    image: "./assets/images/cards/khranitel_lesa.webp",
  },
  {
    id: "wyrd_002",
    name: "Вестник Чёрных Крыльев",
    subtitle: "Harbinger of the Black Wings",
    keyword: "Трансформация",
    message:
      "Что-то заканчивается. И это правильно. Не цепляйся за уходящее — в каждом конце спрятано начало чего-то, что ты ещё не умеешь назвать.",
    shadow: "Ты цепляешься за то, что уже ушло. Держишь форму, которая давно пуста.",
    image: "./assets/images/cards/vestnik_chernykh_krylev.webp",
  },
  {
    id: "wyrd_003",
    name: "Всевидящий Плащ",
    subtitle: "All-Seeing Cloak",
    keyword: "Тайное знание",
    message:
      "Не всё сейчас открыто полностью. Но ты уже чувствуешь больше, чем тебе кажется. Доверься тому, что скрыто от глаз, но ясно внутри.",
    shadow: "Ты уже замечаешь то, что не хочется признавать. Что именно ты пытаешься от себя скрыть?",
    image: "./assets/images/cards/vsevidyashchiy_plashch.webp",
  },
  {
    id: "wyrd_004",
    name: "Хранитель Времени",
    subtitle: "Timekeeper Owl",
    keyword: "Момент",
    message:
      "Всему своё время. Не торопи и не задерживай. Доверься своей интуиции и поймай нужный момент.",
    shadow: "Ты не можешь понять, пришёл момент или ещё не время. Почему тебе так сложно прислушаться к себе?",
    image: "./assets/images/cards/khranitel_vremeni.webp",
  },
  {
    id: "wyrd_005",
    name: "Тёмный Гость",
    subtitle: "The Dark Guest",
    keyword: "Манипуляция",
    message:
      "Не каждый, кто входит в твой круг, приходит с добром. Кто-то рядом может говорить как свой, но думать только о себе. Присмотрись к тому, чьему слову ты доверяешь.",
    shadow: "Что-то в этом человеке уже настораживает. Почему ты всё ещё делаешь вид, что не замечаешь этого?",
    image: "./assets/images/cards/strazh_nochi.webp",
  },
  {
    id: "wyrd_006",
    name: "Хранитель Фонаря",
    subtitle: "Lantern Keeper Moth",
    keyword: "Притяжение",
    message:
      "Остерегайся того, кто сейчас рядом с тобой. Свет его фонаря предназначен только для него самого. Ты просто живой источник на чужой тропе — силы уходят незаметно.",
    shadow: "Чужой свет всё ещё кажется спасением. Почему так трудно заметить, что он светит не для тебя?",
    image: "./assets/images/cards/khranitel_fonarya.webp",
  },
  {
    id: "wyrd_007",
    name: "Леший",
    subtitle: "Spirit of the Forest",
    keyword: "Ритуал",
    message:
      "Прежде чем двигаться — пойми, зачем. Каждый шаг в лесу оставляет след. Освяти намерение, прежде чем действовать.",
    shadow: "Ты делаешь шаги, которые никуда не ведут.",
    image: "./assets/images/cards/leshiy.webp",
  },
  {
    id: "wyrd_008",
    name: "Лисий Огонь",
    subtitle: "Foxfire",
    keyword: "Обман",
    message:
      "Иногда красивые огоньки могут увести тебя в другую сторону. Знаешь ли ты, как себя защитить? Присмотрись к тому, куда ты идёшь и кто подсвечивает этот путь.",
    shadow: "Почему обманчивый свет тебя так манит?",
    image: "./assets/images/cards/lisiy_ogon.webp",
  },
  {
    id: "wyrd_009",
    name: "Хранительница Лунной Вуали",
    subtitle: "Keeper of the Moon Veil",
    keyword: "Тишина",
    message:
      "Подожди с принятием этого решения. Смотри на знаки, сны и то, что повторяется. Замедлись и приглядись к тому, что пока прикрыто вуалью.",
    shadow: "Почему ты не доверяешь знакам?",
    image: "./assets/images/cards/khranitel_lunnoy_vuali.webp",
  },
  {
    id: "wyrd_010",
    name: "Алтарь Пустоты",
    subtitle: "The Void Altar",
    keyword: "Жертва",
    message:
      "Ты не можешь сохранить всё. Настоящая сила всегда требует цены — плати осознанно, а не по привычке.",
    shadow: "Ты отдаёшь себя вместо того, что действительно важно.",
    image: "./assets/images/cards/altar_pustoty.webp",
  },
  {
    id: "wyrd_011",
    name: "Древо Возрождения",
    subtitle: "The Bone Tree",
    keyword: "Возрождение",
    message:
      "Из этого вырастет что-то новое. Из того, что умерло, прорастает живое. Не бойся стать почвой для чего-то большего.",
    shadow: "Ты держишься за то, что уже умерло.",
    image: "./assets/images/cards/drevo_vozrozhdeniya.webp",
  },
  {
    id: "wyrd_012",
    name: "Плакальщица",
    subtitle: "The Mourning One",
    keyword: "Горе",
    message:
      "Пусть чувства текут сквозь тебя, как капли дождя по ветвям ивы. Не сдерживай их — ведь горе не слабость, а прощальный вздох любви.",
    shadow:
      "Слёзы могут стать домом, если в них задержаться слишком долго. Когда горе становится привычкой, не выбор ли это — увязнуть в этом болоте?",
    image: "./assets/images/cards/plakalshchitsa.webp",
  },
  {
    id: "wyrd_013",
    name: "Страж Порога",
    subtitle: "The Threshold Guardian",
    keyword: "Граница",
    message:
      "Ты уже стоишь у порога. Один шаг отделяет то, что было, от того, что будет. Переход не откроется, пока ты стоишь на месте.",
    shadow:
      "Стоять между — это тоже выбор. Но если не делать шаг, не превратится ли осторожность в остановку?",
    image: "./assets/images/cards/strazh_poroga.webp",
  },
  {
    id: "wyrd_014",
    name: "Волк с Зеркалом",
    subtitle: "The Mirror Wolf",
    keyword: "Прошлое отражение",
    message:
      "Ты всё ещё смотришь в зеркало, где живёт твоя старая версия. Пока ты не избавишься от этого отражения, настоящее так и будет искажаться.",
    shadow: "Почему прошлый образ до сих пор кажется убедительнее настоящего?",
    image: "./assets/images/cards/volk_s_zerkalom.webp",
  },
  {
    id: "wyrd_015",
    name: "Ткачиха Судьбы",
    subtitle: "The Fate Weaver",
    keyword: "Нити судьбы",
    message:
      "Случайностей сейчас меньше, чем кажется. Между событиями уже тянутся нити, даже если весь узор пока скрыт. Смотри внимательнее на то, что циклично связывает одно с другим — там может прятаться урок из прошлого.",
    shadow: "Фрагменты кажутся хаосом. Почему так трудно поверить, что у происходящего уже есть узор?",
    image: "./assets/images/cards/tkachikha_sudby.webp",
  },
  {
    id: "wyrd_016",
    name: "Уроборос",
    subtitle: "The Eternal Serpent",
    keyword: "Цикл",
    message:
      "Ты снова подходишь к тому же месту. Но круг — не тюрьма, если внутри горит свеча. Этот цикл не ловушка, он готовит новый виток.",
    shadow: "Движение по кругу кажется бесконечным. Но что если дело не в круге, а в том, что внутри него нужно что-то изменить?",
    image: "./assets/images/cards/uroboros.webp",
  },
  {
    id: "wyrd_017",
    name: "Лесной Знахарь",
    subtitle: "The Forest Shaman",
    keyword: "Яд / Лекарство",
    message:
      "Одно и то же растение лечит и убивает. Всё зависит от дозы и намерения. Что ты несёшь в своей чаше — и кому?",
    shadow: "Ты даёшь другим то, в чём сам нуждаешься.",
    image: "./assets/images/cards/lesnoi_znakhar.webp",
  },
  {
    id: "wyrd_018",
    name: "Вещий Ворон",
    subtitle: "The Oracle Raven",
    keyword: "Знак",
    message:
      "Судьба бросает тебе очередной вызов. Ворон уже принёс тебе правду без прикрас. Твой опыт подскажет, что нужно сделать.",
    shadow: "Ответ уже рядом, но хочется отвернуться от него. Что именно так трудно принять?",
    image: "./assets/images/cards/veshchiy_voron.webp",
  },
  {
    id: "wyrd_019",
    name: "Рой",
    subtitle: "The Swarm",
    keyword: "Пробуждение",
    message:
      "Ты увидел. Что-то внутри тебя сдвинулось и уже не вернётся на место. Это не конец — это начало движения.",
    shadow: "Ты сделал вид, что ничего не произошло.",
    image: "./assets/images/cards/roy.webp",
  },
  {
    id: "wyrd_020",
    name: "Хранитель Нитей",
    subtitle: "The Thread Keeper",
    keyword: "Судьба",
    message:
      "Он знает, где начинается твоя нить и где она узлом сходится с чужой. Распутай то, что сам же завязал.",
    shadow: "Ты называешь это судьбой — но это твои собственные узлы.",
    image: "./assets/images/cards/khranitel_nitey.webp",
  },
  {
    id: "wyrd_021",
    name: "Страж с Ключом",
    subtitle: "The Keykeeper",
    keyword: "Тайна",
    message:
      "У тебя уже есть ключ. То, что за дверью, больше не тайна. Путь открывается тому, кто готов войти.",
    shadow:
      "Замок уже давно поддаётся, но ты всё ещё не решаешься повернуть ключ. Если не открыть, как узнать, что там на самом деле?",
    image: "./assets/images/cards/strazh_s_klyuchom.webp",
  },
  {
    id: "wyrd_022",
    name: "Паук Звёздной Сети",
    subtitle: "The Star Spider",
    keyword: "Связи между событиями",
    message:
      "В этой ситуации всё не случайно. Паук чувствует каждую нить между людьми и событиями — каждое движение в паутине видно. Осмотрись ещё раз, прежде чем принимать решение.",
    shadow:
      "Ты замечаешь только мелочи, но пока не видишь, как они соединены. Что мешает взглянуть на всю паутину?",
    image: "./assets/images/cards/pauk_zvezdnoy_seti.webp",
  },
  {
    id: "wyrd_023",
    name: "Ёж",
    subtitle: "The Hedgehog",
    keyword: "Граница",
    message:
      "Твои иглы — не злоба. Это мудрость тела, которое знает, когда сворачиваться. Граница — это не стена, это забота о себе.",
    shadow: "Ты прячешься под иглами от тех, кто хочет тебя согреть.",
    image: "./assets/images/cards/ezh.webp",
  },
  {
    id: "wyrd_024",
    name: "Жаба Верного Часа",
    subtitle: "The Toad of the True Hour",
    keyword: "Терпение",
    message:
      "Всему своё время. То, что кажется неподвижным, уже начинает прорастать. Держи то, что должно дозреть.",
    shadow: "Ожидание стало привычным делом. Ты ещё помнишь, чего ждёшь?",
    image: "./assets/images/cards/zhaba.webp",
  },
  {
    id: "wyrd_025",
    name: "Русалка",
    subtitle: "The Water Spirit",
    keyword: "Глубина",
    message:
      "Заглянуть в это зеркало страшно. Отвернуться — значит так и не узнать правду. Лик манит, уводя от настоящего. Кто там отражается — это и есть ты?",
    shadow: "Зеркало показывает желаемое. Сколько ещё ему можно верить и не замечать себя?",
    image: "./assets/images/cards/rusalka.webp",
  },
  {
    id: "wyrd_026",
    name: "Свеча",
    subtitle: "The Candle Spirit",
    keyword: "Свет",
    message:
      "Ты чувствуешь, что скоро тебе приоткроется тайна. И где-то внутри тебя уже есть ответ, как распорядиться этим знанием. Доверься тому, что откликается внутри.",
    shadow: "Свеча горит, но ты ей не веришь. Почему так сложно довериться внутреннему свету?",
    image: "./assets/images/cards/svecha.webp",
  },
  {
    id: "wyrd_027",
    name: "Грибница",
    subtitle: "The Mycelium",
    keyword: "Связь",
    message:
      "Под землёй всё связано. То, что кажется отдельным — часть одного живого. Ты не одна — даже когда кажется иначе.",
    shadow: "Ты оборвала нити, которые тебя держали. И называешь это свободой.",
    image: "./assets/images/cards/gribnitsa.webp",
  },
  {
    id: "wyrd_028",
    name: "Золотой Олень",
    subtitle: "The Golden Deer",
    keyword: "Дар",
    message:
      "Золотой Олень выходит не к каждому. Его появление уже знак. Воспользуйся шансом, который тебе выпал.",
    shadow: "Что-то шепчет, что этот шанс не твой. Чей это голос?",
    image: "./assets/images/cards/zolotoy_olen.webp",
  },
  {
    id: "wyrd_029",
    name: "Заря",
    subtitle: "The Dawn Spirit",
    keyword: "Рассвет",
    message:
      "Лес ещё тёмный, но свет уже касается верхушек деревьев. Ночь не длится вечно — даже самая долгая.",
    shadow: "Ты так привыкла к темноте, что не замечаешь, что уже рассветает.",
    image: "./assets/images/cards/zarya.webp",
  },
  {
    id: "wyrd_030",
    name: "Орёл",
    subtitle: "The Eagle",
    keyword: "Высокий обзор",
    message:
      "Орёл уже открыл перед тобой карту происходящего и указывает на главное. Отправляйся за новыми знаниями туда, где сейчас сильнее всего твой живой интерес. Там лежит ответ.",
    shadow: "Внимание зацепилось лишь за одну точку на карте. Что мешает взглянуть на всю картину целиком?",
    image: "./assets/images/cards/orel.webp",
  },
  {
    id: "wyrd_031",
    name: "Цветущая Ветвь",
    subtitle: "The Flowering Branch",
    keyword: "Рост",
    message:
      "Из мёртвого дерева вырастает цветок. Это не метафора — это то, что происходит прямо сейчас с тобой.",
    shadow: "Ты держишься за мёртвую форму и не даёшь новому прорасти.",
    image: "./assets/images/cards/tsvetushchaya_vetv.webp",
  },
  {
    id: "wyrd_032",
    name: "Крыса Тёмных Троп",
    subtitle: "The Rat of Dark Paths",
    keyword: "Выживание",
    message:
      "Там, где другие видят только стену, ты замечаешь щель. И находишь то, что другие просмотрели. То, что найдено, то твоё.",
    shadow: "Выживание стало слишком привычным. Где теперь жизнь, а где только способ не пропасть?",
    image: "./assets/images/cards/krysa.webp",
  },
  {
    id: "wyrd_033",
    name: "Водяной",
    subtitle: "The Water Spirit",
    keyword: "Подъём",
    message:
      "Что-то было утоплено давно. Оно не исчезло — оно лежит на дне и ждёт, когда ты будешь готова его поднять.",
    shadow: "Ты продолжаешь топить то, что просится на поверхность.",
    image: "./assets/images/cards/vodyanoy.webp",
  },
  {
    id: "wyrd_034",
    name: "Туман",
    subtitle: "The Fog",
    keyword: "Неясность",
    message:
      "Ты не видишь следующего шага. Это не опасность — это пространство между. Туман не врёт.",
    shadow: "Ты называешь неопределённость провалом.",
    image: "./assets/images/cards/tuman.webp",
  },
  {
    id: "wyrd_035",
    name: "Зимний Сон",
    subtitle: "The Winter Sleep",
    keyword: "Пауза",
    message:
      "Это не смерть и не слабость. Это медведь под снегом — живой, дышащий, копящий силу. Ты имеешь право на паузу.",
    shadow: "Ты путаешь отдых с бегством.",
    image: "./assets/images/cards/zimniy_son.webp",
  },
  {
    id: "wyrd_036",
    name: "Выбор",
    subtitle: "The Crossroads",
    keyword: "Решение",
    message:
      "Дорога привела тебя к развилке. Тропы расходятся, и у каждой свой горизонт. Стоять на месте — тоже выбор, только он никуда не ведёт.",
    shadow:
      "Ожидание стало способом не выбирать. Но если решение уже созрело, сколько ещё можно здесь оставаться?",
    image: "./assets/images/cards/vybor.webp",
  },
  {
    id: "wyrd_037",
    name: "Разлом",
    subtitle: "The Fracture",
    keyword: "Трещина",
    message:
      "Это уже сломалось. Не чини. Из трещины растёт то, что было заперто внутри.",
    shadow: "Ты продолжаешь притворяться, что всё в порядке.",
    image: "./assets/images/cards/razlom.webp",
  },
  {
    id: "wyrd_038",
    name: "Тишина",
    subtitle: "The Stillness",
    keyword: "Присутствие",
    message:
      "Не молчание как отсутствие — а тишина как присутствие. В ней говорит то, что важно.",
    shadow: "Ты боишься того, что услышишь, если замолчишь.",
    image: "./assets/images/cards/tishina.webp",
  },
  {
    id: "wyrd_039",
    name: "Жертвенный Огонь",
    subtitle: "The Sacred Fire",
    keyword: "Отдача",
    message:
      "Что ты готова отдать огню? Не потерять — именно отдать. Осознанно. Это разные вещи.",
    shadow: "Ты держишь то, что давно просится в огонь.",
    image: "./assets/images/cards/zhertvennyy_ogon.webp",
  },
  {
    id: "wyrd_040",
    name: "Корень",
    subtitle: "The Root",
    keyword: "Исток",
    message:
      "Ты знаешь, откуда растёшь. Это держит тебя сильнее, чем ты думаешь — и это не всегда плохо.",
    shadow: "Ты сам не хочешь отпускать корень, который тебя душит.",
    image: "./assets/images/cards/koren.webp",
  },
  {
    id: "wyrd_041",
    name: "Круг",
    subtitle: "The Circle",
    keyword: "Целостность",
    message:
      "Ты на своём месте. Не где-то потом — прямо сейчас. Это редкое ощущение. Не спугни его анализом.",
    shadow: "Ты боишься выйти за пределы того, что уже понятно.",
    image: "./assets/images/cards/krug.webp",
  },
  {
    id: "wyrd_042",
    name: "Искра Леса",
    subtitle: "The Forest Spark",
    keyword: "Игра",
    message:
      "Искра не ждёт подходящего момента. Она вспыхивает. Доверься этому импульсу. Он возник не случайно.",
    shadow: "Вдохновение приходит, но что-то удерживает от первого шага. Что именно?",
    image: "./assets/images/cards/iskra_lesa.webp",
  },
  {
    id: "wyrd_043",
    name: "Собиратель Орехов",
    subtitle: "The Joy Gatherer",
    keyword: "Радость",
    message:
      "Радость — не громкая. Она тихо складывается в ладонях: в тёплом воздухе, в случайной мысли, в чём-то маленьком. Ты уже держишь больше, чем замечаешь.",
    shadow: "Ты ищешь большой свет и не замечаешь маленьких огней. И говоришь, что радости нет.",
    image: "./assets/images/cards/sobiratel_orekhov.webp",
  },
  {
    id: "wyrd_044",
    name: "Текущая Река",
    subtitle: "The Living Current",
    keyword: "Поток",
    message:
      "Ты уже плывёшь по течению. Поток не требует от тебя усилий. Там, где есть доверие, путь раскрывается сам.",
    shadow:
      "Течение несёт легко и приятно. Но если не выбирать направление, то как понять, к какому берегу приплывёшь?",
    image: "./assets/images/cards/tekushchaya_reka.webp",
  },
  {
    id: "wyrd_045",
    name: "Перо Ветра",
    subtitle: "The Wind Feather",
    keyword: "Лёгкость",
    message:
      "Что-то уже отслужило своё. Отпусти, и оно само найдёт своё место. Лёгкость после этого — не пустота, а освобождение.",
    shadow: "У тебя есть то, что тяжело нести, но признавать это не хочется. От чего пора отказаться, чтобы продолжить путь?",
    image: "./assets/images/cards/pero_vetra.webp",
  },
  {
    id: "wyrd_046",
    name: "Соловей Рассвета",
    subtitle: "The Dawn Nightingale",
    keyword: "Голос",
    message:
      "Внутри уже звучит что-то живое. Не идеальное, настоящее. Позволь этому прозвучать.",
    shadow: "Ты молчишь, чтобы сохранить себя, или чтобы не делать шаг?",
    image: "./assets/images/cards/solovey_rassveta.webp",
  },
  {
    id: "wyrd_047",
    name: "Бурундук Лесных Троп",
    subtitle: "The Path Chipmunk",
    keyword: "Шаг",
    message:
      "Маленький шаг — это уже движение. Путь складывается из таких шагов, даже если ты их не замечаешь. Продолжай идти.",
    shadow: "Мелкие дела шумят вокруг, а что-то важное всё ещё ждёт твоего первого шага.",
    image: "./assets/images/cards/burunduk_lesnykh_trop.webp",
  },
  {
    id: "wyrd_048",
    name: "Светляк в Ночи",
    subtitle: "The Firefly at Night",
    keyword: "Свет",
    message:
      "Видеть весь путь сразу не обязательно. Иногда достаточно следующего шага. Твоего света хватит, чтобы идти.",
    shadow: "Ясность так и не приходит, а первый шаг всё откладывается. Чего ты на самом деле ждёшь?",
    image: "./assets/images/cards/svetlyak.webp",
  },
  {
    id: "wyrd_049",
    name: "Лунные Влюблённые",
    subtitle: "The Moon Lovers",
    keyword: "Любовь",
    message:
      "Человек, о котором ты думаешь, имеет светлые помыслы — ваши чувства взаимны. Нити любви уже сплетаются между вами. Позволь этому быть.",
    shadow:
      "Две луны близки, но близость — это ещё не слияние. Видишь ли ты того, кто рядом, или только своё отражение в нём?",
    image: "./assets/images/cards/lunnye_vlyublennye.webp",
  },
  {
    id: "wyrd_050",
    name: "Пламя Под Кожей",
    subtitle: "The Flame Beneath the Skin",
    keyword: "Страсть",
    message:
      "Между вами не просто интерес, а электрический разряд, который невозможно игнорировать. Это пожар, скрытый под поверхностью, готовый вспыхнуть при малейшем касании.",
    shadow:
      "Искра, породившая пожар, может спалить всё дотла. Ты видишь настоящее чувство или только огонь, который ослепляет?",
    image: "./assets/images/cards/plamya_pod_kozhey.webp",
  },
  {
    id: "wyrd_051",
    name: "Поцелуй Тени",
    subtitle: "The Kiss of Shadow",
    keyword: "Соблазн",
    message:
      "Это притяжение противоположностей, которое захватывает дух, но не обещает безопасности. Между вами бежит электрический ток, но искры между драконами создают свет лишь в момент столкновения. Встреча с этим человеком может стать испытанием.",
    shadow:
      "Кажется, что этот огонь можно приручить и выйти из игры без потерь. Но если выбираешь этот путь, готовься к борьбе. Действительно ли стоит рисковать своим спокойствием ради такой искры?",
    image: "./assets/images/cards/potseluy_teni.webp",
  },
  {
    id: "wyrd_052",
    name: "Скреплённые Ветви",
    subtitle: "The Bound Branches",
    keyword: "Союз",
    message:
      "Ваш союз не случаен. Любовь пустила корни и стала невидимой опорой для обоих. Она держит вас крепче, чем вы думаете.",
    shadow:
      "Основа прочна. Но когда последний раз в этом союзе горел общий огонь?",
    image: "./assets/images/cards/skreplennye_vetvi.webp",
  },
  {
    id: "wyrd_053",
    name: "Зерно Урожая",
    subtitle: "The Grain of Harvest",
    keyword: "Плод труда",
    message:
      "Зерно, посаженное в землю, уже прорастает. Вложенное начинает возвращаться. Урожай созревает.",
    shadow: "Терпение может кончиться раньше срока. Так можно уйти до первого ростка.",
    image: "./assets/images/cards/zerno_urozhaya.webp",
  },
  {
    id: "wyrd_054",
    name: "Лесной Резчик",
    subtitle: "The Forest Carver",
    keyword: "Мастерство",
    message:
      "Из простого рождается ценное. Знание уже живёт внутри тебя. Мастерство — это тихая магия, которая уже стала твоей частью.",
    shadow: "Привычное кажется обычным. А чудо, которое рождается каждый день, остаётся незамеченным. Ты видишь это?",
    image: "./assets/images/cards/lesnoi_rezchik.webp",
  },
  {
    id: "wyrd_055",
    name: "Лестница Ветвей",
    subtitle: "The Branch Ladder",
    keyword: "Восхождение",
    message:
      "Ветви уже сплелись в лестницу. Твой подъём уже начался и становится заметным. Продолжай движение вверх.",
    shadow: "Высота пугает сильнее, чем путь к ней. Что тебя держит внизу?",
    image: "./assets/images/cards/lestnica_vetvei.webp",
  },
  {
    id: "wyrd_056",
    name: "Золотая Мера",
    subtitle: "The Golden Measure",
    keyword: "Мера",
    message:
      "На одной чаше весов уже лежит твой труд. Весы начинают выравниваться. Твои усилия ищут честную отдачу.",
    shadow: "Малое стало привычной ценой. Это твой выбор или просто привычка?",
    image: "./assets/images/cards/zolotaya_mera.webp",
  },
  {
    id: "wyrd_057",
    name: "Хранитель Прощающего Сердца",
    subtitle: "Keeper of the Forgiving Heart",
    keyword: "Прощение",
    message:
      "Твоё сердце разбито, и обида пока не отпускает. Прощение не отменяет того, что случилось, но помогает свету излечить шрамы души. Можешь ли ты позволить себе больше не держаться за то, что ранит?",
    shadow:
      "Иногда боль остаётся просто потому, что отпускать её страшнее, чем нести. Что ты всё ещё защищаешь своей обидой?",
    image: "./assets/images/cards/khranitel_proshchayushchego_serdtsa.webp",
  },
  {
    id: "wyrd_058",
    name: "Ткач Возвращённого Света",
    subtitle: "Weaver of the Returned Light",
    keyword: "Возвращение",
    message:
      "Свет между вами ещё не догорел. То, что казалось ушедшим, ещё можно вернуть. Но возвращение былого требует участия двоих.",
    shadow:
      "Не всякий возвращённый свет означает, что старая боль ушла. Что должно измениться, чтобы всё снова не повторилось?",
    image: "./assets/images/cards/tkach_vozvrashchennogo_sveta.webp",
  },
  {
    id: "wyrd_059",
    name: "Хранительница Тихой Верности",
    subtitle: "Keeper of Quiet Fidelity",
    keyword: "Верность",
    message:
      "Рядом с тобой уже приютилась преданность. Она не требует слов, не ищет признания и держит, как глубокая вода — тихо и надёжно.",
    shadow:
      "Тишина может быть опорой, а может молчанием о недосказанном. Замечаешь ли ты эту преданность или принимаешь её как должное?",
    image: "./assets/images/cards/khranitelnitsa_tikhoy_vernosti.webp",
  },
  {
    id: "wyrd_060",
    name: "Узел Живого Дела",
    subtitle: "Knot of Living Work",
    keyword: "Команда",
    message:
      "Там, где нити сплетаются в один узор, дело оживает. Пусть каждый выполняет свою роль, и узел станет крепче.",
    shadow: "Узел стягивается слишком туго, когда одну нить тянут сильнее остальных. Где в этом деле твоя роль?",
    image: "./assets/images/cards/uzel_zhivogo_dela.webp",
  },
  {
    id: "wyrd_061",
    name: "Старейшина Леса",
    subtitle: "The Elder of the Forest",
    keyword: "Лидерство",
    message:
      "Ты уже на своём месте, и это не случайно. Тебе есть на что опереться, и есть кому следовать за тобой. Веди за собой, ведь ты знаешь дорогу.",
    shadow: "Ты всё ещё ждёшь разрешения занять своё место. Но кто должен его дать, если лес уже признал тебя?",
    image: "./assets/images/cards/tron_korney.webp",
  },
  {
    id: "wyrd_062",
    name: "Знак Главного Пути",
    subtitle: "The Mark of the Main Path",
    keyword: "Призвание",
    message:
      "На твоём пути уже есть знак, который указывает нужное направление. Он уже светится перед тобой. Верная дорога не так далека, как кажется.",
    shadow: "Чужие дороги изучены вдоль и поперёк. Когда в последний раз был замечен собственный знак?",
    image: "./assets/images/cards/znak_glavnogo_puti.webp",
  },
  {
    id: "wyrd_063",
    name: "Золотой Ручей",
    subtitle: "The Golden Stream",
    keyword: "Поток",
    message:
      "Золотой ручей бежит там, где свободно русло. Позволь этому живому потоку найти путь. Достаток приходит туда, где открыты дороги.",
    shadow: "Вода застаивается там, где перекрыто течение. Что сейчас мешает потоку двигаться?",
    image: "./assets/images/cards/zolotoy_ruchey.webp",
  },
  {
    id: "wyrd_064",
    name: "Венец После Бури",
    subtitle: "The Crown After the Storm",
    keyword: "Победа",
    message:
      "Самая тяжёлая часть пути уже пройдена или подходит к завершению. Эта карта говорит о заслуженном итоге, когда стойкость начинает превращаться в результат, а тьма — уступать место награде.",
    shadow: "Ты можешь так привыкнуть к борьбе, что не заметишь момент, когда уже можно принять победу и перестать жить в режиме непрерывной бури.",
    image: "./assets/images/cards/venets_posle_buri.webp",
  },
  {
    id: "wyrd_065",
    name: "Прыжок Через Огонь",
    subtitle: "Leap Through the Fire",
    keyword: "Мужество",
    message:
      "Страх ещё рядом, но он уже не владеет твоим движением полностью. Здесь мужество рождается не из отсутствия опасности, а из готовности шагнуть через неё и не предать себя в самый важный момент.",
    shadow: "Ты можешь ждать полного исчезновения страха, прежде чем действовать, и из-за этого оставаться перед огнём дольше, чем нужно.",
    image: "./assets/images/cards/pryzhok_cherez_ogon.webp",
  },
  {
    id: "wyrd_066",
    name: "Эхо Вершин",
    subtitle: "Echo of the Heights",
    keyword: "Признание",
    message:
      "Твой голос достиг вершин и возвращается эхом. Тебя слышат. Не сомневайся в том, что уже прозвучало.",
    shadow: "Чужие голоса становятся громче. Ты всё ещё себя слышишь?",
    image: "./assets/images/cards/ekho_vershin.webp",
  },
  {
    id: "wyrd_067",
    name: "Свой Костёр",
    subtitle: "Kindred Fire",
    keyword: "Поддержка",
    message:
      "В твоём окружении есть те, вместе с кем тебе будет тепло. Свои не спрашивают объяснений, они просто рядом. Не закрывайся, их огонь горит для тебя.",
    shadow: "Тепло рядом, но что-то мешает подойти ближе. Что тебя держит в стороне от своих?",
    image: "./assets/images/cards/svoy_koster.webp",
  },
  {
    id: "wyrd_068",
    name: "Дом Под Корой",
    subtitle: "Home Beneath the Bark",
    keyword: "Дом",
    message:
      "Сейчас для тебя нет ничего важнее твоих родных. Связь с ними сильнее, чем кажется. И они ждут тебя.",
    shadow: "Связь с родными незаметно ослабла. Когда последний раз тебе было по-настоящему тепло рядом с ними?",
    image: "./assets/images/cards/dom_pod_koroy.webp",
  },
  {
    id: "wyrd_069",
    name: "Родная Стая",
    subtitle: "Kindred Pack",
    keyword: "Свои",
    message:
      "Среди своих и молчание громче всяких слов. Рядом с ними можно быть собой, без объяснений и усилий. Иди к своим, они уже ждут тебя.",
    shadow: "Вокруг тебя много людей, но ты не видишь в них своих. Твоя ли это стая?",
    image: "./assets/images/cards/rodnaya_staya.webp",
  },
  {
    id: "wyrd_070",
    name: "Чужая Стая",
    subtitle: "Strange Pack",
    keyword: "Чужие",
    message:
      "В правильном ли ты сейчас месте? Здоровое ли у тебя окружение? Может, уже пора что-то менять?",
    shadow: "Чужая среда стала для тебя привычной. Ты ещё помнишь, каково быть среди своих?",
    image: "./assets/images/cards/chuzhaya_staya.webp",
  },
  {
    id: "wyrd_071",
    name: "Тропа Домой",
    subtitle: "Path Home",
    keyword: "Возвращение",
    message:
      "Вспомни о тех, кто дарит тебе силу, опору и энергию. Свет в их доме горит для тебя. Вместе вам многое по силам.",
    shadow: "Расстояние между вами незаметно выросло. Кто должен сделать первый шаг, и почему до сих пор этого не случилось?",
    image: "./assets/images/cards/tropa_domoy.webp",
  },
  {
    id: "wyrd_072",
    name: "Дружеский Совет",
    subtitle: "Friendly Counsel",
    keyword: "Совет",
    message:
      "Проблему поможет решить общение с друзьями. Поговори с теми, кому ты доверяешь. Прислушайся и двигайся дальше.",
    shadow: "Нужное слово уже могло быть сказано. Не пора ли что-то делать?",
    image: "./assets/images/cards/druzheskiy_sovet.webp",
  },
  {
    id: "wyrd_073",
    name: "Скрытый Исток",
    subtitle: "The Hidden Source",
    keyword: "Творческая сила",
    message:
      "В тебе есть сила, которая ещё не вышла наружу. Творчество — её путь. Позволь ей проявиться, и ответ проявится сам.",
    shadow: "Сила есть. Что мешает ей выйти наружу?",
    image: "./assets/images/cards/skrytyy_istok.webp",
  },
  {
    id: "wyrd_074",
    name: "Судьбоносная Встреча",
    subtitle: "The Fated Meeting",
    keyword: "Поворотный момент",
    message:
      "Эта встреча не случайна. Человек, который появился или появится, несёт с собой что-то важное — урок, поворот, новую главу. После этой встречи твоя жизнь уже не будет прежней.",
    shadow:
      "Не каждая судьбоносная встреча обещает счастливый финал. Сможешь ли ты принять то, что она принесёт, даже если это не оправдает твою надежду?",
    image: "./assets/images/cards/sudbonosnaya_vstrecha.webp",
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
