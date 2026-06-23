# Features: WYRD

## Статусы

- `live` — уже присутствует в production baseline;
- `mvp` — требуется для первой Telegram-беты;
- `later` — сознательно отложено до beta evidence;
- `tech-debt` — текущее поведение требует укрепления.

Scope определяет [TELEGRAM_BETA_SCOPE.md](TELEGRAM_BETA_SCOPE.md), а статус выполнения и зависимости — Linear.

## Production baseline

### Вход и ритуал

- `live` Cover «Войти в лес» и существующее ритуальное знакомство.
- `live` Вопрос в свободной форме или «в сердце».
- `live` Постоянная адаптивная страница «О WYRD» с утверждённым публичным лором и replay entry.
- `mvp` Настоящий versioned first-run и полный state contract безопасного повтора знакомства.

### Карты и чтение

- `live` Runtime-набор из 74 карт и вопрос-зависимая маршрутизация.
- `live` Чтения на 1, 3 и 5 карт без платёжной блокировки.
- `live` Послание, Тень и локальный Голос Оракула.
- `mvp` Утверждённый канонический реестр и единый content contract.
- `mvp` Безопасный текстовый AI-синтез с schema validation и локальным fallback.

### Память и возвращение

- `live` Локальные Следы, история первого чтения дня и существующие Дары.
- `tech-debt` История и state требуют versioning, migrations, recovery и хранения полных раскладов.
- `mvp` Надёжное local-first восстановление и согласованный sync contract.

### Аудио

- `live` Звук леса, карточные SFX и пользовательский mute.
- `mvp` Audio lifecycle, unlock, mix и cross-platform QA.

### Web, PWA и Telegram

- `live` Web/PWA baseline, manifest, service worker и базовый offline cache.
- `mvp` Install/offline/update UX и cache versioning.
- `mvp` Platform adapter для Web, PWA и Telegram.
- `mvp` Telegram SDK, safe areas, Back/share/haptics и серверная проверка `initData`.
- `mvp` Минимальный backend/storage/Oracle proxy с privacy и rate limits.

### Качество и выпуск

- `live` Domain/state smoke, PR Governance, keyboard/ARIA/focus и reduced-motion baseline.
- `mvp` Unit/integration/E2E/accessibility gates и полная platform matrix.
- `mvp` Analytics/error diagnostics, staging, rollback, support и go/no-go.

## Later: не входит в первую бету

- `later` TTS-озвучка Голоса Оракула.
- `later` Telegram Stars, платежи, paywall и платная блокировка глубины чтения.
- `later` Новые карты, колоды, ритуалы и несвязанные режимы.
- `later` Сложная экономика, валюты, магазин, аватары и quests.
- `later` Публичные профили, социальная лента, личные заметки и сложная персонализация.

## Правило обновления

Новая возможность сначала получает Linear issue с priority, dependencies и release scope. Изменение границ первой беты требует product decision и обновления [TELEGRAM_BETA_SCOPE.md](TELEGRAM_BETA_SCOPE.md).

## Change Log

### 2026-06-23

- страница «О WYRD» переведена в production baseline; versioned first-run остаётся MVP-задачей YUK-48.

### 2026-06-22

- реестр синхронизирован с YUK-14 и бесплатным циклом 1→3→5.
