# Two jobs, one working directory: what can overwrite what

Several jobs share this folder and write the same files: the landmark pin pass,
hood picks, day trips, food photos, gyms, laundry. This note says which writes
are safe, which can silently erase another job's work, and the checks to run.
Written 2026-09-22, after the pin pass found three September commits whose fixes
had never reached the site.

## Safe: citydata/<slug>.json

Every current writer opens the file, replaces ONE key by character span, and
writes it back: `hoodpicks/load_picks.py apply` (eat, cafes, bars),
`daytrips/apply_verdicts.py` (daytrips), the pin pass (lmk_coords), the laundry
and gym loaders. They re-read the file at write time, so two jobs touching
different keys of the same city cannot clobber each other.

Two rules keep it that way:

- **Re-read immediately before writing.** Never write from a copy read earlier
  in the session. This is the Ibiza rule in CLAUDE.md, and it is why the span
  writers are safe.
- **Never `json.dump` a whole citydata file, and never run
  `_guidebuild/extend_citydata.py`.** It rebuilds every key from catalogs that
  may be older than citydata (memory: research-pass-gotchas-2026-09).

## The workbook: write it through sheet_write.py

openpyxl has no partial write. Every script does load, edit, `wb.save()`, which
rewrites the WHOLE workbook from what that script holds in memory. Two things
follow, and only the first is obvious:

- Anything another job saved between your load and your save is erased.
- A script can blank cells its input happened not to cover, and nothing records
  what a run changed.

A no-op save is safe in itself: loading and saving without edits leaves all
369,717 cell values identical (checked 2026-09-22), and this workbook holds no
charts, images, pivot tables or conditional formatting to lose. The danger is
entirely in what the script carries in memory.

**Write cells through the helper:**

```python
import sys; sys.path.insert(0, "_guidebuild")
from sheet_write import SheetEdit

with SheetEdit("Live Cities", who="hood picks batch 2") as e:
    e.set("Lisbon", "Landmark 3 Name", "Se Cathedral")   # skipped if already that
    e.clear("Tozeur", "Landmark 10 Name")                # emptying must say so
```

What it does:

1. **Only differing cells are written.** `set` compares with what is there and
   skips a match, so re-running a load is a no-op and the file does not change.
2. **A non-empty cell is never emptied by accident.** `set(..., None)` raises;
   emptying takes `clear()`, which is logged as such.
3. **Every change is printed** old to new when the block exits.
4. **A concurrent write cannot swallow the other job's work.** The file's hash is
   recorded at load. If it differs at save time, the helper re-opens the current
   file and re-applies only its own cells on top, so the other job's edits
   survive. If both jobs wrote the same cell, it says so and names the cell.
5. **After saving it re-reads the whole workbook** and fails if any cell moved
   that was not in its own changelog.
6. It claims the lock (below) for the life of the block and releases it after.

`SheetEdit(..., dry=True)` reports what it would change and writes nothing.
`python3 _guidebuild/sheet_write.py --selftest` proves the guards without writing.

Scripts not yet retrofitted still do plain load-edit-save: hood picks, gyms,
laundry, food photos, rain, hoods. Until they are, wrap them in the lock.

**The lock, for any workbook work:**

```
python3 _guidebuild/sheet_guard.py claim "hood picks batch 2"   # before loading
python3 _guidebuild/sheet_guard.py release                      # after saving
python3 _guidebuild/sheet_guard.py status                       # who holds it
```

It refuses if another job holds it, records the workbook's hash at claim time,
and reports on release whether the file changed while held. A lock over 30
minutes old is reported as stale; check with that session before `--force`.
`.sheet-lock` is gitignored. Keep the claim tight around load-edit-save, not
around research.

## Also dangerous: the three landmark catalogs

`city-landmarks.js`, `city-landmark-coords.js` and `city-landmark-photos.js` are
index-aligned with each other and mirrored into citydata and the sheet. Adding or
removing a landmark shifts every later index in all three, plus the sheet's
Landmark N columns. If you remove one, do all five places in the same commit.

Landmark work still pending, so expect index shifts:
St. George's (Annandale Falls replaces York House), Ashgabat (Nisa replaces the
Flagpole), El Calafate (Perito Moreno and Los Glaciares become day trips) —
decisions.md, 2026-09-22.

## The check to run

```
python3 _guidebuild/check_landmark_sync.py
```

Catalogs aligned with each other, citydata mirroring them, the sheet's landmark
names matching, every referenced photo file present. Run it before and after any
landmark write. It exits 1 on any disagreement and says what to fix. As of
2026-09-22 it passes: 893 cities, 8,925 slots, no drift anywhere.

Also useful before committing: `git status --short` (stage only your paths) and
`node _guidebuild/check_landmark_coords.js`.

## Why this note exists

Three September commits updated the catalogs but not citydata, and city.html
renders citydata. 92 coordinate fixes in 73 cities, ten cities' photo lists and
the Tozeur mosque merge were never live; Aomori's pin came from Jeff's own map
link. Nothing failed, nothing conflicted, and no check caught it for six days.

## RETIRED 2026-09-23
Done. Every script that wrote the workbook now goes through `sheet_write.py`: `SheetEdit` (cells) in rain/apply_rain,
hoods/sync_hood_geo_to_sheet, hoods/apply_hood_fixes, foodphotos/reuse/apply, hoodpicks/hoodpoint_review; the new
`TabRows` (per-city row groups, same lock / only-what-differs / re-apply / verify guarantees) in gyms/load_gyms,
laundry/load_laundromats, hoodpicks/load_picks (seed and stage) and add_city_to_sheet (new city row + Hood Picks).
The one-time column builders (beaches/write_sheet, laundry/write_sheet) now exit with a RETIRED message. Dry runs on
the live workbook: Gyms rebuilt from citydata = the tab exactly; hood-picks seed adds nothing; add-city skips an
existing city; workbook byte-identical afterwards. The standing rules are now one bullet in CLAUDE.md §7, and
`check_sheet_parity.py` (0 differences, venue tabs included) runs as a pre-commit warning.
Found on the way, not changed: 61 cities' laundromat lists were built before the 2026-09-22 neighborhood-point fixes;
re-running load_laundromats.py would re-file them (site and sheet agree today).
