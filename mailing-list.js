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
  .nra-ml{position:relative;overflow:hidden;max-width:760px;margin:0 auto;background:#f6efdd;border:1px solid #2b2417;border-radius:0;
    box-shadow:0 12px 28px rgba(43,36,23,.18);padding:40px 36px;text-align:center;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='760' height='230' viewBox='0 0 760 230'%3E%3Cg fill='none'%3E%3Cpath d='M20 185 C 140 120, 230 205, 340 150 S 540 60, 660 95' stroke='%23a8482a' stroke-width='2.5' stroke-dasharray='7 8' stroke-linecap='round' opacity='.7'/%3E%3Ccircle cx='20' cy='185' r='6' fill='%233f5138'/%3E%3Ccircle cx='340' cy='150' r='4.5' fill='%23b0802f'/%3E%3Ccircle cx='500' cy='96' r='4.5' fill='%23b0802f'/%3E%3Cpath d='M648 83 L672 107 M672 83 L648 107' stroke='%23a8482a' stroke-width='5' stroke-linecap='round'/%3E%3Ccircle cx='660' cy='95' r='20' stroke='%23a8482a' stroke-width='1.5' opacity='.5' stroke-dasharray='3 5'/%3E%3C/g%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right -20px bottom -14px}
  .nra-ml::after{content:"";position:absolute;left:6px;right:6px;top:6px;bottom:6px;border:1px solid rgba(43,36,23,.12);pointer-events:none}
  .nra-ml>*{position:relative;z-index:1}
  .nra-ml .ml-kicker{font-family:'Work Sans',monospace;color:#3f5138;font-weight:600;text-transform:uppercase;letter-spacing:.2em;font-size:.66rem;margin:0 0 10px}
  .nra-ml h2{font-family:'Fraunces',Georgia,serif;font-weight:700;font-size:1.7rem;margin:0 0 8px;color:#2b2417}
  .nra-ml p.ml-sub{color:#82755b;margin:0 auto 20px;max-width:460px;font-size:1rem}
  .nra-ml form{display:flex;gap:10px;max-width:480px;margin:0 auto;flex-wrap:wrap;justify-content:center}
  .nra-ml input[type=email]{flex:1;min-width:220px;box-sizing:border-box;font-size:.95rem;font-family:inherit;background:#ece2cc;border:1px solid #2b2417;border-radius:0;padding:13px 16px;color:#2b2417;outline:none;transition:.15s}
  .nra-ml input[type=email]:focus{border-color:#a8482a}
  .nra-ml button{border:none;cursor:pointer;background:#a8482a;color:#fff;font-weight:600;font-size:.8rem;font-family:'Work Sans',monospace;text-transform:uppercase;letter-spacing:.08em;padding:14px 26px;border-radius:0;transition:background .2s}
  .nra-ml button:hover{background:#8a3a20}
  .nra-ml button:disabled{opacity:.6;cursor:default}
  .nra-ml .ml-msg{font-size:.9rem;font-weight:600;margin:14px 0 0;min-height:1.1em;font-family:'Work Sans',monospace}
  .nra-ml .ml-msg.ok{color:#3f5138}
  .nra-ml .ml-msg.err{color:#a8482a}
  .nra-ml .ml-fine{font-size:.72rem;color:#82755b;margin:26px 0 0;position:relative;z-index:2;background:rgba(246,239,221,.9);display:inline-block;padding:3px 10px;border-radius:0}
  .nra-ml .ml-ints{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:16px auto 0;max-width:520px}
  .nra-ml .ml-ints-label{width:100%;font-family:'Work Sans',monospace;font-size:.66rem;text-transform:uppercase;letter-spacing:.14em;color:#82755b;margin:0 0 2px}
  .nra-ml .ml-int{cursor:pointer;background:#ece2cc;border:1px solid #2b2417;border-radius:0;padding:7px 14px;font-size:.78rem;font-family:'Work Sans',monospace;color:#2b2417;transition:.15s}
  .nra-ml .ml-int[aria-pressed=true]{background:#3f5138;color:#fff;border-color:#3f5138}
  @media(max-width:520px){.nra-ml{padding:28px 20px}.nra-ml input[type=email]{min-width:0;width:100%}.nra-ml button{width:100%}}
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
        <div class="ml-ints" role="group" aria-label="Regions you're interested in">
          <p class="ml-ints-label">Regional Content Interested in (optional)</p>
          ${["Europe","Asia","North America","South America","Africa","Middle East","Oceania","All Regions"]
            .map(r => `<button type="button" class="ml-int" aria-pressed="false">${r}</button>`).join("")}
        </div>
        <p class="ml-msg" role="status" aria-live="polite"></p>
        <p class="ml-fine">We'll only use your email to send you Never Roam Alone updates.</p>
      </div>`;

    const form  = mount.querySelector("form");
    const input = mount.querySelector("input[type=email]");
    const btn   = mount.querySelector("button");
    const msgEl = mount.querySelector(".ml-msg");
    const setMsg = (text, kind) => { msgEl.textContent = text || ""; msgEl.className = "ml-msg" + (kind ? " " + kind : ""); };

    // Interest chips: click to toggle on/off.
    mount.querySelectorAll(".ml-int").forEach(chip => {
      chip.addEventListener("click", () => {
        chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") === "true" ? "false" : "true");
      });
    });
    const pickedInterests = () =>
      Array.from(mount.querySelectorAll('.ml-int[aria-pressed="true"]')).map(c => c.textContent.trim());

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
        const res = await window.NRA_AUTH.subscribeMailing(email, source, pickedInterests());
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
