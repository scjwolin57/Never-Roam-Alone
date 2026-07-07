/* =====================================================================
   MAILING-LIST.JS — the email signup form used across the site.

   HOW TO ADD THE FORM TO A PAGE:
     1. Put this placeholder wherever you want the form to appear:
          <div data-nra-signup data-source="index"></div>
        (data-source is optional — it just records which page they used.)
     2. Load nra-config.js, auth.js, then this file near the end of the page:
          <script src="nra-config.js"></script>
          <script src="auth.js"></script>
          <script src="mailing-list.js"></script>

   The email address is saved to the "mailing_list" table in Supabase
   (see mailing-list-setup.sql) and a confirmation email is sent. All the
   database + email work is shared with auth.js (NRA_AUTH.subscribeMailing),
   so this file is just the form itself.
   ===================================================================== */

(function(){
  const CSS = `
  .nra-ml{max-width:640px;margin:0 auto;background:#fff;border-radius:20px;
    box-shadow:0 10px 30px rgba(20,40,50,.12);padding:32px 28px;text-align:center}
  .nra-ml .ml-kicker{color:#0e7c86;font-weight:700;text-transform:uppercase;
    letter-spacing:.18em;font-size:.72rem;margin:0 0 8px}
  .nra-ml h2{font-family:Georgia,serif;font-size:1.6rem;margin:0 0 8px;color:#1d2a32}
  .nra-ml p.ml-sub{color:#5b6b75;margin:0 auto 20px;max-width:460px;font-size:1rem}
  .nra-ml form{display:flex;gap:10px;max-width:460px;margin:0 auto;flex-wrap:wrap;justify-content:center}
  .nra-ml input[type=email]{flex:1;min-width:220px;box-sizing:border-box;font-size:1rem;
    font-family:inherit;background:#f6f1e7;border:2px solid rgba(24,94,63,.25);
    border-radius:26px;padding:13px 18px;color:#1d2a32;outline:none;transition:.15s}
  .nra-ml input[type=email]:focus{border-color:#185e3f;box-shadow:0 4px 16px rgba(24,94,63,.14)}
  .nra-ml button{border:none;cursor:pointer;background:#185e3f;color:#fff;font-weight:700;
    font-size:1rem;font-family:inherit;padding:13px 28px;border-radius:26px;transition:background .2s}
  .nra-ml button:hover{background:#0e7c86}
  .nra-ml button:disabled{opacity:.6;cursor:default}
  .nra-ml .ml-msg{font-size:.9rem;font-weight:600;margin:14px 0 0;min-height:1.1em}
  .nra-ml .ml-msg.ok{color:#0e7c86}
  .nra-ml .ml-msg.err{color:#b34a3a}
  .nra-ml .ml-fine{font-size:.75rem;color:#8a9aa3;margin:12px 0 0}
  @media(max-width:520px){.nra-ml{padding:26px 18px}.nra-ml input[type=email]{min-width:0;width:100%}.nra-ml button{width:100%}}
  `;

  function ensureCSS(){
    if (document.getElementById("nra-ml-css")) return;
    const st = document.createElement("style");
    st.id = "nra-ml-css"; st.textContent = CSS;
    document.head.appendChild(st);
  }

  const isValidEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s||"").trim());

  function build(mount){
    const source = mount.getAttribute("data-source") ||
      (location.pathname.split("/").pop() || "site").replace(/\.html$/, "") || "site";
    mount.innerHTML = `
      <div class="nra-ml">
        <p class="ml-kicker">Never Roam Alone</p>
        <h2>Get travel tips in your inbox</h2>
        <p class="ml-sub">New city guides, honest travel tips, and stories from the road — straight to your inbox. No spam, unsubscribe anytime.</p>
        <form novalidate>
          <input type="email" placeholder="you@example.com" autocomplete="email" aria-label="Email address" required>
          <button type="submit">Subscribe</button>
        </form>
        <p class="ml-msg" role="status" aria-live="polite"></p>
        <p class="ml-fine">We'll only use your email to send you Never Roam Alone updates.</p>
      </div>`;

    const form  = mount.querySelector("form");
    const input = mount.querySelector("input[type=email]");
    const btn   = mount.querySelector("button");
    const msgEl = mount.querySelector(".ml-msg");
    const setMsg = (text, kind) => { msgEl.textContent = text || ""; msgEl.className = "ml-msg" + (kind ? " " + kind : ""); };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!email) return setMsg("Enter your email address.", "err");
      if (!isValidEmail(email)) return setMsg("That email address doesn't look right — double check it.", "err");
      if (!window.NRA_AUTH || !window.NRA_AUTH.subscribeMailing)
        return setMsg("Sign-ups aren't available right now — please try again later.", "err");

      const original = btn.textContent;
      btn.disabled = true; btn.textContent = "Subscribing…"; setMsg("");
      try{
        await window.NRA_AUTH.ready();
        const res = await window.NRA_AUTH.subscribeMailing(email, source);
        if (res && res.ok){
          setMsg(res.already ? "You're already on the list — thanks for the love!" : "You're in! Check your inbox for a confirmation.", "ok");
          if (!res.already) input.value = "";
        } else {
          setMsg((res && res.error) || "Couldn't sign you up — please try again.", "err");
        }
      }catch(err){
        setMsg("Couldn't sign you up — please try again.", "err");
      }finally{
        btn.disabled = false; btn.textContent = original;
      }
    });
  }

  function init(){
    const mounts = document.querySelectorAll("[data-nra-signup]");
    if (!mounts.length) return;
    ensureCSS();
    mounts.forEach(build);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
