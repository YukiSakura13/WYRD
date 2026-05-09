import {
  BRIDGE_CARD_GROUPS,
  FALLBACK_FATE_PATH_MULTIPLIER,
  PRIMARY_GROUP_MULTIPLIER,
  QUESTION_ROUTE_CONFIG,
  SECONDARY_GROUP_MULTIPLIER,
} from "./config.js";

const CARD_GROUPS = buildCardGroups();

export function cardBelongsToGroup(cardName, groupId) {
  const groups = CARD_GROUPS[cardName];
  return Array.isArray(groups) && groups.includes(groupId);
}

export function getRouteWeightMultiplier(cardName, route) {
  if (!route || !route.primaryGroup) {
    return 1;
  }

  let multiplier = 1;

  if (cardBelongsToGroup(cardName, route.primaryGroup)) {
    multiplier *= route.matched ? PRIMARY_GROUP_MULTIPLIER : FALLBACK_FATE_PATH_MULTIPLIER;
  }

  if (route.secondaryGroup && cardBelongsToGroup(cardName, route.secondaryGroup)) {
    multiplier *= SECONDARY_GROUP_MULTIPLIER;
  }

  return multiplier;
}

export function filterCardsByPrimaryGroup(cards, route) {
  if (!route || !route.primaryGroup) {
    return cards;
  }

  const filteredCards = cards.filter(function filterCard(card) {
    return cardBelongsToGroup(card.name, route.primaryGroup);
  });

  return filteredCards.length ? filteredCards : cards;
}

function buildCardGroups() {
  const cardGroups = {};

  Object.entries(QUESTION_ROUTE_CONFIG).forEach(function registerGroup([groupId, config]) {
    config.cards.forEach(function registerCard(cardName) {
      if (!cardGroups[cardName]) {
        cardGroups[cardName] = [];
      }

      if (!cardGroups[cardName].includes(groupId)) {
        cardGroups[cardName].push(groupId);
      }
    });
  });

  Object.entries(BRIDGE_CARD_GROUPS).forEach(function registerBridgeGroups([cardName, groups]) {
    if (!cardGroups[cardName]) {
      cardGroups[cardName] = [];
    }

    groups.forEach(function addBridgeGroup(groupId) {
      if (!cardGroups[cardName].includes(groupId)) {
        cardGroups[cardName].push(groupId);
      }
    });
  });

  return cardGroups;
}
