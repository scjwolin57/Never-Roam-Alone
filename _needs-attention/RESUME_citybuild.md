# Resume note — "cities over 500k or capital" batch build

Started 2026-07-18 by an autonomous Cowork session.

GOAL: add a full city guide (via _guidebuild/add_city.py) for every city in
world-cities-master.csv that is EITHER population > 500,000 OR capital == 'yes',
that is not already on the site.

SCOPE AT START: 922 qualify, 213 already present (after normalized dedup),
709 genuinely missing. Highest-population-first.

HOW TO RESUME:
1. Recompute missing = qualifying names NOT in destinations.js, normalizing
   (strip accents, drop "City"/"Town", aliases Bombay/Mumbai, Bangalore/Bengaluru,
   Astana/Nur-Sultan, etc.). add_city.py updates destinations.js so this reflects
   progress automatically.
2. Research each city into JSON per _guidebuild/CITY_SCHEMA.md + example-city.json.
3. GUIDE_ROOT=<project> python3 _guidebuild/add_city.py batch.json  (dup-safe).
4. Verify: python3 _guidebuild/checkjs.py city.html  (zero errors); git diff --stat.
5. git commit + push (HTTPS) so Netlify redeploys.

Two restart-if-stalled scheduled tasks were set for +5h and +10h from the start.
Photos are NOT auto-sourced: add_city.py flags missing images/cities/<slug>.jpg.

## Progress log
- 2026-07-18: destinations.js started at 248 cities.
- Batch 1 (commit b409993): +10 — Mumbai, Tianjin, Wuhan, Jakarta, Dongguan, Chongqing, Chengdu, Nanjing, Nanchong, Xi'an.
- Batch 2 (commit 8e4b447): +15 — Bengaluru, Kolkata, Chennai, Saint Petersburg, Lahore, Shenyang, Hangzhou, Harbin, Tai'an, Suzhou, Shantou, Jinan, Zhengzhou, Changchun, Dalian.
- Batch 3 (commit fcfcbf2): +15 — Yokohama, Ankara, Hyderabad, Ahmedabad, Alexandria, Chittagong, Kano, Ibadan, Kunming, Qingdao, Foshan, Wuxi, Xiamen, Tianshui, Ningbo.
- Now at 288 cities. ~669 qualifying-missing remain (highest-population-first).
- NOT YET PUSHED: `git push` is blocked from the cloud sandbox (SSH to GitHub forbidden; no creds here). Run `git push` from your own Mac terminal to deploy all 3 commits. If git complains about a stale `.git/index.lock`, delete it first (`rm .git/index.lock`).
- Data note: master-file row "Puyang" has bad coords (Zhejiang/Yiwu, not Henan) — skipped, needs manual review.
- Photos still needed for every added city: images/cities/<slug>.jpg.

## Photos (added 2026-07-18, commit 9532c01)
- All 40 cities from batches 1-3 now have real hero photos in images/cities/<slug>.jpg,
  sourced from each city's Wikipedia/Commons lead image (Wikimedia REST summary API),
  resized to max 2000px, and registered in city-photos.js with the Commons file page as `page` credit.
- Method: python + Wikimedia REST API (https://en.wikipedia.org/api/rest_v1/page/summary/<Title>),
  then `photo_page` added to each city JSON and add_city.py re-run to auto-register in city-photos.js.
- Chennai and Hyderabad's lead images were too low-res; replaced with Marina Beach and Golconda Fort.
- FOR FUTURE BATCHES: do the same — every new city should get a real images/cities/<slug>.jpg + city-photos.js entry.
  Throttle Wikimedia requests (~2s apart) to avoid HTTP 429.
- Photo credit pages for this batch saved at _guidebuild/sandbox/allcities_withphotos.json (photo_page field).
