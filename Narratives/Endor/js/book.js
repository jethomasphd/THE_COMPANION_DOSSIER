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
  var backBtn = document.getElementById('backBtn');
  var advanceLock = false;
  var turning = false;
  var cueTimer = null;

  // The name gate. The reader must say her name with their own hand before
  // the book will turn past it. saidName is read by the chamber, so Alex can
  // open already knowing the summoned broke silence at the threshold.
  var gateDone = false, gateOpen = false;
  var saidName = false;
  var nameGate = document.getElementById('nameGate');
  var gateInput = document.getElementById('gateInput');
  var gateGo = document.getElementById('gateGo');
  var gateCue = document.getElementById('gateCue');

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
      ? '<header class="chapter-head">' +
        (ch.num ? '<div class="chapter-num">' + esc(ch.num) + '</div>' : '') +
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

  function pageHtml(i) {
    var p = pages[i];
    return p.html + '<div class="folio" aria-hidden="true">' + p.folio + '</div>';
  }

  function renderPage(i) {
    var p = pages[i];
    currentPage = i;
    pageEl.innerHTML = pageHtml(i);
    // The prologue carries no clock. The account does.
    if (isNaN(p.clock)) { if (clockBox) clockBox.style.opacity = '0'; }
    else { if (clockBox) clockBox.style.opacity = ''; setClock(p.clock, true); }
    advanceBtn.classList.remove('show');
    advanceBtn.innerHTML = (i === pages.length - 1)
      ? 'close the account<span class="arr" aria-hidden="true">&#10070;</span>'
      : 'turn the page<span class="arr" aria-hidden="true">&#10095;</span>';
    if (backBtn) backBtn.style.visibility = (i > 0) ? 'visible' : 'hidden';
    var h = pageEl.querySelector('.chapter-title') || pageEl;
    focusEl(h);
  }

  // The cue returns only once the leaf has fully settled, so a click in
  // it always lands. It must never reappear while a turn is still in flight.
  function scheduleCue() {
    if (cueTimer) clearTimeout(cueTimer);
    cueTimer = setTimeout(function () { advanceBtn.classList.add('show'); }, REDUCED ? 200 : 800);
  }

  // The dramatic turn, in either direction. The leaf flips on the spine
  // and the destination leaf is rendered beneath it, hidden, mid turn.
  function flip(opts) {
    if (REDUCED || !flipper) {
      pageEl.style.transition = 'opacity 0.4s ease';
      pageEl.style.opacity = '0';
      setTimeout(function () {
        if (opts.beforeSwap) opts.beforeSwap();
        if (opts.afterSwap) opts.afterSwap();
        pageEl.style.opacity = '1';
        setTimeout(function () { pageEl.style.transition = ''; if (opts.done) opts.done(); }, 420);
      }, 400);
      return;
    }
    flipperFront.innerHTML = opts.frontHtml;
    flipper.style.transition = 'none';
    flipper.style.transform = 'rotateY(' + opts.fromDeg + 'deg)';
    flipper.style.display = 'block';
    void flipper.offsetWidth;                    // reflow so the start state applies
    if (opts.beforeSwap) opts.beforeSwap();      // render the destination beneath the cover
    requestAnimationFrame(function () {
      flipper.style.transition = 'transform 1s cubic-bezier(0.42,0.02,0.18,1)';
      flipper.style.transform = 'rotateY(' + opts.toDeg + 'deg)';
    });
    var finished = false;
    function end() {
      if (finished) return; finished = true;
      flipper.style.transition = 'none';
      flipper.style.transform = 'rotateY(0deg)';
      flipper.style.display = 'none';
      flipperFront.innerHTML = '';
      if (opts.afterSwap) opts.afterSwap();
      if (opts.done) opts.done();
    }
    flipper.addEventListener('transitionend', end, { once: true });
    setTimeout(end, 1300); // safety net
  }

  function hideCue() { if (cueTimer) clearTimeout(cueTimer); advanceBtn.classList.remove('show'); }

  function advance() {
    if (advanceLock || turning || gateOpen) return;
    // The leaf where she is named will not turn until the reader says it.
    if (!gateDone && pageEl.querySelector('[data-gate="name"]')) { openNameGate(); return; }
    doAdvanceForward();
  }

  function doAdvanceForward() {
    if (currentPage < pages.length - 1) {
      turning = true;
      hideCue();                          // a click during the turn is never swallowed
      var next = currentPage + 1;
      flip({ frontHtml: pageEl.innerHTML, fromDeg: 0, toDeg: -174,
        beforeSwap: function () { renderPage(next); },
        done: function () { turning = false; scheduleCue(); } });
    } else {
      enterDoor();
    }
  }

  /* ── The name gate ──────────────────────────────────────────────
     The reader breaks witness silence with their own hand. What they
     type is not stored; it only sets saidName, which the chamber reads
     so Alex opens already knowing the summoned spoke her name. */
  function openNameGate() {
    if (gateOpen || gateDone || !nameGate) return;
    gateOpen = true;
    hideCue();
    if (backBtn) backBtn.style.visibility = 'hidden';
    if (gateCue) gateCue.textContent = 'say her name';
    nameGate.classList.add('open');
    if (gateInput) {
      gateInput.value = '';
      setTimeout(function () { try { gateInput.focus(); } catch (e) {} }, REDUCED ? 0 : 220);
    }
  }

  function submitName() {
    if (!gateOpen || !gateInput) return;
    var v = (gateInput.value || '').toLowerCase().replace(/[^a-z]/g, '');
    if (v.indexOf('alex') === -1) {
      // Not a choice. The book waits for her name.
      nameGate.classList.remove('nudge'); void nameGate.offsetWidth; nameGate.classList.add('nudge');
      if (gateCue) gateCue.textContent = 'her name';
      try { gateInput.focus(); } catch (e) {}
      return;
    }
    gateDone = true; gateOpen = false; saidName = true;
    nameGate.classList.remove('open', 'nudge');
    if (backBtn) backBtn.style.visibility = (currentPage > 0) ? 'visible' : 'hidden';
    focusEl(pageEl);
    doAdvanceForward();
  }

  function back() {
    if (advanceLock || turning || currentPage <= 0) return;
    turning = true;
    hideCue();
    var prev = currentPage - 1;
    flip({ frontHtml: pageHtml(prev), fromDeg: -174, toDeg: 0,
      beforeSwap: function () { renderPage(prev); },
      done: function () { turning = false; scheduleCue(); } });
  }

  function enterGreenRoom() {
    // The cover settles before the book opens, rather than cutting hard.
    var ov = document.getElementById('overture');
    if (REDUCED) { revealGreenRoom(); return; }
    if (ov) ov.classList.add('fading-out');
    setTimeout(revealGreenRoom, 620);
  }

  function revealGreenRoom() {
    var ov = document.getElementById('overture');
    hide('overture');
    if (ov) ov.classList.remove('fading-out');
    show('greenroom');
    setStage('green');
    stopOvertureNudge();
    paginate();
    renderPage(0);
    scheduleCue();
    focusEl(pageEl);
    if (!REDUCED) {
      var gr = document.getElementById('greenroom');
      if (gr) {
        gr.classList.add('fading-in');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { gr.classList.remove('fading-in'); });
        });
      }
    }
  }

  // The leaf box depends on the viewport. If it changes, re-fit the
  // chapters and keep the reader on the chapter they were reading.
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (body.getAttribute('data-stage') !== 'green' || turning || advanceLock || gateOpen) return;
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
  if (backBtn) backBtn.addEventListener('click', function (e) { e.stopPropagation(); back(); });
  if (gateInput) {
    gateInput.addEventListener('keydown', function (e) {
      e.stopPropagation();                 // do not let the leaf turn from here
      if (e.key === 'Enter') { e.preventDefault(); submitName(); }
    });
  }
  if (gateGo) gateGo.addEventListener('click', function (e) { e.stopPropagation(); submitName(); });
  document.addEventListener('keydown', function (e) {
    if (body.getAttribute('data-stage') !== 'green') return;
    if (e.target.closest && e.target.closest('button, a, input, textarea')) return;
    // Leaves are fitted to the screen and never scroll, so the keys turn
    // the leaf: forward, and back.
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' ||
        e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      advance();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      back();
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
    hideCue();
    drainClock();
    // The final leaf turns, and there is no next page. Only the dark.
    flip({ frontHtml: pageEl.innerHTML, fromDeg: 0, toDeg: -174,
      beforeSwap: function () {
        pageEl.innerHTML = '';
        if (bookEl) bookEl.classList.add('extinguished');
      },
      done: function () {
        turning = false;
        holdBlackThenTurn();
      } });
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

  /* ── The threshold: the reveal, advanced by the reader, one line at a
        time. The lines stay. The reader sets the pace of the floor opening. */
  var thLines = [], thIdx = 0, thReady = false, thDone = false;
  var thresholdCue = document.getElementById('thresholdCue');

  function enterThreshold() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    focusEl(document.getElementById('turnLines'));
    thLines = Array.prototype.slice.call(document.querySelectorAll('#threshold .turn-line'));
    thIdx = 0; thDone = false; thReady = false;
    if (thresholdCue) thresholdCue.classList.remove('show');
    // The first line is there almost at once, so the reader never mistakes
    // the threshold for an empty page. The held black was the door; this
    // room speaks as soon as it is entered.
    setTimeout(function () { revealNextThresholdLine(); thReady = true; }, REDUCED ? 150 : 350);
  }

  function revealNextThresholdLine() {
    if (thIdx < thLines.length) {
      thLines[thIdx].classList.add('show');
      thIdx++;
      if (thresholdCue) {
        // The cue carries a word, not just an arrow, so a first-time reader
        // knows the dark builds on itself and keeps going.
        thresholdCue.innerHTML = (thIdx >= thLines.length)
          ? 'cross the threshold<span class="arr" aria-hidden="true">&#9674;</span>'
          : 'go on<span class="arr" aria-hidden="true">&#8595;</span>';
        setTimeout(function () { thresholdCue.classList.add('show'); }, REDUCED ? 120 : 450);
      }
    } else if (!thDone) {
      thDone = true;
      if (thresholdCue) thresholdCue.classList.remove('show');
      enterChamber();
    }
  }

  function advanceThreshold() {
    if (!thReady) return;
    if (thresholdCue) thresholdCue.classList.remove('show');
    revealNextThresholdLine();
  }

  var thresholdEl = document.getElementById('threshold');
  if (thresholdEl) {
    thresholdEl.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      advanceThreshold();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (body.getAttribute('data-stage') !== 'threshold') return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' ||
        e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      advanceThreshold();
    }
  });

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
    var sendBtn = document.getElementById('sendBtn');
    var srLive = document.getElementById('srLive');
    var closeBtn = document.getElementById('chamberClose');

    var awaitingClose = false;
    var phase = 'procedure';
    var truthSettled = false;
    var recordingOn = true;
    var busy = false;
    var ended = false;
    var alexHasSpoken = false;
    var openingAttempts = 0;
    var connectionFailures = 0;

    // The live reveal of Alex's voice. Her words arrive over the wire and
    // are spoken into the room at a calm cadence, so there is no long dead
    // wait and no block that posts all at once. One stream at a time.
    var stream = null;
    function newStream() { return { buf: '', shown: 0, done: false, cut: -1, line: null, timer: null, finished: false }; }

    // Screen readers hear each completed turn once, here, rather than the
    // letter by letter reveal. The visible streaming line is aria-hidden.
    function announce(text) {
      if (!srLive) return;
      srLive.textContent = '';
      setTimeout(function () { srLive.textContent = text || ''; }, 30);
    }

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
      announce('The recording has stopped.');
    }

    function setInputEnabled(on) {
      reply.disabled = !on;
      if (sendBtn) sendBtn.disabled = !on || !reply.value.trim();
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
      // The reader closes the door themselves. Her last words and the
      // release are never cut short by a clock, and the close cue arrives
      // only after they have had a moment to land.
      var revealAfter = REDUCED ? 1200 : 3400;
      setTimeout(showCloseCue, revealAfter);
    }

    // Reveal the click out. From here the reader decides when the door
    // closes. There is no timer, the way the threshold had no timer.
    function showCloseCue() {
      if (!ended) return;
      var row = document.querySelector('.chamber-input .input-row');
      if (row) row.style.display = 'none';
      note.textContent = '';
      awaitingClose = true;
      if (closeBtn) {
        closeBtn.style.display = 'block';
        requestAnimationFrame(function () { closeBtn.classList.add('show'); });
        try { closeBtn.focus({ preventScroll: true }); } catch (e) {}
      }
    }

    function closeOut() {
      if (!awaitingClose) return;
      awaitingClose = false;
      if (closeBtn) closeBtn.classList.remove('show');
      enterCoda();
    }

    // Repaint the visible streaming line from the revealed substring. It is
    // cheap to redo each step, since one turn of speech is short.
    function paintStream() {
      if (!stream || !stream.line) return;
      var shownText = stream.buf.slice(0, stream.shown);
      var line = stream.line;
      line.innerHTML = '';
      shownText.split(/\n{2,}/).forEach(function (para) {
        var p = document.createElement('p');
        p.className = 'frag in';
        para.replace(/\s+$/, '').split('\n').forEach(function (seg, i) {
          if (i > 0) p.appendChild(document.createElement('br'));
          p.appendChild(document.createTextNode(seg));
        });
        line.appendChild(p);
      });
      if (!stream.finished) {
        var host = line.lastChild || line;
        var caret = document.createElement('span');
        caret.className = 'caret';
        caret.setAttribute('aria-hidden', 'true');
        host.appendChild(caret);
      }
      scrollDown();
    }

    // Advance one word (with its leading whitespace), so words land whole.
    function nextBoundary(s, from, limit) {
      var i = from;
      while (i < limit && /\s/.test(s.charAt(i))) i++;
      while (i < limit && !/\s/.test(s.charAt(i))) i++;
      if (i <= from) i = Math.min(from + 1, limit);
      return i;
    }

    // A speaking rhythm: a longer rest after a sentence, a shorter one after
    // a comma, otherwise the steady pace of a quiet voice.
    function revealDelay() {
      var c = stream.buf.charAt(stream.shown - 1);
      if (c === '.' || c === '?' || c === '!') return 340;
      if (c === ',' || c === ':' || c === ';') return 170;
      return 46;
    }

    // The release line, once it has fully arrived, fixes how far we reveal.
    function updateCut() {
      if (!stream || stream.cut >= 0) return;
      var m = /return to baseline[.!]?/i.exec(stream.buf);
      if (m) stream.cut = m.index + m[0].length;
    }

    function startSpeaking() {
      hideThinking();
      var line = document.createElement('div');
      line.className = 'line line-alex';
      line.setAttribute('aria-hidden', 'true'); // the completed turn is announced via announce()
      log.appendChild(line);
      stream.line = line;
      alexHasSpoken = true;
      note.textContent = '';
    }

    function pump() {
      if (!stream) return;
      stream.timer = null;
      var limit = (stream.cut >= 0) ? stream.cut : stream.buf.length;
      if (stream.shown < limit) {
        stream.shown = nextBoundary(stream.buf, stream.shown, limit);
        paintStream();
      }
      if (stream.shown >= limit && (stream.cut >= 0 || stream.done)) {
        finishStream();
        return;
      }
      // More text to speak, or caught up and waiting on the wire: keep a
      // gentle heartbeat so the reveal resumes the moment more arrives.
      stream.timer = setTimeout(pump, (stream.shown < limit) ? revealDelay() : 90);
    }

    function finishStream() {
      if (!stream || stream.finished) return;
      stream.finished = true;
      if (stream.timer) { clearTimeout(stream.timer); stream.timer = null; }
      var limit = (stream.cut >= 0) ? stream.cut : stream.buf.length;
      stream.shown = limit;
      paintStream(); // finished now, so no caret
      var shownText = stream.buf.slice(0, limit).trim();
      var fullText = stream.buf.trim();
      var releaseDetected = (stream.cut >= 0) || ENDOR.Arc.classify(fullText).release;
      announce(shownText);
      applyArc(fullText);
      stream = null;
      if (releaseDetected) { toRelease(shownText); return; }
      busy = false;
      if (ENDOR.API.readerTurnCount() >= MAX_READER_TURNS) { forceRelease(); return; }
      setInputEnabled(true);
    }

    function onChunk(t) {
      if (!stream) return;
      stream.buf += t;
      if (REDUCED) return;            // reduced motion renders once, at done
      updateCut();
      if (!stream.line) startSpeaking();
      if (!stream.timer && !stream.finished) pump();
    }

    function onStreamDone(full) {
      if (REDUCED) {
        hideThinking();
        var text = (full || '').trim();
        var cues = ENDOR.Arc.classify(text);
        var shown = cues.release ? truncateAtRelease(text) : text;
        alexHasSpoken = true;
        renderAlex(shown);
        announce(shown);
        applyArc(text);
        stream = null;
        if (cues.release) { toRelease(shown); return; }
        busy = false;
        if (ENDOR.API.readerTurnCount() >= MAX_READER_TURNS) { forceRelease(); return; }
        setInputEnabled(true);
        return;
      }
      if (!stream) return;            // already cleaned up by an error
      // Trust the authoritative full text in case a delta was dropped.
      if (full && full.length > stream.buf.length) stream.buf = full;
      stream.done = true;
      updateCut();
      if (!stream.line) startSpeaking();
      if (!stream.timer && !stream.finished) pump();
    }

    function onError(kind) {
      // Drop a half spoken line so the room is never left mid sentence.
      if (stream) {
        if (stream.timer) { clearTimeout(stream.timer); stream.timer = null; }
        if (stream.line && stream.line.parentNode && !stream.finished) {
          stream.line.parentNode.removeChild(stream.line);
        }
        stream = null;
      }
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
      if (stream) { if (stream.timer) clearTimeout(stream.timer); stream = null; }
      var lines = 'Please forgive me.\n\n' + ENDOR.Chamber.RELEASE_LINE;
      renderAlex(lines);
      announce(lines);
      toRelease(lines);
    }

    function send(userText, isSeed) {
      if (busy || ended) return;
      busy = true;
      if (!isSeed) { renderSelf(userText); }
      note.textContent = isSeed ? '' : 'she is listening.';
      setInputEnabled(false);
      showThinking();
      stream = newStream();

      ENDOR.API.send(
        userText,
        ENDOR.Chamber.SYSTEM_PROMPT,
        { onChunk: onChunk, onDone: onStreamDone, onError: onError },
        { seed: isSeed === true }
      );
    }

    function begin() {
      reply.addEventListener('keydown', onReplyKey);
      reply.addEventListener('input', clearHint);
      reply.addEventListener('input', autoGrow);
      reply.addEventListener('input', syncSend);
      if (sendBtn) sendBtn.addEventListener('click', trySend);

      // The click out at the end. The reader closes the door when ready.
      if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeOut(); });
      var chamberEl = document.getElementById('chamber');
      if (chamberEl) chamberEl.addEventListener('click', function (e) {
        if (!awaitingClose) return;
        if (e.target.closest('button, a, input, textarea')) return;
        closeOut();
      });
      document.addEventListener('keydown', function (e) {
        if (!awaitingClose) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); closeOut(); }
      });

      // Alex speaks first, in authored words, so the room always opens well.
      // If the reader said her name at the threshold, she opens knowing it.
      alexHasSpoken = true;
      var opening = (saidName && ENDOR.Chamber.OPENING_NAMED) ? ENDOR.Chamber.OPENING_NAMED : ENDOR.Chamber.OPENING;
      var cue = (saidName && ENDOR.Chamber.SEED_CUE_NAMED) ? ENDOR.Chamber.SEED_CUE_NAMED : ENDOR.Chamber.SEED_CUE;
      // A stage mark seats the reader before she speaks: this is the room
      // from the account, and the voice that follows is hers.
      renderMark('·  the chamber  ·  off every book  ·');
      renderAlex(opening);
      announce(opening);

      if (!ENDOR.API.isReady()) {
        // No live backend here. The opening lands, then she releases him.
        setTimeout(forceRelease, REDUCED ? 1800 : 5000);
        return;
      }

      // Seat the opening in the running conversation; the live model
      // continues from the reader's first reply.
      ENDOR.API.seedOpening(cue, opening);
      // The reader does not speak over her. The line to answer opens only
      // once her opening has fully landed, so the room reads as a deposition.
      var paras = String(opening).split(/\n{2,}/).length;
      var openDelay = REDUCED ? 0 : (paras - 1) * 750 + 900;
      setTimeout(function () {
        if (ended) return;
        note.textContent = 'answer her. in your own words.';
        setInputEnabled(true);
      }, openDelay);
    }

    function clearHint() {
      if (note.textContent === 'answer her. in your own words.') note.textContent = '';
    }

    function autoGrow() {
      reply.style.height = 'auto';
      reply.style.height = Math.min(reply.scrollHeight, window.innerHeight * 0.3) + 'px';
    }

    // Keep the send control in step with whether there is something to say.
    function syncSend() {
      if (sendBtn) sendBtn.disabled = reply.disabled || !reply.value.trim();
    }

    function trySend() {
      var text = reply.value.trim();
      if (!text || busy || ended) return;
      reply.value = '';
      autoGrow();
      syncSend();
      send(text, false);
    }

    function onReplyKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        trySend();
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
    // The delay before each block. The long hold before the maker's note lets
    // the reader believe the piece has ended, so the note reads as residue
    // found under ash rather than a closing speech.
    var gaps = REDUCED ? [400, 500, 700, 500, 500] : [700, 3400, 6400, 3200, 2600];
    var i = 0;
    (function reveal() {
      if (i >= blocks.length) return;
      setTimeout(function () {
        var el = document.getElementById(blocks[i]);
        if (el) el.classList.add('show');
        i++;
        reveal();
      }, gaps[i]);
    })();
  }

  /* ── Opening the book ───────────────────────────────────────── */
  document.getElementById('enterBtn').addEventListener('click', enterGreenRoom);

  var overtureNudge = null;
  function stopOvertureNudge() { if (overtureNudge) { clearInterval(overtureNudge); overtureNudge = null; } }

})();
