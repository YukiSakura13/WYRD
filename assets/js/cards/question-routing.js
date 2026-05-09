export {
  BRIDGE_CARD_GROUPS,
  EMPTY_FATE_PATH_COPY,
  QUESTION_ROUTE_CONFIG,
} from "./question-routing/config.js";
export {
  detectQuestionRoute,
  normalizeQuestion,
  scoreQuestionGroups,
} from "./question-routing/scoring.js";
export {
  cardBelongsToGroup,
  filterCardsByPrimaryGroup,
  getRouteWeightMultiplier,
} from "./question-routing/card-groups.js";
