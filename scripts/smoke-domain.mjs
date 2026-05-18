import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function checkRoute(routing, question, expected) {
  const route = routing.detectQuestionRoute(question);

  if (expected.primaryGroup) {
    assert.equal(route.primaryGroup, expected.primaryGroup, `primaryGroup mismatch for "${question}"`);
  }

  if ("secondaryGroup" in expected) {
    assert.equal(route.secondaryGroup, expected.secondaryGroup, `secondaryGroup mismatch for "${question}"`);
  }

  if ("matched" in expected) {
    assert.equal(route.matched, expected.matched, `matched mismatch for "${question}"`);
  }

  if ("reason" in expected) {
    assert.equal(route.reason, expected.reason, `reason mismatch for "${question}"`);
  }
}

async function loadRoutingModule() {
  const modulePath = path.join(rootDir, "assets/js/cards/question-routing.js");
  const moduleUrl = new URL(pathToFileURL(modulePath).href);
  moduleUrl.searchParams.set("v", String(Date.now()));
  return import(moduleUrl.href);
}

async function main() {
  const routing = await loadRoutingModule();

  checkRoute(routing, "", {
    primaryGroup: "fate_path",
    secondaryGroup: null,
    matched: false,
    reason: "empty",
  });

  checkRoute(routing, "Любит ли он меня и будет ли встреча?", {
    primaryGroup: "love_romance",
    matched: true,
  });

  checkRoute(routing, "Какой шаг мне сделать в работе и деньгах?", {
    primaryGroup: "career_money",
    matched: true,
  });

  checkRoute(routing, "Кому из близких можно доверять?", {
    primaryGroup: "family_circle",
    matched: true,
  });

  checkRoute(routing, "Как восстановиться, если у меня нет сил?", {
    primaryGroup: "health_recovery",
    matched: true,
  });

  checkRoute(routing, "Что мне важно понять о моём пути прямо сейчас?", {
    primaryGroup: "fate_path",
    matched: true,
  });

  checkRoute(routing, "Почему всё так плохо?", {
    primaryGroup: "trials_growth",
    matched: true,
  });

  checkRoute(routing, "Он ко мне тянется или мне просто кажется?", {
    primaryGroup: "love_romance",
    matched: true,
  });

  checkRoute(routing, "Ко мне вернётся проблемный заказчик?", {
    primaryGroup: "career_money",
    matched: true,
  });

  checkRoute(routing, "Я когда-нибудь избавлюсь от этой головной боли?", {
    primaryGroup: "health_recovery",
    matched: true,
  });

  checkRoute(routing, "Я смогу улететь в отпуск в другую страну?", {
    primaryGroup: "health_recovery",
    matched: true,
  });

  checkRoute(routing, "Что происходит в отношениях с мамой и семьёй?", {
    primaryGroup: "love_romance",
    secondaryGroup: "family_circle",
    matched: true,
  });

  const normalized = routing.normalizeQuestion("  Ёж и Ёлка  ");
  assert.equal(normalized, "еж и елка", "normalizeQuestion should trim and normalize ё");

  const scoredLove = routing.scoreQuestionGroups("Любит ли он меня, скучает ли и будет ли встреча?");
  assert.ok(
    scoredLove.scores.love_romance > scoredLove.scores.career_money,
    "love question should outscore career_money",
  );

  assert.equal(routing.detectArchetype("вернётся ли он"), "B", "return question should use archetype B");
  assert.equal(routing.detectArchetype("почему он молчит"), "A", "why question should use archetype A");
  assert.equal(routing.detectArchetype("он сам объявится"), "B", "will-appear question should use archetype B");
  assert.equal(
    routing.detectArchetype("если я сейчас соглашусь, потом не пожалею же?"),
    "C",
    "agreement regret question should use archetype C",
  );

  const bridgeMultiplier = routing.getRouteWeightMultiplier("Хранитель Нитей", {
    primaryGroup: "love_romance",
    secondaryGroup: "fate_path",
    matched: true,
  });
  assert.ok(bridgeMultiplier > 1, "bridge card should receive a route multiplier above 1");

  const fallbackCards = routing.filterCardsByPrimaryGroup(
    [{ name: "Несуществующая карта" }],
    { primaryGroup: "love_romance" },
  );
  assert.equal(fallbackCards.length, 1, "fallback filtering should keep original cards when no match exists");

  console.log("WYRD domain smoke tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
