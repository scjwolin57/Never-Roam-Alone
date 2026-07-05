// Netlify serverless function: permanently deletes the signed-in user's
// account (GDPR "right to erasure" — the Delete button on profile.html).
//
// HOW IT STAYS SECURE: the browser sends the user's own sign-in token.
// We ask Supabase "whose token is this?" and only ever delete THAT user.
// Nobody can delete anyone else's account, with or without this endpoint.
//
// WHAT IT DOES, in order:
//   1. Verifies the caller's sign-in token → gets their user id.
//   2. Anonymizes their forum posts (questions + replies get the name
//      "Anonymous Roamer" and lose the account link).
//   3. Deletes the auth user. The profiles row is removed automatically
//      (ON DELETE CASCADE), taking their email/bio/etc. with it.
//
// Uses the same environment variables as notify.js:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  console.log("[delete-account] env present:", { SUPABASE_URL: !!SUPABASE_URL, SUPABASE_SERVICE_KEY: !!SUPABASE_SERVICE_KEY });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return json(500, { error: "Server not configured." });
  }

  // The user's own access token, sent by the profile page.
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return json(401, { error: "Not signed in." });

  const svcHeaders = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };

  try {
    // 1. Whose token is this? (Supabase validates it for us.)
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + token }
    });
    if (!ur.ok) { console.error("[delete-account] STOP: token check failed, HTTP", ur.status); return json(401, { error: "Session invalid — sign in again." }); }
    const user = await ur.json();
    const uid = user && user.id;
    if (!uid) { console.error("[delete-account] STOP: token check returned no user id."); return json(401, { error: "Session invalid — sign in again." }); }
    console.log("[delete-account] verified request for user id:", uid);

    // 2. Anonymize their public forum posts BEFORE the account disappears.
    //    (After deletion the user_id becomes NULL via the foreign key, so we
    //    couldn't find their posts anymore — that's why this comes first.)
    const anonymize = { name: "Anonymous Roamer" };
    const q1 = await fetch(`${SUPABASE_URL}/rest/v1/questions?user_id=eq.${uid}`, { method: "PATCH", headers: svcHeaders, body: JSON.stringify(anonymize) });
    const q2 = await fetch(`${SUPABASE_URL}/rest/v1/replies?user_id=eq.${uid}`,   { method: "PATCH", headers: svcHeaders, body: JSON.stringify(anonymize) });
    console.log("[delete-account] anonymized posts:", { questions: q1.status, replies: q2.status });

    // 3. Delete the account itself (profiles row cascades away with it).
    const dr = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${uid}`, { method: "DELETE", headers: svcHeaders });
    if (!dr.ok) {
      const detail = await dr.text();
      console.error("[delete-account] STOP: admin delete failed, HTTP", dr.status, detail.slice(0, 300));
      return json(502, { error: "Couldn't delete the account — try again." });
    }
    console.log("[delete-account] SUCCESS: account deleted.");
    return json(200, { deleted: true });
  } catch (e) {
    console.error("[delete-account] STOP: threw:", (e && e.message) || e);
    return json(502, { error: "Deletion failed — try again." });
  }
};

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
