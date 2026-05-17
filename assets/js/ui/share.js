import { getCardImage } from "./render-helpers.js";

let isSharing = false;
let cachedShareKey = null;
let cachedShareBlobPromise = null;
let frameImagePromise = null;

const SHARE_WIDTH = 1024;
const SHARE_HEIGHT = 1536;
const CANVAS_TIMEOUT_MS = 8000;
const ASSET_TIMEOUT_MS = 3500;
const DEFAULT_RESULT_ILLUSTRATION_FADE_HEIGHT = 0.42;
const FRAME_SRC = new URL("../../images/card-frame-dark-hero.png", import.meta.url).href;

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
  cachedShareBlobPromise = withTimeout(renderShareBlob(normalizedReading), CANVAS_TIMEOUT_MS, "share render timeout").catch(
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
  const reading = store?.getState?.().currentReading || null;

  if (!button || isSharing) {
    return;
  }

  setShareState({
    button,
    buttonLabel,
    feedback,
    isLoading: true,
    message: "",
  });

  primeShareCard(reading)
    .then(function handlePrimedBlob(blob) {
      if (!blob) {
        throw new Error("share blob unavailable");
      }

      return shareBlob(blob, reading);
    })
    .then(function handleShareSuccess(result) {
      setShareState({
        button,
        buttonLabel,
        feedback,
        isLoading: false,
        message: "",
      });

      if (result === "download") {
        button.dataset.shareMode = "download";
      } else {
        delete button.dataset.shareMode;
      }
    })
    .catch(function handleShareError(error) {
      if (isAbortError(error)) {
        setShareState({
          button,
          buttonLabel,
          feedback,
          isLoading: false,
          message: "",
        });
        return;
      }

      console.error("share error:", error);
      setShareState({
        button,
        buttonLabel,
        feedback,
        isLoading: false,
        message: "Не удалось подготовить изображение. Попробуй ещё раз.",
      });
    });
}

function renderShareBlob(reading) {
  return prepareShareAssets(reading).then(function renderFromAssets(assets) {
    const palette = readPalette();
    const typography = readTypography();
    const fadeRatio = readIllustrationFadeRatio();
    const canvas = document.createElement("canvas");
    canvas.width = SHARE_WIDTH;
    canvas.height = SHARE_HEIGHT;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("canvas context unavailable");
    }

    drawShareCard(context, assets, reading, palette, typography, fadeRatio);
    return canvasToBlob(canvas);
  });
}

function drawShareCard(context, assets, reading, palette, typography, fadeRatio) {
  const width = SHARE_WIDTH;
  const height = SHARE_HEIGHT;
  const radius = 38;
  const imageAreaHeight = Math.round(height * 0.53);
  const logoZoneHeight = 88;
  const fadeHeight = Math.round(imageAreaHeight * fadeRatio);
  const fadeStartY = imageAreaHeight - fadeHeight;
  const titleY = 838;
  const dividerY = 902;
  const messageLabelY = 966;
  const shadowLabelY = 1218;

  context.clearRect(0, 0, width, height);
  context.save();
  clipRoundedRect(context, 0, 0, width, height, radius);

  context.fillStyle = palette.darkBase;
  context.fillRect(0, 0, width, height);

  context.fillStyle = palette.darkBase;
  context.fillRect(0, 0, width, imageAreaHeight);
  drawHeroImage(context, assets.cardImage, {
    x: 24,
    y: logoZoneHeight,
    width: width - 48,
    height: imageAreaHeight - logoZoneHeight,
    background: palette.darkBase,
    positionY: 0,
  });

  const fadeStartRatio = Math.max(0, Math.min(0.8, fadeStartY / imageAreaHeight));
  const verticalFade = context.createLinearGradient(0, 0, 0, imageAreaHeight);
  verticalFade.addColorStop(0, "rgba(16,16,25,0)");
  verticalFade.addColorStop(0.42, "rgba(16,16,25,0)");
  verticalFade.addColorStop(fadeStartRatio, "rgba(16,16,25,0)");
  verticalFade.addColorStop(Math.min(0.96, fadeStartRatio + 0.2), "rgba(16,16,25,0.08)");
  verticalFade.addColorStop(Math.min(0.98, fadeStartRatio + 0.38), "rgba(16,16,25,0.34)");
  verticalFade.addColorStop(Math.min(0.995, fadeStartRatio + 0.55), "rgba(16,16,25,0.82)");
  verticalFade.addColorStop(1, "rgba(16,16,25,1)");
  context.fillStyle = verticalFade;
  context.fillRect(0, 0, width, imageAreaHeight);

  const lowerSurface = context.createLinearGradient(0, imageAreaHeight - 24, 0, height);
  lowerSurface.addColorStop(0, palette.darkBase);
  lowerSurface.addColorStop(0.22, palette.darkElevated);
  lowerSurface.addColorStop(1, palette.darkBase);
  context.fillStyle = lowerSurface;
  context.fillRect(0, imageAreaHeight - 24, width, height - (imageAreaHeight - 24));

  drawPerimeterVignette(context, {
    width,
    height,
    topStrength: 0.12,
    sideStrength: 0.14,
    bottomStrength: 0.3,
    cornerStrength: 0.22,
    imageAreaHeight,
  });

  drawCenteredText(context, reading.name, {
    x: width / 2,
    y: titleY,
    font: `400 52px ${typography.display}`,
    color: palette.parchmentText,
    maxWidth: width - 180,
    lineHeight: 62,
    textAlign: "center",
  });

  drawDivider(context, {
    centerX: width / 2,
    y: dividerY,
    color: palette.gold,
    width: 300,
  });

  drawLabel(context, "ПОСЛАНИЕ", {
    x: width / 2,
    y: messageLabelY,
    font: `600 28px ${typography.ui}`,
    color: palette.gold,
    tracking: 10,
  });

  const messageMetrics = fitParagraph(reading.message, {
    maxWidth: width - 220,
    maxHeight: 178,
    initialFontSize: 42,
    minFontSize: 31,
    lineHeightRatio: 1.45,
    fontFamily: typography.display,
  });
  drawParagraph(context, reading.message, {
    x: width / 2,
    y: 1024,
    maxWidth: width - 220,
    fontSize: messageMetrics.fontSize,
    lineHeight: messageMetrics.lineHeight,
    fontFamily: typography.display,
    color: palette.parchmentText,
    textAlign: "center",
    baseline: "top",
  });

  drawLabel(context, "ТЕНЬ", {
    x: width / 2,
    y: shadowLabelY,
    font: `600 24px ${typography.ui}`,
    color: palette.gold,
    tracking: 8,
    alpha: 0.72,
  });

  const shadowMetrics = fitParagraph(reading.shadow, {
    maxWidth: width - 240,
    maxHeight: 128,
    initialFontSize: 32,
    minFontSize: 24,
    lineHeightRatio: 1.48,
    fontFamily: typography.display,
    italic: true,
  });
  drawParagraph(context, reading.shadow, {
    x: width / 2,
    y: 1262,
    maxWidth: width - 240,
    fontSize: shadowMetrics.fontSize,
    lineHeight: shadowMetrics.lineHeight,
    fontFamily: typography.display,
    color: palette.parchmentMuted,
    italic: true,
    textAlign: "center",
    baseline: "top",
  });

  if (assets.frameImage) {
    context.drawImage(assets.frameImage, 0, 0, width, height);
  }

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

function readIllustrationFadeRatio() {
  const shareCard = document.getElementById("share-card");
  if (!shareCard) {
    return DEFAULT_RESULT_ILLUSTRATION_FADE_HEIGHT;
  }

  const style = getComputedStyle(shareCard);
  const rawValue = style.getPropertyValue("--result-illustration-fade-height").trim();
  if (!rawValue) {
    return DEFAULT_RESULT_ILLUSTRATION_FADE_HEIGHT;
  }

  if (rawValue.endsWith("%")) {
    const numericValue = Number.parseFloat(rawValue.slice(0, -1));
    if (Number.isFinite(numericValue) && numericValue > 0) {
      return Math.max(0.1, Math.min(0.9, numericValue / 100));
    }
  }

  const ratio = Number.parseFloat(rawValue);
  if (Number.isFinite(ratio) && ratio > 0) {
    return Math.max(0.1, Math.min(0.9, ratio));
  }

  return DEFAULT_RESULT_ILLUSTRATION_FADE_HEIGHT;
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
    parchmentMuted: "rgba(240, 232, 216, 0.74)",
    gold: readCssValue(rootStyle, "--gold", "#c9a14a"),
    goldSoft: "rgba(201, 161, 74, 0.42)",
  };
}

function readTypography() {
  const rootStyle = getComputedStyle(document.documentElement);
  return {
    display: readCssValue(rootStyle, "--display-font", 'Georgia, "Times New Roman", serif'),
    ui: readCssValue(rootStyle, "--ui-font", 'Georgia, "Times New Roman", serif'),
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
  const totalWidth =
    glyphs.reduce(function sumWidth(total, glyph) {
      return total + context.measureText(glyph).width;
    }, 0) +
    tracking * Math.max(glyphs.length - 1, 0);
  let cursorX = x - totalWidth / 2;

  glyphs.forEach(function drawGlyph(glyph) {
    context.fillText(glyph, cursorX, y);
    cursorX += context.measureText(glyph).width + tracking;
  });
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
  context.clip();
}

function canvasToBlob(canvas) {
  return new Promise(function resolveBlob(resolve, reject) {
    canvas.toBlob(function handleBlob(blob) {
      if (!blob) {
        reject(new Error("canvas.toBlob returned null"));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

function shareBlob(blob, reading) {
  const shareTitle = buildShareTitle(reading);
  const shareText = buildShareText(reading);
  const file = new File([blob], buildShareFileName(reading), { type: "image/png" });
  const sharePayload = {
    title: shareTitle,
    text: shareText,
    files: [file],
  };

  if (canNativeShareFile(file)) {
    setShareState({
      button: document.querySelector('#result [data-action="share-card"]'),
      buttonLabel: document.getElementById("share-button-label"),
      feedback: document.getElementById("share-feedback"),
      isLoading: false,
      message: "",
    });

    return navigator.share(sharePayload).then(function finishNativeShare() {
      return "native";
    });
  }

  if (navigator.share) {
    setShareState({
      button: document.querySelector('#result [data-action="share-card"]'),
      buttonLabel: document.getElementById("share-button-label"),
      feedback: document.getElementById("share-feedback"),
      isLoading: false,
      message: "",
    });

    return navigator
      .share(sharePayload)
      .then(function finishNativeShareWithoutCanShare() {
        return "native";
      })
      .catch(function fallbackAfterShareError(error) {
        if (isAbortError(error)) {
          throw error;
        }

        downloadBlob(blob, buildShareFileName(reading));
        return "download";
      });
  }

  downloadBlob(blob, buildShareFileName(reading));
  return Promise.resolve("download");
}

function buildShareTitle(reading) {
  const cardName = String(reading?.card?.name || reading?.name || "").trim();
  return cardName ? `WYRD — ${cardName}` : "WYRD — Оракул духов леса";
}

function buildShareText(reading) {
  const message = String(reading?.card?.message || reading?.message || "").trim();
  return message ? `Послание карты: ${message}` : "Карта из оракула духов леса.";
}

function buildShareFileName(reading) {
  const cardName = String(reading?.card?.name || reading?.name || "").trim();
  const suffix = cardName
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return suffix ? `wyrd-card-${suffix}.png` : "wyrd-card.png";
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

function setShareState({ button, buttonLabel, feedback, isLoading, message }) {
  isSharing = isLoading;

  if (button) {
    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
    if (!isLoading) {
      delete button.dataset.shareMode;
    }
  }

  if (buttonLabel) {
    buttonLabel.textContent = isLoading ? "ПОДГОТАВЛИВАЕМ КАРТУ..." : "ПОДЕЛИТЬСЯ КАРТОЙ";
  }

  if (feedback) {
    feedback.hidden = !message;
    feedback.textContent = message;
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
  URL.revokeObjectURL(url);
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
