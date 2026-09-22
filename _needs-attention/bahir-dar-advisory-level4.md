# Bahir Dar: the guide shows Level 3, but the city is in a Level 4 region

Found 2026-09-22 during the day-trip research (wave 4). Not changed: citydata is being written by the
hood-picks run.

- `citydata/bahir-dar.json` `advisory` shows **Level 3, Reconsider Travel** (Ethiopia's country level).
- The US Embassy advisory of 27 Aug 2026 keeps the **Amhara Region at Level 4, "Do not travel to the Amhara
  Region for any reason"**. Bahir Dar is Amhara's capital. The UK FCDO also advises against all travel to
  Amhara (page updated 29 May 2026).
- The travel advisory row on city.html shows Level 3/4 only, so the guide does show an advisory, but at the
  wrong level for this city.

**Question for Jeff:** set Bahir Dar's advisory to Level 4 (region level), like N'Djamena, Juba, Niamey, Bangui
and Timbuktu? Same pattern as `kinshasa-advisory-missing.md`. Other cities in a Level 4 region of a lower-level
country may have the same gap; a sweep would need the regional levels, not just the country level.

**Follow-on, 2026-09-22.** The landmark-pin session proposes moving Bahir Dar's **Tana Kirkos Island** (32 km)
from landmarks to day trips (`landmarks-that-are-day-trips.md`, commit 89edbae7). That would give Bahir Dar its
first day trip, and the day-trip rules forbid an entry in an area under a Level 4 / advise-against-all-travel
warning. The day-trip research left this city empty for exactly that reason. So: the move should not be applied
for Bahir Dar while Amhara is Level 4, whatever is decided for the other 110 rows.

The wider question is yours: Bahir Dar's guide is live with 10 landmarks, including lake monasteries reached by
boat, in a region the US says not to travel to for any reason. Keep the guide as it is with a Level 4 advisory
shown, or do more than that?


**Follow-on from the pin session, 2026-09-22.** Agreed and marked: the Tana Kirkos row in
`landmarks-that-are-day-trips.md` now says HELD, do not apply, whatever is decided for the other 110.

Checking the rest of Ethiopia shows the gap is not only Bahir Dar. Every Ethiopian city on the site carries the
country level, 3:

| City | Region | Region level (US) | Advisory shown | Day trips live |
|---|---|---|---|---|
| Bahir Dar | Amhara | 4, do not travel | 3 | 0 |
| Gondar | Amhara | 4, do not travel | 3 | 1 |
| Lalibela | Amhara | 4, do not travel | 3 | 2 |
| Mek'ele | Tigray | 4, do not travel | 3 | 2 |
| Axum | Tigray | 4, do not travel | 3 | 3 |
| Harar | Harari | country level | 3 | 2 |
| Addis Ababa | Addis Ababa | country level | 3 | 2 |

So four other cities show Level 3 while sitting in a Level 4 region, and five day trips are already live in those
regions, which is the same rule the Bahir Dar move was held for. Whatever Jeff decides for Bahir Dar should be
applied to Gondar, Lalibela, Mek'ele and Axum in the same pass, and the question of a wider sweep (regional
levels, not country levels, worldwide) is his. Nothing has been changed.

**Checked independently by the day-trip session, 2026-09-22.** The five live entries are real, and all four cities
do show Level 3 in citydata:

| City | Advisory shown | Live day trips |
|---|---|---|
| Gondar | 3 | Simien Mountains National Park |
| Lalibela | 3 | Na'akuto La'ab Monastery; Yemrehanna Kristos |
| Mek'ele | 3 | Maryam Korkor and Daniel Korkor Churches; Debre Damo Monastery |
| Axum | 3 | Yeha Temple; Debre Damo Monastery; Gheralta Rock-Hewn Churches |

These came through the day-trip verification pass (batches 1-36) as `ok`, because that pass checked the country
level, not the regional one. The rule (check 4 / rule 12: nothing in a Level 4 or advise-against-all-travel area)
was applied to new entries only.

**The question for Jeff, in one line:** should the advisory shown be the *regional* level where a city sits in a
Level 4 region, and should day trips in such regions come off the site?

Three ways to go, cheapest first:
1. Ethiopia only: set the five cities to Level 4 and remove or hold the five day trips. Small, same-day.
2. Ethiopia plus a named-country sweep of the obvious cases (Mexico, Nigeria, Pakistan, Colombia, Ethiopia,
   Myanmar, Russia, Ukraine, Iran, Burkina Faso and the like), by hand from the State Department pages.
3. A full 893-city sweep against regional advisory levels. This needs a source of regional levels per country,
   which no free feed gives cleanly; it would be a research pass of its own.

My recommendation is 1 now and 2 as a scheduled follow-up, because the honesty problem is worst where a guide
shows a reassuring level for a place the US says not to enter. Nothing is changed until he says.

