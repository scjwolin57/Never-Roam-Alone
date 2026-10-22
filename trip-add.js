/* ==================================================================
   TRIP-ADD.JS — the shared "Add to trip" popup.
   Used on city.html, cities.html, choose.html and compare.html.

   What it does:
   • Any element with a data-trip-add attribute (plus data-city /
     data-country) opens the popup when clicked — even if the element
     is rendered later (event delegation).
   • Signed out  → opens the sign-in modal.
   • Signed in   → lets the user add the city to their Wishlist, to an
     existing trip, or to a brand-new named trip.
   • Data lives in Supabase: "itineraries" + "itinerary_places"
     (named-itineraries-setup.sql) and "wishlist_items"
     (wishlist-setup.sql).

   Also exposes window.NRA_TRIPADD:
   • NRA_TRIPADD.open(city, country)  — open the standard popup.
   • NRA_TRIPADD.pick({title, sub, hideWishlist, onPick}) — "picker"
     mode used by the Wishlist tab on itinerary.html: shows the trips
     (and create-new), and instead of inserting anything just calls
     onPick({id, name}) so the caller can move cities itself.
   • NRA_TRIPADD.openItem({kind, name, city, country, section, hood,
     note, map}) — "item" mode (2026-10-22): saves a landmark, day trip
     or recommended place to a trip. Trips that already include the
     city are offered first; with none, the person starts a new trip
     (the city is added as its first stop) or adds the city to another
     trip. Rows go to Supabase "trip_items" (trip-items-setup.sql).
     Any element with data-trip-item (+ data-kind / data-name /
     data-city / data-country / data-section / data-hood / data-note /
     data-map) opens it when clicked.
================================================================== */
(function(){
  "use strict";
  const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const signedIn = () => !!(window.NRA_AUTH && NRA_AUTH.enabled && NRA_AUTH.user && NRA_AUTH.user());

  /* ---------- styles (self-contained) ---------- */
  const css = document.createElement("style");
  css.textContent = `
  .ta-overlay{position:fixed;inset:0;z-index:1000;display:none;background:rgba(20,40,50,.5);
    backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:20px}
  .ta-overlay.open{display:flex}
  .ta-modal{background:#fff;border-radius:0;box-shadow:0 20px 60px rgba(20,40,50,.35);
    width:100%;max-width:460px;max-height:85vh;overflow:auto;padding:26px 24px;position:relative;
    font-family:'Work Sans',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1d2a32;line-height:1.5}
  .ta-modal h3{margin:0 26px 4px 0;font-size:1.35rem;font-family:'Fraunces',Georgia,serif}
  .ta-x{position:absolute;top:14px;right:14px;border:none;background:none;font-size:1.3rem;line-height:1;
    color:#5b6b75;cursor:pointer;padding:6px 8px;border-radius:0}
  .ta-x:hover{background:rgba(92, 105, 51,.08);color:#b34a3a}
  .ta-sub{color:#5b6b75;font-size:.85rem;margin:0 0 14px}
  .ta-status{font-size:.85rem;font-weight:600;min-height:1.1em;margin:0 0 12px}
  .ta-status.ok{color:#5c6933}
  .ta-status.err{color:#b34a3a}
  .ta-sect{font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#5b6b75;margin:14px 0 8px}
  .ta-list{display:flex;flex-direction:column;gap:9px}
  .ta-pick{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;text-align:left;
    border:2px solid rgba(92, 105, 51,.22);background:#fff;border-radius:0;padding:12px 14px;cursor:pointer;
    font-family:inherit;font-size:.98rem;font-weight:700;color:#1d2a32;transition:.15s}
  .ta-pick:hover:not(:disabled){border-color:#5c6933;background:rgba(92, 105, 51,.06)}
  .ta-pick:disabled{cursor:default;opacity:.7;border-color:rgba(92, 105, 51,.35);color:#5c6933}
  .ta-pick.wish{border-color:rgba(181, 73, 44,.35)}
  .ta-pick.wish:hover:not(:disabled){border-color:#b5492c;background:rgba(181, 73, 44,.05)}
  .ta-pick>span:first-child{flex:1 1 auto;min-width:0;overflow-wrap:anywhere}
  .ta-pick .n{color:#5b6b75;font-size:.78rem;font-weight:600;flex:0 1 auto;text-align:right}
  .ta-empty{color:#5b6b75;font-size:.9rem;margin:0}
  .ta-newrow{display:flex;gap:8px;border-top:1px solid rgba(92, 105, 51,.15);padding-top:16px;margin-top:16px}
  .ta-newrow input{flex:1;min-width:0;padding:11px 13px;border:2px solid rgba(92, 105, 51,.22);border-radius:0;
    font-size:.95rem;font-family:inherit;color:#1d2a32;outline:none}
  .ta-newrow input:focus{border-color:#5c6933}
  .ta-create{border:none;background:#5c6933;color:#fff;font-weight:700;font-family:inherit;
    padding:11px 16px;border-radius:0;cursor:pointer;white-space:nowrap;transition:background .2s}
  .ta-create:hover:not(:disabled){background:#b5492c}
  .ta-create:disabled{opacity:.6;cursor:default}
  .ta-pick.other{border-color:rgba(92, 105, 51,.14);font-weight:600}
  .ta-note{color:#5b6b75;font-size:.85rem;margin:0 0 10px}
  .ta-note b{color:#1d2a32}
  .ta-more{border:none;background:none;padding:0;margin:4px 0 0;font-family:inherit;font-size:.82rem;font-weight:700;
    color:#5c6933;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
  .ta-more:hover{color:#b5492c}
  /* "+ Add to trip" on landmark, day-trip and pick rows (city.html) */
  .trip-item-btn{display:inline-flex;align-items:center;gap:4px;border:1px solid rgba(92, 105, 51,.45);background:#fff;color:#5c6933;
    font-family:inherit;font-size:.72rem;font-weight:700;line-height:1;padding:5px 8px;border-radius:0;cursor:pointer;white-space:nowrap;
    transition:background .15s,color .15s,border-color .15s}
  .trip-item-btn:hover,.trip-item-btn:focus-visible{background:#5c6933;color:#fff;border-color:#5c6933}
  .trip-item-btn.done{background:rgba(92, 105, 51,.1);border-color:rgba(92, 105, 51,.45);color:#5c6933;cursor:default}
  /* a ready-made small button pages can use next to cards */
  .trip-add-chip{border:none;background:#5c6933;color:#fff;font-weight:700;font-family:inherit;font-size:.78rem;
    padding:7px 12px;border-radius:0;cursor:pointer;transition:background .2s;white-space:nowrap}
  .trip-add-chip:hover{background:#b5492c}`;
  document.head.appendChild(css);

  /* ---------- popup shell (built once) ---------- */
  const overlay = document.createElement("div");
  overlay.className = "ta-overlay";
  overlay.innerHTML = `
    <div class="ta-modal" role="dialog" aria-modal="true" aria-label="Add to trip">
      <button class="ta-x" type="button" aria-label="Close">✕</button>
      <h3 id="ta-title">Add to a trip</h3>
      <p class="ta-sub" id="ta-sub"></p>
      <p class="ta-status" id="ta-status"></p>
      <div id="ta-body"></div>
      <div class="ta-newrow">
        <input type="text" id="ta-name" placeholder="Name a new trip…" maxlength="80" autocomplete="off">
        <button class="ta-create" id="ta-create" type="button">Create trip</button>
      </div>
    </div>`;
  const $ = sel => overlay.querySelector(sel);
  function mount(){ if (!overlay.parentNode) document.body.appendChild(overlay); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  const setStatus = (t, kind) => { const el = $("#ta-status"); el.textContent = t || ""; el.className = "ta-status" + (kind ? " "+kind : ""); };
  /* dirty: set true whenever a trip/wishlist row actually changed in this
     opening. On close, if something changed, tell any page listening
     (e.g. itinerary.html) to refresh so the just-added city shows up
     without needing a manual reload. */
  let dirty = false;
  const close = () => {
    overlay.classList.remove("open");
    if (dirty){ dirty = false; document.dispatchEvent(new CustomEvent("nra:trip-updated")); }
  };
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  $(".ta-x").addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  /* ---------- state for the current opening ---------- */
  let mode = "add";              // "add" (insert city ourselves), "pick" (hand trip back to caller) or "item" (save a landmark / day trip / place)
  let curCity = "", curCountry = "";
  let curItem = null;            // item mode: {kind, name, section, hood, note, map, el}
  let onPick = null;
  let closeAfterAdd = false;     // when true, close the popup right after a successful add (itinerary.html search)

  /* what an item is called in the popup and on the itinerary page */
  const ITEM_LABEL = { landmark: "Landmark", daytrip: "Day trip", eat: "Place to eat", cafes: "Coffee & takeaway", bars: "Place to drink", stay: "Place to stay" };
  const itemLabel = it => ITEM_LABEL[it.kind === "place" ? it.section : it.kind] || "Place";
  window.NRA_TRIP_ITEM_LABEL = itemLabel;

  /* ---------- data helpers ---------- */
  async function fetchLists(){
    const sb = NRA_AUTH.client();
    const r1 = await sb.from("itineraries").select("id,name")
      .order("sort_order", { ascending:true }).order("created_at", { ascending:true });
    if (r1.error) throw r1.error;
    const r2 = await sb.from("itinerary_places").select("itinerary_id,place");
    if (r2.error) throw r2.error;
    let wish = [];
    if (mode === "add"){
      const r3 = await sb.from("wishlist_items").select("place");
      if (r3.error) throw r3.error;
      wish = r3.data || [];
    }
    return { itins: r1.data || [], places: r2.data || [], wish };
  }

  async function addToTrip(tripId, tripName, count, btn){
    if (btn) btn.disabled = true;
    setStatus("Adding…");
    try{
      const sb = NRA_AUTH.client();
      const { error } = await sb.from("itinerary_places").insert({
        itinerary_id: tripId, user_id: NRA_AUTH.user().id,
        place: curCity, country: curCountry, sort_order: count
      });
      if (error) throw error;
      dirty = true;
      if (closeAfterAdd){ setStatus(`Added ${curCity} to “${tripName}.”`, "ok"); setTimeout(close, 550); return; }
      // stay tappable — going back to the same city later in the trip is allowed
      if (btn){
        const newCount = count + 1;
        btn.dataset.count = newCount;
        const n = btn.querySelector(".n");
        if (n) n.textContent = newCount + (newCount===1?" city":" cities") + " · ✓ in this trip";
        btn.disabled = false;
      }
      setStatus(`Added ${curCity} to “${tripName}” — tap again if you're stopping there twice.`, "ok");
    }catch(e){
      if (btn) btn.disabled = false;
      setStatus("Couldn't add that — please try again.", "err");
    }
  }

  /* item mode: save the landmark / day trip / place to one trip. When the trip
     doesn't have the city yet (needsStop), the city goes in as a stop first. */
  async function addItemToTrip(trip, btn, needsStop){
    if (btn) btn.disabled = true;
    setStatus("Adding…");
    try{
      const sb = NRA_AUTH.client(), uid = NRA_AUTH.user().id;
      if (needsStop){
        const { error } = await sb.from("itinerary_places").insert({
          itinerary_id: trip.id, user_id: uid, place: curCity, country: curCountry, sort_order: trip.count || 0
        });
        if (error) throw error;
      }
      const { error: e2 } = await sb.from("trip_items").insert({
        itinerary_id: trip.id, user_id: uid, city: curCity, country: curCountry,
        kind: curItem.kind, name: curItem.name, section: curItem.section || "", hood: curItem.hood || "",
        note: curItem.note || "", map_url: curItem.map || "", sort_order: 0
      });
      if (e2){
        if (String(e2.code) === "23505"){   // unique: already saved to this trip
          if (btn){ const n = btn.querySelector(".n"); if (n) n.textContent = "✓ already in this trip"; }
          setStatus(`${curItem.name} is already in “${trip.name}.”`, "ok");
          markItemDone();
          return;
        }
        throw e2;
      }
      dirty = true;
      markItemDone();
      setStatus(`Added ${curItem.name} to “${trip.name}.”`, "ok");
      setTimeout(close, 700);
    }catch(e){
      if (btn) btn.disabled = false;
      setStatus("Couldn't add that — if you're the site owner, make sure trip-items-setup.sql has been run in Supabase.", "err");
    }
  }
  /* the card's button reads "✓ In a trip" once something was saved from it */
  function markItemDone(){
    const el = curItem && curItem.el;
    if (el){ el.classList.add("done"); el.textContent = "✓ In a trip"; }
  }

  async function addToWishlist(count, btn){
    if (btn) btn.disabled = true;
    setStatus("Adding…");
    try{
      const sb = NRA_AUTH.client();
      const { error } = await sb.from("wishlist_items").insert({
        user_id: NRA_AUTH.user().id, place: curCity, country: curCountry, sort_order: count
      });
      if (error) throw error;
      dirty = true;
      if (closeAfterAdd){ setStatus(`${curCity} saved to your wishlist.`, "ok"); setTimeout(close, 550); return; }
      if (btn){ const n = btn.querySelector(".n"); if (n) n.textContent = "On your wishlist ✓"; }
      setStatus(`${curCity} saved to your wishlist.`, "ok");
    }catch(e){
      if (btn) btn.disabled = false;
      setStatus("Couldn't save that — if you're the site owner, make sure wishlist-setup.sql has been run in Supabase.", "err");
    }
  }

  /* ---------- render the body (wishlist row + trips) ---------- */
  async function renderBody(){
    const body = $("#ta-body");
    body.innerHTML = `<p class="ta-empty">Loading your trips…</p>`;
    setStatus("");
    let data;
    try{ data = await fetchLists(); }
    catch(e){
      body.innerHTML = "";
      setStatus("Couldn't load your trips — if you're the site owner, make sure named-itineraries-setup.sql (and wishlist-setup.sql) have been run in Supabase.", "err");
      return;
    }
    const byItin = {};
    data.places.forEach(p => { (byItin[p.itinerary_id] = byItin[p.itinerary_id] || []).push(String(p.place||"").toLowerCase()); });
    const cityLc = curCity.toLowerCase();
    let html = "";

    if (mode === "item"){ renderItemBody(body, data, byItin, cityLc); return; }

    if (mode === "add"){
      const wishNames = data.wish.map(w => String(w.place||"").toLowerCase());
      const onWish = wishNames.includes(cityLc);
      html += `<div class="ta-list"><button type="button" class="ta-pick wish" id="ta-wish" ${onWish?"disabled":""}>
        <span>♡ Wishlist <span style="font-weight:600;color:#5b6b75">— save for later</span></span>
        <span class="n">${onWish ? "On your wishlist ✓" : (data.wish.length + (data.wish.length===1?" city":" cities"))}</span>
      </button></div>`;
    }

    html += `<div class="ta-sect">Your trips</div>`;
    if (!data.itins.length){
      html += `<p class="ta-empty">No trips yet — name one below to get started.</p>`;
    } else {
      html += `<div class="ta-list" id="ta-trips">` + data.itins.map(it => {
        const cities = byItin[it.id] || [];
        // already in the trip? still tappable — you can visit a city twice on one trip
        const has = (mode === "add") && cities.includes(cityLc);
        const label = (cities.length + (cities.length===1?" city":" cities")) + (has ? " · ✓ in this trip" : "");
        return `<button type="button" class="ta-pick" data-tid="${esc(it.id)}" data-tname="${esc(it.name)}" data-count="${cities.length}">
          <span>${esc(it.name)}</span>
          <span class="n">${label}</span>
        </button>`;
      }).join("") + `</div>`;
    }
    body.innerHTML = html;

    const wishBtn = $("#ta-wish");
    if (wishBtn && !wishBtn.disabled) wishBtn.addEventListener("click", () => addToWishlist((data.wish||[]).length, wishBtn));
    body.querySelectorAll("[data-tid]").forEach(btn => {
      if (btn.disabled) return;
      btn.addEventListener("click", () => {
        const trip = { id: btn.dataset.tid, name: btn.dataset.tname, count: parseInt(btn.dataset.count||"0",10) };
        if (mode === "pick"){ close(); if (onPick) onPick(trip); return; }
        addToTrip(trip.id, trip.name, trip.count, btn);
      });
    });
  }

  /* ---------- item mode body: trips with this city first, then the rest ---------- */
  function renderItemBody(body, data, byItin, cityLc){
    const tripBtn = (it, extra) => {
      const cities = byItin[it.id] || [];
      return `<button type="button" class="ta-pick${extra ? " other" : ""}" data-tid="${esc(it.id)}" data-tname="${esc(it.name)}" data-count="${cities.length}"${extra ? ' data-needstop="1"' : ""}>
          <span>${esc(it.name)}</span>
          <span class="n">${extra ? "+ adds " + esc(curCity) : "✓ stops in " + esc(curCity)}</span>
        </button>`;
    };
    const withCity = data.itins.filter(it => (byItin[it.id] || []).includes(cityLc));
    const others   = data.itins.filter(it => !(byItin[it.id] || []).includes(cityLc));
    let html = "";
    if (withCity.length){
      html += `<div class="ta-sect">Your trips with ${esc(curCity)}</div><div class="ta-list">${withCity.map(it => tripBtn(it, false)).join("")}</div>`;
    } else if (data.itins.length){
      html += `<p class="ta-note">None of your trips include <b>${esc(curCity)}</b> yet. Start a new trip below, and ${esc(curCity)} goes in as its first stop.</p>`;
    } else {
      html += `<p class="ta-note">No trips yet. Name one below and <b>${esc(curCity)}</b> goes in as its first stop, with ${esc(curItem.name)} saved under it.</p>`;
    }
    if (others.length){
      /* trips without the city sit behind a text button so the main choice stays clear */
      html += `<button type="button" class="ta-more" id="ta-more" aria-expanded="false">Add to another trip (${others.length})</button>
        <div id="ta-others" hidden><div class="ta-sect">Other trips</div><div class="ta-list">${others.map(it => tripBtn(it, true)).join("")}</div></div>`;
    }
    body.innerHTML = html;
    const more = $("#ta-more");
    if (more) more.addEventListener("click", () => {
      const box = $("#ta-others"), open = box.hidden;
      box.hidden = !open; more.setAttribute("aria-expanded", String(open));
    });
    body.querySelectorAll("[data-tid]").forEach(btn => {
      btn.addEventListener("click", () => {
        const trip = { id: btn.dataset.tid, name: btn.dataset.tname, count: parseInt(btn.dataset.count||"0",10) };
        addItemToTrip(trip, btn, btn.dataset.needstop === "1");
      });
    });
  }

  /* ---------- create a new trip ---------- */
  async function createTrip(){
    const nameEl = $("#ta-name"), nm = nameEl.value.trim();
    if (!nm){ setStatus("Give your new trip a name first.", "err"); nameEl.focus(); return; }
    const btn = $("#ta-create"); btn.disabled = true; setStatus("Creating…");
    try{
      const sb = NRA_AUTH.client();
      const { data, error } = await sb.from("itineraries")
        .insert({ user_id: NRA_AUTH.user().id, name: nm, sort_order: 0 })
        .select("id").single();
      if (error) throw error;
      nameEl.value = "";
      const trip = { id: data.id, name: nm, count: 0 };
      if (mode === "pick"){ close(); if (onPick) onPick(trip); return; }
      if (mode === "item"){ await addItemToTrip(trip, null, true); return; }
      const { error: e2 } = await sb.from("itinerary_places").insert({
        itinerary_id: trip.id, user_id: NRA_AUTH.user().id,
        place: curCity, country: curCountry, sort_order: 0
      });
      if (e2) throw e2;
      dirty = true;
      if (closeAfterAdd){ setStatus(`Created “${nm}” and added ${curCity}.`, "ok"); setTimeout(close, 550); return; }
      setStatus(`Created “${nm}” and added ${curCity}.`, "ok");
      await renderBody();
    }catch(e){
      setStatus("Couldn't create that trip — please try again.", "err");
    }finally{ btn.disabled = false; }
  }
  $("#ta-create").addEventListener("click", createTrip);
  $("#ta-name").addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); createTrip(); } });

  /* ---------- public API ---------- */
  async function openStd(city, country, opts){
    if (window.NRA_AUTH && NRA_AUTH.ready){ try{ await NRA_AUTH.ready(); }catch(_){} }
    if (!signedIn()){ if (window.NRA_AUTH && NRA_AUTH.openModal) NRA_AUTH.openModal(); return; }
    mode = "add"; onPick = null; closeAfterAdd = !!(opts && opts.closeAfterAdd);
    curCity = String(city||"").trim(); curCountry = String(country||"").trim();
    mount();
    $("#ta-title").textContent = curCity ? `Add ${curCity}` : "Add to a trip";
    $("#ta-sub").textContent = "Save it to your wishlist, add it to a trip, or start a new one.";
    $("#ta-name").value = "";
    $("#ta-create").textContent = "Create & add";
    overlay.classList.add("open");
    renderBody();
  }
  async function openPick(opts){
    opts = opts || {};
    if (window.NRA_AUTH && NRA_AUTH.ready){ try{ await NRA_AUTH.ready(); }catch(_){} }
    if (!signedIn()){ if (window.NRA_AUTH && NRA_AUTH.openModal) NRA_AUTH.openModal(); return; }
    mode = "pick"; onPick = opts.onPick || null; closeAfterAdd = false;
    curCity = ""; curCountry = "";
    mount();
    $("#ta-title").textContent = opts.title || "Pick a trip";
    $("#ta-sub").textContent = opts.sub || "Choose one of your trips, or start a new one.";
    $("#ta-name").value = "";
    $("#ta-create").textContent = "Create trip";
    overlay.classList.add("open");
    renderBody();
  }
  async function openItem(item){
    item = item || {};
    if (window.NRA_AUTH && NRA_AUTH.ready){ try{ await NRA_AUTH.ready(); }catch(_){} }
    if (!signedIn()){ if (window.NRA_AUTH && NRA_AUTH.openModal) NRA_AUTH.openModal(); return; }
    mode = "item"; onPick = null; closeAfterAdd = false;
    curCity = String(item.city||"").trim(); curCountry = String(item.country||"").trim();
    curItem = {
      kind: item.kind === "daytrip" || item.kind === "place" ? item.kind : "landmark",
      name: String(item.name||"").trim().slice(0,160), section: String(item.section||"").slice(0,20),
      hood: String(item.hood||"").trim().slice(0,80), note: String(item.note||"").trim().slice(0,400),
      map: String(item.map||"").slice(0,600), el: item.el || null
    };
    if (!curCity || !curItem.name) return;
    mount();
    $("#ta-title").textContent = `Add ${curItem.name}`;
    $("#ta-sub").textContent = `${itemLabel(curItem)} in ${curCity}. Save it to a trip that stops in ${curCity}, or start a new trip.`;
    $("#ta-name").value = "";
    $("#ta-create").textContent = "Create & add";
    overlay.classList.add("open");
    renderBody();
  }
  window.NRA_TRIPADD = { open: openStd, pick: openPick, openItem: openItem };

  /* ---------- delegation: any [data-trip-add] opens the popup ---------- */
  document.addEventListener("click", e => {
    const item = e.target.closest("[data-trip-item]");
    if (item){
      e.preventDefault(); e.stopPropagation();
      const d = item.dataset;
      openItem({ kind: d.kind, name: d.name, city: d.city, country: d.country, section: d.section,
                 hood: d.hood, note: d.note, map: d.map, el: item });
      return;
    }
    const el = e.target.closest("[data-trip-add]");
    if (!el) return;
    e.preventDefault(); e.stopPropagation();
    openStd(decodeURIComponent(el.dataset.city || ""), decodeURIComponent(el.dataset.country || ""));
  });
})();
