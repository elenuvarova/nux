/* Hand-written service worker (vite-plugin-pwa injectManifest). Reproduces the
   caching the old generateSW config emitted, then adds web push. Any strategy
   change here must keep the per-user rule below intact. */
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

// autoUpdate semantics: a new deploy takes over without a "refresh?" prompt.
// The message listener keeps parity with the old worker (workbox-window sends
// SKIP_WAITING), skipWaiting()/clientsClaim() make it unconditional.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.skipWaiting();
clientsClaim();

// App shell (small) — hashed JS/CSS, fonts, icons. Injected at build time.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// SPA navigations resolve to the precached shell; /api is never a page.
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html'), { denylist: [/^\/api\//] }));

// HTML documents — always try network, fall back to cache offline.
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({ cacheName: 'html', networkTimeoutSeconds: 3 })
);

// Public displayed data only — instant from cache, refresh in background.
// NOTE: /api/list + /api/history are auth-scoped + per-user — deliberately
// NOT cached (network-only) so a shared device never serves one user's
// My List / watch history to the next from the SW cache.
registerRoute(/^\/api\/collections/, new StaleWhileRevalidate({ cacheName: 'api-data' }));

// Poster / still imagery — cache on first view.
registerRoute(
  ({ url }) => url.pathname.startsWith('/assets/'),
  new CacheFirst({
    cacheName: 'media',
    plugins: [new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 })],
  })
);
// auth, curator, and any POST/PUT/DELETE are intentionally network-only
// (not matched above) so writes and private data are never served stale.

// ── Web push ──────────────────────────────────────────────────────
// Payload: { title, body, url } — sent by the backend's weekly collections
// broadcast (backend/lib/push.js). Malformed payloads fall back to defaults
// rather than dropping the event (a silent push risks the subscription).
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    /* non-JSON payload — show the fallback copy */
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'NUX', {
      body: data.body || 'Something new is on the shelf',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: data.url || '/' },
    })
  );
});

// Focus an open NUX tab (navigating it to the target) or open a fresh one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const client = windows.find((c) => 'focus' in c);
      if (client) {
        await client.focus();
        if ('navigate' in client) await client.navigate(url).catch(() => {});
        return;
      }
      await self.clients.openWindow(url);
    })()
  );
});
