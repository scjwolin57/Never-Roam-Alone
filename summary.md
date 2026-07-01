# Never Roam Alone — Project Summary
*Last updated: June 30, 2026*

---

## What We're Building

**Never Roam Alone** is a travel blog and trip-planning webapp — prototype stage, pure HTML/CSS/Vanilla JavaScript, hosted on Netlify. No framework. The goal is an inspiring travel destination with practical tools to help users plan real trips.

The project lives at:
`/Users/jeffreywolinsky/AI Projects/never-roam-alone/`

---

## Pages Built

### `index.html` — Landing Page
- Sticky nav bar: **Never Roam Alone** logo (SVG, mountain/travelers icon in `#185e3f`) + logo text in **Amatic SC** font + language dropdown
- **MapLibre GL** interactive 3-D globe with city bubbles (annual visitor counts); each bubble has an **Explore** button linking to `city.html?city=CityName`
- About section with `pyramids-web.jpg` photo (converted from HEIC — a tricky 48-tile grid format, required custom tile stitching + 180° rotation fix)
- Blog tile grid (6 posts) linking to `post.html?post=slug`
- Language switcher (EN/ES/FR/IT/ZH) wired via `i18n.js`

### `blog.html` — Blog Listing Page *(new)*
- Full blog post directory — all posts displayed as a tile grid
- Search bar (filters articles live as you type) with clear button
- Sort dropdown: Newest → Oldest / Oldest → Newest / Most Liked / Most Viewed
- "No results" state shown when search returns nothing
- Footer links to privacy policy and terms of service

### `cities.html` — City Guides Directory *(new)*
- Grid of all city cards (27 cities), each linking to `city.html?city=Name&from=guides`
- Live search/filter bar — filters by city name or country as you type
- Visitor count chip on each card (e.g. "26.7M visitors/yr")
- Placeholder photos from Picsum (keyed by city slug for consistency)
- Count badge showing how many cities match the current filter

### `choose.html` — Destination Finder Tools
Four radio-button-switched tools:

1. **Favorite Travel Activities** — activity dropdown → city recommendations
2. **Travel Budget** — 5 budget tiers with curated destination suggestions
3. **Mode of Travel** — Plane / Train / Boat / Bus / Car / Any (adaptive UI per mode)
   - **Plane**: origin airport autocomplete (OpenFlights dataset), departure date calendar, round-trip checkbox + return date calendar, stops radio buttons → live **Google Travel Explore** flight results via SerpApi (proxied through Netlify function)
   - **Train**: city search → auto-populates major train stations (30-city dictionary)
   - Other modes: city origin field + date picker
   - Flight results: sorted cheapest-first, 6-card cap + "Show more" button, 3-column grid, **Unsplash** landmark photos (proxied through Netlify function with photographer credit)
4. **Do I Need A Visa?** — country dropdown using Passport Index dataset → visa requirement results

Form state persists across page reloads (`localStorage` key `nra_choose_state_v1`). Origin city field clears when mode of travel changes.

### `city.html` — Per-City Page *(significantly expanded)*
- Hero section: city name, tagline, annual visitor chip
- **Cost cards** — 4-up grid showing typical mid-range costs: hotel/night, restaurant meal, local transport, and a city-specific item; all in USD
- **Currency converter** — local currency with live conversion input; swap button reverses direction; compare-currency dropdown
- **Getting Around section** — airport details card (name, distance, drive time, car rental companies, taxi/rideshare/transit options with costs) + transport grid cards
- **Neighborhood guide** — curated neighborhoods per city with descriptions
- **Embassy finder** — dropdown of home countries → Google Maps link to nearest embassy
- **Stories tile grid** linking to `post.html`
- Long-form article section (`.i18n-ml`) auto-translated by MyMemory proxy
- "City not found" fallback page for unknown URL params
- URL param: `?city=Paris` (optional `&from=guides` to set back-nav context)

### `askaroamer.html` — Community Q&A Forum *(new)*
- Two-column layout: sidebar + main content area
- **Sidebar**: "Browse by city" — category list (General Travel + all cities A-Z); clicking a category filters the thread list
- **Ask a question form**: name (optional, defaults to "Anonymous Roamer"), city dropdown, question title (140 char max), details body (1200 char max)
- **Thread list**: displays questions with reply counts; supports search and sort (Newest first / Most replies / Unanswered)
- **Active category banner** shows the currently selected city/topic
- Questions and replies stored in `localStorage` for the prototype

### `post.html` — Blog Post Template
6 posts: `kyoto-backstreets`, `lisbon-on-foot`, `marrakech-morning`, `patagonia-pack-light`, `48-hours-hanoi`, `quiet-santorini`
- Article body (`.post.i18n-ml`) auto-translated
- Byline uses `pyramids-web.jpg` as avatar
- URL param: `?post=slug`

---

## Shared Infrastructure

### `nav.js` — Shared Navigation Script *(new)*
- Single source of truth for the site-wide menu — edit `NAV_ITEMS` here to change the menu on every page at once
- Current menu items: Home · About · Blog · City Guides · Destination Finder · Ask A Roamer
- Auto-highlights the active page link based on the current filename (`ACTIVE_BY_PAGE` map); `post.html` and `city.html` inherit the parent section's highlight
- **Mobile hamburger menu**: collapses to a ☰ button below 880px; morphs into an ✕ when open; drops down as a rounded panel; closes on link click, outside click, or Esc
- Integrates with `i18n.js` — calls `NRA_i18n.apply()` after injecting menu HTML so translations cover freshly added nav links
- Each page just needs `<nav class="links" data-site-nav></nav>` as a placeholder

### `i18n.js` — Language Switcher
- Supports EN / ES / FR / IT / ZH
- **Two-layer translation:**
  - **Interface strings** (nav, buttons, labels): hand-authored DICT with 90+ entries, applied via TreeWalker text-node walk. *Critical fix applied*: must use `NodeFilter.FILTER_ACCEPT` / `NodeFilter.FILTER_REJECT` (not `NodeFilter.ACCEPT` which is undefined — this was causing 0 nodes to be translated).
  - **Long-form article content** (`.i18n-ml` elements): calls `/.netlify/functions/translate` (MyMemory proxy, free, no credit card)
- Language choice persisted in `localStorage` key `nra_lang`
- MutationObserver (`observeDynamic()`) re-applies translations when new DOM nodes are added dynamically

### Netlify Serverless Functions (API Proxies)
All API keys live **only** in Netlify environment variables — never in browser code.

| Function | Path | Purpose | Key Required |
|----------|------|---------|-------------|
| `flights.js` | `/.netlify/functions/flights` (also `/api/flights`) | SerpApi Google Travel Explore | `SERPAPI_KEY` |
| `image.js` | `/.netlify/functions/image?q=city+landmark` | Unsplash random photo | `UNSPLASH_ACCESS_KEY` |
| `translate.js` | `/.netlify/functions/translate` | MyMemory translation | Optional `MYMEMORY_EMAIL` |

### `netlify.toml`
```toml
[build]
  publish = "."
  functions = "netlify/functions"
[build.environment]
  NODE_VERSION = "18"
[[redirects]]
  from = "/api/flights"
  to = "/.netlify/functions/flights"
  status = 200
```

### Static Assets
- `logo.svg` — Vector logo: circle with mountains, two hikers, winding path, color `#185e3f`
- `pyramids-web.jpg` — Converted from HEIC (custom tile-stitching pipeline); used in About section and as post byline avatar

---

## Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | None (vanilla HTML/CSS/JS) | Prototype speed, zero build step |
| Hosting | Netlify | Free tier, serverless functions for API proxies |
| Map | MapLibre GL | Free, no API key, WebGL globe |
| Flight search | SerpApi `google_travel_explore` | Rich data, round-trip support |
| Photos | Unsplash (proxied) | High quality, photographer attribution |
| Translation | MyMemory (proxied) | Free, no credit card, 5k chars/day anonymous / 50k with email |
| Airport data | OpenFlights dataset | Free, comprehensive, client-side autocomplete |
| Visa data | Passport Index CDN | Live data, no key needed |
| City placeholder photos | Picsum (keyed by city slug) | No API key, consistent image per city |
| Forum/Q&A storage | localStorage (prototype) | Zero backend needed for prototype stage |

---

## Bugs Fixed

1. **HEIC conversion** — 48-tile grid HEIC required custom Python: parse HEIF container → extract HEVC tiles → decode with ffmpeg → stitch with PIL → apply 180° `irot` rotation flag
2. **Language switcher not working** — `NodeFilter.ACCEPT` is undefined in browsers; must be `NodeFilter.FILTER_ACCEPT`. Fixed in `i18n.js`.
3. **DeepL requires credit card** — Removed DeepL entirely, switched to MyMemory. Contract unchanged (`POST {q:[], to} → {translations:[]}`), so no page code changed.
4. **Unsplash "UNSPLASH_ACCESS_KEY missing" on Netlify** — Likely scope issue: in Netlify → Site settings → Environment variables, the key must be scoped to **"All scopes"** (must include Functions), then redeploy.
5. **SerpApi key accidentally exposed in chat** — User immediately regenerated the key. Old key is dead. New key stored only in Netlify env vars, never in code.
6. **Cursor edits overwritten** — Established a "stage before edit" workflow: always pull the latest file from the Mac before making edits in this session, to avoid clobbering Cursor changes.

---

## Pending / Next Steps

### Immediate
- [ ] **Verify Unsplash is working on Netlify** — Check that `UNSPLASH_ACCESS_KEY` is set with scope "All scopes" in Netlify env vars, redeploy if needed
- [ ] **Sync index.html** — Confirm blog tiles link to `blog.html` and nav uses `nav.js` placeholder pattern

### Short-Term Features (from Objectives_Overview.md)
- [ ] **Lodging at price points** — accommodation search/filter tool
- [ ] **Travel Logistics** — guide to getting between cities (Seat61-style train info)
- [ ] **Destination Planner** — full trip itinerary builder
- [ ] **Cafes, Restaurants, Bars, Clubs** — venue discovery per destination
- [ ] **Entertainment Calendar** — events with ad slots
- [ ] **Ask a Local** — AI + human-curated Q&A (askaroamer.html is the prototype shell; needs backend)
- [ ] **Host Listings with Ratings** — user-posted accommodation with ratings

### Polish / QA
- [ ] Test all 5 languages end-to-end on deployed site
- [ ] Verify flight cards display Unsplash images correctly after Netlify fix
- [ ] Mobile responsiveness pass (especially the 3-column flight grid)
- [ ] Add `/api/image` and `/api/translate` friendly redirects to `netlify.toml` (parallel to `/api/flights`)
- [ ] Replace Picsum placeholder photos in `cities.html` with real Unsplash city photos (via `image.js` proxy)
- [ ] Wire `askaroamer.html` to a real backend (Supabase or similar) to persist questions/replies across sessions

---

## How to Deploy Changes

1. Edit files locally in Cursor (or here)
2. Push to your git remote (if connected) — or drag-and-drop files in Netlify UI
3. Netlify auto-builds and deploys (usually < 60 seconds)
4. To add/update API keys: Netlify → Site → Settings → Environment variables → set key, scope = "All scopes" → **Trigger redeploy**

---

## Security Checklist
- ✅ `SERPAPI_KEY` — Netlify env var only, never in browser
- ✅ `UNSPLASH_ACCESS_KEY` — Netlify env var only, proxied through `image.js`
- ✅ `MYMEMORY_EMAIL` — optional Netlify env var for higher rate limit
- ✅ No API keys in any `.html`, `.js`, or committed files
- ✅ `.env.example` documents required vars without real values
