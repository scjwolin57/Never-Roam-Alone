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

  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
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
