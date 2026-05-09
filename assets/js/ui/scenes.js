export const SCENES = Object.freeze({
  COVER: "cover",
  ONBOARDING: "onboarding",
  DECK: "deck",
  RESULT: "result",
  SPREAD: "spread",
  PAYWALL: "paywall",
  PROFILE: "profile",
});

export function isKnownScene(scene) {
  return Object.values(SCENES).includes(scene);
}
