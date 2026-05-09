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

  emptyStore.saveSpread([{ id: "card-2", name: "Unknown spread card" }], { oracle_message: "test" });
  const afterSpread = emptyStore.getState();
  assert.equal(afterSpread.currentReading, null, "saveSpread should clear currentReading");
  assert.equal(afterSpread.lastSpread.length, 1, "saveSpread should persist spread cards");
  assert.equal(afterSpread.lastOracleReading.oracle_message, "test", "saveSpread should persist oracle reading");

  const pastDayState = JSON.stringify({
    dailyFreeUsedAt: "2026-05-01T08:00:00.000Z",
  });
  const boundaryStore = createStateStore(createMemoryStorage(pastDayState));
  const synced = boundaryStore.syncDayBoundary();
  assert.equal(synced.dailyFreeUsedAt, null, "syncDayBoundary should reset expired daily draw");
  assert.equal(boundaryStore.hasFreeDraw(), true, "hasFreeDraw should be true after expired day boundary reset");

  emptyStore.toggleSound();
  assert.equal(emptyStore.getState().soundEnabled, false, "toggleSound should invert soundEnabled");

  emptyStore.reset();
  const afterReset = emptyStore.getState();
  assert.equal(afterReset.currentReading, null, "reset should clear currentReading");
  assert.deepEqual(afterReset.lastSpread, [], "reset should clear spread");
  assert.equal(afterReset.soundEnabled, true, "reset should restore default soundEnabled");

  console.log("WYRD state smoke tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
