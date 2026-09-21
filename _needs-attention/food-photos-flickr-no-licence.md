# Food photos with no author and no licence (found 2026-09-21)

**Question for Jeff:** these photos have no author and no licence on record. Should they be re-checked and fixed after the reused-photo pass (batches 10 to 31)?

## What was found

During the reused-photo pass (A), some food photos turned out to be sourced from Flickr. Their credit reads "Wikimedia Commons" and the licence field is blank. The page link goes to a Flickr photo page, not to Commons.

| | Count |
|---|---|
| Photos | 922 (after batch 9) |
| City files that have them | 438 |

A blank licence means we cannot show that commercial use is allowed. That breaks rulebook §4.3: "Licence must allow commercial use".

## Proposed fix (not started)

Check each Flickr page for its current licence and author.
- If the licence allows commercial use (CC BY, CC BY-SA, CC0, PDM), write the real author and licence into citydata and the sheet.
- If it does not (NC, ND, or all rights reserved), replace the photo using the same rules as pass A, or set it to "no photo".

This needs the Flickr API or one page fetch per photo. It is a separate pass from A.
