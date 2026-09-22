# Hood points: 10 of batch 1's 120 were wrong, fixed 2026-09-22; a few still need your call

*Found during the batch-1 re-pick: every hood-fit miss the audit found traced back to a neighborhood point that was
not in that neighborhood. Points were checked by reverse-geocoding with OpenStreetMap (`_guidebuild/hoodpicks/hoodpoint_check.py`,
now a required pre-flight before each batch). Fixed points are in citydata and the sheet (Hood N Latitude/Longitude);
their picks were re-fetched from Google (53 calls) and re-picked.*

## Fixed (old point → new point, source)

| City | Hood | Old point was in | New point | Source |
|---|---|---|---|---|
| Milan | Porta Nuova | Brera edge | 45.4838, 9.1902 | Piazza Gae Aulenti, the district the description names |
| Osaka | Tennoji | Uehonmachi, 1.5 km north | 34.6465, 135.5133 | Tennoji station / Abeno Harukas (description) |
| Kuala Lumpur | KLCC | Chinatown / Medan Pasar | 3.1579, 101.7116 | Petronas Towers (hood landmark) |
| Hong Kong | Causeway Bay | Tin Hau | 22.2802, 114.1840 | Hennessy Road / SOGO shopping core (description) |
| Istanbul | Kadıköy | Feneryolu, 3 km east | 40.9913, 29.0246 | OpenStreetMap Kadıköy centre |
| Istanbul | Beşiktaş | Ulus, 3 km north | 41.0428, 29.0075 | OpenStreetMap Beşiktaş centre |
| Bangkok | Sukhumvit | Phra Khanong, 4 km down the road | 13.7375, 100.5615 | Asok BTS interchange (description: the strip along the BTS) |
| Dubai | Deira | Abu Hail | 25.2728, 55.3053 | OpenStreetMap Deira, souk side (landmark: Gold Souk) |
| Medina | Quba | Al Gharra, 5 km away | 24.4392, 39.6172 | Quba Mosque (hood landmark) |
| Rome | Prati (Vaticano) | inside Vatican City | 41.9081, 12.4645 | OpenStreetMap Prati quarter (Piazza Cavour) |

## Your call (left as they are)

- **Medina, Al Aqeeq** (24.4721, 39.6093): the point is in Bada'ah, 0.7 km north-west of the Prophet's Mosque; the description says a modern western district "farther from the Haram". OpenStreetMap's Al Aqeeq is 5.7 km south-west. Which is the hood you mean?
- **Medina, Al-Anbariyah** (24.4616, 39.6017): OpenStreetMap calls the spot As Suqya; it is beside the Hejaz station, which matches the description. Kept.
- **Mecca, Al Shubaikah** (21.4169, 39.8199): OpenStreetMap calls it Jarham. The picks around it kept landing in Ajyad and the Clock Tower, which the description itself mentions. Kept; say if you want it moved west.
- **Antalya, Konyaaltı** and **Lara**: points are on the beach strips (Meltem, Güzeloba), 3-4 km from OpenStreetMap's district centres. Kept as beach-strip hoods.

## For the remaining batches
Run `python3 _guidebuild/hoodpicks/hoodpoint_check.py <25 slugs>` before `fetch_rank.py fetch`, fix any suspect point
against the hood description and landmark, and only then spend Google calls. Expect roughly 1 in 12 points to need a fix.
