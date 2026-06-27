# Never Roam Alone — Travel Blog

A travel blog featuring an interactive world map of city traveler counts, an about section, and a picture-tile blog.

## Recommended production stack
- **Astro** — fast static site generator (handles the photo-heavy pages well).
- **MapLibre GL** — free, open-source interactive map engine (no API key or billing). Powers the zoomable globe and city bubbles.
- **Sanity (free tier)** — visual CMS dashboard for writing posts and uploading photos. No code or markdown required to publish.
- **Netlify (free)** — hosting + automatic rebuilds when a new post is published.

## This folder
- `index.html` — **self-contained working prototype** of the landing page. Double-click to open it in any browser (needs an internet connection for the map tiles and placeholder images). This validates the look, the interactive map, the about layout, and the blog tile grid before we build the full Astro + CMS version.

## City map data
Bubble sizes use approximate annual international visitor figures derived from the Euromonitor "Top 100 City Destinations" and Mastercard Global Destination Cities Index rankings. These are placeholder starter values in `index.html` (the `CITIES` array) and will be replaced with a verified dataset.

## Blog workflow (planned)
Write posts in the Sanity dashboard — title, rich text, cover photo, tags — and hit Publish. The site rebuilds automatically and the new post appears as a tile on the Blog section. No files or git involved.

## Live destination search (SerpApi Google Travel Explore via Netlify)
The "Destination Finder Tools" page can show real destination ideas with live prices on the Plane tool, powered by SerpApi's **Google Travel Explore** engine. You only pick an origin airport, a date, and a stops preference — Explore returns suggested destinations (price, duration, number of stops) from that origin. Because the SerpApi key is a paid secret, it is **never** placed in the browser — a small Netlify serverless function (`netlify/functions/flights.js`) holds it and proxies the request.

How the pieces fit:
- `netlify/functions/flights.js` — reads `SERPAPI_KEY` from the environment, calls SerpApi's `google_travel_explore` engine, returns just the destinations.
- `netlify.toml` — tells Netlify to publish this folder and load the function.
- `choose.html` — the Plane tool calls `/.netlify/functions/flights`; if it's unreachable (e.g. opened as a local file), it automatically falls back to sample flights.

### Deploy + connect your key
1. Push this folder to a GitHub repo (or drag-and-drop deploy in Netlify).
2. In Netlify: **Add new site → Import** the repo. Build settings can stay default (publish dir `.`).
3. In **Site settings → Environment variables**, add `SERPAPI_KEY` = your regenerated SerpApi key. (Get it at https://serpapi.com/manage-api-key)
4. Deploy. On the Plane tool, choose an origin airport, a date, and a stops preference — real destination ideas with live prices appear. No key is ever exposed to visitors.

Note: SerpApi is a paid service with usage limits; each search consumes a credit. The stops preference maps to SerpApi's `stops` parameter (direct → nonstop only, one stop → 1 stop or fewer, multiple → any).

## City landmark photos (Unsplash via Netlify)
Each destination card shows a city-landmark photo from **Unsplash**, fetched through a second serverless function (`netlify/functions/image.js`) so the Unsplash key also stays server-side.

Setup:
1. Create a free Unsplash developer app at https://unsplash.com/oauth/applications and copy its **Access Key**.
2. In Netlify → **Site settings → Environment variables**, add `UNSPLASH_ACCESS_KEY` = that Access Key.
3. Redeploy.

Notes: results are cached (client-side per city, plus a 1-day cache header) to respect Unsplash's rate limit (50 requests/hour on the free "Demo" tier; 5,000/hour once your app is approved for Production). When the function is unreachable (e.g. local file), cards fall back to a plain dark panel. Unsplash's API guidelines ask for photographer attribution — each card shows a visible "Photo: <name> / Unsplash" credit with links.

## Languages (interface hand-translated, articles via DeepL)
A language dropdown in the nav (English, Español, Français, Italiano, 中文) is injected by `i18n.js` on every page. Two layers:
- **Interface** (menus, buttons, headings, the Destination Finder labels & options) is hand-translated in `i18n.js` (the `DICT` object) and switches instantly with no network — works offline. Add strings by adding entries to `DICT`.
- **Long-form content** (blog articles, the city intro — anything marked `class="i18n-ml"`) is translated on demand through `netlify/functions/translate.js`, which calls **MyMemory**. Results are cached per language.

The chosen language persists across pages (localStorage).

### Setup (for the long-form translation)
Nothing required — **MyMemory needs no API key, no signup, and no credit card.** It works as soon as the site is deployed.

Optional: MyMemory's free tier is 5,000 characters/day per IP. To raise it to 50,000/day, add a `MYMEMORY_EMAIL` environment variable in Netlify with any contact email. Leave it unset to use the anonymous tier.

If the translate function is unreachable (e.g. opened as a local file), long-form text simply stays in English. Note that MyMemory's quality is more variable than a premium engine; for a polished launch you can later swap in a paid provider.

**Switching providers later:** only `netlify/functions/translate.js` changes (the `translateChunk()` call + the `LANG_MAP` codes). The page-side contract (`POST {q:[...], to}` → `{translations:[...]}`) stays identical, so nothing else needs touching. Azure Translator (2M chars/month free) or Google/DeepL are drop-in alternatives if volume or quality demands grow.
