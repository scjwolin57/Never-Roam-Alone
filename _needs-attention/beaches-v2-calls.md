# Beaches v2: six calls before the new score goes live

*2026-09-24. All 893 cities are researched and independently checked (36 batches, in the sheet's Beaches tab).
The finder still shows the old score. Once these calls are made, the Beaches Score column and `city-scores.js`
switch in one commit. Each call lists what it changes; my recommendation is first.*

## 1. Beaches across an international border: count them?
The research timed them but batches treated them differently, so this needs one rule.
Cities affected (beach, drive time without border waits):
Johor Bahru (Singapore, 20 min), Goma (Gisenyi, Rwanda, 5), Vaduz (Walenstadt CH 25, Bregenz AT 41, its only
beaches), Nablus (Israel via checkpoint, 48), Nicosia (north, about 47), Shenzhen (Hong Kong, 29 to 32), Zhuhai
(Macau, 30), Trier (Echternach LU, 36), Strasbourg (German lakes, 29 to 31), Lomé (Ghana, 8), Eilat (Taba EG 14,
Aqaba JO 34), Encarnación (Posadas AR, 19), Puerto Iguazú (Foz do Iguaçu BR, 28), Tangier (Tarifa by ferry, 29),
Lugano (Campione, Italian enclave, 15), Detroit (Canada), Porto-Novo and Cotonou (Nigeria).
- **A (recommended): count them only where the crossing is routine for visitors** (EU/Schengen, Switzerland,
  Liechtenstein, Singapore/Johor, Macau/Zhuhai, Campione), and not where it needs a visa run, a permit or a sea
  crossing (Nablus, Nicosia north, Goma, Tangier, Lomé, Eilat, Shenzhen–Hong Kong, the Americas pairs).
- B: count all of them. C: count none.

## 2. The Caspian: sea or lake?
Geographically a lake. Affects Baku (Shikhov Beach 15 min): lake gives 22, sea gives about 90.
- **A (recommended): sea.** Baku's Caspian shore is a sea-beach resort in every practical sense.
- B: lake (as written today).

## 3. "Advised against swimming" (not a ban): does it fail a beach?
Beirut (Ramlet al-Baida, sewage advice, 2025 CNRS report; next beach Jiyeh 25 min) and Saint Petersburg (Gulf of
Finland beaches not approved in 2025; nearest sea beach Duny 39 min).
- **A (recommended): advice fails the beach when it is the health authority's own current finding** (both cases).
  Beirut drops from 87 to about 70; Saint Petersburg stays a lake city (12).
- B: only a ban fails a beach. Beirut stays 87; Saint Petersburg becomes a sea city (31 to 60 min band).

## 4. Montevideo: are the Río de la Plata city beaches sea?
The estuary rule makes them river beaches (22). Unlike Buenos Aires, they are real, heavily used swimming beaches
and the water there is brackish and much closer to open sea.
- **A (recommended): sea for Montevideo** (its eight city beaches from 4 min; score about 90). Buenos Aires stays 0.
- B: river (22), as the rule is written.

## 5. Mont-Saint-Michel: measure from the Mont or from the mainland car park?
From the Mont the nearest bathing beaches are 72 to 76 min (the car-free causeway adds about 25), so 0. From the
car park where visitors arrive by car, 40 to 46 min (about 45).
- **A (recommended): the car park**, since every visitor with a car starts there.
- B: the Mont (0).

## 6. Four city centre points are off (fix, then re-time)
Sapporo "Kita" hood (7.8 km north of the station; neighborhood point, not the city), Cartagena (6 km east of the old
town), Hạ Long (in the bay, 3.7 km offshore), Davao (well inland of downtown). The last three are the city
centre point every drive time is measured from.
- **A (recommended): move each to its old town / city hall from OpenStreetMap, then re-time those cities' beaches.**
