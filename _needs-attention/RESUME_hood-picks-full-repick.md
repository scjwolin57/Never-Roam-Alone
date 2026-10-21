# Resume: hood picks full re-pick from saved Google results (FR), started 2026-10-21

Jeff (2026-10-21): "yes, re-pick the 202 cities from the saved results in batches of 25, judging and logging each venue, coffee and bakery first".

## Rules (fixed at the start)
- Venues only from the saved Google results (`cands/`); 0 Google calls (the trial credit is used up).
- Every venue judged and logged on its own; a chain rejection needs the outlet count or home city and the URL; earlier vague or grouped skips count for nothing (`FR_BRIEF.md`).
- Pipeline per batch: pickers (5) -> `fr.py post <n>` (gate, address re-test, check_picks, namecheck) -> independent checkers -> follow-up picker for slots a checker reopens -> full fresh audit -> bar safety (phase 2) -> `load_picks.py stage / apply / parity`, `check_sheet_parity.py` 0 -> commit sheet and citydata by path. Not pushed unless Jeff says.
- Browser: agents never close the tab named "seed" (closing the last tab closes the pane).

## Plan
`_guidebuild/hoodpicks/work/fr_plan.json`: phase 1 = 145 cities, 511 coffee/bakery slots (batches 1-6); phase 2 = 190 cities, 1,557 slots of the other kinds (batches 7-14). Order: visitors (scope412.json), then the rest. Excluded: Chicago, Washington D.C., Bogotá, Panama City, Rio (done in the RP pass, commit 53d23102).
Deferred: Miami (citydata/miami.json held by another live session on 2026-10-21); add it to a later batch once free.

## Resume
`python3 _guidebuild/hoodpicks/fr.py todo <n>` builds batch n; picks files land in `work/fr<n>/`. A batch is done when its commit exists ("Hood picks full re-pick batch <n>").

## Log

- **Batch 1 (2026-10-21), phase 1, Dubai to Jeddah (24 cities; Miami deferred):** 88 open coffee/bakery slots -> 25 picks -> gate/address re-test 24 (Le Gout: East Hollywood) -> checkers 22 (Aungku and Queeze fixed; Fornalia dropped: outlets uncountable; La Baguette dropped: Woodlands hotel bakery) -> full audit 22/22 (NITAN note narrowed) -> loaded 22 in 15 cities, parity 0. Reopened for the phase-1 follow-up: Cairo Zamalek bakery, Pattaya Naklua bakery (work/fr1/reopened.json).

- **Batch 3 (2026-10-21), phase 1, Manila to Sao Paulo (25 cities):** 143 open coffee/bakery slots -> 74 picks -> gate 74 -> checkers 69 (fixes: Cafe Nostalgie, CAPSULE MONSTER note, MARUMI COFFEE STAND, Goodness Gracious note; dropped Timinn and Dulce de Leche (another listed hood), Black Sheep Bagel (sandwiches), Taj A Sweet (uncountable), Toto by chichi (matcha cafe)) -> full audit 69/69 (CoffeeToBe renamed) -> loaded 69, parity 0. Same brand twice for G2g: My Coffee Porto (Ribeira, Baixa), Hygge (Reykjavik).

- **Batch 4 (2026-10-21), phase 1, Santiago to Thessaloniki (25 cities):** 149 slots -> 72 picks -> gate 70 -> checkers 55 (fixes: Puelo, ITALBROT note, Cookie York note; dropped for another district (Seline, Coffee Space, Cadets de Gascogne), uncountable chains (Cafe Vanille), delivery-only (Rendas), bistro (Abba), empty page (La Boulangerie), Panaderia Blanca again (name unsettled), Facebook login walls) -> audit 50 (Honest Chocolate: chocolate not baking; Cafe Botanist note fixed; 4 Facebook walls) -> loaded 50 in 17 cities, parity 0. Facebook-blocked picks saved for one browser re-check: work/fr_fb_hold.json (10). For Jeff: Puelo and Metissage are Vitacura venues shown under Las Condes (reading A allows it).

- **Batch 5 (2026-10-21), phase 1, Tunis to Pula (25 cities):** 145 slots -> 56 picks -> gate 55 -> checkers 54 (Tintin The Cafe renamed; St. Jakob Beck dropped: Zurich-West hood point sits in Albisrieden, about 2.5 km from the real Zurich-West, logged for Jeff) -> audit 54/54 (6 names romanised to the site convention, Latin first or pinyin with the script in brackets) -> loaded 54, parity 0. atadanbakery.com (Izmir) carries hidden text aimed at AI readers; ignored, pick kept. Same brand: AROMAT is the bakery pick in 3 Warsaw hoods.

- **Batch 6 (2026-10-21), phase 1, last 20 cities:** 47 slots -> 14 picks -> gate 14 -> checkers 14 (Sultongue renamed) -> audit 14 (Kamakura Mushinan renamed) -> loaded 14, parity 0.
- **Facebook re-check (2026-10-21):** the 10 held picks all went straight to the login page (www and m.); they stay off. Facebook now blocks every read, so a venue whose only page is Facebook counts as no page from here on.

- **Batch 7 (2026-10-21), phase 2, Hong Kong to Ho Chi Minh City (24 cities; Miami deferred):** 239 eat/takeaway/bar slots -> 24 picks (Celestial Court held for Jeff: hotel Cantonese as local, TODO G2f) -> gate 23 -> checkers 20 (Linga Longa Bar renamed; dropped Mod Kaew (no cheap signal), MASSO (outside Adliya, not an edge candidate), Bandiera (fine on price level only)) -> audit 20/20 -> safety 5/5 ok -> loaded 20, parity 0. Phase 2 yield is about 1 pick per 10 slots: old skips for these kinds were mostly sound.

- **Batch 2 (2026-10-21), phase 1, Valletta to Riyadh (25 cities):** 104 slots -> 38 picks (Dolce Ragusa held for Jeff) -> gate 37 -> checkers 33 (one checker stalled twice and was replaced; dropped Rahat (another listed hood), Stella (No. 73 shop unclear), IDMI (outlets uncountable); 219 note blanked) -> audit 28 (Obakoy outside its hood; Furansu Gashi 16-ku romanised; 4 Facebook-only picks unverified) -> loaded 28, parity 0. For Jeff: Forn Can Bufi is the bakery in two Ibiza hoods; Congusto (ice cream) was not loaded.

- **Batch 8 (2026-10-21), phase 2, Las Vegas to Heraklion (25 cities):** 377 slots -> 41 picks -> gate 39 -> checkers 35 (fixes: Naftilos, The Ravenous Pig Brewing Co.; dropped Garp & Fuss, Granny's Cuisine, Forty Fishes, P.Burger & Tacos) -> audit 31 (dropped Chuck Trailer's (cocktail list), La Belle Patate (chain from Victoria), Paradise Club (chain from HCMC), UKIYO (second site)) -> safety 19 ok, OQ Club pending (stage shows unexplained) -> loaded 30, parity 0. Two stale browser tabs closed to free the tab limit.

- **Batch 9 (2026-10-21), phase 2, Palma to Rhodes (25 cities):** 417 slots -> 58 picks -> gate 58 -> checkers 53 (fixes: Diamond Slice, Jardin Hospice; dropped Dar Naji (Rabat branches), Marmorata (tasting room), Delatribu (coffee not takeaway), Cafe Batavia (modern take), Casa Del Sol (beach bar)) -> audit 51 (fixes: Vatandar, Backroom On Fifth note, Delano note; dropped Thai Pavilion (Taj chain uncounted), Jardin (checker and auditor disagreed on its name)) -> safety 27 ok, M8 held (Bunny mafia highlight unseen) -> loaded 50, parity 0. For Jeff: RÊU Dining sits in Tra Que village, inside An Bang Beach's search area.

- **Batch 10 (2026-10-21), phase 2, Buenos Aires to Lima (25 cities):** 529 slots -> 110 picks (The Glory Hole Cafe held for Jeff: crude name) -> gate 105 (2 rejected; Restaurant Ramsey and Akihisa Handa below the review bar) -> checkers 102 (fixes: The Boston Sail Loft, Bingo Drinkery, Hi Asia, Lailac Corner, Sizzle, Club Sueco; dropped Cafe Bonjour, Keste (closed to 27/10), Ciak Bar (site down)) -> audit 102/102 (Discos Monterey renamed; SKY J note trimmed) -> safety 51 ok, The Flight Park dropped (inside the airport terminal) -> loaded 101, parity 0.

- **Batch 13 (2026-10-21), phase 2, Accra to Taichung (25 cities):** 280 slots -> 31 picks -> gate 30 (1 rejected) -> checkers 30/30 (fixes: Imena recorded single; notes trimmed for Niaozhong, Akatsuki, Kamakura Kitahashi) -> audit 29 (Meigetsugawa recorded as a 2-outlet Kita-Kamakura chain; Pab 82 renamed Pub 82; dropped Niaozhong Diji Shao (site refuses connections)) -> safety 8/8 ok -> loaded 29, parity 0.

- **Batch 12 (2026-10-21), phase 2, Cologne to Zurich (25 cities):** 150 gated picks -> checkers 141 (fixes: Chatto Chicken 3-outlet Nagoya chain, Oborozuki, Starka note, Irish Pub na Miodowej, Juliette, Mutekiro 7-outlet Yokohama chain, Tomyumbar 2-outlet Tashkent chain; dropped Tasca laska for Soho (inside El Perchel-Ensanche), Hasta La Tambora (lounge, not party), Hani Cafechi (calls itself fine dining), Hacienda Real (Guatemalan chain), La Bodega Italiana (empty page), Torburg (music pub, not party), Six Seven (fine dining, not local), George and Dragon (cocktails, not dive); HELD for Jeff: Dick's Drive-In (Seattle-born, 10 drive-ins + 2 food trucks: local chain or national fallback?)) -> audit 139 (Gallery 20.5 note, Unau Okafuji, DanBam, Colonial renamed; dropped Petrin Couchette (seated cafe, not takeaway), Takumi (branch of an uncounted chain)) -> safety 57/57 ok -> loaded 139, parity 0.

- **Batch 14 (2026-10-21), phase 2, Cadiz to Wurzburg (15 cities, the last):** 97 slots -> 8 picks -> gate 8 -> checker 8/8 -> audit 7 (dropped Humble Pie Kitchen: a bakery that also sells to take away) -> safety 2/2 ok (Sugar House Pub: liquor violations Nov 2024, reopened under new owners May 2025; kept, flagged for Jeff) -> loaded 7, parity 0.
