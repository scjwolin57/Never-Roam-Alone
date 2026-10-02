# Hotel links pipeline: plan for Jeff's approval

*Written 2026-09-26 from the hotel affiliate research (`hotel-affiliate-programs-2026-09-24.md`) and the current citydata. Nothing here is built yet. Decisions needed from Jeff are in section 9; the rest is how it would run.*

## 1. Goal

Give every named hotel on the city pages one verified "Check rates" link to that exact property on one booking partner, so a reader lands on the hotel they were reading about and the site earns a commission on completed stays. One partner per hotel, plain links only, no scripts, no cookie banner, no partner prices on our page.

## 2. What is there today

| Item | Count | Source |
|---|---|---|
| Cities with lodging | 894 | citydata (893 plus one alias file) |
| Named hotels | 10,741 | `lodging`, 5 hoods x 3 tiers; 309 cities have fewer than 5 hoods |
| Empty slots | 0 | |
| Picks with "hostel" in the name | 516 | 4.8% |
| Picks with a global chain brand in the name | 1,356 | 12.6%: Hilton 166, Marriott 142, ibis 102, Radisson 89, Hyatt 88, Wyndham 74, Sheraton 64, Holiday Inn 55 |
| Cities with placed neighborhoods (`hood_geo`) | 893 | used to check a match is in the right place |

The hotel row on city.html shows tier, name and the like/dislike vote. It has no link of any kind. Sheet columns "Hood N High-end/Mid-range/Budget Hotel" hold the names and are the source of truth for them.

Earlier notes said 13,395 hotels. That number assumed 5 hoods for every city. The real count is 10,741.

## 3. Partner per hotel (proposed rule)

One partner per hotel, chosen by a fixed rule so two passes can never disagree:

| Case | Partner | Why |
|---|---|---|
| Pick is a hostel (name contains hostel, hostal, backpacker, or the partner lists it as a hostel) | Hostelworld | Hostel inventory and rates are strongest there |
| City in Asia, Oceania, Middle East | Agoda | Widest inventory and best rates in those regions |
| City in the Americas, Europe, Africa | Expedia (Expedia / Hotels.com share one program) | Same reason for those regions |
| Primary partner does not list the property | The other OTA, if it lists it | Second choice, same verification |
| No partner lists it | No link | Never a search link, never a "hotels in <city>" link on a hotel row |
| Chain property (1,356) | Same rule as above, through the OTA | Chain programs only if Jeff wants them later; the pipeline stores one URL per partner, so a chain link can be added without redoing the match |

Booking.com is not in the first pass (declined; reapply after launch). When it is approved, the same pipeline runs a Booking.com column and city.html switches the partner per region without touching the data already collected.

The region list (which countries go to Agoda) is written once in the script, not per city.

## 4. Data shape

### 4.1 Sheet: new tab "Hotel Links" (source of truth)

One row per hotel per partner tried, like the Hood Picks tab:

| Column | Meaning |
|---|---|
| City, Country, Hood #, Hood, Tier | Where the hotel sits (Tier = High-end / Mid-range / Budget) |
| Name | Exactly as in the Live Cities column |
| Partner | expedia / agoda / hostelworld (booking later) |
| Property ID | The partner's own ID for the property (Expedia hotel ID, Agoda hotel ID, Hostelworld property ID) |
| Property URL | The partner's plain property page, no tracking code |
| Partner Name | The name the partner shows, verbatim |
| Partner Address | The address the partner shows |
| Distance (km) | From the hood point in `hood_geo` |
| Match | A / B / C (section 5) |
| Method | script / agent / Jeff |
| Source URL | The page or search that produced the match |
| As Of | Date checked |
| Verdict | ok / review / no-match / dead (a link that later fails the checker) |
| Note | Free text: rename, alias, brand, reason for review |

Written only through `sheet_write.py` `TabRows`, like Gyms and Hood Picks.

### 4.2 citydata: new key `lodging_links`

Same 5 x 3 shape as `lodging`, one entry per slot or `null`:

```
"lodging_links": [[{"p":"expedia","id":"12345","as":"2026-10"}, null, {"p":"hostelworld","id":"6789","as":"2026-10"}], ...]
```

Only the partner and the property ID are stored. The URL is rebuilt at render time from one template per partner, so a URL format change or a new creator ID is a one-line edit, not a 10,741-row rewrite. Only Match A rows reach citydata.

### 4.3 One place for affiliate codes: `hotel-affiliates.js`

Same pattern as `esim-providers.js` (`NRA_ESIM_AFF`): one template per partner with `{id}` and the creator / CID code. Placeholder templates produce the plain property URL, so a slot works before the partner approves the site and starts earning the day the code is pasted. No partner script, so no CSP change and no cookie banner.

### 4.4 Affiliate code storage

Creator IDs and CIDs are not secrets (they are visible in every link) but they live only in `hotel-affiliates.js`, never in citydata or the sheet.

## 5. Matching: how a name becomes a verified property

Every hotel goes through the same steps. A match is never made from memory.

1. **Locate the hotel.** Get its address and coordinates from an open source first (OpenStreetMap / Nominatim, free), Google Places Text Search only where OSM has nothing (about $32 per 1,000 calls; the pilot measures how often it is needed).
2. **Find the partner page.** In order: the partner's own site search for the name in the right city; a web search restricted to the partner's domain; the partner's sitemap where one is published. The pilot tests which of these a script can do without being blocked; whatever a script cannot do goes to agents in batches with a brief, exactly like the hood-picks passes.
3. **Read the partner page.** Take the listed name, address and coordinates from its structured data (both Expedia and Agoda pages carry name and address in JSON-LD).
4. **Verify.** All three must hold for Match A:
   - name: the partner's name matches ours after normalizing (case, accents, "Hotel", "The", the brand prefix), or the sheet Note records a rename or alias;
   - place: the partner's coordinates are within 3 km of the hood point (or 10 km for a resort city where hoods are wide), and the partner's city or district agrees;
   - one property: the partner page is a single property, not a search result, a chain page or a group of properties.
   Match B is name and city but no address or coordinates on the partner page: goes to Jeff's review list, not to citydata. Match C is anything less: no link.
5. **Second source never eliminates.** If OSM and the partner disagree on the address, the row goes to review with both values, the same rule as every other pass.
6. **Renames and closures.** A partner page under a new name for the same building is a rename: the link ships and the Note records the old name. A property the partner marks closed or that no partner lists is reported in the batch log and left without a link; the hotel name itself is a separate lodging-quality question, not for this pass.

## 6. Batches and order

- Same order as hood picks: the 412 cities with 500,000+ international visitors first, then the rest, batches of 25 cities (about 300 hotels a batch).
- Each batch: script pass, agent pass for the leftovers, 10% independent check, sheet write, `load_hotel_links.py` to citydata, parity check 0, commit with the batch log (hotels matched A / B / C per partner, Google calls and cost, dead links).
- Pilot first: 25 cities across all three partners, to measure match rate per method, cost per hotel, and how much of the work a script can do. The pilot decides the batch size and whether Google Places is needed at all. Nothing ships from the pilot until Jeff has seen its numbers.
- Resume note `RESUME_hotel-links.md` with the running count (done / remaining / flagged), like the other long jobs.

## 7. What changes on city.html

- Each verified hotel row gets one "Check rates" link, styled like the existing small action links, `target="_blank" rel="sponsored noopener"`, opening the partner's property page with our code.
- One disclosure line at the top of the Where to stay card: plain words, "We earn a commission if you book through these links, at no extra cost to you." It appears only when at least one row in the card has a link.
- A hotel without a Match A link shows exactly what it shows today.
- No partner price, logo or rating on our page. The tier labels and our own price averages stay as they are (already labelled as our estimates since 2026-09-24).
- Checked at 320, 360, 375, 390 to 430, 768 and 1280+ with screenshots at 320, 375 and desktop before it goes live.

## 8. Change protocol (CLAUDE.md 5.3), done in the same commit as the render change

1. Inventory row "where to stay" gains "Check rates link" and the as-of line moves.
2. `CITY_SCHEMA.md` and `example-city.json` get `lodging_links` (shape, optional, rule: only Match A, written by `load_hotel_links.py`, never by hand).
3. `add_city.py` copies the key; `add_city_to_sheet.py` writes the Hotel Links rows; the add-city skill gets a step "run the hotel links pipeline for the new city".
4. Sheet: the Hotel Links tab; `check_sheet_parity.py` compares it to `lodging_links`.
5. Backfill: the key is added city by city as batches land; a city without it renders as today, so nothing goes live empty.
6. Memory note and decisions.md row the day Jeff approves this plan.
7. Link checker `_guidebuild/hotellinks/check_links.py`: every stored property page still answers, still names the same hotel, still sits in the same place; run before each batch commit and quarterly; a failed link is set to `dead` in the sheet and removed from citydata, never left live.

## 9. Decisions needed from Jeff

1. **Partner-per-region rule** in section 3: agree, or a different split (for example Expedia everywhere, Agoda only as fallback).
2. **Hostels to Hostelworld**, or keep all lodging on the two OTAs (one fewer program, slightly lower hostel payouts).
3. **Match B**: review list for Jeff (proposed) or dropped without review.
4. **Google Places spend**: allowed only where OSM has nothing (proposed), or not at all. The pilot reports the per-hotel cost before any batch spends.
5. **Chain properties**: through the OTA for now (proposed); chain programs revisited after a count of completed stays shows whether they matter.
6. **Pilot cities**: the first 25 of the 412-city list, or a hand-picked spread (proposed: 8 Expedia-region, 8 Agoda-region, 9 cities with several hostels).
7. **Timing of the applications**: apply to Expedia and Agoda when the pilot is approved and the first batches are running, so Agoda's 6-month no-bookings clock starts close to launch.

## 10. Estimates (labelled as estimates)

| Item | Estimate | Basis |
|---|---|---|
| Hotels per batch | about 300 | 25 cities x 12 average |
| Batches | about 36 | 10,741 / 300 |
| Google Places cost if used for every hotel | about US$345 | 10,741 x $32 per 1,000; the OSM-first rule should cut this to a fraction |
| Search quota per session | about 200 searches | memory note; agent passes must be scripted where possible |
| Match rate | unknown until the pilot | reported as A / B / C counts |

## 11. Out of scope

- Changing which hotels are named (lodging quality is its own pass).
- Any partner widget, map or price display.
- Booking.com, chain programs, Stay22: not in this pipeline until decided.
