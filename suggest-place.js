/* =====================================================================
   SUGGEST-PLACE.JS — the "Suggest a place" dialog behind the button at the
   bottom of each neighborhood card on city.html (Where to stay / eat /
   coffee & takeaway / drink). Jeff, 2026-09-24.

   Open it with:

     NRA_SUGGEST.open({
       city:     "Las Vegas",
       hoodIdx:  2,
       hoodName: "Chinatown (Spring Mountain)",
       section:  "bars",                       // stay | eat | cafes | bars
       title:    "Suggest a place to drink",
       kinds:    [{ k: "cocktail", label: "Cocktail bar" }, ...]   // the card's listings
     });

   The fields: A. which listing it is for (required), B. the Google Maps
   link (required), C. a website (optional), D. anything they want to share
   (optional), E. "contact me when it's published" (optional). A signed-in
   member hears back in their Never Roam Alone inbox; anyone else gives an
   email. The submission goes to the submit-suggestion Netlify function,
   which re-checks every field and saves it as pending for review on the
   Admin page (Suggestions tab), the same flow as the Insights interviews.

   Uses the .cf-* dialog styles city.html already has for the photo form,
   plus the few rules below.
   ===================================================================== */

window.NRA_SUGGEST = (function(){
  "use strict";

  var CSS = [
    ".cf-f textarea{width:100%;padding:8px 10px;border:1px solid #cfc7b4;border-radius:3px;font:inherit;font-size:.9rem;background:#fff;resize:vertical;box-sizing:border-box}",
    ".cf-f input[type=email]{width:100%;padding:8px 10px;border:1px solid #cfc7b4;border-radius:3px;font:inherit;font-size:.9rem;background:#fff;box-sizing:border-box}",
    ".cf-f .sp-opt{color:#8a7f66;font-weight:400}",
    ".sp-contact-more{margin:6px 0 0 26px}",
    ".sp-contact-more[hidden]{display:none}",
    ".sp-signin-btn{display:inline;background:none;border:none;padding:0;color:var(--teal,#5c6933);font:inherit;font-size:.78rem;text-align:left;text-decoration:underline;cursor:pointer}",
    ".sp-signin-btn:hover{color:var(--coral,#b5492c)}"
  ].join("\n");
  function ensureCSS(){
    if (document.getElementById("nra-sp-css")) return;
    var s = document.createElement("style");
    s.id = "nra-sp-css";
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

  /* Same rule as the server: google.<tld>/maps/..., maps.google.<tld>/..., maps.app.goo.gl/..., goo.gl/maps/... */
  function isMapsUrl(u){
    var x;
    try { x = new URL(u); } catch (e) { return false; }
    if (x.protocol !== "https:" && x.protocol !== "http:") return false;
    var h = x.hostname.toLowerCase();
    if (h === "maps.app.goo.gl") return x.pathname.length > 1;
    if (h === "goo.gl") return x.pathname.indexOf("/maps") === 0;
    if (/^maps\.google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(h)) return true;
    if (/^(www\.)?google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(h)) return x.pathname.indexOf("/maps") === 0;
    return false;
  }
  function isWebUrl(u){
    try { var x = new URL(u); return (x.protocol === "https:" || x.protocol === "http:") && x.hostname.indexOf(".") > 0; } catch (e) { return false; }
  }

  function open(opts){
    opts = opts || {};
    var city = String(opts.city || "").trim(), hoodName = String(opts.hoodName || "").trim();
    var kinds = Array.isArray(opts.kinds) ? opts.kinds : [];
    if (!city || !hoodName || !opts.section || !kinds.length) return;
    ensureCSS();

    var back = document.createElement("div");
    back.className = "cf-back";
    back.innerHTML =
      '<div class="cf-box" role="dialog" aria-modal="true" aria-label="' + esc(opts.title || "Suggest a place") + '">' +
        '<button type="button" class="cf-close" aria-label="Close">&times;</button>' +
        '<h3>' + esc(opts.title || "Suggest a place") + '</h3>' +
        '<p class="cf-sub">In ' + esc(hoodName) + ', ' + esc(city) + '. We check every suggestion before it goes on the guide.</p>' +
        '<form id="sp-form" novalidate>' +
          '<div class="cf-f">' +
            '<label for="sp-kind">Which listing is it for?</label>' +
            '<select id="sp-kind" required><option value="">Choose one</option>' +
              kinds.map(function(o){ return '<option value="' + esc(o.k) + '">' + esc(o.label) + '</option>'; }).join("") +
            '</select>' +
          '</div>' +
          '<div class="cf-f">' +
            '<label for="sp-maps">Google Maps link</label>' +
            '<input type="url" id="sp-maps" required placeholder="https://maps.app.goo.gl/..." autocomplete="off">' +
            '<p class="cf-note">Open the place in Google Maps, tap Share, and paste the link here.</p>' +
          '</div>' +
          '<div class="cf-f">' +
            '<label for="sp-site">Website <span class="sp-opt">(optional)</span></label>' +
            '<input type="url" id="sp-site" placeholder="https://" autocomplete="off">' +
          '</div>' +
          '<div class="cf-f">' +
            '<label for="sp-info">Anything you want to share about this place <span class="sp-opt">(optional)</span></label>' +
            '<textarea id="sp-info" rows="3" maxlength="1000"></textarea>' +
          '</div>' +
          '<div style="position:absolute;left:-9999px" aria-hidden="true">' +
            '<label for="sp-website">Website</label>' +
            '<input type="text" id="sp-website" tabindex="-1" autocomplete="off">' +
          '</div>' +
          '<div class="cf-f">' +
            '<label class="cf-opt"><input type="checkbox" id="sp-contact"> Contact me if my suggestion is published <span class="sp-opt">(optional)</span></label>' +
            '<div class="sp-contact-more" id="sp-contact-more" hidden></div>' +
          '</div>' +
          '<div class="cf-actions">' +
            '<button type="submit" class="cf-submit" id="sp-submit">Send</button>' +
            '<button type="button" class="cf-cancel" id="sp-cancel">Cancel</button>' +
            '<span class="cf-msg" id="sp-msg" role="status"></span>' +
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
    $("sp-cancel").addEventListener("click", close);
    back.addEventListener("click", function(e){ if (e.target === back) close(); });

    /* E: a member hears back in their inbox; anyone else gives an email. Signing in
       from here swaps the email field for the inbox note without losing the form. */
    var emailVal = "";
    function paintContact(){
      var more = $("sp-contact-more");
      if (!more) return;
      var on = $("sp-contact").checked;
      var em = $("sp-email");
      if (em) emailVal = em.value;
      more.hidden = !on;
      if (!on) { more.innerHTML = ""; return; }
      if (signedInUser()) {
        more.innerHTML = '<p class="cf-note">We\'ll send you a message in your Never Roam Alone inbox.</p>';
        return;
      }
      var a = AUTH();
      more.innerHTML =
        '<label for="sp-email" style="font-weight:600;font-size:.8rem">Your email</label>' +
        '<input type="email" id="sp-email" autocomplete="email" value="' + esc(emailVal) + '">' +
        '<p class="cf-note">Only used to tell you it\'s published. Never shown on the site.' +
        (a && a.enabled ? ' <button type="button" class="sp-signin-btn" id="sp-signin">Or sign in to get a message in your NRA inbox</button>' : '') + '</p>';
      var b = $("sp-signin");
      if (b) b.addEventListener("click", function(){ var a2 = AUTH(); if (a2 && a2.openModal) a2.openModal(); });
    }
    $("sp-contact").addEventListener("change", paintContact);
    var a0 = AUTH();
    if (a0 && a0.onChange) {
      var live = true;
      a0.onChange(function(){ if (live) paintContact(); });
      stopAuthWatch = function(){ live = false; };
    }

    $("sp-form").addEventListener("submit", async function(e){
      e.preventDefault();
      var msg = $("sp-msg"), btn = $("sp-submit");
      var fail = function(text, focusId){ msg.className = "cf-msg err"; msg.textContent = text; if (focusId && $(focusId)) $(focusId).focus(); };
      var kind = $("sp-kind").value;
      var mapsUrl = ($("sp-maps").value || "").trim();
      var siteUrl = ($("sp-site").value || "").trim();
      var contact = $("sp-contact").checked;
      var email = $("sp-email") ? ($("sp-email").value || "").trim() : "";
      if (!kind) return fail("Please choose which listing this is for.", "sp-kind");
      if (!mapsUrl) return fail("Please add the Google Maps link.", "sp-maps");
      if (!isMapsUrl(mapsUrl)) return fail("That doesn't look like a Google Maps link. Open the place in Google Maps, tap Share, and paste the link.", "sp-maps");
      if (siteUrl && !isWebUrl(siteUrl)) return fail("The website link should start with http:// or https://", "sp-site");
      var token = await accessToken();
      if (contact && !token) {
        if (!email) return fail("Please add your email so we can tell you when it's published.", "sp-email");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please check your email address.", "sp-email");
      }

      btn.disabled = true; msg.className = "cf-msg"; msg.textContent = "Sending…";
      try {
        var r = await fetch("/.netlify/functions/submit-suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: city, hoodIdx: opts.hoodIdx, hoodName: hoodName, section: opts.section,
            kind: kind, mapsUrl: mapsUrl, websiteUrl: siteUrl, info: ($("sp-info").value || "").trim(),
            contact: contact, email: token ? "" : email, accessToken: token,
            website: $("sp-website").value,          /* honeypot */
            elapsedMs: Date.now() - openedAt
          })
        });
        var out = {};
        try { out = await r.json(); } catch (e2) { /* non-JSON error page */ }
        if (!r.ok || !out.sent) throw new Error(out.error || ("Sending failed (" + r.status + ")"));
        back.querySelector(".cf-box").innerHTML =
          '<h3>Thank you</h3><p class="cf-sub">Your suggestion for ' + esc(hoodName) + ' has been sent. We check every suggestion before it goes on the guide.' +
          (contact ? (token ? ' If it\'s published, we\'ll send you a message in your Never Roam Alone inbox.' : ' If it\'s published, we\'ll email you.') : '') + '</p>' +
          '<div class="cf-actions"><button type="button" class="cf-submit" id="sp-done">Close</button></div>';
        back.querySelector("#sp-done").addEventListener("click", close);
      } catch (err) {
        btn.disabled = false;
        fail("Sorry, that didn't go through: " + ((err && err.message) || "unknown error"));
      }
    });

    setTimeout(function(){ var k = $("sp-kind"); if (k) k.focus(); }, 30);
  }

  return { open: open, isMapsUrl: isMapsUrl };
})();
