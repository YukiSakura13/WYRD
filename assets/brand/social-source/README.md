# WYRD social preview source pack

The active social preview pair was approved under YUK-138 on 2026-08-19 and is
published from `public/social/`:

- `og-wide-wyrd-hare-title.png` — 1200×630 wide/Open Graph image;
- `og-square-wyrd-hare-title.png` — 1200×1200 square image.

## Canonical composition

Both exports use the same authored antlered-hare layer. Its anatomy, antlers,
engraving detail, position, scale, and eye pixels are fixed and must not be
redrawn or selectively edited.

The wide lockup is left-aligned within the dark atmospheric zone. The selected
version moves the complete lockup 24 px right from the preceding review and
uses a fully feathered black mist veil to keep the final letters of `ЛЕСА`
readable. The hare is 50 px left and 25 px up from the first refined review.

The square lockup stays horizontally centered in the lower dark zone and is
exactly 35 px above the first centered review. Its sizes, tracking, colors,
opacity, line spacing, hare placement, and background are otherwise unchanged.

Typography is rendered at 2× and downsampled with Lanczos 3:

- `WYRD`: IM Fell English 400, `#f3ecdd`, tracking `0.22em`;
- `ОРАКУЛ ДУХОВ ЛЕСА`: Cormorant Garamond 500,
  `rgba(216, 218, 216, 0.64)`, tracking `0.24em`.

## Reproducible sources

The minimal authored source pack is stored in
`assets/brand/social-source/`:

- `og-wide-background-plate.png`;
- `og-square-background-plate.png`;
- `og-hare-layer.png`;
- the two exact font files and their OFL licenses in `fonts/`.

`scripts/build-wyrd-social-previews.mjs` generates only the two approved
exports and contains no user-specific paths. It requires `sharp` and
`@napi-rs/canvas` to be available to Node.js:

```sh
node scripts/build-wyrd-social-previews.mjs
```

Use `--output-dir <directory>` for a non-destructive verification build.

Only the two final PNG exports belong in `public/social/`. This source pack,
fonts, licenses, and rebuild instructions are excluded from the Pages artifact.

## Integrity

- wide source plate SHA-256:
  `4b01b2db80a13d17134cd5fc452059054bc9bafe57ce3a4afe89fd57162001f2`;
- square source plate SHA-256:
  `2abee8ddf1af65186743b1d0d95b15e88360f92b429d7363d51fd1b75821ad12`;
- exact hare layer SHA-256:
  `460a79bb830bd928d5e0ef242aa0af5a9befb29765566beafe07ca67edc4facc`;
- approved wide export SHA-256:
  `d18ff21be428b706f2b84e9c47dc6236b14682a9c8a98bde9736e054dc964241`;
- approved square export SHA-256:
  `38e15cdeaff7989bb40283f16ac22b00dfcdaeaa848baf6dcd4d27c7a4ef3395`.
