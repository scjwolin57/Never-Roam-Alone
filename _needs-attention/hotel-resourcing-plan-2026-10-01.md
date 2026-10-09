# Hotel picks: re-source by qualification rules, built for affiliate links

*Draft plan, 2026-10-01. Nothing built, nothing changed. Supersedes the order in
`_done/hotel-links-pipeline-plan.md` (2026-09-26): that plan linked the hotels we already
have; this one re-picks them so every pick is chosen by one written rule and can carry
a link. The partner research (`_done/hotel-affiliate-programs-2026-09-24.md`) and both pilot
notes (`_done/hotel-links-pilot-results-2026-09-26.md`, `_done/hotel-links-pilot-second-run-2026-09-26.md`)
still stand and are reused here. Decisions for Jeff are in section 9.*

## 0. Jeff's calls, 2026-10-02 (these override the sections below where they differ)

1. **Four tiers per neighborhood:** Luxury = 5 star; Comfort = 3 and 4 star; Budget =
   1 and 2 star; and a new fourth, **Shared room** (dorm beds) from Hostelworld properties.
2. **Expedia Group's Travel Creator Program is the main source of links** for the three
   hotel tiers; Hostelworld for Shared room. Agoda drops out of the first pass.
3. **The site must have everything Expedia needs for approval** (section 10).

**Resolved the same day by Jeff's answer 3 (tier by star and price within the city's
price), so §4.2 still holds. The original flag is kept below for the record.**

**Flagged for Jeff (CLAUDE.md "own change against the rulebook"):** star-class tiers
cross CLAUDE.md §4.2, which says "Hotel tiers are price bands checked on a current
booking site against that city's own cost level". Consequence: a 3-star in Zurich and a
3-star in Hanoi land in the same tier at very different prices, and the hotel card's
Budget / Comfort / Luxury nightly averages (`cost.hotel`, researched as price bands) no
longer describe the same hotels the tier rows name. If Jeff confirms, decisions.md gets
a row and §4.2 is amended to "tiers are star class from the booking partner; the
nightly averages stay price bands and are labelled as such". Section 3.2 below is
rewritten to the star rule on that basis.

## 1. Where today's hotel picks came from

| Step | Date | What happened | Record |
|---|---|---|---|
| 1. First names | before 2026-07-26 | Written with the original city research and loaded to the site from the sheet on 2026-07-26 ("update 600plus cities to live page"). No source was kept per hotel. | `_done/sheet-site-parity-2026-09-19.md` |
| 2. Hotel audit | 2026-08-21 to 09-02 | Every city re-checked by agents (`_guidebuild/hotel_audit/`). Unaudited cities ran at 73 to 100% defects (made-up names, wrong tier order, wrong district). Each name had to be real, open, in the hood and in tier order within its row. Rule was "keep a name that checks out, replace only what fails". | commit ad2cf8eb (418 cities rewritten, 139 lost hoods); `AUDIT_BRIEF.md`, `TASK.md` |
| 3. Sheet catch-up | 2026-09-19 | The audit wrote citydata only; the sheet was filled from the site. | decisions.md 2026-09-19 |
| 4. Small fixes since | 2026-09-18 on | Single hotels moved or replaced (Batumi, Majuro, Chiang Rai, Medina), one by Jeff's pin. | decisions.md |

Evidence today:

| Item | Count |
|---|---|
| Hotels on the site | 10,741 |
| With a source row in `hotel_audit/evidence.tsv` | 10,721 |
| Sources used (top) | momondo 5,187 · booking.com 2,339 · kayak 1,534 · OpenStreetMap ~1,050 · Tripadvisor 163 · other ~1,700 |
| Audit's own spot check (40 kept names, 2026-08-26) | 2 wrong (5%), 15 could not be confirmed open (37.5%) |

**What this means for the new plan.** The current picks were chosen to be *valid*, not
*best*. Nothing ranked them: a hotel stayed if it existed, was open and sat in the hood.
Tier was set by order within the row ("High-end is the priciest of the three"), not
against the city's own price bands that CLAUDE.md §4.2 now asks for. Most sources are
aggregator pages, which §4.3 calls unverified. And none of the picks was chosen with a
booking partner in mind, which is why the link pilots struggled: they started from a
name and tried to find it on a partner.

## 2. The idea in one line

Start from what is bookable and placed, not from a name: pull candidates per hood, apply
fixed gates, sort them into tiers by the city's own price bands, rank by one formula,
then confirm the winner on its partner. The pick and its link are found together.

## 3. Qualification rules (proposed; nothing collected until Jeff approves the definition)

### 3.1 Gates (a candidate must pass all)

| # | Gate | Rule | Proof |
|---|---|---|---|
| G1 | Exists and open | Overture marks it operating, and the partner page takes bookings | Overture ID; partner property page |
| G2 | In the hood | Inside the hood's search area: boundary, else 800 m, else 1.2 km (same `hoodpicks/areas/<slug>.json` as eat/cafes/bars) | Google location, cross-checked by the partner's street address (pilot 2: street match, not distance alone) |
| G3 | Lodging type | Hotel, boutique hotel, guesthouse, B&B, inn, ryokan, riad, hostel with private rooms. Out: apartments-only listings, love hotels, hourly rooms, timeshares, "hotel" names that are really serviced flats | Google primary type plus partner property type |
| G4 | Well reviewed | Partner guest score 8.0/10+ with 100+ reviews (25+ in towns under 100,000), or the city's median for that tier where none reaches 8.0. Same bar as Google 4.2+ in hood picks, moved to the partner's own scale because Google is not used by default | Partner score, used once to choose, never stored or shown |
| G5 | Bookable through one of our programs | Listed on Expedia, else on the backup program (section 5), with a matched property ID. A hotel is never dropped only because Expedia lacks it (Jeff, 2026-10-02) | Partner property ID and URL |
| G7 | Price fits its tier | The property's nightly price sits within the city's band for its tier (3.2) | Read once from the partner, never stored or shown |
| G6 | Not flagged | No closure, no rename trap, no "same name, different hotel" (pilot 2's Hotel Astoria case) | Address match in G2 |

### 3.2 Tier by star class (Jeff, 2026-10-02; replaces "order within the row")

| Tier (card label) | Rule | Partner |
|---|---|---|
| Luxury | 5 star | Expedia |
| Comfort | 3 or 4 star | Expedia |
| Budget | 1 or 2 star | Expedia |
| Shared room (new) | Property sells beds in a shared dorm | Hostelworld |

- **Star and price together (Jeff, 2026-10-02, answer 3):** star class sets the tier,
  and the price must also fit the city. Proposed band (needs Jeff's number): the
  property's price for a fixed reference stay (two adults, one midweek night about 60
  days out) is between 50% and 150% of the city's own figure for that tier. The city
  figures already exist: `cost.hotel` budget / mid / high, the same numbers the hotel
  card shows, so no second price column is created (§4.4). A 4-star at three times the
  city's Comfort figure fails G7 and is not picked. This keeps §4.2 (tiers checked
  against the city's own cost level), so the section 0 flag is resolved.
  The Shared room tier has no city figure today; it is checked by star-free rules only
  until a dorm-bed price is researched (open question 9.14).
- **Star source: the star rating Expedia shows on the property page**, one source for
  all 893 cities. National star systems differ and many countries have none, so mixing
  sources would put the same hotel in different tiers. Half stars (3.5, 4.5) round down
  (open question 9.10). Stored in the Hotel Links tab with the as-of date.
- **No star shown** (common for guesthouses, ryokans, riads, B&Bs): the property does
  not qualify for a hotel tier (open question 9.11; the alternative is Budget).
- **A hostel that also has private rooms** goes in Shared room only; it is never also a
  Budget pick, so one property appears once per hood.
- **Shared room** needs dorm beds listed on Hostelworld and the same gates G1, G2, G4,
  G6. Its rating gate uses Hostelworld's own score (open question 9.12: threshold,
  proposed 8.0+ with 100+ reviews), because many hostels have thin Google listings.

### 3.3 Ranking among qualified candidates

- **Score:** weighted rating (rating pulled toward the city mean when reviews are few;
  the same formula used for laundromats and hood picks), so a 4.8 with 40 reviews does
  not beat a 4.6 with 3,000.
- **Tie-break:** nearer the hood point.
- **Never ranked by commission.** A hotel is never picked or dropped because one
  partner pays more. Partner only decides *where the link goes*, not *which hotel wins*.
- **Fresh pick everywhere (Jeff, 2026-10-02, answer 7).** Current hotels get no head
  start; every slot is picked by these rules. Each replaced name is logged (old → new)
  in the batch commit.
- **Protected slots:** any hotel set by Jeff's pin or Jeff's call stays (Batumi's Black
  Sea Pearl, 2026-09-24). Roamer picks (`roamer_picks.stay`) are untouched.

### 3.4 When nothing qualifies

Jeff, 2026-10-02 (answer 6): find a property, using the backup program if needed.
In order: (1) Expedia inside the hood; (2) the backup program inside the hood; (3) a
"Just outside <hood>" pick within 300 m, flagged like eat/bars, on either program.
If all three find nothing that passes the gates, the slot stays empty and is logged
(rule 1: nothing padded); the pilot reports how often that happens.

## 4. Pipeline (same shape as hood picks, which already works)

1. **Candidates (no Google by default; see 9.9).** Overture Maps open data (free,
   storable, already used for laundromats): every hotel, hostel, guesthouse and B&B
   inside each hood's area, with name, address, point and an "operating" flag. Hostels
   also from Hostelworld's city list. Google Places only if the pilot shows the free
   route cannot rank candidates at a workable cost.
2. **Script gates.** G1, G2, G3, G4 by script; chain and duplicate detection by script.
3. **Partner match.** For each tier's top 3: find the property on its assigned partner
   and confirm by street address (pilot 2 showed this works on Agoda's rendered page).
   Best source after approval: the partner's own hotel data feed. **Not verified yet**
   what feed each program gives a new small publisher; checking that is the first task
   after approval. Until then: one partner-domain search plus one browser page read.
4. **Tier and rank.** Section 3.2 and 3.3 by script.
5. **Pick agent, then independent checker, then fresh audit,** as in hood picks.
6. **Sheet first:** Live Cities hotel columns (names) and a new **Hotel Links** tab
   (one row per pick per partner tried: place ID, partner, property ID, partner name and
   address, tier basis, match grade, source, as-of). Written only by `sheet_write.py`.
7. **Then site:** a loader (`hotellinks/load_hotels.py`) writes `lodging` and a new
   `lodging_links` key into citydata. Parity check 0. Commit with the batch log.

Batches of 25 cities, the 412 cities with 500,000+ international visitors first (same
order as hood picks), then the rest. Pilot first: 25 cities, nothing shipped until
Jeff sees the numbers.

## 5. Partner per hotel

Rewritten 2026-10-02 to Jeff's call:

| Case | Partner |
|---|---|
| Luxury, Comfort, Budget | Expedia (Expedia.com property page; Hotels.com is the same program if Expedia's page is missing) |
| Shared room | Hostelworld |
| Not on Expedia | The backup program (Jeff, 2026-10-02, answers 5 and 6). Proposed: **Agoda** (direct, accepts any site, strongest where Expedia is thin: Asia). Booking.com through CJ is the alternative (widest inventory, but it cut small partners in 2025). Open question 9.15 |

Expedia's inventory is thinner than Agoda's in parts of Asia, which is why Agoda is the
proposed backup; the pilot reports how many picks each program carries per region.
Agoda's six-month no-bookings clause and its clause 4.4.1 question (section 8) apply
from the day its first link goes live.

**How links are stored (changed 2026-10-02, see section 11):** Expedia's terms (16.2 to
16.4) forbid building or changing its links ourselves, so for Expedia the site stores
the exact link Expedia's own tool produced, one per hotel, plus the property ID for
checking. Agoda and Hostelworld links can be built from the property ID and our partner
code, so for those one template per partner in `hotel-affiliates.js` builds the URL and
a code change stays a one-line edit.

## 6. What changes on city.html

- **Four rows per hood card:** Luxury, Comfort, Budget, Shared room. This changes the
  `lodging` shape from 3 to 4 names per hood: CITY_SCHEMA.md, the five new sheet
  columns "Hood N Shared Room", `roamer_picks.stay` gains the `Shared room` kind, the
  "Suggest a place" form gains it as a listing, and votes for the new rows start empty.
- Each hotel row gets one "Check rates" link, `target="_blank" rel="sponsored noopener"`.
  The Shared room row says "Check beds" (wording for Jeff to confirm).
- One plain disclosure line at the top of the Where to stay card, only when a row has a
  link: "If you book through these links, Never Roam Alone earns a commission. It costs
  you nothing extra."
- Empty tiers render per section 3.4.
- No partner prices, logos or ratings. Our own price averages stay, already labelled as
  our estimates.
- Checked at 320, 360, 375, 390 to 430, 768 and 1280+, screenshots before it ships.
- Full §5.3 change protocol in the same commit as the render change (inventory row,
  CITY_SCHEMA.md, add_city.py, sheet tab, skill, parity check).

## 7. Cost and limits (estimates, labelled)

| Item | Estimate | Basis |
|---|---|---|
| Hoods | about 3,580 | 10,741 hotels / 3 |
| Google calls | 0 by default (9.9) | Overture for candidates; if the pilot needs Google: about 3,600 to 7,500 calls, one Nearby per hood plus gap searches |
| Google cost if needed | about US$150 to 300, or US$0 by staying inside the free monthly allowance (about 1,000 calls, shared with hood picks), which would take months | US$40 per 1,000 past the allowance (RESUME_hood-picks.md) |
| Partner matching | about 3 page reads per tier slot without a feed | pilot 2; far fewer with a partner feed |
| Web search cap | about 200 per session | the main limit if there is no feed; the reason applying first matters |

## 8. Risks

- **Mixed methods during the backfill.** §4.2 says a column is never half old method,
  half new. For hood picks the accepted practice was city by city, with each city fully
  converted. Same here: a `lodging_v` marker per city says which method its hotels used.
- **Agoda's six-month clause.** It can end the account after six months with no stays;
  links should go live close to launch traffic.
- **Agoda clause 4.4.1** on "Hotel Brands" and SEO needs a written answer before signing
  (from the programs note).
- **Churn.** Re-picking will replace hotels people have already voted on. Votes are keyed
  by venue name; a replaced hotel's votes disappear with it.

## 9. Decisions for Jeff

Jeff's answers, 2026-10-02:

1. Re-source, not just link: **yes.**
2. Gates: **yes** (G4 moved to the partner's 8.0/10 scale since Google is off by default).
3. Tier: **star rating and price together, within the city's price** (3.2, G7).
4. Global chains: **allowed.**
5. A hotel not on Expedia: **not dropped**; linked through the backup program.
6. Empty tier: **find a property**, using the backup program if needed (3.4).
7. **Fresh pick** everywhere.
8. Jeff applies to Expedia **once the site is ready** (section 10).
9. Google spend: Jeff asks whether it is needed. Answer: **not necessarily.** Overture
   gives the candidates for free. What Google adds is a rating for every candidate in
   one call per hood, which lets the pipeline rank them before opening any partner page.
   Without it, ratings come only from the partner pages, so the top candidates have to
   be found by reading many more of those pages one by one, which is slower and comes
   closer to Expedia's ban on scraping (T&Cs 11.1.21, 11.1.22). Plan: run the pilot
   with no Google, count the page reads per city, and come back with the number before
   any spend.

Answered 2026-10-02 (second message):

10. Half stars **round down** (4.5 star is Comfort).
11. Expedia's **"property class" is the star rating** used for tiers. A property with
    no property class shown does not qualify for a hotel tier.
12. Shared room bar: **Hostelworld 8.0+ with 100+ reviews**; higher scores rank first.
13. Resolved by answer 3.
14. Price band: **50% to 150%** of the city's figure for that tier. Shared room has no
    city price figure yet, so it is checked on score, reviews and place only.
15. Backup program: **Agoda.**

## 10. Expedia approval: what the site has and what it needs (checked 2026-10-02)

What Expedia says publicly: "Anyone can apply! We review all applications within
minutes" (creator.expediagroup.com, read 2026-10-02). The help centre says links work
on "websites, blogs, social media and apps". No traffic minimum is published. The
binding rules are the T&Cs of 9 Nov 2023 (summarised in the programs note).

| # | Item | Status today | Action |
|---|---|---|---|
| 1 | Public, finished site with original content | Pass: 893 guides, 907 sitemap URLs, no "coming soon" gate | none |
| 2 | Privacy policy discloses tracking by the program (T&Cs 9.1.2, 21.1) | Partial: privacy.html names Airalo/Impact and GetYourGuide, not Expedia or Partnerize | Add Expedia Group (tracking and payment through Partnerize) and Hostelworld (Partnerize), with their privacy links, on the day the links go live |
| 3 | Clear disclosure next to the links (T&Cs 9.2.2(c), FTC) | Pass for eSIM and day trips; nothing yet on the hotel card (no links yet) | One line in the Where to stay card, built with the links |
| 4 | Disclosure wording | Footer and privacy say "we **may** earn", which the FTC and the UK ASA call too weak | Change to "we earn a commission" in footer.js and privacy.html (copy change for Jeff to approve) |
| 5 | `rel="sponsored"` on paid links | Pass: the eSIM and GetYourGuide links already carry it | Same on hotel links |
| 6 | Terms cover affiliate links, our price estimates and who the booking contract is with | Pass: terms.html section 8 (commit 6dc528de) | none |
| 7 | No redirects through our domain, no iframes, no scraping or copying Expedia prices (11.1.1, 11.1.18, 11.1.22) | Pass: plain links only; our prices are our own estimates, labelled | keep; the pipeline reads Expedia only to match a property and its star rating, never stores or shows its prices |
| 8 | "Accommodation described is the same as the one linked to" (10.1(g)) | Not started | The address match in gate G2 is exactly this check |
| 9 | Contact details | Pass: contact.html, contact@neverroamalone.com | Apply with contact@, never a gmail address |
| 10 | About page saying who runs the site and how picks are chosen | **Missing:** there is no about page | Not a published Expedia requirement, but reviewers look for one. Recommend a short about.html: who runs it, that picks are chosen by fixed rules and never by commission. Footer link added |
| 11 | Payment and tax details | Jeff only | Bank account for transfer (no PayPal), US tax form, in Jeff's name |
| 12 | Social accounts | Unknown | The program is pitched at social creators; the form may ask for handles. A website alone is allowed by the help centre |

**Bulk links:** answered in section 11. In short, we may not build Expedia links
ourselves; bulk needs Expedia to switch on its Data Feed or Deeplink Generator for us.

**Do we fit the program's criteria? Yes** (terms section 7.1 and the help centre's
rejection article, read 2026-10-02): live and complete site, original content with
credited and licensed photos, no misinformation, not a travel agent, not a sub-affiliate
network, nothing that looks like Expedia, privacy policy that explains tracking. No
traffic minimum is stated. Commission "up to 4%".

**When applying:** the "Join now" button on creator.expediagroup.com/affiliates opens
the sign-up with `initial=travel_video`. Choose the affiliate / website option and enter
neverroamalone.com, with contact@neverroamalone.com as the email.

Sources: [Travel Creator Program](https://creator.expediagroup.com/),
[How do I create Affiliate Links?](https://help.creator.expediagroup.com/hc/en-us/articles/13164069784727-How-do-I-create-Affiliate-Links),
[Page types you can link to](https://help.creator.expediagroup.com/hc/en-us/articles/12480156695191-What-are-the-different-types-of-pages-you-can-link-to),
all read 2026-10-02.

## 11. Building about 10,700 Expedia links (checked 2026-10-02)

### What we found

| # | Finding | Source |
|---|---|---|
| 1 | The Travel Creator Program has no API access | Help centre, "Do you offer API access?" (updated 2025-07-16) |
| 2 | Links are made one at a time: the Creator Toolbox "Get link" button on any Expedia page, or the Link Builder (paste a page address) | Help centre, "How to create and copy an affiliate link" |
| 3 | A creator link is a random short code (`expedia.com/affiliate/3yRyX67`), so it cannot be worked out from a hotel's address. Seven public examples found, all the same shape | public code on GitHub |
| 4 | Opening one shows the tracking it adds: `affcid=US.DIRECT.PHG.<publisher>.<campaign>` plus an ID made at the moment of the click. PHG is Partnerize, so the privacy page is right to name it | one link opened in the browser |
| 5 | **We may not build or change Expedia links ourselves.** 16.2: "you will not alter, modify or otherwise change the Program Links without Expedia's prior written consent". 16.3: the same for links from the Deeplink Generator | T&Cs |
| 6 | Driving the Toolbox by script across thousands of pages runs into 11.1.10 (no bypassing measures that limit access) and the no-scraping clauses (11.1.21, 11.1.22) | T&Cs |
| 7 | **Two tools in the terms would solve it, both at Expedia's discretion:** the **Data Feed** (16.5: accommodation content "through a flat file generator", an Excel download or an XML interface) and the **Deeplink Generator** (16.3: "a direct link to... the infosite page for a certain hotel"). Neither is described on the public creator pages | T&Cs |
| 8 | 16.18: no Expedia content shown in translation without consent. We show only hotel names and links, not Expedia's descriptions or photos | T&Cs |
| 9 | Accounts made after 23 January 2024 need no separate Partnerize account | Help centre, Partnerize article |
| 10 | An account with no clicks for 12 months can be closed after notice | Help centre, inactivity FAQ (updated 2026-08-11) |

### Order of work

1. ~~Jeff applies (website option, not travel video).~~ **Done: approved 2026-10-02.**
2. ~~The day it is approved, Jeff sends the email below to creatorsupport@expediagroup.com.~~ **Sent 2026-10-02; waiting for Expedia's answer.**
3. If Expedia grants Data Feed or Deeplink Generator access: read its guidelines, then
   run the 25-city pilot with links from that tool.
4. If Expedia says no, compare before the pilot:
   - **(B)** join Expedia through a network (CJ), whose deep-link format is normally
     built from any page address. Not verified that Expedia's network program allows it;
     the Creator Toolbox is not available to network members.
   - **(C)** the Toolbox one link at a time by hand: about 10,700 links at about 20
     seconds each, roughly 60 hours (estimate).
   - **(D)** Agoda as the main program in more regions, since Agoda allows links built
     from the property ID.

### Email for Jeff to send after approval

To: creatorsupport@expediagroup.com
From: contact@neverroamalone.com
Subject: Bulk hotel deep links for neverroamalone.com (Data Feed or Deeplink Generator access)

> Hello,
>
> I run Never Roam Alone (https://neverroamalone.com), an independent site with free
> city guides. My Travel Creator account was approved on [date]; my account email is
> contact@neverroamalone.com.
>
> Each guide recommends hotels by neighborhood: for every neighborhood we name one
> 5-star, one 3–4 star and one 1–2 star hotel. Across the site that is about 10,700
> named hotels, and I would like each one to carry an Expedia link to that hotel's own
> page.
>
> At that scale, making the links one at a time with the Creator Toolbox is not
> practical, and I understand from the Program Terms (16.2 to 16.4) that I may not build
> or change links myself. Could you give my account access to one of these?
>
> 1. The Data Feed (Terms 16.5), so I can match our hotels to Expedia property IDs and
>    their tracked links; or
> 2. The Deeplink Generator (Terms 16.3) with a way to create links in bulk, for example
>    by uploading a list of property pages; or
> 3. Your written consent (Terms 16.2) to a fixed link format, built from your property
>    page address plus my tracking code, if you have one you approve.
>
> How the links would appear: one plain text link per hotel ("Check rates"), marked as
> sponsored, with a commission disclosure next to it and in our privacy policy. No
> redirects through our site, no shortened links, no scripts or frames, and no Expedia
> prices, photos, reviews or descriptions copied onto our pages. Our pages offer a
> language switcher, but only the hotel name and the link would come from Expedia.
>
> If none of these is available for my account, could you tell me the recommended way
> to link this many individual hotels?
>
> Thank you,
> Jeff
> Never Roam Alone
> contact@neverroamalone.com

Sources: [Expedia affiliate program page](https://creator.expediagroup.com/affiliates),
[Expedia affiliate T&Cs](https://creator.expediagroup.com/doc/affiliate),
[Do you offer API access?](https://help.creator.expediagroup.com/hc/en-us/articles/33222360022295),
[How to create and copy an affiliate link](https://help.creator.expediagroup.com/hc/en-us/articles/18048954202391),
[Why was my account rejected?](https://help.creator.expediagroup.com/hc/en-us/articles/15361594064791),
[Partnerize article](https://help.creator.expediagroup.com/hc/en-us/articles/1500003709001),
[Inactivity FAQ](https://help.creator.expediagroup.com/hc/en-us/articles/41947042654743),
all read 2026-10-02.

## 12. Expedia's answer (received by Jeff, read 2026-10-02) and the options now

Expedia Travel Creator Program support, in short:

1. No API access and no data feeds for property IDs and tracked links.
2. No bulk deep-link upload; every link is made one at a time (Link Builder or Creator Toolbox).
3. No written consent for a fixed link format; links must be used exactly as their tools make them (Terms 16.2 to 16.4).
4. For high-volume deep linking they recommend **Expedia Group Partner Solutions (EPS)** or the **XAP APIs** (developers.expediagroup.com).

### What XAP offers (developer pages read 2026-10-02)

- **Lodging Listings API**: search Expedia hotels by latitude/longitude (or region, keyword, hotel IDs), up to 1,000 per response. Each result carries the hotel ID, address, coordinates, **StarRating**, **GuestRating**, **GuestReviewCount**, property type, brand, a price for the requested dates, and a ready-made **link to that hotel on Expedia**. That one call covers candidates, the star tier, the 8.0 guest-score gate, the price check and the link: most of section 4 without Google.
- Catch 1: the links are made for specific dates (check-in and check-out are required in the search), so a stored link goes stale. A live link would need our own small function that asks XAP at click time, which XAP's terms would have to allow.
- Catch 2: access is by application ("brief review of your site functionality"), then an Expedia account manager issues the key. How a link-off partner is paid under XAP, and whether a site our size is accepted, is not on the public pages.
- EPS (Rapid) is built for travel companies that take the booking on their own site; it does not fit a guide site that links out.

### Options

| | Route | For | Against |
|---|---|---|---|
| A | Apply to XAP (free form) | Everything the pipeline needs in one API, from Expedia itself | Acceptance and pay model unknown; dated links |
| B | Agoda as the main link partner, Expedia only by hand where Agoda lacks a hotel | Agoda allows links built from the hotel ID and our partner code, so all links can be made by script; strongest in Asia | Reverses Jeff's 2026-10-02 call (Expedia main); Agoda's six-month no-bookings clause |
| C | Expedia by hand for every hotel (Toolbox) | Stays with the current plan, allowed by the terms | About 10,700 links, roughly 60 hours (estimate); every re-pick needs a new link by hand |
| D | Expedia through the CJ network | CJ deep links are normally built from any page address | Not verified that Expedia runs a program on CJ or allows it there |

Recommendation: send the XAP form now (A) and, without waiting, run the 25-city pilot with Agoda links (B) so the pipeline is proven; hotels Agoda lacks get an Expedia link by hand (C, small numbers). If XAP accepts us, Expedia can be switched back in as the main partner without redoing the picks, because the picks never depend on the partner.

**Update, same day: XAP is closed to new partners.** Expedia's developer hub says new API applications are paused "due to the volume of requests", covering the Travel Redirect APIs (Lodging Listings included); no reopening date (Jeff, confirmed by search 2026-10-02). Option A is off for now. Still worth one question back to Expedia: their help centre says partners who join through a network ("such as Partnerize and CJ Affiliate") get the network's own link tools. Partnerize and CJ both normally offer a deep-link format built from any page address; if Expedia confirms that format counts as a Program Link for network members, option D gives Expedia links by script. Until that is answered, the workable routes are B (Agoda main, by script) and C (Expedia by hand).

**Option D question, drafted 2026-10-02 for Jeff to send as a reply in the same Expedia thread:**

> Thank you for the clear answer. One follow-up: your help centre says partners who join the program through an affiliate network, such as Partnerize or CJ Affiliate, use that network's link tools instead of the Creator Toolbox. Both networks offer a deep-link format that is built from any Expedia page address plus the partner's tracking code. If I joined through one of those networks, would links made with that network's deep-link format count as Program Links under your terms (16.2 to 16.4), so I could create them for each hotel page without making every link by hand? If so, which network do you recommend for a website partner based in the United States?

**Expedia's answer to the option D question (received by Jeff, read 2026-10-05):** joining through Partnerize or CJ Affiliate puts the partner under that network's terms and tools, and "the deep-link formats provided by these networks are authorized for use within their respective programs", with "more automated deep-linking" than the Creator Hub. Both networks are fine for a US website; Partnerize support for Expedia is expedia.support@partnerize.com. Expedia's Creator support only covers the Creator Hub. **Option D is open: Expedia links can be made by script through a network.**

Proposed next steps (for Jeff's OK):
1. **Network: Partnerize** (proposed over CJ): Expedia's own tracking already runs on it (the PHG code in every Creator link), Hostelworld is on it too, so one network account would serve two partners.
2. **Ask Partnerize three things before joining:** (a) can an existing Creator Hub member also join the Expedia program on Partnerize, or must the Creator account close; (b) is the deep-link format (destination = any Expedia hotel page) available to a new website publisher from day one; (c) does the Expedia program on Partnerize offer a hotel product feed (hotel IDs, page addresses, star class), which would replace one web search per hotel when matching our picks to Expedia.
3. Remaining bottleneck either way: each pick still has to be matched to its Expedia hotel page. Without a feed that is one search plus one page read per hotel (pilot 2's method); the pilot measures it.

**Partnerize's answer (received by Jeff, read 2026-10-05):** (1) an existing Affiliate Hub (Creator) account can be used to log in to Partnerize and apply to other campaigns; access is opened by the Affiliate Hub team at affiliatehubsupport@expediagroup.com. A separate Partnerize account is the alternative but has no tie to the Creator account. (2) Deep linking is available as soon as a partner is approved onto a campaign (Tracking tab, after choosing the campaign). (3) Feeds are up to each advertiser; check the Content tab after approval.

Proposed: open Partnerize access on the existing Creator account (one login, one payout; the Expedia approval carries over), then apply to the Expedia and Hostelworld campaigns there, then check Tracking (deep-link format) and Content (any hotel feed) for each.

**Decided 2026-10-05 (decisions.md):** a new Partnerize account; apply there to the Expedia (US) and Hostelworld campaigns; only Partnerize links on the site; the Creator account is left unused.
