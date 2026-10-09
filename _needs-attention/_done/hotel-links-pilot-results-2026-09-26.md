# Hotel links pilot: results and a change of order (2026-09-26)

*Run under the rules Jeff set: no Google, OpenStreetMap only, 25 cities, nothing written to the sheet or citydata. Research agents ran on Sonnet. Raw results: `_guidebuild/hotellinks/pilot_result1-5.json` (gitignored).*

## Outcome in one paragraph

The pilot did not reach a single verified match (Match A). The method in the plan, web search plus reading the partner page, cannot verify a hotel's location on these sites. Agoda pages are drawn in the browser and give an ID and nothing else. Expedia refuses scripted page reads (HTTP 429). Hostelworld pages carry no coordinates. The session's 200-search cap ran out during the pilot, so 167 of 365 hotels were never searched. At about one search per hotel, 10,741 hotels would need about 11,000 searches. That is not possible by this route.

## Numbers (365 hotels, 25 cities)

| Result | Hotels | Meaning |
|---|---|---|
| Match A (verified name and place) | 0 | Needs partner coordinates; none were readable |
| Match B (name and city agree, from search title, URL, snippet) | 133 | Not verified; would go to review, not to citydata |
| Match C (weak) | 13 | No link |
| No page found | 17 | Searched, none on the assigned partner |
| Blocked | 35 | Expedia 429 |
| Not searched | 167 | Search cap reached |

| Partner | B | C | Blocked | Property ID found |
|---|---|---|---|---|
| Agoda | 72 | 4 | 0 | yes, from page data or URL |
| Expedia | 50 | 2 | 35 | from search-result URLs only |
| Hostelworld | 11 | 7 | 0 | from URLs |

OSM (Nominatim, free): found 13 of 87 hotels tried, 74 not found; 278 not checked. About 15% coverage for hotels, so OSM cannot be the location check on its own. Distance to the hood point was computed for none, because no partner coordinates existed to compare.

## What it found about the sites

- **Agoda:** pages open with no block, but the served page has no address, coordinates or JSON-LD. Only the hotel ID can be read.
- **Expedia:** rate-limits a scripted page read on the first request. The agents stopped, as the brief required.
- **Hostelworld:** opens, no address or coordinates in what is served.
- **Duplicates and renames are common** (all flagged in the notes): Wanderlust Singapore has four Agoda listings, KAI Beppu four, Es Saadi Marrakech two, Vila Mar two; Hotel Lybid appears as Premier Hotel Lybid, Socialtel La Candelaria as Delgadillo Boutique Hotel. A match by name alone would link some readers to the wrong listing.
- No hotel looked closed or in the wrong city, but that was never proven because location was never checked.

## Change of order (this reverses my earlier advice)

I recommended building the property-URL pipeline before applying. The pilot shows the reverse is the workable order. The reliable source for property ID, name, address and coordinates is the partner's own data, which partners give to approved affiliates:

1. **Apply to Agoda and Expedia now.** Agoda's agreement has a 6-month no-bookings clause, but that clock only starts once links carry the ID, so applying early costs nothing if links are not yet live.
2. Once approved, use each program's own tools to look up properties (Agoda's affiliate tools and Expedia's creator tools). **Not verified:** what lookup, feed or API each program offers a new small publisher, and any traffic gate on it. The earlier GetYourGuide finding (API needs 100,000 visits a month) is a warning that this may be gated. First task after approval is to read what each program offers and re-run this same 25-city pilot with partner coordinates.
3. Until then, no hotel link ships. Match B rows are not enough.

## Decisions for Jeff

1. Apply to Agoda and Expedia now (recommended), or wait?
2. Should the pilot be re-run after approval on the same 25 cities (rules unchanged)? Recommended.
3. If a program's lookup turns out to be gated by traffic, the fallback is Stay22's Allez links (destination-level, no property match, publisher keeps 30% or more of Stay22's cut). Say if you want that costed.

## Left as is

Nothing was written to the sheet, citydata or city.html. `_needs-attention/hotel-links-pipeline-plan.md` still describes the original order; its section 6 (pilot) and section 9 (decisions) are superseded by this note.
