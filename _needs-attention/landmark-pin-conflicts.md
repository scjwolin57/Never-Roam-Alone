# Landmark pins: protected slots where the new check disagrees

The pin pass of 2026-09-22 never overwrites a slot that a September coordinate
commit set (93 slots, 4 of them from Jeff's own map pins). It compared them
instead. Six disagree with OpenStreetMap or Wikidata by more than 2 km. Five are
the check being wrong; one is a real error that needs Jeff's call.

## Needs a decision

| City | # | Landmark | Stored now | Second source | Gap |
|---|---|---|---|---|---|
| Quito | 3 | El Panecillo | -0.1877581, -78.5164366 | Wikidata Q1871347, El Panecillo hill: -0.22861, -78.51861 | 4.5 km |

**What happened.** Before 16 September the pin was -0.2303178, -78.5192298,
which is 0.2 km from the hill. The commit `3a04f7d2` ("Sweep the CSV's 1-5km
band: 8 fixes from 371 rows") moved it 4.7 km north, to a point in the north of
Quito. Wikidata, the Virgin of El Panecillo item and Cerro Panecillo all agree
with the older value. The sweep's own note lists El Panecillo as one of eight
"compact point landmarks genuinely in the wrong spot", so the move was
deliberate, which is why this pass left it alone.

**Recommended:** restore -0.2303178, -78.5192298 (or use Wikidata's
-0.228611, -78.518611). The same sweep changed seven other pins the same way;
they agree with OSM or Wikidata and are fine:
Port Elizabeth Bayworld, Bengaluru St Mary's Basilica, Juba Bridge, Kigali
Caplaki, Quetzaltenango Fuentes Georginas, Oran Fort Santa Cruz, Cienfuegos
Palacio de Valle.

## Checked and fine (no action)

| City | # | Landmark | Why the gap is not an error |
|---|---|---|---|
| León | 9 | Parque Central de León | OSM matched a Parque Central in Achuapa, 76 km away |
| León | 0 | Catedral de León | OSM matched a cathedral 29 km away; the stored pin is on León's own |
| Medan | 6 | Lake Toba | The lake is about 100 km long; both points are on it |
| Ohrid | 6 | Old Bazaar and Čaršija | Wikidata matched an Old Bazaar 46 km away in Bitola |
| Murree | 7 | Ayubia National Park | A park, not a point; both values are inside it |
