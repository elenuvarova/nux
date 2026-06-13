#!/bin/sh
# Run nginx + a supervised, NON-ROOT Express API in one container, with a graceful
# shutdown that drains nginx FIRST, then the API. The shell stays PID 1 so the
# TERM/INT trap actually fires (a previous `exec nginx` silently discarded it).
set -e
mkdir -p /run/nginx

# nginx in the background — master as root to bind :80; workers drop to the
# nginx user per the base image's main config.
nginx -g 'daemon off;' &

NODE_PID=""
# On stop: drain nginx (stop accepting new requests), then signal the API so its
# in-flight requests + DB pool close cleanly (server.js handles SIGTERM), then exit.
term() {
  nginx -s quit 2>/dev/null || true
  [ -n "$NODE_PID" ] && kill -TERM "$NODE_PID" 2>/dev/null || true
  wait "$NODE_PID" 2>/dev/null || true
  exit 0
}
trap term TERM INT

# Supervise the API (restart on crash), dropped to the non-root `app` user.
cd /srv/backend
while true; do
  su-exec app node server.js &
  NODE_PID=$!
  wait "$NODE_PID" || true
  echo "[start] backend exited — restarting in 2s" >&2
  sleep 2
done
