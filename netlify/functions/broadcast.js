// Netlify serverless function: send an email to the whole mailing list.
// Used by the Admin page for two things:
//   1. "Email subscribers" on a published blog post (kind: "post")
//   2. Manual newsletters written in the Emails tab   (kind: "custom")
//
// Only admins (the blog_admins list) can call it. Every email includes a
// personal one-click unsubscribe link, and people who unsubscribed are
// never emailed. A log row in email_broadcasts stops the same post from
// being sent twice by accident.
//
// POST body options:
//   { countOnly: true }                          -> just report how many would receive it
//   { kind:"post", slug, testTo? , force? }      -> announce a blog post
//   { kind:"custom", subject, body, testTo? }    -> manual newsletter (plain text body)
// testTo: send ONE test email to that address instead of the whole list.
//
// Environment variables (same as the other functions):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL (optional)

const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, SITE_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
    return json(500, { error: "Server not configured for email sending." });
  }
  const siteBase = (SITE_URL || "https://neverroamalone.com").replace(/\/+$/, "");
  const svc = { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };

  // ---------- 1. verify the caller is a signed-in admin ----------
  const auth = event.headers.authorization || event.headers.Authorization || "";
  const userToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!userToken) return json(401, { error: "Not signed in." });
  let adminEmail = "";
  try {
    const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: "Bearer " + userToken }
    });
    if (!ur.ok) return json(401, { error: "Session invalid — sign in again." });
    const u = await ur.json();
    adminEmail = (u && u.email) || "";
  } catch (e) { return json(401, { error: "Couldn't verify your session." }); }
  if (!adminEmail) return json(401, { error: "Session invalid — sign in again." });
  try {
    const ar = await fetch(`${SUPABASE_URL}/rest/v1/blog_admins?select=email`, { headers: svc });
    const admins = ar.ok ? await ar.json() : [];
    const isAdmin = Array.isArray(admins) && admins.some(a => String(a.email || "").toLowerCase() === adminEmail.toLowerCase());
    if (!isAdmin) return json(403, { error: "This account isn't an admin." });
  } catch (e) { return json(502, { error: "Couldn't check the admin list." }); }

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }

  // ---------- 2. count-only mode (for the confirm dialog) ----------
  if (p.countOnly) {
    const subs = await fetchSubscribers(SUPABASE_URL, svc);
    if (subs === null) return json(502, { error: "Couldn't read the mailing list." });
    return json(200, { count: subs.length });
  }

  // ---------- 3. build the email ----------
  const kind = p.kind === "post" ? "post" : "custom";
  let subject = "", bodyHtml = "", ref = null;

  if (kind === "post") {
    const slug = String(p.slug || "").trim();
    if (!slug) return json(400, { error: "No post slug." });
    ref = slug;
    // block accidental double-sends (unless force is set)
    if (!p.force && !p.testTo) {
      const br = await fetch(`${SUPABASE_URL}/rest/v1/email_broadcasts?kind=eq.post&ref=eq.${encodeURIComponent(slug)}&select=id,created_at`, { headers: svc });
      const prev = br.ok ? await br.json() : [];
      if (Array.isArray(prev) && prev.length) {
        return json(409, { error: "This post was already emailed to the list.", alreadySent: true });
      }
    }
    const gr = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=slug,title,tag,excerpt,published`, { headers: svc });
    const posts = gr.ok ? await gr.json() : [];
    const post = Array.isArray(posts) && posts[0];
    if (!post) return json(404, { error: "Post not found." });
    if (!post.published && !p.testTo) return json(400, { error: "That post isn't published yet." });
    const link = siteBase + "/post.html?post=" + encodeURIComponent(post.slug);
    subject = String(p.subject || ("New on the blog: " + post.title)).slice(0, 160);
    bodyHtml = `
      <p style="margin:0 0 6px;color:#a8482a;font-weight:bold;text-transform:uppercase;font-size:12px;letter-spacing:.12em">${escapeHtml(post.tag || "New post")}</p>
      <h2 style="font-family:Georgia,serif;color:#185e3f;margin:0 0 12px;font-size:24px">${escapeHtml(post.title)}</h2>
      <p style="margin:0 0 20px;color:#3a4a52;line-height:1.6">${escapeHtml(post.excerpt || "A fresh story from the road is up on the blog.")}</p>
      <a href="${escapeHtml(link)}" style="display:inline-block;background:#556B2F;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:24px">Read the post &rarr;</a>`;
  } else {
    subject = String(p.subject || "").trim().slice(0, 160);
    const bodyText = String(p.body || "").trim().slice(0, 20000);
    if (!subject || !bodyText) return json(400, { error: "Subject and message are both required." });
    bodyHtml = bodyText.split(/\n{2,}/).map(par =>
      `<p style="margin:0 0 14px;color:#3a4a52;line-height:1.65">${escapeHtml(par).replace(/\n/g, "<br>")}</p>`
    ).join("");
  }

  // ---------- 4. test send? ----------
  if (p.testTo) {
    const testTo = String(p.testTo).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testTo)) return json(400, { error: "Test address doesn't look valid." });
    const er = await sendBatch(RESEND_API_KEY, [{
      from: "Never Roam Alone <hello@neverroamalone.com>",
      to: [testTo],
      subject: "[TEST] " + subject,
      html: wrap(bodyHtml, "#", siteBase, true)
    }]);
    if (!er.ok) return json(502, { error: "Email service error on test send.", detail: er.detail });
    return json(200, { sent: true, test: true });
  }

  // ---------- 5. real send to the whole list ----------
  const subs = await fetchSubscribers(SUPABASE_URL, svc);
  if (subs === null) return json(502, { error: "Couldn't read the mailing list." });
  if (!subs.length) return json(200, { sent: false, reason: "Mailing list is empty." });

  let sentCount = 0;
  for (let i = 0; i < subs.length; i += 100) {
    const chunk = subs.slice(i, i + 100).map(s => ({
      from: "Never Roam Alone <hello@neverroamalone.com>",
      to: [s.email],
      subject,
      html: wrap(bodyHtml, unsubLink(siteBase, s.id, SUPABASE_SERVICE_KEY), siteBase, false)
    }));
    const er = await sendBatch(RESEND_API_KEY, chunk);
    if (er.ok) sentCount += chunk.length;
    else console.error("[broadcast] batch", i / 100, "failed:", er.detail);
    if (i + 100 < subs.length) await sleep(600); // stay under Resend's rate limit
  }

  // ---------- 6. log it ----------
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/email_broadcasts`, {
      method: "POST", headers: svc,
      body: JSON.stringify({ kind, ref, subject, sent_count: sentCount, sent_by: adminEmail })
    });
  } catch (e) { console.error("[broadcast] couldn't log the send:", (e && e.message) || e); }

  console.log(`[broadcast] "${subject}" sent to ${sentCount}/${subs.length} subscribers by ${adminEmail}`);
  return json(200, { sent: true, count: sentCount, of: subs.length });
};

// ---- helpers -----------------------------------------------------------

// All subscribers who haven't unsubscribed (paged, 1000 at a time).
async function fetchSubscribers(SUPABASE_URL, svc) {
  const all = [];
  for (let from = 0; ; from += 1000) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/mailing_list?select=id,email&unsubscribed=eq.false&order=created_at.asc`, {
        headers: { ...svc, Range: `${from}-${from + 999}` }
      });
      if (!r.ok) return null;
      const rows = await r.json();
      if (!Array.isArray(rows)) return null;
      all.push(...rows);
      if (rows.length < 1000) break;
    } catch (e) { return null; }
  }
  // de-dupe just in case
  const seen = new Set();
  return all.filter(s => {
    const e = String(s.email || "").toLowerCase();
    if (!e || seen.has(e)) return false;
    seen.add(e); return true;
  });
}

async function sendBatch(key, emails) {
  try {
    const r = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify(emails)
    });
    if (!r.ok) return { ok: false, detail: (await r.text()).slice(0, 300) };
    return { ok: true };
  } catch (e) { return { ok: false, detail: (e && e.message) || "fetch failed" }; }
}

function unsubLink(siteBase, id, secret) {
  const token = crypto.createHmac("sha256", secret).update("unsub:" + String(id)).digest("hex").slice(0, 40);
  return siteBase + "/.netlify/functions/unsubscribe?id=" + encodeURIComponent(id) + "&token=" + token;
}

// The shared house template around every broadcast.
function wrap(inner, unsubUrl, siteBase, isTest) {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:28px 24px;color:#1d2a32">
    <p style="font-family:monospace;text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:#556B2F;margin:0 0 18px">Never Roam Alone</p>
    ${inner}
    <hr style="border:none;border-top:1px solid #e4dcc8;margin:28px 0 16px">
    <p style="margin:0;font-size:12px;color:#8a9aa3;line-height:1.6">
      You're getting this because you joined the Never Roam Alone mailing list.
      ${isTest ? "(This is a test send — no unsubscribe link.)"
               : `<a href="${escapeHtml(unsubUrl)}" style="color:#8a9aa3">Unsubscribe</a> any time.`}
      &middot; <a href="${escapeHtml(siteBase)}" style="color:#8a9aa3">${escapeHtml(siteBase.replace(/^https?:\/\//, ""))}</a>
    </p>
  </div>`;
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
