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

## Update 2026-11-22 (Jeff: "check D16, make any notes that need to be made regarding airports")

These airports are not closed. Their notes went on the airport's own note line, so the popup gives no "closed" tag. The schema says a quiet airport is not closed.

| Item | Result | Sources |
|---|---|---|
| (b) Reims, Vatry | Kept, no note. Ryanair Marrakech–Vatry flights are still tracked (19 Nov 2026) | flightaware.com RYR4407; aeroports-voyages.fr XCR programme |
| (c) Bern | Note: few scheduled flights, mostly summer holiday routes; fly into Zurich or Geneva and take the train | travelnews.ch summer 2026 list; fluggesellschaft.de (almost no scheduled service since SkyWork, 2018) |
| (c) Grenoble | Note: flights mainly in the ski season (about December to April), mostly to and from the UK; Lyon at other times | aeroports-voyages.fr GNB (5 Dec 2026 to 11 Apr 2027); francebleu.fr (Edeis: traffic mainly in winter); Wikipedia (Jet2 seasonal) |
| (c) Salamanca | Note: the only regular route is Volotea to Palma in summer; otherwise occasional charters; Madrid | lagacetadesalamanca.es 23 Aug 2026; salamancahoy.es 23 Oct 2026 |
| (d) Kangding | Note: few, seasonal flights (Sichuan Airlines to Chengdu, about twice a week, mainly July to October) | flightconnections.com and flightsfrom.com (aggregators, Sep 2026); Wikipedia |
| (d) Yamoussoukro | Note: no scheduled passenger flights found in 2026; fly into Abidjan | aircotedivoire.com route pages (no Yamoussoukro); flightsfrom.com/ASK (no direct flights) |
| (d) Cienfuegos, Baracoa | Note: few and irregular flights in 2026 (Cuba jet-fuel shortage); check with the airline | cubaheadlines.com (no jet fuel at 10 airports until 1 Dec 2026); Flightradar24 CFG; Baracoa CU826 cancelled (June 2026 tracker) |
| (d) Trinidad, Cuba | Note: no scheduled flights found in 2026; most visitors arrive by road | Wikipedia (no airlines listed); cubaheadlines.com fuel shortage |
| (d) Nouméa Magenta | Kept (the programme is approved to Feb 2027; 2026-11-16 sources) | |
| (d) Santo Domingo, La Isabela (JBQ) | Not checked | |

**Still open:** (a) remove the Naples note on 1 December, once the airport has reopened. (e) the 9 data fixes.
