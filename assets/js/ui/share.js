export function shareCurrentCard(store) {
  const shareCard = document.querySelector(".share-card");
  if (!shareCard) {
    return;
  }

  ensureHtml2Canvas()
    .then(function shareAfterLoad() {
      if (typeof window.html2canvas !== "function") {
        shareReadingText(store.getState().currentReading);
        return;
      }

      renderShareCard(shareCard, store);
    })
    .catch(function handleLoaderError() {
      shareReadingText(store.getState().currentReading);
    });
}

function renderShareCard(shareCard, store) {
  if (typeof window.html2canvas !== "function") {
    shareReadingText(store.getState().currentReading);
    return;
  }

  const button = shareCard.querySelector('[data-action="share-card"]');
  if (button) {
    button.style.display = "none";
  }

  window.html2canvas(shareCard, {
      backgroundColor: "#1a1810",
      scale: 2,
      useCORS: true,
      allowTaint: false,
      imageTimeout: 15000,
      logging: false,
    })
    .then(function handleCanvas(canvas) {
      if (button) {
        button.style.display = "";
      }

      canvas.toBlob(function handleBlob(blob) {
        if (!blob) {
          return;
        }

        const file = new File([blob], "wyrd-card.png", { type: "image/png" });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: "WYRD — оракул духов леса",
          }).catch(function () {});
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "wyrd-card.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    })
    .catch(function handleShareError(error) {
      console.error("html2canvas error:", error);
      if (button) {
        button.style.display = "";
      }
      shareReadingText(store.getState().currentReading);
    });
}

let html2CanvasLoader = null;

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

function shareReadingText(reading) {
  if (!reading || !navigator.share) {
    return;
  }

  navigator.share({
    text: `${reading.card.name}\n\n${reading.card.message}\n\nWYRD\nyukisakura13.github.io/WYRD/`,
  }).catch(function () {});
}
