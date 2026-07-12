// Netlify serverless function: emails a Roamer when another Roamer
// sends them a private message (messages.html).
//
// SECURITY: the browser only sends the new message's id plus the
// sender's own sign-in token. This function checks that the token
// really belongs to the message's sender, then looks up the
// recipient's email itself — the sender never sees it.
//
// ANTI-SPAM: an email only goes out for a NEW sender (their first-ever
// message to this person) or when that sender's previous message is
// more than 24 hours old. Back-and-forth chat within a day never
// triggers repeat emails. Recipients can also switch these emails off
// entirely on their profile page (allow_message_emails).
//
// Uses the same environment variables as notify.js:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  console.log("[message-alert] env present:", {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_KEY: !!SUPABASE_SERVICE_KEY,
    RESEND_API_KEY: !!RESEND_API_KEY,
    SITE_URL: !!SITE_URL
  });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
    console.error("[message-alert] STOP: a required environment variable is missing (see booleans above).");
    return json(500, { error: "Server not configured for message alerts." });
  }

  // The sender's own access token, sent by messages.html.
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return json(401, { error: "Not signed in." });

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const messageId = String(payload.messageId || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(messageId)) { console.error("[message-alert] STOP: messageId is not a valid UUID."); return json(400, { error: "Bad message id" }); }

  const svcHeaders = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };

  try {
    // 1. Whose token is this? (Supabase validates it for us.)
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + token }
    });
    if (!ur.ok) { console.error("[message-alert] STOP: token check failed, HTTP", ur.status); return json(401, { error: "Session invalid — sign in again." }); }
    const user = await ur.json();
    const uid = user && user.id;
    if (!uid) { console.error("[message-alert] STOP: token check returned no user id."); return json(401, { error: "Session invalid — sign in again." }); }

    // 2. Look up the message and make sure the caller really sent it.
    const mr = await fetch(`${SUPABASE_URL}/rest/v1/messages?id=eq.${messageId}&select=id,sender_id,recipient_id,sender_name,body,created_at`, { headers: svcHeaders });
    const ms = await mr.json();
    const m = Array.isArray(ms) && ms[0];
    console.log("[message-alert] message lookup:", { httpStatus: mr.status, found: !!m });
    if (!m) { console.error("[message-alert] STOP: no message row found for that id."); return json(404, { error: "Message not found" }); }
    if (m.sender_id !== uid) { console.error("[message-alert] STOP: caller is not the sender of this message."); return json(403, { error: "Not your message" }); }

    // 3. Recipient's email + their two switches (messages / alert emails).
    const pr = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${m.recipient_id}&select=email,display_name,allow_messages,allow_message_emails`, { headers: svcHeaders });
    const ps = await pr.json();
    const p = Array.isArray(ps) && ps[0];
    console.log("[message-alert] recipient lookup:", { httpStatus: pr.status, found: !!p, hasEmail: !!(p && p.email), allow_messages: p && p.allow_messages, allow_message_emails: p && p.allow_message_emails });
    if (!p || !p.email) { console.log("[message-alert] STOP: the recipient's profile has no email on file."); return json(200, { sent: false, reason: "no email on file" }); }
    if (p.allow_messages === false) { console.log("[message-alert] STOP: the recipient turned private messages OFF."); return json(200, { sent: false, reason: "messages off" }); }
    if (p.allow_message_emails === false) { console.log("[message-alert] STOP: the recipient turned message alert emails OFF."); return json(200, { sent: false, reason: "emails off" }); }

    // 4. Anti-spam throttle: look up this sender's PREVIOUS message to
    //    this recipient. Email only if there isn't one (brand-new sender)
    //    or it's more than 24 hours old — so an active back-and-forth
    //    never bombards anyone's inbox with repeat emails.
    const cr = await fetch(`${SUPABASE_URL}/rest/v1/messages?sender_id=eq.${m.sender_id}&recipient_id=eq.${m.recipient_id}&created_at=lt.${encodeURIComponent(m.created_at)}&select=created_at&order=created_at.desc&limit=1`, { headers: svcHeaders });
    const cs = await cr.json();
    const prev = Array.isArray(cs) && cs[0];
    if (prev && (new Date(m.created_at) - new Date(prev.created_at)) < 24 * 60 * 60 * 1000) {
      console.log("[message-alert] STOP: this sender already messaged them within the last 24 hours — no repeat email.");
      return json(200, { sent: false, reason: "recent conversation" });
    }

    // 5. Send the email through Resend.
    const senderName = String(m.sender_name || "A fellow Roamer").slice(0, 40);
    const preview = String(m.body || "").slice(0, 240);
    const link = (SITE_URL || "https://neverroamalone.com") + "/messages.html";
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <onboarding@resend.dev>",
        to: [p.email],
        subject: `${senderName} sent you a message`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">You've got a message, Roamer!</h2>
            <p style="margin:0 0 16px;color:#5b6b75">Someone reached out to you on Never Roam Alone:</p>
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 20px">
              <p style="margin:0 0 4px;font-weight:bold">${escapeHtml(senderName)} wrote:</p>
              <p style="margin:0;color:#3a4a52">${escapeHtml(preview)}${preview.length >= 240 ? "…" : ""}</p>
            </div>
            <a href="${link}" style="display:inline-block;background:#185e3f;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:24px">Read &amp; reply &rarr;</a>
            <p style="margin:24px 0 0;font-size:12px;color:#8a9aa3">You're getting this because message alert emails are switched on in your Never Roam Alone profile — at most one email per sender per day. You can turn these emails (or private messages entirely) off any time on your profile page.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[message-alert] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[message-alert] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true });
  } catch (e) {
    console.error("[message-alert] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Alert failed" });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
