// Subscribers notified when the server rejects a request with 401 on a
// protected (non-auth) endpoint — lets AuthProvider reset the user centrally.
const unauthorizedSubs = new Set();

export function onUnauthorized(fn) {
  unauthorizedSubs.add(fn);
  return () => unauthorizedSubs.delete(fn);
}

// Thin fetch wrapper. credentials:'include' so the httpOnly session cookie
// rides along; throws an Error carrying the server's error code.
async function request(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body is fine */
  }
  if (!res.ok) {
    // 401 anywhere but /auth/* means the session lapsed — tell AuthProvider.
    // (/auth/me 401 is normal for a guest, so it's excluded.)
    if (res.status === 401 && !path.startsWith("/auth/")) {
      unauthorizedSubs.forEach((fn) => fn());
    }
    const err = new Error(data?.error || `http_${res.status}`);
    err.code = data?.error;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => request("GET", p),
  post: (p, b) => request("POST", p, b),
  put: (p, b) => request("PUT", p, b),
  patch: (p, b) => request("PATCH", p, b),
  del: (p) => request("DELETE", p),
};
