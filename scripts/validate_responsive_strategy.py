#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT / "assets/css/tokens.css"
BASE = ROOT / "assets/css/base.css"
COVER = ROOT / "assets/css/scenes/cover-onboarding.css"
DECK = ROOT / "assets/css/scenes/deck.css"
CSS_ROOT = ROOT / "assets/css"
UI_KIT_CSS = ROOT / "docs/wyrd-ui-kit.css"
INDEX = ROOT / "index.html"
RENDER = ROOT / "assets/js/ui/render.js"
MAIN = ROOT / "assets/js/main.js"
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
    deck_css = read(DECK)
    index = read(INDEX)
    render = read(RENDER)
    runtime = read(MAIN)
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
        "height: var(--layout-viewport-dynamic)",
        "max-width: var(--layout-content-reading)",
        "var(--layout-page-padding-block-start)",
        "var(--layout-gutter-inline)",
        "var(--layout-page-padding-block-end)",
    ):
        require(phrase in layout_css, f"Shared layout does not consume responsive token: {phrase}")

    require(
        "@media (orientation: landscape)" in layout_css
        and "object-position: center 25%;" in layout_css
        and "@media (orientation: landscape) and (max-height: 520px)" in layout_css
        and "object-position: center 38%;" in layout_css,
        "Cover landscape artwork must keep the approved moon focal point visible",
    )
    require(
        'body[data-scene="cover"]' in layout_css
        and "overflow: hidden;" in layout_css
        and 'body[data-scene="cover"] #main' in layout_css
        and "display: none;" in layout_css,
        "Cover must own the viewport without exposing the inert page below it",
    )

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

    for css_path in (*CSS_ROOT.rglob("*.css"), UI_KIT_CSS):
        if css_path == TOKENS:
            continue
        require(
            "env(safe-area-inset" not in read(css_path),
            f"{css_path.relative_to(ROOT)} bypasses the composite layout safe-area tokens",
        )

    require(
        "elements.main.inert = isCoverScene;" in render,
        "The covered runtime surface must leave the keyboard and accessibility tree",
    )
    require(
        'elements.aboutAvatarTrack.addEventListener("focusin"' in runtime
        and "window.requestAnimationFrame" in runtime
        and "visibleRight" in runtime,
        "The horizontal avatar chooser must keep the keyboard-focused option visible",
    )
    require(
        'id="about-avatar-upload" type="file" accept="image/*" tabindex="-1" aria-hidden="true"' in index,
        "The programmatic avatar file input must not create a hidden keyboard stop",
    )
    require(
        ".deck-touch-copy {" in deck_css
        and "min-height: var(--control-touch-min);" in deck_css,
        "The quiet deck draw action must keep the canonical 44px target",
    )

    print("Responsive strategy validation passed")


if __name__ == "__main__":
    main()
