# Contribution rating on Roamer profiles: what exists, what is missing, decisions

*2026-10-02. Jeff: "trusted travelers or locals should get a contribution rating on their profile based off what contributions are made. There was a 'points list' in one of the other recent tasks."*

## The points list (Jeff, 2026-09-22; decisions.md row of that date)

| Contribution (counted when an admin approves it) | Points |
|---|---|
| Traveler's Take or Local's Perspective interview | 20 |
| Photo contribution | 10 |
| Day trip or landmark | 10 |
| Restaurant, bar, takeaway or coffee recommendation | 5 |
| Event | 5 |
| Correction | 5 |

## What exists today (checked 2026-10-02)

| Piece | State |
|---|---|
| Points ledger `contribution_events` and the profile total `profiles.contribution_points` (kept by a trigger, never typed) | Live in Supabase (the table answers) |
| Points written when "Suggest a place" is approved (5) | Built (`approve-suggestion.js`) |
| Points written when an interview, photo or event is approved | **Missing**: `approve-insight.js`, `approve-photo.js`, `approve-event.js` were built before the ledger and never award points |
| Points for day trip suggestions | **Missing** (no approve step writes points) |
| Corrections | **No flow exists** to approve a correction |
| Showing the points anywhere | **Missing**: not on profile.html, not on roamer.html, and `public_profiles` (the public view) does not include the column |
| "Trusted traveler" badge on roamer.html | Exists, but it switches on only when the Roamer has authored a blog post |
| Blog posts, Trusted Traveler applications | Not on the points list |

## Proposed build

1. **Award points everywhere the list says**: add the ledger write to the interview, photo and event approvals (and day trip suggestions), once per item, the same way `approve-suggestion.js` does it.
2. **Backfill**: one script gives points for everything already approved by a signed-in member, so early contributors are not left at zero.
3. **Show it**: the rating on the member's own profile (profile.html) and on their public page (roamer.html), with a short "how points are earned" note. Needs one SQL file run in Supabase to add the column to `public_profiles`.
4. **Trusted Traveler / Trusted Local badge**: given by Jeff after an application from community.html, and shown beside the rating. A member whose home city is the guide's city counts as a Local.

## Decisions for Jeff

1. **What the profile shows**: the plain points total (e.g. "Contribution rating: 145"), or levels named by points? Proposed levels: Roamer 0+, Contributor 25+, Regular 100+, Expert 250+, alongside the total.
2. **Badge rule**: Trusted Traveler / Trusted Local given by you after an application (proposed), automatically at a points level, or both (a level makes them eligible to apply)?
3. **Points for a published blog post** (not on the list today): proposed 25.
4. **Backfill** past approved contributions: yes (proposed) or start from zero?
5. **Votes** (thumbs up/down on contributions): add to the rating, or leave them out? Proposed: leave out, so the rating counts only work you approved.

## Jeff's answers, 2026-10-02 (built the same day, see decisions.md)

1. Levels: **yes** (Roamer 0+, Contributor 25+, Regular 100+, Expert 250+).
2. Badge: **automatic at a points level**. Set at 100 (Regular); one constant in `contrib-score.js`.
3. Blog post: **25 points**.
4. Backfill: **none needed**, there are no past contributions.
5. **Trusted Traveler Rating** from the thumbs up / down on the member's contributions: share of thumbs up, shown from 5 votes.

Still open: Jeff runs `contribution-rating-setup.sql` once in Supabase; day trip / landmark suggestions and corrections have no approve step yet, so those points cannot be earned until one exists.

Update, same day: the Trusted Traveler application form was replaced by a city picker that opens each guide's Traveler's Take form, plus a Local's Perspective link from the profile's home city (decisions.md).

## Closed 2026-10-08

Jeff: the setup SQL has been run ("#7 already ran"). Still true: corrections have no approve step, so they earn no points until one is built (backlog, not a blocker).
