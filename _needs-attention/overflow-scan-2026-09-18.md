# Overflow scan, 2026-09-18

Every public page was loaded at 8 widths (320, 360, 375, 414, 768, 1024, 1280, 1440). The scan measured three things:

- anything wider than the screen (the page scrolls sideways)
- anything that sticks out of its card or box
- any text cut off with "…"

Then I opened every popup on the city guide (17 kinds), the menu, the sign-in popup, the language menu, the bucket-list popup on choose.html and the two share popups on itinerary.html. I ran the phone widths again in French, because translated text is longer.

Nothing was changed. Each item below needs your yes before it is fixed.

## Question for Jeff

Fix all 8 items below, or only some? Reply with the numbers.

**Note, 2026-09-19:** the scan ran on the main folder, which was 7 commits behind the live site. Those 7 commits (another session's phone-width and footer fixes) already fixed two more phone overflows the scan did not report: the "How long should you stay?" line that never wrapped, and the cost-card info tooltip. Both widened the city guide on phones and pushed the back-to-top button off-screen. On 2026-09-19 the CSS behind items 3, 4, 5, 6 and 8 was checked in the live code and is unchanged, so those are still open. Item 7 (French nav) needs a re-check, because nav.js changed in those commits.

**Rule change, 2026-09-19:** every width must now *look right*, not only avoid overflow (CLAUDE.md §6). This scan only measured overflow, clipping and sideways scroll. The rule calls for a visual check at 320, 360, 375, 390–430, 768 and 1280+ as well, which this scan did not do.

## Findings, worst first

| # | Page | Screen sizes | What happens | Likely cause |
|---|---|---|---|---|
| ~~1~~ | ~~media-kit/index.html~~ | | **Dropped 2026-09-19, per Jeff: the media kit never needs to be shown on the site.** It stays reachable by direct link (not linked from any page, noindex). | |
| 2 ✅ | city.html, Ferry / boat ports popup (seen on London) | 320, 375 | The popup scrolls sideways by up to 174px. The operator line ("sails from Dover, ~1h40m by train from London…") is on a single line that does not wrap. | `.rt-op` has `white-space:nowrap`. |
| 3 ✅ | compare.html, "Do I need a visa?" box | 320, 360 | The country dropdown is wider than the screen. The page scrolls sideways by up to 52px. | `.visa-panel select{min-width:260px}` plus its padding. |
| 4 ✅ | itinerary.html, trip tabs (Current & Upcoming / Wishlist / Past trips / Favorites) | 320 (21px in French) | The four tab buttons run off both edges of the screen. | `.trip-toggle` is one row that does not wrap. |
| 5 ✅ | city.html, daily cost row (seen on San Cristóbal de las Casas) | 320 | The "High-end" cost box sticks out 5px past the screen edge. It happens when the local-currency figure is long (pesos). | `.csnap-day` boxes cannot shrink below their text width. Cities with long currency figures will all hit this. |
| 6 ✅ | city.html, "Where to go out" bar labels (seen on London) | 768 and wider (tablet, desktop) | "DIVE / LOCAL BAR" is cut to "DIVE / LOCAL…". Phones are fine: the label stacks there. | `.bar-kind` is fixed at 104px with ellipsis. |
| 7 ✅ | index.html (and every page with the nav), French only | 320 | The menu button is pushed 5px off the right edge, because "Français" is wider than "English" in the language box. | Nav row has no room left at 320 in French. |
| 8 ✅ | askaroamer.html, category list | 320 | The count badge sits 2px past the right edge of its button. Barely visible. | `.cat-count` min-width plus padding. |

**2026-09-19: items 2 to 8 fixed** in the worktree `../nra-overflow-fixes` (branch `overflow-fixes`, based on origin/main), not committed yet. What changed:
- 2: operator line wraps. 3: visa dropdown is full width, up to 300px. 4: trip tabs become a 2 x 2 grid at 520px and below.
- 5: at 400px and below, the three daily costs stack as rows (label left, amount right).
- 6: bar labels are 168px wide, so every label fits on one line from 540px up (they already stack on phones).
- 7: the tagline under the logo is slightly smaller at 360px and below, so the menu button fits in French.
- 8: long category names (e.g. "Las Palmas de Gran Canaria") wrap instead of pushing the count out.

Checked in the phone emulator at 320, 360, 375, 414, 768 and 1280, on compare, itinerary, askaroamer, index (French), and city.html for London, San Cristóbal de las Casas and Hanoi. Result: no sideways scroll, nothing sticking out, no cut-off labels at any width.

The "Easy to get by in English" line was already fixed on the live site by another session, so my earlier main-folder edit was taken back out.

## Clean (no overflow found)

index, cities, 404, best-time-to-visit, blog, choose (incl. bucket-list popup), community (both forms), contact form, feedback form, privacy, terms, top-visited, underrated-picks, trip, roamer, post, country-map (Bosnia and Herzegovina), and city.html for Lisbon, London, Las Palmas de Gran Canaria, Santa Cruz de la Sierra and San Cristóbal de las Casas apart from items 2, 5 and 6. The menu, sign-in popup, language menu, event submit form, Traveler's Take form and contribute-a-photo form were clean too.

## Not covered

- **Pages behind sign-in** (profile, messages, admin, blog-editor, and the signed-in view of trip and itinerary): only their signed-out state was tested. I cannot sign in. To check them, sign in in the preview and ask me to re-run.
- **Print pages** (media-kit/print/copy.html, fact-sheet.html) are fixed A4 layouts, 793px wide, made for PDF, so they overflow any phone by design. copy.html also has one long link that runs 666px wide. Flag only if these are meant to be read on phones.
- **City data:** 5 of 893 cities were tested. Items 2, 5 and 6 depend on the data, so other cities with long route text, long currency figures or long bar labels will show the same problems. The fixes are CSS, so fixing them fixes every city.
- Spanish, Italian and Chinese were not run separately. French is the longest of the four and was run.

## Seen in passing (not overflow)

- compare.html: the closed city dropdown cut off long names on phones (39 of 893 at 320px, about 7 at 375px). **Fixed 2026-09-19 (option C, Jeff):** when the chosen name doesn't fit, it is shown in full on a line under the dropdown. Nothing changes on tablet or desktop. In the `overflow-fixes` worktree, not committed.

~~Rounded corners over the 3px limit~~ Not a problem (checked 2026-09-19): `.visa-panel`, `.trip-toggle button` and `.csnap-day` are squared by each page's override block further down, and the screenshots show square corners. The media kit cards (6px) are off-site.

---

## Full re-scan, 2026-09-19 (live site, signed in as Jeff, phone emulator)

**Covered:** 24 pages (every public page plus profile, messages, My Travels, trip, blog editor, admin with all 7 tabs, a Roamer profile) at 320, 360, 375, 414, 768 and 1280. 31 hard-case city guides at 320 with every info popup opened (longest names, longest country names, biggest currency figures, longest neighborhood and landmark names, most routes and bars). Only view-only clicks were used (admin tabs, info buttons); nothing was saved, sent or deleted.

**Ran on the live site, so fixes 2 to 8 were not in it.** Those showed up again as expected: ferry, train and bus popups (fix 2, now seen on 14 of 31 cities: Split, Vienna, Ulaanbaatar, Santa Cruz de la Sierra, San Cristóbal and others), cost boxes (fix 5, now seen widening the whole page on Kinshasa, Da Lat, Jakarta and Tehran), the visa dropdown (3), the trip tabs (4), the Ask a Roamer count (8).

### New findings, worst first

| # | Page | Screen sizes | What happens | Likely cause |
|---|---|---|---|---|
| 9 ✅ | city.html, Fast facts: religion and language rows | 320 to about 414 | A long religion or language name pushes its percentage off the card, and on some cities off the screen. Tehran is the worst: the page becomes 396px wide on a 320 screen ("Other (Christian, Jewish, Zoroastrian…)"). Also Kingstown ("Protestant (various denominations)", +11px), Kinshasa, Kanchanaburi ("Northern Thai (Kham Mueang)"), Asunción, Santa Cruz de Tenerife. | `.lang-name` has `flex-shrink:0` and a 110px minimum, so a long name can't wrap. |
| 10 ✅ | itinerary.html (signed in), trip table | 320 to 414 | The "NIGHTS" column heading is cut to "NIGHT". | `th.tnights` is `nowrap` in a 14% column inside a box that hides overflow. |
| 11 | profile.html (signed in), travel map "Add a place" row | 320, 360 | The "ADD" button sticks out past the card's right edge (15px at 320, 4px at 360). | The input and button sit on one row with no room to shrink. |
| 12 | cities.html, city cards | 320, 360 | One-word long city names spill past their column next to the Favorite heart: "Siddharthanagar" at 320, "Thiruvananthapuram" at 360. | The name can't break and the heart column is fixed. |
| 13 | city.html, food & drink popup, photo credits | all phone widths | Photo credits are cut off with "…" (e.g. "Mauricio Giraldo from Bogotá, …", "Korea.net / Korean Culture and…"). Seen on 16 of 31 cities. **Question for Jeff:** some licences (CC BY) require the credit to be shown in full; cutting it may not meet the licence. Wrap to two lines instead? | `.food-item-credit` is `nowrap` with ellipsis on purpose. |
| 14 | city.html, food & drink popup, dish names | 320 | A long dish name plus the "DISH" tag spills its box by up to 12px (Kaiserschmarrn on Vienna and Garmisch, Käsespätzle on Konstanz). | Dish name and tag on one line. |
| 15 | city.html, Marrakech bus popup | 320 | The note under the routes doesn't wrap; the popup scrolls sideways 23px. | Long unbroken text in `.rt-note`. |
| 16 | city.html, section headings ("PLATE 01 · SEASON & DURATION") | 320 | The heading runs 8px past its row and ends 6px from the screen edge, so it looks off-centre. | `.plate .tag` is `nowrap`. |
| 17 | city.html, hero | 320 | The "Contribute a photo" button overlaps the bottom of the "Annual int'l visitors" box. | Both are placed at the bottom-left of the photo. |
| 18 | city.html, neighborhood names on photo tiles | 320 | "Partnachklamm / Kreuzeck Area" (Garmisch) runs 4px past its tile. | Long neighborhood name. Low. |
| 20 | itinerary.html (signed in), add-a-city row | 320 | The round "+" button next to the search box is cut off by the card's right edge. Fine from 360 up. | Search box and button on one row with no room left. |
| 19 | roamer.html | 320 | Jeff's website button fits, but it sits 8px past its row. A longer web address from another member would spill. Low. | Button text can't wrap. |

### Checked and fine (false alarms)

- Blog editor: the save bar is meant to run edge to edge.
- My Travels: the band behind each trip is meant to run edge to edge.
- Admin at 1280: the scroll bar appearing and disappearing between tabs, not real spill.
- Every city's neighborhood carousel sits 4px past its box. It scrolls sideways by design and looks fine.
- Clean at every width: index, 404, askaroamer (apart from 8), best-time-to-visit, blog, choose, community, contact, feedback, privacy, terms, top-visited, underrated-picks, country-map, messages, trip, admin.

### Not covered

- 862 of 893 city guides were not opened; the 31 were picked for the hardest data. Items 9, 12, 13, 14 and 15 depend on data, so other cities will show them too. The fixes are CSS, so one fix covers all.
- The 31 cities were run with popups at 320 only. The page-level checks at the other widths were run on the non-city pages.
- post.html: there are no published blog posts to open yet.
- Forms were opened and measured, never submitted.

### Done 2026-09-19 (in the `overflow-fixes` worktree, not committed)

- **9:** per Jeff, a catch-all is just "Other". 12 rows changed, site and sheet together (decisions.md row; religion parity checked on all 893, 0 mismatches). Long names that remain, like "Protestant (various denominations)", now wrap instead of pushing the % off. Checked Tehran, Kingstown, Kanchanaburi and Kinshasa at 320, 375, 768 and 1280.
- **10:** the date range was already its own full-width row. Per Jeff, the right padding on City and Country is tighter and Nights gets the space (22% of the table instead of 14%). "NIGHTS" fits from 320 to 1280, checked on Jeff's own trip.

### Found while fixing 9

- **Rain figures in 253 cities are impossible** (more than 92 rainy days in a quarter; probably millimetres). Kingstown shows "67 days/mo". See `rain-days-wrong-unit.md`.

### 2026-09-21: suggested fixes for 12 to 19, shown to Jeff (in the `overflow-fixes` worktree, not committed)

The worktree was moved onto the latest origin/main first (4 new commits: shared header and footer, profile travel map); fixes 2 to 10 were re-applied and the 12 sheet cells re-done (religion parity 893/893).

- **7:** no longer needed. The new shared header already fits a 320px phone in French (menu button ends at 314px). My header change was dropped.
- **12:** city names with a single word of 14+ letters (Quetzaltenango, Siddharthanagar, Thiruvananthapuram) shrink with the screen on phones; all others unchanged. All 893 cards fit at 320 with no word split; desktop unchanged.
- **13:** photo credits wrap in full instead of "…".
- **14:** on phones (400px and below) each dish shows its photo on top and the text full width, so long names (Kaiserschmarrn, Kaesespaetzle) fit whole.
- **15:** route notes wrap long web addresses. (The addresses are plain text, not links: separate content question.)
- **16:** section headings wrap onto two lines on phones.
- **17:** extra space under the city hero text, so "Contribute a photo" sits 14px below the visitors box instead of on top of it.
- **18:** neighborhood tile names get a little more room on phones; "Partnachklamm / Kreuzeck Area" now fits on two lines without splitting the word.
- **19:** a long web address wraps inside its Roamer profile button.

### Data problems spotted while previewing (not changed)

- Garmisch-Partenkirchen food popup: the "Alpine trout" photo shows lobster with asparagus.
- Garmisch-Partenkirchen food popup: a credit reads "Xocolatl ( talk ) 23:16, 26 August 2013", a Wikipedia talk-page signature copied in as the author.
- Marrakech bus note: web addresses typed into the text in brackets instead of as links.

### 2026-09-21: Jeff's answers on 12-20 (relayed from the "Profile page country/city search" session), built in the worktree

Worktree moved onto origin/main e9ab316c first; all earlier fixes re-applied cleanly; the 12 sheet cells redone (religion parity 893/893).

- **12, 13, 19:** yes. Built as previewed.
- **14:** preview requested. Phone layout (photo on top, text full width) shown at 320 and 375. Waiting for his yes.
- **15:** "make clickable links". Route notes now show every bracketed web address as a short link to the operator's site ("ALSA (alsa.com)"), in the popup only. That covers all 682 addresses in 398 cities (530 bus notes, 100 train, 49 ferry). The data and the sheet are unchanged, so parity holds. Plus the wrap fix.
- **16:** plate 01 now reads "PLATE 01 · DURATION" (it only holds "How long should you stay?"; the season card is in plate 02).
- **17:** hero visitors box padding 6px 14px → 4px 10px, tighter letter spacing on phones; "visitors · est." kept together so it no longer leaves "· EST." alone on a line. Box at 320: 78px → 55px tall (without "est."). "Contribute a photo" still clear below.
- **18:** tile names are centred; a small script shrinks each name until its longest word fits whole (Sachsenhausen on the 107px tablet tiles) and sits it 6px above the photo credit, which can wrap to two lines (Bornheim, Westend). Checked on Frankfurt am Main and Garmisch at 320, 375, 768 and 1280.
- **20:** approved by Jeff and done by the "Profile page country/city search" session in the main folder's itinerary.html (search row input min-width:0, plus trip-card tweaks). This worktree must rebase onto main after that commit, before committing.
- Data items A (Garmisch trout photo) and B (Garmisch "Xocolatl ( talk )" credit): no answer yet.

- **10 (update 2026-09-21):** moved to the "Profile page country/city search" session at Jeff's request. It applied the same column widths in the main folder's itinerary.html, plus padding-left:6px on the Nights column. Dropped from this worktree so the two don't clash. Item 4 (trip tabs 2x2) stays here.
