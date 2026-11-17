# Suggested improvements: finished items

*Moved out of `suggested-improvements.md` on 2026-11-17 at Jeff's request, unchanged except that 0, 28 and 48 were struck that day after a check of the site. Grouped by the heading they were under.*

## ✅ Recently completed (July 2026, for reference)

- ~~Destination finder intelligence: one-way/return toggle, door-to-door flight times, train-vs-plane & long-ride alerts, honest ground-travel math (winding roads, en-route hotel nights), editable nights assumption, "Compare all ways to get there" expander, one-way rental fee note~~

- ~~Season/event bubbles on finder cards (weather + festivals/peak periods, blank when nothing to say)~~

- ~~"Share itinerary" button (native share sheet), validated passport-free share links, privacy policy line~~

- ~~Map view with ranked pins that open the full city cards; "Suggested Destinations in X for Y" heading~~

- ~~Real photos everywhere: 123 city photos + 563/615 neighborhood photos, all visually reviewed, with credits~~

- ~~Social link previews (branded 1200×630 image with Amatic font) + lazy-loaded photos site-wide~~

## 🚩 The flagship

~~**0. Events on destination finder, from the events spreadsheet**~~ *Done: the finder (choose.html) has a "World Events" tool built from `events.js` (checked 2026-11-17).*

~~**1. Travel buddy matching (L)** — the feature the name promises. Signed-in users post "Lisbon, Oct 12–19, into food & museums"; others browse by city and date overlap and connect. Builds on existing profiles, photos, socials, forum. Needs: a trips table in Supabase, a browse/match page, messaging or contact-share, and safety/reporting basics. Highest retention potential on this list.~~

## 💚 Personal & sticky (make accounts worth having)

**2. ~~"My Trips" — save cities from the finder (M)** — heart icon on cards/pins saves a city; saved list feeds the itinerary builder, pulling in transit, neighborhoods, and season data automatically.~~

~~**3. Personal travel map (M)** — "been there" checkboxes light up a world map on your profile (reuse the MapLibre stack), plus Bucket List progress ("31/100"). Highly shareable.~~

## 🧰 Trip-prep tools (turn one visit into five)

~~**8. ~~Language survival card (S)** — city pages already know each city's languages; add ~10 key phrases per language, printable wallet card.~~~~

## 🔎 Discovery (use the data you're sitting on)

~~~~**10. ~~Day trips from every city (M)** — 6,218-city database + existing distance math = "within 2 hours of Prague" section on every guide; also promotes coming-soon guides.~~~~~~

~~~~**12. ~~Compare two cities side-by-side (M)** — costs, weather, safety, walkability, visitors, visa; all data exists. SEO gold ("Lisbon vs Porto").~~~~~~

**1~~3. ~~Auto-generated seasonal collections (S/M)** — "Warm in January," "Christmas market cities," from the season/event data.~~~~

## 🔧 Polish & trust (small, high value)

~~**20. "Was this estimate right?" feedback (S)** — thumbs up/down on price estimates to tune the honesty of the math over time.~~

~~**21. ~~Per-city link previews for messaging apps (M, technical)** — currently individual city links show the branded default image in iMessage/WhatsApp (those apps don't run page code). A small build step that generates one tiny static page per city would give each city its own photo preview.~~ *Done: the*~~ `city-meta` ~~*edge function stamps each city's title, description and photo (checked 2026-09-18).~~*

~~**22. Accessibility & SEO pass (S/M)** — alt text audit, structured data (schema.org) on city pages, sitemap.xml. *2026-09-18: sitemap and structured data done; the alt-text audit (item 30) was finished 2026-10-10.~~*

## 🚀 Post-launch SEO & growth (added July 12, 2026)

**24. ~~Per-city titles & descriptions (M)** ⭐ *biggest ranking win* — today every city guide shows Google the same generic title. A small Netlify edge function stamps "Tokyo Solo Travel Guide" (plus matching description and photo) into each page before it's sent. Solves item 21 (per-city link previews) at the same time. Same fix applies to blog posts.~~ *Done: same edge function, all 893 cities; since 2026-09-17 it also adds a canonical tag, a server-side heading and summary.*

**25. ~~Canonical tags (S)** — one line per page telling Google each page's official address, so share links with extra URL bits don't count as duplicate pages.~~ *Done 2026-09-17/18: canonical on every public page and every city guide (*`6fc184c7`*,* `443ed13f`*).*

**26. ~~Structured data (S/M)** — hidden labels (schema.org) telling Google "this is a travel guide about Tokyo" / "this is a blog post." Can earn richer search listings; part of item 22.~~ *Done 2026-09-18: TravelGuide + breadcrumb on city guides, Organization + WebSite on the home page (*`6fc184c7`*).*

~~**28. Bing Webmaster Tools (S)** — 10-minute sibling of Search Console; covers Bing, DuckDuckGo, and AI search tools that use Bing's index.~~ *Done 2026-10-09: Jeff set up and verified Bing Webmaster Tools (TODO A6).*

**30. ~~Alt text audit (S)** — descriptive captions on photos for image search + accessibility; part of item 22.~~ *Done 2026-10-10: every `<img>` already had alt text; the gaps were photos shown as CSS backgrounds and the event poster. Fixed: event poster alt, phone landmark photo, home-page city circles, itinerary city photos (*`97d09211`*,* `d43e8e97`*). Photos with text inside their box (city hero, landmark and hood cards, post and ranking tiles) are left as decorative because the name sits in text beside them; the phone landmark label and event poster were not exercised in a browser.*

**31. ~~Custom 404 page (S)** — a friendly "lost? browse all cities" page instead of Netlify's default when someone hits a dead link.~~ *Done:* `404.html` *exists and unknown city names now return a real 404 (*`443ed13f`*).*

## 📋 City-page quick-reference additions (added July 19, 2026)

~~**48. Cash vs. card verdict (S)** — card-acceptance % is already stored; surface it as a one-liner ("cards fine everywhere" / "carry cash for taxis and markets").~~ *Done: the currency card shows "<n>% of businesses take cards" with a coloured verdict word and bar (checked 2026-11-17).*

## ⚠️ Pending fix (added July 19, 2026)

**50. ~~Self-host fonts + fix privacy policy claim (S)** — Jeff plans to change site fonts and then self-host them. Once the new fonts are applied: (1) serve them from our own server instead of fonts.googleapis.com (GDPR — German court rulings on Google Fonts), and (2) the privacy.html line "The site's display font is hosted on our own server, so no font request is sent to Google" becomes true — verify it, or amend it if any Google-hosted font remains. Currently Fraunces, Work Sans, and IBM Plex Mono are still hotlinked from Google on nearly every page.~~ *Done: fonts self-hosted in* `/fonts`*, no page requests Google Fonts, and the privacy claim is true (checked 2026-09-17).*
