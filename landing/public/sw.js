/* Zombie-worker retirement. The NUX app (a PWA) used to live on this host, and
   browsers that installed it still run its old service worker here, serving the
   stale app shell from cache. Nothing on the landing registers this file — it
   exists only to answer that OLD worker's update check. Once fetched, it takes
   over, unregisters itself, and reloads its clients so they return uncontrolled
   and hit the network. Must stay at /sw.js (the old registration's script URL)
   and must be served with Cache-Control: no-cache (see nginx.conf). */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister()
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => Promise.all(clients.map((c) => c.navigate(c.url))))
  );
});
