const SILVER = "#cdd1cf";
const COMPACT_MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const FULL_MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
const KNOWN_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
const MS_PER_DAY = 86400000;
const LUNAR_CYCLE = 29.53058770576;
let moonIconId = 0;

const LUNAR_PHASE_ASSETS = Object.freeze({
  nm: "./assets/images/lunar-phases/moon-new.webp",
  wc: "./assets/images/lunar-phases/moon-waxing-crescent.webp",
  fq: "./assets/images/lunar-phases/moon-first-quarter.webp",
  wg: "./assets/images/lunar-phases/moon-waxing-gibbous.webp",
  fm: "./assets/images/lunar-phases/moon-full.webp",
  wag: "./assets/images/lunar-phases/moon-waning-gibbous.webp",
  lq: "./assets/images/lunar-phases/moon-last-quarter.webp",
  wac: "./assets/images/lunar-phases/moon-waning-crescent.webp",
});

const LUNAR_DAY_PHASE_LABELS = Object.freeze({
  nm: "новолуние",
  wc: "растущая луна",
  fq: "растущая луна",
  wg: "растущая луна",
  fm: "полнолуние",
  wag: "убывающая луна",
  lq: "убывающая луна",
  wac: "убывающая луна",
});

export function getMoonPhase(date) {
  const phase = getMoonAge(date);

  if (phase < 1.85) {
    return { name: "новолуние", type: "nm" };
  }
  if (phase < 7.38) {
    return { name: "растущий серп", type: "wc" };
  }
  if (phase < 11.08) {
    return { name: "первая четверть", type: "fq" };
  }
  if (phase < 14.77) {
    return { name: "растущая луна", type: "wg" };
  }
  if (phase < 16.62) {
    return { name: "полнолуние", type: "fm" };
  }
  if (phase < 20.31) {
    return { name: "убывающая луна", type: "wag" };
  }
  if (phase < 24) {
    return { name: "последняя четверть", type: "lq" };
  }

  return { name: "убывающий серп", type: "wac" };
}

export function getLunarDayState(date = new Date()) {
  const reference = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  const age = getMoonAge(reference);
  const day = Math.min(30, Math.floor(age) + 1);

  return {
    age,
    dateKey: formatLocalDateKey(reference),
    day,
    phase: getMoonPhase(reference),
    reference,
  };
}

export function getLunarDayPhaseLabel(type) {
  return LUNAR_DAY_PHASE_LABELS[type] || LUNAR_DAY_PHASE_LABELS.nm;
}

export function createLunarPhaseImage(type) {
  const image = document.createElement("img");
  image.className = "lunar-day-moon__image";
  image.src = LUNAR_PHASE_ASSETS[type] || LUNAR_PHASE_ASSETS.nm;
  image.alt = "";
  image.width = 512;
  image.height = 512;
  image.decoding = "async";
  image.draggable = false;
  return image;
}

export function formatTraceDate(date) {
  return `${date.getDate()}\u00a0${COMPACT_MONTHS[date.getMonth()]}`;
}

export function formatFullTraceDate(date) {
  return `${date.getDate()}\u00a0${FULL_MONTHS[date.getMonth()]}`;
}

function getMoonAge(date) {
  const daysSince = (date - KNOWN_NEW_MOON) / MS_PER_DAY;
  return ((daysSince % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
}

function formatLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createMoonIcon(type) {
  const id = `moon-clip-${moonIconId}`;
  moonIconId += 1;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "44");
  svg.setAttribute("height", "44");
  svg.setAttribute("viewBox", "0 0 18 18");
  svg.setAttribute("aria-hidden", "true");

  const defs = createSvgNode("defs");
  const clipPath = createSvgNode("clipPath", { id });
  clipPath.append(createSvgNode("circle", { cx: "9", cy: "9", r: "7" }));
  defs.append(clipPath);
  svg.append(defs);

  if (type === "fm") {
    svg.append(createMoonCircle({ fill: SILVER }));
    return svg;
  }

  if (type === "fq" || type === "lq") {
    const group = createSvgNode("g", { "clip-path": `url(#${id})` });
    group.append(createSvgNode("rect", { x: type === "fq" ? "9" : "2", y: "2", width: "7", height: "14", fill: SILVER }));
    group.append(createMoonCircle({ fill: "none", stroke: SILVER, "stroke-width": "0.9" }));
    svg.append(group);
    return svg;
  }

  if (type === "wc" || type === "wac") {
    const group = createSvgNode("g", { "clip-path": `url(#${id})` });
    group.append(
      createSvgNode("ellipse", {
        cx: type === "wc" ? "12.2" : "5.8",
        cy: "9",
        rx: "5.4",
        ry: "7",
        fill: SILVER,
      }),
    );
    group.append(createMoonCircle({ fill: "none", stroke: SILVER, "stroke-width": "0.9" }));
    svg.append(group);
    return svg;
  }

  if (type === "wg" || type === "wag") {
    const group = createSvgNode("g", { "clip-path": `url(#${id})` });
    group.append(createMoonCircle({ fill: SILVER }));
    group.append(
      createSvgNode("ellipse", {
        cx: type === "wg" ? "5.2" : "12.8",
        cy: "9",
        rx: "3.8",
        ry: "7",
        fill: "#12121c",
      }),
    );
    group.append(createMoonCircle({ fill: "none", stroke: SILVER, "stroke-width": "0.9" }));
    svg.append(group);
    return svg;
  }

  svg.append(createMoonCircle({ fill: "none", stroke: SILVER, "stroke-width": "1.1" }));
  return svg;
}

function createMoonCircle(attributes = {}) {
  return createSvgNode("circle", { cx: "9", cy: "9", r: "7", ...attributes });
}

function createSvgNode(name, attributes = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);

  Object.entries(attributes).forEach(function setAttribute([key, value]) {
    node.setAttribute(key, value);
  });

  return node;
}
