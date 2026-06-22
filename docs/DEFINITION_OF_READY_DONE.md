# Definition of Ready & Done

The canonical checklist lives in Linear:
[WYRD — Definition of Ready & Done](https://linear.app/yukisakura/document/wyrd-definition-of-ready-and-done-2026d3d254c7).
Linear remains the source of truth when this repository and the document disagree.

## Repository entry points

- New work starts from [the Linear issue template](templates/LINEAR_ISSUE_TEMPLATE.md).
- Every pull request starts from [the PR template](../.github/pull_request_template.md).
- GitHub Issues redirect contributors to the WYRD Linear project.
- `PR Governance` validates the Linear link, completed acceptance/evidence items, self-review, deploy plan, and follow-up result.

## Required cycle

1. Confirm that the Linear issue is unique, ready, assigned, and unblocked.
2. Move it to `In Progress` and keep code within its declared scope.
3. Run the relevant tests and record concrete evidence in the PR.
4. Complete self-review, review GitHub checks, and verify preview/staging.
5. Deploy through the documented workflow and verify the published result.
6. Add the completion report, risks, and follow-ups to Linear.
7. Update dependencies and move the issue to `Done` only after every applicable gate passes.

Unchecked or non-applicable items must include a reason. A found defect or follow-up is recorded as a separate linked Linear issue rather than hidden in prose.
