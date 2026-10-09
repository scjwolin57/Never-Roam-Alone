# Jeff's to-do list

*Started 2026-10-09. Everything that is waiting on **you**: a decision, something only you can do (a sign-in, a send, a push),
work that starts when you say "go", or an answer from someone outside the project. Every session keeps it current:
when an item is done it is struck through with the date and a few words (`~~item~~ done 2026-10-09: what happened`),
never deleted; new items for you are added under the right heading. Details live in the file named on each line.*

## 1. Decisions waiting on you

- **D1. Tamanrasset, Soro: does a live booking page count as "open"?** Hotel Caravansérail is in Soro and takes bookings on darbooking.com (about $30), but its newest review is January 2025. Yes = Soro keeps one hotel; no = Soro is removed (no hotels to choose from). *`decisions.md` 2026-10-09*
- **D2. Chad, Lebanon, Armenia "before you rent" notes.** Your call was "IDP recommended"; the licence-aware permit row (government advice) says Required for most licences. Recommended: no note for these three. *`before-you-rent-2026-10-06.md`*
- **D3. Najaf, "Amir al-Mu'minin Library (Haydariyya Library)".** The entry joins two different libraries' names and shares one map point with the Old City Souq. Say "fix it" to research it. *`city-landmark-coords.js`*
- **D4. Neighborhood review: "Things to look at".** About 13 keep/remove calls on thin evidence (Cholula, Sosúa, Kyoto Fushimi, the Dublin swaps, ...) and 7 weak adds. *`hood-review-2026-10-08.md`*
- **D5. Batch 1 hood-picks Google results still on disk.** The hood-picks rule says delete a batch's saved results after it is done; they are also the free source for re-picks. Delete or keep? *`RESUME_hood-picks.md`*
- **D6. London, CRU Champagne Bar** is filed as a pub; a checker says it is not one. Keep, move to cocktail, or remove? *`_done/hood-picks-batch1-chain-report.md`*
- **D7. Denizli rooster statue:** an older photo shows a taller rooster, so the statue may have been replaced. Confirm before its photo request goes out. *`flickr-permission-shortlist.csv`*

## 2. Things only you can do

- **A1. Push to the live site.** Many commits since 7 Oct are local only. Say "push it" (or push from Terminal) once you have looked at them.
- **A2. Send the Flickr permission requests:** 11 photos marked "ready to ask". Message: `flickr-request-message.md`; record each answer in the row. *`flickr-permission-shortlist.csv`*
- **A3. Plausible analytics signup** (backlog 29): the script is already on every page.
- **A4. Google Cloud check for the landmark pin pass:** APIs & Services > Geocoding API > Metrics, then say "October geocoding is near zero". The pass waits on it. *`RESUME_landmark-pin-pass.md`*
- **A5. Partnerize:** open the new account and apply to the Expedia (US) and Hostelworld campaigns (decided 2026-10-05), if not done yet. *`hotel-resourcing-plan-2026-10-01.md`*
- **A6. Bing Webmaster Tools** (backlog 28), about 10 minutes.
- **A7. Launch day:** delete the noindex line in `netlify.toml`, push, set up Google Search Console and submit the sitemap; then the monthly Search Console check (backlog 33).

## 3. Say "go" and it gets done

- **G1. Recheck The Cock and Bottle** (London, Notting Hill): was reopening by 3 Oct, now overdue. *`hood-picks-bar-conflicts.md`*
- **G2. Hood picks batch 5** (cities 101 to 125 of 393). *`RESUME_hood-picks.md`*
- **G3. Flickr shortlist: prepare the next 25 landmarks.**
- **G4. Batch 1 chain check, part 2:** page-check the 181 "weak evidence" picks (usually duplicate map records).
- **G5. Re-run the DiscoverCars coverage check** right before the car links go live. *`discovercars-coverage-2026-10-05.md`*

## 4. Waiting on someone else

- **W1. DiscoverCars account approval:** then deep links for the 31 places with no landing page.
- **W2. Expedia / Partnerize approval:** then the hotel re-sourcing plan can be built.
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
- **28.** Bing Webmaster Tools (see A6)
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
