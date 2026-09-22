# Resume note: landmark pin pass (started 2026-09-22)

Jeff, 2026-09-22: "go, use openstreetmap now and google after oct 1".

## Why
A random sample of 120 pins found 5 wrong (Samaipata on Santa Cruz city centre,
Phnom Sampeau 25 km off, Ponta da Barra 15 km off, Assekrem 11 km off, Konstanz's
Council Building 1.9 km off). With last week's sample (3 of 45) that is about 5%,
roughly 400-450 wrong pins site-wide. Earlier passes only worked rows the
2026-08-07 `coords-needing-review.csv` flagged, so anything not on it (Miami's
Lummus Park) was never looked at.

## Rules for this pass (fixed at the start, do not re-plan)
1. **Phase 1, OpenStreetMap (free), now.** Every landmark slot is looked up in
   OpenStreetMap through Photon (photon.komoot.io, four workers, each at most one
   request a second, bounded to 1 degree around the city centre), first by the
   name without brackets, then by each bracketed part. Nominatim was tried first
   and refused bulk use with "too many requests" after 154 pins, so it was
   stopped. Wikidata is the second source: one query per city fetches every item
   with a coordinate and a Wikipedia article within 60 km, matched locally.
2. **Classes.** AGREE: an OSM hit within 400 m, or the stored pin inside the
   named area's box. CANDIDATE: OSM finds the same name (whole-name match, never
   a generic fragment) somewhere else. UNRESOLVED: no confident OSM match.
3. **A pin is changed only when** the OSM hit is the same named place, in the
   right city, and a second source agrees: Wikidata's coordinate for the item, or
   a by-hand check. Everything else is left as it is.
4. **Protected slots are never overwritten.** The 93 slots changed by this
   month's coordinate commits (4 of them from Jeff's pins) are compared only;
   a disagreement goes to `landmark-pin-conflicts.md` for Jeff.
5. **A landmark found to be a day trip** (outside the city) gets its correct pin
   now and is listed in `landmarks-that-are-day-trips.md`; moving it is Jeff's call.
6. **Batches of 25 cities, alphabetical, reviewed and committed per batch.**
   Every change goes to `city-landmark-coords.js` and the city's
   `citydata/<slug>.json` `lmk_coords` in the same commit. The sheet holds no
   landmark coordinates, so there is nothing to mirror there.
7a. **China: many stored pins are in the GCJ-02 datum (Chinese map services),
   about 0.5 km off true positions on the site's map.** Checked against the
   published coordinates of the Forbidden City, Tiananmen, the Summer Palace
   and Beihai Park. Sources are mixed (the Temple of Heaven was already true),
   so a China pin is converted GCJ-02 -> WGS-84 only when the converted point
   lands within 250 m of OSM or Wikidata and the stored one is over 350 m off.
   The Google pass must do the same: Google also serves China in GCJ-02.
   (Batches 4 and 7 first recorded the opposite; corrected 2026-09-22.)
7. **Phase 2, Google, on or after 2026-10-01**, when the free 10,000 geocoding
   calls reset. Only the UNRESOLVED list (`landmark-pins-for-google.csv`) goes
   through it. September is already past the free tier.
8. Nothing is pushed. Jeff pushes.

## Batch log
| Batch | Cities | Checked | Agree | Fixed | Unresolved | Conflicts | Commit |
|---|---|---|---|---|---|---|---|
| 1 | Aachen .. Amritsar | 250 | 178 | 9 | 51 | 0 | (this commit) |

## Working files (session scratchpad, rebuildable)
Scripts: `pinpass/photon.py`, `wd_city.py`, `classify2.py`, `apply_pins.py`,
`record.py`. If the session is lost, the pass can be resumed by re-running the
lookups for the batches not yet in the table above; the Google list and the
table in this file are the durable record.
| 2 | Amsterdam to Atlanta | 250 | 172 | 4 | 60 | 0 | (commit below) |
| 3 | Auckland to Bariloche | 250 | 180 | 5 | 53 | 0 | (commit below) |
| 4 | Barranquilla to Bodrum | 250 | 171 | 8 | 56 | 0 | (commit below) |
| 5 | Bogota to Bulawayo | 250 | 202 | 5 | 38 | 0 | (commit below) |
| 6 | Bursa to Cayenne | 250 | 185 | 8 | 47 | 0 | (commit below) |
| 7 | Cebu City to Cockburn Town | 250 | 150 | 4 | 71 | 0 | (commit below) |
| 8 | Coimbra to Dallas | 250 | 173 | 9 | 56 | 0 | (commit below) |
| 9 | Damascus to Durres | 250 | 186 | 7 | 49 | 0 | (commit below) |
| 10 | Dushanbe to Foz do Iguacu | 250 | 149 | 9 | 71 | 0 | (commit below) |
| 11 | Frankfurt to Gondar | 250 | 178 | 12 | 55 | 0 | (commit below) |
| 12 | Goreme to Havana | 250 | 158 | 10 | 59 | 0 | (commit below) |
| 13 | Hebron to Inhambane | 250 | 157 | 8 | 67 | 0 | (commit below) |
| 14 | Innsbruck to Johor Bahru | 250 | 160 | 5 | 63 | 0 | (commit below) |
| 15 | Juba to Kayseri | 250 | 145 | 17 | 69 | 0 | (commit below) |
| 16 | Kazan to Kuching | 250 | 162 | 11 | 60 | 0 | (commit below) |
| 17 | Kumamoto to Leipzig | 250 | 161 | 10 | 64 | 0 | (commit below) |
| 18 | Leon to Luxor | 250 | 163 | 9 | 65 | 0 | (commit below) |
| 19 | Lviv to Manila | 250 | 170 | 9 | 61 | 0 | (commit below) |
| 20 | Manzanillo to Medellin | 250 | 160 | 10 | 64 | 0 | (commit below) |
| 21 | Medina to Morondava | 250 | 184 | 12 | 44 | 0 | (commit below) |
| 22 | Moroni to Naples | 250 | 168 | 11 | 63 | 0 | (commit below) |
| 23 | Nara to Ohrid | 250 | 186 | 7 | 46 | 0 | (commit below) |
