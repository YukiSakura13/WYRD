export const SCENES = Object.freeze({
  COVER: "cover",
  FOREST: "forest",
  ONBOARDING: "onboarding",
  DECK: "deck",
  RESULT: "result",
  SPREAD: "spread",
  PROFILE: "profile",
  LUNAR_DAY: "lunar-day",
  YES_NO: "yes-no",
  NIGHT_IMAGES: "night-images",
  SPIRIT_BOOK: "spirit-book",
  SETTINGS: "settings",
  ABOUT_YOU: "about-you",
  REMINDERS: "reminders",
});

export function isKnownScene(scene) {
  return Object.values(SCENES).includes(scene);
}
