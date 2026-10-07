/* "Before you rent" notes, keyed by country (the exact `country` string in citydata).
   Definition (decisions.md 2026-10-06): only what a traveler must know BEFORE booking a
   self-drive rental car that the Car rental card does not already say (drives on, international
   permit, day price): a licence or permit that is not accepted, a permit-convention rule,
   self-drive not allowed to tourists, rental cars barred from an area, or booking sites and
   cards not working because of sanctions. Each note rests on a dated government source (the
   country's own authority, US State Department, UK FCDO, Canada), and a rental company's own
   terms only for a company rule. A permit-type note needs a source that says outright the other
   permit is refused; treaty membership alone is not enough. Contradicted or hedged rules are left
   out. Never written from memory. `one: true` = rests on a single government source.
   A city whose country has a note shows "More info" on its Car rental card; the popup shows
   the note, then the booking link(s).
   Shape: { "<country>": { n: "note, max 2 sentences", k: [kinds], src: [{t, u, d}], chk, one? } }
   Site-only (not in the sheet). Research log: _needs-attention/before-you-rent-2026-10-06.md */
(function () {
  const FCDO = (slug, d) => ({ t: "UK FCDO", u: "https://www.gov.uk/foreign-travel-advice/" + slug, d });
  const DOS = (page, d) => ({ t: "US State Department", u: "https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/" + page + ".html", d });
  const CA = (slug, d) => ({ t: "Government of Canada", u: "https://travel.gc.ca/destinations/" + slug, d });
  const congo = { n: "Self-drive cars are hard to find here: most car hire companies in Kinshasa only rent a car with a driver.",
    k: ["no_self_drive"], src: [FCDO("democratic-republic-of-the-congo/safety-and-security", "2026-09-16")], chk: "2026-10-06", one: true };
  window.NRA_RENT_NOTES = {
    "Belarus": { n: "Because of sanctions, almost no banks in Belarus accept foreign cards, and your own bank may block your card there. Check how the rental company will take payment and the deposit before you book.",
      k: ["booking"], src: [FCDO("belarus/safety-and-security", "2026-09-10"), { t: "German Federal Foreign Office", u: "https://www.auswaertiges-amt.de/de/reiseundsicherheit/belarussicherheit-201904", d: "2026-06-19" }], chk: "2026-10-06" },
    "Bhutan": { n: "Visitors cannot hire a self-drive car in Bhutan: rental cars come with a driver. If you drive your own vehicle, a licensed guide must travel with you.",
      k: ["no_self_drive"], src: [FCDO("bhutan/safety-and-security", "2025-12-10"), { t: "Department of Tourism, Bhutan", u: "https://bhutan.travel/faqs", d: "undated" }], chk: "2026-10-06" },
    "China": { n: "Foreign driving licences and International Driving Permits are not valid in mainland China; you need a Chinese licence or temporary permit to drive. Most visitors hire a car with a driver.",
      k: ["licence"], src: [DOS("China", "undated"), FCDO("china", "2026-08-27")], chk: "2026-10-06" },
    "Cuba": { n: "Credit and debit cards issued by US banks do not work in Cuba, so US travelers cannot use them to pay for a rental car there.",
      k: ["booking"], src: [DOS("Cuba", "undated"), { t: "US Embassy Havana", u: "https://cu.usembassy.gov/services/traveling-to-cuba/", d: "undated" }], chk: "2026-10-06" },
    "Cyprus": { n: "Cars rented in the Republic of Cyprus usually have no insurance cover in the north, and some companies do not allow it at all. To cross the Green Line you need separate insurance, sold at some crossing points.",
      k: ["area"], src: [FCDO("cyprus/safety-and-security", "2026-08-14"), CA("cyprus", "2025-11-21")], chk: "2026-10-06" },
    "DR Congo": congo,
    "Democratic Republic of the Congo": congo,
    "Dominica": { n: "You need a temporary Dominica driving permit as well as your home licence. Rental companies are authorised to issue it and usually arrange it when you pick up the car.",
      k: ["licence"], src: [FCDO("dominica/safety-and-security", "2025-12-10"), CA("dominica", "2025-11-24"), { t: "Inland Revenue Division, Dominica", u: "https://www.ird.gov.dm/tax-laws/licenses/drivers-license", d: "undated" }], chk: "2026-10-06" },
    "Eritrea": { n: "You must get a local driving permit from the Ministry of Transport, showing your home licence and an International Driving Permit. Foreigners also need a government travel permit to drive outside the Asmara region.",
      k: ["licence", "area"], src: [FCDO("eritrea/safety-and-security", "2026-07-27"), CA("eritrea", "2025-11-25")], chk: "2026-10-06" },
    "Grenada": { n: "You must get a temporary Grenadian driving permit, even with a valid licence. Most rental companies arrange it when you pick up the car; otherwise get it at the police station.",
      k: ["licence"], src: [FCDO("grenada", "2025-12-10"), { t: "Grenada Tourism Authority", u: "https://puregrenada.com/plan-your-trip/getting-around", d: "undated" }], chk: "2026-10-06" },
    "Iran": { n: "Because of sanctions, foreign credit and debit cards do not work in Iran. Check how the rental company will take payment and the deposit before you book.",
      k: ["booking"], src: [FCDO("iran", "2026-08-13"), DOS("Iran", "undated")], chk: "2026-10-06" },
    "Israel": { n: "Rental cars may not cross the land borders into Jordan or Egypt. Some rental companies do not insure cars taken into the West Bank, so check before you book.",
      k: ["area"], src: [{ t: "Israel Airports Authority", u: "https://www.iaa.gov.il/en/land-border-crossings/yitzhak-rabin/passengers-departing-for-jordan/", d: "undated" }, FCDO("israel/safety-and-security", "2026-07-22")], chk: "2026-10-06" },
    "Japan": { n: "Japan accepts only the 1949 Geneva version of the International Driving Permit; the 1968 version is not valid. Licences from Switzerland, Germany, France, Belgium, Monaco and Taiwan need an official Japanese translation instead.",
      k: ["convention"], src: [{ t: "Tokyo Metropolitan Police", u: "https://www.keishicho.metro.tokyo.lg.jp/multilingual/english/finding_services/faq/drivers_license.html", d: "2021-09-21" }, { t: "National Police Agency, Japan", u: "https://www.npa.go.jp/policies/application/license_renewal/pdf/english_leaflet_web_ver2.pdf", d: "undated" }, FCDO("japan/safety-and-security", "2026-08-28")], chk: "2026-10-06" },
    "Kosovo": { n: "Many rental companies in Serbia do not allow their cars into Kosovo, and companies in Kosovo often do not allow theirs into Serbia. Check the cross-border rules before you book.",
      k: ["area"], src: [FCDO("kosovo/safety-and-security", "2026-09-23")], chk: "2026-10-06", one: true },
    "Mongolia": { n: "Mongolia accepts only the 1968 version of the International Driving Permit; the 1949 version, the kind issued in the US, is no longer accepted.",
      k: ["convention"], src: [FCDO("mongolia", "2026-08-07"), DOS("Mongolia", "2025-08-28")], chk: "2026-10-06" },
    "Nepal": { n: "Nepal accepts only the 1968 version of the International Driving Permit; the 1949 version, the kind issued in the US, is no longer accepted.",
      k: ["convention"], src: [FCDO("nepal", "2026-10-01")], chk: "2026-10-06", one: true },
    "North Korea": { n: "Visitors may not drive in North Korea without a North Korean driving licence, and International Driving Permits are not valid there.",
      k: ["licence", "no_self_drive"], src: [DOS("KoreaDemocraticPeoplesRepublicof", "2023-07-20"), FCDO("north-korea", "2025-12-10")], chk: "2026-10-06" },
    "Palestine": { n: "Many Israeli rental companies do not allow their cars into Area A, the Palestinian-run parts of the West Bank, and their cover does not apply there. A fully insured car from a company in East Jerusalem may be easier.",
      k: ["area"], src: [FCDO("israel", "2026-07-22"), { t: "Enterprise rental terms (Jerusalem)", u: "https://www.enterprise.com/en/car-rental-locations/il/jerusalem-eldan-hotel-lqd3.html", d: "undated" }], chk: "2026-10-06" },
    "Russia": { n: "Because of sanctions, Visa and Mastercard cards issued outside Russia do not work there. Check how the rental company will take payment and the deposit before you book.",
      k: ["booking"], src: [DOS("RussianFederation", "2025-08-05"), FCDO("russia", "2026-09-18")], chk: "2026-10-06" },
    "Saint Lucia": { n: "You need a local temporary driving permit as well as your home licence. Car rental offices sell it.",
      k: ["licence"], src: [DOS("SaintLucia", "2025-01-21"), FCDO("st-lucia/safety-and-security", "2025-12-10")], chk: "2026-10-06" },
    "Saint Vincent and the Grenadines": { n: "Visitors need a temporary driving permit from the Licensing Authority, and an International Driving Permit must be registered there before you drive. Car hire companies usually help.",
      k: ["licence"], src: [FCDO("st-vincent-and-the-grenadines/safety-and-security", "2026-04-23"), { t: "Ministry of Finance, St Vincent and the Grenadines", u: "https://finance.gov.vc/finance/index.php/frequently-asked-questions/248-what-is-the-procedure-for-obtaining-a-temporary-driving-permit", d: "undated" }], chk: "2026-10-06" },
    "Samoa": { n: "All visitors need a temporary Samoan driving permit as well as their home licence. Car rental companies help arrange it.",
      k: ["licence"], src: [FCDO("samoa/safety-and-security", "2026-03-19")], chk: "2026-10-06", one: true },
    "Serbia": { n: "Many Serbian rental firms do not allow their cars into Kosovo, Albania or Bulgaria. Check the cross-border rules before you book.",
      k: ["area"], src: [FCDO("serbia/safety-and-security", "2026-08-13")], chk: "2026-10-06", one: true },
    "Sri Lanka": { n: "To drive a hire car you need a Sri Lankan recognition permit as well as your licence and International Driving Permit. It is issued in Colombo, including at the airport.",
      k: ["licence"], src: [FCDO("sri-lanka", "2026-09-21")], chk: "2026-10-06", one: true },
    "St. Kitts and Nevis": { n: "You must buy a local visitor's driving licence; your own licence or an International Driving Permit is not enough on its own. Rental companies usually help arrange it.",
      k: ["licence"], src: [DOS("SaintKittsandNevis", "2024-12-31"), FCDO("st-kitts-and-nevis", "2026-01-05")], chk: "2026-10-06" },
    "Ukraine": { n: "Ukraine accepts only the 1968 version of the International Driving Permit; the 1949 version, the kind issued in the US, is no longer accepted.",
      k: ["convention"], src: [FCDO("ukraine", "2026-10-02")], chk: "2026-10-06", one: true },
    "Vietnam": { n: "Vietnam accepts only the 1968 version of the International Driving Permit. A US licence, even with a US-issued permit, is not valid for driving there.",
      k: ["convention"], src: [{ t: "US Embassy Vietnam", u: "https://vn.usembassy.gov/driving-in-vietnam/", d: "undated" }, FCDO("vietnam", "2026-09-21")], chk: "2026-10-06" }
  };
})();
