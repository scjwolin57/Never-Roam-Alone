/* Never Roam Alone — shared internationalisation.
 *
 * - Injects a language dropdown into the nav bar on every page.
 * - Hand-translates the INTERFACE (menus, buttons, headings, tool labels & options)
 *   instantly via the DICT below + a DOM text-node walk. No network, works offline.
 * - Translates LONG-FORM content (elements marked class="i18n-ml") via the
 *   translation proxy at /.netlify/functions/translate (graceful no-op if unreachable).
 * - Remembers the chosen language across pages (localStorage).
 *
 * To add interface strings: add an English key to DICT with es/fr/it/zh values.
 */
(function () {
  "use strict";

  var LANGS = { en: "English", es: "Español", fr: "Français", it: "Italiano", zh: "中文" };
  var STORE = "nra_lang";

  /* ---- Interface dictionary (English source -> translations) ---- */
  var DICT = {
    "Home": { es: "Inicio", fr: "Accueil", it: "Home", zh: "主页" },
    "Blog": { es: "Blog", fr: "Blog", it: "Blog", zh: "博客" },
    "Map": { es: "Mapa", fr: "Carte", it: "Mappa", zh: "地图" },
    "Destination Finder Tools": { es: "Buscador de destinos", fr: "Outils de destination", it: "Trova destinazioni", zh: "目的地查找工具" },

    "A world worth sharing": { es: "Un mundo que vale la pena compartir", fr: "Un monde à partager", it: "Un mondo da condividere", zh: "值得分享的世界" },
    "Find your next story on the map": { es: "Encuentra tu próxima historia en el mapa", fr: "Trouvez votre prochaine histoire sur la carte", it: "Trova la tua prossima storia sulla mappa", zh: "在地图上找到你的下一个故事" },
    "Who's behind the wandering": { es: "Quién está detrás del viaje", fr: "Qui se cache derrière l'errance", it: "Chi c'è dietro il viaggio", zh: "漫游背后的人" },
    "The Blog": { es: "El blog", fr: "Le blog", it: "Il blog", zh: "博客" },
    "Latest from the road": { es: "Lo último del camino", fr: "Dernières du voyage", it: "Ultime dal viaggio", zh: "旅途最新" },
    "Read story →": { es: "Leer historia →", fr: "Lire l'article →", it: "Leggi la storia →", zh: "阅读故事 →" },
    "Back to the map": { es: "Volver al mapa", fr: "Retour à la carte", it: "Torna alla mappa", zh: "返回地图" },
    "← Back to the map": { es: "← Volver al mapa", fr: "← Retour à la carte", it: "← Torna alla mappa", zh: "← 返回地图" },
    "← Back to all stories": { es: "← Volver a las historias", fr: "← Retour aux articles", it: "← Torna alle storie", zh: "← 返回所有故事" },

    /* Destination Finder */
    "Not sure where to roam?": { es: "¿No sabes a dónde ir?", fr: "Vous ne savez pas où aller ?", it: "Non sai dove andare?", zh: "不知道去哪里？" },
    "Help Me Choose": { es: "Ayúdame a elegir", fr: "Aidez-moi à choisir", it: "Aiutami a scegliere", zh: "帮我选择" },
    "Favorite Travel Activities": { es: "Actividades de viaje favoritas", fr: "Activités de voyage préférées", it: "Attività di viaggio preferite", zh: "喜爱的旅行活动" },
    "Travel Budget": { es: "Presupuesto de viaje", fr: "Budget de voyage", it: "Budget di viaggio", zh: "旅行预算" },
    "Mode of Travel": { es: "Medio de transporte", fr: "Mode de transport", it: "Mezzo di trasporto", zh: "出行方式" },
    "Visa free or do I need?": { es: "¿Sin visa o la necesito?", fr: "Sans visa ou pas ?", it: "Senza visto o serve?", zh: "免签还是需要签证？" },

    "Select an activity…": { es: "Selecciona una actividad…", fr: "Choisir une activité…", it: "Seleziona un'attività…", zh: "选择一项活动…" },
    "Nightlife": { es: "Vida nocturna", fr: "Vie nocturne", it: "Vita notturna", zh: "夜生活" },
    "Restaurants": { es: "Restaurantes", fr: "Restaurants", it: "Ristoranti", zh: "餐厅" },
    "Museums & Culture": { es: "Museos y cultura", fr: "Musées et culture", it: "Musei e cultura", zh: "博物馆与文化" },
    "Architecture": { es: "Arquitectura", fr: "Architecture", it: "Architettura", zh: "建筑" },
    "Nature": { es: "Naturaleza", fr: "Nature", it: "Natura", zh: "自然" },

    "Select your budget…": { es: "Selecciona tu presupuesto…", fr: "Choisir votre budget…", it: "Seleziona il tuo budget…", zh: "选择你的预算…" },
    "Can't afford much right now but I want to go somewhere": { es: "No puedo gastar mucho ahora, pero quiero ir a algún lugar", fr: "Je ne peux pas dépenser beaucoup, mais je veux partir quelque part", it: "Non posso spendere molto ora, ma voglio andare da qualche parte", zh: "现在预算不多，但我想去某个地方" },
    "I have a bit to spend but I'm still keeping it low": { es: "Tengo algo para gastar, pero quiero mantenerlo bajo", fr: "J'ai un peu à dépenser, mais je reste raisonnable", it: "Ho un po' da spendere, ma resto basso", zh: "有一点预算，但仍想省着花" },
    "I'm open to a flexible budget depending on the itinerary": { es: "Estoy abierto a un presupuesto flexible según el itinerario", fr: "Je suis ouvert à un budget flexible selon l'itinéraire", it: "Sono aperto a un budget flessibile in base all'itinerario", zh: "可以根据行程灵活安排预算" },
    "I have a good bit of money set aside for this trip": { es: "Tengo bastante dinero reservado para este viaje", fr: "J'ai mis pas mal d'argent de côté pour ce voyage", it: "Ho messo da parte parecchi soldi per questo viaggio", zh: "为这次旅行准备了不少钱" },
    "Money is no object, I want the best": { es: "El dinero no importa, quiero lo mejor", fr: "L'argent n'est pas un problème, je veux le meilleur", it: "Il denaro non è un problema, voglio il meglio", zh: "不在乎花费，我要最好的" },

    "My preferred method of travel is:": { es: "Mi medio de transporte preferido es:", fr: "Mon mode de transport préféré est :", it: "Il mio mezzo preferito è:", zh: "我偏好的出行方式是：" },
    "Select a mode…": { es: "Selecciona un medio…", fr: "Choisir un mode…", it: "Seleziona un mezzo…", zh: "选择方式…" },
    "Plane": { es: "Avión", fr: "Avion", it: "Aereo", zh: "飞机" },
    "Train": { es: "Tren", fr: "Train", it: "Treno", zh: "火车" },
    "Boat": { es: "Barco", fr: "Bateau", it: "Barca", zh: "船" },
    "Bus": { es: "Autobús", fr: "Bus", it: "Autobus", zh: "巴士" },
    "Car": { es: "Coche", fr: "Voiture", it: "Auto", zh: "汽车" },
    "Any": { es: "Cualquiera", fr: "Tout", it: "Qualsiasi", zh: "任意" },

    "When are you traveling?": { es: "¿Cuándo viajas?", fr: "Quand voyagez-vous ?", it: "Quando viaggi?", zh: "你什么时候出行？" },
    "Departure": { es: "Salida", fr: "Départ", it: "Partenza", zh: "出发" },
    "Return": { es: "Regreso", fr: "Retour", it: "Ritorno", zh: "返回" },
    "Select a date": { es: "Selecciona una fecha", fr: "Choisir une date", it: "Seleziona una data", zh: "选择日期" },
    "Add return travel (round trip)": { es: "Añadir regreso (ida y vuelta)", fr: "Ajouter un retour (aller-retour)", it: "Aggiungi ritorno (andata e ritorno)", zh: "添加返程（往返）" },
    "Flight stops": { es: "Escalas", fr: "Escales", it: "Scali", zh: "经停" },
    "I only want a direct flight": { es: "Solo quiero un vuelo directo", fr: "Je veux seulement un vol direct", it: "Voglio solo un volo diretto", zh: "我只想要直飞航班" },
    "I'm fine with one stop": { es: "Me parece bien una escala", fr: "Une escale me convient", it: "Una scalo va bene", zh: "一次经停也可以" },
    "Multiple stops are ok": { es: "Varias escalas están bien", fr: "Plusieurs escales, c'est bon", it: "Più scali vanno bene", zh: "多次经停也没问题" },

    "I hold a passport from the following country": { es: "Tengo pasaporte del siguiente país", fr: "Je détiens un passeport du pays suivant", it: "Ho un passaporto del seguente paese", zh: "我持有以下国家的护照" },
    "Select your country…": { es: "Selecciona tu país…", fr: "Choisir votre pays…", it: "Seleziona il tuo paese…", zh: "选择你的国家…" },

    /* Hero, legend, footer (landing page) */
    "Spin the globe, zoom into a country, and hover over a city to see how many travelers wander its streets each year. Then read how it felt to be one of them.": { es: "Gira el globo, acércate a un país y pasa el cursor sobre una ciudad para ver cuántos viajeros recorren sus calles cada año. Luego lee cómo se sintió ser uno de ellos.", fr: "Faites tourner le globe, zoomez sur un pays et survolez une ville pour voir combien de voyageurs parcourent ses rues chaque année. Puis découvrez ce que l'on ressent à en faire partie.", it: "Fai girare il globo, ingrandisci un paese e passa il mouse su una città per vedere quanti viaggiatori percorrono le sue strade ogni anno. Poi leggi com'è stato essere uno di loro.", zh: "转动地球，放大某个国家，将鼠标悬停在城市上，查看每年有多少旅行者走过它的街道，然后阅读身临其境的感受。" },
    "Annual international visitors": { es: "Visitantes internacionales al año", fr: "Visiteurs internationaux par an", it: "Visitatori internazionali all'anno", zh: "年度国际游客" },
    "~5 million": { es: "~5 millones", fr: "~5 millions", it: "~5 milioni", zh: "约500万" },
    "~12 million": { es: "~12 millones", fr: "~12 millions", it: "~12 milioni", zh: "约1200万" },
    "20 million +": { es: "20 millones +", fr: "20 millions +", it: "20 milioni +", zh: "2000万+" },
    "Hover a bubble for details": { es: "Pasa el cursor sobre una burbuja para ver detalles", fr: "Survolez une bulle pour les détails", it: "Passa sulla bolla per i dettagli", zh: "将鼠标悬停在气泡上查看详情" },
    "Prototype · interactive map + blog layout · built to be refined": { es: "Prototipo · mapa interactivo + diseño del blog · pendiente de pulir", fr: "Prototype · carte interactive + mise en page du blog · à peaufiner", it: "Prototipo · mappa interattiva + layout del blog · da rifinire", zh: "原型 · 交互式地图 + 博客布局 · 有待完善" },

    /* Destination Finder notes, disclaimers, empty/result states */
    "Tell us what matters most on a trip and we'll point you toward the cities you'll love.": { es: "Dinos qué es lo más importante en un viaje y te mostraremos las ciudades que te encantarán.", fr: "Dites-nous ce qui compte le plus en voyage et nous vous orienterons vers les villes que vous adorerez.", it: "Dicci cosa conta di più in un viaggio e ti indicheremo le città che amerai.", zh: "告诉我们你最看重旅行中的什么，我们会为你推荐你会爱上的城市。" },
    "Let us help you curate the best trip based off your travel budget.": { es: "Déjanos ayudarte a diseñar el mejor viaje según tu presupuesto.", fr: "Laissez-nous composer le meilleur voyage selon votre budget.", it: "Lascia che ti aiutiamo a creare il viaggio migliore in base al tuo budget.", zh: "让我们根据你的预算为你打造最佳行程。" },
    "Pick an activity above to see matching destinations.": { es: "Elige una actividad arriba para ver destinos que coincidan.", fr: "Choisissez une activité ci-dessus pour voir les destinations correspondantes.", it: "Scegli un'attività qui sopra per vedere le destinazioni corrispondenti.", zh: "在上方选择一项活动，查看匹配的目的地。" },
    "Major stations are a curated starter list — easy to expand later. Pick one to set it as your origin.": { es: "Las estaciones principales son una lista inicial seleccionada, fácil de ampliar. Elige una para usarla como origen.", fr: "Les gares principales sont une liste de départ sélectionnée, facile à étoffer. Choisissez-en une comme point de départ.", it: "Le stazioni principali sono un elenco iniziale selezionato, facile da ampliare. Scegline una come punto di partenza.", zh: "主要车站是精选的初始列表，方便日后扩展。选择一个作为你的出发地。" },
    "These are illustrative sample flights for the prototype — not real schedules, prices, or availability. Live flight search will be powered by a flights API (e.g. Amadeus or Duffel) in the production build.": { es: "Estos son vuelos de muestra para el prototipo, no horarios, precios ni disponibilidad reales. La búsqueda de vuelos en vivo funcionará con una API de vuelos en la versión final.", fr: "Ce sont des vols d'exemple pour le prototype — ni horaires, ni prix, ni disponibilités réels. La recherche de vols en direct utilisera une API de vols dans la version finale.", it: "Questi sono voli di esempio per il prototipo, non orari, prezzi o disponibilità reali. La ricerca voli dal vivo userà un'API voli nella versione finale.", zh: "这些是原型用的示例航班，并非真实的时刻、价格或可用性。正式版的实时航班搜索将由航班 API 提供支持。" },
    "Loading live destinations…": { es: "Cargando destinos en vivo…", fr: "Chargement des destinations…", it: "Caricamento destinazioni…", zh: "正在加载实时目的地…" },
    "No destinations returned for that date — try another date or allow more stops.": { es: "No se encontraron destinos para esa fecha. Prueba otra fecha o permite más escalas.", fr: "Aucune destination pour cette date — essayez une autre date ou autorisez plus d'escales.", it: "Nessuna destinazione per quella data — prova un'altra data o consenti più scali.", zh: "该日期没有返回目的地——请尝试其他日期或允许更多经停。" },
    "No direct flights found for that date — try allowing a stop.": { es: "No hay vuelos directos para esa fecha. Prueba permitiendo una escala.", fr: "Aucun vol direct pour cette date — essayez d'autoriser une escale.", it: "Nessun volo diretto per quella data — prova a consentire uno scalo.", zh: "该日期没有直飞航班——请尝试允许一次经停。" },
    "Direct": { es: "Directo", fr: "Direct", it: "Diretto", zh: "直达" },
    "1 stop": { es: "1 escala", fr: "1 escale", it: "1 scalo", zh: "1 次经停" },
    "Verify ›": { es: "Verificar ›", fr: "Vérifier ›", it: "Verifica ›", zh: "核实 ›" },

    /* City page facts */
    "Country": { es: "País", fr: "Pays", it: "Paese", zh: "国家" },
    "Annual visitors": { es: "Visitantes anuales", fr: "Visiteurs annuels", it: "Visitatori annui", zh: "年度游客" },
    "Coordinates": { es: "Coordenadas", fr: "Coordonnées", it: "Coordinate", zh: "坐标" },
    "Best time to visit": { es: "Mejor época para visitar", fr: "Meilleure période pour visiter", it: "Periodo migliore per visitare", zh: "最佳出行时间" },

    /* Map caption (landing page) */
    "Drag to pan · scroll to zoom · hover a bubble for the number · click a city to open its page. Figures are approximate starter data (Euromonitor / Mastercard rankings) and will be refined.": { es: "Arrastra para mover · desplázate para acercar · pasa el cursor sobre una burbuja para ver el número · haz clic en una ciudad para abrir su página. Las cifras son datos iniciales aproximados (rankings de Euromonitor / Mastercard) y se afinarán.", fr: "Faites glisser pour vous déplacer · faites défiler pour zoomer · survolez une bulle pour voir le nombre · cliquez sur une ville pour ouvrir sa page. Les chiffres sont des données initiales approximatives (classements Euromonitor / Mastercard) et seront affinés.", it: "Trascina per spostarti · scorri per ingrandire · passa sulla bolla per vedere il numero · clicca su una città per aprire la sua pagina. Le cifre sono dati iniziali approssimativi (classifiche Euromonitor / Mastercard) e verranno affinate.", zh: "拖动以平移 · 滚动以缩放 · 将鼠标悬停在气泡上查看数量 · 点击城市打开其页面。数据为大致的初始数据（Euromonitor / Mastercard 排名），将进一步完善。" },

    /* Input placeholders */
    "Filter destinations…": { es: "Filtrar destinos…", fr: "Filtrer les destinations…", it: "Filtra destinazioni…", zh: "筛选目的地…" },
    "Start typing a city or airport code…": { es: "Empieza a escribir una ciudad o código de aeropuerto…", fr: "Commencez à taper une ville ou un code d'aéroport…", it: "Inizia a digitare una città o un codice aeroporto…", zh: "开始输入城市或机场代码…" },
    "Start typing a city or train station…": { es: "Empieza a escribir una ciudad o estación de tren…", fr: "Commencez à taper une ville ou une gare…", it: "Inizia a digitare una città o una stazione…", zh: "开始输入城市或火车站…" },
    "Start typing a city or port…": { es: "Empieza a escribir una ciudad o puerto…", fr: "Commencez à taper une ville ou un port…", it: "Inizia a digitare una città o un porto…", zh: "开始输入城市或港口…" },
    "Start typing a city or bus station…": { es: "Empieza a escribir una ciudad o estación de autobuses…", fr: "Commencez à taper une ville ou une gare routière…", it: "Inizia a digitare una città o una stazione degli autobus…", zh: "开始输入城市或汽车站…" },
    "Start typing a city…": { es: "Empieza a escribir una ciudad…", fr: "Commencez à taper une ville…", it: "Inizia a digitare una città…", zh: "开始输入城市…" },

    /* Summary chip words (flights + visa) */
    "direct": { es: "directos", fr: "directs", it: "diretti", zh: "直达" },
    "one-stop": { es: "con 1 escala", fr: "à 1 escale", it: "con 1 scalo", zh: "1 次经停" },
    "multi-stop": { es: "con varias escalas", fr: "à plusieurs escales", it: "con più scali", zh: "多次经停" },
    "visa-free": { es: "sin visa", fr: "sans visa", it: "senza visto", zh: "免签" },
    "on arrival": { es: "a la llegada", fr: "à l'arrivée", it: "all'arrivo", zh: "落地签" },
    "visa required": { es: "visa requerida", fr: "visa requis", it: "visto richiesto", zh: "需要签证" },
    "no admission": { es: "sin admisión", fr: "non admis", it: "nessun ingresso", zh: "不可入境" }
  };

  /* ---- Storage ---- */
  function getLang() { try { return localStorage.getItem(STORE) || "en"; } catch (e) { return "en"; } }
  function setLang(l) { try { localStorage.setItem(STORE, l); } catch (e) {} }

  /* ---- Interface translation via DOM text-node walk ---- */
  var originals = new WeakMap();
  function translateNode(orig, lang) {
    var key = orig.trim();
    var entry = DICT[key];
    if (entry && entry[lang]) return orig.replace(key, entry[lang]);
    return orig;
  }
  function applyInterface(lang) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.nodeName === "SCRIPT" || p.nodeName === "STYLE") return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest("[data-no-i18n]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (!originals.has(n)) originals.set(n, n.nodeValue);
      var orig = originals.get(n);
      n.nodeValue = (lang === "en") ? orig : translateNode(orig, lang);
    });
  }

  /* ---- Placeholder attributes (not text nodes, so handled separately) ---- */
  var phOriginals = new WeakMap();
  function translatePlaceholders(lang) {
    var els = document.querySelectorAll("[placeholder]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var ph = el.getAttribute("placeholder");
      if (lang === "en") {
        if (phOriginals.has(el)) el.setAttribute("placeholder", phOriginals.get(el));
        continue;
      }
      var entry = DICT[ph];            // only English (dictionary keys) get translated
      if (entry) {
        phOriginals.set(el, ph);
        if (entry[lang]) el.setAttribute("placeholder", entry[lang]);
      }
    }
  }

  /* ---- Long-form translation via the translation proxy ---- */
  var mlCache = {}; // key: lang + "::" + original text -> translated
  function applyLongform(lang) {
    var blocks = [].slice.call(document.querySelectorAll(".i18n-ml p, .i18n-ml h2, .i18n-ml h3, .i18n-ml li, .i18n-ml blockquote, .i18n-ml .lead, .i18n-ml .tagline"));
    if (!blocks.length) return;
    // store originals once
    blocks.forEach(function (el) { if (!originals.has(el)) originals.set(el, el.textContent); });
    if (lang === "en") { blocks.forEach(function (el) { el.textContent = originals.get(el); }); return; }

    var need = [], needEls = [];
    blocks.forEach(function (el) {
      var orig = originals.get(el);
      var ck = lang + "::" + orig;
      if (mlCache[ck] != null) { el.textContent = mlCache[ck]; }
      else { need.push(orig); needEls.push(el); }
    });
    if (!need.length) return;

    fetch("/.netlify/functions/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: need, to: lang })
    }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        var t = d.translations || [];
        needEls.forEach(function (el, i) {
          if (t[i]) { el.textContent = t[i]; mlCache[lang + "::" + originals.get(el)] = t[i]; }
        });
      })
      .catch(function () { /* leave original text if the proxy is unreachable */ });
  }

  /* ---- Apply everything for a language ---- */
  function reapply(lang) { applyInterface(lang); translatePlaceholders(lang); }
  function apply(lang) {
    document.documentElement.setAttribute("lang", lang);
    reapply(lang);
    applyLongform(lang);
  }
  // exposed so pages can re-run interface translation after rendering dynamic UI
  window.NRA_i18n = { apply: function () { reapply(getLang()); }, lang: getLang };

  /* ---- Build + insert the language dropdown ---- */
  function injectStyles() {
    var css = ".nra-lang{margin-left:22px;display:flex;align-items:center}" +
      ".nra-lang select{appearance:none;-webkit-appearance:none;font-family:inherit;font-weight:600;font-size:.9rem;" +
      "color:#5b6b75;background:rgba(24,94,63,.06);border:1.5px solid rgba(24,94,63,.2);border-radius:20px;" +
      "padding:7px 30px 7px 14px;cursor:pointer;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><path d='M1 3l4 4 4-4' stroke='%230e7c86' stroke-width='1.6' fill='none' stroke-linecap='round'/></svg>\");" +
      "background-repeat:no-repeat;background-position:right 12px center}" +
      ".nra-lang select:focus{outline:none;border-color:#185e3f}" +
      "@media(max-width:820px){.nra-lang{margin-left:12px}}";
    var s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }
  function injectDropdown() {
    var host = document.querySelector("header.nav .nav-inner");
    if (!host) return;
    var wrap = document.createElement("div");
    wrap.className = "nra-lang";
    wrap.setAttribute("data-no-i18n", "");
    var sel = document.createElement("select");
    sel.setAttribute("aria-label", "Language");
    Object.keys(LANGS).forEach(function (code) {
      var o = document.createElement("option");
      o.value = code; o.textContent = LANGS[code];
      sel.appendChild(o);
    });
    sel.value = getLang();
    sel.addEventListener("change", function () { setLang(sel.value); apply(sel.value); });
    wrap.appendChild(sel);
    host.appendChild(wrap);
  }

  // Re-translate interface strings when the page renders new content dynamically
  // (e.g. flight/visa/destination results). Watches only node additions, so it
  // never loops on its own text changes.
  function observeDynamic() {
    var pending = false;
    var obs = new MutationObserver(function (muts) {
      if (getLang() === "en") return;
      var relevant = false;
      for (var i = 0; i < muts.length; i++) {
        if ((muts[i].addedNodes && muts[i].addedNodes.length) || muts[i].type === "attributes") { relevant = true; break; }
      }
      if (!relevant || pending) return;
      pending = true;
      (window.requestAnimationFrame || window.setTimeout)(function () { pending = false; reapply(getLang()); }, 0);
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["placeholder"] });
  }

  function init() {
    injectStyles();
    injectDropdown();
    apply(getLang());
    observeDynamic();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
