# Never Roam Alone — Project Summary
*Last updated: July 8, 2026*

---

## What We're Building

**Never Roam Alone** is a travel blog and trip-planning webapp — prototype stage, pure HTML/CSS/Vanilla JavaScript, hosted on Netlify. No framework. The goal is an inspiring travel destination with practical tools to help users plan real trips.

The project lives at:
`/Users/jeffreywolinsky/AI Projects/never-roam-alone/`

**Live at:** https://neverroamalone.com (custom domain, launched July 5) — Netlify build `jolly-manatee-50d180.netlify.app`. Backend is **Supabase** (accounts, forum, itineraries, mailing list, blog CMS) with **Resend** for transactional email. As of July 8 the site covers **101 featured city guides** (plus 145 "coming soon" cities on the map), a real accounts + community system, a trip planner, a mailing list, public profiles, and an admin blog editor.

> **Note:** Sections below labeled *(new)* / *(July 2)* describe the state through early July. The consolidated **"Milestones — July 3–8, 2026"** section near the end is the most current record and supersedes the older "Pending / Next Steps" list where they conflict.

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
- Grid of all city cards (**now 101 cities** — see the Top-100 expansion in Milestones), each linking to `city.html?city=Name&from=guides`
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
- Byline uses `pyramids-web.jpg` as avatar (or a tagged trusted-traveler byline linking to their public profile)
- URL param: `?post=slug`
- Renders editor-authored block types: framed photos (`["img", …]`) and section breaks (`["br"]`)

### Pages added July 3–8 *(full detail in Milestones)*
- **`profile.html`** — private account editor: profile fields, "My trips," mailing-list & public-profile toggles, and a "Danger Zone" delete-account flow.
- **`itinerary.html`** — Past & Upcoming trip lists with autocomplete + "request a city guide" button (Trip Planner).
- **`roamer.html?id=<uuid>`** — a user's opt-in public profile page (badge, bio, socials, their articles).
- **`blog-editor.html`** / **`blog-admin.html`** *(admin only, not in the menu)* — build/manage database-backed articles.
- **`contact.html`, `feedback.html`, `privacy.html`, `terms.html`** — support & legal pages (privacy/terms rewritten for the July 5 compliance round).

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
| `image.js` | `/.netlify/functions/image?q=city+landmark` | Unsplash photo(s) — now supports multiple results for the blog editor | `UNSPLASH_ACCESS_KEY` |
| `translate.js` | `/.netlify/functions/translate` | MyMemory translation | Optional `MYMEMORY_EMAIL` |
| `notify.js` | `/.netlify/functions/notify` | Forum reply-notification emails | `RESEND_API_KEY` |
| `delete-account.js` | `/.netlify/functions/delete-account` | GDPR account erasure (verifies token, anonymizes posts, deletes user) | Supabase service-role key |
| `request-guide.js` | `/.netlify/functions/request-guide` | Emails Jeff when a user requests a city guide | `RESEND_API_KEY`, `GUIDE_REQUEST_EMAIL` |
| `subscribe.js` | `/.netlify/functions/subscribe` | Mailing-list confirmation email (placeholder template) | `RESEND_API_KEY`, opt. `SITE_URL` |

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

### New Shared Files (added July 3–8 — details in Milestones)
- `auth.js` — Supabase client + accounts, profiles, sign-in modal, nav sign-in widget, mailing-list & public-profile logic (loaded on every page)
- `upcoming-cities.js` — the 145 "coming soon" cities for the map
- `mailing-list.js` — public email-signup form component
- `blog-remote.js` — merges published Supabase blog posts into `window.NRA_POSTS`
- `world-cities.js` / `world-cities-data.json` / `world-cities-master.xlsx` / `.csv` — 6,218-city master list + Visitor Score (not yet wired into pages)
- `poi-density.mjs` — one-time script to finish the Visitor Score POI component on the Mac
- SQL setup files (run once in Supabase): `supabase-setup.sql`, `profile-fields.sql`, `itinerary-setup.sql`, `mailing-list-setup.sql`, `public-profile-setup.sql`, `blog-setup.sql`

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

---

## Milestones — July 3–8, 2026
*The big rounds of work since the July 2 checkpoint above. These are the most current record.*

### Accounts, Community Backend & Emails (crit 14–18) — ✅ live end-to-end
- **`auth.js`** is now the backbone of the whole site: it owns the single Supabase client (loaded on every page) and handles sign-up / sign-in (email + Google), profile fetch/save, the sign-in modal, and now the mailing-list and public-profile logic too.
  - ⚠️ **Hard-won bug (live outage):** Supabase-JS deadlocks if you subscribe `onAuthStateChange` *before* the first `getSession()`, or `await` a Supabase call inside that callback. The safe pattern (in `auth.js`): `getSession` + `fetchProfile` first → then subscribe with a `setTimeout(…, 0)`-deferred body; plus an `arrivedFromRecovery` URL marker and a 6-second ready-timer as a safety net.
- **`askaroamer.html`** is no longer a localStorage prototype — questions and replies persist in **Supabase** across sessions/devices. Includes a "notify me of replies" checkbox by the Post button.
- **Reply emails** work via **Resend** (SMTP configured in Supabase) — confirmed delivering July 5. `netlify/functions/notify.js` sends them.
- Regression-tested: 25 auth checks, 9 forum checks, profile checks — all passing.

### Compliance / Privacy / Security Round (July 5) — before launch
Audited every page for worldwide privacy/cookie/security readiness. Finding: **no analytics, ads, or tracking anywhere → no cookie-consent banner legally required** (Jeff agreed to keep it that way; if tracking/ads are ever added, a consent banner becomes required — cookieless options noted: Netlify Analytics / Plausible). Shipped:
- **`privacy.html`** & **`terms.html`** rewritten (dated 2026-07-05): full data inventory (accounts, public forum posts, reply emails, complete localStorage list incl. the Supabase auth token), full third-party list, self-serve deletion, retention, 16+ age minimum, community-content rules.
- **`netlify.toml`** — added site-wide security headers (HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy) **and a Content-Security-Policy allowlist**. ⚠️ **Maintenance rule:** any new external script/image/API added to the site must also be added to the CSP allowlist in `netlify.toml`, or the browser silently blocks it.
- **Google Fonts → self-hosted** (`fonts/amatic-sc.css`) on all pages, to avoid the GDPR IP-leak issue. ⚠️ Manual step: drop `amatic-sc-400.woff2` + `amatic-sc-700.woff2` into `/fonts` (until then pages fall back to Georgia — nothing breaks).
- **Delete-account (GDPR erasure):** new `netlify/functions/delete-account.js` verifies the caller's own token, anonymizes their forum posts (name → "Anonymous Roamer") *before* deleting, then removes the account. profile.html got a two-step-confirm "Danger Zone."

### Custom Domain Launched (July 5)
**neverroamalone.com** purchased via Cloudflare, connected to Netlify (flattened-CNAME approach, both records set to "DNS only" / grey-cloud so Netlify's SSL works). SSL issued, confirmed live. Decision: **staying on Netlify** (not Vercel/Cloudflare Pages) — the API-key-hiding Netlify Functions pattern extends cleanly to the planned affiliate links; recommend upgrading to Netlify Pro (~$19/mo) only once function/bandwidth volume grows.

### Top-100 Cities Expansion (July 5–6) — 27 → **101 city guides**
Added the 74 most-visited cities (from Euromonitor's 2024 top-100 index) that weren't already on the site, across `index.html` (map), `cities.html` (directory), and `city.html` (full guides). The new pages **match or exceed** the depth of the original 27. Data was compiled by five passes of parallel research agents, covering: coordinates/currency/languages/weather/costs/taglines; airports (with IATA) + train/bus/ferry + car rules; 5 real neighborhoods each with real descriptions; drinks/alcohol rules; taxi/rideshare/transit costs; card-acceptance %, religion mix, avg stay, walkability, safety, rainfall; and **real named lodging recommendations** (hotels/hostels per price tier) for all 101. Bubbles are sized by visitor estimates (63 of the 74 are labeled "~ estimated"; the rest are reported figures). Verified each round in headless Chromium (JS parses, 101 cities per file, all cards populate, zero console errors).

### Site-wide Nav-Bar Sign-In Widget (July 7)
The account widget now appears in the top nav bar on **every** page (previously only Ask A Roamer + Profile). `auth.js` `renderNavWidget()` draws a small round person-icon when signed out, or an initials circle linking to profile.html when signed in; `nav.js` reserves the slot. ⚠️ Testing caught real horizontal-scroll overflow on narrow phones from a text "Sign in" pill — fixed by using a fixed 34×34 icon instead. If this area is touched again, re-run the 360px overflow check.

### Connectivity Banner on City Pages (July 7)
`city.html` gained a full-width **Connectivity** banner above the cost cards: mobile & Wi-Fi speeds, tourist-SIM price per GB (converts with the currency dropdown), free-public-Wi-Fi rating + note, airport-Wi-Fi availability + limits, and a mobile-operators chip row. Per-city data in `CITY_NET` for all 101; per-city eSIM link slots (`CITY_ESIM`) are stubbed blank — ⚠️ Jeff pastes real eSIM URLs later (blank shows a "coming soon" tooltip). All labels/notes added to the i18n dictionary.

### Purple "Coming Soon" Map Bubbles (July 7)
New `upcoming-cities.js` = **145 cities**, one per UN member country not already among the 101 (tourist-hub picks where sensible, e.g. Croatia → Dubrovnik). Rendered on the home map as small purple bubbles with an info popup ("City guide coming soon", no Explore button). When a real guide is built later, move that city out of `NRA_UPCOMING` and into the CITIES arrays.

### Email Mailing List (July 7)
Opt-in email capture: a checkbox on the create-account popup **and** the profile page, plus a public signup form (`mailing-list.js`, email-only) embedded on index/blog/choose/askaroamer. Stored in a new Supabase `mailing_list` table (private — anon can insert but not read back). Sends a **placeholder** confirmation email via `netlify/functions/subscribe.js` (Jeff builds the real template later).

### Public Profile Pages + Forum "View Profile" (July 7)
Opt-in public profiles (off by default; a toggle on profile.html turns it on). New **`roamer.html?id=<uuid>`** shows a user's public card — name, "Trusted traveler" badge, bio, travel chips, social links, and their tagged articles. In the forum, avatars of signed-in public posters become clickable links to their roamer page. Backed by a new `public_profiles` Supabase view (safe columns only — no email/prefs).

---

## Pending / Next Steps

### ⚠️ Manual go-live steps (Jeff)
Several rounds are committed to the Mac but need Jeff to finish deployment:
- [ ] **git push + redeploy** on Netlify to publish all the committed July 3–8 work.
- [ ] **Run these SQL files once** in the Supabase SQL Editor: `itinerary-setup.sql`, `mailing-list-setup.sql`, `public-profile-setup.sql`, `blog-setup.sql` (and confirm the earlier `supabase-setup.sql` / `profile-fields.sql` are applied).
- [ ] **Set Netlify env var** `GUIDE_REQUEST_EMAIL` (scope "All scopes") for city-guide request emails; optional `SITE_URL`.
- [ ] **Add the two Amatic SC `.woff2` font files** to `/fonts` (site falls back to Georgia until then).
- [ ] **Switch contact email** in privacy.html / terms.html from `jcwolinsky@gmail.com` to an `@neverroamalone.com` address (TODO comments mark the spots).
- [ ] **Verify neverroamalone.com in Resend** as a sender domain + update the from-field, so reply / guide / mailing emails reach anyone (Resend's free `onboarding@resend.dev` sender currently only delivers to Jeff's own inbox).
- [ ] **Run `node poi-density.mjs`** on the Mac (needs internet, ~1–2 hrs) to finish the Visitor Score's POI component, then ask Claude to refresh the world-cities spreadsheet.

### Features still on the roadmap (from Objectives_Overview.md)
- [ ] **Cafes, Restaurants, Bars, Clubs** — venue discovery per destination
- [ ] **Entertainment Calendar** — events with ad slots
- [ ] **Host Listings with Ratings** — user-posted accommodation with ratings
- [ ] Wire the 6,218-city **master list** (`world-cities.js`) into the site once refined
- [ ] Per-city **eSIM affiliate links** in `CITY_ESIM`
> Note: "Lodging at price points," "Destination Planner / itinerary builder," and "Ask a Local backend" from the old roadmap are now **done** (lodging recommendations on city pages, the Trip Planner, and the Supabase-backed forum).

### Polish / QA
- [ ] Live click-test after deploy: sign-in/out, forum posting, itinerary save, mailing-list signup, delete-account — the sandbox can't reach Supabase, so these need real-site verification.
- [ ] Test all 5 languages end-to-end on the deployed site (several newer strings — purple bubbles, roamer.html — aren't translated yet in ES/FR/IT/ZH).
- [ ] Mobile responsiveness pass (esp. the 3-column flight grid).
- [ ] Optionally replace Picsum placeholder photos in `cities.html` with real Unsplash city photos.

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
- ✅ `RESEND_API_KEY` — Netlify env var only (reply / guide-request / mailing emails)
- ✅ `GUIDE_REQUEST_EMAIL`, `SITE_URL` — Netlify env vars (see manual go-live steps)
- ✅ Supabase URL + anon key are public by design; all writes protected by **Row-Level Security** so users only touch their own rows. The Supabase **service-role key** lives only in the `delete-account.js` Netlify function, never in the browser.
- ✅ Content-Security-Policy + full security headers in `netlify.toml`
- ✅ Self-hosted fonts (no third-party font CDN IP leak)
- ✅ No API keys in any `.html`, `.js`, or committed files
- ✅ `.env.example` documents required vars without real values
- ⚠️ Correct Supabase Project URL everywhere: `https://oferixjdgwwjpstowqis.supabase.co` (no trailing slash — a wrong paste here has broken sign-in and emails before)

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

## Recently Completed (July 7, 2026) — Blog Editor + Post Management
- [x] **`blog-editor.html` (new, admin only)** — build an article from insert elements: Header, Paragraph, Lead paragraph, Pull-quote, Line break (section divider), and Photo. Photos come from an image picker with two tabs: Unsplash search (via the existing image function, now supporting multiple results) or upload-your-own (stored in Supabase's `blog-images` bucket). Each piece can be reordered (↑ ↓) or removed. Includes cover-photo picker, auto-generated slug, live preview, Save draft / Publish, and an optional trusted-traveler byline.
- [x] **`blog-admin.html` (new, admin only)** — lists every editor-written article (drafts included) with View / Edit / Publish–Unpublish / Delete (two-step confirm). The six built-in posts.js articles are listed too with an **Edit a copy** button — publishing the copy replaces the original everywhere (same slug wins).
- [x] **`blog-remote.js` (new)** — fetches published database articles and merges them into `window.NRA_POSTS`, so they appear on the home page, blog page, and post pages automatically. If Supabase is unreachable, posts.js articles still show.
- [x] **`blog-setup.sql` (new)** — run once in Supabase SQL Editor: creates the `blog_admins` list (starts with Jeff's email), the `blog_posts` table (public read of published, admin-only writes), and the public `blog-images` storage bucket.
- [x] **post.html** — now renders two new block types written by the editor: `["img", {url, caption, credit}]` (framed photo with caption + photographer credit) and `["br"]` (decorative section break). Hero/tile photos use the chosen cover when present.
- [x] Access: only accounts in `blog_admins` can open the editor/manage pages (checked via an `is_blog_admin()` database function). Neither page is in the site menu — bookmark **blog-admin.html**.
- [ ] TODO to go live: run `blog-setup.sql` in Supabase, then git push + redeploy (netlify.toml CSP now allows Supabase-hosted images).
