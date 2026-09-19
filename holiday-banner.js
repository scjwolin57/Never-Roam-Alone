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
     { max: 2 }         show at most this many items (default 3); the rest
                        open in a popup from a "+ N more" button
     { events: true }   also list the city's seasonal events and busy
                        periods (city-seasons.js) that fall in these months

   Seasonal events are month-level, holidays are exact. When both lists hold
   the same occasion (Naadam, Orthodox Easter, Ramadan...), the seasonal
   entry is dropped and the holiday alone decides whether it shows.
   NRA_HOLIDAY_BANNER.events(country, city, start, end) returns that
   de-duplicated event list for other callers (the finder's season pill).

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
    ".nra-hol{border-radius:3px;padding:11px 13px;margin:10px 0;",
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
    ".nra-hol-more{margin-top:6px}",
    ".nra-hol-more-btn{background:none;border:0;padding:0;font:inherit;font-weight:700;",
    "color:inherit;text-decoration:underline;cursor:pointer}",
    ".nra-hol-tag{display:block;margin-top:2px;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.75}",
    ".nra-hol-ov{position:fixed;inset:0;z-index:300;display:none;align-items:center;justify-content:center;",
    "background:rgba(43,36,23,.55);padding:16px}",
    ".nra-hol-ov.open{display:flex}",
    ".nra-hol-modal{position:relative;background:#faf6ec;color:#2b2417;border:1px solid #2b2417;border-radius:3px;",
    "max-width:520px;width:100%;max-height:82vh;overflow-y:auto;padding:22px 20px 18px;",
    "box-shadow:0 20px 50px rgba(0,0,0,.3);font-size:.92rem;line-height:1.5}",
    ".nra-hol-modal h3{margin:0 34px 4px 0;font-size:1.15rem}",
    ".nra-hol-modal .nra-hol-sub{margin:0 0 10px;opacity:.75;font-size:.84rem}",
    ".nra-hol-modal .nra-hol-item{padding:9px 0;border-top:1px solid rgba(43,36,23,.15);margin:0}",
    ".nra-hol-modal .nra-hol-when{white-space:normal}",
    ".nra-hol-x{position:absolute;top:10px;right:10px;width:30px;height:30px;border:1px solid #2b2417;",
    "border-radius:3px;background:none;font-size:1.2rem;line-height:1;cursor:pointer;color:inherit}",
    ".nra-hol.compact{padding:8px 10px;font-size:.82rem;margin:8px 0}",
    /* Show/hide toggle. Inherits the banner's own colour so it reads as
       part of the notice rather than a stray control. */
    ".nra-hol-toggle{flex:0 0 auto;background:none;border:0;padding:2px 4px;",
    "margin:-2px -4px -2px 0;font:inherit;font-size:.78rem;font-weight:700;",
    "color:inherit;opacity:.75;cursor:pointer;border-radius:3px;",
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
      var more = e.target && e.target.closest && e.target.closest("[data-hol-more]");
      if (more) { openAll(more.closest(".nra-hol")); return; }
      var ov = document.getElementById("nra-hol-ov");
      if (ov && ov.classList.contains("open") &&
          (e.target === ov || (e.target.closest && e.target.closest(".nra-hol-x")))) { closeAll(); return; }
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

  /* ---- the "+ N more" popup: every holiday and event for those dates ----
     The full list travels inside the banner as a <template>, so a banner that
     is rebuilt on every date change leaves nothing behind. One popup element
     is shared by the whole page. */
  function openAll(banner) {
    var tpl = banner && banner.querySelector("template.nra-hol-all");
    if (!tpl) return;
    var ov = document.getElementById("nra-hol-ov");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "nra-hol-ov";
      ov.className = "nra-hol-ov";
      ov.setAttribute("role", "dialog");
      ov.setAttribute("aria-modal", "true");
      ov.setAttribute("aria-labelledby", "nra-hol-ov-title");
      document.body.appendChild(ov);
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && ov.classList.contains("open")) closeAll();
      });
    }
    ov.innerHTML = '<div class="nra-hol-modal">' +
      '<button type="button" class="nra-hol-x" aria-label="Close">&times;</button>' +
      tpl.innerHTML + "</div>";
    ov.classList.add("open");
    var x = ov.querySelector(".nra-hol-x");
    if (x) x.focus();
  }
  function closeAll() {
    var ov = document.getElementById("nra-hol-ov");
    if (ov) ov.classList.remove("open");
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

  /* ---- seasonal events (city-seasons.js) ---- */
  var FULL = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  /* Words too common to prove two entries are the same occasion. */
  var GENERIC = { holiday: 1, holidays: 1, festival: 1, festivals: 1, season: 1,
    summer: 1, winter: 1, spring: 1, national: 1, public: 1, celebrations: 1,
    closure: 1, closures: 1, mandatory: 1, week: 1, days: 1, school: 1, year: 1,
    period: 1, peak: 1, easter: 1, city: 1, local: 1 };
  function sameOccasion(label, holName) {
    var l = String(label).toLowerCase(), h = String(holName).toLowerCase();
    if (/easter/.test(h) && /easter/.test(l)) return true;
    return h.split(/[\s()\/,-]+/).some(function (t) {
      return t.length > 3 && !GENERIC[t] && l.indexOf(t) >= 0;
    });
  }
  /* Month numbers (1-12) a stay touches, in order, at most 12. */
  function stayMonths(a, b) {
    var y = +a.slice(0, 4), m = +a.slice(5, 7), ye = +b.slice(0, 4), me = +b.slice(5, 7), out = [];
    while ((y < ye || (y === ye && m <= me)) && out.length < 12) {
      out.push({ y: y, m: m });
      if (++m > 12) { m = 1; y++; }
    }
    return out;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function lastDay(y, m) { return new Date(y, m, 0).getDate(); }

  function events(country, city, startISO, endISO) {
    var S = window.NRA_SEASON && window.NRA_SEASON[city];
    if (!S || !S.ev || !startISO) return [];
    var span = stayMonths(startISO, endISO || startISO);
    var out = [];
    S.ev.forEach(function (e) {
      var hit = span.filter(function (x) { return e.m.indexOf(x.m) >= 0; });
      if (!hit.length) return;
      /* Same occasion as a holiday in the event's own month(s)? Then the
         holiday (exact dates) speaks for it, overlapping or not. */
      var dup = false;
      if (window.NRA_HOLIDAYS) {
        hit.forEach(function (x) {
          if (dup) return;
          var f = [];
          try {
            f = window.NRA_HOLIDAYS.find(country, city, x.y + "-" + pad(x.m) + "-01",
              x.y + "-" + pad(x.m) + "-" + pad(lastDay(x.y, x.m))) || [];
          } catch (err) { f = []; }
          dup = f.some(function (h) { return sameOccasion(e.l, h.name || h.n || ""); });
        });
      }
      if (dup) return;
      var cut = String(e.l).split(" — ");
      out.push({
        label: e.l,
        name: cut[0],
        note: (function (n) { return n.charAt(0).toUpperCase() + n.slice(1); })(cut.slice(1).join(" — ")),
        when: "in " + (function (ms) {          /* "July", "July and August", "Dec, Jan and Feb" */
          return ms.length < 3 ? ms.join(" and ") : ms.slice(0, -1).join(", ") + " and " + ms[ms.length - 1];
        })(hit.map(function (x) { return FULL[x.m - 1]; }))
      });
    });
    return out;
  }

  function itemHTML(it) {
    if (it.event) {
      return '<div class="nra-hol-item"><span class="nra-hol-name">' + esc(it.name) +
        '</span> <span class="nra-hol-when">· ' + esc(it.when) + "</span>" +
        (it.note ? '<span class="nra-hol-note">' + esc(it.note) + "</span>" : "") +
        '<span class="nra-hol-tag">Seasonal event</span></div>';
    }
    var when = prettyRange(it.start, it.end);
    if (it.fuzzy) when += " (may shift a day)";
    return '<div class="nra-hol-item"><span class="nra-hol-name">' + esc(it.name) +
      '</span> <span class="nra-hol-when">· ' + esc(when) +
      '</span><span class="nra-hol-note">' + esc(it.note) + "</span></div>";
  }

  /* Build the banner. Returns "" when there is nothing to say. */
  function html(country, city, startISO, endISO, opts) {
    if (!window.NRA_HOLIDAYS || !startISO) return "";
    opts = opts || {};

    var hits;
    try {
      hits = window.NRA_HOLIDAYS.find(country, city, startISO, endISO) || [];
    } catch (e) {
      hits = [];
    }
    var evs = opts.events ? events(country, city, startISO, endISO || startISO) : [];
    var items = hits.concat(evs.map(function (x) { x.event = true; return x; }));
    if (!items.length) return "";

    var max = opts.max || 3;
    var shown = items.slice(0, max);
    var hidden = items.length - shown.length;

    /* The banner takes the colour of its most serious holiday; events alone
       are an FYI. */
    var top = (hits.length && LEVELS[hits[0].sev]) || LEVELS[0];

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

    shown.forEach(function (it) { parts.push(itemHTML(it)); });

    if (hidden > 0) {
      parts.push('<div class="nra-hol-more"><button type="button" class="nra-hol-more-btn"' +
        ' data-hol-more aria-haspopup="dialog">+ ' + hidden + " more for these dates</button></div>");
      parts.push('<template class="nra-hol-all"><h3 id="nra-hol-ov-title">' + esc(top.lead) +
        (city ? " in " + esc(city) : "") + '</h3><p class="nra-hol-sub">' +
        esc(prettyRange(startISO, endISO || startISO)) + " · " + items.length +
        " holidays and events</p>" + items.map(itemHTML).join("") + "</template>");
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

  window.NRA_HOLIDAY_BANNER = { html: html, render: render, events: events };
})();
