export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
    return;
  }

  window.addEventListener("load", function () {
    const buildId = window.WYRD_BUILD_ID || "dev";
    navigator.serviceWorker
      .register(`./sw.js?v=${encodeURIComponent(buildId)}`, {
        updateViaCache: "none",
      })
      .catch(function () {
        return undefined;
      });
  });
}
