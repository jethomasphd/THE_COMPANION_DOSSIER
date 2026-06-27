/* ═══════════════════════════════════════════════════════════════
   ENDOR PROTOCOL · The Book

   Orchestration for the whole piece. The first half is a book: an aged,
   illuminated account turned one leaf at a time, with dramatic page
   turns. The last leaf goes dark, the floor opens, and the second half
   is the live chamber (Claude is Alex; the reader is the summoned),
   which keeps the established dark register. The book closes again on
   the coda.

   No browser storage. All state in memory. A reload opens the book at
   the cover, and the reader is summoned again.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var body = document.body;
  function setStage(name) { body.setAttribute('data-stage', name); }

  function show(stage) { var el = document.getElementById(stage); if (el) el.classList.add('is-active'); }
  function hide(stage) { var el = document.getElementById(stage); if (el) el.classList.remove('is-active'); }

  // Anchor focus on the room the reader has just entered, so keyboard
  // and screen reader users are never stranded on document body.
  function focusEl(el) {
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) {} }
  }

  /* ── The clock ──────────────────────────────────────────────
     An engraved countdown in the margin. Eight minutes points the hand
     straight up; it sweeps as the time drains. Not real time.
     Compression is the point. */
  var clockHand = document.getElementById('clockHand');
  var clockNum = document.getElementById('clockNum');
  var clockBox = document.getElementById('clock');
  var clockTween = null;

  function handAngle(minutes) { return (8 - minutes) / 8 * 360; }
  function fmt(minutes) { return minutes + ':00'; }
  function paintHand(deg) { if (clockHand) clockHand.setAttribute('transform', 'rotate(' + deg.toFixed(2) + ' 50 50)'); }

  function setClock(minutes, animate) {
    var toDeg = handAngle(minutes);
    if (clockNum) clockNum.textContent = fmt(Math.max(0, Math.round(minutes)));
    if (clockBox) clockBox.setAttribute('aria-label', Math.max(0, Math.round(minutes)) + ' minutes remaining');
    if (clockTween) { cancelAnimationFrame(clockTween); clockTween = null; }
    if (!animate || REDUCED) { paintHand(toDeg); if (clockBox) clockBox.dataset.min = String(minutes); return; }
    var fromDeg = handAngle(parseFloat(clockBox.dataset.min || '8'));
    var start = null, dur = 700;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - t, 3);
      paintHand(fromDeg + (toDeg - fromDeg) * e);
      if (t < 1) clockTween = requestAnimationFrame(step);
    }
    clockTween = requestAnimationFrame(step);
    clockBox.dataset.min = String(minutes);
  }
  if (clockBox) clockBox.dataset.min = '8';
  setClock(8, false);

  function drainClock(done) {
    if (clockNum) clockNum.textContent = '0:00';
    if (clockBox) clockBox.setAttribute('aria-label', 'no minutes remaining');
    if (REDUCED) { paintHand(360); if (done) done(); return; }
    var fromDeg = handAngle(parseFloat(clockBox.dataset.min || '1'));
    var toDeg = 360, start = null, dur = 2600;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - t, 2);
      paintHand(fromDeg + (toDeg - fromDeg) * e);
      if (t < 1) requestAnimationFrame(step); else if (done) done();
    }
    requestAnimationFrame(step);
  }

  /* ── The book: pagination and page turns ────────────────────────
     Each chapter is fitted into one or more leaves that always fit the
     leaf box, so a leaf never scrolls. Every advance is a real, smooth
     page turn. Long chapters simply run onto a second leaf. */
  var bookEl = document.querySelector('.book');
  var pageEl = document.getElementById('page');
  var flipper = document.getElementById('flipper');
  var flipperFront = document.getElementById('flipperFront');
  var advanceBtn = document.getElementById('advanceBtn');
  var advanceLock = false;
  var turning = false;
  var cueTimer = null;

  var chapters = [];
  var pages = [];
  var currentPage = 0;
  var measure = null;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function roman(n) {
    var t = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'];
    return t[n] || ('' + n);
  }

  function readChapters() {
    chapters = Array.prototype.slice.call(document.querySelectorAll('#source .beat')).map(function (b) {
      function txt(sel) { var el = b.querySelector(sel); return el ? el.textContent : ''; }
      function html(sel) { var el = b.querySelector(sel); return el ? el.outerHTML : ''; }
      return {
        clock: parseInt(b.getAttribute('data-clock'), 10),
        num: txt('.chapter-num'),
        title: txt('.chapter-title'),
        plate: html('.plate'),
        paras: Array.prototype.slice.call(b.querySelectorAll('.prose > p')).map(function (p) { return p.outerHTML; })
      };
    });
  }

  var FOLIO_PLACEHOLDER = '<div class="folio" aria-hidden="true">x</div>';

  function runningHead(ch, first) {
    return '<div class="running-head" aria-hidden="true">The Account of Endor' +
      (first ? '' : ' &#183; ' + esc(ch.title)) + '</div>';
  }
  function bodyInner(ch, first, arr, last) {
    return (first
      ? '<header class="chapter-head"><div class="chapter-num">' + esc(ch.num) + '</div>' +
        '<h2 class="chapter-title">' + esc(ch.title) + '</h2><div class="orn">&#10070;</div></header>' + ch.plate
      : '') +
      '<div class="prose">' + arr.join('') + '</div>' +
      (last ? '<div class="sep" aria-hidden="true">&#183;  &#183;  &#183;</div>' : '');
  }
  function leafHtml(ch, first, arr, last) {
    return runningHead(ch, first) + '<div class="leaf-body">' + bodyInner(ch, first, arr, last) + '</div>';
  }

  function ensureMeasure() {
    if (measure) return;
    measure = document.createElement('div');
    measure.setAttribute('aria-hidden', 'true');
    measure.style.cssText = 'position:absolute; left:-99999px; top:0; visibility:hidden;';
    document.body.appendChild(measure);
  }

  // Greedily fill leaves so each one fits without scrolling.
  function paginate() {
    if (!chapters.length) readChapters();
    ensureMeasure();
    var cs = getComputedStyle(pageEl);
    var padL = parseFloat(cs.paddingLeft), padR = parseFloat(cs.paddingRight);
    var padT = parseFloat(cs.paddingTop), padB = parseFloat(cs.paddingBottom);
    var contentW = pageEl.clientWidth - padL - padR;
    var avail = pageEl.clientHeight - padT - padB - 8; // small safety margin
    measure.style.width = contentW + 'px';
    measure.style.fontFamily = cs.fontFamily;

    pages = [];
    chapters.forEach(function (ch, ci) {
      var idx = 0, first = true;
      if (!ch.paras.length) ch.paras = ['<p></p>'];
      while (idx < ch.paras.length) {
        var taken = [];
        while (idx < ch.paras.length) {
          // measure the whole leaf, folio included, so nothing overflows
          measure.innerHTML = leafHtml(ch, first, taken.concat([ch.paras[idx]]), false) + FOLIO_PLACEHOLDER;
          if (measure.scrollHeight <= avail || taken.length === 0) { taken.push(ch.paras[idx]); idx++; }
          else break;
        }
        var lastOfChapter = (idx >= ch.paras.length);
        pages.push({ chapter: ci, clock: ch.clock, html: leafHtml(ch, first, taken, lastOfChapter) });
        first = false;
      }
    });
    pages.forEach(function (p, i) { p.folio = roman(i + 1); });
  }

  function renderPage(i) {
    var p = pages[i];
    currentPage = i;
    pageEl.innerHTML = p.html + '<div class="folio" aria-hidden="true">' + p.folio + '</div>';
    setClock(p.clock, true);
    advanceBtn.classList.remove('show');
    advanceBtn.innerHTML = (i === pages.length - 1)
      ? 'close the account<span class="arr" aria-hidden="true">&#10070;</span>'
      : 'turn the page<span class="arr" aria-hidden="true">&#10095;</span>';
    var h = pageEl.querySelector('.chapter-title') || pageEl;
    focusEl(h);
  }

  // The cue returns only once the leaf has fully settled, so a click in
  // it always lands. It must never reappear while a turn is still in flight.
  function scheduleCue() {
    if (cueTimer) clearTimeout(cueTimer);
    cueTimer = setTimeout(function () { advanceBtn.classList.add('show'); }, REDUCED ? 200 : 800);
  }

  // The dramatic turn. The leaf you are leaving lifts and flips away,
  // and the next leaf is already beneath it. swapFn renders the next
  // leaf while it is hidden under the lifting one; doneFn runs after.
  function turnLeaf(swapFn, doneFn) {
    if (REDUCED || !flipper) {
      pageEl.style.transition = 'opacity 0.4s ease';
      pageEl.style.opacity = '0';
      setTimeout(function () {
        swapFn();
        pageEl.style.opacity = '1';
        setTimeout(function () { pageEl.style.transition = ''; if (doneFn) doneFn(); }, 420);
      }, 400);
      return;
    }
    flipperFront.innerHTML = pageEl.innerHTML;   // a still copy of the leaving leaf
    flipper.style.display = 'block';
    flipper.classList.remove('flipping');
    void flipper.offsetWidth;                    // reflow so the flat state applies
    swapFn();                                    // render the next leaf beneath the cover
    requestAnimationFrame(function () { flipper.classList.add('flipping'); });
    var finished = false;
    function end() {
      if (finished) return; finished = true;
      flipper.classList.remove('flipping');
      flipper.style.display = 'none';
      flipperFront.innerHTML = '';
      if (doneFn) doneFn();
    }
    flipper.addEventListener('transitionend', end, { once: true });
    setTimeout(end, 1400); // safety net
  }

  function advance() {
    if (advanceLock || turning) return;
    if (currentPage < pages.length - 1) {
      turning = true;
      var next = currentPage + 1;
      turnLeaf(function () { renderPage(next); }, function () { turning = false; scheduleCue(); });
    } else {
      enterDoor();
    }
  }

  function enterGreenRoom() {
    hide('overture');
    show('greenroom');
    setStage('green');
    stopOvertureNudge();
    paginate();
    renderPage(0);
    scheduleCue();
    focusEl(pageEl);
  }

  // The leaf box depends on the viewport. If it changes, re-fit the
  // chapters and keep the reader on the chapter they were reading.
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (body.getAttribute('data-stage') !== 'green' || turning || advanceLock) return;
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var ch = pages.length ? pages[currentPage].chapter : 0;
      paginate();
      var target = 0;
      for (var i = 0; i < pages.length; i++) { if (pages[i].chapter === ch) { target = i; break; } }
      renderPage(target);
      scheduleCue();
    }, 300);
  }, { passive: true });

  // Advancing the book: a single deliberate action. Click the leaf, or
  // use the keyboard. Interactive controls keep their own behavior.
  var greenroomEl = document.getElementById('greenroom');
  greenroomEl.addEventListener('click', function (e) {
    if (e.target.closest('button, a, input, textarea')) return;
    advance();
  });
  advanceBtn.addEventListener('click', function (e) { e.stopPropagation(); advance(); });
  document.addEventListener('keydown', function (e) {
    if (body.getAttribute('data-stage') !== 'green') return;
    if (e.target.closest && e.target.closest('button, a, input, textarea')) return;
    // Leaves are fitted to the screen and never scroll, so the forward
    // keys all turn the page.
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' ||
        e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      advance();
    }
  });

  /* ── The door: the last leaf turns to darkness, the floor opens ── */
  var doorEl = document.getElementById('door');
  var doorStarted = false;

  function cutDoor() {
    doorEl.style.transition = 'none';
    doorEl.classList.remove('is-holding');
    doorEl.style.display = 'none';
  }

  function enterDoor() {
    if (doorStarted) return;
    doorStarted = true;
    advanceLock = true;
    turning = true;
    drainClock();
    // The final leaf turns, and there is no next page. Only the dark.
    turnLeaf(function () {
      pageEl.innerHTML = '';
      if (bookEl) bookEl.classList.add('extinguished');
    }, function () {
      turning = false;
      holdBlackThenTurn();
    });
  }

  function holdBlackThenTurn() {
    setStage('door');
    var gr = document.getElementById('greenroom');
    if (gr) { try { gr.inert = true; } catch (e) {} gr.setAttribute('inert', ''); }
    if (REDUCED) doorEl.style.transition = 'none';
    doorEl.classList.add('is-holding');
    var fadeMs = REDUCED ? 0 : 1200;
    setTimeout(function () { hide('greenroom'); }, fadeMs + 60);
    var blackDwell = REDUCED ? 2800 : 3200;
    setTimeout(function () {
      show('threshold');
      setStage('threshold');
      cutDoor();
      enterThreshold();
    }, fadeMs + blackDwell);
  }

  /* ── The threshold ──────────────────────────────────────────── */
  function enterThreshold() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    focusEl(document.getElementById('turnLines'));
    var lines = Array.prototype.slice.call(document.querySelectorAll('#threshold .turn-line'));
    var i = 0;
    var step = REDUCED ? 480 : 1400;
    var firstDelay = REDUCED ? 260 : 800;
    setTimeout(function reveal() {
      if (i >= lines.length) { setTimeout(enterChamber, REDUCED ? 900 : 2600); return; }
      lines[i].classList.add('show');
      i++;
      setTimeout(reveal, step);
    }, firstDelay);
  }

  /* ── The chamber ────────────────────────────────────────────── */
  var chamberStarted = false;
  function enterChamber() {
    if (chamberStarted) return;
    chamberStarted = true;
    hide('threshold');
    show('chamber');
    setStage('chamber');
    focusEl(document.getElementById('chamber'));

    var canvas = document.getElementById('affectField');
    canvas.style.display = 'block';
    ENDOR.AffectField.init(canvas);
    ENDOR.AffectField.start();
    ENDOR.AffectField.setIntensity(ENDOR.Arc.INTENSITY.procedure);

    Chamber.begin();
  }

  /* ──────────────────────────────────────────────────────────────
     CHAMBER ENGINE
     The live conversation. Claude is Alex. The reader is the summoned.
     ────────────────────────────────────────────────────────────── */
  var Chamber = (function () {
    var log = document.getElementById('chamberLog');
    var reply = document.getElementById('reply');
    var note = document.getElementById('inputNote');
    var rec = document.getElementById('recIndicator');
    var recText = rec ? rec.querySelector('.rec-text') : null;

    var phase = 'procedure';
    var truthSettled = false;
    var recordingOn = true;
    var busy = false;
    var ended = false;
    var alexHasSpoken = false;
    var openingAttempts = 0;
    var connectionFailures = 0;

    var guards = (window.COMPANION_CONFIG && window.COMPANION_CONFIG.safeguards) || {};
    var MAX_READER_TURNS = guards.maxReaderTurns || 20;

    function scrollDown() {
      log.scrollTo ? log.scrollTo({ top: log.scrollHeight, behavior: REDUCED ? 'auto' : 'smooth' })
                   : (log.scrollTop = log.scrollHeight);
    }

    function renderAlex(text) {
      var wrap = document.createElement('div');
      wrap.className = 'line line-alex';
      var frags = [];
      String(text).split(/\n{2,}/).forEach(function (p) {
        p = p.replace(/\s+$/, '');
        if (!p) return;
        var frag = document.createElement('p');
        frag.className = 'frag';
        p.split('\n').forEach(function (b, idx) {
          if (idx > 0) frag.appendChild(document.createElement('br'));
          frag.appendChild(document.createTextNode(b));
        });
        wrap.appendChild(frag);
        frags.push(frag);
      });
      log.appendChild(wrap);
      // Her voice arrives a breath at a time. The first lands at once;
      // the rest follow, so a reply reads as speech, not a posted block.
      frags.forEach(function (f, i) {
        if (REDUCED || i === 0) { f.classList.add('in'); }
        else { setTimeout(function () { f.classList.add('in'); scrollDown(); }, i * 750); }
      });
      scrollDown();
      return wrap;
    }

    function renderSelf(text) {
      var el = document.createElement('div');
      el.className = 'line line-self';
      el.textContent = text;
      log.appendChild(el);
      scrollDown();
    }

    function renderMark(text) {
      var el = document.createElement('div');
      el.className = 'line line-mark';
      el.textContent = text;
      log.appendChild(el);
      scrollDown();
    }

    var thinkingEl = null;
    function showThinking() {
      thinkingEl = document.createElement('div');
      thinkingEl.className = 'line thinking';
      thinkingEl.setAttribute('aria-hidden', 'true');
      var dot = document.createElement('span');
      dot.className = 'dot';
      thinkingEl.appendChild(dot);
      log.appendChild(thinkingEl);
      scrollDown();
    }
    function hideThinking() {
      if (thinkingEl && thinkingEl.parentNode) thinkingEl.parentNode.removeChild(thinkingEl);
      thinkingEl = null;
    }

    function stopRecording() {
      if (!recordingOn) return;
      recordingOn = false;
      rec.classList.add('off');
      if (recText) recText.textContent = 'recording stopped';
      renderMark('·  recording stopped  ·');
    }

    function setInputEnabled(on) {
      reply.disabled = !on;
      if (on) { reply.focus(); }
    }

    function applyArc(text) {
      var cues = ENDOR.Arc.classify(text);
      var prev = phase;
      phase = ENDOR.Arc.nextPhase(prev, text);

      if (cues.offRecord && recordingOn && ENDOR.Arc.rank(phase) >= ENDOR.Arc.rank('truth')) stopRecording();

      var turns = ENDOR.API.readerTurnCount();

      if (phase === 'truth' && prev !== 'truth') {
        ENDOR.AffectField.setIntensity(ENDOR.Arc.INTENSITY.truth);
        setTimeout(function () {
          if (ended) return;
          truthSettled = true;
          if (phase === 'truth') ENDOR.AffectField.setIntensity(ENDOR.Arc.intensityFor('truth', turns, true));
        }, REDUCED ? 1200 : 5200);
      } else if (phase !== 'release') {
        ENDOR.AffectField.setIntensity(ENDOR.Arc.intensityFor(phase, turns, truthSettled));
      }

      return cues;
    }

    function truncateAtRelease(text) {
      var m = /return to baseline[.!]?/i.exec(text);
      if (!m) return text;
      return text.slice(0, m.index + m[0].length);
    }

    function toRelease(finalText) {
      ended = true;
      busy = true;
      setInputEnabled(false);
      reply.placeholder = '';
      note.textContent = '';
      phase = 'release';
      ENDOR.AffectField.collapse();
      var wait = REDUCED ? 2200 : 5200;
      setTimeout(enterCoda, wait);
    }

    function onAlexDone(fullText) {
      hideThinking();
      alexHasSpoken = true;
      note.textContent = '';
      var text = (fullText || '').trim();
      var cues = ENDOR.Arc.classify(text);

      if (cues.release) {
        applyArc(text);
        var shown = truncateAtRelease(text);
        renderAlex(shown);
        toRelease(shown);
        return;
      }

      applyArc(text);
      renderAlex(text);
      busy = false;

      if (ENDOR.API.readerTurnCount() >= MAX_READER_TURNS) { forceRelease(); return; }
      setInputEnabled(true);
    }

    function onError(kind) {
      hideThinking();
      busy = false;
      var connKind = (kind === 'no-proxy' || kind === 'network' || /^http-/.test(kind));

      if (connKind && !alexHasSpoken) {
        openingAttempts++;
        if (openingAttempts < 3) {
          note.textContent = '';
          setTimeout(function () { send(ENDOR.Chamber.SEED_CUE, true); }, 1200 * openingAttempts);
        } else {
          forceRelease();
        }
        return;
      }

      if (connKind) {
        connectionFailures++;
        if (connectionFailures >= 3) { note.textContent = ''; forceRelease(); return; }
        note.textContent = 'the signal will not hold. say it again.';
      } else if (kind === 'cooldown') {
        note.textContent = 'a breath. then again.';
      }
      setInputEnabled(true);
    }

    function forceRelease() {
      var lines = 'Please forgive me.\n\n' + ENDOR.Chamber.RELEASE_LINE;
      renderAlex(lines);
      toRelease(lines);
    }

    function send(userText, isSeed) {
      if (busy || ended) return;
      busy = true;
      if (!isSeed) { renderSelf(userText); }
      note.textContent = isSeed ? '' : 'she is listening.';
      setInputEnabled(false);
      showThinking();

      ENDOR.API.send(
        userText,
        ENDOR.Chamber.SYSTEM_PROMPT,
        { onChunk: function () {}, onDone: onAlexDone, onError: onError },
        { seed: isSeed === true }
      );
    }

    function begin() {
      if (!ENDOR.API.isReady()) {
        renderMark('·  the chamber is unreachable  ·');
        setTimeout(forceRelease, REDUCED ? 600 : 1800);
        return;
      }
      reply.addEventListener('keydown', onReplyKey);
      reply.addEventListener('input', autoGrow);
      send(ENDOR.Chamber.SEED_CUE, true);
    }

    function autoGrow() {
      reply.style.height = 'auto';
      reply.style.height = Math.min(reply.scrollHeight, window.innerHeight * 0.3) + 'px';
    }

    function onReplyKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        var text = reply.value.trim();
        if (!text || busy || ended) return;
        reply.value = '';
        autoGrow();
        send(text, false);
      }
    }

    return { begin: begin };
  })();

  /* ── The coda: the book closes ──────────────────────────────── */
  function enterCoda() {
    ENDOR.AffectField.stop();
    var canvas = document.getElementById('affectField');
    if (canvas) canvas.style.display = 'none';
    hide('chamber');
    show('coda');
    setStage('coda');
    window.scrollTo({ top: 0, behavior: 'auto' });
    focusEl(document.getElementById('codaRemains'));

    var blocks = ['codaRemains', 'codaSep', 'codaNote', 'codaDedication', 'codaReturnWrap'];
    var i = 0;
    var gap = REDUCED ? 500 : 3000;
    (function reveal() {
      if (i >= blocks.length) return;
      var el = document.getElementById(blocks[i]);
      if (el) el.classList.add('show');
      i++;
      setTimeout(reveal, gap);
    })();
  }

  /* ── Opening the book ───────────────────────────────────────── */
  document.getElementById('enterBtn').addEventListener('click', enterGreenRoom);

  var overtureNudge = null;
  function stopOvertureNudge() { if (overtureNudge) { clearInterval(overtureNudge); overtureNudge = null; } }

  /* ──────────────────────────────────────────────────────────────
     The optional fluorescent buzz. Off by default. Never autoplay.
     Synthesized so the piece needs no audio asset, and silent if the
     browser has no audio. The piece is devastating in silence.
     ────────────────────────────────────────────────────────────── */
  (function () {
    var toggle = document.getElementById('soundToggle');
    if (!toggle) return;
    var ctx = null, on = false, nodes = [];

    function build() {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        var master = ctx.createGain();
        master.gain.value = 0.0;
        master.connect(ctx.destination);
        [60, 120, 180].forEach(function (f, i) {
          var osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = f;
          var g = ctx.createGain();
          g.gain.value = [0.012, 0.006, 0.003][i];
          osc.connect(g); g.connect(master);
          osc.start();
          nodes.push(osc);
        });
        var tick = ctx.createOscillator();
        tick.type = 'triangle';
        tick.frequency.value = 7800;
        var tg = ctx.createGain();
        tg.gain.value = 0.0016;
        tick.connect(tg); tg.connect(master);
        tick.start();
        nodes.push(tick);
        nodes._master = master;
        return true;
      } catch (e) { return false; }
    }

    function fade(to, secs) {
      if (!ctx || !nodes._master) return;
      try {
        var now = ctx.currentTime;
        nodes._master.gain.cancelScheduledValues(now);
        nodes._master.gain.setValueAtTime(nodes._master.gain.value, now);
        nodes._master.gain.linearRampToValueAtTime(to, now + secs);
      } catch (e) {}
    }

    function turnOn() {
      if (!ctx && !build()) { toggle.textContent = 'sound: n/a'; return; }
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
      on = true;
      fade(1.0, 2.2);
      body.classList.add('buzzing');
      toggle.textContent = 'sound: on';
      toggle.setAttribute('aria-pressed', 'true');
    }
    function turnOff() {
      on = false;
      fade(0.0, 1.2);
      body.classList.remove('buzzing');
      toggle.textContent = 'sound: off';
      toggle.setAttribute('aria-pressed', 'false');
    }

    toggle.addEventListener('click', function () { on ? turnOff() : turnOn(); });

    var stageObserver = new MutationObserver(function () {
      var s = body.getAttribute('data-stage');
      if (on && s !== 'overture' && s !== 'green') { turnOff(); }
    });
    stageObserver.observe(body, { attributes: true, attributeFilter: ['data-stage'] });
  })();

})();
