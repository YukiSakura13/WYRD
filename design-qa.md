# YUK-139 Deck fan restoration — Design QA

Date: 2026-07-29

Linear scope: YUK-139 (`In Progress`)

## Comparison target

- Source visual truth: user-supplied transparent three-card reference,
  `833 × 940px`, RGBA. The third-party artwork is not stored in the repository.
- Browser-rendered implementation:
  [Approved Deck fan — 393 px](https://uploads.linear.app/869d01d0-49df-460a-9261-5f3c55da8c17/b86b90ee-b436-4c00-9e1f-8c1c3cc2f80a/d91af67b-e5eb-42dc-8690-2b059c426dc7),
  CSS viewport `393 × 852`, device density `1`.
- Focused reference/runtime comparison and the controlled `1.00 / 1.15 / 1.25`
  spread variants were reviewed locally; only the approved `1.00` runtime
  screenshot is retained as project evidence.
- Additional full-view browser checks: `320 × 568`, `375 × 812`, `430 × 932`,
  `768 × 1024`, and `852 × 393`.
- State: Deck at rest, empty question, no hover, no focus ring.

The source is a transparent crop of a three-card object, not a complete WYRD
screen. Only card count, equal card size, relative centres, angles, overlap,
and outer contour are treated as visual truth. Its artwork, frame, palette, and
symbols are deliberately not copied.

## Findings

No actionable P0, P1, or P2 difference remains in this fan-restoration slice.

- Exactly three equal `3:4` cards form the object.
- Relative to the middle card, the measured reference geometry is restored:
  - back: `translate(-10.66%, -0.58%) rotate(-3.3deg)`;
  - middle: `translate(0, 0) rotate(1.4deg)`;
  - front: `translate(11.38%, 0.87%) rotate(4.5deg)`.
- The angular gaps remain intentionally asymmetric: `4.7deg` between back and
  middle, then `3.1deg` between middle and front.
- The default review coefficient is `--deck-spread: 1`, which reproduces the
  measured reference. Wider `1.15` and `1.25` captures exist only for visual
  comparison and are not active in runtime.
- At `393px`, the front card remains `271.16px` wide and the complete fan
  envelope is `354.88px` wide: ratio `1.3087`, matching the approximately
  `1.31` reference envelope.
- The visible rear cards use the same authored Raven back as the front card.
  Both illustrated faces, top contours, and side exposures are readable, so
  the object registers as a three-card fan rather than backing plates.
- Static placement uses individual `translate` and `rotate` properties. The
  rare idle response animates only `transform`, so motion cannot overwrite or
  drift the measured fan geometry.

## Required fidelity surfaces

- **Fonts and typography:** the reference has no text. Runtime Back, Question
  Field, and `Коснись колоды` typography remain the approved Silver
  implementation without changes in this pass.
- **Spacing and layout rhythm:** the complete transformed fan is centred as one
  object. The question and invitation zones retain their approved runtime
  spacing.
- **Colors and visual tokens:** the reference palette and gold border are not
  copied. Existing cold-silver borders, authored monochrome card art, shadows,
  and WYRD background tokens remain unchanged.
- **Image quality and asset fidelity:** all three layers reuse the existing
  Raven card asset. No generated art, placeholder, recolouring, CSS redraw, or
  reference-image raster is shipped.
- **Copy and content:** no copy was introduced or changed. `Коснись колоды`
  remains the only text below the Deck.

## Responsive evidence

Browser measurements of the transformed fan:

| Viewport | Front card | Fan width | Fan left/right | Touch target | Horizontal overflow |
| --- | ---: | ---: | --- | ---: | --- |
| `320 × 568` | `220.80px` | `288.96px` | `17.78 / 13.27px` | `48px` | none |
| `375 × 812` | `258.75px` | `338.63px` | `20.83 / 15.54px` | `48px` | none |
| `393 × 852` | `271.16px` | `354.88px` | `21.83 / 16.30px` | `48px` | none |
| `430 × 932` | `296.70px` | `388.29px` | `23.88 / 17.83px` | `48px` | none |
| `768 × 1024` | `344.00px` | `450.19px` | `162.42 / 155.39px` | `48px` | none |
| `852 × 393` | `168.98px` | `221.13px` | `317.18 / 313.69px` | `48px` | none |

The complete fan remains visible without horizontal scroll. Short landscape
uses the existing vertical-scroll strategy rather than shrinking controls below
their accessible sizes.

## Comparison history

### Rejected P1 — staircase geometry

The earlier runtime accumulated Y offsets and used different angles from the
reference. Rear cards descended like steps, only isolated corners were visible,
and the object did not read as the supplied fan.

**Fix:** replaced the approximated placement with the independently measured
centres and angles above, all relative to the middle card.

### Rejected P1 — motion overwrote placement

The previous keyframes animated the complete `transform` declaration that also
positioned each card. This made exact geometry fragile and caused visible
movement away from the reference.

**Fix:** static geometry now lives in `translate` and `rotate`; the approved
rare idle response is an independent, sub-pixel/2px `transform` layer.

### Review-only spread alternatives

The front card size is identical in all three captures. Only the fan opening
changes:

| `--deck-spread` | Fan width at `393px` | Envelope ratio | Runtime status |
| ---: | ---: | ---: | --- |
| `1.00` | `354.88px` | `1.3087` | active exact reference |
| `1.15` | `367.33px` | `1.3546` | comparison only |
| `1.25` | `375.61px` | `1.3852` | comparison only |

This preserves the user's visual choice without turning the coefficient into a
user-facing product setting or silently departing from the reference.

## Interaction and engineering verification

- Enter accepts the question and transfers focus to `Коснуться колоды`.
- Enter adds no spark, intent thread, or response animation.
- The rare idle response runs without changing the measured static placement.
- Pointer hit-testing across `376` sampled visible points outside the base
  button rectangle still resolves to a Deck descendant or the Deck button.
- Clicking the Deck opens the one-card Result; Back returns to Deck.
- Browser console: no errors or warnings.
- Domain, state, UI-interaction, control-language, product-scope, lore-canon,
  responsive-strategy, Pages preparation/artifact, PR-body, and
  `git diff --check` gates: passed.
- Canonical Silver UI Kit files remain unchanged.
- No commit or push was performed.

## Residual boundary

This report accepts only the local Deck fan geometry and interaction slice.
YUK-139 remains `In Progress` until user visual approval and the complete
Result / 3-card / 5-card / Sheet acceptance are finished.

## Final result

final result: passed
