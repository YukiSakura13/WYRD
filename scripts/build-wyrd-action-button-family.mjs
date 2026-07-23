import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDirectory = join(
  process.cwd(),
  "assets/ui/action-buttons/continuous",
);

mkdirSync(outputDirectory, { recursive: true });

const variants = [
  {
    name: "quiet",
    width: 820,
    title: "WYRD Quiet action button frame",
    description:
      "Continuous silver frame with the large diamond and smallest center gem; the intermediate diamond is intentionally omitted.",
    ornament: "quiet",
  },
  {
    name: "compact",
    width: 922,
    title: "WYRD Compact action button frame",
    description:
      "Continuous silver frame with the large diamond, intermediate diamond, and smallest center gem.",
    ornament: "compact",
  },
  {
    name: "secondary",
    width: 1014,
    title: "WYRD Secondary action button frame",
    description:
      "Continuous silver frame with one additional outer diamond around the Compact ornament.",
    ornament: "secondary",
  },
  {
    name: "hero",
    width: 1116,
    title: "WYRD Hero action button frame",
    description:
      "Continuous silver frame with the Secondary ornament and perpendicular connectors from the outer diamond to the terminal contour.",
    ornament: "hero",
  },
];

const terminalFrame = `
      <path d="M 84 24 H 51 L 4 67 Q 0 71 4 75 L 51 118 H 84"/>
      <path d="M 112 27 H 88 V 34 H 110"/>
      <g transform="translate(0 142) scale(1 -1)">
        <path d="M 112 27 H 88 V 34 H 110"/>
      </g>`;

const flankAccents = `
      <path d="M 83 32 H 76 L 64 44"/>
      <g transform="translate(0 142) scale(1 -1)">
        <path d="M 83 32 H 76 L 64 44"/>
      </g>`;

const ornamentPaths = {
  quiet: `${flankAccents}
      <path d="M 1 71 H 29"/>
      <path d="M 67 71 H 101"/>
      <path d="M 48 52 L 67 71 L 48 90 L 29 71 Z"/>`,
  compact: `${flankAccents}
      <path d="M 1 71 H 29"/>
      <path d="M 67 71 H 101"/>
      <path d="M 48 52 L 67 71 L 48 90 L 29 71 Z"/>
      <path d="M 48 62 L 57 71 L 48 80 L 39 71 Z"/>`,
  secondary: `${flankAccents}
      <path d="M 1 71 H 19"/>
      <path d="M 77 71 H 101"/>
      <path d="M 48 42 L 77 71 L 48 100 L 19 71 Z"/>
      <path d="M 48 52 L 67 71 L 48 90 L 29 71 Z"/>
      <path d="M 48 62 L 57 71 L 48 80 L 39 71 Z"/>`,
  hero: `${flankAccents}
      <path d="M 1 71 H 19"/>
      <path d="M 77 71 H 101"/>
      <path d="M 48 42 L 77 71 L 48 100 L 19 71 Z"/>
      <path d="M 48 52 L 67 71 L 48 90 L 29 71 Z"/>
      <path d="M 48 62 L 57 71 L 48 80 L 39 71 Z"/>
      <path d="M 33.5 56.5 L 24.9 47.9"/>
      <path d="M 33.5 85.5 L 24.9 94.1"/>`,
};

function renderVariant({ name, width, title, description, ornament }) {
  const rightFrameX = width - 108;
  const surfaceRight = width - 120;
  const outerCurveStart = width - 126;
  const innerCurveStart = width - 131;
  const innerRight = width - 118;
  const id = `wyrd-action-${name}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 142" width="${width}" height="142" fill="none" role="img" aria-labelledby="${id}-title ${id}-desc" style="color:#cdd1cf;--frame-highlight:#f3ecdd;--frame-bright:#e1e4e1;--frame-lowlight:#62686b;--frame-edge:#30353a;--frame-glow:#cbd4dc;--frame-gem-highlight:#fffdf4;--frame-gem-bright:#dfe4e2;--frame-gem:#aeb6b7;--frame-gem-lowlight:#596064;--frame-gem-edge:#f3ecdd;--frame-surface-top:#1f2330;--frame-surface-mid:#101019;--frame-surface-bottom:#070709">
  <title id="${id}-title">${title}</title>
  <desc id="${id}-desc">${description}</desc>
  <defs>
    <linearGradient id="${id}-metal" x1="0" y1="0" x2="0" y2="142" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="var(--frame-highlight, #f3ecdd)"/>
      <stop offset=".18" stop-color="var(--frame-bright, #e1e4e1)"/>
      <stop offset=".52" stop-color="currentColor"/>
      <stop offset=".78" stop-color="currentColor" stop-opacity=".9"/>
      <stop offset="1" stop-color="var(--frame-lowlight, #62686b)"/>
    </linearGradient>
    <linearGradient id="${id}-surface" x1="0" y1="0" x2="0" y2="142" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="var(--frame-surface-top, #1f2330)" stop-opacity=".86"/>
      <stop offset=".42" stop-color="var(--frame-surface-mid, #101019)" stop-opacity=".84"/>
      <stop offset="1" stop-color="var(--frame-surface-bottom, #070709)" stop-opacity=".96"/>
    </linearGradient>
    <linearGradient id="${id}-gem" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="var(--frame-gem-highlight, #fffdf4)"/>
      <stop offset=".28" stop-color="var(--frame-gem-bright, #dfe4e2)"/>
      <stop offset=".7" stop-color="var(--frame-gem, #aeb6b7)"/>
      <stop offset="1" stop-color="var(--frame-gem-lowlight, #596064)"/>
    </linearGradient>
    <filter id="${id}-halo" x="-18%" y="-80%" width="136%" height="260%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <filter id="${id}-bloom" x="-14%" y="-50%" width="128%" height="200%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="2.15"/>
    </filter>
    <g id="${id}-terminal">${terminalFrame}
${ornamentPaths[ornament]}
    </g>
    <g id="${id}-geometry">
      <path d="M 108 27 V 20 Q 108 2 126 2 H ${outerCurveStart} Q ${rightFrameX} 2 ${rightFrameX} 20 V 27"/>
      <path d="M 118 27 V 26 Q 118 14 131 14 H ${innerCurveStart} Q ${innerRight} 14 ${innerRight} 26 V 27"/>
      <path d="M 108 115 V 122 Q 108 140 126 140 H ${outerCurveStart} Q ${rightFrameX} 140 ${rightFrameX} 122 V 115"/>
      <path d="M 118 115 V 116 Q 118 128 131 128 H ${innerCurveStart} Q ${innerRight} 128 ${innerRight} 116 V 115"/>
      <use href="#${id}-terminal"/>
      <g transform="translate(${width} 0) scale(-1 1)">
        <use href="#${id}-terminal"/>
      </g>
    </g>
    <path id="${id}-gem-shape" d="M 48 67 L 52 71 L 48 75 L 44 71 Z"/>
  </defs>

  <g class="game-frame-art">
    <g fill="url(#${id}-surface)" opacity=".78">
      <path d="M 120 12 Q 108 12 108 25 V 117 Q 108 130 120 130 H ${surfaceRight} Q ${rightFrameX} 130 ${rightFrameX} 117 V 25 Q ${rightFrameX} 12 ${surfaceRight} 12 Z"/>
      <path d="M 2 71 L 49 26 H 84 L 108 48 V 94 L 84 116 H 49 Z"/>
      <g transform="translate(${width} 0) scale(-1 1)">
        <path d="M 2 71 L 49 26 H 84 L 108 48 V 94 L 84 116 H 49 Z"/>
      </g>
    </g>
    <g fill="none" stroke="var(--frame-glow, #cbd4dc)" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".12" filter="url(#${id}-halo)"><use href="#${id}-geometry"/></g>
    <g fill="none" stroke="var(--frame-glow, #cbd4dc)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".22" filter="url(#${id}-bloom)"><use href="#${id}-geometry"/></g>
    <g fill="none" stroke="var(--frame-edge, #30353a)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".94"><use href="#${id}-geometry"/></g>
    <g fill="none" stroke="url(#${id}-metal)" stroke-width="1.72" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"><use href="#${id}-geometry"/></g>
    <g fill="none" stroke="var(--frame-highlight, #f3ecdd)" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".42"><use href="#${id}-geometry"/></g>
    <g fill="var(--frame-glow, #cbd4dc)" opacity=".2" filter="url(#${id}-bloom)">
      <use href="#${id}-gem-shape"/>
      <use href="#${id}-gem-shape" transform="translate(${width} 0) scale(-1 1)"/>
    </g>
    <g fill="url(#${id}-gem)" stroke="var(--frame-gem-edge, #f3ecdd)" stroke-width=".65" vector-effect="non-scaling-stroke">
      <use href="#${id}-gem-shape"/>
      <use href="#${id}-gem-shape" transform="translate(${width} 0) scale(-1 1)"/>
    </g>
  </g>
</svg>
`;
}

for (const variant of variants) {
  writeFileSync(
    join(outputDirectory, `wyrd-action-${variant.name}.svg`),
    renderVariant(variant),
    "utf8",
  );
}

console.log(`Built ${variants.length} continuous WYRD action frames.`);
