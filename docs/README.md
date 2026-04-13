# Документация проекта WYRD

## Назначение

Эта папка — единая база знаний по проекту `WYRD`, на которую можно опираться при разработке, планировании и совместной работе с Codex.

Главный принцип:

- если меняется продукт, структура, сценарии или правила работы, сначала обновляем соответствующий документ здесь, затем код либо вместе с кодом

---

## С чего начинать

Если нужно быстро понять проект, читать в таком порядке:

1. [PROJECT_BRIEF.md](/Users/marinamart/Desktop/Oracle_dev/docs/PROJECT_BRIEF.md)
2. [ROADMAP_VISUAL.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP_VISUAL.md)
3. [ROADMAP.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP.md)
4. [FEATURES.md](/Users/marinamart/Desktop/Oracle_dev/docs/FEATURES.md)
5. [../ARCHITECTURE.md](/Users/marinamart/Desktop/Oracle_dev/ARCHITECTURE.md)
6. [CONTENT_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/CONTENT_MODEL.md)
7. [ADR.md](/Users/marinamart/Desktop/Oracle_dev/docs/ADR.md)
8. [WORKFLOW_WITH_CODEX.md](/Users/marinamart/Desktop/Oracle_dev/docs/WORKFLOW_WITH_CODEX.md)

---

## Карта документов

### Продукт

- [PROJECT_BRIEF.md](/Users/marinamart/Desktop/Oracle_dev/docs/PROJECT_BRIEF.md) — краткое описание проекта, целей и продукта
- [ROADMAP_VISUAL.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP_VISUAL.md) — визуальная карта страниц и пользовательского сценария
- [ROADMAP.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP.md) — план развития
- [FEATURES.md](/Users/marinamart/Desktop/Oracle_dev/docs/FEATURES.md) — список текущих и будущих функций
- [CONTENT_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/CONTENT_MODEL.md) — модель контента, сущностей и текстов

### Техника

- [../ARCHITECTURE.md](/Users/marinamart/Desktop/Oracle_dev/ARCHITECTURE.md) — текущая архитектура сайта
- [ADR.md](/Users/marinamart/Desktop/Oracle_dev/docs/ADR.md) — журнал архитектурных решений

### Совместная работа

- [WORKFLOW_WITH_CODEX.md](/Users/marinamart/Desktop/Oracle_dev/docs/WORKFLOW_WITH_CODEX.md) — как ставить задачи и как поддерживать документацию актуальной

---

## Правила актуальности

- Если меняется структура файлов или модулей, обновляем [../ARCHITECTURE.md](/Users/marinamart/Desktop/Oracle_dev/ARCHITECTURE.md).
- Если меняется продуктовый приоритет, обновляем [ROADMAP.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP.md).
- Если добавляется или меняется сценарий пользователя, обновляем [FEATURES.md](/Users/marinamart/Desktop/Oracle_dev/docs/FEATURES.md).
- Если меняется контентная сущность, формат карты или расклада, обновляем [CONTENT_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/CONTENT_MODEL.md).
- Если принимается важное техническое или продуктовое решение, записываем его в [ADR.md](/Users/marinamart/Desktop/Oracle_dev/docs/ADR.md).

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

### 2026-04-05

- создан единый индекс проектной документации
