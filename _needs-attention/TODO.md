# Jeff's to-do list

*Started 2026-10-09. Everything that is waiting on **you**: a decision, something only you can do (a sign-in, a send, a push),
work that starts when you say "go", or an answer from someone outside the project. Every session keeps it current:
when an item is done it is struck through with the date and a few words (`~~item~~ done 2026-10-09: what happened`),
never deleted. To keep the list clean, struck items are then moved, unchanged, to `_done/TODO-done.md` (Jeff, 2026-11-17).
New items for you are added under the right heading. Details live in the file named on each line.*

*Last refreshed 2026-10-19: every open line re-checked against the commit log and the files; finished notes moved to `_done/`. 2026-11-17: 47 struck items moved to `_done/TODO-done.md`.*

## 1. Decisions waiting on you

- **D16. Closed-airport check, other 804 guides: what is left (2026-11-17).** Notes added for Naples (closed all November; 4 guides), Potosí and Rouen; Lugano's airport removed from the Lugano guide. Open: (a) **take the Naples note off on 1 December** if the airport has reopened (`airports_tool.py` closures tab, 4 rows); (b) Reims: Vatry's flights, sources disagree; (c) Bern, Salamanca, Grenoble are summer- or ski-season-only main airports: add a "seasonal" note or not?; (d) 7 airports could not be settled; (e) 9 guides name the wrong or a weak airport (Rouen's main airport has no flights: swap to Paris CDG?). Say "go d16" with your calls. *`closed-airports-other-guides-2026-11-17.md`*

## 2. Things only you can do

- **A17. Test the destination requests list (2026-11-16).** Send one request from the homepage search, open Admin → Suggestions → Destination requests, and check the row is there and "Research and add" copies the request.
- **A2. Send the Flickr permission requests:** 10 photos marked "ready to ask" (was 11; the Denizli rooster was dropped 2026-10-09). Message: `flickr-request-message.md`; record each answer in the row. *`flickr-permission-shortlist.csv`*
- **A3. Plausible analytics signup** (backlog 29): the script is already on every page.
- **A5. Partnerize:** open the new account and apply to the Expedia (US) and Hostelworld campaigns (decided 2026-10-05), if not done yet. *`hotel-resourcing-plan-2026-10-01.md`* *Update 2026-10-09: Partnerize account open and Expedia (US) approved; Hostelworld application still pending (see W2).* *2026-10-19: still waiting on Hostelworld only.*
- **A7. Launch day:** delete the noindex line in `netlify.toml`, push, set up Google Search Console and submit the sitemap; then the monthly Search Console check (backlog 33). *Checked 2026-10-19: the site-wide noindex line is still in `netlify.toml` (line 332), so the site is still pre-launch.*
- **China pins: 150 still unverified (165 before the Chrome pass of 2026-10-19) (was 234 on 2026-10-14) (2026-10-14; the earlier "about 175" left out 61 pins whose sources matched but did not line up).** Full list with the reason for each: `china-unverified-landmarks-2026-10-14.csv`. Free sources are exhausted (Wikidata, Wikipedia, Commons, Overpass, Chinese-name OpenStreetMap all run). Send your own Maps pins for any you care about, or say whether to try a paid Chinese map source. *2026-10-18: Amap's search page and key sign-up are blocked for us (bot check; no US-number sign-up); the route left is Jeff's Amap share links, sent as `landmark: link` in batches. First one applied: Chaozhou Guangji Bridge pinned per Jeff's Amap link (GCJ-02 converted to WGS-84, OpenStreetMap reverse lookup names the bridge), 233 remain unverified. decisions.md row still to add (file has Jeff's uncommitted edits).* *2026-10-19: Amap pass from your share links finished: 66 pins corrected (GCJ-02 converted to WGS-84, Baidu Maps agrees where checked; 8 were city-centre placeholders 1.5 to 27 km off), 9 checked and left as stored, Dayu Mausoleum settled per your Google Maps pin. **165 of 444 China landmarks still unverified**, each with its Chinese name and Amap search text in the CSV. Send more Amap links (`landmark: link`) for any you care about. The decisions.md rows for the 2026-10-18/19 work are still to add, because decisions.md has uncommitted edits nobody has claimed (see A12).* *`china-unverified-landmarks-2026-10-14.csv`, `decisions.md` 2026-10-12 and 2026-10-14* *2026-10-19, Chrome pass: Amap search in your Chrome answered 29 searches, then rate-limited (HTTP 419), and Baidu asked for a CAPTCHA each time, even after you cleared it. From those 29: 14 pins moved (0.6 to 19 km; Jinli Ancient Street 8.6 km, Tuojiang boat ride 19 km, Jinhaiwan mangroves 12 km), 1 verified as stored, the rest left with a reason in the CSV. Two may be day trips, not landmarks: Beihai Crocodile Mountain (on Weizhou Island, about 50 km offshore) and Chaozhou Phoenix Mountain tea area (about 30 km north); say keep, move to day trips, or remove. The other 136 were not searched yet; rerun when Amap stops limiting.*
- **A11. DiscoverCars: do affiliate visitors see fewer companies?** (found 2026-10-14) EWR, 26 to 27 Oct: arriving without our tag showed 152 offers from 8 companies (incl. Avis, Budget, Enterprise, National, Alamo); arriving through `?a_aid=NRA2026` showed 51 offers from 3 (ACE, Priceless, Rent a Wreck), matching your own search. Confirm in two private windows (with and without the tag), then ask DiscoverCars partner support why. If confirmed, US guides may need another partner (Trip.com) for the car link. *Confirmed 2026-10-14 by Jeff in a private window: 8 companies without the affiliate marker, 3 with it. Note the marker sticks: once a browser opens any `?a_aid=` link, every later DiscoverCars visit counts as affiliate. 34 of our 638 DiscoverCars links are US pages. Next: send DiscoverCars support the message in the chat of 2026-10-14 (EWR example, why are majors hidden from affiliate traffic, US-only?, can it change); optionally repeat the private-window test at one European airport (e.g. Paris CDG). Site unchanged until you decide.* *2026-10-14: Trip.com does not do this (EWR, same dates: 272 offers from 10 companies with or without our tag), so it is an option for the 34 US guides if DiscoverCars cannot fix it.* *2026-10-15: DiscoverCars replied that suppliers vary by the driver's country of residence (some offers are for international renters only). That does not fit our test: both searches were US resident, age 35, same airport and dates; only the affiliate tag differed. Next: send the follow-up (drafted in chat 2026-10-15) asking them to check affiliate filtering. If not fixable, option: move the 34 US guides to Trip.com (your call).* *2026-10-19: still open; nothing in the log shows the follow-up was sent. Site unchanged.* *2026-10-19, outside the US (Jeff: "check to see if the same thing happens with other cities outside the US"): no gap in Europe (Paris CDG 11 companies, London LHR 19, Rome FCO 38 to 39, the same with and without the tag), but Toronto YYZ loses Enterprise and National with the tag (281 offers from 18 companies to 229 from 16), and Newark still loses Alamo, Avis, Budget, Enterprise and National (152 offers from 9 companies to 49 from 4). So it is North America, not only the US (34 US and 17 Canadian guides carry the DiscoverCars link). Full table and options: `discovercars-affiliate-test-2026-10-19.md`.* *2026-10-19: Jeff is waiting to hear back from DiscoverCars; links stay as they are until then.*

## 3. Say "go" and it gets done

- **G2d. Hood picks: 200 of 393 cities done (batches 6 and 7 loaded 2026-10-17: 315 + 352 picks).** A live session is on the next batch. Google: about $364 of the $385 trial cap used, trial ends 2026-10-29; the free monthly calls reset 2026-11-01. Mainland China cities are skipped until the map datum and website problem is solved. Nothing for you unless the session asks. *`RESUME_hood-picks.md`* *2026-10-19: name-search re-pick of the 68 most-visited batch 1-7 cities on the last trial credit (578 searches): 55 picks loaded in 35 cities (d3e8c970). The trial credit is used up; 2 slots wait for the free calls on 2026-11-01.* *2026-11-16: batch 8 (Kuwait City to Funchal) loaded, 409 picks, on the free calls only: 200 of 393 cities before, 225 now.*
- **G2f. Hood picks after the trial credit (2026-10-21).** The last $13.92 went to 343 name searches: 74 picks loaded in 20 cities (Alicante 23, Ko Samui 23). The credit is used up. Next, on the free 1,000 calls a month from 2026-11-01: batch 8 (next 25 cities, about 1,000 calls) or the remaining name searches (about 943 slots in 81 batch 1-7 cities). Say which goes first. One question too: Hong Kong Central "local" is empty; The Chairman fits only if high-end traditional Cantonese counts as local. *`RESUME_hood-picks.md`*
- **G2g. Hood picks: same brand twice in one city? (2026-10-21)** No rule forbids it, and two cases are now live: El Mono Bandido is the pub pick in both Zona Rosa and Quinta Camacho (Bogotá), and Pelican (eat) and Pelican Club (drink) share one complex in Playa de San Juan (Alicante). Keep, or add a one-brand-per-city rule? *`RESUME_hood-picks.md`*
- **G2h. Hood picks full re-pick: done (2026-10-21), 732 picks in 202 cities, 0 Google calls; your calls below.** Every cached venue was judged on its own (coffee and bakery first, then eat, takeaway and bars), with a checker, an auditor and a bar safety check on each batch. *`RESUME_hood-picks-full-repick.md`*
  - **Held, waiting on you:** Dick's Drive-In, Seattle takeaway (Seattle-born, 10 drive-ins + 2 food trucks: local chain, or over the limit?); Dolce Ragusa, Riyadh bakery (Italian-born, all 5 stores in Riyadh); Celestial Court, Hong Kong (high-end Cantonese as "local", same question as The Chairman in G2f); The Glory Hole Cafe (crude name); OQ Club and M8 (bar safety: a "Sexy Dance Performance" and a "Bunny mafia" highlight could not be read).
  - **To look at:** Sugar House Pub, Salt Lake City dive pick, is live (liquor sales suspended Nov 2024 after an underage sting; reopened under new owners May 2025). Ten picks held behind Facebook login walls (`_guidebuild/hoodpicks/work/fr_fb_hold.json`). Miami was skipped: its file is held by another session.
  - **Same brand twice in one city (G2g):** also Forn Can Bufí, Hygge, My Coffee Porto, AROMAT (3 times) and Tasca láska. Labietis (Riga) was cut to one on the rule's spirit.
  - **Hood points that look wrong:** Zurich-West sits in Albisrieden; RÊU Dining is in Trà Quế village inside An Bang Beach's area; Puelo and Metissage are Vitacura venues under Las Condes.
  - **Held, same brand twice (G2g):** Alku5 Zamalek (Cairo) passes as a local pick (all 4 branches in Cairo, alku5.com), but Alku5 is already Downtown's local pick. Allow a second outlet, or keep one per city?
- **G3. Flickr shortlist: prepare the next 25 landmarks.**
- **G8. Photo gaps after the free pass (2026-10-19).** 61 landmark and 224 neighborhood photos added from Commons/Wikidata, location and licence checked; 497 landmarks and 353 neighborhoods still show the stand-in. Flickr's API key is not free (Jeff, 2026-10-19), so no Flickr pass; the rest stay on the stand-in until a free source or your own photos (`uploads/`) turn up. *`photo-gaps-2026-10-19.md`* *2026-10-19: Google Images with the Creative Commons filter tried on 12 at random: 0 usable (6 no results, the rest the wrong place; the filter also passes non-commercial licences). Full list of the 846 gaps: `missing-photos-2026-10-19.csv`.* *2026-10-25: the Openverse pass (`RESUME_openverse-photos.md`) is finished: all 846 gaps searched once, 5 photos applied (Bishkek, Chamonix, Malacca, Ouarzazate Centre-ville, Moroni Volo Volo), 1 portrait on a review list (Visby St. Nicolai Church Ruin), 841 gaps still on the stand-in. No free source is left to try; the daily task can be deleted.*
- **G9. Bikes & scooters: recheck 14 leads (2026-10-19).** The free pass over every empty guide is finished: 384 of 893 guides now list at least one verified operator (623 in all). 14 leads were left off for thin or old evidence (Leshan, Beihai, Haifa, Visby, Windermere, Cluj-Napoca Bolt, Rovaniemi, Mytilene, Tripoli, Cox's Bazar, Srinagar, Puducherry, Guarujá Lime, Strasbourg link). Say "go" for a recheck in a few months. *`bikes-scooters-recheck-leads-2026-10-19.md`*

## 4. Waiting on someone else

- **W2. Hostelworld / Partnerize approval:** Expedia (US) approved 2026-10-09 (Jeff). Waiting on Hostelworld; then the hotel re-sourcing plan can be built (Expedia main + Hostelworld shared-room tier).
- **W3. Flickr photographers' answers** (after A2).
- **W6. Google's free monthly calls reset 2026-11-01.** Then the thin-keep neighborhood picks can resume (214 hoods; 127 eat, 164 coffee and 191 drink cards empty on 2026-10-10). A reminder task runs 2026-11-02 and asks you for a go; nothing is spent past the free calls without you. *`RESUME_thin-keeps-picks.md`, `thin-keeps-city-list.md`* *2026-11-16: Jeff "g2f first, then thin neighborhoods with what's left": batch 8 used all 1,000 of November's free calls (3e75b989, 409 picks), so nothing was left for the thin neighborhoods. Next chance: December's free calls (reminder task 2026-12-01). Also waiting for December: name searches for the empty cards of Siem Reap (part), Bucharest, Dubrovnik, Colmar, Banff, Marmaris, Fethiye, Samarkand, Aswan and Funchal.*

## 5. Improvement backlog (open items from `suggested-improvements.md`, its numbers)

*New ideas and research still go into `suggested-improvements.md` (CLAUDE.md §4.4); strike an item through in both files when it is done.*

- **4.** Monthly "Where to go in {month}" page / newsletter (S/M)
- **5.** Arrival cheat-sheet per city (M), the recommended next flagship
- **6.** Smart packing list generator (S/M)
- **7.** Pre-trip checklist builder (M)
- **9.** Offline guides / PWA (M/L)
- **14.** Neighborhood tips + user photo uploads (M)
- **15.** Per-city Q&A (S/M)
- **16.** Trip reports (M)
- **17.** Monthly photo contest (S)
- **18.** "What kind of roamer are you?" quiz (S/M)
- **19.** "How far can $2,000 take me?" shareable graphic (M)
- **23.** Remaining neighborhood photos; re-run the Pexels/Pixabay search every few months; story-card and blog placeholders
- **27.** Page-speed pass: defer city.html's heavy scripts (about 1.45 MB) *2026-10-24: 5 data files (~295 KB) moved off the blocking path; city-photos.js (~127 KB) and the ~263 KB main script still block.* *Later the same day: the main script is now its own cached file, `city-main.js`; city.html 412 KB to 150 KB. Left: city-photos.js, then a PageSpeed test once pushed.*
- **29.** Analytics: Plausible signup (see A3)
- **32.** Backlinks (ongoing)
- **33.** Monthly Search Console check-in (after launch, see A7)
- **34.** Visa / stay-limit tracker (M/L)
- **35.** Solo Score per city (M)
- **36.** Solo-specific city content (M)
- **37.** Safety check-in (M)
- **38.** Linkups (M)
- **39.** Solo cost reality (S/M)
- **40.** First solo trip mode (M)
- **41.** Roamer vouches (M)
- **42.** Classes & group activities per city (M)
- **43.** Solo female lens (M)
- **44.** Common scams here (M)
- **45.** "Apps to download before you land" (S/M)
- **46.** Essentials strip (S/M)
- **47.** Local rhythm (S/M)
- **49.** Best months mini-strip (S/M)
- **50.** Dessert / ice cream picks per neighborhood (M)
