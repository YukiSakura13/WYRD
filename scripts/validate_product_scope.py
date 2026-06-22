#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
POSITIONING = (
    "WYRD — атмосферный цифровой оракул духов леса: человек задаёт вопрос, "
    "получает символический знак и углубляет его в расклад 1→3→5, чтобы увидеть "
    "нынешний узор и выбрать следующий шаг, а не получить предсказание "
    "неизбежного будущего."
)
SCOPE = ROOT / "docs/TELEGRAM_BETA_SCOPE.md"
BRIEF = ROOT / "docs/PROJECT_BRIEF.md"
ROADMAP = ROOT / "docs/ROADMAP.md"
FEATURES = ROOT / "docs/FEATURES.md"
VISUAL = ROOT / "docs/ROADMAP_VISUAL.md"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def read(path: Path) -> str:
    require(path.exists(), f"Missing product document: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8")


def main() -> None:
    scope = read(SCOPE)
    brief = read(BRIEF)
    roadmap = read(ROADMAP)
    features = read(FEATURES)
    visual = read(VISUAL)

    require(POSITIONING in scope, "Canonical positioning is missing from beta scope")
    require(POSITIONING in brief, "Project brief drifted from canonical positioning")

    for phrase in (
        "ограниченная бесплатная",
        "Telegram Mini App",
        "1→3→5",
        "TTS-озвучка",
        "Telegram Stars",
        "медицинскую помощь",
        "юридических или финансовых решений",
    ):
        require(phrase in scope, f"Beta scope is missing required boundary: {phrase}")

    require("paywall-first" not in visual.casefold(), "Visual roadmap restored paywall-first flow")
    require("сложный backend" not in roadmap.casefold(), "Roadmap contradicts MVP backend scope")
    require(
        "paywall и stars не входят" in visual.casefold(),
        "Visual roadmap must show the free 1→3→5 beta",
    )
    require("TELEGRAM_BETA_SCOPE.md" in features, "Feature registry must link canonical scope")

    print("Product scope validation passed")


if __name__ == "__main__":
    main()
