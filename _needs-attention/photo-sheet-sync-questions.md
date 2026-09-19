# Photo sync into the sheet: what I did not guess (2026-09-18)

The sheet's City Photo and Hood 1-5 Photo File/Credit columns now match
`city-photos.js` and `hood-photos.js` exactly (7,612 cells; full log in
`_done/photo-sheet-sync-2026-09-18.csv`). These items need your call.

## 1. Site photos filed under a neighborhood the sheet does not have (13), plus one stale city key

The photo exists on the site's photo list, but its neighborhood is not one of that
city's hoods, so the page never shows it. Most look like hoods that were renamed or
removed (e.g. Vaduz: Balzers and Triesenberg were taken out as day trips).

| City | Photo filed under | File | The city's hoods now |
|---|---|---|---|
| Abu Dhabi | Al Maryah Island | `images/hoods/abu-dhabi--al-maryah-island.webp` | Al Reem Island, Yas Island, Saadiyat Island, Corniche, Khalifa City |
| Brussels | Grand Place | `images/hoods/brussels--grand-place.webp` | Ixelles, Saint-Gilles, Marolles, Sablon, European Quarter |
| Copenhagen | Indre By | `images/hoods/copenhagen--indre-by.webp` | Norrebro, Vesterbro, Osterbro, Christianshavn, Frederiksberg |
| Frankfurt am Main | Innenstadt (Altstadt) | `images/hoods/frankfurt-am-main--innenstadt-altstadt.webp` | Sachsenhausen, Bornheim, Nordend, Westend, Bockenheim |
| Honolulu | Kahala | `images/hoods/honolulu--kahala.webp` | Waikiki, Ala Moana, Kakaako, Manoa, Chinatown |
| Palma de Mallorca | Playa de Palma | `images/hoods/palma-de-mallorca--playa-de-palma.webp` | Casco Antiguo (Old Town), Santa Catalina, El Terreno, Portixol, Son Espanyolet |
| San Marino | Serravalle | `images/hoods/san-marino--serravalle.webp` | Città di San Marino (Historic Center), Borgo Maggiore, Dogana, Domagnano |
| Sharjah | Al Qasba | `images/hoods/sharjah--al-qasba.webp` | Al Majaz, Al Nahda, Al Khan, Al Taawun, Heart of Sharjah |
| Tel Aviv | Ramat Aviv | `images/hoods/tel-aviv--ramat-aviv.webp` | Florentin, Neve Tzedek, Jaffa (Yafo), Rothschild (Lev Ha'ir), HaYarkon Beachfront (Old North) |
| Vaduz | Balzers | `images/hoods/vaduz--balzers.webp` | Vaduz Städtle (City Center), Schaan, Triesen |
| Vaduz | Triesenberg / Malbun | `images/hoods/vaduz--triesenberg-malbun.webp` | Vaduz Städtle (City Center), Schaan, Triesen |
| Vladimir | Studyonaya Gora | `images/hoods/vladimir--studyonaya-gora.webp` | Historic Center (Sobornaya Square), Georgievskaya Street (Old Town), Trading Rows (Bolshaya Moskovskaya), Klyazma Riverside, Yuryevets |
| Weno | Neiwe | `images/hoods/weno--neiwe.webp` | Iras, Nantaku, Mechitiw, Sapuk, Wichap |
| Luxembourg City | (whole city) | | `hood-photos.js` still has a "Luxembourg City" key; the sheet row was merged into "Luxembourg" as an alias on 2026-09-02 |

**Question:** delete these orphan entries from `hood-photos.js` (the files stay on disk), or
tell me which hood each one should belong to.

## 2. The sheet repeats a neighborhood to fill 5 slots (23 cities)

The site shows 3 or 4 hoods for these cities, each once. The sheet repeats one (two
for Manzhouli and Sigiriya) so all 5 slots are filled. That breaks rule 1 (never
pad) and the sheet/site parity.

Avignon, Bariloche, Carcassonne, Charlottetown, Chiang Rai, Girona, Göreme, Harar, Kanchanaburi, Lalibela, Leticia, Manzhouli (2 names), Mar del Plata, Mont-Saint-Michel, Pai, Pristina, Saint Martin's Island, San Andrés, Savonlinna, Sigiriya (2 names), Tamanrasset, Taormina, Timimoun

**Question:** clear the repeated slots in the sheet so it matches the site? (Nothing on the site changes.)

## 3. Landmark and food photos have no sheet columns

`city-landmark-photos.js` and `city-food-photos.js` exist only on the site.

**Question:** add sheet columns for them, or record them as site-only in the sheet's parity note?

## Done without asking

- Cancún / Punta Cancún: the sheet named `images/hoods/cancun--punta-cancun.jpg`, which does not
  exist, and the site has no photo for that hood. Cleared both cells (old values are in the log).
- Photos with no source page (our own photos: 1 city, 2 hoods) are credited in the sheet as
  "Own photo (Never Roam Alone)", matching the site, which shows no credit for them.
