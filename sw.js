const BUILD_ID = new URLSearchParams(self.location.search).get("v") || "dev";
const CACHE_NAME = `wyrd-runtime-${BUILD_ID}`;
const RUNTIME_CACHEABLE_DESTINATIONS = new Set(["image", "audio", "video", "font"]);

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
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
  const destination = event.request.destination;
  const isCriticalAsset =
    event.request.mode === "navigate" ||
    ["style", "script", "manifest", "document"].includes(destination);

  if (isSameOrigin && isCriticalAsset) {
    event.respondWith(fetchFresh(event.request));
    return;
  }

  if (isSameOrigin && RUNTIME_CACHEABLE_DESTINATIONS.has(destination)) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  event.respondWith(fetch(event.request));
});

async function fetchFresh(request) {
  try {
    return await fetch(request, { cache: "no-store" });
  } catch (error) {
    const fallback = await caches.match(request, { ignoreSearch: true });
    if (fallback) {
      return fallback;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    void networkPromise;
    return cached;
  }

  const response = await networkPromise;
  if (response) {
    return response;
  }

  return fetch(request);
}
