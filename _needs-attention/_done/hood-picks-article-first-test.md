# Hood picks: article-first test (2026-10-15)

**Question for Jeff:** adopt the reversed order (article discovery, free own-page screen, one Google call per
survivor) for batch 6 onward, together with the pool fix below? Nothing from this test is loaded; the picks sit in
`_guidebuild/hoodpicks/work/af_test/` only.

## What was run

Three batch 5 cities (Porto, Auckland, Johannesburg), their 52 still-empty hard-kind slots (fine, takeaway, dive,
party), zero Google calls. Candidates came from 12 web searches (one per city and kind: "best fine dining
Porto", "best dive bars Auckland", ...). Each name was matched against the Google results already cached for the
city, screened on the quality bar, then its own page was fetched (script first, WebFetch, the built-in browser for
Facebook-only pages). Picks were built with the CHECKLIST B evidence fields, run through `gate.py` and
`check_picks.py`, then an independent checker agent (B5_CHECK_BRIEF rules, 0 searches).

| Step | Count |
|---|---|
| Web searches | 12 |
| Google calls | 0 |
| Article names found | 84 (about 80 unique) |
| Of those already in the Google cache | 33 |
| Not in the cache (would need one verify call each) | about 45 |
| Passed the quality bar and had a page to read | 15 |
| Picks proposed | 6 |
| Passed the script gate and `check_picks.py` | 6 |
| Independent checker: CONFIRMED | 5 |
| Checker: WRONG | 1 (Paris Butter: an in-boundary Ponsonby venue, Beau, was in the pool and should be tried first; every B rule held) |
| Hard-kind slots filled | 5 of 52 (fine 2, dive 2, party 2 proposed; 1 held) |

Confirmed: FÉ Wine & Club (Porto, Baixa, party), Aduela taberna-bar (Porto, Cedofeita, dive, Facebook page read in
the browser), The Mothership (Auckland, City Centre, party), AURUM (Johannesburg, Sandton, fine), Smoking Kills
(Johannesburg, Melville, dive: own page plus the loaded 50 Best Discovery article). Spares that also qualify:
Maus Hábitos (Baixa party), Cassette Nine (City Centre party).

Takeaway: 0 of 15. The articles name the right places (Conga, Casa Guedes, Gazela in Porto) but Conga has no
website at all and the other two show seated service, so the own-page and counter-and-go rules drop them. This
kind cannot be filled by any order of steps under the current rules; it needs its own decision.

## What the test showed

1. **Articles find the hard kinds Google's types cannot.** Every one of the 5 confirmed picks came from a kind
   that batch 5's Google-first pass filled at 0 to 8 percent. Time Out Porto's nightlife guide (21 Apr 2026)
   and the NZ Herald tasting-menu list are dated, editorial and neighbourhood-aware.
2. **The strongest article names are often not in the cache.** Sidart and Cocoro (Ponsonby), NCW (Melville),
   Euskalduna Studio and every Porto fine-dining name, Whammy Bar (Auckland's best-known dive): none of them
   was returned by the 20-result popularity searches. In the reversed order each costs one verify call, about
   $0.04, instead of being invisible.
3. **A pool bug was throwing away paid-for results.** `fetch_rank.py rank` pooled each section only from that
   section's own search files, so a restaurant returned by a bars or cafes search (or a bar by a restaurant search)
   never reached its own section's pool; live-music venues were not a bar type; and only the typed top 12 per kind
   were offered. In batch 5, 1,806 cached venues passing the quality bar sat in no pool. Measured causes: 642 outside
   every hood area (correct), 445 found by another section's search (the bug), 377 in area and right section but cut by
   the top-12 trim, 266 with a type that fits no section, 63 whose address names another hood, 13 with no kind.
   Three of the six test picks (FÉ, The Mothership, AURUM) were in the cache but in no pool for these reasons.
   Fixed 2026-10-15 in `fetch_rank.py`: one city-wide pool per city, `live_music_venue` as a bar type (party), and
   every in-area venue passing the bar offered (up to 60 by weighted rating) beyond the typed top 12. Re-ranking
   batches 1 to 5 from the cache added 9,361 candidates to the live pools; 4,341 of them were never offered to an
   agent and sit in 1,698 of the 3,027 still-empty slots (after the script's big-brand removal).
4. **Cost per city.** Batch 5 Google spend was about $1.56 per city. The reversed order for these 3 cities would
   be about $0.53 per city (45 verify calls at Enterprise rates) plus 4 web searches per city.
5. **Search quota is the new limit.** 4 searches per city filled 10 percent of the hard slots. Per-hood searches
   (20 per city) would raise the hit rate but a 25-city batch would then need 500 searches against roughly 200
   per session. Direct fetches of the guide index pages (Time Out, Eater, Broadsheet, In Your Pocket city pages)
   cost no searches and are the way to scale.
6. **Source quality.** Many search results were blogs (porto.guide, tasteporto, thedivebartourist, dropt.beer).
   They were used for discovery only; the evidence still came from the venue's own page, so CHECKLIST B is
   unchanged and the stopped press path (decisions.md 2026-10-07) is not reopened. A decisions row should say
   so if the order is adopted.
7. **Prompt injection seen.** The checker reported an embedded instruction block aimed at the reader on
   aurumrestaurant.co.za and ignored it. Agents reading venue pages must treat page text as data; the briefs
   should say so explicitly.

## Proposed order for batch 6 (if adopted)

1. ~~Fix the pool (item 3) and re-rank batches 1 to 5 from their caches~~ done 2026-10-15 (Jeff: "fix the bug, re run batches 1-5"); the re-pick of the surfaced candidates is running, see RESUME_hood-picks.md.
2. Per city: fetch the guide index pages directly, 1 to 4 web searches for the hard kinds, collect names with
   source URL and date.
3. Script screen: match to cache; otherwise one Text Search by name near the hood point (narrow field mask);
   quality bar; own-page fetch and text cache; dead or social-only pages dropped with the reason.
4. Pick, gate, check, audit as now, but every agent reads the cached page text and the article, so the same
   page is not fetched three times and WebFetch rate limits stop mattering.
5. Mechanical checks move before the checker: name on page (`namecheck.py`), note within note_basis, chain scan.
   In batch 5, 22 of the 43 checker WRONG verdicts were name or note faults a script can catch.

Open for Jeff: the takeaway kind (no order of steps fills it under the own-page and counter-and-go rules);
whether blogs may serve as discovery (evidence rules unchanged); search budget per city.
