// Netlify serverless function: read-only enrichment for one pending "Suggest
// a place" row on the Admin page (Suggestions tab). Jeff, 2026-09-25 — see
// _needs-attention/decisions.md same date.
//
// It does NOT publish anything and it does NOT touch the sheet, citydata or
// git. It only resolves the Google Maps link the visitor pasted, looks the
// venue up on Google Places, checks it against the hood-picks numeric bar
// (open, rating, review count, distance from the hood centre) and against
// the picks already on the guide (a simple name-match duplicate flag), and
// builds the exact `load_picks.py roamer ...` command for that venue so a
// person still has to run it — and still has to look at the result and use
// judgment (right venue, not a chain, note reads well, no duplicate) before
// anything goes in the sheet. That review step is deliberate: see CLAUDE.md
// §4.3 (source hierarchy, chain and safety checks) and §3 rule 2 (verify,
// then flag or remove) — this function does not decide, it only saves the
// person typing and one browser tab.
//
//   POST { id }
//   header Authorization: Bearer <admin access token>
//
// Environment variables:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY  - same as approve-suggestion.js
//   GOOGLE_MAPS_API_KEY                  - NOT set yet as of 2026-09-25; add
//                                          it in Netlify's site environment
//                                          variables (Site configuration ->
//                                          Environment variables). Without
//                                          it the function still resolves
//                                          the venue's name and coordinates
//                                          from the pasted Maps link and
//                                          still builds a command, just
//                                          without rating/reviews/place ID.
//   SITE_URL                             - optional; falls back to the
//                                          function's own deploy URL, used
//                                          to read the public citydata/*.json
//                                          files (never git, never the sheet).

const RATING_BAR = 4.2;
const REVIEWS_BAR = 100;   // the pipeline's default; towns under 100k and dive/party bars use 25 instead (CITY_SCHEMA.md) — noted, not auto-applied here
const HOOD_RADIUS_KM = 1.5;   // beyond this from the hood centre, flag "check the search-area file" rather than silently pass or fail

const KIND_LABEL = {
  stay:  { "High-end": "Luxury", "Mid-range": "Comfort", "Budget": "Budget" },
  eat:   { local: "Local traditional", casual: "Casual dining", fine: "Fine dining" },
  cafes: { coffee: "Coffee shop", takeaway: "Takeaway", bakery: "Bakery / pastries" },
  bars:  { dive: "Dive / local bar", party: "Party bar", cocktail: "Cocktail bar", pub: "Pub / casual bar",
           cafe: "Coffee house", hangout: "Late-night hangout", mocktail: "Juice & mocktails" }
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, GOOGLE_MAPS_API_KEY, SITE_URL, URL: DEPLOY_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return json(500, { error: "Server not configured." });
  const siteBase = (SITE_URL || DEPLOY_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };

  // Same admin check as approve-suggestion.js.
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const userToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!userToken) return json(401, { error: "Not signed in." });
  let admin = null;
  try {
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + userToken } });
    if (!ur.ok) return json(401, { error: "Session invalid. Sign in again." });
    admin = await ur.json();
  } catch (e) { return json(401, { error: "Couldn't verify your session." }); }
  if (!admin || !admin.email) return json(401, { error: "Session invalid. Sign in again." });
  let isAdmin = false;
  try {
    const ar = await fetch(`${SUPABASE_URL}/rest/v1/blog_admins?select=email`, { headers: svc });
    if (ar.ok) {
      const admins = await ar.json();
      isAdmin = Array.isArray(admins) && admins.some(a => String(a.email || "").toLowerCase() === admin.email.toLowerCase());
    }
  } catch (e) {}
  if (!isAdmin) return json(403, { error: "This account isn't an admin." });

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const id = String(p.id || "");
  if (!id) return json(400, { error: "No suggestion id." });

  let row;
  try {
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions?id=eq.${encodeURIComponent(id)}&select=*`, { headers: svc });
    if (!gr.ok) return json(502, { error: "Couldn't reach the suggestions store." });
    row = (await gr.json())[0];
  } catch (e) { return json(502, { error: "Couldn't reach the suggestions store." }); }
  if (!row) return json(404, { error: "That suggestion no longer exists." });

  const kindLabel = row.kind_label || (KIND_LABEL[row.section] && KIND_LABEL[row.section][row.kind]) || row.kind;

  // 1. Resolve the pasted Maps link to a name and coordinates (best effort; a short link that
  //    lands on an EU consent page can't be resolved server-side and is reported, not guessed).
  const resolved = await resolveMapsLink(row.maps_url);

  // 2. citydata (public, deployed — same files the city page itself fetches; never git, never the sheet).
  let slug = null, hoodCenter = null, existingNames = [];
  try {
    const idxRes = await fetch(`${siteBase}/citydata/_index.json`);
    if (idxRes.ok) {
      const idx = await idxRes.json();
      slug = (idx.slug && idx.slug[row.city]) || null;
    }
  } catch (e) {}
  if (slug) {
    try {
      const cdRes = await fetch(`${siteBase}/citydata/${slug}.json`);
      if (cdRes.ok) {
        const cd = await cdRes.json();
        const hi = Number(row.hood_idx);
        if (Number.isInteger(hi) && Array.isArray(cd.hood_geo) && cd.hood_geo[hi]) hoodCenter = cd.hood_geo[hi];
        const pull = (obj) => Array.isArray(obj) && Array.isArray(obj[hi]) ? obj[hi].map(x => (x && x.n) || x).filter(Boolean) : [];
        if (row.section === "stay") {
          existingNames = pull(cd.lodging).concat(pull(cd.roamer_picks && cd.roamer_picks.stay));
        } else {
          existingNames = pull(cd[row.section]).concat(pull(cd.roamer_picks && cd.roamer_picks[row.section]));
        }
      }
    } catch (e) {}
  }

  // 3. Google Places (New): Text Search for the resolved name near the hood, if we have a key and a name.
  let place = null, candidateCount = 0, placesError = null;
  const searchName = resolved.name;
  if (GOOGLE_MAPS_API_KEY && searchName) {
    try {
      const bias = hoodCenter ? { circle: { center: { latitude: hoodCenter[0], longitude: hoodCenter[1] }, radius: 2000 } }
                 : (resolved.lat != null ? { circle: { center: { latitude: resolved.lat, longitude: resolved.lng }, radius: 2000 } } : undefined);
      const body = { textQuery: `${searchName}, ${row.city}` };
      if (bias) body.locationBias = bias;
      const pr = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.businessStatus,places.formattedAddress,places.location,places.priceLevel,places.googleMapsUri"
        },
        body: JSON.stringify(body)
      });
      if (pr.ok) {
        const pd = await pr.json();
        const places = Array.isArray(pd.places) ? pd.places : [];
        candidateCount = places.length;
        if (places.length) place = places[0];
      } else {
        placesError = `Places API HTTP ${pr.status}`;
      }
    } catch (e) { placesError = (e && e.message) || String(e); }
  }

  // 4. Checks (facts, not verdicts — a human still reads these and decides).
  const checks = {};
  if (place) {
    checks.open = place.businessStatus === "OPERATIONAL" ? "pass"
      : place.businessStatus ? `Google shows this as ${place.businessStatus}` : "unknown";
    checks.rating = typeof place.rating === "number"
      ? (place.rating >= RATING_BAR ? `pass (${place.rating})` : `${place.rating} — below ${RATING_BAR}; check this city's median before rejecting`)
      : "no rating on file";
    checks.reviews = typeof place.userRatingCount === "number"
      ? (place.userRatingCount >= REVIEWS_BAR ? `pass (${place.userRatingCount})` : `${place.userRatingCount} — below ${REVIEWS_BAR}; 25 may apply for a small town or a dive/party bar`)
      : "no review count on file";
    if (hoodCenter && place.location) {
      const km = haversineKm(hoodCenter[0], hoodCenter[1], place.location.latitude, place.location.longitude);
      checks.distance = km <= HOOD_RADIUS_KM ? `pass (${km.toFixed(2)} km from the hood centre)` : `${km.toFixed(2)} km from the hood centre — check the hood's search-area file before using`;
    }
  } else {
    checks.open = checks.rating = checks.reviews = GOOGLE_MAPS_API_KEY ? "no Google Places match — check the Maps link by hand" : "GOOGLE_MAPS_API_KEY isn't set on Netlify yet";
  }
  const finalName = (place && place.displayName && place.displayName.text) || resolved.name || "";
  const dupe = finalName ? findDuplicate(finalName, existingNames) : null;
  if (dupe) checks.duplicate = `possibly already a pick: "${dupe}"`;

  // 5. A ready-to-run command. Still needs a person to read the checks above, confirm the venue and
  //    the note, and run it (or fix it) themselves — see the note in the header of this file.
  let command = null;
  if (slug && finalName) {
    const hn = Number(row.hood_idx) + 1;
    const noteSource = (row.info || "").trim();
    const note = noteSource ? clip(noteSource, 90) : "";
    const parts = ["python3 _guidebuild/hoodpicks/load_picks.py roamer", slug, String(hn), row.section, row.kind, q(finalName)];
    if (place && place.id) parts.push("--pid", place.id);
    if (note) parts.push("--note", q(note));
    if (row.user_id) parts.push("--by", row.user_id);
    const src = (place && place.googleMapsUri) || row.maps_url;
    if (src) parts.push("--source", q(src));
    command = parts.join(" ");
  }

  return json(200, {
    row: { id: row.id, city: row.city, hoodName: row.hood_name, hoodIdx: row.hood_idx, section: row.section, kind: row.kind, kindLabel },
    resolved: { url: resolved.url, name: resolved.name, lat: resolved.lat, lng: resolved.lng, blocked: !!resolved.blocked, error: resolved.error || null },
    place: place ? {
      id: place.id, name: (place.displayName && place.displayName.text) || null, rating: place.rating ?? null,
      userRatingCount: place.userRatingCount ?? null, businessStatus: place.businessStatus || null,
      formattedAddress: place.formattedAddress || null, googleMapsUri: place.googleMapsUri || null, priceLevel: place.priceLevel || null
    } : null,
    candidateCount, placesError, apiKeyConfigured: !!GOOGLE_MAPS_API_KEY,
    slugFound: !!slug, checks, command
  });
};

function findDuplicate(name, existing) {
  const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const n = norm(name);
  if (!n) return null;
  for (const e of existing) {
    const en = norm(e);
    if (!en) continue;
    if (en === n || en.includes(n) || n.includes(en)) return e;
  }
  return null;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Follow the pasted link to its real Google Maps URL and pull a venue name and coordinates out of
   it — no API call, just reading the URL Google redirects to. A maps.app.goo.gl link that lands on
   an EU consent page instead of a maps.google.* page can't be resolved this way; reported, not guessed. */
async function resolveMapsLink(url) {
  if (!url) return { url: null, name: null, lat: null, lng: null };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      redirect: "follow", signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15", "Accept-Language": "en" }
    });
    const finalUrl = res.url || url;
    let host = ""; try { host = new URL(finalUrl).hostname; } catch (e) {}
    if (host.includes("consent.google")) return { url: finalUrl, name: null, lat: null, lng: null, blocked: true };
    const nameMatch = finalUrl.match(/\/maps\/place\/([^/@]+)/);
    const name = nameMatch ? decodeURIComponent(nameMatch[1]).replace(/\+/g, " ") : null;
    const coordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const lat = coordMatch ? parseFloat(coordMatch[1]) : null;
    const lng = coordMatch ? parseFloat(coordMatch[2]) : null;
    return { url: finalUrl, name, lat, lng };
  } catch (e) {
    return { url: null, name: null, lat: null, lng: null, error: (e && e.message) || String(e) };
  } finally { clearTimeout(timer); }
}

function clip(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s; }
function q(s) { return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ") + '"'; }
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
