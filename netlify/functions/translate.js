// Netlify serverless function: translates text via MyMemory.
//
// WHY MyMemory: it needs NO API key, NO signup, and NO credit card. Free up to
// 5,000 characters/day per IP, or 50,000/day if you set a contact email in the
// MYMEMORY_EMAIL environment variable (optional).
//
// PROVIDER-AGNOSTIC CONTRACT (so we can swap providers later by editing only this
// file): the page POSTs { "q": ["text", ...], "to": "es|fr|it|zh" } and gets back
// { "translations": ["...", ...] } in the same order. Nothing else changes.
//
// To switch to Azure/Google/DeepL later: replace translateChunk() and LANG_MAP;
// the page-side contract above stays identical.

const LANG_MAP = { es: "es", fr: "fr", it: "it", zh: "zh-CN" };   // MyMemory codes
const MAX_CHUNK = 480;                                            // MyMemory limit is ~500 bytes per request

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Use POST." });

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Invalid JSON body." }); }

  const to = String(body.to || "").toLowerCase();
  const texts = Array.isArray(body.q) ? body.q.map(String) : (body.q != null ? [String(body.q)] : []);
  const target = LANG_MAP[to];

  if (!target) return json(400, { error: "Unsupported target language." });
  if (!texts.length) return json(400, { error: "No text provided." });

  const email = process.env.MYMEMORY_EMAIL || "";

  try {
    const translations = [];
    for (const t of texts) translations.push(await translateText(t, target, email));
    return json(200, { translations }, { "Cache-Control": "public, max-age=86400" });
  } catch (e) {
    return json(502, { error: "Could not reach the translation provider." });
  }
};

// Translate one (possibly long) string by splitting it into <=MAX_CHUNK pieces.
async function translateText(text, target, email) {
  const chunks = splitChunks(text, MAX_CHUNK);
  const out = [];
  for (const c of chunks) out.push(await translateChunk(c, target, email));
  return out.join(" ");
}

async function translateChunk(chunk, target, email) {
  if (!chunk.trim()) return chunk;
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", chunk);
  url.searchParams.set("langpair", "en|" + target);
  if (email) url.searchParams.set("de", email);

  const r = await fetch(url.toString());
  if (!r.ok) return chunk;                          // fall back to original on error
  const d = await r.json();
  const status = String(d.responseStatus || "");
  const out = d.responseData && d.responseData.translatedText;
  if (status !== "200" || !out || /MYMEMORY WARNING|PLEASE SELECT/i.test(out)) return chunk;
  return out;
}

// Split on sentence boundaries, then hard-split anything still too long.
function splitChunks(text, max) {
  const pieces = String(text).match(/[^.!?。！？]+[.!?。！？]?\s*/g) || [String(text)];
  const chunks = [];
  let cur = "";
  for (const p of pieces) {
    if ((cur + p).length > max) {
      if (cur) { chunks.push(cur); cur = ""; }
      if (p.length > max) {
        for (let i = 0; i < p.length; i += max) chunks.push(p.slice(i, i + max));
      } else cur = p;
    } else cur += p;
  }
  if (cur) chunks.push(cur);
  return chunks;
}

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body)
  };
}
