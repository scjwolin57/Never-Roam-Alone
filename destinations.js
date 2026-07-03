/* =====================================================================
   DESTINATIONS.JS — shared destination dataset for the Destination
   Finder tools (choose.html).

   dailyCost = estimated cost per person per day in USD, by travel style:
     budget  – hostels/guesthouses, street food, public transit
     mid     – 3-star hotels, restaurants, some taxis & attractions
     luxury  – 4–5 star hotels, fine dining, private transport

   Figures are estimates compiled July 2026 from published traveler
   averages (BudgetYourTrip and similar cost-of-travel indexes).
   They are labeled as estimates wherever shown.

   region = the landmass/travel region used to judge whether ground
   travel (car/bus/train) is physically possible from an origin.
     eurasia     – Europe + mainland Asia (connected by land)
     japan       – island nation (no ground link)
     korea       – peninsula, land route not passable
     n-america   – USA / Canada / Mexico
     s-america   – South America
     africa      – African continent
     oceania     – Australia etc.
   ===================================================================== */

window.NRA_DESTINATIONS = [
  {city:"Hong Kong",     country:"China (SAR)",    lat:22.3193,  lng:114.1694, region:"eurasia",   visitors:26.7, dailyCost:{budget:60,  mid:150, luxury:400}, tagline:"Neon harbor nights and dim-sum mornings."},
  {city:"Bangkok",       country:"Thailand",       lat:13.7563,  lng:100.5018, region:"eurasia",   visitors:22.8, dailyCost:{budget:35,  mid:90,  luxury:250}, tagline:"Temples, tuk-tuks, and street food that never sleeps."},
  {city:"London",        country:"United Kingdom", lat:51.5072,  lng:-0.1276,  region:"eurasia",   visitors:19.6, dailyCost:{budget:110, mid:290, luxury:830}, tagline:"Centuries of history around every rainy corner."},
  {city:"Macau",         country:"China (SAR)",    lat:22.1987,  lng:113.5439, region:"eurasia",   visitors:20.6, dailyCost:{budget:55,  mid:140, luxury:400}, tagline:"Portuguese colonial charm beneath dazzling lights."},
  {city:"Singapore",     country:"Singapore",      lat:1.3521,   lng:103.8198, region:"eurasia",   visitors:19.8, dailyCost:{budget:70,  mid:180, luxury:500}, tagline:"A garden city where every cuisine has a home."},
  {city:"Paris",         country:"France",         lat:48.8566,  lng:2.3522,   region:"eurasia",   visitors:19.1, coastal:false, dailyCost:{budget:100, mid:250, luxury:700}, tagline:"Boulevards, cafés, and light that earns its name."},
  {city:"Dubai",         country:"UAE",            lat:25.2048,  lng:55.2708,  region:"eurasia",   visitors:17.5, dailyCost:{budget:75,  mid:200, luxury:650}, tagline:"Desert futurism reaching for the sky."},
  {city:"New York",      country:"United States",  lat:40.7128,  lng:-74.0060, region:"n-america", visitors:13.6, dailyCost:{budget:120, mid:300, luxury:800}, tagline:"Eight million stories on one electric grid."},
  {city:"Kuala Lumpur",  country:"Malaysia",       lat:3.1390,   lng:101.6869, region:"eurasia",   visitors:14.0, coastal:false, dailyCost:{budget:30,  mid:75,  luxury:220}, tagline:"Twin towers above a rainforest of cultures."},
  {city:"Istanbul",      country:"Türkiye",        lat:41.0082,  lng:28.9784,  region:"eurasia",   visitors:13.4, dailyCost:{budget:45,  mid:110, luxury:320}, tagline:"Where two continents share a single skyline."},
  {city:"Tokyo",         country:"Japan",          lat:35.6895,  lng:139.6917, region:"japan",     visitors:12.9, dailyCost:{budget:70,  mid:165, luxury:450}, tagline:"Ancient ritual and neon future, side by side."},
  {city:"Antalya",       country:"Türkiye",        lat:36.8969,  lng:30.7133,  region:"eurasia",   visitors:12.4, dailyCost:{budget:40,  mid:95,  luxury:280}, tagline:"A turquoise coast beneath ancient ruins."},
  {city:"Seoul",         country:"South Korea",    lat:37.5665,  lng:126.9780, region:"korea",     visitors:11.3, coastal:false, dailyCost:{budget:65,  mid:150, luxury:400}, tagline:"Palaces, pop, and midnight markets."},
  {city:"Osaka",         country:"Japan",          lat:34.6937,  lng:135.5023, region:"japan",     visitors:10.1, dailyCost:{budget:60,  mid:140, luxury:380}, tagline:"Japan's kitchen, loud and proud."},
  {city:"Rome",          country:"Italy",          lat:41.9028,  lng:12.4964,  region:"eurasia",   visitors:10.1, dailyCost:{budget:80,  mid:190, luxury:520}, tagline:"An open-air museum you can eat your way through."},
  {city:"Phuket",        country:"Thailand",       lat:7.8804,   lng:98.3923,  region:"eurasia",   visitors:9.9,  dailyCost:{budget:40,  mid:100, luxury:300}, tagline:"Limestone islands and warm Andaman tides."},
  {city:"Barcelona",     country:"Spain",          lat:41.3851,  lng:2.1734,   region:"eurasia",   visitors:9.1,  dailyCost:{budget:75,  mid:180, luxury:500}, tagline:"Gaudí's dreams beside the Mediterranean."},
  {city:"Amsterdam",     country:"Netherlands",    lat:52.3676,  lng:4.9041,   region:"eurasia",   visitors:9.0,  dailyCost:{budget:90,  mid:220, luxury:600}, tagline:"Canals, bicycles, and golden-age light."},
  {city:"Milan",         country:"Italy",          lat:45.4642,  lng:9.1900,   region:"eurasia",   visitors:8.8,  coastal:false, dailyCost:{budget:85,  mid:200, luxury:550}, tagline:"Fashion, fresco, and effortless style."},
  {city:"Vienna",        country:"Austria",        lat:48.2082,  lng:16.3738,  region:"eurasia",   visitors:7.9,  coastal:false, dailyCost:{budget:80,  mid:190, luxury:500}, tagline:"Coffee houses and concert halls of old Europe."},
  {city:"Prague",        country:"Czechia",        lat:50.0755,  lng:14.4378,  region:"eurasia",   visitors:8.0,  coastal:false, dailyCost:{budget:55,  mid:130, luxury:350}, tagline:"A fairy-tale city of spires and bridges."},
  {city:"Los Angeles",   country:"United States",  lat:34.0522,  lng:-118.2437,region:"n-america", visitors:7.5,  dailyCost:{budget:110, mid:280, luxury:750}, tagline:"Sunshine, screens, and endless coastline."},
  {city:"Sydney",        country:"Australia",      lat:-33.8688, lng:151.2093, region:"oceania",   visitors:4.0,  dailyCost:{budget:90,  mid:220, luxury:600}, tagline:"Harbor sails and beaches within the city."},
  {city:"Cape Town",     country:"South Africa",   lat:-33.9249, lng:18.4241,  region:"africa",    visitors:1.7,  dailyCost:{budget:45,  mid:110, luxury:350}, tagline:"Where a flat-topped mountain meets two oceans."},
  {city:"Rio de Janeiro",country:"Brazil",         lat:-22.9068, lng:-43.1729, region:"s-america", visitors:2.3,  dailyCost:{budget:45,  mid:110, luxury:320}, tagline:"Mountains, beaches, and rhythm in the air."},
  {city:"Cancún",        country:"Mexico",         lat:21.1619,  lng:-86.8515, region:"n-america", visitors:6.1,  dailyCost:{budget:60,  mid:150, luxury:450}, tagline:"Caribbean blue with Maya ruins next door."},
  {city:"Marrakech",     country:"Morocco",        lat:31.6295,  lng:-7.9811,  region:"africa",    visitors:3.0,  coastal:false, dailyCost:{budget:40,  mid:95,  luxury:300}, tagline:"A maze of souks, spice, and rooftop sunsets."}
];

/* When the cost estimates were last reviewed against published sources */
window.NRA_COSTS_VERIFIED = "July 2026";
