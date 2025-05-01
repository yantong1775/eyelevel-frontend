// Import Workbox from CDN
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.0/workbox-sw.js"
);

// Disable debug mode in production
workbox.setConfig({
  debug: false,
});

// Define cache names
const CACHE_NAMES = {
  IMAGES: "xray-images-cache-v1",
  DATA: "xray-json-cache-v1",
};

// Development cache configuration
const CACHE_CONFIG = {
  maxEntries: 10, // Maximum number of entries per cache
  maxAgeSeconds: 24 * 60 * 60, // 24 hours in seconds
  purgeOnQuotaError: true, // Auto cleanup if storage is full
};

// Log with timestamp and formatting, for development and debugging purposes
function logWithTime(message, type = "log") {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[CACHE DEMO ${timestamp}]`;

  switch (type) {
    case "log":
      console.log(`%c${prefix} ${message}`, "color: #3498db");
      break;
    case "cache":
      console.error(`%c${prefix} ${message}`, "color: #2ecc71");
      break;
    case "expire":
      console.log(`%c${prefix} ${message}`, "color: #e74c3c");
      break;
    default:
      console.log(`%c${prefix} ${message}`);
  }
}

// FOR DEVELOPMENT PURPOSE, LOGGING CACHE UPDATES
const cacheLoggingPlugin = {
  cacheDidUpdate: async ({ cacheName, request, response }) => {
    const expiresAt = Date.now() + CACHE_CONFIG.maxAgeSeconds * 1000;
    logWithTime(
      `CACHE UPDATE: ${cacheName} - ${request.url} - Expires at: ${new Date(
        expiresAt
      ).toLocaleTimeString()}`,
      "cache"
    );
  },
  cachedResponseWillBeUsed: async ({ cacheName, request, cachedResponse }) => {
    if (cachedResponse) {
      logWithTime(`CACHE HIT: ${cacheName} - ${request.url}`, "log");
    }
    return cachedResponse;
  },
};

// Skip waiting and claim clients on activation
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(clearOldCaches());
});

// Function to clear old caches
async function clearOldCaches() {
  const cacheKeyList = await caches.keys();

  return Promise.all(cacheKeyList.map((key) => caches.delete(key)));
}

// Configure Workbox cache expiration plugins
const imageExpirationPlugin = new workbox.expiration.ExpirationPlugin({
  maxEntries: CACHE_CONFIG.maxEntries,
  maxAgeSeconds: CACHE_CONFIG.maxAgeSeconds,
  purgeOnQuotaError: CACHE_CONFIG.purgeOnQuotaError,
  matchOptions: {
    ignoreVary: true,
  },
});

const dataExpirationPlugin = new workbox.expiration.ExpirationPlugin({
  maxEntries: CACHE_CONFIG.maxEntries,
  maxAgeSeconds: CACHE_CONFIG.maxAgeSeconds,
  purgeOnQuotaError: CACHE_CONFIG.purgeOnQuotaError,
  matchOptions: {
    ignoreVary: true,
  },
});

// Register route for image proxy requests (Cache First strategy)
workbox.routing.registerRoute(
  ({ url }) => url.pathname.includes("/api/images/proxy"),
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAMES.IMAGES,
    plugins: [
      imageExpirationPlugin,
      // Handle network failures
      {
        handlerDidError: async () => {
          return new Response(null, { status: 404, statusText: "Not Found" });
        },
      },
    ],
  })
);

// Register route for XRay data GET requests
// This now handles GET requests with the xrayUrl as a query parameter
workbox.routing.registerRoute(
  ({ url }) =>
    url.pathname.includes("/api/documents/xray") &&
    url.searchParams.has("xrayUrl"),
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAMES.DATA,
    plugins: [
      dataExpirationPlugin,
      // Handle network failures
      {
        handlerDidError: async () => {
          return new Response(
            JSON.stringify({ error: "Failed to fetch XRay data" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        },
      },
    ],
  })
);
