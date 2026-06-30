export const SCENES = Object.freeze({
  COVER: "cover",
  FOREST: "forest",
  ABOUT: "about",
  ONBOARDING: "onboarding",
  DECK: "deck",
  RESULT: "result",
  SPREAD: "spread",
  PROFILE: "profile",
});

export function isKnownScene(scene) {
  return Object.values(SCENES).includes(scene);
}
