// Netlify serverless function: the approve step for "Suggest a day trip" and
// "Suggest a landmark" (Jeff, 2026-10-02). Called by the Admin page's
// Suggestions tab "Mark added" button once the trip or landmark is on the
// guide: added to day-trips.js / the landmark catalogs, citydata and the sheet
// through the normal checks, and pushed. Nothing reaches the guide from here.
//
//   POST { id, name }      name = the exact name it has on the guide
//   header Authorization: Bearer <admin access token>
//
// It then, once:
//   1. checks the name really is on the live guide for that city (the
//      published citydata file), so a suggestion can't be marked added early;
//   2. marks the suggestion added and stores that name (added_name);
//   3. gives a signed-in member the day trip / landmark points (10) and links
//      the card's vote key ("<city>:<name>") to them, so thumbs up / down on it
//      count toward their Trusted Traveler Rating (_shared/contrib.js);
//   4. thanks them if they ticked "contact me": a member in their Never Roam
//      Alone inbox (the response carries the message id so the Admin page can
//      ask message-alert.js for the usual email), anyone else by email.
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
  const wanted = String(p.name || "").trim().slice(0, 200);
  if (!id) return json(400, { error: "No suggestion id." });
  if (!wanted) return json(400, { error: "Type the name it has on the guide." });

  // Load it.
  let row;
  try {
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/daytrip_suggestions?id=eq.${encodeURIComponent(id)}&select=*`, { headers: svc });
    if (!gr.ok) return json(502, { error: "Couldn't reach the suggestions store." });
    row = (await gr.json())[0];
  } catch (e) { return json(502, { error: "Couldn't reach the suggestions store." }); }
  if (!row) return json(404, { error: "That suggestion no longer exists." });
  const lmk = row.kind === "landmark";
  const what = lmk ? "landmark" : "day trip";

  // 1. Is it on the live guide?
  let name;
  try { name = await nameOnGuide(siteBase, row.city, wanted, lmk); }
  catch (e) { return json(502, { error: "Couldn't read the live " + row.city + " guide: " + ((e && e.message) || "error") }); }
  if (!name) {
    return json(409, { error: `"${wanted}" isn't a ${what} on the live ${row.city} guide yet. Add it (${lmk ? "landmark catalogs" : "day-trips.js"}, citydata and the sheet), push, wait for the deploy, then mark it added. Or check the spelling matches the guide.` });
  }

  // 2. Mark it added.
  const wasAdded = row.status === "added" || !!row.added_name;   // added before (even if re-opened since): never thank twice
  try {
    const ur = await fetch(`${SUPABASE_URL}/rest/v1/daytrip_suggestions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: svc, body: JSON.stringify({ status: "added", added_name: name })
    });
    if (!ur.ok) {
      const detail = (await ur.text()).slice(0, 300);
      return json(502, { error: "Couldn't mark it added (HTTP " + ur.status + ")." + (/added_name/.test(detail) ? " Run landmark-suggestions-setup.sql in Supabase first." : "") });
    }
  } catch (e) { return json(502, { error: "Couldn't mark it added." }); }
  console.log("[approve-trip-suggestion] added", what, JSON.stringify(name), "in", row.city, "by", admin.email);

  // 3. Points and the vote key for a signed-in member, once.
  const credit = await award({ url: SUPABASE_URL, key: SUPABASE_SERVICE_KEY, userId: row.user_id, kind: "daytrip_landmark",
                               sourceTable: "daytrip_suggestions", sourceId: id, city: row.city,
                               targets: [{ type: lmk ? "landmark" : "daytrip", id: `${row.city}:${name}` }] });

  // 4. Thank them, once (only on the first time it is marked added), only if they asked.
  let notified = false, via = null, messageId = null;
  if (row.contact && !wasAdded) {
    const cityUrl = siteBase + "/city.html?city=" + encodeURIComponent(row.city);
    const line = `The ${what} you suggested, ${name}, is now on the ${row.city} guide`;
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
              body: `Thank you for your suggestion! ${line}: ${cityUrl}\n\nThanks for helping other travelers.\nNever Roam Alone`
            })
          });
          if (mr.ok) { const m = await mr.json(); messageId = (m && m[0] && m[0].id) || null; notified = true; via = "message"; }
          else console.error("[approve-trip-suggestion] message insert failed HTTP", mr.status, (await mr.text()).slice(0, 300));
        } catch (e) { console.error("[approve-trip-suggestion] message threw:", (e && e.message) || e); }
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
            subject: `Your ${what} suggestion is on the ${row.city} guide`,
            html: `
              <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
                <h2 style="color:#5c6933;margin:0 0 8px">Your suggestion is live!</h2>
                <p style="margin:0 0 20px">Thank you. ${escapeHtml(line)} for other travelers.</p>
                <p style="margin:0 0 20px"><a href="${escapeHtml(cityUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">See the ${escapeHtml(row.city)} guide &rarr;</a></p>
                <p style="margin:0;font-size:13px;color:#8a9aa3">Never Roam Alone</p>
              </div>`
          })
        });
        if (er.ok) { notified = true; via = "email"; }
        else console.error("[approve-trip-suggestion] Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 300));
      } catch (e) { console.error("[approve-trip-suggestion] email threw:", (e && e.message) || e); }
    }
  }

  return json(200, { added: true, name, notified, via, messageId, points: credit.points, wanted: !!row.contact, alreadyAdded: wasAdded });
};

// The exact name of this day trip / landmark on the live guide, or null.
// Compared without case, accents or punctuation, so "Sintra " finds "Sintra".
async function nameOnGuide(siteBase, city, wanted, lmk) {
  const ir = await fetch(siteBase + "/citydata/_index.json");
  if (!ir.ok) throw new Error("index HTTP " + ir.status);
  const slug = ((await ir.json()).slug || {})[city];
  if (!slug) throw new Error("no guide for " + city);
  const cr = await fetch(siteBase + "/citydata/" + encodeURIComponent(slug) + ".json");
  if (!cr.ok) throw new Error("city file HTTP " + cr.status);
  const rec = await cr.json();
  const names = lmk
    ? (rec.landmarks || []).map(l => Array.isArray(l) ? l[0] : l && l.name)
    : [].concat((rec.daytrips && rec.daytrips.half) || [], (rec.daytrips && rec.daytrips.full) || []).map(t => t && t.name);
  const key = norm(wanted);
  return names.find(n => n && norm(n) === key) || null;
}
function norm(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
