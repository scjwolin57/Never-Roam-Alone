# Hood picks batch 1: chain check of the live picks (report only, 2026-09-23)

Jeff asked: "do batch 1 after if it costs nothing". The new chain detector (`_guidebuild/hoodpicks/chain_detect.py`: free, offline: Overture open data, OpenStreetMap's list of chain brands, each venue's own website) was run on the 726 batch-1 picks that carry a Google place ID. **Nothing on the site or in the sheet was changed.** Zero Google calls.

How far to trust it: on batch 2's 499 hand-checked picks it caught 118 of the 136 chains the checkers found, and on 42 venues it flagged that the checkers had passed, a fresh check found 23 real chains and 17 single venues. So a flag is a strong lead, not a verdict: each item below needs a page check before anything changes.

| Group | Picks | What it would mean |
|---|---|---|
| Chain with outlets outside the city (strong evidence) | 48 (31 not marked at all, 17 marked "local chain") | under the 2026-09-23 rule (10 or fewer outlets and founded in this city) each is checked: kept and marked if it passes (e.g. a Poilâne or Levain with 10 or fewer outlets), removed if not |
| Local chain, strong evidence, not marked | 86 | kept if 10 or fewer outlets and founded here, with "; local chain" in the note; removed if larger |
| Local chain, weak evidence only, not marked | 181 | usually a duplicate map record; check before marking |
| Already marked as a chain and consistent | 98 | nothing to do |
| No chain signal | 313 | nothing to do |

Rule since 2026-09-23 (Jeff: "use 10 and founded here"): a chain stays only with 10 or fewer outlets in total and founded in this city.

**Question for Jeff:** run the page check on the first two groups (no Google calls; roughly 130 page reads by agents, no web searches needed for most), then fix the site and sheet by the same load path as the batches? Nothing happens until you say so.

## Chains with outlets outside the city (strong evidence)
| City | Hood | Section / kind | Pick | Evidence |
|---|---|---|---|---|
| bangkok | Sukhumvit | cafes / bakery | Holey Artisan Bakery | national: same name in our cache for phuket |
| macau | Cotai | cafes / bakery | Lord Stow's Bakery & Cafe (marked local) | global: website lordstow.com at 5 places abroad |
| singapore | Marina Bay | eat / casual | PUTIEN Reserve | global: website putien.com at 11 places abroad |
| singapore | Orchard | eat / local | JUMBO Seafood (marked local) | global: website jumboseafood.com.sg at 4 places abroad |
| london | Soho & Westminster | eat / casual | Circolo Popolare | global: website circolopopolare.com at 3 places abroad |
| london | Shoreditch | eat / local | Blacklock | national: website theblacklock.com at 2 places elsewhere in the country |
| london | Shoreditch | eat / casual | Dishoom Shoreditch (marked local) | national: website dishoom.com at 4 places elsewhere in the country |
| london | Camden | eat / casual | Purezza | national: NSI brand 'Purezza' |
| london | Shoreditch | cafes / coffee | WatchHouse (marked local) | global: NSI brand 'WatchHouse' |
| paris | Le Marais | cafes / bakery | Aux Merveilleux de Fred | national: website auxmerveilleux.fr at 2 places elsewhere in the country |
| paris | Saint-Germain-des-Prés | cafes / bakery | Boulangerie Poilâne (marked local) | global: website poilane.com at 2 places abroad |
| paris | Champs-Élysées | bars / pub | O'Sullivans | national: website osullivans-pubs.com at 3 places elsewhere in the country |
| dubai | Downtown Dubai | eat / fine | TATEL Dubai | global: website tatelrestaurants.com at 6 places abroad |
| dubai | Dubai Marina | eat / casual | Bosporus Turkish Cuisine | global: website thebosporus.com at 2 places abroad |
| dubai | Downtown Dubai | cafes / bakery | Yamanote Atelier The Dubai Mall | national: website yamanoteatelier.com at 2 places elsewhere in the country |
| new-york | Midtown | eat / local | Junior's Restaurant & Bakery | national: website juniorscheesecake.com at 3 places elsewhere in the country |
| new-york | Greenwich Village | cafes / takeaway | Joe's Pizza (marked local) | national: NSI brand 'Joe's Pizza' |
| new-york | Upper East Side | cafes / bakery | Levain Bakery (marked local) | national: Overture brand tag 'Levain Bakery' (11 places elsewhere in the country) |
| mecca | Al Shubaikah | eat / local | الرومانسية أبراج جبل عُمر Al romansiah (marked local) | global: website alromansiah.com at 2 places abroad |
| mecca | Al Aziziyah | cafes / coffee | Barn's (marked local) | national: NSI brand 'بارنز' |
| mecca | Al Shubaikah | cafes / coffee | Address Cafe (عنوان القهوة) (marked local) | national: website addresscafe.sa at 144 places elsewhere in the country |
| istanbul | Sultanahmet | cafes / bakery | Hafiz Mustafa 1864 | global: website hafizmustafa.com at 2 places abroad |
| istanbul | Beyoğlu (Taksim) | cafes / bakery | Hafız Mustafa 1864 Pera | global: website hafizmustafa.com at 2 places abroad |
| tokyo | Shinjuku | bars / pub | Liquor Museum Shinjuku Subnade | national: website osakeno-museum.com at 4 places elsewhere in the country |
| antalya | Konyaaltı | eat / casual | Shakespeare Coffee & Bistro (marked local) | global: NSI brand 'Shakespeare Coffee & Bistro' |
| osaka | Namba (Minami) | eat / casual | 551 Horai Honten (marked local) | national: website 551horai.co.jp at 2 places elsewhere in the country |
| osaka | Umeda (Kita) | eat / local | Gyukatsu Motomura LUCUA | national: website gyukatsu-motomura.com at 9 places elsewhere in the country |
| osaka | Umeda (Kita) | cafes / coffee | GLITCH COFFEE OSAKA | national: website glitchcoffee.com at 5 places elsewhere in the country |
| rome | Monti | cafes / takeaway | Trieste Pizza | national: website trieste.pizza at 6 places elsewhere in the country |
| phuket | Patong | eat / casual | Indiagate Restaurant Phuket | national: website indiagateth.com at 4 places elsewhere in the country |
| phuket | Phuket Old Town | eat / fine | Blue Elephant Phuket | national: same name in our cache for pattaya-chonburi |
| phuket | Karon | cafes / bakery | Garang Karon | national: website garangicecream.com at 2 places elsewhere in the country |
| kuala-lumpur | Bangsar | cafes / coffee | ZUS Coffee (Menara UOA Bangsar) (marked local) | global: NSI brand 'ZUS Coffee' |
| medina | Central Area (Al Haram) | cafes / takeaway | ALBAIK (marked local) | global: NSI brand 'البيك' |
| milan | Duomo / Centro | eat / casual | Spontini (marked local) | national: website spontinimilano.com at 2 places elsewhere in the country |
| milan | Brera | eat / fine | Gloria Osteria Milano | global: website gloria-osteria.com at 4 places abroad |
| milan | Isola | eat / local | Assaje | national: website assaje.it at 4 places elsewhere in the country |
| milan | Duomo / Centro | cafes / coffee | Caffè Napoli Giardino | national: website caffenapoli.com at 3 places elsewhere in the country |
| milan | Navigli | cafes / bakery | Cioccolatitaliani (marked local) | global: website cioccolatitaliani.it at 5 places abroad |
| los-angeles | Santa Monica | eat / local | Sweet Maple | national: website sweetmaplesf.com at 3 places elsewhere in the country |
| los-angeles | Venice | eat / casual | Zinqué Venice | national: website lezinque.com at 4 places elsewhere in the country |
| los-angeles | Beverly Hills | eat / casual | Avra Beverly Hills | national: website theavragroup.com at 4 places elsewhere in the country |
| los-angeles | Beverly Hills | eat / fine | The Penthouse at Mastro's | national: website mastrosrestaurants.com at 23 places elsewhere in the country |
| los-angeles | Santa Monica | cafes / takeaway | Bacio di Latte | global: NSI brand 'Bacio di Latte' |
| prague | Old Town | cafes / coffee | The Miners Coffee | global: website theminers.eu at 18 places abroad |
| madrid | Malasaña | eat / casual | Honest Greens Gran Vía | global: NSI brand 'Honest Greens' |
| taipei | Da'an | eat / casual | Hashiyama Sukiyaki (橋山.壽喜燒) (marked local) | global: website inline.app at 2 places abroad |
| taipei | Shilin | cafes / bakery | Ijysheng (一之軒) | national: NSI brand '一之軒' |

## Local chains with strong evidence, not marked
| City | Hood | Section / kind | Pick | Evidence |
|---|---|---|---|---|
| hong-kong | Central | eat / local | Tim Ho Wan (Central) | local: website timhowan.com.hk at 2 other places in the metro, 0 further away (agent checks scope) |
| hong-kong | Tsim Sha Tsui | eat / casual | aqua | local: website aqua.com.hk at 2 other places in the metro, 1 further away (agent checks scope) |
| hong-kong | Causeway Bay | cafes / coffee | Artista Perfetto | local: website artistaperfetto.com at 3 other places in the metro, 0 further away (agent checks scope) |
| bangkok | Silom | eat / casual | Teppen Sathorn | local: website teppenthailand.co.th at 4 other places in the metro, 0 further away (agent checks scope) |
| bangkok | Riverside (Bang Rak) | eat / local | Baan Somtum Sathorn | local: website baansomtum.com at 4 other places in the metro, 0 further away (agent checks scope) |
| bangkok | Sukhumvit | cafes / coffee | Bottomless Sukhumvit 33 | local: website bottomlesscoffeeroasters.com at 5 other places in the metro, 0 further away (agent checks scope) |
| bangkok | Riverside (Bang Rak) | bars / party | SUBWERK | local: homepage text: '...werk club sat 31 oct subwerk (new location july) learn more techno pool...' (scope: agent conf |
| bangkok | Siam | bars / pub | CRU Champagne Bar | local: website champagnecru.com at 2 other places in the metro, 0 further away (agent checks scope) |
| singapore | Chinatown | eat / local | Maxwell Food Centre | local: sitemap lists a branch page (https://www.nea.gov.sg/corporate-functions/Contact-Us/location/offices-and-facilitie |
| singapore | Little India | eat / casual | Erode Amman Mess | local: homepage links to a branch list ('our locations') (scope: agent confirms every branch is in this city) |
| singapore | Chinatown | cafes / bakery | Rise Bakehouse | local: website risebakehouse.sg at 2 other places in the metro, 0 further away (agent checks scope) |
| london | Kensington | eat / local | The Ivy Kensington Brasserie | local: website ivycollection.com at 4 other places in the metro, 1 further away (agent checks scope) |
| london | Soho & Westminster | cafes / takeaway | JUNK | local: website junkburgers.co.uk at 2 other places in the metro, 0 further away (agent checks scope) |
| london | Soho & Westminster | cafes / bakery | Arôme Bakery | local: website aromebakery.co.uk at 2 other places in the metro, 0 further away (agent checks scope) |
| london | Kensington | cafes / bakery | Sakurado | local: website sakurado.co.uk at 2 other places in the metro, 0 further away (agent checks scope) |
| london | Camden | cafes / coffee | Camden Coffee Roastery | local: homepage links to a branch list ('location') (scope: agent confirms every branch is in this city) |
| london | Notting Hill | cafes / bakery | Lisboa Patisserie | local: homepage text: '...ge log in website coming soon our locations ​lisboa patisserie 57 golborn...' (scope: agent co |
| paris | Saint-Germain-des-Prés | eat / casual | Kodawari Ramen (Yokochō) | local: website kodawari-ramen.com at 2 other places in the metro, 0 further away (agent checks scope) |
| paris | Latin Quarter | bars / pub | Baba Yaga Paris | local: website privateaser.com at 11 other places in the metro, 0 further away (agent checks scope) |
| paris | Champs-Élysées | bars / cocktail | Gentlemen 1919 | local: sitemap lists a branch page (https://www.gentlemen1919.com/location/bali-indonesia) (scope: agent confirms every  |
| dubai | Jumeirah | eat / fine | Mimi Kakushi | local: website mimikakushi.ae at 2 other places in the metro, 0 further away (agent checks scope) |
| dubai | Dubai Marina | cafes / bakery | Ninna Bakehouse & Cafe | local: website ninnadubai.com at 1 other places in the metro, 0 further away (agent checks scope) |
| new-york | Midtown | eat / fine | Keens Steakhouse | local: website keens.com at 1 other places in the metro, 0 further away (agent checks scope) |
| new-york | SoHo | eat / local | Hamburger America | local: website hamburgeramerica.com at 1 other places in the metro, 0 further away (agent checks scope) |
| new-york | Upper East Side | eat / local | EJ's Luncheonette | local: website ejsluncheonette.com at 2 other places in the metro, 0 further away (agent checks scope) |
| new-york | Upper East Side | eat / casual | THEP Thai Restaurant | local: website thepnewyork.com at 1 other places in the metro, 1 further away (agent checks scope) |
| new-york | Upper East Side | eat / fine | Mission Ceviche | local: website missionceviche.com at 3 other places in the metro, 0 further away (agent checks scope) |
| new-york | Midtown | cafes / coffee | Culture Espresso | local: website cultureespresso.com at 2 other places in the metro, 0 further away (agent checks scope) |
| new-york | Williamsburg | cafes / takeaway | Rosa's Pizza | local: website rosaspizzanyc.com at 2 other places in the metro, 0 further away (agent checks scope) |
| new-york | Williamsburg | cafes / bakery | La Bicyclette Bakery | local: website labicyclettebakery.com at 3 other places in the metro, 0 further away (agent checks scope) |
| new-york | Upper East Side | cafes / takeaway | Panineria - Upper East Side | local: website lapanineria.com at 2 other places in the metro, 0 further away (agent checks scope) |
| new-york | Midtown | bars / pub | Beer Culture | local: website beerculture.nyc at 2 other places in the metro, 0 further away (agent checks scope) |
| new-york | SoHo | bars / pub | Cork Wine Bar (Soho) | local: website corkny.com at 1 other places in the metro, 0 further away (agent checks scope) |
| new-york | Greenwich Village | bars / pub | The Stonewall Inn | local: website thestonewallinnnyc.com at 1 other places in the metro, 1 further away (agent checks scope) |
| istanbul | Kadıköy | eat / local | Kadıköy Midyecisi | local: website kadikoymidyecisi.com at 1 other places in the metro, 0 further away (agent checks scope) |
| istanbul | Beşiktaş | cafes / bakery | Suflör | local: homepage links to a branch list ('franchise') (scope: agent confirms every branch is in this city) |
| tokyo | Shinjuku | eat / local | Mo-Mo-Paradise Shinjuku Higashi-guchi | local: website mo-mo-paradise.com at 5 other places in the metro, 0 further away (agent checks scope) |
| tokyo | Asakusa | eat / local | Gyumon Halal Ramen Asakusa | local: website gyumon-group.com at 1 other places in the metro, 0 further away (agent checks scope) |
| tokyo | Akihabara | eat / casual | Chinka-shisai Akihabara | local: site page https://chin-z.com/%e5%90%84%e5%ba%97%e8%88%97%e5%85%ac%e5%bc%8fline/ text: '...とさせていたたきます。 他のクーホンとの併用は |
| tokyo | Akihabara | eat / fine | Niku-ya-Yokocho Akihabara | local: homepage links to a branch list ('店舗一覧') (scope: agent confirms every branch is in this city) |
| tokyo | Akihabara | cafes / bakery | Cow Cow Kitchen Akihabara | local: homepage text: '...ore store 店舗・催事情報 --> 直営店一覧 催事店舗一覧 news お知らせ...' (scope: agent confirms every branch is in thi |
| tokyo | Akihabara | bars / pub | Yona Yona Beer Works Kanda | local: website yonayonabeerworks.com at 7 other places in the metro, 0 further away (agent checks scope) |
| antalya | Lara | cafes / coffee | Reev Coffee Lara | local: website reevcoffee.com at 2 other places in the metro, 1 further away (agent checks scope) |
| seoul | Gangnam | cafes / coffee | Nata O Bica | local: website nataobica.com at 3 other places in the metro, 0 further away (agent checks scope) |
| osaka | Namba (Minami) | cafes / takeaway | Takoyaki Wanaka Sennichimae | local: homepage text: '...-8-21 トッフ わなかの歴史 わなかnews menu 店舗一覧 オンラインショッフ オンラインショッフ 会社概要 お問い合...' (scope: agent confirms ev |
| osaka | Tennoji | bars / pub | Sorairo kitchen Tenshiba | local: lead word 'sorairo' starts 1 other names in the metro, 4 elsewhere in the country |
| rome | Trastevere | eat / local | Tonnarello Scala | local: website tonnarello.it at 3 other places in the metro, 0 further away (agent checks scope) |
| rome | Trastevere | eat / casual | L'Elementare Trastevere | local: website pizzerialelementare.it at 4 other places in the metro, 0 further away (agent checks scope) |
| rome | Prati (Vaticano) | cafes / coffee | Sciascia Caffè 1919 | local: website sciasciacaffe1919.it at 2 other places in the metro, 0 further away (agent checks scope) |
| kuala-lumpur | Bukit Bintang | eat / local | Madam Kwan's | local: Overture brand tag 'Madam Kwan's' (10 other places in the metro) |
| kuala-lumpur | KLCC | eat / local | Oriental Kopi • Suria KLCC | local: website orientalkopi.asia at 2 other places in the metro, 1 further away (agent checks scope) |
| kuala-lumpur | Bangsar | eat / local | Nyonya Tingkat Bangsar Utama UOA | local: website nyonyatingkat.com.my at 2 other places in the metro, 0 further away (agent checks scope) |
| kuala-lumpur | KLCC | cafes / coffee | Ra-Ft Cafe / Bistro | local: website ra-ft.com at 3 other places in the metro, 0 further away (agent checks scope) |
| kuala-lumpur | Chinatown (Petaling) | cafes / bakery | KLCG Confectionery & Bakery, Medan Pasar | local: website klcg.online at 2 other places in the metro, 0 further away (agent checks scope) |
| barcelona | El Born | eat / local | Casa Lolea | local: website casalolea.com at 2 other places in the metro, 0 further away (agent checks scope) |
| barcelona | El Born | eat / casual | Spaccanapoli | local: website spaccanapolibcn.es at 2 other places in the metro, 0 further away (agent checks scope) |
| barcelona | El Born | eat / fine | Cal Pep | local: website calpep.com at 2 other places in the metro, 1 further away (agent checks scope) |
| barcelona | Gothic Quarter | cafes / coffee | Right Side Coffee Bar | local: website rightsidecoffee.com at 3 other places in the metro, 0 further away (agent checks scope) |
| barcelona | Eixample | cafes / takeaway | DelaCrem | local: website delacrem.cat at 2 other places in the metro, 0 further away (agent checks scope) |
| barcelona | Gothic Quarter | bars / pub | La Alcoba Azul | local: website la-alcoba.com at 3 other places in the metro, 0 further away (agent checks scope) |
| milan | Duomo / Centro | eat / local | Via Pasteria | local: website viapasteria.com at 1 other places in the metro, 0 further away (agent checks scope) |
| milan | Porta Nuova | eat / casual | Domò Sushi Milano | local: website myrestoo.net at 2 other places in the metro, 0 further away (agent checks scope) |
| milan | Porta Nuova | eat / fine | Ceresio 7 Pools & Restaurant | local: website ceresio7.com at 1 other places in the metro, 1 further away (agent checks scope) |
| los-angeles | Hollywood | eat / casual | Star of India | local: website starofindiala.com at 2 other places in the metro, 1 further away (agent checks scope) |
| los-angeles | Santa Monica | eat / casual | UOVO | local: website uovo.la at 5 other places in the metro, 0 further away (agent checks scope) |
| los-angeles | Santa Monica | eat / fine | Meat On Ocean | local: website meatonocean.com at 2 other places in the metro, 0 further away (agent checks scope) |
| los-angeles | Beverly Hills | eat / local | The Grill on the Alley | local: website thegrillonthealley.com at 0 other places in the metro, 1 further away (agent checks scope) |
| los-angeles | Downtown LA | cafes / coffee | Archives Of Us | local: homepage links to a branch list ('new openings - coming soon') (scope: agent confirms every branch is in this cit |
| los-angeles | Beverly Hills | cafes / takeaway | Joe's Pizza Beverly Hills | local: website joespizza.it at 5 other places in the metro, 1 further away (agent checks scope) |
| los-angeles | Beverly Hills | cafes / bakery | Pop's Bagels | local: website popsbagelsla.com at 4 other places in the metro, 0 further away (agent checks scope) |
| prague | New Town | eat / fine | Taro | local: website taro.cz at 2 other places in the metro, 0 further away (agent checks scope) |
| prague | Vinohrady | eat / casual | Hoxton Burgers | local: website hoxton.cz at 3 other places in the metro, 0 further away (agent checks scope) |
| prague | Vinohrady | eat / fine | Levitate | local: website levitate.cz at 2 other places in the metro, 0 further away (agent checks scope) |
| prague | Žižkov | eat / fine | Sumi Garden | local: website sumigarden.com at 2 other places in the metro, 0 further away (agent checks scope) |
| prague | Old Town | cafes / bakery | Kolacherie | local: website kolacherie.cz at 2 other places in the metro, 0 further away (agent checks scope) |
| prague | Malá Strana | cafes / takeaway | Crème de la Crème | local: website cremedelacreme.cz at 2 other places in the metro, 0 further away (agent checks scope) |
| prague | New Town | cafes / bakery | Artic Bakehouse | local: website articbakehouse.cz at 5 other places in the metro, 0 further away (agent checks scope) |
| prague | Vinohrady | cafes / takeaway | Crème de la Crème | local: website cremedelacreme.cz at 2 other places in the metro, 0 further away (agent checks scope) |
| prague | Žižkov | cafes / bakery | MATOKA Georgian | local: website matokageorgian.com at 1 other places in the metro, 0 further away (agent checks scope) |
| madrid | Salamanca | eat / local | Casa Dani | local: website casadani.es at 2 other places in the metro, 0 further away (agent checks scope) |
| madrid | Salamanca | eat / fine | Akiro Hand Roll Bar | local: website akironikkei.com at 0 other places in the metro, 1 further away (agent checks scope) |
| madrid | Salamanca | cafes / coffee | Hola Coffee Lagasca | local: website hola.coffee at 3 other places in the metro, 0 further away (agent checks scope) |
| madrid | Salamanca | cafes / bakery | Pastelería Mallorca Velázquez | local: website pasteleria-mallorca.com at 8 other places in the metro, 0 further away (agent checks scope) |
| taipei | Shilin | eat / local | Jipin Fried Dumpling (及品鍋貼水餃專賣店) | local: website 7-11.com.tw at 2 other places in the metro, 0 further away (agent checks scope) |
| taipei | Shilin | eat / casual | Modern Toilet Restaurant | local: homepage text: '...equently expanded to about 13 branches in taiwan, while also extending...' (scope: agent confi |
| taipei | Da'an | cafes / bakery | CUPETIT (卡柏蒂) | local: homepage links to a branch list ('門市據點') (scope: agent confirms every branch is in this city) |

The 181 weak-evidence picks are in `_guidebuild/hoodpicks/work/chain_live.json` (not listed here).
