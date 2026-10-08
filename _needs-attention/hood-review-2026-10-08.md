# Neighborhood tourist-friendliness review (2026-10-08): result and open items

Jeff asked for every neighborhood in every guide to be reviewed for tourist-friendliness (multiple hotels, restaurants etc.), the
ones that fail removed, better candidates added with everything researched, never more than 5 per guide, most popular for tourists
wins. Definition: `_guidebuild/hoodscreen/DEFINITION.md`. Scripts and prompts: `_guidebuild/hoodscreen/` (gitignored folder).
Evidence for every removal, add and point fix: `hood-review-2026-10-08-evidence.csv`. First-pass verdicts: `hood-review-2026-10-08.csv`.
Decision row: `decisions.md` 2026-10-08.

## Result

| | Before | After |
|---|---|---|
| Neighborhoods | 4,004 | 3,554 |
| Removed | | 501 |
| Added | | 51 |
| Hood points moved | | 28 |
| Cities with 1 / 2 / 3 / 4 / 5 hoods | 0 / 29 / 93 / 188 / 583 (310 under 5, before the review) | 15 / 83 / 169 / 264 / 362 |

How it was done: Overture open-data counts within 800 m of each hood point (screen); a triage of all 893 cities; a web check of
1,156 contested verdicts (pass 2); a page-reading check of 396 cities (pass 3); a sourced research pass for every add (pass 4).
Every removal cites a source or a stated duplicate distance. The sheet read 0 differing cells after every commit. 24 commits, none pushed.

## Things to look at (all decided on thin evidence, easy to reverse)

Nothing here is wrong by a rule; each is a call a source did not settle.

| City | Call | Why it is open |
|---|---|---|
| Puebla | Cholula removed | A separate municipality 10 to 15 km out, treated as a day trip; very famous, 5 hotels listed |
| Puerto Plata | Sosúa removed | Separate municipality about 25 km east; a bigger tourist draw than the kept Costambar |
| Nuku'alofa | Kolofo'ou removed | Its point is 0.35 km from City Centre with identical counts; a guide treats it as a stay area |
| Dublin | Ballsbridge and Rathmines out, O'Connell Street and St Stephen's Green / Grafton Street in | O'Connell Street: one source no longer recommends staying there for safety |
| Chicago, Houston, Seattle, Hamburg, Cape Town | Wicker Park and The Heights out; Ballard out (Seattle now 4); Woodstock out; Altona stays | Swaps to fit the cap; Hyde Park stayed |
| Kyoto | Fushimi out, Station Area in | Fushimi Inari is a major visited site; judged a single site with few hotels |
| São Paulo, Cairo, Berlin | Itaim Bibi, Heliopolis, Neukölln out | Swaps for Avenida Paulista, Giza, Charlottenburg |
| Medellín | Sabaneta out | One guide recommends it as a quiet family base; separate municipality |
| Oxford | Headington and Cowley out, Cowley Road in | Cowley was a misplaced industrial suburb |
| Buenos Aires | La Boca kept | The first pass wanted it out for Microcentro |
| Antalya, Paphos, Ottawa, Banff, Kraków, Tromsø | Belek, Coral Bay, The Glebe kept; Lake Louise Village (50 km from the town), Nowa Huta (guide says avoid hotels there), Bjerkaker kept by default | No evidence either way |
| Windermere | Ambleside not added | A separate town 5 to 6 miles away; the Lake District's main hub |
| Denpasar | Seminyak and Kuta not added | They are in Badung and the site has no guide for either; Denpasar ends with 2 |

Weak adds (kept as the review decided): Honolulu Kakaako (no hotel found inside it), Port-au-Prince Turgeau (no page of its own,
no photo, tag and landmark empty; confirm the Marriott still operates), Saskatoon Broadway District (no hotels listed), Innsbruck
Igls (about 9 hotels), Doha Souq Waqif (0.45 km from Msheireb), Cape Town Green Point (point and sources cover De Waterkant),
Dublin O'Connell Street. Delhi Paharganj has sources that flag scams and women's safety.

## Open (not done)

1. **Fifteen guides now have 1 neighborhood** (Dijon, El Chaltén, Jasper, Jianshui, Kangding, Manzhouli, Puerto Natales, Qom,
   Shangri-La, Shaoxing, Turpan, Urganch, Ushuaia, Wuyishan, Zhangye) and 83 have 2. Nothing was padded. A candidate for any of them
   needs a verified source; none was found. Kano's Old City (Birni / Kurmi market) and Riyadh's Diriyah were suggested by agents
   but no verified coordinate or source was read, so they were not added.
2. **The 51 new neighborhoods have no eat / cafes / bars picks, no gyms and no laundromat lists.** Their eat / cafes / bars are
   empty lists. The hood-picks pipeline (Google Places) and the gym research fill them. Laundromat lists can be reloaded from
   Overture with `laundry/load_laundromats.py`. Not run.
3. **Lodging is empty or partial for many new hoods.** It only holds names a source classified by tier (Wikivoyage Sleep headings);
   no tier was price-checked on a booking site. 17 of 51 have no lodging.
4. **Search quota.** The session's WebSearch quota (200) ran out during pass 3. Pass 3 batches d16 to d32 and all of pass 4 rested on
   page fetches (Wikivoyage, Wikipedia, Commons) instead of searches, so many keeps are marked "evidence thin". A second source for
   those keeps (242 low-confidence keeps in the evidence file) should be searched when the quota resets. These keeps stay by
   the rule "no source, no removal", so the risk is a non-tourist neighborhood still listed, not a good one removed.
5. **Duplicate-looking hoods nobody ruled on** (points under about 0.6 km apart, not removed because no source says they are the
   same area): Nha Trang Tran Phu / Biet Thu, Gisenyi Centre / Kivu Beach, Port Louis City Center / Peace Avenue, Lviv Old Town /
   Halytskyi, Kyoto Gion / Pontocho, Beijing Chaoyang / Sanlitun, Zanzibar (three hoods within 0.7 km of Stone Town), Zurich Altstadt /
   Niederdorf, Toulon Vieille Ville / Le Port, Dahab Masbat / Mashraba, Kuşadası Grand Bazaar / Harbor, Funafuti Fakaifou / Senala.
6. **Two guides share the Prati name** (Vatican City and Rome); separate guides, no clash.
7. CLAUDE.md §3 rule 6 still says "5 neighborhoods" per city; the decisions row amends it. The rule text is for you to update
   (the file is held by another session).
