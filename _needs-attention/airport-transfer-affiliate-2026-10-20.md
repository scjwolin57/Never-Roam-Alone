# Airport transfer affiliate: which program for "Book a transfer"? (2026-10-20)

**Question for Jeff (TODO D14):** which program should the "Car service" row in the airport
popup link to? Recommended: **Klook**, which you are already a member of. Nothing on the site
changes until you choose.

**Background.** The airport popup on city.html shows an average car service price
(`airport.carService`, 818 guides). Its "Book a transfer" link pointed nowhere and was removed
on 2026-10-20 (decisions.md). Kiwitaxi (39 guides) and Klook (27 China guides) links already
exist on the Car rental card. Rule followed: CLAUDE.md §4.4, every option compared on the same
date, pick and rejects logged.

All checks below were run on 2026-10-20. No account was created.

## 1. The programs

| Program | Commission | Cookie | Network | Per-airport page | Coverage claimed | Sign-up |
|---|---|---|---|---|---|---|
| **Klook** | about 4 to 5% on transport (third-party rate cards; your dashboard has the real rate) | 30 days | Klook's own | **Yes, one pattern from the airport code:** `klook.com/airport-transfers/service/<iata>/` opens that airport's page | worldwide | **None: you are a member** (`aid=139237`, already on 27 guides) |
| **Kiwitaxi** | 50% of Kiwitaxi's margin, which Travelpayouts puts at 9 to 11% of the order | 30 days | own (and Travelpayouts) | Partly: airport hub pages for most airports, but some (CDG, Athens, Bali) only have airport-to-town route pages | 100+ countries | **None: you are a member** (`pap=e6lwpod0n1w03`, on 39 guides) |
| Suntransfers | 4% (Awin profile and directories; own page says "competitive") | 30 days | CJ (program 4727627); an Awin profile also exists | Yes: `suntransfers.com/<airport-name>-airport` | worldwide | CJ account + approval |
| Welcome Pickups | flat €5 per transfer (own Tapfiliate program) or 8% (Travelpayouts) | 45 days | own (Tapfiliate) or Travelpayouts | City pages, but no single pattern (`/airport-transfer/`, `/airport-taxi/`, `/taxi/`, `/airport-to-city/` depending on city) | "353 destinations" | new account |
| GetTransfer | 25% new customers, 12.5% returning, 4.15% B2B | 30 days | Travelpayouts | Some: `/directions/<country>/<city>/airports/<name>`; often only a city page | 150+ countries | Travelpayouts account |
| Intui | 10% (English Travelpayouts page; an older figure was 6.5%) | 35 days | Travelpayouts | Not checkable: its sitemap loops (redirect error) | "4,500 airports and stations" | Travelpayouts account |
| HolidayTaxis | 8% (can rise with volume) | 30 days | Awin (also Travelpayouts) | Yes: `/en/transfers/<country>/<airport>/` | "21,000 resorts, 150 countries" | Awin account + approval |
| Jayride | not published ("generous") | 30 days | own | Yes: `/airport-transfer/<country>/<airport-iata>` | strongest in US, AU, NZ, UK, IE | new account |
| Mozio | **no public affiliate program** (B2B API and white-label for airlines and agencies) | | | `/airport-transfers/<city>-transfers` | | not open to sites like ours |
| Booking.com taxis | reported 4% on taxi rides, session-only tracking (no cookie) | session | CJ (Booking.com closed its direct program in June 2025) | none found: Booking.com publishes airport sitemaps for car rental, not for taxis | | CJ account |
| Transfeero | fixed amount, not published | 20 days | own | yes | 100 countries | new account; €250 payout minimum |
| Blacklane | listed as closed on affi.io; its commission scheme is for travel agents | | | | premium chauffeur only | not a fit |
| Hoppa | 5% | 30 days | Awin | | | Awin account (not sampled: same model as HolidayTaxis) |

## 2. Coverage sample: 25 guide airports (2026-10-20)

Mixed sizes, big hubs to small regional airports. FLL is checked as Miami's second airport; no
guide has FLL as its main airport (Miami's popup shows MIA). "Priced" means the page showed a
real fare from that airport; "page" means a landing page exists but its prices load only after
a search, so they were not read.

| Airport (guide) | Klook | Kiwitaxi | Suntransfers | Welcome Pickups | HolidayTaxis | Jayride | GetTransfer | Mozio |
|---|---|---|---|---|---|---|---|---|
| MIA (Miami) | $32 | $77 | €41 | €55 | page | $115 | page | page |
| FLL (Miami, 2nd) | $41 | $87 | €81 | no page (Miami page has a MIA to FLL route only) | page | $136 | page | page |
| JFK (New York) | $72 | $75 | €52 | €100 | page | page | page | page |
| LHR (London) | $87 | $104 | €72 | page | page | $175 | page | page |
| CDG (Paris) | $66 | route pages only | €27 | page | page | page | page | page |
| FCO (Rome) | $79 | $124 | €27 | page | page | page | page | page |
| DXB (Dubai) | $19 | $20 | €16 | page | page | page | no | page |
| BKK (Bangkok) | $16 | $32 | €26 | page | page | $33 | page | page |
| HND (Tokyo) | $46 | $69 | €101 | page | page | page | no | page |
| MEX (Mexico City) | $23 | $32 | €26 | page | page | no | page | page |
| CUN (Cancún) | $29 | $40 | €11 | page | page | page | page | page |
| LIS (Lisbon) | $16 | $40 | €13 | page | page | page | page | page |
| ATH (Athens) | $67 | route pages only | €21 | page | page | page | page | page |
| RAK (Marrakech) | $13 | $24 | €6 | page | page | no | no | page |
| CPT (Cape Town) | $24 | $53 | €33 | €24 | page | page, no price | city only | page |
| NBO (Nairobi) | $16 | $37 | €34 | €20 | no | no | city only | page |
| CUZ (Cusco) | $10 | no | €32 | €12 | no | no | no | no |
| HAN (Hanoi) | $13 | $29 | €21 | page | page | $16 | page | page |
| DPS (Denpasar, Bali) | $6 | route pages only | €9 | page | page | page | page | page |
| KEF (Reykjavík) | $114 | $68 | €161 | page | no | no | page | no |
| TBS (Tbilisi) | $26 | $30 | €32 | €20 | no | no | page | no |
| TIV (Kotor) | **no** | $42 | €43 | €30 | page | no | city only | no |
| WDH (Windhoek) | $76 | no | **not available** | €19 | no | no | no | no |
| USH (Ushuaia) | $25 | no | no | no | no | no | city only | no |
| LPQ (Luang Prabang) | $12 | $18 | €24 | no | no | no | no | no |
| **Airports with a link** | **24** | **22** (3 of them route pages only) | **23** | **22** | **18** | **15** | **15** | **18** |
| **One link pattern for every guide?** | **yes** (airport code) | no (look up per guide) | yes (name slug, look up per guide) | no (per city) | yes (look up per guide) | yes | no | n/a |

Prices are the lowest fare shown on that airport's page on 2026-10-20, in the site's own
currency (Klook, Kiwitaxi and Jayride in US$; Suntransfers and Welcome Pickups in euros). They
show that supply exists, not what the guide will display. The guide keeps its own
`carService` average.

How each column was checked: Klook, Welcome Pickups: the live pages in the browser.
Suntransfers, Kiwitaxi, Jayride: the live pages (each says "from X" or "currently not
available"). HolidayTaxis, GetTransfer, Mozio: their own sitemaps (page exists or not).

## 3. Recommendation: Klook

1. **No sign-up.** You are already a Klook affiliate; the same `aid=139237` already sets
   Klook's affiliate cookie on any klook.com page (checked 2026-10-14, decisions.md).
2. **Best coverage in the sample:** priced transfers at 24 of 25 airports, including the small
   ones the others miss (Cusco, Windhoek, Ushuaia, Luang Prabang). Only Tivat (Kotor) had no fare.
3. **One link rule for the whole site:** `https://www.klook.com/airport-transfers/service/<iata>/?aid=139237`.
   Klook turns the bare airport code into the named page. 744 of the 818 guides that show a car
   service price already have the code in the airport name, e.g. "Miami International (MIA)";
   the other 74 need their code looked up once.
4. **Prices in US dollars**, like the guide.

**Weak points, said plainly.**
- Commission is lower than Kiwitaxi's (about 4 to 5% against 9 to 11%). Check the transport
  rate in your Klook dashboard before deciding.
- **A page exists even for an airport Klook has no fares at** (a made-up code, ZZQ, also
  opened a page). Wiring it therefore needs a per-guide check that the page lists at least one
  fare, and no link where it does not (Tivat today). That check is a small script, run the
  same way as the DiscoverCars coverage check.

**Option B, more money per booking but more work:** Kiwitaxi where it has a priced airport hub
page (you are a member there too), Klook everywhere else. Two programs on one row means two
lookups per guide and a longer affiliate line.

## 4. Rejected, with the reason

| Program | Why not |
|---|---|
| Suntransfers | Very good coverage (23 of 25, priced) but needs a CJ account and approval, pays about 4%, and offers nothing Klook does not. **Best fallback** if Klook's dashboard rate for transfers turns out to be very low. |
| Welcome Pickups | Good coverage (22 of 25) and a 45-day cookie, but a flat €5 per booking on its own program, a new account, and no single link pattern: every city's page has to be found by hand. |
| GetTransfer | Highest rate for new customers (25%), but it is a bidding marketplace (drivers send offers after you ask, so no fixed price at the click), airport pages for only 15 of 25, and it needs a Travelpayouts account. |
| Intui | 10%, but its sitemap was unreachable (redirect loop), so its coverage could not be checked today. Not picked on unverified coverage. |
| HolidayTaxis | 8% on Awin, but airport pages for only 18 of 25 (none for Nairobi, Cusco, Reykjavík, Tbilisi, Windhoek, Ushuaia, Luang Prabang) and a new Awin account. |
| Jayride | Commission not published; strong only in the US, Australia, NZ, UK and Ireland (15 of 25); Cape Town page showed no fares. |
| Mozio | No public affiliate program; it sells to airlines and agencies through an API. |
| Booking.com taxis | Program moved to CJ in 2025; reported 4% with session-only tracking (the sale counts only if booked in the same visit); no per-airport taxi pages found. |
| Transfeero | Fixed commission not published, 20-day cookie, €250 minimum payout. |
| Blacklane | Premium chauffeur service only; public program listed as closed; its commission is for travel agents. |
| Hoppa | 5% on Awin, same model as HolidayTaxis; not sampled. |

## 5. What happens after you choose

- **Klook (recommended):** a script finds each guide's airport code, opens the Klook page,
  keeps the link only where at least one fare is listed, and writes a site-only key (like
  `klookcar`). city.html puts "Book a transfer →" · "on Klook" back on the Car service row,
  with the affiliate line. Sheet: site-only, noted in the parity note. Full §5.3 protocol
  (inventory, schema, add_city, skill) in the same commit.
- **Option B:** the same, plus a Kiwitaxi airport lookup from its sitemap first.
- **Another program:** sign up first (TODO section 2), then the same wiring.

## Sources (checked 2026-10-20)

- Klook airport pages: `klook.com/airport-transfers/service/<iata>/` for the 25 codes, read live; commission: Involve Asia and Ecomobi rate cards (third-party).
- Kiwitaxi: [Travelpayouts offer](https://www.travelpayouts.com/en/offers/kiwitaxi-affiliate-program), [Kiwitaxi partner page](https://kiwitaxi.com/en/partner/webmaster), sitemap `kiwitaxi.com/sitemap_index.xml`.
- Suntransfers: [own affiliate page](https://www.suntransfers.com/affiliate-program), [Awin profile](https://ui.awin.com/merchant-profile/111238), sitemap.
- Welcome Pickups: [Tapfiliate program page](https://welcome.tapfiliate.com/), [Travelpayouts offer](https://www.travelpayouts.com/en/offers/welcome-pickups-partner-program), sitemap read in the browser.
- GetTransfer: [Travelpayouts offer](https://www.travelpayouts.com/en/offers/gettransfer-affiliate-program), sitemap.
- Intui: [Travelpayouts offer](https://travelpayouts.com/en/offers/intui-travel-affiliate-program).
- HolidayTaxis: [Awin profile](https://ui.awin.com/merchant-profile/15375), sitemap.
- Jayride: [FlexOffers listing](https://www.flexoffers.com/affiliate-programs/jayride-com-affiliate-program), sitemap.
- Booking.com: [Makeinfluence guide](https://www.makeinfluence.com/en/academy/booking-coms-affiliate-program-how-travel-creators-earn-commission) (single secondary source), booking.com robots.txt.
- Transfeero: [help article](https://help.transfeero.com/en/articles/10201807-transfeero-affiliate-program). Blacklane: [affi.io](https://affi.io/m/blacklane). Hoppa: [Awin profile](https://ui.awin.com/merchant-profile/5511).
