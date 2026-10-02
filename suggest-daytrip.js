/* =====================================================================
   SUGGEST-DAYTRIP.JS — the "Suggest a day trip" dialog behind the button
   under "No day trips available" on city.html (Jeff, 2026-09-30).
   Built from suggest-place.js, the "Suggest a place" dialog.

   Open it with:

     NRA_SUGGEST_TRIP.open({ city: "Yaren" });                     // a day trip
     NRA_SUGGEST_TRIP.open({ city: "Lisbon", kind: "landmark" });  // a landmark (2026-10-02)

   Landmark mode ("Suggest a landmark" under every city's Landmarks): the
   name, the Google Maps link (required, so we can check where it is), why
   it's worth seeing, a website (optional), and the same profile and contact
   choices. Both kinds go to the same function and the same Admin list.

   The fields (Jeff's list): name of the place, how to get there, how far
   it is each way (1.5 hours/half day, 3+ hours/full days), a website for
   more information or booking links (optional), show your Roamer profile
   (only offered when signed in), and permission to contact you by email
   with any questions. The submission goes to the submit-daytrip-suggestion
   Netlify function, which re-checks every field and saves it as pending for
   review on the Admin page (Suggestions tab).

   Uses the .cf-* dialog styles city.html already has for the photo form.
   ===================================================================== */

window.NRA_SUGGEST_TRIP = (function(){
  "use strict";

  var CSS = [
    ".cf-f textarea{width:100%;padding:8px 10px;border:1px solid #cfc7b4;border-radius:3px;font:inherit;font-size:.9rem;background:#fff;resize:vertical;box-sizing:border-box}",
    ".cf-f input[type=email],.cf-f input[type=text]{width:100%;padding:8px 10px;border:1px solid #cfc7b4;border-radius:3px;font:inherit;font-size:.9rem;background:#fff;box-sizing:border-box}",
    ".cf-f .sp-opt{color:#8a7f66;font-weight:400}",
    ".sdt-radios{display:flex;flex-direction:column;gap:6px;margin-top:4px}",
    ".sdt-radios label{display:flex;align-items:center;gap:8px;font-weight:400;font-size:.9rem}",
    ".sp-contact-more{margin:6px 0 0 26px}",
    ".sp-contact-more[hidden]{display:none}",
    ".sp-signin-btn{display:inline;background:none;border:none;padding:0;color:var(--teal,#5c6933);font:inherit;font-size:.78rem;text-align:left;text-decoration:underline;cursor:pointer}",
    ".sp-signin-btn:hover{color:var(--coral,#b5492c)}"
  ].join("\n");
  function ensureCSS(){
    if (document.getElementById("nra-sdt-css")) return;
    var s = document.createElement("style");
    s.id = "nra-sdt-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(t){
    return String(t == null ? "" : t).replace(/[<>&"]/g, function(ch){
      return { "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[ch];
    });
  }

  var AUTH = function(){ return window.NRA_AUTH; };
  function signedInUser(){ var a = AUTH(); return a && a.user ? a.user() : null; }
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
  function isWebUrl(u){
    try { var x = new URL(u); return (x.protocol === "https:" || x.protocol === "http:") && x.hostname.indexOf(".") > 0; } catch (e) { return false; }
  }

  function open(opts){
    opts = opts || {};
    var city = String(opts.city || "").trim();
    if (!city) return;
    var lmk = opts.kind === "landmark";
    var what = lmk ? "landmark" : "day trip";
    ensureCSS();

    var back = document.createElement("div");
    back.className = "cf-back";
    back.innerHTML =
      '<div class="cf-box" role="dialog" aria-modal="true" aria-label="Suggest a ' + what + '">' +
        '<button type="button" class="cf-close" aria-label="Close">&times;</button>' +
        '<h3>Suggest a ' + what + '</h3>' +
        '<p class="cf-sub">' + (lmk ? 'In ' + esc(city) + '. A landmark is inside the city; somewhere further out is a day trip.' : 'From ' + esc(city) + '.') + ' We check every suggestion before it goes on the guide.</p>' +
        '<form id="sdt-form" novalidate>' +
          '<div class="cf-f">' +
            '<label for="sdt-name">' + (lmk ? 'Name of the landmark' : 'Name of place visiting') + '</label>' +
            '<input type="text" id="sdt-name" required maxlength="160" autocomplete="off">' +
          '</div>' +
          (lmk ?
          '<div class="cf-f">' +
            '<label for="sdt-maps">Google Maps link</label>' +
            '<input type="url" id="sdt-maps" required placeholder="https://maps.app.goo.gl/..." autocomplete="off">' +
            '<p class="cf-note">Open the place in Google Maps, tap Share, and paste the link.</p>' +
          '</div>' +
          '<div class="cf-f">' +
            '<label for="sdt-why">Why it\'s worth seeing</label>' +
            '<textarea id="sdt-why" rows="3" required maxlength="600"></textarea>' +
          '</div>'
          :
          '<div class="cf-f">' +
            '<label for="sdt-how">How to get there</label>' +
            '<textarea id="sdt-how" rows="3" required maxlength="1000" placeholder="Car, bus, train, boat, tour..."></textarea>' +
          '</div>' +
          '<div class="cf-f">' +
            '<span style="font-weight:600;font-size:.85rem">How far each way from ' + esc(city) + '?</span>' +
            '<div class="sdt-radios" role="radiogroup" id="sdt-dist">' +
              '<label><input type="radio" name="sdt-dist" value="half"> 1.5 hours/half day</label>' +
              '<label><input type="radio" name="sdt-dist" value="full"> 3+ hours/full days</label>' +
            '</div>' +
          '</div>') +
          '<div class="cf-f">' +
            '<label for="sdt-site">Website for more information or booking links <span class="sp-opt">(optional)</span></label>' +
            '<input type="url" id="sdt-site" placeholder="https://" autocomplete="off">' +
          '</div>' +
          '<div style="position:absolute;left:-9999px" aria-hidden="true">' +
            '<label for="sdt-website">Website</label>' +
            '<input type="text" id="sdt-website" tabindex="-1" autocomplete="off">' +
          '</div>' +
          '<div class="cf-f" id="sdt-profile-wrap"></div>' +
          '<div class="cf-f">' +
            '<label class="cf-opt"><input type="checkbox" id="sdt-contact"> You may contact me by email with any questions <span class="sp-opt">(optional)</span></label>' +
            '<div class="sp-contact-more" id="sdt-contact-more" hidden></div>' +
          '</div>' +
          '<div class="cf-actions">' +
            '<button type="submit" class="cf-submit" id="sdt-submit">Send</button>' +
            '<button type="button" class="cf-cancel" id="sdt-cancel">Cancel</button>' +
            '<span class="cf-msg" id="sdt-msg" role="status"></span>' +
          '</div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(back);

    var $ = function(id){ return back.querySelector("#" + id); };
    var openedAt = Date.now();
    var stopAuthWatch = null;
    var close = function(){
      back.remove();
      document.removeEventListener("keydown", onKey);
      if (stopAuthWatch) stopAuthWatch();
    };
    var onKey = function(e){ if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    back.querySelector(".cf-close").addEventListener("click", close);
    $("sdt-cancel").addEventListener("click", close);
    back.addEventListener("click", function(e){ if (e.target === back) close(); });

    /* "Show my Roamer profile" is only offered to a signed-in member. Contact: a member is reached at
       their account email; anyone else types one. Signing in from here repaints both without losing the form. */
    var emailVal = "", profileVal = false;
    function paint(){
      var pw = $("sdt-profile-wrap"), pc = $("sdt-profile");
      if (pc) profileVal = pc.checked;
      pw.innerHTML = signedInUser()
        ? '<label class="cf-opt"><input type="checkbox" id="sdt-profile"' + (profileVal ? " checked" : "") + '> Show my Never Roam Alone Roamer profile with this suggestion <span class="sp-opt">(optional)</span></label>'
        : "";
      pw.hidden = !signedInUser();
      var more = $("sdt-contact-more");
      var on = $("sdt-contact").checked;
      var em = $("sdt-email");
      if (em) emailVal = em.value;
      more.hidden = !on;
      if (!on) { more.innerHTML = ""; return; }
      if (signedInUser()) {
        more.innerHTML = '<p class="cf-note">We\'ll use the email on your Never Roam Alone account.</p>';
        return;
      }
      var a = AUTH();
      more.innerHTML =
        '<label for="sdt-email" style="font-weight:600;font-size:.8rem">Your email</label>' +
        '<input type="email" id="sdt-email" autocomplete="email" value="' + esc(emailVal) + '">' +
        '<p class="cf-note">Only used if we have a question about your suggestion. Never shown on the site.' +
        (a && a.enabled ? ' <button type="button" class="sp-signin-btn" id="sdt-signin">Or sign in to show your Roamer profile with it</button>' : '') + '</p>';
      var b = $("sdt-signin");
      if (b) b.addEventListener("click", function(){ var a2 = AUTH(); if (a2 && a2.openModal) a2.openModal(); });
    }
    $("sdt-contact").addEventListener("change", paint);
    paint();
    var a0 = AUTH();
    if (a0 && a0.onChange) {
      var live = true;
      a0.onChange(function(){ if (live) paint(); });
      stopAuthWatch = function(){ live = false; };
    }

    $("sdt-form").addEventListener("submit", async function(e){
      e.preventDefault();
      var msg = $("sdt-msg"), btn = $("sdt-submit");
      var fail = function(text, focusId){ msg.className = "cf-msg err"; msg.textContent = text; if (focusId && $(focusId)) $(focusId).focus(); };
      var name = ($("sdt-name").value || "").trim();
      var how = lmk ? "" : ($("sdt-how").value || "").trim();
      var mapsUrl = lmk ? ($("sdt-maps").value || "").trim() : "";
      var why = lmk ? ($("sdt-why").value || "").trim() : "";
      var distEl = back.querySelector('input[name="sdt-dist"]:checked');
      var dist = distEl ? distEl.value : "";
      var siteUrl = ($("sdt-site").value || "").trim();
      var contact = $("sdt-contact").checked;
      var showProfile = !!($("sdt-profile") && $("sdt-profile").checked);
      var email = $("sdt-email") ? ($("sdt-email").value || "").trim() : "";
      if (!name) return fail(lmk ? "Please add the name of the landmark." : "Please add the name of the place.", "sdt-name");
      if (lmk) {
        if (!mapsUrl) return fail("Please add the Google Maps link.", "sdt-maps");
        if (!window.NRA_SUGGEST || !NRA_SUGGEST.isMapsUrl || !NRA_SUGGEST.isMapsUrl(mapsUrl)) return fail("That doesn't look like a Google Maps link. Open the place in Google Maps, tap Share, and paste the link.", "sdt-maps");
        if (!why) return fail("Please say why it's worth seeing.", "sdt-why");
      } else {
        if (!how) return fail("Please say how to get there.", "sdt-how");
        if (!dist) { fail("Please choose how far it is each way."); var r0 = back.querySelector('input[name="sdt-dist"]'); if (r0) r0.focus(); return; }
      }
      if (siteUrl && !isWebUrl(siteUrl)) return fail("The website link should start with http:// or https://", "sdt-site");
      var token = await accessToken();
      if (contact && !token) {
        if (!email) return fail("Please add your email so we can contact you.", "sdt-email");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please check your email address.", "sdt-email");
      }

      btn.disabled = true; msg.className = "cf-msg"; msg.textContent = "Sending…";
      try {
        var r = await fetch("/.netlify/functions/submit-daytrip-suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: lmk ? "landmark" : "daytrip", mapsUrl: mapsUrl, why: why,
            city: city, placeName: name, howToGet: how, distance: dist, websiteUrl: siteUrl,
            showProfile: token ? showProfile : false, contact: contact, email: token ? "" : email, accessToken: token,
            website: $("sdt-website").value,          /* honeypot */
            elapsedMs: Date.now() - openedAt
          })
        });
        var out = {};
        try { out = await r.json(); } catch (e2) { /* non-JSON error page */ }
        if (!r.ok || !out.sent) throw new Error(out.error || ("Sending failed (" + r.status + ")"));
        back.querySelector(".cf-box").innerHTML =
          '<h3>Thank you</h3><p class="cf-sub">Your ' + what + ' suggestion ' + (lmk ? 'in ' : 'from ') + esc(city) + ' has been sent. We check every suggestion before it goes on the guide.</p>' +
          '<div class="cf-actions"><button type="button" class="cf-submit" id="sdt-done">Close</button></div>';
        back.querySelector("#sdt-done").addEventListener("click", close);
      } catch (err) {
        btn.disabled = false;
        fail("Sorry, that didn't go through: " + ((err && err.message) || "unknown error"));
      }
    });

    setTimeout(function(){ var k = $("sdt-name"); if (k) k.focus(); }, 30);
  }

  return { open: open };
})();
