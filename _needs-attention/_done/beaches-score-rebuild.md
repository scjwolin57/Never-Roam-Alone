# Beaches score: why it is wrong, and how to rebuild it (decide)

*2026-09-24. Jeff: "the beaches scores are almost certainly inaccurate. Philadelphia has no beaches at all." He is
right. Nothing has been changed. The score feeds the finder's "Beaches & Relaxation" chip (choose.html) and
compare.html, through `city-scores.js`. This file replaces `beaches-under-mapped.md` (moved to _done).*

## Why Philadelphia gets 23

The score is computed from OpenStreetMap counts (`_guidebuild/beaches/`, BEACH_NOTES.md). For Philadelphia:

- **3 "beaches" within 15 km.** OpenStreetMap has three unnamed patches of river sand on the Delaware, tagged
  `natural=beach` (way 583781007, way 1486794863 and way 1486802777). Nobody would call them beaches.
- **The formula also treats the river as sea.** OpenStreetMap draws the sea's coastline up tidal rivers and
  estuaries, so the "coastline within 20 km" test passes (19 coastline ways), and the city gets full sea credit.

## The same faults elsewhere (sample)

| City | Score | What is really there |
|---|---|---|
| Bremen | 74 | River Weser; the North Sea coast is about 60 km away |
| Bordeaux | 66 | Gironde estuary; the Atlantic beaches are about 50 km away |
| Buenos Aires | 49 | Río de la Plata; not a swimming beach city |
| London, Washington, Montreal, Portland | 25 to 34 | river and lake "beaches" counted as beaches |
| Philadelphia, Glasgow | 23, 24 | river sand, and an estuary treated as sea |

The two causes, in all 893 cities:
1. **Any sand tagged `natural=beach` counts**, including unnamed river sandbars and lake edges.
2. **Estuaries and tidal rivers pass the sea test.**

## Options

- **A. Rebuild as a researched score (recommended).** For every city, find the nearest real swimming beach: named,
  and confirmed by an official or tourism source. Record its name, whether it is sea, lake or river, and the drive
  time. Then score by one written scale, for example:
  - sea beach in the city: 80 to 100, with climate lowering it;
  - sea beach within 30 minutes: 60 to 79;
  - within 1 hour: 40 to 59;
  - lake or river swimming only: 10 to 30;
  - none within 1 hour: 0.
  Every value then has a source, and Philadelphia scores 0 or near it (the Jersey Shore is about 1.5 hours away).
  Cost: a research pass over 893 cities in batches of 25. Most inland cities settle in seconds.
- **B. Patch the formula.** Count only named beaches, and require real open sea (not an estuary) for the sea
  credit. Cheaper, and it fixes Philadelphia. But it still cannot tell a lido from a beach, and Bremen- or
  Bordeaux-type cases need hand-made exceptions.
- **C. Hide the chip** until A or B is done.

Answer: A, B or C. The chosen scale gets written into BEACH_NOTES.md and the whole column is re-run in one commit
(rulebook 4.2).
