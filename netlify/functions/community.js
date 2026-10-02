// Netlify serverless function: emails the site owner when a visitor sends
// the "Share a Blog Post" pitch form on community.html. Same setup as
// contact.js. (The Trusted Traveler application was replaced on 2026-10-02 by
// links to each city's Traveler's Take and Local's Perspective forms.)
//
// Environment variables (already set for contact.js):
//   RESEND_API_KEY   - Resend key
//   CONTACT_EMAIL    - where submissions go (falls back to GUIDE_REQUEST_EMAIL)
//   SITE_URL         - optional, used in the email footer

const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // Netlify caps a request near 6 MB; base64 adds a third

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  const { RESEND_API_KEY, CONTACT_EMAIL, GUIDE_REQUEST_EMAIL, SITE_URL } = process.env;
  const toEmail = CONTACT_EMAIL || GUIDE_REQUEST_EMAIL;
  if (!RESEND_API_KEY || !toEmail) {
    console.error("[community] STOP: missing env var", { RESEND_API_KEY: !!RESEND_API_KEY, toEmail: !!toEmail });
    return json(500, { error: "Server not configured for community submissions." });
  }

  let p;
  try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const s = (v, n) => String(v || "").trim().slice(0, n);
  const kind = p.kind === "blogpost" ? "blogpost" : "";
  if (!kind) return json(400, { error: "Unknown form" });

  const name = s(p.name, 80);
  const email = s(p.email, 120);
  if (!name) return json(400, { error: "Your name is required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "A valid email is required" });

  let rows, subject, heading;
  const attachments = [];
  if (kind === "blogpost") {
    const title = s(p.title, 140), place = s(p.place, 120), story = s(p.story, 8000);
    if (!title || !story) return json(400, { error: "A title and your story are required" });
    rows = [["Post title", title], ["Destination or topic", place || "(not given)"], ["Story", story]];
    subject = `Blog post pitch: ${title}`;
    heading = "New blog post pitch";
    if (p.photo && p.photo.data) {
      const data = String(p.photo.data).replace(/^data:[^,]*,/, "");
      const bytes = Math.floor(data.length * 3 / 4);
      if (bytes > MAX_PHOTO_BYTES) return json(413, { error: "The photo is too large (4 MB at most)" });
      if (!/^image\//.test(String(p.photo.type || ""))) return json(400, { error: "The cover photo must be an image" });
      attachments.push({ filename: s(p.photo.name, 120).replace(/[^\w.\- ]/g, "_") || "cover-photo", content: data });
      rows.push(["Cover photo", "attached (" + Math.round(bytes / 1024) + " KB)"]);
    }
  }

  const rowsHtml = rows.map(([k, v]) =>
    `<p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#5c6933">${escapeHtml(k)}</p>` +
    `<div style="background:#f6f1e7;padding:12px 14px;margin:0 0 14px;white-space:pre-wrap">${escapeHtml(v)}</div>`).join("");

  try {
    const body = {
      from: "Never Roam Alone <hello@neverroamalone.com>",
      to: [toEmail],
      reply_to: email,
      subject,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1d2a32">
          <h2 style="color:#5c6933;margin:0 0 6px">${heading}</h2>
          <p style="margin:0 0 16px;color:#3a4a52">From: ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
          ${rowsHtml}
          <p style="margin:0;font-size:13px;color:#8a9aa3">Sent from the Community Contributions page on ${escapeHtml(SITE_URL || "Never Roam Alone")}. Reply to this email to answer them directly.</p>
        </div>`
    };
    if (attachments.length) body.attachments = attachments;
    const er = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_API_KEY },
      body: JSON.stringify(body)
    });
    if (!er.ok) {
      const detail = await er.text();
      console.error("[community] STOP: Resend rejected the email. HTTP", er.status, detail.slice(0, 500));
      return json(502, { sent: false, error: "Email service error" });
    }
    console.log("[community] SUCCESS:", kind, "from", email);
    return json(200, { sent: true });
  } catch (e) {
    console.error("[community] STOP:", (e && e.message) || e);
    return json(502, { sent: false, error: "Message failed to send" });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
