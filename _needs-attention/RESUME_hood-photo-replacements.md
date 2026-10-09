# Resume: hood photo replacements (started 2026-10-09)

Jeff, 2026-10-09: "yes, remove them all now then replace in batches of 25". The 387 wrong-place photos are removed
(decisions.md 2026-10-09). 380 are on hoods still in a guide and need a replacement; the 7 on dropped hoods need none.

Queue: `hood-photo-replacements-queue.csv`, 380 rows in 16 batches of 25 (alphabetical by city). Set `status` to
`done` (with `new_file` and `evidence`) or `none` (no verified photo found, the hood keeps the "No photo yet" stand-in).

Rules for every replacement (CLAUDE.md §3.7, §4.3):
1. Location first: Commons file GPS within the hood (or within its boundary for a large hood), a Commons category
   that is the hood or a place inside it, or a Wikidata depicts item inside it. Never the file title alone. Check the
   same-name trap: the category must be in this city and country.
2. Licence permits commercial use (CC0, PD, CC BY, CC BY-SA). Watch freedom-of-panorama countries.
3. Eye check: landscape scene of the place; no portraits, watermarks, montages, flags, maps, posters, close-ups.
4. 3:4 crop, `images/hoods/<city-slug>--<hood-slug>.webp` at 1080x1440 and `-sm.webp` at 720x960.
5. Entry via `_guidebuild/add_hood_entry.py`; sheet Hood N Photo File / Photo Credit via `SheetEdit`;
   `check_sheet_parity.py` reads 0; commit the batch (staged by path), then the next.

Still open: the 8 "could not settle" photos in `hood-photo-collisions-2026-10-09.md` (Jeff to decide).

## Hood points found wrong during the replacements (not fixed here; for the hood-data task)

- Banff / Lake Louise Village: the hood point is in Banff town (Cascade Mall is 19 m away); Lake Louise village is about 57 km north-west. Photo left on the stand-in until the point is fixed.
- Carcassonne / La Cité (Walled Citadel): the hood point (43.2163, 2.3539) is by the station in the lower town; La Cité is about 1.4 km south-east (43.2066, 2.3637). The photo was verified by its subject (the château inside La Cité) instead.
