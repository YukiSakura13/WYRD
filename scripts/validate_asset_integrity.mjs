import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CARD_LAYERS } from "../assets/js/cards/layer-map.js";
import { CARD_META } from "../assets/js/cards/card-meta.js";
import { CARDS } from "../assets/js/data/cards.js";
import { SPIRIT_BOOK_PAGES } from "../assets/js/data/spirit-book.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".svg", ".webp"]);
const TEXT_REFERENCE_EXTENSIONS = new Set([".css", ".html", ".js", ".webmanifest"]);
const DUPLICATE_SCAN_ROOTS = ["archive", "assets", "public"];

const EXPECTED_PUBLIC_FILES = new Set([
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
]);

const EXPECTED_PUBLIC_DIMENSIONS = new Map([
  ["apple-touch-icon-wyrd-thorn-seal.png", [180, 180]],
  ["favicon-16-wyrd-thorn-seal.png", [16, 16]],
  ["favicon-32-wyrd-thorn-seal.png", [32, 32]],
  ["icons/icon-192-wyrd-thorn-seal-any.png", [192, 192]],
  ["icons/icon-192-wyrd-thorn-seal-maskable.png", [192, 192]],
  ["icons/icon-192-wyrd-thorn-seal-monochrome.png", [192, 192]],
  ["icons/icon-512-wyrd-thorn-seal-any.png", [512, 512]],
  ["icons/icon-512-wyrd-thorn-seal-maskable.png", [512, 512]],
  ["icons/icon-512-wyrd-thorn-seal-monochrome.png", [512, 512]],
  ["social/og-square-wyrd-hare-title.png", [1200, 1200]],
  ["social/og-wide-wyrd-hare-title.png", [1200, 630]],
]);

const EXPECTED_MANIFEST_ICONS = new Set([
  "./public/icons/icon-192-wyrd-thorn-seal-any.png|192x192|any",
  "./public/icons/icon-512-wyrd-thorn-seal-any.png|512x512|any",
  "./public/icons/icon-192-wyrd-thorn-seal-maskable.png|192x192|maskable",
  "./public/icons/icon-512-wyrd-thorn-seal-maskable.png|512x512|maskable",
  "./public/icons/icon-192-wyrd-thorn-seal-monochrome.png|192x192|monochrome",
  "./public/icons/icon-512-wyrd-thorn-seal-monochrome.png|512x512|monochrome",
]);

// These pairs are known historical/source copies. YUK-87 owns their removal
// or consolidation; every new duplicate must fail this gate explicitly.
const ALLOWED_DUPLICATE_GROUPS = new Set([
  duplicateKey([
    "archive/brand-gold/icons/apple-touch-icon-wyrd-owl-symbol.png",
    "archive/brand-gold/icons/apple-touch-icon.png",
  ]),
  duplicateKey([
    "archive/brand-gold/icons/favicon-16-wyrd-owl-symbol.png",
    "archive/brand-gold/icons/favicon-16.png",
  ]),
  duplicateKey([
    "archive/brand-gold/icons/favicon-32-wyrd-owl-symbol.png",
    "archive/brand-gold/icons/favicon-32.png",
  ]),
  duplicateKey([
    "archive/brand-silver-source/forest/moth-frame.jpg",
    "assets/images/forest-home/silver/moth-frame.jpg",
  ]),
  duplicateKey([
    "archive/brand-silver-source/forest/poppy-frame.png",
    "assets/images/forest-home/silver/poppy-frame.png",
  ]),
]);

const errors = [];

function requireCondition(condition, message) {
  if (!condition) errors.push(message);
}

function toRepositoryPath(absolutePath) {
  return path.relative(repositoryRoot, absolutePath).split(path.sep).join("/");
}

function duplicateKey(paths) {
  return [...paths].sort().join("\n");
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function walkFiles(root) {
  const files = [];
  if (!(await exists(root))) return files;

  const entries = await readdir(root, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    if (entry.name === ".DS_Store" || entry.name === "Thumbs.db") continue;
    const target = path.join(root, entry.name);
    if (entry.isSymbolicLink()) {
      errors.push(`Symbolic links are not allowed in validated asset trees: ${toRepositoryPath(target)}`);
      continue;
    }
    if (entry.isDirectory()) files.push(...(await walkFiles(target)));
    if (entry.isFile()) files.push(target);
  }
  return files;
}

function isExternalReference(value) {
  const normalized = value.trim().toLowerCase();
  return (
    !normalized ||
    normalized.startsWith("#") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:") ||
    normalized.startsWith("http:") ||
    normalized.startsWith("https:") ||
    normalized.startsWith("mailto:") ||
    normalized.startsWith("tel:") ||
    normalized.startsWith("//") ||
    normalized.includes("${")
  );
}

function cleanReference(value) {
  return value.trim().split("#", 1)[0].split("?", 1)[0];
}

function resolveReference(source, value) {
  const cleaned = cleanReference(value);
  if (cleaned.startsWith("/")) return null;
  if (cleaned.startsWith("./assets/") || cleaned.startsWith("./public/")) {
    return path.resolve(repositoryRoot, cleaned.slice(2));
  }
  return path.resolve(path.dirname(source), cleaned);
}

function collectReferences(source, text) {
  const references = new Set();
  const extension = path.extname(source).toLowerCase();

  if (extension === ".html") {
    for (const match of text.matchAll(/\b(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi)) {
      references.add(match[1]);
    }
    for (const match of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
      for (const candidate of match[1].split(",")) {
        references.add(candidate.trim().split(/\s+/, 1)[0]);
      }
    }
  }

  if (extension === ".css") {
    for (const match of text.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)'"\s]+))\s*\)/gi)) {
      references.add(match[2] || match[3]);
    }
    for (const match of text.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) {
      references.add(match[1]);
    }
  }

  if (extension === ".js") {
    for (const match of text.matchAll(/\b(?:import|export)\s+(?:[^'";]*?\sfrom\s*)?["']([^"']+)["']/g)) {
      references.add(match[1]);
    }
    for (const match of text.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g)) {
      references.add(match[1]);
    }
  }

  if (extension === ".webmanifest") {
    const manifest = JSON.parse(text);
    for (const icon of manifest.icons || []) references.add(icon.src);
  }

  for (const match of text.matchAll(
    /["']((?:\.\.?\/)+[^"'?#\n]+\.(?:css|gif|html|jpe?g|js|m4a|mp3|png|svg|wav|webmanifest|webp)(?:\?[^"']*)?)["']/gi,
  )) {
    references.add(match[1]);
  }

  return [...references];
}

async function validateReferences() {
  const sourceFiles = [
    path.join(repositoryRoot, "index.html"),
    path.join(repositoryRoot, "manifest.webmanifest"),
    path.join(repositoryRoot, "sw.js"),
    path.join(repositoryRoot, "docs/wyrd-ui-kit.html"),
    path.join(repositoryRoot, "docs/wyrd-ui-kit.css"),
    path.join(repositoryRoot, "docs/wyrd-ui-kit.js"),
  ];

  for (const file of await walkFiles(path.join(repositoryRoot, "assets"))) {
    if (TEXT_REFERENCE_EXTENSIONS.has(path.extname(file).toLowerCase())) sourceFiles.push(file);
  }

  for (const source of sourceFiles) {
    const text = await readFile(source, "utf8");
    for (const reference of collectReferences(source, text)) {
      if (isExternalReference(reference)) continue;
      const resolved = resolveReference(source, reference);
      if (!resolved) continue;
      requireCondition(
        await exists(resolved),
        `Missing local reference: ${toRepositoryPath(source)} -> ${reference}`,
      );
    }
  }
}

async function validateNoProductionArchiveReferences() {
  const productionSources = [
    path.join(repositoryRoot, "index.html"),
    path.join(repositoryRoot, "manifest.webmanifest"),
    path.join(repositoryRoot, "sw.js"),
    path.join(repositoryRoot, "docs/wyrd-ui-kit.html"),
    path.join(repositoryRoot, "docs/wyrd-ui-kit.css"),
    path.join(repositoryRoot, "docs/wyrd-ui-kit.js"),
  ];
  for (const file of await walkFiles(path.join(repositoryRoot, "assets"))) {
    if ([".css", ".html", ".js"].includes(path.extname(file).toLowerCase())) productionSources.push(file);
  }

  for (const source of productionSources) {
    const text = await readFile(source, "utf8");
    requireCondition(
      !/(?:^|["'(\s])(?:\.\.\/|\.\/)*archive\//m.test(text),
      `Production source references archive/: ${toRepositoryPath(source)}`,
    );
  }
}

function extractRawCardBlocks(source) {
  const marker = "const RAW_CARDS = [";
  const start = source.indexOf(marker);
  if (start < 0) return [];

  const blocks = [];
  let depth = 0;
  let blockStart = -1;
  let quote = null;
  let escaped = false;
  for (let index = start + marker.length; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "{") {
      depth += 1;
      if (depth === 1) blockStart = index;
    } else if (character === "}") {
      if (depth === 1 && blockStart >= 0) blocks.push(source.slice(blockStart, index + 1));
      depth -= 1;
    } else if (character === "]" && depth === 0) {
      break;
    }
  }
  return blocks;
}

async function validateCards() {
  const expectedCount = 74;
  requireCondition(CARDS.length === expectedCount, `Expected ${expectedCount} cards, found ${CARDS.length}`);

  const names = new Set();
  const ids = new Set();
  const images = new Set();
  for (const [index, card] of CARDS.entries()) {
    const expectedId = `wyrd_${String(index + 1).padStart(3, "0")}`;
    requireCondition(card.id === expectedId, `Card ${index + 1} has id ${card.id}; expected ${expectedId}`);
    requireCondition(!ids.has(card.id), `Duplicate card id: ${card.id}`);
    requireCondition(!names.has(card.name), `Duplicate card name: ${card.name}`);
    requireCondition(!images.has(card.image), `Duplicate card image mapping: ${card.image}`);
    requireCondition(card.name === card.title_ru, `Card ${card.id} title_ru drifted from name`);
    requireCondition(Boolean(card.title_en), `Card ${card.id} is missing title_en`);
    requireCondition(Boolean(card.message) && Boolean(card.shadow), `Card ${card.id} is missing message or shadow`);
    ids.add(card.id);
    names.add(card.name);
    images.add(card.image);
  }

  const metadataNames = new Set(Object.keys(CARD_META));
  const layerNames = new Set(Object.keys(CARD_LAYERS));
  for (const name of names) {
    requireCondition(metadataNames.has(name), `Missing CARD_META entry: ${name}`);
    requireCondition(layerNames.has(name), `Missing CARD_LAYERS entry: ${name}`);
  }
  for (const name of metadataNames) requireCondition(names.has(name), `Orphan CARD_META entry: ${name}`);
  for (const name of layerNames) requireCondition(names.has(name), `Orphan CARD_LAYERS entry: ${name}`);

  const cardDirectory = path.join(repositoryRoot, "assets/images/cards");
  const diskImages = new Set(
    (await walkFiles(cardDirectory))
      .filter((file) => path.extname(file).toLowerCase() === ".webp")
      .map((file) => `./${toRepositoryPath(file)}`),
  );
  for (const image of images) requireCondition(diskImages.has(image), `Missing card image file: ${image}`);
  for (const image of diskImages) requireCondition(images.has(image), `Orphan card image file: ${image}`);

  const rawCardsSource = await readFile(path.join(repositoryRoot, "assets/js/data/cards.js"), "utf8");
  const rawBlocks = extractRawCardBlocks(rawCardsSource);
  requireCondition(rawBlocks.length === expectedCount, `Expected ${expectedCount} RAW_CARDS objects, found ${rawBlocks.length}`);
  for (const [index, block] of rawBlocks.entries()) {
    const keys = [...block.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/gm)].map((match) => match[1]);
    const seen = new Set();
    for (const key of keys) {
      requireCondition(!seen.has(key), `RAW_CARDS item ${index + 1} repeats property: ${key}`);
      seen.add(key);
    }
  }
}

function pngDimensions(buffer) {
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return [buffer.readUInt16BE(offset + 5), buffer.readUInt16BE(offset + 3)];
    }
    offset += length;
  }
  return null;
}

function webpDimensions(buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return [buffer.readUIntLE(24, 3) + 1, buffer.readUIntLE(27, 3) + 1];
  }
  if (chunk === "VP8 ") {
    const start = 20;
    for (let offset = start; offset + 10 < buffer.length; offset += 1) {
      if (buffer[offset] === 0x9d && buffer[offset + 1] === 0x01 && buffer[offset + 2] === 0x2a) {
        return [buffer.readUInt16LE(offset + 3) & 0x3fff, buffer.readUInt16LE(offset + 5) & 0x3fff];
      }
    }
  }
  if (chunk === "VP8L" && buffer[20] === 0x2f) {
    const bits = buffer.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  return null;
}

function svgDimensions(buffer) {
  const text = buffer.toString("utf8", 0, Math.min(buffer.length, 32_768));
  const viewBox = text.match(/\bviewBox\s*=\s*["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  if (viewBox) return [Number(viewBox[1]), Number(viewBox[2])];
  const width = text.match(/\bwidth\s*=\s*["']([\d.]+)/i);
  const height = text.match(/\bheight\s*=\s*["']([\d.]+)/i);
  if (width && height) return [Number(width[1]), Number(height[1])];
  return null;
}

async function imageDimensions(file) {
  const buffer = await readFile(file);
  const extension = path.extname(file).toLowerCase();
  if (extension === ".png") return pngDimensions(buffer);
  if (extension === ".jpg" || extension === ".jpeg") return jpegDimensions(buffer);
  if (extension === ".webp") return webpDimensions(buffer);
  if (extension === ".svg") return svgDimensions(buffer);
  return null;
}

async function validateImageDimensions() {
  const roots = [path.join(repositoryRoot, "assets"), path.join(repositoryRoot, "public")];
  for (const root of roots) {
    for (const file of await walkFiles(root)) {
      if (!IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
      const dimensions = await imageDimensions(file);
      requireCondition(Boolean(dimensions), `Unreadable image dimensions: ${toRepositoryPath(file)}`);
      if (!dimensions) continue;
      const [width, height] = dimensions;
      requireCondition(width > 0 && height > 0, `Invalid image dimensions: ${toRepositoryPath(file)} (${width}x${height})`);

      if (toRepositoryPath(file).startsWith("assets/images/cards/")) {
        requireCondition(width * 4 === height * 3, `Card image must be 3:4: ${toRepositoryPath(file)} (${width}x${height})`);
      }
    }
  }

  for (const [relative, expected] of EXPECTED_PUBLIC_DIMENSIONS) {
    const file = path.join(repositoryRoot, "public", relative);
    const dimensions = await imageDimensions(file);
    requireCondition(
      Boolean(dimensions) && dimensions[0] === expected[0] && dimensions[1] === expected[1],
      `Public image dimensions drifted: public/${relative}; expected ${expected[0]}x${expected[1]}, found ${dimensions?.join("x") || "unreadable"}`,
    );
  }
}

async function validateAltPolicy() {
  for (const relative of ["index.html", "docs/wyrd-ui-kit.html"]) {
    const source = path.join(repositoryRoot, relative);
    const text = await readFile(source, "utf8");
    for (const [index, match] of [...text.matchAll(/<img\b[^>]*>/gi)].entries()) {
      requireCondition(/\balt\s*=\s*["'][^"']*["']/i.test(match[0]), `${relative} image ${index + 1} is missing alt`);
    }
  }

  for (const [index, page] of SPIRIT_BOOK_PAGES.entries()) {
    requireCondition(Boolean(page.image), `Spirit Book page ${index + 1} is missing image`);
    requireCondition(Boolean(page.alt?.trim()), `Spirit Book page ${index + 1} is missing meaningful alt`);
  }

  const renderSource = await readFile(path.join(repositoryRoot, "assets/js/ui/render.js"), "utf8");
  const spreadSource = await readFile(path.join(repositoryRoot, "assets/js/ui/render-spread.js"), "utf8");
  requireCondition(
    renderSource.includes("elements.cardImage.alt = reading.card.name"),
    "Single-card renderer lost its meaningful image alt assignment",
  );
  requireCondition(
    spreadSource.includes("image.alt = card.name"),
    "Spread renderer lost its meaningful image alt assignment",
  );
}

async function validateDuplicates() {
  const groupsByHash = new Map();
  for (const relativeRoot of DUPLICATE_SCAN_ROOTS) {
    for (const file of await walkFiles(path.join(repositoryRoot, relativeRoot))) {
      const extension = path.extname(file).toLowerCase();
      if (![...IMAGE_EXTENSIONS, ".m4a", ".mp3", ".ttf", ".wav"].includes(extension)) continue;
      const hash = createHash("sha256").update(await readFile(file)).digest("hex");
      const group = groupsByHash.get(hash) || [];
      group.push(toRepositoryPath(file));
      groupsByHash.set(hash, group);
    }
  }

  const actualAllowed = new Set();
  for (const group of groupsByHash.values()) {
    if (group.length < 2) continue;
    const key = duplicateKey(group);
    if (ALLOWED_DUPLICATE_GROUPS.has(key)) actualAllowed.add(key);
    else errors.push(`Undeclared byte-identical asset group:\n  ${group.sort().join("\n  ")}`);
  }
  for (const declared of ALLOWED_DUPLICATE_GROUPS) {
    requireCondition(actualAllowed.has(declared), `Stale duplicate allowlist entry:\n  ${declared.replaceAll("\n", "\n  ")}`);
  }
}

async function validatePublicContract() {
  const publicFiles = new Set(
    (await walkFiles(path.join(repositoryRoot, "public"))).map((file) =>
      path.relative(path.join(repositoryRoot, "public"), file).split(path.sep).join("/"),
    ),
  );
  requireCondition(
    duplicateKey(publicFiles) === duplicateKey(EXPECTED_PUBLIC_FILES),
    `public/ contract drifted.\nExpected:\n  ${[...EXPECTED_PUBLIC_FILES].sort().join("\n  ")}\nActual:\n  ${[...publicFiles].sort().join("\n  ")}`,
  );

  const manifest = JSON.parse(await readFile(path.join(repositoryRoot, "manifest.webmanifest"), "utf8"));
  const manifestIcons = new Set(
    (manifest.icons || []).map((icon) => `${icon.src}|${icon.sizes}|${icon.purpose}`),
  );
  requireCondition(
    duplicateKey(manifestIcons) === duplicateKey(EXPECTED_MANIFEST_ICONS),
    "manifest.webmanifest icon contract drifted from the approved any/maskable/monochrome set",
  );

  const index = await readFile(path.join(repositoryRoot, "index.html"), "utf8");
  for (const reference of [
    "./public/favicon-wyrd-thorn-seal.svg",
    "./public/favicon-32-wyrd-thorn-seal.png",
    "./public/favicon-16-wyrd-thorn-seal.png",
    "./public/apple-touch-icon-wyrd-thorn-seal.png",
    "https://yukisakura13.github.io/WYRD/public/social/og-square-wyrd-hare-title.png",
    "https://yukisakura13.github.io/WYRD/public/social/og-wide-wyrd-hare-title.png",
  ]) {
    requireCondition(index.includes(reference), `index.html lost approved public reference: ${reference}`);
  }
}

async function validateServiceWorkerPolicy() {
  const source = await readFile(path.join(repositoryRoot, "sw.js"), "utf8");
  for (const contract of [
    'new URLSearchParams(self.location.search).get("v")',
    "`wyrd-runtime-${BUILD_ID}-${CACHE_VERSION}`",
    'new Set(["image", "audio", "video", "font"])',
    'caches.keys().then((keys)',
    'keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))',
    'fetch(request, { cache: "no-store" })',
  ]) {
    requireCondition(source.includes(contract), `Service worker cache policy lost contract: ${contract}`);
  }
  requireCondition(
    !/(?:PRECACHE|CACHE_URLS|STATIC_ASSETS)\s*=\s*\[/i.test(source),
    "Service worker introduced a static cache manifest that can drift from runtime assets",
  );
}

async function main() {
  await validateReferences();
  await validateNoProductionArchiveReferences();
  await validateCards();
  await validateImageDimensions();
  await validateAltPolicy();
  await validateDuplicates();
  await validatePublicContract();
  await validateServiceWorkerPolicy();

  if (errors.length) {
    console.error(`Asset/content integrity validation failed (${errors.length}):`);
    for (const [index, error] of errors.entries()) console.error(`${index + 1}. ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Asset/content integrity passed: ${CARDS.length} cards, ${EXPECTED_PUBLIC_FILES.size} public exports, references, dimensions, alt policy, duplicates and cache policy verified.`,
  );
}

await main();
