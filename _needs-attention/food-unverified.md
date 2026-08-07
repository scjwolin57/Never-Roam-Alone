# city-food.js — venue verification status

## COMPLETE: all 897 live cities have food data (2026-08-03)

7,144 dishes/drinks, 20,565 venues. Every city has at least one dish and one
drink, and every item has at least two venues.

### Batches 11-13 (cities 701-897)

Every city got at least one 2024-2026 roundup search. The tail of the list is
small, remote or unstable places where individually reviewed restaurants often do
not exist online — for those, entries deliberately name real markets, harbour
fronts, food streets and guesthouse dining rooms rather than invented restaurant
names. Treat those as category anchors, not review-verified businesses.

**Thinnest coverage, worth a look if these pages matter:** Port Moresby, Zhoushan,
Olomouc, Mysore (skipped searches), Hamadan, Conakry, Eilat, Inhambane, Zhangye,
Turpan, Juba, Bangui, Ziguinchor, Laayoune, Khartoum, Manado, Mamoudzou, Visby,
Tamanrasset, Siwa Oasis, Ghardaia, Karimabad, Gilgit, Harar, Goma, and the
Pacific micro-capitals (Yaren, Weno, Funafuti, Tarawa, Majuro).

**Conflict-zone cities** (Sana'a, Khartoum, Port Sudan, Kabul, Aleppo,
Port-au-Prince, Goma) use long-standing institutions and markets, with notes kept
neutral and flagging that conditions change. Worth a human read before launch.

**Pyongyang** lists the state-run restaurants tourists are actually taken to,
described factually.


> **Regenerating:** city.html loads `city-food-index.js` (a ~6 KB list of which
> cities have data) on page load, and only fetches the big `city-food.js` when a
> visitor opens the food modal. Whenever cities are added to city-food.js, the
> index must be regenerated from the same key list or the new cities' buttons
> will not appear.


## Cleared (2026-08-03)

The 21 cities flagged on the first pass were re-checked against 2025-2026 sources.
Eight needed fixes, which are already applied in city-food.js:

| City | Fix |
|---|---|
| Edinburgh | Ondine closed/moved to St Andrews -> Fishers in the City; Hanging Bat note updated (Northern Monk takeover) |
| Reykjavik | Mikkeller & Friends unconfirmed -> Bastard Brew & Food |
| Mumbai | Anand Stall demolished Mar 2026 -> Aaswad; B. Merwan closed Jan 2026 -> Sassanian Boulangerie; Yazdani note fixed |
| Sydney | Zilver lost its Pitt St site -> Palace Chinese |
| Marne-la-Vallee | Val d'Europe "market" location corrected -> Serris weekly market |
| Melbourne | Jimmy Grants Fitzroy now Hella Good; Hellenic Republic closed -> Kalimera Souvlaki Art |
| Auckland | Harbourside closed Jun 2026 -> Ahi; Ostro closed -> Kingi |
| Toronto | Uncle Betty's closed -> When the Pig Came Home |

Confirmed clean, no changes needed: Moscow, Minsk, Tbilisi, Heraklion, Rhodes,
Santorini, Palma de Mallorca, Palma, Ibiza, Nice, Johannesburg, Vancouver, Montreal.

## Still to spot-check (2026-08-03 batch of 64 cities)

These cities were researched under a tight shared search budget. Their headline
venues came from 2024-2026 guides, but some secondary picks rest on
long-established reputation, or are named food streets/markets rather than
individually confirmed businesses. Re-check when there is search budget to spare,
highest priority first.

**High priority (thinnest evidence):** Andorra la Vella, Zhangjiajie, Guilin,
Male, Oranjestad, San Salvador, Mashhad, Denizli.

**Medium (some secondary venues unconfirmed):** Chamonix-Mont-Blanc, Strasbourg,
Marseille, Lyon, Valencia, Malaga, Helsinki, Hamburg, Cologne, Salzburg, Riga,
Tallinn, Tirana, Manchester, Izmir, Bodrum, Batumi, Bishkek, Muscat, Tehran,
Yokohama, Nagoya, Kamakura, Jeju City, Taichung, Malacca, Hoi An.

**Low (only a couple of named picks each):** Washington D.C. (jumbo slice, Rickey
bars), Houston (banh mi trio), Boston (roast beef, oyster bars), Seattle
(teriyaki, Monster Dogs), Niagara Falls (Willow Cakes), Delhi, Cape Town,
Thessaloniki, Nairobi, Corfu.

## Batches 3-4 (2026-08-03, cities 189-348)

Most of these cities got at least one 2025-2026 roundup search, so headline venues
are sourced; the gaps below are secondary picks and street-food entries anchored
to named markets/food streets rather than individual businesses.

**Not web-verified at all — session search budget ran out mid-batch. Highest
priority for the next verification pass:** Aix-en-Provence, The Hague, Stuttgart,
Philadelphia, Negombo, Tampa, Rimini, Chennai, Jaipur, Poznan, Pisa, Palermo,
Ottawa, Otaru, Nelspruit.

**Partly verified, thin secondary venues:** Quanzhou, Baghdad, Qom, Maseru,
Marmaris, Abidjan, Houmt El Souk, Durres, Kunming, Kusadasi, Carcassonne, Agadir,
Varna, Phu Quoc, Boracay, Selcuk, Rotterdam, Perth, Kampala, Glasgow (tablet),
Agra (street chaat), Dali, Lijiang, Nanjing (smaller noodle shops).

## Batch 5 (2026-08-03, cities 349-412)

Every city in this batch got at least one 2025-2026 roundup search except the
four below, and street-food entries again use named markets/food streets rather
than unconfirmed shop names.

**Not web-verified — spot-check first:** Dijon, Austin, New Orleans,
Jinghong. (New Orleans specifically: confirm Central Grocery's post-Ida status
before publishing.)

**Partly verified, weaker secondary picks:** Kanazawa (oden/izakaya names),
Himeji (almond toast), Managua, Reims, Tours, Zhaoqing, Manzhouli,
Santa Cruz de la Sierra, Marsa Alam, Nagasaki (Chuwa, Bistro Boa Vista),
Lviv (Tsukernia, Veronika), Gent (frituren), Isfahan (Beryani Haj Mahmoud).

## Previously-staged 32 cities — VERIFIED AND MERGED (2026-08-03)

All 32 are now live in city-food.js. The staging file has been deleted.
Sixteen cities needed corrections; the notable ones:

| City | Fix |
|---|---|
| Kelowna | RauDZ Regional Table closed Dec 2023 after 22 years -> OAK + CRU and Central Kitchen |
| San Marino | Ristorante Righi closed after 30+ years -> Bar Ristorante Pic Nic and La Terrazza; Buca San Francesco address corrected |
| Torshavn | Frida Kaffihus is in Klaksvik, not Torshavn -> Brell Cafe |
| Trincomalee | Fernando's Bar unfindable in any current listing -> King Fish, Shami Seafood, Trinco Lanka |
| Sibiu | Pardon Cafe relocated and rebranded Italian -> La Turn for papanasi |
| Santa Marta | Agave Azul unfindable -> Restaurante y Bar La Perla |
| Ouagadougou | Chez Tante Alice unfindable -> Chez Tanti Propre (4 slots) |
| Labuan Bajo | Cafe In Hit rebranded -> Carpenter Cafe and Roastery |
| Kashan | Abbasian House is a museum, not an eatery -> Morshedi Restaurant |
| Garmisch | "Braustueberl" trades as Hofbraeustueberl Garmisch (5 slots) |
| Sokcho | Manseok main branch vs Jungang Market branch swapped; brewery is Craft Root |
| Koblenz, Djibouti City, Manaus, Moshi, Magelang | wrong neighbourhoods corrected |

**Still unconfirmed inside those cities** (no closure evidence, left in place, worth
one search each): Los Balcones (Sucre, 3 items), Santiago 1900 (Santiago de Cuba,
3 items), Adler Trout Farm restaurants (Sochi), Burukuka (Santa Marta), Chez
Talout and Restaurant Habiba (Ouarzazate, 7 slots), Ehsan House (Kashan), Anna
Pooram (Trincomalee), Deli Chez (Moshi), Pivovar Groll (Pilsen — may no longer
brew on site). **Pucon is the weakest city in the set**: only 5 of its venues were
confirmed, the rest returned nothing but aggregator pages.

## Batches 7-9 (2026-08-03, cities 477-668)

All cities in these batches got at least one 2024-2026 roundup search. Weaker
secondary picks, worth a later look: Aleppo (war damage — venues are pre-war
institutions plus rebuilt souq areas), Encarnacion, Douala, Serekunda,
Surat Thani, Kermanshah, Kairouan, Gaborone, Kinshasa, Saipan, Tegucigalpa,
Vladivostok, Libreville, Marigot, Bamako, Bentota, Recife, Nakuru, Chetumal,
Gisenyi, Constantine, Battambang, Abha, The Valley, Apia, Thimphu, Maun, Mandalay.

Corrections made during research: Reno's Awful Awful was retired when its downtown
diner closed, so that entry names still-open burger counters instead.

## Batch 6 (2026-08-03, cities 413-476)

**Not web-verified — spot-check first:** Fort-de-France, Faro, Portland (Oregon),
Oaxaca, Valparaiso.

**Jasper, Alberta needs its own check.** The town burned in July 2024. Venues
confirmed reopened: Bear's Paw Bakery, Fiddle River, Terra, Evil Dave's Grill,
Cassios, The Raven Bistro. Deliberately excluded as destroyed: Syrahs of Jasper,
Coco's Cafe, Tekarra, Patricia Street Deli. NOT confirmed either way, still in
the file: Jasper Brewing Company, Whistle Stop Pub, Jasper Pizza Place, The Other
Paw Bakery.

**Other corrections made during research:** "Lo-Lo-Land" in Philipsburg is not a
restaurant - "lolo" is the local term for a roadside BBQ shack, so that entry
points at Original Fat Boy Jimmy's and the Grand Case lolo strip. Pok Pok
(Portland) was avoided as closed since 2022.

Known judgment calls worth one search each: Hella Good (Melbourne) is inferred
from 2020 reporting on the Jimmy Grants sale; Kirin Cambie and The Fish Counter
(Vancouver) and Chez Claudette (Montreal) were left in place without positive
confirmation; Rhodes' Tamam shows "temporarily closed" for the off season, which
is seasonal rather than permanent.

All other cities in city-food.js had their venues web-verified against 2024-2026
reviews and food articles at the time of writing.
