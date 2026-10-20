# Missing landmark and neighborhood photos: free pass of 2026-10-19

Jeff: "after that, move on to the next task" (the missing photos). Free sources only (Wikimedia Commons and Wikidata), no Google spend.

| | Before | Filled | Still without a photo |
|---|---|---|---|
| Landmarks | 558 | 61 | 497 |
| Neighborhoods | 577 | 224 | 353 |

**Method.** Landmarks: the place's own Wikidata image when the Wikidata item lies within 2 km of our pin, or a Commons photo geotagged within 500 m whose title or category names the landmark. Neighborhoods: a Commons photo geotagged inside the neighborhood's search area (600 m, or 900 m for the 1.2 km hoods), or the neighborhood's own Wikidata image. Commercial-use licence only (no NC/ND). Every pick eye-checked on a contact sheet; for neighborhoods the 3:4 crop was eye-checked too, and 15 were dropped after cropping (subject cut off, mostly sky, water or dirt, a person filling the frame). Per-batch picks and rejections: `_guidebuild/lmkphoto/work/`, `_guidebuild/hoodphoto/work/` (`b*_picks.json`, `b*_rejected.json`).

**Why the rest are empty.** For most of them no Commons photo is geotagged near the pin, or every nearby photo is the wrong subject (interiors, portraits, food, museum objects, plants, street signs). These keep the "No photo yet" stand-in, per the rule that an empty slot beats a wrong photo.

**What could fill more, later.**
1. ~~Flickr Creative Commons search~~: not pursued, the Flickr API key is not free (Jeff, 2026-10-19).
2. Mainland China landmarks: Commons coverage is thin; Chinese-name search on Commons.
3. Jeff's own photos in `_needs-attention/uploads/`.

## Google Images "Creative Commons licenses" pilot (2026-10-19)

Jeff: "try using a city and name search on google images with a creative commons filter applied". 12 missing photos picked at random (8 landmarks outside China, 4 neighborhoods), one search each in Jeff's Chrome (`udm=2&tbs=sur:cl`), every hit checked on its own page.

**Result: 0 of 12 usable.**
- 6 searches returned nothing at all (Lampulo Boat on the Roof, Ponderosa Adventure Park, Shomudro Bilash, Klemat, M'Gombani, plus Golden Mile Bentota with no photo host among its hits).
- The rest returned the wrong place: Al Bujairi Heritage Park gave At-Turaif (across the wadi, a different site); Center Street Promenade gave Pearson Park and a statue in another Anaheim park; "Nelson Saturday Market" gave Paddington Markets in Sydney; "Maun Educational Park" gave a park in Mansfield, England; Matlapana gave two locator maps.
- Google's filter also lets non-commercial licences through: 4 of the 8 Flickr hits were CC BY-NC-ND, which our rule rejects.

**Conclusion:** the filter finds what Commons and Flickr already hold, and our missing slots are exactly the places those sites lack. Not worth a full pass; your own photos in `uploads/` or a paid source remain the ways to fill them.
