/* share.js — one share popup for every Share button on the site.
   Phones: NRAShare.open() opens the phone's built-in share sheet
   (Messages, WhatsApp, Instagram, AirDrop — whatever apps they have).
   Computers: a small branded popup with Messages / WhatsApp / Facebook /
   Email / X buttons plus Copy link.
   Usage:  NRAShare.open({ title, text, url })                           */
window.NRAShare = (function(){
  "use strict";

  function isMobile(){
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent)); /* iPadOS pretends to be a Mac */
  }
  function isIOS(){
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
  }

  /* ---- the desktop popup ---- */
  let overlay = null;

  function buildLinks(text, url){
    const msg = encodeURIComponent(text + " " + url);
    const u   = encodeURIComponent(url);
    return [
      { label:"Messages",  icon:"💬", href: isIOS() ? ("sms:&body=" + msg) : ("sms:?body=" + msg) },
      { label:"WhatsApp",  icon:"🟢", href:"https://wa.me/?text=" + msg, blank:true },
      { label:"Facebook",  icon:"👥", href:"https://www.facebook.com/sharer/sharer.php?u=" + u, blank:true },
      { label:"X",         icon:"✖️", href:"https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + u, blank:true },
      { label:"Email",     icon:"✉️", href:"mailto:?subject=" + encodeURIComponent("Never Roam Alone") + "&body=" + msg }
    ];
  }

  function close(){
    if (overlay){ overlay.remove(); overlay = null; }
  }

  function popup(opts){
    close();
    const text = opts.text || opts.title || "";
    const url  = opts.url || location.href;

    overlay = document.createElement("div");
    overlay.setAttribute("style",
      "position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99999;" +
      "display:flex;align-items:center;justify-content:center;padding:16px");
    overlay.addEventListener("click", function(e){ if (e.target === overlay) close(); });

    const box = document.createElement("div");
    box.setAttribute("style",
      "background:#fff;border-radius:14px;max-width:340px;width:100%;" +
      "padding:20px 20px 16px;box-shadow:0 12px 40px rgba(0,0,0,.25);" +
      "font-family:inherit;text-align:center");

    const h = document.createElement("div");
    h.textContent = "Share";
    h.setAttribute("style","font-weight:700;font-size:1.05rem;color:#556B2F;margin-bottom:14px");
    box.appendChild(h);

    const grid = document.createElement("div");
    grid.setAttribute("style","display:grid;grid-template-columns:1fr 1fr;gap:8px");
    buildLinks(text, url).forEach(function(item){
      const a = document.createElement("a");
      a.href = item.href;
      if (item.blank){ a.target = "_blank"; a.rel = "noopener"; }
      a.setAttribute("style",
        "display:flex;align-items:center;gap:8px;justify-content:center;" +
        "padding:10px 8px;border:1px solid #d9d9cf;border-radius:10px;" +
        "text-decoration:none;color:#333;font-size:.92rem;font-weight:600;background:#fafaf6");
      a.addEventListener("mouseenter", function(){ a.style.borderColor = "#C04020"; a.style.color = "#C04020"; });
      a.addEventListener("mouseleave", function(){ a.style.borderColor = "#d9d9cf"; a.style.color = "#333"; });
      a.innerHTML = "<span aria-hidden=\"true\">" + item.icon + "</span>" + item.label;
      a.addEventListener("click", function(){ setTimeout(close, 300); });
      grid.appendChild(a);
    });

    /* Copy link — spans both columns */
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "🔗 Copy link";
    copyBtn.setAttribute("style",
      "grid-column:1 / -1;padding:10px 8px;border:1px solid #556B2F;border-radius:10px;" +
      "background:#556B2F;color:#fff;font-size:.92rem;font-weight:600;cursor:pointer");
    copyBtn.addEventListener("click", async function(){
      try{ await navigator.clipboard.writeText(url); }
      catch(e){
        const t = document.createElement("textarea");
        t.value = url; t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.focus(); t.select();
        try{ document.execCommand("copy"); }catch(_){ window.prompt("Copy this link:", url); }
        document.body.removeChild(t);
      }
      copyBtn.textContent = "✓ Copied!";
      setTimeout(close, 900);
    });
    grid.appendChild(copyBtn);
    box.appendChild(grid);

    const x = document.createElement("button");
    x.type = "button";
    x.textContent = "Cancel";
    x.setAttribute("style",
      "margin-top:10px;background:none;border:none;color:#888;font-size:.88rem;" +
      "cursor:pointer;text-decoration:underline");
    x.addEventListener("click", close);
    box.appendChild(x);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  /* ---- public entry point ---- */
  async function open(opts){
    opts = opts || {};
    /* Phones: the built-in share sheet knows every app they have
       (including Instagram, which has no web share link). */
    if (isMobile() && navigator.share){
      try{
        await navigator.share({ title: opts.title, text: opts.text, url: opts.url });
        return;
      }catch(e){
        if (e && e.name === "AbortError") return;  /* they closed it — done */
        /* anything else: fall through to our popup */
      }
    }
    popup(opts);
  }

  return { open: open, close: close };
})();
