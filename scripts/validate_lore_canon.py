#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CANON = ROOT / "docs/LORE_CANON_RULES.md"
SCOPE = ROOT / "docs/TELEGRAM_BETA_SCOPE.md"
MASTER = ROOT / "docs/NEW_ORACLE_ARCHITECTURE_MASTER.md"
COLLECTION = ROOT / "docs/COLLECTION_TABLE_DRAFT.md"
COLLECTION_BACKLOG = ROOT / "docs/COLLECTION_BACKLOG.md"
WORKING_MAP = ROOT / "docs/NEW_ORACLE_GROUPS_WORKING_MAP.md"
VOICE_GUIDE = ROOT / "docs/ORACLE_VOICE_GUIDE.md"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def read(path: Path) -> str:
    require(path.exists(), f"Missing lore document: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8")


def main() -> None:
    canon = read(CANON)
    scope = read(SCOPE)
    master = read(MASTER)
    collection = read(COLLECTION)
    collection_backlog = read(COLLECTION_BACKLOG)
    working_map = read(WORKING_MAP)
    guide = read(VOICE_GUIDE)

    for phrase in (
        "голос синтеза нескольких карт",
        "не отдельное божество, дух или существо",
        "не становится проводником или рассказчиком",
        "Ворон onboarding",
        "presence: absence",
        "не считывает скрытое состояние",
        "не ставит диагноз",
        "не даёт юридических или финансовых решений",
    ):
        require(phrase in canon, f"Lore canon is missing required rule: {phrase}")

    require("LORE_CANON_RULES.md" in scope, "Beta scope must link the approved lore contract")
    require("concrete predictions" in guide, "Oracle guide lost prediction safety")
    require("medical claims" in guide and "legal claims" in guide, "Oracle guide lost safety claims")

    forbidden = {
        "Oracle-as-creature claim": "древнее существо из леса, которое видит человека насквозь",
        "positive prophecy label": "прямой знак, пророчество",
        "prophetic answer claim": "суровый пророческий ответ",
        "prophecy backlog": "прямое пророчество",
    }
    combined = "\n".join((master, collection, collection_backlog, working_map))
    for label, phrase in forbidden.items():
        require(phrase not in combined, f"{label} contradicts approved lore: {phrase}")

    print("Lore canon validation passed")


if __name__ == "__main__":
    main()
