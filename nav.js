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
  var BREAKPOINT = 880;

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
        "flex-shrink:0;align-items:center;justify-content:center;background:rgba(24,94,63,.06);" +
        "border:1.5px solid rgba(24,94,63,.2);border-radius:12px;cursor:pointer;padding:0}" +
      ".nra-burger:focus{outline:none;border-color:#185e3f}" +
      ".nra-burger .bars{position:relative;display:block;width:20px;height:2px;background:#185e3f;transition:.2s}" +
      ".nra-burger .bars::before,.nra-burger .bars::after{content:'';position:absolute;left:0;width:20px;height:2px;" +
        "background:#185e3f;transition:.2s}" +
      ".nra-burger .bars::before{top:-6px}" +
      ".nra-burger .bars::after{top:6px}" +
      // Open state: morph the three bars into an X
      "header.nav.nra-nav-open .nra-burger .bars{background:transparent}" +
      "header.nav.nra-nav-open .nra-burger .bars::before{top:0;transform:rotate(45deg)}" +
      "header.nav.nra-nav-open .nra-burger .bars::after{top:0;transform:rotate(-45deg)}" +

      "@media(max-width:" + BREAKPOINT + "px){" +
        // Show the button and let the panel anchor to the bar
        ".nra-burger{display:inline-flex}" +
        "header.nav .nav-inner{position:relative}" +
        // Keep the inline links hidden until the menu is opened
        "header.nav nav.links[data-site-nav]{display:none}" +
        // Opened: render the links as a tidy drop-down panel under the bar
        "header.nav.nra-nav-open nav.links[data-site-nav]{display:flex;flex-direction:column;" +
          "align-items:stretch;position:absolute;top:100%;right:14px;margin-top:10px;background:#fff;" +
          "border:1px solid rgba(14,124,134,.18);border-radius:14px;box-shadow:0 10px 30px rgba(20,40,50,.18);" +
          "padding:8px;min-width:210px;z-index:60}" +
        "header.nav.nra-nav-open nav.links[data-site-nav] a{margin:0;padding:11px 14px;border-radius:8px;" +
          "border-bottom:none;font-size:1rem}" +
        "header.nav.nra-nav-open nav.links[data-site-nav] a:hover{background:rgba(24,94,63,.06);" +
          "color:#0e7c86;border-color:transparent}" +
        "header.nav.nra-nav-open nav.links[data-site-nav] a.active{color:#0e7c86}" +
      "}";
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
