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


### Amended 2026-09-22 (decisions.md 2026-09-22, after the batch-1 funnel review)
1. Quality bar: rating 4.2 first; a kind with no 4.2 candidate in a hood falls back to the city's median rating for the section and takes the top weighted-rating venue above it (sheet column `bar`: standard / median). Reviews: 100 / 25 as before, and 25 everywhere for `dive` and `party`.
2. Second source: chooses between candidates and supplies the note; never eliminates. Google's open listing in the hood is the proof of existence. No source = blank note.
3. Kinds: `fine` = expensive price level or guide listing; `takeaway` = any counter-service food eaten on the go; `bakery` includes pastry, churro and dessert shops; `local` = the city's own everyday traditional food.
4. Chains: detected by the script (same name at 2+ points in the city's cache, or Overture brand); agents no longer count outlets; unmarked = single venue.
5. Bar safety: its own pass; unsearched bars are held (`safety: pending`), never skipped.
6. Neighbor-hood pick: an empty kind may take a spare qualifying venue from another hood within 1.5 km, stored as `near` (source hood index) and flagged on the card. Needs the §5.3 change protocol (schema, example, add_city, sheet column, skill, inventory) before load.
Batch 1 is re-picked from the existing cache (zero Google calls); the 301 verified picks stay, only empty slots are re-picked. Script changes needed first in `fetch_rank.py` / `check_picks.py`: median fallback, dive/party review bar, chain marking, `near` candidates, kind rules.

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

## Before batch 1: DONE 2026-09-21 (one commit)
Schema rows (`eat`, `cafes`, `bars` with `pid`), `example-city.json`, `add_city.py`, `add_city_to_sheet.py` (mirrors picks into the tab),
the add-city SKILL.md, the CLAUDE.md 5.1 inventory, `_guidebuild/check_schema_drift.py`, city.html map links (`query_place_id` when a pick has `pid`),
`hoodpicks/check_picks.py`, `hoodpicks/fetch_rank.py` (per-kind gap search by Text Search, per-month counter, credit tracker, stop on any Google error),
`hoodpicks/load_picks.py` (seed / stage / apply / parity), the brief. The "Hood Picks" tab is seeded with the 409 existing bars (baseline rows).
`_guidebuild/` is gitignored, so those scripts are on disk only.

### Tools and files (all in `_guidebuild/hoodpicks/` unless noted)
| Step | Command |
|---|---|
| Scope, most-visited first | `scope412.json` (from `destinations.js`, 412 cities, 1,913 mapped hoods) |
| 1 Candidates | `fetch_rank.py fetch <slugs>`, then `fetch_rank.py gaps <slugs>` (per-kind Text Search), writes `cands/<slug>_candidates.json` |
| 2 Script checks | `check_picks.py picks <workdir>`; `check_picks.py baseline <slugs>` for cities with existing bars |
| 6 Sheet, then site | `load_picks.py stage <workdir>` (needs `<slug>_final.json`), `load_picks.py apply <slugs>`, `load_picks.py parity` |
| Calls and credit | `fetch_rank.py status` |
Work dir per batch: `work/batchNN/` (`<slug>_picks.json` from pick agents, `<slug>_checks.json` from the checker, `<slug>_final.json` after merge).
Not applied yet: the 1.2 km radius for whole-town and beach-strip hoods (decisions.md 2026-09-21); Indian dry-state cities (`DRY_SLUGS` in `fetch_rank.py`).
Open: destinations.js and citydata disagree on visitors for 741 cities (`visitors-destinations-vs-citydata.md`); the run uses destinations.js.
Console check of September's Places count could not be made from here; the counter (72) is used.

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
  **UNLOCKED 2026-09-21: Jeff confirmed the free trial is linked to the never-roam-alone project.** The run may
  use the credit after the free allowance, until the credit or the trial (2026-10-30) ends; then gate 3.
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
| 1 (25 cities, Hong Kong to Taipei) | hong-kong bangkok macau singapore london paris dubai new-york mecca istanbul tokyo antalya seoul osaka rome phuket kuala-lumpur barcelona amsterdam medina milan los-angeles prague madrid taipei | **NOT LOADED** (audit failed; see below) | 1,190 | 437 proposed by pick agents, 258 survive the checks (50 more held) | 932 | 129 of 437 (88 WRONG, 41 UNVERIFIED) | **6 of 26 (23%)** | 702 (72 pilot + 702 = 774 for September) |

### Batch 1 status: picks are staged on disk in `_guidebuild/hoodpicks/work/batch01/`, NOT in the sheet or citydata
Per this note (step 5), one audit defect means the whole batch is checked again before commit. The audit found 6 defects in 26: four local chains not
disclosed in the note (Pan Lee Bakery, Blend & Grind, Taverna El Glop, Turgut Kebab), one `local` that is really casual (26 Beach), one hood-boundary call (Signature,
Siam / Ratchathewi). The search budget (~200 for the session) also ran out during the independent check, so the checkers could not run the bar scam searches.
Nothing was loaded: the sheet's Hood Picks tab has only the 409 baseline bars and no citydata file has `eat` or `cafes`.

**What is on disk:** `cands/` (candidates), `cache/` (Google responses, kept: the re-check needs them), `work/batch01/` per city: `_picks.json` (437), `_checks.json` (verdicts),
`_final.json` (258 that passed the checker; bars and all of Amsterdam removed), `held.json` (50: 29 bar picks whose scam search was not run + 21 Amsterdam), `_dropped.json`, `audit_*.json`.
**Amsterdam is held:** two hood points are wrong (`hood-picks-amsterdam-hood-points.md`); it needs a new point from Jeff or a re-geocode, then a fresh fetch (~28 calls).

**Next session, first task (fresh search budget), in this order:**
1. Re-check all 258 finals with the tightened rules now in `PILOT_BRIEF.md` (rules 10-12: outlets counted from the venue's own branch page, two or more = "; local chain" in the note; `local` = traditional only; hood by address).
   Fix by editing the note (append "; local chain", keep 90 characters) or dropping the pick; never keep a pick whose outlet count cannot be found. Reclassify 26 Beach as `casual`.
2. Run the bar scam / overcharging search for the 29 held bars (each bar: search "<name> <city> overcharge scam" plus recent reviews) and release those that pass.
3. New 10% audit from scratch (fresh agent, no reasoning shared). If it is clean, `check_picks.py picks`, `load_picks.py stage`, `load_picks.py apply <slugs>`, `parity`, city.html preview on one city with a `pid` pick (verify the map link carries `query_place_id`), commit by path.
4. Only then batch 2 (cities 26-50 in `scope412.json`).

**Lessons for the pipeline (apply from batch 2):**
- The ~200-search budget is shared by every agent in a session and is spent by the pick agents alone. Do picks in one session and the independent check + audit in the next, or split a batch into two half-batches.
- WebFetch on the venue's own site is not capped the same way and is the main second source; keep searches for articles, chain counts and bar scam checks.
- 129 of 437 picks (30%) failed the checker, mostly hood-boundary (adjacent district), undisclosed chains and wrong kind. The tightened brief should cut that.


### Batch 1 re-pick, 2026-09-22 (rules of decisions.md 2026-09-22): STAGED, NOT LOADED
- Cache reused, no Google calls for the re-pick itself; 53 calls to re-fetch 10 hoods whose map point was wrong (`hood-points-batch1.md`). Counter: 845 of September's 1,000.
- Re-pick of the 509 empty slots: 471 picks by 5 agents → independent check (5 agents, no search) 459 confirmed → bar safety pass (121 bars, 4 fail) → first fresh 10% audit: **5 defects in 46** (2 kind, 3 hood) → full re-check: kind of all 95 dive/local picks (38 refiled or dropped), hood fit of all 216 picks whose address does not name the hood (94 out), 10 hood points re-placed and their 63 slots re-picked and re-checked → second fresh 10% audit: **5 defects in 35** (1 kind, 4 hood on the sub-district question).
- Result on disk: `work/batch01r/final/<slug>_final.json`, **641 picks** (301 kept from the first run + 340 new), `check_picks.py` clean, `load_picks.py stage --dry` = 641 rows, 0 baseline clashes. 6 neighbor-hood picks, 146 blank notes, 1 median-bar pick.
- Fill per section (slots / baseline bars / new): eat 360 / 0 / 265 (74%), cafes 360 / 0 / 253 (70%), bars 470 / 251 / 123 (80%). Total 75%. Empty by design: dive (12 filled; Google's "bar" type rarely matches a cheap dive), party, cocktail in cities whose baseline already holds them.
- **Third fresh 10% audit (2026-09-22, under Jeff's hood-fit reading A): 3 defects in 29 (10%)**: one unsupported note claim (blanked), a cocktail bar filed as `party` and a dessert cafe filed as `takeaway` (both dropped). No wrong venue, no wrong neighborhood. **Stop condition reached** (an audit still finds defects after the full re-check): 638 picks stay staged; Jeff decides in `hood-picks-batch1-load.md`. Medina remapped by hood name to its new 3-hood list (bac06bdb); the sheet's Hood Picks tab is untouched.
- **Hood points (2026-09-22):** all 4,033 placed points checked site-wide before any further Google spend; 314 moved, 38 for Jeff (`hood-points-site-check.md`). Batch 1's ten were part of it. Pre-flight for every batch: `hoodpoint_check.py`.
- **LOADED 2026-09-22 (option B done):** kind pass on 267 party/takeaway/bakery/coffee picks (223 keep, 2 refiled, 42 dropped), fourth fresh 10% audit 1 defect in 23 (a global chain the list missed; fixed for the whole batch by script), then `load_picks.py stage` (595 rows), `apply` (25 cities), `parity` 0 mismatches. 595 picks with place IDs are live in citydata plus the 251 baseline bars. Medina's Hood Picks rows re-numbered by hood name after its hood list shrank.
- Batch 2 next: run `hoodpoint_check.py` on its 25 cities first (all points already checked site-wide), then the pipeline with REPICK_BRIEF + KINDPASS definitions. (hood-fit-definition.md is resolved: reading A) (which reading of "in the hood"). Then: one more fresh 10% audit under that reading → `load_picks.py stage work/batch01r/final` → `apply` → `parity` → browser check of a `near` flag → commit.
- Lessons for batch 2: run `hoodpoint_check.py` first; the REPICK brief (second source never eliminates, script chains, looser kinds) holds; `dive` needs a definition Google's types can serve or the kind will stay mostly empty; a local-cuisine venue may fill `casual` once `local` is taken (added to the brief).

### Batch 1 gap pass, 2026-09-22 (Jeff: "yes, do 1, 3 and 4 on batch 1"): LOADED
- Cause breakdown of the 385 empty slots after the first load: 51% offered candidates the agents rejected (kind collisions, hotel venues, adjacent districts, one venue already holding a kind), 29% venues in the hood but none tagged for the kind by Google, 8% hoods never searched (no point), 7% no result at 800 m, 5% neighbor-only.
- Item 4: Shinjuku, Patong and Muratpaşa points placed from OpenStreetMap place nodes (Belek stays unplaced: 35 km out, a day trip). Item 3: `gap_fill.py search` ran one Text Search per empty slot plus Nearby for the 3 new hoods: 359 calls, 833 candidates added, merged into `cands/` by `gap_fill.py merge` (the base responses were deleted after the first load, so rank output is unioned in). Item 1: `GAPPICK_BRIEF.md`: the agent classifies the kind from the venue's page across the whole hood pool (`kind_by: "page"`, accepted by `check_picks.py`; the nearest-point `near` heuristic is waived for such picks because the checker judges hood fit from the address).
- 350 slots offered → 159 picks (5 agents) → script check (11 fixed) → 5 independent checkers (`GAPCHECK_BRIEF.md`, 21 wrong: 10 fixed in place, 12 dropped, 2 global chains dropped and added to the list) → bar safety (32 bars, 1 fail) → audit 1: 2 in 14 (kinds resting on pages nobody could load; both dropped, batch swept) → audit 2: 3 in 13 (Dotonbori is Namba by the site's own text: 3 Shinsaibashi picks dropped; a padded note trimmed; address-vs-other-hood-description sweep: Mecca Clock Tower venues moved or dropped) → audit 3: 2 in 12 (hotel lounge as party, wine bar as dive; both dropped) → kind re-check of all 15 dive/party picks (3 dropped) → audit 4: 1 in 10 (a note contradicted by its source, blanked) → load.
- **Loaded: 131 new picks** (sheet rows appended per slot, `apply` 25 cities, parity 0 mismatches). Batch 1 now: 983 of 1,212 slots (81%; the slot count grew by 22 with the three new hoods): eat 86%, cafes 75%, bars 82%; 726 picks carry a place ID; 13 neighbor-hood picks. Still empty by kind: takeaway 60, dive 37, fine 26, party 25 (see the lessons).
- Lessons: (a) 57 of the loaded 131 were classified from Google's type and the name because the venue's page would not load, and most audit defects came from that group: for batch 2, a pick with no loadable page and a kind that needs evidence (fine, party, dive, takeaway) should be skipped, not judged from the name. (b) Hood fit must also be checked against the OTHER hoods' descriptions (Dotonbori/Namba, Clock Tower/Al Shubaikah); `gap_fill.py` could do this by script. (c) The 20-result Nearby cap is the root cause of thin pools; paginating to 60 (item 2, not approved) would help fine/takeaway most. (d) Google calls: 1,193 in September; $7.72 of the trial credit spent.

## Counts
| Cities done | Remaining | Picks loaded | Blank slots | Places calls used |
|---|---|---|---|---|
| 1 (25 cities loaded 2026-09-22, gap pass same day) | 387 | 726 new + 251 baseline bars = 983 of 1,212 slots (81%) | 0 mismatches | 1,193 (September; free allowance 1,000; credit spent $7.72 of $260; $40/1,000 past the allowance) |

### Low-defect pilot, 2026-09-23 (hood-picks-low-defect-plan.md; decisions.md 2026-09-23): LOADED
Five of batch 2's cities (Vatican City, Las Vegas, Lisbon, Hanoi, Ho Chi Minh City), 210 empty slots, from the cache, **0 Google calls**.
Pipeline now: `annotate.py` (chain detector, big brands removed, name and hotel flags) → pick agents (CHECKLIST.md) → `gate.py` → `namecheck.py` → independent checker → fresh audit of every confirmed pick → bar safety search → `merge_pilot.py` → `load_picks.py stage / apply / parity`.
| Round | Picks | Checker wrong | Audit wrong (of confirmed) |
|---|---|---|---|
| 1 | 104 | 28 (27%) | not run |
| 2 | 87 | 10 (11%) | 3 of 73 (4%), fixed |
| Empty-slot re-pick | 35 | 4 (1 caused by the gate cutting a note; gate fixed) | 2 of 34 (1 fixed, 1 dropped) |
**Loaded: 105 picks** (Vatican City 15, Las Vegas 22, Lisbon 28, Hanoi 20, Ho Chi Minh City 20) = 105 of 210 slots (50%); plus the 20 baseline bars, untouched. Every loaded pick was confirmed by a checker and then by a fresh auditor; 7 were corrected after a check or audit (names, a chain count, a cut note, a blanked note). Bars: 38 safety-searched, 1 fail (The Balcony Beer, not loaded). Parity 0 mismatches.
Still empty: 105 slots, mostly no loadable page, chain limits, strict hood edges, and Summerlin (Las Vegas) with no candidates at all.
Next: the other 20 cities of batch 2 through the same pipeline (their batch-2 picks and checks are in `work/batch02r/`; re-pick from the cache).
