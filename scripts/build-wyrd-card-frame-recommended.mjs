import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const width = 1086;
const height = 1448;
const centerX = width / 2;
const centerY = height / 2;
const outputDirectory = join(
  process.cwd(),
  "assets/ui/card-frames/approved",
);
const outputPath = join(
  outputDirectory,
  "wyrd-card-frame-artifact.svg",
);

mkdirSync(outputDirectory, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none" role="img" aria-labelledby="wyrd-card-frame-recommended-title wyrd-card-frame-recommended-desc" style="color:#cdd1cf;--frame-highlight:#e1e4e1;--frame-bright:#d8dcda;--frame-lowlight:#858b8b;--frame-edge:#181c20;--frame-glow:#e1e4e1;--frame-wordmark:#f3ecdd">
  <title id="wyrd-card-frame-recommended-title">Recommended WYRD card frame</title>
  <desc id="wyrd-card-frame-recommended-desc">Transparent symmetric silver artifact frame with four two-diamond corner joints, two quiet wordmark punctuation dots, and three small axis markers.</desc>
  <defs>
    <linearGradient id="wyrd-card-frame-recommended-metal" x1="0" y1="0" x2="0" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="var(--frame-highlight, #f3ecdd)"/>
      <stop offset=".18" stop-color="var(--frame-bright, #e1e4e1)"/>
      <stop offset=".52" stop-color="currentColor"/>
      <stop offset=".78" stop-color="currentColor" stop-opacity=".9"/>
      <stop offset="1" stop-color="var(--frame-lowlight, #62686b)"/>
    </linearGradient>
    <filter id="wyrd-card-frame-recommended-halo" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="5.5"/>
    </filter>
    <filter id="wyrd-card-frame-recommended-bloom" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>

    <!-- Exact two-diamond core from the approved Compact action button. -->
    <g id="wyrd-card-frame-recommended-compact-core">
      <path d="M 48 52 L 67 71 L 48 90 L 29 71 Z"/>
      <path d="M 48 62 L 57 71 L 48 80 L 39 71 Z"/>
    </g>
    <path id="wyrd-card-frame-recommended-marker" d="M 0 -5 L 5 0 L 0 5 L -5 0 Z"/>

    <g id="wyrd-card-frame-recommended-border-quarter">
      <path d="M ${centerX} 27 H 174 L 162 39 H 78 L 35 82 V 665 L 47 677 V 701 L 35 713 V ${centerY}"/>
      <path d="M ${centerX} 40 H 185 L 173 52 H 88 L 48 92 V 653 L 59 664 V 714 L 48 725"/>
    </g>

    <g id="wyrd-card-frame-recommended-geometry">
      <use href="#wyrd-card-frame-recommended-border-quarter"/>
      <use href="#wyrd-card-frame-recommended-border-quarter" transform="translate(${width} 0) scale(-1 1)"/>
      <use href="#wyrd-card-frame-recommended-border-quarter" transform="translate(0 ${height}) scale(1 -1)"/>
      <use href="#wyrd-card-frame-recommended-border-quarter" transform="translate(${width} ${height}) scale(-1 -1)"/>

      <g transform="translate(25.2 4.15) scale(1.35)"><use href="#wyrd-card-frame-recommended-compact-core"/></g>
      <g transform="translate(1060.8 4.15) scale(-1.35 1.35)"><use href="#wyrd-card-frame-recommended-compact-core"/></g>
      <g transform="translate(25.2 1252.15) scale(1.35)"><use href="#wyrd-card-frame-recommended-compact-core"/></g>
      <g transform="translate(1060.8 1252.15) scale(-1.35 1.35)"><use href="#wyrd-card-frame-recommended-compact-core"/></g>

      <!-- Every long rail terminates on a diamond point. -->
      <path d="M 115.65 100 H 410"/>
      <path d="M 676 100 H 970.35"/>
      <path d="M 90 125.65 V 700"/>
      <path d="M 90 748 V 1322.35"/>
      <path d="M 996 125.65 V 700"/>
      <path d="M 996 748 V 1322.35"/>
      <path d="M 115.65 1348 H 532"/>
      <path d="M 554 1348 H 970.35"/>

      <use href="#wyrd-card-frame-recommended-marker" transform="translate(90 ${centerY})"/>
      <use href="#wyrd-card-frame-recommended-marker" transform="translate(996 ${centerY})"/>
      <use href="#wyrd-card-frame-recommended-marker" transform="translate(${centerX} 1348)"/>
    </g>

    <g id="wyrd-card-frame-recommended-dots">
      <circle cx="430" cy="100" r="4.2"/>
      <circle cx="656" cy="100" r="4.2"/>
    </g>
  </defs>

  <g class="wyrd-card-frame-art">
    <g fill="none" stroke="var(--frame-glow, #e1e4e1)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".055" filter="url(#wyrd-card-frame-recommended-halo)"><use href="#wyrd-card-frame-recommended-geometry"/></g>
    <g fill="none" stroke="var(--frame-edge, #181c20)" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".92"><use href="#wyrd-card-frame-recommended-geometry"/></g>
    <g fill="none" stroke="url(#wyrd-card-frame-recommended-metal)" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"><use href="#wyrd-card-frame-recommended-geometry"/></g>
    <g fill="none" stroke="var(--frame-highlight, #e1e4e1)" stroke-width=".38" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".26"><use href="#wyrd-card-frame-recommended-geometry"/></g>

    <g fill="var(--frame-highlight, #e1e4e1)" opacity=".18" filter="url(#wyrd-card-frame-recommended-bloom)"><use href="#wyrd-card-frame-recommended-dots"/></g>
    <g fill="var(--frame-bright, #d8dcda)"><use href="#wyrd-card-frame-recommended-dots"/></g>

    <text x="${centerX}" y="119" fill="var(--frame-wordmark, #f3ecdd)" stroke="var(--frame-edge, #181c20)" stroke-width=".55" paint-order="stroke fill" text-anchor="middle" font-family="'IM FELL English', 'Times New Roman', serif" font-size="54" letter-spacing="5">WYRD</text>
  </g>
</svg>
`;

writeFileSync(outputPath, svg, "utf8");
console.log(`Built ${outputPath}`);
