import json, re, time, os
import urllib.parse
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

CITY_COUNTRY = {
 "Algiers":"Algeria","Alicante":"Spain","Alice Springs":"Australia","Almaty":"Kazakhstan",
 "Amman":"Jordan","Amritsar":"India","Amsterdam":"Netherlands","Anaheim":"California",
 "Anchorage":"Alaska","Andorra la Vella":"Andorra","Angra dos Reis":"Brazil",
 "Ankara":"Turkey","Annecy":"France","Anshun":"China","Antalya":"Turkey"
}

# items to (re)search: (city, index, query_variants[])
TODO = [
 ("Algiers",4,["Djamaa el Djazair","Great Mosque of Algiers"]),
 ("Algiers",6,["Bardo National Museum Algiers","Musee du Bardo Alger"]),
 ("Algiers",7,["Jardin d'Essai Hamma Algiers","Jardin d'Essai du Hamma"]),
 ("Algiers",8,["Place des Martyrs Algiers","Place des Martyrs Alger"]),
 ("Algiers",9,["Bastion 23 Algiers","Palais des Rais Algiers"]),
 ("Alicante",0,["Castillo de Santa Barbara Alicante","Santa Barbara Castle Alicante"]),
 ("Alicante",1,["Explanada de Espana Alicante"]),
 ("Alicante",2,["Barrio Santa Cruz Alicante"]),
 ("Alicante",3,["Playa del Postiguet Alicante","Postiguet Beach"]),
 ("Alicante",4,["Basilica Santa Maria Alicante"]),
 ("Alicante",6,["MARQ Alicante Archaeological Museum"]),
 ("Alicante",7,["Mercado Central Alicante"]),
 ("Alicante",9,["Museo de Arte Contemporaneo Alicante MACA"]),
 ("Alice Springs",1,["Alice Springs Desert Park building"]),
 ("Alice Springs",3,["Royal Flying Doctor Service Alice Springs"]),
 ("Alice Springs",9,["Alice Springs Reptile Centre"]),
 ("Almaty",0,["Ascension Cathedral Almaty","Zenkov Cathedral Almaty"]),
 ("Almaty",3,["Medeu skating rink Almaty"]),
 ("Almaty",4,["Shymbulak ski resort Almaty"]),
 ("Almaty",5,["Panfilov Park Almaty","28 Panfilov Guardsmen Memorial"]),
 ("Almaty",8,["Republic Square Almaty"]),
 ("Amman",3,["Temple of Hercules Amman Citadel"]),
 ("Amman",5,["Nymphaeum of Amman"]),
 ("Amman",8,["Odeon of Amman"]),
 ("Amman",9,["Duke's Diwan Amman","Beit Sakakini Amman"]),
 ("Amritsar",4,["Partition Museum Amritsar building"]),
 ("Amritsar",7,["Hall Bazaar Amritsar","Heritage Street Amritsar"]),
 ("Amritsar",8,["Ram Bagh Amritsar Maharaja Ranjit Singh Museum"]),
 ("Amritsar",9,["Mata Lal Devi Temple Amritsar"]),
 ("Amsterdam",2,["Van Gogh Museum building Amsterdam"]),
 ("Amsterdam",3,["Amsterdam canals Grachtengordel"]),
 ("Amsterdam",6,["NEMO Science Museum Amsterdam building"]),
 ("Amsterdam",8,["Begijnhof Amsterdam"]),
 ("Anaheim",2,["Downtown Disney Anaheim"]),
 ("Anaheim",3,["Pixar Pier Disney California Adventure"]),
 ("Anaheim",7,["Center Street Promenade Anaheim"]),
 ("Anaheim",9,["MUZEO Anaheim building"]),
 ("Anchorage",5,["Ship Creek Anchorage Alaska"]),
 ("Anchorage",6,["Earthquake Park Anchorage Alaska"]),
 ("Andorra la Vella",1,["Santuari de Meritxell Andorra"]),
 ("Andorra la Vella",3,["Pont de Paris Andorra la Vella bridge"]),
 ("Andorra la Vella",6,["Grandvalira ski resort Andorra"]),
 ("Andorra la Vella",8,["Naturlandia Andorra"]),
 ("Andorra la Vella",9,["Placa del Poble Andorra la Vella"]),
 ("Angra dos Reis",1,["Praia de Lopes Mendes Ilha Grande"]),
 ("Angra dos Reis",2,["Lagoa Azul Ilha Grande Angra dos Reis"]),
 ("Angra dos Reis",3,["Ilhas Botinas Angra dos Reis"]),
 ("Angra dos Reis",4,["Ilha da Gipoia Angra dos Reis","Praia do Dentista Angra dos Reis"]),
 ("Angra dos Reis",5,["Convento Sao Bernardino de Sena Angra dos Reis"]),
 ("Angra dos Reis",6,["Igreja Matriz Nossa Senhora da Conceicao Angra dos Reis"]),
 ("Angra dos Reis",7,["Igreja Nossa Senhora do Carmo Angra dos Reis"]),
 ("Angra dos Reis",8,["Cais Santa Luzia Angra dos Reis"]),
 ("Angra dos Reis",9,["Angra dos Reis Morro Santo Antonio mirante"]),
 ("Ankara",4,["Museum of Anatolian Civilizations building Ankara"]),
 ("Annecy",0,["Palais de l'Isle Annecy"]),
 ("Annecy",2,["Annecy old town Vieille Ville"]),
 ("Annecy",4,["Pont des Amours Annecy"]),
 ("Annecy",5,["Jardins de l'Europe Annecy"]),
 ("Annecy",6,["Basilique de la Visitation Annecy"]),
 ("Annecy",7,["Cathedrale Saint-Pierre Annecy"]),
 ("Annecy",8,["Gorges du Fier Annecy"]),
 ("Annecy",9,["Semnoz mountain Annecy"]),
 ("Anshun",1,["Longgong Caves Anshun Dragon Palace"]),
 ("Anshun",2,["Tianxingqiao scenic area Anshun"]),
 ("Anshun",3,["Doupotang Waterfall Anshun"]),
 ("Anshun",4,["Tianlong Tunbao ancient town Anshun"]),
 ("Anshun",5,["Yunfeng Tunpu Anshun eight villages"]),
 ("Anshun",6,["Getu River scenic area Guizhou"]),
 ("Anshun",7,["Anshun Confucian Temple Wen Miao"]),
 ("Anshun",8,["Anshun Batik Museum Guizhou"]),
 ("Anshun",9,["Guanling Geopark Guizhou"]),
 ("Antalya",4,["Antalya Aquarium building"]),
 ("Antalya",8,["Side Turkey Temple of Apollo"]),
]

HEADERS = {"User-Agent": "NeverRoamAloneBot/1.0 (contact: jcwolinsky@gmail.com) research/photo-sourcing"}
sess = requests.Session()
sess.headers.update(HEADERS)

def commons_search(query, retries=3):
    url = "https://commons.wikimedia.org/w/api.php"
    params = {"action":"query","list":"search","srsearch":query,"srnamespace":6,"srlimit":5,"format":"json"}
    for attempt in range(retries):
        r = sess.get(url, params=params, timeout=10)
        if r.status_code == 200:
            data = r.json()
            return [x["title"] for x in data.get("query",{}).get("search",[])]
        if r.status_code in (429,503):
            time.sleep(1.5*(attempt+1)); continue
        return []
    return []

def commons_imageinfo(file_title, retries=3):
    url = "https://commons.wikimedia.org/w/api.php"
    params = {"action":"query","titles":file_title,"prop":"imageinfo","iiprop":"url|extmetadata","format":"json"}
    for attempt in range(retries):
        r = sess.get(url, params=params, timeout=10)
        if r.status_code == 200:
            data = r.json()
            pages = data.get("query",{}).get("pages",{})
            for pid, p in pages.items():
                ii = p.get("imageinfo")
                if ii:
                    return ii[0]
            return None
        if r.status_code in (429,503):
            time.sleep(1.5*(attempt+1)); continue
        return None
    return None

def process(city, idx, queries):
    for q in queries:
        try:
            hits = commons_search(q)
        except Exception:
            hits = []
        for h in hits:
            # skip obviously non-photo files
            low = h.lower()
            if low.endswith(('.svg','.pdf','.gif')) or 'logo' in low or 'map' in low or 'icon' in low or 'flag' in low:
                continue
            info = commons_imageinfo(h)
            if info and info.get("url"):
                return (city, idx, {"title": h, "url": info["url"], "descurl": info.get("descriptionurl")})
    return (city, idx, None)

results = {}
with ThreadPoolExecutor(max_workers=6) as ex:
    futs = [ex.submit(process, c, i, q) for c, i, q in TODO]
    for fut in as_completed(futs):
        city, idx, r = fut.result()
        results.setdefault(city, {})[idx] = r

os.makedirs("/tmp/b3_work", exist_ok=True)
with open("/tmp/b3_work/pass2.json","w") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

for city, idxs in results.items():
    for idx, r in sorted(idxs.items()):
        if r:
            print(f"{city}[{idx}] -> {r['title']} | {r['url'][:90]}")
        else:
            print(f"{city}[{idx}] -> STILL MISS")
