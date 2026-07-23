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
assert.match(kitHtml, /id="implementation"/, "Silver UI Kit must include implementation handoff");
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
