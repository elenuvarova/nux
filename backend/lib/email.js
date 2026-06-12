// Email via Resend. If RESEND_API_KEY is not set, sending is a no-op that
// logs a warning — the auth flow still works (token is created), email just
// isn't delivered until a key + verified domain are configured.
import { Resend } from "resend";

const KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.EMAIL_FROM || "NUX <noreply@ontwrpn.com>";
const resend = KEY ? new Resend(KEY) : null;

export const emailConfigured = !!resend;

// Two distinct failure modes the caller can act on:
//   { skipped: true } — no API key configured (expected in dev)
//   { error: true }   — Resend was called and actually failed (alert-worthy)
async function send({ to, subject, html }) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${subject}" to ${to}`);
    return { skipped: true };
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed:", err?.message || err);
    return { error: true };
  }
}

// Escape user-controlled text before interpolating it into HTML email bodies,
// so a crafted display name can't inject markup into the message.
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── on-brand HTML (inline styles — email clients strip <style>) ──────────
function shell(title, body) {
  return `<!doctype html><html><body style="margin:0;background:#0d0c0b;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#f2efe9">
  <div style="max-width:480px;margin:0 auto;padding:40px 28px">
    <div style="font-family:Georgia,serif;font-weight:600;letter-spacing:1px;font-size:22px;color:#f2efe9;margin-bottom:28px">NUX</div>
    <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:600;margin:0 0 14px">${title}</h1>
    ${body}
    <hr style="border:none;border-top:1px solid rgba(255,255,255,.1);margin:32px 0 16px">
    <p style="font-size:12px;color:#8a8275;margin:0">NUX · Cinema for Curious Minds</p>
  </div></body></html>`;
}

export function sendPasswordResetEmail(to, resetUrl) {
  return send({
    to,
    subject: "Reset your NUX password",
    html: shell(
      "Reset your password",
      `<p style="font-size:15px;line-height:1.6;color:#b0a99e;margin:0 0 24px">
         We received a request to reset your password. This link expires in 1 hour.
       </p>
       <a href="${resetUrl}" style="display:inline-block;background:#c8922a;color:#0d0c0b;text-decoration:none;font-weight:600;font-size:15px;padding:13px 24px;border-radius:999px">Reset password</a>
       <p style="font-size:13px;line-height:1.6;color:#8a8275;margin:24px 0 0">
         If you didn’t ask for this, you can safely ignore this email — your password won’t change.
       </p>`
    ),
  });
}

export function sendPasswordChangedEmail(to, name) {
  return send({
    to,
    subject: "Your NUX password was changed",
    html: shell(
      "Password changed",
      `<p style="font-size:15px;line-height:1.6;color:#b0a99e;margin:0 0 8px">
         Hi ${esc(name || "there")}, your NUX password was just changed and you’ve been signed out everywhere.
       </p>
       <p style="font-size:13px;line-height:1.6;color:#8a8275;margin:16px 0 0">
         If this wasn’t you, reset your password immediately and contact support.
       </p>`
    ),
  });
}
