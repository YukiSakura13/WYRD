#!/usr/bin/env python3

from __future__ import annotations

import os
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / ".dist-pages"
BUILD_ID = os.environ.get("GITHUB_SHA", "dev")[:7] or "dev"
SITE_FILES = [
    "index.html",
    "manifest.webmanifest",
    "sw.js",
]
SITE_DIRS = [
    "assets",
]


def copy_tree(src: Path, dest: Path) -> None:
    shutil.copytree(src, dest)


def replace_build_markers(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = text.replace('content="dev"', f'content="{BUILD_ID}"')
    text = text.replace("manifest.webmanifest?v=dev", f"manifest.webmanifest?v={BUILD_ID}")
    text = text.replace("styles.css?v=dev", f"styles.css?v={BUILD_ID}")
    text = text.replace("main.js?v=dev", f"main.js?v={BUILD_ID}")
    path.write_text(text, encoding="utf-8")


def version_relative_js_imports(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r'((?:from|import)\s*[("\']\s*)(\./|\.\./)([^"\']+?\.js)(\s*["\'])',
        lambda match: f"{match.group(1)}{match.group(2)}{match.group(3)}?v={BUILD_ID}{match.group(4)}",
        text,
    )
    text = re.sub(
        r'([("\'])((?:\./|\.\./)assets/[^"\']+\.(?:webp|png|jpe?g|gif|svg|m4a|mp3|wav))(["\'])',
        lambda match: f"{match.group(1)}{match.group(2)}?v={BUILD_ID}{match.group(3)}",
        text,
    )
    path.write_text(text, encoding="utf-8")


def main() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)

    DIST.mkdir(parents=True)

    for relative in SITE_FILES:
        shutil.copy2(ROOT / relative, DIST / relative)

    for relative in SITE_DIRS:
        copy_tree(ROOT / relative, DIST / relative)

    replace_build_markers(DIST / "index.html")

    for js_file in (DIST / "assets/js").rglob("*.js"):
        version_relative_js_imports(js_file)

    (DIST / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    main()
