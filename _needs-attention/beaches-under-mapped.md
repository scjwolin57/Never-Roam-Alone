# Beaches Score — coastal cities where OpenStreetMap looks under-mapped

*Generated 2026-09-16 alongside the new Beaches Score column. Nothing here is wrong
in the data-collection sense — these are cities the formula scored honestly from what
OSM actually contains. They are listed because the evidence is thin enough that the
score may understate the real place, and a human would know better.*

The rule used: on a sea coast, **8 or fewer beaches mapped within 15 km**, and at least
0.5M annual visitors. Cox's Bazar is the clearest case — the world's longest natural
beach, with 6 features mapped.

No score was hand-edited. If you want any of these corrected, the honest fix is either
to improve the OSM data or to add a documented per-city override to
`_guidebuild/beaches/score.py` — not to nudge the number in the sheet, which the next
`score.py` run would overwrite.

| Visitors (M) | Score | Beaches ≤15km | ≤30km | Basis | City |
|---|---|---|---|---|---|
| 12.9 | 62 | 6 | 28 | mapped | Tokyo |
| 5.0 | 10 | 1 | 2 | mapped | Shanghai |
| 4.0 | 78 | 8 | 136 | mapped | Shenzhen |
| 4.0 | 3 | 0 | 7 | mapped | Jeddah |
| 2.5 | 72 | 7 | 18 | mapped | Manila |
| 2.5 | 49 | 8 | 34 | mapped | Buenos Aires |
| 2.5 | 46 | 4 | 75 | mapped | Johor Bahru |
| 2.5 | 36 | 5 | 18 | mapped | Jakarta |
| 2.0 | 66 | 7 | 16 | mapped | Busan |
| 2.0 | 5 | 0 | 20 | mapped | Sapporo |
| 1.5 | 70 | 7 | 10 | mapped | Santo Domingo |
| 1.5 | 46 | 7 | 24 | mapped | Jeju City |
| 1.5 | 36 | 5 | 22 | mapped | Thessaloniki |
| 1.5 | 3 | 0 | 9 | mapped | Nagoya |
| 1.4 | 28 | 2 | 62 | mapped | Anaheim |
| 1.2 | 66 | 7 | 9 | mapped | Bordeaux |
| 1.2 | 65 | 6 | 80 | mapped | Yokohama |
| 1.2 | 58 | 5 | 8 | mapped | Malacca |
| 1.2 | 41 | 6 | 7 | mapped | İzmir |
| 1.2 | 23 | 3 | 3 | mapped | Huế |
| 1.0 | 78 | 8 | 25 | mapped | Puerto Plata |
| 1.0 | 40 | 7 | 14 | mapped | Casablanca |
| 1.0 | 4 | 0 | 12 | mapped | Marsa Alam |
| 1.0 | 4 | 0 | 11 | mapped | Bursa |
| 0.9 | 37 | 6 | 36 | mapped | Mont-Saint-Michel |
| 0.8 | 40 | 5 | 7 | mapped | Ensenada |
| 0.8 | 3 | 0 | 6 | mapped | Taichung |
| 0.7 | 51 | 5 | 11 | mapped | Beppu |
| 0.7 | 24 | 6 | 23 | mapped | Glasgow |
| 0.7 | 23 | 3 | 10 | mapped | Philadelphia |
| 0.7 | 1 | 0 | 1 | mapped | Maputo |
| 0.6 | 73 | 7 | 9 | mapped | Lomé |
| 0.6 | 72 | 8 | 25 | mapped | Durban |
| 0.6 | 53 | 8 | 22 | mapped | Houmt El Souk |
| 0.6 | 35 | 5 | 5 | mapped | Kingston |
| 0.6 | 26 | 5 | 21 | mapped | Otaru |
| 0.6 | 10 | 1 | 27 | mapped | Nicosia |
| 0.5 | 39 | 4 | 4 | mapped | Hakodate |
| 0.5 | 27 | 2 | 13 | mapped | Saint-Denis |
| 0.5 | 17 | 2 | 5 | mapped | Kanazawa |
| 0.5 | 12 | 0 | 0 | coast, none mapped | Surat Thani |

41 cities.
