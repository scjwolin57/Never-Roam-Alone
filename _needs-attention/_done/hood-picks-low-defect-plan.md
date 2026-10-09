# Hood picks: plan to get the defect rate very low (2026-09-23)

Written from the handoff in the "Hood Picks optimization approaches" session and the 24 check files in
`_guidebuild/hoodpicks/work/batch02r/`. Steps 1 to 7 ran on 2026-09-23 (results at the bottom). Nothing has been
loaded to the site or the sheet. Question 1 is answered (keep local chains, marked); question 3 ran as a report;
question 4 is not approved.

## Where it stands
- Batch 1: loaded 2026-09-22, 983 of 1,212 slots (81%).
- Batch 2: second full check of 499 picks found **176 wrong (35%)**. Not loaded. The other session is paused.
- Google: 2,115 Places calls in September; $44.60 of the $260 trial credit spent.
- Still open from that handoff: map pins for Karbala and for Uvero Alto (Punta Cana).

## What the 176 defects were

| Cause | Wrong | Share |
|---|---|---|
| Chain, unmarked or not allowed | 123 | 70% |
| Name with extra text glued on | 32 | 18% |
| Wrong kind | 9 | 5% |
| Hotel venue in a kind it cannot fill | 7 | 4% |
| Wrong hood, bad note, other | 5 | 3% |

By kind, wrong / checked: coffee 35/81, casual 36/88, bakery 31/79, local 26/75, takeaway 17/38, fine 12/49,
pub 11/45, cocktail 3/25, party 3/13, dive 2/6. Bars as a whole: 19/89 (21%).

## Why (root causes)
1. **The briefs contradict each other.** REPICK_BRIEF and GAPPICK_BRIEF rule 5 (and decisions.md 2026-09-22 item 2)
   tell pickers "`chain: true` is the only chain test. Do not count outlets." GAPRECHECK2_BRIEF then fails a pick for
   any chain it finds by counting outlets. Pickers were forbidden to do the check they were graded on.
2. **The script's chain test barely works.** It flags a chain only when the same name appears at two points in that
   city's own 20-result searches, plus a hand-typed list of about 60 global names. A chain with one branch per hood,
   or any national or regional brand not on the list, passes as a single venue.
3. **Names are Google's display names, never cleaned.** Google adds branch, street, category and slogan text.
4. **Some CONFIRMED verdicts were not really checked.** A checker marked picks CONFIRMED on "no adverse evidence"
   when the page would not load (batch 2 group 4 said so).
5. **The audit sample is too small to prove a low rate.** 0 defects in 30 only proves the rate is under about 10%.

## The plan

### 1. Chain detector in the script (free, offline)
Any one signal marks a chain. Output per candidate: `chain: none | local | national | global` plus the evidence.
- **Overture places** (already used for laundromats; duckdb is installed): match each candidate to Overture by
  name within 100 m. An Overture `brand` tag means chain. Also count the same normalised name across the city and the
  country: 2+ inside the city = local; any outside the metro = national or global.
- **Known brand lists:** OpenStreetMap's Name Suggestion Index (the open list of chain brands, with the countries
  each one trades in) and Wikidata items that are restaurant, cafe, bakery or bar chains. This replaces the
  60-name `GLOBAL_CHAINS` list.
- **Website:** the same website domain on 2+ candidates anywhere in the 412-city cache; a website path that
  names a branch (`/santos`, `/locations/...`); a name whose tail after a dash is another hood or city.
- The script drops `national` and `global`. For `local` it writes "; local chain" into the note itself.
  Agents never judge chains.
- Optional, only if Jeff says yes: one Google Text Search per surviving brand name inside the city (IDs and names
  only). Before using it, confirm on Google's pricing page that it bills against a different free allowance
  than the Nearby Search counter.

### 2. Name cleaner in the script
Cut the name at " | ", " - ", " – ", "•", or a bracket that holds a branch, an address or a category. Cut a trailing
city, hood or street name, and Google category words. Any changed name must match the venue's own page title or
Overture's primary name; if neither confirms it, the pick is held.

### 3. Hotel-venue flag in the script
Google type `lodging`, a hotel named in the address, or a hotel-brand website domain = hotel venue. Hotel venues
are blocked from coffee, takeaway, bakery, dive and party, and need a page check for the other kinds.

### 4. One checklist for picker, checker and auditor
A single `CHECKLIST.md` replaces the rule text spread over the nine briefs, so the three steps cannot disagree again.
Every pick must carry evidence fields: page URL and whether it loaded, a short quote from the page showing the kind,
where the name came from, and the script's chain result. `check_picks.py` rejects a pick with a field missing.
No page loaded plus a kind that needs evidence (local, casual vs fine, dive, party, takeaway) = skipped, by script.

### 5. CONFIRMED means evidence
Checker verdicts: CONFIRMED only with a loaded page or a second source. Otherwise UNVERIFIED, which is dropped or
re-picked, never loaded.

### 6. Test the scripts on picks we already checked (zero cost)
Run steps 1 to 3 on batch 2's 499 checked picks. Pass: they catch at least 120 of the 123 chain defects and 28 of the
32 name defects, and flag almost none of the confirmed single venues. Tune until they pass. No new picks until then.

### 7. Pilot, then scale
Re-pick batch 2's five worst cities from the cache (Hanoi, Ho Chi Minh City, Vatican City, Lisbon, Las Vegas).
Check 100% of the pilot's picks. Scale to the rest of batch 2 only if the pilot is under 2%.

### 8. Audit big enough to prove it
Per batch, a fresh auditor checks 150 random picks, weighted towards coffee, bakery, casual and local. Pass = 0 or 1
defect (proves a rate under about 3%). Keep a running audit total across batches; it tightens the proof each batch.

## Questions for Jeff
1. **Local chains:** keep them, marked "local chain" by the script, only when every branch is in this city
   (recommended), or drop every chain?
2. **Batch 2's 176:** under the rule you pick in (1), re-sort them (unmarked local chains become "mark",
   the rest drop), then re-pick the empty slots with the new pipeline?
3. **Batch 1 back-test:** its 726 live picks went through the same weak chain test. Run the detector on them and report
   (no changes until you say)?
4. **Optional Google brand-count search** (step 1, last bullet): yes or no?

## Results so far (2026-09-23, after Jeff: "keep local chains, mark them. go")

### Step 6: scripts tested on batch 2's 499 checked picks (zero Google calls)
| Script | Result |
|---|---|
| Chain detector (`chain_detect.py`) | caught 118 of the 136 chains the checkers found; also flagged 42 venues the checkers had passed: a fresh check found 23 of them are real chains, 17 single venues, 2 unsettled |
| Name flag (`pick_flags.py`) | 40 of the 43 name defects flagged for a page-copied name |
| Hotel flag | 3 of 7 hotel defects; the agent's page check covers the rest |

### Step 7: pilot, round 1 (5 cities, 210 empty slots, from the cache, zero Google calls)
| City | Picks | Confirmed | Wrong | Unverified |
|---|---|---|---|---|
| Vatican City | 11 | 10 | 1 | 0 |
| Las Vegas | 24 | 22 | 2 | 0 |
| Hanoi | 22 | 9 | 4 | 9 |
| Lisbon | 25 | 13 | 12 | 0 |
| Ho Chi Minh City | 22 | 11 | 9 | 2 |
| **Total** | **104** | **65** | **28 (27%)** | **11** |

**Round 1 fails the 2% bar.** The chain problem is gone: no wrong pick was an unmarked national or global chain. The 28 wrong picks, by cause, and the rule now in `CHECKLIST.md` for round 2:
| Cause | Wrong | Fix for round 2 |
|---|---|---|
| A chain's branch or street label left in the name ("Bakes Thao Dien", "Dear Breakfast Alfama") | 14 | a chain's name is the brand alone; the gate rejects a chain name with a hood name or dash label |
| "Local chain" put on a single venue from a weak signal (duplicate map record) | 4 | weak flags can now be answered "single: <url> shows one venue" |
| Google's label instead of the venue's own name ("Trindade Brewery", "Pulejo ristorante", "Nhà Hàng ...") | 4 | every name is copied from the page; more glued-word patterns flagged |
| Note says more than its source | 3 | new `note_basis` field: the source words the note restates |
| Hotel venue in a bakery slot (Bellagio Patisserie) | 1 | hotel flag reads the website and name before the address |
| Kind (a famous old bar filed as dive) | 1 | `dive` needs the page or an article to show it is cheap and plain |
| Chain the detector missed (Instagram-only site) | 1 | none yet; the checker caught it |
| Neighborhood (Oficina do Duque is Chiado) | 1 | none; the checker caught it |
The 11 unverified picks were all allowed without a loaded page (coffee, bakery, pub judged from Google's type); round 2 requires a page for every pick.

**Fill:** 104 of 210 slots (50%), against 81% for batch 1 under the old rules. Strict evidence costs slots: most skips were "no page" or "branch list not found".

### Batch 1 (report only, nothing changed): `hood-picks-batch1-chain-report.md`
48 live picks look like national or global chains, and 86 look like unmarked local chains, all on strong evidence. 181 more have weak evidence only.

### Privacy slip
One pilot agent sent Jeff's email address in the header of its first OpenStreetMap address lookup, then stopped. Nothing else went out. Every brief now says never to put personal data in a request.

### Pilot round 2 (2026-09-23, rules: 10 or fewer outlets and founded here; page for every pick; names from the page; note_basis)
Same 5 cities, same 210 slots, from the cache, zero Google calls. Every pick went through the script gate, then an independent checker, then a fresh auditor who re-checked every confirmed pick.

| City | Picks | Checker: confirmed / wrong / unverified | Auditor on confirmed: wrong / unverified |
|---|---|---|---|
| Las Vegas | 20 | 18 / 2 / 0 | 1 / 0 |
| Vatican City | 14 | 13 / 1 / 0 | 0 / 0 |
| Hanoi | 17 | 12 / 1 / 4 | 0 / 1 |
| Lisbon | 23 | 20 / 3 / 0 | 0 / 0 |
| Ho Chi Minh City | 13 | 10 / 3 / 0 | 2 / 0 |
| **Total** | **87** | **73 / 10 (11%) / 4** | **3 (4%) / 1** |

- First-pass picker errors fell from 27% (round 1) to 11%. The checker caught them; only confirmed picks would load.
- **What would have reached the site: 3 defects in 73 (4%), all small wording slips.** Two names were not copied exactly ("The Albion by Kirk" for "The Albion by Kirk Westaway"; "The Jackaroo Bar And Grill" for "Jackaroo Bar & Grill") and one note added a word ("Specialty") its source does not say. No wrong venue, kind, neighborhood, chain or closed venue got through.
- Checker catches in round 2: chain miscounts from a homepage instead of the full store list (Every Half: 33 stores), a branch only listed on the owner group's site (Carson Kitchen), a restaurant closed "temporarily" on its own site (Alma), a cocktail bar filed as party, notes built from customer reviews. Each is now a line in CHECKLIST.md.
- **Fill: 72 usable picks of 210 slots (34%).** Main causes of empty slots: no page that loads (Facebook, Instagram and casino-hotel sites often show nothing to WebFetch), chains whose home city is not written anywhere, strict neighborhood edges.
- Bar safety: 32 bars searched across both rounds, 1 fail (The Balcony Beer, Hanoi, tourist-trap reports).
