# YUK-139 Deck centered-embers preview — Design QA

Date: 2026-07-29

Scope: user-approved YUK-139 Deck runtime checkpoint. The canonical Silver UI
Kit and shared card artwork are intentionally unchanged.

## Approved input for this pass

- Preserve the approved `--deck-spread: 1` three-card reference geometry,
  equal card dimensions, Raven back artwork, copy, routes, and reading state.
- Make rear cards opaque physical planes; mute only their internal artwork.
- Add restrained cold depth and a narrow reflection beneath the fan.
- Replace the weak idle twitch with a rare, smooth physical answer.
- Keep Enter motionless: only a static ready-state and focus transfer.
- Keep Artifact and `Коснись колоды` inside one semantic control.
- Keep the approved Field geometry but remove its redundant inset contour;
  retain one outer contour carrying the moving silver spark.
- Return `Коснись колоды` from a separate CTA-like phrase to a quiet,
  accessible hint attached to the Deck.
- Make sparks an atmospheric layer of the complete screen: above the
  background, below Back, Field, Deck, and text; less bright and less dense than
  the main-screen fire effect.
- Restore the canonical vertically centered Artifact stage and adaptive
  Field-to-stage padding without resizing the cards or changing the approved
  `--deck-spread: 1` geometry.
- Increase the ambient spark field to `24` quieter, more frequent points.
- Do not change the Kit or record evidence in Linear before user approval.

## Implemented result

### Materiality

- All three card planes remain at `opacity: 1`.
- Only the rear artwork is veiled: `27%` for the back card and `15%` for the
  middle card.
- Short contact shadows separate the overlaps.
- Cold one-pixel edges appear only on exposed upper/right card edges.
- A vertical cold light well sits behind the lower part of the fan.
- A narrow reflection immediately beneath the cards grounds the object.

The reference contour is unchanged:

| Card | translate | rotate |
| --- | --- | --- |
| Back | `-10.66% -0.58%` | `-3.3deg` |
| Middle | `0 0` | `1.4deg` |
| Front | `11.38% 0.87%` | `4.5deg` |

### Composition

- In portrait, the Field begins on the visible left edge of Back and ends on
  the upper-right edge of the front card. The alignment is derived from the
  existing responsive content and artifact variables rather than a
  screenshot-specific fixed width.
- At the `505 × 705` review viewport, Back and Field both begin at `32.5px`.
  The Field ends at `449.5px`; the measured front-card edge ends at
  `451.1px` (`1.6px` optical difference).
- The Field shell is `82px` high and its input is `80px` high. A two-line
  content check reports equal `clientHeight` and `scrollHeight` (`80px`), so
  two lines fit without introducing a scrollbar.
- The inner `4px` inset contour is removed. The outer border and the existing
  moving orbit now read as one frame; no dimensions, radius, alignment, or
  input padding changed.
- The Artifact zone again uses the canonical `align-content: center` inside the
  flexible stage. Its top padding is restored from the runtime-only
  `clamp(2.75rem, 6svh, 4rem)` to the Kit value
  `min(2.5svh, 1.25rem)`; short-height screens use the canonical `0.75rem`.
- Card width, height, `3:4` proportion, transforms, and `--deck-spread: 1`
  remain byte-for-byte unchanged. Only the complete Artifact control is
  repositioned within available vertical space.
- The invitation remains `16px`, moves from `500` to `400`, uses `58%`
  silver, and sits `6px` closer to the artifact. Ready/hover states stop at
  `66%` and do not add text glow.
- Portrait remains one column. Short landscape uses the approved two-column
  contract: Field left, fan plus invitation right.

### Full-screen atmosphere

- Twenty-four low-density cold sparks rise from below the viewport to above it.
- Spark diameters range from `1.3px` to `2.25px`, with staggered
  `12.2–17s` paths. Their peak opacity is `0.48`; they remain much quieter
  than the main-screen fire effect even though the atmospheric field is now
  more continuous.
- Spark origins now cover `5–96%` of the complete viewport width, including
  both outer lower edges and the central lower field instead of clustering
  visually beneath the Deck.
- The atmospheric wrapper uses `position: absolute; inset: 0; z-index: 0`.
- Every content child of the Deck scene uses `z-index: 1`.
- Broad lower-scene mist is reduced to `0.16–0.24` on the rear layer and
  `0.08–0.14` on the front layer. The Deck-local light well and narrow
  reflection remain unchanged, preserving the volume visible beneath the
  cards without turning the whole lower viewport grey.
- The Deck-specific light well remains attached to the Deck object; the sparks
  are not localized behind it.
- The atmospheric layer is `aria-hidden` and does not receive pointer events.

### Motion and interaction

- Idle cycle: `6200ms`, with `72%` complete stillness.
- Front response: smooth `3px` lift.
- Rear response: `0.85px` and `0.45px` convergence.
- The upper-right edge glint, light well, and reflection share the same phase.
- Angles, scale, fan width, and authored image never animate.
- Hover changes only light/edge/text opacity and is limited to fine pointers.
- Pointer-down moves the unified Artifact by `1px` in `110ms`.
- Enter stops the Field orbit, applies a static ready hierarchy, and transfers
  keyboard focus to the Deck. It does not create a thread, spark, or Deck
  movement.
- Reduced motion removes card movement and rising sparks while retaining
  static depth. Its static mist now uses each layer's approved low opacity
  instead of becoming heavier when animation is disabled.

## Visual comparison evidence

- Source visual truth: two external, user-provided physical-phone screenshots,
  intentionally not committed. The `360 × 724` current-state capture shows the
  top-anchored regression; the `601 × 1306` older capture supplies only the
  approved centered-hierarchy reference.
- Final implementation:
  `.codex/audits/yuk-139-centered-embers/implementation-393x852.png`
  (`393 × 852` pixels at a `393 × 852` CSS viewport and `1×` density) and
  `.codex/audits/yuk-139-centered-embers/implementation-360x724.png`
  (`360 × 724` pixels at a `360 × 724` CSS viewport and `1×` density).
- Combined comparison input:
  `.codex/audits/yuk-139-centered-embers/comparison-phone-before-old-centered-local-after.png`.
  The physical screenshots include Safari chrome and do not expose their CSS
  visual viewport; therefore they are used for hierarchy and perceived
  centering, not false pixel-perfect browser-chrome measurements.
- Full-view comparison: the local result removes the top-clustered reading of
  the current phone capture and restores the Deck as the dominant centered
  object while preserving the exact approved fan width and Field axes.
- Focused comparison was made on the Field-to-Artifact rhythm and the fan's
  outer bounds. Artwork, typography, Field geometry, Back, mist, light well,
  and invitation styling were intentionally unchanged in this pass.

### Comparison history

- Earlier P2: the Field read as two competing frames. Fix: remove only the
  runtime inset pseudo-element and inset shadow. Post-fix evidence shows one
  structural contour with the orbit on the same perimeter.
- Earlier P2: `Коснись колоды` read as an independent CTA. Fix: retain `16px`
  but use `400`, `58%` silver, tighter tracking, and a `0.25rem` artifact gap.
  Post-fix evidence shows a readable annotation attached to the object.
- Earlier P2: ambient sparks appeared too sparse and centered around the Deck.
  Fix: increase `14 → 17` and place origins across `5–96%`. The final runtime
  sample exposed `15` concurrently visible sparks distributed from `49.5px`
  to `466.1px` at the `505px` review width.
- Current P1: the physical-phone capture showed the Deck held at the start of
  the flexible stage, making it look smaller and top-heavy despite unchanged
  card dimensions. Cause: a runtime override used `align-content: start` plus
  `2.75rem–4rem` top padding. Fix: restore canonical stage centering and
  adaptive padding. Post-fix evidence at `360 × 724` places the fan at
  `248.5–600.6px` with no overflow; the card dimensions and horizontal axes
  remain unchanged.
- Current P2: sparks were atmospheric but too easy to miss on the phone.
  Fix: increase `17 → 24`, shorten cycles to `12.2–17s`, raise the largest
  point to `2.25px`, and increase peak opacity from `0.42` to `0.48`.
  A live sample at `393 × 852` exposed `22/24` sparks above `0.05` opacity,
  still underneath all interactive content.

## Responsive browser matrix

All measurements are CSS pixels from the local in-app Browser.

| Viewport | Layout | Field bounds | Fan bounds | Field → fan | CTA bottom | Overflow |
| --- | --- | --- | --- | ---: | ---: | --- |
| `320 × 568` | portrait | `16–305` | `16.4–304.7` | `31.2px` | `532.2` | none |
| `360 × 800` | portrait | `16–345` | `18.3–342.8` | `116.1px` | `675.4` | none |
| `375 × 812` | portrait | `20–356` | `18.9–357.0` | `115.5px` | `688.3` | none |
| `393 × 852` | portrait | `20–374` | `19.2–374.0` | `126.7px` | `716.6` | none |
| `430 × 932` | portrait | `20–411` | `20.9–409.2` | `148.7px` | `773.6` | none |
| `505 × 705` | portrait review | `32.5–449.5` | right edge `451.1` | bounded | visible | none |
| `768 × 1024` | portrait/tablet | `164–609` | right edge `609.1` | bounded | `738.9` | none |
| `852 × 393` | two columns | independent column | `511.1–732.2` | independent | `363.2` | none |

The portrait alignment stays within `1.6px` of the requested visual axes
across the matrix. At `320 × 568`, all content remains visible, the fan is not
clipped, and the invitation stays above the bottom edge.

## Accessibility and mechanics

- Accessibility snapshot exposes exactly one draw button:
  `Коснуться колоды`.
- Keyboard order remains Back → Question → Deck.
- After Enter, `:focus-visible` matches the unified Deck button and the
  perceived fan contour becomes visible.
- The Field orbit reports `animation: none` in ready state.
- The placeholder's estimated rendered contrast is approximately `7.0:1`.
- The invitation at `58%` silver is approximately `5.6:1` against the lower
  scene background, above the `4.5:1` normal-text target while remaining quiet.
- The screen has no visible duplicate label, character count, or bottom
  whisper.
- Clicking the Deck opens the one-card Result immediately.
- `Вернуться к колоде` returns to the clean Deck state.
- Forced-colors styling uses a system `ButtonText` outline; this pass verifies
  the rule statically and does not claim a physical forced-colors device pass.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| `7.2s`, `2px` lift, sub-pixel rear response | `6.2s`, `3px`, coordinated `0.85px / 0.45px`, `72%` stillness | The invitation becomes perceivable without continuous agitation |
| Abrupt intermediate front keyframe | One rise and one return using strong segment easing | Removes the visible twitch and gives the card one physical breath |
| Glint over the illustration | Short glint on the exposed upper-right edge | Reads as material rather than decoration painted over the Raven |
| Sparse, centered scene atmosphere | Twenty-four full-screen sparks distributed across `5–96%` plus unchanged restrained mist | The full scene feels alive while the Deck remains dominant and keeps its local depth |
| Enter could imply an effect | Static ready-state and visible focus only | Keyboard submission stays immediate and motionless |
| Separate Artifact and text actions | One unified control with `110ms` press feedback | One object, one hit area, one tab stop |

Motion verdict: **Approve for user review.** The ambient cycles are justified
as low-frequency atmosphere, interactive feedback stays within the
`100–160ms` button-press range, only `transform` and `opacity` animate,
fine-pointer hover is gated, and reduced motion removes positional movement.

## Automated verification

- `node scripts/smoke-domain.mjs`: passed.
- `node scripts/smoke-state.mjs`: passed.
- `node scripts/smoke-ui-interactions.mjs`: passed.
- `python3 scripts/validate_control_language.py`: passed.
- `python3 scripts/validate_product_scope.py`: passed.
- `python3 scripts/validate_responsive_strategy.py`: passed.
- `git diff --check`: passed.

## Review boundary

- User approved the centered Deck composition and authorized this checkpoint
  for commit, push, and Linear evidence.
- No canonical Kit edit.
- No claim of physical Telegram WebView, exact 200% browser zoom, or genuine
  forced-colors validation.

## Final result

final result: passed

---

# YUK-139 Result Artifact and Share corrective pass — Design QA

Date: 2026-08-03

Scope: restore the approved Artifact rhythm after the user-reported regression,
correct the Result question hierarchy, and make native Share export the same
silver Artifact instead of a separate gold composition. No route, reading
logic, card content, Message/Shadow copy, or three-card mechanics changed.

## Combined visual evidence

- Artifact comparison: `.codex/qa/result-artifact-comparison.png`.
  The approved Artifact capture and the current runtime component were placed
  in one comparison image and normalized to the same inspection area.
- Share comparison: `.codex/qa/result-share-comparison.png`.
  This shows the former gold export-only composition beside the current
  canonical silver Artifact output.
- Current Result states: `.codex/qa/result-393-question.png` and
  `.codex/qa/result-393-empty.png`.
- Current generated outputs: `.codex/qa/share-export-preview.png` and
  `.codex/qa/share-and-story-preview.png`.

## Fidelity findings

- Artifact media is restored to the approved contract: top `11.5%`, width
  `61.5%`, aspect ratio `3:4`; the title/meta group ends at `9.25%` from the
  bottom. The image no longer presses against WYRD and the identity block no
  longer presses against the lower frame.
- Title-to-metadata spacing is `0.5rem`; phase-to-date spacing is `0.25rem`.
  The Moon and full Russian date remain silver and occupy separate rows.
- The card receives only static spatial depth: a `5.5%` cold light-well and a
  directional resting shadow. The frame itself does not glow or pulse.
- A real question reverses the former hierarchy error: `Твой вопрос` is
  sentence case, `12px`, weight `400`, quiet; the actual question is clearer.
  With no typed question, the label is hidden and only the whisper remains.
- Share now renders a `1086 x 1448` Artifact with the same frame, 3:4 authored
  artwork, title, silver Moon phase, and full date. The story image contains
  that same Artifact and does not add the removed gold divider or gold metadata.

## Responsive browser matrix

All values are CSS pixels measured in the local in-app Browser.

| Viewport | Card | Media top / width | Question | Horizontal overflow |
| --- | ---: | ---: | ---: | --- |
| `320 x 568` | `296` | `11.5% / 61.5%` | `296` | none |
| `375 x 812` | `320` | `11.5% / 61.5%` | `343` | none |
| `393 x 852` | `320` | `11.5% / 61.5%` | `361` | none |
| `430 x 932` | `320` | `11.5% / 61.5%` | `398` | none |
| `768 x 1024` | `320` | `11.5% / 61.5%` | `400` | none |
| `852 x 393` | `320` | `11.5% / 61.5%` | `400` | none |

Short-height and small-width screens remain vertically scrollable by design;
the Artifact is not compressed or horizontally clipped.

## Interaction and accessibility

- Reveal order remains Artifact, then Message, then Shadow; the Result rests
  completely still after the one-time frame glint.
- `prefers-reduced-motion` remains respected by the existing Result contract.
- Share preserves its full focus/hover contrast while remaining quieter at
  rest.
- The empty question label is removed from layout and accessibility exposure;
  the real-question state exposes the subdued label and the actual question.
- Native system share-sheet completion is platform-owned and is not claimed by
  this browser pass. The exact production PNG generators were executed and
  their output dimensions and pixels were inspected locally.
- This pass does not claim physical Telegram WebView, exact 200% browser zoom,
  or genuine forced-colors validation.

## Verification

- `node --check assets/js/ui/share.js`: passed.
- `node --check assets/js/ui/render.js`: passed.
- `node scripts/smoke-domain.mjs`: passed.
- `node scripts/smoke-state.mjs`: passed.
- `node scripts/smoke-ui-interactions.mjs`: passed.
- `python3 scripts/validate_control_language.py`: passed.
- `python3 scripts/validate_product_scope.py`: passed.
- `python3 scripts/validate_lore_canon.py`: passed.
- `python3 scripts/validate_responsive_strategy.py`: passed.
- `python3 scripts/prepare_pages.py`: passed.
- `python3 scripts/validate_pages_artifact.py`: passed.
- `git diff --check`: passed.

## Final result

final result: passed

---

# YUK-139 Result Artifact rhythm correction — Design QA

Date: 2026-08-03

Scope: implement the explicitly approved correction of the Result question
hierarchy, interpretation rail, and Artifact internal rhythm. The canonical
Silver UI Kit was updated first and runtime then received the same values 1:1.
Share, Result reveal motion, and the deferred light-well were not changed.

## Source truth and comparison evidence

- Reported question hierarchy: `Снимок экрана — 2026-08-03 в 15.15.50.png`.
- Reported Artifact: `Снимок экрана — 2026-08-03 в 15.17.49.png`.
- Selective material/rhythm reference, not a geometry target:
  `Снимок экрана — 2026-05-22 в 08.26.40.png`.
- Artifact comparison (reported WYRD / Veil / corrected WYRD):
  `.codex/audits/yuk-139-result-artifact-rhythm-2026-08-03/02-artifact-comparison-before-veil-after.png`.
- Question comparison:
  `.codex/audits/yuk-139-result-artifact-rhythm-2026-08-03/03-question-comparison-before-after.png`.
- Corrected full-page checks:
  `.codex/audits/yuk-139-result-artifact-rhythm-2026-08-03/04-result-320x568-full-page.jpg`,
  `.codex/audits/yuk-139-result-artifact-rhythm-2026-08-03/05-result-430x932-full-page.jpg`, and
  `.codex/audits/yuk-139-result-artifact-rhythm-2026-08-03/06-result-393x852-full-page.png`.

## Finding and correction history

- P1 question hierarchy: `ТВОЙ ВОПРОС` dominated the actual question. It is
  now the `12px`, `400`, `0.105em`, `46%` context label; the actual question is
  `17px`, `500`, `96%` and is the semantic focal point.
- P1 interpretation structure: the quiet vertical line from the approved
  reading anatomy had been removed during rail alignment. It is restored as a
  single `1px` cold-silver line at `26%`, with `16px` internal padding; Message
  and Shadow remain on the shared `20rem` content rail.
- P1 Artifact rhythm: the illustration sat too low and the identity block read
  as attached to the image. The authored `3:4` art now occupies `63%` of the
  unchanged Artifact width, starts at `8.9%`, and the identity baseline sits at
  `8.25%`. The media gains only a material edge and contact shadow.
- Intentional non-match to Veil: WYRD keeps its `1086:1448` silver Artifact,
  square media corners, authored uncropped illustration, and monochrome
  palette. No Veil gold, `9:16` share-card geometry, rounded media, branding,
  or internal quote was copied.

## Responsive browser matrix

All measurements are CSS pixels after the Result reveal completed.

| Viewport | Artifact | Media | Media → title gap | Horizontal overflow |
| --- | ---: | ---: | ---: | --- |
| `320 × 568` | `296 × 394.7` | `186.5 × 248.6` | `20.7` | none |
| `360 × 800` | `320 × 426.7` | `201.6 × 268.8` | `27.0` | none |
| `375 × 812` | `320 × 426.7` | `201.6 × 268.8` | `23.6` | none |
| `393 × 852` | `320 × 426.7` | `201.6 × 268.8` | `23.6` | none |
| `430 × 932` | `320 × 426.7` | `201.6 × 268.8` | `23.6` | none |
| `768 × 1024` | `320 × 426.7` | `201.6 × 268.8` | `17.5` | none |
| `852 × 393` | `320 × 426.7` | `201.6 × 268.8` | `17.5` | none |

At `320px`, the Artifact keeps the required `12px` side margin. The long
Result intentionally scrolls on short and landscape screens. The browser
console is clean.

## Required fidelity surfaces

- Typography: the actual question now outranks its label without dropping the
  label below the `12px` accessibility floor.
- Layout: outer Artifact size and shared content rail are unchanged; only the
  approved internal image/identity spacing changed.
- Colors: the cold Silver tokens and authored illustration colors are
  preserved.
- Imagery: the full authored `3:4` image remains uncropped and unfiltered.
- Copy: question, card identity, Message, Shadow, and CTA copy are unchanged.
- Motion: Result staging and glint timings are unchanged.

## Automated verification

- `node scripts/smoke-domain.mjs`: passed.
- `node scripts/smoke-state.mjs`: passed.
- `node scripts/smoke-ui-interactions.mjs`: passed, including Kit-first Result
  geometry, question hierarchy, and interpretation-rail assertions.
- `python3 scripts/validate_control_language.py`: passed.
- `python3 scripts/validate_lore_canon.py`: passed.
- `python3 scripts/validate_product_scope.py`: passed.
- `python3 scripts/validate_responsive_strategy.py`: passed.
- `python3 scripts/validate_pages_artifact.py`: passed.
- `git diff --check`: passed.

## Review boundary

- Static light-well remains deferred until the phone review.
- No physical Telegram WebView, genuine forced-colors mode, or exact `200%`
  browser-zoom claim is made here.
- No Linear update, commit, or push is included.

## Final result

final result: passed for local user review

---

# YUK-139 Result reveal and hierarchy preview — Design QA

Date: 2026-08-03

Scope: implement the explicitly approved Result hierarchy and one-shot reveal
locally. The Result Reveal contract was first recorded and made replayable in
the Silver UI Kit, then transferred to runtime. Linear, commit, and push remain
outside this preview until user approval.

## Implemented hierarchy

- `ТВОЙ ВОПРОС` is the quiet `12px` context label; the actual question keeps
  the larger `16px` italic treatment and gains the stronger `500` weight.
- Result Share is approximately `10–15%` quieter only in its resting state.
  Hover and keyboard focus restore the full active silver material. Other
  utility actions are unchanged.
- The continuation copy is exactly
  `Три карты покажут то, что скрыто.`
- Shadow keeps the already approved contrast. No new frames, dividers, symbols,
  or static light-well were added.

## Motion contract

| Layer | Start | Duration / offset | Final state |
| --- | ---: | ---: | --- |
| Artifact | `40ms` after Result render | `800ms`, `2px → 0` | still |
| Partial frame glint | `80ms` after Artifact | `800ms`, approved frame mask only | transparent and still |
| Message | `840ms` after Result render | `320ms`, `4px → 0` | still |
| Shadow | `1240ms` after Result render | `320ms`, `4px → 0` | still |

The local Browser path confirms Artifact is visible before Message, and Message
before Shadow. The screen transition remains product-owned; the reveal timers
are attached to Result render, so the Artifact completes its `800ms` settle
before Message starts. `prefers-reduced-motion` skips the glint, translation,
and staging and exposes the complete reading immediately.

## Visual evidence

- Final local viewport with a real question:
  `.codex/audits/yuk-139-result-reveal-preview-2026-08-03/result-393x852-question.png`.
- Final local viewport without a typed question:
  `.codex/audits/yuk-139-result-reveal-preview-2026-08-03/result-current.png`.

The still image verifies hierarchy and geometry; the live local preview remains
the source for judging the one-shot glint and reveal rhythm.

## Responsive browser matrix

All values are CSS pixels measured in the local in-app Browser after the reveal
completed.

| Viewport | Artifact | Share | Card rail margin | Horizontal overflow |
| --- | ---: | ---: | ---: | --- |
| `320 × 568` | `296 × 394.7` | `272 × 52` | `12` | none |
| `360 × 800` | `320 × 426.7` | `272 × 52` | `20` | none |
| `375 × 812` | `320 × 426.7` | `272 × 52` | `27.5` | none |
| `393 × 852` | `320 × 426.7` | `272 × 52` | `36.5` | none |
| `430 × 932` | `320 × 426.7` | `272 × 52` | `55` | none |
| `768 × 1024` | `320 × 426.7` | `272 × 52` | centered | none |
| `852 × 393` | `320 × 426.7` | `272 × 52` | centered | none |

The long Result intentionally scrolls on short screens. At `320px`, the
Artifact retains the required `12px` safe side margin, and no surface clips or
creates horizontal scrolling.

## Automated verification

- `node scripts/smoke-domain.mjs`: passed.
- `node scripts/smoke-state.mjs`: passed.
- `node scripts/smoke-ui-interactions.mjs`: passed, including the Result reveal,
  full Russian date, quiet Share, and exact hook-copy assertions.
- `python3 scripts/validate_control_language.py`: passed.
- `python3 scripts/validate_lore_canon.py`: passed.
- `python3 scripts/validate_product_scope.py`: passed.
- `python3 scripts/validate_responsive_strategy.py`: passed.
- `python3 scripts/validate_pages_artifact.py`: passed.
- `git diff --check`: passed.

## Review boundary

- Static cold light behind the card remains deferred until the phone review.
- No physical Telegram WebView, genuine forced-colors mode, or exact `200%`
  browser-zoom claim is made here.
- No Linear update, commit, or push is included.

## Final result

final result: passed for local user review

---

# YUK-139 Result grid preview — Design QA

Date: 2026-08-03

Scope: local, user-approved correction pass for the one-card Result screen.
The canonical Silver UI Kit is unchanged. No Linear update, commit, or push is
part of this preview.

## Approved corrections

- Use the same cold Silver background contract as the Deck screen.
- Restore the Kit's silver Moon treatment without recoloring authored card art.
- Build one coherent content rail for the card, interpretation, hook, and Hero
  CTA.
- Make Share visibly subordinate and narrower than the card.
- Keep Message primary and make Shadow smaller and quieter.
- Preserve the Hero CTA family while constraining it to the card rail instead
  of an almost edge-to-edge viewport width.

## Implemented result

- `body[data-scene="result"]` now uses the Deck's exact radial and vertical
  background layers. Legacy Result fog, stars, and the old bottom overlay are
  disabled only on this scene.
- The Moon SVG's legacy gold fills and strokes are mapped to the canonical
  silver tokens. Authored gold inside the card illustration is preserved.
- The card, interpretation, hook copy, and Hero CTA share a centered `20rem`
  rail. At `320px`, that rail safely contracts to `296px` with `12px` side
  margins.
- Share is a centered `17rem` utility action. It is narrower than the card at
  every audited width.
- Message remains `1.15rem`; Shadow is `1rem` with quieter silver opacity.
- The former interpretation side rule and padding were removed so the actual
  Message and Shadow text begins on the same visual axis as the card and Hero
  CTA.

## Visual comparison evidence

- Previous Result:
  `.codex/audits/yuk-139-result-art-direction-2026-08-03/01-result-current-393x852.png`
  (`393 × 1163` full-page output from a `393 × 852` CSS viewport).
- Local implementation:
  `.codex/audits/yuk-139-result-preview-2026-08-03/result-393x852-full.png`
  (`393 × 1092` full-page output from a `393 × 852` CSS viewport at `2×`
  device pixel ratio reported by the in-app Browser).
- Combined before/after:
  `.codex/audits/yuk-139-result-preview-2026-08-03/comparison-before-after.png`.
- Additional visual checks:
  `.codex/audits/yuk-139-result-preview-2026-08-03/result-320x568-full.png`
  and
  `.codex/audits/yuk-139-result-preview-2026-08-03/result-430x932-full.png`.

The source and implementation are compared as full compositions. Focused
inspection covers the Moon, Share/card width relationship, Message/Shadow
hierarchy, left text axis, Hero CTA width, and the Result/Deck background.

## Responsive browser matrix

All values are CSS pixels measured in the local in-app Browser.

| Viewport | Card / text / Hero | Share | Side margin | Horizontal overflow |
| --- | ---: | ---: | ---: | --- |
| `320 × 568` | `296` | `272` | `12` | none |
| `360 × 800` | `320` | `272` | `20` | none |
| `375 × 812` | `320` | `272` | `27.5` | none |
| `393 × 852` | `320` | `272` | `36.5` | none |
| `430 × 932` | `320` | `272` | `55` | none |
| `768 × 1024` | `320` | `272` | centered | none |
| `852 × 393` | `320` | `272` | centered | none |

The long Result remains intentionally scrollable. The card rail never clips,
Share remains subordinate, and the Hero CTA never becomes viewport-wide.

## Accessibility and mechanics

- The accessibility snapshot exposes Back, Share, and `Раскрыть три карты` as
  named buttons.
- Share receives the existing `2px` silver `:focus-visible` outline.
- Moon text and date retain their semantic group and `time` element.
- Message and Shadow remain separate labeled content blocks.
- No routing, card data, Share behavior, or three-card transition was changed.
- This pass does not claim physical Telegram WebView, exact 200% browser zoom,
  or genuine forced-colors validation.

## Automated verification

- `node scripts/smoke-domain.mjs`: passed.
- `node scripts/smoke-state.mjs`: passed.
- `node scripts/smoke-ui-interactions.mjs`: passed.
- `python3 scripts/validate_control_language.py`: passed.
- `python3 scripts/validate_lore_canon.py`: passed.
- `python3 scripts/validate_product_scope.py`: passed.
- `python3 scripts/validate_responsive_strategy.py`: passed.
- `python3 scripts/validate_pages_artifact.py`: passed.
- `git diff --check`: passed.

## Final result

final result: passed

---

# YUK-139 Result metadata correction — Design QA

Date: 2026-08-03

Scope: correct the user-reported Result identity block without changing the
card geometry, Result rail, background, Share, interpretation, or CTA.

## Source and implementation evidence

- Source visual truth: `Снимок экрана — 2026-08-03 в 12.59.24.png`
  (`440 × 216` focused crop supplied by the user).
- Browser implementation:
  `.codex/audits/yuk-139-result-metadata-2026-08-03/result-393x852-full.png`
  (`393 × 1149` full-page capture at a `393 × 852` CSS viewport; browser
  device pixel ratio `2`, screenshot output normalized to CSS pixels).
- Focused comparison:
  `.codex/audits/yuk-139-result-metadata-2026-08-03/comparison-reported-fixed.png`.
  The implementation identity crop was normalized to the supplied crop size
  for inspection; card names differ because the runtime draw is real data.

## Finding and correction history

- Earlier P1: Result used the compact history formatter and rendered
  `3 авг`, despite the Kit requiring the authored lowercase full month on a
  separate row. The date also inherited the phase's Manrope treatment instead
  of the Kit's dedicated date typography.
- Fix: keep the compact formatter for history/gifts, add a full Result
  formatter returning `3 августа`, and restore the Kit date style:
  Cormorant Garamond, `0.82rem`, italic, quiet silver, left-aligned in grid row
  two.
- Post-fix evidence: the browser reports `Убывающая луна` on row one and
  `3 августа` on row two. At `320px`, the metadata bounds remain
  `103.4–216.6px` inside the `12–308px` card; there is no horizontal overflow.

## Required fidelity surfaces

- Typography: canonical Result title and phase are unchanged; the date now
  matches the Kit's dedicated second-row typography.
- Spacing/layout: the existing two-row icon/copy grid and card identity
  position are unchanged.
- Colors/tokens: Moon remains silver and the date uses
  `--wyrd-text-quiet`.
- Image quality: card artwork, crop, frame, and authored colors are unchanged.
- Copy/content: the Result uses the full Russian genitive month name;
  compact history surfaces continue using abbreviations.

## Verification

- `node scripts/smoke-ui-interactions.mjs`: passed, including an exact
  `3 августа` regression assertion.
- `node scripts/smoke-domain.mjs`: passed.
- `node scripts/smoke-state.mjs`: passed.
- `python3 scripts/validate_control_language.py`: passed.
- `python3 scripts/validate_responsive_strategy.py`: passed.
- `git diff --check`: passed.

## Final result

final result: passed
