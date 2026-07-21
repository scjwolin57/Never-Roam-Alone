/* Never Roam Alone — shared top navigation.
   The menu lives here ONLY. Every page has an empty <nav class="links" data-site-nav></nav>
   placeholder; this script fills it in and highlights the current page.
   To change the menu site-wide, edit NAV_ITEMS below — nothing else. */
(function () {
  "use strict";

  // The one and only menu. Order = display order.
  var NAV_ITEMS = [
    { label: "Home",               href: "index.html" },
    { label: "About",              href: "index.html#about" },
    { label: "Blog",               href: "blog.html" },
    { label: "City Guides",        href: "cities.html" },
    { label: "Destination Finder", href: "choose.html" },
    { label: "Ask A Roamer",       href: "askaroamer.html" }
  ];

  // Which menu item should be highlighted on each page file.
  var ACTIVE_BY_PAGE = {
    "":                 "Home",          // some servers serve "/" with no filename
    "index.html":       "Home",
    "blog.html":        "Blog",
    "post.html":        "Blog",          // a blog post still belongs under "Blog"
    "cities.html":      "City Guides",
    "city.html":        "City Guides",   // a single city page belongs under "City Guides"
    "choose.html":      "Destination Finder",
    "askaroamer.html":  "Ask A Roamer"
  };

  // Below this window width the inline links collapse into the hamburger menu.
  // (Raised from 880 to 1180 — between those widths the full nav + language
  // selector + sign-in button no longer fit on one line and the language
  // selector/sign-in button were getting squeezed off-screen. 1180 matches
  // the site's --maxw so the row never needs to fit more than that.)
  var BREAKPOINT = 1180;

  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  /* ---- Styles for the hamburger button + collapsed drop-down panel ----
     Injected once. Selectors are deliberately specific so they override any
     per-page `nav.links{display:none}` rule, giving every page identical
     behaviour. */
  function injectMenuStyles() {
    if (document.getElementById("nra-nav-style")) return;
    var css =
      // Hamburger button — hidden on wide screens, pushed to the far right
      // (order:99) so it always sits to the RIGHT of the language selector.
      ".nra-burger{order:99;margin-left:14px;display:none;width:42px;height:42px;" +
        "flex-shrink:0;align-items:center;justify-content:center;background:rgba(92, 105, 51,.06);" +
        "border:1.5px solid rgba(92, 105, 51,.2);border-radius:0;cursor:pointer;padding:0}" +
      ".nra-burger:focus{outline:none;border-color:#5c6933}" +
      ".nra-burger .bars{position:relative;display:block;width:20px;height:2px;background:#5c6933;transition:.2s}" +
      ".nra-burger .bars::before,.nra-burger .bars::after{content:'';position:absolute;left:0;width:20px;height:2px;" +
        "background:#5c6933;transition:.2s}" +
      ".nra-burger .bars::before{top:-6px}" +
      ".nra-burger .bars::after{top:6px}" +
      // Open state: morph the three bars into an X
      "header.nav.nra-nav-open .nra-burger .bars{background:transparent}" +
      "header.nav.nra-nav-open .nra-burger .bars::before{top:0;transform:rotate(45deg)}" +
      "header.nav.nra-nav-open .nra-burger .bars::after{top:0;transform:rotate(-45deg)}" +

      // Account slot (filled in by auth.js, when loaded) — sits between the
      // language selector and the hamburger, in that flex order.
      ".nra-nav-acct{order:90;margin-left:16px;display:flex;align-items:center;min-height:34px}" +
      "@media(max-width:600px){.nra-nav-acct{margin-left:10px}}" +
      // Very narrow phones: the language selector, sign-in button and burger
      // all have to fit on one line — tighten the gaps so nothing overflows.
      "@media(max-width:420px){.nra-nav-acct{margin-left:6px}.nra-burger{margin-left:6px}}" +
      "@media(max-width:" + BREAKPOINT + "px){" +
        // Show the button and let the panel anchor to the bar
        ".nra-burger{display:inline-flex}" +
        "header.nav .nav-inner{position:relative}" +
        // Keep the inline links hidden until the menu is opened
        "header.nav nav.links[data-site-nav]{display:none}" +
        // Opened: render the links as a tidy drop-down panel under the bar
        "header.nav.nra-nav-open nav.links[data-site-nav]{display:flex;flex-direction:column;" +
          "align-items:stretch;position:absolute;top:100%;right:14px;margin-top:10px;background:#fff;" +
          "border:1px solid rgba(92, 105, 51,.18);border-radius:0;box-shadow:0 10px 30px rgba(20,40,50,.18);" +
          "padding:8px;min-width:210px;z-index:60}" +
        "header.nav.nra-nav-open nav.links[data-site-nav] a{margin:0;padding:11px 14px;border-radius:0;" +
          "border-bottom:none;font-size:.85rem;text-transform:uppercase;letter-spacing:.08em}" +
        "header.nav.nra-nav-open nav.links[data-site-nav] a:hover{background:rgba(181, 73, 44,.08);" +
          "color:#b5492c;border-color:transparent}" +
        "header.nav.nra-nav-open nav.links[data-site-nav] a.active{color:#5c6933}" +
      "}" +
      // Explorer: square rounded buttons, pills, tags, badges, toggles, inputs site-wide
      ".btn,.share-btn,.show-more,.rm-cta,.rm-you,.swap,.esim-btn,.tr-map-btn,.back,.back-link,.cal-submit-btn,.cal-nav-btn,.evt-send,.atm-btn,.flights-link,.explore-btn,.cta,.save-btn,.submit-btn,.primary-btn,.msg-btn,.cmp-toggle,.reply-toggle,.trip-add-chip,.gate,.pick-file,.filter-btn,.esim-btn," +
      ".tag,.season-pill,.count-pill,.visa-badge,.visa-tag,.live-tag,.est-tag,.badge,.age-pill,.tt-badge,.rank-chip,.visit,.chip,.lchip,.ph-tag,.status-msg,.copied-note,.mini-radio,.tab,.pick-tab,.readmore," +
      ".tag,.pill{border-radius:0 !important}" +
      "input[type=text],input[type=email],input[type=url],input[type=search],input[type=tel],input[type=number],input[type=date],input[type=time],input[type=password],textarea,select{border-radius:0 !important}" +
      // Explorer finish: parchment page-heads + themed form inputs site-wide
      ".intro.hero-banner,.page-hero,.hero-banner{background:transparent !important;background-image:none !important;color:#2b2417 !important;border:none !important}" +
      ".intro.hero-banner .kicker,.page-hero .kicker,.hero-banner .kicker{color:#5c6933 !important;opacity:1 !important;font-family:'Work Sans',monospace;letter-spacing:.22em;text-transform:uppercase}" +
      ".intro.hero-banner h1,.page-hero h1,.hero-banner h1{color:#2b2417 !important;font-family:'Fraunces',Georgia,serif}" +
      ".intro.hero-banner h1 em,.page-hero h1 em,.hero-banner h1 em{color:#b5492c !important;font-style:italic}" +
      ".intro.hero-banner p,.page-hero p,.hero-banner p{color:#82755b !important}" +
      "input[type=text],input[type=email],input[type=url],input[type=search],input[type=tel],input[type=number],input[type=date],input[type=time],input[type=password],textarea,select{background:#ece2cc !important;border:1px solid #2b2417 !important;color:#2b2417 !important}";
    var s = document.createElement("style");
    s.id = "nra-nav-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function closeMenu(header) {
    header.classList.remove("nra-nav-open");
    var btn = header.querySelector(".nra-burger");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  /* ---- Reserve a slot for the sign-in button / profile circle (auth.js fills
     it in if it's loaded on this page; otherwise it just stays empty). ---- */
  function buildAccountSlot() {
    var host = document.querySelector("header.nav .nav-inner");
    if (!host || host.querySelector("#nra-nav-account")) return;
    var slot = document.createElement("div");
    slot.id = "nra-nav-account";
    slot.className = "nra-nav-acct";
    slot.setAttribute("data-no-i18n", "");
    host.appendChild(slot);
    // In case auth.js already finished its startup before this slot existed,
    // ask it to draw into the slot right away instead of waiting for its
    // next sign-in/sign-out event.
    if (window.NRA_AUTH && typeof window.NRA_AUTH.renderNavWidget === "function") {
      window.NRA_AUTH.renderNavWidget();
    }
  }

  /* ---- Build + wire the hamburger button (one per page) ---- */
  function buildBurger() {
    var host = document.querySelector("header.nav .nav-inner");
    var header = document.querySelector("header.nav");
    if (!host || !header || host.querySelector(".nra-burger")) return;

    var btn = document.createElement("button");
    btn.className = "nra-burger";
    btn.type = "button";
    btn.setAttribute("aria-label", "Menu");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("data-no-i18n", "");
    btn.innerHTML = '<span class="bars"></span>';

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = header.classList.toggle("nra-nav-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Append last so flexbox + order:99 keep it right of the language selector.
    host.appendChild(btn);

    // Tapping a link closes the menu.
    header.addEventListener("click", function (e) {
      if (e.target.closest("nav.links[data-site-nav] a")) closeMenu(header);
    });
    // Clicking anywhere outside the menu closes it.
    document.addEventListener("click", function (e) {
      if (!header.classList.contains("nra-nav-open")) return;
      if (e.target.closest(".nra-burger") || e.target.closest("nav.links[data-site-nav]")) return;
      closeMenu(header);
    });
    // Esc closes it; widening past the breakpoint resets state.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu(header);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > BREAKPOINT) closeMenu(header);
    });
  }

  function render() {
    var slots = document.querySelectorAll("nav.links[data-site-nav]");
    if (!slots.length) return;

    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var activeLabel = ACTIVE_BY_PAGE[page] || "";

    var html = NAV_ITEMS.map(function (item) {
      var cls = (item.label === activeLabel) ? ' class="active"' : "";
      return '<a href="' + escapeAttr(item.href) + '"' + cls + ">" + item.label + "</a>";
    }).join("");

    for (var i = 0; i < slots.length; i++) slots[i].innerHTML = html;

    injectMenuStyles();
    buildAccountSlot();
    buildBurger();

    // If the translator has already initialised, re-run it so the freshly
    // injected menu is translated immediately. (If it hasn't run yet, its own
    // start-up pass — and its dynamic-content watcher — will cover the menu.)
    if (window.NRA_i18n && typeof window.NRA_i18n.apply === "function") {
      window.NRA_i18n.apply();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
