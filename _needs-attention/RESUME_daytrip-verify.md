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
- Step 4: apply with `apply_verdicts.py` (day-trips.js + citydata together; citydata must equal day-trips.js for all cities), commit the batch.
- Step 5 (after all batches): regenerate the sheet's two day-trip columns from `day-trips.js` for all cities; parity check; commit.

## State
- Plan: `_guidebuild/daytrips/batches/plan.json` (35 batches of 25 by visitors, then batch 36 = the 29 cities from the neighborhood fix, incl. their 42 landmark clashes).
- Apply with `_guidebuild/daytrips/apply_verdicts.py <final.json>`: writes day-trips.js AND each city's citydata "daytrips" key. **Do not run extend_citydata.py** (stale catalogs; see sheet-site-hotel-parity.md).
- Step 1 geocoding: running in the background (OpenStreetMap, 1 request/s).

## Runs
Scheduled task `nra-daytrip-verify` (hourly at :22, created 2026-09-18) runs ONE batch per run, because the web-search budget (about 200) is shared by every agent in a session and ran out after batch 1 here. Batch 2 was started in this session and stopped when search ran out; its partial files are set aside as `*.nosearch.json` and it will be redone from scratch. Delete or disable the task to stop the pass.

## Batch log
| Batch | Commit | Entries | ok | moved | fixed | removed | checker overturned |
|---|---|---|---|---|---|---|---|
| 1 | d37693a0 | 147 | 81 | 50 | 13 | 3 | 3 of 74 |

## Counts
| Done | Remaining | Fixed | Moved | Removed |
|---|---|---|---|---|
| 147 | 3,648 | 13 | 50 | 3 |
