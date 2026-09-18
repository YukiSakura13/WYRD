#!/usr/bin/env python3
"""Check the shipped download links and the exact contents of the ZIP."""

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree
from zipfile import ZipFile

from build_ui_kit_downloads import ARCHIVE, ROOT, collect_files


class DownloadLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and "download" in attrs:
            self.links.append(attrs)


def validate_downloads(site: Path):
    parser = DownloadLinks()
    parser.feed((site / "docs/wyrd-ui-kit.html").read_text())
    assert len(parser.links) >= 25, "Expected graphics, README and ZIP download links"
    for link in parser.links:
        url = urlsplit(link["href"])
        assert not url.scheme and not url.netloc, f"Download must be same-origin: {url}"
        target = (site / "docs" / url.path).resolve()
        target.relative_to(site.resolve())
        assert target.is_file() and target.stat().st_size, f"Missing download: {url.path}"
        if target.suffix == ".svg":
            svg = ElementTree.parse(target).getroot()
            assert svg.tag == "{http://www.w3.org/2000/svg}svg"
            assert "viewBox" in svg.attrib
    with ZipFile(site / ARCHIVE) as archive:
        assert archive.testzip() is None, "Corrupt ZIP entry"
        expected = {f"wyrd-ui-kit/{name}": data for name, data in collect_files().items()}
        assert set(archive.namelist()) == set(expected), "Archive dependency set drifted"
        for name, data in expected.items():
            assert archive.read(name) == data, f"Stale archive entry: {name}"
    print(f"UI Kit downloads passed: {len(parser.links)} links, {len(expected)} archive files")


if __name__ == "__main__":
    validate_downloads(Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT)
