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

const [
  kitHtml,
  kitCss,
  kitJs,
  uiRules,
  tokens,
  runtimeHtml,
  runtimeStyles,
  readingSilver,
  silverComponents,
  controlLanguage,
  runtimeBase,
  runtimeActions,
  runtimeRender,
] =
  await Promise.all([
    readFile(new URL("../docs/wyrd-ui-kit.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/wyrd-ui-kit.css", import.meta.url), "utf8"),
    readFile(new URL("../docs/wyrd-ui-kit.js", import.meta.url), "utf8"),
    readFile(new URL("../docs/WYRD_UI_RULES.md", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/tokens.css", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/scenes/reading-silver.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/components/silver-components.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/components/control-language.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/css/base.css", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/actions.js", import.meta.url), "utf8"),
    readFile(new URL("../assets/js/ui/render.js", import.meta.url), "utf8"),
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
  /#deck-wrap \.deck-touch-copy,[\s\S]*?min-height:\s*3rem;[\s\S]*?color:\s*rgba\(225,\s*228,\s*225,\s*0\.8\);[\s\S]*?font-size:\s*1rem;[\s\S]*?font-weight:\s*500;[\s\S]*?letter-spacing:\s*0\.045em;/,
  "Runtime Deck invitation must remain quiet but fully readable in its own 48 px action zone",
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
  /@keyframes wyrd-runtime-deck-fan-face[\s\S]*?78%[\s\S]*?translate3d\(0, 0, 0\)[\s\S]*?87%[\s\S]*?translate3d\(0, -2px, 0\)/,
  "Runtime Deck idle motion must remain independent from the static fan angles and centres",
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
  /id="deck-wrap"[\s\S]{0,320}wyrd-deck-composition__header[\s\S]{0,700}wyrd-deck-composition__question/,
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
  /#deck-wrap :is\([\s\S]*?\.deck-card:hover[\s\S]*?filter:\s*none;[\s\S]*?transform:\s*none;/,
  "Runtime Deck must neutralize the legacy hover lift and brightness jerk",
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
  readingSilver,
  /#result \.share-card-media\s*\{[\s\S]*?top:\s*11\.5%;[\s\S]*?width:\s*61\.5%;[\s\S]*?aspect-ratio:\s*3 \/ 4;/,
  "Runtime Result must preserve the approved Artifact image window geometry",
);
assert.match(
  readingSilver,
  /#result \.card-title-block\s*\{[\s\S]*?bottom:\s*9\.25%;/,
  "Runtime Result must preserve the approved Artifact identity position",
);
assert.match(
  readingSilver,
  /#spread-result\s*\{[\s\S]*?animation:\s*none;/,
  "Spread must not recreate a transformed containing block around the fixed Sheet",
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

console.log("WYRD UI interaction smoke tests passed");
