# Hood picks: "<kind> in <neighborhood>, <city>, <country>" search test (2026-10-19)

**Question for Jeff:** use the neighborhood-name search instead of today's per-kind gap search for the empty slots, and should a place whose Google address names the neighborhood count as "in the hood" even past 1.2 km from our point?

Jeff, 2026-10-19: "try that" (search with the neighborhood's name instead of a radius). Nothing was loaded; the raw results are in the session scratchpad only. Nothing in `_guidebuild/hoodpicks/` was changed and its cache was not written.

## What was run

- 10 neighborhoods picked at random from the 574 searched by a 1.2 km circle (no map boundary), one per city, each with 4 or more empty slots: Karen (Nairobi), Henveiru (Malé), Bugibba / St Paul's Bay (Valletta), City Center (Minsk), Vedado (Havana), El Mamsha (Hurghada), Sutera Harbour (Kota Kinabalu), Ngũ Hành Sơn (Da Nang), Muttrah (Muscat), Baixa (Porto).
- One empty kind per section in each neighborhood: 28 Text Searches, e.g. `coffee shop in Baixa, Porto, Portugal`, no location setting, one page of 20.
- Cost: 28 calls on the shared counter, about $1.12 (credit counter $363.92 to $365.04 of $385).

A result counts as **usable** when it is within 1.2 km of the neighborhood point (today's rule), passes the quality bar (4.2+, review minimum), has the right primary type for the section, is open, and has a website (the pick checks need its own page). **New** means no earlier search for that city had returned it.

## Results

| Search | Calls | Usable results per call |
|---|---|---|
| Today's per-kind gap search (all 1.2 km neighborhoods, from the cache) | 1,569 | 1.43 |
| **Neighborhood-name search (this test)** | **28** | **2.96** |
| For scale: today's section-wide searches (nearby / box) | 1,572 each | 5.7 to 6.4 |

New usable candidates for the empty slots: **22 from 28 calls**, but 13 came from one search ("traditional Portugal restaurant in Baixa, Porto": 15 new top traditional restaurants, e.g. Cana Verde 4.8/2,538, Lareira 4.6/5,406, Muro do Bacalhau 4.6/4,054, while that slot is empty today). The other 27 searches gave 9 new usable candidates (one every 3 calls): Five Sails and Marina Café (Sutera Harbour local), Lemongrass Seaview (Henveiru coffee), C'alma Coffee Room, My Coffee Porto, Cafetaria Mesa 325 (Baixa coffee), Once upon a time in Paris (Baixa party), Koffee Cafe and Sapori Cafe (Bugibba coffee). A candidate is not a pick: each still has to pass the own-page, chain, kind and audit checks.

## Two findings that matter more than the average

1. **Big districts: Google's neighborhood is not our 1.2 km circle.** For Ngũ Hành Sơn (Da Nang), all 60 results were 3.5 to 7.8 km from our point and so failed today's rule, yet 50 of the 60 had "Ngũ Hành Sơn" in their Google address. The name search finds that district's places; our distance rule throws them away. Counting "address names the neighborhood" as in the hood would change the hood-fit rule (decisions.md 2026-09-24 search area; the "reading A" hood-fit definition), so it is your call.
2. **Small or little-known names leak far.** For Hurghada, Muscat, Malé and Bugibba, Google matched loosely and returned places 10 to 157 km away. Those are thrown out by the distance check, but they were paid for. Where the name is not a well-known district, the name search is weaker than today's box search.

## Recommendation

- Use the name search for the per-kind empty slots in place of today's gap search (about twice as many usable results per call, no extra calls), most of all for "local", where it did best.
- Keep the box search for the section-wide pool: it stays the best yield per call.
- Decide whether "Google address names the neighborhood" counts as in the hood for districts larger than our circle. Yes would open large districts like Ngũ Hành Sơn. No keeps the 1.2 km rule, and the name search there gives nothing.
- The hood-picks session owns the scripts; nothing changes there until you say so.
