# Hood picks: dive test result (measured 2026-09-25, nothing changed)

**Question for Jeff:** the proposed dive rule (Google's cheapest price level PLUS the bar's own menu showing beer at or
below the city's typical price, OR a dated article or local guide calling it a dive/cheap bar) would fill only 2 of batch 4's
109 empty dive slots. Keep the current dive rule, adopt the proposal anyway, or change what the dive slot asks for
(recommended: see options below)?

## What was measured (batch 4, work/b4s/dive_test_out_a.json and _b.json)
| Step | Count |
|---|---|
| Empty dive slots | 109 |
| Slots with a bar Google marks cheapest (rating 4.0+, 25+ reviews) | 29 (86 bars) |
| ... of those bars with a real site of their own | 12 (the rest: no site, or the "website" is Tripadvisor, a directory or an unrelated business) |
| Own menu shows a beer price | 2 (1 at or below the city price, 1 above) |
| Dated article or local guide calls it cheap or a dive | 1 |
| Google's "dive bar" search returned it | 2 (both failed the other tests) |
| Own page contradicts dive (cocktails first, club, restaurant, show) | 7 |
| **Would pass** | **2 bars, 2 slots** |

The two: Brasserie Verschueren (Brussels, Saint-Gilles; Maes 25cl EUR 2.60 = USD 2.96 vs the city's 4.50, but the menu is
dated March 2024) and Barkowski (Copenhagen; listed in Mig og KBH's "10 cheap bars in Copenhagen", 2026-08-20, but its own
site calls it a sports bar). Near miss: Borgerkroen (Copenhagen), called a cheap classic bodega by VisitCopenhagen, undated.

## Why
Cheap, plain bars rarely have their own website, and almost never post prices. The dive slot fills only where the bar's
own page says "dive" or "cheap" (2 of 113 in batch 4's first pass, 2 more in the second look).

## Options
The card lists only the picks a hood has (city.html renders `bars` entries; an empty kind shows no line), so an empty
dive slot is invisible to readers; it only lowers the fill count.
1. Recommended: keep the rule as is. Dive fills only where the bar's own page shows it is cheap and plain; nothing is
   missing on the page.
2. Adopt the proposal: +2 slots per ~110 empty. Not worth an extra rule.
3. Merge `dive` into `pub` ("pub / local bar"): changes city.html's bar kinds, the sheet and the schema (the §5.3 change
   protocol) for little gain, since pub is already filled in most hoods.
