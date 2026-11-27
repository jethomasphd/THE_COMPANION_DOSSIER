/* ═══════════════════════════════════════════════════════════════════
   USING THIS MATTER · THE DEPOSIT · behaviour
   - Amazon switch (config.js) — unchanged contract from the previous page
   - 3D volume, terminal, door count, recovered posts, transmissions
   - No network calls, cookies, or storage. Local CustomEvents only.
   ═══════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  /* ── engagement events (local only) ─────────────────────────────── */
  const query = new URLSearchParams(location.search);
  const campaign = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(k => { if (query.has(k)) campaign[k] = query.get(k).slice(0, 160); });
  const emit = (name, extra = {}) => window.dispatchEvent(new CustomEvent("book:engagement", {detail: {name, ...campaign, ...extra}}));
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-event]");
    if (a) emit(a.dataset.event, {placement: a.dataset.placement});
  });

  /* ── Amazon switch ──────────────────────────────────────────────── */
  const config = window.BOOK_CONFIG || {};
  let amazon = null;
  try {
    const u = new URL(config.amazonUrl);
    const ok = /(^|\.)amazon\.(com|co\.uk|ca|com\.au|de|fr|es|it|nl|co\.jp|in|com\.br|com\.mx|se|pl|com\.be|ie|sg|ae|sa|com\.tr)$/i;
    if (u.protocol === "https:" && (ok.test(u.hostname) || u.hostname === "amzn.to")) amazon = u.href;
  } catch (_) { /* blank = honest prepublication state */ }
  if (amazon) {
    $$("[data-amazon]").forEach(el => {
      el.href = amazon; el.hidden = false; el.target = "_blank"; el.rel = "noopener";
      el.dataset.event = "amazon_click";
    });
    $$("[data-print-cta]").forEach(el => {
      el.href = amazon; el.target = "_blank"; el.rel = "noopener";
      el.dataset.event = "amazon_click";
      const label = el.querySelector("[data-label]");
      if (label) label.textContent = "Hold it in print";
    });
    $$("[data-print-status]").forEach(el => el.hidden = true);
    $$("[data-availability]").forEach(el => el.innerHTML = "<b>●</b> Color hardcover available · Digital deposit free");
  }

  /* ── reveal on scroll ───────────────────────────────────────────── */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, {rootMargin: "0px 0px -8% 0px", threshold: .08}) : null;
  const watchReveal = el => io ? io.observe(el) : el.classList.add("in");
  $$(".reveal").forEach(watchReveal);
  const whenSeen = (el, fn, margin = "0px 0px -15% 0px") => {
    if (!el) return;
    if (!("IntersectionObserver" in window)) return fn();
    const o = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { o.disconnect(); fn(); } }, {rootMargin: margin});
    o.observe(el);
  };

  /* ── ticker: duplicate track for a seamless loop ────────────────── */
  const track = $(".ticker__track");
  if (track) track.innerHTML += track.innerHTML;

  /* ── 3D volume ──────────────────────────────────────────────────── */
  const book = $(".book3d");
  if (book) {
    const vol = $(".vol", book);
    let ry = -24, rx = 4, drag = null, touched = false, t0 = performance.now();
    const apply = () => { vol.style.setProperty("--ry", ry + "deg"); vol.style.setProperty("--rx", rx + "deg"); };
    const idle = now => {
      if (touched || reduce) return;
      const t = (now - t0) / 1000;
      ry = -24 + Math.sin(t * .5) * 9; rx = 4 + Math.sin(t * .37) * 2;
      vol.style.transition = "none"; apply();
      requestAnimationFrame(idle);
    };
    requestAnimationFrame(idle);
    book.addEventListener("dragstart", e => e.preventDefault());
    book.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      touched = true; drag = {x: e.clientX, y: e.clientY, ry, rx};
      book.classList.add("dragging"); book.setPointerCapture(e.pointerId);
    });
    book.addEventListener("pointermove", e => {
      if (!drag) return;
      ry = drag.ry + (e.clientX - drag.x) * .55;
      rx = Math.max(-25, Math.min(25, drag.rx - (e.clientY - drag.y) * .18));
      apply();
    });
    const end = () => {
      if (!drag) return;
      drag = null; book.classList.remove("dragging"); vol.style.transition = "";
      emit("volume_turn");
    };
    book.addEventListener("pointerup", end);
    book.addEventListener("pointercancel", end);
    book.addEventListener("keydown", e => {
      const step = {ArrowLeft: -20, ArrowRight: 20}[e.key];
      if (step) { touched = true; vol.style.transition = ""; ry += step; apply(); e.preventDefault(); }
      if (e.key === "Enter" || e.key === " ") { touched = true; vol.style.transition = ""; ry += 180; apply(); e.preventDefault(); }
    });
    const flip = $("[data-flip]");
    if (flip) flip.addEventListener("click", () => { touched = true; vol.style.transition = ""; ry += 180; apply(); });
  }

  /* ── glitch the impossible numbers now and then ─────────────────── */
  if (!reduce) {
    const gl = $$(".glitch");
    if (gl.length) setInterval(() => {
      const g = gl[Math.floor(Math.random() * gl.length)];
      g.classList.add("on"); setTimeout(() => g.classList.remove("on"), 720);
    }, 3800);
  }

  /* ── terminal ───────────────────────────────────────────────────── */
  const term = $("[data-terminal]");
  if (term) {
    const src = $("#terminal-script");
    const lines = src ? JSON.parse(src.textContent) : [];
    const out = $(".term__body", term);
    const run = async () => {
      out.innerHTML = "";
      for (const L of lines) {
        const div = document.createElement("div");
        div.className = "ln " + (L.c || "");
        out.appendChild(div);
        if (reduce || L.instant) { div.textContent = L.t; continue; }
        const cur = document.createElement("span"); cur.className = "cursor";
        for (let i = 0; i <= L.t.length; i++) {
          div.textContent = L.t.slice(0, i); div.appendChild(cur);
          await new Promise(r => setTimeout(r, L.fast ? 6 : 16 + Math.random() * 18));
        }
        cur.remove();
        await new Promise(r => setTimeout(r, L.wait || 140));
      }
      const end = document.createElement("div"); end.className = "ln";
      end.innerHTML = '&gt; <span class="cursor"></span>'; out.appendChild(end);
    };
    whenSeen(term, run);
  }

  /* ── recovered posts ────────────────────────────────────────────── */
  const ICON = {
    r: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    rp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 7h11l-3-3M17 17H6l3 3M18 7v5M6 17v-5"/></svg>',
    l: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    v: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 19V11M12 19V5M19 19v-6"/></svg>'
  };
  const wave = n => { let s = '<div class="wave" aria-hidden="true">'; for (let i = 0; i < n; i++) { const h = 15 + Math.abs(Math.sin(i * 1.7) * 60 + Math.cos(i * .6) * 25); s += `<i style="height:${Math.min(100, h).toFixed(0)}%;animation-delay:${(i % 9) * .07}s"></i>`; } return s + "</div>"; };
  const avatar = p => p.av ? `<span class="av${p.av.blank ? " av--blank" : ""}" style="--av:${esc(p.av.c || "#3a3530")}" aria-hidden="true">${esc(p.av.t || "")}</span>` : "";
  const stats = s => s ? `<div class="post__stats">${["r", "rp", "l", "v"].filter(k => s[k] != null).map(k => `<span>${ICON[k]}${esc(s[k])}</span>`).join("")}</div>` : "";

  function renderPost(p) {
    const kind = p.kind || "micro";
    const cls = ["post", "post--" + kind, p.paper ? "post--paper" : "", p.gone ? "post--gone" : ""].join(" ");
    let inner = "";
    if (kind === "forum") {
      inner = `<div class="vote" aria-label="${esc(p.votes)} points"><b>▲</b>${esc(p.votes)}</div><div>
        <div class="post__sub">${p.sub} · posted by ${p.handle} · ${esc(p.ago)}</div>
        <div class="post__title">${p.title}</div>
        <div class="post__body">${p.body}</div>
        <div class="post__stats"><span>${ICON.r}${esc(p.comments)} comments</span><span>share</span><span>save</span></div>
        ${p.state ? `<div class="post__state${p.stateOk ? " post__state--ok" : ""}">${p.state}</div>` : ""}</div>`;
    } else if (kind === "chat") {
      inner = `<div class="post__hd"><div class="post__who"><div class="post__name">${esc(p.name)}</div><div class="post__handle">${esc(p.handle)}</div></div>${p.src ? `<span class="post__src">${esc(p.src)}</span>` : ""}</div>
        ${(p.msgs || []).map(m => `<div class="bub bub--${m.d}">${m.t}${m.s ? `<small>${esc(m.s)}</small>` : ""}</div>`).join("")}
        ${p.state ? `<div class="post__state${p.stateOk ? " post__state--ok" : ""}">${p.state}</div>` : ""}`;
    } else {
      const head = `<div class="post__hd">${avatar(p)}<div class="post__who"><div class="post__name">${esc(p.name)}${p.verified ? '<span class="vb" aria-label="verified">✓</span>' : ""}</div><div class="post__handle">${p.handle}</div></div>${p.src ? `<span class="post__src">${esc(p.src)}</span>` : ""}</div>`;
      const rating = p.stars != null ? `<div class="stars" aria-label="${p.stars} of 5 stars">${"★".repeat(p.stars)}<s>${"★".repeat(5 - p.stars)}</s></div>` : "";
      const vm = kind === "vm" ? `${wave(48)}<button class="vm-play" type="button" data-vm>▶ Play transcript · ${esc(p.dur || "0:31")}</button>` : "";
      let media = "";
      if (p.media && p.media.type === "img") media = `<div class="post__media"><img src="${esc(p.media.src)}" alt="${esc(p.media.alt || "")}" loading="lazy">${p.media.cap ? `<span class="mcap">${esc(p.media.cap)}</span>` : ""}</div>`;
      if (p.media && p.media.type === "void") media = `<div class="post__media post__media--void"><span>${p.media.text}</span></div>`;
      inner = `${head}${p.replyTo ? `<div class="post__reply">Replying to ${esc(p.replyTo)}</div>` : ""}${rating}${vm}
        <div class="post__body"${kind === "vm" ? " data-vm-text" : ""}>${p.body}</div>${media}
        ${p.time ? `<div class="post__time">${esc(p.time)}</div>` : ""}${stats(p.stats)}
        ${p.state ? `<div class="post__state${p.stateOk ? " post__state--ok" : ""}">${p.state}</div>` : ""}`;
    }
    const stamp = p.stamp ? `<span class="stamp${p.stampGold ? " stamp--gold" : ""}">${esc(p.stamp)}</span>` : "";
    return `<article class="find reveal" data-cat="${esc((p.cat || []).join(" "))}" id="find-${esc(p.id)}">
      <p class="find__cap"><span>${esc(p.capture || "")}</span><span>${esc(p.capTime || "")}</span></p>
      <div class="${cls}">${stamp}${inner}</div>
      ${p.note ? `<span class="margin-note">${p.note}</span>` : ""}</article>`;
  }
  window.renderRecoveredPost = renderPost;

  const wall = $("[data-wall]");
  const posts = window.RECOVERED_POSTS || [];
  if (wall && posts.length) {
    const FIRST = Number(wall.dataset.first || 9);
    let showing = FIRST, filter = "all";
    wall.innerHTML = posts.map(renderPost).join("");
    const finds = $$(".find", wall);
    const more = $("[data-more]");
    const paint = () => {
      let shown = 0, total = 0;
      finds.forEach(f => {
        const match = filter === "all" || f.dataset.cat.split(" ").includes(filter);
        if (match) total++;
        const vis = match && (filter !== "all" || shown < showing);
        if (vis) shown++;
        f.classList.toggle("hide", !vis);
        if (vis) watchReveal(f);
      });
      if (more) more.hidden = filter !== "all" || showing >= total;
    };
    $$("[data-filter]").forEach(b => {
      const n = b.dataset.filter === "all" ? posts.length : posts.filter(p => (p.cat || []).includes(b.dataset.filter)).length;
      const c = b.querySelector("b"); if (c) c.textContent = n;
      b.addEventListener("click", () => {
        filter = b.dataset.filter;
        $$("[data-filter]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        paint(); emit("evidence_filter", {filter});
      });
    });
    if (more) more.addEventListener("click", () => { showing += 9; paint(); emit("evidence_more"); });
    paint();

    // voicemail "playback": the transcript surfaces word by word
    wall.addEventListener("click", e => {
      const btn = e.target.closest("[data-vm]"); if (!btn) return;
      const post = btn.closest(".post"), text = $("[data-vm-text]", post), w = $(".wave", post);
      if (btn.dataset.busy) return;
      btn.dataset.busy = "1";
      const full = text.dataset.full || text.innerHTML; text.dataset.full = full;
      const words = full.split(/(\s+)/);
      w.classList.add("on"); text.innerHTML = "";
      let i = 0;
      const step = () => {
        if (i >= words.length || reduce) { text.innerHTML = full; w.classList.remove("on"); delete btn.dataset.busy; return; }
        i += 2; text.innerHTML = words.slice(0, i).join(""); setTimeout(step, 90);
      };
      step();
    });
  }

  // long thread expander
  const tf = $(".thread__fade"), tm = $("[data-thread-more]");
  if (tf && tm) tm.addEventListener("click", () => {
    const open = tf.classList.toggle("open");
    tm.textContent = open ? "Collapse the thread" : "Read the rest of the thread";
    tm.setAttribute("aria-expanded", String(open));
    if (open) emit("thread_open");
  });

  /* ── tooltip ────────────────────────────────────────────────────── */
  const tip = document.createElement("div"); tip.className = "tip"; tip.setAttribute("role", "tooltip"); document.body.appendChild(tip);
  const showTip = (html, x, y) => { tip.innerHTML = html; tip.classList.add("on"); const w = tip.offsetWidth; tip.style.left = Math.min(window.innerWidth - w - 10, x + 14) + "px"; tip.style.top = (y + 16) + "px"; };
  const hideTip = () => tip.classList.remove("on");

  /* ── the count ──────────────────────────────────────────────────── */
  const plan = $("[data-plan]");
  if (plan) {
    const DOORS = {1:"Hall / living",2:"Kitchen / utility",3:"Utility / garage",4:"Hall / bedroom 1",5:"Hall / bedroom 2",6:"Hall / bedroom 3",7:"Hall / bath",8:"Hall / linen rack",9:"Hall / study",10:"Hall / bifold closet",11:"Bedroom 3 / en suite",12:"Garage / workroom"};
    const tallyN = $("[data-tally]"), msg = $("[data-tally-msg]"), log = $("[data-tally-log]");
    const recountBtn = $("[data-recount]"), resetBtn = $("[data-reset]");
    const colFirst = $("[data-col-first]"), colRe = $("[data-col-recount]");
    const twelve = $$(".door--twelve, .twelve-line, .twelve-label", plan);
    const counted = new Set();
    let phase = "walk", busy = false;
    const pad = n => String(n).padStart(2, "0");
    const say = h => { msg.innerHTML = h; };
    const addLog = (t, hot) => { const li = document.createElement("li"); li.textContent = t; if (hot) li.className = "hot"; log.prepend(li); };
    const setTally = h => { tallyN.innerHTML = h; };
    const mark = (n, on = true) => { const d = $(`.door[data-door="${n}"]`, plan); if (d) { d.classList.toggle("counted", on); d.setAttribute("aria-pressed", String(on)); } };

    function count(n) {
      if (busy || phase === "done" || phase === "recount") return;
      if (counted.has(n)) return;
      counted.add(n); mark(n);
      addLog(`Door ${pad(n)} · ${DOORS[n]}${n === 12 ? " — not on the county plan" : ""}`, n === 12);
      setTally(pad(counted.size));
      if (n === 12) {
        phase = "twelve";
        say("Twelve. <em>Write it down.</em> She did. The entry is still there.");
        colFirst.textContent = "12"; colFirst.classList.add("ember");
        recountBtn.hidden = false; emit("count_twelve");
        return;
      }
      if (counted.size === 11 && phase === "walk") {
        busy = true;
        say("Eleven. The county plan says eleven. You are finished.");
        setTimeout(() => {
          plan.classList.add("flash");
          twelve.forEach(el => el.classList.add("show"));
          say("Eleven. The county plan says eleven.<br><em>Look at the garage again.</em>");
          busy = false;
          setTimeout(() => plan.classList.remove("flash"), 700);
        }, reduce ? 0 : 1500);
      } else if (phase === "walk") {
        say(counted.size < 4 ? "Keep walking. Interior doors only." : counted.size < 9 ? "Jamb by jamb. Nothing is assumed." : "Almost there.");
      }
    }
    $$(".door", plan).forEach(d => {
      const n = Number(d.dataset.door);
      d.addEventListener("click", () => count(n));
      d.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); count(n); } });
      d.addEventListener("pointerenter", e => e.pointerType === "mouse" && showTip(`<b>Door ${pad(n)}</b><br>${DOORS[n]}${n === 10 ? "<br>one doorway, two folding leaves" : ""}${n === 12 ? "<br>later annotation" : ""}`, e.clientX, e.clientY));
      d.addEventListener("pointermove", e => e.pointerType === "mouse" && showTip(tip.innerHTML, e.clientX, e.clientY));
      d.addEventListener("pointerleave", hideTip);
    });
    $$(".room-hit", plan).forEach(r => {
      r.addEventListener("pointerenter", e => e.pointerType === "mouse" && showTip(`<b>${esc(r.dataset.room)}</b><br>${esc(r.dataset.name)}`, e.clientX, e.clientY));
      r.addEventListener("pointermove", e => e.pointerType === "mouse" && showTip(tip.innerHTML, e.clientX, e.clientY));
      r.addEventListener("pointerleave", hideTip);
    });

    recountBtn.addEventListener("click", async () => {
      if (phase !== "twelve") return;
      phase = "recount"; busy = true; recountBtn.hidden = true;
      counted.clear(); $$(".door", plan).forEach(d => mark(d.dataset.door, false));
      addLog("— recount, jamb by jamb —");
      say("Recounting. Jamb by jamb.");
      for (let n = 1; n <= 11; n++) {
        mark(n); setTally(pad(n));
        addLog(`Door ${pad(n)} · ${DOORS[n]}${n === 10 ? " — one doorway, two folding leaves" : ""}`);
        await new Promise(r => setTimeout(r, reduce ? 0 : 260));
      }
      setTally('<s>12</s> 11');
      colRe.textContent = "11";
      say("Eleven. <em>The correction does not erase the first entry.</em><br>The bifold explanation is not an independent verification.");
      addLog("Recount: 11. First count retained.", true);
      phase = "done"; busy = false; emit("count_recount");
    });
    resetBtn.addEventListener("click", () => {
      if (busy) return;
      counted.clear(); phase = "walk";
      $$(".door", plan).forEach(d => mark(d.dataset.door, false));
      twelve.forEach(el => el.classList.remove("show"));
      setTally("00"); log.innerHTML = ""; recountBtn.hidden = true;
      colFirst.textContent = "—"; colFirst.classList.remove("ember"); colRe.textContent = "—";
      say("Tap each interior door on the plan. Exterior doors do not count.");
    });
  }

  /* ── transmissions: typed playback ──────────────────────────────── */
  $$("[data-tx]").forEach(card => {
    const btn = $(".tx__play", card), out = $(".tx__text", card), w = $(".wave", card), clock = $(".tx__clock", card);
    const script = JSON.parse($("script", card).textContent);
    const total = Number(card.dataset.secs || 30);
    let playing = false, timer = null;
    const fmt = s => `00:${String(Math.floor(s)).padStart(2, "0")} / 00:${String(total).padStart(2, "0")}`;
    clock.textContent = fmt(0);
    const fill = () => { out.innerHTML = script.map(l => l.s ? `<span class="spk">${esc(l.s)}:</span> ${esc(l.t)}` : `<span class="dir">${esc(l.t)}</span>`).join("\n"); };
    const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>';
    const STOP = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
    btn.innerHTML = PLAY;
    btn.addEventListener("click", async () => {
      if (playing) { playing = false; clearInterval(timer); w.classList.remove("on"); btn.innerHTML = PLAY; fill(); return; }
      if (reduce) { fill(); return; }
      playing = true; btn.innerHTML = STOP; w.classList.add("on"); out.innerHTML = "";
      emit("transmission_play", {id: card.id});
      const start = performance.now();
      timer = setInterval(() => clock.textContent = fmt(Math.min(total, (performance.now() - start) / 1000)), 250);
      for (const l of script) {
        if (!playing) return;
        const row = document.createElement("div");
        if (l.s) row.innerHTML = `<span class="spk">${esc(l.s)}:</span> `; else row.className = "dir";
        out.appendChild(row);
        const node = document.createTextNode(""); row.appendChild(node);
        for (let i = 0; i <= l.t.length; i++) {
          if (!playing) return;
          node.textContent = l.t.slice(0, i);
          await new Promise(r => setTimeout(r, l.s ? 26 : 14));
        }
        await new Promise(r => setTimeout(r, l.pause || 520));
      }
      playing = false; clearInterval(timer); clock.textContent = fmt(total); w.classList.remove("on"); btn.innerHTML = PLAY;
    });
  });

  /* ── plate VII ──────────────────────────────────────────────────── */
  const w7 = $("[data-withheld]");
  if (w7) w7.addEventListener("click", () => { w7.classList.toggle("open"); w7.setAttribute("aria-expanded", String(w7.classList.contains("open"))); });

  /* ── video viewfinder state + first-play event ──────────────────── */
  $$(".vf video").forEach(v => {
    v.addEventListener("play", () => v.closest(".vf").classList.add("playing"));
    v.addEventListener("pause", () => v.closest(".vf").classList.remove("playing"));
  });
  const trailer = $("#book-trailer");
  if (trailer) trailer.addEventListener("play", () => emit("trailer_play"), {once: true});

  /* ── for the ones who open the console ──────────────────────────── */
  try {
    console.log("%c◊ ◈ ◊  THE COMPANION ESTATE", "color:#e8953f;font:600 13px monospace;letter-spacing:3px");
    console.log("%cDeposit mounted. Eleven doors on the county plan.\nThe Editor has not counted them.\n\nIf you are reading this, you are already counting.\n— try /book/twelve/", "color:#bfb7a9;font:12px monospace;line-height:1.6");
  } catch (_) {}
})();
