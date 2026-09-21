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
10. **GetYourGuide: link first, verify by sampling** (Jeff, 2026-09-21; replaces the per-entry lookup). GetYourGuide's partner API needs 100,000 monthly visits for even its Basic level, so it is not available to a site that has not launched. Do NOT spend web searches checking whether each entry is listed. Instead every kept entry gets a search deep link, built mechanically: `gyg: "https://www.getyourguide.com/s/?q=<entry name, URL-encoded>"` (Jeff's partner ID is appended site-side once his affiliate account is approved; never invent one). A search page with no results is a soft failure, not a broken link. `_needs-attention/daytrips-not-on-getyourguide.md` is filled only from spot checks: at most 5 entries per batch, chosen from the most obscure, checked with one `site:getyourguide.com` search each, plus anything Jeff reports. The search budget stays on the facts that matter: real place, country, distance, not a guide city.
11. **Removed guide cities become "Nearby guides"** (Jeff, 2026-09-21). When rule 7 removes an entry because it is another Never Roam Alone city, record the pair in the city's `nearby` key: `[{"city":"<guide city, exact destinations.js name>","tier":"half|full"}]`. city.html will show these under the day trips as links to that city's own guide. No research needed: the pair is already identified. Building the page section follows the change protocol (CLAUDE.md §5.3).
12. **Cities with no day trips are researched from GetYourGuide** (Jeff, 2026-09-21; he wrote "getmyguide.com", meaning getyourguide.com). For a city with none, or left with none after rules 7-9, open GetYourGuide's own page for that city (a fetch or two per city, no API) to see what it sells as day trips from there, then verify each candidate against rules 1-9 like any other entry (real place, outside the city, within the time limits, no flights, not a guide city). GetYourGuide is the lead and the link, not the proof of distance or facts. Nothing is added to reach a count; a city with no honest day trip stays empty. 228 cities had none on 2026-09-16.

**Batch 1 (147 entries, d37693a0) was checked under rules 1-6 only.** Re-check it against rules 7-10 before starting batch 2.

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
