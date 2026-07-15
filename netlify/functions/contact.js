// Netlify serverless function: emails the site owner when a visitor submits
// the "Contact us" form (contact.html).
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY   - already set up for reply notifications / guide requests
//   CONTACT_EMAIL    - where contact messages go (falls back to GUIDE_REQUEST_EMAIL)
//   SITE_URL         - optional, used in the email footer

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, CONTACT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL } = process.env;
  const toEmail = CONTACT_EMAIL || GUIDE_REQUEST_EMAIL;
  console.log("[contact] env present:", {
    RESEND_API_KEY: !!RESEND_API_KEY,
    toEmail: !!toEmail
  });
  if (!RESEND_API_KEY || !toEmail) {
    console.error("[contact] STOP: missing env var (see booleans above).");
    return json(500, { error: "Server not configured for contact messages." });
  }

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const name = String(payload.name || "").trim().slice(0, 80);
  const email = String(payload.email || "").trim().slice(0, 120);
  const message = String(payload.message || "").trim().slice(0, 4000);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "A valid email is required" });
  if (!message) return json(400, { error: "A message is required" });
  console.log("[contact] request from:", email, name ? "(" + name + ")" : "");

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [toEmail],
        reply_to: email,
        subject: `Contact form: ${name || email}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">New contact message</h2>
            <p style="margin:0 0 14px;color:#3a4a52">From: ${escapeHtml(name || "(no name given)")} &lt;${escapeHtml(email)}&gt;</p>
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 20px;white-space:pre-wrap">${escapeHtml(message)}</div>
            <p style="margin:0;font-size:13px;color:#8a9aa3">Sent from the contact page on ${escapeHtml(SITE_URL || "Never Roam Alone")}. Reply to this email to respond directly.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[contact] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[contact] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true });
  } catch (e) {
    console.error("[contact] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Message failed to send" });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
