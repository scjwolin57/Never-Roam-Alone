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

## Dangerous: NRA-MASTER.xlsx

openpyxl has no partial write. Every script does load, edit, `wb.save()`, which
rewrites the WHOLE workbook. Anything another job saved between your load and
your save is erased, silently, with no merge conflict and nothing in git to warn
you. Thirty-odd scripts here write it.

The window that matters is the session, not the script: if you load the workbook,
research for twenty minutes and then save, you erase every sheet change made in
those twenty minutes.

**Use the lock:**

```
python3 _guidebuild/sheet_guard.py claim "hood picks batch 2"   # before loading
python3 _guidebuild/sheet_guard.py release                      # after saving
python3 _guidebuild/sheet_guard.py status                       # who holds it
```

It refuses if another job holds the lock, records the workbook's hash at claim
time, and tells you on release whether the file changed while you held it. A
lock over 30 minutes old is reported as stale; check with that session before
`--force`. The lock file `.sheet-lock` is gitignored.

Keep the claim tight: claim, load, edit, save, release. Not around research.

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
