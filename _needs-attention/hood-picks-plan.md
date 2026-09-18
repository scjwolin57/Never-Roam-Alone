# Plan: Where to eat, Coffee & takeaway, Where to drink (all 893 cities)

*Drafted 2026-09-18. Nothing collected yet. Decisions for Jeff are at the bottom (D1 to D8).*

## What exists today

| Section | Key | Kinds the page already renders | Cities with data |
|---|---|---|---|
| Where to eat | `eat` | local traditional / casual / fine | 0 / 893 |
| Coffee & takeaway | `cafes` | coffee / takeaway / bakery | 0 / 893 |
| Where to drink | `bars` | dive / party / cocktail / pub (alcohol-free: cafe / hangout / mocktail) | 40 / 893 (409 venues) |

- 893 cities, 4,053 neighborhoods. Up to 3 picks per section per hood means up to **about 36,000 venues**.
- 175 hoods have no coordinates (`hood-geo-unresolved.md`); some of those are day trips listed as hoods (El Tatio Geysers, Salar de Atacama).
- `eat` and `cafes` are not in `CITY_SCHEMA.md`, `add_city.py` or the sheet yet.

## What the bars pass taught us (`_guidebuild/BARS_RUNBOOK.md`)

- Web-search research, then a separate fact-check agent, still shipped **about 8% bad venues** (34 of 431).
- A stricter check that required a street address found more, including venues already marked CONFIRMED.
- The failures: closed venues, **the right venue in the wrong neighborhood** (the most common one), wrong names, venues that were never bars, and tourist traps or hostess bars.
- The web-search cap (about 200 per session) covered about 25 cities of research *or* one check round. At that rate 36,000 venues is not realistic.

**Conclusion:** the same method at 90x the size would ship around 2,800 bad entries. The method has to change: **candidates come from a real business database, never from an agent's memory or a search snippet**, and the checks that failed before (still open, which neighborhood, what kind of place) are done **by a script, not by judgement**.

## The method

### Step 1. Write the definitions first (rulebook §4.1.3)
Add to `CITY_SCHEMA.md` and get approval before collecting anything:
- Every kind in plain words, with the Google place type(s) that support it. Examples: fine dining = `fine_dining_restaurant` or a published tasting menu or a Michelin/equivalent listing; bakery = `bakery`; takeaway = `meal_takeaway` / `fast_food_restaurant` that is local, not a global chain; cocktail = `cocktail_bar` or a cocktail menu on its own site.
- The quality bar (D3).
- What counts as "in the neighborhood" (Step 3).
- The one-line note rule: written from a source (the venue's own site or menu, or dated press), factual, at most 90 characters, no prices, no superlatives.
- The safety rule, carried over from bars: no hostess or go-go venues, and no venues with repeated recent reports of overcharging, forced fees or drink spiking.

### Step 2. Candidates from Google Places, not from memory
For each hood and section, one Google Places Nearby Search around the hood's point, filtered to that section's place types. It returns real businesses with: a permanent place ID, open or closed status, address, coordinates, types, rating, review count, price level and website.
- An agent can only **choose from this list**, so a made-up venue cannot get in.
- The place ID is stored, so every later check and the map link point to that exact venue, not a text search that can open a different branch.

### Step 3. Script checks, no judgement (a new `_guidebuild/hoodpicks/check_picks.py`)
A pick fails automatically if any of these is true:
1. Status is not `OPERATIONAL` (closed temporarily or permanently).
2. **Wrong neighborhood.** It is outside the hood's boundary where OpenStreetMap has one, otherwise more than the agreed distance from the hood point (D4), or its Google address names a *different* hood of the same city.
3. Its place type does not match the kind claimed (for example a restaurant filed as a cocktail bar).
4. It is below the quality bar (D3).
5. It is a global chain (D5).
6. The same place ID appears twice in the city (one café-bakery listed under two sections or two hoods).
7. The kind is not allowed there (an alcohol kind in a dry city, or an alcohol-free kind where a normal bar exists).

### Step 4. Second source and the note (agent)
For each pick that passes the script: open the venue's own website or active social page, or a dated press article (within the last 18 months), confirm it matches, and write the note from that source. The source URL is kept.
- No second source means **unverified**, and it is left out. Google alone is one source (rulebook §4.3: two sources, or one primary).
- A safety screen from recent reviews and press, asked for explicitly (in the bars pass it never came up unprompted).

### Step 5. Independent check (a separate agent that has not seen Step 4's reasoning)
It gets the name, kind, hood, address, note and source for each pick and returns CONFIRMED / WRONG / UNVERIFIED per venue. Anything not CONFIRMED is removed or replaced from the Step 2 list, then checked again.

### Step 6. Random audit before each commit
A third fresh agent re-checks a random 10% of the batch from scratch. **If it finds even one defect, the whole batch is checked again** before commit. The defect rate per batch goes in the commit body and the resume note.

### Step 7. Sheet first, then the site (rulebook §3.5, §4.5)
- A new **"Hood Picks" tab** in NRA-MASTER.xlsx, one row per venue: city, country, hood #, hood name, section, kind, name, note, place ID, address, lat, lng, source URL, as-of date, check verdict.
- A loader script (modelled on `gyms/load_gyms.py`) writes `eat`, `cafes` and `bars` into `citydata/` from the sheet. Nothing is hand-edited in citydata. A parity check runs before every commit.

### Step 8. Honest gaps
- A hood with no qualifying venue for a kind gets no pick. A section with none at all is hidden, as the page does today.
- Day-trip "hoods" and hoods with no coordinates are not researched until they have a pin. They are listed in the resume note.
- Small towns will often have no fine dining or cocktail bar. That is correct, not a gap to fill.

## The 40 cities that already have bars
Their bars are the baseline (rulebook §4.5: newer does not beat verified). They go through the Step 3 script checks only. Anything that fails goes to a needs-attention note with both values; nothing is overwritten silently. That includes the 43 venues the runbook lists as never address-checked, plus the known gaps: Vatican Borgo, Miami Wynwood party pick, Taipei Shilin.

## Order of work
1. **Definitions + schema change protocol (§5.3)** in one commit: `CITY_SCHEMA.md`, `example-city.json`, `add_city.py`, `add_city_to_sheet.py`, `extend_citydata.py`, add-city `SKILL.md`, the §5.1 inventory, and `check_schema_drift.py`. The map links move to place IDs in the same commit.
2. **Pilot: 5 very different cities, all three sections.** Pilot cities (swapped 2026-09-18 for complete map points, Jeff: "replace a city with something similar"): Lisbon (European, well mapped), Osaka (non-Latin script, dense, already has bars), Riyadh (dry), Essaouira (small town), Kampala (thin online coverage). Run: `python3 _guidebuild/hoodpicks/fetch_rank.py fetch lisbon osaka riyadh essaouira kampala`. **Blocked until Places API (New) is allowed on the server key.** You review them on the page, desktop and phone, before anything else runs. That is 25 hoods and up to 225 venues, enough to measure the real defect rate and cost.
3. **The 40 bar cities**, checked as above.
4. **Batches of 25 cities**, most-visited first, all three sections per city, so each city is finished in one go. Commit per batch. Running count in `_needs-attention/RESUME_hood-picks.md`. Autonomous once you approve the pilot.

## Cost estimate (Google's list prices checked 2026-09-18; estimate, not a quote)

| Item | Calls | List price | Estimate |
|---|---|---|---|
| Nearby Search, Enterprise tier (needed for rating, review count, website) | ~12,200 (4,053 hoods x 3 sections) | $35 per 1,000, first 1,000 a month free | **~$390** |
| Re-check of stored picks (status only), per run | ~36,000 | Place Details Pro, $17 per 1,000, first 5,000 free | ~$530 per run |

Web searches are only needed for Step 4 and the checks. Most second sources come from the venue website Google returns, so the 200-search cap stops being the limit. Batches will still be paced to it.

## Decisions for Jeff

- **D1. Use Google Places for candidates and checks?** About $390 once, plus optional re-checks. The alternative (web search only) is the method that shipped about 8% errors. *Recommended: yes.* The server key in `.env` would need Places API (New) enabled on it in Google Cloud, which you do yourself.
- **D2. Google's storage terms.** Google lets us keep place IDs permanently but limits how long other Places content (such as coordinates) may be stored. Recommended: the page stores our own name, kind and note plus the place ID, and the map link uses the place ID. Coordinates in the sheet would be for checking only, refreshed on each re-check. Please confirm you are happy with that reading, or want it checked further first.
- **D3. Quality bar.** Suggested: rating 4.2 or higher and at least 100 reviews in big cities, at least 25 in towns under 100K people, and at least one review in the last 6 months. Fine dining can use a guide listing (Michelin or national equivalent) instead of the review count.
- **D4. "In the neighborhood".** Suggested: inside the OpenStreetMap boundary where one exists, otherwise within 800 m of the hood point (1.2 km for hoods that are whole towns or beach strips).
- **D5. Chains.** Suggested: no global chains (Starbucks, McDonald's, Costa and the like) in any section. Local chains are allowed when they are what locals actually go to, recorded as a local chain.
- **D6. Picks per section.** Up to 3 (one per kind), as the page is built. The alternative is fewer, for a shorter hood card on phones. This affects cost and time roughly in proportion.
- **D7. Names in non-Latin scripts.** Suggested: the name the venue itself uses in Latin letters (on its sign, site or Google listing). Where there is none, the romanised name followed by the local script, for example `Sushi Dai (寿司大)`.
- **D8. Re-checks.** Closures are the most common defect and data goes stale. Suggested: a status-only re-check twice a year (~$530 each), with closures removed and logged. Or never, and accept drift.
