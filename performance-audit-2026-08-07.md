# Site Speed Audit — August 7, 2026

Swept every page for load-speed problems. Three fixes are done; the bigger opportunities need your go-ahead.

---

## What was slowing the site down

The site's photos and code files were being re-downloaded on every visit, four pages showed a blank screen until big map/calendar libraries finished downloading, and a couple hundred photos were much larger than they need to be for how they're displayed.

The good news: image lazy-loading (only loading photos as you scroll to them) was already in place site-wide, and the fonts are already self-hosted and optimized. Netlify also compresses everything it sends automatically. Those bases were covered.

---

## Fixed today (safe changes, ready to push)

**1. Pages now draw before the heavy libraries download.**
On the homepage, city pages, Destination Finder, and itinerary page, the map engine (~800 KB) and calendar picker sat at the very top of the page, so browsers showed *nothing* until they finished downloading. They now load at the bottom of the page instead — same order, same behavior, but the page paints first. Verified with the project's syntax checker (zero errors) and confirmed every script is still present and in the same relative order.

**2. Returning visitors stop re-downloading everything.** (`netlify.toml`)
Browsers are now told to keep photos for 7 days and fonts for a year instead of re-checking them every visit. Code files are deliberately *not* cached this way, so your updates still reach everyone immediately after each deploy. One trade-off to know: if you ever replace a photo using the *same filename*, visitors could see the old one for up to a week.

**3. Compressed 132 oversized photos — 27 MB saved.**
The biggest offenders were city hero photos of several MB each; they're now web-sized (max 1600 px, near-identical quality). Another 105 photos over 500 KB were checked and left alone — they're already properly sized and compressed, and squeezing further would visibly hurt quality. Originals are backed up in `_image-backups-2026-08-07/` (git-ignored, ~125 MB — delete the folder whenever you're satisfied).

**To go live:** git push + Netlify redeploy (the usual — sandbox can't push).

---

## Bigger wins — approved and DONE (same day)

**1. City guide page no longer carries all 900 cities' data up front.**
The landmark, landmark-photo, landmark-coordinates and day-trip files (~3.9 MB) now load only when the visitor scrolls near the Landmarks section — the section shows a brief "Loading…" note, then fills in and the pin map starts. The routes file (1.3 MB) loads only when a train/bus/ferry "More info" modal is opened (prefetched on hover), exactly like the food modal already worked. The data files themselves are untouched, so `add_city.py` and all regeneration tooling work exactly as before. **The city page's up-front payload dropped ~5.2 MB (roughly half).**

**2. Itinerary page lightened.**
`city-routes.js` and `world-cities.js` (1.8 MB combined) now download in parallel without blocking the page; both are only read at interaction time (autocomplete keystrokes / "Suggest next stop").

**3. Homepage globe now starts when scrolled into view** (immediately if already visible) instead of at page load.

**4. Fraunces + Work Sans self-hosted.**
All 27 font files downloaded to `/fonts`, one local stylesheet (`fonts/site-fonts.css`), and every Google Fonts link on all 22 pages replaced. This also closes the known GDPR issue (visitor IPs no longer sent to Google). The new font files are untracked — remember to `git add fonts/`.

**Verified in a real headless browser:** Paris page renders, landmarks (10 cards + pin map) and day trips appear on scroll, train modal lazy-loads real Eurostar routes, tiny-city fallback works (Funafuti), itinerary autocomplete finds Zürich from the deferred 6,218-city list, homepage globe initializes on scroll with blog tiles intact, fonts serve locally (HTTP 200, Fraunces applied), Destination Finder renders — zero page errors anywhere, and the project's syntax checker passes on every edited page.

**To go live:** `git add fonts/` + git push + Netlify redeploy.
