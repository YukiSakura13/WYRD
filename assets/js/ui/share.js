import { getCardImage } from "./render-helpers.js";
import { formatFullTraceDate, getMoonPhase } from "./moon.js";
import { getDialogController } from "./dialog-controller.js";

let isShareInProgress = false;
let isSaveInProgress = false;
let cachedShareKey = null;
let cachedShareBlobPromise = null;
let frameImagePromise = null;
let saveScreenCleanupTimer = 0;

const SHARE_WIDTH = 1086;
const SHARE_HEIGHT = 1448;
const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;
const CANVAS_TIMEOUT_MS = 8000;
const ASSET_TIMEOUT_MS = 3500;
const FRAME_SRC = new URL("../../ui/card-frames/approved/wyrd-card-frame-artifact.svg", import.meta.url).href;

const ARTIFACT_MEDIA_TOP = 0.115;
const ARTIFACT_MEDIA_WIDTH = 0.615;
const ARTIFACT_IDENTITY_BOTTOM = 0.0925;

export function primeShareCard(reading) {
  const normalizedReading = normalizeReading(reading);
  if (!normalizedReading) {
    cachedShareKey = null;
    cachedShareBlobPromise = null;
    return Promise.resolve(null);
  }

  if (cachedShareKey === normalizedReading.key && cachedShareBlobPromise) {
    return cachedShareBlobPromise;
  }

  cachedShareKey = normalizedReading.key;
  cachedShareBlobPromise = withTimeout(generateShareCardPng(normalizedReading), CANVAS_TIMEOUT_MS, "share render timeout").catch(
    function handlePrimeError(error) {
      console.error("share prime error:", error);
      if (cachedShareKey === normalizedReading.key) {
        cachedShareBlobPromise = null;
      }
      return null;
    },
  );

  return cachedShareBlobPromise;
}

export function shareCurrentCard(store) {
  const button = document.querySelector('#result [data-action="share-card"]');
  const buttonLabel = document.getElementById("share-button-label");
  const feedback = document.getElementById("share-feedback");
  const saveButton = document.querySelector('#result [data-action="save-card"]');
  const reading = store?.getState?.().currentReading || null;
  const normalizedReading = normalizeReading(reading);

  if (!button || isShareInProgress || isSaveInProgress) {
    return;
  }

  if (!normalizedReading) {
    setShareButtonState({
      button,
      buttonLabel,
      feedback,
      isLoading: false,
      message: "Не удалось найти карту для шеринга.",
    });
    return;
  }

  isShareInProgress = true;
  setSaveButtonDisabled(saveButton, true);
  setShareButtonState({
    button,
    buttonLabel,
    feedback,
    isLoading: true,
    message: "",
  });

  primeShareCard(normalizedReading)
    .then(function handlePrimedBlob(blob) {
      if (!blob) {
        throw new Error("share blob unavailable");
      }

      return shareBlob(blob, normalizedReading);
    })
    .then(function handleShareSuccess(result) {
      setShareButtonState({
        button,
        buttonLabel,
        feedback,
        isLoading: false,
        message:
          result === "download"
            ? "Системное меню «Поделиться» здесь недоступно. PNG карты отправлен в загрузки."
            : "",
      });
    })
    .catch(function handleShareError(error) {
      if (isAbortError(error)) {
        setShareButtonState({
          button,
          buttonLabel,
          feedback,
          isLoading: false,
          message: "",
        });
        return;
      }

      console.error("share error:", error);
      setShareButtonState({
        button,
        buttonLabel,
        feedback,
        isLoading: false,
        message: "Не удалось подготовить изображение. Попробуй ещё раз.",
      });
    })
    .finally(function finishShareFlow() {
      isShareInProgress = false;
      setSaveButtonDisabled(saveButton, false);
    });
}

export function saveCurrentCard(store) {
  const button = document.querySelector('#result [data-action="save-card"]');
  const buttonLabel = document.getElementById("save-button-label");
  const shareButton = document.querySelector('#result [data-action="share-card"]');
  const feedback = document.getElementById("share-feedback");
  const saveScreen = getSaveScreenElements();
  const reading = store?.getState?.().currentReading || null;
  const normalizedReading = normalizeReading(reading);

  if (!button || isSaveInProgress || isShareInProgress) {
    return;
  }

  clearShareFeedback(feedback);
  openSaveScreen(saveScreen);

  if (!normalizedReading) {
    showSaveScreenError(saveScreen, "Не удалось найти карту для сохранения.");
    return;
  }

  isSaveInProgress = true;
  setShareButtonDisabled(shareButton, true);
  setSaveButtonState({
    button,
    buttonLabel,
    isLoading: true,
  });

  const fileName = buildShareFileName(normalizedReading, "story");

  withTimeout(generateStoryReadyPng(normalizedReading), CANVAS_TIMEOUT_MS, "story render timeout")
    .then(function handleStoryBlob(storyBlob) {
      return showSaveScreenImage(storyBlob, fileName, saveScreen);
    })
    .catch(function handleSaveError(error) {
      if (isAbortError(error)) {
        closeSaveScreen();
        return;
      }

      console.error("save error:", error);
      showSaveScreenError(saveScreen);
    })
    .finally(function finishSaveFlow() {
      isSaveInProgress = false;
      setShareButtonDisabled(shareButton, false);
      setSaveButtonState({
        button,
        buttonLabel,
        isLoading: false,
      });
    });
}

export function closeSaveScreen() {
  const saveScreen = getSaveScreenElements();
  getDialogController().sync(saveScreen.layer, false);
  window.clearTimeout(saveScreenCleanupTimer);
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 240;
  saveScreenCleanupTimer = window.setTimeout(() => resetSaveScreenContent(saveScreen), delay);
}

function getSaveScreenElements() {
  const panel = document.getElementById("save-screen");
  return {
    layer: document.getElementById("save-screen-layer"),
    panel,
    copy: document.getElementById("save-screen-copy"),
    loading: document.getElementById("save-screen-loading"),
    image: document.getElementById("save-screen-image"),
    link: document.getElementById("save-screen-link"),
    objectUrl: panel?.dataset.objectUrl || "",
  };
}

function openSaveScreen(saveScreen) {
  window.clearTimeout(saveScreenCleanupTimer);
  resetSaveScreenContent(saveScreen);

  if (saveScreen.copy) {
    saveScreen.copy.textContent = "Готовим карту...";
  }

  getDialogController().sync(saveScreen.layer, true, {
    initialFocus: "[data-action='close-save-screen']",
  });
}

function resetSaveScreenContent(saveScreen) {
  if (saveScreen.objectUrl) {
    URL.revokeObjectURL(saveScreen.objectUrl);
  }

  if (saveScreen.panel) {
    delete saveScreen.panel.dataset.objectUrl;
  }

  if (saveScreen.link) {
    saveScreen.link.href = "#";
    saveScreen.link.setAttribute("aria-disabled", "true");
    saveScreen.link.removeAttribute("download");
  }

  if (saveScreen.image) {
    saveScreen.image.hidden = true;
    saveScreen.image.removeAttribute("src");
  }

  if (saveScreen.loading) {
    saveScreen.loading.hidden = false;
  }
}

function showSaveScreenImage(blob, _fileName, saveScreen) {
  if (!saveScreen.panel || !saveScreen.image || !saveScreen.link) {
    showSaveScreenError(saveScreen, "Не удалось открыть экран сохранения.");
    return Promise.resolve();
  }

  const url = URL.createObjectURL(blob);
  const previousUrl = saveScreen.panel.dataset.objectUrl;
  if (previousUrl) {
    URL.revokeObjectURL(previousUrl);
  }

  saveScreen.panel.dataset.objectUrl = url;
  if (saveScreen.copy) {
    saveScreen.copy.textContent = "Карта готова.";
  }
  if (saveScreen.loading) {
    saveScreen.loading.hidden = true;
  }
  saveScreen.image.src = url;
  saveScreen.image.hidden = false;
  saveScreen.link.href = url;
  saveScreen.link.removeAttribute("download");
  saveScreen.link.removeAttribute("aria-disabled");
  return Promise.resolve();
}

function showSaveScreenError(saveScreen, message = "Не удалось подготовить карту. Попробуй ещё раз.") {
  if (saveScreen.copy) {
    saveScreen.copy.textContent = message;
  }
  if (saveScreen.loading) {
    saveScreen.loading.hidden = true;
  }
}

export function generateStoryReadyPng(reading) {
  if (!reading) {
    return Promise.reject(new Error("story render reading unavailable"));
  }

  return prepareShareAssets(reading).then(function renderFromAssets(assets) {
    const palette = readPalette();
    const typography = readTypography();
    const cardCanvas = document.createElement("canvas");
    const storyCanvas = document.createElement("canvas");
    const cardContext = cardCanvas.getContext("2d");
    const storyContext = storyCanvas.getContext("2d");

    cardCanvas.width = SHARE_WIDTH;
    cardCanvas.height = SHARE_HEIGHT;
    storyCanvas.width = STORY_WIDTH;
    storyCanvas.height = STORY_HEIGHT;

    if (!cardContext || !storyContext) {
      throw new Error("story canvas context unavailable");
    }

    drawShareCard(cardContext, assets, reading, palette, typography);
    drawStoryPoster(storyContext, cardCanvas, palette);
    return canvasToBlob(storyCanvas);
  });
}

export function generateShareCardPng(reading) {
  return prepareShareAssets(reading).then(function renderFromAssets(assets) {
    const palette = readPalette();
    const typography = readTypography();
    const canvas = document.createElement("canvas");
    canvas.width = SHARE_WIDTH;
    canvas.height = SHARE_HEIGHT;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("canvas context unavailable");
    }

    drawShareCard(context, assets, reading, palette, typography);
    return canvasToBlob(canvas);
  });
}

function drawShareCard(context, assets, reading, palette, typography) {
  const width = SHARE_WIDTH;
  const height = SHARE_HEIGHT;
  const artWidth = width * ARTIFACT_MEDIA_WIDTH;
  const artHeight = artWidth * (4 / 3);
  const artX = (width - artWidth) / 2;
  const artY = height * ARTIFACT_MEDIA_TOP;
  const identityBottom = height * ARTIFACT_IDENTITY_BOTTOM;
  const dateLineHeight = 54;
  const phaseLineHeight = 50;
  const metaRowGap = 14;
  const identityGap = 27;
  const titleLineHeight = 72;
  const titleMaxWidth = width * 0.76;
  const titleFontSize = fitSingleLineFontSize(context, reading.name, {
    maxWidth: titleMaxWidth,
    initialFontSize: 65,
    minFontSize: 48,
    fontFamily: typography.display,
  });
  const dateY = height - identityBottom - dateLineHeight / 2;
  const phaseY = dateY - dateLineHeight / 2 - metaRowGap - phaseLineHeight / 2;
  const titleY = phaseY - phaseLineHeight / 2 - identityGap - titleLineHeight / 2;

  context.clearRect(0, 0, width, height);
  drawArtifactBackground(context, { width, height });

  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.58)";
  context.shadowBlur = 34;
  context.shadowOffsetY = 16;
  context.fillStyle = palette.parchmentBg;
  context.fillRect(artX, artY, artWidth, artHeight);
  context.restore();

  drawContainedImage(context, assets.cardImage, {
    x: artX,
    y: artY,
    width: artWidth,
    height: artHeight,
    background: palette.parchmentBg,
  });

  context.save();
  context.strokeStyle = "rgba(225, 228, 225, 0.32)";
  context.lineWidth = 3;
  context.strokeRect(artX + 0.5, artY + 0.5, artWidth - 1, artHeight - 1);
  context.strokeStyle = "rgba(225, 228, 225, 0.06)";
  context.lineWidth = 2;
  context.strokeRect(artX + 4, artY + 4, artWidth - 8, artHeight - 8);
  context.restore();

  drawCenteredText(context, reading.name, {
    x: width / 2,
    y: titleY,
    font: `400 ${titleFontSize}px ${typography.display}`,
    color: palette.parchmentText,
    textAlign: "center",
  });

  drawMoonMetaStacked(context, reading, {
    centerX: width / 2,
    phaseY,
    dateY,
    color: palette.silverMuted,
    dateColor: palette.textQuiet,
    phaseFont: `400 42px ${typography.ui}`,
    dateFont: `italic 400 44px ${typography.reading}`,
  });

  if (assets.frameImage) {
    context.drawImage(assets.frameImage, 0, 0, width, height);
  }
}

function drawStoryPoster(context, cardCanvas, palette) {
  const width = STORY_WIDTH;
  const height = STORY_HEIGHT;
  const cardWidth = 900;
  const cardHeight = Math.round(cardWidth * (SHARE_HEIGHT / SHARE_WIDTH));
  const cardX = Math.round((width - cardWidth) / 2);
  const cardY = Math.round((height - cardHeight) / 2);

  context.clearRect(0, 0, width, height);

  const baseGradient = context.createLinearGradient(0, 0, 0, height);
  baseGradient.addColorStop(0, "#11131b");
  baseGradient.addColorStop(0.5, palette.darkBase);
  baseGradient.addColorStop(1, "#050608");
  context.fillStyle = baseGradient;
  context.fillRect(0, 0, width, height);

  const lightWell = context.createLinearGradient(0, cardY - 90, 0, cardY + cardHeight + 120);
  lightWell.addColorStop(0, "rgba(178,197,211,0)");
  lightWell.addColorStop(0.28, "rgba(178,197,211,0.035)");
  lightWell.addColorStop(0.64, "rgba(178,197,211,0.055)");
  lightWell.addColorStop(1, "rgba(178,197,211,0)");
  context.fillStyle = lightWell;
  context.fillRect(cardX - 70, cardY - 90, cardWidth + 140, cardHeight + 210);

  drawStoryCardShadow(context, {
    x: cardX,
    y: cardY,
    width: cardWidth,
    height: cardHeight,
  });

  context.drawImage(cardCanvas, cardX, cardY, cardWidth, cardHeight);
}

function drawStoryCardShadow(context, options) {
  const { x, y, width, height } = options;

  context.save();
  context.shadowColor = "rgba(0,0,0,0.72)";
  context.shadowBlur = 42;
  context.shadowOffsetY = 24;
  context.fillStyle = "rgba(0,0,0,0.72)";
  context.fillRect(x, y, width, height);
  context.restore();

  context.save();
  context.shadowColor = "rgba(178,197,211,0.14)";
  context.shadowBlur = 30;
  context.strokeStyle = "rgba(225,228,225,0.08)";
  context.lineWidth = 1;
  context.strokeRect(x - 1, y - 1, width + 2, height + 2);
  context.restore();
}

function drawArtifactBackground(context, options) {
  const { width, height } = options;
  const base = context.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0, "#11131b");
  base.addColorStop(0.58, "#08090d");
  base.addColorStop(1, "#0d0e14");
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);

  context.save();
  context.translate(width / 2, height * 0.18);
  context.scale(1, 0.76);
  const light = context.createRadialGradient(0, 0, 0, 0, 0, width * 0.52);
  light.addColorStop(0, "rgba(225,228,225,0.055)");
  light.addColorStop(1, "rgba(225,228,225,0)");
  context.fillStyle = light;
  context.fillRect(-width / 2, -height, width, height * 2);
  context.restore();
}

function prepareShareAssets(reading) {
  const fontsReady =
    document.fonts && document.fonts.ready
      ? withTimeout(document.fonts.ready, ASSET_TIMEOUT_MS, "fonts timeout").catch(function ignoreFontTimeout() {
          return undefined;
        })
      : Promise.resolve();

  return Promise.all([fontsReady, loadImage(getCardImage(reading.card)), loadFrameImage()]).then(function handleAssets(result) {
    return {
      cardImage: result[1],
      frameImage: result[2],
    };
  });
}

function loadFrameImage() {
  if (!frameImagePromise) {
    frameImagePromise = loadImage(FRAME_SRC).catch(function handleFrameError(error) {
      frameImagePromise = null;
      throw error;
    });
  }

  return frameImagePromise;
}

function loadImage(src) {
  return withTimeout(
    new Promise(function resolveImage(resolve, reject) {
      const image = new Image();
      image.decoding = "async";
      image.onload = function handleLoad() {
        if (typeof image.decode === "function") {
          image
            .decode()
            .catch(function ignoreDecodeError() {})
            .finally(function finishDecode() {
              resolve(image);
            });
          return;
        }

        resolve(image);
      };
      image.onerror = function handleError() {
        reject(new Error(`image failed to load: ${src}`));
      };
      image.src = src;
    }),
    ASSET_TIMEOUT_MS,
    "image load timeout",
  );
}

function normalizeReading(reading) {
  if (!reading || !reading.card) {
    return null;
  }

  return {
    key: reading.id || reading.card.id || "default",
    createdAt: reading.createdAt || new Date().toISOString(),
    name: String(reading.card.name || "").trim(),
    message: String(reading.card.message || "").trim(),
    shadow: String(reading.card.shadow || "").trim(),
    card: reading.card,
  };
}

function readPalette() {
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    darkBase: readCssValue(rootStyle, "--color-bg-base", "#101019"),
    darkElevated: readCssValue(rootStyle, "--color-bg-elevated", "#131320"),
    parchmentBg: "rgb(242, 235, 221)",
    parchmentText: readCssValue(rootStyle, "--parchment", "#f0e8d8"),
    silverMuted: "rgba(238, 229, 212, 0.74)",
    textQuiet: "rgba(238, 229, 212, 0.58)",
  };
}

function readTypography() {
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    display: "Forum, Georgia, serif",
    ui: readCssValue(rootStyle, "--ui-font", 'Georgia, "Times New Roman", serif'),
    reading: '"Cormorant Garamond", Georgia, serif',
  };
}

function readCssValue(style, propertyName, fallback) {
  const value = style.getPropertyValue(propertyName).trim();
  return value || fallback;
}

function drawContainedImage(context, image, rect) {
  context.fillStyle = rect.background;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);

  const scale = Math.min(rect.width / image.width, rect.height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = rect.x + (rect.width - drawWidth) / 2;
  const drawY = rect.y + (rect.height - drawHeight) / 2;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawHeroImage(context, image, rect) {
  context.fillStyle = rect.background;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);

  const scale = Math.max(rect.width / image.width, rect.height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = rect.x + (rect.width - drawWidth) / 2;
  const drawY = rect.y + (rect.height - drawHeight) * rect.positionY;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawMoonMetaStacked(context, reading, options) {
  const { centerX, phaseY, dateY, color, dateColor, phaseFont, dateFont } = options;
  const date = new Date(reading.createdAt || Date.now());
  const moon = getMoonPhase(date);
  const phaseText = capitalizeFirst(moon.name);
  const dateText = formatFullTraceDate(date);
  const iconSize = 61;
  const gap = 23;

  context.save();
  context.font = phaseFont;
  context.fillStyle = color;
  context.textAlign = "left";
  context.textBaseline = "middle";

  const textWidth = context.measureText(phaseText).width;
  const totalWidth = iconSize + gap + textWidth;
  const startX = centerX - totalWidth / 2;

  drawMoonGlyph(context, moon.type, startX + iconSize / 2, phaseY, iconSize, color);
  context.fillText(phaseText, startX + iconSize + gap, phaseY);

  context.font = dateFont;
  context.fillStyle = dateColor;
  context.fillText(dateText, startX + iconSize + gap, dateY);
  context.restore();
}

function capitalizeFirst(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function drawMoonGlyph(context, type, x, y, size, color) {
  const radius = size / 2;

  context.save();
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.clip();

  if (type === "fm") {
    context.fillStyle = color;
    context.fillRect(x - radius, y - radius, size, size);
  } else if (type === "fq" || type === "lq") {
    context.fillStyle = color;
    context.fillRect(type === "fq" ? x : x - radius, y - radius, radius, size);
  } else if (type === "wc" || type === "wac") {
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(type === "wc" ? x + radius * 0.44 : x - radius * 0.44, y, radius * 0.78, radius, 0, 0, Math.PI * 2);
    context.fill();
  } else if (type === "wg" || type === "wag") {
    context.fillStyle = color;
    context.fillRect(x - radius, y - radius, size, size);
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.ellipse(type === "wg" ? x - radius * 0.52 : x + radius * 0.52, y, radius * 0.58, radius, 0, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = "source-over";
  }

  context.restore();
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 1.4;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawPerimeterVignette(context, options) {
  const { width, height, topStrength, sideStrength, bottomStrength, cornerStrength, imageAreaHeight } = options;

  const topGradient = context.createLinearGradient(0, 0, 0, imageAreaHeight * 0.34);
  topGradient.addColorStop(0, `rgba(16,16,25,${topStrength})`);
  topGradient.addColorStop(1, "rgba(16,16,25,0)");
  context.fillStyle = topGradient;
  context.fillRect(0, 0, width, imageAreaHeight * 0.34);

  const sideWidth = width * 0.18;
  const leftGradient = context.createLinearGradient(0, 0, sideWidth, 0);
  leftGradient.addColorStop(0, `rgba(16,16,25,${sideStrength})`);
  leftGradient.addColorStop(1, "rgba(16,16,25,0)");
  context.fillStyle = leftGradient;
  context.fillRect(0, 0, sideWidth, height);

  const rightGradient = context.createLinearGradient(width - sideWidth, 0, width, 0);
  rightGradient.addColorStop(0, "rgba(16,16,25,0)");
  rightGradient.addColorStop(1, `rgba(16,16,25,${sideStrength})`);
  context.fillStyle = rightGradient;
  context.fillRect(width - sideWidth, 0, sideWidth, height);

  const bottomGradient = context.createLinearGradient(0, height * 0.72, 0, height);
  bottomGradient.addColorStop(0, "rgba(16,16,25,0)");
  bottomGradient.addColorStop(1, `rgba(16,16,25,${bottomStrength})`);
  context.fillStyle = bottomGradient;
  context.fillRect(0, height * 0.72, width, height * 0.28);

  const cornerRadius = Math.max(width, height) * 0.28;
  [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ].forEach(function drawCorner(entry) {
    const [x, y] = entry;
    const corner = context.createRadialGradient(x, y, 0, x, y, cornerRadius);
    corner.addColorStop(0, `rgba(16,16,25,${cornerStrength})`);
    corner.addColorStop(1, "rgba(16,16,25,0)");
    context.fillStyle = corner;
    context.fillRect(
      x === 0 ? 0 : width - cornerRadius,
      y === 0 ? 0 : height - cornerRadius,
      cornerRadius,
      cornerRadius,
    );
  });
}

function drawDivider(context, options) {
  const { centerX, y, color, width } = options;
  const gap = 36;
  const halfLine = (width - gap) / 2;

  context.save();
  context.strokeStyle = color;
  context.globalAlpha = 0.45;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(centerX - gap / 2 - halfLine, y);
  context.lineTo(centerX - gap / 2, y);
  context.moveTo(centerX + gap / 2, y);
  context.lineTo(centerX + gap / 2 + halfLine, y);
  context.stroke();
  context.restore();

  drawCenteredText(context, "✦", {
    x: centerX,
    y: y - 2,
    font: `400 26px ${readTypography().ui}`,
    color,
    textAlign: "center",
  });
}

function drawLabel(context, text, options) {
  const { x, y, font, color, tracking = 0, alpha = 0.82 } = options;
  context.save();
  context.font = font;
  context.fillStyle = color;
  context.globalAlpha = alpha;
  context.textAlign = "center";
  context.textBaseline = "middle";
  drawTrackedText(context, text, x, y, tracking);
  context.restore();
}

function fitParagraph(text, options) {
  const { maxWidth, maxHeight, initialFontSize, minFontSize, lineHeightRatio, fontFamily, italic = false } = options;
  const measureCanvas = document.createElement("canvas");
  const measureContext = measureCanvas.getContext("2d");

  if (!measureContext) {
    return {
      fontSize: minFontSize,
      lineHeight: Math.round(minFontSize * lineHeightRatio),
    };
  }

  for (let fontSize = initialFontSize; fontSize >= minFontSize; fontSize -= 2) {
    const font = `${italic ? "italic " : ""}400 ${fontSize}px ${fontFamily}`;
    measureContext.font = font;
    const lines = wrapText(measureContext, text, maxWidth);
    const lineHeight = Math.round(fontSize * lineHeightRatio);
    const totalHeight = lines.length * lineHeight;
    if (totalHeight <= maxHeight) {
      return {
        fontSize,
        lineHeight,
      };
    }
  }

  return {
    fontSize: minFontSize,
    lineHeight: Math.round(minFontSize * lineHeightRatio),
  };
}

function fitSingleLineFontSize(context, text, options) {
  const { maxWidth, initialFontSize, minFontSize, fontFamily } = options;

  for (let fontSize = initialFontSize; fontSize >= minFontSize; fontSize -= 1) {
    context.font = `400 ${fontSize}px ${fontFamily}`;
    if (context.measureText(text).width <= maxWidth) {
      return fontSize;
    }
  }

  return minFontSize;
}

function drawParagraph(context, text, options) {
  const {
    x,
    y,
    maxWidth,
    fontSize,
    lineHeight,
    fontFamily,
    color,
    italic = false,
    textAlign = "left",
    baseline = "alphabetic",
  } = options;

  context.save();
  context.font = `${italic ? "italic " : ""}400 ${fontSize}px ${fontFamily}`;
  context.fillStyle = color;
  context.textAlign = textAlign;
  context.textBaseline = baseline;

  const lines = wrapText(context, text, maxWidth);
  lines.forEach(function drawLine(line, index) {
    context.fillText(line, x, y + index * lineHeight);
  });
  context.restore();
}

function drawCenteredText(context, text, options) {
  const { x, y, font, color, maxWidth, lineHeight = 1, textAlign = "center" } = options;
  context.save();
  context.font = font;
  context.fillStyle = color;
  context.textAlign = textAlign;
  context.textBaseline = "middle";

  if (maxWidth) {
    const lines = wrapText(context, text, maxWidth);
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach(function drawLine(line, index) {
      context.fillText(line, x, startY + index * lineHeight);
    });
  } else {
    context.fillText(text, x, y);
  }

  context.restore();
}

function drawTrackedText(context, text, x, y, tracking) {
  if (!tracking) {
    context.fillText(text, x, y);
    return;
  }

  const glyphs = Array.from(text);
  const totalWidth = measureTrackedTextWidth(context, text, tracking);
  let cursorX = x - totalWidth / 2;

  glyphs.forEach(function drawGlyph(glyph) {
    context.fillText(glyph, cursorX, y);
    cursorX += context.measureText(glyph).width + tracking;
  });
}

function drawTrackedTextFromLeft(context, text, x, y, tracking) {
  if (!tracking) {
    context.fillText(text, x, y);
    return;
  }

  let cursorX = x;
  Array.from(text).forEach(function drawGlyph(glyph) {
    context.fillText(glyph, cursorX, y);
    cursorX += context.measureText(glyph).width + tracking;
  });
}

function measureTrackedTextWidth(context, text, tracking) {
  const glyphs = Array.from(text);
  return (
    glyphs.reduce(function sumWidth(total, glyph) {
      return total + context.measureText(glyph).width;
    }, 0) + tracking * Math.max(glyphs.length - 1, 0)
  );
}

function wrapText(context, text, maxWidth) {
  const lines = [];
  const paragraphs = String(text || "").split(/\n+/).filter(Boolean);

  paragraphs.forEach(function wrapParagraph(paragraph, paragraphIndex) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";

    words.forEach(function appendWord(word) {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width <= maxWidth || !line) {
        line = candidate;
        return;
      }

      lines.push(line);
      line = word;
    });

    if (line) {
      lines.push(line);
    }

    if (paragraphIndex < paragraphs.length - 1) {
      lines.push("");
    }
  });

  return lines.length ? lines : [""];
}

function clipRoundedRect(context, x, y, width, height, radius) {
  drawRoundedRectPath(context, x, y, width, height, radius);
  context.clip();
}

function drawRoundedRectPath(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function canvasToBlob(canvas) {
  return new Promise(function resolveBlob(resolve, reject) {
    let didFinish = false;
    const timeoutId = window.setTimeout(function handleCanvasBlobTimeout() {
      if (didFinish) {
        return;
      }

      try {
        didFinish = true;
        resolve(dataUrlToBlob(canvas.toDataURL("image/png")));
      } catch (error) {
        reject(error);
      }
    }, ASSET_TIMEOUT_MS);

    canvas.toBlob(function handleBlob(blob) {
      if (didFinish) {
        return;
      }

      didFinish = true;
      window.clearTimeout(timeoutId);
      if (!blob) {
        try {
          resolve(dataUrlToBlob(canvas.toDataURL("image/png")));
        } catch (error) {
          reject(error);
        }
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(",");
  const meta = parts[0] || "";
  const data = parts[1] || "";
  const mimeMatch = meta.match(/^data:([^;]+);base64$/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

function shareBlob(blob, reading) {
  const file = new File([blob], buildShareFileName(reading), { type: "image/png" });
  const fileName = buildShareFileName(reading);

  if (canNativeShareFile(file)) {
    return navigator.share({ files: [file] }).then(function finishNativeShare() {
      return "native";
    });
  }

  downloadBlob(blob, fileName);
  return Promise.resolve("download");
}

function buildShareFileName(reading, variant = "card") {
  const cardName = String(reading?.card?.name || reading?.name || "").trim();
  const suffix = cardName
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  const prefix = variant === "story" ? "wyrd-story" : "wyrd-card";
  return suffix ? `${prefix}-${suffix}.png` : `${prefix}.png`;
}

function canNativeShareFile(file) {
  if (!navigator.share) {
    return false;
  }

  if (typeof navigator.canShare !== "function") {
    return false;
  }

  try {
    return navigator.canShare({ files: [file] });
  } catch (_error) {
    return false;
  }
}

function setShareButtonState({ button, buttonLabel, feedback, isLoading, message }) {
  if (button) {
    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
    if (!isLoading) {
      delete button.dataset.shareMode;
    }
  }

  if (buttonLabel) {
    buttonLabel.textContent = isLoading ? "Подготавливаем…" : "Поделиться картой";
  }

  if (feedback) {
    feedback.hidden = !message;
    feedback.textContent = message;
  }
}

function clearShareFeedback(feedback) {
  if (feedback) {
    feedback.hidden = true;
    feedback.textContent = "";
  }
}

function setSaveButtonState({ button, buttonLabel, isLoading }) {
  if (button) {
    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
  }

  if (buttonLabel) {
    buttonLabel.textContent = isLoading ? "ГОТОВИМ..." : "СОХРАНИТЬ";
  }
}

function setShareButtonDisabled(button, isDisabled) {
  if (button) {
    button.disabled = isDisabled;
    button.classList.toggle("is-peer-loading", isDisabled);
  }
}

function setSaveButtonDisabled(button, isDisabled) {
  if (button) {
    button.disabled = isDisabled;
    button.classList.toggle("is-peer-loading", isDisabled);
  }
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(function revokeDownloadUrl() {
    URL.revokeObjectURL(url);
  }, 4000);
}

function withTimeout(promise, timeoutMs, message) {
  return new Promise(function resolveWithTimeout(resolve, reject) {
    const timeoutId = window.setTimeout(function handleTimeout() {
      reject(new Error(message));
    }, timeoutMs);

    promise
      .then(function handleResolve(value) {
        window.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch(function handleReject(error) {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function isAbortError(error) {
  if (!error) {
    return false;
  }

  return error.name === "AbortError";
}
