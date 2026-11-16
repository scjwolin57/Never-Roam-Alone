// Netlify serverless function: emails the site owner when a visitor
// requests a city guide for a place that doesn't have one yet
// (the "Request city guide" button on itinerary.html).
//
// Environment variables (Netlify → Site settings → Environment variables,
// scope "All scopes"):
//   RESEND_API_KEY        - already set up for reply notifications
//   GUIDE_REQUEST_EMAIL   - where to send requests (your email address)
//   SITE_URL              - optional, used in the email footer
//   SUPABASE_URL, SUPABASE_SERVICE_KEY - to save the request for the Admin page
//
// Also used by the homepage search's "Request destination" form (tripType
// "search") and the profile page's home-city request (tripType "home").

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, GUIDE_REQUEST_EMAIL, SITE_URL } = process.env;
  console.log("[request-guide] env present:", {
    RESEND_API_KEY: !!RESEND_API_KEY,
    GUIDE_REQUEST_EMAIL: !!GUIDE_REQUEST_EMAIL
  });
  if (!RESEND_API_KEY || !GUIDE_REQUEST_EMAIL) {
    console.error("[request-guide] STOP: missing env var (see booleans above).");
    return json(500, { error: "Server not configured for guide requests." });
  }

  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const place = String(payload.place || "").trim().slice(0, 80);
  const country = String(payload.country || "").trim().slice(0, 60);
  const tripType = payload.tripType === "past" ? "past" : payload.tripType === "home" ? "home" : payload.tripType === "search" ? "search" : "upcoming";
  const requesterName = String(payload.requesterName || "").trim().slice(0, 40);
  const requesterEmail = String(payload.requesterEmail || "").trim().slice(0, 120);
  if (!place) return json(400, { error: "No place given" });
  // A homepage search request comes from a form: country and a real email are
  // required, and an optional Google Maps link must be a Google Maps address.
  let mapsLink = "";
  if (tripType === "search") {
    if (!country) return json(400, { error: "No country given" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(requesterEmail)) return json(400, { error: "A valid email is required" });
    const raw = String(payload.mapsLink || "").trim().slice(0, 400);
    if (raw) {
      try {
        const u = new URL(raw), h = u.hostname.replace(/^www\./, "");
        const ok = u.protocol === "https:" && (h === "maps.app.goo.gl" || (h === "goo.gl" && u.pathname.startsWith("/maps")) ||
          h === "maps.google.com" || (/^google\.[a-z.]+$/.test(h) && u.pathname.startsWith("/maps")));
        if (!ok) return json(400, { error: "Not a Google Maps link" });
        mapsLink = u.href;
      } catch (e) { return json(400, { error: "Not a Google Maps link" }); }
    }
  }
  console.log("[request-guide] request for:", place, country ? "(" + country + ")" : "");

  // Save it as PENDING for the Admin page's "Destination requests" list
  // (destination-requests-setup.sql; Jeff, 2026-11-16). The email still goes
  // out if the save fails, and says so.
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  let reviewId = "";
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };
    try {
      const since = new Date(Date.now() - 60000).toISOString();
      const cr = await fetch(`${SUPABASE_URL}/rest/v1/destination_requests?select=id&created_at=gte.${encodeURIComponent(since)}`, { headers: svc });
      if (cr.ok) {
        const recent = await cr.json();
        if (Array.isArray(recent) && recent.length >= 5) return json(429, { sent: false, error: "We're getting a lot of requests right now. Please try again in a minute." });
      }
    } catch (e) { /* if the check itself fails, don't block a genuine request */ }
    try {
      const ir = await fetch(`${SUPABASE_URL}/rest/v1/destination_requests`, {
        method: "POST",
        headers: { ...svc, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({ place, country: country || null, maps_url: mapsLink || null, source: tripType,
          requester_name: requesterName || null, requester_email: requesterEmail || null, status: "pending" })
      });
      if (ir.ok) { const created = await ir.json(); reviewId = (created && created[0] && created[0].id) || ""; }
      else console.error("[request-guide] pending insert failed HTTP", ir.status, (await ir.text()).slice(0, 300));
    } catch (e) { console.error("[request-guide] pending insert threw:", (e && e.message) || e); }
  }
  const reviewUrl = siteBase + "/admin.html?tab=suggestions&destreview=" + encodeURIComponent(reviewId);

  const who = requesterName || requesterEmail
    ? `${escapeHtml(requesterName || "A Roamer")}${requesterEmail ? " &lt;" + escapeHtml(requesterEmail) + "&gt;" : ""}`
    : "An anonymous visitor";

  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [GUIDE_REQUEST_EMAIL],
        ...(tripType === "search" ? { reply_to: requesterEmail } : {}),
        subject: `${tripType === "search" ? "Destination request" : "City guide request"}: ${place}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 6px">${tripType === "search" ? "New destination request" : "New city guide request"}</h2>
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:14px 0 20px">
              <p style="margin:0 0 4px;font-size:18px;font-weight:bold">${escapeHtml(place)}${country ? ", " + escapeHtml(country) : ""}</p>
              <p style="margin:0;color:#3a4a52">Requested by: ${who}</p>
              ${mapsLink ? `<p style="margin:4px 0 0"><a href="${escapeHtml(mapsLink)}">Open their Google Maps link</a></p>` : ""}
              <p style="margin:4px 0 0;color:#3a4a52">${tripType === "search" ? "They <strong>searched</strong> for it on the homepage and found no match." : tripType === "home" ? "It's their <strong>home city</strong> (from their profile)." : `It's on their <strong>${tripType}</strong> trips list.`}</p>
            </div>
            ${reviewId ? `<p style="margin:0 0 20px"><a href="${escapeHtml(reviewUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">Open it on the Admin page &rarr;</a></p>`
                       : `<p style="margin:0 0 16px;color:#3a4a52"><strong>It was not saved to the Admin page</strong> (has destination-requests-setup.sql been run in Supabase?). The details are above.</p>`}
            <p style="margin:0;font-size:13px;color:#8a9aa3">Sent from the ${tripType === "search" ? "homepage search" : tripType === "home" ? "profile page" : "itinerary page"} on ${escapeHtml(SITE_URL || "Never Roam Alone")}.</p>
          </div>`
      })
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[request-guide] STOP: Resend rejected the email. HTTP", er.status, "detail:", detail.slice(0, 500));
      if (reviewId) return json(200, { sent: true });   // it is saved for the Admin page
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[request-guide] SUCCESS: Resend accepted the email.");
    return json(200, { sent: true });
  } catch (e) {
    console.error("[request-guide] STOP: threw an error:", (e && e.message) || e);
    return json(502, { sent: false, error: "Request failed" });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
