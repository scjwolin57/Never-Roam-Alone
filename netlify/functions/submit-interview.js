// Netlify serverless function: emails the site owner when a visitor submits
// the "Contribute your experience" form on a city page (city.html Insights
// section — Traveler's Take or Local's Perspective). Interview questions
// aren't written yet, so this just relays name/email/free-text response for
// manual review; nothing is published automatically.
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY        - already set up for the other email functions
//   INSIGHT_SUBMIT_EMAIL  - where submissions go (falls back to
//                           GUIDE_REQUEST_EMAIL if you don't set this one)
//   SITE_URL              - optional, used in the email footer

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, INSIGHT_SUBMIT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL } = process.env;
  const toEmail = INSIGHT_SUBMIT_EMAIL || GUIDE_REQUEST_EMAIL;
  console.log("[submit-interview] env present:", {
    RESEND_API_KEY: !!RESEND_API_KEY,
    toEmail: !!toEmail
  });
  if (!RESEND_API_KEY || !toEmail) {
    console.error("[submit-interview] STOP: missing env var (see booleans above).");
    return json(500, { error: "Server not configured for interview submissions." });
  }

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }

  const city     = clip(p.city, 80);
  const type     = p.type === "local" ? "local" : "traveler";
  const typeLabel = type === "local" ? "Local's Perspective" : "Traveler's Take";
  const name     = clip(p.name, 80);
  const email    = clip(p.email, 120);
  const response = clip(p.response, 4000);
  const website  = clip(p.website, 100);   // honeypot — hidden field, must stay empty
  const elapsedMs = Number(p.elapsedMs);   // ms between opening the form and submitting

  // --- spam guards (invisible to real visitors) ---
  // 1. Honeypot: a real person never sees or fills the hidden "website" field.
  //    Pretend success so the bot moves on, but email nothing.
  if (website) {
    console.warn("[submit-interview] honeypot tripped — dropping silently.");
    return json(200, { sent: true });
  }
  // 2. Too-fast submit: bots post instantly; a person needs a few seconds.
  if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 2000) {
    console.warn("[submit-interview] too-fast submit:", elapsedMs, "ms");
    return json(400, { sent: false, error: "That was a bit too quick — please try again." });
  }

  if (!city || !name || !email || !response) {
    return json(400, { error: "Missing name, email, city, or response." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "A valid email is required" });
  console.log("[submit-interview] submission:", typeLabel, "in", city, "from", email);

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [toEmail],
        reply_to: email,
        subject: `Interview submission (${typeLabel}): ${city}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">New Insights submission</h2>
            <p style="margin:0 0 6px;color:#3a4a52">${escapeHtml(typeLabel)} &middot; ${escapeHtml(city)}</p>
            <p style="margin:0 0 16px;color:#3a4a52">From: ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 20px;white-space:pre-wrap">${escapeHtml(response)}</div>
            <p style="margin:0;font-size:13px;color:#8a9aa3">Sent from the ${escapeHtml(city)} city page on ${escapeHtml(SITE_URL || "Never Roam Alone")}. Reply to this email to respond directly. Interview questions haven't been added yet — this is just the contact + free-text response.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[submit-interview] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[submit-interview] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true });
  } catch (e) {
    console.error("[submit-interview] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Request failed" });
  }
};

function clip(s, n) { return String(s == null ? "" : s).trim().slice(0, n); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
