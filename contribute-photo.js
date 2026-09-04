/* =====================================================================
   CONTRIBUTE-PHOTO.JS — the shared "contribute a photo" dialog.

   Originally this form lived inline in city.html and only knew about
   landmarks. It now works for any photo slot on the site: landmark cards,
   the city hero, a neighborhood hero, a food dish, and anything added
   later. Nothing about the dialog is city-page specific.

   Open it with:

     NRA_PHOTO_CONTRIB.open({
       kind:    "landmark",          // see KINDS below (or any custom label)
       subject: "Brunei Museum",     // what the photo is OF — fills the title field
       city:    "Bandar Seri Begawan",
       country: "Brunei",            // optional
       subjectIdx: 3,                // optional — index within its list
       context: "Kampong Ayer"       // optional — e.g. the neighborhood name
     });

   The submission goes to the contribute-photo Netlify function, which
   re-validates everything server-side and stores the photo privately for
   review. Nothing a visitor sends here is trusted by the server.

   Three things this module is careful about:
     1. The title field is filled from the photo slot the button belongs to,
        so a reviewer always knows what the photo is meant to replace.
     2. "Credit my Never Roam Alone profile" needs a signed-in account. When
        nobody is signed in, that option is disabled and a sign-in button is
        offered in its place; the choice re-enables itself the moment the
        visitor signs in, without losing the rest of the form.
     3. The rights confirmation is a real licence grant with a typed
        signature, and the exact wording agreed to is stored with the row.
   ===================================================================== */

window.NRA_PHOTO_CONTRIB = (function(){
  "use strict";

  /* The photo slots we know about. `label` is what the visitor sees above the
     read-only title field; `hint` tailors the file-format advice to the shape
     that slot needs. Any other kind string is accepted and shown as-is. */
  var KINDS = {
    "landmark":         { label: "Landmark",              hint: "Landscape shots suit the guide layout best." },
    "city-hero":        { label: "City hero photo",       hint: "Wide landscape shots work best — this one runs full width across the top of the page." },
    "neighborhood-hero":{ label: "Neighborhood hero photo", hint: "Wide landscape shots work best — this one runs across the top of the neighborhood card." },
    "food-dish":        { label: "Food dish",             hint: "A clear, well-lit shot of the dish itself works best." },
    "other":            { label: "Photo",                 hint: "Landscape shots suit the guide layout best." }
  };

  /* ---------------------------------------------------------------------
     THE LICENCE GRANT.

     Keep this text and its version in step: every submission stores the
     version, the full wording, the typed signature and the moment it was
     agreed, so there is a record of exactly what each contributor agreed to
     even after the wording changes. If you edit the wording, bump the
     version — never edit a version in place.
     --------------------------------------------------------------------- */
  var LICENSE_VERSION = "2026-09-03.1";
  var LICENSE_TEXT = [
    "I am the photographer and sole copyright owner of this photograph, or I am otherwise fully authorised to grant the licence below.",
    "I grant Never Roam Alone a perpetual, irrevocable, worldwide, royalty-free, fully paid-up, non-exclusive, sub-licensable and transferable licence to store, host, reproduce, crop, resize, retouch, publish, display, distribute and otherwise use this photograph on the Never Roam Alone website and in promotion of the website, in any media now known or later developed, with or without a credit.",
    "I keep my copyright in the photograph and may continue to use and license it however I wish.",
    "The photograph is my original work, it does not infringe anyone's copyright, trademark, privacy, publicity or other rights, and I have obtained every release or permission needed for any identifiable person or private property shown in it.",
    "I agree to indemnify Never Roam Alone against any claim, loss or expense arising from a breach of these confirmations.",
    "I am at least 18 years old, or I have my parent's or guardian's permission to make this grant.",
    "I understand Never Roam Alone is under no obligation to publish the photograph and may remove it at any time.",
    "I agree to the Photo Contribution Terms, and I intend my typed name and this checkbox to be my electronic signature, legally equivalent to a handwritten one."
  ];

  /* ---------- styles (injected once, works on any page) ---------- */
  var CSS = [
    ".cf-back{position:fixed;inset:0;z-index:80;background:rgba(43,36,23,.55);display:flex;",
    "  align-items:flex-start;justify-content:center;padding:36px 16px;overflow:auto}",
    ".cf-box{background:var(--card,#fff);border-radius:4px;max-width:520px;width:100%;",
    "  box-shadow:0 24px 60px rgba(43,36,23,.4);padding:22px 24px 24px;position:relative}",
    ".cf-box h3{margin:0 0 4px;font-size:1.15rem}",
    ".cf-sub{margin:0 0 16px;font-size:.85rem;color:var(--muted,#666)}",
    ".cf-close{position:absolute;top:10px;right:12px;border:none;background:none;font-size:1.5rem;",
    "  line-height:1;cursor:pointer;color:#8a7f66}",
    ".cf-close:hover{color:var(--coral,#e2725b)}",
    ".cf-f{margin-bottom:14px}",
    ".cf-f label{display:block;font-size:.82rem;font-weight:700;margin-bottom:5px}",
    ".cf-f input[type=text],.cf-f input[type=url],.cf-f select,.cf-f input[type=file]{",
    "  width:100%;padding:8px 10px;border:1px solid #cfc7b4;border-radius:3px;font:inherit;font-size:.9rem;",
    "  background:#fff}",
    ".cf-f input:disabled{background:#f2efe6;color:#8a7f66}",
    ".cf-row{display:flex;gap:10px}",
    ".cf-row>*{flex:1}",
    ".cf-opt{display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;font-size:.88rem;font-weight:400}",
    ".cf-opt input{margin-top:3px;flex:none;width:auto}",
    ".cf-note{font-size:.78rem;color:var(--muted,#777);margin:4px 0 0}",
    ".cf-terms{display:flex;gap:9px;align-items:flex-start;font-size:.8rem;line-height:1.45;",
    "  background:#f7f4ea;border:1px solid #e3dccb;border-radius:3px;padding:11px 12px;margin:4px 0 12px}",
    ".cf-terms input{margin-top:2px;flex:none}",
    ".cf-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    ".cf-submit{background:var(--teal,#2a7f7f);color:#fff;border:1px solid var(--teal,#2a7f7f);border-radius:3px;",
    "  padding:9px 18px;font:inherit;cursor:pointer}",
    ".cf-submit:hover:not(:disabled){background:var(--coral,#e2725b);border-color:var(--coral,#e2725b)}",
    ".cf-submit:disabled{opacity:.55;cursor:default}",
    ".cf-cancel{background:none;border:1px solid #cfc7b4;border-radius:3px;padding:9px 16px;font:inherit;",
    "  cursor:pointer;color:#5c5340}",
    ".cf-cancel:hover{border-color:var(--coral,#e2725b);color:var(--coral,#e2725b)}",
    ".cf-msg{font-size:.82rem;color:var(--muted,#666)}",
    ".cf-msg.err{color:#b3403a}",
    /* --- profile-credit sign-in prompt --- */
    ".cf-opt.is-locked{color:#8a7f66}",
    ".cf-signin{margin:2px 0 10px 26px;font-size:.8rem;line-height:1.45;color:#5c5340}",
    ".cf-signin-btn{background:none;border:1px solid var(--teal,#2a7f7f);color:var(--teal,#2a7f7f);",
    "  border-radius:3px;padding:5px 11px;font:inherit;font-size:.8rem;cursor:pointer;margin-top:5px}",
    ".cf-signin-btn:hover{background:var(--teal,#2a7f7f);color:#fff}",
    ".cf-signed{margin:2px 0 10px 26px;font-size:.8rem;color:#5c5340}",
    /* --- licence grant --- */
    ".cf-terms-full{margin:0 0 10px;padding:11px 12px;border:1px solid #e3dccb;border-radius:3px;",
    "  background:#fcfaf4;font-size:.76rem;line-height:1.5;color:#5c5340;max-height:170px;overflow:auto}",
    ".cf-terms-full ul{margin:6px 0 0;padding-left:17px}",
    ".cf-terms-full li{margin-bottom:5px}",
    ".cf-sig{margin:0 0 14px}",
    ".cf-sig label{display:block;font-size:.82rem;font-weight:700;margin-bottom:5px}",
    ".cf-sig input{width:100%;padding:8px 10px;border:1px solid #cfc7b4;border-radius:3px;font:inherit;",
    "  font-size:.95rem;font-style:italic;background:#fff}",
    "@media(max-width:560px){.cf-back{padding:12px}.cf-row{flex-direction:column;gap:0}}"
  ].join("\n");

  function ensureCSS(){
    if (document.getElementById("nra-cpf-css")) return;
    var s = document.createElement("style");
    s.id = "nra-cpf-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(t){
    return String(t == null ? "" : t).replace(/[<>&"]/g, function(ch){
      return { "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[ch];
    });
  }

  var AUTH = function(){ return window.NRA_AUTH; };
  function authEnabled(){ var a = AUTH(); return !!(a && a.enabled); }
  function signedInUser(){ var a = AUTH(); return a && a.user ? a.user() : null; }

  /* The Supabase access token, so the server can prove who is claiming the
     profile credit rather than taking the browser's word for it. */
  async function accessToken(){
    var a = AUTH();
    if (!a || !a.client) return "";
    try {
      var sb = a.client();
      if (!sb) return "";
      var res = await sb.auth.getSession();
      return (res && res.data && res.data.session && res.data.session.access_token) || "";
    } catch (e) { return ""; }
  }

  /* ---------- the dialog ---------- */
  function open(opts){
    opts = opts || {};
    var kindKey = String(opts.kind || "other");
    var meta    = KINDS[kindKey] || { label: kindKey, hint: KINDS.other.hint };
    var subject = String(opts.subject || "").trim();
    var city    = String(opts.city || "").trim();
    var country = String(opts.country || "").trim();
    var context = String(opts.context || "").trim();
    var idx     = Number.isFinite(Number(opts.subjectIdx)) ? Number(opts.subjectIdx) : null;
    if (!subject || !city) return;

    ensureCSS();

    var now = new Date(), yr = now.getFullYear();
    var years = '<option value="">Year</option>';
    for (var y = yr; y >= 1950; y--) years += '<option value="' + y + '">' + y + '</option>';
    var months = ["January","February","March","April","May","June","July",
                  "August","September","October","November","December"]
      .map(function(m, i){ return '<option value="' + (i + 1) + '">' + m + '</option>'; }).join("");

    var titleValue = subject + (context ? " — " + context : "");
    var licenceList = LICENSE_TEXT.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("");

    var back = document.createElement("div");
    back.className = "cf-back";
    back.innerHTML =
      '<div class="cf-box" role="dialog" aria-modal="true" aria-label="Contribute a photo">' +
        '<button type="button" class="cf-close" aria-label="Close">&times;</button>' +
        '<h3>Contribute a photo</h3>' +
        '<p class="cf-sub">Thank you &mdash; photos from travellers are what make these guides worth reading.</p>' +
        '<form id="cf-form">' +
          '<div class="cf-f">' +
            '<label for="cf-title">' + esc(meta.label) + '</label>' +
            '<input type="text" id="cf-title" value="' + esc(titleValue) + '" readonly>' +
            '<p class="cf-note">' + esc(city + (country ? ", " + country : "")) + '</p>' +
          '</div>' +
          '<div class="cf-f">' +
            '<label for="cf-file">Your photo</label>' +
            '<input type="file" id="cf-file" accept="image/jpeg,image/png,image/webp" required>' +
            '<p class="cf-note">JPEG, PNG or WebP. ' + esc(meta.hint) + '</p>' +
          '</div>' +
          '<div class="cf-f">' +
            '<label>Approximate date taken <span style="font-weight:400;color:#8a7f66">(optional)</span></label>' +
            '<div class="cf-row">' +
              '<select id="cf-month"><option value="">Month</option>' + months + '</select>' +
              '<select id="cf-year">' + years + '</select>' +
            '</div>' +
          '</div>' +
          '<div class="cf-f">' +
            '<label>How would you like to be credited?</label>' +
            '<label class="cf-opt"><input type="radio" name="cf-cred" value="name" checked>' +
              '<span>Credit this name<br><input type="text" id="cf-credname" placeholder="Name to display" style="margin-top:5px"></span></label>' +
            '<label class="cf-opt" id="cf-opt-profile"><input type="radio" name="cf-cred" value="profile">' +
              '<span>My Never Roam Alone profile</span></label>' +
            '<div id="cf-profile-state"></div>' +
            '<label class="cf-opt"><input type="radio" name="cf-cred" value="none">' +
              '<span>No credit desired</span></label>' +
          '</div>' +
          '<div class="cf-f">' +
            '<label for="cf-link">Link to your creative work <span style="font-weight:400;color:#8a7f66">(optional)</span></label>' +
            '<input type="url" id="cf-link" placeholder="https://">' +
            '<p class="cf-note">Shown alongside your photo credit.</p>' +
          '</div>' +
          '<div style="position:absolute;left:-9999px" aria-hidden="true">' +
            '<label for="cf-website">Website</label>' +
            '<input type="text" id="cf-website" tabindex="-1" autocomplete="off">' +
          '</div>' +
          '<div class="cf-terms-full" id="cf-terms-full">' +
            '<strong>Photo contribution licence</strong>' +
            '<ul>' + licenceList + '</ul>' +
          '</div>' +
          '<label class="cf-terms">' +
            '<input type="checkbox" id="cf-agree" required>' +
            '<span>I have read the licence above and I agree to it. I own this image and I grant ' +
              'Never Roam Alone permission to use it on this website. ' +
              '<a href="terms.html#photos" target="_blank" rel="noopener">Photo Contribution Terms</a></span>' +
          '</label>' +
          '<div class="cf-sig">' +
            '<label for="cf-sign">Type your full legal name to sign</label>' +
            '<input type="text" id="cf-sign" autocomplete="name" maxlength="120" required ' +
              'placeholder="Your full name">' +
            '<p class="cf-note">Signed ' + esc(now.toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" })) +
              '. Your signature, the wording above and the time you agreed are stored with your submission.</p>' +
          '</div>' +
          '<div class="cf-actions">' +
            '<button type="submit" class="cf-submit" id="cf-submit">Submit photo</button>' +
            '<button type="button" class="cf-cancel" id="cf-cancel">Cancel</button>' +
            '<span class="cf-msg" id="cf-msg"></span>' +
          '</div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(back);

    var openedAt = Date.now();
    var $ = function(id){ return back.querySelector("#" + id); };
    var stopAuthWatch = null;
    var close = function(){
      back.remove();
      document.removeEventListener("keydown", onKey);
      if (stopAuthWatch) stopAuthWatch();
    };
    var onKey = function(e){ if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    back.querySelector(".cf-close").addEventListener("click", close);
    $("cf-cancel").addEventListener("click", close);
    back.addEventListener("click", function(e){ if (e.target === back) close(); });

    /* the free-text name only applies to the "credit this name" option */
    back.querySelectorAll('input[name="cf-cred"]').forEach(function(r){
      r.addEventListener("change", function(){ $("cf-credname").disabled = r.value !== "name"; });
    });

    /* ---- profile credit needs an account ----------------------------------
       Signed out (or accounts switched off): the radio is disabled and a
       sign-in button takes its place. Signing in re-enables it in place, so
       nothing typed into the rest of the form is lost. */
    function paintProfileOption(){
      var radio = back.querySelector('input[name="cf-cred"][value="profile"]');
      var opt   = $("cf-opt-profile");
      var state = $("cf-profile-state");
      if (!radio || !opt || !state) return;
      var user = signedInUser();
      if (user) {
        radio.disabled = false;
        opt.classList.remove("is-locked");
        var a = AUTH();
        var who = (a && a.displayName && a.displayName()) || user.email || "your profile";
        state.className = "cf-signed";
        state.textContent = "Signed in as " + who + ".";
        return;
      }
      radio.disabled = true;
      opt.classList.add("is-locked");
      /* fall back to a plain name credit if the locked option was selected */
      if (radio.checked) {
        var nameRadio = back.querySelector('input[name="cf-cred"][value="name"]');
        if (nameRadio) { nameRadio.checked = true; $("cf-credname").disabled = false; }
      }
      state.className = "cf-signin";
      state.innerHTML = authEnabled()
        ? 'Crediting your profile needs an account, so we can link the photo to it.<br>' +
          '<button type="button" class="cf-signin-btn" id="cf-signin-btn">Sign in or create an account</button>'
        : 'Profile credits are unavailable right now — choose a name credit instead.';
      var b = $("cf-signin-btn");
      if (b) b.addEventListener("click", function(){
        var a = AUTH();
        if (a && a.openModal) a.openModal();
      });
    }
    paintProfileOption();
    var a0 = AUTH();
    if (a0 && a0.onChange) {
      var live = true;
      a0.onChange(function(){ if (live) paintProfileOption(); });
      stopAuthWatch = function(){ live = false; };
    }
    if (a0 && a0.ready) a0.ready().then(function(){ if (back.isConnected) paintProfileOption(); });

    /* ---- submit ---- */
    $("cf-form").addEventListener("submit", async function(e){
      e.preventDefault();
      var msg = $("cf-msg"), btn = $("cf-submit");
      var file = ($("cf-file").files || [])[0];
      var fail = function(text){ msg.className = "cf-msg err"; msg.textContent = text; };
      if (!file) return fail("Please choose a photo.");
      if (file.size > 12 * 1024 * 1024) return fail("That file is over 12 MB — please pick a smaller one.");
      if (!$("cf-agree").checked) return fail("Please agree to the licence before submitting.");
      var signature = ($("cf-sign").value || "").trim();
      if (signature.length < 2) return fail("Please type your full name to sign.");

      var mode = (back.querySelector('input[name="cf-cred"]:checked') || {}).value || "none";
      var token = await accessToken();
      if (mode === "profile" && !token) return fail("Please sign in again to credit your profile.");

      var rec = {
        subjectKind: kindKey,
        subjectLabel: meta.label,
        subject: subject,
        context: context,
        /* `landmark` is the column this table has always used for the subject
           name — kept so existing rows, queries and the review email still
           line up now that other photo slots share the form. */
        landmark: subject,
        landmarkIdx: idx,
        city: city,
        country: country,
        takenMonth: $("cf-month").value ? Number($("cf-month").value) : null,
        takenYear:  $("cf-year").value  ? Number($("cf-year").value)  : null,
        creditMode: mode,
        creditName: mode === "name" ? ($("cf-credname").value || "").trim() : "",
        workUrl: ($("cf-link").value || "").trim(),
        rightsConfirmed: true,
        signature: signature,
        licenseVersion: LICENSE_VERSION,
        licenseText: LICENSE_TEXT.join("\n"),
        agreedAt: new Date().toISOString(),
        pageUrl: location.href,
        accessToken: token
      };

      btn.disabled = true; msg.className = "cf-msg"; msg.textContent = "Uploading…";
      try {
        /* Read the photo as a data URL — the function re-checks type, size and
           magic bytes server-side, so nothing here is trusted. */
        var dataUrl = await new Promise(function(res, rej){
          var fr = new FileReader();
          fr.onload  = function(){ res(fr.result); };
          fr.onerror = function(){ rej(new Error("Could not read that file")); };
          fr.readAsDataURL(file);
        });
        var r = await fetch("/.netlify/functions/contribute-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign(rec, {
            fileType: file.type, fileData: dataUrl,
            website: $("cf-website").value,          /* honeypot */
            elapsedMs: Date.now() - openedAt
          }))
        });
        var out = {};
        try { out = await r.json(); } catch (e2) { /* non-JSON error page */ }
        if (!r.ok || !out.sent) throw new Error(out.error || ("Submission failed (" + r.status + ")"));
        back.querySelector(".cf-box").innerHTML =
          '<h3>Thank you</h3><p class="cf-sub">Your photo of ' + esc(subject) + ' has been submitted for review. ' +
          'If it goes up, it will appear on the site with the credit you chose.</p>' +
          '<div class="cf-actions"><button type="button" class="cf-submit" id="cf-done">Close</button></div>';
        back.querySelector("#cf-done").addEventListener("click", close);
      } catch (err) {
        btn.disabled = false;
        fail("Sorry, that didn't go through: " + ((err && err.message) || "unknown error"));
      }
    });
  }

  return { open: open, KINDS: KINDS, LICENSE_VERSION: LICENSE_VERSION, LICENSE_TEXT: LICENSE_TEXT };
})();
