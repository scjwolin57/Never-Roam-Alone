// Netlify serverless function: emails the site owner when a visitor
// requests a city guide for a place that doesn't have one yet
// (the "Request city guide" button on itinerary.html).
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY        - already set up for reply notifications
//   GUIDE_REQUEST_EMAIL   - where to send requests (your email address)
//   SITE_URL              - optional, used in the email footer

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, GUIDE_REQUEST_EMAIL, SITE_URL } = process.env;
  console.log("[request-guide] env present:", {
    RESEND_API_KEY: !!RESEND_API_KEY,
    GUIDE_REQUEST_EMAIL: !!GUIDE_REQUEST_EMAIL
  });
  if (!RESEND_API_KEY || !GUIDE_REQUEST_EMAIL) {
    console.error("[request-guide] STOP: missing env var (see booleans above).");
    return json(500, { error: "Server not configured for guide requests." });
  }

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const place = String(payload.place || "").trim().slice(0, 80);
  const country = String(payload.country || "").trim().slice(0, 60);
  const tripType = payload.tripType === "past" ? "past" : "upcoming";
  const requesterName = String(payload.requesterName || "").trim().slice(0, 40);
  const requesterEmail = String(payload.requesterEmail || "").trim().slice(0, 120);
  if (!place) return json(400, { error: "No place given" });
  console.log("[request-guide] request for:", place, country ? "(" + country + ")" : "");

  const who = requesterName || requesterEmail
    ? `${escapeHtml(requesterName || "A Roamer")}${requesterEmail ? " &lt;" + escapeHtml(requesterEmail) + "&gt;" : ""}`
    : "An anonymous visitor";

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [GUIDE_REQUEST_EMAIL],
        subject: `City guide request: ${place}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">New city guide request</h2>
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:14px 0 20px">
              <p style="margin:0 0 4px;font-size:18px;font-weight:bold">${escapeHtml(place)}${country ? ", " + escapeHtml(country) : ""}</p>
              <p style="margin:0;color:#3a4a52">Requested by: ${who}</p>
              <p style="margin:4px 0 0;color:#3a4a52">It's on their <strong>${tripType}</strong> trips list.</p>
            </div>
            <p style="margin:0;font-size:13px;color:#8a9aa3">Sent from the itinerary page on ${escapeHtml(SITE_URL || "Never Roam Alone")}.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[request-guide] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[request-guide] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true });
  } catch (e) {
    console.error("[request-guide] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Request failed" });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
