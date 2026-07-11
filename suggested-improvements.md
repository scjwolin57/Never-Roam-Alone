# Never Roam Alone — Suggested Improvements Backlog

*Compiled July 11, 2026 with Claude. Effort: S = an afternoon session, M = a full session or two, L = multi-session project. Check items off or reorder as you like — this is your planning doc.*

---

## ✅ Recently completed (July 2026, for reference)

- Destination finder intelligence: one-way/return toggle, door-to-door flight times, train-vs-plane & long-ride alerts, honest ground-travel math (winding roads, en-route hotel nights), editable nights assumption, "Compare all ways to get there" expander, one-way rental fee note
- Season/event bubbles on finder cards (weather + festivals/peak periods, blank when nothing to say)
- "Share itinerary" button (native share sheet), validated passport-free share links, privacy policy line
- Map view with ranked pins that open the full city cards; "Suggested Destinations in X for Y" heading
- Real photos everywhere: 123 city photos + 563/615 neighborhood photos, all visually reviewed, with credits
- Social link previews (branded 1200×630 image with Amatic font) + lazy-loaded photos site-wide

---

## 🚩 The flagship

**1. Travel buddy matching (L)** — the feature the name promises. Signed-in users post "Lisbon, Oct 12–19, into food & museums"; others browse by city and date overlap and connect. Builds on existing profiles, photos, socials, forum. Needs: a trips table in Supabase, a browse/match page, messaging or contact-share, and safety/reporting basics. Highest retention potential on this list.

## 💚 Personal & sticky (make accounts worth having)

**2. "My Trips" — save cities from the finder (M)** — heart icon on cards/pins saves a city; saved list feeds the itinerary builder, pulling in transit, neighborhoods, and season data automatically.

**3. Personal travel map (M)** — "been there" checkboxes light up a world map on your profile (reuse the MapLibre stack), plus Bucket List progress ("31/100"). Highly shareable.

**4. Monthly "Where to go in {month}" page/newsletter (S/M)** — auto-generated from the season & events data: ideal-weather cities, festivals, what to avoid. Fresh content monthly with no writing; gives the mailing list a purpose.

## 🧰 Trip-prep tools (turn one visit into five)

**5. Arrival cheat-sheet per city (M)** ⭐ *recommended next flagship* — printable one-pager: airport→center options & prices, how to pay for transit, taxi cost, emergency number, plug type, tipping. Nearly all data already exists on city pages.

**6. Smart packing list generator (S/M)** — destination + dates + the climate data → checkable, printable list ("Kyoto in November: layers, rain shell").

**7. Pre-trip checklist builder (M)** — extend the visa checker: visa status, passport-validity rule, insurance, eSIM, currency. Natural honest affiliate slots (matches monetization-plan.md).

**8. Language survival card (S)** — city pages already know each city's languages; add ~10 key phrases per language, printable wallet card.

**9. Offline guides / PWA (M/L)** — save a city guide to the phone for use while traveling without data.

## 🔎 Discovery (use the data you're sitting on)

**10. Day trips from every city (M)** — 6,218-city database + existing distance math = "within 2 hours of Prague" section on every guide; also promotes coming-soon guides.

**11. Weekend finder preset (S)** — "I have 3 days, I live in Berlin" button → filters to destinations under ~5h door-to-door.

**12. Compare two cities side-by-side (M)** — costs, weather, safety, walkability, visitors, visa; all data exists. SEO gold ("Lisbon vs Porto").

**13. Auto-generated seasonal collections (S/M)** — "Warm in January," "Christmas market cities," from the season/event data.

## 👥 Community

**14. Neighborhood tips + user photo uploads (M)** — one-line tips per neighborhood from signed-in users; moderated photo uploads could fill the last 52 missing neighborhood photos.

**15. Per-city Q&A (S/M)** — point Ask-a-Roamer threads at each city page.

**16. Trip reports (M)** — structured after-trip mini-reviews (rating + "one thing I wish I'd known") shown on city pages.

**17. Monthly photo contest (S)** — winner's shot becomes a city page header with credit.

## 🎯 Fun entry points

**18. "What kind of roamer are you?" quiz (S/M)** — five playful questions ending in a pre-filled finder link + shareable result.

**19. "How far can $2,000 take me?" shareable graphic (M)** — visual version of the budget math the finder already does.

## 🔧 Polish & trust (small, high value)

**20. "Was this estimate right?" feedback (S)** — thumbs up/down on price estimates to tune the honesty of the math over time.

**21. Per-city link previews for messaging apps (M, technical)** — currently individual city links show the branded default image in iMessage/WhatsApp (those apps don't run page code). A small build step that generates one tiny static page per city would give each city its own photo preview.

**22. Accessibility & SEO pass (S/M)** — alt text audit, structured data (schema.org) on city pages, sitemap.xml.

## 📷 Photo housekeeping

**23. Remaining 52 neighborhood photos** — list lives in `neighborhoods-needing-photos.md`. Options: your own photos (drop in the Desktop "Neighborhood photos" folder, named `City-Neighborhood.jpg`), a Flickr API pass (needs free key + domain allowlisted, same drill as Pexels), or leave on the Unsplash live fallback.
- Re-run Pexels/Pixabay search every few months — both sites add photos constantly (keys are saved).
- Still placeholder: story-card images on city pages; blog post photos on the homepage.

---

*Suggested order if you want a default path: 5 (arrival cheat-sheets) → 2+3 (accounts worth having) → 4 (monthly seasonal page) → 1 (buddy matching, the big swing).*
