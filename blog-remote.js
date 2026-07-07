/* =====================================================================
   BLOG-REMOTE.JS — loads articles written in the online blog editor.

   Articles created at blog-admin.html are stored in the site's Supabase
   database. This script fetches the PUBLISHED ones and merges them into
   window.NRA_POSTS (the list that posts.js starts), so they show up on
   the home page, the blog page, and get their own article page — exactly
   like posts written directly in posts.js.

   If a database article has the same web address (slug) as a posts.js
   article, the database version wins. That's how you "edit" one of the
   original posts.js articles: the admin page copies it into the editor,
   and publishing the copy replaces the original everywhere.

   If Supabase isn't configured or can't be reached, the site simply
   shows the posts.js articles — nothing breaks.

   Pages that display posts can set window.NRA_BLOG_REFRESH to a
   function; it is called once the database posts have been merged in
   so the page can redraw itself.
   ===================================================================== */

(function(){
  /* Photo helper used by the pages: a post's chosen cover photo if it
     has one, otherwise the usual placeholder keyed to its seed word. */
  window.NRA_POST_PHOTO = function(p, w, h){
    if (p && p.cover && p.cover.url) return p.cover.url;
    var seed = (p && p.seed) || (p && p.slug) || "travel";
    return "https://picsum.photos/seed/" + encodeURIComponent(seed) + "-nra/" + (w||600) + "/" + (h||400);
  };

  var cfg = window.NRA_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return;   // guest mode: posts.js only

  var url = cfg.SUPABASE_URL.replace(/\/$/, "") +
    "/rest/v1/blog_posts" +
    "?published=eq.true" +
    "&select=slug,title,tag,location,date,seed,cover,excerpt,body,likes,views,author_id,author_name" +
    "&order=date.desc";

  var ctrl = ("AbortController" in window) ? new AbortController() : null;
  var timer = setTimeout(function(){ if (ctrl) ctrl.abort(); }, 8000);  // never hang the page

  fetch(url, {
    headers: {
      apikey: cfg.SUPABASE_ANON_KEY,
      Authorization: "Bearer " + cfg.SUPABASE_ANON_KEY
    },
    signal: ctrl ? ctrl.signal : undefined
  })
  .then(function(r){ return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)); })
  .then(function(rows){
    clearTimeout(timer);
    if (!Array.isArray(rows) || !rows.length) return;

    var remote = rows.map(function(r){
      return {
        slug: r.slug,
        title: r.title,
        tag: r.tag || "",
        date: r.date,                       // "YYYY-MM-DD"
        location: r.location || "",
        seed: r.seed || r.slug,
        cover: r.cover || null,
        excerpt: r.excerpt || "",
        likes: r.likes || 0,
        views: r.views || 0,
        authorId: r.author_id || undefined,
        authorName: r.author_name || undefined,
        body: Array.isArray(r.body) ? r.body : [],
        remote: true                        // marks database-born posts
      };
    });

    var taken = {};
    remote.forEach(function(p){ taken[p.slug] = true; });

    var local = (window.NRA_POSTS || []).filter(function(p){ return !taken[p.slug]; });
    window.NRA_POSTS = remote.concat(local);

    if (typeof window.NRA_BLOG_REFRESH === "function"){
      try { window.NRA_BLOG_REFRESH(); } catch(e){}
    }
  })
  .catch(function(){ clearTimeout(timer); /* offline or not set up yet — posts.js still shows */ });
})();
