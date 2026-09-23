# Resume: day-trip safety alerts (started 2026-09-23)

**Rule (Jeff, 2026-09-23):** no day trip is dropped for a travel advisory. A trip whose location is under a
tracked government's **top-level** warning (US "Do Not Travel", UK "advises against all travel", Canada "Avoid
all travel") is listed with a safety alert. The page builds the wording, link and date live from
`advisories.js` and follows the reader's passport setting. Level-3 warnings ("reconsider", "all but
essential", "non-essential") are not alerts.

**Tools** (`_guidebuild/daytrips/alerts/`): `candidates.py` → `packets.py` → `split.py` make `rule.json`
(175 trips, whole-country warnings, decided by rule) and `batches/b01-b15.json` (1,159 trips in countries
with named top-level areas). Agents follow `BRIEF.md` → `out/bNN.json`, then an independent `CHECK.md` pass →
`out/bNN_check.json`. `apply_alerts.py out/bNN.json ... [--rule]` writes day-trips.js, citydata and the sheet
together. `recheck.py` runs after every `advisories/refresh.py`. `last_pass.txt` = date of the last full pass.

**Also:** `out/readd.json` holds places dropped under the old rule (advisory-dropped-daytrips.md), to be
added back with alerts.

## Progress
| Batch | Countries | Research | Check | Applied |
|---|---|---|---|---|
| rule | 21 whole-country | n/a | n/a | 5c00cac8 (175 alerts) |
| b05 | Indonesia | 62, 0 covered | agreed, 0 changes | nothing to write |
| b04 | Thailand | 66, 1 covered (Phanom Rung, Canada, 50 km Cambodia border) | agreed, 0 changes | this commit |
| b06 | Brazil | 60, 1 covered (Itaipu Dam, US, 160 km border zone) | agreed, 0 changes | this commit |
| b02 | Mexico | 82, 15 covered (US: Colima, Guerrero, Michoacán, Sinaloa, Zacatecas) | agreed; sources upgraded to the State Dept page (archive 2026-07-14) | this commit |
| b03 | India | 75, 5 covered (Kashmir Valley x4, Pul Kanjari) | added US to all 5; 3 vague-area trips held for Jeff (daytrip-alerts-calls.md) | this commit |
| b08 | Philippines, Egypt | 61, 6 covered | Wadi El Natrun x2 gained US; Coloured Canyon x2 held (vague "Middle Sinai", calls file) | this commit (4 alerts) |
| b07 | Türkiye, Algeria | 88, 11 covered (Tamanrasset x7 US province list; Djanet: Tadrart Rouge, Tin Merzouga, Tassili; Tlemcen, Canada 50 km Morocco) | 5 borderlines settled | this commit |
| b10 | Morocco, Colombia, Saudi Arabia | 67, 6 covered (Valle del Cauca x4 US; Tanomah, Wadi Lajab Canada) | Wadi Lajab: US not counted (no public distance) | this commit |
| readd | trips dropped under the old rule | 18 proposed, 10 left out (too far / no sight) | 8 ok, 8 fixed, 2 dropped (Damascus-Tyre over 3 h, Goma-Bukavu no same-day boat) | this commit (16 added) |
| b09 | Pakistan, Peru, Malaysia | 79, 6 covered | Kharmang Valley not covered (sights 24-45 km from the LoC); Taxila to Jeff | this commit (5 alerts) |
| b15 | 13 small countries | 26, 4 covered (UK: Sidon, Virunga, Bukavu from Bujumbura, Tiraspol) | agreed, 0 changes | this commit |
