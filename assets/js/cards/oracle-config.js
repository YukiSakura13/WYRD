import { SPREADS_CONFIG } from "./spreads-config.js";

export const ORACLE_CONFIG = {
  continuationCopy: {
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
      title: "Увидеть, что скрыто",
      text: "Это только первый знак. Прошлое и будущее уже проступают за ним, и лес готов открыть следующий слой.",
      cta: "Увидеть, что скрыто",
    },
    "spread-5": {
      title: "Продолжить путь",
      text: "История уже открылась. Лес может показать узор целиком, если ты захочешь пройти глубже.",
      cta: "Продолжить путь",
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
    three: SPREADS_CONFIG.deepening,
    five: SPREADS_CONFIG.oracle_reading,
  },
};
