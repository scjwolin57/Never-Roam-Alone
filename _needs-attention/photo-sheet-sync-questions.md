# Sheet and site: neighborhood lists disagree (found during the photo sync, 2026-09-19)

## Done (Jeff: "delete entries, clear duplicates, add columns")

- **Orphan photo entries deleted from `hood-photos.js`** (files stay on disk): San Marino / Serravalle,
  Sharjah / Al Qasba, Tel Aviv / Ramat Aviv, Vaduz / Balzers, Vaduz / Triesenberg / Malbun, and the
  stale "Luxembourg City" block (5; "Luxembourg" has its own). The other 8 on the first list
  (Abu Dhabi / Al Maryah Island, Brussels / Grand Place, Copenhagen / Indre By, Frankfurt /
  Innenstadt, Honolulu / Kahala, Palma / Playa de Palma, Vladimir / Studyonaya Gora, Weno / Neiwe)
  ARE shown on the site; they only looked orphaned because the sheet's hood list differs. Kept.
- **23 cities: sheet hoods now match the site** (Avignon ... Timimoun). 25 repeated slots cleared,
  plus 13 slots holding hoods the site had already removed as day trips or outlying places
  (e.g. Kanchanaburi "Erawan National Park (day-trip)", Chiang Rai "Golden Triangle", Tamanrasset
  "Outskirts / Tuareg Camps"). Log: `_done/sheet-hood-repeats-cleared-2026-09-19.csv`.
- **50 sheet columns added**: Landmark 1-10 Photo File/Credit (8,349 photos) and Food 1-10
  Name/Photo File/Credit (7,112 dishes, 211 photos; photos exist for 25 cities only).

## Still open: decide which side is right

1. **129 cities where the sheet's hood list is not the site's.** 126 have 5 hoods in the sheet but
   3-4 on the site (e.g. Abha, Aix-en-Provence, Annecy, Axum, Banff); 3 have different names
   (e.g. Abu Dhabi: sheet has Al Reem Island, site has Al Maryah Island). The site is what visitors
   see and most gaps look like hoods removed on the site only. **Question:** make the sheet match
   the site for all 129 (same method as the 23 above), after a per-city list for you to scan?
2. **10 hood photos for hoods only the sheet has** (Abu Dhabi / Al Reem Island, Florence / Santo
   Spirito, Honolulu / Kakaako and Manoa, Macau / Senado Square, Marne-la-Vallée / Val d'Europe,
   Orlando / Thornton Park, Palma / Son Espanyolet, Sapporo / Chuo, Valencia / El Carmen). They
   follow item 1: if the sheet matches the site, these entries get deleted too.
3. **Landmarks:** Tozeur and Şanlıurfa. The sheet still lists El Ferdous Mosque (Tozeur ships with
   9, decisions.md) and Harran (a day trip) which the site removed. Clear them in the sheet?
4. **4 cities show 6 hoods on the site** (Salalah, Brussels, Frankfurt am Main, Copenhagen); the
   per-city shape is 5. Which one goes in each?
5. **Tooling:** `_guidebuild/add_city_to_sheet.py` does not fill the new landmark and food photo
   columns yet, so a new city would leave them blank until it does.
