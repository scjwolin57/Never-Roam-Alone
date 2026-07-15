// Netlify serverless function: when a visitor submits an event through the
// "Submit an event" form on a city page (city.html calendar section), this
//   1. saves it as a PENDING event (published=false, pending=true) so it
//      shows up on the Admin page for review, and
//   2. emails the site owner a summary + a button that deep-links straight
//      to that submission on the Admin page (admin.html → Events tab).
// The owner then clicks "Add to calendar" or "Delete" there.
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY        - already set up for the other email functions
//   EVENT_SUBMIT_EMAIL    - where to send submissions (falls back to
//                           GUIDE_REQUEST_EMAIL if you don't set this one)
//   SUPABASE_URL          - already set (same as delete-account.js); needed
//   SUPABASE_SERVICE_KEY  - to save the pending event for review
//   SITE_URL              - optional; used for the review link + footer
//                           (defaults to https://neverroamalone.com)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, EVENT_SUBMIT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL } = process.env;
  const toEmail = EVENT_SUBMIT_EMAIL || GUIDE_REQUEST_EMAIL;
  console.log("[submit-event] env present:", {
    RESEND_API_KEY: !!RESEND_API_KEY,
    toEmail: !!toEmail
  });
  if (!RESEND_API_KEY || !toEmail) {
    console.error("[submit-event] STOP: missing env var (see booleans above).");
    return json(500, { error: "Server not configured for event submissions." });
  }

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }

  const city      = clip(p.city, 80);
  const name      = clip(p.name, 140);
  const location  = clip(p.location, 200);
  const mapLink   = rawUrl(p.mapLink);        // raw (validated) — escaped only when put in HTML
  const date      = clip(p.date, 10);         // YYYY-MM-DD
  const startTime = clip(p.startTime, 5);     // HH:MM
  const endTime   = clip(p.endTime, 5);
  const link      = rawUrl(p.link);
  const posterUrl = rawUrl(p.posterUrl);
  const submitter = clip(p.submitterName, 60);
  const subEmail  = clip(p.submitterEmail, 120);
  const website   = clip(p.website, 100);   // honeypot — hidden field, must stay empty
  const elapsedMs = Number(p.elapsedMs);    // ms between opening the form and submitting

  // --- spam guards (invisible to real visitors) ---
  // 1. Honeypot: a real person never sees or fills the hidden "website" field.
  //    Pretend success so the bot moves on, but save/email nothing.
  if (website) {
    console.warn("[submit-event] honeypot tripped — dropping silently.");
    return json(200, { sent: true });
  }
  // 2. Too-fast submit: bots post instantly; a person needs a few seconds.
  if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 2000) {
    console.warn("[submit-event] too-fast submit:", elapsedMs, "ms");
    return json(400, { sent: false, error: "That was a bit too quick — please try again." });
  }

  if (!city || !name || !date) {
    return json(400, { error: "Missing event name, city, or date." });
  }
  console.log("[submit-event] submission:", name, "in", city, "on", date);

  // 1. Save it as a PENDING event so it appears on the Admin page for review.
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  let reviewId = "";
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    // 3. Burst cap: if a flood of submissions arrives in under a minute, slow it
    //    down. Counts recent PENDING rows only (no personal data, no IP stored).
    try {
      const since = new Date(Date.now() - 60000).toISOString();
      const cr = await fetch(`${SUPABASE_URL}/rest/v1/city_events?select=id&pending=eq.true&created_at=gte.${encodeURIComponent(since)}`, {
        headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY }
      });
      if (cr.ok) {
        const recent = await cr.json();
        if (Array.isArray(recent) && recent.length >= 5) {
          console.warn("[submit-event] rate limit: too many pending in last 60s:", recent.length);
          return json(429, { sent: false, error: "We're getting a lot of submissions right now — please try again in a minute." });
        }
      }
    } catch (e) { /* if the check itself fails, don't block a genuine submission */ }
    try {
      const ir = await fetch(`${SUPABASE_URL}/rest/v1/city_events`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: "Bearer " + SUPABASE_SERVICE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify({
          city, name,
          location: location || null,
          map_link: mapLink || null,
          event_date: date,
          start_time: startTime || null,
          end_time: endTime || null,
          link: link || null,
          poster_url: posterUrl || null,
          published: false,
          pending: true
        })
      });
      if (ir.ok) {
        const created = await ir.json();
        reviewId = (created && created[0] && created[0].id) || "";
        console.log("[submit-event] saved pending event id:", reviewId);
      } else {
        console.error("[submit-event] pending insert failed HTTP", ir.status, (await ir.text()).slice(0, 300));
      }
    } catch (e) {
      console.error("[submit-event] pending insert threw:", (e && e.message) || e);
    }
  } else {
    console.warn("[submit-event] SUPABASE_URL / SUPABASE_SERVICE_KEY not set — emailing only, event not saved for review.");
  }
  const siteBase  = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const reviewUrl = escapeHtml(siteBase + "/admin.html?tab=events" + (reviewId ? "&review=" + encodeURIComponent(reviewId) : ""));

  const when = date + (startTime ? " · " + startTime + (endTime ? "–" + endTime : "") : "");
  const rows = [
    ["Event", name],
    ["City", city],
    ["Date & time", when],
    ["Location", location ? (mapLink ? `${escapeHtml(location)} — <a href="${escapeHtml(mapLink)}">map</a>` : escapeHtml(location)) : "—"],
    ["Event link", link ? `<a href="${escapeHtml(link)}">${escapeHtml(link)}</a>` : "—"],
    ["Submitted by", (submitter || subEmail) ? `${escapeHtml(submitter || "Anonymous")}${subEmail ? " &lt;" + escapeHtml(subEmail) + "&gt;" : ""}` : "Anonymous visitor"]
  ];
  const rowsHtml = rows.map(([k, v]) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#8a9aa3;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#1d2a32">${v}</td></tr>`
  ).join("");

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <onboarding@resend.dev>",
        to: [toEmail],
        subject: `Event submission: ${name} (${city})`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">New event submission</h2>
            <p style="margin:0 0 16px;color:#3a4a52">A visitor submitted an event. It's saved as <strong>pending</strong> — nothing shows on the site until you approve it.</p>
            <table style="border-collapse:collapse;font-size:15px;width:100%">${rowsHtml}</table>
            ${posterUrl ? `<div style="margin:20px 0 8px"><strong>Poster:</strong></div><a href="${escapeHtml(posterUrl)}"><img src="${escapeHtml(posterUrl)}" alt="Event poster" style="max-width:100%;border-radius:12px;border:1px solid #e3ddce"/></a>` : `<p style="margin:18px 0 0;color:#8a9aa3">No poster image was uploaded.</p>`}
            <p style="margin:24px 0 0"><a href="${reviewUrl}" style="display:inline-block;background:#556B2F;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:10px">Review this submission &rarr;</a></p>
            <p style="margin:8px 0 0;font-size:12px;color:#8a9aa3">Opens the Admin page &rarr; Events tab with this submission highlighted, where you can <strong>Add to calendar</strong> or <strong>Delete</strong> it.</p>
            <p style="margin:22px 0 0;font-size:13px;color:#8a9aa3">Sent from the ${escapeHtml(city)} city page on ${escapeHtml(siteBase)}.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[submit-event] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[submit-event] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true, id: reviewId });
  } catch (e) {
    console.error("[submit-event] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Request failed" });
  }
};

function clip(s, n) { return String(s == null ? "" : s).trim().slice(0, n); }
function rawUrl(s) {
  const u = clip(s, 500);
  // only allow http(s) links (kept raw for storage; escaped at each HTML use site)
  return /^https?:\/\//i.test(u) ? u : "";
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
