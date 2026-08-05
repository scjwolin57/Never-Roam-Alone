import json, time, os
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

TODO = [
 ("Algiers",6,["Bardo National Museum Algiers building","musee du bardo Alger facade","Villa du Bardo Algiers"]),
 ("Algiers",9,["Bastion 23 Algiers palais des rais photo","Palais des Rais Bastion 23 courtyard"]),
 ("Alicante",6,["Museo Arqueologico Provincial Alicante MARQ building","MARQ museum Alicante exterior"]),
 ("Alicante",7,['"Mercado Central" Alicante building']),
 ("Alice Springs",1,["Alice Springs Desert Park entrance","Alice Springs Desert Park Australia landscape"]),
 ("Amritsar",7,["Hall Bazaar Amritsar street modern","Heritage Street Amritsar Golden Temple"]),
 ("Amritsar",8,["Ram Bagh Amritsar gate","Maharaja Ranjit Singh Museum Amritsar building"]),
 ("Anaheim",7,["Center Street Promenade Anaheim California"]),
 ("Angra dos Reis",9,["Morro do Santo Antonio Angra dos Reis vista","Angra dos Reis mirante panorama"]),
 ("Anshun",1,["Longgong caves Guizhou Anshun","Dragon Palace cave Guizhou"]),
 ("Anshun",3,["Doupotang waterfall Guizhou Anshun"]),
 ("Anshun",4,["Tianlong Tunbao ancient town Guizhou"]),
 ("Anshun",5,["Yunfeng Tunpu Anshun Guizhou village"]),
 ("Anshun",6,["Getu River Guizhou scenic"]),
 ("Anshun",7,["Anshun Confucian Temple Wen Miao Guizhou"]),
 ("Anshun",8,["Anshun batik Guizhou museum"]),
 ("Anshun",9,["Guanling geopark Guizhou","Huajiang Grand Canyon Guanling"]),
 ("Antalya",4,["Antalya Aquarium Turkey building exterior","Antalya Akvaryum"]),
]

HEADERS = {"User-Agent": "NeverRoamAloneBot/1.0 (contact: jcwolinsky@gmail.com) research/photo-sourcing"}
sess = requests.Session()
sess.headers.update(HEADERS)

def commons_search(query, retries=3):
    url = "https://commons.wikimedia.org/w/api.php"
    params = {"action":"query","list":"search","srsearch":query,"srnamespace":6,"srlimit":6,"format":"json"}
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
    all_hits = []
    for q in queries:
        try:
            hits = commons_search(q)
        except Exception:
            hits = []
        for h in hits:
            low = h.lower()
            if low.endswith(('.svg','.pdf','.gif','.djvu')) or 'logo' in low or 'icon' in low or 'flag' in low or 'map' in low:
                continue
            all_hits.append(h)
    for h in all_hits:
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
with open("/tmp/b3_work/pass3.json","w") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

for city, idxs in results.items():
    for idx, r in sorted(idxs.items()):
        if r:
            print(f"{city}[{idx}] -> {r['title']} | {r['url'][:100]}")
        else:
            print(f"{city}[{idx}] -> STILL MISS")
