# Hood picks takeaway: pizza by the slice, and a chain fallback (2026-09-26)

**Questions for Jeff:**
1. Add pizza by the slice to takeaway, with the rule below?
2. Allow a chain fallback in takeaway only? This changes the chain rule of 2026-09-23 (10 or fewer outlets, founded in the
   city). Recommended: national brands only, never global ones.

Both were measured on batch 4's empty takeaway slots. Nothing was picked or loaded from either measurement.

## 1. Pizza by the slice
"Pizza place" is Google's type for both seated pizzerias and slice counters. In the first test, 12 of 18 pizza places were
seated restaurants. So pizza can't come in on its type alone. It needs proof that slices are sold at a counter.

**Proposed rule:** a pizza place may fill `takeaway` when its own page or menu, a dated guide, or a Google review from the
last 24 months shows slices sold to go ("slice", "by the slice", "al taglio", "por porción", "de parado"), and the checker
confirms counter service. Everything else is as in section H.

**Measured** (42 Google details calls, $1.68):

| Step | Count |
|---|---|
| Pizza places in empty takeaway slots (4.0+, 50+ reviews) | 42, in 32 slots |
| A recent review mentions slices | 4 |
| Of those, seated pizzeria (Banchero, Buenos Aires) | 1 |
| **Likely picks** | **about 3**: Pizza Renzo and Papaya Slice (Playa del Carmen), Diamond Slice (Copenhagen) |

**Why so few:** real slice counters usually have fewer reviews and no website, and Google returns only 5 reviews per place.
It is cheap to add (about 4 cents per pizza place), but expect about 1 slot in 10 per batch.

## 2. Chain fallback
Today a chain may fill a slot only if it has 10 or fewer outlets and was founded in the city.

**Measured:**
- 19 slots had only chain candidates. All but 3 were global brands: McDonald's, KFC, Burger King, Wendy's, Subway.
- The pickers also turned down national or regional brands: Jollibee and Chowking (Manila, 4 slots); Kudu, Juice Time,
  Signature Juices and Tikkaway (Riyadh, 3 slots); Dürümle (Alanya); El Pechugón (Puerto Vallarta); Ricatti (Buenos
  Aires); Chicago Chicken City (Johor Bahru); MARGE (Tbilisi).

**Options:**
- **A. Keep the rule (no chains over 10).** The slot stays empty.
- **B. Recommended: a national-brand fallback, takeaway only.** Used only when no independent venue in the hood passes.
  The brand must be founded in the same country, like Jollibee in Manila or Kudu in Riyadh, and never a global brand.
  - The name is shown without the branch label, and the note says "National chain".
  - This would fill about 10 to 12 more slots in batch 4.
- **C. Any chain, global brands included.** This mostly adds McDonald's and KFC, which a guide reader does not need.
  Not recommended.

If you choose B, it gets a row in decisions.md amending the 2026-09-23 chain rule, for takeaway only.

## Related
Jeff plans a separate dessert / ice cream listing. That is a new city.html section, so it goes through the section 5.3
change protocol. It is logged in suggested-improvements.md. Ice-cream shops are kept out of takeaway until then.

**Answered 2026-09-26:** Jeff said yes to pizza by the slice and option B (national-chain fallback). Rules in decisions.md and CHECKLIST.md H2.
