import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Hand-written worker (src/sw.js) instead of generateSW: same caching
      // recipe, plus the push / notificationclick handlers generateSW can't emit.
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
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
        categories: ["entertainment"],
        // richer install sheet on Android/desktop Chrome + Edge
        screenshots: [
          {
            src: "/screenshots/home-wide.jpg",
            sizes: "1920x1080",
            type: "image/jpeg",
            form_factor: "wide",
            label: "Home — editorial hero and curated rails",
          },
          {
            src: "/screenshots/home-narrow.jpg",
            sizes: "390x844",
            type: "image/jpeg",
            form_factor: "narrow",
            label: "Home on mobile",
          },
        ],
        // long-press app icon jump points (Android / desktop)
        shortcuts: [
          {
            name: "My List",
            url: "/my-list",
            icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
          },
          {
            name: "Browse the catalogue",
            short_name: "Browse",
            url: "/browse",
            icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
          },
          {
            name: "Downloads",
            url: "/downloads",
            icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
          },
        ],
      },
      // Caching strategies live in src/sw.js now; only the precache manifest
      // is configured here. Precache the app shell only (small) — posters and
      // stills are cached at runtime by the worker.
      injectManifest: {
        // Root-level icon-*.png only — assets/ media must stay runtime-cached.
        globPatterns: ["**/*.{js,css,html,svg,woff2,ico}", "icon-*.png", "manifest.webmanifest"],
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
  // `vite preview` serves the built PWA (real service worker, unlike dev);
  // proxy /api the same way so push/auth/collections are testable locally.
  preview: {
    port: 4173,
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
