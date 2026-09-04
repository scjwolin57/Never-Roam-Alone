// Netlify serverless function: review a contributed photo — publish it or turn
// it down — from the button in the submission email, or from the Admin page.
//
// Modelled on approve-event.js: same HMAC-signed link, same confirmation page,
// same admin POST path. One difference matters, and it is deliberate:
//
//   GET never changes anything. It only renders a review page showing the
//   photo. Mail providers and security scanners routinely fetch the links
//   inside an email, so a GET that published on sight would publish photos
//   nobody ever looked at. The publish happens on the POST that the button on
//   that page sends, which scanners do not make.
//
// Three ways in:
//   GET  ?id=<uuid>&token=<hmac>&action=approve|reject
//        The buttons in the submission email. Renders the photo, the credit
//        the contributor asked for, and one confirm button.
//   POST id, token, action           (form post from that page)
//        Does the work.
//   POST { id, action } with header Authorization: Bearer <admin token>
//        For the Admin page. Verified against the blog_admins list, the same
//        way approve-event.js does it — no HMAC needed.
//
// Approving copies the file out of the private review bucket into the public
// one and marks the row approved. It does NOT touch the repo: the site picks
// approved photos up at runtime. Turning a photo down only marks the row —
// the file stays put so a mistaken rejection can be undone.
//
// Environment variables (all already set for the other functions):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

const crypto = require("crypto");

const PRIVATE_BUCKET = "landmark-contributions";
const PUBLIC_BUCKET  = "landmark-photos";
const MIME = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

exports.handler = async (event) => {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return event.httpMethod === "GET"
      ? html(500, page("Not configured", "<p>This site isn't set up for photo reviews yet.</p>"))
      : json(500, { error: "Server not configured." });
  }
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const env = { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, siteBase };

  // ---------- GET: the review page the email buttons open ----------
  if (event.httpMethod === "GET") {
    const q = event.queryStringParameters || {};
    const id = String(q.id || "");
    const token = String(q.token || "");
    const action = q.action === "reject" ? "reject" : "approve";
    if (!id || !token) return html(400, page("Missing details", "<p>That link is incomplete.</p>"));
    if (!validToken(id, token, SUPABASE_SERVICE_KEY)) {
      return html(403, page("Link not valid", "<p>This review link is invalid or has been tampered with.</p>"));
    }
    const row = await loadRow(id, env);
    if (!row) return html(404, page("Not found", "<p>That submission no longer exists.</p>"));
    if (row.status !== "pending") return html(200, page("Already reviewed", doneBody(row, env)));
    return html(200, page(action === "reject" ? "Turn this photo down?" : "Publish this photo?",
                          await reviewBody(row, action, token, env)));
  }

  // ---------- POST: the confirm button, or the Admin page ----------
  if (event.httpMethod !== "POST") return json(405, { error: "GET or POST only" });

  const p = parseBody(event);
  const id = String(p.id || "");
  const action = p.action === "reject" ? "reject" : "approve";
  const fromForm = /form-urlencoded/i.test(event.headers["content-type"] || event.headers["Content-Type"] || "");
  if (!id) return fromForm ? html(400, page("Missing details", "<p>No submission id.</p>")) : json(400, { error: "No photo id." });

  // Either a valid signed token from the email, or a signed-in admin.
  const token = String(p.token || "");
  let allowed = token && validToken(id, token, SUPABASE_SERVICE_KEY);
  if (!allowed) {
    const check = await adminCheck(event, env);
    if (!check.ok) return fromForm ? html(check.code, page("Not allowed", `<p>${escapeHtml(check.message)}</p>`))
                                   : json(check.code, { error: check.message });
    allowed = true;
  }

  const r = await review(id, action, env);
  if (!r.ok) return fromForm ? html(r.code || 500, page("Couldn't do that", `<p>${escapeHtml(r.message)}</p>`))
                             : json(r.code || 500, { error: r.message });
  return fromForm
    ? html(200, page(r.already ? "Already reviewed" : (action === "reject" ? "Turned down" : "Published"), doneBody(r.row, env)))
    : json(200, { status: r.row.status, already: !!r.already, url: publicUrl(r.row, env) });
};

/* ---------- the work ---------- */

// Publish or turn down one submission. Idempotent: a second call reports
// `already` and changes nothing. Returns {ok, row, already, code, message}.
async function review(id, action, env) {
  const row = await loadRow(id, env);
  if (!row) return { ok: false, code: 404, message: "That submission no longer exists." };
  if (row.status !== "pending") return { ok: true, row, already: true };

  const patch = { status: action === "reject" ? "rejected" : "approved", reviewed_at: new Date().toISOString() };

  if (action === "approve") {
    // Copy the file into the public bucket. Download-then-upload rather than
    // the storage copy endpoint, so this works on any Supabase version.
    const svc = { apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY };
    const ext = String(row.storage_path).split(".").pop().toLowerCase();
    let bytes;
    try {
      const dr = await fetch(`${env.SUPABASE_URL}/storage/v1/object/${PRIVATE_BUCKET}/${row.storage_path}`, { headers: svc });
      if (!dr.ok) {
        console.error("[approve-photo] STOP: couldn't read the stored file. HTTP", dr.status);
        return { ok: false, code: 502, message: "Couldn't read the stored photo." };
      }
      bytes = Buffer.from(await dr.arrayBuffer());
    } catch (e) {
      console.error("[approve-photo] download threw:", (e && e.message) || e);
      return { ok: false, code: 502, message: "Couldn't read the stored photo." };
    }
    try {
      const ur = await fetch(`${env.SUPABASE_URL}/storage/v1/object/${PUBLIC_BUCKET}/${row.storage_path}`, {
        method: "POST",
        headers: Object.assign({ "Content-Type": MIME[ext] || "image/jpeg", "x-upsert": "true" }, svc),
        body: bytes
      });
      if (!ur.ok) {
        console.error("[approve-photo] STOP: public upload rejected. HTTP", ur.status, (await ur.text()).slice(0, 300));
        return { ok: false, code: 502, message: "Couldn't publish the photo." };
      }
    } catch (e) {
      console.error("[approve-photo] upload threw:", (e && e.message) || e);
      return { ok: false, code: 502, message: "Couldn't publish the photo." };
    }
    patch.published_path = row.storage_path;
  }

  const updated = await patchRow(id, patch, env);
  if (!updated) return { ok: false, code: 502, message: "Couldn't save the decision." };

  // Tell the contributor their photo is up — only possible when they were
  // signed in, since the form never asks anyone for an email address.
  let notified = false;
  if (action === "approve" && updated.submitted_by && !updated.notified && env.RESEND_API_KEY) {
    notified = await notifyContributor(updated, env);
    if (notified) await patchRow(id, { notified: true }, env);
  }
  return { ok: true, row: updated, notified };
}

async function loadRow(id, env) {
  try {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/landmark_photo_contributions?id=eq.${encodeURIComponent(id)}&select=*`,
      { headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY } });
    if (!r.ok) return null;
    return (await r.json())[0] || null;
  } catch (e) { return null; }
}

async function patchRow(id, patch, env) {
  try {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/landmark_photo_contributions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY,
                 "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(patch)
    });
    if (!r.ok) { console.error("[approve-photo] patch failed. HTTP", r.status, (await r.text()).slice(0, 200)); return null; }
    return (await r.json())[0] || null;
  } catch (e) { console.error("[approve-photo] patch threw:", (e && e.message) || e); return null; }
}

// A short-lived link to the private original, so the review page can show the
// photo without the review bucket being public.
async function previewUrl(row, env) {
  try {
    const r = await fetch(`${env.SUPABASE_URL}/storage/v1/object/sign/${PRIVATE_BUCKET}/${row.storage_path}`, {
      method: "POST",
      headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY,
                 "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 3600 })
    });
    if (!r.ok) return "";
    const d = await r.json();
    return d && d.signedURL ? env.SUPABASE_URL + "/storage/v1" + d.signedURL : "";
  } catch (e) { return ""; }
}

function publicUrl(row, env) {
  return row && row.published_path
    ? `${env.SUPABASE_URL}/storage/v1/object/public/${PUBLIC_BUCKET}/${row.published_path}` : "";
}

async function notifyContributor(row, env) {
  let email = "";
  try {
    const r = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(row.submitted_by)}`,
      { headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY } });
    if (r.ok) { const u = await r.json(); email = (u && u.email) || ""; }
  } catch (e) { /* a missing account is not a failure to publish */ }
  if (!email) return false;
  const cityUrl = env.siteBase + "/city.html?city=" + encodeURIComponent(row.city);
  try {
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + env.RESEND_API_KEY },
      body: JSON.stringify({
        from: "Never Roam Alone <hello@neverroamalone.com>",
        to: [email],
        subject: `Your photo is live: ${row.landmark}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1d2a32">
            <h2 style="color:#185e3f;margin:0 0 8px">Your photo is on the site &#128248;</h2>
            <p style="margin:0 0 14px">Thank you for contributing it.</p>
            <div style="background:#f6f1e7;border-radius:12px;padding:14px 16px;margin:0 0 18px">
              <p style="margin:0 0 4px;font-size:18px;font-weight:bold">${escapeHtml(row.landmark)}</p>
              <p style="margin:0;color:#3a4a52">${escapeHtml(row.city)}${row.country ? ", " + escapeHtml(row.country) : ""}</p>
            </div>
            <p style="margin:0"><a href="${escapeHtml(cityUrl)}" style="display:inline-block;background:#556B2F;color:#fff;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:10px">See it on the guide</a></p>
            <p style="margin:22px 0 0;font-size:13px;color:#8a9aa3">Never Roam Alone &middot; ${escapeHtml(env.siteBase)}</p>
          </div>`
      })
    });
    return er.ok;
  } catch (e) { console.error("[approve-photo] contributor email threw:", (e && e.message) || e); return false; }
}

// Is the caller a signed-in admin? Same blog_admins check approve-event.js uses.
async function adminCheck(event, env) {
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const userToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!userToken) return { ok: false, code: 401, message: "Not signed in." };
  let email = "";
  try {
    const ur = await fetch(`${env.SUPABASE_URL}/auth/v1/user`,
      { headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + userToken } });
    if (!ur.ok) return { ok: false, code: 401, message: "Session invalid — sign in again." };
    const u = await ur.json();
    email = (u && u.email) || "";
  } catch (e) { return { ok: false, code: 401, message: "Couldn't verify your session." }; }
  if (!email) return { ok: false, code: 401, message: "Session invalid — sign in again." };
  try {
    const ar = await fetch(`${env.SUPABASE_URL}/rest/v1/blog_admins?select=email`,
      { headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY } });
    if (ar.ok) {
      const admins = await ar.json();
      if (Array.isArray(admins) && admins.some(a => String(a.email || "").toLowerCase() === email.toLowerCase()))
        return { ok: true };
    }
  } catch (e) {}
  return { ok: false, code: 403, message: "This account isn't an admin." };
}

/* ---------- pages ---------- */

async function reviewBody(row, action, token, env) {
  const img = await previewUrl(row, env);
  const credit = row.credit_mode === "name" ? (row.credit_name || "(name not given)")
               : row.credit_mode === "profile" ? "their Never Roam Alone profile"
               : "no credit requested";
  const taken = [MONTHS[row.taken_month] || "", row.taken_year || ""].filter(Boolean).join(" ") || "not given";
  const other = action === "reject" ? "approve" : "reject";
  const otherLabel = action === "reject" ? "publish it instead" : "turn it down instead";
  return `
    ${img ? `<img src="${escapeHtml(img)}" alt="" style="width:100%;border-radius:10px;margin:0 0 16px">` : ""}
    <p style="margin:0 0 4px;font-size:1.05rem"><strong>${escapeHtml(row.landmark)}</strong></p>
    <p style="margin:0 0 14px;color:#5b6b75">${escapeHtml(row.subject_label || row.subject_kind || "Photo")} &middot;
      ${escapeHtml(row.city)}${row.country ? ", " + escapeHtml(row.country) : ""}</p>
    <p style="margin:0 0 4px;color:#5b6b75;font-size:.9rem">Taken: ${escapeHtml(taken)}</p>
    <p style="margin:0 0 4px;color:#5b6b75;font-size:.9rem">Credit: ${escapeHtml(credit)}</p>
    <p style="margin:0 0 18px;color:#5b6b75;font-size:.9rem">Signed: ${escapeHtml(row.signature || "—")}</p>
    <form method="POST" style="display:inline">
      <input type="hidden" name="id" value="${escapeHtml(row.id)}">
      <input type="hidden" name="token" value="${escapeHtml(token)}">
      <input type="hidden" name="action" value="${escapeHtml(action)}">
      <button class="b" type="submit">${action === "reject" ? "Turn it down" : "Publish it"}</button>
    </form>
    <p style="margin:16px 0 0;font-size:.85rem">
      <a href="?id=${encodeURIComponent(row.id)}&token=${encodeURIComponent(token)}&action=${other}">or ${otherLabel}</a></p>`;
}

function doneBody(row, env) {
  const url = publicUrl(row, env);
  if (row.status === "approved") {
    return `<p>&#9989; <strong>${escapeHtml(row.landmark)}</strong> is published.</p>` +
      (url ? `<img src="${escapeHtml(url)}" alt="" style="width:100%;border-radius:10px;margin:14px 0 0">` : "") +
      `<p style="margin:22px 0 0"><a class="b" href="${escapeHtml(env.siteBase + "/city.html?city=" + encodeURIComponent(row.city))}">Open the ${escapeHtml(row.city)} guide</a></p>`;
  }
  return `<p>&#128465; <strong>${escapeHtml(row.landmark)}</strong> was turned down and will not appear on the site.</p>` +
    `<p style="color:#5b6b75;font-size:.9rem">The file is kept in the review bucket, so this can be undone.</p>`;
}

/* ---------- helpers ---------- */

const MONTHS = ["", "January","February","March","April","May","June",
                "July","August","September","October","November","December"];

// Signed with the service key, like approve-event.js. Compared in constant
// time so the token can't be guessed a character at a time.
function photoToken(id, secret) {
  return crypto.createHmac("sha256", secret).update("photo:" + String(id)).digest("hex").slice(0, 40);
}
function validToken(id, given, secret) {
  const want = Buffer.from(photoToken(id, secret));
  const got = Buffer.from(String(given || ""));
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}
function parseBody(event) {
  const body = event.body || "";
  const ct = event.headers["content-type"] || event.headers["Content-Type"] || "";
  if (/form-urlencoded/i.test(ct)) return Object.fromEntries(new URLSearchParams(body));
  try { return JSON.parse(body || "{}"); } catch (e) { return {}; }
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function page(title, bodyHtml) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} — Never Roam Alone</title>
  <meta name="robots" content="noindex">
  <style>body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#f6f1e7;color:#1d2a32;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
  .card{background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(20,40,50,.12);padding:34px 30px;max-width:460px;text-align:center;line-height:1.6}
  h1{font-family:Georgia,serif;color:#556B2F;margin:0 0 10px;font-size:1.5rem}
  .b,button.b{display:inline-block;background:#556B2F;color:#fff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:10px;margin:4px;border:none;font-size:1rem;cursor:pointer}
  a.b.ghost{background:#fff;color:#556B2F;border:2px solid #556B2F}</style></head>
  <body><div class="card"><h1>${escapeHtml(title)}</h1>${bodyHtml}</div></body></html>`;
}
function html(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "text/html; charset=utf-8" }, body };
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

