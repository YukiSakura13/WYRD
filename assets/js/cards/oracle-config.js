export const ORACLE_CONFIG = {
  paywallCopy: {
    "extra-draw": {
      title: "Ещё одна карта",
      text: "Лес говорит больше. Следующий знак уже дрожит под дымкой, но его имя пока не произнесено.",
      cta: "Открыть ещё карту",
    },
    "deep-reading": {
      title: "Углубить значение",
      text: "Лес говорит больше. Второй слой уже проступает под поверхностью, но подлинный смысл ещё удержан в тени.",
      cta: "Открыть глубину",
    },
    "spread-3": {
      title: "Расклад на 3 карты",
      text: "Лес говорит больше. Прошлое, настоящее и вектор уже сложились в узор, но лес ещё держит его под вуалью.",
      cta: "Открыть расклад",
    },
    "spread-5": {
      title: "Расклад на 5 карт",
      text: "Лес говорит больше. Пять знаков уже шевелятся под туманом, но скрытые связи не раскроются без полного видения.",
      cta: "Открыть расклад",
    },
  },
  toneWeightPresets: {
    free_present: { light: 0.875, neutral: 1.0, dark: 0.625 },
    past: { light: 0.08, neutral: 0.67, dark: 1.0 },
    present: { light: 0.875, neutral: 1.0, dark: 0.625 },
    future: { light: 1.0, neutral: 0.6, dark: 0.4 },
    hidden: { light: 0.4, neutral: 0.6, dark: 1.0 },
    any: { light: 1.0, neutral: 1.0, dark: 1.0 },
  },
  multipliers: {
    sameSpreadState: 0.25,
    previousReadingState: 0.6,
    linkBonus: 1.35,
  },
  spreads: {
    three: {
      slots: [
        { slot: 2, layer: "present", preset: "present", revealOrder: 1, spreadRole: "present", spreadLabel: "Настоящее" },
        { slot: 1, layer: "past", preset: "past", revealOrder: 2, spreadRole: "past", spreadLabel: "Прошлое" },
        { slot: 3, layer: "future", preset: "future", revealOrder: 3, spreadRole: "future", spreadLabel: "Будущее" },
      ],
    },
    five: {
      slots: [
        { slot: 1, layer: "present", preset: "present", revealOrder: 1, spreadRole: "present", spreadLabel: "Ты" },
        { slot: 2, layer: "past", preset: "past", revealOrder: 2, spreadRole: "past", spreadLabel: "Что держит" },
        { slot: 3, layer: "present", preset: "present", revealOrder: 3, spreadRole: "present", spreadLabel: "Что ведёт" },
        { slot: 4, layer: null, preset: "hidden", revealOrder: 4, spreadRole: "hidden", spreadLabel: "Что скрыто" },
        { slot: 5, layer: "future", preset: "future", revealOrder: 5, spreadRole: "future", spreadLabel: "Куда ведёт" },
      ],
    },
  },
};
