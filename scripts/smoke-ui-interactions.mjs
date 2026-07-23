import assert from "node:assert/strict";
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

console.log("WYRD UI interaction smoke tests passed");
