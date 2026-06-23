# WYRD

Локальная статическая версия мистического оракула на `HTML/CSS/JS` без сборщика.

## Документация проекта

Для работы по проекту теперь есть единая база документов:

- `ARCHITECTURE.md` — архитектура сайта
- `docs/REFINEMENT_BASELINE.md` — baseline поведения и regression checklist для рефакторинга
- `docs/RELEASE_CHECKLIST.md` — минимальные quality gates перед push и после публикации
- `docs/DEFINITION_OF_READY_DONE.md` — обязательный цикл Linear → PR → deploy → evidence
- `docs/TELEGRAM_BETA_SCOPE.md` — утверждённое позиционирование и границы первой беты
- `docs/LORE_CANON_RULES.md` — non-spoiler правила утверждённой Lore Bible v1.1
- `docs/PUBLIC_LORE_COPY.md` — утверждённая публичная копия для страницы «О WYRD»
- `docs/README.md` — индекс всей документации
- `docs/PROJECT_BRIEF.md` — краткое описание продукта
- `docs/ROADMAP_VISUAL.md` — визуальная карта страниц и сценариев
- `docs/ROADMAP.md` — план развития
- `docs/FEATURES.md` — текущие и будущие функции
- `docs/CONTENT_MODEL.md` — модель контента
- `docs/ADR.md` — журнал архитектурных решений
- `docs/WORKFLOW_WITH_CODEX.md` — правила совместной работы с Codex

## Структура

- `index.html` — главный вход
- `assets/css/styles.css` — entry-файл стилей
- `assets/css/tokens.css`, `assets/css/base.css` — токены и базовый слой
- `assets/css/scenes/` — стили по сценам
- `assets/css/components/` — компонентные стили
- `archive/` — архивные прототипы и старые reference-артефакты, не участвующие в production
- `assets/js/main.js` — тонкий entrypoint приложения
- `assets/js/data/cards.js` — канонический источник данных карт
- `assets/js/state/storage.js` — загрузка, сохранение и нормализация состояния
- `assets/js/state/model.js` — канонический state contract и инварианты persistent state
- `assets/js/cards/reading.js` — логика выбора карт и раскладов
- `assets/js/cards/question-routing.js` — публичный entrypoint маршрутизации вопросов
- `assets/js/cards/question-routing/` — config, scoring и group-weighting для question routing
- `assets/js/ui/render.js` — единый рендер UI-секций
- `assets/js/ui/actions.js` — маршрутизация действий пользователя
- `assets/js/ui/render-spread.js`, `assets/js/ui/render-helpers.js` — вспомогательные UI-модули рендера
- `assets/js/ui/share.js`, `assets/js/ui/flow.js`, `assets/js/ui/scenes.js` — UI-хелперы и канонические состояния сцен
- `assets/js/audio.js`, `assets/js/ritual.js`, `assets/js/pwa.js` — побочные эффекты и инфраструктура
- `assets/images/` — cover и изображения карт
- `manifest.webmanifest`, `sw.js` — PWA-обвязка
- `scripts/prepare_pages.py` — подготовка чистого GitHub Pages артефакта
- `scripts/validate_pages_artifact.py` — проверка versioning и состава `.dist-pages` перед деплоем
- `scripts/smoke-domain.mjs` — smoke-проверка доменной маршрутизации перед её рефакторингом
- `scripts/smoke-state.mjs` — smoke-проверка state-инвариантов и persistent store

## Как смотреть локально

Самый простой вариант:

1. Открой `index.html` в браузере

Если хочешь проверить PWA, service worker и итоговый UI локально:

1. В терминале из папки проекта запусти `python3 -m http.server 4173`
2. Открой [http://localhost:4173](http://localhost:4173)

## Quality gates

Перед публикацией в `main` проект теперь проходит минимальный набор проверок:

1. `node scripts/smoke-domain.mjs`
2. `node scripts/smoke-state.mjs`
3. `python3 scripts/validate_product_scope.py`
4. `python3 scripts/validate_lore_canon.py`
5. `python3 scripts/validate_public_lore.py`
6. `python3 scripts/prepare_pages.py`
7. `python3 scripts/validate_pages_artifact.py`

Pull requests дополнительно проходят workflow `PR Governance`: он проверяет ссылку на Linear, acceptance evidence, self-review, deploy plan и follow-ups.

Тот же набор артефактных проверок закреплён и в GitHub Actions workflow `Deploy Pages`.

## Что реализовано

- loading / wake screen
- deck screen
- reveal screen
- 1 бесплатная карта в день
- локальный paywall-preview
- углубление значения
- расклад на 3 карты
- профиль и история
- звук шуршания карт
- сохранение состояния в `localStorage`

## Что подготовлено, но пока не подключено в основной UX

- модуль ритуального таймера на 3 секунды (`assets/js/ritual.js`)

## Что изменилось в архитектуре

- удалён монолитный `app.js`; приложение собрано из маленьких ES-модулей
- убрано дублирование данных карт: источник истины теперь один
- состояние и UI-переходы централизованы, чтобы проще добавлять новые сценарии
- `sw.js` обновлён под новую модульную структуру
- добавлен baseline-документ для безопасной полировки и regression-проверки
- `styles.css` превращён в тонкий entry-файл с `@import` на CSS-модули
- UI-слой начал дробиться на отдельные helper-модули без изменения продуктового поведения
- маршрутизация вопросов вынесена из монолита в отдельные domain-модули с сохранением прежнего API
- state contract и его инварианты вынесены из storage facade в отдельный state model
- усилены keyboard/focus semantics: явные `type="button"`, `aria-pressed`, `aria-live` и более заметные focus states
- убраны из production-структуры неиспользуемые тяжёлые медиа, а `html2canvas` переведён на lazy load при шаринге
- Pages deploy теперь валидирует `.dist-pages`, smoke-tests домена/state и versioned build-артефакт до публикации
