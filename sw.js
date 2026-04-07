const CACHE_NAME = "wyrd-static-v26";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/images/cover.webp",
  "./assets/js/audio.js",
  "./assets/js/cards/card-meta.js",
  "./assets/js/cards/layer-map.js",
  "./assets/js/cards/reading.js",
  "./assets/js/cards/oracle-config.js",
  "./assets/js/data/cards.js",
  "./assets/js/main.js",
  "./assets/js/pwa.js",
  "./assets/js/ritual.js",
  "./assets/js/state/storage.js",
  "./assets/js/ui/actions.js",
  "./assets/js/ui/render.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response.ok) {
            return response;
          }
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    }),
  );
});
