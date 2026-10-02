/* Contribution score, levels and Trusted Traveler Rating for Roamer profiles
   (Jeff, 2026-10-02; decisions.md, _needs-attention/contribution-rating-2026-10-02.md).
   Shared by profile.html (your own numbers) and roamer.html (a public profile).

   - Contribution score: points for approved contributions. The ledger and the
     values live in the database and netlify/functions/_shared/contrib.js:
     interview 20, photo 10, day trip or landmark 10, blog post 25,
     recommendation 5, event 5, correction 5. Nothing here adds points.
   - Level: named by the score (LEVELS below).
   - Trusted Traveler badge: automatic from TRUSTED_AT points.
   - Trusted Traveler Rating: the share of thumbs up among all thumbs up / down
     on the member's approved contributions, shown from MIN_VOTES votes.
   The thresholds live only here, so the two pages can never disagree. */
(function () {
  "use strict";

  var LEVELS = [
    { min: 0,   name: "Roamer" },
    { min: 25,  name: "Contributor" },
    { min: 100, name: "Regular" },
    { min: 250, name: "Expert" }
  ];
  var TRUSTED_AT = 100;   // the Trusted Traveler badge switches on at the Regular level
  var MIN_VOTES = 5;      // fewer votes than this: "not rated yet"

  function level(points) {
    var p = Math.max(0, points | 0), cur = LEVELS[0], next = null;
    for (var i = 0; i < LEVELS.length; i++) {
      if (p >= LEVELS[i].min) { cur = LEVELS[i]; next = LEVELS[i + 1] || null; }
    }
    return { name: cur.name, next: next };
  }

  function rating(up, down) {
    up = Math.max(0, up | 0); down = Math.max(0, down | 0);
    var n = up + down;
    return { n: n, rated: n >= MIN_VOTES, pct: n ? Math.round(up * 100 / n) : 0 };
  }

  /* Read the three numbers. Owner: their own, even while private (rpc).
     Anyone else: the public view, which only has public profiles. */
  async function fetchStats(sb, id, isOwner) {
    if (!sb || !id) return null;
    try {
      if (isOwner) {
        var r = await sb.rpc("my_contribution_stats");
        var row = r && r.data && (Array.isArray(r.data) ? r.data[0] : r.data);
        if (row) return { points: row.points || 0, up: row.votes_up || 0, down: row.votes_down || 0 };
      }
      var q = await sb.from("roamer_contribution_stats").select("points,votes_up,votes_down").eq("id", id).maybeSingle();
      if (q && q.data) return { points: q.data.points || 0, up: q.data.votes_up || 0, down: q.data.votes_down || 0 };
    } catch (e) { /* setup SQL not run yet, or offline: show nothing */ }
    return null;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  /* The two stat boxes, in the travel-counter style (master.css .visit-counter). */
  function html(stats, opts) {
    opts = opts || {};
    var lv = level(stats.points), rt = rating(stats.up, stats.down);
    var nextLine = lv.next ? "Next level, " + lv.next.name + ", at " + lv.next.min : "Top level";
    var rateBig = rt.rated ? rt.pct + "%" : "&ndash;";
    var rateLine = rt.rated
      ? "positive &middot; " + rt.n + " vote" + (rt.n === 1 ? "" : "s")
      : (rt.n ? "not rated yet (" + rt.n + " of " + MIN_VOTES + " votes)" : "not rated yet");
    return '<div class="visit-counter contrib-stats">' +
        '<div class="vc-stat"><strong>' + esc(stats.points) + '</strong>' +
          '<span>Contribution score &middot; <b>' + esc(lv.name) + '</b></span>' +
          '<span class="contrib-sub">' + esc(nextLine) + '</span></div>' +
        '<div class="vc-stat vc-rating"><strong>' + rateBig + '</strong>' +
          '<span>Trusted Traveler Rating</span>' +
          '<span class="contrib-sub">' + rateLine + '</span></div>' +
      '</div>' +
      (opts.howTo ? '<p class="contrib-how">Points come from contributions we approve: an interview 20, a blog post 25, a photo 10, a day trip or landmark 10, a place recommendation 5, an event 5, a correction 5. ' +
        'The badge comes at ' + TRUSTED_AT + ' points. The rating is the share of thumbs up on your contributions, shown from ' + MIN_VOTES + ' votes.</p>' : '');
  }

  window.NRA_CONTRIB = {
    LEVELS: LEVELS, TRUSTED_AT: TRUSTED_AT, MIN_VOTES: MIN_VOTES,
    level: level, rating: rating, fetchStats: fetchStats, html: html,
    trusted: function (stats) { return !!stats && (stats.points | 0) >= TRUSTED_AT; }
  };
})();
