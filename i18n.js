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
  /* ---- Event calendar (city.html) ---- */
  "Sun":{es:"Dom",fr:"Dim",it:"Dom",zh:"周日"},
  "Mon":{es:"Lun",fr:"Lun",it:"Lun",zh:"周一"},
  "Tue":{es:"Mar",fr:"Mar",it:"Mar",zh:"周二"},
  "Wed":{es:"Mié",fr:"Mer",it:"Mer",zh:"周三"},
  "Thu":{es:"Jue",fr:"Jeu",it:"Gio",zh:"周四"},
  "Fri":{es:"Vie",fr:"Ven",it:"Ven",zh:"周五"},
  "Sat":{es:"Sáb",fr:"Sam",it:"Sab",zh:"周六"},
  "January":{es:"Enero",fr:"Janvier",it:"Gennaio",zh:"一月"},
  "February":{es:"Febrero",fr:"Février",it:"Febbraio",zh:"二月"},
  "March":{es:"Marzo",fr:"Mars",it:"Marzo",zh:"三月"},
  "April":{es:"Abril",fr:"Avril",it:"Aprile",zh:"四月"},
  "May":{es:"Mayo",fr:"Mai",it:"Maggio",zh:"五月"},
  "June":{es:"Junio",fr:"Juin",it:"Giugno",zh:"六月"},
  "July":{es:"Julio",fr:"Juillet",it:"Luglio",zh:"七月"},
  "August":{es:"Agosto",fr:"Août",it:"Agosto",zh:"八月"},
  "September":{es:"Septiembre",fr:"Septembre",it:"Settembre",zh:"九月"},
  "October":{es:"Octubre",fr:"Octobre",it:"Ottobre",zh:"十月"},
  "November":{es:"Noviembre",fr:"Novembre",it:"Novembre",zh:"十一月"},
  "December":{es:"Diciembre",fr:"Décembre",it:"Dicembre",zh:"十二月"},
  "+ Submit an event":{es:"+ Enviar un evento",fr:"+ Proposer un événement",it:"+ Invia un evento",zh:"+ 提交活动"},
  "Submit an event":{es:"Enviar un evento",fr:"Proposer un événement",it:"Invia un evento",zh:"提交活动"},
  "Send for review":{es:"Enviar para revisión",fr:"Envoyer pour révision",it:"Invia per revisione",zh:"提交审核"},
  "Thank you":{es:"Gracias",fr:"Merci",it:"Grazie",zh:"谢谢"},
  "Your event has been submitted for review. You'll be notified by email when it's added to the calendar.":{es:"Tu evento se ha enviado para revisión. Te avisaremos por correo electrónico cuando se añada al calendario.",fr:"Votre événement a été soumis pour révision. Vous serez informé par e-mail lorsqu'il sera ajouté au calendrier.",it:"Il tuo evento è stato inviato per la revisione. Ti avviseremo via e-mail quando verrà aggiunto al calendario.",zh:"您的活动已提交审核。添加到日历后，我们会通过电子邮件通知您。"},
  "Event name *":{es:"Nombre del evento *",fr:"Nom de l'événement *",it:"Nome dell'evento *",zh:"活动名称 *"},
  "Location *":{es:"Ubicación *",fr:"Lieu *",it:"Luogo *",zh:"地点 *"},
  "Map link *":{es:"Enlace de mapa *",fr:"Lien de carte *",it:"Link mappa *",zh:"地图链接 *"},
  "Date *":{es:"Fecha *",fr:"Date *",it:"Data *",zh:"日期 *"},
  "Start time *":{es:"Hora de inicio *",fr:"Heure de début *",it:"Ora di inizio *",zh:"开始时间 *"},
  "End time":{es:"Hora de fin",fr:"Heure de fin",it:"Ora di fine",zh:"结束时间"},
  "Event link":{es:"Enlace del evento",fr:"Lien de l'événement",it:"Link dell'evento",zh:"活动链接"},
  "Event poster":{es:"Cartel del evento",fr:"Affiche de l'événement",it:"Locandina dell'evento",zh:"活动海报"},
  "Event question contact":{es:"Contacto para preguntas",fr:"Contact pour questions",it:"Contatto per domande",zh:"活动咨询联系方式"},
  "Organizer name *":{es:"Nombre del organizador *",fr:"Nom de l'organisateur *",it:"Nome dell'organizzatore *",zh:"组织者姓名 *"},
  "Your email *":{es:"Tu correo electrónico *",fr:"Votre e-mail *",it:"La tua email *",zh:"您的邮箱 *"},
  "Email address":{es:"Correo electrónico",fr:"Adresse e-mail",it:"Indirizzo email",zh:"电子邮箱"},
  "Phone number":{es:"Número de teléfono",fr:"Numéro de téléphone",it:"Numero di telefono",zh:"电话号码"},
  "Social media link":{es:"Enlace de redes sociales",fr:"Lien de réseau social",it:"Link social",zh:"社交媒体链接"},
  "Allow attendees to contact the organizer with questions":{es:"Permitir que los asistentes contacten al organizador con preguntas",fr:"Autoriser les participants à contacter l'organisateur pour des questions",it:"Consenti ai partecipanti di contattare l'organizzatore per domande",zh:"允许参加者就问题联系组织者"},
  "Questions:":{es:"Preguntas:",fr:"Questions :",it:"Domande:",zh:"咨询："},
  "Event details ↗":{es:"Detalles del evento ↗",fr:"Détails de l'événement ↗",it:"Dettagli dell'evento ↗",zh:"活动详情 ↗"},
  "No upcoming events listed yet — be the first to submit one!":{es:"Aún no hay eventos próximos — ¡sé el primero en enviar uno!",fr:"Aucun événement à venir pour l'instant — soyez le premier à en proposer un !",it:"Nessun evento in programma — sii il primo a inviarne uno!",zh:"暂无即将举行的活动 — 快来第一个提交吧！"},
  "Loading events…":{es:"Cargando eventos…",fr:"Chargement des événements…",it:"Caricamento eventi…",zh:"正在加载活动…"},
  "← Back to City Guides": {es:"← Volver a las guías",fr:"← Retour aux guides",it:"← Torna alle guide",zh:"← 返回城市指南"},
  "How long should you stay?": {es:"¿Cuánto tiempo quedarte?",fr:"Combien de temps rester ?",it:"Quanto tempo restare?",zh:"该停留多久？"},
  "days": {es:"días",fr:"jours",it:"giorni",zh:"天"},
  "day": {es:"día",fr:"jour",it:"giorno",zh:"天"},
  "Scratch the surface": {es:"Solo lo esencial",fr:"Un aperçu",it:"Un assaggio",zh:"浅尝辄止"},
  "Just the sights": {es:"Solo los imprescindibles",fr:"Rien que les sites",it:"Solo le attrazioni",zh:"只看景点"},
  "Sightseeing is quick here — longer stays are for beach and boat days.": {es:"Las visitas son rápidas aquí; las estancias largas son de playa y barco.",fr:"Les visites sont rapides ici ; on reste plus longtemps pour la plage et le bateau.",it:"Le visite qui sono rapide: si resta piu a lungo per mare e barca.",zh:"这里的观光很快，住久是为了海滩和出海。"},
  "Leisurely explore": {es:"Explorar con calma",fr:"Explorer tranquillement",it:"Esplorare con calma",zh:"悠闲探索"},
  "Deeper dive": {es:"Explorar a fondo",fr:"Explorer en profondeur",it:"Esplorazione approfondita",zh:"深入探索"},
  "Live like a local": {es:"Vivir como un local",fr:"Vivre comme un local",it:"Vivere come un local",zh:"像当地人一样生活"},
  "Best time to visit — avg high temperature": {es:"Mejor época para visitar — temperatura máxima media",fr:"Meilleure période — température maximale moyenne",it:"Periodo migliore — temperatura massima media",zh:"最佳出行时间 — 平均最高气温"},
  "Average measurable rain days per month": {es:"Días de lluvia medibles al mes (promedio)",fr:"Jours de pluie mesurable par mois (moyenne)",it:"Giorni di pioggia misurabile al mese (media)",zh:"每月可测降雨天数（平均）"},
  "Jan – Mar": {es:"Ene – Mar",fr:"Jan – Mar",it:"Gen – Mar",zh:"1月–3月"},
  "Apr – Jun": {es:"Abr – Jun",fr:"Avr – Juin",it:"Apr – Giu",zh:"4月–6月"},
  "Jul – Sep": {es:"Jul – Sep",fr:"Juil – Sep",it:"Lug – Set",zh:"7月–9月"},
  "Oct – Dec": {es:"Oct – Dic",fr:"Oct – Déc",it:"Ott – Dic",zh:"10月–12月"},
  "Population": {es:"Población",fr:"Population",it:"Popolazione",zh:"人口"},
  "annual visitors": {es:"visitantes anuales",fr:"visiteurs annuels",it:"visitatori annuali",zh:"年访客量"},
  "Daily tourist-to-local ratio": {es:"Proporción diaria de turistas por residente",fr:"Ratio quotidien touristes/habitants",it:"Rapporto giornaliero turisti/residenti",zh:"每日游客与居民比例"},
  "Walk score": {es:"Índice peatonal",fr:"Indice piéton",it:"Indice pedonale",zh:"步行指数"},
  "Safety index": {es:"Índice de seguridad",fr:"Indice de sécurité",it:"Indice di sicurezza",zh:"安全指数"},
  "Emergency & embassy": {es:"Emergencias y embajada",fr:"Urgences et ambassade",it:"Emergenze e ambasciata",zh:"紧急电话与大使馆"},
  "Police": {es:"Policía",fr:"Police",it:"Polizia",zh:"警察"},
  "Ambulance / Fire": {es:"Ambulancia / Bomberos",fr:"Ambulance / Pompiers",it:"Ambulanza / Vigili del fuoco",zh:"急救 / 消防"},
  "Find your embassy": {es:"Encuentra tu embajada",fr:"Trouvez votre ambassade",it:"Trova la tua ambasciata",zh:"查找你的大使馆"},
  "Languages spoken by majority": {es:"Idiomas más hablados",fr:"Langues les plus parlées",it:"Lingue più parlate",zh:"主要语言"},
  "Religion by majority": {es:"Religión mayoritaria",fr:"Religion majoritaire",it:"Religione prevalente",zh:"主要宗教"},
  "Currency & converter": {es:"Moneda y conversor",fr:"Devise et convertisseur",it:"Valuta e convertitore",zh:"货币与换算"},
  "Find ATMs & cash": {es:"Buscar cajeros y efectivo",fr:"Trouver DAB et espèces",it:"Trova bancomat e contanti",zh:"查找ATM和现金"},
  "widely accepted": {es:"ampliamente aceptado",fr:"largement accepté",it:"ampiamente accettato",zh:"广泛接受"},
  "limited acceptance": {es:"aceptación limitada",fr:"acceptation limitée",it:"accettazione limitata",zh:"接受度有限"},
  "Major airports": {es:"Aeropuertos principales",fr:"Aéroports principaux",it:"Aeroporti principali",zh:"主要机场"},
  "Major train stations": {es:"Estaciones de tren principales",fr:"Principales gares",it:"Principali stazioni ferroviarie",zh:"主要火车站"},
  "Major bus stations": {es:"Estaciones de autobús principales",fr:"Principales gares routières",it:"Principali stazioni degli autobus",zh:"主要汽车站"},
  "Ferry / boat ports": {es:"Puertos de ferry / barco",fr:"Ports de ferry / bateau",it:"Porti di traghetti / barche",zh:"轮渡 / 船运港口"},
  "Car rental": {es:"Alquiler de coches",fr:"Location de voiture",it:"Noleggio auto",zh:"租车"},
  "More info →": {es:"Más información →",fr:"Plus d'infos →",it:"Più info →",zh:"更多信息 →"},
  "No passenger ferry ports": {es:"Sin puertos de ferry de pasajeros",fr:"Pas de ports de ferry passagers",it:"Nessun porto per traghetti passeggeri",zh:"无客运轮渡港口"},
  "Drives on": {es:"Se conduce por",fr:"Conduite à",it:"Si guida a",zh:"行车方向"},
  "Left side": {es:"Izquierda",fr:"Gauche",it:"Sinistra",zh:"左侧"},
  "Right side": {es:"Derecha",fr:"Droite",it:"Destra",zh:"右侧"},
  "Int'l permit": {es:"Permiso int'l",fr:"Permis int'l",it:"Permesso int'l",zh:"国际驾照"},
  "Recommended": {es:"Recomendado",fr:"Recommandé",it:"Consigliato",zh:"建议"},
  "Required": {es:"Obligatorio",fr:"Obligatoire",it:"Obbligatorio",zh:"必需"},
  "Not required": {es:"No necesario",fr:"Non requis",it:"Non necessario",zh:"不需要"},
  "Mid-size · day": {es:"Mediano · día",fr:"Intermédiaire · jour",it:"Media cilindrata · giorno",zh:"中型车 · 天"},
  "Metro": {es:"Metro",fr:"Métro",it:"Metro",zh:"地铁"},
  "Tram": {es:"Tranvía",fr:"Tramway",it:"Tram",zh:"有轨电车"},
  "Ferry": {es:"Ferry",fr:"Ferry",it:"Traghetto",zh:"轮渡"},
  "BRT": {es:"BRT",fr:"BRT",it:"BRT",zh:"快速公交"},
  "Monorail": {es:"Monorraíl",fr:"Monorail",it:"Monorotaia",zh:"单轨"},
  "Funicular": {es:"Funicular",fr:"Funiculaire",it:"Funicolare",zh:"缆索铁路"},
  "Cable car": {es:"Teleférico",fr:"Téléphérique",it:"Funivia",zh:"缆车"},
  "Mid-range": {es:"Gama media",fr:"Milieu de gamme",it:"Fascia media",zh:"中档"},
  "Recommendation coming soon": {es:"Recomendación próximamente",fr:"Recommandation à venir",it:"Consiglio in arrivo",zh:"推荐即将推出"},
  "Where to drink": {es:"Dónde tomar algo",fr:"Où boire un verre",it:"Dove bere qualcosa",zh:"去哪儿喝一杯"},
  "Where to go out (alcohol-free)": {es:"Dónde salir (sin alcohol)",fr:"Où sortir (sans alcool)",it:"Dove uscire (senza alcol)",zh:"去哪儿消遣（无酒精）"},
  "Dive / local bar": {es:"Bar de barrio",fr:"Bar de quartier",it:"Bar di quartiere",zh:"街坊小酒吧"},
  "Party bar": {es:"Bar de fiesta",fr:"Bar festif",it:"Bar da festa",zh:"派对酒吧"},
  "Cocktail bar": {es:"Coctelería",fr:"Bar à cocktails",it:"Cocktail bar",zh:"鸡尾酒吧"},
  "Pub / casual bar": {es:"Bar o pub",fr:"Pub / bar",it:"Pub / bar",zh:"酒馆"},
  "Coffee house": {es:"Cafetería",fr:"Café",it:"Caffetteria",zh:"咖啡馆"},
  "Late-night hangout": {es:"Lugar para la noche",fr:"Adresse de fin de soirée",it:"Ritrovo notturno",zh:"深夜聚点"},
  "Juice & mocktails": {es:"Zumos y mocktails",fr:"Jus et mocktails",it:"Succhi e mocktail",zh:"果汁与无酒精饮品"},
  "Coming soon": {es:"Próximamente",fr:"Bientôt disponible",it:"Prossimamente",zh:"即将推出"},
  "A short preview of the post will appear here.": {es:"Aquí aparecerá un breve avance del artículo.",fr:"Un court aperçu de l'article apparaîtra ici.",it:"Qui apparirà una breve anteprima dell'articolo.",zh:"这里将显示文章的简短预览。"},
    "Home": { es: "Inicio", fr: "Accueil", it: "Home", zh: "主页" },
    "Blog": { es: "Blog", fr: "Blog", it: "Blog", zh: "博客" },
    "Map": { es: "Mapa", fr: "Carte", it: "Mappa", zh: "地图" },
    "About": { es: "Acerca de", fr: "À propos", it: "Chi siamo", zh: "关于" },
    "City Guides": { es: "Guías de ciudades", fr: "Guides de villes", it: "Guide alle città", zh: "城市指南" },
    "Destination Finder": { es: "Buscador de destinos", fr: "Recherche de destinations", it: "Trova destinazioni", zh: "目的地查找器" },
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
    "Specific dates": { es: "Fechas concretas", fr: "Dates précises", it: "Date precise", zh: "具体日期" },
    "On specific dates": { es: "En fechas concretas", fr: "À des dates précises", it: "In date precise", zh: "按具体日期" },
    "Flexible/Trip Length (In Nights)": { es: "Duración del viaje", fr: "Durée du voyage", it: "Durata del viaggio", zh: "旅行时长" },
    "Flexible Dates/Length of Trip (in days)": { es: "Fechas flexibles / duración del viaje (en días)", fr: "Dates flexibles / durée du voyage (en jours)", it: "Date flessibili / durata del viaggio (in giorni)", zh: "灵活日期/旅行时长（天）" },
    "Travel month": { es: "Mes de viaje", fr: "Mois du voyage", it: "Mese del viaggio", zh: "出行月份" },
    "Any month": { es: "Cualquier mes", fr: "N'importe quel mois", it: "Qualsiasi mese", zh: "任意月份" },
    "(optional)": { es: "(opcional)", fr: "(facultatif)", it: "(facoltativo)", zh: "（可选）" },
    "I plan to return": { es: "Pienso volver", fr: "Je compte revenir", it: "Ho intenzione di tornare", zh: "我计划往返" },
    "I'm planning to return": { es: "Pienso volver", fr: "Je compte revenir", it: "Ho intenzione di tornare", zh: "我计划往返" },
    "I'm only going one way": { es: "Solo voy de ida", fr: "Je pars en aller simple", it: "Vado solo andata", zh: "我只单程出行" },
    "Cards": { es: "Tarjetas", fr: "Fiches", it: "Schede", zh: "卡片" },
    "Suggested Destinations": { es: "Destinos sugeridos", fr: "Destinations suggérées", it: "Destinazioni suggerite", zh: "推荐目的地" },
    "The map couldn't load right now — switch back to Cards to keep browsing.": { es: "El mapa no se pudo cargar — vuelve a Tarjetas para seguir explorando.", fr: "La carte n'a pas pu se charger — repassez en Fiches pour continuer.", it: "La mappa non si è caricata — torna a Schede per continuare.", zh: "地图暂时无法加载——请切换回卡片继续浏览。" },
    "Compare all ways to get there": { es: "Compara todas las formas de llegar", fr: "Comparez toutes les façons d'y aller", it: "Confronta tutti i modi per arrivarci", zh: "比较所有前往方式" },
    "Ideal time to visit": { es: "Época ideal para visitar", fr: "Période idéale pour visiter", it: "Periodo ideale per visitare", zh: "理想的到访时节" },
    "Very hot season": { es: "Temporada muy calurosa", fr: "Saison très chaude", it: "Stagione molto calda", zh: "酷热季节" },
    "Cold season": { es: "Temporada fría", fr: "Saison froide", it: "Stagione fredda", zh: "寒冷季节" },
    "Rainy season": { es: "Temporada de lluvias", fr: "Saison des pluies", it: "Stagione delle piogge", zh: "雨季" },
    "Share itinerary": { es: "Compartir itinerario", fr: "Partager l'itinéraire", it: "Condividi itinerario", zh: "分享行程" },
    "Link copied!": { es: "¡Enlace copiado!", fr: "Lien copié !", it: "Link copiato!", zh: "链接已复制！" },
    "One-way rental": { es: "Alquiler solo ida", fr: "Location en aller simple", it: "Noleggio solo andata", zh: "单程租车" },
    "Train may be the better option": { es: "El tren puede ser la mejor opción", fr: "Le train peut être la meilleure option", it: "Il treno potrebbe essere l'opzione migliore", zh: "火车可能是更好的选择" },
    "Long ride ahead": { es: "Un trayecto largo por delante", fr: "Un long trajet en perspective", it: "Un lungo viaggio in vista", zh: "路程较长" },
    "We'll show the cheapest flights Google can find.": { es: "Te mostraremos los vuelos más baratos que encuentre Google.", fr: "Nous afficherons les vols les moins chers trouvés par Google.", it: "Mostreremo i voli più economici trovati da Google.", zh: "我们会显示 Google 能找到的最便宜航班。" },
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
    "no admission": { es: "sin admisión", fr: "non admis", it: "nessun ingresso", zh: "不可入境" },

    /* Ask A Roamer (community forum) */
    "Ask A Roamer": { es: "Pregunta a un viajero", fr: "Demandez à un voyageur", it: "Chiedi a un viaggiatore", zh: "问问旅行者" },
    "Travelers helping travelers": { es: "Viajeros ayudando a viajeros", fr: "Des voyageurs qui s'entraident", it: "Viaggiatori che aiutano viaggiatori", zh: "旅行者互相帮助" },
    "Got a question about a destination, a route, or a tip you can't find anywhere else? Pick a city on the left, ask the community — and share what you know when someone else needs a hand.": { es: "¿Tienes una pregunta sobre un destino, una ruta o un consejo que no encuentras en otro lado? Elige una ciudad a la izquierda, pregunta a la comunidad y comparte lo que sabes cuando alguien más necesite ayuda.", fr: "Une question sur une destination, un itinéraire ou une astuce introuvable ailleurs ? Choisissez une ville à gauche, demandez à la communauté — et partagez ce que vous savez quand quelqu'un a besoin d'aide.", it: "Hai una domanda su una destinazione, un itinerario o un consiglio che non trovi altrove? Scegli una città a sinistra, chiedi alla community e condividi ciò che sai quando qualcun altro ha bisogno di una mano.", zh: "对某个目的地、路线或别处找不到的小贴士有疑问？在左侧选择一个城市，向社区提问——当别人需要帮助时也分享你所知道的。" },
    "Browse by city": { es: "Explorar por ciudad", fr: "Parcourir par ville", it: "Sfoglia per città", zh: "按城市浏览" },
    "Cities": { es: "Ciudades", fr: "Villes", it: "Città", zh: "城市" },
    "General Travel": { es: "Viajes en general", fr: "Voyage en général", it: "Viaggi in generale", zh: "综合旅行" },
    "Which city is this about?": { es: "¿Sobre qué ciudad es?", fr: "De quelle ville s'agit-il ?", it: "Di quale città si tratta?", zh: "这是关于哪个城市的？" },
    "Ask a question": { es: "Haz una pregunta", fr: "Poser une question", it: "Fai una domanda", zh: "提个问题" },
    "Be specific — the more context you give, the better the answers you'll get back.": { es: "Sé específico: cuanto más contexto des, mejores serán las respuestas.", fr: "Soyez précis : plus vous donnez de contexte, meilleures seront les réponses.", it: "Sii specifico: più contesto fornisci, migliori saranno le risposte.", zh: "尽量具体——你提供的背景越多，得到的回答就越好。" },
    "Question": { es: "Pregunta", fr: "Question", it: "Domanda", zh: "问题" },
    "Details": { es: "Detalles", fr: "Détails", it: "Dettagli", zh: "详情" },
    "Post question": { es: "Publicar pregunta", fr: "Publier la question", it: "Pubblica domanda", zh: "发布问题" },
    "Add a reply": { es: "Añadir respuesta", fr: "Ajouter une réponse", it: "Aggiungi risposta", zh: "添加回复" },
    "Post reply": { es: "Publicar respuesta", fr: "Publier la réponse", it: "Pubblica risposta", zh: "发布回复" },
    "Cancel": { es: "Cancelar", fr: "Annuler", it: "Annulla", zh: "取消" },
    "reply": { es: "respuesta", fr: "réponse", it: "risposta", zh: "回复" },
    "replies": { es: "respuestas", fr: "réponses", it: "risposte", zh: "回复" },
    "just now": { es: "ahora mismo", fr: "à l'instant", it: "proprio ora", zh: "刚刚" },
    "Newest first": { es: "Más recientes primero", fr: "Plus récentes d'abord", it: "Più recenti prima", zh: "最新优先" },
    "Most replies": { es: "Más respuestas", fr: "Plus de réponses", it: "Più risposte", zh: "回复最多" },
    "Unanswered": { es: "Sin responder", fr: "Sans réponse", it: "Senza risposta", zh: "未回答" },

    /* City page — cost cards (Hotel / Meal / Taxi / Drinks / Connectivity) */
    "Hotel · per night": { es: "Hotel · por noche", fr: "Hôtel · par nuit", it: "Hotel · a notte", zh: "酒店 · 每晚" },
    "mid-range · avg,": { es: "gama media · prom.,", fr: "milieu de gamme · moy.,", it: "fascia media · media,", zh: "中档 · 均价," },
    "Budget": { es: "Económico", fr: "Économique", it: "Economico", zh: "经济型" },
    "High-end": { es: "Alta gama", fr: "Haut de gamme", it: "Fascia alta", zh: "高端" },
    "Meal · per person": { es: "Comida · por persona", fr: "Repas · par personne", it: "Pasto · a persona", zh: "餐食 · 每人" },
    "sit-down restaurant ·": { es: "restaurante con servicio ·", fr: "restaurant à table ·", it: "ristorante al tavolo ·", zh: "堂食餐厅 ·" },
    "Tipping": { es: "Propina", fr: "Pourboire", it: "Mancia", zh: "小费" },
    "expected": { es: "esperada", fr: "attendu", it: "attesa", zh: "需要给" },
    "customary": { es: "habitual", fr: "d'usage", it: "consueta", zh: "常见" },
    "optional": { es: "opcional", fr: "facultatif", it: "facoltativa", zh: "可给可不给" },
    "service included": { es: "servicio incluido", fr: "service compris", it: "servizio incluso", zh: "已含服务费" },
    "not customary": { es: "no habitual", fr: "pas d'usage", it: "non consueta", zh: "不流行" },
    "Taxi / Uber · 10 km": { es: "Taxi / Uber · 10 km", fr: "Taxi / Uber · 10 km", it: "Taxi / Uber · 10 km", zh: "出租车 / 优步 · 10公里" },
    "typical fare ·": { es: "tarifa típica ·", fr: "tarif typique ·", it: "tariffa tipica ·", zh: "常见车费 ·" },
    "Ride-share apps": { es: "Apps de transporte", fr: "Applis VTC", it: "App di ride-sharing", zh: "网约车应用" },
    "Local taxis — no major apps": { es: "Taxis locales — sin apps principales", fr: "Taxis locaux — pas d'applis majeures", it: "Taxi locali — nessuna app principale", zh: "本地出租车 — 无主流应用" },
    "Drinks": { es: "Bebidas", fr: "Boissons", it: "Bevande", zh: "饮品" },
    "Coffee · takeaway": { es: "Café · para llevar", fr: "Café · à emporter", it: "Caffè · da asporto", zh: "咖啡 · 外带" },
    "Beer · 0.5L": { es: "Cerveza · 0,5L", fr: "Bière · 0,5L", it: "Birra · 0,5L", zh: "啤酒 · 0.5升" },
    "Water · bottle": { es: "Agua · botella", fr: "Eau · bouteille", it: "Acqua · bottiglia", zh: "瓶装水" },
    "Public alcohol not allowed": { es: "Alcohol no permitido en público", fr: "Alcool interdit en public", it: "Alcol vietato in pubblico", zh: "公共场所禁止饮酒" },
    "Public alcohol restricted": { es: "Alcohol restringido en público", fr: "Alcool restreint en public", it: "Alcol limitato in pubblico", zh: "公共场所限制饮酒" },
    "average prices per drink": { es: "precios promedio por bebida", fr: "prix moyens par boisson", it: "prezzi medi per bevanda", zh: "每杯平均价格" },
    "Connectivity": { es: "Conectividad", fr: "Connectivité", it: "Connettività", zh: "网络连接" },
    "Mobile · avg download": { es: "Móvil · descarga prom.", fr: "Mobile · débit moyen", it: "Mobile · download medio", zh: "移动网络 · 平均下载" },
    "Wi-Fi · broadband": { es: "Wi-Fi · banda ancha", fr: "Wi-Fi · haut débit", it: "Wi-Fi · banda larga", zh: "Wi-Fi · 宽带" },
    "Tourist SIM · per GB": { es: "SIM turística · por GB", fr: "SIM touriste · par Go", it: "SIM turistica · per GB", zh: "游客SIM卡 · 每GB" },
    "Mobile operators": { es: "Operadores móviles", fr: "Opérateurs mobiles", it: "Operatori mobili", zh: "移动运营商" },
    "country averages · estimates": { es: "promedios del país · estimaciones", fr: "moyennes nationales · estimations", it: "medie nazionali · stime", zh: "全国平均 · 估算值" },
    "Buy an eSIM →": { es: "Comprar eSIM →", fr: "Acheter une eSIM →", it: "Acquista una eSIM →", zh: "购买eSIM →" },

    /* Connectivity banner — free Wi-Fi + airport Wi-Fi stats */
    "Free public Wi-Fi": { es: "Wi-Fi público gratis", fr: "Wi-Fi public gratuit", it: "Wi-Fi pubblico gratuito", zh: "免费公共Wi-Fi" },
    "Airport Wi-Fi": { es: "Wi-Fi en el aeropuerto", fr: "Wi-Fi à l'aéroport", it: "Wi-Fi in aeroporto", zh: "机场Wi-Fi" },
    "Widespread": { es: "Muy extendido", fr: "Très répandu", it: "Molto diffuso", zh: "覆盖广泛" },
    "Moderate": { es: "Moderado", fr: "Modéré", it: "Moderato", zh: "中等" },
    "Limited": { es: "Limitado", fr: "Limité", it: "Limitato", zh: "有限" },
    "Free": { es: "Gratis", fr: "Gratuit", it: "Gratuito", zh: "免费" },
    "Citywide free hotspot network, plus cafés & metro": { es: "Red de puntos gratis en toda la ciudad, más cafés y metro", fr: "Réseau de bornes gratuites dans toute la ville, plus cafés et métro", it: "Rete di hotspot gratuiti in tutta la città, più caffè e metro", zh: "全市免费热点网络，咖啡馆和地铁也有" },
    "Most cafés, malls & libraries offer free Wi-Fi": { es: "La mayoría de cafés, centros comerciales y bibliotecas ofrecen Wi-Fi gratis", fr: "La plupart des cafés, centres commerciaux et bibliothèques offrent le Wi-Fi gratuit", it: "La maggior parte di caffè, centri commerciali e biblioteche offre Wi-Fi gratuito", zh: "大多数咖啡馆、商场和图书馆提供免费Wi-Fi" },
    "Cafés & convenience stores; stations covered, streets patchy": { es: "Cafés y tiendas de conveniencia; estaciones cubiertas, calles irregulares", fr: "Cafés et supérettes ; gares couvertes, rues inégales", it: "Caffè e minimarket; stazioni coperte, copertura in strada a macchie", zh: "咖啡馆和便利店有；车站覆盖，街头零散" },
    "Nearly every café & restaurant has free Wi-Fi": { es: "Casi todos los cafés y restaurantes tienen Wi-Fi gratis", fr: "Presque tous les cafés et restaurants ont le Wi-Fi gratuit", it: "Quasi tutti i caffè e ristoranti hanno Wi-Fi gratuito", zh: "几乎每家咖啡馆和餐厅都有免费Wi-Fi" },
    "Common in malls & cafés, but sign-in usually needs a local number": { es: "Común en centros comerciales y cafés, pero registrarse suele requerir un número local", fr: "Courant dans les centres commerciaux et cafés, mais l'inscription exige souvent un numéro local", it: "Comune in centri commerciali e caffè, ma l'accesso richiede spesso un numero locale", zh: "商场和咖啡馆常见，但登录通常需要本地手机号" },
    "Mainly hotels, malls & tourist-area cafés": { es: "Principalmente hoteles, centros comerciales y cafés de zonas turísticas", fr: "Surtout hôtels, centres commerciaux et cafés touristiques", it: "Soprattutto hotel, centri commerciali e caffè delle zone turistiche", zh: "主要在酒店、商场和游客区咖啡馆" },
    "Free hotspots in parks & squares, plus most cafés": { es: "Puntos gratis en parques y plazas, más la mayoría de cafés", fr: "Bornes gratuites dans les parcs et places, plus la plupart des cafés", it: "Hotspot gratuiti in parchi e piazze, più la maggior parte dei caffè", zh: "公园和广场有免费热点，多数咖啡馆也有" },
    "Excellent free Wi-Fi culture — cafés, transit & public spaces": { es: "Excelente cultura de Wi-Fi gratis: cafés, transporte y espacios públicos", fr: "Excellente culture du Wi-Fi gratuit : cafés, transports et espaces publics", it: "Ottima cultura del Wi-Fi gratuito: caffè, trasporti e spazi pubblici", zh: "免费Wi-Fi文化极佳——咖啡馆、交通和公共场所" },
    "unlimited": { es: "ilimitado", fr: "illimité", it: "illimitato", zh: "不限时" },
    "passport kiosk or local number": { es: "quiosco con pasaporte o número local", fr: "borne passeport ou numéro local", it: "chiosco passaporto o numero locale", zh: "护照终端机或本地号码" },
    "local-number OTP (visitor help desk)": { es: "OTP con número local (mostrador para visitantes)", fr: "OTP par numéro local (comptoir visiteurs)", it: "OTP con numero locale (banco assistenza visitatori)", zh: "本地号码验证码（设游客服务台）" },
    "passport kiosk sign-in": { es: "registro con pasaporte en quiosco", fr: "inscription par borne passeport", it: "accesso con chiosco passaporto", zh: "护照终端机登录" },
    "time-limited sessions": { es: "sesiones con límite de tiempo", fr: "sessions à durée limitée", it: "sessioni a tempo limitato", zh: "限时使用" },
    "short sessions with ads": { es: "sesiones cortas con anuncios", fr: "sessions courtes avec publicités", it: "sessioni brevi con pubblicità", zh: "短时段，含广告" },
    "registration required": { es: "requiere registro", fr: "inscription requise", it: "registrazione richiesta", zh: "需注册" },

    /* Getting Around The City — transit card (city.html) */
    "Getting around the city": { es: "Cómo moverse por la ciudad", fr: "Se déplacer dans la ville", it: "Come muoversi in città", zh: "城市交通出行" },
    "Public transit": { es: "Transporte público", fr: "Transports en commun", it: "Trasporto pubblico", zh: "公共交通" },
    "How to pay": { es: "Cómo pagar", fr: "Comment payer", it: "Come pagare", zh: "如何付款" },
    "Operating hours": { es: "Horario de servicio", fr: "Heures de service", it: "Orari di servizio", zh: "运营时间" },
    "Transit map →": { es: "Mapa de transporte →", fr: "Plan du réseau →", it: "Mappa dei trasporti →", zh: "交通线路图 →" },
    "No transit map": { es: "Sin mapa de transporte", fr: "Pas de plan disponible", it: "Nessuna mappa disponibile", zh: "暂无线路图" },
    "Getting around:": { es: "Cómo moverse:", fr: "Se déplacer :", it: "Come muoversi:", zh: "出行方式：" },

    /* Bucket List "How to get here" pop-up (choose.html) */
    "How to get here": { es: "Cómo llegar", fr: "Comment s'y rendre", it: "Come arrivare", zh: "如何到达" },
    "Nearest airport": { es: "Aeropuerto más cercano", fr: "Aéroport le plus proche", it: "Aeroporto più vicino", zh: "最近的机场" },
    "Nearest city": { es: "Ciudad más cercana", fr: "Ville la plus proche", it: "Città più vicina", zh: "最近的城市" },
    "Getting there": { es: "Cómo llegar", fr: "Y aller", it: "Come arrivarci", zh: "如何前往" },
    "View on map ↗": { es: "Ver en el mapa ↗", fr: "Voir sur la carte ↗", it: "Vedi sulla mappa ↗", zh: "在地图上查看 ↗" },
    "Visit / Take a tour ↗": { es: "Visitar / Reservar un tour ↗", fr: "Visiter / Réserver une visite ↗", it: "Visita / Prenota un tour ↗", zh: "参观 / 预订游览 ↗" },
    "Take a tour — coming soon": { es: "Reservar un tour — próximamente", fr: "Réserver une visite — bientôt disponible", it: "Prenota un tour — prossimamente", zh: "预订游览 — 即将推出" },

    /* Coming-soon map bubbles (index.html) */
    "City guide coming soon": { es: "Guía de la ciudad próximamente", fr: "Guide de la ville à venir", it: "Guida della città in arrivo", zh: "城市指南即将推出" },
    "Guide coming soon": { es: "Guía próximamente", fr: "Guide à venir", it: "Guida in arrivo", zh: "指南即将推出" },

    /* Mailing list (mailing-list.js) */
    "Get travel tips in your inbox": { es: "Recibe consejos de viaje en tu correo", fr: "Recevez des conseils de voyage par e-mail", it: "Ricevi consigli di viaggio via e-mail", zh: "把旅行小贴士发到你的邮箱" },
    "New city guides, honest travel tips, and stories from the road — straight to your inbox. No spam, unsubscribe anytime.": { es: "Nuevas guías de ciudades, consejos de viaje honestos e historias del camino, directamente a tu correo. Sin spam, cancela cuando quieras.", fr: "De nouveaux guides de villes, des conseils de voyage honnêtes et des récits de la route, directement dans votre boîte mail. Pas de spam, désabonnement à tout moment.", it: "Nuove guide di città, consigli di viaggio onesti e storie dalla strada, direttamente nella tua casella di posta. Niente spam, disiscriviti quando vuoi.", zh: "全新城市指南、真诚的旅行建议和路上的故事，直接送到你的邮箱。绝无垃圾邮件，随时可退订。" },
    "Subscribe": { es: "Suscribirse", fr: "S'abonner", it: "Iscriviti", zh: "订阅" },
    "We'll only use your email to send you Never Roam Alone updates.": { es: "Solo usaremos tu correo para enviarte novedades de Never Roam Alone.", fr: "Nous n'utiliserons votre e-mail que pour vous envoyer les actualités de Never Roam Alone.", it: "Useremo la tua e-mail solo per inviarti gli aggiornamenti di Never Roam Alone.", zh: "我们只会用你的邮箱向你发送 Never Roam Alone 的更新。" },
    "Email address": { es: "Correo electrónico", fr: "Adresse e-mail", it: "Indirizzo e-mail", zh: "电子邮箱" },
    "Subscribing…": { es: "Suscribiendo…", fr: "Inscription…", it: "Iscrizione…", zh: "正在订阅…" },
    "You're in! Check your inbox for a confirmation.": { es: "¡Listo! Revisa tu correo para confirmar.", fr: "C'est fait ! Vérifiez votre boîte mail pour confirmer.", it: "Fatto! Controlla la tua casella per la conferma.", zh: "订阅成功！请查收邮箱中的确认邮件。" },
    "You're already on the list — thanks for the love!": { es: "Ya estás en la lista, ¡gracias por el cariño!", fr: "Vous êtes déjà inscrit — merci pour votre soutien !", it: "Sei già nella lista — grazie dell'affetto!", zh: "你已经在名单上啦 — 谢谢支持！" },
    "That email address doesn't look right — double check it.": { es: "Ese correo no parece correcto, verifícalo.", fr: "Cette adresse e-mail semble incorrecte — vérifiez-la.", it: "Quell'indirizzo e-mail non sembra corretto — controllalo.", zh: "这个邮箱地址似乎有误 — 请再检查一下。" },
    "Enter your email address.": { es: "Introduce tu correo electrónico.", fr: "Saisissez votre adresse e-mail.", it: "Inserisci il tuo indirizzo e-mail.", zh: "请输入你的电子邮箱。" },
    "Couldn't sign you up — please try again.": { es: "No pudimos suscribirte, inténtalo de nuevo.", fr: "Inscription impossible — veuillez réessayer.", it: "Non è stato possibile iscriverti — riprova.", zh: "订阅失败 — 请重试。" },
    "Sign-ups aren't available right now — please try again later.": { es: "Las suscripciones no están disponibles ahora, inténtalo más tarde.", fr: "Les inscriptions ne sont pas disponibles pour le moment — réessayez plus tard.", it: "Le iscrizioni non sono disponibili al momento — riprova più tardi.", zh: "目前暂时无法订阅 — 请稍后再试。" },

    /* Public profile pages (roamer.html) */
    "Loading profile…": { es: "Cargando perfil…", fr: "Chargement du profil…", it: "Caricamento del profilo…", zh: "正在加载资料…" },
    "Profiles are almost ready": { es: "Los perfiles están casi listos", fr: "Les profils sont presque prêts", it: "I profili sono quasi pronti", zh: "个人资料即将上线" },
    "Accounts aren't switched on yet, so there are no public profiles to show right now.": { es: "Las cuentas aún no están activadas, así que no hay perfiles públicos para mostrar por ahora.", fr: "Les comptes ne sont pas encore activés, il n'y a donc aucun profil public à afficher pour le moment.", it: "Gli account non sono ancora attivi, quindi al momento non ci sono profili pubblici da mostrare.", zh: "账户功能尚未开启，因此目前没有可显示的公开资料。" },
    "This profile isn't available": { es: "Este perfil no está disponible", fr: "Ce profil n'est pas disponible", it: "Questo profilo non è disponibile", zh: "该资料不可用" },
    "It's either set to private or doesn't exist. Every Roamer chooses whether their profile is public.": { es: "Está configurado como privado o no existe. Cada Roamer elige si su perfil es público.", fr: "Il est privé ou n'existe pas. Chaque Roamer choisit si son profil est public.", it: "È impostato come privato o non esiste. Ogni Roamer sceglie se rendere pubblico il proprio profilo.", zh: "它可能被设为私密或并不存在。每位 Roamer 都可自行选择是否公开资料。" },
    "Articles": { es: "Artículos", fr: "Articles", it: "Articoli", zh: "文章" },
    "Favorite travel photos": { es: "Fotos de viaje favoritas", fr: "Photos de voyage préférées", it: "Foto di viaggio preferite", zh: "最爱的旅行照片" },
    "Stories this Roamer has contributed as a trusted traveler.": { es: "Historias que este Roamer ha aportado como viajero de confianza.", fr: "Récits que ce Roamer a partagés en tant que voyageur de confiance.", it: "Storie che questo Roamer ha condiviso come viaggiatore di fiducia.", zh: "这位 Roamer 作为信赖旅行者贡献的故事。" },
    "Prototype · Roamers choose what's shown here": { es: "Prototipo · Los Roamers eligen qué se muestra aquí", fr: "Prototype · Les Roamers choisissent ce qui s'affiche ici", it: "Prototipo · I Roamer scelgono cosa mostrare qui", zh: "原型 · 由 Roamer 自行决定此处显示的内容" },
    "Back to Ask A Roamer": { es: "Volver a Pregunta a un viajero", fr: "Retour à Demandez à un voyageur", it: "Torna a Chiedi a un viaggiatore", zh: "返回 问问旅行者" },

    /* Trip planner (itinerary.html) */
    "Trip planner": { es: "Planificador de viajes", fr: "Planificateur de voyage", it: "Pianificatore di viaggi", zh: "行程规划器" },
    "Upcoming Trips": { es: "Próximos viajes", fr: "Voyages à venir", it: "Prossimi viaggi", zh: "即将出行" },
    "Upcoming trips": { es: "Próximos viajes", fr: "Voyages à venir", it: "Prossimi viaggi", zh: "即将出行" },
    "Past trips": { es: "Viajes anteriores", fr: "Voyages passés", it: "Viaggi passati", zh: "过往行程" },
    "Build your route — add the cities and places you're planning to roam.": { es: "Arma tu ruta: añade las ciudades y lugares que planeas recorrer.", fr: "Composez votre itinéraire — ajoutez les villes et lieux que vous prévoyez d'explorer.", it: "Crea il tuo itinerario: aggiungi le città e i luoghi che vuoi esplorare.", zh: "规划你的路线 — 添加你打算漫游的城市和地点。" },
    "Prototype · plan your roams, one stop at a time": { es: "Prototipo · planifica tus viajes, parada a parada", fr: "Prototype · planifiez vos escapades, étape par étape", it: "Prototipo · pianifica i tuoi viaggi, una tappa alla volta", zh: "原型 · 一站一站地规划你的漫游" },
    "Guide": { es: "Guía", fr: "Guide", it: "Guida", zh: "指南" },
    "No guide yet": { es: "Aún sin guía", fr: "Pas encore de guide", it: "Ancora nessuna guida", zh: "暂无指南" },
    "Request city guide": { es: "Solicitar guía de ciudad", fr: "Demander un guide de ville", it: "Richiedi una guida della città", zh: "申请城市指南" },
    "Guide requested ✓": { es: "Guía solicitada ✓", fr: "Guide demandé ✓", it: "Guida richiesta ✓", zh: "已申请指南 ✓" },
    "Search a city or place… e.g. Lisbon": { es: "Busca una ciudad o lugar… p. ej. Lisboa", fr: "Rechercher une ville ou un lieu… p. ex. Lisbonne", it: "Cerca una città o un luogo… es. Lisbona", zh: "搜索城市或地点…例如 里斯本" },

    /* Shared — nav sign-in widget + footer links on recent pages */
    "Sign in": { es: "Iniciar sesión", fr: "Se connecter", it: "Accedi", zh: "登录" },
    "Contact": { es: "Contacto", fr: "Contact", it: "Contatti", zh: "联系我们" },
    "Feedback": { es: "Comentarios", fr: "Commentaires", it: "Feedback", zh: "反馈" },
    "Privacy Policy": { es: "Política de privacidad", fr: "Politique de confidentialité", it: "Informativa sulla privacy", zh: "隐私政策" },
    "Terms of Service": { es: "Términos del servicio", fr: "Conditions d'utilisation", it: "Termini di servizio", zh: "服务条款" },
    "Your Travel Companion": { es: "Tu compañero de viaje", fr: "Votre compagnon de voyage", it: "Il tuo compagno di viaggio", zh: "你的旅行伙伴" }
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
      "color:#5b6b75;background:rgba(92, 105, 51,.06);border:1.5px solid rgba(92, 105, 51,.2);border-radius:0;" +
      "padding:7px 30px 7px 14px;cursor:pointer;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><path d='M1 3l4 4 4-4' stroke='%23556B2F' stroke-width='1.6' fill='none' stroke-linecap='round'/></svg>\");" +
      "background-repeat:no-repeat;background-position:right 12px center}" +
      ".nra-lang select:focus{outline:none;border-color:#5c6933}" +
      "@media(max-width:820px){.nra-lang{margin-left:12px}}" +
      "@media(max-width:420px){.nra-lang{margin-left:6px}.nra-lang select{padding:7px 24px 7px 10px;font-size:.82rem}}";
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
