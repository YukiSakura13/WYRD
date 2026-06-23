#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT / "assets/css/tokens.css"
BASE = ROOT / "assets/css/base.css"
COVER = ROOT / "assets/css/scenes/cover-onboarding.css"
STRATEGY = ROOT / "docs/RESPONSIVE_STRATEGY.md"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def read(path: Path) -> str:
    require(path.exists(), f"Missing responsive contract file: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8")


def main() -> None:
    tokens = read(TOKENS)
    layout_css = "\n".join((read(BASE), read(COVER)))
    strategy = read(STRATEGY)

    for token in (
        "--space-1:",
        "--space-16:",
        "--layout-gutter-inline:",
        "--layout-content-copy:",
        "--layout-content-reading:",
        "--layout-content-wide:",
        "--layout-control-min: 2.75rem;",
        "--layout-viewport-min: 100svh;",
        "--layout-viewport-dynamic: 100dvh;",
        "--safe-area-top:",
        "--content-safe-area-top:",
        "--layout-safe-top:",
        "--layout-page-padding-block-start:",
        "--layout-page-padding-block-end:",
    ):
        require(token in tokens, f"Layout tokens are missing: {token}")

    for phrase in (
        "min-height: var(--layout-viewport-min)",
        "max-width: var(--layout-content-reading)",
        "var(--layout-page-padding-block-start)",
        "var(--layout-gutter-inline)",
        "var(--layout-page-padding-block-end)",
    ):
        require(phrase in layout_css, f"Shared layout does not consume responsive token: {phrase}")

    for viewport in ("320×568", "390×844", "768×1024", "1280×720", "1440×900"):
        require(viewport in strategy, f"Responsive strategy is missing QA viewport: {viewport}")

    for phrase in (
        "`< 560px`",
        "`560–899px`",
        "`900–1199px`",
        "`≥ 1200px`",
        "`≤ 639px`",
        "zoom 200%",
        "Touch/click target",
        "Scroll ownership",
        "Telegram-specific mapping",
        "document-level horizontal overflow",
    ):
        require(phrase in strategy, f"Responsive strategy is missing rule: {phrase}")

    print("Responsive strategy validation passed")


if __name__ == "__main__":
    main()
