const GOLD = "#c9a14a";
let moonIconId = 0;

export function getMoonPhase(date) {
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const msPerDay = 86400000;
  const lunarCycle = 29.53058770576;
  const daysSince = (date - knownNewMoon) / msPerDay;
  const phase = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;

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

export function formatTraceDate(date) {
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

  return `${date.getDate()}\u00a0${months[date.getMonth()]}`;
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
    svg.append(createMoonCircle({ fill: GOLD }));
    return svg;
  }

  if (type === "fq" || type === "lq") {
    const group = createSvgNode("g", { "clip-path": `url(#${id})` });
    group.append(createSvgNode("rect", { x: type === "fq" ? "9" : "2", y: "2", width: "7", height: "14", fill: GOLD }));
    group.append(createMoonCircle({ fill: "none", stroke: GOLD, "stroke-width": "0.9" }));
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
        fill: GOLD,
      }),
    );
    group.append(createMoonCircle({ fill: "none", stroke: GOLD, "stroke-width": "0.9" }));
    svg.append(group);
    return svg;
  }

  if (type === "wg" || type === "wag") {
    const group = createSvgNode("g", { "clip-path": `url(#${id})` });
    group.append(createMoonCircle({ fill: GOLD }));
    group.append(
      createSvgNode("ellipse", {
        cx: type === "wg" ? "5.2" : "12.8",
        cy: "9",
        rx: "3.8",
        ry: "7",
        fill: "#12121c",
      }),
    );
    group.append(createMoonCircle({ fill: "none", stroke: GOLD, "stroke-width": "0.9" }));
    svg.append(group);
    return svg;
  }

  svg.append(createMoonCircle({ fill: "none", stroke: GOLD, "stroke-width": "1.1" }));
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
