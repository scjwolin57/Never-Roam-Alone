# Resume note: Beaches score v2 (started 2026-09-24)

Jeff chose option A (research the nearest real swimming beach for every city) and added "more beaches score higher".
Definition, scale and pipeline: `_guidebuild/beaches/BEACH_NOTES.md`, section v2. Decision rows: decisions.md 2026-09-24.

## Rules (fixed at the start)
- Batches of 25 cities, alphabetical (`_guidebuild/beaches/v2/batches/b01..b36.json`), 893 cities.
- Per batch: research agent (`v2/RESEARCH_BRIEF.md`) → `v2/out/bNN.json`; independent checker (`v2/CHECK_BRIEF.md`) →
  `v2/out/bNN_check.json`; `python3 _guidebuild/beaches/v2/load_beaches.py tab v2/out/bNN_check.json` → the sheet's
  **Beaches** tab; commit the sheet per batch.
- A beach counts only if named, public, swimming not banned, sourced; estuaries and tidal rivers are lake/river.
  Unverifiable: left out, never guessed. At most 3 web searches per agent per batch (shared session cap).
- The Live Cities **Beaches Score / Basis** columns and `city-scores.js` do not change until all 36 batches are in;
  then `load_beaches.py score`, write the column through SheetEdit, `sync_city_scores.py --write`, one commit.
- Candidates: `_guidebuild/beaches/nearest.py` (Wikidata beaches + OSRM drive times; Overpass was down 2026-09-24).

## Pace
About 5 research agents at a time; each finished batch gets its checker at once and the next batch starts.

## Batch log
| Batch | Cities | Researched | Checked | In tab | Commit |
|---|---|---|---|---|---|
| b01-b36 | all | started 2026-09-24 (Jeff: "run on all 36 batches") | | | |
| b01 | Aachen to Amsterdam | yes | 18 confirmed, 7 corrected | yes | see git log |
| b02 | Anaheim to Aurangabad | yes | 18 confirmed, 7 corrected | yes | see git log |
| b05 | Bonn to Bursa | yes | 15 confirmed, 10 corrected (Bratislava Rusovce and Bujumbura Saga Plage removed: map-only; sources added for Bonn, Bordeaux, Boston, Budapest, Bursa; Busan +1 min); Bucharest stays unsure | yes | see git log |
| b06 | Cabo Frio to Chamonix | yes | 20 confirmed, 5 corrected (Cali river bathing confirmed by 2026 local press, unsure -> medium; Calgary Sikome note; Cambridge and Cap-Haitien wrong OSM sources removed; Carcassonne +1 min); nothing removed | yes | see git log |
| b04 | Basseterre to Bologna | yes | 17 confirmed, 8 corrected (Batumi +Sarpi, sources; Beihai +Qiaogang; Belfast checked on the 2026 NI bathing-water list, Groomsport out of the 30 min window; Bergen +Sandviken sjøbad; Berlin sources fixed, +Lübars, +Grünau; drive-time fixes Belgrade, Bentota). Beirut kept but unsure: 2025 CNRS advice against swimming at Ramlet al-Baida (advice, not a ban) | yes | see git log |
| b07 | Charleston to Colmar | yes | 23 confirmed, 2 corrected (Charlottetown nearer sea beach Tea Hill Park 14 min, Brackley moves to more; Chisinau Vadul lui Voda confirmed by City Hall page 31 Jul 2026, unsure -> medium). Chennai Marina and Chiang Rai Kok River stay excluded | yes | see git log |
| b03 | Austin to Basel | yes | 21 confirmed, 4 corrected (Barranquilla Puerto Mocho is open Caribbean, not estuary: nearest sea 18 min, 5 sea beaches; Bari + Lido San Francesco; Avignon Lac du Deves sourcing fixed via Lapalud town hall; Banff +2 min). Baku kept as lake pending Jeff's Caspian call | yes | see git log |
| b08 | Colombo to Darwin | yes | 20 confirmed, 5 corrected (Constanta + Plaja Trei Papuci, source fixed; Cotonou stays none: July 2024 swimming ban not lifted; Dali note: unsourced ban claim removed, still none; Dallas + Lynn Creek Park; Darwin Mindil kept with jellyfish/croc note, + Casuarina) | yes | see git log |
| b14 | Irkutsk to Kaifeng | yes | 20 confirmed, 5 corrected (Istanbul + Caddebostan, Suadiye from the official 2026 swim list; Jakarta Pantai Carnaval removed, Ancol names Lagoon as the swimming beach; Jeju + Gwakji; Johor Bahru nearer Sembawang Park 20 min across the Causeway, NEA-rated, border queue noted, cross-border pending Jeff; Joao Pessoa + Manaira, Bessa) | yes | see git log |
| b13 | Himeji to Ica | yes | 23 confirmed, 2 corrected (Hong Kong Ting Kau removed: LCSD lifeguards suspended, Lido Beach added; Iquitos second source). Honiara rests on dated reviews only; Ha Long centre point sits in the bay (flagged) | yes | see git log |
| b11 | Fes to Gothenburg | yes | 20 confirmed, 5 corrected (Gothenburg + Fiskebäcksbadet, EU-monitored; Garmisch + Eibsee from the district bathing-lakes list, 3 drive times fixed; drive-time fixes Gdansk, Galle, Geneva). Goma cross-border beach pending Jeff | yes | see git log |
| b12 | Guadalajara to Hebron | yes | 20 confirmed, 5 corrected (Gyeongju nearer Songdo Beach 30 min, reopened 2025: band up; Haifa duplicate merged, Kiryat Yam and Atlit removed as undeclared, + HaShaket, Dado, Zamir; Hamilton source fixed; Helsinki + Lauttasaari, Munkkiniemi from the city list; Halifax Rainbow Haven kept with the Sep 2026 construction-closure note). Hamburg Scharbeutz 59 min counts | yes | see git log |
| b15 | Kairouan to Kermanshah | yes | 23 confirmed, 2 corrected (Kaohsiung Sizihwan removed: the Marine Bureau bans swimming there, nearest now Cijin 25 min; Karakol point moved to the mapped City Beach, 21 min) | yes | see git log |
| b09 | Datong to Durham | yes | 16 confirmed, 9 corrected (Douala Ngeme removed, OSM-only: now none, unsure; Dubai La Mer removed, + Dubai Islands, Al Sufouh; Dresden Waldbad Langebrueck is a pool, removed; Dunedin Boulder Beach closed all summer for penguins; Dublin Sandymount confirmed by the EPA 2025 rating; source and drive-time fixes Edinburgh, Denver, Denpasar; Davao unchanged, unsure) | yes | see git log |
| b16 | Khartoum to Kunming | yes | 22 confirmed, 3 corrected (Koror Long Island Park removed: a park, Wikivoyage says no beaches on Koror, now none by road; Kumamoto Akase removed, not on the 2025 opening or water-survey lists: nearest now Hiai 46 min, + Nishime, Shirogahama, Otachimisaki; Krakow Kryspinow official source added) | yes | see git log |
