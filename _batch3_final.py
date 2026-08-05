# -*- coding: utf-8 -*-
import json, re, os

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

# indices to DISCARD from pass1 candidates.json (wrong city / non-free logo / bad match)
BAD_PASS1 = {
 ("Algiers",6),("Algiers",8),
 ("Alicante",0),("Alicante",2),("Alicante",4),("Alicante",6),("Alicante",7),("Alicante",9),
 ("Alice Springs",1),("Alice Springs",9),
 ("Almaty",1),("Almaty",6),("Almaty",8),
 ("Amman",3),("Amman",6),
 ("Amritsar",4),("Amritsar",6),
 ("Amsterdam",2),("Amsterdam",3),("Amsterdam",8),
 ("Anaheim",3),
 ("Anchorage",5),("Anchorage",6),
 ("Andorra la Vella",2),("Andorra la Vella",3),("Andorra la Vella",8),
 ("Ankara",4),
 ("Annecy",0),("Annecy",7),("Annecy",8),("Annecy",9),
}

with open("/tmp/b3_work/candidates.json") as f:
    p1 = json.load(f)
with open("/tmp/b3_work/pass2.json") as f:
    p2 = json.load(f)
with open("/tmp/b3_work/pass3.json") as f:
    p3 = json.load(f)
with open("/tmp/b3_work/pass4.json") as f:
    p4 = json.load(f)
with open("/tmp/b3_work/pass5.json") as f:
    p5 = json.load(f)

final = {c: [None]*10 for c in DATA}

# layer 1: pass1, excluding bad
for city, arr in p1.items():
    for i, e in enumerate(arr):
        if e and (city, i) not in BAD_PASS1:
            final[city][i] = {"img_url": e["img_url"], "page": e["page"]}

# layer overlays: pass2 -> pass3 -> pass4 -> pass5 (only fill if currently None, OR if in BAD_PASS1 / explicitly targeted)
for layer in (p2, p3, p4, p5):
    for city, idxs in layer.items():
        for idx_str, e in idxs.items():
            idx = int(idx_str)
            if e:
                final[city][idx] = {"img_url": e["url"], "page": e.get("descurl") or e["url"]}

# manual overrides (found via targeted verification / web search after automated passes)
MANUAL = {
 ("Almaty",1): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/6/65/Almaty_K%C3%B6k_T%C3%B6be.jpg","page":"https://commons.wikimedia.org/wiki/File:Almaty_K%C3%B6k_T%C3%B6be.jpg"},
 ("Almaty",6): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/7/72/TV-Turm_Almaty_-_3.jpg","page":"https://commons.wikimedia.org/wiki/File:TV-Turm_Almaty_-_3.jpg"},
 ("Amman",6): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/5/55/Amman_Al_Husseini_Mosque_exterior_0619.jpg","page":"https://commons.wikimedia.org/wiki/File:Amman_Al_Husseini_Mosque_exterior_0619.jpg"},
 ("Amritsar",6): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/8/87/Durgiana_Temple%2C_Amritsar_01.jpg","page":"https://commons.wikimedia.org/wiki/File:Durgiana_Temple,_Amritsar_01.jpg"},
 ("Amritsar",7): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Statue_of_Maharaja_Ranjit_Singh%2C_Amritsar_01.jpg/3840px-Statue_of_Maharaja_Ranjit_Singh%2C_Amritsar_01.jpg","page":"https://commons.wikimedia.org/wiki/File:Statue_of_Maharaja_Ranjit_Singh,_Amritsar_01.jpg"},
 ("Amsterdam",3): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Amsterdam_%288697325011%29.jpg/3840px-Amsterdam_%288697325011%29.jpg","page":"https://commons.wikimedia.org/wiki/File:Amsterdam_(8697325011).jpg"},
 ("Andorra la Vella",2): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/6/64/Caldea_20231205_122111.jpg","page":"https://commons.wikimedia.org/wiki/File:Caldea_20231205_122111.jpg"},
 ("Alicante",6): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/b/b3/MARQ_Alacant.JPG","page":"https://commons.wikimedia.org/wiki/File:MARQ_Alacant.JPG"},
 ("Alice Springs",1): {"img_url":"https://upload.wikimedia.org/wikipedia/commons/1/1b/Alice_Springs_Desert_Park.JPG","page":"https://commons.wikimedia.org/wiki/File:Alice_Springs_Desert_Park.JPG"},
}
for (city, idx), e in MANUAL.items():
    final[city][idx] = e

# explicit nulls (confirmed no real photo found after exhaustive search)
NULLS = {
 ("Anshun",5),("Anshun",6),("Anshun",8),("Anshun",9),
 ("Anaheim",7),
}
for (city, idx) in NULLS:
    final[city][idx] = None

# build fname for every non-null entry, download list
download_list = []
out = {}
for city, lms in DATA.items():
    out[city] = []
    cslug = CITY_SLUG[city]
    for i, lm in enumerate(lms):
        e = final[city][i]
        if e is None:
            out[city].append(None)
            continue
        lslug = slugify(lm)
        fname = f"{cslug}-{lslug}.jpg"
        out[city].append({"img": f"images/landmarks/{fname}", "page": e["page"]})
        download_list.append({"city": city, "idx": i, "lm": lm, "url": e["img_url"], "fname": fname})

with open("/tmp/b3_work/final_output.json","w") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
with open("/tmp/b3_work/download_list.json","w") as f:
    json.dump(download_list, f, indent=2, ensure_ascii=False)

miss = sum(1 for city in out for e in out[city] if e is None)
present = sum(1 for city in out for e in out[city] if e is not None)
print(f"present={present} miss={miss} total={present+miss}")
for city, arr in out.items():
    nmiss = sum(1 for e in arr if e is None)
    if nmiss:
        print(city, "missing", nmiss, [i for i,e in enumerate(arr) if e is None])
