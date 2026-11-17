# Never Roam Alone — Suggested Improvements Backlog

*Compiled July 11, 2026 with Claude. Effort: S = an afternoon session, M = a full session or two, L = multi-session project. Check items off or reorder as you like — this is your planning doc.*

*2026-11-17: finished items moved, unchanged, to `_done/suggested-improvements-done.md` (Jeff: the list was out of date). Strike an item through when it is done; it moves there at the next clean-up.*

---

## 💚 Personal & sticky (make accounts worth having)

**4. Monthly "Where to go in {month}" page/newsletter (S/M)** — auto-generated from the season & events data: ideal-weather cities, festivals, what to avoid. Fresh content monthly with no writing; gives the mailing list a purpose.

## 🧰 Trip-prep tools (turn one visit into five)

**5. Arrival cheat-sheet per city (M)** ⭐ *recommended next flagship* — printable one-pager: airport→center options & prices, how to pay for transit, taxi cost, emergency number, plug type, tipping. Nearly all data already exists on city pages.

**6. Smart packing list generator (S/M)** — destination + dates + the climate data → checkable, printable list ("Kyoto in November: layers, rain shell").

**7. Pre-trip checklist builder (M)** — extend the visa checker: visa status, passport-validity rule, insurance, eSIM, currency. Natural honest affiliate slots (matches monetization-plan.md).

**9. Offline guides / PWA (M/L)** — save a city guide to the phone for use while traveling without data.

## 🔎 Discovery (use the data you're sitting on)

**11. Weekend finder preset (S)** — "I have 3 days, I live in Berlin" button → filters to destinations under ~5h door-to-door.

## 👥 Community

**14. Neighborhood tips + user photo uploads (M)** — one-line tips per neighborhood from signed-in users; moderated photo uploads could fill the last 52 missing neighborhood photos.

**15. Per-city Q&A (S/M)** — point Ask-a-Roamer threads at each city page.

**16. Trip reports (M)** — structured after-trip mini-reviews (rating + "one thing I wish I'd known") shown on city pages.

**17. Monthly photo contest (S)** — winner's shot becomes a city page header with credit.

## 🎯 Fun entry points

**18. "What kind of roamer are you?" quiz (S/M)** — five playful questions ending in a pre-filled finder link + shareable result.

**19. "How far can $2,000 take me?" shareable graphic (M)** — visual version of the budget math the finder already does.

## 📷 Photo housekeeping

**23. Remaining 4 neighborhood photos (was 52; 2026-09-18)** — list lives in `neighborhoods-needing-photos.md`. Options: your own photos (drop in the Desktop "Neighborhood photos" folder, named `City-Neighborhood.jpg`), a Flickr API pass (needs free key + domain allowlisted, same drill as Pexels), or leave on the Unsplash live fallback.

- Re-run Pexels/Pixabay search every few months — both sites add photos constantly (keys are saved).
- Still placeholder: story-card images on city pages; blog post photos on the homepage.

## 🚀 Post-launch SEO & growth (added July 12, 2026)

*Foundation already done: sitemap.xml, robots.txt, meta descriptions on every page, admin pages hidden from Google. Site is noindexed until launch day (one marked line in netlify.toml). Launch day = delete that line, push, set up Google Search Console, submit sitemap.*

**27. Page-speed pass (M)** — city.html is over half a megabyte of code before photos. Move shared styles/data into cached files, serve WebP images. Test with PageSpeed Insights; speed is a ranking factor. *Partly done by the August performance audit; deferring city.html's heavy scripts (about 1.45 MB) is still open.* *2026-10-24: five more data files (advisories, driving permits, rental notes, eSIM providers, app-store links; about 295 KB) now load in the background beside the city's data instead of blocking it, the same way hood photos, phrases and holidays already did; checked on Beirut, Yerevan and Lisbon (every section, the eSIM and before-you-rent popups, no console errors). Still blocking: city-photos.js (~127 KB, needed early for the hero photo) and the page's own ~263 KB main script; splitting those is the next step, then a PageSpeed Insights test on the live site.* *2026-10-24 (later): the main script moved to `city-main.js` (~263 KB), so browsers keep it between guides instead of re-downloading it inside every city page; city.html is now ~150 KB (was ~412 KB). Six guides rendered identically before and after (text, links, images, all 8 plates, no script errors). Left: city-photos.js (~127 KB) and a PageSpeed Insights test once pushed.*

**29. Analytics (S)** — Netlify Analytics or privacy-friendly Plausible: which pages people actually visit and where they come from. Without it you can't tell what's working. *2026-09-18: Plausible chosen and the script is on every page (*`6fc184c7`*); waiting on Jeff's Plausible signup. City guides get it from the edge function until city.html carries it.*

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

**49. Best months mini-strip (S/M)** — the finder's season/weather data shown as 12 small month dots on the city page itself.

**50. Dessert / ice cream picks per neighborhood (M)** (added 2026-09-26, Jeff) — a separate listing beside coffee & takeaway. Ice-cream shops were kept out of takeaway for it (decisions.md 2026-09-26). A new city.html section: goes through the CLAUDE.md §5.3 change protocol; the hood-picks cache already holds Google's ice_cream_shop and dessert_shop candidates.

---

*Suggested order if you want a default path: 5 (arrival cheat-sheets) → 2+3 (accounts worth having) → 4 (monthly seasonal page) → 1 (buddy matching, the big swing).*