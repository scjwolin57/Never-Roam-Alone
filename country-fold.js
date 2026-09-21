/* =====================================================================
   COUNTRY-FOLD.JS — how a site "country" string becomes a real country.

   The country field in destinations.js is "country or territory shown on
   the card": it has its own entries for places like Bermuda, Puerto Rico
   and Greenland, plus a few sovereign countries logged under a second
   spelling ("Turkey"/"Türkiye"). Folding each territory into its sovereign
   parent and merging the spellings gives the real count of countries.

   Same map as the homepage's COUNTRY_ALIAS (index.html). Used by
   profile.html for the "countries visited" counter.

   Western Sahara is neither a sovereign country nor a territory of one
   on the list, so it folds to null and is not counted (as on the homepage).

   Exposes window.NRA_COUNTRY_FOLD (alias → country) and
   window.NRA_foldCountry(name) → country name, or null if not counted.
   ===================================================================== */
(function(){
  const FOLD = {
    "DR Congo": "Democratic Republic of the Congo",
    "Myanmar (Burma)": "Myanmar",
    "Turkey": "Türkiye",
    "The Gambia": "Gambia",
    "China (SAR)": "China",
    "Finland (Åland)": "Finland",
    "Norway (Svalbard)": "Norway",
    "Anguilla": "United Kingdom", "Bermuda": "United Kingdom",
    "British Virgin Islands": "United Kingdom", "Falkland Islands": "United Kingdom",
    "Gibraltar": "United Kingdom", "Montserrat": "United Kingdom",
    "Saint Helena": "United Kingdom", "Turks and Caicos Islands": "United Kingdom",
    "Aruba": "Netherlands", "Bonaire": "Netherlands",
    "Curaçao": "Netherlands", "Sint Maarten": "Netherlands",
    "French Guiana": "France", "French Polynesia": "France",
    "Guadeloupe": "France", "Martinique": "France", "Mayotte": "France",
    "New Caledonia": "France", "Réunion": "France",
    "Saint Pierre and Miquelon": "France", "Saint-Barthélemy": "France",
    "Saint-Martin": "France",
    "Puerto Rico": "United States", "U.S. Virgin Islands": "United States",
    "Northern Mariana Islands": "United States",
    "Faroe Islands": "Denmark", "Greenland": "Denmark"
  };
  const EXCLUDE = { "Western Sahara": true };
  window.NRA_COUNTRY_FOLD = FOLD;
  window.NRA_foldCountry = name => EXCLUDE[name] ? null : (FOLD[name] || name);
})();
