/* =====================================================================
   Never Roam Alone — deep link to one item on a city guide.

   The "your contribution is live" emails and inbox messages link to
       city.html?city=<City>#see=<type>/<id>
   (built by netlify/functions/_shared/seelink.js). This file finds that
   item, opens whatever it sits inside (a hidden plate, another
   neighborhood's tab, the "From Roamers" group, "Show all" interviews,
   the food popup, the events calendar day), scrolls to it and highlights
   it for a few seconds.

   Types:
     hero/                       the city hero photo
     hood/<neighborhood name>    a neighborhood's photo tile
     dish/<dish name>            a dish in the food & drink popup
     event/<YYYY-MM-DD>/<name>   an event, in its calendar day popup
     <vote type>/<vote id>       anything with a like / dislike widget
                                 (ids as city.html's voteWidgetHTML gives them):
                                 landmark, daytrip, recommendation,
                                 food_place, insight, hood_photo ...
   The page renders in stages and some data loads late, so it keeps
   looking for up to 20 seconds, then gives up quietly: the visitor is
   still on the right city guide.
   ===================================================================== */
(function(){
  "use strict";
  var m = /^#see=([^\/]*)\/?(.*)$/.exec(location.hash || "");
  if (!m) return;
  var type, id;
  try { type = decodeURIComponent(m[1]); id = decodeURIComponent(m[2] || ""); } catch (e) { return; }
  if (!type) return;

  var css = document.createElement("style");
  css.textContent =
    "@keyframes nraSeeFlash{0%,100%{box-shadow:0 0 0 0 rgba(181,73,44,0)}15%,70%{box-shadow:0 0 0 4px rgba(181,73,44,.85)}}" +
    ".nra-see-flash{animation:nraSeeFlash 4.5s ease-in-out 1}";
  document.head.appendChild(css);

  var esc = function(s){ return (window.CSS && CSS.escape) ? CSS.escape(s) : String(s).replace(/["\\]/g, "\\$&"); };
  var norm = function(s){ return String(s || "").replace(/\s+/g, " ").trim().toLowerCase(); };
  var CARD = ".lmk-card,.dtcard,.ins-card,.food-place,.evt-item,.lodge-row,.bar-row,.pick-row,.hood-tile,.food-item";

  /* Undo everything that can hide an element: a collapsed plate, an
     unselected neighborhood, a hidden "From Roamers" group. */
  function reveal(el){
    var body = el.closest(".plate-body");
    if (body && body.style.display === "none") {
      var plate = body.previousElementSibling, t = plate && plate.querySelector(".plate-toggle");
      if (t) t.click();
    }
    var panel = el.closest(".hood-panel");
    if (panel && panel.hidden) {
      var tab = document.getElementById(panel.id.replace("hood-panel-", "hood-tab-"));
      if (tab) tab.click();
    }
    var rb = el.closest(".roamer-picks-body");
    if (rb && rb.hidden) {
      var rt = document.querySelector('.roamer-toggle[aria-controls="' + esc(rb.id) + '"]');
      if (rt) rt.click();
    }
  }
  function show(el){
    reveal(el);
    var card = el.closest(CARD) || el;
    setTimeout(function(){
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.remove("nra-see-flash"); void card.offsetWidth;
      card.classList.add("nra-see-flash");
      setTimeout(function(){ card.classList.remove("nra-see-flash"); }, 4600);
    }, 150);
  }

  /* Steps that open a container once, if the item is not on the page yet.
     A step that returns false found nothing to act on yet and is tried again. */
  var opened = {};
  function once(key, fn){
    if (opened[key]) return;
    var r; try { r = fn(); } catch (e) { r = false; }
    if (r !== false) opened[key] = true;
  }

  function openFood(dish){
    once("food", function(){
      if (!window.openModal || !window.loadFoodData) return false;
      var go = function(){ window.openModal("Local food & drink"); };
      var p = window.loadFoodData();
      if (p && p.then) p.then(go, go); else go();
    });
    if (!dish) return null;
    var items = document.querySelectorAll(".food-item");
    for (var i = 0; i < items.length; i++) {
      var n = items[i].querySelector(".food-item-name");
      if (n && norm(n.textContent) === norm(dish)) return items[i];
    }
    return null;
  }

  function findEvent(){
    var parts = id.split("/"), day = parts[0], name = parts.slice(1).join("/");
    var item = null;
    document.querySelectorAll(".evt-overlay.open .evt-item").forEach(function(it){
      var n = it.querySelector(".evt-name");
      if (!item && n && (!name || norm(n.textContent) === norm(name))) item = it;
    });
    if (item) return item;
    var cell = document.querySelector('.cal-cell[data-date="' + esc(day) + '"]');
    if (cell) { once("evday", function(){ cell.scrollIntoView({ block: "center" }); cell.click(); }); return null; }
    /* step the calendar toward the event's month */
    var mon = document.querySelector("#cal-month .cal-mon"), yr = document.getElementById("cal-month");
    if (!mon || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
    var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var vm = MONTHS.indexOf(mon.textContent.trim()), vy = parseInt((yr.textContent.match(/\d{4}/) || [])[0], 10);
    if (vm < 0 || !vy) return null;
    var diff = (Number(day.slice(0, 4)) - vy) * 12 + (Number(day.slice(5, 7)) - 1 - vm);
    if (diff && Math.abs(diff) < 60) {
      var btn = document.getElementById(diff > 0 ? "cal-next" : "cal-prev");
      for (var k = 0; k < Math.abs(diff) && btn; k++) btn.click();
    }
    return null;
  }

  function find(){
    if (type === "hero") return document.querySelector(".hero");
    if (type === "hood") return document.querySelector('.hood-tile .hood-hero[data-hood="' + esc(id) + '"]');
    if (type === "dish") return openFood(id);
    if (type === "event") return findEvent();
    var w = document.querySelector('[data-vote-type="' + esc(type) + '"][data-vote-id="' + esc(id) + '"]');
    if (w) return w;
    /* landmarks and day trips normally load only when their section nears the screen: ask city.html to load
       them now (window.loadLmkDtData, set once the page has rendered); before that, scroll to the section */
    if (type === "landmark" || type === "daytrip") {
      var sec = document.getElementById(type === "landmark" ? "lmk-section-body" : "daytrips-section-body");
      if (window.loadLmkDtData) window.loadLmkDtData();   /* runs once; city.html guards it */
      else if (sec && tries % 4 === 0) { reveal(sec); sec.scrollIntoView({ block: "start", behavior: "instant" }); }
    }
    if (type === "insight") once("insall", function(){
      var more = document.querySelectorAll("[data-ins-all]");
      if (!more.length) return false;
      more.forEach(function(b){ b.click(); });
    });
    if (type === "food_place") {
      var dishEl = openFood(id.split("|")[0]);
      if (dishEl) once("dish", function(){ dishEl.click(); });
    }
    return null;
  }

  var tries = 0;
  (function look(){
    var el = null;
    try { el = find(); } catch (e) {}
    if (el) return show(el);
    if (++tries < 40) setTimeout(look, 500);
  })();
})();
