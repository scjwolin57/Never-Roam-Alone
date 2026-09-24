# Neighborhood boundaries vs the 800 m circle: measurement (2026-09-24)

Jeff asked whether good venues sit outside the 800 m search circle but still in the neighborhood, or just outside it.
Measured for the 5 pilot cities with free open data only (Overture boundaries and Overture's food places; independent,
unbranded, confidence 0.7+). **No Google calls. Nothing changed.** "Venues" here are all eating and drinking places in
the open data, before any quality bar; Google's rating and review bar would keep a fraction of them.

Every venue is counted for one neighborhood only: the one whose pin is nearest (the rule the search already uses).

| City | Hood | Empty slots | Venues in 800 m circle | Venues 800 m to 1.2 km | Boundary (km²) | In boundary, past 800 m | In circle, outside boundary | Within 300 m outside boundary, past 800 m |
|---|---|---|---|---|---|---|---|---|
| Lisbon | Alfama | 5 | 352 | 54 | 0.37 | 0 | 177 | 0 |
| Lisbon | Bairro Alto | 6 | 563 | 200 | 0.18 | 0 | 339 | 0 |
| Lisbon | Chiado | 4 | 355 | 1 | none | | | |
| Lisbon | Baixa | 3 | 404 | 47 | 0.16 | 0 | 259 | 0 |
| Lisbon | Belém | 4 | 90 | 56 | 5.73 | 68 | 7 | 102 |
| Rome | St. Peter's Basilica | 5 | 89 | 17 | none | | | |
| Rome | Vatican Museums | 3 | 354 | 78 | none | | | |
| Rome | Borgo | 5 | 345 | 422 | 0.48 | 0 | 239 | 56 |
| Las Vegas | The Strip | 5 | 451 | 275 | none | | | |
| Las Vegas | Downtown / Fremont | 2 | 279 | 45 | none | | | |
| Las Vegas | Summerlin | 10 | 8 | 2 | 92.8 | 192 | 0 | 139 |
| Las Vegas | Henderson | 6 | 36 | 30 | 315 (the whole city) | 884 | 0 | 6 |
| Las Vegas | Chinatown | 5 | 174 | 94 | 0.92 | 210 | 25 | 59 |
| Hanoi | Hoan Kiem | 2 | 1,318 | 334 | 1.93 (2025 ward) | 224 | 127 | 302 |
| Hanoi | Ba Dinh | 4 | 233 | 450 | 2.95 (2025 ward) | 473 | 91 | 219 |
| Hanoi | Tay Ho | 4 | 40 | 202 | 10.6 (2025 ward) | 756 | 0 | 196 |
| Hanoi | Dong Da | 4 | 444 | 573 | 2.07 (2025 ward) | 144 | 93 | 443 |
| Hanoi | Cau Giay | 7 | 338 | 334 | 3.96 (2025 ward) | 159 | 17 | 353 |
| Ho Chi Minh City | District 1 | 3 | 860 | 765 | none | | | |
| Ho Chi Minh City | District 3 | 2 | 502 | 455 | none | | | |
| Ho Chi Minh City | Cholon | 9 | 242 | 330 | none | | | |
| Ho Chi Minh City | Thao Dien | 2 | 439 | 204 | none | | | |
| Ho Chi Minh City | Phu My Hung | 5 | 92 | 126 | none | | | |

## What it shows
1. **Small old-centre neighborhoods (Alfama, Bairro Alto, Baixa, Borgo): no gain.** Their boundaries are smaller than the
   800 m circle, so nothing in them lies past 800 m. The circle already reaches well beyond them: 177 to 339 venues sit in
   the circle but outside the boundary. That is why the agents skipped so many "outside the hood" candidates there. For
   these, a boundary helps the other way: the script could apply the hood check itself, instead of an agent judging each
   address.
2. **Large or spread-out neighborhoods: big gain.** Venues in the boundary but past 800 m: Tay Ho 756 (40 in the circle
   today), Ba Dinh 473, Hoan Kiem 224, Chinatown Las Vegas 210, Summerlin 192 (8 in the circle today), Cau Giay 159,
   Dong Da 144, Belém 68.
3. **Pins that sit badly:** Tay Ho (40 venues in the circle, 756 in the ward: the pin is probably on the lake) and
   Summerlin (8 venues: the pin is in a quiet part of a 93 km² suburb). Moving those two pins would help at no cost.
4. **A boundary can be too big to use:** Henderson's boundary is the whole city (315 km²). Whole-town neighborhoods need the
   pin and a radius, not the town boundary.
5. **No boundary (landmark or street neighborhoods, Ho Chi Minh City):** widening to 1.2 km adds 17 (St. Peter's) to 765
   (District 1) venues. The Strip gains 275.
6. **"Just outside" the boundary:** sizeable only where the boundary is an official ward whose edge cuts through a busy
   area (Hanoi 196 to 443, Summerlin 139, Belém 102).

## Question for Jeff
Recommended rule, per neighborhood:
- **Boundary exists, 0.5 to about 15 km², and it is the neighborhood itself (not a whole town):** search the whole boundary;
  the script decides "in the hood" from the boundary. A venue within 300 m outside it may fill an empty slot as a flagged
  "Nearby" pick (this amends the 2026-09-22 hood-fit rule the same way the existing Nearby pick does).
- **Boundary smaller than the circle:** keep the 800 m circle for the search, but the script uses the boundary as the hood
  check.
- **No usable boundary, or a whole-town boundary:** the pin with a 1.2 km radius (decided 2026-09-21, never switched on),
  nearest-pin rule and the agent's address check as today.
- **Move the Tay Ho and Summerlin pins** first (free).

Cost: the boundaries are free. The venues past 800 m are not in our saved Google results, so each widened neighborhood
needs new Google searches: about 3 per neighborhood (one per section, more where results run past 20). For the 5 pilot
cities that is roughly 15 neighborhoods, about 45 to 90 calls, from the trial credit (ends 2026-10-30). The boundary data
is also missing for most landmark-named neighborhoods, and Vietnam's 2025 ward reform means Hanoi's boundaries are the new
wards, not the old districts our neighborhood names come from.

Files: measurement script and data in the session scratchpad; boundaries from Overture release 2026-08-19.0 (divisions theme).
