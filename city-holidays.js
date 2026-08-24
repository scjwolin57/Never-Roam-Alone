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

  /* 18 Safar — Senegal's Grand Magal de Touba. Arbaeen in Iraq is 20
     Safar, i.e. this + 2. Same Umm al-Qura source as the tables above. */
  var SAFAR18 = {
    2026:["08-01"],2027:["07-22"],2028:["07-11"],2029:["06-30"],2030:["06-19"],
    2031:["06-08"],2032:["05-27"],2033:["05-17"],2034:["05-07"],2035:["04-26"],
    2036:["04-15"],2037:["04-04"],2038:["03-24"],2039:["03-13"],2040:["03-02"]
  };

  /* ⚠ NEPAL — SHORT TABLES ON PURPOSE, AND THEY NEED REFRESHING.
     Dashain and Tihar are set by the Nepal Panchanga Nirnayak Samiti one
     Bikram Sambat year at a time, and the Nepali almanac publishers carry
     festival data no further than BS 2086 (about 2029). Anything claiming
     to know these dates out to 2040 is guessing — Drik Panchang will
     happily produce them and is demonstrably wrong for Nepal (it missed
     Vijaya Dashami 2024 by a day). 2029 is genuinely disputed between
     sources, so it is left out.

     >>> RE-RUN THIS RESEARCH EACH SPRING and add the next year. <<<
     Until then Nepal simply gets no banner after 2028, which is correct. */
  var DASHAIN = { 2026:"10-21", 2027:"10-10", 2028:"09-28" };
  var TIHAR   = { 2026:"11-08", 2027:"10-29", 2028:"10-17" };

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
       lastwd    {wd}                  last weekday wd of every month
                                       (Rwanda's Umuganda morning)
       nowruz    {off}                 from Persian New Year
       muharram  {off}                 from 1 Muharram (Ashura = off 9)
       safar     {off}                 from 18 Safar (Arbaeen = off 2)
       qingming  {off}                 from Tomb Sweeping Day
       dashain   {off}                 from Vijaya Dashami (Nepal)
       tihar     {off}                 from Laxmi Puja (Nepal)
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
    if (k === "dashain") return tableStarts(DASHAIN, y, rule.off);
    if (k === "tihar") return tableStarts(TIHAR, y, rule.off);
    if (k === "safar") {
      if (!SAFAR18[y]) return [];
      return SAFAR18[y].map(function (s) { return addDays(md(y, s), rule.off || 0); });
    }
    if (k === "lastwd") {  /* the last given weekday of every month */
      out = [];
      for (i = 1; i <= 12; i++) {
        var last = new Date(Date.UTC(y, i, 0));            /* last day of month i */
        var back = (last.getUTCDay() - rule.wd + 7) % 7;
        out.push(addDays(last.getTime(), -back));
      }
      return out;
    }
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
      { n:"Arbaeen pilgrimage", r:{k:"safar",off:-5}, len:14, sev:2, fuzzy:true,
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
    ],

    /* ============ BATCH 3 — added 2026-08-19 ============ */

    /* ---------------- EUROPE: BALKANS, BALTICS, MICRO-STATES ---------------- */

    "Bulgaria": [
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:1,
        note:"Most of Sofia's museums shut for two or three days and banks close, though supermarkets and many restaurants keep trading on shorter hours." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:1,
        note:"Essentially every museum in Sofia is closed — treat it as a walking-and-eating day." },
      { n:"Orthodox Easter weekend", r:{k:"oeaster",off:-2}, len:4, sev:0,
        note:"Sofia empties as locals leave the city and some shops stay shut from Friday, but museums, restaurants and transport keep running. Note Bulgarian Easter often falls weeks after the Western one." }
    ],

    "Serbia": [
      { n:"Orthodox Christmas", r:{k:"fixed",m:1,d:7}, len:1, sev:1,
        note:"Every supermarket and mall is shut on the 7th and closes at 6pm on the 6th; kafanas and restaurants stay open." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:1,
        note:"Supermarkets and banks closed, and shops shut at 6pm on New Year's Eve. The 2nd is a holiday on paper but shops reopen." },
      { n:"Orthodox Easter", r:{k:"oeaster",off:0}, len:1, sev:1,
        note:"Malls, every supermarket chain and most green markets close on Easter Sunday, and banks are shut from Good Friday through Easter Monday." }
    ],

    "Montenegro": [
      /* Montenegro's trade law bans retail on state holidays outright and
         inspectors physically close offending shops, so these are unusually
         hard closures for the region. Two of them land in peak beach season. */
      { n:"Shops closed by law — public holiday",
        r:{k:"fixedset",days:[[1,1],[1,2],[1,6],[1,7],[1,8],[5,1],[5,2],[5,21],[5,22],[7,13],[7,14],[11,13],[11,14]]},
        len:1, sev:1,
        note:"Shops and supermarkets are shut by law and inspectors enforce it — bakeries, pharmacies, petrol stations, green markets and restaurants stay open, so stock up the day before." },
      { n:"Shops closed by law — Orthodox Easter", r:{k:"oeaster",off:-2}, len:1, sev:1,
        note:"Good Friday: shops and supermarkets shut by law. Bakeries, pharmacies, petrol stations and restaurants stay open." },
      { n:"Shops closed by law — Orthodox Easter", r:{k:"oeaster",off:0}, len:2, sev:1,
        note:"Easter Sunday and Monday: shops and supermarkets shut by law. Bakeries, pharmacies, petrol stations and restaurants stay open." }
    ],

    "Slovakia": [
      /* Slovakia cut its retail-closure list from ~15 days to 5 in Nov 2025 —
         do NOT trust any pre-2026 list of these. Easter Monday is now open. */
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Every shop and supermarket is shut by law from midday on Christmas Eve until the 27th — buy food before lunchtime on the 24th." },
      { n:"New Year's Day", r:{k:"fixed",m:1,d:1}, len:1, sev:2,
        note:"Shops are legally shut all day; only petrol stations, pharmacies and station kiosks open." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"Shops are legally shut; restaurants and sights generally still open." },
      { n:"Easter Sunday", r:{k:"easter",off:0}, len:1, sev:1,
        note:"Shops are legally shut again. Easter Monday is normal and shops may open." }
    ],

    "Estonia": [
      { n:"Midsummer (Jaanipaev)", r:{k:"range",m1:6,d1:23,m2:6,d2:24}, len:0, sev:1,
        note:"Tallinn goes quiet and most small shops, museums and restaurants shut for both days — head out to a bonfire event or take a day trip." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:1,
        note:"Shops shut mid-afternoon on the 24th and mostly stay shut through the 26th." }
    ],

    "Iceland": [
      /* Iceland closes harder over Easter than anywhere else in this dataset. */
      { n:"Easter (Maundy Thursday to Easter Monday)", r:{k:"easter",off:-3}, len:5, sev:2,
        note:"Good Friday is the quietest day of the Icelandic year — most shops, bars and many museums shut all day, and Maundy Thursday and Easter Sunday are nearly as closed. Stock up by Wednesday evening; the Saturday in between is your shopping window." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Everything shuts by mid-afternoon on the 24th and the 25th is a total shutdown, with the 26th only half awake. Have food in the fridge before Christmas Eve and book any restaurant well ahead." },
      { n:"New Year", r:{k:"range",m1:12,d1:31,m2:1,d2:1}, len:0, sev:2,
        note:"Shops shut early on New Year's Eve and stay shut on the 1st — buy food and drink by the 30th." },
      { n:"Commerce Day weekend", r:{k:"nth",m:8,wd:1,n:1,off:-3}, len:4, sev:0,
        note:"The whole country is at a festival somewhere — book ferries, flights, campsites and rooms weeks ahead, especially for the Westman Islands. Reykjavik is actually quieter than usual." }
    ],

    "Cyprus": [
      { n:"Orthodox Easter", r:{k:"oeaster",off:-2}, len:4, sev:2,
        note:"Shops and supermarkets shut completely on Easter Sunday and Monday and museums close on the Sunday — buy food by Saturday evening and book any Easter meal well ahead. Cypriot Easter often falls weeks after the Western one." },
      { n:"Green Monday", r:{k:"oeaster",off:-48}, len:1, sev:1,
        note:"Shops close and everyone is outdoors picnicking and kite-flying — join them rather than planning a shopping or city day." },
      { n:"Assumption", r:{k:"fixed",m:8,d:15}, len:1, sev:1,
        note:"Businesses close and the roads and coast are packed with local holidaymakers — book accommodation and car hire early." },
      { n:"Christmas", r:{k:"range",m1:12,d1:25,m2:12,d2:26}, len:0, sev:1,
        note:"Shops shut on the 25th and 26th and buses thin out; tourist-area restaurants stay open." }
    ],

    "Malta": [
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:2,
        note:"Malta's licensing law lets shops trade on every public holiday except this one — everything retail is shut, along with casinos and many restaurants. Buy food the day before and go and watch a village procession." },
      { n:"Santa Marija (Assumption)", r:{k:"fixed",m:8,d:15}, len:1, sev:1,
        note:"Shops and many attractions close, and seven towns hold huge fireworks festas the same night — expect road closures and fireworks from early morning." },
      { n:"Carnival", r:{k:"easter",off:-49}, len:5, sev:0,
        note:"Valletta and Floriana streets close for the parades and the Gozo ferry gets mobbed for the Nadur night carnival — leave the car and allow extra time." },
      /* The village festa season runs all summer, one village per weekend —
         real, but it only matters if it's YOUR village, so warning on a third
         of the year would just be noise. The Assumption entry above covers
         the biggest festa night of the year. */
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:1,
        note:"Museums and shops close and the buses stop running entirely between noon and 3pm, so don't plan to move around midday." }
    ],

    "Monaco": [
      /* The Grand Prix moved from late May to June under the 2026-2031 F1
         contract. Do not "correct" this back to May. */
      { n:"Monaco Grand Prix", r:{k:"nth",m:6,wd:6,n:1,off:-2}, len:4, sev:1,
        note:"If you're not here for the race, don't come — the Palace, Oceanographic Museum and Casino all close during the day, half the streets are fenced off from 5am, and any room costs a fortune." },
      /* The circuit build-up genuinely runs Feb to July, but a banner on 40%
         of the year is the noise problem this file exists to avoid, so it's
         left out. The Grand Prix entry above covers what actually matters. */
    ],

    "Andorra": [
      { n:"Shops closed", r:{k:"fixedset",days:[[1,1],[3,14],[9,8],[12,25]]}, len:1, sev:1,
        note:"Andorra's shops trade every other day of the year, but on these four they shut — if you've come for the duty-free, don't arrive on one of them." },
      { n:"Ski-season gridlock", r:{k:"range",m1:12,d1:26,m2:1,d2:6}, len:0, sev:0,
        note:"The single road through Andorra la Vella jams solid and the Spanish border backs up for kilometres — budget an extra hour or two each way and avoid leaving between 2pm and 8pm." }
    ],

    "Gibraltar": [
      { n:"Gibraltar National Day", r:{k:"fixed",m:9,d:10}, len:1, sev:1,
        note:"Almost every shop on Main Street shuts and the town centre becomes a red-and-white street party until the evening fireworks — Rock tours, the caves and the bars carry on, but the tax-free shopping is off." }
    ],

    "Vatican": [
      { n:"Vatican Museums closed", r:{k:"fixedset",days:[[1,1],[1,6],[2,11],[3,19],[5,1],[6,29],[8,14],[8,15],[11,1],[12,8],[12,25],[12,26]]},
        len:1, sev:2,
        note:"The Vatican Museums and Sistine Chapel are completely closed — only St Peter's Basilica is open, so don't build a Vatican day around this date." },
      { n:"Vatican Museums closed", r:{k:"easter",off:1}, len:1, sev:2,
        note:"Easter Monday: the Museums and Sistine Chapel are closed. St Peter's Basilica is open." },
      { n:"Holy Week at St Peter's", r:{k:"easter",off:-7}, len:8, sev:0,
        note:"The basilica and square are given over to services — sightseers are turned away during liturgies, and on Easter Sunday you can't get in until after the morning Mass." }
    ],

    "San Marino": [
      { n:"Feast of St Marinus", r:{k:"fixed",m:9,d:3}, len:1, sev:1,
        note:"Offices and most local businesses close and the walled old town fills up — cars are kept out and the car parks fill early, so take the cable car up from Borgo Maggiore." }
    ],

    "Albania": [
      { n:"Summer Day", r:{k:"fixed",m:3,d:14}, len:1, sev:0, cities:["Elbasan"],
        note:"Elbasan is swamped by visitors from all over Albania and runs a special traffic plan — expect road closures, crowds and no rooms. Barely noticeable in Tirana." }
    ],

    "Belarus": [
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:1,
        note:"Clothing and gift shops in Minsk are shut on the 1st and supermarkets only open late morning to early evening — buy anything you need on the 31st." },
      { n:"Radunitsa (Commemoration Day)", r:{k:"oeaster",off:9}, len:1, sev:1,
        note:"Nine days after Orthodox Easter, offices and many businesses close and the whole country goes to the cemeteries — expect a very quiet city and packed suburban buses." }
    ],

    /* ---------------- CAUCASUS & CENTRAL ASIA ---------------- */

    "Georgia": [
      { n:"New Year and Bedoba", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:2,
        note:"Georgia's biggest holiday — banks, government and most neighbourhood shops and restaurants shut, the streets are empty and supermarkets run short hours." },
      { n:"The January shutdown", r:{k:"range",m1:1,d1:3,m2:1,d2:10}, len:0, sev:1,
        note:"Almost nothing official reopens until around the 10th — banks, paperwork offices and many small businesses stay shut, though tourist restaurants, taxis and ATMs are fine." },
      { n:"Orthodox Christmas", r:{k:"fixed",m:1,d:7}, len:1, sev:1,
        note:"Banks, offices and many small shops close and there's a midnight church procession, but transport runs and most city restaurants stay open." },
      { n:"Orthodox Easter", r:{k:"oeaster",off:-2}, len:4, sev:1,
        note:"Four days of closed banks and government with many family-run places shut; on Easter Monday half the country is at the cemeteries having graveside picnics." }
    ],

    "Armenia": [
      /* The Armenian Apostolic Church went Gregorian in 1923, so Armenian
         Easter is the WESTERN date — not the Orthodox one. Christmas is
         Jan 6, not Dec 25. Don't "fix" either of these. */
      { n:"New Year and Armenian Christmas", r:{k:"range",m1:1,d1:1,m2:1,d2:6}, len:0, sev:2,
        note:"Armenia effectively shuts from New Year's Day through Christmas on the 6th — banks, offices, most shops and many restaurants closed, and buses on a thin schedule." },
      { n:"Genocide Remembrance Day", r:{k:"fixed",m:4,d:24}, len:1, sev:1,
        note:"A national day of mourning — schools and most businesses close, hundreds of thousands march to the Tsitsernakaberd memorial and nightlife stops. Dress plainly and keep it quiet." },
      { n:"Vardavar", r:{k:"easter",off:98}, len:1, sev:0,
        note:"Everything's open, but anyone on the street in Yerevan gets soaked with buckets and water guns all day — bag your phone or stay indoors." }
    ],

    "Azerbaijan": [
      { n:"Novruz", r:{k:"range",m1:3,d1:20,m2:3,d2:24}, len:0, sev:2,
        note:"Baku basically closes for a week — a great many shops and restaurants shut and locals leave the city, so sort out food and transport ahead and don't count on anything being open." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1,
        note:"Government offices, banks and schools close for two days; shops and restaurants mostly carry on, as Azerbaijan is very secular. Dates here are fixed by decree in advance, so they don't drift." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:2, sev:1,
        note:"Two days of closed banks and offices, but everyday city life and sightseeing continue much as normal." }
    ],

    "Kazakhstan": [
      { n:"Nauryz", r:{k:"range",m1:3,d1:21,m2:3,d2:23}, len:0, sev:1,
        note:"Schools, offices, banks and most businesses close for three days and buses thin out — the upside is big free street festivals and yurt villages in Almaty and Astana." },
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:1,
        note:"Both days are official non-working days — banks and offices shut and the city starts very late on the 1st." }
    ],

    "Kuwait": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:1, fuzzy:true,
        note:"It is illegal — including for non-Muslim visitors — to eat, drink or smoke in public between dawn and sunset, and you can be fined or jailed for it. Most restaurants close all day and the whole city shifts to eating and shopping at night." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:4, sev:1, fuzzy:true,
        note:"Government offices, museums and most businesses close, and on the first morning almost nothing is open — malls and restaurants come back later in the day with long evening hours." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-1}, len:5, sev:1, fuzzy:true,
        note:"Four to six days of closed offices and sights, with much of the population travelling abroad." },
      { n:"National and Liberation Days", r:{k:"range",m1:2,d1:25,m2:2,d2:26}, len:0, sev:1,
        note:"Banks and government close and central Kuwait City gridlocks — the Gulf Road and Salmiya get road closures and huge crowds from early afternoon, so don't plan to drive." }
    ],

    "Maldives": [
      /* The resort/local-island split is the whole story here — on a private
         resort island none of this applies. */
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:1, fuzzy:true,
        cities:["Male","Malé","Hulhumale","Hulhumalé"],
        note:"On Male and the inhabited local islands, cafes and restaurants are shut all day until sunset and eating or drinking in public in daylight is not allowed — guesthouses will still feed you indoors. If you're staying at a resort you won't notice a thing." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:3, sev:1, fuzzy:true,
        cities:["Male","Malé","Hulhumale","Hulhumalé"],
        note:"Shops in Male close and ferries run reduced schedules and fill up with families heading home to the atolls — don't rely on ferries or shopping. Resorts are unaffected." }
    ],

    /* ---------------- SOUTH & SOUTH-EAST ASIA ---------------- */

    "Bangladesh": [
      /* Bangladesh declares SEVEN-day government holidays for both Eids —
         materially longer than India or Pakistan. */
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:-3}, len:10, sev:2, fuzzy:true,
        note:"Don't try to move around Bangladesh for about a week either side of Eid — over ten million people leave Dhaka, buses, trains and ferries sell out days ahead, and most shops and restaurants stay shut for several days afterwards." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:-3}, len:10, sev:2, fuzzy:true,
        note:"The same week-long shutdown and exodus as the other Eid, plus street-side animal slaughter and blocked lanes in the cities on the first day." },
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Small local restaurants and tea stalls close during daylight and many sights shut early — eat at your hotel, or after sunset." },
      { n:"Pohela Boishakh (Bengali New Year)", r:{k:"fixed",m:4,d:14}, len:1, sev:1,
        note:"Banks and offices shut and central Dhaka closes to traffic for the morning parade — go and watch it, but don't plan to get anywhere by car." }
    ],

    "Nepal": [
      /* ⚠ These two only have data for 2026-2028. See the table note above. */
      { n:"Dashain", r:{k:"dashain",off:-4}, len:9, sev:2,
        note:"Nepal's biggest festival — for about a week around the tika day, Kathmandu's restaurants and shops shut, buses and domestic flights are sold out or not running, and permit counters close. Stay put in one place and carry cash. The upside: the heritage sites are gloriously empty." },
      { n:"Tihar", r:{k:"tihar",off:0}, len:4, sev:1,
        note:"Much easier to travel in than Dashain — most businesses stay open, with closures and packed transport mainly on Laxmi Puja and Bhai Tika, plus firecrackers all night." }
    ],

    "Laos": [
      { n:"Pi Mai (Lao New Year)", r:{k:"range",m1:4,d1:13,m2:4,d2:19}, len:0, sev:2,
        note:"Most shops, restaurants and offices close for up to a week, streets shut for water fights so you will get soaked, and hotels and buses sell out months ahead. Book early, carry cash — ATMs run dry — and waterproof your bag." }
    ],

    /* ---------------- AFRICA ---------------- */

    "Tanzania": [
      { n:"Ramadan (Zanzibar)", r:{k:"ramadan",off:0}, len:"month", sev:1, fuzzy:true,
        cities:["Zanzibar City","Stone Town","Zanzibar","Nungwi","Paje","Pemba"],
        note:"On Zanzibar all restaurants, bars and food outlets outside hotel grounds are ordered shut during daylight and reopen after sunset — eat, drink and smoke inside your hotel and cover up in town. Clubs and live music stay shut all month. The mainland is unaffected." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true,
        note:"Shops, banks and offices close for two days and Stone Town fills with celebrating families — expect packed Dar es Salaam to Zanzibar ferries." },
      { n:"Festive season", r:{k:"range",m1:12,d1:20,m2:1,d2:5}, len:0, sev:0,
        cities:["Zanzibar City","Stone Town","Zanzibar","Nungwi","Paje","Pemba","Arusha"],
        note:"Book six to eight months out — the best Zanzibar resorts are full by October and New Year rates double or triple." },
      /* Gated to the safari gateway towns: this is a Serengeti problem, and
         firing it for Zanzibar put a banner on half the year there. */
      { n:"Great Migration high season", r:{k:"range",m1:7,d1:1,m2:9,d2:15}, len:0, sev:0,
        cities:["Arusha","Moshi"],
        note:"Camps near the Mara River crossings sell out up to a year ahead, and you'll share every sighting with a queue of vehicles." }
    ],

    "Mozambique": [
      { n:"Independence Day", r:{k:"fixed",m:6,d:25}, len:1, sev:1,
        note:"Shops, schools and offices close, but restaurants and tourist areas keep running — a lost shopping day rather than a lost day." },
      { n:"Festive season", r:{k:"range",m1:12,d1:15,m2:1,d2:5}, len:0, sev:0,
        note:"South African families drive up for the holidays, so beach lodges on the Inhambane coast and around Vilanculos are booked out months ahead at higher prices." }
    ],

    "Algeria": [
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:1, fuzzy:true,
        note:"Most restaurants are shut all day and reopen at sunset — eat in your hotel and expect the city to come alive at night, with some museums open late. Eating in public in daylight isn't illegal here, just badly received." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:2, fuzzy:true,
        note:"Two full days when almost everything closes — shops, offices and most restaurants." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:2, sev:2, fuzzy:true,
        note:"Two days when schools, shops and most businesses close and the cities go quiet." },
      { n:"Yennayer (Amazigh New Year)", r:{k:"fixed",m:1,d:12}, len:1, sev:1,
        note:"A paid day off for both public and private sector, so banks and offices close — do your banking before the 12th." }
    ],

    "Ghana": [
      { n:"Good Friday and Easter Monday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"Banks, government offices and many businesses close; shops and transport mostly run shortened hours." },
      { n:"Kwahu Easter Festival", r:{k:"easter",off:-2}, len:4, sev:0,
        note:"Half of Accra drives up to the Kwahu hills for this — hotels there are booked months ahead and the climb from Nkawkaw can take three hours instead of twenty minutes." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:1, sev:1, fuzzy:true,
        note:"A national day off — banks and offices close and the Muslim neighbourhoods are given over to prayers and feasting." },
      { n:"Detty December", r:{k:"range",m1:12,d1:15,m2:1,d2:2}, len:0, sev:0,
        cities:["Accra","Kumasi","Cape Coast"],
        note:"Accra is mobbed by the diaspora — hotels sell out by September and some re-list rooms at four times the price, flights from the US double, and the traffic is gridlocked." }
    ],

    "Ethiopia": [
      /* Ethiopia runs its own calendar. Genna is fixed at Jan 7, but Timkat,
         Enkutatash and Meskel shift a day around Gregorian leap years, so
         they are entered as two-day ranges that cover both possibilities.
         Fasika follows the Orthodox computus. */
      { n:"Genna (Ethiopian Christmas)", r:{k:"fixed",m:1,d:7}, len:1, sev:2,
        note:"A national holiday when most businesses close, and Lalibela draws hundreds of thousands of pilgrims — book accommodation there months ahead or stay away." },
      { n:"Timkat (Epiphany)", r:{k:"range",m1:1,d1:18,m2:1,d2:20}, len:0, sev:1,
        note:"Ethiopia's biggest street festival — offices close, processions block the roads, and hotels in Gondar and Lalibela are full and expensive months ahead. The exact day shifts between the 19th and 20th depending on the year." },
      { n:"Fasika (Ethiopian Easter)", r:{k:"oeaster",off:-2}, len:3, sev:2,
        note:"Most businesses close and the whole country breaks a 55-day fast — Good Friday is sombre and shut, Easter Sunday is a feast." },
      { n:"Enkutatash (Ethiopian New Year)", r:{k:"range",m1:9,d1:11,m2:9,d2:12}, len:0, sev:1,
        note:"Schools, offices and most shops close for New Year's Day — a family-and-flowers holiday rather than a tourist crush." },
      { n:"Meskel", r:{k:"range",m1:9,d1:26,m2:9,d2:28}, len:0, sev:1,
        note:"A public holiday with a huge bonfire ceremony — police close the main roads into Meskel Square in Addis from mid-morning, so don't plan an airport run that afternoon." },
      /* The 55-day Great Lent fast is a food-availability fact, not an event —
         it lives in the standing rules below and shows on the city page
         instead, rather than putting a banner on two months of the year. */
    ],

    "Senegal": [
      { n:"Grand Magal de Touba", r:{k:"safar",off:-2}, len:4, sev:2, fuzzy:true,
        note:"Dakar genuinely empties — shops shuttered, buses gone and transport prices spiking as millions head to Touba. Don't plan anything that needs a shop or a bus, and note the city stays empty into the following day." },
      { n:"Tabaski (Eid al-Adha)", r:{k:"eidadha",off:-6}, len:8, sev:2, fuzzy:true,
        note:"Senegal's biggest holiday — schools and most businesses close, and for the week beforehand Dakar's markets, roads and buses are so overloaded that people give up and walk." },
      { n:"Korite (Eid al-Fitr)", r:{k:"eidfitr",off:0}, len:1, sev:1, fuzzy:true,
        note:"A public holiday — schools and most businesses close for family celebrations." },
      { n:"Ramadan", r:{k:"ramadan",off:0}, len:"month", sev:0, fuzzy:true,
        note:"Cafes and restaurants stay open but many cut afternoon hours or close for the month, so call ahead — and stay off the roads in the hour before sunset. There's no rule against eating in public here." }
    ],

    "Rwanda": [
      { n:"Kwibuka (genocide memorial week)", r:{k:"range",m1:4,d1:7,m2:4,d2:13}, len:0, sev:1,
        note:"From 7 April Rwanda mourns: on the 7th most businesses only open after midday, and for the whole week music in bars and public places, nightclubs, concerts, weddings and sports screenings are all suspended. Hotels, restaurants, parks and gorilla permits operate normally — plan a quiet, respectful week." },
      { n:"Umuganda (community work morning)", r:{k:"lastwd",wd:6}, len:1, sev:1,
        note:"On the last Saturday morning of every month shops close, public transport stops and the roads shut to private cars until 11am — don't schedule a transfer, an airport run or a border crossing then. Visitors are welcome to join in." }
    ],

    /* ---------------- THE AMERICAS & CARIBBEAN ---------------- */

    "Puerto Rico": [
      { n:"Three Kings Day", r:{k:"fixed",m:1,d:6}, len:1, sev:2,
        note:"Bigger than Christmas Day for many families — most businesses close, so stock up on the 5th and expect only tourist-area places open." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:2,
        note:"Government, banks, schools and most shops and restaurants close; a few Old San Juan spots run limited hours." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:25}, len:0, sev:2,
        note:"Most businesses shut on the 25th and things wind down from Christmas Eve evening; the beaches and a few restaurants stay open." },
      { n:"Semana Santa beach rush", r:{k:"easter",off:-3}, len:4, sev:0,
        note:"The island's busiest travel week — the beaches are packed and the Culebra and Vieques ferries sell out, so book ferries and rooms well ahead." },
      { n:"Fiestas de la Calle San Sebastian", r:{k:"nth",m:1,wd:4,n:3}, len:4, sev:0,
        cities:["San Juan"],
        note:"Old San Juan becomes one enormous street party — over a million visitors across four days, roads closed, no parking and hotel rates at their yearly peak. Go for it or stay out of the old city entirely." }
    ],

    "Jamaica": [
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:2,
        note:"Widely treated as the holiest day of the year — shops, banks, offices and most restaurants close, though the resorts and big attractions keep running." },
      { n:"Christmas and Boxing Day", r:{k:"range",m1:12,d1:25,m2:12,d2:26}, len:0, sev:2,
        note:"Local shops, banks and offices close for both days; resorts and tourist restaurants keep serving." },
      { n:"Christmas and New Year peak", r:{k:"range",m1:12,d1:18,m2:1,d2:3}, len:0, sev:0,
        note:"The absolute peak of the season — all-inclusive rates can double and rooms and flights sell out months ahead, so don't try to book late." },
      { n:"Jamaica Carnival", r:{k:"easter",off:1}, len:7, sev:0, cities:["Kingston"],
        note:"Kingston hotels sell out months in advance and the central roads are given over to the parade — book very early or skip Kingston that week." }
    ],

    "Bahamas": [
      { n:"Junkanoo", r:{k:"fixedset",days:[[12,26],[1,1]]}, len:1, sev:1,
        cities:["Nassau","Freeport"],
        note:"Bay Street closes for a parade starting around 2am — taxis can't get near the route, so walk in. Government, banks and local shops are shut for the holiday itself." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"Government, banks, schools and most local businesses close; resorts, tourist restaurants and attractions stay open." },
      { n:"Christmas Day", r:{k:"fixed",m:12,d:25}, len:1, sev:1,
        note:"Almost all local businesses close, but resort and tourist-area restaurants stay open." }
    ],

    "Ecuador": [
      { n:"Carnaval", r:{k:"easter",off:-50}, len:4, sev:2,
        note:"A mandatory national shutdown for public and private business, intercity buses sell out days ahead, and you WILL be soaked with water balloons and spray foam in the street. Pack accordingly and book transport early." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:2,
        note:"Most shops and businesses close, and Quito's historic centre is impassable for the Jesus del Gran Poder procession, which draws well over a hundred thousand people from midday." },
      { n:"Day of the Dead and Cuenca's independence", r:{k:"range",m1:11,d1:2,m2:11,d2:3}, len:0, sev:1,
        note:"Banks, offices and many businesses close and the whole country is on the move — Cuenca in particular is booked out for its three-day festival." },
      { n:"New Year (Ano Viejo)", r:{k:"range",m1:12,d1:31,m2:1,d2:1}, len:0, sev:1,
        note:"From midday on the 31st the streets fill with effigy bonfires and costumed 'widows' collecting tolls from drivers, and everything is closed on the 1st." },
      { n:"Fiestas de Quito", r:{k:"range",m1:11,d1:29,m2:12,d2:6}, len:0, sev:0, cities:["Quito"],
        note:"Quito is one long street party in the week to 6 December, with business at a near standstill on the 5th and hotels booked out." }
    ],

    "Bolivia": [
      /* Día del Peatón is the single most likely thing here to strand a
         traveller — a genuine nationwide ban on motor traffic. */
      { n:"Dia del Peaton (Pedestrian Day)", r:{k:"nth",m:9,wd:0,n:1}, len:1, sev:2,
        note:"All motor traffic is banned for the day — no taxis, no buses, no airport transfers without a permit, and La Paz's bus terminal suspends services. Alcohol sales stop too. Do not schedule any travel on this date." },
      { n:"Carnaval", r:{k:"easter",off:-50}, len:4, sev:2,
        note:"Public and private activity is legally suspended nationwide and bus terminals close for the ch'alla blessings — expect to be soaked with water balloons. Oruro's parade sells out hotels and seating months ahead." },
      { n:"Good Friday", r:{k:"easter",off:-2}, len:1, sev:1,
        note:"A total 24-hour alcohol ban and city-centre streets cut for processions in La Paz and El Alto — plan around road closures rather than a full shutdown." },
      { n:"Todos Santos", r:{k:"fixed",m:11,d:2}, len:1, sev:1,
        note:"Banks, government and most private businesses close, and the cemeteries are packed with families until midday." }
    ],

    "Panama": [
      { n:"Carnaval", r:{k:"easter",off:-51}, len:5, sev:2,
        note:"The biggest holiday of the year — public offices and most private business shut for close to a week, Panama City's coastal road closes for days of parades, and Las Tablas and Chitre are overrun." },
      { n:"Good Friday", r:{k:"easter",off:-3}, len:2, sev:2,
        note:"Good Friday is a legal day of national mourning — no work, and a full 24-hour alcohol ban that stops bars, clubs, hotel bars and supermarket liquor sections from selling. Music and parties are banned too." },
      { n:"Fiestas Patrias", r:{k:"range",m1:11,d1:3,m2:11,d2:5}, len:0, sev:1,
        note:"Government, schools, many businesses and some bus services stop for three straight days while brass-band parades take over nearly every town." },
      { n:"Independence from Spain", r:{k:"fixed",m:11,d:28}, len:1, sev:1,
        note:"Another full national holiday with parades — government offices and many businesses closed." }
    ],

    "El Salvador": [
      { n:"Semana Santa", r:{k:"easter",off:-3}, len:4, sev:2,
        note:"Commerce essentially stops from Holy Thursday — banks, offices and most shops close — while the whole country decamps to the coast, so the beach towns are jammed and San Salvador is empty." },
      { n:"Fiestas Agostinas", r:{k:"range",m1:8,d1:1,m2:8,d2:6}, len:0, sev:2,
        note:"San Salvador's patron-saint week — schools and government close, often for the whole week, and many private businesses shut entirely as staff take leave. The capital's centre is given over to processions and fairs." }
    ]
  };

  /* ---------------------------------------------------------------
     STANDING RULES — things that are ALWAYS true about a place's week,
     rather than something that happens on a particular date.

     These deliberately do NOT go through the date banner. A Sunday
     shop-closing law would fire on one day in seven, and a warning that
     appears that often is one people stop reading. They belong on the
     city guide page as a permanent line instead.

     Shown by city.html. Keyed by country name, same as above.
     --------------------------------------------------------------- */

  var STANDING = {
    "Germany": [{
      t: "Everything is shut on Sundays",
      d: "German law closes essentially every shop and supermarket on Sundays — you cannot buy groceries at all. Bakeries, station and airport shops and petrol stations are the exceptions, and restaurants, bars and museums are open as normal."
    }],
    "Austria": [{
      t: "Everything is shut on Sundays",
      d: "Shops, supermarkets and banks close on Sundays. Museums, cafes and restaurants stay open, but buy any groceries you need on Saturday."
    }],
    "Switzerland": [{
      t: "Everything is shut on Sundays",
      d: "Federal law closes every major supermarket and most shops on Sundays. The reliable exceptions are the shops inside big railway stations and airports, and shops in resort tourist zones."
    }],
    "Poland": [{
      t: "Most Sundays are no-shopping days",
      d: "Supermarkets and shopping malls are closed by law on most Sundays — only about seven Sundays a year are trading Sundays. Restaurants, cafes, cinemas, pharmacies, petrol stations and small owner-run corner shops stay open, so you won't go hungry, but plan a proper shop for Saturday."
    }],
    "Croatia": [{
      t: "Most Sundays are no-shopping days",
      d: "Each shop is allowed to open on only sixteen Sundays a year and picks which ones, so assume supermarkets are shut on any given Sunday. Shops at airports, stations, ports, petrol stations, hotels, marinas and campsites are exempt, as are museums."
    }],
    "Montenegro": [{
      t: "Shops are closed on Sundays",
      d: "Retail trade is banned on Sundays and inspectors enforce it. Bakeries, pharmacies, florists, souvenir shops, petrol stations, green markets and restaurants stay open."
    }],
    "Israel": [{
      t: "Shabbat, every Friday afternoon to Saturday night",
      d: "Buses and trains stop from mid-afternoon on Friday until after dark on Saturday — taxis and shared sheruts keep running. How much closes depends entirely on the city: Jerusalem effectively shuts, while Tel Aviv barely notices and its cafes, bars and beach kiosks stay open. In winter it can start as early as 4pm."
    }],
    "Sri Lanka": [{
      t: "No alcohol on full-moon days",
      d: "Every full moon is a Poya day, when liquor shops close and bars stop serving nationwide — that's twelve or thirteen days a year. Shops, transport, restaurants and the sights all run normally, so it's only an issue if you wanted a drink. Buy the day before."
    }],
    "Vatican": [{
      t: "The Museums are closed on Sundays",
      d: "The Vatican Museums and Sistine Chapel are shut every Sunday except the last of the month, when entry is free and the queues are enormous. St Peter's Basilica is open, but not to sightseers on Wednesday mornings during the Pope's audience."
    }],
    "Ethiopia": [{
      t: "Long stretches of the year are meat-free",
      d: "Most traditional restaurants serve only vegan food on Wednesdays and Fridays year-round, and for the whole 55 days of Great Lent before Ethiopian Easter — plus the Advent fast from late November and the first half of August. Excellent if you're vegetarian; worth planning around if you're not."
    }],
    "Rwanda": [{
      t: "The last Saturday morning of every month",
      d: "Umuganda is a national community-work morning: shops close, public transport stops and the roads shut to private cars until 11am. Don't book a transfer, an airport run or a border crossing for that window."
    }],

    /* The Pacific Sunday is stricter than anything in Europe. Tonga's is
       written into the constitution. */
    "Tonga": [{
      t: "Sunday is a constitutional day of rest",
      d: "Nearly everything is closed on Sunday — shops, buses and even petrol stations — and the law is actively enforced. Hotels and resort restaurants have a carve-out and will still feed you, but buy food and fuel on Saturday."
    }],
    "Tuvalu": [{
      t: "Everything closes on Sunday",
      d: "Funafuti shuts completely on Sunday apart from your hotel — stock up on Saturday."
    }],
    "Kiribati": [{
      t: "Sunday stops for church",
      d: "No shops, no buses and no flights until early afternoon on Sunday, and many places don't reopen at all that day."
    }],
    "Solomon Islands": [{
      t: "Shops are closed on Sunday",
      d: "Shops and supermarkets in Honiara close all day Sunday and the buses run about hourly — plan it as a rest day."
    }],
    "Samoa": [{
      t: "Sunday rest, and the evening prayer curfew",
      d: "Most shops, fuel stations and attractions close on Sunday and alcohol is only sold in hotels and restaurants; resorts carry on. Separately, if you hear a bell or conch shell around dusk in a village, stop where you are for about fifteen minutes — you must not walk or drive through, or turn in or out of a driveway, until the third bell."
    }],
    "Fiji": [{
      t: "Sundays are quiet outside the tourist areas",
      d: "Fijian towns and villages go quiet on Sunday and local shops and markets close, but the tourist shops in Nadi and Denarau and all the resorts run as normal."
    }],
    "Brunei": [{
      t: "Friday lunchtime, and no alcohol at all",
      d: "By law every shop, restaurant, cafe, museum and office closes between noon and 2pm on Fridays for prayers — plan your Friday around it. Brunei is also dry year-round: no alcohol is sold anywhere, though non-Muslims may bring in a small personal allowance."
    }],
    "Mauritania": [{
      t: "No alcohol, at any time of year",
      d: "Selling or drinking alcohol is illegal in Mauritania year-round, not just during Ramadan."
    }],
    "Slovenia": [{
      t: "Shops are shut on Sundays",
      d: "Slovenia's trade law closes most shops on Sundays as well as public holidays. A few big-city malls and the shops at stations and in tourist resorts open for a few morning hours."
    }],
    "Liechtenstein": [{
      t: "Shops are shut on Sundays and holidays",
      d: "Public holidays are legally treated like Sundays and there are seventeen of them, so on any Sunday or holiday assume the shops are closed — Switzerland and Austria are a short drive away if you need something."
    }],
    "Faroe Islands": [{
      t: "Shops are closed on Sundays",
      d: "Regular shops close on Sunday; petrol stations open part of the day and Torshavn keeps a few cafes going."
    }],
    /* Bhutan's festival dates are set by the monastic body about a year
       ahead and are not computable, so there is no date data for it. This
       matters less than it sounds: almost every visitor is on a guided
       tour with meals and transport arranged. */
    "Bhutan": [{
      t: "Your tour operator handles the closures",
      d: "Bhutan requires a guide and a pre-arranged itinerary, so shop and office closures barely affect you — meals, transport and entries are booked in advance. What does matter is timing: if you want to see a Tshechu festival at Paro or Thimphu, hotels in that town fill six to nine months ahead, and the dates move each year with the Bhutanese lunar calendar."
    }],
    /* Not a holiday, but it's the thing most likely to catch a visitor
       out in Ukraine, and it is always true. */
    "Ukraine": [{
      t: "There is a nightly curfew",
      d: "A curfew runs every night under martial law — around midnight to 5am in Kyiv and earlier in some regions. Most restaurants and shops close by about 10pm and the metro stops soon after, so plan your evening to end early. Note also that public holidays are currently ordinary working days."
    }]
  };

  /* =================================================================
     BATCH 4 — added 2026-08-19. The long tail.

     By this point most remaining countries close for exactly the same
     handful of days as their neighbours: the Christian set (Good Friday,
     Easter Monday, Christmas, Boxing Day, New Year) or the Muslim set
     (Ramadan, the two Eids). Writing those out a hundred times would
     make this file unreadable and make a typo invisible, so they are
     built from the small factories below and applied in bulk. Anything
     genuinely local is written out longhand afterwards.
     ================================================================= */

  var P = {
    goodFri: function (sev, note) {
      return { n: "Good Friday", r: { k: "easter", off: -2 }, len: 1, sev: sev, note: note };
    },
    easterMon: function (sev, note) {
      return { n: "Easter Monday", r: { k: "easter", off: 1 }, len: 1, sev: sev, note: note };
    },
    easterWeekend: function (sev, note) {
      return { n: "Easter weekend", r: { k: "easter", off: -2 }, len: 4, sev: sev, note: note };
    },
    xmas: function (sev, note) {
      return { n: "Christmas Day", r: { k: "fixed", m: 12, d: 25 }, len: 1, sev: sev, note: note };
    },
    xmasBoxing: function (sev, note) {
      return { n: "Christmas and Boxing Day", r: { k: "range", m1: 12, d1: 25, m2: 12, d2: 26 }, len: 0, sev: sev, note: note };
    },
    nyd: function (sev, note) {
      return { n: "New Year's Day", r: { k: "fixed", m: 1, d: 1 }, len: 1, sev: sev, note: note };
    },
    ramadan: function (sev, note) {
      return { n: "Ramadan", r: { k: "ramadan", off: 0 }, len: "month", sev: sev, fuzzy: true, note: note };
    },
    eidFitr: function (sev, days, note) {
      return { n: "Eid al-Fitr", r: { k: "eidfitr", off: 0 }, len: days, sev: sev, fuzzy: true, note: note };
    },
    eidAdha: function (sev, days, note) {
      return { n: "Eid al-Adha", r: { k: "eidadha", off: 0 }, len: days, sev: sev, fuzzy: true, note: note };
    }
  };

  /* Wording reused across whole groups, so it only has to be right once. */
  var W = {
    goodFriHard: "The deadest day of the year — supermarkets, shops and most independent restaurants shut all day. Buy food the day before; hotel and resort restaurants keep serving.",
    goodFriSoft: "Banks, government offices and most shops close; resorts, tourist restaurants and attractions stay open.",
    easterMon: "Banks, offices and most shops closed, but unlike Good Friday the restaurants are open and the beaches are full of locals.",
    easterLong: "A four-day weekend — banks and offices shut from Friday to Monday and intercity buses fill up, so book ahead.",
    xmasHard: "Almost everything except hotel dining rooms is closed, and transport thins right out.",
    xmasSoft: "Banks, offices and most formal shops shut; tourist businesses carry on.",
    boxingSoft: "Banks, offices and most shops closed for both days; hotels and restaurants keep going.",
    nydHard: "Almost everything closed and the day starts very late.",
    ramadanCustom: "No rule against eating in public, but be discreet in daylight — expect short afternoon hours, slow service and a city that only comes alive after sunset.",
    ramadanLaw: "Eating, drinking or smoking in public during daylight is against the law, including for visitors. Daytime restaurants largely don't serve — eat in your hotel, and expect everything to shift to after sunset.",
    eidFitrBig: "Shops, markets and offices close and everyone is at home with family — do your shopping the day before and don't plan to travel between cities.",
    eidAdhaBig: "The biggest holiday of the West African year — assume shops, banks and most restaurants are shut for two days, and that the week beforehand is chaos at every bus station.",
    eidOffice: "Banks and government offices close; general commerce and the sights carry on."
  };

  /* --- The plain Christian pattern: Good Friday and Christmas close
         things, Easter Monday and Boxing Day are quieter. ------------- */
  ["Zambia", "Malawi", "Lesotho", "Botswana", "Eswatini", "Seychelles",
   "Burundi", "Uganda", "Solomon Islands", "Vanuatu", "Papua New Guinea",
   "Kiribati", "Tuvalu", "Nauru", "Gabon", "Republic of the Congo",
   "Democratic Republic of the Congo", "DR Congo", "Chad",
   "Equatorial Guinea", "São Tomé and Príncipe", "Guinea-Bissau"
  ].forEach(function (c) {
    HOLIDAYS[c] = [
      P.goodFri(1, W.goodFriSoft),
      P.easterMon(1, W.easterMon),
      P.xmasBoxing(1, W.boxingSoft),
      P.nyd(1, W.nydHard)
    ];
  });

  /* --- Muslim-majority, where the fast is custom rather than law. ---- */
  ["Mali", "Burkina Faso", "Niger", "Guinea", "Sierra Leone", "The Gambia",
   "Gambia", "Liberia", "Togo", "Benin", "Comoros"
  ].forEach(function (c) {
    HOLIDAYS[c] = [
      P.ramadan(0, W.ramadanCustom),
      P.eidFitr(2, 2, W.eidFitrBig),
      P.eidAdha(2, 3, W.eidAdhaBig)
    ];
  });

  /* --- Muslim-majority, where daylight fasting is legally enforced. -- */
  ["Mauritania", "Western Sahara"].forEach(function (c) {
    HOLIDAYS[c] = [
      P.ramadan(0, W.ramadanLaw),
      P.eidFitr(2, 2, W.eidFitrBig),
      P.eidAdha(2, 3, W.eidAdhaBig)
    ];
  });

  /* --- The Anglophone Caribbean. Good Friday is the one that catches
         people out; several islands also restrict alcohol that day. --- */
  ["Saint Lucia", "Antigua and Barbuda", "Grenada", "Dominica",
   "Saint Vincent and the Grenadines", "St. Kitts and Nevis",
   "British Virgin Islands", "Anguilla", "Montserrat",
   "Turks and Caicos Islands"
  ].forEach(function (c) {
    HOLIDAYS[c] = [
      P.goodFri(2, W.goodFriHard),
      P.easterMon(1, W.easterMon),
      P.xmasBoxing(2, W.xmasHard),
      P.nyd(2, W.nydHard)
    ];
  });

  /* --- The Dutch Caribbean: milder Good Friday, but the national days
         genuinely shut the supermarkets, which surprises people. ------ */
  ["Aruba", "Curaçao", "Bonaire", "Sint Maarten"].forEach(function (c) {
    HOLIDAYS[c] = [
      P.goodFri(1, "Supermarkets close, though the resorts and tourist restaurants carry on."),
      P.easterMon(1, W.easterMon),
      P.xmasBoxing(2, W.xmasHard),
      P.nyd(2, W.nydHard)
    ];
  });

  /* --- The French overseas territories all inherit French law, and the
         one that really bites is May 1, when almost nothing may open. -- */
  ["Martinique", "Guadeloupe", "Saint-Barthélemy", "Saint-Martin",
   "Réunion", "Mayotte", "French Guiana", "New Caledonia", "French Polynesia"
  ].forEach(function (c) {
    HOLIDAYS[c] = [
      { n: "Labour Day (1er Mai)", r: { k: "fixed", m: 5, d: 1 }, len: 1, sev: 2,
        note: "The one day French law forces almost everything shut — no shops, no offices, minimal transport. Even the bakeries are barred from opening." },
      P.easterMon(1, "Banks, offices and most shops closed. Note there is no Good Friday holiday under French rules, and no Boxing Day either."),
      { n: "Assumption", r: { k: "fixed", m: 8, d: 15 }, len: 1, sev: 1,
        note: "Banks, offices and most shops close; restaurants and beaches carry on." },
      { n: "All Saints' Day", r: { k: "fixed", m: 11, d: 1 }, len: 1, sev: 1,
        note: "Banks, offices and most shops closed." },
      P.xmas(1, "Shops and offices closed; hotels and restaurants open."),
      P.nyd(1, W.nydHard)
    ];
  });

  /* --- The last few. Two groups, both deliberately minimal. ---------
     First: places where the research found nothing beyond the standard
     Christian days. Rather than leave them blank, they get the bare
     pattern, which is honest and still useful. */
  ["Northern Mariana Islands", "Palau", "Marshall Islands",
   "Federated States of Micronesia", "Falkland Islands", "Saint Helena",
   "Saint Pierre and Miquelon"
  ].forEach(function (c) {
    HOLIDAYS[c] = [
      P.xmas(2, W.xmasHard),
      P.nyd(2, W.nydHard)
    ];
  });

  /* Second: countries where a travel advisory, not a holiday calendar,
     is the thing that actually matters. The dates below are accurate and
     worth having, but they are not the headline for these places — this
     file has no way to say "do not travel here", and that gap is worth
     closing separately. */
  ["Syria", "Sudan", "Libya", "Afghanistan", "Somalia", "Yemen"
  ].forEach(function (c) {
    HOLIDAYS[c] = [
      P.ramadan(0, W.ramadanLaw),
      P.eidFitr(2, 3, "Near-total closure for several days — shops, offices and most restaurants."),
      P.eidAdha(2, 3, "Near-total closure for several days.")
    ];
  });

  /* North Korea is deliberately absent: its borders have been closed to
     general tourism since 2020, and the handful of visitors who do get in
     travel on a fully state-assigned itinerary where nothing they might
     want is ever open to them independently. A closure banner there would
     be meaningless. */
  ["Central African Republic", "Haiti", "South Sudan"].forEach(function (c) {
    HOLIDAYS[c] = [
      P.goodFri(1, W.goodFriSoft),
      P.easterMon(1, W.easterMon),
      P.xmas(2, W.xmasHard),
      P.nyd(2, W.nydHard)
    ];
  });

  /* --- Countries with something of their own worth saying. ---------- */

  var MORE = {

    /* ---------------- EUROPE ---------------- */

    "Slovenia": [
      { n:"Christmas and Independence Day", r:{k:"range",m1:12,d1:25,m2:12,d2:26}, len:0, sev:2,
        note:"Shops are shut by law for both days — do your food shopping on the 23rd or 24th, they reopen on the 27th." },
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:2,
        note:"Two days of closed shops here, not one." },
      { n:"Easter", r:{k:"easter",off:0}, len:2, sev:1,
        note:"Even the shops that normally open on Sundays close on Easter Sunday; the sights stay open." },
      { n:"Public holiday — shops shut by law",
        r:{k:"fixedset",days:[[2,8],[4,27],[5,1],[5,2],[6,25],[8,15],[10,31],[11,1]]}, len:1, sev:1,
        note:"Slovenia's trade law closes most shops on public holidays as well as Sundays — restaurants and museums are fine." }
    ],

    "Latvia": [
      { n:"Midsummer (Ligo and Jani)", r:{k:"range",m1:6,d1:23,m2:6,d2:24}, len:0, sev:1,
        note:"Riga empties as everyone leaves for the countryside — many restaurants close and malls shut on the 24th, though the big supermarkets stay open on short hours. The party is outside the city, not in it." },
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:1,
        note:"Everything closes early on the 24th and restaurants fill with family bookings; the 25th is the real shutdown. Museums mostly stay open." },
      P.nyd(1, "A quiet day with many shops closed.")
    ],

    "Lithuania": [
      P.xmas(2, "Every major supermarket closes nationwide — buy your food on the 24th."),
      P.nyd(2, "The big chains shut for the whole day."),
      { n:"All Saints' and All Souls'", r:{k:"range",m1:11,d1:1,m2:11,d2:2}, len:0, sev:1,
        note:"Museums close for both days and the whole country is on the road to family graves." },
      { n:"Easter Sunday", r:{k:"easter",off:0}, len:1, sev:1,
        note:"Museums close and shops keep short hours." }
    ],

    "Luxembourg": [
      { n:"Shops closed by law",
        r:{k:"fixedset",days:[[1,1],[5,1],[12,25]]}, len:1, sev:2,
        note:"These are the only three days Luxembourg legally bans shops from opening — bakeries, butchers and restaurants may still trade. Every other public holiday, shops are allowed to open and usually do." },
      { n:"National Day", r:{k:"range",m1:6,d1:22,m2:6,d2:23}, len:0, sev:0, cities:["Luxembourg"],
        note:"The city centre closes to traffic on the evening of the 22nd for the torchlight parade and fireworks; shops may open on the 23rd but most don't." }
    ],

    /* Bosnia has three communities on three calendars and no state-level
       holiday law, so what closes depends entirely on which town you are
       in. The city lists below are the point of these entries. */
    "Bosnia and Herzegovina": [
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true,
        cities:["Sarajevo","Mostar","Zenica","Tuzla","Travnik","Bihac","Bihać"],
        note:"In Bosniak-majority towns most small shops and businesses shut on the first morning and cafes reopen through the day. Banja Luka and the Serb east carry on as normal." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:2, sev:1, fuzzy:true,
        cities:["Sarajevo","Mostar","Zenica","Tuzla","Travnik","Bihac","Bihać"],
        note:"Same pattern and same geography as the other Eid." },
      { n:"Catholic Christmas", r:{k:"fixed",m:12,d:25}, len:1, sev:1, cities:["Mostar"],
        note:"Shops and many restaurants close in Croat-majority western Herzegovina; Sarajevo is largely unaffected." },
      { n:"Orthodox Christmas", r:{k:"fixed",m:1,d:7}, len:1, sev:1,
        note:"A real closure day in Republika Srpska (Banja Luka, Trebinje, East Sarajevo); in Sarajevo it's optional and most places stay open." },
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:1,
        note:"Two non-working days across both entities." }
    ],

    "North Macedonia": [
      { n:"Orthodox Easter", r:{k:"oeaster",off:-2}, len:4, sev:2,
        note:"Shops and supermarkets close for three days across the Easter weekend — stock up before Good Friday. Restaurants and cafes stay open. Note this often falls weeks after the Western Easter." },
      { n:"Orthodox Christmas", r:{k:"fixed",m:1,d:7}, len:1, sev:2,
        note:"This is the Christmas that matters here, not the 25th — most businesses closed." },
      P.nyd(2, "Virtually everything closed and transport reduced."),
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:1, sev:1, fuzzy:true,
        note:"A national day off, though the visible closures are in the Albanian- and Turkish-majority areas — Skopje's Cair district, Tetovo, Gostivar, Struga." },
      { n:"Ilinden (Republic Day)", r:{k:"fixed",m:8,d:2}, len:1, sev:1,
        note:"Businesses closed, public events, reduced buses." }
    ],

    "Kosovo": [
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true,
        note:"Many small shops close and banks and offices shut, but Pristina's cafes and restaurants stay open." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:2, sev:1, fuzzy:true,
        note:"Same as the other Eid — offices and small retail, not the places you'd actually eat." },
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:1,
        note:"Two non-working days; small shops closed." }
    ],

    "Moldova": [
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:2,
        note:"The biggest shutdown of the Moldovan year." },
      { n:"Orthodox Easter", r:{k:"oeaster",off:0}, len:2, sev:1,
        note:"Shops and businesses close — Moldova is heavily Orthodox and takes this seriously." },
      { n:"Easter of the Dead (Pastele Blajinilor)", r:{k:"oeaster",off:8}, len:1, sev:1,
        note:"A week after Easter the entire country goes to the cemeteries — Chisinau lays on free buses and the roads out to the graveyards jam solid." },
      { n:"Orthodox Christmas", r:{k:"range",m1:1,d1:7,m2:1,d2:8}, len:0, sev:1,
        note:"Schools and most businesses closed. December 25 is also a holiday but far less observed here." }
    ],

    "Liechtenstein": [
      { n:"Public holiday — shops shut",
        r:{k:"fixedset",days:[[1,1],[1,2],[1,6],[2,2],[3,19],[5,1],[9,8],[11,1],[12,8],[12,25],[12,26]]},
        len:1, sev:1,
        note:"A very Catholic country with a legal shop-closing rule, and an unusually long holiday list — assume shops are shut, and cross into Switzerland or Austria if you need something." },
      { n:"National Day", r:{k:"fixed",m:8,d:15}, len:1, sev:2, cities:["Vaduz"],
        note:"Shops closed nationwide and Vaduz is overrun — the whole country turns out for the state ceremony, the folk festival and fireworks over the castle." }
    ],

    "Faroe Islands": [
      { n:"Olavsoka (national holiday)", r:{k:"range",m1:7,d1:28,m2:7,d2:29}, len:0, sev:2,
        note:"The country really does shut — shops closed both days and almost all tours cancelled, while ten thousand people pack Torshavn for a festival that isn't aimed at tourists." },
      { n:"Easter", r:{k:"easter",off:-3}, len:5, sev:2,
        note:"Shops and public services shut on Maundy Thursday, Good Friday, Easter Sunday and Easter Monday. The Saturday in between is your one trading day." },
      { n:"Christmas and New Year", r:{k:"range",m1:12,d1:24,m2:1,d2:1}, len:0, sev:2,
        note:"The only stretch of the year when even the tour operators stop entirely." },
      { n:"General Prayer Day", r:{k:"easter",off:25}, len:1, sev:1,
        note:"A Faroese-only holiday that Denmark abolished — shops shut all day and restaurants reopen around 6pm." }
    ],

    "Greenland": [
      { n:"Christmas", r:{k:"range",m1:12,d1:24,m2:12,d2:26}, len:0, sev:2,
        note:"Shops close, and in a small settlement that means the only shop. A large supermarket in Nuuk may open briefly." },
      { n:"Easter", r:{k:"easter",off:-3}, len:5, sev:2,
        note:"Maundy Thursday through Easter Monday are all days off, and the smaller the town the more absolute it is." }
    ],

    /* ---------------- CARIBBEAN EXTRAS ---------------- */

    "Trinidad and Tobago": [
      { n:"Carnival", r:{k:"easter",off:-48}, len:2, sev:2,
        note:"The country stops — shops, offices and most services close and central Port of Spain is impassable, even though the two days aren't technically public holidays. Hotels and flights sell out months ahead at several times normal price." },
      P.goodFri(2, W.goodFriHard),
      P.easterMon(1, W.easterMon),
      P.xmasBoxing(2, W.xmasHard),
      P.nyd(2, W.nydHard),
      { n:"Divali", r:{k:"diwali",off:0}, len:1, sev:1,
        note:"A full national public holiday in Trinidad — banks and most shops close." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:1, sev:1, fuzzy:true,
        note:"Also a national public holiday here, and the date isn't fixed until shortly beforehand." }
    ],

    "Barbados": [
      P.goodFri(2, "The deadest day of the year — shops and most restaurants shut, and bars may not serve alcohol before 6pm. Hotels and restaurants generally keep pouring."),
      P.easterMon(1, W.easterMon),
      P.xmasBoxing(2, W.xmasHard),
      P.nyd(2, W.nydHard),
      { n:"Grand Kadooment (Crop Over finale)", r:{k:"nth",m:8,wd:1,n:1}, len:1, sev:1,
        note:"A public holiday and the road march closes the routes into Bridgetown — the island runs at full capacity through Crop Over, so book accommodation months ahead." }
    ],

    "Bermuda": [
      { n:"Cup Match", r:{k:"nth",m:8,wd:1,n:1,off:-4}, len:2, sev:2,
        note:"The island virtually shuts for two days — banks, government and most shops closed, buses and ferries on Sunday schedules, and much of the population at the cricket or camping. Don't plan errands, and book far ahead." },
      P.goodFri(2, "Shops may not open at all without a special licence, and buses and ferries run Sunday schedules. The beaches are busy — it's the day of the kite festival."),
      P.easterMon(1, W.easterMon),
      P.xmasBoxing(2, W.xmasHard),
      P.nyd(2, W.nydHard)
    ],

    "U.S. Virgin Islands": [
      P.goodFri(1, "Government, banks and most local businesses close, and spirits may not be served in public venues between 9am and 4pm — beer and wine are fine."),
      { n:"Holy Thursday", r:{k:"easter",off:-3}, len:1, sev:1,
        note:"A legal holiday in the Virgin Islands and nowhere else nearby — government offices and banks are closed." },
      P.easterMon(1, W.easterMon),
      P.xmasBoxing(2, W.xmasHard),
      P.nyd(2, W.nydHard),
      { n:"Territorial holiday", r:{k:"fixedset",days:[[1,6],[3,31],[7,3],[11,1]]}, len:1, sev:1,
        note:"Government offices, banks and many local businesses close for these territorial holidays even though the US mainland is working normally." }
    ],

    /* ---------------- LATIN AMERICA ---------------- */

    "Nicaragua": [
      { n:"Semana Santa", r:{k:"easter",off:-3}, len:4, sev:2,
        note:"Most shops, banks and offices shut on Thursday and Friday, buses thin out badly and there are almost none on Easter Sunday. The whole country is at the beach — San Juan del Sur and Las Penitas sell out months ahead." },
      P.xmas(2, "Almost everything closes and public transport largely stops; shops close early on the 24th."),
      P.nyd(2, "Same as Christmas Day — very little open and little transport."),
      { n:"Fiestas de Santo Domingo", r:{k:"fixedset",days:[[8,1],[8,10]]}, len:1, sev:1, cities:["Managua"],
        note:"Managua declares both days municipal holidays for its patron-saint procession — offices and many businesses shut and the central streets are jammed. The rest of the country works normally." }
    ],

    "Honduras": [
      { n:"Semana Santa", r:{k:"easter",off:-3}, len:4, sev:2,
        note:"Banks shut from Wednesday midday until Sunday and most commerce stops Thursday and Friday. Over two million Hondurans hit the road, the coastal hotels sell out weeks ahead, and many towns ban alcohol sales for the week." },
      { n:"Semana Morazanica", r:{k:"range",m1:10,d1:3,m2:10,d2:9}, len:0, sev:1,
        note:"Banks and government close for three straight days in the first full week of October and the entire country goes on holiday at once — book Roatan, Utila and any domestic flight well in advance." },
      P.xmas(2, "Banks and most offices close at noon on the 24th, then the 25th is a full closure."),
      P.nyd(2, W.nydHard)
    ],

    "Belize": [
      { n:"Easter weekend", r:{k:"easter",off:-2}, len:4, sev:2,
        note:"Belize essentially stops on Good Friday — shops shut, buses run thin and many bars still voluntarily go dry even though the legal ban was repealed." },
      P.xmasBoxing(2, W.xmasHard),
      P.nyd(2, W.nydHard),
      { n:"September Celebrations", r:{k:"fixedset",days:[[9,10],[9,21]]}, len:1, sev:1,
        note:"Banks, government and local businesses close and parades block the town centres, but tour operators and restaurants stay open. Watch out separately for September being low season, when some hotels close for refurbishment." }
    ],

    "Paraguay": [
      { n:"Semana Santa", r:{k:"easter",off:-3}, len:2, sev:2,
        note:"About three-quarters of supermarkets close on Good Friday and most Asuncion malls shut their shops. On Thursday everything closes early as the city empties for the interior." },
      { n:"Virgin of Caacupe", r:{k:"range",m1:12,d1:7,m2:12,d2:8}, len:0, sev:2,
        note:"Around two million pilgrims walk to Caacupe and the highway east out of Asuncion is partly closed to cars with lanes fenced off for walkers — do not plan to drive that way." },
      P.xmas(1, "Mall shops and most supermarkets close; food courts sometimes open."),
      P.nyd(1, "Same as Christmas Day.")
    ],

    /* Uruguay is the interesting negative case: it secularised its
       holidays in 1919, so Holy Week is a travel crush, NOT a closure. */
    "Uruguay": [
      { n:"Semana de Turismo (Tourism Week)", r:{k:"easter",off:-6}, len:7, sev:0,
        note:"Uruguay renamed Easter and made it a working holiday, so the shops stay open — but the entire country goes on holiday at once. Montevideo empties while Punta del Este, Piriapolis and the hot springs sell out at peak prices. Don't come to Montevideo this week." },
      { n:"Mandatory closure holiday", r:{k:"fixedset",days:[[1,1],[5,1],[12,25]]}, len:1, sev:2,
        note:"These are the only three days Uruguay genuinely shuts — supermarkets and shopping centres closed across the country, with the tourist coast the exception." }
    ],

    /* Venezuela: extra holidays get created by decree at a few days'
       notice, and power rationing closes malls independently of the
       calendar, so any date here is indicative rather than reliable. */
    "Venezuela": [
      { n:"Semana Santa", r:{k:"easter",off:-3}, len:5, sev:2,
        note:"Thursday and Friday are national holidays with businesses required to close, and the government frequently decrees the whole week off — plan for a five-day shutdown, not two. Note that power rationing can close malls on any day regardless of the calendar." },
      { n:"Carnaval", r:{k:"easter",off:-48}, len:2, sev:1,
        note:"Both days are national holidays with most commerce closed, and the cities empty toward the coast — Margarita, Choroni and Merida are booked out." },
      P.xmas(1, "Most business closed, though the Christmas-to-Epiphany period is unpredictable here."),
      P.nyd(1, W.nydHard)
    ],

    /* Suriname and Guyana are unusual: Hindu, Muslim and Christian
       holidays are all national public holidays. */
    "Suriname": [
      { n:"Christmas and Boxing Day", r:{k:"range",m1:12,d1:25,m2:12,d2:26}, len:0, sev:2,
        note:"Nearly all shops, banks and public services close and restaurants book out from the 23rd — draw cash and fill the tank a day ahead." },
      P.nyd(2, W.nydHard),
      { n:"Owru Yari (Old Year's Day)", r:{k:"fixed",m:12,d:31}, len:1, sev:1, cities:["Paramaribo"],
        note:"Downtown Paramaribo closes to traffic from mid-morning and the giant firecracker relay peaks at midday, not midnight — be in the centre by late morning and don't expect to drive." },
      { n:"Holi Phagwa", r:{k:"holi",off:0}, len:1, sev:1,
        note:"A national public holiday observed by the whole country, not just Hindus — banks and offices close and traffic crawls. Wear clothes you're happy to ruin." },
      { n:"Divali", r:{k:"diwali",off:0}, len:1, sev:1,
        note:"A national public holiday: banks and government close, but the shops and restaurants stay lively. A good day to be in Paramaribo rather than one to avoid." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:1, sev:1, fuzzy:true,
        note:"A national public holiday closing banks, offices and many shops; the date is only confirmed a day or two ahead." },
      { n:"Keti Koti (Emancipation Day)", r:{k:"fixed",m:7,d:1}, len:1, sev:1,
        note:"A full national holiday — banks, offices and many shops close, with commemorations in Paramaribo's parks." }
    ],

    "Guyana": [
      { n:"Mashramani (Republic Day)", r:{k:"fixed",m:2,d:23}, len:1, sev:1,
        note:"Schools, banks, offices and most businesses close and the float parade shuts central Georgetown for the day — hotels fill, so book ahead." },
      { n:"Easter weekend", r:{k:"easter",off:-2}, len:4, sev:1,
        note:"A four-day weekend with many businesses closed from Friday to Monday. Separately, the Bartica Regatta and the Rupununi Rodeo at Lethem book those two towns and their flights out completely." },
      { n:"Phagwah (Holi)", r:{k:"holi",off:0}, len:1, sev:1,
        note:"A full national public holiday for everyone — banks, offices and most businesses close. Wear disposable clothes." },
      { n:"Deepavali", r:{k:"diwali",off:0}, len:1, sev:1,
        note:"A full national public holiday: banks, government and many businesses close, and the evening motorcade of lit floats blocks Georgetown's streets." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:1, sev:1, fuzzy:true,
        note:"A national public holiday — banks and offices closed. Note Guyana observes this Eid and Youman Nabi, but NOT Eid al-Fitr." },
      P.xmasBoxing(2, "Christmas Day closes nearly everything including transport; Boxing Day is quieter and many businesses reopen for street-stall shopping.")
    ],

    /* ---------------- AFRICA ---------------- */

    "Zimbabwe": [
      { n:"Christmas to New Year", r:{k:"range",m1:12,d1:25,m2:1,d2:1}, len:0, sev:2,
        note:"Government and most businesses close on Christmas Day and don't reopen until after New Year — stock up and expect a very quiet week." },
      P.easterWeekend(1, W.easterLong),
      { n:"Victoria Falls peak season", r:{k:"range",m1:7,d1:1,m2:8,d2:31}, len:0, sev:0,
        cities:["Victoria Falls"],
        note:"Maximum crowds through July and August — book lodges and activities months ahead." }
    ],

    "Namibia": [
      P.xmas(2, "The one day even the Windhoek supermarkets shut; Christmas Eve and New Year's Eve close at midday."),
      P.goodFri(1, "Offices, shops and many restaurants close, though big-town supermarkets usually open."),
      P.easterMon(1, W.easterMon),
      P.nyd(1, W.nydHard),
      { n:"Summer holidays", r:{k:"range",m1:12,d1:20,m2:1,d2:10}, len:0, sev:0,
        cities:["Swakopmund","Walvis Bay","Windhoek"],
        note:"Windhoek half-empties while the whole country decamps to the coast — Swakopmund and Walvis Bay have no parking, full restaurants and higher prices." }
    ],

    /* Mauritius re-gazettes its holiday list every year and the set
       changes, so treat these as likely rather than guaranteed. Only the
       ones with reliable long-range dates are here — Maha Shivaratree,
       Thaipoosam Cavadee and Ganesh Chaturthi are left out because I have
       no trustworthy multi-year table for them. */
    "Mauritius": [
      { n:"Divali", r:{k:"diwali",off:0}, len:1, sev:1,
        note:"Banks, government and local markets shut and supermarkets run mornings-only, but hotels, restaurants and tourist-area shops stay open." },
      { n:"Chinese Spring Festival", r:{k:"cny",off:0}, len:1, sev:1,
        note:"A public holiday — banks and local shops close, tourist areas carry on." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:1, sev:1, fuzzy:true,
        note:"A public holiday, but Mauritius fixes the date only the evening before, subject to the moon being sighted." },
      P.xmas(1, "Banks, government and local markets close; hotels and restaurants are unaffected."),
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:1,
        note:"Two days here, not one." }
    ],

    "Madagascar": [
      { n:"Independence Day", r:{k:"fixed",m:6,d:26}, len:1, sev:1,
        note:"Offices, banks and most businesses close for the parade and fireworks, and central Antananarivo is crowded with bad traffic. Be careful in the crowds — there has been a fatal crush here before." },
      P.xmas(1, W.xmasSoft),
      P.nyd(1, W.nydHard),
      P.easterMon(1, W.easterMon),
      { n:"Cyclone season", r:{k:"range",m1:1,d1:10,m2:3,d2:15}, len:0, sev:2,
        note:"Not a holiday, but it behaves like one: many lodges and beach resorts on the east and northeast coasts genuinely close for the season and some parks become unreachable. February is the worst." }
    ],

    "Eritrea": [
      { n:"Orthodox Christmas", r:{k:"fixed",m:1,d:7}, len:1, sev:1,
        note:"Schools and most businesses closed. Eritrea uses the same calendar as Ethiopia, so this is the Christmas that matters." },
      { n:"Timket (Epiphany)", r:{k:"fixed",m:1,d:19}, len:1, sev:1,
        note:"Big Orthodox processions in Asmara, Keren and Massawa; offices and banks closed." },
      { n:"Orthodox Easter (Fasika)", r:{k:"oeaster",off:-2}, len:3, sev:1,
        note:"Business slows for days as people travel home for the feast that breaks the 55-day fast." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true, note:W.eidOffice },
      { n:"Independence Day", r:{k:"fixed",m:5,d:24}, len:1, sev:1,
        note:"The biggest state holiday of the year — offices and banks closed." }
    ],

    "Djibouti": [
      P.ramadan(0, "Offices are legally required to cut two hours a day, daytime eating out is largely unavailable, and life shifts to the evening."),
      P.eidFitr(2, 2, "Schools and most businesses close."),
      P.eidAdha(2, 2, "Schools and most businesses close."),
      { n:"Independence Day", r:{k:"range",m1:6,d1:27,m2:6,d2:28}, len:0, sev:1, note:W.eidOffice }
    ],

    "Côte d'Ivoire": [
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:1, sev:1, fuzzy:true,
        note:"A national holiday, but the real shutdown is in the north — Abidjan keeps going." },
      { n:"Eid al-Adha (Tabaski)", r:{k:"eidadha",off:0}, len:2, sev:1, fuzzy:true,
        note:"The bigger of the two Eids, though again mostly felt in the north rather than Abidjan." },
      P.xmas(2, W.xmasHard),
      P.easterMon(1, W.easterMon),
      P.nyd(1, W.nydHard)
    ],

    "Cameroon": [
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:1, sev:1, fuzzy:true,
        note:"A national holiday; the real closures are in the Muslim north, while Douala and Yaounde carry on." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:2, sev:1, fuzzy:true,
        note:"Same again — a northern shutdown more than a national one." },
      P.xmas(2, W.xmasHard),
      P.easterMon(1, W.easterMon),
      P.nyd(1, W.nydHard)
    ],

    "Cabo Verde": [
      { n:"Carnival", r:{k:"easter",off:-47}, len:2, sev:2,
        note:"Carnival Tuesday closes government, banks and most shops nationwide, and in Mindelo the shops shut and the town empties for days beforehand while everyone prepares." },
      P.xmas(2, W.xmasHard),
      P.nyd(2, W.nydHard),
      P.goodFri(1, W.goodFriSoft)
    ],

    "Angola": [
      { n:"Carnival", r:{k:"easter",off:-47}, len:1, sev:2,
        note:"A full public holiday — schools and most businesses close and central Luanda is given over to parades and road closures." },
      P.xmas(2, W.xmasHard),
      P.nyd(2, W.nydHard),
      P.goodFri(1, W.goodFriSoft)
    ],

    /* ---------------- ASIA & THE MIDDLE EAST ---------------- */

    /* Lebanon observes BOTH Easters as separate public holidays, and the
       two halves of the country close on different days. */
    "Lebanon": [
      { n:"Western Good Friday", r:{k:"easter",off:-2}, len:2, sev:1,
        note:"The Christian areas — Achrafieh, Jounieh, the Mountain — go quiet and shops close, while the Muslim districts carry on as normal." },
      { n:"Orthodox Good Friday", r:{k:"oeaster",off:-2}, len:2, sev:1,
        note:"Lebanon does Easter twice. The Orthodox one is usually a week or more later and closes a different half of the country." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:3, sev:1, fuzzy:true,
        note:"Muslim-owned shops and businesses close for about three days; the Christian neighbourhoods stay open, so you will always find food." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:3, sev:1, fuzzy:true,
        note:"The same pattern — half the city closes and half doesn't." },
      P.xmas(1, "Christian areas largely closed, though Beirut's nightlife is at its busiest."),
      P.ramadan(0, "Muslim-majority areas eat late and go quiet by day; Beirut broadly functions normally and alcohol is still served.")
    ],

    "Palestine": [
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:4, sev:2, fuzzy:true,
        note:"Shops, transport and services across the West Bank shut for several days." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:4, sev:2, fuzzy:true,
        note:"Shops, transport and services shut for several days." },
      P.ramadan(1, "Jerusalem's Old City is packed and tense, access to Al-Aqsa is restricted by age and gender, and searches at the entrances are routine."),
      /* Israeli holidays close the checkpoints, which strands day-trippers
         — this is documented government advice, not a guess. */
      { n:"Israeli holiday checkpoint closures", r:{k:"rosh",off:0}, len:2, sev:2,
        note:"Israeli checkpoints in and out of the West Bank can close for Jewish holidays, so a day trip from Jerusalem to Bethlehem or Ramallah may simply not be possible. Check before you set out." },
      { n:"Israeli holiday checkpoint closures", r:{k:"rosh",off:9}, len:1, sev:2,
        note:"Yom Kippur: the checkpoints close, and inside Israel everything including the airport stops for about 25 hours." },
      { n:"Israeli holiday checkpoint closures", r:{k:"pesach",off:0}, len:8, sev:2,
        note:"Passover week: checkpoints in and out of the West Bank can close with little warning." },
      { n:"Christmas in Bethlehem", r:{k:"range",m1:12,d1:24,m2:12,d2:25}, len:0, sev:0,
        note:"Manger Square closes to traffic and is overrun. Note Bethlehem has three Christmases — Western on 25 December, Orthodox on 7 January and Armenian on 19 January." }
    ],

    /* Mongolia: Naadam is a fixed date and safe. Tsagaan Sar is NOT here
       on purpose — it uses a Tibetan-derived lunar calculation that has
       landed a whole month away from Chinese New Year (2020, 2023, 2025),
       and Mongolia publishes it only a year ahead. Deriving it from CNY
       would be confidently wrong. */
    "Mongolia": [
      { n:"Naadam", r:{k:"range",m1:7,d1:10,m2:7,d2:15}, len:0, sev:1,
        note:"Banks, offices and many shops shut for up to six days around the 11th to 13th, and Ulaanbaatar hotels, stadium tickets and domestic flights sell out months ahead — book by January or pick other dates." },
      { n:"New Year", r:{k:"fixed",m:1,d:1}, len:1, sev:1, note:W.nydHard }
    ],

    "Myanmar": [
      { n:"Thingyan (water festival)", r:{k:"range",m1:4,d1:11,m2:4,d2:19}, len:0, sev:2,
        note:"For about ten days in mid-April banks, offices and most businesses shut, transport is erratic, and you will be soaked with water any time you're outdoors. Travel before or after, not during." }
    ],

    "Brunei": [
      P.ramadan(2, "It is illegal for anyone, including non-Muslims, to eat, drink or smoke in public during daylight, and restaurants may not serve dine-in until sunset — takeaway eaten in private is your only option."),
      P.eidFitr(2, 3, "Everything shuts for three days at the end of Ramadan, though the Sultan's palace throws a famous public open house you can join."),
      P.eidAdha(1, 1, W.eidOffice),
      { n:"Sultan's Birthday", r:{k:"fixed",m:7,d:15}, len:1, sev:1,
        note:"Offices and banks closed, with parades and road closures in Bandar Seri Begawan." }
    ],

    "Timor-Leste": [
      { n:"Easter", r:{k:"easter",off:-2}, len:3, sev:2,
        note:"Timor-Leste is overwhelmingly Catholic and Good Friday genuinely closes Dili — shut shops, no offices and church processions." },
      P.xmas(2, "Almost everything closes and services run on a holiday timetable either side."),
      { n:"All Saints' and All Souls'", r:{k:"range",m1:11,d1:1,m2:11,d2:2}, len:0, sev:1,
        note:"Two days off and the cemeteries fill with families; banks and offices shut." },
      P.nyd(1, W.nydHard)
    ],

    "Kyrgyzstan": [
      { n:"New Year", r:{k:"range",m1:12,d1:31,m2:1,d2:2}, len:0, sev:2,
        note:"New Year, not Christmas, is the big one — shops, bazaars and transport shut for a couple of days and everyone is at home." },
      { n:"Nooruz", r:{k:"range",m1:3,d1:21,m2:3,d2:24}, len:0, sev:1,
        note:"Offices, banks and most shops close for several days around 21 March, with big public festivals in Bishkek and Osh instead." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true,
        note:"Banks and offices close and many shops shut for the day; restaurants mostly stay open." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:1, sev:1, fuzzy:true, note:W.eidOffice }
    ],

    "Tajikistan": [
      { n:"Navruz", r:{k:"range",m1:3,d1:21,m2:3,d2:24}, len:0, sev:2,
        note:"Tajikistan closes for four straight days from 21 March — banks, offices and most shops shut and intercity transport thins out badly." },
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:2,
        note:"The biggest holiday of the year — everything shuts." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true, note:W.eidOffice },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:2, sev:1, fuzzy:true, note:W.eidOffice },
      { n:"Independence Day", r:{k:"fixed",m:9,d:9}, len:2, sev:1,
        note:"Offices closed and large state ceremonies close central Dushanbe streets." }
    ],

    /* Turkmenistan sets its Eid dates by presidential decree, so the
       calculated dates below can drift from what is actually observed. */
    "Turkmenistan": [
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:2, note:W.nydHard },
      { n:"Nowruz", r:{k:"range",m1:3,d1:21,m2:3,d2:22}, len:0, sev:1,
        note:"Two days off with state-organised festivities; offices and banks shut." },
      { n:"Eid al-Fitr", r:{k:"eidfitr",off:0}, len:2, sev:1, fuzzy:true,
        note:"Offices and banks close. Turkmenistan fixes the exact date by presidential decree each year, so this can move." },
      { n:"Eid al-Adha", r:{k:"eidadha",off:0}, len:2, sev:1, fuzzy:true,
        note:"Offices and banks close; the exact date is set by decree, so treat it as approximate." },
      { n:"Independence Day", r:{k:"fixed",m:9,d:27}, len:2, sev:1,
        note:"Mass state ceremonies and central Ashgabat given over to parades." }
    ],

    /* ---------------- THE PACIFIC ---------------- */

    "Fiji": [
      { n:"Easter", r:{k:"easter",off:-2}, len:4, sev:2,
        note:"Good Friday shuts almost everything, and Fiji also takes Easter Saturday as a holiday — expect a long weekend where banks, offices and most shops stay closed until Tuesday. Resorts are unaffected." },
      P.xmasBoxing(2, W.xmasHard),
      P.nyd(2, W.nydHard),
      { n:"Diwali", r:{k:"diwali",off:0}, len:1, sev:1,
        note:"A full national public holiday in Fiji — banks, offices and many shops close, and there are fireworks after dark. Holi is celebrated but is not a holiday and closes nothing." },
      { n:"Fiji Day", r:{k:"fixed",m:10,d:10}, len:1, sev:1,
        note:"National day — banks and government offices close, resorts and tours run normally." }
    ],

    "Samoa": [
      { n:"Easter", r:{k:"easter",off:-2}, len:4, sev:2,
        note:"Samoa takes Good Friday, Easter Saturday and Easter Monday — banks, offices and most shops stay closed until Tuesday." },
      P.xmasBoxing(2, W.xmasHard),
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:2,
        note:"Two days here, not one." },
      { n:"Independence Day", r:{k:"fixed",m:6,d:1}, len:1, sev:1,
        note:"Offices and many shops close, with dawn church bells and village events across the country." },
      /* White Sunday closes things on the MONDAY, not the Sunday. */
      { n:"White Sunday (Lotu a Tamaiti)", r:{k:"nth",m:10,wd:0,n:2,off:1}, len:1, sev:1,
        note:"Children lead the church services on the second Sunday of October and families feast — it's the Monday after that is the public holiday, with offices, schools and shops closed." }
    ],

    "Tonga": [
      { n:"Easter", r:{k:"easter",off:-2}, len:4, sev:2,
        note:"Good Friday closes everything and the long weekend runs to Easter Monday." },
      P.xmasBoxing(2, W.xmasHard),
      { n:"New Year", r:{k:"range",m1:1,d1:1,m2:1,d2:2}, len:0, sev:2,
        note:"Two days off." },
      { n:"Heilala Festival and the King's Birthday", r:{k:"fixed",m:7,d:4}, len:1, sev:0,
        note:"Tonga's biggest festival fills Nuku'alofa's hotels for up to three weeks from early July — book accommodation well ahead." }
    ],

    "Papua New Guinea": [
      { n:"Independence Day", r:{k:"fixed",m:9,d:16}, len:1, sev:1,
        note:"Most businesses close and Port Moresby fills with parades, extra police, checkpoints and road closures — travel early and avoid the stadium areas." }
    ],

    "New Caledonia": [
      { n:"New Caledonia Day", r:{k:"fixed",m:9,d:24}, len:1, sev:0,
        note:"The anniversary of French annexation, and historically a protest date — check the current advisory, since authorities can impose curfews and roadblocks at short notice." }
    ],

    "French Polynesia": [
      { n:"Heiva i Tahiti", r:{k:"range",m1:7,d1:1,m2:7,d2:31}, len:0, sev:0,
        note:"Heiva is the reason to come in July rather than a reason to avoid it, but hotels, flights and ferries around Papeete book out and the centre has parade road closures — reserve months ahead." },
      { n:"Internal Autonomy Day", r:{k:"fixed",m:6,d:29}, len:1, sev:1,
        note:"Offices and banks closed." }
    ]
  };

  /* Fold the bespoke entries in. Where a country already got a shared
     pattern above, the bespoke list replaces it wholesale — that is
     deliberate, since the longhand version is the more careful one. */
  Object.keys(MORE).forEach(function (c) { HOLIDAYS[c] = MORE[c]; });

  /* A few places only need one extra line on top of the shared pattern. */
  if (HOLIDAYS["Saint Lucia"]) {
    HOLIDAYS["Saint Lucia"].push({
      n: "Saint Lucia Carnival", r: { k: "nth", m: 7, wd: 1, n: 3 }, len: 2, sev: 0,
      cities: ["Castries"],
      note: "Not an island-wide closure, but Castries' streets are given over to the Parade of the Bands for two days and hotel rates spike."
    });
  }
  if (HOLIDAYS["Grenada"]) {
    HOLIDAYS["Grenada"].push({
      n: "Spicemas", r: { k: "nth", m: 8, wd: 1, n: 2 }, len: 2, sev: 1,
      note: "The island effectively stops for two days and J'Ouvert takes over St George's from 4am. Note Emancipation Day on 1 August is a separate holiday the week before."
    });
  }
  if (HOLIDAYS["Antigua and Barbuda"]) {
    HOLIDAYS["Antigua and Barbuda"].push({
      n: "Antigua Carnival", r: { k: "nth", m: 8, wd: 1, n: 1 }, len: 2, sev: 1,
      note: "St John's shuts down from J'Ouvert at 3am on Carnival Monday through Last Lap on Tuesday night; both are public holidays."
    });
    HOLIDAYS["Antigua and Barbuda"].push({
      n: "Good Friday alcohol ban", r: { k: "easter", off: -2 }, len: 1, sev: 1,
      note: "No alcohol may be sold anywhere on the island — not by bars, supermarkets or shops — from midnight on Thursday through all of Good Friday."
    });
  }
  if (HOLIDAYS["St. Kitts and Nevis"]) {
    HOLIDAYS["St. Kitts and Nevis"].push({
      n: "Sugar Mas (Carnival)", r: { k: "range", m1: 12, d1: 25, m2: 1, d2: 2 }, len: 0, sev: 2,
      note: "Basseterre is effectively closed from Christmas Day to 2 January — four public holidays back to back, with parades on Boxing Day, New Year's Day and the 2nd."
    });
  }
  if (HOLIDAYS["Saint Vincent and the Grenadines"]) {
    HOLIDAYS["Saint Vincent and the Grenadines"].push({
      n: "Vincy Mas", r: { k: "nth", m: 7, wd: 1, n: 1 }, len: 2, sev: 1,
      note: "Two public holidays close banks and offices while Kingstown fills with J'Ouvert and Mardi Gras bands."
    });
  }
  if (HOLIDAYS["Dominica"]) {
    HOLIDAYS["Dominica"].push({
      n: "Carnival (Mas Domnik)", r: { k: "easter", off: -48 }, len: 2, sev: 2,
      note: "Two official holidays with street parades through Roseau — expect closures and blocked streets in the capital."
    });
  }
  if (HOLIDAYS["Montserrat"]) {
    HOLIDAYS["Montserrat"].push({
      n: "St Patrick's Festival", r: { k: "fixed", m: 3, d: 17 }, len: 1, sev: 1,
      note: "The only place outside Ireland where 17 March is a public holiday — schools and most businesses close, the whole island is at the parades, and the tiny stock of rooms sells out."
    });
  }
  if (HOLIDAYS["British Virgin Islands"]) {
    HOLIDAYS["British Virgin Islands"].push({
      n: "Emancipation Festival", r: { k: "nth", m: 8, wd: 1, n: 1 }, len: 3, sev: 1,
      note: "Three consecutive public holidays — Monday, Tuesday and Wednesday — which is unusual, so plan around it. No alcohol is sold anywhere before 6pm on Good Friday either."
    });
  }
  if (HOLIDAYS["Aruba"]) {
    HOLIDAYS["Aruba"].push({
      n: "Carnival Monday", r: { k: "easter", off: -48 }, len: 1, sev: 1,
      note: "Oranjestad closes its parade route for the Grand Parade on the Sunday, then most shops and all offices close on the Monday to recover."
    });
    HOLIDAYS["Aruba"].push({
      n: "National day", r: { k: "fixedset", days: [[1, 25], [3, 18]] }, len: 1, sev: 1,
      note: "Supermarkets close entirely on these — not just early — and the banks are shut. Stock up the day before."
    });
  }
  if (HOLIDAYS["Curaçao"]) {
    HOLIDAYS["Curaçao"].push({
      n: "Carnival Monday", r: { k: "easter", off: -48 }, len: 1, sev: 1,
      note: "Willemstad shuts its parade route for the Gran Marcha on the Sunday, then most shops and offices close on the Monday."
    });
  }
  if (HOLIDAYS["Sint Maarten"]) {
    HOLIDAYS["Sint Maarten"].push({
      n: "Carnival Day", r: { k: "fixed", m: 4, d: 30 }, len: 1, sev: 1,
      note: "A public holiday and the day of the Grand Carnival Parade, which closes central Philipsburg from midday; there's a second parade on 1 May."
    });
  }
  if (HOLIDAYS["Martinique"]) {
    HOLIDAYS["Martinique"].push({
      n: "Carnival (jours gras)", r: { k: "easter", off: -47 }, len: 2, sev: 2,
      note: "Most shops close on Mardi Gras and again on Ash Wednesday, the black-and-white day, and the town centres are given over to parades — treat both as closed."
    });
    HOLIDAYS["Martinique"].push({
      n: "Abolition of Slavery Day", r: { k: "fixed", m: 5, d: 22 }, len: 1, sev: 1,
      note: "A statutory non-working day and the most heavily observed local holiday of the year — shops and businesses close."
    });
  }
  if (HOLIDAYS["Guadeloupe"]) {
    HOLIDAYS["Guadeloupe"].push({
      n: "Carnival (jours gras)", r: { k: "easter", off: -47 }, len: 2, sev: 2,
      note: "Most shops close on Mardi Gras and again on Ash Wednesday, and the town centres are given over to parades."
    });
    HOLIDAYS["Guadeloupe"].push({
      n: "Abolition of Slavery Day", r: { k: "fixed", m: 5, d: 27 }, len: 1, sev: 1,
      note: "A statutory non-working day and the most heavily observed local holiday of the year."
    });
  }
  if (HOLIDAYS["Saint-Martin"]) {
    HOLIDAYS["Saint-Martin"].push({
      n: "Abolition of Slavery Day", r: { k: "fixed", m: 5, d: 28 }, len: 1, sev: 1,
      note: "A local holiday on the French side only — the Dutch side works normally, so cross the border if you need a bank."
    });
  }
  if (HOLIDAYS["Réunion"]) {
    HOLIDAYS["Réunion"].push({
      n: "Fete Kaf (abolition of slavery)", r: { k: "fixed", m: 12, d: 20 }, len: 1, sev: 1,
      note: "A real Reunionnais holiday with island-wide sega and maloya street celebrations — the administrations close, though in the pre-Christmas rush a growing number of shops open anyway."
    });
  }
  if (HOLIDAYS["Mayotte"]) {
    HOLIDAYS["Mayotte"].push(P.ramadan(0, "Hours shorten and shift, there's little activity in the afternoon, and everything comes alive after sunset."));
    HOLIDAYS["Mayotte"].push(P.eidFitr(2, 2, "Administrations, banks and Mahoran-run shops close across Mamoudzou and the villages."));
    HOLIDAYS["Mayotte"].push(P.eidAdha(2, 1, "Widely observed — family businesses close even where it isn't a statutory day off."));
  }
  if (HOLIDAYS["French Guiana"]) {
    HOLIDAYS["French Guiana"].push({
      n: "Carnival (jours gras)", r: { k: "easter", off: -48 }, len: 3, sev: 1,
      cities: ["Cayenne"],
      note: "Cayenne shuts every municipal service for three days and runs on skeleton staff — banks and many shops follow, and the parades close the centre."
    });
  }
  if (HOLIDAYS["Botswana"]) {
    HOLIDAYS["Botswana"].push({
      n: "President's Day", r: { k: "nth", m: 7, wd: 1, n: 3 }, len: 2, sev: 1,
      note: "A two-day long weekend in mid-July — banks and offices closed, and locals travel, so domestic flights and lodges fill."
    });
    HOLIDAYS["Botswana"].push({
      n: "Peak safari season", r: { k: "range", m1: 7, d1: 1, m2: 8, d2: 31 }, len: 0, sev: 0,
      note: "Okavango and Chobe camps sell out up to a year ahead in July and August and rates roughly double — book very early or come in the shoulder season."
    });
  }
  if (HOLIDAYS["Uganda"]) {
    HOLIDAYS["Uganda"].push({
      n: "Martyrs' Day", r: { k: "fixed", m: 6, d: 3 }, len: 1, sev: 0,
      note: "Up to two million pilgrims converge on Namugongo shrine — the roads in are closed or made one-way from midnight, and Kampala's hotels and buses fill with arrivals from five countries."
    });
    HOLIDAYS["Uganda"].push(P.eidFitr(1, 1, W.eidOffice));
  }
  if (HOLIDAYS["Seychelles"]) {
    HOLIDAYS["Seychelles"].push({
      n: "Christmas and New Year peak", r: { k: "range", m1: 12, d1: 20, m2: 1, d2: 5 }, len: 0, sev: 0,
      note: "The busiest and priciest fortnight of the year — villas and beachfront hotels book out months ahead at well above normal rates, often with minimum stays."
    });
  }

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
    "Holland": "Netherlands",
    /* Autonomous regions that follow their parent country's calendar. */
    "Finland (Åland)": "Finland",
    "Norway (Svalbard)": "Norway",
    /* Alternate spellings that appear in destinations.js. */
    "Myanmar (Burma)": "Myanmar",
    "Burma": "Myanmar",
    "Gambia": "The Gambia",
    "DR Congo": "Democratic Republic of the Congo",
    "Congo": "Republic of the Congo",
    "Ivory Coast": "Côte d'Ivoire",
    "Cote d'Ivoire": "Côte d'Ivoire",
    "Cape Verde": "Cabo Verde",
    "Saint Kitts and Nevis": "St. Kitts and Nevis",
    "Trinidad & Tobago": "Trinidad and Tobago",
    "Bosnia & Herzegovina": "Bosnia and Herzegovina",
    "Antigua & Barbuda": "Antigua and Barbuda",
    "US Virgin Islands": "U.S. Virgin Islands",
    "Curacao": "Curaçao",
    "Reunion": "Réunion",
    "Sao Tome and Principe": "São Tomé and Príncipe",
    "Timor Leste": "Timor-Leste",
    "East Timor": "Timor-Leste"
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

  /* Standing rules for a country — the always-true ones, for the city
     page. Returns [{title, note}], or [] if there's nothing to say. */
  function standing(country) {
    var list = STANDING[ALIAS[country] || country];
    if (!list) return [];
    return list.map(function (s) { return { title: s.t, note: s.d }; });
  }

  window.NRA_HOLIDAYS = {
    find: find,
    standing: standing,
    covers: covers,
    countries: function () { return Object.keys(HOLIDAYS); },
    /* exposed for testing */
    _easter: easter,
    _orthEaster: orthEaster,
    _iso: iso
  };
})();
