# Visitor figures disagree between destinations.js and citydata (found 2026-09-21)

Found while building the hood-picks scope. `destinations.js` (re-based on international arrivals, September 2026) and `citydata/<slug>.json` `c.visitors` hold different numbers for the same city.

| | Count |
|---|---|
| Cities where the two differ | 741 of 893 |
| Cities that sit on different sides of the 0.5 million line (scope of the hood-picks run) | 75 |

Example: Bangkok is 22.8 in destinations.js and 26 in citydata. Kotor is 0.6 and 0.35.

**Rule this breaks:** CLAUDE.md 4.2, "the same figure feeds the homepage globe, finder cards and the top-visited page"; and 4.5, "disagreement between two files is a bug, fixed by regenerating the copy from the source of truth".

**What the hood-picks run did:** it used `destinations.js`, as its spec says, which gives the 412 cities and 1,913 mapped neighborhoods the spec expects. Using citydata would have given 393 cities.

**Question for Jeff:** which file holds the current figure? If destinations.js does, citydata (and the sheet, if it differs) should be regenerated from it in one commit. Nothing was changed.
