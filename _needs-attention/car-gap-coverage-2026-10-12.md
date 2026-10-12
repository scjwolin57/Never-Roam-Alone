# Car rental gap: Trip.com, Klook and GetYourGuide coverage (2026-10-12)

**Question for Jeff:** join Trip.com, Klook, both, or neither? Nothing on the site changes until you join and send the partner link.

## What was tested

The 167 guides with no DiscoverCars link and no Kiwitaxi link, minus:
- the 13 war-zone countries (now carry a "before you rent" note, commit 5af479d3);
- the sanctioned countries (Russia, Iran, Belarus, North Korea, Cuba);
- Hebron, Nablus, Capri (do-not-link) and Thimphu (no link, decisions.md 2026-10-06: guide and driver required).

| Program | Test | Date |
|---|---|---|
| Trip.com (self-drive) | its own location search, then a real dated search: pick-up and return at the same place, 11 to 14 Nov 2026, driver 30 to 60 | 2026-10-12 |
| Klook (car with driver, "car charter") | its site search for "<city> car charter", then the result labels "Car charters • <city>" matched on the whole city name | 2026-10-12 |
| GetYourGuide (private driver tours) | not testable: every automated search hit a Cloudflare bot check. Not bypassed. | 2026-10-12 |

Two Trip.com name matches were wrong and are dropped: Harar matched Harare (Zimbabwe) and Weno matched Wenonah (USA).

## Results

| | Guides |
|---|---|
| Trip.com has bookable cars | 32 |
| Klook has a car charter starting in the city | 19 |
| Both | 8 |
| Either one | **43** |
| Klook only as a destination from another city (Leshan from Chengdu, Quanzhou from Xiamen, Shangri-La from Lijiang) | 3 (not counted) |
| Neither | 121 |

### Trip.com: 32 guides (cheapest car per day, companies seen)

| Guide | Pick-up | From | Companies |
|---|---|---|---|
| Addis Ababa | Bole airport | $40 | Europcar, Fox |
| Apia | Faleolo airport | $59 | Hertz |
| Bandar Seri Begawan | Brunei airport | $63 | Hertz |
| Bandung | Husein Sastranegara airport | $58 | Investaxi |
| Basseterre | SKB airport | $45 | Avis, Dollar, Hertz, Thrifty |
| Beppu | Beppu Station | $37 | Nippon, Nissan, Times, Toyota, NoahsArk |
| Caracas | Simón Bolívar airport | $81 | Street Rent a Car |
| Castries | Castries | $44 | Ace, Budget, Drive A Matic, Europcar, Fox, more |
| Charlotte Amalie | STT airport | $33 | Ace, Avis, Dollar, Hertz, Thrifty |
| Cotonou | Cadjehoun airport | $52 | Avis, Hertz |
| Cusco | Velasco Astete airport | $22 | Dollar, Europcar, Flexways, Fox, Hertz, more |
| Gustavia | Gustaf III airport | $45 | Flizzr |
| Gyeongju | Gyeongju Station | $56 | Avis, Budget, Hertz, Lotte |
| Hanoi | Noi Bai airport | $81 | Golden Sunrise |
| Hirosaki | Hirosaki Station | $43 | Nippon, Nissan, Orix, Times, Toyota |
| Ho Chi Minh City | Tan Son Nhat airport | $66 | Golden Sunrise |
| Hong Kong | HKG airport | $91 | AL, AutoBright, Avis, Le Voyage, Vang Iek |
| Jeonju | Jeonju Station | $83 | Hertz, Lotte |
| Koror | Palau airport | $54 | Alamo, Enterprise, National |
| Kurashiki | Kurashiki Station | $43 | Nippon, Nissan, O-Car, Times, Toyota |
| Macau | Macau airport | $73 | Samwo |
| Makassar | Hasanuddin airport | $39 | Trac Astra |
| Malang | Abdul Rachman Saleh airport | $31 | Trac Astra |
| Mataram | Mataram | $22 | EasyRent, Trac Astra, Vibes Lombok |
| Medan | Kualanamu airport | $34 | Trac Astra |
| Nassau | Lynden Pindling airport | $86 | Avis, Budget, Dollar, Flexways, Hertz, more |
| Ouarzazate | Ouarzazate airport | $17 | Avis, Budget, Dollar, Europcar, Fox, more |
| Papeete | Faa'a airport | $40 | Fox, Hertz, Thrifty |
| Port Moresby | Jacksons airport | $104 | Hertz |
| Praia | Nelson Mandela airport | $50 | Europcar, Hertz |
| Roseau | Roseau | $50 | Ace, Avis |
| Santa Cruz de la Sierra | Santa Cruz | $41 | Europcar, Hertz |

Prices are one search on 2026-10-12 for 11 to 14 Nov 2026, shown only to judge coverage; nothing here goes on the site. Hanoi and Ho Chi Minh City have one local supplier only; Vietnam accepts only the 1968 version of the permit (a US licence with a US permit is not valid there), so these two would keep their "before you rent" note first.

Trip.com does not list mainland China cities in its English car hire (22 of the 121 "neither" guides are in China).

### Klook: 19 guides with a car charter starting in the city

Bandung, Chaozhou, Dali, Datong, Gyeongju, Hanoi, Hong Kong, Huangshan, Jeonju, Jodhpur, Kunming, Lijiang, Luoyang, Macau, Malang, Medan, Zhangye, Zhaoqing, Zhuhai.

11 of these are new beyond Trip.com, 10 of them in China and 1 in India (Jodhpur).

### Neither: 121 guides, most common countries

China 22 (Trip.com does not list them; 10 others are on Klook), India 6, Ethiopia 6, Indonesia 6, Bangladesh 6, Algeria 5, Pakistan 5, Nigeria 4, Philippines 3, then 1 or 2 each in about 40 more countries. These stay with no booking link. The card already shows the price row and the permit row.

## Program terms (as read, not yet joined)

| | Trip.com | Klook |
|---|---|---|
| Commission on car rental | 5% | 5% |
| Also pays on | airport transfers (5%) | car charters, transfers |
| Cookie | 30 days | 7 days |
| Network | Awin, or Trip.com's own program | Involve Asia, or Klook's own program |
| Payout | completed trips only; $200 minimum by bank | completed bookings |
| Source, date read | Trip.com affiliate page (dated May 2026), 2026-10-12 | Klook affiliate page, 2026-10-06 |

## Recommendation

- **Trip.com: worth joining.** 32 guides, self-drive like DiscoverCars, longer cookie. It would be a third link on the same card, only on those 32 guides.
- **Klook: optional.** 11 extra guides, mostly in China, and it is car-with-driver like Kiwitaxi. Short cookie.
- **GetYourGuide** is already your day-trip partner. Its private-driver coverage could not be tested here. Please spot-check one live "Tours to ..." link on a day-trip card while you are there; during the test, GetYourGuide answered automated searches with the wrong page (an Italian truffle hunt), most likely its bot defence, but worth one look.

## If you join

Send the partner link. Then, in one commit, as for Kiwitaxi: a site-only key on the 32 (and/or 19) guides, the link on the Plate 03 card, the affiliate line naming the partner, the city.html inventory row in CLAUDE.md, the schema, the add-city scripts and a decisions.md row.
