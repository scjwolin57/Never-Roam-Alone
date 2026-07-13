/* =====================================================================
   VISITED.JS — "been there" travel-map + Bucket List progress tracking.
   Used by profile.html (the map + checklist), roamer.html (read-only
   display on public profiles) and choose.html (checkmark on each
   Bucket List landmark card).

   Two lists, both simple arrays of strings:
   • places  — every map pin (one of the 101 featured or 145 coming-
     soon cities) the person has marked "been there", PLUS any free-
     text place they typed in that isn't on the map.
   • bucket  — names of Bucket List landmarks (window.NRA_BUCKET) they've
     checked off as visited.

   Storage:
   • Signed in  → Supabase profiles.visited_places / visited_bucket
     (jsonb arrays — run travel-map-setup.sql once).
   • Signed out → localStorage ("nra_visited_places_v1" /
     "nra_visited_bucket_v1").

   Exposes window.NRA_VISITED:
     ready()                  → promise
     places() / bucket()      → current arrays (synchronous, from cache)
     hasPlace(name) / hasBucket(name)
     togglePlace(name)        → promise<bool> new state (map pins AND free text)
     toggleBucket(name)       → promise<bool> new state
     onChange(fn)
   ===================================================================== */
(function(){
  const LS_PLACES = "nra_visited_places_v1";
  const LS_BUCKET = "nra_visited_bucket_v1";
  const norm = s => String(s||"").trim().toLowerCase();

  let places = [];
  let bucket = [];
  let readyPromise = null;
  const listeners = [];
  const fire = () => listeners.forEach(fn => { try{ fn(); }catch(e){} });

  function signedIn(){ return !!(window.NRA_AUTH && NRA_AUTH.enabled && NRA_AUTH.user()); }

  function lsGet(key){ try{ const d = JSON.parse(localStorage.getItem(key)); return Array.isArray(d) ? d : []; }catch(e){ return []; } }
  function lsSet(key, arr){ try{ localStorage.setItem(key, JSON.stringify(arr)); }catch(e){} }

  function load(){
    if (signedIn()){
      const p = NRA_AUTH.profile ? NRA_AUTH.profile() : null;
      places = (p && Array.isArray(p.visited_places)) ? p.visited_places.slice() : [];
      bucket = (p && Array.isArray(p.visited_bucket)) ? p.visited_bucket.slice() : [];
    } else {
      places = lsGet(LS_PLACES);
      bucket = lsGet(LS_BUCKET);
    }
    fire();
  }

  function ready(){
    if (!readyPromise){
      readyPromise = (async () => {
        if (window.NRA_AUTH){ try{ await NRA_AUTH.ready(); }catch(e){} NRA_AUTH.onChange(load); }
        load();
      })();
    }
    return readyPromise;
  }

  async function save(){
    if (signedIn()){
      const res = await NRA_AUTH.updateProfile({ visited_places: places, visited_bucket: bucket });
      if (!res.ok) throw new Error(res.error || "cloud");
    } else {
      lsSet(LS_PLACES, places);
      lsSet(LS_BUCKET, bucket);
    }
    fire();
  }

  function hasPlace(name){ return places.some(p => norm(p) === norm(name)); }
  function hasBucket(name){ return bucket.some(p => norm(p) === norm(name)); }

  async function togglePlace(name){
    await ready();
    name = String(name||"").trim();
    if (!name) return hasPlace(name);
    if (hasPlace(name)) places = places.filter(p => norm(p) !== norm(name));
    else places.push(name);
    await save();
    return hasPlace(name);
  }
  async function toggleBucket(name){
    await ready();
    name = String(name||"").trim();
    if (!name) return hasBucket(name);
    if (hasBucket(name)) bucket = bucket.filter(p => norm(p) !== norm(name));
    else bucket.push(name);
    await save();
    return hasBucket(name);
  }

  window.NRA_VISITED = {
    ready,
    places: () => places.slice(),
    bucket: () => bucket.slice(),
    hasPlace, hasBucket, togglePlace, toggleBucket,
    onChange: fn => listeners.push(fn)
  };
  ready();
})();
