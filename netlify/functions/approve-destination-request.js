// Netlify serverless function: the "Mark added" step for a destination
// request (Jeff, 2026-11-16). Called by the Admin page's Destination requests
// list once the city guide is on the site: researched and added through the
// add-city tooling, and pushed. Nothing reaches the site from here.
//
//   POST { id, city }      city = the guide's exact name on the site
//   header Authorization: Bearer <admin access token>
//
// It then, once:
//   1. checks that city really has a guide on the live site (the published
//      citydata/_index.json), so a request can't be marked added early;
//   2. marks the request added and stores the guide's name (added_city);
//   3. emails the person who asked that the guide is live, if they left an
//      email (the homepage form says "So we can tell you when the guide is
//      added").
//
// Environment variables (same ones the other functions already use):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return json(500, { error: "Server not configured." });
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };

  // Who is calling, and are they an admin? (same check as approve-trip-suggestion.js)
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
  const wanted = String(p.city || "").trim().slice(0, 120);
  if (!id) return json(400, { error: "No request id." });
  if (!wanted) return json(400, { error: "Type the guide's name on the site." });

  let row;
  try {
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/destination_requests?id=eq.${encodeURIComponent(id)}&select=*`, { headers: svc });
    if (!gr.ok) return json(502, { error: "Couldn't reach the requests store." });
    row = (await gr.json())[0];
  } catch (e) { return json(502, { error: "Couldn't reach the requests store." }); }
  if (!row) return json(404, { error: "That request no longer exists." });

  // 1. Is the guide on the live site?
  let city;
  try {
    const ir = await fetch(siteBase + "/citydata/_index.json");
    if (!ir.ok) throw new Error("index HTTP " + ir.status);
    const slugs = (await ir.json()).slug || {};
    const key = norm(wanted);
    city = Object.keys(slugs).find(c => norm(c) === key) || null;
  } catch (e) { return json(502, { error: "Couldn't read the live city list: " + ((e && e.message) || "error") }); }
  if (!city) {
    return json(409, { error: `"${wanted}" has no guide on the live site yet. Run the add-city research, push, wait for the deploy, then mark it added. Or check the spelling matches the guide.` });
  }

  // 2. Mark it added.
  const wasAdded = row.status === "added" || !!row.added_city;   // added before (even if re-opened since): never email twice
  try {
    const ur = await fetch(`${SUPABASE_URL}/rest/v1/destination_requests?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: svc, body: JSON.stringify({ status: "added", added_city: city })
    });
    if (!ur.ok) return json(502, { error: "Couldn't mark it added (HTTP " + ur.status + ")." });
  } catch (e) { return json(502, { error: "Couldn't mark it added." }); }
  console.log("[approve-destination-request] added", JSON.stringify(city), "for request", JSON.stringify(row.place), "by", admin.email);

  // 3. Tell the person who asked, once.
  let notified = false;
  const emailTo = String(row.requester_email || "").trim();
  if (emailTo && !wasAdded && RESEND_API_KEY) {
    const cityUrl = siteBase + "/city.html?city=" + encodeURIComponent(city);
    try {
      const er = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
        body: JSON.stringify({
          from: "Never Roam Alone <hello@neverroamalone.com>",
          to: [emailTo],
          subject: `The ${city} guide you asked for is live`,
          html: `
            <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
              <h2 style="color:#5c6933;margin:0 0 8px">Your guide is live!</h2>
              <p style="margin:0 0 20px">Thank you for asking. The ${escapeHtml(city)} guide is now on Never Roam Alone.</p>
              <p style="margin:0 0 20px"><a href="${escapeHtml(cityUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">See the ${escapeHtml(city)} guide &rarr;</a></p>
              <p style="margin:0;font-size:13px;color:#8a9aa3">Never Roam Alone</p>
            </div>`
        })
      });
      if (er.ok) notified = true;
      else console.error("[approve-destination-request] Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 300));
    } catch (e) { console.error("[approve-destination-request] email threw:", (e && e.message) || e); }
  }

  return json(200, { added: true, city, notified, hadEmail: !!emailTo, alreadyAdded: wasAdded });
};

function norm(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
