# The travel advisory is one government's view, shown to everyone

Jeff, 2026-09-22: "this site isnt just for US citizens, anyone all over can use
it, so another country may not have a level 4 warning."

He is right, and it reaches further than the display: the internal rules are
keyed to US levels too. Nothing has been changed. This note is the decision.

## What the site does today

- `citydata/<slug>.json` `advisory` holds `{lvl, label, url}` from the US State
  Department, and nothing else. 135 of 893 cities have one: 79 at Level 3,
  56 at Level 4. The other 758 show no banner.
- city.html renders it as: **US travel advisory: Level 3 — Reconsider Travel**,
  linking to travel.state.gov, followed by "(as of Jul 2026)".
- That date is a hardcoded string in the page, the same for every city, and it
  is already wrong for some: the Amhara advisory was updated 27 Aug 2026.
- The value is the country's level. Where a region differs, the city shows the
  country's (Bahir Dar shows 3; Amhara is 4). See `bahir-dar-advisory-level4.md`.
- The day-trip rules ("nothing in a Level 4 or advise-against-all-travel area")
  are written against the US level, so what is allowed on the site depends on
  one government's rating.

The banner does say "US travel advisory", so it is not passing the rating off as
universal. The gap is that a reader in Madrid or Sydney gets a US reading with no
indication that their own government may say something else, milder or stronger.

## What other governments publish, checked today

| Source | Machine-readable? | Levels | Regional detail | Freshness |
|---|---|---|---|---|
| US State Dept | pages, no clean feed | 1-4 | prose inside the page | per country |
| Canada (data.international.gc.ca) | **yes, clean JSON** | numeric `advisory-state`, `has-regional-advisory` flag | prose | `date-published` per country |
| UK FCDO (gov.uk content API) | **yes, JSON per country** | no numeric level; "advises against all travel to X" | **names the regions in the text** | `public_updated_at` per country |
| Australia Smartraveller | levels 1-4 | yes | prose | per country |

Structured *regional* levels are not published by anyone in a clean feed. Region
detail is prose everywhere, so regional accuracy stays a by-hand job whatever we
do about sources.

## Options

1. **Keep US only, fix what is wrong with it.** Store the as-of date per city
   instead of the hardcoded "Jul 2026", and use the regional level where a city
   sits in a differently-rated region. Small. Does not answer Jeff's point.
2. **Show two or three governments, strictest first** (recommended). Add Canada
   (structured, trivial to refresh) and the UK (dated text naming regions), keep
   the US. The banner becomes something like: "Travel advisories: US Level 3 ·
   Canada, avoid non-essential travel · UK, advises against all travel to the
   Amhara region", each linking to its source, each with its own date. A refresh
   script fetches all 197 countries from Canada and the UK; the US stays by hand.
   Cost: a day's work plus a regional read for the ~135 flagged cities.
3. **Let the reader choose their government.** A picker (US / UK / Canada /
   Australia), remembered per browser, showing that country's advice. Needs all
   four datasets first, so it is option 2 plus UI. Sensible later, not first.

## The rule change that goes with it

Whatever the display does, the internal rule should stop naming one government.
Proposed wording: **a place is restricted when any tracked government advises
against all travel there**, which is country-neutral, and is what actually
decided Bahir Dar (both the US and the FCDO say do not go to Amhara). That also
settles the open question in `bahir-dar-advisory-level4.md` without resting on
the US rating alone.

## One caution on coverage

Adding sources will put a banner on cities that show none today, because
Canada's "avoid non-essential travel" sits lower than the US Level 3. Pick a
threshold before loading: show a banner only at "avoid non-essential travel" and
above, or the site will carry warnings on a large share of the 893.
