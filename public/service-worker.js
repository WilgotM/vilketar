self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("caches" in self) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(
        () =>
          new Response(offlineHtml, {
            headers: {
              "Cache-Control": "no-store",
              "Content-Type": "text/html; charset=utf-8",
            },
            status: 503,
          }),
      ),
    );
    return;
  }

  event.respondWith(fetch(event.request));
});

const offlineHtml = `<!doctype html>
<html lang="sv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#f7efe3" />
    <title>VilketÅr är offline</title>
    <style>
      :root { color-scheme: light dark; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { align-items: center; background: linear-gradient(180deg, #fffdfa, #f5f5f0); color: #1c1917; display: flex; margin: 0; min-height: 100dvh; padding: 2rem; }
      main { margin: 0 auto; max-width: 24rem; text-align: center; }
      .icon { align-items: center; background: #fffdfa; border: 1px solid rgba(120, 113, 108, 0.18); border-radius: 1.125rem; box-shadow: 0 8px 32px rgba(120, 113, 108, 0.16); color: #d97706; display: inline-flex; height: 4rem; justify-content: center; margin-bottom: 1.25rem; width: 4rem; }
      h1 { font-size: 1.875rem; line-height: 1.1; margin: 0 0 0.75rem; }
      p { color: #78716c; font-size: 1rem; line-height: 1.5; margin: 0 0 1.25rem; }
      button { appearance: none; background: #1c1917; border: 0; border-radius: 0.875rem; color: #fffdfa; cursor: pointer; font: inherit; font-weight: 700; min-height: 3.25rem; padding: 0 1.25rem; }
      @media (prefers-color-scheme: dark) {
        body { background: linear-gradient(180deg, #0c0a09, #171412); color: #fffdfa; }
        .icon { background: #231f1c; border-color: rgba(250, 250, 245, 0.12); color: #fbbf24; }
        p { color: #a8a29e; }
        button { background: #fffdfa; color: #0c0a09; }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="icon" aria-hidden="true">
        <svg height="40" viewBox="0 0 32 32" width="40">
          <circle cx="16" cy="16" fill="currentColor" opacity="0.18" r="15" />
          <circle cx="16" cy="16" fill="currentColor" r="12" />
          <text dominant-baseline="middle" fill="white" font-family="Georgia, serif" font-size="19" font-weight="900" text-anchor="middle" x="16.5" y="17">?</text>
        </svg>
      </div>
      <h1>Du är offline</h1>
      <p>VilketÅr hämtar färska filer från nätet för att du alltid ska få senaste versionen. Anslut igen och försök på nytt.</p>
      <button onclick="window.location.reload()">Försök igen</button>
    </main>
  </body>
</html>`;
