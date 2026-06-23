#!/usr/bin/env python3

from __future__ import annotations

import re
from html.parser import HTMLParser
from pathlib import Path

from validate_public_lore import PUBLIC_LORE, SECTIONS, extract_sections


ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
ABOUT_CSS = ROOT / "assets/css/scenes/about-wyrd.css"
STYLES = ROOT / "assets/css/styles.css"
SCENES = ROOT / "assets/js/ui/scenes.js"
ACTIONS = ROOT / "assets/js/ui/actions.js"
NAVIGATION = ROOT / "assets/js/ui/about-navigation.js"
RENDER = ROOT / "assets/js/ui/render.js"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def read(path: Path) -> str:
    require(path.exists(), f"Missing about page file: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8")


def normalize_copy(text: str) -> str:
    text = text.replace("**", "").replace("`", "")
    text = re.sub(r"(?m)^\s*-\s+", "", text)
    text = re.sub(r"(?m)^\s*---\s*$", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return re.sub(r"\s+([.,!?;:])", r"\1", text)


class PublicCopyParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.copies: dict[str, str] = {}
        self._current: str | None = None
        self._depth = 0
        self._parts: list[str] = []

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        copy_name = attributes.get("data-public-lore-copy")

        if self._current is None and copy_name:
            self._current = copy_name
            self._depth = 1
            self._parts = []
        elif self._current is not None:
            self._depth += 1

    def handle_endtag(self, _tag: str) -> None:
        if self._current is None:
            return

        self._depth -= 1
        if self._depth == 0:
            self.copies[self._current] = normalize_copy(" ".join(self._parts))
            self._current = None
            self._parts = []

    def handle_data(self, data: str) -> None:
        if self._current is not None:
            self._parts.append(data)


def main() -> None:
    index = read(INDEX)
    css = read(ABOUT_CSS)
    styles = read(STYLES)
    scenes = read(SCENES)
    actions = read(ACTIONS)
    navigation = read(NAVIGATION)
    render = read(RENDER)
    public_lore = read(PUBLIC_LORE)

    parser = PublicCopyParser()
    parser.feed(index)
    source_sections = extract_sections(public_lore)

    require(set(parser.copies) == set(SECTIONS), "Runtime about page must expose exactly five approved public-lore sections")
    for heading in SECTIONS:
        expected = normalize_copy(source_sections[heading])
        actual = parser.copies[heading]
        require(actual == expected, f"Runtime copy drifted from PUBLIC_LORE_COPY.md: {heading}")

    for phrase in (
        'data-action="open-about"',
        '<span class="cover-icon-label">О WYRD</span>',
        'id="about-wyrd"',
        'aria-labelledby="about-wyrd-title"',
        'id="about-wyrd-title" tabindex="-1">Книга леса</h1>',
        'aria-label="Разделы Книги леса"',
        'data-action="back-from-about"',
        'data-action="replay-onboarding"',
        '>Повторить знакомство</button>',
    ):
        require(phrase in index, f"About page markup is missing: {phrase}")

    for phrase in (
        "min-height: var(--layout-control-min)",
        "width: min(100%, var(--layout-content-copy))",
        "scroll-margin-top:",
        "@media (max-width: 559px)",
        "@media (min-width: 900px)",
        "@media (min-width: 1200px)",
        ":focus-visible",
        "var(--layout-safe-top)",
    ):
        require(phrase in css, f"About page CSS is missing responsive/accessibility rule: {phrase}")

    require('@import "./scenes/about-wyrd.css";' in styles, "About page CSS is not part of the production entrypoint")
    require('ABOUT: "about"' in scenes, "About scene is not canonical")

    for phrase in ("open-about", "back-from-about", "about-jump", "SCENES.ABOUT", "aboutNavigation.rememberScroll()"):
        require(phrase in actions, f"About action contract is missing: {phrase}")

    replay_block = actions.split('if (action === "replay-onboarding")', 1)[1].split(
        'if (action === "close-profile")', 1
    )[0]
    require("resetOnboardingSeen" not in replay_block, "Replay must not mutate onboarding completion before the user finishes")
    require("SCENES.ABOUT" in replay_block, "Replay must preserve an About-page return target")

    for phrase in ("pushState", "popstate", "hashchange", "replaceState", "restoreFromOnboarding", "focus({ preventScroll: true })"):
        require(phrase in navigation, f"About navigation contract is missing: {phrase}")

    require("elements.aboutSection.hidden = scene !== SCENES.ABOUT" in render, "About visibility is not scene-driven")
    print("About page validation passed")


if __name__ == "__main__":
    main()
