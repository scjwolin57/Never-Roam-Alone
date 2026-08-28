# Neighborhoods that still need a trustworthy photo

**Updated 2026-08-24.** A Creative Commons sweep (Wikimedia Commons *geosearch* +
category pages, and Flickr's CC pool reached through Openverse) filled **42 of the 52**
that were outstanding. These 8 are what's left.

The reason the earlier July pass missed so many: it used Commons **file search**, which
only matches titles. Searching by **coordinates** (`generator=geosearch`, with
`ggsnamespace=6` and `colimit=max`) and by **category** finds photos whose titles never
mention the neighborhood at all. Reverse-geocoding each candidate's own coordinates
through Nominatim then confirms it really is in the right district.

- **Abu Dhabi**: Khalifa City — geosearch returns zero files within 1.5 km; the category
  holds only motorway dashcam frames. One likely candidate ("6 AM in Al Forsan") has no
  geotag, so it can't be confirmed.
- **Denpasar**: Kesiman — only 1900s KITLV plates and small portrait ritual close-ups.
- **Heraklion**: Poros, Mastampas — everything in radius belongs to the old town, the
  Venetian walls or the port.
- **Mecca**: Al Shubaikah — every geotagged file in range reverse-geocodes to Al Haram,
  Ajyad or Jarham, never Ash Shubaikah.
- **Medina**: Al Aqeeq — OSM has no Al Aqeeq district node at all, so nothing can be
  placed inside it.
- **Punta Cana**: Punta Cana Village, El Cortecito — the only on-target files are under
  1000px, and the five "El Cortecito" files actually sit in Los Corales next door.
  (Nominatim also returns a decoy Punta Cana Village 200 km away — watch for it.)

Best bet for these eight: your own photos. Drop them in the "images to fill" folder named
like `City-Neighborhood.jpg` and ask Claude to wire them in.

## Held — downloaded but deliberately NOT wired in

- **Marne-la-Vallée / Chessy** — a good Disneyland Paris Fantasyland panorama (CC BY-SA
  2.0, 14855x2429). France has **no freedom of panorama for commercial use**, and the
  park architecture is separately copyrighted, so the photographer's CC licence doesn't
  by itself clear it. Your call. File is at `images/hoods/marne-la-vallee--chessy.webp`.
- **Sharjah / Al Nahda** — CC0 and correctly wide, but a night shot, and the card puts a
  dark gradient over the top. Every daylight Al Nahda file on Commons carries a
  "MOHD FAIZAN BIN ARIF" watermark. Look at it before shipping.

## Rejected drops (2026-08-24)

Two files from the "images to fill" folder could not be used:

- **Chișinău — Botanica** (`botanica.webp`): a 123RF stock image with the watermark
  tiled across the whole frame. Unusable as-is and not licensed. Needs a properly
  licensed replacement.
- **Abu Dhabi — Khalifa City** (`khalifa-city.webp`): a CGI architectural render, not
  a photograph — flat lighting, stylised planting, no photographic grain. It also
  arrives at 1024x576, below the 1056px the banner displays at, so it would upscale.
  Almost certainly a developer's marketing render, so licensing is a question too.

Wired in the same day: Andorra la Vella / Prat de la Creu and Bologna / Bolognina.
⚠ Both were added with **no credit line** (the "our own photos" convention). If either
came from a stock site rather than Jeff's own camera, it needs a credit or removal —
the Bolognina shot in particular looks professionally taken.
