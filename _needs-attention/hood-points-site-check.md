# Neighborhood points: full-site location check (2026-09-22)

*Every placed neighborhood point was reverse-geocoded (Photon / OpenStreetMap) and compared with the hood name, then the
suspects were triaged by fresh agents against the hood's own description and landmark (`_guidebuild/hoodpicks/HOODPOINT_TRIAGE_BRIEF.md`).
Moves were written to citydata by span and to the sheet's Hood N Latitude/Longitude, one commit per pass. The full list of
moves with old point, new point, source and reason is in the commit body and `_guidebuild/hoodpicks/work/hoodpoint_moves_scope.md`.*

## 412-city scope (1,968 placed points)

| Result | Points |
|---|---|
| Checked | 1,968 |
| Flagged by the script | 435 |
| Triaged: keep (point is in the hood) | 299 |
| Triaged: moved | 103 |
| Triaged: needs your call | 9 |
| Not yet triaged (scanned after the first review run) | 24 |

## After the moves

The 103 moved points were re-checked: 74 now geocode to their hood by name; 29 still trip the name heuristic because OpenStreetMap labels the spot differently (Sandown for Sandton, Kouh Sangi for Koohsangi) or has no place node for the hood name (Porto Baixa, Marbella Golden Mile). Each of those 29 was placed by the triage agent from the hood's own description or landmark, with the reason recorded; they are not re-flagged as wrong.

## Your call (8; the Medina Al Aqeeq item is withdrawn, the hood was removed on 2026-09-22)

- ~~medina|2 / Al Aqeeq~~ (withdrawn): Current point (Badaah, 0.74 km from the Prophet's Mosque) is not the Al Aqeeq district, which the description places in the west, farther from the Haram, by Wadi al-Aqiq. The only OSM candidate is a school named Al Aqeeq at 24.4224, 39.5951 (5.4 km SW) and Nominatim returned no district polygon (fetched: only an Al Aqiq in Yanbu). A pin for Medina's Al-Aqiq district (or confirmation the school point is inside it) would settle it.
- **muscat|4 / Al Bustan / Bandar Jissah**: Current point is in Wadi Al Kabir, an industrial/residential area over the ridge from Al Bustan, so it should move. OSM village point for Al Bustan (2.9 km east) is the right place but is 20.4 km from the centre reference, outside the brief's 15 km limit (the current point is already 17.8 km). Needs a yes to exceed the limit for this outlying hood.
- **batumi|2 / New Boulevard**: Name and description disagree. The current point (Kakhaberi, airport end) is the actual New Boulevard, the southern extension. The description (Alphabet Tower, Sheraton, Hilton, casinos) is the north end at Miracle Park, which is the OSM hit (41.6561, 41.6359) and overlaps the Seaside Boulevard hood. Jeff should say whether the hood is the southern New Boulevard (keep point, rewrite description) or the Miracle Park quarter (move to OSM point, rename).
- **manzhouli|2 / Xingfu (Happiness) District**: Same point as the Railway Station hood (49.59655, 117.37836). Manzhouli's subdistricts are Dongshan, Daonan, Daobei, Xinghua, Nanqu, Beiqu; no 'Xingfu' subdistrict found. Settle by confirming the hood name (Xinghua?) and giving a landmark to geocode.
- **ensenada|0 / Centro (Downtown/Malecón)**: Current point (Colonia Bustamante, 31.878, -116.623) is the Hotel Coral/marina area 2 km north of downtown, not the Malecon/Lopez Mateos core (~31.86, -116.62). Both candidates are Colombia namesakes and the es.wikipedia page 404ed. Settle with a geocode of Riviera del Pacifico, Blvd Costero 1421.
- **hua-hin|2 / North Hua Hin (Soi 5-25)**: Point is at Khao Noi, 2 km inland west of the railway; the hood is the beach north of centre off Sois 5-25 (~12.59, 99.96). No landmark and OSM candidate is Dutch. Settle by naming a resort on the strip (e.g. Hilton or Centara side, Soi 15-19) to geocode.
- **jasper|2 / Athabasca River Cabins**: Point is at the Hwy 16 Athabasca bridge / Maligne Rd junction, not at any cabin resort; the described range runs from Lac Beauvert (JPL) to Hwy 93 south. Settle by naming a resort (Pine Bungalows, Tekarra Lodge or Becker's) to geocode.
- **la-romana|0 / La Romana Centro**: Current point (Cumayasa/El Tamarindo) is 6 km north-west of the city; Parque Central La Romana is about 18.427, -68.973 but neither candidate (a university 2 km out, a Guaymate park) nor the nominatim fetch hit it. Settle with a geocode of 'Parque Central, La Romana' or Jeff's pin.
- **surat-thani|1 / Ban Don Pier**: Current point is 0.9 km south of the Ta Pi river inside the town grid and closer to the centre than the City Centre hood's own point; neither candidate is the pier (village 25 km, bus station 6.5 km) and nominatim has no entry for Ban Don Pier. Settle by pinning the night-boat pier on the riverfront (Ta Pi / Ban Don pier, roughly 9.143, 99.33).

## Remaining 481 cities

Scan in progress (second worker); the same review and triage follow, then one more commit.
