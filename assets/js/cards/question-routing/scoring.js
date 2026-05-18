import {
  ARCHETYPE_CONFIG,
  ARCHETYPE_EXACT_WEIGHT,
  ARCHETYPE_KEYWORD_WEIGHT,
  ARCHETYPE_PAIR_WEIGHT,
  DEFAULT_ARCHETYPE,
} from "./archetype-config.js";
import {
  CONTEXT_PAIR_WEIGHT,
  EMPTY_FATE_PATH_COPY,
  EXACT_SIGNAL_WEIGHT,
  KEYWORD_WEIGHT,
  QUESTION_ROUTE_CONFIG,
  SOFT_CONTEXT_PAIR_WEIGHT,
  SOFT_KEYWORD_WEIGHT,
} from "./config.js";

const DOMAIN_CONTEXT_BOOST = 8;
const STRONG_DOMAIN_CONTEXT_BOOST = 12;
const CROSS_DOMAIN_PENALTY = 10;

const CAREER_CONTEXTS = [
  "работ",
  "карьер",
  "бизнес",
  "проект",
  "клиент",
  "заказ",
  "деньг",
  "доход",
  "зарплат",
  "повыш",
  "преми",
  "начальник",
  "коллег",
  "офис",
  "делов",
  "доля",
  "прибыль",
  "контракт",
  "сделк",
  "отожм",
  "отжать",
  "заберет бизнес",
  "заберёт бизнес",
  "партнер по бизнесу",
  "партнером по бизнесу",
  "партнёр по бизнесу",
  "деловой партнер",
  "деловой партнёр",
];

const LOVE_CONTEXTS = [
  "люб",
  "любов",
  "влюб",
  "чувств",
  "отнош",
  "бывш",
  "скучает",
  "ревност",
  "свидан",
  "поцел",
  "сердц",
  "нравлюсь",
  "нравит",
  "симпат",
  "флирт",
  "расстав",
  "измен",
  "молчит",
  "не пишет",
  "напишет",
  "ответит",
  "объявится",
  "тянется",
  "между нами",
  "с ним",
  "с ней",
  "он ко мне",
  "она ко мне",
];

const STRONG_LOVE_CONTEXTS = LOVE_CONTEXTS.filter(function filterStrongLoveContext(context) {
  return context !== "отнош";
});

const HEALTH_CONTEXTS = [
  "устал",
  "нет сил",
  "сил нет",
  "выгор",
  "здоров",
  "болит",
  "голов",
  "мигр",
  "сон",
  "спать",
  "восстанов",
  "отдых",
  "отпуск",
  "ресурс",
  "истощ",
  "перегруз",
  "пауза",
];

const FAMILY_CONTEXTS = [
  "семь",
  "мама",
  "папа",
  "родител",
  "родн",
  "близк",
  "друз",
  "подруг",
  "сестр",
  "брат",
  "дети",
];

const TRIAL_CONTEXTS = [
  "тяжело",
  "трудно",
  "страшно",
  "боюсь",
  "криз",
  "конфликт",
  "давлен",
  "тревог",
  "не справ",
  "хуже",
  "плохо",
];

export function normalizeQuestion(question) {
  return typeof question === "string" ? question.trim().toLowerCase().replaceAll("ё", "е") : "";
}

export function scoreQuestionGroups(question) {
  const normalizedQuestion = normalizeQuestion(question);
  const scores = {};

  Object.entries(QUESTION_ROUTE_CONFIG).forEach(function scoreGroup([groupId, config]) {
    let score = config.defaultWeight || 0;

    if (normalizedQuestion) {
      (config.exactSignals || []).forEach(function scoreExactSignal(signal) {
        if (normalizedQuestion.includes(normalizeQuestion(signal))) {
          score += EXACT_SIGNAL_WEIGHT;
        }
      });

      config.keywords.forEach(function scoreKeyword(keyword) {
        if (normalizedQuestion.includes(normalizeQuestion(keyword))) {
          score += KEYWORD_WEIGHT;
        }
      });

      (config.softKeywords || []).forEach(function scoreSoftKeyword(keyword) {
        if (normalizedQuestion.includes(normalizeQuestion(keyword))) {
          score += SOFT_KEYWORD_WEIGHT;
        }
      });

      config.contextPairs.forEach(function scoreContextPair(pair) {
        const [first, second] = pair;
        if (normalizedQuestion.includes(normalizeQuestion(first)) && normalizedQuestion.includes(normalizeQuestion(second))) {
          score += CONTEXT_PAIR_WEIGHT;
        }
      });

      (config.softContextPairs || []).forEach(function scoreSoftContextPair(pair) {
        const [first, second] = pair;
        if (normalizedQuestion.includes(normalizeQuestion(first)) && normalizedQuestion.includes(normalizeQuestion(second))) {
          score += SOFT_CONTEXT_PAIR_WEIGHT;
        }
      });
    }

    scores[groupId] = score;
  });

  return {
    normalizedQuestion,
    scores: applyDomainContextAdjustments(normalizedQuestion, scores),
  };
}

function applyDomainContextAdjustments(normalizedQuestion, scores) {
  if (!normalizedQuestion) {
    return scores;
  }

  const adjustedScores = { ...scores };
  const hasCareerContext = hasAny(normalizedQuestion, CAREER_CONTEXTS);
  const hasLoveContext = hasAny(normalizedQuestion, LOVE_CONTEXTS);
  const hasStrongLoveContext = hasAny(normalizedQuestion, STRONG_LOVE_CONTEXTS);
  const hasHealthContext = hasAny(normalizedQuestion, HEALTH_CONTEXTS);
  const hasFamilyContext = hasAny(normalizedQuestion, FAMILY_CONTEXTS);
  const hasTrialContext = hasAny(normalizedQuestion, TRIAL_CONTEXTS);

  if (hasCareerContext) {
    adjustedScores.career_money += DOMAIN_CONTEXT_BOOST;

    if (hasAny(normalizedQuestion, ["бизнес", "клиент", "заказ", "деньг", "повыш", "начальник", "делов"])) {
      adjustedScores.career_money += DOMAIN_CONTEXT_BOOST;
    }

    if (!hasLoveContext || hasAny(normalizedQuestion, ["партнер", "партнером", "партнёр", "встреча", "шанс", "пара"])) {
      adjustedScores.love_romance = Math.max(0, adjustedScores.love_romance - CROSS_DOMAIN_PENALTY);
    }

    if (hasAny(normalizedQuestion, ["работаю из дома", "работа из дома", "из дома"])) {
      adjustedScores.family_circle = Math.max(0, adjustedScores.family_circle - CROSS_DOMAIN_PENALTY);
    }
  }

  if (hasHealthContext) {
    adjustedScores.health_recovery += DOMAIN_CONTEXT_BOOST;

    if (hasAny(normalizedQuestion, ["устал", "нет сил", "сил нет", "выгор", "истощ", "перегруз"])) {
      adjustedScores.health_recovery += STRONG_DOMAIN_CONTEXT_BOOST;
      adjustedScores.career_money = Math.max(0, adjustedScores.career_money - SOFT_KEYWORD_WEIGHT);
    }
  }

  if (hasFamilyContext && !hasCareerContext) {
    adjustedScores.family_circle += DOMAIN_CONTEXT_BOOST;

    if (!hasStrongLoveContext) {
      adjustedScores.love_romance = Math.max(0, adjustedScores.love_romance - CROSS_DOMAIN_PENALTY);
    }
  }

  if (hasLoveContext && !hasCareerContext && (!hasFamilyContext || hasStrongLoveContext)) {
    adjustedScores.love_romance += DOMAIN_CONTEXT_BOOST;
  }

  if (hasTrialContext && !hasCareerContext && !hasHealthContext) {
    adjustedScores.trials_growth += SOFT_KEYWORD_WEIGHT;
  }

  return adjustedScores;
}

function hasAny(value, fragments) {
  return fragments.some(function hasFragment(fragment) {
    return value.includes(normalizeQuestion(fragment));
  });
}

export function detectQuestionRoute(question) {
  const { normalizedQuestion, scores } = scoreQuestionGroups(question);

  if (!normalizedQuestion) {
    return {
      normalizedQuestion,
      scores,
      primaryGroup: "fate_path",
      secondaryGroup: null,
      reason: "empty",
      matched: false,
      displayQuestion: EMPTY_FATE_PATH_COPY,
    };
  }

  const rankedGroups = Object.entries(scores)
    .map(function buildRankedGroup([groupId, score]) {
      return { groupId, score };
    })
    .sort(function sortByScore(left, right) {
      return right.score - left.score;
    });

  const topGroup = rankedGroups[0];

  if (!topGroup || topGroup.score <= 0) {
    return {
      normalizedQuestion,
      scores,
      primaryGroup: "fate_path",
      secondaryGroup: null,
      reason: "unrecognized",
      matched: false,
      displayQuestion: EMPTY_FATE_PATH_COPY,
    };
  }

  const secondGroup = rankedGroups[1];
  const secondaryGroup =
    secondGroup && secondGroup.score > 0 && topGroup.score - secondGroup.score <= 1 ? secondGroup.groupId : null;

  return {
    normalizedQuestion,
    scores,
    primaryGroup: topGroup.groupId,
    secondaryGroup,
    reason: "matched",
    matched: true,
    displayQuestion: question,
  };
}

export function detectArchetype(question) {
  const normalizedQuestion = normalizeQuestion(question);

  if (!normalizedQuestion) {
    return DEFAULT_ARCHETYPE;
  }

  const scores = {};

  Object.entries(ARCHETYPE_CONFIG).forEach(function scoreArchetype([archetypeId, config]) {
    let score = config.defaultWeight || 0;

    (config.exactSignals || []).forEach(function scoreExactSignal(signal) {
      if (normalizedQuestion.includes(normalizeQuestion(signal))) {
        score += ARCHETYPE_EXACT_WEIGHT;
      }
    });

    (config.keywords || []).forEach(function scoreKeyword(keyword) {
      if (normalizedQuestion.includes(normalizeQuestion(keyword))) {
        score += ARCHETYPE_KEYWORD_WEIGHT;
      }
    });

    (config.contextPairs || []).forEach(function scoreContextPair(pair) {
      const [first, second] = pair;

      if (normalizedQuestion.includes(normalizeQuestion(first)) && normalizedQuestion.includes(normalizeQuestion(second))) {
        score += ARCHETYPE_PAIR_WEIGHT;
      }
    });

    scores[archetypeId] = score;
  });

  const rankedArchetypes = Object.entries(scores).sort(function sortByScore(left, right) {
    return right[1] - left[1];
  });

  return rankedArchetypes[0]?.[0] || DEFAULT_ARCHETYPE;
}
