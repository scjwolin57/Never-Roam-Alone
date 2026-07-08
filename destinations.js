/* =====================================================================
   DESTINATIONS.JS — shared destination dataset for the Destination
   Finder tools (choose.html). Now covers all 101 featured cities
   (same list as the map / city pages).

   dailyCost = estimated cost per person per day in USD, by travel style:
     budget  – hostels/guesthouses, street food, public transit
     mid     – 3-star hotels, restaurants, some taxis & attractions
     luxury  – 4–5 star hotels, fine dining, private transport

   Figures are estimates compiled July 2026 from published traveler
   averages (BudgetYourTrip and similar cost-of-travel indexes).
   They are labeled as estimates wherever shown.

   est:true      = visitor count is an estimate (shown with a ~)
   coastal:false = city is not on a sea coast (no ferry can serve it)
   region        = landmass used to judge whether ground travel
                   (car/bus/train) is physically possible. Cities on
                   isolated islands get their own region (hawaii,
                   crete, taiwan, …) so no one is told to drive there.
   ===================================================================== */

window.NRA_DESTINATIONS = [
  {city:"Hong Kong", country:"China (SAR)", lat:22.3193, lng:114.1694, region:"eurasia", visitors:26.7, dailyCost:{budget:60, mid:150, luxury:400}, tagline:"Neon harbor nights and dim-sum mornings."},
  {city:"Bangkok", country:"Thailand", lat:13.7563, lng:100.5018, region:"eurasia", visitors:22.8, dailyCost:{budget:35, mid:90, luxury:250}, tagline:"Temples, tuk-tuks, and street food that never sleeps."},
  {city:"London", country:"United Kingdom", lat:51.5072, lng:-0.1276, region:"eurasia", visitors:19.6, dailyCost:{budget:110, mid:290, luxury:830}, tagline:"Centuries of history around every rainy corner."},
  {city:"Macau", country:"China (SAR)", lat:22.1987, lng:113.5439, region:"eurasia", visitors:20.6, dailyCost:{budget:55, mid:140, luxury:400}, tagline:"Portuguese colonial charm beneath dazzling lights."},
  {city:"Singapore", country:"Singapore", lat:1.3521, lng:103.8198, region:"eurasia", visitors:19.8, dailyCost:{budget:70, mid:180, luxury:500}, tagline:"A garden city where every cuisine has a home."},
  {city:"Paris", country:"France", lat:48.8566, lng:2.3522, region:"eurasia", visitors:19.1, coastal:false, dailyCost:{budget:100, mid:250, luxury:700}, tagline:"Boulevards, cafés, and light that earns its name."},
  {city:"Dubai", country:"UAE", lat:25.2048, lng:55.2708, region:"eurasia", visitors:17.5, dailyCost:{budget:75, mid:200, luxury:650}, tagline:"Desert futurism reaching for the sky."},
  {city:"New York", country:"United States", lat:40.7128, lng:-74.006, region:"n-america", visitors:13.6, dailyCost:{budget:120, mid:300, luxury:800}, tagline:"Eight million stories on one electric grid."},
  {city:"Kuala Lumpur", country:"Malaysia", lat:3.139, lng:101.6869, region:"eurasia", visitors:14, coastal:false, dailyCost:{budget:30, mid:75, luxury:220}, tagline:"Twin towers above a rainforest of cultures."},
  {city:"Istanbul", country:"Türkiye", lat:41.0082, lng:28.9784, region:"eurasia", visitors:13.4, dailyCost:{budget:45, mid:110, luxury:320}, tagline:"Where two continents share a single skyline."},
  {city:"Tokyo", country:"Japan", lat:35.6895, lng:139.6917, region:"japan", visitors:12.9, dailyCost:{budget:70, mid:165, luxury:450}, tagline:"Ancient ritual and neon future, side by side."},
  {city:"Antalya", country:"Türkiye", lat:36.8969, lng:30.7133, region:"eurasia", visitors:12.4, dailyCost:{budget:40, mid:95, luxury:280}, tagline:"A turquoise coast beneath ancient ruins."},
  {city:"Seoul", country:"South Korea", lat:37.5665, lng:126.978, region:"korea", visitors:11.3, coastal:false, dailyCost:{budget:65, mid:150, luxury:400}, tagline:"Palaces, pop, and midnight markets."},
  {city:"Osaka", country:"Japan", lat:34.6937, lng:135.5023, region:"japan", visitors:10.1, dailyCost:{budget:60, mid:140, luxury:380}, tagline:"Japan's kitchen, loud and proud."},
  {city:"Rome", country:"Italy", lat:41.9028, lng:12.4964, region:"eurasia", visitors:10.1, dailyCost:{budget:80, mid:190, luxury:520}, tagline:"An open-air museum you can eat your way through."},
  {city:"Phuket", country:"Thailand", lat:7.8804, lng:98.3923, region:"eurasia", visitors:9.9, dailyCost:{budget:40, mid:100, luxury:300}, tagline:"Limestone islands and warm Andaman tides."},
  {city:"Barcelona", country:"Spain", lat:41.3851, lng:2.1734, region:"eurasia", visitors:9.1, dailyCost:{budget:75, mid:180, luxury:500}, tagline:"Gaudí's dreams beside the Mediterranean."},
  {city:"Amsterdam", country:"Netherlands", lat:52.3676, lng:4.9041, region:"eurasia", visitors:9, dailyCost:{budget:90, mid:220, luxury:600}, tagline:"Canals, bicycles, and golden-age light."},
  {city:"Milan", country:"Italy", lat:45.4642, lng:9.19, region:"eurasia", visitors:8.8, coastal:false, dailyCost:{budget:85, mid:200, luxury:550}, tagline:"Fashion, fresco, and effortless style."},
  {city:"Vienna", country:"Austria", lat:48.2082, lng:16.3738, region:"eurasia", visitors:7.9, coastal:false, dailyCost:{budget:80, mid:190, luxury:500}, tagline:"Coffee houses and concert halls of old Europe."},
  {city:"Prague", country:"Czechia", lat:50.0755, lng:14.4378, region:"eurasia", visitors:8, coastal:false, dailyCost:{budget:55, mid:130, luxury:350}, tagline:"A fairy-tale city of spires and bridges."},
  {city:"Los Angeles", country:"United States", lat:34.0522, lng:-118.2437, region:"n-america", visitors:7.5, dailyCost:{budget:110, mid:280, luxury:750}, tagline:"Sunshine, screens, and endless coastline."},
  {city:"Sydney", country:"Australia", lat:-33.8688, lng:151.2093, region:"oceania", visitors:4, dailyCost:{budget:90, mid:220, luxury:600}, tagline:"Harbor sails and beaches within the city."},
  {city:"Cape Town", country:"South Africa", lat:-33.9249, lng:18.4241, region:"africa", visitors:1.7, dailyCost:{budget:45, mid:110, luxury:350}, tagline:"Where a flat-topped mountain meets two oceans."},
  {city:"Rio de Janeiro", country:"Brazil", lat:-22.9068, lng:-43.1729, region:"s-america", visitors:2.3, dailyCost:{budget:45, mid:110, luxury:320}, tagline:"Mountains, beaches, and rhythm in the air."},
  {city:"Cancún", country:"Mexico", lat:21.1619, lng:-86.8515, region:"n-america", visitors:6.1, dailyCost:{budget:60, mid:150, luxury:450}, tagline:"Caribbean blue with Maya ruins next door."},
  {city:"Marrakech", country:"Morocco", lat:31.6295, lng:-7.9811, region:"africa", visitors:3, coastal:false, dailyCost:{budget:40, mid:95, luxury:300}, tagline:"A maze of souks, spice, and rooftop sunsets."},
  {city:"Madrid", country:"Spain", lat:40.4168, lng:-3.7038, region:"eurasia", visitors:7, est:true, coastal:false, dailyCost:{budget:70, mid:170, luxury:470}, tagline:"Golden light, late nights, and endless plazas"},
  {city:"Taipei", country:"Taiwan", lat:25.033, lng:121.565, region:"taiwan", visitors:7, est:true, coastal:false, dailyCost:{budget:50, mid:120, luxury:330}, tagline:"Neon night markets beneath misty green mountains"},
  {city:"Berlin", country:"Germany", lat:52.52, lng:13.405, region:"eurasia", visitors:6, est:true, coastal:false, dailyCost:{budget:70, mid:170, luxury:470}, tagline:"Techno, history, and reinvention on every corner"},
  {city:"Melbourne", country:"Australia", lat:-37.8136, lng:144.963, region:"oceania", visitors:3.4, est:true, dailyCost:{budget:85, mid:210, luxury:570}, tagline:"Laneway coffee, street art, and easy cool"},
  {city:"Munich", country:"Germany", lat:48.1351, lng:11.582, region:"eurasia", visitors:4.1, coastal:false, dailyCost:{budget:80, mid:190, luxury:520}, tagline:"Beer gardens, baroque spires, and Alpine air"},
  {city:"Las Vegas", country:"United States", lat:36.1699, lng:-115.14, region:"n-america", visitors:5.5, est:true, coastal:false, dailyCost:{budget:90, mid:230, luxury:650}, tagline:"Desert neon where the night never sleeps"},
  {city:"Florence", country:"Italy", lat:43.7696, lng:11.2558, region:"eurasia", visitors:5.1, coastal:false, dailyCost:{budget:75, mid:180, luxury:500}, tagline:"Renaissance beauty carved in stone and light"},
  {city:"Dublin", country:"Ireland", lat:53.3498, lng:-6.2603, region:"eurasia", visitors:5.5, est:true, dailyCost:{budget:85, mid:210, luxury:580}, tagline:"Literary pubs and warm rain-soaked charm"},
  {city:"Kyoto", country:"Japan", lat:35.0116, lng:135.768, region:"japan", visitors:8, est:true, coastal:false, dailyCost:{budget:65, mid:155, luxury:420}, tagline:"Temples, geisha lanes, and quiet raked gardens"},
  {city:"Lisbon", country:"Portugal", lat:38.7223, lng:-9.1393, region:"eurasia", visitors:4.5, est:true, dailyCost:{budget:65, mid:160, luxury:440}, tagline:"Tiled hills, fado, and the shimmering Tagus"},
  {city:"Venice", country:"Italy", lat:45.4408, lng:12.3155, region:"eurasia", visitors:5.5, dailyCost:{budget:90, mid:210, luxury:600}, tagline:"Canals, palazzos, and light on the water"},
  {city:"Athens", country:"Greece", lat:37.9838, lng:23.7275, region:"eurasia", visitors:6.5, est:true, dailyCost:{budget:65, mid:150, luxury:420}, tagline:"Ancient marble beneath the Mediterranean sun"},
  {city:"Orlando", country:"United States", lat:28.5383, lng:-81.3792, region:"n-america", visitors:5.5, coastal:false, dailyCost:{budget:85, mid:210, luxury:550}, tagline:"Theme-park magic under endless Florida sun"},
  {city:"Toronto", country:"Canada", lat:43.6532, lng:-79.3832, region:"n-america", visitors:4, est:true, coastal:false, dailyCost:{budget:85, mid:210, luxury:570}, tagline:"Lakeside towers and the world in one city"},
  {city:"Miami", country:"United States", lat:25.7617, lng:-80.1918, region:"n-america", visitors:7, est:true, dailyCost:{budget:100, mid:250, luxury:700}, tagline:"Art deco, ocean breeze, and Latin rhythm"},
  {city:"San Francisco", country:"United States", lat:37.7749, lng:-122.419, region:"n-america", visitors:2.6, est:true, dailyCost:{budget:120, mid:300, luxury:800}, tagline:"Fog-wrapped hills, tech dreams, Golden Gate."},
  {city:"Shanghai", country:"China", lat:31.2304, lng:121.474, region:"eurasia", visitors:6.7, dailyCost:{budget:60, mid:150, luxury:420}, tagline:"Neon skyline where East meets futuristic ambition."},
  {city:"Frankfurt am Main", country:"Germany", lat:50.1109, lng:8.6821, region:"eurasia", visitors:3.5, est:true, coastal:false, dailyCost:{budget:80, mid:195, luxury:540}, tagline:"Germany's skyline of finance and old charm."},
  {city:"Copenhagen", country:"Denmark", lat:55.6761, lng:12.5683, region:"eurasia", visitors:3, est:true, dailyCost:{budget:100, mid:240, luxury:650}, tagline:"Cycling, design, and cozy Nordic hygge."},
  {city:"Zurich", country:"Switzerland", lat:47.3769, lng:8.5417, region:"eurasia", visitors:2, est:true, coastal:false, dailyCost:{budget:130, mid:300, luxury:850}, tagline:"Alpine elegance, banking, pristine lakeside living."},
  {city:"Washington, D.C.", country:"United States", lat:38.9072, lng:-77.0369, region:"n-america", visitors:1.8, est:true, coastal:false, dailyCost:{budget:100, mid:250, luxury:680}, tagline:"Monuments, marble, and the pulse of power."},
  {city:"Pattaya-Chonburi", country:"Thailand", lat:12.9236, lng:100.882, region:"eurasia", visitors:7, est:true, dailyCost:{budget:35, mid:85, luxury:250}, tagline:"Beaches, nightlife, and endless tropical energy."},
  {city:"Vancouver", country:"Canada", lat:49.2827, lng:-123.121, region:"n-america", visitors:3.5, est:true, dailyCost:{budget:90, mid:220, luxury:600}, tagline:"Mountains meet ocean in glassy Pacific splendor."},
  {city:"Stockholm", country:"Sweden", lat:59.3293, lng:18.0686, region:"eurasia", visitors:2.5, est:true, dailyCost:{budget:95, mid:230, luxury:620}, tagline:"Fourteen islands of Scandinavian style and water."},
  {city:"Mexico City", country:"Mexico", lat:19.4326, lng:-99.1332, region:"n-america", visitors:10.5, est:true, coastal:false, dailyCost:{budget:40, mid:100, luxury:300}, tagline:"Ancient Aztec roots beneath vibrant sprawling metropolis."},
  {city:"Oslo", country:"Norway", lat:59.9139, lng:10.7522, region:"eurasia", visitors:1.5, est:true, dailyCost:{budget:100, mid:240, luxury:650}, tagline:"Fjords, forests, and sleek Nordic modernity."},
  {city:"São Paulo", country:"Brazil", lat:-23.5558, lng:-46.6396, region:"s-america", visitors:2, est:true, coastal:false, dailyCost:{budget:45, mid:110, luxury:320}, tagline:"Brazil's boundless concrete jungle that never sleeps."},
  {city:"Helsinki", country:"Finland", lat:60.1699, lng:24.9384, region:"eurasia", visitors:1.5, est:true, dailyCost:{budget:95, mid:220, luxury:600}, tagline:"Baltic design capital of light and calm."},
  {city:"Brussels", country:"Belgium", lat:50.8503, lng:4.3517, region:"eurasia", visitors:3.5, est:true, coastal:false, dailyCost:{budget:85, mid:200, luxury:550}, tagline:"Waffles, art nouveau, and Europe's beating heart."},
  {city:"Budapest", country:"Hungary", lat:47.4979, lng:19.0402, region:"eurasia", visitors:4, est:true, coastal:false, dailyCost:{budget:55, mid:130, luxury:360}, tagline:"Thermal baths on the majestic blue Danube."},
  {city:"Guangzhou", country:"China", lat:23.1291, lng:113.264, region:"eurasia", visitors:6, est:true, dailyCost:{budget:50, mid:125, luxury:350}, tagline:"Cantonese trade hub of dim sum and towers."},
  {city:"Nice", country:"France", lat:43.7031, lng:7.2661, region:"eurasia", visitors:2.5, est:true, dailyCost:{budget:90, mid:210, luxury:600}, tagline:"Sun-drenched jewel of the French Riviera."},
  {city:"Palma de Mallorca", country:"Spain", lat:39.5696, lng:2.6502, region:"mallorca", visitors:9, est:true, dailyCost:{budget:75, mid:180, luxury:500}, tagline:"Mediterranean island capital of light and cathedrals."},
  {city:"Honolulu", country:"United States", lat:21.3069, lng:-157.858, region:"hawaii", visitors:2, est:true, dailyCost:{budget:115, mid:280, luxury:780}, tagline:"Pacific paradise of surf and aloha spirit."},
  {city:"Beijing", country:"China", lat:39.9042, lng:116.407, region:"eurasia", visitors:3.5, est:true, coastal:false, dailyCost:{budget:55, mid:135, luxury:380}, tagline:"Imperial capital where dynasties meet modern China."},
  {city:"Warsaw", country:"Poland", lat:52.2297, lng:21.0122, region:"eurasia", visitors:3, est:true, coastal:false, dailyCost:{budget:55, mid:130, luxury:350}, tagline:"Phoenix city rebuilt with Polish resilience."},
  {city:"Seville", country:"Spain", lat:37.3891, lng:-5.9845, region:"eurasia", visitors:3, est:true, coastal:false, dailyCost:{budget:65, mid:150, luxury:420}, tagline:"Andalusian soul of flamenco and orange blossom."},
  {city:"Valencia", country:"Spain", lat:39.4699, lng:-0.3763, region:"eurasia", visitors:2.2, est:true, dailyCost:{budget:65, mid:155, luxury:430}, tagline:"Sunlit coast, paella, and futuristic architecture."},
  {city:"Shenzhen", country:"China", lat:22.5431, lng:114.058, region:"eurasia", visitors:10, est:true, dailyCost:{budget:55, mid:135, luxury:380}, tagline:"China's futuristic tech boomtown by the sea."},
  {city:"Doha", country:"Qatar", lat:25.2854, lng:51.531, region:"eurasia", visitors:5, dailyCost:{budget:70, mid:180, luxury:550}, tagline:"Gleaming desert metropolis on the Gulf."},
  {city:"Abu Dhabi", country:"UAE", lat:24.4539, lng:54.3773, region:"eurasia", visitors:5, dailyCost:{budget:70, mid:185, luxury:600}, tagline:"Grand mosques and oil-rich Gulf splendor."},
  {city:"Fukuoka", country:"Japan", lat:33.5904, lng:130.402, region:"japan", visitors:3, est:true, dailyCost:{budget:60, mid:140, luxury:380}, tagline:"Japan's gateway to ramen and island warmth."},
  {city:"Sapporo", country:"Japan", lat:43.0618, lng:141.355, region:"japan", visitors:2, est:true, coastal:false, dailyCost:{budget:60, mid:140, luxury:380}, tagline:"Snowy northern city of beer and festivals."},
  {city:"Busan", country:"South Korea", lat:35.1796, lng:129.076, region:"korea", visitors:3, dailyCost:{budget:60, mid:140, luxury:390}, tagline:"Korea's coastal city of beaches and seafood."},
  {city:"Edinburgh", country:"United Kingdom", lat:55.9533, lng:-3.1883, region:"eurasia", visitors:2.5, est:true, dailyCost:{budget:90, mid:220, luxury:620}, tagline:"Scotland's storied capital of castles and festivals."},
  {city:"Montreal", country:"Canada", lat:45.5019, lng:-73.5674, region:"n-america", visitors:3, est:true, coastal:false, dailyCost:{budget:80, mid:190, luxury:520}, tagline:"Joie de vivre where Europe meets North America."},
  {city:"Bologna", country:"Italy", lat:44.4949, lng:11.3426, region:"eurasia", visitors:1.5, est:true, coastal:false, dailyCost:{budget:70, mid:165, luxury:450}, tagline:"Medieval towers, porticoes, and legendary cuisine."},
  {city:"Rhodes", country:"Greece", lat:36.4349, lng:28.2176, region:"rhodes", visitors:2.5, est:true, dailyCost:{budget:60, mid:140, luxury:400}, tagline:"Medieval knights' city on a sun-soaked isle."},
  {city:"Verona", country:"Italy", lat:45.4384, lng:10.9916, region:"eurasia", visitors:3, est:true, coastal:false, dailyCost:{budget:70, mid:165, luxury:450}, tagline:"Romeo and Juliet's romantic Roman city."},
  {city:"Delhi", country:"India", lat:28.6139, lng:77.209, region:"eurasia", visitors:3, est:true, coastal:false, dailyCost:{budget:30, mid:75, luxury:250}, tagline:"Ancient empires and chaos in India's capital."},
  {city:"Porto", country:"Portugal", lat:41.1579, lng:-8.6291, region:"eurasia", visitors:3.5, est:true, dailyCost:{budget:60, mid:145, luxury:400}, tagline:"Port wine, azulejos, and riverside romance."},
  {city:"Ho Chi Minh City", country:"Vietnam", lat:10.7769, lng:106.701, region:"eurasia", visitors:6, est:true, coastal:false, dailyCost:{budget:30, mid:75, luxury:230}, tagline:"Frenetic energy, street food, and wartime history."},
  {city:"Buenos Aires", country:"Argentina", lat:-34.6037, lng:-58.3816, region:"s-america", visitors:3, est:true, dailyCost:{budget:50, mid:120, luxury:350}, tagline:"Tango, steak, and grand European boulevards."},
  {city:"Marne-la-Vallée", country:"France", lat:48.8674, lng:2.7836, region:"eurasia", visitors:15.8, est:true, coastal:false, dailyCost:{budget:90, mid:220, luxury:600}, tagline:"The magic of Disneyland east of Paris."},
  {city:"Kraków", country:"Poland", lat:50.0647, lng:19.945, region:"eurasia", visitors:2.3, coastal:false, dailyCost:{budget:50, mid:120, luxury:330}, tagline:"Poland's regal heart of history and legend."},
  {city:"Heraklion", country:"Greece", lat:35.3387, lng:25.1442, region:"crete", visitors:3.5, est:true, dailyCost:{budget:60, mid:140, luxury:400}, tagline:"Gateway to Crete and ancient Minoan Knossos."},
  {city:"Johor Bahru", country:"Malaysia", lat:1.4927, lng:103.741, region:"eurasia", visitors:16, est:true, dailyCost:{budget:30, mid:75, luxury:220}, tagline:"Malaysia's vibrant southern gateway to Singapore."},
  {city:"Hanoi", country:"Vietnam", lat:21.0278, lng:105.834, region:"eurasia", visitors:6.3, est:true, coastal:false, dailyCost:{budget:30, mid:70, luxury:220}, tagline:"Ancient temples and buzzing motorbike-filled boulevards."},
  {city:"Tel Aviv", country:"Israel", lat:32.0853, lng:34.7818, region:"eurasia", visitors:1, est:true, dailyCost:{budget:110, mid:260, luxury:750}, tagline:"Mediterranean beaches, nightlife, and startup energy."},
  {city:"Sharjah", country:"UAE", lat:25.3463, lng:55.4209, region:"eurasia", visitors:1.6, dailyCost:{budget:60, mid:160, luxury:500}, tagline:"The UAE's cultural and heritage capital."},
  {city:"Thessaloniki", country:"Greece", lat:40.6401, lng:22.9444, region:"eurasia", visitors:2.5, est:true, dailyCost:{budget:55, mid:130, luxury:370}, tagline:"Byzantine seafront city of warm hospitality"},
  {city:"Lima", country:"Peru", lat:-12.0464, lng:-77.0428, region:"s-america", visitors:2.5, est:true, dailyCost:{budget:45, mid:110, luxury:320}, tagline:"Coastal capital of ceviche and colonial grandeur"},
  {city:"Medina", country:"Saudi Arabia", lat:24.4672, lng:39.6142, region:"eurasia", visitors:9, est:true, coastal:false, dailyCost:{budget:55, mid:140, luxury:450}, tagline:"Islam's radiant second holiest city"},
  {city:"Tbilisi", country:"Georgia", lat:41.7151, lng:44.8271, region:"eurasia", visitors:2.5, est:true, coastal:false, dailyCost:{budget:35, mid:85, luxury:260}, tagline:"Sulfur baths and cobbled old-town charm"},
  {city:"Riyadh", country:"Saudi Arabia", lat:24.7136, lng:46.6753, region:"eurasia", visitors:5, est:true, coastal:false, dailyCost:{budget:70, mid:180, luxury:550}, tagline:"Desert capital reinventing itself skyward"},
  {city:"Tallinn", country:"Estonia", lat:59.437, lng:24.7536, region:"eurasia", visitors:1.9, est:true, dailyCost:{budget:65, mid:150, luxury:420}, tagline:"Fairytale medieval towers meet Baltic tech"},
  {city:"Mecca", country:"Saudi Arabia", lat:21.4225, lng:39.8262, region:"eurasia", visitors:18.7, coastal:false, dailyCost:{budget:60, mid:150, luxury:500}, tagline:"Islam's holiest city, heart of Hajj"},
  {city:"Denpasar", country:"Indonesia", lat:-8.6705, lng:115.213, region:"indonesia", visitors:6.3, est:true, dailyCost:{budget:35, mid:85, luxury:280}, tagline:"Island of temples, surf, and rice terraces"},
  {city:"Punta Cana", country:"Dominican Republic", lat:18.5601, lng:-68.3725, region:"hispaniola", visitors:4.5, est:true, dailyCost:{budget:70, mid:180, luxury:550}, tagline:"All-inclusive beaches on the Caribbean coast"},
  {city:"Santiago", country:"Chile", lat:-33.4489, lng:-70.6693, region:"s-america", visitors:2.5, est:true, coastal:false, dailyCost:{budget:55, mid:130, luxury:370}, tagline:"Andes-backed metropolis of wine and culture"},
  {city:"Vilnius", country:"Lithuania", lat:54.6872, lng:25.2797, region:"eurasia", visitors:1.2, est:true, coastal:false, dailyCost:{budget:55, mid:130, luxury:350}, tagline:"Baroque old town wrapped in green hills"},
  {city:"Jerusalem", country:"Israel", lat:31.7683, lng:35.2137, region:"eurasia", visitors:2, est:true, coastal:false, dailyCost:{budget:95, mid:230, luxury:650}, tagline:"Sacred city holy to three faiths"},
  {city:"Zhuhai", country:"China", lat:22.2707, lng:113.577, region:"eurasia", visitors:1.5, est:true, dailyCost:{budget:45, mid:110, luxury:320}, tagline:"Seaside gateway to Macau and gardens"},
  {city:"Cairo", country:"Egypt", lat:30.0444, lng:31.2357, region:"africa", visitors:9, est:true, coastal:false, dailyCost:{budget:35, mid:85, luxury:280}, tagline:"Ancient pyramids beside a teeming megacity"}
];

/* When the cost estimates were last reviewed against published sources */
window.NRA_COSTS_VERIFIED = "July 2026";
