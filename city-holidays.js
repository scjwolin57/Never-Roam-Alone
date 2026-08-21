/* =====================================================================
   CITY-HOLIDAYS.JS — "will things be shut?" warnings for trip dates.

   WHAT THIS IS
   ------------
   A list of the holidays and holiday seasons that actually cause a
   traveller trouble — days when shops, restaurants, museums or transit
   really do close, or when a city empties out / gets mobbed and
   everything is sold out. It is NOT a list of every public holiday.
   A quiet bank holiday where the cafes stay open is deliberately left
   out, because a banner that fires on every ordinary Monday is a banner
   people learn to ignore.

   WHERE IT IS USED
   ----------------
   - itinerary.html  — when a trip stop's arrive/depart dates overlap
   - choose.html     — when the destination finder's dates overlap

   HOW THE DATES ARE WORKED OUT
   ----------------------------
   Two different mechanisms, on purpose:

   1. COMPUTED, exact, forever. Fixed calendar dates (Dec 25), "nth
      weekday of the month" (US Thanksgiving), Western Easter and
      Orthodox/Coptic Easter (both by Meeus's algorithm). Everything
      Easter-linked — Carnival, Semana Santa, Greek Easter, German
      Karneval, Basler Fasnacht — falls out of these for any year.

   2. LOOKED UP from the tables below, 2026-2040. Chinese New Year,
      Vietnamese Tet, Korean Chuseok, Diwali, Holi, Balinese Nyepi and
      the Islamic dates cannot be computed correctly without real
      astronomical data (and the Islamic ones are decided by moon
      sighting anyway, not by any calendar). Rather than ship an
      algorithm that is quietly wrong, those years are listed outright.

      >>> AFTER 2040 these holidays simply stop producing a banner. <<<
      That is deliberate. No banner is better than a wrong banner.
      To extend, add rows to the tables — nothing else needs changing.

   THE ±1 DAY PROBLEM (Islamic holidays)
   -------------------------------------
   Ramadan and the two Eids are declared by moon sighting a day or two
   ahead, and countries disagree: Morocco and Egypt are routinely a day
   behind Saudi Arabia. The tables below are Saudi's published Umm
   al-Qura civil calendar, and every Islamic entry is flagged `fuzzy`,
   which makes the banner say the date can shift by a day. Do not
   present these as exact.

   ADDING A COUNTRY
   ----------------
   Add a key to HOLIDAYS below, matching the country name exactly as it
   is spelled in destinations.js (add an alias to ALIAS if the spelling
   varies). Each entry is:

     n    name shown in the banner
     r    when it happens (see the rule types listed above the data)
     len  how many days the disruption lasts
     sev  2 = most things closed
          1 = many things closed (banks/shops; sights usually open)
          0 = open, but mobbed / sold out / emptied out
     note one plain sentence a traveller can act on
     cities   optional — only warn for these cities
     fuzzy    optional — true if the date can move by a day
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     LOOKUP TABLES — 2026-2040. See the header note before editing.
     --------------------------------------------------------------- */

  /* Chinese New Year, day 1. Source: Hong Kong Observatory. */
  var CNY = {
    2026:"02-17",2027:"02-06",2028:"01-26",2029:"02-13",2030:"02-03",
    2031:"01-23",2032:"02-11",2033:"01-31",2034:"02-19",2035:"02-08",
    2036:"01-28",2037:"02-15",2038:"02-04",2039:"01-24",2040:"02-12"
  };

  /* Vietnamese Tet, day 1. Same as CNY except 2030 (Vietnam computes
     at UTC+7, so the new moon lands a day earlier that year). */
  var TET = {
    2026:"02-17",2027:"02-06",2028:"01-26",2029:"02-13",2030:"02-02",
    2031:"01-23",2032:"02-11",2033:"01-31",2034:"02-19",2035:"02-08",
    2036:"01-28",2037:"02-15",2038:"02-04",2039:"01-24",2040:"02-12"
  };

  /* Korean Chuseok, the main day (lunar 8/15). Source: KASI, Korea's
     national astronomical institute. NOTE 2040: Korea is Sep 21, one
     day after China's Mid-Autumn — most international lists get this
     wrong and "correct" it to Sep 20. It is not wrong. */
  var CHUSEOK = {
    2026:"09-25",2027:"09-15",2028:"10-03",2029:"09-22",2030:"09-12",
    2031:"10-01",2032:"09-19",2033:"09-08",2034:"09-27",2035:"09-16",
    2036:"10-04",2037:"09-24",2038:"09-13",2039:"10-02",2040:"09-21"
  };

  /* Diwali — Lakshmi Puja day, computed for New Delhi. This is the day
     the Government of India gazettes. South India observes a day
     earlier in some years; not modelled. */
  var DIWALI = {
    2026:"11-08",2027:"10-29",2028:"10-17",2029:"11-05",2030:"10-26",
    2031:"11-14",2032:"11-02",2033:"10-22",2034:"11-10",2035:"10-30",
    2036:"10-18",2037:"11-07",2038:"10-27",2039:"11-15",2040:"11-04"
  };

  /* Holi — the colours day (Rangwali Holi / Dhulandi), New Delhi.
     Holika Dahan, the bonfire, is the evening before. */
  var HOLI = {
    2026:"03-04",2027:"03-22",2028:"03-11",2029:"03-01",2030:"03-20",
    2031:"03-09",2032:"03-27",2033:"03-16",2034:"03-05",2035:"03-24",
    2036:"03-12",2037:"03-02",2038:"03-21",2039:"03-11",2040:"03-29"
  };

  /* Balinese Nyepi (Saka New Year). Source: Kalender Bali Digital. */
  var NYEPI = {
    2026:"03-19",2027:"03-08",2028:"03-26",2029:"03-15",2030:"03-05",
    2031:"03-24",2032:"03-12",2033:"03-31",2034:"03-20",2035:"03-10",
    2036:"03-28",2037:"03-17",2038:"03-06",2039:"03-25",2040:"03-14"
  };

  /* First day of Ramadan (Umm al-Qura). 2030 has two — the Islamic year
     is shorter than the Gregorian one, so it drifts. */
  var RAMADAN = {
    2026:["02-18"],2027:["02-08"],2028:["01-28"],2029:["01-16"],
    2030:["01-05","12-26"],2031:["12-15"],2032:["12-04"],2033:["11-23"],
    2034:["11-12"],2035:["11-01"],2036:["10-20"],2037:["10-10"],
    2038:["09-30"],2039:["09-19"],2040:["09-07"]
  };
  /* How long each of those Ramadans runs, 29 or 30 days, same order.
     Eid al-Fitr is the day after it ends. */
  var RAMADAN_LEN = {
    2026:[30],2027:[29],2028:[29],2029:[29],2030:[30,29],2031:[30],
    2032:[29],2033:[30],2034:[30],2035:[30],2036:[30],2037:[29],
    2038:[29],2039:[30],2040:[30]
  };

  /* 1 Muharram — Islamic New Year, Umm al-Qura. Ashura is this + 9 days.
     Generated with the hijridate library, which was checked first against
     the van Gent Umm al-Qura tables above and reproduced all 30 Ramadan
     and Eid al-Adha dates exactly, so its Muharram column is trusted too. */
  var MUHARRAM = {
    2026:["06-16"],2027:["06-06"],2028:["05-25"],2029:["05-14"],2030:["05-03"],
    2031:["04-23"],2032:["04-11"],2033:["04-01"],2034:["03-21"],2035:["03-11"],
    2036:["02-28"],2037:["02-16"],2038:["02-05"],2039:["01-26"],2040:["01-15"]
  };

  /* Nowruz — 1 Farvardin, the Persian new year, as Iran observes it.
     This IS astronomical (the March equinox at Tehran), so it is a real
     computed date, just tabulated here rather than recomputed in the
     browser. Lands on 20 or 21 March. */
  var NOWRUZ = {
    2026:"03-21",2027:"03-21",2028:"03-20",2029:"03-20",2030:"03-21",
    2031:"03-21",2032:"03-20",2033:"03-20",2034:"03-21",2035:"03-21",
    2036:"03-20",2037:"03-20",2038:"03-21",2039:"03-21",2040:"03-20"
  };

  /* Qingming / Ching Ming (Tomb Sweeping), the solar term at 15 degrees
     of solar longitude — April 4 or 5 in every year in this range. */
  var QINGMING = {
    2026:"04-05",2027:"04-05",2028:"04-04",2029:"04-04",2030:"04-05",
    2031:"04-05",2032:"04-04",2033:"04-04",2034:"04-05",2035:"04-05",
    2036:"04-04",2037:"04-04",2038:"04-05",2039:"04-05",2040:"04-04"
  };

  /* Eid al-Adha, day 1 (10 Dhu al-Hijjah). 2039 has two. */
  var EID_ADHA = {
    2026:["05-27"],2027:["05-16"],2028:["05-05"],2029:["04-24"],
    2030:["04-13"],2031:["04-02"],2032:["03-22"],2033:["03-11"],
    2034:["03-01"],2035:["02-18"],2036:["02-07"],2037:["01-26"],
    2038:["01-16"],2039:["01-05","12-26"],2040:["12-14"]
  };

  /* Israel. The Hebrew calendar is fully deterministic, so these are
     exact, not estimates — they are simply tabulated rather than
     re-implementing the calendar. Everything else derives by a fixed
     offset: Yom Kippur = Rosh Hashanah + 9, Sukkot + 14, and so on.
     All of them actually begin at SUNSET THE EVENING BEFORE. */
  var ROSH = {
    2026:"09-12",2027:"10-02",2028:"09-21",2029:"09-10",2030:"09-28",
    2031:"09-18",2032:"09-06",2033:"09-24",2034:"09-14",2035:"10-04",
    2036:"09-22",2037:"09-10",2038:"09-30",2039:"09-19",2040:"09-08"
  };
  var PESACH = {
    2026:"04-02",2027:"04-22",2028:"04-11",2029:"03-31",2030:"04-18",
    2031:"04-08",2032:"03-27",2033:"04-14",2034:"04-04",2035:"04-24",
    2036:"04-12",2037:"03-31",2038:"04-20",2039:"04-09",2040:"03-29"
  };

  /* ---------------------------------------------------------------
     DATE HELPERS — all dates are handled as plain "YYYY-MM-DD"
     strings in UTC so that nobody's timezone shifts a holiday.
     --------------------------------------------------------------- */

  function utc(y, m, d) { return Date.UTC(y, m - 1, d); }
  function iso(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + "-" +
      String(d.getUTCMonth() + 1).padStart(2, "0") + "-" +
      String(d.getUTCDate()).padStart(2, "0");
  }
  function parse(s) {
    var p = String(s).split("-");
    return utc(+p[0], +p[1], +p[2]);
  }
  var DAY = 86400000;
  function addDays(ms, n) { return ms + n * DAY; }
  /* "MM-DD" plus a year -> milliseconds */
  function md(year, mmdd) { return parse(year + "-" + mmdd); }

  /* Western (Gregorian) Easter Sunday — Meeus/Butcher. */
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100;
    var d = Math.floor(b / 4), e = b % 4;
    var f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mo = Math.floor((h + l - 7 * m + 114) / 31);
    var da = ((h + l - 7 * m + 114) % 31) + 1;
    return utc(y, mo, da);
  }

  /* Orthodox / Coptic Easter Sunday — Meeus's Julian algorithm, then
     shifted onto the Gregorian calendar (13 days for 1900-2099). */
  function orthEaster(y) {
    var a = y % 4, b = y % 7, c = y % 19;
    var d = (19 * c + 15) % 30;
    var e = (2 * a + 4 * b - d + 34) % 7;
    var mo = Math.floor((d + e + 114) / 31);
    var da = ((d + e + 114) % 31) + 1;
    return addDays(utc(y, mo, da), 13);
  }

  /* Nth given weekday of a month. wd: 0=Sun .. 6=Sat */
  function nthWeekday(y, month, wd, n) {
    var first = utc(y, month, 1);
    var shift = (wd - new Date(first).getUTCDay() + 7) % 7;
    return addDays(first, shift + (n - 1) * 7);
  }

  /* ---------------------------------------------------------------
     RULE TYPES — each returns an array of start dates (ms) for a year.

       fixed     {m, d}                a calendar date
       fixedset  {days:[[m,d],...]}    several dates, same meaning
       range     {m1,d1,m2,d2}         a season; wraps past New Year
       nth       {m, wd, n}            nth weekday of a month
       wdon      {m, d, wd}            first weekday wd on or after m/d
                                       (Nordic Midsummer: Friday on/after Jun 19)
       nowruz    {off}                 from Persian New Year
       muharram  {off}                 from 1 Muharram (Ashura = off 9)
       qingming  {off}                 from Tomb Sweeping Day
       easter    {off}                 offset from Western Easter
       oeaster   {off}                 offset from Orthodox/Coptic Easter
       cny/tet/chuseok/diwali/holi/nyepi   {off}   from the tables
       ramadan   {off}                 from day 1 of Ramadan
       eidfitr   {off}                 from Eid al-Fitr day 1
       eidadha   {off}                 from Eid al-Adha day 1
       rosh      {off}                 from Rosh Hashanah (Israel)
       pesach    {off}                 from Passover day 1 (Israel)
     --------------------------------------------------------------- */

  function tableStarts(tbl, y, off) {
    if (!tbl[y]) return [];
    return [addDays(md(y, tbl[y]), off || 0)];
  }

  function starts(rule, y) {
    var k = rule.k, i, out;
    if (k === "fixed") return [utc(y, rule.m, rule.d)];
    if (k === "fixedset") {
      return rule.days.map(function (p) { return utc(y, p[0], p[1]); });
    }
    if (k === "range") return [utc(y, rule.m1, rule.d1)];
    if (k === "nth") return [addDays(nthWeekday(y, rule.m, rule.wd, rule.n), rule.off || 0)];
    if (k === "wdon") {  /* first given weekday on or after a date */
      var base = utc(y, rule.m, rule.d);
      var sh = (rule.wd - new Date(base).getUTCDay() + 7) % 7;
      return [addDays(base, sh + (rule.off || 0))];
    }
    if (k === "nowruz") return tableStarts(NOWRUZ, y, rule.off);
    if (k === "qingming") return tableStarts(QINGMING, y, rule.off);
    if (k === "muharram") {
      if (!MUHARRAM[y]) return [];
      return MUHARRAM[y].map(function (s) { return addDays(md(y, s), rule.off || 0); });
    }
    if (k === "easter") return [addDays(easter(y), rule.off || 0)];
    if (k === "oeaster") return [addDays(orthEaster(y), rule.off || 0)];
    if (k === "cny") return tableStarts(CNY, y, rule.off);
    if (k === "tet") return tableStarts(TET, y, rule.off);
    if (k === "chuseok") return tableStarts(CHUSEOK, y, rule.off);
    if (k === "diwali") return tableStarts(DIWALI, y, rule.off);
    if (k === "holi") return tableStarts(HOLI, y, rule.off);
    if (k === "nyepi") return tableStarts(NYEPI, y, rule.off);
    if (k === "rosh") return tableStarts(ROSH, y, rule.off);
    if (k === "pesach") return tableStarts(PESACH, y, rule.off);
    if (k === "ramadan") {
      if (!RAMADAN[y]) return [];
      return RAMADAN[y].map(function (s) { return addDays(md(y, s), rule.off || 0); });
    }
    if (k === "eidfitr") {
      if (!RAMADAN[y]) return [];
      out = [];
      for (i = 0; i < RAMADAN[y].length; i++) {
        /* Eid al-Fitr is the day after Ramadan's last day. */
        out.push(addDays(md(y, RAMADAN[y][i]), RAMADAN_LEN[y][i] + (rule.off || 0)));
      }
      return out;
    }
    if (k === "eidadha") {
      if (!EID_ADHA[y]) return [];
      return EID_ADHA[y].map(function (s) { return addDays(md(y, s), rule.off || 0); });
    }
    return [];
  }

  /* How long one occurrence lasts, in days. */
  function lengthOf(h, y, startMs) {
    if (h.r.k === "range") {
      var sy = new Date(startMs).getUTCFullYear();
      var end = utc(sy, h.r.m2, h.r.d2);
      if (end < startMs) end = utc(sy + 1, h.r.m2, h.r.d2); /* wraps New Year */
      return Math.round((end - startMs) / DAY) + 1;
    }
    if (h.r.k === "ramadan" && h.len === "month") {
      var idx = RAMADAN[y] ? RAMADAN[y].indexOf(iso(startMs).slice(5)) : -1;
      return idx >= 0 ? RAMADAN_LEN[y][idx] : 30;
    }
    return h.len || 1;
  }

  /* ---------------------------------------------------------------
     THE DATA. Countries are keyed exactly as destinations.js spells
     them. See the header for what the fields mean.
     --------------------------------------------------------------- */

  var XMAS  = { n: "Christmas Day", r: { k: "fixed", m: 12, d: 25 } };
  var NYD   = { n: "New Year's Day", r: { k: "fixed", m: 1, d: 1 } };

  var HOLIDAYS = {

    /* ---------------- EUROPE ---------------- */

    "France": [
      { n:"Labour Day (1er Mai)", r:{k:"fixed",m:5,d:1}, len:1, sev:2,
        note:"Almost nothing is allowed to open — shops, bakeries and many museums shut, and buses and trams stop completely in Lyon, Marseille, Bordeaux, Toulouse, Nantes, Strasbourg and Nice." },
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"Shops, supermarkets and most museums closed; a handful of restaurants open with a set menu." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:2,
        note:"Shops, supermarkets and museums all closed, including the big department stores." },
      { n:"Bastille Day", r:{k:"fixed",m:7,d:14}, len:1, sev:1,
        note:"Museums and monuments close, and central Paris is closed to traffic for the parade and fireworks." },
      { n:"The August shutdown", r:{k:"range",m1:8,d1:1,m2:8,d2:31}, len:0, sev:0,
        note:"Locals leave for the month — neighbourhood bakeries, bistros and small shops post 'ferme pour conges annuels' for weeks, though tourist-area Paris, supermarkets and museums carry on." }
    ],

    "Spain": [
      { n:"Epiphany (Reyes)", r:{k:"fixed",m:1,d:6}, len:1, sev:2,
        note:"Most shops and many museums closed and transport is on a reduced timetable; the evening of the 5th brings big street parades and road closures." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"Shops, banks and offices closed; museums often open on shorter hours." },
      { n:"Holy Week (Semana Santa)", r:{k:"easter",off:-7}, len:8, sev:0,
        cities:["Seville","Malaga","Málaga"],
        note:"The centre closes to traffic every afternoon for processions, so crossing town takes far longer than you'd think, and hotels are at peak prices." },
      { n:"Feria de Abril", r:{k:"easter",off:14}, len:6, sev:0, cities:["Seville"],
        note:"Streets near the fairground close and the whole city is booked out." },
      { n:"Las Fallas", r:{k:"range",m1:3,d1:15,m2:3,d2:19}, len:0, sev:0, cities:["Valencia"],
        note:"Most of the centre is shut to traffic, buses are rerouted, and hotels are full at peak prices." },
      { n:"San Fermin (running of the bulls)", r:{k:"range",m1:7,d1:6,m2:7,d2:14}, len:0, sev:0,
        cities:["Pamplona"],
        note:"Over a million visitors, the Old Town closed to traffic, and beds booked out months ahead at four to five times the normal price." },
      { n:"Sant Joan", r:{k:"fixed",m:6,d:24}, len:1, sev:1, cities:["Barcelona"],
        note:"Most shops, museums and attractions closed, and the night before is fireworks and bonfires until dawn — don't expect to sleep near a beach or square." },
      { n:"The August shutdown", r:{k:"range",m1:8,d1:1,m2:8,d2:31}, len:0, sev:0,
        note:"Roughly one business in five closes for the month — in Madrid especially, neighbourhood bars, restaurants and small museums hang 'cerrado por vacaciones' signs, while chains and big sights stay open." }
    ],

    "Italy": [
      { n:"Ferragosto", r:{k:"fixed",m:8,d:15}, len:1, sev:2,
        note:"Banks, post offices, most shops, bakeries and family-run restaurants closed; supermarkets open short hours and local transport runs a holiday timetable." },
      { n:"Christmas and St Stephen's Day", r:{k:"range",m1:12,d1:25,m2:12,d2:26}, len:0, sev:2,
        note:"Most supermarkets shut both days and private museums close; the big state sites close on the 25th but reopen on the 26th." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:2,
        note:"Almost all museums and independent shops closed; metro and buses on limited hours." },
      { n:"Saints Peter and Paul", r:{k:"fixed",m:6,d:29}, len:1, sev:1, cities:["Rome"],
        note:"A Rome-only holiday: offices closed and many shops shut at lunchtime, though the main sights stay open." },
      { n:"Sant'Ambrogio", r:{k:"fixed",m:12,d:7}, len:1, sev:1, cities:["Milan"],
        note:"Milan's patron saint's day — banks, offices, most shops and many museums closed." },
      { n:"The August holidays (chiuso per ferie)", r:{k:"range",m1:8,d1:5,m2:8,d2:25}, len:0, sev:0,
        note:"Cities empty out and huge numbers of independent shops and restaurants close for two to three weeks; the coast and the tourist centres are the opposite — packed." }
    ],

    "Germany": [
      { n:"Public holiday — every shop is shut",
        r:{k:"fixedset",days:[[1,1],[5,1],[10,3],[12,25],[12,26]]}, len:1, sev:1,
        note:"German law closes essentially every supermarket and shop — you cannot buy groceries at all. Bakeries, station and airport shops and petrol stations are the exceptions, and restaurants, bars and museums stay open." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"Every supermarket and shop closed by law; restaurants and museums open." },
      { n:"Easter Monday", r:{k:"easter",off:1}, len:1, sev:1,
        note:"Every supermarket and shop closed by law; restaurants and museums open." },
      { n:"Christmas Eve", r:{k:"fixed",m:12,d:24}, len:1, sev:1,
        note:"Shops and supermarkets close around 2pm or earlier and most restaurants shut for the evening — buy anything you need in the morning." },
      { n:"Karneval", r:{k:"easter",off:-52}, len:6, sev:1,
        cities:["Cologne","Dusseldorf","Düsseldorf","Mainz","Aachen"],
        note:"Shops and supermarkets close at 11:11am on the Thursday and 2pm on Rose Monday, city offices shut, and parade routes make the centre unreachable." },
      { n:"Oktoberfest", r:{k:"range",m1:9,d1:16,m2:10,d2:6}, len:0, sev:0, cities:["Munich"],
        note:"Nothing closes, but hotels across the city book out up to a year ahead and prices spike." }
    ],

    "United Kingdom": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"The hardest shutdown in Western Europe — no trains anywhere in Britain, no Tube, buses, trams or DLR in London, and all large shops closed by law. Plan to stay put." },
      { n:"Boxing Day", r:{k:"fixed",m:12,d:26}, len:1, sev:1,
        note:"Very limited rail — several train companies run nothing at all and some stations stay shut; shops reopen for the sales." },
      { n:"Easter Sunday", r:{k:"easter",off:0}, len:1, sev:1,
        note:"All large shops, supermarkets included, must close by law in England and Wales; small shops, pubs and attractions stay open." },
      { n:"Edinburgh Festival and Fringe", r:{k:"range",m1:8,d1:1,m2:8,d2:25}, len:0, sev:0,
        cities:["Edinburgh"],
        note:"The city's population roughly doubles and rooms go for two to three times normal, selling out months ahead." }
    ],

    "Netherlands": [
      { n:"King's Day (Koningsdag)", r:{k:"fixed",m:4,d:27}, len:1, sev:1,
        note:"Most city-centre shops closed, and in Amsterdam no trams or buses run in the centre at all — they stop at the ring road and you walk. Taxis and cars can't get in either." },
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"Almost everything shut — all shops, most coffeeshops, some bars — with transport on a Sunday-level service. The 26th is much easier and shops open." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:1,
        note:"Shops, banks and offices closed and transport on a holiday timetable." }
    ],

    "Greece": [
      { n:"Orthodox Easter", r:{k:"oeaster",off:-2}, len:4, sev:2,
        note:"Nearly everything closes on Easter Sunday, museums and archaeological sites included, and ferry timetables are cut back just as demand for ferries, flights and rooms peaks. Note Greek Easter is often weeks after the Western one." },
      { n:"Clean Monday", r:{k:"oeaster",off:-48}, len:1, sev:1,
        note:"The start of Lent — shops closed and most businesses shut while families picnic and fly kites." },
      { n:"Dormition of the Virgin (Dekapentavgoustos)", r:{k:"fixed",m:8,d:15}, len:1, sev:2,
        note:"Most businesses close, Athens and Thessaloniki empty out as locals head to the islands, and last-minute ferries, flights and hotel rooms are effectively unobtainable." }
    ],

    "Portugal": [
      { n:"Assumption", r:{k:"fixed",m:8,d:15}, len:1, sev:1,
        note:"Shops, banks and public services closed; attractions, beaches and most restaurants open." },
      { n:"Santo Antonio", r:{k:"fixed",m:6,d:13}, len:1, sev:1, cities:["Lisbon"],
        note:"City holiday — municipal offices and most street-level shops closed, and the night before the Alfama streets are packed all night with the metro closing early." },
      { n:"Sao Joao", r:{k:"fixed",m:6,d:24}, len:1, sev:1, cities:["Porto"],
        note:"Porto holiday — most shops, museums and restaurants closed for the day after an all-night party." },
      { n:"The August holidays", r:{k:"range",m1:8,d1:1,m2:8,d2:31}, len:0, sev:0,
        note:"Independent restaurants, bakeries and shops close for two to three weeks with an 'encerrado para ferias' sign, while the tourist core is at its most crowded of the year." }
    ],

    "Austria": [
      { n:"Public holiday — every shop is shut",
        r:{k:"fixedset",days:[[1,1],[5,1],[8,15],[10,26],[11,1],[12,25],[12,26]]}, len:1, sev:1,
        note:"All shops, supermarkets, banks and public services close — buy groceries the day before. Museums, cafes and restaurants generally stay open." },
      { n:"Public holiday — every shop is shut",
        r:{k:"easter",off:1}, len:1, sev:1,
        note:"Easter Monday: all shops, supermarkets and banks closed. Museums and cafes generally open." },
      { n:"Public holiday — every shop is shut",
        r:{k:"easter",off:39}, len:1, sev:1,
        note:"Ascension Day: all shops, supermarkets and banks closed. Museums and cafes generally open." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Shops, cafes, attractions and many restaurants start closing around 4pm on the 24th, and some museums and restaurants don't open at all over the three days." }
    ],

    "Switzerland": [
      { n:"Public holiday — supermarkets closed",
        r:{k:"fixedset",days:[[1,1],[8,1],[12,25]]}, len:1, sev:1,
        note:"Federal law shuts every major supermarket and most shops. The reliable exceptions are the station shops at Zurich HB, Geneva Cornavin and Bern HB, plus airports and resort tourist zones." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"Supermarkets and most shops closed nationwide (except Ticino)." },
      { n:"Easter Monday", r:{k:"easter",off:1}, len:1, sev:1,
        note:"Supermarkets and most shops closed; station and airport shops are the exception." },
      { n:"Basler Fasnacht", r:{k:"easter",off:-41}, len:3, sev:1, cities:["Basel"],
        note:"Shops and banks close for three days, and the whole inner city is blacked out at 4am on the first morning for the Morgestraich." }
    ],

    /* ---------------- MIDDLE EAST & NORTH AFRICA ---------------- */

    "Turkey": [
      { n:"Eid al-Fitr (Ramazan Bayrami)", r:{k:"eidfitr",off:0}, len:4, sev:2, fuzzy:true,
        note:"The Grand Bazaar and Spice Bazaar shut completely and most shops and many museums close on the first day; intercity buses, trains and flights sell out and cost more." },
      { n:"Eid al-Adha (Kurban Bayrami)", r:{k:"eidadha",off:-1}, len:5, sev:2, fuzzy:true,
        note:"Banks, offices and the bazaars close for five days or more and every kind of intercity transport is jammed. Resort towns stay open and are at their busiest." },
      { n:"Republic Day", r:{k:"fixed",m:10,d:29}, len:1, sev:1,
        note:"Banks, government offices and the Grand and Spice Bazaars close, but malls, restaurants and the main sights run normally." }
    ],

    "UAE": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"The mildest Ramadan in the Gulf — restaurants, malls and hotel bars run normally and there is no rule against eating in public — but hours shift very late (malls to 1 or 2am) and daytime is quiet." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:-1}, len:4, sev:1, fuzzy:true,
        note:"Government offices and banks shut; malls, hotels, restaurants and attractions stay open and get very busy." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-1}, len:4, sev:1, fuzzy:true,
        note:"Offices and banks closed for about four days; tourist life carries on as normal." },
      { n:"National Day (Eid al-Etihad)", r:{k:"range",m1:12,d1:2,m2:12,d2:3}, len:0, sev:1,
        note:"Public offices and banks shut and most private business follows; big public events bring road closures." }
    ],

    "Saudi Arabia": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"The strictest Ramadan of any country here: restaurants and cafes are legally closed in daylight even for tourists, and eating, drinking or smoking in public during daylight is an offence. Eat in your hotel." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:-2}, len:5, sev:2, fuzzy:true,
        note:"Government, banks and most businesses close for several days and domestic travel is heavy." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-1}, len:4, sev:2, fuzzy:true,
        note:"A four-day shutdown across public and private business; the Hajj also makes Mecca, Medina and the whole western region extremely congested." },
      { n:"National Day", r:{k:"fixed",m:9,d:23}, len:1, sev:1,
        note:"Government, banks, schools and most private business closed; malls and events stay open and festive." },
      { n:"Founding Day", r:{k:"fixed",m:2,d:22}, len:1, sev:1,
        note:"Government offices and banks closed for the day; shops and attractions open." }
    ],

    "Qatar": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Most restaurants outside hotels close in daylight, eating or drinking in public during daylight is not allowed, and — the big one — no alcohol is served anywhere in Qatar for the whole month, hotel bars included." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:-1}, len:4, sev:1, fuzzy:true,
        note:"Government and business closed; hotels and malls open." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-1}, len:5, sev:1, fuzzy:true,
        note:"Ministries and state bodies shut for about five days — the longest Eid closure in the Gulf." },
      { n:"National Day", r:{k:"fixed",m:12,d:18}, len:1, sev:1,
        note:"Schools, government offices and businesses closed, with a big parade closing central Doha and the Corniche." }
    ],

    "Egypt": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"The pyramids, museums and temples close one to two hours early so staff can get home for iftar, and local restaurants shut in daylight — hotel and tourist restaurants stay open. Alcohol is harder to find and many bars go dry." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:4, sev:2, fuzzy:true,
        note:"Most shops close for at least the first day and often the next two — downtown, the malls and the Khan el-Khalili bazaar included. Banks shut for three to five days, but the big archaeological sites stay open." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:4, sev:2, fuzzy:true,
        note:"Three to five days of closed shops, bazaars and banks; the major sites stay open." },
      { n:"Sham el-Nessim", r:{k:"oeaster",off:1}, len:1, sev:1,
        note:"Banks, government and most private business closed while the entire country is outdoors picnicking — parks and the Nile corniche are packed. Hotels, tours and the pyramids run normally." }
    ],

    "Morocco": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Local cafes and street stalls stay shut until sunset, which in a country where cafe life is street life is a real change — but restaurants in the tourist areas of Marrakech, Essaouira, Tangier and Agadir stay open." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:3, sev:2, fuzzy:true,
        note:"Souks, tanneries and craft workshops close and the first day is near-total; tourist restaurants and riads keep going." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:3, sev:2, fuzzy:true,
        note:"Normally the biggest shutdown of the Moroccan year — shops, souks and workshops closed for days while families celebrate at home." },
      { n:"Throne Day", r:{k:"fixed",m:7,d:30}, len:1, sev:1,
        note:"Schools, government offices and most business closed, though shops and restaurants generally stay open." }
    ],

    "Jordan": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Restaurants and cafes are required to close in daylight and every liquor store shuts for the month; eating, drinking or smoking in public in daylight is illegal. Cafes inside Petra, the Dead Sea resorts and Wadi Rum camps carry on as normal, but Petra, Amman and Jerash run shorter hours." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:-1}, len:4, sev:1, fuzzy:true,
        note:"Business and government closed for three to four days; Petra and the main sites stay open but domestic travel is heavy." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-1}, len:4, sev:1, fuzzy:true,
        note:"Business and government closed for three to four days; the main sites stay open." }
    ],

    "Israel": [
      { n:"Yom Kippur", r:{k:"rosh",off:9}, len:1, sev:2,
        note:"The entire country stops. Ben Gurion airport closes to all flights, every bus and train stops, border crossings shut, and there is nothing open at all — no shops, no restaurants, no traffic. It starts at sunset the evening before. Nothing else on this site compares." },
      { n:"Rosh Hashanah", r:{k:"rosh",off:0}, len:2, sev:2,
        note:"Shops, restaurants, banks and offices closed for both days and no public transport at all; taxis run and most tourist sites are open. Starts at sunset the evening before." },
      { n:"Sukkot (first day)", r:{k:"rosh",off:14}, len:1, sev:2,
        note:"Most business closed, no public transport, few restaurants or museums. The days that follow are open but very crowded. Starts at sunset the evening before." },
      { n:"Simchat Torah", r:{k:"rosh",off:21}, len:1, sev:2,
        note:"A full shutdown like the first day of Sukkot, with no public transport. Starts at sunset the evening before." },
      { n:"Passover (first day)", r:{k:"pesach",off:0}, len:1, sev:2,
        note:"Treated exactly like Shabbat — no public transport, shops and kosher restaurants all closed. Bread disappears from most places for the whole week. Starts at sunset the evening before." },
      { n:"Passover (last day)", r:{k:"pesach",off:6}, len:1, sev:2,
        note:"The same full shutdown as the first day. The days in between are open but on short hours and very crowded." },
      { n:"Shavuot", r:{k:"pesach",off:50}, len:1, sev:2,
        note:"A Shabbat-style shutdown with no public transport. Starts at sunset the evening before." }
    ],

    /* ---------------- ASIA ---------------- */

    "Japan": [
      { n:"New Year (Oshogatsu)", r:{k:"range",m1:12,d1:29,m2:1,d2:3}, len:0, sev:2,
        note:"The one time of year Japan genuinely closes — most small restaurants, local shops, many museums and markets shut for several days. Convenience stores, chains and shrines stay open." },
      { n:"Golden Week", r:{k:"range",m1:4,d1:29,m2:5,d2:6}, len:0, sev:0,
        note:"Shops stay open, but bullet trains and hotels sell out months ahead and prices jump 50 to 100 per cent. Book early or travel against the flow." },
      { n:"Obon", r:{k:"range",m1:8,d1:8,m2:8,d2:16}, len:0, sev:1,
        note:"Family-run restaurants, small shops and ryokan close for a few days while the whole country travels — every Nozomi bullet train goes reserved-seat-only and sells out weeks ahead." }
    ],

    "China": [
      { n:"Spring Festival (Chinese New Year)", r:{k:"cny",off:-1}, len:9, sev:2,
        note:"Family-run restaurants, wet markets and small shops shut for days and sometimes two weeks. Chains, malls and hotels stay open, but the cities empty out and everything else is booked solid." },
      { n:"Chunyun travel season", r:{k:"cny",off:-15}, len:40, sev:0,
        note:"The world's largest annual migration — trains, flights and roads are jammed for weeks either side of New Year itself." },
      { n:"National Day Golden Week", r:{k:"range",m1:10,d1:1,m2:10,d2:7}, len:0, sev:0,
        note:"Over 800 million domestic trips in one week — train tickets vanish minutes after release, flights triple in price, hotels sell out months ahead and the big sights hit their daily capacity caps." },
      { n:"Labour Day holiday", r:{k:"range",m1:4,d1:29,m2:5,d2:6}, len:0, sev:0,
        note:"A mini Golden Week — high-speed rail is booked out two to three months ahead and the headline sights are shoulder to shoulder." }
    ],

    "South Korea": [
      { n:"Seollal (Lunar New Year)", r:{k:"cny",off:-1}, len:3, sev:1,
        note:"Independent restaurants and family shops close, but department stores, chains, palaces and hotels stay open. The real problem is that KTX and express bus tickets sell out instantly." },
      { n:"Chuseok", r:{k:"chuseok",off:-1}, len:3, sev:1,
        note:"Same picture as Seollal — independent cafes and restaurants shut, Seoul feels eerily empty, and intercity trains and buses are impossible without booking well ahead." }
    ],

    "Thailand": [
      { n:"Songkran (Thai New Year)", r:{k:"range",m1:4,d1:11,m2:4,d2:17}, len:0, sev:1,
        note:"Banks, offices and most family-run shops and restaurants close completely while malls stay open. Expect road closures, a mass exodus from Bangkok, packed transport, and be aware road crashes spike sharply." }
    ],

    "Vietnam": [
      { n:"Tet (Lunar New Year)", r:{k:"tet",off:-2}, len:8, sev:2,
        note:"One of the biggest shutdowns anywhere — 80 to 90 per cent of restaurants, street vendors and small shops close, ride-hailing drivers vanish, and domestic flights, trains and buses are booked out weeks ahead at inflated prices." },
      { n:"Reunification Day and Labour Day", r:{k:"range",m1:4,d1:30,m2:5,d2:3}, len:0, sev:0,
        note:"Vietnam's second-biggest travel rush after Tet — airfares jump about half and coastal resorts sell out. Shops stay open." }
    ],

    "India": [
      { n:"Diwali", r:{k:"diwali",off:0}, len:2, sev:1,
        note:"Shops and restaurants close early and banks and government offices shut, though monuments like the Taj Mahal stay open. The bigger problem is the travel rush — trains are booked out for weeks either side." },
      { n:"Holi", r:{k:"holi",off:0}, len:1, sev:1,
        note:"Shops and restaurants shut for the morning and reopen by evening, city transport can be unavailable until afternoon, and taxis charge two to three times normal. Plan to stay put — and expect to get covered in coloured powder if you go out." }
    ],

    "Indonesia": [
      { n:"Idul Fitri (Lebaran)", r:{k:"eidfitr",off:-1}, len:7, sev:2, fuzzy:true,
        note:"Small businesses shut for days and much of the country stops work for the week." },
      /* The travel crush runs far wider than the holiday itself, but it is a
         crowding problem, not a closure — so it gets the quieter level. */
      { n:"The mudik exodus", r:{k:"eidfitr",off:-8}, len:16, sev:0, fuzzy:true,
        note:"The largest annual human migration on earth — around 140 million people on the move, with ferries, airports and stations overwhelmed. Book any domestic flight or ferry well ahead." },
      { n:"Nyepi (Day of Silence)", r:{k:"nyepi",off:0}, len:1, sev:2, cities:["Denpasar","Bali","Ubud","Kuta","Seminyak"],
        note:"Bali's airport closes completely for 24 hours and hundreds of flights are cancelled. Every shop, restaurant, road, port and ATM shuts, and you must stay inside your hotel with no noise and no visible lights. Do not fly in or out on this date." }
    ],

    "Singapore": [
      { n:"Chinese New Year", r:{k:"cny",off:0}, len:2, sev:1,
        note:"Much milder than in China — over 85 per cent of hawker centres, wet markets and small Chinese-run shops close for two days, but malls, attractions, the MRT, supermarkets and Malay and Indian eateries all run normally." }
    ],

    /* ---------------- AMERICAS ---------------- */

    "United States": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"Nearly every shop, grocery chain, mall and major museum closed nationwide, with transit on a Sunday schedule. Some cinemas, fast food and Chinese restaurants are the exception." },
      { n:"Thanksgiving Day", r:{k:"nth",m:11,wd:4,n:4}, len:1, sev:1,
        note:"Big-box stores and offices close, but many grocery stores and restaurants stay open and transit runs close to a Sunday schedule." },
      { n:"Thanksgiving travel week", r:{k:"nth",m:11,wd:4,n:4,off:-2}, len:7, sev:0,
        note:"The busiest travel week of the American year — around 80 million people on the move. Flights and highways are jammed, and the Sunday after is the single worst day to fly." }
    ],

    "Canada": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"Shops and malls shut nationwide with transit on holiday schedules; airports, stations and petrol stations stay open on reduced hours." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:2,
        note:"Most shops and malls closed, transit reduced." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"In Ontario and most provinces the big grocery chains and liquor stores close and transit runs a Sunday schedule. Quebec is the exception — shops stay open there." }
    ],

    "Mexico": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"Most museums, shops, banks and offices closed; a few hotel restaurants open by reservation only, and the 24th shuts down from early evening." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:2,
        note:"Most of the city is closed." },
      { n:"Holy Thursday and Good Friday", r:{k:"easter",off:-3}, len:2, sev:1,
        note:"Banks close both days and government offices close through the weekend, but most restaurants, shops and tourist sites stay open on shorter hours." },
      { n:"Semana Santa travel season", r:{k:"easter",off:-13}, len:21, sev:0,
        note:"Mexico's biggest domestic travel period — beach hotel rates double or triple, flights and long-distance buses sell out weeks ahead, and the highways out of Mexico City are gridlocked." },
      { n:"The Guadalupe-Reyes stretch", r:{k:"range",m1:12,d1:12,m2:1,d2:6}, len:0, sev:1,
        note:"Not a shutdown, but from about the 22nd of December to the 2nd of January businesses run on skeleton staff, small independents close for family time and transport is reduced. Expect erratic hours rather than locked doors." },
      { n:"Day of the Dead", r:{k:"range",m1:10,d1:31,m2:11,d2:2}, len:0, sev:0,
        cities:["Oaxaca","Mexico City","Patzcuaro","Pátzcuaro"],
        note:"In Oaxaca especially, hotels are booked months ahead at roughly triple the usual rate and the centre and cemeteries are packed. Shops and restaurants generally stay open." }
    ],

    "Brazil": [
      { n:"Carnival", r:{k:"easter",off:-50}, len:5, sev:2,
        note:"Banks, offices, schools and most businesses shut Monday and Tuesday and in practice for four to five days straight, with Ash Wednesday a half day." },
      { n:"Carnival street closures", r:{k:"easter",off:-50}, len:6, sev:0,
        cities:["Rio de Janeiro","Salvador","Recife","Olinda","Sao Paulo","São Paulo"],
        note:"In Salvador the city effectively stops — over two million people, parade routes closed to traffic for six days and ride-hailing scarce and surge-priced. In Rio the Sambadrome and street blocos close roads and hotels are at peak prices." },
      { n:"Reveillon (New Year on Copacabana)", r:{k:"range",m1:12,d1:31,m2:1,d2:1}, len:0, sev:0,
        cities:["Rio de Janeiro"],
        note:"Two and a half million people pack Copacabana, hotels impose four to five night minimum stays at inflated rates, the beach area closes to cars and buses, and after 10pm only the metro runs." }
    ],

    "Argentina": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"Shops, supermarkets and shopping centres almost all closed; on the 24th supermarkets shut around 6pm." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:2,
        note:"Chains shut every branch and supermarkets and malls are closed." },
      { n:"Summer holidays", r:{k:"range",m1:1,d1:1,m2:2,d2:28}, len:0, sev:0,
        note:"Argentines empty the cities for the coast, so lodging, flights and tours hit their highest prices of the year — and some independent shops and restaurants in Buenos Aires simply close for the month." }
    ],

    "Chile": [
      { n:"Fiestas Patrias", r:{k:"range",m1:9,d1:18,m2:9,d2:19}, len:0, sev:2,
        note:"Malls, supermarkets, banks and most shops are legally required to close, and this is Chile's peak domestic travel week — roads out of Santiago and internal flights fill up. Fondas, restaurants and petrol stations stay open." },
      { n:"Mandatory closure holiday",
        r:{k:"fixedset",days:[[1,1],[5,1],[12,25]]}, len:1, sev:2,
        note:"By law malls and supermarkets must close or be fined. Restaurants, cinemas, on-duty pharmacies, petrol stations and airport shops are the legal exceptions." }
    ],

    "Peru": [
      { n:"Fiestas Patrias", r:{k:"range",m1:7,d1:28,m2:7,d2:29}, len:0, sev:1,
        note:"Government offices, banks and many businesses close and sites run holiday hours, but the bigger problem is that Peruvians travel en masse — flights, trains, buses and hotels in Lima and Cusco sell out and prices spike." },
      { n:"Holy Week", r:{k:"easter",off:-3}, len:2, sev:1,
        note:"Many stores, banks and businesses close on Thursday and Friday, though restaurants, bars and tourist services keep going." },
      { n:"Holy Week crowds", r:{k:"easter",off:-6}, len:8, sev:0, cities:["Cusco","Ayacucho"],
        note:"The city fills completely, with hotels and flights sold out weeks to months ahead and central streets closed for processions." }
    ],

    "Colombia": [
      { n:"Holy Thursday and Good Friday", r:{k:"easter",off:-3}, len:2, sev:1,
        note:"Banks close nationwide both days and many independent shops shutter, but the shopping malls stay open and busy and ATMs work normally." },
      { n:"Semana Santa travel surge", r:{k:"easter",off:-6}, len:7, sev:0,
        note:"Colombians head for Cartagena, Santa Marta, the coffee region and San Andres — beach accommodation needs booking two to three months out." }
    ],

    /* ============ BATCH 2 — added 2026-08-19 ============ */

    /* ---------------- EUROPE & THE NORDICS ---------------- */

    "Poland": [
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Christmas Eve is now a full public holiday too, so supermarkets, shops and most restaurants are shut for three days straight." },
      { n:"Easter Sunday and Monday", r:{k:"easter",off:0}, len:2, sev:2,
        note:"Nearly everything closes including museums and most restaurants — and on Easter Monday people throw water over strangers in the street, which is not a joke." },
      { n:"All Saints' Day", r:{k:"fixed",m:11,d:1}, len:1, sev:2,
        note:"Shops, banks and most businesses shut and the roads around cemeteries jam solid as the whole country visits family graves." },
      { n:"Corpus Christi", r:{k:"easter",off:60}, len:1, sev:1,
        note:"Shops and banks close, and street processions block or reroute city-centre trams and buses through the late morning." }
    ],

    "Czechia": [
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Big shops shut by law and most restaurants close from midday on the 24th, though central Prague's museums and the castle largely stay open. Transit thins right out on Christmas Eve evening." },
      { n:"Public holiday — big shops shut by law",
        r:{k:"fixedset",days:[[1,1],[5,8],[9,28],[10,28]]}, len:1, sev:1,
        note:"Supermarkets and large stores are closed by law, but restaurants, museums and small shops carry on as normal." },
      { n:"Easter Monday", r:{k:"easter",off:1}, len:1, sev:1,
        note:"All shops over 200 square metres are legally shut. Good Friday is deliberately left out of that law and is a completely normal shopping day." }
    ],

    "Belgium": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"Supermarkets, malls, museums, banks and the post office all closed, with trains and trams on a Sunday timetable. Bars around Brussels' Grand-Place stay open." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:2,
        note:"Museums and shops shut, transit on a Sunday service." }
    ],

    "Ireland": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"The most complete shutdown in Western Europe — no trains, no buses, no Dublin Bus at all, and virtually every shop, pub and restaurant closed. A taxi is about your only option." },
      { n:"St Stephen's Day", r:{k:"fixed",m:12,d:26}, len:1, sev:1,
        note:"No trains anywhere in the country and buses on a Sunday timetable, but pubs and many shops do reopen on shorter hours." },
      { n:"St Patrick's Day", r:{k:"fixed",m:3,d:17}, len:1, sev:0, cities:["Dublin","Cork","Galway","Limerick"],
        note:"Half a million people line the parade route, central roads shut from morning to evening, banks and many shops close, and hotel rooms cost far more than usual." }
    ],

    "Sweden": [
      { n:"Midsummer", r:{k:"wdon",m:6,d:19,wd:5}, len:3, sev:2,
        note:"Sweden's second-biggest holiday after Christmas — most shops, museums and many restaurants close from Friday lunchtime, the state off-licence shuts, and Stockholm empties into the countryside." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Christmas Eve is the real event here: shops shut around 2pm on the 24th and the country goes indoors. Most shops stay closed on the 25th and 26th too, with transit on a Sunday timetable." },
      { n:"The July holiday month", r:{k:"range",m1:7,d1:6,m2:8,d2:2}, len:0, sev:0,
        note:"Cities go quiet as small cafes, restaurants and independent shops close for weeks and locals head for the coast." }
    ],

    "Norway": [
      { n:"Easter (Maundy Thursday to Easter Monday)", r:{k:"easter",off:-3}, len:5, sev:2,
        note:"The biggest closure period of the Norwegian year — shops shut Thursday, Friday, Sunday and Monday, the state off-licence closes on the Wednesday, and Norwegians disappear to mountain cabins. Easter Saturday is your one shopping window." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Supermarkets close mid-afternoon on the 24th and stay shut on the 25th and 26th; resort towns get special permission to open reduced hours." },
      { n:"Constitution Day", r:{k:"fixed",m:5,d:17}, len:1, sev:1,
        note:"Grocery stores and offices closed, and the centre of Oslo is shut to traffic for a parade of about 100,000 people. Book any restaurant table in advance." }
    ],

    "Denmark": [
      { n:"Easter (Maundy Thursday to Easter Monday)", r:{k:"easter",off:-3}, len:5, sev:1,
        note:"The shop-closing law shuts all large supermarkets on Maundy Thursday, Good Friday, Easter Sunday and Easter Monday — buy groceries on the Wednesday. Restaurants, cafes and museums mostly stay open." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Large shops must close by 3pm on Christmas Eve and stay shut through the 26th. The same 3pm rule applies on New Year's Eve." }
    ],

    "Finland": [
      { n:"Midsummer (Juhannus)", r:{k:"wdon",m:6,d:19,wd:5}, len:3, sev:2,
        note:"Shops close at 1pm on the Friday and the country effectively shuts until Monday as almost everyone leaves for a lakeside cottage — central Helsinki goes eerily quiet." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Most businesses, shops and restaurants close outright on Christmas Eve and Christmas Day." },
      { n:"Easter", r:{k:"easter",off:-2}, len:4, sev:1,
        note:"The state off-licence and most shops close on Good Friday, Easter Sunday and Easter Monday; a few supermarkets open on restricted hours." },
      { n:"Independence Day", r:{k:"fixed",m:12,d:6}, len:1, sev:1,
        note:"Banks, post offices, the off-licence and most shops close. It's a sombre candlelit day rather than a party." },
      { n:"The July holiday month", r:{k:"range",m1:6,d1:24,m2:7,d2:31}, len:0, sev:0,
        note:"Offices, small businesses and even some tourism services close as the whole country takes four or five weeks off at once — arranging anything in July is famously difficult." }
    ],

    "Croatia": [
      { n:"Assumption of Mary", r:{k:"fixed",m:8,d:15}, len:1, sev:1,
        note:"Retail is legally closed apart from stations, ports, petrol stations and hotels, but coastal restaurants and cafes keep going." },
      { n:"Adriatic peak season", r:{k:"range",m1:7,d1:15,m2:8,d2:31}, len:0, sev:0,
        cities:["Dubrovnik","Split","Zadar","Hvar","Sibenik","Šibenik","Rovinj","Pula"],
        note:"Dubrovnik has been ranked the most overcrowded city in the world at peak; ferries, roads and beaches are jammed and rooms are at their highest prices of the year." }
    ],

    "Romania": [
      { n:"Orthodox Easter", r:{k:"oeaster",off:0}, len:2, sev:1,
        note:"Supermarket chains close on both days and cities empty as people head to family villages; small shops and petrol stations stay open. Note Romanian Easter often falls weeks after the Western one." },
      { n:"Christmas", r:{k:"range",m1:12,d1:25,m2:12,d2:26}, len:0, sev:1,
        note:"Major attractions, banks and many businesses close on the 25th; some Bucharest malls stay open and most things reopen on the 26th." }
    ],

    "Hungary": [
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Everything retail closes at 2pm on the 24th including the Christmas markets, restaurants shut that evening, and the metro drops to a night service. Malls reopen on the 25th and 26th for cinemas and restaurants only — the shops inside stay shut." },
      { n:"St Stephen's Day", r:{k:"fixed",m:8,d:20}, len:1, sev:1,
        note:"Supermarkets, malls and banks close but restaurants and tourist sites stay open — and in Budapest the Danube bridges shut one by one through the afternoon for one of Europe's biggest firework displays." }
    ],

    "Russia": [
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:1,
        note:"Supermarkets, malls and department stores close for the day and reopen on the 2nd." },
      { n:"New Year holiday week", r:{k:"range",m1:1,d1:2,m2:1,d2:8}, len:0, sev:0,
        note:"Government, banks and most businesses are shut for the week and transit is reduced, but restaurants, malls and museums stay open — a slow festive week rather than a shutdown." },
      { n:"Victory Day", r:{k:"fixed",m:5,d:9}, len:1, sev:0, cities:["Moscow","Saint Petersburg"],
        note:"Central Moscow is sealed off — Red Square typically closes about five days ahead, metro stations near the parade route shut, and mobile networks have been blacked out for hours on the day itself." }
    ],

    /* ---------------- MIDDLE EAST & CENTRAL ASIA ---------------- */

    "Iran": [
      { n:"Nowruz (Persian New Year)", r:{k:"nowruz",off:0}, len:4, sev:2,
        note:"Offices, banks and most shops shut and the country embarks on its biggest travel wave of the year — Isfahan, Shiraz, Yazd and Kashan are jammed and every flight, train and bus seat sells out weeks ahead. Tehran itself empties and is unusually pleasant." },
      { n:"Nowruz holidays (to Sizdah Bedar)", r:{k:"nowruz",off:4}, len:9, sev:1,
        note:"The holiday runs about thirteen days in total — many businesses stay shut, and site opening hours are unreliable, so check before you travel across town." },
      { n:"Tasua and Ashura", r:{k:"muharram",off:8}, len:2, sev:2, fuzzy:true,
        note:"Most museums and historic sites close for two days, many shops and services shut, live music and entertainment stop entirely, and the streets fill with mourning processions. Iran observes this far more heavily than most countries — wear dark clothes and be respectful." },
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Restaurants, cafes and street vendors may not serve between dawn and sunset, and eating, drinking or smoking in public in daylight is a criminal offence regardless of your religion. Enforcement on foreign visitors is looser in practice, and hotel food and eating in private are fine." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true,
        note:"A one or two day national holiday closing banks and offices — not the multi-day shutdown you get in the Arab states." },
      { n:"Anniversary of Khomeini's death", r:{k:"range",m1:6,d1:3,m2:6,d2:5}, len:0, sev:1,
        note:"Two consecutive public holidays with schools and most businesses closed and large state ceremonies south of Tehran." }
    ],

    "Iraq": [
      { n:"Ashura", r:{k:"muharram",off:9}, len:3, sev:2, fuzzy:true,
        note:"Government, schools, banks and the stock exchange all shut, and Baghdad has historically imposed multi-day vehicle bans and curfews around the processions." },
      { n:"Arbaeen pilgrimage", r:{k:"muharram",off:42}, len:14, sev:2, fuzzy:true,
        cities:["Karbala","Najaf"],
        note:"Between 20 and 40 million pilgrims converge on Karbala, most walking the 80km from Najaf. For about two weeks these two cities and the road between them have no spare rooms, no normal traffic and enormous security cordons — go only if Arbaeen is why you're going." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:4, sev:2, fuzzy:true,
        note:"Four consecutive days off — government, banks and most businesses shut and the whole country is on the move." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-1}, len:6, sev:2, fuzzy:true,
        note:"An unusually long Eid, up to six days from Arafat Day, with government, banks and most commerce closed throughout." },
      { n:"Newroz", r:{k:"range",m1:3,d1:20,m2:3,d2:21}, len:0, sev:1,
        note:"A national holiday, though the real celebrations and closures are in the Kurdish north — Erbil, Sulaymaniyah and Duhok." }
    ],

    "Bahrain": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Eating, drinking or smoking in public during daylight is a criminal offence even for non-Muslims, most cafes and restaurants stay shut until sunset, and bars and off-licences close for the whole month." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:3, sev:1, fuzzy:true,
        note:"Banks, offices and most small shops shut for three days and the first morning is dead, but malls and hotels reopen quickly." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-1}, len:4, sev:1, fuzzy:true,
        note:"Banks, government and many shops closed; malls and hotels stay open." },
      { n:"Ashura", r:{k:"muharram",off:8}, len:2, sev:1, fuzzy:true,
        note:"A two-day national holiday — banks, offices and the stock exchange close, large mourning processions shut streets in central Manama and Muharraq, and nightlife goes quiet." },
      { n:"National Day", r:{k:"range",m1:12,d1:16,m2:12,d2:17}, len:0, sev:1,
        note:"Ministries and government offices closed for two days; shops and sights carry on." }
    ],

    "Oman": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Eating, drinking, smoking or even chewing gum in public during daylight is illegal, most non-hotel restaurants stay shut until sunset, and the whole country works a five or six hour day." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:4, sev:1, fuzzy:true,
        note:"Banks and offices shut for most of a week and the first day is very quiet — but Mutrah Souq and the markets actually run longer, busier hours." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-1}, len:4, sev:1, fuzzy:true,
        note:"Offices and banks closed, roads packed and services reduced." },
      { n:"National Day", r:{k:"fixed",m:11,d:18}, len:2, sev:1,
        note:"Government and banks closed. Oman moves the days actually taken off most years, so treat this date as approximate." }
    ],

    "Tunisia": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Offices and banks go mornings-only, museums and sites close early, local cafes shut until sunset outside the tourist zones, supermarket alcohol sections close for the month and most bars go dark — then the medinas come alive after dark." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:3, sev:2, fuzzy:true,
        note:"Government and most businesses close for two to three days, the medina souks in Tunis, Sousse and Djerba largely shut for the first two, and intercity transport is jammed." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:3, sev:2, fuzzy:true,
        note:"The country genuinely stops — workplaces, banks and government shut, restaurants shutter or run skeleton menus, hotel kitchens close and shared taxis book out a week ahead." },
      { n:"Republic Day", r:{k:"fixed",m:7,d:25}, len:1, sev:1,
        note:"Banks, government and schools closed; museums, sites and shops open." }
    ],

    "Pakistan": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Restaurants and street stalls stay shut all day and open an hour or two before sunset. Eating, drinking or smoking in public during daylight is illegal and that applies to foreigners too — hotel restaurants and room service are the exception." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:3, sev:2, fuzzy:true,
        note:"Almost everything closes for three days — offices, banks, schools, most shops — and the whole country is travelling, so trains, buses and flights sell out well in advance." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:3, sev:2, fuzzy:true,
        note:"Most businesses shut for the first two days, and animals are sacrificed openly in the streets, which is confronting if you aren't expecting it." },
      { n:"Ashura", r:{k:"muharram",off:8}, len:2, sev:2, fuzzy:true,
        note:"Mobile phone and mobile internet services are switched off across dozens of districts including central Karachi and Lahore, procession routes are sealed to traffic and nearby markets close. Hotel wifi keeps working — your phone won't." },
      { n:"Independence Day", r:{k:"fixed",m:8,d:14}, len:1, sev:1,
        note:"Everything official closed plus major road closures in Islamabad and Lahore from a couple of days beforehand. You lose an afternoon to traffic rather than to shut shops." }
    ],

    "Uzbekistan": [
      { n:"Navruz", r:{k:"range",m1:3,d1:21,m2:3,d2:23}, len:0, sev:2,
        note:"The biggest holiday of the year — most businesses close on the 21st, restaurants and bazaars run short hours and the days either side are non-working. Carry cash and don't plan errands." },
      { n:"Ramazon Hayit (Eid al-Fitr)", r:{k:"eidfitr",off:0}, len:1, sev:1,
        note:"A one-day holiday — schools, banks and most businesses close and it's a family day at home, but cafes, hotels and the sights in Tashkent and Samarkand carry on. Uzbekistan fixes its holiday dates by decree months ahead, so these don't drift." },
      { n:"Qurbon Hayit (Eid al-Adha)", r:{k:"eidadha",off:0}, len:1, sev:1,
        note:"Officially one day, but extra non-working days get bolted on most years, so banks and offices can be shut for much of a week while shops and sights stay open." },
      { n:"Independence Day", r:{k:"fixed",m:9,d:1}, len:1, sev:1,
        note:"Offices and most businesses close and central Tashkent roads shut from late afternoon into the night; some roads close for weeks beforehand for rehearsals." }
    ],

    /* ---------------- ASIA & THE PACIFIC ---------------- */

    "Malaysia": [
      { n:"Hari Raya Aidilfitri", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true,
        note:"Muslim-owned restaurants and small shops shut for a day or two, but malls, chains and attractions stay open — cities go quiet rather than dead." },
      { n:"The balik kampung exodus", r:{k:"eidfitr",off:-3}, len:7, sev:0, fuzzy:true,
        note:"Bus terminals sell around seven times their normal ticket volume and the North-South Expressway jams for hours — don't plan intercity travel in this window." },
      { n:"Chinese New Year", r:{k:"cny",off:0}, len:3, sev:1,
        note:"Chinese-owned shops and hawker stalls close for three days to a week, so Chinatown areas empty out — malls and hotels carry on." }
    ],

    "China (SAR)": [
      { n:"Chinese New Year", r:{k:"cny",off:-1}, len:4, sev:1,
        note:"Family-run restaurants, wet markets and street markets close for one to three days, but malls, chains, convenience stores and attractions stay open — Hong Kong and Macau are genuinely milder than the mainland." },
      { n:"Golden Week (mainland visitors)", r:{k:"range",m1:10,d1:1,m2:10,d2:7}, len:0, sev:0,
        note:"Over a million mainland visitors arrive, hotels run above 90 per cent full and the popular districts sell out — book far ahead and expect queues at the Peak Tram, Disneyland and Ocean Park." },
      { n:"Labour Day week (mainland visitors)", r:{k:"range",m1:5,d1:1,m2:5,d2:5}, len:0, sev:0,
        note:"A second mainland travel wave — walkable, but shoulder to shoulder at the main sights." },
      { n:"Ching Ming (Tomb Sweeping)", r:{k:"qingming",off:0}, len:1, sev:0,
        note:"Nothing shuts, but cemetery-bound roads close and buses are mobbed — avoid Wo Hop Shek, Diamond Hill and the Shenzhen border crossings." }
    ],

    "Taiwan": [
      { n:"Chinese New Year", r:{k:"cny",off:-1}, len:6, sev:1,
        note:"Longer and deeper than Hong Kong's — Taipei and Kaohsiung feel like ghost towns and most restaurants, banks and small shops close from New Year's Eve through the third day. Convenience stores, Taipei 101 and the big night markets stay open." },
      { n:"Tomb Sweeping Day", r:{k:"qingming",off:0}, len:1, sev:0,
        note:"Shops stay open, but it's one of the year's big domestic travel weekends — book trains and hotels well ahead." }
    ],

    "Philippines": [
      { n:"Holy Week (Maundy Thursday and Good Friday)", r:{k:"easter",off:-3}, len:2, sev:2,
        note:"Most Metro Manila malls close outright both days, the LRT lines suspend service entirely from Thursday to Easter Sunday, and the city empties. Assume you cannot shop, and check your hotel is feeding you." },
      { n:"Holy Week exodus", r:{k:"easter",off:-6}, len:8, sev:0,
        note:"Ferries to Boracay and the islands sell out days ahead and domestic fares rise by up to half — pick one place and stay put." },
      { n:"Undas (All Saints' and All Souls')", r:{k:"range",m1:10,d1:30,m2:11,d2:2}, len:0, sev:0,
        note:"One of the country's three biggest annual migrations — bus terminals and airports are swamped and roads near cemeteries gridlock, but most malls stay open." }
    ],

    "Sri Lanka": [
      { n:"Sinhala and Tamil New Year", r:{k:"range",m1:4,d1:13,m2:4,d2:16}, len:0, sev:2,
        note:"The country genuinely shuts — shops shuttered, many restaurants closed, buses and trains on reduced services and liquor stores closed by government order. Hotels and tourist restaurants keep running, but the hill country is jammed with domestic holidaymakers straight afterwards." }
    ],

    "Cambodia": [
      { n:"Khmer New Year", r:{k:"range",m1:4,d1:13,m2:4,d2:16}, len:0, sev:2,
        note:"Phnom Penh empties as families head to the provinces, most attractions close, evening transport is very hard to find and whatever stays open runs on skeleton staff." }
    ],

    "Australia": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"A legally restricted trading day — shops and shopping centres are shut nationwide, with only cafes, restaurants, takeaways, chemists and petrol stations allowed to open. Some big-city zoos, aquariums and cinemas still trade." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:2,
        note:"The other full restricted trading day — retail closed, but restaurants, cafes and most attractions operate." },
      { n:"Anzac Day", r:{k:"fixed",m:4,d:25}, len:1, sev:1,
        note:"Retail is banned before 1pm across most of the country, and in New South Wales large shops must stay closed all day. Plan the morning around a dawn service, not shopping." },
      { n:"Summer holidays", r:{k:"range",m1:12,d1:20,m2:1,d2:25}, len:0, sev:0,
        note:"Coastal towns book out and prices spike as the whole country takes its summer break — reserve accommodation and hire cars months ahead." }
    ],

    "New Zealand": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"By law almost every shop must close — only dairies, petrol stations, pharmacies, takeaways, cafes, bars and souvenir shops can open. Queenstown, Nelson and Wanaka have partial tourist-area exemptions." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:2,
        note:"The same legal shutdown as Christmas Day — supermarkets and malls closed, cafes and bars open." },
      { n:"Easter Sunday", r:{k:"easter",off:0}, len:1, sev:2,
        note:"Also a legally restricted trading day, though councils can grant local exemptions — check the specific town rather than assuming." },
      { n:"Anzac Day morning", r:{k:"fixed",m:4,d:25}, len:1, sev:1,
        note:"Shops must stay shut until 1pm; bars and cafes can serve as normal." },
      { n:"Summer holidays", r:{k:"range",m1:12,d1:20,m2:1,d2:25}, len:0, sev:0,
        note:"Queenstown, Wanaka, the Bay of Islands, Coromandel, Rotorua and the glacier towns book out and prices climb — campervans and hotels need booking months ahead." }
    ],

    /* ---------------- AFRICA, THE CARIBBEAN & CENTRAL AMERICA ---------------- */

    "South Africa": [
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:2,
        note:"Most shops, banks and many museums shut, and by law no shop or bottle store may sell alcohol all day — licensed restaurants and hotels can still serve you a drink." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"Banks, offices and several big museums close and bottle stores are legally shut, so you cannot buy takeaway alcohol — restaurants may still pour." },
      { n:"Easter long weekend", r:{k:"easter",off:-2}, len:4, sev:0,
        note:"The whole country drives to the coast at once, the main highways jam solid with police roadblocks running, and coastal guesthouses are booked out months ahead." },
      { n:"Festive season", r:{k:"range",m1:12,d1:15,m2:1,d2:15}, len:0, sev:0,
        cities:["Cape Town","Knysna","Plettenberg Bay","Durban","Mossel Bay","Hermanus"],
        note:"Cape Town and the Garden Route sell out at 50 to 100 per cent above normal rates until mid-January, while inland cities go quiet as the building trade and many small businesses shut from mid-December." }
    ],

    "Kenya": [
      { n:"Christmas and Boxing Day", r:{k:"range",m1:12,d1:25,m2:12,d2:26}, len:0, sev:1,
        note:"Offices, banks and most shops shut for two days and Nairobi empties as people head to home villages; supermarkets, hotels and restaurants mostly stay open." },
      { n:"Festive season", r:{k:"range",m1:12,d1:18,m2:1,d2:5}, len:0, sev:0,
        note:"Beach hotels and Maasai Mara camps sell out and roughly double their rates, often with minimum stays and compulsory holiday dinner supplements. Long-distance buses book out and fares double or triple." },
      { n:"Ramadan (coast)", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        cities:["Mombasa","Lamu","Malindi"],
        note:"Most local eateries stay shut all day and only reopen after sunset, so daytime lunch shrinks to hotel and tourist restaurants. Don't eat or drink in the street." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true,
        note:"Banks and offices close nationwide, and on the coast most Muslim-owned shops and cafes shut for a day or two. Nairobi feels like an ordinary holiday with the malls open." }
    ],

    "Nigeria": [
      { n:"Eid al-Fitr (Small Sallah)", r:{k:"eidfitr",off:0}, len:4, sev:2, fuzzy:true,
        note:"Banks, offices and most shops shut for two days nationwide and the Muslim north effectively stops for three or four, with staff slow to return afterwards. Lagos and the south are much less affected." },
      { n:"Eid al-Adha (Big Sallah)", r:{k:"eidadha",off:0}, len:4, sev:2, fuzzy:true,
        note:"The bigger of the two Sallahs — every bank branch closed, the north shut down, and the roads out of Abuja, Kaduna and Kano jammed for hours with fares up by more than half." },
      { n:"Christmas and Boxing Day", r:{k:"range",m1:12,d1:25,m2:12,d2:26}, len:0, sev:1,
        note:"Banks, offices and the stock exchange close, though street markets and many small traders keep working." },
      { n:"Detty December", r:{k:"range",m1:12,d1:15,m2:1,d2:5}, len:0, sev:0,
        cities:["Lagos","Abuja"],
        note:"Bus parks are mobbed and fares to the south-east jump by a third, while diaspora crowds pour into Lagos — hotels sell out, transatlantic flights roughly double and city traffic seizes for hours." }
    ],

    "Cuba": [
      { n:"Day of the National Rebellion", r:{k:"range",m1:7,d1:25,m2:7,d2:27}, len:0, sev:2,
        note:"Cuba shuts down for three days in late July — state shops, banks, offices and most museums close and only hospitals, transport and tourism keep working. Stock up beforehand, and remember Cuba is overwhelmingly cash-based." },
      { n:"New Year and Victory Day", r:{k:"range",m1:12,d1:31,m2:1,d2:2}, len:0, sev:2,
        note:"New Year is family-only in Cuba — the 31st, the 1st and the 2nd are all official non-working days and on the 1st almost everything is shut." },
      { n:"May Day", r:{k:"fixed",m:5,d:1}, len:1, sev:2,
        note:"State businesses close, and in Havana dozens of central roads shut from 3am for the dawn parade at Plaza de la Revolucion — getting around that morning is close to impossible." },
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:1,
        note:"State shops, banks and offices close and transport thins, but Cuba is largely secular and the day is low-key." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"A paid national day off, so state offices, banks and shops close — the rest of Holy Week is a normal working week." },
      { n:"Independence Day (Grito de Yara)", r:{k:"fixed",m:10,d:10}, len:1, sev:1,
        note:"A full non-working day when most state-run shops, banks and offices close; tourism services keep running." }
    ],

    "Dominican Republic": [
      { n:"Semana Santa (Holy Week)", r:{k:"easter",off:-4}, len:5, sev:2,
        note:"The whole country shuts and heads for the coast — public offices stop on Holy Wednesday afternoon and don't reopen until the Monday after Easter, banks and most shops close on Good Friday, alcohol sales are banned nationwide for the whole of Good Friday, and hotels run full at peak prices." },
      { n:"Christmas Eve and Christmas Day", r:{k:"range",m1:12,d1:24,m2:12,d2:25}, len:0, sev:2,
        note:"Christmas Eve is the real event — shops, banks and supermarkets shut around 6pm on the 24th and stay closed on the 25th. Outside an all-inclusive resort, stock up beforehand." },
      { n:"New Year", r:{k:"range",m1:12,d1:31,m2:1,d2:1}, len:0, sev:1,
        note:"New Year's Eve is a huge night out, but the 1st is a fixed holiday — banks, offices and many shops and restaurants closed, and the day starts very late." },
      { n:"Christmas travel peak", r:{k:"range",m1:12,d1:18,m2:1,d2:5}, len:0, sev:0,
        note:"December is the busiest month of the Dominican year, with up to 43,000 tourists landing in a single day — flights and hotels sell out months ahead and the airports jam." }
    ],

    "Costa Rica": [
      { n:"Holy Thursday and Good Friday", r:{k:"easter",off:-3}, len:2, sev:2,
        note:"The country's closest thing to a full standstill — banks, government offices and many shops shut, supermarkets cut hours, and public buses run heavily reduced or not at all. Hotels, restaurants and the national parks stay open." },
      { n:"Semana Santa travel crush", r:{k:"easter",off:-7}, len:8, sev:0,
        note:"The whole country goes to the Pacific coast at once — hotels are booked months ahead, hire cars sell out by early March, and the drive from San Jose to the coast takes twice as long." },
      { n:"Christmas and New Year", r:{k:"range",m1:12,d1:24,m2:1,d2:1}, len:0, sev:1,
        note:"Banks close on the 25th, 31st and 1st, immigration and most government offices shut all week, many small shops and restaurants close, and the beach towns are fully booked at peak prices." }
    ],

    "Guatemala": [
      { n:"Semana Santa (Holy Week)", r:{k:"easter",off:-4}, len:5, sev:2,
        note:"Guatemala's biggest shutdown of the year — banks close from Thursday to Sunday and some all week, many shops and restaurants close from Wednesday through the Monday after, and the whole country is on the move. Get cash out and book buses and beds well ahead." },
      { n:"Holy Week crowds", r:{k:"easter",off:-7}, len:8, sev:0, cities:["Guatemala City"],
        note:"Antigua's population multiplies several times over, hotels are booked months ahead at two to four times normal rates and the historic centre is closed to cars for days — the carpets and processions are the reason to come, but don't plan to drive." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:25}, len:0, sev:2,
        note:"Businesses shut at midday on the 24th for the family dinner and midnight fireworks — the 24th is the real event, not the 25th — and on the 25th banks, offices and most businesses are closed." },
      { n:"New Year", r:{k:"range",m1:12,d1:31,m2:1,d2:1}, len:0, sev:2,
        note:"Shops and offices close at midday on the 31st ahead of nationwide midnight fireworks, and on the 1st banks and most businesses stay shut." },
      { n:"All Saints' Day", r:{k:"fixed",m:11,d:1}, len:1, sev:1,
        note:"Banks and offices close and families spend the day in cemeteries; the giant-kite festivals at Sumpango and Santiago Sacatepequez draw huge crowds and jam the roads, so arrive early or don't drive." }
    ]
  };

  /* Spellings that vary between data files. */
  var ALIAS = {
    "Türkiye": "Turkey",
    "Turkiye": "Turkey",
    "United Arab Emirates": "UAE",
    "USA": "United States",
    "US": "United States",
    "UK": "United Kingdom",
    "Great Britain": "United Kingdom",
    "Korea, South": "South Korea",
    "Republic of Korea": "South Korea",
    "Viet Nam": "Vietnam",
    "Holland": "Netherlands"
  };

  function normCity(s) {
    return String(s || "").trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* ---------------------------------------------------------------
     PUBLIC API

       NRA_HOLIDAYS.find(country, city, startISO, endISO)

     Returns holidays overlapping that date range, worst first:
       [{ name, start, end, sev, note, fuzzy, days }]

     endISO may be omitted — a single date is treated as a one-day trip.
     --------------------------------------------------------------- */

  function find(country, city, startISO, endISO) {
    if (!startISO) return [];
    var key = ALIAS[country] || country;
    var list = HOLIDAYS[key];
    if (!list) return [];

    var from = parse(startISO);
    var to = endISO ? parse(endISO) : from;
    if (isNaN(from) || isNaN(to)) return [];
    if (to < from) { var t = from; from = to; to = t; }

    var wantCity = normCity(city);
    var y0 = new Date(from).getUTCFullYear();
    var y1 = new Date(to).getUTCFullYear();
    var hits = [];

    list.forEach(function (h) {
      /* City-specific entries only fire for their own cities. */
      if (h.cities) {
        var match = h.cities.some(function (c) { return normCity(c) === wantCity; });
        if (!match) return;
      }
      /* Look a year either side so seasons that cross New Year work. */
      for (var y = y0 - 1; y <= y1 + 1; y++) {
        starts(h.r, y).forEach(function (s) {
          var days = lengthOf(h, y, s);
          var e = addDays(s, days - 1);
          /* Moon-sighted dates can slip a day in either direction. */
          var pad = h.fuzzy ? DAY : 0;
          if (e + pad < from || s - pad > to) return;
          if (hits.some(function (x) { return x.name === h.n && x.start === iso(s); })) return;
          hits.push({
            name: h.n, start: iso(s), end: iso(e), days: days,
            sev: h.sev, note: h.note, fuzzy: !!h.fuzzy
          });
        });
      }
    });

    /* Worst first, then earliest. */
    hits.sort(function (a, b) {
      return (b.sev - a.sev) || (a.start < b.start ? -1 : 1);
    });
    return hits;
  }

  /* True if we have any data for this country at all — lets callers
     tell "nothing is happening" apart from "we haven't researched
     this country yet". */
  function covers(country) {
    return !!HOLIDAYS[ALIAS[country] || country];
  }

  window.NRA_HOLIDAYS = {
    find: find,
    covers: covers,
    countries: function () { return Object.keys(HOLIDAYS); },
    /* exposed for testing */
    _easter: easter,
    _orthEaster: orthEaster,
    _iso: iso
  };
})();
