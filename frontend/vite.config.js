import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // We register the SW ourselves in main.jsx (bundled, same-origin) so no
      // inline <script> is injected — keeps the strict CSP (`script-src 'self'`) intact.
      injectRegister: false,
      includeAssets: ["favicon.svg", "icon-180.png"],
      manifest: {
        name: "NUX — Cinema for Curious Minds",
        short_name: "NUX",
        description:
          "An editorial streaming home for British cinema — curation, not an infinite wall.",
        id: "/",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0d0c0b",
        theme_color: "#0d0c0b",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Precache only the app shell (small); posters/stills are cached at runtime.
        globPatterns: ["**/*.{js,css,html,svg,woff2,ico}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // HTML documents — always try network, fall back to cache offline.
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: { cacheName: "html", networkTimeoutSeconds: 3 },
          },
          // Public displayed data only — instant from cache, refresh in background.
          // NOTE: /api/list + /api/history are auth-scoped + per-user — deliberately
          // NOT cached (network-only) so a shared device never serves one user's
          // My List / watch history to the next from the SW cache.
          {
            urlPattern: /^\/api\/collections/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "api-data" },
          },
          // Poster / still imagery — cache on first view.
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/assets/"),
            handler: "CacheFirst",
            options: {
              cacheName: "media",
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // auth, curator, and any POST/PUT/DELETE are intentionally network-only
          // (not matched here) so writes and private data are never served stale.
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
