# DiscoverCars coverage: 632 of 893 city guides can take a working link

*Checked 2026-10-05, after Jeff applied to DiscoverCars. Every city in `citydata/` (893) was looked up in DiscoverCars' own location search, and every link was then fetched and its page title checked against the city. Full per-city list: `discovercars-coverage-2026-10-05.csv` (one row per city: result, link, the DiscoverCars place it matched, the guide's airport and distance, and notes).*

## Counts

| Result | Cities | What it means |
|---|---|---|
| Link: city page | 596 | DiscoverCars has a page for the city itself (e.g. `discovercars.com/georgia/tbilisi`). Best link. |
| Link: airport page | 36 | No city page, but the airport the guide already names has one. Link reads as renting at that airport. |
| Listed, no landing page | 31 | DiscoverCars rents there (it is in their search) but has no page to link to. Needs the dashboard's deep-link tool to open a search for that place. |
| Review | 1 | Thimphu: see below. |
| Do not link | 3 | Hebron, Nablus, Capri: see below. |
| Not covered | 226 | Neither the city nor its airport is in DiscoverCars' search. |
| **Total** | **893** | |

## How it was checked

1. **Search by name.** Each city's name went to DiscoverCars' location search (the same one the box on their homepage uses). Any city that did not match exactly was searched again with its country added ("York United Kingdom"), because a bare name gets crowded out by a bigger namesake (New York, California for "Cali"). Accent-free spellings and DiscoverCars' own names were tried too (Prishtina, Bruges, Ghent, Nurnberg, Odesa, Makkah, Taif, Wroclaw, Acapulco, Bohol for Panglao).
2. **Same country, and the right state.** A match counts only in the guide's country. DiscoverCars' island and region labels were folded back (Crete and the Greek islands to Greece, Sicily and Sardinia to Italy, Canary and Balearic Islands to Spain, Azores to Portugal, "USA - Texas" to United States). In the US the state must agree with the guide's own airport (Portland is Oregon, Charleston is South Carolina). Gibraltar and Laayoune are filed by DiscoverCars under Spain and Morocco; both were accepted by hand.
3. **The guide's airport.** When the city itself is not listed, the airport the guide already shows in Plate 03 was searched by its code. Ten guides name an airport without a code; those codes were added by hand (Positano NAP, Cinque Terre GOA, Mont-Saint-Michel RNS, Dahab SSH, Kanchanaburi BKK, Bentota and Sigiriya CMB, Pai CNX, Nakuru NBO, Chefchaouen TNG).
4. **The link must work.** Every link was fetched (no redirect followed) and checked against DiscoverCars' sitemap. A city DiscoverCars searches but has no page for was moved to "Listed, no landing page", never given a guessed URL.
5. **The page must be the right place.** All 629 page titles were read and compared to the city. One was wrong: Capri matched **Carpi**, a different town on the mainland. It was removed. The other 6 differences are spellings only (Genova, Legazpi, Tanger airport).

## Do not link (3)

- **Hebron, Nablus.** The only match is Tel Aviv airport. Israeli rental cars are generally not allowed into Palestinian-run areas, so the link would sell a rental the traveler cannot use.
- **Capri.** The match was Carpi (wrong town, see above). Visitor cars are also heavily restricted on the island.

## For your review (1)

- **Thimphu.** DiscoverCars lists Paro airport, 46 km away, but foreign tourists in Bhutan normally travel with a licensed guide and driver. Link it or not?

## Airport-page links (36)

The link would say "Rent a car at <airport>". Five airports are more than 150 km from the city (Ica 300 km, Saint-Louis 270, Kusatsu 220, Sigiriya 170, Nakuru 160). They are still the guide's own airport, so they are kept, but you may prefer no link there.

| City | Country | Airport city | Distance | Note |
|---|---|---|---|---|
| Brugge | Belgium | Bruges | 90 km |  |
| Pilsen | Czechia | Pilsen | 90 km |  |
| Dahab | Egypt | Sharm El Sheikh | 95 km |  |
| Hurghada | Egypt | Hurghada | 6 km | airport matched by name, not code |
| Marne-la-Vallée | France | Marne-la-Vallee | 40 km |  |
| Mont-Saint-Michel | France | Rennes | 65 km |  |
| Lübeck | Germany | Lübeck | 65 km | more than one DiscoverCars city with this name in the country: Lübeck (all locations), Germany |
| Nuremberg | Germany | Nurnberg | 6 km |  |
| Mytilene | Greece | Mytilene | 7 km |  |
| Cinque Terre | Italy | Genoa | 90 km |  |
| Genoa | Italy | Genoa | 7 km |  |
| Positano | Italy | Naples | 65 km |  |
| Himeji | Japan | Osaka | 110 km |  |
| Kamakura | Japan | Tokyo | 50 km |  |
| Kusatsu | Japan | Tokyo | 220 km | airport is 220 km from the city |
| Nakuru | Kenya | Nairobi | 160 km | airport is 160 km from the city |
| Vaduz | Liechtenstein | Zurich | 130 km |  |
| Johor Bahru | Malaysia | Johor Bahru | 30 km |  |
| Chefchaouen | Morocco | Tangier | 110 km |  |
| Fès | Morocco | Fes | 15 km |  |
| León | Nicaragua | Managua | 90 km | same name found only in another country: Mexico, Spain |
| Ica | Peru | Lima | 300 km | airport matched by name, not code | airport is 300 km from the city |
| Cebu City | Philippines | Lapu-Lapu City | 15 km |  |
| San Marino | San Marino | Rimini | 24 km |  |
| Saint-Louis | Senegal | Dakar | 270 km | same name found only in another country: France | airport is 270 km from the city |
| Bentota | Sri Lanka | Colombo | 65 km |  |
| Galle | Sri Lanka | Colombo | 130 km |  |
| Kandy | Sri Lanka | Colombo | 110 km |  |
| Sigiriya | Sri Lanka | Colombo | 170 km | airport is 170 km from the city |
| Malmö | Sweden | Malmö | 29 km |  |
| Moshi | Tanzania | Kilimanjaro | 45 km |  |
| Kanchanaburi | Thailand | Bangkok | 130 km |  |
| Pai | Thailand | Chiang Mai | 135 km |  |
| Windermere | United Kingdom | Manchester | 145 km | airport matched by name, not code |
| Scottsdale | United States | Scottsdale | 15 km |  |
| Vatican City | Vatican | Rome | 34 km |  |

## Listed, but no page to link (31)

DiscoverCars rents in these places but has no landing page, including large cities (Hanoi, Ho Chi Minh City, Hong Kong, Cusco, Addis Ababa, Nassau). They can be linked once the dashboard shows how to deep-link to a search for a place.

| City | Country | DiscoverCars place |
|---|---|---|
| Nassau | Bahamas | Nassau, Bahamas |
| Santa Cruz de la Sierra | Bolivia | Santa Cruz de la Sierra, Bolivia |
| Road Town | British Virgin Islands | Road Town, British Virgin Islands |
| Bandar Seri Begawan | Brunei | Bandar Seri Begawan, Brunei |
| Praia | Cabo Verde | Praia, Cape Verde |
| Pucón | Chile | Pucon, Chile |
| Hong Kong | China (SAR) | Hong Kong, Hong Kong |
| Moroni | Comoros | Comoros, Comoros |
| Addis Ababa | Ethiopia | Addis Ababa, Ethiopia |
| Cape Coast | Ghana | Accra, Ghana |
| St. George's | Grenada | St. George, Grenada |
| Cortina d'Ampezzo | Italy | Cortina D’ampezzo, Italy - Mainland |
| Beppu | Japan | Oita, Japan |
| Hirosaki | Japan | Aomori, Japan |
| Kurashiki | Japan | Okayama, Japan |
| Al Ahmadi | Kuwait | Al Farwaniyah, Kuwait |
| San Cristóbal de las Casas | Mexico | Tuxtla Gutiérrez, Mexico |
| Ouarzazate | Morocco | Ouarzazate, Morocco |
| Murree | Pakistan | Islamabad, Pakistan |
| Koror | Palau | Koror, Palau |
| Cusco | Peru | Cusco, Peru |
| Baguio | Philippines | Pampanga, Philippines |
| Gisenyi | Rwanda | Kigali, Rwanda |
| Castries | Saint Lucia | Castries, Saint Lucia |
| Gustavia | Saint-Barthélemy | St. Bartelemy, Saint Barthelemy |
| Gyeongju | South Korea | Busan, South Korea |
| Dili | Timor-Leste | Dili, Timor-leste |
| Kairouan | Tunisia | Enfidha, Tunisia |
| Charlotte Amalie | U.S. Virgin Islands | Charlotte Amalie West, Virgin Islands, U.S. |
| Hanoi | Vietnam | Hanoi, Vietnam |
| Ho Chi Minh City | Vietnam | Ho Chi Minh City, Vietnam |

## Not covered (226), by country

Mostly countries where DiscoverCars does not operate at all (China 49, Russia 12, Iran 11, Cuba, Syria, North Korea, much of Central and West Africa and the Pacific), plus smaller cities in India, Indonesia, Vietnam and Cambodia.

- **Afghanistan** (2): Bamyan, Kabul
- **Algeria** (6): Constantine, Djanet, Ghardaïa, Oran, Tamanrasset, Timimoun
- **Anguilla** (1): The Valley
- **Bangladesh** (6): Chittagong, Cox's Bazar, Dhaka, Saint Martin's Island, Srimangal, Sylhet
- **Belarus** (1): Minsk
- **Benin** (2): Cotonou, Porto-Novo
- **Bermuda** (1): Hamilton
- **Bolivia** (1): Potosí
- **Burkina Faso** (1): Ouagadougou
- **Burundi** (1): Bujumbura
- **Cambodia** (4): Battambang, Phnom Penh, Siem Reap, Sihanoukville
- **Central African Republic** (1): Bangui
- **Chad** (1): N'Djamena
- **China** (49): Anshun, Beihai, Chaozhou, Chengde, Chengdu, Chongqing, Dali, Datong, Enshi, Fenghuang, Guangzhou, Guilin, Hangzhou, Harbin, Huangshan, Jianshui, Jingdezhen, Jinghong, Kaifeng, Kangding, Kashgar, Kunming, Leshan, Lhasa, Lijiang, Luoyang, Manzhouli, Nanjing, Qingdao, Qinhuangdao, Quanzhou, Sanya, Shanghai, Shangri-La, Shaoxing, Shenzhen, Suzhou, Tai'an, Turpan, Wuyishan, Xi'an, Xiamen, Yangshuo, Yangzhou, Zhangjiajie, Zhangye, Zhaoqing, Zhoushan, Zhuhai
- **China (SAR)** (1): Macau
- **Colombia** (2): Leticia, San Andrés
- **Cuba** (5): Baracoa, Cienfuegos, Havana, Santiago de Cuba, Trinidad
- **Côte d'Ivoire** (1): Yamoussoukro
- **DR Congo** (1): Goma
- **Democratic Republic of the Congo** (1): Kinshasa
- **Dominica** (1): Roseau
- **Egypt** (1): Siwa Oasis
- **Equatorial Guinea** (1): Malabo
- **Eritrea** (1): Asmara
- **Ethiopia** (6): Axum, Bahir Dar, Gondar, Harar, Lalibela, Mek'ele
- **Falkland Islands** (1): Stanley
- **Federated States of Micronesia** (1): Weno
- **French Polynesia** (1): Papeete
- **Ghana** (1): Kumasi
- **Guinea** (1): Conakry
- **Guinea-Bissau** (1): Bissau
- **India** (10): Amritsar, Aurangabad, Jodhpur, Madurai, Mysore, Puducherry, Srinagar, Thiruvananthapuram, Tirupati, Varanasi
- **Indonesia** (14): Banda Aceh, Bandung, Banyuwangi, Labuan Bajo, Magelang, Makassar, Malang, Manado, Mataram, Medan, Padang, Surabaya, Surakarta, Yogyakarta
- **Iran** (11): Hamadan, Isfahan, Kashan, Kerman, Kermanshah, Mashhad, Qom, Shiraz, Tabriz, Tehran, Yazd
- **Iraq** (4): Baghdad, Erbil, Karbala, Najaf
- **Kenya** (1): Lamu
- **Kiribati** (1): Tarawa
- **Kyrgyzstan** (2): Bishkek, Karakol
- **Liberia** (1): Monrovia
- **Libya** (1): Tripoli
- **Madagascar** (2): Antsiranana, Morondava
- **Maldives** (1): Malé
- **Mali** (2): Bamako, Timbuktu
- **Marshall Islands** (1): Majuro
- **Montserrat** (1): Brades
- **Mozambique** (1): Inhambane
- **Myanmar** (1): Mandalay
- **Myanmar (Burma)** (1): Yangon
- **Nauru** (1): Yaren
- **Nepal** (2): Pokhara, Siddharthanagar
- **Niger** (1): Agadez
- **Nigeria** (4): Calabar, Ibadan, Kano, Osogbo
- **North Korea** (1): Pyongyang
- **Pakistan** (4): Gilgit, Karimabad, Mingora, Skardu
- **Papua New Guinea** (1): Port Moresby
- **Peru** (2): Iquitos, Puno
- **Philippines** (2): Boracay, Vigan
- **Republic of the Congo** (1): Brazzaville
- **Russia** (12): Irkutsk, Kaliningrad, Kazan, Moscow, Pyatigorsk, Saint Petersburg, Sergiyev Posad, Sochi, Velikiy Novgorod, Vladimir, Vladivostok, Yaroslavl
- **Rwanda** (1): Cyangugu
- **Saint Helena** (1): Jamestown
- **Saint Pierre and Miquelon** (1): Saint-Pierre
- **Saint Vincent and the Grenadines** (1): Kingstown
- **Samoa** (1): Apia
- **Senegal** (1): Ziguinchor
- **Sierra Leone** (1): Freetown
- **Solomon Islands** (1): Honiara
- **Somalia** (1): Mogadishu
- **South Korea** (2): Jeonju, Sokcho
- **South Sudan** (1): Juba
- **Sri Lanka** (2): Jaffna, Trincomalee
- **St. Kitts and Nevis** (1): Basseterre
- **Sudan** (2): Khartoum, Port Sudan
- **Syria** (2): Aleppo, Damascus
- **São Tomé and Príncipe** (1): São Tomé
- **Tajikistan** (1): Dushanbe
- **Tonga** (1): Nuku'alofa
- **Turkmenistan** (1): Ashgabat
- **Turks and Caicos Islands** (1): Cockburn Town
- **Tuvalu** (1): Funafuti
- **Uzbekistan** (1): Urganch
- **Venezuela** (1): Caracas
- **Vietnam** (8): Da Lat, Da Nang, Hoi An, Huế, Hạ Long, Nha Trang, Phu Quoc, Sa Pa
- **Yemen** (1): Sana'a

## What is still open

- ~~**Link format.**~~ Done 2026-10-06: Jeff's tag is `?a_aid=NRA2026`; it works on city and airport pages (DiscoverCars records both as affiliate traffic).
- ~~**Putting the links on the site.**~~ Done 2026-10-06: `carhire` key in 632 city files, link on the Plate 03 Car rental card (decisions.md 2026-10-06). Still open: Thimphu (your call) and the 31 places with no landing page.
- **Disclosure.** Same as the hotel note: a plain-words affiliate line by the link, `rel="sponsored"`, and DiscoverCars named on privacy.html.
- **Re-check before launch.** DiscoverCars adds and drops locations. Re-run the check (scripts in `_guidebuild/discovercars/`: dc_coverage, dc_requery, dc_classify, dc_linkcheck, dc_resolve, dc_titles, run in that order) right before the links go live.
