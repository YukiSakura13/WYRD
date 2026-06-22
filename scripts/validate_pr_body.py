#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


REQUIRED_SECTIONS = (
    "linear",
    "outcome",
    "acceptance criteria",
    "dependencies",
    "test plan and evidence",
    "self-review",
    "deploy and linear report",
)
PLACEHOLDER_RE = re.compile(r"\b(?:tbd|todo|pending|yuk-000)\b", re.IGNORECASE)
LINEAR_URL_RE = re.compile(
    r"https://linear\.app/yukisakura/issue/(YUK-(?!000\b)\d+)(?:/[^\s)>]+)?",
    re.IGNORECASE,
)
CHECKED_RE = re.compile(r"^\s*[-*]\s*\[[xX]\]\s+\S", re.MULTILINE)
UNCHECKED_RE = re.compile(r"^\s*[-*]\s*\[\s\]\s+\S", re.MULTILINE)
COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)


def parse_sections(body: str) -> dict[str, str]:
    matches = list(re.finditer(r"^##\s+(.+?)\s*$", body, flags=re.MULTILINE))
    sections: dict[str, str] = {}
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        sections[match.group(1).strip().casefold()] = body[match.end() : end].strip()
    return sections


def visible_text(section: str) -> str:
    text = COMMENT_RE.sub("", section)
    text = re.sub(r"^\s*[-*]\s*\[[ xX]\]\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"[`#>*_-]", " ", text)
    return " ".join(text.split())


def has_substantive_text(section: str) -> bool:
    text = visible_text(section)
    return len(text) >= 12 and not PLACEHOLDER_RE.search(text)


def validate_pr_body(body: str) -> list[str]:
    errors: list[str] = []
    sections = parse_sections(body)

    missing = [name for name in REQUIRED_SECTIONS if name not in sections]
    if missing:
        errors.append("Missing required sections: " + ", ".join(missing))
        return errors

    linear_match = LINEAR_URL_RE.search(sections["linear"])
    if not linear_match:
        errors.append("Linear must contain a full non-placeholder WYRD issue URL.")

    for name in ("outcome", "dependencies", "deploy and linear report"):
        if not has_substantive_text(sections[name]):
            errors.append(f"{name.title()} must contain a concrete non-placeholder result.")

    for name in ("acceptance criteria", "test plan and evidence"):
        section = sections[name]
        if not has_substantive_text(section) or not CHECKED_RE.search(section):
            errors.append(f"{name.title()} must include at least one completed evidence item.")

    self_review = sections["self-review"]
    checked_count = len(CHECKED_RE.findall(self_review))
    if UNCHECKED_RE.search(self_review) or checked_count < 5:
        errors.append("Self-review must contain at least five completed items and no unchecked items.")

    deploy = COMMENT_RE.sub("", sections["deploy and linear report"])
    if not re.search(r"\bfollow[- ]?ups\s*:\s*(?:none\b|YUK-\d+)", deploy, re.IGNORECASE):
        errors.append("Deploy and Linear report must record Follow-ups: none or one or more YUK IDs.")

    return errors


def body_from_event(path: Path) -> str:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return payload.get("pull_request", {}).get("body") or ""


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate the WYRD pull request body.")
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--body-file", type=Path)
    source.add_argument("--event-file", type=Path)
    args = parser.parse_args()

    body = (
        args.body_file.read_text(encoding="utf-8")
        if args.body_file
        else body_from_event(args.event_file)
    )
    errors = validate_pr_body(body)
    if errors:
        for error in errors:
            print(f"::error::{error}")
        raise SystemExit(1)
    print("PR governance validation passed.")


if __name__ == "__main__":
    main()
