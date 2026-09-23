# The "197 countries" figure is stale

Found while building the solo comfort score (needed the real country list to
map against the Women, Peace and Security Index). Not fixed — just flagging,
since CLAUDE.md states 197 as a fact in several places and the rulebook says a
disagreement between a stated fact and the live data is a bug to report.

## What I found

`cities.html:489` computes the country count the way CLAUDE.md says it should
— live, from the data, never typed:

```js
const COUNTRY_NAMES = new Set(CITIES.map(c => c.country.toLowerCase()));
```

Running that same logic today against `destinations.js` (893 entries) gives
**232** distinct country strings, not 197. Same count from `citydata/*.json`'s
own `c.country` field (893 files, all populated). No case-variant duplicates
account for the gap — it's 232 genuinely distinct strings.

I did not audit why it grew from 197 to 232 — that would need a git-blame pass
across `destinations.js` to see which cities/countries were added since 197
was last true. My guess, unverified: the site has been adding cities in small
island nations and territories (Andorra, Bermuda, Réunion, Sint Maarten, and
similar) that each introduce a "country" string a simple visitor-country count
wouldn't have had at 197.

## Why it matters beyond the number being wrong in prose

For the solo comfort score I had to map every one of those 232 strings to the
Women, Peace and Security Index's own country names. 48 of them have no WPS
entry at all — mostly small island nations/territories and a few countries
the index excludes for data availability (Cuba, North Korea, Eritrea, Brunei).
That's a real, structural fact about the site's country list now, not a typo.

## What's not done

- I have not changed any prose that says "197 countries" (site copy, CLAUDE.md,
  etc.) — I don't know if 232 is itself final or if some of those 232 strings
  are duplicates/typos that should collapse (e.g. two spellings of the same
  place). That needs a real audit, not a search-and-replace.
- If you want, I can run that audit as its own task: list all 232, flag any
  that look like they should be aliased to an existing one, and once clean,
  update every place the count is hard-coded in prose (if any exist outside
  the live `Set` computation).
