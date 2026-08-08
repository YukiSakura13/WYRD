# WYRD UI Component Mapping

Issue: YUK-135

This document maps current runtime selectors to the component families defined in `docs/WYRD_UI_FOUNDATIONS.md`. It is a migration map, not a redesign brief.

## Rules

- Read and follow `docs/WYRD_SILVER_MIGRATION_PROTOCOL.md` before changing a
  legacy gold screen.
- Treat the approved local Silver UI Kit as an executable 1:1 contract, not as
  inspiration.
- Reuse canonical markup, classes, assets, states, and event logic wherever they
  already exist.
- Do not change visuals just because a selector is listed here.
- Do not rename classes in bulk without screenshots and interaction checks.
- Migrate one component family at a time.
- Preserve current screen behavior, accessible names, state, and navigation.
- Local visual experiments are not canonical until explicitly approved and committed.

## Component Families

| Foundation Component | Current Selector Families | Frame/Material | Notes |
| --- | --- | --- | --- |
| Scene Shell | `#cover`, `.forest-home`, `.forest-placeholder`, `.settings-screen`, `.about-you-screen`, `.reminders-screen`, `.app-info-screen`, `.spirit-book`, `.ritual-onboarding`, `.deck-scene`, `#result`, `#spread-result`, `#profile` | background/world | Canonical runtime classes start with `.ui-scene-shell`; Deck, Result and both Spread states share the same cold silver scene background and suppress legacy fog/stars. |
| App Header | `.hdr`, `.forest-brand`, `.settings-header`, `.deck-header`, `.screen-nav`, `.ritual-content` brand group | divider + typography | Canonical runtime classes start with `.ui-app-header`; the header owns the Back axis and centered identity. Deck, result and spread are the first proof cluster. |
| Navigation Icon Button | `.ui-icon-button`, with `.btn-back-circle`, `.deck-back`, `.spread-card-modal-close`, `.save-screen-close`, `.history-sheet-close` retained as screen aliases | Control | Canonical runtime family: 48px hit area and shared state behavior. The Deck-only `.ui-icon-button--quiet-reading` modifier keeps that hit area while reducing the visible disc to 40px and the Back glyph to 24px. App Header owns placement; screen aliases own routing only. |
| Pager Icon Button | `.ui-pager-button` with `.spirit-book-arrow` retained as a screen alias | Control | Implemented: 48px target, short SVG chevron, shared focus/pressed/disabled behavior. |
| Utility Icon Button | `.forest-avatar-btn`, `.forest-settings-btn` | Control | Existing approved Forest controls. Normalize against shared ergonomics without replacing their semantic icons. |
| Utility Action | `.wyrd-utility-action`, with `[data-action="share-card"]` as the first runtime proof | Control | Implemented target: familiar network Share icon + label inside a thin silver contour. No trailing diamond, ritual end sections, or nested ornament; dimensions remain stable in every state. |
| Action Button | `.ui-action`, `.wyrd-action-frame`, `.wyrd-cover-invitation`, `.cover-btn`, `.cover-cta-button`, `.ritual-btn`, `.about-save`, `.hook-btn`, `.spread-continuation-btn`, `.spread-continuation-link`, `.reading-new-question-link`, `.profile-primary-action`, `.about-unsaved-primary`, `.about-unsaved-secondary`, `.about-unsaved-quiet`, `.reminders-sheet-primary`, `.reminders-sheet-secondary`, `.reminders-disable`, `.save-screen-link` | Control | Cover Invitation is the single full Hero invitation with shared motion. Reading continuation uses the same Secondary frame for 1→3 and 3→5; reading reset is unframed on those two surfaces and uses the Quiet / Minimal frame as the sole final action after five cards. |
| Hero Artifact | `.forest-card`, `.forest-card--daily`, `.deck-card`, `.share-card.card-box`, `.card-box`, `.save-screen-art` | Artifact | Main ritual objects. This family may carry the richest frame and depth, but only where hierarchy demands it. |
| Card Tile | `.forest-tile`, `.forest-tile--lunar`, `.forest-tile--yes-no`, `.forest-tile--night`, `.forest-tile--traces`, `.forest-tile--book`, `.gift-card`, `.history-item`, `.profile-today-card` | Quiet | Secondary signs and traces. They must stay quieter than Hero Artifact. |
| List Row | `.ui-row-action`, `.settings-row`, `.reminders-row`, `.about-select-row`, `.app-info-row` | Quiet + Control | Interactive settings/reminders rows use one runtime contract. Static rows keep the same layout without action semantics. |
| Field | `.wyrd-question-field`, `.deck-question-shell`, `.deck-question-input`, `.about-field input`, `.about-select-row select`, `.reminders-time-picker select` | Control | Canonical question textarea is implemented: 12px rectangular double contour, 92px minimum height, Bone copy, and one continuous restrained silver orbit. Remaining text/select fields migrate by screen. |
| Choice | `.ui-choice`, `.ui-page-choice`, `.about-segmented`, `.about-segment`, `.reminders-days`, `.reminders-day`, `.spirit-book-dot` | Control | Implemented 44px target and selected-state rules. Not every choice needs a visible frame. |
| Toggle | `.settings-toggle` inside `.settings-row--toggle` / `.reminders-row--toggle` | Control | Toggle is one control reused in settings and notifications. The familiar pill track remains; the knob uses the approved large-plus-small diamond. State is visible by knob position, fill, and contrast. |
| Divider | `.hdr-line`, `.forest-brand-divider`, `.settings-rule`, `.deck-brand-line`, `.screen-brand-line`, `.card-divider`, `.hook-divider`, `.ritual-divider`, `.history-sheet-divider`, `.about-title-rule`, `.gift-divider` | Divider | Standardize into one line/sign/line language with quieter and richer variants. |
| Sheet / Modal | `.about-unsaved-sheet`, `.about-unsaved-panel`, `.reminders-sheet`, `.reminders-sheet-panel`, `.spread-card-modal`, `.spread-card-modal-panel`, `.history-sheet`, `.history-sheet-inner`, `.save-screen`, `.save-screen-inner` | Sheet | All temporary overlays share one controller for backdrop, `inert`, scroll lock, `visualViewport`, focus trap/return, Escape, transition-led close and action placement. Only History exposes handle drag. |
| Feedback / Status | `.share-feedback`, `.about-save-status`, `.deck-question-status`, `.save-screen-loading`, `.history-empty-state`, `.forest-placeholder-panel`, `.oracle-voice`, `.result-question`, `.wyrd-notification` | Quiet / state | Feedback is explicit, readable and calm. Native notifications update the same ID atomically and place polite/assertive semantics on the item, never on the shared root. Avoid making every status a decorative card. |
| Media Frame | `.spirit-book-art`, `.share-card-media`, `.history-sheet-card`, `.spread-detail-card`, `.spread-card-modal-image`, `.gift-card-face` | Artifact or Quiet | Media frames depend on importance. Result card and book art are richer; history/list media stays quieter. |

## Runtime Status — Control Language v2

| Foundation Component | Canonical runtime class | Current aliases | Status |
| --- | --- | --- | --- |
| Navigation Icon Button | `.ui-icon-button` | Back/Close aliases | implemented |
| Pager Icon Button | `.ui-pager-button` | `.spirit-book-arrow` | implemented |
| Page Choice | `.ui-page-choice` | `.spirit-book-dot` | implemented |
| Action Button | `.ui-action` + `.wyrd-action-frame`; `.wyrd-cover-invitation`; `.reading-new-question-link` | screen-specific action classes | Cover Invitation, Secondary reading continuation, quiet unframed reset and the final Quiet / Minimal reset share their exact Kit/runtime code |
| Utility Action | `.wyrd-utility-action` | `[data-action="share-card"]` | implemented in UI Kit and result proof cluster; 52px stable geometry |
| Question Field | `.wyrd-question-field` / runtime field aliases | `.deck-question-shell`, `.deck-question-input` | implemented in UI Kit and deck proof cluster; continuous restrained silver orbit with reduced-motion fallback |
| Deck Composition | `.wyrd-deck-composition` / runtime Deck aliases | `.deck-header`, `.deck-question-zone`, `.deck-card-zone`, `.deck-card` | approved full-height four-row scene, quiet 48/40/24 Back, Field capped at 320px and narrowed with the hero on constrained heights, 17–24px Field→Artifact air, responsive 322–344px Raven Artifact, bottom whisper, directional contact depth, distinct rear-card edges, rare 7200ms 2px idle answer, measured 800ms silver intent thread, and reduced-motion fallback |
| Artifact Card Frame | transparent SVG overlay | `.card-frame` | approved symmetric master implemented in UI Kit and result proof cluster |
| Row Action | `.ui-row-action` | `.settings-row`, `.reminders-row` | interaction contract implemented; visual aliases migrate by screen |
| Choice Control | `.ui-choice` | avatar, segment, day and toggle aliases | implemented |
| Card Action | `.ui-card-action` | Forest, deck, spread, history and gift aliases | implemented |

See `docs/WYRD_CONTROL_INVENTORY.md` for routes, state ownership and deferred visual work.

### UI Kit interaction coverage

The interactive documentation now includes the useful systems retained from the donated source kit, expressed through the approved WYRD language rather than copied as a skin:

- ritual Action Button inspector: family filter plus Default, Hover, Pressed, Focus and Disabled;
- Navigation, Avatar and Settings icon controls;
- continuous question-field target spark and the real product placeholder;
- circular day choices and the large-plus-small diamond toggle in On, Off, Focus and Disabled states;
- frequent Action and Row/Sheet examples;
- App Header anatomy and the responsive/safe-area grid;
- working Pager/Indicator controls and circular weekday selection;
- interactive Loading, Success, Error and Empty feedback states;
- Artifact, Quiet and Trace card roles with unfiltered warm artwork;
- an on-demand Motion Lab for `140/220/320/800ms` plus reduced-motion preview.
- a replayable Result Reveal specimen for Artifact → Message → Shadow, including
  the one-shot partial frame glint and immediate reduced-motion final state.

This table records architecture only. The generic runtime families intentionally define no surface, frame, shadow, ornament or component radius; those properties belong to a later approved WYRD theme layer.

## Screen-by-Screen Mapping

### Forest

| Current | Foundation Component | Notes |
| --- | --- | --- |
| `.forest-home`, `.forest-shell` | Scene Shell | Owns forest background and mobile column. |
| `.forest-topbar` | App Header / Icon Button group | Contains profile and settings icon buttons. |
| `.forest-avatar-btn`, `.forest-settings-btn` | Icon Button | Should share with back/close icon rules, with circular variant. |
| `.forest-brand` | App Header | Brand-only header variant. |
| `.forest-card` | Hero Artifact | Main Level 4 object. Do not let tiles match its weight. |
| `.forest-tile` | Card Tile | Level 3 navigation signs. |
| `.forest-tile-marker`, `.forest-moon-spark` | Ornament / Feedback | Decoration must stay semantic and quiet. |
| `.forest-placeholder-panel` | Empty State | Quiet frame, not a new page style. |

### Settings / Profile / Notifications

| Current | Foundation Component | Notes |
| --- | --- | --- |
| `.settings-screen`, `.about-you-screen`, `.reminders-screen`, `.app-info-screen` | Scene Shell | Same shell with background and safe area. |
| `.settings-header` | App Header | Title header variant. |
| `.settings-row`, `.reminders-row` | List Row | Entry/toggle/time/static variants. |
| `.settings-toggle` | Toggle | Shared toggle. |
| `.about-field input` | Field | Name field. |
| `.about-segmented`, `.about-segment` | Choice | Segmented radio. |
| `.about-select-row` | List Row + Field | Row layout containing select control. |
| `.reminders-day` | Choice | Day chip; selected must be color + fill/shape. |
| `.about-save`, `.reminders-disable` | Action Button | Primary/destructive variants. |
| `.about-unsaved-sheet`, `.reminders-sheet` | Sheet / Modal | Same bottom-sheet family. |

### Cover / Deck / Ritual / Result / Spread

| Current | Foundation Component | Notes |
| --- | --- | --- |
| `.cover-cta-button.wyrd-cover-invitation` | Cover Invitation | Full Hero ornament with the shared 60px geometry, 6.8s breath/trace, contained fireflies, softened magnetic pointer response, focus, 1px press and reduced-motion fallback. It is the only active owner of this mechanic. |
| `.deck-scene`, `#result`, `#spread-result` + `.ui-scene-shell--oracle` | Scene Shell | One shell width and safe-area axis for the complete reading flow. |
| `.deck-header`, `.screen-nav` + `.ui-app-header` | App Header | Back-only 72px reading header; the WYRD lockup remains reserved for Cover and Forest. |
| `.deck-back`, `.btn-back-circle` | Icon Button | Shared 48px behavior and focus; Deck uses the quiet 40px-disc / 24px-glyph reading modifier while App Header owns placement. |
| `.deck-question-shell`, `.deck-question-input` | Field | Centered Silver Field capped at 320px and narrowed with the Artifact on constrained heights: rectangular double contour, Bone text, continuous target orbit, no focus or typing restart. |
| `.deck-card` | Hero Artifact | 3:4 Raven object uses `min(86vw, 43svh, 344px)` with a compact short-height rule and 17–24px real Field gap; directional contact shadow and distinct rear edges establish resting depth; rare 7200ms 2px idle answer and partial silver edge glint, measured 800ms intent thread, slight stack separation, 1px press, no scale pulse or full halo. |
| `.deck-touch-copy` | Text/Ghost Action | Secondary draw affordance. |
| `.share-card.card-box`, `.card-frame` | Hero Artifact / Media Frame | Result oracle card and native Share PNG are one canonical `1086×1448` Artifact: dark surface, unfiltered `3:4` image at `61.5%` width / `11.5%` top, identity at `9.25%` bottom, `8px` title-to-meta and `4px` phase-to-date rhythm, silver moon phase and full date beneath the approved transparent symmetric frame. A static `4-6%` cold light-well and directional contact shadow belong to the surrounding space, not to a glowing frame. Its one-shot Result Reveal is `800ms`, settles by at most `2px`, and carries one partial frame glint before becoming fully still. Story export contains this same Artifact and adds no gold export-only chrome. |
| `.result-question` | Feedback / Quiet info | Question context; no heavy card. For a real question, the sentence-case label is `12px / 400 / 42%` with no added tracking and stays perceptually quieter than the `17px / 500 / 96%` actual question. With no typed question the label is hidden and only the quiet fallback remains beside the rail. |
| `.card-message-block`, `.card-shadow-block` | Quiet content blocks | Interpretation sections share one `1px / 26%` cold-silver rail with a `16px` inset, not a new card frame. Result order is Artifact → Message → Shadow; Shadow follows Message with a short stagger and is not reduced to disabled-like contrast. |
| `.hook-btn.wyrd-action-frame--secondary` | Secondary Action | «Раскрыть три карты» uses the same Reduced frame as the next reading expansion. |
| `[data-action="share-card"].wyrd-utility-action` | Utility Action | Implemented approved utility pattern: familiar network Share icon + label + thin silver contour, without a trailing diamond. Loading text does not alter the outer dimensions. |
| `.spread-continuation-btn.wyrd-action-frame--secondary` | Secondary Action | «Раскрыть пять карт» repeats the exact 1→3 continuation visual; after the five-card reading the same control becomes the Quiet / Minimal framed «Новый вопрос». |
| `.reading-new-question-link` | Quiet/Text Action | Unframed 44px reset action beneath the one- and three-card continuation; hidden after five cards. |
| `.hook-block`, `.spread-continuation`, `.oracle-voice` | Feedback / CTA block | Needs Quiet frame or no frame depending on hierarchy. |
| `.spread-card` | Media Frame / Card Tile | Spread cards with anchor variant. |
| `.spread-card-modal` | Sheet / Modal | Focused card inspection. |

### Spirit Book / History

| Current | Foundation Component | Notes |
| --- | --- | --- |
| `.spirit-book` | Scene Shell | Story scene shell. |
| `.spirit-book-art` | Media Frame | Rich media frame, not general card style. |
| `.spirit-book-controls`, `.spirit-book-arrow`, `.spirit-book-dot` | Indicator + Icon Button + Choice | Dots are indicators/choice, arrows are icon buttons. |
| `.history-item` | Card Tile / Trace | Opens a stored trace. |
| `.history-sheet` | Sheet / Modal | Detail layer. |
| `.gift-card` | Card Tile / Trace Artifact | Small collectible object; should not overtake main artifact. |

## Migration Order

### Phase 1: Documentation and aliases

No visual changes.

1. Keep current classes.
2. Add comments or documentation mapping current classes to foundation components.
3. Define shared token names for frame, focus, radius, state, and motion.

### Phase 2: Low-risk shared behavior

Small implementation changes with screenshots.

1. Icon Button: align focus/touch states for back, close, profile, settings.
2. Action Button: unify disabled, focus, loading, destructive, quiet variants.
3. List Row: align settings/reminders/about select rows.
4. Field: align input/textarea/select focus and validation states.

### Phase 3: Visual hierarchy

Requires visual approval before commit.

1. Hero Artifact: establish approved card/deck object treatment.
2. Card Tile: make tiles quietly touchable without matching hero weight.
3. Media Frame: align result card, book art, and history media hierarchy.
4. Sheets: unify bottom sheets and modal surfaces.

## Known Consolidation Targets

| Current Duplication | Target |
| --- | --- |
| `.btn-back-circle`, `.deck-back`, `.about-back`, close buttons | Icon Button |
| `.settings-header`, `.deck-header`, `.screen-nav`, `.forest-brand` | App Header |
| `.settings-row`, `.reminders-row`, `.about-select-row` | List Row |
| `.about-save`, `.cover-btn`, `.ritual-btn`, `.btn-share`, sheet action buttons | Action Button |
| `.about-unsaved-sheet`, `.reminders-sheet`, `.spread-card-modal`, `.history-sheet`, `.save-screen` | Sheet / Modal |
| many divider classes | Divider |

## What Not To Do

- Do not make all cards as dimensional as the Forest Hero Card.
- Do not add a fifth frame family for a single screen.
- Do not turn every content section into a card.
- Do not use status chips when the user already knows the status.
- Do not solve affordance by adding noisy backgrounds under decorative frames.
- Do not migrate class names before visual and interaction behavior is stable.

## Acceptance Checklist For A Future Migration

Before merging a component-family migration, complete the full restoration
checklist in `docs/WYRD_SILVER_MIGRATION_PROTOCOL.md` and confirm:

- screenshots cover mobile `393px`, narrow mobile, and at least one desktop/tablet viewport;
- no horizontal overflow;
- keyboard focus is visible;
- touch targets are `44px+`;
- selected/disabled/error states are not color-only;
- reduced motion preserves usability;
- main depth hierarchy still reads: Forest background < tiles < hero artifact < sheet.
