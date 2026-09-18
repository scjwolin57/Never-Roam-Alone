# Neighborhood photo provenance audit — COMPLETE

> **Status 2026-09-18: section 1 (the 19 wrong-district photos) is resolved.**
> The 2026-09-15 re-sourcing (`1c906cbf`) had left 18 of them live. Now:
> - **14 replaced** with photos whose GPS reverse-geocodes (OpenStreetMap) inside the
>   right district, or whose Commons category is the district: Porto/Baixa (picked
>   by Jeff), Vaduz/Triesen (supplied by Jeff), Verona/Centro Storico, Verona/Veronetta,
>   Amsterdam/Oud-West, Bangkok/Bang Rak, Riga/Art Nouveau District, Moscow/Khamovniki,
>   Chișinău/Telecentru, Buiucani and Rîșcani, Helsinki/Punavuori, Reykjavík/Vesturbær,
>   Cancún/Downtown.
> - **3 removed, nothing verifiable exists**, so the tile shows the labelled city
>   stand-in with "No photo yet / Contribute a photo": Jeddah/Al Andalus (the "Al
>   Andalus Mall" is in Al Faiha'a), Marrakech/Hivernage, Riyadh/Al Nakheel (only KAFD
>   photos, and Riyadh has its own KAFD hood).
> - **Sharjah/Al Majaz** had already been replaced; the new photo checks out (GPS in Al Majaz).
> - **Orlando/Thornton Park** is a dead entry: Orlando's guide no longer has that hood,
>   so the photo is never shown. Left as is.
>
> Sections 2–4 (52 judgement calls, 5 missing source pages, 66 uncheckable) have not
> been re-checked.

All 583 hero photos from the July 2026 sourcing pass have been checked against their
Commons record (description, categories, GPS, Wikidata P131/P276) and reverse-geocoded
where coordinates exist. The 40 added 2026-08-24 were coordinate-verified at sourcing
time and are excluded.

**Why this was needed:** the July pass matched a photo's *subject* to a neighborhood from
knowledge and never checked location. Jeff spotted Miami/Wynwood using a file literally
named `Midtownmiamicenter.jpg`.

**Rule applied throughout: nothing asserted without a source.** Every verdict cites the
category, coordinate or Wikidata claim that decided it. Anything unsourceable is marked
UNCHECKABLE rather than guessed at. A stock-photo URL slug is *not* treated as evidence of
location — though a slug naming a different place is reported.

## Results

| Verdict | Count | Share |
|---|---|---|
| CORRECT | 441 | 76% |
| **WRONG DISTRICT** | **19** | **3%** |
| JUDGEMENT CALL (defensible but loose) | 52 | 9% |
| FILE NOT FOUND (source page 404s) | 5 | 1% |
| UNCHECKABLE (no Commons record) | 66 | 11% |
| **Total** | **583** | |

---

## 1. Wrong district — replace these 19

Ordered worst first.

| City | Neighborhood | Current photo shows | Evidence |
|---|---|---|---|
| Porto | Baixa | **Porto Alegre, BRAZIL** — Cidade Baixa, Rio Grande do Sul | desc "Bairro de Porto Alegre Cidade Baixa"; cat `Rua da República (Porto Alegre)`. Wrong country, ~8,000 km. |
| Verona | Centro Storico (Città Antica) | **Lazise**, a Lake Garda comune ~25 km away | cats `Centro storico (Lazise)`, `Lazise (town)`; desc "Oldtown of Lazise" |
| Vaduz | Triesen | The **Vaduz** government building | cat `Regierungsgebäude, Vaduz`; OSM Peter-Kaiser-Platz, Vaduz 9490. Different municipality. |
| Riyadh | Al Nakheel | Nakheel Mall, in **Al Mugharzat**, ~8 km ENE | OSM 24.76809,46.71498 → Al Mugharzat; outside the Al Nakheel polygon. Name match only. |
| Chișinău | Buiucani | **Botanica** sector (the Botanical Garden) | GPS 46.9761,28.8791 → sectorul Botanica. ~5 km off. |
| Chișinău | Telecentru | **Botanica** sector (Valea Trandafirilor) | Wikidata Q7367970 47.0042,28.8522 → sectorul Botanica |
| Chișinău | Riscani | **Centru** sector (Central Station) | GPS 47.0126,28.8597 → sectorul Centru |
| Amsterdam | Oud-West | Vondelpark — **Oud-Zuid / Museumkwartier** | GPS 52.36067,4.87492 → Museumkwartier, Amsterdam-Zuid |
| Bangkok | Riverside (Bang Rak) | Wat Arun — **Bangkok Yai, Thonburi**, opposite bank | Wat Arun is west-bank; Bang Rak is east-bank |
| Verona | Veronetta | Santuario on **Forte San Leonardo**, hills NW of Verona | cat coords 45.454938,10.99461; file GPS → Ponte Pietra, Città Antica |
| Helsinki | Punavuori | St John's Church — **Ullanlinna** | Wikidata Q1698940 P276 = Ullanlinna; GPS → Merimiehenkatu, Ullanlinna |
| Marrakech | Hivernage | Menara Gardens — **Arrondissement de Ménara** | GPS 31.61243,-8.021119 → Ménara; Hivernage is in Guéliz |
| Jeddah | Al Andalus | Red Sea Mall — **Al-Shatee**, the site's own other hood | GPS 21.6281,39.1106 → Al-Shatee |
| Sharjah | Al Majaz | **Al Khan Lagoon**, ~2 km SW | uploader's own title/desc "Al Khan Lagoon looking south"; Al Majaz fronts Khalid Lagoon |
| Riga | Centrs / Art Nouveau District | **Vecrīga (Old Town)** — the site's own other hood | desc "Vecrīga. Panorama"; cat `Views of Vecrīga` |
| Reykjavík | Vesturbær (West End) | **Miðborg** (central 101) — the site's own other hood | cat `Views of Skólavörðustígur…`; Q16426640 → Miðborg |
| Moscow | Khamovniki (near Gorky Park) | **Yakimanka** district | GPS 55.730806,37.602722 → район Якиманка |
| Cancún | Downtown (El Centro) | The **Zona Hotelera** beach strip, ~8 km east | cat `Hotel zone in Cancún`; GPS 21.1305,-86.7467 |
| Orlando | Thornton Park | Lake Eola — **South Eola**, same subject as the Downtown hero | OSM Lake Eola Park → South Eola |

**Pattern worth noting:** five of these (Jeddah, Riga, Reykjavík, Orlando, and Cancún) are
illustrated by the subject of a *different hood on the same page*, so two cards show the
same place. That is the signature of subject-matching without a location check.

## 2. Judgement calls — 52 loose but defensible

Not errors, but the photo doesn't really show the hood. Most common shapes:

- **Shot from the hood, of somewhere else.** Athens/Koukaki (a panorama from the
  Parthenon), Thessaloniki/Panorama (explicitly "a view *from* Panorama"),
  Paris/Montmartre (shot from Notre-Dame; the butte is a distant sliver),
  Pattaya/North Pattaya (whole-bay panorama taken from the southern hill).
- **Illustrated by a neighbouring hood's landmark.** Taipei/Da'an is shot from Taipei 101
  (Xinyi); Hong Kong/Tsim Sha Tsui shows the Hong Kong Island skyline from Sky100;
  Kyoto/Higashiyama uses a Gion photo when Gion has its own card.
- **Whole-city view filed under one hood.** HCMC/District 1, Milan/Isola, Tirana/Komuna e
  Parisit, Warsaw/Śródmieście, Monaco/Monte-Carlo, São Paulo/Jardins.
- **Colloquial vs administrative boundary.** London/Camden (St Pancras is in the borough
  but 1.1 km from Camden Town), Munich/Glockenbachviertel (actually Gärtnerplatzviertel),
  Kraków/Stare Miasto (the main station, outside the Planty ring), Rome/Monti (the
  author says "on the edge of the rione"; the landmarks in frame are Campitelli and Trevi).
- **Only the uploader's caption supports it.** Mecca/Al Aziziyah, Punta Cana/Uvero Alto,
  Sigiriya/Inamaluwa, Vancouver/Mount Pleasant, Tbilisi/Sololaki, Johor Bahru/Danga Bay.
- **Right place, shows nothing of it.** Fukuoka/Nakasu (a station stairwell),
  Kyiv/Vokzalna (a close-up of a locomotive), São Paulo/Vila Madalena (an underground
  platform — and the station is in Pinheiros anyway), Pattaya/Central Pattaya (a mall atrium).
- **Rome/Prati (Vaticano)** sits in **Vatican City** — a different country from the Prati
  rione. Defensible only because the hood label itself says "(Vaticano)".

## 3. Broken source links — 5

The image renders (the local file is present) but the recorded Commons page 404s, so the
credit link is dead. That is a licence-attribution problem, not merely cosmetic.

| City | Neighborhood | Recorded page |
|---|---|---|
| Andorra la Vella | Barri Antic (Centre Històric) | `Casa_de_la_Vall_4.JPG` |
| Andorra la Vella | Escaldes-Engordany | `Caldea_spa_resort,_May_2016.jpg` |
| Bucharest | Piața Unirii / Centrul Civic | `Bucharest_-_Palace_of_the_Parliament_(2024)_(2).jpg` |
| Copenhagen | Osterbro | `Copenhagen_-_the_little_mermaid_statue_-_2013.jpg` |
| Ljubljana | Trnovo | `Tromostovje_from_below.jpg` |

⚠ Don't swap in a similarly-named file blindly. Two of these would land in the wrong hood
anyway: the Little Mermaid is at Langelinie in **Indre By**, not Østerbro; Tromostovje is
at Prešernov trg in **Center**, not Trnovo — and Center already has its own card.

## 4. Unsourceable — 66

Photos from Pexels, Pixabay, or with no source recorded. They have no description page to
interrogate, so they are neither confirmed nor condemned. They need a human to look at the
image against the neighborhood.

**Two have slugs naming a different place entirely** — not proof, but strong enough to
pull:

- **Tirana / Pyramid / Artificial Lake area** — slug reads `the-pyramide-postdam-germany`.
  Potsdam, Germany.
- **Bucharest / Dorobanți / Floreasca** — slug reads `open-market-in-pia-a-mare-sibiu-romania`.
  Sibiu, ~270 km from Bucharest.

Others worth an eye: Kotor/Muo (`photo-of-a-mountain-town` — names no place),
Fukuoka/Tenjin (`shrine…tenjin…` — likely a Tenmangū shrine, not Fukuoka's Tenjin
district), Zurich/Niederdorf (slug names the Altstadt generically, which is a separate
hood on the same page), Valencia/El Carmen (slug names a Marian devotion, not the barrio).

## 5. Duplicate

`Skyline_cancun_mexico._(24209557802).jpg` is used for **both** Cancún / Hotel Zone and
Cancún / Punta Cancún. The only file reused across all 583 entries.

---

## Method, for whoever runs this again

What worked, in order of decisiveness:

1. **File GPS + Nominatim reverse geocode.** Decisive when present, but only ~43% of
   Commons files carry coordinates.
2. **Commons categories, including parent categories.** A category naming a different
   district is the strongest negative signal available.
3. **Wikidata P131 (administrative) / P276 (location)** for landmarks whose district is
   disputed. This is what settled Helsinki/Punavuori.
4. **Reading the uploader's own description.** Several errors were confessed there —
   Verona/Centro Storico says "Oldtown of Lazise" in its own description.

Traps found the hard way:
- OSM polygons are unreliable for historic quarters (Florence returned Oltrarno names for
  right-bank piazzas). Use Commons/Wikidata for those and say which basis you used.
- `generator=geosearch` needs `ggsnamespace=6` and `colimit=max` or it silently returns
  article stubs and caps at 10 results.
- The camera position is not the subject. Many correct entries are shot from outside the
  hood; several wrong ones are shot from inside it.

Worklists: `_guidebuild/photo-audit/01.txt` … `16.txt`.
Coordinate-only pre-pass: `_needs-attention/hood-photo-location-audit.md` (12% coverage).
