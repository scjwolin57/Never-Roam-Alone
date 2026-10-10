# Jeff's to-do list

*Started 2026-10-09. Everything that is waiting on **you**: a decision, something only you can do (a sign-in, a send, a push),
work that starts when you say "go", or an answer from someone outside the project. Every session keeps it current:
when an item is done it is struck through with the date and a few words (`~~item~~ done 2026-10-09: what happened`),
never deleted; new items for you are added under the right heading. Details live in the file named on each line.*

## 1. Decisions waiting on you

- ~~**D1. Tamanrasset, Soro: does a live booking page count as "open"?** Hotel Caravansérail is in Soro and takes bookings on darbooking.com (about $30), but its newest review is January 2025. Yes = Soro keeps one hotel; no = Soro is removed (no hotels to choose from).~~ *`decisions.md` ~~2026-10-09*~~
- ~~**D2. Chad, Lebanon, Armenia "before you rent" notes.** Your call was "IDP recommended"; the licence-aware permit row (government advice) says Required for most licences. Recommended: no note for these three. *`before-you-rent-2026-10-06.md`~~* done 2026-10-09: Jeff chose "note it as required"; notes added for Armenia, Chad and Lebanon in `rental-notes.js`.
- ~~**D3. Najaf, "Amir al-Mu'minin Library (Haydariyya Library)".** The entry joins two different libraries' names and shares one map point with the Old City Souq. Say "fix it" to research it. *`city-landmark-coords.js`*~~ done 2026-10-09: renamed "Imam Amir al-Mu'minin Public Library", pin moved to the Huwaysh site (31.99366, 44.31435), blurb rewritten; site and sheet.
- ~~**D4. Neighborhood review: "Things to look at".** About 13 keep/remove calls on thin evidence (Cholula, Sosúa, Kyoto Fushimi, the Dublin swaps, ...) and 7 weak adds.~~ *`hood-review-2026-10-08.md`*
- ~~**D5. Batch 1 hood-picks Google results still on disk.** The hood-picks rule says delete a batch's saved results after it is done; they are also the free source for re-picks. Delete or keep? *`RESUME_hood-picks.md`*~~ done 2026-10-10: Jeff said keep for further research; exception logged in `decisions.md` and `RESUME_hood-picks.md`.
- ~~**D6. Bangkok (Siam), CRU Champagne Bar** is filed as a pub; a checker says it is not one.~~ done 2026-10-09: Jeff said remove; CRU Champagne Bar deleted from the Hood Picks tab and Bangkok citydata (Siam now has The Loft only).
- ~~**D7. Denizli rooster statue:** an older photo shows a taller rooster, so the statue may have been replaced. Confirm before its photo request goes out. *`flickr-permission-shortlist.csv`*~~ done 2026-10-09: Jeff chose A.Savin's 2020 Commons photo (Free Art License) for the Delikliçınar Square slot; no Flickr request needed.
- ~~**D8. Driving permits: governments that disagree** (Ethiopia, Cambodia, Solomon Islands, Turkey, Armenia). Each government is right for its own licence so nothing was changed; read the list and say if any should carry a note. *`intl-permit-definition-2026-10-08.md`*~~ done 2026-10-10: Jeff answered the three choices (passport country sets the rules, US when none; own authority then FCDO then flagged "Recommended"; all five values). Only the US default was new; no per-country notes added.
- ~~**D9. Turkey, Azerbaijan, Bangladesh: still no "before you rent" note** for lack of a national source (Chad, Lebanon and Armenia are D2). Say "go" to retry when search quota allows. *`before-you-rent-2026-10-06.md`*~~ done 2026-10-10: Jeff said it should be closed. Turkey and Azerbaijan have notes (2026-10-09, his sources); Bangladesh "Required" matches the permit row, so no note.

## 2. Things only you can do

- ~~**A1. Push to the live site.** Many commits since 7 Oct are local only. Say "push it" (or push from Terminal) once you have looked at them.~~ done 2026-10-09: 15 commits pushed (656d4a4a..1805f697) after every check passed on the committed state.
- **A2. Send the Flickr permission requests:** 10 photos marked "ready to ask" (was 11; the Denizli rooster was dropped 2026-10-09). Message: `flickr-request-message.md`; record each answer in the row. *`flickr-permission-shortlist.csv`*
- **A3. Plausible analytics signup** (backlog 29): the script is already on every page.
- ~~**A4. Google Cloud check for the landmark pin pass.**~~ done 2026-10-09: October geocoding was near zero; the Google geocoding pass and the Places pass both ran (`RESUME_landmark-pin-pass.md`).
- **A5. Partnerize:** open the new account and apply to the Expedia (US) and Hostelworld campaigns (decided 2026-10-05), if not done yet. *`hotel-resourcing-plan-2026-10-01.md`* *Update 2026-10-09: Partnerize account open and Expedia (US) approved; Hostelworld application still pending (see W2).*
- ~~**A6. Bing Webmaster Tools** (backlog 28), about 10 minutes.~~ done 2026-10-09: Jeff set up and verified Bing Webmaster Tools.
- **A7. Launch day:** delete the noindex line in `netlify.toml`, push, set up Google Search Console and submit the sitemap; then the monthly Search Console check (backlog 33).
- **A8. Kiwitaxi: new account link.** You are moving to a new Kiwitaxi account; paste the new partner link (or change `KIWITAXI_TAG` in city.html) and confirm in the dashboard that clicks earn commission (the current link is recorded as a "Kiwitaxi Business" program). Used on 39 guides. *`car-rental-second-program-2026-10-06.md`*
- **A9. NRA-MASTER.xlsx: delete the empty "Intl Driving Permit" column** in Live Cities (emptied 2026-10-08 when the permit row moved to the Driving Permits tab; the sheet tool can clear cells but not delete a column). *`intl-permit-definition-2026-10-08.md`*
- ~~**Landmark pin pass leftovers (2026-10-09).**~~ done 2026-10-09: all six answers applied (see decisions.md); left: 274 China pins without a Wikidata match stay unverified, Xcaret / Manta Point / Sataya Reef / Tsingy trips have no photo. *`RESUME_landmark-leftovers-2026-10-09.md`*

## 3. Say "go" and it gets done

- **G1. Recheck The Cock and Bottle** (London, Notting Hill): was reopening by 3 Oct, now overdue. *`hood-picks-bar-conflicts.md`*
- **G2. Hood picks batch 5** (cities 101 to 125 of 393). *`RESUME_hood-picks.md`*
- **G3. Flickr shortlist: prepare the next 25 landmarks.**
- **G4. Batch 1 chain check, part 2:** page-check the 181 "weak evidence" picks (usually duplicate map records).
- ~~**G5. Re-run the DiscoverCars coverage check** right before the car links go live.~~ changed 2026-10-09: the links went live 2026-10-06 on the 2026-10-05 check, which was not re-run. Now an occasional re-check: say "go" and the scripts in `_guidebuild/discovercars/` re-run (about an hour) and drop any link whose page has gone. *`discovercars-coverage-2026-10-05.md`*

## 4. Waiting on someone else

- ~~**W1. DiscoverCars account approval:** then deep links for the 31 places with no landing page.~~ approved 2026-10-06 (partner tag NRA2026 live). Still open: whether the DiscoverCars dashboard can make a search link for the 31 places with no landing page (Hanoi, Ho Chi Minh City, Hong Kong, Cusco...); check it when you are next signed in and tell me. *`discovercars-coverage-2026-10-05.md`*
- **W2. Hostelworld / Partnerize approval:** Expedia (US) approved 2026-10-09 (Jeff). Waiting on Hostelworld; then the hotel re-sourcing plan can be built (Expedia main + Hostelworld shared-room tier).
- **W3. Flickr photographers' answers** (after A2).
- **W4. Hood photo name-collision audit** (running in its own session): it will list wrong hood photos (Kalamata's "Historic Centre" is in Avignon, "Marina" is in Faro) and ask you before replacing.

## 5. Improvement backlog (open items from `suggested-improvements.md`, its numbers)

*New ideas and research still go into `suggested-improvements.md` (CLAUDE.md §4.4); strike an item through in both files when it is done.*

- **0.** Events on the destination finder, from the events spreadsheet
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
- **22 / 30.** Accessibility & SEO pass: alt-text audit (a session is working on it now)
- **23.** Remaining neighborhood photos; re-run the Pexels/Pixabay search every few months; story-card and blog placeholders
- **27.** Page-speed pass: defer city.html's heavy scripts (about 1.45 MB)
- ~~**28.** Bing Webmaster Tools (see A6)~~ done 2026-10-09 (see A6)
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
- **48.** Cash vs. card verdict (S)
- **49.** Best months mini-strip (S/M)
- **50.** Dessert / ice cream picks per neighborhood (M)

## Done

*(Items move nowhere: they are struck through in place above. This heading is only for things finished before the list started.)*

- ~~Run `corrections-setup.sql` in Supabase~~ done 2026-10-09 (table confirmed).
- ~~Car rental: Türkiye and Azerbaijan "before you rent" notes~~ done 2026-10-09 from your sources.
- ~~Lochotín: add Hotel Panorama or not~~ done 2026-10-09: no hotels to choose from, so Lochotín was removed.
- ~~Folder cleanup commit~~ done 2026-10-09.

