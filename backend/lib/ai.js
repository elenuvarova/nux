// Provider adapter for the Curator. Calls the primary provider and fails over
// to the other on error/timeout/unparseable output. Uses native fetch (Node
// 20) — no SDK. Both paths normalize to { reply, filmIds }.
const TIMEOUT_MS = 12_000;

const cfg = () => ({
  primary: process.env.AI_PRIMARY === "groq" ? "groq" : "gemini",
  geminiKey: process.env.GEMINI_API_KEY || "",
  groqKey: process.env.GROQ_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
});

async function withTimeout(fn) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fn(ctrl.signal);
  } finally {
    clearTimeout(t);
  }
}

function parseShape(text) {
  const data = JSON.parse(text);
  if (typeof data.reply !== "string" || !Array.isArray(data.filmIds)) {
    throw new Error("bad_shape");
  }
  return { reply: data.reply, filmIds: data.filmIds };
}

const FILM_SCHEMA = {
  type: "object",
  properties: { reply: { type: "string" }, filmIds: { type: "array", items: { type: "string" } } },
  required: ["reply", "filmIds"],
};

async function callGemini({ system, messages }) {
  const { geminiKey, geminiModel } = cfg();
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const res = await withTimeout((signal) =>
    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { responseMimeType: "application/json", responseSchema: FILM_SCHEMA },
        }),
      }
    )
  );
  if (!res.ok) throw new Error(`gemini_http_${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("gemini_empty");
  return parseShape(text);
}

async function callGroq({ system, messages }) {
  const { groqKey, groqModel } = cfg();
  const res = await withTimeout((signal) =>
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
      signal,
      body: JSON.stringify({
        model: groqModel,
        messages: [{ role: "system", content: system }, ...messages],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    })
  );
  if (!res.ok) throw new Error(`groq_http_${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("groq_empty");
  return parseShape(text);
}

export async function askCurator({ system, messages }) {
  const c = cfg();
  const providers =
    c.primary === "groq"
      ? [["groq", c.groqKey, callGroq], ["gemini", c.geminiKey, callGemini]]
      : [["gemini", c.geminiKey, callGemini], ["groq", c.groqKey, callGroq]];

  const errors = [];
  for (const [name, key, fn] of providers) {
    if (!key) continue; // skip unconfigured provider
    try {
      return await fn({ system, messages });
    } catch (e) {
      errors.push(`${name}: ${e.message}`);
    }
  }
  const err = new Error(`all_providers_failed: ${errors.join(" | ") || "no provider configured"}`);
  err.code = "curator_unavailable";
  throw err;
}
