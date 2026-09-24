# Kinshasa: the guide shows no travel advisory, but DR Congo may be "Do Not Travel"

Found 2026-09-22 during the day-trip research for the 68 empty cities. Nothing changed.

- `citydata/kinshasa.json` has `advisory: null`, so the page shows no warning.
- The day-trip researcher reported a country-wide US State Department **Level 4 "Do Not Travel"** for the DRC,
  issued 2026-07-15 and updated 2026-09-17. I could not confirm it: the State Department page refused the
  automated request (HTTP 403).
- Compare Bamako, whose page already carries Level 4 "Do Not Travel" with the State Department link.

**To check:** open the State Department's DR Congo advisory page. If it is Level 4 (or Level 3), Kinshasa's
`advisory` field should say so, site and sheet together (city.html shows Level 3/4 only). It could not be
edited now anyway: the hood-picks run is writing the city files.

## RETIRED 2026-09-23
Fixed by 6d1e801b: citydata/kinshasa.json shows Level 4, Do Not Travel; the sheet row reads "Level 4: Do Not Travel" (checked 2026-09-23).
