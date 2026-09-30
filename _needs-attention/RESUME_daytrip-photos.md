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

## Left open now that the pass is complete
- 2,110/3,100 trips have a photo; ~990 do not and were never forced to a wrong or
  substandard match. A further re-search pass on the still-empty trips would need to
  go beyond Wikidata matching (a direct Commons category/text search per trip) since
  the matcher-level fixes are now applied and the remaining gaps are mostly genuine
  coverage gaps, not matching bugs.
- **The matcher fix needs to be copied from this worktree's `_guidebuild/daytrips/fetch_daytrip_photos.py`
  into the main checkout's copy of the same file by hand** -- see above. Until that
  happens, a new city added via `add_city.py` will not benefit from the fix.
- Commit `17232dfa` (this pass) is on branch `daytrip-photos-pilot`, on top of the
  batch 1-8 commits that were already merged (fast-forward) and pushed to `origin/main`
  earlier the same day. It still needs the same merge-and-push treatment. Check
  `git log origin/main` for the current state before assuming what's live -- another
  session was seen mid-merge of unrelated open branches around the same time.
- CLAUDE.md §5.1's day-trip-photo count is stale at 2,099/3,100 (the batch-8 figure)
  and wants updating to 2,110/3,100 in the same commit that merges this pass.
- No new quality-bug *classes* found beyond what's logged above and in this section,
  but the settlement-matcher fix shows the "wrong-but-valid Wikidata entity" failure
  mode was more common than the earlier batches' spot review alone suggested --
  future batches should keep watching for it specifically.
- A decisions.md row (2026-09-30) and the `daytrip-hero-photos` memory note are
  updated with the final counts and the matcher-fix note.

## The 990 trips with no photo, as of 2026-09-30 (commit 26b10e07)
One per line: `City | half/full | Trip name | Country`. Regenerate with:

    python3 -c "
    import json
    raw = open('day-trips.js', encoding='utf-8').read()
    raw = raw[raw.index('{'):].rstrip()
    if raw.endswith(';'): raw = raw[:-1]
    D = json.loads(raw)
    rows = [(c, k, t['name'], t.get('country', '')) for c, v in D.items()
            for k in ('half', 'full') for t in (v.get(k) or []) if not t.get('photo')]
    rows.sort()
    print(f'{len(rows)} trips with no photo')
    for r in rows: print(' | '.join(r))
    "

<details>
<summary>990 trips (click to expand)</summary>

```
Abha | full | Tanomah | Saudi Arabia
Abha | full | Wadi Lajab | Saudi Arabia
Abidjan | full | Divo | Côte d'Ivoire
Abu Dhabi | full | Liwa Oasis | Al Dhafra, Abu Dhabi Emirate, UAE
Abu Dhabi | full | Ras Al Khaimah | Ras Al Khaimah Emirate, UAE
Abu Dhabi | full | Sir Bani Yas Island | Al Dhafra, Abu Dhabi Emirate, UAE
Abuja | half | Gurara Falls | Nigeria
Abuja | half | Usuma Dam | Nigeria
Acapulco de Juarez | half | Tres Palos Lagoon | Mexico
Accra | full | Tafo | Ghana
Addis Ababa | half | Adama | Ethiopia
Adelaide | full | Victor Harbor & Fleurieu Peninsula | South Australia, Australia
Adelaide | half | Adelaide Hills & Hahndorf | South Australia, Australia
Adelaide | half | McLaren Vale | South Australia, Australia
Agadez | full | Air Mountains | Niger
Agadez | half | Azel Village | Niger
Agra | full | Chand Baori (Abhaneri) | India
Ahmedabad | full | Champaner-Pavagadh Archaeological Park | India
Ahmedabad | full | Modhera Sun Temple | India
Ahmedabad | full | Rani ki Vav, Patan | India
Aix-en-Provence | half | Camargue | France
Al Ahmadi | half | Sabah Al Ahmad Sea City (Khiran) | Kuwait
Alexandria | half | Rosetta (Rashid) | Egypt
Algiers | full | Ech Chettia | Algeria
Algiers | full | El Achir | Algeria
Algiers | half | Médéa | Algeria
Alicante | half | Calpe | Spain
Alice Springs | full | West MacDonnell Ranges (Ormiston & Ellery) | Australia
Almaty | full | Issyk Lake | Almaty Region, Kazakhstan
Amman | full | Petra | Ma'an Governorate, southern Jordan
Amritsar | half | Harike Wetland Bird Sanctuary | India
Amritsar | half | Pul Kanjari | India
Anaheim | full | Catalina Island | United States
Anchorage | half | Portage Valley | United States
Andorra la Vella | half | Engolasters Lake | Encamp parish, Andorra
Andorra la Vella | half | Vall de Sorteny Natural Park | Ordino parish, Andorra
Annecy | half | Château de Menthon | France
Anshun | full | Getu River National Park | China
Anshun | half | Doupotang Waterfall | China
Anshun | half | Guanling National Geopark | China
Anshun | half | Longgong (Dragon Palace) Caves | China
Anshun | half | Tianxingqiao Scenic Area | China
Antalya | full | Pamukkale & Hierapolis | Denizli Province, Türkiye
Antsiranana | full | Ankarana Special Reserve | Madagascar
Antsiranana | full | Nosy Hara Marine Park | Madagascar
Aomori | full | Lake Towada & Oirase Gorge | Japan
Apia | full | Lalomanu Beach | Upolu, Samoa
Apia | full | Savai'i | Samoa
Apia | half | To Sua Ocean Trench | Upolu, Samoa
Aqaba | full | Petra | Jordan
Arequipa | full | Salinas y Aguada Blanca National Reserve | Peru
Arequipa | full | Toro Muerto Petroglyphs | Peru
Arusha | full | Momella Lakes | Tanzania
Ashgabat | full | Kow Ata Underground Lake | Turkmenistan
Ashgabat | half | Anau | Turkmenistan
Ashgabat | half | Gökdepe | Turkmenistan
Asmara | full | Debre Bizen Monastery | Eritrea
Asmara | full | Keren | Eritrea
Asmara | full | Massawa | Eritrea
Astana | full | Karaganda | Kazakhstan
Asunción | full | Formosa | Argentina
Aswan | full | Kom Ombo & Edfu Temples | Aswan Governorate & Aswan, Egypt
Aswan | full | Wadi el-Sebua & Lake Nasser Temples | Aswan Governorate, Egypt
Athens | half | Cape Sounion | Attica, Greece
Atlanta | full | Helen | United States
Atlanta | full | Providence Canyon | United States
Aurangabad | full | Lonar Crater Lake | India
Aurangabad | half | Ajanta Caves | India
Aurangabad | half | Paithan | India
Axum | full | Debre Damo Monastery | Ethiopia
Axum | full | Gheralta Rock-Hewn Churches | Ethiopia
Axum | half | Yeha Temple | Ethiopia
Baguio | half | Asin Hot Springs | Philippines
Baguio | half | La Trinidad Strawberry Farm | Philippines
Bahir Dar | full | Debre Tabor | Ethiopia
Bahir Dar | full | Tana Kirkos Island | Ethiopia
Baku | full | Gabala | Gabala District, Azerbaijan
Baku | half | Ateshgah Fire Temple | Absheron Peninsula, Azerbaijan
Baku | half | Gobustan National Park | Garadagh, Azerbaijan
Baku | half | Yanar Dag | Absheron Peninsula, Azerbaijan
Bamako | half | Siby | Mali
Bamberg | half | Vierzehnheiligen Basilica | Germany
Bamyan | full | Band-e-Amir Lakes | Afghanistan
Bamyan | full | Yakawlang (Chehelburj and Redchasht Lake) | Afghanistan
Banda Aceh | full | Gunung Seulawah Agam | Indonesia
Banda Aceh | full | Sabang / Pulau Weh | Indonesia
Bandar Seri Begawan | full | Miri | Malaysia
Bandar Seri Begawan | half | Labuan | Malaysia
Bandar Seri Begawan | half | Lawas | Malaysia
Bandung | full | Ciwidey & Kawah Putih | Indonesia
Banff | full | Columbia Icefield & Athabasca Glacier | Canada
Bangkok | full | Damnoen Saduak Floating Market | Ratchaburi Province, Thailand
Bangkok | full | Khao Yai National Park | Nakhon Ratchasima Province, Thailand
Bangkok | full | Maeklong Railway Market | Samut Songkhram Province, Thailand
Bangkok | full | Pattaya | Chonburi Province, Thailand
Bangui | full | Boali Falls | Central African Republic
Bangui | full | Mbaïki | Central African Republic
Banyuwangi | full | Pulau Merah (Red Island) | Indonesia
Banyuwangi | full | Sukamade Turtle Beach | Indonesia
Baracoa | half | Boca de Yumurí | Cuba
Baracoa | half | Playa Nibujón | Cuba
Barcelona | half | Penedès Wine Region | Catalonia, Spain
Bariloche | full | Bosque de Arrayanes | Argentina
Bariloche | full | Cerro Tronador | Argentina
Battambang | full | Ang Trapeang Thmor Reserve | Cambodia
Batumi | half | Makhuntseti Waterfall & Machakhela National Park | Georgia
Beijing | full | Mutianyu Great Wall | Huairou District, near Beijing
Beijing | half | Tianjin | Northern China, near Beijing
Belfast | full | Giant's Causeway & Antrim Coast | County Antrim, Northern Ireland
Belfast | half | Mount Stewart & Strangford Lough | County Down, Northern Ireland
Bengaluru | full | Shivanasamudra Falls | India
Bengaluru | half | Bannerghatta National Park | India
Bengaluru | half | Ramanagara | India
Beppu | half | Yufuin | Japan
Berlin | half | Sachsenhausen Memorial | Oranienburg, Brandenburg, Germany
Bissau | full | Saltinho | Guinea-Bissau
Blantyre | full | Mount Mulanje | Southern Region, Malawi
Blantyre | half | Thyolo Tea Estates | Southern Region, Malawi
Bodrum | half | Kos | Greece
Bogotá | full | Chingaza National Park | Cundinamarca, Colombia
Bogotá | half | Chicaque Natural Park | Cundinamarca, Colombia
Bogotá | half | La Chorrera Waterfall | Choachí, Cundinamarca, Colombia
Bogotá | half | Nemocón Salt Mine | Cundinamarca, Colombia
Bogotá | half | Zipaquirá Salt Cathedral | Cundinamarca, Colombia
Bologna | full | Brescia | Italy
Bonn | full | Rhine Gorge (Middle Rhine Valley) | Germany
Bonn | half | Königswinter & Drachenfels | Germany
Boracay | full | Hacienda Maria | Philippines
Boracay | half | Nabaoy River | Philippines
Bordeaux | half | Arcachon Bay & Dune du Pilat | France
Bordeaux | half | Médoc wine route | France
Boston | full | Cape Cod (Provincetown) | United States
Boston | full | Newport | United States
Boston | half | Concord and Lexington | United States
Boston | half | Plymouth | United States
Brasília | full | Chapada dos Veadeiros | Brazil
Brazzaville | full | Lésio-Louna Reserve | Republic of the Congo
Brașov | half | Râșnov Fortress | Romania
Bridgetown | half | Bathsheba | Barbados
Brno | half | Macocha Abyss and Punkva Caves | Czechia
Budapest | full | Lake Balaton | Transdanubia, Hungary
Bukhara | half | Bahauddin Naqshband Memorial Complex | Uzbekistan
Bukhara | half | Chor-Bakr Necropolis | Uzbekistan
Bulawayo | half | Khami Ruins | Zimbabwe
Busan | half | Daegu | South Korea
Busan | half | Geoje Island | South Gyeongsang Province, South Korea
Cadiz | half | Vejer de la Frontera | Spain
Cagliari | full | Chia | Italy
Cagliari | half | Nora | Italy
Cairns | full | Cape Tribulation | Australia
Cairns | half | Atherton Tablelands | Australia
Calabar | full | Ibeno Beach | Nigeria
Cali | full | San Cipriano Natural Reserve | Colombia
Cali | half | El Queremal | Colombia
Campeche | full | Edzná Archaeological Zone | Mexico
Campeche | full | Isla Aguada & Laguna de Términos | Mexico
Campeche | half | Playa Bonita & Lerma | Mexico
Cancún | full | Tulum | Quintana Roo, Mexico
Cancún | full | Valladolid | Yucatán, Mexico
Cape Coast | full | Kakum National Park Canopy Walkway | Ghana
Cape Coast | half | Anomabo | Ghana
Cape Coast | half | Assin Manso Ancestral Slave River Site | Ghana
Cape Town | full | Hermanus | Overberg, South Africa
Caracas | full | Valencia | Venezuela
Cartagena | half | Islas del Rosario | Colombia
Cartagena | half | La Boquilla | Colombia
Cartagena | half | Playa Blanca (Barú) | Colombia
Cayenne | half | Cacao | French Guiana
Cebu City | full | Moalboal & Pescador Island | Philippines
Charleston | full | Beaufort | United States
Charleston | half | Edisto Island | United States
Charleston | half | Middleton Place | United States
Charlottetown | full | Nova Scotia (via Wood Islands ferry) | Canada
Charlottetown | half | Basin Head Beach | Canada
Charlottetown | half | Green Gables Heritage Place (Cavendish) | Canada
Chefchaouen | full | Ceuta | Spain
Chengdu | full | Xiling Snow Mountain | China
Chengdu | half | Huanglongxi Ancient Town | China
Chennai | full | Kanchipuram | India
Chetumal | half | Cenote Azul | Mexico
Chiang Mai | full | Mae Kampong Village | Thailand
Chiang Mai | half | Bo Sang | Thailand
Chiang Rai | half | Golden Triangle at Sop Ruak | Thailand
Chiang Rai | half | Mae Salong | Thailand
Chios | half | Nea Moni Monastery | Greece
Chongqing | full | Dazu Rock Carvings | China
Chongqing | full | Laitan Ancient Town | China
Chongqing | full | Wulong Karst National Geology Park | China
Chongqing | full | Zhongshan Ancient Town | China
Chongqing | half | Jinyun Mountain | China
Cienfuegos | half | El Nicho waterfalls | Cuba
Cluj-Napoca | full | Apuseni Mountains & Bear's Cave | Romania
Coimbra | full | Serra da Estrela Natural Park | Portugal
Cologne | full | Rhine Gorge (Middle Rhine Valley) | Germany
Cologne | half | Königswinter & Drachenfels | Germany
Conakry | full | Kindia | Guinea
Constanța | full | Danube Delta (via Tulcea) | Romania
Constanța | half | Techirghiol Lake & Mud Baths | Romania
Corfu | full | Sidari & Canal d'Amour | Greece
Cork | full | Killarney and Ring of Kerry | Ireland
Cortina d'Ampezzo | half | Lake Dobbiaco | Italy
Cox's Bazar | full | Bandarban Hill District | Bangladesh
Cuenca | half | San Bartolomé | Ecuador
Cusco | full | Humantay Lake | Peru
Cyangugu | full | Lake Kivu Shoreline | Rwanda
Cyangugu | half | Bugarama Hot Springs | Rwanda
Cyangugu | half | Kumbya Peninsula | Rwanda
Da Lat | full | Pongour Falls | Lam Dong Province, Vietnam
Da Lat | half | Cau Dat Tea Hills & Coffee Farms | Lam Dong Province, Vietnam
Da Lat | half | Elephant Falls & Linh An Pagoda | Lam Dong Province, Vietnam
Da Nang | full | Hue Imperial City | Vietnam
Da Nang | full | My Son Sanctuary | Vietnam
Da Nang | half | Ba Na Hills & Golden Bridge | Vietnam
Dahab | full | Coloured Canyon | Egypt
Dahab | full | Ras Mohammed National Park | Egypt
Dakar | half | Bandia Reserve | Petite Côte, Senegal
Dakar | half | M'bour | Petite Côte, Senegal
Dali | full | Cangshan Mountain | China
Dali | full | Shaxi Ancient Town | China
Dali | full | Weishan Ancient Town | China
Dali | half | Butterfly Spring (Hudiequan) | China
Dali | half | Xizhou Ancient Town | China
Dali | half | Zhoucheng Village | China
Damascus | full | Irbid | Jordan
Darwin | full | Litchfield National Park | Australia
Datong | full | Mount Hengshan (Northern Heng) | China
Datong | full | Yanmen Pass | China
Davao | full | Kapatagan / Mount Apo foothills | Philippines
Davao | half | Samal Island (IGaCoS) | Philippines
Delhi | half | Sultanpur Bird Sanctuary | Haryana, India
Denizli | half | Salda Lake | Türkiye
Denpasar | half | Nusa Penida | Klungkung, Bali, Indonesia
Denver | half | Georgetown | United States
Djanet | full | Bordj El Haouas | Algeria
Djanet | full | Tadrart Rouge | Algeria
Djanet | full | Tassili n'Ajjer National Park | Algeria
Djanet | full | Tin Merzouga Dune | Algeria
Djanet | half | Essendilene Canyon | Algeria
Djanet | half | Tikoubaouine | Algeria
Djibouti City | full | Arta Beach | Djibouti
Djibouti City | full | Lake Assal | Djibouti
Djibouti City | full | Tadjoura | Djibouti
Djibouti City | half | Décan Refuge | Djibouti
Doha | full | Khor Al Adaid (Inland Sea) | Southern Qatar
Doha | half | Al Jassasiya Rock Carvings | Northeastern coast, Qatar
Doha | half | Al Jumail Fishing Village | Northwestern Qatar
Doha | half | Al Zubarah Fort | Northwestern Qatar
Doha | half | Zekreet & Ras Abrouq | Western Qatar
Dubai | full | Hatta | Hajar Mountains, Dubai Emirate, UAE
Dubai | full | Ras Al Khaimah | Ras Al Khaimah Emirate, UAE
Dublin | half | Boyne Valley & Newgrange | County Meath, Ireland
Dublin | half | Glendalough & Wicklow Mountains | County Wicklow, Ireland
Dubrovnik | full | Korčula | Croatia
Dubrovnik | half | Mljet National Park | Croatia
Dubrovnik | half | Ston | Croatia
Durban | full | Drakensberg Mountains | South Africa
Durban | full | Hluhluwe-iMfolozi Game Reserve | South Africa
Durban | half | PheZulu Safari Park | South Africa
Durban | half | Valley of a Thousand Hills | South Africa
Durrës | half | Apollonia Archaeological Park | Albania
Dushanbe | full | Iskanderkul | Sughd, Tajikistan
Dushanbe | full | Kulob | Tajikistan
Dushanbe | half | Hisor Fortress | Tajikistan
Dushanbe | half | Varzob Gorge | Tajikistan
Düsseldorf | half | Xanten Archaeological Park | Germany
Eilat | full | Petra | Jordan
Eilat | half | Hai-Bar Yotvata Nature Reserve | Israel
El Calafate | full | Estancia Cristina and Upsala Glacier | Argentina
El Calafate | full | Estancia Nibepo Aike | Argentina
El Calafate | full | La Leona Petrified Forest | Argentina
El Calafate | full | Perito Moreno Glacier (Los Glaciares National Park) | Argentina
El Chaltén | half | Lago Viedma & Viedma Glacier | Argentina
El Nido | half | Duli Beach | Philippines
Encarnación | full | Jesuit Mission of San Cosme y Damián | Paraguay
Encarnación | half | Jesuit Mission of Jesús de Tavarangue | Paraguay
Encarnación | half | Santa Ana Jesuit Ruins | Argentina
Enshi | full | Lichuan & Dashuijing Ancient Architecture Complex | China
Enshi | full | Pingshan Canyon | China
Enshi | full | Qingjiang River Cruise (Butterfly Cliff) | China
Enshi | full | Shennong Stream | China
Enshi | full | Shiziguan Floating Bridge | China
Enshi | full | Yumu Village (Yumuzhai) | China
Enshi | half | Suobuya Stone Forest | China
Enshi | half | Tenglong Cave | China
Erbil | full | Korek Mountain Resort | Iraq
Erbil | full | Rawanduz Gorge & Gali Ali Beg Waterfall | Iraq
Erfurt | half | Eisenach & Wartburg Castle | Germany
Essaouira | half | Val d'Argan / Ounagha | Morocco
Faro | full | Sagres & Cape St. Vincent | Portugal
Fenghuang | half | Dehang Canyon & Miao Village | China
Fenghuang | half | Furong (Hibiscus) Ancient Town | China
Fethiye | half | Dalyan & Kaunos Rock Tombs | Türkiye
Fethiye | half | Xanthos & Patara Ancient Ruins | Türkiye
Flores | full | Ceibal Archaeological Site | Guatemala
Fort-de-France | half | Route de la Trace & Rainforest | Martinique
Fort-de-France | half | Saint-Pierre & Mount Pelée | Martinique
Fortaleza | full | Lagoinha Beach | Brazil
Fortaleza | full | Morro Branco & Beberibe Cliffs | Brazil
Frankfurt am Main | half | Rüdesheim & the Rhine Valley | Rhine Gorge, Germany
Freetown | full | Bo | Sierra Leone
Fukuoka | full | Yufuin | Oita Prefecture, Kyushu, Japan
Funafuti | half | Funafala Islet | Tuvalu
Fès | half | Volubilis & Meknes | Morocco
Gaborone | half | Manyana Rock Paintings | Botswana
Gaborone | half | Otse | Botswana
Galle | full | Sinharaja Rainforest | Sri Lanka
Galle | full | Udawalawe safari | Sri Lanka
Galle | half | Koggala & Stilt Fishermen | Sri Lanka
Garmisch-Partenkirchen | half | Neuschwanstein & Hohenschwangau Castles | Germany
Gaziantep | full | Göbekli Tepe | Türkiye
Geneva | half | Montreux & Château de Chillon | Switzerland
Genoa | full | Portovenere & La Spezia | Italy
Genoa | half | Portofino & Santa Margherita Ligure | Italy
Georgetown | half | Splashmins Resort | Guyana
Ghardaïa | half | Metlili & Sebseb Oasis | Algeria
Gilgit | half | Jaglot Three Mountain Ranges Junction | Pakistan
Gilgit | half | Rakaposhi Viewpoint | Pakistan
Girona | half | Banyoles | Spain
Girona | half | Besalú | Spain
Gisenyi | half | Mount Nyiragongo Views | Rwanda
Glasgow | half | Loch Lomond & The Trossachs National Park | United Kingdom
Goma | full | Virunga National Park | DR Congo
Granada | full | Nerja & Frigiliana | Spain
Granada | full | The Alpujarras | Spain
Grenoble | half | Chamrousse | France
Grenoble | half | Grande Chartreuse Monastery | France
Guadalajara | half | Lake Chapala / Ajijic | Mexico
Guangzhou | full | Danxia Mountain | Shaoguan, Guangdong, China
Guatemala City | full | Lake Atitlán | Sololá, Western Highlands, Guatemala
Guayaquil | full | Puerto El Morro | Ecuador
Guilin | full | Li River Cruise (Lijiang) | China
Guilin | full | Longji Rice Terraces (Longsheng, Dragon's Backbone) | China
Guilin | full | Rongshui Miao Autonomous County | China
Guilin | full | Ziyuan Hot Springs | China
Guilin | half | Gudong Waterfall | China
Guilin | half | Xingping Ancient Town | China
Gyeongju | full | Andong Hahoe Folk Village | South Korea
Göreme | full | Ihlara Valley | Turkey
Haifa | half | Akko (Acre) | Israel
Haifa | half | Zichron Ya'akov | Israel
Hakodate | full | Noboribetsu & Toya Onsen | Japan
Hakodate | half | Mount Esan | Japan
Halifax | full | Annapolis Valley & Bay of Fundy | Nova Scotia, Canada
Halifax | half | Lawrencetown & Martinique Beach | Nova Scotia, Canada
Halifax | half | Peggy's Cove | Nova Scotia, Canada
Hamadan | half | Ekbatana Dam Lake | Iran
Hangzhou | half | Moganshan | China
Hanoi | half | Bat Trang Pottery Village | Gia Lam, Hanoi, Vietnam
Hanoi | half | Duong Lam Ancient Village | Son Tay, Hanoi, Vietnam
Harar | half | Babille Elephant Sanctuary | Ethiopia
Harare | full | Chinhoyi Caves National Park | Zimbabwe
Harbin | full | Yabuli Ski Resort | China
Havana | full | Viñales Valley | Pinar del Río, Cuba
Havana | half | Playas del Este | Havana Province, Cuba
Heraklion | half | Phaistos & Matala | Crete, Greece
Heraklion | half | Spinalonga & Agios Nikolaos | Crete, Greece
Hirosaki | full | Lake Towada & Oirase Gorge | Japan
Hirosaki | half | Goshogawara | Japan
Ho Chi Minh City | full | Mekong Delta | My Tho, Tien Giang, Vietnam
Ho Chi Minh City | half | Củ Chi Tunnels | Vietnam
Hobart | full | Freycinet & Wineglass Bay | Australia
Hobart | half | Richmond | Australia
Honiara | half | Bonegi Beach | Solomon Islands
Honiara | half | Mataniko Falls | Solomon Islands
Honiara | half | Savo Island | Solomon Islands
Honolulu | half | Kailua & Lanikai Beach | Windward Oahu, Hawaii
Honolulu | half | North Shore (Haleiwa) | North Shore, Oahu, Hawaii
Houston | full | Blue Bell Creameries (Brenham) | United States
Houston | half | Sam Houston National Forest | United States
Hua Hin | full | Pala-U Waterfall | Thailand
Hua Hin | half | Phetchaburi | Thailand
Hua Hin | half | Wildlife Friends Foundation Thailand | Thailand
Hualien City | full | Chishang | Taiwan
Hualien City | full | Sanxiantai | Taiwan
Huangshan | full | Huangshan (Yellow Mountain) Scenic Area | China
Huangshan | half | Wuyuan Ancient Villages | China
Huế | full | DMZ & Vinh Moc Tunnels | Vietnam
Hyderabad | full | Nagarjuna Sagar Dam & Nagarjunakonda | India
Hạ Long | full | Cat Ba Island & Lan Ha Bay | Vietnam
Hạ Long | full | Tra Co Beach / Mong Cai | Vietnam
Hạ Long | half | Yen Tu Mountain | Vietnam
Ibadan | full | Ado Awaye Suspended Lake | Nigeria
Ibadan | full | Erin Ijesha (Olumirin) Waterfalls | Nigeria
Ica | full | Cañón de los Perdidos (Canyon of the Lost) | Peru
Ica | full | Chincha (El Carmen) | Peru
Ica | full | Nazca Lines | Peru
Ica | full | Paracas National Reserve and Ballestas Islands | Peru
Inverness | full | Speyside Whisky Distilleries | United Kingdom
Iquitos | full | Nauta & the River Confluence | Peru
Iquitos | half | Monkey Island (Isla de los Monos) | Peru
Iquitos | half | Yagua Native Community | Peru
Irkutsk | half | Lake Baikal and Listvyanka | Russia
Irkutsk | half | Taltsy Museum of Wooden Architecture | Russia
Isfahan | full | Varzaneh | Iran
Istanbul | full | Princes' Islands (Büyükada) | Sea of Marmara, Türkiye
Jaffna | half | Elephant Pass & Kilinochchi | Sri Lanka
Jaffna | half | Kayts & Karainagar | Sri Lanka
Jaffna | half | Nainativu (Nagadeepa) | Sri Lanka
Jaipur | full | Ranthambore National Park | India
Jakarta | full | Puncak | Indonesia
Jasper | full | Columbia Icefield and Athabasca Glacier | Canada
Jasper | half | Mount Robson Provincial Park | Canada
Jeddah | half | Bayadah Island | Saudi Arabia
Jeju City | full | Udo Island | South Korea
Jeju City | half | Hyeopjae Beach & Hallim Park | South Korea
Jeju City | half | Manjanggul Cave | South Korea
Jeju City | half | Seogwipo & waterfalls | South Korea
Jeonju | half | Maisan Provincial Park | South Korea
Jerez de la Frontera | half | Vejer de la Frontera | Spain
Jianshui | half | Swallow Cavern (Yanzi Dong) | China
Jingdezhen | half | Wuyuan Ancient Villages | China
Jingdezhen | half | Yaoli Ancient Town | China
Jinghong | half | Jinuo Ethnic Village | China
Jinghong | half | Mandian Waterfalls | China
Jodhpur | full | Ranakpur Jain Temple | India
Jodhpur | half | Bishnoi Villages | India
Jodhpur | half | Osian Temples | India
Johannesburg | half | Cradle of Humankind & Sterkfontein Caves | South Africa
Johor Bahru | half | Gunung Pulai Recreational Forest | Kulai, Johor, Malaysia
Johor Bahru | half | Tanjung Piai National Park | Pontian, Johor, Malaysia
João Pessoa | half | Praia de Tambaba (Conde) | Brazil
João Pessoa | half | Praia do Coqueirinho (Conde) | Brazil
Juba | full | Mundari Cattle Camps (Terekeka) | South Sudan
Kabul | full | Gardez | Afghanistan
Kagoshima | full | Ibusuki Sand Bath (Saraku) | Japan
Kagoshima | full | Yakushima Island | Japan
Kaifeng | full | Longmen Grottoes | China
Kaifeng | full | Shaolin Temple, Dengfeng | China
Kalamata | full | Voidokilia Beach & Pylos | Greece
Kalamata | half | Mani Peninsula (Kardamyli & Stoupa) | Greece
Kampala | full | Ngamba Island | Uganda
Kampala | half | Mabamba Swamp | Uganda
Kanazawa | full | Eiheiji Temple | Japan
Kanazawa | half | Kaga Onsen | Japan
Kanazawa | half | Natadera Temple | Japan
Kanazawa | half | Noto Peninsula (Wakura) | Japan
Kanchanaburi | full | Erawan National Park | Thailand
Kanchanaburi | full | Hellfire Pass Memorial Museum | Thailand
Kanchanaburi | half | Prasat Muang Sing Historical Park | Thailand
Kangding | full | Tagong Grassland and Tagong Monastery | China
Kano | full | Falgore Game Reserve | Nigeria
Kano | full | Katsina | Nigeria
Kano | full | Tiga Dam | Nigeria
Karachi | full | Tando Adam | Pakistan
Karachi | full | Tando Allahyar | Pakistan
Karakol | full | Barskoon Gorge | Kyrgyzstan
Karbala | full | Khaymagah (Camp of Imam Husayn) | Iraq
Karbala | full | Lake Razzaza (Milh Lake) | Iraq
Karbala | half | Hillah / Babylon | Iraq
Karbala | half | Tell al-Zaynabiya (Zaynab's Hill) | Iraq
Kashan | full | Abyaneh Village | Iran
Kashgar | full | Karakul Lake | China
Kashgar | half | Yengisar | China
Kayseri | half | Soğanlı Valley | Türkiye
Kayseri | half | Sultan Marshes | Türkiye
Kazan | half | Raifa Monastery | Russia
Kaş | half | Saklıkent Gorge | Türkiye
Kelowna | half | Vernon | Canada
Kerman | full | Kaluts of Shahdad (Lut Desert) | Iran
Kerman | full | Meymand Village | Iran
Kerman | full | Rayen Citadel | Iran
Kermanshah | full | Anahita Temple, Kangavar | Iran
Kermanshah | full | Quri Qaleh Cave | Iran
Kermanshah | half | Sarab-e Niloufar | Iran
Khartoum | full | Al Manāqil | Sudan
Khartoum | full | Wad Medani | Sudan
Kigali | full | Akagera National Park | Rwanda
Kingstown | full | Dark View Falls | Saint Vincent and the Grenadines
Kingstown | full | Falls of Baleine | Saint Vincent and the Grenadines
Kingstown | half | Vermont Nature Trail | Saint Vincent and the Grenadines
Knysna | half | Tsitsikamma National Park | South Africa
Knysna | half | Wilderness | South Africa
Kolkata | full | Shantiniketan | India
Konya | half | Beyşehir Lake | Türkiye
Konya | half | Sultanhanı Caravanserai | Türkiye
Koror | full | Peleliu Battlefield | Palau
Kota Kinabalu | full | Klias Wetlands | Malaysia
Kota Kinabalu | half | Mari Mari Cultural Village | Malaysia
Krabi | half | Ao Thalane Mangrove Kayaking | Thailand
Krabi | half | Klong Thom Hot Springs Waterfall | Thailand
Kraków | full | Morskie Oko, Tatra National Park | Lesser Poland, Poland
Kuching | full | Annah Rais Longhouse | Malaysia
Kuching | half | Sarawak Cultural Village & Damai | Malaysia
Kumamoto | full | Takachiho Gorge | Japan
Kumasi | half | Bonwire Kente Village | Ghana
Kunming | full | Dongchuan Red Land | China
Kunming | half | Jiuxiang Cave | China
Kuşadası | half | Şirince Village | Türkiye
Kyiv | full | Cherkasy | Ukraine
Kyiv | full | Zhytomyr | Ukraine
La Ceiba | full | Cuero y Salado Wildlife Refuge | Honduras
La Ceiba | half | Playa La Ensenada | Honduras
La Ceiba | half | Sambo Creek | Honduras
La Paz | full | Mount Illimani viewpoint | Bolivia
La Romana | full | Isla Saona | Dominican Republic
La Romana | half | Cueva de las Maravillas | Dominican Republic
La Serena | full | Humboldt Penguin National Reserve | Chile
La Serena | full | Mamalluca Observatory | Chile
La Serena | half | Elqui Valley | Chile
Labuan Bajo | full | Cunca Rami Waterfall | Indonesia
Labuan Bajo | half | Melo Village | Indonesia
Lagos | full | Oyo | Nigeria
Lahore | half | Changa Manga Forest | Pakistan
Lalibela | half | Na'akuto La'ab Monastery | Ethiopia
Lamu | full | Kiwayu Island (Kiunga Marine National Reserve) | Kenya
Las Palmas de Gran Canaria | half | Roque Nublo & Tejeda | Spain
Las Vegas | full | Grand Canyon West Rim | Arizona, USA
Las Vegas | half | Red Rock Canyon | Nevada, USA
Lausanne | half | Lavaux Vineyard Terraces | Switzerland
Legaspi | half | Hoyop-Hoyopan Cave | Philippines
Leshan | full | Jiayang Steam Train | Sichuan, China
Leshan | full | Luocheng Ancient Town | Sichuan, China
Leshan | half | Jiajiang Thousand Buddha Cliff | Sichuan, China
Leticia | full | Lago Tarapoto | Colombia
León | half | Las Peñitas Beach | Nicaragua
León | half | León Viejo Ruins | Nicaragua
Lhasa | full | Yamdrok Lake (Yamdrok Yumtso) | China
Lijiang | half | Lashihai Wetland | China
Lijiang | half | Yuhu Village & Joseph Rock's Residence | China
Lilongwe | full | Dedza | Malawi
Lilongwe | full | Salima | Malawi
Lisbon | full | Évora | Alentejo, Portugal
London | full | Cotswolds | Gloucestershire and Oxfordshire, England
Longyearbyen | half | Templefjorden | Norway (Svalbard)
Luoyang | full | Yuntaishan Geopark | China
Luxor | full | Abydos & Dendera | Sohag & Qena Governorates, Egypt
Luxor | full | Edfu & Kom Ombo Temples | Aswan Governorate, Egypt
Lviv | half | Pidhirtsi Castle | Ukraine
Lyon | half | Beaujolais wine region | France
Maceió | half | Barra de São Miguel | Brazil
Majuro | full | Arno Atoll | Marshall Islands
Majuro | half | Laura Beach | Marshall Islands
Makassar | half | Bantimurung Waterfall & Butterfly Park | Indonesia
Malabo | full | Moka | Bioko Island, Equatorial Guinea
Malabo | full | Ureka | Bioko Island, Equatorial Guinea
Malacca | half | Pulau Besar | Malaysia
Malang | half | Balekambang Beach | Indonesia
Malindi | half | Arabuko Sokoke Forest | Kenya
Malé | half | Gulhi | Kaafu Atoll, Maldives
Malé | half | Huraa | Kaafu Atoll, Maldives
Malé | half | Thulusdhoo | Kaafu Atoll, Maldives
Mamoudzou | half | Mont Bénara | Mayotte
Manado | full | Tangkoko Nature Reserve | Indonesia
Manado | full | Tomohon & Lake Linow | Indonesia
Manado | half | Tunan Waterfall | Indonesia
Manama | half | Al Areen Wildlife Park | Sakhir, southern Bahrain
Manama | half | Tree of Life | Sakhir desert, southern Bahrain
Manaus | half | Janauari Ecological Park | Brazil
Mandalay | full | Anisakan Falls | Myanmar
Manila | full | Taal Heritage Town | Batangas, Philippines
Manzanillo | full | Colima & Volcan de Colima | Mexico
Manzhouli | half | Hulunbuir Grassland | China
Maputo | full | Inhaca Island | Maputo Bay, Mozambique
Maputo | half | Macaneta | Maputo Province, Mozambique
Maputo | half | Maputo National Park | Maputo Province, Mozambique
Mar del Plata | half | Miramar | Argentina
Mariehamn | half | Bomarsund Fortress ruins | Åland (Finland)
Marsa Alam | full | Wadi el Gemal National Park | Egypt
Marsa Alam | half | Sheikh Malek Desert Safari | Egypt
Maseru | full | Maletsunyane Falls | Lesotho
Maseru | half | Katse Dam | Lesotho
Mashhad | half | Torghabeh | Iran
Mataram | full | Gili Nanggu and Gili Sudak | Indonesia
Mataram | full | Pink Beach | Indonesia
Matsuyama | half | Imabari & Shimanami Kaido | Japan
Maun | full | Khwai Community Area | Botswana
Maun | full | Lake Ngami | Botswana
Maun | full | Makgadikgadi & Nxai Pans | Botswana
Maun | half | Okavango Delta (mokoro & scenic flight) | Botswana
Mazatlán | full | Concordia | Mexico
Mbabane | half | King Sobhuza II Memorial Park | Eswatini
Mbabane | half | Malkerns Valley | Eswatini
Mbabane | half | Mhlambanyatsi | Eswatini
Mecca | full | Al Shafa | Taif highlands, Saudi Arabia
Mecca | half | Al Hada Mountain | near Taif, Saudi Arabia
Medan | full | Lake Toba (Danau Toba) | Indonesia
Medan | full | Sipiso-piso Waterfall | Indonesia
Medina | full | Wadi Al-Far'a | Al Madinah Province, Saudi Arabia
Mek'ele | full | Debre Damo Monastery | Ethiopia
Mek'ele | half | Abreha we Atsbeha Church | Ethiopia
Mek'ele | half | Wukro Cherkos | Ethiopia
Melbourne | full | Ballarat | West of Melbourne, Victoria, Australia
Memphis | full | Oxford | United States
Mendoza | full | Puente del Inca & Cristo Redentor | Argentina
Mendoza | full | Uco Valley | Argentina
Mendoza | half | Cacheuta hot springs | Argentina
Mendoza | half | Maipú wine route | Argentina
Mexico City | full | Tula | Hidalgo state
Mexico City | half | Tepoztlán | Morelos state
Miami | full | Islamorada | Florida Keys, United States
Minsk | full | Blue Lakes | Minsk Region, Belarus
Minsk | half | Dudutki Open-Air Museum | Minsk Region, Belarus
Minsk | half | Khatyn Memorial | Minsk Region, Belarus
Minsk | half | Sula History Park | Minsk Region, Belarus
Mogadishu | half | Marka | Somalia
Monaco | half | Eze | French Riviera, France
Monastir | half | Kuriat Islands | Tunisia
Monrovia | full | Kpatawee Waterfall | Liberia
Monrovia | full | Marshall | Liberia
Monrovia | half | Careysburg | Liberia
Montego Bay | full | Blue Hole | Ocho Rios, Jamaica
Montego Bay | full | Negril Seven Mile Beach | Westmoreland, Jamaica
Montego Bay | half | Luminous Lagoon | Falmouth, Trelawny, Jamaica
Montego Bay | half | Mayfield Falls | Westmoreland, Jamaica
Monterrey | half | Huasteca Canyon | Mexico
Monterrey | half | Santiago | Mexico
Montevideo | full | Colonia del Sacramento | Uruguay
Montevideo | full | Piriápolis | Uruguay
Montevideo | full | Punta del Este | Uruguay
Montevideo | half | Establecimiento Juanicó | Canelones, Uruguay
Montpellier | half | Pic Saint-Loup Valley | France
Montreal | full | Eastern Townships | Quebec, Canada
Montreal | full | Omega Park | Montebello, Quebec
Morelia | full | Angahuan and Paricutín Volcano | Mexico
Morelia | full | Monarch Butterfly Sanctuary (El Rosario/Sierra Chincua) | Mexico
Morondava | full | Kirindy Forest Reserve | Madagascar
Morondava | half | Andranomena Special Reserve | Madagascar
Moroni | half | Dos du Dragon | Grande Comore, Comoros
Moroni | half | Lac Salé (Salt Lake) | Comoros
Moroni | half | Trou du Prophète | Grande Comore, Comoros
Mostar | half | Kravice Waterfalls | Bosnia and Herzegovina
Mumbai | half | Alibaug | India
Munich | full | Konigssee | Bavaria, Germany
Munich | full | Zugspitze | Bavaria, Germany
Munich | half | Dachau Memorial | Upper Bavaria, Germany
Muscat | full | Wadi Shab & Bimmah Sinkhole | Ash Sharqiyah, Oman
Muscat | full | Wahiba Sands | Ash Sharqiyah, Oman
Muscat | half | Daymaniyat Islands | Al Batinah, Oman
Mykonos | half | Rhenia Island | Greece
Mysore | full | Bandipur National Park | India
Mysore | full | Belur and Halebidu | India
Mysore | half | Ranganathittu Bird Sanctuary | India
Mytilene | half | Thermi hot springs | Greece
Mérida | half | Celestún Biosphere Reserve | Mexico
Mérida | half | Cuzama Cenotes | Mexico
Mérida | half | Progreso | Mexico
Mérida | half | Uxmal | Mexico
N'Djamena | full | Douguia | Chad
N'Djamena | full | Hadjer el Hamis (Elephant Rocks) | Chad
Nagano | half | Hakuba Valley | Japan
Nagasaki | full | Goto Islands | Japan
Nagoya | full | Magome & Tsumago | Japan
Naha | full | Cape Manzamo & the Onna Coast | Japan
Naha | full | Churaumi Aquarium & Motobu | Japan
Naha | half | Okinawa World & Gyokusendo Cave | Japan
Naha | half | Senagajima Island | Japan
Najaf | half | Babylon Ruins (Hillah) | Iraq
Nakhon Ratchasima | full | Khao Yai National Park | Thailand
Nakhon Ratchasima | full | Sai Ngam Banyan Grove | Thailand
Naples | full | Paestum | Campania, Italy
Nashville | half | Franklin | United States
Nashville | half | Leiper's Fork | United States
Nassau | full | Exuma Cays (Pig Beach) | Exuma, Bahamas
Natal | half | Pipa | Brazil
Nelson | full | Golden Bay and Farewell Spit | New Zealand
Nelson | full | Marlborough Wine Region (Blenheim) | New Zealand
Nelspruit | full | Panorama Route (God's Window & Blyde River Canyon) | South Africa
Nelspruit | full | Sabie & Graskop Waterfalls | South Africa
New Orleans | full | Lafayette (Cajun Country) | United States
New Orleans | half | Honey Island Swamp | United States
New York | full | Hudson Valley (Cold Spring & Beacon) | Hudson Valley, New York
New York | full | The Hamptons | eastern Long Island, New York
New York | half | Sleepy Hollow & Tarrytown | Westchester County, New York
Nha Trang | half | Ba Ho Waterfalls | Vietnam
Nha Trang | half | Doc Let Beach | Vietnam
Niagara Falls | half | Niagara Falls, USA | United States
Niamey | half | Kouré giraffe zone | Niger
Nice | half | Eze | French Riviera, France
Nouméa | half | Îlot Maître | New Caledonia
Novi Sad | half | Bač | Serbia
Nuku'alofa | full | 'Eua Island | Tonga
Nuku'alofa | half | Fafá Island | Tonga
Nuku'alofa | half | Pangaimotu Island | Tonga
Nuuk | half | Kobbefjord | Greenland
Nîmes | full | Camargue & Aigues-Mortes | France
Oaxaca | half | Mitla & Teotitlán del Valle | Mexico
Ohrid | full | Bitola & Heraclea Lyncestis | North Macedonia
Ohrid | full | Galičica National Park & Lake Prespa | North Macedonia
Oran | half | Sidi Bel Abbès | Algeria
Orlando | half | Kennedy Space Center Visitor Complex | United States
Osogbo | half | Ede | Nigeria
Ottawa | full | Kingston | Canada
Ouagadougou | half | Ziniaré | Burkina Faso
Ouarzazate | full | Dades Gorge | Morocco
Ouarzazate | full | Todra Gorge | Morocco
Padang | full | Harau Valley | Indonesia
Padang | half | Anai Valley & Padang Panjang | Indonesia
Pai | full | Mae Hong Son | Thailand
Panama City | half | Embera Village | Chagres National Park, Panama
Panglao | full | Danao Adventure Park | Philippines
Panglao | half | Loboc River | Philippines
Paphos | full | Akamas Peninsula & Blue Lagoon | Cyprus
Paramaribo | full | Saint-Laurent-du-Maroni | French Guiana
Paris | full | Loire Valley Châteaux | Centre-Val de Loire, France
Pattaya-Chonburi | full | Koh Si Chang | Chonburi Province, Thailand
Pemba | full | Ibo Island & Fort São João Baptista | Mozambique
Pemba | full | Montepuez | Mozambique
Pemba | full | Quirimbas Archipelago & National Park | Mozambique
Pemba | half | Murrébuè Beach | Mozambique
Phnom Penh | half | Koh Dach | Cambodia
Phoenix | half | Apache Trail | United States
Phu Quoc | half | Hon Mong Tay | Vietnam
Phu Quoc | half | Hon Roi | Vietnam
Phu Quoc | half | Turtle Island (Hon Doi Moi) | Vietnam
Phuket | full | Similan Islands | off Khao Lak, Andaman Sea
Phuket | half | Coral Island (Koh Hae) | off southern Phuket
Phuket | half | Khai Islands | off eastern Phuket
Phuket | half | Phang Nga Bay & James Bond Island | Phang Nga Province
Pittsburgh | full | Fallingwater | United States
Pittsburgh | half | Kennywood Park | United States
Playa del Carmen | full | Coba | Mexico
Playa del Carmen | full | Valladolid | Mexico
Playa del Carmen | half | Cenote Dos Ojos | Mexico
Playa del Carmen | half | Tulum | Mexico
Plettenberg Bay | half | Storms River Mouth | South Africa
Plettenberg Bay | half | The Crags (Monkeyland & Birds of Eden) | South Africa
Plettenberg Bay | half | Wilderness | South Africa
Pokhara | full | Australian Camp | Nepal
Ponce | full | Río Camuy Cave Park | Puerto Rico
Port Elizabeth | full | Storms River & Tsitsikamma | South Africa
Port Elizabeth | half | Addo Elephant National Park | South Africa
Port Elizabeth | half | Schotia Private Game Reserve | South Africa
Port Moresby | full | Crystal Rapids | Central Province, Papua New Guinea
Port Moresby | half | Daugo Island | Central Province, Papua New Guinea
Port Moresby | half | Owers' Corner (Kokoda Track trailhead) | Papua New Guinea
Port Sudan | full | Erkowit | Sudan
Port Sudan | full | Sanganeb Marine National Park | Sudan
Port Sudan | half | Arous Village | Sudan
Port Sudan | half | Shaab Rumi Reef and Precontinent II | Sudan
Port Vila | half | Eton Beach | Vanuatu
Port Vila | half | Havannah Harbour | Vanuatu
Port of Spain | half | Lion House, Chaguanas | Trinidad and Tobago
Port of Spain | half | San Fernando | Trinidad and Tobago
Portland | full | Cannon Beach | United States
Portland | half | Hood River | United States
Porto | full | Douro Valley | Northern Portugal
Porto | half | Aveiro | Centro, Portugal
Porto | half | Braga | Northern Portugal
Potosí | half | Laguna de Kari Kari | Bolivia
Poznań | half | Rogalin & Kórnik | Poland
Prague | full | Bohemian Switzerland | North Bohemia, Czechia
Prague | half | Karlštejn Castle | Central Bohemia, Czechia
Praia | half | Igreja de Nossa Senhora do Rosário | Cabo Verde
Pucón | half | Lican Ray | Chile
Puducherry | full | Kanchipuram | India
Puerto Madryn | full | Islote Lobos | Argentina
Puerto Madryn | half | Gaiman | Argentina
Puerto Natales | full | Balmaceda & Serrano Glaciers | Chile
Puerto Plata | full | Cayo Arena | Dominican Republic
Pula | half | Motovun & Istrian hilltowns | Croatia
Puno | full | Amantaní Island | Peru
Puno | full | Juli | Peru
Puno | full | Pucará | Peru
Puno | half | Chucuito | Peru
Punta Arenas | full | San Gregorio | Chile
Punta Arenas | half | Seno Otway (Otway Sound) Penguin Colony | Chile
Punta Cana | full | Los Haitises National Park | Samaná Bay, Dominican Republic
Punta Cana | half | Basílica Nuestra Señora de la Altagracia | Dominican Republic
Pyongyang | half | Sunch’ŏn | North Korea
Qom | full | Namak Lake (Daryacheh-ye Namak) | Iran
Quetzaltenango | full | Lake Atitlán | Guatemala
Quito | full | Santo Domingo de los Colorados | Ecuador
Recife | half | Itamaracá Island | Brazil
Reno | full | Genoa & Carson Valley | United States
Reykjavík | full | Geysir Geothermal Area | Golden Circle, Iceland
Reykjavík | full | Gullfoss Waterfall | Golden Circle, Iceland
Reykjavík | full | Reynisfjara Black Sand Beach | South Coast, Iceland
Reykjavík | full | Seljalandsfoss Waterfall | South Coast, Iceland
Rhodes | half | Valley of the Butterflies | Rhodes island, Greece
Riyadh | full | Edge of the World | Jebel Fihrayn, Riyadh Province, Saudi Arabia
Riyadh | full | Ushaiger Heritage Village | Riyadh Province, Saudi Arabia
Riyadh | half | Al Kharj | Riyadh Province, Saudi Arabia
Riyadh | half | Red Sand Dunes | Riyadh Province, Saudi Arabia
Road Town | half | The Baths, Virgin Gorda | British Virgin Islands
Roseau | half | Portsmouth, Cabrits National Park and Indian River | Dominica
Saint John's | half | Shirley Heights Lookout | Antigua and Barbuda
Salalah | full | Hasik | Oman
Salalah | full | Rakhyut | Oman
Salalah | half | Mughsail Beach and Al Marneef Cave | Oman
Salalah | half | Prophet Job's Tomb (Nabi Ayoub) | Oman
Salalah | half | Taqah Castle | Oman
Salalah | half | Wadi Dawkah Frankincense Park | Oman
Salt Lake City | full | Spiral Jetty | United States
Samarkand | full | Shakhrisabz | Uzbekistan
San Antonio | full | Fredericksburg & Texas Hill Country | United States
San Antonio | half | New Braunfels & Gruene | United States
San Cristóbal de las Casas | full | El Chiflón | Mexico
San Diego | half | Julian | United States
San José | full | Tortuga Island | Gulf of Nicoya, Costa Rica
San Juan | full | Camuy River Cave Park & Arecibo | Puerto Rico
San Juan | full | Fajardo & Bioluminescent Bay | Puerto Rico
San Juan | half | Bacardí Distillery (Casa Bacardí) | Puerto Rico
San Pedro Sula | full | Tela | Honduras
San Pedro Sula | half | Fortaleza de San Fernando de Omoa | Honduras
San Pedro Sula | half | Lago de Yojoa | Honduras
San Pedro de Atacama | full | Calama and Chuquicamata | Chile
San Pedro de Atacama | full | El Tatio Geysers | Chile
San Pedro de Atacama | full | Lagunas Escondidas de Baltinache | Chile
San Pedro de Atacama | full | Lagunas Miscanti y Miñiques | Chile
San Pedro de Atacama | full | Piedras Rojas & Salar de Aguas Calientes | Chile
San Pedro de Atacama | full | Valle del Arcoíris (Rainbow Valley) | Chile
San Pedro de Atacama | half | Laguna Cejar | Chile
San Salvador | full | Ruta de las Flores | Sonsonate/Ahuachapán, El Salvador
San Salvador | half | El Boquerón National Park | San Salvador Department, El Salvador
San Salvador | half | Playa El Tunco | La Libertad, El Salvador
Sana'a | full | Al Ḩudaydah | Yemen
Sana'a | half | Dhamār | Yemen
Santa Cruz de Tenerife | full | Masca | Spain
Santa Cruz de la Sierra | full | Buena Vista | Bolivia
Santa Cruz de la Sierra | full | El Fuerte de Samaipata | Bolivia
Santa Cruz de la Sierra | full | Jesuit Missions of Chiquitos (San Javier) | Bolivia
Santa Cruz de la Sierra | full | Parque Nacional Amboró | Bolivia
Santa Cruz de la Sierra | full | Refugio Los Volcanes | Bolivia
Santa Marta | full | Palomino | Colombia
Santander | half | Cuevas de Altamira | Spain
Santiago | half | Casablanca Valley | Valparaíso Region, Chile
Santiago | half | Maipo Valley | Central Valley, near Santiago, Chile
Santiago de Cuba | full | El Saltón | Cuba
Santiago de Cuba | half | Baconao Park | Cuba
Santiago de Cuba | half | Chivirico | Cuba
Santo Domingo | full | Altos de Chavón | Dominican Republic
Santo Domingo | full | Bayahíbe & Saona Island | Dominican Republic
Sanya | half | Nanshan Guanyin (Nanshan Cultural Tourism Zone) | China
Sapporo | full | Biei & Furano | Central Hokkaido, Japan
Savonlinna | half | Kolovesi National Park | Finland
Scottsdale | full | Apache Trail | United States
Selçuk | full | Pamukkale | Türkiye
Selçuk | full | Priene, Miletus, and Didyma | Türkiye
Seoul | half | DMZ (Demilitarized Zone) | north of Seoul, near Paju
Seoul | half | Gangchon Rail Bike | Chuncheon, Gangwon Province
Seoul | half | Suwon Hwaseong Fortress | Suwon, Gyeonggi Province
Shangri-La | full | Balagezong Grand Canyon | China
Shaoxing | full | Xinchang Great Buddha Temple | China
Sharm El Sheikh | full | Colored Canyon | Egypt
Sharm El Sheikh | full | Mount Sinai (Jebel Musa) | Egypt
Sharm El Sheikh | full | St. Catherine's Monastery | Egypt
Sibiu | full | Râșnov Fortress | Romania
Siem Reap | half | Tonlé Sap Lake | Cambodia
Sihanoukville | full | Kep | Cambodia
Sihanoukville | half | Koh Ta Kiev | Cambodia
Singapore | half | St John's and Lazarus Islands | Southern Islands, Singapore
Skardu | full | Basho Valley | Pakistan
Skardu | full | Khaplu Palace | Pakistan
Skardu | full | Kharmang Valley | Pakistan
Skardu | half | Sarfaranga Cold Desert | Pakistan
Sochi | full | Lake Ritsa | Abkhazia
Sokcho | half | Goseong Unification Observatory | South Korea
Sokcho | half | Hwajinpo | South Korea
Sokcho | half | Osaek Hot Springs | South Korea
Srimangal | full | Bichanakandi | Bangladesh
Srimangal | full | Madhabkunda Waterfall | Bangladesh
St. George's | half | Belmont Estate | Grenada
St. George's | half | Concord Falls | Grenada
St. George's | half | Grand Etang National Park | Grenada
Stanley | full | Battle of the Falklands 1914 Memorial | Falkland Islands
Stavanger | half | Flor og Fjære | Norway
Strasbourg | half | Obernai & the Alsace Wine Route | France
Sucre | full | Maragua Crater | Bolivia
Sucre | half | Chataquila | Bolivia
Surakarta | full | Candi Sukuh & Cetho | Indonesia
Surakarta | half | Sangiran Early Man Site | Indonesia
Surat Thani | full | Cheow Lan Lake and Ratchaprapha Dam | Thailand
Surat Thani | full | Khao Sok National Park | Thailand
Surat Thani | full | Nakhon Si Thammarat | Thailand
Surat Thani | half | Chaiya: Wat Phra Borommathat and Chaiya National Museum | Thailand
Suzhou | half | Wuxi | China
Sydney | full | Hunter Valley | North of Sydney, NSW
Sydney | full | Southern Highlands | Southwest of Sydney, NSW
Sylhet | full | Bisnakandi | Bangladesh
Sylhet | half | Bichanakandi | Bangladesh
São Tomé | full | Praia Jalé | São Tomé and Príncipe
São Tomé | half | Cascata São Nicolau | São Tomé and Príncipe
São Tomé | half | Roça Agostinho Neto | São Tomé and Príncipe
São Tomé | half | Roça Monte Café | São Tomé and Príncipe
Ta'if | half | As-Sail Al-Kabir | Saudi Arabia
Ta'if | half | Souk Okaz | Saudi Arabia
Tabriz | full | St. Stepanos Monastery | Iran
Taichung | full | Xitou & Sun Link Sea | Taiwan
Tainan | half | Wushantou Reservoir | Taiwan
Takamatsu | half | Tokushima | Japan
Tamanrasset | full | Afilal Gueltas | Algeria
Tamanrasset | full | Ahaggar National Park | Algeria
Tamanrasset | full | Assekrem Plateau | Algeria
Tamanrasset | full | Silet | Algeria
Tamanrasset | full | Tomb of Tin Hinan (Abalessa) | Algeria
Tamanrasset | half | Tit Village | Algeria
Tampere | full | Serlachius Museums, Mantta | Finland
Tangier | full | Tarifa, Spain | Spain
Taormina | half | Alcantara Gorges | Italy
Tarawa | full | Maiana Atoll | Kiribati
Tarragona | half | Royal Abbey of Poblet | Spain
Tashkent | half | Charvak Reservoir | Tian Shan foothills, Uzbekistan
Tashkent | half | Chimgan Mountains | Ugam-Chatkal National Park, Uzbekistan
Tashkent | half | Khodjikent | Tashkent Province, Uzbekistan
Tbilisi | full | Kakheti Wine Region | Kakheti, eastern Georgia
Tbilisi | half | Gori | Shida Kartli, Georgia
Tegucigalpa | full | Comayagua | Honduras
Tel Aviv | full | Akko (Acre) | Israel
Tel Aviv | full | Dead Sea | Israel
Tel Aviv | full | Masada | Israel
Tel Aviv | half | Zichron Ya'akov | Israel
The Hague | full | Keukenhof & the bulb fields | Netherlands
The Valley | half | Prickly Pear Cays | Anguilla
Thessaloniki | half | Halkidiki | Central Macedonia, Greece
Thessaloniki | half | Pella | Central Macedonia, Greece
Thimphu | full | Paro | Bhutan
Thiruvananthapuram | half | Poovar Island | India
Timimoun | half | Grand Erg Occidental Dunes at Tinerkouk | Algeria
Tirupati | full | Talakona Waterfall | India
Tokyo | full | Mount Fuji & Lake Kawaguchiko | Yamanashi Prefecture, Japan
Toronto | full | Algonquin Provincial Park | Nipissing District, Ontario
Toulon | half | Bandol | France
Tozeur | half | Chebika, Tamerza & Mides | Tunisia
Tozeur | half | Mos Espa | Tunisia
Trabzon | full | Zigana & Gümüşhane | Turkey
Tripoli | half | Al Ajaylat | Libya
Tromso | full | Senja Island | Norway
Tromso | half | Sommaroy | Norway
Turku | full | Turku Archipelago Trail | Finland
Turku | half | Naantali & Moominworld | Finland
Turpan | full | Aydingkol Lake | China
Turpan | full | Tianchi (Heavenly Lake) | China
Udaipur | full | Ranakpur | India
Udaipur | half | Eklingji Temple | India
Udaipur | half | Nathdwara | India
Ulaanbaatar | full | Khustain Nuruu National Park | Mongolia
Ulaanbaatar | half | Genghis Khan Statue Complex (Chinggis Khaan Statue) | Mongolia
Ulm | half | Legoland Germany | Germany
Urganch | full | Ayaz Kala & Toprak Kala | Uzbekistan
Urganch | full | Nukus & the Savitsky Museum | Uzbekistan
Valencia | full | Albarracín | Aragón, Spain
Valencia | half | Albufera Natural Park | Valencian Community, Spain
Valencia | half | Xàtiva | Valencian Community, Spain
Valletta | half | Comino Blue Lagoon | Comino, Maltese Islands
Valletta | half | Hagar Qim & Mnajdra Temples | Qrendi, southern Malta
Valparaíso | half | Casablanca Valley | Chile
Valparaíso | half | Isla Negra | Chile
Vancouver | full | Victoria | British Columbia, Canada
Varanasi | full | Prayagraj (Allahabad) | India
Varanasi | half | Jaunpur | India
Venice | half | Vicenza | Veneto, Italy
Verona | half | Vicenza | Veneto, Italy
Victoria | full | La Digue Island | Seychelles
Victoria Falls | full | Hwange National Park | Zimbabwe
Vienna | half | Wachau Valley | Lower Austria, Austria
Vientiane | full | Nam Ngum Dam & Reservoir | Vientiane Province, Laos
Vientiane | half | Ban Keun (Lao National Zoo) | Vientiane Province, Laos
Vientiane | half | Nong Khai | Isan, Thailand
Vigan | half | Pinsal Falls | Philippines
Visby | full | Ljugarn & the east coast | Sweden
Visby | half | Högklint Viewpoint | Sweden
Visby | half | Lummelunda Caves | Sweden
Visby | half | Tofta Beach | Sweden
Viña del Mar | half | Casablanca Valley | Chile
Viña del Mar | half | Isla Negra | Chile
Vladivostok | full | Ussuriysky Nature Reserve | Russia
Weno | half | Tonoas (Dublon) | Chuuk, Federated States of Micronesia
Windermere | half | Hill Top, Near Sawrey | United Kingdom
Windhoek | half | Gross Barmen Hot Springs | Namibia
Windhoek | half | Okapuka Ranch | Namibia
Wrocław | full | Karpacz & the Karkonosze Mountains | Poland
Wrocław | full | Kłodzko Valley | Poland
Xiamen | full | Fujian Tulou (Yongding/Nanjing) | China
Xiamen | half | Zhangzhou | China
Yamoussoukro | half | Abokouamekro Game Reserve | Côte d'Ivoire
Yamoussoukro | half | Kossou Dam & Lake Kossou | Côte d'Ivoire
Yangon | half | Bago | Myanmar
Yangshuo | full | Longji Rice Terraces (Longsheng) | China
Yangshuo | half | Gudong Waterfall | China
Yogyakarta | half | Goa Pindul | Indonesia
Yogyakarta | half | Kalibiru | Indonesia
Yogyakarta | half | Kaliurang | Indonesia
Zhangjiajie | full | Furong (Hibiscus) Town | China
Zhangjiajie | full | Mengdong River | China
Zhangye | half | Binggou Danxia | China
Zhangye | half | Han and Ming Great Wall at Shandan | China
Zhangye | half | Mati Si (Horse Hoof Temple) | China
Zhangye | half | Shandan Military Horse Ranch | China
Zhaoqing | full | Guangning Bamboo Sea | China
Zhoushan | full | Dongji Islands | China
Zhoushan | full | Xiangshan | China
Zhuhai | full | Yangjiang | China
Zhuhai | half | Dong'ao Island | China
Ziguinchor | half | Affiniam | Senegal
Ziguinchor | half | Carabane Island | Senegal
Ziguinchor | half | Oussouye & Diola villages | Senegal
Zurich | full | Mount Titlis | Central Switzerland
Århus | half | Ebeltoft | Denmark
Çeşme | half | Sığacık & Teos | Türkiye
Şanlıurfa | full | Şuayb Ancient City | Türkiye
```

</details>
