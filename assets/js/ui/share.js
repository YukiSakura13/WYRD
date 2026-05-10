let html2CanvasLoader = null;
let isSharing = false;

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

      return renderShareCard(shareCard, store);
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
      const reading = store.getState().currentReading;
      const fileName = buildShareFileName(reading?.card?.name);
      const file = new File([blob], fileName, { type: "image/png" });

      if (canNativeShareFile(file)) {
        return navigator.share({
          files: [file],
          title: reading?.card?.name || "WYRD",
        }).then(function finishNativeShare() {
          return "native";
        });
      }

      downloadBlob(blob, fileName);
      return "download";
    });
  });
}

function ensureHtml2Canvas() {
  if (typeof window.html2canvas === "function") {
    return Promise.resolve(window.html2canvas);
  }

  if (html2CanvasLoader) {
    return html2CanvasLoader;
  }

  html2CanvasLoader = new Promise(function loadHtml2Canvas(resolve, reject) {
    const existingScript = document.querySelector('script[data-html2canvas-loader="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", function handleLoad() {
        resolve(window.html2canvas);
      });
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
    script.async = true;
    script.dataset.html2canvasLoader = "true";
    script.onload = function handleLoad() {
      resolve(window.html2canvas);
    };
    script.onerror = reject;
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

function buildShareFileName(cardName = "") {
  const normalized = cardName
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return normalized ? `wyrd-${normalized}.png` : "wyrd-card.png";
}

function isAbortError(error) {
  if (!error) {
    return false;
  }

  return error.name === "AbortError";
}
