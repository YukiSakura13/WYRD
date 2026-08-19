#!/usr/bin/env python3

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / ".dist-pages"

REQUIRED_FILES = [
    DIST / "index.html",
    DIST / "manifest.webmanifest",
    DIST / "sw.js",
    DIST / ".nojekyll",
    DIST / "docs/wyrd-ui-kit.html",
    DIST / "docs/wyrd-ui-kit.css",
    DIST / "docs/wyrd-ui-kit.js",
    DIST / "assets/css/styles.css",
    DIST / "assets/js/main.js",
    DIST / "assets/images/forest-home/silver/raven-arch.jpg",
    DIST / "public/social/og-wide-wyrd-hare-title.png",
    DIST / "public/social/og-square-wyrd-hare-title.png",
    DIST / "public/favicon-wyrd-thorn-seal.svg",
    DIST / "public/favicon-32-wyrd-thorn-seal.png",
    DIST / "public/favicon-16-wyrd-thorn-seal.png",
    DIST / "public/apple-touch-icon-wyrd-thorn-seal.png",
    DIST / "public/icons/icon-192-wyrd-thorn-seal-any.png",
    DIST / "public/icons/icon-512-wyrd-thorn-seal-any.png",
    DIST / "public/icons/icon-192-wyrd-thorn-seal-maskable.png",
    DIST / "public/icons/icon-512-wyrd-thorn-seal-maskable.png",
    DIST / "public/icons/icon-192-wyrd-thorn-seal-monochrome.png",
    DIST / "public/icons/icon-512-wyrd-thorn-seal-monochrome.png",
]

EXPECTED_MANIFEST_ICONS = {
    ("./public/icons/icon-192-wyrd-thorn-seal-any.png", "192x192", "any"),
    ("./public/icons/icon-512-wyrd-thorn-seal-any.png", "512x512", "any"),
    ("./public/icons/icon-192-wyrd-thorn-seal-maskable.png", "192x192", "maskable"),
    ("./public/icons/icon-512-wyrd-thorn-seal-maskable.png", "512x512", "maskable"),
    ("./public/icons/icon-192-wyrd-thorn-seal-monochrome.png", "192x192", "monochrome"),
    ("./public/icons/icon-512-wyrd-thorn-seal-monochrome.png", "512x512", "monochrome"),
}

EXPECTED_PUBLIC_FILES = {
    "apple-touch-icon-wyrd-thorn-seal.png",
    "favicon-16-wyrd-thorn-seal.png",
    "favicon-32-wyrd-thorn-seal.png",
    "favicon-wyrd-thorn-seal.svg",
    "icons/icon-192-wyrd-thorn-seal-any.png",
    "icons/icon-192-wyrd-thorn-seal-maskable.png",
    "icons/icon-192-wyrd-thorn-seal-monochrome.png",
    "icons/icon-512-wyrd-thorn-seal-any.png",
    "icons/icon-512-wyrd-thorn-seal-maskable.png",
    "icons/icon-512-wyrd-thorn-seal-monochrome.png",
    "social/og-square-wyrd-hare-title.png",
    "social/og-wide-wyrd-hare-title.png",
}


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
    require(
        not (DIST / "assets/brand").exists(),
        "Brand source masters must not be included in the Pages artifact",
    )
    require(
        not any(DIST.rglob(".DS_Store")),
        "Finder metadata must not be included in the Pages artifact",
    )

    actual_public_files = {
        path.relative_to(DIST / "public").as_posix()
        for path in (DIST / "public").rglob("*")
        if path.is_file()
    }
    require(
        actual_public_files == EXPECTED_PUBLIC_FILES,
        "Pages public/ must contain only the approved favicon, PWA, and social exports",
    )

    for path in REQUIRED_FILES:
        require(path.exists(), f"Missing required artifact file: {path.relative_to(ROOT)}")

    require(
        not (DIST / "assets/images/rubashka.webp").exists(),
        "Pages artifact still contains the retired gold card back",
    )

    index_html = (DIST / "index.html").read_text(encoding="utf-8")
    build_id = extract_build_id(index_html)

    for reference in (
        "./public/favicon-wyrd-thorn-seal.svg",
        "./public/favicon-32-wyrd-thorn-seal.png",
        "./public/favicon-16-wyrd-thorn-seal.png",
        "./public/apple-touch-icon-wyrd-thorn-seal.png",
    ):
        require(reference in index_html, f"Missing active Thorn Seal reference: {reference}")
    require("wyrd-owl" not in index_html, "Active Pages HTML still references the archived owl identity")

    manifest = json.loads((DIST / "manifest.webmanifest").read_text(encoding="utf-8"))
    manifest_icons = {
        (icon.get("src"), icon.get("sizes"), icon.get("purpose"))
        for icon in manifest.get("icons", [])
    }
    require(
        manifest_icons == EXPECTED_MANIFEST_ICONS,
        "Manifest icon set does not match the approved Thorn Seal any/maskable/monochrome exports",
    )

    ensure_versioned_reference(index_html, "manifest.webmanifest", build_id)
    ensure_versioned_reference(index_html, "assets/js/main.js", build_id)
    require(
        f'<style id="wyrd-runtime-styles" data-build="{build_id}">' in index_html,
        "Runtime CSS is not inlined in the Pages HTML",
    )
    require(
        'href="./assets/css/styles.css' not in index_html,
        "Pages HTML still depends on the external runtime stylesheet",
    )

    pwa_js = (DIST / "assets/js/pwa.js").read_text(encoding="utf-8")
    require(
        "./sw.js?v=${encodeURIComponent(buildId)}" in pwa_js,
        "Service worker registration lost its versioned build query",
    )

    styles_entry = (DIST / "assets/css/styles.css").read_text(encoding="utf-8")
    require(
        "@import" not in styles_entry,
        "Bundled Pages CSS still contains @import",
    )
    require(
        ".cover-scene" in styles_entry
        and ".wyrd-deck-composition" in styles_entry
        and f"?v={build_id}" in styles_entry,
        "Bundled Pages CSS lost required runtime rules or versioned assets",
    )

    kit_html = (DIST / "docs/wyrd-ui-kit.html").read_text(encoding="utf-8")
    require(
        "../assets/images/forest-home/silver/raven-arch.jpg" in kit_html
        and "rubashka.webp" not in kit_html,
        "Silver UI Kit reveal must use the approved Raven Arch card back",
    )
    require(
        re.search(r'href=["\'](?:\./)?wyrd-ui-kit\.css(?:\?v=[^"\']+)?["\']', kit_html) is not None,
        "Silver UI Kit lost its local stylesheet reference",
    )
    require(
        re.search(r'src=["\'](?:\./)?wyrd-ui-kit\.js(?:\?v=[^"\']+)?["\']', kit_html) is not None,
        "Silver UI Kit lost its local script reference",
    )
    ensure_versioned_reference(kit_html, "wyrd-ui-kit.css", build_id)
    ensure_versioned_reference(kit_html, "wyrd-ui-kit.js", build_id)
    ensure_versioned_reference(kit_html, "../assets/css/tokens.css", build_id)
    require(
        (DIST / "assets/ui/action-buttons/continuous/wyrd-action-hero.svg").exists(),
        "Silver UI Kit canonical Hero asset is missing from the Pages artifact",
    )
    require(
        (DIST / "assets/ui/card-frames/approved/wyrd-card-frame-artifact.svg").exists(),
        "Silver UI Kit canonical Artifact Frame is missing from the Pages artifact",
    )
    require(
        "../public/apple-touch-icon-wyrd-thorn-seal.png" in kit_html,
        "Silver UI Kit Feedback lost the canonical Forest Seal",
    )
    for scenario in ("breath", "reveal", "drift", "success"):
        require(
            f'data-motion-preview="{scenario}"' in kit_html,
            f"Silver UI Kit Motion Lab lost the {scenario} scenario",
        )
    require(
        "data-motion-play" in kit_html and "data-motion-reduced" in kit_html,
        "Silver UI Kit Motion Lab lost play or reduced-motion controls",
    )
    require(
        "data-deck-composition" in kit_html
        and "data-deck-composition-card" in kit_html,
        "Silver UI Kit lost the approved Deck composition specimen",
    )
    require(
        'id="implementation"' in kit_html,
        "Silver UI Kit implementation handoff is missing",
    )
    kit_js = (DIST / "docs/wyrd-ui-kit.js").read_text(encoding="utf-8")
    ensure_versioned_reference(
        kit_js,
        "../assets/js/ui/cover-cta.js",
        build_id,
    )

    print(f"Artifact validation passed for build {build_id}")


if __name__ == "__main__":
    main()
