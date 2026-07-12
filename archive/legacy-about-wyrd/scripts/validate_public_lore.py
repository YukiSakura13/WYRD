#!/usr/bin/env python3

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PUBLIC_LORE = ROOT / "docs/PUBLIC_LORE_COPY.md"
MIN_WORDS = 50
MAX_WORDS = 100
SECTIONS = (
    "Что такое WYRD",
    "Как проходит ритуал",
    "Кто говорит",
    "Что Лес делает — и чего не делает",
    "Как слушать",
)
WORD = re.compile(r"[A-Za-zА-Яа-яЁё0-9]+(?:[-‑][A-Za-zА-Яа-яЁё0-9]+)*")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def extract_sections(document: str) -> dict[str, str]:
    sections: dict[str, list[str]] = {}
    current: str | None = None

    for line in document.splitlines():
        if line.startswith("## "):
            heading = line.removeprefix("## ").strip()
            current = heading if heading in SECTIONS else None
            if current:
                sections[current] = []
        elif current:
            sections[current].append(line)

    return {heading: "\n".join(lines).strip() for heading, lines in sections.items()}


def word_count(text: str) -> int:
    return len(WORD.findall(text))


def main() -> None:
    require(PUBLIC_LORE.exists(), "Missing public lore copy: docs/PUBLIC_LORE_COPY.md")
    document = PUBLIC_LORE.read_text(encoding="utf-8")
    sections = extract_sections(document)

    for heading in SECTIONS:
        require(heading in sections, f"Public lore is missing section: {heading}")
        count = word_count(sections[heading])
        require(
            MIN_WORDS <= count <= MAX_WORDS,
            f"Section '{heading}' has {count} words; expected {MIN_WORDS}-{MAX_WORDS}",
        )

    required_by_section = {
        "Что такое WYRD": ("плетение настоящего", "следующий шаг всегда остаётся за тобой"),
        "Как проходит ритуал": ("Послание и Тень", "1 → 3 → 5", "Голос Оракула", "сохранить След"),
        "Кто говорит": ("**Лес**", "**Духи**", "**Оракул**", "**Сова**", "не ведёт по Лесу"),
        "Что Лес делает — и чего не делает": (
            "не предсказывает неизбежное будущее",
            "не утверждает скрытые мысли или факты",
            "не ставит диагнозы",
            "не даёт юридических или финансовых решений",
        ),
        "Как слушать": ("не считывает и не сохраняет невведённые слова", "Повторить знакомство"),
    }
    for heading, phrases in required_by_section.items():
        for phrase in phrases:
            require(phrase in sections[heading], f"Section '{heading}' is missing: {phrase}")

    for phrase in (
        "Навигационный label: **«О WYRD»**",
        "Художественный заголовок страницы: **«Книга леса»**",
        "Ворон onboarding остаётся только визуальным образом",
        "не получает публичной роли",
        "не сбрасывает Следы, историю или прогресс",
    ):
        require(phrase in document, f"Public lore contract is missing: {phrase}")

    forbidden = (
        "Лес предсказывает твоё будущее",
        "Оракул — отдельное божество",
        "Сова ведёт по Лесу",
        "Ворон ведёт по Лесу",
        "WYRD знает скрытые мысли",
    )
    for phrase in forbidden:
        require(phrase not in document, f"Public lore contradicts canon: {phrase}")

    print("Public lore validation passed")


if __name__ == "__main__":
    main()
