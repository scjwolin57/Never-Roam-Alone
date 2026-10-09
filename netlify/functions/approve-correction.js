// Netlify serverless function: the approve step for corrections (Jeff,
// 2026-10-09). Called by the Admin page's Suggestions tab "Mark fixed" button
// once the guide has been corrected (citydata and the sheet, through the normal
// checks) and pushed. Nothing on the guide changes from here.
//
//   POST { id, note }      note = what was changed, in a few words (required)
//   header Authorization: Bearer <admin access token>
//
// It then, once:
//   1. marks the correction fixed and stores the note (fix_note);
//   2. gives a signed-in member the correction points (5, _shared/contrib.js);
//   3. thanks the sender on the first time it is marked fixed: a member in
//      their Never Roam Alone inbox (the response carries the message id so the
//      Admin page can ask message-alert.js for the usual email), anyone else by
//      email (the feedback form always asks for one, to hear back).
//
// Environment variables (same ones the other functions already use):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

const { award } = require("./_shared/contrib");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return json(500, { error: "Server not configured." });
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };

  // Who is calling, and are they an admin?
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const userToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!userToken) return json(401, { error: "Not signed in." });
  let admin = null;
  try {
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + userToken } });
    if (!ur.ok) return json(401, { error: "Session invalid. Sign in again." });
    admin = await ur.json();
  } catch (e) { return json(401, { error: "Couldn't verify your session." }); }
  if (!admin || !admin.email || !admin.id) return json(401, { error: "Session invalid. Sign in again." });
  let isAdmin = false;
  try {
    const ar = await fetch(`${SUPABASE_URL}/rest/v1/blog_admins?select=email`, { headers: svc });
    if (ar.ok) {
      const admins = await ar.json();
      isAdmin = Array.isArray(admins) && admins.some(a => String(a.email || "").toLowerCase() === admin.email.toLowerCase());
    }
  } catch (e) {}
  if (!isAdmin) return json(403, { error: "This account isn't an admin." });

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const id = String(p.id || "");
  const note = String(p.note || "").trim().slice(0, 300);
  if (!id) return json(400, { error: "No correction id." });
  if (!note) return json(400, { error: "Say what you changed." });

  // Load it.
  let row;
  try {
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/corrections?id=eq.${encodeURIComponent(id)}&select=*`, { headers: svc });
    if (!gr.ok) return json(502, { error: "Couldn't reach the corrections store." });
    row = (await gr.json())[0];
  } catch (e) { return json(502, { error: "Couldn't reach the corrections store." }); }
  if (!row) return json(404, { error: "That correction no longer exists." });

  // 1. Mark it fixed.
  const wasFixed = row.status === "fixed" || !!row.fix_note;   // fixed before (even if re-opened since): never thank twice
  try {
    const ur = await fetch(`${SUPABASE_URL}/rest/v1/corrections?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: svc, body: JSON.stringify({ status: "fixed", fix_note: note })
    });
    if (!ur.ok) return json(502, { error: "Couldn't mark it fixed (HTTP " + ur.status + ")." });
  } catch (e) { return json(502, { error: "Couldn't mark it fixed." }); }
  console.log("[approve-correction] fixed", id, "by", admin.email);

  // 2. Points for a signed-in member, once.
  const city = cityFromPage(row.page);
  const credit = await award({ url: SUPABASE_URL, key: SUPABASE_SERVICE_KEY, userId: row.user_id, kind: "correction",
                               sourceTable: "corrections", sourceId: id, city });

  // 3. Thank them, once.
  let notified = false, via = null, messageId = null;
  if (!wasFixed) {
    const line = `We fixed what you reported${city ? " on the " + city + " guide" : ""}: ${note}`;
    const link = row.page && /^https?:\/\//.test(row.page) ? row.page : siteBase;
    let emailTo = row.email || "";
    if (row.user_id && row.user_id !== admin.id) {
      let prof = null;
      try {
        const pr = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(row.user_id)}&select=email,display_name,allow_messages`, { headers: svc });
        prof = pr.ok ? (await pr.json())[0] : null;
      } catch (e) {}
      if (prof && prof.allow_messages !== false) {
        try {
          const mr = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
            method: "POST", headers: { ...svc, Prefer: "return=representation" },
            body: JSON.stringify({
              sender_id: admin.id, recipient_id: row.user_id,
              sender_name: "Never Roam Alone", recipient_name: prof.display_name || null,
              body: `Thank you for your correction! ${line}. ${link}\n\nThanks for helping other travelers.\nNever Roam Alone`
            })
          });
          if (mr.ok) { const m = await mr.json(); messageId = (m && m[0] && m[0].id) || null; notified = true; via = "message"; }
          else console.error("[approve-correction] message insert failed HTTP", mr.status, (await mr.text()).slice(0, 300));
        } catch (e) { console.error("[approve-correction] message threw:", (e && e.message) || e); }
      }
      if (!notified && prof && prof.email) emailTo = prof.email;
    }
    if (!notified && emailTo && RESEND_API_KEY) {
      try {
        const er = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
          body: JSON.stringify({
            from: "Never Roam Alone <hello@neverroamalone.com>",
            to: [emailTo],
            subject: city ? `Your correction to the ${city} guide is live` : "Your correction is live",
            html: `
              <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
                <h2 style="color:#5c6933;margin:0 0 8px">Thank you, it's fixed</h2>
                <p style="margin:0 0 20px">${escapeHtml(line)}.</p>
                <p style="margin:0 0 20px"><a href="${escapeHtml(link)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">See it on the site &rarr;</a></p>
                <p style="margin:0;font-size:13px;color:#8a9aa3">Never Roam Alone</p>
              </div>`
          })
        });
        if (er.ok) { notified = true; via = "email"; }
        else console.error("[approve-correction] Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 300));
      } catch (e) { console.error("[approve-correction] email threw:", (e && e.message) || e); }
    }
  }

  return json(200, { fixed: true, notified, via, messageId, points: credit.points, member: !!row.user_id, alreadyFixed: wasFixed });
};

// "https://neverroamalone.com/city.html?city=Lisbon" -> "Lisbon"; anything else -> null.
function cityFromPage(page) {
  try { const u = new URL(String(page || "")); return /city\.html$/.test(u.pathname) ? (u.searchParams.get("city") || null) : null; }
  catch (e) { return null; }
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
