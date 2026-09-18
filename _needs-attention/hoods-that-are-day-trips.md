# Neighborhoods that are day trips (or double as one)

*Audit run 2026-09-18 against all 893 `citydata/*.json`. Rule (decisions.md, 2026-09-18): a neighborhood is part of the city; a separate town, park, scenic area or excursion goes in `daytrips` only; the two lists never share an entry. Nothing has been changed yet.*

**Question for Jeff:** fix these as a research task (new, verified neighborhood for each slot, plus its photo, lodging, map point, description and sheet columns; the removed place moved to day trips if it isn't there), or remove the slot and let the city ship with 4 neighborhoods where no real fifth exists?

## A. Labelled as day trips in the neighborhood list (8, certain)

| City | Neighborhood slot |
|---|---|
| Chefchaouen | Talassemtane National Park (day-trip) |
| El Calafate | Perito Moreno Glacier (day-trip) |
| San Pedro de Atacama | Valle de la Luna (day-trip) |
| San Pedro de Atacama | El Tatio Geysers (day-trip) |
| San Pedro de Atacama | Salar de Atacama (day-trip) |
| San Pedro de Atacama | Laguna Cejar / Altiplanic Lagoons (day-trip) |
| Siwa Oasis | Great Sand Sea (day-trip base) |
| Sukhothai | Si Satchanalai (day-trip) |

San Pedro de Atacama has 4 of its 5 slots taken by day trips. It is a small village and may honestly have only one or two neighborhoods.

## B. Same place in both lists (14 name matches; 12 real)

| City | Place | My read |
|---|---|---|
| Aomori | Asamushi Onsen | In both lists. Pick one. |
| Aqaba | Tala Bay | Resort strip south of town. Pick one. |
| Beihai | Weizhou Island | Island reached by ferry: day trip. |
| Hamilton (Bermuda) | St. George's (East End) | Separate town: day trip. |
| Houmt El Souk | Midoun | Separate town on Djerba: day trip. |
| Inhambane | Tofo Beach | Separate beach village: day trip. |
| Inhambane | Barra | Separate beach village: day trip. |
| La Romana | Bayahíbe | Separate village: day trip. |
| Lagos (Nigeria) | Lekki | A real Lagos district. The **day-trip** entry is the wrong one. |
| Madrid | Salamanca | **Not a breach.** The Madrid district and the city of Salamanca share a name. |
| Puerto Plata | Sosúa | Separate town: day trip. |
| Puerto Plata | Cabarete | Separate town: day trip. |
| Rhodes | Lindos | Separate town, about 50 km away: day trip. |
| The Valley (Anguilla) | Shoal Bay East | Beach area on a small island. Pick one. |

## C. Worth checking (named as parks, scenic areas or separate towns)

These came up among the 108 neighborhoods whose map point is more than 15 km from the city's centre point. Distance alone proves nothing: big cities and spread-out resort areas are legitimately that wide, and some city centre points look off (Mumbai's Colaba and Fort, and Davao's Poblacion, sit 16 to 22 km from Mumbai's and Davao's own centre points, which suggests the centre points are wrong). The names below read as excursions, not parts of the city:

Mbabane: Mlilwane Wildlife Sanctuary · Puerto Iguazú: Iguazú National Park (Argentine side) · Enshi: Enshi Grand Canyon Scenic Area · Wuyishan: Wuyi Mountain Scenic Area · Hiroshima: Miyajima (Itsukushima) · Zhoushan: Mt. Putuo (Putuoshan) · Gyeongju: Bulguksa / Tohamsan · Nagano: Togakushi (Mountain Shrine Area) · Battambang: Phnom Banan, Phnom Sampov · La Ceiba: Cangrejal River Valley · Skardu: Kachura · Huangshan: Shexian Ancient Town · Zhangjiajie: Wulingyuan District

The full 108-row distance list can be regenerated from the audit script in the session that wrote this file; say the word and it goes in here.

## D. Found by the research agents, not in the first audit (round 2)

| City | Item | What the agent saw |
|---|---|---|
| Rhodes | Ialysos (hood) | Its own town on a larger island with several towns: day trip under the island rule, unless it is judged part of Rhodes's urban area. |
| Mbabane | Ezulwini, Malkerns (hoods) | Separate towns. |
| La Romana | Playa Dominicus (hood) | Inside the Bayahíbe district, a different municipality and province. |
| Aqaba | Coral Coast (hood) vs "Aqaba Marine Park" (day trip) | The two overlap. |
| Huangshan | Huangshan Scenic Area, Hongcun & Xidi (hoods?) | Read as excursions. |
| Zhoushan | Zhujiajian Island | Separate island, linked by bridge. |
| Wuyishan | Xingcun day trip | Could fold into the Mount Wuyi day trip. |
| La Romana | Day trips list "Bayahíbe" and "Bayahibe" | Same place twice. |
| The Valley | Shoal Bay East map pin | The pin sits at Shoal Bay West. |
| Enshi | Grand Canyon map pin | About 13 km out; the canyon is 60 to 64 km away. |

## Island rule applied (decisions.md, 2026-09-18)
Hamilton (Bermuda) and The Valley (Anguilla) are small islands: St. George's, Paget, Southampton, Hamilton Parish, Shoal Bay East, Meads Bay and Rendezvous Bay stay as neighborhoods; the duplicate day-trip entries for St. George's and Shoal Bay East are removed instead.

## Waiting on Jeff
- **Inhambane (mainland):** Tofo and Barra are inside the city boundary but 22 to 25 km from the old town, and are also listed as day trips. Keep as neighborhoods (remove the day-trip entries) or move to day trips (city ships with 3)?
- **Island-named guides** (Ibiza, Phuket, Santorini, Mykonos): read as "whole island is the city". Confirm.

## Outcome, applied 2026-09-18 (27 cities)

Researched by 6 agents, checked by 2 independent agents, re-judged under the tourist-base test.

| Result | Cities |
|---|---|
| Slot replaced with a verified neighborhood (10) | San Pedro de Atacama (Ayllu de Solcor), Puerto Iguazú (Tres Fronteras), Puerto Plata (Cofresí, in Cabarete's slot), Battambang (East Bank), Beihai (Qiaogang), Enshi (Tujia Nü'er Cheng), Wuyishan (Sangu Resort Area), Hiroshima (Yokogawa), Mbabane (Pine Valley), Huangshan (Tangkou, Liyang In Lane) |
| Slot removed, no suitable neighborhood (city ships with fewer) | Chefchaouen, El Calafate, San Pedro (3 slots), Siwa, Sukhothai, Aomori, Houmt El Souk (Midoun town; its hotel zone is Aghir / Sidi Mahres), Rhodes (Lindos; the Monte Smith replacement failed its check), Mbabane (Malkerns, Mhlambanyatsi), Nagano, Gyeongju (Bulguksa: temple area inside the city, landmarks kept, no day trip), Battambang (Phnom Sampov), La Ceiba, Skardu (Kachura, Katpana), Wuyishan (Xingcun), Huangshan (Qiyun Mountain) |
| Stays a neighborhood, duplicate day trip removed | Aqaba (Tala Bay), Hamilton (St. George's), The Valley (Shoal Bay East, map pin also fixed), Inhambane (Tofo, Barra), La Romana (Bayahíbe, both spellings), Puerto Plata (Sosúa), Lagos (Lekki) |
| Unchanged (passes the tourist-base test) | Zhangjiajie (Wulingyuan), Zhoushan (Mt. Putuo, Zhujiajian), Rhodes (Ixia, Ialysos), Mbabane (Ezulwini), La Romana (Playa Dominicus), Huangshan (Hongcun & Xidi) |

**Still open**
- Hotel tiers left empty where nothing verifiable was found (shown as a plain list on the page): Solcor, Tres Fronteras, Cofresí and East Bank have no budget pick; Qiaogang, Nü'er Cheng, Yokogawa, Pine Valley and Tangkou have no high-end pick; Liyang has only its high-end pick.
- No photo yet (tile shows "Contribute a photo"): Pine Valley, Liyang In Lane, Tres Fronteras (its only candidate showed flags).
- **42 landmarks** in 20 of these cities sit at places now listed as day trips, or outside the city (e.g. Hiroshima's Itsukushima Shrine, Wuyishan's scenic-area sights, El Calafate's glacier cruise, Puerto Iguazú's Parque das Aves in Brazil). Listed in the checker output; to be handled in the day-trip pass for these cities, which runs last.
- Wuyishan's "City Center" hood lists a hotel that looks like it is in Sangu (Super 8 National Tourist Holiday Resort).
- Battambang Psar Nat lost its high-end pick (Classy Hotel is on the east bank) and has two verified hotels left.
