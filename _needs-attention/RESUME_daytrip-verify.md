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
10. **GetYourGuide: link first, verify by sampling** (Jeff, 2026-09-21; replaces the per-entry lookup, and supersedes the brief pause logged earlier the same session — the API needs 100,000 monthly visits, out of reach before launch). Do NOT spend web searches checking whether each entry is listed. Instead every kept entry gets a search deep link, built mechanically: `gyg: "https://www.getyourguide.com/s/?q=<entry name, URL-encoded>"` (Jeff's partner ID is appended site-side once his affiliate account is approved; never invent one). A search page with no results is a soft failure, not a broken link. `_needs-attention/daytrips-not-on-getyourguide.md` is filled only from spot checks: at most 5 entries per batch, chosen from the most obscure, checked with one `site:getyourguide.com` search each, plus anything Jeff reports. The search budget stays on the facts that matter: real place, country, distance, not a guide city.
11. **Removed guide cities become "Nearby guides"** (Jeff, 2026-09-21). When rule 7 removes an entry because it is another Never Roam Alone city, record the pair in the city's `nearby` key: `[{"city":"<guide city, exact destinations.js name>","tier":"half|full"}]`. city.html will show these under the day trips as links to that city's own guide. No research needed: the pair is already identified. Building the page section follows the change protocol (CLAUDE.md §5.3).
12. **Cities with no day trips are researched from GetYourGuide** (Jeff, 2026-09-21; he wrote "getmyguide.com", meaning getyourguide.com). For a city with none, or left with none after rules 7-9, open GetYourGuide's own page for that city (a fetch or two per city, no API) to see what it sells as day trips from there, then verify each candidate against rules 1-9 like any other entry (real place, outside the city, within the time limits, no flights, not a guide city). GetYourGuide is the lead and the link, not the proof of distance or facts. Nothing is added to reach a count; a city with no honest day trip stays empty. 228 cities had none on 2026-09-16.

**Batch 1 (147 entries, d37693a0) re-checked against rules 7, 9 and 11 on 2026-09-21 (rule 8 needed no new action: rule 4 already applied the same time limits to boats).** 45 entries across 22 of the 25 cities were confirmed same-place matches against `destinations.js` (by name + country/region, no search needed for the well-known matches) and removed; each removal recorded under the source city's new `nearby` key (`{"city","tier"}`). No flight mentions found in the remaining 99 entries. 3 entries had already been removed in the original pass, so batch 1 now has 99 kept of the original 147. The 99 kept entries still need `gyg` deep links added under the rule-10 rewrite above (not yet done).

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
| 2 | see git log | 144 | 69 | 40 | 5 | 30 | 2 of 82 |
| 3 | see git log | 144 | 79 | 21 | 6 | 23 | 0 of 57 |
| 4 | see git log | 144 | 77 | 22 | 6 | 27 | 2 of 62 |
| 5 | see git log | 136 | 74 | 33 | 8 | 21 | 0 of 69 |
| 6 | see git log | 128 | 82 | 20 | 8 | 18 | 0 of 54 |
| 7 | see git log | 120 | 61 | 18 | 8 | 33 | 0 of 65 |
| 8 | see git log | 128 | 54 | 15 | 4 | 55 | 0 of 79 |
| 9 | see git log | 123 | 65 | 16 | 6 | 36 | 0 of 64 |
| 10 | see git log | 121 | 64 | 9 | 6 | 42 | 0 of 63 |

All kept entries from batch 2 onward carry a mechanical `gyg` GetYourGuide search deep link per the rewritten rule 10. Nearby-guide links added to date: 14/14/12/12/13/15/12/17/14 for batches 2-10 (the apply script checks both `remove` and `fix` verdicts for `nearby_guide`).

Sofia's full-day list is now down to a single entry (Niš) after 7 of 8 full entries were removed as guide-city matches or over the 3h cap. Bologna's half list dropped to almost nothing too (4 of its entries were guide-city dupes). Beirut lost 6 of its cross-border entries (Israel/Syria: no crossings exist, guide-city matches, or Level-4 advisory zones in South Lebanon). Found and fixed a Romanian-diacritic spelling mismatch (Piteşti vs Pitești) between the researcher's and checker's output that blocked apply_verdicts.py -- not a data error, just an encoding variance to watch for.

Toronto, Manila, Melbourne and Auckland have empty `half` lists; Lyon has an empty `full` list; **Colombo, Dubrovnik, Siem Reap and Kigali now have ZERO day trips of either length** (rule 12: verified empty, not researched from GetYourGuide's city page yet). Kigali's case has extra complexity: much of its surroundings are active DRC conflict zone (M23 offensive, 2025-2026) — Jeff should weigh in on whether that changes the approach before it's researched. Kobe is down to zero on `half` and 1 on `full`. All correctly left as-is per the no-padding rule pending that research.

**Left for Jeff:** (1) Cusco's three iconic full-day trips (Machu Picchu ~3-4h, Rainbow Mountain, Humantay Lake) were kept `ok` even though they run past the "about 3 hours" cap, on the researcher's judgment that this is the universal way visitors do them — a policy exception to rule 4, not a one-off fact call, flagging before it sets precedent for other iconic far trips. (2) Montevideo's entire full-day list (9 entries, mostly unnamed Greater-Buenos-Aires suburbs with generic padded-sounding blurbs) was removed this batch — the researcher flagged the original list as looking fabricated/padded rather than researched, worth a look at how it got into the data, separate from this verification pass.

**Rule-12 backlog (cities needing GetYourGuide-page research for an empty list):** Colombo, Dubrovnik, Siem Reap (batch 8), Kigali (batch 10, conflict-zone caveat above) — to be done in a dedicated follow-up once more batches are through.

DAYTRIP_BRIEF.md's `len` warning is holding: batches 5-10 all had zero len-mismatch errors.

## Counts
| Done (cities) | Remaining (cities) | Fixed | Moved | Removed | Nearby links added |
|---|---|---|---|---|---|
| 250 (batches 1-10) | 638 | 70 | 244 | 333 | 175 |
