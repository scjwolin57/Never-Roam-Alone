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
    ".nra-hol-item{margin-top:7px}",
    ".nra-hol-item:first-of-type{margin-top:5px}",
    ".nra-hol-name{font-weight:700}",
    ".nra-hol-when{opacity:.85;white-space:nowrap}",
    ".nra-hol-note{display:block;margin-top:1px}",
    ".nra-hol-more{margin-top:6px;opacity:.8;font-style:italic}",
    ".nra-hol.compact{padding:8px 10px;font-size:.82rem;margin:8px 0}",
    "@media (max-width:520px){.nra-hol-when{white-space:normal}}"
  ].join("");

  function injectCss() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
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

    var parts = [];
    parts.push('<div class="nra-hol ' + top.cls + (opts.compact ? " compact" : "") +
      '" role="note">');
    parts.push('<div class="nra-hol-head"><span class="ic" aria-hidden="true">' +
      top.icon + '</span><span>' + esc(top.lead) +
      (city ? " in " + esc(city) : "") + "</span></div>");

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

    parts.push("</div>");
    injectCss();
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
