// Netlify serverless function: publish a city-page interview (Insights —
// Traveler's Take / Local's Perspective) after the admin has reviewed and
// edited it, and email the submitter a "your interview is live" note. Once.
//
//   POST { id, name, answers: [{q, a}], response }
//   header Authorization: Bearer <admin access token>
//
// Called by the Admin page's Insights tab "Approve & publish" button. The
// caller must be on the blog_admins list. The edits in the body are saved
// together with the publish, so what goes live is exactly what was on
// screen. Answers left empty are dropped. Unpublish, save-without-publishing
// and delete happen on the Admin page directly (admin-only table policies in
// city-insights-setup.sql); only publishing needs this function, because it
// sends the email.
//
// Environment variables (same ones the other functions already use):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

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
  let adminEmail = "";
  try {
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + userToken }
    });
    if (!ur.ok) return json(401, { error: "Session invalid — sign in again." });
    const u = await ur.json();
    adminEmail = (u && u.email) || "";
  } catch (e) { return json(401, { error: "Couldn't verify your session." }); }
  if (!adminEmail) return json(401, { error: "Session invalid — sign in again." });
  let isAdmin = false;
  try {
    const ar = await fetch(`${SUPABASE_URL}/rest/v1/blog_admins?select=email`, { headers: svc });
    if (ar.ok) {
      const admins = await ar.json();
      isAdmin = Array.isArray(admins) && admins.some(a => String(a.email || "").toLowerCase() === adminEmail.toLowerCase());
    }
  } catch (e) {}
  if (!isAdmin) return json(403, { error: "This account isn't an admin." });

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const id = String(p.id || "");
  if (!id) return json(400, { error: "No interview id." });
  const name = clip(p.name, 80);
  const response = clip(p.response, 4000);
  const answers = (Array.isArray(p.answers) ? p.answers : [])
    .slice(0, 30)
    .map(x => ({ q: clip(x && x.q, 300), a: clip(x && x.a, 1200) }))
    .filter(x => x.q && x.a);
  if (!name) return json(400, { error: "The name can't be empty — it's shown on the interview." });
  if (!answers.length && !response) return json(400, { error: "Nothing left to publish — every answer is empty." });

  // Load it.
  let row;
  try {
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/city_insights?id=eq.${encodeURIComponent(id)}&select=*`, { headers: svc });
    if (!gr.ok) return json(502, { error: "Couldn't reach the interviews store." });
    row = (await gr.json())[0];
  } catch (e) { return json(502, { error: "Couldn't reach the interviews store." }); }
  if (!row) return json(404, { error: "That interview no longer exists." });

  // Save the edits and publish in one update.
  try {
    const ur = await fetch(`${SUPABASE_URL}/rest/v1/city_insights?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: svc,
      body: JSON.stringify({
        name, answers, response: response || null,
        published: true, pending: false,
        published_at: row.published_at || new Date().toISOString()
      })
    });
    if (!ur.ok) return json(502, { error: "Couldn't publish the interview (HTTP " + ur.status + ")." });
  } catch (e) { return json(502, { error: "Couldn't publish the interview." }); }
  console.log("[approve-insight] published", id, row.type, "in", row.city, "by", adminEmail);

  // Tell the submitter, once.
  let notified = false;
  if (row.email && !row.notified && RESEND_API_KEY) {
    const cityUrl = siteBase + "/city.html?city=" + encodeURIComponent(row.city);
    const label = row.type === "local" ? "Local's Perspective" : "Traveler's Take";
    try {
      const er = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
        body: JSON.stringify({
          from: "Never Roam Alone <hello@neverroamalone.com>",
          to: [row.email],
          subject: `Your ${row.city} interview is live`,
          html: `
            <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
              <h2 style="color:#5c6933;margin:0 0 8px">Your interview is live!</h2>
              <p style="margin:0 0 14px">Hi ${escapeHtml(name)}, thank you for sharing.</p>
              <p style="margin:0 0 20px">Your ${escapeHtml(label)} is now on the ${escapeHtml(row.city)} city guide for other travelers to read.</p>
              <p style="margin:0 0 20px"><a href="${escapeHtml(cityUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">See it on the ${escapeHtml(row.city)} guide &rarr;</a></p>
              <p style="margin:0;font-size:13px;color:#8a9aa3">Never Roam Alone</p>
            </div>`
        })
      });
      if (er.ok) {
        notified = true;
        await fetch(`${SUPABASE_URL}/rest/v1/city_insights?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH", headers: svc, body: JSON.stringify({ notified: true })
        }).catch(() => {});
      } else {
        console.error("[approve-insight] Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 300));
      }
    } catch (e) {
      console.error("[approve-insight] notify threw:", (e && e.message) || e);
    }
  }

  return json(200, { published: true, notified, alreadyNotified: !!row.notified });
};

function clip(s, n) { return String(s == null ? "" : s).trim().slice(0, n); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
