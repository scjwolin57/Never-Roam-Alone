# CSS Consolidation — master.css rollout (2026-08-28)

Linked `master.css` in all 23 pages and removed only the truly-redundant lines
from each page's inline `<style>` block. Every file was read fresh immediately
before editing, edited with small targeted find/replace operations (no
whole-file or whole-block rewrites), and verified with `git diff --stat` +
`python3 _guidebuild/checkjs.py` after every edit, per CLAUDE.md.

## Results table

| Page | Lines removed | Lines added | Syntax check |
|---|---|---|---|
| 404.html | 23 | 1 | PASS |
| admin.html | 23 | 1 | PASS |
| askaroamer.html | 37 | 1 | PASS |
| best-time-to-visit.html | 23 | 1 | PASS |
| blog-editor.html | 22 | 1 | PASS |
| blog.html | 38 | 1 | PASS |
| coming-soon.html | 20 | 1 | PASS |
| community.html | 26 | 1 | PASS |
| compare.html | 24 | 1 | PASS |
| contact.html | 26 | 1 | PASS |
| feedback.html | 26 | 1 | PASS |
| index.html | 12 | 2 | PASS (also carries the `--green` hex-fallback fix, see below) |
| itinerary.html | 26 | 1 | PASS |
| messages.html | 37 | 1 | PASS |
| post.html | 24 | 1 | PASS |
| privacy.html | 42 | 1 | PASS |
| profile.html | 31 | 1 | PASS |
| roamer.html | 45 | 1 | PASS |
| terms.html | 45 | 1 | PASS |
| trip.html | 22 | 2 | PASS |
| choose.html | 25 | 2 | PASS |
| cities.html | 24 | 1 | PASS |
| city.html | 30 | 14 | PASS (17 dedup removals + 9 targeted hex→var color fixes, see below) |

Confirmed via `git diff --stat` across all 23 files together: **23 files
changed, 39 insertions(+), 651 deletions(-)** — nothing else in the repo was
touched.

## Local overrides kept (intentional differences from master.css)

These were left exactly as they were on each page because their values differ
from master.css's defaults — deleting them would have changed that page's
rendered appearance. Grouped by the pattern that recurred across most pages,
with page-specific extras called out.

**Common pattern (appears on most of the 23 pages, values vary per page):**
- `:root` — several pages use `--maxw:1100px` instead of master's `1180px`
  (404.html, compare.html, post.html, choose.html, cities.html, trip.html);
  index.html and city.html also keep their own `--shadow` values
  (`0 12px 30px rgba(43,36,23,.18)` vs master's `0 10px 30px rgba(20,40,50,.12)`)
- `body` (base) — several pages set their own `line-height` (1.65/1.7 vs
  master's 1.6) or fold `font-family` directly into the base rule
- `h1,h2,h3` (base) — many pages use `Georgia,"Amatic SC",serif` or a
  duplicated `'Fraunces','Fraunces',...` stack instead of master's
  `'Fraunces',Georgia,serif`; several add `letter-spacing:.2px`
- `header.nav` — several pages use `background:rgba(246,241,231,.92)` instead
  of master's `rgba(236,226,204,.92)`
- `.nav-inner` — several pages use `padding:14px 22px` instead of master's
  `12px 22px`
- `.brand` — several pages' font stack drops `'Fraunces'`
- `nav.links a` (base) — several pages use `margin-left:26px` instead of
  master's `24px`
- `nav.links a.active` — several pages use `color:var(--green)` /
  `border-color:var(--green)` instead of master's `color:var(--teal);
  border-color:var(--coral)` (404.html, compare.html, trip.html, choose.html)
- `footer` (base) — text color varies (`#dfeee7`, `#fff`, vs master's
  `#dff1f2`), and padding/margin-top varies (`30px`/`40px`/`46px`/`50px`/`60px`
  extra margin-top, none of which master.css sets)
- `footer .brand` — color varies (`#b5492c`, `#fff`) vs master's
  `var(--brass-lt)`; several pages keep BOTH a base and an EXPLORER-block
  copy of this rule together (see "cascade-dependency" note below)
- `footer .foot-links` — some pages use `margin-top:12px;gap:20px` with no
  `flex-wrap` vs master's `margin-top:14px;gap:18px;flex-wrap:wrap`
- The old "square corners" block — most pages carry their own earlier,
  smaller/differently-grouped version of this pass (non-`!important` or a
  different selector list, missing `.tripscope-radio`). These were left in
  place as harmless redundant duplicates EXCEPT on choose.html and
  cities.html, where the old local block was confirmed deletable because
  master.css's `!important` square-corners rule already wins the cascade
  regardless — see choose.html note below.

**Page-specific extras:**
- **community.html, contact.html, feedback.html, profile.html** — the
  EXPLORER-theme decorative background SVG on these pages is missing the
  third decorative "compass ring" `<path>` that master.css's version has
  (2 shapes vs 3) — a real, if subtle, visual difference. Left untouched.
- **trip.html** — EXPLORER `body{}` background has only one decorative SVG
  layer (grid) and no second "compass rings" layer at all, and no
  `background-position:0 0,center`. Left untouched (deleting would add a
  visual layer that isn't there today).
- **blog-editor.html** — `.btn` (`font-size:.9rem`, `padding:11px 22px`) and
  `.card` (`border-radius:16px`, `padding:24px`, `margin-bottom:22px`) differ
  from master's base versions; both kept.
- **messages.html** — `.btn` is heavily page-specific (`inline-flex`,
  different padding/font-size/border-radius/transition); kept in full.
- **choose.html, cities.html** — `.brand`/EXPLORER `footer` use hardcoded hex
  (`#b5492c`, `#5c6933`, `#c99a45`) instead of the `var(--coral)`/`var(--teal)`/
  `var(--brass-lt)` master.css uses for the same resolved colors. Kept as
  literal-value overrides rather than assumed-equivalent, per the same
  standard as the `nav.links a.active` case.
- **choose.html** — separately carries its own "SQUARE CORNERS" block that
  sets `border-radius:0!important` on a different selector list — a
  page-specific pass, structurally unrelated to master's 3px pass, left
  completely untouched.
- **askaroamer.html, best-time-to-visit.html** — `footer .brand` base rule
  (`color:#b5492c` / `#fff`) has NO exact master.css equivalent (different
  literal value) and was kept; the EXPLORER-block duplicate immediately below
  it, which IS byte-identical to master's `footer .brand{color:var(--brass-lt)}`,
  was ALSO kept in these two pages specifically — because deleting it would
  let the differing base rule win the cascade instead, silently changing the
  rendered footer-brand color. Same "cascade-dependency" pattern recurred on
  privacy.html, roamer.html, terms.html, profile.html (for `h1,h2,h3` and/or
  `footer .brand`) and on city.html (for `footer .brand`, both instances kept
  since master.css links before the page's own `<style>` block and would
  otherwise flip which same-specificity rule wins).
- **index.html** — flagged, not fixed: `.tile{border-radius:0}` on this page
  now conflicts with master.css's `!important` square-corners rule (`.tile`
  is in that selector list at `border-radius:3px!important`). `!important`
  always wins regardless of source order, so index.html's blog tiles will now
  render with 3px corners instead of 0px — a genuine visual side-effect of
  linking master.css. Needs a visual-QA look / a decision on whether `.tile`
  should be removed from master's square-corners list or index.html's blog
  tiles should just adopt the square look like everything else.
- **best-time-to-visit.html** — flagged, not fixed: the page's own `.card`
  (photo cards for month picks) never set its own `padding`, so master.css's
  generic `.card{padding:30px 28px}` will now apply to those cards where it
  didn't before — possible unwanted-padding regression, needs a visual check.

## Special fixes made

**index.html** — `var(--green,#556B2F)` → `var(--green,#5c6933)` (brand-color
hex fallback fix), confirmed made.

**city.html hex→var color fixes** (9 targeted replacements, all confirmed via
grep before editing):
- `.food-item-tag.food-tag-drink{background:var(--coral,#C04020)}` → `var(--coral,#b5492c)`
- `.bar-name{color:#556B2F}` → `color:var(--teal)`
- `.bar-name:hover{color:#C04020}` → `color:var(--coral)`
- `.bar-kind{color:#556B2F}` → `color:var(--teal)` (same pattern, not in the
  original enumerated list but caught during the pass)
- `.lmk-pin{background:#556B2F}` → `background:var(--teal)`
- `.lmk-pin.is-active{background:#C04020}` → `background:var(--coral)`
- `.lmk-card.is-active{border-color:#C04020}` → `border-color:var(--coral)`
- `.lmk-card.is-lifted{border-color:#C04020}` → `border-color:var(--coral)`
- `.lmk-num{background:#556B2F}` → `background:var(--teal)`
- `.lmk-name{border-bottom:1px dotted #556B2F}` → `var(--teal)`
- `.lmk-name:hover{color:#C04020;border-bottom-color:#C04020}` → `var(--coral)` (both)
- `.lmk-big{border-left:4px solid #C04020}` → `var(--coral)`
- `.lmk-big-num{background:#C04020}` → `background:var(--coral)`

Four remaining `#556B2F`/`#C04020` occurrences in city.html were deliberately
**left untouched**: they're inside JS object literals (`ENG_META`, `SOLO_META`,
a cost-tier function — e.g. `c:"#556B2F"`), not CSS declarations, and were out
of scope for this pass.

## city.html — explicit risk verification (highest-risk file)

- `git diff --stat` showed **only** city.html changed, 14 insertions / 30
  deletions — no other file touched.
- `python3 _guidebuild/checkjs.py city.html` → OK, 0 errors, both before and
  after the hex-color fixes.
- **Ibiza check**: grepped city.html for "Ibiza" — only 1 match, inside
  `RESORT_STAY` (a JS city-name set), not guide prose. This is expected and
  correct: since the earlier City.html Split project, city.html is a shared
  ~234KB template and per-city guide content (including Ibiza's) now lives in
  `citydata/ibiza.json`, fetched at runtime — it was never expected to be
  embedded in city.html itself.
- Confirmed nav/brand/footer HTML markup (`<header class="nav">`,
  `<div class="nav-inner">`, `<a class="brand"...>`,
  `<nav class="links" data-site-nav>`, `<footer>`, `<div class="brand">`) all
  still present, unchanged counts.
- city.html has two `<style>` blocks; only the large one (nav/footer/EXPLORER
  theme region) contained anything master.css covers. The second small block
  near the bottom (`.hero-back-bar .back.back-itin`) is unique, unrelated CSS
  and was left completely alone.
- The `<link rel="stylesheet" href="master.css">` was inserted right after
  the existing font link(s) and before the `<style>` block, matching every
  other page.

## Problems / things not touched, and why

1. **index.html `.tile` border-radius conflict** (see above) — flagged for
   visual QA / a decision, not silently fixed.
2. **best-time-to-visit.html `.card` padding regression risk** (see above) —
   flagged, not fixed.
3. **community.html / contact.html / feedback.html / profile.html** missing
   third decorative background SVG path vs master.css's — a real visual
   difference between these pages and the rest of the site that predates this
   task; not something in scope to "fix" here, just documented.
4. Every page still carries its own pre-existing, slightly-stale local
   "square corners" pass (except choose.html and cities.html, where the old
   local block was confirmed to be a genuine no-op duplicate and removed).
   These are functionally harmless — master.css's `!important` version already
   wins — but each page still has a second, redundant copy of that logic
   sitting in its `<style>` block. Not deleted where doing so risked a
   selector-list mismatch; flagged here as low-priority future cleanup.
5. No pages needed a syntax-check fix-up loop — every edit passed
   `checkjs.py` on the first attempt except one self-caught mistake on
   best-time-to-visit.html (an edit accidentally also removed a
   non-redundant `footer .foot-links` rule; caught immediately via the
   `git diff --stat` line-count check and restored before moving on).
6. Nothing was skipped outright — all 23 pages, including city.html, were
   completed per the protocol.
7. No git commits or pushes were made; all changes are local/uncommitted,
   consistent with this project's standing workflow (Jeff pushes).

## Recommended next step

Do a visual pass (or ask Jeff to eyeball) on: index.html's blog tile corners,
best-time-to-visit.html's month-pick card padding, and choose.html's
`.tripscope-radio` pills (should now be square) before this gets pushed live.
