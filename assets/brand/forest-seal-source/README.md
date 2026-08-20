# WYRD Forest Seal source pack

The active external mark is the approved letter-free `Thorn ring` Forest Seal.
Its traced geometry preserves the approved 1254×1254 PNG silhouette without a
manual redraw.

## Canonical sources

- `assets/brand/forest-seal-source/icon-source-wyrd-thorn-seal.png` — approved raster source;
- `assets/brand/forest-seal-source/wyrd-thorn-seal-mark.svg` — transparent vector mark;
- `assets/brand/forest-seal-source/icon-wyrd-thorn-seal-any.svg` — regular black-plate vector export;
- `public/favicon-wyrd-thorn-seal-dark.svg` — optically cropped dark browser favicon;
- `public/favicon-wyrd-thorn-seal-light.svg` — optically cropped light browser favicon;
- `scripts/build-wyrd-theme-favicons.mjs` — deterministic themed favicon export.

Approved raster SHA-256:
`3f2dc1ac19946d3ce168d56eadf0d71d3982485f21a2329afc28c26c4fb9edec`.

## Originality review boundary

Visual similarity searches of the exact approved mark, including a Pinterest
image search, found no indexed exact match on 2026-08-19. This records the
design review performed for YUK-138; it is not a legal trademark clearance or
a guarantee that no similar mark exists.

## Export contract

- Browser favicon adaptation preserves the approved path coordinates and adds a
  same-color solid core behind that path. The outer field stays transparent.
- Dark and light SVG variants use `#070709` and `#F1EFE9`; each 16×16 and 32×32
  PNG fallback is rasterized independently from its SVG, never from another PNG.
- Runtime selects the contrasting dark/light set from
  `prefers-color-scheme` and updates it if the system theme changes.
- Apple/PWA regular chain: vector → 512×512 → 192×192 / 180×180.
- Maskable exports use an opaque black plate and keep the bright mark within
  the 40% guaranteed safe radius.
- Monochrome exports use the same vector silhouette as alpha with solid white
  RGB.
- The regular, maskable, and monochrome purposes remain separate manifest
  entries.

Only final browser, Apple Touch, and PWA exports belong in `public/`. Source
artwork and rebuild documentation stay in this directory and are excluded from
the Pages artifact.

Do not redraw, simplify, add letters, or replace the mark with an animal without
a new explicit identity decision.
