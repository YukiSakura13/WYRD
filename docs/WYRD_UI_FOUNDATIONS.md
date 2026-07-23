# WYRD UI Foundations

Issue: YUK-135

This document defines the component language for the silver WYRD migration. It does not redraw screens. It turns the approved Cover and Forest direction into a small system that can scale to many screens without inventing new frames or controls.

## Purpose

WYRD is a quiet forest oracle, not a dashboard. UI elements should feel like signs, artifacts, pages, seals, and traces from the same world. A component is valid only when its role, material, depth, state, and motion are clear.

The rule for future work:

> If a new screen needs a new button or a new frame, first prove that none of the families below can express it.

## Canonical Sources

- `docs/WYRD_BRANDBOOK.md`
- `docs/WYRD_VISUAL_STYLE_GUIDE.html`
- `docs/WYRD_UI_RULES.md`
- `docs/WYRD_INTERACTION_QA.md`
- `docs/wyrd-ui-kit.html` — live canonical Silver UI Kit
- `assets/ui/card-frames/approved/wyrd-card-frame-artifact.svg` — transparent symmetric Artifact Frame master
- `assets/ui/action-buttons/continuous/` — approved four-level Action Button family
- current runtime screens: Forest, Deck, Result, Spread, Profile, Settings, Notifications, Spirit Book

## The Four Frame Families

WYRD has four frame/material families. Components are functional blocks built from these families; the frame family and the component size are separate axes.

| Family | Role | Used For | Decorative Level |
| --- | --- | --- | --- |
| Artifact Frame | Main magical object | Reveal card, deck object, result card, important media | V |
| Quiet Frame | Secondary content and navigation | Forest tiles, settings groups, reminder cards, empty panels | II |
| Control Frame | Action and input behavior | CTA, input, select, segmented choice, chip, toggle | I-III |
| Sheet Frame | Temporary surface above the scene | Modal, bottom sheet, time picker, history detail, save sheet | III |

### Artifact Frame

Artifact Frame is for objects the user touches as part of the core oracle mechanic. It can feel physical.

Rules:
- use sparingly;
- may use ornamental corners, central diamond/star, and a richer silver line;
- may have object depth, contact shadow, and a pressed state;
- should still feel engraved and matte, not plastic or neon;
- text and symbol layout must keep generous air.

Current relatives:
- Forest Hero Card: `Раскрыть карту`;
- Deck object;
- Result oracle card;
- Spirit Book illustration frame when it acts as a featured story image.

The canonical card frame is a transparent `1086×1448` SVG overlay. Its left half is the restored master geometry and its right half is an exact mirror. It never owns the card illustration or the Bone surface beneath it. Source art remains unfiltered; silver is interface chrome, not an image treatment.

The shareable result card keeps the existing product anatomy instead of becoming a full-bleed beige poster: dark outer artifact, warm unfiltered image window, card name, moon phase, and date. The UI Kit documents that structure; it does not replace the current share composition with a new card format.

### Quiet Frame

Quiet Frame is for secondary cards and groups. It can invite touch, but it must not compete with Artifact Frame.

Rules:
- `1px` line;
- radius `var(--radius-small)` through `var(--radius-card)` (`8-12px`);
- border color around `rgba(205, 209, 207, 0.18-0.32)` for clear containers, lower alpha for grouped panels;
- interior: transparent or `rgba(9, 10, 14, 0.32-0.46)`;
- very light depth is allowed, but no heavy card body;
- no ornamental corners unless the component is promoted to Artifact.

Current relatives:
- Forest tiles;
- settings and reminders lists;
- reminder days card;
- empty states;
- quiet information panels.

### Control Frame

Control Frame is not always a visible box. It is a behavior contract for controls.

Rules:
- minimum touch target `44px`;
- focus-visible must be obvious;
- selected state must not rely only on color;
- disabled state keeps the shape understandable;
- controls may be framed, filled, underlined, segmented, or circular depending on function;
- do not wrap every checkbox/radio/toggle in a decorative frame.

Current relatives:
- Primary CTA;
- Secondary Button;
- Quiet/Text Action;
- Input;
- Select;
- Segmented Radio;
- Toggle;
- Day Chip;
- Icon Button.

### Control Language v1: Back and Close

The first canonical runtime family is `Navigation Icon Button`. It is implemented by `.ui-icon-button` in `assets/css/components/control-language.css`; old screen classes keep routing only, while App Header owns placement.

Contract:
- one `48px` circular hit area for Back and Close;
- one `20px` SVG box for close/utility glyphs and one optical `28px` long-arrow Back glyph with the same stroke language;
- Back preserves WYRD's long arrow with a horizontal shaft, rendered as one optically aligned SVG rather than a font glyph;
- Close uses an x-mark and never substitutes for Back;
- the default material is dark enamel with a quiet cold-silver line;
- hover and focus clarify the same material instead of introducing a new color;
- pressed moves down by at most `1px` and shortens the contact shadow;
- focus is visible through an outline and material change, not color alone;
- decoration and SVG paths never intercept pointer input;
- `prefers-reduced-motion: reduce` removes movement while preserving state clarity;
- screen placement observes safe areas and a shared `18px` visual inset.

Apple Human Interface Guidelines are the ergonomic baseline for hit areas, feedback, layout, and icon consistency. They do not define WYRD's visual style.

### Control Language v2: Runtime Families

The shared interaction contract is implemented in `assets/css/components/control-language.css`. Runtime screens keep their existing aliases so visual migration can proceed one screen at a time without changing routes.

| Family | Canonical class | Geometry |
| --- | --- | --- |
| Navigation Icon Button | `.ui-icon-button` | `48px` circle; long-arrow Back or x-mark Close |
| Pager Icon Button | `.ui-pager-button` | `48px` circle; short SVG chevron |
| Page Choice | `.ui-page-choice` | `44px` hit area around a quiet dot |
| Action Button | `.ui-action` | `52px` minimum height; role modifiers |
| Utility Action | `.wyrd-utility-action` | `52px` minimum height; familiar icon + label; no ritual ornament |
| Row Action | `.ui-row-action` | full-width action; `68px` minimum height |
| Choice Control | `.ui-choice` | `44px` minimum target; selected state is not color-only |
| Card Action | `.ui-card-action` | full semantic card action; art remains unfiltered |

Action role modifiers are `.ui-action--primary`, `.ui-action--secondary`, `.ui-action--quiet`, and `.ui-action--destructive`. The approved folklore-silver visual family is applied through the explicit `.wyrd-action-frame` opt-in and its `--hero`, `--secondary`, `--compact`, and `--quiet` modifiers. The oracle result → spread proof cluster is the first runtime application; other screens retain their aliases until they are migrated and checked in context.

The visual ladder uses one continuous frame and one mirrored side construction:

- Hero: longest frame, outer diamond and perpendicular connectors;
- Secondary: approximately 9% shorter, outer diamond without the Hero connectors;
- Compact: approximately 9% shorter, the original middle ornament;
- Quiet: shortest frame, the large diamond plus the smallest center gem, with the intermediate diamond intentionally omitted.

All four levels preserve the same visible height and material. Focus clarifies the existing silver geometry by repeating the approved frame asset as a brighter overlay; it does not introduce the rectangular laboratory outline, a new color, a CSS filter, or a scaled ornament.

Utility actions are deliberately outside this ritual ladder. The approved «Поделиться картой» pattern is a familiar network Share icon plus text inside a restrained thin silver contour. It has no trailing diamond, ritual end sections, nested construction, or rich ornament. Default, loading, pressed, and completed states must preserve exactly the same outer geometry and dimensions.

Shared component radii are semantic tokens, not one-off values:

| Token | Value | Role |
| --- | --- | --- |
| `--radius-circle` | `999px` | circular icon controls and pill tracks |
| `--radius-small` | `8px` | inset contours and compact controls |
| `--radius-medium` | `10px` | utility actions |
| `--radius-card` | `12px` | cards, fields, and grouped panels |
| `--radius-sheet` | `20px` | top corners of sheets and modal surfaces |

### Question Field

The question field is a Control Frame, not a fifth ritual ornament.

- wide rectangular shell with `10-12px` corners;
- `88-100px` comfortable height for two lines of literary text;
- one quiet outer silver line plus one inset hairline;
- Bone label, text, and placeholder roles;
- one restrained silver spark continuously traverses the border to identify the question field as the target action;
- typing does not restart or accelerate the loop;
- `prefers-reduced-motion` keeps the double contour and focus material change but removes the traversal.

### Toggle

The toggle keeps the familiar pill track and communicates state through knob position, fill, and contrast. Its knob uses the approved large-plus-small diamond mark; the intermediate diamond is intentionally omitted. Ornament stays inside the knob and never changes the control's `64×36px` outer geometry. The UI Kit must show Off, On, Focus, and Disabled.

The complete route and owner map lives in `docs/WYRD_CONTROL_INVENTORY.md`.

### Sheet Frame

Sheet Frame is for temporary layers above the world.

Rules:
- backdrop dims the forest;
- panel uses a dark forest/night material;
- border is quiet oxidized silver, validated against the active scene surface;
- bottom sheets use top radius `18-22px`;
- sheets contain Control Frame actions, not new button styles.

Current relatives:
- unsaved changes sheet;
- reminders time picker;
- spread card modal;
- history detail sheet;
- save card sheet.

## Button Philosophy

Buttons in WYRD do not shout "click me". They invite touch through role, material, depth, and clear affordance.

| Meaning | UI Role | Example |
| --- | --- | --- |
| Artifact | starts or advances an oracle mechanic | Reveal card, deck |
| Forest Sign | navigates to a section | Forest tiles |
| Seal | confirms an important choice | Save, Done, Continue |
| Quiet Line | secondary navigation or cancel | Cancel, Stay, New question |
| Trace | opens history or a stored state | History entries, gifts |

## Button Families

| Family | Frame | Purpose | Must Feel Like |
| --- | --- | --- | --- |
| Hero Button | Artifact | primary oracle entry | touchable magical object |
| Card Button | Quiet | navigation to a feature | quiet forest sign |
| Primary CTA | Control | commit/continue | seal of action |
| Secondary Button | Control | alternative action | framed choice |
| Ghost/Text Button | Control | low-priority action | quiet silver text |
| Utility Action | Control | share and other familiar utilities | clear icon-and-label control without ritual ornament |
| Navigation Icon Button | Control | back and close | one predictable circular tool |
| Pager Icon Button | Control | previous/next chapter or page | related navigation tool |
| Utility Icon Button | Control | settings and profile | quiet global tool |

## Visual DNA

These traits make a component recognizably WYRD.

- Cold folklore silver is the active migration material; gold is legacy and must not return to migrated controls.
- Dark night surface, not flat black emptiness.
- Thin engraved line, usually `1px`.
- Radius is restrained: `8-12px` for cards/controls, `18-22px` only for sheets or large artifacts.
- One central diamond/star language.
- One divider language: line - sign - line.
- Forest symbols are semantic: fern, moon, leaves, moth, tracks, acorn.
- Ornament belongs to role, not decoration for decoration's sake.
- Light is soft and directional.
- Motion is breath, press, drift, or reveal; never bounce.

## Tokens

These values come from the current brandbook and runtime tokens.

### Control Geometry

| Token | Value | Role |
| --- | --- | --- |
| `--control-touch-min` | `44px` | minimum interactive target |
| `--control-icon-hit-size` | `48px` | Back and Close |
| `--control-pager-hit-size` | `48px` | previous/next page |
| `--control-action-min-height` | `52px` | action buttons |
| `--control-row-min-height` | `68px` | list/setting actions |
| `--control-choice-hit-size` | `44px` | chips, days, radio choices |
| `--control-pressed-offset` | `1px` | maximum pressed displacement |
| `--control-disabled-opacity` | `0.38` | disabled material |

### Color Roles

| Token | Value | Role |
| --- | --- | --- |
| Depth | `#070709` | deepest background and lower edges |
| Night | `#101019` | base night surface |
| Shadow | `#0A0B0E` | cards, dim interiors |
| Cold Top | `#1F2330` | subtle lifted top light |
| Brand text | `#F3ECDD` | `WYRD` only |
| Heading text | `#EFEADC` | screen and card headings |
| Action text | `#E7E4DB` | interactive labels |
| Secondary text | `rgba(210, 212, 210, 0.74)` | explanatory text |
| Quiet text | `rgba(216, 218, 216, 0.64)` | low-priority captions |
| Control silver | `rgba(205, 209, 207, 0.42)` | default icon-control edge |
| Active silver | `rgba(225, 228, 225, 0.68)` | hover, focus, pressed edge |
| Silver base | `#CDD1CF` | canonical interface chrome |
| Silver bright | `#E1E4E1` | directional highlight and active edge |
| Silver lowlight | `#858B8B` | restrained engraved depth |
| Bone card fallback | `#EEE5D4` | neutral underlay only; authored card-paper colors remain unchanged |
| Bone muted | `rgba(238, 229, 212, 0.72)` | warm labels and supporting artifact copy |

### Borders

| Role | Value |
| --- | --- |
| Hairline | `1px` |
| Subtle divider | quiet neutral silver, validated per migrated surface |
| Quiet frame | cold silver below primary-control contrast |
| Clear frame | cold silver with readable edge contrast |
| Active/focus silver | same material at higher clarity, never neon |

### Radius

| Role | Value |
| --- | --- |
| Small control | `8-9px` |
| Quiet card/list/input | `10-12px` |
| Artifact | `18-24px`, only when the object needs physical body |
| Pill/toggle/chip | `999px` |
| Bottom sheet | `20px 20px 0 0` |

### Typography

| Role | Font |
| --- | --- |
| Brand mark `WYRD` | `IM Fell English` only |
| Card titles, short caps, tiles, decorative labels | `Forum` |
| Interface body, screen titles, captions, literary text | `Cormorant Garamond` |

Rules:
- do not use `IM Fell English` outside `WYRD`;
- treat the system as `IM Fell English` for the mark, `Forum` for card headings, and `Cormorant Garamond` for body/captions;
- keep `WYRD` and `Оракул духов леса` as one lockup without a divider;
- use `#F3ECDD`, weight `400`, and `0.22em` tracking for `WYRD`;
- use Cormorant Garamond `500`, at least `12px`, `0.24em` tracking, and uppercase for the lockup subtitle;
- do not use wide caps for long body text;
- avoid text below comfortable mobile size;
- tile labels remain short and scannable.

## Depth System

Depth is a hierarchy of attention. Higher depth means closer to the user, not "more decorative everywhere".

| Level | Surface | Behavior |
| --- | --- | --- |
| 0 | Forest background | world, atmosphere, no control affordance |
| 1 | Dividers and quiet symbols | separates, does not invite touch |
| 2 | Quiet panels and lists | readable grouped content |
| 3 | Navigation cards | touchable signs, still secondary |
| 4 | Artifacts and primary oracle objects | physical object, can have press depth |
| 5 | Sheets/modals | temporary layer above the world |

Rule: a Level 3 element must not visually compete with Level 4. This protects the Forest screen hierarchy.

## Decorative Levels

| Level | Allowed Decoration | Examples |
| --- | --- | --- |
| I | text, simple line, focus ring | text button, input, row |
| II | quiet frame, small sign, semantic icon | forest tile, reminder card |
| III | framed CTA, selected chip, sheet edge | primary action, time picker |
| IV | image/media frame, richer divider | book art, result sections |
| V | ornamental artifact frame | reveal card, oracle card |

## State Matrix

Every interactive component must define these states before implementation.

| State | WYRD Behavior |
| --- | --- |
| Default | quiet, readable, role clear |
| Hover | silver becomes clearer; no new hue or layout shift |
| Pressed | object sinks or compresses; shadow shortens; no bounce |
| Focus | visible silver focus ring/outline, keyboard-friendly |
| Selected | shape, position, or fill changes; not color alone |
| Disabled | material fades to ash, shape remains understandable, pointer affordance removed |
| Loading | soft breath or small WYRD mark; avoid generic spinner when possible |
| Success | brief warm reveal of line/sign, then calm |
| Error | muted warning with clear text; avoid theatrical red unless risk requires it |

## Motion Language

WYRD motion is quiet, physical, and role-based.

Rules:
- `140ms` for press feedback and short response;
- `220ms` for control state changes;
- `320ms` for sheets and surface transitions;
- `800ms` only for rare ritual reveal;
- `Breath` invites attention to one primary target, then returns to calm;
- `Reveal` belongs only to a rare card appearance and uses the `800ms` ritual token;
- `Drift` moves only ambient signs by a few pixels and never moves authored card art;
- `Success` reveals the Oracle sign and line once, then stops;
- atmospheric loops: `4-20s`; continuous control motion is reserved for the question-field target spark;
- pressed state: up to `1px` for navigation controls and up to `2px` for deep artifacts;
- no jumpy bounce;
- no attention-grabbing neon glow;
- prefer `transform`, `opacity`, and `clip-path`; exit is shorter than enter;
- all decorative motion must stop under `prefers-reduced-motion: reduce`;
- reduced motion keeps state changes visible through color, outline, position, and text.

## Material Language

WYRD controls are made from:
- dark wood;
- blackened enamel;
- deep resin;
- oxidized folklore silver;
- bone-colored light for text.

WYRD controls are not:
- green plastic;
- glassmorphism;
- glossy SaaS cards;
- bright neon;
- material-design elevation;
- random gemstone frames.

## Light Language

Light has one logic.

- Primary source: top-left or top-center, very soft.
- Lifted surfaces are slightly lighter than the background and have a fine upper edge.
- Silver can become clearer on focus/hover without changing hue.
- Artifacts can have a contact shadow.
- Secondary cards use less light than the hero artifact.
- The center should not glow like a casino button.

## Edge Language

Line endings are part of the brand.

Allowed endings:
- small diamond;
- point;
- fine star;
- branch/leaf ending;
- short notch.

Avoid:
- unrelated icons;
- heavy curls everywhere;
- many different arrows;
- decorative symbols without function.

## Ornament Rules

| Ornament | Use When | Do Not Use When |
| --- | --- | --- |
| Corner branches | Artifact or important media | settings rows, inputs, every tile |
| Diamond/star | divider, central frame sign, step indicator | long text, noisy labels |
| Fern/moon/moth/tracks/acorn | semantic feature symbols | generic decoration |
| Thin divider | section rhythm | every small item |
| No ornament | destructive, quiet, text actions | when hierarchy needs stronger emphasis |

## Spacing Rules

- Base mobile width reference: `393px`.
- Scene content width: around `calc(100% - 32px)`.
- Side padding: `16-24px`.
- Minimum touch target: `44px`.
- Primary CTA height: `52-60px`.
- Forest cards need enough gap that shadows and frames do not merge.
- Do not nest cards inside cards.
- Do not make all blocks equal weight; use depth levels.

## Layout Language

Layout is a shared component contract, not a per-screen decoration.

### Scene Shell

- owns safe-area, page width, background layer and scroll ownership;
- uses a named width variant instead of a new max-width on every screen;
- keeps the reading flow inside one `30rem` shell;
- lets long content grow vertically and never clips primary navigation;
- screen content can use a quieter inner measure without moving the header.

### App Header

- owns Back/Close placement and the centered screen identity;
- Back is anchored to the shell leading inset, never to an arbitrary child card;
- the identity remains optically centered independently of the navigation control;
- related screens use the same shell and header geometry;
- Cover, Forest, Inner and Modal are semantic variants, not separate inventions.

The first runtime proof is the reading cluster: deck, single-card result and
three/five-card spread. Their content may differ, but the Back axis and header
identity must not move between steps.

### Responsive Grid

- `320-430px`: `16px` side margins, `12px` local gap, one content column;
- `431-768px`: `24px` side margins, `16px` gap, adaptive two-column groups;
- `769-1180px`: `32px` side margins, `18-24px` gap, tablet split view where useful;
- `1181px+`: `48-52px` side margins and a `1440px` maximum content shell;
- every range respects `env(safe-area-inset-*)` and keeps interactive targets at `44px+`.

### Pager, Feedback and Empty States

- pager ends are explicit `48px` controls; the current step is a large-plus-small diamond while inactive steps stay quieter;
- weekday choices remain circular and use fill plus contrast for selection;
- Loading, Success, Error and Empty always combine a readable title and explanation with the visual state;
- state changes never resize their container or erase the user's question/data;
- empty states explain what will appear and how it is created rather than showing a decorative blank panel.

### Card Content Roles

- `Artifact`: the primary oracle card with the full approved frame, name, Moon phase and date;
- `Quiet`: paths and supporting images on a quieter surface;
- `Trace`: compact saved-history objects with image, identity and date;
- all three keep their original warm art without grayscale, brightness or saturation filters.

## Minimal Component Set

These components should be sufficient for future screens.

| Component | Built From | Purpose |
| --- | --- | --- |
| Scene Shell | background + safe area + max width | screen environment |
| App Header | brand, title, back action | screen identity |
| Icon Button | Control | back, close, settings, profile |
| Action Button | Control | primary, secondary, quiet, destructive |
| Hero Artifact | Artifact | main oracle action |
| Card Tile | Quiet | feature navigation |
| List Row | Quiet + Control | settings, reminders, select rows |
| Field | Control | text input, textarea, select |
| Choice | Control | segmented, radio, chip, day button |
| Toggle | Control | binary setting |
| Divider | line + diamond/star | rhythm and separation |
| Badge/Status | Control level I-II | small state label only when useful |
| Empty State | Quiet | clear no-data state |
| Loading/Feedback | state pattern | loading, success, error |
| Sheet/Modal | Sheet | temporary focused layer |
| Indicator | Control/Divider | dots, progress, chapter step |

## Simplification Rules

Remove or merge these patterns over time:
- multiple back button styles -> one Icon Button;
- multiple screen headers -> one App Header family;
- separate settings/reminders/select row styles -> one List Row family;
- one-off dividers -> one Divider;
- one-off button classes -> Action Button variants;
- status chips that tell the user what is already obvious;
- new decorative frames for individual screens.

## Accessibility Contract

- Touch targets are at least `44px`.
- Focus states are visible and not color-only.
- Selected state is not color-only.
- Text contrast must stay readable on night surfaces.
- Text should remain readable on mobile and desktop without overlap or tiny labels.
- Component layouts must be responsive by default.
- Inputs have real labels or accessible names.
- Interactive examples must be keyboard-friendly where relevant.
- Sheets/modals use `role="dialog"`, focus trap/return, and a clear close path.
- Reduced motion stops decorative loops and keeps functional state visible.

## Five Visual Signatures

WYRD should be recognizable without the logo through:

1. Thin oxidized-silver line.
2. Central diamond/star.
3. Night surface with cold upper light.
4. Engraved forest symbols.
5. `Forum` caps + `Cormorant Garamond` literary text.

## Implementation Notes

This document is the design-system contract. Next implementation work should:

1. use `docs/WYRD_UI_COMPONENT_MAPPING.md` to map current classes to the component set;
2. use `docs/wyrd-ui-kit.html` as the local review surface before moving a component family into runtime;
3. extract shared tokens instead of tuning per screen;
4. migrate one family at a time;
5. verify each migration with visual, keyboard, touch, responsive, contrast, and reduced-motion checks.

Do not use this document as permission to redesign all screens at once.
