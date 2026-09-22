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
