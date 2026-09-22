# Decide: what counts as "in the neighborhood" for a pick? (blocks loading batch 1)

*2026-09-22. Batch 1 is fully re-picked and checked (641 picks staged) but its second fresh audit found 5 defects in 35,
and 4 of the 5 are this one question. Nothing loads until you choose and one more audit under that reading is clean.*

The rule adopted after the first audit (2026-09-21) says: hood fit is the address's own named district; an adjacent
district is a skip, even 500 m away. Two readings of that rule produced different verdicts on the same picks:

**A. Visitor's area (what the re-check reviewers applied).** The hood is the area a visitor means by the name. A Google
address that uses a smaller official sub-district inside that area still counts as in. Examples that pass under A and fail
under B: The Shack on Surawong Rd (Google: Khwaeng Si Phraya, the sub-district next to Khwaeng Silom, but Surawong is
what everyone calls Silom); Leet coffee on Qiba Rd (Google: Al Khatim, a district on the Quba road); Kans' Coffee on
Konyaaltı Caddesi (Google: Bahçelievler, Muratpaşa). Under A, audit 2 has **1 defect in 35 (3%)**, which is a pass.

**B. Literal district name (what the auditor applied).** The district in Google's address must be the hood itself or a
name that means the same place. Any other name, even a sub-district inside the visitor's area, is out. Under B, audit 2
has **5 defects in 35 (14%)**, and by the same standard roughly 1 pick in 10 across the batch would need dropping,
mostly in cities whose addresses carry small official sub-districts (Bangkok khwaeng, Saudi districts, Istanbul
mahalle, Tokyo chome).

Trade-off: A keeps more picks and matches how the page describes hoods (Silom, Quba, Konyaaltı are areas, not
administrative units). B is mechanical and safer against "right venue, wrong neighborhood", the defect you flagged most
often, but empties the slots in exactly those cities.

**Recommended: A, with one tightening.** The reviewer must name the sub-district and say why it belongs to the hood, and a
sub-district that is itself one of the city's other five hoods is always out. That keeps the honesty of B where it
matters (a venue in another hood) without dropping venues for Google's naming.

Reply "A" or "B" (or your own wording). Then: one more fresh 10% audit under that reading, and if clean the batch
loads (sheet, then site, then commit).

Also open, from the same run: the `dive` kind. Google's "bar" type rarely identifies a cheap, scruffy bar, so dive
filled 12 of 110 slots even after the re-pick, and most dive candidates turned out to be cocktail or wine bars. Options:
keep dive and accept mostly empty slots; or redefine it as "local bar" (any unpretentious neighborhood bar that is not a
cocktail bar, club or pub), which the data can serve.


## RESOLVED 2026-09-22 — Jeff: "if the sub district belongs to the greater neighborhood it is allowed there"
Reading **A, with the tightening**, as recommended: a sub-district counts as inside the hood when it is genuinely part of
the area a visitor means by that hood's name; a sub-district that is itself one of the city's *other* five hoods is
always out, even if it is nearby.

Applied to audit 2's 5 defects:
- **The Shack** (Bangkok, Si Phraya vs Khwaeng Silom) — KEPT. Si Phraya is part of what "Silom" means to a visitor.
- **Leet** (Medina, Al Khatim on Qiba Rd) — KEPT. Al Khatim is on the Quba road, not one of Medina's other hoods.
- **Al-Rowaithi Bakery** (Medina, Ad Duwaimah) — KEPT, same reasoning as Leet: on the Quba side, not one of Medina's
  other named hoods.
- **Kans' Coffee** (Antalya, Muratpaşa) — DROPPED. Muratpaşa is itself Antalya's hood 3, a different one of the
  city's own five hoods, so the tightening rules it out regardless of reading A or B.
- **Frida** (Milan, Isola, picked as `dive`) — DROPPED, but this is a `kind` defect, not a hood-fit one (Frida is a
  cocktail bar by night per its own site). Separate from the A/B question; see the `dive` kind note below.

Net: 3 kept, 2 dropped (one hood-fit, one kind). The reviewer instruction going forward: name the sub-district and say
in one line why it belongs to the hood; if that sub-district is itself one of the city's other tracked hoods, it's out.

## The `dive` kind, and the Google Places fields question
Jeff asked whether more Google Places fields could help. They can, at **no extra cost**: this project's calls already
sit in the Enterprise + Atmosphere SKU because `priceLevel` alone puts a call there ($40/1,000, corrected from the
$35 assumed earlier — developers.google.com/maps/billing-and-pricing/pricing, checked 2026-09-22). `editorialSummary`,
`reviews`, and the `serves*`/`liveMusic`/`outdoorSeating`/`goodForGroups` booleans are all in that same SKU, so they
ride along in the same response for free. Added to `fetch_rank.py`'s field mask 2026-09-22, effective for candidates
fetched from here on (not retroactive to already-cached responses).
**Not yet done:** using those fields in `kinds_possible()`'s dive/party/cocktail/pub classification, or in the pick
brief. That is the concrete next step for the `dive` kind problem (12 of 110 slots filled, mostly wrong per the audit)
and belongs with whoever is running the optimization pass, so as not to duplicate work already in progress there.
