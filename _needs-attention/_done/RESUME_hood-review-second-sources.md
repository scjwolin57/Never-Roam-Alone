# Resume: second sources for the hood review's thin keeps (2026-10-08)

Why: the session WebSearch quota (200) ran out during pass 3. 242 pass-3 decisions kept a neighborhood at low confidence ("no
evidence either way", default keep) and pass 3 batches d16 to d32 had one fetched page each.

What to do when the quota is back: for each low-confidence KEEP in `hood-review-2026-10-08-evidence.csv` (column final = KEEP,
evidence says thin), search for two independent sources (guide "where to stay" page, Wikivoyage district, tourism board) and
apply the definition in `_guidebuild/hoodscreen/DEFINITION.md`. Remove only with a cited source (`hoods/remove_hood.py`, one city at a
time, then `check_sheet_parity.py`). Rules: `decisions.md` 2026-10-08. Prompts: `_guidebuild/hoodscreen/PASS3_PROMPT.md`.
Inputs: pass-3 outputs were in the session scratchpad (not kept); rebuild the list from the evidence CSV.
Also pending: eat / cafes / bars, gyms and laundromats for the 51 new hoods; the 15 one-hood guides.
