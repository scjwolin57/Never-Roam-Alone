# Resume: day-trip tour links to GetYourGuide place pages (started 2026-10-20)

**Why.** Jeff found the Miami guide's "Tours to Naples" link searched GetYourGuide for "Naples" and showed Naples, Italy.
Every trip link (3,124) was a name search. Jeff chose the slow full pass: each trip gets GetYourGuide's own page for
that place (`https://www.getyourguide.com/-l<id>/`), matched by name and country (decisions.md 2026-10-20).

**Done.** city.html accepts place links (adds `?partner_id=...` or `&partner_id=...`). Miami / Naples fixed by hand:
`/-l104274/` (Naples, Florida). Apply script: `_guidebuild/daytrips/apply_gyg_places.py` (day-trips.js + citydata
`daytrips` only; gyg is site-only, so no sheet write).

**Running.** A background loop in a Claude-in-Chrome tab on getyourguide.com in Jeff's Chrome (GetYourGuide blocks
scripted fetches and the built-in browser). One search every 8 s; on HTTP 429 it waits 10 minutes and retries.
Results are saved in that tab's `localStorage` (`nra_gyg_res`, keyed by trip index), so the loop can be restarted
from where it stopped. The trip list, by index, is `_guidebuild/daytrips/gyg_trips_2026-10-20.json` (also in the
tab's `localStorage` as `nra_trips`). Result lines:
`i|ok|<id>|<type>|<GetYourGuide name>|<which wording>`, `i|wrong|<name>|<country>|<type>`, `i|none|...`, `i|err`.

**To resume.**
1. In Jeff's Chrome (Claude in Chrome), on a getyourguide.com tab: `JSON.parse(localStorage.nra_gyg_res)` for
   progress. If the loop stopped (tab closed or reloaded), the matching code is in this session's transcript
   (2026-10-20); re-create it and call `crawl()`, which skips finished trips.
2. Export the results, join them to `gyg_trips_2026-10-20.json` by index into
   `[{city, len, name, s, id, gname, gtype, gc}]`, and run `apply_gyg_places.py <file> --cities "..."` in batches of
   about 25 cities. Commit each batch with the counts (ok / wrong / none / err) in the body.
3. Spot-check a few `ok` links per batch in Chrome (right place, tours listed). `wrong` removes the link,
   `none` keeps the name search.
4. When done: CLAUDE.md §5.1 day-trip row (gyg is now a place page where one exists), CITY_SCHEMA.md `gyg`,
   add_city.py `add_gyg_links` and daytrips/edit_trips.py (new trips still get a name search until resolved),
   memory note `daytrip-getyourguide-links`, then move this note to `_done/`.

**Status 2026-10-20 12:00:** loop started; GetYourGuide was rate-limiting after the first test burst (HTTP 429),
the loop is waiting it out. 0 of 3,124 resolved.

**Status 2026-10-20 22:05:** 1,974 of 3,124 resolved (1,139 ok, 189 wrong, 646 none), no rate-limit block since noon. Jeff: let the search finish before applying anything. The scheduled task's first run (12:28) is stuck on a permission prompt, so nothing has been applied yet.
