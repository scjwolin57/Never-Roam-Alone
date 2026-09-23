/* =====================================================================
   VOTES.JS — shared thumbs up/down widget for the site-wide contribution
   feature (content-votes-setup.sql). One control per item: a signed-in
   visitor casts up or down, never both, and can change their mind.

   Any page that wants a vote widget on some item marks it up as:
     <div class="vote-widget" data-vote-type="<target_type>" data-vote-id="<target_id>" data-vote-city="<city, optional>">
       <button type="button" class="vote-btn vote-up" aria-label="...">
         <svg class="vote-icon">...</svg><span class="vote-count vote-up-count"></span>
       </button>
       <button type="button" class="vote-btn vote-down" aria-label="...">
         <svg class="vote-icon vote-icon-down">...</svg><span class="vote-count vote-down-count"></span>
       </button>
       <!-- optional: a .hint-btn "i" icon nearby explaining the basis -->
     </div>
   then calls NRA_VOTES.mountAll() (or .mount(el) for one) once that
   markup is actually in the DOM — voting requires a signed-in visitor,
   so guest mode shows the buttons but a click opens the sign-in modal.

   Exposes window.NRA_VOTES:
     mount(el)      → wires up one .vote-widget element
     mountAll(root) → wires up every .vote-widget under root (default: document)
   ===================================================================== */
window.NRA_VOTES = (function(){
  function signedIn(){ return !!(window.NRA_AUTH && NRA_AUTH.enabled && NRA_AUTH.user()); }
  function key(type, id){ return type + ":" + id; }

  const countCache = new Map();   // "type:id" -> {up, down}
  const mineCache = new Map();    // "type:id" -> -1 | 0 | 1

  async function fetchCounts(type, id){
    const k = key(type, id);
    if (!window.NRA_AUTH || !NRA_AUTH.enabled) return { up: 0, down: 0 };
    await NRA_AUTH.ready();
    const sb = NRA_AUTH.client();
    if (!sb) return { up: 0, down: 0 };
    const { data } = await sb.from("content_vote_counts").select("up,down")
      .eq("target_type", type).eq("target_id", id).maybeSingle();
    const counts = data || { up: 0, down: 0 };
    countCache.set(k, counts);
    return counts;
  }

  async function fetchMine(type, id){
    const k = key(type, id);
    if (!signedIn()) return 0;
    const sb = NRA_AUTH.client();
    const { data } = await sb.from("content_votes").select("value")
      .eq("target_type", type).eq("target_id", id).eq("user_id", NRA_AUTH.user().id).maybeSingle();
    const v = data ? data.value : 0;
    mineCache.set(k, v);
    return v;
  }

  async function cast(type, id, city, value){
    const sb = NRA_AUTH.client();
    const k = key(type, id);
    const current = mineCache.get(k) || 0;
    const next = current === value ? 0 : value;   // clicking the active thumb again clears it
    if (next === 0){
      await sb.from("content_votes").delete()
        .eq("target_type", type).eq("target_id", id).eq("user_id", NRA_AUTH.user().id);
    } else if (current === 0){
      await sb.from("content_votes").insert({ user_id: NRA_AUTH.user().id, target_type: type, target_id: id, city: city || null, value: next });
    } else {
      await sb.from("content_votes").update({ value: next })
        .eq("target_type", type).eq("target_id", id).eq("user_id", NRA_AUTH.user().id);
    }
    mineCache.set(k, next);
    countCache.delete(k);
    return next;
  }

  function mount(el){
    if (!el || el.dataset.voteMounted) return;
    el.dataset.voteMounted = "1";
    const type = el.dataset.voteType, id = el.dataset.voteId, city = el.dataset.voteCity || "";
    const upBtn = el.querySelector(".vote-up"), downBtn = el.querySelector(".vote-down");
    if (!type || !id || !upBtn || !downBtn) return;
    const upCount = upBtn.querySelector(".vote-count"), downCount = downBtn.querySelector(".vote-count");

    function paint(counts, mine){
      if (upCount) upCount.textContent = counts.up || "";
      if (downCount) downCount.textContent = counts.down || "";
      upBtn.classList.toggle("active", mine === 1);
      downBtn.classList.toggle("active", mine === -1);
    }
    function refresh(){
      return Promise.all([fetchCounts(type, id), fetchMine(type, id)]).then(r => paint(r[0], r[1]));
    }
    function onClick(value){
      if (!signedIn()){
        if (window.NRA_AUTH) NRA_AUTH.openModal();
        return;
      }
      upBtn.disabled = downBtn.disabled = true;
      cast(type, id, city, value).then(refresh).catch(()=>{}).finally(()=>{ upBtn.disabled = downBtn.disabled = false; });
    }
    upBtn.addEventListener("click", () => onClick(1));
    downBtn.addEventListener("click", () => onClick(-1));
    refresh();
    if (window.NRA_AUTH) NRA_AUTH.onChange(refresh);
  }

  function mountAll(root){
    (root || document).querySelectorAll(".vote-widget[data-vote-type]").forEach(mount);
  }

  return { mount, mountAll };
})();
