/* =====================================================================
   TRAVEL-STATS.JS — the one place that turns a Roamer's saved travels
   (visited.js lists: places + bucket landmarks) into counts and map pins.
   Used by profile.html (the editor) and roamer.html (the public page) so
   the two always agree.

   Needs, loaded before it: destinations.js (site cities), country-fold.js
   (territories -> parent country), bucketlist.js (landmarks). world-cities.js
   is optional: profile.html loads it; roamer.html gets it on demand only
   when a Roamer has places that are not site cities.

   A saved place is one of:
     • a site city ("Kyoto")                         -> its site country and pin
     • an Other addition ("Nikko, Japan")            -> that country; pin from
       world-cities.js, else one OpenStreetMap (Nominatim) lookup per browser,
       cached in localStorage; no match = counted but no pin (never guessed)
     • older free text ("Bali")                      -> country only if
       world-cities.js has that name in exactly one country; no pin

   Nominatim usage policy: at most one request per second, results cached,
   "© OpenStreetMap contributors" shown wherever such a pin is drawn.
   ===================================================================== */
(function(){
  const norm = s => String(s || "").trim().toLowerCase();
  const byLocale = (a, b) => a.localeCompare(b);

  const PINS = [
    ...((window.NRA_DESTINATIONS || []).map(c => ({ city:c.city, country:c.country, lat:c.lat, lng:c.lng }))),
    ...((window.NRA_UPCOMING || []).map(c => ({ city:c.city, country:c.country, lat:c.lat, lng:c.lng })))
  ];
  const SITE_BY_CITY = new Map(PINS.map(p => [norm(p.city), p]));
  const SITE_COUNTRIES = [...new Set(PINS.map(p => p.country))].sort(byLocale);
  const CITIES_OF = {};
  PINS.forEach(p => (CITIES_OF[p.country] = CITIES_OF[p.country] || []).push(p.city));
  Object.values(CITIES_OF).forEach(list => list.sort(byLocale));
  const fold = c => window.NRA_foldCountry ? NRA_foldCountry(c) : c;
  const TOTAL_COUNTRIES = new Set(SITE_COUNTRIES.map(fold).filter(Boolean)).size;

  // Site country names that differ from world-cities.js's name for the ISO code
  const ISO_EXTRA = {
    "Bonaire":["BQ"], "British Virgin Islands":["VG"], "China (SAR)":["HK","MO"],
    "Democratic Republic of the Congo":["CD"], "DR Congo":["CD"], "Falkland Islands":["FK"],
    "Federated States of Micronesia":["FM"], "Finland (Åland)":["AX"], "Myanmar (Burma)":["MM"],
    "Norway (Svalbard)":["SJ"], "Republic of the Congo":["CG"], "Saint Helena":["SH"],
    "Saint-Barthélemy":["BL"], "Saint-Martin":["MF"], "Sint Maarten":["SX"],
    "St. Kitts and Nevis":["KN"], "São Tomé and Príncipe":["ST"], "The Gambia":["GM"],
    "Turkey":["TR"], "U.S. Virgin Islands":["VI"], "Vatican":["VA"]
  };
  let CODES = null;   // { siteCodes: {country: Set}, codeToSite: {code: country} } once country names are loaded
  function codeMaps(){
    if (CODES || !window.NRA_COUNTRY_NAMES) return CODES;
    const byName = {};
    Object.keys(NRA_COUNTRY_NAMES).forEach(code => { byName[NRA_COUNTRY_NAMES[code]] = code; });
    const siteCodes = {}, codeToSite = {};
    SITE_COUNTRIES.forEach(c => {
      const codes = ISO_EXTRA[c] || (byName[c] ? [byName[c]] : []);
      siteCodes[c] = new Set(codes);
      codes.forEach(code => { if (!codeToSite[code]) codeToSite[code] = c; });
    });
    return (CODES = { siteCodes, codeToSite });
  }
  const codesFor = country => { const m = codeMaps(); return (m && m.siteCodes[country]) || new Set(); };

  let WC_BY_NAME = null;   // city name -> set of ISO codes, built on first use
  function worldCountry(name){
    if (!window.NRA_WORLD_CITIES || !codeMaps()) return null;
    if (!WC_BY_NAME){
      WC_BY_NAME = new Map();
      NRA_WORLD_CITIES.forEach(r => {
        const k = norm(r[0]);
        if (!WC_BY_NAME.has(k)) WC_BY_NAME.set(k, new Set());
        WC_BY_NAME.get(k).add(r[1]);
      });
    }
    const codes = WC_BY_NAME.get(norm(name));
    if (!codes || codes.size !== 1) return null;   // unknown or ambiguous: not counted
    return CODES.codeToSite[[...codes][0]] || null;
  }

  // Site country an Other addition ("City, Country") belongs to, or null
  function additionCountry(place){
    const i = place.lastIndexOf(",");
    if (i <= 0 || SITE_BY_CITY.has(norm(place))) return null;
    const tail = norm(place.slice(i + 1));
    return SITE_COUNTRIES.find(c => norm(c) === tail) || null;
  }
  const additionName = place => place.slice(0, place.lastIndexOf(",")).trim();

  function countryOf(place){
    const site = SITE_BY_CITY.get(norm(place));
    return site ? site.country : (additionCountry(place) || worldCountry(place));
  }
  const countCountries = places => new Set(places.map(countryOf).filter(Boolean).map(fold).filter(Boolean)).size;

  /* ---- OpenStreetMap (Nominatim) cache, per browser ---- */
  const GEO_KEY = "nra_osm_geo_v1", RETRY_MS = 30 * 864e5;
  const cacheKey = (name, country) => norm(name) + "|" + norm(country);
  function readCache(){ try{ return JSON.parse(localStorage.getItem(GEO_KEY)) || {}; }catch(e){ return {}; } }
  function writeCache(c){ try{ localStorage.setItem(GEO_KEY, JSON.stringify(c)); }catch(e){} }

  // Where an Other addition goes on the map: world-cities.js first, then a cached OSM result
  function additionSpot(place){
    const country = additionCountry(place);
    if (!country) return null;
    const name = norm(additionName(place)), codes = codesFor(country);
    const row = window.NRA_WORLD_CITIES && codes.size && NRA_WORLD_CITIES.find(r => codes.has(r[1]) && norm(r[0]) === name);
    if (row) return { city:place, country, lat:row[4], lng:row[5], src:"world" };
    const hit = readCache()[cacheKey(name, country)];
    return hit && hit.lat != null ? { city:place, country, lat:hit.lat, lng:hit.lng, src:"osm" } : null;
  }

  // Green pins for a list of saved places (site cities + located additions)
  function cityPins(places){
    return places.map(p => {
      const site = SITE_BY_CITY.get(norm(p));
      return site ? { city:site.city, country:site.country, lat:site.lat, lng:site.lng, src:"site" } : additionSpot(p);
    }).filter(Boolean);
  }
  // Red pins for saved bucket-list landmark names
  function bucketPins(names){
    const want = new Set(names.map(norm));
    return (window.NRA_BUCKET || []).filter(b => want.has(norm(b.name))).map(b => ({ name:b.name, lat:b.lat, lng:b.lng }));
  }

  // Load world-cities.js on demand (roamer.html), only when a place needs it
  let worldPromise = null;
  function loadWorld(){
    if (window.NRA_WORLD_CITIES) return Promise.resolve();
    if (!worldPromise) worldPromise = new Promise(res => {
      const s = document.createElement("script");
      s.src = "world-cities.js"; s.onload = () => res(); s.onerror = () => res();
      document.head.appendChild(s);
    });
    return worldPromise;
  }

  // One Nominatim request at a time, at least 1.1 s apart, for the whole page
  let queue = Promise.resolve(), lastCall = 0;
  const OK_TYPES = new Set(["city","town","village","hamlet","municipality","suburb","borough","city_district","quarter","neighbourhood","island","locality"]);
  function osmLookup(name, country){
    queue = queue.then(async () => {
      const wait = lastCall + 1100 - Date.now();
      if (wait > 0) await new Promise(r => setTimeout(r, wait));
      lastCall = Date.now();
      const codes = [...codesFor(country)].map(c => c.toLowerCase()).join(",");
      const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=en&q=" +
        encodeURIComponent(name) + (codes ? "&countrycodes=" + codes : "&country=" + encodeURIComponent(country));
      try{
        const res = await fetch(url, { headers:{ "Accept":"application/json" } });
        if (!res.ok) return null;                     // try again on a later visit
        const r = (await res.json())[0];
        return r && OK_TYPES.has(r.addresstype) ? { lat:+r.lat, lng:+r.lon } : { none:true };
      }catch(e){ return null; }
    });
    return queue;
  }

  // Make sure everything that can be placed is placed. Calls onUpdate() when new pins or counts appear.
  async function locate(places, onUpdate){
    const extra = places.filter(p => !SITE_BY_CITY.has(norm(p)));
    if (!extra.length) return;
    if (!window.NRA_WORLD_CITIES){ await loadWorld(); if (onUpdate) onUpdate(); }
    for (const p of extra){
      const country = additionCountry(p);
      if (!country || additionSpot(p)) continue;
      const key = cacheKey(additionName(p), country), cached = readCache()[key];
      if (cached && (cached.lat != null || Date.now() - cached.t < RETRY_MS)) continue;
      const got = await osmLookup(additionName(p), country);
      if (!got) continue;
      const c = readCache(); c[key] = Object.assign({ t:Date.now() }, got); writeCache(c);
      if (got.lat != null && onUpdate) onUpdate();
    }
  }

  window.NRA_TRAVEL = {
    norm, PINS, SITE_COUNTRIES, CITIES_OF, TOTAL_COUNTRIES,
    isSiteCity: p => SITE_BY_CITY.has(norm(p)),
    codesFor, additionCountry, countryOf, countCountries,
    cityPins, bucketPins, locate,
    usesOsm: places => cityPins(places).some(p => p.src === "osm")
  };
})();
