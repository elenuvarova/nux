// Web push (VAPID). Configuration is LAZY: setVapidDetails runs on first use,
// never at import time, so the backend boots fine without the VAPID_* vars —
// the routes just answer 503 and the frontend hides the feature.
import webpush from "web-push";
import { PushSubscription } from "../models.js";

let configured = null; // null = not checked yet; then true/false for the process

// SSRF guard: a stored endpoint is a URL this server later POSTs to (signed),
// so it must belong to a real browser push service — not an arbitrary host.
// Hostname allowlist beats DNS/IP checks here: these are vendor-controlled
// domains, and resolving every subscribe would add latency + flakiness.
// Chrome/Brave/Opera → fcm.googleapis.com · Firefox → *.push.services.mozilla.com
// Safari 16.4+ → *.push.apple.com · Edge/WNS → *.notify.windows.com
// Samsung Internet → *.push.samsungosp.com. Extend deliberately, never wildcard.
const PUSH_HOST_EXACT = new Set([
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "web.push.apple.com",
]);
const PUSH_HOST_SUFFIXES = [
  ".push.services.mozilla.com",
  ".push.apple.com",
  ".notify.windows.com",
  ".push.samsungosp.com",
];

export function isAllowedPushEndpoint(endpoint) {
  let url;
  try {
    url = new URL(String(endpoint || ""));
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  return PUSH_HOST_EXACT.has(host) || PUSH_HOST_SUFFIXES.some((s) => host.endsWith(s));
}

function ensureConfigured() {
  if (configured !== null) return configured;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return (configured = false);
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:eluvrv@gmail.com",
    publicKey,
    privateKey
  );
  return (configured = true);
}

export function isConfigured() {
  return ensureConfigured();
}

// The public key browsers need as applicationServerKey; null when unconfigured.
export function getPublicKey() {
  return ensureConfigured() ? process.env.VAPID_PUBLIC_KEY : null;
}

// Send one payload to EVERY stored subscription. Never throws: a bad endpoint
// must not take down the caller (the collections regen fires this in the
// background). 404/410 mean the browser revoked the subscription — prune the
// row so the list stays honest; anything else is logged and retried next week.
export async function sendBroadcast(payload) {
  if (!ensureConfigured()) return { sent: 0, pruned: 0, failed: 0 };
  const body = JSON.stringify(payload);
  let subs;
  try {
    subs = await PushSubscription.findAll();
  } catch (err) {
    console.error("[push] could not read subscriptions:", err?.message || err);
    return { sent: 0, pruned: 0, failed: 0 };
  }
  let sent = 0;
  let pruned = 0;
  let failed = 0;
  await Promise.all(
    subs.map(async (sub) => {
      // Re-check the allowlist at send time so rows written before the guard
      // existed (or edited out-of-band) can never turn into server-side POSTs
      // to an attacker host. Prune them — they were never deliverable.
      if (!isAllowedPushEndpoint(sub.endpoint)) {
        pruned += 1;
        await sub.destroy().catch(() => {});
        return;
      }
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body
        );
        sent += 1;
      } catch (err) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          pruned += 1;
          await sub.destroy().catch(() => {});
        } else {
          failed += 1;
          console.error("[push] send failed:", err?.statusCode || err?.message || err);
        }
      }
    })
  );
  console.log(`[push] broadcast: ${sent} sent, ${pruned} pruned, ${failed} failed`);
  return { sent, pruned, failed };
}
