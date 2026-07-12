import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

async function importFresh(relativePath) {
  const moduleUrl = new URL(pathToFileURL(path.join(rootDir, relativePath)).href);
  moduleUrl.searchParams.set("v", String(Date.now()));
  return import(moduleUrl.href);
}

async function main() {
  const [{ ABOUT_HASH, getAboutTargetId, isAboutHash }, { SCENES, isKnownScene }] = await Promise.all([
    importFresh("assets/js/ui/about-navigation.js"),
    importFresh("assets/js/ui/scenes.js"),
  ]);

  assert.equal(ABOUT_HASH, "#about-wyrd", "about page should keep the canonical deep link");
  assert.equal(isAboutHash("#about-wyrd"), true, "root about hash should be recognized");
  assert.equal(isAboutHash("#about-wyrd-ritual"), true, "about section hash should be recognized");
  assert.equal(isAboutHash("#profile"), false, "unrelated hash should not open about");
  assert.equal(getAboutTargetId("#about-wyrd-listen"), "about-wyrd-listen", "section target should be preserved");
  assert.equal(getAboutTargetId(""), "about-wyrd", "missing hash should fall back to the page root");
  assert.equal(SCENES.ABOUT, "about", "about scene name should remain stable");
  assert.equal(isKnownScene(SCENES.ABOUT), true, "about should be part of the canonical scene set");

  console.log("WYRD about smoke tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
