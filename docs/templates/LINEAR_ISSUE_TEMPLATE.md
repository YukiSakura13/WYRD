# WYRD Linear issue template

Use this template in Linear before development starts. The canonical checklist is
[WYRD — Definition of Ready & Done](https://linear.app/yukisakura/document/wyrd-definition-of-ready-and-done-2026d3d254c7).

```markdown
## Outcome

Describe the observable user or developer result.

## Acceptance criteria

- [ ] Write measurable completion criteria.

### Silver migration only — restoration-first acceptance

- [ ] Read `docs/WYRD_SILVER_MIGRATION_PROTOCOL.md` and the current live Silver UI Kit before implementation.
- [ ] Map every legacy control to a canonical component before editing.
- [ ] Reuse approved geometry and mechanics 1:1; no screen-local redesign or invented behavior.
- [ ] Verify all applicable states, keyboard/focus, reduced motion, 44px targets, responsive reflow, safe area, and authored card colors.
- [ ] Attach side-by-side visual and interaction evidence.
- [ ] Record every approved exception in the UI Kit and Foundations before using it in runtime.

## Scope

- Priority: P0 / P1 / P2
- Release scope: MVP / Post-MVP
- Layers: UI / responsive / state / content / audio / AI / PWA / Telegram / backend / security / documentation
- Out of scope: name nearby work that is intentionally excluded

## Dependencies

- Blocked by: none / YUK-123
- Blocks: none / YUK-123
- Related: none / YUK-123
- Duplicate check: Linear search, GitHub branches, and open/closed PRs checked

## Test plan

- [ ] Domain, unit, or integration checks for the affected layer
- [ ] Required viewports and platforms for visual work
- [ ] Keyboard, touch, screen reader, contrast, and reduced-motion checks where applicable
- [ ] Error, offline, reload, migration, and fallback paths where applicable
- [ ] Artifact validation, staging, deploy, and production evidence

## Completion report

- Change:
- Evidence:
- Deploy:
- Risks:
- Follow-ups: none with a reason / YUK-123
- Dependencies updated: yes / not applicable
```

Required Linear fields: priority, milestone, parent, labels, assignee, and dependency relations.
Move the task to `In Progress` only after the Ready checklist passes, and to `Done` only after the completion report and follow-ups are recorded.
