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
