# "Before you rent" notes: 26 countries (154 city guides) get one

*Researched 2026-10-06 under the definition Jeff approved the same day (decisions.md). All 232 country names in `citydata/` were checked in 10 batches. Data: `rental-notes.js`. Raw per-country results with every source and quote: `_guidebuild/discovercars/byr_all.json` (to be copied there when this lands).*

## Result

| | Countries | City guides |
|---|---|---|
| Note written | 26 (27 names: "DR Congo" and "Democratic Republic of the Congo" are both in the data) | 154 |
| ...of which the popup also has a DiscoverCars link | | 46 |
| No note (nothing beyond what the card already says) | 188 names | |
| Held, sources disagree or are hedged | 6 names (Turkey, Türkiye, Morocco, Lebanon, Chad, Timor-Leste) | |
| Held, permit type only inferred | 11 (Argentina, Armenia, Azerbaijan, Bangladesh, Ghana, India, Iraq, Rwanda, South Korea, Tajikistan, Turkmenistan) | |

## Standard applied (same for every country)

1. Only the five kinds in the definition: licence not accepted, permit-convention rule, no self-drive, area barred, sanctions on cards and booking.
2. A dated government source: the country's own authority, the US State Department, the UK FCDO or Canada. A rental company's own terms only for a company rule (Palestine: Enterprise's Area A rule; Cyprus: National's).
3. **One primary source is enough** (CLAUDE.md §4.3) when it is explicit and nothing contradicts it. Seven notes rest on one source and carry `one: true`: Kosovo, Serbia, DR Congo, Nepal, Samoa, Sri Lanka, Ukraine. Pull any of them if you want two.
4. **A permit-type note needs a source saying the other permit is refused** (Japan's police, the US Embassy in Vietnam, FCDO's "the 1949 IDP is not accepted any more" for Mongolia, Nepal, Ukraine). The UK page naming which permit a UK driver should carry, plus the treaty a country signed, is not enough: that is why the 11 above are held.
5. Contradictions are held, not resolved by picking one: Turkey (FCDO: 1949 permit refused; State Dept: a US licence and permit are fine for 180 days), Morocco (FCDO vs State Dept and the UN list), Lebanon (FCDO vs UN list), Chad (State Dept: permit; FCDO: convert to a Chadian licence). Timor-Leste is held because FCDO only says you will "likely" need a driver.
6. Iran's draft also claimed booking sites fail and only the 1968 permit works; neither is stated by a source, so the note says only that foreign cards do not work.

**Source access:** travel.state.gov blocks automated reads. State Department text was read from its official data feed (cadataapi.state.gov) or dated Wayback Machine copies, and each source records which. Where it could not be read at all, the note rests on FCDO and the country's own authority.

## The 26 notes

Belarus (cards), Bhutan (no self-drive), China (licence), Cuba (US cards), Cyprus (north), DR Congo (driver), Dominica (local permit), Eritrea (local permit, travel permit), Grenada (local permit), Iran (cards), Israel (borders, West Bank), Japan (1949 permit, translations), Kosovo (Serbian cars), Mongolia (1968 permit), Nepal (1968 permit), North Korea (no driving), Palestine (Area A), Russia (cards), Saint Lucia (local permit), Saint Vincent (local permit or registered IDP), Samoa (local permit), Serbia (cross-border), Sri Lanka (recognition permit), St. Kitts and Nevis (local licence), Ukraine (1968 permit), Vietnam (1968 permit; US permits not valid).

Hebron and Nablus now get the Palestine note in their popup, which explains why they carry no rental link.

## For Jeff: the card's "Int'l permit" row disagrees with the sources in 84 places

These were **not** changed. Most compare the card to UK guidance, so a few may still be right for US or other licences. The row is also free text with many wordings per country (China alone has about 20; Greece four across 10 cities, France six), which breaks the one-format-per-column rule (CLAUDE.md §4.2). Suggested next task: reset the row to coded values (Required / Recommended / Not required / Not accepted) per country from these sources, sheet and site together.

| Country | What the research found |
|---|---|
| Argentina | Card says IDP 'Recommended'; FCDO says you'll need the 1949 IDP with your licence (required). |
| Armenia | Card says IDP 'Recommended'; FCDO says you'll need a 1968 IDP with your licence (required). |
| Aruba | Card says IDP 'Not required (US, Canadian, and most licenses valid up to 3 months)'; FCDO says UK drivers need the IDP with their licence. Possibly nationality-specific; State Dept page (covers Aruba) could not be read to settle i |
| Azerbaijan | Card says IDP 'Recommended'; FCDO says you'll need the 1968 IDP with your licence (required). |
| Bangladesh | Cards are mixed ('Recommended' and 'Required'); FCDO says the 1949 IDP is needed, so 'Recommended' is wrong. |
| Benin | Card says IDP 'Recommended'; FCDO says the IDP is needed with your licence (required). Benin is party to both conventions, so no convention note. |
| Bhutan | Card shows IDP 'Recommended', which implies self-drive is possible; visitors cannot hire a self-drive car at all. |
| Bolivia | Card says IDP 'Recommended'; FCDO says a 1949 IDP is needed (required). |
| Bosnia and Herzegovina | Card says IDP 'Recommended'; FCDO says an IDP must be carried when renting a car inside the country (single source). |
| Brazil | Card has a 'Required' variant on some cities and 'Recommended' on others; FCDO says a UK photocard licence alone is valid (up to 180 days). Variants should be made consistent. |
| British Virgin Islands | Card says 'Required (temporary BVI licence needed)'; FCDO and the BVI DMV say a home licence is valid for the first 30 days and a temporary licence is for longer stays. The card should not say IDP required. |
| Cameroon | Card has both 'Recommended' and 'Required' variants; FCDO says a UK photocard licence alone is valid for 6 months. Variants should be made consistent. |
| Central African Republic | Card says IDP 'Recommended'; FCDO says the IDP must be carried with the licence (single source). |
| Chad | Card says IDP 'Recommended'; State Dept says an IDP is required, and FCDO says a UK licence must be converted to a Chadian one. |
| China | Some card variants are wrong or unclear: 'Required' (reads as IDP required) and 'a Chinese driver's license or certified translation is required' (no source accepts a translation). All variants should say not valid, Chinese licenc |
| China (SAR) | Card says IDP 'Recommended' for both cities; for Macau, FCDO says an IDP is needed with a UK licence and State Dept says to carry both. Hong Kong is correct. |
| Côte d'Ivoire | Card says IDP Recommended; FCDO says an IDP (or local licence) is a must. (FCDO speaks for UK licence holders.) |
| DR Congo | Card says IDP Recommended; FCDO says you'll need a 1968 IDP; Global Affairs Canada says you should carry one. (FCDO speaks for UK licence holders.) |
| Democratic Republic of the Congo | Card says IDP Recommended; FCDO says you'll need a 1968 IDP; Global Affairs Canada says you should carry one. (FCDO speaks for UK licence holders.) |
| Dominica | Card says IDP Required; FCDO, Canada and Dominica's Inland Revenue Division say a home licence plus a local temporary permit is what is required, no IDP mentioned. |
| Egypt | Card shows Recommended for some Egypt cities and Required for others; FCDO says an IDP is needed. (FCDO speaks for UK licence holders.) |
| El Salvador | Card says IDP Recommended; FCDO says El Salvador does not accept the IDP (home licence valid 90 days, Canada agrees on the 90 days). |
| Eswatini | Card says IDP Recommended; FCDO says an IDP is needed. (FCDO speaks for UK licence holders.) |
| France | Card has six different IDP wordings across France's cities, one of them 'Required'; FCDO says a UK photocard licence is enough, an IDP only for some hire companies. (FCDO speaks for UK licence holders.) |
| French Polynesia | Card says IDP 'Recommended'; FCDO says an IDP must be carried with the licence when driving. |
| Gabon | Card says IDP 'Recommended'; FCDO says an IDP is needed with the licence. |
| Ghana | Card says IDP 'Recommended'; FCDO says a 1949 IDP or a Ghanaian licence is needed to drive. |
| Greece | Card shows four different IDP values across the 10 cities (Recommended / Required / for non-EU). They should be one value; FCDO says a UK photocard licence is enough, so 'Required' is wrong at least for UK licences. US rule not ch |
| Guinea | Card says IDP 'Recommended'; FCDO says a 1949 IDP is needed with the licence. |
| India | Card shows 'Recommended' in some cities and 'Required' in others; FCDO says a 1949 IDP is needed with the licence, so 'Recommended' is wrong. |
| Indonesia | Card shows 'Recommended' in some cities; FCDO says a foreign licence alone is not valid and an IDP is needed. Card should say Required. |
| Iraq | Card says IDP 'Recommended'; FCDO says a 1968 IDP is needed with the licence. |
| Israel | FCDO says UK licence holders need a 1968 IDP plus their licence; card says only 'Recommended'. Card text also differs between cities. |
| Italy | Card text differs between Italy cities ('Recommended', 'Required', 'Required for non-EU/EEA licenses'); should be one value. |
| Japan | Some Japan cities show 'Recommended'; an IDP (1949) or the official translation is legally required to drive. Card text also differs between cities. |
| Jordan | FCDO says UK licence holders need a 1949 IDP plus their licence; card says 'Recommended'. |
| Kazakhstan | FCDO says UK licence holders need a 1968 IDP; card says 'Recommended'. |
| Kenya | Card text differs between Kenya cities ('Recommended', 'Required'); FCDO says a UK licence alone is fine for 3 months. |
| Kuwait | FCDO says visit-visa holders can drive on a UK photocard licence; card says 'Required'. May hold for other licences; check. |
| Madagascar | FCDO says UK licence holders need an IDP plus their licence; card says 'Recommended'. |
| Malaysia | Card text differs between Malaysia cities ('Recommended', 'Required'); FCDO says an IDP is needed. |
| Maldives | FCDO says UK drivers need an IDP with their licence (card says Recommended); State Dept is silent on licences. |
| Moldova | State Dept says foreign drivers must have an IDP (card says Recommended), though the same page also says a US licence is recognized for 90 days; FCDO says a UK photocard licence is enough. |
| Monaco | FCDO says UK drivers need an IDP (card says Recommended). |
| Mongolia | Card says Recommended; State Dept says a US licence alone is not legal and an IDP is needed (Required). |
| Morocco | FCDO says an IDP is needed with the licence (card says Recommended); State Dept says foreign licences alone are valid for a year. |
| Nepal | Card shows 'Recommended' for some cities; State Dept and FCDO both say a local licence or IDP is required (Required). |
| New Caledonia | FCDO says UK drivers need an IDP (card says Recommended). |
| Niger | Card says IDP Recommended; State Dept says all drivers need a Nigerien or international driver's license, so a home licence alone does not meet it. |
| North Korea | Card says IDP Not required; both sources say foreign licences and IDPs are not valid and a North Korean licence is needed. |
| North Macedonia | Card says IDP Recommended; State Dept says US citizens must have an IDP with their licence. |
| Peru | One card value says IDP Not needed; State Dept says a foreign licence alone is generally valid only 30 days (IDP valid one year). |
| Poland | Card says IDP Not required for most foreign licences / Recommended; State Dept says US licence holders must also carry an IDP. |
| Romania | Card says IDP Recommended; State Dept says a US licence is not sufficient without an IDP and most rental companies require one. |
| Russia | Card values are mixed (IDP + licence required / Recommended / Required); State Dept says a US licence is valid 60 days only with a notarized Russian translation, or with an IDP, so 'Recommended' understates it. |
| Rwanda | Card says IDP Recommended; State Dept says an IDP is required and FCDO says UK drivers need the 1949 IDP. |
| Saint Vincent and the Grenadines | Card says IDP 'Not required'; a home licence alone is not enough, a local temporary permit (or a registered IDP) is required. |
| San Marino | Card says IDP Recommended; FCDO says UK drivers need the 1968 IDP. San Marino is party to both conventions, so no convention note. |
| Saudi Arabia | Card shows both 'Recommended' and 'Required' for different cities; State Dept says a valid foreign or international licence is enough to drive a rental car, so 'Required' conflicts. |
| Serbia | Card says IDP Recommended; State Dept says US licence holders drive with an IDP (FCDO calls it helpful for UK drivers). |
| Seychelles | Card says IDP Recommended; State Dept says an IDP is needed (FCDO says a UK photocard licence is enough for 3 months). |
| Slovakia | Card says 'Not required'; State Dept says US licence holders must get an IDP before arrival (UK photocard holders do not need one). |
| Slovenia | Card says IDP Recommended; State Dept says US licence holders must have an IDP. |
| South Sudan | Card says IDP Recommended; State Dept says an IDP is required. |
| Spain | Some Spain cities show 'Recommended' or 'Recommended for non-EU licences'; State Dept says US licence holders must have an IDP to drive and to rent a car. Suggest one value: 'Required for non-EU/EEA licences'. |
| Sri Lanka | Some Sri Lanka cities show plain 'Required' without the temporary Sri Lankan permit; all should match the 'Required (with a temporary Sri Lankan permit)' wording. |
| St. Kitts and Nevis | Card says IDP 'Recommended'; an IDP does not replace the required local visitor's licence (covered by the note). |
| Sudan | Some Sudan cities show 'Required'; both sources say a US or UK licence is accepted for up to 90 days / 3 months. |
| Suriname | Card says IDP 'Recommended'; State Dept and FCDO both say an IDP is needed (State Dept: to rent a car). |
| São Tomé and Príncipe | Card says IDP 'Recommended'; FCDO says an IDP must be carried with the licence (State Dept silent on short visits). |
| Tajikistan | Card says IDP 'Recommended'; FCDO says the 1968 IDP must be carried with the licence. |
| Tanzania | Some Tanzania cities show 'Required'; FCDO says a UK licence is fine for 6 months and State Dept accepts a validated US licence or an IDP. |
| Thailand | Some Thailand cities show 'Recommended'; FCDO says an IDP must be carried with the licence. |
| Timor-Leste | Card says IDP 'Recommended'; FCDO says an IDP must be carried with the licence. |
| Tunisia | Card says IDP 'Recommended'; FCDO says to drive with an IDP and licence. |
| Turkmenistan | Card says IDP 'Recommended'; State Dept says 'You must have a valid international driving permit' and FCDO agrees. |
| Turks and Caicos Islands | Card says US, UK and Canadian licences are valid up to 3 months; State Dept and FCDO both say one month. |
| UAE | Card says IDP 'Required'; FCDO says a UK photocard licence is enough for visitors. The rule depends on the licence's country, so 'Required' is too broad. |
| Uganda | Card says IDP 'Required'; FCDO says a UK licence is valid for the first 3 months and an IDP is only needed after that. |
| Ukraine | Card says IDP 'Recommended'; FCDO says a 1968 IDP is required. |
| Uzbekistan | Card says IDP 'Recommended' (one city says 'Recommended (International Driving Permit required)'); FCDO says the 1968 IDP is needed, so 'Recommended' understates it and the two values disagree. |
| Vietnam | Card shows IDP 'Recommended' and 'Required' in some cities; only a 1968 IDP is valid, and a US-issued IDP (1949) does not let a US traveler drive. One city's text ('limited recognition... hire a car with driver') is closer to righ |
| Western Sahara | Card says IDP 'Recommended'; FCDO says an IDP is needed. |
| Zambia | One city's card says IDP 'Required'; FCDO says a UK licence is valid for 90 days, with an IDP only for longer stays. The two cities also disagree (Recommended vs Required). |

## Data duplicates found (for the country fold)

"DR Congo" / "Democratic Republic of the Congo", "Myanmar" / "Myanmar (Burma)", "Turkey" / "Türkiye" appear as separate `country` strings in citydata. `country-fold.js` folds them for counts, but per-country files like this one need both keys until the strings are merged.

## Other finds

- Barbados abolished its visitor driving permit on 15 October 2025 (Barbados Revenue Authority). The Barbados card says "Recommended", which is consistent.
- Montserrat: the card already names the local permit; FCDO adds it must be applied for online at least 72 hours before travel.
- Kiwitaxi: once Jeff's partner link arrives, the popup's "Book" section gets a "car with a driver" link for the 39 cities in `car-rental-second-program-2026-10-06.md` (17 of them in China, which now has the note).

## Follow-up 2026-10-07 (Jeff: settle the held countries with each country's own authority; find a second source for the one-source notes)

**Rule now:** every note has at least two independent sources. Live: **23 countries (24 names), 147 city guides**; 66 of them have a booking link inside the popup.

**Second sources found (kept, some reworded):**

| Country | Result | Change |
|---|---|---|
| Kosovo | confirmed (Alamo Belgrade bars Kosovo; Enterprise Pristina bars Serbia) | sources added |
| DR Congo | confirmed (US State Dept 2026-09-17: reputable firms include a driver) | sources added |
| Samoa | confirmed (Canada 2026-05-26; Samoa Land Transport Authority road code) | reworded: full-licence holders only; an LTA-endorsed IDP also works |
| Serbia | partly: Alamo and National at Belgrade bar Kosovo but allow Albania, and EU countries for a fee | reworded: "some also exclude Albania or Bulgaria" |
| Sri Lanka | partly: Canada says home licence **or** IDP, plus the Sri Lankan temporary licence | reworded |

**Removed (no second source, or contradicted):**
- Nepal: State Dept, Canada and the Australian Embassy all require an IDP but none names a version; only FCDO says 1968-only.
- Ukraine: Ukraine's own Resolution 340 (para 30) asks for "an international driving permit" with no version; US advice tells Americans to get one (the US issues 1949). Only FCDO says the 1949 permit is refused.
- Mongolia: same pattern as Ukraine (State Dept says US tourists may drive with an international licence); removed for consistency.

**The 16 held countries, settled against national sources:**

| Country | Verdict | Source that settled it |
|---|---|---|
| South Korea | no note | Road Traffic Act art. 96 (law.go.kr, in force 2026-07-01): permits under both 1949 and 1968 conventions accepted for a year |
| Argentina | no note | argentina.gob.ar: licences from 1949 and 1968 parties valid up to a year |
| Morocco | no note | Road code Law 52-05 art. 2: a valid foreign licence works up to a year (read via search extract of the Justice Ministry PDF; the site refused connections) |
| Timor-Leste | no note | Road code, Decree-Law 6/2003 art. 119 (timor-leste.gov.tl): foreign licences and IDPs valid; nothing bars self-drive |
| Ghana, India, Iraq, Rwanda, Tajikistan, Turkmenistan | no note | national sources found name no permit version and refuse nothing |
| Turkey / Türkiye | still held | regulation art. 88 could not be read (mevzuat.gov.tr would not serve it); FCDO vs State Dept stands |
| Lebanon | still held | no Lebanese law or authority page found |
| Chad | still held | no Chadian source found; State Dept vs FCDO stands |
| Armenia | still held | hartak.am (with the Road Police) says a foreign licence must meet the 1968 format; does not say a 1949 IDP is refused |
| Azerbaijan | still held | no national source found |
| Bangladesh | still held | Road Transport Act 2018 s.9(1): a foreign licence must be endorsed by the BRTA; unclear whether that applies to a visiting renter |

Retry later: Turkey (mevzuat.gov.tr art. 88), Azerbaijan (e-qanun.az), Morocco's law PDF once its host answers, any Lebanese or Chadian authority page. Raw results: `settle_a.json`, `settle_b.json`, `second_src.json` (scratchpad; to copy into `_guidebuild/discovercars/` with the rest).

**Far airports (Jeff 2026-10-07: keep, add a note):** an airport link 100 km or more from its city shows "This airport is about N km (M mi) from <city>, but it is the usual airport for arriving here." 13 cities: Ica, Saint-Louis, Kusatsu, Sigiriya, Nakuru, Windermere, Pai, Vaduz, Kanchanaburi, Galle, Himeji, Chefchaouen, Kandy. Threshold `FAR_AIRPORT_KM = 100` in city.html.
