# Resume note: replacing reused / wrong food photos (Jeff: "yes to A and B", 2026-09-21)

Question file: `food-photos-reused-and-credits.md`. B (27 junk credits) done in 36eb8275.

## Rules (agreed once)
- Scope: every food slot whose photo is shared by 4+ differently named dishes (1,788 slots, 768 cities), in `_guidebuild/foodphotos/reuse/scope.json`, most-visited city first.
- Keep a photo only if it shows that exact dish or drink (the same dish under another name counts: bissap = hibiscus drink, samboosa = samosa).
- Otherwise replace with a photo of that exact dish, checked by eye on a candidate sheet, Wikimedia Commons only, licence allowing commercial use (no NC/ND). The plant, the shop front or a generic cousin dish is not the dish.
- None found: `food_photos[i] = null`; the page shows "We haven't found a photo for this" + Contribute a photo (e0658993).
- A new photo goes only to the city being fixed, under its own file name, unless other cities are named by hand in the pick's `share` list (same dish in the same food tradition: Central Asian samsa, Argentine empanadas). Same name is not enough: Tunisian couscous is not Moroccan couscous, Turkish mantı is not Uzbek manti (learned in batch 3).
- Batches of ~25 cities; site (citydata + images/food) and sheet (Food N Photo File/Credit) together; one commit per batch with the log.

## Tools (`_guidebuild/foodphotos/reuse/`, not in git)
`cands.py jobs.json outdir` -> candidate sheets; `apply.py <repo> picks.json log.json` -> writes photo, citydata, sheet; `log.json` = every change.

## Progress
| Batch | Cities (visitor order) | Slots reviewed | Kept | Replaced | No photo | Commit |
|---|---|---|---|---|---|---|
| 1 | Bangkok … Miami (25) | 57 | 43 | 9 (+6 same-dish cities) | 5 | e4fdcd65 |
| 2 | Taipei … Copenhagen (25) | 51 | 38 | 9 (+5 same-dish cities) | 4 | 45fa713a |
| 3 | Munich … Melbourne (25) | 43 | 29 | 13 (+9 same-dish cities) | 1 (+Sydney fixed in 2) | 975ad27f |
| 4 | Johor Bahru … Nagoya (25) | 43 | 19 | 17 (+Kuching) | 7 | 601017fa |
| 5 | Yokohama … Luxor (25) | 58 | 21 | 23 (+8 same-dish cities) | 14 | 38340401 |
| 6 | Bodrum … Brisbane (25) + Thessaloniki koulouri | 53 | 20 | 17 | 15 (+2 already fixed) | d54b69fd |
| 7 | Tehran … Hiroshima (25) | 58 | 22 | 21 | 15 | d9a2bda7 |
| 8 | Guatemala City … Tainan (25) | 58 | 26 | 25 | 7 | 348730f6 |
| 9 | Alicante … Nadi (25) | 66 | 23 | 32 | 11 | fd4e8f7f |
| 10 | Bilbao … Bergen (25) | 64 | 19 | 30 | 15 | 4b837c60 |
| 11 | Bridgetown … Lusaka (25) | 47 | 12 | 23 | 12 | fd324564 |
| 12 | Alexandria … Marsa Alam (25) | 45 | 12 | 25 | 8 | 66045905 |
| 13 | Addis Ababa … Zadar (25) | 63 | 10 | 34 | 19 | 4019498e |
| 14 | Sa Pa … Mendoza (25) | 59 | 18 | 24 | 17 | f57a4b60 |
| 15 | Qingdao … Oaxaca (25) | 67 | 9 | 35 | 23 | 8f7caafb |
| 16 | Lahore … Skopje (25) | 61 | 12 | 33 | 16 | deba0405 |
| 17 | Plovdiv … Perpignan (25) | 53 | 8 | 34 | 11 | 5698fc05 |
| 18 | Saint-Denis … Yaoundé (25) | 62 | 20 | 20 | 22 | 678a2838 |
| 19 | Ica … Matsumoto (25) | 58 | 4 | 35 | 19 | 7c69a636 |
| 20 | Saipan … El Calafate (25) | 67 | 6 | 36 | 25 | a07dca98 |
| 21 | Ushuaia … Gisenyi (25) | 60 | 5 | 27 | 28 | b7ebcb69 |
| 22 | Kaş … Trinidad (25) | 60 | 10 | 37 | 13 | 895655c9 |
| 23 | Darwin … Magelang (25) | 67 | 3 | 38 | 26 | a824cf13 |
| 24 | Sucre … Mardin (25) | 59 | 10 | 31 | 18 | 66522627 |
| 25 | Baguio … Mysore (25) | 55 | 7 | 39 | 9 | 979d25c8 |
| 26 | Angra dos Reis … Ulm (25) | 60 | 10 | 30 | 20 | 0ab5821b |
| 27 | Trujillo … Tripoli (25) | 49 | 8 | 27 | 14 | 131adf78 |
| 28 | Bangui … Weimar (25) | 55 | 13 | 18 | 24 | 4adbcf9e |
| 29 | Antsiranana … Ibadan (30) | 71 | 12 | 38 | 21 | a3dcd09e |
| 30 | Osogbo … Vladimir (19) | 45 | 7 | 25 | 13 | a28ebb29 |
| 31 | Funafuti … Fenghuang (19) | 51 | 5 | 19 | 27 | 8eb7bd1f |

## Clean-up at the end
- Image files no longer referenced by any city (e.g. vino-dulce-de-malaga.webp after its photo was dropped) are removed in one sweep after the last batch.
- Thessaloniki's koulouri was kept in batch 5 by file name but is really a table of salads; it is redone in batch 6.

## Finished 2026-09-21
All 31 batches done (768 cities, 1,788 slots). Clean-up: 449 image files that this pass left unreferenced were removed; 111 files that were already unreferenced before the pass were left alone. No image is now shared by 4+ differently named dishes.
