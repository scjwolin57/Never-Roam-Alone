# Resume note: replacing reused / wrong food photos (Jeff: "yes to A and B", 2026-09-21)

Question file: `food-photos-reused-and-credits.md`. B (27 junk credits) done in 36eb8275.

## Rules (agreed once)
- Scope: every food slot whose photo is shared by 4+ differently named dishes (1,788 slots, 768 cities), in `_guidebuild/foodphotos/reuse/scope.json`, most-visited city first.
- Keep a photo only if it shows that exact dish or drink (the same dish under another name counts: bissap = hibiscus drink, samboosa = samosa).
- Otherwise replace with a photo of that exact dish, checked by eye on a candidate sheet, Wikimedia Commons only, licence allowing commercial use (no NC/ND). The plant, the shop front or a generic cousin dish is not the dish.
- None found: `food_photos[i] = null`; the page shows "We haven't found a photo for this" + Contribute a photo (e0658993).
- A replacement file shared with the same dish in other cities updates all of them together (credit stays true); a file shared with a different dish gets a city-specific name.
- Batches of ~25 cities; site (citydata + images/food) and sheet (Food N Photo File/Credit) together; one commit per batch with the log.

## Tools (`_guidebuild/foodphotos/reuse/`, not in git)
`cands.py jobs.json outdir` -> candidate sheets; `apply.py <repo> picks.json log.json` -> writes photo, citydata, sheet; `log.json` = every change.

## Progress
| Batch | Cities (visitor order) | Slots reviewed | Kept | Replaced | No photo | Commit |
|---|---|---|---|---|---|---|
| 1 | Bangkok … Miami (25) | 57 | 43 | 9 (+6 same-dish cities) | 5 | e4fdcd65 |
| 2 | Taipei … Copenhagen (25) | 51 | 38 | 9 (+5 same-dish cities) | 4 | this commit |
