# YUK-139 Cover CTA height and motion correction — Design QA

Date: 2026-08-04

Scope: local refinement of the first ritual Cover action only. The approved
compact/wide width contract, Moon, forest, brand lockup, copy, Hero asset,
screen structure, canonical Kit, Linear, and all other runtime screens remain
unchanged.

## Reviewed correction

- The control box is increased from `52px` to `60px` without changing its
  responsive width. The Hero frame is scaled vertically by `1.18` while the
  label remains unscaled, so the ornament gains height without stretching the
  typography or widening the CTA.
- The pointer attraction keeps its approved `28px × 14px` range but uses the
  calmer spring pair `stiffness: 420`, `damping: 42`. Particle following uses
  `stiffness: 240`, `damping: 31`, removing the abrupt correction near rest.
- Fireflies retain their existing density, brightness, and cadence, but their
  alpha now fades before the inner horizontal and vertical edges. The SVG halo
  remains outside that particle mask, so the approved outer glow is preserved.
- Top/bottom action spacing is `28px / 24px`; the existing Cover bottom reserve
  remains `90px` at every tested viewport.

## Visual evidence

- Implementation screenshot: `/tmp/yuk139-cover-motion-wide.jpg`
- State: resting Cover invitation after the initial reveal has settled.
- The result reads as a taller ritual control rather than a flattened banner;
  its width and Moon → WYRD → invitation hierarchy remain unchanged.

## Responsive verification

| Viewport | CTA box | Side space | Bottom space | Overflow |
| --- | --- | --- | --- | --- |
| `320 × 568` | `280 × 60` | `20px` | `90px` | `0px` |
| `360 × 800` | `295 × 60` | `32px` | `90px` | `0px` |
| `375 × 812` | `308 × 60` | `34px` | `90px` | `0px` |
| `393 × 852` | `322 × 60` | `35px` | `90px` | `0px` |
| `430 × 932` | `353 × 60` | `39px` | `90px` | `0px` |
| `504 × 699` | `360 × 60` | `72px` | `90px` | `0px` |
| `768 × 1024` | `384 × 60` | `192px` | `90px` | `0px` |
| `852 × 393` | `426 × 60` | `213px` | `90px` | `0px` |

## Interaction and verification

- Domain, state, and UI interaction smoke tests: passed.
- Control language, product scope, responsive strategy, lore canon, Pages
  artifact validation, and `git diff --check`: passed.
- Focus-visible, pressed, magnetic attraction, firefly rendering, and
  reduced-motion remain covered by runtime assertions.
- Genuine system forced-colors and a physical Telegram WebView are outside this
  local visual pass and are not claimed here.

## Review boundary

- Canonical Kit: no changes.
- Linear: no changes.
- Git commit/push: not performed.

final result: passed

---

# YUK-139 Cover CTA proportion correction — Design QA

Date: 2026-08-04

Scope: local correction of the ritual Cover invitation only. The Moon, forest,
brand lockup, Hero ornament asset, copy, source interaction mechanics, Kit,
Linear, and all other runtime screens are intentionally unchanged.

## Comparison evidence

- Source visual truth:
  `/var/folders/bp/pzbghfvd7pjg61djny2r6sg80000gn/T/TemporaryItems/NSIRD_screencaptureui_dfLSxB/Снимок экрана — 2026-08-04 в 14.17.38.png`
- Source pixels: `1008 × 1398` at Retina density; normalized to
  `504 × 699` CSS pixels for comparison.
- Implementation screenshot: `/tmp/yuk139-cover-proportion-504x699-crop.jpg`
- Implementation pixels/CSS viewport: `504 × 699`, density-normalized.
- Full-view comparison: `/tmp/yuk139-cover-proportion-before-after.jpg`
- State: resting Cover invitation after the initial reveal has settled.

The full view is sufficient for the reviewed change because the complete Hero
ornament, label, glow envelope, brand lockup, and screen edges remain readable
at the normalized size. A separate detail crop would not add evidence.

## Comparison history

### Pass 1 — blocked

- **P1 — CTA dominated the complete Cover.** The source implementation used
  `472 × 60px` at the `504 × 699` viewport: `93.7%` of the screen width with
  only `16px` per side. The glow expanded the perceived envelope almost to the
  screen edges, so the invitation read as a footer banner rather than the third
  step in the hierarchy Moon → WYRD → action.
- **Fix:** compact width is now `clamp(17.5rem, 82vw, 22.5rem)`; wide width is
  `clamp(22.5rem, 50vw, 30rem)`. The normalized target becomes `360 × 52px`,
  with `72px` per side. The action is raised optically by replacing the old
  `52px` top gap with `36px` plus `24px` reserved lower breathing room.
- **Fix:** resting main contour opacity is `0.86`; halo is `0.09` with a `0.24`
  breath peak; trace peak is `0.24`. Hover/focus remain intentionally clearer.
- **Fix:** label size is bounded to `17–19px`; the existing 52px touch target,
  Hero aspect ratio, pointer attraction, fireflies, press, focus, and
  reduced-motion behavior remain intact.

### Pass 2 — passed

The normalized comparison shows the CTA at the intended subordinate scale. The
Moon remains the atmospheric focus, the approved lockup remains the identity
focus, and the invitation is clear without becoming the widest and brightest
object on the screen. No actionable P0/P1/P2 difference remains.

## Required fidelity surfaces

- **Typography:** the approved Cover lockup remains `60px / 13px`; CTA is
  `17–19px`, weight `500`, with unchanged copy and typeface.
- **Spacing/layout:** Hero geometry stays `1116:142`; compact width is bounded
  to `280–360px`, wide width to `360–480px`; action target is never below
  `52px`. The Moon and brand positions are unchanged.
- **Colors/tokens:** the cold-silver palette is unchanged. Only the CTA resting
  opacity and glow amplitude are reduced; hover/focus preserve full clarity.
- **Image quality/assets:** the authored forest, Moon, and existing
  `wyrd-action-hero.svg` are reused unchanged; no asset was redrawn.
- **Copy/content:** `WYRD`, `Оракул духов леса`, and `Войти в лес` are unchanged.

## Responsive verification

| Viewport | CTA box | Side space | Bottom space | Overflow |
| --- | --- | --- | --- | --- |
| `320 × 568` | `280 × 52` | `20px` | `90px` | `0px` |
| `360 × 800` | `295 × 52` | `32px` | `90px` | `0px` |
| `375 × 812` | `308 × 52` | `34px` | `90px` | `0px` |
| `393 × 852` | `322 × 52` | `35px` | `90px` | `0px` |
| `430 × 932` | `353 × 52` | `39px` | `90px` | `0px` |
| `504 × 699` | `360 × 52` | `72px` | `90px` | `0px` |
| `768 × 1024` | `384 × 52` | `192px` | `90px` | `0px` |
| `852 × 393` | `426 × 54` | `213px` | `90px` | `0px` |

## Interaction and verification

- Domain, state, and UI interaction smoke tests: passed.
- Control language, product scope, responsive strategy, lore canon, Pages
  artifact validation, and `git diff --check`: passed.
- Existing hover, focus-visible, pressed, magnetic field, firefly cadence, and
  reduced-motion contracts remain covered by runtime assertions.
- Genuine system forced-colors and a physical Telegram WebView are outside this
  local visual pass and are not claimed here.

## Review boundary

- Canonical Kit: no changes.
- Linear: no changes.
- Git commit/push: not performed.

final result: passed

---

# YUK-139 reading actions and Cover invitation preview — Design QA

Date: 2026-08-04

Scope: local, user-reviewable runtime preview only. The canonical Silver UI
Kit, Linear, commits, and published build are intentionally unchanged pending
visual approval.

## Restored contract

- The ritual Cover keeps its approved forest, Moon, copy, and composition. Its
  `Войти в лес` action now uses the existing full Hero ornament together with
  the source invitation mechanics: restrained silver breathing, internal
  fireflies, magnetic pointer response, press, focus, and reduced-motion state.
- The Forest screen with the Raven card and `Раскрыть карту` is unchanged.
- The single-card Result keeps its approved Artifact, interpretation, and Share
  block. `Раскрыть три карты` now uses the Secondary frame; a separate quiet,
  unframed `Новый вопрос` follows it.
- The three-card reading ends in a deliberate sequence: reading, pause,
  `Пять карт откроют то, что три не сказали.`, Secondary
  `Раскрыть пять карт`, then quiet unframed `Новый вопрос`.
- The five-card reading remains terminal: its existing final text is followed
  only by the existing Quiet/Minimal framed `Новый вопрос` action.
- Result, three-card, and five-card scenes use the same exact cold-silver
  background and suppress the legacy gold/noise/fog overlays.

## Visual comparison evidence

- Source invitation capture: `/tmp/yuk139-action-audit/01-source-hero-invitation.png`
- WYRD Cover implementation: `/tmp/yuk139-cover-implementation.png`
- Side-by-side comparison: `/tmp/yuk139-cover-source-comparison.jpg`

The comparison confirms that the runtime keeps WYRD's own ornament artwork and
Cover composition while restoring the source interaction language. It does not
copy the source screen's typography or surrounding visual treatment.

## Flow and interaction verification

- Cover → Forest → Deck → Result → three cards → five cards completes.
- `Enter` in the question field preserves the approved static transition and
  transfers focus to the Deck.
- Back restores five cards → three cards → Result correctly.
- Result and three-card continuation actions are Secondary controls; their
  quiet `Новый вопрос` links are independent 44px targets and return to Deck.
- Five cards exposes one terminal Quiet/Minimal `Новый вопрос`; the duplicate
  unframed link stays hidden.
- Pointer, touch, keyboard focus, pressed state, and reduced-motion fallbacks
  remain implemented. Forced-colors and reduced-motion were inspected in code;
  this pass does not claim genuine system-mode or physical-device validation.

## Responsive matrix

| Viewport | Result | Three cards | Five cards | Horizontal overflow |
| --- | --- | --- | --- | --- |
| `320 × 568` | Secondary + 44px quiet link | Secondary + 44px quiet link | Quiet only | `0px` |
| `375 × 812` | Secondary + 44px quiet link | Secondary + 44px quiet link | Quiet only | `0px` |
| `393 × 852` | Secondary + 44px quiet link | Secondary + 44px quiet link | Quiet only | `0px` |
| `430 × 932` | Secondary + 44px quiet link | Secondary + 44px quiet link | Quiet only | `0px` |
| `768 × 1024` | Secondary + 44px quiet link | Secondary + 44px quiet link | Quiet only | `0px` |
| `852 × 393` | Secondary + 44px quiet link | Secondary + 44px quiet link | Quiet only | `0px` |

The approved card geometry and reading content remain unchanged at every
viewport. Short-height landscape scrolls vertically without clipping actions.

## Automated verification

- Domain smoke tests: passed.
- State smoke tests: passed.
- UI interaction smoke tests: passed.
- Control language, product scope, responsive strategy, lore canon, Artifact
  validation, and `git diff --check`: passed.

## Review boundary

- Canonical Kit: no changes.
- Linear: no changes.
- Git commit/push: not performed.

Final result: **passed for local visual review**.

---

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

# YUK-139 Three-card Spread restoration — Design QA

Date: 2026-08-04

Scope: restore the three-card reading surface from the approved Silver UI Kit
without changing its archetype topology, question state, selected cards,
reveal order, Back/New question routes, or card-detail Sheet mechanics. The
five-card screen remains outside this local review slice.

## Combined visual evidence

- Canonical source: the live Kit `Quiet` card at a `393 × 852` CSS viewport,
  captured locally as `/tmp/yuk139-kit-quiet-393.png`.
- Runtime implementation: the three-card screen at the same `393 × 852` CSS
  viewport, captured locally as `/tmp/yuk139-spread3-viewport-393.png`.
- Side-by-side inspection: `/tmp/yuk139-spread3-comparison.png`.

The comparison confirms the same authored 3:4 artwork, unfiltered warm card
surface, `192px` Quiet width, `1px` quiet silver material edge, contact shadow,
transparent control surface, `0.65rem` image-to-identity gap, and Forum card
identity. The runtime adds only the product-required visible spread role above
the card name.

## Restored hierarchy and mechanics

- Each spread position remains one semantic button and now exposes its role
  and card name visibly beneath the image; its accessible name remains
  `Открыть карту <роль> — <имя>`.
- The real-question context now matches the accepted Result hierarchy:
  sentence-case `Твой вопрос` at `12px/400`, followed by the actual question at
  `17px/500`. For an empty question the label is hidden and only
  `Тайна приоткроется сама...` remains.
- Existing archetype geometry and selection order are unchanged. For the
  vertical archetype A, all three cards use the Kit Quiet `12rem` width.
- Legacy `blur`, `flip`, `scale(.97)`, and translated resting state are removed.
  Reveal delays remain `0/460/920ms`; each card now appears through opacity
  only over the canonical `800ms` calm reveal.
- Card art remains unfiltered. Hover/focus clarifies only the physical image
  edge and contact shadow; press feedback remains `1px`.
- The existing fixed bottom Sheet, Close/Escape behavior, focus return, Back,
  five-card continuation, and New question routes are unchanged.

## Responsive browser matrix

All measurements are CSS pixels from the local in-app Browser after the final
legacy-transform removal.

| Viewport | Question width | Card width | Card role/name | Min target | Horizontal overflow |
| --- | ---: | ---: | --- | ---: | --- |
| `320 × 568` | `296px` | `192px` | `12 / 17.28px` | `48px` | none |
| `375 × 812` | `343px` | `192px` | `12 / 17.28px` | `48px` | none |
| `393 × 852` | `361px` | `192px` | `12 / 17.28px` | `48px` | none |
| `430 × 932` | `398px` | `192px` | `12 / 17.28px` | `48px` | none |
| `768 × 1024` | `400px` | `192px` | `12 / 17.28px` | `48px` | none |
| `852 × 393` | `400px` | `192px` | `12 / 17.28px` | `48px` | none |

The authored vertical topology remains a scrollable reading in short-height
and landscape contexts; no card, text, or control is horizontally clipped.

## Accessibility and motion

- Keyboard focus is visibly rendered with a `2px` silver outline and `3px`
  offset; forced-colors adds the system `ButtonText` outline and applies
  `CanvasText` to the image edge.
- Modal Close receives initial focus; Escape closes the Sheet and returns
  focus to the originating card.
- Reduced motion removes the reveal animation and pressed translation while
  preserving all card content at full opacity.
- This local pass does not claim a genuine system forced-colors session, exact
  `200%` browser zoom, or physical Telegram WebView validation.

## Automated verification

- `node scripts/smoke-domain.mjs`: passed.
- `node scripts/smoke-state.mjs`: passed.
- `node scripts/smoke-ui-interactions.mjs`: passed, including new Spread
  identity, Quiet geometry, question hierarchy, and motion regression checks.
- `python3 scripts/validate_control_language.py`: passed.
- `python3 scripts/validate_product_scope.py`: passed.
- `python3 scripts/validate_responsive_strategy.py`: passed.
- `python3 scripts/validate_lore_canon.py`: passed.
- `python3 scripts/prepare_pages.py`: passed.
- `python3 scripts/validate_pages_artifact.py`: passed.
- `git diff --check`: passed.

## Review boundary

- Silver UI Kit HTML/CSS/JS: zero diff.
- Linear: not changed before user review.
- Git: not committed or pushed before user review.

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

---

# YUK-139 reading actions + Cover invitation canonicalization — Design QA

Date: 2026-08-04

Scope: publish the user-approved local Cover CTA and reading-completion hierarchy
as the exact Silver UI Kit contract, without changing the accepted visual result.

## Canonical ownership

- Cover «Войти в лес» is one `.wyrd-cover-invitation` shared by Kit and runtime:
  the same Hero ornament, `60px` minimum height, optical frame height, `6.8s`
  breath/trace, contained fireflies, softened magnetic response, hover, focus,
  press and reduced-motion fallback.
- One-card and three-card continuation use the same Secondary / Reduced frame:
  «Раскрыть три карты» and «Раскрыть пять карт».
- «Новый вопрос» is one quiet unframed `44px+` action. After five cards it is
  the only completion action; the framed continuation is hidden.
- Deck, Result and both Spread states use the same cold reading background and
  suppress the legacy fog/stars layers.

## Accessibility and restoration checks

- Kit and runtime consume the same shared CSS instead of separate redraws.
- The Kit dynamically imports the exact runtime Cover motion module; the Kit
  still opens as a static document when module loading is unavailable.
- Cover and reading reset preserve keyboard focus, forced-colors fallback,
  `44px+` targets and reduced-motion meaning.
- The approved runtime screen geometry, copy, routes and card artwork remain
  unchanged by the canonical extraction.

## Verification

- `node scripts/smoke-ui-interactions.mjs`: passed, including exact Kit/runtime
  Cover ownership, reading hierarchy and five-card final-state assertions.
- Browser end-to-end at `393×852`: Cover → Forest → Deck → Result → three cards
  → five cards passed. Enter returns focus to the Deck; the one- and three-card
  screens expose one Secondary CTA plus one quiet reset; five cards expose only
  the quiet reset.
- Browser regression found and fixed a real cascade bug: `hidden=true` on the
  final framed CTA was overridden by the component's `display:grid`. The final
  rule now produces `display:none` and a `0×0` box; the quiet reset remains
  `44px` high.
- Responsive browser matrix passed at `320×568`, `360×800`, `375×812`,
  `393×852`, `430×932` and `768×1024`: document width equals viewport width,
  the five-card grid stays inside the shell and the reset keeps a `44px` target.
- Spread detail modal at `393×852` stays within `0–393px`, locks page scroll,
  focuses Close, and returns focus to the opening card.
- Browser console: no warnings or errors.
- Remaining repository and Pages gates are recorded in the final YUK-139
  evidence comment for this checkpoint.

## Final result

final result: passed
