# Resume note: Day trip hero photos (started 2026-09-28)

*Read CLAUDE.md, then `decisions.md` (row dated 2026-09-28, day trip photos), then this.*

## What this is
Jeff approved a hero photo on every day trip card (`_needs-attention/decisions.md` 2026-09-28): Wikimedia
Commons only, location-checked against the trip's geocoded point (or the city center when it has none),
licence-checked (CC0/Public domain/CC BY/CC BY-SA only, never NC or ND), 640px webp. A trip with no verified
photo keeps a plain card -- never a filler image. The credit is mirrored to the sheet's Half-/Full-Day Trips
cell as `` | Photo: <credit>``, same convention as the day-trip safety-alert suffix.

## Tool
`_guidebuild/daytrips/fetch_daytrip_photos.py` (gitignored). Resumable: state lives in
`_guidebuild_state/daytrip_photos_state.json` (gitignored), one row per finished city; a re-run skips cities
already in it, so `--limit N` just keeps going where the last run stopped.

    python3 _guidebuild/daytrips/fetch_daytrip_photos.py --limit 150
    python3 _guidebuild/daytrips/fetch_daytrip_photos.py --city "Kotor"      # one city, for testing/redo

## Progress (2026-09-28, as of the final commit, db61780e) -- FULL PASS COMPLETE
- Cities visited by the pipeline: 893 of 893. The alphabetical pass is done.
- Trips with a photo: 2,099 of 3,100. The remaining ~1,000 have no honest Commons match at the required
  quality bar and stay without a photo (rule 2) -- getting more of them needs a fresh search pass on the
  still-empty trips specifically, which is a separate task from here.
- Eight commits landed on branch `daytrip-photos-pilot`: "batch 1" (59 cities, 146 photos, 490c49ed),
  "batch 2" (100 more, 382 total, 8c33124e), "batch 3" (150 more, 823 total, 19fbab69), "batch 4" (200 more,
  1235 total, 4235230b), "batch 7" (664 more, 2245 total after review fixes removed one, 1976cbdf -- note
  this batch also fixed the file-wide-search scope bug below), "batch 8" (final 83 cities, 2099 total after
  review fixes, db61780e). Not yet merged to main or pushed -- check `git log` before assuming what's live.
- A third pipeline bug found and fixed in batch 7: `apply_city()`'s photo replacement searched the WHOLE
  citydata file for a `"name": "<trip name>"` match, which crashed when a city had the same name in both
  `daytrips` and the food/drink modal (Ica's "Pisco" existed in both). Fixed by scoping the search/replace to
  the `"daytrips": {...}` span first. All later hand-fix scripts use the same scoped-replace pattern.
- A fourth, cosmetic bug found and fixed in batch 7: Commons' extmetadata sometimes literally doubles the
  visible artist text for an unattributed upload ("Unknown authorUnknown author", sometimes with "or not
  provided"). Collapsed to "Unknown author" across citydata and day-trips.js (10 occurrences, including 5
  from earlier-committed batches: Anchorage, Charlotte Amalie, Gold Coast, Orlando, and this batch's Pécs).
- Two real bugs found and fixed during this pass (both already fixed in the committed script):
  1. Credit text kept the wiki "(page does not exist)" suffix on a red-link username. Fixed in
     `short_author()`; 79 already-saved credits were bulk-corrected with a plain text substitution
     (no re-fetching needed -- the real name was already in the string).
  2. The "citydata trip shape drifted" safety assertion compared a photo-stripped new list against an
     un-stripped old list, so any city that already had SOME trips photographed from an earlier pass
     crashed the first time the pipeline reached its still-bare remaining trips. Fixed by stripping `photo`
     from both sides before comparing.

## The required step after every run: look at every new photo
The automated checks (license, size, aspect ratio, distance from the trip's point) are not enough by
themselves. In the first ~350 trips this pass found and hand-fixed:
- A photo that showed the country's flag, not the destination (Reykjavik/Thingvellir).
- A close-up portrait of a person instead of the place (three separate trips).
- A political mural used as a generic hero shot (Belfast/Derry).
- A 19th-century engraving and a painted folding screen -- real Commons files, but not photographs.
- A completely mismatched subject: a pet lovebird, a fruit species, a chess-tournament photo, an "Ancient
  Olympia Municipality" administrative-division photo instead of the archaeological site.

Build a contact sheet after each run (a script for this is not checked in; write a quick PIL grid script, or
ask the assistant to) and look at every new photo before committing. Fix or remove anything that fails
CLAUDE.md rule 7 (no flags, montages, watermarks, portraits of people) or is simply the wrong place. A trip
with no honest replacement in its Commons category gets no photo -- never a filler image.

## A credit-extraction bug already found and fixed (2026-09-28)
Commons "red link" usernames (someone whose Commons user page doesn't exist yet) show their link title as
"User:Name (page does not exist)"; the credit builder was keeping that whole string. Fixed in
`short_author()` (reads the username from the link's `href`, not its displayed title) and bulk-corrected in
79 already-saved credits. If a credit ever looks off (too long, contains stray HTML-adjacent text, contains
"upload bot"), check it against the file's real Artist/uploader fields before trusting the pipeline's output.

## Every batch, before committing
1. Run the script for N more cities.
2. `node --check day-trips.js`.
3. Parity check: citydata's day-trip `photo` fields must exactly match day-trips.js's (same script logic as
   `fetch_daytrip_photos.py`'s own asserts already enforce this per city, but re-verify after any hand fix).
4. Build a contact sheet, look at every new photo, fix or remove what fails rule 7.
5. Sync the sheet: `sheet_write.py` hardcodes its root to the file's own location (the main checkout), so a
   worktree's own NRA-MASTER.xlsx needs the sandbox trick -- copy the worktree's `citydata/` and
   `NRA-MASTER.xlsx` into a temp dir, symlink `_guidebuild` into it, run
   `_guidebuild/daytrips/sync_daytrip_photo_credits.py` there, copy the resulting xlsx back, then `git add`
   it in the worktree. (If working directly in the main checkout, this is unnecessary -- just run the sync
   script normally.)
6. `_guidebuild/check_sheet_parity.py` must read 0.
7. `git add` the touched citydata files, day-trips.js, images/daytrips, NRA-MASTER.xlsx -- claim any files
   the task board says are unclaimed first (a background run's file changes are not always auto-claimed;
   `python3 .githooks/nra_tasks.py claim <paths...>` in bulk, or grep the pre-commit's refusal list and pipe
   it through `xargs ... claim`).
8. Commit with a log: cities/trips done, what was hand-fixed and why.

## The matcher bug and fix (2026-09-30, commit 17232dfa)
Jeff pasted a Commons link for Jaipur's Abhaneri (Chand Baori) stepwell asking why it
wasn't used. Root cause, in `find_photo()`: for a trip named "Town (Landmark)",
`name_variants()` tries the town before the landmark, and the loop breaks at the
*first* Wikidata match with a valid coordinate -- so "Abhaneri" resolved to the
village's own Wikidata item (Q4667324, description "village in Rajasthan, India")
and took its P18 image (a temple in the same village), before "Chand Baori" was ever
tried. This is the same failure class as the "Ancient Olympia Municipality" mismatch
noted above, just via a different path (a real, valid-but-wrong entity beating the
right one, rather than a bad Commons file passing the filters).

Fix: a `SETTLEMENT_DESC` regex checks each Wikidata candidate's short English
description for settlement/administrative-division/historical-polity language
(village, town, city, municipality, district, county, province, former country,
kingdom, khanate, sultanate, dynasty, etc.). A match there is stashed as a fallback,
not accepted immediately; every remaining name variant is still tried for something
more specific, and the fallback is used only if nothing better ever turns up. Also
added `--retry-empty`: re-runs every city already in the state file but skips any
trip that already has a photo, so the fixed matcher can be pointed at just the empty
backlog without redoing 2,100 already-good trips.

**This fix lives only in this worktree's own `_guidebuild/daytrips/fetch_daytrip_photos.py`.**
`_guidebuild` is gitignored and, before this fix, existed only in the main checkout;
a worktree-isolated session cannot write there, so the file was recreated locally in
this worktree instead. **Someone needs to copy this worktree's version over the main
checkout's copy by hand**, or the next add-city run (which uses the main checkout's
tooling) will hit the same class of bug on a new city's day trips.

Verified before running at scale: Abhaneri now resolves correctly; Khiva (already
correctly photographed) doesn't regress -- and testing it surfaced a second instance
of the same bug class ("Khiva" alone resolving to "Khanate of Khiva", a former
country, whose own image was an unrelated portrait), caught by the same fix; Danube
Delta (via Tulcea) correctly declines rather than substituting Tulcea town's photo.

## The re-search pass (2026-09-30)
Ran `--retry-empty` (no `--limit`) across all 893 cities. 15 new candidates, all
contact-sheet reviewed:
- **Kept as-is (11):** Baden-Baden/Karlsruhe, Batumi/Kobuleti, Hamburg/Sylt, Palma de
  Mallorca/Valldemossa, Santa Cruz de Tenerife/Teide National Park, Surabaya/Trowulan,
  Sydney/Blue Mountains, Sydney/Port Stephens, Wellington/Cape Palliser,
  Zacatecas/La Quemada (Chicomostoc), plus Jaipur/Abhaneri (already hand-fixed before
  this run reached it).
- **Replaced (2):** Chennai/Vellore's candidate was a person's inauguration-ceremony
  photo; Nelspruit/Sudwala Caves' candidate was a close-up portrait of a caver's face.
  Both swapped for a verified Vellore Fort and Sudwala Caves entrance photo.
- **Rejected, left empty (4):** Algiers/El Achir (a collage; the town's only other
  Commons coverage is bird photos and a coat-of-arms SVG -- no honest replacement
  exists); Ashgabat/Anau (the same painting already flagged as a dead end above, plus
  a second candidate that's also a portrait-orientation historical illustration);
  Savonlinna/Kolovesi National Park (the *same* trail-marker file already rejected
  once -- confirms there is genuinely no qualifying photo for this park); Weno/Tonoas
  (Dublon) (a 1944 wartime bombing-run aerial photo, caught by eye -- BAD_TITLE
  doesn't catch this category; a genuinely good modern photo of the island exists but
  is portrait orientation, which the hero slot doesn't take per rule 7, so the trip
  stays without a photo).
- This pass also caught and fixed a citydata/day-trips.js parity drift from an
  interrupted earlier test run (a throwaway sandbox was deleted before its citydata
  write got copied back, leaving day-trips.js with a photo citydata never received) --
  a reminder that a sandbox must be copied back (or its state discarded entirely)
  before being deleted, never left half-applied.

Net: **2,110/3,100 trips have a photo** (was 2,099). The matcher fix itself is the
more durable win -- it's a permanent correctness improvement independent of this
pass's modest yield, and it protects every city added from here on.

## Flickr as a second photo source (2026-09-30)
Jeff had manually Google-searched a few empty trips and found real Commons/Flickr matches for
some, which prompted trying Flickr for the ones Commons genuinely has nothing for. Flickr's own
site search with the Creative Commons license filter (`license=4,5,9,10` -- CC BY, CC BY-SA, CC0,
Public Domain Mark; never include 1/2/3/6 which are NC/ND) works well for finding candidates, but
**needs the real browser, not a script**: `flickr.com/search/?text=...&license=4,5,9,10` is a
client-rendered page and a plain HTTP fetch returns an empty shell with no photo links. Once a
candidate photo's own page URL is known, though, verification IS scriptable: an individual
`flickr.com/photos/<user>/<id>/` page serves its license as a plain link in server-rendered HTML
(no JS needed), and the image itself is downloadable directly from `live.staticflickr.com` at
several suffixed sizes (`_z` ~640px, `_c` ~800px, `_b` ~1024px large; no suffix is a small
default). So the practical workflow is: browse-search with the CC filter, `find` the candidate
`/photos/.../` links, then fetch+verify+save each one exactly like a Commons candidate. This
cannot be automated into the unattended background script (no unauthenticated API, and the search
page needs a JS-executing browser), so it stays a manual/semi-automated tool for the trips
Commons has no coverage for -- used for Weno/Tonoas (Dublon) and Djibouti City/Tadjoura in this
pass. A registered Flickr API key (`flickr.photos.search`, needs a Flickr account to create) would
make this scriptable at pipeline scale if that's ever wanted; ask Jeff for one if so.

## The full backlog run and its defect classes (2026-09-30, commit e8f0d654)
Ran `--retry-empty --web-search-fallback` with no `--limit` across all 893 cities in one pass
(explained above: `--limit` restarts from the same first cities every time under `--retry-empty`,
since there's no separate "already tried with search-fallback" tracking). Found 781 new candidates
(2,130 -> 2,911 before review). Reviewed all 781 via 8 contact sheets (100 each). Confirmed:

- **A rejected photo resurfaces on every re-run.** All 11 trips hand-rejected in the two pilot
  rounds came back with the identical bad photo, because nothing remembered the rejection. Fixed
  with a permanent `REJECTED_TITLES` set (exact, normalized-title match) plus new `BAD_TITLE`
  fragments for the numbered-series cases (a charity race, a mining-museum photo series, an
  unrelated archival mission, a species-range-map series) -- a durable fix, not a one-off.
- **Content-sensitivity matches, not just wrong-place ones.** A colorised historic photo of actual
  Sachsenhausen concentration camp prisoners (matched on the trip name alone), a photo of a
  refugee family waiting for a boat from Bodrum to Kos, and a portrait of a named individual used
  as a generic community photo. All blocklisted; `BAD_TITLE` now also rejects "concentration camp"
  and "refugee family" outright. **Watch for this class specifically in any future review** -- it
  is worse than a wrong-place photo, since the trip name alone (a place with a dark history) is
  enough to surface it, and the automated checks (license/size/aspect) have no way to catch it.
- The usual defect types at volume: paintings mistaken for photos (including one pulled from the
  trip's *own* Wikidata item, e.g. Tampere/Serlachius Museums matching a painting from the
  museum's own collection), maps/diagrams, political and diplomatic photo-ops, sports team photos,
  historic photos and postcards presented as current, wrong country entirely (a Syrian postage
  stamp for Port Sudan; a Kentucky weather radar image for a Jamaican waterfall), and a couple of
  right-country-wrong-town mismatches. Full list of the 62 removed and 2 replaced trips is in the
  e8f0d654 commit body.
- Two borderline calls, kept deliberately: Dachau Memorial and Hellfire Pass Memorial Museum's
  photos show the real, current, physical memorial structure (a preserved room, a memorial
  tablet), not any historic image of victims -- judged a different and acceptable category from
  the Sachsenhausen/Bodrum removals above. Worth Jeff's own review if he wants a stricter line.
- **This review was not exhaustive per-item location verification** -- it caught everything visible
  on a contact sheet or confirmed by checking the photo's own Commons page, but a subtler
  wrong-place match on an otherwise-plausible photo could still be sitting among the ~700 kept
  ones, the same failure mode caught twice by hand in the pilot (a Bolivia lake and a China archive
  photo, both for Comoros trips, both looked fine at a glance).

## Round 2 (2026-10-01, commit 8b0d3f6b): retry-empty with the matcher fix
- Ran `--retry-empty --web-search-fallback` across the then-251-trip empty backlog with the
  settlement-fallback matcher fix in place. Got 63 new candidates (up from zero on a naive retry,
  since the matcher fix lets previously-stuck trips resolve past their settlement/country item).
- Visual review (6-column contact sheet, same as every batch this project): 10 genuinely good,
  52 bad.
- **The resurfacing bug recurs one level down.** Blocklisting the exact bad files that were found
  the first time just promotes the next-worst candidate from the same thin source pool on a later
  run. Confirmed directly this round: Port Sudan/Arous Village matched a *different* Syrian postage
  stamp; Djibouti City/Arta Beach matched another photo from the same DVIDS military series;
  Atlanta/Helen matched Mount St Helens (the Washington volcano) instead of its earlier bad match
  (a painting of Helen of Troy). This is now documented as a known, recurring limitation directly
  in the `REJECTED_TITLES` section's code comment, since it will keep happening on any future
  `--retry-empty` re-run against the hardest-to-photograph trips.
- Added 52 new entries (53 counting a missed Boston/Newport catch, found afterward via `git status`
  showing a file I hadn't put on the keep list) to `REJECTED_TITLES`, each commented with the trip
  it was rejected for.
- Kept: Belfast/Giant's Causeway & Antrim Coast, Berlin/Sachsenhausen Memorial (a memorial plaque,
  not an archival photo), Asmara/Debre Bizen Monastery, Abidjan/Divo, Bandar Seri Begawan/Miri,
  Baku/Gabala, Dubrovnik/Ston, Dubrovnik/Korčula, Bodrum/Kos, Malabo/Moka.
- Verified: `node --check day-trips.js` OK; 9 citydata files valid JSON; `check_parity_photos.py`
  893 cities, 0 mismatches; 10 new images, 0 broken (PIL verify); sheet synced via `sheet_write.py`
  (10 cells changed, matching the 10 keeps) and `check_sheet_parity.py` reads 0 differing cells in
  0 cities; final count **2,859/3,100** trips have a photo (up from 2,849).
- The patched `fetch_daytrip_photos.py` (matcher fix + full 76-entry `REJECTED_TITLES` blocklist)
  was copied to the main checkout's `_guidebuild/daytrips/` so future `add_city.py` runs and manual
  invocations benefit from both fixes.

## Left open now that this pass is complete
- 2,859/3,100 trips have a photo; 241 do not. Some are genuine coverage gaps (no Commons or
  Flickr coverage exists at all); some are simply not yet researched by hand via Flickr the way
  Weno and Tadjoura were in an earlier pass, since that's a manual, one-trip-at-a-time process.
- A further `--retry-empty` pass against the remaining 241 should be expected to surface more bad
  candidates for the hardest trips, needing the same blocklist-and-remove cycle again -- this is
  an inherent limitation of file-level blocklisting against a thin, uniformly-poor candidate pool,
  not a bug to "fix" once and for all.
- Commits on branch `daytrip-photos-pilot` (round 1 and round 2) still need merge-and-push to
  `main` when Jeff asks for it -- check `git log origin/main` first, other sessions have been
  actively merging unrelated branches the same day.
- CLAUDE.md §5.1's day-trip-photo count wants updating to 2,859/3,100 in the same commit that
  merges this pass.
- A registered Flickr API key would let the Flickr fallback run at pipeline scale instead of by
  hand, if Jeff wants to close more of the remaining 241 gaps that way.


## The 241 trips with no photo, as of 2026-10-01 (commit 8b0d3f6b)
One per line: `City | half/full | Trip name | Country`. Regenerate by decoding day-trips.js's
`NRA_DAYTRIPS` object and filtering for trips with no `photo` key.

<details>
<summary>241 trips (click to expand)</summary>

```
Abha | full | Tanomah | Saudi Arabia
Agadez | half | Azel Village | Niger
Agra | full | Chand Baori (Abhaneri) | India
Algiers | full | Ech Chettia | Algeria
Algiers | full | El Achir | Algeria
Alice Springs | full | West MacDonnell Ranges (Ormiston & Ellery) | Australia
Anshun | full | Getu River National Park | China
Anshun | half | Guanling National Geopark | China
Anshun | half | Longgong (Dragon Palace) Caves | China
Antsiranana | full | Nosy Hara Marine Park | Madagascar
Aomori | full | Lake Towada & Oirase Gorge | Japan
Ashgabat | half | Anau | Turkmenistan
Ashgabat | half | Gökdepe | Turkmenistan
Aswan | full | Wadi el-Sebua & Lake Nasser Temples | Aswan Governorate, Egypt
Atlanta | full | Helen | United States
Bahir Dar | full | Tana Kirkos Island | Ethiopia
Bamyan | full | Yakawlang (Chehelburj and Redchasht Lake) | Afghanistan
Bandar Seri Begawan | half | Labuan | Malaysia
Bangui | full | Boali Falls | Central African Republic
Baracoa | half | Playa Nibujón | Cuba
Battambang | full | Ang Trapeang Thmor Reserve | Cambodia
Batumi | half | Makhuntseti Waterfall & Machakhela National Park | Georgia
Blantyre | half | Thyolo Tea Estates | Southern Region, Malawi
Bologna | full | Brescia | Italy
Boracay | half | Nabaoy River | Philippines
Bordeaux | half | Médoc wine route | France
Boston | full | Newport | United States
Brazzaville | full | Lésio-Louna Reserve | Republic of the Congo
Cali | half | El Queremal | Colombia
Campeche | full | Edzná Archaeological Zone | Mexico
Campeche | half | Playa Bonita & Lerma | Mexico
Cape Coast | half | Assin Manso Ancestral Slave River Site | Ghana
Charlottetown | full | Nova Scotia (via Wood Islands ferry) | Canada
Chongqing | full | Laitan Ancient Town | China
Chongqing | full | Wulong Karst National Geology Park | China
Cluj-Napoca | full | Apuseni Mountains & Bear's Cave | Romania
Coimbra | full | Serra da Estrela Natural Park | Portugal
Constanța | half | Techirghiol Lake & Mud Baths | Romania
Cyangugu | half | Bugarama Hot Springs | Rwanda
Cyangugu | half | Kumbya Peninsula | Rwanda
Da Lat | half | Cau Dat Tea Hills & Coffee Farms | Lam Dong Province, Vietnam
Da Lat | half | Elephant Falls & Linh An Pagoda | Lam Dong Province, Vietnam
Dali | half | Butterfly Spring (Hudiequan) | China
Davao | full | Kapatagan / Mount Apo foothills | Philippines
Djanet | full | Bordj El Haouas | Algeria
Djanet | full | Tin Merzouga Dune | Algeria
Djanet | half | Essendilene Canyon | Algeria
Djibouti City | full | Arta Beach | Djibouti
Djibouti City | half | Décan Refuge | Djibouti
Doha | full | Khor Al Adaid (Inland Sea) | Southern Qatar
Doha | half | Al Jassasiya Rock Carvings | Northeastern coast, Qatar
Dubrovnik | half | Mljet National Park | Croatia
Durban | half | PheZulu Safari Park | South Africa
Eilat | half | Hai-Bar Yotvata Nature Reserve | Israel
El Calafate | full | Estancia Cristina and Upsala Glacier | Argentina
El Calafate | full | Estancia Nibepo Aike | Argentina
Enshi | full | Lichuan & Dashuijing Ancient Architecture Complex | China
Enshi | full | Pingshan Canyon | China
Enshi | full | Qingjiang River Cruise (Butterfly Cliff) | China
Enshi | full | Shiziguan Floating Bridge | China
Enshi | full | Yumu Village (Yumuzhai) | China
Enshi | half | Tenglong Cave | China
Erbil | full | Rawanduz Gorge & Gali Ali Beg Waterfall | Iraq
Essaouira | half | Val d'Argan / Ounagha | Morocco
Fenghuang | half | Dehang Canyon & Miao Village | China
Fenghuang | half | Furong (Hibiscus) Ancient Town | China
Fethiye | half | Xanthos & Patara Ancient Ruins | Türkiye
Fort-de-France | half | Route de la Trace & Rainforest | Martinique
Freetown | full | Bo | Sierra Leone
Funafuti | half | Funafala Islet | Tuvalu
Georgetown | half | Splashmins Resort | Guyana
Ghardaïa | half | Metlili & Sebseb Oasis | Algeria
Grenoble | half | Grande Chartreuse Monastery | France
Guilin | full | Ziyuan Hot Springs | China
Guilin | half | Gudong Waterfall | China
Hakodate | full | Noboribetsu & Toya Onsen | Japan
Halifax | half | Lawrencetown & Martinique Beach | Nova Scotia, Canada
Hamadan | half | Ekbatana Dam Lake | Iran
Harbin | full | Yabuli Ski Resort | China
Hirosaki | full | Lake Towada & Oirase Gorge | Japan
Honiara | half | Mataniko Falls | Solomon Islands
Honiara | half | Savo Island | Solomon Islands
Hua Hin | full | Pala-U Waterfall | Thailand
Huangshan | full | Huangshan (Yellow Mountain) Scenic Area | China
Huangshan | half | Wuyuan Ancient Villages | China
Huế | full | DMZ & Vinh Moc Tunnels | Vietnam
Hạ Long | full | Tra Co Beach / Mong Cai | Vietnam
Ica | full | Cañón de los Perdidos (Canyon of the Lost) | Peru
Iquitos | full | Nauta & the River Confluence | Peru
Iquitos | half | Yagua Native Community | Peru
Jaffna | half | Kayts & Karainagar | Sri Lanka
Jakarta | full | Puncak | Indonesia
Jeddah | half | Bayadah Island | Saudi Arabia
Jeju City | full | Udo Island | South Korea
Jeju City | half | Hyeopjae Beach & Hallim Park | South Korea
Jianshui | half | Swallow Cavern (Yanzi Dong) | China
Jingdezhen | half | Wuyuan Ancient Villages | China
Jingdezhen | half | Yaoli Ancient Town | China
Jinghong | half | Mandian Waterfalls | China
Kalamata | half | Mani Peninsula (Kardamyli & Stoupa) | Greece
Kanazawa | half | Noto Peninsula (Wakura) | Japan
Kano | full | Falgore Game Reserve | Nigeria
Karachi | full | Tando Allahyar | Pakistan
Karbala | full | Khaymagah (Camp of Imam Husayn) | Iraq
Karbala | half | Tell al-Zaynabiya (Zaynab's Hill) | Iraq
Kermanshah | full | Quri Qaleh Cave | Iran
Khartoum | full | Al Manāqil | Sudan
Kingstown | full | Dark View Falls | Saint Vincent and the Grenadines
Kingstown | full | Falls of Baleine | Saint Vincent and the Grenadines
Koror | full | Peleliu Battlefield | Palau
Kota Kinabalu | full | Klias Wetlands | Malaysia
Krabi | half | Klong Thom Hot Springs Waterfall | Thailand
Kuching | full | Annah Rais Longhouse | Malaysia
Kuching | half | Sarawak Cultural Village & Damai | Malaysia
Kumasi | half | Bonwire Kente Village | Ghana
Kyiv | full | Cherkasy | Ukraine
La Ceiba | full | Cuero y Salado Wildlife Refuge | Honduras
La Paz | full | Mount Illimani viewpoint | Bolivia
La Serena | full | Humboldt Penguin National Reserve | Chile
Labuan Bajo | full | Cunca Rami Waterfall | Indonesia
Lamu | full | Kiwayu Island (Kiunga Marine National Reserve) | Kenya
Leshan | full | Jiayang Steam Train | Sichuan, China
Leshan | full | Luocheng Ancient Town | Sichuan, China
London | full | Cotswolds | Gloucestershire and Oxfordshire, England
Longyearbyen | half | Templefjorden | Norway (Svalbard)
Luoyang | full | Yuntaishan Geopark | China
Lyon | half | Beaujolais wine region | France
Majuro | full | Arno Atoll | Marshall Islands
Malé | half | Huraa | Kaafu Atoll, Maldives
Mamoudzou | half | Mont Bénara | Mayotte
Manado | half | Tunan Waterfall | Indonesia
Manama | half | Tree of Life | Sakhir desert, southern Bahrain
Manaus | half | Janauari Ecological Park | Brazil
Mandalay | full | Anisakan Falls | Myanmar
Marsa Alam | half | Sheikh Malek Desert Safari | Egypt
Mataram | full | Gili Nanggu and Gili Sudak | Indonesia
Mataram | full | Pink Beach | Indonesia
Maun | full | Khwai Community Area | Botswana
Maun | full | Lake Ngami | Botswana
Maun | half | Okavango Delta (mokoro & scenic flight) | Botswana
Mbabane | half | King Sobhuza II Memorial Park | Eswatini
Mbabane | half | Mhlambanyatsi | Eswatini
Memphis | full | Oxford | United States
Mendoza | full | Puente del Inca & Cristo Redentor | Argentina
Mendoza | half | Maipú wine route | Argentina
Miami | full | Islamorada | Florida Keys, United States
Mogadishu | half | Marka | Somalia
Monaco | half | Eze | French Riviera, France
Monrovia | full | Kpatawee Waterfall | Liberia
Monrovia | half | Careysburg | Liberia
Montego Bay | half | Luminous Lagoon | Falmouth, Trelawny, Jamaica
Montego Bay | half | Mayfield Falls | Westmoreland, Jamaica
Montpellier | half | Pic Saint-Loup Valley | France
Morelia | full | Monarch Butterfly Sanctuary (El Rosario/Sierra Chincua) | Mexico
Morondava | half | Andranomena Special Reserve | Madagascar
Moroni | half | Dos du Dragon | Grande Comore, Comoros
Moroni | half | Trou du Prophète | Grande Comore, Comoros
Munich | full | Konigssee | Bavaria, Germany
Muscat | full | Wadi Shab & Bimmah Sinkhole | Ash Sharqiyah, Oman
Mytilene | half | Thermi hot springs | Greece
N'Djamena | full | Hadjer el Hamis (Elephant Rocks) | Chad
Nagasaki | full | Goto Islands | Japan
Naha | full | Cape Manzamo & the Onna Coast | Japan
Naha | half | Okinawa World & Gyokusendo Cave | Japan
Najaf | half | Babylon Ruins (Hillah) | Iraq
Nakhon Ratchasima | full | Sai Ngam Banyan Grove | Thailand
Naples | full | Paestum | Campania, Italy
Nashville | half | Franklin | United States
Nelson | full | Marlborough Wine Region (Blenheim) | New Zealand
Nelspruit | full | Panorama Route (God's Window & Blyde River Canyon) | South Africa
Nelspruit | full | Sabie & Graskop Waterfalls | South Africa
New Orleans | full | Lafayette (Cajun Country) | United States
New York | full | Hudson Valley (Cold Spring & Beacon) | Hudson Valley, New York
New York | half | Sleepy Hollow & Tarrytown | Westchester County, New York
Nuuk | half | Kobbefjord | Greenland
Oaxaca | half | Mitla & Teotitlán del Valle | Mexico
Oran | half | Sidi Bel Abbès | Algeria
Osogbo | half | Ede | Nigeria
Padang | half | Anai Valley & Padang Panjang | Indonesia
Pemba | full | Ibo Island & Fort São João Baptista | Mozambique
Pemba | full | Quirimbas Archipelago & National Park | Mozambique
Phu Quoc | half | Hon Roi | Vietnam
Phu Quoc | half | Turtle Island (Hon Doi Moi) | Vietnam
Pittsburgh | half | Kennywood Park | United States
Plettenberg Bay | half | The Crags (Monkeyland & Birds of Eden) | South Africa
Port Moresby | half | Daugo Island | Central Province, Papua New Guinea
Port Moresby | half | Owers' Corner (Kokoda Track trailhead) | Papua New Guinea
Port Sudan | half | Arous Village | Sudan
Port Sudan | half | Shaab Rumi Reef and Precontinent II | Sudan
Port of Spain | half | Lion House, Chaguanas | Trinidad and Tobago
Poznań | half | Rogalin & Kórnik | Poland
Pula | half | Motovun & Istrian hilltowns | Croatia
Punta Arenas | half | Seno Otway (Otway Sound) Penguin Colony | Chile
Roseau | half | Portsmouth, Cabrits National Park and Indian River | Dominica
Salalah | half | Prophet Job's Tomb (Nabi Ayoub) | Oman
Salalah | half | Wadi Dawkah Frankincense Park | Oman
San Juan | full | Camuy River Cave Park & Arecibo | Puerto Rico
San Juan | full | Fajardo & Bioluminescent Bay | Puerto Rico
San Pedro Sula | full | Tela | Honduras
San Salvador | full | Ruta de las Flores | Sonsonate/Ahuachapán, El Salvador
Santa Cruz de la Sierra | full | Jesuit Missions of Chiquitos (San Javier) | Bolivia
Savonlinna | half | Kolovesi National Park | Finland
Seoul | half | DMZ (Demilitarized Zone) | north of Seoul, near Paju
Seoul | half | Gangchon Rail Bike | Chuncheon, Gangwon Province
Shangri-La | full | Balagezong Grand Canyon | China
Shaoxing | full | Xinchang Great Buddha Temple | China
Skardu | half | Sarfaranga Cold Desert | Pakistan
Sokcho | half | Osaek Hot Springs | South Korea
Stanley | full | Battle of the Falklands 1914 Memorial | Falkland Islands
Strasbourg | half | Obernai & the Alsace Wine Route | France
Surat Thani | full | Cheow Lan Lake and Ratchaprapha Dam | Thailand
Surat Thani | half | Chaiya: Wat Phra Borommathat and Chaiya National Museum | Thailand
Ta'if | half | Souk Okaz | Saudi Arabia
Taichung | full | Xitou & Sun Link Sea | Taiwan
Tamanrasset | full | Tomb of Tin Hinan (Abalessa) | Algeria
Tampere | full | Serlachius Museums, Mantta | Finland
Tashkent | half | Khodjikent | Tashkent Province, Uzbekistan
Tegucigalpa | full | Comayagua | Honduras
Thimphu | full | Paro | Bhutan
Timimoun | half | Grand Erg Occidental Dunes at Tinerkouk | Algeria
Tozeur | half | Chebika, Tamerza & Mides | Tunisia
Tripoli | half | Al Ajaylat | Libya
Turpan | full | Aydingkol Lake | China
Urganch | full | Ayaz Kala & Toprak Kala | Uzbekistan
Vientiane | full | Nam Ngum Dam & Reservoir | Vientiane Province, Laos
Vientiane | half | Ban Keun (Lao National Zoo) | Vientiane Province, Laos
Visby | full | Ljugarn & the east coast | Sweden
Visby | half | Högklint Viewpoint | Sweden
Vladivostok | full | Ussuriysky Nature Reserve | Russia
Windhoek | half | Gross Barmen Hot Springs | Namibia
Yamoussoukro | half | Abokouamekro Game Reserve | Côte d'Ivoire
Yangshuo | half | Gudong Waterfall | China
Zhangye | half | Han and Ming Great Wall at Shandan | China
Zhangye | half | Mati Si (Horse Hoof Temple) | China
Zhangye | half | Shandan Military Horse Ranch | China
Zhaoqing | full | Guangning Bamboo Sea | China
Zhoushan | full | Xiangshan | China
Ziguinchor | half | Affiniam | Senegal
Ziguinchor | half | Oussouye & Diola villages | Senegal
Çeşme | half | Sığacık & Teos | Türkiye
Şanlıurfa | full | Şuayb Ancient City | Türkiye
```

</details>
