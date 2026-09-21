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
| 7 | Tehran … Hiroshima (25) | 58 | 22 | 21 | 15 | this commit |

## Clean-up at the end
- Image files no longer referenced by any city (e.g. vino-dulce-de-malaga.webp after its photo was dropped) are removed in one sweep after the last batch.
- Thessaloniki's koulouri was kept in batch 5 by file name but is really a table of salads; it is redone in batch 6.
