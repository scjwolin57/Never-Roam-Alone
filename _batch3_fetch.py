import json, re, time, os
import urllib.parse
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

DATA = {
 "Algiers": ["Notre-Dame d'Afrique","Casbah of Algiers","Maqam Echahid (Martyrs' Memorial)","Grande Poste d'Alger","Djamaa el Djazair (Great Mosque of Algiers)","Ketchaoua Mosque","Bardo National Museum","Jardin d'Essai du Hamma","Place des Martyrs","Bastion 23 / Palais des Raïs"],
 "Alicante": ["Castillo de Santa Barbara","Explanada de Espana","Barrio de Santa Cruz","Playa del Postiguet","Basilica de Santa Maria","Concatedral de San Nicolas","MARQ (Archaeological Museum of Alicante)","Mercado Central","Isla de Tabarca","Museo de Arte Contemporaneo (MACA)"],
 "Alice Springs": ["Anzac Hill (Untyeyetwelye)","Alice Springs Desert Park","Alice Springs Telegraph Station Historical Reserve","Royal Flying Doctor Service Tourist Facility","Alice Springs School of the Air","Araluen Cultural Precinct","Simpsons Gap (Rungutjirpa)","Standley Chasm (Angkerle Atwatye)","Olive Pink Botanic Garden","Alice Springs Reptile Centre"],
 "Almaty": ["Ascension (Zenkov) Cathedral","Kok-Tobe Hill","Big Almaty Lake","Medeu Skating Rink","Shymbulak Ski Resort","Panfilov Park & 28 Panfilov Guardsmen Memorial","Almaty Tower (Kok-Tobe TV Tower)","Green Bazaar (Zelenyi Bazaar)","Republic Square","Central State Museum of Kazakhstan"],
 "Amman": ["Amman Citadel (Jabal al-Qal'a)","Roman Theatre of Amman","King Abdullah I Mosque","Temple of Hercules","Rainbow Street","The Nymphaeum of Amman","Al-Husseini Mosque","Jordan Museum","Odeon of Amman","Duke's Diwan (Beit Sakakini)"],
 "Amritsar": ["Golden Temple (Sri Harmandir Sahib)","Jallianwala Bagh","Wagah Border Ceremony","Akal Takht","Partition Museum","Gobindgarh Fort","Durgiana Temple","Heritage Street and Hall Bazaar","Maharaja Ranjit Singh Museum and Ram Bagh","Mata Lal Devi Temple"],
 "Amsterdam": ["Anne Frank House","Rijksmuseum","Van Gogh Museum","Amsterdam Canal Ring","Royal Palace Amsterdam","Vondelpark","NEMO Science Museum","Bloemenmarkt","Begijnhof","Rembrandt House Museum"],
 "Anaheim": ["Sleeping Beauty Castle (Disneyland)","Matterhorn Bobsleds","Downtown Disney District","Pixar Pier (Disney California Adventure)","Angel Stadium of Anaheim","Honda Center","Anaheim Packing House","Center Street Promenade","Anaheim Convention Center","MUZEO Anaheim"],
 "Anchorage": ["Flattop Mountain","Tony Knowles Coastal Trail","Lake Hood Seaplane Base","Alaska Native Heritage Center","Anchorage Museum","Ship Creek","Earthquake Park","Potter Marsh","Downtown Anchorage / 4th Avenue","Chugach State Park (Glen Alps Overlook)"],
 "Andorra la Vella": ["Casa de la Vall","Santuari de Meritxell","Caldea","Pont de Paris","Església de Sant Esteve","Madriu-Perafita-Claror Valley","Grandvalira Ski Resort","Vallnord (Ordino-Arcalís)","Naturlandia","Plaça del Poble"],
 "Angra dos Reis": ["Ilha Grande","Praia de Lopes Mendes","Lagoa Azul (Blue Lagoon)","Ilhas Botinas","Ilha da Gipoia and Praia do Dentista","Convento de Sao Bernardino de Sena","Igreja Matriz de Nossa Senhora da Conceicao","Igreja de Nossa Senhora do Carmo","Cais Santa Luzia","Mirante do Morro do Santo Antonio"],
 "Ankara": ["Anıtkabir","Ankara Castle (Ankara Kalesi)","Kocatepe Mosque","Temple of Augustus and Rome","Museum of Anatolian Civilizations","Atakule Tower","Roman Baths of Ankara","Column of Julian","Hacı Bayram Mosque","Ethnography Museum of Ankara"],
 "Annecy": ["Palais de l'Ile","Lac d'Annecy","Vieille Ville (Old Town)","Chateau d'Annecy","Pont des Amours (Lovers' Bridge)","Jardins de l'Europe","Basilique de la Visitation","Cathedrale Saint-Pierre","Gorges du Fier","Le Semnoz"],
 "Anshun": ["Huangguoshu Waterfall","Longgong (Dragon Palace) Caves","Tianxingqiao Scenic Area","Doupotang Waterfall","Tianlong Tunbao Ancient Town","Yunfeng Tunpu (Eight Villages)","Getu River Scenic Area","Anshun Confucian Temple (Wen Miao)","Anshun Batik Museum","Guanling National Geopark"],
 "Antalya": ["Hadrian's Gate","Kaleiçi (Old Town)","Düden Waterfalls","Yivli Minaret Mosque","Antalya Aquarium","Termessos","Perge","Aspendos","Side (Temple of Apollo)","Konyaaltı Beach"]
}

CITY_SLUG = {
 "Algiers":"algiers","Alicante":"alicante","Alice Springs":"alice-springs","Almaty":"almaty",
 "Amman":"amman","Amritsar":"amritsar","Amsterdam":"amsterdam","Anaheim":"anaheim",
 "Anchorage":"anchorage","Andorra la Vella":"andorra-la-vella","Angra dos Reis":"angra-dos-reis",
 "Ankara":"ankara","Annecy":"annecy","Anshun":"anshun","Antalya":"antalya"
}

def slugify(name):
    main = re.split(r'[\(/]', name)[0].strip()
    main = main.replace("'", "").replace("’","").replace(".", "")
    main = re.sub(r'[^a-zA-Z0-9]+', '-', main)
    main = re.sub(r'-+', '-', main).strip('-').lower()
    return main

HEADERS = {"User-Agent": "NeverRoamAloneBot/1.0 (contact: jcwolinsky@gmail.com) research/photo-sourcing"}

sess = requests.Session()
sess.headers.update(HEADERS)

def wiki_opensearch(query, retries=3):
    url = "https://en.wikipedia.org/w/api.php"
    params = {"action":"opensearch","search":query,"limit":5,"namespace":0,"format":"json"}
    for attempt in range(retries):
        r = sess.get(url, params=params, timeout=10)
        if r.status_code == 200:
            data = r.json()
            return data[1] if len(data) > 1 else []
        if r.status_code in (429, 503):
            time.sleep(1.5 * (attempt + 1))
            continue
        r.raise_for_status()
    return []

def wiki_summary(title, retries=3):
    t = urllib.parse.quote(title.replace(" ", "_"))
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{t}"
    for attempt in range(retries):
        r = sess.get(url, timeout=10)
        if r.status_code == 200:
            return r.json()
        if r.status_code in (429, 503):
            time.sleep(1.5 * (attempt + 1))
            continue
        return None
    return None

def get_commons_filepage(image_url):
    m = re.search(r'/commons/(?:thumb/)?[0-9a-f]/[0-9a-f]{2}/([^/]+)', image_url)
    if m:
        fname = m.group(1)
    else:
        m = re.search(r'/([^/]+)$', image_url)
        fname = m.group(1)
    fname = urllib.parse.unquote(fname)
    return f"https://commons.wikimedia.org/wiki/File:{fname}"

def process_one(city, lm):
    cslug = CITY_SLUG[city]
    entry = None
    err = None
    try:
        titles_to_try = []
        try:
            cands = wiki_opensearch(lm)
            titles_to_try.extend(cands)
        except Exception as e:
            err = f"opensearch:{e}"
        titles_to_try.append(lm)
        titles_to_try.append(re.split(r'[\(/]', lm)[0].strip())
        seen = set()
        summary = None
        used_title = None
        for t in titles_to_try:
            if not t or t in seen:
                continue
            seen.add(t)
            try:
                s = wiki_summary(t)
            except Exception as e:
                s = None
                err = f"summary:{e}"
            if s and s.get("originalimage") and s.get("type") != "disambiguation":
                summary = s
                used_title = t
                break
        if summary:
            img_url = summary["originalimage"]["source"]
            page_url = get_commons_filepage(img_url)
            lslug = slugify(lm)
            fname = f"{cslug}-{lslug}.jpg"
            entry = {"lm": lm, "img_url": img_url, "page": page_url, "fname": fname, "used_title": used_title}
        else:
            err = err or "no-summary-found"
    except Exception as e:
        entry = None
        err = str(e)
    return (city, lm, entry, err)

tasks = []
for city, landmarks in DATA.items():
    for lm in landmarks:
        tasks.append((city, lm))

results = {city: [None]*len(lms) for city, lms in DATA.items()}
idx_map = {}
for city, lms in DATA.items():
    for i, lm in enumerate(lms):
        idx_map[(city, lm)] = i

log = []
with ThreadPoolExecutor(max_workers=6) as ex:
    futs = [ex.submit(process_one, c, l) for c, l in tasks]
    for fut in as_completed(futs):
        city, lm, entry, err = fut.result()
        i = idx_map[(city, lm)]
        results[city][i] = entry
        log.append(f"{city} | {lm} -> {'OK' if entry else 'MISS ('+str(err)+')'}")

os.makedirs("/tmp/b3_work", exist_ok=True)
with open("/tmp/b3_work/candidates.json", "w") as f:
    json.dump(results, f, indent=2)
with open("/tmp/b3_work/log.txt", "w") as f:
    f.write("\n".join(sorted(log)))

print("DONE", len(tasks), "tasks")
miss = [l for l in log if "MISS" in l]
print(f"{len(miss)} misses")
for m in sorted(miss):
    print(m)
