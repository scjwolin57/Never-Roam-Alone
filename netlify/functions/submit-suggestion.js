// Netlify serverless function: a visitor sends the "Suggest a place" form
// from the bottom of a neighborhood card on a city page (Where to stay /
// eat / coffee & takeaway / drink). The suggestion is saved to the
// place_suggestions table as PENDING (place-suggestions-setup.sql) and the
// site owner is emailed a copy with a link to review it on the Admin page.
// Nothing reaches the guide from here: a suggested venue goes through the
// normal hood-picks checks first, and approve-suggestion.js only records
// that it was published and thanks the person.
//
//   POST { city, hoodIdx, hoodName, section, kind, mapsUrl, websiteUrl, info,
//          contact, email, accessToken, website (honeypot), elapsedMs }
//
// A signed-in member sends their Supabase access token; the server checks
// it and stores their user id (their thank-you then goes to their Never Roam
// Alone inbox, and they earn the recommendation points). A visitor who is
// not signed in and wants to hear back must give an email.
//
// Environment variables (the same ones the other functions already use):
//   RESEND_API_KEY
//   SUGGESTION_SUBMIT_EMAIL - where submissions go (falls back to
//                             INSIGHT_SUBMIT_EMAIL, then GUIDE_REQUEST_EMAIL)
//   SITE_URL                - optional, used in links
//   SUPABASE_URL, SUPABASE_SERVICE_KEY - to save the pending suggestion and
//                             check the member's session

/* The listings each card offers, keyed as city.html keys them. The label is
   re-derived here, so what the visitor's browser sends is never trusted. */
const KINDS = {
  stay:  { "High-end": "Luxury", "Mid-range": "Comfort", "Budget": "Budget" },
  eat:   { local: "Local traditional", casual: "Casual dining", fine: "Fine dining" },
  cafes: { coffee: "Coffee shop", takeaway: "Takeaway", bakery: "Bakery / pastries" },
  bars:  { dive: "Dive / local bar", party: "Party bar", cocktail: "Cocktail bar", pub: "Pub / casual bar",
           cafe: "Coffee house", hangout: "Late-night hangout", mocktail: "Juice & mocktails" }
};
const SECTION_LABEL = { stay: "Where to stay", eat: "Where to eat", cafes: "Coffee & takeaway", bars: "Where to drink / go out" };

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, SUGGESTION_SUBMIT_EMAIL, INSIGHT_SUBMIT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const toEmail = SUGGESTION_SUBMIT_EMAIL || INSIGHT_SUBMIT_EMAIL || GUIDE_REQUEST_EMAIL;
  console.log("[submit-suggestion] env present:", { RESEND_API_KEY: !!RESEND_API_KEY, toEmail: !!toEmail, SUPABASE: !!(SUPABASE_URL && SUPABASE_SERVICE_KEY) });
  if (!RESEND_API_KEY || !toEmail) {
    console.error("[submit-suggestion] STOP: missing env var (see booleans above).");
    return json(500, { error: "Server not configured for suggestions." });
  }

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }

  const city       = clip(p.city, 80);
  const hoodName   = clip(p.hoodName, 120);
  const hoodIdx    = Number.isInteger(Number(p.hoodIdx)) && Number(p.hoodIdx) >= 0 && Number(p.hoodIdx) < 20 ? Number(p.hoodIdx) : null;
  const section    = String(p.section || "");
  const kind       = String(p.kind || "");
  const mapsUrl    = clip(p.mapsUrl, 1000);
  const websiteUrl = clip(p.websiteUrl, 500);
  const info       = clip(p.info, 1000);
  const contact    = p.contact === true;
  let   email      = clip(p.email, 120);
  const website    = clip(p.website, 100);    // honeypot: hidden field, must stay empty
  const elapsedMs  = Number(p.elapsedMs);     // ms between opening the form and sending it

  // --- spam guards (invisible to real visitors) ---
  if (website) {
    console.warn("[submit-suggestion] honeypot tripped, dropping silently.");
    return json(200, { sent: true });
  }
  if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 2000) {
    console.warn("[submit-suggestion] too-fast submit:", elapsedMs, "ms");
    return json(400, { sent: false, error: "That was a bit too quick. Please try again." });
  }

  // --- the fields ---
  if (!city || !hoodName) return json(400, { error: "Missing the city or neighborhood." });
  if (!KINDS[section]) return json(400, { error: "Unknown section." });
  const kindLabel = KINDS[section][kind];
  if (!kindLabel) return json(400, { error: "Please choose which listing this is for." });
  if (!mapsUrl) return json(400, { error: "Please add the Google Maps link." });
  if (!isMapsUrl(mapsUrl)) return json(400, { error: "That doesn't look like a Google Maps link. Open the place in Google Maps, tap Share, and paste the link." });
  if (websiteUrl && !isWebUrl(websiteUrl)) return json(400, { error: "The website link should start with http:// or https://" });

  // --- who is sending it: a signed-in member, checked server-side ---
  let userId = null;
  const token = String(p.accessToken || "").trim();
  if (token && SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + token } });
      if (ur.ok) { const u = await ur.json(); userId = (u && u.id) || null; }
    } catch (e) { /* treat as a guest */ }
  }
  if (userId) email = "";   // a member hears back in their inbox; their address stays in their account
  if (contact && !userId) {
    if (!email) return json(400, { error: "Please add your email so we can tell you when it's published." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "Please check your email address." });
  }
  if (!contact) email = "";
  console.log("[submit-suggestion] submission:", section, kind, "in", hoodName, "/", city, "| member:", !!userId, "| contact:", contact);

  // --- save it as PENDING ---
  let reviewId = "";
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };
    // Burst cap: a flood of suggestions in under a minute gets slowed down.
    try {
      const since = new Date(Date.now() - 60000).toISOString();
      const cr = await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions?select=id&status=eq.pending&created_at=gte.${encodeURIComponent(since)}`, { headers: svc });
      if (cr.ok) {
        const recent = await cr.json();
        if (Array.isArray(recent) && recent.length >= 5) {
          console.warn("[submit-suggestion] rate limit: too many pending in last 60s:", recent.length);
          return json(429, { sent: false, error: "We're getting a lot of suggestions right now. Please try again in a minute." });
        }
      }
    } catch (e) { /* if the check itself fails, don't block a genuine suggestion */ }
    try {
      const ir = await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions`, {
        method: "POST",
        headers: { ...svc, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({
          city, hood_idx: hoodIdx, hood_name: hoodName, section, kind, kind_label: kindLabel,
          maps_url: mapsUrl, website_url: websiteUrl || null, info: info || null,
          contact, email: email || null, user_id: userId, status: "pending"
        })
      });
      if (ir.ok) {
        const created = await ir.json();
        reviewId = (created && created[0] && created[0].id) || "";
        console.log("[submit-suggestion] saved pending suggestion id:", reviewId);
      } else {
        console.error("[submit-suggestion] pending insert failed HTTP", ir.status, (await ir.text()).slice(0, 300));
      }
    } catch (e) {
      console.error("[submit-suggestion] pending insert threw:", (e && e.message) || e);
    }
  } else {
    console.warn("[submit-suggestion] SUPABASE_URL / SUPABASE_SERVICE_KEY not set: emailing only, not saved for review.");
  }
  const reviewUrl = siteBase + "/admin.html?tab=suggestions" + (reviewId ? "&review=" + encodeURIComponent(reviewId) : "");
  const cityUrl = siteBase + "/city.html?city=" + encodeURIComponent(city);
  const who = userId ? "A signed-in member" : (email ? escapeHtml(email) : "A visitor (no contact details)");
  const row = (k, v) => v ? `<tr><td style="padding:4px 12px 4px 0;color:#82755b;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:4px 0">${v}</td></tr>` : "";

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [toEmail],
        ...(email ? { reply_to: email } : {}),
        subject: `Place suggestion (${kindLabel}): ${hoodName}, ${city}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#5c6933;margin:0 0 6px">New place suggestion</h2>
            <p style="margin:0 0 16px;color:#3a4a52">${escapeHtml(SECTION_LABEL[section])} &middot; ${escapeHtml(hoodName)} &middot; <a href="${escapeHtml(cityUrl)}">${escapeHtml(city)}</a></p>
            <table style="border-collapse:collapse;font-size:15px;margin:0 0 16px">
              ${row("For", escapeHtml(kindLabel))}
              ${row("Google Maps", `<a href="${escapeHtml(mapsUrl)}">${escapeHtml(mapsUrl)}</a>`)}
              ${row("Website", websiteUrl ? `<a href="${escapeHtml(websiteUrl)}">${escapeHtml(websiteUrl)}</a>` : "")}
              ${row("From", who)}
              ${row("Contact", contact ? (userId ? "Yes, by Never Roam Alone message" : "Yes, by email") : "No")}
            </table>
            ${info ? `<div style="background:#f6f1e7;padding:12px 14px;margin:0 0 16px;white-space:pre-wrap">${escapeHtml(info)}</div>` : ""}
            <p style="margin:0 0 16px;color:#3a4a52">${reviewId ? "It's saved as <strong>pending</strong>. Nothing changes on the site until the venue passes the hood-picks checks and you mark it published." : "<strong>It was not saved for review</strong> (the database didn't accept it), so it won't show on the Admin page. The details are above."}</p>
            ${reviewId ? `<p style="margin:0 0 20px"><a href="${escapeHtml(reviewUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">Review on the Admin page &rarr;</a></p>` : ""}
            <p style="margin:0;font-size:13px;color:#8a9aa3">Sent from the ${escapeHtml(city)} city page.</p>
          </div>`
      })
    });
    if (!er.ok) {
      console.error("[submit-suggestion] STOP: Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 500));
      if (reviewId) return json(200, { sent: true });   // it is saved; the email is only a heads-up
      return json(502, { sent: false, error: "Email service error" });
    }
    return json(200, { sent: true });
  } catch (e) {
    console.error("[submit-suggestion] STOP: threw an error:", (e && e.message) || e);
    if (reviewId) return json(200, { sent: true });
    return json(502, { sent: false, error: "Request failed" });
  }
};

/* Google Maps links: google.<tld>/maps/..., maps.google.<tld>/..., maps.app.goo.gl/..., goo.gl/maps/... */
function isMapsUrl(u) {
  let x;
  try { x = new URL(u); } catch (e) { return false; }
  if (x.protocol !== "https:" && x.protocol !== "http:") return false;
  const h = x.hostname.toLowerCase();
  if (h === "maps.app.goo.gl") return x.pathname.length > 1;
  if (h === "goo.gl") return x.pathname.startsWith("/maps");
  if (/^maps\.google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(h)) return true;
  if (/^(www\.)?google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(h)) return x.pathname.startsWith("/maps");
  return false;
}
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
