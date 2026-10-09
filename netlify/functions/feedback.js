// Netlify serverless function: emails the site owner when a visitor submits
// the "Site feedback" form (feedback.html). Same fields as the contact form,
// plus the page the feedback is about and an optional screenshot.
//
// A message marked "Something in a city guide is wrong or out of date"
// (kind "correction", Jeff 2026-10-09) is also saved to the corrections table
// as PENDING (corrections-setup.sql), so it can be approved on the Admin page
// (approve-correction.js), which gives a signed-in member the correction
// points. A signed-in member sends their access token; the server checks it
// and stores their user id. Every message is still emailed.
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY   - already set up for reply notifications / guide requests
//   CONTACT_EMAIL    - where feedback goes (falls back to GUIDE_REQUEST_EMAIL)
//   SITE_URL         - optional, used in the email footer and the review link
//   SUPABASE_URL, SUPABASE_SERVICE_KEY - to save a correction and check the
//                      member's session
//
// The screenshot arrives from the browser as a base64 data URL. Netlify's
// synchronous functions cap the request body around 6MB, so the page also
// checks the file size before upload — this function re-checks server-side.

const MAX_SCREENSHOT_BYTES = 4.5 * 1024 * 1024; // ~4.5MB decoded

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, CONTACT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  const toEmail = CONTACT_EMAIL || GUIDE_REQUEST_EMAIL;
  console.log("[feedback] env present:", {
    RESEND_API_KEY: !!RESEND_API_KEY,
    toEmail: !!toEmail
  });
  if (!RESEND_API_KEY || !toEmail) {
    console.error("[feedback] STOP: missing env var (see booleans above).");
    return json(500, { error: "Server not configured for feedback." });
  }

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const name = String(payload.name || "").trim().slice(0, 80);
  const email = String(payload.email || "").trim().slice(0, 120);
  const message = String(payload.message || "").trim().slice(0, 4000);
  const page = String(payload.page || "").trim().slice(0, 500);
  const screenshot = payload.screenshot && typeof payload.screenshot === "object" ? payload.screenshot : null;

  const isCorrection = payload.kind === "correction";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "A valid email is required" });
  if (!message) return json(400, { error: "A message is required" });

  // A correction is saved as PENDING for the Admin page's approve step.
  let reviewId = "";
  if (isCorrection && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };
    let userId = null;
    const token = String(payload.accessToken || "").trim();
    if (token) {
      try {
        const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + token } });
        if (ur.ok) { const u = await ur.json(); userId = (u && u.id) || null; }
      } catch (e) { /* treat as a guest */ }
    }
    try {
      const ir = await fetch(`${SUPABASE_URL}/rest/v1/corrections`, {
        method: "POST",
        headers: { ...svc, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({ page: page || null, message, name: name || null, email,
                               has_screenshot: !!screenshot, user_id: userId, status: "pending" })
      });
      if (ir.ok) { const created = await ir.json(); reviewId = (created && created[0] && created[0].id) || ""; }
      else console.error("[feedback] correction insert failed HTTP", ir.status, (await ir.text()).slice(0, 300));
    } catch (e) { console.error("[feedback] correction insert threw:", (e && e.message) || e); }
  }
  const reviewUrl = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "") + "/admin.html?tab=suggestions" + (reviewId ? "&correction=" + encodeURIComponent(reviewId) : "");
  console.log("[feedback] request from:", email, "| page:", page || "(none given)", "| has screenshot:", !!screenshot);

  const attachments = [];
  if (screenshot) {
    const dataUrl = String(screenshot.dataUrl || "");
    const filename = String(screenshot.filename || "screenshot.png").replace(/[^\w.\-]/g, "_").slice(0, 100);
    const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
    if (!m) return json(400, { error: "Screenshot must be an image file" });
    const base64 = m[2];
    const approxBytes = Math.ceil(base64.length * 0.75);
    if (approxBytes > MAX_SCREENSHOT_BYTES) return json(400, { error: "Screenshot is too large (max ~4.5MB)" });
    attachments.push({ filename, content: base64 });
  }

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [toEmail],
        reply_to: email,
        subject: `${isCorrection ? "Correction" : "Site feedback"}${page ? ": " + page : ""}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">${isCorrection ? "New correction to a city guide" : "New site feedback"}</h2>
            <p style="margin:0 0 6px;color:#3a4a52">From: ${escapeHtml(name || "(no name given)")} &lt;${escapeHtml(email)}&gt;</p>
            ${page ? `<p style="margin:0 0 14px;color:#3a4a52">Page: <a href="${escapeHtml(page)}" style="color:#0e7c86">${escapeHtml(page)}</a></p>` : ""}
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 20px;white-space:pre-wrap">${escapeHtml(message)}</div>
            ${attachments.length ? `<p style="margin:0 0 14px;color:#3a4a52">Screenshot attached.</p>` : ""}
            ${isCorrection ? (reviewId
              ? `<p style="margin:0 0 20px"><a href="${escapeHtml(reviewUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">Review on the Admin page &rarr;</a></p>`
              : `<p style="margin:0 0 14px;color:#3a4a52"><strong>It was not saved for review</strong> (the database didn't accept it; has corrections-setup.sql been run?).</p>`) : ""}
            <p style="margin:0;font-size:13px;color:#8a9aa3">Sent from the feedback page on ${escapeHtml(SITE_URL || "Never Roam Alone")}. Reply to this email to respond directly.</p>
          </div>`,
        attachments: attachments.length ? attachments : undefined
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[feedback] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[feedback] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true });
  } catch (e) {
    console.error("[feedback] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Feedback failed to send" });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
