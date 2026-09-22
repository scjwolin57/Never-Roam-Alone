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

## Remaining 481 cities (2,065 placed points), first triage pass

| Result | Points |
|---|---|
| Checked | 2,065 |
| Flagged by the script | see below; review still running |
| Triaged so far | 282 |
| Kept | 194 |
| Moved | 72 |
| Needs your call | 16 |

### Your call, remaining cities (16)

- **negombo|4 / Kudapaduwa / Duwa**: Kudapaduwa and Duwa are south of Negombo town at the lagoon mouth (about 7.19-7.20N), but the current point is in Periyamulla, 2.4 km north of centre. No candidate point exists (Nominatim returns nothing for Kudapaduwa). A pin on Duwa island or Kudapaduwa village would settle it.
- **dushanbe|0 / City Center (Rudaki Avenue)**: Locality is Ismoili Somoni district, a separate hood on the site, and the point is at the northern stretch of Rudaki Avenue 5.3 km from centre. The landmark geocode is the avenue's midpoint, also in the north. A pin near Dousti Square or the Palace of Nations (the central stretch, about 38.58N 68.79E) would settle it; Nominatim returns nothing for Dousti Square.
- **acapulco-de-juarez|3 / Puerto Marques**: Puerto Marques bay is south-east of the main bay (Wikipedia: about 10 km south of Acapulco, no coordinates). The current point (16.795, -99.809) is at that distance but sits east toward Playa Diamante; the candidates are a road 2.4 km north and a supermarket inland. A pin on the Puerto Marques waterfront would settle it.
- **agadez|1 / Sabon Gari**: Point is 3.7 km north-east of the Grand Mosque, at or beyond the edge of the built-up town; no usable candidate (OSM returns a hamlet 51 km away, the landmark geocode is Manchester, Nominatim returns nothing for Grand Marche Agadez). A pin on the Grand Marche would settle it.
- **agadez|2 / Founey**: Point is 60 m from the Grand Mosque, effectively the same point as Vieille Ville. The Sultan's Palace is a few hundred metres east of the mosque but no candidate places it (both geocodes are in Morocco and Zanzibar; Nominatim returns nothing for Palais du Sultan Agadez). A pin on the Sultan's Palace would settle it.
- **aix-en-provence|3 / Les Facultés**: Point (43.524, 5.432) is in Pont de l'Arc, west of the university quarter (Faculte de Lettres / Av. Robert Schuman at about 5.44-5.45E). Candidates are the town point and a namesake town; the one fetch returned the IEP in the old centre, not the Facultes. A pin on the Faculte de Lettres would settle it.
- **angra-dos-reis|1 / Ilha Grande (Abraão)**: The point is on Ilha Grande but about 6 km west of Vila do Abraao (the village is near -23.14, -44.17); the candidates are the island centroid and the Lopes Mendes cape. The 15 km centre rule cannot apply (the whole island is 18+ km out). pt.wikipedia has no coordinates for Vila do Abraao. A pin on the Abraao pier would settle it.
- **bamako|3 / Quartier du Fleuve**: Current point is in ACI 2000 (another of the city's hoods), west of the centre. Both candidates are on the south bank (Badalabougou side, near the Palais de la Culture), not in the riverside Quartier du Fleuve on the north bank. Nominatim has no entry for the quartier. Settle with a pin near Avenue de la Nation / Grand Hotel (about 12.643, -7.992).
- **baracoa|0 / Casco Histórico**: Current point is in Reparto Paraiso (the El Paraiso hood). Both candidates are Spanish namesakes and Nominatim returned only a hostel for the cathedral. Settle with a pin for Parque Independencia / the cathedral (west end of town, roughly 20.349, -74.506).
- **baracoa|3 / Zona del Mercado / Terminal**: Current point is in Reparto Paraiso, same as the Casco Historico point. OSM hit is a Havana supermarket; Nominatim has no Fuerte de la Punta. Settle with a pin for the bus terminal / Fuerte de la Punta at the north-west tip of town.
- **datong|1 / Hongqi Square (Downtown)**: Point is inside the walled Ancient City (Gucheng, next to Huayan Temple), so it duplicates hood 0, while Hongqi Square is outside the walls to the south. Both candidates are namesakes (Budapest, Laiyuan) and OSM has no 红旗广场 in Datong. A Google Maps pin for 红旗广场 大同 would settle it.
- **flores|3 / El Remate**: Point is in Zona 1 de Santa Elena, which is another hood on the list, so it is wrong. The only candidate, OSM's El Remate village at 16.9931, -89.6904, is 22.5 km from the centre, beyond the 15 km rule, and the description itself calls it a village 30 km away toward Tikal. Jeff should decide whether El Remate (and Tikal National Park) stay as hoods, in which case use the OSM village point, or move to day trips.
- **huangshan|2 / Hongcun & Xidi Ancient Villages**: Current point is Tunxi city centre (0.14 km), not the villages. Hongcun (about 29.905, 117.984) and Xidi are 45 km away, outside the 15 km rule, and this hood is a day trip by the site's own rule (hoods are not day trips). Jeff to decide: drop the hood from the hood list, or accept a far point at Hongcun.
- **iquitos|3 / San Juan Bautista**: Current point is at Cabo López 3 km SSE of the centre near the Itaya, which reads as Belén district, not San Juan Bautista (SW, toward the airport and the Quiñones-avenue artisan market). Nominatim has no node for the market and both candidates are in other cities. Settle by checking whether Cabo López falls inside San Juan Bautista district; otherwise place at the artisan market on Av. Abelardo Quiñones km 4.5 (about -3.776, -73.284).
- **kangding|1 / Zheduo River Corridor**: Current point is at 大桥湾 10 km up the Zheduo valley toward the pass, outside the town; no candidate point. The ribbon of town along the river is between the old town and the new town along the Zheduo, about 30.040, 101.960. Needs a chosen point in town, or merge into Old Town.
- **kangding|2 / New Town (Xin Cheng)**: Current point is identical to the Old Town point (30.05441, 101.96308); New Town (新城) is a separate area downstream. Landmark geocode is a bus station 52 km away, OSM candidate is Prague. Needs a verified point for Kangding's new district / bus station.

The rest of the flagged points in these cities are still being reviewed; a second triage pass and commit follow.
