// Netlify serverless function: emails a question's author when someone
// replies to their question on Ask A Roamer.
//
// SECURITY: uses the Supabase SERVICE key (full database access) and the
// Resend API key — both live ONLY in Netlify environment variables:
//   SUPABASE_URL          - your Supabase project URL
//   SUPABASE_SERVICE_KEY  - Supabase "service_role" key (Settings → API)
//   RESEND_API_KEY        - from https://resend.com (free tier)
//   SITE_URL              - optional, e.g. https://neverroamalone.netlify.app
//
// The browser only sends the question id + a short reply preview; this
// function looks up the author's email itself, and only sends if the
// author has "email me when someone replies" turned on.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  // Log which config is present (booleans only — never log the secret values).
  console.log("[notify] env present:", {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_KEY: !!SUPABASE_SERVICE_KEY,
    RESEND_API_KEY: !!RESEND_API_KEY,
    SITE_URL: !!SITE_URL
  });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
    console.error("[notify] STOP: a required environment variable is missing (see booleans above).");
    return json(500, { error: "Server not configured for notifications." });
  }

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const questionId = String(payload.questionId || "").trim();
  const replyName = String(payload.replyName || "A fellow Roamer").slice(0, 40);
  const replyPreview = String(payload.replyPreview || "").slice(0, 240);
  console.log("[notify] request for questionId:", questionId, "| replyName:", replyName);
  if (!/^[0-9a-f-]{36}$/i.test(questionId)) { console.error("[notify] STOP: questionId is not a valid UUID:", questionId); return json(400, { error: "Bad question id" }); }

  const sbHeaders = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };

  try {
    // 1. look up the question and its author
    const qr = await fetch(`${SUPABASE_URL}/rest/v1/questions?id=eq.${questionId}&select=title,user_id,name`, { headers: sbHeaders });
    const qs = await qr.json();
    const q = Array.isArray(qs) && qs[0];
    console.log("[notify] question lookup:", { httpStatus: qr.status, found: !!q, hasAuthorAccount: !!(q && q.user_id) });
    if (!q) { console.error("[notify] STOP: no question row found for that id (RLS or wrong id?)."); return json(404, { error: "Question not found" }); }
    if (!q.user_id) { console.log("[notify] STOP: the question's author was NOT signed in — no account to email."); return json(200, { sent: false, reason: "author has no account" }); }

    // 2. author's email + notification preference
    const pr = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${q.user_id}&select=email,display_name,notify_replies`, { headers: sbHeaders });
    const ps = await pr.json();
    const p = Array.isArray(ps) && ps[0];
    console.log("[notify] profile lookup:", { httpStatus: pr.status, found: !!p, hasEmail: !!(p && p.email), recipient: p && p.email, notify_replies: p && p.notify_replies });
    if (!p || !p.email) { console.log("[notify] STOP: the author's profile has no email on file."); return json(200, { sent: false, reason: "no email on file" }); }
    if (p.notify_replies === false) { console.log("[notify] STOP: the author turned reply notifications OFF."); return json(200, { sent: false, reason: "notifications off" }); }

    // 3. send the email through Resend
    const link = (SITE_URL || "https://neverroamalone.netlify.app") + "/askaroamer.html";
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <onboarding@resend.dev>",
        to: [p.email],
        subject: `${replyName} replied to your question`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">You've got a reply, Roamer!</h2>
            <p style="margin:0 0 16px;color:#5b6b75">Your question on Ask A Roamer:</p>
            <p style="font-weight:bold;font-size:17px;margin:0 0 14px">&ldquo;${escapeHtml(q.title)}&rdquo;</p>
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 20px">
              <p style="margin:0 0 4px;font-weight:bold">${escapeHtml(replyName)} wrote:</p>
              <p style="margin:0;color:#3a4a52">${escapeHtml(replyPreview)}${replyPreview.length >= 240 ? "…" : ""}</p>
            </div>
            <a href="${link}" style="display:inline-block;background:#185e3f;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:24px">Read &amp; reply &rarr;</a>
            <p style="margin:24px 0 0;font-size:12px;color:#8a9aa3">You're getting this because reply notifications are on in your Never Roam Alone profile. Turn them off any time from the Ask A Roamer sidebar.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[notify] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error", detail: detail.slice(0, 300) });
    }
    const okBody = await er.text();
    console.log("[notify] SUCCESS: Resend accepted the email to", p.email, "| Resend response:", okBody.slice(0, 300));
    return json(200, { sent: true });
  } catch (e) {
    console.error("[notify] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Notification failed" });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
