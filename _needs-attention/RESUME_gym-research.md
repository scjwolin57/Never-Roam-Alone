# Resume note — gym pass research (started 2026-09-17)

**Goal:** for every one of the 893 cities, list gyms a traveler can use without a
membership, tied to the city's neighborhoods, shown in the city page's "Find laundry
& gyms" modal and on the hotel card. Definition and refinements are in
`decisions.md` (rows dated 2026-09-17); do not widen or narrow them.

## State
- Done: the 25 most-visited cities (pilot), loaded and committed. 163 gyms.
- Done: batch 2, 25 more cities (Vatican City, Vienna, Athens, Manama, Hanoi,
  Denpasar, Cancún, Miami, Ho Chi Minh City, Las Vegas, Dublin, Venice, Orlando,
  Florence, Karbala, Kyoto, Shanghai, Doha, Abu Dhabi, Cairo, Lisbon,
  Pattaya-Chonburi, Marne-la-Vallée, Punta Cana, Hurghada), loaded and committed
  (`7eb10c76`). 90 gyms.
- Done: batch 3, 25 more cities (Sharm El Sheikh, Sydney, Budapest, Shenzhen,
  Jeddah, Valletta, Niagara Falls, Nha Trang, Najaf, Da Nang, Chiang Mai, Ibiza,
  Berlin, Vancouver, Mexico City, Beijing, Heraklion, Palma de Mallorca, San
  Diego, Marrakech, Munich, Toronto, San Francisco, Seville, Fukuoka), loaded
  and committed (`81b9f6ff`). 100 gyms.
- Done: batch 4, 25 more cities (Delhi, Hạ Long, Melbourne, Santorini, Krabi,
  Hoi An, Alanya, Playa del Carmen, Puerto Vallarta, Mashhad, Mumbai, Jakarta,
  Copenhagen, Brussels, Nice, Edinburgh, Rhodes, Buenos Aires, Johor Bahru,
  Tbilisi, Riyadh, Havana, Manila, Muscat, Amman), loaded and committed
  (`ea81def0`). 100 gyms.
- Done: batch 5, 25 more cities (Moscow, Granada, Porto, Houston, Phnom Penh,
  Reykjavík, Boston, Naples, Frankfurt am Main, Valencia, Malé, San Juan,
  Johannesburg, Chicago, Guangzhou, Honolulu, Sapporo, Busan, Montreal, Lima,
  Jerusalem, Auckland, Andorra la Vella, Tallinn, Yerevan), loaded and
  committed (`5e08225d`). 89 gyms.
- Done: batch 6, 25 more cities (Ko Samui, Washington D.C., São Paulo,
  Santiago, San José, Vientiane, Alicante, Manchester, Cape Town, Salzburg,
  Lyon, Hamburg, Stockholm, Verona, Sharjah, Dakar, Panama City, Bogotá, Baku,
  Ljubljana, Riga, Mykonos, Chamonix-Mont-Blanc, Kuşadası, Marmaris), loaded
  and committed (`589ba5df`). 88 gyms.
- Done: batch 7, 25 more cities (Bodrum, Göreme, Marbella, Nara-shi, Brugge,
  Batumi, Corfu, Varna, Oranjestad, Hiroshima, Jeju City, Nagoya, Santo
  Domingo, Málaga, Dallas, Saint Petersburg, Kraków, Thessaloniki, Zhuhai,
  Tunis, Tashkent, Colombo, Beirut, Tehran, Zagreb), loaded and committed
  (`3ace7272`). 93 gyms.
- Done: batch 8, 25 more cities (Anaheim, Cologne, Kolkata, Rio de Janeiro,
  Zurich, Port Louis, Nassau, Dubrovnik, Kuwait City, Fethiye, Düsseldorf,
  Marseille, Seattle, Brisbane, Belgrade, Banff, Malacca, George Town, Zadar,
  Luxor, Huế, Cusco, Funchal, Kaohsiung, Strasbourg), loaded and committed
  (`b07f66df`). 92 gyms.
- Done: batch 9, 25 more cities (Kobe, Las Palmas de Gran Canaria, Bordeaux,
  Cebu City, Geneva, Calgary, İzmir, Yokohama, Helsinki, Warsaw, Nairobi,
  Abidjan, Montevideo, Montego Bay, Guatemala City, San Salvador, Kathmandu,
  Almaty, Tirana, Maseru, Split, New Orleans, Luxembourg, Atlanta, Sarajevo),
  loaded and committed (`3c960de4`). 103 gyms.
- Done: batch 10, 25 more cities (Marsa Alam, Whistler, Qom, Bursa, Sousse,
  Puerto Plata, Paphos, Willemstad, Agadir, Pisa, Gold Coast, Turin, Belfast,
  Naha, Phoenix, Perth, Guadalajara, Casablanca, Chennai, Oslo, Bologna,
  Tel Aviv, Vilnius, Bucharest, Minsk), loaded and committed (`f5d88f92`).
  85 gyms.
- Done: batch 11, 25 more cities (Phu Quoc, Mont-Saint-Michel, Colmar,
  Selçuk, Agra, Fès, Tangier, Trabzon, Bilbao, Palermo, Gdańsk, Córdoba,
  San Antonio, Innsbruck, Bergen, Antwerp, Cairns, Christchurch, Detroit,
  Xi'an, Kigali, Accra, Nadi, Siem Reap, Sofia), loaded and committed
  (`1f88b862`). 78 gyms.
- Done: batch 12, 25 more cities (Cinque Terre, Santiago de Compostela,
  Manzhouli, Zhangjiajie, Ensenada, Denizli, Rimini, San Sebastián, Taichung,
  Foz do Iguaçu, Durrës, Wrocław, Liverpool, Québec, Santa Cruz de Tenerife,
  Astana, Monterrey, Kunming, Ankara, Kampala, Addis Ababa, Bishkek, Kyiv,
  Bratislava, Bridgetown), loaded and committed (`7be7c691`). 69 gyms.
- Done: batch 13, 25 more cities (Taormina, Sa Pa, Carcassonne, Beppu,
  Monastir, Pula, Luang Prabang, Aswan, Arusha, Harare, Gothenburg,
  Rotterdam, Kota Kinabalu, Glasgow, Tampa, Stuttgart, Philadelphia, Denver,
  Medellín, Hangzhou, Zanzibar City, Maputo, Kotor, Nicosia, Ulaanbaatar),
  loaded and committed (`513641ce`). 74 gyms.
- Done: batch 14, 25 more cities (Hua Hin, Annecy, Avignon, Jasper, Boracay,
  Kandy, Otaru, Kamakura, Oxford, Nagano, Cochin, La Romana, Mostar,
  Samarkand, Houmt El Souk, Cork, Da Lat, Fort-de-France, Kingston,
  Heidelberg, Erbil, Cartagena, Pokhara, Sanya, Catania), loaded and
  committed (`cf812e12`). 71 gyms.
- Done: batch 15, 25 more cities (Nuremberg, Ottawa, Austin, Dar es Salaam,
  Basel, Durban, Xiamen, Bengaluru, Chongqing, Chengdu, Victoria Falls,
  Lusaka, Lomé, Algiers, Quito, Cambridge, Pristina, Puerto Iguazú, Capri,
  Dahab, Saint-Tropez, Girona, Edirne, Brighton, Gent), loaded and committed
  (`6c7149b8`). 62 gyms.
- Done: batch 16, 25 more cities (Himeji, Guilin, Rovaniemi, Sihanoukville,
  Aqaba, Galle, Surat Thani, Rotorua, Mazatlán, Kanazawa, Liberia (Costa
  Rica), Maastricht, Poznań, Nelspruit, Hakodate, Genoa, Florianópolis,
  Saint-Denis (Réunion), Charlotte Amalie, Isfahan, Bari, The Hague,
  Toulouse, Negombo, Edmonton), loaded and committed (`99de7fdc`). 69 gyms.
- Done: batch 17, 25 more cities (Bristol, Minneapolis, Wellington, Jaipur,
  Suzhou, Harbin, Windhoek, Managua, Belize City, Dushanbe, Yangon, Skopje,
  Adelaide, Sigiriya, Chiang Rai, Matera, Biarritz, Panglao, Coimbra, Cadiz,
  York, Reims, Freiburg, Valparaíso, Utrecht), loaded and committed
  (`2ae18c92`). 86 gyms.
- Done: batch 18, 25 more cities (Viña del Mar, Yangshuo, Mataram, Pretoria,
  Essaouira, Karlovy Vary, Hualien City, Tarragona, Rabat, Livingstone, Road
  Town, Cagliari, Salalah, Cardiff, Mérida, Lviv, Kumamoto, Mendoza, San
  Pedro Sula, Faro, Philipsburg, Nagasaki, Dresden, Mombasa, Zaragoza),
  loaded and committed (`01c0d1c7`). 70 gyms.
- Done: batch 19, 25 more cities (Bern, Shiraz, Kuching, Halifax, Kagoshima,
  Yogyakarta, Tromsø, Aix-en-Provence, Surabaya, Malmö, Portland, Nashville,
  Qingdao, Nanjing, Lagos, Caracas, Castries, Asunción, Tegucigalpa,
  Port-au-Prince, La Paz, Damascus, Baghdad, Chișinău, Victoria), loaded and
  committed (`b8e234db`). 87 gyms.
- Done: batch 20, 25 more cities (Puno, Lausanne, Arequipa, Bukhara,
  Takamatsu, Amritsar, Varanasi, Hyderabad, Lahore, Monaco, Saint John's,
  Paramaribo, Chefchaouen, Kanchanaburi, Bariloche, Positano, Kaş, Çeşme,
  Konstanz, Garmisch-Partenkirchen, Baden-Baden, Jinghong, Inverness,
  Trinidad, Trier), loaded and committed (`ed550183`). 57 gyms.
- Done: batch 21, 25 more cities (Koblenz, Regensburg, Dijon, Klaipėda,
  Århus, Haifa, Gisenyi, Jeonju, Vladivostok, Odessa, Islamabad, Aleppo,
  Perugia, Mariehamn, Encarnación, Ohrid, Kalamata, Saipan, Mytilene,
  Gibraltar, Matsumoto, Konya, Salamanca, Flores, Ta'if), loaded and
  committed (`52d16fdf`). 56 gyms.
- Done: batch 22, 25 more cities (Maun, Salerno, Tours, Kurashiki, Lugano,
  Gyeongju, Montpellier, Bremen, Yaoundé, Tainan, Tabriz,
  Thiruvananthapuram, Mandalay, Lijiang, Stavanger, Cluj-Napoca, Brno,
  Leipzig, Quanzhou, Reno, Santa Cruz de la Sierra, Nantes, Winnipeg, Bonn,
  Papeete), loaded and committed (`c59fed80`). 86 gyms.
- Done: batch 23, 25 more cities (Scottsdale, Anchorage, Salt Lake City,
  Guayaquil, Bamako, Lilongwe, Antananarivo, Libreville, Mbabane, Kinshasa,
  Douala, Gaborone, Cotonou, Luanda, Karachi, Bandar Seri Begawan, Dhaka,
  Georgetown, Windermere, Bentota, Aachen, Brașov, Plovdiv, Grenoble,
  Ouarzazate), loaded and committed (`6eefef16`). 56 gyms. Several thin/empty
  markets shipped honest empty arrays (Bentota, Libreville, Lilongwe,
  Luanda, Mbabane, Ouarzazate).
- Done: batch 24, 25 more cities (Nîmes, Taupo, Udaipur, Podgorica,
  Perpignan, Serekunda, Ålesund, Puerto Princesa, Oaxaca, Dunedin, Kazan,
  Hobart, Medan, Port of Spain, Thimphu, Cali, Banjul, Monrovia, Ahmedabad,
  Ushuaia, Cortina d'Ampezzo, El Nido, Magelang, Rouen, Kairouan), loaded
  and committed (`96b5a604`). 73 gyms. Many entries thin on published day
  prices (real gyms, no findable rate, shipped as `loc: null`); Udaipur is
  5 free open-air gyms only.
- Done: batch 25, 25 more cities (Würzburg, Battambang, San Cristóbal de
  las Casas, Novi Sad, Ica, Poprad, Odense, Chetumal, Parma, Cap-Haïtien,
  Urganch, Santander, Santiago de Cuba, Eilat, Sibiu, Hamilton, Tampere,
  Jodhpur, Siddharthanagar, Kayseri, Salta, Puebla, Pamplona, Constantine,
  La Ceiba), loaded and committed (`1390c091`). 55 gyms. Five cities
  shipped honest empty arrays (Cap-Haïtien, Jodhpur, Kayseri, La Ceiba,
  Siddharthanagar) after no gym could be sourced with confirmed
  non-member policy + price.
- Done: batch 26, 25 more cities (Mysore, Kermanshah, Turku, Santiago de
  Querétaro, Blantyre, Gaziantep, Dali, Yazd, Matsuyama, Bandung, Port
  Elizabeth, Oran, Sopot, Marigot, Kelowna, Memphis, Sochi, Abuja, Darwin,
  Pittsburgh, Recife, Salvador, Alexandria, St. George's, San Pedro de
  Atacama), loaded and committed (`1423ec9b`). 68 gyms. Kermanshah shipped
  an honest empty array (~20 named gyms, none with a confirmable
  non-member policy or price).
- Done: batch 27, 25 more cities (Pai, Sukhothai, El Calafate, Sokcho, San
  Andrés, Knysna, Mardin, Kashan, Bamberg, Huangshan, Karakol, Ulm,
  Kusatsu, Moshi, Hebron, Pilsen, Cienfuegos, Qinhuangdao, Tozeur, Puerto
  Natales, Longyearbyen, Lübeck, Kralendijk, Bulawayo, Ponce), loaded and
  committed (`4837d16c`). 48 gyms. Cienfuegos, Moshi and Tozeur shipped
  honest empty arrays.
- Remaining: 218 cities (675/893 done). Work highest-visitors-first, 25
  cities per batch.
- Gotcha (new, 2026-09-17): a scoped `git status --short -- <my file>`
  before committing the batch-26 resume note hid another session's
  already-staged deletion of `coming-soon.html` and
  `netlify/edge-functions/gatekeeper.js.disabled`, which rode into that
  commit. Fixed same-session (`af67e7e9` restored both files
  byte-identical); postmortem in
  `_needs-attention/concurrent-session-collision-2026-09-17.md` and the
  `concurrent-session-commit-collision` memory. **Always run the plain
  unscoped `git status --short` right before every commit, never a
  pathspec-scoped one** — scoping to your own path hides what else is
  sitting staged in the shared index.
- Done: batch 28, 25 more cities (Toulon, Cuenca, Chios, Acapulco de
  Juárez, Punta Arenas, Barranquilla, Santa Marta, Rostock, Beihai, Le
  Gosier, Nelson, Aomori, Jerez de la Frontera, Davao, Manado, Natal,
  Irkutsk, Fortaleza, Charleston, Brasília, Belo Horizonte, Tai'an,
  Ouagadougou, Port Vila, Bujumbura), loaded and committed (`479028c1`).
  80 gyms. No fully empty city this batch, but many entries thin on
  published day prices.
- Remaining: 193 cities (700/893 done — 700 milestone reached). Work
  highest-visitors-first, 25 cities per batch.
- Done: batch 29, 25 more cities (Tórshavn, Apia, Puducherry, Nouméa,
  Basseterre, San Marino, Lamu, Mar del Plata, Puerto Madryn, Plettenberg
  Bay, Tofino, Charlottetown, Weimar, Zhoushan, Siargao, Coron, Durham
  (UK), Olomouc, Sergiyev Posad, Lhasa, Cape Coast, León (Nicaragua),
  Leshan, Pécs, Saint-Louis), loaded and committed (`78b59edc`). 67 gyms.
  San Marino and Zhoushan shipped honest empty arrays.
- Remaining: 168 cities (725/893 done). Work highest-visitors-first, 25
  cities per batch.
- Done: batch 30, 25 more cities (Nakhon Ratchasima, Nakuru, Baguio,
  Zhaoqing, Fenghuang, Hirosaki, Hamadan, Shaoxing, Cyangugu, Constanța,
  Inhambane, Cayenne, Visby, Sylhet, Manzanillo, Şanlıurfa, Iquitos,
  Banyuwangi, Shangri-La, Kumasi, Malindi, Alice Springs, Madurai, La
  Serena, Abha), loaded and committed (`f2de3687`). 61 gyms. Fenghuang,
  Inhambane, Shangri-La and Sylhet shipped honest empty arrays. Hardening
  the agent prompts with explicit asof-format and missing-pass-block
  warnings (added after batch 29) worked — zero rejects on the dry-run
  this batch.
- Remaining: 143 cities (750/893 done). Work highest-visitors-first, 25
  cities per batch.
- Done: batch 31, 25 more cities (Veracruz, Sucre, Trujillo, Luoyang,
  Morelia, Ostrava, Erfurt, Labuan Bajo, Kaliningrad, Saskatoon, Gustavia,
  The Valley, Al Ahmadi, Nuuk, Manaus, Juba, Tripoli, Conakry, Asmara,
  N'Djamena, Praia, Port Moresby, Vaduz, Djibouti City, Pucón), loaded
  and committed (`18444815`). 60 gyms. Several conflict-adjacent/small
  capitals thin on prices but none needed a fully empty array.
- Remaining: 118 cities (775/893 done). Work highest-visitors-first, 25
  cities per batch.
- Gotcha (new, batch 29): destinations.js has "Durham" as Durham, UK
  (lat 54.76786, lng -1.56581), not Durham, North Carolina — a group's
  prompt defaulted to NC without checking, caught and corrected mid-flight
  via SendMessage before the agent went too deep. **Always grep
  destinations.js for an ambiguous city name before assuming which one it
  is**, especially for names that are common in multiple countries
  (Durham, Cambridge, Richmond, Springfield, etc.).
- Gotcha (new, batch 29): a research agent reported writing entries with
  "no published price" by giving them `"free": false` and omitting the
  `pass` block entirely, instead of the established convention
  (`pass.day.loc: null`). Didn't wait to see whether `load_gyms.py`
  would actually reject `free:false`+no-pass (untested failure mode) —
  fixed proactively by grep-checking every entry in the flagged files for
  `free:true` or a non-empty `pass` before running the loader, and
  hand-fixing all 12 across 5 files (torshavn, apia, puducherry, noumea,
  basseterre) to `pass.day.loc: null` with the right currency before
  loading. **When an agent's own report says it "omitted the pass
  object" or wrote `free: false` with no price, verify that file's
  entries against the schema before trusting the dry-run alone** —
  worth confirming later whether the loader actually catches this shape
  or would silently accept it.
- Gotcha (repeat of batch 19's pattern, sharper this time): on batch 21,
  group 2's agent ran very long on its last 4 cities
  (Gisenyi/Jeonju/Vladivostok/Odessa). A nudge didn't land in time, so the
  orchestrator did brief genuine WebSearch/WebFetch research itself and
  shipped empty `[]` for Jeonju/Vladivostok/Odessa as a placeholder — then
  the slow agent finished anyway and delivered real, better data for all
  three, but Odessa's finished *after* the batch had already been loaded
  and committed, requiring a small follow-up correction commit
  (`e50d0e4a`). Lesson: after any self-unblock, don't just re-check once —
  the slow agent may still be running when you commit, so watch for a
  "changed on disk" notice on the scratch file even after the batch commit,
  and follow up with a small correction commit if one lands late.
- Gotcha: on batch 19, group 5's agent ran very long on 3 cities
  (Baghdad/Chișinău/Victoria). After a nudge didn't land in time, the
  orchestrator self-unblocked by writing empty `[]` placeholders directly to
  the still-missing scratch files — but that skips real research, which
  risks a false "nothing found" for markets (like Chișinău) that likely do
  have online gym pricing. Better fix used: do a few *real* searches yourself
  before falling back to empty, and always re-check the scratch file after
  self-unblocking — the slow agent may still finish and overwrite your
  placeholder with better data (this happened for both Chișinău and
  Victoria here), so re-run the loader after any self-unblock to pick up a
  late-arriving real result.
- Gotcha: one research agent ran unusually long (12+ min) on a thin,
  bot-walled market (Suzhou); a SendMessage nudge to "wrap up, ship what you
  have" got it to finish within ~1 more minute. If a group runs long, nudge
  it rather than waiting indefinitely.
- 2026-09-17: user confirmed running all remaining batches autonomously,
  no further check-ins until all 893 cities are done.
- Batch 10 hit a concurrent-session collision (per the master CLAUDE.md
  warning): another session had uncommitted changes to `city.html` and a new
  `netlify/functions/places-nearby.js` sitting in the working directory at
  commit time. Left both untouched, staged only the 25 gym citydata files +
  NRA-MASTER.xlsx by exact path, and confirmed with `git status --short`
  before committing. Always do this check before committing a batch.
- Order list: `node -e` over `destinations.js` sorted by `visitors` desc, skipping
  any city whose `citydata/<slug>.json` already has a `gyms` key.
- Gotcha hit in batch 2: research subagents sometimes delegate to further
  sub-agents instead of doing the research themselves and return early with
  nothing written — check the scratch folder has all 5 files per group before
  trusting a group's "done" report; resume any that skipped straight to
  delegating with an explicit "do this yourself, no further sub-agents"
  message.
- Gotcha: `load_gyms.py` rejects any entry (including free/calisthenics ones)
  whose `src` doesn't start with `http` — a prose citation like "OpenStreetMap
  (leisure=fitness_station)" fails the whole city's file. Fix by turning it
  into a real URL (e.g. `https://www.openstreetmap.org/node/<id>` or
  `https://www.openstreetmap.org/#map=19/<lat>/<lng>`) before loading, not by
  dropping the entry.
- Gotcha: `load_gyms.py` only accepts ISO currency codes — an agent wrote
  "RMB" for Beijing (a common colloquial label, not the ISO code) and the
  whole file was rejected. Fix to "CNY" before loading; same idea applies to
  any other colloquial currency name an agent might use.
- Gotcha: `asof` must be exactly `YYYY-MM` — an agent cited a stale 2015
  TripAdvisor forum price for a Manila gym and wrote `"asof": "2015"`
  (year only), which rejected the whole file. Fix to `"2015-01"` (keep the
  honest "may be stale" note) rather than dropping the entry.
- Gotcha: every gym entry needs either `free:true` or a `pass` block — an
  agent wrote a real, confirmed gym (Mykonos' Pump Gym) with neither, because
  no price of any kind was published for it. Fix by adding
  `"pass":{"day":{"loc":null,"cur":"EUR"}}` (unpriced pass, per the existing
  `loc:null` convention) rather than dropping the entry or inventing a price.
- Gotcha: `free:true` and a `pass` block are mutually exclusive to the
  loader — an agent marked 4 Phoenix gyms `free:true` because they only offer
  a free trial pass, but also (correctly) kept `pass.day.loc:0` to record that
  trial. Fix by dropping `free:true` and keeping the `pass.day.loc:0` alone —
  that is the existing convention for "free trial of an otherwise-paid gym";
  reserve `free:true` for places with no pass concept at all (calisthenics
  parks).

## How a batch runs
1. Split the 25 cities into 5 groups of 5 and give each group to one research agent
   with the brief below (verbatim, city list swapped in). Agents write one JSON file
   per city into a scratch folder, nothing into the repo.
2. Load: `python3 _guidebuild/gyms/load_gyms.py <folder> --dry` (read the rejects),
   then without `--dry`. This writes the `gyms` key into citydata by character span,
   converts prices to USD at the day's rate, ties each gym to the nearest placed
   neighborhood within 1.5 km (`hood_geo`), and appends the Gyms tab in
   `NRA-MASTER.xlsx` (idempotent per city).
3. Verify one city of the batch in the browser (card + modal), then commit by path:
   `git add citydata/<the 25 files> NRA-MASTER.xlsx` — never `git add -A`.
4. Keep a running count in the commit message: cities done / remaining / gyms / empty.

## The agent brief (use as-is)
Research gyms for the Never Roam Alone travel site (repo at
/Users/jeffreywolinsky/AI Projects/never-roam-alone) for these cities: <5 cities with
slugs>. For each city find gyms a traveler can pay to use WITHOUT a membership: day,
multi-day or week pass, prices where published. Aim for 4–8 per city spread across
the five neighborhoods in citydata/<slug>.json (`hoods`, `hood_geo`). Counts:
commercial gyms/studios; chains with a country-wide pass price (mark chain:true);
hotel gyms only if the page says non-guests can buy a pass; public sports centres
with a casual entry fee; free outdoor calisthenics parks (free:true, no pass; source
OSM leisure=fitness_station or a council page); a free trial day pass counts (loc 0).
Excludes: membership-only, aggregator-only with no pass info, anything unsourced.
Honesty: never invent or estimate a price; record only what a page states, in local
currency with its code; pass exists but unpriced → {"loc": null}; a dated local guide
is acceptable when the gym's own site has no price (say so in "note"); nothing found
→ empty array. Coordinates: geocode the address with GOOGLE_MAPS_API_KEY read from
the repo .env (never print or write the key), Nominatim as fallback (1 req/s, UA
header). Search in the local language when English finds nothing. Budget ≈12
searches/fetches per city. Output one file per city, <scratch>/<slug>.json, a JSON
array of {"n","kind":"gym|studio|public|hotel|calisthenics","addr","lat","lng",
"chain","free","pass":{"day":{"loc","cur"},"multi":{"label","loc","cur"},
"week":{"loc","cur"}},"src","asof":"YYYY-MM","note"} — omit pass keys that do not
exist, omit "pass" for free entries. Reply with a table: city, gyms found, with a
published day price, and why any city is empty. Do not paste the JSON.

## Known traps
- MacFit, Fitness Time, Gold's Gym (JP/US) and Jetts sit behind bot walls: exclude,
  do not bypass, note it.
- Anytime Fitness prices per branch in Japan (chain:false there); in most other
  countries it publishes no paid pass (exclude).
- A "locality" geocode at 0 km from the city centre is Google returning the city;
  the loader does not check this, the geocoder does.
- The neighborhoods with no `hood_geo` (175, listed in hood-geo-unresolved.md) never
  get gyms tied to them; those gyms fall under "Anywhere in the city", which is fine.
