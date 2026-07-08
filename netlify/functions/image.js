// Netlify serverless function: proxies Unsplash image search.
//
// SECURITY: the Unsplash Access Key is read from the UNSPLASH_ACCESS_KEY
// environment variable (set in Netlify -> Site settings -> Environment variables).
// It is NEVER stored in this file or sent to the browser.
//
// Endpoint (once deployed): /.netlify/functions/image?q=Shibuya+Crossing+Tokyo
// Returns the most-downloaded landscape photo matching the query.
//
// Add &count=8 (2-12) to get a LIST of matches instead — used by the
// blog editor's image picker so you can choose between several photos.
// Response then looks like: { results: [ {url, thumb, credit, ...}, ... ] }

exports.handler = async (event) => {
  const q = ((event.queryStringParameters && event.queryStringParameters.q) || "").trim();
  if (!q) return json(400, { error: "Provide a q (search query)." });

  const countRaw = parseInt((event.queryStringParameters && event.queryStringParameters.count) || "", 10);
  const count = Number.isFinite(countRaw) ? Math.min(12, Math.max(2, countRaw)) : 0;

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return json(500, { error: "Server is not configured: UNSPLASH_ACCESS_KEY is missing." });

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", q);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("order_by", "downloads");
  url.searchParams.set("content_filter", "high");
  url.searchParams.set("per_page", String(count || 1));

  try {
    const resp = await fetch(url.toString(), {
      headers: { Authorization: "Client-ID " + key.trim() }
    });
    if (!resp.ok) return json(502, { error: "Unsplash returned " + resp.status });

    const d = await resp.json();

    // List mode (image picker): return every match.
    if (count) {
      const results = (d.results || []).map(p => ({
        url: p.urls.regular || p.urls.small,
        thumb: p.urls.small || p.urls.thumb,
        credit: p.user ? p.user.name : null,
        creditLink: p.user && p.user.links ? p.user.links.html : null,
        link: p.links ? p.links.html : null
      }));
      return json(200, { results }, { "Cache-Control": "public, max-age=86400" });
    }

    const photo = d.results && d.results[0];
    if (!photo) return json(404, { error: "No photos found for: " + q });

    return json(200, {
      url: photo.urls.regular || photo.urls.small,
      credit: photo.user ? photo.user.name : null,
      creditLink: photo.user && photo.user.links ? photo.user.links.html : null,
      link: photo.links ? photo.links.html : null
    }, { "Cache-Control": "public, max-age=86400" });   // cache 24 h to spare rate limit
  } catch (e) {
    return json(502, { error: "Could not reach the image provider." });
  }
};

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body)
  };
}
