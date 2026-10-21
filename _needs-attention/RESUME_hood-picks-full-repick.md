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
