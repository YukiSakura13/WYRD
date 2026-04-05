export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
    return;
  }

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").catch(function () {
      return undefined;
    });
  });
}
