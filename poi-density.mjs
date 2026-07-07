/* =====================================================================
   POI-DENSITY.MJS — fills in the missing 20% of the Visitor Score.

   Counts hotels, hostels, and tourist attractions around every city in
   world-cities-data.json using OpenStreetMap's free Overpass API, then
   recomputes each city's Visitor Score at the full weights
   (aviation 40% / tourism indexes 40% / POI density 20%) and rewrites
   both world-cities-data.json and world-cities.js.

   HOW TO RUN (on your Mac — needs internet, can't run inside Claude's
   sandbox because OpenStreetMap's servers are blocked there):
     1. Open Terminal
     2. cd "/Users/jeffreywolinsky/AI Projects/never-roam-alone"
     3. node poi-density.mjs
   It takes roughly 1–2 hours (it queries politely, ~6,200 cities in
   batches, pausing between requests so OSM doesn't block us).
   Progress saves to poi-progress.json — if it stops or you quit,
   just run it again and it resumes where it left off.
   ===================================================================== */

import fs from "fs";

const DATA_FILE = "world-cities-data.json";
const PROGRESS_FILE = "poi-progress.json";
const JS_FILE = "world-cities.js";
const BATCH = 40;                    // cities per Overpass request
const PAUSE_MS = 8000;               // pause between requests (be polite)
const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
];

// what counts as a tourist POI (hotels, hostels, attractions)
const POI_FILTER = 'tourism~"^(hotel|hostel|guest_house|apartment|attraction|museum|gallery|viewpoint|artwork|zoo|theme_park|aquarium)$"';

// search radius grows with city size (km)
function radiusKm(pop){
  if (pop >= 1000000) return 10;
  if (pop >= 300000)  return 7;
  if (pop >= 100000)  return 5;
  return 3;
}

// density (POIs per km²) → 0..1 score, log-scaled
function poiScore(count, rKm){
  const density = count / (Math.PI * rKm * rKm);
  return Math.min(1, Math.log10(1 + density) / 1.7);
}

const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const cities = data.cities;
let progress = fs.existsSync(PROGRESS_FILE) ? JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8")) : {};

const todo = cities.map((c, i) => ({ c, i })).filter(x => progress[x.i] === undefined);
console.log(`${cities.length} cities total, ${todo.length} still to measure.`);

let ep = 0;
async function runBatch(batch){
  const stmts = batch.map(({ c }) =>
    `nwr[${POI_FILTER}](around:${radiusKm(c.pop) * 1000},${c.lat},${c.lng});out count;`).join("\n");
  const query = `[out:json][timeout:240];\n${stmts}`;
  for (let attempt = 0; attempt < ENDPOINTS.length * 2; attempt++){
    const url = ENDPOINTS[ep % ENDPOINTS.length];
    try {
      const res = await fetch(url, { method: "POST", body: "data=" + encodeURIComponent(query),
        headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      if (res.status === 429 || res.status === 504){ ep++; await sleep(30000); continue; }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      const counts = (json.elements || []).filter(e => e.type === "count")
        .map(e => parseInt((e.tags && (e.tags.total ?? e.tags.count)) || "0", 10));
      if (counts.length !== batch.length) throw new Error(`got ${counts.length} counts for ${batch.length} cities`);
      return counts;
    } catch (e) {
      console.log(`  retry (${e.message}) …`);
      ep++; await sleep(20000);
    }
  }
  throw new Error("all Overpass endpoints failing — try again later");
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

for (let b = 0; b < todo.length; b += BATCH){
  const batch = todo.slice(b, b + BATCH);
  const counts = await runBatch(batch);
  batch.forEach(({ i }, k) => { progress[i] = counts[k]; });
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress));
  const done = Object.keys(progress).length;
  console.log(`${done}/${cities.length} cities measured (last batch: ${batch[0].c.name} … ${batch[batch.length-1].c.name})`);
  if (b + BATCH < todo.length) await sleep(PAUSE_MS);
}

// ---- recompute scores at full 40/40/20 and rewrite the files ----
console.log("All measured — recomputing Visitor Scores…");
cities.forEach((c, i) => {
  const count = progress[i] ?? 0;
  c.poi_count = count;
  c.sc_poi = Math.round(poiScore(count, radiusKm(c.pop)) * 1000) / 1000;
  c.score = Math.round((0.4 * c.sc_avi + 0.4 * c.sc_idx + 0.2 * c.sc_poi) * 1000) / 1000;
});
cities.sort((a, b) => b.score - a.score || b.pop - a.pop);
fs.writeFileSync(DATA_FILE, JSON.stringify(data));

// regenerate world-cities.js (same row format, POI slot now filled)
const js = fs.readFileSync(JS_FILE, "utf8");
const head = js.split("window.NRA_COUNTRY_NAMES")[0]
  .replace(/NOT FILLED IN YET[\s\S]*?aviation 50% \/ indexes 50%\./, "filled in by poi-density.mjs.");
const rows = cities.map(r => JSON.stringify([r.name, r.cc, r.admin, r.pop, r.lat, r.lng, r.cap,
  r.iata, r.ownair, r.sc_avi, r.sc_idx, r.sc_poi, r.score])).join(",\n");
const tail = js.substring(js.indexOf("/* Turn one row into a friendly object"));
fs.writeFileSync(JS_FILE,
  head + "window.NRA_COUNTRY_NAMES = " + JSON.stringify(data.ccnames) + ";\n\n" +
  "window.NRA_WORLD_CITIES = [\n" + rows + "\n];\n\n" + tail);
console.log("Done! world-cities.js and world-cities-data.json updated with full 40/40/20 scores.");
console.log("Ask Claude to refresh world-cities-master.xlsx from the updated data.");
