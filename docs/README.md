# Документация проекта WYRD

## Назначение

Эта папка — единая база знаний по проекту `WYRD`, на которую можно опираться при разработке, планировании и совместной работе с Codex.

Главный принцип:

- если меняется продукт, структура, сценарии или правила работы, сначала обновляем соответствующий документ здесь, затем код либо вместе с кодом

---

## С чего начинать

Если нужно быстро понять проект, читать в таком порядке:

1. [TELEGRAM_BETA_SCOPE.md](/Users/marinamart/Desktop/Oracle_dev/docs/TELEGRAM_BETA_SCOPE.md)
2. [LORE_CANON_RULES.md](/Users/marinamart/Desktop/Oracle_dev/docs/LORE_CANON_RULES.md)
3. [PROJECT_BRIEF.md](/Users/marinamart/Desktop/Oracle_dev/docs/PROJECT_BRIEF.md)
4. [ROADMAP_VISUAL.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP_VISUAL.md)
5. [ROADMAP.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP.md)
6. [FEATURES.md](/Users/marinamart/Desktop/Oracle_dev/docs/FEATURES.md)
7. [REFINEMENT_BASELINE.md](/Users/marinamart/Desktop/Oracle_dev/docs/REFINEMENT_BASELINE.md)
8. [RELEASE_CHECKLIST.md](/Users/marinamart/Desktop/Oracle_dev/docs/RELEASE_CHECKLIST.md)
9. [DEFINITION_OF_READY_DONE.md](/Users/marinamart/Desktop/Oracle_dev/docs/DEFINITION_OF_READY_DONE.md)
10. [../ARCHITECTURE.md](/Users/marinamart/Desktop/Oracle_dev/ARCHITECTURE.md)
11. [CONTENT_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/CONTENT_MODEL.md)
12. [ADR.md](/Users/marinamart/Desktop/Oracle_dev/docs/ADR.md)
13. [WORKFLOW_WITH_CODEX.md](/Users/marinamart/Desktop/Oracle_dev/docs/WORKFLOW_WITH_CODEX.md)
14. [WYRD_MASTER_CARD_STYLE.md](/Users/marinamart/Desktop/Oracle_dev/docs/WYRD_MASTER_CARD_STYLE.md)

---

## Карта документов

### Продукт

- [TELEGRAM_BETA_SCOPE.md](/Users/marinamart/Desktop/Oracle_dev/docs/TELEGRAM_BETA_SCOPE.md) — утверждённое позиционирование, in-scope/out-of-scope и safety-границы первой беты
- [LORE_CANON_RULES.md](/Users/marinamart/Desktop/Oracle_dev/docs/LORE_CANON_RULES.md) — роли Леса, духов, Оракула, Совы/Ворона и implementable safety-границы Lore Bible v1.1
- [PROJECT_BRIEF.md](/Users/marinamart/Desktop/Oracle_dev/docs/PROJECT_BRIEF.md) — краткое описание проекта, целей и продукта
- [ROADMAP_VISUAL.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP_VISUAL.md) — визуальная карта страниц и пользовательского сценария
- [ROADMAP.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP.md) — план развития
- [FEATURES.md](/Users/marinamart/Desktop/Oracle_dev/docs/FEATURES.md) — список текущих и будущих функций
- [CONTENT_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/CONTENT_MODEL.md) — модель контента, сущностей и текстов
- [WYRD_MASTER_CARD_STYLE.md](/Users/marinamart/Desktop/Oracle_dev/docs/WYRD_MASTER_CARD_STYLE.md) — арт-дирекшен, формат и правила обработки изображений карт

### Техника

- [../ARCHITECTURE.md](/Users/marinamart/Desktop/Oracle_dev/ARCHITECTURE.md) — текущая архитектура сайта
- [ADR.md](/Users/marinamart/Desktop/Oracle_dev/docs/ADR.md) — журнал архитектурных решений
- [REFINEMENT_BASELINE.md](/Users/marinamart/Desktop/Oracle_dev/docs/REFINEMENT_BASELINE.md) — baseline сценариев и regression checklist для безопасного рефакторинга
- [RELEASE_CHECKLIST.md](/Users/marinamart/Desktop/Oracle_dev/docs/RELEASE_CHECKLIST.md) — quality gates перед push и контроль публикации на GitHub Pages

### Совместная работа

- [WORKFLOW_WITH_CODEX.md](/Users/marinamart/Desktop/Oracle_dev/docs/WORKFLOW_WITH_CODEX.md) — как ставить задачи и как поддерживать документацию актуальной
- [DEFINITION_OF_READY_DONE.md](/Users/marinamart/Desktop/Oracle_dev/docs/DEFINITION_OF_READY_DONE.md) — единый цикл готовности задачи, PR, deploy и evidence
- [templates/LINEAR_ISSUE_TEMPLATE.md](/Users/marinamart/Desktop/Oracle_dev/docs/templates/LINEAR_ISSUE_TEMPLATE.md) — шаблон новой задачи Linear

---

## Правила актуальности

- Если меняется структура файлов или модулей, обновляем [../ARCHITECTURE.md](/Users/marinamart/Desktop/Oracle_dev/ARCHITECTURE.md).
- Если меняется продуктовый приоритет, обновляем [ROADMAP.md](/Users/marinamart/Desktop/Oracle_dev/docs/ROADMAP.md).
- Если добавляется или меняется сценарий пользователя, обновляем [FEATURES.md](/Users/marinamart/Desktop/Oracle_dev/docs/FEATURES.md).
- Если меняется контентная сущность, формат карты или расклада, обновляем [CONTENT_MODEL.md](/Users/marinamart/Desktop/Oracle_dev/docs/CONTENT_MODEL.md).
- Если меняется визуальный стиль, формат генерации, фон или правила обработки изображений карт, обновляем [WYRD_MASTER_CARD_STYLE.md](/Users/marinamart/Desktop/Oracle_dev/docs/WYRD_MASTER_CARD_STYLE.md).
- Если принимается важное техническое или продуктовое решение, записываем его в [ADR.md](/Users/marinamart/Desktop/Oracle_dev/docs/ADR.md).
- Если меняется выпускной процесс, smoke-проверки или deploy-поток, обновляем [RELEASE_CHECKLIST.md](/Users/marinamart/Desktop/Oracle_dev/docs/RELEASE_CHECKLIST.md).
- Каждая разработка проходит [Definition of Ready & Done](/Users/marinamart/Desktop/Oracle_dev/docs/DEFINITION_OF_READY_DONE.md).

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
