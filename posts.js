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
  {
    slug: "kyoto-backstreets",
    title: "Three Days Lost in Kyoto's Backstreets",
    tag: "Japan",
    date: "2026-06-12",
    location: "Kyoto, Japan",
    seed: "kyoto",
    excerpt: "Temple bells, a tiny noodle counter, and the lantern-lit alley I never meant to find.",
    likes: 312, views: 8400,
    // To credit a trusted traveler, un-comment and fill these two lines:
    // authorId: "paste-their-account-id-here",
    // authorName: "Their Name",
    body: [
      ["lead","I came to Kyoto with a list of temples and left with a map of noodle counters, hidden shrines, and the particular quiet of a lane at dawn."],
      ["p","The famous sights earn their fame, and you should see them. But Kyoto rewards the wanderer more than the checklist. On my second morning I gave up on the plan, picked a direction, and started walking."],
      ["quote","The best alley in Kyoto is always the one you weren't looking for."],
      ["p","By noon I'd found a tea house older than my country, a cat who owned a doorway, and a grandmother who pressed a warm sweet potato into my hands and waved away my money. None of it was on the list. All of it is why I'll go back."],
      ["h2","If you go"],
      ["p","Stay near the Kamo River, rent nothing, and leave a full afternoon with no destination. Kyoto fills empty time better than almost anywhere I've been."]
    ]
  },
  {
    slug: "lisbon-on-foot",
    title: "Why Lisbon Is Best on Foot",
    tag: "Portugal",
    date: "2026-05-28",
    location: "Lisbon, Portugal",
    seed: "lisbon",
    excerpt: "Hills, tiles, and the tram that everyone photographs — plus the views nobody mentions.",
    likes: 274, views: 7100,
    body: [
      ["lead","Lisbon is a city built on hills and tiled in light. The famous tram is lovely — but the city only really opens up when you climb it yourself."],
      ["p","Every wrong turn here ends at a viewpoint. The miradouros are scattered across the hills like rewards for getting lost, and the walk between them is half the pleasure: laundry strung overhead, the smell of grilled sardines, a fado drifting from a doorway."],
      ["quote","Take the stairs. The view is the whole point, and you earn it twice."],
      ["p","I walked until my legs gave out, then sat with a custard tart and watched the river turn gold. There are faster ways to see Lisbon. There is no better one."]
    ]
  },
  {
    slug: "marrakech-morning",
    title: "A Slow Morning in Marrakech",
    tag: "Morocco",
    date: "2026-04-09",
    location: "Marrakech, Morocco",
    seed: "marrakech",
    excerpt: "Mint tea, the call of the souk, and learning to haggle without losing the smile.",
    likes: 198, views: 5800,
    body: [
      ["lead","The medina is loud by mid-morning. So I learned to wake before it did."],
      ["p","At six the souks belong to cats and shopkeepers sweeping their thresholds. Mint tea appears before you ask. The light comes in low and copper, and for an hour the whole maze feels like a secret you've been let in on."],
      ["quote","Haggle with a smile, drink the tea slowly, and never be in a hurry to leave."],
      ["p","By the time the crowds arrived I'd already had my morning — a rooftop, a glass of tea, and the call to prayer rolling across the rooftops. Marrakech gives its best to early risers."]
    ]
  },
  {
    slug: "patagonia-pack-light",
    title: "Patagonia Taught Me to Pack Light",
    tag: "Argentina",
    date: "2026-03-03",
    location: "Patagonia, Argentina",
    seed: "patagonia",
    excerpt: "What the wind takes, the mountains give back. Notes from the end of the world.",
    likes: 421, views: 11200,
    body: [
      ["lead","I brought too much of everything except patience. The wind at the end of the world has a way of sorting your priorities."],
      ["p","Out here the weather changes four times an hour and the trails ask more of you than the guidebooks admit. You stop carrying what you don't need very quickly — in your pack and otherwise."],
      ["quote","What the wind takes, the mountains give back."],
      ["p","On the last day the clouds finally lifted off the peaks, and I understood why people come all this way for a view that might not show up. It did. It was worth every gram I'd hauled and every one I'd left behind."]
    ]
  },
  {
    slug: "48-hours-hanoi",
    title: "48 Hours in Hanoi",
    tag: "Vietnam",
    date: "2026-02-18",
    location: "Hanoi, Vietnam",
    seed: "hanoi",
    excerpt: "Coffee thick as honey, motorbike rivers, and the best two dollars I ever spent on dinner.",
    likes: 509, views: 13700,
    body: [
      ["lead","Two days is not enough for Hanoi. It is, however, exactly enough to fall for it."],
      ["p","The Old Quarter moves like a river of motorbikes, and the trick is to wade in slowly and trust it to part around you. Between crossings there is coffee thick as honey, broth that takes all night to make, and plastic stools that somehow hold the best meals of the trip."],
      ["quote","The best two dollars I ever spent was dinner on a street corner in Hanoi."],
      ["p","I left with a notebook full of addresses I'll never find again and a standing plan to come back hungry."]
    ]
  },
  {
    slug: "quiet-santorini",
    title: "The Quiet Side of Santorini",
    tag: "Greece",
    date: "2026-01-21",
    location: "Santorini, Greece",
    seed: "santorini",
    excerpt: "Skip the sunset crowds — the island's real magic is at 7am with a coffee and no one around.",
    likes: 187, views: 4900,
    body: [
      ["lead","Everyone photographs the same sunset. The island's real magic happens hours earlier, when no one's awake to see it."],
      ["p","Skip the evening crush in Oia and set an alarm instead. At seven the caldera is silver and still, the cafés are empty, and the blue domes belong only to you and a few cats picking their way along the walls."],
      ["quote","Same island, completely different place — just shift your clock by twelve hours."],
      ["p","By the time the tour buses arrived I was already on my second coffee, perfectly content to let everyone else fight over the famous view."]
    ]
  }
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
