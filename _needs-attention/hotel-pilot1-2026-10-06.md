# Hotel re-sourcing pilot, part 1: candidates from free map data (2026-10-06)

*Plan: `hotel-resourcing-plan-2026-10-01.md` sections 3-4. Part 1 needs no partner account and spends nothing:
it lists the places to stay in each neighborhood from Overture open map data and applies the area and
lodging-type gates. Part 2 (match each candidate to Expedia / Hostelworld / Agoda, read star class, guest score
and price, make the links) waits for the Partnerize approvals. Nothing was written to the site or the sheet.*

## Method

- **Cities:** the same 25 as the 2026-09-26 link pilots (8 Asia-Pacific, 8 Europe and Americas, 9 hostel-heavy),
  125 neighborhoods.
- **Data:** Overture Maps places, release 2026-08-19.0, primary category hotel, resort, beach resort, lodge, inn,
  motel, guest house, B&B (= "hotel-type"), hostel, or the generic "accommodation". Holiday rentals, serviced
  apartments, campgrounds and hotel bars are not candidates.
- **In the neighborhood:** the hood-picks area rule (decisions.md 2026-09-24): inside the neighborhood's matching
  official boundary, else within 1.2 km of its point; a place just outside a boundary counts as an edge candidate.
  Area files were built for the 22 cities that had none (`build_areas.py`); the three already done by the
  restaurant picks (Singapore, Phuket, Amsterdam) had theirs removed again after the run so that pipeline is not
  changed by this pilot.
- Script `_guidebuild/hotellinks/pilot1.py`; per-city candidate lists in `_guidebuild/hotellinks/pilot1/`.

## Results

| Measure | Result |
|---|---|
| Hotel-type candidates found | 10,923 (median 50 per neighborhood) |
| Neighborhoods with 3+ hotel candidates inside | 119 of 125 |
| Neighborhoods with 10+ | 104 of 125 |
| Neighborhoods with 1+ hostel (Shared room tier) | 89 of 125 (60 with 3+) |
| Generic "accommodation" places (type unclear) | 1,542 |
| Candidates with a website listed | 71% (helps matching to a partner page) |
| Candidates with Overture confidence 0.7+ | 75% |
| Candidates with a chain brand recorded | 3% (brands are under-recorded; the chain check stays name-based) |
| Today's 365 hotel picks found in the data by name | 210 (58%) |
| Places Overture marks closed | 0 (Overture rarely records closures, so "open" must come from the partner listing) |

### The six thin neighborhoods (under 3 hotel candidates)

| City | Neighborhood | Candidates | Cause |
|---|---|---|---|
| San Sebastián | Parte Vieja (Old Town) | 0 | **Area rule:** its point lies inside Centro's large boundary, and "inside a boundary wins" hands Centro all its hotels (42 would move back) |
| San Sebastián | Amara | 2 | Same (10 would move back) |
| Stuttgart | Bohnenviertel | 2 | Same, inside Stuttgart-Mitte (21 would move back) |
| Santiago | Las Condes | 1 | **Point:** the neighborhood point is about 6 km east of the El Golf / Apoquindo hotel district |
| Lijiang | Baisha Village | 2 | Few places to stay in the data; to be confirmed in part 2 |
| Maputo | Costa do Sol | 0 | Few places to stay in the data; to be confirmed in part 2 |

The same boundary problem also hits a neighborhood that did not show as thin: Amsterdam's Canal Ring sits inside
Centrum's boundary, so 176 hotels went to Centrum instead.

## What this means

1. **Supply is not the problem.** Almost every neighborhood has dozens of candidates to choose from; the work in
   part 2 is choosing well, not finding enough.
2. **The free data is incomplete on its own.** 42% of today's picks are not in it by name (renames, local-script
   names, or simply missing). In part 2 the candidate list should be the free data plus the partner's own
   search around the neighborhood point, so a good hotel the free data lacks is not missed.
3. **Open / closed has to come from the partner listing**, as gate G1 already says; the free data cannot tell us.
4. **Hostels:** 36 neighborhoods have none, so their Shared room row would be empty (honestly) unless a hostel
   just outside counts, as for restaurants.

## Decisions for Jeff

1. **Nested-boundary fix (affects the restaurant picks too, which use the same rule):** when a small
   neighborhood's own point lies inside a bigger neighborhood's boundary, a place within the small
   neighborhood's radius and nearer its point belongs to the small one. Proposed: yes, for the hotel pilot now;
   the restaurant pipeline adopts it on its next run (its owner session decides).
2. **Santiago Las Condes point:** move it to the El Golf / Apoquindo hotel district (roughly -33.41, -70.60; to be confirmed), or
   keep it where it is? Proposed: check with `hoodpoint_check.py` and move it; a pin from you settles it.
3. **Generic "accommodation" places:** keep as candidates and let the partner listing say what they are
   (proposed), or drop them?
4. **Empty Shared room rows:** allow a hostel within 300 m outside the neighborhood, flagged "Just outside", as for
   restaurants (proposed), or leave the row empty?

## Jeff's answers (2026-10-06) and the re-run

1. Nested-boundary fix: **yes**. Built into the pilot's neighborhood test; the restaurant picks take it on their
   next run (decisions.md).
2. Las Condes point: **move it**, to OpenStreetMap's "El Golf" neighbourhood point, -33.41394, -70.59229 (Photon /
   OSM, place=neighbourhood, in Las Condes; the core of the "Sanhattan" business and hotel district the guide
   describes). *Done by the 2026-10-08 hood review instead (point now -33.4155, -70.597, about 0.5 km from this
   one); nothing further to apply.*
3. Generic "accommodation" places: **kept** as candidates; the partner listing says what each is.
4. Empty Shared room rows: **yes**, a hostel up to 300 m outside the neighborhood counts, flagged "Just outside".

| Measure (re-run) | Before | After |
|---|---|---|
| Neighborhoods with 3+ hotel candidates inside | 119 | **123 of 125** |
| Neighborhoods with 10+ | 104 | 108 |
| Thin neighborhoods | 6 | 2 (Baisha Village, Costa do Sol: few places in the data) |
| Neighborhoods with a hostel (inside / with just-outside) | 89 | 93 / **97** (28 have none) |
| San Sebastián Old Town / Stuttgart Bohnenviertel / Santiago Las Condes / Amsterdam Canal Ring hotels | 0 / 2 / 1 / 10 | 42 / 23 / 61 / 185 |

## Re-run on today's neighborhoods (2026-10-16)

The 2026-10-08 hood review changed the neighborhoods of 9 of the 25 cities (Lijiang, Nha Trang, Stuttgart, Poznań,
Chengdu, Quito, Lima, Santiago, Cusco: 9 removed, 3 added), so part 1 was run again on the current city files, with
the four fixes above. The area files for Singapore, Phuket and Amsterdam (cities whose restaurant picks were made
without one) were built in the pilot's own folder (`hotellinks/pilot1_areas/`), so the shared hood-picks inputs were
not touched. The 2026-10-06 results are kept in `hotellinks/pilot1_2026-10-06/`.

| Measure | 2026-10-06 re-run | 2026-10-16 |
|---|---|---|
| Neighborhoods in the 25 cities | 125 | 116 |
| With 3+ hotel candidates inside | 123 | **114 of 116** |
| With 10+ | 108 | 106 |
| Hotel-type candidates (median per neighborhood) | 10,946 (50) | 10,808 (51.5) |
| With a hostel inside / including just outside | 93 / 97 | 90 / **93** (23 have none) |
| Thin (under 3) | Baisha Village, Costa do Sol | the same two |
| Today's hotel picks found in the data by name | 210 of 365 | 201 of 339 (59%) |
| Candidates with a website / confidence 0.7+ | 71% / 75% | 71% / 75% |

Unchanged conclusions: supply is not the problem; the partner's own search must be added in part 2 because
about 40% of today's picks are not in the free data; open / closed comes from the partner listing.

## Running count

| Part | Status |
|---|---|
| Part 1 (candidates, gates) | done: 25 cities, re-run 2026-10-16 on the current 116 neighborhoods |
| Las Condes point | done by the hood review (2026-10-08) |
| Part 2 (partner match, stars, score, price, links) | Expedia approved on Partnerize (2026-10-09); waiting for a test deep link and the feed answer from Jeff; Hostelworld still pending |
