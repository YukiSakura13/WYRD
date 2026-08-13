export const SCENES = Object.freeze({
  COVER: "cover",
  FOREST: "forest",
  SETTINGS: "settings",
  ABOUT_YOU: "about-you",
  REMINDERS: "reminders",
  APP_INFO: "app-info",
  LUNAR_DAY: "lunar-day",
  YES_NO: "yes-no",
  NIGHT_IMAGES: "night-images",
  SPIRIT_BOOK: "spirit-book",
  ONBOARDING: "onboarding",
  DECK: "deck",
  RESULT: "result",
  SPREAD: "spread",
  TRACES: "traces",
});

export function isKnownScene(scene) {
  return Object.values(SCENES).includes(scene);
}
