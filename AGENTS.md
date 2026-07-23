# WYRD repository instructions

Build with accessibility and usability in mind.

Priorities:

- accessibility first;
- responsive design by default;
- high readability and strong contrast;
- clear visual hierarchy;
- keyboard-friendly interactions where relevant;
- no tiny text, low-contrast UI, or clutter.

When working with images, icons, or other assets:

- preserve authored card colors and proportions;
- prefer the smallest file size without visible quality loss;
- prefer WebP when supported and PNG only when compatibility requires it;
- optimize for performance and clarity.

General engineering approach:

- prefer efficient, practical, robust implementations;
- avoid overengineering and unapproved visual invention;
- keep active work linked to the matching Linear issue.

## Mandatory silver-migration preflight

Before changing any screen from the legacy gold theme to the approved silver
theme, read the complete
[`docs/WYRD_SILVER_MIGRATION_PROTOCOL.md`](docs/WYRD_SILVER_MIGRATION_PROTOCOL.md)
and the canonical sources it names.

The approved Silver UI Kit is an implementation contract, not a moodboard:

- restore its relevant component geometry, states, motion, keyboard behavior,
  focus management, responsive behavior, and copy rules **1:1**;
- reuse the canonical component, asset, class, and interaction code whenever it
  exists instead of redrawing or approximating it;
- use the legacy screen only for product content, routes, state, and screen
  anatomy that the migration must preserve;
- do not invent, simplify, or replace a mechanic during a screen migration;
- do not copy rejected gold styling or previously rejected experiments;
- any deliberate deviation requires explicit user approval and an update to the
  canonical kit before it is applied to a runtime screen.

The matching Linear issue must stay `In Progress` until the per-screen
restoration checklist and evidence in the migration protocol are complete.

Do not commit or push visual migration work before the user explicitly approves
the reviewed result.
