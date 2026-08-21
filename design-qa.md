# WYRD — YUK-146 Lunar Day design QA

- Date: 2026-08-21
- State: local `lunar-day`, 9-й лунный день, internal phase `fq`, public label `растущая луна`
- Status: locally verified candidate under user review; not approved for Kit, commit or push

## Audit scope

The bounded surface is the complete Lunar Day screen: App Header, current phase, three-paragraph reading, guidance and the quiet transition to the Deck.

The visual system of the approved Forest home screen is the typography reference. The Silver UI Kit remains the interaction and component contract.

## Rejected candidate

The previous local candidate failed the review for two structural reasons:

- the forest asset became a dark rectangular hero band with a large empty area and made the Moon look like a technical diagram;
- `Даётся легко` and `Лучше подождать` were placed as two columns with vertical dividers even though the agreed direction excluded table-like columns.

That candidate is superseded. Its forest hero, responsive two-column rule and guidance dividers were removed.

## Current candidate

- No brand lockup, standalone hero image or explanatory invocation block.
- Eight approved dimensional Moon renders cover the internal states `nm`, `wc`, `fq`, `wg`, `fm`, `wag`, `lq`, `wac`. Each active export is a 512 × 512 sRGB WebP with alpha.
- The product exposes four readable phase names: `новолуние`, `растущая луна`, `полнолуние`, `убывающая луна`. Technical quarter and gibbous names remain internal and do not compete with the oracle reading.
- The App Header keeps the Forest title role. The public phase is deliberately quieter metadata: `Forum 15.7px / 0.055em / lowercase / 66% silver`; the date and lunar-day line remain `Cormorant Garamond italic 600`.
- The three-paragraph reading uses the approved open Message rail rather than a card. All three draft paragraphs intentionally share one quiet body role: `Cormorant Garamond 16–17.28px / 400 / 1.58`, without a premature first-paragraph accent. The rejected `Духи леса смотрят на луну` / cycle explanation is absent.
- Guidance is a single editorial sequence at every breakpoint. The two groups follow one another vertically; there are no columns, cards or vertical dividers.
- Guidance headings use Forum; entries use Cormorant Garamond italic, matching the title/supporting-copy relationship on the Forest screen.
- `Спросить духов` remains an underlined quiet action and opens the Deck with focus on the question field.

## Accessibility and runtime checks

- One `h1`: `Лунный день`.
- Phase is present as text; the decorative Moon image is hidden from the accessibility tree.
- Both guidance groups remain semantic sections with `ul` lists.
- Back and the quiet action keep the existing keyboard/focus behavior and minimum target contracts.
- `prefers-reduced-motion` disables all new entrance motion.
- Forced-colors retains the phase text, reading order and control semantics.

## Local verification

- Repository domain, state and UI-interaction smoke suites pass.
- Asset/content integrity passes: 74 cards, 12 public exports, dimensions, references, alt policy, duplicates and cache policy.
- Real in-app browser checks pass at `320 × 700`, `375 × 812`, `393 × 852`, `430 × 932`, `768 × 1024` and landscape `852 × 393`. Every target reports `scrollWidth === clientWidth`; there is no horizontal overflow.
- The Moon scales from `120 × 120` to `160 × 160` CSS px; all eight source files decode as 512 × 512 sRGB WebP assets with alpha.
- Computed fonts: App Header and phase use Forum; date/day uses Cormorant Garamond italic 600; reading uses Cormorant Garamond.
- Forest → Lunar Day, Back → Forest and `Спросить духов` → Deck work. The transition leaves keyboard focus in the Deck question textarea.
- Back keeps a 48 × 48 CSS px target and `Спросить духов` keeps a 44px minimum target at every checked viewport.
- Browser console contains no warnings or errors after the complete route check.

## Visual correction — phase hierarchy and Moon matte

Source visual truth: user review capture `XMTM62` (`530 × 632` pixels; ephemeral local capture, not stored in the repository).

Implementation evidence: in-app Browser capture `lunar-screen-stable` (`454 × 703` pixels, browser viewport `454 × 703` CSS px, DPR 1; ephemeral local capture, not stored in the repository).

Full-view comparison normalized both captures to 454px width and compared the same top-of-screen `fq` state. A focused crop was unnecessary because the three reported problems — header gap, phase hierarchy and rectangular matte — are all clearly visible in the complete upper composition.

### Iteration history

1. **P2 — Moon sat too far below the App Header.** The shared 116px header reserve and an additional responsive top margin stacked into an oversized pause. The screen-specific header reserve is now 72px and the Moon begins at 97–100px across all checked viewports, instead of approximately 141–162px in the earlier browser candidate.
2. **P2 — `РАСТУЩАЯ ЛУНА` looked like a selectable Forest tile.** Uppercase, 19px size, 0.14em tracking and 90% silver duplicated a navigation-title role. The label is now lowercase, 15.7px, 0.055em tracking and 66% silver, with no interactive styling or semantics.
3. **P1 — rectangular raster matte remained visible.** The WebP corners retained non-zero dark alpha, so the 512px canvas could be seen against the scene. The runtime now applies a circular clip fallback plus a feathered radial mask. The approved lunar disk and corona remain intact while the rectangular canvas is fully excluded.

Post-fix evidence shows no visible square, no horizontal overflow and no browser warnings/errors. Typography, spacing, color hierarchy, asset fidelity and copy have no remaining P0/P1/P2 finding for this correction. User visual approval remains the release boundary.

## Visual correction — Moon position and draft reading weight

Source visual truth: in-app Browser capture `lunar-top-and-reading` (`393 × 852` pixels, browser viewport `393 × 852` CSS px, DPR 1; ephemeral local capture, not stored in the repository).

Implementation evidence: in-app Browser capture `lunar-typography-refine` (`393 × 852` pixels, browser viewport `393 × 852` CSS px, DPR 1; ephemeral local capture, not stored in the repository).

Normalized comparison: `lunar-typography-comparison` (`810 × 852`, unchanged captures separated by a 24px gutter; ephemeral local comparison, not stored in the repository).

The full-view comparison covers the complete upper composition and the beginning of both guidance groups. A separate focused crop was not required: the bounded changes are legible at native 1:1 size.

### Iteration history

1. **P2 — the complete lunar sign still sat too far from the App Header.** The phase-mark flow margin is reduced by exactly `15px`; Moon, public phase name and calendar line move together, preserving their internal spacing. At the 393px viewport the Moon begins at 84px with no collision with the 48px Back target or centered title.
2. **P2 — the draft reading formed one heavy editorial slab.** The earlier text used approximately 19.7–20.1px, weight 500 and a separate brighter/larger first paragraph. The first-paragraph override is removed. All three draft paragraphs now compute to the same `16px / 400 / 25.28px` at 393px, the same 80% silver color, and the reading block contracts to 170px without changing copy or paragraph order.

Post-fix breakpoint evidence: no horizontal overflow at 320, 375, 393, 430, 768 and landscape 852px; Back remains 48 × 48px. Domain, state, UI-interaction, responsive-strategy and control-language checks pass.

The wording of the three paragraphs remains explicitly **draft** and will be edited with the product owner. The current pass validates only its neutral typographic treatment; it does not approve the final editorial content.

## Verification boundary

Explicit visual approval is still required. Genuine OS-level forced-colors, physical Safari/Firefox rendering and Telegram WebView safe-area validation remain outside the local browser pass.

## Final result

final result: passed
