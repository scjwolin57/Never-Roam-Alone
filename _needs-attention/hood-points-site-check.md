# Neighborhood points: full-site location check (2026-09-22)

*Every placed neighborhood point was reverse-geocoded (Photon / OpenStreetMap) and compared with the hood name, then the
suspects were triaged by fresh agents against the hood's own description and landmark (`_guidebuild/hoodpicks/HOODPOINT_TRIAGE_BRIEF.md`).
Moves were written to citydata by span and to the sheet's Hood N Latitude/Longitude, one commit per pass. The full list of
moves with old point, new point, source and reason is in the commit body and `_guidebuild/hoodpicks/work/hoodpoint_moves_scope.md`.*

## Totals, all 893 cities (done 2026-09-22)

| Result | Points |
|---|---|
| Placed neighborhood points checked | 4,033 |
| Flagged by the script (locality does not name the hood, and more than 0.7 km from OpenStreetMap's own point) | 1,096 |
| Triaged: keep, the point is in the hood | 744 |
| Triaged: moved (citydata by span + sheet, three commits) | 314 |
| Needs your call | 38 |
| Not triaged | 0 (hoods removed from Medina, or points scanned twice) |

So about 1 point in 13 was wrong. Every move has its old point, new point, source and reason in
`_guidebuild/hoodpicks/work/hoodpoint_moves_scope.md`, `hoodpoint_moves_rest1.md` and `hoodpoint_moves_rest2.md`,
and in the three commit bodies. The 165 neighborhoods with no point at all are unchanged (`hood-geo-unresolved.md`).

## Your call (37 items): DONE 2026-09-24
Jeff: "if these can't easily be identified then remove that neighborhood (as long as that doesn't make any city have
no neighborhood)". Researched in two halves (`_guidebuild/hoods/pointfix/out_a.json`, `out_b.json`): **29 placed**
from OpenStreetMap / Wikidata landmarks inside the hood, each reverse-geocoded (citydata hood_geo + sheet); **8
removed**: Qinhuangdao Gold Coast (34-37 km out), Angra dos Reis Ilha Grande (21 km by boat), Flores El Remate (22.5 km),
Huangshan Hongcun & Xidi (41-47 km), Manzhouli Xingfu (no such district), Saint Martin's Island Northern Coconut Groves
(nothing mapped), Bamako Quartier du Fleuve (only a map-aggregator point) and Poprad Juh (only a search summary).
Muscat Al Bustan placed although 21.5 km from the site's centre point (that point sits far west; Muttrah is 15.8 km).
The list below is kept for the record.

## Your call (38 items)

Each needs a pin, or a decision that the hood is really a day trip. Paste a Google Maps link per item and it is applied.

- **maun|2 / Shorobe Road (Riverside)**: Current point is south of town on the river (1.3 km from centre), identical to the Sedie point, not on the Shorobe road lodge strip to the north-east. No candidate lies on that road (OSM node is the town centre, landmark is the river south of town) and a Nominatim search for Shorobe Road returned nothing. A pin on the lodge strip (between the Sedia hotel and the Matlapaneng bridge) would settle it.
- **moroni|1 / Volo Volo**: Current point is in Irungudjani/Hadoudja, south of the port, while Volo Volo market is north of the centre on the Itsandra road. Both candidates are US namesakes and a Nominatim search for Volo Volo returned nothing. A pin on Volo Volo market would settle it.
- **nablus|3 / Al-Manara/Downtown**: Current point is inside the Old City (a separate hood) about 0.3 km south of al-Manara clock square. OSM candidate is Dubai, landmark geocode is Jordan, and a Nominatim search for Manara Nablus returned nothing. A pin on al-Manara (Martyrs') Square would settle it.
- **poprad|2 / Juh**: Current point is the town centre (0.25 km from centre, locality Poprad/Veľká); sídlisko Juh is the housing estate south of the centre. Both candidates are a road in Košice. Nominatim returned nothing for 'Juh Poprad'. A Maps pin on Juh III (around the ice stadium / Juh shopping) would settle it.
- **port-elizabeth|3 / Richmond Hill**: Locality is South End / Central, both other hoods; Stanley Street should be about 0.6 km west. Both candidates are namesakes abroad and Nominatim returned nothing for Stanley Street. A Maps pin on Stanley Street (Richmond Hill) would settle it.
- **porto-novo|0 / Centre-ville (Government Quarter)**: Current point is 3 km south of the Porto-Novo centre node in Gbedji by the lagoon, 4.8 km from the site's centre. OSM candidate is in Brazil, landmark geocode empty, and Nominatim returned nothing for the Ethnographic Museum. A pin on the Musée ethnographique Alexandre Sènou Adandé or the Assemblée nationale would settle it.
- **potosi|0 / Centro Histórico**: Current point is in barrio José Díaz Gainza, about 1.6 km north of Plaza 10 de Noviembre, outside the colonial core. Both candidates are in Mexico (San Luis Potosí namesakes) and Nominatim returned nothing for Casa de la Moneda. A pin on the Casa de la Moneda / Plaza 10 de Noviembre would settle it.
- **qinhuangdao|4 / Gold Coast (Beidaihe New District)**: Point is identical to the Beidaihe District point (Daihe/Xishan). The Gold Coast dunes and Beidaihe New District are in Changli, roughly 25-30 km south, outside the 15 km rule. No candidate is in the hood. Jeff to pin (e.g. Huangjin Hai'an / Beidaihe New District) or reclass it as a day trip.
- **quetzaltenango|3 / Zona 3**: Current point is in La Esperanza municipality (Residenciales Los Sauces), the wrong town. The landmark geocode is also in La Esperanza. The OSM 'Zona 3' residential node 1.8 km east of the centre could not be confirmed as Xela's Zona 3 (Nominatim returns only street segments). Needs a pin in Zona 3 (Minerva terminal area).
- **saint-martin-s-island|2 / Northern Coconut Groves**: Point is identical to the Main Village jetty point; no candidate exists. Needs a pin on the island's quieter northern tip (about 1-1.5 km north of the jetty).
- **siwa-oasis|0 / Shali Town Center**: Current point is 4.3 km SE of Shali Fortress (fortress is about 29.204, 25.519 from memory) and no candidate was supplied; the nominatim lookup for Shali Fortress returned nothing. A pin on Shali Fortress or the Siwa market square would settle it.
- **ushuaia|2 / Bahia Cauquen**: Description says a beach barrio 7 km west on Ruta 3; the OSM suburb named Bahía Cauquén is 2.5 km east of centre; the current point (Pista de Esquí, 2.9 km south-west) matches neither, and a nominatim lookup for Bahía Cauquén returned nothing. Need Jeff to confirm whether the hood is the eastern barrio or a western beach, then pin it.
- **yazd|3 / Dowlatabad Garden**: Both candidates are a canal 31 km away. Chahar Menar is an old-city quarter 0.6 km from the centre; my recollection puts Dowlatabad Garden about 2 km south-west (near 31.884, 54.349), which would make the current point wrong, but the Wikipedia fetch failed (404) so it is unverified. A geocode of Dowlatabad Garden, Yazd would settle it.
- **muscat|4 / Al Bustan / Bandar Jissah**: Current point is in Wadi Al Kabir, an industrial/residential area over the ridge from Al Bustan, so it should move. OSM village point for Al Bustan (2.9 km east) is the right place but is 20.4 km from the centre reference, outside the brief's 15 km limit (the current point is already 17.8 km). Needs a yes to exceed the limit for this outlying hood.
- **batumi|2 / New Boulevard**: Name and description disagree. The current point (Kakhaberi, airport end) is the actual New Boulevard, the southern extension. The description (Alphabet Tower, Sheraton, Hilton, casinos) is the north end at Miracle Park, which is the OSM hit (41.6561, 41.6359) and overlaps the Seaside Boulevard hood. Jeff should say whether the hood is the southern New Boulevard (keep point, rewrite description) or the Miracle Park quarter (move to OSM point, rename).
- **manzhouli|2 / Xingfu (Happiness) District**: Same point as the Railway Station hood (49.59655, 117.37836). Manzhouli's subdistricts are Dongshan, Daonan, Daobei, Xinghua, Nanqu, Beiqu; no 'Xingfu' subdistrict found. Settle by confirming the hood name (Xinghua?) and giving a landmark to geocode.
- **ensenada|0 / Centro (Downtown/Malecón)**: Current point (Colonia Bustamante, 31.878, -116.623) is the Hotel Coral/marina area 2 km north of downtown, not the Malecon/Lopez Mateos core (~31.86, -116.62). Both candidates are Colombia namesakes and the es.wikipedia page 404ed. Settle with a geocode of Riviera del Pacifico, Blvd Costero 1421.
- **hua-hin|2 / North Hua Hin (Soi 5-25)**: Point is at Khao Noi, 2 km inland west of the railway; the hood is the beach north of centre off Sois 5-25 (~12.59, 99.96). No landmark and OSM candidate is Dutch. Settle by naming a resort on the strip (e.g. Hilton or Centara side, Soi 15-19) to geocode.
- **jasper|2 / Athabasca River Cabins**: Point is at the Hwy 16 Athabasca bridge / Maligne Rd junction, not at any cabin resort; the described range runs from Lac Beauvert (JPL) to Hwy 93 south. Settle by naming a resort (Pine Bungalows, Tekarra Lodge or Becker's) to geocode.
- **la-romana|0 / La Romana Centro**: Current point (Cumayasa/El Tamarindo) is 6 km north-west of the city; Parque Central La Romana is about 18.427, -68.973 but neither candidate (a university 2 km out, a Guaymate park) nor the nominatim fetch hit it. Settle with a geocode of 'Parque Central, La Romana' or Jeff's pin.
- **surat-thani|1 / Ban Don Pier**: Current point is 0.9 km south of the Ta Pi river inside the town grid and closer to the centre than the City Centre hood's own point; neither candidate is the pier (village 25 km, bus station 6.5 km) and nominatim has no entry for Ban Don Pier. Settle by pinning the night-boat pier on the riverfront (Ta Pi / Ban Don pier, roughly 9.143, 99.33).
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

## Copy problems the triage noticed (not changed)

- Koblenz: the Südliche Vorstadt text names Görresplatz, which is in the Altstadt.
- Legaspi: Peñaranda Park is in the Old Albay District, not the Port District.
- Lilongwe: one hood spans Kumbali and Lumbadzi, 19 km apart; the point is at Lumbadzi.
- Pilsen: the zoo is in Lochotín/Vinice, not Bory. Paramaribo: Tourtonne is north of downtown, not south. Osogbo: about 2 km from Oja Oba, not 4.
- Batumi: the "New Boulevard" hood's description (Alphabet Tower, Sheraton) is the Miracle Park end, which is the Seaside Boulevard hood; the point is on the southern New Boulevard.
- Hangzhou: the Xiacheng description (Wulin Square) now points at Gongshu and overlaps the Grand Canal hood. Ulaanbaatar: the Khan-Uul landmark (Shangri-La) is downtown in Sukhbaatar.
- Huangshan "Hongcun & Xidi", Qinhuangdao "Gold Coast", Plettenberg Bay "The Crags", Flores "El Remate", Chios "Volissos", Siddharthanagar "Lumbini": hoods that are really day trips 20 to 45 km out (rulebook: a landmark is inside the city; anything outside is a day trip).

## For every future batch
Run `python3 _guidebuild/hoodpicks/hoodpoint_check.py <slugs>` (Photon; the cache makes re-runs free) before `fetch_rank.py fetch`; triage any new suspect with `hoodpoint_review.py` and the triage brief. The 412-city scope is clean apart from the items above.
