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
  "pristina": {"city":"Pristina","slug":"pristina","tagline":"Europe's youngest capital, a fast-changing city of Ottoman-era mosques, Yugoslav-era monuments, and a buzzing cafe scene"},
  "san pedro de atacama": {"city":"San Pedro de Atacama","slug":"san-pedro-de-atacama","tagline":"An adobe desert oasis town ringed by geysers, salt flats, and the otherworldly Valle de la Luna"},
  "mykonos": {"city":"Mykonos","slug":"mykonos","tagline":"A whitewashed Cycladic party island of windmills, Little Venice sunsets, and glamorous beach clubs"},
  "santorini": {"city":"Santorini","slug":"santorini","tagline":"A volcanic Cycladic island crowned by whitewashed clifftop villages overlooking a dramatic caldera"},
  "chefchaouen": {"city":"Chefchaouen","slug":"chefchaouen","tagline":"Morocco's 'Blue Pearl,' a Rif Mountain medina where every wall is washed in shades of blue"},
  "sigiriya": {"city":"Sigiriya","slug":"sigiriya","tagline":"A 5th-century sky palace atop a sheer 180-meter granite monolith, ringed by ancient water gardens and frescoes"},
  "lamu": {"city":"Lamu","slug":"lamu","tagline":"East Africa's oldest and best-preserved Swahili town, a car-free island of coral-stone alleys and donkey traffic"},
  "bamyan": {"city":"Bamyan","slug":"bamyan","tagline":"A high-altitude Hazarajat valley of towering empty Buddha niches and the impossibly blue lakes of Band-e-Amir"},
  "harar": {"city":"Harar","slug":"harar","tagline":"A fourth 'holy city' of Islam behind ancient walls, famous for its 82 mosques and nightly hyena-feeding tradition"},
  "axum": {"city":"Axum","slug":"axum","tagline":"The ancient capital of the Aksumite Empire, home to towering carved obelisks and the legendary resting place of the Ark of the Covenant"},
  "lalibela": {"city":"Lalibela","slug":"lalibela","tagline":"A highland pilgrimage town of eleven medieval churches carved entirely from single blocks of volcanic rock"},
  "kanchanaburi": {"city":"Kanchanaburi","slug":"kanchanaburi","tagline":"A river town built around the WWII Bridge on the River Kwai, with waterfalls and caves in the surrounding hills"},
  "pai": {"city":"Pai","slug":"pai","tagline":"A laid-back mountain valley town beloved by backpackers, ringed by canyons, hot springs, and hill-tribe villages"},
  "hua hin": {"city":"Hua Hin","slug":"hua-hin","tagline":"Thailand's original royal beach resort, blending a low-key fishing-village pier with golf courses and night markets"},
  "sukhothai": {"city":"Sukhothai","slug":"sukhothai","tagline":"The 'dawn of happiness,' Thailand's first capital, now a UNESCO park of lotus-ringed temple ruins"},
  "chiang rai": {"city":"Chiang Rai","slug":"chiang-rai","tagline":"Thailand's northernmost major city, home to a dazzling white temple and gateway to the Golden Triangle"},
  "ko samui": {"city":"Ko Samui","slug":"ko-samui","tagline":"A palm-fringed Gulf of Thailand island of coconut plantations, beach clubs, and Buddhist temples"},
  "krabi": {"city":"Krabi","slug":"krabi","tagline":"A gateway to dramatic limestone karsts and turquoise Andaman Sea coves, from Railay's cliffs to nearby islands"},
  "mar del plata": {"city":"Mar del Plata","slug":"mar-del-plata","tagline":"Argentina's classic Atlantic beach resort, where Porteños have summered for over a century"},
  "puerto madryn": {"city":"Puerto Madryn","slug":"puerto-madryn","tagline":"A Welsh-founded Patagonian coastal town, launchpad for southern right whales and penguin colonies on Peninsula Valdes"},
  "el chaltén": {"city":"El Chaltén","slug":"el-chalt-n","tagline":"Argentina's self-declared 'Trekking Capital,' a tiny village beneath the jagged spires of Fitz Roy and Cerro Torre"},
  "puerto iguazú": {"city":"Puerto Iguazú","slug":"puerto-iguaz","tagline":"A tri-border jungle town beside one of the world's most spectacular waterfall systems"},
  "el calafate": {"city":"El Calafate","slug":"el-calafate","tagline":"A Patagonian lakeside town whose sole purpose is being the gateway to the thundering Perito Moreno Glacier"},
  "ushuaia": {"city":"Ushuaia","slug":"ushuaia","tagline":"The world's southernmost city, wedged between the Beagle Channel and the Martial Mountains, gateway to Antarctica"},
  "bariloche": {"city":"Bariloche","slug":"bariloche","tagline":"A Swiss-style lakeside town in Argentine Patagonia, famous for chocolate, ski slopes, and Nahuel Huapi Lake"},
  "cortina d'ampezzo": {"city":"Cortina d'Ampezzo","slug":"cortina-d-ampezzo","tagline":"The 'Queen of the Dolomites,' a glamorous alpine resort hosting the 2026 Winter Olympics"},
  "taormina": {"city":"Taormina","slug":"taormina","tagline":"A clifftop Sicilian town with an ancient Greek theater framing views of smoking Mount Etna"},
  "capri": {"city":"Capri","slug":"capri","tagline":"A glamorous Tyrrhenian island of cliffside villas, the luminous Blue Grotto, and iconic sea-stack Faraglioni"},
  "positano": {"city":"Positano","slug":"positano","tagline":"A vertical cascade of pastel houses tumbling down to the sea, the postcard image of the Amalfi Coast"},
  "cinque terre": {"city":"Cinque Terre","slug":"cinque-terre","tagline":"Five pastel-colored fishing villages clinging to Italy's Ligurian coast, linked by cliffside hiking trails"},
  "matera": {"city":"Matera","slug":"matera","tagline":"An ancient cave-dwelling city carved into limestone ravines, among the oldest continuously inhabited settlements on Earth"},
  "hoi an": {"city":"Hoi An","slug":"hoi-an","tagline":"A UNESCO-listed lantern-lit trading port frozen in time, where tailor shops and river cruises meet a nearby beach"},
  "phu quoc": {"city":"Phu Quoc","slug":"phu-quoc","tagline":"Vietnam's largest island, ringed by white-sand beaches, fish-sauce villages, and the world's longest sea cable car"},
  "sa pa": {"city":"Sa Pa","slug":"sa-pa","tagline":"A misty highland town of terraced rice paddies and Hmong/Dao hill-tribe villages beneath Vietnam's highest peak"},
  "saint martin's island": {"city":"Saint Martin's Island","slug":"saint-martin-s-island","tagline":"Bangladesh's only coral island, a tiny Bay of Bengal outpost of coconut palms and reef-fringed beaches"},
  "srimangal": {"city":"Srimangal","slug":"srimangal","tagline":"Bangladesh's 'tea capital,' a rolling patchwork of tea gardens, pineapple groves, and rainforest reserves"},
  "siwa oasis": {"city":"Siwa Oasis","slug":"siwa-oasis","tagline":"A remote Western Desert oasis of mudbrick ruins, salt lakes, and the ancient Oracle of Amun that Alexander the Great once consulted"},
  "marsa alam": {"city":"Marsa Alam","slug":"marsa-alam","tagline":"A remote southern Red Sea coast nicknamed the 'Egyptian Maldives,' known for dolphins, whale sharks, and untouched reefs"},
  "dahab": {"city":"Dahab","slug":"dahab","tagline":"A laid-back Sinai backpacker town famous for the Blue Hole dive site and cheap beachfront cafes"},
  "hurghada": {"city":"Hurghada","slug":"hurghada","tagline":"A sprawling Red Sea resort city with reef-fringed islands, diving, and Egypt's largest aquarium"},
  "sharm el sheikh": {"city":"Sharm El Sheikh","slug":"sharm-el-sheikh","tagline":"A Red Sea dive capital on the Sinai Peninsula's tip, with coral walls just offshore from all-inclusive resorts"},
  "mont-saint-michel": {"city":"Mont-Saint-Michel","slug":"mont-saint-michel","tagline":"A tidal island abbey rising from the sand, France's most-visited landmark outside Paris"},
  "saint-tropez": {"city":"Saint-Tropez","slug":"saint-tropez","tagline":"The French Riviera's glamorous yacht harbor, made famous by Brigitte Bardot and jet-set summers"},
  "biarritz": {"city":"Biarritz","slug":"biarritz","tagline":"A Belle Époque beach resort on the Basque coast, and the birthplace of European surfing"},
  "carcassonne": {"city":"Carcassonne","slug":"carcassonne","tagline":"A double-walled medieval fortress city, the largest of its kind still standing in Europe"},
  "chamonix-mont-blanc": {"city":"Chamonix-Mont-Blanc","slug":"chamonix-mont-blanc","tagline":"The birthplace of alpinism, beneath Western Europe's highest peak and the world's highest cable car ascent"},
  "annecy": {"city":"Annecy","slug":"annecy","tagline":"The 'Venice of the Alps,' where a canal-laced old town meets one of Europe's cleanest lakes"},
  "colmar": {"city":"Colmar","slug":"colmar","tagline":"A storybook Alsatian town of half-timbered houses, flower-lined canals, and Christmas-market fame"},
  "avignon": {"city":"Avignon","slug":"avignon","tagline":"The walled 'City of Popes,' with a monumental Gothic palace and the legendary broken Pont Saint-Bénézet"},
  "sokcho": {"city":"Sokcho","slug":"sokcho","tagline":"A coastal gateway to Seoraksan National Park, with East Sea beaches and Korea's famous soft tofu cuisine"},
  "leticia": {"city":"Leticia","slug":"leticia","tagline":"A tri-border Amazon gateway where Colombia, Brazil, and Peru meet along the world's largest river"},
  "san andrés": {"city":"San Andrés","slug":"san-andr-s","tagline":"A Caribbean island escape of turquoise 'sea of seven colors' waters and Raizal island culture"},
  "djanet": {"city":"Djanet","slug":"djanet","tagline":"A remote oasis at the edge of Tassili n'Ajjer, home to some of the world's oldest and largest collections of prehistoric rock art"},
  "timimoun": {"city":"Timimoun","slug":"timimoun","tagline":"A red-ochre Saharan oasis town of mudbrick architecture, palm groves, and a shimmering salt lake"},
  "tamanrasset": {"city":"Tamanrasset","slug":"tamanrasset","tagline":"The Tuareg capital of the Sahara, gateway to the volcanic peaks of the Hoggar mountains"},
  "ghardaïa": {"city":"Ghardaïa","slug":"gharda-a","tagline":"A UNESCO-listed Saharan oasis of five fortified ochre-and-white M'Zab valley towns"},
  "plettenberg bay": {"city":"Plettenberg Bay","slug":"plettenberg-bay","tagline":"Garden Route beach town with white-sand bays, seal colonies, and Big Five safari lodges nearby"},
  "knysna": {"city":"Knysna","slug":"knysna","tagline":"A lagoon town on the Garden Route framed by dramatic sandstone Heads and ancient indigenous forest"},
  "girona": {"city":"Girona","slug":"girona","tagline":"A Catalan medieval jewel of pastel riverside houses, Jewish quarter alleys, and Game of Thrones filming spots"},
  "santiago de compostela": {"city":"Santiago de Compostela","slug":"santiago-de-compostela","tagline":"The pilgrimage endpoint of the Camino de Santiago, crowned by a baroque cathedral holding the apostle's relics"},
  "tofino": {"city":"Tofino","slug":"tofino","tagline":"A remote surf town on Vancouver Island's storm-battered west coast, gateway to Pacific Rim National Park"},
  "charlottetown": {"city":"Charlottetown","slug":"charlottetown","tagline":"Canada's 'Birthplace of Confederation,' with Victorian streets and Anne of Green Gables lore nearby"},
  "whistler": {"city":"Whistler","slug":"whistler","tagline":"Canada's premier ski resort, a pedestrian village beneath twin Olympic peaks"},
  "niagara falls": {"city":"Niagara Falls","slug":"niagara-falls","tagline":"Thundering falls, neon-lit Clifton Hill, and Niagara wine country right next door"},
  "jasper": {"city":"Jasper","slug":"jasper","tagline":"A rebuilding mountain town in Canada's largest Rocky Mountain national park, still as wild and welcoming as ever"},
  "banff": {"city":"Banff","slug":"banff","tagline":"A mountain town wedged between glacier-fed lakes and jagged Rocky Mountain peaks in Canada's first national park"},
  "kaş": {"city":"Kaş","slug":"ka","tagline":"A laid-back diving town on the Turquoise Coast, built over a half-submerged Lycian rock tomb"},
  "mardin": {"city":"Mardin","slug":"mardin","tagline":"A honey-colored stone city cascading down a hillside over the Mesopotamian plain"},
  "çeşme": {"city":"Çeşme","slug":"e-me","tagline":"Izmir's chic Aegean escape, famous for windsurfing beaches and a Genoese castle guarding the harbor"},
  "selçuk": {"city":"Selçuk","slug":"sel-uk","tagline":"The quiet Aegean town beside the vast ruins of ancient Ephesus and the Temple of Artemis"},
  "kuşadası": {"city":"Kuşadası","slug":"ku-adas","tagline":"The Aegean's busiest cruise port, and the closest beach town to ancient Ephesus"},
  "marmaris": {"city":"Marmaris","slug":"marmaris","tagline":"A pine-backed marina town on the Turquoise Coast, famous for its lively bar street and gulet-boat harbor"},
  "fethiye": {"city":"Fethiye","slug":"fethiye","tagline":"A harbor town beneath rock-cut Lycian tombs, gateway to the Blue Lagoon and the Turquoise Coast's best paragliding"},
  "bodrum": {"city":"Bodrum","slug":"bodrum","tagline":"The Turkish Riviera's whitewashed jet-set port, where a Crusader castle guards a lively marina"},
  "göreme": {"city":"Göreme","slug":"g-reme","tagline":"Cappadocia's cave-hotel heart, where hot-air balloons drift over fairy chimneys at sunrise"},
  "murree": {"city":"Murree","slug":"murree","tagline":"A colonial-era hill station in the pines, Pakistan's classic escape from the summer plains"},
  "karimabad": {"city":"Karimabad","slug":"karimabad","tagline":"Hunza Valley's terraced heart, watched over by Rakaposhi and a centuries-old fort"},
  "skardu": {"city":"Skardu","slug":"skardu","tagline":"The roof of the world's gateway — cold deserts, turquoise lakes, and the road to K2"},
  "gilgit": {"city":"Gilgit","slug":"gilgit","tagline":"The Karakoram Highway's mountain crossroads, where three of the world's great ranges meet"},
  "kashan": {"city":"Kashan","slug":"kashan","tagline":"A desert oasis of merchant mansions, rosewater gardens, and one of the world's oldest ziggurats"},
  "konstanz": {"city":"Konstanz","slug":"konstanz","tagline":"A lakeside university town straddling the Swiss border on the shores of Lake Constance"},
  "garmisch-partenkirchen": {"city":"Garmisch-Partenkirchen","slug":"garmisch-partenkirchen","tagline":"Twin Bavarian market towns at the foot of Germany's highest peak, the Zugspitze"},
  "weimar": {"city":"Weimar","slug":"weimar","tagline":"The intellectual capital of German Classicism, where Goethe and Schiller once walked and the Bauhaus was born"},
  "bamberg": {"city":"Bamberg","slug":"bamberg","tagline":"A UNESCO-listed island town of half-timbered houses, smoked beer, and a cathedral rising over the River Regnitz"},
  "baden-baden": {"city":"Baden-Baden","slug":"baden-baden","tagline":"A belle-époque spa town on the edge of the Black Forest, where thermal baths and a grand casino have drawn European royalty for two centuries"},
  "manzhouli": {"city":"Manzhouli","slug":"manzhouli","tagline":"China's busiest land port, where Russian onion domes, Mongolian grasslands, and a 30-meter Matryoshka doll collide"},
  "enshi": {"city":"Enshi","slug":"enshi","tagline":"China's Grand Canyon, carved through Tujia and Miao mountain country in southwestern Hubei"},
  "zhoushan": {"city":"Zhoushan","slug":"zhoushan","tagline":"China's only island-built city — a Buddhist sea kingdom, nine sand beaches, and 1,390 islands scattered across the East China Sea"},
  "jinghong": {"city":"Jinghong","slug":"jinghong","tagline":"Dai temples, elephant-crossed jungles, and Mekong sunsets in China's tropical southern frontier."},
  "wuyishan": {"city":"Wuyishan","slug":"wuyishan","tagline":"Misty tea mountains and a bamboo raft down the Nine-Bend River, where Da Hong Pao legends grow on sheer red cliffs."},
  "huangshan": {"city":"Huangshan","slug":"huangshan","tagline":"Where granite peaks vanish into seas of cloud and Ming-dynasty villages sleep in the valleys below."},
  "vigan": {"city":"Vigan","slug":"vigan","tagline":"Cobblestones, kalesa bells, and candlelight over Calle Crisologo"},
  "panglao": {"city":"Panglao","slug":"panglao","tagline":"Powder-white sands, dive-worthy reefs, and Bohol's laid-back island soul"},
  "siargao": {"city":"Siargao","slug":"siargao","tagline":"Where the waves end and the island wilderness begins"},
  "coron": {"city":"Coron","slug":"coron","tagline":"Limestone cliffs, hidden lagoons, and sunken warships in the Calamian Islands"},
  "el nido": {"city":"El Nido","slug":"el-nido","tagline":"Limestone cliffs, hidden lagoons, and the edge of Bacuit Bay"},
  "boracay": {"city":"Boracay","slug":"boracay","tagline":"Powder-white sand, turquoise water, and a sunset over Willy's Rock"},
  "zhangjiajie": {"city":"Zhangjiajie","slug":"zhangjiajie","tagline":"Where the sandstone pillars of Avatar's Pandora rise straight out of the mist"},
  "windermere": {"city":"Windermere","slug":"windermere","tagline":"England's largest lake, one grand fell-top view at a time"},
  "inverness": {"city":"Inverness","slug":"inverness","tagline":"Capital of the Highlands, where the River Ness meets the sea"},
  "durham": {"city":"Durham","slug":"durham","tagline":"A Norman cathedral crowning a wooded river peninsula, where medieval stone meets student life."},
  "guarujá": {"city":"Guarujá","slug":"guaruj","tagline":"The Pearl of the Atlantic — 27 beaches where São Paulo comes up for air"},
  "cuiabá": {"city":"Cuiabá","slug":"cuiab","tagline":"Brazil's steamy geographic heart, where the Cerrado, Amazon, and Pantanal collide."},
  "stanley": {"city":"Stanley","slug":"stanley","tagline":"Red phone boxes, roaring winds, and king penguins just past the last streetlamp"},
  "tórshavn": {"city":"Tórshavn","slug":"t-rshavn","tagline":"The world's smallest capital, wrapped in turf roofs and fog"},
  "pucón": {"city":"Pucón","slug":"puc-n","tagline":"Adventure capital of the Chilean Lake District, in the shadow of an active volcano"},
  "savonlinna": {"city":"Savonlinna","slug":"savonlinna","tagline":"A 15th-century castle rising mid-lake, sopranos singing from its ramparts every July, and 14,000 islands waiting in the mist beyond."},
  "bentota": {"city":"Bentota","slug":"bentota","tagline":"Where Geoffrey Bawa's gardens spill down to a golden river-mouth beach"},
  "baracoa": {"city":"Baracoa","slug":"baracoa","tagline":"Cuba's first city, walled in by El Yunque and the sea, where the cacao rivers run to the Caribbean's wildest coast"},
  "trinidad": {"city":"Trinidad","slug":"trinidad","tagline":"Cobblestoned colonial time capsule where pastel mansions meet Caribbean beaches"},
  "karakol": {"city":"Karakol","slug":"karakol","tagline":"Trekking capital of the Tian Shan, on the shores of vast Issyk-Kul lake"},
  "kangding": {"city":"Kangding","slug":"kangding","tagline":"High-altitude gateway to the Tibetan world, immortalized in the Kangding Love Song"},
  "trier": {"city":"Trier","slug":"trier","tagline":"Germany's oldest city, built on 2,000 years of Roman stone."},
  "olomouc": {"city":"Olomouc","slug":"olomouc","tagline":"Moravia's baroque secret, crowned by Europe's tallest Holy Trinity Column."},
  "coimbra": {"city":"Coimbra","slug":"coimbra","tagline":"Portugal's ancient university city where Fado echoes through cobblestone hills."},
  "koblenz": {"city":"Koblenz","slug":"koblenz","tagline":"Where the Rhine and Moselle meet at the historic German Corner"},
  "sergiyev posad": {"city":"Sergiyev Posad","slug":"sergiyev-posad","tagline":"Golden-domed heart of Russian Orthodoxy on Moscow's Golden Ring"},
  "magelang": {"city":"Magelang","slug":"magelang","tagline":"Gateway to Borobudur, the world's largest Buddhist temple"},
  "kandy": {"city":"Kandy","slug":"kandy","tagline":"Sri Lanka's hill-country cultural capital, home to the sacred Temple of the Tooth"},
  "rouen": {"city":"Rouen","slug":"rouen","tagline":"Gothic cathedral city on the Seine where Monet painted and Joan of Arc died"},
  "alanya": {"city":"Alanya","slug":"alanya","tagline":"Turkish Riviera beach resort crowned by a Seljuk castle on a rocky peninsula"},
  "puno": {"city":"Puno","slug":"puno","tagline":"High-altitude gateway to Lake Titicaca's floating reed islands and Andean traditions."},
  "lausanne": {"city":"Lausanne","slug":"lausanne","tagline":"Olympic capital rising in terraces above Lake Geneva's vineyard shoreline."},
  "lhasa": {"city":"Lhasa","slug":"lhasa","tagline":"Sacred rooftop of the world, where the Potala Palace crowns a 3,650-meter Tibetan Buddhist capital."},
  "kairouan": {"city":"Kairouan","slug":"kairouan","tagline":"One of Islam's holiest cities, wrapped in a UNESCO-listed medina"},
  "ulm": {"city":"Ulm","slug":"ulm","tagline":"Danube river town crowned by the world's tallest church spire"},
  "agadez": {"city":"Agadez","slug":"agadez","tagline":"Ancient Saharan trading crossroads guarded by a UNESCO mud-brick mosque"},
  "beppu": {"city":"Beppu","slug":"beppu","tagline":"Japan's steaming onsen capital, where the earth itself boils over."},
  "edirne": {"city":"Edirne","slug":"edirne","tagline":"The Ottoman Empire's second capital, crowned by Sinan's masterpiece mosque."},
  "cadiz": {"city":"Cadiz","slug":"cadiz","tagline":"Europe's oldest city, wrapped by Atlantic beaches and Carnival spirit."},
  "kusatsu": {"city":"Kusatsu","slug":"kusatsu","tagline":"Japan's most storied hot-spring town, steaming beside the Yubatake"},
  "regensburg": {"city":"Regensburg","slug":"regensburg","tagline":"A perfectly preserved medieval old town on the Danube, sausages and all"},
  "nablus": {"city":"Nablus","slug":"nablus","tagline":"Ancient souqs, olive-oil soap, and the sweetest kanafeh in the Middle East"},
  "quetzaltenango": {"city":"Quetzaltenango","slug":"quetzaltenango","tagline":"Guatemala's highland second city, a colonial center for Spanish schools and volcano treks"},
  "würzburg": {"city":"Würzburg","slug":"w-rzburg","tagline":"Bavarian wine city crowned by a UNESCO prince-bishops' Residence and the Old Main Bridge"},
  "marbella": {"city":"Marbella","slug":"marbella","tagline":"Glamorous Costa del Sol resort town of yacht marinas, sun-soaked beaches, and whitewashed old-town charm"},
  "brighton": {"city":"Brighton","slug":"brighton","tagline":"Bohemian English seaside city famous for its pier, Regency architecture, and LGBTQ+-friendly nightlife."},
  "potosí": {"city":"Potosí","slug":"potos","tagline":"Colonial silver-mining city beneath the legendary Cerro Rico, one of the highest cities on Earth."},
  "cape coast": {"city":"Cape Coast","slug":"cape-coast","tagline":"Historic Ghanaian coastal city anchored by a UNESCO slave-trade fortress and golden Atlantic beaches."},
  "otaru": {"city":"Otaru","slug":"otaru","tagline":"A romantic canal town of glass, music boxes, and fresh Hokkaido seafood"},
  "león": {"city":"León","slug":"le-n","tagline":"Nicaragua's colonial heart, all cathedral bells, murals, and volcano views"},
  "hạ long": {"city":"Hạ Long","slug":"h-long","tagline":"Gateway to the emerald limestone karsts of UNESCO-listed Ha Long Bay"},
  "dijon": {"city":"Dijon","slug":"dijon","tagline":"The golden heart of Burgundy, serving Gothic spires, world-class wine, and its namesake mustard."},
  "battambang": {"city":"Battambang","slug":"battambang","tagline":"Cambodia's laid-back second city, where French colonial streets meet bamboo trains and hilltop caves."},
  "angra dos reis": {"city":"Angra dos Reis","slug":"angra-dos-reis","tagline":"Rio's tropical escape hatch — a bay of 365 islands, jungle-fringed beaches, and Ilha Grande just a boat ride away."},
  "york": {"city":"York","slug":"york","tagline":"A medieval walled city of Gothic spires, Viking history, and the crooked shop-lined lanes of The Shambles"},
  "leshan": {"city":"Leshan","slug":"leshan","tagline":"Home to the world's largest carved stone Buddha, watching over three rivers at the edge of the Sichuan Basin"},
  "pécs": {"city":"Pécs","slug":"p-cs","tagline":"A sun-warmed Hungarian city of Ottoman-era mosques, Zsolnay ceramics, and Roman-era tombs beneath its streets"},
  "osogbo": {"city":"Osogbo","slug":"osogbo","tagline":"Sacred Yoruba city famed for its UNESCO grove and river festival"},
  "moshi": {"city":"Moshi","slug":"moshi","tagline":"Laid-back trekking base at the foot of Mount Kilimanjaro"},
  "san cristóbal de las casas": {"city":"San Cristóbal de las Casas","slug":"san-crist-bal-de-las-casas","tagline":"Colonial highland city amid pine forests and Maya villages"},
  "cambridge": {"city":"Cambridge","slug":"cambridge","tagline":"Storied university city of grand colleges, riverside punting, and quiet cloistered courtyards."},
  "hebron": {"city":"Hebron","slug":"hebron","tagline":"Ancient West Bank city built around the revered Cave of the Patriarchs and a centuries-old stone souq."},
  "pilsen": {"city":"Pilsen","slug":"pilsen","tagline":"Home of the world's first Pilsner, with a walkable old town and UNESCO-listed underground tunnels."},
  "kamakura": {"city":"Kamakura","slug":"kamakura","tagline":"Ancient shogunate capital of temples, the Great Buddha, and seaside calm"},
  "oxford": {"city":"Oxford","slug":"oxford","tagline":"City of dreaming spires, centuries of scholarship, and cobbled college quads"},
  "saint-louis": {"city":"Saint-Louis","slug":"saint-louis","tagline":"Faded colonial grandeur on a river island where Africa met Europe"},
  "legaspi": {"city":"Legaspi","slug":"legaspi","tagline":"Gateway city beneath the near-perfect cone of Mayon Volcano"},
  "malacca": {"city":"Malacca","slug":"malacca","tagline":"UNESCO trading port where Malay, Chinese, Portuguese, and Dutch heritage collide"},
  "cienfuegos": {"city":"Cienfuegos","slug":"cienfuegos","tagline":"The Pearl of the South, a UNESCO-listed neoclassical port city on a broad bay"},
  "klaipėda": {"city":"Klaipėda","slug":"klaip-da","tagline":"Lithuania's ice-free Baltic port and gateway to the Curonian Spit"},
  "yamoussoukro": {"city":"Yamoussoukro","slug":"yamoussoukro","tagline":"Ivory Coast's serene political capital, home to the world's largest basilica"},
  "reims": {"city":"Reims","slug":"reims","tagline":"Champagne capital of the world, crowned by a Gothic masterpiece"},
  "nakhon ratchasima": {"city":"Nakhon Ratchasima","slug":"nakhon-ratchasima","tagline":"Isan's gateway city, guarding the Khorat Plateau at the edge of Khao Yai's jungle."},
  "velikiy novgorod": {"city":"Velikiy Novgorod","slug":"velikiy-novgorod","tagline":"Cradle of Russian statehood, its Kremlin and river churches predating Moscow itself."},
  "novi sad": {"city":"Novi Sad","slug":"novi-sad","tagline":"Danube fortress city of student energy, Habsburg streets, and Europe's biggest music festival."},
  "freiburg": {"city":"Freiburg","slug":"freiburg","tagline":"Sun-soaked gateway to the Black Forest, a Gothic university city built on solar energy and easygoing charm."},
  "gent": {"city":"Gent","slug":"gent","tagline":"Belgium's canal-laced university city of medieval towers, vegetarian cuisine, and student energy."},
  "porto-novo": {"city":"Porto-Novo","slug":"porto-novo","tagline":"Benin's quiet official capital of royal palaces, Vodun heritage, and lagoon calm, overshadowed by bustling Cotonou."},
  "århus": {"city":"Århus","slug":"rhus","tagline":"Denmark's youthful second city, blending Viking-age roots with student energy and harborfront modernism."},
  "ica": {"city":"Ica","slug":"ica","tagline":"Desert oasis capital of Peru's pisco and wine country, minutes from the palm-ringed Huacachina lagoon."},
  "nakuru": {"city":"Nakuru","slug":"nakuru","tagline":"Rift Valley city on the shore of a flamingo-fringed soda lake, gateway to Kenya's classic safari circuit."},
  "aachen": {"city":"Aachen","slug":"aachen","tagline":"Charlemagne's cathedral capital on Germany's tri-border corner with Belgium and the Netherlands."},
  "haifa": {"city":"Haifa","slug":"haifa","tagline":"Mediterranean port city cascading down Mount Carmel to the golden-domed Bahá'í Gardens."},
  "petrópolis": {"city":"Petrópolis","slug":"petr-polis","tagline":"Brazil's 19th-century Imperial City, tucked into misty mountains above Rio."},
  "baguio": {"city":"Baguio","slug":"baguio","tagline":"Cool mountain retreat in the Cordilleras, the Philippines' pine-covered 'Summer Capital'."},
  "brașov": {"city":"Brașov","slug":"bra-ov","tagline":"Transylvania's fairy-tale medieval hub, gateway to Bran Castle and the Carpathians."},
  "ensenada": {"city":"Ensenada","slug":"ensenada","tagline":"Pacific port city famed for cruise ships, Valle de Guadalupe wine country, and fresh seafood."},
  "mingora": {"city":"Mingora","slug":"mingora","tagline":"Gateway to Pakistan's Swat Valley, where Gandhara ruins meet Himalayan foothills."},
  "valparaíso": {"city":"Valparaíso","slug":"valpara-so","tagline":"Chile's UNESCO port city of cliffside funiculars, street art, and bohemian hills."},
  "nha trang": {"city":"Nha Trang","slug":"nha-trang","tagline":"Vietnam's beach capital of turquoise bays, island hopping, and mud-bath resorts."},
  "utrecht": {"city":"Utrecht","slug":"utrecht","tagline":"The Netherlands' cycling-friendly canal city, crowned by the Dom Tower and its historic university."},
  "viña del mar": {"city":"Viña del Mar","slug":"vi-a-del-mar","tagline":"Chile's 'Garden City' of Pacific beaches, Belle Époque palaces, and the famous international song festival."},
  "yangshuo": {"city":"Yangshuo","slug":"yangshuo","tagline":"Karst-peak river town on the Li and Yulong rivers, China's backpacker and rock-climbing capital near Guilin."},
  "vladimir": {"city":"Vladimir","slug":"vladimir","tagline":"Golden Ring gem of 12th-century white-stone cathedrals on the Klyazma River."},
  "mataram": {"city":"Mataram","slug":"mataram","tagline":"Lombok's laid-back provincial capital and gateway to the Gili Islands and Mount Rinjani."},
  "plovdiv": {"city":"Plovdiv","slug":"plovdiv","tagline":"One of Europe's oldest continuously inhabited cities, layering Roman ruins, Ottoman-era Old Town, and a buzzing creative quarter."},
  "nagano": {"city":"Nagano","slug":"nagano","tagline":"Alpine city of Zenko-ji pilgrims, 1998 Olympic legacy, and gateway to the Japanese Alps."},
  "zhaoqing": {"city":"Zhaoqing","slug":"zhaoqing","tagline":"Guangdong's inkstone capital, where karst peaks rise from Star Lake beside a Ming Dynasty city wall."},
  "nara-shi": {"city":"Nara-shi","slug":"nara-shi","tagline":"Japan's first great capital, where sacred deer roam free beneath UNESCO temples and the Great Buddha."},
  "fenghuang": {"city":"Fenghuang","slug":"fenghuang","tagline":"Riverside Miao and Tujia old town of stilt houses, covered bridges, and lantern-lit nights on the Tuo River."},
  "brugge": {"city":"Brugge","slug":"brugge","tagline":"Medieval canal city of cobblestones, chocolate shops, and Flemish Primitive art."},
  "mek'ele": {"city":"Mek'ele","slug":"mek-ele","tagline":"Highland capital of Tigray, gateway to Aksumite history and the otherworldly Danakil Depression."},
  "mamoudzou": {"city":"Mamoudzou","slug":"mamoudzou","tagline":"The bustling capital of Mayotte, a French island department in the Mozambique Channel between Madagascar and the Comoros."},
  "gisenyi": {"city":"Gisenyi","slug":"gisenyi","tagline":"Rwanda's laid-back Lake Kivu resort town, a short walk from the Congolese border and Goma."},
  "goma": {"city":"Goma","slug":"goma","tagline":"A volcanic lakeside crossroads on the Rwandan border, living in the shadow of Mount Nyiragongo and an active regional conflict."},
  "hirosaki": {"city":"Hirosaki","slug":"hirosaki","tagline":"Tohoku castle town famous for a thousand cherry trees, apple orchards, and Meiji-era brick."},
  "george town": {"city":"George Town","slug":"george-town","tagline":"UNESCO heritage port city of trishaws, street art, and Malaysia's best hawker food."},
  "hamadan": {"city":"Hamadan","slug":"hamadan","tagline":"Ancient Ecbatana in the cool highlands - Avicenna's mountain city."},
  "qom": {"city":"Qom","slug":"qom","tagline":"Iran's clerical heart and shrine city, home to Fatima Masumeh."},
  "karbala": {"city":"Karbala","slug":"karbala","tagline":"Iraq's holiest pilgrimage city, where two golden shrines face each other."},
  "cochin": {"city":"Cochin","slug":"cochin","tagline":"Queen of the Arabian Sea — Chinese fishing nets, spice warehouses, and layers of colonial history."},
  "jeonju": {"city":"Jeonju","slug":"jeonju","tagline":"Korea's soul-food capital, where 800 hanok houses cradle the birthplace of bibimbap."},
  "himeji": {"city":"Himeji","slug":"himeji","tagline":"Home to Japan's finest feudal castle, the hilltop White Heron."},
  "anshun": {"city":"Anshun","slug":"anshun","tagline":"Guizhou's karst heartland and gateway to Huangguoshu, China's largest waterfall, with Ming-garrison Tunpu villages and masked Dixi opera."},
  "shaoxing": {"city":"Shaoxing","slug":"shaoxing","tagline":"A living Jiangnan water town of black-awning boats, arched stone bridges, rice wine and the hometown of writer Lu Xun."},
  "jianshui": {"city":"Jianshui","slug":"jianshui","tagline":"A perfectly preserved Ming and Qing old town of purple pottery, ancient wells and China's second-largest Confucius Temple."},
  "qinhuangdao": {"city":"Qinhuangdao","slug":"qinhuangdao","tagline":"Where the Great Wall meets the sea and Beijing goes to the beach."},
  "kaifeng": {"city":"Kaifeng","slug":"kaifeng","tagline":"Ancient Song-dynasty capital of iron pagodas and night-market food."},
  "guilin": {"city":"Guilin","slug":"guilin","tagline":"Storybook karst peaks and the Li River cruise to Yangshuo."},
  "vladivostok": {"city":"Vladivostok","slug":"vladivostok","tagline":"Russia's Pacific gateway — end of the Trans-Siberian, city of bays, bridges and seafood."},
  "odessa": {"city":"Odessa","slug":"odessa","tagline":"Ukraine's sun-soaked Black Sea port of grand staircases, opera and seaside swagger."},
  "bursa": {"city":"Bursa","slug":"bursa","tagline":"First Ottoman capital, cradled by Mount Uludağ and steaming with silk and thermal springs."},
  "ulan bator": {"city":"Ulan Bator","slug":"ulan-bator","tagline":"The world's coldest capital and Mongolia's gateway to the steppe."},
  "islamabad": {"city":"Islamabad","slug":"islamabad","tagline":"Pakistan's calm, green planned capital beneath the Margalla Hills."},
  "pretoria": {"city":"Pretoria","slug":"pretoria","tagline":"South Africa's jacaranda-shaded administrative capital of monuments and embassies."},
  "jamestown": {"city":"Jamestown","slug":"jamestown","tagline":"One of Earth's most remote capitals - Georgian streets, 699 steps, Napoleon's exile."},
  "saint-pierre": {"city":"Saint-Pierre","slug":"saint-pierre","tagline":"France's last outpost in North America - colorful, foggy, and Basque-Breton."},
  "la romana": {"city":"La Romana","slug":"la-romana","tagline":"Sugar-town-turned-resort gateway to Saona, golf, and a Mediterranean village."},
  "aleppo": {"city":"Aleppo","slug":"aleppo","tagline":"One of the world's oldest continuously inhabited cities, rebuilding around its ancient citadel and souqs."},
  "rovaniemi": {"city":"Rovaniemi","slug":"rovaniemi","tagline":"The official hometown of Santa Claus and Finland's gateway to the Arctic Circle."},
  "puducherry": {"city":"Puducherry","slug":"puducherry","tagline":"France's Indian coast — mustard villas, a sea-facing promenade, and Tamil-French soul."},
  "tozeur": {"city":"Tozeur","slug":"tozeur","tagline":"Saharan palm oasis of brick medinas, salt lakes, and Star Wars sands."},
  "timbuktu": {"city":"Timbuktu","slug":"timbuktu","tagline":"Legendary Saharan caravan city of mud-brick mosques and ancient manuscripts."},
  "essaouira": {"city":"Essaouira","slug":"essaouira","tagline":"Windswept Atlantic medina of blue boats, ramparts, and Gnaoua rhythm."},
  "puerto natales": {"city":"Puerto Natales","slug":"puerto-natales","tagline":"Windswept Patagonian port on Last Hope Sound, the launchpad for Torres del Paine."},
  "campeche": {"city":"Campeche","slug":"campeche","tagline":"A pastel-walled colonial port on the Gulf, ramparts and bastions guarding a UNESCO old town."},
  "arequipa": {"city":"Arequipa","slug":"arequipa","tagline":"Peru's 'White City', carved from volcanic sillar beneath the cone of El Misti."},
  "poprad": {"city":"Poprad","slug":"poprad","tagline":"The gateway city to Slovakia's soaring High Tatras."},
  "odense": {"city":"Odense","slug":"odense","tagline":"Hans Christian Andersen's fairy-tale hometown on the island of Funen."},
  "mostar": {"city":"Mostar","slug":"mostar","tagline":"Ottoman old town split by an emerald river and a leaping stone bridge."},
  "karlovy vary": {"city":"Karlovy Vary","slug":"karlovy-vary","tagline":"West Bohemia's grand belle-époque spa town of thermal springs, colonnades and Becherovka"},
  "grenoble": {"city":"Grenoble","slug":"grenoble","tagline":"The Capital of the Alps — a flat, mountain-ringed student city that's France's springboard to the peaks."},
  "perugia": {"city":"Perugia","slug":"perugia","tagline":"Etruscan hill town and green heart of Italy, where medieval alleys, chocolate and jazz mingle with a lively student buzz."},
  "sihanoukville": {"city":"Sihanoukville","slug":"sihanoukville","tagline":"Cambodia's beach-and-casino boomtown, launchpad to the islands of Koh Rong."},
  "cyangugu": {"city":"Cyangugu","slug":"cyangugu","tagline":"Lakeside Rwandan border town on Lake Kivu, gateway to Nyungwe's chimps and canopy walk."},
  "morondava": {"city":"Morondava","slug":"morondava","tagline":"Palm-fringed Sakalava port on the Mozambique Channel, gateway to the Avenue of the Baobabs."},
  "brades": {"city":"Brades","slug":"brades","tagline":"The 'Emerald Isle of the Caribbean' — Irish heritage, a buried city, and a live volcano."},
  "mariehamn": {"city":"Mariehamn","slug":"mariehamn","tagline":"Swedish-speaking island capital of Åland, all sailing ships, cycling, and Baltic archipelago calm."},
  "longyearbyen": {"city":"Longyearbyen","slug":"longyearbyen","tagline":"The world's northernmost town — polar bears, glaciers, and the Arctic at the edge of the map."},
  "encarnación": {"city":"Encarnación","slug":"encarnaci-n","tagline":"The 'Pearl of the South', Paraguay's river-beach and Carnival capital."},
  "chetumal": {"city":"Chetumal","slug":"chetumal","tagline":"Quintana Roo's capital on the bay, gateway to Bacalar and the Maya world."},
  "cabo frio": {"city":"Cabo Frio","slug":"cabo-frio","tagline":"White-sand beaches and cool dunes on Rio's Região dos Lagos."},
  "zhangye": {"city":"Zhangye","slug":"zhangye","tagline":"Silk Road oasis under the Rainbow Mountains."},
  "turpan": {"city":"Turpan","slug":"turpan","tagline":"China's hottest oasis — grapes, ruins, and the Flaming Mountains."},
  "yaroslavl": {"city":"Yaroslavl","slug":"yaroslavl","tagline":"Golden Ring jewel where the Volga meets the Kotorosl."},
  "constanța": {"city":"Constanța","slug":"constan-a","tagline":"Romania's ancient Black Sea port, from Roman Tomis to the Mamaia beach strip."},
  "denizli": {"city":"Denizli","slug":"denizli","tagline":"Turkey's textile city and the gateway to Pamukkale's white travertines."},
  "bukhara": {"city":"Bukhara","slug":"bukhara","tagline":"A living Silk Road museum of madrasas, minarets and turquoise domes."},
  "lübeck": {"city":"Lübeck","slug":"l-beck","tagline":"Brick-Gothic 'Queen of the Hanseatic League', marzipan, and Baltic charm."},
  "rimini": {"city":"Rimini","slug":"rimini","tagline":"Adriatic beach capital of Fellini, Roman ruins, and endless nightlife."},
  "parma": {"city":"Parma","slug":"parma","tagline":"Emilia-Romagna's capital of Parmesan, prosciutto, and Verdi opera."},
  "laayoune": {"city":"Laayoune","slug":"laayoune","tagline":"The largest city of Western Sahara, on the edge of the Atlantic Sahara."},
  "kralendijk": {"city":"Kralendijk","slug":"kralendijk","tagline":"Dutch Caribbean capital and gateway to world-class shore diving."},
  "phitsanulok": {"city":"Phitsanulok","slug":"phitsanulok","tagline":"Northern gateway on the Nan River, home to Thailand's most revered Buddha."},
  "inhambane": {"city":"Inhambane","slug":"inhambane","tagline":"Dhow-filled bay town of coconut palms, gateway to Tofo and Barra's whale sharks and manta rays."},
  "ziguinchor": {"city":"Ziguinchor","slug":"ziguinchor","tagline":"Riverside capital of lush Casamance, gateway to Diola villages and the beaches of Cap Skirring."},
  "port sudan": {"city":"Port Sudan","slug":"port-sudan","tagline":"Sudan's Red Sea port and gateway to the Sanganeb reef and the coral ruins of Suakin."},
  "calabar": {"city":"Calabar","slug":"calabar","tagline":"Nigeria's carnival city on the Cross River, green, historic and welcoming."},
  "bulawayo": {"city":"Bulawayo","slug":"bulawayo","tagline":"Zimbabwe's second city of wide colonial avenues and Matobo's granite hills."},
  "ouarzazate": {"city":"Ouarzazate","slug":"ouarzazate","tagline":"Morocco's desert film capital and gateway to the Sahara."},
  "chengde": {"city":"Chengde","slug":"chengde","tagline":"The Qing emperors' summer capital — China's largest imperial garden and a 'Little Potala' amid mountain temples."},
  "hualien city": {"city":"Hualien City","slug":"hualien-city","tagline":"East-coast gateway to Taroko Gorge — marble canyons, Pacific whales, and night-market feasts."},
  "ponce": {"city":"Ponce","slug":"ponce","tagline":"The 'Pearl of the South' — neoclassical Ponce Creole mansions, a candy-striped firehouse, and Caribbean plazas."},
  "ohrid": {"city":"Ohrid","slug":"ohrid","tagline":"A lakeside town of ancient churches on one of Europe's oldest and deepest lakes."},
  "kalamata": {"city":"Kalamata","slug":"kalamata","tagline":"Sun-baked Messinian capital of olives, seafront tavernas, and the wild Mani beyond."},
  "nîmes": {"city":"Nîmes","slug":"n-mes","tagline":"France's Rome — home to the world's best-preserved Roman arena and the birthplace of denim."},
  "toulon": {"city":"Toulon","slug":"toulon","tagline":"France's great naval port, cradled by the Rade and Mont Faron."},
  "tarragona": {"city":"Tarragona","slug":"tarragona","tagline":"Roman Tarraco on the Costa Daurada, ruins above the Mediterranean."},
  "san sebastián": {"city":"San Sebastián","slug":"san-sebasti-n","tagline":"Basque beach city where pintxos, La Concha, and Michelin stars meet."},
  "saipan": {"city":"Saipan","slug":"saipan","tagline":"The Marianas' laid-back main island — turquoise dive sites, WWII history, and endless summer."},
  "cap-haïtien": {"city":"Cap-Haïtien","slug":"cap-ha-tien","tagline":"Haiti's colonial second city, gateway to the mountaintop Citadelle and Sans-Souci Palace."},
  "antsiranana": {"city":"Antsiranana","slug":"antsiranana","tagline":"French colonial port on the world's second-largest natural bay, gateway to Madagascar's wild north."},
  "urganch": {"city":"Urganch","slug":"urganch","tagline":"Gateway to Khiva – Silk Road Khorezm on the edge of the Kyzylkum."},
  "taupo": {"city":"Taupo","slug":"taupo","tagline":"New Zealand's Great Lake – geothermal steam, Huka Falls, and volcano trails."},
  "cayenne": {"city":"Cayenne","slug":"cayenne","tagline":"France in the Amazon – Creole markets, colonial squares, and a rocket base next door."},
  "mytilene": {"city":"Mytilene","slug":"mytilene","tagline":"Lesbos's easygoing capital of ouzo, castles and soft Aegean light."},
  "visby": {"city":"Visby","slug":"visby","tagline":"Scandinavia's best-preserved medieval town, walled in roses and ruins."},
  "gibraltar": {"city":"Gibraltar","slug":"gibraltar","tagline":"A British Rock at the gates of the Mediterranean, ruled by wild monkeys."},
  "matsumoto": {"city":"Matsumoto","slug":"matsumoto","tagline":"Gateway to the Japan Alps — the black 'Crow Castle' and wasabi-fed mountain streams."},
  "santander": {"city":"Santander","slug":"santander","tagline":"Belle-epoque bay city — golden Sardinero sand and Renzo Piano's Centro Botin."},
  "santiago de cuba": {"city":"Santiago de Cuba","slug":"santiago-de-cuba","tagline":"Cradle of the Revolution — son and trova, Caribbean heat, and Sierra Maestra views."},
  "eilat": {"city":"Eilat","slug":"eilat","tagline":"Israel's Red Sea playground - year-round sun, coral reefs, and duty-free desert nights."},
  "aqaba": {"city":"Aqaba","slug":"aqaba","tagline":"Jordan's Red Sea gateway - coral reefs, desert forts, and the road to Wadi Rum and Petra."},
  "zadar": {"city":"Zadar","slug":"zadar","tagline":"Roman ruins, a singing sea, and the world's most beautiful sunset."},
  "konya": {"city":"Konya","slug":"konya","tagline":"Rumi's whirling-dervish city and Seljuk heart of Anatolia."},
  "rabat": {"city":"Rabat","slug":"rabat","tagline":"Morocco's relaxed ocean capital of kasbahs, gardens and storks."},
  "agra": {"city":"Agra","slug":"agra","tagline":"The Mughals' marble masterpiece, crowned by the Taj Mahal."},
  "sylhet": {"city":"Sylhet","slug":"sylhet","tagline":"Bangladesh's tea-garden gateway of saintly shrines, wetlands and diaspora ties to Britain."},
  "manzanillo": {"city":"Manzanillo","slug":"manzanillo","tagline":"Mexico's Pacific 'sailfish capital' of twin bays, golden beaches and a busy port."},
  "playa del carmen": {"city":"Playa del Carmen","slug":"playa-del-carmen","tagline":"Riviera Maya's beach-and-nightlife capital, where Quinta Avenida meets the Caribbean."},
  "şanlıurfa": {"city":"Şanlıurfa","slug":"anl-urfa","tagline":"City of Prophets, sacred carp pools, and the world's oldest temple."},
  "monastir": {"city":"Monastir","slug":"monastir","tagline":"Bourguiba's seaside hometown, ringed by a film-set Ribat."},
  "sousse": {"city":"Sousse","slug":"sousse","tagline":"UNESCO medina, Roman mosaics, and Boujaffar's endless sand."},
  "pula": {"city":"Pula","slug":"pula","tagline":"A Roman amphitheatre by the Adriatic and the gateway to Istria's beaches and vineyards."},
  "jaffna": {"city":"Jaffna","slug":"jaffna","tagline":"Sri Lanka's Tamil cultural capital — soaring temple gopurams, colonial forts, and island causeways."},
  "galle": {"city":"Galle","slug":"galle","tagline":"Dutch-built ramparts, boutique cafes, and Indian Ocean sunsets on Sri Lanka's south coast."},
  "puerto plata": {"city":"Puerto Plata","slug":"puerto-plata","tagline":"Amber Coast capital of Victorian streets, cable cars, and golden beaches."},
  "iquitos": {"city":"Iquitos","slug":"iquitos","tagline":"The Amazon's improbable metropolis, reachable only by river or air."},
  "cuenca": {"city":"Cuenca","slug":"cuenca","tagline":"Andean colonial jewel of blue domes, cobblestones, and Panama hats."},
  "udaipur": {"city":"Udaipur","slug":"udaipur","tagline":"Rajasthan's 'City of Lakes' — palaces, ghats, and sunset boat rides on Lake Pichola."},
  "podgorica": {"city":"Podgorica","slug":"podgorica","tagline":"Montenegro's low-key capital of Ottoman lanes, river bridges, and mountain gateways."},
  "sibiu": {"city":"Sibiu","slug":"sibiu","tagline":"Saxon Transylvania's medieval jewel, where the rooftops watch you back."},
  "perpignan": {"city":"Perpignan","slug":"perpignan","tagline":"The Catalan capital of France — sun-baked squares and a Majorcan palace between the Pyrenees and the Mediterranean."},
  "salamanca": {"city":"Salamanca","slug":"salamanca","tagline":"Golden-sandstone university city where students fill the tapas bars beneath Spain's grandest Plaza Mayor."},
  "pyatigorsk": {"city":"Pyatigorsk","slug":"pyatigorsk","tagline":"Lermontov's Caucasus spa town of mineral springs and mountain air."},
  "serekunda": {"city":"Serekunda","slug":"serekunda","tagline":"The Gambia's buzzing heart — markets, beaches, and the Senegambia strip."},
  "jingdezhen": {"city":"Jingdezhen","slug":"jingdezhen","tagline":"China's thousand-year Porcelain Capital, where the kilns still glow."},
  "trincomalee": {"city":"Trincomalee","slug":"trincomalee","tagline":"Sri Lanka's east-coast harbour city of clifftop temples and calm blue beaches."},
  "hamilton": {"city":"Hamilton","slug":"hamilton","tagline":"Bermuda's pastel harbour capital of Front Street shops and pink-sand beaches."},
  "chios": {"city":"Chios","slug":"chios","tagline":"Aegean island of mastic villages, medieval mansions, and quiet beaches."},
  "banyuwangi": {"city":"Banyuwangi","slug":"banyuwangi","tagline":"Java's easternmost frontier -- blue-fire volcano, wild safari plains and the ferry to Bali."},
  "malang": {"city":"Malang","slug":"malang","tagline":"Cool-climate colonial hill city, gateway to Bromo and rainbow villages."},
  "tampere": {"city":"Tampere","slug":"tampere","tagline":"Finland's lakeside sauna capital, where mill-town grit meets Moomins."},
  "flores": {"city":"Flores","slug":"flores","tagline":"Colorful island town on Lake Peten Itza and Guatemala's gateway to the Maya ruins of Tikal."},
  "acapulco de juarez": {"city":"Acapulco de Juarez","slug":"acapulco-de-juarez","tagline":"Mexico's golden-age Pacific bay resort - cliff divers, beaches and nightlife - rebuilding after Hurricane Otis."},
  "zacatecas": {"city":"Zacatecas","slug":"zacatecas","tagline":"Pink-stone Baroque cathedrals and silver-mine history stacked up a high-desert ravine."},
  "aurangabad": {"city":"Aurangabad","slug":"aurangabad","tagline":"The gateway to the rock-cut wonders of Ellora and Ajanta."},
  "paphos": {"city":"Paphos","slug":"paphos","tagline":"Cyprus's mosaic-rich harbour town where legend says Aphrodite rose from the sea."},
  "batumi": {"city":"Batumi","slug":"batumi","tagline":"Georgia's palm-fringed Black Sea resort of casinos, quirky towers and subtropical rain."},
  "jodhpur": {"city":"Jodhpur","slug":"jodhpur","tagline":"The Blue City beneath a mighty desert fort, gateway to the Thar."},
  "samarkand": {"city":"Samarkand","slug":"samarkand","tagline":"The Silk Road's blue-domed jewel, capital of Timur's empire."},
  "fès": {"city":"Fès","slug":"f-s","tagline":"A living medieval maze of tanneries, madrasas and the world's oldest university."},
  "siddharthanagar": {"city":"Siddharthanagar","slug":"siddharthanagar","tagline":"Nepal's Terai gateway to Lumbini, birthplace of the Buddha."},
  "houmt el souk": {"city":"Houmt El Souk","slug":"houmt-el-souk","tagline":"Djerba's whitewashed island capital of souks, seafront forts, and ancient synagogues."},
  "ta'if": {"city":"Ta'if","slug":"ta-if","tagline":"Saudi Arabia's cool mountain summer capital, city of roses and highland resorts."},
  "shangri-la": {"city":"Shangri-La","slug":"shangri-la","tagline":"A Tibetan-plateau town of golden monasteries, grasslands and the gateway to the eastern Himalaya."},
  "maun": {"city":"Maun","slug":"maun","tagline":"Botswana's dusty tourism capital and the gateway to the Okavango Delta."},
  "cox's bazar": {"city":"Cox's Bazar","slug":"cox-s-bazar","tagline":"The world's longest natural sea beach, ~120 km of Bay of Bengal sand."},
  "banda aceh": {"city":"Banda Aceh","slug":"banda-aceh","tagline":"Islam's 'Porch of Mecca,' reborn after the 2004 tsunami."},
  "ålesund": {"city":"Ålesund","slug":"lesund","tagline":"Art Nouveau town on the fjords, gateway to Geiranger."},
  "kayseri": {"city":"Kayseri","slug":"kayseri","tagline":"Seljuk Anatolia at the foot of Mount Erciyes — pastırma, citadel bazaars and the road to Cappadocia."},
  "salerno": {"city":"Salerno","slug":"salerno","tagline":"Gateway to the Amalfi Coast, with a medieval heart and a palm-lined seafront."},
  "salta": {"city":"Salta","slug":"salta","tagline":"Argentina's 'La Linda' — colonial splendor and gateway to the wine-drenched Andes."},
  "puebla": {"city":"Puebla","slug":"puebla","tagline":"Mexico's colonial jewel of Talavera-tiled facades, baroque churches and the birthplace of mole poblano."},
  "luang prabang": {"city":"Luang Prabang","slug":"luang-prabang","tagline":"Laos's serene UNESCO royal capital of golden temples, saffron-robed monks and misty Mekong mornings."},
  "luxor": {"city":"Luxor","slug":"luxor","tagline":"The world's greatest open-air museum, where Karnak, the Valley of the Kings and Nile feluccas share one riverbank."},
  "tangier": {"city":"Tangier","slug":"tangier","tagline":"Morocco's northern gateway — a whitewashed medina above the Strait of Gibraltar."},
  "pamplona": {"city":"Pamplona","slug":"pamplona","tagline":"Navarre's walled city of San Fermín, bull-running, and Basque-inspired pintxos."},
  "granada": {"city":"Granada","slug":"granada","tagline":"Andalusia's Moorish jewel — the Alhambra, free tapas, and Sierra Nevada snow."},
  "pemba": {"city":"Pemba","slug":"pemba","tagline":"A palm-fringed diving gateway on one of Africa's largest natural bays."},
  "tours": {"city":"Tours","slug":"tours","tagline":"The white-and-blue gateway to the Loire Valley's châteaux and vineyards."},
  "cork": {"city":"Cork","slug":"cork","tagline":"Ireland's rebel city — a foodie harbour town of pubs, bells and Georgian charm."},
  "constantine": {"city":"Constantine","slug":"constantine","tagline":"Algeria's dramatic City of Bridges, perched over the Rhumel Gorge."},
  "kumasi": {"city":"Kumasi","slug":"kumasi","tagline":"The Garden City and beating heart of the Ashanti kingdom, ringed by kente and gold."},
  "livingstone": {"city":"Livingstone","slug":"livingstone","tagline":"Zambia's gateway to Victoria Falls, where the Zambezi thunders into the mist."},
  "punta arenas": {"city":"Punta Arenas","slug":"punta-arenas","tagline":"Windswept Patagonian port on the Strait of Magellan, gateway to penguins and Torres del Paine."},
  "cockburn town": {"city":"Cockburn Town","slug":"cockburn-town","tagline":"Turks & Caicos' sleepy salt-era capital — Bermudian streets, a wall dive, and winter whales."},
  "willemstad": {"city":"Willemstad","slug":"willemstad","tagline":"Candy-colored Dutch colonial waterfront, a floating bridge, and world-class reef diving."},
  "la ceiba": {"city":"La Ceiba","slug":"la-ceiba","tagline":"Honduras's Caribbean party town and gateway to the Bay Islands and Pico Bonito."},
  "surat thani": {"city":"Surat Thani","slug":"surat-thani","tagline":"Southern Thailand's mainland gateway to Samui, Pha Ngan and Tao."},
  "puerto princesa": {"city":"Puerto Princesa","slug":"puerto-princesa","tagline":"Palawan's laid-back gateway to an underground river and island-hopping paradise."},
  "mysore": {"city":"Mysore","slug":"mysore","tagline":"Karnataka's regal city of palaces, sandalwood, silk, and yoga."},
  "kurashiki": {"city":"Kurashiki","slug":"kurashiki","tagline":"Okayama's canal town of white-walled warehouses, Western art, and artisan denim."},
  "takamatsu": {"city":"Takamatsu","slug":"takamatsu","tagline":"Shikoku's gateway city — sanuki udon, a strolling garden, and ferries to the art islands."},
  "barranquilla": {"city":"Barranquilla","slug":"barranquilla","tagline":"Colombia's Caribbean 'Golden Gate' — home of the country's biggest Carnival, Shakira, and the reborn Magdalena riverfront."},
  "santa marta": {"city":"Santa Marta","slug":"santa-marta","tagline":"Colombia's oldest surviving city — Caribbean beaches, Sierra Nevada peaks, and the gateway to Tayrona and the Lost City."},
  "oaxaca": {"city":"Oaxaca","slug":"oaxaca","tagline":"Mexico's soul of mezcal, mole, and Zapotec craft, wrapped around a golden colonial core."},
  "road town": {"city":"Road Town","slug":"road-town","tagline":"Laid-back BVI capital and sailing mecca, gateway to Virgin Gorda and The Baths."},
  "kermanshah": {"city":"Kermanshah","slug":"kermanshah","tagline":"Kurdish heartland of western Iran, guarded by Sassanid rock reliefs and ancient inscriptions."},
  "malindi": {"city":"Malindi","slug":"malindi","tagline":"Indian Ocean beach town where Swahili history meets a slice of 'Little Italy'."},
  "gondar": {"city":"Gondar","slug":"gondar","tagline":"Ethiopia's 'Camelot' — 17th-century royal castles, painted churches, and the gateway to the Simien Mountains."},
  "datong": {"city":"Datong","slug":"datong","tagline":"Coal city turned heritage capital — Buddhist grottoes, a hanging temple, and a reborn walled old town."},
  "rostock": {"city":"Rostock","slug":"rostock","tagline":"Hanseatic Baltic port of red-brick Gothic, sandy Warnemünde, and cruise-ship days."},
  "alice springs": {"city":"Alice Springs","slug":"alice-springs","tagline":"Australia's Red Centre heart: outback ranges, Aboriginal art, and the gateway to Uluru."},
  "rotorua": {"city":"Rotorua","slug":"rotorua","tagline":"Geysers, hot springs and living Māori culture on the shores of a caldera lake."},
  "mazatlán": {"city":"Mazatlán","slug":"mazatl-n","tagline":"Pearl of the Pacific: Mexico's longest malecón, a colorful Old Town, and Carnival by the sea."},
  "madurai": {"city":"Madurai","slug":"madurai","tagline":"Tamil Nadu's ancient temple city — the towering gopurams of Meenakshi Amman, jasmine markets, and 2,500 years of unbroken life."},
  "huế": {"city":"Huế","slug":"hu","tagline":"Vietnam's former imperial capital — a walled Citadel, royal tombs, and refined court cuisine on the Perfume River."},
  "kanazawa": {"city":"Kanazawa","slug":"kanazawa","tagline":"Japan's best-preserved castle town — a legendary garden, gold leaf, and geisha teahouse streets."},
  "turku": {"city":"Turku","slug":"turku","tagline":"Finland's oldest city, on the Aura River and the gateway to the archipelago."},
  "cagliari": {"city":"Cagliari","slug":"cagliari","tagline":"Sardinia's sun-baked capital: hilltop Castello, Roman ruins, and Poetto beach."},
  "corfu": {"city":"Corfu","slug":"corfu","tagline":"Venetian old town, twin fortresses, and the Ionian's greenest island."},
  "la serena": {"city":"La Serena","slug":"la-serena","tagline":"Chile's neocolonial beach city and gateway to the star-filled Elqui Valley."},
  "santiago de querétaro": {"city":"Santiago de Querétaro","slug":"santiago-de-quer-taro","tagline":"A UNESCO colonial gem of pink-stone plazas, aqueduct arches, and wine country."},
  "cusco": {"city":"Cusco","slug":"cusco","tagline":"The ancient Inca capital, gateway to Machu Picchu and the Sacred Valley."},
  "da lat": {"city":"Da Lat","slug":"da-lat","tagline":"Vietnam's cool French-colonial highland retreat of pine forests, lakes and flower gardens."},
  "blantyre": {"city":"Blantyre","slug":"blantyre","tagline":"Malawi's commercial capital, gateway to Mount Mulanje and the southern tea highlands."},
  "aswan": {"city":"Aswan","slug":"aswan","tagline":"Egypt's serene southern gateway of Nile feluccas, Nubian villages and riverside temples."},
  "taichung": {"city":"Taichung","slug":"taichung","tagline":"Taiwan's laid-back middle city and the birthplace of bubble tea."},
  "liberia": {"city":"Liberia","slug":"liberia","tagline":"Guanacaste's sun-baked 'White City' and gateway to the Pacific beaches."},
  "fort-de-france": {"city":"Fort-de-France","slug":"fort-de-france","tagline":"Creole capital of Martinique, between fort, market and volcano."},
  "abha": {"city":"Abha","slug":"abha","tagline":"Saudi Arabia's cool mountain city, the misty 'Bride of the Mountain' in Asir."},
  "salalah": {"city":"Salalah","slug":"salalah","tagline":"Oman's green south, where the khareef monsoon and frankincense meet the sea."},
  "najaf": {"city":"Najaf","slug":"najaf","tagline":"Iraq's holy city of the golden shrine, cradle of Shia pilgrimage."},
  "veracruz": {"city":"Veracruz","slug":"veracruz","tagline":"Mexico's oldest port, alive with son jarocho, seafood and Carnival on the Gulf."},
  "sucre": {"city":"Sucre","slug":"sucre","tagline":"Bolivia's whitewashed constitutional capital, where colonial grandeur meets dinosaur tracks."},
  "trujillo": {"city":"Trujillo","slug":"trujillo","tagline":"Peru's City of Eternal Spring, ringed by adobe empires and surf-town sunsets."},
  "kashgar": {"city":"Kashgar","slug":"kashgar","tagline":"Silk Road oasis and China's best-preserved Islamic old city, gateway to the Pamirs."},
  "luoyang": {"city":"Luoyang","slug":"luoyang","tagline":"Ancient dynastic capital of the Longmen grottoes, white horses, and peonies."},
  "gaziantep": {"city":"Gaziantep","slug":"gaziantep","tagline":"UNESCO gastronomy capital of baklava, pistachios, and Roman mosaics."},
  "varna": {"city":"Varna","slug":"varna","tagline":"Bulgaria's sea capital — Black Sea beaches, Roman baths, and the world's oldest gold."},
  "lugano": {"city":"Lugano","slug":"lugano","tagline":"Switzerland's Italian soul — a palm-lined lake framed by alpine peaks."},
  "cardiff": {"city":"Cardiff","slug":"cardiff","tagline":"Wales's compact capital of castles, choirs, and rugby roar."},
  "tirupati": {"city":"Tirupati","slug":"tirupati","tagline":"Gateway to Tirumala — hill shrine of Lord Venkateswara and one of Earth's most-visited temples."},
  "beihai": {"city":"Beihai","slug":"beihai","tagline":"Silver-sand beaches, a colonial arcade old town, and the ferry to volcanic Weizhou Island."},
  "porto seguro": {"city":"Porto Seguro","slug":"porto-seguro","tagline":"Where Brazil began — the Discovery Coast's colonial cliff-top and endless Bahia beaches."},
  "le gosier": {"city":"Le Gosier","slug":"le-gosier","tagline":"Guadeloupe's breezy resort town of Creole beaches and its offshore islet."},
  "kingston": {"city":"Kingston","slug":"kingston","tagline":"Jamaica's pulsing capital, birthplace of reggae and Blue Mountain coffee."},
  "funchal": {"city":"Funchal","slug":"funchal","tagline":"Atlantic island capital of levada walks, wine, and eternal spring."},
  "dali": {"city":"Dali","slug":"dali","tagline":"Bai heartland between Cangshan's peaks and Erhai's shore — old-town lanes, lake villages and mountain air."},
  "yazd": {"city":"Yazd","slug":"yazd","tagline":"A honey-colored desert city of windcatchers, mud-brick alleys and living Zoroastrian tradition."},
  "gyeongju": {"city":"Gyeongju","slug":"gyeongju","tagline":"Korea's ancient Silla capital — royal tombs, stone temples and a thousand years of history in the open air."},
  "agadir": {"city":"Agadir","slug":"agadir","tagline":"Morocco's sun-soaked Atlantic beach resort, rebuilt bold after the 1960 quake."},
  "morelia": {"city":"Morelia","slug":"morelia","tagline":"Michoacán's rose-stone colonial jewel — a UNESCO city of cathedrals and aqueducts."},
  "mérida": {"city":"Mérida","slug":"m-rida","tagline":"The White City — colonial grandeur, Maya heritage, and Mexico's safest big city."},
  "ostrava": {"city":"Ostrava","slug":"ostrava","tagline":"Czechia's gritty steel city reborn — blast furnaces turned festival grounds."},
  "montpellier": {"city":"Montpellier","slug":"montpellier","tagline":"Sun-soaked university city near the Med, built around a grand medieval square."},
  "lviv": {"city":"Lviv","slug":"lviv","tagline":"Habsburg-era coffee capital of western Ukraine, all cobblestones and cathedrals."},
  "erfurt": {"city":"Erfurt","slug":"erfurt","tagline":"Thuringia's medieval capital, where an inhabited bridge crosses the Gera and Luther studied."},
  "bremen": {"city":"Bremen","slug":"bremen","tagline":"Hanseatic port of fairy-tale musicians, a UNESCO market square, and the winding Schnoor."},
  "heidelberg": {"city":"Heidelberg","slug":"heidelberg","tagline":"Romantic Germany distilled — a castle ruin, the oldest university, and the Neckar valley."},
  "saint john's": {"city":"Saint John's","slug":"saint-john-s","tagline":"Antigua's cruise-port capital of Georgian quays, 365 beaches, and Nelson's Dockyard sailing."},
  "yangzhou": {"city":"Yangzhou","slug":"yangzhou","tagline":"Canal city of classical gardens, Slender West Lake, and refined Huaiyang cuisine."},
  "bahir dar": {"city":"Bahir Dar","slug":"bahir-dar","tagline":"Palm-lined lakeside city on Lake Tana, gateway to island monasteries and the Blue Nile Falls."},
  "labuan bajo": {"city":"Labuan Bajo","slug":"labuan-bajo","tagline":"Flores gateway to Komodo dragons, pink beaches and world-class diving."},
  "nelson": {"city":"Nelson","slug":"nelson","tagline":"New Zealand's sunniest city and craft-loving gateway to Abel Tasman."},
  "dunedin": {"city":"Dunedin","slug":"dunedin","tagline":"Scottish-founded city of Victorian grandeur, students and wild Otago coast."},
  "aomori": {"city":"Aomori","slug":"aomori","tagline":"Honshu's snowy northern tip — giant Nebuta lanterns, apple orchards, Hakkoda peaks, and the gateway to Hokkaido."},
  "matsuyama": {"city":"Matsuyama","slug":"matsuyama","tagline":"Shikoku's easygoing capital — Japan's oldest hot spring, a hilltop castle, and the haiku of Masaoka Shiki."},
  "kumamoto": {"city":"Kumamoto","slug":"kumamoto","tagline":"Kyushu's castle city — mighty ramparts, spring-fed gardens, and the volcano-fed plains of Mount Aso."},
  "surakarta": {"city":"Surakarta","slug":"surakarta","tagline":"Central Java's soulful royal city of palaces, batik, and Javanese tradition."},
  "padang": {"city":"Padang","slug":"padang","tagline":"West Sumatra's coastal capital of rendang, sunsets, and surf-island gateways."},
  "bandung": {"city":"Bandung","slug":"bandung","tagline":"Java's cool-highland city of Art Deco, factory outlets, and volcano views."},
  "port elizabeth": {"city":"Port Elizabeth","slug":"port-elizabeth","tagline":"The Friendly City — Algoa Bay beaches and gateway to Addo's elephants."},
  "foz do iguaçu": {"city":"Foz do Iguaçu","slug":"foz-do-igua-u","tagline":"Gateway to the thundering Iguaçu Falls and the tri-border of three nations."},
  "mendoza": {"city":"Mendoza","slug":"mendoza","tagline":"Argentina's high-altitude wine capital at the foot of the Andes."},
  "trabzon": {"city":"Trabzon","slug":"trabzon","tagline":"Black Sea port of misty monasteries, tea and hazelnut hills."},
  "jerez de la frontera": {"city":"Jerez de la Frontera","slug":"jerez-de-la-frontera","tagline":"Sherry, flamenco and dancing horses under the Andalusian sun."},
  "split": {"city":"Split","slug":"split","tagline":"Roman ruins, island ferries and Dalmatia's beating coastal heart."},
  "joão pessoa": {"city":"João Pessoa","slug":"jo-o-pessoa","tagline":"Green coastal capital at the easternmost point of the Americas."},
  "oran": {"city":"Oran","slug":"oran","tagline":"Algeria's Mediterranean second city, birthplace of raï music."},
  "yaoundé": {"city":"Yaoundé","slug":"yaound","tagline":"Cameroon's hilly capital, the city of seven hills."},
  "oranjestad": {"city":"Oranjestad","slug":"oranjestad","tagline":"One Happy Island — Dutch-colonial color, cactus deserts, and blinding-white beaches."},
  "tainan": {"city":"Tainan","slug":"tainan","tagline":"Taiwan's ancient capital — temple town, historic forts, and street-food soul."},
  "hiroshima": {"city":"Hiroshima","slug":"hiroshima","tagline":"City of peace and okonomiyaki, gateway to the floating torii of Miyajima."},
  "kaliningrad": {"city":"Kaliningrad","slug":"kaliningrad","tagline":"Russia's Baltic exclave, Kant's Königsberg reborn in amber and brick."},
  "durrës": {"city":"Durrës","slug":"durr-s","tagline":"Albania's ancient port and its longest sun-soaked Adriatic beach."},
  "pisa": {"city":"Pisa","slug":"pisa","tagline":"Tuscany's tilting icon, a river city of science, stone, and students."},
  "maastricht": {"city":"Maastricht","slug":"maastricht","tagline":"The Netherlands' oldest city — riverside squares, cave-riddled hills and Burgundian flair."},
  "poznań": {"city":"Poznań","slug":"pozna","tagline":"Poland's western cradle — where clockwork goats butt heads and a croissant crowns a saint."},
  "wrocław": {"city":"Wrocław","slug":"wroc-aw","tagline":"Poland's city of a hundred bridges, hidden bronze dwarfs, and a grand medieval square."},
  "tabriz": {"city":"Tabriz","slug":"tabriz","tagline":"Azerbaijani heart of Iran, home to the world's largest covered bazaar."},
  "erbil": {"city":"Erbil","slug":"erbil","tagline":"Kurdistan's capital, ringed around one of the world's oldest citadels."},
  "srinagar": {"city":"Srinagar","slug":"srinagar","tagline":"Himalayan lake city of houseboats, shikaras, and Mughal gardens."},
  "thiruvananthapuram": {"city":"Thiruvananthapuram","slug":"thiruvananthapuram","tagline":"Kerala's laid-back capital — the golden Padmanabhaswamy Temple, palm-fringed Kovalam sands, and the gateway to the backwaters."},
  "amritsar": {"city":"Amritsar","slug":"amritsar","tagline":"Spiritual heart of Sikhism — the glowing Golden Temple, langar for all, and Punjab's buttery, generous cuisine."},
  "varanasi": {"city":"Varanasi","slug":"varanasi","tagline":"India's spiritual heart on the Ganges — eternal ghats, dawn prayers, and the fire of the Ganga Aarti."},
  "sopot": {"city":"Sopot","slug":"sopot","tagline":"Poland's chic Baltic spa town, home to the longest wooden pier in Europe."},
  "saskatoon": {"city":"Saskatoon","slug":"saskatoon","tagline":"Prairie city on the South Saskatchewan River — bridges, riverbank trails, and big-sky festivals."},
  "san pedro sula": {"city":"San Pedro Sula","slug":"san-pedro-sula","tagline":"Honduras's industrial powerhouse and gateway to the Copán ruins and the Caribbean coast."},
  "chaozhou": {"city":"Chaozhou","slug":"chaozhou","tagline":"Ancient walled river city of Teochew cuisine, gongfu tea and the floating Guangji Bridge."},
  "mandalay": {"city":"Mandalay","slug":"mandalay","tagline":"Myanmar's last royal capital, a plain of golden pagodas and teak monasteries."},
  "kerman": {"city":"Kerman","slug":"kerman","tagline":"Desert gateway to the Kaluts, built around a magnificent Safavid bazaar."},
  "arusha": {"city":"Arusha","slug":"arusha","tagline":"Tanzania's safari capital - gateway to the Serengeti, Ngorongoro and Kilimanjaro."},
  "harare": {"city":"Harare","slug":"harare","tagline":"Zimbabwe's jacaranda-lined capital of leafy avenues, galleries and markets."},
  "nelspruit": {"city":"Nelspruit","slug":"nelspruit","tagline":"Lowveld gateway to Kruger National Park and the Panorama Route."},
  "lijiang": {"city":"Lijiang","slug":"lijiang","tagline":"A moonlit maze of canals and cobblestones beneath the Jade Dragon Snow Mountain."},
  "hakodate": {"city":"Hakodate","slug":"hakodate","tagline":"Hokkaido's historic port of harbor-hill night views and morning-market seafood."},
  "kaohsiung": {"city":"Kaohsiung","slug":"kaohsiung","tagline":"Taiwan's sunny harbor city of night markets, art piers, and island ferries."},
  "davao": {"city":"Davao","slug":"davao","tagline":"Mindanao's orderly gateway city — durian, Philippine eagles, Samal Island and towering Mount Apo."},
  "manado": {"city":"Manado","slug":"manado","tagline":"North Sulawesi's seafront capital — gateway to Bunaken's world-class reefs and fiery Minahasa cooking."},
  "da nang": {"city":"Da Nang","slug":"da-nang","tagline":"Vietnam's beach-and-bridges city — My Khe sands, the Dragon Bridge, and a gateway to Hoi An."},
  "kazan": {"city":"Kazan","slug":"kazan","tagline":"Where Europe meets Asia: a Kremlin, a great mosque, and Tatar culture on the Volga."},
  "stavanger": {"city":"Stavanger","slug":"stavanger","tagline":"Norway's oil capital and gateway to Pulpit Rock, wrapped around a colorful old harbor."},
  "liverpool": {"city":"Liverpool","slug":"liverpool","tagline":"The Beatles' waterfront city, where maritime grandeur meets football and nightlife."},
  "québec": {"city":"Québec","slug":"qu-bec","tagline":"North America's walled old city, French to its cobblestones."},
  "faro": {"city":"Faro","slug":"faro","tagline":"Sun-drenched Algarve gateway of a walled old town and the Ria Formosa lagoon."},
  "cartagena": {"city":"Cartagena","slug":"cartagena","tagline":"Walled Caribbean jewel of colonial plazas, salsa and golden light."},
  "cluj-napoca": {"city":"Cluj-Napoca","slug":"cluj-napoca","tagline":"Transylvania's youthful tech-and-student capital, from Gothic spires to the Untold festival."},
  "genoa": {"city":"Genoa","slug":"genoa","tagline":"La Superba - a maritime maze of palaces, pesto, and the biggest aquarium in Italy."},
  "strasbourg": {"city":"Strasbourg","slug":"strasbourg","tagline":"Franco-German canals, a rose-stone cathedral, and Europe's parliament city."},
  "kobe": {"city":"Kobe","slug":"kobe","tagline":"Japan's cosmopolitan port city of marbled beef, mountain views, and old foreign quarters."},
  "gold coast": {"city":"Gold Coast","slug":"gold-coast","tagline":"Australia's beach-holiday capital of surf, high-rises, theme parks, and green hinterland."},
  "hobart": {"city":"Hobart","slug":"hobart","tagline":"Tasmania's harbour capital, where Georgian sandstone meets mountain wilderness and MONA."},
  "natal": {"city":"Natal","slug":"natal","tagline":"The 'City of the Sun': dunes, buggy rides and Ponta Negra beach."},
  "maceió": {"city":"Maceió","slug":"macei","tagline":"Alagoas capital of turquoise natural pools, jangadas and 'Caribbean' beaches."},
  "florianópolis": {"city":"Florianópolis","slug":"florian-polis","tagline":"Brazil's island capital of 42 beaches, lagoons and surf."},
  "saint-denis": {"city":"Saint-Denis","slug":"saint-denis","tagline":"Réunion's Créole capital on the Barachois seafront, a French-Indian Ocean gateway to the Piton de la Fournaise volcano and the island's soaring cirques."},
  "gustavia": {"city":"Gustavia","slug":"gustavia","tagline":"St-Barth's yacht-filled harbour capital of Swedish-era forts, designer boutiques and the golden sand of Shell Beach."},
  "the valley": {"city":"The Valley","slug":"the-valley","tagline":"Anguilla's low-key island capital, a gateway to barefoot-luxury resorts and some of the Caribbean's finest white-sand beaches."},
  "philipsburg": {"city":"Philipsburg","slug":"philipsburg","tagline":"Sint Maarten's boardwalk capital — duty-free Front Street, Great Bay sands, and cruise-ship bustle on the Dutch side."},
  "marigot": {"city":"Marigot","slug":"marigot","tagline":"Saint-Martin's French-side capital — a fort-topped harbor town of Creole markets, marina cafes, and gourmet cuisine."},
  "charlotte amalie": {"city":"Charlotte Amalie","slug":"charlotte-amalie","tagline":"Duty-free shopping, Danish colonial lanes, and a pirate harbor on the U.S. Virgin Islands' busiest cruise coast."},
  "puerto vallarta": {"city":"Puerto Vallarta","slug":"puerto-vallarta","tagline":"Cobblestone old town, golden Pacific beaches, and Mexico's most welcoming beach city on the Bay of Banderas."},
  "kelowna": {"city":"Kelowna","slug":"kelowna","tagline":"Okanagan wine country on a sun-soaked lake, ringed by vineyards, beaches, and ski slopes."},
  "memphis": {"city":"Memphis","slug":"memphis","tagline":"Home of the blues, the birthplace of rock 'n' roll, and the soul of Southern barbecue."},
  "isfahan": {"city":"Isfahan","slug":"isfahan","tagline":"Half the world — Persia's city of turquoise domes and grand squares."},
  "pokhara": {"city":"Pokhara","slug":"pokhara","tagline":"Nepal's serene lake city and gateway to the Annapurnas."},
  "sanya": {"city":"Sanya","slug":"sanya","tagline":"China's tropical beach capital — Hainan's palm-fringed 'Oriental Hawaii.'"},
  "jeju city": {"city":"Jeju City","slug":"jeju-city","tagline":"Korea's volcanic holiday island — Hallasan's peak, lava-rock coasts, and endless beaches."},
  "nagasaki": {"city":"Nagasaki","slug":"nagasaki","tagline":"Japan's crossroads with the world — atomic history, harbor views, and a hilly, exotic port."},
  "nagoya": {"city":"Nagoya","slug":"nagoya","tagline":"Japan's industrious third city — castles, carmakers, and miso-rich comfort food."},
  "zagreb": {"city":"Zagreb","slug":"zagreb","tagline":"Cafe culture and Austro-Hungarian charm beneath a medieval Upper Town."},
  "santa cruz de tenerife": {"city":"Santa Cruz de Tenerife","slug":"santa-cruz-de-tenerife","tagline":"Atlantic capital of Carnival, volcano views, and golden sand."},
  "bilbao": {"city":"Bilbao","slug":"bilbao","tagline":"Basque reinvention — Guggenheim titanium, old-town pintxos, green hills."},
  "brno": {"city":"Brno","slug":"brno","tagline":"Moravia's student capital — functionalist landmarks and a beer-fuelled buzz."},
  "dresden": {"city":"Dresden","slug":"dresden","tagline":"'Florence on the Elbe' — baroque splendour rebuilt stone by stone."},
  "leipzig": {"city":"Leipzig","slug":"leipzig","tagline":"Bach's city, reborn as 'Hypezig' — music, art, and East German cool."},
  "bari": {"city":"Bari","slug":"bari","tagline":"Puglia's port capital, of a whitewashed old town, orecchiette, and ferries to the Balkans."},
  "palermo": {"city":"Palermo","slug":"palermo","tagline":"Sicily's sun-baked capital, where Arab-Norman splendour meets raucous street-food markets."},
  "turin": {"city":"Turin","slug":"turin","tagline":"Italy's elegant first capital, of baroque boulevards, chocolate, and an Alpine skyline."},
  "gdańsk": {"city":"Gdańsk","slug":"gda-sk","tagline":"Baltic Hanseatic jewel of amber, brick gables and Solidarity history."},
  "al ahmadi": {"city":"Al Ahmadi","slug":"al-ahmadi","tagline":"Kuwait's garden oil city, where refinery lights meet Gulf-front souks and green public parks."},
  "mombasa": {"city":"Mombasa","slug":"mombasa","tagline":"Swahili coast crossroads of coral forts, spice-scented lanes and Indian Ocean beaches."},
  "astana": {"city":"Astana","slug":"astana","tagline":"Kazakhstan's futuristic steppe capital (formerly Nur-Sultan) of gleaming towers and bitter-cold winters."},
  "quanzhou": {"city":"Quanzhou","slug":"quanzhou","tagline":"China's medieval maritime Silk Road emporium of temples, mosques, and arcade streets."},
  "chiang mai": {"city":"Chiang Mai","slug":"chiang-mai","tagline":"Thailand's laid-back northern capital of golden temples, misty mountains, and digital nomads."},
  "catania": {"city":"Catania","slug":"catania","tagline":"Sicily's baroque port city of black lava stone, at the foot of smoking Mount Etna."},
  "córdoba": {"city":"Córdoba","slug":"c-rdoba","tagline":"Andalusian city of the Mezquita, patio courtyards, and three cultures woven in stone."},
  "zaragoza": {"city":"Zaragoza","slug":"zaragoza","tagline":"Aragón's grand riverside capital of basilicas, Mudéjar towers, and legendary tapas."},
  "santo domingo": {"city":"Santo Domingo","slug":"santo-domingo","tagline":"The first city of the Americas — cobblestone Zona Colonial, a Caribbean Malecón, and merengue."},
  "san antonio": {"city":"San Antonio","slug":"san-antonio","tagline":"The Alamo City — Spanish missions, the winding River Walk, and Tex-Mex under the Texas sun."},
  "reno": {"city":"Reno","slug":"reno","tagline":"The Biggest Little City in the World — casinos, the Truckee River, and the gateway to Lake Tahoe."},
  "bern": {"city":"Bern","slug":"bern","tagline":"Switzerland's storybook capital - a UNESCO medieval old town wrapped in a bend of the Aare."},
  "gothenburg": {"city":"Gothenburg","slug":"gothenburg","tagline":"Sweden's easygoing second city - seafood, canals, cafes, and the west-coast archipelago."},
  "nuuk": {"city":"Nuuk","slug":"nuuk","tagline":"Greenland's tiny Arctic capital - fjords, icebergs, and the northern lights at the edge of the world."},
  "shiraz": {"city":"Shiraz","slug":"shiraz","tagline":"City of poets, gardens and the Pink Mosque, gateway to ancient Persepolis."},
  "mashhad": {"city":"Mashhad","slug":"mashhad","tagline":"Iran's holiest city, drawing millions to the golden shrine of Imam Reza."},
  "irkutsk": {"city":"Irkutsk","slug":"irkutsk","tagline":"Siberia's wooden-laced 'Paris', gateway to Lake Baikal and the Decembrists' exile."},
  "sochi": {"city":"Sochi","slug":"sochi","tagline":"Russia's subtropical Black Sea resort, from palm-lined beaches to Olympic ski slopes."},
  "santa cruz de la sierra": {"city":"Santa Cruz de la Sierra","slug":"santa-cruz-de-la-sierra","tagline":"Bolivia's booming tropical lowland hub, ringed by plazas and the gateway to the Jesuit Missions."},
  "kuching": {"city":"Kuching","slug":"kuching","tagline":"Borneo's cat city — riverfront heritage and a gateway to orangutans and rainforest."},
  "nouméa": {"city":"Nouméa","slug":"noum-a","tagline":"A French-Pacific city wrapped around the world's largest lagoon."},
  "las palmas de gran canaria": {"city":"Las Palmas de Gran Canaria","slug":"las-palmas-de-gran-canaria","tagline":"Year-round spring on an Atlantic city beach, with a colonial old town at its back."},
  "fortaleza": {"city":"Fortaleza","slug":"fortaleza","tagline":"Sun-drenched Ceará capital of Beira Mar, forró nights, and Praia do Futuro."},
  "belém": {"city":"Belém","slug":"bel-m","tagline":"Amazon gateway of the Ver-o-Peso market, mango-lined streets, and açaí."},
  "charleston": {"city":"Charleston","slug":"charleston","tagline":"Antebellum charm of cobblestone streets, Rainbow Row, and Lowcountry cooking."},
  "halifax": {"city":"Halifax","slug":"halifax","tagline":"Maritime harbour city of seafood, sea shanties, and Titanic history."},
  "innsbruck": {"city":"Innsbruck","slug":"innsbruck","tagline":"Alpine capital where a medieval old town meets the ski slopes."},
  "belfast": {"city":"Belfast","slug":"belfast","tagline":"Shipyard city reborn — Titanic heritage, murals, and warm craic."},
  "alicante": {"city":"Alicante","slug":"alicante","tagline":"Costa Blanca sun, a hilltop castle, and a palm-lined esplanade."},
  "bordeaux": {"city":"Bordeaux","slug":"bordeaux","tagline":"World wine capital of grand 18th-century stone and a mirrored quay."},
  "nantes": {"city":"Nantes","slug":"nantes","tagline":"Loire-side city of mechanical elephants and Breton dukes."},
  "nuremberg": {"city":"Nuremberg","slug":"nuremberg","tagline":"Medieval walls, an imperial castle, and the world's most famous Christmas market."},
  "the hague": {"city":"The Hague","slug":"the-hague","tagline":"Seat of Dutch government, grand palaces, and a North Sea beach."},
  "rotterdam": {"city":"Rotterdam","slug":"rotterdam","tagline":"Bold modern architecture and Europe's biggest port."},
  "kagoshima": {"city":"Kagoshima","slug":"kagoshima","tagline":"Japan's volcano city, where an active Sakurajima smokes across the bay."},
  "yogyakarta": {"city":"Yogyakarta","slug":"yogyakarta","tagline":"Java's cultural soul — palaces, batik, and ancient temples."},
  "kota kinabalu": {"city":"Kota Kinabalu","slug":"kota-kinabalu","tagline":"Borneo's laid-back seafront base for islands and Mount Kinabalu."},
  "medan": {"city":"Medan","slug":"medan","tagline":"Sumatra's gritty, food-obsessed gateway to Lake Toba."},
  "abuja": {"city":"Abuja","slug":"abuja","tagline":"Nigeria's purpose-built capital of green hills, monuments and unhurried calm."},
  "monterrey": {"city":"Monterrey","slug":"monterrey","tagline":"Mexico's industrial powerhouse, ringed by the dramatic peaks of Cerro de la Silla."},
  "darwin": {"city":"Darwin","slug":"darwin","tagline":"Australia's tropical Top End capital and the gateway to Kakadu and Litchfield."},
  "ottawa": {"city":"Ottawa","slug":"ottawa","tagline":"Canada's capital of grand museums, canal skating, and tulip-lined riverbanks."},
  "new orleans": {"city":"New Orleans","slug":"new-orleans","tagline":"Jazz, gumbo, and never-ending festival in America's most European city."},
  "austin": {"city":"Austin","slug":"austin","tagline":"Live-music capital of the world, where tacos, tech, and Texas swagger collide."},
  "salzburg": {"city":"Salzburg","slug":"salzburg","tagline":"Mozart's baroque city beneath a clifftop fortress, wrapped in Alpine scenery."},
  "luxembourg": {"city":"Luxembourg","slug":"luxembourg","tagline":"A tiny fortress capital of UNESCO ramparts, deep green valleys, and free public transport for all."},
  "glasgow": {"city":"Glasgow","slug":"glasgow","tagline":"Scotland's warm-hearted second city — Victorian grandeur, music, and legendary nightlife."},
  "manaus": {"city":"Manaus","slug":"manaus","tagline":"Gateway to the Amazon, where a jungle opera house meets the meeting of the waters."},
  "bergen": {"city":"Bergen","slug":"bergen","tagline":"Norway's fjord capital, where UNESCO wharves meet mountain funiculars."},
  "antwerp": {"city":"Antwerp","slug":"antwerp","tagline":"Diamond capital of Rubens, fashion, and Flemish grandeur."},
  "toulouse": {"city":"Toulouse","slug":"toulouse","tagline":"France's pink-brick 'Ville Rose', home of Airbus and the stars."},
  "málaga": {"city":"Málaga","slug":"m-laga","tagline":"Costa del Sol capital of Picasso, tapas, and sun-soaked beaches."},
  "winnipeg": {"city":"Winnipeg","slug":"winnipeg","tagline":"Prairie crossroads at the forks of two rivers - human-rights museum, French quarter, and legendary cold winters."},
  "dar es salaam": {"city":"Dar es Salaam","slug":"dar-es-salaam","tagline":"Tanzania's steamy Indian Ocean metropolis - harbour bustle, Swahili markets, and the gateway to Zanzibar."},
  "negombo": {"city":"Negombo","slug":"negombo","tagline":"Sri Lanka's beach-and-lagoon gateway beside Colombo's airport, built on fishing, Dutch canals, and Catholic churches."},
  "naha": {"city":"Naha","slug":"naha","tagline":"Okinawa's laid-back capital, where Ryukyu castles, island cuisine, and East China Sea beaches replace mainland Japan's rush."},
  "cebu city": {"city":"Cebu City","slug":"cebu-city","tagline":"The Philippines' historic second city, gateway to island-hopping, diving, and Spanish colonial roots."},
  "san juan": {"city":"San Juan","slug":"san-juan","tagline":"Colonial forts, cobblestone lanes, and Caribbean rhythm on a walled Atlantic bay."},
  "edmonton": {"city":"Edmonton","slug":"edmonton","tagline":"Canada's Festival City - West Edmonton Mall, a sprawling river valley, and the gateway to the north."},
  "tromso": {"city":"Tromso","slug":"tromso","tagline":"Gateway to the Arctic - northern lights, midnight sun, and the world's northernmost everything."},
  "basel": {"city":"Basel","slug":"basel","tagline":"Switzerland's culture capital on a bend of the Rhine - world-class art, an intact old town, and three borders in one city."},
  "bristol": {"city":"Bristol","slug":"bristol","tagline":"Britain's harbourside capital of street art, music, and maker culture."},
  "aix-en-provence": {"city":"Aix-en-Provence","slug":"aix-en-provence","tagline":"Elegant Provençal town of fountains, markets, and Cézanne's light."},
  "lyon": {"city":"Lyon","slug":"lyon","tagline":"France's gastronomic capital, built on two rivers and Renaissance light."},
  "anaheim": {"city":"Anaheim","slug":"anaheim","tagline":"Home of Disneyland, sunshine, and Orange County's biggest stage."},
  "pittsburgh": {"city":"Pittsburgh","slug":"pittsburgh","tagline":"Steel City reborn: three rivers, 400 bridges, and hilltop inclines."},
  "tampa": {"city":"Tampa","slug":"tampa","tagline":"Cuban sandwiches, Gulf sunsets, and Ybor City's neon nights."},
  "bonn": {"city":"Bonn","slug":"bonn","tagline":"Beethoven's birthplace and West Germany's genteel former capital."},
  "cologne": {"city":"Cologne","slug":"cologne","tagline":"Rhineland powerhouse of a soaring cathedral, Kolsch and Carnival."},
  "stuttgart": {"city":"Stuttgart","slug":"stuttgart","tagline":"Germany's car capital, cradled by vineyards and wooded hills."},
  "dallas": {"city":"Dallas","slug":"dallas","tagline":"Big Texas ambition — arts, sports, barbecue and JFK history under a wide sky."},
  "cairns": {"city":"Cairns","slug":"cairns","tagline":"Tropical gateway to the Great Barrier Reef and the Daintree rainforest."},
  "christchurch": {"city":"Christchurch","slug":"christchurch","tagline":"Garden City reborn — a low-slung, creative gateway to the Southern Alps."},
  "woodlands": {"city":"Woodlands","slug":"woodlands","tagline":"Singapore's northern gateway town - the Causeway to Malaysia, malls, and waterfront parks."},
  "surabaya": {"city":"Surabaya","slug":"surabaya","tagline":"Indonesia's City of Heroes - old harbor quarters, monuments, and the bridge to Madura."},
  "makassar": {"city":"Makassar","slug":"makassar","tagline":"Sulawesi's seafront gateway of sunsets, spice-trade forts, and grilled fish."},
  "vatican city": {"city":"Vatican City","slug":"vatican-city","tagline":"The world's smallest state, home to the Pope and the greatest art on Earth."},
  "malmö": {"city":"Malmö","slug":"malm","tagline":"Sweden's multicultural south, a bridge away from Copenhagen."},
  "düsseldorf": {"city":"Düsseldorf","slug":"d-sseldorf","tagline":"Altbier, avant-garde art, and the longest bar in the world."},
  "papeete": {"city":"Papeete","slug":"papeete","tagline":"France's South Pacific capital — a lively island port, colorful market and gateway to Tahiti and the Society Islands."},
  "scottsdale": {"city":"Scottsdale","slug":"scottsdale","tagline":"The Valley of the Sun's resort playground of desert golf, spa retreats, Old Town nightlife and Sonoran sunsets."},
  "anchorage": {"city":"Anchorage","slug":"anchorage","tagline":"Alaska's biggest city and gateway to the Last Frontier, where downtown meets glaciers, moose and endless wilderness."},
  "portland": {"city":"Portland","slug":"portland","tagline":"Rose City of food carts, craft beer, indie shops, and forested trails."},
  "nashville": {"city":"Nashville","slug":"nashville","tagline":"Music City, USA — honky-tonks, hot chicken, and nonstop live music."},
  "salt lake city": {"city":"Salt Lake City","slug":"salt-lake-city","tagline":"Mountain-ringed capital where downtown meets world-class skiing and canyons."},
  "philadelphia": {"city":"Philadelphia","slug":"philadelphia","tagline":"Birthplace of America - Liberty Bell, cheesesteaks, murals, and rowhouse charm."},
  "detroit": {"city":"Detroit","slug":"detroit","tagline":"Motor City reborn - Motown, techno, Art Deco towers, and a riverfront rising."},
  "minneapolis": {"city":"Minneapolis","slug":"minneapolis","tagline":"City of Lakes where Mississippi mills meet Prince, parks, and prairie winters."},
  "wellington": {"city":"Wellington","slug":"wellington","tagline":"New Zealand's windy, walkable capital of coffee, craft beer and creativity."},
  "san diego": {"city":"San Diego","slug":"san-diego","tagline":"Endless beaches, craft beer, and year-round sunshine."},
  "brasília": {"city":"Brasília","slug":"bras-lia","tagline":"Oscar Niemeyer's modernist capital, sculpted from the Cerrado plateau."},
  "geneva": {"city":"Geneva","slug":"geneva","tagline":"Alpine lake city of diplomacy, watchmaking, and the soaring Jet d'Eau."},
  "calgary": {"city":"Calgary","slug":"calgary","tagline":"Cowboy heart of the Rockies - Stampede spirit and the gateway to Banff."},
  "phoenix": {"city":"Phoenix","slug":"phoenix","tagline":"Valley of the Sun capital of desert hikes, Southwestern flavor, and resort sprawl."},
  "adelaide": {"city":"Adelaide","slug":"adelaide","tagline":"Elegant City of Churches, with festivals, food, and famous wine at the doorstep."},
  "palma": {"city":"Palma","slug":"palma","tagline":"Mediterranean island capital of light and cathedrals."},
  "manchester": {"city":"Manchester","slug":"manchester","tagline":"England's music-mad, football-crazy powerhouse of the industrial north."},
  "marseille": {"city":"Marseille","slug":"marseille","tagline":"France's rugged Mediterranean port — bouillabaisse, calanques, and salty soul."},
  "houston": {"city":"Houston","slug":"houston","tagline":"Sprawling, diverse, and hungry - space city with a world of food."},
  "denver": {"city":"Denver","slug":"denver","tagline":"The Mile High City where craft beer, big skies, and the Rockies meet."},
  "atlanta": {"city":"Atlanta","slug":"atlanta","tagline":"Capital of the New South, where hip-hop, soul food, Civil Rights history, and a leafy urban forest converge."},
  "seattle": {"city":"Seattle","slug":"seattle","tagline":"Coffee, grunge and evergreen — a tech city wedged between the mountains and the sea."},
  "cali": {"city":"Cali","slug":"cali","tagline":"The world's salsa capital, where every night ends on the dance floor."},
  "i̇zmir": {"city":"İzmir","slug":"i-zmir","tagline":"Aegean gateway of seafront promenades, seafood and easy sunshine."},
  "durban": {"city":"Durban","slug":"durban","tagline":"South Africa's warm-water playground of golden surf beaches and spice."},
  "guayaquil": {"city":"Guayaquil","slug":"guayaquil","tagline":"Ecuador's steamy Pacific port, riverfront Malecón, and gateway to the Galápagos."},
  "belo horizonte": {"city":"Belo Horizonte","slug":"belo-horizonte","tagline":"Brazil's bar capital, where boteco culture meets Niemeyer's curves."},
  "recife": {"city":"Recife","slug":"recife","tagline":"Brazil's northeastern capital of bridges, beaches, frevo and colonial Olinda."},
  "salvador": {"city":"Salvador","slug":"salvador","tagline":"Brazil's Afro-Bahian soul — cobbled colonial squares, drum-driven streets, and Atlantic beaches."},
  "boston": {"city":"Boston","slug":"boston","tagline":"Cobblestone history and college-town brains on the harbor."},
  "hamburg": {"city":"Hamburg","slug":"hamburg","tagline":"Germany's harbor city of red brick, canals, and Reeperbahn nights."},
  "brisbane": {"city":"Brisbane","slug":"brisbane","tagline":"Sunny riverside Queensland capital of subtropical, outdoor ease."},
  "perth": {"city":"Perth","slug":"perth","tagline":"Australia's sun-soaked western capital of river, beaches, and endless blue sky."},
  "guadalajara": {"city":"Guadalajara","slug":"guadalajara","tagline":"Mexico's birthplace of mariachi and tequila, proud capital of Jalisco."},
  "casablanca": {"city":"Casablanca","slug":"casablanca","tagline":"Morocco's cosmopolitan port city of Art Deco boulevards and the soaring Hassan II Mosque."},
  "johannesburg": {"city":"Johannesburg","slug":"johannesburg","tagline":"The restless City of Gold, born from the world's richest goldfields."},
  "phnom penh": {"city":"Phnom Penh","slug":"phnom-penh","tagline":"Cambodia's riverside capital of golden pagodas and poignant history."},
  "naples": {"city":"Naples","slug":"naples","tagline":"Chaotic, soulful bayfront city where pizza was born under Vesuvius."},
  "medellín": {"city":"Medellín","slug":"medell-n","tagline":"The City of Eternal Spring, reborn through cable cars and creativity."},
  "jaipur": {"city":"Jaipur","slug":"jaipur","tagline":"India's Pink City, a royal Rajput capital of forts, bazaars, and rose-hued facades."},
  "chicago": {"city":"Chicago","slug":"chicago","tagline":"The Windy City of soaring architecture, deep-dish, blues, and Lake Michigan shoreline."},
  "yokohama": {"city":"Yokohama","slug":"yokohama","tagline":"Japan's cosmopolitan port city, where a futuristic bay skyline meets the country's largest Chinatown."},
  "xiamen": {"city":"Xiamen","slug":"xiamen","tagline":"Fujian's island city of colonial Gulangyu, sea breezes, and oolong tea."},
  "qingdao": {"city":"Qingdao","slug":"qingdao","tagline":"German colonial charm, Tsingtao beer, and Yellow Sea beaches on China's Shandong coast."},
  "kunming": {"city":"Kunming","slug":"kunming","tagline":"China's mild-weather 'Spring City' and the gateway to Yunnan and the Stone Forest."},
  "hyderabad": {"city":"Hyderabad","slug":"hyderabad","tagline":"City of pearls and biryani, where Nizami palaces meet the glass towers of HITEC City."},
  "chittagong": {"city":"Chittagong","slug":"chittagong","tagline":"Bangladesh's port city of hills, sea, and Mezban feasts."},
  "ankara": {"city":"Ankara","slug":"ankara","tagline":"Türkiye's modernist capital, from Atatürk's mausoleum to an ancient hilltop citadel."},
  "alexandria": {"city":"Alexandria","slug":"alexandria","tagline":"Egypt's Mediterranean pearl, where the ghost of the ancient Library meets a sea-swept corniche."},
  "tai'an": {"city":"Tai'an","slug":"tai-an","tagline":"Gateway to sacred Mount Tai, holiest of China's five great peaks."},
  "suzhou": {"city":"Suzhou","slug":"suzhou","tagline":"The 'Venice of the East' - classical gardens, silk, and canal-woven old lanes an hour from Shanghai."},
  "saint petersburg": {"city":"Saint Petersburg","slug":"saint-petersburg","tagline":"Russia's imperial capital of palaces, the Hermitage, and summer White Nights."},
  "lahore": {"city":"Lahore","slug":"lahore","tagline":"Pakistan's cultural heart, where Mughal grandeur meets nonstop food streets."},
  "kolkata": {"city":"Kolkata","slug":"kolkata","tagline":"The City of Joy — India's cultural capital of literature, art, adda, and unrivalled street food."},
  "harbin": {"city":"Harbin","slug":"harbin","tagline":"China's frozen north, where ice cities glow and Russian domes meet Manchurian street food."},
  "hangzhou": {"city":"Hangzhou","slug":"hangzhou","tagline":"West Lake serenity and Alibaba ambition, wrapped in tea hills and canals."},
  "chennai": {"city":"Chennai","slug":"chennai","tagline":"South India's Dravidian capital of temples, filter coffee, and the world's second-longest urban beach."},
  "bengaluru": {"city":"Bengaluru","slug":"bengaluru","tagline":"India's Garden City turned tech capital — craft beer, startups, and near-perfect weather."},
  "xi'an": {"city":"Xi'an","slug":"xi-an","tagline":"Ancient Silk Road capital of the Terracotta Army, city walls, and dumpling feasts."},
  "nanjing": {"city":"Nanjing","slug":"nanjing","tagline":"Ancient southern capital of dynasties, city walls, and Yangtze lore."},
  "mumbai": {"city":"Mumbai","slug":"mumbai","tagline":"India's maximum city, where Bollywood dreams meet colonial grandeur and the Arabian Sea."},
  "jakarta": {"city":"Jakarta","slug":"jakarta","tagline":"Indonesia's sprawling capital of malls, markets, and endless motorbikes."},
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
