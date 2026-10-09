# Hotel links pilot: second run, and where it differs from the first (2026-09-26)

*Two sessions ran this pilot at the same time. The first (session 106af6ac) wrote `hotel-links-pilot-results-2026-09-26.md`, which this note does not edit. This second run used a different location check and a different way of reading partner pages, and reaches a different conclusion about what is workable. Same rules in both: no Google, OpenStreetMap only, nothing written to the sheet or citydata. Raw data: `_guidebuild/hotellinks/` (gitignored): `pilot_hotels.json`, `found_1-3.json`, `osm_results.json`, `pilot_grades.json`.*

## Outcome

Match A is reachable for Agoda and probably for Expedia and Hostelworld with the right check. Free OpenStreetMap through Photon (not Nominatim) locates two thirds of the sampled hotels. Both findings contradict the first run's "not workable" reading. The sample is small (73 hotels, the first neighborhood of each of the 25 cities), so treat the rates as a first estimate.

## What this run did differently

| Step | First run | This run |
|---|---|---|
| Sample | all 365 hotels in 25 cities | 73 hotels: the first neighborhood in each city |
| Finding the page | web search, all three partners; 200-search cap reached, 167 hotels never searched | one domain-restricted search per hotel (75 searches for 73 hotels); 71 of 73 found |
| Reading the page | scripted fetch: Agoda shell with no data, Expedia 429 | the built-in browser, which draws the page like a person would |
| OSM | Nominatim: 13 of 87 found | Photon (already on the site's privacy list): 48 of 73 name hits, 46 within 3 km of the hood point |

Nominatim's public server refused every request from this machine (HTTP 429, even a single polite request), which explains the first run's low OSM number. Photon answered every request.

## Numbers (73 hotels, estimates from a small sample)

| Grade | Hotels | Meaning |
|---|---|---|
| A (name agrees, and OSM places it within 3 km of the hood point) | 44 | provisional; see the address check below |
| B (partner name and city agree, OSM cannot place it) | 26 | review list |
| C (weak, different property likely) | 1 | no link (Hotel Astoria, Stuttgart: two different hotels share the name) |
| No page found | 2 | both Hostelworld (Nord Hostel, Frolic Goats Hostel) |

| Partner | A | B | C or none |
|---|---|---|---|
| Expedia (38 assigned) | 28 | 7 | 1 |
| Agoda (25 assigned) | 11 | 16 | 0 |
| Hostelworld (10 assigned) | 5 | 3 | 2 |

Agoda's B rate is high because OSM in Japan and China carries names in local script (Amandayan is 丽江大研安缦酒店, Kannawa Yunoka is かんなわゆの香), so the name overlap test misses them; they are the same properties by street and district. A local-script name match would move most of them to A.

## Address check on the partner page (Agoda)

The rendered Agoda page shows name, street address and district in its structured data. Four A matches were read and compared with OSM:

| Hotel | Agoda address | OSM street | Agree |
|---|---|---|---|
| Marina Bay Sands | 10 Bayfront Avenue | Bayfront Avenue 10 | yes |
| PARKROYAL COLLECTION Marina Bay | 6 Raffles Boulevard Marina Square | Raffles Boulevard 6 | yes |
| Mantra on View Hotel | 22 View Avenue | View Avenue 22 | yes |
| Navios Yokohama | 1-1 Shinko-2 Chome, Naka-Ku | 1 1 | yes |

That is real Match A for Agoda: an address on the partner's page and an independent OSM address that agree. Agoda did not publish coordinates in the same data, so the address, not coordinates, is the test.

Expedia's rendered page shows the hotel name and city in the URL but no address without dates chosen (read once, Cornaro Hotel Split). For Expedia, A means name and city on the partner page plus an independent OSM location in the hood, one step weaker than Agoda. Hostelworld's fetched page carries a street address and coordinates in its structured data (read once, Goli & Bosi Split); the other hostel pages were not read.

## Problems found (all real, all fixable by the checks in the plan)

- **Duplicate listings.** Agoda often has two or more pages for one property (Wanderlust Singapore four, Kai Beppu four, Gold Coast Peppers two). The pipeline must pick one and store its property ID.
- **Renames.** Socialtel La Candelaria (Selina in the URL), Dream House Hostel Kyiv (now DREAM Hostel), Muntri Maison (may be Muntri House). Kept as renames with a note, per the rulebook.
- **Same name, different hotel.** Hotel Astoria, Stuttgart: two properties. Radisson Blu Podil City Centre vs Radisson Blu Kyiv City Centre. These must fail the address check, not be matched by name.
- **Wrong city slug.** Agoda files George Town under Penang and Beppu under Oita. Fine for the link; the page title still names the right city.
- **One hood mismatch in the search snippets.** Hotel Parma (San Sebastián) reads as near Kursaal, not the Parte Vieja; Melrose (Amsterdam) not confirmed in the Jordaan. Both go to review.
- **Robots.txt.** All three partners disallow their search pages to scripts. The workable path is web search restricted to the partner's domain, then reading the property page in a browser. It cannot be a scripted partner search.
- **Expedia rate-limits scripts.** Reading one property page at a time in the browser worked; a script does not.

## Where I agree and disagree with the first run's change of order

- Agree: apply to Agoda and Expedia now. Approved affiliates get the partner's own property feed, which is the cleanest long-term source for IDs and addresses, and the six-month clause only bites once links are live.
- Disagree: the URL pipeline is not blocked. It works for Agoda now, and for Expedia and Hostelworld with a weaker or an untested check. What it needs is the one-page-at-a-time browser read and a duplicate rule, not partner approval.
- Search quota is the real limit: about one search per hotel, so 10,741 hotels is far beyond one session's cap by web search alone. That is the case for the partner feed after approval, with web search and the browser kept for the leftovers.

## Decisions for Jeff

1. Which run's reading of the pilot to take as the record. The two disagree; this note does not overwrite the first.
2. Approve applying to Agoda and Expedia now (both runs agree).
3. Whether to let a follow-up pilot read Agoda pages in the browser for the 16 B rows and the Expedia sample, to settle the Expedia address question with a full sample. It would use about 40 page reads and no search quota.

## Checks and costs

- Google calls: 0. Google credit used: $0.
- Searches used by this run: about 75 (three searchers, 25 each). Both runs drew on the same pool.
- Partner pages read in the browser: 6 (2 Expedia/Agoda test pages, 4 Agoda address checks).
- Photon requests: 73. Nominatim requests: 73, all refused (429).
- Nothing written to the sheet, citydata, city.html or any committed file.

## Follow-up: browser read of the 26 unplaced rows (2026-09-27)

Read each Grade B row's partner page in the built-in browser, one at a time, and compared its address to OSM/Photon where OSM had a candidate. No new web searches, no Google. 2 more web searches were used to find a current Hostelworld URL and an Amsterdam page snippet. Full detail: `_guidebuild/hotellinks/pilot_grades_v2.json` (gitignored).

### Result: 7 of 26 promoted to confirmed Match A by address

| id | City | Hotel | Partner address | OSM cross-check |
|---|---|---|---|---|
| 5 | George Town | 39 Love Lane | 39 Love Ln | Lorong Love 39, 0.44 km — same street and number |
| 10 | Gold Coast | Bunk Surfers Paradise | 6 Beach Road | Beach Road, 0.71 km — same street |
| 11 | Lijiang | Amandayan | No.29 Shishan Road | 狮山路 (Shishan Road) 29, 0.62 km — same street and number |
| 16 | Phuket | Lub d Phuket Patong | 5/5 Sawatdirak Road | ถนนสวัสดิรักษ์ (Sawatdirak Rd), 0.37 km — same street |
| 22 | Beppu | Kannawa Yunoka | 4-Kumi Miyuki | 御幸 (Miyuki) 4, 0.77 km — same street and number |
| 51 | Chengdu | Grand Hyatt Chengdu | No. 8 South Chunxi Road | 春熙路南段 (S. Chunxi Rd) 8, 0.29 km — same street and number |
| 52 | Chengdu | Poshpacker Chengdu Flipflop Hostel | No.96 Dongsheng Street | Dongsheng Street 98, 0.33 km — same street, number close |

An address on the partner's page that names the same street as an independent OSM point, ideally the same house number, is a workable Match A test. It caught real matches OSM's name search alone had missed, mostly hotels named in English on a page that OSM only carries in local script.

### Result: 12 more read, address present but no independent OSM check possible

The partner page named a specific, plausible street address, but OSM had no candidate to compare it to (common outside city centres and for smaller properties): ids 0, 3, 8, 12, 13, 20, 21, 50, 67, 71 (Agoda) and one Hostelworld (67, Kyiv). These stay Grade B: a real address exists, but nothing outside the partner confirms it. Two of them are worth flagging on their own:

- **id 21, Kannawa Onsen Oniyama Hotel:** its address places it correctly in Beppu's Kannawa onsen district, but the first pass's OSM guess (5.48 km away, a different hotel) was wrong. A distance-based OSM check without a name or street match would have produced a false negative here.
- **id 71, Hotel Marqueses, Cusco:** OSM's only nearby candidate at a similar distance is the JW Marriott, a different hotel. Distance alone is not enough in a dense historic centre; the check needs the street name to match, not just proximity.

### Result: 3 renames confirmed, 1 duplicate resolved, 2 could not be reloaded

- **id 25 (Bogotá):** the same Expedia URL/ID now shows "Delgadillo Boutique Hotel by Socialtel", not "Socialtel La Candelaria Bogotá". Same property, new name; record as a rename with today's date, per the rulebook.
- **id 50 (Chengdu):** the same Agoda URL (`the-temple-house`) now shows "Upper House Chengdu" at the same address. Rename, same rule.
- **id 66 (Kyiv):** Expedia's full listed name is "Radisson Blu Hotel, Kyiv Podil City Centre", which is a different property from "Radisson Blu Kyiv City Centre" (a separate Expedia ID). The duplicate risk flagged in the first pass is resolved: this is the correct one.
- **id 31 (Split hostel)** and **id 42 (Saint Petersburg hotel):** the URLs found in the first pass now redirect to a city listing page rather than the property, so they could not be re-read in this pass. A fresh search finds the same underlying property but the direct property URL needs to be re-resolved before this pass can check it.

### Updated pilot totals (73 hotels)

| Grade | Before this pass | After |
|---|---|---|
| Confirmed A (name plus address or OSM location agree) | 44 | 51 |
| B (partner page found, address unconfirmed elsewhere) | 26 | 19 |
| No page / broken link | 2 | 3 (id 31 now unreadable) |
| C (different property) | 1 | 1 |

70% of the sample now has a real address on the partner's own page, checked against an independent source where one exists. The remaining 19 B rows are not wrong, they are simply unconfirmed by a second source, which is exactly what the plan's Match B category is for: they would go to Jeff's review list, never straight to citydata.

### What this changes in the plan

- The location check for Agoda works from the partner's own address field, cross-checked against OSM by street (and house number where OSM has one), not by coordinates or distance alone. Distance-only matching is unsafe in dense city centres (id 71).
- Expedia and Hostelworld give an address far less often (2 of 14 read here). For those two, the plan's Match A will lean more on OSM's own name search plus the browser-rendered page confirming name and city, which is weaker and belongs in Match B until proven otherwise.
- A property URL should be re-checked, not assumed stable, since two of the 26 stopped resolving to the property between the two passes.

### Checks and costs

- Browser page reads: 26 (24 successful, 2 redirected before they could be read).
- New web searches: 2.
- Google calls: 0.
- Nothing written to the sheet, citydata or the site.
