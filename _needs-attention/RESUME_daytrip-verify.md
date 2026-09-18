# Resume note: day-trip verification (started 2026-09-18)

Rule: decisions.md 2026-09-18. Verify all 3,795 day trips on the site (888 cities, 2,440 half + 1,355 full) before regenerating the sheet's Half/Full-Day Trips columns from `day-trips.js`.

## Checks per entry
1. Real place, the one meant (not a same-named place elsewhere).
2. `country` field correct.
3. Outside the city: not one of its neighborhoods, not one of its landmarks, not part of the urban area. A landmark and a day trip never share an entry: if a place is both, the entry that is wrong goes.
4. Reachable as a day trip: half about 75 min or less each way; full about 3 h or less each way (by the normal way a visitor goes).
5. Blurb factually right (no invented features, no wrong superlatives).
6. Not listed twice in the city.

Outcome per entry: `ok`, `fix` (field + source), `move` (half/full), `remove` (reason + source).

## Pipeline
- Step 1 (automatic): `_guidebuild/daytrips/check_daytrips.py geocode` (OpenStreetMap, cached) then `flags` → `flags.json`. Flags are leads, not verdicts.
- Step 2 (agents): batches of 25 cities; every entry researched, flagged ones first.
- Step 3: a separate agent re-checks every non-`ok` verdict and a random 10% of `ok`s.
- Step 4: apply to `day-trips.js`, run `extend_citydata.py` (parity must be exact), commit the batch.
- Step 5 (after all batches): regenerate the sheet's two day-trip columns from `day-trips.js` for all cities; parity check; commit.

## State
- Step 1 geocoding: running.
- Batches: 0 / ~36 done.

## Counts
| Done | Remaining | Fixed | Moved | Removed |
|---|---|---|---|---|
| 0 | 3,795 | 0 | 0 | 0 |
