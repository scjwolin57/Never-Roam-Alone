# Sheet vs site: every discrepancy and where it came from (2026-09-19)

**Rule (Jeff, 2026-09-19):** the sheet is the master and is filled at research time. Where
earlier tasks changed the site without writing the sheet, the site's data fills the sheet.

**Method:** each city's record was rebuilt from the site (`citydata/*.json` plus
`city-scores.js`, `city-seasons.js`, `destinations.js`) and mapped onto the sheet columns
with `add_city_to_sheet.build_row` (the same mapping a new city uses), then compared cell by
cell with Live Cities (893 rows). Neighborhood fields were compared by hood name, not slot.
Each differing value was traced to the commit where it first appeared, on both sides
(12 sheet versions; every version of each city file; the deleted `NRA-MASTER.numbers`).

## Why the two copies drifted

1. **The sheet was loaded once, on 2026-07-26** ("update 600plus cities to live page"). Nearly
   every sheet-side value that differs today dates from that load.
2. **Four bulk commits, 2026-08-24 to 08-31** ("roamer connection and more", "heros updates and
   social section", "events tab on dest finder", "landmark modal"), rewrote hotels and trimmed
   neighborhoods in `citydata/` only. At the time the master was `NRA-MASTER.numbers`; it did not
   get those changes either (299 of 300 sampled hotels in it are the old sheet values). On
   2026-09-02 the .numbers file was deleted and the stale .xlsx became the master.
3. **No check blocks a commit** when the two copies disagree, so every later task fixed its own
   slice (27 day-trip cities, 23 repeat cities) and the rest resurfaced.

## A. The site changed later; the sheet is stale (fill the sheet from the site) — DONE 2026-09-19

Filled: 20,410 cells, log in `_done/sheet-fill-from-site-2026-09-19.csv`. After the fill, every
field in this group matches the site (hotels, vibe, description and landmark 4,029/4,029 hoods).

| Field | Cells / cities | Where the site value came from |
|---|---|---|
| Neighborhood hotels (high / mid / budget) | 3,975 differ; 475 removed on the site | Aug 24-31 bulk commits (3,953); Sept 18 hood fix (11) |
| Neighborhood lists | 130 cities (171 extra hoods in the sheet, 9 renamed, 4 added on the site) | Aug 24-31 bulk commits |
| Neighborhood vibe / description / landmark | ~90 | Aug 7 citydata split, Aug 24-31 commits |
| Areas to Avoid / Use Extra Caution wording | 192 cities | sheet text from Jul 26; site rewrote as coded tiers |
| Travel Advisory prose for Level 4 | 60 ("restricted or highly advised against" vs "Level 4: Do Not Travel") | Jul 26 sheet text |
| Landmark lists | 2 cities (Tozeur: El Ferdous Mosque; Şanlıurfa: Harran) | site removals |
| Avg high °F | 2 cities (Heraklion and Rhodes look swapped in the sheet) | Jul 26 sheet |
| Landmark photo columns (added today) | 9 cities differ | **my error:** filled from `city-landmark-photos.js`, but the page reads `citydata` `lmk_photos` |
| Food photo columns (added today) | 211 filled; the site has 7,055 across 893 cities | **my error:** filled from `city-food-photos.js` (25 cities); the page reads `citydata` `food_photos` |
| Transit Systems | 7 cities: sheet text is joined per character ("N · o ·  · f ...") | Jul 26 load defect |

## B. The sheet has information the site does not show — DECIDED 2026-09-19

Advisories Level 1-2: stay in the sheet only. Laundry ranges, emergency notes and Ulaanbaatar
events: copied to the site (commit after 95902e47).

| Field | Count | Note |
|---|---|---|
| Travel Advisory Level 1-2 | 738 | by design: the page shows Level 3-4 only |
| Emergency Notes | 23 (e.g. Amsterdam, Antalya) | never reached the site |
| Laundry Wash+Dry price ranges | 26 (e.g. "6.5-8.5") | `sync_laundry.py` drops ranges, so the page shows none |
| Seasonal events | 1 (Ulaanbaatar) | site season entry missing |

## C. Same meaning, different format (no action)

Stay "½" vs 0.5 (56); coded beer values vs prose like "n/a, alcohol banned" (43); "No passenger
rail service" vs an empty list (97 train/bus/ferry cells). Region matches `destinations.js` for
all 893.

## D. Pending by decision (do not touch yet)

Half-Day / Full-Day Trips: 970 cells differ. decisions.md (2026-09-18): the sheet's day-trip
columns are written only after the day-trip verification pass (batch 1 of 36 done).

## Proposed fix

1. Fill group A into the sheet from the site in one commit, logged cell by cell, parity to zero
   for those fields. Redo the landmark and food photo columns from `citydata`.
2. Group B: push the 23 emergency notes, 26 laundry ranges and Ulaanbaatar's events to the site?
3. Add `check_sheet_parity.py` (this comparison, as a script) and run it as a pre-commit check
   so a commit that changes one copy without the other fails.

## RETIRED 2026-09-23
Fix 3 is built (Jeff: "build check sheet parity and follow the plan"): `_guidebuild/check_sheet_parity.py` compares
every mirrored Live Cities column with the site for all 893 cities, using add_city_to_sheet.py's own row builder, plus
hero, hood, landmark and food photo columns. Accepted format conventions and sheet-only columns are listed in its
header. A warning-only pre-commit hook (`.githooks/pre-commit`, enabled with `git config core.hooksPath .githooks`)
runs it whenever a commit touches the sheet or the mirrored data. First run: 8,287 → 15 real differing cells after the
format conventions; fixed: the 6 landmark photos the site cleared on 2026-09-22 (sheet cells cleared, orphan files
deleted), Ulaanbaatar's "transit map" link (ubcab.mn, a taxi site) cleared, Nicosia's two photos with a broken "ul"
credit and no recorded source removed to the placeholder. Parity now 0.
