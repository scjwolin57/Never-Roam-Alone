# Needs attention

Files with open work in them, gathered here on 7 August 2026. Nothing was
deleted or edited — these were only moved. None of them are used by the live
site, so moving them broke nothing.

## Waiting on a decision from you

| File | What it needs | Moved from |
|---|---|---|
| `transport-pilot-review.md` | Approve the format for 25 sample cities before it rolls out to ~870 more | project root |
| `performance-audit-2026-08-07.md` | Three fixes are done; the bigger speed-ups need your go-ahead | project root |
| `cull_review.md` | Review 1,595 city rows proposed for deletion, before anything is deleted | project root |
| `roamer-review-questions.md` | Pick the 10 best questions | project root |
| `local-interview-questions.md` | Pick the 10 best questions | project root |

## Unfinished work and research backlog

| File | What it needs | Moved from |
|---|---|---|
| `coords-needing-review.csv` | Landmark coordinates flagged for review (~1 MB) | `_guidebuild/` |
| `neighborhoods-needing-photos.md` | 52 neighborhoods with no usable photo — your own photos are the best fix | project root |
| `food-unverified.md` | Venues that could not be verified, plus thin-coverage cities worth a look | `_guidebuild/` |
| `transit-popups-notes.md` | 145 cities researched but not yet live on the site | project root |
| `RESUME_citybuild.md` | Half-finished batch city build (~709 cities), with instructions to resume | `_guidebuild/sandbox/` |
| `suggested-improvements.md` | Your general improvement backlog | project root |

## One orphan worth a look

- `orphan-story-page.html` — a finished "Never Roam Alone — Story" page that was
  found among the junk files. There is no `story.html` on the site and nothing
  links to it, so it appears to have been dropped at some point. Kept here in
  case you want it back; delete it if you don't.

## Root clutter (cleared 7 August 2026)

Deleted: 21 `.fuse_hidden*` orphan file copies, `logo.svg.bak` (byte-identical
to `neverroamalone-logo.svg`), the `_to_delete/` folder, and seven
`_batch3_*.py` scratch scripts whose output is already live in
`city-landmarks.js`. All of it was committed to git beforehand, so every deleted
file can be recovered with `git checkout HEAD~ -- <filename>`.

`missing_landmark_photos.xlsx` was kept, in the project root where it was.
