# Resume note — gym pass research (started 2026-09-17)

**Goal:** for every one of the 893 cities, list gyms a traveler can use without a
membership, tied to the city's neighborhoods, shown in the city page's "Find laundry
& gyms" modal and on the hotel card. Definition and refinements are in
`decisions.md` (rows dated 2026-09-17); do not widen or narrow them.

## State
- Done: the 25 most-visited cities (pilot), loaded and committed. 163 gyms.
- Done: batch 2, 25 more cities (Vatican City, Vienna, Athens, Manama, Hanoi,
  Denpasar, Cancún, Miami, Ho Chi Minh City, Las Vegas, Dublin, Venice, Orlando,
  Florence, Karbala, Kyoto, Shanghai, Doha, Abu Dhabi, Cairo, Lisbon,
  Pattaya-Chonburi, Marne-la-Vallée, Punta Cana, Hurghada), loaded and committed
  (`7eb10c76`). 90 gyms.
- Remaining: 843 cities. Work highest-visitors-first, 25 cities per batch.
- Order list: `node -e` over `destinations.js` sorted by `visitors` desc, skipping
  any city whose `citydata/<slug>.json` already has a `gyms` key.
- Gotcha hit in batch 2: research subagents sometimes delegate to further
  sub-agents instead of doing the research themselves and return early with
  nothing written — check the scratch folder has all 5 files per group before
  trusting a group's "done" report; resume any that skipped straight to
  delegating with an explicit "do this yourself, no further sub-agents"
  message.
- Gotcha: `load_gyms.py` rejects any entry (including free/calisthenics ones)
  whose `src` doesn't start with `http` — a prose citation like "OpenStreetMap
  (leisure=fitness_station)" fails the whole city's file. Fix by turning it
  into a real URL (e.g. `https://www.openstreetmap.org/node/<id>` or
  `https://www.openstreetmap.org/#map=19/<lat>/<lng>`) before loading, not by
  dropping the entry.

## How a batch runs
1. Split the 25 cities into 5 groups of 5 and give each group to one research agent
   with the brief below (verbatim, city list swapped in). Agents write one JSON file
   per city into a scratch folder, nothing into the repo.
2. Load: `python3 _guidebuild/gyms/load_gyms.py <folder> --dry` (read the rejects),
   then without `--dry`. This writes the `gyms` key into citydata by character span,
   converts prices to USD at the day's rate, ties each gym to the nearest placed
   neighborhood within 1.5 km (`hood_geo`), and appends the Gyms tab in
   `NRA-MASTER.xlsx` (idempotent per city).
3. Verify one city of the batch in the browser (card + modal), then commit by path:
   `git add citydata/<the 25 files> NRA-MASTER.xlsx` — never `git add -A`.
4. Keep a running count in the commit message: cities done / remaining / gyms / empty.

## The agent brief (use as-is)
Research gyms for the Never Roam Alone travel site (repo at
/Users/jeffreywolinsky/AI Projects/never-roam-alone) for these cities: <5 cities with
slugs>. For each city find gyms a traveler can pay to use WITHOUT a membership: day,
multi-day or week pass, prices where published. Aim for 4–8 per city spread across
the five neighborhoods in citydata/<slug>.json (`hoods`, `hood_geo`). Counts:
commercial gyms/studios; chains with a country-wide pass price (mark chain:true);
hotel gyms only if the page says non-guests can buy a pass; public sports centres
with a casual entry fee; free outdoor calisthenics parks (free:true, no pass; source
OSM leisure=fitness_station or a council page); a free trial day pass counts (loc 0).
Excludes: membership-only, aggregator-only with no pass info, anything unsourced.
Honesty: never invent or estimate a price; record only what a page states, in local
currency with its code; pass exists but unpriced → {"loc": null}; a dated local guide
is acceptable when the gym's own site has no price (say so in "note"); nothing found
→ empty array. Coordinates: geocode the address with GOOGLE_MAPS_API_KEY read from
the repo .env (never print or write the key), Nominatim as fallback (1 req/s, UA
header). Search in the local language when English finds nothing. Budget ≈12
searches/fetches per city. Output one file per city, <scratch>/<slug>.json, a JSON
array of {"n","kind":"gym|studio|public|hotel|calisthenics","addr","lat","lng",
"chain","free","pass":{"day":{"loc","cur"},"multi":{"label","loc","cur"},
"week":{"loc","cur"}},"src","asof":"YYYY-MM","note"} — omit pass keys that do not
exist, omit "pass" for free entries. Reply with a table: city, gyms found, with a
published day price, and why any city is empty. Do not paste the JSON.

## Known traps
- MacFit, Fitness Time, Gold's Gym (JP/US) and Jetts sit behind bot walls: exclude,
  do not bypass, note it.
- Anytime Fitness prices per branch in Japan (chain:false there); in most other
  countries it publishes no paid pass (exclude).
- A "locality" geocode at 0 km from the city centre is Google returning the city;
  the loader does not check this, the geocoder does.
- The neighborhoods with no `hood_geo` (175, listed in hood-geo-unresolved.md) never
  get gyms tied to them; those gyms fall under "Anywhere in the city", which is fine.
