# WYRD active-screen acceptance matrix

Date: 2026-07-24

Linear scope: YUK-135 design-system checkpoint.

This matrix records the active runtime surfaces against the shared responsive,
keyboard, target-size, forced-colors and safe-area contracts. It is evidence for
the current working tree only. It protects the shared foundations before the
silver-rebrand continues; it is not the final all-surface release baseline from
YUK-56 and does not replace the per-screen restoration-first acceptance required
by `docs/WYRD_SILVER_MIGRATION_PROTOCOL.md`.

## Automated runtime matrix

Conditions:

- layout: 320 × 852, 375 × 812, 393 × 852, 430 × 932 and 768 × 1024;
- target size: every visible active control is at least 44 × 44 px;
- keyboard: real sequential Tab navigation, with focused controls kept inside
  the visible viewport;
- forced colors: Chromium `forced-colors: active` media emulation at 393 × 852;
- safe area: composite `--content-safe-area-*` tokens with portrait
  59/0/34/0 px and landscape 24/44/21/44 px test insets.

| Surface | `data-scene` | Tab stops | Layout | 44 px targets | Keyboard focus | Forced-colors emulation | Safe-area simulation |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| Обложка | `cover` | 1 | PASS | PASS | PASS | PASS | PASS |
| Лес | `forest` | 8 | PASS | PASS | PASS | PASS | PASS |
| Колода | `deck` | 4 | PASS | PASS | PASS | PASS | PASS |
| Результат | `result` | 3 | PASS | PASS | PASS | PASS | PASS |
| Расклад | `spread` | 6 | PASS | PASS | PASS | PASS | PASS |
| Настройки | `settings` | 6 | PASS | PASS | PASS | PASS | PASS |
| Профиль | `about-you` | 14 | PASS | PASS | PASS | PASS | PASS |
| Уведомления | `reminders` | 15 | PASS | PASS | PASS | PASS | PASS |
| О приложении | `app-info` | 1 | PASS | PASS | PASS | PASS | PASS |
| История духов леса | `spirit-book` | 7 | PASS | PASS | PASS | PASS | PASS |
| Следы в лесу | `profile` | 2 | PASS | PASS | PASS | PASS | PASS |
| Лунный день | `lunar-day` | 1 | PASS | PASS | PASS | PASS | PASS |
| Нет или Да | `yes-no` | 1 | PASS | PASS | PASS | PASS | PASS |
| Образы ночи | `night-images` | 1 | PASS | PASS | PASS | PASS | PASS |

The Profile avatar chooser is intentionally a local horizontal scroller. Its
off-screen choices do not create document-level overflow, and sequential
keyboard focus scrolls every choice fully into view at 320 px.

## Release/platform follow-ups

These checks remain required before beta, but they belong to the parallel
platform track and the final baseline after the rebranded surfaces exist.

| Gate | Current evidence | Owning follow-up |
| --- | --- | --- |
| Genuine forced colors | All 14 surfaces pass Chromium `forced-colors: active`; genuine OS high contrast remains open | YUK-56 final visual/platform baseline |
| Exact browser zoom 200% | Narrow reflow and scroll ownership pass; page-scale emulation was deliberately rejected as non-equivalent evidence | YUK-56 final visual/platform baseline |
| Telegram WebView safe area | Composite tokens pass portrait and landscape inset simulation; physical WebView mapping remains open | YUK-57 adapter, then YUK-56 baseline |
| Modal/history/save-share platform matrix | Shared focus and dialog mechanics have automated coverage; the complete surface matrix remains open | YUK-54, then YUK-56 baseline |

## Acceptance decision

The automated design-system matrix passes. YUK-135 remains **In Progress** only
until this working tree is reviewed, explicitly approved, committed, deployed
and verified on the published kit. After that checkpoint is complete, the
silver-rebrand continues with YUK-139. The platform follow-ups above remain
truthful open work, but they do not replace or precede the screen-migration
sequence.
