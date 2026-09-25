// Netlify serverless function: mark a place suggestion as PUBLISHED once the
// suggested venue is on the city guide (it gets there through the normal
// hood-picks checks and the sheet, never straight from the suggestion), and
// thank the person who sent it. Once.
//
//   POST { id }
//   header Authorization: Bearer <admin access token>
//
// Called by the Admin page's Suggestions tab "Mark published" button. The
// caller must be on the blog_admins list. Declining and deleting happen on
// the Admin page directly (admin-only policies in place-suggestions-setup.sql);
// only publishing needs this function, because it sends the thank-you and
// awards points.
//
// The thank-you, only if they ticked "contact me":
//   - a signed-in member gets a message in their Never Roam Alone inbox
//     (messages.html), sent from the approving admin's account under the
//     name "Never Roam Alone". The response carries the message id so the
//     Admin page can ask message-alert.js for the usual new-message email.
//     If the member has switched messages off, they get an email instead.
//   - a visitor who was not signed in gets an email.
// A signed-in member also earns the recommendation points
// (contribution_events, contribution-points-setup.sql), whether or not
// they asked to be contacted.
//
// Environment variables (same ones the other functions already use):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

const RECOMMENDATION_POINTS = 5;   // contribution-points-setup.sql: "approved restaurant/bar/takeout/coffee = 5"

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
  if (!id) return json(400, { error: "No suggestion id." });

  // Load it.
  let row;
  try {
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions?id=eq.${encodeURIComponent(id)}&select=*`, { headers: svc });
    if (!gr.ok) return json(502, { error: "Couldn't reach the suggestions store." });
    row = (await gr.json())[0];
  } catch (e) { return json(502, { error: "Couldn't reach the suggestions store." }); }
  if (!row) return json(404, { error: "That suggestion no longer exists." });

  // Publish.
  try {
    const ur = await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: svc,
      body: JSON.stringify({ status: "published", published_at: row.published_at || new Date().toISOString() })
    });
    if (!ur.ok) return json(502, { error: "Couldn't mark it published (HTTP " + ur.status + ")." });
  } catch (e) { return json(502, { error: "Couldn't mark it published." }); }
  console.log("[approve-suggestion] published", id, row.section, row.kind, "in", row.hood_name, "/", row.city, "by", admin.email);

  // Points for a signed-in member, once per suggestion.
  let points = false;
  if (row.user_id) {
    try {
      const er = await fetch(`${SUPABASE_URL}/rest/v1/contribution_events?source_table=eq.place_suggestions&source_id=eq.${encodeURIComponent(id)}&select=id`, { headers: svc });
      const existing = er.ok ? await er.json() : null;
      if (Array.isArray(existing) && !existing.length) {
        const ir = await fetch(`${SUPABASE_URL}/rest/v1/contribution_events`, {
          method: "POST", headers: svc,
          body: JSON.stringify({ user_id: row.user_id, kind: "recommendation", points: RECOMMENDATION_POINTS,
                                 source_table: "place_suggestions", source_id: id, city: row.city })
        });
        points = ir.ok;
        if (!ir.ok) console.error("[approve-suggestion] points insert failed HTTP", ir.status, (await ir.text()).slice(0, 300));
      } else if (Array.isArray(existing)) {
        points = true;   // already awarded on an earlier publish
      }
    } catch (e) { console.error("[approve-suggestion] points threw:", (e && e.message) || e); }
  }

  // Thank them, once, only if they asked.
  let notified = false, via = null, messageId = null;
  if (row.contact && !row.notified) {
    const cityUrl = siteBase + "/city.html?city=" + encodeURIComponent(row.city);
    const what = `${row.kind_label || "place"} in ${row.hood_name}, ${row.city}`;
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
              body: `Thank you for your suggestion! The ${what} you suggested is now on the ${row.city} guide: ${cityUrl}\n\nThanks for helping other travelers.\nNever Roam Alone`
            })
          });
          if (mr.ok) {
            const m = await mr.json();
            messageId = (m && m[0] && m[0].id) || null;
            notified = true; via = "message";
          } else {
            console.error("[approve-suggestion] message insert failed HTTP", mr.status, (await mr.text()).slice(0, 300));
          }
        } catch (e) { console.error("[approve-suggestion] message threw:", (e && e.message) || e); }
      }
      if (!notified && prof && prof.email) emailTo = prof.email;   // messages switched off (or failed): fall back to email
    }

    if (!notified && emailTo && RESEND_API_KEY) {
      try {
        const er = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
          body: JSON.stringify({
            from: "Never Roam Alone <hello@neverroamalone.com>",
            to: [emailTo],
            subject: `Your suggestion is on the ${row.city} guide`,
            html: `
              <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
                <h2 style="color:#5c6933;margin:0 0 8px">Your suggestion is live!</h2>
                <p style="margin:0 0 20px">Thank you. The ${escapeHtml(what)} you suggested is now on the ${escapeHtml(row.city)} city guide for other travelers.</p>
                <p style="margin:0 0 20px"><a href="${escapeHtml(cityUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">See the ${escapeHtml(row.city)} guide &rarr;</a></p>
                <p style="margin:0;font-size:13px;color:#8a9aa3">Never Roam Alone</p>
              </div>`
          })
        });
        if (er.ok) { notified = true; via = "email"; }
        else console.error("[approve-suggestion] Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 300));
      } catch (e) { console.error("[approve-suggestion] email threw:", (e && e.message) || e); }
    }

    if (notified) {
      await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH", headers: svc, body: JSON.stringify({ notified: true })
      }).catch(() => {});
    }
  }

  return json(200, { published: true, notified, via, messageId, points, wanted: !!row.contact, alreadyNotified: !!row.notified });
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
