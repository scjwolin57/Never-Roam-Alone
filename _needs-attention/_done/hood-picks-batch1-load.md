# Decide: load batch 1 as it stands, or run one more full kind pass? (2026-09-22)

Batch 1 (25 cities) is staged with **638 picks** (301 from the first run, 337 new), against 301 before the rule changes.
Fill is 75% of the 1,190 slots including the baseline bars. Every pick is script-clean, independently checked, and every
bar has been safety-searched. Three fresh 10% audits were run:

| Audit | Sample | Defects | What they were |
|---|---|---|---|
| 1 | 46 | 5 | 2 kind, 3 wrong neighborhood (all traced to wrong hood map points, since fixed) |
| 2 | 35 | 5 | 1 kind, 4 sub-district naming (resolved by your reading A: 3 kept, 1 out) |
| 3 | 29 | 3 | 1 note claim, 2 kind (a cocktail bar as `party`, a dessert cafe as `takeaway`) |

The defects that remain are kind labels on the boundary between two kinds, never an invented venue, a closed venue or
a venue in another neighborhood. Each audit's defects were fixed. The resume note's stop rule says an audit with any
defect after a full re-check stops the batch, so it is your call:

**A. Load now.** Accept that roughly 1 pick in 12 may carry a debatable kind label (party vs cocktail, takeaway vs
bakery). The venue itself is right. Loads to the sheet, then citydata, then one commit; a browser check of the
"Nearby" flag follows.

**B. One more pass first.** A fresh kind check of every `party`, `takeaway`, `bakery` and `coffee` pick (about 270)
against a tightened definition (party = a place people go to dance or drink late with music, not a cocktail bar;
takeaway = you order at a counter and can leave with the food), then a fourth audit, then load. About one more
session of agent time, no Google calls.

Recommended: **B**, because the two audits' kind defects were all in exactly those kinds, and the fix is cheap.
Reply "A" or "B".

## RESOLVED 2026-09-22 — Jeff: B. Kind pass on party / takeaway / bakery / coffee, fourth audit, then load.

## RETIRED 2026-09-23
Answered "B" (aba32ed2); kind pass, fourth audit and load done in c80456ac with parity 0.
