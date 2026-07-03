/* =====================================================================
   AUTH.JS — optional accounts for Never Roam Alone (Supabase).

   Three ways to sign in, all landing in the same profile:
     • email + password
     • magic link (we email you a sign-in link — no password)
     • Google

   If nra-config.js has no Supabase keys, this module stays dormant and
   the site runs in guest mode. Login is always optional (criterion 17).

   Pages opt in by adding <div id="nra-account"></div> somewhere and
   loading nra-config.js + this file. Exposes window.NRA_AUTH.
   ===================================================================== */

window.NRA_AUTH = (function(){
  const cfg = window.NRA_CONFIG || {};
  const enabled = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  let sb = null, session = null, profile = null;
  const listeners = [];
  let readyResolve; const readyP = new Promise(res => readyResolve = res);

  function onChange(cb){ listeners.push(cb); }
  function emit(){ listeners.forEach(cb => { try{ cb(session, profile); }catch(e){} }); renderWidget(); }

  /* ---- load the Supabase browser library from its CDN (only if configured) ---- */
  function loadLib(){
    return new Promise((res, rej) => {
      if (window.supabase && window.supabase.createClient) return res();
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
      s.onload = () => res();
      s.onerror = () => rej(new Error("supabase lib failed to load"));
      document.head.appendChild(s);
      setTimeout(() => rej(new Error("supabase lib timeout")), 8000);  // never hang the page
    });
  }

  async function fetchProfile(){
    if (!sb || !session) { profile = null; return; }
    try{
      const { data } = await sb.from("profiles").select("display_name,email,notify_replies").eq("id", session.user.id).single();
      profile = data || null;
    }catch(e){ profile = null; }
  }

  async function init(){
    if (!enabled){ readyResolve(); renderWidget(); return; }
    try{
      await loadLib();
      sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      const { data } = await sb.auth.getSession();
      session = data ? data.session : null;
      await fetchProfile();
      sb.auth.onAuthStateChange(async (_evt, s) => { session = s; await fetchProfile(); emit(); });
    }catch(e){ sb = null; session = null; }
    readyResolve();
    emit();
  }

  /* ---------------- account widget + sign-in modal ---------------- */
  const CSS = `
  .nra-acct{font-size:.9rem}
  .nra-acct .who-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
  .nra-acct .av{width:34px;height:34px;border-radius:50%;background:#185e3f;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
  .nra-acct .nm{font-weight:700}
  .nra-acct .em{display:block;font-size:.74rem;color:#5b6b75;font-weight:400;max-width:170px;overflow:hidden;text-overflow:ellipsis}
  .nra-btn{display:inline-block;background:#185e3f;color:#fff;font-weight:700;font-size:.85rem;border:none;border-radius:22px;padding:9px 18px;cursor:pointer}
  .nra-btn:hover{background:#0e7c86}
  .nra-btn.ghost{background:none;color:#5b6b75;font-weight:600;text-decoration:underline;padding:6px 4px}
  .nra-note{font-size:.78rem;color:#5b6b75;margin:8px 0 0}
  .nra-check{display:flex;align-items:flex-start;gap:8px;font-size:.8rem;color:#1d2a32;margin-top:10px;cursor:pointer}
  .nra-check input{margin-top:2px;accent-color:#185e3f}
  .nra-modal-bg{position:fixed;inset:0;background:rgba(20,40,50,.55);z-index:200;display:flex;align-items:center;justify-content:center;padding:18px}
  .nra-modal{background:#fff;border-radius:18px;max-width:400px;width:100%;padding:26px 24px;box-shadow:0 24px 70px rgba(0,0,0,.35);max-height:92vh;overflow:auto}
  .nra-modal h3{font-family:Georgia,serif;margin:0 0 4px;font-size:1.35rem}
  .nra-modal .sub{color:#5b6b75;font-size:.86rem;margin:0 0 16px}
  .nra-tabs{display:flex;gap:6px;margin-bottom:16px}
  .nra-tab{flex:1;border:2px solid rgba(24,94,63,.22);background:#fff;border-radius:10px;padding:8px 4px;font-size:.78rem;font-weight:700;cursor:pointer;color:#1d2a32}
  .nra-tab.active{border-color:#185e3f;background:rgba(24,94,63,.07)}
  .nra-field{margin-bottom:12px}
  .nra-field label{display:block;font-size:.76rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#5b6b75;margin-bottom:5px}
  .nra-field input{width:100%;box-sizing:border-box;font-size:.95rem;font-family:inherit;background:#f6f1e7;border:2px solid rgba(24,94,63,.25);border-radius:10px;padding:11px 12px}
  .nra-field input:focus{outline:none;border-color:#185e3f}
  .nra-msg{font-size:.82rem;margin:10px 0 0;color:#0e7c86}
  .nra-msg.err{color:#b34a3a}
  .nra-google{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;border:2px solid rgba(24,94,63,.25);background:#fff;border-radius:10px;padding:10px;font-weight:700;font-size:.9rem;cursor:pointer;margin-top:4px}
  .nra-google:hover{border-color:#185e3f}
  .nra-close{float:right;border:none;background:none;font-size:1.2rem;cursor:pointer;color:#5b6b75}
  .nra-row-btns{display:flex;gap:10px;align-items:center;margin-top:4px}`;

  function ensureCSS(){
    if (document.getElementById("nra-auth-css")) return;
    const st = document.createElement("style"); st.id = "nra-auth-css"; st.textContent = CSS;
    document.head.appendChild(st);
  }
  const esc = s => String(s||"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const initials = n => { const p = String(n||"?").trim().split(/\s+/); return ((p[0]||"?")[0]+(p.length>1?p[p.length-1][0]:"")).toUpperCase(); };

  function renderWidget(){
    const el = document.getElementById("nra-account");
    if (!el) return;
    ensureCSS();
    if (!enabled){
      el.innerHTML = `<div class="nra-acct"><strong>Profiles coming online soon</strong>
        <p class="nra-note">Accounts aren't connected yet, so posts save in your own browser for now. Everything else works normally.</p></div>`;
      return;
    }
    if (session){
      const name = (profile && profile.display_name) || session.user.email;
      const notify = profile ? profile.notify_replies !== false : true;
      el.innerHTML = `<div class="nra-acct">
        <div class="who-row"><span class="av">${esc(initials(name))}</span>
          <span class="nm">${esc(name)}<span class="em">${esc(session.user.email||"")}</span></span></div>
        <label class="nra-check"><input type="checkbox" id="nra-notify" ${notify?"checked":""}>
          <span>Email me when someone replies to my questions</span></label>
        <div class="nra-row-btns"><button class="nra-btn ghost" id="nra-signout">Sign out</button></div>
      </div>`;
      const box = el.querySelector("#nra-notify");
      if (box) box.addEventListener("change", () => setNotify(box.checked));
      el.querySelector("#nra-signout").addEventListener("click", signOut);
    } else {
      el.innerHTML = `<div class="nra-acct"><strong>Join the community</strong>
        <p class="nra-note">Sign in to put a name on your questions and get an email when someone replies. Totally optional — you can post without an account too.</p>
        <div style="margin-top:10px"><button class="nra-btn" id="nra-signin">Sign in / Create profile</button></div>
      </div>`;
      el.querySelector("#nra-signin").addEventListener("click", openModal);
    }
  }

  function openModal(){
    ensureCSS();
    closeModal();
    const bg = document.createElement("div");
    bg.className = "nra-modal-bg"; bg.id = "nra-modal-bg";
    bg.innerHTML = `<div class="nra-modal" role="dialog" aria-label="Sign in">
      <button class="nra-close" aria-label="Close">✕</button>
      <h3>Welcome, Roamer</h3>
      <p class="sub">One profile, three ways in — pick whichever you like.</p>
      <div class="nra-tabs">
        <button class="nra-tab active" data-tab="password">Password</button>
        <button class="nra-tab" data-tab="magic">Email me a link</button>
        <button class="nra-tab" data-tab="google">Google</button>
      </div>
      <div data-pane="password">
        <div class="nra-field"><label>Email</label><input type="email" id="nra-em" autocomplete="email"></div>
        <div class="nra-field"><label>Password</label><input type="password" id="nra-pw" autocomplete="current-password"></div>
        <div class="nra-field" id="nra-name-wrap" style="display:none"><label>Display name</label><input type="text" id="nra-dn" maxlength="40" placeholder="How you'll appear on posts"></div>
        <div class="nra-row-btns">
          <button class="nra-btn" id="nra-do-signin">Sign in</button>
          <button class="nra-btn ghost" id="nra-toggle-signup">New here? Create account</button>
        </div>
      </div>
      <div data-pane="magic" style="display:none">
        <div class="nra-field"><label>Email</label><input type="email" id="nra-magic-em" autocomplete="email"></div>
        <button class="nra-btn" id="nra-do-magic">Email me a sign-in link</button>
        <p class="nra-note">No password needed — we'll send a link that signs you in with one click.</p>
      </div>
      <div data-pane="google" style="display:none">
        <button class="nra-google" id="nra-do-google">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.2 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
          Sign in with Google
        </button>
        <p class="nra-note">Uses your Google account — nothing extra to remember.</p>
      </div>
      <p class="nra-msg" id="nra-msg" style="display:none"></p>
    </div>`;
    document.body.appendChild(bg);
    bg.addEventListener("click", e => { if (e.target === bg) closeModal(); });
    bg.querySelector(".nra-close").addEventListener("click", closeModal);
    bg.querySelectorAll(".nra-tab").forEach(t => t.addEventListener("click", () => {
      bg.querySelectorAll(".nra-tab").forEach(x => x.classList.toggle("active", x === t));
      bg.querySelectorAll("[data-pane]").forEach(p => p.style.display = (p.dataset.pane === t.dataset.tab) ? "" : "none");
      msg("");
    }));
    let signupMode = false;
    const msg = (text, err) => { const m = bg.querySelector("#nra-msg"); m.textContent = text; m.className = "nra-msg" + (err ? " err" : ""); m.style.display = text ? "" : "none"; };
    bg.querySelector("#nra-toggle-signup").addEventListener("click", () => {
      signupMode = !signupMode;
      bg.querySelector("#nra-name-wrap").style.display = signupMode ? "" : "none";
      bg.querySelector("#nra-do-signin").textContent = signupMode ? "Create account" : "Sign in";
      bg.querySelector("#nra-toggle-signup").textContent = signupMode ? "Have an account? Sign in" : "New here? Create account";
      msg("");
    });
    bg.querySelector("#nra-do-signin").addEventListener("click", async () => {
      const email = bg.querySelector("#nra-em").value.trim(), pw = bg.querySelector("#nra-pw").value;
      if (!email || !pw) return msg("Enter your email and a password.", true);
      try{
        if (signupMode){
          const dn = bg.querySelector("#nra-dn").value.trim();
          const { error } = await sb.auth.signUp({ email, password: pw, options:{ data:{ full_name: dn || email.split("@")[0] } } });
          if (error) throw error;
          msg("Account created! Check your email to confirm, then sign in.");
        } else {
          const { error } = await sb.auth.signInWithPassword({ email, password: pw });
          if (error) throw error;
          closeModal();
        }
      }catch(e){ msg(e.message || "That didn't work — try again.", true); }
    });
    bg.querySelector("#nra-do-magic").addEventListener("click", async () => {
      const email = bg.querySelector("#nra-magic-em").value.trim();
      if (!email) return msg("Enter your email first.", true);
      try{
        const { error } = await sb.auth.signInWithOtp({ email, options:{ emailRedirectTo: location.href } });
        if (error) throw error;
        msg("Link sent! Check your inbox and click it to sign in.");
      }catch(e){ msg(e.message || "Couldn't send the link — try again.", true); }
    });
    bg.querySelector("#nra-do-google").addEventListener("click", async () => {
      try{
        const { error } = await sb.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: location.href } });
        if (error) throw error;
      }catch(e){ msg(e.message || "Google sign-in isn't set up yet.", true); }
    });
  }
  function closeModal(){ const m = document.getElementById("nra-modal-bg"); if (m) m.remove(); }

  async function signOut(){ if (sb) await sb.auth.signOut(); session = null; profile = null; emit(); }
  async function setNotify(on){
    if (!sb || !session) return;
    try{ await sb.from("profiles").update({ notify_replies: !!on }).eq("id", session.user.id); if (profile) profile.notify_replies = !!on; }catch(e){}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return {
    enabled,
    ready: () => readyP,
    client: () => sb,
    user: () => session ? session.user : null,
    displayName: () => (profile && profile.display_name) || (session ? session.user.email : ""),
    onChange,
    signOut,
    setNotify,
    openModal
  };
})();
