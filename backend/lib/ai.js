// Provider adapter for AI features. `callModel` calls the primary provider and
// fails over to the other on error/timeout/unparseable/wrong-shape output. Uses
// native fetch (Node 20) — no SDK. Each caller supplies its own JSON `schema`
// (Gemini responseSchema) and a `validate(json)` that runs inside the attempt,
// so a wrong-shape response also triggers failover.
const TIMEOUT_MS = 12_000; // per provider attempt
const OVERALL_MS = 24_000; // hard ceiling across the whole failover chain

// The model id is interpolated into the request URL (Gemini), so only allow
// known-good values — an unexpected/misconfigured env var must not be able to
// redirect the outbound call. Unknown values fall back to the default.
const GEMINI_MODELS = new Set(["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]);
const GROQ_MODELS = new Set([
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
]); // note: llama-3.1-70b-versatile was retired by Groq — dropped from the allowlist
const pick = (val, allowed, fallback) => (allowed.has(val) ? val : fallback);

const cfg = () => ({
  primary: process.env.AI_PRIMARY === "groq" ? "groq" : "gemini",
  geminiKey: process.env.GEMINI_API_KEY || "",
  groqKey: process.env.GROQ_API_KEY || "",
  geminiModel: pick(process.env.GEMINI_MODEL, GEMINI_MODELS, "gemini-2.0-flash"),
  groqModel: pick(process.env.GROQ_MODEL, GROQ_MODELS, "llama-3.3-70b-versatile"),
});

async function withTimeout(fn, ms = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fn(ctrl.signal);
  } finally {
    clearTimeout(t);
  }
}

// Retry ONCE on a fast transient HTTP error (rate-limit / 5xx) before failing
// over to the other provider. Timeouts (AbortError → no _http_ code) are NOT
// retried — that would double the wait toward the timeout wall.
const RETRYABLE = /_http_(408|429|500|502|503|504)$/;
async function callWithRetry(fn, args) {
  try {
    return await fn(args);
  } catch (e) {
    if (!RETRYABLE.test(e?.message || "")) throw e;
    await new Promise((r) => setTimeout(r, 400));
    return fn(args);
  }
}

async function callGeminiRaw({ system, messages, schema, timeoutMs }) {
  const { geminiKey, geminiModel } = cfg();
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const t0 = Date.now();
  const res = await withTimeout(
    (signal) =>
      fetch(
        // key goes in a header, not the query string, so it can't leak into URL
        // logs / proxies / error messages (Groq already uses an auth header)
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
          signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            // cap output so a runaway/looping generation can't burn cost or stall
            generationConfig: { responseMimeType: "application/json", responseSchema: schema, maxOutputTokens: 2048 },
          }),
        }
      ),
    timeoutMs
  );
  if (!res.ok) throw new Error(`gemini_http_${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("gemini_empty");
  // observability: latency + tokens. cachedContentTokenCount surfaces Gemini's
  // implicit prefix caching, which already covers the static catalog block — so
  // no explicit cachedContent is needed at this catalog size.
  const u = data?.usageMetadata || {};
  console.log(
    `[ai] gemini model=${geminiModel} ms=${Date.now() - t0} in=${u.promptTokenCount ?? "?"} out=${u.candidatesTokenCount ?? "?"} cached=${u.cachedContentTokenCount ?? 0}`
  );
  return JSON.parse(text);
}

async function callGroqRaw({ system, messages, timeoutMs }) {
  // Groq has no responseSchema; it relies on response_format json_object below.
  const { groqKey, groqModel } = cfg();
  const t0 = Date.now();
  const res = await withTimeout(
    (signal) =>
      fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        signal,
        body: JSON.stringify({
          model: groqModel,
          messages: [{ role: "system", content: system }, ...messages],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 2048, // cap runaway generation (cost + latency)
        }),
      }),
    timeoutMs
  );
  if (!res.ok) throw new Error(`groq_http_${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("groq_empty");
  const u = data?.usage || {};
  console.log(`[ai] groq model=${groqModel} ms=${Date.now() - t0} in=${u.prompt_tokens ?? "?"} out=${u.completion_tokens ?? "?"}`);
  return JSON.parse(text);
}

// Generic provider call with failover. `validate(json)` runs inside each
// attempt (a throw triggers failover); its return value is returned to the
// caller. Throws an Error with code `curator_unavailable` if all configured
// providers fail.
export async function callModel({ system, messages, schema, validate }) {
  if (typeof validate !== "function") throw new TypeError("callModel: validate must be a function");
  const c = cfg();
  const providers =
    c.primary === "groq"
      ? [["groq", c.groqKey, callGroqRaw], ["gemini", c.geminiKey, callGeminiRaw]]
      : [["gemini", c.geminiKey, callGeminiRaw], ["groq", c.groqKey, callGroqRaw]];

  const deadline = Date.now() + OVERALL_MS;
  const errors = [];
  for (const [name, key, fn] of providers) {
    if (!key) continue; // skip unconfigured provider
    const remaining = deadline - Date.now();
    if (remaining <= 1000) {
      errors.push(`${name}: chain_deadline`);
      break;
    }
    const timeoutMs = Math.min(TIMEOUT_MS, remaining);
    try {
      const json = await callWithRetry(fn, { system, messages, schema, timeoutMs });
      return validate(json);
    } catch (e) {
      errors.push(`${name}: ${e.message}`);
    }
  }
  const err = new Error(`all_providers_failed: ${errors.join(" | ") || "no provider configured"}`);
  err.code = "curator_unavailable";
  throw err;
}

const FILM_SCHEMA = {
  type: "object",
  properties: { reply: { type: "string" }, filmIds: { type: "array", items: { type: "string" } } },
  required: ["reply", "filmIds"],
};

// The chat Curator: { reply, filmIds }.
export function askCurator({ system, messages }) {
  return callModel({
    system,
    messages,
    schema: FILM_SCHEMA,
    validate: (d) => {
      if (typeof d.reply !== "string" || !Array.isArray(d.filmIds)) throw new Error("bad_shape");
      return { reply: d.reply, filmIds: d.filmIds };
    },
  });
}
