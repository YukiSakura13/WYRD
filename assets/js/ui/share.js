export function shareCurrentCard(store) {
  const shareCard = document.querySelector(".share-card");
  if (!shareCard) {
    return;
  }

  if (typeof window.html2canvas !== "function") {
    shareReadingText(store.getState().currentReading);
    return;
  }

  const button = shareCard.querySelector('[data-action="share-card"]');
  if (button) {
    button.style.display = "none";
  }

  window
    .html2canvas(shareCard, {
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

function shareReadingText(reading) {
  if (!reading || !navigator.share) {
    return;
  }

  navigator.share({
    text: `${reading.card.name}\n\n${reading.card.message}\n\nWYRD\nyukisakura13.github.io/WYRD/`,
  }).catch(function () {});
}
