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
     mount(el)        → wires up one .vote-widget element
     mountStar(el)    → wires up one single-button .vote-star-widget (e.g. a
                        landmark's must-not-miss star: up(1)/off(0), no down)
     mountAll(root)   → wires up every .vote-widget and .vote-star-widget
                        under root (default: document)
     widgetHTML(opts) → builds a .vote-widget's markup (one icon shape, one
                        place to edit it; opts.beforeHint drops extra markup,
                        e.g. a star widget, between the up button and the "i".
                        Used by every page — city.html and
                        post.html both call this instead of hand-writing SVG)
     starHTML(opts)   → builds a .vote-star-widget's markup
   ===================================================================== */
window.NRA_VOTES = (function(){
  function signedIn(){ return !!(window.NRA_AUTH && NRA_AUTH.enabled && NRA_AUTH.user()); }
  function key(type, id){ return type + ":" + id; }

  const VOTE_HAND_PATH = "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z";
  const VOTE_STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z";
  const INFO_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none"/></svg>`;
  const escAttr = v => String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");

  function widgetHTML(opts){
    const s = opts.size || 16;
    const icon = down => `<svg class="vote-icon${down ? " vote-icon-down" : ""}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="${VOTE_HAND_PATH}"/></svg>`;
    return `<div class="vote-widget${opts.extraClass ? " " + opts.extraClass : ""}" data-vote-type="${escAttr(opts.type)}" data-vote-id="${escAttr(opts.id)}" data-vote-city="${escAttr(opts.city)}">
    <button type="button" class="vote-btn vote-down" aria-label="${escAttr(opts.downLabel)}">${icon(true)}<span class="vote-count"></span></button>
    <button type="button" class="vote-btn vote-up" aria-label="${escAttr(opts.upLabel)}">${icon(false)}<span class="vote-count"></span></button>
    ${opts.beforeHint || ""}
    <button type="button" class="note-btn hint-btn" data-hint="${escAttr(opts.hint)}" onclick="event.stopPropagation();this.classList.toggle('open')" aria-label="What this rates">${INFO_ICON}</button>
  </div>`;
  }

  function starHTML(opts){
    const s = opts.size || 15;
    return `<div class="vote-star-widget${opts.extraClass ? " " + opts.extraClass : ""}" data-vote-type="${escAttr(opts.type)}" data-vote-id="${escAttr(opts.id)}" data-vote-city="${escAttr(opts.city)}">
    <button type="button" class="vote-star" aria-label="${escAttr(opts.label)}"><svg class="vote-star-icon" width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="${VOTE_STAR_PATH}"/></svg><span class="vote-count"></span></button>
  </div>`;
  }

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
    /* Vote widgets often sit inside a bigger clickable surface (a hood tile
       that switches tabs on any click, a landmark/day-trip card that may
       link out) — stop the click there so voting never triggers it too. */
    upBtn.addEventListener("click", e => { e.stopPropagation(); onClick(1); });
    downBtn.addEventListener("click", e => { e.stopPropagation(); onClick(-1); });
    refresh();
    if (window.NRA_AUTH) NRA_AUTH.onChange(refresh);
  }

  /* A single-button "star" toggle (the landmark must-not-miss flag): same
     up(1)/off(0) cast() mechanics as a regular vote, just one button and no
     down state — reuses the same content_votes row shape via a distinct
     target_id suffix (":star") on the type it's marking, not a new type. */
  function mountStar(el){
    if (!el || el.dataset.voteMounted) return;
    el.dataset.voteMounted = "1";
    const type = el.dataset.voteType, id = el.dataset.voteId, city = el.dataset.voteCity || "";
    const btn = el.querySelector(".vote-star");
    if (!type || !id || !btn) return;
    const count = btn.querySelector(".vote-count");
    function paint(counts, mine){
      if (count) count.textContent = counts.up || "";
      btn.classList.toggle("active", mine === 1);
    }
    function refresh(){
      return Promise.all([fetchCounts(type, id), fetchMine(type, id)]).then(r => paint(r[0], r[1]));
    }
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (!signedIn()){
        if (window.NRA_AUTH) NRA_AUTH.openModal();
        return;
      }
      btn.disabled = true;
      cast(type, id, city, 1).then(refresh).catch(()=>{}).finally(()=>{ btn.disabled = false; });
    });
    refresh();
    if (window.NRA_AUTH) NRA_AUTH.onChange(refresh);
  }

  function mountAll(root){
    const scope = root || document;
    scope.querySelectorAll(".vote-widget[data-vote-type]").forEach(mount);
    scope.querySelectorAll(".vote-star-widget[data-vote-type]").forEach(mountStar);
  }

  return { mount, mountStar, mountAll, widgetHTML, starHTML };
})();
