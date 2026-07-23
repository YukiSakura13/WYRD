# WYRD UI Kit release 10 — design audit

Date: 2026-07-22
Source: `https://runic-frame-kit-cr8v-2026.alexandername.chatgpt.site/?release=10-natural-magnet`

## Scope

- Combined visual, UX, and accessibility review of the live UI Kit.
- Desktop review at 1280×720 and mobile review at 393×852.
- Comparison target: the user-approved continuous Action Button family in `00-approved-action-button-family.png`.
- The initially withdrawn card-frame image was excluded from the source audit. A correct approved reference was supplied afterward and is now tracked in the follow-up closure below.

## Overall verdict

The source kit has a strong editorial identity and unusually good systems thinking, but it should not be treated as the final visual canon for WYRD. Its architecture is stronger than its original art direction. The follow-up Silver UI Kit now resolves the missing frame, button, Bone, share, field, and mobile-navigation gaps.

Keep the hierarchy, typography roles, control contracts, responsive logic, semantic HTML approach, and motion discipline. Replace the button library, protect the original card palette, expand Bone from a text token into a true artifact-surface role, and create the missing canonical card-frame component after the correct reference is supplied.

## Captured steps

1. **Overview — healthy.** Strong first impression, clear atmosphere, convincing editorial hierarchy, and a useful demonstration of the proposed material language. Evidence: `01-overview-top.png`.
2. **Foundations — mixed.** Depth/Night/Silver/Bone are named clearly, but the visible system is dominated by black, graphite, and silver. Bone exists mainly in typography and token documentation rather than as a meaningful physical surface. Evidence: `02-foundations.png`, `12-mobile-foundations-393.png`.
3. **Artifact buttons — needs replacement.** The inspector and state model are useful, but the 13 SVG variants create unnecessary visual branching. The geometry does not match the approved four-level continuous family. Evidence: `03-buttons-overview.png`, `08-buttons-focus.png`, `10-button-library.png`, `00-approved-action-button-family.png`.
4. **Frequent controls — mostly healthy.** The distinction between ritual actions and frequent utility actions is correct. Icon controls, field states, rows, safe-area rules, and 44/48 px targets are reusable. The plain rectangular actions are functionally clear but visually too generic and cold for final production. Evidence: `04-controls.png`.
5. **Card system — needs substantial color correction.** The Artifact / Quiet / Trace hierarchy is valuable, but the artwork is intentionally desaturated. Most card and profile imagery uses `grayscale(1)`; the main artifact uses `grayscale(0.22) saturate(0.78) brightness(0.86)`. This directly removes the approved beige warmth and changes the character of source art. Evidence: `05-cards.png`, `06-cards-detail.png`.
6. **Motion system — healthy.** The 140 / 220 / 320 / 800 ms hierarchy, rare ritual motion, short feedback, and reduced-motion fallback are appropriate for WYRD. Evidence: `07-motion.png`.
7. **Mobile presentation — mixed.** The content reflows to one column and remains readable at 393 px, but the section navigation disappears without a compact replacement. Evidence: `11-mobile-overview-393.png`, `12-mobile-foundations-393.png`.

## What should move into the application

### Keep nearly as-is

- Surface hierarchy: **Artifact / Quiet / Control / Sheet**.
- Typography ownership: IM Fell English only for the WYRD mark; Cormorant Garamond for reading and quiet context; a separate display role for short titles.
- Minimum 44 px hit targets, 48 px icon controls, safe-area handling, semantic buttons, labelled switches and fields.
- Motion hierarchy and `prefers-reduced-motion` behavior.
- External SVG assets with real DOM text instead of baking copy into artwork.
- The principle that frequent utility actions must be quieter than ritual actions.

### Keep the idea, redesign the visual

- Utility actions such as «Поделиться картой»: use a familiar Share icon plus label, stable 52 px target, restrained silver contour, and one small diamond taken directly from the approved Action Button ornament. The diamond is the only branded accent; there are no ritual end sections, nested diamonds, or rich ornament.
- Rectangular field, row, and sheet frames: retain their functional clarity but add a small amount of the approved WYRD material language so they do not feel like generic luxury UI.
- Forum can remain a display option, but the approved button labels should keep their current sentence case and lighter literary treatment instead of wide uppercase action copy.

## What should be changed before migration

### 1. Protect the cards from the silver theme

Silver is interface chrome; it must not become an image filter.

- Remove grayscale/desaturation filters from source card art and save/share exports.
- Preserve the already approved beige background of the cards exactly; do not reinterpret it as gray or cold white.
- Expand the color roles to distinguish at least: `bone-text`, `bone-card-surface`, and `bone-muted`.
- Let the card be the warm physical artifact inside a cold night-and-silver interface. That temperature contrast is a strength, not an inconsistency.

### 2. Replace the 13-button library

- Use the approved continuous family only: Hero, Secondary, Compact, Quiet.
- Keep one master geometry and progressive ornament layers, not unrelated variants.
- Remove the normal-theme rectangular focus box. Focus should clarify the same silver silhouette through a brighter frame, stronger center gem, and restrained inner light without changing size.
- Keep a standard system outline only as a forced-colors/high-contrast fallback.
- Keep «Поделиться картой» outside the ritual family as a utility action: Share icon + text + thin silver contour + one small approved diamond. Its geometry must remain unchanged in default, loading, pressed, and completed states.

### 3. Add the missing card-frame family

The kit currently demonstrates a generic Artifact Card, not the final WYRD card frame. After the correct reference is supplied:

- reconstruct one exact, symmetric master frame;
- ship it as a transparent vector overlay rather than a black or gray baked background;
- keep the beige card surface and illustration independent from the silver frame;
- derive quieter card/tile variants by removing layers from the master rather than inventing new decorations.

### 4. Tighten accessibility details

- Do not allow a 28 pt interactive target even for secondary UI; a 28 pt glyph can live inside a 44 px hit area.
- Increase contrast and/or size for the smallest uppercase captions and technical labels.
- Provide a mobile section menu instead of removing navigation.
- Verify the silhouette focus state by keyboard and in high-contrast mode; a glow alone must not be the only signal.

## Recommended direction

Treat release 10 as a **foundation and interaction specification**, not as the final skin. The strongest hybrid is:

- this kit's architecture, responsive rules, controls, semantics, and motion;
- the approved Action Button family from `00-approved-action-button-family.png`;
- the existing warm beige card artwork without filters;
- a new canonical silver card-frame family built from the correct reference.

## Follow-up closure

The approved Silver follow-up is available in `docs/wyrd-ui-kit.html`.

- Canonical frame: `assets/ui/card-frames/approved/wyrd-card-frame-artifact.svg`.
- Approved Action Button family: `assets/ui/action-buttons/continuous/`.
- Utility Share: familiar icon, label, quiet contour, and one approved small diamond.
- Question Field: 12px rectangular double contour and one focus-entry spark.
- Silver roles: `#CDD1CF` base, `#E1E4E1` bright edge, restrained neutral lowlight.
- Bone roles: warm card surface and warm artifact copy are distinct from silver chrome.
- Mobile navigation: compact section menu remains available at 393px.
- Card artwork: source images are rendered with `filter: none`.

## Evidence limits

- This is a screenshot and live-DOM audit, not a full WCAG compliance claim.
- Keyboard, screen-reader, forced-colors, and device/PWA behavior still require implementation-level verification.
- Full cross-browser and assistive-technology certification remains outside this visual QA; implementation checks cover keyboard focus, reduced-motion rules, mobile reflow, target sizes, and browser-console health.
