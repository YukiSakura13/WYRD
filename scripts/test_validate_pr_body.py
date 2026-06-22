#!/usr/bin/env python3

from __future__ import annotations

import unittest

from validate_pr_body import validate_pr_body


VALID_BODY = """## Linear

- Issue: https://linear.app/yukisakura/issue/YUK-84/ready-done
- Priority / scope: P0 / MVP

## Outcome

Every pull request has a verifiable project checklist.

## Acceptance criteria

- [x] Repository templates link to the canonical Linear document.

## Dependencies

- Blocked by: none
- Duplicate check: Linear, branches, and pull requests checked.

## Test plan and evidence

- [x] `python3 scripts/test_validate_pr_body.py` passes.

## Self-review

- [x] Complete diff reviewed.
- [x] No accidental files or secrets.
- [x] Accessibility checked where applicable.
- [x] State and errors checked where applicable.
- [x] Tests and documentation updated.

## Deploy and Linear report

- Preview / staging: GitHub Actions check.
- Deploy plan: Pages after merge to main.
- Linear report: test and workflow URLs after completion.
- Follow-ups: none because the acceptance scope is complete.
"""


class ValidatePullRequestBodyTest(unittest.TestCase):
    def test_accepts_complete_body(self) -> None:
        self.assertEqual(validate_pr_body(VALID_BODY), [])

    def test_rejects_missing_linear_url(self) -> None:
        body = VALID_BODY.replace(
            "https://linear.app/yukisakura/issue/YUK-84/ready-done", "YUK-84"
        )
        self.assertIn("full non-placeholder", " ".join(validate_pr_body(body)))

    def test_rejects_placeholder_linear_id(self) -> None:
        body = VALID_BODY.replace("YUK-84/ready-done", "YUK-000/example")
        self.assertIn("full non-placeholder", " ".join(validate_pr_body(body)))

    def test_rejects_missing_evidence(self) -> None:
        body = VALID_BODY.replace(
            "- [x] `python3 scripts/test_validate_pr_body.py` passes.",
            "- [ ] Add evidence later.",
        )
        self.assertIn("completed evidence", " ".join(validate_pr_body(body)))

    def test_rejects_unfinished_self_review(self) -> None:
        body = VALID_BODY.replace("- [x] Complete diff reviewed.", "- [ ] Complete diff reviewed.")
        self.assertIn("no unchecked items", " ".join(validate_pr_body(body)))

    def test_rejects_missing_follow_up_result(self) -> None:
        body = VALID_BODY.replace(
            "Follow-ups: none because the acceptance scope is complete.",
            "Follow-ups will be decided later.",
        )
        self.assertIn("Follow-ups", " ".join(validate_pr_body(body)))


if __name__ == "__main__":
    unittest.main()
