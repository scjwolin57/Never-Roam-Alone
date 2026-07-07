/* =====================================================================
   AUTH.JS — optional accounts for Never Roam Alone (Supabase).

   Three ways to sign in, all landing in the same profile:
     • email + password
     • magic link (we email you a sign-in link — no password)
     • Google

   Also handles: create account (with confirm-password), forgot password
   (dedicated email-only view) → reset screen, and resend-confirmation.

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

  /* Capture the "arrived from a password-reset email" marker NOW, at script load,
     because the Supabase library strips it from the address once it processes it. */
  const arrivedFromRecovery = /type=recovery/.test(location.hash) || /type=recovery/.test(location.search);
  let recoveryShown = false;
  function showRecoveryOnce(){
    if (recoveryShown) return;
    recoveryShown = true;
    openRecoveryModal();
  }

  function onChange(cb){ listeners.push(cb); }
  function emit(){ listeners.forEach(cb => { try{ cb(session, profile); }catch(e){} }); renderWidget(); renderNavWidget(); }

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
      const { data } = await sb.from("profiles")
        .select("display_name,email,notify_replies,bio,home_city,home_country,travel_style,travel_company,website,instagram,avatar_url")
        .eq("id", session.user.id).single();
      profile = data || null;
    }catch(e){ profile = null; }
  }

  async function init(){
    if (!enabled){ readyResolve(); renderWidget(); renderNavWidget(); return; }
    // Safety net: never let the rest of the page wait forever on us. If anything
    // below stalls, release ready() after a few seconds so the forum still loads.
    const readyTimer = setTimeout(readyResolve, 6000);
    try{
      await loadLib();
      sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      const { data } = await sb.auth.getSession();
      session = data ? data.session : null;
      await fetchProfile();
      // Subscribe to auth changes AFTER the initial getSession. Subscribing before
      // it and awaiting a database call inside the callback deadlocks supabase-js
      // (the auth lock is held by getSession while the callback waits on it), which
      // hangs the whole page. We also defer the callback's DB work out of the
      // callback with setTimeout(…,0) so later sign-in/out events can't deadlock either.
      sb.auth.onAuthStateChange((evt, s) => {
        session = s;
        setTimeout(async () => {
          await fetchProfile(); emit();
          if (evt === "PASSWORD_RECOVERY") showRecoveryOnce();
        }, 0);
      });
      // Reset-email case: if we arrived from the reset link and we're signed in,
      // show the new-password screen. The marker was captured at script load, so
      // this works even though we subscribed after getSession stripped the URL.
      if (arrivedFromRecovery && session) showRecoveryOnce();
    }catch(e){ sb = null; session = null; }
    clearTimeout(readyTimer);
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
  .nra-row-btns{display:flex;gap:10px;align-items:center;margin-top:4px}
  .nra-nav-avatar{width:34px;height:34px;border-radius:50%;background:#185e3f;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;text-decoration:none}
  .nra-nav-avatar:hover{background:#0e7c86}
  .nra-nav-signin{width:34px;height:34px;border-radius:50%;background:#185e3f;color:#fff;border:none;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .nra-nav-signin:hover{background:#0e7c86}
  .nra-nav-signin svg{width:17px;height:17px}`;

  function ensureCSS(){
    if (document.getElementById("nra-auth-css")) return;
    const st = document.createElement("style"); st.id = "nra-auth-css"; st.textContent = CSS;
    document.head.appendChild(st);
  }
  const esc = s => String(s||"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const initials = n => { const p = String(n||"?").trim().split(/\s+/); return ((p[0]||"?")[0]+(p.length>1?p[p.length-1][0]:"")).toUpperCase(); };

  /* ---- form-rule constants + helpers, so every validation message stays in one place ---- */
  const MIN_PW_LEN = 6; // matches Supabase's default minimum — raise this to match if you change it in Supabase settings
  const isValidEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  /* Clean page address (no ?query or #hash) for email links to send people back to.
     On a non-web address (like opening the file directly) return undefined so
     Supabase falls back to the Site URL configured in the dashboard. */
  const pageUrl = () => (location.protocol === "http:" || location.protocol === "https:")
    ? location.origin + location.pathname : undefined;

  /* ---- turn Supabase's raw error text into a short, plain-language message ----
     Deliberately vague about whether an email is registered (no "no account found"
     / "already registered" messages) so the form can't be used to fish for which
     emails have signed up — see project decision 2026-07-04. */
  function friendlyAuthError(e, signupMode){
    const raw = (e && e.message) || "";
    const low = raw.toLowerCase();
    if (low.includes("invalid login credentials")) return "Incorrect email or password.";
    if (low.includes("email not confirmed")) return "Please confirm your email first — check your inbox for the link we sent.";
    if (low.includes("already registered") || low.includes("already exists")) return signupMode ? "That didn't go through — check your email for a confirmation link, or try signing in." : "That didn't work — try again.";
    if (low.includes("password") && low.includes("least")) return raw; // Supabase's own "at least N characters" message is already concise
    if (low.includes("rate limit") || low.includes("too many")) return "Too many attempts — please wait a minute and try again.";
    if (low.includes("failed to load") || low.includes("timeout") || low.includes("network")) return "Couldn't reach the sign-in service — check your connection and try again.";
    return raw || "That didn't work — try again.";
  }

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
      // NOTE: the "email me when someone replies" checkbox now lives next to the
      // Post question button on askaroamer.html (wired via NRA_AUTH.setNotify /
      // NRA_AUTH.notifyReplies). It is intentionally no longer in this widget.
      el.innerHTML = `<div class="nra-acct">
        <div class="who-row"><span class="av">${esc(initials(name))}</span>
          <span class="nm">${esc(name)}<span class="em">${esc(session.user.email||"")}</span></span></div>
        <div class="nra-row-btns">
          <a class="nra-btn" href="profile.html" id="nra-edit-profile">Edit profile</a>
          <button class="nra-btn ghost" id="nra-signout">Sign out</button>
        </div>
      </div>`;
      el.querySelector("#nra-signout").addEventListener("click", signOut);
    } else {
      el.innerHTML = `<div class="nra-acct"><strong>Join the community</strong>
        <p class="nra-note">Sign in to put a name on your questions and get an email when someone replies. Totally optional — you can post without an account too.</p>
        <div style="margin-top:10px"><button class="nra-btn" id="nra-signin">Sign in / Create profile</button></div>
      </div>`;
      el.querySelector("#nra-signin").addEventListener("click", openModal);
    }
  }

  /* ---- Compact nav-bar version: sign-in button, or initials circle → profile.html.
     Lives in the shared header (see nav.js), so it shows up on every page. ---- */
  function renderNavWidget(){
    const el = document.getElementById("nra-nav-account");
    if (!el) return;
    ensureCSS();
    if (!enabled){ el.innerHTML = ""; return; } // guest mode: nothing to sign into, keep the nav clean
    if (session){
      const name = (profile && profile.display_name) || session.user.email;
      el.innerHTML = `<a class="nra-nav-avatar" href="profile.html" title="${esc(name)} — your profile">${esc(initials(name))}</a>`;
    } else {
      el.innerHTML = `<button class="nra-nav-signin" id="nra-nav-signin-btn" aria-label="Sign in" title="Sign in">` +
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">` +
        `<circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4.4 3.6-6.5 8-6.5s8 2.1 8 6.5"></path></svg></button>`;
      el.querySelector("#nra-nav-signin-btn").addEventListener("click", openModal);
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
        <div id="nra-pw-view">
          <div class="nra-field"><label>Email</label><input type="email" id="nra-em" autocomplete="email"></div>
          <div class="nra-field"><label>Password</label><input type="password" id="nra-pw" autocomplete="current-password"></div>
          <div class="nra-field" id="nra-pw2-wrap" style="display:none"><label>Confirm password</label><input type="password" id="nra-pw2" autocomplete="new-password"></div>
          <div class="nra-field" id="nra-name-wrap" style="display:none"><label>Display name</label><input type="text" id="nra-dn" maxlength="40" placeholder="How you'll appear on posts"></div>
          <label class="nra-check" id="nra-mailing-wrap" style="display:none"><input type="checkbox" id="nra-mailing"> <span>Email me travel tips &amp; new city guides. No spam — unsubscribe anytime.</span></label>
          <div class="nra-row-btns">
            <button class="nra-btn" id="nra-do-signin">Sign in</button>
            <button class="nra-btn ghost" id="nra-toggle-signup">New here? Create account</button>
          </div>
          <div class="nra-row-btns"><button class="nra-btn ghost" id="nra-forgot">Forgot password?</button></div>
        </div>
        <div id="nra-forgot-view" style="display:none">
          <p class="nra-note" style="margin:0 0 12px">Enter your email and we'll send you a link to reset your password.</p>
          <div class="nra-field"><label>Email</label><input type="email" id="nra-forgot-em" autocomplete="email"></div>
          <div class="nra-row-btns">
            <button class="nra-btn" id="nra-do-forgot">Send reset link</button>
            <button class="nra-btn ghost" id="nra-forgot-back">Back to sign in</button>
          </div>
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
      <div class="nra-row-btns"><button class="nra-btn ghost" id="nra-resend" style="display:none">Resend confirmation email</button></div>
    </div>`;
    document.body.appendChild(bg);
    bg.addEventListener("click", e => { if (e.target === bg) closeModal(); });
    bg.querySelector(".nra-close").addEventListener("click", closeModal);
    bg.querySelectorAll(".nra-tab").forEach(t => t.addEventListener("click", () => {
      bg.querySelectorAll(".nra-tab").forEach(x => x.classList.toggle("active", x === t));
      bg.querySelectorAll("[data-pane]").forEach(p => p.style.display = (p.dataset.pane === t.dataset.tab) ? "" : "none");
      showForgot(false); // leaving and returning to the Password tab always lands on sign-in, not the reset view
    }));
    let signupMode = false;
    const msg = (text, err) => {
      const m = bg.querySelector("#nra-msg"); m.textContent = text; m.className = "nra-msg" + (err ? " err" : ""); m.style.display = text ? "" : "none";
      bg.querySelector("#nra-resend").style.display = "none"; // hidden unless the unconfirmed-email case shows it
    };
    /* ---- run a button through a loading state so people can't double-click their way to duplicate signups ---- */
    async function withLoading(btn, busyText, fn){
      const original = btn.textContent;
      btn.disabled = true; btn.textContent = busyText;
      try{ await fn(); }
      finally{ btn.disabled = false; btn.textContent = original; }
    }
    bg.querySelector("#nra-toggle-signup").addEventListener("click", () => {
      signupMode = !signupMode;
      bg.querySelector("#nra-name-wrap").style.display = signupMode ? "" : "none";
      bg.querySelector("#nra-mailing-wrap").style.display = signupMode ? "" : "none";
      bg.querySelector("#nra-pw2-wrap").style.display = signupMode ? "" : "none";
      bg.querySelector("#nra-forgot").style.display = signupMode ? "none" : "";
      bg.querySelector("#nra-do-signin").textContent = signupMode ? "Create account" : "Sign in";
      bg.querySelector("#nra-toggle-signup").textContent = signupMode ? "Have an account? Sign in" : "New here? Create account";
      msg("");
    });
    bg.querySelector("#nra-do-signin").addEventListener("click", async () => {
      const btn = bg.querySelector("#nra-do-signin");
      const email = bg.querySelector("#nra-em").value.trim(), pw = bg.querySelector("#nra-pw").value;

      /* ---- concise, specific messages for every way the form can be filled in wrong ---- */
      if (!email) return msg("Enter your email address.", true);
      if (!isValidEmail(email)) return msg("That email address doesn't look right — double check it.", true);
      if (!pw) return msg("Enter a password.", true);
      if (signupMode && pw.length < MIN_PW_LEN) return msg(`Password needs to be at least ${MIN_PW_LEN} characters.`, true);
      if (signupMode){
        const pw2 = bg.querySelector("#nra-pw2").value;
        if (pw !== pw2) return msg("Those passwords don't match — try typing them again.", true);
      }

      await withLoading(btn, signupMode ? "Creating account…" : "Signing in…", async () => {
        try{
          if (signupMode){
            const dn = bg.querySelector("#nra-dn").value.trim();
            const { error } = await sb.auth.signUp({ email, password: pw, options:{ data:{ full_name: dn || email.split("@")[0] }, emailRedirectTo: pageUrl() } });
            if (error) throw error;
            // If they ticked the mailing-list box, add them to the list too.
            if (bg.querySelector("#nra-mailing") && bg.querySelector("#nra-mailing").checked){
              subscribeMailing(email, "signup");
            }
            msg("Account created! Check your email to confirm, then sign in.");
          } else {
            const { error } = await sb.auth.signInWithPassword({ email, password: pw });
            if (error) throw error;
            closeModal();
          }
        }catch(e){
          msg(friendlyAuthError(e, signupMode), true);
          // Lost the confirmation email? Offer to send another.
          if (String((e && e.message) || "").toLowerCase().includes("email not confirmed"))
            bg.querySelector("#nra-resend").style.display = "";
        }
      });
    });
    bg.querySelector("#nra-resend").addEventListener("click", async () => {
      const btn = bg.querySelector("#nra-resend");
      const email = bg.querySelector("#nra-em").value.trim();
      if (!email || !isValidEmail(email)) return msg("Enter your email address above first.", true);
      await withLoading(btn, "Sending…", async () => {
        try{
          const { error } = await sb.auth.resend({ type: "signup", email, options:{ emailRedirectTo: pageUrl() } });
          if (error) throw error;
          msg("Confirmation email sent — check your inbox (and spam folder).");
        }catch(e){ msg(friendlyAuthError(e, false), true); }
      });
    });
    /* Forgot password gets its own simple view: just an email field. */
    const showForgot = (on) => {
      bg.querySelector("#nra-pw-view").style.display = on ? "none" : "";
      bg.querySelector("#nra-forgot-view").style.display = on ? "" : "none";
      if (on) bg.querySelector("#nra-forgot-em").value = bg.querySelector("#nra-em").value.trim();
      msg("");
    };
    bg.querySelector("#nra-forgot").addEventListener("click", () => showForgot(true));
    bg.querySelector("#nra-forgot-back").addEventListener("click", () => showForgot(false));
    bg.querySelector("#nra-do-forgot").addEventListener("click", async () => {
      const btn = bg.querySelector("#nra-do-forgot");
      const email = bg.querySelector("#nra-forgot-em").value.trim();
      if (!email) return msg("Enter your email address.", true);
      if (!isValidEmail(email)) return msg("That email address doesn't look right — double check it.", true);
      await withLoading(btn, "Sending…", async () => {
        try{
          const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: pageUrl() });
          if (error) throw error;
          // Same message whether or not the email has an account — keeps the form
          // from being used to fish for registered emails (decision 2026-07-04).
          msg("If that email has an account, a reset link is on its way — check your inbox.");
        }catch(e){ msg(friendlyAuthError(e, false), true); }
      });
    });
    bg.querySelector("#nra-do-magic").addEventListener("click", async () => {
      const btn = bg.querySelector("#nra-do-magic");
      const email = bg.querySelector("#nra-magic-em").value.trim();
      if (!email) return msg("Enter your email address.", true);
      if (!isValidEmail(email)) return msg("That email address doesn't look right — double check it.", true);
      await withLoading(btn, "Sending…", async () => {
        try{
          const { error } = await sb.auth.signInWithOtp({ email, options:{ emailRedirectTo: pageUrl() } });
          if (error) throw error;
          msg("Link sent! Check your inbox and click it to sign in.");
        }catch(e){ msg(friendlyAuthError(e, false), true); }
      });
    });
    bg.querySelector("#nra-do-google").addEventListener("click", async () => {
      try{
        const { error } = await sb.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: pageUrl() } });
        if (error) throw error;
      }catch(e){ msg(friendlyAuthError(e, false), true); }
    });
  }
  function closeModal(){ const m = document.getElementById("nra-modal-bg"); if (m) m.remove(); }

  /* ---- shown when someone lands here from a password-reset email ---- */
  function openRecoveryModal(){
    ensureCSS();
    closeModal();
    const bg = document.createElement("div");
    bg.className = "nra-modal-bg"; bg.id = "nra-modal-bg";
    bg.innerHTML = `<div class="nra-modal" role="dialog" aria-label="Choose a new password">
      <button class="nra-close" aria-label="Close">✕</button>
      <h3>Choose a new password</h3>
      <p class="sub">You're signed in from your reset link — set a new password to finish.</p>
      <div class="nra-field"><label>New password</label><input type="password" id="nra-new-pw" autocomplete="new-password"></div>
      <div class="nra-field"><label>Confirm new password</label><input type="password" id="nra-new-pw2" autocomplete="new-password"></div>
      <div class="nra-row-btns"><button class="nra-btn" id="nra-do-reset">Save new password</button></div>
      <p class="nra-msg" id="nra-msg" style="display:none"></p>
    </div>`;
    document.body.appendChild(bg);
    const msg = (text, err) => { const m = bg.querySelector("#nra-msg"); m.textContent = text; m.className = "nra-msg" + (err ? " err" : ""); m.style.display = text ? "" : "none"; };
    bg.querySelector(".nra-close").addEventListener("click", closeModal);
    bg.addEventListener("click", e => { if (e.target === bg) closeModal(); });
    bg.querySelector("#nra-do-reset").addEventListener("click", async () => {
      const btn = bg.querySelector("#nra-do-reset");
      const pw = bg.querySelector("#nra-new-pw").value, pw2 = bg.querySelector("#nra-new-pw2").value;
      if (!pw) return msg("Enter a new password.", true);
      if (pw.length < MIN_PW_LEN) return msg(`Password needs to be at least ${MIN_PW_LEN} characters.`, true);
      if (pw !== pw2) return msg("Those passwords don't match — try typing them again.", true);
      const original = btn.textContent;
      btn.disabled = true; btn.textContent = "Saving…";
      try{
        const { error } = await sb.auth.updateUser({ password: pw });
        if (error) throw error;
        msg("Password updated! You're signed in.");
        setTimeout(closeModal, 1600);
      }catch(e){ msg(friendlyAuthError(e, false), true); }
      finally{ btn.disabled = false; btn.textContent = original; }
    });
  }

  async function signOut(){ if (sb) await sb.auth.signOut(); session = null; profile = null; emit(); }

  /* ---------------- mailing list ----------------
     The list lives in the "mailing_list" table (see mailing-list-setup.sql).
     Anyone can add an email; a signed-in person can see/remove only their own.
     Used by: the signup checkbox above, the profile page toggle, and the
     signup forms on the site (mailing-list.js). */
  function sendConfirmation(email){
    // Best-effort: the address is already saved, so a failed email is harmless.
    try{
      fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }).catch(() => {});
    }catch(e){ /* ignore */ }
  }
  async function subscribeMailing(email, source){
    email = String(email || "").trim().toLowerCase();
    if (!isValidEmail(email)) return { ok:false, error:"That email address doesn't look right — double check it." };
    if (!sb) return { ok:false, error:"Sign-ups aren't switched on yet." };
    const row = { email, source: source || "site" };
    if (session) row.user_id = session.user.id;
    try{
      const { error } = await sb.from("mailing_list").insert(row);
      if (error){
        // 23505 = already on the list — treat as success so we never scare a
        // returning subscriber with an error.
        if (error.code === "23505" || /duplicate|already|unique/i.test(error.message || ""))
          return { ok:true, already:true };
        return { ok:false, error: error.message || "Couldn't sign you up — please try again." };
      }
      sendConfirmation(email);
      return { ok:true };
    }catch(e){ return { ok:false, error:"Couldn't reach the server — please try again." }; }
  }
  // Is the signed-in person on the list? false if not signed in / not subscribed.
  async function mailingStatus(){
    if (!sb || !session) return false;
    try{
      const { data } = await sb.from("mailing_list").select("id").eq("user_id", session.user.id).limit(1);
      return !!(data && data.length);
    }catch(e){ return false; }
  }
  async function unsubscribeMailing(){
    if (!sb || !session) return { ok:false, error:"You need to be signed in." };
    try{
      const { error } = await sb.from("mailing_list").delete().eq("user_id", session.user.id);
      if (error) return { ok:false, error: error.message };
      return { ok:true };
    }catch(e){ return { ok:false, error:"Couldn't reach the server — please try again." }; }
  }
  /* Save the reply-notification preference on the user's profile.
     Returns true on success, false if not signed in or the update failed —
     so callers (e.g. the checkbox on askaroamer.html) can revert on failure. */
  async function setNotify(on){
    if (!sb || !session) return false;
    try{
      const { error } = await sb.from("profiles").update({ notify_replies: !!on }).eq("id", session.user.id);
      if (error) return false;
      if (profile) profile.notify_replies = !!on;
      return true;
    }catch(e){ return false; }
  }

  /* Save profile fields (display name, bio, home city/country, travel style, socials).
     Only whitelisted columns are written. Returns {ok:true} or {ok:false, error:"…"}. */
  const PROFILE_FIELDS = ["display_name","bio","home_city","home_country","travel_style","travel_company","website","instagram","avatar_url"];
  async function updateProfile(fields){
    if (!sb || !session) return { ok:false, error:"You need to be signed in." };
    const patch = {};
    PROFILE_FIELDS.forEach(k => { if (Object.prototype.hasOwnProperty.call(fields, k)) patch[k] = fields[k]; });
    if (!Object.keys(patch).length) return { ok:true };
    try{
      const { error } = await sb.from("profiles").update(patch).eq("id", session.user.id);
      if (error) return { ok:false, error:error.message || "Couldn't save your profile." };
      profile = Object.assign({}, profile, patch);
      emit();
      return { ok:true };
    }catch(e){ return { ok:false, error:"Couldn't reach the server — try again." }; }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return {
    enabled,
    ready: () => readyP,
    client: () => sb,
    user: () => session ? session.user : null,
    displayName: () => (profile && profile.display_name) || (session ? session.user.email : ""),
    // Current "email me when someone replies" preference (defaults to on when signed in).
    notifyReplies: () => profile ? profile.notify_replies !== false : true,
    profile: () => profile,
    updateProfile,
    onChange,
    signOut,
    setNotify,
    subscribeMailing,
    mailingStatus,
    unsubscribeMailing,
    openModal,
    renderNavWidget
  };
})();
