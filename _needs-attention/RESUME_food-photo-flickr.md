# Resume note: food photos with no author or licence (Jeff: "fix the flickr food photos with no author", 2026-09-23)

Question file: `food-photos-flickr-no-licence.md`. Work is on the `food-photo-fixes` branch (this folder, `nra-food-photos`), because the reused-photo pass that came first is here and not yet in main.

## Scope (counted 2026-09-23 on this branch)
- 814 food photo slots whose page link is a Flickr photo and whose licence is blank (700 distinct Flickr pages).
- 31 slots with an image file but no source link at all.
- 845 slots in 433 cities. The 334 "Photo coming soon" placeholders are already "no photo" and are out of scope.

## Rules (agreed once)
1. Every Flickr page is read for its current licence code, owner and title (`_guidebuild/foodphotos/flickr/fetch_flickr.py`, one page every 1.5 s, no API key; raw pages cached).
2. **Keep** a photo only if both hold:
   - its current Flickr licence allows commercial use: CC BY 2.0/4.0, CC BY-SA 2.0/4.0, CC0, Public Domain Mark, "No known copyright restrictions", US Government Work;
   - it shows that exact dish or drink, judged by eye on a check sheet plus the Flickr title (same rule as the reused-photo pass: the same dish under another name counts; a generic cousin dish does not).
   - the site's image file is the same photo as the Flickr page (`flickr/match.py`: both cropped 4:3, 16x16 difference hash, distance under 20; 2026-09-23 run: 691 match, 113 do not, 7 unreadable). A file that does not match its page has no known source and is treated like a no-source slot.
   A kept photo gets the owner's real name (else the Flickr username) in `by` and the licence in `lic`. Only citydata changes: the sheet holds the file and page link, which stay the same.
3. **Otherwise** (NC, ND, all rights reserved, deleted, private, wrong dish, or no source): replace with a Wikimedia Commons photo of that exact dish, checked by eye, licence allowing commercial use, written by `reuse/apply.py` (image, citydata and sheet together). None found: the slot becomes "no photo".
4. city.html's credit tooltip names Flickr as the source when the page link is a Flickr page (was always "Wikimedia Commons").
5. Batches of 25 cities, most-visited first; one commit per batch with the log. Nothing is pushed; this branch still has to be merged into main by key.

## Progress
| Batch | Cities | Slots | Kept | Replaced | No photo | Commit |
|---|---|---|---|---|---|---|
| 1 | Delhi … Chamonix (25) | 36 | 13 | 10 | 13 | (this commit) |
| 2 | Suzhou … Aswan (25) | 41 | 8 | 17 | 16 | see git log |
| 3 | Casablanca … Baghdad (25) | 39 | 10 | 15 | 14 | see git log |
| 4 | Saint-Tropez … Bergen (25) | 40 | 4 | 12 | 24 | see git log |
| 5 | Bridgetown … Córdoba (25) | 48 | 7 | 17 | 24 | see git log |
| 6 | Poznań … Faro (25) | 46 | 8 | 17 | 21 | see git log |
| 7 | Bristol … Valparaíso (25) | 46 | 9 | 16 | 21 | see git log |
| 8 | Pula … Plettenberg Bay (25) | 31 | 0 | 15 | 16 | see git log |
| 9 | Gisenyi … Puerto Natales (25) | 46 | 7 | 24 | 15 | see git log |
