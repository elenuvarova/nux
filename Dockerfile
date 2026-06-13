# NUX — full-stack single container: vite SPA served by nginx, Express API
# behind it on loopback. nginx terminates :80, proxies /api → 127.0.0.1:3001.

# 1) build the SPA
FROM node:20-alpine AS build
# Coolify injects the app's NODE_ENV=production into the build too, which
# would make npm ci skip devDependencies (vite) — force them in.
ENV NODE_ENV=development
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --include=dev
COPY frontend/ ./
RUN npm run build

# 2) runtime: node (for the API) + nginx (for the SPA)
FROM node:20-alpine
RUN apk add --no-cache nginx wget && mkdir -p /run/nginx

WORKDIR /srv/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./

# built SPA → nginx web root; nginx site config
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm -f /etc/nginx/http.d/default.conf
COPY nginx.conf /etc/nginx/http.d/nux.conf
COPY start.sh /srv/start.sh
RUN chmod +x /srv/start.sh

ENV NODE_ENV=production
ENV BACKEND_PORT=3001
EXPOSE 80

# probe the DB-aware /api/health THROUGH nginx — catches a dead ingress AND a
# crash-looping node/DB (the static nginx /health would report healthy while
# every /api 502s). start-period gives the API time to boot.
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/api/health || exit 1

CMD ["/srv/start.sh"]
