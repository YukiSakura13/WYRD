#!/usr/bin/env python3
"""Validate the canonical WYRD runtime control contracts."""

from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ButtonParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.buttons = []

    def handle_starttag(self, tag, attrs):
        if tag == "button":
            self.buttons.append(dict(attrs))


def classes(button):
    return set((button.get("class") or "").split())


def require(condition, message, errors):
    if not condition:
        errors.append(message)


def main():
    errors = []
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    render = (ROOT / "assets/js/ui/render.js").read_text(encoding="utf-8")
    render_spread = (ROOT / "assets/js/ui/render-spread.js").read_text(encoding="utf-8")
    tokens = (ROOT / "assets/css/tokens.css").read_text(encoding="utf-8")
    controls = (ROOT / "assets/css/components/control-language.css").read_text(encoding="utf-8")

    parser = ButtonParser()
    parser.feed(index)

    navigation_actions = {
        "back-to-forest",
        "back-to-settings",
        "close-about-you",
        "back-from-onboarding",
        "new-question",
        "ritual-back",
    }
    for button in parser.buttons:
        action = button.get("data-action")
        button_classes = classes(button)
        if action in navigation_actions and "ui-action" not in button_classes:
            require(
                {"ui-icon-button", "ui-icon-button--back"}.issubset(button_classes),
                f"Back action {action!r} must use Navigation Icon Button",
                errors,
            )

    pager_buttons = [button for button in parser.buttons if button.get("data-action") in {"spirit-book-prev", "spirit-book-next"}]
    require(len(pager_buttons) == 2, "Spirit Book must have two pager buttons", errors)
    for button in pager_buttons:
        require("ui-pager-button" in classes(button), "Spirit Book pager must use ui-pager-button", errors)

    row_actions = [button for button in parser.buttons if "settings-row" in classes(button) or "reminders-row" in classes(button)]
    for button in row_actions:
        require("ui-row-action" in classes(button), "Interactive settings/reminders rows must use ui-row-action", errors)

    forest_paths = [button for button in parser.buttons if {"forest-hero-action", "forest-path-action"} & classes(button)]
    for button in forest_paths:
        require("ui-card-action" in classes(button), "Every Forest path must use ui-card-action", errors)

    for token in (
        "--control-touch-min: 44px",
        "--control-icon-hit-size: 48px",
        "--control-pager-hit-size: 48px",
        "--control-action-min-height: 52px",
        "--control-row-min-height: 68px",
        "--control-choice-hit-size: 44px",
    ):
        require(token in tokens, f"Missing canonical token {token}", errors)

    require('dot.className = "spirit-book-dot ui-page-choice"' in render, "Dynamic chapter dots must use ui-page-choice", errors)
    require('card.className = "gift-card ui-card-action"' in render, "Dynamic gift cards must use ui-card-action", errors)
    require('item.className = "spread-card ui-card-action"' in render_spread, "Dynamic spread cards must use ui-card-action", errors)
    require('item.className = "history-item ui-card-action"' in render_spread, "Dynamic history traces must use ui-card-action", errors)
    require(":focus-visible" in controls, "Control language must define a keyboard focus state", errors)
    require(
        "@media (prefers-reduced-motion: reduce)" in controls,
        "Control language must support reduced motion",
        errors,
    )
    contract_layer = controls.split(".ui-icon-button {", 1)[0]
    for visual_property in ("background:", "box-shadow:", "border-radius:", "\n  color:"):
        require(
            visual_property not in contract_layer,
            f"Architecture layer must not define theme property {visual_property}",
            errors,
        )

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        raise SystemExit(1)

    print("Control language validation passed")


if __name__ == "__main__":
    main()
