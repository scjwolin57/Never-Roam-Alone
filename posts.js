/* =====================================================================
   POSTS.JS — the single source of truth for every blog post.

   TO ADD A NEW POST: copy one block below (from `{` to `},`), paste it
   at the TOP of the list, and edit the fields. That's it — the post
   automatically appears on the home page, the blog page (with search
   and sort), and gets its own article page at post.html?post=your-slug

   Fields:
     slug     – the post's web address ending (lowercase, dashes only)
     title    – headline shown everywhere
     tag      – short label on the photo (usually the country)
     date     – publish date as YYYY-MM-DD (used for sorting)
     location – "City, Country" shown under the article title
     seed     – word used to pick the placeholder photo
     excerpt  – one-sentence teaser shown on the tiles
     likes / views – engagement numbers (placeholder until real data)
     authorId   – OPTIONAL: credits the article to a community member
                  ("trusted traveler"). Paste their account ID here and
                  the article appears on their public profile page, and
                  the article's byline links back to that profile.
                  WHERE TO FIND THE ID: it's the long code at the end of
                  their public page address, e.g.
                  roamer.html?id=THIS-LONG-CODE (they can send you the
                  link from "See your public page" on their profile).
     authorName – OPTIONAL: the name to show in the article byline
                  (defaults to "Jeff" when left out)
     body     – the article, as a list of blocks:
                ["lead", ...]  large opening paragraph
                ["p", ...]     normal paragraph
                ["h2", ...]    section heading
                ["quote", ...] pull-quote
   ===================================================================== */

window.NRA_POSTS = [
  /* No posts yet — real articles will be added here (or arrive via the
     online editor / blog-remote.js). The blog page shows an
     "articles coming soon" notice while this list is empty. */
];

/* --- Shared helpers (used by the pages; no need to edit) --- */
window.NRA_POSTS_UTIL = {
  /* newest-first copy of the list */
  byNewest: function(){
    return window.NRA_POSTS.slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
  },
  /* find one post by its slug */
  bySlug: function(slug){
    for (var i = 0; i < window.NRA_POSTS.length; i++){
      if (window.NRA_POSTS[i].slug === slug) return window.NRA_POSTS[i];
    }
    return null;
  },
  /* "2026-06-12" -> "June 12, 2026" */
  longDate: function(iso){
    return new Date(iso + "T00:00").toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  },
  /* "2026-06-12" -> "June 2026" (tile date) */
  shortDate: function(iso){
    return new Date(iso + "T00:00").toLocaleDateString("en-US", { year:"numeric", month:"long" });
  }
};
