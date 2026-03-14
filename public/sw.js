// LenovoCompare CH — Service Worker
// Cache-first for static assets + visited pages, network-first for navigation

const APP_VERSION = "0.2.0";
const CACHE_NAME = `lenovocompare-v${APP_VERSION}`;
const OFFLINE_PAGE = "/offline.html";

// Static assets to pre-cache on install
const PRECACHE_URLS = [OFFLINE_PAGE, "/favicon.svg", "/manifest.json"];

// Patterns that should use cache-first strategy
const CACHEABLE_EXTENSIONS = /\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|webp|avif|ico|json)$/;

// Patterns to never cache
const NEVER_CACHE = [
  /\/api\//,
  /workers\.dev/,
  /cloudflare/,
  /chrome-extension/,
  /^https?:\/\/(?!lenovocompare\.ch|localhost)/,
];

/**
 * Determine if a request should be cached
 */
const shouldCache = (request) => {
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return false;

  // Skip never-cache patterns
  if (NEVER_CACHE.some((pattern) => pattern.test(url.href))) return false;

  return true;
};

/**
 * Determine if a request is for a static asset
 */
const isStaticAsset = (url) => CACHEABLE_EXTENSIONS.test(url.pathname);

/**
 * Determine if a request is for an HTML page
 */
const isPageRequest = (request) => request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");

// ----- Lifecycle Events -----

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key.startsWith("lenovocompare-") && key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ----- Fetch Strategy -----

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (!shouldCache(request)) return;

  const url = new URL(request.url);

  if (isStaticAsset(url)) {
    // Cache-first for static assets
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          }),
      ),
    );
    return;
  }

  if (isPageRequest(request)) {
    // Network-first for HTML pages, cache on success, offline fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_PAGE))),
    );
    return;
  }
});
