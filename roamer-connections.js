/* =====================================================================
   ROAMER'S CONNECTIONS — the per-city message board that sits under
   "Roamers in town" on every city guide page (Plate 07).

   PLAIN ENGLISH
   -------------
   • Anyone can read the board. You must be signed in to post, reply,
     like or report — tapping any of those opens the sign-in popup.
   • "+ Add post" opens a small form: Title, Hashtags, Details.
   • Posts show collapsed (title + who + tags + counts). Tap one and it
     expands in place to show the full text and its replies. Replies are
     only fetched when a post is actually opened, so the page stays fast.
   • Sort: Newest (default) or Most liked. Tapping a #hashtag filters
     the board to that tag; tap the X on the filter chip to clear it.
   • Authors get a "Delete" link on their own post/reply. Everyone else
     gets "Report", which flags it in admin.html and emails the site
     owner (netlify/functions/report-alert.js).

   HOW IT'S WIRED
   --------------
   city.html renders  <aside class="rc-card" id="rc-card" data-city="…">
   inside Plate 07 and this script fills it (a window.NRA_RC_CITY global
   also works). Database side: roamer-connections-setup.sql.
   Nothing here runs until the card scrolls into view.
   ===================================================================== */
(function () {
  "use strict";

  var CITY = null;
  var card = null, listEl = null, tagsEl = null, moreBtn = null, sortSel = null;
  var PAGE = 10;                 // posts fetched at a time
  var state = {
    sort: "new",
    tag: null,
    offset: 0,
    posts: [],
    loaded: false,
    busy: false,
    openId: null
  };

  /* ---------- tiny helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "R";
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  }
  function ago(iso) {
    var t = Date.parse(iso);
    if (isNaN(t)) return "";
    var s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    if (s < 604800) return Math.floor(s / 86400) + "d ago";
    var d = new Date(t);
    return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()] + " " + d.getDate();
  }
  function avatarHtml(p) {
    return p.avatar_url
      ? '<span class="rc-av" style="background-image:url(\'' + esc(p.avatar_url) + '\')" aria-hidden="true"></span>'
      : '<span class="rc-av" aria-hidden="true">' + esc(initials(p.author_name)) + "</span>";
  }
  function nameHtml(p) {
    var n = esc(p.author_name || "Roamer");
    return p.author_public
      ? '<a class="rc-who" href="roamer.html?id=' + encodeURIComponent(p.author_id) + '">' + n + "</a>"
      : '<span class="rc-who">' + n + "</span>";
  }
  function parseTags(raw) {
    var seen = {}, out = [];
    String(raw || "").split(/[\s,]+/).forEach(function (t) {
      t = t.replace(/^#+/, "").replace(/[^0-9a-zA-ZÀ-ɏ_-]/g, "").toLowerCase();
      if (!t || t.length > 24 || seen[t]) return;
      seen[t] = 1;
      if (out.length < 6) out.push(t);
    });
    return out;
  }

  /* ---------- supabase / auth ---------- */
  function getClient() {
    return new Promise(function (resolve) {
      var tries = 0;
      (function poll() {
        if (window.NRA_AUTH && window.NRA_AUTH.enabled) {
          Promise.resolve(window.NRA_AUTH.ready && window.NRA_AUTH.ready())
            .then(function () { resolve(window.NRA_AUTH.client ? window.NRA_AUTH.client() : null); })
            .catch(function () { resolve(null); });
          return;
        }
        if (tries++ > 100) { resolve(null); return; }   // ~10s then give up
        setTimeout(poll, 100);
      })();
    });
  }
  function me() {
    return (window.NRA_AUTH && window.NRA_AUTH.user && window.NRA_AUTH.user()) || null;
  }
  function needSignIn() {
    if (me()) return false;
    if (window.NRA_AUTH && window.NRA_AUTH.openModal) window.NRA_AUTH.openModal();
    return true;
  }

  /* ---------- styles (kept here so city.html stays untouched) ---------- */
  function injectCss() {
    if (document.getElementById("rc-css")) return;
    var css = ''
      + '.rc-card{background:var(--card,#fff);border-radius:16px;box-shadow:var(--shadow,0 6px 20px rgba(0,0,0,.08));padding:18px 18px 20px}'
      + '.rc-head{margin:0 0 4px;font-size:1.15rem;color:var(--green,#556B2F)}'
      + '.rc-sub{margin:0 0 12px;color:var(--muted,#777);font-size:.82rem;line-height:1.5}'
      + '.rc-add{display:block;width:100%;background:var(--green,#556B2F);color:#fff;border:none;font-family:inherit;font-weight:700;font-size:.86rem;padding:10px 14px;border-radius:10px;cursor:pointer}'
      + '.rc-add:hover{filter:brightness(1.1)}'
      + '.rc-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0 2px}'
      + '.rc-bar label{font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted,#777);font-weight:700}'
      + '.rc-sort{flex:1;min-width:0;border:1.5px solid #ddd4c2;border-radius:8px;padding:6px 8px;font-family:inherit;font-size:.8rem;color:var(--ink,#333);background:#fff}'
      + '.rc-sort:focus{outline:none;border-color:var(--green,#556B2F)}'
      + '.rc-tagrow{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 2px}'
      + '.rc-tag{background:rgba(63,81,56,.10);color:var(--green,#556B2F);border:none;font-family:inherit;font-size:.7rem;font-weight:700;padding:3px 9px;border-radius:11px;cursor:pointer}'
      + '.rc-tag:hover{background:rgba(63,81,56,.2)}'
      + '.rc-tag.on{background:var(--green,#556B2F);color:#fff}'
      + '.rc-post{border-top:1px solid rgba(63,81,56,.12);padding:11px 0}'
      + '.rc-top{display:flex;gap:9px;align-items:flex-start;cursor:pointer}'
      + '.rc-av{width:30px;height:30px;flex-shrink:0;border-radius:50%;background:var(--green,#556B2F);background-size:cover;background-position:center;color:#fff;font-weight:800;font-size:.7rem;display:flex;align-items:center;justify-content:center}'
      + '.rc-mid{flex:1;min-width:0}'
      + '.rc-title{font-weight:700;font-size:.9rem;line-height:1.35;color:var(--ink,#333);word-break:break-word}'
      + '.rc-meta{color:var(--muted,#777);font-size:.72rem;margin-top:1px}'
      + '.rc-who{color:var(--green,#556B2F);font-weight:700}'
      + 'a.rc-who:hover{color:var(--coral,#C04020)}'
      + '.rc-caret{flex-shrink:0;color:var(--muted,#777);font-size:.8rem;line-height:1.6;transition:transform .18s}'
      + '.rc-post.open .rc-caret{transform:rotate(180deg)}'
      + '.rc-body{display:none;margin:8px 0 0 39px}'
      + '.rc-post.open .rc-body{display:block}'
      + '.rc-text{font-size:.84rem;line-height:1.5;color:var(--ink,#333);white-space:pre-wrap;word-break:break-word;margin:0 0 8px}'
      + '.rc-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:6px;margin-left:39px;font-size:.74rem;color:var(--muted,#777)}'
      + '.rc-like{background:none;border:none;font-family:inherit;font-size:.74rem;color:var(--muted,#777);cursor:pointer;padding:0;font-weight:700}'
      + '.rc-like:hover{color:var(--coral,#C04020)}'
      + '.rc-like.on{color:var(--coral,#C04020)}'
      + '.rc-link{background:none;border:none;font-family:inherit;font-size:.72rem;color:var(--muted,#777);cursor:pointer;padding:0;text-decoration:underline}'
      + '.rc-link:hover{color:var(--coral,#C04020)}'
      + '.rc-reply{display:flex;gap:8px;align-items:flex-start;padding:8px 0;border-top:1px dashed rgba(63,81,56,.15)}'
      + '.rc-reply .rc-av{width:24px;height:24px;font-size:.62rem}'
      + '.rc-rtext{font-size:.8rem;line-height:1.45;color:var(--ink,#333);white-space:pre-wrap;word-break:break-word}'
      + '.rc-rbox{width:100%;box-sizing:border-box;border:1.5px solid #ddd4c2;border-radius:9px;padding:8px 10px;font-family:inherit;font-size:.82rem;color:var(--ink,#333);background:#fff;resize:vertical;min-height:56px;margin-top:8px}'
      + '.rc-rbox:focus{outline:none;border-color:var(--green,#556B2F)}'
      + '.rc-rsend{margin-top:6px;background:var(--green,#556B2F);color:#fff;border:none;font-family:inherit;font-weight:700;font-size:.76rem;padding:7px 14px;border-radius:9px;cursor:pointer}'
      + '.rc-rsend[disabled]{opacity:.6;cursor:default}'
      + '.rc-note{color:var(--muted,#777);font-size:.82rem;line-height:1.55;margin:10px 0 0}'
      + '.rc-more{display:block;width:100%;margin-top:12px;background:var(--sand,#f4eee0);border:none;font-family:inherit;font-weight:700;font-size:.78rem;color:var(--green,#556B2F);padding:8px;border-radius:9px;cursor:pointer}'
      + '.rc-more[hidden]{display:none}'
      + '.rc-askrow{margin-top:16px;padding-top:16px;border-top:1px solid rgba(63,81,56,.12)}'
      + '.rc-asktext{margin:0 0 10px;color:var(--muted,#777);font-size:.82rem;line-height:1.5}'
      + '.rc-askbtn{display:block;width:100%;box-sizing:border-box;text-align:center;background:var(--green,#556B2F);color:#fff;font-weight:700;font-size:.86rem;padding:10px 14px;border-radius:10px;text-decoration:none}'
      + '.rc-askbtn:hover{filter:brightness(1.1)}'
      /* the Add-post popup (own overlay so this file works on its own) */
      + '.rc-ov{position:fixed;inset:0;background:rgba(20,28,34,.55);display:none;align-items:flex-start;justify-content:center;z-index:220;padding:40px 16px;overflow-y:auto}'
      + '.rc-ov.open{display:flex}'
      + '.rc-modal{background:#fff;border-radius:16px;max-width:520px;width:100%;padding:22px 22px 26px;box-shadow:0 20px 60px rgba(0,0,0,.25);position:relative}'
      + '.rc-modal h3{margin:0 34px 4px 0;color:var(--green,#556B2F);font-size:1.3rem}'
      + '.rc-modal p.rc-msub{color:var(--muted,#777);font-size:.86rem;margin:0 0 6px}'
      + '.rc-x{position:absolute;top:14px;right:14px;background:var(--sand,#f4eee0);border:none;width:32px;height:32px;border-radius:8px;font-size:1.1rem;cursor:pointer;color:var(--ink,#333);line-height:1}'
      + '.rc-modal label{display:block;font-size:.78rem;font-weight:700;color:var(--teal,#3f5138);text-transform:uppercase;letter-spacing:.04em;margin:14px 0 5px}'
      + '.rc-modal input[type=text],.rc-modal textarea{width:100%;box-sizing:border-box;border:1.5px solid #ddd4c2;border-radius:9px;padding:9px 11px;font-family:inherit;font-size:.92rem;color:var(--ink,#333);background:#fff}'
      + '.rc-modal textarea{min-height:120px;resize:vertical}'
      + '.rc-modal input:focus,.rc-modal textarea:focus{outline:none;border-color:var(--green,#556B2F)}'
      + '.rc-hint{font-size:.74rem;color:var(--muted,#777);font-weight:400;text-transform:none;letter-spacing:0;margin-top:3px}'
      + '.rc-actions{margin-top:20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}'
      + '.rc-send{background:var(--green,#556B2F);color:#fff;border:none;font-family:inherit;font-weight:700;font-size:.92rem;padding:11px 20px;border-radius:10px;cursor:pointer}'
      + '.rc-send[disabled]{opacity:.6;cursor:default}'
      + '.rc-formmsg{font-size:.85rem;font-weight:600}'
      + '.rc-formmsg.ok{color:var(--green,#556B2F)}'
      + '.rc-formmsg.err{color:#b3261e}';
    var s = document.createElement("style");
    s.id = "rc-css";
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- shell markup ---------- */
  function buildShell() {
    card.innerHTML =
      '<h3 class="rc-head">Social Connections</h3>' +
      '<p class="rc-sub">The ' + esc(CITY) + ' connections board — meet-ups, activities and travel buddies. Sign in to join in.</p>' +
      '<button type="button" class="rc-add" id="rc-add">+ Add post</button>' +
      '<div class="rc-bar"><label for="rc-sort">Sort</label>' +
        '<select class="rc-sort" id="rc-sort">' +
          '<option value="new">Newest first</option>' +
          '<option value="liked">Most liked</option>' +
        '</select></div>' +
      '<div class="rc-tagrow" id="rc-tags"></div>' +
      '<div id="rc-list"><p class="rc-note">Loading posts&hellip;</p></div>' +
      '<button type="button" class="rc-more" id="rc-more" hidden>Show more posts</button>' +
      '<div class="rc-askrow">' +
        '<p class="rc-asktext">Have a city specific question? Check out the "Ask a Roamer" forum to get your questions answered.</p>' +
        '<a class="rc-askbtn" href="askaroamer.html?city=' + encodeURIComponent(CITY) + '">Ask a Roamer</a>' +
      '</div>';

    listEl  = document.getElementById("rc-list");
    tagsEl  = document.getElementById("rc-tags");
    moreBtn = document.getElementById("rc-more");
    sortSel = document.getElementById("rc-sort");

    document.getElementById("rc-add").addEventListener("click", openForm);
    sortSel.addEventListener("change", function () {
      state.sort = sortSel.value;
      reload();
    });
    moreBtn.addEventListener("click", function () { loadPage(false); });
    listEl.addEventListener("click", onListClick);
    tagsEl.addEventListener("click", onListClick);   // the filter chips above the list
  }

  /* ---------- rendering ---------- */
  function postHtml(p) {
    var open = state.openId === p.id;
    var tags = (p.tags || []).map(function (t) {
      return '<button type="button" class="rc-tag" data-tag="' + esc(t) + '">#' + esc(t) + "</button>";
    }).join("");
    return '<div class="rc-post' + (open ? " open" : "") + '" data-id="' + esc(p.id) + '">' +
        '<div class="rc-top" data-act="toggle">' +
          avatarHtml(p) +
          '<div class="rc-mid">' +
            '<div class="rc-title">' + esc(p.title) + "</div>" +
            '<div class="rc-meta">' + nameHtml(p) + " &middot; " + esc(ago(p.created_at)) + "</div>" +
          "</div>" +
          '<span class="rc-caret">&#9660;</span>' +
        "</div>" +
        '<div class="rc-body">' +
          (p.body ? '<p class="rc-text">' + esc(p.body) + "</p>" : "") +
          (tags ? '<div class="rc-tagrow">' + tags + "</div>" : "") +
          '<div class="rc-replies" data-replies>' + (open ? '<p class="rc-note">Loading replies&hellip;</p>' : "") + "</div>" +
        "</div>" +
        '<div class="rc-foot">' +
          '<button type="button" class="rc-like' + (p.liked_by_me ? " on" : "") + '" data-act="like">' +
            (p.liked_by_me ? "&#9829;" : "&#9825;") + " " + (p.like_count || 0) + "</button>" +
          '<button type="button" class="rc-link" data-act="toggle">&#128172; ' + (p.reply_count || 0) + " " +
            ((p.reply_count === 1) ? "reply" : "replies") + "</button>" +
          (p.is_mine
            ? '<button type="button" class="rc-link" data-act="del-post">Delete</button>'
            : '<button type="button" class="rc-link" data-act="report-post">Report</button>') +
        "</div>" +
      "</div>";
  }

  function render() {
    if (!state.posts.length) {
      listEl.innerHTML = '<p class="rc-note">' +
        (state.tag
          ? "No posts tagged #" + esc(state.tag) + " yet."
          : "No posts yet — be the first to start a connection in " + esc(CITY) + ".") +
        "</p>";
    } else {
      listEl.innerHTML = state.posts.map(postHtml).join("");
      if (state.openId) {
        var openEl = listEl.querySelector('.rc-post[data-id="' + state.openId + '"]');
        if (openEl) loadReplies(state.openId, openEl.querySelector("[data-replies]"));
      }
    }
  }

  function renderTagChips(rows) {
    var html = "";
    if (state.tag) {
      html += '<button type="button" class="rc-tag on" data-tag="">#' + esc(state.tag) + " &times;</button>";
    }
    (rows || []).forEach(function (r) {
      if (state.tag === r.tag) return;
      html += '<button type="button" class="rc-tag" data-tag="' + esc(r.tag) + '">#' + esc(r.tag) + "</button>";
    });
    tagsEl.innerHTML = html;
  }

  /* ---------- data ---------- */
  function reload() {
    state.offset = 0;
    state.posts = [];
    state.openId = null;
    listEl.innerHTML = '<p class="rc-note">Loading posts&hellip;</p>';
    loadPage(true);
  }

  function loadPage(fresh) {
    if (state.busy) return;
    state.busy = true;
    getClient().then(function (sb) {
      if (!sb) { listEl.innerHTML = '<p class="rc-note">The message board is unavailable right now.</p>'; state.busy = false; return; }
      return sb.rpc("city_connections", {
        city_name: CITY,
        p_sort: state.sort,
        p_tag: state.tag,
        p_limit: PAGE,
        p_offset: fresh ? 0 : state.offset
      }).then(function (res) {
        state.busy = false;
        if (res.error) throw res.error;
        var rows = res.data || [];
        state.posts = fresh ? rows : state.posts.concat(rows);
        state.offset = state.posts.length;
        moreBtn.hidden = rows.length < PAGE;
        render();
        moreBtn.hidden = rows.length < PAGE;
        if (fresh) loadTags(sb);
      });
    }).catch(function (e) {
      // the real reason goes to the console — usually "function
      // city_connections does not exist", i.e. the SQL hasn't been run
      console.warn("[connections] couldn't load:", (e && (e.message || e.hint)) || e);
      state.busy = false;
      listEl.innerHTML = '<p class="rc-note">Couldn\'t load the board right now — please try again later.</p>';
    });
  }

  function loadTags(sb) {
    sb.rpc("city_connection_tags", { city_name: CITY })
      .then(function (res) { if (!res.error) renderTagChips(res.data || []); })
      .catch(function () { /* chips are optional */ });
  }

  function loadReplies(postId, box) {
    if (!box || box.dataset.done === "1") return;
    getClient().then(function (sb) {
      if (!sb) return;
      return sb.rpc("city_connection_replies", { p_post_id: postId }).then(function (res) {
        if (res.error) throw res.error;
        box.dataset.done = "1";
        var rows = res.data || [];
        var html = rows.map(function (r) {
          return '<div class="rc-reply" data-reply="' + esc(r.id) + '">' + avatarHtml(r) +
            '<div class="rc-mid"><div class="rc-meta">' + nameHtml(r) + " &middot; " + esc(ago(r.created_at)) + "</div>" +
            '<div class="rc-rtext">' + esc(r.body) + "</div>" +
            '<div class="rc-foot" style="margin-left:0;margin-top:3px">' +
              (r.is_mine
                ? '<button type="button" class="rc-link" data-act="del-reply">Delete</button>'
                : '<button type="button" class="rc-link" data-act="report-reply">Report</button>') +
            "</div></div></div>";
        }).join("");
        box.innerHTML = html +
          '<textarea class="rc-rbox" data-act="reply-box" maxlength="1000" placeholder="Write a reply&hellip;"></textarea>' +
          '<button type="button" class="rc-rsend" data-act="reply-send">Post reply</button>';
      });
    }).catch(function () {
      box.innerHTML = '<p class="rc-note">Couldn\'t load replies.</p>';
    });
  }

  /* ---------- interactions ---------- */
  function onListClick(ev) {
    var tagBtn = ev.target.closest("[data-tag]");
    if (tagBtn) {
      state.tag = tagBtn.dataset.tag || null;
      reload();
      return;
    }
    var actEl = ev.target.closest("[data-act]");
    if (!actEl) return;
    var postEl = ev.target.closest(".rc-post");
    if (!postEl) return;
    var id = postEl.dataset.id;
    var act = actEl.dataset.act;

    if (act === "toggle") {
      var willOpen = state.openId !== id;
      state.openId = willOpen ? id : null;
      listEl.querySelectorAll(".rc-post.open").forEach(function (el) { if (el !== postEl) el.classList.remove("open"); });
      postEl.classList.toggle("open", willOpen);
      if (willOpen) {
        var box = postEl.querySelector("[data-replies]");
        if (box && box.dataset.done !== "1") {
          box.innerHTML = '<p class="rc-note">Loading replies&hellip;</p>';
          loadReplies(id, box);
        }
      }
      return;
    }
    if (act === "like")         { toggleLike(id, actEl); return; }
    if (act === "reply-send")   { sendReply(id, postEl, actEl); return; }
    if (act === "del-post")     { deletePost(id); return; }
    if (act === "del-reply")    { deleteReply(ev.target.closest("[data-reply]"), postEl); return; }
    if (act === "report-post")  { report({ post_id: id }); return; }
    if (act === "report-reply") {
      var rEl = ev.target.closest("[data-reply]");
      if (rEl) report({ reply_id: rEl.dataset.reply });
      return;
    }
  }

  function toggleLike(id, btn) {
    if (needSignIn()) return;
    var user = me();
    var p = state.posts.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var liking = !p.liked_by_me;
    // paint straight away, roll back if the save fails
    p.liked_by_me = liking;
    p.like_count = Math.max(0, (p.like_count || 0) + (liking ? 1 : -1));
    btn.classList.toggle("on", liking);
    btn.innerHTML = (liking ? "&#9829;" : "&#9825;") + " " + p.like_count;

    getClient().then(function (sb) {
      if (!sb) throw new Error("no client");
      return liking
        ? sb.from("roamer_post_likes").insert({ post_id: id, user_id: user.id })
        : sb.from("roamer_post_likes").delete().eq("post_id", id).eq("user_id", user.id);
    }).then(function (res) {
      if (res && res.error && res.error.code !== "23505") throw res.error;   // 23505 = already liked
    }).catch(function () {
      p.liked_by_me = !liking;
      p.like_count = Math.max(0, (p.like_count || 0) + (liking ? -1 : 1));
      btn.classList.toggle("on", !liking);
      btn.innerHTML = (!liking ? "&#9829;" : "&#9825;") + " " + p.like_count;
    });
  }

  function sendReply(id, postEl, btn) {
    if (needSignIn()) return;
    var box = postEl.querySelector("[data-act='reply-box']");
    if (!box) return;
    var text = box.value.trim();
    if (!text) { box.focus(); return; }
    btn.disabled = true;
    btn.textContent = "Posting…";
    var user = me();
    getClient().then(function (sb) {
      if (!sb) throw new Error("no client");
      return sb.from("roamer_post_replies").insert({ post_id: id, user_id: user.id, body: text.slice(0, 1000) });
    }).then(function (res) {
      if (res && res.error) throw res.error;
      var repBox = postEl.querySelector("[data-replies]");
      if (repBox) { repBox.dataset.done = ""; repBox.innerHTML = '<p class="rc-note">Loading replies&hellip;</p>'; loadReplies(id, repBox); }
      var p = state.posts.filter(function (x) { return x.id === id; })[0];
      if (p) {
        p.reply_count = (p.reply_count || 0) + 1;
        var c = postEl.querySelector(".rc-foot [data-act='toggle']");
        if (c) c.innerHTML = "&#128172; " + p.reply_count + " " + (p.reply_count === 1 ? "reply" : "replies");
      }
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = "Post reply";
      alert("Sorry — that reply didn't save. Please try again.");
    });
  }

  function deletePost(id) {
    if (!confirm("Delete this post and its replies? This can't be undone.")) return;
    getClient().then(function (sb) {
      return sb.from("roamer_posts").delete().eq("id", id);
    }).then(function (res) {
      if (res && res.error) throw res.error;
      state.posts = state.posts.filter(function (x) { return x.id !== id; });
      if (state.openId === id) state.openId = null;
      render();
    }).catch(function () { alert("Couldn't delete that post — please try again."); });
  }

  function deleteReply(replyEl, postEl) {
    if (!replyEl || !confirm("Delete this reply?")) return;
    var rid = replyEl.dataset.reply;
    getClient().then(function (sb) {
      return sb.from("roamer_post_replies").delete().eq("id", rid);
    }).then(function (res) {
      if (res && res.error) throw res.error;
      replyEl.remove();
      var id = postEl.dataset.id;
      var p = state.posts.filter(function (x) { return x.id === id; })[0];
      if (p) {
        p.reply_count = Math.max(0, (p.reply_count || 0) - 1);
        var c = postEl.querySelector(".rc-foot [data-act='toggle']");
        if (c) c.innerHTML = "&#128172; " + p.reply_count + " " + (p.reply_count === 1 ? "reply" : "replies");
      }
    }).catch(function () { alert("Couldn't delete that reply — please try again."); });
  }

  function report(target) {
    if (needSignIn()) return;
    var reason = prompt("What's wrong with this? (spam, abuse, wrong information…)");
    if (reason === null) return;
    var user = me();
    getClient().then(function (sb) {
      return sb.from("roamer_post_reports").insert({
        post_id: target.post_id || null,
        reply_id: target.reply_id || null,
        user_id: user.id,
        reason: String(reason).slice(0, 500)
      }).select("id").single().then(function (res) {
        if (res && res.error) throw res.error;
        alert("Thanks — that's been flagged for review.");
        emailAlert(sb, res.data && res.data.id);
      });
    }).catch(function () { alert("Couldn't send that report — please try again."); });
  }

  /* Nudge the site owner by email. Best-effort: the report is already
     saved, so a failure here is silent — see netlify/functions/report-alert.js */
  function emailAlert(sb, reportId) {
    if (!reportId) return;
    sb.auth.getSession().then(function (s) {
      var token = s && s.data && s.data.session && s.data.session.access_token;
      if (!token) return;
      fetch("/.netlify/functions/report-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ reportId: reportId })
      }).catch(function () {});
    }).catch(function () {});
  }

  /* ---------- add-post popup ---------- */
  var ov = null;
  function buildForm() {
    if (ov) return;
    ov = document.createElement("div");
    ov.className = "rc-ov";
    ov.innerHTML =
      '<div class="rc-modal" role="dialog" aria-modal="true" aria-label="Add a post">' +
        '<button type="button" class="rc-x" data-close aria-label="Close">&times;</button>' +
        "<h3>Add a post</h3>" +
        '<p class="rc-msub">Posted to the <b>' + esc(CITY) + "</b> board under your Roamer name. Be kind, be useful — no ads.</p>" +
        '<label for="rc-f-title">Title *</label>' +
        '<input type="text" id="rc-f-title" maxlength="140" placeholder="e.g. Anyone up for the Sunday market?">' +
        '<label for="rc-f-tags">Hashtags</label>' +
        '<input type="text" id="rc-f-tags" maxlength="160" placeholder="#meetup #food #hiking">' +
        '<div class="rc-hint">Up to 6, separated by spaces or commas. The # is optional.</div>' +
        '<label for="rc-f-body">Additional information</label>' +
        '<textarea id="rc-f-body" maxlength="2000" placeholder="Dates, where to meet, what you\'re looking for&hellip;"></textarea>' +
        '<div class="rc-actions">' +
          '<button type="button" class="rc-send" id="rc-f-send">Post it</button>' +
          '<span class="rc-formmsg" id="rc-f-msg"></span>' +
        "</div>" +
      "</div>";
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) {
      if (e.target === ov || e.target.closest("[data-close]")) closeForm();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && ov.classList.contains("open")) closeForm();
    });
    document.getElementById("rc-f-send").addEventListener("click", submitForm);
  }
  function openForm() {
    if (needSignIn()) return;
    buildForm();
    document.getElementById("rc-f-msg").textContent = "";
    ov.classList.add("open");
    setTimeout(function () { document.getElementById("rc-f-title").focus(); }, 40);
  }
  function closeForm() { if (ov) ov.classList.remove("open"); }

  function submitForm() {
    var title = document.getElementById("rc-f-title").value.trim();
    var body  = document.getElementById("rc-f-body").value.trim();
    var tags  = parseTags(document.getElementById("rc-f-tags").value);
    var msg   = document.getElementById("rc-f-msg");
    var send  = document.getElementById("rc-f-send");
    if (title.length < 2) { msg.className = "rc-formmsg err"; msg.textContent = "Please add a title."; return; }
    var user = me();
    if (!user) { closeForm(); needSignIn(); return; }
    send.disabled = true;
    msg.className = "rc-formmsg";
    msg.textContent = "Posting…";
    getClient().then(function (sb) {
      if (!sb) throw new Error("no client");
      return sb.from("roamer_posts").insert({
        city: CITY, user_id: user.id,
        title: title.slice(0, 140), body: body.slice(0, 2000), tags: tags
      });
    }).then(function (res) {
      if (res && res.error) throw res.error;
      send.disabled = false;
      msg.className = "rc-formmsg ok";
      msg.textContent = "Posted!";
      document.getElementById("rc-f-title").value = "";
      document.getElementById("rc-f-tags").value = "";
      document.getElementById("rc-f-body").value = "";
      setTimeout(closeForm, 600);
      state.sort = "new"; if (sortSel) sortSel.value = "new";
      state.tag = null;
      reload();
    }).catch(function () {
      send.disabled = false;
      msg.className = "rc-formmsg err";
      msg.textContent = "That didn't save — please try again.";
    });
  }

  /* ---------- start up (only once the card is scrolled near) ---------- */
  function start() {
    if (state.loaded) return;
    state.loaded = true;
    buildShell();
    loadPage(true);
    if (window.NRA_AUTH && window.NRA_AUTH.onChange) {
      window.NRA_AUTH.onChange(function () { reload(); });   // repaint on sign-in / out
    }
  }

  /* city.html doesn't exist yet when this file loads: the guide is drawn
     only after citydata/<slug>.json comes back. So wait for the card to
     appear instead of giving up at DOMContentLoaded. */
  function waitForCard() {
    var tries = 0;
    (function poll() {
      if (document.getElementById("rc-card")) { boot(); return; }
      if (tries++ > 300) return;            // ~30s, then stop looking
      setTimeout(poll, 100);
    })();
  }

  var booted = false;
  function boot() {
    if (booted) return;
    card = document.getElementById("rc-card");
    CITY = (card && card.dataset.city) || window.NRA_RC_CITY || null;
    if (!CITY || !card) return;
    booted = true;
    injectCss();
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { io.disconnect(); start(); }
        });
      }, { rootMargin: "300px" });
      io.observe(card);
    } else {
      start();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForCard);
  } else {
    waitForCard();
  }
})();
