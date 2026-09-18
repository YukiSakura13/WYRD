#!/usr/bin/env python3
"""Package the UI Kit and its local dependencies, never the whole repository."""

from __future__ import annotations

import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = Path("docs/downloads/wyrd-ui-kit.zip")
PUBLIC_KIT = "https://yukisakura13.github.io/WYRD/docs/"


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        self.urls.extend(value for key, value in attrs if key in {"href", "src"} and value)


def collect_files() -> dict[str, bytes]:
    pending = [ROOT / "docs/wyrd-ui-kit.html"]
    files = {}
    while pending:
        path = pending.pop().resolve()
        relative = path.relative_to(ROOT).as_posix()
        if relative in files or relative == ARCHIVE.as_posix():
            continue
        if not relative.startswith(("docs/", "assets/", "public/")) or relative.startswith("assets/brand/"):
            raise ValueError(f"Unexpected UI Kit dependency: {relative}")
        data = path.read_bytes()
        files[relative] = data
        urls = []
        if path.suffix in {".html", ".css", ".js"}:
            text = data.decode("utf-8")
            if path.suffix == ".html":
                parser = References()
                parser.feed(text)
                urls = parser.urls
                # An extracted preview uses the public ZIP link, not a missing nested ZIP.
                files[relative] = text.replace('href="downloads/wyrd-ui-kit.zip"',
                    f'href="{PUBLIC_KIT}downloads/wyrd-ui-kit.zip"').encode("utf-8")
            elif path.suffix == ".css":
                urls = [m[1] for m in re.findall(r'url\(\s*([\"\']?)([^)\"\']+)\1\s*\)', text)]
                urls += re.findall(r'@import\s+[\"\']([^\"\']+)[\"\']', text)
            else:
                urls = re.findall(r'[\"\']((?:\./|\.\./)[^\"\']+\.(?:js|svg|webp|png|jpg))(?:\?[^\"\']*)?[\"\']', text)
        for url in urls:
            parts = urlsplit(url)
            if not parts.scheme and not parts.netloc and parts.path:
                pending.append(path.parent / parts.path)
    files["README.md"] = (ROOT / "docs/downloads/README.md").read_bytes()
    return files


def build_downloads(destination: Path = ROOT) -> Path:
    archive = destination / ARCHIVE
    archive.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=9) as output:
        for name, data in sorted(collect_files().items()):
            info = ZipInfo(f"wyrd-ui-kit/{name}", date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            output.writestr(info, data)
    return archive


if __name__ == "__main__":
    archive = build_downloads()
    print(f"Built {archive.relative_to(ROOT)} ({archive.stat().st_size:,} bytes)")
