// Shared by the approve-* functions: credit a member for an approved
// contribution, once. Not a function itself (Netlify only deploys files at
// the top of netlify/functions; this folder is bundled into the callers).
//
//   - one row in contribution_events (the points ledger; the trigger in
//     contribution-points-setup.sql keeps profiles.contribution_points), and
//   - one row per vote key in contribution_targets, so thumbs up / down on
//     that item count toward the member's Trusted Traveler Rating
//     (contribution-rating-setup.sql).
//
// Point values: Jeff, 2026-09-22 (contribution-points-setup.sql), plus the
// blog post (25, 2026-10-02), which the database trigger awards itself.

const POINTS = {
  insight: 20,            // Traveler's Take / Local's Perspective
  photo: 10,
  daytrip_landmark: 10,
  recommendation: 5,      // restaurant, bar, takeaway, coffee or stay pick
  event: 5,
  correction: 5
};

// award({ url, key, userId, kind, sourceTable, sourceId, city, targets: [{ type, id }] })
// Returns { points: true|false, targets: <rows written or already there> }.
async function award(o) {
  const out = { points: false, targets: 0 };
  if (!o.userId || !POINTS[o.kind]) return out;
  const svc = { apikey: o.key, Authorization: "Bearer " + o.key, "Content-Type": "application/json" };
  const tag = "[contrib " + o.sourceTable + "]";

  try {
    const er = await fetch(`${o.url}/rest/v1/contribution_events?source_table=eq.${encodeURIComponent(o.sourceTable)}&source_id=eq.${encodeURIComponent(o.sourceId)}&select=id`, { headers: svc });
    const existing = er.ok ? await er.json() : null;
    if (Array.isArray(existing) && existing.length) {
      out.points = true;   // already credited on an earlier approval
    } else if (Array.isArray(existing)) {
      const ir = await fetch(`${o.url}/rest/v1/contribution_events`, {
        method: "POST", headers: svc,
        body: JSON.stringify({ user_id: o.userId, kind: o.kind, points: POINTS[o.kind],
                               source_table: o.sourceTable, source_id: o.sourceId, city: o.city || null })
      });
      out.points = ir.ok;
      if (!ir.ok) console.error(tag, "points insert failed HTTP", ir.status, (await ir.text()).slice(0, 300));
    }
  } catch (e) { console.error(tag, "points threw:", (e && e.message) || e); }

  const targets = (o.targets || []).filter(t => t && t.type && t.id);
  if (targets.length) {
    try {
      const tr = await fetch(`${o.url}/rest/v1/contribution_targets?on_conflict=target_type,target_id`, {
        method: "POST", headers: { ...svc, Prefer: "resolution=ignore-duplicates" },
        body: JSON.stringify(targets.map(t => ({ user_id: o.userId, target_type: t.type, target_id: String(t.id),
                                                 source_table: o.sourceTable, source_id: o.sourceId, city: o.city || null })))
      });
      if (tr.ok) out.targets = targets.length;
      else console.error(tag, "targets insert failed HTTP", tr.status, (await tr.text()).slice(0, 300));
    } catch (e) { console.error(tag, "targets threw:", (e && e.message) || e); }
  }
  return out;
}

// The signed-in member behind a form, checked server-side from the session
// token the page sends (accessToken), the same way submit-suggestion.js does.
// null for a visitor who isn't signed in, or when the check fails.
async function memberFromToken(url, key, token) {
  token = String(token || "").trim();
  if (!token || !url || !key) return null;
  try {
    const ur = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: "Bearer " + token } });
    if (!ur.ok) return null;
    const u = await ur.json();
    return (u && u.id) || null;
  } catch (e) { return null; }
}

// POST a row; if it carries a member column the database doesn't have yet
// (contribution-rating-setup.sql not run), save it again without that
// column rather than lose the submission.
async function insertWithMember(url, headers, body, memberCol) {
  let r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!r.ok && memberCol && body[memberCol]) {
    const detail = await r.text();
    if (/column|schema cache|PGRST204|42703/i.test(detail)) {
      console.warn("[contrib] member column", memberCol, "missing; saving without it. Run contribution-rating-setup.sql.");
      const b2 = { ...body }; delete b2[memberCol];
      r = await fetch(url, { method: "POST", headers, body: JSON.stringify(b2) });
    } else {
      return { ok: false, status: r.status, text: async () => detail, json: async () => null };
    }
  }
  return r;
}

module.exports = { POINTS, award, memberFromToken, insertWithMember };
