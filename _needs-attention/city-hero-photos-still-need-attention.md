# City hero photos — what still needs attention

*Written 2026-08-25, after the full visual audit of all 892 hero photos in `city-photos.js`.*

## Where things stand

| | |
|---|---|
| Hero photos reviewed | **892** (every one, viewed by eye) |
| Replaced | **163** (17 of them twice — improved, then upgraded again) |
| Still worth a second look | **none** |

**Nothing is outstanding.** Every one of the 892 heroes is a real, correctly-licensed photograph of the place it claims to show, and the 17 that were merely weak have now been upgraded too.

Six rounds of replacement happened:

1. **60 outright errors** — 13 where the photo wasn't of the place at all (Windermere was the UK Prime Minister's official portrait, Whistler was a painting by the painter of that name, Jasper was a photo of the mineral, Siargao was a movie poster, Tampere was the city flag) and 47 multi-panel Wikipedia montages.
2. **95 weak-but-correct heroes** — real photos of the right place that made a poor full-bleed hero. 93 got a genuinely better photo; 2 turned out to already be using the best available file.
3. **A third pass on the 8 that had looked hopeless**, after Jeff sent two Abidjan photos. Searching Commons by **file title text** rather than by category turned up good photos for **6 of the 8** — see the note at the end, this was a gap in the method.
4. **A fourth pass on the last 4 hold-outs**, once Jeff's Mbabane and Port-au-Prince photos showed that Pexels and Unsplash reach places Commons doesn't. Mbabane, Port-au-Prince, Galle and Cockburn Town all resolved.
5. **A fifth and sixth pass on the 17 'correct but dull' heroes** — 12 replaced from Unsplash, and the last 5 from Wikimedia Commons after searching by specific landmark name rather than by city.

Originals for every replaced photo are in `_image-backups-2026-08-25-heroes/`. Nothing has been pushed.

---

## 1. Nothing left in this category

Every former write-off is solved — Mbabane (1b), Port-au-Prince (1c), Galle and Cockburn Town (2), and the last 17 (section 3).

## 1b. Mbabane — fixed with a Pexels photo, not Commons

Jeff supplied *Scenic View of Mbabane City with Mountain Backdrop* by **Khaya Motsa** (`@proudlyswazi`), [Pexels 34040098](https://www.pexels.com/photo/scenic-view-of-mbabane-city-with-mountain-backdrop-34040098/). The Pexels licence allows commercial use and does not require attribution; the photo is geotagged Mbabane, Hhohho Region, and the signage in frame (ESRIC Beneficiary Fund, "Wear Well Mbabane") corroborates it. It shows the CBD with the granite hills behind — exactly what Commons could not provide.

**This required a small code change.** `city.html`, `cities.html` and `choose.html` all had the credit label **hardcoded** as the words "Wikimedia Commons", with only the link target coming from the data. A Pexels URL would therefore have linked to Pexels while claiming Wikimedia — a false attribution on a live page. The label now reads from the URL:

```
${/pexels\.com/.test(ph.page) ? "Pexels" : /unsplash\.com/.test(ph.page) ? "Unsplash" : "Wikimedia Commons"}
```

One line in each of the four places that render a photo credit (`cities.html` ×1, `choose.html` ×2, `city.html` ×1). Nothing else in those files was touched. **Pexels and Unsplash heroes now just need their `page:` URL set** — no further code changes. A fourth source would need one more branch in those same four spots.

### Fixed on the third pass (6)

| City | New hero |
|---|---|
| **Abidjan** | The Plateau skyline reflected in the Ébrié Lagoon — `Abidjan des Lagune.jpg`, CC BY-SA 4.0, used on 19 Wikipedia articles |
| **Al Ahmadi** | Fahaheel waterfront and jetty |
| **Alice Springs** | The town below the red MacDonnell ridge |
| **Miami** | The downtown skyline over Biscayne Bay, daylight |
| **Srimangal** | The tea gardens |
| **Yamoussoukro** | The Basilica of Our Lady of Peace |

## 1c. Port-au-Prince — the painted hillside

Now the **colour-block houses stacked up the mountainside above the city** — [Unsplash P8ZZ0aofrXI](https://unsplash.com/photos/white-and-brown-concrete-houses-near-green-trees-during-daytime-P8ZZ0aofrXI) by **Heather Suggitt**, captioned *"Houses built on the mountains just outside of Port-au-Prince"* and location-tagged to the city. 6000×4000 original, so a full-size 1600×900 master. Unsplash License: free for commercial use, no permission needed.

*Superseded, but worth keeping in your back pocket:* the **restored Marché en Fer at dusk** — [`Iron Market, Haiti.jpg`](https://commons.wikimedia.org/wiki/File:Iron_Market,_Haiti.jpg), CC BY-SA 4.0, by Hufton + Crow for the architects behind the 2011 restoration. A genuinely lovely photo; its only flaw was a 1500×843 master, the largest free-licensed Port-au-Prince image on Commons.

**Two things I turned down for this city:**

- **A Flickr photo of the painted Jalousie hillside** (UN-Habitat's photostream, [10606333454](https://www.flickr.com/photos/unhabitat/10606333454)). Genuinely Port-au-Prince and a striking image — but the page says **"All rights reserved"** and the caption carries an explicit notice, *© Julius Mwelu/UN-Habitat*. UN-Habitat publishes on Flickr without licensing for reuse. Flickr is not a licence; each photo has its own, and All Rights Reserved is the default. If you want that specific image, the route is to email UN-Habitat and ask — they may well say yes for a travel site crediting them.
- **Pexels search results.** Searching "Port-au-Prince" on Pexels returns 25,000 results that are almost entirely studio portraits, plus aerials of Port of Spain, Santo Domingo, Johannesburg and Perth. Stock-site search matches on loose tags, so a result appearing under a city's name is not evidence it was taken there — check the photo's own location tag, as the Unsplash one carries.

**Why the earlier passes missed all of this:** my Commons searches filtered out anything earthquake-related to avoid disaster imagery, and that filter was catching dates too — which knocked out most post-2010 Port-au-Prince photos along with the 2010 ones. Searching by landmark name instead of by city found the Iron Market immediately. And I searched Pexels but never Unsplash, where the better photo was sitting all along.

## 2. Galle and Cockburn Town — solved from Unsplash

Both had been written off: Commons had nothing better than the file the site was already serving. Applying the Port-au-Prince lesson — check Unsplash, not just Commons and Pexels — fixed both in minutes.

- **Galle** — [Unsplash EBxsNaN0mig](https://unsplash.com/photos/aerial-view-of-city-near-sea-during-daytime-EBxsNaN0mig) by **Oliver Frsh**: a drone view of the fort peninsula with the white lighthouse, the ramparts and the red-tiled old town. Location-tagged Galle, Sri Lanka. Same composition as the old hero, but in natural colour instead of the heavy filter.
- **Cockburn Town** — [Unsplash 3X-hHOYQ07I](https://unsplash.com/photos/white-boats-on-sea-under-cloudy-sky-during-daytime-3X-hHOYQ07I) by **Gray Matter**: the turquoise bay with boats at anchor and the town strung along the shore. Unsplash's own description reads *"in Cockburn Town, Turks and Caicos Islands"*.

Both Unsplash License, both full 1600×900 masters.

**Nothing is left in this category either.**

## 3. The last 17 — all now replaced

These were correct and correctly licensed but dull. Every one has been upgraded.

| City | New hero | Source |
|---|---|---|
| Beihai | Dishuidanping volcanic sea cliff, Weizhou Island (part of Beihai city) | Commons, CC BY-SA 4.0 |
| Blantyre | Limbe Cathedral in red brick against deep blue sky | Unsplash |
| Douala | A busy street of motorbikes, shops and traffic — the city at work | Unsplash |
| Inhambane | A surfer at Tofo Beach in evening light | Unsplash |
| Juba | City panorama with the Jebel Kujur ridge behind | Commons, CC BY-SA 4.0 |
| La Serena | El Faro Monumental lighthouse against blue sky | Unsplash |
| Nairobi | The skyline with the KICC tower centred | Unsplash |
| Nakhon Ratchasima | Downtown under strung red lanterns | Unsplash |
| Ouagadougou | Elevated view over the city and a big cumulus sky | Commons, **CC0** |
| Phitsanulok | Wat Phra Si Rattana Mahathat — the gold prang above orange roofs | Commons, CC BY-SA 3.0 |
| Rotorua | The town and lake from the Skyline gondola | Unsplash |
| Sa Pa | Drone view of the rice terraces with houses in the valley | Unsplash |
| São Tomé | Dugout fishing canoes on a beach below the jungle | Unsplash |
| Shiraz | Eram Garden — the pavilion, formal beds and cypresses | Unsplash |
| Surakarta | The Kraton gate with red lanterns and becak | Unsplash |
| Ta'if | The escarpment at golden hour | Unsplash |
| Urganch | The al-Khwarizmi monument under its white colonnade | Commons, CC BY-SA 4.0 |

**Four honest caveats:**

- **Juba** has a column of refuse smoke on the horizon. It is still the only genuine city panorama that exists under a free licence, and it beats the bare river bridge it replaced. Say the word and I will swap it.
- **Inhambane** uses Tofo Beach, ~22km away in the same province and the town's main draw. That is the same convention already used for Puerto Iguazú/Iguazú Falls, Livingstone/Victoria Falls, Magelang/Borobudur and Davao/Mount Apo.
- **São Tomé** is tagged to the country rather than the capital — a beach on the island, not the town itself.
- **Urganch** got a genuine Urganch photo. A Khiva substitute was available and prettier, but Khiva is a separate city 35km away and would have been a misattribution.

## Other open items on the hero photos

- **Naha's** new hero is **Shuri Castle**, which burned down in 2019 and is still being rebuilt. It remains the city's icon, but if you'd rather show something standing, say so and I'll swap it.
- **Ibiza's** entry in `city-photos.js` has **no photo credit link** at all (`page:` is missing). Pre-existing, unrelated to this audit, but it means that one hero shows no attribution.
- **Nothing has been pushed.** `city-photos.js` and 465 image files under `images/cities/` are changed and uncommitted.

---

## One thing worth knowing for next time

Every serious error in this audit came from the same root cause: **matching a photo to a city by name**.

That is how Windermere ended up as Keir Starmer, Whistler as a painting, Jasper as a mineral — and during this second round, searching for "The Valley" (Anguilla) returned **Charlton Athletic's football stadium in London**, which is also called The Valley. It was caught because every candidate was looked at before being used.

The method that works, and that produced all 159 replacements:

1. Build candidates from the city's **Wikimedia Commons category tree** and its named landmark categories, plus **geosearch around its coordinates**, **plus a file-title text search** — never a plain name search alone.
2. Rank by **how many Wikipedia articles already use the file** — a strong quality signal, and the single most useful filter.
3. **Look at every candidate before choosing.** Nothing auto-selected.

For ambiguous city names, step 1 needs an explicit category ("Whistler, British Columbia", "Legazpi, Albay", "Flores, El Petén"), or the results come back about something else entirely.

**Step 1's title search was a late addition, and it mattered.** The first two rounds used only categories and geosearch. That works when a city's Commons categories are well curated, and fails badly when they aren't — for Abidjan it returned market produce and portraits, so the city was written off as having nothing usable. A plain title search found `Abidjan des Lagune.jpg` immediately: 5472×3080, CC BY-SA 4.0, and already used on 19 Wikipedia articles. Re-running the other seven write-offs the same way rescued five more. **If a city's category pool looks like junk, that says the category is badly maintained, not that no photo exists.**

### On photos from elsewhere on the web

Jeff offered two Abidjan photos, one from Wikimedia Commons and one from Expedia:

- The **Commons** one (`Abidjan de nuit.jpg`, CC BY-SA 4.0) was genuinely free to use — the site's existing credit line would have covered it.
- The **Expedia** one could not be used. Sites like that licence their photography from agencies; the licence covers them, not us. It was also **horizontally mirrored** — the Samsung sign on the tower read backwards — which is a good tell that an image has been passed around and re-processed rather than taken from an original source.

The rule: a photo is only safe to use if you can point at the page that grants the licence. "Found it online" isn't a licence.

Mbabane is the counter-example that proves the rule works: the Pexels photo came with a licence page saying free-for-commercial-use in plain terms, so it went straight in.

---

## Heads-up: other uncommitted changes in the repo

While this work was going on, something else was editing the same repo. **None of it is mine** and I have left it alone, but two items are worth your eye before you commit:

- **`city.html` has lost the intro paragraph on every city page.** The `<p class="lead">` line — *"{City} draws around N million international travelers a year — and it's easy to see why…"* — has been deleted from the template. That affects all 892 guides. If that was deliberate (rewriting the intro), fine. If not, it is exactly the kind of quiet loss `CLAUDE.md` exists to prevent.
- **`citydata/*.json` — around 40 files** have had lodging and neighborhood data rewritten, apparently a hotel pass. `citydata/capri.json` went from 5 neighborhoods to 4, dropping "Via Krupp / Gardens of Augustus" from `hoods`, `hood_tag` and `hood_desc`.

Also changed in `city.html`: the lodging block now handles fewer than three hotel picks, and the "Compare with another city" arrow became an inline SVG. Both look intentional.
