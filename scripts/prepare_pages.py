#!/usr/bin/env python3

from __future__ import annotations

import os
import re
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / ".dist-pages"


def get_build_id() -> str:
    github_sha = os.environ.get("GITHUB_SHA")
    if github_sha:
        return github_sha[:7]

    try:
        result = subprocess.run(
            ["git", "rev-parse", "--short=7", "HEAD"],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return "dev"

    return result.stdout.strip() or "dev"


BUILD_ID = get_build_id()
SITE_FILES = [
    "index.html",
    "manifest.webmanifest",
    "sw.js",
    "docs/wyrd-ui-kit.html",
    "docs/wyrd-ui-kit.css",
    "docs/wyrd-ui-kit.js",
]
SITE_DIRS = [
    "assets",
    "public",
]


def copy_tree(src: Path, dest: Path) -> None:
    shutil.copytree(src, dest)


def replace_build_markers(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r'(<meta\s+name="wyrd-build"\s+content=")[^"]+(")', rf"\g<1>{BUILD_ID}\2", text)
    text = re.sub(r"manifest\.webmanifest(?:\?v=[^\"']+)?", f"manifest.webmanifest?v={BUILD_ID}", text)
    text = re.sub(r"assets/css/styles\.css(?:\?v=[^\"']+)?", f"assets/css/styles.css?v={BUILD_ID}", text)
    text = re.sub(r"assets/js/main\.js(?:\?v=[^\"']+)?", f"assets/js/main.js?v={BUILD_ID}", text)
    path.write_text(text, encoding="utf-8")


def replace_kit_build_markers(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r"wyrd-ui-kit\.css(?:\?v=[^\"']+)?",
        f"wyrd-ui-kit.css?v={BUILD_ID}",
        text,
    )
    text = re.sub(
        r"wyrd-ui-kit\.js(?:\?v=[^\"']+)?",
        f"wyrd-ui-kit.js?v={BUILD_ID}",
        text,
    )
    text = re.sub(
        r'((?:\.\./)assets/[^"\']+\.(?:css|webp|png|jpe?g|gif|svg))(?:\?v=[^"\']+)?',
        lambda match: f"{match.group(1)}?v={BUILD_ID}",
        text,
    )
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


def version_relative_css_imports(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r'(@import\s+(?:url\()?["\'])([^"\']+?\.css)(["\'])',
        lambda match: f"{match.group(1)}{match.group(2)}?v={BUILD_ID}{match.group(3)}",
        text,
    )
    path.write_text(text, encoding="utf-8")


def main() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)

    DIST.mkdir(parents=True)

    for relative in SITE_FILES:
        destination = DIST / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / relative, destination)

    for relative in SITE_DIRS:
        copy_tree(ROOT / relative, DIST / relative)

    replace_build_markers(DIST / "index.html")
    replace_kit_build_markers(DIST / "docs/wyrd-ui-kit.html")
    version_relative_js_imports(DIST / "docs/wyrd-ui-kit.js")

    for js_file in (DIST / "assets/js").rglob("*.js"):
        version_relative_js_imports(js_file)

    for css_file in (DIST / "assets/css").rglob("*.css"):
        version_relative_css_imports(css_file)

    (DIST / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    main()
