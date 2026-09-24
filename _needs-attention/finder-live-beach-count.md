# Finder: the live "mapped beaches" count still uses the old OpenStreetMap method

*2026-09-24. Found while switching the Beaches score to v2. Nothing changed.*

On choose.html, when **Beaches & Relaxation** is the only priority picked, each result card also shows a live
OpenStreetMap count, "N mapped beaches & sandy shorelines" (`ACTIVITY_OSM.Beaches`, `nwr["natural"="beach"]`).
That count has the flaw v2 fixed: it counts unnamed river sand (Philadelphia shows its three Delaware sandbars),
lake shores and hotel beaches, so a card can read "3 mapped beaches" next to a score that says there is no sea
beach within an hour.

Options:
- **A (recommended):** for Beaches only, show the researched figure instead: "Nearest swimming beach: Carolles-Plage,
  45 min (sea)" plus the count of verified beaches, from the sheet's Beaches tab, shipped in a small data file.
  One source of truth with the score.
- B: drop the live count for Beaches (keep it for the other five priorities).
- C: leave it.

Answer A, B or C.
