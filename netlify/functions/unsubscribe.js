// Netlify serverless function: one-click unsubscribe from the mailing list.
//
// Every broadcast email (see broadcast.js) includes a link like:
//   /.netlify/functions/unsubscribe?id=<row uuid>&token=<hmac>
// The token is an HMAC of the row id signed with SUPABASE_SERVICE_KEY, so
// only someone who received the email can use the link — nobody can
// unsubscribe other people by guessing ids.
//
// Environment variables (already set for the other functions):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, SITE_URL (optional)

const crypto = require("crypto");

exports.handler = async (event) => {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, SITE_URL } = process.env;
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return html(500, page("Not configured", "<p>This site isn't set up for unsubscribes yet.</p>", siteBase));
  }
  if (event.httpMethod !== "GET") return html(405, page("Not allowed", "<p>Bad request method.</p>", siteBase));

  const q = event.queryStringParameters || {};
  const id = String(q.id || "");
  const token = String(q.token || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !token) {
    return html(400, page("Link incomplete", "<p>That unsubscribe link is missing some details. Try the link in your email again.</p>", siteBase));
  }
  if (token !== unsubToken(id, SUPABASE_SERVICE_KEY)) {
    return html(403, page("Link not valid", "<p>This unsubscribe link is invalid or has been tampered with.</p>", siteBase));
  }

  try {
    const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };
    const r = await fetch(`${SUPABASE_URL}/rest/v1/mailing_list?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: { ...svc, Prefer: "return=representation" },
      body: JSON.stringify({ unsubscribed: true })
    });
    const rows = r.ok ? await r.json() : [];
    if (!r.ok || !rows.length) {
      return html(404, page("Not found", "<p>We couldn't find that subscription — it may already be removed.</p>", siteBase));
    }
    return html(200, page("You're unsubscribed",
      `<p>You won't get any more mailing-list emails from Never Roam Alone.</p>
       <p style="color:#5b6b75">Change your mind later? Just sign up again on the site.</p>
       <p style="margin-top:22px"><a class="b" href="${escapeHtml(siteBase)}">Back to the site</a></p>`, siteBase));
  } catch (e) {
    console.error("[unsubscribe] threw:", (e && e.message) || e);
    return html(502, page("Something went wrong", "<p>Please try the link again in a moment.</p>", siteBase));
  }
};

function unsubToken(id, secret) {
  return crypto.createHmac("sha256", secret).update("unsub:" + String(id)).digest("hex").slice(0, 40);
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function page(title, bodyHtml, siteBase) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} — Never Roam Alone</title>
  <style>body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#f6f1e7;color:#1d2a32;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
  .card{background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(20,40,50,.12);padding:34px 30px;max-width:460px;text-align:center;line-height:1.6}
  h1{font-family:Georgia,serif;color:#556B2F;margin:0 0 10px;font-size:1.5rem}
  a.b{display:inline-block;background:#556B2F;color:#fff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px;margin:4px}</style></head>
  <body><div class="card"><h1>${escapeHtml(title)}</h1>${bodyHtml}</div></body></html>`;
}
function html(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "text/html; charset=utf-8" }, body };
}
