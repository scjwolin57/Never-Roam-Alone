# Resume: China landmark pins from Amap search in Jeff's Chrome (started 2026-10-19)

Jeff, 2026-10-19: "retry the amap search for the remaining china pins later, slower".

## State
- `china-unverified-landmarks-2026-10-14.csv`: rows with status `UNVERIFIED` and an empty or old `why` are still to search.
  Rows whose `why` starts "Amap 2026-10-19:" were searched and left on purpose; do not search them again.
- First pass (af89e7d2): 29 searched, 14 moved, 1 verified. Amap answered HTTP 419 after about 28 searches at 2 to 3 s apart.
  Baidu Maps asked for a CAPTCHA on every search, even after Jeff cleared it; never try to solve a CAPTCHA.

## Method
1. Claude in Chrome (Jeff's own Chrome), your own new tab, open https://www.amap.com/ and wait for it to load.
2. From that page, fetch `https://www.amap.com/service/poiInfo?query_type=TQUERY&pagesize=5&pagenum=1&qii=true&cluster_state=5&need_utd=true&utd_sceneid=1000&div=PC1000&addr_poi_merge=true&is_classify=true&keywords=<amap_search>` with `credentials:'include'`. Read `data.poi_list[]`: name, cityname, address, longitude, latitude (GCJ-02).
3. **Slow:** one search every 15 to 20 seconds, at most 40 per run. Stop at the first HTTP 419 or empty answer; leave the rest for the next run.
4. Keep a result only when its name and city match the landmark and it is the main place (not a gate, car park, shop or bus stop). Large natural features keep their stored pin unless the stored one is off the feature. A place far outside the city goes to Jeff as "landmark or day trip?", not moved.
5. Write accepted points as `{"<csv row>": ["<amap name>", lng, lat]}` to `_guidebuild/chinapins/amap_<date>.json`, run `python3 _guidebuild/chinapins/eval.py <that file>` (GCJ-02 to WGS-84, distance to stored pin, OpenStreetMap reverse lookup). Apply only where OSM names the right place or district: build `[{"slug","idx","lat","lng","precise"}]` (keep the stored `precise`) and run `python3 _guidebuild/chinapins/movepins.py <file>`. Within 250 m of the stored pin = VERIFIED, no move.
6. Update the CSV status / why per row, the TODO China pins item count, then run `node --check city-landmark-coords.js`, `node _guidebuild/check_landmark_coords.js`, `python3 _guidebuild/check_landmark_sync.py`, `python3 _guidebuild/check_sheet_parity.py` (must read 0). Commit by path (city-landmark-coords.js, the citydata files, the CSV, TODO.md), never push.
7. Close your Chrome tab. If rows remain, schedule the next run a few hours later.
