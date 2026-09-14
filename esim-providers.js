/* =====================================================================
   ESIM-PROVIDERS.JS — travel-eSIM coverage and verified deep links for
   every country that appears in citydata/<slug>.json ("c.country").

   Used by city.html to build the "Travel eSIMs" card behind the Buy an
   eSIM button on the Connectivity banner.

   Row format, keyed by the EXACT country string citydata uses:
       "Country": [airaloPath, sailyPath, mayaPath]
   A null means that provider sells no plan there — the card hides that
   provider's button and says "eSIM unavailable from this provider"
   instead of linking to a dead page.

   VERIFICATION RULE (same spirit as app-store-links.js): every path below
   was read off the provider's OWN country-list page, then fetched to
   confirm it returns a real country page rather than a soft 404.
   Checked 14 Sep 2026 — 563 URLs, 0 broken.

   Do NOT "fix" these by slugifying the country name. Several are
   genuinely irregular and a guessed slug 404s:
     Maya    United Kingdom -> /esim/uk          United States -> /plans/usa
             UAE            -> /esim/uae         Tajikistan    -> /esim/tajikstan
             (that last one is Maya's own typo, and it is the working URL)
     Saily   Timor-Leste    -> /esim-east-timor/
             St Vincent     -> /esim-saint-vincent-and-grenadines/  (no "the")
     Airalo  Puerto Rico    -> /puerto-rico-us-esim
             Saint Martin   -> /saint-martinfrench-part-esim  (missing hyphen)
             Sint Maarten   -> /sint-maartendutch-part-esim

   Hong Kong and Macau share the country "China (SAR)" in citydata but are
   separate destinations for all three providers, so they are keyed by city
   as "China (SAR)::Hong Kong" and "China (SAR)::Macau".

   Coverage counts at time of writing: 171 country keys carry all three
   providers, 39 carry one or two, 23 carry none.
   ===================================================================== */

window.NRA_ESIM_HOSTS = { airalo:"https://www.airalo.com", saily:"https://saily.com", maya:"https://maya.net" };

/* ---------------------------------------------------------------------
   AFFILIATE LINKS — the one place to paste each program's link.
   {url} is replaced with the destination URL. A bare "{url}" means
   "send the visitor straight to the provider, no affiliate wrapper", so
   an un-filled row still produces a working link rather than a broken one.
   --------------------------------------------------------------------- */
window.NRA_ESIM_AFF = {
  /* Live Airalo link — the one already earning on the old single button.
     Left intact so swapping in the new card does not drop revenue. */
  airalo: "https://airalo.pxf.io/c/7466324/3869553/15608?u={url}",
  /* PLACEHOLDER — paste the Saily affiliate template when it arrives. */
  saily:  "{url}",
  /* PLACEHOLDER — paste the Maya affiliate template. */
  maya:   "{url}"
};

/* ---------------------------------------------------------------------
   The three providers, in the order they appear on the card. `tag` is the
   small pill beside the name; `blurb` is the one-or-two-sentence pitch.
   Index order here must match the [airalo, saily, maya] row order above.
   --------------------------------------------------------------------- */
window.NRA_ESIM_PROVIDERS = [
  { key:"airalo", name:"Airalo", tag:"Most plan options",
    blurb:"The biggest eSIM store, covering 200+ countries with the widest spread of plan sizes &mdash; from a $4 1&nbsp;GB starter up to 50&nbsp;GB. Best if you'd rather pay for exactly the data you'll use." },
  { key:"saily", name:"Saily", tag:"Cheapest unlimited",
    blurb:"Built by the NordVPN team, with ad and tracker blocking included. The eSIM installs once and is reused on every future trip, and its unlimited plans undercut the others." },
  { key:"maya", name:"Maya Mobile", tag:"Great for multi-country",
    blurb:"One flat rate for unlimited data in 165+ countries &mdash; same eSIM, same price wherever you land, from $1.67/day. Great for long stays or trips crossing several borders." }
];

window.NRA_ESIM = {
  "China (SAR)::Hong Kong":            ["/hong-kong-esim", "/esim-hong-kong/", "/esim/hong-kong"],
  "China (SAR)::Macau":                ["/macao-esim", "/esim-macau/", "/esim/macau"],
  "Afghanistan":                       ["/afghanistan-esim", "/esim-afghanistan/", "/esim/afghanistan"],
  "Albania":                           ["/albania-esim", "/esim-albania/", "/esim/albania"],
  "Algeria":                           ["/algeria-esim", "/esim-algeria/", "/esim/algeria"],
  "Andorra":                           ["/andorra-esim", "/esim-andorra/", "/esim/andorra"],
  "Angola":                            [null, null, null],
  "Anguilla":                          ["/anguilla-esim", "/esim-anguilla/", "/esim/anguilla"],
  "Antigua and Barbuda":               ["/antigua-and-barbuda-esim", "/esim-antigua-and-barbuda/", "/esim/antigua-barbuda"],
  "Argentina":                         ["/argentina-esim", "/esim-argentina/", "/esim/argentina"],
  "Armenia":                           ["/armenia-esim", "/esim-armenia/", "/esim/armenia"],
  "Aruba":                             ["/aruba-esim", "/esim-aruba/", "/esim/aruba"],
  "Australia":                         ["/australia-esim", "/esim-australia/", "/esim/australia"],
  "Austria":                           ["/austria-esim", "/esim-austria/", "/esim/austria"],
  "Azerbaijan":                        ["/azerbaijan-esim", "/esim-azerbaijan/", "/esim/azerbaijan"],
  "Bahamas":                           ["/bahamas-esim", "/esim-bahamas/", "/esim/bahamas"],
  "Bahrain":                           ["/bahrain-esim", "/esim-bahrain/", "/esim/bahrain"],
  "Bangladesh":                        ["/bangladesh-esim", "/esim-bangladesh/", "/esim/bangladesh"],
  "Barbados":                          ["/barbados-esim", "/esim-barbados/", "/esim/barbados"],
  "Belarus":                           ["/belarus-esim", null, "/esim/belarus"],
  "Belgium":                           ["/belgium-esim", "/esim-belgium/", "/esim/belgium"],
  "Belize":                            ["/belize-esim", "/esim-belize/", null],
  "Benin":                             ["/benin-esim", "/esim-benin/", "/esim/benin"],
  "Bermuda":                           ["/bermuda-esim", "/esim-bermuda/", "/esim/bermuda"],
  "Bhutan":                            ["/bhutan-esim", null, null],
  "Bolivia":                           ["/bolivia-esim", "/esim-bolivia/", "/esim/bolivia"],
  "Bonaire":                           ["/bonaire-esim", "/esim-bonaire/", "/esim/bonaire"],
  "Bosnia and Herzegovina":            ["/bosnia-and-herzegovina-esim", "/esim-bosnia-and-herzegovina/", "/esim/bosnia-herzegovina"],
  "Botswana":                          ["/botswana-esim", "/esim-botswana/", "/esim/botswana"],
  "Brazil":                            ["/brazil-esim", "/esim-brazil/", "/esim/brazil"],
  "British Virgin Islands":            ["/british-virgin-islands-esim", "/esim-british-virgin-islands/", "/esim/british-virgin-islands"],
  "Brunei":                            ["/brunei-esim", "/esim-brunei/", "/esim/brunei"],
  "Bulgaria":                          ["/bulgaria-esim", "/esim-bulgaria/", "/esim/bulgaria"],
  "Burkina Faso":                      ["/burkina-faso-esim", "/esim-burkina-faso/", "/esim/burkina-faso"],
  "Burundi":                           [null, null, null],
  "Cabo Verde":                        ["/cape-verde-esim", "/esim-cape-verde/", null],
  "Cambodia":                          ["/cambodia-esim", "/esim-cambodia/", "/esim/cambodia"],
  "Cameroon":                          ["/cameroon-esim", "/esim-cameroon/", "/esim/cameroon"],
  "Canada":                            ["/canada-esim", "/esim-canada/", "/esim/canada"],
  "Central African Republic":          ["/central-african-republic-esim", "/esim-central-african-republic/", "/esim/central-african-republic"],
  "Chad":                              ["/chad-esim", "/esim-chad/", "/esim/chad"],
  "Chile":                             ["/chile-esim", "/esim-chile/", "/esim/chile"],
  "China":                             ["/china-esim", "/esim-china/", "/esim/china"],
  "Colombia":                          ["/colombia-esim", "/esim-colombia/", "/esim/colombia"],
  "Comoros":                           [null, null, "/esim/comoros"],
  "Costa Rica":                        ["/costa-rica-esim", "/esim-costa-rica/", "/esim/costa-rica"],
  "Croatia":                           ["/croatia-esim", "/esim-croatia/", "/esim/croatia"],
  "Cuba":                              [null, null, null],
  "Curaçao":                           ["/curacao-esim", "/esim-curacao/", "/esim/curacao"],
  "Cyprus":                            ["/cyprus-esim", "/esim-cyprus/", "/esim/cyprus"],
  "Czechia":                           ["/czech-republic-esim", "/esim-czech-republic/", "/esim/czech-republic"],
  "Côte d'Ivoire":                     ["/cote-divoire-esim", "/esim-cote-d-ivoire/", "/esim/ivory-coast"],
  "Democratic Republic of the Congo":  ["/democratic-republic-of-the-congo-esim", "/esim-democratic-republic-of-congo/", "/esim/democratic-republic-of-the-congo"],
  "Denmark":                           ["/denmark-esim", "/esim-denmark/", "/esim/denmark"],
  "Djibouti":                          [null, null, null],
  "Dominica":                          ["/dominica-esim", "/esim-dominica/", "/esim/dominica"],
  "Dominican Republic":                ["/dominican-republic-esim", "/esim-dominican-republic/", "/esim/dominican-republic"],
  "DR Congo":                          ["/democratic-republic-of-the-congo-esim", "/esim-democratic-republic-of-congo/", "/esim/democratic-republic-of-the-congo"],
  "Ecuador":                           ["/ecuador-esim", "/esim-ecuador/", "/esim/ecuador"],
  "Egypt":                             ["/egypt-esim", "/esim-egypt/", "/esim/egypt"],
  "El Salvador":                       ["/el-salvador-esim", "/esim-el-salvador/", "/esim/el-salvador"],
  "Equatorial Guinea":                 [null, null, null],
  "Eritrea":                           [null, null, null],
  "Estonia":                           ["/estonia-esim", "/esim-estonia/", "/esim/estonia"],
  "Eswatini":                          ["/eswatini-esim", "/esim-eswatini/", null],
  "Ethiopia":                          ["/ethiopia-esim", null, null],
  "Falkland Islands":                  [null, null, null],
  "Faroe Islands":                     ["/faroe-islands-esim", "/esim-faroe-islands/", "/esim/faroe-islands"],
  "Federated States of Micronesia":    [null, null, null],
  "Fiji":                              ["/fiji-esim", "/esim-fiji/", "/esim/fiji"],
  "Finland":                           ["/finland-esim", "/esim-finland/", "/esim/finland"],
  "Finland (Åland)":                   ["/finland-esim", "/esim-finland/", "/esim/finland"],
  "France":                            ["/france-esim", "/esim-france/", "/esim/france"],
  "French Guiana":                     ["/french-guiana-esim", "/esim-french-guiana/", "/esim/french-guiana"],
  "French Polynesia":                  [null, "/esim-french-polynesia/", null],
  "Gabon":                             ["/gabon-esim", "/esim-gabon/", "/esim/gabon"],
  "Gambia":                            ["/gambia-esim", "/esim-gambia/", null],
  "Georgia":                           ["/georgia-esim", "/esim-georgia/", "/esim/georgia"],
  "Germany":                           ["/germany-esim", "/esim-germany/", "/esim/germany"],
  "Ghana":                             ["/ghana-esim", "/esim-ghana/", "/esim/ghana"],
  "Gibraltar":                         ["/gibraltar-esim", "/esim-gibraltar/", "/esim/gibraltar"],
  "Greece":                            ["/greece-esim", "/esim-greece/", "/esim/greece"],
  "Greenland":                         ["/greenland-esim", "/esim-greenland/", null],
  "Grenada":                           ["/grenada-esim", "/esim-grenada/", "/esim/grenada"],
  "Guadeloupe":                        ["/guadeloupe-esim", "/esim-guadeloupe/", "/esim/guadeloupe"],
  "Guatemala":                         ["/guatemala-esim", "/esim-guatemala/", "/esim/guatemala"],
  "Guinea":                            ["/guinea-esim", "/esim-guinea/", "/esim/guinea"],
  "Guinea-Bissau":                     ["/guinea-bissau-esim", "/esim-guinea-bissau/", "/esim/guinea-bissau"],
  "Guyana":                            ["/guyana-esim", "/esim-guyana/", null],
  "Haiti":                             ["/haiti-esim", "/esim-haiti/", null],
  "Honduras":                          ["/honduras-esim", "/esim-honduras/", "/esim/honduras"],
  "Hungary":                           ["/hungary-esim", "/esim-hungary/", "/esim/hungary"],
  "Iceland":                           ["/iceland-esim", "/esim-iceland/", "/esim/iceland"],
  "India":                             ["/india-esim", "/esim-india/", "/esim/india"],
  "Indonesia":                         ["/indonesia-esim", "/esim-indonesia/", "/esim/indonesia"],
  "Iran":                              [null, null, "/esim/iran"],
  "Iraq":                              ["/iraq-esim", "/esim-iraq/", "/esim/iraq"],
  "Ireland":                           ["/ireland-esim", "/esim-ireland/", "/esim/ireland"],
  "Israel":                            ["/israel-esim", "/esim-israel/", "/esim/israel"],
  "Italy":                             ["/italy-esim", "/esim-italy/", "/esim/italy"],
  "Jamaica":                           ["/jamaica-esim", "/esim-jamaica/", "/esim/jamaica"],
  "Japan":                             ["/japan-esim", "/esim-japan/", "/esim/japan"],
  "Jordan":                            ["/jordan-esim", "/esim-jordan/", "/esim/jordan"],
  "Kazakhstan":                        ["/kazakhstan-esim", "/esim-kazakhstan/", "/esim/kazakhstan"],
  "Kenya":                             ["/kenya-esim", "/esim-kenya/", "/esim/kenya"],
  "Kiribati":                          [null, null, null],
  "Kosovo":                            ["/kosovo-esim", "/esim-kosovo/", "/esim/kosovo"],
  "Kuwait":                            ["/kuwait-esim", "/esim-kuwait/", "/esim/kuwait"],
  "Kyrgyzstan":                        ["/kyrgyzstan-esim", "/esim-kyrgyzstan/", "/esim/kyrgyzstan"],
  "Laos":                              ["/laos-esim", "/esim-laos/", "/esim/laos"],
  "Latvia":                            ["/latvia-esim", "/esim-latvia/", "/esim/latvia"],
  "Lebanon":                           ["/lebanon-esim", null, null],
  "Lesotho":                           ["/lesotho-esim", "/esim-lesotho/", null],
  "Liberia":                           ["/liberia-esim", "/esim-liberia/", "/esim/liberia"],
  "Libya":                             [null, null, null],
  "Liechtenstein":                     ["/liechtenstein-esim", "/esim-liechtenstein/", "/esim/liechtenstein"],
  "Lithuania":                         ["/lithuania-esim", "/esim-lithuania/", "/esim/lithuania"],
  "Luxembourg":                        ["/luxembourg-esim", "/esim-luxembourg/", "/esim/luxembourg"],
  "Madagascar":                        ["/madagascar-esim", "/esim-madagascar/", "/esim/madagascar"],
  "Malawi":                            ["/malawi-esim", "/esim-malawi/", "/esim/malawi"],
  "Malaysia":                          ["/malaysia-esim", "/esim-malaysia/", "/esim/malaysia"],
  "Maldives":                          ["/maldives-esim", "/esim-maldives/", null],
  "Mali":                              ["/mali-esim", "/esim-mali/", "/esim/mali"],
  "Malta":                             ["/malta-esim", "/esim-malta/", "/esim/malta"],
  "Marshall Islands":                  [null, null, null],
  "Martinique":                        ["/martinique-esim", "/esim-martinique/", "/esim/martinique"],
  "Mauritania":                        [null, "/esim-mauritania/", null],
  "Mauritius":                         ["/mauritius-esim", "/esim-mauritius/", "/esim/mauritius"],
  "Mayotte":                           ["/mayotte-esim", "/esim-mayotte/", "/esim/mayotte"],
  "Mexico":                            ["/mexico-esim", "/esim-mexico/", "/esim/mexico"],
  "Moldova":                           ["/moldova-esim", "/esim-moldova/", "/esim/moldova"],
  "Monaco":                            ["/monaco-esim", "/esim-monaco/", null],
  "Mongolia":                          ["/mongolia-esim", "/esim-mongolia/", "/esim/mongolia"],
  "Montenegro":                        ["/montenegro-esim", "/esim-montenegro/", "/esim/montenegro"],
  "Montserrat":                        ["/montserrat-esim", "/esim-montserrat/", "/esim/montserrat"],
  "Morocco":                           ["/morocco-esim", "/esim-morocco/", "/esim/morocco"],
  "Mozambique":                        ["/mozambique-esim", "/esim-mozambique/", "/esim/mozambique"],
  "Myanmar":                           [null, null, "/esim/myanmar"],
  "Myanmar (Burma)":                   [null, null, "/esim/myanmar"],
  "Namibia":                           ["/namibia-esim", "/esim-namibia/", null],
  "Nauru":                             ["/nauru-esim", "/esim-nauru/", null],
  "Nepal":                             ["/nepal-esim", "/esim-nepal/", "/esim/nepal"],
  "Netherlands":                       ["/netherlands-esim", "/esim-netherlands/", "/esim/netherlands"],
  "New Caledonia":                     [null, null, null],
  "New Zealand":                       ["/new-zealand-esim", "/esim-new-zealand/", "/esim/new-zealand"],
  "Nicaragua":                         ["/nicaragua-esim", "/esim-nicaragua/", "/esim/nicaragua"],
  "Niger":                             ["/niger-esim", "/esim-niger/", "/esim/niger"],
  "Nigeria":                           ["/nigeria-esim", "/esim-nigeria/", "/esim/nigeria"],
  "North Korea":                       [null, null, null],
  "North Macedonia":                   ["/macedonia-esim", "/esim-macedonia/", "/esim/macedonia"],
  "Northern Mariana Islands":          [null, "/esim-northern-mariana-islands/", null],
  "Norway":                            ["/norway-esim", "/esim-norway/", "/esim/norway"],
  "Norway (Svalbard)":                 ["/norway-esim", "/esim-norway/", "/esim/norway"],
  "Oman":                              ["/oman-esim", "/esim-oman/", "/esim/oman"],
  "Pakistan":                          ["/pakistan-esim", "/esim-pakistan/", "/esim/pakistan"],
  "Palau":                             [null, null, "/esim/palau"],
  "Palestine":                         ["/palestine-state-of-esim", null, "/esim/palestine"],
  "Panama":                            ["/panama-esim", "/esim-panama/", "/esim/panama"],
  "Papua New Guinea":                  ["/papua-new-guinea-esim", "/esim-papua-new-guinea/", null],
  "Paraguay":                          ["/paraguay-esim", "/esim-paraguay/", "/esim/paraguay"],
  "Peru":                              ["/peru-esim", "/esim-peru/", "/esim/peru"],
  "Philippines":                       ["/philippines-esim", "/esim-philippines/", "/esim/philippines"],
  "Poland":                            ["/poland-esim", "/esim-poland/", "/esim/poland"],
  "Portugal":                          ["/portugal-esim", "/esim-portugal/", "/esim/portugal"],
  "Puerto Rico":                       ["/puerto-rico-us-esim", "/esim-puerto-rico/", "/esim/puerto-rico"],
  "Qatar":                             ["/qatar-esim", "/esim-qatar/", "/esim/qatar"],
  "Republic of the Congo":             ["/congo-esim", "/esim-republic-of-congo/", "/esim/republic-congo"],
  "Romania":                           ["/romania-esim", "/esim-romania/", "/esim/romania"],
  "Russia":                            [null, null, "/esim/russia"],
  "Rwanda":                            ["/rwanda-esim", "/esim-rwanda/", "/esim/rwanda"],
  "Réunion":                           ["/reunion-esim", "/esim-reunion/", "/esim/reunion"],
  "Saint Helena":                      [null, null, null],
  "Saint Lucia":                       ["/saint-lucia-esim", "/esim-saint-lucia/", "/esim/saint-lucia"],
  "Saint Pierre and Miquelon":         [null, null, null],
  "Saint Vincent and the Grenadines":  ["/saint-vincent-and-the-grenadines-esim", "/esim-saint-vincent-and-grenadines/", "/esim/saint-vincent-grenadines"],
  "Saint-Barthélemy":                  ["/saint-barthelemy-esim", "/esim-saint-barthelemy/", "/esim/saint-barthelemy"],
  "Saint-Martin":                      ["/saint-martinfrench-part-esim", "/esim-saint-martin/", "/esim/saint-martin"],
  "Samoa":                             ["/samoa-esim", "/esim-samoa/", null],
  "San Marino":                        [null, "/esim-san-marino/", "/esim/san-marino"],
  "Saudi Arabia":                      ["/saudi-arabia-esim", "/esim-saudi-arabia/", "/esim/saudi-arabia"],
  "Senegal":                           ["/senegal-esim", "/esim-senegal/", "/esim/senegal"],
  "Serbia":                            ["/serbia-esim", "/esim-serbia/", "/esim/serbia"],
  "Seychelles":                        ["/seychelles-esim", "/esim-seychelles/", "/esim/seychelles"],
  "Sierra Leone":                      ["/sierra-leone-esim", "/esim-sierra-leone/", null],
  "Singapore":                         ["/singapore-esim", "/esim-singapore/", "/esim/singapore"],
  "Sint Maarten":                      ["/sint-maartendutch-part-esim", "/esim-sint-maarten/", "/esim/saint-maarten"],
  "Slovakia":                          ["/slovakia-esim", "/esim-slovakia/", "/esim/slovakia"],
  "Slovenia":                          ["/slovenia-esim", "/esim-slovenia/", "/esim/slovenia"],
  "Solomon Islands":                   [null, null, null],
  "Somalia":                           [null, null, null],
  "South Africa":                      ["/south-africa-esim", "/esim-south-africa/", "/esim/south-africa"],
  "South Korea":                       ["/south-korea-esim", "/esim-south-korea/", "/esim/south-korea"],
  "South Sudan":                       [null, "/esim-south-sudan/", null],
  "Spain":                             ["/spain-esim", "/esim-spain/", "/esim/spain"],
  "Sri Lanka":                         ["/sri-lanka-esim", "/esim-sri-lanka/", "/esim/sri-lanka"],
  "St. Kitts and Nevis":               ["/saint-kitts-and-nevis-esim", "/esim-saint-kitts-and-nevis/", "/esim/saint-kitts-nevis"],
  "Sudan":                             [null, "/esim-sudan/", null],
  "Suriname":                          ["/suriname-esim", "/esim-suriname/", null],
  "Sweden":                            ["/sweden-esim", "/esim-sweden/", "/esim/sweden"],
  "Switzerland":                       ["/switzerland-esim", "/esim-switzerland/", "/esim/switzerland"],
  "Syria":                             [null, null, null],
  "São Tomé and Príncipe":             [null, null, null],
  "Taiwan":                            ["/taiwan-esim", "/esim-taiwan/", "/esim/taiwan"],
  "Tajikistan":                        ["/tajikistan-esim", "/esim-tajikistan/", "/esim/tajikstan"],
  "Tanzania":                          ["/tanzania-esim", "/esim-tanzania/", "/esim/tanzania"],
  "Thailand":                          ["/thailand-esim", "/esim-thailand/", "/esim/thailand"],
  "The Gambia":                        ["/gambia-esim", "/esim-gambia/", null],
  "Timor-Leste":                       ["/timor-leste-esim", "/esim-east-timor/", null],
  "Togo":                              ["/togo-esim", "/esim-togo/", null],
  "Tonga":                             ["/tonga-esim", "/esim-tonga/", null],
  "Trinidad and Tobago":               ["/trinidad-and-tobago-esim", "/esim-trinidad-and-tobago/", "/esim/trinidad-tobago"],
  "Tunisia":                           ["/tunisia-esim", "/esim-tunisia/", "/esim/tunisia"],
  "Turkey":                            ["/turkey-esim", "/esim-turkey/", "/esim/turkey"],
  "Turkmenistan":                      [null, null, null],
  "Turks and Caicos Islands":          ["/turks-and-caicos-islands-esim", "/esim-turks-and-caicos-islands/", "/esim/turks-caicos"],
  "Tuvalu":                            [null, null, null],
  "Türkiye":                           ["/turkey-esim", "/esim-turkey/", "/esim/turkey"],
  "U.S. Virgin Islands":               ["/virgin-islands-esim", "/esim-us-virgin-islands/", "/esim/us-virgin-islands"],
  "UAE":                               ["/united-arab-emirates-esim", "/esim-united-arab-emirates/", "/esim/uae"],
  "Uganda":                            ["/uganda-esim", "/esim-uganda/", "/esim/uganda"],
  "Ukraine":                           ["/ukraine-esim", "/esim-ukraine/", "/esim/ukraine"],
  "United Kingdom":                    ["/united-kingdom-esim", "/esim-united-kingdom/", "/esim/uk"],
  "United States":                     ["/united-states-esim", "/esim-united-states/", "/plans/usa"],
  "Uruguay":                           ["/uruguay-esim", "/esim-uruguay/", "/esim/uruguay"],
  "Uzbekistan":                        ["/uzbekistan-esim", "/esim-uzbekistan/", "/esim/uzbekistan"],
  "Vanuatu":                           ["/vanuatu-esim", "/esim-vanuatu/", "/esim/vanuatu"],
  "Vatican":                           ["/vatican-city-esim", null, "/esim/vatican-city"],
  "Venezuela":                         ["/venezuela-esim", "/esim-venezuela/", "/esim/venezuela"],
  "Vietnam":                           ["/vietnam-esim", "/esim-vietnam/", "/esim/vietnam"],
  "Western Sahara":                    [null, null, null],
  "Yemen":                             [null, null, null],
  "Zambia":                            ["/zambia-esim", "/esim-zambia/", "/esim/zambia"],
  "Zimbabwe":                          ["/zimbabwe-esim", "/esim-zimbabwe/", null]
};
