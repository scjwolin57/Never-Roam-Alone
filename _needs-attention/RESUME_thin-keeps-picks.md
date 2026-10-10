# Resume: picks for the thin-keep neighborhoods (waiting for Google's free calls, set 2026-10-10)

Jeff (2026-10-10): wait for next month's free Google calls; do not go past the $260 credit cap. A one-time reminder task (`hood-picks-thin-keeps-resume`) runs 2026-11-02 and only reports status and asks for a go.

## State on 2026-10-10
- 214 thin-keep neighborhoods stay. Cards filled (of stay, eat, coffee, drink): 1 card 112, 2 cards 57, 3 cards 32, 4 cards 13. Empty: 127 eat, 164 coffee, 191 drink. Each empty card shows "Picks coming soon" and the Suggest button.
- Done: retry pass (D) with Overture website addresses: 25 picks loaded. Press path (C) trial on 12 cities: 0 picks, about 44 searches (log in `hood-tourist-review-2026-10-08.md`).
- Google: about $14 credit left of the $260 cap (trial ends 2026-10-30); `fetch_rank.py status` shows the counter. About 56 hoods had empty Google pools; refetching them with a wider area is about 560 calls.

## How to resume
1. Check the status and the month's free allowance (`python3 _guidebuild/hoodpicks/fetch_rank.py status`). Ask Jeff before spending anything past the free allowance.
2. Tooling (gitignored, in `_guidebuild/hoodpicks/`): `nh.py` (env `NH_TARGETS=nh_targets3.json NH_WORK=nh3`), `nh_web_enrich.py`, briefs `NH3_BRIEF.md` (normal retry), `NH3C_BRIEF.md` (press path), `nh_fix2.py`, `nh_pre2.py`, `nh_merge2.py`, `nh_rekey2.py`. After any hood removal run `REINDEX_BASE=<commit before the removal> python3 reindex.py --apply` first, then rebuild `work/nh_targets3.json` with current hood indexes.
3. Pipeline per batch: todo, pick agents, gate, namecheck, independent checker, fresh audit, bar safety, merge, `check_picks.py`, `load_picks.py stage / apply / parity`, commit sheet and citydata together.
4. Lessons: a login-walled Instagram or Facebook page is UNVERIFIED (the same page loaded for one agent and not for another); Overture `web_alt` links are mostly dead or the wrong venue; a venue must be in the pool for that kind; names are copied from the venue's own page.

Open leads: Zgoda Cafe (Kraków; needs one dated 2025-26 guide), O Croissant Marafade (Faro; needs a 2025-26 article), Rock Bar Krug (Skopje; article bot-blocked), Fishi Sushi (Olomouc, Lazce), Anu's Cakes (Madurai; page last posted 2023, Jeff's call).
