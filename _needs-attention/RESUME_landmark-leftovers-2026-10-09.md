# Landmark pin leftovers: ready to apply, waiting on the sheet and catalog files (2026-10-09)

Jeff's answers (2026-10-09): 1 yes (Komodo Island, Manta Point, Pink Beach to day trips), 2 yes (merge Bentota sandbar), 3 review and research, 4 keep Cyangugu Canopy Walkway and Calabar Kwa Falls as landmarks (nothing to do), 5 yes (China pass), 6 find photos for Cancun's Cobá, Xcaret, Xel-Há trips, else leave "Contribute a photo".

Everything is researched and dry-run clean. Nothing is applied yet because another task holds the sheet (hood review follow-ups) and another holds city-landmarks.js, city-landmark-coords.js and decisions.md (Najaf D3). Stage by path when they release.

Files: `_guidebuild/daytrips/lmkmove/leftovers_2026-10-09/`

1. `moves.json`: 17 landmarks to day trips, 3 landmarks removed.
   `python3 _guidebuild/daytrips/lmkmove/remove_landmarks.py _guidebuild/daytrips/lmkmove/leftovers_2026-10-09/moves.json` (dry first with `--dry`).
   - Labuan Bajo: Komodo Island, Manta Point, Pink Beach (full-day, boat).
   - Far real sites (Places plus OpenStreetMap or Wikidata agree; OSRM minutes): Abha Habala Village 52 (half), Jasper Maligne Lake and Spirit Island 64 (half), Kaş Kekova Sunken City 47 (half), Lilongwe Nyika 594 (full, long note), Marsa Alam Sataya Reef 128 (full) and Qulaan Mangrove 68 (half), Morondava Tsingy de Bemaraha (full, long note), Ushuaia Isla Martillo 71 (half), Mashhad Kang Village 62 (half), Tabriz Kandovan 45 (half), Papeete Vaipahi Water Gardens 47 (half), Pula Cape Kamenjak 33 (half), Fethiye Saklıkent Gorge 56 (half), Luanda Kalandula Falls (full, long note).
   - Removed, not added as trips: Siddharthanagar Puskarini Pond and Zhong Hua Monastery (inside the existing Lumbini trip), Bentota Paradise Island Sandbar (merged into Bentota Beach).
2. Pins to fix, staying landmarks (under 30 min): Al Ahmadi Sahara Kuwait Golf 29.2579,48.0261 (Places and OSM within 80 m); Houmt El Souk Djerba Explore Park and Lalla Hadria 33.8188,11.0432 (Places and OSM within 200 m); Bentota Madu River and Cinnamon Island 6.2961,80.0511 (Places; OSM and Wikidata within 3 km).
3. `china_convert.json`: 20 China pins that are Google's GCJ-02 datum, converted to WGS-84 (rule 7a: converted point within 250 m of Wikidata, stored over 350 m off). Lhasa, Leshan, Shaoxing, Datong, Luoyang, Dali, Yangzhou, Qingdao, Suzhou, Hangzhou, Xi'an, Shanghai. 274 China pins have no Wikidata match and stay unverified; 61 ambiguous.
4. Photos for the new trips: `python3 _guidebuild/daytrips/fetch_daytrip_photos.py --city <city> --retry-empty --web-search-fallback` per city after step 1, contact-sheet check before commit.
5. Not moved or fixed (no second source or ambiguous): Abu Dabbab Bay, Hamadan Alvand, Zhangjiajie Yuanjiajie, Inhambane Guinjata, Nouakchott Camel Market, Jeddah Al Rahma Mosque, Osogbo Nike Centre, Goma Grande Barrière, Krabi riverfront; Places hits that were the wrong place (Laayoune, Padang, Porto-Novo, Antwerp Scheldt).
6. Add a decisions.md row; update TODO.md item "Landmark pin pass leftovers".
