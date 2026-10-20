# Resume note: other airports (airports2) research

Definition: `secondary-airports-definition-2026-10-20.md` (approved by Jeff 2026-10-20).
Tooling (gitignored): `_guidebuild/airports/` (BRIEF.md, airports_tool.py, geo.py, patch_city_html.py, work/).

## How to run a batch
1. `python3 _guidebuild/airports/airports_tool.py batch <n>`; research per BRIEF.md into `work/batch<n>.json`
   (one agent per batch, at most ~60-80 web searches each; the session budget is about 200).
2. Read the agent's unsure list; downgrade weak `no-scheduled` to `hold`.
3. `python3 _guidebuild/airports/airports_tool.py apply work/batch<n>.json` (sheet tab + citydata together).
4. `airports_tool.py parity` and `check_sheet_parity.py` both 0; commit the sheet + the citydata files by path.

## Progress (198 guides, 228 entries, 8 batches)
| Batch | Guides | State | Commit |
|---|---|---|---|
| 1 | Aachen to Bratislava | applied: 24 keep, 3 removed, 1 too far, 1 hold (Avignon) | baedf93f |
| 2 | Brighton to Edirne | applied: 18 keep, 4 removed, 4 too far, 5 same as main | baedf93f |
| 3 | Encarnación to Jasper area | applied: 21 keep, 1 removed (GSE), 4 too far, 2 hold (Ica, Muan) | c7046fac |
| 4 | Jianshui to Manila | applied: 26 keep, 1 no-scheduled (LGG, string kept), 1 too far, 1 same, 4 hold | 460d619e |
| 5 | Medellín to Orlando | applied: 21 keep, 2 removed, 5 hold, 1 too far | ce5a6aff |
| 6 | Osaka to Reykjavik area | applied: 17 keep, 4 removed, 5 hold, 3 too far | 433d982f |
| 7 | Rome to Stanley area | applied: 22 keep, 4 hold, 2 too far, 2 same | ede0ac02 |
| 8 | Tarragona to Yokohama | applied: 24 keep, 1 too far | 7efe6615 |

**Research complete 2026-10-20:** 173 airports in the tab (151 guides); 15 no scheduled flights (14 strings removed);
21 held; 17 too far; 8 same as main. Held list for Jeff: `other-airports-held-2026-10-20.md`.

## Held, for Jeff (nothing changed)
- Avignon AVN (no outright closure statement), Ica, Jianshui Mengzi and Karbala International (appear never opened),
  Kingston Tinson Pen, Muan MWX for Jeonju (closed since the Dec 2024 crash), Kyiv Zhuliany (closed with
  Ukrainian airspace; the main airport KBP is closed too, so the Kyiv popup may need a note).

## Still to do
- city.html popup (layout A chips + "est."): `python3 _guidebuild/airports/patch_city_html.py`, then
  checkjs, 6 widths, screenshots. Waiting for the tidy-up session to release city.html.
- CLAUDE.md §5.1 inventory row, decisions.md row and TODO.md D14 line: same wait (files held by that session).
