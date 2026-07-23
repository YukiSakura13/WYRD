# WYRD Silver Migration — Restoration Protocol

Issue: YUK-135

Status: mandatory for every legacy gold → approved silver screen migration.

## Contract

The approved Silver UI Kit is not inspiration and is not a collection of ideas.
It is the executable contract for the migrated interface.

For every new screen, Codex works as a restorer:

> Preserve the screen's product meaning and replace its legacy presentation with
> the already approved silver components and mechanics 1:1. Do not redraw,
> reinterpret, simplify, embellish, or invent behavior during migration.

`1:1` means the same approved:

- geometry, proportions, and component family;
- default, hover, focus-visible, pressed, selected, disabled, loading, success,
  error, and empty behavior wherever those states apply;
- keyboard flow, accessible names, focus trap, focus return, and Escape/backdrop
  behavior;
- timing, easing, replay rules, and reduced-motion fallback;
- responsive reflow, safe-area behavior, and `44×44px` minimum targets;
- copy, metadata structure, icon meaning, and authored card colors.

It does **not** mean copying an old gold component, a rejected experiment, or
every visual choice from the external source kit. The current local Silver UI
Kit contains the approved WYRD adaptation and is the canonical target.

## Canonical read order

Read these sources completely before editing a migrated screen:

1. [`docs/wyrd-ui-kit.html`](./wyrd-ui-kit.html) — live behavior and approved
   specimens; interact with the relevant block, do not only inspect a screenshot.
2. [`docs/wyrd-ui-kit.css`](./wyrd-ui-kit.css) and
   [`docs/wyrd-ui-kit.js`](./wyrd-ui-kit.js) — exact visual and interaction
   implementation.
3. [`docs/WYRD_UI_FOUNDATIONS.md`](./WYRD_UI_FOUNDATIONS.md) — tokens, roles,
   state and motion contracts.
4. [`docs/WYRD_UI_COMPONENT_MAPPING.md`](./WYRD_UI_COMPONENT_MAPPING.md) and
   [`docs/WYRD_CONTROL_INVENTORY.md`](./WYRD_CONTROL_INVENTORY.md) — mapping
   between runtime screens and canonical families.
5. The linked Linear issue — screen scope, acceptance criteria, dependencies,
   and approved exceptions.

The external source kit may be re-opened only to verify the mechanics that were
deliberately retained in the approved local kit. It is not a second visual
source of truth.

## Required workflow for each screen

### 1. Preflight

- confirm the matching Linear issue and move it to `In Progress`;
- open the current Silver UI Kit in a real browser;
- exercise every relevant specimen with pointer and keyboard;
- inspect the narrow-mobile form, not only desktop;
- list the legacy controls, containers, cards, feedback, and navigation used by
  the screen.

### 2. Restoration map

Before code changes, map every legacy element to a canonical component:

| Legacy role | Canonical target | Mechanics to preserve |
| --- | --- | --- |
| Back / Close / Profile / Settings | Icon Control family | hit area, focus, pressed, semantic icon |
| Primary / secondary / quiet action | Hero / Secondary / Compact / Quiet or Utility Action | exact approved family and state matrix |
| Text field / question | Field / Question Field | label, counter, focus, spark, reduced motion |
| Toggle / choice / day | Toggle / Choice / Day Chip | full hit row, selection, glow, keyboard |
| Page / chapter navigation | Pager | quiet nested diamonds, explicit ends, disabled state |
| Loading / success / error / empty | Feedback | Oracle owl, state copy, border and calm motion |
| Card / history / supporting image | Artifact / Quiet / Trace | authored art, aspect ratio, metadata and action semantics |
| Modal / sheet | Sheet | backdrop, focus trap, Escape, close and focus return |

If no canonical target exists, stop. Propose the missing component for approval
and add it to the UI Kit first. Do not solve the gap inside one screen.

### 3. Implementation

- reuse existing canonical markup, classes, SVG, tokens, and event logic;
- preserve screen routes, content, state, data, and authored image colors;
- remove legacy gold presentation only within the approved scope;
- keep component dimensions stable between states;
- make no new ornament, connector, glow, transition, or microcopy;
- keep one semantic interactive owner for each action.

### 4. Restoration QA

Verify the migrated screen against the live UI Kit side by side:

- [ ] relevant component geometry matches the canonical specimen;
- [ ] all applicable states are visibly distinct without layout shift;
- [ ] keyboard order, focus-visible, activation, Escape, focus trap, and focus
      return match the canonical mechanic;
- [ ] selected and disabled states do not rely on color alone;
- [ ] motion tokens and replay rules match; reduced motion preserves meaning;
- [ ] pointer and touch areas are at least `44×44px`;
- [ ] no horizontal overflow at `320`, `375`, `393`, `430`, and `768px`;
- [ ] at least one representative landscape viewport is checked;
- [ ] safe-area behavior remains valid for the screen shell;
- [ ] card art keeps its authored color and required aspect ratio;
- [ ] production copy and metadata use the approved structure;
- [ ] browser console and relevant automated checks are clean;
- [ ] before/after screenshots and interaction evidence are attached to Linear.

### 5. Approval and completion

- present the complete migrated screen for visual and interaction review;
- do not commit or push before explicit user approval;
- after approval, run the release checklist, commit only the reviewed scope, and
  publish;
- record the commit, deploy, checks, screenshots, remaining platform gaps, and
  follow-ups in Linear;
- mark the screen issue `Done` only when its full acceptance criteria are
  verified.

## Forbidden shortcuts

- treating the UI Kit as a moodboard;
- approximating a mechanic from memory or a static screenshot;
- inventing a locally convenient variant;
- changing component geometry between states;
- copying the external kit without the approved WYRD adaptations;
- returning gold to a migrated component;
- making a screen-specific fix that bypasses the canonical component;
- declaring completion without keyboard, responsive, reduced-motion, and
  interaction evidence.

## Linear acceptance block

Copy this block into every silver-migration issue:

```markdown
### Restoration-first acceptance

- [ ] Read `docs/WYRD_SILVER_MIGRATION_PROTOCOL.md` and the current live Silver UI Kit before implementation.
- [ ] Map every legacy control to a canonical component before editing.
- [ ] Reuse approved geometry and mechanics 1:1; no screen-local redesign or invented behavior.
- [ ] Verify all applicable states, keyboard/focus, reduced motion, 44px targets, responsive reflow, safe area, and authored card colors.
- [ ] Attach side-by-side visual and interaction evidence.
- [ ] Record every approved exception in the UI Kit and Foundations before using it in runtime.
```

This block is a release gate, not an optional note.
