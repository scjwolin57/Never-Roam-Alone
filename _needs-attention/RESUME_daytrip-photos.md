# Resume note: Day trip hero photos (started 2026-09-28)

*Read CLAUDE.md, then `decisions.md` (row dated 2026-09-28, day trip photos), then this.*

## What this is
Jeff approved a hero photo on every day trip card (`_needs-attention/decisions.md` 2026-09-28): Wikimedia
Commons only, location-checked against the trip's geocoded point (or the city center when it has none),
licence-checked (CC0/Public domain/CC BY/CC BY-SA only, never NC or ND), 640px webp. A trip with no verified
photo keeps a plain card -- never a filler image. The credit is mirrored to the sheet's Half-/Full-Day Trips
cell as `` | Photo: <credit>``, same convention as the day-trip safety-alert suffix.

## Tool
`_guidebuild/daytrips/fetch_daytrip_photos.py` (gitignored). Resumable: state lives in
`_guidebuild_state/daytrip_photos_state.json` (gitignored), one row per finished city; a re-run skips cities
already in it, so `--limit N` just keeps going where the last run stopped.

    python3 _guidebuild/daytrips/fetch_daytrip_photos.py --limit 150
    python3 _guidebuild/daytrips/fetch_daytrip_photos.py --city "Kotor"      # one city, for testing/redo

## Progress (2026-09-28, as of the third commit, 19fbab69)
- Cities visited by the pipeline: 332 of 893 (check the state file's `done` count for the current figure).
- Cities with at least one photo: 302 of 893.
- Trips with a photo: 823 of 3,100.
- Three commits landed on branch `daytrip-photos-pilot`: "batch 1" (59 cities, 146 photos, 490c49ed),
  "batch 2" (100 more, 382 total, 8c33124e), "batch 3" (150 more, 823 total, 19fbab69). Not yet merged to
  main or pushed -- check `git log` before assuming what's live.
- Two real bugs found and fixed during this pass (both already fixed in the committed script):
  1. Credit text kept the wiki "(page does not exist)" suffix on a red-link username. Fixed in
     `short_author()`; 79 already-saved credits were bulk-corrected with a plain text substitution
     (no re-fetching needed -- the real name was already in the string).
  2. The "citydata trip shape drifted" safety assertion compared a photo-stripped new list against an
     un-stripped old list, so any city that already had SOME trips photographed from an earlier pass
     crashed the first time the pipeline reached its still-bare remaining trips. Fixed by stripping `photo`
     from both sides before comparing.

## The required step after every run: look at every new photo
The automated checks (license, size, aspect ratio, distance from the trip's point) are not enough by
themselves. In the first ~350 trips this pass found and hand-fixed:
- A photo that showed the country's flag, not the destination (Reykjavik/Thingvellir).
- A close-up portrait of a person instead of the place (three separate trips).
- A political mural used as a generic hero shot (Belfast/Derry).
- A 19th-century engraving and a painted folding screen -- real Commons files, but not photographs.
- A completely mismatched subject: a pet lovebird, a fruit species, a chess-tournament photo, an "Ancient
  Olympia Municipality" administrative-division photo instead of the archaeological site.

Build a contact sheet after each run (a script for this is not checked in; write a quick PIL grid script, or
ask the assistant to) and look at every new photo before committing. Fix or remove anything that fails
CLAUDE.md rule 7 (no flags, montages, watermarks, portraits of people) or is simply the wrong place. A trip
with no honest replacement in its Commons category gets no photo -- never a filler image.

## A credit-extraction bug already found and fixed (2026-09-28)
Commons "red link" usernames (someone whose Commons user page doesn't exist yet) show their link title as
"User:Name (page does not exist)"; the credit builder was keeping that whole string. Fixed in
`short_author()` (reads the username from the link's `href`, not its displayed title) and bulk-corrected in
79 already-saved credits. If a credit ever looks off (too long, contains stray HTML-adjacent text, contains
"upload bot"), check it against the file's real Artist/uploader fields before trusting the pipeline's output.

## Every batch, before committing
1. Run the script for N more cities.
2. `node --check day-trips.js`.
3. Parity check: citydata's day-trip `photo` fields must exactly match day-trips.js's (same script logic as
   `fetch_daytrip_photos.py`'s own asserts already enforce this per city, but re-verify after any hand fix).
4. Build a contact sheet, look at every new photo, fix or remove what fails rule 7.
5. Sync the sheet: `sheet_write.py` hardcodes its root to the file's own location (the main checkout), so a
   worktree's own NRA-MASTER.xlsx needs the sandbox trick -- copy the worktree's `citydata/` and
   `NRA-MASTER.xlsx` into a temp dir, symlink `_guidebuild` into it, run
   `_guidebuild/daytrips/sync_daytrip_photo_credits.py` there, copy the resulting xlsx back, then `git add`
   it in the worktree. (If working directly in the main checkout, this is unnecessary -- just run the sync
   script normally.)
6. `_guidebuild/check_sheet_parity.py` must read 0.
7. `git add` the touched citydata files, day-trips.js, images/daytrips, NRA-MASTER.xlsx -- claim any files
   the task board says are unclaimed first (a background run's file changes are not always auto-claimed;
   `python3 .githooks/nra_tasks.py claim <paths...>` in bulk, or grep the pre-commit's refusal list and pipe
   it through `xargs ... claim`).
8. Commit with a log: cities/trips done, what was hand-fixed and why.

## Left open when this note was written
- 561 cities not yet visited by the pipeline.
- Not yet merged into main or pushed. Bring the branch up to date with main first (other sessions are
  actively committing), then merge and push per the usual process, resolving the decisions.md /
  CLAUDE.md-row conflicts by hand (both sides keep their own rows/edits).
- CLAUDE.md §5.1's "as of" line and photo counts want a final update once the run is complete.
- No new quality-bug *classes* found after the credit fix and the broadened title filter (engravings,
  paintings, lithographs, etc.), but each new batch still turns up a handful of wrong-subject photos the
  automated checks cannot catch by text alone: wrong-Wikidata-entity matches (an administrative division
  or a namesake instead of the real place), close-up portraits of people, event/ceremony photos, and old
  archival photos that are technically photographs but not usable "hero" shots. Expect roughly 3-6% of a
  batch to need a hand fix; budget time for it, do not skip the contact-sheet review step to save time.
- A decisions.md row (2026-09-28, "Day trip cards carry a hero photo") and a project memory note
  (`daytrip-hero-photos`) were written the same day this pass ran; update the memory note's counts when the
  run finishes.
