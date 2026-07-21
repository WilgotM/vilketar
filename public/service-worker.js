const CACHE_VERSION =
  new URL(self.location.href).searchParams.get("v") || "legacy";
const SHELL_CACHE = `vilketar-shell-${CACHE_VERSION}`;
const PAGE_CACHE = `vilketar-pages-${CACHE_VERSION}`;
const DATA_CACHE = `vilketar-data-${CACHE_VERSION}`;
const IMAGE_CACHE = `vilketar-images-${CACHE_VERSION}`;
const IMAGE_CACHE_LIMIT = 60;

const APP_SHELL = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/apple-touch-icon.png",
  "/pwa-icon-192.png",
  "/pwa-icon-512.png",
  "/pwa-maskable-icon-192.png",
  "/pwa-maskable-icon-512.png",
  "/fonts/inter-latin.woff2",
  "/fonts/fraunces-latin.woff2",
];

function canCache(response) {
  return response && (response.ok || response.type === "opaque");
}

async function saveResponse(cacheName, request, response) {
  if (!canCache(response)) {
    return;
  }

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

async function cacheAppShell() {
  const cache = await caches.open(SHELL_CACHE);

  await Promise.all(
    APP_SHELL.map(async (path) => {
      try {
        const response = await fetch(path);
        if (canCache(response)) {
          await cache.put(path, response);
        }
      } catch {
        // Individual assets can be fetched again on the next app launch.
      }
    }),
  );
}

async function trimImageCache() {
  const cache = await caches.open(IMAGE_CACHE);
  const keys = await cache.keys();
  const excess = keys.length - IMAGE_CACHE_LIMIT;

  if (excess > 0) {
    await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
  }
}

async function getNetworkFirst(request, cacheName, ignoreSearch = false) {
  try {
    const response = await fetch(request);
    await saveResponse(cacheName, request, response).catch(() => undefined);
    return response;
  } catch {
    const cachedResponse = await caches.match(request, { ignoreSearch });
    if (cachedResponse) {
      return cachedResponse;
    }

    throw new Error("Network unavailable");
  }
}

async function getCacheFirst(request, cacheName, ignoreSearch = false) {
  const cachedResponse = await caches.match(request, { ignoreSearch });
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);
  await saveResponse(cacheName, request, response).catch(() => undefined);
  return response;
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const activeCaches = new Set([
        SHELL_CACHE,
        PAGE_CACHE,
        DATA_CACHE,
        IMAGE_CACHE,
      ]);
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("vilketar-"))
          .filter((cacheName) => !activeCaches.has(cacheName))
          .map((cacheName) => caches.delete(cacheName)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      getNetworkFirst(request, PAGE_CACHE, true).catch(
        async () =>
          (await caches.match(request, { ignoreSearch: true })) ||
          (await caches.match("/")) ||
          (await caches.match("/offline.html")) ||
          new Response("VilketÅr är offline", {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            status: 503,
          }),
      ),
    );
    return;
  }

  if (
    url.origin === self.location.origin &&
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(getCacheFirst(request, SHELL_CACHE));
    return;
  }

  if (
    url.origin === self.location.origin &&
    url.pathname.startsWith("/decks/")
  ) {
    event.respondWith(getNetworkFirst(request, DATA_CACHE));
    return;
  }

  if (request.destination === "image") {
    event.respondWith(
      getCacheFirst(request, IMAGE_CACHE).then(async (response) => {
        await trimImageCache();
        return response;
      }),
    );
  }
});
