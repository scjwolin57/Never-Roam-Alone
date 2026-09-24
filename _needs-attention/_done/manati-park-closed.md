# Punta Cana: Manatí Park removed while it is closed

**Status:** removed from the site on 2026-09-22. Punta Cana now ships with 9 landmarks.

Jeff confirmed the park is closed for renovations. OpenStreetMap also labels the
Bávaro site "Manatí Park - Cerrado". The rulebook says a closure is a deletion
with the source in the log (CLAUDE.md 4.3), and a guide should not send anyone
to a closed attraction, so the entry is gone from `city-landmarks.js`,
`city-landmark-coords.js`, `city-landmark-photos.js`, `citydata/punta-cana.json`
and the sheet's Landmark 8 columns (the later landmarks shifted up).

**If it reopens**, restore it at index 7, between the Indigenous Eyes park and
Marinarium:

- Name: `Manatí Park`
- Blurb: `A Bávaro theme park of orchid-filled gardens, native wildlife exhibits, and dolphin and sea lion shows built around Dominican flora and fauna.`
- Coordinate: `18.64743, -68.42887` (OSM, Bávaro; the old pin was 5.9 km south and was corrected during the pin pass before removal)
- Photo: `images/landmarks/punta-cana-manati-park.webp`, page `https://commons.wikimedia.org/wiki/File:Ara_chloropterus_-Manati_Park_-Dominican_Republic-8a.jpg`

The image file is still on disk. Do not pad the list to ten in the meantime.

## RETIRED 2026-09-23
Removed in a01bcdfe. Kept here for the restore details if the park reopens (decisions.md 2026-09-22 points to this file).
