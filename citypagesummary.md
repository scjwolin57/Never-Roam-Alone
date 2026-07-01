# Never Roam Alone — city.html Summary
*Last updated: June 30, 2026*

---

## Overview

`city.html` is the per-city destination guide page, accessed via `?city=CityName` (e.g. `city.html?city=Tokyo`). It contains all city data inline in JavaScript — no API calls for city data. It is entirely vanilla HTML/CSS/JS.

**27 cities covered:** Hong Kong, Bangkok, London, Macau, Singapore, Paris, Dubai, New York, Kuala Lumpur, Istanbul, Tokyo, Antalya, Seoul, Osaka, Rome, Phuket, Barcelona, Amsterdam, Milan, Vienna, Prague, Los Angeles, Sydney, Cape Town, Rio de Janeiro, Cancún, Marrakech.

---

## URL Parameters

| Param | Values | Effect |
|-------|--------|--------|
| `?city=` | City name (case-insensitive) | Selects the city to display |
| `?from=` | `map` or `guides` | Controls back button label + href |

- `from=map` → back button says "Back to the map" → `index.html`
- `from=guides` → back button says "Back to City Guides" → `cities.html`
- Hero breadcrumb also reflects this

---

## Page Structure

1. **Sticky nav** — shared across all pages; links to Map, Blog, City Guides, Destination Finder
2. **Hero** — full-bleed image (picsum.photos seeded by city slug), city name, country, tagline, visitors chip, breadcrumb
3. **Intro article** — `.i18n-ml` placeholder paragraph (to be filled per city)
4. **Stat cards grid** (`.facts` — 3-column CSS Grid):
   - Temperature + Rain card (spans full row)
   - Population + Visitors combo card
   - Emergency & Embassy card
   - Languages & Religion card
5. **Currency card** — card acceptance strip + live converter
6. **Cost cards** (4-up row) — Hotel, Meal, Taxi, Drinks
7. **Getting Around** section — 5 transport cards (clickable modal popups)
8. **Neighborhood Guide** section — 5 neighborhoods per city with lodging tiers
9. **Stories tiles** — 3 placeholder blog tiles per city
10. **Footer**
11. **Modal overlay** (hidden by default, populated on transport card click)

---

## Data Objects

All data is defined in `<script>` in the HTML. Keys are always the exact city name string (e.g. `"Hong Kong"`).

### `CITIES` array
Main city dataset. Each object has:
```js
{
  city, country, visitors,   // string, string, number (millions)
  pop,                       // string e.g. "7.4M" / "680K"
  lat, lng,                  // coordinates (used for hemisphere season logic)
  tagline,                   // hero tagline
  temps: {q1, q2, q3, q4},  // avg high °F for Jan–Mar, Apr–Jun, Jul–Sep, Oct–Dec
  langs: [{l, p}, ...]       // top 3 languages with % (p = integer percent)
}
```

### `CITY_CUR` — local currency code
`{ "Paris": "EUR", "Tokyo": "JPY", ... }`

### `CITY_CARD` — % of businesses accepting cards (integer)
Color-coded via `cardLevel(p)`: ≥85% green "widely accepted", ≥65% yellow "commonly accepted", <65% coral "carry cash".

### `CITY_COST` — mid-range costs in USD
`{ hotel: number, meal: number, taxi: number }`
- `hotel` = mid-range hotel per night
- `meal` = sit-down restaurant per person
- `taxi` = ~10 km trip

### `CITY_HOTEL` — budget + high-end nightly hotel USD
`{ b: number, h: number }`

### `CITY_TIP` — restaurant tipping custom
`{ s: status, r: rate string }`
- `s` values: `"expected"`, `"customary"`, `"optional"`, `"included"`, `"not"`
- Color-coded via `tipInfo(s)`: expected=coral, customary/optional=yellow, included/not=green

### `CITY_RIDES` — ride-hailing apps available
`{ "Paris": ["Uber", "Bolt"], ... }` — empty array if none.

### `CITY_TAXI` — official taxi details
`{ color: string, fare: "fixed" | "metered" | "unmetered" }`
- Displayed in the Major Airports modal under the Taxi line (not in the cost card)
- Color-coded via `taxiFareColor(fare)`: fixed=green, metered=teal, unmetered=coral

### `CITY_DRINKS` — avg drink prices in USD
`{ coffee: number, beer: number | "restricted" | "notallowed", water: number }`
- `"restricted"` → "Public alcohol restricted" (e.g. Dubai — only in licensed venues)
- `"notallowed"` → "Public alcohol not allowed"
- Currently: Dubai = `"restricted"`, Marrakech = `"restricted"`

### `CITY_TRANSPORT` — transport hubs per mode
```js
{
  air:   [...airport names],
  train: [...station names],
  bus:   [...terminal names],
  ferry: [...port/pier names],
  car:   { side: "left"|"right", idp: "Required"|"Recommended", rental: usd }
}
```

### `CITY_AIRPORT` — primary airport detail
```js
{
  name: string,             // airport name + IATA code
  km: number,               // distance to city center
  drive: string,            // driving time range
  rentals: [...],           // car rental companies with on-site counters
  carService: number,       // avg USD
  taxi: number,             // avg USD
  ride: { avail: "yes"|"limited"|"no", cost: number },
  transit: [{ m: string, c: number }, ...]  // public transit options + USD cost
}
```

### `CITY_EMERGENCY` — police + ambulance numbers
`{ police: string, ambulance: string }`

### `EMBASSY_COUNTRIES` — dropdown list for embassy finder
Array of country names. Selecting one builds a Google Maps search URL:
`https://www.google.com/maps/search/?api=1&query=${country} embassy or consulate in ${city}`

### `CITY_RELIGION` — top 3 religions with %
`[{ r: "Islam", p: 90 }, ...]`

### `CITY_STAY` — avg tourist length of stay (days)
`{ "Paris": 4.5, ... }` — used in daily tourist ratio calculation.

### `CITY_WALK` — walkability score (0–100)
`{ "Paris": 85, ... }` — color-coded via `walkInfo(score)`.

### `CITY_SAFETY` — safety + crime indices
`{ safety: number, crime: number }`
- Safety: 80–100 green, 60–79 light green, 40–59 yellow, 20–39 orange, <20 bright red
- Crime: ≤19 green, ≤39 light green, ≤59 yellow, ≤79 orange, >79 bright red
- Both displayed as clickable Google search links

### `CITY_RAIN` — avg rain days per quarter (3-month total)
`{ q1: number, q2: number, q3: number, q4: number }`
- Displayed as `Math.round(q / 3)` days/mo inside each temp row

### `CITY_HOODS` — 5 neighborhood names per city
`{ "Paris": ["Le Marais", "Saint-Germain-des-Prés", ...], ... }`

### `LODGE_TIERS` — lodging tier config
```js
[
  { k: "High-end", c: "#185e3f" },
  { k: "Mid-range", c: "#0e7c86" },
  { k: "Budget", c: "#c0792c" }
]
```

### `CURRENCIES` — symbol + name for 30 currencies
`{ USD: {s:"$", n:"US Dollar"}, EUR: {s:"€", n:"Euro"}, ... }`

### `RATES` — fallback exchange rates (per 1 USD)
Hardcoded approximate rates. Overwritten live on page load from `open.er-api.com/v6/latest/USD` (free, no API key). `ratesLive` boolean tracks whether live rates loaded.

---

## Key Functions

### Pure helpers
| Function | Purpose |
|----------|---------|
| `tempColor(f)` | Returns CSS color for °F: blue (<35) → teal → green → yellow → orange → red (>90) |
| `tempWidth(f)` | Bar width % (anchored 28°F min, 110°F max) |
| `toCelsius(f)` | °F → °C |
| `seasonsFor(lat)` | Returns 4 season name strings. `|lat| < 20` → tropical (Dry/Hot/Wet/Wet). `lat < 0` → southern hemisphere (Summer/Autumn/Winter/Spring). Otherwise northern (Winter/Spring/Summer/Autumn) |
| `cardLevel(p)` | Color + word for card acceptance % |
| `tipInfo(s)` | Color + word for tipping status |
| `taxiFareColor(fare)` | Green=fixed, teal=metered, coral=unmetered |
| `safetyColor(s)` | 5-tier: ≥80 green, ≥60 light green, ≥40 yellow, ≥20 orange, <20 red |
| `crimeColor(s)` | 5-tier inverse: ≤19 green, ≤39 light green, ≤59 yellow, ≤79 orange, >79 red |
| `walkInfo(w)` | Returns `{c: color, label: string}` for walk score |
| `ratioColor(p)` | >30% red, >10% yellow, ≤10% green |
| `parsePop(s)` | "7.4M" → 7,400,000; "680K" → 680,000 |
| `convert(amount, from, to)` | Currency conversion via RATES (through USD pivot) |
| `fmtMoney(x, code)` | Format converted number (0 decimals for JPY/KRW/IDR/VND; 2 decimals otherwise) |
| `fmtPrice(usd, code)` | USD amount → symbol + converted amount (1 decimal if <10, else 0) |

### Render functions
| Function | Purpose |
|----------|---------|
| `buildCostCards(code)` | Returns HTML string for the 4 cost cards (Hotel, Meal, Taxi, Drinks) — all prices converted to `code` currency |
| `buildTransport(code)` | Returns HTML string for the 5 transport cards — car rental price in `code` |
| `buildAirportModal(code)` | Returns HTML string for the Major Airports modal — all prices in `code` |
| `renderCosts()` | Re-renders `#cost-cards` and `#transport-cards` elements |
| `renderConversion()` | Updates converter output field and rate display |
| `renderConverter(amount)` | Rebuilds the converter row HTML (called on swap or init) |
| `bindConverter()` | Attaches event listeners to `conv-amt`, `conv-sel`, `conv-swap` after each re-render |
| `openModal(title)` | Populates and shows `#info-modal`; calls `buildAirportModal` for airports, placeholder for others |
| `closeModal()` | Hides `#info-modal`, restores body scroll |

### Converter state
```js
const localCode = CITY_CUR[c.city];     // city's own currency
let compareCode = defaultTarget;         // currently selected comparison currency
let reversed = false;                    // false: local→compare; true: compare→local
let lastRaw = null;                      // last converted value (carried over on swap)
```
Swap button carries `lastRaw` as the new `amount` and toggles `reversed`, then calls `renderConverter(carry)`.

### Tourist ratio formula
```
avgDailyTouristsM = c.visitors × CITY_STAY[city] / 365
touristRatio = (avgDailyTouristsM / popM) × 100
```
Displayed as e.g. "8%" with color from `ratioColor`.

---

## CSS Classes — Key Reference

| Class | Description |
|-------|-------------|
| `.facts` | 3-col CSS grid for stat cards |
| `.fact` | Individual stat card (white card, shadow) |
| `.fact-wide` | `grid-column: 1/-1` — full-width card |
| `.cost-cards-grid` | 4-col sub-grid inside `.facts` for cost cards |
| `.stat-combo` | Combined Population + Visitors card |
| `.sc-top` | Flex row for pop + visitors side by side |
| `.sc-metrics` | Tourist ratio / walk / safety section below |
| `.ratio-line` | Individual metric row (tourist ratio, walk score, safety/crime) |
| `.stat-disclaimer` | Italic disclaimer at bottom of stat combo card |
| `.idx-link` | Clickable safety/crime index link |
| `.temp-head` | Flex header for the weather card (title + rain caption) |
| `.temp-rows` | 4-col grid of seasonal temp rows |
| `.temp-row` | Single quarter (label, temp, rain, bar) |
| `.season-name` | Season name inside temp label (teal, semibold) |
| `.rain-val` | Rain days/mo line (blue droplet icon + text) |
| `.lang-row` | Language bar row (name, %, progress bar) |
| `.rel-section` | Religion sub-section inside language card |
| `.cur-grid` | 2-col grid: currency info panel + converter |
| `.cur-local` | Left panel: symbol, code, name |
| `.cur-conv` | Right panel: converter fields |
| `.conv-row` | Flex row: from field + swap button + to field |
| `.conv-field` | Individual converter input/dropdown field |
| `.conv-swap` | Circular swap button |
| `.card-accept` | Card acceptance strip at top of currency card |
| `.cost-card` | Individual cost card (Hotel/Meal/Taxi/Drinks) |
| `.hotel-tiers` | Budget/high-end price row inside hotel card |
| `.tip-line` | Tipping custom row at bottom of meal card |
| `.rides` | Ride-hailing apps section inside taxi card |
| `.ride-chip` | Individual app chip (green pill) |
| `.drinks-list` | Stacked rows inside drinks card |
| `.drink-row` | Individual drink row (label + price) |
| `.alc-note` | Coral "restricted / not allowed" note |
| `.transport-grid` | Auto-fit grid for the 5 transport cards |
| `.tcard` | Transport card (clickable, hover lift) |
| `.modal-overlay` | Fixed full-screen modal backdrop |
| `.modal-card` | White modal content card |
| `.air-rows` | `<dl>` inside airport modal |
| `.air-dist` | Distance display (large green number) |
| `.air-taxi-meta` | Taxi color + fare type line in airport modal |
| `.emrg` | Emergency numbers list |
| `.embassy` | Embassy finder section |
| `.hoods` | Auto-fit grid for neighborhood cards |
| `.hood` | Individual neighborhood card |
| `.hood-lodging` | Lodging tiers section at bottom of hood card |
| `.lodge-row` | Tier row: colored pill + recommendation name |
| `.lodge-tier` | Colored tier pill (High-end/Mid-range/Budget) |

---

## Modal System

Single shared modal: `<div class="modal-overlay" id="info-modal" hidden>` in the HTML (before footer). Populated dynamically by `openModal(title)`.

- **Dismiss:** X button (`#modal-close`), clicking backdrop, or pressing Escape
- **Airport modal:** fully rendered with real data from `CITY_AIRPORT`
- **Train / Bus / Ferry / Car rental modals:** placeholder text — "More information coming soon"
- Transport cards use event delegation on `#transport-cards` container, reading `data-info` attribute

---

## Live Currency Rates

Fetched on page load (no API key required):
```
fetch("https://open.er-api.com/v6/latest/USD")
```
On success: merges into `RATES`, sets `ratesLive = true`, re-renders converter and cost cards.
On failure: silently uses hardcoded fallback `RATES`.

---

## Navigation

`from` URL param controls back button and breadcrumb:
- `from=map` → index.html (default if param absent)
- `from=guides` → cities.html

---

## Pending / To Do

### Content to fill in
- [ ] **Neighborhood descriptions** — all 27 cities × 5 neighborhoods have placeholder text
- [ ] **Lodging recommendations** — all High-end / Mid-range / Budget slots say "Recommendation coming soon"
- [ ] **City intro paragraphs** — `.i18n-ml` article section is placeholder for every city
- [ ] **Train station modals** — content not yet written
- [ ] **Bus terminal modals** — content not yet written
- [ ] **Ferry port modals** — content not yet written
- [ ] **Car rental modals** — currently shows car rental data from `CITY_TRANSPORT` but could be expanded

### Links to fill in
- [ ] **Car service booking links** — all `href="#"` in airport modal (`Book a transfer →`)

### Technical
- [ ] **i18n.js coverage** — card labels added in city.html (Currency, Hotels, Tipping, Ride-hailing, Drinks, Getting Around, Neighborhood Guide, etc.) are not yet in the translation dictionary
- [ ] **Mobile pass** — 4-up cost card row and neighborhood grid on small screens
- [ ] **`?city=` with spaces/accents** — verify URL encoding works for cities like "Rio de Janeiro", "Kuala Lumpur", "São Paulo" if added later

---

## File Location

`/Users/jeffreywolinsky/AI Projects/never-roam-alone/city.html`

Related files in the same folder:
- `cities.html` — city grid directory page (links here with `?from=guides`)
- `index.html` — map page (links here with `?from=map`)
- `i18n.js` — language switcher (partially covers city.html labels)
- `summary.md` — overall project summary (last updated June 26, 2026)
