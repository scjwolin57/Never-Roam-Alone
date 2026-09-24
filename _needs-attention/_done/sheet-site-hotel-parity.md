# The sheet and the site disagree on neighborhoods and hotels (found 2026-09-18)

**Question for Jeff:** which copy is right for the neighborhood hotels, the site (`citydata/`) or the sheet (NRA-MASTER.xlsx, Live Cities)? The rulebook names the sheet as the master, but the numbers below suggest recent hotel and neighborhood passes updated the site and never wrote back to the sheet.

Committed sheet (HEAD) compared with the site's city files:

| Mismatch | Count |
|---|---|
| Cities with at least one mismatch | 471 of 893 |
| Hotel lists (high/mid/budget) that differ | 1,813 of 4,029 neighborhoods |
| Neighborhood names that differ | 386 |

Examples: Hamilton's Paget hood lists Elbow Beach / Coco Reef / Greenbank in the sheet but Newstead Belmont Hills / Inverurie / Coco Reef on the site; El Calafate's Bahia Redonda hood holds placeholder text in the sheet ("Bahia Redonda lakefront hotels"); Inhambane's sheet row still has a 5th neighborhood the site dropped.

**Suggested fix (after you choose):** regenerate the losing copy from the winner with a script, in one commit, with a parity check that must reach zero. Not started. The neighborhood fixes of 2026-09-18 wrote their own rows to the sheet correctly, but the older mismatches in those same cities were left alone.

Also found: `_guidebuild/extend_citydata.py` must not be run as is. Its catalog files are older than `citydata/` (for example `city-food-photos.js` would blank or change food photos in almost every city, and `city-landmark-coords.js` fails its own parity check). It was run once on 2026-09-18, the damage was spotted before anything was committed, and every city file was restored. Day-trip changes are now written straight into `citydata/` and `day-trips.js` together.

## RETIRED 2026-09-23
Answered by decisions 2026-09-19, filled by 523f41c4; 0 hotel differences across 4,027 hoods (checked 2026-09-23). The 4 six-hood cities are tracked in photo-sheet-sync-questions.md item 4.
