# Документация проекта WYRD

## Назначение

Эта папка — единая база знаний по проекту `WYRD`, на которую можно опираться при разработке, планировании и совместной работе с Codex.

Главный принцип:

- если меняется продукт, структура, сценарии или правила работы, сначала обновляем соответствующий документ здесь, затем код либо вместе с кодом

---

## С чего начинать

Если нужно быстро понять проект, читать в таком порядке:

1. [TELEGRAM_BETA_SCOPE.md](./TELEGRAM_BETA_SCOPE.md)
2. [LORE_CANON_RULES.md](./LORE_CANON_RULES.md)
3. [PRODUCT_SURFACE_MAP.md](./PRODUCT_SURFACE_MAP.md)
4. [PRODUCT_READINESS_PLAN.md](./PRODUCT_READINESS_PLAN.md)
5. [RESPONSIVE_STRATEGY.md](./RESPONSIVE_STRATEGY.md)
6. [PROJECT_BRIEF.md](./PROJECT_BRIEF.md)
7. [ROADMAP_VISUAL.md](./ROADMAP_VISUAL.md)
8. [ROADMAP.md](./ROADMAP.md)
9. [FEATURES.md](./FEATURES.md)
10. [REFINEMENT_BASELINE.md](./REFINEMENT_BASELINE.md)
11. [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)
12. [DEFINITION_OF_READY_DONE.md](./DEFINITION_OF_READY_DONE.md)
13. [../ARCHITECTURE.md](../ARCHITECTURE.md)
14. [CONTENT_MODEL.md](./CONTENT_MODEL.md)
15. [ADR.md](./ADR.md)
16. [WORKFLOW_WITH_CODEX.md](./WORKFLOW_WITH_CODEX.md)
17. [WYRD_MASTER_CARD_STYLE.md](./WYRD_MASTER_CARD_STYLE.md)
18. [WYRD_UI_FOUNDATIONS.md](./WYRD_UI_FOUNDATIONS.md)
19. [WYRD_UI_COMPONENT_MAPPING.md](./WYRD_UI_COMPONENT_MAPPING.md)
20. [WYRD_SILVER_MIGRATION_PROTOCOL.md](./WYRD_SILVER_MIGRATION_PROTOCOL.md)
21. [wyrd-ui-kit.html](./wyrd-ui-kit.html)
22. [TRACES_AND_GIFTS_MODEL.md](./TRACES_AND_GIFTS_MODEL.md)

---

## Карта документов

### Продукт

- [TELEGRAM_BETA_SCOPE.md](./TELEGRAM_BETA_SCOPE.md) — утверждённое позиционирование, in-scope/out-of-scope и safety-границы первой беты
- [LORE_CANON_RULES.md](./LORE_CANON_RULES.md) — роли Леса, духов, Оракула, Совы/Ворона и implementable safety-границы Lore Bible v1.1
- [PRODUCT_SURFACE_MAP.md](./PRODUCT_SURFACE_MAP.md) — утверждённая карта активных экранов, технических ID, маршрутов, статусов и очереди silver-миграции
- [PRODUCT_READINESS_PLAN.md](./PRODUCT_READINESS_PLAN.md) — сквозные release-ready контракты retention, trust/legal, Telegram launch, operations, content governance, accessibility и будущей монетизации
- [RESPONSIVE_STRATEGY.md](./RESPONSIVE_STRATEGY.md) — width/height breakpoints, container widths, spacing, safe areas, scroll ownership и desktop composition
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) — краткое описание проекта, целей и продукта
- [ROADMAP_VISUAL.md](./ROADMAP_VISUAL.md) — визуальная карта страниц и пользовательского сценария
- [ROADMAP.md](./ROADMAP.md) — план развития
- [FEATURES.md](./FEATURES.md) — список текущих и будущих функций
- [CONTENT_MODEL.md](./CONTENT_MODEL.md) — модель контента, сущностей и текстов
- [SPREAD_MODEL.md](./SPREAD_MODEL.md) — действующая грамматика раскладов на 3 и 5 карт
- [TRACES_AND_GIFTS_MODEL.md](./TRACES_AND_GIFTS_MODEL.md) — инварианты локального дня, Следов, snapshot и Даров
- [ORACLE_VOICE_RULES.md](./ORACLE_VOICE_RULES.md) — правила синтеза Голоса Оракула
- [ORACLE_VOICE_GUIDE.md](./ORACLE_VOICE_GUIDE.md) — словарь, тон и ограничения голоса
- [MONETIZATION_LATER.md](./MONETIZATION_LATER.md) — явно отложенная монетизация вне первой бесплатной беты
- [WYRD_MASTER_CARD_STYLE.md](./WYRD_MASTER_CARD_STYLE.md) — арт-дирекшен, формат и правила обработки изображений карт
- [WYRD_UI_FOUNDATIONS.md](./WYRD_UI_FOUNDATIONS.md) — системный язык UI-компонентов: 4 рамки, Button & Frame Language, depth, motion, состояния и правила упрощения
- [WYRD_UI_COMPONENT_MAPPING.md](./WYRD_UI_COMPONENT_MAPPING.md) — сопоставление текущих runtime-классов с компонентами UI Foundations и порядок безопасной миграции
- [WYRD_SILVER_MIGRATION_PROTOCOL.md](./WYRD_SILVER_MIGRATION_PROTOCOL.md) — обязательный restoration-first протокол: перед каждым экраном прочитать живой кит и перенести утверждённые механики 1:1
- [WYRD_CONTROL_INVENTORY.md](./WYRD_CONTROL_INVENTORY.md) — канонические семейства интерактивных контролов, их маршруты, состояния и владельцы
- [wyrd-ui-kit.html](./wyrd-ui-kit.html) — живой канонический Silver UI Kit и интерактивная проверочная доска `YUK-135`

### Рабочая архитектура колоды

Следующие файлы остаются активными, хотя часть названий содержит `DRAFT` или
`BACKLOG`: их читают валидаторы и на них опирается текущая миграция данных.

- [NEW_ORACLE_ARCHITECTURE_MASTER.md](./NEW_ORACLE_ARCHITECTURE_MASTER.md)
- [NEW_ORACLE_GROUPS_WORKING_MAP.md](./NEW_ORACLE_GROUPS_WORKING_MAP.md)
- [COLLECTION_TABLE_DRAFT.md](./COLLECTION_TABLE_DRAFT.md)
- [COLLECTION_BACKLOG.md](./COLLECTION_BACKLOG.md)

Переименование или объединение этих файлов выполняется только отдельной задачей
с одновременным обновлением валидаторов.

### Техника

- [../ARCHITECTURE.md](../ARCHITECTURE.md) — текущая архитектура сайта
- [ADR.md](./ADR.md) — журнал архитектурных решений
- [REFINEMENT_BASELINE.md](./REFINEMENT_BASELINE.md) — baseline сценариев и regression checklist для безопасного рефакторинга
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) — quality gates перед push и контроль публикации на GitHub Pages

### Совместная работа

- [WORKFLOW_WITH_CODEX.md](./WORKFLOW_WITH_CODEX.md) — как ставить задачи и как поддерживать документацию актуальной
- [DEFINITION_OF_READY_DONE.md](./DEFINITION_OF_READY_DONE.md) — единый цикл готовности задачи, PR, deploy и evidence
- [templates/LINEAR_ISSUE_TEMPLATE.md](./templates/LINEAR_ISSUE_TEMPLATE.md) — шаблон новой задачи Linear

---

## Правила актуальности

- Если меняется структура файлов или модулей, обновляем [../ARCHITECTURE.md](../ARCHITECTURE.md).
- Если меняется продуктовый приоритет, обновляем [ROADMAP.md](./ROADMAP.md).
- Если меняются release-ready контракты, Telegram launch, trust/legal, retention или границы монетизации, обновляем [PRODUCT_READINESS_PLAN.md](./PRODUCT_READINESS_PLAN.md).
- Если добавляется, переименовывается или архивируется экран либо меняется его маршрут, обновляем [PRODUCT_SURFACE_MAP.md](./PRODUCT_SURFACE_MAP.md).
- Если добавляется или меняется сценарий пользователя, обновляем [FEATURES.md](./FEATURES.md).
- Если меняется контентная сущность, формат карты или расклада, обновляем [CONTENT_MODEL.md](./CONTENT_MODEL.md).
- Если меняются правила локального дня, Следов или Даров, обновляем [TRACES_AND_GIFTS_MODEL.md](./TRACES_AND_GIFTS_MODEL.md).
- Если меняется визуальный стиль, формат генерации, фон или правила обработки изображений карт, обновляем [WYRD_MASTER_CARD_STYLE.md](./WYRD_MASTER_CARD_STYLE.md).
- Если меняется язык UI-компонентов, рамок, кнопок, состояний или depth-система, обновляем [WYRD_UI_FOUNDATIONS.md](./WYRD_UI_FOUNDATIONS.md).
- Если меняется соответствие текущих CSS/HTML-классов дизайн-системе, обновляем [WYRD_UI_COMPONENT_MAPPING.md](./WYRD_UI_COMPONENT_MAPPING.md).
- Перед каждой миграцией legacy gold → approved silver выполняем [WYRD_SILVER_MIGRATION_PROTOCOL.md](./WYRD_SILVER_MIGRATION_PROTOCOL.md); локальные отклонения без обновления канонического кита запрещены.
- Если меняется визуальный эталон компонентов UI Kit, обновляем [wyrd-ui-kit.html](./wyrd-ui-kit.html) и проверяем его локально на desktop/mobile.
- Если принимается важное техническое или продуктовое решение, записываем его в [ADR.md](./ADR.md).
- Если меняется выпускной процесс, smoke-проверки или deploy-поток, обновляем [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md).
- Каждая разработка проходит [Definition of Ready & Done](./DEFINITION_OF_READY_DONE.md).

---

## Режим работы с Codex

Базовое правило:

- любой заметный рефакторинг, новая фича или изменение структуры должен сопровождаться обновлением документации

Короткие удобные формулировки задач:

- "сначала обнови документацию, потом код"
- "сделай фичу и обнови все затронутые документы"
- "работай только в рамках текущей архитектуры"
- "предложи архитектурное изменение, потом реализуй"

---

## Change Log

### 2026-08-20

- активные документы отделены от исторических аудитов, золотых спецификаций и
  разовых QA-материалов;
- абсолютные локальные ссылки заменены на переносимые относительные;
- добавлен активный контракт `TRACES_AND_GIFTS_MODEL.md`.

### 2026-07-14

- в индекс добавлена каноническая карта Product Readiness и правило её актуализации

### 2026-04-05

- создан единый индекс проектной документации
