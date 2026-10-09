# Neighborhood data problems found by the placement pass (2026-09-24)

Found while placing the 156 unplaced neighborhoods. Nothing here was changed. Each is a small research fix; say
"fix them" and they will be researched and applied like the earlier description corrections.

**Points that look wrong (existing data)**
- Gisenyi "Kivu Beach": point is the Kivu Beach Pharmacy in town, 130 m from the Gisenyi Centre point, not the lakeshore.
- Cyangugu "Gihundwe": point is on Rusizi Market; reverse-geocodes to Kamembe.
- Faro "Baixa / Marina": point (37.0239, -7.8496) is about 7.5 km east of the centre.
- City centre points: Mérida (3.9 km east of the historic centre) and Quanzhou (about 10 km east of the old town).

**Descriptions or landmarks that are wrong**
- Karakol "Przhevalsky District": description says "south toward Issyk-Kul"; the lake and the Przhevalsky museum are north-west.
- Sochi "Tsentralny": landmark Dendrarium is in Khostinsky district, 2.4 km south.
- Sergiyev Posad "Klementyevo": described as the station area; the station is in Zvyozdochka.
- Sergiyev Posad "Vifanka": landmark mixes the Vifaniya monastery and the Gethsemane-Chernigov skete.
- Ponce "Canas": only the Holiday Inn is in Canas; the Hilton is in Playa ("two seaside-resort hotels" is wrong).
- San Cristóbal "Santa Lucía": landmark Mercado de Artesanías is at Santo Domingo.
- Antsiranana "Ville Basse": landmark Bazary Be not found; markets are mapped in Tanambao and Bazarikely.
- Pilsen "Lochotín": Bolevec ponds are in Bolevec, about 1 km away.

**Neighborhoods to rename or remove**: settled 2026-10-08 by Jeff (see hood-geo-unresolved.md). Were: Agadez "Bougdouma" and "Nord", Coron
"Private Island Resorts", Kalamata "Analipsi (East Beach)", Tamanrasset "Airport Road District", Timbuktu "Abaradiou".

## Result 2026-10-08 (Jeff: "#5 see how many can be fixed with research. flag ones that are unresolved")

**All 12 open items fixed** (Vifanka was already removed the same day). Sources per item: OpenStreetMap and
Nominatim reverse geocoding, Wikipedia, sobory.ru, madacamp; raw notes in the session scratchpad (`hdf/out_*.json`).

| Item | Fix |
|---|---|
| Gisenyi, Kivu Beach point | moved to the mapped lakeshore beach (-1.702866, 29.257487), between Gorillas Lake Hotel and the Serena |
| Cyangugu, Gihundwe point | moved to Gaturika market (-2.469744, 28.918514), inside Gihundwe sector |
| Faro, Baixa / Marina point | moved to Rua de Santo António (37.016104, -7.933248); was 7.5 km east |
| Mérida city point | Plaza Grande (20.967075, -89.623745); was 3.9 km east (citydata, destinations.js, index.html, compare.html, sheet) |
| Quanzhou city point | Bell Tower crossroads (24.915299, 118.586575); was about 10 km east (same five places) |
| Karakol, Przhevalsky District | "South toward" -> "North-west toward" Issyk-Kul |
| Sochi, Tsentralny | Dendrarium dropped from the description; landmark now the Winter Theatre |
| Sergiyev Posad, Klementyevo | described around Klementyevskaya Street and the Church of the Dormition; point moved to the church (56.2997, 38.1247); tag shopping -> quiet |
| Ponce, Canas | "Ponce's two seaside-resort hotels" -> the Holiday Inn only (the Hilton is in Playa) |
| San Cristóbal, Barrio de Santa Lucía | landmark now Templo de Santa Lucía |
| Antsiranana, Ville Basse | Bazary Be dropped (upper town, now an exhibition centre); landmark La Darse port basin |
| Pilsen, Lochotín | Bolevec ponds dropped; now "next to Lochotín Park and the Plzeň Zoo"; landmark Bazén Lochotín |

## Still open (found while fixing; not changed)

1. **Karakol, Przhevalsky District is not in Karakol**: it is the lakeside settlement Pristan-Przhevalsk, about 11 km
   north-west. Under "hoods are not day trips" it may belong in day trips instead. Jeff's call: keep, or move to day trips.
2. **Cyangugu, Gihundwe description** calls it "a residential area of Kamembe"; it is its own sector of Rusizi District, and
   "schools and churches on the slopes" has no source.
3. **Gisenyi, Kivu Beach landmark** "Gisenyi Public Beach" finds nothing on a map (the beach has no name in OSM).
4. **Hotels not checked against the corrected areas**: Sergiyev Posad Klementyevo (likely not in the quarter), Pilsen Lochotín
   (U Pramenů is 1.9 km away; Riverside Hotel not located), Sochi Tsentralny.
5. **San Cristóbal, Barrio de Santa Lucía description**: "amber workshops" and "craft markets" unconfirmed for this barrio.
6. **Quanzhou, Xunpu Village point** is about 8 km south-east of the old town; not checked.
7. **index.html's visitor figures disagree with destinations.js** for Mérida (0.4 vs 0.5) and Quanzhou (0.3 vs 0.95). The rule is
   one visitors figure everywhere (CLAUDE.md §4.2); likely more cities. Not fixed here.

## Jeff's answers 2026-10-09
1. Karakol Przhevalsky District: already removed by the 2026-10-08 hood tourist-friendliness review (batch 12: "lakeside memorial site 10 km away, no lodging counted"). Closed.
2. Gihundwe: keep it described as part of Kamembe. Closed.
3. Kivu Beach is in Gisenyi (Rubavu), Rwanda: asked back, waiting.
4. Hotels in Klementyevo, Lochotín, Sochi Tsentralny: rechecked (see below when done).
5. Barrio de Santa Lucía is in San Cristóbal de las Casas, Mexico: asked back, waiting.
6. Quanzhou Xunpu Village: already removed by the same review (batch 6: "fishing village"). Closed.
7. Visitors: done 2026-10-09. `sync_visitors.py` read only the `{city:"X"}` entries in index.html and compare.html (102 of 893); it now reads the `{"city":"X"}` entries too. Fixed 660 homepage-globe figures and 154 compare figures, and the "~" (estimated) flag now follows the sheet's basis there too (48 -> 739, as in destinations.js). All 893 now equal the sheet's Annual Visitors (M) in citydata, destinations.js, index.html and compare.html; city-intl-visitors.js was already in step.
