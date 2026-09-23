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

  /* -------------------------------------------------------------------
     What each thumb means, per surface. One copy of this wording for the
     whole site, from Jeff's sheet (Like/Dislike prompt.xlsx, 2026-09-23),
     used as written, with five spelling fixes (Jeff, 2026-09-23). The bubble shows:
         Like - <up>
         Dislike - <down>
         Star - <star>        (only where that surface has a star)
     and the same lines are the buttons' aria-labels. Keyed by vote type,
     so a new surface adds its row here, not in the page.
     ------------------------------------------------------------------- */
  const PROMPTS = {
    visitors:       { up:"I loved it here", down:"I didn't enjoy my time there" },
    stay_card:      { up:"Timeframe was accurate for me", down:"Not accurate timeframe" },
    laundromat:     { up:"Information was good or machines worked great", down:"Information was wrong or machines were malfunctioning" },
    gym:            { up:"Pass information was right or Great gym experience", down:"Pass information was wrong or the Gym wasn't up to standard" },
    food_place:     { up:"I recommend this place", down:"I don't recommend this place" },
    recommendation: { up:"I recommend this place", down:"I don't recommend this place" },
    hood_photo:     { up:"I have stayed here before and it's a great place to stay", down:"I have stayed here before and would recommend staying elsewhere" },
    landmark:       { up:"Great experience or photo opportunity", down:"Disappointing, not worth the time", star:"CAN'T miss attraction!!!" },
    cost_estimator: { up:"Pretty accurate estimate based on my past stay for the listed budget tiers", down:"Not very accurate estimate based on my past stay for the listed budget tiers" },
    safety_note:    { up:"I have been and I feel this should be taken seriously", down:"I have been and I feel this doesn't reflect real world scenarios" },
    daytrip:        { up:"Great experience or photo opportunity", down:"Disappointing, not worth the time" },
    event:          { up:"It was a great event, I recommend to others", down:"Information in the invite was inaccurate or it wasn't a great event" },
    insight:        { up:"This was great to get this point of view", down:"This interview didn't really help me" },
    blog_article:   { up:"The information or presentation was helpful and/or inspiring", down:"The information or presentation was lacking for me" }
  };
  /* The bubble is one attribute; the line breaks show because .hint-btn::after
     is white-space:pre-line (master.css). */
  function hintFor(type, hasStar){
    const p = PROMPTS[type]; if (!p) return "";
    return `Like - ${p.up}\nDislike - ${p.down}` + (hasStar && p.star ? `\nStar - ${p.star}` : "");
  }

  function widgetHTML(opts){
    const s = opts.size || 16;
    const p = PROMPTS[opts.type] || {};
    const upLabel = p.up || opts.upLabel, downLabel = p.down || opts.downLabel;
    const hint = hintFor(opts.type, !!opts.beforeHint) || opts.hint;
    const icon = down => `<svg class="vote-icon${down ? " vote-icon-down" : ""}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="${VOTE_HAND_PATH}"/></svg>`;
    return `<div class="vote-widget${opts.extraClass ? " " + opts.extraClass : ""}" data-vote-type="${escAttr(opts.type)}" data-vote-id="${escAttr(opts.id)}" data-vote-city="${escAttr(opts.city)}">
    <button type="button" class="vote-btn vote-down" aria-label="${escAttr(downLabel)}">${icon(true)}<span class="vote-count"></span></button>
    <button type="button" class="vote-btn vote-up" aria-label="${escAttr(upLabel)}">${icon(false)}<span class="vote-count"></span></button>
    ${opts.beforeHint || ""}
    <button type="button" class="note-btn hint-btn" data-hint="${escAttr(hint)}" onclick="event.stopPropagation();this.classList.toggle('open')" aria-label="What this rates">${INFO_ICON}</button>
  </div>`;
  }

  function starHTML(opts){
    const s = opts.size || 15;
    const star = (PROMPTS[opts.type] || {}).star;
    return `<div class="vote-star-widget${opts.extraClass ? " " + opts.extraClass : ""}" data-vote-type="${escAttr(opts.type)}" data-vote-id="${escAttr(opts.id)}" data-vote-city="${escAttr(opts.city)}">
    <button type="button" class="vote-star" aria-label="${escAttr(star || opts.label)}"><svg class="vote-star-icon" width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="${VOTE_STAR_PATH}"/></svg><span class="vote-count"></span></button>
  </div>`;
  }

  const SIGNIN_NOTE = "You must be signed in to use the Like/Dislike feature";

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
        if (window.NRA_AUTH) NRA_AUTH.openModal({ note: SIGNIN_NOTE });
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
        if (window.NRA_AUTH) NRA_AUTH.openModal({ note: SIGNIN_NOTE });
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

  /* ---------------------------------------------------------------------
     The info bubble floats above the page.

     It used to be a CSS ::after on the button, which meant any card that
     clips its contents (landmark card, neighborhood tile, hood card) cut the
     bubble in half — and Jeff's Like / Dislike / Star copy made it three
     lines, so the clipping showed. One fixed-position element, positioned
     next to whichever icon is open and clamped to the screen, cannot be
     clipped and cannot widen the page. The CSS ::after stays as the
     no-JavaScript fallback; `html.has-hint-pop` turns it off once this runs.
     Works for every .hint-btn on the site, not only the vote widgets.
     --------------------------------------------------------------------- */
  let popEl = null;
  function pop(){
    if (!popEl){
      popEl = document.createElement("div");
      popEl.className = "hint-pop";
      popEl.setAttribute("role", "tooltip");
      document.body.appendChild(popEl);
    }
    return popEl;
  }
  let popFor = null;                      // the button the bubble belongs to
  function hidePop(){ popFor = null; if (popEl) popEl.classList.remove("open"); document.querySelectorAll(".hint-btn.open").forEach(b => b.classList.remove("open")); }
  function placePop(btn){
    const el = pop();
    const r = btn.getBoundingClientRect(), b = el.getBoundingClientRect();
    const pad = 8;
    let left = r.left + r.width / 2 - b.width / 2;
    left = Math.max(pad, Math.min(left, document.documentElement.clientWidth - b.width - pad));
    let top = r.bottom + 6;                                   // below the icon,
    if (top + b.height > window.innerHeight - pad) top = r.top - b.height - 6;   // or above it when that would run off the bottom
    top = Math.max(pad, Math.min(top, window.innerHeight - b.height - pad));     // and always fully on screen
    el.style.left = Math.round(left) + "px";
    el.style.top = Math.round(top) + "px";
  }
  function showPop(btn){
    const text = btn.getAttribute("data-hint");
    if (!text) return;
    const el = pop();
    el.textContent = text;
    el.classList.add("open");
    popFor = btn;
    placePop(btn);
  }
  function initHintPops(){
    if (document.documentElement.classList.contains("has-hint-pop")) return;
    document.documentElement.classList.add("has-hint-pop");
    document.addEventListener("click", e => {
      const btn = e.target.closest(".hint-btn");
      if (!btn){ hidePop(); return; }
      const wasOpen = popFor === btn;
      hidePop();
      if (!wasOpen) showPop(btn);
    }, true);
    document.addEventListener("mouseover", e => {
      const btn = e.target.closest(".hint-btn");
      if (btn && window.matchMedia("(hover:hover)").matches) showPop(btn);
    });
    document.addEventListener("mouseout", e => {
      const btn = e.target.closest(".hint-btn");
      if (btn && window.matchMedia("(hover:hover)").matches && !e.relatedTarget?.closest?.(".hint-btn")) hidePop();
    });
    /* follow the icon instead of closing, so a click that scrolls the page a
       little (a lazy section loading, the card expanding) doesn't swallow it */
    const reflow = () => { if (popFor) { if (popFor.isConnected) placePop(popFor); else hidePop(); } };
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHintPops);
  else initHintPops();

  return { mount, mountStar, mountAll, widgetHTML, starHTML };
})();
