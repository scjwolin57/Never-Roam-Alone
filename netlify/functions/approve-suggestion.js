// Netlify serverless function: mark a place suggestion as PUBLISHED once the
// suggested venue is on the city guide (it gets there through the normal
// hood-picks checks and the sheet, never straight from the suggestion), and
// thank the person who sent it. Once.
//
//   POST { id }
//   header Authorization: Bearer <admin access token>
//
// Called by the Admin page's Suggestions tab "Mark published" button. The
// caller must be on the blog_admins list. Declining and deleting happen on
// the Admin page directly (admin-only policies in place-suggestions-setup.sql);
// only publishing needs this function, because it sends the thank-you and
// awards points.
//
// The thank-you, only if they ticked "contact me":
//   - a signed-in member gets a message in their Never Roam Alone inbox
//     (messages.html), sent from the approving admin's account under the
//     name "Never Roam Alone". The response carries the message id so the
//     Admin page can ask message-alert.js for the usual new-message email.
//     If the member has switched messages off, they get an email instead.
//   - a visitor who was not signed in gets an email.
// A signed-in member also earns the recommendation points
// (contribution_events, contribution-points-setup.sql), whether or not
// they asked to be contacted.
//
// Environment variables (same ones the other functions already use):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

const { award } = require("./_shared/contrib");   // points (5) + vote keys for the member who sent it
const { seeUrl } = require("./_shared/seelink");  // link straight to the pick on the guide

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return json(500, { error: "Server not configured." });
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };

  // Who is calling, and are they an admin?
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const userToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!userToken) return json(401, { error: "Not signed in." });
  let admin = null;
  try {
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + userToken } });
    if (!ur.ok) return json(401, { error: "Session invalid. Sign in again." });
    admin = await ur.json();
  } catch (e) { return json(401, { error: "Couldn't verify your session." }); }
  if (!admin || !admin.email || !admin.id) return json(401, { error: "Session invalid. Sign in again." });
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

  // Load it.
  let row;
  try {
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions?id=eq.${encodeURIComponent(id)}&select=*`, { headers: svc });
    if (!gr.ok) return json(502, { error: "Couldn't reach the suggestions store." });
    row = (await gr.json())[0];
  } catch (e) { return json(502, { error: "Couldn't reach the suggestions store." }); }
  if (!row) return json(404, { error: "That suggestion no longer exists." });

  // Replace (Admin's Append / Replace choice, 2026-10-20): the pick it replaces must be off the live guide first.
  if (row.apply_mode === "replace" && row.replace_target) {
    let still = false;
    try { still = await stillOnGuide(siteBase, row); } catch (e) { console.error("[approve-suggestion] replace check:", (e && e.message) || e); }
    if (still) return json(409, { error: `This suggestion is set to replace "${row.replace_target}", which is still on the live ${row.city} guide. Run the add command with --replace, push, wait for the deploy, then mark it published. Or switch the suggestion to Append.` });
  }

  // Publish.
  try {
    const ur = await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH", headers: svc,
      body: JSON.stringify({ status: "published", published_at: row.published_at || new Date().toISOString() })
    });
    if (!ur.ok) return json(502, { error: "Couldn't mark it published (HTTP " + ur.status + ")." });
  } catch (e) { return json(502, { error: "Couldn't mark it published." }); }
  console.log("[approve-suggestion] published", id, row.section, row.kind, "in", row.hood_name, "/", row.city, "by", admin.email);

  // Credit a signed-in member, once: 5 points, and the vote keys of their pick(s) on the guide, so
  // thumbs up / down on it count toward their Trusted Traveler Rating. The pick reaches the guide
  // through load_picks.py before this button is pressed, so its final name and neighborhood are read
  // from the live city file: the rows in roamer_picks[section][hood] that carry this member's id.
  let points = false, targets = [];
  if (row.user_id) {
    targets = await (row.section === "food" ? foodPickKeys : roamerPickKeys)(siteBase, row).catch(e => { console.error("[approve-suggestion] pick keys:", (e && e.message) || e); return []; });
    const credit = await award({ url: SUPABASE_URL, key: SUPABASE_SERVICE_KEY, userId: row.user_id, kind: "recommendation",
                                 sourceTable: "place_suggestions", sourceId: id, city: row.city, targets });
    points = credit.points;
    if (!targets.length) console.warn("[approve-suggestion] no matching pick found on the", row.city, "guide yet; points given, rating link not made");
  }

  // Thank them, once, only if they asked.
  let notified = false, via = null, messageId = null;
  if (row.contact && !row.notified) {
    const cityUrl = await pickSeeUrl(siteBase, row, targets).catch(() => seeUrl(siteBase, row.city));
    const what = row.section === "food"
      ? `${row.place_name || "place"} (for ${row.kind_label || "a local dish"})`
      : `${row.kind_label || "place"} in ${row.hood_name}, ${row.city}`;
    let emailTo = row.email || "";

    if (row.user_id && row.user_id !== admin.id) {
      let prof = null;
      try {
        const pr = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(row.user_id)}&select=email,display_name,allow_messages`, { headers: svc });
        prof = pr.ok ? (await pr.json())[0] : null;
      } catch (e) {}
      if (prof && prof.allow_messages !== false) {
        try {
          const mr = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
            method: "POST", headers: { ...svc, Prefer: "return=representation" },
            body: JSON.stringify({
              sender_id: admin.id, recipient_id: row.user_id,
              sender_name: "Never Roam Alone", recipient_name: prof.display_name || null,
              body: `Thank you for your suggestion! The ${what} you suggested is now on the ${row.city} guide: ${cityUrl}\n\nThanks for helping other travelers.\nNever Roam Alone`
            })
          });
          if (mr.ok) {
            const m = await mr.json();
            messageId = (m && m[0] && m[0].id) || null;
            notified = true; via = "message";
          } else {
            console.error("[approve-suggestion] message insert failed HTTP", mr.status, (await mr.text()).slice(0, 300));
          }
        } catch (e) { console.error("[approve-suggestion] message threw:", (e && e.message) || e); }
      }
      if (!notified && prof && prof.email) emailTo = prof.email;   // messages switched off (or failed): fall back to email
    }

    if (!notified && emailTo && RESEND_API_KEY) {
      try {
        const er = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
          body: JSON.stringify({
            from: "Never Roam Alone <hello@neverroamalone.com>",
            to: [emailTo],
            subject: `Your suggestion is on the ${row.city} guide`,
            html: `
              <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
                <h2 style="color:#5c6933;margin:0 0 8px">Your suggestion is live!</h2>
                <p style="margin:0 0 20px">Thank you. The ${escapeHtml(what)} you suggested is now on the ${escapeHtml(row.city)} city guide for other travelers.</p>
                <p style="margin:0 0 20px"><a href="${escapeHtml(cityUrl)}" style="display:inline-block;background:#5c6933;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px">See the ${escapeHtml(row.city)} guide &rarr;</a></p>
                <p style="margin:0;font-size:13px;color:#8a9aa3">Never Roam Alone</p>
              </div>`
          })
        });
        if (er.ok) { notified = true; via = "email"; }
        else console.error("[approve-suggestion] Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 300));
      } catch (e) { console.error("[approve-suggestion] email threw:", (e && e.message) || e); }
    }

    if (notified) {
      await fetch(`${SUPABASE_URL}/rest/v1/place_suggestions?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH", headers: svc, body: JSON.stringify({ notified: true })
      }).catch(() => {});
    }
  }

  return json(200, { published: true, notified, via, messageId, points, wanted: !!row.contact, alreadyNotified: !!row.notified });
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// The vote keys city.html gives this member's pick(s), matching its voteWidgetHTML ids:
//   eat / cafes / stay: "<city>:<hood index>:<section>:<name>"   bars: "<city>:<hood index>:bar:<name>"
async function roamerPickKeys(siteBase, row) {
  const ir = await fetch(siteBase + "/citydata/_index.json");
  if (!ir.ok) return [];
  const slug = ((await ir.json()).slug || {})[row.city];
  if (!slug) return [];
  const cr = await fetch(siteBase + "/citydata/" + encodeURIComponent(slug) + ".json");
  if (!cr.ok) return [];
  const rec = await cr.json();
  const hoods = rec.hoods || [];
  let hi = hoods.indexOf(row.hood_name);
  if (hi < 0 && Number.isInteger(row.hood_idx)) hi = row.hood_idx;
  const lists = (rec.roamer_picks && rec.roamer_picks[row.section]) || [];
  const picks = (lists[hi] || []).filter(pk => pk && pk.by === row.user_id && pk.n);
  const part = row.section === "bars" ? "bar" : row.section;
  return picks.map(pk => ({ type: "recommendation", id: `${row.city}:${hi}:${part}:${pk.n}` }));
}

async function cityRecord(siteBase, city) {
  const ir = await fetch(siteBase + "/citydata/_index.json");
  if (!ir.ok) return null;
  const slug = ((await ir.json()).slug || {})[city];
  if (!slug) return null;
  const cr = await fetch(siteBase + "/citydata/" + encodeURIComponent(slug) + ".json");
  return cr.ok ? cr.json() : null;
}

// Food & drink: the place(s) under this dish that carry this member's id (load_food_place.py --by), keyed as
// city.html keys a food place's votes: type "food_place", id "<dish>|<place>".
async function foodPickKeys(siteBase, row) {
  const rec = await cityRecord(siteBase, row.city);
  const dish = ((rec && rec.food) || []).find(f => f && f.name === row.kind_label);
  return ((dish && dish.places) || []).filter(p => p && p.by === row.user_id && p.name)
    .map(p => ({ type: "food_place", id: `${row.kind_label}|${p.name}` }));
}

// The link in the thank-you: straight to the pick on the guide. A member's pick is found by their id (the vote
// keys above); a guest's by the place name (food) or, for a neighborhood card, the one Roamer pick of that kind.
// Not found: the dish, or the neighborhood, or the top of the guide.
async function pickSeeUrl(siteBase, row, targets) {
  if (targets && targets[0]) return seeUrl(siteBase, row.city, targets[0].type, targets[0].id);
  const rec = await cityRecord(siteBase, row.city);
  const n = s => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (row.section === "food") {
    const dish = ((rec && rec.food) || []).find(f => f && f.name === row.kind_label);
    const p = ((dish && dish.places) || []).find(p => p && row.place_name && n(p.name) === n(row.place_name));
    if (p) return seeUrl(siteBase, row.city, "food_place", `${row.kind_label}|${p.name}`);
    return dish ? seeUrl(siteBase, row.city, "dish", dish.name) : seeUrl(siteBase, row.city);
  }
  let hi = ((rec && rec.hoods) || []).indexOf(row.hood_name);
  if (hi < 0 && Number.isInteger(row.hood_idx)) hi = row.hood_idx;
  const list = ((rec && rec.roamer_picks && rec.roamer_picks[row.section]) || [])[hi] || [];
  const same = list.filter(pk => pk && pk.n && !pk.by && pk.k === row.kind);
  const part = row.section === "bars" ? "bar" : row.section;
  if (same.length === 1) return seeUrl(siteBase, row.city, "recommendation", `${row.city}:${hi}:${part}:${same[0].n}`);
  return row.hood_name ? seeUrl(siteBase, row.city, "hood", row.hood_name) : seeUrl(siteBase, row.city);
}

// Is the pick this suggestion replaces still on the live guide? Same hood and section (stay: our hotels too),
// or for food the same dish.
async function stillOnGuide(siteBase, row) {
  const rec = await cityRecord(siteBase, row.city);
  if (!rec) return false;
  const t = row.replace_target;
  if (row.section === "food") {
    const dish = (rec.food || []).find(f => f && f.name === row.kind_label);
    return ((dish && dish.places) || []).some(p => p && p.name === t);
  }
  let hi = (rec.hoods || []).indexOf(row.hood_name);
  if (hi < 0 && Number.isInteger(row.hood_idx)) hi = row.hood_idx;
  const names = l => ((l && l[hi]) || []).map(x => (x && x.n) || x);
  const ours = row.section === "stay" ? names(rec.lodging) : names(rec[row.section]);
  const roam = names(rec.roamer_picks && rec.roamer_picks[row.section]);
  return ours.concat(roam).includes(t);
}

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
