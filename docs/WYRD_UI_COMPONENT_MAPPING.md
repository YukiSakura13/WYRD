# WYRD UI Component Mapping

Issue: YUK-135

This document maps current runtime selectors to the component families defined in `docs/WYRD_UI_FOUNDATIONS.md`. It is a migration map, not a redesign brief.

## Rules

- Do not change visuals just because a selector is listed here.
- Do not rename classes in bulk without screenshots and interaction checks.
- Migrate one component family at a time.
- Preserve current screen behavior, accessible names, state, and navigation.
- Local visual experiments are not canonical until explicitly approved and committed.

## Component Families

| Foundation Component | Current Selector Families | Frame/Material | Notes |
| --- | --- | --- | --- |
| Scene Shell | `#cover`, `.forest-home`, `.forest-placeholder`, `.settings-screen`, `.about-you-screen`, `.reminders-screen`, `.app-info-screen`, `.spirit-book`, `.about-wyrd`, `.ritual-onboarding`, `.deck-scene`, `#result`, `#spread-result`, `#profile` | background/world | One scene shell contract should own forest background, safe areas, max width, scroll behavior, and hidden state. |
| App Header | `.hdr`, `.forest-brand`, `.settings-header`, `.deck-header`, `.screen-nav`, `.about-wyrd-nav`, `.about-hero`, `.ritual-content` brand group | divider + typography | These are visually related but implemented per screen. Consolidate conceptually before touching CSS. |
| Icon Button | `.btn-back-circle`, `.deck-back`, `.about-back`, `.forest-avatar-btn`, `.forest-settings-btn`, `.spirit-book-arrow`, `.spread-card-modal-close`, `.save-screen-close`, `.history-sheet-close` | Control | Back, close, profile, settings, and chapter arrows should share sizing, focus, and state rules. Icons can differ. |
| Action Button | `.ui-action`, `.cover-btn`, `.cover-cta-button`, `.ritual-btn`, `.about-save`, `.btn-share`, `.hook-btn`, `.spread-continuation-btn`, `.spread-continuation-link`, `.profile-primary-action`, `.about-unsaved-primary`, `.about-unsaved-secondary`, `.about-unsaved-quiet`, `.reminders-sheet-primary`, `.reminders-sheet-secondary`, `.reminders-disable`, `.about-replay`, `.save-screen-link` | Control | Use one action system with variants: primary, secondary, quiet, destructive. Current classes can stay as screen aliases. |
| Hero Artifact | `.forest-card`, `.forest-card--daily`, `.deck-card`, `.share-card.card-box`, `.card-box`, `.save-screen-art` | Artifact | Main ritual objects. This family may carry the richest frame and depth, but only where hierarchy demands it. |
| Card Tile | `.forest-tile`, `.forest-tile--lunar`, `.forest-tile--yes-no`, `.forest-tile--night`, `.forest-tile--traces`, `.forest-tile--book`, `.gift-card`, `.history-item`, `.profile-today-card` | Quiet | Secondary signs and traces. They must stay quieter than Hero Artifact. |
| List Row | `.settings-row`, `.reminders-row`, `.about-select-row`, `.app-info-row` | Quiet + Control | Settings, reminders, and select rows are one row component with variants: entry, toggle, time, static. |
| Field | `.deck-question-shell`, `.deck-question-input`, `.about-field input`, `.about-select-row select`, `.reminders-time-picker select` | Control | Textarea, text input, select, and time picker need one field contract for focus, disabled, validation, and labels. |
| Choice | `.about-segmented`, `.about-segment`, `.reminders-days`, `.reminders-day`, `.spirit-book-dot` | Control | Segments, chips, day buttons, and dots use selected-state rules. Not every choice needs a visible frame. |
| Toggle | `.settings-toggle` inside `.settings-row--toggle` / `.reminders-row--toggle` | Control | Toggle is one control reused in settings and notifications. State must be visible by knob position and color. |
| Divider | `.hdr-line`, `.forest-brand-divider`, `.settings-rule`, `.deck-brand-line`, `.screen-brand-line`, `.card-divider`, `.hook-divider`, `.ritual-divider`, `.history-sheet-divider`, `.about-title-rule`, `.gift-divider` | Divider | Standardize into one line/sign/line language with quieter and richer variants. |
| Sheet / Modal | `.about-unsaved-sheet`, `.about-unsaved-panel`, `.reminders-sheet`, `.reminders-sheet-panel`, `.spread-card-modal`, `.spread-card-modal-panel`, `.history-sheet`, `.history-sheet-inner`, `.save-screen`, `.save-screen-inner` | Sheet | All temporary overlays should share backdrop, layer, focus, close, and action placement rules. |
| Feedback / Status | `.share-feedback`, `.about-save-status`, `.deck-question-status`, `.save-screen-loading`, `.history-empty-state`, `.forest-placeholder-panel`, `.oracle-voice`, `.result-question` | Quiet / state | Feedback should be explicit, readable, and calm. Avoid making every status a decorative card. |
| Media Frame | `.spirit-book-art`, `.share-card-media`, `.history-sheet-card`, `.spread-detail-card`, `.spread-card-modal-image`, `.gift-card-face` | Artifact or Quiet | Media frames depend on importance. Result card and book art are richer; history/list media stays quieter. |

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

### Deck / Ritual / Result / Spread

| Current | Foundation Component | Notes |
| --- | --- | --- |
| `.deck-scene` | Scene Shell | Ritual environment. |
| `.deck-header`, `.screen-nav` | App Header | Same brand/header language. |
| `.deck-back`, `.btn-back-circle` | Icon Button | Merge behavior and focus. |
| `.deck-question-shell`, `.deck-question-input` | Field | Question field; animation is state, not a separate component. |
| `.deck-card` | Hero Artifact | Main ritual object. |
| `.deck-touch-copy` | Text/Ghost Action | Secondary draw affordance. |
| `.share-card.card-box` | Hero Artifact / Media Frame | Result oracle card. |
| `.result-question` | Feedback / Quiet info | Question context; no heavy card. |
| `.card-message-block`, `.card-shadow-block` | Quiet content blocks | Interpretation sections, not new card frames. |
| `.hook-block`, `.spread-continuation`, `.oracle-voice` | Feedback / CTA block | Needs Quiet frame or no frame depending on hierarchy. |
| `.spread-card` | Media Frame / Card Tile | Spread cards with anchor variant. |
| `.spread-card-modal` | Sheet / Modal | Focused card inspection. |

### Spirit Book / About WYRD / History

| Current | Foundation Component | Notes |
| --- | --- | --- |
| `.spirit-book` | Scene Shell | Story scene shell. |
| `.spirit-book-art` | Media Frame | Rich media frame, not general card style. |
| `.spirit-book-controls`, `.spirit-book-arrow`, `.spirit-book-dot` | Indicator + Icon Button + Choice | Dots are indicators/choice, arrows are icon buttons. |
| `.about-wyrd` | Scene Shell | Long reading surface. |
| `.about-toc-link` | Text Action / List Row | Navigation links, not decorative cards. |
| `.about-section` | Quiet content section | Should avoid card-in-card. |
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

Before merging a component-family migration:

- screenshots cover mobile `393px`, narrow mobile, and at least one desktop/tablet viewport;
- no horizontal overflow;
- keyboard focus is visible;
- touch targets are `44px+`;
- selected/disabled/error states are not color-only;
- reduced motion preserves usability;
- main depth hierarchy still reads: Forest background < tiles < hero artifact < sheet.
