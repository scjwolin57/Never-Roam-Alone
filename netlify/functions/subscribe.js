// Netlify serverless function: sends a "you're subscribed" confirmation
// email when someone joins the mailing list.
//
// The subscriber's email address is saved to the database in the browser
// (see mailing-list.js / auth.js). This function ONLY sends the friendly
// confirmation email, so the address is captured even if email sending
// is down or not configured yet.
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY   - already set up for reply notifications
//   SITE_URL         - optional, used in the email footer / links
//
// NOTE: the email below is a simple placeholder. Swap the HTML in
// confirmationEmail() for your real template whenever you're ready.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const email = String(payload.email || "").trim().toLowerCase().slice(0, 160);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "Valid email required" });

  const { RESEND_API_KEY, SITE_URL } = process.env;
  // If email sending isn't set up yet, don't fail the signup — the address
  // is already saved. Just report that no email went out.
  if (!RESEND_API_KEY) {
    console.log("[subscribe] RESEND_API_KEY not set — skipping confirmation email for", email);
    return json(200, { sent: false, reason: "email not configured" });
  }

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [email],
        subject: "You're on the list 🌍",
        html: confirmationEmail(SITE_URL)
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[subscribe] Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[subscribe] SUCCESS: confirmation email accepted for", email);
    return json(200, { sent: true });
  } catch (e) {
    console.error("[subscribe] threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Request failed" });
  }
};

// ---- Placeholder confirmation email. Replace the HTML with your own. ----
function confirmationEmail(siteUrl) {
  const home = siteUrl || "https://neverroamalone.com";
  return `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
      <h2 style="color:#185e3f;margin:0 0 10px">Welcome, Roamer! 🌍</h2>
      <p style="margin:0 0 14px;line-height:1.6">
        Thanks for joining the Never Roam Alone mailing list. You'll be the first
        to hear about new city guides, travel tips, and stories from the road.
      </p>
      <p style="margin:0 0 20px;line-height:1.6">
        No spam, ever — and you can unsubscribe any time.
      </p>
      <a href="${escapeHtml(home)}" style="display:inline-block;background:#185e3f;color:#fff;
        font-weight:bold;text-decoration:none;padding:11px 22px;border-radius:24px">Start exploring</a>
      <p style="margin:22px 0 0;font-size:13px;color:#8a9aa3">
        You're receiving this because you signed up at Never Roam Alone.
      </p>
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
