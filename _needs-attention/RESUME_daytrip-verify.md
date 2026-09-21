# Resume note: day-trip verification (started 2026-09-18)

Rule: decisions.md 2026-09-18. Verify all 3,795 day trips on the site (888 cities, 2,440 half + 1,355 full) before regenerating the sheet's Half/Full-Day Trips columns from `day-trips.js`.

## Checks per entry
1. Real place, the one meant (not a same-named place elsewhere).
2. `country` field correct.
3. Outside the city: not one of its neighborhoods, not one of its landmarks, not part of the urban area. A landmark and a day trip never share an entry: if a place is both, the entry that is wrong goes.
4. Reachable as a day trip: half about 75 min or less each way; full about 3 h or less each way (by the normal way a visitor goes).
5. Blurb factually right (no invented features, no wrong superlatives).
6. Not listed twice in the city.
7. **Not another Never Roam Alone city** (Jeff, 2026-09-21). A place that has its own guide in `destinations.js` is not a day trip: remove it, with the matching guide named in the reason. A name match is a lead, not a verdict (Tripoli in Lebanon is not Tripoli in Libya; "Victoria" is many places): confirm it is the same place first. An entry that *contains* a guide city ("Hangzhou & West Lake") is rewritten to the non-city part if that stands alone as a day trip (West Lake does not: it is in Hangzhou), otherwise removed. Step 1 flags both kinds: 584 exact and 65 partial name matches on 2026-09-21.
8. **Boat trips follow the same time limits** as any other trip: half about 75 min or less each way, full about 3 h or less, counted dock to dock plus the normal transfer. An island is not exempt for being an island.
9. **Flights are not an option.** A place that can only be reached as a day trip by flying is removed (18 entries mention a flight today: Abu Simbel from Aswan, Kaieteur Falls from Georgetown, Mount Yasur from Port Vila ...). If a road or boat route inside the time limits exists, keep it and rewrite the blurb without the flight.
10. **Listed on GetYourGuide.** Jeff plans GetYourGuide affiliate links for day trips, so each kept entry is looked up on getyourguide.com (the destination or an activity that goes there). Record `gyg: "<url>"` when found. When it is not listed, the entry is **kept and flagged for Jeff's review**, never removed for that reason alone: add it to `_needs-attention/daytrips-not-on-getyourguide.md` (city, day trip, half/full, what was searched). **PAUSED 2026-09-21: Jeff said "wait for affiliate program api" — do not look entries up on getyourguide.com until he says the API access is ready. Batches proceed on rules 1-9 and 11; rule 10 (and the GetYourGuide-sourced research in rule 12) resume once he confirms.**

Outcome per entry: `ok`, `fix` (field + source), `move` (half/full), `remove` (reason + source); plus `gyg` (URL, or "not listed" → review file).

11. **Removed guide cities become "Nearby guides"** (Jeff, 2026-09-21). When rule 7 removes an entry because it is another Never Roam Alone city, record the pair in the city's `nearby` key: `[{"city":"<guide city, exact destinations.js name>","tier":"half|full"}]`. city.html will show these under the day trips as links to that city's own guide. No research needed: the pair is already identified. Building the page section follows the change protocol (CLAUDE.md §5.3).
12. **Cities with no day trips are researched from GetYourGuide** (Jeff, 2026-09-21; he wrote "getmyguide.com", meaning getyourguide.com). For a city with none, or left with none after rules 7-9, look up what GetYourGuide sells as day trips from that city, then verify each candidate against rules 1-9 like any other entry (real place, outside the city, within the time limits, no flights, not a guide city). GetYourGuide is the lead and the link, not the proof of distance or facts. Nothing is added to reach a count; a city with no honest day trip stays empty. 228 cities had none on 2026-09-16. **PAUSED with rule 10** (2026-09-21): no GetYourGuide research until the affiliate API is ready.

**Batch 1 (147 entries, d37693a0) re-checked against rules 7, 9 and 11 on 2026-09-21 (rule 8 needed no new action: rule 4 already applied the same time limits to boats; rule 10/12 paused, see above).** 45 entries across 22 of the 25 cities were confirmed same-place matches against `destinations.js` (by name + country/region, no search needed for the well-known matches) and removed; each removal recorded under the source city's new `nearby` key (`{"city","tier"}`). No flight mentions found in the remaining 99 entries. 3 entries had already been removed in the original pass, so batch 1 now has 99 kept of the original 147.

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

**Diagnosed 2026-09-21: the scheduled task is not advancing.** It has fired only twice since 2026-09-18 (should be roughly hourly, ~72 times): a 3-second run on 2026-09-18 08:21 that made no batch progress, and a run started 2026-09-20 19:38 that is still shown "running" with no activity since 8 seconds after it started (3 tool calls: cd, read the resume note, a Bash check — then nothing). No stale `RUN_LOCK` file is blocking it now, and `_guidebuild/daytrips/batches/` holds no work past batch 1 and the 2026-09-18 aborted `b02_g*.nosearch.json` files. Left open for Jeff: the hung run needs stopping (`TaskStop`) and the scheduled task itself needs checking — it is not completing its cron-triggered sessions. This session worked batches manually instead of relying on it.

This session also found `_guidebuild/` is gitignored and does not exist inside the `claude/vibrant-gates-238a2a` worktree used for this task; the tooling (`daytrips/`, `hoods/apply_hood_fixes.py`) was copied into the worktree so the pipeline scripts run there without touching the base checkout. The scheduled task itself still runs in the base checkout path.

## Batch log
| Batch | Commit | Entries | ok | moved | fixed | removed | checker overturned |
|---|---|---|---|---|---|---|---|
| 1 | d37693a0 | 147 | 81 | 50 | 13 | 3 | 3 of 74 |
| 1 recheck (rules 7/9/11) | see git log | 144 checked | — | — | — | 45 | n/a (mechanical, no checker pass) |

## Counts
| Done (cities) | Remaining (cities) | Fixed | Moved | Removed | Nearby links added |
|---|---|---|---|---|---|
| 25 (batch 1) | 863 | 13 | 50 | 48 | 45 |
