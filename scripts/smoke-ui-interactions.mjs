import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  getHistoryUpwardResistance,
  resolveHistoryDragAxis,
  shouldDismissHistoryDrag,
} from "../assets/js/ui/history-sheet-drag.js";
import {
  getNotificationPolicy,
  getNotificationSemantics,
} from "../assets/js/ui/notification-center.js";
import { formatFullTraceDate } from "../assets/js/ui/moon.js";
import {
  acceptSpiritBookNavigation,
  SPIRIT_BOOK_NAVIGATION_LOCK_MS,
} from "../assets/js/ui/spirit-book-navigation.js";

assert.equal(
  formatFullTraceDate(new Date(2026, 7, 3, 12)),
  "3\u00a0августа",
  "Result metadata must use the full lowercase month name",
);

const spiritBookNavigationState = {};
assert.equal(
  acceptSpiritBookNavigation(spiritBookNavigationState, 1_000),
  true,
  "the first Spirit Book navigation gesture must be accepted",
);
assert.equal(
  acceptSpiritBookNavigation(spiritBookNavigationState, 1_000 + SPIRIT_BOOK_NAVIGATION_LOCK_MS - 1),
  false,
  "a duplicate activation inside the Spirit Book lock must not skip a chapter",
);
assert.equal(
  acceptSpiritBookNavigation(spiritBookNavigationState, 1_000 + SPIRIT_BOOK_NAVIGATION_LOCK_MS),
  true,
  "Spirit Book navigation must unlock after 280ms",
);

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

assert.equal(
  resolveHistoryDragAxis({ deltaX: 6, deltaY: 8 }),
  null,
  "history drag must wait for the 10px direction threshold",
);
assert.equal(
  resolveHistoryDragAxis({ deltaX: 14, deltaY: 4 }),
  "horizontal",
  "horizontal history intent must be cancelled rather than dismissed",
);
assert.equal(
  resolveHistoryDragAxis({ deltaX: 4, deltaY: 14 }),
  "vertical",
  "vertical history intent must activate the sheet drag",
);
assert.equal(getHistoryUpwardResistance(0), 0, "upward resistance must start at zero");
assert.ok(
  getHistoryUpwardResistance(320) <= 8,
  "history sheet upward resistance must never exceed eight pixels",
);
assert.deepEqual(
  getNotificationSemantics("success"),
  { role: "status", live: "polite" },
  "success feedback must remain polite",
);
assert.deepEqual(
  getNotificationSemantics("error"),
  { role: "alert", live: "assertive" },
  "error feedback must be assertive",
);

const [
  kitHtml,
  kitCss,
  kitJs,
  uiRules,
  tokens,
  runtimeHtml,
  runtimeStyles,
  actionButtonCss,
  coverCta,
  readingSilver,
  silverComponents,
  controlLanguage,
  runtimeBase,
  runtimeActions,
  runtimeRender,
  runtimeSpread,
  runtimeShare,
  settingsCss,
  spiritBookCss,
  dialogsCss,
  notificationsCss,
  dialogController,
  notificationCenter,
  historySheetDrag,
  stateModel,
  stateStorage,
  runtimeAudio,
  runtimeMoon,
] =
  await Promise.all([
    readFile(new URL("../docs/wyrd-ui-kit.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/wyrd-ui-kit.css", import.meta.url), "utf8"),
    readFile(new URL("../docs/wyrd-ui-kit.js", import.meta.url), "utf8"),
    readFile(new URL("../docs/WYRD_UI_RULES.md", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/tokens.css", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/components/action-buttons.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/cover-cta.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/scenes/reading-silver.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/components/silver-components.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/components/control-language.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/base.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/actions.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/render.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/render-spread.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/share.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/scenes/settings.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/scenes/spirit-book.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/components/dialogs.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/components/notifications.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/dialog-controller.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/notification-center.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/history-sheet-drag.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/state/model.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/state/storage.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/audio.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/moon.js", import.meta.url), "utf8"),
  ]);

const spreadProfileCss = await readFile(
  new URL("../assets/css/components/spread-profile.css", import.meta.url),
  "utf8",
);

assert.doesNotMatch(
  runtimeHtml,
  /ui-icon-button ui-icon-button--close btn-back-circle history-sheet-close/,
  "History Close must not combine the Silver icon-button and legacy gold circle families",
);
assert.match(
  runtimeActions,
  /historySheetOpenedWithKeyboard = event\.detail === 0/,
  "History sheet must distinguish pointer opening from keyboard or assistive activation",
);
assert.match(
  runtimeRender,
  /historySheetOpenedWithKeyboard[\s\S]*?\[data-action='close-history-entry'\][\s\S]*?elements\.historySheet/,
  "History sheet must expose Close focus for keyboard opening without drawing it on pointer opening",
);
assert.match(
  spreadProfileCss,
  /\.history-sheet-card img\s*\{[\s\S]*?width:\s*clamp\(9\.375rem, 40vw, 10\.625rem\);/,
  "History detail artwork must preserve the approved compact 150-170px range",
);
assert.match(
  spreadProfileCss,
  /@media \(min-width: 30rem\) and \(max-height: 48rem\)[\s\S]*?grid-template-columns:\s*minmax\(9\.375rem, 10\.625rem\) minmax\(0, 1fr\);/,
  "Short wide history sheets must use the compact two-column fallback",
);

assert.match(
  runtimeMoon,
  /const SILVER = "#cdd1cf";/,
  "Shared moon icons must use the approved Silver tone",
);
assert.doesNotMatch(
  runtimeMoon,
  /#c9a14a|\bGOLD\b/,
  "Shared moon icons must not reintroduce the legacy gold tone",
);

assert.match(
  kitHtml,
  /public\/apple-touch-icon-wyrd-thorn-seal\.png/,
  "Feedback and Motion Success must use the canonical Forest Seal",
);

for (const reference of [
  "public/favicon-wyrd-thorn-seal-dark.svg",
  "public/favicon-32-wyrd-thorn-seal-dark.png",
  "public/favicon-16-wyrd-thorn-seal-dark.png",
]) {
  assert.match(
    runtimeHtml,
    new RegExp(reference.replace(".", "\\.")),
    `Runtime must expose its default dark Forest Seal favicon: ${reference}`,
  );
}
for (const reference of [
  "favicon-wyrd-thorn-seal-${tone}.svg",
  "favicon-32-wyrd-thorn-seal-${tone}.png",
  "favicon-16-wyrd-thorn-seal-${tone}.png",
]) {
  assert.ok(
    runtimeHtml.includes(reference),
    `Runtime must switch the complete Forest Seal favicon family: ${reference}`,
  );
}
assert.match(
  runtimeHtml,
  /matchMedia\("\(prefers-color-scheme: dark\)"\)/,
  "Runtime must select the contrasting Forest Seal favicon for the active system theme",
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
for (const [token, value] of [
  ["--layout-deck-header-min-height", "4.5rem"],
  ["--layout-deck-question-max", "20rem"],
  ["--layout-deck-artifact-max", "21.5rem"],
  ["--layout-deck-artifact-inline-fit", "86vw"],
  ["--layout-deck-artifact-block-fit", "43svh"],
  ["--layout-deck-artifact-short-max", "14.25rem"],
  ["--layout-deck-intent-thread", "2rem"],
  ["--motion-deck-idle", "7200ms"],
]) {
  assert.match(
    tokens,
    new RegExp(`${token}:\\s*${value.replace(".", "\\.")}`),
    `Deck composition must keep ${token} at ${value}`,
  );
}
assert.match(
  kitHtml,
  /data-deck-composition[\s\S]{0,1800}data-deck-composition-card/,
  "The UI Kit must include the approved Field-to-Raven Deck composition",
);
assert.match(
  silverComponents,
  /\.wyrd-deck-composition__question\s*\{[\s\S]*?--layout-deck-question-max/,
  "The shared Deck composition must consume the canonical 320 px Field token",
);
assert.match(
  silverComponents,
  /\.wyrd-deck-composition__question\s*\{[\s\S]*?max-width:\s*var\(--layout-deck-artifact-block-fit\)/,
  "The Deck Field must narrow with the Artifact on height-constrained screens",
);
assert.match(
  silverComponents,
  /\.wyrd-deck-artifact\s*\{[\s\S]*?--layout-deck-artifact-inline-fit[\s\S]*?--layout-deck-artifact-block-fit[\s\S]*?--layout-deck-artifact-max/,
  "The shared Deck composition must consume the approved responsive Artifact tokens",
);
assert.match(
  silverComponents,
  /\.wyrd-deck-composition\.is-intent-transferred \.wyrd-deck-artifact::after\s*\{[\s\S]*?wyrd-deck-intent-thread/,
  "Accepted intent must replay the approved one-shot silver thread",
);
assert.match(
  silverComponents,
  /wyrd-deck-idle-face var\(--motion-deck-idle\)[\s\S]*?@keyframes wyrd-deck-idle-face[\s\S]*?78%[\s\S]*?translateY\(-2px\)/,
  "The canonical Deck must keep the rare 7200 ms two-pixel idle answer",
);
assert.match(
  silverComponents,
  /\.wyrd-deck-artifact__face::before[\s\S]*?width:\s*36%;[\s\S]*?wyrd-deck-idle-edge/,
  "The canonical Deck idle answer must use only a short upper-edge silver glint",
);
assert.match(
  kitJs,
  /function replayDeckIntent\(\)[\s\S]*?is-intent-transferred[\s\S]*?920/,
  "The UI Kit Deck specimen must replay and then clear its one-shot intent state",
);
assert.match(
  readingSilver,
  /#deck-wrap \.deck-touch-copy,[\s\S]*?min-height:\s*2\.75rem;[\s\S]*?color:\s*rgba\(225,\s*228,\s*225,\s*0\.58\);[\s\S]*?font-size:\s*1rem;[\s\S]*?font-weight:\s*400;[\s\S]*?letter-spacing:\s*0\.025em;/,
  "Runtime Deck invitation must read as a quiet accessible hint rather than a separate CTA",
);
assert.match(
  readingSilver,
  /#deck-wrap \.wyrd-deck-artifact\s*\{[\s\S]*?69vw[\s\S]*?var\(--layout-deck-artifact-block-fit\)/,
  "Runtime Deck must fit the complete three-card fan inside the mobile viewport",
);
assert.match(
  readingSilver,
  /#deck-wrap \.wyrd-deck-artifact\s*\{[\s\S]*?--deck-spread:\s*1;/,
  "Runtime Deck must keep the exact reference fan as the default review value",
);
assert.match(
  readingSilver,
  /#deck-wrap :is\(\.wyrd-deck-artifact__stack, \.wyrd-deck-artifact__face\)\s*\{[\s\S]*?transform-origin:\s*50% 50%/,
  "Runtime Deck cards must use the measured centre-origin reference geometry",
);
assert.match(
  readingSilver,
  /\.wyrd-deck-artifact__stack--left\s*\{[\s\S]*?translate:[\s\S]*?-10\.66%[\s\S]*?-0\.58%[\s\S]*?rotate:\s*calc\(1\.4deg - 4\.7deg \* var\(--deck-spread, 1\)\)[\s\S]*?\.wyrd-deck-artifact__stack--mid\s*\{[\s\S]*?translate:\s*0 0;[\s\S]*?rotate:\s*1\.4deg;[\s\S]*?\.wyrd-deck-artifact__face\s*\{[\s\S]*?translate:[\s\S]*?11\.38%[\s\S]*?0\.87%[\s\S]*?rotate:\s*calc\(1\.4deg \+ 3\.1deg \* var\(--deck-spread, 1\)\)/,
  "Runtime Deck must preserve the measured asymmetric three-card reference through one spread control",
);
assert.match(
  readingSilver,
  /--motion-runtime-deck-idle:\s*6200ms[\s\S]*?@keyframes wyrd-runtime-deck-fan-face[\s\S]*?72%[\s\S]*?translate3d\(0, 0, 0\)[\s\S]*?84%[\s\S]*?translate3d\(0, -3px, 0\)/,
  "Runtime Deck must keep the approved rare 6200 ms three-pixel physical answer independent from static geometry",
);
assert.equal(
  (runtimeHtml.match(/data-action="draw"/g) || []).length,
  1,
  "Runtime Deck must expose exactly one draw control and one tab stop",
);
assert.match(
  runtimeHtml,
  /<button class="deck-interaction"[^>]*data-action="draw"[\s\S]*?<span class="deck-card ui-card-action wyrd-deck-artifact"[\s\S]*?<span class="deck-touch-copy wyrd-deck-composition__touch"/,
  "Runtime Deck Artifact and invitation must live inside one accessible button",
);
assert.match(
  readingSilver,
  /\.wyrd-deck-artifact__stack--left::before\s*\{[\s\S]*?rgba\(4,\s*6,\s*10,\s*0\.27\)[\s\S]*?\.wyrd-deck-artifact__stack::after/,
  "Runtime rear cards must stay opaque while only their internal artwork is veiled",
);
assert.match(
  readingSilver,
  /@keyframes wyrd-runtime-deck-light-well[\s\S]*?opacity:\s*0\.88[\s\S]*?84%[\s\S]*?opacity:\s*1/,
  "Runtime Deck must have a restrained lower light well that answers with the idle breath",
);
assert.match(
  runtimeHtml,
  /<span class="deck-atmosphere" aria-hidden="true">[\s\S]*?<span class="deck-fireflies">[\s\S]*?<header class="deck-header ui-app-header/,
  "Runtime Deck atmosphere must be a full-scene decorative layer behind the header, Field, Deck and text",
);
const deckFirefliesMarkup = runtimeHtml.match(
  /<span class="deck-fireflies">([\s\S]*?)<\/span>/,
)?.[1] || "";
assert.equal(
  (deckFirefliesMarkup.match(/<i><\/i>/g) || []).length,
  24,
  "Runtime Deck must keep a restrained 24-spark full-scene field",
);
assert.match(
  readingSilver,
  /#deck-wrap \.deck-atmosphere\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;[\s\S]*?z-index:\s*0;[\s\S]*?#deck-wrap > :not\(\.deck-atmosphere\)\s*\{[\s\S]*?z-index:\s*1;/,
  "Runtime sparks and mist must stay above the scene background and below all content",
);
assert.match(
  readingSilver,
  /--deck-mist-opacity-low:\s*0\.16;[\s\S]*?--deck-mist-opacity-high:\s*0\.24;[\s\S]*?\.deck-atmosphere-mist--front\s*\{[\s\S]*?--deck-mist-opacity-low:\s*0\.08;[\s\S]*?--deck-mist-opacity-high:\s*0\.14;/,
  "Runtime full-scene mist must stay quieter than the Deck-local light well",
);
assert.match(
  readingSilver,
  /@keyframes wyrd-runtime-deck-spark-rise[\s\S]*?-108svh/,
  "Runtime sparks must rise through the complete screen rather than stay localized behind the Deck",
);
assert.match(
  readingSilver,
  /\.deck-question-shell\.wyrd-question-field__shell::before\s*\{[\s\S]*?display:\s*none;[\s\S]*?\.deck-question-shell\.wyrd-question-field__shell:focus-within\s*\{[\s\S]*?border-color:\s*rgba\(225,\s*228,\s*225,\s*0\.7\);/,
  "Runtime Field must use one quieter outer contour while its canonical orbit carries the spark",
);
assert.match(
  readingSilver,
  /\.deck-interaction\s*\{[\s\S]*?gap:\s*0\.25rem;[\s\S]*?\.deck-touch-copy,[\s\S]*?color:\s*rgba\(225,\s*228,\s*225,\s*0\.58\);[\s\S]*?font-size:\s*1rem;[\s\S]*?font-weight:\s*400;[\s\S]*?letter-spacing:\s*0\.025em;/,
  "Runtime Deck invitation must remain a close, quiet and readable hint rather than a competing CTA",
);
assert.match(
  readingSilver,
  /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.deck-atmosphere-mist\s*\{[\s\S]*?opacity:\s*var\(--deck-mist-opacity-low\);/,
  "Reduced motion must not make the lower mist heavier than the approved static atmosphere",
);
assert.match(
  readingSilver,
  /#deck-wrap \.wyrd-deck-composition__question\s*\{[\s\S]*?margin-inline-start:\s*4px;[\s\S]*?margin-inline-end:\s*max\([\s\S]*?var\(--layout-oracle-content\)[\s\S]*?justify-self:\s*stretch;[\s\S]*?\.deck-question-shell\.wyrd-question-field__shell,[\s\S]*?min-height:\s*5rem;[\s\S]*?\.deck-question-input\.wyrd-question-field__input\s*\{[\s\S]*?padding-block:\s*0\.85rem;/,
  "Runtime Field must align from the visible Back edge to the front-card corner and hold two text lines",
);
assert.match(
  readingSilver,
  /orientation:\s*portrait[\s\S]*?min-width:\s*31\.25rem[\s\S]*?min-height:\s*50rem[\s\S]*?\.wyrd-deck-composition__question\s*\{[\s\S]*?margin-inline-end:\s*-1px;/,
  "Tall portrait screens must keep the Field aligned after the Deck reaches its maximum width",
);
assert.match(
  readingSilver,
  /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.deck-fireflies\s*\{[\s\S]*?display:\s*none;/,
  "Runtime full-screen sparks must disappear when reduced motion is requested",
);
assert.match(
  readingSilver,
  /orientation:\s*landscape[\s\S]*?grid-template-columns:[\s\S]*?\.wyrd-deck-composition__question[\s\S]*?grid-column:\s*1[\s\S]*?\.wyrd-deck-composition__artifact-zone[\s\S]*?grid-column:\s*2/,
  "Short landscape must use the approved two-column question and Deck contract",
);
assert.doesNotMatch(
  runtimeHtml,
  /deck-whisper-zone/,
  "Runtime Deck must not retain the removed bottom whisper block",
);
assert.doesNotMatch(
  silverComponents,
  /wyrd-deck-intent-spark|is-entering|ellipse 42% 60% at 50% 57%/,
  "Restored Deck must not keep the rejected field spark, entry settle, or static light well",
);
assert.doesNotMatch(
  kitCss,
  /\.wyrd-deck-artifact[\s\S]{0,500}moonAnswerPulse/,
  "The approved Deck composition must not restore the legacy moon pulse",
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
  /sheetReturnFocus\?\.focus\(\{ preventScroll: true \}\)/,
  "Closing the sheet must restore focus to its opener",
);
assert.match(
  kitJs,
  /event\.key === "Escape"/,
  "The sheet must close from the Escape key",
);
assert.match(
  kitJs,
  /addEventListener\("transitionend", sheetTransitionHandler\)[\s\S]*?transition\.total \+ 80/,
  "The canonical Sheet must close from its real transition with a measured fallback",
);
assert.match(
  kitJs,
  /visualViewport[\s\S]*?--dialog-viewport-height[\s\S]*?--dialog-viewport-bottom/,
  "The canonical Sheet must adapt to the visible keyboard viewport",
);
assert.match(
  kitJs,
  /position", "fixed"[\s\S]*?window\.scrollTo\(snapshot\.scrollX, snapshot\.scrollY\)/,
  "The canonical Sheet must preserve iOS and Telegram WebView page position",
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

assert.match(
  runtimeStyles,
  /@import "\.\/scenes\/reading-silver\.css";\s*$/,
  "The YUK-139 restoration layer must remain the final runtime theme mapping",
);
assert.match(
  runtimeHtml,
  /<label class="sr-only" for="question-input">Вопрос<\/label>[\s\S]{0,420}maxlength="120"[\s\S]{0,120}data-question-input[\s\S]{0,120}enterkeyhint="done"/,
  "Runtime Deck must keep the 120-character input contract without visible duplicate metadata",
);
assert.doesNotMatch(
  runtimeHtml,
  /id="deck-question-count"|>Твой вопрос<\/label>/,
  "Runtime Deck must not render the removed visible label or character counter",
);
assert.doesNotMatch(
  runtimeHtml,
  /id="(?:deck-wrap|result|spread-result)"[\s\S]{0,700}wyrd-brand--screen/,
  "Reading screens must reserve the WYRD lockup for Cover and Forest",
);
assert.match(
  silverComponents,
  /\.wyrd-deck-artifact__stack,[\s\S]*?raven-arch\.jpg[\s\S]*?filter:\s*none;/,
  "Shared Kit/runtime Deck must use the approved Raven artwork without color filtering",
);
assert.match(
  readingSilver,
  /#deck-wrap \.ui-app-header\s*\{[\s\S]*?--layout-deck-header-min-height/,
  "Runtime Deck must consume the canonical 72 px Back-only header token",
);
assert.match(
  runtimeHtml,
  /id="deck-wrap"[\s\S]{0,1200}wyrd-deck-composition__header[\s\S]{0,700}wyrd-deck-composition__question/,
  "Runtime Deck must reuse the canonical composition and Field classes",
);
assert.match(
  runtimeHtml,
  /wyrd-deck-composition__artifact-zone[\s\S]{0,250}wyrd-deck-artifact/,
  "Runtime Deck must reuse the canonical Artifact-zone and Artifact classes",
);
assert.match(
  readingSilver,
  /#deck-wrap \.deck-question-zone::after[\s\S]{0,120}display:\s*none/,
  "Runtime Deck must hide the rejected falling field spark",
);
assert.match(
  readingSilver,
  /#deck-wrap\.deck-scene\.is-question-ready \.deck-question-orbit\s*\{[\s\S]*?opacity:\s*0;[\s\S]*?animation:\s*none;/,
  "Runtime Deck must stop and hide the question-field spark after Enter",
);
assert.match(
  controlLanguage,
  /\.ui-icon-button--quiet-reading::before\s*\{[\s\S]*?inset:\s*4px;/,
  "Reading Back must preserve its 48 px target with a quiet 40 px visible disc",
);
assert.match(
  runtimeBase,
  /body\[data-scene="deck"\]\s*\{[\s\S]*?radial-gradient\(circle at 50% -10%[\s\S]*?linear-gradient\(180deg,\s*#0b0d12 0%,\s*var\(--wyrd-depth\) 48%,\s*#050608 100%\)/,
  "Runtime Deck background must match the published Silver UI Kit background",
);
for (const scene of ["result", "spread"]) {
  assert.match(
    runtimeBase,
    new RegExp(`body\\[data-scene="${scene}"\\]\\s*\\{[\\s\\S]*?radial-gradient\\(circle at 50% -10%[\\s\\S]*?linear-gradient\\(180deg,\\s*#0b0d12 0%,\\s*var\\(--wyrd-depth\\) 48%,\\s*#050608 100%\\)`),
    `Runtime ${scene} background must match the approved cold silver Result background`,
  );
}
assert.match(
  runtimeBase,
  /body:is\(\[data-scene="deck"\], \[data-scene="result"\], \[data-scene="spread"\], \[data-scene="traces"\]\) :is\(\.scene-fog, \.wyrd-scene-stars\)\s*\{\s*display:\s*none;/,
  "All reading surfaces must suppress the legacy fog and stars layers",
);
assert.match(
  runtimeHtml,
  /wyrd-cover-invitation[\s\S]*?data-cover-invitation[\s\S]*?cover-cta-frame--main[\s\S]*?assets\/ui\/action-buttons\/continuous\/wyrd-action-hero\.svg/,
  "Runtime Cover invitation must reuse the canonical project Hero action ornament",
);
assert.match(
  kitHtml,
  /data-cover-invitation[\s\S]*?cover-cta-frame--main[\s\S]*?assets\/ui\/action-buttons\/continuous\/wyrd-action-hero\.svg[\s\S]*?Войти в лес/,
  "Silver UI Kit must execute the same canonical Cover invitation markup",
);
assert.match(
  kitJs,
  /import\("\.\.\/assets\/js\/ui\/cover-cta\.js"\)[\s\S]*?createCoverCtaAnimation\(coverInvitation\)/,
  "Silver UI Kit must load the exact runtime magnetic firefly mechanic",
);
assert.match(
  actionButtonCss,
  /wyrdCoverPrimaryBreath 6\.8s[\s\S]*?wyrdCoverFrameTrace 6\.8s/,
  "Cover invitation must preserve the source breath and trace cadence",
);
assert.match(
  actionButtonCss,
  /\.wyrd-cover-invitation\s*\{[\s\S]*?width:\s*clamp\(17\.5rem, 82vw, 22\.5rem\)[\s\S]*?min-height:\s*3\.75rem[\s\S]*?aspect-ratio:\s*1116 \/ 142/,
  "Compact Cover invitation must preserve the approved proportional width, touch target, and Hero aspect ratio",
);
assert.match(
  actionButtonCss,
  /\.wyrd-cover-invitation \.cover-cta-frame\s*\{[\s\S]*?transform:\s*scaleY\(1\.18\)[\s\S]*?transform-origin:\s*50% 50%/,
  "Cover Hero ornament must use the approved local optical height correction",
);
assert.match(
  actionButtonCss,
  /@media \(min-width: 560px\) and \(min-height: 860px\), \(min-width: 768px\)[\s\S]*?\.wyrd-cover-invitation\s*\{[\s\S]*?width:\s*clamp\(22\.5rem, 50vw, 30rem\)/,
  "Wide Cover invitation must use the approved bounded responsive width",
);
assert.match(
  actionButtonCss,
  /\.wyrd-cover-invitation:active,[\s\S]*?\.wyrd-cover-invitation\.is-activating\s*\{[\s\S]*?translateY\(1px\) scale\(0\.995\)/,
  "Cover invitation must preserve the source pressed mechanic",
);
assert.match(
  actionButtonCss,
  /\.wyrd-cover-invitation:is\(:hover, \.is-magnetic\)\s*\{[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none;[\s\S]*?translateY\(-1px\)/,
  "Cover invitation must preserve one silver hover mechanic across visible hover and magnetic attraction",
);
assert.match(
  coverCta,
  /damping:\s*42[\s\S]*?stiffness:\s*420[\s\S]*?actionableArea:\s*42[\s\S]*?attraction:\s*64[\s\S]*?particleDamping:\s*31[\s\S]*?particleStiffness:\s*240[\s\S]*?hoverParticleCeiling:\s*34[\s\S]*?idleParticleCeiling:\s*12[\s\S]*?updateMagnetFromPoint/,
  "Cover invitation must preserve the approved softened magnetic firefly field contract",
);
assert.match(
  coverCta,
  /const horizontalFade = clamp\([\s\S]*?const verticalFade = clamp\([\s\S]*?const edgeFade = horizontalFade \* verticalFade[\s\S]*?fadeOut \*[\s\S]*?edgeFade \*/,
  "Cover particles must fade before the ornamental frame while leaving the outer glow unclipped",
);
assert.doesNotMatch(
  runtimeActions,
  /transferIntentToDeck|--deck-intent-distance|is-intent-transferred/,
  "Runtime Enter acceptance must not replay a spark, silver thread, or deck-response animation",
);
assert.match(
  runtimeActions,
  /updateDeckQuestionState\(hasQuestion \? "accept" : "hold"\);\s*deckCard\.focus\(\{ preventScroll: true \}\);/,
  "Runtime Enter acceptance must move focus to the deck without visual motion",
);
assert.match(
  runtimeActions,
  /touchMain\.textContent = "Коснись колоды";/,
  "Runtime Deck invitation must keep the approved constant visible copy",
);
assert.doesNotMatch(
  runtimeActions,
  /Коснись колоды, чтобы начать/,
  "Runtime Deck must not add unapproved visible draw microcopy",
);
assert.doesNotMatch(
  runtimeRender,
  /enteredDeck|is-entering/,
  "Runtime Deck must not replay the rejected whole-stack entry settle",
);
assert.match(
  runtimeActions,
  /lineBreakMode = event\.shiftKey \? "newline" : "accept"[\s\S]*?if \(event\.shiftKey\)[\s\S]*?return;[\s\S]*?acceptQuestionIntent/,
  "Shift+Enter must preserve a newline while Enter accepts the question",
);
assert.match(
  readingSilver,
  /@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*?\.deck-interaction:hover \.wyrd-deck-artifact::before[\s\S]*?animation:\s*none;[\s\S]*?opacity:\s*1;/,
  "Runtime Deck hover may clarify light but must not move the fan",
);
assert.match(
  runtimeHtml,
  /id="result"[\s\S]{0,420}ui-icon-button--quiet-reading[\s\S]*?id="spread-result"[\s\S]{0,420}ui-icon-button--quiet-reading/,
  "Result and Spread must reuse the same quiet reading Back control as Deck",
);
assert.doesNotMatch(
  silverComponents,
  /moonAnswerPulse/,
  "Runtime Silver Deck must not restore the legacy moon pulse",
);
assert.doesNotMatch(
  silverComponents,
  /@keyframes wyrd-deck-intent[\s\S]*?scale\(|deck-artifact-silver-glow|radial-gradient\(\s*ellipse at 50% 48%/,
  "Canonical Deck intent must not restore scaling or a full silver halo",
);
assert.doesNotMatch(runtimeActions, /deck-question-count/, "Removed Deck counter must have no runtime updater");
assert.match(
  runtimeRender,
  /phase\.className = "card-moon-phase"[\s\S]{0,500}traceDate\.className = "card-moon-date"/,
  "Runtime Result must keep Moon phase and date on separate metadata rows",
);
assert.match(
  runtimeRender,
  /traceDate\.textContent = formatFullTraceDate\(date\);/,
  "Runtime Result must use the full date formatter rather than the compact history formatter",
);
assert.match(
  runtimeRender,
  /back\.append\(starField, mainStar, backTitle, date\);/,
  "Gift backs must preserve the approved star, title and acquisition-date bands",
);
assert.match(
  runtimeRender,
  /scheduleGiftStarBreath\(mainStar, true\);[\s\S]*?isInitial \? randomBetween\(900, 1600\) : randomBetween\(5200, 7800\)/,
  "The Gift main star must begin its visible breathing cycle promptly",
);
assert.match(
  runtimeRender,
  /receivedAt: new Date\(2026, 7, 13 \+ index, 12, 0, 0\)\.toISOString\(\)/,
  "Gift preview dates must demonstrate the full Russian month format from 13 August",
);
assert.doesNotMatch(
  runtimeSpread,
  /history-item-meta|history-item-phase|traceDate/,
  "Trace catalog cards must not duplicate moon phase or acquisition date from the detail sheet",
);
assert.match(
  readingSilver,
  /#result \.card-moon-date\s*\{[\s\S]*?grid-row:\s*2;[\s\S]*?font-family:\s*"Cormorant Garamond"[\s\S]*?font-style:\s*italic;[\s\S]*?text-align:\s*left;/,
  "Runtime Result date must preserve the canonical second-row typography and alignment",
);
assert.match(
  kitHtml,
  /data-result-reveal-demo[\s\S]*?Артефакт → Послание → Тень[\s\S]*?data-result-reveal-trigger/,
  "Silver UI Kit must expose the approved replayable Result Reveal sequence",
);
assert.match(
  kitCss,
  /\.result-reveal-demo\.is-playing \.result-reveal-demo__artifact\s*\{[\s\S]*?800ms[\s\S]*?\.result-reveal-demo\.is-playing \.result-reveal-demo__message\s*\{[\s\S]*?320ms[\s\S]*?800ms[\s\S]*?\.result-reveal-demo\.is-playing \.result-reveal-demo__shadow\s*\{[\s\S]*?320ms[\s\S]*?1240ms/,
  "Kit Result Reveal must order Artifact, Message, then Shadow",
);
assert.match(
  kitCss,
  /\.result-reveal-demo__artifact::after\s*\{[\s\S]*?clip-path:[\s\S]*?wyrd-card-frame-artifact\.svg/,
  "Kit Result Reveal glint must reuse the approved Artifact Frame geometry",
);
assert.match(
  runtimeRender,
  /readingMotionPreference\?\.matches[\s\S]*?cardBox\?\.classList\.add\("is-visible"\)[\s\S]*?cardMessage\?\.classList\.add\("is-visible"\)[\s\S]*?cardShadowWrap\?\.classList\.add\("is-visible"\)/,
  "Reduced motion must expose the complete Result immediately",
);
assert.match(
  runtimeRender,
  /revealCard[\s\S]*?is-reveal-glint[\s\S]*?}, 40\)[\s\S]*?revealMessage[\s\S]*?}, 840\)[\s\S]*?revealShadow[\s\S]*?}, 1240\)/,
  "Runtime Result must reveal Artifact, then Message, then Shadow",
);
assert.match(
  readingSilver,
  /#result \.card-box\s*\{[\s\S]*?transform:\s*translateY\(2px\);[\s\S]*?opacity 800ms var\(--ease-out-strong\)/,
  "Runtime Result Artifact must settle by only 2 px over the ritual token",
);
assert.match(
  readingSilver,
  /#result \.card-box::after\s*\{[\s\S]*?clip-path:[\s\S]*?wyrd-card-frame-artifact\.svg[\s\S]*?#result \.card-box\.is-reveal-glint::after\s*\{[\s\S]*?800ms/,
  "Runtime Result must reuse the approved partial one-shot frame glint",
);
assert.match(
  readingSilver,
  /#result \.result-question-label\s*\{[\s\S]*?rgba\(238, 229, 212, 0\.42\)[\s\S]*?font-size:\s*0\.75rem;[\s\S]*?font-weight:\s*400;[\s\S]*?letter-spacing:\s*0;[\s\S]*?text-transform:\s*none;[\s\S]*?#result \.result-question-text\s*\{[\s\S]*?font-size:\s*1\.0625rem;[\s\S]*?font-weight:\s*500;/,
  "Result question hierarchy must keep a readable 12 px quiet label and a visibly stronger 17 px actual question",
);
assert.match(
  runtimeRender,
  /if \(question\)[\s\S]*?textContent = "Твой вопрос"[\s\S]*?resultQuestionLabel\.hidden = true;[\s\S]*?Тайна приоткроется сама/,
  "Result must hide the label for an empty question and keep the whisper beside the rail",
);
assert.match(
  readingSilver,
  /#result \.wyrd-utility-action\s*\{[\s\S]*?border-color:\s*rgba\(205, 209, 207, 0\.4\);[\s\S]*?color:\s*rgba\(231, 228, 219, 0\.86\);[\s\S]*?#result \.wyrd-utility-action:hover:not\(:disabled\),[\s\S]*?#result \.wyrd-utility-action:focus-visible\s*\{[\s\S]*?var\(--control-silver-line-active\)/,
  "Result Share must be quieter at rest and restore full silver on hover/focus without changing other utility actions",
);
assert.match(
  runtimeHtml,
  /<p class="hook-copy">\s*Три карты покажут то, что скрыто\.\s*<\/p>/,
  "Result hook must keep the approved concise continuation copy",
);
assert.match(
  runtimeHtml,
  /class="[^"]*wyrd-action-frame--secondary[^"]*"[^>]*data-action="hook-open-path"/,
  "Single-card continuation must use the same Secondary frame as the three-card continuation",
);
assert.match(
  runtimeHtml,
  /hook-block[\s\S]*?reading-new-question-link[\s\S]*?data-action="new-question"[\s\S]*?>\s*Новый вопрос\s*<\/button>/,
  "Single-card Result must expose New question as a quiet unframed action beneath its continuation",
);
assert.match(
  runtimeHtml,
  /spread-continuation-link reading-new-question-link ui-action ui-action--quiet" data-action="new-question"/,
  "Three-card Result must expose New question as a quiet unframed action",
);
assert.match(
  runtimeSpread,
  /copy\.textContent = "Пять карт откроют то, что три не сказали\.";/,
  "Three-card continuation must use the approved concise bridge copy",
);
assert.match(
  runtimeSpread,
  /content\.append\(title\);[\s\S]*?item\.append\(image, content\);/,
  "Trace catalog cards must keep the approved image-and-name-only hierarchy",
);
assert.match(
  actionButtonCss,
  /\.reading-new-question-link\s*\{[\s\S]*?min-height:\s*var\(--control-touch-min\);[\s\S]*?background:\s*transparent;[\s\S]*?color:\s*rgba\(225, 228, 225, 0\.58\);/,
  "Quiet New question links must remain unframed while preserving a full touch target",
);
assert.match(
  kitHtml,
  /Reading completion contract[\s\S]*?Одна карта[\s\S]*?Раскрыть три карты[\s\S]*?Три карты[\s\S]*?Раскрыть пять карт[\s\S]*?Пять карт[\s\S]*?Продолжения расклада нет\.[\s\S]*?wyrd-action-frame--quiet[\s\S]*?Новый вопрос/,
  "Silver UI Kit must publish the exact one-, three-, and five-card completion hierarchy",
);
assert.match(
  runtimeSpread,
  /if \(lastSpread\.length === 5\)[\s\S]*?button\.hidden = false;[\s\S]*?button\.dataset\.action = "new-question";[\s\S]*?button\.textContent = "Новый вопрос";[\s\S]*?button\.classList\.remove\("ui-action--primary", "wyrd-action-frame--secondary"\);[\s\S]*?button\.classList\.add\("ui-action--quiet", "wyrd-action-frame--quiet"\);[\s\S]*?link\.hidden = true;[\s\S]*?return;/,
  "Five-card completion must expose one Quiet framed reset and hide the duplicate text reset",
);
assert.match(
  actionButtonCss,
  /wyrd-action-frame--quiet\s*\{[\s\S]*?--wyrd-action-frame-opacity:\s*0\.7;/,
  "Five-card Quiet reset must retain its approved restrained resting contour",
);
assert.doesNotMatch(
  runtimeHtml,
  /Духи леса услышали твой вопрос/,
  "Result hook must not repeat that the question has already been heard",
);
assert.match(
  readingSilver,
  /#result \.share-card-media\s*\{[\s\S]*?top:\s*11\.5%;[\s\S]*?width:\s*61\.5%;[\s\S]*?aspect-ratio:\s*3 \/ 4;[\s\S]*?rgba\(225, 228, 225, 0\.32\)[\s\S]*?inset 0 0 0 1px rgba\(225, 228, 225, 0\.06\)/,
  "Runtime Result must restore the approved Kit Artifact image window and material edge",
);
assert.match(
  readingSilver,
  /#result \.card-title-block\s*\{[\s\S]*?bottom:\s*9\.25%;[\s\S]*?gap:\s*0\.5rem;/,
  "Runtime Result must restore the approved Artifact identity position and title gap",
);
assert.match(
  readingSilver,
  /#result \.result-card-wrap::before\s*\{[\s\S]*?rgba\(178, 197, 211, 0\.055\)[\s\S]*?filter:\s*blur\(18px\)/,
  "Runtime Result must keep the approved static cold light-well behind the Artifact",
);
assert.match(
  readingSilver,
  /#result \.result-interpretation\s*\{[\s\S]*?width:\s*min\(100%, 20rem\);[\s\S]*?padding:\s*0 0 0 1rem;[\s\S]*?border-left:\s*1px solid rgba\(225, 228, 225, 0\.26\);/,
  "Runtime Result must restore the shared Message and Shadow interpretation rail on the canonical axis",
);
assert.match(
  kitCss,
  /\.share-card-specimen__media\s*\{[\s\S]*?top:\s*11\.5%;[\s\S]*?width:\s*61\.5%;[\s\S]*?\.share-card-specimen__identity\s*\{[\s\S]*?bottom:\s*9\.25%;[\s\S]*?gap:\s*0\.5rem;/,
  "Silver UI Kit must own the restored Artifact internal rhythm before runtime",
);
assert.match(
  kitCss,
  /\.result-reveal-demo__question p:first-child\s*\{[\s\S]*?font-size:\s*0\.75rem;[\s\S]*?font-weight:\s*400;[\s\S]*?letter-spacing:\s*0;[\s\S]*?\.result-reveal-demo__reading\s*\{[\s\S]*?padding-left:\s*1rem;[\s\S]*?border-left:\s*1px solid rgba\(225, 228, 225, 0\.26\);/,
  "Silver UI Kit must document the quiet question label and interpretation rail",
);
assert.match(
  runtimeShare,
  /const SHARE_WIDTH = 1086;[\s\S]*?const SHARE_HEIGHT = 1448;[\s\S]*?ARTIFACT_MEDIA_TOP = 0\.115;[\s\S]*?ARTIFACT_MEDIA_WIDTH = 0\.615;[\s\S]*?ARTIFACT_IDENTITY_BOTTOM = 0\.0925;/,
  "Native Share must export the exact canonical Artifact dimensions and geometry",
);
assert.match(
  runtimeShare,
  /silverMuted[\s\S]*?function drawMoonMetaStacked[\s\S]*?formatFullTraceDate\(date\)/,
  "Native Share must use the full date and silver stacked moon metadata",
);
assert.doesNotMatch(
  runtimeShare,
  /drawDivider\(context, \{|drawStoryTexture\(context, \{|rgba\(201,161,74,0\.16\)/,
  "Share and story rendering must not reintroduce legacy gold export chrome",
);
assert.match(
  readingSilver,
  /#spread-result\s*\{[\s\S]*?animation:\s*none;/,
  "Spread must not recreate a transformed containing block around the fixed Sheet",
);
assert.match(
  runtimeSpread,
  /spread-card-caption[\s\S]*?spread-card-role[\s\S]*?spread-card-name[\s\S]*?item\.append\(image, caption\)/,
  "Spread cards must expose their canonical role and card identity beneath the authored image",
);
assert.match(
  runtimeSpread,
  /if \(question\)[\s\S]*?spreadQuestionLabel\.textContent = "Твой вопрос"[\s\S]*?spreadQuestionLabel\.hidden = false[\s\S]*?spreadQuestionLabel\.hidden = true[\s\S]*?Тайна приоткроется сама/,
  "Spread question context must match the Result hierarchy and hide its label for the empty-question whisper",
);
assert.match(
  readingSilver,
  /#spread-result \.spread-grid--three\.spread-grid--archetype-a\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 12rem\);/,
  "The vertical three-card topology must use the Kit Quiet card width",
);
assert.match(
  readingSilver,
  /#spread-result \.spread-card\s*\{[\s\S]*?gap:\s*0\.65rem;[\s\S]*?background:\s*transparent;[\s\S]*?filter:\s*none;[\s\S]*?transform:\s*none;/,
  "Spread buttons must keep the Kit Quiet transparent surface and remove legacy blur/scale positioning",
);
assert.match(
  readingSilver,
  /#spread-result \.spread-card img\s*\{[\s\S]*?aspect-ratio:\s*3 \/ 4;[\s\S]*?border:\s*1px solid rgba\(225, 228, 225, 0\.22\);[\s\S]*?box-shadow:\s*0 12px 26px rgba\(0, 0, 0, 0\.3\);/,
  "Spread artwork must use the Kit Quiet 3:4 material edge and contact shadow",
);
assert.match(
  readingSilver,
  /#spread-result \.spread-card-name\s*\{[\s\S]*?font-size:\s*1\.08rem;/,
  "Spread card identity must use the Kit Quiet title size",
);
assert.match(
  readingSilver,
  /@keyframes wyrd-spread-card-reveal\s*\{[\s\S]*?opacity:\s*0;[\s\S]*?opacity:\s*1;[\s\S]*?\}/,
  "Spread reveal order must remain calm and must not add flip, blur, scale, or translation",
);
assert.match(
  readingSilver,
  /\.spread-card-modal\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?align-items:\s*end;/,
  "Card detail must use the approved viewport-fixed bottom Sheet",
);
for (const selector of [
  "#result .card-img",
  "#spread-result .spread-card img",
  ".spread-card-modal-image",
]) {
  assert.match(
    readingSilver,
    new RegExp(`${selector.replaceAll(".", "\\.")}\\s*\\{[\\s\\S]*?filter:\\s*none;`),
    `${selector} must keep authored card art unfiltered`,
  );
}
assert.match(
  readingSilver,
  /@media \(forced-colors: active\)[\s\S]*?outline:\s*2px solid ButtonText;/,
  "YUK-139 controls must retain a visible forced-colors focus state",
);
assert.match(
  readingSilver,
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*?#spread-result \.spread-card\s*\{[\s\S]*?animation:\s*none;/,
  "YUK-139 card meaning must remain visible in reduced motion",
);

assert.match(
  runtimeHtml,
  /id="setting-sound-entry"[\s\S]{0,260}data-action="open-sound-settings"[\s\S]{0,260}aria-haspopup="dialog"/,
  "Settings Sound must be a disclosure row that opens a dialog rather than a direct switch",
);
assert.match(
  runtimeHtml,
  /id="settings-sound-sheet"[^>]*data-dialog-layer[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"/,
  "Sound settings must use the canonical accessible dialog layer",
);
assert.equal(
  (runtimeHtml.match(/class="settings-audio-toggle ui-choice"/g) || []).length,
  2,
  "Sound settings must expose exactly two full-row switches for music and interface sounds",
);
assert.match(
  runtimeHtml,
  /id="settings-music-volume"[\s\S]{0,180}type="range"[\s\S]{0,220}aria-label="Громкость музыки"/,
  "Sound settings must expose a real accessible music volume range",
);
assert.doesNotMatch(
  runtimeHtml.match(/<section class="settings-screen[\s\S]*?<section class="about-you-screen"/)?.[0] || "",
  /Вибрация/,
  "Settings must not advertise vibration before Telegram HapticFeedback is implemented and tested",
);
assert.doesNotMatch(
  runtimeHtml.match(/id="settings-sound-sheet"[\s\S]*?<\/section>\s*<\/div>\s*<\/div>\s*<\/section>/)?.[0] || "",
  /композици|мелоди|трек/i,
  "Sound sheet must not invent melody names or a track list before the authored Suno tracks exist",
);
assert.match(
  runtimeHtml,
  /<header class="settings-header ui-app-header">[\s\S]*?class="ui-icon-button ui-icon-button--back btn-back-circle settings-back"[\s\S]*?<h1 class="ui-app-header__identity" id="settings-title">Настройки<\/h1>/,
  "Settings Back and title must share the canonical App Header without shifting the centered identity",
);
assert.match(
  settingsCss,
  /#settings-screen \.settings-header h1\s*\{[\s\S]*?min-height:\s*var\(--control-icon-hit-size\);[\s\S]*?font-size:\s*2rem;[\s\S]*?line-height:\s*1;/,
  "Settings title must stay on the 48px navigation axis at the approved 32px title size",
);
assert.match(
  settingsCss,
  /#settings-screen \.settings-row\s*\{[\s\S]*?min-height:\s*var\(--control-row-min-height\);[\s\S]*?background:\s*var\(--wyrd-control-surface\);/,
  "Settings rows must consume the canonical Row touch-height and surface tokens",
);
assert.match(
  settingsCss,
  /\.settings-audio-sheet__panel\s*\{[\s\S]*?width:\s*min\([\s\S]*?42rem\);[\s\S]*?max-height:\s*min\(84dvh, calc\(var\(--dialog-viewport-height, 100dvh\) - 12px\), 44rem\);/,
  "Sound settings must preserve the canonical responsive Sheet envelope",
);
assert.match(
  settingsCss,
  /\.settings-audio-toggle\s*\{[\s\S]*?min-height:\s*78px;[\s\S]*?\.settings-audio-toggle__mechanism\s*\{[\s\S]*?width:\s*64px;[\s\S]*?height:\s*44px;/,
  "Sound switches must preserve the Kit full-row and mechanism geometry",
);
assert.match(
  settingsCss,
  /@media \(forced-colors: active\)[\s\S]*?\.settings-audio-toggle:focus-visible[\s\S]*?outline:\s*2px solid Highlight;/,
  "Settings controls must retain a system-visible forced-colors focus state",
);
assert.match(
  stateModel,
  /musicEnabled:\s*true[\s\S]*?typeof value\?\.musicEnabled === "boolean" \? value\.musicEnabled : next\.soundEnabled/,
  "Persisted legacy sound preference must migrate to the separate music preference",
);
assert.match(stateStorage, /toggleMusic\(\)[\s\S]*?musicEnabled:\s*!state\.musicEnabled/, "Music must have a real persisted toggle");
assert.match(
  runtimeAudio,
  /preferences\.musicEnabled[\s\S]*?preferences\.ambienceVolume[\s\S]*?SCENE_LEVELS\[scene\][\s\S]*?\* ambienceVolume/,
  "Forest ambience must obey the persisted music switch and volume",
);
assert.match(
  runtimeRender,
  /dialogs\.sync\(elements\.soundSettingsSheet[\s\S]*?initialFocus:\s*"\[data-action='toggle-music'\]"[\s\S]*?returnFocus:\s*"#setting-sound-entry"/,
  "Sound Sheet must move focus inside and return it to the disclosure row",
);

const profileHtml = runtimeHtml.split('<section class="about-you-screen')[1]?.split('<section class="settings-screen reminders-screen')[0] || "";
assert.match(
  profileHtml,
  /ui-scene-shell[\s\S]*?<header class="settings-header about-you-header ui-app-header">[\s\S]*?class="ui-icon-button ui-icon-button--back btn-back-circle settings-back"[\s\S]*?<h1 class="ui-app-header__identity" id="about-you-title">Профиль<\/h1>/,
  "Profile must reuse the canonical Silver Scene Shell and App Header",
);
assert.doesNotMatch(
  profileHtml,
  /wyrd-scene-stars|settings-brand|settings-rule|settings-kicker/,
  "Profile must not retain legacy stars or the rejected gold lockup hierarchy",
);
assert.equal(
  (profileHtml.match(/class="about-segment ui-choice"/g) || []).length,
  3,
  "Profile must preserve exactly three accessible pronoun radio choices",
);
assert.match(
  profileHtml,
  /class="about-unsaved-backdrop"[\s\S]*?type="button"[\s\S]*?aria-label="Остаться в Профиле"[\s\S]*?data-dialog-motion="sheet"[\s\S]*?aria-describedby="about-unsaved-description"/,
  "Profile unsaved warning must use the canonical dismissible Sheet contract",
);
assert.match(
  settingsCss,
  /#about-you-screen \.about-avatar\.is-selected[\s\S]*?border-color:\s*rgba\(225, 228, 225, 0\.86\);[\s\S]*?inset 0 0 0 1px rgba\(225, 228, 225, 0\.13\)/,
  "Profile selected avatar must use one clear silver contour and a quiet inset cue",
);
assert.doesNotMatch(
  settingsCss,
  /#about-you-screen \.about-avatar\.is-selected[\s\S]*?0 0 0 3px/,
  "Profile selected avatar must not restore the rejected double outer ring",
);
assert.match(
  runtimeActions,
  /event\.target\?\.id === "about-name-input" \|\| event\.target\?\.id === "about-zodiac-select"/,
  "Profile zodiac changes must update the draft and enable Save",
);
assert.match(
  settingsCss,
  /#about-you-screen \.about-select-row select\s*\{[\s\S]*?padding-inline:\s*0\.75rem 1\.25rem;/,
  "Profile zodiac select must preserve breathing room around the native chevron",
);
assert.match(
  notificationsCss,
  /\.wyrd-notification--success\s*\{[\s\S]*?border-color:\s*rgba\(225, 228, 225, 0\.2\);/,
  "Local notification preview must keep the success contour quietly silver",
);
assert.match(
  notificationsCss,
  /top:\s*max\(8px, calc\(var\(--layout-safe-top\) \+ 6px\)\);[\s\S]*?width:\s*min\(100%, 22\.5rem\);[\s\S]*?min-height:\s*58px;[\s\S]*?border:\s*1px solid[\s\S]*?border-radius:\s*16px;[\s\S]*?translate3d\(0, calc\(-100% - 12px\), 0\)/,
  "Local notification preview must stay compact, safe-area aware, and fully above-screen before entry",
);
assert.match(
  notificationsCss,
  /transform 320ms cubic-bezier\(0\.22, 1, 0\.36, 1\)[\s\S]*?\.wyrd-notification\.is-leaving[\s\S]*?transition-duration:\s*180ms, 220ms;/,
  "Local notification preview must enter smoothly and leave upward on the same path",
);
assert.match(
  notificationsCss,
  /\.wyrd-notification__message::before\s*\{[\s\S]*?color:\s*rgba\(205, 209, 207, 0\.68\);/,
  "The compact WYRD label must retain readable contrast",
);
assert.match(
  notificationsCss,
  /\.wyrd-notification::before[\s\S]*?background:\s*currentColor;[\s\S]*?mask:[\s\S]*?wyrd-diamond-big-small\.svg/,
  "The WYRD status mark must inherit system color through a mask",
);
assert.match(
  notificationsCss,
  /\.wyrd-notification__close::before[\s\S]*?background:\s*currentColor;[\s\S]*?mask:[\s\S]*?tabler-x\.svg/,
  "The Close icon must inherit system color through a mask",
);
assert.equal(
  (runtimeActions.match(/id:\s*"profile-saved"[\s\S]*?dismissible:\s*true/g) || []).length,
  2,
  "Both Profile save paths must expose the same dismissible notification contract",
);
assert.deepEqual(
  getNotificationPolicy({ kind: "success" }),
  { kind: "success", duration: 4000, dismissible: false },
  "Short Success feedback must auto-dismiss after four seconds without Close",
);
assert.deepEqual(
  getNotificationPolicy({ kind: "info" }),
  { kind: "info", duration: 4000, dismissible: false },
  "Short Info feedback must auto-dismiss after four seconds without Close",
);
assert.deepEqual(
  getNotificationPolicy({ kind: "error" }),
  { kind: "error", duration: Number.POSITIVE_INFINITY, dismissible: true },
  "Error feedback must stay persistent and closeable by default",
);
assert.doesNotMatch(
  notificationsCss,
  /201,\s*(?:161|168),\s*(?:74|76)/,
  "Global notifications must not restore the legacy gold accent",
);
assert.match(
  dialogController,
  /addEventListener\("transitionend"[\s\S]*?transition\.total \+ 80/,
  "Runtime dialogs must close from the real transition with a measured fallback",
);
assert.match(
  dialogController,
  /position", "fixed"[\s\S]*?scrollTo\(snapshot\.scrollX, snapshot\.scrollY\)/,
  "Runtime dialogs must preserve page position with fixed-body iOS scroll lock",
);
assert.match(
  dialogController,
  /visualViewport[\s\S]*?--dialog-viewport-height[\s\S]*?--dialog-viewport-bottom/,
  "Runtime sheets must adapt to the visible keyboard viewport",
);
assert.match(
  notificationCenter,
  /applyOptions\(existing, options\)[\s\S]*?syncAction\(record, options\.action\)[\s\S]*?transitionend/,
  "Same-ID notifications must update atomically and leave on their actual transition",
);
assert.match(
  notificationCenter,
  /kind === "error"[\s\S]*?role: "alert", live: "assertive"[\s\S]*?role: "status", live: "polite"/,
  "Notifications must own correct per-item live-region semantics",
);
assert.match(
  dialogsCss,
  /prefers-reduced-motion: reduce[\s\S]*?transition:\s*opacity var\(--dur-fast\) var\(--ease-out-strong\) !important;/,
  "Reduced-motion dialogs must retain a visible 140ms opacity state without spatial travel",
);
assert.match(
  notificationsCss,
  /prefers-reduced-motion: reduce[\s\S]*?transition:\s*opacity var\(--dur-fast\) var\(--ease-out-strong\);/,
  "Reduced-motion notifications must retain a visible 140ms opacity state",
);
for (const [name, source] of [
  ["dialog primitives", dialogsCss],
  ["notification primitives", notificationsCss],
]) {
  assert.doesNotMatch(source, /transition:\s*all\b/, `${name} must not animate every CSS property`);
  assert.doesNotMatch(source, /\bease-in\b/, `${name} must not use sluggish ease-in motion`);
  assert.doesNotMatch(source, /scale\(0\)/, `${name} must not collapse controls to zero scale`);
}
assert.match(
  historySheetDrag,
  /resolveHistoryDragAxis[\s\S]*?axis === "horizontal"[\s\S]*?getHistoryUpwardResistance/,
  "History Sheet must direction-lock, cancel horizontal intent, and resist upward drag",
);
const notificationRoot = runtimeHtml.match(/<section\s+class="wyrd-notifications"[\s\S]*?>/)?.[0] || "";
assert.doesNotMatch(
  notificationRoot,
  /aria-live|aria-relevant/,
  "The shared notification root must not duplicate the live region owned by each item",
);
assert.match(
  settingsCss,
  /#about-you-screen \.about-segment\[aria-checked="true"\][\s\S]*?background:\s*linear-gradient\(145deg, #e1e4e1, #aeb4b2\);[\s\S]*?color:\s*#111318;/,
  "Profile selected pronoun must restore the canonical high-contrast Choice state",
);
assert.match(
  settingsCss,
  /#about-you-screen \.about-unsaved-panel\s*\{[\s\S]*?width:\s*min\([\s\S]*?42rem\);[\s\S]*?max-height:\s*min\(84dvh, calc\(var\(--dialog-viewport-height, 100dvh\) - 12px\), 44rem\);/,
  "Profile unsaved Sheet must preserve the canonical responsive envelope",
);
assert.match(
  settingsCss,
  /@media \(forced-colors: active\)[\s\S]*?#about-you-screen \.about-avatar\.is-selected[\s\S]*?outline:\s*2px solid Highlight;/,
  "Profile selected controls must remain explicit in forced colors",
);

const remindersHtml = runtimeHtml.split('<section class="settings-screen reminders-screen')[1]?.split('<section class="settings-screen app-info-screen')[0] || "";
assert.match(
  remindersHtml,
  /ui-scene-shell[\s\S]*?<header class="settings-header reminders-header ui-app-header">[\s\S]*?<h1 class="ui-app-header__identity" id="reminders-title">Уведомления<\/h1>/,
  "Notifications must reuse the canonical Silver Scene Shell and App Header",
);
assert.doesNotMatch(
  remindersHtml,
  /wyrd-scene-stars|settings-brand|settings-rule|settings-kicker/,
  "Notifications must not retain legacy stars or the rejected gold lockup hierarchy",
);
assert.equal(
  (remindersHtml.match(/role="switch" aria-checked="false"/g) || []).length,
  3,
  "Notifications must expose the three persisted options as accessible switches",
);
assert.match(
  remindersHtml,
  /class="reminders-sheet-backdrop"[\s\S]*?type="button"[\s\S]*?aria-label="Отменить выбор времени"[\s\S]*?data-dialog-motion="sheet"/,
  "Notifications time picker must use the canonical dismissible Sheet contract",
);
assert.match(
  runtimeRender,
  /button\.getAttribute\("role"\) === "switch"[\s\S]*?aria-checked[\s\S]*?removeAttribute\("aria-pressed"\)/,
  "Notifications switches must synchronize aria-checked without a conflicting pressed state",
);
assert.match(
  settingsCss,
  /#reminders-screen \.settings-toggle\s*\{[\s\S]*?width:\s*64px;[\s\S]*?height:\s*44px;[\s\S]*?#reminders-screen \.settings-toggle img\s*\{[\s\S]*?width:\s*24px;[\s\S]*?transform:\s*translateX\(28px\);/,
  "Notifications switches must preserve the exact Silver UI Kit geometry",
);
assert.match(
  settingsCss,
  /@media \(max-width: 410px\)[\s\S]*?#reminders-screen \.reminders-days\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4, 44px\);/,
  "Notifications weekdays must restore the approved 4 plus 3 compact layout",
);
assert.match(
  settingsCss,
  /@media \(forced-colors: active\)[\s\S]*?#reminders-screen \.reminders-day\.is-selected[\s\S]*?outline:\s*2px solid Highlight;/,
  "Notifications selected states must remain explicit in forced colors",
);

const appInfoHtml = runtimeHtml.split('<section class="settings-screen app-info-screen')[1]?.split('<section class="spirit-book')[0] || "";
assert.match(
  appInfoHtml,
  /ui-scene-shell[\s\S]*?<header class="settings-header app-info-header ui-app-header">[\s\S]*?class="ui-icon-button ui-icon-button--back btn-back-circle settings-back"[\s\S]*?<h1 class="ui-app-header__identity" id="app-info-title">О приложении<\/h1>/,
  "About App must reuse the canonical Silver Scene Shell and App Header",
);

const tracesHtml = runtimeHtml.split('<section class="traces-screen ui-scene-shell"')[1]?.split('<div class="save-screen-layer"')[0] || "";
assert.match(
  tracesHtml,
  /id="traces"[\s\S]*?<header class="traces-header ui-app-header">[\s\S]*?data-action="close-traces"[\s\S]*?<h1 class="ui-app-header__identity" id="traces-title">Следы в лесу<\/h1>/,
  "Traces must reuse the canonical Silver Scene Shell and App Header",
);
assert.doesNotMatch(
  tracesHtml,
  /screen-brand-word|screen-brand-line|screen-brand-subtitle/,
  "Traces must not duplicate the WYRD brand lockup beneath its App Header",
);
assert.match(
  tracesHtml,
  /history-empty-state feedback-panel[\s\S]*?data-state="empty"/,
  "Traces empty history must use the canonical Feedback Empty component",
);
assert.match(
  runtimeHtml,
  /data-action="open-traces"/,
  "Forest must route to the semantically named Traces scene",
);
assert.doesNotMatch(
  runtimeHtml,
  /data-action="(?:open|close)-profile"|id="profile"/,
  "Legacy Profile scene naming must not conflict with the real Profile settings screen",
);
assert.match(
  runtimeSpread,
  /history-item history-card-specimen card-context-action ui-card-action/,
  "Runtime history rows must restore the canonical History Trace component",
);
assert.doesNotMatch(
  runtimeSpread,
  /moonPhase\.append\(createMoonIcon\(moon\.type\), moonText\)[\s\S]*?meta\.append\(moonPhase, traceDate\)/,
  "Runtime History Trace catalog cards must defer moon phase and date to the detail sheet",
);
assert.match(
  runtimeBase,
  /\[data-scene="traces"\][\s\S]*?:is\(\.scene-fog, \.wyrd-scene-stars\)[\s\S]*?display:\s*none/,
  "Traces must use the shared cold Silver scene background without legacy stars or fog",
);
assert.doesNotMatch(
  appInfoHtml,
  /wyrd-scene-stars|settings-brand|settings-rule|settings-kicker/,
  "About App must not retain legacy stars or the rejected gold lockup hierarchy",
);
assert.equal(
  (appInfoHtml.match(/class="settings-row app-info-row"/g) || []).length,
  5,
  "About App must preserve exactly five honest placeholder rows",
);
for (const label of [
  "Версия",
  "Связаться с нами",
  "Сообщить об ошибке",
  "Политика конфиденциальности",
  "Условия использования",
]) {
  assert.match(appInfoHtml, new RegExp(`>${label}<`), `About App must preserve the ${label} row`);
}
assert.equal(
  (appInfoHtml.match(/<button\b/g) || []).length,
  1,
  "About App static placeholders must leave Back as the only button",
);
assert.doesNotMatch(
  appInfoHtml,
  /<a\b|tabindex=|settings-row-arrow/,
  "About App unavailable destinations must not masquerade as interactive controls",
);
assert.match(
  settingsCss,
  /#app-info-screen \.app-info-row\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?min-height:\s*var\(--control-row-min-height\);[\s\S]*?background:\s*var\(--wyrd-control-surface\);/,
  "About App rows must consume the canonical static Row geometry and Silver surface",
);
assert.match(
  settingsCss,
  /#app-info-screen \.settings-row-title,[\s\S]*?overflow-wrap:\s*anywhere;/,
  "About App long Russian labels must wrap instead of causing the known 393px overflow",
);

const spiritBookHtml = runtimeHtml.split('<section class="spirit-book')[1]?.split('<section class="ritual-onboarding"')[0] || "";
assert.match(
  spiritBookHtml,
  /ui-scene-shell[\s\S]*?class="spirit-book-art"/,
  "Spirit Book must reuse the Silver Scene Shell and its dedicated Media Frame",
);
assert.doesNotMatch(
  spiritBookHtml,
  /wyrd-card-frame-artifact\.svg|spirit-book-frame/,
  "Spirit Book Media Frame must not reuse the result-card Artifact frame",
);
assert.doesNotMatch(
  spiritBookHtml,
  /wyrd-scene-stars/,
  "Spirit Book must keep the canonical Scene Shell quiet and place atmosphere inside authored media only",
);
assert.match(
  spiritBookHtml,
  /spirit-book-dots[\s\S]*?role="group"[\s\S]*?aria-label="Выбор главы"/,
  "Spirit Book chapter choices must expose the canonical grouped Pager semantics",
);
assert.match(
  spiritBookHtml,
  /spirit-book-mist--rear[\s\S]*?spirit-book-mist--front[\s\S]*?spirit-book-light--one[\s\S]*?spirit-book-light--two[\s\S]*?spirit-book-light--three/,
  "Spirit Book must expose dedicated atmospheric layers for its five authored micro-scenes",
);
assert.match(
  runtimeRender,
  /dot\.setAttribute\("aria-pressed", index === activeIndex \? "true" : "false"\)/,
  "Spirit Book must synchronize the selected chapter with the Kit pressed-state contract",
);
assert.match(
  spiritBookCss,
  /\.spirit-book-art > #spirit-book-image\s*\{[\s\S]*?aspect-ratio|\.spirit-book-art\s*\{[\s\S]*?aspect-ratio:\s*3 \/ 4;/,
  "Spirit Book must preserve the authored 3:4 story artwork proportion",
);
assert.match(
  spiritBookCss,
  /\.spirit-book-art > #spirit-book-image\s*\{[\s\S]*?filter:\s*none;/,
  "Spirit Book must not recolor or desaturate authored story artwork",
);
assert.doesNotMatch(
  spiritBookCss,
  /rgba\((?:201, 161, 74|216, 177, 90|242, 200, 96|238, 226, 196|239, 226, 196)/,
  "Spirit Book must not retain legacy gold chrome",
);
assert.match(
  spiritBookCss,
  /\.spirit-book-controls\s*\{[\s\S]*?grid-template-columns:\s*var\(--control-pager-hit-size\) minmax\(0, 1fr\) var\(--control-pager-hit-size\);/,
  "Spirit Book Pager must use the canonical 48px end-control geometry",
);
assert.match(
  spiritBookCss,
  /@media \(max-width: 22\.5rem\)[\s\S]*?\.spirit-book-dots\s*\{[\s\S]*?grid-row:\s*2;/,
  "Spirit Book Pager must move its five choices to row two at the compact breakpoint",
);
assert.match(
  spiritBookCss,
  /@media \(forced-colors: active\)[\s\S]*?\.spirit-book-dot\[aria-pressed="true"\]::before[\s\S]*?background:\s*Highlight;/,
  "Spirit Book selected chapter must remain visible in forced colors",
);
assert.match(
  spiritBookCss,
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.spirit-book-art::before,[\s\S]*?\.spirit-book-mist,[\s\S]*?\.spirit-book-light,[\s\S]*?animation:\s*none;/,
  "Spirit Book living effects must stop in reduced motion",
);
assert.match(
  spiritBookCss,
  /\.spirit-book-copy h1\s*\{[\s\S]*?font-size:\s*clamp\(2rem, 8\.5vw, 2\.25rem\);[\s\S]*?line-height:\s*1\.08;/,
  "Spirit Book chapter headings must use the approved quieter mobile scale",
);
assert.doesNotMatch(
  spiritBookCss,
  /spiritBookImageBreath|spiritBookFernSway/,
  "Spirit Book must keep figures, cards, clothing, wings, and authored foliage static",
);
assert.match(
  spiritBookCss,
  /@keyframes spiritBookStarTwinkle\s*\{[\s\S]*?8%[\s\S]*?21%,[\s\S]*?27%\s*\{[\s\S]*?opacity:\s*0\.78;/,
  "Spirit Book chapter glints must become clearly perceptible within the first third of their cycle",
);
assert.match(
  runtimeRender,
  /classList\.remove\("is-motion-ready"\)[\s\S]*?requestAnimationFrame[\s\S]*?classList\.add\("is-motion-ready"\)/,
  "Spirit Book must restart its authored micro-scene whenever the chapter changes",
);
assert.match(
  runtimeActions,
  /acceptSpiritBookNavigation\(uiState\)[\s\S]*?spirit-book-next/,
  "Spirit Book navigation must reject duplicate activations instead of skipping chapters",
);
assert.match(
  settingsCss,
  /@media \(forced-colors: active\)[\s\S]*?#app-info-screen \.app-info-row\s*\{[\s\S]*?border-color:\s*CanvasText;[\s\S]*?background:\s*Canvas;/,
  "About App static rows must remain legible in forced colors",
);

console.log("WYRD UI interaction smoke tests passed");
