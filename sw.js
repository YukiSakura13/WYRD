const CACHE_NAME = "wyrd-static-v43";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/images/cover.webp",
  "./assets/js/audio.js",
  "./assets/js/cards/card-meta.js",
  "./assets/js/cards/layer-map.js",
  "./assets/js/cards/meaning-engine.js",
  "./assets/js/cards/oracle-local.js",
  "./assets/js/cards/reading.js",
  "./assets/js/cards/oracle-config.js",
  "./assets/js/cards/oracle-prompt.js",
  "./assets/js/cards/spreads-config.js",
  "./assets/js/data/cards.js",
  "./assets/js/main.js",
  "./assets/js/pwa.js",
  "./assets/js/ritual.js",
  "./assets/js/state/storage.js",
  "./assets/js/ui/actions.js",
  "./assets/js/ui/render.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isCriticalAsset =
    event.request.mode === "navigate" ||
    ["style", "script", "manifest"].includes(event.request.destination);

  if (isSameOrigin && isCriticalAsset) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    if (request.mode === "navigate") {
      return caches.match("./index.html");
    }

    throw error;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}
