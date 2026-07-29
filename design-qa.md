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
