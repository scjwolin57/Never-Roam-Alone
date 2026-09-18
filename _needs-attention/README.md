# Needs attention

Files with open work in them, gathered here on 7 August 2026. Nothing was
deleted or edited — these were only moved. None of them are used by the live
site, so moving them broke nothing.

## Waiting on a decision from you

| File | What it needs | Moved from |
|---|---|---|
| `cull_review.md` | Review 1,595 autocomplete-list rows proposed for deletion, before anything is deleted. Nothing has been removed yet. Careful: the remove lists include places that have guides (Hurghada, Bodrum, Krabi, Phuket, Cozumel) | project root |
| `city-hero-photos-still-need-attention.md` (+ `city-hero-photo-audit-2026-08-25.xlsx`) | All 893 heroes are in. Two items left: Ibiza's hero has no credit link, and your call on Naha's Shuri Castle photo (the castle burned in 2019). Move both files to `_done/` once settled | project root |

## Done — moved to `_done/` (15 September 2026)

| File | Why it's closed |
|---|---|
| `_done/roamer-review-questions.md` | Trimmed 24 -> 16; the chosen questions are live in `city.html` |
| `_done/local-interview-questions.md` | Trimmed 31 -> 15; the chosen questions are live in `city.html` |
| `_done/transport-pilot-review.md` | Format was approved and rolled out — `city-routes.js` now carries all **893** cities with substantive route data (verified 2026-09-16) |
| `_done/css-consolidation-flags.md` | Record of the finished `master.css` rollout across all 23 pages, every page PASS |

Nothing was deleted, only moved. `master.css` points at the new path.

## Done — moved to `_done/` (18 September 2026)

| File | Why it's closed |
|---|---|
| `_done/food-unverified.md` | All 55 items closed 2026-09-15 (commit `1510bbd2`); the "OPEN ITEMS" heading was never updated |
| `_done/performance-audit-2026-08-07.md` | Every item approved and done; fonts are self-hosted |
| `_done/RESUME_citybuild.md` | Superseded: the site reached 893 cities, fixed by the 2026-09-02 decision |
| `_done/RESUME_gym-research.md` | Gym research complete, 893/893 (2026-09-17); the file holds the full batch log |
| `_done/concurrent-session-collision-2026-09-17.md` | The swept-up deletion was restored, then landed deliberately in `6fc184c7` |
| `_done/catC-visual-review.csv`, `catD-visual-review.csv`, `landmark-photos-needing-attention.csv`, `landmark-photos-subject-audit.csv`, `landmark-photos-wrong-country.csv`, `landmark-photos-wrong-subject.csv`, `portrait-landmark-photos.csv`, `portrait-landmark-replacements.csv` | Superseded by the 2026-09-05 eye review of all 7,404 landmark photos (`95c44e41`). The 11 wrong-country rows still live are name-match false alarms. **Two catC "WRONG" photos are still live and carried over below** |
| `_done/review-pages/` (18 `review-*.html`) | Click-through pages for choosing landmark photos; their job was absorbed by the same review. Their links to `uploads/` no longer resolve from the new folder |

## Unfinished work and research backlog

| File | What it needs | Moved from |
|---|---|---|
| `hood-photo-provenance-audit.md` | **Most urgent.** At least 15 of 19 "wrong district" photos are still live (e.g. Porto/Baixa shows Porto Alegre, Brazil; Verona/Centro Storico shows Lazise). 5 broken source links and 52 judgement calls not re-checked | project root |
| `hood-photo-location-audit.md` | 21 of 22 photos shot more than 2 km from their neighborhood still live; some are false alarms (Henderson is a separate city) | project root |
| (carried over from catC) | Two landmark photos flagged WRONG and still live: Puerto Natales' Cementerio Municipal (shows a villa) and La Romana's Central Romana Sugar Mill (shows a church) | `_done/catC-visual-review.csv` |
| `neighborhoods-needing-photos.md` | Down from 52 to 4 with no photo at all: Heraklion's Poros and Mastampas, Medina's Al Aqeeq, Punta Cana's El Cortecito. Bolognina's photo has no credit | project root |
| `landmarks-needing-photos.csv`, `missing-landmark-photos-2026-09-02.csv` | The lists overlap; use the site-wide figure instead: 562 of 8,927 landmarks have no photo (2026-09-18) | project root |
| `flickr-permission-shortlist.csv` | 427 permission requests not yet sent; would cover 121 landmarks with no photo | project root |
| `coords-needing-review.csv` | 2,942 landmark coordinates never checked: 779 "not in OSM, 5 km+ from the other landmarks", 2,163 "not in OSM (unverifiable)". The 695 "OSM disagrees" rows are done | `_guidebuild/` |
| `hood-geo-unresolved.md` | 175 of 4,053 neighborhoods without coordinates, so they are left out of the Find dropdown. Fix is a Maps pin per row | 2026-09-17 |
| `beaches-under-mapped.md` | 41 coastal cities whose Beaches score may be too low; low priority | 2026-09-16 |
| `transit-popups-notes.md` | The 145-city rollout is done (`city-routes.js` has all 893). What's left: 146 "double-check at publish" notes on services that come and go | project root |
| `suggested-improvements.md` | Your general improvement backlog | project root |
| `decisions.md` | Not a to-do: the decision log every session reads first | 2026-09-16 |

## One orphan worth a look

- `orphan-story-page.html` — a finished "Never Roam Alone — Story" page that was
  found among the junk files. There is no `story.html` on the site and nothing
  links to it, so it appears to have been dropped at some point. Kept here in
  case you want it back; delete it if you don't.

## Root clutter (cleared 7 August 2026)

Deleted: 21 `.fuse_hidden*` orphan file copies, `logo.svg.bak` (byte-identical
to `neverroamalone-logo.svg`), the `_to_delete/` folder, and seven
`_batch3_*.py` scratch scripts whose output is already live in
`city-landmarks.js`. All of it was committed to git beforehand, so every deleted
file can be recovered with `git checkout HEAD~ -- <filename>`.

`missing_landmark_photos.xlsx` was kept, in the project root where it was.
