import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

async function loadStateModule() {
  const modulePath = path.join(rootDir, "assets/js/state/storage.js");
  const moduleUrl = new URL(pathToFileURL(modulePath).href);
  moduleUrl.searchParams.set("v", String(Date.now()));
  return import(moduleUrl.href);
}

function createMemoryStorage(initialState = null) {
  const store = new Map();

  if (initialState !== null) {
    store.set("wyrd-local-state-v2", initialState);
  }

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

async function main() {
  const { createStateStore } = await loadStateModule();

  const emptyStore = createStateStore(createMemoryStorage());
  const initialState = emptyStore.getState();
  assert.equal(initialState.currentReading, null, "default state should start without current reading");
  assert.deepEqual(initialState.lastSpread, [], "default state should start without spread");
  assert.equal(initialState.soundEnabled, true, "default state should enable interface sounds");
  assert.equal(initialState.musicEnabled, true, "default state should enable music");

  const legacyAudioStore = createStateStore(
    createMemoryStorage(
      JSON.stringify({
        soundEnabled: false,
      }),
    ),
  );
  assert.equal(
    legacyAudioStore.getState().musicEnabled,
    false,
    "legacy sound preference should migrate to music without unexpectedly enabling audio",
  );

  emptyStore.saveReading({
    id: "reading-1",
    free: true,
    depthUnlocked: false,
    card: { id: "card-1", name: "Unknown card" },
  });
  const afterReading = emptyStore.getState();
  assert.ok(afterReading.currentReading, "saveReading should set currentReading");
  assert.deepEqual(afterReading.lastSpread, [], "saveReading should clear lastSpread");
  assert.equal(afterReading.lastOracleReading, null, "saveReading should clear lastOracleReading");
  assert.equal(afterReading.ritualStack.length, 1, "saveReading should start ritual stack with single layer");

  emptyStore.saveSpread([{ id: "card-2", name: "Unknown spread card" }], { oracle_message: "test" });
  const afterSpread = emptyStore.getState();
  assert.equal(afterSpread.currentReading, null, "saveSpread should clear currentReading");
  assert.equal(afterSpread.lastSpread.length, 1, "saveSpread should persist spread cards");
  assert.equal(afterSpread.lastOracleReading.oracle_message, "test", "saveSpread should persist oracle reading");

  const stackStore = createStateStore(createMemoryStorage());
  const singleReading = {
    id: "reading-stack",
    free: true,
    depthUnlocked: false,
    card: { id: "card-1", name: "Unknown card" },
  };
  stackStore.saveReading(singleReading);
  stackStore.saveSpread(
    [
      { id: "card-1", name: "Unknown card", slot: 1 },
      { id: "card-2", name: "Unknown spread card", slot: 2 },
      { id: "card-3", name: "Third card", slot: 3 },
    ],
    { oracle_message: "three" },
  );
  stackStore.saveSpread(
    [
      { id: "card-1", name: "Unknown card", slot: 1 },
      { id: "card-2", name: "Unknown spread card", slot: 2 },
      { id: "card-3", name: "Third card", slot: 3 },
      { id: "card-4", name: "Fourth card", slot: 4 },
      { id: "card-5", name: "Fifth card", slot: 5 },
    ],
    { oracle_message: "five" },
  );
  const fromFiveToThree = stackStore.goBackRitualLayer();
  assert.equal(fromFiveToThree.lastSpread.length, 3, "ritual back from 5 should restore 3-card spread");
  assert.equal(fromFiveToThree.lastOracleReading.oracle_message, "three", "ritual back should restore previous oracle voice");
  const fromThreeToSingle = stackStore.goBackRitualLayer();
  assert.ok(fromThreeToSingle.currentReading, "ritual back from 3 should restore single reading");
  assert.equal(fromThreeToSingle.currentReading.id, singleReading.id, "ritual back should restore original single reading");
  const afterClearRitual = stackStore.clearCurrentRitual();
  assert.equal(afterClearRitual.currentReading, null, "clearCurrentRitual should clear current reading");
  assert.deepEqual(afterClearRitual.lastSpread, [], "clearCurrentRitual should clear spread");
  assert.deepEqual(afterClearRitual.ritualStack, [], "clearCurrentRitual should clear ritual stack");

  const pastDayState = JSON.stringify({
    dailyFreeUsedAt: "2026-05-01T08:00:00.000Z",
  });
  const boundaryStore = createStateStore(createMemoryStorage(pastDayState));
  const synced = boundaryStore.syncDayBoundary();
  assert.equal(synced.dailyFreeUsedAt, null, "syncDayBoundary should reset expired daily draw");
  assert.equal(boundaryStore.hasFreeDraw(), true, "hasFreeDraw should be true after expired day boundary reset");

  emptyStore.toggleSound();
  assert.equal(emptyStore.getState().soundEnabled, false, "toggleSound should invert soundEnabled");
  assert.equal(emptyStore.getState().musicEnabled, true, "toggleSound should not change musicEnabled");

  emptyStore.toggleMusic();
  assert.equal(emptyStore.getState().musicEnabled, false, "toggleMusic should invert musicEnabled");
  assert.equal(emptyStore.getState().soundEnabled, false, "toggleMusic should not change interface sounds");

  emptyStore.toggleAudio();
  assert.equal(emptyStore.getState().soundEnabled, true, "toggleAudio should enable interface sounds together");
  assert.equal(emptyStore.getState().musicEnabled, true, "toggleAudio should enable music together");
  emptyStore.toggleAudio();
  assert.equal(emptyStore.getState().soundEnabled, false, "toggleAudio should disable interface sounds together");
  assert.equal(emptyStore.getState().musicEnabled, false, "toggleAudio should disable music together");

  emptyStore.setAmbienceVolume(4);
  assert.equal(emptyStore.getState().ambienceVolume, 1, "music volume should clamp to 100 percent");
  emptyStore.setAmbienceVolume(-2);
  assert.equal(emptyStore.getState().ambienceVolume, 0, "music volume should clamp to zero");

  emptyStore.reset();
  const afterReset = emptyStore.getState();
  assert.equal(afterReset.currentReading, null, "reset should clear currentReading");
  assert.deepEqual(afterReset.lastSpread, [], "reset should clear spread");
  assert.equal(afterReset.soundEnabled, true, "reset should restore default soundEnabled");
  assert.equal(afterReset.musicEnabled, true, "reset should restore default musicEnabled");

  console.log("WYRD state smoke tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
