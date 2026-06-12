#!/bin/sh
# Supervise the Express API (restart on crash) and run nginx in the
# foreground as the container's main process.
set -e
mkdir -p /run/nginx

(
  cd /srv/backend
  while true; do
    node server.js
    echo "[start] backend exited — restarting in 2s" >&2
    sleep 2
  done
) &
API_PID=$!

trap 'kill "$API_PID" 2>/dev/null; nginx -s quit 2>/dev/null' TERM INT

exec nginx -g 'daemon off;'
