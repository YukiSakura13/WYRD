export {
  BRIDGE_CARD_GROUPS,
  EMPTY_FATE_PATH_COPY,
  QUESTION_ROUTE_CONFIG,
} from "./question-routing/config.js";
export {
  detectArchetype,
  detectQuestionRoute,
  normalizeQuestion,
  scoreQuestionGroups,
} from "./question-routing/scoring.js";
export {
  ARCHETYPE_POSITIONS,
} from "./question-routing/archetype-config.js";
export {
  cardBelongsToGroup,
  filterCardsByPrimaryGroup,
  getRouteWeightMultiplier,
} from "./question-routing/card-groups.js";
