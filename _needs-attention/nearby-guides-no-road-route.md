# Nearby guides: pairs with no road route (2026-09-21)

Each row is a city and another Never Roam Alone guide that the day-trip pass flagged as nearby, but the free router
(OSRM, OpenStreetMap) found no road between them and the pass recorded no travel time. They are islands or sea crossings.
They are **not shown** on the site until someone gives a travel time. A ferry within the day-trip limits (half about
75 min, full up to about 3 h, each way) makes it a guide card; a flight only does not (decisions.md 2026-09-21).

**To fix a row:** write the one-way time and how, e.g. "Dar es Salaam -> Zanzibar City: 2 h by fast ferry". Then add it
to `_guidebuild/daytrips/nearby_classified.json` and run `build_nearby.py`.

36 pairs.

| City | Nearby guide | Tier stored by the day-trip pass (unverified) |
|---|---|---|
| Basseterre | Charlotte Amalie | full |
| Basseterre | Gustavia | half |
| Basseterre | Marigot | half |
| Basseterre | Philipsburg | half |
| Basseterre | Road Town | full |
| Basseterre | Roseau | full |
| Basseterre | Saint John's | half |
| Basseterre | The Valley | half |
| Bridgetown | Castries | full |
| Bridgetown | Fort-de-France | full |
| Bridgetown | Kingstown | full |
| Bridgetown | St. George's | full |
| Caracas | Kralendijk | full |
| Castries | Bridgetown | full |
| Castries | St. George's | full |
| Dar es Salaam | Zanzibar City | full |
| Douala | Malabo | half |
| Kingstown | Bridgetown | full |
| Kingstown | Castries | half |
| Kingstown | Fort-de-France | full |
| Kingstown | Roseau | full |
| Kingstown | St. George's | half |
| Malabo | Calabar | full |
| Malabo | Douala | half |
| Moroni | Mamoudzou | full |
| Philipsburg | The Valley | half |
| Roseau | Basseterre | full |
| Roseau | Castries | full |
| Roseau | Kingstown | full |
| Roseau | Saint John's | full |
| St. George's | Bridgetown | full |
| St. George's | Castries | full |
| St. George's | Kingstown | half |
| St. George's | Port of Spain | full |
| Zanzibar City | Dar es Salaam | half |
| Zanzibar City | Mombasa | full |

## For reference: 121 pairs over 3 hours, not shown

These are not day trips by the rule. They stay recorded in `nearby_classified.json` in case a "further afield" list is ever wanted.

| City | Guide | Minutes | Source |
|---|---|---|---|
| Acapulco de Juarez | Mexico City | 270 | record: about 4-5 hr by car |
| Accra | Kumasi | 194 | osrm driving |
| Agadir | Marrakech | 185 | osrm driving |
| Aomori | Hakodate | 221 | osrm driving |
| Ashgabat | Mashhad | 245 | osrm driving |
| Asmara | Axum | 267 | osrm driving |
| Asmara | Mek'ele | 288 | osrm driving |
| Auckland | Taupo | 203 | osrm driving |
| Bandar Seri Begawan | Kota Kinabalu | 215 | osrm driving |
| Banjul | Bissau | 262 | osrm driving |
| Banjul | Dakar | 480 | record: 6-10h by road |
| Beirut | Haifa | 193 | osrm driving |
| Beirut | Amman | 221 | osrm driving |
| Beirut | Tel Aviv | 258 | osrm driving |
| Beirut | Jerusalem | 287 | osrm driving |
| Beirut | Nicosia | 772 | osrm driving |
| Belgrade | Sarajevo | 258 | osrm driving |
| Belgrade | Pristina | 289 | osrm driving |
| Belize City | San Pedro Sula | 515 | record: ~8h35m by car, no direct road |
| Belize City | La Ceiba | 684 | record: ~11h24m by car |
| Bishkek | Almaty | 194 | osrm driving |
| Bissau | Serekunda | 252 | osrm driving |
| Bissau | Banjul | 261 | osrm driving |
| Bologna | Genoa | 212 | osrm driving |
| Bujumbura | Kigali | 196 | osrm driving |
| Bujumbura | Gisenyi | 261 | osrm driving |
| Bujumbura | Goma | 264 | osrm driving |
| Cartagena | Santa Marta | 184 | osrm driving |
| Castries | Roseau | 255 | record: about 4h15m-4h30m by ferry |
| Chișinău | Odessa | 204 | osrm driving |
| Conakry | Freetown | 216 | osrm driving |
| Cox's Bazar | Saint Martin's Island | 472 | osrm driving |
| Damascus | Jerusalem | 238 | osrm driving |
| Damascus | Tel Aviv | 246 | osrm driving |
| Dhaka | Chittagong | 194 | osrm driving |
| Dhaka | Kolkata | 246 | osrm driving |
| Douala | Yaoundé | 183 | osrm driving |
| Douala | Calabar | 450 | osrm driving |
| Dubrovnik | Podgorica | 181 | osrm driving |
| Dubrovnik | Split | 199 | osrm driving |
| Dubrovnik | Sarajevo | 279 | osrm driving |
| Dubrovnik | Tirana | 356 | osrm driving |
| Dubrovnik | Pristina | 456 | osrm driving |
| Dubrovnik | Bari | 1071 | osrm driving |
| Dushanbe | Samarkand | 230 | osrm driving |
| Edmonton | Jasper | 225 | record: 3.5-4h by car |
| El Calafate | El Chaltén | 236 | osrm driving |
| Fethiye | Rhodes | 181 | osrm driving |
| Freetown | Conakry | 218 | osrm driving |
| Gaborone | Pretoria | 240 | record: about 4h by car plus border crossing |
| Houston | San Antonio | 210 | osrm driving |
| Hurghada | Marsa Alam | 255 | record: 4-4.5 hr by car (~240-300 km) |
| Hurghada | Cairo | 390 | record: not applicable (guide city; flight or 6-7 hr drive) |
| Hurghada | Luxor | 1470 | record: 3h45-4h by car (~280-294 km) |
| Jaipur | Agra | 255 | record: about 4-4.5 hours by car or express train |
| Kigali | Bujumbura | 270 | record: about 4-5 hours by car |
| Kotor | Mostar | 231 | osrm driving |
| Kotor | Tirana | 258 | osrm driving |
| Kotor | Durrës | 267 | osrm driving |
| Kotor | Sarajevo | 357 | osrm driving |
| Kotor | Pristina | 366 | osrm driving |
| Kotor | Skopje | 433 | osrm driving |
| Kotor | Bari | 1173 | osrm driving |
| La Paz | Puno | 269 | osrm driving |
| Lagos | Lomé | 242 | osrm driving |
| Lilongwe | Blantyre | 260 | osrm driving |
| Lomé | Lagos | 230 | osrm driving |
| Managua | Liberia | 181 | osrm driving |
| Managua | Tegucigalpa | 313 | osrm driving |
| Manzanillo | Guadalajara | 223 | osrm driving |
| Marsa Alam | Luxor | 300 | record: 4.5-5.5 hr each way by car |
| Mbabane | Maputo | 193 | osrm driving |
| Mecca | Medina | 289 | osrm driving |
| Montevideo | Buenos Aires | 195 | record: about 2.5-4 hours by Buquebus ferry |
| Nakhon Ratchasima | Bangkok | 200 | record: ~3h20m by car / ~5 hr by train (161 mi) |
| Nicosia | Beirut | 240 | record: about 4h by ferry (over cap) or flight only |
| Nouakchott | Saint-Louis | 295 | record: ~4h55min by car via Rosso border crossing |
| Oslo | Gothenburg | 217 | osrm driving |
| Pai | Chiang Mai | 210 | record: ~3-4h by car |
| Paris | Mont-Saint-Michel | 270 | osrm driving |
| Port-au-Prince | Cap-Haïtien | 239 | osrm driving |
| Port-au-Prince | Santo Domingo | 310 | osrm driving |
| Port-au-Prince | Puerto Plata | 395 | osrm driving |
| Pyongyang | Seoul | 2100 | osrm driving |
| Qinhuangdao | Beijing | 204 | osrm driving |
| Saint Martin's Island | Cox's Bazar | 472 | osrm driving |
| Sarajevo | Split | 233 | osrm driving |
| Sarajevo | Belgrade | 257 | osrm driving |
| Sarajevo | Novi Sad | 265 | osrm driving |
| Sarajevo | Podgorica | 323 | osrm driving |
| Sarajevo | Pristina | 424 | osrm driving |
| Siem Reap | Phnom Penh | 275 | record: ~4h35m by car |
| Siem Reap | Nakhon Ratchasima | 300 | record: ~5h+ with border crossing |
| Skopje | Ohrid | 181 | osrm driving |
| Skopje | Sofia | 200 | osrm driving |
| Skopje | Tirana | 252 | osrm driving |
| Skopje | Podgorica | 344 | osrm driving |
| Sofia | Skopje | 210 | record: about 3-4 hrs by car (not relevant, removed as a gui |
| Sofia | Thessaloniki | 270 | record: about 4-5 hrs by car (not relevant, removed as a gui |
| Sofia | Pristina | 270 | record: about 4-5 hrs by car (not relevant, removed as a gui |
| Surat Thani | Ko Samui | 184 | osrm driving |
| Tashkent | Samarkand | 287 | osrm driving |
| Tegucigalpa | San Pedro Sula | 215 | osrm driving |
| Tegucigalpa | León | 243 | osrm driving |
| Tegucigalpa | San Salvador | 283 | record: about 4h43m by car |
| Tegucigalpa | Managua | 311 | osrm driving |
| Tel Aviv | Damascus | 242 | osrm driving |
| Tel Aviv | Beirut | 259 | osrm driving |
| Tirana | Ohrid | 188 | osrm driving |
| Tirana | Podgorica | 202 | osrm driving |
| Tirana | Pristina | 206 | osrm driving |
| Tirana | Skopje | 257 | osrm driving |
| Tirana | Bari | 1402 | osrm driving |
| Tripoli | Houmt El Souk | 473 | osrm driving |
| Turku | Mariehamn | 779 | osrm driving |
| Vaduz | Milan | 203 | osrm driving |
| Vaduz | Turin | 271 | osrm driving |
| Vaduz | Verona | 288 | osrm driving |
| Vienna | Salzburg | 190 | osrm driving |
| Vilnius | Riga | 231 | osrm driving |
| Yazd | Isfahan | 239 | osrm driving |
