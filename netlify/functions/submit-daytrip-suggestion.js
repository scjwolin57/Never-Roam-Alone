// Netlify serverless function: a visitor sends the "Suggest a day trip" form
// from a city page that has no day trips (Jeff, 2026-09-30). Built from
// submit-suggestion.js. The suggestion is saved to the daytrip_suggestions
// table as PENDING (daytrip-suggestions-setup.sql) and the site owner is
// emailed a copy with a link to review it on the Admin page. Nothing reaches
// the guide from here: a suggested trip goes through the normal day-trip
// checks first and is added to day-trips.js, citydata and the sheet by hand.
//
//   POST { city, placeName, howToGet, distance (half|full), websiteUrl,
//          showProfile, contact, email, accessToken, website (honeypot), elapsedMs }
//
// A signed-in member sends their Supabase access token; the server checks it
// and stores their user id (and, if they agreed to be contacted, the email on
// their account). "Show my Roamer profile" only counts for a member. A visitor
// who is not signed in and agrees to be contacted must give an email.
//
// Environment variables (the same ones the other functions already use):
//   RESEND_API_KEY
//   SUGGESTION_SUBMIT_EMAIL - where submissions go (falls back to
//                             INSIGHT_SUBMIT_EMAIL, then GUIDE_REQUEST_EMAIL)
//   SITE_URL                - optional, used in links
//   SUPABASE_URL, SUPABASE_SERVICE_KEY - to save the pending suggestion and
//                             check the member's session

const DIST_LABEL = { half: "1.5 hours/half day", full: "3+ hours/full days" };

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, SUGGESTION_SUBMIT_EMAIL, INSIGHT_SUBMIT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const toEmail = SUGGESTION_SUBMIT_EMAIL || INSIGHT_SUBMIT_EMAIL || GUIDE_REQUEST_EMAIL;
  if (!RESEND_API_KEY || !toEmail) {
    console.error("[submit-daytrip-suggestion] STOP: missing RESEND_API_KEY or a destination email.");
    return json(500, { error: "Server not configured for suggestions." });
  }

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }

  const city       = clip(p.city, 80);
  const placeName  = clip(p.placeName, 160);
  const howToGet   = clip(p.howToGet, 1000);
  const distance   = String(p.distance || "");
  const websiteUrl = clip(p.websiteUrl, 500);
  const contact    = p.contact === true;
  let   showProfile = p.showProfile === true;
  let   email      = clip(p.email, 120);
  const website    = clip(p.website, 100);    // honeypot: hidden field, must stay empty
  const elapsedMs  = Number(p.elapsedMs);

  // --- spam guards (invisible to real visitors) ---
  if (website) return json(200, { sent: true });
  if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 2000) {
    return json(400, { sent: false, error: "That was a bit too quick. Please try again." });
  }

  // --- the fields ---
  if (!city) return json(400, { error: "Missing the city." });
  if (!placeName) return json(400, { error: "Please add the name of the place." });
  if (!howToGet) return json(400, { error: "Please say how to get there." });
  if (!DIST_LABEL[distance]) return json(400, { error: "Please choose how far it is each way." });
  if (websiteUrl && !isWebUrl(websiteUrl)) return json(400, { error: "The website link should start with http:// or https://" });

  // --- who is sending it: a signed-in member, checked server-side ---
  let userId = null, accountEmail = "";
  const token = String(p.accessToken || "").trim();
  if (token && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + token } });
      if (ur.ok) { const u = await ur.json(); userId = (u && u.id) || null; accountEmail = (u && u.email) || ""; }
    } catch (e) { /* treat as a guest */ }
  }
  if (!userId) showProfile = false;                 // only a member has a profile to show
  if (userId) email = accountEmail;                 // a member is reached at their account email
  if (contact && !userId) {
    if (!email) return json(400, { error: "Please add your email so we can contact you." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "Please check your email address." });
  }
  if (!contact) email = "";

  // --- save it as PENDING ---
  let reviewId = "";
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };
    try {
      const since = new Date(Date.now() - 60000).toISOString();
      const cr = await fetch(`${SUPABASE_URL}/rest/v1/daytrip_suggestions?select=id&status=eq.pending&created_at=gte.${encodeURIComponent(since)}`, { headers: svc });
      if (cr.ok) {
        const recent = await cr.json();
        if (Array.isArray(recent) && recent.length >= 5) {
          return json(429, { sent: false, error: "We're getting a lot of suggestions right now. Please try again in a minute." });
        }
      }
    } catch (e) { /* if the check itself fails, don't block a genuine suggestion */ }
    try {
      const ir = await fetch(`${SUPABASE_URL}/rest/v1/daytrip_suggestions`, {
        method: "POST",
        headers: { ...svc, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({
          city, place_name: placeName, how_to_get: howToGet, distance, website_url: websiteUrl || null,
          show_profile: showProfile, contact, email: email || null, user_id: userId, status: "pending"
        })
      });
      if (ir.ok) {
        const created = await ir.json();
        reviewId = (created && created[0] && created[0].id) || "";
      } else {
        console.error("[submit-daytrip-suggestion] pending insert failed HTTP", ir.status, (await ir.text()).slice(0, 300));
      }
    } catch (e) {
      console.error("[submit-daytrip-suggestion] pending insert threw:", (e && e.message) || e);
    }
  }
  const reviewUrl = siteBase + "/admin.html?tab=suggestions" + (reviewId ? "&tripreview=" + encodeURIComponent(reviewId) : "");
  const cityUrl = siteBase + "/city.html?city=" + encodeURIComponent(city);
  const who = userId ? "A signed-in member" + (showProfile ? " (show their Roamer profile)" : "") : (email ? escapeHtml(email) : "A visitor (no contact details)");
  const row = (k, v) => v ? `<tr><td style="padding:4px 12px 4px 0;color:#82755b;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:4px 0">${v}</td></tr>` : "";

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [toEmail],
        ...(email ? { reply_to: email } : {}),
        subject: `Day trip suggestion: ${placeName} from ${city}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#5c6933;margin:0 0 6px">New day trip suggestion</h2>
            <p style="margin:0 0 16px;color:#3a4a52">From <a href="${escapeHtml(cityUrl)}">${escapeHtml(city)}</a></p>
            <table style="border-collapse:collapse;font-size:15px;margin:0 0 16px">
              ${row("Place", escapeHtml(placeName))}
              ${row("Each way", escapeHtml(DIST_LABEL[distance]))}
              ${row("Website", websiteUrl ? `<a href="${escapeHtml(websiteUrl)}">${escapeHtml(websiteUrl)}</a>` : "")}
              ${row("From", who)}
              ${row("Contact", contact ? "Yes, by email" : "No")}
            </table>
            <div style="background:#f6f1e7;padding:12px 14px;margin:0 0 16px;white-space:pre-wrap"><b>How to get there</b><br>${escapeHtml(howToGet)}</div>
            <p style="margin:0 0 16px;color:#3a4a52">${reviewId ? "It's saved as <strong>pending</strong>. Nothing changes on the site until the trip passes the day-trip checks and you add it." : "<strong>It was not saved for review</strong> (the database didn't accept it; has daytrip-suggestions-setup.sql been run?). The details are above."}</p>
            ${reviewId ? `<p style="margin:0 0 20px"><a href="${escapeHtml(reviewUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">Review on the Admin page &rarr;</a></p>` : ""}
          </div>`
      })
    });
    if (!er.ok) {
      console.error("[submit-daytrip-suggestion] Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 500));
      if (reviewId) return json(200, { sent: true });
      return json(502, { sent: false, error: "Email service error" });
    }
    return json(200, { sent: true });
  } catch (e) {
    console.error("[submit-daytrip-suggestion] threw:", (e && e.message) || e);
    if (reviewId) return json(200, { sent: true });
    return json(502, { sent: false, error: "Request failed" });
  }
};

function isWebUrl(u) {
  try { const x = new URL(u); return (x.protocol === "https:" || x.protocol === "http:") && x.hostname.includes("."); } catch (e) { return false; }
}
function clip(s, n) { return String(s == null ? "" : s).trim().slice(0, n); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
