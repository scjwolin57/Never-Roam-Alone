// Netlify serverless function: approve (publish) a pending event and — if a
// submitter email is on file — send them a "your event is live" note. Once.
//
// Two ways to call it:
//   GET  /.netlify/functions/approve-event?id=<uuid>&token=<hmac>
//        The one-click button in the submission email. The token is an HMAC
//        of the id (signed with SUPABASE_SERVICE_KEY), so only someone who
//        received the email can use it. Returns a small HTML confirmation.
//   POST { id }  with header Authorization: Bearer <admin access token>
//        Used by the Admin page's "Add to calendar" button. We verify the
//        caller is on the blog_admins list before publishing. Returns JSON.
//
// Environment variables (same ones the other functions already use):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

const crypto = require("crypto");

exports.handler = async (event) => {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return event.httpMethod === "GET"
      ? html(500, page("Not configured", "This site isn't set up for event approvals yet."))
      : json(500, { error: "Server not configured." });
  }
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");

  // ---------- GET: one-click approve from the email ----------
  if (event.httpMethod === "GET") {
    const q = event.queryStringParameters || {};
    const id = String(q.id || "");
    const token = String(q.token || "");
    if (!id || !token) return html(400, page("Missing details", "That link is incomplete."));
    if (token !== approveToken(id, SUPABASE_SERVICE_KEY)) {
      return html(403, page("Link not valid", "This approval link is invalid or has been tampered with."));
    }
    const r = await publishAndNotify(id, { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, siteBase });
    if (!r.ok) return html(r.code || 500, page("Couldn't approve", r.message || "Something went wrong."));
    const ev = r.ev;
    const cityUrl = siteBase + "/city.html?city=" + encodeURIComponent(ev.city);
    const body =
      `<p>&#9989; <strong>${escapeHtml(ev.name)}</strong> is now live on the <strong>${escapeHtml(ev.city)}</strong> calendar.</p>` +
      (r.notified ? `<p style="color:#5b6b75">We emailed the organizer to let them know.</p>`
                  : (ev.submitter_email ? `<p style="color:#5b6b75">The organizer had already been notified.</p>` : "")) +
      `<p style="margin-top:22px">` +
        `<a class="b" href="${escapeHtml(cityUrl)}">View the ${escapeHtml(ev.city)} calendar</a> ` +
        `<a class="b ghost" href="${escapeHtml(siteBase + "/admin.html?tab=events")}">Open Admin</a>` +
      `</p>`;
    return html(200, page(r.already ? "Already live" : "Approved", body));
  }

  // ---------- POST: admin button on the Admin page ----------
  if (event.httpMethod === "POST") {
    const auth = event.headers.authorization || event.headers.Authorization || "";
    const userToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!userToken) return json(401, { error: "Not signed in." });

    // Who is this? (validates the token)
    let email = "";
    try {
      const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + userToken }
      });
      if (!ur.ok) return json(401, { error: "Session invalid — sign in again." });
      const u = await ur.json();
      email = (u && u.email) || "";
    } catch (e) { return json(401, { error: "Couldn't verify your session." }); }
    if (!email) return json(401, { error: "Session invalid — sign in again." });

    // Are they an admin? (service key bypasses RLS to read the admin list)
    let isAdmin = false;
    try {
      const ar = await fetch(`${SUPABASE_URL}/rest/v1/blog_admins?select=email`, {
        headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY }
      });
      if (ar.ok) {
        const admins = await ar.json();
        isAdmin = Array.isArray(admins) && admins.some(a => String(a.email || "").toLowerCase() === email.toLowerCase());
      }
    } catch (e) {}
    if (!isAdmin) return json(403, { error: "This account isn't an admin." });

    let p;
    try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
    const id = String(p.id || "");
    if (!id) return json(400, { error: "No event id." });

    const r = await publishAndNotify(id, { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, siteBase });
    if (!r.ok) return json(r.code || 500, { error: r.message || "Couldn't approve." });
    return json(200, { published: true, already: !!r.already, notified: !!r.notified, hadEmail: !!(r.ev && r.ev.submitter_email) });
  }

  return json(405, { error: "GET or POST only" });
};

// Publish the event and email the submitter once. Returns {ok, ev, notified, already, code, message}.
async function publishAndNotify(id, env) {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, siteBase } = env;
  const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };

  // Load the event.
  let ev;
  try {
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/city_events?id=eq.${encodeURIComponent(id)}&select=*`, { headers: svc });
    if (!gr.ok) return { ok: false, code: 502, message: "Couldn't reach the events store." };
    const rowsData = await gr.json();
    ev = rowsData && rowsData[0];
  } catch (e) { return { ok: false, code: 502, message: "Couldn't reach the events store." }; }
  if (!ev) return { ok: false, code: 404, message: "That event no longer exists." };

  const already = ev.published === true;

  // Publish it (idempotent).
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/city_events?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: svc, body: JSON.stringify({ published: true, pending: false })
    });
  } catch (e) { return { ok: false, code: 502, message: "Couldn't publish the event." }; }

  // Notify the submitter once.
  let notified = false;
  if (ev.submitter_email && !ev.notified && RESEND_API_KEY) {
    const cityUrl = siteBase + "/city.html?city=" + encodeURIComponent(ev.city);
    const when = ev.event_date + (ev.start_time ? " at " + String(ev.start_time).slice(0, 5) : "");
    try {
      const er = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
        body: JSON.stringify({
          from: "Never Roam Alone <hello@neverroamalone.com>",
          to: [ev.submitter_email],
          subject: `Your event is live: ${ev.name}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
              <h2 style="color:#185e3f;margin:0 0 8px">Your event is live! &#127881;</h2>
              <p style="margin:0 0 14px">Hi ${escapeHtml(ev.submitter_name || "there")}, thanks for your submission.</p>
              <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 18px">
                <p style="margin:0 0 4px;font-size:18px;font-weight:bold">${escapeHtml(ev.name)}</p>
                <p style="margin:0;color:#3a4a52">${escapeHtml(when)} &middot; ${escapeHtml(ev.city)}</p>
              </div>
              <p style="margin:0 0 20px">It's now on the ${escapeHtml(ev.city)} events calendar for travelers to find.</p>
              <p style="margin:0"><a href="${escapeHtml(cityUrl)}" style="display:inline-block;background:#556B2F;color:#fff;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:10px">See it on the calendar</a></p>
              <p style="margin:22px 0 0;font-size:13px;color:#8a9aa3">Never Roam Alone &middot; ${escapeHtml(siteBase)}</p>
            </div>`
        })
      });
      if (er.ok) {
        notified = true;
        await fetch(`${SUPABASE_URL}/rest/v1/city_events?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH", headers: svc, body: JSON.stringify({ notified: true })
        });
      } else {
        console.error("[approve-event] submitter email rejected HTTP", er.status);
      }
    } catch (e) { console.error("[approve-event] notify threw:", (e && e.message) || e); }
  }

  return { ok: true, ev, notified, already };
}

function approveToken(id, secret) {
  return crypto.createHmac("sha256", secret).update("approve:" + String(id)).digest("hex").slice(0, 40);
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function page(title, bodyHtml) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} — Never Roam Alone</title>
  <style>body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#f6f1e7;color:#1d2a32;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
  .card{background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(20,40,50,.12);padding:34px 30px;max-width:460px;text-align:center;line-height:1.6}
  h1{font-family:Georgia,serif;color:#556B2F;margin:0 0 10px;font-size:1.5rem}
  a.b{display:inline-block;background:#556B2F;color:#fff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px;margin:4px}
  a.b.ghost{background:#fff;color:#556B2F;border:2px solid #556B2F}</style></head>
  <body><div class="card"><h1>${escapeHtml(title)}</h1>${bodyHtml}</div></body></html>`;
}
function html(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "text/html; charset=utf-8" }, body };
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
