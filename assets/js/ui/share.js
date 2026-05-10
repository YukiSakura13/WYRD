let html2CanvasLoader = null;
let isSharing = false;
const HTML2CANVAS_SRC = "./assets/vendor/html2canvas.min.js";
const HTML2CANVAS_TIMEOUT_MS = 12000;
const SHARE_RENDER_TIMEOUT_MS = 8000;
const SHARE_ASSET_TIMEOUT_MS = 4000;

export function shareCurrentCard(store) {
  const shareCard = document.getElementById("share-card");
  const button = document.querySelector('#result [data-action="share-card"]');
  const buttonLabel = document.getElementById("share-button-label");
  const feedback = document.getElementById("share-feedback");

  if (!shareCard || !button || isSharing) {
    return;
  }

  setShareState({
    button,
    buttonLabel,
    feedback,
    isLoading: true,
    message: "",
  });

  ensureHtml2Canvas()
    .then(function shareAfterLoad() {
      if (typeof window.html2canvas !== "function") {
        throw new Error("html2canvas unavailable");
      }

      return withTimeout(
        prepareShareAssets(shareCard).then(function afterPrepare() {
          return renderShareCard(shareCard, store);
        }),
        SHARE_RENDER_TIMEOUT_MS,
        "share render timeout",
      );
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

function renderShareCard(shareCard, store) {
  return window.html2canvas(shareCard, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    allowTaint: false,
    imageTimeout: 15000,
    logging: false,
  }).then(function handleCanvas(canvas) {
    return canvasToBlob(canvas).then(function handleBlob(blob) {
      const file = new File([blob], "wyrd-card.png", { type: "image/png" });

      if (canNativeShareFile(file)) {
        setShareState({
          button: document.querySelector('#result [data-action="share-card"]'),
          buttonLabel: document.getElementById("share-button-label"),
          feedback: document.getElementById("share-feedback"),
          isLoading: false,
          message: "",
        });
        return navigator.share({
          files: [file],
        }).then(function finishNativeShare() {
          return "native";
        });
      }

      downloadBlob(blob, "wyrd-card.png");
      return "download";
    });
  });
}

function prepareShareAssets(shareCard) {
  const imageNodes = Array.from(shareCard.querySelectorAll("img"));
  const imagePromises = imageNodes.map(waitForImageReady);
  const fontReady =
    document.fonts && document.fonts.ready
      ? withTimeout(document.fonts.ready, SHARE_ASSET_TIMEOUT_MS, "fonts timeout").catch(function ignoreFontTimeout() {
          return undefined;
        })
      : Promise.resolve();

  return Promise.all([fontReady, ...imagePromises]);
}

function ensureHtml2Canvas() {
  if (typeof window.html2canvas === "function") {
    return Promise.resolve(window.html2canvas);
  }

  if (html2CanvasLoader) {
    return html2CanvasLoader;
  }

  html2CanvasLoader = new Promise(function loadHtml2Canvas(resolve, reject) {
    const timeoutId = window.setTimeout(function handleTimeout() {
      html2CanvasLoader = null;
      reject(new Error("html2canvas load timeout"));
    }, HTML2CANVAS_TIMEOUT_MS);

    const existingScript = document.querySelector('script[data-html2canvas-loader="true"]');
    if (existingScript) {
      if (typeof window.html2canvas === "function") {
        window.clearTimeout(timeoutId);
        resolve(window.html2canvas);
        return;
      }

      existingScript.addEventListener("load", function handleLoad() {
        window.clearTimeout(timeoutId);
        resolve(window.html2canvas);
      });
      existingScript.addEventListener("error", function handleError(event) {
        window.clearTimeout(timeoutId);
        reject(event);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = HTML2CANVAS_SRC;
    script.async = true;
    script.dataset.html2canvasLoader = "true";
    script.onload = function handleLoad() {
      window.clearTimeout(timeoutId);
      resolve(window.html2canvas);
    };
    script.onerror = function handleError(event) {
      window.clearTimeout(timeoutId);
      reject(event);
    };
    document.head.appendChild(script);
  }).catch(function resetLoader(error) {
    html2CanvasLoader = null;
    throw error;
  });

  return html2CanvasLoader;
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

function waitForImageReady(img) {
  if (img.complete && img.naturalWidth > 0) {
    if (typeof img.decode === "function") {
      return withTimeout(img.decode().catch(function ignoreDecodeError() {}), SHARE_ASSET_TIMEOUT_MS, "image decode timeout").catch(
        function ignoreTimeout() {
          return undefined;
        },
      );
    }

    return Promise.resolve();
  }

  return withTimeout(
    new Promise(function resolveOnLoad(resolve, reject) {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener(
        "error",
        function handleError() {
          reject(new Error("image failed to load"));
        },
        { once: true },
      );
    }),
    SHARE_ASSET_TIMEOUT_MS,
    "image load timeout",
  );
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
