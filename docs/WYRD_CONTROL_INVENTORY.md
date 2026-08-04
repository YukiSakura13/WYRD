# WYRD Control Inventory

Issue: YUK-135

This inventory is the runtime source of truth before screen-by-screen silver migration. It records one semantic owner for every active control family while preserving existing routes and screen composition.

## Layer Boundary

The saved layer is architecture only: semantic family, target geometry, layout ownership, focus, pressed, disabled and reduced-motion behavior. Generic control classes do not define surface color, frame, shadow, ornament or component radius. Those decisions belong to a separate WYRD silver theme pass and require visual approval before entering runtime.

## Canonical Families

| Family | Canonical class | Runtime owners | State |
| --- | --- | --- | --- |
| Navigation Icon Button | `.ui-icon-button` | every Back and Close control | implemented |
| Pager Icon Button | `.ui-pager-button` | previous/next chapter in Spirit Book | implemented |
| Page Choice | `.ui-page-choice` | five Spirit Book chapter dots | implemented |
| Action Button | `.ui-action` + role modifier | save, confirm, cancel, continue, destructive and quiet actions | implemented contract; Cover Invitation and reading completion roles are canonical |
| Row Action | `.ui-row-action` | Settings entries/toggles and Notifications time/toggles | implemented contract; screen color migrates later |
| Choice Control | `.ui-choice` | profile avatars/pronouns, notification days/toggles, Forest utilities | implemented contract; screen color migrates later |
| Card Action | `.ui-card-action` | Forest paths, deck, spread cards, history traces and gifts | implemented contract; art treatment remains screen-owned |

## Route Ownership

| Surface | Controls | Route/state owner | Notes |
| --- | --- | --- | --- |
| Cover | Enter action | `data-action="enter"` | `.wyrd-cover-invitation` owns the approved full Hero geometry and exact breath, contained-firefly, magnetic, focus, press and reduced-motion mechanics shared with the Kit. |
| Forest | Profile, Settings, six path actions | `assets/js/ui/actions.js` | Each path is one full `image + title + caption` action. |
| Settings | Back, entry rows, sound/vibration toggles | `assets/js/ui/actions.js` + store | Entire row owns the action. |
| Profile | Back, avatar radio choices, pronoun radios, Save, unsaved sheet | renderer + actions | Radio state uses `aria-checked`; Save exposes disabled state. |
| Notifications | Back, time row, day choices, toggles, sheet actions | renderer + actions | Day controls are 44px and wrap to `4 + 3` below 410px. |
| Spirit Book | Back, previous/next, chapter dots | renderer + actions | Pager uses SVG chevrons; first/last disabled states are explicit. |
| Deck | Back, deck artifact, quiet draw action | `data-action="draw"` | Artifact and text affordance share the route but keep separate accessible names. |
| Result/Spread | Back, share/continue/reset actions, spread cards, modal Close | renderer + actions | 1→3 and 3→5 use the same Secondary frame. «Новый вопрос» is an unframed quiet 44px action; after five cards it is the only completion action. Header axis and cold scene background are shared across the reading flow. |
| Traces/Gifts | Back, history traces, gift cards, sheet Close | renderer + actions | History traces are native buttons, not `role="button"` articles. |

## Interaction Contract

- Minimum target: `44px`; Navigation and Pager: `48px`.
- Focus: `2px` cold-silver outline with `3px` offset.
- Pressed: maximum `1px` downward displacement; no bounce.
- Disabled: shape remains visible at `0.38` opacity and ignores pointer input.
- Selected: must include fill, weight, shape, or marker position in addition to color.
- Reduced motion: removes movement and transitions while preserving state contrast.
- Decorative children never intercept pointer events.
- Screen aliases may preserve legacy color until that screen's approved silver migration, but may not redefine touch geometry or semantic role.

## Verification Matrix

| Check | Required evidence |
| --- | --- |
| Narrow mobile | 320×568 screenshot and no horizontal overflow |
| Mobile references | 375×812, 393×852, 430×932 |
| Tablet | 768×1024 |
| Keyboard | visible focus and logical route order |
| State | default, pressed, selected, disabled |
| Motion | `prefers-reduced-motion: reduce` keeps controls understandable |
| Navigation | every Back/Close returns to its documented owner |

## Deferred To Screen Migration

- replacing legacy gold colors on Settings, Profile, Notifications, Spirit Book, Deck, Result, Spread and Traces;
- final screen spacing and typography refinement;
- Artifact, Quiet Frame, media and sheet visual depth;
- content or route changes;
- onboarding decisions.
