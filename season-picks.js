/* Never Roam Alone — the one rule for sorting cities by month, from
   window.NRA_SEASON (city-seasons.js). Used by best-time-to-visit.html
   and the homepage "Seasonal pick" card, so both always agree.
   NRA_monthBuckets(month 1-12, cities [{city,...}]) returns
   { ideal:[{c,t}], events:[{c,label}], avoid:[{c,why}], noData:[c] };
   ideal is sorted closest to a comfortable 75°F first, ties by name. */
window.NRA_monthBuckets = function(month, cities){
  var SEASON = window.NRA_SEASON || {};
  var q = Math.floor((month - 1) / 3);   // 0-3, matches the t[]/r[] quarter arrays
  var ideal = [], events = [], avoid = [], noData = [];
  (cities || []).forEach(function(c){
    var S = SEASON[c.city];
    if(!S){ noData.push(c); return; }
    var ev = (S.ev || []).find(function(e){ return e.m.indexOf(month) >= 0; });
    if(ev) events.push({ c: c, label: ev.l });
    var t = S.t ? S.t[q] : null;
    var rd = S.r ? S.r[q] : null;   // rainy days per month
    if(!ev){
      if(t != null && t >= 95) avoid.push({ c: c, why: "Very hot this month" });
      else if(rd != null && rd >= 15) avoid.push({ c: c, why: "Deep in rainy season" });
      else if(t != null && t <= 40) avoid.push({ c: c, why: "Very cold this month" });
      else if(t != null && t >= 62 && t <= 88 && (rd == null || rd < 12)) ideal.push({ c: c, t: t });
    }
  });
  ideal.sort(function(a,b){ return (Math.abs(75-a.t) - Math.abs(75-b.t)) || a.c.city.localeCompare(b.c.city); });
  return { ideal: ideal, events: events, avoid: avoid, noData: noData };
};
/* How many ideal cities best-time-to-visit.html shows; the homepage card
   picks from the same set so "See more" always lists the city it showed. */
window.NRA_IDEAL_SHOWN = 12;
