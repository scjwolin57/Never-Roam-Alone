/* =====================================================================
   FAVORITES.JS — "heart a city" saved list, separate from the Past/
   Upcoming trip planner. Lets a signed-in or guest visitor tap a heart
   on any Destination Finder result card (or map pin popup — same card
   markup) to save a city to a dedicated Favorites list, viewable at
   itinerary.html?type=favorite.

   Storage:
   • Signed in  → Supabase "itinerary_items" table, trip_type='favorite'
     (same table Past/Upcoming trips already use — run favorites-setup.sql
     once to allow the new trip_type value).
   • Signed out → same localStorage bucket itinerary.html uses
     ("nra_itinerary_v1"), under its "favorite" array — so a heart
     tapped here shows up in the Favorites tab without a separate
     guest-mode store to keep in sync.

   Exposes window.NRA_FAV:
     ready()                 → promise, resolves once the initial list has loaded
     has(city)                → bool, synchronous (reads the in-memory cache)
     count()                  → number of favorites
     toggle(city, country)    → promise<bool>, returns the new has() state
     onChange(fn)              → fn() called whenever the favorites list changes
   ===================================================================== */
(function(){
  const LS_KEY = "nra_itinerary_v1";   // shared with itinerary.html
  const norm = s => String(s||"").trim().toLowerCase();

  let cache = new Map();     // normalized city -> {id, place, country}
  let loaded = false;
  let readyPromise = null;
  const listeners = [];
  const fire = () => listeners.forEach(fn => { try{ fn(); }catch(e){} });

  function signedIn(){ return !!(window.NRA_AUTH && NRA_AUTH.enabled && NRA_AUTH.user()); }

  function lsAll(){
    try{
      const d = JSON.parse(localStorage.getItem(LS_KEY));
      const out = (d && typeof d === "object") ? d : {};
      return Array.isArray(out.favorite) ? out.favorite : [];
    }
    catch(e){ return []; }
  }
  function lsSave(arr){
    try{
      const d = JSON.parse(localStorage.getItem(LS_KEY));
      const out = (d && typeof d === "object") ? d : {};
      out.favorite = arr;
      if(!Array.isArray(out.past)) out.past = [];
      if(!Array.isArray(out.upcoming)) out.upcoming = [];
      localStorage.setItem(LS_KEY, JSON.stringify(out));
    }catch(e){}
  }

  async function load(){
    cache = new Map();
    if (signedIn()){
      const sb = NRA_AUTH.client();
      const { data, error } = await sb.from("itinerary_items")
        .select("id,place,country").eq("trip_type", "favorite").order("created_at");
      if (!error && data) data.forEach(it => cache.set(norm(it.place), it));
    } else {
      lsAll().forEach((it, i) => cache.set(norm(it.place), { id: "local-"+i, place: it.place, country: it.country||"" }));
    }
    loaded = true;
    fire();
  }

  function ready(){
    if (!readyPromise){
      readyPromise = (async () => {
        if (window.NRA_AUTH) { try{ await NRA_AUTH.ready(); }catch(e){} }
        await load();
        if (window.NRA_AUTH) NRA_AUTH.onChange(() => load());
      })();
    }
    return readyPromise;
  }

  function has(city){ return cache.has(norm(city)); }
  function count(){ return cache.size; }

  async function addFav(place, country){
    if (signedIn()){
      const sb = NRA_AUTH.client();
      const { error } = await sb.from("itinerary_items")
        .insert({ user_id: NRA_AUTH.user().id, trip_type: "favorite", place, country: country||"" });
      if (error) throw new Error("cloud");
    } else {
      const arr = lsAll(); arr.push({ place, country: country||"" }); lsSave(arr);
    }
  }
  async function removeFav(city){
    const entry = cache.get(norm(city));
    if (!entry) return;
    if (signedIn()){
      const sb = NRA_AUTH.client();
      const { error } = await sb.from("itinerary_items").delete().eq("id", entry.id);
      if (error) throw new Error("cloud");
    } else {
      const arr = lsAll().filter(it => norm(it.place) !== norm(city));
      lsSave(arr);
    }
  }

  async function toggle(city, country){
    await ready();
    if (has(city)){
      await removeFav(city);
    } else {
      await addFav(city, country);
    }
    await load();
    return has(city);
  }

  window.NRA_FAV = { ready, has, count, toggle, onChange: fn => listeners.push(fn) };
  ready();
})();
