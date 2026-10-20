# Resume: missing photos from Openverse (started 2026-10-19)

Jeff, 2026-10-19: "try openverse first". Gaps: `missing-photos-2026-10-19.csv` (846 at the start).

## Method (`_guidebuild/ovphoto/`)
1. `python3 search.py 190` — one Openverse query per gap ("<name> <city>"), busiest guides first, licence filter
   commercial + modification (CC0, PD, CC BY, CC BY-SA). Anonymous limit 200 a day; results cached in `work/res/`,
   so each run continues where the last stopped. A timeout or server error skips the gap (retried next run).
2. `python3 geo.py work/cN_cands.json` — keeps a hit only when its Flickr or Commons geotag is within 1 km of the
   landmark pin (3 km for precise:false) or 1.2 km of the neighborhood point. A title alone never counts.
3. `python3 ../lmkphoto/sheet.py work/cN_cands.json work/cN_keys.json work/cN_sheet.jpg` — eye-check every
   candidate: right subject, landscape for landmarks, no people filling the frame, no watermark, not a flag or map.
4. `python3 apply_ov.py work/bN_picks.json work/cN_cands.json` (`[{"key","n"}]`) — writes citydata, the photo js
   and the sheet together; then node --check, check_landmark_sync.py, check_sheet_parity.py; commit by path.

## Progress
- Day 1 (2026-10-19): 173 of 846 searched (21 skipped on timeouts, to retry). 7 gaps had a geotagged hit;
  3 applied (Bishkek, Chamonix, Malacca; 6abbe77a), 4 rejected by eye.
- Yield so far: about 1 photo per 58 gaps searched. The full list would give roughly 15 photos over 4 more days.
