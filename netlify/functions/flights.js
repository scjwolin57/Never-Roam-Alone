// Netlify serverless function: proxies SerpApi's google_travel_explore engine.
//
// SECURITY: the SerpApi key is read from the SERPAPI_KEY environment variable,
// which you set in Netlify (Site settings -> Environment variables). It is NEVER
// stored in this file or sent to the browser. The browser only ever calls this
// function; only this function (server-side) knows the key.
//
// Google Travel Explore needs only a departure airport and returns suggested
// destinations (with price, duration, and number of stops) for that origin.
//
// Endpoint (once deployed): /.netlify/functions/flights?departure_id=CDG&outbound_date=2026-06-25&stops=1

exports.handler = async (event) => {
  const p = event.queryStringParameters || {};
  const departure_id  = (p.departure_id  || "").toUpperCase().trim();
  const outbound_date = (p.outbound_date || "").trim();
  const return_date   = (p.return_date   || "").trim();
  const type     = (p.type === "1") ? "1" : "2";   // 1 = round trip, 2 = one-way
  const stops    = p.stops || "0";            // 0 any, 1 nonstop, 2 <=1 stop, 3 <=2 stops
  const currency = (p.currency || "USD").toUpperCase();

  if (!/^[A-Z]{3}$/.test(departure_id)) {
    return json(400, { error: "Provide departure_id (a 3-letter airport code)." });
  }
  if (outbound_date && !/^\d{4}-\d{2}-\d{2}$/.test(outbound_date)) {
    return json(400, { error: "outbound_date must be YYYY-MM-DD." });
  }
  if (type === "1" && !/^\d{4}-\d{2}-\d{2}$/.test(return_date)) {
    return json(400, { error: "return_date (YYYY-MM-DD) is required for a round trip." });
  }

  const key = process.env.SERPAPI_KEY;
  if (!key) {
    return json(500, { error: "Server is not configured: SERPAPI_KEY environment variable is missing." });
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_travel_explore");
  url.searchParams.set("departure_id", departure_id);
  url.searchParams.set("type", type);         // 1 = round trip, 2 = one-way
  url.searchParams.set("travel_mode", "1");   // flights only
  url.searchParams.set("currency", currency);
  if (outbound_date) url.searchParams.set("outbound_date", outbound_date);
  if (type === "1") url.searchParams.set("return_date", return_date);
  if (stops && stops !== "0") url.searchParams.set("stops", stops);
  url.searchParams.set("api_key", key);

  try {
    const resp = await fetch(url.toString());
    const data = await resp.json();
    if (data.error) return json(502, { error: data.error });

    // Return only what the page needs.
    return json(200, {
      destinations: data.destinations || [],
      flights: data.flights || []
    }, { "Cache-Control": "public, max-age=300" });
  } catch (e) {
    return json(502, { error: "Could not reach the flight provider." });
  }
};

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body)
  };
}
