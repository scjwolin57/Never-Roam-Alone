# -*- coding: utf-8 -*-
import json, time, os
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

TODO = [
 ("Alice Springs",1,["Alice Springs Desert Park landscape Australia","Alice Springs Desert Park nocturnal house"]),
 ("Anaheim",7,["Center Street Anaheim downtown","Anaheim Center Street Promenade fountain"]),
 ("Angra dos Reis",9,["Angra dos Reis vista mirante","Morro Santo Antonio Rio de Janeiro"]),
 ("Alicante",6,["MARQ museu arqueologia edifici Alacant","Museo Arqueologico Provincial Alicante edificio"]),
 ("Amritsar",7,["Hall Gate Amritsar","Amritsar bazaar street"]),
 ("Anshun",1,["龙宫 安顺","Longgong scenic area Anshun Guizhou"]),
 ("Anshun",3,["陡坡塘瀑布"]),
 ("Anshun",4,["天龙屯堡"]),
 ("Anshun",5,["云峰屯堡"]),
 ("Anshun",6,["格凸河"]),
 ("Anshun",7,["安顺文庙","Anshun Wenmiao Confucius temple"]),
 ("Anshun",8,["安顺蜡染"]),
 ("Anshun",9,["关岭国家地质公园","花江大峡谷 关岭"]),
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
            if low.endswith(('.svg','.pdf','.gif','.djvu')) or 'logo' in low or 'icon' in low or 'flag' in low:
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
with open("/tmp/b3_work/pass4.json","w") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

for city, idxs in results.items():
    for idx, r in sorted(idxs.items()):
        if r:
            print(f"{city}[{idx}] -> {r['title']} | {r['url'][:100]}")
        else:
            print(f"{city}[{idx}] -> STILL MISS")
