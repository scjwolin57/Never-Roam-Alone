# Day trips: open questions for Jeff (consolidated 2026-09-23)

One file for every open day-trip item. It replaces `_done/daytrip-alerts-calls.md`, `_done/daytrips-empty68-apply-flags.md`,
the "Left for Jeff" part of `_done/RESUME_daytrip-verify.md` and the leftovers of `_done/advisory-dropped-daytrips.md`
(all in `_done/` now, with their full history). Answer by number.

# A. Wrong content live on the site (fix soon)

**A1. Done 2026-09-23 (Jeff: replace).** Majuro's Outer Islets photo is now Commons "Eneko Islet 04" by Cliff
Hansen (CC BY-SA 4.0), from a set the author describes as a trip to Eneko islet, geotagged at OpenStreetMap's own
Eneko point; the same set includes the "Welcome to Eneko Island" sign. The Stromness (Orkney) photo is gone.

**A2. Done 2026-09-23 (Jeff: Arno stays a day trip; find another budget stay).** "Arno B&B" is on Arno Atoll, so
it is out. Budget slot now "Eneko Island cabin rooms": basic twin rooms at $45 a night (Very Hungry Nomads, updated
July 2025; Travel Obscure, visited August 2024: $45), inside Majuro's $45 budget band; booked at the RRE Hotel
desk. Same operator as the mid-range pick (Eneko Island Getaway, the $150 beach cottage). Tent camping ($10 per
person) exists but is not a hotel tier.

**A3. Done 2026-09-23 (Jeff: remove, placeholder).** The Cerro Frias photo is gone from the Walichu Caves slot; the
card shows "Image coming soon / Contribute". The Walichu photos Jeff found on Flickr (Rodrigo Sepúlveda Schulz, Ricardo
Cabral) are all CC BY-NC, so they need the photographer's permission first.

# B. Safety-alert calls  (closed 2026-09-24, Jeff: leave all three off)
An alert is shown only where a government's own words clearly cover the place. These are too vague to say, so
they have **no alert** until you decide. Your answer is recorded in `_guidebuild/daytrips/alerts/overrides.json`.

**B1. India: US "parts of Central and East India" (Maoist/Naxalite areas)**
The US says "Do Not Travel" to parts of Central and East India, "from eastern Maharashtra and northern
Telangana through western West Bengal", but names no districts or boundary. Read literally, three trips fall in it:
- **Warangal** (from Hyderabad), North Telangana
- **Bishnupur** (from Kolkata), Bankura district, western West Bengal
- **Shantiniketan** (from Kolkata), Birbhum district, western West Bengal
The attacks the US describes are in rural Chhattisgarh and Jharkhand. **Currently: no alert.**
Options: leave as is, or add "US: parts of Central and East India" to all three.
Source: https://in.usembassy.gov/travel-advisory-india-level-2-exercise-increased-caution/ (2025-06-18).

**B2. Egypt: US "Northern and Middle Sinai"**
The US says "Do not travel to the Northern and Middle Sinai Peninsula" but does not define "Middle". Coloured
Canyon (from Dahab and from Sharm El Sheikh) is inland in South Sinai governorate, about 12 km off the
Nuweiba road; the checker placed it in "Middle Sinai" by using Canada's map band. UK and Canada warnings
there are below top level. **Currently: no alert.** Options: leave as is, or add "US: Middle Sinai".
(Western Desert alerts for Qara, the Fayoum desert and Wadi El Natrun are kept: the US names the Western
Desert, and those places are in it geographically; the US "licensed tour company" condition does not lift it.)

**B3. Pakistan: Taxila (from Islamabad)**
One Taxila site, Jaulian, is just inside Haripur district, Khyber Pakhtunkhwa, which the US warns against as a
whole province. The museum, the town and the other main sites are in Punjab. **Currently: no alert.**
Options: leave as is, or add "US: Khyber Pakhtunkhwa (the Jaulian site)".

# C. Older day-trip questions

**C1. Zongo Falls (from Kinshasa).** The tour operator says 4 h each way; other pages say 2 to 3 h. Left out.
Add as a full-day trip (with its DR Congo alert), or leave out?
  **Done 2026-09-24 (Jeff): added as a full-day trip with the long-drive line and the DR Congo alert.**

**C2. Jacmel (from Port-au-Prince)** is live but was never verified: sources disagree on drive time. Keep, move
to full, or remove? (The old worry about gang violence is now an alert question, not a reason to remove.)
  **Done 2026-09-24 (Jeff: verify): Jacmel moved to full with the long-drive line (OSRM 88 min with no traffic; about 3 h per Wikivoyage and 2025 reports); Bassin Bleu, past Jacmel, got the same line.**

**C3. Cusco's Machu Picchu, Rainbow Mountain and Humantay Lake** run past 3 h each way. The 2026-09-23 rule
allows a full-day trip over 3 h if its blurb ends "Long drive time, look into overnight stay options." These
three do not have that line yet. Add it to all three?
  **Done 2026-09-24 (Jeff): all three kept; each blurb now ends with the long-drive line.**

**C4. Chiang Rai** has "Doi Mae Salong" as neighborhood 2 and "Mae Salong" as a half-day trip: the same place
twice (a hood is never a day trip). Which one goes?
  **Done 2026-09-24 (Jeff: day trip): Doi Mae Salong removed as a neighborhood; Mae Salong stays a half-day trip.**

**C5. Possible padding** flagged by the checker in older lists for Montevideo and Dushanbe (Tel Aviv's list was
rebuilt since). Re-research both lists?
  **Done 2026-09-24: Montevideo keeps 2 (Punta del Este fixed) and gains Atlántida, Juanicó winery, Piriápolis; Dushanbe keeps Kulob (fixed) and gains Hisor, Varzob Gorge, Nurek, Iskanderkul. Nothing padded.**

**C6. 360 day-trip entries were applied without an independent check** (batches 21-24 and 36 of the
verification pass, search budget ran out). Run the check now?
  **Done 2026-09-24: all 414 trips in those 129 cities re-checked, every correction checked again: 305 confirmed, 109 corrected (17 removed, 18 moved, 74 fixed). New questions it raised are D1-D3 below.**
# D. Found by the C6 re-check (2026-09-24)

**D1. Flores (Guatemala): "Tikal National Park" is a neighborhood AND a full-day trip.** Same pattern as Chiang Rai
(C4). Tikal is about 1 h 15 from Flores, a national park, not part of the town. Recommendation: keep the day trip,
remove the neighborhood (Flores would drop to 4 neighborhoods). Your call.
  **Done 2026-09-24 (Jeff: yes): neighborhood removed; Flores has 4.**

**D2. Port-au-Prince: Sans-Souci Palace (landmark) and Citadelle Laferrière (full-day trip) are both at Milot, next
to Cap-Haïtien**, 4 h or more away, and Cap-Haïtien has its own guide. Found by the C2/C5 checker (2026-09-24).
Recommendation: remove both from Port-au-Prince (they are Cap-Haïtien sights; the guide card already links there if
it is within range). Your call.
  **Done 2026-09-24 (Jeff: yes): landmark and day trip removed; Port-au-Prince has 7 landmarks.**

**D3. Hiroshima: Itsukushima Shrine and Mount Misen are landmarks, and "Miyajima (Itsukushima)" is also a half-day
trip.** Miyajima is in Hatsukaichi, a separate city about 50 min away, so by the rulebook ("a landmark is inside the
city; anything outside is a day trip") the two landmarks should leave Hiroshima's landmark list and the Miyajima trip
covers them. The C6 re-check wanted to remove the day trip instead; I kept it (2026-09-24) and left the landmarks for
you (same item as hoods-that-are-day-trips.md group 3). Recommendation: move both landmarks out; Hiroshima keeps 8.
  **Done 2026-09-24 (Jeff: yes): both landmarks removed; Hiroshima has 8; the Miyajima trip stays.**