// Express 4 does not catch rejections from async route handlers, so an
// unhandled rejection would hang the request (and risk crashing the process).
// Wrap every async handler with `ah(...)` to funnel errors into next() and
// thus the global error middleware in server.js.
export const ah = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
