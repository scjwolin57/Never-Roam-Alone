/* =====================================================================
   HOLIDAY-BANNER.JS — draws the "things may be closed" notice.

   Reads city-holidays.js and turns a date range into a small banner.
   Both itinerary.html and choose.html use this, so the wording and the
   look only ever need changing in one place.

   HOW TO USE IT

     var html = NRA_HOLIDAY_BANNER.html("Spain", "Seville",
                                        "2026-03-30", "2026-04-04");
     if (html) someElement.innerHTML = html;

   Returns an empty string when there is nothing worth warning about,
   so you can safely drop the result straight into a container.

   Options (all optional), passed as a 5th argument:
     { compact: true }  smaller type, for a result card rather than a row
     { max: 2 }         show at most this many holidays (default 3)

   Requires city-holidays.js to be loaded first. If it isn't, this
   quietly returns "" rather than throwing — a missing banner should
   never break a page.
   ===================================================================== */
(function () {
  "use strict";

  var STYLE_ID = "nra-holiday-banner-css";

  /* Severity drives the colour, the heading and the icon.
     0 is deliberately quieter than 1 and 2 — it is an FYI, not a warning. */
  var LEVELS = {
    2: { cls: "sev2", icon: "⚠", lead: "Most things will be closed" },
    1: { cls: "sev1", icon: "⚠", lead: "Many places will be closed" },
    /* Level 0 covers two different things — a city that's mobbed and sold
       out, and a month like Ramadan where the daily rhythm shifts — so the
       heading stays neutral and lets each note say what's actually going on. */
    0: { cls: "sev0", icon: "ℹ", lead: "Your dates overlap something big" }
  };

  var CSS = [
    ".nra-hol{border-radius:10px;padding:11px 13px;margin:10px 0;",
    "font-size:.9rem;line-height:1.45;border:1px solid;display:block}",
    ".nra-hol.sev2{background:#FBEDE9;border-color:#C04020;color:#5C1E10}",
    ".nra-hol.sev1{background:#FBF4E6;border-color:#C9922B;color:#5A4212}",
    ".nra-hol.sev0{background:#F2F5EC;border-color:#556B2F;color:#3A4720}",
    ".nra-hol-head{font-weight:700;display:flex;gap:7px;align-items:baseline}",
    ".nra-hol-head .ic{flex:0 0 auto}",
    ".nra-hol-head .hd{flex:1 1 auto;min-width:0}",
    ".nra-hol-item{margin-top:7px}",
    ".nra-hol-item:first-of-type{margin-top:5px}",
    ".nra-hol-name{font-weight:700}",
    ".nra-hol-when{opacity:.85;white-space:nowrap}",
    ".nra-hol-note{display:block;margin-top:1px}",
    ".nra-hol-more{margin-top:6px;opacity:.8;font-style:italic}",
    ".nra-hol.compact{padding:8px 10px;font-size:.82rem;margin:8px 0}",
    /* Show/hide toggle. Inherits the banner's own colour so it reads as
       part of the notice rather than a stray control. */
    ".nra-hol-toggle{flex:0 0 auto;background:none;border:0;padding:2px 4px;",
    "margin:-2px -4px -2px 0;font:inherit;font-size:.78rem;font-weight:700;",
    "color:inherit;opacity:.75;cursor:pointer;border-radius:5px;",
    "display:inline-flex;align-items:center;gap:4px;white-space:nowrap}",
    ".nra-hol-toggle:hover,.nra-hol-toggle:focus-visible{opacity:1;",
    "background:rgba(0,0,0,.06)}",
    ".nra-hol-toggle .cv{display:inline-block;transition:transform .15s ease}",
    ".nra-hol.is-collapsed .nra-hol-toggle .cv{transform:rotate(-90deg)}",
    ".nra-hol.is-collapsed .nra-hol-item,",
    ".nra-hol.is-collapsed .nra-hol-more{display:none}",
    "@media (max-width:520px){.nra-hol-when{white-space:normal}",
    ".nra-hol-toggle .tx{display:none}}"
  ].join("");

  function injectCss() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---- the Hide / Show toggle ----
     One click listener on the document handles every banner on the page,
     however many there are and whenever they appear. That matters on the
     trip planner, where banners are rebuilt each time a date changes —
     wiring a listener per banner would leak them.

     Collapsing folds away the detail but ALWAYS leaves the heading
     visible, so a warning can be tidied out of the way but never lost.
     The state is per banner and resets on reload, deliberately: a
     remembered "hidden" could hide a serious closure someone never saw. */
  var uid = 0;
  var toggleWired = false;

  function wireToggle() {
    if (toggleWired || !document.addEventListener) return;
    toggleWired = true;
    document.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest && e.target.closest("[data-hol-toggle]");
      if (!btn) return;
      var banner = btn.closest(".nra-hol");
      if (!banner) return;
      var collapsed = banner.classList.toggle("is-collapsed");
      btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
      var label = btn.querySelector(".tx");
      if (label) label.textContent = collapsed ? "Show" : "Hide";
    });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function pretty(isoStr) {
    var p = String(isoStr).split("-");
    return MONTHS[+p[1] - 1] + " " + (+p[2]);
  }

  /* "Dec 25", "Dec 25 - Jan 3", "Aug 1 - 31" */
  function prettyRange(a, b) {
    if (a === b) return pretty(a);
    var sameMonth = a.slice(0, 7) === b.slice(0, 7);
    return pretty(a) + " – " + (sameMonth ? String(+b.split("-")[2]) : pretty(b));
  }

  /* Build the banner. Returns "" when there is nothing to say. */
  function html(country, city, startISO, endISO, opts) {
    if (!window.NRA_HOLIDAYS || !startISO) return "";
    opts = opts || {};

    var hits;
    try {
      hits = window.NRA_HOLIDAYS.find(country, city, startISO, endISO);
    } catch (e) {
      return "";
    }
    if (!hits || !hits.length) return "";

    var max = opts.max || 3;
    var shown = hits.slice(0, max);
    var hidden = hits.length - shown.length;

    /* The banner takes the colour of its most serious holiday. */
    var top = LEVELS[shown[0].sev] || LEVELS[0];

    /* Each banner needs its own id so the toggle button can point at the
       part it controls, for screen readers. */
    uid += 1;
    var bodyId = "nra-hol-body-" + uid;

    var parts = [];
    parts.push('<div class="nra-hol ' + top.cls + (opts.compact ? " compact" : "") +
      '" role="note">');
    parts.push('<div class="nra-hol-head"><span class="ic" aria-hidden="true">' +
      top.icon + '</span><span class="hd">' + esc(top.lead) +
      (city ? " in " + esc(city) : "") + "</span>" +
      '<button type="button" class="nra-hol-toggle" data-hol-toggle' +
      ' aria-expanded="true" aria-controls="' + bodyId + '">' +
      '<span class="tx">Hide</span><span class="cv" aria-hidden="true">▾</span>' +
      "</button></div>");
    parts.push('<div id="' + bodyId + '">');

    shown.forEach(function (h) {
      var when = prettyRange(h.start, h.end);
      if (h.fuzzy) when += " (may shift a day)";
      parts.push('<div class="nra-hol-item"><span class="nra-hol-name">' +
        esc(h.name) + '</span> <span class="nra-hol-when">· ' + esc(when) +
        '</span><span class="nra-hol-note">' + esc(h.note) + "</span></div>");
    });

    if (hidden > 0) {
      parts.push('<div class="nra-hol-more">+ ' + hidden + " more holiday" +
        (hidden === 1 ? "" : "s") + " in this window.</div>");
    }

    parts.push("</div>");   /* close the collapsible body */
    parts.push("</div>");   /* close the banner */
    injectCss();
    wireToggle();
    return parts.join("");
  }

  /* Convenience: drop the banner straight into an element.
     Clears the element when there is nothing to warn about, so calling
     this repeatedly as the user changes dates does the right thing. */
  function render(el, country, city, startISO, endISO, opts) {
    if (!el) return false;
    var h = html(country, city, startISO, endISO, opts);
    el.innerHTML = h;
    return !!h;
  }

  window.NRA_HOLIDAY_BANNER = { html: html, render: render };
})();
