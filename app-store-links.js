/* App Store / Google Play links for ride-hailing and shared bike/scooter apps.
 *
 * Used by city.html to turn the "Ride-share apps" chips and the
 * "Bikes & scooters" operator rows into links that open the right store for
 * the visitor's device (iPhone -> App Store, Android -> Play, desktop -> the
 * App Store page, which reads fine in a browser).
 *
 * VERIFICATION RULE: every numeric Apple ID and every Android package name
 * below was read off a real apps.apple.com / play.google.com URL. Nothing here
 * was inferred from a company's domain name. If an app could not be verified it
 * is simply absent, and the chip stays plain text — an absent link is fine, a
 * wrong link sends a traveller to the wrong app in a country they don't know.
 *
 * Deliberately NOT listed (do not "fix" these by guessing):
 *   Snapp, Tapsi  — Iranian apps, removed from both stores under US sanctions.
 *                   They distribute via Cafe Bazaar / direct APK only.
 *   Zoomy         — shut down in 2023 (succeeded by YourRide). The chip text
 *                   itself is stale; linking it would be worse than not.
 *   Meituan Bike  — the standalone bike app was folded into the Meituan
 *                   super-app, which needs a Chinese phone number to use.
 *   HelloBike     — iOS only, and only on the mainland-China storefront.
 *
 * Keys are normalised: lower-cased, punctuation and spaces removed, and any
 * trailing "(...)" note stripped. So "Free Now", "FreeNow" and
 * "FreeNow (limited)" all resolve to "freenow". See nraAppLink() in city.html.
 */
window.NRA_APP_LINKS = {
  /* ---- ride-hailing ---- */
  "uber":        { ios: "https://apps.apple.com/app/id368677368",  android: "https://play.google.com/store/apps/details?id=com.ubercab" },
  "bolt":        { ios: "https://apps.apple.com/app/id675033630",  android: "https://play.google.com/store/apps/details?id=ee.mtakso.client" },
  "didi":        { ios: "https://apps.apple.com/app/id1362398401", android: "https://play.google.com/store/apps/details?id=com.didiglobal.passenger" },
  "grab":        { ios: "https://apps.apple.com/app/id647268330",  android: "https://play.google.com/store/apps/details?id=com.grabtaxi.passenger" },
  "freenow":     { ios: "https://apps.apple.com/app/id357852748",  android: "https://play.google.com/store/apps/details?id=taxi.android.client" },
  "lyft":        { ios: "https://apps.apple.com/app/id529379082",  android: "https://play.google.com/store/apps/details?id=me.lyft.android" },
  "cabify":      { ios: "https://apps.apple.com/app/id476087442",  android: "https://play.google.com/store/apps/details?id=com.cabify.rider" },
  "indrive":     { ios: "https://apps.apple.com/app/id780125801",  android: "https://play.google.com/store/apps/details?id=sinet.startup.inDriver" },
  "indriver":    { ios: "https://apps.apple.com/app/id780125801",  android: "https://play.google.com/store/apps/details?id=sinet.startup.inDriver" }, // old name, still in the city data

  "careem":      { ios: "https://apps.apple.com/app/id592978487",  android: "https://play.google.com/store/apps/details?id=com.careem.acma" },
  "ola":         { ios: "https://apps.apple.com/app/id539179365",  android: "https://play.google.com/store/apps/details?id=com.olacabs.customer" },
  "yango":       { ios: "https://apps.apple.com/app/id1437157286", android: "https://play.google.com/store/apps/details?id=com.yandex.yango" },
  "yandexgo":    { ios: "https://apps.apple.com/app/id472650686",  android: "https://play.google.com/store/apps/details?id=ru.yandex.taxi" },
  "99":          { ios: "https://apps.apple.com/app/id553663691",  android: "https://play.google.com/store/apps/details?id=com.taxis99" },
  "bitaksi":     { ios: "https://apps.apple.com/app/id589500723",  android: "https://play.google.com/store/apps/details?id=com.bitaksi.musteri" },
  "gojek":       { ios: "https://apps.apple.com/app/id944875099",  android: "https://play.google.com/store/apps/details?id=com.gojek.app" },
  "rapido":      { ios: "https://apps.apple.com/app/id1198464606", android: "https://play.google.com/store/apps/details?id=com.rapido.passenger" },
  "heetch":      { ios: "https://apps.apple.com/app/id693137280",  android: "https://play.google.com/store/apps/details?id=com.heetch" },
  "pickme":      { ios: "https://apps.apple.com/app/id1000163961", android: "https://play.google.com/store/apps/details?id=com.pickme.passenger" },
  "pathao":      { ios: "https://apps.apple.com/app/id1201700952", android: "https://play.google.com/store/apps/details?id=com.pathao.user" },
  "maxim":       { ios: "https://apps.apple.com/app/id579985456",  android: "https://play.google.com/store/apps/details?id=com.taxsee.taxsee" },
  "ittaxi":      { ios: "https://apps.apple.com/app/id527559443",  android: "https://play.google.com/store/apps/details?id=it.ud.microtek.ITTaxi" },
  "apptaxi":     { ios: "https://apps.apple.com/app/id537167043",  android: "https://play.google.com/store/apps/details?id=it.ud.microtek.AppTaxi" },
  "yassir":      { ios: "https://apps.apple.com/app/id1239926325", android: "https://play.google.com/store/apps/details?id=com.yatechnologies.yassir_rider" },
  "kakaot":      { ios: "https://apps.apple.com/app/id981110422",  android: "https://play.google.com/store/apps/details?id=com.kakao.taxi" },
  "itaksi":      { ios: "https://apps.apple.com/app/id1301927766", android: "https://play.google.com/store/apps/details?id=tr.gov.ibb.itaksi" },
  "passapp":     { ios: "https://apps.apple.com/app/id1535615747", android: "https://play.google.com/store/apps/details?id=kh.com.passapp.passenger" },
  "xanhsm":      { ios: "https://apps.apple.com/app/id6446425595", android: "https://play.google.com/store/apps/details?id=com.gsm.customer" },
  "gett":        { ios: "https://apps.apple.com/app/id449655162",  android: "https://play.google.com/store/apps/details?id=com.gettaxi.android" },
  "liftago":     { ios: "https://apps.apple.com/app/id633928711",  android: "https://play.google.com/store/apps/details?id=com.adleritech.app.liftago.passenger" },
  "citymobil":   { ios: "https://apps.apple.com/app/id579220388",  android: "https://play.google.com/store/apps/details?id=com.citymobil" },
  "linetaxi":    { ios: "https://apps.apple.com/app/id1538897906", android: "https://play.google.com/store/apps/details?id=com.taxigo.rider" },
  "littlecab":   { ios: "https://apps.apple.com/app/id1130691846", android: "https://play.google.com/store/apps/details?id=com.craftsilicon.littlecabrider" },
  "yoxi":        { ios: "https://apps.apple.com/app/id1521393667", android: "https://play.google.com/store/apps/details?id=tw.com.yoxi.rider" },
  "sride":       { ios: "https://apps.apple.com/app/id1458325928", android: "https://play.google.com/store/apps/details?id=jp.sride.userapp" },
  "uklon":       { ios: "https://apps.apple.com/app/id654646098",  android: "https://play.google.com/store/apps/details?id=ua.com.uklontaxi" },

  /* ---- shared bikes, e-scooters and mopeds ---- */
  "dott":           { ios: "https://apps.apple.com/app/id1440301673", android: "https://play.google.com/store/apps/details?id=com.ridedott.rider" },
  "tier":           { ios: "https://apps.apple.com/app/id1440301673", android: "https://play.google.com/store/apps/details?id=com.ridedott.rider" },
  "bird":           { ios: "https://apps.apple.com/app/id1260842311", android: "https://play.google.com/store/apps/details?id=co.bird.android" },
  "lime":           { ios: "https://apps.apple.com/app/id1199780189", android: "https://play.google.com/store/apps/details?id=com.limebike" },
  "nextbike":       { ios: "https://apps.apple.com/app/id504288371",  android: "https://play.google.com/store/apps/details?id=de.nextbike" },
  "donkeyrepublic": { ios: "https://apps.apple.com/app/id933526449",  android: "https://play.google.com/store/apps/details?id=com.donkeyrepublic.bike.android" },
  "spin":           { ios: "https://apps.apple.com/app/id1241808993", android: "https://play.google.com/store/apps/details?id=pm.spin" },
  "hellocycling":   { ios: "https://apps.apple.com/app/id1216653677", android: "https://play.google.com/store/apps/details?id=jp.hellocycling.hellocycling" },
  "whoosh":         { ios: "https://apps.apple.com/app/id1418412616", android: "https://play.google.com/store/apps/details?id=com.punicapp.whoosh" },
  "voi":            { ios: "https://apps.apple.com/app/id1395921017", android: "https://play.google.com/store/apps/details?id=io.voiapp.voi" },
  "beammobility":   { ios: "https://apps.apple.com/app/id1427114484", android: "https://play.google.com/store/apps/details?id=com.escooterapp" },
  "bikeitau":       { ios: "https://apps.apple.com/app/id1270864475", android: "https://play.google.com/store/apps/details?id=pbsc.cyclefinder.tembici" },
  "cooltra":        { ios: "https://apps.apple.com/app/id1083424977", android: "https://play.google.com/store/apps/details?id=com.mobime.ecooltra" },
  "felyx":          { ios: "https://apps.apple.com/app/id1250107307", android: "https://play.google.com/store/apps/details?id=com.felyx.android" },
  "marti":          { ios: "https://apps.apple.com/app/id1454358771", android: "https://play.google.com/store/apps/details?id=com.martitech.marti" },
  "mybyk":          { ios: "https://apps.apple.com/app/id1302751321", android: "https://play.google.com/store/apps/details?id=in.greenpedia.mybyk" },
  "hop":            { ios: "https://apps.apple.com/app/id1487640704", android: "https://play.google.com/store/apps/details?id=com.hoplagit.rider" },
  "flamingo":       { ios: "https://apps.apple.com/app/id1446388027", android: "https://play.google.com/store/apps/details?id=com.flamingoscooters.android" },
  "beryl":          { ios: "https://apps.apple.com/app/id1386768364", android: "https://play.google.com/store/apps/details?id=cc.beryl.basis" },
  "ridemovi":       { ios: "https://apps.apple.com/app/id1503536800", android: "https://play.google.com/store/apps/details?id=com.ridemovi.app" },
  "pony":           { ios: "https://apps.apple.com/app/id1273866794", android: "https://play.google.com/store/apps/details?id=co.ponybikes.mercury" },
  "yego":           { ios: "https://apps.apple.com/app/id1181020675", android: "https://play.google.com/store/apps/details?id=com.getyugo.app" },
  "youbike":        { ios: "https://apps.apple.com/app/id1483423095", android: "https://play.google.com/store/apps/details?id=tw.com.youbike.plus" },
  "veo":            { ios: "https://apps.apple.com/app/id1279820696", android: "https://play.google.com/store/apps/details?id=com.pgt.veoride" },
  "ryde":           { ios: "https://apps.apple.com/app/id1495605028", android: "https://play.google.com/store/apps/details?id=com.ryde_android" },
  "check":          { ios: "https://apps.apple.com/app/id1484477681", android: "https://play.google.com/store/apps/details?id=app.ridecheck.android" },
  "charichari":     { ios: "https://apps.apple.com/app/id1341611829", android: "https://play.google.com/store/apps/details?id=com.souzoh.android.merchari" },
  "boltscooters":   { ios: "https://apps.apple.com/app/id675033630",  android: "https://play.google.com/store/apps/details?id=ee.mtakso.client" }
};

/* Same app name, different app depending on the country. Checked BEFORE the
 * table above. A value of null means "deliberately do not link here".
 * Key format: "<normalised name>|<country exactly as it appears in the city data>".
 */
window.NRA_APP_LINKS_BY_COUNTRY = {
  /* DiDi runs two separate apps: the mainland-China one and the international
   * "DiDi Rider" used in Latin America, Japan and Australia. The chip text is
   * the same in both places, so the country decides. */
  "didi|China":         { ios: "https://apps.apple.com/app/id554499054", android: "https://play.google.com/store/apps/details?id=com.sdu.didi.psnger" },
  "didi|China (SAR)":   { ios: "https://apps.apple.com/app/id554499054", android: "https://play.google.com/store/apps/details?id=com.sdu.didi.psnger" },
  "didichuxing|China":  { ios: "https://apps.apple.com/app/id554499054", android: "https://play.google.com/store/apps/details?id=com.sdu.didi.psnger" },

  /* "GO" and "Be" are far too generic to link on the name alone — only link
   * them in the one country where our data means the taxi app. */
  "go|Japan":           { ios: "https://apps.apple.com/app/id1254341709", android: "https://play.google.com/store/apps/details?id=com.dena.automotive.taxibell" },
  "be|Vietnam":         { ios: "https://apps.apple.com/app/id1440565902", android: "https://play.google.com/store/apps/details?id=xyz.be.customer" },

  /* ZEUS ships a separate app per country (Zeus Deutschland, ZEUS Norway,
   * ZEUS Oogyaa in Malaysia). Only the German one is verified, so Oslo and
   * Kuala Lumpur stay unlinked rather than pointing at the wrong country. */
  "zeus|Germany":       { ios: "https://apps.apple.com/app/id1484472542", android: "https://play.google.com/store/apps/details?id=com.zeus.app" },

  /* The US "Bolt" scooters listed in Austin and Washington were Bolt Mobility,
   * a different (now defunct) company from Estonia's Bolt. Do not link. */
  "bolt|United States": null,

  /* Ola shut its UK, Australia and New Zealand ride-hailing on 12 April 2024 and
   * is now India-only. The chips in Adelaide/Auckland etc. are stale city data;
   * until that data is corrected, don't hand travellers an app that can't book
   * them a car. */
  "ola|Australia":   null,
  "ola|New Zealand": null
};

/* nraAppLink(name, country) -> a store URL for this visitor's device, or null.
 *
 * iPhone/iPad -> App Store, Android -> Google Play, anything else -> the App
 * Store page (it renders as a normal web page on desktop). If only one store
 * is known, that one is used regardless of device.
 *
 * Returns null when the name isn't a real app — most "ride-share" entries in
 * the city data are things like "songthaew (shared pickup trucks)" or "local
 * taxi companies", and those must stay plain text.
 */
(function () {
  var platform = null;
  function devicePlatform() {
    if (platform) return platform;
    var ua = (navigator.userAgent || "");
    if (/iPhone|iPad|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      platform = "ios";                 // iPadOS reports itself as a Mac with touch
    } else if (/Android/.test(ua)) {
      platform = "android";
    } else {
      platform = "web";
    }
    return platform;
  }

  function normalise(name) {
    var s = String(name || "").trim();
    // "Snapp (Iranian ride-hailing app)" -> "Snapp", but only when the note is
    // at the very end, so full sentences that merely contain "(...)" don't get
    // truncated into something that could accidentally match a real app.
    s = s.replace(/\s*\([^()]*\)\s*$/, "").trim();
    // Anything longer than a short product name is prose, not an app name.
    if (s.split(/\s+/).length > 3) return "";
    s = s.toLowerCase()
         .replace(/ı/g, "i")                       // Turkish dotless i (Martı)
         .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // Itaú -> Itau
         .replace(/[^a-z0-9]/g, "");
    return s;
  }

  window.nraAppLink = function (name, country) {
    var key = normalise(name);
    if (!key) return null;

    var entry;
    var byCountry = window.NRA_APP_LINKS_BY_COUNTRY || {};
    var countryKey = key + "|" + (country || "");
    if (Object.prototype.hasOwnProperty.call(byCountry, countryKey)) {
      entry = byCountry[countryKey];        // may be null = deliberately unlinked
    } else {
      entry = (window.NRA_APP_LINKS || {})[key];
    }
    if (!entry) return null;

    var p = devicePlatform();
    if (p === "android") return entry.android || entry.ios || null;
    return entry.ios || entry.android || null;
  };
})();
