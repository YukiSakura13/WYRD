# Workflow With Codex

## Цель

Этот документ нужен, чтобы сделать работу с Codex устойчивой, понятной и накопительной, а не разовой от задачи к задаче.

---

## Основной принцип

Codex должен опираться не только на код, но и на согласованный слой проектного контекста.

Это значит:

- сначала смотрим на документацию
- потом принимаем решение
- потом меняем код
- потом обновляем затронутые документы

---

## На что Codex должен опираться в первую очередь

### Быстрый вход в контекст

1. [README.md](/Users/marinamart/Desktop/Oracle_dev/README.md)
2. [docs/README.md](/Users/marinamart/Desktop/Oracle_dev/docs/README.md)
3. [docs/PROJECT_BRIEF.md](/Users/marinamart/Desktop/Oracle_dev/docs/PROJECT_BRIEF.md)

### Для продуктовых задач

1. [docs/ROADMAP.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP.md)
2. [docs/FEATURES.md](/Users/marinamart/Desktop/Oracle_dev/docs/FEATURES.md)
3. [docs/CONTENT_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/CONTENT_MODEL.md)
4. [docs/WYRD_UI_RULES.md](/Users/marinamart/Desktop/Oracle_dev/docs/WYRD_UI_RULES.md) — если задача касается интерфейса, анимации, мобильного UX, раскладов или Голоса Оракула
5. [docs/SPREAD_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/SPREAD_MODEL.md) — если задача касается раскладов, позиций карт, layer, spread logic или Голоса Оракула
6. [docs/ORACLE_VOICE_RULES.md](/Users/marinamart/Desktop/Oracle_dev/docs/ORACLE_VOICE_RULES.md) — если задача касается Голоса Оракула, `message`, `shadow`, логики синтеза расклада или будущего `LLM`-промпта
7. [docs/WYRD_MASTER_CARD_STYLE.md](/Users/marinamart/Desktop/Oracle_dev/docs/WYRD_MASTER_CARD_STYLE.md) — если задача касается генерации, замены, нормализации, фона, формата или визуального стиля карт

### Для технических задач

1. [ARCHITECTURE.md](/Users/marinamart/Desktop/Oracle_dev/ARCHITECTURE.md)
2. [docs/ADR.md](/Users/marinamart/Desktop/Oracle_dev/docs/ADR.md)

### Для silver migration каждого экрана

Перед началом любых правок обязательно полностью прочитать:

1. [WYRD_SILVER_MIGRATION_PROTOCOL.md](./WYRD_SILVER_MIGRATION_PROTOCOL.md)
2. [wyrd-ui-kit.html](./wyrd-ui-kit.html) и интерактивно проверить нужные блоки
3. [WYRD_UI_FOUNDATIONS.md](./WYRD_UI_FOUNDATIONS.md)
4. [WYRD_UI_COMPONENT_MAPPING.md](./WYRD_UI_COMPONENT_MAPPING.md)
5. [WYRD_CONTROL_INVENTORY.md](./WYRD_CONTROL_INVENTORY.md)

Silver UI Kit используется как исполняемый контракт: геометрия и механики
восстанавливаются 1:1. Он не является референсом для свободной интерпретации.
Если нужного компонента нет, сначала обновляется и утверждается сам кит.

---

## Форматы задач, которые работают лучше всего

### Формат 1. Сделать фичу

```text
Сделай фичу <название>.
Перед началом проверь architecture/features/roadmap.
Если надо, сначала обнови документацию, потом код.
```

### Формат 2. Сделать аккуратный рефакторинг

```text
Сделай рефакторинг <зона>.
Не меняй продуктовое поведение без явной необходимости.
После изменений обнови архитектурную документацию.
```

### Формат 3. Сначала подумать, потом делать

```text
Предложи изменение для <цель>.
Сначала обнови архитектурное решение или roadmap.
После согласования реализуй.
```

### Формат 4. Работать в ограничениях

```text
Работай строго в рамках текущей архитектуры.
Без смены стека.
Без лишних зависимостей.
```

---

## Когда документацию нужно обновлять обязательно

- добавили новый пользовательский сценарий
- изменили state-модель
- поменяли структуру модулей
- добавили новую сущность контента
- приняли решение, влияющее на будущее проекта

---

## Минимальный набор документов, который нужно держать актуальным

- [ARCHITECTURE.md](/Users/marinamart/Desktop/Oracle_dev/ARCHITECTURE.md)
- [docs/ROADMAP.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP.md)
- [docs/FEATURES.md](/Users/marinamart/Desktop/Oracle_dev/docs/FEATURES.md)
- [docs/ADR.md](/Users/marinamart/Desktop/Oracle_dev/docs/ADR.md)

---

## Практический рабочий цикл

1. Проверяем Definition of Ready и переводим готовую Linear-задачу в `In Progress`
2. Сверяемся с документацией
3. Если задача выбивается из текущего контекста, сначала обновляем документы
4. Реализуем код в связанной с Linear ID ветке
5. Заполняем PR template, тесты, evidence и self-review
6. Проверяем deploy и публикуем completion report в Linear
7. Создаём follow-ups, обновляем зависимости и только затем переводим задачу в `Done`

Канонический процесс и репозиторные шаблоны: [DEFINITION_OF_READY_DONE.md](/Users/marinamart/Desktop/Oracle_dev/docs/DEFINITION_OF_READY_DONE.md).

---

## Текущий рабочий режим с Codex

Пока пользователь явно не попросит отдельную ветку или PR, рабочая ветка проекта — `main`.

Перед началом правок Codex обязан:

1. Проверить `git status --short --branch`.
2. Убедиться, что рабочая папка `/Users/marinamart/Desktop/Oracle_dev` находится на `main`.
3. Проверить, что есть связанная Linear-задача; если её нет, создать задачу до начала правок.
4. Не мержить старые `codex/*` ветки в `main` без отдельного явного подтверждения пользователя.
5. Для silver migration выполнить preflight из
   [WYRD_SILVER_MIGRATION_PROTOCOL.md](./WYRD_SILVER_MIGRATION_PROTOCOL.md) и
   добавить его acceptance block в экранную Linear-задачу.

После завершения каждой законченной правки Codex обязан:

1. Прогнать релевантные проверки из [RELEASE_CHECKLIST.md](/Users/marinamart/Desktop/Oracle_dev/docs/RELEASE_CHECKLIST.md).
2. Сделать коммит в `main`.
3. Запушить `main` в GitHub.
4. Обновить Linear-задачу итогом, ссылкой на коммит, проверками и остаточными рисками.
5. Перевести Linear-задачу в `Done`, если работа полностью завершена.
6. Вернуть пользователю:
   - номер и ссылку на коммит;
   - ссылку на репозиторий;
   - ссылку на сайт GitHub Pages;
   - ссылку на Linear-задачу;
   - ссылку на проверку/деплой, если она доступна.

Если правка ещё не закончена или требует визуального утверждения, она остаётся без финального коммита до подтверждения пользователя.

---

## Что полезно писать в задачах мне

- цель изменения
- ограничения
- можно ли менять архитектуру
- нужно ли сначала обновить документы
- должен ли я предложить варианты или сразу делать

---

## Что я буду делать как базовое правило

- сначала смотреть существующую структуру и документы
- стараться не ломать текущую архитектуру без причины
- если изменение заметное, обновлять документацию вместе с кодом
- опираться на этот документ как на рабочее соглашение
- для UI, motion и раскладов дополнительно сверяться с [docs/WYRD_UI_RULES.md](/Users/marinamart/Desktop/Oracle_dev/docs/WYRD_UI_RULES.md)
- для моделей чтения и логики расклада дополнительно сверяться с [docs/SPREAD_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/SPREAD_MODEL.md)
- для Голоса Оракула дополнительно сверяться с [docs/ORACLE_VOICE_RULES.md](/Users/marinamart/Desktop/Oracle_dev/docs/ORACLE_VOICE_RULES.md)
- для работы с изображениями карт дополнительно сверяться с [docs/WYRD_MASTER_CARD_STYLE.md](/Users/marinamart/Desktop/Oracle_dev/docs/WYRD_MASTER_CARD_STYLE.md); визуальная сила карты важнее механической одинаковости фона, масштаба и кропа

---

## Правило проверки результата

Для проекта `WYRD` базовый способ проверки такой:

- локальный `python3 -m http.server 4173` допустим как быстрый smoke-контур
- `localhost` используем для ранней проверки UI, PWA и регрессий
- финальная проверка публикации всё равно идёт через GitHub Actions и GitHub Pages

Что это значит для дальнейшей работы:

- можно предлагать локальный `http.server`, когда это помогает быстро проверить регрессию
- не подменять локальной проверкой финальный publish-check
- считать GitHub Pages финальным контуром проверки релиза

---

## Change Log

### 2026-04-05

- создан рабочий документ по взаимодействию с Codex

### 2026-04-15

- зафиксировано правило: локальный `python3 -m http.server 4173` не используем, проверка идёт через GitHub

### 2026-05-09

- обновлено правило проверки: локальный `http.server` допустим для smoke-check, финальная publish-проверка идёт через GitHub Actions и GitHub Pages

### 2026-06-06

- добавлен отдельный источник правил для арт-дирекшена и обработки изображений карт: [docs/WYRD_MASTER_CARD_STYLE.md](/Users/marinamart/Desktop/Oracle_dev/docs/WYRD_MASTER_CARD_STYLE.md)

### 2026-07-03

- зафиксирован текущий режим работы: основная рабочая ветка `main`, Linear-задача на каждую правку, push после завершения и отчёт пользователю со ссылками на commit, repo, site, Linear и проверку
