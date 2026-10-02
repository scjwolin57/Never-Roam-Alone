/* Match a Roamer's home city (profile "Home city" / "Home country") to one
   of our city guides (Jeff, 2026-10-02). Shared by profile.html, which
   offers the guide list while typing and a "Request a guide" button for a
   city we don't cover, and community.html, which sends a local to their
   own city's Local's Perspective form.

   Reads window.NRA_DESTINATIONS (destinations.js), the one city list, so
   a new guide is matched the day it is added. Case and accents are ignored. */
(function () {
  "use strict";

  function norm(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function list() { return Array.isArray(window.NRA_DESTINATIONS) ? window.NRA_DESTINATIONS : []; }

  /* The guide for this city, or null. When two guides share a name, the
     country decides; without a country the first one is used. */
  function find(city, country) {
    var c = norm(city); if (!c) return null;
    var k = norm(country);
    var hits = list().filter(function (d) { return norm(d.city) === c; });
    if (!hits.length) return null;
    if (k) {
      var same = hits.filter(function (d) { return norm(d.country) === k; });
      if (same.length) return same[0];
    }
    return hits[0];
  }

  function guideUrl(d, hash) {
    return "city.html?city=" + encodeURIComponent(d.city) + (hash ? "#" + hash : "");
  }

  /* <option> list for a <datalist>: "City, Country", sorted by city. */
  function optionsHTML() {
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]; }); };
    return list().slice().sort(function (a, b) { return a.city.localeCompare(b.city); })
      .map(function (d) { return '<option value="' + esc(d.city + ", " + d.country) + '"></option>'; }).join("");
  }

  /* "Lisbon, Portugal" typed or picked from the list -> { city, country }. */
  function split(value) {
    var v = String(value || "").trim(), i = v.lastIndexOf(",");
    if (i > 0) {
      var city = v.slice(0, i).trim(), country = v.slice(i + 1).trim();
      if (find(city, country)) return { city: city, country: country };
    }
    return { city: v, country: "" };
  }

  window.NRA_HOMECITY = { norm: norm, find: find, guideUrl: guideUrl, optionsHTML: optionsHTML, split: split };
})();
