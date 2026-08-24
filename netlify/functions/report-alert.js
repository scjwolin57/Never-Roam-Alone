// Netlify serverless function: emails the site owner when a Roamer reports
// a post or reply on a city message board (Roamer's Connections, city.html).
//
// SECURITY: the browser sends only the new report's id plus the reporter's
// own sign-in token. This function checks the token really belongs to the
// person who filed that report, then looks up the reported content itself.
// No email addresses ever go back to the browser.
//
// ANTI-SPAM: if the same person has filed more than 10 reports in the past
// hour, the report is still saved but no further emails go out.
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes") — all of these already exist for other functions:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY
//   MODERATION_EMAIL   - optional; falls back to GUIDE_REQUEST_EMAIL
//   SITE_URL           - optional, used for the "Open the admin page" link

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY,
          MODERATION_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL } = process.env;
  const TO = MODERATION_EMAIL || GUIDE_REQUEST_EMAIL;
  console.log("[report-alert] env present:", {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_KEY: !!SUPABASE_SERVICE_KEY,
    RESEND_API_KEY: !!RESEND_API_KEY,
    TO: !!TO
  });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY || !TO) {
    console.error("[report-alert] STOP: a required environment variable is missing (see booleans above).");
    return json(500, { error: "Server not configured for report alerts." });
  }

  const auth = event.headers.authorization || event.headers.Authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return json(401, { error: "Not signed in." });

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const reportId = String(payload.reportId || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(reportId)) {
    console.error("[report-alert] STOP: reportId is not a valid UUID.");
    return json(400, { error: "Bad report id" });
  }

  const svcHeaders = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };

  try {
    // 1. Whose token is this? (Supabase validates it for us.)
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + token }
    });
    if (!ur.ok) { console.error("[report-alert] STOP: token check failed, HTTP", ur.status); return json(401, { error: "Session invalid — sign in again." }); }
    const user = await ur.json();
    const uid = user && user.id;
    if (!uid) { console.error("[report-alert] STOP: token check returned no user id."); return json(401, { error: "Session invalid — sign in again." }); }

    // 2. Look up the report and make sure the caller really filed it.
    const rr = await fetch(`${SUPABASE_URL}/rest/v1/roamer_post_reports?id=eq.${reportId}&select=id,post_id,reply_id,user_id,reason,created_at`, { headers: svcHeaders });
    const rs = await rr.json();
    const rep = Array.isArray(rs) && rs[0];
    console.log("[report-alert] report lookup:", { httpStatus: rr.status, found: !!rep });
    if (!rep) { console.error("[report-alert] STOP: no report row for that id."); return json(404, { error: "Report not found" }); }
    if (rep.user_id !== uid) { console.error("[report-alert] STOP: caller did not file this report."); return json(403, { error: "Not your report" }); }

    // 3. Anti-spam: how many reports has this person filed in the last hour?
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const cr = await fetch(`${SUPABASE_URL}/rest/v1/roamer_post_reports?user_id=eq.${uid}&created_at=gte.${encodeURIComponent(since)}&select=id`, { headers: svcHeaders });
    const cs = await cr.json();
    if (Array.isArray(cs) && cs.length > 10) {
      console.log("[report-alert] STOP: this member has filed", cs.length, "reports in the past hour — no email sent.");
      return json(200, { sent: false, reason: "rate limited" });
    }

    // 4. Fetch what was actually reported.
    let city = "", title = "", content = "", authorId = "";
    if (rep.reply_id) {
      const qr = await fetch(`${SUPABASE_URL}/rest/v1/roamer_post_replies?id=eq.${rep.reply_id}&select=body,user_id,post_id`, { headers: svcHeaders });
      const q = (await qr.json())[0];
      if (q) {
        content = q.body || "";
        authorId = q.user_id || "";
        const pr = await fetch(`${SUPABASE_URL}/rest/v1/roamer_posts?id=eq.${q.post_id}&select=city,title`, { headers: svcHeaders });
        const p = (await pr.json())[0];
        if (p) { city = p.city || ""; title = p.title || ""; }
      }
    } else if (rep.post_id) {
      const pr = await fetch(`${SUPABASE_URL}/rest/v1/roamer_posts?id=eq.${rep.post_id}&select=city,title,body,user_id`, { headers: svcHeaders });
      const p = (await pr.json())[0];
      if (p) { city = p.city || ""; title = p.title || ""; content = p.body || ""; authorId = p.user_id || ""; }
    }

    // 5. Who wrote it, and who reported it (display names only).
    const names = {};
    const ids = [authorId, rep.user_id].filter(Boolean);
    if (ids.length) {
      const nr = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=in.(${ids.join(",")})&select=id,display_name`, { headers: svcHeaders });
      (await nr.json() || []).forEach(p => { names[p.id] = p.display_name || "Roamer"; });
    }
    const kind = rep.reply_id ? "reply" : "post";
    const adminLink = (SITE_URL ? SITE_URL.replace(/\/$/, "") : "") + "/admin.html?tab=conn";

    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [TO],
        subject: `Reported ${kind} on the ${city || "city"} board`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">A Roamer reported a ${escapeHtml(kind)}</h2>
            <p style="margin:0 0 16px;color:#3a4a52">On the <strong>${escapeHtml(city || "unknown")}</strong> message board.</p>
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 16px">
              <p style="margin:0 0 6px;font-size:17px;font-weight:bold">${escapeHtml(title || "(post deleted)")}</p>
              <p style="margin:0 0 10px;color:#3a4a52;white-space:pre-wrap">${escapeHtml((content || "(empty)").slice(0, 800))}</p>
              <p style="margin:0;color:#8a9aa3;font-size:13px">Written by ${escapeHtml(names[authorId] || "a Roamer")}</p>
            </div>
            <div style="border-left:4px solid #C04020;padding:2px 0 2px 12px;margin:0 0 20px">
              <p style="margin:0 0 4px;font-weight:bold">Reason given</p>
              <p style="margin:0;color:#3a4a52;white-space:pre-wrap">${escapeHtml(rep.reason || "(none)")}</p>
              <p style="margin:6px 0 0;color:#8a9aa3;font-size:13px">Reported by ${escapeHtml(names[rep.user_id] || "a Roamer")}</p>
            </div>
            <p style="margin:0 0 18px">
              <a href="${escapeHtml(adminLink)}" style="background:#556B2F;color:#fff;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:9px;display:inline-block">Open the Connections tab</a>
            </p>
            <p style="margin:0;font-size:13px;color:#8a9aa3">Hide, dismiss or delete it there. Nothing has been hidden automatically.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[report-alert] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[report-alert] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true });
  } catch (e) {
    console.error("[report-alert] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Request failed" });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
