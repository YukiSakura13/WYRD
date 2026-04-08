export const ROLE_WEIGHTS = {
  current_message: 1.0,
  what_is_happening: 1.1,
  what_is_hidden: 1.35,
  where_it_leads: 1.25,
  root_of_question: 1.35,
  hidden_tension: 1.5,
  what_supports_you: 1.0,
  nearest_shift: 1.15,
  integrated_message: 1.4,
};

const TENSION_THEME_PAIRS = [
  ["fear", "choice"],
  ["grief", "release"],
  ["stillness", "flow"],
  ["memory", "rebirth"],
  ["rest", "transformation"],
];

const SUPPORT_THEMES = ["trust", "acceptance", "clarity", "rest", "softening", "guidance", "flow"];

export function buildMeaningSummary({ spreadId, cards }) {
  const safeCards = normalizeCards(cards);

  if (!safeCards.length) {
    return emptyMeaningSummary(spreadId);
  }

  const themeScores = scoreThemes(safeCards);
  const emotionScores = scoreEmotions(safeCards);
  const toneProfile = scoreTones(safeCards);
  const strongestCard = findStrongestCard(safeCards);
  const averageIntensity = getAverageIntensity(safeCards);

  const dominantThemes = topKeys(themeScores, 3);
  const secondaryThemes = nextKeys(themeScores, dominantThemes, 3);
  const dominantEmotion = topKey(emotionScores) || "uncertainty";

  const centralTension = buildCentralTension({
    cards: safeCards,
    dominantThemes,
    dominantEmotion,
    toneProfile,
  });

  const directionalVector = buildDirectionalVector(safeCards);
  const supportSignal = buildSupportSignal(safeCards, themeScores);
  const spreadSignature = buildSpreadSignature({
    dominantThemes,
    dominantEmotion,
    directionalVector,
  });

  return {
    spreadId,
    dominantThemes,
    secondaryThemes,
    dominantEmotion,
    toneProfile,
    averageIntensity,
    strongestCardId: strongestCard?.id || null,
    strongestRole: strongestCard?.role || null,
    centralTension,
    directionalVector,
    supportSignal,
    spreadSignature,
  };
}

function normalizeCards(cards) {
  if (!Array.isArray(cards)) {
    return [];
  }

  return cards
    .filter(Boolean)
    .map(function mapCard(card) {
      return {
        id: card.id,
        role: card.spreadRole || card.role || "current_message",
        layer: card.layer || "present",
        tone: card.tone || "neutral",
        emotion: card.emotion || "uncertainty",
        archetype: card.archetype || "witness",
        intensity: clampIntensity(card.intensity),
        themes: Array.isArray(card.themes) ? card.themes : [],
        state: card.state || null,
      };
    });
}

function clampIntensity(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 3;
  }

  return Math.max(1, Math.min(5, Math.round(number)));
}

function getRoleWeight(role) {
  return ROLE_WEIGHTS[role] ?? 1;
}

function scoreThemes(cards) {
  const scores = {};

  for (const card of cards) {
    for (const theme of card.themes) {
      scores[theme] = (scores[theme] || 0) + card.intensity * getRoleWeight(card.role);
    }
  }

  return scores;
}

function scoreEmotions(cards) {
  const scores = {};

  for (const card of cards) {
    scores[card.emotion] = (scores[card.emotion] || 0) + card.intensity * getRoleWeight(card.role);
  }

  return scores;
}

function scoreTones(cards) {
  const profile = {
    light: 0,
    neutral: 0,
    dark: 0,
  };

  for (const card of cards) {
    if (!(card.tone in profile)) {
      continue;
    }

    profile[card.tone] += card.intensity;
  }

  return profile;
}

function findStrongestCard(cards) {
  let winner = null;
  let winnerScore = -1;

  for (const card of cards) {
    const score = card.intensity * getRoleWeight(card.role);
    if (score > winnerScore) {
      winner = card;
      winnerScore = score;
    }
  }

  return winner;
}

function getAverageIntensity(cards) {
  const total = cards.reduce(function sum(accumulator, card) {
    return accumulator + card.intensity;
  }, 0);

  return Number((total / cards.length).toFixed(1));
}

function buildCentralTension({ cards, dominantThemes, dominantEmotion, toneProfile }) {
  const hiddenCard = cards.find(function findHidden(card) {
    return card.role === "hidden_tension" || card.role === "what_is_hidden";
  });

  if (hiddenCard) {
    const leadingTheme = hiddenCard.themes[0] || dominantThemes[0] || "скрытого узла";
    return {
      type: "hidden_tension",
      summary: `Скрытое напряжение связано с темой ${leadingTheme}, которая уже влияет на путь, даже если ещё не названа прямо.`,
    };
  }

  for (const [left, right] of TENSION_THEME_PAIRS) {
    if (dominantThemes.includes(left) && dominantThemes.includes(right)) {
      return {
        type: "inner_conflict",
        summary: `Главный узел расклада лежит между темами ${left} и ${right}.`,
      };
    }
  }

  if (toneProfile.dark > 0 && toneProfile.light > 0) {
    return {
      type: "contrast",
      summary: "В этом чтении тень и свет звучат одновременно, и именно их встреча задаёт главный поворот.",
    };
  }

  return {
    type: "emotional_core",
    summary: `Главный узел чтения сейчас связан с состоянием ${dominantEmotion}.`,
  };
}

function buildDirectionalVector(cards) {
  const fromCards = cards.filter(function isFrom(card) {
    return ["root_of_question", "what_is_hidden"].includes(card.role) || card.layer === "past";
  });
  const throughCards = cards.filter(function isThrough(card) {
    return ["what_is_happening", "hidden_tension", "what_supports_you", "nearest_shift", "current_message"].includes(card.role) || card.layer === "present";
  });
  const toCards = cards.filter(function isTo(card) {
    return ["where_it_leads", "integrated_message"].includes(card.role) || card.layer === "future";
  });

  return {
    from: dominantThemeForCards(fromCards),
    through: dominantThemeForCards(throughCards),
    to: dominantThemeForCards(toCards),
  };
}

function dominantThemeForCards(cards) {
  const scores = scoreThemes(cards);
  return topKey(scores) || "unknown";
}

function buildSupportSignal(cards, themeScores) {
  const supportCards = cards.filter(function isSupport(card) {
    return ["what_supports_you", "current_message", "nearest_shift"].includes(card.role) || card.layer === "present";
  });

  for (const theme of SUPPORT_THEMES) {
    if (themeScores[theme]) {
      return {
        theme,
        summary: supportSummary(theme),
      };
    }
  }

  const fallback = softestCard(supportCards.length ? supportCards : cards);
  return {
    theme: fallback?.themes?.[0] || "softening",
    summary: fallback
      ? `Поддержка приходит через качество, которое несёт карта ${fallback.id}.`
      : "Поддержка приходит через мягкость и внимательность к знакам пути.",
  };
}

function supportSummary(theme) {
  const summaries = {
    trust: "Поддержка приходит через доверие тому, что уже зреет внутри.",
    acceptance: "Поддержка приходит через принятие того, что уже нельзя не замечать.",
    clarity: "Поддержка приходит через ясность и честность с собой.",
    rest: "Поддержка приходит через паузу, которая готовит новый шаг.",
    softening: "Поддержка приходит через мягкость там, где раньше было одно напряжение.",
    guidance: "Поддержка приходит через знак, который помогает увидеть следующий поворот.",
    flow: "Поддержка приходит через движение без лишней борьбы.",
  };

  return summaries[theme] || "Поддержка приходит через более тихое и ясное присутствие в своей ситуации.";
}

function softestCard(cards) {
  const toneOrder = { light: 0, neutral: 1, dark: 2 };
  return cards
    .slice()
    .sort(function compare(a, b) {
      const toneDelta = (toneOrder[a.tone] ?? 1) - (toneOrder[b.tone] ?? 1);
      if (toneDelta !== 0) {
        return toneDelta;
      }

      return a.intensity - b.intensity;
    })[0] || null;
}

function buildSpreadSignature({ dominantThemes, dominantEmotion, directionalVector }) {
  const leadTheme = dominantThemes[0] || "unknown";
  const to = directionalVector?.to || "unknown";
  return `${leadTheme}_${dominantEmotion}_${to}`;
}

function topKey(scores) {
  return Object.entries(scores).sort(function byScore(a, b) {
    return b[1] - a[1];
  })[0]?.[0] || null;
}

function topKeys(scores, limit) {
  return Object.entries(scores)
    .sort(function byScore(a, b) {
      return b[1] - a[1];
    })
    .slice(0, limit)
    .map(function mapKey([key]) {
      return key;
    });
}

function nextKeys(scores, usedKeys, limit) {
  const used = new Set(usedKeys);
  return Object.entries(scores)
    .filter(function filterUsed([key]) {
      return !used.has(key);
    })
    .sort(function byScore(a, b) {
      return b[1] - a[1];
    })
    .slice(0, limit)
    .map(function mapKey([key]) {
      return key;
    });
}

function emptyMeaningSummary(spreadId) {
  return {
    spreadId,
    dominantThemes: [],
    secondaryThemes: [],
    dominantEmotion: "uncertainty",
    toneProfile: { light: 0, neutral: 0, dark: 0 },
    averageIntensity: 0,
    strongestCardId: null,
    strongestRole: null,
    centralTension: { type: "none", summary: "" },
    directionalVector: { from: "unknown", through: "unknown", to: "unknown" },
    supportSignal: { theme: "softening", summary: "" },
    spreadSignature: "unknown_uncertainty_unknown",
  };
}
