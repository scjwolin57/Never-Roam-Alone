/* city-main.js: the city guide's main script, moved out of city.html on 2026-10-24 (backlog 27) so
   browsers can cache it between guides instead of re-downloading ~263 KB with every page. Loaded by a
   plain <script src> at the same place the inline script stood, so it runs at the same moment, after
   the data scripts above it and before auth.js, trip-add.js and the rest below it. */
/* Starter city dataset (shared with the map; will be unified into one source
   when we move to the production build). visitors = approx. annual international
   arrivals in millions. temps = avg high °F for each seasonal quarter. */
let CITIES = [];

/* Returns a CSS color for a given °F temperature */
function tempColor(f) {
  if (f <= 35)  return '#74b9ff'; /* cold blue   */
  if (f <= 50)  return '#55efc4'; /* cool teal   */
  if (f <= 65)  return '#a8e063'; /* mild green  */
  if (f <= 78)  return '#f0b429'; /* warm yellow (darkened for contrast against the light bar track) */
  if (f <= 90)  return '#fd9644'; /* hot orange  */
  return '#e55039';               /* very hot red */
}

/* Maps °F to a 0–100 bar width (anchored at 28°F min, 110°F max) */
function tempWidth(f) {
  return Math.min(100, Math.max(4, Math.round((f - 28) / 82 * 100)));
}

/* Convert °F to °C */
function toCelsius(f) { return Math.round((f - 32) * 5 / 9); }

/* Season names per quarter (Jan–Mar, Apr–Jun, Jul–Sep, Oct–Dec) by latitude:
   tropical = wet/dry; otherwise four seasons flipped for the southern hemisphere. */
function seasonsFor(lat) {
  if (Math.abs(lat) < 20) return ["Dry season","Hot season","Wet season","Wet season"];
  return lat < 0
    ? ["Summer","Autumn","Winter","Spring"]
    : ["Winter","Spring","Summer","Autumn"];
}

/* ---------- Currency ---------- */
/* Local currency for each city (keyed by name, so the main dataset stays clean) */
let CITY_CUR = {};

/* Approx. % of businesses that accept credit/debit cards (rough estimates) */
let CITY_CARD = {};

/* Color + word for a card-acceptance percentage */
function cardLevel(p) {
  if (p >= 85) return {c:"#1d9a6c", w:"widely accepted"};
  if (p >= 65) return {c:"#e0a800", w:"commonly accepted"};
  return {c:"#b5492c", w:"carry cash — limited acceptance"};
}

/* Typical traveler costs in USD: hotel/night (mid-range), restaurant meal/person
   (sit-down), and a ~10 km taxi/Uber fare. Rough estimates. */
let CITY_COST = {};


/* Budget (b) and high-end (h) nightly hotel averages in USD */
let CITY_HOTEL = {};
let CITY_LAUNDRY = {};   // wash+dry price, availability, note — synced from the sheet's Laundry columns
let CITY_HOOD_GEO = {};  // [lat,lng] per neighborhood (aligned with hoods; null = not placed) — from geocode_hoods.py
let CITY_LAUNDROMATS = {}; // laundromats per neighborhood from Overture open data (CITY_SCHEMA.md "laundromats"); undefined = not loaded, [] = none listed
let CITY_CARHIRE = {};   // DiscoverCars page for the city or its airport: {u,k,n} (CITY_SCHEMA.md "carhire"; site-only)
let CITY_DRIVER = {};    // Kiwitaxi car-with-a-driver hub page: {u,k,n} (CITY_SCHEMA.md "driver"; site-only)
let CITY_TRIPCAR = {};   // Trip.com car hire page for the city, a station in it, or its airport: {u,k,n} (CITY_SCHEMA.md "tripcar"; site-only)
let CITY_KLOOKCAR = {};  // Klook car charter page (car with a driver), mainland China: {u,k} (CITY_SCHEMA.md "klookcar"; site-only)
let CITY_NEARBY = {};    // other guides within day-trip range: [{city,tier,mins,country,blurb}] (CITY_SCHEMA.md "nearby"; built by _guidebuild/daytrips/build_nearby.py)
let CITY_GYMS = {};      // researched gyms with day/multi-day/week passes (see CITY_SCHEMA.md "gyms"); undefined = not researched yet, [] = researched, none found
/* info bubbles: a tap on the icon toggles it (inline onclick); a tap anywhere
   else closes any open one. Touch has no hover, so this is the mobile path. */
document.addEventListener("click", e => {
  if (e.target && e.target.closest && e.target.closest(".hint-btn")) return;
  document.querySelectorAll(".hint-btn.open").forEach(b => b.classList.remove("open"));
});

/* Ride-sharing / e-hailing apps available in each city (empty = taxis only) */
let CITY_RIDES = {};

/* Official taxi colour + fare type. fare = "metered" | "fixed" | "unmetered". */
let CITY_TAXI = {};

/* Colour for a taxi fare type */
function taxiFareColor(cat) {
  if (cat === "metered") return "#1d9a6c";
  if (cat === "fixed")   return "#5c6933";
  return "#e0a800"; // unmetered / haggle
}

/* Emergency contact numbers per city (police + ambulance/fire). */
let CITY_EMERGENCY = {};

/* Home countries for the embassy finder dropdown — all 195 recognized countries
   (193 UN member states + the 2 UN observer states, Holy See and State of Palestine) */
const EMBASSY_COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo, Republic of the","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe","Holy See","State of Palestine"];

/* Top 3 religions by share of population (approximate; can overlap in some places) */
let CITY_RELIGION = {};

/* Color tiers for the English-conversation badge: green = easy to get by,
   yellow = manageable with some patience, red = expect a language barrier */
const ENG_META = {h:{c:"#556B2F"},m:{c:"#B8860B"},l:{c:"#C04020"},vl:{c:"#8B2500"}};

/* English-proficiency stat by city, based on national EF EPI 2025 data; omitted for native-English-speaking countries and countries without EF data */
let CITY_ENGLISH = {};

/* Average length of stay (days) — used for the daily tourist ratio */
let CITY_STAY = {};

/* Recommended length of stay, in days, per tier:
   [ scratch the surface, leisurely explore, deeper dive, live like a local ]
   Each tier is a [low, high] day range. */
let CITY_VISIT = {};


/* Fixed tier labels + blurbs for the "How long to stay" section (same for every city). */
const VISIT_TIERS = [
  { label:"Scratch the surface", blurb:"Hit the iconic, must-see sights and headline landmarks." },
  { label:"Leisurely explore",   blurb:"See the highlights and more at an unhurried pace." },
  { label:"Deeper dive",         blurb:"Time for hidden gems, local neighborhoods, and day trips." },
  { label:"Live like a local",   blurb:"Settle in and soak up everyday life at your own rhythm." }
];
/* Beach and resort cities: tier 1 measures sightseeing only, which is genuinely
   short, so the stock "scratch the surface" wording makes a ½-day figure look
   like a mistake. These get a clearer tier-1 card instead. */
const RESORT_TIER1 = { label:"Just the sights",
  blurb:"Sightseeing is quick here — longer stays are for beach and boat days." };
const RESORT_STAY = new Set(["Alanya","Alicante","Aqaba","Batumi","Biarritz","Bodrum","Boracay","Bridgetown","Cancún","Cockburn Town","Da Nang","Durban","Durrës","Fethiye","Guarujá","Houmt El Souk","Hua Hin","Hurghada","Ibiza","Ko Samui","Krabi","Kuşadası","La Romana","Las Palmas de Gran Canaria","Malé","Marbella","Marmaris","Mazatlán","Montego Bay","Mykonos","Nassau","Nha Trang","Panglao","Paphos","Pattaya-Chonburi","Pemba","Phu Quoc","Playa del Carmen","Puerto Plata","Puerto Vallarta","Punta Cana","Rhodes","Rimini","Road Town","Roseau","San Andrés","Santorini","Scottsdale","Sihanoukville","Sousse","Varna","Viña del Mar","Weno","Willemstad","Zanzibar City","Çeşme"]);
function visitRangeText(r){
  const [lo,hi] = r;
  const f = v => (v === 0.5 ? "½" : String(v));
  const n = lo === hi ? f(lo) : f(lo) + "–" + f(hi);
  const unit = (hi <= 1) ? "day" : "days";
  return { n, unit };
}
function buildVisitSection(cityName){
  const tiers = CITY_VISIT[cityName];
  if (!tiers) return "";
  const cityAttr = cityName.replace(/"/g,'&quot;');
  const cards = tiers.map((r,i)=>{
    const t = (i === 0 && RESORT_STAY.has(cityName)) ? RESORT_TIER1 : VISIT_TIERS[i];
    const { n, unit } = visitRangeText(r);
    return `
      <div class="stay-card">
        <div class="stay-days"><b>${n}</b> <span>${unit}</span></div>
        <div class="stay-label">${t.label}</div>
        <div class="stay-blurb">${t.blurb}</div>
        ${voteWidgetHTML({type:"stay_card", id:`${cityAttr}:${i}`, city:cityAttr, extraClass:"stay-vote", size:15})}
      </div>`;
  }).join("");
  return `
    <div class="stay-section" aria-label="How long to stay">
      <div class="stay-head">
        <h2>How long should you stay?</h2>
        <p class="stay-sub">From a quick highlights run to living like a local — pick the pace that fits your trip.</p>
      </div>
      <div class="stay-grid">${cards}</div>
    </div>`;
}

/* Walkability score (0–100, Walk Score style) */
let CITY_WALK = {};

/* Colour + label for a walk score */
function walkInfo(s) {
  if (s >= 90) return {c:"#1d9a6c", w:"Walker's paradise"};
  if (s >= 70) return {c:"#1d9a6c", w:"Very walkable"};
  if (s >= 50) return {c:"#e0a800", w:"Somewhat walkable"};
  return {c:"#b5492c", w:"Car-dependent"};
}

/* Safety Index / Crime Index (Numbeo-style, 0–100; they roughly sum to 100) */
let CITY_SAFETY = {};

/* Per-city prose kept from the guide data for figures the page shows as a
   coded value (a walk score, a card-acceptance %, transit chips). The number
   is the summary; this is the sentence behind the info icon next to it. */
let CITY_NOTES = {};
const NOTE_MODALS = {
  "Walkability": "walk", "Card acceptance": "card", "Safety notes": "safety",
  "Religion": "religion", "Languages": "langs", "Connectivity": "net",
  "Public transit": "transit", "Getting to and from the city": "transport"
};

let CITY_SOLO = {};
const SOLO_META = {vh:{w:"Very comfortable",c:"#556B2F"},h:{w:"Comfortable",c:"#6B8E23"},m:{w:"Generally fine — some caution",c:"#B8860B"},l:{w:"Use extra caution",c:"#C04020"},vl:{w:"Challenging — go prepared",c:"#8B2500"}};

/* Colour for a safety index (higher = safer), 5 tiers */
function safetyColor(s) {
  if (s >= 80) return "#1d9a6c"; // 80–100  green
  if (s >= 60) return "#7cb342"; // 60–79   yellow-green
  if (s >= 40) return "#e0a800"; // 40–59   yellow
  if (s >= 20) return "#fd7e14"; // 20–39   orange
  return "#e01010";              // 0–19    bright red
}

/* Colour for a crime index (higher = worse), 5 tiers — inverse of safety */
function crimeColor(s) {
  if (s <= 19) return "#1d9a6c"; // 0–19    green
  if (s <= 39) return "#7cb342"; // 20–39   yellow-green
  if (s <= 59) return "#e0a800"; // 40–59   yellow
  if (s <= 79) return "#fd7e14"; // 60–79   orange
  return "#e01010";              // 80–100  bright red
}

/* Legends behind the info icon next to Walk score, Safety & crime index and
   Solo comfort — the scale itself, not a per-city note (that's cityNotes,
   above via noteBtn). Same tiers and colours as walkInfo/safetyColor/
   crimeColor/SOLO_META so the legend never drifts from what's on screen. */
const SCORE_GUIDES = {
  "Tourist ratio guide": {
    intro: "Daily tourist-to-local ratio estimates how many tourists are in the city on an average day for every 100 residents: annual visitors &times; average length of stay &divide; 365, divided by resident population. Lower means the city feels more like itself; higher means tourists can outnumber or crowd out daily life.",
    rows: [
      { c:"#1d9a6c", label:"0&ndash;10% &middot; Feels local", note:"a good score &mdash; tourists are a small share of daily life" },
      { c:"#e0a800", label:"11&ndash;30% &middot; Noticeably touristy" },
      { c:"#e55039", label:"31%+ &middot; Tourist-heavy", note:"a bad score &mdash; expect crowds and tourist pricing in central areas" }
    ]
  },
  "Walk score guide": {
    intro: "Walk score rates how easy it is to get around on foot, from 0 to 100 &mdash; higher is better.",
    rows: [
      { c:"#1d9a6c", label:"90&ndash;100 &middot; Walker's paradise", note:"a good score &mdash; daily errands don't need a car" },
      { c:"#1d9a6c", label:"70&ndash;89 &middot; Very walkable" },
      { c:"#e0a800", label:"50&ndash;69 &middot; Somewhat walkable" },
      { c:"#b5492c", label:"0&ndash;49 &middot; Car-dependent", note:"a bad score &mdash; plan on taxis, rideshare or transit for most trips" }
    ]
  },
  "Safety & crime index guide": {
    intro: "Safety index and crime index are Numbeo-style scores, 0&ndash;100, that run in opposite directions: a high safety index is good, a high crime index is bad. The two roughly sum to 100 for a city.",
    cols: [
      { name:"Safety", sub:"Higher = Better" },
      { name:"Crime", sub:"Lower = Better" }
    ],
    rows: [
      { c:"#1d9a6c", s:"80&ndash;100", cr:"0&ndash;19" },
      { c:"#7cb342", s:"60&ndash;79", cr:"20&ndash;39" },
      { c:"#e0a800", s:"40&ndash;59", cr:"40&ndash;59" },
      { c:"#fd7e14", s:"20&ndash;39", cr:"60&ndash;79" },
      { c:"#e01010", s:"0&ndash;19", cr:"80&ndash;100" }
    ]
  },
  "Solo comfort guide": {
    intro: "Solo comfort is computed (0&ndash;100) from five inputs: safety index, the Georgetown/PRIO Women, Peace and Security Index, government travel advisories, walk score, and English ease &mdash; see the site's SOLO_RUBRIC.md for the exact formula. Because it blends several already-capped 0&ndash;100 inputs, no city scores above the high 80s, so the tiers below reflect this score's real range, not 0&ndash;100 evenly split.",
    rows: [
      { c:SOLO_META.vh.c, label:`72&ndash;100 &middot; ${SOLO_META.vh.w}`, note:"a good score" },
      { c:SOLO_META.h.c,  label:`60&ndash;71 &middot; ${SOLO_META.h.w}` },
      { c:SOLO_META.m.c,  label:`48&ndash;59 &middot; ${SOLO_META.m.w}` },
      { c:SOLO_META.l.c,  label:`39&ndash;47 &middot; ${SOLO_META.l.w}` },
      { c:SOLO_META.vl.c, label:`0&ndash;38 &middot; ${SOLO_META.vl.w}`, note:"a bad score &mdash; extra planning is recommended" }
    ]
  }
};
function buildScoreGuideModal(guide, current) {
  const cur = current
    ? `<div class="tier-current" style="border-left-color:${current.c}"><span class="stat-dot" style="background:${current.c}"></span><span class="tier-current-text">${current.text}</span></div>`
    : "";
  if (guide.cols) {
    const head = `<div class="tier-row-grid tier-head"><span></span>`
      + guide.cols.map(cc => `<span class="tier-col"><span class="tier-col-name">${cc.name}</span><span class="tier-col-sub">${cc.sub}</span></span>`).join("")
      + `<span></span></div>`;
    const rows = guide.rows.map(r =>
      `<div class="tier-row-grid"><span class="stat-dot" style="background:${r.c}"></span><span class="tier-col"><b>${r.s}</b></span><span class="tier-col"><b>${r.cr}</b></span><span class="tier-note">${r.note ? `&mdash; ${r.note}` : ""}</span></div>`
    ).join("");
    return `<p class="rt-intro">${guide.intro}</p>${cur}${head}${rows}`;
  }
  const rows = guide.rows.map(r => `<div class="tier-row"><span class="stat-dot" style="background:${r.c}"></span><span class="tier-text"><b>${r.label}</b>${r.note ? ` &mdash; ${r.note}` : ""}</span></div>`).join("");
  return `<p class="rt-intro">${guide.intro}</p>${cur}${rows}`;
}

/* Five most popular neighborhoods per city */
/* Most photographed landmark per neighborhood — used to fetch Wikipedia thumbnail */
let CITY_HOOD_LANDMARK = {};

let CITY_ADVISORY = {};

let CITY_AVOID = {};

let CITY_HOODS = {};

/* Bar picks per neighborhood, aligned to CITY_HOODS order.
   Each hood is an array of up to three {k, n, d} entries:
     k = dive | party | cocktail | pub  (places that serve alcohol)
         cafe | hangout | mocktail      (places where alcohol isn't sold)
     n = venue name, d = one-line note. An empty array means no picks yet. */
let CITY_BARS = {};

const BAR_KIND_META = {
  dive:     { label: "Dive / local bar",  emoji: "\u{1F37A}" },
  party:    { label: "Party bar",         emoji: "\u{1F3B6}" },
  cocktail: { label: "Cocktail bar",      emoji: "\u{1F378}" },
  pub:      { label: "Pub / casual bar",  emoji: "\u{1F37B}" },
  cafe:     { label: "Coffee house",      emoji: "☕" },
  hangout:  { label: "Late-night hangout",emoji: "\u{1F319}" },
  mocktail: { label: "Juice & mocktails", emoji: "\u{1F379}" }
};

/* Sit-down restaurant picks per neighborhood, aligned to CITY_HOODS order.
   Same {k, n, d} shape as CITY_BARS; k = local | casual | fine.
   Labels render like the lodging tiers (LODGE_TIERS), c = pill colour. */
let CITY_EAT = {};
const EAT_KIND_META = {
  local:  { label: "Local traditional", c: "#5c6933" },
  casual: { label: "Casual dining",     c: "#5c6933" },
  fine:   { label: "Fine dining",       c: "#5c6933" }
};

/* Coffee shop / takeaway picks per neighborhood, same shape;
   k = coffee | takeaway | bakery. */
let CITY_CAFES = {};

/* Approved visitor suggestions ("Suggest a place"), per section, 5 arrays in hood order, same pick shape plus
   `by` = the member's id when a signed-in Roamer sent it: {"eat":[[...]], "cafes":[[...]], "bars":[[...]], "stay":[[...]]}.
   Shown as a "From Roamers" group under our picks (decisions.md 2026-09-25). */
let CITY_ROAMER = {};
const CAFE_KIND_META = {
  coffee:   { label: "Coffee shop",       c: "#5c6933" },
  takeaway: { label: "Takeaway",          c: "#5c6933" },
  bakery:   { label: "Bakery / pastries", c: "#5c6933" }
};

/* Neighborhood quality labels — one best-fit tag per hood, aligned to CITY_HOODS order.
   Value is a HOOD_TAG_META key, or null for no clear match (no overlay shown).
   Classified descriptions-first from CITY_HOOD_DESC. */
const HOOD_TAG_META = {
  central:   { label:"Central location",    emoji:"🧭" },
  sights:    { label:"Sightseeing",         emoji:"📷" },
  hipster:   { label:"Hipster / Bohemian",  emoji:"🪴" },
  nightlife: { label:"Nightlife & Dining",  emoji:"🪩 🍽️" },
  shopping:  { label:"Shopping",            emoji:"🛍️" },
  quiet:     { label:"Quiet & Residential", emoji:"🏠" }
};
let CITY_HOOD_TAG = {};

/* Lodging tiers shown under each neighborhood */
/* Real neighborhood descriptions, one array per city aligned to CITY_HOODS order */
let CITY_HOOD_DESC = {};

/* Real lodging picks per neighborhood: [High-end, Mid-range, Budget], aligned to CITY_HOODS order */
let CITY_LODGING = {};

/* `k` is the vote key and must not change (it is inside every lodging vote's
   target id); `label` is what the tile shows (Jeff, 2026-09-23). */
const LODGE_TIERS = [
  {k:"High-end", label:"Luxury", c:"#5c6933"},
  {k:"Mid-range", label:"Comfort", c:"#5c6933"},
  {k:"Budget", label:"Budget", c:"#c0792c"}
];

/* Average rainy days (1 mm or more) per month, for each quarter — NASA POWER 2015-2024, see CITY_SCHEMA.md */
let CITY_RAIN = {};

/* Tap water safety for visitors: "safe" (fine straight from the tap), "unsafe"
   (stick to bottled/filtered), or "uncertain" (sources conflict — bottled water advised). */
let CITY_WATER = {};

/* Takeaway coffee, beer (0.5L), and bottled water averages in USD.
   beer can be a number, or "restricted" / "notallowed" for alcohol rules. */
let CITY_DRINKS = {};


/* Public transit systems per city — powers the full-width Getting Around The City card */
let CITY_TRANSIT = {};


/* Icon for the drinks card (takeaway coffee cup) */
const DRINK_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9h11l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9z"/><path d="M5 9h13"/><path d="M8 9l1-4h6l1 4"/></svg>`;

/* Transportation per city. car.rental = mid-size car, 1 day, USD. car.side = which side they drive on.
   The Int'l permit row comes from driving-permits.js by the reader's licence (car.idp retired 2026-10-08). */
let CITY_TRANSPORT = {};

const TRANSPORT_ICONS = {
  air:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15.5 13 11V4.2a1.7 1.7 0 0 0-3.4 0V11l-8 4.5V17l8-2.3v4l-2.2 1.6V22l3.9-1.1L15.2 22v-1.4L13 18.9v-4L21 17z"/></svg>`,
  train:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="13" rx="2.5"/><path d="M5 11h14"/><circle cx="9" cy="13.5" r="1"/><circle cx="15" cy="13.5" r="1"/><path d="M8 16l-2 5"/><path d="M16 16l2 5"/></svg>`,
  bus:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11"/><path d="M5 11h14"/><path d="M4 17h16"/><circle cx="8" cy="18.5" r="1.3"/><circle cx="16" cy="18.5" r="1.3"/></svg>`,
  ferry:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c1.4 0 1.6 1 3 1s1.6-1 3-1 1.6 1 3 1 1.6-1 3-1 1.6 1 3 1"/><path d="M5 18 3.5 12.5h17L19 18"/><path d="M12 4v4"/><path d="M8.5 8h7"/></svg>`,
  car:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13"/><rect x="3" y="13" width="18" height="5" rx="1.5"/><circle cx="7.5" cy="18" r="1.2"/><circle cx="16.5" cy="18" r="1.2"/></svg>`
};

/* Long-distance route detail per city — powers the "more info" popups on the
   Train / Bus / Ferry transport cards. Per city:
     train: { intl:[{to, op, url, night?, time?}], dom:{op, url}|null, note }
     bus:   { intl:[{to, op, url}], note }
     ferry: { intl:[{to, op, url, seasonal?}], note }
   intl = DIRECT international services only; url = official operator site.
   Verified July 2026. Cities not yet researched simply show the placeholder.
   city-routes.js is lazy-loaded (see loadRoutesData), so this starts empty
   and is filled in when the file arrives. */
let CITY_ROUTES = window.NRA_ROUTES || {};

/* Primary airport detail per city. km = distance to city center; costs in USD.
   ride.avail = "yes" | "limited" | "no". transit: {m: option, c: USD cost}. */
let CITY_AIRPORT = {};
let CITY_AIRPORTS2 = {};   // other airports, same shape as airport (Other Airports tab, decisions.md 2026-10-20)

/* Connectivity per city — mobile & Wi-Fi avg download speeds (Mbps),
   major cellular operators, and typical tourist SIM data price per GB (USD).
   Country-level estimates compiled July 2026 from published averages. */
/* Connectivity per city — mobile & Wi-Fi avg download speeds (Mbps), major
   cellular operators, typical tourist SIM price per GB (USD), free public
   Wi-Fi rating (fw: wide/mod/ltd, fwn: note number below) and main-airport
   free Wi-Fi (ap: note number below). Country-level estimates, July 2026. */
let CITY_NET = {};

/* Electrical supply per city: plug letters, voltage and frequency, from the city JSON (`power`, mirrored in the sheet
   columns Plug Types / Voltage / Frequency). Used in the Connectivity banner's Power panel. Source: IEC /
   worldstandards.eu reference, standard domestic supply per country; some countries mix plug types. A city with no
   `power` shows no Power panel (none since 2026-10-19; territory sources in _needs-attention/plug-types-research-2026-10-15.md). */
let CITY_POWER = {};


/* Real plug-face diagrams for types A-L, cropped on demand from a single
   reference sheet (adapted from "Plug types.svg", Wikimedia Commons —
   https://commons.wikimedia.org/wiki/File:Plug_types.svg) that's injected
   once into the page as a hidden <symbol id="plug-type-sheet">. Each entry
   below is the [x,y,width,height] crop window (sheet user units) for that
   letter's panel. Types M, N & O aren't in that sheet, so they fall back to
   small hand-drawn schematics. */
const PLUG_CROPS = {
  A: [49.5,59.5,166.00,166.66],
  B: [49.5,322.0,166.00,166.31],
  C: [49.27,584.5,166.23,166.00],
  D: [294.5,59.5,166.00,166.20],
  E: [294.83,322.0,165.67,166.00],
  F: [294.73,584.5,165.77,166.00],
  G: [539.5,59.5,166.00,166.00],
  H: [539.83,322.0,165.67,166.00],
  I: [539.73,584.5,165.77,166.00],
  J: [784.5,59.5,166.00,166.00],
  K: [784.5,322.0,166.00,166.00],
  L: [784.73,584.5,165.77,166.00],
};
let plugSheetReady = false;
function ensurePlugSheet(){
  if (plugSheetReady) return;
  plugSheetReady = !!document.getElementById("plug-type-sheet");
}
/* Hand-drawn fallback schematics (pin layout only, not to scale) for the
   plug types not covered by the reference sheet above. */
const PLUG_ICONS_FALLBACK = {
  M: '<circle cx="8" cy="9" r="2.2"/><circle cx="16" cy="9" r="2.2"/><circle cx="12" cy="17" r="2.4"/>',
  N: '<circle cx="8.5" cy="9.5" r="1.7"/><circle cx="15.5" cy="9.5" r="1.7"/><circle cx="12" cy="16" r="1.7"/>',
  O: '<circle cx="8" cy="9" r="1.8"/><circle cx="16" cy="9" r="1.8"/><rect x="11" y="13.5" width="2" height="4.2" rx=".6"/>'
};
function plugIconSVG(letter){
  const crop = PLUG_CROPS[letter];
  if (crop) {
    ensurePlugSheet();
    const [x,y,w,h] = crop;
    return `<svg class="plug-icon" viewBox="${x} ${y} ${w} ${h}" width="22" height="22" role="img" aria-label="Plug type ${letter}"><use href="#plug-type-sheet" width="1000" height="800"/></svg>`;
  }
  const inner = PLUG_ICONS_FALLBACK[letter];
  if (!inner) return "";
  return `<svg class="plug-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.3" role="img" aria-label="Plug type ${letter}">
    <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="rgba(24,94,63,.07)" stroke="rgba(24,94,63,.35)"/>
    <g fill="currentColor" stroke="none">${inner}</g>
  </svg>`;
}

/* Free public Wi-Fi notes (fwn above picks one) */
const NET_FW_NOTES = {
  1:"Citywide free hotspot network, plus caf\u00e9s & metro",
  2:"Most caf\u00e9s, malls & libraries offer free Wi-Fi",
  3:"Caf\u00e9s & convenience stores; stations covered, streets patchy",
  4:"Nearly every caf\u00e9 & restaurant has free Wi-Fi",
  5:"Common in malls & caf\u00e9s, but sign-in usually needs a local number",
  6:"Mainly hotels, malls & tourist-area caf\u00e9s",
  7:"Free hotspots in parks & squares, plus most caf\u00e9s",
  8:"Excellent free Wi-Fi culture \u2014 caf\u00e9s, transit & public spaces"
};
/* Airport free Wi-Fi notes (ap above picks one) — all listed airports offer it free */
const NET_AP_NOTES = {
  1:"unlimited", 2:"passport kiosk or local number", 3:"local-number OTP (visitor help desk)",
  4:"passport kiosk sign-in", 5:"time-limited sessions", 6:"short sessions with ads", 7:"registration required"
};
/* Free-Wi-Fi rating word + colour per level */
function fwInfo(l) {
  if (l === "wide") return {c:"#1d9a6c", w:"Widespread"};
  if (l === "ltd")  return {c:"#b5492c", w:"Limited"};
  return {c:"#e0a800", w:"Moderate"};
}

/* Per-city "Buy eSIM" links — paste each city's purchase URL between the
   quotes as they become ready. Cities left blank show a placeholder link. */
let CITY_ESIM = {};

/* Icons for the cost cards */
const COST_ICONS = {
  hotel:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7v12"/><path d="M2 14h20v5"/><path d="M22 19v-5a2 2 0 0 0-2-2H6V9a2 2 0 0 1 2-2h2"/><path d="M6 12V9"/></svg>`,
  meal:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2v7"/><path d="M8 2v7"/><path d="M6.5 9v13"/><path d="M5 9h3"/><path d="M17 2c-1.66 0-3 2.5-3 5.5 0 2.6 1 4.4 2.3 4.9L16 22"/></svg>`,
  taxi:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l1.4-4.2A2 2 0 0 1 8.3 7.4h7.4a2 2 0 0 1 1.9 1.4L19 13"/><rect x="3" y="13" width="18" height="5" rx="1.5"/><circle cx="7.5" cy="18" r="1.2"/><circle cx="16.5" cy="18" r="1.2"/><path d="M10 7V5h4v2"/></svg>`,
  net:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="0.6"/></svg>`
};
const TIP_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M14.6 9.3c-.6-.6-1.6-1-2.6-1-1.5 0-2.6.8-2.6 2s1.1 1.7 2.6 2 2.6.8 2.6 2-1.1 2-2.6 2c-1 0-2-.4-2.6-1"/></svg>`;
const INFO_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none"/></svg>`;

/* Site-wide contribution feature (2026-09-22): the vote-widget markup
   builders live in votes.js now (NRA_VOTES.widgetHTML/.starHTML), since
   post.html needs the same icon/markup for the blog-article surface and
   duplicating it across pages is exactly the repeated-edit risk this was
   built to avoid. These two names stay as thin aliases so every call site
   already written against them (13 surfaces) needs no further changes. */
function voteWidgetHTML(opts){ return NRA_VOTES.widgetHTML(opts); }
function voteStarHTML(opts){ return NRA_VOTES.starHTML(opts); }

/* The signed-in member's session token, sent with the event and interview forms so approving the
   submission can credit them (Contribution score, contribution-rating-setup.sql). "" for a guest. */
async function nraAccessToken(){
  try { const sb = window.NRA_AUTH && NRA_AUTH.client && NRA_AUTH.client(); if (!sb) return "";
        const res = await sb.auth.getSession(); return (res && res.data && res.data.session && res.data.session.access_token) || ""; }
  catch (e) { return ""; }
}

/* Restaurant tipping custom per city: s = status, r = typical rate / note */
let CITY_TIP = {};

/* Label + color for a tipping status */
function tipInfo(s) {
  if (s === "expected")  return {c:"#b5492c", w:"expected"};
  if (s === "customary") return {c:"#e0a800", w:"customary"};
  if (s === "optional")  return {c:"#e0a800", w:"optional"};
  if (s === "included")  return {c:"#1d9a6c", w:"service included"};
  return {c:"#1d9a6c", w:"not customary"};
}

/* Currency display info (symbol + name) */
const CURRENCIES = {
  "Falkland Islands Pound":{"s":"£","n":"Falkland Islands Pound (FKP), pegged 1:1 to British Pound Sterling (GBP), which also circulates"},
  "Faroese króna (pegged 1:1 to Danish krone)":{"s":"kr","n":"Faroese króna"},
  "KYD":{"s":"CI$","n":"Cayman Islands Dollar"},
  "SHP":{"s":"£","n":"Saint Helena Pound (pegged 1:1 to GBP)"},
  "GIP":{"s":"£","n":"Gibraltar Pound"},
  "BMD":{"s":"$","n":"Bermudian Dollar"},
  "AWG":{"s":"Afl.","n":"Aruban Florin"},
  "ANG":{"s":"ƒ","n":"Netherlands Antillean Guilder"},
  "XPF":{"s":"₣","n":"CFP Franc"},
  "ZMW":{"s":"K","n":"Zambian Kwacha"},
  "UGX":{"s":"USh","n":"Ugandan Shilling"},
  "TND":{"s":"DT","n":"Tunisian Dinar"},
  "TZS":{"s":"TSh","n":"Tanzanian Shilling"},
  "SDG":{"s":"SDG","n":"Sudanese pound"},
  "SSP":{"s":"SSP","n":"South Sudanese Pound"},
  "SOS":{"s":"Sh","n":"Somali Shilling"},
  "SLE":{"s":"Le","n":"Sierra Leonean Leone"},
  "SCR":{"s":"₨","n":"Seychellois Rupee"},
  "STN":{"s":"Db","n":"São Tomé and Príncipe Dobra"},
  "RWF":{"s":"FRw","n":"Rwandan Franc"},
  "NGN":{"s":"₦","n":"Nigerian Naira"},
  "NAD":{"s":"N$","n":"Namibian Dollar"},
  "MZN":{"s":"MT","n":"Mozambican Metical"},
  "MUR":{"s":"Rs","n":"Mauritian Rupee"},
  "MRU":{"s":"UM","n":"Mauritanian Ouguiya"},
  "MWK":{"s":"MK","n":"Malawian Kwacha"},
  "MGA":{"s":"Ar","n":"Malagasy Ariary"},
  "LYD":{"s":"LD","n":"Libyan dinar"},
  "LRD":{"s":"L$","n":"Liberian dollar"},
  "LSL":{"s":"M","n":"Lesotho Loti"},
  "KES":{"s":"KSh","n":"Kenyan Shilling"},
  "GNF":{"s":"FG","n":"Guinean franc"},
  "GHS":{"s":"₵","n":"Ghanaian Cedi"},
  "GMD":{"s":"D","n":"Gambian Dalasi"},
  "ETB":{"s":"Br","n":"Ethiopian Birr"},
  "SZL":{"s":"L","n":"Swazi Lilangeni (Emalangeni, plural)"},
  "ERN":{"s":"Nfk","n":"Eritrean Nakfa"},
  "DJF":{"s":"Fdj","n":"Djiboutian Franc"},
  "CDF":{"s":"FC","n":"Congolese Franc"},
  "KMF":{"s":"CF","n":"Comorian Franc"},
  "XAF":{"s":"FCFA","n":"Central African CFA franc"},
  "CVE":{"s":"$","n":"Cape Verdean Escudo"},
  "BIF":{"s":"FBu","n":"Burundian Franc"},
  "BWP":{"s":"P","n":"Botswana Pula"},
  "XOF":{"s":"CFA","n":"West African CFA Franc"},
  "AOA":{"s":"Kz","n":"Angolan Kwanza"},
  "DZD":{"s":"DA","n":"Algerian Dinar"},
  "VUV":{"s":"VT","n":"Vanuatu Vatu"},
  "TOP":{"s":"T$","n":"Tongan Pa'anga"},
  "SBD":{"s":"SI$","n":"Solomon Islands Dollar"},
  "WST":{"s":"WS$","n":"Samoan Tala"},
  "PGK":{"s":"K","n":"Papua New Guinean Kina"},
  "FJD":{"s":"$","n":"Fijian Dollar"},
  "VES":{"s":"Bs.","n":"Venezuelan Bolívar"},
  "UYU":{"s":"$","n":"Uruguayan Peso"},
  "TTD":{"s":"TT$","n":"Trinidad and Tobago Dollar"},
  "SRD":{"s":"$","n":"Surinamese dollar"},
  "PYG":{"s":"₲","n":"Paraguayan Guaraní"},
  "NIO":{"s":"C$","n":"Nicaraguan Córdoba"},
  "JMD":{"s":"J$","n":"Jamaican Dollar"},
  "HNL":{"s":"L","n":"Honduran Lempira"},
  "HTG":{"s":"G","n":"Haitian Gourde"},
  "GYD":{"s":"G$","n":"Guyanese Dollar"},
  "GTQ":{"s":"Q","n":"Guatemalan Quetzal"},
  "CUP":{"s":"$","n":"Cuban Peso"},
  "CRC":{"s":"₡","n":"Costa Rican Colón"},
  "COP":{"s":"$","n":"Colombian Peso"},
  "BOB":{"s":"Bs","n":"Bolivian Boliviano"},
  "BZD":{"s":"BZ$","n":"Belize Dollar"},
  "BBD":{"s":"$","n":"Barbadian Dollar"},
  "BSD":{"s":"$","n":"Bahamian Dollar"},
  "XCD":{"s":"EC$","n":"Eastern Caribbean Dollar"},
  "YER":{"s":"﷼","n":"Yemeni Rial"},
  "UZS":{"s":"so'm","n":"Uzbekistani som"},
  "TMT":{"s":"m","n":"Turkmen manat"},
  "TJS":{"s":"SM","n":"Tajikistani somoni"},
  "SYP":{"s":"£S","n":"Syrian Pound"},
  "LKR":{"s":"Rs","n":"Sri Lankan Rupee"},
  "PKR":{"s":"₨","n":"Pakistani Rupee"},
  "OMR":{"s":"OMR","n":"Omani Rial"},
  "KPW":{"s":"₩","n":"North Korean won"},
  "NPR":{"s":"Rs","n":"Nepalese Rupee"},
  "MMK":{"s":"K","n":"Myanmar Kyat"},
  "MNT":{"s":"₮","n":"Mongolian Tögrög"},
  "MVR":{"s":"Rf","n":"Maldivian Rufiyaa"},
  "LBP":{"s":"ل.ل","n":"Lebanese Pound"},
  "LAK":{"s":"₭","n":"Lao Kip"},
  "KGS":{"s":"с","n":"Kyrgyzstani Som"},
  "KWD":{"s":"KD","n":"Kuwaiti Dinar"},
  "KZT":{"s":"₸","n":"Kazakhstani Tenge"},
  "JOD":{"s":"JD","n":"Jordanian Dinar"},
  "IQD":{"s":"ID","n":"Iraqi Dinar"},
  "IRR":{"s":"﷼","n":"Iranian Rial"},
  "KHR":{"s":"៛","n":"Cambodian Riel"},
  "BND":{"s":"B$","n":"Brunei Dollar"},
  "BTN":{"s":"Nu.","n":"Bhutanese Ngultrum"},
  "BDT":{"s":"৳","n":"Bangladeshi Taka"},
  "BHD":{"s":".د.ب","n":"Bahraini Dinar"},
  "AZN":{"s":"₼","n":"Azerbaijani Manat"},
  "AMD":{"s":"֏","n":"Armenian Dram"},
  "AFN":{"s":"؋","n":"Afghan Afghani"},
  "UAH":{"s":"₴","n":"Ukrainian Hryvnia"},
  "RSD":{"s":"дин.","n":"Serbian Dinar"},
  "RUB":{"s":"₽","n":"Russian Ruble"},
  "RON":{"s":"lei","n":"Romanian leu"},
  "MKD":{"s":"ден","n":"Macedonian Denar"},
  "MDL":{"s":"L","n":"Moldovan Leu"},
  "ISK":{"s":"kr","n":"Icelandic króna"},
  "BGN":{"s":"лв","n":"Bulgarian Lev"},
  "BYN":{"s":"Br","n":"Belarusian ruble"},
  "BAM":{"s":"KM","n":"Convertible Mark"},
  "ALL":{"s":"L","n":"Albanian Lek"},
  USD:{s:"$",n:"US Dollar"}, EUR:{s:"€",n:"Euro"}, GBP:{s:"£",n:"British Pound"},
  JPY:{s:"¥",n:"Japanese Yen"}, CNY:{s:"CN¥",n:"Chinese Yuan"}, AUD:{s:"A$",n:"Australian Dollar"},
  CAD:{s:"C$",n:"Canadian Dollar"}, CHF:{s:"Fr",n:"Swiss Franc"}, HKD:{s:"HK$",n:"Hong Kong Dollar"},
  SGD:{s:"S$",n:"Singapore Dollar"}, THB:{s:"฿",n:"Thai Baht"}, MYR:{s:"RM",n:"Malaysian Ringgit"},
  KRW:{s:"₩",n:"South Korean Won"}, TRY:{s:"₺",n:"Turkish Lira"}, AED:{s:"د.إ",n:"UAE Dirham"},
  MAD:{s:"د.م.",n:"Moroccan Dirham"}, MOP:{s:"MOP$",n:"Macanese Pataca"}, CZK:{s:"Kč",n:"Czech Koruna"},
  ZAR:{s:"R",n:"South African Rand"}, BRL:{s:"R$",n:"Brazilian Real"}, MXN:{s:"Mex$",n:"Mexican Peso"},
  INR:{s:"₹",n:"Indian Rupee"}, IDR:{s:"Rp",n:"Indonesian Rupiah"}, PHP:{s:"₱",n:"Philippine Peso"},
  VND:{s:"₫",n:"Vietnamese Dong"}, NZD:{s:"NZ$",n:"New Zealand Dollar"}, SEK:{s:"kr",n:"Swedish Krona"},
  NOK:{s:"kr",n:"Norwegian Krone"}, DKK:{s:"kr",n:"Danish Krone"}, PLN:{s:"zł",n:"Polish Złoty"},
  TWD:{s:"NT$",n:"New Taiwan Dollar"}, QAR:{s:"QR",n:"Qatari Riyal"}, HUF:{s:"Ft",n:"Hungarian Forint"}, PEN:{s:"S/",n:"Peruvian Sol"}, SAR:{s:"SR",n:"Saudi Riyal"}, GEL:{s:"₾",n:"Georgian Lari"}, DOP:{s:"RD$",n:"Dominican Peso"}, CLP:{s:"CLP$",n:"Chilean Peso"}, EGP:{s:"E£",n:"Egyptian Pound"}, ARS:{s:"AR$",n:"Argentine Peso"}, ILS:{s:"₪",n:"Israeli Shekel"}
};

/* Fallback exchange rates: units of currency per 1 USD (approximate).
   Refined live from open.er-api.com when the page loads online. */
let RATES = {
  "Falkland Islands Pound":0.75,
  "Faroese króna (pegged 1:1 to Danish krone)":6.54,
  "KYD":0.85,
  "SHP":0.79,
  "GIP":0.79,
  "BMD":1.0,
  "AWG":1.79,
  "ANG":1.79,
  "XPF":110,
  "ZMW":18.35,
  "UGX":3700,
  "TND":2.95,
  "TZS":2650,
  "SDG":4300,
  "SSP":4659,
  "SOS":26000,
  "SLE":22.8,
  "SCR":14.65,
  "STN":21.57,
  "RWF":1466,
  "NGN":1550,
  "NAD":18.5,
  "MZN":64,
  "MUR":45.5,
  "MRU":36.5,
  "MWK":1734,
  "MGA":4400,
  "LYD":6.39,
  "LRD":181.24,
  "LSL":16.36,
  "KES":129,
  "GNF":8770,
  "GHS":10.8,
  "GMD":72,
  "ETB":162,
  "SZL":18.5,
  "ERN":15,
  "DJF":177.72,
  "CDF":2290,
  "KMF":429,
  "XAF":565,
  "CVE":96.2,
  "BIF":2977,
  "BWP":13.5,
  "XOF":575,
  "AOA":916,
  "DZD":132.5,
  "VUV":120.45,
  "TOP":2.39,
  "SBD":8.07,
  "WST":2.72,
  "PGK":4.39,
  "FJD":2.27,
  "VES":693,
  "UYU":40.5,
  "TTD":6.78,
  "SRD":37.5,
  "PYG":6070,
  "NIO":36.66,
  "JMD":158,
  "HNL":26.3,
  "HTG":135,
  "GYD":208.5,
  "GTQ":7.62,
  "CUP":650,
  "CRC":505,
  "COP":4050,
  "BOB":9.9,
  "BZD":2,
  "BBD":2,
  "BSD":1,
  "XCD":2.7,
  "YER":535,
  "UZS":12008,
  "TMT":3.5,
  "TJS":9.47,
  "SYP":115.5,
  "LKR":335,
  "PKR":283,
  "OMR":0.385,
  "KPW":8200,
  "NPR":152.9,
  "MMK":4300,
  "MNT":3573,
  "MVR":15.42,
  "LBP":89500,
  "LAK":21900,
  "KGS":87.5,
  "KWD":0.31,
  "KZT":470,
  "JOD":0.709,
  "IQD":1310,
  "IRR":1550000,
  "KHR":4080,
  "BND":1.29,
  "BTN":95.4,
  "BDT":122,
  "BHD":0.376,
  "AZN":1.7,
  "AMD":367.5,
  "AFN":65.8,
  "UAH":41.6,
  "RSD":101,
  "RUB":80,
  "RON":4.4,
  "MKD":53.9,
  "MDL":17.6,
  "ISK":138,
  "BGN":1.81,
  "BYN":2.87,
  "BAM":1.71,
  "ALL":82,
  USD:1, EUR:0.92, GBP:0.79, JPY:150, CNY:7.2, AUD:1.52, CAD:1.36, CHF:0.88,
  HKD:7.8, SGD:1.34, THB:35, MYR:4.6, KRW:1350, TRY:34, AED:3.67, MAD:9.9,
  MOP:8.05, CZK:23, ZAR:18.5, BRL:5.2, MXN:18, INR:83, IDR:15800, PHP:57,
  VND:25000, NZD:1.65, SEK:10.6, NOK:10.8, DKK:6.9, PLN:4.0,
  TWD:32, QAR:3.64, HUF:360, PEN:3.75, SAR:3.75, GEL:2.7, DOP:60, CLP:950, EGP:49, ARS:1150, ILS:3.7
};
let ratesLive = false;

/* Convert an amount from one currency to another via USD */
function convert(amount, from, to) {
  if (!RATES[from] || !RATES[to]) return null;
  return amount * (RATES[to] / RATES[from]);
}

/* Format a converted number sensibly (no decimals for big-unit currencies) */
function fmtMoney(x, code) {
  if (x === null || !isFinite(x)) return "—";
  const big = ["JPY","KRW","IDR","VND","HUF","CLP","ARS"].includes(code);
  if (big) return x.toLocaleString(undefined, {maximumFractionDigits:0});
  if (x !== 0 && Math.abs(x) < 0.01)  // tiny values: show real precision, not "0.00"
    return x.toLocaleString(undefined, {minimumFractionDigits:4, maximumFractionDigits:6});
  return x.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}

/* Format a USD price converted into another currency for the cost cards
   (symbol prefix + sensibly rounded amount) */
function fmtPrice(usd, code) {
  const v = convert(usd, "USD", code);
  if (v === null) return "$" + usd.toLocaleString();
  const sym = (CURRENCIES[code] && CURRENCIES[code].s) || (code + " ");
  const digits = Math.abs(v) < 10 ? 1 : 0;
  return sym + v.toLocaleString(undefined, {maximumFractionDigits: digits});
}

/* Same as fmtPrice but keeps 2 decimals under 10 — for small per-GB prices */
function fmtGB(usd, code) {
  const v = convert(usd, "USD", code);
  if (v === null) return "$" + usd.toFixed(2);
  const sym = (CURRENCIES[code] && CURRENCIES[code].s) || (code + " ");
  const digits = Math.abs(v) < 10 ? 2 : 0;
  return sym + v.toLocaleString(undefined, {minimumFractionDigits: digits, maximumFractionDigits: digits});
}

/* Parse a population string like "7.4M" / "680K" into an absolute number */
function parsePop(s) {
  const n = parseFloat(s);
  if (/M/i.test(s)) return n * 1e6;
  if (/K/i.test(s)) return n * 1e3;
  return n;
}

/* Colour for the tourist-to-local ratio: >30% red, 10–30% yellow, ≤10% green */
function ratioColor(p) {
  if (p > 30) return "#e55039";
  if (p > 10) return "#e0a800";
  return "#1d9a6c";
}

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

/* Lazy background images — photos load only as their card nears the screen */
const lazyIO = ("IntersectionObserver" in window)
  ? new IntersectionObserver(entries => entries.forEach(en => {
      if(!en.isIntersecting) return;
      const el = en.target;
      el.style.backgroundImage = `url('${el.dataset.bg}')`;
      el.removeAttribute("data-bg");
      lazyIO.unobserve(el);
    }), { rootMargin: "400px" })
  : null;
function lazyBgObserve(root){
  (root || document).querySelectorAll("[data-bg]").forEach(el => {
    if(lazyIO) lazyIO.observe(el);
    else { el.style.backgroundImage = `url('${el.dataset.bg}')`; el.removeAttribute("data-bg"); }
  });
}
/* ---------- Per-city data (moved out of this file) ----------
   The CITIES array and the CITY_* tables above used to be inline (~4.6MB).
   They now live in citydata/<slug>.json — one small file per city, built by
   _guidebuild/split_city_data.py. We fetch just this city's file, fill the
   tables with a single entry, then render the page exactly as before. */
async function loadCityData(){
  const want = (new URLSearchParams(location.search).get("city") || "").toLowerCase();
  if (!want) return;
  /* Fast path: derive the data filename from the city name directly (same
     slug rules as the build tools), skipping the extra round trip through
     _index.json. If the guess misses (unusual spelling), fall back to the
     index lookup exactly as before. */
  const guess = want.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[øœæłđðþß]/g, ch => ({"ø":"o","œ":"oe","æ":"ae","ł":"l","đ":"d","ð":"d","þ":"th","ß":"ss"}[ch]))
    .replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  let res = guess ? await fetch("citydata/" + guess + ".json").catch(() => null) : null;
  if (!res || !res.ok) {
    const idx = await (await fetch("citydata/_index.json")).json();
    const nameKey = Object.keys(idx.slug).find(n => n.toLowerCase() === want);
    if (!nameKey) return;
    res = await fetch("citydata/" + idx.slug[nameKey] + ".json");
  }
  const rec = await res.json();
  const nm = rec.c.city;
  CITIES = [rec.c];
  const fill = (tbl, v) => { if (v !== undefined) tbl[nm] = v; };
  fill(CITY_CUR, rec.cur);             fill(CITY_CARD, rec.card);
  fill(CITY_COST, rec.cost);
  fill(CITY_HOTEL, rec.hotel);         fill(CITY_RIDES, rec.rides);
  fill(CITY_LAUNDRY, rec.laundry);      fill(CITY_HOOD_GEO, rec.hood_geo);
  fill(CITY_NEARBY, rec.nearby);       fill(CITY_CARHIRE, rec.carhire);
  fill(CITY_DRIVER, rec.driver);       fill(CITY_TRIPCAR, rec.tripcar);
  fill(CITY_KLOOKCAR, rec.klookcar);
  fill(CITY_GYMS, rec.gyms);         fill(CITY_LAUNDROMATS, rec.laundromats);
  fill(CITY_TAXI, rec.taxi);           fill(CITY_EMERGENCY, rec.emergency);
  fill(CITY_RELIGION, rec.religion);   fill(CITY_ENGLISH, rec.english);
  fill(CITY_STAY, rec.stay);           fill(CITY_VISIT, rec.visit);
  fill(CITY_WALK, rec.walk);           fill(CITY_SAFETY, rec.safety);
  fill(CITY_NOTES, rec.notes);
  fill(CITY_SOLO, rec.solo);           fill(CITY_HOOD_LANDMARK, rec.hood_landmark);
  fill(CITY_ADVISORY, rec.advisory);   fill(CITY_AVOID, rec.avoid);
  fill(CITY_HOODS, rec.hoods);         fill(CITY_HOOD_TAG, rec.hood_tag);
  fill(CITY_HOOD_DESC, rec.hood_desc); fill(CITY_LODGING, rec.lodging);
  fill(CITY_BARS, rec.bars);           fill(CITY_EAT, rec.eat);
  fill(CITY_CAFES, rec.cafes);         fill(CITY_ROAMER, rec.roamer_picks);
  fill(CITY_RAIN, rec.rain);           fill(CITY_WATER, rec.water);
  fill(CITY_DRINKS, rec.drinks);       fill(CITY_TRANSIT, rec.transit);
  fill(CITY_TRANSPORT, rec.transport); fill(CITY_AIRPORT, rec.airport);
  fill(CITY_AIRPORTS2, rec.airports2);
  fill(CITY_NET, rec.net);             fill(CITY_ESIM, rec.esim);
  fill(CITY_TIP, rec.tip);             fill(CITY_POWER, rec.power);
  /* The five heavy catalogs (food, landmarks, routes, day trips) are folded
     into this city's JSON too (_guidebuild/extend_citydata.py keeps them in
     sync). Setting their globals here lets the page's lazy loaders find the
     data already present and skip the multi-MB catalog downloads entirely.
     If a key is missing (citydata not re-synced after a catalog edit), the
     old full-catalog downloads still kick in as a fallback. */
  if ("food" in rec) {
    window.CITY_FOOD = {}; if (rec.food) window.CITY_FOOD[nm] = rec.food;
    window.CITY_FOOD_INDEX = rec.food ? {[nm]: 1} : {};
    window.NRA_FOOD_PHOTOS = {}; if (rec.food_photos) window.NRA_FOOD_PHOTOS[nm] = rec.food_photos;
  }
  if ("routes" in rec) {
    window.NRA_ROUTES = {}; if (rec.routes) window.NRA_ROUTES[nm] = rec.routes;
    CITY_ROUTES = window.NRA_ROUTES;
  }
  if ("landmarks" in rec) {
    window.NRA_LANDMARKS = {[nm]: rec.landmarks || []};
    window.NRA_LANDMARK_COORDS = {[nm]: rec.lmk_coords || []};
    window.NRA_LANDMARK_PHOTOS = {[nm]: rec.lmk_photos || []};
    window.NRA_DAYTRIPS = {}; if (rec.daytrips) window.NRA_DAYTRIPS[nm] = rec.daytrips;
  }
}
Promise.all([
  loadCityData().catch(e => console.error("City data failed to load:", e)),
  /* Approved visitor photos. Resolves either way and gives up quickly, so a
     slow or missing Supabase can never hold the guide back. */
  window.NRA_CONTRIBUTED ? NRA_CONTRIBUTED.ready() : null,
  /* Hood photos, phrases and holidays, now loading in the background. */
  ...(window.NRA_DATA_READY || []),
  /* The scripts further down the page (auth, favorites, trip-add, nav…).
     With the big files no longer blocking, the city data can arrive before
     the browser has finished running those; waiting for DOMContentLoaded
     keeps the old guarantee that they are all in place when the guide draws. */
  new Promise(r => document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", r, { once: true }) : r())
]).then(function(){

const params = new URLSearchParams(location.search);
const wanted = params.get("city");
const from   = params.get("from"); // "map" | "guides" | null
const c = CITIES.find(x => x.city.toLowerCase() === (wanted||"").toLowerCase());
const content = document.getElementById("content");

/* Back-button config based on origin */
const backHref  = from === "guides" ? "cities.html" : "index.html";
const backLabel = from === "guides" ? "&larr; Back to City Guides" : "&larr; Back to the map";
const crumbHref = from === "guides" ? "cities.html" : "index.html";
const crumbText = from === "guides" ? "City Guides" : "Map";

if(!c){
  document.title = "City not found — Never Roam Alone";
  content.innerHTML = `
    <div class="notfound">
      <h1>We haven't mapped that one yet</h1>
      <p class="muted">That city isn't in the guide yet. Head back and pick another.</p>
      <p style="margin-top:24px"><a class="back" href="${backHref}">${backLabel}</a></p>
    </div>`;
} else {
  document.title = `${c.city} — Never Roam Alone`;
  /* Fold approved contributions into the photo lists before any of them are
     read, so a contributed hero, neighborhood, landmark or dish photo renders
     through exactly the same code as a static one. */
  if (window.NRA_CONTRIBUTED) NRA_CONTRIBUTED.apply(c.city);
  const sg = slug(c.city);
  const num = Number(c.visitors).toLocaleString(undefined,{minimumFractionDigits:1,maximumFractionDigits:1});
  const heroPh = (window.NRA_CITY_PHOTO || {})[c.city];
  const hero = heroPh ? heroPh.img : `https://picsum.photos/seed/${sg}-hero/1600/900`;
  /* per-city link preview (helps crawlers that run JavaScript) */
  (function(){
    const set = (sel, v) => { const m = document.querySelector(sel); if(m) m.setAttribute("content", v); };
    const t = `${c.city} Travel Guide — Never Roam Alone`;
    set('meta[property="og:title"]', t); set('meta[name="twitter:title"]', t);
    set('meta[property="og:description"]', c.tagline); set('meta[name="twitter:description"]', c.tagline);
    set('meta[property="og:url"]', location.href);
    if(heroPh){ const abs = new URL(heroPh.img, location.href).href;
      set('meta[property="og:image"]', abs); set('meta[name="twitter:image"]', abs); }
  })();

  /* Daily tourist-to-local ratio:
     avg daily tourists = annual visitors × avg length of stay ÷ 365;
     ratio = avg daily tourists ÷ resident population. */
  const popM = parsePop(c.pop) / 1e6;
  const stayDays = CITY_STAY[c.city];
  const avgDailyTouristsM = stayDays ? c.visitors * stayDays / 365 : null;
  const touristRatio = (avgDailyTouristsM != null && popM > 0)
    ? Math.round(avgDailyTouristsM / popM * 100) : null;
  const cityNotes = CITY_NOTES[c.city] || {};
  /* Info icon that opens this city's own sentence about a figure shown as a
     number. Renders nothing when the city has no note for that key. */
  const noteBtn = (key, title) => cityNotes[key]
    ? `<button type="button" class="note-btn" onclick="openModal('${title}')" aria-label="${title} — more info" title="More info">${INFO_ICON}</button>`
    : "";
  /* Info icon next to a score that opens a generic legend explaining the
     scale itself (what a good score and a bad score look like). Always
     renders, unlike noteBtn above, since the scale is the same for every
     city — only the per-city note is conditional. */
  const scaleBtn = (title) =>
    `<button type="button" class="note-btn" onclick="openModal('${title}')" aria-label="${title} — more info" title="More info">${INFO_ICON}</button>`;
  const walk = CITY_WALK[c.city];
  const walkLvl = walk != null ? walkInfo(walk) : null;
  const safety = CITY_SAFETY[c.city];
  const solo = CITY_SOLO[c.city];
  /* This city's own numbers, shown as a highlighted line at the top of the
     matching score-guide modal (see SCORE_GUIDES / buildScoreGuideModal). */
  const SCORE_CURRENT = {
    "Tourist ratio guide": touristRatio == null ? null
      : { c: ratioColor(touristRatio), text: `${c.city}&rsquo;s ratio: <b>${touristRatio}%</b> &middot; ~${stayDays}-day avg stay` },
    "Walk score guide": walkLvl == null ? null
      : { c: walkLvl.c, text: `${c.city}&rsquo;s walk score: <b>${walk}/100</b> &middot; ${walkLvl.w}` },
    "Safety & crime index guide": safety == null ? null
      : { c: safetyColor(safety.safety), text: `${c.city}&rsquo;s scores:<span class="tier-current-line">Safety <b>${safety.safety}</b> &middot; Crime <b>${safety.crime}</b></span>` },
    "Solo comfort guide": solo == null ? null
      : { c: SOLO_META[solo.sc].c, text: `${c.city}&rsquo;s solo comfort: <b>${solo.score}/100</b> &middot; ${SOLO_META[solo.sc].w}` }
  };
  const cityAdv = (typeof CITY_ADVISORY !== "undefined" && CITY_ADVISORY[c.city]) || null;

/* Travel advisories. The site is read all over the world, so it does not show one
   government's rating as if it were the rating (Jeff, 2026-09-22). A signed-in
   traveller sees their own government when we track it; everyone else sees the
   three we do: US, UK, Canada. Each keeps its own words, link and date.
   advisories.js carries country-level values; a city whose region is rated
   differently carries its own override in citydata (rec.advisory). */
const ADV_SOURCES = { us:"US State Department", uk:"UK Foreign Office", ca:"Government of Canada" };
const ADV_PASSPORT_TO_SOURCE = { "United States":"us", "United Kingdom":"uk", "Canada":"ca" };

/* Which governments the reader's own passports belong to. A dual national sees
   every one we track (Jeff, 2026-09-23); nobody signed in sees all three. */
function myPassports(){
  // read straight from localStorage: the banner renders before auth.js has loaded
  try{
    const raw = JSON.parse(localStorage.getItem("nra_passports"));
    if (Array.isArray(raw) && raw.length) return raw.filter(Boolean);
  }catch(e){}
  try{ const one = localStorage.getItem("nra_passport_country"); return one ? [one] : []; }catch(e){ return []; }
}
function advReaderSources(){
  return [...new Set(myPassports().map(p => ADV_PASSPORT_TO_SOURCE[p]).filter(Boolean))];
}

/* Safety alert on a day trip (decisions.md 2026-09-23). The trip is never dropped for an
   advisory; its data only says which area it is in and which tracked governments give their
   top warning for that area: alert = {c: advisories.js country, area, by: ["us"|"uk"|"ca"], chk}.
   Wording, link and date come live from advisories.js, and a reader with a passport country
   sees only their own government's warning, as in the city banner. */
const ADV_TOP_WORDS = { us:"Do Not Travel", uk:"Advises against all travel", ca:"Avoid all travel" };
function dtAlertHTML(al){
  if (!al || !al.by || !al.by.length) return "";
  const all = (typeof NRA_ADVISORIES !== "undefined" && NRA_ADVISORIES[al.c]) || null;
  const mine = advReaderSources();
  const by = al.by.filter(k => !mine.length || mine.includes(k));
  if (!by.length) return "";
  const line = k => {
    const a = all && all[k];
    const who = a && a.url ? `<a href="${a.url}" target="_blank" rel="noopener">${ADV_SOURCES[k]}</a>` : ADV_SOURCES[k];
    return `<br>${who}: ${ADV_TOP_WORDS[k]}${a && a.as_of ? ` <span class="adv-date">(${a.as_of})</span>` : ""}`;
  };
  return `<div class="dtcard-alert"><span aria-hidden="true">&#9888;</span><span><b>Safety alert:</b> ${al.area}${by.map(line).join("")}</span></div>`;
}

function buildAdvisoryBanner(c, cityAdv){
  const all = (typeof NRA_ADVISORIES !== "undefined" && NRA_ADVISORIES[c.country]) || null;
  if (!all && !cityAdv) return "";
  const mine = advReaderSources();
  const keys = ["us","uk","ca"].filter(k => all && all[k]);
  const ours = keys.filter(k => mine.includes(k));
  const show = ours.length ? ours : keys;

  /* The city's own region can be rated above its country (a Level 4 region in a
     Level 3 country). That override wins and is always shown. */
  const region = (cityAdv && cityAdv.region) ? cityAdv : null;
  /* The city itself inside a named top-level area (decisions.md 2026-09-23, same rules and data shape as a
     day-trip alert): advisory.area = {c, area, by, chk}. Wording, link and date come live from advisories.js;
     a reader with a passport country sees only their own government. */
  const ar = (cityAdv && cityAdv.area && cityAdv.area.by) ? cityAdv.area : null;
  const arBy = ar ? ar.by.filter(k => !ours.length || ours.includes(k)) : [];
  const arAll = ar ? ((typeof NRA_ADVISORIES !== "undefined" && NRA_ADVISORIES[ar.c]) || all || {}) : {};
  const worst = Math.max(region ? region.lvl : 0, arBy.length ? 4 : 0, ...show.map(k => all[k].scope === "country" ? all[k].lvl : 0));
  const parts = show.filter(k => all[k].scope === "parts" && all[k].lvl >= 3);
  if (worst < 3 && !parts.length) return "";

  const line = k => {
    const a = all[k];
    const date = a.as_of ? ` <span class="adv-date">(${a.as_of})</span>` : "";
    return `<div class="adv-line"><a class="adv-link" href="${a.url}" target="_blank" rel="noopener">`
         + `<b>${ADV_SOURCES[k]}</b></a>: ${a.label}${date}</div>`;
  };
  const head = worst >= 3
    ? (ours.length ? (ours.length > 1 ? "Travel advisories for your passport countries" : "Travel advisory for your passport country") : "Travel advisories")
    : "Regional travel advice";
  const note = (worst < 3 && parts.length)
    ? `<div class="adv-line adv-date">The warning covers parts of ${c.country}; check whether it reaches this city.</div>` : "";
  const regionLine = region
    ? `<div class="adv-line"><b>This region:</b> ${region.label}`
      + (region.url ? ` <a class="adv-link" href="${region.url}" target="_blank" rel="noopener">source</a>` : "")
      + (region.as_of ? ` <span class="adv-date">(${region.as_of})</span>` : "") + `</div>`
    : "";
  const areaLine = arBy.length
    ? `<div class="adv-line"><b>This city is in: ${ar.area}</b>` + arBy.map(k => {
        const g = arAll[k] || {};
        return `<br>` + (g.url ? `<a class="adv-link" href="${g.url}" target="_blank" rel="noopener"><b>${ADV_SOURCES[k]}</b></a>` : `<b>${ADV_SOURCES[k]}</b>`)
             + `: ${ADV_TOP_WORDS[k]}` + (g.as_of ? ` <span class="adv-date">(${g.as_of})</span>` : "");
      }).join("") + `</div>`
    : "";
  const others = keys.filter(k => !ours.includes(k));
  const onlyMine = ours.length
    ? `<div class="adv-line adv-date">Shown for ${ours.length > 1 ? "your passport countries" : "your passport country"}. <a class="adv-link" href="profile.html">Change ${ours.length > 1 ? "them" : "it"}</a>`
      + (others.length ? `, or see the <a class="adv-link" href="${all[others[0]].url}" target="_blank" rel="noopener">other governments</a>` : "") + `.</div>`
    : "";
  return `<div class="adv-banner adv-banner-lvl${Math.max(worst,3) >= 4 ? 4 : 3}">`
       + `<span class="adv-banner-ic">&#9888;</span> <span><b>${head}</b>`
       + regionLine + areaLine + show.map(line).join("") + note + onlyMine + `</span></div>`;
}

  /* Common-phrases popup: look up the phrasebook entry for this city's
     top-listed majority language via the alias table in city-phrases.js */
  const _topLangRaw = c.langs && c.langs.length ? (typeof c.langs[0] === "string" ? c.langs[0] : c.langs[0].l) : null;
  const _topLangKey = (typeof NRA_LANG_ALIAS !== "undefined" && _topLangRaw) ? NRA_LANG_ALIAS[_topLangRaw] : null;
  const cityPhrases = (_topLangKey && typeof NRA_LANG_PHRASES !== "undefined") ? NRA_LANG_PHRASES[_topLangKey] : null;
  const cityPhraseLang = _topLangKey;

  const stories = [
    {t:`First Impressions of ${c.city}`, d:"Coming soon", s:`${sg}-a`},
    {t:`What to Eat in ${c.city}`, d:"Coming soon", s:`${sg}-b`},
    {t:`A Perfect Day in ${c.city}`, d:"Coming soon", s:`${sg}-c`}
  ];

  /* Build temperature rows for the seasonal card */
  /* Neighborhood guide (real names, placeholder descriptions + lodging) */
  const hoods = CITY_HOODS[c.city] || [];
  const escB = s => String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
  /* Row of portrait photo tiles (tabs) */
  const hoodTilesHTML = hoods.map((name, i) => {
    const tagKey = (CITY_HOOD_TAG[c.city] && CITY_HOOD_TAG[c.city][i]) || null;
    const tm = tagKey && HOOD_TAG_META[tagKey];
    const tagHTML = tm ? `<span class="hood-tag" title="Best for: ${tm.label}"><span class="hood-tag-emoji">${tm.emoji}</span><span class="hood-tag-label">${tm.label}</span></span>` : '';
    return `
        <div class="hood-tile" role="tab" id="hood-tab-${i}" aria-controls="hood-panel-${i}" aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? 0 : -1}" data-hood-idx="${i}">
          <div class="hood-hero" data-hood="${name.replace(/"/g,'&quot;')}">
            ${tagHTML}
            <button type="button" class="photo-contrib hood-tile-contrib" data-contrib-kind="neighborhood-hero" data-contrib-subject="${name.replace(/"/g,'&quot;')}" data-contrib-idx="${i}">Contribute a photo</button>
            <h3 class="hood-name">${name}</h3>
            <p class="hood-credit"></p>
          </div>
        </div>`;
  }).join('');

  /* Map link for a pick: the exact venue by Google place ID when it has one, else a text search. */
  const pickMapHref = (p, hoodName) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.n + ', ' + hoodName + ', ' + c.city) + (p.pid ? '&query_place_id=' + encodeURIComponent(p.pid) : '');

  /* "+ Add to trip" on a landmark, day trip or pick (2026-10-22): trip-add.js's item mode saves it to a trip that
     stops in this city, or starts a new trip with this city as the first stop. Rows live in Supabase trip_items. */
  const tripItemBtn = o => `<button type="button" class="trip-item-btn" data-trip-item data-kind="${o.kind}" data-name="${escB(o.name)}" data-city="${escB(c.city)}" data-country="${escB(c.country)}" data-section="${escB(o.section || '')}" data-hood="${escB(o.hood || '')}" data-note="${escB(String(o.note || '').replace(/<[^>]*>/g, '').slice(0, 400))}" data-map="${escB(o.map || '')}" title="Add ${escB(o.name)} to a trip" aria-label="Add ${escB(o.name)} to a trip"></button>`;
  /* One venue row: label pill styled like the lodging tiers, name linked to Maps, one-line note. */
  /* A pick with `near` (source hood index) sits in a nearby neighborhood: the map link uses that hood and the row carries a flag.
     `near` equal to the pick's own hood index means just outside that hood's boundary (decisions.md 2026-09-24). */
  const nearHood = (p, i) => (p.near != null && p.near !== i && hoods[p.near]) ? hoods[p.near] : null;
  const nearFlag = (p, i) => {
    if (p.near != null && p.near === i && hoods[i]) return ` <span class="pick-near" title="This pick is just outside ${escB(hoods[i])}, a short walk from its edge">Just outside ${escB(hoods[i])}</span>`;
    const h = nearHood(p, i); return h ? ` <span class="pick-near" title="This pick is in the nearby neighborhood ${escB(h)}">Nearby: ${escB(h)}</span>` : ''; };
  /* "Suggest a place" button at the bottom of each card: opens suggest-place.js's form (Jeff, 2026-09-24),
     with Jeff's invitation above it (2026-09-25). */
  const SUGGEST_PLACE_PHRASE = { stay: " to stay", eat: " to eat", cafes: "", bars: " to drink" };   // the coffee card covers coffee and takeaway, so no phrase (Jeff, 2026-09-25)
  const suggestBtn = (section, i, label, dry) => `<div class="hood-suggest-wrap">
                <p class="hood-suggest-hint">Know a great place${dry ? " to go out" : SUGGEST_PLACE_PHRASE[section]} we should feature? Recommend it below</p>
                <button type="button" class="hood-suggest" data-suggest="${section}" data-hood-idx="${i}"${dry ? ' data-dry="1"' : ''}>+ ${label}</button>
              </div>`;
  /* Member credit on an approved suggestion: profile picture (filled in by paintRoamerCredits) linked to their profile. */
  const byHTML = p => p.by ? ` <a class="pick-by" href="roamer.html?id=${encodeURIComponent(p.by)}" data-roamer="${escB(p.by)}" title="Suggested by this Roamer. See their profile"><span class="pick-by-av" aria-hidden="true">R</span><span class="pick-by-name">Roamer</span></a>` : '';
  const pickRows = (list, meta, hoodName, i, kind) => list.map(p => {
    const m = meta[p.k] || { label: p.k, c: "#5c6933" };
    const vote = voteWidgetHTML({type:"recommendation", id:`${c.city}:${i}:${kind}:${p.n}`, city:c.city, extraClass:"fl-vote pick-vote", size:13});
    return `<div class="lodge-row pick-row"><span class="lodge-tier pick-kind" style="background:${m.c}">${escB(m.label)}</span><span class="bar-info">${tripItemBtn({kind:'place', name:p.n, section:kind, hood:nearHood(p, i) || hoodName, note:p.d, map:pickMapHref(p, nearHood(p, i) || hoodName)})} <a class="bar-name" href="${pickMapHref(p, nearHood(p, i) || hoodName)}" target="_blank" rel="noopener">${escB(p.n)}</a>${p.d ? ` <span class="bar-note">&mdash; ${escB(p.d)}</span>` : ''}${nearFlag(p, i)}${byHTML(p)}</span>${vote}</div>`;
  }).join('');
  const barRows = (list, hoodName, i) => list.map(b => {
    const meta = BAR_KIND_META[b.k] || { label: b.k, emoji: '' };
    const vote = voteWidgetHTML({type:"recommendation", id:`${c.city}:${i}:bar:${b.n}`, city:c.city, extraClass:"fl-vote pick-vote", size:13});
    return `<div class="bar-row"><span class="bar-kind" title="${escB(meta.label)}">${meta.emoji} ${escB(meta.label)}</span><span class="bar-info">${tripItemBtn({kind:'place', name:b.n, section:'bars', hood:nearHood(b, i) || hoodName, note:b.d, map:pickMapHref(b, nearHood(b, i) || hoodName)})} <a class="bar-name" href="${pickMapHref(b, nearHood(b, i) || hoodName)}" target="_blank" rel="noopener">${escB(b.n)}</a>${b.d ? ` <span class="bar-note">&mdash; ${escB(b.d)}</span>` : ''}${nearFlag(b, i)}${byHTML(b)}</span>${vote}</div>`;
  }).join('');
  /* Stay picks from Roamers use the lodging tier as their kind (High-end / Mid-range / Budget), labelled like the tier tags. */
  const LODGE_META = Object.fromEntries(LODGE_TIERS.map(t => [t.k, { label: t.label, c: t.c }]));
  /* "From Roamers" group: the approved suggestions for one section of one hood, under our picks, with a Show / Hide
     button. Empty when there are none. The visitor's choice to hide them is kept in this browser (nra_roamer_picks). */
  const roamerList = (sec, i) => (CITY_ROAMER[c.city] && CITY_ROAMER[c.city][sec] && CITY_ROAMER[c.city][sec][i]) || [];
  let roamerHidden = false; try { roamerHidden = localStorage.getItem('nra_roamer_picks') === 'hide'; } catch (e) {}
  const roamerGroup = (sec, i, name, rowsHTML) => {
    const list = roamerList(sec, i); if (!list.length) return '';
    const id = `roamer-${sec}-${i}`;
    return `<div class="roamer-picks"><p class="roamer-picks-head"><span>From Roamers</span><small>checked by us</small>`
         + `<button type="button" class="roamer-toggle" aria-controls="${id}" aria-expanded="${roamerHidden ? 'false' : 'true'}">${roamerHidden ? 'Show' : 'Hide'}</button></p>`
         + `<div class="roamer-picks-body" id="${id}"${roamerHidden ? ' hidden' : ''}>${rowsHTML(list)}</div></div>`;
  };

  /* Detail panels, one per hood; only the selected one is shown. */
  const hoodPanelsHTML = hoods.map((name, i) => {
    const tagKey = (CITY_HOOD_TAG[c.city] && CITY_HOOD_TAG[c.city][i]) || null;
    const tm = tagKey && HOOD_TAG_META[tagKey];
    const tagHTML = tm ? `<span class="hood-tag" title="Best for: ${tm.label}"><span class="hood-tag-emoji">${tm.emoji}</span><span class="hood-tag-label">${tm.label}</span></span>` : '';
    /* Bar picks for this hood — omitted entirely when we have no verified venues (ours or a Roamer's). */
    const barList = (CITY_BARS[c.city] && CITY_BARS[c.city][i]) || [];
    const dryHood = barList.length > 0 && !barList.some(b => b.k === 'dive' || b.k === 'party' || b.k === 'cocktail' || b.k === 'pub');
    /* An empty card stays visible with "Picks coming soon" and the Suggest button (Jeff, 2026-10-09). */
    const soonRow = (list, sec) => (list.length || roamerList(sec, i).length) ? '' : '<p class="pick-soon">Picks coming soon</p>';
    const barsHTML = `
            <div class="hood-bars">
              <p class="hood-bars-head">${dryHood ? 'Where to go out (alcohol-free)' : 'Where to drink'}</p>
              ${soonRow(barList, 'bars')}${barRows(barList, name, i)}
              ${roamerGroup('bars', i, name, l => barRows(l, name, i))}
              ${suggestBtn('bars', i, dryHood ? 'Suggest a place to go out' : 'Suggest a place to drink', dryHood)}
            </div>`;
    const eatList = (CITY_EAT[c.city] && CITY_EAT[c.city][i]) || [];
    const eatHTML = `
            <div class="hood-picks">
              <p class="hood-bars-head">Where to eat</p>
              ${soonRow(eatList, 'eat')}${pickRows(eatList, EAT_KIND_META, name, i, 'eat')}
              ${roamerGroup('eat', i, name, l => pickRows(l, EAT_KIND_META, name, i, 'eat'))}
              ${suggestBtn('eat', i, 'Suggest a place to eat')}
            </div>`;
    const cafeList = (CITY_CAFES[c.city] && CITY_CAFES[c.city][i]) || [];
    const cafeHTML = `
            <div class="hood-picks">
              <p class="hood-bars-head">Coffee &amp; takeaway</p>
              ${soonRow(cafeList, 'cafes')}${pickRows(cafeList, CAFE_KIND_META, name, i, 'cafes')}
              ${roamerGroup('cafes', i, name, l => pickRows(l, CAFE_KIND_META, name, i, 'cafes'))}
              ${suggestBtn('cafes', i, 'Suggest a coffee or takeaway spot')}
            </div>`;
    const lodgeVote = (kind, n) => voteWidgetHTML({type:"recommendation", id:`${c.city}:${i}:lodge:${kind}:${n}`, city:c.city, extraClass:"fl-vote pick-vote", size:13});
    const lodgeRows = (function(){ const raw = (CITY_LODGING[c.city] && CITY_LODGING[c.city][i]) || [], picks = raw.filter(Boolean); /* a tier left empty (its hotel replaced by a Roamer pick, 2026-10-20) is skipped; the others keep their labels */ if (raw.length >= 3) { return LODGE_TIERS.map((t, ti) => raw[ti] ? `<div class="lodge-row"><span class="lodge-tier" style="background:${t.c}">${t.label}</span><span class="lodge-name">${tripItemBtn({kind:'place', name:raw[ti], section:'stay', hood:name, note:t.label})} ${raw[ti]}</span>${lodgeVote(t.k, ti)}</div>` : '').join(''); } return picks.map((n, ni) => `<div class="lodge-row lodge-row-plain"><span class="lodge-name">${tripItemBtn({kind:'place', name:n, section:'stay', hood:name})} ${n}</span>${lodgeVote('plain', ni)}</div>`).join(''); })();
    const stayHTML = `
            <div class="hood-lodging">
              <p class="hood-bars-head">Where to stay</p>
              ${soonRow(lodgeRows ? [1] : [], 'stay')}${lodgeRows}
              ${roamerGroup('stay', i, name, l => pickRows(l, LODGE_META, name, i, 'stay'))}
              ${suggestBtn('stay', i, 'Suggest a place to stay')}
            </div>`;
    return `
        <div class="hood hood-panel" role="tabpanel" id="hood-panel-${i}" aria-labelledby="hood-tab-${i}"${i === 0 ? '' : ' hidden'}>
          <div class="hood-body">
            <div class="hood-panel-head">
              <h3>${name}</h3>${tagHTML}
              <a class="hood-map-text" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ', ' + c.city)}" target="_blank" rel="noopener">View on a map &rarr;</a>
              <div class="hood-panel-tools">${voteWidgetHTML({type:"hood_photo", id:`${c.city}:${i}`, city:c.city, extraClass:"hood-vote", size:15, icon:"heart"})}</div>
            </div>
            <p class="hood-desc">${(CITY_HOOD_DESC[c.city] && CITY_HOOD_DESC[c.city][i]) ? CITY_HOOD_DESC[c.city][i] : `Placeholder — a short overview of ${name} will go here: the vibe, who it suits, and what's nearby.`}</p>
            <div class="hood-groups">${stayHTML}${eatHTML}${cafeHTML}${barsHTML}</div>
          </div>
        </div>`;
  }).join('');

  const hoodsHTML = `<div class="hood-tiles" role="tablist" aria-label="${escB(c.city)} neighborhoods">${hoodTilesHTML}</div>
      <div class="hood-panels">${hoodPanelsHTML}</div>${hoods.length > 1 ? `
      <div class="hood-foot"><button type="button" class="hood-toggle-all" aria-pressed="false">Show all ${hoods.length} at once</button></div>` : ''}`;

  const avoid = CITY_AVOID[c.city] || [];
  const avoidHTML = avoid.length ? `
      <div class="avoid-sec">
        <h3 class="avoid-title"><span class="avoid-ico" aria-hidden="true">&#9888;</span> Safety notes / Areas to reconsider or avoid</h3>
        ${avoid.map((a, ai) => `
          <div class="avoid-card avoid-${a.tier}">
            <p class="avoid-name">${a.area}</p>
            <p class="avoid-reason">${a.reason}</p>
            ${a.q ? `<a class="avoid-map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.q + ', ' + c.city)}" target="_blank" rel="noopener">View on map &rarr;</a>` : ''}
            ${voteWidgetHTML({type:"safety_note", id:`${c.city}:avoid:${ai}`, city:c.city, extraClass:"fl-vote", size:13})}
          </div>`).join('')}
      </div>` : '';

  const rain = CITY_RAIN[c.city] || {};
  const seasonNames = seasonsFor(c.lat);
  const seasons = [
    {label:'Jan – Mar', f: c.temps.q1, r: rain.q1, s: seasonNames[0]},
    {label:'Apr – Jun', f: c.temps.q2, r: rain.q2, s: seasonNames[1]},
    {label:'Jul – Sep', f: c.temps.q3, r: rain.q3, s: seasonNames[2]},
    {label:'Oct – Dec', f: c.temps.q4, r: rain.q4, s: seasonNames[3]}
  ];
  const RAIN_ICON = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5s6.5 7.5 6.5 12.5a6.5 6.5 0 0 1-13 0C5.5 10 12 2.5 12 2.5z"/></svg>`;

  const tempRowsHTML = seasons.map(({label, f, r, s}) => `
    <div class="temp-row">
      <span class="season-label">${label} <span class="season-name">(${s})</span></span>
      <span class="temp-val">${f}°F / ${toCelsius(f)}°C</span>
      ${r == null ? "" : `<span class="rain-val">${RAIN_ICON} ${r > 0 && r < 0.5 ? "<1" : Math.round(r)} days/mo</span>`}
      <div class="temp-bar-track">
        <div class="temp-bar" style="width:${tempWidth(f)}%;background:${tempColor(f)}"></div>
      </div>
    </div>`).join('');

  /* Currency card setup */
  const curCode = CITY_CUR[c.city] || "USD";
  const curInfo = CURRENCIES[curCode] || {s:curCode, n:curCode};
  const defaultTarget = curCode === "USD" ? "EUR" : "USD";
  const cardPct = CITY_CARD[c.city];
  const cardLvl = cardPct != null ? cardLevel(cardPct) : null;
  const cardAcceptHTML = cardPct == null ? "" : `
          <div class="card-accept">
            <span class="ca-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2.5"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </span>
            <div class="ca-text">
              <span class="ca-pct" style="color:${cardLvl.c}">${cardPct}%</span>
              <span class="ca-label"> of businesses take cards — <span class="ca-word" style="color:${cardLvl.c}">${cardLvl.w}</span>${noteBtn("card", "Card acceptance")}</span>
            </div>
            <div class="ca-bar-track"><div class="ca-bar" style="width:${cardPct}%;background:${cardLvl.c}"></div></div>
          </div>`;

  const cost = CITY_COST[c.city];
  const hotelRange = CITY_HOTEL[c.city];
  /* Daily Cost Estimator toggle state (persists across currency changes) */
  let csnapIncludeAlcohol = true;
  let csnapIncludeActivities = true;
  let csnapSolo = false;
  const rides = CITY_RIDES[c.city];
  const drinks = CITY_DRINKS[c.city];
  const net = CITY_NET[c.city];

  /* Emergency numbers + embassy finder card */
  const em = CITY_EMERGENCY[c.city];
  const telHref = s => "tel:" + s.replace(/\D/g, "");
  const emergencyHTML = !em ? "" : `
          <div class="emrg">
            <div class="emrg-row"><span class="emrg-k">Police</span><span class="emrg-v"><a href="${telHref(em.police)}">${em.police}</a></span></div>
            <div class="emrg-row"><span class="emrg-k">Ambulance / Fire</span><span class="emrg-v"><a href="${telHref(em.medical)}">${em.medical}</a></span></div>
            ${em.note ? `<div class="emrg-note">${em.note}</div>` : ""}
          </div>`;
  const embassyCardHTML = `
        <div class="fact safety-card">
          <div class="k">Emergency &amp; embassy</div>
          ${emergencyHTML}
          <div class="embassy">
            <label class="embassy-k" for="embassy-sel">Find your embassy</label>
            <input type="text" id="embassy-sel" list="embassy-country-list" placeholder="Start typing your country…" autocomplete="off" />
            <datalist id="embassy-country-list">
              ${EMBASSY_COUNTRIES.map(cc => `<option value="${cc}">`).join('')}
            </datalist>
            <p class="embassy-hint" id="embassy-hint">Type a country for a Maps link to the nearest embassy.</p>
            <a class="embassy-link" id="embassy-link" target="_blank" rel="noopener" hidden></a>
          </div>
        </div>`;

  /* "Always true here" card — weekly rules that never change, like the
     Sunday shop-closing laws in Germany and Poland, Shabbat in Israel or
     Rwanda's Umuganda morning. These deliberately live here rather than in
     the date banner on the trip planner: a warning that fires every
     Sunday is one people stop reading. Data in city-holidays.js.
     Renders nothing at all for countries with no such rule. */
  const standingRules = (window.NRA_HOLIDAYS && NRA_HOLIDAYS.standing)
    ? NRA_HOLIDAYS.standing(c.country) : [];
  const standingHTML = !standingRules.length ? "" : `
        <div class="fact fact-wide">
          <div class="k">Worth knowing before you plan your days</div>
          ${standingRules.map(r => `
          <div class="ratio-line"><b>${r.title}</b></div>
          <p class="embassy-hint">${r.note}</p>`).join("")}
        </div>`;

  const ridesHTML = rides == null ? "" : `
          <div class="rides">
            <span class="rides-k">Ride-share apps</span>
            ${rides.length
              ? `<div class="rides-list">${rides.map(r => {
                    /* Real apps become a link to the store for this device;
                       entries like "local taxi companies" stay plain text. */
                    const appUrl = window.nraAppLink ? window.nraAppLink(r, c.country) : null;
                    return appUrl
                      ? `<a class="ride-chip" href="${appUrl}" target="_blank" rel="noopener" title="Get the ${r} app">${r}</a>`
                      : `<span class="ride-chip">${r}</span>`;
                  }).join('')}</div>`
              : `<span class="rides-none">Local taxis — no major apps</span>`}
          </div>`;
  const tx = CITY_TAXI[c.city];
  const taxiTipHTML = !tx ? "" : `
          <button type="button" class="taxi-tip-btn" data-taxitip="1">Taxi tips / info &rarr;</button>`;
  const tip = CITY_TIP[c.city];
  const tipLvl = tip ? tipInfo(tip.s) : null;
  const tipHTML = !tip ? "" : `
          <div class="tip-line">
            <span class="tip-ic" aria-hidden="true">${TIP_ICON}</span>
            <span>Tipping <b style="color:${tipLvl.c}">${tipLvl.w}</b> &middot; ${tip.r}</span>
          </div>`;
  /* Cost snapshot: $-tier badge (from mid daily budget) + low/mid/high per-day
     estimates, priced in the given currency code. The formula lives in
     cost-estimator.js (NRA_COST) and is shared with the Destination Finder,
     so both pages always agree. The "Include alcoholic beverages" /
     "Include activities/tours" checkboxes add or remove those pieces live. */
  const costTier = NRA_COST.costTier;
  function computeDailyTiers(includeAlcohol, includeActivities, solo) {
    /* Per-person figure = the party's daily total split evenly. Default assumes two
       people sharing a room; the "traveling solo" toggle prices a room for one. */
    return NRA_COST.perPerson({ cost, hotel: hotelRange, drinks },
                              { travelers: solo ? 1 : 2, includeAlcohol, includeActivities });
  }
  function buildCostSnapshot(code) {
    const tiers = computeDailyTiers(csnapIncludeAlcohol, csnapIncludeActivities, csnapSolo);
    if (tiers == null) return "";
    const alcoholProhibited = !!(drinks && drinks.beer === "notallowed");
    const t = costTier(tiers.m);
    const dollars = '<span style="color:' + t.c + '">' + '$'.repeat(t.n) + '</span>'
                  + '<span class="csnap-dim">' + '$'.repeat(4 - t.n) + '</span>';
    return `
          <div class="csnap-box">
            <div class="csnap-head">
              <span class="csnap-k">Daily Cost Estimator <span class="csnap-persons">&middot; est. per person/day</span></span>
              <span class="csnap-afford-label">Affordability factor</span>
              <span class="csnap-tier" aria-label="${t.w}">${dollars}</span>
              <span class="csnap-word" style="color:${t.c}">${t.w}</span>
            </div>
            <div class="csnap-days">
              <div class="csnap-day csnap-day-budget"><span class="cd-k">Budget</span><span class="cd-v">${fmtPrice(tiers.b, code)}</span></div>
              <div class="csnap-day csnap-day-mid"><span class="cd-k">Mid-Range</span><span class="cd-v">${fmtPrice(tiers.m, code)}</span></div>
              <div class="csnap-day csnap-day-high"><span class="cd-k">High-End</span><span class="cd-v">${fmtPrice(tiers.h, code)}</span></div>
            </div>
            <div class="csnap-toggles">
              <label class="csnap-toggle${alcoholProhibited ? " csnap-toggle-disabled" : ""}" ${alcoholProhibited ? 'title="Alcohol is prohibited in this city, so it isn\'t included in the estimate"' : ""}><input type="checkbox" id="csnap-alcohol-toggle" ${csnapIncludeAlcohol && !alcoholProhibited ? "checked" : ""} ${alcoholProhibited ? "disabled" : ""}> Include alcoholic beverages</label>
              <label class="csnap-toggle"><input type="checkbox" id="csnap-activities-toggle" ${csnapIncludeActivities ? "checked" : ""}> Include activities/tours</label>
              <label class="csnap-toggle"><input type="checkbox" id="csnap-solo-toggle" ${csnapSolo ? "checked" : ""}> I'm traveling solo (calculates lodging cost for one)</label>
            </div>
            <div class="csnap-vote-row">${voteWidgetHTML({type:"cost_estimator", id:c.city, city:c.city, extraClass:"csnap-vote", size:14})}</div>
          </div>`;
  }

  /* Build the three cost cards with prices in the given currency code */
  function buildCostCards(code) {
    if (cost == null) return "";
    const tiersRow = `
          <div class="hotel-row">
            <div class="ht"><span class="ht-k">Budget</span><span class="ht-v">${fmtPrice(hotelRange ? hotelRange.b : cost.hotel, code)}</span></div>
            <div class="ht"><span class="ht-k">Comfort</span><span class="ht-v">${fmtPrice(cost.hotel, code)}</span></div>
            <div class="ht"><span class="ht-k">Luxury</span><span class="ht-v">${fmtPrice(hotelRange ? hotelRange.h : cost.hotel, code)}</span></div>
          </div>`;
    /* Laundry: wash + one dry in the chosen currency, from the sheet's researched
       figures. Most prices are a country-level figure (marked); where none is
       published the availability judgement shows instead. Details in the modal. */
    const ln = CITY_LAUNDRY[c.city];
    const AVAIL_WORD = { common:"self-service common", some:"some self-service", rare:"self-service rare", none:"no self-service laundromats" };
    /* Which laundry figure to show, in order: self-service wash + dry (USD in the
       sheet); else the attended drop-off price, which is the primary figure in
       most of Africa, South Asia, the Middle East and Latin America. Drop-off is
       stored as written ("20", "24-40", "1.75-2.25/lb") in the local currency, so
       it is converted only when it is a plain number or range; anything else is
       shown as text rather than guessed at. */
    const dropShown = (() => {
      if (!ln || ln.usd != null || !ln.drop) return null;
      const unit = /lb/i.test(ln.drop) ? "lb" : "kg";
      const m = String(ln.drop).match(/^\s*([\d.,]+)\s*(?:[-\u2013]\s*([\d.,]+))?\s*(?:\/\s*(?:kg|lb))?\s*$/i);
      const num = s => parseFloat(String(s).replace(/,/g, ""));
      if (m && ln.cur && RATES[ln.cur]) {
        /* local currency -> USD, then fmtPrice gives the symbol and rounding every other price on the card uses */
        const lo = convert(num(m[1]), ln.cur, "USD"), hi = m[2] ? convert(num(m[2]), ln.cur, "USD") : null;
        if (lo != null) return { v: hi != null ? `${fmtPrice(lo, code)}&ndash;${fmtPrice(hi, code)}` : fmtPrice(lo, code), n: `drop-off &middot; per ${unit}` };
      }
      return { v: "&mdash;", n: `drop-off &middot; ${ln.cur ? ln.cur + " " : ""}${String(ln.drop).replace(/</g, "&lt;")}` };
    })();
    const laundryHTML = !ln ? "" : `
          <div class="hx">
            <div class="hx-k">Laundry<button type="button" class="note-btn" onclick="openModal('Laundry')" aria-label="Laundry — more info" title="More info">${INFO_ICON}</button></div>
            <div class="hx-v">${ln.usd != null ? fmtPrice(ln.usd, code) + (ln.usdMax != null ? "&ndash;" + fmtPrice(ln.usdMax, code) : "") : dropShown ? dropShown.v : "&mdash;"}</div>
            <div class="hx-n">${ln.usd != null ? "wash + dry" + (ln.scope === "country" ? " &middot; country avg" : "") : dropShown ? dropShown.n + (ln.scope === "country" ? " &middot; country avg" : "") : (AVAIL_WORD[ln.avail] || "price not published")}</div>
          </div>`;
    /* Gym: day-pass research not done yet — "coming soon", the same placeholder
       wording the phrases card uses, until the data lands. */
    const gyms = CITY_GYMS[c.city];
    const dayPasses = (gyms || []).map(g => g.pass && g.pass.day && g.pass.day.usd).filter(v => typeof v === "number" && v > 0);   // paid passes only; free trials are listed in the modal
    const freeCount = (gyms || []).filter(g => g.free).length;
    const gymHTML = `
          <div class="hx">
            <div class="hx-k">Gym</div>
            <div class="hx-v">${dayPasses.length ? fmtPrice(Math.min(...dayPasses), code) : "&mdash;"}</div>
            <div class="hx-n">${dayPasses.length ? "day pass &middot; from" : gyms === undefined ? "day pass &middot; coming soon" : freeCount ? "free outdoor gym nearby" : gyms.length ? "pass available &middot; price on site" : "no day-pass gyms found"}</div>
          </div>`;
    return `
        <div class="fact cost-card">
          <span class="cost-icon" aria-hidden="true">${COST_ICONS.taxi}</span>
          <div class="k">Taxi / Uber &middot; 10 km</div>
          <div class="v">${fmtPrice(cost.taxi, code)}</div>
          <div class="cost-note">typical fare</div>
          ${ridesHTML}
          ${taxiTipHTML}
        </div>
        <div class="fact cost-card">
          <span class="cost-icon" aria-hidden="true">${COST_ICONS.hotel}</span>
          <div class="k">Hotel Room &middot; Nightly Avg<button type="button" class="note-btn hint-btn" data-hint="Our own researched estimates: citywide averages in US dollars, not quotes from any booking site. Prices vary a lot by neighborhood and season." onclick="this.classList.toggle('open')" aria-label="About these prices">${INFO_ICON}</button></div>
          ${tiersRow}
          <div class="hotel-extras">${laundryHTML}${gymHTML}</div>
          <button type="button" class="find-lg-btn">Find laundry &amp; gyms nearby &rarr;</button>
        </div>
        <div class="fact cost-card">
          <span class="cost-icon" aria-hidden="true">${COST_ICONS.meal}</span>
          <div class="k">Meal &middot; per person</div>
          <div class="v">${fmtPrice(cost.meal, code)}</div>
          <div class="cost-note">sit-down restaurant</div>
          ${tipHTML}
          ${typeof CITY_FOOD_INDEX !== "undefined" && CITY_FOOD_INDEX[c.city] ? `<button type="button" class="food-recs-btn" onmouseenter="loadFoodData()" onclick="openModal('Local food &amp; drink')">${INFO_ICON} Local food &amp; drink recommendations</button>` : ""}
        </div>
        ${drinks == null ? "" : `
        <div class="fact cost-card">
          <span class="cost-icon" aria-hidden="true">${DRINK_ICON}</span>
          <div class="k">Drinks <span class="drinks-avg-note">average price per drink</span></div>
          <div class="drinks-list">
            <div class="drink-row"><span class="dr-k">Coffee &middot; takeaway</span><span class="dr-v">${fmtPrice(drinks.coffee, code)}</span></div>
            <div class="drink-row"><span class="dr-k">Beer &middot; 0.5L</span>${
              typeof drinks.beer === "number"
                ? `<span class="dr-v">${fmtPrice(drinks.beer, code)}</span>`
                : `<button type="button" class="alc-note" onclick="openModal('Alcohol rules')">${INFO_ICON} ${drinks.beer === "notallowed" ? "Prohibited" : "Restricted"}</button>`
            }</div>
            <div class="drink-row"><span class="dr-k">Water &middot; bottle</span><span class="dr-v">${fmtPrice(drinks.water, code)}</span></div>
          </div>
          ${(() => {
            const w = CITY_WATER[c.city];
            if (!w) return "";
            const col = w.status === "safe" ? "#1d9a6c" : w.status === "unsafe" ? "#c0392b" : "#b5492c";
            const label = w.status === "safe" ? "Tap water: safe to drink" : w.status === "unsafe" ? "Tap water: not recommended" : "Tap water: uncertain";
            return `<p class="tap-water-note"><b style="color:${col}">${label}</b>${w.note ? ` &middot; <button type="button" class="water-more-btn" onclick="openModal('Tap water safety')">${INFO_ICON} More info</button>` : ''}</p>`;
          })()}
        </div>`}`;
  }

  /* Build the full-width Connectivity banner (shown above the cost cards);
     the per-GB SIM price converts into currency `code` */
  function buildNetCard(code) {
    if (net == null) return "";
    const fwLvl = fwInfo(net.fw);
    const power = CITY_POWER[c.city];
    const powerHTML = power ? `
        <div class="net-power">
          <span class="rides-k">Electricity</span>
          <div class="plug-list" data-no-i18n>${power.plugs.map(p => `
            <div class="plug-item">${plugIconSVG(p)}<span class="plug-letter">Type ${p}</span></div>`).join('')}
            <span class="plug-meta">${[power.v, power.hz].filter(Boolean).join(" &middot; ")}</span>
          </div>
        </div>` : "";
    return `
        <div class="net-head">
          <span class="cost-icon" aria-hidden="true">${COST_ICONS.net}</span>
          <div class="k">Connectivity${noteBtn("net", "Connectivity")}</div>
          <span class="net-est">country averages &middot; estimates</span>
          <button type="button" class="esim-btn" onclick="openModal('Travel eSIMs')">Buy an eSIM &rarr;</button>
        </div>
        <div class="net-stats">
          <div class="ns">
            <div class="k">Wi-Fi &middot; broadband</div>
            <div class="ns-v">${net.w} Mbps</div>
          </div>
          <div class="ns">
            <div class="k">Free public Wi-Fi</div>
            <div class="ns-v" style="color:${fwLvl.c}">${fwLvl.w}</div>
            <div class="ns-note">${NET_FW_NOTES[net.fwn]}</div>
          </div>
          <div class="ns">
            <div class="k">Airport Wi-Fi</div>
            <div class="ns-v" style="color:#1d9a6c">Free</div>
            <div class="ns-note">${NET_AP_NOTES[net.ap]}</div>
          </div>
          <div class="ns">
            <div class="k">Mobile &middot; avg download</div>
            <div class="ns-v">${net.m} Mbps</div>
          </div>
          <div class="ns">
            <div class="k">Tourist SIM &middot; per GB</div>
            <div class="ns-v">${fmtGB(net.gb, code)}</div>
          </div>
        </div>
        <div class="net-ops-row">
          <span class="rides-k">Mobile operators</span>
          <div class="rides-list" data-no-i18n>${net.ops.map(o => `<span class="ride-chip">${o}</span>`).join('')}</div>
          ${powerHTML}
        </div>`;
  }

  /* ---------- Photo credit rendering ----------
     The visible caption shows just the photographer; the licence travels in the
     title attribute and in full on the linked source page. CC BY 4.0 s.3(a)(2)
     permits satisfying attribution "by providing a URI or hyperlink to a
     resource that includes the required information" — which the Commons and
     Flickr pages we link to do. Resizing/WebP conversion is a format shift, not
     an adaptation, so no modification notice is required. */
  function creditHTML(ph, cls) {
    if (!ph || !ph.page) return "";
    const esc = t => String(t).replace(/[<>&"]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]));
    const full = String(ph.credit || "").trim();
    /* Strip only a trailing licence segment. 34 credits legitimately contain
       "/" inside the attribution itself (co-authors, archives), so splitting on
       the first slash would truncate a real name. */
    const LIC = /\s+\/\s+(CC[ 0-9A-Z.\-]*|Public domain|GFDL[ 0-9.]*|FAL|Unsplash|Pexels|Pixabay)\s*$/i;
    const name = full.replace(LIC, "").trim();
    const shown = name || "Photo";
    const tip = full || "Photo source";
    return `<span class="${cls}"><a href="${esc(ph.page)}" target="_blank" rel="noopener" title="${esc(tip)}">${esc(shown)}</a></span>`;
  }

  /* DiscoverCars affiliate: the city's own DiscoverCars page, or the guide's airport page where the city has none
     (CITY_SCHEMA.md "carhire"; coverage check in _needs-attention/discovercars-coverage-2026-10-05.md). */
  const DISCOVERCARS_AID = "NRA2026";
  const FAR_AIRPORT_KM = 100;   // the one place this threshold is set
  function carHireHTML(){
    const h = CITY_CARHIRE[c.city];
    if (!h || !h.u) return "";
    const where = h.k === "airport" && h.n ? `at ${h.n}` : `in ${c.city}`;
    /* An airport link far from the city says how far, and that it is still the usual arrival airport (Jeff, 2026-10-07) */
    const a = CITY_AIRPORT[c.city];
    const far = h.k === "airport" && a && a.km >= FAR_AIRPORT_KM
      ? `<p class="car-far">This airport is about ${a.km} km (${Math.round(a.km * 0.621371)} mi) from ${c.city}, but it is the usual airport for arriving here.</p>` : "";
    return `<a class="dtcard-tours" href="https://www.discovercars.com/${encodeURI(h.u)}?a_aid=${DISCOVERCARS_AID}" target="_blank" rel="noopener sponsored">
            <span class="dtcard-tours-k">Compare rental cars ${where} &rarr;</span>
            <span class="dtcard-tours-v">on DiscoverCars</span>
          </a>${far}`;
  }
  /* Kiwitaxi affiliate: a car with a driver, for cities no self-drive site covers (CITY_SCHEMA.md "driver";
     car-rental-second-program-2026-10-06.md); the city's Kiwitaxi hub page, or its airport's */
  const KIWITAXI_TAG = "pap=e6lwpod0n1w03";
  function driverHTML(){
    const d = CITY_DRIVER[c.city];
    if (!d || !d.u) return "";
    const where = d.k === "airport" && d.n ? `from ${d.n}` : `in ${c.city}`;
    return `<a class="dtcard-tours" href="https://kiwitaxi.com/en/${encodeURI(d.u)}?${KIWITAXI_TAG}" target="_blank" rel="noopener sponsored">
            <span class="dtcard-tours-k">Car with a driver ${where} &rarr;</span>
            <span class="dtcard-tours-v">on Kiwitaxi</span>
          </a>`;
  }
  /* Trip.com affiliate: self-drive for guides DiscoverCars does not cover, and a second choice on a few it does
     (CITY_SCHEMA.md "tripcar"; car-gap-coverage-2026-10-12.md); the city's Trip.com page, a station in it, or its airport */
  const TRIPCOM_TAG = "Allianceid=10986851&SID=333233083&trip_sub1=carcard&trip_sub3=D20230044";
  function tripCarHTML(){
    const t = CITY_TRIPCAR[c.city];
    if (!t || !t.u) return "";
    const where = (t.k === "airport" || t.k === "station") && t.n ? `at ${t.n}` : `in ${c.city}`;
    return `<a class="dtcard-tours" href="https://www.trip.com/carhire/${encodeURI(t.u)}?${TRIPCOM_TAG}" target="_blank" rel="noopener sponsored">
            <span class="dtcard-tours-k">Compare rental cars ${where} &rarr;</span>
            <span class="dtcard-tours-v">on Trip.com</span>
          </a>`;
  }
  /* Klook affiliate: a car with a driver (day charter) in mainland China, where visitors cannot drive on a foreign licence
     (CITY_SCHEMA.md "klookcar"; decisions.md 2026-10-14); Klook's own charter page for the city, or a Klook search */
  const KLOOK_AID = "139237";
  function klookCarHTML(){
    const k = CITY_KLOOKCAR[c.city];
    if (!k || !k.u || !KLOOK_AID) return "";
    return `<a class="dtcard-tours" href="https://www.klook.com/en-US/${k.u}${k.u.includes("?") ? "&" : "?"}aid=${KLOOK_AID}" target="_blank" rel="noopener sponsored">
            <span class="dtcard-tours-k">Car with a driver in ${c.city} &rarr;</span>
            <span class="dtcard-tours-v">on Klook</span>
          </a>`;
  }
  function bookLinksHTML(){ return carHireHTML() + tripCarHTML() + klookCarHTML() + driverHTML(); }

  /* ---------- International driving permit, by the licence the reader holds (decisions.md 2026-10-08) ----------
     driving-permits.js: researched values for US, UK, Canadian and Australian licences (each government's own advice),
     plus each licence country's road-traffic convention membership. Any other licence gets a worked-out answer,
     always labelled as such. The licence defaults to the reader's first saved passport, else the US (Jeff, 2026-10-10); the dropdown overrides it. */
  const PERMIT_SRC = { us: "US State Department", uk: "UK FCDO", ca: "Government of Canada", au: "Smartraveller (Australia)" };
  const PERMIT_KEY = { "United States": "us", "United Kingdom": "uk", "Canada": "ca", "Australia": "au" };
  const PERMIT_STRICT = ["Not accepted", "Local permit", "Required", "Recommended", "Not required"];
  function permitDest(){ return c.country === "China (SAR)" ? c.city : c.country; }
  function permitLicence(){
    try { const v = localStorage.getItem("nra_licence_country"); if (v) return v; } catch(e){}
    const P = (typeof NRA_PERMITS !== "undefined") ? NRA_PERMITS.lic : {};
    const p = myPassports().find(x => P[x]);
    if (p) return p;
    return P["United States"] ? "United States" : "";   // no passport and no choice: US rules (Jeff, 2026-10-10)
  }
  function permitIsDefault(){
    try { if (localStorage.getItem("nra_licence_country")) return false; } catch(e){}
    const P = (typeof NRA_PERMITS !== "undefined") ? NRA_PERMITS.lic : {};
    return !myPassports().some(x => P[x]);
  }
  function permitFor(lic){
    const D = NRA_PERMITS.dest[permitDest()] || {};
    const fold = n => (window.NRA_foldCountry ? NRA_foldCountry(n) : n);
    const k = PERMIT_KEY[lic];
    if (k && D[k] && D[k][0]) return { v: D[k][0], kind: "src", key: k };
    if (fold(permitDest()) === lic || permitDest() === lic) return { v: "Not required", kind: "home" };
    const L = NRA_PERMITS.lic[lic] || [false, false], here = NRA_PERMITS.lic[fold(permitDest())] || NRA_PERMITS.lic[permitDest()];
    const inGroup = g => NRA_PERMITS[g].includes(lic) && NRA_PERMITS[g].includes(fold(permitDest()));
    if (inGroup("eu") || inGroup("gcc")) return { v: "Not required", kind: "region", group: inGroup("eu") ? "EU/EEA" : "Gulf (GCC)" };
    const vals = ["us", "uk", "ca", "au"].map(s => D[s] && D[s][0]).filter(Boolean);
    let v = "Recommended", kind = "default";
    if (vals.length){
      const n = {}; vals.forEach(x => n[x] = (n[x] || 0) + 1);
      v = Object.keys(n).sort((a, b) => n[b] - n[a] || PERMIT_STRICT.indexOf(a) - PERMIT_STRICT.indexOf(b))[0];
      kind = "worked";
    }
    let conv = null;
    if (v === "Required" || v === "Recommended"){
      const shared = here ? [here[0] && L[0] ? "1949" : null, here[1] && L[1] ? "1968" : null].filter(Boolean) : [];
      conv = shared.length ? shared : [];
    }
    return { v, kind, conv };
  }
  function permitBlockHTML(){
    if (typeof NRA_PERMITS === "undefined") return "";
    const lic = permitLicence();
    const opts = Object.keys(NRA_PERMITS.lic).sort((a, b) => a.localeCompare(b));
    const sel = `<label class="car-lic"><span>License issued from:</span><select class="car-lic-sel" aria-label="Country your driving licence is from">
        <option value=""${lic ? "" : " selected"}>Choose…</option>${opts.map(o => `<option${o === lic ? " selected" : ""}>${o}</option>`).join("")}</select></label>`;
    if (!lic) return `<div class="car-row"><span class="car-k">Int'l permit</span><span class="car-v">Depends on your licence</span></div>${sel}`;
    const r = permitFor(lic), D = NRA_PERMITS.dest[permitDest()] || {};
    let src = "";
    if (r.kind === "src"){ const s = D[r.key]; src = `<a class="inline" href="${s[1] && s[1].startsWith("http") ? s[1] : "#"}" target="_blank" rel="noopener">${PERMIT_SRC[r.key]}</a>${s[2] ? `, ${s[2]}` : ""}`; }
    else if (r.kind === "home") src = `Your licence's own country.`;
    else if (r.kind === "region") src = `${r.group} licences are valid across member countries.`;
    else {
      const base = r.kind === "worked" ? (PERMIT_KEY[lic] ? `The ${PERMIT_SRC[PERMIT_KEY[lic]]} does not say; worked out from other governments' advice.` : `Worked out from four governments' advice, not researched for ${lic} licences.`) : `No official advice found; carrying a permit is the safe choice.`;
      const cv = r.conv == null ? "" : r.conv.length ? ` Your country's permit is recognised here under the ${r.conv.join(" and ")} road-traffic convention.` : ` ${lic} and ${permitDest()} share no road-traffic convention, so your permit may not be recognised; check with the embassy.`;
      src = base + cv;
    }
    if (permitIsDefault()) src = `Showing US licence rules until you choose yours. ` + src;
    /* the source and the explanation sit behind the info icon (Jeff, 2026-10-20) */
    return `<div class="car-row"><span class="car-k">Int'l permit<button type="button" class="note-btn car-permit-info" aria-expanded="false" aria-label="About this permit advice">${INFO_ICON}</button></span><span class="car-v">${r.v}</span></div>${sel}<p class="car-permit-src">${src}</p>`;
  }

  /* "Before you rent" note for this country (rental-notes.js; CITY_SCHEMA.md "rental notes"), or null */
  function rentNote(){
    const n = (typeof NRA_RENT_NOTES !== "undefined") && NRA_RENT_NOTES[c.country];
    return n && n.n ? n : null;
  }
  function rentAffLine(){
    const p = [CITY_CARHIRE[c.city] && "DiscoverCars", CITY_TRIPCAR[c.city] && "Trip.com", KLOOK_AID && CITY_KLOOKCAR[c.city] && "Klook", CITY_DRIVER[c.city] && "Kiwitaxi"].filter(Boolean);
    if (!p.length) return "";
    const many = p.length > 1;
    const names = many ? p.slice(0, -1).join(", ") + " and " + p[p.length - 1] : p[0];
    return `<p class="dtcard-foot">The booking link${many ? "s open" : " opens"} ${names}. ${many ? "They are affiliate links" : "It is an affiliate link"}: it costs you nothing extra and helps keep Never Roam Alone free.</p>`;
  }
  function buildCarModal(){
    const n = rentNote();
    if (!n) return `<p class="modal-placeholder">More information about car rental in ${c.city} is coming soon.</p>`;
    const src = (n.src || []).map(s => `<a class="inline" href="${s.u}" target="_blank" rel="noopener">${s.t}</a>${s.d ? ` (${s.d})` : ""}`).join(", ");
    const link = bookLinksHTML();
    return `
      <h4 class="air-sub">Before you rent</h4>
      <p class="rt-intro">${n.n}</p>
      ${src ? `<p class="air-foot">Source: ${src}. ${(n.k || []).includes("unsafe") ? "Advice changes; check the latest government travel advice before you go." : "Rules can change; check with your rental company before you travel."}</p>` : ""}
      ${link ? `<h4 class="air-sub">Book</h4>${link}${rentAffLine()}` : ""}`;
  }

  /* Build the transportation cards; car rental price uses currency `code` */
  function buildTransport(code) {
    const t = CITY_TRANSPORT[c.city];
    if (!t) return "";
    const listCard = (icon, title, items, emptyMsg) => `
        <div class="tcard" tabindex="0" role="button" data-info="${title}" aria-label="${title} — more info">
          <span class="tcard-icon" aria-hidden="true">${icon}</span>
          <div class="tcard-k">${title}</div>
          ${items && items.length
            ? `<ul class="tcard-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`
            : `<p class="tcard-none">${emptyMsg}</p>`}
          <span class="tcard-more">More info &rarr;</span>
        </div>`;
    const side = t.car.side === "left" ? "Left" : "Right";
    /* A country with a "before you rent" note opens a popup (the note first, then the booking links);
       elsewhere the booking link sits on the card itself (decisions.md 2026-10-06) */
    const note = rentNote();
    const carCard = `
        <div class="tcard${note ? "" : " tcard-static"}"${note ? ` tabindex="0" role="button" data-info="Car rental" aria-label="Car rental — before you rent"` : ""}>
          <span class="tcard-icon" aria-hidden="true">${TRANSPORT_ICONS.car}</span>
          <div class="tcard-k">Car rental</div>
          <div class="car-info">
            <div class="car-row"><span class="car-k">Drives on</span><span class="car-v">${side} side</span></div>
            <div class="car-row"><span class="car-k">Mid-size &middot; day avg</span><span class="car-v">${fmtPrice(t.car.rental, code)}</span></div>
            ${typeof NRA_PERMITS !== "undefined" ? `<div class="car-permit">${permitBlockHTML()}</div>` : ""}
          </div>
          ${note ? `<span class="tcard-more">More info &rarr;</span>` : bookLinksHTML()}
        </div>`;
    return listCard(TRANSPORT_ICONS.air, "Major airports", t.air, "—")
         + listCard(TRANSPORT_ICONS.train, "Major train stations", t.train, "No intercity rail")
         + listCard(TRANSPORT_ICONS.bus, "Major bus stations", t.bus, "—")
         + listCard(TRANSPORT_ICONS.ferry, "Ferry / boat ports", t.ferry, "No passenger ferry ports")
         + carCard;
  }

  /* ---------- Day trips section ---------- */
  /* GetYourGuide affiliate: each trip's stored link (t.gyg) plus our partner ID. Since 2026-10-20 that is GetYourGuide's
     own page for the place (/-l<id>/, matched by name and country) where one exists, since a name search can land on
     another place of the same name (Naples, Florida searched as "Naples" showed Naples, Italy); else the name search.
     Not per-tour picks: the partner API needs 100k visits a month (decisions.md 2026-09-21, 2026-09-24, 2026-10-20). */
  const GYG_PARTNER_ID = "NCT4RBD";
  function dtTourHTML(t){
    if (!t.gyg) return "";
    const href = t.gyg + (t.gyg.includes("?") ? "&" : "?") + "partner_id=" + GYG_PARTNER_ID + "&utm_medium=online_publisher&cmp=daytrip";
    return `<a class="dtcard-tours" href="${href}" target="_blank" rel="noopener sponsored">
            <span class="dtcard-tours-k">${t.name} tours &rarr;</span>
            <span class="dtcard-tours-v">on GetYourGuide</span>
          </a>`;
  }
  function dtCardHTML(t, tier){
    const link = t.featured
      ? `<a href="city.html?city=${encodeURIComponent(t.name)}">${t.name}</a>`
      : t.name;
    const more = t.featured ? `<span class="dtcard-link">See guide &rarr;</span>` : "";
    const vote = voteWidgetHTML({type:"daytrip", id:`${c.city}:${t.name}`, city:c.city, extraClass:"dtcard-vote", size:14});
    /* hero photo: Commons, location-checked, credited like the landmark cards. A trip with no verified photo shows a
       placeholder with a "Contribute a photo" button instead, never a filler image (Jeff, 2026-09-30). */
    const tn = String(t.name).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    const ph = t.photo && t.photo.img ? `
          <div class="dtcard-photo"><img src="${t.photo.img}" alt="${tn}" loading="lazy" decoding="async">${creditHTML(t.photo, "dtcard-photo-credit")}</div>` : `
          <div class="dtcard-photo dtcard-photo-soon">
            <svg class="lmk-soon-ic" viewBox="0 0 44 34" aria-hidden="true"><rect x="2" y="2" width="40" height="30" rx="4"/><circle cx="13" cy="12" r="4"/><path d="M4 28l12-12 9 9 6-5 9 8"/></svg>
            <span class="lmk-soon-txt">Image coming soon</span>
            <button type="button" class="lmk-soon-btn" data-contrib-kind="daytrip" data-contrib-subject="${tn}">Contribute a photo</button>
          </div>`;
    return `
        <div class="dtcard">${ph}
          <div class="dtcard-head">
            <div class="dtcard-name">${link} ${tripItemBtn({kind:'daytrip', name:t.name, section:tier || '', note:t.blurb, map:'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(t.name + ', ' + (t.country || c.country))})}</div>
            ${vote}
          </div>
          <div class="dtcard-country">${t.country}</div>
          ${dtAlertHTML(t.alert)}
          <p class="dtcard-blurb">${t.blurb}</p>
          ${more}
          ${dtTourHTML(t)}
        </div>`;
  }
  /* Landmark & day-trip data files are lazy-loaded (see loadLmkDtData below);
     these start empty and are filled in when the data arrives. */
  let dt = null, lmks = [], lmkCoords = [], lmkPhotos = [];
  let lmkHint = null;   // arrow bar under the landmark row on phones (initSwipeHint)
  function buildLandmarksHTML(){ return !lmks.length ? "" : `
      <div class="lmk-cards-col">
      <div class="lmk-grid">` + lmks.map((l, i) => {
        const p = lmkCoords[i];
        const mapHref = p ? `https://www.google.com/maps/search/${encodeURIComponent(l[0])}/@${p.lat},${p.lng},16z` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l[0] + ' ' + c.city)}`;
        const photo = lmkPhotos[i];
        const photoHTML = (photo && photo.img) ? `<div class="lmk-photo" style="background-image:url('${photo.img}')">${creditHTML(photo, 'lmk-photo-credit')}</div>`
          : `<div class="lmk-photo lmk-photo-soon">
              <svg class="lmk-soon-ic" viewBox="0 0 44 34" aria-hidden="true"><rect x="2" y="2" width="40" height="30" rx="4"/><circle cx="13" cy="12" r="4"/><path d="M4 28l12-12 9 9 6-5 9 8"/></svg>
              <span class="lmk-soon-txt">Image coming soon</span>
              <button type="button" class="lmk-soon-btn" data-contrib-idx="${i}">Contribute</button>
            </div>`;
        /* votes are keyed by the landmark's name, not its slot, so removing or reordering a landmark never moves
           another landmark's votes (Jeff, 2026-09-24) */
        const lmkStar = voteStarHTML({type:"landmark", id:`${c.city}:${l[0]}:star`, city:c.city, extraClass:"lmk-vote-row", size:15,
          label:"Mark as a must-not-miss attraction"});
        /* the star goes inside the widget so it sits left of the "i" hint (Jeff, 2026-09-23) */
        const lmkVote = voteWidgetHTML({type:"landmark", id:`${c.city}:${l[0]}`, city:c.city, extraClass:"lmk-vote-row", size:14,
          beforeHint: lmkStar});
        return `
        <div class="lmk-card" data-lmk-idx="${i}">
          ${photoHTML}
          <div class="lmk-card-row">
            <div class="lmk-num">${i + 1}</div>
            <div class="lmk-body">
              <a class="lmk-name" href="${mapHref}" target="_blank" rel="noopener">${l[0]}</a>
              <p class="lmk-desc">${l[1]}</p>
              <div class="lmk-vote-wrap">${tripItemBtn({kind:'landmark', name:l[0], note:l[1], map:mapHref})}${lmkVote}</div>
            </div>
          </div>
        </div>`;
      }).join('') + `
      </div>
      <div class="lmk-big" id="lmk-big" hidden></div>
      <div class="lmk-expand" id="lmk-expand" hidden></div>
      </div>`; }

  /* A nearby guide goes in the half- or full-day list by its travel time (same limits as the day trips);
     it is shown after that list's day trips, nearest first, and the whole card opens the guide. */
  function dtGuideCardHTML(g){
    const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    /* the other city's own hero photo (city-photos.js holds all of them), the small 640px version, credited the same way
       the hero credits it (Jeff, 2026-09-30) */
    const hp = (window.NRA_CITY_PHOTO || {})[g.city];
    const ph = hp && hp.img ? `
          <div class="dtcard-photo"><img src="${esc(hp.img.replace(/\.webp$/, "-sm.webp"))}" alt="${esc(g.city)}" loading="lazy" decoding="async">${creditHTML({page: hp.page, credit: hp.credit || (/pexels\.com/.test(hp.page || "") ? "Pexels" : /unsplash\.com/.test(hp.page || "") ? "Unsplash" : "Wikimedia Commons")}, "dtcard-photo-credit")}</div>` : "";
    /* the whole card still opens the guide: the city name is the link and stretches over the card; the photo credit link sits above it */
    return `
        <div class="dtcard dtcard-guide">${ph}
          <div class="dtcard-head dtcard-head-guide">
            <div class="dtcard-name"><a class="dtcard-guide-link" href="city.html?city=${encodeURIComponent(g.city)}" aria-label="${esc(g.city)}: see our guide page">${esc(g.city)}</a></div>
            <span class="dt-guide-flag"><span class="dt-guide-emoji" aria-hidden="true">\u{1F9ED}</span><span>See Our<br>Guide Page</span></span>
          </div>
          <div class="dtcard-country">${esc(g.country)}</div>
          <p class="dtcard-blurb">${esc(g.blurb)}</p>
        </div>`;
  }
  function buildDayTripsHTML(){
    const half = (dt && dt.half) || [], full = (dt && dt.full) || [];
    const nb = (CITY_NEARBY[c.city] || []).slice().sort((a, b) => (a.mins || 0) - (b.mins || 0));
    const nh = nb.filter(g => g.tier === "half"), nf = nb.filter(g => g.tier === "full");
    if (!half.length && !full.length && !nh.length && !nf.length) return "";
    return `
      ${half.length || nh.length ? `<div class="daytrip-sub">Half day &middot; 1.5 hours or less one way</div>
      <div class="daytrip-grid">${half.map(t => dtCardHTML(t, "half")).join("")}${nh.map(dtGuideCardHTML).join("")}</div>` : ""}
      ${full.length || nf.length ? `<div class="daytrip-sub">Full day &middot; 3 hours or less one way</div>
      <div class="daytrip-grid">${full.map(t => dtCardHTML(t, "full")).join("")}${nf.map(dtGuideCardHTML).join("")}</div>` : ""}
      ${half.concat(full).some(t => t.gyg) ? `<p class="dtcard-foot">Tour links open GetYourGuide. They are affiliate links: they cost you nothing extra and help keep Never Roam Alone free.</p>` : ""}`; }

  const _coordStr = (typeof c.lat==="number" && typeof c.lng==="number")
    ? `${Math.abs(c.lat).toFixed(4)}\u00b0 ${c.lat>=0?"N":"S"} \u00b7 ${Math.abs(c.lng).toFixed(4)}\u00b0 ${c.lng>=0?"E":"W"}` : "";
  const _coordsLine = _coordStr ? `<p class="coords">${_coordStr}</p>` : "";
  const plate = (n,label) => `<div class="plate" data-plate-id="${n}"><svg class="cx"><use href="#compass"/></svg><button type="button" class="plate-toggle" aria-expanded="true">Hide</button><span class="tag"><b>Plate ${n}</b> \u00b7 ${label}</span><span class="dotline"></span></div>`;
  content.innerHTML = `
    <div class="hero" style="background-image:url('${hero}')">
      ${heroPh && heroPh.page ? `<span class="hero-credit">Photo: <a href="${heroPh.page}" target="_blank" rel="noopener">${heroPh.credit ? heroPh.credit : /pexels\.com/.test(heroPh.page) ? "Pexels" : /unsplash\.com/.test(heroPh.page) ? "Unsplash" : "Wikimedia Commons"}</a></span>` : ""}
      <button type="button" class="photo-contrib" data-contrib-kind="city-hero" data-contrib-subject="${c.city.replace(/"/g,'&quot;')}">Contribute a photo</button>
      <div class="hero-inner">
        <div class="crumb"><a href="${crumbHref}">${crumbText}</a> &nbsp;/&nbsp; ${c.country}</div>
        ${_coordsLine}
        <h1>${c.city}</h1>
        <div class="country">${c.country}</div>
        <p class="tagline">${c.tagline}</p>
        <div class="hero-fav-row">
          <div class="hero-visitors-wrap">
            <div class="chip"><b>${c.est?'~':''}${num}M</b><span>annual int'l ${c.est?'<span style="white-space:nowrap">visitors \u00b7 est.</span>':'visitors'}</span></div>
            ${voteWidgetHTML({type:"visitors", id:c.city, city:c.city, extraClass:"vote-boxed"})}
          </div>
          <div class="hero-fav-wrap">
            <button type="button" class="hero-fav" id="hero-fav-btn" data-fav-city="${c.city.replace(/"/g,'&quot;')}" data-fav-country="${c.country.replace(/"/g,'&quot;')}" title="Save to Favorites" aria-label="Save ${c.city} to Favorites"><span class="hero-fav-icon">&#9825;</span><span class="hero-fav-label">Favorite</span></button>
            <span class="hero-fav-count" id="hero-fav-count"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-back-bar" style="display:flex;gap:20px;flex-wrap:wrap"><a class="back back-guides" href="cities.html">&larr; Back to City Guides</a><a class="back" href="compare.html?a=${encodeURIComponent(c.city)}">Compare with another city <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-3px"><path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"/></svg></a><span class="trip-add-wrap"><a class="back back-itin" href="itinerary.html?type=upcoming" data-trip-add data-city="${encodeURIComponent(c.city)}" data-country="${encodeURIComponent(c.country)}">+ Add to trip</a><button type="button" class="note-btn hint-btn trip-hint" data-hint="Saves ${c.city} to your Wishlist, to a trip you have already started, or to a new trip you name. Your trips are kept on your Itinerary page. You need to be signed in." onclick="this.classList.toggle('open')" aria-label="What Add to trip does">${INFO_ICON}</button></span></div>

    ${buildAdvisoryBanner(c, cityAdv)}

    <section class="i18n-ml">
      ${plate("01","Duration")}
      ${buildVisitSection(c.city)}

      ${plate("02","Fast facts")}
      <div class="facts">
        <div class="fact fact-wide">
          <div class="temp-head">
            <div class="k">Best time to visit &mdash; avg high temperature</div>
            <div class="temp-foot">${RAIN_ICON} Average measurable rain days per month</div>
          </div>
          <div class="temp-rows">${tempRowsHTML}</div>
        </div>
        <div class="fact stat-combo">
          <div class="sc-top">
            <div class="sc-item"><div class="k">Population</div><div class="v">${c.pop}</div></div>
            <div class="sc-item"><div class="k">Annual visitors</div><div class="v">${num} M</div></div>
          </div>
          <div class="sc-metrics">
            ${touristRatio == null ? "" : `<div class="ratio-line"><span class="stat-dot" style="background:${ratioColor(touristRatio)}"></span>Daily tourist-to-local ratio <b style="color:${ratioColor(touristRatio)}">${touristRatio}%</b> &middot; ~${stayDays}-day avg stay${scaleBtn("Tourist ratio guide")}</div>`}
            ${walkLvl == null ? "" : `<div class="ratio-line"><span class="stat-dot" style="background:${walkLvl.c}"></span>Walk score <b style="color:${walkLvl.c}">${walk}/100</b> &middot; ${walkLvl.w}${scaleBtn("Walk score guide")}${noteBtn("walk", "Walkability")}</div>`}
            ${safety == null ? "" : `<div class="ratio-line"><span class="stat-dot" style="background:${safetyColor(safety.safety)}"></span>Safety index <a class="idx-link" href="http://www.google.de/search?q=${encodeURIComponent(c.city + ' safety index')}" target="_blank" rel="noopener" style="color:${safetyColor(safety.safety)}">${safety.safety}</a> &middot; Crime index <a class="idx-link" href="http://www.google.de/search?q=${encodeURIComponent(c.city + ' crime index')}" target="_blank" rel="noopener" style="color:${crimeColor(safety.crime)}">${safety.crime}</a>${scaleBtn("Safety & crime index guide")}${noteBtn("safety", "Safety notes")}</div>`}
            ${solo == null ? "" : `<div class="ratio-line"><span class="stat-dot" style="background:${SOLO_META[solo.sc].c}"></span>Solo comfort <b style="color:${SOLO_META[solo.sc].c}">${solo.score}/100</b> &middot; ${SOLO_META[solo.sc].w}${scaleBtn("Solo comfort guide")}</div>`}
            ${solo == null ? "" : `<div class="ratio-line"><span class="stat-dot" style="background:${SOLO_META[solo.sc].c}"></span>Main factor <b style="color:${SOLO_META[solo.sc].c}">${solo.f}</b></div>`}
          </div>
          <p class="stat-disclaimer"><em>*these average figures are displayed for reference purposes and may not reflect real world conditions</em></p>
        </div>
        ${standingHTML}
        ${embassyCardHTML}
        <div class="fact">
          <div class="k">Languages spoken by majority${noteBtn("langs", "Languages")}</div>
          <div class="lang-list">
            ${c.langs.map(({l,p})=>`
            <div class="lang-row">
              <span class="lang-name">${l}</span>
              <div class="lang-bar-track"><div class="lang-bar" style="width:${p}%"></div></div>
              <span class="lang-pct">${p}%</span>
            </div>`).join('')}
          </div>
          ${CITY_ENGLISH[c.city] ? `<div class="eng-box"><div class="lang-row eng-row"><span class="lang-name">English</span><span class="lang-pct eng-pct" style="color:${(ENG_META[CITY_ENGLISH[c.city].tier]||{}).c||'inherit'}">${CITY_ENGLISH[c.city].label}</span></div><div class="eng-sub">Conversation</div></div>` : ''}
          ${cityPhrases ? `<button type="button" class="phrases-link" id="phrases-open-btn" data-phrase-lang="${cityPhraseLang.replace(/"/g,'&quot;')}">Common phrases in ${cityPhraseLang} &rarr;</button>` : ''}
          <div class="rel-section">
            <div class="k rel-k">Religion by majority${noteBtn("religion", "Religion")}</div>
            <div class="lang-list">
              ${(CITY_RELIGION[c.city]||[]).map(({r,p})=>`
              <div class="lang-row">
                <span class="lang-name">${r}</span>
                <div class="lang-bar-track"><div class="lang-bar rel-bar" style="width:${p}%"></div></div>
                <span class="lang-pct rel-pct">${p}%</span>
              </div>`).join('')}
            </div>
          </div>
        </div>
        <div id="net-card" class="fact net-banner"></div>
        <div class="fact fact-wide cur-card">
          <div class="cur-head">
            <div class="k">Cost, currency and converter</div>
            <button type="button" class="atm-btn" id="atm-btn" aria-haspopup="dialog">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="7" y1="14" x2="9" y2="14"/><line x1="7" y1="17" x2="13" y2="17"/></svg>
              Find ATMs &amp; cash
            </button>
          </div>
          ${cardAcceptHTML}
          <div class="cur-grid">
            <div class="cur-local">
              <div class="cur-symbol">${curInfo.s}</div>
              <div class="cur-code">${curCode}</div>
              <div class="cur-name">${curInfo.n}</div>
            </div>
            <div class="cur-conv">
              <div class="conv-row" id="conv-row"></div>
              <div class="conv-sub">Enter an amount, pick a currency, or tap &#8644; to reverse</div>
              <label class="csnap-toggle conv-currency-toggle"><input type="checkbox" id="cost-currency-toggle"> Show estimated costs in chosen currency</label>
            </div>
          </div>
          <div id="cost-snapshot" class="cost-snapshot"></div>
        </div>
        <div id="cost-cards" class="cost-cards-grid"></div>
      </div>
    </section>

    <section style="padding-top:0">
      ${plate("03","Passage")}
      <h2 class="sec-head">Getting to/from <em>${c.city}</em>${noteBtn("transport", "Getting to and from the city")}</h2>
      ${CITY_TRANSPORT[c.city] ? '<div id="transport-cards" class="transport-grid"></div>' : `<p class="hood-intro">Detailed getting-around info for ${c.city} is coming soon.</p>`}
      ${CITY_TRANSPORT[c.city] && !rentNote() ? rentAffLine() : ""}
      <div id="transit-card" class="fact transit-banner" hidden></div>
    </section>

    <section style="padding-top:0">
      ${plate("04","Quarters")}
      <h2 class="sec-head">Neighborhood guide &mdash; <em>${c.city}</em></h2>
      ${hoods.length ? `<p class="hood-intro">A quick look at ${c.city}'s most distinctive neighborhoods — the character of each and who it suits — to help you choose the right base for your trip. Pick a neighborhood to see where to stay, eat and drink there. Picks are well-known local options — check current hours and availability before you go.</p>
      <div class="hoods">${hoodsHTML}</div>${avoidHTML}` : `<p class="hood-intro">Neighborhood guides for ${c.city} are coming soon.</p>`}
    </section>

    <section style="padding-top:0">
      ${plate("05","Landmarks")}
      <h2 class="sec-head">Top sights in <em>${c.city}</em></h2>
      <div id="lmk-section-body"><p class="hood-intro">Loading landmark picks for ${c.city}&hellip;</p></div>
    </section>

    <section style="padding-top:0">
      ${plate("06","Excursions")}
      <h2 class="sec-head">Day trips from <em>${c.city}</em></h2>
      <div id="daytrips-section-body"><p class="hood-intro">Loading day trip picks for ${c.city}&hellip;</p></div>
    </section>

    <section style="padding-top:0" id="events-section">
      ${plate("07","Happenings")}
      <div class="cal-head-row">
        <h2 class="sec-head" style="margin:0">Events in <em>${c.city}</em></h2>
        <button type="button" class="cal-submit-btn" id="evt-submit-open">+ Submit an event</button>
      </div>
      <p class="hood-intro">What's happening in ${c.city}. Days with events are highlighted — tap one to see the details. Know about something going on? Submit it and we'll review it for the calendar.</p>
      <div class="events-row">
      <div class="events-side">
      <aside class="roamers-card" id="roamers-card">
        <h3 class="rm-head">Roamers in town</h3>
        <p class="rm-sub">Travelers who've shared plans to roam ${c.city} — say hi before you go.</p>
        <div id="rm-body"><p class="rm-note">Loading&hellip;</p></div>
      </aside>
      <aside class="rc-card" id="rc-card" data-city="${c.city}">
        <h3 class="rc-head">Roamer's Connections</h3>
        <p class="rc-sub">Loading the ${c.city} notice board&hellip;</p>
      </aside>
      </div>
      <div class="cal-wrap">
        <div class="cal-toolbar">
          <button type="button" class="cal-nav-btn" id="cal-prev" aria-label="Previous month">&#8592;</button>
          <div class="cal-month" id="cal-month">&mdash;</div>
          <button type="button" class="cal-nav-btn" id="cal-next" aria-label="Next month">&#8594;</button>
        </div>
        <div class="cal-grid" id="cal-dow"></div>
        <div class="cal-grid" id="cal-days"></div>
        <div class="cal-status" id="cal-status">Loading events&hellip;</div>
      </div>
      </div>
    </section>

    <section style="padding-top:0">
      ${plate("08","Insights")}
      <h2 class="sec-head">Real experiences in <em>${c.city}</em></h2>
      <p class="hood-intro">Two sides of the same city: what it's like to visit, and what it's like to live there.</p>
      <div class="insights-cols">
        <div class="insights-col is-traveler">
          <h3 class="rm-head">Traveler's Take</h3>
          <p>Firsthand stories from travelers who've visited ${c.city}.</p>
          <div class="ins-list" data-ins-type="traveler"></div>
          <button type="button" class="cal-submit-btn insights-open-btn" data-insight-type="traveler">Share Your Experience</button>
        </div>
        <div class="insights-col is-local">
          <h3 class="rm-head">Local's Perspective</h3>
          <p>Insight from people who live in ${c.city}, in their own words.</p>
          <div class="ins-list" data-ins-type="local"></div>
          <button type="button" class="cal-submit-btn insights-open-btn" data-insight-type="local">Share Your Insight</button>
        </div>
      </div>
    </section>

    <section style="padding-top:0">
      <!-- Plate 09 (Dispatches) hidden 2026-10-02 (Jeff) until the first blog post exists,
           so no guide shows an empty "coming soon" section. To bring it back, restore:
           plate("09","Dispatches") + <h2 class="sec-head">Stories from <em>city</em></h2> -->
      <div class="dispatches-empty">
        <p style="margin-top:34px"><a class="back" href="${backHref}">${backLabel}</a></p>
      </div>
    </section>`;

  /* ---------- Plate section show/hide ----------
     Each "Plate NN" divider can collapse the content that follows it,
     up to the next divider (or the end of its <section>). The compass
     icon spins 180° counter-clockwise on hide and back clockwise on
     show — done with a single CSS class toggle so the transition
     always runs the same direction it came from. */
  document.querySelectorAll(".plate[data-plate-id]").forEach(function(plateEl){
    var toggle = plateEl.querySelector(".plate-toggle");
    var cx = plateEl.querySelector(".cx");
    if (!toggle || !cx) return;
    var body = document.createElement("div");
    body.className = "plate-body";
    var node = plateEl.nextSibling;
    var toMove = [];
    while (node){
      var next = node.nextSibling;
      if (node.nodeType === 1 && node.classList && node.classList.contains("plate")) break;
      toMove.push(node);
      node = next;
    }
    toMove.forEach(function(n){ body.appendChild(n); });
    plateEl.parentNode.insertBefore(body, plateEl.nextSibling);

    toggle.addEventListener("click", function(){
      var hidden = cx.classList.toggle("cx-hidden");
      body.style.display = hidden ? "none" : "";
      toggle.textContent = hidden ? "Show" : "Hide";
      toggle.setAttribute("aria-expanded", String(!hidden));
    });
  });

  /* ---------- Roamers in town (left of the events calendar) ----------
     Shows travelers who shared a public trip that includes this city
     (public trip + public profile, both opt-in — see roamers-setup.sql).
     Signed-in members see who + dates + a Message button; signed-out
     visitors just see the head-count and a sign-in prompt.          */
  (function initCityRoamers(){
    const CITY = c.city;
    const body = document.getElementById("rm-body");
    if (!body) return;
    const escR = s => String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
    const MO_R = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    function fdateR(s){
      const p = String(s||"").split("-");
      if (p.length !== 3) return s || "";
      return MO_R[(+p[1]) - 1] + " " + (+p[2]);
    }
    function frangeR(a, d){
      if (a && d){
        const pa = a.split("-"), pd = d.split("-");
        if (pa[0] === pd[0] && pa[1] === pd[1]) return fdateR(a) + " – " + (+pd[2]);   // Oct 3 – 8
        return fdateR(a) + " – " + fdateR(d);                                          // Oct 28 – Nov 2
      }
      if (a) return "from " + fdateR(a);
      return "";
    }
    function initialsR(name){
      const parts = String(name||"").trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return "R";
      return (parts[0][0] + (parts.length > 1 ? parts[parts.length-1][0] : "")).toUpperCase();
    }
    function avatarR(p){
      return p.avatar_url
        ? `<span class="rm-av" style="background-image:url('${escR(p.avatar_url)}')" aria-hidden="true"></span>`
        : `<span class="rm-av" aria-hidden="true">${escR(initialsR(p.display_name))}</span>`;
    }
    function noteR(html){ body.innerHTML = `<p class="rm-note">${html}</p>`; }
    function signinBtnR(){
      const b = document.getElementById("rm-signin");
      if (b) b.addEventListener("click", () => { if (window.NRA_AUTH && NRA_AUTH.openModal) NRA_AUTH.openModal(); });
    }

    /* wait for auth.js (loaded at the bottom of the page), same pattern
       as the events calendar below */
    function getClientR(){
      return new Promise(resolve => {
        let tries = 0;
        (function poll(){
          if (window.NRA_AUTH && window.NRA_AUTH.enabled){
            Promise.resolve(window.NRA_AUTH.ready && window.NRA_AUTH.ready())
              .then(() => resolve(window.NRA_AUTH.client ? window.NRA_AUTH.client() : null))
              .catch(() => resolve(null));
            return;
          }
          if (tries++ > 100){ resolve(null); return; }   // ~10s then give up
          setTimeout(poll, 100);
        })();
      });
    }

    let subscribed = false;
    async function paintRoamers(){
      const sb = await getClientR();
      const card = document.getElementById("roamers-card");
      if (!sb){ if (card) card.style.display = "none"; return; }   // accounts unavailable — hide quietly
      if (!subscribed && window.NRA_AUTH && NRA_AUTH.onChange){
        subscribed = true;
        NRA_AUTH.onChange(() => paintRoamers());   // repaint on sign-in / sign-out
      }
      const user = (window.NRA_AUTH && NRA_AUTH.user && NRA_AUTH.user()) || null;

      if (!user){
        let n = 0;
        try{
          const { data, error } = await sb.rpc("city_roamers_count", { city_name: CITY });
          if (!error && typeof data === "number") n = data;
        }catch(e){ /* count stays 0 */ }
        if (n > 0){
          noteR(`<b>${n}</b> Roamer${n === 1 ? "" : "s"} will be in town soon. Sign in to see who — and say hi.<br><button type="button" class="rm-cta" id="rm-signin">Sign in to see who</button>`);
        } else {
          noteR(`No Roamers have shared plans for ${escR(CITY)} yet. Sign in, add ${escR(CITY)} to a trip and make the trip viewable to the public.<br><button type="button" class="rm-cta" id="rm-signin">Sign in</button>`);
        }
        signinBtnR();
        return;
      }

      let rows = null;
      try{
        const { data, error } = await sb.rpc("city_roamers", { city_name: CITY });
        if (error) throw error;
        rows = data || [];
      }catch(e){
        noteR(`Couldn't load who's in town right now — please try again later.`);
        return;
      }
      if (!rows.length){
        noteR(`No Roamers have shared plans for ${escR(CITY)} yet. <a href="itinerary.html?type=upcoming" style="color:var(--green);font-weight:700">Add ${escR(CITY)} to a trip</a> and make the trip viewable to the public.`);
        return;
      }
      body.innerHTML = rows.map(p => {
        const me = p.roamer_id === user.id;
        const name = `<a href="roamer.html?id=${encodeURIComponent(p.roamer_id)}">${escR(p.display_name)}</a>` + (me ? `<span class="rm-you">You</span>` : "");
        const msg = (!me && p.allow_messages !== false)
          ? `<a class="rm-msg" href="messages.html?to=${encodeURIComponent(p.roamer_id)}">Message</a>` : "";
        return `<div class="rm-row">${avatarR(p)}<span class="rm-info"><span class="rm-name">${name}</span><span class="rm-dates" style="display:block">${escR(frangeR(p.arrive, p.depart))}</span></span>${msg}</div>`;
      }).join("");
    }
    paintRoamers();
  })();

  /* ---------- Events calendar (below Day trips) ---------- */
  (function initCityEvents(){
    const CITY = c.city;
    const monthEl  = document.getElementById("cal-month");
    const dowEl    = document.getElementById("cal-dow");
    const daysEl   = document.getElementById("cal-days");
    const statusEl = document.getElementById("cal-status");
    const prevBtn  = document.getElementById("cal-prev");
    const nextBtn  = document.getElementById("cal-next");
    const openBtn  = document.getElementById("evt-submit-open");
    if (!daysEl) return;

    const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
    const pad = n => (n < 10 ? "0" + n : "" + n);
    const ymd = d => d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate());
    function fmtTime(t){
      if (!t) return "";
      const m = String(t).match(/^(\d{1,2}):(\d{2})/);
      if (!m) return String(t);
      let h = parseInt(m[1],10); const ap = h >= 12 ? "PM" : "AM";
      h = h % 12; if (h === 0) h = 12;
      return h + ":" + m[2] + " " + ap;
    }

    const today = new Date();
    let viewYear = today.getFullYear(), viewMonth = today.getMonth();
    let byDate = {};

    /* Wait for auth.js (loaded at the bottom of the page) to be ready,
       then hand back the shared Supabase client — or null if unavailable. */
    function getClient(){
      return new Promise(resolve => {
        let tries = 0;
        (function poll(){
          if (window.NRA_AUTH && window.NRA_AUTH.enabled){
            Promise.resolve(window.NRA_AUTH.ready && window.NRA_AUTH.ready())
              .then(() => resolve(window.NRA_AUTH.client ? window.NRA_AUTH.client() : null))
              .catch(() => resolve(null));
            return;
          }
          if (tries++ > 100){ resolve(null); return; }   // ~10s then give up
          setTimeout(poll, 100);
        })();
      });
    }

    const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    dowEl.innerHTML = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
      .map(d => `<div class="cal-dow">${d}</div>`).join("");

    // little "events this way" dots on the prev/next arrows
    const prevDot = document.createElement("span"); prevDot.className = "cal-arrow-dot";
    const nextDot = document.createElement("span"); nextDot.className = "cal-arrow-dot";
    prevBtn.appendChild(prevDot); nextBtn.appendChild(nextDot);
    let eventMonths = []; // sorted unique "YYYY-MM" strings that have upcoming events

    function renderCalendar(){
      const first = new Date(viewYear, viewMonth, 1);
      monthEl.innerHTML = `<span class="cal-mon">${MONTHS_EN[viewMonth]}</span> ${viewYear}`;
      const startDow = first.getDay();
      const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
      const todayStr = ymd(new Date());
      const cells = [];
      for (let i = 0; i < startDow; i++) cells.push('<div class="cal-cell empty"></div>');
      for (let d = 1; d <= daysInMonth; d++){
        const ds = viewYear + "-" + pad(viewMonth+1) + "-" + pad(d);
        const evs = byDate[ds] || [];
        const has = evs.length > 0;
        const isToday = ds === todayStr;
        const isPast = ds < todayStr;
        cells.push(
          `<button type="button" class="cal-cell${has?" has-events":""}${isToday?" today":""}${has && isPast?" cal-past":""}"` +
          (has ? ` data-date="${ds}"` : " disabled") + `>` +
            `<span class="cal-num">${d}</span>` +
            (has ? `<span class="cal-dot">${evs.length}</span>` : "") +
          `</button>`
        );
      }
      daysEl.innerHTML = cells.join("");
      // arrow hints: are there event-months before / after the month in view?
      const viewKey = viewYear + "-" + pad(viewMonth+1);
      prevBtn.classList.toggle("has-more", eventMonths.some(m => m < viewKey));
      nextBtn.classList.toggle("has-more", eventMonths.some(m => m > viewKey));
      if (window.NRA_i18n) { try { window.NRA_i18n.apply(); } catch(e){} }
    }

    async function loadEvents(){
      const sb = await getClient();
      if (!sb){ statusEl.textContent = "Event listings aren't available right now."; renderCalendar(); return; }
      try{
        const { data, error } = await sb.from("city_events_public")
          .select("*").eq("city", CITY).order("event_date", { ascending:true });
        if (error) throw error;
        const todayStr = ymd(new Date());
        byDate = {};
        let upcoming = 0;
        (data || []).forEach(ev => {
          /* Past events stay on the calendar (clickable, muted) instead of
             dropping off entirely, since only a past event carries a vote
             widget — voting on whether it was worth attending only makes
             sense after the fact. "Upcoming" below still counts future-only,
             for the "no events yet" message. */
          ev.isPast = ev.event_date < todayStr;
          (byDate[ev.event_date] = byDate[ev.event_date] || []).push(ev);
          if (!ev.isPast) upcoming++;
        });
        eventMonths = Array.from(new Set(Object.keys(byDate).map(d => d.slice(0,7)))).sort();
        statusEl.textContent = upcoming ? "" : "No upcoming events listed yet — be the first to submit one!";
      }catch(e){
        statusEl.textContent = "Couldn't load events (has city-events-private.sql been run in Supabase?).";
      }
      renderCalendar();
    }

    prevBtn.onclick = () => { if (--viewMonth < 0){ viewMonth = 11; viewYear--; } renderCalendar(); };
    nextBtn.onclick = () => { if (++viewMonth > 11){ viewMonth = 0; viewYear++; } renderCalendar(); };

    /* ----- shared modal shell ----- */
    function makeOverlay(){
      const ov = document.createElement("div");
      ov.className = "evt-overlay";
      ov.addEventListener("click", e => { if (e.target === ov) close(ov); });
      document.body.appendChild(ov);
      return ov;
    }
    function open(ov){ ov.classList.add("open"); document.addEventListener("keydown", escClose); }
    function close(ov){ ov.classList.remove("open"); document.removeEventListener("keydown", escClose); }
    function escClose(e){ if (e.key === "Escape"){ dayOv.classList.remove("open"); subOv.classList.remove("open"); document.removeEventListener("keydown", escClose); } }

    /* ----- day-events modal ----- */
    const dayOv = makeOverlay();
    function eventItemHTML(ev){
      const time = ev.start_time ? fmtTime(ev.start_time) + (ev.end_time ? " – " + fmtTime(ev.end_time) : "") : "";
      let loc = "";
      if (ev.location){
        loc = ev.map_link
          ? `<a href="${esc(ev.map_link)}" target="_blank" rel="noopener">${esc(ev.location)} &#8599;</a>`
          : esc(ev.location);
      }
      let contact = "";
      if (ev.allow_contact && ev.contact_value){
        const v = esc(ev.contact_value);
        if (ev.contact_type === "phone")       contact = `<a href="tel:${esc(ev.contact_value.replace(/[^0-9+]/g,""))}">${v}</a>`;
        else if (ev.contact_type === "social") contact = `<a href="${v}" target="_blank" rel="noopener">${v} &#8599;</a>`;
        else                                   contact = `<a href="mailto:${v}">${v}</a>`;
      }
      /* Votes only apply to a past event — whether it was worth attending
         is only knowable after the fact. */
      const vote = ev.isPast ? voteWidgetHTML({type:"event", id:ev.id, city:CITY, extraClass:"fl-vote"}) : "";
      return `<div class="evt-item">` +
        (ev.poster_url ? `<a class="evt-poster" href="${esc(ev.poster_url)}" target="_blank" rel="noopener"><img src="${esc(ev.poster_url)}" alt="Poster for ${esc(ev.name)}" loading="lazy"></a>` : "") +
        `<div class="evt-body">` +
          `<h4 class="evt-name">${esc(ev.name)}</h4>` +
          (time ? `<div class="evt-meta">&#128336; ${esc(time)}</div>` : "") +
          (loc  ? `<div class="evt-meta">&#128205; ${loc}</div>` : "") +
          (contact ? `<div class="evt-meta">&#128172; <span>Questions:</span> ${contact}</div>` : "") +
          (ev.link ? `<a class="evt-link-btn" href="${esc(ev.link)}" target="_blank" rel="noopener">Event details &#8599;</a>` : "") +
          vote +
        `</div></div>`;
    }
    const LANG = () => (window.NRA_i18n && window.NRA_i18n.lang && window.NRA_i18n.lang()) || "en";
    function openDayModal(ds){
      const evs = byDate[ds] || [];
      let dateLabel;
      try { dateLabel = new Date(ds + "T00:00:00").toLocaleDateString(LANG(), { weekday:"long", month:"long", day:"numeric", year:"numeric" }); }
      catch(e){ dateLabel = new Date(ds + "T00:00:00").toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric", year:"numeric" }); }
      dayOv.innerHTML =
        `<div class="evt-modal" role="dialog" aria-modal="true">` +
          `<button type="button" class="evt-close" aria-label="Close">&times;</button>` +
          `<h3>${esc(dateLabel)}</h3>` +
          `<p class="evt-modal-sub">${evs.length} event${evs.length===1?"":"s"} in ${esc(CITY)}</p>` +
          evs.map(eventItemHTML).join("") +
        `</div>`;
      dayOv.querySelector(".evt-close").onclick = () => close(dayOv);
      if (window.NRA_i18n) { try { window.NRA_i18n.apply(); } catch(e){} }
      if (window.NRA_VOTES) NRA_VOTES.mountAll(dayOv);
      open(dayOv);
    }
    daysEl.addEventListener("click", e => {
      const cell = e.target.closest(".cal-cell[data-date]");
      if (cell) openDayModal(cell.dataset.date);
    });

    /* ----- submit-an-event modal ----- */
    const subOv = makeOverlay();
    subOv.innerHTML =
      `<div class="evt-modal" role="dialog" aria-modal="true">` +
        `<button type="button" class="evt-close" aria-label="Close">&times;</button>` +
        `<h3>Submit an event</h3>` +
        `<p class="evt-modal-sub">In ${esc(CITY)}. All fields are required. We'll review it before it appears on the calendar.</p>` +
        `<form class="evt-form" id="evt-form">` +
          `<div class="evt-hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>` +
          `<label>Event name *<input type="text" name="name" maxlength="140" required></label>` +
          `<label>Location *<input type="text" name="location" maxlength="200" placeholder="Venue or address" required></label>` +
          `<label>Map link *<input type="url" name="mapLink" placeholder="https://maps.google.com/…" required><span class="evt-hint">A Google Maps (or any) link to the location.</span></label>` +
          `<label>Date *<input type="date" name="date" required></label>` +
          `<div class="evt-row">` +
            `<div><label>Start time *<input type="time" name="startTime" required></label></div>` +
            `<div><label>End time<input type="time" name="endTime"></label></div>` +
          `</div>` +
          `<label>Event link<input type="url" name="link" placeholder="https://…"><span class="evt-hint">Optional — tickets or an info page.</span></label>` +
          `<label>Event poster<input type="file" name="poster" accept="image/*"><span class="evt-hint">Optional image, up to 8&nbsp;MB.</span></label>` +
          `<label>Event question contact<span class="evt-hint">Optional — a way for attendees to ask about the event.</span></label>` +
          `<div class="evt-row">` +
            `<div><select name="contactType" aria-label="Contact type">` +
              `<option value="email">Email address</option>` +
              `<option value="phone">Phone number</option>` +
              `<option value="social">Social media link</option>` +
            `</select></div>` +
            `<div><input type="text" name="contactValue" maxlength="200" placeholder="e.g. events@venue.com"></div>` +
          `</div>` +
          `<label class="evt-check"><input type="checkbox" name="allowContact"> Allow attendees to contact the organizer with questions</label>` +
          `<div class="evt-row">` +
            `<div><label>Organizer name *<input type="text" name="submitterName" maxlength="60" required></label></div>` +
            `<div><label>Your email *<input type="email" name="submitterEmail" maxlength="120" required><span class="evt-hint">Permission for editor to contact you regarding any followup clarification questions.</span></label></div>` +
          `</div>` +
          `<div class="evt-actions">` +
            `<button type="submit" class="evt-send">Send for review</button>` +
            `<span class="evt-msg" id="evt-msg"></span>` +
          `</div>` +
        `</form>` +
        `<div id="evt-thanks" hidden style="text-align:center;padding:16px 6px 8px">` +
          `<div style="font-size:2.2rem;line-height:1" aria-hidden="true">&#127881;</div>` +
          `<p style="font-family:'Fraunces',Georgia,serif;font-size:1.35rem;color:var(--green);margin:10px 0 6px">Thank you</p>` +
          `<p style="color:var(--muted);margin:0 auto;max-width:360px">Your event has been submitted for review. You'll be notified by email when it's added to the calendar.</p>` +
        `</div>` +
      `</div>`;
    subOv.querySelector(".evt-close").onclick = () => close(subOv);
    const subEl  = subOv.querySelector(".evt-modal-sub");
    const thanks = subOv.querySelector("#evt-thanks");
    let openedAt = 0; // when the form was last opened — feeds the too-fast-submit guard
    function resetSubmitForm(){
      form.hidden = false; if (subEl) subEl.hidden = false; if (thanks) thanks.hidden = true;
      msg.className = "evt-msg"; msg.textContent = "";
      form.reset();
      if (fp_evtdate) fp_evtdate.clear();
      const b = form.querySelector(".evt-send"); if (b) b.disabled = false;
      openedAt = Date.now();
    }
    function showThanks(){
      form.hidden = true; if (subEl) subEl.hidden = true; if (thanks) thanks.hidden = false;
    }
    if (openBtn) openBtn.onclick = () => { resetSubmitForm(); open(subOv); const n = subOv.querySelector('[name="name"]'); if (n) setTimeout(()=>n.focus(), 30); };

    async function uploadPoster(file){
      const sb = await getClient();
      if (!sb) return "";
      const clean = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-48);
      const path = "evt-" + Date.now() + "-" + Math.random().toString(36).slice(2,8) + "-" + clean;
      const { error } = await sb.storage.from("event-images").upload(path, file, { cacheControl:"31536000", upsert:false });
      if (error) throw error;
      const { data } = sb.storage.from("event-images").getPublicUrl(path);
      return data.publicUrl;
    }

    const form = subOv.querySelector("#evt-form");
    const msg  = subOv.querySelector("#evt-msg");
    /* calendar date picker for the event date field (replaces the tiny native one, esp. on Safari) */
    const fp_evtdate = window.flatpickr
      ? flatpickr(form.querySelector('[name="date"]'), { dateFormat: "Y-m-d", altInput: true, altFormat: "F j, Y", minDate: "today" })
      : null;
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const get = k => String(fd.get(k) || "").trim();
      // honeypot: real people never fill the hidden "website" field
      if (get("website")){ showThanks(); return; }
      const name = get("name"), date = get("date");
      const file = form.poster.files && form.poster.files[0];
      // required fields (the browser enforces this too; this is a backup)
      if (!name || !get("location") || !get("mapLink") || !date || !get("startTime") ||
          !get("submitterName") || !get("submitterEmail")){
        msg.className = "evt-msg err"; msg.textContent = "Please fill in every required field (marked *)."; return;
      }
      if (file && file.size > 8*1024*1024){ msg.className = "evt-msg err"; msg.textContent = "That poster is over 8 MB — please use a smaller image."; return; }
      // contact must match its chosen type, if provided
      const cType = get("contactType"), cVal = get("contactValue");
      if (cVal){
        const bad =
          (cType === "email"  && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cVal)) ? "Please enter a valid contact email address (name@example.com)." :
          (cType === "phone"  && (cVal.replace(/[^0-9]/g,"").length < 6)) ? "Please enter a valid contact phone number." :
          (cType === "social" && !/^https?:\/\/.+/i.test(cVal)) ? "The social contact should be a full link starting with http:// or https://." : "";
        if (bad){ msg.className = "evt-msg err"; msg.textContent = bad; return; }
      }

      const btn = form.querySelector(".evt-send");
      btn.disabled = true; msg.className = "evt-msg"; msg.textContent = "Sending…";
      try{
        let posterUrl = "";
        if (file){
          try { posterUrl = await uploadPoster(file); }
          catch (upErr){ posterUrl = ""; /* still send the details without the image */ }
        }
        const r = await fetch("/.netlify/functions/submit-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: await nraAccessToken(),
            city: CITY, name, location: get("location"), mapLink: get("mapLink"),
            date, startTime: get("startTime"), endTime: get("endTime"),
            link: get("link"), posterUrl,
            contactType: get("contactType"), contactValue: get("contactValue"),
            allowContact: !!(form.allowContact && form.allowContact.checked),
            submitterName: get("submitterName"), submitterEmail: get("submitterEmail"),
            website: get("website"), elapsedMs: Date.now() - openedAt
          })
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.sent) throw new Error(d.error || "Something went wrong.");
        showThanks();
      }catch(err){
        msg.className = "evt-msg err";
        msg.textContent = "Couldn't send: " + (err.message || "please try again.");
      }finally{
        btn.disabled = false;
      }
    });

    loadEvents();
  })();

  /* ---------- Insights: contribute-your-experience modal ----------
     Two buttons (Traveler's Take / Local's Perspective) open the same modal
     shell, tagged with which side it's for. A type with questions in
     QUESTIONS below renders them as an interview; a type without them falls
     back to a single free-text box until its questions are written. Either
     way the answers are emailed in for review. */
  (function initInsights(){
    const openBtns = document.querySelectorAll(".insights-open-btn");
    if (!openBtns.length) return;

    const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
    const LABEL = { traveler: "Traveler's Take", local: "Local's Perspective" };
    /* Interview questions, in order. `hint` shows as small print under the
       question. Each list ends with its own catch-all question. */
    const QUESTIONS = {
      traveler: [
        { q: "What did the guidebooks/Instagram get wrong about this city?" },
        { q: "What's one thing that was even better than the hype?" },
        { q: "What disappointed you, and would it stop you from recommending the city?" },
        { q: "Describe the city in three words now that you've been." },
        { q: "What's the moment from your trip you still think about?" },
        { q: "Did you feel welcome?", hint: "How were the locals with travelers? How easy was it to meet people (locals or other travelers)?" },
        { q: "What do you wish you'd known before arriving?" },
        { q: "What did you overpack or overplan — and what did you wish you'd brought or booked?" },
        { q: "Where did you stay, and would you pick that neighborhood again?" },
        { q: "How safe did you feel, including at night or as a solo traveler?" },
        { q: "Best thing you ate — and where?" },
        { q: "One place, activity, or experience you'd tell every visitor not to skip?" },
        { q: "What's popular that you'd honestly tell people to skip?" },
        { q: "Would you go back? What would you do differently the second time?" },
        { q: "What's the one tip you'd give someone landing there tomorrow?" },
        { q: "Anything else you would like to share?" }
      ],
      local: [
        { q: "Describe your city's personality in three words." },
        { q: "What is your favorite thing about living in this city?" },
        { q: "What's something about daily life here that surprises visitors?", hint: "Rhythm, customs, quirks." },
        { q: "What's a local phrase, habit, or unwritten rule a visitor should know?", hint: "Tipping, greetings, queueing." },
        { q: "One neighborhood beyond the tourist center worth wandering — and why?" },
        { q: "A local artist, shop, market, or event you'd tell a first-time visitor not to miss?" },
        { q: "What do locals complain about most — why?" },
        { q: "What would you tell a tourist is the best way to blend in?" },
        { q: "What dish or drink can you only get right here — and where's it done best?" },
        { q: "What's the late-night food ritual after a night out?" },
        { q: "What's overrated on every “must eat” list — and what should replace it?" },
        { q: "When is the worst time to visit — and when's the best time?" },
        { q: "What's a free thing to do here that beats most paid attractions?" },
        { q: "Which famous sight is worth the crowds, and which one can visitors skip?" },
        { q: "Anything else you would like to mention?" }
      ]
    };
    /* Required "about you" fields shown above the questions (Jeff, 2026-10-19).
       {city} is filled in at render. Answers are saved at the front of
       `answers` with their key `k`, shown as a byline on the published card,
       and not counted as questions. */
    const ABOUT_FIELDS = {
      local: [
        { k: "years", q: "How many years have you lived in {city}?" },
        { k: "from",  q: "Where are you originally from?" }
      ]
    };
    const aboutQ = (f, city) => f.q.replace("{city}", city);
    /* Fills the "N questions about …" line at the top of each interview. */
    const ABOUT = { traveler: "questions about your trip", local: "questions about life where you live" };
    const pad2 = n => (n < 10 ? "0" + n : "" + n);
    const authUser = () => (window.NRA_AUTH && NRA_AUTH.user && NRA_AUTH.user()) || null;

    const ov = document.createElement("div");
    ov.className = "evt-overlay";
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    document.body.appendChild(ov);
    function open(){ ov.classList.add("open"); document.addEventListener("keydown", escClose); }
    function close(){ ov.classList.remove("open"); document.removeEventListener("keydown", escClose); }
    function escClose(e){ if (e.key === "Escape") close(); }

    /* Who's submitting. Signed in: their profile name and email are used and
       the fields are hidden. Signed out: they get a sign-in button plus the
       name/email fields. Repainted on its own so answers already typed into
       the questions survive a sign-in. */
    function identityHTML(){
      const user = authUser();
      if (user){
        const who = (window.NRA_AUTH.displayName && NRA_AUTH.displayName()) || user.email || "";
        return `<div class="insights-auth is-in">` +
          `<p class="insights-auth-who">Submitting as <strong>${esc(who)}</strong></p>` +
          `<p class="evt-hint">This is the name shown on your interview if it's published — change it in your profile.</p>` +
        `</div>`;
      }
      return `<div class="insights-auth">` +
          `<p class="insights-auth-note">Sign in so your interview is credited to your Roamer profile — or just fill in your details below.</p>` +
          `<button type="button" class="cal-submit-btn" id="insights-signin">Sign in / Sign up</button>` +
        `</div>` +
        `<label>Your name *<input type="text" name="name" maxlength="80" required>` +
          `<span class="evt-hint">This is the name shown on your interview if it's published.</span></label>` +
        `<label>Your email *<input type="email" name="email" maxlength="120" required><span class="evt-hint">Permission for editor to contact you regarding any followup clarification questions.</span></label>`;
    }
    function paintIdentity(){
      const slot = ov.querySelector("#insights-identity");
      if (!slot) return;
      slot.innerHTML = identityHTML();
      const btn = slot.querySelector("#insights-signin");
      if (btn) btn.onclick = () => { if (window.NRA_AUTH && NRA_AUTH.openModal) NRA_AUTH.openModal(); };
    }

    let openedAt = 0;
    function render(type){
      const label = LABEL[type] || LABEL.traveler;
      const qs = QUESTIONS[type] || [];
      const intro = qs.length
        ? `In ${esc(c.city)}. ${qs.length} ${ABOUT[type] || "questions"} — answer as many as you like and skip anything that doesn't apply. We review every submission before anything is posted to the guide.`
        : `In ${esc(c.city)}. Interview questions are coming soon — for now, tell us a bit about yourself and we'll be in touch. We review every submission before anything is posted to the guide.`;
      const body = qs.length
        ? `<div class="insights-qs">` +
            qs.map((item, i) =>
              `<label class="evt-q" for="insights-q${i}"><span class="evt-qn">${pad2(i+1)}</span>${esc(item.q)}` +
                (item.hint ? `<span class="evt-hint">${esc(item.hint)}</span>` : "") +
              `</label>` +
              `<textarea id="insights-q${i}" name="q${i}" rows="3" maxlength="1200"></textarea>`
            ).join("") +
            `<p class="insights-qs-note">Answer at least one question to submit.</p>` +
          `</div>`
        : `<label>Tell us about your experience *<textarea name="response" rows="6" maxlength="4000" placeholder="Share a bit about your ${type === "local" ? "life in" : "trip to"} ${esc(c.city)}&hellip;" required></textarea></label>`;
      ov.innerHTML =
        `<div class="evt-modal insights-modal" role="dialog" aria-modal="true">` +
          `<button type="button" class="evt-close" aria-label="Close">&times;</button>` +
          `<h3>${esc(label)}: contribute your experience</h3>` +
          `<p class="evt-modal-sub">${intro}</p>` +
          `<form class="evt-form" id="insights-form">` +
            `<div class="evt-hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>` +
            `<input type="hidden" name="type" value="${esc(type)}">` +
            `<div id="insights-identity"></div>` +
            (ABOUT_FIELDS[type] || []).map(f =>
              `<label>${esc(aboutQ(f, c.city))} *<input type="text" name="about_${f.k}" maxlength="80" required></label>`
            ).join("") +
            body +
            `<div class="evt-actions">` +
              `<button type="submit" class="evt-send">Submit for review</button>` +
              `<button type="button" class="evt-draft" id="insights-draft">Save draft</button>` +
              `<span class="evt-msg" id="insights-msg"></span>` +
            `</div>` +
          `</form>` +
          `<div id="insights-thanks" hidden style="text-align:center;padding:16px 6px 8px">` +
            `<div style="font-size:2.2rem;line-height:1" aria-hidden="true">&#127881;</div>` +
            `<p style="font-family:'Fraunces',Georgia,serif;font-size:1.35rem;color:var(--green);margin:10px 0 6px">Thank you</p>` +
            `<p style="color:var(--muted);margin:0 auto;max-width:360px">Your interview has been successfully submitted. You will be notified if/when your interview has been posted to the city guide. Thank you for your contribution</p>` +
          `</div>` +
        `</div>`;
      ov.querySelector(".evt-close").onclick = close;
      paintIdentity();
      wireForm(type);
      restoreDraft(type);
      openedAt = Date.now();
    }

    /* Drafts (Jeff, 2026-10-19: closing the form lost everything typed).
       Kept in this browser only, one per city and interview type. Saved by
       the Save draft button and on every keystroke, put back when the form
       opens again, cleared once the interview is sent. */
    const draftKey = type => "nra_interview_draft:" + c.city + ":" + type;
    const draftFields = () => [...ov.querySelectorAll("#insights-form input[name], #insights-form textarea[name]")]
      .filter(el => el.type !== "hidden" && el.name !== "website");
    function saveDraft(type){
      const data = {};
      draftFields().forEach(el => { if (el.value.trim()) data[el.name] = el.value; });
      try{
        if (Object.keys(data).length) localStorage.setItem(draftKey(type), JSON.stringify(data));
        else localStorage.removeItem(draftKey(type));
        return true;
      }catch(e){ return false; }
    }
    function restoreDraft(type){
      let data = null;
      try{ data = JSON.parse(localStorage.getItem(draftKey(type)) || "null"); }catch(e){}
      if (!data) return;
      draftFields().forEach(el => { if (data[el.name] != null && !el.value) el.value = data[el.name]; });
      const msg = ov.querySelector("#insights-msg");
      if (msg){ msg.className = "evt-msg"; msg.textContent = "Your saved draft is back."; }
    }
    function clearDraft(type){ try{ localStorage.removeItem(draftKey(type)); }catch(e){} }

    function wireForm(type){
      const qs = QUESTIONS[type] || [];
      const form = ov.querySelector("#insights-form");
      const msg = ov.querySelector("#insights-msg");
      const thanks = ov.querySelector("#insights-thanks");
      let draftTimer = 0;
      form.addEventListener("input", () => { clearTimeout(draftTimer); draftTimer = setTimeout(() => saveDraft(type), 400); });
      ov.querySelector("#insights-draft").onclick = () => {
        clearTimeout(draftTimer);
        const ok = saveDraft(type);
        msg.className = ok ? "evt-msg" : "evt-msg err";
        msg.textContent = ok ? "Draft saved. It will be here when you come back on this device." : "Couldn't save a draft in this browser.";
      };
      form.addEventListener("submit", async e => {
        e.preventDefault();
        const fd = new FormData(form);
        const get = k => String(fd.get(k) || "").trim();
        // honeypot: real people never fill the hidden "website" field
        if (get("website")){ form.hidden = true; thanks.hidden = false; return; }
        // Signed in: the profile name and email stand in for the hidden fields.
        const user = authUser();
        const name  = user ? ((window.NRA_AUTH.displayName && NRA_AUTH.displayName()) || user.email || "") : get("name");
        const email = user ? (user.email || "") : get("email");
        const response = get("response");
        // interview answers, keeping only the questions they actually answered
        const about = (ABOUT_FIELDS[type] || []).map(f => ({ k: f.k, q: aboutQ(f, c.city), a: get("about_" + f.k) }));
        if (about.some(x => !x.a)){
          msg.className = "evt-msg err";
          msg.textContent = "Please fill in every required field (marked *).";
          return;
        }
        const qAnswers = qs.map((item, i) => ({ q: item.q, a: get("q" + i) })).filter(x => x.a);
        const answers = about.concat(qAnswers);
        if (!name || !email || (qs.length ? !qAnswers.length : !response)){
          msg.className = "evt-msg err";
          msg.textContent = qs.length
            ? (user ? "Please answer at least one question." : "Please add your name, your email, and an answer to at least one question.")
            : "Please fill in every required field (marked *).";
          return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
          msg.className = "evt-msg err"; msg.textContent = "Please enter a valid email address."; return;
        }
        const btn = form.querySelector(".evt-send");
        btn.disabled = true; msg.className = "evt-msg"; msg.textContent = "Sending…";
        try{
          const r = await fetch("/.netlify/functions/submit-interview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: await nraAccessToken(),
              city: c.city, type: get("type"), name, email, response, answers,
              website: get("website"), elapsedMs: Date.now() - openedAt
            })
          });
          const d = await r.json().catch(() => ({}));
          if (!r.ok || !d.sent) throw new Error(d.error || "Something went wrong.");
          clearTimeout(draftTimer); clearDraft(type);
          form.hidden = true; thanks.hidden = false;
        }catch(err){
          msg.className = "evt-msg err";
          msg.textContent = "Couldn't send: " + (err.message || "please try again.");
        }finally{
          btn.disabled = false;
        }
      });
    }

    // Signing in from inside the modal swaps the name/email fields for the
    // profile line without disturbing answers already typed.
    if (window.NRA_AUTH && NRA_AUTH.onChange) NRA_AUTH.onChange(() => paintIdentity());

    openBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        render(btn.dataset.insightType === "local" ? "local" : "traveler");
        open();
        const first = ov.querySelector('[name="name"]') || ov.querySelector("textarea");
        if (first) setTimeout(() => first.focus(), 30);
      });
    });

    /* Deep link from the Community Contributions page: city.html?city=X#share-traveler (or
       #share-local) scrolls to Insights and opens that interview form (Jeff, 2026-10-02). */
    const shareHash = (location.hash.match(/^#share-(traveler|local)$/) || [])[1];
    if (shareHash) {
      const target = document.querySelector(`.insights-open-btn[data-insight-type="${shareHash}"]`);
      if (target) {
        target.scrollIntoView({ block: "center" });
        setTimeout(() => target.click(), 400);
      }
    }

    /* Approved interviews (city_insights_public: published rows only, no
       email). Each column shows its newest three as cards with the first two
       answers; "Show all" reveals the rest, and "Read the full interview"
       opens every answer in the modal. Nothing approved yet, or the table
       not set up: the column stays as it was. */
    const SHOW = 3;
    const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const when = r => { const d = new Date(r.published_at || r.created_at); return isNaN(d) ? "" : "Shared " + MONTHS[d.getMonth()] + " " + d.getFullYear(); };
    const qa = (list, n) => list.slice(0, n).map(x =>
      `<div class="ins-q">${esc(x.q)}</div><div class="ins-a">${esc(x.a)}</div>`).join("");
    const pairs = r => (Array.isArray(r.answers) && r.answers.some(x => !x.k)) ? r.answers.filter(x => !x.k)
      : (r.response ? [{ q: "In their words", a: r.response }] : []);
    /* Local's "about you" answers as a byline: "Lived here 12 years · Originally from Ohio". */
    const aboutLine = r => {
      const a = Array.isArray(r.answers) ? r.answers : [];
      const get = k => (a.find(x => x.k === k) || {}).a || "";
      const yrs = get("years"), from = get("from");
      const parts = [];
      if (yrs) parts.push("Lived here: " + yrs + (/^\d+(\.\d+)?$/.test(yrs) ? (yrs === "1" ? " year" : " years") : ""));
      if (from) parts.push("Originally from " + from);
      return parts.join(" · ");
    };
    let published = [];

    function card(r){
      const all = pairs(r);
      const vote = voteWidgetHTML({type:"insight", id:r.id, city:c.city, extraClass:"fl-vote"});
      /* like / dislike in the top right corner, beside the name (Jeff, 2026-10-21) */
      return `<article class="ins-card">` +
          `<div class="ins-head"><div class="ins-head-text"><div class="ins-who">${esc(r.name)}</div><div class="ins-when">${esc(when(r))}</div>` +
          (aboutLine(r) ? `<div class="ins-when">${esc(aboutLine(r))}</div>` : "") + `</div>${vote}</div>` +
          qa(all, 2) +
          (all.length > 2 ? `<button type="button" class="ins-link" data-ins-read="${esc(r.id)}">Read the full interview &rarr;</button>` : "") +
        `</article>`;
    }
    function paintList(type, showAll){
      const el = document.querySelector(`.ins-list[data-ins-type="${type}"]`);
      if (!el) return;
      const rows = published.filter(r => r.type === type);
      const shown = showAll ? rows : rows.slice(0, SHOW);
      el.innerHTML = shown.map(card).join("") +
        (rows.length > shown.length ? `<button type="button" class="ins-link ins-more" data-ins-all="${type}">Show all ${rows.length} &rarr;</button>` : "");
      if (window.NRA_VOTES) NRA_VOTES.mountAll(el);
    }
    function openRead(id){
      const r = published.find(x => x.id === id);
      if (!r) return;
      const all = pairs(r);
      ov.innerHTML =
        `<div class="evt-modal insights-modal" role="dialog" aria-modal="true">` +
          `<button type="button" class="evt-close" aria-label="Close">&times;</button>` +
          `<h3>${esc(LABEL[r.type] || LABEL.traveler)}: ${esc(r.name)}</h3>` +
          `<p class="evt-modal-sub">${esc(c.city)} &middot; ${esc(when(r))}${aboutLine(r) ? " &middot; " + esc(aboutLine(r)) : ""}</p>` +
          `<div class="ins-full">${qa(all, all.length)}</div>` +
        `</div>`;
      ov.querySelector(".evt-close").onclick = close;
      open();
    }
    document.addEventListener("click", e => {
      const read = e.target.closest("[data-ins-read]");
      if (read){ openRead(read.dataset.insRead); return; }
      const more = e.target.closest("[data-ins-all]");
      if (more) paintList(more.dataset.insAll, true);
    });

    (function loadPublished(){
      let tries = 0;
      (function poll(){
        if (window.NRA_AUTH && window.NRA_AUTH.enabled){
          Promise.resolve(window.NRA_AUTH.ready && window.NRA_AUTH.ready())
            .then(async () => {
              const sb = window.NRA_AUTH.client && window.NRA_AUTH.client();
              if (!sb) return;
              const { data, error } = await sb.from("city_insights_public")
                .select("*").eq("city", c.city).order("published_at", { ascending: false });
              if (error || !data) return;
              published = data;
              paintList("traveler"); paintList("local");
            })
            .catch(() => {});
          return;
        }
        if (tries++ < 100) setTimeout(poll, 100);   // ~10s then give up quietly
      })();
    })();
  })();

  /* ---------- Neighborhood hero images ----------
     Local verified Wikimedia photo first (hood-photos.js).

     A hood with no verified photo of its own gets NO keyword-searched
     stand-in. That used to run a live Unsplash lookup and, failing that, a
     random picsum image — and because the hoods still missing a photo are
     exactly the obscure ones, the lookup missed most of the time and the
     random image took over: Abuja's Central Business District was showing a
     Californian pier, La Paz's San Pedro an Arequipa church. Both rendered
     identically to the verified photos, so a reader couldn't tell which was
     real.

     Instead we fall back to this city's own verified photo (city-photos.js,
     which covers every city), tinted and captioned so it reads as a stand-in
     for the city rather than a picture of the neighborhood, and we promote
     that hood's "Contribute a photo" button so a reader who knows the place
     can send us the real thing. */
  (function loadHoodImages() {
    const localHoods = (window.NRA_HOOD_PHOTO || {})[c.city] || {};
    const cityPhoto = (window.NRA_CITY_PHOTO || {})[c.city];
    /* hood banners display ~1000px wide at most — use the 960px "-sm" copy.
       Contributed photos are absolute URLs with no such copy, so use them as-is. */
    const served = src => /^https?:/i.test(src) ? src : src.replace(/\.webp$/, "-sm.webp");
    const STANDIN_CROPS = ["50% 50%", "18% 45%", "82% 45%", "50% 18%", "50% 82%"];

    document.querySelectorAll('.hood-hero[data-hood]').forEach(el => {
      const name = el.dataset.hood;
      const local = localHoods[name];
      const creditEl = el.querySelector('.hood-credit');

      if (local) {
        el.dataset.bg = served(local.img);
        lazyBgObserve(el.parentElement);
        if (creditEl && local.page) creditEl.innerHTML = `Photo: <a href="${local.page}" target="_blank" rel="noopener">${local.src || "Wikimedia Commons"}</a>`;
        return;
      }

      /* No verified photo of this neighborhood yet. */
      el.classList.add('hood-hero-standin');
      const idx = el.parentElement && el.parentElement.dataset.hoodIdx;
      if (cityPhoto) {
        el.dataset.bg = served(cityPhoto.img);
        /* A city where several hoods are still unphotographed would otherwise
           show the same picture four or five times in a row, which reads as a
           bug. Framing each on a different part of the photo breaks that up —
           it's still the same city shot, and still labelled as one. */
        el.style.backgroundPosition = STANDIN_CROPS[(Number(idx) || 0) % STANDIN_CROPS.length];
        lazyBgObserve(el.parentElement);
      }
      /* The credit reads like any other tile's — it just names the city,
         because that is what the photo actually shows. textContent, not
         innerHTML: the city name goes in unescaped. */
      if (creditEl) creditEl.textContent = `Photo: ${c.city}`;

      /* Top-left stack: a short flag saying this isn't the neighborhood, and
         the invitation to send one that is. Built with DOM calls rather than
         innerHTML so the hood name can't inject markup. */
      const note = document.createElement('div');
      note.className = 'hood-standin-note';
      const flag = document.createElement('span');
      flag.className = 'hood-standin-flag';
      flag.textContent = 'No photo yet';
      const cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'hood-standin-cta';
      cta.textContent = 'Contribute a photo';
      cta.dataset.contribKind = 'neighborhood-hero';
      cta.dataset.contribSubject = name;
      if (idx != null) cta.dataset.contribIdx = idx;
      note.append(flag, cta);
      el.append(note);

      const btn = idx == null ? null : document.querySelector(`#hood-panel-${idx} .photo-contrib`);
      if (btn) {
        btn.classList.add('photo-contrib-wanted');
        btn.textContent = `Add a photo of ${name}`;
      }
    });
  })();

  /* ---------- Sideways rows ----------
     Each neighborhood's stay / eat / coffee / drink row shows one card at a time at every width; on phones
     (640px and under) the neighborhood photos, the landmark cards and the day-trip lists do too.
     initSwipeHint() puts an arrow bar under a row: back and forward arrows, each naming the card it leads
     to, and dots (a "3 / 10" count past 6 cards). CSS shows the bar only where its row scrolls
     (Jeff, 2026-09-24; stay / eat / coffee / drink at every width since 2026-09-25). */
  const SWIPE_PHONE = window.matchMedia('(max-width:640px)');
  const SWIPE_ARROW = d => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="${d < 0 ? '15 5 8 12 15 19' : '9 5 16 12 9 19'}"/></svg>`;
  function initSwipeHint(track, noun, nameSel, onSettle) {
    const items = [...track.children];
    if (items.length < 2) return null;
    const names = items.map(el => { const n = el.querySelector(nameSel); return n ? n.textContent.trim() : ''; });
    const counted = items.length > 6;
    const bar = document.createElement('div');
    bar.className = 'swipe-hint';
    bar.innerHTML = `<button type="button" class="swipe-step swipe-prev"><span class="swipe-arrow">${SWIPE_ARROW(-1)}</span><span class="swipe-name"></span></button>` +
      (counted ? `<span class="swipe-count" aria-hidden="true"></span>`
               : `<span class="swipe-dots" aria-hidden="true">${items.map(() => '<span class="swipe-dot"></span>').join('')}</span>`) +
      `<button type="button" class="swipe-step swipe-next"><span class="swipe-arrow">${SWIPE_ARROW(1)}</span><span class="swipe-name"></span></button>`;
    track.after(bar);
    const dots = [...bar.querySelectorAll('.swipe-dot')];
    const count = bar.querySelector('.swipe-count');
    const [prev, next] = bar.querySelectorAll('.swipe-step');
    const pos = j => items[j].offsetLeft - items[0].offsetLeft;
    let at = -1, settle = 0;
    /* each arrow names the card it leads to; at either end that arrow is disabled and unnamed */
    const label = (btn, j, dir) => {
      const n = names[j] || '';
      btn.disabled = j < 0 || j >= items.length;
      btn.querySelector('.swipe-name').textContent = btn.disabled ? '' : n;
      btn.setAttribute('aria-label', `${dir} ${noun}${!btn.disabled && n ? ': ' + n : ''}`);
    };
    function update() {
      let best = 0;
      items.forEach((el, j) => { if (Math.abs(pos(j) - track.scrollLeft) < Math.abs(pos(best) - track.scrollLeft)) best = j; });
      if (best !== at) {
        at = best;
        dots.forEach((d, j) => d.classList.toggle('on', j === at));
        if (count) count.textContent = `${at + 1} / ${items.length}`;
        label(prev, at - 1, 'Previous');
        label(next, at + 1, 'Next');
      }
      return at;
    }
    function goTo(j) {
      j = Math.max(0, Math.min(items.length - 1, j));
      if (Math.abs(pos(j) - track.scrollLeft) > 2) track.scrollTo({ left: pos(j), behavior: 'smooth' });
    }
    prev.addEventListener('click', () => goTo(at - 1));
    next.addEventListener('click', () => goTo(at + 1));
    track.addEventListener('scroll', () => {
      update();
      clearTimeout(settle);
      settle = setTimeout(() => { if (onSettle) onSettle(update()); }, 140);
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
    return { update, goTo };
  }

  /* ---------- Neighborhood tiles -> detail panel ----------
     The tiles are tabs: one panel shows at a time (arrow keys move between
     them) unless "Show all" is on, which stacks every panel. */
  (function initHoodTabs() {
    const list = document.querySelector('.hood-tiles');
    if (!list) return;
    /* Each tile name: shrink until its longest word fits whole (Sachsenhausen on a
       107px tablet tile), and sit it just above the photo credit, which can wrap to two lines. */
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px';
    function fitHoodTileNames() {
      document.body.appendChild(probe);
      list.querySelectorAll('.hood-tile').forEach(tile => {
        const n = tile.querySelector('.hood-name');
        if (!n) return;
        n.style.fontSize = '';
        const cs = getComputedStyle(n);
        const room = n.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const words = n.textContent.trim().split(/\s+/);
        const widest = () => { probe.style.font = getComputedStyle(n).font;
          return Math.max(...words.map(w => { probe.textContent = w; return probe.getBoundingClientRect().width; })); };
        let size = parseFloat(cs.fontSize);
        while (size > 10 && widest() > room) { size -= 0.5; n.style.fontSize = size + 'px'; }
        const credit = tile.querySelector('.hood-credit');
        const ch = credit && credit.textContent.trim() ? credit.offsetHeight : 0;
        n.style.bottom = Math.max(18, ch + 6) + 'px';
        const cb = tile.querySelector('.hood-tile-contrib');
        if (cb) cb.style.bottom = (Math.max(18, ch + 6) + n.offsetHeight + 6) + 'px';
      });
      probe.remove();
    }
    let fitTimer = 0;
    const refit = () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitHoodTileNames, 60); };
    new MutationObserver(refit).observe(list, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', refit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
    refit();
    const tabs = [...list.querySelectorAll('.hood-tile')];
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const toggle = document.querySelector('.hood-toggle-all');
    let showAll = false, current = 0;
    function select(i, focus) {
      current = i;
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
      panels.forEach((p, j) => { if (p) p.hidden = showAll ? false : j !== i; });
      if (focus) tabs[i].focus();
      if (tileHint) tileHint.goTo(i);
      groupHints.forEach(h => h.update());
    }
    tabs.forEach((t, i) => t.addEventListener('click', () => select(i)));
    /* Phones: swiping the photos selects that neighborhood, so the panel always matches the photo (Jeff, 2026-09-24). */
    const tileHint = initSwipeHint(list, 'neighborhood', '.hood-name', j => { if (SWIPE_PHONE.matches && j !== current) select(j); });
    const groupHints = [...document.querySelectorAll('.hood-panel .hood-groups')].map(g => initSwipeHint(g, 'section', '.hood-bars-head')).filter(Boolean);
    list.addEventListener('keydown', e => {
      const k = e.key;
      /* The tiles are divs with role="tab", not <button>s — a tile holds its
         own "Contribute a photo" button when the hood has no photo yet, and a
         button can't be nested inside a button. Divs don't turn Enter/Space
         into a click the way buttons do, so do it here. Ignore keys aimed at
         that inner button, which handles its own. */
      if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
        const tile = e.target.closest('.hood-tile');
        if (!tile || e.target.closest('button') ) return;
        e.preventDefault();
        select(tabs.indexOf(tile));
        return;
      }
      if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'Home' && k !== 'End') return;
      e.preventDefault();
      const n = tabs.length;
      let i = current;
      if (k === 'ArrowRight') i = (current + 1) % n;
      if (k === 'ArrowLeft') i = (current - 1 + n) % n;
      if (k === 'Home') i = 0;
      if (k === 'End') i = n - 1;
      select(i, true);
    });
    if (toggle) toggle.addEventListener('click', () => {
      showAll = !showAll;
      toggle.setAttribute('aria-pressed', showAll ? 'true' : 'false');
      toggle.textContent = showAll ? 'Show one at a time' : `Show all ${tabs.length} at once`;
      select(current);
    });
  })();

  /* ---------- Converter wiring (reversible) ---------- */
  const localCode = curCode;
  let compareCode = defaultTarget;
  let reversed = false;   // false: local → compare ; true: compare → local
  let showCostsInChosen = false;   // cost cards + Daily Cost Estimator: local currency by default
  let lastRaw = null;     // last converted value, carried over on swap

  const SWAP_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`;

  function compareOptions() {
    return Object.keys(CURRENCIES)
      .filter(code => code !== localCode)
      .map(code => `<option value="${code}"${code === compareCode ? " selected" : ""}>${code} · ${CURRENCIES[code].n}</option>`)
      .join('');
  }

  function fieldHTML(role, isLocal) {
    const input = role === "from"
      ? `<input id="conv-amt" type="number" min="0" step="any" aria-label="Amount to convert" />`
      : `<input id="conv-out" type="text" readonly aria-label="Converted amount" />`;
    const currency = isLocal
      ? `<span class="tag">${localCode}</span>`
      : `<select id="conv-sel" aria-label="Compare currency">${compareOptions()}</select>`;
    return `<div class="conv-col"><span class="conv-label">${isLocal ? "Local currency" : "Chosen currency"}</span><div class="conv-field conv-field-${role}">${input}${currency}</div></div>`;
  }

  function renderConverter(amount) {
    const fromLocal = !reversed;
    document.getElementById("conv-row").innerHTML =
      fieldHTML("from", fromLocal) +
      `<div class="conv-mid"><div class="conv-rate" id="conv-rate"></div><button type="button" class="conv-swap" id="conv-swap" title="Reverse currencies" aria-label="Reverse currencies">${SWAP_SVG}</button></div>` +
      fieldHTML("to", !fromLocal);
    document.getElementById("conv-amt").value = amount;
    bindConverter();
    renderConversion();
  }

  function renderConversion() {
    const fromCode = reversed ? compareCode : localCode;
    const toCode   = reversed ? localCode : compareCode;
    const amt = parseFloat(document.getElementById("conv-amt").value);
    lastRaw = isNaN(amt) ? null : convert(amt, fromCode, toCode);
    document.getElementById("conv-out").value = lastRaw === null ? "" : fmtMoney(lastRaw, toCode);
    const one = convert(1, fromCode, toCode);
    document.getElementById("conv-rate").innerHTML =
      `1 ${fromCode} = <b>${fmtMoney(one, toCode)} ${toCode}</b>` +
      `<span class="src">${ratesLive ? "live rates" : "approx. rates"}</span>`;
  }

  /* Build the full-width "Getting around the city" transit card */
  const transit = CITY_TRANSIT[c.city];
  function buildTransitCard() {
    if (transit == null) return "";
    const sysChips = transit.sys.length
      ? transit.sys.map(s => `<span class="tr-chip">${s.n} <em>${s.t}</em></span>`).join('')
      : `<span class="tr-chip">No formal public transit</span>`;
    const mapBtn = transit.map
      ? `<a class="tr-map-btn" href="${transit.map}" target="_blank" rel="noopener">Transit map &rarr;</a>`
      : `<span class="tr-map-btn" style="background:#9aa7ad;cursor:default" title="No official transit map available">No transit map</span>`;
    const noteHTML = transit.note
      ? `<p class="tr-note"><b>Getting around:</b> ${transit.note}</p>` : "";
    return `
        <div class="tr-head">
          <span class="cost-icon" aria-hidden="true">${TRANSPORT_ICONS.train}</span>
          <div class="k">Getting around the city${noteBtn("transit", "Public transit")}</div>
          ${mapBtn}
          <button type="button" class="tr-micro-btn" id="micro-open-btn">Bikes &amp; scooters</button>
        </div>
        ${noteHTML}
        <div class="tr-sys-row">
          <span class="rides-k">Public transit</span>
          <div class="rides-list" data-no-i18n>${sysChips}</div>
        </div>
        <div class="tr-cols">
          <div class="tr-col">
            <div class="k">How to pay</div>
            <p>${transit.pay}</p>
          </div>
          <div class="tr-col">
            <div class="k">Operating hours</div>
            <p>${transit.hours}</p>
          </div>
        </div>`;
  }

  function renderCosts() {
    const costCode = showCostsInChosen ? compareCode : curCode;
    const el = document.getElementById("cost-cards");
    if (el) el.innerHTML = buildCostCards(costCode);
    const sel = document.getElementById("cost-snapshot");
    if (sel) {
      sel.innerHTML = buildCostSnapshot(costCode);
      const alcToggle = document.getElementById("csnap-alcohol-toggle");
      if (alcToggle) alcToggle.addEventListener("change", () => { csnapIncludeAlcohol = alcToggle.checked; renderCosts(); });
      const actToggle = document.getElementById("csnap-activities-toggle");
      if (actToggle) actToggle.addEventListener("change", () => { csnapIncludeActivities = actToggle.checked; renderCosts(); });
      const soloToggle = document.getElementById("csnap-solo-toggle");
      if (soloToggle) soloToggle.addEventListener("change", () => { csnapSolo = soloToggle.checked; renderCosts(); });
      /* Rebuilt on every toggle/currency/rate change, same as flRun()'s modal. */
      if (window.NRA_VOTES) NRA_VOTES.mountAll(sel);
    }
    const nel = document.getElementById("net-card");
    if (nel) { nel.innerHTML = buildNetCard(compareCode); nel.hidden = (net == null); }
    const tel = document.getElementById("transport-cards");
    if (tel) tel.innerHTML = buildTransport(compareCode);
  }

  function bindConverter() {
    document.getElementById("conv-amt").addEventListener("input", renderConversion);
    document.getElementById("conv-sel").addEventListener("change", e => {
      compareCode = e.target.value;
      renderConversion();
      renderCosts();   // cost + transport cards follow the selected currency
    });
    document.getElementById("conv-swap").addEventListener("click", () => {
      const carry = (lastRaw !== null && isFinite(lastRaw)) ? +lastRaw.toFixed(4) : 1;
      reversed = !reversed;
      renderConverter(carry);
    });
  }

  renderConverter(1);
  renderCosts();

  /* Transit card renders once (no currency dependency) */
  const transitEl = document.getElementById("transit-card");
  if (transitEl) { transitEl.innerHTML = buildTransitCard(); transitEl.hidden = (transit == null); }

  /* Refine with live rates when online (free, no API key needed) */
  fetch("https://open.er-api.com/v6/latest/USD")
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      if (data && data.result === "success" && data.rates) {
        RATES = Object.assign({}, RATES, data.rates);
        ratesLive = true;
        renderConversion();
        renderCosts();   // refresh cost cards with live rates
      }
    })
    .catch(() => { /* keep fallback rates silently */ });

  /* ---------- Transport card "more info" popup ---------- */
  const modal      = document.getElementById("info-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody  = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  /* One airport's facts. The main airport is `airport`; the others are `airports2`, same shape
     (Other Airports tab of NRA-MASTER.xlsx, decisions.md 2026-10-20). */
  function airportBlock(a, code) {
    const mi = a.km != null ? Math.round(a.km * 0.621371) : null;
    const tx = CITY_TAXI[c.city];
    const taxiMeta = tx ? `<br><span class="air-taxi-meta">Official: ${tx.color} &middot; <b style="color:${taxiFareColor(tx.fare)}">${tx.fareNote}</b></span>` : "";
    /* a worked-out fare (taxiEst) says so, with how it was worked out behind the info icon (Jeff, 2026-10-20) */
    const est = a.taxiEst ? ` <span class="air-est">est.</span><button type="button" class="note-btn hint-btn" data-hint="${String(a.taxiEst).replace(/"/g, "&quot;")}" onclick="this.classList.toggle('open')" aria-label="How this fare was estimated">${INFO_ICON}</button>` : "";
    /* Fares and on-site rental counters aren't on file for every airport; a row
       is shown only where we actually have the figure, rather than guessed. */
    const row = (k, v) => v ? `<dt>${k}</dt><dd>${v}</dd>` : "";
    const rideText = !a.ride ? "" : a.ride.avail === "no"
      ? "Not available"
      : `${a.ride.avail === "limited" ? "Limited availability" : "Available"}${
          a.ride.cost == null ? "" : ` &middot; avg ${fmtPrice(a.ride.cost, code)}`}`;
    /* the city's ride-share apps (rides key) as store buttons, only where ride-hailing works at the airport */
    const apps = (a.ride && a.ride.avail !== "no" && CITY_RIDES[c.city]) || [];
    const appChips = apps.map(r => {
      const u = window.nraAppLink ? window.nraAppLink(r, c.country) : null;
      return u ? `<a class="ride-chip" href="${u}" target="_blank" rel="noopener" title="Get the ${r} app">${r}</a>` : "";
    }).join("");
    const rideRow = rideText + (appChips ? `<div class="rides-list air-apps">${appChips}</div>` : "");
    const transit = (a.transit || []).map(t => `<li>${t.m}${t.c == null ? "" : ` — <b>${t.c === 0 ? "free" : fmtPrice(t.c, code)}</b>`}</li>`).join("");
    const carRental = [a.drive ? `Drive ~${a.drive}` : "",
                       (a.rentals && a.rentals.length) ? `on-site counters: ${a.rentals.join(", ")}` : ""]
                      .filter(Boolean).join(" &middot; ");
    return `
      <p class="air-name">${a.name}</p>
      ${a.km == null ? "" : `<div class="air-dist"><span class="air-dist-v">${a.km} km / ${mi} mi</span><span class="air-dist-k">to city center</span></div>`}
      <h4 class="air-sub">Getting to the city center</h4>
      <dl class="air-rows">
        ${row("Car rental", carRental)}
        ${row("Car service", a.carService == null ? "" : `avg ${fmtPrice(a.carService, code)}`)}
        ${row("Taxi", a.taxi == null ? "" : `avg ${fmtPrice(a.taxi, code)}${est}${taxiMeta}`)}
        ${row("Ride-hailing", rideRow)}
        ${row("Public transit", transit ? `<ul class="air-transit">${transit}</ul>` : "")}
      </dl>
      ${a.note ? `<p class="note-text">${a.note}</p>` : ""}`;
  }
  /* the IATA code for a chip: the `code` field, else the three capitals in brackets in the name */
  function airportCode(a) {
    if (a.code) return a.code;
    const m = /\(([A-Z]{3})\b/.exec(a.name || "");
    return m ? m[1] : (a.name || "").split(/[ (,]/)[0];
  }
  /* Layout A (Jeff, 2026-10-20): with more than one airport, square chips by code switch the block shown */
  function buildAirportModal(code) {
    const a = CITY_AIRPORT[c.city];
    if (!a) return `<p class="modal-placeholder">More information coming soon.</p>`;
    const all = [a].concat(CITY_AIRPORTS2[c.city] || []);
    /* airports listed in transport.air with no block yet (too far, or not researched) are named in the foot line */
    const codesIn = s => (String(s).match(/\b[A-Z]{3}\b/g) || []);
    const covered = new Set(all.map(airportCode));
    const others = ((CITY_TRANSPORT[c.city] && CITY_TRANSPORT[c.city].air) || [])
      .filter(x => x !== a.name && !all.some(b => b.name === x) && !(codesIn(x).length && codesIn(x).every(k => covered.has(k))));
    if (all.length === 1) return airportBlock(a, code)
      + (others.length ? `<p class="air-foot">Figures shown for ${a.name}. Other airports: ${others.join(", ")}.</p>` : "");
    const foot = others.length ? `<p class="air-foot">Also nearby: ${others.join(", ")}.</p>` : "";
    const tabs = all.map((b, i) => `<button type="button" class="air-tab" role="tab" aria-selected="${i === 0}" onclick="airTab(this, ${i})">${airportCode(b)}</button>`).join("");
    const panes = all.map((b, i) => `<div class="air-pane" role="tabpanel"${i ? " hidden" : ""}>${airportBlock(b, code)}</div>`).join("");
    return `<div class="air-tabs" role="tablist" aria-label="Airports">${tabs}</div>${panes}${foot}`;
  }
  window.airTab = function (btn, i) {
    const box = btn.closest(".modal-body") || document;
    box.querySelectorAll(".air-tab").forEach((t, k) => t.setAttribute("aria-selected", k === i ? "true" : "false"));
    box.querySelectorAll(".air-pane").forEach((p, k) => { p.hidden = k !== i; });
  };

  /* Google Maps search link, centered on the city when we have coordinates */
  function atmMapUrl(term) {
    if (typeof c.lat === "number" && typeof c.lng === "number") {
      return `https://www.google.com/maps/search/${encodeURIComponent(term)}/@${c.lat},${c.lng},14z`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(term + " near " + c.city)}`;
  }

  function buildAtmModal() {
    const pin = `<span class="atm-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>`;
    const link = (term, label) =>
      `<a class="atm-link" href="${atmMapUrl(term)}" target="_blank" rel="noopener">${pin}<span>${label}</span><span class="atm-go">Map →</span></a>`;
    return `
      <p class="atm-intro">Find cash machines and money-changers around ${c.city}. Each link opens Google Maps centered on the city.</p>
      <div class="atm-sec-k">Where to get cash</div>
      <div class="atm-links">
        ${link("ATM", "ATMs nearby")}
        ${link("bank ATM", "Bank-branch ATMs (usually lower fees)")}
        ${link("currency exchange", "Currency-exchange shops")}
      </div>
      <div class="atm-sec-k">Tips to avoid fees</div>
      <ul class="atm-tips">
        <li><b>Say no to the ATM's own conversion.</b> If it offers to charge you in your home currency, decline — pick ${curCode} (the local currency) for a fairer rate.</li>
        <li><b>Use ATMs attached to a real bank branch.</b> Standalone machines in shops, hotels, and airports tend to add the highest fees.</li>
        <li><b>Take out more, less often.</b> Most cards charge a flat fee per withdrawal, so fewer larger withdrawals cost less overall.</li>
        <li><b>Check your own bank first.</b> Your home bank may add a foreign-transaction or out-of-network fee — some travel cards refund these.</li>
        <li><b>Compare exchange shops to the fair rate.</b> Use the converter above as your benchmark; a good shop is close to it, with no hidden commission.</li>
      </ul>
      <p class="atm-foot">Bank and card fees change often and vary by your own card, so exact numbers aren't listed here — the tips above save the most money.</p>`;
  }

  /* ---------- Common phrases modal (data: city-phrases.js) ---------- */
  function buildPhrasesModal() {
    if (!cityPhrases) return `<p class="modal-placeholder">Common phrases for ${c.city} are coming soon.</p>`;
    const rows = [
      cityPhrases.yesNo, cityPhrases.hello, cityPhrases.please, cityPhrases.thanks,
      cityPhrases.welcome, cityPhrases.sorry, cityPhrases.noSpeak, cityPhrases.howMuch,
      cityPhrases.bathroom, cityPhrases.help, cityPhrases.cheers
    ];
    return `
      <p class="atm-intro"><b>${cityPhraseLang}</b> &mdash; a few basics for getting by in ${c.city}.</p>
      <div class="phrase-rows">
        ${rows.map(r => `
        <div class="phrase-row">
          <div class="phrase-en">${r.en}</div>
          <div class="phrase-t">${r.t}</div>
        </div>`).join('')}
      </div>`;
  }

  /* ---------- Train / bus / ferry "more info" modals (data: CITY_ROUTES) ---------- */
  const NIGHT_BADGE  = `<span class="rt-badge rt-night">\u{1F319} Night train</span>`;
  const SEASON_BADGE = `<span class="rt-badge rt-season">Seasonal</span>`;

  /* One sand-colored row per direct route: destination · badges · time · operator link */
  function routeRows(list, isTrain) {
    return `<div class="rt-rows" data-no-i18n>${list.map(r => `
      <div class="rt-row">
        <span class="rt-to">${r.to}</span>
        ${isTrain && r.night ? NIGHT_BADGE : ""}
        ${r.seasonal ? SEASON_BADGE : ""}
        ${r.time ? `<span class="rt-time">${r.time}</span>` : ""}
        ${r.url ? `<a class="rt-op" href="${r.url}" target="_blank" rel="noopener">${r.op} &rarr;</a>` : `<span class="rt-op">${r.op}</span>`}
      </div>`).join("")}</div>`;
  }

  /* Route notes carry operator web addresses in brackets, e.g. "ALSA (https://www.alsa.com/...)".
     Show each as a short clickable link to its site ("ALSA (alsa.com)"); the data itself is unchanged. */
  function linkNote(note) {
    return String(note).replace(/\((https?:\/\/[^\s)]+)\)/g, (m, url) => {
      let host = url;
      try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (e) {}
      return `(<a class="rt-note-link" href="${url.replace(/"/g, "&quot;")}" target="_blank" rel="noopener">${host}</a>)`;
    });
  }
  function buildTrainModal() {
    const d = CITY_ROUTES[c.city] && CITY_ROUTES[c.city].train;
    if (!d) return `<p class="modal-placeholder">More information about trains in ${c.city} is coming soon.</p>`;
    const intl = d.intl && d.intl.length
      ? `<div class="rt-sec-k">Direct international trains</div>${routeRows(d.intl, true)}`
      : "";
    const dom = d.dom
      ? `<div class="rt-sec-k">Domestic trains</div>
         <a class="rt-search" href="${d.dom.url}" target="_blank" rel="noopener" data-no-i18n>
           <span>Search domestic trains &middot; ${d.dom.op}</span><span class="rt-go">&rarr;</span></a>`
      : "";
    return `${intl}${dom}${d.note ? `<p class="rt-note">${linkNote(d.note)}</p>` : ""}
      <p class="rt-foot">Direct routes only &middot; times are approximate &middot; links open the official operator's site.</p>`;
  }

  function buildBusModal() {
    const d = CITY_ROUTES[c.city] && CITY_ROUTES[c.city].bus;
    if (!d) return `<p class="modal-placeholder">More information about buses in ${c.city} is coming soon.</p>`;
    const intl = d.intl && d.intl.length
      ? `<div class="rt-sec-k">International coach routes</div>${routeRows(d.intl, false)}`
      : "";
    return `${intl}${d.note ? `<p class="rt-note">${linkNote(d.note)}</p>` : ""}
      <p class="rt-foot">Routes change seasonally &middot; book on the operator's official site.</p>`;
  }

  function buildFerryModal() {
    const d = CITY_ROUTES[c.city] && CITY_ROUTES[c.city].ferry;
    if (!d) return `<p class="modal-placeholder">More information about ferries in ${c.city} is coming soon.</p>`;
    const intl = d.intl && d.intl.length
      ? `<div class="rt-sec-k">International ferry routes</div>${routeRows(d.intl, false)}`
      : "";
    return `${intl}${d.note ? `<p class="rt-note">${linkNote(d.note)}</p>` : ""}
      <p class="rt-foot">Sailings vary by season &middot; book on the operator's official site.</p>`;
  }

  /* ---------- Find laundry & gyms: plain links to Google Maps ----------
     No key and no embedded map (decisions.md, 2026-09-18): each link opens a Google Maps
     search for laundromats or gyms near the place chosen in the dropdown, like every
     other map link on the site. */
  const flEsc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  function flPoints() {
    const hoods = CITY_HOODS[c.city] || [], geo = CITY_HOOD_GEO[c.city] || [];
    const pts = [{ key: "city", label: `Anywhere in ${c.city}`, place: c.city, lat: c.lat, lng: c.lng }];
    /* Google searches by name, so every neighborhood is listed, placed on our map or not */
    hoods.forEach((hd, i) => { const g = geo[i], ok = g && g.length === 2; pts.push({ key: String(i), label: hd, place: `${hd}, ${c.city}`, lat: ok ? g[0] : null, lng: ok ? g[1] : null }); });
    return pts;
  }
  function buildFindModal() {
    const pts = flPoints();
    const head = pts.length > 1 ? `
      <div class="fl-head">
        <label for="fl-hood">Search near</label>
        <select id="fl-hood">${pts.map(p => `<option value="${p.key}">${flEsc(p.label)}</option>`).join("")}</select>
      </div>` : `
      <div class="fl-head"><label>Showing all of ${flEsc(c.city)}</label></div>`;
    const opt = (k, t) => `<input type="radio" name="fl-kind" id="fl-kind-${k}" value="${k}"${k === "laundry" ? " checked" : ""}><label for="fl-kind-${k}">${t}</label>`;
    return head + `
      <div class="fl-kind" role="radiogroup" aria-label="Show">${opt("laundry", "Laundry")}${opt("gym", "Gyms")}</div>
      <div id="fl-out"></div>
      <p class="fl-foot">"Show all" opens Google Maps. Hours, availability and prices may have changed &mdash; check with the business before you go. Checked entries (&#10003;) are gyms we researched for day passes.</p>`;
  }
  function flKm(a, b, cc, d) { const p = Math.PI / 180, x = Math.sin((cc - a) * p / 2) ** 2 + Math.cos(a * p) * Math.cos(cc * p) * Math.sin((d - b) * p / 2) ** 2; return 2 * 6371 * Math.asin(Math.sqrt(x)); }
  /* Researched gyms (CITY_GYMS) for the chosen point: a neighborhood's own list,
     or every researched gym for "Anywhere". Shown when Gyms is chosen. */
  function flResearched(pt) {
    const gyms = CITY_GYMS[c.city] || [];
    const mine = pt.key === "city" ? gyms : gyms.filter(g => String(g.hood) === pt.key);
    if (!mine.length) return "";
    const esc = s => String(s == null ? "" : s).replace(/</g, "&lt;");
    const price = (p, code) => p ? (p.loc === 0 ? "free trial" : typeof p.usd === "number" ? fmtPrice(p.usd, code) : "price on site") : null;
    const rows = mine.map(g => {
      /* same currency the cost cards are showing: chosen currency when that toggle is on, else the local one */
      const code = (typeof showCostsInChosen !== "undefined" && showCostsInChosen && typeof compareCode !== "undefined" && compareCode) ? compareCode : (typeof curCode !== "undefined" && curCode) ? curCode : "USD";
      const bits = [];
      if (g.free) bits.push("free");
      if (g.pass) {
        if (g.pass.day) bits.push("Day pass " + price(g.pass.day, code));
        if (g.pass.multi) bits.push(esc(g.pass.multi.label || "Multi-day") + " " + price(g.pass.multi, code));
        if (g.pass.week) bits.push("Week " + price(g.pass.week, code));
      }
      const d = (pt.lat != null && typeof g.lat === "number") ? flKm(pt.lat, pt.lng, g.lat, g.lng) : null;
      const meta = [g.kind ? esc(g.kind) : null, g.chain ? "chain price" : null, d != null ? (d < 1 ? Math.round(d * 1000) + " m" : d.toFixed(1) + " km") + " away" : null].filter(Boolean).join(" &middot; ");
      const map = typeof g.lat === "number" ? `https://www.google.com/maps/search/?api=1&query=${g.lat},${g.lng}` : (g.src || "#");
      const gid = `${g.n}|${typeof g.lat === "number" ? g.lat.toFixed(5) + "," + g.lng.toFixed(5) : (g.hood || "city")}`;
      const vote = voteWidgetHTML({type:"gym", id:gid, city:c.city, extraClass:"fl-vote", size:13});
      return `<li class="fl-res"><span class="fl-n">${esc(g.n)}</span> &middot; <a href="${map}" target="_blank" rel="noopener">Map &rarr;</a><span class="fl-m">${bits.join(" &middot; ") || "pass available"}${meta ? " &middot; " + meta : ""}${g.src ? ` &middot; <a href="${esc(g.src)}" target="_blank" rel="noopener">source</a>` : ""}</span>${vote}</li>`;
    });
    return `<ul class="fl-list">${rows.join("")}</ul>`;
  }
  function flRun(key) {
    const pt = flPoints().find(p => p.key === key); if (!pt) return;
    const O = document.getElementById("fl-out");
    const kind = (document.querySelector('input[name="fl-kind"]:checked') || {}).value || "laundry";
    const near = flEsc(pt.key === "city" ? c.city : pt.label);
    const q = `${kind === "gym" ? "gym" : "laundromat"} near ${pt.place}${c.country ? ", " + c.country : ""}`;
    const more = `<a class="fl-more" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}" target="_blank" rel="noopener">Show all ${kind === "gym" ? "gyms" : "laundromats"} in ${near} &rarr;</a>`;
    if (kind === "gym") {
      const researched = flResearched(pt);
      O.innerHTML = (researched
        ? `<p class="fl-sub">Day passes we've checked${pt.key === "city" ? "" : " in " + near}</p>${researched}`
        : `<p class="fl-none">No day-pass gyms researched${pt.key === "city" ? "" : " in " + near} yet.</p>`) + more;
    } else {
      /* laundry facts are city-wide; listed laundromats are per neighborhood (Overture open data) */
      O.innerHTML = `<p class="fl-sub">Laundry in ${flEsc(c.city)}</p>${buildLaundryModal()}${flLaundromats(pt)}${more}`;
    }
    /* fl-out is fully replaced on every dropdown/radio change, so its vote-widgets
       (gym and laundromat listings) are brand new nodes each time and need mounting. */
    if (window.NRA_VOTES) NRA_VOTES.mountAll(O);
  }
  /* Listed laundromats for the chosen point (CITY_LAUNDROMATS): a neighborhood's own, or all of them for "Anywhere".
     Each opens Google Maps through a plain link (no API call). */
  function flLaundromats(pt) {
    const all = CITY_LAUNDROMATS[c.city];
    const near = flEsc(pt.key === "city" ? c.city : pt.label);
    const mine = !all ? [] : pt.key === "city" ? all : all.filter(x => String(x.hood) === pt.key);
    /* undefined = this city has not been loaded yet; an empty result after loading means our open-data
       source lists none here, which is not the same as there being none. */
    if (!mine.length) return `<p class="fl-sub">Laundromats${pt.key === "city" ? "" : " in " + near}</p><p class="fl-none">${all === undefined ? `Laundromat list for ${near} coming soon.` : `None listed for ${near} in our open-data source. The link below searches Google Maps.`}</p>`;
    const hoods = CITY_HOODS[c.city] || [];
    const rows = mine.map(x => {
      const d = (pt.lat != null && typeof x.lat === "number") ? flKm(pt.lat, pt.lng, x.lat, x.lng) : null;
      const q = `${x.n}, ${x.addr || hoods[x.hood] || ""}, ${c.city}`;
      /* The open data names the kind only when the listing's own name does (decisions.md
         2026-09-24): "Laundromat" otherwise, the same word the sheet stores. Self-service
         is the one travellers look for, so it is tagged in brand green. */
      const kindTag = x.k === "self" ? `<span class="fl-ltype is-self">Self-service</span>`
                    : x.k === "drop" ? `<span class="fl-ltype">Drop-off &amp; fold</span>`
                    : `<span class="fl-ltype">Laundromat</span>`;
      /* some open-data names stack every search term they could think of
         ("Self Service Laundry Athens / Coin laundry Athens / …"): show the first part */
      const shortName = (x.n.split(/\s+[\/|]\s+/)[0] || x.n).trim() || x.n;   // spaces both sides, so "4/27" and "(a/b)" stay whole
      const meta = [x.addr ? flEsc(x.addr) : null,
                    d != null ? (d < 1 ? Math.round(d * 1000) + " m" : d.toFixed(1) + " km") + " away" : null,
                    pt.key === "city" && hoods[x.hood] ? flEsc(hoods[x.hood]) : null].filter(Boolean).join(" &middot; ");
      const lid = `${x.n}|${typeof x.lat === "number" ? x.lat.toFixed(5) + "," + x.lng.toFixed(5) : (x.hood || "city")}`;
      const vote = voteWidgetHTML({type:"laundromat", id:lid, city:c.city, extraClass:"fl-vote", size:13});
      return `<li><span class="fl-n">${flEsc(shortName)}</span>${kindTag}${meta ? `<span class="fl-m">${meta}</span>` : ""}<a class="fl-mapbtn" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}" target="_blank" rel="noopener">See it on a map &rarr;</a>${vote}</li>`;
    });
    return `<p class="fl-sub">Laundromats${pt.key === "city" ? "" : " in " + near}</p><ul class="fl-list fl-lm">${rows.join("")}</ul><p class="fl-credit">Laundromat listings: Overture Maps Foundation (open data).</p>`;
  }
  function flInit() {
    const sel = document.getElementById("fl-hood"), cur = () => sel ? sel.value : "city";
    if (sel) sel.addEventListener("change", () => flRun(cur()));
    document.querySelectorAll('input[name="fl-kind"]').forEach(r => r.addEventListener("change", () => flRun(cur())));
    flRun(cur());
  }

  function buildLaundryModal() {
    const ln = CITY_LAUNDRY[c.city];
    if (!ln) return `<p class="modal-placeholder">Laundry details for ${c.city} are coming soon.</p>`;
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const rows = [];
    if (ln.usd != null) rows.push(`<b>Wash + one dry:</b> about $${ln.usd}${ln.usdMax != null ? "&ndash;" + ln.usdMax : ""} USD${ln.scope === "country" ? " — a typical figure for the country, not this city specifically" : ""}${ln.asof ? ` (as of ${esc(ln.asof)})` : ""}`);
    if (ln.drop) rows.push(`<b>Drop-off (wash-and-fold):</b> ${esc(ln.drop)}${ln.cur ? ` ${esc(ln.cur)}` : ""}${/lb/i.test(ln.drop) ? "" : /kg|load/i.test(ln.drop) ? "" : " per kg"}${ln.scope === "country" ? " — a typical figure for the country" : ""}`);
    /* no availability judgement and no payment line: the listed laundromats below are
       the answer, and the judgement disagreed with them in 79 cities (Jeff, 2026-09-24) */
    if (ln.note) rows.push(esc(ln.note));
    if (ln.conf && ln.conf !== "none") rows.push(`<span class="net-est">Price confidence: ${esc(ln.conf)}</span>`);
    if (ln.src && /^https?:\/\//.test(ln.src)) rows.push(`<a href="${esc(ln.src)}" target="_blank" rel="noopener">Source</a>`);
    return rows.map(r => `<p class="note-text">${r}</p>`).join("");
  }

  function buildTaxiTipModal() {
    const tx = CITY_TAXI[c.city];
    if (!tx) return `<p class="modal-placeholder">More taxi info for ${c.city} is coming soon.</p>`;
    const fareLabel = {metered:"Metered", fixed:"Fixed fare", negotiated:"Negotiate first",
                       unmetered:"Unmetered — agree fare first"}[tx.fare]
                       || (tx.fare.charAt(0).toUpperCase() + tx.fare.slice(1));
    const ride = CITY_RIDES[c.city];
    const rideHTML = ride == null ? "" : (ride.length
      ? `<dt>Ride-share apps</dt><dd>${ride.join(", ")}</dd>`
      : `<dt>Ride-share apps</dt><dd>Local taxis — no major apps</dd>`);
    return `
      <dl class="air-rows">
        <dt>Official taxi color</dt><dd>${tx.color}</dd>
        <dt>Fares</dt><dd><b style="color:${taxiFareColor(tx.fare)}">${fareLabel}</b></dd>
        ${rideHTML}
      </dl>
      <p class="rt-note">${tx.fareNote}</p>`;
  }

  function buildAlcoholModal() {
    if (!drinks || typeof drinks.beer === "number") return `<p class="modal-placeholder">No alcohol restrictions on file for ${c.city}.</p>`;
    const detail = drinks.beer === "notallowed"
      ? "The public sale and consumption of alcohol is not allowed here. Visitors should not expect to find beer, wine or spirits at typical restaurants or shops."
      : "Alcohol is restricted rather than fully banned — it may only be available in specific licensed hotels, resorts or members-only venues, and public drinking is generally not permitted.";
    return `<p class="rt-intro">${detail}</p><p class="rt-foot">Rules can change and vary by neighborhood — check current local guidance before your trip.</p>`;
  }
  function buildWaterModal() {
    const w = CITY_WATER[c.city];
    if (!w) return `<p class="modal-placeholder">No tap water information on file for ${c.city}.</p>`;
    return `<p class="rt-intro">${w.note}</p>`;
  }

  /* Travel eSIMs — one card per provider. Coverage and the verified deep
     links live in esim-providers.js; a null path there means that provider
     sells nothing for this country, so the buy button is hidden rather than
     pointed at a dead page. Hong Kong and Macau share the country
     "China (SAR)", so they are looked up by "country::city" first. */
  function buildEsimModal() {
    const T = window.NRA_ESIM;
    if (!T) return `<p class="modal-placeholder">Loading eSIM options&hellip;</p>`;
    const row = T[c.country + "::" + c.city] || T[c.country] || null;
    const n   = row ? row.filter(Boolean).length : 0;   /* providers covering this country */
    const any = n > 0;

    const rows = window.NRA_ESIM_PROVIDERS.map((p, i) => {
      const path = row ? row[i] : null;
      /* No plan for this country — drop the provider from the card entirely
         rather than advertising a service the traveller can't use here. */
      if (!path) return "";
      const dest = window.NRA_ESIM_HOSTS[p.key] + path;
      const tpl  = window.NRA_ESIM_AFF[p.key] || "{url}";
      const href = tpl === "{url}" ? dest : tpl.replace("{url}", encodeURIComponent(dest));
      return `
            <div class="esim-prov">
              <div class="esim-prov-head">
                <span class="esim-prov-name">${p.name}</span>
                <span class="esim-prov-tag">${p.tag}</span>
                <a class="esim-buy" href="${href}" target="_blank" rel="noopener sponsored">Get plans &rarr;</a>
              </div>
              <p class="esim-prov-blurb">${p.blurb}</p>
            </div>`;
    }).join("");

    return `
          <p class="esim-intro">${any
            ? `A travel eSIM gets you data the moment you land in ${c.country} &mdash; no SIM shop, no roaming bill. ` + (
                n === 3 ? `Here's how the three we track compare.`
              : n === 2 ? `Two of the providers we track cover it &mdash; here's how they compare.`
              :           `One of the providers we track covers it.`)
            : `None of the eSIM providers we track currently sell data plans for ${c.country}. A local SIM bought on arrival is usually the only option.`}</p>
          ${any ? `<p class="esim-devices">Most modern phones have eSIM capability. If you're not sure, <a href="https://saily.com/esim-supported-devices/" target="_blank" rel="noopener">check your phone model here</a>.</p>` : ""}
          <div class="esim-list">${rows}</div>
          ${any ? `<p class="esim-foot">Prices and coverage checked September 2026 and can change. Links are affiliate links &mdash; they cost you nothing extra and help keep Never Roam Alone free.</p>` : ""}`;
  }

  /* city-food.js is large, so it is fetched only when the visitor asks for it
     (on hover, or on click of the meal card's food link). */
  let foodDataPromise = null;
  function loadFoodData() {
    if (typeof CITY_FOOD !== "undefined") return Promise.resolve();
    if (!foodDataPromise) {
      foodDataPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "city-food.js";
        s.onload = resolve;
        s.onerror = () => { foodDataPromise = null; reject(new Error("city-food.js failed to load")); };
        document.head.appendChild(s);
      });
    }
    return foodDataPromise;
  }

  /* city-micromobility.js (shared bikes / e-scooters) is fetched only when the
     "Bikes & scooters" button in the transit card is opened or hovered. */
  let microDataPromise = null;
  function loadMicroData() {
    if (window.NRA_MICRO) return Promise.resolve();
    if (!microDataPromise) {
      microDataPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "city-micromobility.js";
        s.onload = resolve;
        s.onerror = () => { microDataPromise = null; reject(new Error("city-micromobility.js failed to load")); };
        document.head.appendChild(s);
      });
    }
    return microDataPromise;
  }
  function buildMicroModal() {
    const list = (window.NRA_MICRO || {})[c.city] || [];
    if (!list.length) {
      return `<p class="modal-placeholder">We haven't found a shared bike or e-scooter service operating in ${c.city}. Local shops usually rent bikes and scooters by the hour or day &mdash; ask at your hotel or the tourist office.</p>`;
    }
    const rows = list.map(m => {
      /* The operator name links to the app store when we have a verified
         listing; the "Visit site" link stays either way. */
      const appUrl = window.nraAppLink ? window.nraAppLink(m.n, c.country) : null;
      return `
      <li class="micro-row">
        ${appUrl
          ? `<a class="micro-name micro-app" href="${appUrl}" target="_blank" rel="noopener" title="Get the ${m.n} app">${m.n}</a>`
          : `<span class="micro-name">${m.n}</span>`}
        ${m.u ? `<a class="micro-link" href="${m.u}" target="_blank" rel="noopener">Visit site &nearr;</a>` : ``}
      </li>`;
    }).join("");
    return `
      <p class="rt-intro">Shared bikes, e-bikes and e-scooters you can unlock yourself in ${c.city}. Most need the operator's app plus a card, so download it before you land.</p>
      <ul class="micro-list">${rows}</ul>
      <p class="micro-note">Operators come and go, and coverage can be limited to the city centre &mdash; check the app's map before you rely on one. Helmet rules, minimum age and pavement-riding bans vary by city.</p>`;
  }

  /* city-routes.js is likewise large (~1.3 MB), so it is fetched only when a
     train / bus / ferry "more info" modal is opened (or its card is hovered). */
  let routesDataPromise = null;
  function loadRoutesData() {
    if (window.NRA_ROUTES) { CITY_ROUTES = window.NRA_ROUTES; return Promise.resolve(); }
    if (!routesDataPromise) {
      routesDataPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "city-routes.js";
        s.onload = () => { CITY_ROUTES = window.NRA_ROUTES || {}; resolve(); };
        s.onerror = () => { routesDataPromise = null; reject(new Error("city-routes.js failed to load")); };
        document.head.appendChild(s);
      });
    }
    return routesDataPromise;
  }

  /* Local food & drink recommendations — first view: dish/drink list */
  function buildFoodModal() {
    const items = (typeof CITY_FOOD !== "undefined" && CITY_FOOD[c.city]) || null;
    if (!items) return `<p class="modal-placeholder">No food & drink recommendations on file for ${c.city}.</p>`;
    const photos = (window.NRA_FOOD_PHOTOS && window.NRA_FOOD_PHOTOS[c.city]) || [];
    return `<p class="rt-intro">Local dishes and drinks worth seeking out in ${c.city}. Tap any item to see the best-reviewed places to try it.</p>
      <div class="food-list">${items.map((it, i) => `
        <div class="food-item has-photo" role="button" tabindex="0" onclick="if(!event.target.closest('[data-contrib-kind]'))showFoodPlaces(${i})" onkeydown="if((event.key==='Enter'||event.key===' ')&&event.target===this){event.preventDefault();showFoodPlaces(${i})}">
          <span class="food-item-body">
          <span class="food-item-name">${it.name}</span><span class="food-item-tag${it.type === "drink" ? " food-tag-drink" : ""}">${it.type === "drink" ? "Drink" : "Dish"}</span>
          <p class="food-item-desc">${it.desc}</p>
          <p class="food-item-hint">Where to try it &rsaquo;</p>
          </span>
          ${!photos[i] || /coming-soon/.test(photos[i].img || "") ? `<span class="food-item-thumb food-item-nophoto"><button type="button" class="photo-contrib" data-contrib-kind="food-dish" data-contrib-subject="${it.name.replace(/"/g,'&quot;')}" data-contrib-idx="${i}">Contribute a photo</button><span class="food-nophoto-text">We don't have an image for this yet</span></span>` : photos[i] ? `<span class="food-item-thumb"><img class="food-item-photo" src="${/^https?:/i.test(photos[i].img) ? photos[i].img : "images/food/" + photos[i].img}" alt="${it.name}" loading="lazy" onerror="this.closest('.food-item-thumb').remove()">${photos[i].by && photos[i].page ? `<span class="food-item-credit" title="Photo: ${photos[i].by}${photos[i].lic ? " · " + photos[i].lic : ""}${/^https?:/i.test(photos[i].img) ? "" : /flickr\.com/i.test(photos[i].page) ? " · Flickr" : " · Wikimedia Commons"}" onclick="event.stopPropagation();window.open('${photos[i].page}','_blank','noopener')">${photos[i].by}</span>` : ""}</span>` : ""}
        </div>`).join("")}
      </div>`;
  }
  /* "Submit a recommendation" under a dish's places: suggest-place.js in food mode
     (business name, neighborhood, Google Maps link) → place_suggestions, section "food" */
  function openFoodSuggest(idx) {
    const items = (typeof CITY_FOOD !== "undefined" && CITY_FOOD[c.city]) || null;
    const it = items && items[idx];
    if (!it || !window.NRA_SUGGEST) return;
    NRA_SUGGEST.open({ city: c.city, section: "food", item: it.name, itemType: it.type === "drink" ? "drink" : "dish",
                       hoods: CITY_HOODS[c.city] || [], title: `Recommend a place for ${it.name}` });
  }
  window.openFoodSuggest = openFoodSuggest;
  /* Second view: best places for one dish/drink */
  function showFoodPlaces(idx) {
    const items = (typeof CITY_FOOD !== "undefined" && CITY_FOOD[c.city]) || null;
    const it = items && items[idx];
    if (!it) return;
    modalTitle.textContent = `${it.name} — ${c.city}`;
    modalBody.innerHTML = `
      <button type="button" class="food-back-btn" onclick="openModal('Local food &amp; drink')">&larr; Back to all food &amp; drink</button>
      <p class="rt-intro">${it.desc}</p>
      ${it.places.map(p => `
      <div class="food-place">
        <span class="food-place-name">${p.name}</span><span class="food-place-area">${p.area}</span>
        <p class="food-place-note">${p.note}</p>
        <a class="food-place-map" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ", " + p.area + ", " + c.city)}" target="_blank" rel="noopener">Open in Google Maps ↗</a>
        ${voteWidgetHTML({type:"food_place", id:`${it.name}|${p.name}`, city:c.city, extraClass:"fl-vote", size:13})}
      </div>`).join("")}
      <div class="food-rec-row">Want to submit a recommendation for a great ${it.name} in ${c.city}?<br><button type="button" class="food-rec-btn" onclick="openFoodSuggest(${idx})">Submit a recommendation</button></div>
      <p class="food-contrib-row">Have a photo of ${it.name}?<button type="button" class="food-contrib-btn" data-contrib-kind="food-dish" data-contrib-subject="${it.name.replace(/"/g,'&quot;')}" data-contrib-idx="${idx}">Contribute one</button></p>
      <p class="food-src-note">Picks are based on recent traveler reviews and food articles — hours and quality can change, so double-check before you go.</p>`;
    modalBody.scrollTop = 0;
    if (window.NRA_VOTES) NRA_VOTES.mountAll(modalBody);
  }

  function openModal(title) {
    modalTitle.textContent = `${title} — ${c.city}`;
    if (title === "Major airports" && CITY_AIRPORT[c.city]) {
      modalBody.innerHTML = buildAirportModal(compareCode);
    } else if (title === "ATM & cash finder") {
      modalBody.innerHTML = buildAtmModal();
    } else if (title === "Alcohol rules") {
      modalBody.innerHTML = buildAlcoholModal();
    } else if (title === "Tap water safety") {
      modalBody.innerHTML = buildWaterModal();
    } else if (title === "Travel eSIMs") {
      modalBody.innerHTML = buildEsimModal();
    } else if (title === "Major train stations" || title === "Major bus stations" || title === "Ferry / boat ports") {
      /* Route data is lazy-loaded; the build functions themselves fall back to
         the "coming soon" placeholder when a city has no data on file. */
      const buildRouteModal = title === "Major train stations" ? buildTrainModal
                            : title === "Major bus stations"   ? buildBusModal
                            : buildFerryModal;
      if (window.NRA_ROUTES) {
        modalBody.innerHTML = buildRouteModal();
      } else {
        modalBody.innerHTML = `<p class="modal-placeholder">Loading route details&hellip;</p>`;
        const forCity = c.city;
        loadRoutesData()
          .then(() => { if (!modal.hidden && modalTitle.textContent === `${title} — ${forCity}`) modalBody.innerHTML = buildRouteModal(); })
          .catch(() => { if (!modal.hidden) modalBody.innerHTML = `<p class="modal-placeholder">Couldn't load the route details. Please check your connection and try again.</p>`; });
      }
    } else if (NOTE_MODALS[title] && cityNotes[NOTE_MODALS[title]]) {
      modalBody.innerHTML = `<p class="note-text">${cityNotes[NOTE_MODALS[title]]}</p>`;
      if (title === "Safety notes") {
        modalBody.innerHTML += voteWidgetHTML({type:"safety_note", id:`${c.city}:note`, city:c.city, extraClass:"csnap-vote"});
        if (window.NRA_VOTES) NRA_VOTES.mountAll(modalBody);
      }
    } else if (SCORE_GUIDES[title]) {
      modalBody.innerHTML = buildScoreGuideModal(SCORE_GUIDES[title], SCORE_CURRENT[title]);
    } else if (title === "Laundry") {
      modalBody.innerHTML = buildLaundryModal();
    } else if (title === "Find laundry & gyms") {
      modalBody.innerHTML = buildFindModal();
      flInit();
    } else if (title === "Taxi tips & info") {
      modalBody.innerHTML = buildTaxiTipModal();
    } else if (title === "Common phrases") {
      modalBody.innerHTML = buildPhrasesModal();
    } else if (title === "Local food & drink") {
      if (typeof CITY_FOOD !== "undefined") {
        modalBody.innerHTML = buildFoodModal();
      } else {
        modalBody.innerHTML = `<p class="modal-placeholder">Loading local food picks…</p>`;
        const forCity = c.city;
        loadFoodData()
          .then(() => { if (!modal.hidden && modalTitle.textContent === `${title} — ${forCity}`) modalBody.innerHTML = buildFoodModal(); })
          .catch(() => { if (!modal.hidden) modalBody.innerHTML = `<p class="modal-placeholder">Couldn't load the food recommendations. Please check your connection and try again.</p>`; });
      }
    } else if (title === "Car rental") {
      modalBody.innerHTML = buildCarModal();
    } else if (title === "Bike & scooter share") {
      if (window.NRA_MICRO) {
        modalBody.innerHTML = buildMicroModal();
      } else {
        modalBody.innerHTML = `<p class="modal-placeholder">Loading shared bikes &amp; scooters…</p>`;
        const forCity = c.city;
        loadMicroData()
          .then(() => { if (!modal.hidden && modalTitle.textContent === `${title} — ${forCity}`) modalBody.innerHTML = buildMicroModal(); })
          .catch(() => { if (!modal.hidden) modalBody.innerHTML = `<p class="modal-placeholder">Couldn't load the bike &amp; scooter options. Please check your connection and try again.</p>`; });
      }
    } else {
      // Placeholder content — detailed info to be filled in later.
      modalBody.innerHTML = `<p class="modal-placeholder">More information about ${title.toLowerCase()} in ${c.city} is coming soon.</p>`;
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  // Open on card click (event delegation — survives re-renders)
  const transportEl = document.getElementById("transport-cards");
  if (transportEl) {
    // Prefetch the lazy-loaded route data as soon as a train/bus/ferry card is hovered
    transportEl.addEventListener("mouseover", e => {
      const card = e.target.closest(".tcard");
      const info = card && card.dataset.info;
      if (info === "Major train stations" || info === "Major bus stations" || info === "Ferry / boat ports") loadRoutesData().catch(() => {});
    });
    /* "Licence from" dropdown on the Car rental card: remembered in this browser, re-renders only its own block */
    transportEl.addEventListener("change", e => {
      if (!e.target.classList.contains("car-lic-sel")) return;
      try { e.target.value ? localStorage.setItem("nra_licence_country", e.target.value) : localStorage.removeItem("nra_licence_country"); } catch(err){}
      const box = e.target.closest(".car-permit");
      if (box){ box.innerHTML = permitBlockHTML(); const s = box.querySelector(".car-lic-sel"); if (s) s.focus();
                const pi = box.querySelector(".car-permit-info"); if (pi) pi.setAttribute("aria-expanded", box.classList.contains("show-src") ? "true" : "false"); }
    });
    transportEl.addEventListener("click", e => {
      const pi = e.target.closest(".car-permit-info");
      if (pi){ const box = pi.closest(".car-permit"); if (box){ box.classList.toggle("show-src"); pi.setAttribute("aria-expanded", box.classList.contains("show-src") ? "true" : "false"); } return; }
      if (e.target.closest("a, select, label")) return;   // links and the licence dropdown never open the card's popup
      const card = e.target.closest(".tcard");
      if (card && card.dataset.info) openModal(card.dataset.info);
    });
    transportEl.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target.closest("a, button, select")) return;
      const card = e.target.closest(".tcard");
      if (card && card.dataset.info) { e.preventDefault(); openModal(card.dataset.info); }
    });
  }

  /* ---------- "Bikes & scooters" button inside the transit card ---------- */
  if (transitEl) {
    transitEl.addEventListener("mouseover", e => {
      if (e.target.closest("#micro-open-btn")) loadMicroData().catch(() => {});
    });
    transitEl.addEventListener("click", e => {
      if (e.target.closest("#micro-open-btn")) openModal("Bike & scooter share");
    });
  }

  // Dismiss: X button, backdrop click, or Escape
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---------- ATM & cash finder button ---------- */
  const atmBtn = document.getElementById("atm-btn");
  if (atmBtn) atmBtn.addEventListener("click", () => openModal("ATM & cash finder"));

  /* ---------- Common phrases button ---------- */
  const phrasesBtn = document.getElementById("phrases-open-btn");
  if (phrasesBtn) phrasesBtn.addEventListener("click", () => openModal("Common phrases"));

  /* ---------- Landmarks map (MapLibre + Carto voyager basemap, same as choose.html) ----------
     Called by loadLmkDtData() once the lazy-loaded landmark data has arrived
     and the section HTML is in place (it used to run immediately). */
  function initLmkMap(){
    const mapEl = document.getElementById("lmk-map");
    if (!mapEl || typeof mapboxgl === "undefined" || !lmkCoords.length) return;
    mapboxgl.accessToken = "pk.eyJ1IjoiamN3MSIsImEiOiJjbXM4bHZpeDAwZ2NuMzRwdzRkaXMwcTh6In0.UJ9Own0tf4u44udZNw3vLQ";
    const first = lmkCoords.find(p => p && p.lat != null) || {lat:0, lng:0};
    const lmkMap = new mapboxgl.Map({
      container: "lmk-map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [first.lng, first.lat], zoom: 12,
      attributionControl: true
    });
    lmkMap.addControl(new mapboxgl.NavigationControl({ showCompass:false }), "top-right");

    const pins = [];
    const bounds = new mapboxgl.LngLatBounds();
    lmkCoords.forEach((p, i) => {
      if (!p || p.lat == null || p.lng == null) return;
      const el = document.createElement("div");
      el.className = "lmk-pin";
      el.textContent = i + 1;
      el.title = lmks[i][0];
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(lmkMap);
      pins[i] = { el, marker };
      bounds.extend([p.lng, p.lat]);
      el.addEventListener("mouseenter", () => { if (isTouch()) return; setActiveLmk(i); showBig(i); });
      el.addEventListener("mouseleave", () => { if (isTouch()) return; setActiveLmk(null); hideBig(); });
      el.addEventListener("click", ev => { ev.stopPropagation(); if (isTouch()) liftCard(i); });
    });
    lmkMap.on("load", () => {
      if (lmkCoords.length > 1) lmkMap.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 0 });
    });

    const expandEl = document.getElementById("lmk-expand");
    /* The expanded card is the source of truth for which pin is lit. */
    document.addEventListener("lmk:focus", e => {
      let i = e.detail && e.detail.idx;
      /* Phones: a pin is always lit, the one for the card in view (pin 1 on load, and again after a card is closed; Jeff, 2026-09-24). */
      if (typeof i !== "number" && SWIPE_PHONE.matches && lmkHint && gridElL) {
        const card = gridElL.children[lmkHint.update()];
        if (card) i = Number(card.dataset.lmkIdx);
      }
      setActiveLmk(typeof i === "number" ? i : null);
    });
    /* Phones: the card the landmark row settles on (arrow, swipe or pin) lights its pin and brings the map to it,
       as hovering a card does on desktop (Jeff, 2026-09-24). */
    document.addEventListener("lmk:slide", e => {
      const i = e.detail && e.detail.idx;
      const p = typeof i === "number" ? lmkCoords[i] : null;
      setActiveLmk(typeof i === "number" ? i : null);
      if (p && p.lat != null) lmkMap.flyTo({ center: [p.lng, p.lat], zoom: Math.max(lmkMap.getZoom(), 14), speed: 1.2, curve: 1.4, essential: true });
    });

    function setActiveLmk(i) {
      pins.forEach((p, idx) => { if (p) p.el.classList.toggle("is-active", idx === i); });
      document.querySelectorAll(".lmk-card").forEach(card => {
        card.classList.toggle("is-active", Number(card.dataset.lmkIdx) === i);
      });
    }

    /* --- Pin -> card preview. Desktop: big floating card. Mobile: lift card to top. --- */
    const cardsColEl = document.querySelector(".lmk-cards-col");
    const bigEl = document.getElementById("lmk-big");
    const gridElL = document.querySelector(".lmk-grid");
    const lmkOrder = gridElL ? Array.prototype.slice.call(gridElL.children) : [];
    let bigTimer = null, liftedIdx = null;
    const isTouch = () => window.matchMedia("(hover:none), (max-width:860px)").matches;

    function showBig(i) {
      if (!bigEl || !cardsColEl || !lmks[i]) return;
      const ph = lmkPhotos[i];
      bigEl.innerHTML =
        (ph ? `<div class="lmk-big-photo" role="img" aria-label="${String(lmks[i][0]).replace(/"/g,'&quot;')}" style="background-image:url('${ph.img}')"></div>` : "") +
        `<div class="lmk-big-body"><div class="lmk-big-row"><div class="lmk-big-num">${i + 1}</div>` +
        `<div><span class="lmk-big-name">${lmks[i][0]}</span>` +
        `<p class="lmk-big-desc">${lmks[i][1]}</p></div></div></div>`;
      clearTimeout(bigTimer);
      bigEl.hidden = false;
      const col = cardsColEl.getBoundingClientRect();
      const w = Math.min(460, col.width);
      bigEl.style.left = (col.left + (col.width - w) / 2) + "px";
      bigEl.style.width = w + "px";
      const mr = mapEl.getBoundingClientRect();
      bigEl.style.top = Math.max(12, Math.min(mr.top + 24, window.innerHeight - 440)) + "px";
      requestAnimationFrame(() => bigEl.classList.add("is-open"));
    }
    function hideBig() {
      if (!bigEl || bigEl.hidden) return;
      bigEl.classList.remove("is-open");
      clearTimeout(bigTimer);
      bigTimer = setTimeout(() => { bigEl.hidden = true; }, 200);
    }
    function restoreLmkOrder() {
      if (liftedIdx == null || !gridElL) return;
      gridElL.querySelectorAll(".lmk-card.is-lifted").forEach(el => el.classList.remove("is-lifted"));
      lmkOrder.forEach(el => gridElL.appendChild(el));
      liftedIdx = null;
    }
    function liftCard(i) {
      if (!gridElL) return;
      /* Phones: the cards are a sideways row, so the pin scrolls the row to its card instead of moving it. */
      if (SWIPE_PHONE.matches && lmkHint) {
        restoreLmkOrder();
        const card = gridElL.querySelector('.lmk-card[data-lmk-idx="' + i + '"]');
        if (!card) return;
        lmkHint.goTo(lmkOrder.indexOf(card));
        setActiveLmk(i);
        gridElL.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      if (liftedIdx === i) { restoreLmkOrder(); setActiveLmk(null); return; }
      restoreLmkOrder();
      const card = gridElL.querySelector('.lmk-card[data-lmk-idx="' + i + '"]');
      if (!card) return;
      gridElL.insertBefore(card, gridElL.firstChild);
      card.classList.add("is-lifted");
      liftedIdx = i;
      setActiveLmk(i);
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    lmkMap.on("movestart", hideBig);
    window.addEventListener("scroll", hideBig, { passive: true });

    const cardsEl = document.querySelector(".lmk-grid");
    if (cardsEl) {
      cardsEl.addEventListener("mouseover", e => {
        const card = e.target.closest(".lmk-card");
        if (!card) return;
        const idx = Number(card.dataset.lmkIdx);
        const p = lmkCoords[idx];
        if (!p || p.lat == null) return;
        setActiveLmk(idx);
        lmkMap.flyTo({ center: [p.lng, p.lat], zoom: Math.max(lmkMap.getZoom(), 14), speed: 1.2, curve: 1.4, essential: true });
      });
      cardsEl.addEventListener("mouseout", e => {
        const card = e.target.closest(".lmk-card");
        /* The expanded panel covers the card, which fires mouseout with the
           panel as relatedTarget; that must not clear the pin it just lit. */
        const panelOpen = expandEl && !expandEl.hidden;
        if (card && !cardsEl.contains(e.relatedTarget) && !panelOpen) setActiveLmk(null);
      });
    }
    setTimeout(() => lmkMap.resize(), 60);
  }

  /* ---------- Contribute-a-photo form (landmarks with no image yet) ----------
     Opened from the "Contribute Image" button on the coming-soon placeholder.
     The dialog itself lives in contribute-photo.js so that the city hero,
     neighborhood heroes and food dishes can raise the same form; all this
     does is tell it which photo slot the button belongs to. */
  function openContribForm(idx){
    const l = lmks[idx];
    if (!l || !window.NRA_PHOTO_CONTRIB) return;
    NRA_PHOTO_CONTRIB.open({
      kind: "landmark", subject: l[0], subjectIdx: idx,
      city: c.city, country: c.country
    });
  }

  /* The same invitation on the site's other photo slots — the city hero, each
     neighborhood hero, and every dish in the food modal. One delegated handler
     covers them all, including the ones rendered after this runs. Each button
     carries its own slot and subject, so the form's title field always names
     the photo the visitor is actually replacing. */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-contrib-kind]");
    if (!b || !window.NRA_PHOTO_CONTRIB) return;
    e.preventDefault(); e.stopPropagation();
    NRA_PHOTO_CONTRIB.open({
      kind: b.dataset.contribKind,
      subject: b.dataset.contribSubject,
      subjectIdx: b.dataset.contribIdx ? Number(b.dataset.contribIdx) : null,
      city: c.city, country: c.country
    });
  });

  /* "Suggest a place" at the bottom of each neighborhood card: the form's dropdown offers that card's own
     listings (the lodging tiers, or the eat / coffee / drink kinds; an alcohol-free hood offers its own kinds). */
  const DRY_BAR_KINDS = ["cafe", "hangout", "mocktail"];
  document.addEventListener("click", e => {
    const b = e.target.closest(".hood-suggest");
    if (!b || !window.NRA_SUGGEST) return;
    const i = Number(b.dataset.hoodIdx), section = b.dataset.suggest;
    const fromMeta = meta => Object.keys(meta).map(k => ({ k, label: meta[k].label }));
    const kinds = section === "stay" ? LODGE_TIERS.map(t => ({ k: t.k, label: t.label }))
      : section === "eat" ? fromMeta(EAT_KIND_META)
      : section === "cafes" ? fromMeta(CAFE_KIND_META)
      : fromMeta(BAR_KIND_META).filter(o => b.dataset.dry ? DRY_BAR_KINDS.includes(o.k) : !DRY_BAR_KINDS.includes(o.k));
    NRA_SUGGEST.open({ city: c.city, hoodIdx: i, hoodName: (CITY_HOODS[c.city] || [])[i], section,
      title: b.textContent.replace(/^\+\s*/, ""), kinds });
  });

  /* "Suggest a day trip" under "No day trips available" opens suggest-daytrip.js's form. */
  document.addEventListener("click", e => {
    if (!e.target.closest(".dt-suggest-btn") || !window.NRA_SUGGEST_TRIP) return;
    NRA_SUGGEST_TRIP.open({ city: c.city });
  });
  /* "Suggest a landmark" under the landmarks opens the same form in landmark mode. */
  document.addEventListener("click", e => {
    if (!e.target.closest(".lmk-suggest-btn") || !window.NRA_SUGGEST_TRIP) return;
    NRA_SUGGEST_TRIP.open({ city: c.city, kind: "landmark" });
  });

  /* "From Roamers" Show / Hide: one choice for every group on the page, remembered in this browser. */
  document.addEventListener("click", e => {
    const t = e.target.closest(".roamer-toggle");
    if (!t) return;
    const hide = t.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".roamer-toggle").forEach(b => { b.textContent = hide ? "Show" : "Hide"; b.setAttribute("aria-expanded", hide ? "false" : "true"); });
    document.querySelectorAll(".roamer-picks-body").forEach(d => { d.hidden = hide; });
    try { localStorage.setItem("nra_roamer_picks", hide ? "hide" : "show"); } catch (err) {}
  });

  /* Member credits on Roamer picks: fetch the public profiles (public_profiles view: display name and
     picture only) for every `by` id on the page and fill the placeholders. Quiet when accounts are unavailable. */
  (async function paintRoamerCredits(){
    const links = [...document.querySelectorAll(".pick-by[data-roamer]")];
    if (!links.length) return;
    const ids = [...new Set(links.map(a => a.dataset.roamer))];
    const sb = await new Promise(resolve => {
      let tries = 0;
      (function poll(){
        if (window.NRA_AUTH && window.NRA_AUTH.enabled){
          Promise.resolve(window.NRA_AUTH.ready && window.NRA_AUTH.ready())
            .then(() => resolve(window.NRA_AUTH.client ? window.NRA_AUTH.client() : null)).catch(() => resolve(null));
          return;
        }
        if (tries++ > 100){ resolve(null); return; }
        setTimeout(poll, 100);
      })();
    });
    if (!sb) return;
    const { data, error } = await sb.from("public_profiles").select("id,display_name,avatar_url").in("id", ids);
    if (error || !data) return;
    const byId = Object.fromEntries(data.map(p => [p.id, p]));
    links.forEach(a => {
      const p = byId[a.dataset.roamer]; if (!p) return;
      const name = p.display_name || "Roamer";
      const av = a.querySelector(".pick-by-av"), nm = a.querySelector(".pick-by-name");
      if (av && p.avatar_url) { av.style.backgroundImage = `url('${String(p.avatar_url).replace(/'/g, "%27")}')`; av.textContent = ""; }
      else if (av) av.textContent = name.trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "R";
      if (nm) nm.textContent = name;
      a.title = `Suggested by ${name}. See their profile`;
    });
  })();

  /* ---------- Landmark card -> expanded panel covering the card grid ----------
     Click (or tap) a card to open it; clicking the same card again closes it.
     Also closes on the X, Escape, or a click outside the column. */
  function initLmkCardExpand(){
    const colEl  = document.querySelector(".lmk-cards-col");
    const gridEl = document.querySelector(".lmk-grid");
    const panel  = document.getElementById("lmk-expand");
    if (!colEl || !gridEl || !panel) return;
    const esc = t => String(t).replace(/[<>&"]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]));
    let openIdx = null, closeTimer = null;

    function openExpand(i){
      const l = lmks[i];
      if (!l) return;
      openIdx = i;
      const ph = lmkPhotos[i];
      const p  = lmkCoords[i];
      const mapHref = p ? `https://www.google.com/maps/search/${encodeURIComponent(l[0])}/@${p.lat},${p.lng},16z`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l[0] + ' ' + c.city)}`;
      const credit = creditHTML(ph, 'lmk-photo-credit');
      panel.innerHTML =
        `<button type="button" class="lmk-expand-close" aria-label="Close">&times;</button>` +
        ((ph && ph.img) ? `<div class="lmk-expand-photo"><img class="lmk-expand-img" src="${ph.img}" alt="${esc(l[0])}" loading="lazy">${credit}</div>`
            : `<div class="lmk-expand-photo lmk-expand-soon"><img class="lmk-expand-img" src="images/landmark-coming-soon.svg" alt="Image coming soon">` +
              `<div class="lmk-contrib"><p class="lmk-contrib-lead">Have an image of this landmark that you would like to contribute to the site?</p>` +
              `<button type="button" class="lmk-contrib-btn" data-contrib-idx="${i}">Contribute Image</button></div></div>`) +
        `<div class="lmk-expand-body"><div class="lmk-expand-row"><div class="lmk-expand-num">${i + 1}</div>` +
        `<div><a class="lmk-expand-name" href="${mapHref}" target="_blank" rel="noopener">${l[0]}</a>` +
        `<p class="lmk-expand-desc">${l[1]}</p></div></div></div>`;
      clearTimeout(closeTimer);
      panel.hidden = false;
      gridEl.classList.add("is-muted");
      /* Sit at the top of whatever part of the column is on screen. */
      const col = colEl.getBoundingClientRect();
      panel.style.top = Math.max(0, Math.round(80 - col.top)) + "px";
      panel.scrollTop = 0;
      panel.classList.remove("is-portrait");
      panel.style.removeProperty("--lmk-photo-h");
      const pim = panel.querySelector(".lmk-expand-img");
      if (pim) {
        const orient = () => {
          const nw = pim.naturalWidth, nh = pim.naturalHeight;
          if (!nw || nh / nw <= 1.05) return;
          panel.classList.add("is-portrait");
          /* Photo height drives the panel height; width follows from the ratio
             (the grid column is auto), capped so the text keeps a readable
             column and the whole panel still fits on screen. */
          const r = nw / nh;
          let h = Math.min(560, Math.round(window.innerHeight * 0.66));
          const capW = Math.round(panel.clientWidth * 0.62);
          if (h * r > capW) h = Math.round(capW / r);
          panel.style.setProperty("--lmk-photo-h", Math.max(280, h) + "px");
        };
        if (pim.complete) orient(); else pim.addEventListener("load", orient, {once:true});
      }
      requestAnimationFrame(() => panel.classList.add("is-open"));
      /* Phones: the row is one card tall, so the column grows to hold the opened card rather than it covering the day trips. */
      const fitCol = () => { colEl.style.minHeight = SWIPE_PHONE.matches ? (panel.offsetTop + panel.offsetHeight) + "px" : ""; };
      fitCol();
      if (pim && !pim.complete) pim.addEventListener("load", fitCol, {once:true});
      document.dispatchEvent(new CustomEvent("lmk:focus", {detail:{idx:i}}));
    }
    function closeExpand(){
      if (panel.hidden) return;
      openIdx = null;
      document.dispatchEvent(new CustomEvent("lmk:focus", {detail:{idx:null}}));
      panel.classList.remove("is-open");
      gridEl.classList.remove("is-muted");
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => { panel.hidden = true; panel.innerHTML = ""; colEl.style.minHeight = ""; }, 200);
    }

    gridEl.addEventListener("click", e => {
      const soon = e.target.closest(".lmk-soon-btn");
      if (soon) { e.preventDefault(); e.stopPropagation(); openContribForm(Number(soon.dataset.contribIdx)); return; }
      if (e.target.closest("a")) return; // let the map / credit links work
      const card = e.target.closest(".lmk-card");
      if (!card) return;
      const i = Number(card.dataset.lmkIdx);
      if (i === openIdx) closeExpand(); else openExpand(i);
    });
    panel.addEventListener("click", e => {
      const cb = e.target.closest(".lmk-contrib-btn");
      if (cb) { e.preventDefault(); e.stopPropagation(); openContribForm(Number(cb.dataset.contribIdx)); return; }
      if (e.target.closest(".lmk-expand-close")) { e.preventDefault(); closeExpand(); }
    });
    document.addEventListener("click", e => {
      if (panel.hidden || colEl.contains(e.target)) return;
      closeExpand();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeExpand(); });
  }

  /* ---------- Lazy loading of landmark & day-trip data (~4 MB combined) ----------
     These files cover every city on the site, so instead of blocking the page
     they are fetched when the visitor scrolls within ~1200px of the Landmarks
     section; the section then renders and the pin map starts up. */
  function loadScriptOnce(src){
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(src + " failed to load"));
      document.head.appendChild(s);
    });
  }
  function loadCssOnce(href){
    return new Promise((resolve) => {
      if (document.querySelector(`link[href="${href}"]`)) return resolve();
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.onload = resolve;
      l.onerror = resolve; // missing styling shouldn't block the section
      document.head.appendChild(l);
    });
  }
  let lmkDtStarted = false;
  function loadLmkDtData(){
    if (lmkDtStarted) return; lmkDtStarted = true;
    const need = [
      // The map library is only needed for this section's pin map
      loadScriptOnce("vendor/mapbox-gl-3.7.0.js"),
      loadCssOnce("vendor/mapbox-gl-3.7.0.css")
    ];
    // Landmark/day-trip data normally arrives inside citydata/<slug>.json;
    // only fall back to the full catalog files if it wasn't there.
    if (!window.NRA_LANDMARKS) need.push(
      loadScriptOnce("city-landmarks.js"),
      loadScriptOnce("city-landmark-coords.js"),
      loadScriptOnce("city-landmark-photos.js"),
      loadScriptOnce("day-trips.js")
    );
    Promise.all(need).then(() => {
      dt = (window.NRA_DAYTRIPS || {})[c.city];
      lmks = (window.NRA_LANDMARKS && NRA_LANDMARKS[c.city]) || [];
      lmkCoords = (window.NRA_LANDMARK_COORDS && NRA_LANDMARK_COORDS[c.city]) || [];
      lmkPhotos = (window.NRA_LANDMARK_PHOTOS && NRA_LANDMARK_PHOTOS[c.city]) || [];
      const lmkBody = document.getElementById("lmk-section-body");
      const landmarksHTML = buildLandmarksHTML();
      if (lmkBody) lmkBody.innerHTML = landmarksHTML ? `<p class="hood-intro">An overview of ${lmks.length} popular landmarks and sights worth a visit while in ${c.city} — hover a card to find it on the map, click one for the full photo and details, or hover a pin (tap on mobile) to see that landmark. Star rating indicates a CAN'T miss place.</p>
      <div class="lmk-layout">
        <div class="lmk-map-col"><div id="lmk-map" class="lmk-map"></div></div>
        ${landmarksHTML}
      </div>` : `<p class="hood-intro">Landmark picks for ${c.city} are coming soon.</p>`;
      /* "Suggest a landmark" under every city's landmarks (Jeff, 2026-10-02; suggest-daytrip.js, landmark mode). */
      if (lmkBody) lmkBody.insertAdjacentHTML("beforeend", `<div class="dt-suggest lmk-suggest"><p class="dt-suggest-hint">Know a sight in ${c.city} we should feature?</p>
          <button type="button" class="hood-suggest lmk-suggest-btn">+ Suggest a landmark</button></div>`);
      const dtBody = document.getElementById("daytrips-section-body");
      const dayTripsHTML = buildDayTripsHTML();
      /* No day trips: say so, and invite one (Jeff, 2026-09-30; suggest-daytrip.js). */
      if (dtBody) dtBody.innerHTML = dayTripsHTML || `<p class="hood-intro">No day trips available</p>
        <div class="dt-suggest"><p class="dt-suggest-hint">Have a day trip to suggest?</p>
          <button type="button" class="hood-suggest dt-suggest-btn">+ Suggest a day trip</button></div>`;
      const lmkGridEl = lmkBody && lmkBody.querySelector(".lmk-grid");
      if (lmkGridEl) lmkHint = initSwipeHint(lmkGridEl, "landmark", ".lmk-name", j => {
        const card = lmkGridEl.children[j];
        if (SWIPE_PHONE.matches && card) document.dispatchEvent(new CustomEvent("lmk:slide", {detail:{idx: Number(card.dataset.lmkIdx)}}));
      });
      if (dtBody) dtBody.querySelectorAll(".daytrip-grid").forEach(g => initSwipeHint(g, "day trip", ".dtcard-name"));
      initLmkMap();
      initLmkCardExpand();
      if (lmkGridEl) document.dispatchEvent(new CustomEvent("lmk:focus", {detail:{idx:null}}));   // phones: light the pin of the card in view
      /* Both bodies are filled once, lazily, right here — mount their vote
         widgets (landmark cards + stars, day-trip cards) now that they exist. */
      if (window.NRA_VOTES){ if (lmkBody) NRA_VOTES.mountAll(lmkBody); if (dtBody) NRA_VOTES.mountAll(dtBody); }
    }).catch(err => {
      console.warn(err);
      lmkDtStarted = false; // allow a retry on the next scroll/interaction
      const lmkBody = document.getElementById("lmk-section-body");
      if (lmkBody) lmkBody.innerHTML = `<p class="hood-intro">Couldn't load the landmark picks — please check your connection and reload the page.</p>`;
      const dtBody = document.getElementById("daytrips-section-body");
      if (dtBody) dtBody.innerHTML = `<p class="hood-intro">Couldn't load the day trip picks — please check your connection and reload the page.</p>`;
    });
  }
  (function watchLmkSection(){
    const target = document.getElementById("lmk-section-body");
    if (!target) return;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(en => en.isIntersecting)) { io.disconnect(); loadLmkDtData(); }
      }, { rootMargin: "1200px 0px" });
      io.observe(target);
    } else { loadLmkDtData(); }
  })();

  /* ---------- Cost currency toggle (static element, bound once) ---------- */
  const costCurrencyToggle = document.getElementById("cost-currency-toggle");
  if (costCurrencyToggle) costCurrencyToggle.addEventListener("change", () => { showCostsInChosen = costCurrencyToggle.checked; renderCosts(); });

  /* ---------- Taxi tips / info button (delegated — cost cards re-render) ---------- */
  const costCardsEl = document.getElementById("cost-cards");
  if (costCardsEl) costCardsEl.addEventListener("click", e => {
    if (e.target.closest(".find-lg-btn")) return openModal("Find laundry & gyms");
    if (e.target.closest(".taxi-tip-btn")) openModal("Taxi tips & info");
  });

  /* ---------- Embassy finder ---------- */
  const embSel  = document.getElementById("embassy-sel");
  const embLink = document.getElementById("embassy-link");
  const embHint = document.getElementById("embassy-hint");
  if (embSel) {
    const embMatch = typed => EMBASSY_COUNTRIES.find(cc => cc.toLowerCase() === typed.trim().toLowerCase());
    const embUpdate = () => {
      const country = embMatch(embSel.value);
      if (!country) {
        embLink.hidden = true;
        if (embHint) embHint.hidden = false;
        return;
      }
      const q = encodeURIComponent(`${country} embassy or consulate in ${c.city}`);
      embLink.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
      embLink.textContent = `Nearest ${country} embassy on Google Maps →`;
      embLink.hidden = false;
      if (embHint) embHint.hidden = true;
    };
    embSel.addEventListener("input", embUpdate);
    embSel.addEventListener("change", embUpdate);
    /* your own embassy: filled in from the passports on your profile (Jeff, 2026-09-23) */
    const embFromProfile = () => {
      if (embSel.value) return;
      const hit = myPassports().map(embMatch).find(Boolean);
      if (hit){ embSel.value = hit; embUpdate(); }
    };
    embFromProfile();
    window.addEventListener("load", () => {
      embFromProfile();
      if (window.NRA_AUTH && NRA_AUTH.onChange) NRA_AUTH.onChange(embFromProfile);
    });
  }

  /* Referenced from onclick/onmouseenter attributes in generated HTML, so they
     must stay reachable as globals now that this code runs inside a function. */
  window.openModal = openModal;
  window.showFoodPlaces = showFoodPlaces;
  window.loadFoodData = loadFoodData;
  /* deeplink.js: an approval link to a landmark or day trip loads that section without waiting for a scroll */
  window.loadLmkDtData = loadLmkDtData;
}
}); /* end of loadCityData().then(...) render wrapper */

/* ---------- Floating "Back to top" button (works on every state of this page) ---------- */
(function(){
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  const toggle = () => btn.classList.toggle("show", window.scrollY > 400);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
