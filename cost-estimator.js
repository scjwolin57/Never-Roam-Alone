/* =====================================================================
   COST-ESTIMATOR.JS — the ONE daily-cost formula for the whole site.

   Used by
     city.html   — the "Daily Cost Estimator" on the cost card (per person)
     choose.html — the Destination Finder's budget math (whole party)

   Both pages call the same function, so the figure a traveler sees on a
   city guide and the one the finder ranks by can never disagree. Do not
   copy this formula anywhere else — load this file and call it.

   Inputs, per city (all live in citydata/<slug>.json and destinations.js):
     cost   = { hotel, meal, taxi }   mid-range hotel/night, sit-down meal,
                                      ~10 km taxi fare, USD
     hotel  = { b, h }                budget and high-end hotel/night, USD
     drinks = { coffee, beer, water } USD; beer may be "notallowed" or
                                      "restricted", which means no alcohol
                                      is added to the estimate

   Formula (USD per day, three tiers b / m / h = budget / mid / high-end):
     rooms       = ceil(travelers / 2)        two people share a room
     room        = hotel rate × rooms         per room, not per person
     meals       = 3 × (1.0 / 1.8 / 3.5) × meal, per person
     taxis       = (1 / 2 / 4) rides × fare   per party: a ride is shared
     coffee+water                             per person
     alcohol     = (1 / 2 / 3) drinks × 1.5 × beer price, per person
                   (on by default; 1.5× covers wine, cocktails, spirits)
     activities  = +10% / +20% / +35% of the core (room+meals+taxis+
                   coffee+water), on by default
     tier badge  = mid figure per person against 110 / 180 / 270

   Assumptions and multipliers are documented in the "Daily cost formula"
   spreadsheet. Changing any of them changes every page at once; that is
   the point.
   ===================================================================== */
window.NRA_COST = (function () {
  const CUTOFFS = [110, 180, 270];
  const DEFAULTS = { travelers: 1, includeAlcohol: true, includeActivities: true, perRoom: 2 };
  const STYLE_KEY = { budget: "b", mid: "m", luxury: "h" };

  function num(v) { return (typeof v === "number" && isFinite(v)) ? v : null; }

  function costTier(mid) {
    if (mid < CUTOFFS[0]) return { n: 1, w: "Budget",    c: "#556B2F" };
    if (mid < CUTOFFS[1]) return { n: 2, w: "Moderate",  c: "#B8860B" };
    if (mid < CUTOFFS[2]) return { n: 3, w: "Pricey",    c: "#C77400" };
    return                       { n: 4, w: "Expensive", c: "#C04020" };
  }

  function alcoholProhibited(c) {
    return !!(c && c.drinks && c.drinks.beer === "notallowed");
  }

  /* Whole-party cost per day in USD: { b, m, h, travelers, rooms }.
     Returns null when the city has no cost data. */
  function dailyTotals(c, opts) {
    const o = Object.assign({}, DEFAULTS, opts || {});
    const cost = c && c.cost;
    if (!cost || num(cost.hotel) == null) return null;
    const travelers = Math.max(1, Math.round(num(o.travelers) || 1));
    const rooms = Math.ceil(travelers / (num(o.perRoom) || 2));
    const hr = c.hotel || {};
    const hotelMid = cost.hotel;
    const hotelB = num(hr.b) != null ? hr.b : hotelMid;
    const hotelH = num(hr.h) != null ? hr.h : hotelMid;
    const meal = num(cost.meal) || 0, taxi = num(cost.taxi) || 0;
    const dr = c.drinks || {};
    const drinksBase = ((num(dr.coffee) || 0) + (num(dr.water) || 0)) * travelers;
    const beer = num(dr.beer);
    const drinkPrice = beer != null ? 1.5 * beer : null;
    const alc = n => (o.includeAlcohol && drinkPrice != null) ? n * drinkPrice * travelers : 0;
    const act = (pct, core) => o.includeActivities ? pct * core : 0;

    const coreB = hotelB * rooms + 3 * 1.0 * meal * travelers + 1 * taxi + drinksBase;
    const coreM = hotelMid * rooms + 3 * 1.8 * meal * travelers + 2 * taxi + drinksBase;
    const coreH = hotelH * rooms + 3 * 3.5 * meal * travelers + 4 * taxi + drinksBase;
    return {
      b: coreB + alc(1) + act(0.10, coreB),
      m: coreM + alc(2) + act(0.20, coreM),
      h: coreH + alc(3) + act(0.35, coreH),
      travelers, rooms
    };
  }

  /* Per-person cost per day: the party total split evenly. */
  function perPerson(c, opts) {
    const t = dailyTotals(c, opts);
    if (!t) return null;
    return { b: t.b / t.travelers, m: t.m / t.travelers, h: t.h / t.travelers, travelers: t.travelers, rooms: t.rooms };
  }

  return { CUTOFFS, DEFAULTS, STYLE_KEY, costTier, alcoholProhibited, dailyTotals, perPerson };
})();
