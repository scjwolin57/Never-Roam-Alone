// Netlify serverless function: emails the site owner when a visitor
// submits an event through the "Submit an event" form on a city page
// (city.html calendar section). Jeff reviews it, then adds approved
// events on events-admin.html.
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY       - already set up for the other email functions
//   EVENT_SUBMIT_EMAIL   - where to send submissions (falls back to
//                          GUIDE_REQUEST_EMAIL if you don't set this one)
//   SITE_URL             - optional, used in the email footer

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, EVENT_SUBMIT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL } = process.env;
  const toEmail = EVENT_SUBMIT_EMAIL || GUIDE_REQUEST_EMAIL;
  console.log("[submit-event] env present:", {
    RESEND_API_KEY: !!RESEND_API_KEY,
    toEmail: !!toEmail
  });
  if (!RESEND_API_KEY || !toEmail) {
    console.error("[submit-event] STOP: missing env var (see booleans above).");
    return json(500, { error: "Server not configured for event submissions." });
  }

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }

  const city      = clip(p.city, 80);
  const name      = clip(p.name, 140);
  const location  = clip(p.location, 200);
  const mapLink   = safeUrl(p.mapLink);
  const date      = clip(p.date, 10);         // YYYY-MM-DD
  const startTime = clip(p.startTime, 5);     // HH:MM
  const endTime   = clip(p.endTime, 5);
  const link      = safeUrl(p.link);
  const posterUrl = safeUrl(p.posterUrl);
  const submitter = clip(p.submitterName, 60);
  const subEmail  = clip(p.submitterEmail, 120);

  if (!city || !name || !date) {
    return json(400, { error: "Missing event name, city, or date." });
  }
  console.log("[submit-event] submission:", name, "in", city, "on", date);

  const when = date + (startTime ? " · " + startTime + (endTime ? "–" + endTime : "") : "");
  const rows = [
    ["Event", name],
    ["City", city],
    ["Date & time", when],
    ["Location", location ? (mapLink ? `${escapeHtml(location)} — <a href="${mapLink}">map</a>` : escapeHtml(location)) : "—"],
    ["Event link", link ? `<a href="${link}">${escapeHtml(link)}</a>` : "—"],
    ["Submitted by", (submitter || subEmail) ? `${escapeHtml(submitter || "Anonymous")}${subEmail ? " &lt;" + escapeHtml(subEmail) + "&gt;" : ""}` : "Anonymous visitor"]
  ];
  const rowsHtml = rows.map(([k, v]) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#8a9aa3;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#1d2a32">${v}</td></tr>`
  ).join("");

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <onboarding@resend.dev>",
        to: [toEmail],
        subject: `Event submission: ${name} (${city})`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">New event submission</h2>
            <p style="margin:0 0 16px;color:#3a4a52">Review this and, if it's a keeper, add it on <strong>events-admin.html</strong>.</p>
            <table style="border-collapse:collapse;font-size:15px;width:100%">${rowsHtml}</table>
            ${posterUrl ? `<div style="margin:20px 0 8px"><strong>Poster:</strong></div><a href="${posterUrl}"><img src="${posterUrl}" alt="Event poster" style="max-width:100%;border-radius:12px;border:1px solid #e3ddce"/></a>` : `<p style="margin:18px 0 0;color:#8a9aa3">No poster image was uploaded.</p>`}
            <p style="margin:22px 0 0;font-size:13px;color:#8a9aa3">Sent from the ${escapeHtml(city)} city page on ${escapeHtml(SITE_URL || "Never Roam Alone")}.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[submit-event] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[submit-event] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true });
  } catch (e) {
    console.error("[submit-event] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Request failed" });
  }
};

function clip(s, n) { return String(s == null ? "" : s).trim().slice(0, n); }
function safeUrl(s) {
  const u = clip(s, 500);
  // only allow http(s) links, and escape for safe embedding in an href/src attribute
  return /^https?:\/\//i.test(u) ? escapeHtml(u) : "";
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
