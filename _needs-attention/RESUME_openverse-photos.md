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
- Day 2 (2026-10-20, scheduled run): Openverse was very slow all day. 190 calls: 38 gaps searched and saved,
  152 skipped (150 timeouts at 40 s, 2 HTTP 500), all to retry next run. The 38 returned 66 hits; 29 were big
  enough to check, 0 had a Flickr or Commons geotag (Flickr pages loaded in full; the geotag reader was
  re-tested on a known geotagged Addis Ababa photo and still works). Applied 0, rejected 0. No commit of
  photos or data. Running total: 211 of 846 gaps have a result file; 635 left, including the skipped ones.
- Gotcha: in zsh, pass a key list to geo.py as `${=K}`, not `$K` (zsh does not split words), or geo.py
  silently matches nothing.
- Day 3 (2026-10-21, scheduled run): Openverse still slow (a one-word test query took 33 s against the 40 s
  timeout). 190 calls: 111 gaps searched and saved, 79 skipped (76 timeouts, 3 HTTP errors), to retry next run.
  The 111 returned 212 hits; 107 were big enough to check; 3 gaps had a geotagged hit within range
  (`work/c5_cands.json`, sheet `work/c5_sheet.jpg`, 8 candidates). Applied 0. Rejected 3 gaps by eye:
  Bariloche Playa Bonita (portrait, dark path, does not show the area), Ensenada Centro (indoor mural, not the
  downtown or malecón), Knysna Leisure Isle (a person filling the frame, a breakfast plate, a map sign, birds,
  a jellyfish). No photo or data commit. Running total: 322 of 846 gaps have a result file; 524 left,
  including the skipped ones.
- Day 4 (2026-10-22, scheduled run): Openverse slow for the first 40 minutes, then normal. 190 calls: 128 gaps
  searched and saved, 62 skipped (all timeouts at 40 s), to retry next run. The 128 returned 212 hits; 180 were big
  enough to check; 2 gaps had a geotagged hit within range (`work/c6_cands.json`, sheet `work/c6_sheet.jpg`,
  4 candidates, both in Positano). Applied 0. Rejected both gaps by eye: MAR Positano (one a portrait window view
  with a watermark, the other the Church of Santa Maria Assunta above the museum, which already has its photo),
  Arienzo Beach (both show Spiaggia Grande and the town, not the Arienzo cove; one with people in front).
  No photo or data commit. Running total: 450 of 846 gaps have a result file; 396 left, including the skipped ones.
- Day 5 (2026-10-23, scheduled run): Openverse slow for the first hour (about half the calls timed out), then
  normal. 190 calls: 134 gaps searched and saved, 56 skipped (55 timeouts at 40 s, 1 HTTP 500 on Bangui #8), to
  retry next run. The 134 returned 256 hits; 129 were big enough to check; 3 gaps had a geotagged hit within range
  (`work/c7_cands.json`, sheet `work/c7_sheet.jpg`, 5 candidates). Applied 1: Ouarzazate Centre-ville (Avenue
  Mohammed V), a street scene by Giåm on Flickr (CC BY-SA 2.0), geotag 0.78 km from the hood point and the
  photographer's caption "Ouarzazate. Dans les rues du centre-ville."; the minaret close-up from the same set was
  passed over as less representative. Rejected 2 gaps by eye: N'Djamena Moursal (a consulate gate with a Canadian
  flag and plaque, not the neighborhood), Saskatoon Western Development Museum (two gingerbread-house displays
  inside the museum, portrait, one with a person; wrong subject, so not a portrait-review case). Running total:
  584 of 846 gaps have a result file; 262 left, including the skipped ones.
