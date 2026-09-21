# Resume note: Where to eat / Coffee & takeaway / Where to drink (started 2026-09-21)

*Read CLAUDE.md, then `decisions.md` (rows dated 2026-09-21 about hood picks), then this.
The full reasoning is in `hood-picks-plan.md`; where the two differ, THIS FILE wins.*

## Scope (Jeff, 2026-09-21)
- **412 cities** with 500,000 or more international visitors (`destinations.js` `visitors >= 0.5`), most-visited
  first, 25 cities per batch (17 batches: 16 x 25 + 12). Only neighborhoods with a `hood_geo` point (1,913).
- **All 10 kinds per neighborhood**, one pick per kind:
  - `eat`: `local` (traditional food of this city/country), `casual` (any other good sit-down restaurant),
    `fine` (tasting menu, or a Michelin/national-guide listing, or clearly the top price tier)
  - `cafes`: `coffee`, `takeaway` (counter or street-food style, eaten on the go), `bakery` (bakery or pastry)
  - `bars`: `dive`, `party`, `cocktail`, `pub` (pub, wine bar, beer bar, gastropub, casual bar).
    Dry places (Saudi Arabia, Kuwait, Iran, Brunei, Indian dry states, dry neighborhoods): `cafe`, `hangout`, `mocktail`.
- **A one-line note for every pick, written in the same pass. No note available = leave `d` blank** (never invent one).
- **Independent second check on every batch** (Step 5) plus the random audit (Step 6).
- **Runs autonomously, batch after batch, until the 412 are done or a stop condition below is hit.**

## Definitions (adopted 2026-09-21 from the plan's recommendations; Jeff may change them)
1. **Quality bar:** Google rating 4.2 or higher AND at least 100 reviews (cities over 100,000 people) or 25 (towns
   under 100,000). Fine dining may qualify on a Michelin or national-guide listing instead of the review count.
   (The plan's "a review in the last 6 months" is dropped: review dates cost an extra paid tier. Freshness is
   covered by Google's OPERATIONAL status plus a live second source.)
2. **"Best":** weighted rating W = n/(n+m)*R + m/(n+m)*C (C, m from the city's own candidates for that section),
   then Jeff's cross-check: if one of the top 5 of a kind appears in a qualifying article, pick the highest-ranked
   such one; otherwise the top of the rank order.
3. **In the neighborhood:** within 800 m of the hood point (1.2 km for hoods that are whole towns or beach strips),
   and Google's address must not name a different hood of the same city.
4. **Chains:** no global chains (Starbucks, McDonald's, Costa and the like) in any section. A local chain is
   allowed when it is what locals actually go to; say so in the note.
5. **Names:** the name the venue uses in Latin letters (sign, own site). If none, romanised name then local script
   in brackets, e.g. `Sushi Dai (寿司大)`.
6. **Note (`d`):** one factual clause, max 90 characters, written from the second source or the article; what it is
   and what it is known for. No prices, no superlatives unless the source says so. Blank when no source says
   anything usable.
7. **Safety:** no hostess or go-go venues; skip any venue with repeated recent (24 months) reports of overcharging,
   forced fees, drink spiking or tourist-trap pricing. Search for it explicitly for bars and nightlife.
8. **One venue once per city** (not in two sections or two hoods).
9. **Honest gaps:** a kind with no candidate that passes stays empty. Never stretch a candidate into another kind.

## Storage (Google's terms)
Store only: our name (from the venue's own source), kind, note, Google **place ID**, second-source URL, article
URL, as-of month. Do NOT store Google's rating, review count or address in citydata or the sheet (used once to
choose, then discarded). Map link: `https://www.google.com/maps/search/?api=1&query=<name, city>&query_place_id=<id>`.

## Pipeline per batch
1. **Candidates (Google Places Nearby Search, Enterprise fields, cached):** one search per hood per section
   (`fetch_rank.py`, 800 m, 20 results by popularity). Then **one per-kind search only where a kind has no
   qualifying candidate** (e.g. "cocktail bar" near the hood point). The pilot filled only 50% of slots with
   per-section searches alone, so the per-kind fill is expected on about half the slots.
2. **Script checks** (`check_picks.py`, to build first): status OPERATIONAL, distance/hood, primary type matches the
   kind, quality bar, global chain, duplicate place ID in the city, alcohol rules. Fails are dropped, no judgement.
3. **Pick agents** (5 cities each) using `PILOT_BRIEF.md` updated to these rules: classify from the venue's own
   site, article cross-check at city level, second source required, safety screen, note, output JSON.
4. **Independent check** (a separate agent that has not seen step 3's reasoning): CONFIRMED / WRONG / UNVERIFIED per
   pick. Not CONFIRMED = replaced from the candidate list or left blank, then checked again.
5. **Random audit:** a third fresh agent re-checks 10% of the batch from scratch. One defect = the whole batch is
   checked again before commit. Defect rate goes in the commit body and the batch log below.
6. **Sheet first, then site:** new "Hood Picks" tab (city, country, hood #, hood, section, kind, name, note, place
   ID, source URL, article URL, as-of, verdict); a loader writes `eat`, `cafes`, `bars` into citydata by span from
   the sheet. Parity check before every commit.
7. **Commit per batch, staged by path. Do not push** (a push is live). Jeff pushes, or says "push".

## Before batch 1 (one commit, CLAUDE.md §5.3 change protocol)
- `CITY_SCHEMA.md` rows for `eat` and `cafes` (new) and `bars` (updated to place IDs), `example-city.json`,
  `add_city.py`, `add_city_to_sheet.py`, add-city `SKILL.md`, the §5.1 inventory, `check_schema_drift.py`.
- city.html: pick map links use `query_place_id` when a pick has one (bars without one keep the text search).
- `check_picks.py`, the per-kind gap search in `fetch_rank.py`, the loader, and the updated brief.

## The 40 cities that already have bars
Their bars are the verified baseline (rulebook §4.5). Run the script checks on them; anything that fails goes to
`_needs-attention/hood-picks-bar-conflicts.md` with both values; nothing is overwritten. Fill eat, cafes and any
missing bar kind as normal.

## Budget gates (hard, enforced by the call counter in `fetch_rank.py`)
- Places calls used before this run: 72 (pilot). Free allowance: 1,000 Nearby Search Enterprise calls a month.
- **Gate 1 (now): free allowance only.** Stop at September's remaining ~928 calls, then October's 1,000.
- **Gate 2: the $281 trial credit (about 8,000 calls), only after Jeff confirms in Google Cloud that the
  never-roam-alone project is linked to the billing account that holds the trial credit.** Until he confirms,
  a call beyond the free allowance could bill a card instead. Trial ends 2026-10-30.
- **Gate 3: no out-of-pocket spend without Jeff's explicit yes.** Estimated total ~15,300 calls; free + credit by
  Oct 30 covers ~10,000. The rest either ~$190 at list price, or about 5-6 more months of free allowance.
- When a gate is reached: finish and commit the current batch, update this note, and stop. Say which gate.

- **The call counter is per month** (`{"2026-09": n, "2026-10": n}`), because the free allowance resets on the
  1st. The pilot's 72 are September's. Before batch 1, compare September's Nearby Search count in Google Cloud
  (APIs & Services > Places API (New) > Metrics) with the counter; if the console shows more, use the console figure.

## Stop conditions (write the batch log first)
Budget gate reached; web-search budget for the session exhausted (resume next session); any batch whose audit
still finds defects after a full re-check (stop and report to Jeff). Never work around a stop.
- **Google quota or billing error (Jeff, 2026-09-21):** any Google error (HTTP 429 quota, 403 billing or key,
  5xx) stops the run at once. The failed response is never cached and never read as "no results". The batch
  in progress is not committed with the missing searches treated as blanks: it is redone once Google answers
  again (the next day for a daily quota). Applies to the per-section search and the per-kind gap search alike.

## Pace: one batch per run
The web-search budget (~200 searches) is shared by every agent in one session (memory
`research-pass-gotchas-2026-09`), and a 25-city batch uses most of it. So the run goes one batch per session:
finish and commit a batch, update the logs below, then create a scheduled task that starts the next batch in a
fresh session about an hour later. The last batch deletes the schedule. If search runs out mid-batch, pick
agents write `_aborted` for the cities they could not finish, and the next run picks those cities up first.

## Google data kept on disk
The raw responses in `_guidebuild/hoodpicks/cache/` hold Google ratings and addresses. Delete a batch's cache
files once that batch is committed and audited. Only place IDs go into citydata and the sheet.

## Concurrency
City files are one line each. Do not run another data job on citydata while this runs (see HANDOFF-2026-09-21.md,
"Traps"). Stage by exact path; never `git add -A`.

## Batch log
| Batch | Cities | Commit | Slots | Filled | Blank | Checker overturned | Audit defects | Places calls |
|---|---|---|---|---|---|---|---|---|

## Counts
| Cities done | Remaining | Picks | Blank slots | Places calls used |
|---|---|---|---|---|
| 0 | 412 | 0 | 0 | 72 |
