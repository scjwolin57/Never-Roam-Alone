# Master rule for this project: never write destructively

This project is built from a small number of very large files (city.html alone is
over a million characters). A single careless edit can silently delete working
features. It has already happened: an edit to the guide page was made on an
out-of-date copy of city.html and quietly wiped the Ibiza guide out of that one
file, leaving a live link that led to an error page.

The rules below exist to stop that from ever happening again. Follow them on
**every** edit, no exceptions.

## The one rule that matters most

**Only add or remove the exact lines the task requires. Never replace a whole
file, or a whole block, wholesale.**

- Do not regenerate, re-emit, or "rewrite" an entire file. Change only what needs
  to change and leave everything else byte-for-byte identical.
- Prefer small, targeted edits (find the exact old text, replace just that text).
- If a change looks like it needs a full rewrite, stop and find a smaller way to
  do it, or ask first.

## Before editing, read the current file

- Always read the **current** version of the file (or the specific block) right
  before editing it. Do not work from a copy you read earlier in the session or
  from memory — the file may have changed since, whether by another edit, a
  commit, or Jeff editing it by hand.
- This is how the Ibiza deletion happened: the edit was based on a stale copy that
  no longer contained Ibiza, so committing it dropped Ibiza. Reading the live file
  first would have caught it.

## After editing, prove nothing was lost

- After changing any shared file or template block (a city card, a nav bar, a
  data list, etc.), check that every feature that was there before is still there.
  Search the file for the pre-existing pieces (buttons, badges, links, data
  entries) and confirm the count didn't drop.
- Confirm only the intended file changed, and only by the intended amount
  (a quick `git diff --stat` should show the expected file and roughly the
  expected number of added/removed lines — nothing surprising).
- For the big HTML/JS files, run the project's syntax check
  (`python3 _guidebuild/checkjs.py <file>` for the HTML pages, `node --check`
  for plain .js files) and make sure it reports zero errors before finishing.

## Adding a city

City data lives in about ten files at once. Add a city with the dedicated tool
(`_guidebuild/add_city.py`, per `_guidebuild/CITY_SCHEMA.md` and the add-city
skill) rather than hand-editing each file — it splices every file at once and is
safe to re-run. After adding, confirm the city is present in **all** target
files, especially city.html (the actual guide page), not just the city lists.

## When in doubt

If a task seems to require deleting or rewriting a large amount of existing,
working code, pause and ask Jeff before doing it. Losing a working feature is far
worse than asking one extra question.
