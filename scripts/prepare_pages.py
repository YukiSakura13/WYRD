#!/usr/bin/env python3

from __future__ import annotations

import os
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


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
        r'((?:from|import)\s*(?:\(\s*)?["\']\s*)(\./|\.\./)([^"\']+?\.js)(\s*["\'])',
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


def rewrite_css_asset_url(value: str, source: Path) -> str:
    stripped = value.strip()
    lowered = stripped.lower()
    if (
        not stripped
        or lowered.startswith(("data:", "http:", "https:", "//"))
        or stripped.startswith(("/", "#"))
    ):
        return value

    parts = urlsplit(stripped)
    target = (source.parent / parts.path).resolve()
    try:
        relative = target.relative_to(DIST)
    except ValueError as error:
        raise RuntimeError(f"CSS asset escaped the Pages artifact: {stripped}") from error

    versioned_query = parts.query or f"v={BUILD_ID}"
    return urlunsplit(("", "", "./" + relative.as_posix(), versioned_query, parts.fragment))


def rewrite_css_asset_urls(text: str, source: Path) -> str:
    protected: dict[str, str] = {}

    def replace_quoted(match: re.Match[str]) -> str:
        quote = match.group(1)
        value = rewrite_css_asset_url(match.group(2), source)
        key = f"__WYRD_CSS_URL_{len(protected)}__"
        protected[key] = f"url({quote}{value}{quote})"
        return key

    def replace_unquoted(match: re.Match[str]) -> str:
        value = rewrite_css_asset_url(match.group(1), source)
        return f'url("{value}")'

    text = re.sub(r"url\(\s*([\"'])(.*?)\1\s*\)", replace_quoted, text)
    text = re.sub(r"url\(\s*([^\"')][^)]*?)\s*\)", replace_unquoted, text)
    for key, value in protected.items():
        text = text.replace(key, value)
    return text


def bundle_runtime_css(entry: Path) -> str:
    active: set[Path] = set()

    def inline(path: Path) -> str:
        resolved = path.resolve()
        if resolved in active:
            raise RuntimeError(f"Circular CSS import: {resolved.relative_to(DIST)}")

        active.add(resolved)
        text = resolved.read_text(encoding="utf-8")
        text = rewrite_css_asset_urls(text, resolved)

        def replace_import(match: re.Match[str]) -> str:
            import_value = match.group(1)
            import_path = urlsplit(import_value).path
            imported = (resolved.parent / import_path).resolve()
            return inline(imported)

        text = re.sub(
            r'@import\s+(?:url\(\s*)?["\']([^"\']+?\.css(?:\?[^"\']*)?)["\']\s*\)?\s*;',
            replace_import,
            text,
        )
        active.remove(resolved)

        source_label = resolved.relative_to(DIST).as_posix()
        return f"\n/* source: {source_label} */\n{text.strip()}\n"

    bundled = inline(entry)
    if "@import" in bundled:
        raise RuntimeError("Runtime CSS bundle still contains @import")
    return bundled.strip() + "\n"


def inline_runtime_css(index_path: Path, css_entry: Path) -> None:
    bundled = bundle_runtime_css(css_entry)
    css_entry.write_text(bundled, encoding="utf-8")

    html = index_path.read_text(encoding="utf-8")
    inline_style = (
        f'<style id="wyrd-runtime-styles" data-build="{BUILD_ID}">\n'
        f"{bundled}"
        "</style>"
    )
    html, replacements = re.subn(
        r'<link\s+rel="stylesheet"\s+href="\./assets/css/styles\.css\?v=[^"]+"\s*/>',
        inline_style,
        html,
        count=1,
    )
    if replacements != 1:
        raise RuntimeError("Runtime stylesheet link was not found in Pages index.html")

    index_path.write_text(html, encoding="utf-8")


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

    inline_runtime_css(
        DIST / "index.html",
        DIST / "assets/css/styles.css",
    )

    (DIST / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    main()
