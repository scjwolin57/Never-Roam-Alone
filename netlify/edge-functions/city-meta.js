// City link-preview + SEO meta injector (build item 21 + 24)
//
// In plain English: iMessage, WhatsApp, Facebook, and Google's crawler all
// grab a page's <title> / description / preview photo WITHOUT running any
// of the site's JavaScript. Before this fix, every city.html link showed
// the same generic "Never Roam Alone" preview no matter which city it was
// (city.html only sets the correct per-city photo/title AFTER the page's
// own JavaScript runs, which those tools skip).
//
// This Netlify "edge function" runs on Netlify's own servers, in the split
// second between a request arriving and the page being sent out — for
// EVERY visit to city.html (real people and bots alike). If the URL has a
// recognized ?city= name, it swaps in that city's own title, description,
// and photo before the HTML leaves the server. Real visitors don't notice
// anything different (the page already shows this content once its JS
// runs); crawlers and messaging apps now see the correct city right away.
//
// To add a new city: add one entry to CITY_META below, keyed by the exact
// city name in lowercase (matches how city.html looks up ?city=). "slug"
// must match the filename in images/cities/ (e.g. "Hong Kong" -> slug
// "hong-kong" -> images/cities/hong-kong.jpg). This list should stay in
// sync with the CITIES array in city.html; if a city's tagline changes
// there, update it here too.
//
// 2026-07-16: regenerated to cover all 247 live cities (was 102) — the
// other 145 city.html pages were already fully built and live, this file
// had just fallen behind after the last update.

import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";

const SITE = "https://neverroamalone.com";

const CITY_META = {
  "xi'an": {"city":"Xi'an","slug":"xi-an","tagline":"Ancient Silk Road capital of the Terracotta Army, city walls, and dumpling feasts."},
  "wuhan": {"city":"Wuhan","slug":"wuhan","tagline":"River city of a thousand lakes, hot-dry noodles, and the Yellow Crane Tower."},
  "tianjin": {"city":"Tianjin","slug":"tianjin","tagline":"China's treaty-port gateway where European villas meet a booming Bohai skyline."},
  "nanjing": {"city":"Nanjing","slug":"nanjing","tagline":"Ancient southern capital of dynasties, city walls, and Yangtze lore."},
  "nanchong": {"city":"Nanchong","slug":"nanchong","tagline":"Sichuan's silk city on the Jialing, steeped in Three Kingdoms lore."},
  "mumbai": {"city":"Mumbai","slug":"mumbai","tagline":"India's maximum city, where Bollywood dreams meet colonial grandeur and the Arabian Sea."},
  "jakarta": {"city":"Jakarta","slug":"jakarta","tagline":"Indonesia's sprawling capital of malls, markets, and endless motorbikes."},
  "dongguan": {"city":"Dongguan","slug":"dongguan","tagline":"Sprawling Pearl River factory metropolis wedged between Guangzhou and Shenzhen."},
  "chongqing": {"city":"Chongqing","slug":"chongqing","tagline":"Cyberpunk mountain metropolis of fog, hot pot, and cities stacked along the Yangtze."},
  "chengdu": {"city":"Chengdu","slug":"chengdu","tagline":"Laid-back Sichuan capital of pandas, teahouses, and mouth-numbing hotpot."},
  "ibiza": {"city":"Ibiza","slug":"ibiza","tagline":"White-walled old town by day, world capital of clubbing by night."},
  "abidjan": {
    "city": "Abidjan",
    "slug": "abidjan",
    "tagline": "Skyscrapers, lagoons, and West Africa's beating pulse."
  },
  "abu dhabi": {
    "city": "Abu Dhabi",
    "slug": "abu-dhabi",
    "tagline": "Grand mosques and oil-rich Gulf splendor."
  },
  "accra": {
    "city": "Accra",
    "slug": "accra",
    "tagline": "Vibrant coastal capital where history, highlife music and beach life meet."
  },
  "addis ababa": {
    "city": "Addis Ababa",
    "slug": "addis-ababa",
    "tagline": "Africa's diplomatic capital atop the Rift Valley highlands."
  },
  "algiers": {
    "city": "Algiers",
    "slug": "algiers",
    "tagline": "Whitewashed Casbah alleys tumble to a sweeping Mediterranean bay."
  },
  "almaty": {
    "city": "Almaty",
    "slug": "almaty",
    "tagline": "Where the Silk Road meets snow-capped Tian Shan peaks."
  },
  "amman": {
    "city": "Amman",
    "slug": "amman",
    "tagline": "Ancient Roman ruins meet buzzing hillside cafes in the Levant's white city."
  },
  "amsterdam": {
    "city": "Amsterdam",
    "slug": "amsterdam",
    "tagline": "Canals, bicycles, and golden-age light."
  },
  "andorra la vella": {
    "city": "Andorra la Vella",
    "slug": "andorra-la-vella",
    "tagline": "Pyrenean capital of duty-free shopping and thermal spas."
  },
  "antalya": {
    "city": "Antalya",
    "slug": "antalya",
    "tagline": "A turquoise coast beneath ancient ruins."
  },
  "antananarivo": {
    "city": "Antananarivo",
    "slug": "antananarivo",
    "tagline": "Highland capital of red-brick hills, rice paddies and royal history."
  },
  "apia": {
    "city": "Apia",
    "slug": "apia",
    "tagline": "Where the South Pacific still moves at village pace."
  },
  "ashgabat": {
    "city": "Ashgabat",
    "slug": "ashgabat",
    "tagline": "Gleaming white marble monuments amid the Karakum Desert."
  },
  "asmara": {
    "city": "Asmara",
    "slug": "asmara",
    "tagline": "Africa's Art Deco jewel, frozen in highland time."
  },
  "asunción": {
    "city": "Asunción",
    "slug": "asunci-n",
    "tagline": "Where a laid-back river capital hides colonial charm in tropical heat."
  },
  "athens": {
    "city": "Athens",
    "slug": "athens",
    "tagline": "Ancient marble beneath the Mediterranean sun"
  },
  "auckland": {
    "city": "Auckland",
    "slug": "auckland",
    "tagline": "Harbour city of sails, volcanoes and endless coastline."
  },
  "baghdad": {
    "city": "Baghdad",
    "slug": "baghdad",
    "tagline": "Where the Tigris meets 1,400 years of history."
  },
  "baku": {
    "city": "Baku",
    "slug": "baku",
    "tagline": "Ancient walls, Caspian shores, and a flame-lit skyline."
  },
  "bamako": {
    "city": "Bamako",
    "slug": "bamako",
    "tagline": "Sahelian river capital of music, markets, and the mighty Niger."
  },
  "bandar seri begawan": {
    "city": "Bandar Seri Begawan",
    "slug": "bandar-seri-begawan",
    "tagline": "Golden mosques rise beside a river of stilted water villages."
  },
  "bangkok": {
    "city": "Bangkok",
    "slug": "bangkok",
    "tagline": "Temples, tuk-tuks, and street food that never sleeps."
  },
  "bangui": {
    "city": "Bangui",
    "slug": "bangui",
    "tagline": "A river capital finding its rhythm on the Ubangi's banks."
  },
  "banjul": {
    "city": "Banjul",
    "slug": "banjul",
    "tagline": "River meets ocean at Africa's smallest mainland capital."
  },
  "barcelona": {
    "city": "Barcelona",
    "slug": "barcelona",
    "tagline": "Gaudí's dreams beside the Mediterranean."
  },
  "basseterre": {
    "city": "Basseterre",
    "slug": "basseterre",
    "tagline": "Sugar-cane hills meet a historic Caribbean harbor town."
  },
  "beijing": {
    "city": "Beijing",
    "slug": "beijing",
    "tagline": "Imperial capital where dynasties meet modern China."
  },
  "beirut": {
    "city": "Beirut",
    "slug": "beirut",
    "tagline": "Beirut, the resilient Mediterranean capital of ruins, nightlife, and grit."
  },
  "belgrade": {
    "city": "Belgrade",
    "slug": "belgrade",
    "tagline": "Where the Sava meets the Danube, and the party never quite stops."
  },
  "belize city": {
    "city": "Belize City",
    "slug": "belize-city",
    "tagline": "Gateway to the reef, where Caribbean rhythm meets colonial charm."
  },
  "berlin": {
    "city": "Berlin",
    "slug": "berlin",
    "tagline": "Techno, history, and reinvention on every corner"
  },
  "bishkek": {
    "city": "Bishkek",
    "slug": "bishkek",
    "tagline": "Tree-lined Soviet boulevards beneath the Tian Shan peaks."
  },
  "bissau": {
    "city": "Bissau",
    "slug": "bissau",
    "tagline": "Faded colonial charm at the gateway to the Bijagós Islands."
  },
  "bogotá": {
    "city": "Bogotá",
    "slug": "bogot",
    "tagline": "High-altitude Andean capital of art, coffee culture and endless nightlife."
  },
  "bologna": {
    "city": "Bologna",
    "slug": "bologna",
    "tagline": "Medieval towers, porticoes, and legendary cuisine."
  },
  "bratislava": {
    "city": "Bratislava",
    "slug": "bratislava",
    "tagline": "A castle-crowned capital where the Danube meets old-world charm."
  },
  "brazzaville": {
    "city": "Brazzaville",
    "slug": "brazzaville",
    "tagline": "Where the Congo River meets vibrant Central African culture."
  },
  "bridgetown": {
    "city": "Bridgetown",
    "slug": "bridgetown",
    "tagline": "Rum, reggae rhythms, and turquoise Caribbean shores."
  },
  "brussels": {
    "city": "Brussels",
    "slug": "brussels",
    "tagline": "Waffles, art nouveau, and Europe's beating heart."
  },
  "bucharest": {
    "city": "Bucharest",
    "slug": "bucharest",
    "tagline": "Belle Époque grandeur meets gritty, garden-filled energy."
  },
  "budapest": {
    "city": "Budapest",
    "slug": "budapest",
    "tagline": "Thermal baths on the majestic blue Danube."
  },
  "buenos aires": {
    "city": "Buenos Aires",
    "slug": "buenos-aires",
    "tagline": "Tango, steak, and grand European boulevards."
  },
  "bujumbura": {
    "city": "Bujumbura",
    "slug": "bujumbura",
    "tagline": "Laid-back lakeside capital cradled by Rift Valley hills."
  },
  "busan": {
    "city": "Busan",
    "slug": "busan",
    "tagline": "Korea's coastal city of beaches and seafood."
  },
  "cairo": {
    "city": "Cairo",
    "slug": "cairo",
    "tagline": "Ancient pyramids beside a teeming megacity"
  },
  "cancún": {
    "city": "Cancún",
    "slug": "canc-n",
    "tagline": "Caribbean blue with Maya ruins next door."
  },
  "cape town": {
    "city": "Cape Town",
    "slug": "cape-town",
    "tagline": "Where a flat-topped mountain meets two oceans."
  },
  "caracas": {
    "city": "Caracas",
    "slug": "caracas",
    "tagline": "Red-tiled valleys beneath the Ávila, guarded and grand."
  },
  "castries": {
    "city": "Castries",
    "slug": "castries",
    "tagline": "Where cruise ships meet rainforest hills and turquoise bays."
  },
  "chișinău": {
    "city": "Chișinău",
    "slug": "chi-in-u",
    "tagline": "Wine cellars, leafy boulevards and Soviet nostalgia in Europe's least-visited capital."
  },
  "colombo": {
    "city": "Colombo",
    "slug": "colombo",
    "tagline": "Colonial charm, lakeside towers, and Indian Ocean sunsets in one tropical port city."
  },
  "conakry": {
    "city": "Conakry",
    "slug": "conakry",
    "tagline": "Guinea's humid, chaotic Atlantic capital on a narrow peninsula."
  },
  "copenhagen": {
    "city": "Copenhagen",
    "slug": "copenhagen",
    "tagline": "Cycling, design, and cozy Nordic hygge."
  },
  "cotonou": {
    "city": "Cotonou",
    "slug": "cotonou",
    "tagline": "Lagoon-side capital of commerce where zemidjan motorcycles and Voodoo tradition rule the streets."
  },
  "dakar": {
    "city": "Dakar",
    "slug": "dakar",
    "tagline": "Africa's westernmost tip, where Atlantic surf meets vibrant city life."
  },
  "damascus": {
    "city": "Damascus",
    "slug": "damascus",
    "tagline": "Ancient walled city rising again after years of war."
  },
  "delhi": {
    "city": "Delhi",
    "slug": "delhi",
    "tagline": "Ancient empires and chaos in India's capital."
  },
  "denpasar": {
    "city": "Denpasar",
    "slug": "denpasar",
    "tagline": "Island of temples, surf, and rice terraces"
  },
  "dhaka": {
    "city": "Dhaka",
    "slug": "dhaka",
    "tagline": "Riverside chaos, Mughal history, and relentless energy on the Buriganga."
  },
  "dili": {
    "city": "Dili",
    "slug": "dili",
    "tagline": "Where rugged mountains meet turquoise seas in Asia's youngest nation."
  },
  "djibouti city": {
    "city": "Djibouti City",
    "slug": "djibouti-city",
    "tagline": "Where the Red Sea meets the Horn of Africa's volcanic edge."
  },
  "doha": {
    "city": "Doha",
    "slug": "doha",
    "tagline": "Gleaming desert metropolis on the Gulf."
  },
  "douala": {
    "city": "Douala",
    "slug": "douala",
    "tagline": "Cameroon's steamy economic hub and gateway to the coast."
  },
  "dubai": {
    "city": "Dubai",
    "slug": "dubai",
    "tagline": "Desert futurism reaching for the sky."
  },
  "dublin": {
    "city": "Dublin",
    "slug": "dublin",
    "tagline": "Literary pubs and warm rain-soaked charm"
  },
  "dubrovnik": {
    "city": "Dubrovnik",
    "slug": "dubrovnik",
    "tagline": "Marble streets and ancient walls guard the Adriatic's jewel."
  },
  "dushanbe": {
    "city": "Dushanbe",
    "slug": "dushanbe",
    "tagline": "Where Persian culture meets the Pamir foothills."
  },
  "edinburgh": {
    "city": "Edinburgh",
    "slug": "edinburgh",
    "tagline": "Scotland's storied capital of castles and festivals."
  },
  "florence": {
    "city": "Florence",
    "slug": "florence",
    "tagline": "Renaissance beauty carved in stone and light"
  },
  "frankfurt am main": {
    "city": "Frankfurt am Main",
    "slug": "frankfurt-am-main",
    "tagline": "Germany's skyline of finance and old charm."
  },
  "freetown": {
    "city": "Freetown",
    "slug": "freetown",
    "tagline": "Hills tumble to Atlantic beaches in West Africa's most storied harbor city."
  },
  "fukuoka": {
    "city": "Fukuoka",
    "slug": "fukuoka",
    "tagline": "Japan's gateway to ramen and island warmth."
  },
  "funafuti": {
    "city": "Funafuti",
    "slug": "funafuti",
    "tagline": "A sliver of coral where the runway doubles as Main Street."
  },
  "gaborone": {
    "city": "Gaborone",
    "slug": "gaborone",
    "tagline": "Botswana's understated capital, gateway to safari country."
  },
  "georgetown": {
    "city": "Georgetown",
    "slug": "georgetown",
    "tagline": "Colonial wooden architecture on the edge of the Amazon."
  },
  "guangzhou": {
    "city": "Guangzhou",
    "slug": "guangzhou",
    "tagline": "Cantonese trade hub of dim sum and towers."
  },
  "guatemala city": {
    "city": "Guatemala City",
    "slug": "guatemala-city",
    "tagline": "Highland capital where colonial plazas meet Central America's liveliest urban scene."
  },
  "hanoi": {
    "city": "Hanoi",
    "slug": "hanoi",
    "tagline": "Ancient temples and buzzing motorbike-filled boulevards."
  },
  "havana": {
    "city": "Havana",
    "slug": "havana",
    "tagline": "Faded grandeur, classic cars, and salsa on every corner."
  },
  "helsinki": {
    "city": "Helsinki",
    "slug": "helsinki",
    "tagline": "Baltic design capital of light and calm."
  },
  "heraklion": {
    "city": "Heraklion",
    "slug": "heraklion",
    "tagline": "Gateway to Crete and ancient Minoan Knossos."
  },
  "ho chi minh city": {
    "city": "Ho Chi Minh City",
    "slug": "ho-chi-minh-city",
    "tagline": "Frenetic energy, street food, and wartime history."
  },
  "hong kong": {
    "city": "Hong Kong",
    "slug": "hong-kong",
    "tagline": "Neon harbor nights and dim-sum mornings."
  },
  "honiara": {
    "city": "Honiara",
    "slug": "honiara",
    "tagline": "Where jungle ridges meet the Pacific's iron-bottom waters."
  },
  "honolulu": {
    "city": "Honolulu",
    "slug": "honolulu",
    "tagline": "Pacific paradise of surf and aloha spirit."
  },
  "istanbul": {
    "city": "Istanbul",
    "slug": "istanbul",
    "tagline": "Where two continents share a single skyline."
  },
  "jeddah": {
    "city": "Jeddah",
    "slug": "jeddah",
    "tagline": "Red Sea gateway to Mecca and the historic Hejaz"
  },
  "jerusalem": {
    "city": "Jerusalem",
    "slug": "jerusalem",
    "tagline": "Sacred city holy to three faiths"
  },
  "johor bahru": {
    "city": "Johor Bahru",
    "slug": "johor-bahru",
    "tagline": "Malaysia's vibrant southern gateway to Singapore."
  },
  "juba": {
    "city": "Juba",
    "slug": "juba",
    "tagline": "Where the White Nile meets the world's youngest capital."
  },
  "kabul": {
    "city": "Kabul",
    "slug": "kabul",
    "tagline": "Ancient crossroads city rebuilding beneath the Hindu Kush."
  },
  "kampala": {
    "city": "Kampala",
    "slug": "kampala",
    "tagline": "Uganda's hilly, hospitable capital on the shores of Lake Victoria."
  },
  "karachi": {
    "city": "Karachi",
    "slug": "karachi",
    "tagline": "Pakistan's chaotic megacity heartbeat on the Arabian Sea."
  },
  "kathmandu": {
    "city": "Kathmandu",
    "slug": "kathmandu",
    "tagline": "Temple bells, mountain air, and chaos woven into ancient courtyards."
  },
  "khartoum": {
    "city": "Khartoum",
    "slug": "khartoum",
    "tagline": "Where the Blue and White Nile meet in the desert."
  },
  "kigali": {
    "city": "Kigali",
    "slug": "kigali",
    "tagline": "Africa's cleanest, safest capital, set across a thousand green hills."
  },
  "kingstown": {
    "city": "Kingstown",
    "slug": "kingstown",
    "tagline": "Volcanic peaks, hidden bays, and the gateway to the Grenadines."
  },
  "kinshasa": {
    "city": "Kinshasa",
    "slug": "kinshasa",
    "tagline": "Africa's rhythm capital on the mighty Congo River."
  },
  "koror": {
    "city": "Koror",
    "slug": "koror",
    "tagline": "Rock Islands rise from turquoise lagoons around a diver's paradise."
  },
  "kotor": {
    "city": "Kotor",
    "slug": "kotor",
    "tagline": "Medieval walls cradling the Adriatic's most dramatic bay."
  },
  "kraków": {
    "city": "Kraków",
    "slug": "krak-w",
    "tagline": "Poland's regal heart of history and legend."
  },
  "kuala lumpur": {
    "city": "Kuala Lumpur",
    "slug": "kuala-lumpur",
    "tagline": "Twin towers above a rainforest of cultures."
  },
  "kuwait city": {
    "city": "Kuwait City",
    "slug": "kuwait-city",
    "tagline": "Gulf skyscrapers, ancient souks, and desert heat on the coast."
  },
  "kyiv": {
    "city": "Kyiv",
    "slug": "kyiv",
    "tagline": "Golden-domed city of hills, history, and the Dnipro River."
  },
  "kyoto": {
    "city": "Kyoto",
    "slug": "kyoto",
    "tagline": "Temples, geisha lanes, and quiet raked gardens"
  },
  "la paz": {
    "city": "La Paz",
    "slug": "la-paz",
    "tagline": "The world's highest capital, strung between snowcapped peaks by cable car."
  },
  "lagos": {
    "city": "Lagos",
    "slug": "lagos",
    "tagline": "West Africa's electric mega-city, pulsing on a lagoon."
  },
  "las vegas": {
    "city": "Las Vegas",
    "slug": "las-vegas",
    "tagline": "Desert neon where the night never sleeps"
  },
  "libreville": {
    "city": "Libreville",
    "slug": "libreville",
    "tagline": "Equatorial capital where rainforest meets the Atlantic."
  },
  "lilongwe": {
    "city": "Lilongwe",
    "slug": "lilongwe",
    "tagline": "Malawi's leafy capital, gateway to the warm heart of Africa."
  },
  "lima": {
    "city": "Lima",
    "slug": "lima",
    "tagline": "Coastal capital of ceviche and colonial grandeur"
  },
  "lisbon": {
    "city": "Lisbon",
    "slug": "lisbon",
    "tagline": "Tiled hills, fado, and the shimmering Tagus"
  },
  "ljubljana": {
    "city": "Ljubljana",
    "slug": "ljubljana",
    "tagline": "Green, walkable riverside capital where dragons guard the bridges."
  },
  "lomé": {
    "city": "Lomé",
    "slug": "lom",
    "tagline": "Where West African beaches meet a laid-back francophone capital."
  },
  "london": {
    "city": "London",
    "slug": "london",
    "tagline": "Centuries of history around every rainy corner."
  },
  "los angeles": {
    "city": "Los Angeles",
    "slug": "los-angeles",
    "tagline": "Sunshine, screens, and endless coastline."
  },
  "luanda": {
    "city": "Luanda",
    "slug": "luanda",
    "tagline": "Where Atlantic surf meets Africa's oil-boom energy."
  },
  "lusaka": {
    "city": "Lusaka",
    "slug": "lusaka",
    "tagline": "Zambia's leafy capital and gateway to safari country."
  },
  "luxembourg city": {
    "city": "Luxembourg City",
    "slug": "luxembourg-city",
    "tagline": "A fairy-tale fortress capital of cliffs, valleys and EU power."
  },
  "macau": {
    "city": "Macau",
    "slug": "macau",
    "tagline": "Portuguese colonial charm beneath dazzling lights."
  },
  "madrid": {
    "city": "Madrid",
    "slug": "madrid",
    "tagline": "Golden light, late nights, and endless plazas"
  },
  "majuro": {
    "city": "Majuro",
    "slug": "majuro",
    "tagline": "A slender coral necklace of a capital, ringing an impossibly blue lagoon."
  },
  "malabo": {
    "city": "Malabo",
    "slug": "malabo",
    "tagline": "Oil-boom capital on Bioko Island where colonial Spain meets equatorial jungle."
  },
  "malé": {
    "city": "Malé",
    "slug": "mal",
    "tagline": "Tiny island capital where turquoise sea meets city life."
  },
  "managua": {
    "city": "Managua",
    "slug": "managua",
    "tagline": "Lakeside capital where volcanoes and history meet."
  },
  "manama": {
    "city": "Manama",
    "slug": "manama",
    "tagline": "Gulf trading capital of causeways, souqs, and skyline."
  },
  "manila": {
    "city": "Manila",
    "slug": "manila",
    "tagline": "Where Spanish colonial history meets sprawling modern megacity energy."
  },
  "maputo": {
    "city": "Maputo",
    "slug": "maputo",
    "tagline": "Sun-bleached Indian Ocean capital of Afro-Latin rhythm and colonial grandeur."
  },
  "marne-la-vallée": {
    "city": "Marne-la-Vallée",
    "slug": "marne-la-vall-e",
    "tagline": "The magic of Disneyland east of Paris."
  },
  "marrakech": {
    "city": "Marrakech",
    "slug": "marrakech",
    "tagline": "A maze of souks, spice, and rooftop sunsets."
  },
  "maseru": {
    "city": "Maseru",
    "slug": "maseru",
    "tagline": "Gateway to Lesotho's Mountain Kingdom, high above Africa."
  },
  "mbabane": {
    "city": "Mbabane",
    "slug": "mbabane",
    "tagline": "Highveld capital of misty mountains, craft markets, and royal culture."
  },
  "mecca": {
    "city": "Mecca",
    "slug": "mecca",
    "tagline": "Islam's holiest city, heart of Hajj"
  },
  "medina": {
    "city": "Medina",
    "slug": "medina",
    "tagline": "Islam's radiant second holiest city"
  },
  "melbourne": {
    "city": "Melbourne",
    "slug": "melbourne",
    "tagline": "Laneway coffee, street art, and easy cool"
  },
  "mexico city": {
    "city": "Mexico City",
    "slug": "mexico-city",
    "tagline": "Ancient Aztec roots beneath vibrant sprawling metropolis."
  },
  "miami": {
    "city": "Miami",
    "slug": "miami",
    "tagline": "Art deco, ocean breeze, and Latin rhythm"
  },
  "milan": {
    "city": "Milan",
    "slug": "milan",
    "tagline": "Fashion, fresco, and effortless style."
  },
  "minsk": {
    "city": "Minsk",
    "slug": "minsk",
    "tagline": "Belarus's grand, spotless Soviet-era capital of wide avenues."
  },
  "mogadishu": {
    "city": "Mogadishu",
    "slug": "mogadishu",
    "tagline": "Ancient Indian Ocean port city rebuilding behind the world's tightest security."
  },
  "monaco": {
    "city": "Monaco",
    "slug": "monaco",
    "tagline": "Glamour, grand prix, and grand hotels crowded onto a single Riviera cliff."
  },
  "monrovia": {
    "city": "Monrovia",
    "slug": "monrovia",
    "tagline": "Atlantic surf meets resilient history on Liberia's coast."
  },
  "montego bay": {
    "city": "Montego Bay",
    "slug": "montego-bay",
    "tagline": "Reggae beats, resort luxury, turquoise Caribbean shores."
  },
  "montevideo": {
    "city": "Montevideo",
    "slug": "montevideo",
    "tagline": "Where the Río de la Plata meets laid-back South America."
  },
  "montreal": {
    "city": "Montreal",
    "slug": "montreal",
    "tagline": "Joie de vivre where Europe meets North America."
  },
  "moroni": {
    "city": "Moroni",
    "slug": "moroni",
    "tagline": "Where volcano meets sea in the heart of the Indian Ocean."
  },
  "moscow": {
    "city": "Moscow",
    "slug": "moscow",
    "tagline": "Golden domes, grand boulevards, and a metro built like an underground palace."
  },
  "munich": {
    "city": "Munich",
    "slug": "munich",
    "tagline": "Beer gardens, baroque spires, and Alpine air"
  },
  "muscat": {
    "city": "Muscat",
    "slug": "muscat",
    "tagline": "Where the Hajar Mountains meet the Arabian Sea."
  },
  "n'djamena": {
    "city": "N'Djamena",
    "slug": "n-djamena",
    "tagline": "The dusty Sahelian capital where the Chari and Logone rivers meet."
  },
  "nadi": {
    "city": "Nadi",
    "slug": "nadi",
    "tagline": "Fiji's tourism gateway, where beach resorts meet a bustling market town."
  },
  "nairobi": {
    "city": "Nairobi",
    "slug": "nairobi",
    "tagline": "Green city in the sun, safari gateway of East Africa."
  },
  "nassau": {
    "city": "Nassau",
    "slug": "nassau",
    "tagline": "Turquoise water, colonial streets, island time."
  },
  "new york": {
    "city": "New York",
    "slug": "new-york",
    "tagline": "Eight million stories on one electric grid."
  },
  "niamey": {
    "city": "Niamey",
    "slug": "niamey",
    "tagline": "Sahelian riverside capital where the Niger River meets the desert."
  },
  "nice": {
    "city": "Nice",
    "slug": "nice",
    "tagline": "Sun-drenched jewel of the French Riviera."
  },
  "nicosia": {
    "city": "Nicosia",
    "slug": "nicosia",
    "tagline": "Europe's last divided capital, ringed by Venetian walls."
  },
  "nouakchott": {
    "city": "Nouakchott",
    "slug": "nouakchott",
    "tagline": "Sand-swept Sahara capital where the desert meets the Atlantic."
  },
  "nuku'alofa": {
    "city": "Nuku'alofa",
    "slug": "nuku-alofa",
    "tagline": "Where the last Pacific kingdom meets a slow lagoon capital."
  },
  "orlando": {
    "city": "Orlando",
    "slug": "orlando",
    "tagline": "Theme-park magic under endless Florida sun"
  },
  "osaka": {
    "city": "Osaka",
    "slug": "osaka",
    "tagline": "Japan's kitchen, loud and proud."
  },
  "oslo": {
    "city": "Oslo",
    "slug": "oslo",
    "tagline": "Fjords, forests, and sleek Nordic modernity."
  },
  "ouagadougou": {
    "city": "Ouagadougou",
    "slug": "ouagadougou",
    "tagline": "West Africa's cultural crossroads, where Sahel meets savanna."
  },
  "palma de mallorca": {
    "city": "Palma de Mallorca",
    "slug": "palma-de-mallorca",
    "tagline": "Mediterranean island capital of light and cathedrals."
  },
  "panama city": {
    "city": "Panama City",
    "slug": "panama-city",
    "tagline": "A canal city where skyscrapers meet the jungle."
  },
  "paramaribo": {
    "city": "Paramaribo",
    "slug": "paramaribo",
    "tagline": "Dutch colonial charm meets Amazon gateway on the Suriname River."
  },
  "paris": {
    "city": "Paris",
    "slug": "paris",
    "tagline": "Boulevards, cafés, and light that earns its name."
  },
  "pattaya-chonburi": {
    "city": "Pattaya-Chonburi",
    "slug": "pattaya-chonburi",
    "tagline": "Beaches, nightlife, and endless tropical energy."
  },
  "phuket": {
    "city": "Phuket",
    "slug": "phuket",
    "tagline": "Limestone islands and warm Andaman tides."
  },
  "port louis": {
    "city": "Port Louis",
    "slug": "port-louis",
    "tagline": "Where Indian Ocean trade meets colonial market streets."
  },
  "port moresby": {
    "city": "Port Moresby",
    "slug": "port-moresby",
    "tagline": "Rugged harbour capital gateway to the world's last frontier."
  },
  "port of spain": {
    "city": "Port of Spain",
    "slug": "port-of-spain",
    "tagline": "Calypso, carnival and Caribbean chaos on the Savannah's edge."
  },
  "port vila": {
    "city": "Port Vila",
    "slug": "port-vila",
    "tagline": "Where turquoise lagoons meet a laid-back Melanesian capital."
  },
  "port-au-prince": {
    "city": "Port-au-Prince",
    "slug": "port-au-prince",
    "tagline": "Haiti's resilient capital of art, mountains, and history."
  },
  "porto": {
    "city": "Porto",
    "slug": "porto",
    "tagline": "Port wine, azulejos, and riverside romance."
  },
  "prague": {
    "city": "Prague",
    "slug": "prague",
    "tagline": "A fairy-tale city of spires and bridges."
  },
  "praia": {
    "city": "Praia",
    "slug": "praia",
    "tagline": "Africa's Atlantic capital of cobbled streets and hilltop sea views."
  },
  "punta cana": {
    "city": "Punta Cana",
    "slug": "punta-cana",
    "tagline": "All-inclusive beaches on the Caribbean coast"
  },
  "pyongyang": {
    "city": "Pyongyang",
    "slug": "pyongyang",
    "tagline": "Monuments, mass games and a capital frozen in revolutionary time."
  },
  "quito": {
    "city": "Quito",
    "slug": "quito",
    "tagline": "Colonial capital high in the Andes, ringed by volcanoes."
  },
  "reykjavík": {
    "city": "Reykjavík",
    "slug": "reykjav-k",
    "tagline": "A small capital where volcanoes, ice, and aurora collide."
  },
  "rhodes": {
    "city": "Rhodes",
    "slug": "rhodes",
    "tagline": "Medieval knights' city on a sun-soaked isle."
  },
  "riga": {
    "city": "Riga",
    "slug": "riga",
    "tagline": "Cobblestones, Art Nouveau spires, and Baltic charm on the Daugava."
  },
  "rio de janeiro": {
    "city": "Rio de Janeiro",
    "slug": "rio-de-janeiro",
    "tagline": "Mountains, beaches, and rhythm in the air."
  },
  "riyadh": {
    "city": "Riyadh",
    "slug": "riyadh",
    "tagline": "Desert capital reinventing itself skyward"
  },
  "rome": {
    "city": "Rome",
    "slug": "rome",
    "tagline": "An open-air museum you can eat your way through."
  },
  "roseau": {
    "city": "Roseau",
    "slug": "roseau",
    "tagline": "Nature Island capital where rainforest, reef and hot springs meet the sea."
  },
  "san francisco": {
    "city": "San Francisco",
    "slug": "san-francisco",
    "tagline": "Fog-wrapped hills, tech dreams, Golden Gate."
  },
  "san josé": {
    "city": "San José",
    "slug": "san-jos",
    "tagline": "Gateway to Costa Rica's volcanoes, cloud forests, and coasts."
  },
  "san marino": {
    "city": "San Marino",
    "slug": "san-marino",
    "tagline": "A fortress republic of towers crowning Monte Titano."
  },
  "san salvador": {
    "city": "San Salvador",
    "slug": "san-salvador",
    "tagline": "Central America's rising, safer-than-you-think capital."
  },
  "sana'a": {
    "city": "Sana'a",
    "slug": "sana-a",
    "tagline": "Mud-brick towers crown Arabia's oldest living capital."
  },
  "santiago": {
    "city": "Santiago",
    "slug": "santiago",
    "tagline": "Andes-backed metropolis of wine and culture"
  },
  "sapporo": {
    "city": "Sapporo",
    "slug": "sapporo",
    "tagline": "Snowy northern city of beer and festivals."
  },
  "sarajevo": {
    "city": "Sarajevo",
    "slug": "sarajevo",
    "tagline": "Where East meets West amid minarets, cafes and mountains."
  },
  "seoul": {
    "city": "Seoul",
    "slug": "seoul",
    "tagline": "Palaces, pop, and midnight markets."
  },
  "seville": {
    "city": "Seville",
    "slug": "seville",
    "tagline": "Andalusian soul of flamenco and orange blossom."
  },
  "shanghai": {
    "city": "Shanghai",
    "slug": "shanghai",
    "tagline": "Neon skyline where East meets futuristic ambition."
  },
  "sharjah": {
    "city": "Sharjah",
    "slug": "sharjah",
    "tagline": "The UAE's cultural and heritage capital."
  },
  "shenzhen": {
    "city": "Shenzhen",
    "slug": "shenzhen",
    "tagline": "China's futuristic tech boomtown by the sea."
  },
  "siem reap": {
    "city": "Siem Reap",
    "slug": "siem-reap",
    "tagline": "Gateway to Angkor's ancient temple kingdoms."
  },
  "singapore": {
    "city": "Singapore",
    "slug": "singapore",
    "tagline": "A garden city where every cuisine has a home."
  },
  "skopje": {
    "city": "Skopje",
    "slug": "skopje",
    "tagline": "Ottoman bazaars, grand statues, Balkan crossroads."
  },
  "sofia": {
    "city": "Sofia",
    "slug": "sofia",
    "tagline": "Ancient Serdica meets Balkan mountains and Soviet-era grandeur."
  },
  "st. george's": {
    "city": "St. George's",
    "slug": "st-george-s",
    "tagline": "Spice isle capital where a horseshoe harbor meets Caribbean beaches."
  },
  "st. john's": {
    "city": "St. John's",
    "slug": "st-john-s",
    "tagline": "Duty-free shops, cruise ships, and colonial charm collide."
  },
  "stockholm": {
    "city": "Stockholm",
    "slug": "stockholm",
    "tagline": "Fourteen islands of Scandinavian style and water."
  },
  "sydney": {
    "city": "Sydney",
    "slug": "sydney",
    "tagline": "Harbor sails and beaches within the city."
  },
  "são paulo": {
    "city": "São Paulo",
    "slug": "s-o-paulo",
    "tagline": "Brazil's boundless concrete jungle that never sleeps."
  },
  "são tomé": {
    "city": "São Tomé",
    "slug": "s-o-tom",
    "tagline": "Africa's cocoa isle where the equator meets the Atlantic."
  },
  "taipei": {
    "city": "Taipei",
    "slug": "taipei",
    "tagline": "Neon night markets beneath misty green mountains"
  },
  "tallinn": {
    "city": "Tallinn",
    "slug": "tallinn",
    "tagline": "Fairytale medieval towers meet Baltic tech"
  },
  "tarawa": {
    "city": "Tarawa",
    "slug": "tarawa",
    "tagline": "A slender coral atoll on the frontline of climate change."
  },
  "tashkent": {
    "city": "Tashkent",
    "slug": "tashkent",
    "tagline": "Central Asia's ancient Silk Road capital, reborn modern."
  },
  "tbilisi": {
    "city": "Tbilisi",
    "slug": "tbilisi",
    "tagline": "Sulfur baths and cobbled old-town charm"
  },
  "tegucigalpa": {
    "city": "Tegucigalpa",
    "slug": "tegucigalpa",
    "tagline": "Honduras's mountain-cradled capital of colonial plazas and modern grit."
  },
  "tehran": {
    "city": "Tehran",
    "slug": "tehran",
    "tagline": "Persia's pulse beneath the snow-capped Alborz Mountains."
  },
  "tel aviv": {
    "city": "Tel Aviv",
    "slug": "tel-aviv",
    "tagline": "Mediterranean beaches, nightlife, and startup energy."
  },
  "thessaloniki": {
    "city": "Thessaloniki",
    "slug": "thessaloniki",
    "tagline": "Byzantine seafront city of warm hospitality"
  },
  "thimphu": {
    "city": "Thimphu",
    "slug": "thimphu",
    "tagline": "Prayer flags, pine ridges, and the world's last Vajrayana capital."
  },
  "tirana": {
    "city": "Tirana",
    "slug": "tirana",
    "tagline": "Balkan capital of color, coffee culture, and communist echoes."
  },
  "tokyo": {
    "city": "Tokyo",
    "slug": "tokyo",
    "tagline": "Ancient ritual and neon future, side by side."
  },
  "toronto": {
    "city": "Toronto",
    "slug": "toronto",
    "tagline": "Lakeside towers and the world in one city"
  },
  "tripoli": {
    "city": "Tripoli",
    "slug": "tripoli",
    "tagline": "Mediterranean capital where Roman ruins meet Ottoman souks."
  },
  "tunis": {
    "city": "Tunis",
    "slug": "tunis",
    "tagline": "Where Mediterranean blue meets ancient Carthage stone."
  },
  "ulaanbaatar": {
    "city": "Ulaanbaatar",
    "slug": "ulaanbaatar",
    "tagline": "Nomadic soul meets rising skyline beneath endless steppe sky."
  },
  "vaduz": {
    "city": "Vaduz",
    "slug": "vaduz",
    "tagline": "A princely microstate capital tucked beneath alpine peaks."
  },
  "valencia": {
    "city": "Valencia",
    "slug": "valencia",
    "tagline": "Sunlit coast, paella, and futuristic architecture."
  },
  "valletta": {
    "city": "Valletta",
    "slug": "valletta",
    "tagline": "Baroque bastions guard a golden harbour capital."
  },
  "vancouver": {
    "city": "Vancouver",
    "slug": "vancouver",
    "tagline": "Mountains meet ocean in glassy Pacific splendor."
  },
  "venice": {
    "city": "Venice",
    "slug": "venice",
    "tagline": "Canals, palazzos, and light on the water"
  },
  "verona": {
    "city": "Verona",
    "slug": "verona",
    "tagline": "Romeo and Juliet's romantic Roman city."
  },
  "victoria": {
    "city": "Victoria",
    "slug": "victoria",
    "tagline": "Africa's smallest capital, where granite hills meet turquoise sea."
  },
  "victoria falls": {
    "city": "Victoria Falls",
    "slug": "victoria-falls",
    "tagline": "Where the Zambezi thunders into mist and rainbows."
  },
  "vienna": {
    "city": "Vienna",
    "slug": "vienna",
    "tagline": "Coffee houses and concert halls of old Europe."
  },
  "vientiane": {
    "city": "Vientiane",
    "slug": "vientiane",
    "tagline": "Sleepy Mekong capital of gilded stupas, baguettes, and river sunsets."
  },
  "vilnius": {
    "city": "Vilnius",
    "slug": "vilnius",
    "tagline": "Baroque old town wrapped in green hills"
  },
  "warsaw": {
    "city": "Warsaw",
    "slug": "warsaw",
    "tagline": "Phoenix city rebuilt with Polish resilience."
  },
  "washington, d.c.": {
    "city": "Washington, D.C.",
    "slug": "washington-d-c",
    "tagline": "Monuments, marble, and the pulse of power."
  },
  "weno": {
    "city": "Weno",
    "slug": "weno",
    "tagline": "Gateway to the sunken WWII fleets of Truk Lagoon."
  },
  "windhoek": {
    "city": "Windhoek",
    "slug": "windhoek",
    "tagline": "Highland capital blending German heritage and African soul."
  },
  "yangon": {
    "city": "Yangon",
    "slug": "yangon",
    "tagline": "Golden pagodas rise above colonial streets and river haze."
  },
  "yaren": {
    "city": "Yaren",
    "slug": "yaren",
    "tagline": "The world's smallest island republic on a coral atoll."
  },
  "yerevan": {
    "city": "Yerevan",
    "slug": "yerevan",
    "tagline": "Pink-stone capital in the shadow of Mount Ararat."
  },
  "zanzibar city": {
    "city": "Zanzibar City",
    "slug": "zanzibar-city",
    "tagline": "Spice-scented alleys where the Swahili coast meets the Indian Ocean."
  },
  "zhuhai": {
    "city": "Zhuhai",
    "slug": "zhuhai",
    "tagline": "Seaside gateway to Macau and gardens"
  },
  "zurich": {
    "city": "Zurich",
    "slug": "zurich",
    "tagline": "Alpine elegance, banking, pristine lakeside living."
  }
};

export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname !== "/city.html") return context.next();

  const wanted = (url.searchParams.get("city") || "").trim().toLowerCase();
  const meta = wanted ? CITY_META[wanted] : null;

  // Unknown / missing city — let the normal page (with its generic
  // preview + "not found" handling) load untouched.
  if (!meta) return context.next();

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const title = `${meta.city} Travel Guide — Never Roam Alone`;
  const description = meta.tagline;
  const image = `${SITE}/images/cities/${meta.slug}.jpg`;
  const pageUrl = `${SITE}${url.pathname}${url.search}`;

  const setContent = (value) => ({
    element(el) { el.setAttribute("content", value); },
  });

  return new HTMLRewriter()
    .on("title", { element(el) { el.setInnerContent(title); } })
    .on('meta[name="description"]', setContent(description))
    .on('meta[property="og:title"]', setContent(title))
    .on('meta[property="og:description"]', setContent(description))
    .on('meta[property="og:url"]', setContent(pageUrl))
    .on('meta[property="og:image"]', setContent(image))
    .on('meta[name="twitter:title"]', setContent(title))
    .on('meta[name="twitter:description"]', setContent(description))
    .on('meta[name="twitter:image"]', setContent(image))
    .transform(response);
};

export const config = { path: "/city.html" };
