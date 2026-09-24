# Transit "more info" popups — build notes for Jeff (12 July 2026)

## What got built
All 246 cities now have Train / Bus / Ferry "more info" popup data in **city-routes.js**.
The **city.html** transport cards ("Major train stations", "Major bus stations",
"Ferry / boat ports") open a popup listing direct international routes with official
operator links, plus a plain-English note. Cities with no data still show "coming soon".

## Status
- **101 cities are live in city.html right now** — all 101 were headless-tested
  (Train + Bus + Ferry each), 303/303 popups rendered correctly, **0 JavaScript errors**.
- **145 cities are researched and waiting in city-routes.js** but are not yet in the page.
  They will switch on automatically as those city pages go live (the separate
  "coming soon" city rollout). No extra work needed on the popup side for them.

## One code change I made
Some real operators genuinely have no official booking website (common in parts of
Africa, the Pacific, and conflict zones). For those, the researchers filled in the
operator name but left the link blank. I updated the popup so a blank link shows the
operator as **plain text** instead of a broken clickable link.

## Things worth a human double-check before/at publish
These are volatile facts the researchers flagged (mostly cross-border services that get
suspended/resumed, or operators without a clean official site). Grouped by research batch:

## Batch 2
- Nice → Porto Torres (Sardinia) via Corsica Ferries: seasonal — confirm running in 2026 summer timetable.
- Guangzhou HK/Macau listed under "intl" per Hong Kong.json precedent; CKS Nansha ferry frequencies shift — reconfirm.
- Munich Nightjet Amsterdam/Brussels run selected days only (noted).
## Batch 5
- Verona: Vienna–Milan Nightjet via Verona marked suspended/omitted — confirm if resumed.
- Porto: Celta train Valença–Vigo is rail-replacement bus 6 Apr 2026–~Apr 2027; verify Portuguese leg still by train.
- Bologna: new Frecciarossa EC Munich–Rome via Bologna launching 2026 — described existing Railjet/EC; confirm branding.
- Delhi: DTC Kathmandu bus frequency fluctuates — sanity-check.
## Batch 1
- Antalya: seasonal Alanya–Girne (N. Cyprus) ferry on/off — flagged not listed; reliable Cyprus ferry is Taşucu (far east). dom null (no railway).
- Seoul: Weidong ferry leaves Incheon, not Seoul (noted).
- Madrid: train.intl intentionally empty (no DIRECT cross-border trains) — confirm comfortable presenting that.
- Taipei: Keelung→Ishigaki (Japan) ferry launched late May 2026, brand-new — verify frequency.
- Berlin: note captures Dec 2025 withdrawal of direct Paris/Vienna Nightjets & European Sleeper to Brussels.
## Batch 6
- Marne-la-Vallée: direct London Eurostar suspended since 2023 (change at Lille); confirm Brussels service frequency 2026.
- Hanoi: Hanoi–Vientiane/Luang Prabang (Laos) coaches exist but no trustworthy official operator site found — described in note, bus.intl left empty; could add verified operator URL.
- Johor Bahru: RTS Link metro to Singapore opening ~end-2026/2027 (noted).
## Batch 4
- Abu Dhabi: Etihad Rail passenger service launched 30 Jun 2026 (dom); no intl trains yet.
- Fukuoka: JR Kyushu Queen Beetle permanently withdrawn Dec 2024 — do NOT re-add.
- Montreal: Amtrak Adirondack to Montreal had repeated summer suspensions (2023/24) — verify running now (Jul 2026).
- Edinburgh: Rosyth–Dunkirk DFDS ferry announced spring 2026 but unconfirmed — left ferry.intl empty; re-check.
- Busan–Tsushima (Miraejet/Daea) named in note, no URL — add if confirmed.
## Batch 3
- Beijing: only confirmed intl train weekly K23 to Ulaanbaatar; Moscow K3/K19 suspended; Pyongyang K27 resumed Mar 2026 (DPRK restricted). Intl tickets not sold on 12306 online — verify ticket-office guidance.
- Warsaw: Budapest NOT direct (Chopin's Budapest section runs from Kraków) — flagged.
- Valencia: old Grimaldi Valencia–Livorno appears discontinued, omitted — double-check if Italy ferries wanted.
- Shenzhen: HK crossings treated as intl per Hong Kong/Macau files; some bus operator URLs left in note only.
- Doha: no bookable intl coach with official site found — bus.intl left empty; verify Doha–Dammam/Riyadh coach.
## Batch 10
- Baku: ADY ticket.ady.az returned 403 to fetch but is the real portal; intl buses linked to terminal (no single carrier site).
- Dhaka: Maitree/Mitali cross-border trains suspended since Aug 2024, still halted — train.intl empty by design; verify Dhaka–Kolkata buses still running.
- Thimphu/Bhutan: cross-border coach departs Phuentsholing, not Thimphu (noted).
- Bandar Seri Begawan: Malaysian bus + Serasa ferry operators lack official sites — url left empty.
- Siem Reap: Nattakan Bangkok coach url empty (no clean official site).
## Batch 11
- Nicosia: no railway (dom null); only sea link seasonal Limassol–Piraeus (~late May–early Sept 2026), leaves Limassol not Nicosia; verify 2026 operator/booking URL (charter changes).
- Tehran: Tehran–Van (Turkey) sleeper resumed 2025 (night); Raja domestic often needs Iran connection/VPN; Gulf ferries from Bandar Abbas noted only.
- Baghdad: IRR domestic sleeper has no website — dom url blank by design; security caveats in notes.
- Amman: no passenger rail; JETT to Cairo; Aqaba–Nuweiba ferry (AB Maritime) ~4h south, no URL — verify.
- Almaty: KTZ sleepers to Tashkent/Moscow (night); reconfirm Almaty–Moscow selling for 2026; Urumqi train suspended.
## Batch 7
- Tel Aviv: no intl trains (borders closed); bus/ferry empty-with-note; only ad-hoc Cyprus charter ferries during flight disruptions.
- Sharjah: Etihad Rail city station opens Mar 2027 (Al Dhaid Sep 2026) — no passenger rail yet.
- Thessaloniki: ALL Greek intl trains suspended (per Hellenic Train) — train.intl empty.
- Medina: SAPTCO intl network confirmed but couldn't verify coaches originate in Medina vs Jeddah/Riyadh — flagged.
- Tbilisi–Baku sleeper: visa-free-entry only (many Westerners can't use); shakiest item, reconfirm.
- Unfetched-but-standard URLs: metroturizm.com.tr, union-ivkoni.com, simeonidistours.gr, crazyholidays.gr, cruzdelsur.com.pe.
## Batch 8
- Mecca: hhr.sa not fetched live (timeout) but confirmed via seat61; non-Muslims cannot enter Mecca noted; Jeddah port ~85km.
- Riyadh: SAPTCO intl list conservative (UAE/Bahrain confirmed; Kuwait/Qatar/Jordan/Egypt not individually verified).
- Tallinn: no intl trains (Russia sanctioned, Rail Baltica ~2030); strong ferry hub.
- Punta Cana: intl bus/ferry depart Santo Domingo, not Punta Cana (noted).
- Santiago: dom rail EFE (efe.cl); direct-booking portal ventaonline.trencentral.cl if preferred.
## Batch 12
- Bishkek: only Moscow confirmed as direct intl train (resumed Dec 2024); other Russia routes unconfirmed for 2026.
- Vientiane: LCR has no English booking site — used LCR Ticket app Play Store listing for Kunming/domestic; editor may prefer station note or 12306.
- Beirut: Cedar Waves Jounieh–Larnaca ferry launched Jun 2026 (departs Jounieh, not Beirut); verify still sailing + winter operation.
- Yangon: domestic rail url null (Myanmar Railways no reliable booking); Thai borders largely closed amid conflict.
## Batch 9
- Vilnius: only intl rail (Warsaw/Kraków via LTG Link) needs a change at Mockava — not single-seat; DFDS ferry from Klaipeda (~4h away), confirm foot-passenger booking.
- Zhuhai: Jiuzhou–HK ferry cut back since HZMB bridge — verify sailings still run 2026.
- Cairo/Jerusalem: no true through intl coach; JETT Cairo–Aqaba–Amman (bundles Nuweiba ferry); Jerusalem bus empty (Allenby/Taba crossings). Aswan–Sudan Lake Nasser ferry suspended.
- Yerevan: Batumi rail extension seasonal summer only (launched Jun 2026); Tbilisi sleeper year-round; Turkey/Azerbaijan borders closed.
- Kabul: no railway (dom null), no bookable intl coaches — reported honestly (security).
## Batch 17
- Georgetown: Canawaima ferry to Suriname SUSPENDED since 4 Feb 2026 (repairs, no restart) — listed but flagged; re-check status. No official intl bus.
- Port-au-Prince: only Capital Coach Line to Santo Domingo, heavily flagged (Level 4, gang control, border closures, airspace reopened ~May 2026) — verify running.
- hedmanalas.com / Tica Bus route pages not loadable (JS/robots) — domains correct, route lists inferred.
## Batch 18
- Panama City: Panama Canal Railway set as dom (only passenger train, no online booking) — consider dom:null. Darién Gap blocks Colombia buses. Expreso Panama dropped (domain hijacked) — do NOT relink.
- Paramaribo: neither ferry departs Paramaribo (2.5-4h away); Canawaima/French Guiana links are govt/embassy pages; French Guiana vessel name shifting (La Gabrielle/Malani) — recheck.
- Kingstown: no confirmed intl ferry for 2026 (Jaden Sun historically ran some) — verify.
- Castries: FRS URL is timetable page; swap to homepage if preferred.
## Batch 13
- Kathmandu: no railway serving capital; DTC Delhi–Kathmandu coach; landlocked.
- Pyongyang: Beijing sleeper K27/K28 resumed early 2026 (organised tour only, US passports barred); no booking URL (null); volatile — verify.
- Muscat: mwasalat.om /en 404'd — used homepage; confirm domain resolves. Ferries domestic only.
- Karachi: Thar Express to India suspended since 2019, still halted.
- Manila: PNR intercity largely suspended for NSCR construction.
- Colombo: KKS–Nagapattinam ferry (IndSri) seasonal, departs ~400km north (Jaffna), repeatedly suspended since 2023, url null — verify sailing + official page.
## Batch 16
- Havana: no online rail booking (dom.url null); trains leave La Coubre while Havana Central renovated — verify station. Viazul: viazul.com dead → used viazul.wetransp.com (community-cited, sanity-check).
- Quito: national rail suspended since 2020; only Devil's Nose heritage train (Alausí, not Quito). Panamericana Internacional confirmed bus operator; Rutas de América note-only.
- San Salvador: Tica Bus confirmed; King Quality/Pullmantur named in note, no clean official site.
## Batch 14
- Damascus: no usable rail (all intl trains suspended); buses to Beirut/Amman via Kadmous/Al-Kamal, no booking sites (note only); post-2025 govt change, routes shift fast.
- Dushanbe: Dushanbe–Moscow sleeper RESUMED 21 Jun 2026 (~biweekly); railway.tj Russia tickets often via RZD — reconfirm.
- Dili: Dili–Kupang (Indonesia) minibus, phone-booking only; no intl ferry.
- Ashgabat: no intl trains; Caspian ferry Turkmenbashi→Baku (~560km away); railway.gov.tm couldn't fetch — verify live.
- Tashkent: Talgo sleeper to Almaty + Moscow sleeper; eticket.railway.uz confirmed; reconfirm Tashkent–Moscow selling 2026.
- Sana'a: never had railways (dom null); civil war, borders closed — domestic only, honest report.
## Batch 15
- St. John's: Antigua→Montserrat ferry (Montserrat Ferry Services/Jaden Sun); operator site says timetable "being finalized" — used govt portal ferry.mniaccess.com; verify schedule.
- Nassau: no intl ferry from Nassau (Baleària runs from Fort Lauderdale); jitneys only.
- Bridgetown: no operating intl ferry mid-2026 (Connect Caribé regional ferry still in trial).
- Belize City: Chetumal water-taxi leaves San Pedro, Guatemala boats leave Punta Gorda (not Belize City) — flagged.
- La Paz: no rail from La Paz (nearest FCA from Oruro); landlocked.
- Bogotá: Ormeño (grupo-ormeno.com.pe) official but returned empty on fetch — verify loads; service infrequent.
## Batch 24
- Djibouti City: EDR train to Addis (day, 2 days w/ overnight in Dire Dawa). edr.gov.et set as url (couldn't fully verify); real booking bookingedr.et is Telebirr-only (in note).
- Malabo: island (Bioko), no rail/road links; Malabo–Bata ferry irregular/unreliable — flagged, no operator.
- Asmara: railway heritage/charter only; borders largely closed.
- Mbabane: Eswatini Railways freight-only; cross-border by minibus (no bookable coach).
- Addis Ababa: EDR to Djibouti from Lebu (day, 2 days); Selam/Sky Bus named in note, no verified URLs.
- Libreville: Setrag Trans-Gabon domestic only.
- NOTE: this agent's WebSearch was heavily 429 rate-limited; empty arrays reflect genuine absence but a re-check could catch newly launched coaches.
## Batch 20
- Apia: Apia–Pago Pago ferry (MV Lady Samoa IV) live Jul 2026 schedule via ssc.ws (old samoashipping.com now parked). Reconfirm sailing days near travel.
- Auckland: no intl rail/bus/ferry; KiwiRail Northern Explorer domestic; Interislander departs Wellington not Auckland (noted).
- Weno/Yaren/Koror/Port Moresby: empty intl arrays (isolated islands); Port Moresby not road-connected to rest of PNG.
- WebSearch heavily 429-limited; verification via WebFetch on official sites/Wikipedia.
## Batch 19
- Montevideo: EGA/Cauvi intl coaches + Buquebus ferry to Buenos Aires (verified); no intl trains; AFE minimal domestic rail.
- Port of Spain: no railway (closed 1968); domestic T&T ferry (ttitferry.com); confirm Trinidad–Güiria (Venezuela) ferry still suspended.
- Caracas: IFE site (ife.gob.ve) 503/down — dom.url null, operator in note; intl bus empty (no reliable direct coach 2026, crisis).
- Nadi: no rail; Sunbeam/Pacific Transport buses Facebook-only (no URL).
- Tarawa/Majuro: remote atolls; no rail/intl; domestic ships (KSSL/MISC) no booking sites.
## Batch 23 (WebSearch hard 429-limited all run; facts from Wikipedia, most operator URLs left empty by design)
- Abidjan: Sitarail Abidjan–Ouagadougou is only intl train (night, ~35-40h, intermittent due to insecurity); sitarail.net failed to load — verify 2026 operation. Bus operators (TCV, Rakieta, Bani, etc.) unverified.
- Brazzaville: CFCO url http://www.cfco.cg/ from Wikipedia (http, unverified); La Gazelle unreliable. Congo River ferry to Kinshasa (Beach Ngobila) terminal-ticketing, no url.
- Bangui/N'Djamena: no railways (dom null); informal road transport, bus.intl empty.
- Moroni: island, no rail/intl bus; confirm if Anjouan–Mayotte service should be mentioned.
## Batch 22
- Gaborone: Botswana Railways site shows BR Express passenger "SUSPENDED" banner but booking form still lists stations — verify live suspension vs stale banner.
- Ouagadougou: Sitarail intl train to Abidjan suspended since 2023 (train.intl empty); tickets station-only. TCV site down — used Africa Tours Trans + STMV.
- Bujumbura: intl bus operators no official sites (url empty); Lake Tanganyika ferry (MV Mwongozo/MSCL) irregular (seasonal); mscl.co.tz reconfirm.
- Praia: island, no rail/intl bus/intl ferry; CV Interilhas domestic.
- Douala: Camrail domestic (Douala–Yaoundé day, Yaoundé–Ngaoundéré overnight); Afrique Con Plc main intl coach.
- intercape.co.za 403 to curl but confirmed live via WebFetch.
## Batch 21
- Honiara/Nuku'alofa/Funafuti/Port Vila: island nations, no rail/intl bus/intl ferry; domestic ships noted (no booking sites, url empty). Funafuti govt ships make ~3-4 irregular voyages/yr to Suva.
- Algiers: SNTF domestic rail (Algiers–Constantine, Annaba overnight); no direct intl train (only Annaba–Tunis line); new Mar-2026 Algiers–Tunis coach (SNTRI/SOGRAL); ferries to Marseille/Alicante (Algérie Ferries, Corsica Linea) verified.
- Luanda: CFL domestic Luanda–Malanje; Macon Transportes coach to Windhoek verified; CFL dom URL is its official Facebook page (no booking site) — editor may want to review.
## Batch 30
- Victoria Falls: no scheduled cross-border train to Livingstone (foot only over bridge); NRZ overnight sleeper to Bulawayo weekly (Sun, cash/in-person). No direct intl coach (route via Bulawayo); citylinkcoaches.co.zw / extracity.co.zw not opened directly — verify resolve. No ferry (Kazungula bridge replaced ferry 2021).
## Batch 27
- Port Louis: only urban Metro Express (no long-distance rail); Rodrigues ferry domestic; no confirmed Réunion passenger ferry 2026.
- Maputo: CFM commuter only, intl trains suspended; Intercape to Joburg; no intl ferry.
- Windhoek: TransNamib StarLine suspended since 2021 (dom null); Intercape to Cape Town.
- Niamey: no railway; RTV/Rimbo buses; Niger–Benin border still closed, Nigeria reopened (volatile) — Cotonou leg may be suspended, recheck.
- Lagos: NRC Lagos–Ibadan SGR domestic; ABC Transport to Accra/Cotonou/Lomé; domestic lagoon ferries only.
- Kigali: Trinity/Volcano Express to Uganda/Kenya/Burundi; Kigali–Goma (DRC) excluded (M23 + 2026 Ebola closure); volcanoexpress.co.rw robots-blocked, routes from secondary sources.
## Batch 25
- Banjul: GTSC coaches to Dakar/Bissau; no railway; Barra ferry domestic.
- Accra: STC + ABC Transport intl; no usable intercity train (Ghana rail fragmentary; Takoradi line relaunched Apr 2026; Tema–Mpakadan not carrying passengers mid-2026 — recheck).
- Conakry: no formal ticketed intl coach (informal sept-place); bus.intl empty; Conakry Express commuter intermittent.
- Bissau: GTSC serves Bissau; no railway; Bijagos boats domestic.
- Nairobi: SGR domestic (day train, no night); Modern Coast + Mash East Africa cross-border.
- Maseru: no passenger rail; no formal bookable intl coach (minibus over Maseru Bridge); bus.intl empty.
## Batch 29
- Khartoum: civil war since Apr 2023 — no reliable trains/buses/ferries; kept with honest notes (not skip). Port Sudan–Jeddah ferry ~800km away, wartime status uncertain.
- Zanzibar City: Azam Marine ferries to Dar es Salaam/Pemba are DOMESTIC (ferry.intl empty, operator in note).
- Lomé: no passenger rail (freight only); ABC Transport + Africa Tours Trans buses.
- Tunis: Tunis–Annaba train reopened Aug 2024 (DAY train, ~9.5h, ~3x/wk, night:false) — verify still runs mid-2026; ferries to Italy/France (CTN, Corsica Linea, GNV) from La Goulette; intl buses empty.
- Kampala: no intl trains (SGR under construction); URC commuter only; Modern Coast + Jaguar buses to Kenya/Rwanda.
- Lusaka: TAZARA to Dar (night/multi-day) departs Kapiri Mposhi (~200km north, flagged); cross-border resuming 10 Feb 2026 — verify.
## Batch 26
- Monrovia: no railway (mining lines only); informal shared taxis from Duala; bus.intl empty by design.
- Tripoli: no railway; Essahim Tripoli–Tunisia (intermittent, English site didn't list Tunis route); Tripoli–Istanbul ferry sporadic/unconfirmed — verify.
- Antananarivo: island; Madarail domestic (http-only site, kept http); Cotisse coaches.
- Lilongwe: Ulemu (Joburg) + Zambia Malawi Bus Services (Lusaka); Ilala ferry from Monkey Bay not Lilongwe.
- Bamako: intl train gone since 2010; Africa Tours Trans + SONEF buses; seasonal Niger River boat.
- Nouakchott: iron-ore train doesn't serve capital; informal cross-border; no ferries; bus.intl empty.
- Verify SONEF (soneftv.com) + zambia-malawi.com are operator sites not resellers.
## Batch 28
- São Tomé: island, no rail (dom null)/intl bus/scheduled intl ferry.
- Dakar: no intl train (Dakar–Bamako dead 2009); TER commuter domestic; Afrique Dem Dikk buses to Banjul/Conakry/Bissau/Nouakchott; ferries domestic.
- Victoria (Seychelles): no rail; Cat Cocos catamaran domestic; island.
- Freetown: no passenger rail; ST Transport (Facebook page only, no booking site) Freetown–Accra; others bush taxis.
- Mogadishu: no rail/intl bus/ferry; security caveats; domestic minibuses.
- Juba: Bebeto Coach Juba–Kampala (bebetocoach.com, couldn't fetch-verify); others Facebook-only.
