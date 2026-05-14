import {
  CONTEXT_PAIR_WEIGHT,
  EMPTY_FATE_PATH_COPY,
  EXACT_SIGNAL_WEIGHT,
  KEYWORD_WEIGHT,
  QUESTION_ROUTE_CONFIG,
  SOFT_CONTEXT_PAIR_WEIGHT,
  SOFT_KEYWORD_WEIGHT,
} from "./config.js";

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
    scores,
  };
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
