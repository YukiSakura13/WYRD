# Roadmap: WYRD Telegram Beta

## Текущая стадия

`PWA-first MVP → ограниченная Telegram-бета`

Канонические задачи, зависимости и статусы живут в Linear. Репозиторный roadmap фиксирует порядок потоков, но не заменяет Linear.

Продуктовая граница: [TELEGRAM_BETA_SCOPE.md](TELEGRAM_BETA_SCOPE.md).

Сквозные требования к retention, trust/legal, Telegram launch, аварийному управлению, content operations, accessibility и будущей монетизации: [PRODUCT_READINESS_PLAN.md](PRODUCT_READINESS_PLAN.md).

## Критический путь

1. Утвердить позиционирование, scope, Lore Bible, safety и Definition of MVP.
2. Собрать канонический реестр 74 карт и content contract.
3. Параллельно укрепить:
   - responsive/accessibility и first-run onboarding;
   - scene/state/persistence contract;
   - engineering quality и automated checks;
   - music/ambience/SFX.
4. Выбрать backend/storage architecture и определить privacy boundary.
5. Укрепить PWA/offline/update и подключить Telegram platform adapter.
6. Реализовать Telegram identity/backend и безопасный текстовый Oracle endpoint с fallback.
7. Пройти automated и manual QA по полной platform matrix.
8. Собрать release candidate, провести staging soak и go/no-go.
9. Запустить ограниченную бесплатную Telegram-бету и собрать evidence.
10. После beta evidence принять отдельное решение о Telegram Stars и небольшом монетизационном пилоте.

## Потоки MVP

- Product governance и lore.
- Каноническая колода.
- Visual, responsive и accessibility.
- Игровое ядро, state и migrations.
- Музыка и звук.
- Engineering quality, security и QA.
- PWA, backend и Telegram.
- Текстовый Голос Оракула.
- Release, analytics, support и beta operations.

## Release gates

### Product Ready

Scope, lore, terminology, safety и canonical deck утверждены.

### Core Ready

1→3→5, history, gifts, back navigation, persistence и recovery проходят проверки.

### Platform Ready

Web/PWA/Telegram работают на обязательной матрице без недоступного UI.

### Content & Audio Ready

Тексты утверждены, AI fallback работает, audio licensed/mixed, mute и lifecycle проверены.

### Release Ready

CI зелёный, нет открытых P0, privacy/support/analytics/rollback готовы.

### Beta Ready

Staging soak завершён, production bot и cohort готовы, triage и exit criteria определены.

## После beta evidence

TTS, платежи/Stars, новые карты/ритуалы, сложная экономика и мета-игра рассматриваются отдельными решениями. Они не расширяют MVP по умолчанию.

## Change Log

### 2026-06-22

- roadmap синхронизирован с YUK-14 и Linear MVP Delivery Plan v2.

### 2026-07-14

- добавлена каноническая карта Product Readiness после продуктового, Telegram, security и monetization-аудита;
- будущая монетизация закреплена после ограниченной бесплатной беты и измерения retention/value evidence.
