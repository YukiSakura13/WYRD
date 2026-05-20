#!/usr/bin/env python3

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / ".dist-pages"

REQUIRED_FILES = [
    DIST / "index.html",
    DIST / "manifest.webmanifest",
    DIST / "sw.js",
    DIST / ".nojekyll",
    DIST / "assets/css/styles.css",
    DIST / "assets/js/main.js",
    DIST / "public/social/og-wide-wyrd-owl-title.png",
    DIST / "public/social/og-square-wyrd-owl-title.png",
    DIST / "public/icons/icon-square-wyrd-owl-moon.png",
    DIST / "public/icons/icon-source-wyrd-owl-symbol.png",
    DIST / "public/icons/icon-512-wyrd-owl-symbol.png",
    DIST / "public/icons/icon-192-wyrd-owl-symbol.png",
    DIST / "public/apple-touch-icon-wyrd-owl-symbol.png",
    DIST / "public/favicon-32-wyrd-owl-symbol.png",
    DIST / "public/favicon-16-wyrd-owl-symbol.png",
]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def extract_build_id(html: str) -> str:
    match = re.search(
        r'<meta\s+name="wyrd-build"\s+content="([^"]+)"',
        html,
        flags=re.IGNORECASE,
    )
    require(match is not None, "Missing wyrd-build meta tag in .dist-pages/index.html")
    build_id = match.group(1)
    require(build_id != "dev", "Build marker was not replaced in .dist-pages/index.html")
    return build_id


def ensure_versioned_reference(text: str, reference: str, build_id: str) -> None:
    require(
        f"{reference}?v={build_id}" in text,
        f"Missing versioned reference for {reference} in built artifact",
    )


def main() -> None:
    require(DIST.exists(), ".dist-pages does not exist; run scripts/prepare_pages.py first")

    for path in REQUIRED_FILES:
        require(path.exists(), f"Missing required artifact file: {path.relative_to(ROOT)}")

    index_html = (DIST / "index.html").read_text(encoding="utf-8")
    build_id = extract_build_id(index_html)

    ensure_versioned_reference(index_html, "manifest.webmanifest", build_id)
    ensure_versioned_reference(index_html, "assets/css/styles.css", build_id)
    ensure_versioned_reference(index_html, "assets/js/main.js", build_id)

    pwa_js = (DIST / "assets/js/pwa.js").read_text(encoding="utf-8")
    require(
        "./sw.js?v=${encodeURIComponent(buildId)}" in pwa_js,
        "Service worker registration lost its versioned build query",
    )

    styles_entry = (DIST / "assets/css/styles.css").read_text(encoding="utf-8")
    require("@import" in styles_entry, "CSS entry file no longer imports style modules")
    require(
        re.search(r'@import\s+["\'][^"\']+\.css\?v=' + re.escape(build_id), styles_entry),
        "CSS imports in .dist-pages/assets/css/styles.css are not versioned",
    )

    print(f"Artifact validation passed for build {build_id}")


if __name__ == "__main__":
    main()
