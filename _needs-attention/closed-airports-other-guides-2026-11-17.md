# Closed airports: the other 804 guides (2026-11-17)

**Your ask:** "check the other 800 guides for closed airports" (after the 89 war and unrest guides on 2026-11-16).

## How it was checked

- All 971 airports the 804 guides show (main airport plus `airports2`) were matched to OurAirports open data.
- **605 large airports with scheduled service:** checked by news searches for 2026 closures (works, storms, war, airspace, old airports replaced). One hit: Naples. Gulf airports (Doha, Dubai, Kuwait, Bahrain) are open again, Kuwait on reduced schedules. Cuba's fuel shortage cut flights but closed no airport. Pensacola and Puerto Vallarta reopened after October storms.
- **170 smaller or doubtful airports:** each checked against its Wikipedia airline table, plus news where needed. About 60 rest on that one source; the rest are well-known airports.
- Sheet tab "Airport Closures" and citydata were written by `airports_tool.py closures`; parity 0.

## Done

| Guide(s) | Airport | What the popup now says |
|---|---|---|
| Naples, Capri, Positano (main); Salerno (other) | Naples NAP | Closed 1 to 30 November 2026 for runway rebuilding; Salerno airport and a bus as the alternative |
| Potosí (main) | POI | No regular flights while the runway and terminal are rebuilt; flights planned from January 2027; Sucre as the alternative |
| Rouen (main) | URO | No scheduled flights since 2021; Paris CDG or Beauvais as the alternative |
| Lugano | LUG | Removed from the airport list (it said "very limited flights"; there have been none since 2019). The main airport is already Milan Malpensa |

## For you to decide

**(a) Naples note expires.** The closure ends 30 November. On 1 December, check that the airport has reopened, then delete the 4 Naples rows from the Airport Closures tab and run `airports_tool.py sync-closures`.

**(b) Reims, Paris-Vatry (XCR).** On 2026-11-16 it was kept, because the airport's own site and two schedule sites listed Ryanair to Marrakech and Porto for November 2026. Today's check found 2025 reports that Ryanair left Vatry in March 2025, but also schedule listings for April to October 2026. Under the "newer does not beat verified" rule, nothing was changed. Keep it, or remove it?

**(c) Season-only main airports.** These airports are not closed, but they have no flights at this time of year:
- Bern (BRN): summer leisure flights only.
- Salamanca (SLM): Volotea to Palma, 29 June to 3 September only.
- Grenoble (GNB): mainly ski-season flights.

Add a "seasonal flights only" note to them, or leave them as they are?

**(d) Not settled (no change made):**
- Cienfuegos (CFG): Wikipedia lists it as "Unscheduled".
- Baracoa (BCA): the only airline listed is undated.
- Trinidad, Cuba (TND): no airlines listed.
- Yamoussoukro (ASK): a 2-a-week Abidjan route with unclear dates.
- Kangding (KGT): may run March to October only.
- Santo Domingo, the other airport La Isabela (JBQ): not checked.
- Nouméa Magenta (GEA): today's check found a permit that ran to 30 September. Yesterday's sources, dated 29 September and 2 November 2026, say the programme was approved to February 2027, so it stays.

**(e) Wrong or weak airport in the guide (data fixes, not closures):**
- Nagano: the name carries "FDA", a Colombian airport. It should be Matsumoto, MMJ.
- Pokhara: PKR is the old airport. The new international airport is PHH.
- Apia: Fagali'i (FGI) flies only to Pago Pago. Samoa's main airport is Faleolo, APW.
- Kanazawa: Noto (NTQ) is far from the city. Komatsu (KMQ) is the usual airport.
- Poprad: the guide uses Košice, about 130 km away. Poprad has its own airport, TAT.
- El Chaltén: El Calafate airport is about 215 km by road, over the 200 km rule.
- Siargao and Kuala Lumpur: no valid IATA code in the name. They should be IAO and KUL.
- Rouen: the main airport has no flights. Swap the main airport to Paris CDG or Beauvais, with researched fares?

Say "go d16" with your calls.
