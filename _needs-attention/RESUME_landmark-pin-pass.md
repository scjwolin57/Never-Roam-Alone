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
7. **Phase 2, Google, on 2 October** (moved from 1 October by Jeff), when the
   free 10,000 geocoding calls have reset and no other job is writing citydata. Only the UNRESOLVED list (`landmark-pins-for-google.csv`) goes
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
| 24 | Olomouc to Parma | 250 | 173 | 7 | 55 | 0 | (commit below) |
| 25 | Pattaya to Port Elizabeth | 250 | 174 | 4 | 62 | 0 | (commit below) |
| 26 | Port Louis to Puerto Princesa | 250 | 158 | 15 | 59 | 0 | (commit below) |
| 27 | Puerto Vallarta to Riyadh | 250 | 161 | 11 | 62 | 0 | (commit below) |
| 28 | Road Town to Samarkand | 250 | 185 | 20 | 36 | 0 | (commit below) |
| 29 | San Andres to Sanya | 250 | 177 | 15 | 41 | 0 | (commit below) |
| 30 | Sao Paulo to Sigiriya | 250 | 148 | 24 | 65 | 0 | (commit below) |
| 31 | Sihanoukville to Suzhou | 250 | 172 | 10 | 54 | 0 | (commit below) |
| 32 | Sydney to The Valley | 250 | 159 | 10 | 71 | 0 | (commit below) |
| 33 | Thessaloniki to Turku | 249 | 173 | 7 | 56 | 0 | (commit below) |
| 34 | Turpan to Vilnius | 247 | 184 | 7 | 48 | 0 | (commit below) |
| 35 | Vina del Mar to Yaren | 250 | 158 | 17 | 60 | 0 | (commit below) |
| 36 | Yaroslavl to Zurich | 180 | 89 | 16 | 55 | 0 | (commit below) |

## Phase 1 result (OpenStreetMap + Wikidata), finished 2026-09-22

| | |
|---|---|
| Slots checked | 8926 (all 893 cities) |
| Confirmed by OSM or Wikidata | 6009 |
| Pins changed | 393: 325 corrected (two sources or a by-hand check, 4 of them slots that had no pin), 66 converted from the Chinese GCJ-02 datum, and 2 cleared because the pin was wrong and no reliable point exists (Bentota's Paradise Island sandbar, Labuan Bajo's Pink Beach) |
| Kept after review | 454 |
| Held for the Google pass | 2056 |
| Protected slots compared | 93; one was wrong (Quito's El Panecillo) and Jeff had it fixed the same day |

Nulls went 59 -> 56. Every batch was committed on its own; the table above lists them.

## Phase 2, Google, 2 October 2026 09:00 (scheduled task `landmark-pins-google-pass`)

1. Work `_needs-attention/landmark-pins-for-google.csv` (2056 rows). Each row
   carries the stored pin, why OSM could not confirm it, and any OSM or Wikidata
   lead found.
2. **Two gates before any Google call** (Jeff, 2026-09-22: "wait until oct 2";
   decisions.md). Gate A: confirm October's free 10,000 geocoding calls have
   actually reset and that 2,056 lookups fit inside them. If not, stop and tell
   Jeff: no paid calls, and no spending the $281 trial credit. Gate B: confirm
   no hood-picks load is writing `citydata/*.json` or `NRA-MASTER.xlsx` at that
   moment; if one is, message that session and wait rather than writing at the
   same time. Running in September would have cost about $10 of trial credit.
3. **China rows: convert GCJ-02 to WGS-84 before comparing** (see 7a). Google
   serves China in GCJ-02, so a raw comparison will look like a 0.5 km error
   everywhere and "fix" correct pins into wrong ones.
4. Apply with `pinpass/apply_pins.py` (it refuses protected slots and checks the
   old value before writing), and mirror every change into
   `citydata/<slug>.json` in the same commit. The catalogs are canonical but
   city.html reads citydata: three September commits updated only the catalogs
   and their fixes were never live (fixed 2026-09-22, commit b906db8d).
5. The two cleared pins are in the CSV marked CLEARED; they need a real point.

## Open for Jeff

- `landmarks-that-are-day-trips.md` - 317 landmark pins now sit more than 30 km
  from their city. Some are legitimately a city's own distant site; others are
  day trips in the landmarks list, which the rulebook says never overlap.
- Punta Cana's Manati Park is marked "Cerrado" (closed) in OpenStreetMap. The
  pin was fixed to the Bavaro site; whether the landmark should stay is his call.


**2026-09-23: landmark indices shifted.** 295 far-out landmarks moved to day trips (decisions.md). `landmark-pins-for-google.csv` was re-indexed by landmark name after each batch and the moved rows dropped (2056 -> 1949 rows). Match rows by name, not by the stored index alone; apply_pins.py's old-value check refuses any slot whose pin changed.

**Jeff's pins, 2026-09-23 (final; never overwritten by the Google pass):** Enshi "Lianzhu Pagoda (Lianzhu Tower)" 30.24384, 109.494249; Tamanrasset "Ahaggar Cultural Park Museum (OPNA)" 22.7975934, 5.5388568.
