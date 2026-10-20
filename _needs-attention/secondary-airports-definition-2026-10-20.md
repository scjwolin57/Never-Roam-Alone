# Other airports in the airport popup: definition (2026-10-20)

**Approved by Jeff 2026-10-20:** "1. approve 2. layout A 3. 200km limit 4. show est". Research runs in step 2.

**Your ask (2026-10-20):** the airport popup should give a city's other airports
(FLL for Miami, Gatwick / Stansted / Luton for London) the same facts it gives the
main one. Nothing is researched until you approve this definition (CLAUDE.md §4.1
rule 3, §5.3).

## What is there today

- `citydata/<slug>.json` → `airport` describes the main airport only:
  `{name, km, drive, rentals[], carService, taxi, ride{avail,cost}, transit[{m,c}], note?, taxiEst?}`.
  Sheet: Live Cities columns 54 to 62 (Airport, Airport Distance (km), ... Airport Transit Options).
- `transport.air` is a list of airport names. The popup ends with
  "Figures shown for <main>. Other airports: <the rest>."
- Counted by IATA code (a string compare over-counts, because the same airport is
  often written two ways): **198 guides name 228 other-airport entries**
  (`_guidebuild/airports/airports_tool.py candidates`, 8 batches of 25 guides).
- 17 of the 224 are described in the data as "limited", "charter only" or
  "no scheduled commercial flights" (Battambang, Nakhon Ratchasima, Oxford, Ica, ...).
  11 have no IATA code in the text.

## Proposed definition

### 1. Which airports qualify

An airport gets a full block only if **all three** hold:

1. It is already in that guide's `transport.air` list (no new airports are hunted for).
2. It has **scheduled passenger flights now**, checked on the airport's own site or
   its current timetable. Charter-only, closed or "no scheduled flights" airports
   do not qualify.
3. It is **within 200 km by road** of the city centre (the same reach as a day trip).

An airport that fails 2 is removed from `transport.air` and logged (a data fix, not
padding). One that fails only 3 stays named in the foot line, with no block.

### 2. Key shape (citydata)

New optional key **`airports2`**: a list, in the order of `transport.air`, each item
exactly the shape of `airport`, so one renderer serves both:

```json
"airports2": [
  {"name": "Fort Lauderdale–Hollywood International (FLL)", "code": "FLL",
   "km": 45, "drive": "35–60 min",
   "rentals": ["Alamo", "Avis", "Budget", "Enterprise", "Hertz", "National", "Sixt"],
   "carService": 90, "taxi": 85,
   "ride": {"avail": "yes", "cost": 55},
   "transit": [{"m": "Tri-Rail from FLL station to Miami Airport, then Metrorail (75 min)", "c": 3}]}
]
```
*(Values above are placeholders to show the shape, not researched figures.)*

| Field | Unit / rule | Source rule (same as the main airport) |
|---|---|---|
| `name` | Official name + IATA code in brackets | Airport's own site |
| `code` | IATA code, 3 letters (new; lets the scripts match names reliably) | IATA / airport site |
| `km` | Road km, airport to the city's own centre (not to the main airport) | Google Maps or OSM route |
| `drive` | Typical drive time range, "35–60 min" | Same route, normal traffic |
| `rentals` | Companies with a counter or shuttle at that airport | Airport's car rental page |
| `carService` | USD, one-way, sedan, to the city centre | Operator price, a booking site, or dated press |
| `taxi` | USD, one-way, to the city centre | Airport / city flat-fare table, or a published fare |
| `taxiEst` | Text, only when `taxi` is worked out, not quoted: the tariff, the km and "not from a quoted fare" | Official tariff × `km` (the rule the 5 existing `taxiEst` cities use) |
| `ride` | `avail`: yes / limited / no at that airport; `cost`: USD typical fare to the centre | App's airport page or the airport's ride-share page |
| `transit` | List of `{m: mode + time, c: USD fare, 0 = free}` to the city centre | Operator's own site |
| `note` | Optional, one short line (e.g. "mainly low-cost and seasonal flights") | |

Money in USD with the conversion rate and checked date kept in the sheet (below).
A field that cannot be sourced is left out, never guessed; the popup already hides
an empty row.

### 3. Sheet: a new tab "Other Airports"

One row per airport (the Bikes & Scooters pattern), because a city can have 0 to 3:

`City | Country | Order | Airport | IATA | Distance (km) | Drive Time | Rental Companies |
Car Service $ | Taxi $ | Taxi Estimate Basis | Rideshare | Rideshare $ | Transit Options |
Note | Sources | FX Rate Used | Checked`

- The tab is the source of truth. A script (`_guidebuild/airports/airports_tool.py apply`)
  writes `airports2` into citydata from the tab, through `sheet_write.py` `TabRows` on the
  sheet side. Never hand-edited in two places.
- `check_sheet_parity.py` gains an "Other Airports tab" check against `airports2`.
- `Sources` and `Checked` stay in the sheet only (site shows the figures, like the main airport).

### 4. How city.html shows it (buildAirportModal, around line 4737)

The current block becomes a function used once per airport. Two layouts; I recommend **A**.

- **A. Airport switcher (recommended).** When a guide has a block for more than one
  airport, a row of square chips at the top of the popup, one per airport by code
  ("MIA · FLL", "LHR · LGW · STN · LTN"); the main airport is selected first, and
  each chip swaps in that airport's block. Keeps the popup short on a 320 px phone.
- **B. Stacked.** Each airport's block under the previous one with a divider. Simpler,
  but London becomes four screens long on a phone.

Either way:
- The official taxi colour and fare line and the ride-share app buttons are city facts,
  so they show under every airport where they apply (ride-share buttons only where
  `ride.avail` is not "no").
- A taxi fare with `taxiEst` shows "est." beside it, with the basis behind an info icon.
  (Today the 5 main-airport `taxiEst` notes are in the data but **not shown** on the page;
  this would label them too. Say if you want that fix kept separate.)
- The foot line lists only the airports with no block: "Also nearby: <name> (no details yet)."
  It disappears when every listed airport has a block.

### 5. Everything else §5.3 needs (in step 2, same commits)

CLAUDE.md §5.1 inventory row and "as of" line; `CITY_SCHEMA.md` and `example-city.json`;
`add_city.py` (keeps `airports2` from the research JSON) and `add_city_to_sheet.py`
(writes the tab rows); the add-city skill (new cities research their other airports
at add time); a memory note; the commit subject names the section.

### 6. How step 2 runs

Batches of 25 guides, alphabetical; each airport checked against the rules above;
sheet first, then `apply`, then `check_sheet_parity.py` to 0, then commit; a resume
note in `_needs-attention/RESUME_other-airports.md`. Search quota is checked before
each batch. About 224 airports at roughly 4 to 6 searches each.

**Note:** another session (airport transfer affiliate) is working on the same popup
today. Step 2's city.html change waits until that session has committed, so the two
do not overwrite each other.

## Questions for you

1. **Approve the definition?** (key `airports2`, the "Other Airports" tab, the three
   qualifying rules)
2. **Layout A (switcher chips) or B (stacked)?**
3. **200 km limit** right, or a different reach?
4. **Show "est." on taxi estimates**, including the 5 main airports that already have one?
