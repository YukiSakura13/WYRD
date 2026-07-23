import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { shouldDismissHistoryDrag } from "../assets/js/ui/history-sheet-drag.js";

assert.equal(
  shouldDismissHistoryDrag({ distance: 9, elapsed: 8, panelHeight: 640 }),
  false,
  "movement below the gesture threshold must not dismiss",
);

assert.equal(
  shouldDismissHistoryDrag({ distance: 25, elapsed: 20, panelHeight: 640 }),
  false,
  "a short flick must not dismiss accidentally",
);

assert.equal(
  shouldDismissHistoryDrag({ distance: 80, elapsed: 120, panelHeight: 640 }),
  true,
  "a deliberate downward flick should dismiss",
);

assert.equal(
  shouldDismissHistoryDrag({ distance: 160, elapsed: 900, panelHeight: 640 }),
  true,
  "a slow drag over the distance threshold should dismiss",
);

const [kitHtml, kitCss, kitJs, uiRules] = await Promise.all([
  readFile(new URL("../docs/wyrd-ui-kit.html", import.meta.url), "utf8"),
  readFile(new URL("../docs/wyrd-ui-kit.css", import.meta.url), "utf8"),
  readFile(new URL("../docs/wyrd-ui-kit.js", import.meta.url), "utf8"),
  readFile(new URL("../docs/WYRD_UI_RULES.md", import.meta.url), "utf8"),
]);

assert.match(
  kitHtml,
  /public\/apple-touch-icon-wyrd-owl-symbol\.png/,
  "Feedback and Motion Success must use the canonical Oracle owl",
);

for (const scenario of ["breath", "reveal", "drift", "success"]) {
  assert.match(
    kitHtml,
    new RegExp(`data-motion-preview="${scenario}"`),
    `Motion Lab must expose the ${scenario} scenario`,
  );
  assert.match(
    kitJs,
    new RegExp(`${scenario}:\\s*\\{`),
    `Motion Lab must document and implement the ${scenario} scenario`,
  );
}

assert.match(kitHtml, /data-motion-play/, "Motion Lab must require an explicit play action");
assert.match(kitHtml, /data-motion-reduced/, "Motion Lab must expose its reduced-motion fallback");
assert.doesNotMatch(
  kitHtml,
  /<script[^>]+type="module"[^>]+wyrd-ui-kit\.js/,
  "The UI Kit interaction script must also run when the HTML file is opened directly",
);
assert.doesNotMatch(
  kitJs,
  /^\s*import\s/m,
  "The standalone UI Kit interaction script must not depend on file-blocked module imports",
);
assert.match(
  kitJs,
  /selectMotionScenario\(button\.dataset\.motionPreview\);\s*playMotionScenario\(\);/,
  "Choosing a Motion Lab scenario must select and immediately replay it like the source kit",
);
assert.match(kitJs, /breath:\s*\{[\s\S]*?duration:\s*800/, "Breath must use the source 800 ms timing");
assert.match(kitJs, /reveal:\s*\{[\s\S]*?duration:\s*800/, "Reveal must use the source 800 ms timing");
assert.match(kitJs, /drift:\s*\{[\s\S]*?duration:\s*800/, "Drift must use the source 800 ms timing");
assert.match(kitJs, /success:\s*\{[\s\S]*?duration:\s*320/, "Success must use the source 320 ms timing");
assert.doesNotMatch(
  kitHtml,
  /motion-lab__success-sign[\s\S]{0,120}<span/,
  "Motion Success must not draw invented horizontal lines through the card",
);
assert.doesNotMatch(
  kitHtml,
  /data-page-index="\d"[^>]*>\s*<img/,
  "Pager indicators must use the quiet source diamonds rather than ornamental images",
);
assert.match(
  kitCss,
  /\.page-indicators button::before\s*\{[\s\S]*?width:\s*4px;[\s\S]*?height:\s*4px;/,
  "Pager indicators must preserve the source kit's quiet 4 px diamonds",
);
assert.match(
  kitCss,
  /\.kit-toggle::before\s*\{[\s\S]*?clip-path:\s*polygon\(/,
  "Toggle tracks must preserve the source kit's clipped silver mechanism",
);
assert.match(
  kitHtml,
  /<button[\s\S]*?class="toggle-setting"[\s\S]*?role="switch"[\s\S]*?data-switch-label="Серебряная пыль"[\s\S]*?data-kit-toggle/,
  "The entire switch row must be the interactive switch, matching the source kit",
);
assert.doesNotMatch(
  kitHtml,
  /<div class="toggle-setting">[\s\S]{0,500}<button[\s\S]{0,120}class="kit-toggle"/,
  "Switches must not reduce interaction to a small nested control",
);
assert.match(
  kitCss,
  /\.toggle-setting:focus-visible\s*\{[\s\S]*?outline:\s*2px solid rgba\(225,\s*228,\s*225,\s*0\.76\);[\s\S]*?outline-offset:\s*3px;/,
  "Switch row focus must restore the source kit's thin silver highlight",
);
assert.match(
  kitCss,
  /\.toggle-setting:hover:not\(:disabled\)\s*\{[\s\S]*?background:\s*rgba\(31,\s*35,\s*48,\s*0\.18\);/,
  "Switch row hover must highlight the whole row like the source kit",
);
assert.match(
  kitCss,
  /feedback-oracle-listen 2\.6s/,
  "Loading feedback must preserve the source kit's listening breath",
);
assert.match(
  kitHtml,
  /data-question-count>0 \/ 120</,
  "Question field must expose the source character counter",
);
assert.match(
  kitHtml,
  /maxlength="120"[\s\S]{0,160}data-question-input/,
  "Question field must preserve the source 120-character interaction contract",
);
assert.match(
  kitJs,
  /questionCount\.textContent = `\$\{currentLength\} \/ \$\{maximumLength\}`/,
  "Question field count must update from the actual input length",
);
assert.match(
  kitHtml,
  /data-sheet-open/,
  "Row / Sheet must expose the source sheet opener",
);
assert.match(
  kitHtml,
  /role="dialog"[\s\S]{0,180}aria-modal="true"[\s\S]{0,180}data-kit-sheet/,
  "The source sheet mechanic must be represented by an accessible modal",
);
assert.match(
  kitJs,
  /sheetReturnFocus\?\.focus\(\)/,
  "Closing the sheet must restore focus to its opener",
);
assert.match(
  kitJs,
  /event\.key === "Escape"/,
  "The sheet must close from the Escape key",
);
assert.match(
  kitHtml,
  /data-card-reveal[\s\S]{0,1200}data-card-reveal-trigger/,
  "The source ritual card reveal mechanic must be present",
);
assert.match(
  kitHtml,
  /class="quiet-card-specimen card-context-action"[\s\S]{0,180}type="button"/,
  "Quiet card specimen must preserve the source kit's interactive card target",
);
assert.match(
  kitHtml,
  /class="history-card-specimen card-context-action"[\s\S]{0,180}type="button"/,
  "History card specimen must preserve the source kit's interactive row target",
);
assert.match(
  kitCss,
  /\.card-reveal__inner\s*\{[\s\S]*?transition:\s*transform 800ms/,
  "Ritual card reveal must preserve the source 800 ms timing",
);
assert.match(kitHtml, /id="implementation"/, "Silver UI Kit must include implementation handoff");
assert.doesNotMatch(
  kitHtml,
  /moon-metadata--inline/,
  "Moon phase and date must never collapse into the deprecated one-line layout",
);
assert.match(
  kitHtml,
  /Compact · history \/ result[\s\S]{0,500}moon-metadata--stacked/,
  "Compact history and result metadata must keep the date on its own line",
);
assert.match(
  kitCss,
  /\.moon-metadata time\s*\{[\s\S]*?text-transform:\s*none;/,
  "Moon metadata dates must preserve the authored lowercase month name",
);
assert.match(
  kitCss,
  /\.moon-metadata--stacked\s*\{[\s\S]*?grid-template-columns:\s*var\(--moon-metadata-icon-size\)\s+max-content;/,
  "Moon metadata must use a shared icon-and-copy grid",
);
assert.match(
  kitCss,
  /\.moon-metadata--stacked time\s*\{[\s\S]*?grid-column:\s*2;[\s\S]*?justify-self:\s*start;/,
  "Moon metadata dates must align with the phase name on the second row",
);
assert.match(
  kitCss,
  /\.share-card-specimen__meta time\s*\{[\s\S]*?grid-column:\s*2;[\s\S]*?text-align:\s*left;/,
  "Share-card dates must use the same second-row alignment as the metadata rules",
);
assert.match(
  kitCss,
  /\.toggle-setting\[aria-checked="true"\] \.kit-toggle img\s*\{[\s\S]*?rgba\(229,\s*236,\s*239,\s*0\.52\)[\s\S]*?rgba\(177,\s*196,\s*210,\s*0\.3\)/,
  "Checked toggle diamonds must preserve the source kit's two-layer silver glow",
);
assert.match(
  kitCss,
  /\.motion-lab__stage\.is-reduced/,
  "Motion Lab must keep each state visible without animation",
);
assert.doesNotMatch(
  uiRules,
  /primary gold|quiet gold link|final outline gold|var\(--gold\)/i,
  "Active UI rules must not restore gold-era controls",
);

console.log("WYRD UI interaction smoke tests passed");
