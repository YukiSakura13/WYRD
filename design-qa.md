# WYRD Silver UI Kit — Release Candidate QA

Date: 2026-07-23

Linear scope: YUK-135 (UI foundations) with runtime evidence relevant to YUK-54.

## Release decision

- Creative direction is approved; this pass changes no approved visual concept.
- The canonical UI Kit is `docs/wyrd-ui-kit.html`.
- Approved source assets are the continuous Hero/Secondary/Compact/Quiet family and the transparent Artifact card frame.
- Silver belongs to the interface. Real card artwork keeps its authored paper color and uses no grayscale, saturation or brightness filter.
- No open P0 design defect was found.
- YUK-135 remains **In Progress** until the remaining platform-specific acceptance checks are completed.

## Automated verification

The following local gates passed after the release cleanup:

- domain, state and UI interaction smoke tests;
- control-language, product-scope, lore-canon and responsive-strategy validators;
- JavaScript syntax and Python compilation;
- Pages artifact build and validation, including the UI Kit page and canonical SVG assets;
- `git diff --check`;
- browser console check with no errors or warnings on the UI Kit route.

## Browser and interaction verification

### Ritual action family

The four variants retain exact geometry across Default, Hover, Pressed, Focus and Disabled:

| Variant | Rendered size |
| --- | --- |
| Hero | 560 × 83.195 px |
| Secondary | 509 × 83.195 px |
| Compact | 463 × 83.195 px |
| Quiet | 412 × 83.195 px |

- Focus strengthens the existing silver silhouette and does not add a rectangular frame.
- Pressed uses the approved 1 px response without scale or bounce.
- Disabled remains programmatically disabled and keeps a readable, subdued silhouette.
- Share remains a separate familiar utility control and does not use ritual ornament.

### Controls and feedback

- The mobile section menu opens, exposes twelve section links, navigates to the selected section and closes afterward.
- The source UI Kit was re-audited directly at
  `https://runic-frame-kit-cr8v-2026.alexandername.chatgpt.site/?release=10-natural-magnet`.
- Every retained switch is one 78 px-high button. Clicking anywhere in the row
  updates `aria-checked`, leaves focus on that row and draws the same thin 2 px
  silver outline with a 3 px offset as the source.
- The restored switch specimen contains the same three source rows. No extra
  invented switch remains.
- Checked toggles preserve the source kit's static two-layer silver glow: a bright
  7 px edge and a quieter 15 px halo. The approved large-and-small diamond asset
  remains unchanged.
- The question field preserves the production placeholder, enforces the source
  120-character maximum, updates `0 / 120` live and changes its explanatory status.
- Exclusive choices update one selected item at a time.
- Pager advances to `Глава 2 из 5` and updates the active nested diamond.
- `Следы в лесу` opens the restored bottom sheet, moves focus to Close, traps
  keyboard focus, closes with Escape or the backdrop and returns focus to its opener.
- The Artifact card and its explicit action both control the same 800 ms reveal.
  Quiet and history card specimens are also semantic interactive targets, matching
  the retained source card mechanics.
- Feedback keeps the branded Oracle owl in Loading, Success, Error and Empty.
  Each tab restores the source copy, solid border treatment, owl opacity and Error
  filter; Error shows `Туман скрыл дорогу`, while Empty remains quiet without an
  invented dashed border.
- Motion Lab exposes Breath, Reveal, Drift and Success as semantic scenarios with a separate `Воспроизвести` action.
- Reveal completes in 800 ms; Success reveals the Oracle sign once without an invented line.
- With Reduced motion enabled, Success remains visible as a static sign and starts no animation.

### Moon metadata alignment

The card specimen, result/history rule and saved-card rule now use one two-column
grid rather than unrelated padding and centering:

- row 1: Moon symbol in column 1, phase name in column 2;
- row 2: date in column 2, aligned exactly to the phase name;
- the authored string remains `22 июля`;
- the date uses normal caps, no text transformation and the same quiet italic
  Cormorant treatment in every specimen.

Browser measurements confirmed equal left edges:

| Context | Phase name | Date |
| --- | ---: | ---: |
| Card specimen | 279.633 px | 279.633 px |
| Metadata rule | 75.109 px | 75.109 px |

### Runtime proof

- The deck uses the exact placeholder `Напиши вопрос или держи его в сердце...`.
- Result and spread use the canonical `WYRD + Оракул духов леса` lockup without the old divider.
- The result utility Share control and ritual CTA keep stable 52 px heights.
- The spread card modal traps focus, closes with Escape and restores focus to its opener.
- The history sheet applies inert outside the panel, closes with Escape and restores focus to the selected history item.

## Responsive and accessibility verification

No horizontal overflow and no visible interactive target below 44 × 44 px were found at:

- 320 × 568;
- 375 × 812;
- 393 × 852;
- 430 × 932;
- 768 × 1024;
- landscape 852 × 393;
- landscape 932 × 430.

The 393 px card specimen keeps:

- a true 3:4 illustration;
- separate name, Moon phase and date rows;
- date inside the lower frame;
- authored warm card color without a filter.

The narrow 320 px pager reflows to two rows rather than shrinking its targets.

## Canonical evidence

The screenshot set records the approved base kit and runtime proof. The later Motion Lab
and Oracle-owl correction was re-verified interactively in the browser. The source and
implementation switch sections were compared at the same 1280 × 720 viewport and focused
row state; row height, focus outline and state change match while the approved WYRD
double-diamond artwork remains intentionally local. The mechanics are protected by
`scripts/smoke-ui-interactions.mjs` and the Pages artifact validator.

- `docs/screenshots/wyrd-ui-kit-release-desktop-1440.jpg`
- `docs/screenshots/wyrd-ui-kit-actions-default-1440.jpg`
- `docs/screenshots/wyrd-ui-kit-actions-focus-1440.jpg`
- `docs/screenshots/wyrd-ui-kit-actions-disabled-1440.jpg`
- `docs/screenshots/wyrd-ui-kit-controls-1440.jpg`
- `docs/screenshots/wyrd-ui-kit-pager-feedback-1440.jpg`
- `docs/screenshots/wyrd-ui-kit-mobile-393.jpg`
- `docs/screenshots/wyrd-ui-kit-card-393.jpg`
- `docs/screenshots/wyrd-ui-kit-mobile-320.jpg`
- `docs/screenshots/wyrd-ui-kit-landscape-852x393.jpg`
- `docs/screenshots/wyrd-runtime-deck-question-393.jpg`
- `docs/screenshots/wyrd-runtime-result-393.jpg`
- `docs/screenshots/wyrd-runtime-spread-393.jpg`
- `docs/screenshots/wyrd-runtime-history-sheet-393.jpg`

## Honest acceptance boundary

This environment did not provide genuine operating-system emulation for:

- forced-colors mode;
- browser zoom at exactly 200%;
- Telegram WebView safe-area insets on a physical device.

The corresponding CSS contracts and documentation are present, while 320 px reflow and landscape were verified as strong proxies. These platform checks remain open; the UI Kit must not be marked fully Done on their behalf.

Final result: passed
