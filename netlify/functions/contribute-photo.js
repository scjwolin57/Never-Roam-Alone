// Netlify serverless function: when a visitor contributes a photo through a
// "Contribute Image" button anywhere on the site — a landmark card with no
// photo yet, the city hero, a neighborhood hero, a food dish — this
//   1. uploads the image to the private "landmark-contributions" bucket,
//   2. saves a PENDING row for review, and
//   3. emails the site owner a summary with the photo attached.
//
// Modelled on submit-event.js — same spam guards, same Resend send, same
// service-key writes so the browser never needs write access to the table.
//
// Environment variables (Netlify → Site settings → Environment variables):
//   RESEND_API_KEY        - already set up for the other email functions
//   PHOTO_SUBMIT_EMAIL    - where to send submissions (falls back to
//                           EVENT_SUBMIT_EMAIL, then GUIDE_REQUEST_EMAIL)
//   SUPABASE_URL          - already set
//   SUPABASE_SERVICE_KEY  - already set; needed to store the photo + row
//   SITE_URL              - optional; used in the footer link
//   TURNSTILE_SECRET_KEY  - OPTIONAL. If set, a Cloudflare Turnstile token is
//                           required and verified. Leave unset to rely on the
//                           honeypot + timing + burst guards alone.

const crypto = require("crypto");

const MAX_BYTES = 12 * 1024 * 1024;
const OK_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
// Photo slots the form may be raised from. Anything else is stored as "other"
// so a made-up value can never end up in the review queue as a real category.
const OK_KINDS = ["landmark", "city-hero", "neighborhood-hero", "food-dish", "other"];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, PHOTO_SUBMIT_EMAIL, EVENT_SUBMIT_EMAIL, GUIDE_REQUEST_EMAIL,
          SUPABASE_URL, SUPABASE_SERVICE_KEY, SITE_URL, TURNSTILE_SECRET_KEY } = process.env;
  const toEmail = PHOTO_SUBMIT_EMAIL || EVENT_SUBMIT_EMAIL || GUIDE_REQUEST_EMAIL;
  if (!RESEND_API_KEY || !toEmail || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("[contribute-photo] STOP: missing env:", {
      RESEND_API_KEY: !!RESEND_API_KEY, toEmail: !!toEmail,
      SUPABASE_URL: !!SUPABASE_URL, SUPABASE_SERVICE_KEY: !!SUPABASE_SERVICE_KEY });
    return json(500, { error: "Server not configured for photo contributions." });
  }

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }

  const website   = clip(p.website, 100);   // honeypot — hidden, must stay empty
  const elapsedMs = Number(p.elapsedMs);

  // --- spam guards (invisible to real visitors) ---
  if (website) {
    console.warn("[contribute-photo] honeypot tripped — dropping silently.");
    return json(200, { sent: true });
  }
  if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 3000) {
    console.warn("[contribute-photo] too-fast submit:", elapsedMs, "ms");
    return json(400, { sent: false, error: "That was a bit too quick — please try again." });
  }
  // Optional Cloudflare Turnstile check (only enforced once the secret is set).
  if (TURNSTILE_SECRET_KEY) {
    const tok = clip(p.turnstileToken, 2048);
    if (!tok) return json(400, { sent: false, error: "Please complete the verification check." });
    try {
      const vr = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: tok,
                               remoteip: (event.headers["x-nf-client-connection-ip"] || "") })
      });
      const vj = await vr.json();
      if (!vj.success) {
        console.warn("[contribute-photo] turnstile failed:", vj["error-codes"]);
        return json(400, { sent: false, error: "Verification failed — please try again." });
      }
    } catch (e) {
      console.error("[contribute-photo] turnstile check threw:", (e && e.message) || e);
      return json(502, { sent: false, error: "Verification service unavailable." });
    }
  }

  const city      = clip(p.city, 80);
  const country   = clip(p.country, 80);
  const landmark  = clip(p.landmark, 160);
  const idx       = Number.isFinite(Number(p.landmarkIdx)) ? Number(p.landmarkIdx) : null;
  const mode      = ["name", "profile", "none"].includes(p.creditMode) ? p.creditMode : "none";
  const kind      = OK_KINDS.includes(p.subjectKind) ? p.subjectKind : "other";
  const kindLabel = clip(p.subjectLabel, 60) || kind;
  const context   = clip(p.context, 160);
  const creditName= mode === "name" ? clip(p.creditName, 80) : "";
  const workUrl   = rawUrl(p.workUrl);
  const month     = intOrNull(p.takenMonth, 1, 12);
  const year      = intOrNull(p.takenYear, 1900, 2100);
  const rights    = p.rightsConfirmed === true;
  // The licence record: the typed signature, the exact wording agreed to, and
  // when. Stored verbatim so there is proof of what was agreed even after the
  // wording changes. The version is what makes an old row still readable.
  const signature = clip(p.signature, 120);
  const licVer    = clip(p.licenseVersion, 40);
  const licText   = clip(p.licenseText, 8000);
  const agreedAt  = isoOrNow(p.agreedAt);
  const pageUrl   = rawUrl(p.pageUrl);

  if (!city || !landmark) return json(400, { error: "Missing city or subject." });
  if (!rights) return json(400, { error: "The ownership confirmation is required." });
  if (signature.length < 2) return json(400, { error: "A typed signature is required." });
  if (!licVer || licText.length < 40) return json(400, { error: "The licence text is missing." });

  // Who is signed in, if anyone. The browser sends its Supabase access token;
  // we ask Supabase who it belongs to rather than trusting a claimed id. A
  // profile credit is only granted when that check comes back with a user.
  let userId = null;
  const token = clip(p.accessToken, 4096);
  if (token) {
    try {
      const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + token }
      });
      if (ur.ok) {
        const u = await ur.json();
        if (u && typeof u.id === "string") userId = u.id;
      } else {
        console.warn("[contribute-photo] token check failed. HTTP", ur.status);
      }
    } catch (e) {
      console.error("[contribute-photo] token check threw:", (e && e.message) || e);
    }
  }
  if (mode === "profile" && !userId) {
    return json(401, { sent: false, error: "Please sign in again to credit your profile." });
  }

  // --- decode + validate the image (server-side; never trust the browser) ---
  const type = String(p.fileType || "");
  if (!OK_TYPES[type]) return json(400, { error: "Please upload a JPEG, PNG or WebP image." });
  let bytes;
  try {
    bytes = Buffer.from(String(p.fileData || "").split(",").pop(), "base64");
  } catch (e) { return json(400, { error: "Could not read that image." }); }
  if (!bytes.length) return json(400, { error: "That image looked empty." });
  if (bytes.length > MAX_BYTES) return json(400, { error: "That image is over 12 MB." });
  if (!looksLikeImage(bytes, type)) return json(400, { error: "That file doesn't look like an image." });

  const H = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY };

  // Burst cap: counts recent pending rows only (no IPs, no personal data).
  try {
    const since = new Date(Date.now() - 60000).toISOString();
    const cr = await fetch(`${SUPABASE_URL}/rest/v1/landmark_photo_contributions?select=id&status=eq.pending&created_at=gte.${encodeURIComponent(since)}`, { headers: H });
    if (cr.ok) {
      const recent = await cr.json();
      if (Array.isArray(recent) && recent.length >= 5) {
        console.warn("[contribute-photo] rate limit:", recent.length, "in last 60s");
        return json(429, { sent: false, error: "We're getting a lot of submissions right now — please try again in a minute." });
      }
    }
  } catch (e) { /* never block a genuine submission on the check itself */ }

  const slug = (city.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "city");
  const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${OK_TYPES[type]}`;

  try {
    const ur = await fetch(`${SUPABASE_URL}/storage/v1/object/landmark-contributions/${path}`, {
      method: "POST", headers: Object.assign({ "Content-Type": type }, H), body: bytes
    });
    if (!ur.ok) {
      console.error("[contribute-photo] STOP: storage rejected upload. HTTP", ur.status, (await ur.text()).slice(0, 300));
      return json(502, { sent: false, error: "Could not store the photo." });
    }
    const ir = await fetch(`${SUPABASE_URL}/rest/v1/landmark_photo_contributions`, {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json", Prefer: "return=representation" }, H),
      body: JSON.stringify({
        city, country, landmark, landmark_idx: idx, storage_path: path,
        subject_kind: kind, subject_label: kindLabel, subject_context: context || null,
        taken_month: month, taken_year: year, credit_mode: mode,
        credit_name: creditName || null, work_url: workUrl || null,
        rights_confirmed: true, status: "pending",
        submitted_by: userId,
        signature, license_version: licVer, license_text: licText,
        agreed_at: agreedAt, page_url: pageUrl || null
      })
    });
    if (!ir.ok) {
      console.error("[contribute-photo] STOP: insert failed. HTTP", ir.status, (await ir.text()).slice(0, 300));
      return json(502, { sent: false, error: "Could not save the submission." });
    }
    const row = (await ir.json())[0] || {};

    const site = SITE_URL || "https://neverroamalone.com";
    const creditLine = mode === "name" ? escapeHtml(creditName || "(name not given)")
                     : mode === "profile" ? "their Never Roam Alone profile"
                     : "no credit requested";
    const taken = (month || year)
      ? `${month ? ["","January","February","March","April","May","June","July","August","September","October","November","December"][month] + " " : ""}${year || ""}`.trim()
      : "not given";
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Never Roam Alone <noreply@neverroamalone.com>",
        to: [toEmail],
        subject: `Photo contributed: ${landmark} (${city})`,
        html: `<h2 style="font-family:Georgia,serif">New ${escapeHtml(kindLabel.toLowerCase())}</h2>
          <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
            <b>${escapeHtml(kindLabel)}:</b> ${escapeHtml(landmark)}${idx == null ? "" : ` (#${idx + 1})`}<br>
            ${context ? `<b>In:</b> ${escapeHtml(context)}<br>` : ""}
            <b>City:</b> ${escapeHtml(city)}${country ? ", " + escapeHtml(country) : ""}<br>
            <b>Date taken:</b> ${escapeHtml(taken)}<br>
            <b>Credit:</b> ${creditLine}<br>
            ${workUrl ? `<b>Their work:</b> <a href="${escapeHtml(workUrl)}">${escapeHtml(workUrl)}</a><br>` : ""}
            <b>Rights confirmed:</b> yes<br>
            <b>Signed:</b> ${escapeHtml(signature)} (licence ${escapeHtml(licVer)}, ${escapeHtml(agreedAt)})<br>
            <b>Account:</b> ${userId ? escapeHtml(userId) : "not signed in"}<br>
            <b>Stored at:</b> ${escapeHtml(path)}
          </p>
          ${row.id ? `<p style="font-family:system-ui,sans-serif;font-size:15px;margin:22px 0 6px">
            <a href="${escapeHtml(reviewLink(site, row.id, "approve", SUPABASE_SERVICE_KEY))}"
               style="display:inline-block;background:#556B2F;color:#fff;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:10px;margin-right:8px">Review &amp; publish</a>
            <a href="${escapeHtml(reviewLink(site, row.id, "reject", SUPABASE_SERVICE_KEY))}"
               style="display:inline-block;background:#fff;color:#556B2F;border:2px solid #556B2F;text-decoration:none;font-weight:bold;padding:9px 18px;border-radius:10px">Review &amp; turn down</a></p>
          <p style="font-family:system-ui,sans-serif;font-size:13px;color:#666">
            Either button opens the photo on a review page. Nothing is published until you press the
            button there, so a mail scanner following these links can't publish anything by itself.</p>` : ""}
          <p style="font-family:system-ui,sans-serif;font-size:13px;color:#666">
            The photo is attached. It is stored privately and is not on the site until you publish it.
            <br><a href="${escapeHtml(site)}">${escapeHtml(site)}</a></p>`,
        attachments: [{ filename: path.split("/").pop(), content: bytes.toString("base64") }]
      })
    });
    if (!er.ok) {
      // The submission IS saved — only the notification failed. Don't fail the visitor.
      console.error("[contribute-photo] Resend rejected the email. HTTP", er.status, (await er.text()).slice(0, 300));
      return json(200, { sent: true, id: row.id, emailed: false });
    }
    console.log("[contribute-photo] SUCCESS:", landmark, "in", city);
    return json(200, { sent: true, id: row.id, emailed: true });
  } catch (e) {
    console.error("[contribute-photo] STOP: threw:", (e && e.message) || e);
    return json(502, { sent: false, error: "Request failed" });
  }
};

// The one-click review link. Signed with the service key so only someone who
// received this email can open it — the same scheme approve-event.js uses, and
// duplicated here for the same reason: each function is bundled on its own.
function reviewLink(site, id, action, secret) {
  const token = crypto.createHmac("sha256", secret).update("photo:" + String(id)).digest("hex").slice(0, 40);
  return `${site}/.netlify/functions/approve-photo?id=${encodeURIComponent(id)}&token=${token}&action=${action}`;
}
function looksLikeImage(b, type) {
  if (type === "image/jpeg") return b[0] === 0xFF && b[1] === 0xD8;
  if (type === "image/png")  return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47;
  if (type === "image/webp") return b.slice(0, 4).toString("ascii") === "RIFF" && b.slice(8, 12).toString("ascii") === "WEBP";
  return false;
}
function isoOrNull(s) { const d = new Date(String(s || "")); return isNaN(d.getTime()) ? null : d.toISOString(); }
function isoOrNow(s) { return isoOrNull(s) || new Date().toISOString(); }
function intOrNull(v, lo, hi) { const n = Number(v); return Number.isInteger(n) && n >= lo && n <= hi ? n : null; }
function clip(s, n) { return String(s == null ? "" : s).trim().slice(0, n); }
function rawUrl(s) { const u = clip(s, 500); return /^https?:\/\//i.test(u) ? u : ""; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function json(statusCode, body) { return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }; }
