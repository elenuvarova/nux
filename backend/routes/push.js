import { Router } from "express";
import { UniqueConstraintError } from "sequelize";
import { PushSubscription } from "../models.js";
import { currentUser, rateLimit } from "../lib/auth.js";
import { ah } from "../lib/asyncHandler.js";
import { isConfigured, getPublicKey, isAllowedPushEndpoint } from "../lib/push.js";

const router = Router();

const ENDPOINT_MAX = 512; // matches the column width in models.js
const KEY_MAX = 256; // p256dh is ~88 base64 chars, auth ~24 — 256 is generous

// Without VAPID keys the feature doesn't exist: everything below answers 503
// and the frontend hides the Settings row. Checked per-request (lazy config).
router.use((req, res, next) => {
  if (!isConfigured()) return res.status(503).json({ error: "push-not-configured" });
  next();
});

// The endpoint URL is attacker-controlled input we will later POST to from the
// server (SSRF surface), so beyond https + column width it must live on a
// known browser push-service host — see the allowlist in lib/push.js, which
// sendBroadcast re-checks at send time as well.
function cleanEndpoint(raw) {
  const endpoint = String(raw || "").trim();
  if (!endpoint || endpoint.length > ENDPOINT_MAX) return null;
  if (!isAllowedPushEndpoint(endpoint)) return null;
  return endpoint;
}

function cleanKey(raw) {
  const key = String(raw || "").trim();
  return key && key.length <= KEY_MAX ? key : null;
}

// GET /api/push/public-key → { key } — the applicationServerKey for subscribe()
router.get(
  "/public-key",
  ah(async (req, res) => {
    res.json({ key: getPublicKey() });
  })
);

// POST /api/push/subscribe — body is PushSubscription.toJSON(). Upsert by
// endpoint (re-subscribing refreshes keys + ownership). Public route: guests
// may subscribe; a signed-in caller gets the row attached to their account.
router.post(
  "/subscribe",
  rateLimit("push", 20, 10 * 60 * 1000),
  ah(async (req, res) => {
    const endpoint = cleanEndpoint(req.body?.endpoint);
    const p256dh = cleanKey(req.body?.keys?.p256dh);
    const auth = cleanKey(req.body?.keys?.auth);
    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({ error: "invalid_subscription" });
    }

    const me = await currentUser(req);
    const values = { endpoint, p256dh, auth, UserId: me?.id || null };
    // Race-safe upsert on the unique endpoint (mirrors list.js): a concurrent
    // insert losing to the unique index is retried as an update. On the update
    // path a GUEST refresh keeps the existing owner (an unauthenticated caller
    // must not be able to detach a row from an account); a signed-in caller
    // re-claims it — same device, new login — which is the intended flow.
    let created = true;
    try {
      await PushSubscription.create(values);
    } catch (err) {
      if (!(err instanceof UniqueConstraintError)) throw err;
      created = false;
      const update = me?.id ? values : { endpoint, p256dh, auth };
      await PushSubscription.update(update, { where: { endpoint } });
    }
    res.status(created ? 201 : 200).json({ ok: true });
  })
);

// DELETE /api/push/subscribe { endpoint } — idempotent. Deliberately
// capability-based (security-reviewed): the endpoint is a high-entropy URL
// only the subscribing browser ever sees, and it must stay deletable after
// logout (subscribe signed-in, unsubscribe signed-out, same device). The
// unconditional 204 avoids existence-oracle behavior.
router.delete(
  "/subscribe",
  rateLimit("push", 20, 10 * 60 * 1000),
  ah(async (req, res) => {
    const endpoint = cleanEndpoint(req.body?.endpoint);
    if (!endpoint) return res.status(400).json({ error: "invalid_subscription" });
    await PushSubscription.destroy({ where: { endpoint } });
    res.status(204).end();
  })
);

export default router;
