# Landmark pins: protected slots where the new check disagrees

The pin pass of 2026-09-22 never overwrites a slot that a September coordinate
commit set (93 slots, 4 of them from Jeff's own map pins). It compared them
instead. Six disagree with OpenStreetMap or Wikidata by more than 2 km. Five are
the check being wrong; one is a real error that needs Jeff's call.

## Resolved

**Quito [3] El Panecillo — fixed 2026-09-22.** Jeff: "you can use the Virgin of El Panecillo
coordinates if that helps, same place". Set to -0.2286111, -78.5186111, which Wikidata gives
for both the hill (Q1871347) and the Virgin (Q6163386), and which is 0.2 km from the pin the
16 September sweep replaced.

| City | # | Landmark | Was | Now |
|---|---|---|---|---|
| Quito | 3 | El Panecillo | -0.1877581, -78.5164366 (4.5 km north of the hill) | -0.2286111, -78.5186111 |

The same sweep (`3a04f7d2`) changed seven other pins the same way; each was checked against
OSM or Wikidata in this pass and is right: Port Elizabeth Bayworld, Bengaluru St Mary's
Basilica, Juba Bridge, Kigali Caplaki, Quetzaltenango Fuentes Georginas, Oran Fort Santa Cruz,
Cienfuegos Palacio de Valle.

## Checked and fine (no action)

| City | # | Landmark | Why the gap is not an error |
|---|---|---|---|
| León | 9 | Parque Central de León | OSM matched a Parque Central in Achuapa, 76 km away |
| León | 0 | Catedral de León | OSM matched a cathedral 29 km away; the stored pin is on León's own |
| Medan | 6 | Lake Toba | The lake is about 100 km long; both points are on it |
| Ohrid | 6 | Old Bazaar and Čaršija | Wikidata matched an Old Bazaar 46 km away in Bitola |
| Murree | 7 | Ayubia National Park | A park, not a point; both values are inside it |

## RETIRED 2026-09-23
Quito El Panecillo pin fixed in 1467abfe; the other 5 needed no action.
