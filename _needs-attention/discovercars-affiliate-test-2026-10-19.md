# DiscoverCars: do affiliate visitors see fewer companies outside the US? (test 2026-10-19)

**Question for Jeff:** the gap is not only in the US. Europe shows none, but Toronto loses Enterprise and National. Send DiscoverCars partner support the follow-up with these numbers, and decide whether the US and Canadian guides should use Trip.com for the car link instead.

## How it was run
- Same search everywhere: pick-up and return at the airport, Wed 21 Oct to Thu 29 Oct 2026, 11:00, driver resident in the USA, age 30 to 65, prices in USD.
- **Without the tag:** the built-in browser before it had ever opened an affiliate link (DiscoverCars' `trafficSource` cookie read `direct-none`), and for Newark and Toronto Jeff's Chrome (also `direct-none`; no tagged link was opened there).
- **With the tag:** the built-in browser after opening `https://www.discovercars.com/?a_aid=NRA2026` (`trafficSource` = `postaffiliatepro-affiliate`).
- The marker sticks: after clearing the cookie the server set `postaffiliatepro-affiliate` again on the next visit (it is kept against the visitor ID, not only in the cookie).

## Results

| Airport | Without tag | With `?a_aid=NRA2026` | Companies missing with the tag |
|---|---|---|---|
| Paris CDG | 230 offers, 11 companies | 233 offers, 11 companies | none |
| London LHR | 627 offers, 19 companies | 627 offers, 19 companies | none |
| Rome FCO | 954 offers, 38 companies | 993 offers, 39 companies | none (Sicily By Car added) |
| Toronto YYZ | 281 offers, 18 companies | 229 offers, 16 companies | **Enterprise, National** |
| Newark EWR (US) | 152 offers, 9 companies | 49 offers, 4 companies | **Alamo, Avis, Budget, Enterprise, National** |

Newark today matches the 2026-10-14 test (152 offers from 8 companies then; 51 offers with the tag).

## What it means
- In Europe, affiliate visitors see the same companies as direct visitors.
- In North America the big brands drop out for affiliate traffic: Enterprise Holdings (Enterprise, National, and in the US also Alamo) and, in the US, Avis Budget (Avis, Budget). This looks like a supplier rule against affiliate traffic in those markets, not a fault in our link.
- Trip.com does not do this (EWR, 2026-10-14: 272 offers from 10 companies with or without our tag).

## Options
1. Send DiscoverCars the follow-up with this table (US and Canada, which brands, both searches as a US resident aged 30 to 65).
2. If they cannot change it, point the car link of the 34 US guides and the 17 Canadian guides to Trip.com (`tripcar`), keeping DiscoverCars elsewhere.
3. Keep as is (readers still get offers, but fewer and pricier in North America).
