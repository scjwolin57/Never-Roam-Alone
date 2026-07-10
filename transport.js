/* =====================================================================
   TRANSPORT.JS — "best way to get there" engine for the Destination
   Finder. Compares plane / train / bus / car / boat between an origin
   and a destination.

   How prices work (per the project's honesty rule):
     • Plane  – live prices come from the existing SerpApi flight proxy
                when the site is deployed; otherwise a distance-based
                estimate, clearly labeled "est."
     • Car    – estimate: average rental/day + average fuel × distance
     • Train / Bus – distance-based estimates using typical per-km
                fares for the region; when the Transitous route service
                answers (prototype only — non-commercial use), the
                travel time is upgraded to a real scheduled route.
     • Boat   – only offered on short coastal hops, labeled estimate.

   Modes that are physically impossible (an ocean in the way, or too
   far to drive) are excluded via each place's landmass "region".
   ===================================================================== */

window.NRA_TRANSPORT = (function(){

  /* ---- geography ---- */
  function distKm(a, b){
    const R = 6371, rad = Math.PI/180;
    const dLat = (b.lat-a.lat)*rad, dLng = (b.lng-a.lng)*rad;
    const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLng/2)**2;
    return 2*R*Math.asin(Math.sqrt(s));
  }

  /* country -> landmass region (same landmass = ground travel possible) */
  const COUNTRY_REGION = {
    // Europe + mainland Asia + Middle East ("eurasia" — connected by land/tunnel)
    "United Kingdom":"eurasia","France":"eurasia","Spain":"eurasia","Portugal":"eurasia","Germany":"eurasia",
    "Italy":"eurasia","Netherlands":"eurasia","Belgium":"eurasia","Austria":"eurasia","Czechia":"eurasia",
    "Czech Republic":"eurasia","Poland":"eurasia","Hungary":"eurasia","Switzerland":"eurasia","Denmark":"eurasia",
    "Sweden":"eurasia","Norway":"eurasia","Finland":"eurasia","Greece":"eurasia","Turkey":"eurasia","Türkiye":"eurasia",
    "Romania":"eurasia","Bulgaria":"eurasia","Croatia":"eurasia","Serbia":"eurasia","Slovakia":"eurasia",
    "Slovenia":"eurasia","Ukraine":"eurasia","Russia":"eurasia","Ireland":"eurasia","Luxembourg":"eurasia",
    "China":"eurasia","China (SAR)":"eurasia","Hong Kong":"eurasia","Macau":"eurasia","Thailand":"eurasia",
    "Malaysia":"eurasia","Singapore":"eurasia","Vietnam":"eurasia","Cambodia":"eurasia","Laos":"eurasia",
    "Myanmar":"eurasia","India":"eurasia","Nepal":"eurasia","Bangladesh":"eurasia","Pakistan":"eurasia",
    "Iran":"eurasia","Iraq":"eurasia","United Arab Emirates":"eurasia","Saudi Arabia":"eurasia","Qatar":"eurasia",
    "Oman":"eurasia","Kuwait":"eurasia","Bahrain":"eurasia","Jordan":"eurasia","Israel":"eurasia","Lebanon":"eurasia",
    "Kazakhstan":"eurasia","Uzbekistan":"eurasia","Georgia":"eurasia","Armenia":"eurasia","Azerbaijan":"eurasia",
    "UAE":"eurasia","Estonia":"eurasia","Latvia":"eurasia","Lithuania":"eurasia",
    // North & Central America
    "United States":"n-america","Canada":"n-america","Mexico":"n-america","Guatemala":"n-america",
    "Belize":"n-america","Honduras":"n-america","El Salvador":"n-america","Nicaragua":"n-america",
    "Costa Rica":"n-america","Panama":"n-america",
    // South America
    "Brazil":"s-america","Argentina":"s-america","Chile":"s-america","Peru":"s-america","Colombia":"s-america",
    "Uruguay":"s-america","Paraguay":"s-america","Bolivia":"s-america","Ecuador":"s-america","Venezuela":"s-america",
    // Africa
    "South Africa":"africa","Morocco":"africa","Egypt":"africa","Kenya":"africa","Tanzania":"africa",
    "Nigeria":"africa","Ghana":"africa","Ethiopia":"africa","Tunisia":"africa","Algeria":"africa",
    "Namibia":"africa","Botswana":"africa","Zimbabwe":"africa","Zambia":"africa","Mozambique":"africa",
    "Uganda":"africa","Senegal":"africa",
    // Islands / isolated (each its own landmass)
    "Japan":"japan","South Korea":"korea","Korea":"korea","Australia":"oceania","New Zealand":"nz",
    "Iceland":"iceland","Philippines":"philippines","Indonesia":"indonesia","Taiwan":"taiwan",
    "Sri Lanka":"sri-lanka","Cuba":"cuba","Dominican Republic":"hispaniola","Jamaica":"jamaica",
    "Madagascar":"madagascar","Malta":"malta","Cyprus":"cyprus","Fiji":"fiji","Maldives":"maldives",
    "Bahamas":"bahamas","Puerto Rico":"puerto-rico"
  };
  function regionFor(country){ return COUNTRY_REGION[country] || null; }

  /* ---- cost & time estimates (labeled "est." wherever shown) ---- */
  const RATES = {
    trainPerKm: { "eurasia":0.11, "n-america":0.15, "japan":0.16, "korea":0.10, "default":0.12 },
    busPerKm: 0.06,
    boatPerKm: 0.10,
    carRentalPerDay: 45,     // average economy rental
    fuelPer100Km: 8 * 1.60,  // ~8 L/100km × ~$1.60/L average
    planeBase: 60, planePerKm: 0.07
  };
  /* Real roads and rails wind — straight-line distance underestimates
     ground travel. Road ≈25% longer, rail ≈20% longer on average. */
  const ROAD_F = 1.25, RAIL_F = 1.2;
  const MOTEL_NIGHT = 70;   // modest en-route stopover, per night (est.)

  /* Minutes from each featured city's main airport to its city center
     (taken from the airport card on each city guide page). Used to make
     flight times door-to-door. Unknown places fall back to 45 min. */
  const AIRPORT_CENTER_MIN = {
    "Hong Kong":40, "Bangkok":50, "London":58, "Macau":18, "Singapore":25, "Paris":53,
    "Dubai":20, "New York":60, "Kuala Lumpur":53, "Istanbul":58, "Tokyo":38, "Antalya":20,
    "Seoul":75, "Osaka":60, "Rome":45, "Phuket":45, "Barcelona":25, "Amsterdam":25,
    "Milan":50, "Vienna":25, "Prague":30, "Los Angeles":45, "Sydney":25, "Cape Town":25,
    "Rio de Janeiro":38, "Cancún":30, "Marrakech":15, "Madrid":25, "Taipei":50, "Berlin":38,
    "Melbourne":33, "Munich":45, "Las Vegas":15, "Florence":18, "Dublin":33, "Kyoto":105,
    "Lisbon":20, "Venice":20, "Athens":40, "Orlando":25, "Toronto":38, "Miami":18,
    "San Francisco":30, "Shanghai":58, "Frankfurt am Main":20, "Copenhagen":20, "Zurich":20, "Washington, D.C.":20,
    "Pattaya-Chonburi":43, "Vancouver":30, "Stockholm":43, "Mexico City":45, "Oslo":40, "São Paulo":38,
    "Helsinki":35, "Brussels":30, "Budapest":30, "Guangzhou":50, "Nice":20, "Palma de Mallorca":20,
    "Honolulu":25, "Beijing":50, "Warsaw":25, "Seville":20, "Valencia":23, "Shenzhen":45,
    "Doha":20, "Abu Dhabi":35, "Fukuoka":13, "Sapporo":53, "Busan":33, "Edinburgh":28,
    "Montreal":25, "Bologna":25, "Rhodes":25, "Verona":18, "Delhi":33, "Porto":25,
    "Ho Chi Minh City":33, "Buenos Aires":50, "Marne-la-Vallée":43, "Kraków":25, "Heraklion":13, "Johor Bahru":35,
    "Hanoi":38, "Tel Aviv":25, "Sharjah":20, "Thessaloniki":23, "Lima":58, "Medina":25,
    "Tbilisi":35, "Riyadh":40, "Tallinn":13, "Mecca":83, "Denpasar":38, "Punta Cana":30,
    "Santiago":35, "Vilnius":20, "Jerusalem":50, "Zhuhai":60, "Cairo":45
  };
  function centerMin(p){ return (p && p.city && AIRPORT_CENTER_MIN[p.city]) || 45; }
  /* same-country check for the domestic vs international airport buffer */
  const CTRY_ALIAS = { "Türkiye":"Turkey", "UAE":"United Arab Emirates", "Czech Republic":"Czechia" };
  function sameCountry(a,b){ a=CTRY_ALIAS[a]||a; b=CTRY_ALIAS[b]||b; return !!a && !!b && a===b; }

  const fmtH = h => h < 1 ? Math.round(h*60) + "m" : (h >= 24 ? Math.round(h/24*10)/10 + " days" : Math.round(h*10)/10 + "h");

  /* Compare every mode for one origin/destination pair.
     origin: {lat,lng,region}  dest: {lat,lng,region,coastal}
     opts.looseBoat: offer boat on ANY short hop (≤1200 km), not just
     cross-water ones — used by the dedicated Boat search, always
     labeled "if a ferry runs this route".                          */
  function compareModes(origin, dest, opts){
    opts = opts || {};
    const km = distKm(origin, dest);
    const sameLand = origin.region && dest.region && origin.region === dest.region;
    const modes = [];

    // Plane — always an option between cities this far apart.
    // Time is DOOR-TO-DOOR: air time + airport processing (2 h domestic,
    // 3 h international) + the airport↔city-center transfer at both ends.
    if (km > 150){
      const domestic = sameCountry(origin.country, dest.country);
      const groundH  = (domestic ? 2 : 3) + (centerMin(origin) + centerMin(dest))/60;
      modes.push({ mode:"plane", icon:"✈", cost:Math.round(RATES.planeBase + km*RATES.planePerKm),
                   live:false, timeH: km/750 + groundH, door:true, note:"" });
    }
    if (sameLand && km >= 40){
      if (km <= 3500){ // Car — time, fuel and fares use estimated ROAD distance
        const roadKm = km * ROAD_F;
        const days = Math.max(1, Math.ceil(roadKm/650));
        const stops = days - 1;   // nights sleeping en route on a multi-day drive
        modes.push({ mode:"car", icon:"🚗", live:false,
                     cost:Math.round(days*RATES.carRentalPerDay + (roadKm/100)*RATES.fuelPer100Km + stops*MOTEL_NIGHT),
                     timeH: roadKm/85,
                     note: days > 1 ? days + "-day drive (incl. " + stops + " night" + (stops>1?"s":"") + " en route)" : "" });
      }
      if (km <= 3200){ // Train — estimated RAIL distance
        const rate = RATES.trainPerKm[dest.region] || RATES.trainPerKm[origin.region] || RATES.trainPerKm.default;
        modes.push({ mode:"train", icon:"🚆", live:false, cost:Math.round(Math.max(10, km*RAIL_F*rate)), timeH: km*RAIL_F/105, note:"" });
      }
      if (km <= 3000){ // Bus — estimated ROAD distance
        modes.push({ mode:"bus", icon:"🚌", live:false, cost:Math.round(Math.max(8, km*ROAD_F*RATES.busPerKm)), timeH: km*ROAD_F/70, note:"" });
      }
    }
    // Boat — short coastal hops only (real ferry availability varies)
    if ((opts.looseBoat || !sameLand) && km <= 1200 && dest.coastal !== false){
      modes.push({ mode:"boat", icon:"⛴", live:false, cost:Math.round(Math.max(25, km*RATES.boatPerKm)),
                   timeH: km/35, note:"if a ferry runs this route" });
    }

    modes.sort((a,b)=> a.cost - b.cost);   // cheapest workable mode first
    return { km: Math.round(km), modes };
  }

  /* ---- live layer 1: real flight prices via the existing SerpApi proxy ----
     One call per origin returns prices for MANY destinations (1 credit). */
  let flightPrices = null, flightKey = null, flightPromise = null, flightRoundTrip = false;
  function liveFlightPrices(originCode, outboundDate, returnDate){
    if (!originCode) return Promise.resolve(null);
    const roundTrip = !!(outboundDate && returnDate);
    const key = originCode + "|" + (outboundDate || "") + "|" + (returnDate || "");
    if (key === flightKey && flightPromise) return flightPromise;
    flightKey = key;
    let flightsUrl = `/.netlify/functions/flights?departure_id=${encodeURIComponent(originCode)}`;
    if (outboundDate) flightsUrl += `&outbound_date=${encodeURIComponent(outboundDate)}`;
    if (roundTrip)    flightsUrl += `&return_date=${encodeURIComponent(returnDate)}&type=1`;
    flightPromise = fetch(flightsUrl)
      .then(r => { if(!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        flightPrices = {};
        flightRoundTrip = roundTrip;
        (data.destinations || []).forEach(d => {
          if (d.name && d.flight_price != null) flightPrices[d.name.toLowerCase()] = d.flight_price;
        });
        return flightPrices;
      })
      .catch(() => { flightPrices = null; return null; });
    return flightPromise;
  }
  function flightPriceFor(city){
    return flightPrices ? flightPrices[city.toLowerCase()] : undefined;
  }
  function flightsAreRoundTrip(){ return flightRoundTrip; }

  /* ---- live layer 2 (prototype only): real train/bus route check via
     Transitous (community service, non-commercial use). Upgrades the
     estimated time to a real scheduled duration when a route exists. ---- */
  function transitousCheck(origin, dest){
    const url = "https://api.transitous.org/api/v1/plan" +
      `?fromPlace=${origin.lat},${origin.lng}&toPlace=${dest.lat},${dest.lng}&numItineraries=1`;
    const ctl = ("AbortController" in window) ? new AbortController() : null;
    const t = ctl ? setTimeout(()=>ctl.abort(), 7000) : null;
    return fetch(url, ctl ? {signal:ctl.signal} : {})
      .then(r => { if(!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        if (t) clearTimeout(t);
        const it = data && data.itineraries && data.itineraries[0];
        if (!it || !it.duration) return null;
        return { timeH: it.duration/3600 };   // MOTIS v2 durations are in seconds
      })
      .catch(() => { if (t) clearTimeout(t); return null; });
  }

  return { distKm, regionFor, compareModes, liveFlightPrices, flightPriceFor, flightsAreRoundTrip, transitousCheck, fmtH };
})();
