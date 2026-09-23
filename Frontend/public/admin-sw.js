const CACHE = "sauti-admin-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (!event.request.url.includes("/admin/")) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
