# Laundromats: what conflicts, and the three calls for Jeff

**SETTLED 2026-09-24.** Call 1: option B, with self-service highlighted. Call 2: no count,
show the list. Call 3: trim at the first divider. Done in city.html; see decisions.md.

Audit of every laundromat task, decision and file, 2026-09-24. Nothing was changed
except the false "Self-service" label (below), which is fixed but not yet committed.

## What is consistent (checked, no action)

| Rule (decisions.md 2026-09-18 / 2026-09-21) | Shipped |
|---|---|
| Up to 3 per neighborhood | 0 neighborhoods have more than 3 |
| Within 1 km of the neighborhood point | 0 listings further than 1 km |
| Dry cleaners and hotels excluded | 0 names match dry-clean/hotel words in 12 languages |
| Overture only, no Google API | Source column is "Overture Maps" on all 1,964 rows |
| Sheet and site move together | Laundromats tab 1,964 rows = 1,964 listings in citydata |
| Empty neighborhood says "None listed …, not "coming soon" | matches the 2026-09-21 wording |
| One vote per listing, keyed name+coordinates | matches decisions.md 2026-09-23 |

## Call 1 — how a listing's type is decided (the real conflict)

**The decision (2026-09-18)** says: Overture category `laundromat` → "Self-service",
`laundry_services` → "Drop-off & fold".

**The loader does something else**: it reads the *name* ("coin", "self", "laverie",
"コインランドリー", …) and leaves the type blank when the name doesn't say. Result:
**1,230 of 1,964 listings (63%) have no type**.

That blank then went two different ways:
- the **sheet** writes "Laundromat" for them;
- the **site** printed "**Self-service**" for every one of them — a claim the data
  does not make. (Fixed in the working copy: the site now prints a type only when
  the data has one. Not yet committed.)

Every one of the 1,228 blanks does have an Overture category (1,165 `laundromat`,
63 `laundry_services`), so either rule can be applied without new data or cost.

- **Option A — follow the decision.** Type comes from the category. All 1,964 get a
  type; sheet and site agree; nothing says "unknown". Cost: 1,165 listings would be
  called "Self-service" on the strength of a category alone, including attended shops
  whose names suggest otherwise.
- **Option B — keep the loader's rule, amend the decision (recommended).** Type only
  when the name says it, and the site prints "Laundromat" for the rest, exactly as the
  sheet already does. Nothing is claimed that isn't evidenced. 63% then carry no type.

## Call 2 — two different sources count the same thing on one card

The Laundry facts line reads, e.g. Lisbon: "Self-service laundromats: common · **110
mapped within 12 km**". That 110 is an **OpenStreetMap** count stored in the sheet
(`laundry.self`). Directly underneath, the Laundromats list shows the **Overture**
listings (Lisbon: 9). Two sources, one idea, side by side. It also produces plain
contradictions:

| Contradiction | Cities |
|---|---|
| Line says laundromats are "common" or "some", list shows none | 66 |
| Line says availability "none", yet listings are shown | 13 |
| Line says "common"/"some" but "0 mapped within 12 km" | 152 |

Options: drop the OSM number and count what we actually list; or keep the OSM number
but label it as OpenStreetMap's and stop showing it when it disagrees with the list.

## Call 3 — 66 keyword-stuffed names

66 listings carry names like Athens: "Self Service Laundry Athens / Coin laundry
Athens / Laundromat Athens / Launderette Athens / Laundry Athens" (107 characters).
They wrap and do not overflow, but they read badly. Trim at the first separator for
display, or leave the data as the source has it?

## Not a conflict, for the record

The 2026-09-18 row still says empty neighborhoods read "Laundromat list coming soon".
The 2026-09-21 row replaced that with "None listed for X in our open-data source",
and the site follows the newer row.
