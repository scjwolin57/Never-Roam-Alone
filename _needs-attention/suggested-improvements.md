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

**0. - Events on destination finder, from the events spreadsheet

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

## 🚀 Post-launch SEO & growth (added July 12, 2026)

*Foundation already done: sitemap.xml, robots.txt, meta descriptions on every page, admin pages hidden from Google. Site is noindexed until launch day (one marked line in netlify.toml). Launch day = delete that line, push, set up Google Search Console, submit sitemap.*

**24. Per-city titles & descriptions (M)** ⭐ *biggest ranking win* — today every city guide shows Google the same generic title. A small Netlify edge function stamps "Tokyo Solo Travel Guide" (plus matching description and photo) into each page before it's sent. Solves item 21 (per-city link previews) at the same time. Same fix applies to blog posts.

**25. Canonical tags (S)** — one line per page telling Google each page's official address, so share links with extra URL bits don't count as duplicate pages.

**26. Structured data (S/M)** — hidden labels (schema.org) telling Google "this is a travel guide about Tokyo" / "this is a blog post." Can earn richer search listings; part of item 22.

**27. Page-speed pass (M)** — city.html is over half a megabyte of code before photos. Move shared styles/data into cached files, serve WebP images. Test with PageSpeed Insights; speed is a ranking factor.

**28. Bing Webmaster Tools (S)** — 10-minute sibling of Search Console; covers Bing, DuckDuckGo, and AI search tools that use Bing's index.

**29. Analytics (S)** — Netlify Analytics or privacy-friendly Plausible: which pages people actually visit and where they come from. Without it you can't tell what's working.

**30. Alt text audit (S)** — descriptive captions on photos for image search + accessibility; part of item 22.

**31. Custom 404 page (S)** — a friendly "lost? browse all cities" page instead of Netlify's default when someone hits a dead link.

**32. Backlinks — the real ranking fuel (ongoing)** — Google ranks sites other sites link to. Share guides on r/solotravel and travel forums (genuinely, not spammy), get listed in travel directories, offer guest posts. Items 12 (city vs city) and 13 (seasonal collections) create pages people naturally link to.

**33. Monthly Search Console check-in (S, recurring)** — once indexed: fix crawl errors, see which searches bring people in, sharpen titles on pages that show up but don't get clicked.

---

## 🧭 Solo-first differentiators (added July 19, 2026 — research-backed)

*From competitor research: no mainstream travel site does items 34 or 35; items 36–38 address the top solo-traveler worries (safety, loneliness, eating alone).*

**34. Visa / stay-limit tracker (M/L)** ⭐ *validated gap* — no mainstream planner tracks rules like Schengen's "90 days in any 180." The visa checker + itinerary dates already exist; connect them: "your trip plan uses 47 of your 90 Schengen days" with an overstay warning.

**35. Solo Score per city (M)** ⭐ *owns the brand* — score every city on ease of meeting people, eating-alone friendliness, safe-after-dark, and hostel/social scene, using existing safety/walkability/lodging/events data. Creates linkable SEO pages ("best cities for first-time solo travelers").

**36. Solo-specific city content (M)** — per city: a "Your first night in {city}" arrival-evening plan (safe area to walk, one easy solo-friendly dinner spot, when things close); an eating-alone guide (local dinner hours, counter/bar-seat culture, food halls); and safe-after-dark tags on the already-labeled neighborhoods.

**37. Safety check-in (M)** — traveler picks a trusted contact and taps "check in" daily during a trip; a missed check-in emails the contact with the itinerary. Standalone safety apps do this; no planning site does. Builds on trips + Resend.

**38. Linkups (M)** — the step beyond Roamers in Town: members post a small public activity ("free walking tour Sat 10am, join me") that others RSVP to. Low-friction meetups are the 2026 social-travel trend.

**39. Solo cost reality (S/M)** — travel costs assume couples splitting a room. Add a "solo daily cost" line per city: single/private hostel room vs. dorm price, and flag cities where solo lodging is disproportionately expensive. Nobody shows this.

**40. First solo trip mode (M)** — guided path for nervous first-timers: short quiz → recommends an "easy" starter city (high Solo Score) → pre-trip checklist → first-night plan. Converts people who want to solo travel but haven't dared. Pairs with the quiz (item 18).

**41. Roamer vouches (M)** — after two members meet via a linkup or message, each can confirm "met in real life." Vouch counts become a trust badge that makes future meetups feel safer — directly answers the #1 solo worry.

**42. Classes & group activities per city (M)** — cooking classes, walking tours, pub crawls: cooking workshops rated the most memorable solo experience (68% in one survey) and the easiest natural way to meet people. Clean affiliate fit (GetYourGuide/Viator) per monetization-plan.md.

**43. Solo female lens (M)** — optional toggle adding women-specific safety notes to city and neighborhood info. A huge, loyal audience that generic sites underserve.

## 📋 City-page quick-reference additions (added July 19, 2026)

**44. Common scams here (M)** — per-city card: taxi meter tricks, pickpocket hotspots, ATM skimming zones. Scam warnings exist only scattered across blogs, never on the guide page itself.

**45. "Apps to download before you land" (S/M)** — which ride-hailing app actually works there (Grab vs. Uber vs. Bolt), the local transit app, food delivery. Small card, hugely practical.

**46. Essentials strip (S/M)** — emergency number, tap-water safety, plug type/voltage, tipping norm as four icons in one row. Overlaps the arrival cheat-sheet (item 5) — build the data once, show it both places.

**47. Local rhythm (S/M)** — when dinner happens, siesta/Sunday closures, when shops open. Prevents the "everything's closed and I'm hungry" first-day fail.

**48. Cash vs. card verdict (S)** — card-acceptance % is already stored; surface it as a one-liner ("cards fine everywhere" / "carry cash for taxis and markets").

**49. Best months mini-strip (S/M)** — the finder's season/weather data shown as 12 small month dots on the city page itself.

## ⚠️ Pending fix (added July 19, 2026)

**50. Self-host fonts + fix privacy policy claim (S)** — Jeff plans to change site fonts and then self-host them. Once the new fonts are applied: (1) serve them from our own server instead of fonts.googleapis.com (GDPR — German court rulings on Google Fonts), and (2) the privacy.html line "The site's display font is hosted on our own server, so no font request is sent to Google" becomes true — verify it, or amend it if any Google-hosted font remains. Currently Fraunces, Work Sans, and IBM Plex Mono are still hotlinked from Google on nearly every page.

---

*Suggested order if you want a default path: 5 (arrival cheat-sheets) → 2+3 (accounts worth having) → 4 (monthly seasonal page) → 1 (buddy matching, the big swing).*
