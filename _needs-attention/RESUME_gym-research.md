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
- Remaining: 493 cities. Work highest-visitors-first, 25 cities per batch.
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
