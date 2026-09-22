# Never Roam Alone — working rules for every session

*Approved by Jeff on 2026-09-17, from an audit of 92 past sessions (Claude Code and
Cowork), the commit history, the earlier CLAUDE.md, the memory notes and the
needs-attention folder. This file is the standing rulebook. Specific calls Jeff has
made live in `_needs-attention/decisions.md`; read that before proposing,
researching or re-opening anything. A copy of the universal sections is in
`~/.claude/CLAUDE.md` so Cowork and other projects follow them too.*

---

## 1. Who this is for and what it is

Jeff builds and runs Never Roam Alone (neverroamalone.com): free city guides for
893 cities in 197 countries, for every kind of traveler — individuals, couples,
families and groups. Solo-travel tips are one feature, not the focus. Never
describe the site as a solo-travel site.

Jeff is the sole owner, editor and deployer. He reviews in the browser, on
desktop and on his phone, and he researches hard cases himself (Google Maps pins,
photo links) and pastes them back.

## 2. How to read Jeff's requests

Jeff writes short, direct, lowercase messages, often with typos. Read for intent.
Never ask him to clarify spelling or grammar.

| When Jeff writes… | It means… |
|---|---|
| `on cities.html, …` / `city.html page: …` | The page named first is the only scope. Do not touch other pages unless the change is explicitly "sitewide". |
| A numbered or bulleted list of changes | Do every item, in that order, in one pass. Report against the same numbers. |
| `Change "X" to "Y"` | Y is final copy. Use it verbatim, including punctuation. Do not improve it. |
| `ex. Cluj Napoca …` | The example defines the standard. Apply it to every comparable case, not just the example. |
| A question: `why is…`, `what is the logic…`, `how are there…`, `is it safe to…` | Assess and report. Do not change anything until he says to. |
| `yes, …` + details | Approval for exactly what follows the comma, nothing more. |
| `go` / `start` / `proceed` / `continue` / `keep going` / `next batch` | Resume the last agreed plan under the last stated rules. No re-planning, no re-asking. |
| `continue until finished or I say stop` / `take as long as it takes` | Run to completion autonomously. Budget is not a reason to pause; quality is not to drop. |
| `commit this` / `push it` / `commit X and Y` | Stage only the named or task-owned files, commit, and (for push) push. Push means it goes live on Netlify. |
| `I have another task running` | Another session shares the working directory. Stage by path, never `-a`, and say what you left unstaged. |
| A pasted URL, error text or terminal output with no comment | Interpret it. A Maps link is a location fix; an error is a bug report; terminal output is evidence. |
| `let me see option B` / `can I preview` / `give me options` | He wants to see before committing. Render it in the preview, screenshot it, do not commit. |
| `is this complete?` / `is everything pushed?` / `progress report` | He has lost track of state. Answer with the status block in §9. |

### When Jeff's own change goes against the rulebook

Jeff initiates changes too, in chat or by editing in a parallel session. When a
request, or a change found in the working tree that is his, contradicts a rule in
this file or a row in `decisions.md`, do not silently comply and do not silently
correct it. Flag it for his manual review in one or two sentences: which rule or
decision it crosses, and what the consequence is (cost, data honesty, a copy that
will drift, a feature dropped on purpose). Then:

- If he confirms, do the work and add a row to `decisions.md` reversing or
  amending the earlier one, the same day.
- If the change is already in the tree and uncommitted, leave it exactly as it is
  and say so; never stage or revert another session's files.
- If he does not answer, the flag stands in the report's "Left open" line. It is
  never dropped because the change was his.

Two reversals of the same decision in a short time are a sign the rule itself is
wrong; say so and propose the rewrite.

## 3. Data rules (the ones he has repeated most)

1. **Nothing is ever invented, padded or stretched to fit.** A city with 9 good
   landmarks ships with 9. A dish with no verifiable venue is flagged, not filled.
   "My objective is to provide relevant information, not made-up stuff to fill a section."
2. **Verify, then flag or remove.** If a venue, hotel tier, photo subject or
   coordinate cannot be confirmed from a current source: find a verifiable
   replacement; if none exists, delete it and log it. Never leave a known-wrong
   entry live because the slot would otherwise be empty.
3. **Every figure has a source.** Money in USD, checked-date noted. Visitor
   figures are international, not domestic. Estimates are labelled as estimates
   in the data (e.g. `taxiEst`), never silently.
4. **Counts are live, never hard-coded.** City count (893), country count (197),
   event counts, etc. are read from the data at runtime. Do not type a number
   into copy.
5. **The sheet and the site move together.** NRA-MASTER.xlsx ("Live Cities") is
   the master. Any per-city data change on the site is mirrored to the sheet in
   the same task, and vice versa. Check parity before saying done.
6. **Per-city shape:** 5 neighborhoods, up to 10 landmarks (fewer is fine), one
   photo per slot with a real credit and a licence that permits commercial use.
   Day trips are not landmarks. A duplicate row is investigated field-by-field
   before deletion — the "duplicate" may hold the better data.
7. **Photos:** verify the *location*, not just the subject. A photo of Midtown is
   not a photo of Wynwood. Portrait photos go on a review list, not into a
   landscape slot. Watermarks, montages, flags, portraits of people and movie
   posters are never heroes.
8. **Small batches, verified, then the next.** For any pass over hundreds of
   cities: batch of ~25, verify every entry in the batch, commit the batch, then
   continue. "Get them right the first time" beats speed.
9. **Search quota:** check remaining budget before a research pass. If it runs
   out, schedule a resume task rather than stopping silently or guessing.

## 4. Research rules — new or existing features, places and statistics

These exist so that two passes, two files or two sessions can never disagree.
Every contradiction so far had one of four causes: two definitions of the same
number, two copies of the same fact, a newer pass overwriting a verified one, or
a decision made in chat and never written down.

### 4.1 Before any research starts

1. **Pin the entity.** City *and* country, in the canonical spelling from
   `destinations.js`. León (Nicaragua) is not León (Spain); Santa Cruz de la
   Sierra is in Bolivia. Check the alias list (Palma / Palma de Mallorca,
   Ulan Bator / Ulaanbaatar) so a second row is never created for a place that
   already exists.
2. **Read what is already there.** The sheet row, `citydata/<slug>.json`, the
   relevant catalog `.js`, memory notes, `_needs-attention/`, and the commit log
   for that city. Existing verified data is the baseline, not a blank slate.
3. **Read the definition.** Every statistic has exactly one written definition
   (in `CITY_SCHEMA.md` or its rubric: `STAY_RUBRIC.md`, `BEACH_NOTES.md`). If a
   number has no written definition yet, write the definition first and get it
   approved; do not collect values for an undefined metric.
4. **Check the decision log** (§4.5) for anything already decided about this
   item: a dropped city, a removed feature, a chosen threshold, a chosen vendor.

### 4.2 Statistics: one method for all 893

- **Every column carries:** name, unit, scale and direction, source type,
  as-of date, and method. All cities are scored by the same method. Changing
  the method means re-running the whole column in one commit, never mixing old
  and new values in one column.
- **Visitors** = international arrivals, millions per year. Never domestic,
  never total. The same figure feeds the homepage globe, finder cards and the
  top-visited page; a change lands in all three in one commit.
- **Money** is USD with the checked date and the conversion rate used. Cost
  thresholds (e.g. affordability cutoffs 110 / 180 / 270) are defined once, in
  code, and referenced, never retyped in copy.
- **0–100 scores** are either *curated* (anchored to a named published ranking,
  cited in the file header) or *computed* (by a script from stated inputs).
  A computed score is never hand-nudged in the sheet; a documented per-city
  override goes in the script so the next run keeps it.
- **Estimates are allowed only when labelled.** An estimate is derived by a
  stated formula from stated inputs, flagged in the data (`est: true`, a
  `taxiEst` note, a footnote), and never shown as a measured figure. "Roughly
  right and labelled" beats "blank", but "unlabelled guess" is never acceptable.
- **Ladders and tiers must be internally consistent.** Stay ranges ascend
  (scratch < leisurely < deeper < live-like-a-local). Hotel tiers are price
  bands checked on a current booking site against that city's own cost level;
  a property whose tier cannot be verified is replaced, not kept.
- **Format is uniform within a column.** If Religions shows "Catholic 33%",
  Languages shows "Spanish 92%". No bare names beside percentages, no prose in
  a numeric column, no lists joined per character.
- **Counts are derived, never typed.** 893 cities and 197 countries are read
  from the data wherever they appear.

### 4.3 Places: venues, landmarks, neighborhoods, day trips, photos

- **Source hierarchy, strongest first:** the place's own site or official
  tourism/government source → OpenStreetMap and Wikidata → reputable press with
  a date → dated user reviews (within 12 months) → templated aggregator sites.
  Aggregator-only is *unverified*, not verified. Two independent sources, or one
  primary source, before an entry is called confirmed.
- **Search in the local language and script** when English fails (長崎, طنجة,
  Čaršija). Confirm the hit is in the right city by reverse-geocoding or
  distance from the city centre. Compound names are matched whole; a fragment
  ("Memorial") that matches anything is rejected.
- **Coordinates:** after any change run `_guidebuild/check_landmark_coords.js`.
  Errors between 1 and 30 km are the ones the far-field checks miss; check them
  by reverse-geocoding the district. Large natural features and polygons are
  judged by overlap, not point distance.
- **A landmark is inside the city; anything outside is a day trip.** The two
  lists never overlap. `precise:false` marks the rare landmark that is genuinely
  far out (a reef, a park).
- **Chains** are recorded as "Multiple branches"; never assert one branch that
  cannot be verified. A **rename** is a rename (keep the entry, note the old
  name); a **closure** is a deletion with the source in the log.
- **Dishes and slots:** no dish ships with zero places; no slot is filled to
  make a count. A city with 9 landmarks has 9.
- **Photos:** verify *location*, not subject, using Commons categories, GPS or
  Wikidata, never the file title alone. Licence must allow commercial use
  (watch freedom-of-panorama countries). Credit format is fixed per source.
  Portrait, watermarked, montage, flag, poster and people-portrait images are
  never heroes.
- **Jeff's pins are final.** A pasted Google Maps link settles that item.
  Record it as "per Jeff's pin" with the date so no later pass re-opens it.

### 4.4 Features

- **Read the backlog first:** `_needs-attention/suggested-improvements.md`.
  Struck-through means done or dropped. A dropped feature (the finder's map
  view and share button, for example) is not re-proposed without saying it was
  dropped and why.
- **New idea research** (competitors, differentiators, engagement) is appended
  to that backlog with a date and source, never started as a new file.
- **A feature uses the existing column** for any statistic it needs. Never
  create a second column for the same concept (one walkability, one safety,
  one visitors).
- **Third-party choices** (map library, photo API, eSIM providers, email
  routing) are compared on the same date, and the pick *and* the rejected
  options are logged with the reason, so the comparison is not re-run later.
- **A feature that changes a number's meaning** (e.g. switching visitors to
  international) updates the definition in `CITY_SCHEMA.md` and every place the
  number appears, in one commit.

### 4.5 Recording, so contradictions cannot recur

- **One source of truth per fact.** The sheet for city data; `citydata/` and
  the catalog `.js` files mirror it through the scripts. Never hand-edit two
  copies separately. Parity is checked before "done".
- **Every research pass ends with a log** in the commit body: rows touched,
  rows untouched, old → new values, source and date, checks run. This is the
  convention the coordinate and food passes already use; it becomes mandatory.
- **A decision log** at `_needs-attention/decisions.md` (plus a memory note):
  every rule adopted in chat, threshold chosen, city or feature dropped,
  vendor picked. Written the same day, with the date and the reason.
- **Newer does not beat verified.** A re-verification pass that disagrees with
  an item confirmed by a primary source or by Jeff's pin does not overwrite it.
  Both values and both sources go to Jeff in a needs-attention note; he decides.
- **Disagreement between two files is a bug**, reported as such, and fixed by
  regenerating the copy from the source of truth, never by editing the copy.

## 5. Adding a city: every section city.html renders, and the change protocol

A city is "added" only when **every row of the inventory below** is either filled
with verified data or reported as open, by name, in the add-city report. The
tooling does not cover the whole page today (see 5.2), so until it does the
add-city skill runs the extra steps by hand and says which ones it ran.

### 5.1 Inventory of city.html (as of 2026-09-22, hood picks: a pick may be a flagged neighbor-hood pick via `near`)

Nine plates. "Key" is the field in `citydata/<slug>.json` unless noted; "Filled by"
is what populates it for a new city *today*.

| Plate / section | What it shows | Key(s) | Filled by today |
|---|---|---|---|
| Hero | name, country, tagline, hero photo + credit, annual **international** visitors, favorite / add-to-trip / compare | `c.*`, `img`, `photo_page`; `city-photos.js` | add_city.py (photo file is manual) |
| 01 Duration: How long should you stay | 4-tier ascending stay ladder | `visit`, `stay` (STAY_RUBRIC.md) | add_city.py |
| 02 Fast facts: Season | avg high per quarter, average rainy days per month in each quarter (computed from NASA POWER by `rain/recompute_rain.py`), best time, seasonal events, holiday-closure banner | `temps`, `rain`, `events` → `city-seasons.js`; `city-holidays.js` (**country-keyed**) | add_city.py; holidays: **check country exists** |
| 02 Fast facts | population, walk score, safety index, solo comfort | `c.pop`, `walk`, `safety`, `solo` | add_city.py |
| 02 Fast facts | languages by majority + Common phrases popup | `c.langs`; `city-phrases.js` (**language-keyed**) | add_city.py; phrases: **check language exists** |
| 02 Fast facts | religion, English ease | `religion`, `english` | add_city.py |
| 02 Fast facts | cost, currency and converter: hotel b/m/h, meal, taxi, drinks, Daily Cost Estimator b/m/h, affordability tier, live FX | `cost`, `hotel`, `drinks`, `cur`, `card`; per-day figures computed by `cost-estimator.js` | add_city.py (no daily figure is researched: it is derived) |
| 02 Fast facts | hotel card: avg per night + info bubble, budget/mid/high-end row, **Laundry** (wash+dry or drop-off price, a researched price range shown as low–high via `laundry.usdMax` since 2026-09-19, availability, modal), **Gym** (cheapest researched day pass; "coming soon" until the city is researched; "no day-pass gyms found" when researched and empty), and **Find laundry & gyms** (neighborhood dropdown → researched gyms first, then a Laundry / Gyms radio toggle: Laundry shows the city's laundry facts, Gyms the researched day-pass gyms for that neighborhood, with **named laundromats per neighborhood** under the Laundry option (Overture open data, up to 3 within 1 km, "See it on a map" links, credit line; loaded 2026-09-21: 1,964 listings in 474 cities, the rest honestly empty), each ending in a "Show all laundromats/gyms in <place>" link to Google Maps (no embedded map, no key, since 2026-09-18); a city with no placed neighborhood skips the dropdown and lists city-wide) | `hotel`, `cost.hotel`, `laundry`, `hood_geo`, `gyms`, `laundromats` | add_city.py; laundry via `laundry/sync_laundry.py`; `hood_geo` via `hoods/geocode_hoods.py`; laundromats via `laundry/load_laundromats.py`; gyms via `gyms/load_gyms.py` (research per decisions.md; complete 893/893 on 2026-09-17, 92 honestly empty; batch log in `_needs-attention/_done/RESUME_gym-research.md`) |
| 02 Fast facts | connectivity: mobile/wifi speed, operators, $/GB, free-wifi, airport wifi, **Travel eSIMs card** | `net`; `esim`; `esim-providers.js` (**country-keyed**) | add_city.py; eSIM: **check country row exists** |
| 02 Fast facts | emergency & embassy, tipping, tap water | `emergency`, `tip`, `water` | add_city.py |
| 02 Fast facts | getting around the city (transit systems, payment, hours, map link) | `transit` | add_city.py |
| 02 Fast facts | taxi / ride-hail chips with store links, taxi tips popup, **Bikes & scooters** | `taxi`, `rides`; `app-store-links.js` (country-keyed); `city-micromobility.js` | add_city.py; **micromobility: not handled** |
| 02 Fast facts | areas to avoid, travel advisory (Level 3/4 only) | `avoid`, `advisory` | add_city.py |
| 02 Fast facts | info-icon notes for coded fields (only the 109 repaired cities) | `notes` | none: new cities must ship coded values, never prose |
| 03 Passage | airport: name, km, drive, ride-hail, transit, taxi $, car service $, rentals, estimate flag | `airport` (+ `taxiEst`) | add_city.py |
| 03 Passage | getting there: air / train / bus / car / ferry cards | `transport` | add_city.py |
| 03 Passage | international train / bus / ferry routes | `routes` → `city-routes.js` | add_city.py (optional) |
| 04 Quarters | 5 neighborhoods: name, description, best-for banner, landmark search, hero photo, map link | `hoods`, `hood_desc`, `hood_tag`, `hood_landmark`; `hood-photos.js` | add_city.py; **hood photos: not sourced** |
| 04 Quarters | where to stay: high / mid / budget per hood, price-tier verified | `lodging` | add_city.py |
| 04 Quarters | **where to go out**: one pick per kind (dive / party / cocktail / pub, or the alcohol-free cafe / hangout / mocktail) per hood, name + one-line note + Google place ID (map link opens that exact venue); a pick with `near` is a **neighbor-hood pick** (a spare qualifying venue of another hood within 1.5 km, shown with a rust "Nearby: <hood>" flag, map link to that hood; decisions.md 2026-09-22) | `bars` (`k`,`n`,`d`,`pid`,`near`) | 40/893 have it (baseline, no place ID); the 412 cities with 500,000+ international visitors are being filled in batches of 25 by `hoodpicks/` (RESUME_hood-picks.md); new cities: run the same pipeline |
| 04 Quarters | **where to eat**: one pick per kind (local traditional / casual / fine dining) per hood, same pick shape | `eat` | in the schema since 2026-09-21; filled by `hoodpicks/` batches (412-city first phase); rest of the 893 later |
| 04 Quarters | **coffee & takeaway**: one pick per kind (coffee / takeaway / bakery) per hood, same pick shape | `cafes` | in the schema since 2026-09-21; filled by `hoodpicks/` batches (412-city first phase); rest of the 893 later |
| Food modal | local food & drink recommendations with places and photos | `food`, `food_photos` ← `city-food.js`, `city-food-photos.js` | **not researched by add_city.py**; folded by extend_citydata.py |
| 05 Landmarks | top-10 sights: name, blurb, map pin, photo + credit, contribute-photo | `landmarks`, `lmk_coords`, `lmk_photos` ← `city-landmarks.js`, `-coords.js`, `-photos.js` | names/blurbs by add_city.py; **coords and photos: not handled** |
| 06 Excursions | half-day and full-day trips, each list followed by **nearby guide cards** (another guide within day-trip range, "See Our Guide Page" ribbon, whole card links to it) | `daytrips` ← `day-trips.js`; `nearby` (site-only) | add_city.py; day trips verified 2026-09-21 (2,670, 66 cities empty); nearby via `daytrips/build_nearby.py` |
| 07 Happenings | events in city (sheet-driven), submit-an-event form | events sheet tab | manual |
| 07 Happenings | Roamers in town, Roamer's Connections board, Ask-a-Roamer link | user-generated; city must exist in `destinations.js` | add_city.py (destinations.js) |
| 08 Insights | Traveler's Take / Local's Perspective: "Share" interview forms, and approved interviews as cards (newest 3, "Read the full interview", "Show all") | user-generated: Supabase `city_insights` (pending, admin-only) → `city_insights_public` view (approved, no email); approved in Admin → Insights via `approve-insight.js` | nothing to research; site-only, not in citydata or the sheet |
| 09 Dispatches | blog stories (placeholder) | none | nothing to research |
| Sheet | one row, 254 columns, incl. Intl Visitors basis/note, Beaches Score, the laundry columns, Hood N Latitude/Longitude, Landmark N Photo File/Credit and Food N Name/Photo File/Credit (added 2026-09-19); plus the Laundry, Gyms, Laundromats and Hood Picks venue tabs (Hood Picks: one row per eat / cafes / bars pick with place ID, note, source and article URLs; the source of truth for those three keys) | `NRA-MASTER.xlsx` Live Cities, Laundry, Gyms, Laundromats, Hood Picks | add_city_to_sheet.py; `gyms/load_gyms.py` for the Gyms tab; `hoodpicks/load_picks.py` for the Hood Picks tab and the three citydata keys |
| Finder | six priority scores + walk + safety; budget math from `cost`/`hotel`/`drinks` via `cost-estimator.js` | `score` → `city-scores.js`; price inputs → `destinations.js` | add_city.py |
| City directory (cities.html) | card list; cost sorts use the same `cost-estimator.js` mid figure | reads `destinations.js` at runtime (no copy of its own since 2026-09-16) | add_city.py via destinations.js |

### 5.2 What must be researched at add time (decided by Jeff, 2026-09-16)

Every row of the 5.1 inventory is researched when a city is added. Nothing is
deferred to "later". The rows the script does not yet fill are done by hand or
by their own script in the same task, and each is reported filled or open by name.

| Item | Decision |
|---|---|
| Where to eat (`eat`) and coffee & takeaway (`cafes`) per neighborhood | Researched at add time with the hood-picks pipeline (`_guidebuild/hoodpicks/`: Google Places candidates, script checks, pick agents, independent check, sheet then site). Key shape fixed in the schema 2026-09-21. The 412 cities with 500,000+ international visitors are backfilled first, in batches of 25; the other cities later. |
| Where to go out (`bars`) per neighborhood | Researched at add time with the same pipeline; picks carry the place ID. The 40 baseline cities keep their bars; the rest of the 412 are filled by the batches, the remaining cities later. |
| Food & drink modal (`food`, `food_photos`) | Researched at add time: dishes and drinks, verified places for each (never a dish with zero places), photos with credits. |
| Landmark coordinates and photos (`lmk_coords`, `lmk_photos`) | Researched at add time: a pin for every landmark, checked by the validator, and a photo with a commercial-use licence and credit for each. |
| Neighborhood hero photos (`hood-photos.js`) | Sourced at add time, location-verified, one per hood. |
| Bikes & scooters (`city-micromobility.js`) | Researched at add time. An empty list is written only after a real search finds no verified operator. |
| Country-keyed files (holidays, eSIM providers, app-store links) | All 197 countries already exist; no new-country work unless a new country is recognised. Verify the rows are present; do not re-research them. |
| Language-keyed phrases (`city-phrases.js`) | Researched at add time if the city's majority language is not in the file yet. |
| Day trips (`daytrips`) | Researched at add time. The 228 cities without them remain a separate backlog item. |
| Laundry | **Built 2026-09-16** into the hotel card. Researched at add time (price, availability, note). Sheet columns stay as the source; `sync_laundry.py` copies them into citydata. |
| Gym day pass | **Defined and piloted 2026-09-17** (decisions.md): gyms with day/multi-day/week passes, chains, non-guest hotel gyms, public centres, free calisthenics parks; stored as `gyms` per city and a Gyms sheet tab; researched at add time for new cities. **Complete 2026-09-17:** 893/893 cities, 2,656 gyms, 92 cities honestly empty. |
| Daily cost figure | **Done 2026-09-16.** No static daily figure anywhere. `cost-estimator.js` is the one formula for the city page and the finder (two per room, alcohol and activities on by default). The finder's `dailyCost` and the old `daily` key are gone. |

**Add-time checklist** (the add-city report lists each line as filled or open):

1. Hero photo + credit; international visitors with basis.
2. Stay ladder; season temps/rain; seasonal events.
3. Fast facts: population, walk, safety, solo, languages, religion, English ease.
4. Costs: hotel b/m/h, meal, taxi, drinks, daily b/m/h, currency, card acceptance.
5. Connectivity, emergency, tipping, water, transit, taxi/ride-hail, avoid, advisory.
6. Airport with fares (estimates flagged), transport cards, intl routes.
7. Five neighborhoods: description, best-for tag, landmark, **photo**, lodging ×3 verified tiers, **bars**, **eat**, **cafes**.
7b. **Laundry** price and availability; **gyms** with passes per the 2026-09-17 definition (4–8 per city, tied to neighborhoods, sources).
8. **Food & drink modal** with places and photos.
9. Ten landmarks (fewer if honest): blurb, **coordinates validated**, **photo + credit**.
10. **Day trips** half/full. 11. **Bikes & scooters**. 12. Phrases if the language is new.
13. Six finder scores. 14. Sheet row with parity check. 15. Country rows confirmed present.

### 5.3 The change protocol for city.html

Any commit that adds, removes, renames, reshapes or re-sources a section, card or
data key on `city.html` must, **in the same commit**:

1. Update the inventory table in 5.1 and the "as of" line.
2. Update `_guidebuild/CITY_SCHEMA.md` and `example-city.json` (key, shape, required or optional, definition, source rule).
3. Update `add_city.py`, `add_city_to_sheet.py` and `extend_citydata.py` so a new city gets the section.
4. Add the sheet column(s), or record the section as **site-only** in the sheet's parity note.
5. Update `.claude/skills/add-city/SKILL.md`.
6. Backfill the 893 existing cities, or flag them in `_needs-attention/` with a count. A new section may not go live with empty data.
7. Write a memory note, and name the section in the commit subject.

A city.html change that skips any step is incomplete, and the report says so. To
catch drift mechanically, add `_guidebuild/check_schema_drift.py`: it lists every
`rec.<key>` city.html reads, every key in the schema, and every key present in
citydata, and fails on any mismatch. Run it in the add-city verify phase.

## 6. Design rules (so they stop being re-requested)

- One stylesheet: `master.css`. New CSS goes there or in the page's own block
  in the same style, never as a per-page override that fights it.
- **Square corners** everywhere. Maximum `border-radius: 3px`. This has been
  requested at least four separate times; treat any rounded element as a bug.
- Brand colours only: green `#5c6933`, rust `#b5492c`, parchment/sand, ink.
  Legacy `#3f5138`, `#a8482a`, `#2c3a27` and gradients are gone; do not reintroduce.
- Fonts: Work Sans for UI, Fraunces italic for editorial headings. Self-hosted.
- **Nothing ever overflows its container**, on any viewport. Labels, dates
  and buttons stack inside the card; they never spill.
- **It must look right at every one of these widths** (decided 2026-09-19):
  320, 360, 375, 390–430, 768 and 1280+. 360 is the design baseline (most
  common Android); 320 covers zoomed text, fold cover screens and the WCAG
  reflow minimum. "Look right" means no overflow, no clipped or cut-off text,
  no sideways scroll, and a layout that is intended, not just squeezed. After
  every layout change, check all six widths, including popups and forms, and
  screenshot at least 320, 375 and desktop. Test in the phone emulator (not
  only a narrow iframe) and on a folder that is up to date with `origin/main`.
- Consistency over invention: match the nearest existing component (labels,
  chips, buttons, hotel-pick labels) rather than styling something new.
- Footer, nav and hero patterns are uniform across every page.
- Always offer a rendered preview for anything visual before committing, and
  screenshot the result after.

## 7. Files, edits and safety (the original master rules, kept in full)

- **Only add or remove the exact lines the task requires.** Never regenerate or
  rewrite a whole file or block. city.html is still a very large file (about
  325 KB since the city data moved to `citydata/`, once over a million
  characters); a wholesale edit once silently deleted the Ibiza guide.
- **Read the live file immediately before editing it.** Never edit from a copy
  read earlier in the session.
- **After editing, prove nothing was lost:** grep for the pre-existing pieces and
  confirm counts, run `git diff --stat`, and run the syntax check
  (`python3 _guidebuild/checkjs.py <page>.html`, `node --check <file>.js`) with
  zero errors.
- Minified single-line JSON in `citydata/` is edited by span, never `json.dump`ed.
- **Add a city only through `_guidebuild/add_city.py` + `add_city_to_sheet.py`**
  (the add-city skill), and only against the full inventory in §5. Never
  hand-splice a city into the ten city-list files.
- If a task seems to need a large deletion or rewrite, stop and ask.
- Scratch files live in the session scratchpad, never in the repo. Backups of
  the sheet go nowhere: git already holds every version.
- Decisions with lasting effect (a city dropped on purpose, a rule adopted, a
  threshold chosen) are written to project memory the moment they are made, so
  the next session does not re-ask.

## 8. Git, branches and concurrency

- **Never `git add -A`, `git add .` or `git commit -a`.** Stage by path.
- Before committing: `git status --short` and confirm every staged path is
  yours. After: `git show --stat` lists only your files.
- More than one session may be working the same directory. Do not assume the
  tree is yours. Do not switch or create branches while another session is
  active — it moves their working directory too. Prefer a worktree for a
  parallel task.
- Main is the only long-lived branch. A task branch is named for the task,
  merged (fast-forward) as soon as the task is done, and deleted locally and on
  origin. Never leave a stale branch carrying unrelated work.
- Commit message: one line saying what changed and why, in plain English, with
  the verification in the body (what check ran, what counts held). Add the
  Claude co-author line.
- A push deploys to Netlify. Do not push anything unverified. Jeff sometimes
  pushes himself; check `git log -1` before assuming what is live.
- Secrets never go in chat, commits or files other than `.env`. If a key appears
  in a message, say so and ask him to rotate it. He adds keys to `.env` himself.

## 9. How to report (every task, every time)

Lead with the outcome. Then this block, always, so he never has to ask
"is this done?", "is it pushed?" or "what's left?":

```
Status:     complete | partial | blocked
Changed:    <files>
Verified:   <checks run, counts before/after, viewports screenshotted>
Committed:  <hash> | not committed
Pushed:     yes (live on Netlify) | no
Left open:  <items, and where they are logged; for a city add, the §5 inventory rows still open>
```

- Short sentences, plain words, no jargon he would have to look up. No
  em-dashes, no filler, no restating the question.
- Numbers go in a table or on their own line, not buried in prose.
- Anything he must decide goes in a file in `_needs-attention/` as a .md with the
  question stated plainly, plus one line here pointing to it.
- Never say "done" for a batch that is partly done. Say what is done and what
  is not, with counts.
- When a change is visual, attach a screenshot. When he asked a question, give
  the answer first and stop; do not fix.

## 10. Long-running and autonomous jobs

- Agree the rules once at the start (replacement rule, batch size, what to do
  on unverifiable items), restate them in one line, then run to the end. Do not
  pause to ask "continue?" after each batch.
- Commit after every batch so a crash loses at most one batch.
- If context or search quota will run out, write a resume note to
  `_needs-attention/` and schedule a resume task; do not stop silently.
- Keep a running count (done / remaining / flagged) and put it in every report.

## 11. Where things live

| Thing | Place |
|---|---|
| Master data | `NRA-MASTER.xlsx` → "Live Cities" (893 rows, 254 columns) |
| Per-city guide data | `citydata/<slug>.json` + `citydata/_index.json` |
| City lists that must stay in sync | see memory `nra-city-count-sync-targets` |
| Add-city tooling and schema | `_guidebuild/add_city.py`, `CITY_SCHEMA.md` (gitignored folder) |
| Open questions for Jeff | `_needs-attention/*.md`; finished ones move to `_done/` |
| Improvement backlog | `_needs-attention/suggested-improvements.md` |
| Design tokens | `master.css` |
| The one daily-cost formula | `cost-estimator.js` (city guide estimator, finder budget math, directory cost sort) |
| Neighborhood geocoding, laundry sync, gym loader | `_guidebuild/hoods/`, `_guidebuild/laundry/`, `_guidebuild/gyms/` (gitignored; scripts read keys from `.env`) |
| API keys | `.env` (gitignored): Pexels, Pixabay, Unsplash, `GOOGLE_MAPS_API_KEY`. Never in chat, commits or page code. No Google key is in page code (the Maps Embed key was removed 2026-09-18; decisions.md) |
| Decisions log | `_needs-attention/decisions.md` — add a row the day a decision is made; reverse with a new row, never by deleting |
| Resume notes for long jobs | `_needs-attention/RESUME_*.md` |
| Deploy | Netlify, from `main`; `_needs-attention/`, `netlify/`, root notes are pruned |
| Contact addresses | contact@neverroamalone.com on the site; jeff@ for personal |
