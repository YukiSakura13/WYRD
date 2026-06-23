# WYRD — responsive strategy и layout tokens

Статус: утверждено в [YUK-46](https://linear.app/yukisakura/issue/YUK-46/opredelit-responsive-strategy-i-layout-tokens) 23 июня 2026 года.

Этот документ задаёт общий layout contract для Web, PWA и Telegram shell. Он не заменяет scene-specific задачи: каждая сцена отвечает за собственную композицию, но использует одни breakpoints, safe areas, размеры целей и правила прокрутки.

## Поддерживаемая матрица

Минимальные обязательные контрольные точки из Responsive & Platform QA Matrix:

- mobile compact: `320×568`, `360×640`, `375×667`;
- mobile modern: `390×844`, `393×852`, `412×915`, `430×932`;
- tablet: `768×1024`, `1024×768`, `820×1180`;
- desktop compact: `1280×720`, `1366×768`;
- desktop standard/large: `1440×900`, `1512×982`, `1920×1080`.

На любой точке основной сценарий остаётся достижимым с touch, mouse и keyboard, без горизонтальной прокрутки и недоступных controls.

## Breakpoints по ширине

Breakpoints принадлежат композиции, а не устройствам:

| Диапазон | Режим | Правило |
| --- | --- | --- |
| `< 560px` | compact mobile | одна колонка; body/scene scroll; без постоянных боковых панелей |
| `560–899px` | wide mobile / tablet portrait | одна основная колонка; допускаются более широкие cards и локальные grids |
| `900–1199px` | tablet landscape / compact desktop | master-detail только если каждая рабочая область остаётся не уже `360px` |
| `≥ 1200px` | desktop | осознанная desktop-композиция внутри `--layout-content-wide`; copy не растягивается шире `--layout-content-copy` |

Media queries используют эти четыре границы буквально: CSS custom properties нельзя надёжно применять в условиях `@media`.

## Breakpoints по высоте

| Диапазон | Режим | Правило |
| --- | --- | --- |
| `≤ 639px` | compact height | content scroll обязателен; вторичные отступы сокращаются, действие не фиксируется за пределами viewport |
| `640–779px` | standard height | базовая композиция, но без предположения, что всё обязано поместиться в один экран |
| `≥ 780px` | spacious height | разрешено усиливать вертикальный ритм и масштаб hero-элемента |

Высота никогда не используется как причина обрезать текст или прятать действие. При zoom 200% сцена переходит в scrollable flow.

## Общие tokens

Tokens живут в [`assets/css/tokens.css`](../assets/css/tokens.css):

- `--space-*` — единая spacing scale от `0.25rem` до `4rem`;
- `--layout-gutter-inline` — адаптивный боковой gutter;
- `--layout-content-copy` — читаемая текстовая колонка;
- `--layout-content-reading` — основной reading/page container;
- `--layout-content-wide` — максимальная desktop-композиция;
- `--layout-control-min` — минимальная touch/keyboard target `44px`;
- `--layout-viewport-min` и `--layout-viewport-dynamic` — `100svh` и `100dvh`;
- `--safe-area-*` — системные browser/PWA safe areas;
- `--content-safe-area-*` — app-owned overrides для platform adapter;
- `--layout-safe-*` — итоговые безопасные поля, которые используют сцены.

Telegram-specific mapping в `--content-safe-area-*` принадлежит YUK-57. До него значения равны `0px`, а browser/PWA используют `env(safe-area-inset-*)`.

## Container policy

- Публичный лор и длинный prose: `min(100%, var(--layout-content-copy))`.
- Основной экран чтения: `min(100%, var(--layout-content-reading))`.
- Сложная desktop-композиция: `min(100%, var(--layout-content-wide))`.
- Внешний gutter не меньше `--layout-gutter-inline` и учитывает `--layout-safe-inline-start/end`.
- Текстовые строки остаются примерно в пределах `65–72ch`; fixed pixel width для prose запрещён.

## Scroll ownership

1. По умолчанию документ или корневая scene владеет вертикальной прокруткой.
2. `min-height` предпочтительнее `height`; full-height сцена начинает с `--layout-viewport-min`.
3. `overflow: hidden` на `body` допустим только для открытого modal/overlay, у которого есть собственный scroll container, доступное закрытие и восстановление фокуса/позиции.
4. Fixed controls обязаны учитывать `--layout-safe-*` и не перекрывать последний focusable элемент.
5. Горизонтальная прокрутка страницы запрещена. Локальная horizontal-scroll область допустима только с видимым смыслом, keyboard-доступом и без скрытия основного действия.
6. Back/deep link сохраняют логичный target; длинная страница восстанавливает scroll position в своей задаче реализации.

## Accessibility и input

- Touch/click target — не меньше `var(--layout-control-min)` (`44px`) по обеим осям.
- Видимый `:focus-visible` не обрезается контейнером и имеет контраст к фону.
- Порядок DOM совпадает с визуальным порядком; desktop layout не меняет смысловой focus order.
- Все размеры текста и критические отступы задаются в `rem`, `em`, `ch`, `%` или `clamp()`, чтобы выдерживать zoom 200%.
- Hover — только дополнительный сигнал; действие работает с keyboard и coarse pointer.
- `prefers-reduced-motion: reduce` убирает декоративное движение, не скрывая состояние или результат.

## Desktop composition

Desktop не является растянутой mobile-колонкой. На `≥ 1200px` допускаются две смысловые области, если:

- основное действие и heading остаются в первой видимой области на `1280×720` либо документ очевидно прокручивается;
- prose остаётся в `--layout-content-copy`;
- декоративное пространство не отталкивает controls за непрокручиваемую границу;
- mobile DOM order сохраняется, а CSS меняет только геометрию.

## Definition of done для responsive-задачи

- Проверены representative viewports: `320×568`, `390×844`, `768×1024`, `1280×720`, `1440×900`.
- Нет document-level horizontal overflow, clipped focus или недоступного primary action.
- Проверены keyboard order, 44px targets, 200% text, reduced motion и safe-area формулы.
- Scene-specific отклонения записаны в существующие Linear issues, а не маскируются изменением общего contract.
- `python3 scripts/validate_responsive_strategy.py` и release gates проходят.
