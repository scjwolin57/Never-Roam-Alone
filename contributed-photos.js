/* =====================================================================
   CONTRIBUTED-PHOTOS.JS — put approved visitor photos on the page.

   A photo contributed through the form is reviewed by email. Approving it
   copies the file into a public Supabase bucket and marks the row approved
   (netlify/functions/approve-photo.js). This module is the other half: it
   reads the approved rows for the city being viewed and folds them into the
   same globals the static photo files fill, so nothing that renders a photo
   has to know where the photo came from.

   Slots it can fill, all in the shape their static counterpart already uses:
     city-hero          -> NRA_CITY_PHOTO[city]        {img, page, credit}
     neighborhood-hero  -> NRA_HOOD_PHOTO[city][hood]  {img, page, src}
     landmark           -> NRA_LANDMARK_PHOTOS[city][i]{img, page, credit}
     food-dish          -> NRA_FOOD_PHOTOS[city][i]    {img, page, by}

   Two rules this module holds to:

     1. It never delays the page. The fetch starts as the script loads, in
        parallel with the city's own data, and gives up after a moment. If
        Supabase is slow, unreachable, or not configured, the page renders
        with its static photos exactly as it did before.

     2. Approved photos win. You approved them by hand, so a contributed
        photo replaces the static one in that slot rather than only filling
        an empty one. When two are approved for the same slot, the one
        reviewed most recently wins.

   Load it before the page's own render script, after nra-config.js.
   ===================================================================== */

window.NRA_CONTRIBUTED = (function(){
  "use strict";

  var cfg     = window.NRA_CONFIG || {};
  var enabled = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  var BUCKET  = "landmark-photos";
  var TIMEOUT = 2500;   /* ms — after this the page renders without us */

  var rows = [];
  var wanted = (new URLSearchParams(location.search).get("city") || "").trim();

  /* Start immediately, so this overlaps the city's own data fetch. Always
     resolves — a failure here must never stop the page from rendering. */
  var readyP = (enabled && wanted) ? load() : Promise.resolve([]);

  function load(){
    var url = cfg.SUPABASE_URL.replace(/\/+$/, "") +
      "/rest/v1/published_photos?select=*&order=reviewed_at.asc" +
      "&city=ilike." + encodeURIComponent(wanted);
    var ctl = ("AbortController" in window) ? new AbortController() : null;
    var timer = setTimeout(function(){ if (ctl) ctl.abort(); }, TIMEOUT);
    return fetch(url, {
        headers: { apikey: cfg.SUPABASE_ANON_KEY, Authorization: "Bearer " + cfg.SUPABASE_ANON_KEY },
        signal: ctl ? ctl.signal : undefined
      })
      .then(function(r){ return r.ok ? r.json() : []; })
      .catch(function(){ return []; })
      .then(function(list){
        clearTimeout(timer);
        rows = Array.isArray(list) ? list : [];
        return rows;
      });
  }

  function publicUrl(path){
    return cfg.SUPABASE_URL.replace(/\/+$/, "") +
      "/storage/v1/object/public/" + BUCKET + "/" + String(path).split("/").map(encodeURIComponent).join("/");
  }

  /* A contributor types their own credit name and work link, and every photo
     renderer on the page builds its credit with innerHTML. So both are made
     safe HERE, once, rather than trusting four separate templates to escape
     them: the name loses anything that could open a tag or an attribute, and
     the link has to be a plain http(s) URL before it is used at all. */
  function safeText(s){
    return String(s == null ? "" : s).replace(/[<>&"'`\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  }
  function safeUrl(s){
    var u = String(s == null ? "" : s).trim();
    if (!/^https?:\/\//i.test(u)) return "";
    if (/[<>"'`\s\\]/.test(u)) return "";
    return u;
  }

  /* Where the credit links to. A contributor who asked for a profile credit
     gets their profile; one who gave a link to their work gets that. Anyone
     else gets the page explaining what a contributed photo is, because the
     credit line is a link everywhere it appears — without a target the
     existing renderers would show no credit at all. */
  function creditLink(row){
    if (row.credit_mode === "none") return "";
    var work = safeUrl(row.work_url);
    if (work) return work;
    if (row.credit_profile_id && /^[0-9a-f-]{36}$/i.test(String(row.credit_profile_id)))
      return "roamer.html?id=" + encodeURIComponent(row.credit_profile_id);
    return "terms.html#photos";
  }
  function creditName(row){
    if (row.credit_mode === "none") return "";
    return safeText(row.credit_name) || "A Never Roam Alone traveller";
  }

  /* Find a landmark or dish by name when the row has no index — a slot can
     move if the city's list is edited after the photo was contributed. */
  function indexOf(row, list, nameAt){
    if (typeof row.landmark_idx === "number" && row.landmark_idx >= 0) return row.landmark_idx;
    if (!Array.isArray(list)) return -1;
    var want = String(row.subject || "").toLowerCase();
    for (var i = 0; i < list.length; i++) {
      if (String(nameAt(list[i]) || "").toLowerCase() === want) return i;
    }
    return -1;
  }

  /* Merge everything approved for this city into the photo globals. Safe to
     call more than once, and a no-op when nothing was approved. */
  function apply(cityName){
    if (!rows.length || !cityName) return 0;
    var key = String(cityName);
    var used = 0;

    rows.forEach(function(row){
      if (String(row.city || "").toLowerCase() !== key.toLowerCase()) return;
      if (!row.published_path) return;
      var img  = publicUrl(row.published_path);
      var page = creditLink(row);
      var who  = creditName(row);

      if (row.subject_kind === "city-hero") {
        window.NRA_CITY_PHOTO = window.NRA_CITY_PHOTO || {};
        window.NRA_CITY_PHOTO[key] = { img: img, page: page, credit: who };
        used++;
        return;
      }

      if (row.subject_kind === "neighborhood-hero") {
        var hood = String(row.subject || "").trim();
        if (!hood) return;
        window.NRA_HOOD_PHOTO = window.NRA_HOOD_PHOTO || {};
        window.NRA_HOOD_PHOTO[key] = window.NRA_HOOD_PHOTO[key] || {};
        window.NRA_HOOD_PHOTO[key][hood] = { img: img, page: page, src: who };
        used++;
        return;
      }

      if (row.subject_kind === "landmark") {
        var lmks = (window.NRA_LANDMARKS || {})[key];
        var li = indexOf(row, lmks, function(l){ return Array.isArray(l) ? l[0] : l; });
        if (li < 0) return;
        window.NRA_LANDMARK_PHOTOS = window.NRA_LANDMARK_PHOTOS || {};
        var arr = window.NRA_LANDMARK_PHOTOS[key] = window.NRA_LANDMARK_PHOTOS[key] || [];
        while (arr.length <= li) arr.push({});
        arr[li] = { img: img, page: page, credit: who };
        used++;
        return;
      }

      if (row.subject_kind === "food-dish") {
        var dishes = (window.CITY_FOOD || {})[key];
        var fi = indexOf(row, dishes, function(d){ return d && d.name; });
        if (fi < 0) return;
        window.NRA_FOOD_PHOTOS = window.NRA_FOOD_PHOTOS || {};
        var farr = window.NRA_FOOD_PHOTOS[key] = window.NRA_FOOD_PHOTOS[key] || [];
        while (farr.length <= fi) farr.push(null);
        farr[fi] = { img: img, page: page, by: who };
        used++;
      }
    });
    return used;
  }

  return {
    enabled: enabled,
    ready: function(){ return readyP; },
    apply: apply,
    rows: function(){ return rows.slice(); }
  };
})();
