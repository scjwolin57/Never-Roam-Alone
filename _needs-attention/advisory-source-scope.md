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
  country's (Bahir Dar shows 3; Amhara is 4). See `_done/bahir-dar-advisory-level4.md`.
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

## Jeff's plan (2026-09-22) and what it needs

He wants a **passport country on the profile**. A signed-in traveller sees the
advisory their own government publishes; everyone else sees three governments.
That answers the problem properly: the rating a reader sees is the one that
applies to them, and nobody is shown one country's view as if it were the truth.

Seven things it needs, in the order they have to happen:

1. **A `passport_country` field, not `home_country`.** `home_country` already
   exists in the profile whitelist (auth.js), but it is where someone lives.
   Citizenship is what decides whose advisory applies, and the two differ often
   enough to matter. New column, offered with the existing country picker on
   profile.html, defaulting to `home_country` the first time and editable after.
2. **Advisories move out of citydata to a country-level file.** They are per
   country, not per city: today the same rating is copied into each city and
   135 of 893 carry one. A single `advisories.js` keyed by country, holding one
   entry per tracked government with its level, its own words, its link and its
   own as-of date, plus a per-city regional override where a city sits in a
   differently-rated region (Bahir Dar in Amhara). One file to refresh, no
   duplication, and the regional exceptions stay visible.
3. **Which governments are tracked.** Only a handful publish anything usable:
   US, UK, Canada, Australia, New Zealand, Ireland. A passport from anywhere
   else has no feed to read, and that is most of the 197. So: show that
   traveller's own government when it is tracked, otherwise fall back to the
   default three with a line saying their government does not publish one.
4. **city.html has to learn who is reading.** It does not load auth today (no
   Supabase call anywhere in the page), and adding one to every guide load
   would cost a round trip before the banner can render. Cheaper: auth.js
   writes the passport country to localStorage at sign-in, city.html reads that
   synchronously, and a signed-out or unknown reader gets the three. No new
   dependency on the guide page and no render delay.
5. **A refresh that does not go stale.** The current banner says "as of Jul
   2026" for every city, hardcoded in the page, and it is already wrong. Each
   source carries its own publication date, so show that date per source, and
   refresh weekly on a schedule: Canada and the UK by API, the US by hand.
6. **A common scale, with each government's own words kept.** Levels do not
   line up: the US has 1-4, Canada has four states worded differently, the UK
   has no number at all. Map each to a shared 1-4 for sorting and colour, but
   always print the source's own label and link. Never paraphrase a warning.
7. **The internal rule stops naming one government** (below).

## Options for the signed-out banner

1. **Keep US only.** Store the as-of date per city
   instead of the hardcoded "Jul 2026", and use the regional level where a city
   sits in a differently-rated region. Small. Does not answer Jeff's point.
2. **Show three governments, strictest first** (recommended, and what Jeff's plan implies for signed-out readers). Add Canada
   (structured, trivial to refresh) and the UK (dated text naming regions), keep
   the US. The banner becomes something like: "Travel advisories: US Level 3 ·
   Canada, avoid non-essential travel · UK, advises against all travel to the
   Amhara region", each linking to its source, each with its own date. A refresh
   script fetches all 197 countries from Canada and the UK; the US stays by hand.
   Cost: a day's work plus a regional read for the ~135 flagged cities.
3. **A picker for signed-out readers**, remembered per browser. Worth adding
   after the profile field, for the reader who has not signed in but wants their
   own government's view. Same data, small UI.

## The rule change that goes with it

Whatever the display does, the internal rule should stop naming one government.
Proposed wording: **a place is restricted when any tracked government advises
against all travel there**, which is country-neutral, and is what actually
decided Bahir Dar (both the US and the FCDO say do not go to Amhara). That also
settles the open question in `_done/bahir-dar-advisory-level4.md` without resting on
the US rating alone.

## One caution on coverage

Adding sources will put a banner on cities that show none today, because
Canada's "avoid non-essential travel" sits lower than the US Level 3. Pick a
threshold before loading: show a banner only at "avoid non-essential travel" and
above, or the site will carry warnings on a large share of the 893.

## Open questions for Jeff

1. **Which three for signed-out readers?** US, UK and Canada is my suggestion:
   all three are free to fetch, widely read, and between them cover most of the
   English-speaking audience. Australia is the obvious fourth.
2. **What threshold shows a banner?** The scales differ, so a city showing
   nothing today may gain a banner from Canada's lower bar. I would show the
   banner at "avoid non-essential travel" and above, and say nothing below it.
3. **Is the passport country public?** It sits on a profile others can view. I
   would keep it private to the account and never render it on a public profile,
   like an email address.

## Effort, in stages

- Stage 1, the country file and the refresh script: a day. No UI change; the
  banner keeps showing the US line until stage 2.
- Stage 2, the three-government banner for everyone: half a day.
- Stage 3, the profile field and the per-reader banner: a day, including the
  Supabase column, profile.html and the localStorage handoff.
- Stage 4, the regional read for the cities in differently-rated regions: a
  research pass, roughly the size of the day-trip verification. This is the part
  that fixes Bahir Dar, Gondar, Lalibela, Mek'ele and Axum.

## Built 2026-09-22 (stages 1-3)

- `advisories.js`, 118 KB, 232 countries, rebuilt by
  `_guidebuild/advisories/refresh.py`. Canada and the UK come from their own
  APIs with their own publication dates; the US levels are lifted from citydata
  and still need a hand refresh (52 countries carry one, which are the 3s and
  4s; the rest were never stored because they are 1s and 2s).
- **Whole-country versus parts.** The FCDO nearly always warns about regions:
  Egypt means Sinai, Mexico means certain states. Treating those as
  country-wide would warn people off cities the advice does not touch, so each
  source carries a `scope`, and the banner shows at level 3 and above only when
  the warning is country-wide. 55 countries qualify. Another 30 have parts
  flagged: they get a quieter line saying the warning covers parts of the
  country and to check whether it reaches this city.
- **city.html** shows the three governments, each with its own words, link and
  date. The hardcoded "as of Jul 2026" is gone. A reader whose passport country
  is one of the three sees only their own government, with a line saying so and
  a link to change it.
- **profile.html** has a private Passport country field with the ISO country
  list behind it; `auth.js` mirrors the value into `localStorage` so a guide can
  pick the right source before any network call, and clears it on sign-out so a
  shared browser never shows the last person's setting.
- **passport-country.sql** adds the column. Jeff runs it in Supabase; until then
  the field saves nothing and every reader sees the three.

Checked at 320, 375 and desktop: no overflow, the banner stacks.

### What is still open

- **Stage 4, the regional read.** A city in a flagged region still shows the
  country's line. Bahir Dar is the case that matters: a UK-passport reader sees
  "advises against all travel to parts of this country" when the FCDO means
  Amhara, where the city is. The fix is a per-city override in citydata
  (`advisory.region`), which city.html already renders when present. Ethiopia's
  five cities are known and could be done first.
  **Cities known to need the regional override (folded in from `_done/bahir-dar-advisory-level4.md`, 2026-09-23):**
  Bahir Dar, Gondar, Lalibela (Amhara) and Mek'ele, Axum (Tigray): the US, UK and Canada all give their top
  warning for both regions, but the guides show Ethiopia's country line (US Level 3). Also **Lamu**: the US July
  2026 advisory reportedly names all of Lamu County, Lamu town included (search snippet only; the US pages block
  automated reads), while the UK and Canada except Lamu and Manda islands. The day-trip side is done: every trip
  in those regions now carries a safety alert (decisions.md 2026-09-23). Jeff's wider question from that file
  still stands: keep these guides as they are with the right regional advisory shown, or do more?
- ~~**US levels** for the other 180 countries, and a date for each.~~ **Done 2026-09-23:** the State Department publishes a JSON feed (`cadataapi.state.gov/api/TravelAdvisories`); `refresh.py` now reads it (several calls merged, since each returns part of the list). US levels for 226 of 232 country names, each with its own date; Macau carries a regional override (Level 3) because its country entry is Hong Kong (Level 2). 12 cities' per-city `advisory` fields brought in line (Kuwait City, Bissau, Ibadan, Kano, Kinshasa gained one; 6 Bangladesh cities and São Tomé dropped from Level 3 to 2). Solo comfort re-run for all 893 (28 changed).
- The destination finder already asks for a passport country for visas. A
  signed-out reader who has set it there could see their own government too;
  Jeff said signed-out readers see the three, so this was not wired in.
