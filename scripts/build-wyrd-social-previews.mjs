import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

let sharp;
let createCanvas;
let GlobalFonts;

try {
  sharp = require("sharp");
  ({ createCanvas, GlobalFonts } = require("@napi-rs/canvas"));
} catch (error) {
  throw new Error(
    "This script requires the sharp and @napi-rs/canvas packages. " +
      "Install them or expose their node_modules directory through NODE_PATH.",
    { cause: error },
  );
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const sourceDirectory = path.join(
  repositoryRoot,
  "assets/brand/social-source",
);
const defaultOutputDirectory = path.join(repositoryRoot, "public/social");

function parseOutputDirectory() {
  const argumentIndex = process.argv.indexOf("--output-dir");
  if (argumentIndex === -1) return defaultOutputDirectory;

  const value = process.argv[argumentIndex + 1];
  if (!value || value.startsWith("--")) {
    throw new Error("--output-dir requires a directory path");
  }
  return path.resolve(process.cwd(), value);
}

const outputDirectory = parseOutputDirectory();
const wideBackground = path.join(sourceDirectory, "og-wide-background-plate.png");
const squareBackground = path.join(
  sourceDirectory,
  "og-square-background-plate.png",
);
const hareLayer = path.join(sourceDirectory, "og-hare-layer.png");
const brandFont = path.join(sourceDirectory, "fonts/IMFeENrm28P.ttf");
const subtitleFont = path.join(
  sourceDirectory,
  "fonts/CormorantGaramond-wght.ttf",
);

const wideWidth = 1200;
const wideHeight = 630;
const squareSize = 1200;
const renderScale = 2;

function registerFonts() {
  if (!GlobalFonts.registerFromPath(brandFont, "IM Fell English")) {
    throw new Error(`Could not register ${brandFont}`);
  }
  if (!GlobalFonts.registerFromPath(subtitleFont, "Cormorant Garamond")) {
    throw new Error(`Could not register ${subtitleFont}`);
  }
}

function trackedWidth(context, text, tracking) {
  return [...text].reduce(
    (total, character, index) =>
      total + context.measureText(character).width + (index ? tracking : 0),
    0,
  );
}

function drawTrackedText(context, text, centerX, baselineY, tracking) {
  let cursor = centerX - trackedWidth(context, text, tracking) / 2;

  [...text].forEach((character, index) => {
    if (index) cursor += tracking;
    context.fillText(character, cursor, baselineY);
    cursor += context.measureText(character).width;
  });
}

function createWideLockup() {
  const canvas = createCanvas(wideWidth * renderScale, wideHeight * renderScale);
  const context = canvas.getContext("2d");
  const scaled = (value) => value * renderScale;

  context.textBaseline = "alphabetic";
  context.fillStyle = "#f3ecdd";
  context.shadowColor = "rgba(0, 0, 0, 0.68)";
  context.shadowBlur = scaled(2.5);
  context.shadowOffsetY = scaled(1);
  context.font = `400 ${scaled(122)}px "IM Fell English"`;
  drawTrackedText(context, "WYRD", scaled(302), scaled(280), scaled(122 * 0.22));

  context.fillStyle = "rgba(216, 218, 216, 0.64)";
  context.shadowBlur = scaled(1.5);
  context.shadowOffsetY = 0;
  context.font = `500 ${scaled(32)}px "Cormorant Garamond"`;
  drawTrackedText(
    context,
    "ОРАКУЛ ДУХОВ ЛЕСА",
    scaled(302),
    scaled(332),
    scaled(32 * 0.24),
  );

  return canvas.toBuffer("image/png");
}

function createSquareLockup() {
  const canvas = createCanvas(squareSize * renderScale, squareSize * renderScale);
  const context = canvas.getContext("2d");
  const scaled = (value) => value * renderScale;
  const offsetY = -35;

  context.textBaseline = "alphabetic";
  context.fillStyle = "#f3ecdd";
  context.shadowColor = "rgba(0, 0, 0, 0.68)";
  context.shadowBlur = scaled(2.5);
  context.shadowOffsetY = scaled(1);
  context.font = `400 ${scaled(140)}px "IM Fell English"`;
  drawTrackedText(
    context,
    "WYRD",
    scaled(600),
    scaled(970 + offsetY),
    scaled(140 * 0.22),
  );

  context.fillStyle = "rgba(216, 218, 216, 0.64)";
  context.shadowBlur = scaled(1.5);
  context.shadowOffsetY = 0;
  context.font = `500 ${scaled(32)}px "Cormorant Garamond"`;
  drawTrackedText(
    context,
    "ОРАКУЛ ДУХОВ ЛЕСА",
    scaled(600),
    scaled(1038 + offsetY),
    scaled(32 * 0.24),
  );

  return canvas.toBuffer("image/png");
}

function createAntlerMist() {
  return Buffer.from(`
    <svg width="${wideWidth * renderScale}" height="${wideHeight * renderScale}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mist" cx="50%" cy="50%" rx="50%" ry="50%">
          <stop offset="0" stop-color="#d8dad8" stop-opacity="0.11"/>
          <stop offset="0.46" stop-color="#d8dad8" stop-opacity="0.08"/>
          <stop offset="1" stop-color="#d8dad8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="1510" cy="515" rx="350" ry="260" fill="url(#mist)"/>
    </svg>
  `);
}

function createWideLockupShade() {
  return Buffer.from(`
    <svg width="${wideWidth * renderScale}" height="${wideHeight * renderScale}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shade" cx="50%" cy="50%" rx="50%" ry="50%">
          <stop offset="0" stop-color="#000" stop-opacity="0.24"/>
          <stop offset="0.60" stop-color="#000" stop-opacity="0.18"/>
          <stop offset="0.82" stop-color="#000" stop-opacity="0.10"/>
          <stop offset="1" stop-color="#000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="600" cy="520" rx="620" ry="340" fill="url(#shade)"/>
    </svg>
  `);
}

function createSquareLockupShade() {
  return Buffer.from(`
    <svg width="${squareSize * renderScale}" height="${squareSize * renderScale}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shade" cx="50%" cy="50%" rx="50%" ry="50%">
          <stop offset="0" stop-color="#000" stop-opacity="0.25"/>
          <stop offset="0.66" stop-color="#000" stop-opacity="0.16"/>
          <stop offset="1" stop-color="#000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="1200" cy="1940" rx="860" ry="390" fill="url(#shade)"/>
    </svg>
  `);
}

async function buildWidePreview() {
  const supersampled = await sharp(wideBackground)
    .resize(wideWidth * renderScale, wideHeight * renderScale, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .composite([
      { input: createAntlerMist(), left: 0, top: 0 },
      { input: createWideLockupShade(), left: 0, top: 0 },
      { input: hareLayer, left: 535 * renderScale, top: 165 * renderScale },
      { input: createWideLockup(), left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  return sharp(supersampled)
    .resize(wideWidth, wideHeight, { kernel: sharp.kernel.lanczos3 })
    .removeAlpha()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(outputDirectory, "og-wide-wyrd-hare-title.png"));
}

async function buildSquarePreview() {
  const supersampled = await sharp(squareBackground)
    .resize(squareSize * renderScale, squareSize * renderScale, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .composite([
      { input: createSquareLockupShade(), left: 0, top: 0 },
      { input: hareLayer, left: 285 * renderScale, top: 370 * renderScale },
      { input: createSquareLockup(), left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  return sharp(supersampled)
    .resize(squareSize, squareSize, { kernel: sharp.kernel.lanczos3 })
    .removeAlpha()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(outputDirectory, "og-square-wyrd-hare-title.png"));
}

registerFonts();
await mkdir(outputDirectory, { recursive: true });
await Promise.all([buildWidePreview(), buildSquarePreview()]);
