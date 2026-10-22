// Never Roam Alone — link to one item on a city guide, for the "your contribution is live" emails and messages.
//   city.html?city=<City>#see=<type>/<id>
// deeplink.js on city.html reads it: opens the plate, neighborhood tab, "From Roamers" group, food popup
// or calendar day the item sits in, scrolls to it and highlights it. Types are listed in deeplink.js;
// <id> for a vote type is the id city.html's voteWidgetHTML gives that item. No type: the top of the guide.
function seeUrl(siteBase, city, type, id) {
  const base = siteBase + "/city.html?city=" + encodeURIComponent(city || "");
  if (!type) return base;
  return base + "#see=" + encodeURIComponent(type) + "/" + encodeURIComponent(id == null ? "" : String(id));
}

// The link for an approved contributed photo, by the slot it went into.
function photoSeeUrl(siteBase, row) {
  const subject = row.landmark || row.subject || "";
  switch (row.subject_kind) {
    case "city-hero":         return seeUrl(siteBase, row.city, "hero", "");
    case "landmark":          return seeUrl(siteBase, row.city, "landmark", `${row.city}:${subject}`);
    case "neighborhood-hero": return seeUrl(siteBase, row.city, "hood", subject);
    case "food-dish":         return seeUrl(siteBase, row.city, "dish", subject);
    case "daytrip":           return seeUrl(siteBase, row.city, "daytrip", `${row.city}:${subject}`);
    default:
      if (row.subject_context === "Day trip") return seeUrl(siteBase, row.city, "daytrip", `${row.city}:${subject}`);
      return seeUrl(siteBase, row.city);
  }
}

module.exports = { seeUrl, photoSeeUrl };
