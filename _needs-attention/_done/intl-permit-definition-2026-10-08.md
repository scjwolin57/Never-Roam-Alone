# "Int'l permit" row: a definition to approve before any value changes

*2026-10-08. The Car rental card's "Int'l permit" row (`transport.car.idp`, sheet column "Intl Driving Permit") has no written definition. Today it holds **89 different wordings** across 893 cities, and **54 of 232 countries** have cities that disagree with each other (China alone has about 20). The 2026-10-06 research found 84 places where the row contradicts government sources. Sheet and site match each other (parity 0), so both change together. Per CLAUDE.md §4.1 and §4.2, the definition comes first; no value is changed until Jeff approves it.*

## Proposed definition

**Name:** Int'l permit. **What it answers:** does a visitor need an International Driving Permit (IDP) to drive here, on top of a home licence? **Unit:** one of five fixed values, the same for every city in a country (a city gets its own value only where the rule differs inside the country).

| Value | Meaning |
|---|---|
| Required | An IDP must be carried with the home licence. |
| Recommended | The home licence is legally enough, but the source advises an IDP (rental firms or police may ask). |
| Not required | The home licence alone is accepted. |
| Local permit | A local temporary permit is also needed (usually bought on arrival or at the rental desk). |
| Not accepted | Foreign licences and IDPs are not valid; a local licence is needed. |

Any detail beyond the value (which IDP version, how long a licence is valid, where to buy the local permit) belongs in the "before you rent" popup, not in this row.

**Source and method (one method for all countries):** the US State Department country page, read for all countries at once from its official data feed (cadataapi.state.gov, 211 pages, each with its "last updated" date). Checked against the UK FCDO page; a disagreement goes to a needs-attention list, not into the data. The as-of date is stored per country.

## Three choices for Jeff

1. **Whose licence?** The rules differ by where the licence was issued (Spain requires an IDP for a US licence, not for an EU one). Options:
   - **A. US licence** (recommended): one consistent official source covers every country; the card label says so ("Int'l permit, US licence"). Passport-aware wording can come later, since the site already stores passports.
   - B. The strictest rule across US and UK licences.
   - C. Store US and UK values separately now and show the one matching the reader's passport.
2. **When the State Department page says nothing** (79 of 211 pages): use the country's own authority, then FCDO; if still nothing, show **"Recommended"** marked as a default in the data (`est`), never as a researched value. Or leave the row blank for those countries.
3. **The five values above:** keep all five, or merge "Recommended" and "Not required" into one ("Not required, recommended")?

## Approved 2026-10-08, and built (preview, not committed)

Jeff chose licence-aware display: the card's permit row follows the reader's first saved passport, or a "Licence from" dropdown (every country, plus Hong Kong and Macau). All five values; "Recommended" as the flagged default when no government says anything. Researched: US, UK, Canadian and Australian licences. Everyone else: a worked-out answer, labelled.

**What the research found (233 destinations × 4 licences):**

| Licence | Source | Destinations with a value | Silent / unclear |
|---|---|---|---|
| United States | US State Department (cadataapi.state.gov feed, 211 pages) | 95 | 138 (most State Dept pages say nothing about permits) |
| United Kingdom | UK FCDO (gov.uk content API, 226 pages) | 204 | 29 |
| Canada | Government of Canada (travel.gc.ca, 230 pages) | 219 | 14 |
| Australia | Smartraveller (180 pages, read in the browser) | 169 | 64 |

Nothing at all from any government: Bhutan, Libya, Somalia (they show the flagged default). Each value carries the source's own sentence (checked word for word) and the page date. Territories with their own driving rules no longer borrow the parent country's page (30 values cleared, e.g. Anguilla, Bermuda, Faroe Islands); France's overseas departments, Åland, Svalbard and the Vatican keep their parent's rule.

**Treaty data:** UN Treaty Collection, 1949 convention 103 parties and 1968 convention 91 parties, both matching the UN's own totals. Hong Kong and Macau are covered by the 1949 convention (UN notes: extended to Hong Kong in 1961; China notified it applies to the Macao SAR).

**Disagreements worth a look** (each government is right for its own licence, so these stay as they are, but they are the cases most likely to confuse):
- Ethiopia: US says US licences are not valid; UK says a UK licence works for 2 weeks; Canada says licence plus IDP for 45 days.
- Cambodia: UK "Recommended"; Canada says a Cambodian licence is needed; Australia "Required".
- Solomon Islands: UK licence fine for 4 months; Canada says get a local licence; Australia "Required".
- Turkey/Türkiye: US says a US licence alone is fine for 180 days; UK requires the 1968 permit or a notarised translation.
- Armenia: US says US licences are not valid (no word on the IDP), left blank for US.

**Judgement calls applied the same way everywhere:** Canada's "You should carry an IDP" = Recommended; the UK's "hire car companies often ask for an IDP" line = Recommended; "an IDP or an official translation" = Required.

**Still to do once Jeff approves the preview:** write the "Driving Permits" tab to NRA-MASTER.xlsx (one row per destination: four value / quote / source / date column groups) and build `driving-permits.js` from it; retire the old per-city "Intl Driving Permit" column and `transport.car.idp`; schema, add-city and inventory updates; commit and push.
