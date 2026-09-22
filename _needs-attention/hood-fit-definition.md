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
