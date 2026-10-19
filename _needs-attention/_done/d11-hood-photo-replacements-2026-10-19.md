# D11: replacement hood photos (researched 2026-10-19)

**Applied 2026-10-19** (Jeff: "yes, d11"). All 8 below are live in hood-photos.js and the sheet.
Before / after picture: `d11-hood-photo-replacements-2026-10-19.jpg`
(left = the photo on the site now, right = the proposed photo, cropped 3:4 as the card shows it).

## What I found about the current photos

- **3 of the 8 are a copyright problem, not just a dead link.** Commons deleted them for that reason:
  - Barri Antic shows the new Consell General building. Commons deleted it on 2024-04-13 in a request about that building. Andorra has no freedom of panorama, so modern buildings there are protected.
  - Escaldes-Engordany shows the Caldea spa (1994), a modern building in Andorra. Same rule.
  - Østerbro shows the Little Mermaid. The statue is under copyright until 2030, and Danish law does not allow commercial use of photos of statues. Commons deleted it on 2013-09-29 and again on 2015-04-19 as a copyright violation.
  - These 3 should come down whatever else is decided.
- The other 5 (Pixabay or Pexels stock with no place data) are not provably wrong. The replacements below are provably in the right place.

## The proposed photos

All from Wikimedia Commons. Every licence allows commercial use with credit.

| Hood | Proposed photo | Location evidence | Licence, author, date | Size |
|---|---|---|---|---|
| Andorra la Vella / Barri Antic (Centre Històric) | [041 Sant Esteve, capçalera i campanar](https://commons.wikimedia.org/wiki/File:041_Sant_Esteve_(Andorra_la_Vella),_cap%C3%A7alera_i_campanar.JPG): Romanesque apse and bell tower with the mountains | GPS 65 m from the hood point; category Sant Esteve, Andorra | CC BY-SA 3.0, Enfo, 2013 | 1600×1200 |
| Andorra la Vella / Escaldes-Engordany | [Pont d'Engordany WLM Photwalk](https://commons.wikimedia.org/wiki/File:Pont_d%27Engordany_WLM_Photwalk.JPG): the medieval bridge over the Valira | GPS 330 m; category Pont d'Engordany | CC BY-SA 3.0, Vriullop, 2013 | 3872×2592 |
| Copenhagen / Osterbro | [Østerbrogade before the Tour de France Grand Départ](https://commons.wikimedia.org/wiki/File:Copenhagen_getting_ready_for_the_Grand_Depart_of_the_Tour_de_France_2022_(52170194503).jpg): the main street with its façades | category Østerbrogade (no GPS) | CC BY-SA 2.0, Lars K Jensen, 2022 | 5496×3672 |
| Pattaya-Chonburi / Jomtien Beach | [Jomtien Beach (11)](https://commons.wikimedia.org/wiki/File:Jomtien_Beach_(11).jpg): palms, sand, sea | category Jomtien Beach (no GPS) | CC BY-SA 4.0, Georgy Dolgopsky, 2008 | 2816×2112 |
| Skopje / Vodno | [Green view](https://commons.wikimedia.org/wiki/File:Green_view_(28991642878).jpg): the wooded Vodno slope above the city | GPS on Vodno, 1.1 km from the hood point; category Vodno | CC BY 2.0, aiva., 2018 | 4132×3124 |
| Miami / Brickell | [Icon Brickell 2](https://commons.wikimedia.org/wiki/File:Icon_Brickell_2.jpg): Brickell towers from above | GPS 1.2 km (Icon Brickell, inside Brickell); categories Brickell, Miami and Brickell Avenue | CC BY 4.0, Periodismodepaz, 2024 | 4032×2268 |
| San Francisco / Chinatown | [Chinese gateway, San Francisco](https://commons.wikimedia.org/wiki/File:Chinese_gateway,_San_Francisco.jpg): the Dragon Gate at Grant and Bush, Chinatown's entrance | category Dragon Gate, San Francisco (no GPS) | CC BY-SA 4.0, Mike Peel, 2012 | 5184×3456 |
| Orlando / Winter Park | [Park Ave Shoppes 04](https://commons.wikimedia.org/wiki/File:Park_Ave_Shoppes_04.JPG): tree-lined Park Avenue | category Park Avenue, Winter Park, Florida (no GPS) | CC BY-SA 4.0, Miosotis jade, 2010 | 2816×2112 |

## Notes and alternatives

- **Andorra: only old subjects.** With no freedom of panorama, I avoided anything built recently:
  - Sant Pere Màrtir in Escaldes was rejected: built 1956, its architect died in 1973, so it is protected until 2043.
  - Wide shots of Sant Esteve were rejected: they include the 1940s extension by Puig i Cadafalch, protected until 2027.
  - Casa de la Vall was rejected because Prat de la Creu already uses it.
  - The Barri Antic file is only 1600 px wide. It will be enlarged about 1.2 times for the 1080×1440 card. Alternative: [Andorra (29728725748)](https://commons.wikimedia.org/wiki/File:Andorra_(29728725748).jpg), 5472 px, but it shows the 1940s extension.
- **Escaldes crop:** the bridge sits left of centre, so the crop will be shifted left so the arch fills the card.
- **Østerbro:** the street has Tour de France bunting (June 2022). Calmer alternative: [Filosofgangen](https://commons.wikimedia.org/wiki/File:Filosofgangen.jpg), a path in Fælledparken (CC BY-SA 3.0, Leif Jørgensen), which is plainer.
- **Jomtien:** alternative with GPS 45 m from the hood point: [DFC 5141 Twilight on Pattaya Beach](https://commons.wikimedia.org/wiki/File:DFC_5141_Twilight_on_Pattaya_Beach_evening_lights_begin_to_glow_as_locals_and_visitors_stroll_the_shoreline_with_the_city_skyline_rising_in_the_distance.jpg) (PattayaPatrol, 2026), a darker dusk shot. Its title says "Pattaya Beach" but the GPS is on Jomtien.
- **Brickell:** the 2010 street view [Brickell Avenue 20100203](https://commons.wikimedia.org/wiki/File:Brickell_Avenue_20100203.jpg) is the alternative; the 2024 aerial is closer to how Brickell looks now.
- **Not found / not used:** any photo whose only evidence was its title.

## Side finding (not part of D11)

Other Andorra la Vella hood photos may have the same problem. Avinguda Meritxell is a street of modern buildings. Prat de la Creu shows Casa de la Vall, which is old and fine. Worth one check in a later photo pass.

## If approved (how it gets applied)

1. Download the original from Commons.
2. Crop 3:4 to 1080×1440 and 720×960 webp, same file names, so the old images are replaced.
3. Update `hood-photos.js`: new `page` link and `src` = author.
4. Update the sheet's Hood N Photo File / Credit cells through `sheet_write.py`. This waits if another task holds the sheet.
5. Run `check_sheet_parity.py` (must read 0).
6. Check the cards in the browser at 320, 375 and desktop.
7. Commit by path, then strike D11 in TODO.md.
