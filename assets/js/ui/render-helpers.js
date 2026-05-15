export const DEEP_READING_TEXT =
  'Этот знак просит не ответа, а внутренней тишины. Вернись к нему вечером и проверь, где в течение дня уже проявился образ "%CARD_NAME%".';

const EMPTY_CARD_IMAGE = createEmptyCardImage();

export function getCardImage(card) {
  return card.image || EMPTY_CARD_IMAGE;
}

export function layerLabel(layer) {
  if (layer === "past") {
    return "Прошлое";
  }

  if (layer === "future") {
    return "Будущее";
  }

  return "Настоящее";
}

export function getSpreadDelay(card, count) {
  const revealOrder = Math.max((card.revealOrder || 1) - 1, 0);

  if (count === 5) {
    return `${revealOrder * 860}ms`;
  }

  return `${revealOrder * 460}ms`;
}

export function getSpreadStageNote(count) {
  if (count === 5) {
    return "Лес открывает пять знаков: якорь, слои вокруг него и направление пути.";
  }

  if (count === 3) {
    return "Первый знак уже знаком тебе. Теперь лес открывает два новых слоя вокруг него.";
  }

  return "";
}

function createEmptyCardImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
      <rect width="300" height="400" fill="#14141d"/>
      <rect x="10" y="10" width="280" height="380" rx="2" fill="none" stroke="rgba(201,161,74,0.26)"/>
      <rect x="22" y="22" width="256" height="356" rx="2" fill="none" stroke="rgba(201,161,74,0.12)"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
