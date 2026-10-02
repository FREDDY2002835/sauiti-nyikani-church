// Service worker for the Sauti Nyikani management app.
//
// It makes the app installable and shows a friendly message when the phone or
// computer is offline. It deliberately caches NOTHING: member, tithe and
// finance data always comes live from the server, so nobody ever sees stale
// or leftover private records.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

const offlinePage = () =>
  new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Offline</title>
    <style>
      body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
             background:#081B33; color:#fff; font-family:system-ui,sans-serif; text-align:center; padding:24px; }
      h1 { font-size:1.4rem; margin:0 0 8px; }
      p { color:#94a3b8; margin:0 0 20px; }
      button { background:#1d5cff; color:#fff; border:0; border-radius:12px; padding:12px 24px; font-size:1rem; }
    </style>
  </head>
  <body>
    <div>
      <h1>You are offline</h1>
      <p>Connect to the internet to use the management app.</p>
      <button onclick="location.reload()">Try again</button>
    </div>
  </body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle page navigations inside /admin on our own site.
  // API calls (to Render) and all other files go straight to the network.
  if (request.mode !== "navigate") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith("/admin")) return;

  event.respondWith(fetch(request).catch(() => offlinePage()));
});
