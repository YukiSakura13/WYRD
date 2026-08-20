import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

let sharp;

try {
  sharp = require("sharp");
} catch (error) {
  throw new Error(
    "This script requires sharp. Install it or expose its node_modules directory through NODE_PATH.",
    { cause: error },
  );
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const sourcePath = path.join(
  repositoryRoot,
  "assets/brand/forest-seal-source/wyrd-thorn-seal-mark.svg",
);
const outputDirectory = path.join(repositoryRoot, "public");

const opticalViewBox = "22 22 1210 1210";
const sealCenter = 627;
const sealCoreRadius = 340;
const variants = {
  dark: "#070709",
  light: "#F1EFE9",
};

function extractPath(source) {
  const match = source.match(/<path[\s\S]*?\/>/);
  if (!match) throw new Error(`Could not find the Forest Seal path in ${sourcePath}`);
  return match[0];
}

function extractPathData(pathElement) {
  const match = pathElement.match(/\sd="([\s\S]*?)"/);
  if (!match) throw new Error("Forest Seal path has no d attribute");
  return match[1];
}

function createThemeSvg(sourcePathElement, name, color) {
  const themedPath = sourcePathElement.replace(/fill="[^"]+"/, `fill="${color}"`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${opticalViewBox}" role="img" aria-labelledby="title desc">
  <title id="title">WYRD Thorn Seal — ${name}</title>
  <desc id="desc">Solid Forest Seal favicon with a transparent outer field.</desc>
  <circle cx="${sealCenter}" cy="${sealCenter}" r="${sealCoreRadius}" fill="${color}"/>
  ${themedPath}
</svg>
`;

  if (extractPathData(themedPath) !== extractPathData(sourcePathElement)) {
    throw new Error(`The ${name} favicon changed the approved Forest Seal path geometry`);
  }
  if (/<rect\b/.test(svg)) {
    throw new Error(`The ${name} favicon unexpectedly contains a background rectangle`);
  }

  return svg;
}

async function exportPng(svg, name, size) {
  const outputPath = path.join(
    outputDirectory,
    `favicon-${size}-wyrd-thorn-seal-${name}.png`,
  );

  await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toColorspace("srgb")
    .toFile(outputPath);
}

const source = await readFile(sourcePath, "utf8");
const sourcePathElement = extractPath(source);

for (const [name, color] of Object.entries(variants)) {
  const svg = createThemeSvg(sourcePathElement, name, color);
  await writeFile(
    path.join(outputDirectory, `favicon-wyrd-thorn-seal-${name}.svg`),
    svg,
    "utf8",
  );
  await Promise.all([exportPng(svg, name, 16), exportPng(svg, name, 32)]);
}

console.log("Built transparent dark/light WYRD Thorn Seal favicons");
