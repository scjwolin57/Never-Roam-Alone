# Never Roam Alone — Project Summary
*Last updated: July 2, 2026*

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
Four radio-button-switched tools (destination data shared via `destinations.js`):

1. **Favorite Travel Activities** — activity dropdown → city recommendations
2. **Travel Budget** — 5 budget tiers filtered/sorted against real estimated daily costs (budget / mid / luxury tiers from `destinations.js`), with "≈ $X/day" labels and an estimates disclaimer
3. **Mode of Travel** — Plane / Train / Boat / Bus / Car / Any (adaptive UI per mode)
   - **Plane**: origin airport autocomplete (OpenFlights dataset), departure date calendar, round-trip checkbox + return date calendar, stops radio buttons → live **Google Travel Explore** flight results via SerpApi (proxied through Netlify function)
   - **Train**: city search → auto-populates major train stations (30-city dictionary)
   - Other modes: city origin field + date picker
   - **Reachable-destination results** *(new, July 2)*: after picking an origin for Train / Bus / Car, the tool shows only destinations on the same landmass (region data in `destinations.js` — e.g. no train from New York to Tokyo; the Darién Gap separates North and South America; Japan/Korea are land-isolated). Island origins and unknown countries get friendly "try Plane or Boat" messages. **Boat** shows cities with a major cruise/ferry port (with "port is ~1 hr away" notes for Rome, Seoul, Bangkok, London). **Any** shows every destination, most-visited first.
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

### `posts.js` — Single Source of Truth for Blog Posts *(new, July 2)*
- All 6 blog posts (title, date, excerpt, likes/views, full article body) live in one file with plain-English "how to add a post" instructions at the top
- `index.html` (latest 3 tiles), `blog.html` (full grid + search/sort), and `post.html` (article page) all read from it — add a post once, it appears everywhere
- Includes shared helpers: `byNewest()`, `bySlug()`, and date formatters

### `destinations.js` — Single Source of Truth for Destinations *(new, July 2)*
- The 27-city dataset (name, country, coordinates, visitors, tagline) shared by every Destination Finder tool
- **Estimated daily costs** per travel style (budget / mid / luxury, compiled July 2026 from published traveler averages) — powers the Travel Budget tool
- **Region labels** (eurasia, japan, korea, n-america, s-america, africa, oceania) — powers overland reachability in the Mode of Travel tool
- **Country → region lookup** (`NRA_COUNTRY_REGION`, ~150 countries incl. "island" for places with no land link) + `NRA_REGION_OF()` helper
- **Sea-port city list** (`NRA_SEA_CITIES`) + out-of-town port notes (`NRA_PORT_NOTE`) — powers Boat mode

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

## Recently Completed (July 2, 2026)
- [x] **"Preview route" button** on every result card in choose.html (Activities, Budget, and Mode of Travel tools), next to Explore. Opens Google Maps directions in a new tab — origin- and mode-aware on the Mode of Travel tool (train/bus → transit, car → driving); other tools pass just the destination so Maps uses the visitor's location. Built as one `routeUrl()` helper with a comment marking where to swap in the future booking page.
- [x] Moved blog posts into `posts.js` and wired index / blog / post pages to it
- [x] Moved destination data into `destinations.js` with estimated daily costs and region labels
- [x] Rebuilt the Travel Budget tool on real cost estimates
- [x] Mode of Travel: region-based reachable-destination results for Train / Bus / Car, sea-port results for Boat, everything for Any — verified in a headless browser (London by train → 16 same-landmass cities; Seoul by train → friendly "no overland routes" message)

## Pending / Next Steps

### Immediate
- [ ] **Verify Unsplash is working on Netlify** — Check that `UNSPLASH_ACCESS_KEY` is set with scope "All scopes" in Netlify env vars, redeploy if needed

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

---

## Recently Completed (July 7, 2026) — Trip Planner
- [x] **`itinerary.html` (new)** — Past & Upcoming trip lists (`?type=past` / `?type=upcoming`, toggle in the hero). Search bar + plus button; autocomplete suggests the 101 featured cities (marked "Guide", tidy capitalization, link to their city page) and coming-soon cities from `upcoming-cities.js` (marked "No guide yet"); anything else can be added as free text. Duplicate guard per list. Saves to Supabase (`itinerary_items` table) when signed in, localStorage (`nra_itinerary_v1`) otherwise.
- [x] **"Request city guide" button** on itinerary items without a guide → POSTs to new Netlify function `request-guide.js`, which emails the site owner via Resend (`GUIDE_REQUEST_EMAIL` env var). Sent requests are remembered in localStorage (`nra_guide_requests_v1`) so the button shows "Guide requested ✓".
- [x] **profile.html** — "My trips" section below the profile form with Upcoming/Past trip buttons linking to itinerary.html.
- [x] **`itinerary-setup.sql` (new)** — run once in Supabase SQL Editor: creates `itinerary_items` with owner-only row-level security.
- [ ] TODO to go live: set `GUIDE_REQUEST_EMAIL` in Netlify env vars (scope "All scopes") + run `itinerary-setup.sql` in Supabase.

## Recently Completed (July 7, 2026) — Master City List + Visitor Score
- [x] **`world-cities.js` (new)** — master database of **6,218 cities**: every city worldwide with population ≥100k, every national capital, every city ≥20k with its own commercial airport (IATA + scheduled service, city-name match or ≤10 km), plus tourism-index cities. Compact array format with `NRA_WC_GET(i)` helper and a country-name lookup. NOT yet wired into any page (Jeff wants to refine first).
- [x] **Visitor Score (0.0–1.0)** on every city: 40% aviation hub (OpenTravelData flight-traffic PageRank of the busiest airport serving the city, log-scaled), 40% tourism indexes (1.0 if on Euromonitor Top 100 — the site's 101 featured — or Mastercard GDCI Top 20 2019: adds Palma de Mallorca + Denpasar/Bali), 20% OSM POI density — **POI part pending**: OpenStreetMap's servers are blocked in Claude's sandbox, so scores currently blend 50/50 aviation/index.
- [x] **`poi-density.mjs` (new)** — run `node poi-density.mjs` in the project folder on the Mac (needs internet, ~1–2 hrs, resumes if interrupted) to count hotels/hostels/attractions per city via Overpass and recompute all scores at the full 40/40/20. Then ask Claude to refresh the spreadsheet.
- [x] **`world-cities-master.xlsx` / `.csv` (new)** — the same list for review: sortable columns incl. qualification reason, airports, score components; Visitor Score is a live Excel formula with editable weights on the About sheet.
- [x] **`world-cities-data.json` (new)** — full data (source of truth for regenerating the other files).
- Sources: GeoNames (cities/populations/capitals), OurAirports (airports, July 2026), OpenTravelData (traffic ranks, July 2026), Mastercard GDCI 2019 report.
