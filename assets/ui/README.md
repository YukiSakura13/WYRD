# WYRD active UI assets

This directory contains reusable interface geometry used by the runtime and the
canonical Silver UI Kit. It does not contain scene illustrations, brand-source
masters, final PWA/social exports, or retired gold artwork.

## Structure

- `action-buttons/continuous/` — approved four-level Silver Action Button
  family and its shared diamond motif.
- `card-frames/approved/` — approved transparent Artifact Frame used by the
  one-card result, Share rendering, and the Silver UI Kit.
- `icons/` — active navigation, utility, profile, and settings glyphs.

The existing paths are part of the executable Silver UI Kit contract. Do not
rename or reorganize them without updating the runtime, Kit, generators,
validators, and canonical documentation together.

## Related code

- `assets/css/components/` — shared component styling.
- `assets/css/scenes/` — scene-specific placement and hierarchy.
- `assets/js/ui/` — behavior and rendering.
- `scripts/build-wyrd-action-button-family.mjs` — Action Button SVG generator.
- `scripts/build-wyrd-card-frame-recommended.mjs` — Artifact Frame SVG
  generator.

## Asset boundaries

- Authored content and scene illustrations belong in `assets/images/`.
- Brand-source material belongs in `assets/brand/`.
- Browser, install, and social deliverables belong in `public/`.
- Retired visual history belongs in `archive/` and must not be referenced by
  the active runtime.
