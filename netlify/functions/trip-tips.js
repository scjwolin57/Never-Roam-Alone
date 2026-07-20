// Netlify serverless function: email a signed-in Roamer a "trip tips"
// summary for one of their upcoming trips (the "Email me tips" checkbox
// on itinerary.html).
//
// The browser gathers the per-city content (taglines, day trips, getting
// around, events) from the site's own data files and sends it here as
// structured JSON. This function:
//   • verifies the caller's session and that the trip is really theirs,
//   • only ever emails the caller's OWN address (so it can't be abused
//     to email anyone else),
//   • allows at most one tips email per trip per day (tips_sent_at).
//
// POST { tripId, tripName, stops:[{ city, country, arrive, depart, hasGuide,
//        tagline, transit:{hours,pay}, dayTrips:[{name,blurb}], events:[{name,when,location}] }] }
//
// Environment variables (same as the other functions):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
    return json(500, { error: "Server not configured for email sending." });
  }
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };

  // ---------- who's asking? ----------
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const userToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!userToken) return json(401, { error: "Not signed in." });
  let userId = "", userEmail = "";
  try {
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + userToken }
    });
    if (!ur.ok) return json(401, { error: "Session invalid — sign in again." });
    const u = await ur.json();
    userId = (u && u.id) || ""; userEmail = (u && u.email) || "";
  } catch (e) { return json(401, { error: "Couldn't verify your session." }); }
  if (!userId || !userEmail) return json(401, { error: "Session invalid — sign in again." });

  // ---------- the trip must be theirs, with tips turned on ----------
  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const tripId = String(p.tripId || "");
  if (!/^[0-9a-f-]{36}$/i.test(tripId)) return json(400, { error: "Bad trip id." });
  let trip;
  try {
    const tr = await fetch(`${SUPABASE_URL}/rest/v1/itineraries?id=eq.${encodeURIComponent(tripId)}&select=id,user_id,name,receive_tips,tips_sent_at`, { headers: svc });
    const trips = tr.ok ? await tr.json() : [];
    trip = Array.isArray(trips) && trips[0];
  } catch (e) { return json(502, { error: "Couldn't look up the trip." }); }
  if (!trip) return json(404, { error: "Trip not found." });
  if (trip.user_id !== userId) return json(403, { error: "That trip isn't yours." });
  if (trip.receive_tips === false) return json(400, { error: "Tips are switched off for this trip." });
  if (trip.tips_sent_at && (Date.now() - Date.parse(trip.tips_sent_at)) < 24 * 3600 * 1000) {
    return json(429, { error: "Tips for this trip were already emailed in the last day — check your inbox (and spam)." });
  }

  // ---------- sanitize the content the browser gathered ----------
  const clip = (v, n) => String(v == null ? "" : v).slice(0, n);
  const stops = (Array.isArray(p.stops) ? p.stops : []).slice(0, 20).map(s => ({
    city: clip(s.city, 80), country: clip(s.country, 60),
    arrive: clip(s.arrive, 20), depart: clip(s.depart, 20),
    hasGuide: !!s.hasGuide, tagline: clip(s.tagline, 300),
    transit: s.transit ? { hours: clip(s.transit.hours, 400), pay: clip(s.transit.pay, 400) } : null,
    dayTrips: (Array.isArray(s.dayTrips) ? s.dayTrips : []).slice(0, 3)
      .map(d => ({ name: clip(d.name, 120), blurb: clip(d.blurb, 300) })),
    events: (Array.isArray(s.events) ? s.events : []).slice(0, 5)
      .map(ev => ({ name: clip(ev.name, 140), when: clip(ev.when, 60), location: clip(ev.location, 200) }))
  })).filter(s => s.city);
  if (!stops.length) return json(400, { error: "The trip has no cities yet — add a stop first." });
  const tripName = clip(p.tripName || trip.name || "your trip", 80);

  // ---------- build + send the email ----------
  const er = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
    body: JSON.stringify({
      from: "Never Roam Alone <hello@neverroamalone.com>",
      to: [userEmail],
      subject: `Trip tips for ${tripName} 🧭`,
      html: tipsEmail(tripName, stops, siteBase)
    })
  });
  if (!er.ok) {
    const detail = await er.text();
    console.error("[trip-tips] Resend rejected HTTP", er.status, detail.slice(0, 300));
    return json(502, { error: "Email service error." });
  }

  // remember we sent it (best-effort)
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/itineraries?id=eq.${encodeURIComponent(tripId)}`, {
      method: "PATCH", headers: svc, body: JSON.stringify({ tips_sent_at: new Date().toISOString() })
    });
  } catch (e) { console.error("[trip-tips] couldn't stamp tips_sent_at:", (e && e.message) || e); }

  console.log(`[trip-tips] sent "${tripName}" (${stops.length} stops) to ${userEmail}`);
  return json(200, { sent: true, stops: stops.length });
};

// ---- the email itself -------------------------------------------------
function tipsEmail(tripName, stops, siteBase) {
  const fmtDates = s => {
    if (s.arrive && s.depart) return `${s.arrive} &rarr; ${s.depart}`;
    return s.arrive || s.depart || "";
  };
  const sections = stops.map((s, i) => {
    const guideUrl = siteBase + "/city.html?city=" + encodeURIComponent(s.city);
    const bits = [];
    if (s.tagline) bits.push(`<p style="margin:0 0 12px;color:#3a4a52;line-height:1.6;font-style:italic">${escapeHtml(s.tagline)}</p>`);
    if (s.transit && (s.transit.hours || s.transit.pay)) {
      bits.push(`<p style="margin:0 0 4px;font-weight:bold;color:#2b2417">Getting around</p>
        <p style="margin:0 0 12px;color:#3a4a52;line-height:1.6">${escapeHtml(s.transit.hours)}${s.transit.hours && s.transit.pay ? " " : ""}${escapeHtml(s.transit.pay)}</p>`);
    }
    if (s.dayTrips.length) {
      bits.push(`<p style="margin:0 0 4px;font-weight:bold;color:#2b2417">Day trip ideas</p>` +
        s.dayTrips.map(d => `<p style="margin:0 0 8px;color:#3a4a52;line-height:1.55">&bull; <strong>${escapeHtml(d.name)}</strong>${d.blurb ? " — " + escapeHtml(d.blurb) : ""}</p>`).join("") );
    }
    if (s.events.length) {
      bits.push(`<p style="margin:8px 0 4px;font-weight:bold;color:#2b2417">While you're there</p>` +
        s.events.map(ev => `<p style="margin:0 0 8px;color:#3a4a52;line-height:1.55">&bull; <strong>${escapeHtml(ev.name)}</strong>${ev.when ? " — " + escapeHtml(ev.when) : ""}${ev.location ? " · " + escapeHtml(ev.location) : ""}</p>`).join("") );
    }
    const guideBtn = s.hasGuide
      ? `<a href="${escapeHtml(guideUrl)}" style="display:inline-block;background:#556B2F;color:#ffffff;text-decoration:none;font-weight:bold;padding:9px 18px;border-radius:20px;font-size:14px">Open the ${escapeHtml(s.city)} guide &rarr;</a>`
      : `<p style="margin:0;font-size:13px;color:#8a9aa3">We don't have a full guide for ${escapeHtml(s.city)} yet — it's on the list!</p>`;
    return `
      <div style="background:#f6f1e7;border-radius:12px;padding:18px 20px;margin:0 0 18px">
        <p style="margin:0 0 2px;font-family:monospace;font-size:11px;letter-spacing:.14em;color:#a8482a;text-transform:uppercase">Stop ${i + 1}${fmtDates(s) ? " &middot; " + fmtDates(s) : ""}</p>
        <h2 style="font-family:Georgia,serif;color:#185e3f;margin:0 0 10px;font-size:22px">${escapeHtml(s.city)}${s.country ? `, ${escapeHtml(s.country)}` : ""}</h2>
        ${bits.join("")}
        <div style="margin-top:12px">${guideBtn}</div>
      </div>`;
  }).join("");

  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:28px 24px;color:#1d2a32">
    <p style="font-family:monospace;text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:#556B2F;margin:0 0 6px">Never Roam Alone</p>
    <h1 style="font-family:Georgia,serif;color:#2b2417;margin:0 0 6px;font-size:26px">Tips for ${escapeHtml(tripName)}</h1>
    <p style="margin:0 0 22px;color:#5b6b75;line-height:1.6">Here's a quick rundown of every stop on your route — the essentials, some day-trip ideas, and what's on while you're in town.</p>
    ${sections}
    <hr style="border:none;border-top:1px solid #e4dcc8;margin:10px 0 16px">
    <p style="margin:0;font-size:12px;color:#8a9aa3;line-height:1.6">
      You asked for these tips with the &ldquo;Email me tips&rdquo; box on your
      <a href="${escapeHtml(siteBase + "/itinerary.html")}" style="color:#8a9aa3">trip planner</a> —
      untick it there any time. &middot; <a href="${escapeHtml(siteBase)}" style="color:#8a9aa3">${escapeHtml(siteBase.replace(/^https?:\/\//, ""))}</a>
    </p>
  </div>`;
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
