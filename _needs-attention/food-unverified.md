# city-food.js — venue verification status

## RE-VERIFICATION PROJECT COMPLETE (2026-08-24 through 2026-08-26)

Every city and every venue in city-food.js has now been through at least one
re-verification pass against current (2025-2026) sources, across 14 passes run
over three days. Roughly 60 confirmed factual errors were fixed directly in
city-food.js — closed venues removed, relocated venues moved to their correct
neighborhood, misnamed or renamed venues corrected — with every single edit
verified by `node --check city-food.js` and a scoped `git diff --stat` to
confirm only the intended lines changed. A further ~80 items across the passes
could not be confirmed either way with the sources available and were
deliberately left unedited, logged as uncertain rather than guessed at, per
the project's standing rule to never invent a fact. Those fixes were
committed on 2026-08-28 (`heros updates and social section`). See the
"Re-verification pass 1" through "pass 14" sections below for the full,
city-by-city detail of every fix and every open question.

## OPEN ITEMS — consolidated list (re-derived 2026-09-15)

The "Still uncertain" blocks inside passes 1-15 contain 71 bullets, but 16 of
those were already answered later in this same file and were never struck
through. Re-reading every block against the passes that followed it leaves
**55 genuinely open items across 52 cities**. This section is the authoritative
list; the per-pass blocks below are the working record and are kept as-is.

What was removed, and why:

- **11 bullets from pass 6** were "not reached, search budget ran out." Pass 7
  went back and finished every one of them. Pass 14 confirms: "Every city and
  venue in city-food.js has now been through at least one re-verification pass.
  Nothing remains unreached." **Nothing in city-food.js is unchecked.**
- **3 bullets from pass 7** (Perth x2, Kampala) were closed by pass 15.
- **1 Salzburg bullet** (pass 3) — pass 4 confirms Gasthaus Wilder Mann reopened.
- **1 Marseille bullet** (pass 4) — verbatim duplicate of the pass 3 entry.

### A. Aggregator-only, no corroborating source (15)

Each appears only on templated aggregator sites that reuse boilerplate copy. More web searching will not settle these; they need a native-language / OpenStreetMap check, and a rule for what to do when that also comes up empty.

- *(pass 13)* Bangui: **La Sirene** — same pattern
- *(pass 13)* Conakry: **Rice Women Restaurant** — same templated-aggregator-only pattern
- *(pass 13)* Hamadan: **Komaj Pila** — "komaj" is verified only as a Hamadan sweet bread, not a business; likely a food name mistaken for a venue
- *(pass 13)* Harar: **Harla Cafe and Restaurant**, **Genet Kitfo**, **Dire Xayara** — all three appear only on a templated aggregator that reuses boilerplate copy across cities, while Harar's real venues (Fresh Touch, Mermaid Cafe) have Tripadvisor/Wikivoyage presence. Note "Dire Xayara" matches the name of a rural woreda, not a restaurant. Strong candidates for removal, but not without a second source
- *(pass 13)* Inhambane: **Bamboozi Beach Lodge** (no 2024-2026 confirmation it still trades) and **Pastelaria Ferroviario** (no reliable source under that name)
- *(pass 13)* Inhambane: the municipal market was rebuilt and reopened in August 2024 as **Mercado Central de Inhambane**; left as "Mercado Municipal" since that is still the name in common use, but worth a decision
- *(pass 13)* Juba: **Lotus Restaurant** — no listing anywhere, unlike every other Juba venue checked
- *(pass 13)* Majuro: **Frank K's Restaurant** and **DAR Coffee Corner** — single generic-content source each; the DAR source itself says Uliga, not the listed Delap
- *(pass 13)* Majuro: **Ri-Wut Corner** is real, but "Rita" specifically is unconfirmed within the Delap-Uliga-Djarrit strip
- *(pass 13)* Manado: **Klappertaart Huize** — the brand's confirmed outlets are Bogor and Denpasar, none in Manado
- *(pass 13)* Mysore: **Hotel Ayub Bawarchi** (no corroborating listing at all) and **Mahesh Prasad** (real, but listings put it in Chamrajpura, not squarely on Sayyaji Rao Road)
- *(pass 13)* Port Moresby: **Ribito Grill and Restaurant** — venue is real, but Waigani as its suburb is unconfirmed; **POM Restaurant** — listings put it on Munahu Street, Gordons, rather than "Central Port Moresby", on a weak source
- *(pass 13)* Siwa: **Adrere Amellal** is confirmed, but the "Sidi Jaafar" sub-location is not corroborated anywhere
- *(pass 13)* Tarawa: **Babes Place** — one generic-reading blog, no corroboration
- *(pass 13)* Turpan: **Guanghui Street snack zone** (8 occurrences) — no street by that name turns up in any Turpan source; possibly a mistransliteration

### F. Not findable under the listed name (14)

Real-looking venues that no source confirms under the name city-food.js uses. Same treatment as A.

- *(pass 1)* Aix-en-Provence: "Vino Loco" — no wine shop by this name found on rue d'Italie; only a same-named tapas restaurant on a different street turned up
- *(pass 7)* Baghdad: Khan Baghdad Restaurant — every search surfaces Beirut/Amman/Bahrain branches, no Baghdad location confirmed
- *(pass 1)* Guilin: "Jimo Bamboo Rice Restaurant" (Yangshuo) — no listing found under this name; "Lonely Bamboo Rice" turned up instead, possibly the same place
- *(pass 5)* Houston: Long Coffee (Asiatown/Midtown) and Cafe TH (EaDo) — no clear signal either way
- *(pass 4)* Izmir: "Boyozcu Ferit" (Alsancak) — no listing found under this name
- *(pass 7)* Lijiang: Mu Wan — a wild-mushroom-hotpot chain called "Muwang"/"Muwang" exists but the exact name/spelling "Mu Wan" wasn't independently confirmed
- *(pass 3)* Marseille: "Les Panisses" (Cours Julien) — only a stale ~2017 reference found, current status unclear
- *(pass 7)* Nanjing: Lan Laoda Noodles — no evidence found in English or Chinese-language searches
- *(pass 1)* Oranjestad: "Nos Cunucu" — no listing found under this name
- *(pass 9)* Ouarzazate: Restaurant Habiba (Avenue Mohammed V) — no listing found under this name; a similarly-regarded but differently-named/located spot (Restaurant Cafe Habous, Place El Mowahidine) turned up instead, not confident enough to swap in
- *(pass 9)* Pucon: Cerveceria Mestizo (Camino Pucon-Villarrica) — no evidence found either way; two real breweries on the same road (Cerveceria Wenu Pillan, Cerveceria Fryderup) could be candidates if this one turns out to be wrong, but that needs a human call
- *(pass 1)* San Salvador: "Pupuseria y Antojitos Guanaquitas" — only a same-named restaurant in Cleveland, Ohio turned up; local listing unconfirmed
- *(pass 7)* Varna: Zlatna Panna — no listing found under this name
- *(pass 8)* Zhaoqing: Boji Guozheng (Duanzhou Sixth Road) — no listing found under this name

### B. "No reliable listings either way" (9)

Cities with thin web coverage generally, not suspect venues specifically. Lowest expected yield per search.

- *(pass 10)* Aleppo: Hallab sweets (Aziziyah) and Bazerbashi (Aziziyah) — the well-known Hallab dynasty is headquartered in Tripoli, Lebanon rather than Aleppo, so this entry may be conflating the two; not confident enough to edit without a clearer source
- *(pass 10)* Encarnacion: El Quincho, Parrillada Don Emilio, Taberna La Cava, La Cabana — no reliable current listings found either way
- *(pass 10)* Gisenyi: Wifi Beach Restaurant — no reliable current listings found either way
- *(pass 10)* Kairouan: Brothers Food — no reliable current listings found either way
- *(pass 10)* Kinshasa: Le Voyageur, Restaurant N'Zanza, Le Cormoran — no reliable current listings found either way
- *(pass 10)* Libreville: Chez Paul — no reliable current listings found either way
- *(pass 10)* Marigot: Le Gout — no reliable current listings found either way
- *(pass 10)* Nakuru: Winston's Bar and Grill — no reliable current listings found either way
- *(pass 10)* The Valley: Sarjai's Restaurant — several signs point to a closure around 2017, but nothing confirms it either way; left in place pending a clearer source

### D. Judgement call — needs Jeff (7)

Cannot be resolved by research; someone has to decide.

- *(pass 2)* Chennai: Anjappar Chettinad (listed Chetpet), Karaikudi Restaurant (listed Alwarpet), and Sri Velu Military Hotel (listed Chintadripet) all have name/area mismatches against current listings — the real Velu Military Hotel is on Eldams Road, Teynampet, and a same-named Teynampet listing shows closed
- *(pass 2)* Chennai: Hotel Saravana Bhavan's T. Nagar flagship shows "temporarily closed" (parking-compliance dispute per local trade press) but the chain operates other Chennai branches — decide whether to point the listing at a different branch
- *(pass 2)* Fort-de-France: "Miza Restaurant" — the real "MIZA – L'Entrepôt" is an upscale tasting-menu spot in Rivière Roche, not a casual colombo place in the centre; may be the wrong venue for this dish entirely
- *(pass 2)* Oaxaca: "Tlayudas Libres" and "Tlayudas Dona Martha" look like the same business ("Tlayudas Libres Doña Martha," Calle de los Libres 212) listed twice under different names/addresses — needs reconciling into one entry
- *(pass 8)* Santa Cruz de la Sierra: Lo Nuestro (Equipetrol) — a same-named restaurant exists but serves different regional food and its Equipetrol location is unconfirmed
- *(pass 3)* Tirana: Oda's area is more accurately "near Blloku" than "in Blloku" (minor, no edit made)
- *(pass 8)* Tours: Le Tourangeau — the actual "Cafe Bar Le Tourangeau" is a low-rated sandwich/coffee bar that doesn't match the traditional-Touraine-menu description used across 4 dish entries; a better match description-wise is Le Bouchon Tourangeau, but this wasn't confirmed with enough confidence to edit

### C. Chain is real, the specific branch is not confirmed (5)

Low risk: the venue exists, only the branch/address is unverified.

- *(pass 4)* Jeju City: "Haenyeoui Jip" (Onpyeong) — this is a common format name for haenyeo-run seafood restaurants across several towns; no specific Onpyeong location confirmed
- *(pass 8)* Nagasaki: Ringer Hut Nagasaki Chuo (chain confirmed, exact branch unconfirmed), Chuwa and Seiyotei (no evidence found either way), Bistro Boa Vista (possibly confused with the real nearby "Bistro Bordeaux," which serves the same signature dish — worth checking before trusting either name)
- *(pass 4)* Nagoya: Kako Coffee's Fushimi branch unconfirmed (the chain itself is real and active)
- *(pass 5)* Niagara Falls: BeaverTails Table Rock — the chain's own store locator shows only one Niagara Falls location (Clifton Hill), no evidence of a Table Rock kiosk
- *(pass 4)* Tehran: Akbar Mashti's exact Vali-ye Asr branch address unconfirmed (the chain itself is real and active)

### E. Closure or relocation status ambiguous (5)

Worth a recheck later rather than now — these move on their own.

- *(pass 5)* Corfu: Mavromatis Kumquat — likely actually in Felekas, not Corfu Town; one listing for the Felekas site shows "temporarily closed"
- *(pass 11)* Jasper: The Other Paw Bakery Cafe (Patricia Street) — name and sister-bakery relationship check out, but no source confirms its wildfire-recovery status either way
- *(pass 11)* Jasper: Whistle Stop Pub (Whistlers Inn, Connaught Drive) — multiple listings describe it as still closed post-wildfire with no confirmed reopening date; not closing it out without a direct call to the venue
- *(pass 2)* Rimini: Mercato Coperto has a relocation/rebuild in progress — the venue is fine for now but the address may need updating later
- *(pass 1)* The Hague: "Garoeda" (Kneuterdijk 18A) — a "permanently closed" listing exists alongside signs it reopened/rebranded as "Garuda by Ron Gastrobar Indonesia" at the same address — needs a direct check before trusting either way

### Venue impact — what these 55 items actually touch

Every venue in city-food.js hangs off a named dish or drink
(`CITY_FOOD[city] = [{name, type, desc, places:[...]}]`), so each open item is a
place attached to specific dishes, not a free-standing listing. Resolved in full
on 2026-09-15 (all 55 items, including the 31 that describe their venues in prose
rather than in bold or quotes):

| | |
|---|---|
| Flagged venues | **75** across **51 cities** |
| Dish/drink entries they back | **132** |
| Dishes that would be left with **no** venue if all 75 were removed | **0** |
| Dishes that would be left with exactly **one** venue | **19** |

The unverified venues are not evenly spread — a few carry most of a city's page:

| Dishes backed | Venue |
|---|---|
| 8 | Turpan: Guanghui Street snack zone |
| 7 | Tarawa: Babes Place |
| 7 | Tirana: Oda |
| 6 | San Salvador: Pupuseria y Antojitos Guanaquitas |
| 5 | Harar: Harla Cafe and Restaurant |
| 4 | Kairouan: Brothers Food / Kinshasa: Restaurant N'Zanza / Tours: Le Tourangeau |

Turpan is the sharpest case: pass 13 found no street by that name in any Turpan
source and suspects a mistransliteration, yet it is the venue behind 8 of
Turpan's dishes.

**This makes the replacement rule safe to apply.** Removing every unverifiable
venue would not blank out a single dish on a single city page. These 19 dishes
are the only ones that would fall to a lone venue, so they are the ones where a
replacement should be sourced rather than the entry simply dropped:

| City | Dish | Would leave only |
|---|---|---|
| Chennai | Chettinad chicken | Ponnusamy Hotel |
| Encarnación | Asado paraguayo | Chipa Tia Churrasqueria |
| Encarnación | Chipa guasu | Mercado Municipal |
| Encarnación | Sopa paraguaya | Mercado Municipal |
| Guilin | Bamboo Rice and Stuffed Vegetables | Cloud 9 Restaurant |
| Guilin | Li River Shrimp | Riverside restaurants |
| Harar | Kitfo | Fresh Touch Restaurant |
| Harar | Shiro and Injera | Fresh Touch Restaurant |
| Houston | Vietnamese iced coffee | Le'Drip Coffee and Tea |
| Kinshasa | Fumbwa | Marche Central |
| Kinshasa | Poulet a la moambe | Chez Flore |
| Majuro | Banke Kalel (Pumpkin in Coconut Milk) | Majuro Saturday market |
| Majuro | Rice, Corned Beef and Johnnycake | Roadside johnnycake stands |
| Niagara Falls | BeaverTails | BeaverTails Clifton Hill |
| Oaxaca | Tlayudas | Mercado 20 de Noviembre |
| Oranjestad | Pastechi | The Pastechi House |
| The Valley | Grilled Whole Red Snapper | Palm Grove Bar & Grill |
| Tirana | Fergese Tirane | Mullixhiu |
| Tirana | Speca me gjize | Mullixhiu |

**The blocker is a missing decision rule.** Groups A, F and B have no exit
condition: "could not confirm" leaves the item open forever, which is exactly
how 55 of them accumulated. The standing rule against inventing facts correctly
forbids *asserting* a venue is fine, but says nothing about what to do instead.
A proposed rule, for Jeff to accept or reject: **a venue that survives both a
native-language search and an OpenStreetMap check with no source gets replaced
by a sourced venue in the same city and dish category, and the swap is logged
here.** With that rule, A, F and B terminate. Without it, they cannot.

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


## Re-verification pass 1 (2026-08-24) — high-priority batch

Checked the "high priority" list plus every "not web-verified at all" list from the
other batches (32 cities). Fixed two real closures in city-food.js:

| City | Fix |
|---|---|
| Ottawa | Nate's Deli's Sparks Street shop closed; current listings place the business in Nepean, note updated |
| New Orleans | Big Fisherman Seafood (Magazine St) confirmed permanently closed -> swapped for Porgy's Seafood Market |

**Cleared, all venues confirmed open with 2024-2026 evidence:** Andorra la Vella,
Zhangjiajie (minus one item below), Guilin (minus one item below), Oranjestad
(minus one item below), San Salvador (minus one item below), Mashhad, Denizli,
Aix-en-Provence (minus one item below), Stuttgart, Philadelphia, Jaipur, Pisa,
Palermo, Otaru, Nelspruit, Dijon, Austin, New Orleans (aside from the fix above),
Jinghong.

**Still uncertain, no evidence found either way — worth a targeted look, not a guess:**
- Guilin: "Jimo Bamboo Rice Restaurant" (Yangshuo) — no listing found under this name; "Lonely Bamboo Rice" turned up instead, possibly the same place
- Oranjestad: "Nos Cunucu" — no listing found under this name
- San Salvador: "Pupuseria y Antojitos Guanaquitas" — only a same-named restaurant in Cleveland, Ohio turned up; local listing unconfirmed
- The Hague: "Garoeda" (Kneuterdijk 18A) — a "permanently closed" listing exists alongside signs it reopened/rebranded as "Garuda by Ron Gastrobar Indonesia" at the same address — needs a direct check before trusting either way
- Aix-en-Provence: "Vino Loco" — no wine shop by this name found on rue d'Italie; only a same-named tapas restaurant on a different street turned up

**Minor area/address corrections spotted (venues themselves are open, just double-check the listed neighborhood before next edit):** Bagli Kokorec (Denizli — listed as "Denizli centre," current listings place it in Tavas), Bar Touring (Palermo — now Via Lincoln not Via Ruggero Settimo), Samrat Restaurant & Santhosh Bhojnalaya (Jaipur — area names drifted), Chez Léon (Dijon — now 20 Rue des Godrans), Le Poivre d'Ane & Cafe de Verdun (Aix — address/branding details), Icebear Restaurant (Negombo — now "Icebear Beach Guesthouse and Restaurant," Lewis Place).

**Malé and Poznań were not found by the research agents** — their city-food.js keys
use the accented spelling (`"Malé"`, `"Poznań"`), not the plain-ASCII spelling the
agents searched for. Not actually a data problem — just re-run with the accented
names.

**Not reached — session's web search budget ran out mid-pass, still need checking:**
Rimini, Chennai, most of Tampa (only Columbia Restaurant + Brocato's Sandwich Shop
confirmed; Brocato's is open but filed Chapter 11 in 2024, worth a note), Negombo's
generic street-vendor entries, Fort-de-France, Faro, Portland (Oregon), Oaxaca,
and the accented-spelling re-runs for Malé and Poznań. Resume here next pass.

## Re-verification pass 2 (2026-08-25) — pass-1 leftovers

Finished the 10 cities the search budget cut off last time (Rimini, Chennai, rest
of Tampa, Negombo's generic entries, Fort-de-France, Faro, Portland OR, Oaxaca,
plus Malé/Poznań re-run with their accented keys — both were fine all along, the
first pass just searched the wrong spelling). Fixed in city-food.js:

| City | Fix |
|---|---|
| Rimini | "Osteria del Tempo Perso" is actually in Ravenna, not Rimini -> swapped for Osteria Tiresia (confirmed, Rimini centro); "Dalla Lella" area corrected Borgo San Giuliano -> Viale Rimembranze; "La Marianna al Lido" doesn't exist -> corrected to Trattoria La Marianna, Borgo San Giuliano |
| Tampa | Mauricio Faedo's Bakery was acquired by La Segunda in 2022, renamed Faedo Family Bakery, area corrected Tampa Heights -> Seminole Heights; Naviera Coffee Mills closed its Ybor walk-in storefront in 2024 (still roasts wholesale) -> swapped for Tabanero Cigars, reviewers' pick for best cafe con leche in Ybor |
| Faro | Casa Algarvia unfindable under that name -> Rua Baptista Lopes 30A corrected to O Cabaz Algarvio (2 slots) |
| Portland OR | Doe Donuts area corrected SE Stark -> NE Sandy Blvd; Pacific Pie Company closed (both locations), removed; Ned Ludd closed -> Cafe Olli, same address; Cascade Brewing Barrel House closed permanently June 2024 (founder's death), removed, no direct successor found; Stumptown Coffee Roasters' Ace Hotel cafe closed, moved 2 blocks to the 11W building, area updated |
| Poznań | Bar mleczny Apetyt confirmed closed -> Bar Mleczny Pod Arkadami (Plac Ratajskiego) |

**Cleared, all venues confirmed:** Malé, Fort-de-France (minus Miza below), Faro
(aside from the fix above), Portland (aside from the fixes above), Oaxaca (minus
the item below).

**Still uncertain, worth a targeted look, not a guess:**
- Chennai: Hotel Saravana Bhavan's T. Nagar flagship shows "temporarily closed" (parking-compliance dispute per local trade press) but the chain operates other Chennai branches — decide whether to point the listing at a different branch
- Chennai: Anjappar Chettinad (listed Chetpet), Karaikudi Restaurant (listed Alwarpet), and Sri Velu Military Hotel (listed Chintadripet) all have name/area mismatches against current listings — the real Velu Military Hotel is on Eldams Road, Teynampet, and a same-named Teynampet listing shows closed
- Fort-de-France: "Miza Restaurant" — the real "MIZA – L'Entrepôt" is an upscale tasting-menu spot in Rivière Roche, not a casual colombo place in the centre; may be the wrong venue for this dish entirely
- Oaxaca: "Tlayudas Libres" and "Tlayudas Dona Martha" look like the same business ("Tlayudas Libres Doña Martha," Calle de los Libres 212) listed twice under different names/addresses — needs reconciling into one entry
- Rimini: Mercato Coperto has a relocation/rebuild in progress — the venue is fine for now but the address may need updating later

**Minor, low-risk, no edit made:** Tampa's Alessi Bakery moved ~500 ft within
West Tampa (same area label still correct); Tampa's Rusty Pelican is open now
but has a reported redevelopment/lease-expiry pointing at ~2027; Poznań's
Cukiernia Kandulski address varies by source (Jeżyce branch vs. a second
address) — the business itself is fine.

## Re-verification pass 3 (2026-08-25) — medium-priority batch, partial

Started the 27-city "medium priority" list. Got through about half before this
session's web-search budget ran out entirely (hard limit, not per-agent — every
later attempt failed, including direct search fallbacks). Fixed in city-food.js:

| City | Fix |
|---|---|
| Marseille | Toinou Coquillages (Noailles) confirmed closed since Mar 2024, the space is now a different business -> removed, no confirmed replacement found |
| Salzburg | S'Nockerl im Hotel Elefant renamed Wirtshaus Elefant under a new tenant (2025), same address -> name updated |
| Riga | Labietis taproom area corrected Miera iela -> Aristidas Briana iela, near Central Market |
| Tallinn | Porgu confirmed closed ("we are closed," no reopening date) -> removed, Hell Hunt and III Draakon still cover the same drink |
| Tirana | "Sofra Tiranase" doesn't appear to be a real restaurant (only turns up as the name of a cultural festival) -> removed from both dishes that listed it |
| Manchester | Hip Hop Chip Shop closed its Ancoats site Mar 2025 -> swapped for Tony's Chippy (also Ancoats, confirmed); Trove's original chain (Ancoats/Levenshulme/Wilmslow) closed 2024, only a relaunched Ancoats-only shop survives -> dropped "Levenshulme" from the area |

**Cleared, all venues confirmed:** Chamonix-Mont-Blanc, Strasbourg, Riga (aside
from the fix above), Tallinn (aside from the fix above), Manchester (aside from
the fixes above), Batumi, Bishkek, and most of Marseille and Salzburg (see below).

**Still uncertain, worth a targeted look, not a guess:**
- Marseille: "Les Panisses" (Cours Julien) — only a stale ~2017 reference found, current status unclear
- Salzburg: Gasthaus Wilder Mann had a kitchen fire in July 2025 with a planned Nov 22 2025 reopening — status since then not confirmed, worth checking first next pass since it's the most time-sensitive item outstanding
- Tirana: Oda's area is more accurately "near Blloku" than "in Blloku" (minor, no edit made)

**Not reached at all — this session's search budget is fully exhausted, needs a
fresh session (or a raised `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`) to finish:**
- Lyon, Valencia, Helsinki, Hamburg, Cologne (venue lists already pulled, just
  need searching — see the agent transcript for the full extracted list)
- Salzburg: Cafe Konditorei Fuerst, Konditorei Holzermayr, Schatz Konditorei,
  Balkan Grill Walter, Wuerstlstand am Gruenmarkt, Zipfer Bierhaus, Stieglkeller,
  Sternbraeu, Gasthof Goldgasse, Stiegl-Brauwelt, Cafe Tomaselli, Cafe Bazar
- Bodrum: Otantik Ocakbasi, Sunger Pizza Restaurant, Sade Bodrum, Mimoza,
  Macakizi, Sait Balik
- All of: Izmir (data confirmed present under the accented key "İzmir" — same
  spelling trap as Malé/Poznań earlier, re-run with that spelling), Malaga
  (same thing, key is "Málaga"), Muscat, Tehran, Yokohama, Nagoya, Kamakura,
  Jeju City, Taichung, Malacca, Hoi An — none of these were reached before the
  budget ran out; nothing in them has been checked yet

## Re-verification pass 4 (2026-08-25) — medium-priority batch complete

Finished the rest of the 27-city medium-priority list (Izmir/Malaga needed their
accented keys, İzmir/Málaga, same spelling trap as before). Fixed in city-food.js:

| City | Fix |
|---|---|
| Helsinki | Corona Bar relocated from Punavuori to Vallila (Konepaja) in 2024 -> area updated |
| Salzburg | Zipfer Bierhaus closed Feb 2025 after 200 years, site reopened 2026 as Ritzerwirt -> swapped in; "Wuerstlstand am Gruenmarkt" wasn't a real business name -> corrected to Schuetzinger Wuerstlstand, the one verifiably real vendor at that market |
| Malaga | Chiringuito El Cachalote's actual location is La Malagueta, not Pedregalejo; La Chancla's is Pedregalejo, not Playa de la Misericordia -> both areas corrected |
| Izmir | Dostlar Firini area corrected Karatas -> Alsancak |
| Muscat | Ofair Omani Restaurant area corrected Mutrah -> Al Ghubrah |
| Yokohama | "Yokohama Beer Umaya no Tavern" isn't the real name -> corrected to Umaya no Shokutaku (UMAYA by Yokohama Beer) |
| Nagoya | Nanaya Sakae doesn't appear to exist (the real matcha brand has no Nagoya shop) -> removed |
| Kamakura | Hachinoki Kita-Kamakura Honten's note fixed (it's by Tokeiji temple, not Kenchoji); Sasa no Ha and Yorozuya Honten both appear to be mismatched/non-existent listings -> both removed |
| Malacca | Kocik Kitchen closed, same family reopened the space as Kocik Heritage Nyonya Restaurant -> swapped in; Ee Ji Ban Chicken Rice Ball area corrected to Jalan Melaka Raya; Baba Charlie Nyonya Cake area corrected to Jalan Tengkera |

**Cleared, all venues confirmed:** Chamonix-Mont-Blanc, Strasbourg, Lyon, Valencia
(aside from the fix above), Hamburg, Cologne, Bodrum, Batumi, Bishkek, Salzburg
(aside from the fixes above, including Gasthaus Wilder Mann which did reopen after
its 2025 fire), Malaga (aside from the fixes above), Izmir (aside from the fix
above), Tehran, Jeju City, Taichung, Hoi An, Muscat (aside from the fix above),
Yokohama (aside from the fix above), Nagoya (aside from the fixes above),
Kamakura (aside from the fixes above), Malacca (aside from the fixes above).
The full 27-city medium-priority list is now done.

**Still uncertain, worth a targeted look, not a guess:**
- Marseille: "Les Panisses" (Cours Julien) — only a stale ~2017 reference found
- Izmir: "Boyozcu Ferit" (Alsancak) — no listing found under this name
- Tehran: Akbar Mashti's exact Vali-ye Asr branch address unconfirmed (the chain itself is real and active)
- Nagoya: Kako Coffee's Fushimi branch unconfirmed (the chain itself is real and active)
- Jeju City: "Haenyeoui Jip" (Onpyeong) — this is a common format name for haenyeo-run seafood restaurants across several towns; no specific Onpyeong location confirmed

**Minor, low-risk, no edit made:** Helsinki's Kanniston Leipomo (Toolo branch
unconfirmed, chain is real) and Bryggeri Helsinki (area may be Kruununhaka rather
than Kluuvi); Hamburg's Kleine Haie Grosse Fische (may be St. Pauli rather than
Karolinenviertel); Bodrum's Sait Balik (founding date says "1970s," sources say
1993); Lyon's Chez Hugon (mid-rename to "Les Vilaines," same food, worth a look
once the rename is final); Yokohama's Yoshimuraya (moved a street over in 2023,
same neighborhood); Nagoya's Yamamotoya Honten (relocated within Sakae to the
BINO Sakae building).

## Re-verification pass 5 (2026-08-25/26) — low-priority batch complete

Finished the 10-city low-priority list (Thessaloniki, Nairobi, Corfu were done
earlier in this pass; Washington D.C.'s key is "Washington, D.C." with commas).
Fixed in city-food.js:

| City | Fix |
|---|---|
| Washington, D.C. | HalfSmoke (Shaw) closed May 2025, its 2026 reopening is in a different neighborhood (Skyland/Anacostia) -> removed, Ben's Chili Bowl and DCity Smokehouse still cover the dish |
| Houston | Les Ba'get relocated from Montrose to Houston Heights -> area updated |
| Boston | Atha's Deli has no Beverly location (never did) -> corrected to Lynn, its real address |
| Seattle | Monster Dogs no longer runs its nightly Capitol Hill street cart (catering/events only now) -> removed |
| Niagara Falls | Willow Cakes and Pastries closed its cafe/shop, now mail-order only -> swapped for Treadwell Cuisine; Taps Brewhouse's real address is Queen Street not Lundy's Lane, corrected (3 occurrences); The Flour Mill Scratch Kitchen's real address is Fallsview Boulevard not Queen Street, corrected |
| Delhi | Nagpal Chole Bhature's Kamla Nagar branch unconfirmed / likely area mismatch -> swapped for Bille Di Hatti, a confirmed real Kamla Nagar chole-bhature spot |
| Nairobi | Amaica Restaurant relocated from Kilimani to Westlands -> area updated (both occurrences) |

**Cleared, all venues confirmed:** Thessaloniki, Cape Town, and the rest of
Washington D.C., Houston, Boston, Seattle, Niagara Falls, Delhi, Nairobi, Corfu
not covered by the fixes above. The full 10-city low-priority list is now done.

**Still uncertain, worth a targeted look, not a guess:**
- Niagara Falls: BeaverTails Table Rock — the chain's own store locator shows only one Niagara Falls location (Clifton Hill), no evidence of a Table Rock kiosk
- Corfu: Mavromatis Kumquat — likely actually in Felekas, not Corfu Town; one listing for the Felekas site shows "temporarily closed"
- Houston: Long Coffee (Asiatown/Midtown) and Cafe TH (EaDo) — no clear signal either way

**Minor, low-risk, no edit made:** Nairobi's Burma Market (commonly described as
Eastlands/near Gikomba rather than specifically Buruburu, market itself is
confirmed active either way).

## Re-verification pass 6 (2026-08-25/26) — batch 3-4, partial

Worked through the 24-item batch-3-4 list (some entries are single dishes within
a city, not the whole city — Glasgow/tablet, Agra/chaat, Nanjing/secondary
noodle shops). Search budget ran out twice mid-batch; picked back up each time.
Fixed in city-food.js:

| City | Fix |
|---|---|
| Baghdad | Dawa Restaurant area corrected Karrada -> Jadriya; Beiruti Cafe area corrected Abu Nuwas -> Karkh (west bank) |
| Qom | Haj Khalifeh Ali Rahbar is actually a Yazd business, not Qom -> swapped for Saedinia Sohan, a real Qom sohan house near the shrine |
| Maseru | Lehaha Grill at Avani Maseru no longer appears among the hotel's restaurants -> swapped for Mohokare Restaurant, same hotel (2 occurrences) |
| Marmaris | TurgutReis Balik's real neighborhood is Armutalan, not "Marmaris centre" -> corrected (2 occurrences) |
| Carcassonne | Le Chaudron is actually inside La Cite (rue Saint-Jean), not Bastide Saint-Louis -> corrected (2 occurrences); "La Cite du Vin wine shop" doesn't seem to be a real name -> corrected to Le Comptoir de la Cite, a real wine shop/tasting bar at the citadel (2 occurrences) |
| Durrës | Pista e Vogel Iliria's real location is the beachfront/seaside, not "Durres centre" -> corrected |
| Agadir | Le Parasol Bleu closed, the same beachfront spot reopened fully renovated as Da Celsi -> swapped in |
| Rotterdam | El Aviva (birthplace of the kapsalon) is actually in Delfshaven, not Beverwaard -> corrected |
| Perth | Petition Kitchen now just goes by "Petition" -> renamed (2 occurrences); Petition Wine Bar is now "Wine Merchant," same location -> renamed |
| Glasgow | Mackintosh at the Willow was renamed The Mackintosh Tearooms by the National Trust for Scotland in Feb 2026 -> renamed |

**Cleared, all venues confirmed:** Quanzhou, Abidjan, Kunming, Kuşadası (was
checked under its accented key), Varna, Rotterdam (aside from the fix above),
most of Baghdad/Qom/Maseru/Marmaris/Carcassonne/Durrës/Agadir/Perth/Glasgow
(aside from the fixes above).

**Still uncertain, worth a targeted look, not a guess:**
- Baghdad: Khan Baghdad Restaurant — every search surfaces Beirut/Amman/Bahrain branches, no confirmation a Baghdad location exists
- Varna: Zlatna Panna and Bakery Ticha — no clear listing found for either
- Perth: Kailis' Fish Market Cafe, Fraser's Kings Park, Tra Vinh, Chopsticks Viet, Le Vietnam, Sayers Sister, Chu Bakery, Little Willy's, Nowhereman Brewing, Gage Roads Freo (parent brewery confirmed active, this specific venue not independently confirmed) — not reached before the search budget ran out twice
- Kampala: none of its 13 venues (Cafe Javas, The Seasons Bistro, 2K Restaurant, Shaka Zulu Foods, Ekitoobero Market Kitchen, Jeans Pub, Kungo Maito, The Lawns, Little Ritz in Africa, Endiro Coffee, 1000 Cups Coffee House, Bubbles O'Leary, Cayenne Restaurant and Lounge) were reached
- Agra: Deviram Sweets (street chaat) — not reached
- Dali: Yan Family Compound (Xizhou) — not reached
- Lijiang: Heshu Restaurant, Mu Wan — not reached
- Nanjing: Xiang Ji Noodle House, Lan Laoda Noodles (the two secondary Pidu Noodles shops; the flagship Liu Chang Xing is already confirmed) — not reached
- Phu Quoc: Bien Xanh Restaurant, Be Ghe Seafood Restaurant, Song Le Restaurant, Xin Chao Restaurant, Bun Quay Kien Xay, Khai Hoan Fish Sauce Factory, Hung Thanh Fish Sauce, Sim Son sim wine house, Bay Gao Sim Wine — not reached (Com Bac 123 was checked earlier and confirmed open under a slightly different current name, "Com Bac Restaurant")
- Boracay: Smoke Resto, Cha Cha's Beach Cafe, Mang Inasal, Jasper's Tapsilog, Real Coffee and Tea Cafe, Halo Mango, Jonah's Fruit Shake and Snack Bar, Cocomangas Shooter Bar — not reached
- Selçuk: Amazon Antique Restaurant, Ejder Restaurant, Selcuk Koftecisi, Mehmet and Ali Baba Kebab House, Nisanyan Evleri Restaurant, Artemis Restaurant and Wine House — not reached

A scheduled task ("resume-food-verification") is set to pick this project back up
automatically once the search quota resets. It will finish the items above, then
continue on to the remaining batches (5, staged-32, 7-9, 6, 11-13) listed further
up this file's task history.

## Re-verification pass 7 (2026-08-26) — batch 3-4 complete

Finished the rest of the batch 3-4 list. Fixed in city-food.js:

| City | Fix |
|---|---|
| Phu Quoc | Song Le Restaurant is actually in Ham Ninh, not Duong Dong -> corrected (2 occurrences) |
| Perth | Little Willy's real neighborhood is Northbridge, not Mount Lawley -> corrected |
| Kampala | "The Seasons Bistro" -> corrected to "Seasons Bistro" (its real name) |
| Nanjing | Xiang Ji Noodle House's real location is Mingwa Lane, Qinhuai, not Gulou -> corrected |
| Boracay | Cha Cha's Beach Cafe and Real Coffee and Tea Cafe are both actually in Station 2, not Station 1 -> corrected (3 and 2 occurrences) |

**Cleared, all venues confirmed:** Varna's Bakery Ticha, Perth's Kailis' Fish
Market Cafe/Fraser's Kings Park/Tra Vinh/Chopsticks Viet/Le Vietnam/Sayers
Sister/Chu Bakery, Kampala (aside from the fix above and the item below), Agra's
Deviram Sweets, Dali's Yan Family Compound, Lijiang's Heshu Restaurant, Phu
Quoc's Bien Xanh/Be Ghe/Xin Chao/Bun Quay Kien Xay/Khai Hoan/Hung Thanh/Sim
Son/Bay Gao, all of Boracay aside from the fixes above, all of Selçuk. The full
batch 3-4 list is now done.

**Still uncertain, worth a targeted look, not a guess:**
- Baghdad: Khan Baghdad Restaurant — every search surfaces Beirut/Amman/Bahrain branches, no Baghdad location confirmed
- Varna: Zlatna Panna — no listing found under this name
- Perth: Nowhereman Brewing — merged with Otherside Brewing Co. in 2023, may now trade as "Otherside Of Nowhere," status is transitional/mixed signals
- Perth: Gage Roads Freo — the specific Fremantle "A Shed" venue is confirmed, separate from the parent brewery
- Kampala: Jeans Pub — no listing found under this name; Bubbles O'Leary's — one source shows a possible "PANDORA by Bubbles O'Learys" rebrand, worth a recheck
- Lijiang: Mu Wan — a wild-mushroom-hotpot chain called "Muwang"/"Muwang" exists but the exact name/spelling "Mu Wan" wasn't independently confirmed
- Nanjing: Lan Laoda Noodles — no evidence found in English or Chinese-language searches

**Minor, low-risk, no edit made:** Phu Quoc's Sim Son and Bay Gao sim-wine
venues are technically in Duong To, a few km outside Duong Dong proper, but
close enough that the existing area label isn't really wrong.

## Re-verification pass 8 (2026-08-26) — batch 5 complete

Finished the 13-city batch-5 list. Fixed in city-food.js:

| City | Fix |
|---|---|
| Himeji | "Ekisoba Manpuku" isn't a real brand name -> corrected to Ekisoba Maneki (the actual station-soba chain); its "Otemae-dori branch" -> corrected to Eki Soba Otemae; "Cafe Almond" doesn't appear to exist -> swapped for Cafe de Muche, the confirmed real almond-toast originator |
| Tours | Cave de la Dive Bouteille is actually a Bourgueil venue, not in Tours -> swapped for La Cave se Rebiffe, a real Tours wine bar (2 occurrences); La Fouee Tourangelle wasn't found at its listed address -> corrected to Comme Autrefouee on Rue de la Monnaie |
| Reims | Le Wine Bar by Le Vintage's real address is Place du Forum, not Rue Colbert -> corrected (2 occurrences) |
| Gent | 't Oud Clooster's real address is Zwartezustersstraat, not Zeugsteeg -> corrected (2 occurrences) |
| Isfahan | "Shahrzad Esfahani" appears to be the same restaurant as "Shahrzad Restaurant" (already listed) under a different name in the same dish entry -> removed the duplicate |

**Cleared, all venues confirmed:** Kanazawa, Managua, Zhaoqing (aside from one
uncertain item below), Manzhouli, Santa Cruz de la Sierra (aside from one
uncertain item below), Marsa Alam, Nagasaki (aside from a few uncertain items
below), Lviv, Isfahan (aside from the fix above), most of Himeji/Tours/Reims/Gent
aside from the fixes above.

**Still uncertain, worth a targeted look, not a guess:**
- Zhaoqing: Boji Guozheng (Duanzhou Sixth Road) — no listing found under this name
- Santa Cruz de la Sierra: Lo Nuestro (Equipetrol) — a same-named restaurant exists but serves different regional food and its Equipetrol location is unconfirmed
- Nagasaki: Ringer Hut Nagasaki Chuo (chain confirmed, exact branch unconfirmed), Chuwa and Seiyotei (no evidence found either way), Bistro Boa Vista (possibly confused with the real nearby "Bistro Bordeaux," which serves the same signature dish — worth checking before trusting either name)
- Tours: Le Tourangeau — the actual "Cafe Bar Le Tourangeau" is a low-rated sandwich/coffee bar that doesn't match the traditional-Touraine-menu description used across 4 dish entries; a better match description-wise is Le Bouchon Tourangeau, but this wasn't confirmed with enough confidence to edit

## Re-verification pass 9 (2026-08-26) — staged-32 leftovers complete

Checked every venue left over from the original 32-city staged batch, plus all
of Pucon (only 5 of its venues were confirmed back in that first pass). Fixed
in city-food.js:

| City | Fix |
|---|---|
| Pilsen | Pivovar Groll confirmed closed (Czech business registry + brewery-tracking site both list it defunct) -> swapped for Pivovar Raven in two dish entries; removed the duplicate mention in the drink entry that already listed Raven separately |
| Ouarzazate | Chez Talout's real location is on the Skoura road east of town, not "Tifoultoute road, west of town" -> corrected (3 occurrences) |
| Pucon | Menta Negra relocated to Camino Internacional (Unimarc parking) -> area corrected (3 occurrences); La Maga relocated to Alderete corner Fresia -> area corrected (2 occurrences) |

**Cleared, all venues confirmed:** Sucre's Los Balcones, Santiago de Cuba's
Santiago 1900 (open but government-run with inconsistent food quality per
reviews — not a data error, just a heads-up), Sochi's Adler Trout Farm, Santa
Marta's Burukuka, Kashan's Ehsan House, Trincomalee's Anna Pooram, Moshi's Deli
Chez, and the rest of Pucon (Puerto Pucon, Trawen, Mercado Municipal de Pucon,
Ecole!, Feria Artesanal de Pucon, Mamas y Tapas, Cassis, Latitude 39).

**Still uncertain, worth a targeted look, not a guess:**
- Ouarzazate: Restaurant Habiba (Avenue Mohammed V) — no listing found under this name; a similarly-regarded but differently-named/located spot (Restaurant Cafe Habous, Place El Mowahidine) turned up instead, not confident enough to swap in
- Pucon: Cerveceria Mestizo (Camino Pucon-Villarrica) — no evidence found either way; two real breweries on the same road (Cerveceria Wenu Pillan, Cerveceria Fryderup) could be candidates if this one turns out to be wrong, but that needs a human call

The 32-city staged batch and all its leftover items are now fully closed out.

## Re-verification pass 10 (2026-08-26) — batch 7-9 weaker secondary picks

Checked the 28-city "weaker secondary picks" list from batches 7-9 (Aleppo,
Encarnacion, Douala, Serekunda, Surat Thani, Kermanshah, Kairouan, Gaborone,
Kinshasa, Saipan, Tegucigalpa, Vladivostok, Libreville, Marigot, Bamako,
Bentota, Recife, Nakuru, Chetumal, Gisenyi, Constantine, Battambang, Abha, The
Valley, Apia, Thimphu, Maun, Mandalay). Fixed in city-food.js:

| City | Fix |
|---|---|
| Aleppo | Beit Wakil confirmed closed (under reconstruction since the 2012 fighting, still not reopened) -> removed from all 3 dish entries; each already had Beit Sissi or Al-Kommeh listed as a working alternative, so no replacement was needed |
| Douala | Saga Africa and La Fourchette both really in Akwa, not Bonapriso/Bonanjo -> area corrected (4 + 2 occurrences) |
| Serekunda | Paradiso Restaurant, African Queen Restaurant, Scala Restaurant, Sea Shells Bar and Restaurant are really on the Kololi/Senegambia strip, not central Serekunda -> area corrected; The Clay Oven is really in Fajara -> area corrected |
| Kinshasa | Chez Flore closed its Gombe location June 2025 and moved to Barumbu -> area corrected (3 dish entries); Chez Tintin is really in Kinsuka (Ngaliema), not Gombe -> area corrected (2 occurrences) |
| Saipan | Herman's Modern Bakery moved to As Lito/Dan Dan decades ago, not still in Chalan Kanoa -> area corrected |
| Tegucigalpa | Duncan Maya is really on Avenida Cristobal Colon, not "Avenida Juan Gutemberg" (not a real street) -> corrected (2 occurrences); The Market is inside the Hotel InterContinental near Mall Multiplaza, not "Boulevard Morazan" -> corrected (3 occurrences) |
| The Valley (Anguilla) | Roy's Bayside Grill confirmed closed (44-year run, property sold) -> removed, no confirmed replacement found; Smokey's at the Cove confirmed closed (destroyed by Hurricane Irma in 2017, site is now just a watersports park) -> removed, no confirmed replacement found; B&D's BBQ is really in Long Bay Village, not South Hill -> area corrected |

**Cleared, all venues confirmed:** Surat Thani's Lucky Restaurant, Gaborone's
Botswanacraft Restaurant and Beef Baron, Saipan's Country House Restaurant,
Vladivostok's Fantome and Ogonek Grill and Bar, Libreville's L'Odika, Bamako's
Amandine, Recife's Seu Luna, Chetumal's Restaurante Padilla, Gisenyi's Roxy Bar
and Restaurant, Thimphu's Zombala Restaurant, and Maun's The Old Bridge
Backpackers (open, but flagged by one reviewer for inconsistent upkeep — not a
data error).

**Still uncertain, worth a targeted look, not a guess:**
- Aleppo: Hallab sweets (Aziziyah) and Bazerbashi (Aziziyah) — the well-known Hallab dynasty is headquartered in Tripoli, Lebanon rather than Aleppo, so this entry may be conflating the two; not confident enough to edit without a clearer source
- Encarnacion: El Quincho, Parrillada Don Emilio, Taberna La Cava, La Cabana — no reliable current listings found either way
- Kairouan: Brothers Food — no reliable current listings found either way
- Kinshasa: Le Voyageur, Restaurant N'Zanza, Le Cormoran — no reliable current listings found either way
- Libreville: Chez Paul — no reliable current listings found either way
- Nakuru: Winston's Bar and Grill — no reliable current listings found either way
- Marigot: Le Gout — no reliable current listings found either way
- Gisenyi: Wifi Beach Restaurant — no reliable current listings found either way
- The Valley: Sarjai's Restaurant — several signs point to a closure around 2017, but nothing confirms it either way; left in place pending a clearer source

## Re-verification pass 11 (2026-08-26) — batch 6 remaining items

Checked the last unresolved items from batch 6: Jasper AB's brewpub/pub/pizza/
bakery cluster (Jasper was hit by a major wildfire in July 2024 that destroyed
roughly a third of the town), plus judgment-call venues in Melbourne, Vancouver,
Montreal and Rhodes. No file edits were needed — every venue's name and area in
city-food.js already matched what turned up.

**Cleared, all venues confirmed:** Jasper Brewing Company (survived the fire,
reopened after renovation in May 2025), Jasper Pizza Place (reopened, listed
on the Municipality of Jasper's official "what's open" page), Melbourne's
Hella Good (Fitzroy location is real), Vancouver's Kirin Restaurant/Cambie
Village and The Fish Counter/Mount Pleasant (both already correctly named and
located — not Granville Island), Montreal's Chez Claudette (Plateau
Mont-Royal), Rhodes' Tamam (New Town, Georgiou Leontos).

**Still uncertain, worth a targeted look, not a guess:**
- Jasper: Whistle Stop Pub (Whistlers Inn, Connaught Drive) — multiple listings describe it as still closed post-wildfire with no confirmed reopening date; not closing it out without a direct call to the venue
- Jasper: The Other Paw Bakery Cafe (Patricia Street) — name and sister-bakery relationship check out, but no source confirms its wildfire-recovery status either way

## Re-verification pass 12 (2026-08-26) — batches 11-13 thinnest-coverage cities, partial

Ran 3 parallel research batches across the last 25 thin-coverage cities (Port
Moresby, Zhoushan, Olomouc, Mysore, Hamadan, Conakry, Eilat, Inhambane,
Zhangye, Turpan, Juba, Bangui, Ziguinchor, Laayoune, Khartoum, Manado,
Mamoudzou, Visby, Tamanrasset, Siwa Oasis, Ghardaia, Karimabad, Gilgit, Harar,
Goma, plus the Pacific micro-capitals Yaren/Weno/Funafuti/Tarawa/Majuro). The
session's WebSearch budget ran out partway through, so only Khartoum,
Mamoudzou, Tamanrasset and Ghardaia got a full live check; everything else got
partial or no live search (the fallback web_fetch to search engines and review
sites is non-functional in this environment — only Wikipedia/Wikivoyage load).
Fixed in city-food.js from the venues that did get a full check:

| City | Fix |
|---|---|
| Khartoum | Al Salam Rotana restaurant is really in Khartoum proper (Africa Road), not Omdurman -> area corrected (2 occurrences) |
| Ghardaia | Taqimit N Tizafri's real name is Taqimit Tizefri N Tacha, and it's in Bounoura (a separate M'zab town), not Ghardaia town itself -> name and area corrected (5 occurrences); Hotel Les Rostemides has been renamed Hotel M'Zab (ex Les Rostemides) -> name corrected (2 occurrences) |
| Mamoudzou | Hippocampe is really in Kaweni, not "Mamoudzou centre" -> area corrected (3 occurrences) |

**Cleared, all venues confirmed:** Mamoudzou's Auberge du Rond-Point and Le
Moana; Tamanrasset's Hotel Tahat; Ghardaia's Hotel El Djanoub restaurant.

**Flagged, not edited — genuinely unresolved conditions:**
- Khartoum: Bait Al-Sudan could not be found under that name anywhere (nearest matches are different businesses); the rest of the city's venues are only weakly sourced and their status is uncertain given the 2023-2025 conflict and the city's gradual reopening since its March 2025 recapture
- Tamanrasset: Tassili Restaurant and Sahara Taste Restaurant — the only source for both is a low-credibility travel-blog template reused verbatim for a different city, not trustworthy either way
- Goma (DRC): under M23 control since January 2025 — every venue there (Rumoka/Goma Serena Hotel, Petit Bruxelles, Lac Kivu Lodge, Le Chalet) needs active reconfirmation, not just a leftover UNCERTAIN tag
- Juba: severe ongoing instability, zero live search reached — needs a dedicated re-check before any of its venues are trusted
- Manado, Bangui, Ziguinchor, Laayoune, Zhoushan, Olomouc, Hamadan, Conakry, Weno, Tarawa, Harar: no live search reached any source for these cities' named venues at all

**Not yet attempted:** Port Moresby, Mysore, Eilat, Inhambane, Karimabad,
Gilgit, Visby, Siwa Oasis, Yaren, Funafuti, Majuro got only partial,
low-confidence Wikipedia/Wikivoyage cross-references (no live review data) —
worth a full re-run rather than treating any of it as settled. Two low-risk
naming leads worth a look next time: Mysore's "Hanumanthu Restaurant" may
actually be "Hanumanthu Mess" in Mandi Mohalla, not Nazarbad; and Port
Moresby's Airways Hotel restaurant may trade as "Poolside at Airways" rather
than "Vue Restaurant."

This pass could not be completed with the search budget available in this
session — resuming once quota resets is the next step (see the
"resume-food-verification" scheduled task).

## Re-verification pass 13 (2026-08-26) — batches 11-13, nearly complete

Picked up where pass 12 stopped. Four parallel research batches covered the 21
remaining thin-coverage cities plus the five Pacific micro-capitals: Port
Moresby, Mysore, Eilat, Inhambane, Zhoushan, Zhangye, Turpan, Hamadan,
Karimabad, Gilgit, Siwa Oasis, Manado, Conakry, Juba, Bangui, Ziguinchor,
Laayoune, Harar, Goma, Yaren, Weno, Funafuti, Tarawa and Majuro. The session's
WebSearch budget ran out during the Visby batch, so Visby is only partly
checked and Olomouc was not reached at all — those two are the sole remaining
gap in the whole project (see the bottom of this section).

| City | Fix |
|---|---|
| Mysore | Pass 12's lead confirmed: "Hanumanthu Restaurant" in Nazarbad is really Original Hanumanthu Devi Mess in Mandi Mohalla -> name and area corrected (1 occurrence) |
| Eilat | Ranch House is on the Royal Boardwalk beside Royal Beach Eilat per Isrotel's own site, not at the Isrotel Sport Hotel -> area corrected (1) |
| Turpan | Turpan Bazaar is on Bazha Road in Gaochang District, not "Laocheng Road, old city" -> area corrected (8) |
| Hamadan | "Dizi-Saray-e Arian" is a garbled rendering of Sofreh-Saray-e Aryaeiyan, the dizi house on Bu-Ali Sina Street -> name and area corrected (2); "Naal Ashkaneh" is Nael Eshkeneh in Abbas Abad -> name and area corrected (2) |
| Manado | Rumah Makan Green Garden is on Jalan Sam Ratulangi, not Kalasey (2); Rumah Makan Raja Oci has no Kalasey branch, its main one is on Jalan Jenderal Sudirman (2); Christine Klappertaart's store is on Jalan B.W. Lapian in Tikala, not Sam Ratulangi (1) |
| Gilgit | Dumani Hotel is on Riaz Road in Jutial, not "Central Gilgit" (5) |
| Weno (Chuuk) | Blue Lagoon Resort is at Neiwe on the southwest tip of Weno, not Iras (6) |
| Tarawa | Ocean Family Seafood is at Bairiki Shopping Mall, not Betio (2); Chatterbox Cafe is in Bikenibeu, not Bairiki (2) |
| Funafuti | Vaiaku Lagi Hotel has been renamed Funafuti Lagoon Hotel, same lagoon-side site (4) |
| Yaren (Nauru) | Capelle & Partner's flagship store is in Ewa district; the Denigomodu outlet trades as "Naoero Central Mini-Mart" -> area corrected to Ewa (4) |

**Pass 12's two open leads are now settled.** Mysore's Hanumanthu was wrong and
is fixed above. Port Moresby's Airways Hotel restaurant genuinely is called
**Vue Restaurant** (the hotel's second room is Bacchus) — no "Poolside at
Airways" anywhere, so that entry stays as it was.

**Goma is resolved too.** The city has been under M23 control since January
2025, but Goma Serena Hotel/Rumoka, Petit Bruxelles, Lac Kivu Lodge and Le
Chalet all carry live 2026 pricing and recent reviews, and Birere market is
still trading (under heavy strain from border closures and cash shortages).
Treat this as best-available evidence rather than certainty — listings in an
occupied city can lag reality — but the blanket UNCERTAIN tag from pass 12 can
come off.

**Cleared, all venues confirmed:** Port Moresby (Aviat Club, Airways Hotel and
Vue Restaurant, Ela Beach Hotel, Royal Papua Yacht Club, Duffy Cafe
Harbourside, Luluai, Edge Cafe, Grand Papua lobby cafe, Lamana Hotel, Gordons
Market, Koki Fish Market, Vision City food court); Mysore (Original Vinayaka
Mylari, Hotel Dasaprakash, Hotel RRR, Guru Sweet Mart, Bombay Tiffanys, Indra
Cafe Paras, Cafe Aramane, Devaraja Market); Eilat (Hamiflat Ha'acharon,
Eddie's Hideaway, Pedro, Lalo's, Omer's); Inhambane and Tofo (Casa de Comer,
Tofo Tofo, Verdinho's, Peri-Peri Divers, Dino's, Mango Beach, Casa Barry,
Mercado Municipal); Zhoushan (Shenjiamen night market, Xin Hongda, Gaojiazhuang,
Puji and Fayu temple vegetarian halls); Zhangye (Ganzhou night market, Mingqing
Street, Drum Tower snack streets, Minzhu West Street, Danxia town food street);
Turpan (Gaochang Road stalls, Grape Valley); Hamadan (Hammam-e Qaleh, Emarat
Vala, Kaktus, Meysam, Grand Bazaar, Ganjnameh cafes); Karimabad (all five
venues); Gilgit (Madina Hotel, NLI Market, Jamat Khana Bazaar, Kargah trout
points); Siwa Oasis (Abdu, Albabenshal, Kenooz Shali, Taziry, Tekeyet Elamir,
Adrere Amellal, Shali Lodge); Manado (Wisata Bahari, Tinoor Jaya, Dabu-Dabu
Lemong, Rumah Kopi Billy, Pasar Bersehati, Jalan Wakeke, Jalan Roda); Conakry
(Le Damier, OKLM Grill, La Paillotte, Marche Madina, Boulbinet fishing port,
Rogbane beach); Juba (Afex Riverside, Notos Lounge, Quality Hotel, Da Vinci,
Logali House, Konyokonyo/Custom/Jebel markets); Bangui (Le Relais des Chasses,
Le Safari Grill, La Tentation, PK5, Marche Combattant, Avenue des Martyrs);
Ziguinchor (Le Perroquet, Hotel Kadiandoumagne, Le Flamboyant, Marche
Saint-Maur, Enampor campement); Laayoune (Parador, Sahara Line, Nagjir,
Boulevard de Mekka, El Marsa, Foum El Oued); Harar (Mermaid Cafe, Fresh Touch,
Feres Magala); Goma (as above); Yaren (Menen Hotel, Od'n Aiwo Hotel, Anibare
Harbour, Buada Lagoon); Weno (Truk Stop restaurant, Hard Wreck Cafe);
Funafuti (Funafuti Market, Filamona Moonlight Lodge, Fusi co-op); Tarawa
(Otintaai Hotel, Bairiki/Betio/Bikenibeu markets); Majuro (Tide Table, Enra,
Marshall Islands Resort, Ri-Wut Corner, Laura Beach); Visby (Rosas Cafe, now
trading as Rosas Pensionat Cafe och Restaurang — name still resolves).

**Still uncertain, worth a targeted look, not a guess:**
- Harar: **Harla Cafe and Restaurant**, **Genet Kitfo**, **Dire Xayara** — all three appear only on a templated aggregator that reuses boilerplate copy across cities, while Harar's real venues (Fresh Touch, Mermaid Cafe) have Tripadvisor/Wikivoyage presence. Note "Dire Xayara" matches the name of a rural woreda, not a restaurant. Strong candidates for removal, but not without a second source
- Conakry: **Rice Women Restaurant** — same templated-aggregator-only pattern
- Bangui: **La Sirene** — same pattern
- Juba: **Lotus Restaurant** — no listing anywhere, unlike every other Juba venue checked
- Majuro: **Frank K's Restaurant** and **DAR Coffee Corner** — single generic-content source each; the DAR source itself says Uliga, not the listed Delap
- Tarawa: **Babes Place** — one generic-reading blog, no corroboration
- Hamadan: **Komaj Pila** — "komaj" is verified only as a Hamadan sweet bread, not a business; likely a food name mistaken for a venue
- Turpan: **Guanghui Street snack zone** (8 occurrences) — no street by that name turns up in any Turpan source; possibly a mistransliteration
- Manado: **Klappertaart Huize** — the brand's confirmed outlets are Bogor and Denpasar, none in Manado
- Mysore: **Hotel Ayub Bawarchi** (no corroborating listing at all) and **Mahesh Prasad** (real, but listings put it in Chamrajpura, not squarely on Sayyaji Rao Road)
- Inhambane: **Bamboozi Beach Lodge** (no 2024-2026 confirmation it still trades) and **Pastelaria Ferroviario** (no reliable source under that name)
- Port Moresby: **Ribito Grill and Restaurant** — venue is real, but Waigani as its suburb is unconfirmed; **POM Restaurant** — listings put it on Munahu Street, Gordons, rather than "Central Port Moresby", on a weak source
- Inhambane: the municipal market was rebuilt and reopened in August 2024 as **Mercado Central de Inhambane**; left as "Mercado Municipal" since that is still the name in common use, but worth a decision
- Siwa: **Adrere Amellal** is confirmed, but the "Sidi Jaafar" sub-location is not corroborated anywhere
- Majuro: **Ri-Wut Corner** is real, but "Rita" specifically is unconfirmed within the Delap-Uliga-Djarrit strip

## Re-verification pass 14 (2026-08-26) — Visby and Olomouc, the last gap closed

Picked up right where pass 13's scheduled run left off (it auto-disabled after
firing once, being a one-time task, so this had to be finished by hand rather
than by a further automatic run). Checked the sixteen remaining venues across
the project's last two unreached cities. Fixed in city-food.js:

| City | Fix |
|---|---|
| Visby | Donners Brunn closed under that name at the end of 2015 and reopened in 2016 at the same address as Donners Brasserie -> name corrected (3 occurrences) |

One correction to pass 13's Inhambane "cleared" list: Peri-Peri Divers is a
real, active business, but it's a dive centre (complimentary popcorn/coffee
only, no real food menu), not a restaurant -> removed from the peri-peri
prawns dish, which already had two other confirmed venues (Dino's Beach Bar,
Verdinho's).

**Cleared, all venues confirmed:** Visby's Cafe Amalia, Krusmyntagarden,
Lindgarden, Lilla Bjers, Bakfickan, Munkkallaren, Gotlands Bryggeri; all seven
Olomouc venues (Svatovaclavsky pivovar, Hanacka hospoda, Restaurace Moritz,
Restaurace Drapal, Vila Primavesi, Kavarna Konvikt, Cafe 87).

Every city and venue in city-food.js has now been through at least one
re-verification pass. Nothing remains unreached.

## Re-verification pass 15 (2026-09-15) — Perth and Kampala open items

Cleared the four Perth/Kampala items left open by pass 7. Fixed in city-food.js:

| City | Fix |
|---|---|
| Perth | Nowhereman Brewing was relaunched as **Otherside of Nowhere** after Otherside's parent Triple-1-Three absorbed it -> renamed, same address (25 Harrogate St, West Leederville); note reworded, since "small independent" is no longer true |
| Kampala | "Jeans Pub" -> **"Jean's Pub"**, its real name (2 occurrences) |
| Kampala | "Bubbles O'Leary" -> **"Bubbles O'Learys"**, the spelling used by Kampala's own KCCA tourism portal and Tripadvisor |

**Cleared, confirmed, no edit needed:**
- **Gage Roads Freo** — open and trading in A Shed, Victoria Quay, Fremantle; won
  WA Good Food Guide Pub of the Year 2026. The existing "A Shed, Fremantle" area
  label is correct.
- **Jean's Pub** — confirmed in Namuwongo, nyama choma by the kilo (~20,000 UGX),
  popular with Kampala's Kenyan community.
- **Bubbles O'Learys** — still trading at 19 John Babiha (Acacia) Ave, Kololo. The
  "PANDORA by Bubbles O'Learys" rebrand flagged in pass 7 does **not** hold up: it
  appears on one aggregator listing only, while the KCCA tourism portal and
  Tripadvisor both still carry the pub under its own name, and a February 2026
  review reports a new owner but the same pub.

Verified with `node --check city-food.js` (PASS) and `git diff --stat`
(3 insertions, 3 deletions, no other lines touched); place-entry count unchanged
at 20,450 before and after.

## Re-verification pass 16 (2026-09-15) — replacement rule ADOPTED, first batch

**Jeff adopted the replacement rule on 2026-09-15.** It now governs every
remaining open item:

> A venue that survives both a native-language search and an OpenStreetMap check
> without a single source is removed. If removing it would leave its dish thin,
> a sourced venue in the same city and dish category is put in its place. Every
> removal or swap is logged here.

One clarification learned on the first batch: **removal is usually enough.**
Most flagged venues sit on dishes that already carry two or three other places,
so the rule's "replace" arm only fires on the 19 dishes identified in the
venue-impact table above. Do not invent a replacement where deletion leaves the
dish healthy.

### Turpan — Guanghui Street snack zone -> Turpan Grape Night Market (8 dishes)

Both legs failed: a Chinese-language search finds no 光辉街 snack street in
Turpan, and Nominatim returns **zero** results for 光辉街 in Turpan. Pass 13's
mistransliteration theory is confirmed. The city's actual food destination is
the **葡萄夜市 (Grape Night Market)**, documented repeatedly on Turpan's own
municipal government site (tlf.gov.cn) as the largest night market, serving
kebabs, polo, samsa and huangmian — matching the dishes already attached.
Renamed across all 8 entries; two notes reworded (one described "the main snack
street", one claimed early-morning bread ovens, wrong for a night market).

### Tarawa — Babes Place REMOVED from 7 dishes, no replacement needed

Both legs failed: one generic blog only, and Nominatim returns zero results.
Every one of its 7 dishes already carried a market or hotel-restaurant entry
(Bairiki Market food stalls, Bikenibeu Market, Betio Market, Otintaai Hotel),
and **Bairiki Market is confirmed in OpenStreetMap** as a marketplace on Stadium
Road. Removed rather than replaced; every affected dish still has 2 venues. Its
notes made strong unsourced claims ("cultural institution", "one of the few
places serving fermented breadfruit to visitors") that rested entirely on a
venue nothing could confirm.

### Tirana — Oda CLOSED, no edit needed (7 dishes)

The pass 3 note asks for Oda's area to read "near Blloku" rather than "in
Blloku". city-food.js already stores `"area": "near Blloku"` on all 7 entries.
The fix was applied at some point and the item was never struck through.

Verified: `node --check city-food.js` PASS; 893 cities and 7,112 dish entries
unchanged; 20,450 -> 20,443 places (the 7 Babes Place removals); a full
before/after parse confirms **only Turpan and Tarawa changed**; no dish in
either city is left with fewer than 2 venues.

**Remaining after this pass: 52 of the 55 items.** See the OPEN ITEMS section at
the top of this file for the working list and priority order.

## Re-verification pass 17 (2026-09-15) — groups A and F cleared under the rule

Ran the adopted rule across every remaining group-A (aggregator-only) and
group-F (not findable under the listed name) item: a native-language web search
plus a Nominatim/OpenStreetMap lookup for each of the 33 venues, then a second
OSM pass to verify each proposed replacement before it was used.

**26 of the 27 remaining A/F items are closed.** The one survivor is Inhambane's
market name, which is a naming decision rather than a sourcing problem, so it
moves to the "needs Jeff" group.

### OSM overturned four pass-13 verdicts — these venues are real and stay

Pass 13 called them aggregator-only. OpenStreetMap has them, with streets:

| Venue | OSM record |
|---|---|
| Harar: **Genet Kitfo** | Shk Abubeker Street, Harar |
| Harar: **Harla Cafe & Restaurant** | Jeberti Street, Harar |
| Majuro: **DAR Coffee Corner** | Uliga Back Road — area corrected Delap -> **Uliga** |
| Majuro: **Ri-Wut Corner** | Lagoon Road, Delap-Uliga-Djarrit — area corrected from **Rita** |
| Inhambane: **Bamboozi Beach Lodge** | Rua da Lagoa, Praia do Tofo |
| Marseille: **Les Panisses** | 23 Rue Sainte, Opera (1st) — area corrected from **Cours Julien** |
| Mysore: **Mahesh Prasad** | New Kantharaje Urs Road — area corrected to **Krishnamurtipuram** |
| Houston: **Long Coffee** | 10611 Bellaire Blvd — area corrected to **Asiatown** |

A ninth, **Siwa's Adrere Amellal**, is confirmed by its own site; only the
uncorroborated "Sidi Jaafar" sub-location was wrong, now **White Mountain, by
Lake Siwa**, which the sources do support.

### 19 replacements (both legs failed, sourced substitute found)

| City | Out | In |
|---|---|---|
| Aix-en-Provence | Vino Loco | **Nicolas Italie**, 41 rue d'Italie (OSM) |
| Bangui | La Sirene | **Bangui Plage**, Oubangui riverside (OSM + Petit Fute) |
| Guilin (x3) | Jimo Bamboo Rice | **Da Shifu Beer Fish**, Fengming Rd, Yangshuo (OSM + Ctrip) |
| Izmir | Boyozcu Ferit | **Alsancak Dostlar Firini**, est. 1983 (OSM + Iz Gazete) |
| Hamadan | Komaj Pila | **Bazar-e Ghannadha** — pass 13 was right, komaj is the bread, not a venue |
| Manado | Klappertaart Huize | **Christine Klappertaart** (Kompas, detik, IDN Times) |
| Mysore | Hotel Ayub Bawarchi | **Hotel Hanumanthu Original**, Mandi Mohalla, since 1930 (OSM) |
| Nanjing | Lan Laoda Noodles | **Yiji Pidu Noodles** |
| Oranjestad | Nos Cunucu | **Huchada Bakery** (OSM puts it in Piedra Plat, Paradera — area set accordingly) |
| Port Moresby | Ribito Grill | **Magi Seafood**, Gordons (OSM + Fodor's) |
| Pucon | Cerveceria Mestizo | **Cerveceria Wenu Pillan** (OSM) — the candidate pass 9 nominated |
| Zhaoqing | Boji Guozheng | **Feizai Wei**, Duanzhou District |
| Houston | Cafe TH | **Cali Sandwich and Pho**, Midtown (OSM) |
| Baghdad | Khan Baghdad (masgouf only) | **Al-Baghdadi Restaurant**, Abu Nuwas Street |
| San Salvador | Pupuseria Guanaquitas (pupusas) | **Pupuseria de Alba Luz Rivera**, Centro Historico |
| San Salvador | Pupuseria Guanaquitas (panes con pollo) | **Panes Wendy**, Barrio Santa Anita |
| Majuro | Frank K's (rice/corned beef) | **Majuro sidewalk barbecues** |

### 24 deletions (both legs failed, no sourced substitute, dish stays healthy)

Baghdad (quzi, dolma), Conakry x3, Harar's Dire Xayara x2, Inhambane's
Pastelaria Ferroviario, Juba's Lotus Restaurant x3, Majuro's Frank K's x2,
Ouarzazate's Restaurant Habiba x3, Port Moresby's POM Restaurant, San Salvador
x4, Varna's Zlatna Panna, Lijiang's Mu Wan x2.

Note on Juba: the only corroboration for Lotus Restaurant came from the same
templated site family that pass 13 flagged (thingstodoinjuba.com, sibling of the
thingstodoin* network), so it was not treated as a second source.

### Verification

`node --check city-food.js` PASS. 893 cities and 7,112 dish entries unchanged.
Places 20,443 -> 20,419. A full before/after parse confirms **only the 25
intended cities changed**. Every flagged venue name is gone from the file.

**No dish anywhere in city-food.js has zero places.** Only three dishes in the
whole file have a single place — Nagoya's Nishio matcha, Kamakura's Shonan craft
beer and Seattle's Seattle dog — and all three were already single-place at HEAD,
untouched by this batch. **Minimum places per dish across all 27 cities touched
in passes 16-17: 2.**

**Remaining: 26 of the original 55** — group B (9), group D (7, now including
Inhambane's market name), group C (5), group E (5).

## Re-verification pass 18 (2026-09-15) — group B cleared

Ran the rule across all 9 group-B items ("no reliable listings either way",
15 venues). Same method: native-language search plus a Nominatim lookup each,
then OSM verification of every proposed replacement.

### Two venues survived — one leg passed, so they stay

- **Kinshasa: Le Voyageur.** OSM has *Hotel Le Voyageur - Elais*, Avenue Ngongo
  Lutete, Golf, **Gombe** — matching the area already stored. Kept.
- **Encarnacion: El Quincho.** A Spanish-language source describes it in
  downtown Encarnacion serving *asado, sopa paraguaya and chipa guazu* — the
  exact three dishes it is attached to here. Kept. Worth noting the city's own
  tourism directory (encarnacion.gov.py) lists none of Encarnacion's four
  flagged venues, including this one, so the directory is clearly not
  exhaustive; that absence was not treated as evidence either way.

### 6 replacements

| City | Out | In |
|---|---|---|
| Libreville | Chez Paul | **Bambou Bar**, Glass district (cassava leaves, poulet nyembwe) |
| Encarnacion | Parrillada Don Emilio | **America Grill Churrasqueria** — on the municipality's own list |
| Gisenyi | Wifi Beach Restaurant | **Lakeside Bar Beach and Restaurant** (visitrubavu.com, the district tourism site) |
| Kairouan | Brothers Food (lablabi only) | **Lablabi Guepsi**, Place de Tunis (Petit Fute) |
| Marigot | Le Gout | **Chez Coco** (st-martin.org, the official tourist board) — cabri colombo |
| The Valley | Sarjai's (red snapper only) | **Pimms**, Carter Rey Boulevard |

Gisenyi is a near-miss worth recording: one aggregator does carry a "Wifi Beach
Restaurant" entry, but it belongs to the same evendo/thingstodoin* network that
pass 13 flagged and that recurred in Juba and Tarawa, so it was not counted.

### 19 deletions

Kinshasa's Restaurant N'Zanza x4 and Le Cormoran x2, Libreville's Chez Paul x1,
Encarnacion's Taberna La Cava x2 / La Cabana x1 / Don Emilio x1, Nakuru's
Winston's Bar and Grill, Kairouan's Brothers Food x3, Aleppo's Hallab sweets and
Bazerbashi, The Valley's Sarjai's x2.

On Aleppo: pass 10 suspected the Hallab entry was conflating Aleppo with the
Hallab dynasty headquartered in Tripoli, Lebanon. Arabic-language searching found
nothing to place either Hallab or Bazerbashi in Aleppo, and OSM has neither. Both
dishes keep their Al-Telal Street and Souq al-Madina entries, which are what the
Syrian sources actually describe.

### Verification

`node --check city-food.js` PASS. 893 cities and 7,112 dish entries unchanged.
Places 20,419 -> 20,400. Only the 9 intended cities changed. Every flagged venue
name is gone. **No dish has zero places; minimum across the 9 cities is 2.** The
file's only three single-place dishes remain Nagoya's Nishio matcha, Kamakura's
Shonan craft beer and Seattle's Seattle dog, all predating this work.

**Remaining: 17 of the original 55** — group D (7, needs Jeff) and groups C and E
(10, the accept-and-recheck bucket). No research-shaped work is left.

## Re-verification pass 19 (2026-09-15) — Rimini's Mercato Coperto CLOSED

Jeff sent a Google Maps pin for the market. It resolves to **Mercato Centrale
Coperto Rimini**, and reverse-geocoding the pin's coordinates
(44.06000, 12.57117) puts it on **Via Castelfidardo**, Rimini city centre.

The Comune di Rimini's own site confirms the rest, and answers pass 2's worry
("the address may need updating later") in the negative:

- The market has **not relocated**. The city took direct management of the
  building on 1 January 2025 and is renovating it **in place** — roof first
  against water ingress, then windows and doors, ceilings, basement toilets and
  a reworked fruit-and-veg trading area.
- The long-term EUR 27m plan does demolish and rebuild — but **on the same
  site**, as a near-zero-energy, earthquake-resistant building. So the address
  survives even that.

Area sharpened from "City centre" to **"Via Castelfidardo, city centre"** on all
three entries (Piadina romagnola, Ciambella romagnola, and the fish stalls under
Sardoncini). `node --check` PASS, 3 lines changed, Rimini only.

**This closes the item.** Remaining: 16 of the original 55 — group D (7) and
groups C/E (9).

## Re-verification pass 20 (2026-09-15) — group C resolved from Jeff's pins

Jeff researched group C by hand and sent Google Maps pins. Each was resolved by
reverse-geocoding the pin's coordinates through Nominatim and comparing against
the stored area.

**Four areas were wrong, and the pins fixed them:**

| Venue | Stored | Pin reverse-geocodes to |
|---|---|---|
| Tehran: Akbar Mashti | Vali-ye Asr | **Tehran Grand Bazaar** (Al-e Agha / Nayeb os-Saltaneh, District 12) |
| Nagoya: Kako Coffee | Fushimi | **Meieki 5-chome, Nakamura-ku** (OSM has the amenity as KAKO) |
| Jeju City: Haenyeoui Jip | Onpyeong | **Samdo 2-dong, Jeju City** (Imhang-ro) — Onpyeong is in Seogwipo, the other end of the island |
| Nagasaki: Ringer Hut | Hamano-machi | **Dejima Kaigan-dori, Kabashima-machi** |

The Ringer Hut entry also dropped its unverified "Nagasaki Chuo" branch suffix,
since the pin identifies a specific branch and the old name asserted one that was
never confirmed.

**Jeff's two direct calls, applied as given:**
- **Seiyotei** (Nagasaki milkshake) — wrong, deleted. Dish keeps Tsuru-chan and
  Cafe Olympic.
- **Bistro Boa Vista -> Bistro Bordeaux** (Turkish rice) — confirming pass 8's
  suspicion that the two had been confused. Area left at Dozamachi; OSM has no
  record of the venue under either name, so the area is unverified.

**Niagara Falls: BeaverTails Table Rock deleted.** The pin resolves to the Table
Rock Welcome Centre, and Niagara Parks' own page lists only Table Rock House
Restaurant and Table Rock Market as the dining outlets there - no BeaverTails.
With the chain's own locator also showing only Clifton Hill, pass 5's doubt is
confirmed and the entry is gone.

**FLAG:** this leaves *BeaverTails* with a single venue (BeaverTails Clifton
Hill). It is correct, but it is the only dish in the file reduced to one place by
this project's work, and the only one of the file's four single-place dishes not
predating it.

**Still open in group C: Nagasaki's Chuwa** (sara udon, Shinchi Chinatown). Jeff's
sixth pin resolves to Shinchi Chinatown itself rather than to a restaurant, so it
confirms the *area* but not the venue. Awaiting clarification.

Verified: `node --check` PASS, places 20,400 -> 20,398, only Jeju City, Nagasaki,
Nagoya, Niagara Falls and Tehran changed. No dish has zero places.

**Remaining: 12 of the original 55** — group D (7), Chuwa (1), group E (4).

## Re-verification pass 21 (2026-09-15) — Chuwa deleted, GROUP C CLOSED

Jeff could not find Chuwa either, so it is deleted from *Sara udon*. No
replacement was needed: the dish already carried **Kouzanrou**, which is itself
in Shinchi Chinatown, so the neighbourhood Jeff's sixth pin confirmed is still
represented. Dish keeps 2 places (Kouzanrou, Shikairou).

`node --check` PASS, places 20,398 -> 20,397, Nagasaki only, no dish left empty.

**Group C is now fully closed.** Its five items produced more corrections than
expected: four of the five were not "unconfirmed branches" at all but venues
filed in the wrong part of the city, and two venues (Seiyotei, BeaverTails Table
Rock) turned out not to belong in the file.

**Remaining: 11 of the original 55** — group D (7, Jeff's decisions) and group E
(4: Jasper x2, The Hague's Garoeda, Corfu's Mavromatis Kumquat).

## Niagara Falls BeaverTails — single venue ACCEPTED (2026-09-15)

Jeff accepted *BeaverTails* standing on one venue, **BeaverTails Clifton Hill**,
after Table Rock was deleted in pass 20. This is deliberate, not an oversight:
the chain's own store locator and Niagara Parks' outlet list both show Clifton
Hill as the only BeaverTails in Niagara Falls, so one entry is the honest answer.

**Do not re-flag it.** The file now has four single-place dishes: Nagoya's Nishio
matcha, Kamakura's Shonan craft beer, Seattle's Seattle dog (all three predating
this project) and this one.

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
