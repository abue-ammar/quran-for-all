// Cache version - auto-updated during build
const CACHE_VERSION = "1.0.0-20251204.2254";
const CACHE_NAME = `quran-for-all-v${CACHE_VERSION}`;

const STATIC_CACHE_URLS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/logo.svg",
  "/logo.png",
  "/logo180.png",
  "/logo192.svg",
  "/logo48.svg",
  "/og.png",
  "/fonts/AmiriQuran-Regular.ttf",
  "/fonts/RobotoMono-VariableFont_wght.ttf",
];

// Install event - cache static resources
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...", CACHE_NAME);
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static resources");
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log("[SW] Skip waiting - activate immediately");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Failed to cache resources:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete caches that start with our prefix but aren't current
              return (
                cacheName.startsWith("quran-for-all-") &&
                cacheName !== CACHE_NAME
              );
            })
            .map((cacheName) => {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log("[SW] Claiming clients");
        return self.clients.claim();
      })
  );
});

// Fetch event - network first with cache fallback for API, cache first for static
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith("http")) {
    return;
  }

  const url = new URL(event.request.url);

  // For API requests (Quran data), use network-first strategy
  if (url.hostname.includes("api.") || url.pathname.includes("/api/")) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(cacheFirstStrategy(event.request));
});

// Network first strategy - try network, fallback to cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return a fallback response for failed API requests
    return new Response(JSON.stringify({ error: "Offline" }), {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Cache first strategy - try cache, fallback to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Return cached version immediately
    // Also update cache in background (stale-while-revalidate)
    fetchAndCache(request);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (
      networkResponse &&
      networkResponse.status === 200 &&
      networkResponse.type === "basic"
    ) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Network failed for:", request.url);

    // For navigation requests, serve the offline page
    if (
      request.destination === "document" ||
      request.mode === "navigate" ||
      request.url.endsWith("/") ||
      request.url.includes(".html")
    ) {
      const offlinePage = await caches.match("/offline.html");
      if (offlinePage) {
        return offlinePage;
      }
      // Fallback to cached index.html
      const indexPage = await caches.match("/index.html");
      if (indexPage) {
        return indexPage;
      }
    }

    return new Response("Offline - Resource not cached", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Fetch and update cache in background
async function fetchAndCache(request) {
  try {
    const networkResponse = await fetch(request);

    if (
      networkResponse &&
      networkResponse.status === 200 &&
      networkResponse.type === "basic"
    ) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silently fail - we already have cached version
  }
}

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Background sync for future use
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync:", event.tag);
});

// Push notifications for future use
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received");

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "New notification",
      icon: "/logo192.svg",
      badge: "/logo48.svg",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Quran for All", options)
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
