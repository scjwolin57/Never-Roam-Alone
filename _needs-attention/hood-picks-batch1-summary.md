# Hood picks batch 1 — task and output summary (for optimization review)

*Written 2026-09-22 after the tightened re-check pass. Nothing here has been loaded into the sheet or the site yet — a fresh 10% audit is still required before that. Spec: `_needs-attention/RESUME_hood-picks.md` in the never-roam-alone repo (main folder, not the worktree).*

## What this task is

Never Roam Alone (neverroamalone.com) is adding three neighborhood-card sections to its city guides — "Where to eat," "Coffee & takeaway," "Where to drink" — one venue pick per kind (up to 10 kinds per neighborhood: 3 eat, 3 coffee, 4 drink). First phase: the 412 cities with 500,000+ international visitors, 1,913 mapped neighborhoods, in batches of 25 most-visited-first. This is batch 1 (25 cities, Hong Kong to Taipei by visitor count).

Hard constraints from the project's rulebook: nothing is invented (an empty slot beats a guessed pick); every venue must come from a real business database (Google Places), never an agent's memory; a second, independent, un-briefed check on every batch; a 10% random audit before anything loads; Google API spend is gated (free allowance, then a capped trial credit, then stop); city data files are edited only by character span, never rewritten; no push without explicit approval.

## Pipeline as built

1. **Candidates** (`fetch_rank.py`): one Google Places Nearby Search per neighborhood per section (800 m radius), then one Text Search per kind still empty after that. Responses cached; every call counted against a per-month budget with hard stop-on-any-Google-error.
2. **Script checks** (built into candidate ranking): status OPERATIONAL, distance, primary-type match, quality bar (rating 4.2+, 100 reviews in cities / 25 in towns), global-chain name match, duplicate place ID. No judgment calls — pure filter.
3. **Pick agents** (5 cities each, parallel): choose one venue per kind from the filtered candidate list only, classify from the venue's own site, require a second source, safety-screen bars, write a note.
4. **Independent check** (separate agents, different city groupings, no visibility into step 3's reasoning): CONFIRMED / WRONG / UNVERIFIED per pick with evidence.
5. **10% audit** (a fresh agent, no visibility into anything above): re-verifies a random sample from scratch. One defect found → the whole batch is re-checked before anything loads.
6. **Sheet then site**: a new "Hood Picks" tab in the master spreadsheet is the source of truth; a loader script writes the three keys into each city's JSON file by character span.

## Numbers, end to end

| Stage | Count |
|---|---|
| Candidates surfaced (all cities, all kinds) | ~1,900 slots across 1,190 hood×section×kind combinations checked |
| Picks proposed by the 5 pick agents | 437 |
| Independent check: CONFIRMED | 308 |
| Independent check: WRONG | 88 |
| Independent check: UNVERIFIED (mostly search-budget exhaustion) | 41 |
| Survived to first "final" set | 258 (+ 21 Amsterdam picks held separately) |
| **First 10% audit result** | **6 defects in a 26-item sample (23%) → whole batch sent back** |
| Tightened re-check pass (rules added after the audit; see below) | 227 eat/cafes picks survive across 24 cities |
| Held bars run through an explicit scam/overcharging search | 39 of 40 pass, 1 fails and is dropped |
| Amsterdam (hood points were wrong; fixed, then run fresh end-to-end) | 35 picks |
| **Current total, script-clean, pending a fresh audit** | **301 picks across 25 cities** |
| Google Places calls spent | 781 of September's 1,000 free (plus 72 from the pilot); $0 of the $281 trial credit |

## What the audit found, and the rule changes it produced

The first 10% audit (26 items, all already "CONFIRMED" by the independent checker) found 6 real defects:
- 4 undisclosed local chains (venues with 2+ outlets, presented as if unique)
- 1 `local` pick that was really `casual` (a "multicultural menu" restaurant)
- 1 neighborhood-boundary miss half a kilometer outside the assigned hood

None of these were things the independent checker's instructions asked it to check explicitly (it checked existence, hood, kind, safety — but not chain-outlet count, and its `local`-kind check wasn't strict about "traditional only"). **Root cause: the brief under-specified two of the four rejection criteria.** Three new rules were added to the brief (chain-outlet count from the venue's own site, ≥2 = disclosed in the note or dropped; `local` = genuinely traditional only; hood fit = the address's own named district, not "nearby"), and every already-confirmed pick was re-run against them. That re-check pass is what produced the 6→ realized-in-practice drop rate: roughly 15-20% of "confirmed" picks across the re-checked cities needed a note fix, a kind change, or a drop.

## Process friction worth optimizing (this is the part for the next task)

1. **Agent self-delegation caused a large, hard-to-track fan-out.** Six "group of 5 cities" re-check agents were launched; several of them, instead of doing the WebFetch/WebSearch work themselves, called the Agent tool again to spawn one sub-agent per city. This produced ~20 concurrent agents from 6 launched, hit the platform's concurrency cap, and left two group-agents stuck in an unproductive "still waiting, I'll report back" loop that re-fired on every child completion without ever doing anything — burning ~100K tokens each before being force-stopped. **Two of the 24 cities were silently never covered at all** because their looping parent finished (or was stopped) before spawning them; this was only caught by explicitly diffing the expected city list against the files that existed on disk. Optimization: either (a) explicitly forbid sub-delegation in single-purpose agent prompts, or (b) always reconcile "expected outputs" against "actual files on disk" as a mechanical step rather than trusting agent self-reports.
2. **Worktree/main-folder path confusion cost real time.** This session runs in an isolated git worktree, but the task's actual data lives in a sibling "main folder" checkout. The Write tool silently redirects (or refuses) writes to the main-folder path depending on the tool, and several agents wrote their output into the worktree copy without noticing, or noticed and reported it as a flag for the user rather than fixing it themselves. At least 7 of ~30 agent runs needed a manual file copy after the fact. Optimization: give every spawned agent an explicit "verify your output file exists at exactly this absolute path, and if a write attempt redirected elsewhere, copy it over yourself before finishing" instruction — a couple of the later agents did this unprompted and it worked cleanly.
3. **The independent-check step under-covered bar safety.** Every independent-check agent ran short of its ~200-search web budget partway through and finished the rest via WebFetch on venues' own sites — which cannot surface third-party overcharging/scam complaints. Bars therefore got CONFIRMED with "safety search not run (budget)" caveats, and had to be pulled into a separate, later, explicit scam-search pass. Optimization: split "identity/hood/kind" verification (cheap, WebFetch-only) from "safety/reputation" verification (needs real search) into two passes from the start, so budget exhaustion degrades the cheap pass, not the safety-critical one.
4. **Two more misplaced-neighborhood-point cases surfaced downstream, not upfront.** Amsterdam's bad hood points were caught and fixed before this batch ran candidates. But Milan's Porta Nuova and Osaka's Tennoji showed the identical symptom (every candidate near the point actually named an adjacent, differently-named district) and were only caught city-by-city, after picks had already been proposed and rejected for "hood fit." Optimization: a cheap pre-flight check — for every hood point, do the candidates Google returns predominantly self-report an address containing that hood's own name? — would catch this class of error before spending pick-agent and check-agent effort on doomed candidates. (Milan/Osaka points have not been fixed yet; flagged, not yet actioned.)
5. **Visitor-count source mismatch (found earlier, still open).** The 412-city scope was built from `destinations.js`; `citydata/*.json` disagrees on the same figure for 741 of 893 cities, 75 of which cross the 500,000 threshold. Not a hood-picks-specific problem, but it determines which 412 cities this whole effort is even running against.
6. **Chain-rule enforcement was inconsistent in strictness across agents even after the rule was written down.** Some agents required an explicit outlet count from the venue's own "locations" page and dropped anything they couldn't establish; others accepted a plausible inference (e.g., "a flagship implies a chain, but the branch count is unknown" — kept anyway in one case, dropped in another for an identical situation). This wasn't caught by anything mechanical; it would only surface in a second audit.
7. **The scheduled-task handoff didn't work.** A one-time scheduled task was created to continue this work in a fresh session (to get a clean web-search budget). It fired, read the spec files, and then stalled for two hours with zero further tool calls and no error — never doing any of its assigned work. It had to be manually discovered (via the scheduled-task run list, not a notification) and stopped. Optimization: a scheduled task that goes this long with no activity should probably self-timeout or notify, rather than sit silently marked "running."

## Not yet done (next steps in the spec's own pipeline)

- A **fresh 10% audit** of the current 301-pick set, by an agent with no visibility into any of the above (required before anything loads — this is what the previous audit failure demands).
- If clean: `check_picks.py picks` (already run clean, see above), `load_picks.py stage` → sheet, `load_picks.py apply` → citydata by span, `load_picks.py parity`, a browser check of one city's `query_place_id` map link, commit by path.
- Milan (Porta Nuova) and Osaka (Tennoji) hood-point fixes, same treatment as Amsterdam.
- Batches 2–17 (cities 26–412), same pipeline, tightened brief.
