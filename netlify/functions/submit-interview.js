// Netlify serverless function: a visitor submits the "Share your experience"
// / "Share your insight" form on a city page (city.html Insights section —
// Traveler's Take or Local's Perspective). The interview is saved to the
// city_insights table as PENDING (city-insights-setup.sql) and the site owner
// is emailed a copy with a link to review and edit it on the Admin page.
// Nothing is published automatically: approve-insight.js publishes it. Types whose interview
// questions are written send `answers` ([{q, a}], answered questions only);
// types still waiting on questions send a single free-text `response`.
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY        - already set up for the other email functions
//   INSIGHT_SUBMIT_EMAIL  - where submissions go (falls back to
//                           GUIDE_REQUEST_EMAIL if you don't set this one)
//   SITE_URL              - optional, used in the email footer and links
//   SUPABASE_URL, SUPABASE_SERVICE_KEY - to save the pending interview. If
//                           they're missing the email still goes out, but
//                           there is nothing to approve on the Admin page.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, INSIGHT_SUBMIT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
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
  // Interview answers: [{ q, a }], only the questions they actually answered.
  const answers  = (Array.isArray(p.answers) ? p.answers : [])
    .slice(0, 30)
    .map(x => ({ q: clip(x && x.q, 300), a: clip(x && x.a, 1200) }))
    .filter(x => x.q && x.a);
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

  if (!city || !name || !email || (!response && !answers.length)) {
    return json(400, { error: "Missing name, email, city, or any answer." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "A valid email is required" });
  console.log("[submit-interview] submission:", typeLabel, "in", city, "from", email, "| answers:", answers.length);

  // Save it as a PENDING interview so it appears on the Admin page for review.
  let reviewId = "";
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };
    // 3. Burst cap: a flood of submissions in under a minute gets slowed down.
    try {
      const since = new Date(Date.now() - 60000).toISOString();
      const cr = await fetch(`${SUPABASE_URL}/rest/v1/city_insights?select=id&pending=eq.true&created_at=gte.${encodeURIComponent(since)}`, { headers: svc });
      if (cr.ok) {
        const recent = await cr.json();
        if (Array.isArray(recent) && recent.length >= 5) {
          console.warn("[submit-interview] rate limit: too many pending in last 60s:", recent.length);
          return json(429, { sent: false, error: "We're getting a lot of submissions right now — please try again in a minute." });
        }
      }
    } catch (e) { /* if the check itself fails, don't block a genuine submission */ }
    try {
      const ir = await fetch(`${SUPABASE_URL}/rest/v1/city_insights`, {
        method: "POST",
        headers: { ...svc, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({ city, type, name, email, answers, response: response || null, published: false, pending: true })
      });
      if (ir.ok) {
        const created = await ir.json();
        reviewId = (created && created[0] && created[0].id) || "";
        console.log("[submit-interview] saved pending interview id:", reviewId);
      } else {
        console.error("[submit-interview] pending insert failed HTTP", ir.status, (await ir.text()).slice(0, 300));
      }
    } catch (e) {
      console.error("[submit-interview] pending insert threw:", (e && e.message) || e);
    }
  } else {
    console.warn("[submit-interview] SUPABASE_URL / SUPABASE_SERVICE_KEY not set — emailing only, interview not saved for review.");
  }
  const reviewUrl = siteBase + "/admin.html?tab=insights" + (reviewId ? "&review=" + encodeURIComponent(reviewId) : "");

  const answersHtml = answers.map(({ q, a }, i) =>
    `<div style="margin:0 0 18px">
       <p style="margin:0 0 5px;color:#82755b;font-size:13px;letter-spacing:.06em;text-transform:uppercase">Q${i + 1}</p>
       <p style="margin:0 0 7px;font-weight:bold;color:#1d2a32">${escapeHtml(q)}</p>
       <div style="background:#f6f1e7;border-radius:12px;padding:12px 14px;white-space:pre-wrap">${escapeHtml(a)}</div>
     </div>`
  ).join("");

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
            <p style="margin:0 0 16px;color:#3a4a52">${reviewId ? "It's saved as <strong>pending</strong>. Nothing shows on the site until you approve it." : "<strong>It was not saved for review</strong> (the database didn't accept it), so it can't be approved from Admin. The answers are below."}</p>
            ${answers.length
              ? `<p style="margin:0 0 14px;color:#3a4a52">Answered ${answers.length} question${answers.length === 1 ? "" : "s"}:</p>${answersHtml}`
              : `<div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 20px;white-space:pre-wrap">${escapeHtml(response)}</div>`}
            ${reviewId ? `<p style="margin:24px 0 20px"><a href="${escapeHtml(reviewUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">Review, edit &amp; approve &rarr;</a></p>` : ""}
            <p style="margin:0;font-size:13px;color:#8a9aa3">Sent from the ${escapeHtml(city)} city page on ${escapeHtml(SITE_URL || "Never Roam Alone")}. Reply to this email to respond directly.</p>
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
