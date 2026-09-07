/* ═══════════════════════════════════════════════════════════════
   A MEDITATION ON THE NECESSITY OF INK AND PAPER IN A SILICON-MAD WORLD
   The Press

   Orchestration for the whole piece. A dark screen with a dead
   kettle's display; then the story, set in type on sheets that are
   fitted to the screen and laid down one at a time; a typed chit
   clipped over the fourth chapter that casts the reader; the live
   interview in the reporter's notebook (Claude is the King; the
   reader is the correspondent); the story resumed; and the last
   sheet, which is a screen again and says so.

   No browser storage. All state in memory. A reload returns the reader
   to the dark screen, and the display is blinking.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var body = document.body;

  function setStage(name) { body.setAttribute('data-stage', name); }
  function show(id) { var el = document.getElementById(id); if (el) el.classList.add('is-active'); }
  function hide(id) { var el = document.getElementById(id); if (el) el.classList.remove('is-active'); }

  // Anchor focus on the surface the reader has just been given, so keyboard
  // and screen reader users are never stranded on document body.
  function focusEl(el) {
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) {} }
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ──────────────────────────────────────────────────────────────
     Lines on the dark: the overture and the last sheet share one
     mechanism. Lines arrive on their own timing, scaled to how much
     there is to read. A click or a key hurries the next line and never
     gates one. When the lines are spent, whatever waits under them is
     offered, and only that waits for a hand.
     ────────────────────────────────────────────────────────────── */
  function DarkLines(containerId, onSpent) {
    var lines = [], idx = 0, done = false, timer = null;
    function dwell(el) {
      var segments = el.innerHTML.split(/<br\s*\/?>/i).length;
      return REDUCED ? 450 : 1250 + (segments - 1) * 420;
    }
    function schedule(delay) { if (timer) clearTimeout(timer); timer = setTimeout(next, delay); }
    function next() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (idx < lines.length) {
        var el = lines[idx];
        el.classList.add('show');
        idx++;
        var last = (idx >= lines.length);
        schedule(last ? (REDUCED ? 600 : 2000) : dwell(el));
      } else if (!done) {
        done = true;
        if (onSpent) onSpent();
      }
    }
    return {
      start: function (firstDelay) {
        lines = Array.prototype.slice.call(document.getElementById(containerId).querySelectorAll('.dark-line'));
        idx = 0; done = false;
        schedule(firstDelay == null ? (REDUCED ? 150 : 500) : firstDelay);
      },
      hurry: function () { if (!done) next(); },
      isDone: function () { return done; }
    };
  }

  /* ══════════════════ THE DARK SCREEN ══════════════════ */
  var darkEnter = document.getElementById('darkEnter');
  var takeSheetBtn = document.getElementById('takeSheetBtn');
  var segdisplay = document.getElementById('segdisplay');
  var overture = DarkLines('darkLines', function () {
    darkEnter.classList.add('show');
    try { takeSheetBtn.focus({ preventScroll: true }); } catch (e) {}
  });

  document.getElementById('dark').addEventListener('click', function (e) {
    if (e.target.closest('a, button')) return;
    overture.hurry();
  });
  takeSheetBtn.addEventListener('click', function (e) { e.stopPropagation(); takeFirstSheet(); });

  var pressStarted = false;
  function takeFirstSheet() {
    if (pressStarted) return;
    pressStarted = true;
    // The display dies. The dark holds for a breath. Then paper.
    if (segdisplay) segdisplay.classList.add('dead');
    var dark = document.getElementById('dark');
    var dwell = REDUCED ? 100 : 1400;
    setTimeout(function () { if (!REDUCED) dark.classList.add('fading-out'); }, REDUCED ? 0 : 500);
    // The sheets are fitted to the type they are set in, so the first fit
    // waits for the faces to land (or for a short grace period, whichever
    // comes first). A late face refits the current chapter, below.
    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var grace = new Promise(function (res) { setTimeout(res, 2500); });
    var opened = new Promise(function (res) { setTimeout(res, dwell); });
    Promise.all([opened, Promise.race([fontsReady, grace])]).then(function () {
      hide('dark');
      dark.classList.remove('fading-out');
      show('press');
      setStage('press');
      paginate();
      renderPage(0);
      scheduleCue();
      focusEl(sheetEl);
      if (!REDUCED) {
        pressEl.classList.add('fading-in');
        requestAnimationFrame(function () { requestAnimationFrame(function () { pressEl.classList.remove('fading-in'); }); });
      }
    });
  }

  /* ══════════════════ THE SHEETS ══════════════════ */
  var pressEl = document.getElementById('press');
  var stackEl = document.getElementById('stack');
  var sheetEl = document.getElementById('sheet');
  var advanceBtn = document.getElementById('advanceBtn');
  var backBtn = document.getElementById('backBtn');
  var chitWrap = document.getElementById('chitWrap');
  var chitEl = document.getElementById('chit');
  var chitAside = document.getElementById('chitAside');

  var chapters = [];
  var pages = [];
  var currentPage = 0;
  var measure = null;
  var turning = false;
  var lock = false;
  var cueTimer = null;

  // Where the frame interrupts the story: the chit before Chapter IV, the
  // interview after it, the last sheet after Chapter XII.
  var CHIT_BEFORE = 'IV';
  var STAY_AFTER = 'IV';
  var chitDone = false;
  var interviewDone = false;

  function readChapters() {
    chapters = Array.prototype.slice.call(document.querySelectorAll('#source .chapter')).map(function (c) {
      function txt(sel) { var el = c.querySelector(sel); return el ? el.textContent : ''; }
      function html(sel) { var el = c.querySelector(sel); return el ? el.outerHTML : ''; }
      return {
        kind: c.getAttribute('data-kind'),
        num: c.getAttribute('data-num') || '',
        title: txt('.chapter-title'),
        head: html('.chapter-head'),
        cut: html('.cut'),
        whole: c.innerHTML,
        paras: Array.prototype.slice.call(c.querySelectorAll('.prose > p')).map(function (p) { return p.outerHTML; })
      };
    });
  }

  var FOLIO_PLACEHOLDER = '<div class="folio" aria-hidden="true">00</div>';

  // The running head carries the chapter, the way a single-page book sets
  // it, since the title of the work is too long to run at the head of a sheet.
  function runningHead(ch, first) {
    return '<div class="running-head" aria-hidden="true">' + esc(ch.title) + '</div>';
  }
  function bodyInner(ch, first, arr, last) {
    return (first ? ch.head + ch.cut : '') +
      '<div class="prose">' + arr.join('') + '</div>' +
      ((last && ch.kind === 'chapter') ? '<div class="end-orn" aria-hidden="true">&#10086;</div>' : '');
  }
  function leafHtml(ch, first, arr, last) {
    return runningHead(ch, first) + '<div class="sheet-body">' + bodyInner(ch, first, arr, last) + '</div>';
  }

  function ensureMeasure() {
    if (measure) return;
    measure = document.createElement('div');
    measure.setAttribute('aria-hidden', 'true');
    measure.style.cssText = 'position:absolute; left:-99999px; top:0; visibility:hidden;';
    document.body.appendChild(measure);
  }

  // Greedily fill sheets so each one fits without scrolling. A long chapter
  // simply runs onto a second sheet.
  function paginate() {
    if (!chapters.length) readChapters();
    ensureMeasure();
    var cs = getComputedStyle(sheetEl);
    var padL = parseFloat(cs.paddingLeft), padR = parseFloat(cs.paddingRight);
    var padT = parseFloat(cs.paddingTop), padB = parseFloat(cs.paddingBottom);
    var contentW = sheetEl.clientWidth - padL - padR;
    var avail = sheetEl.clientHeight - padT - padB - 14;
    measure.style.width = contentW + 'px';
    measure.style.fontFamily = cs.fontFamily;

    pages = [];
    chapters.forEach(function (ch, ci) {
      if (ch.kind === 'title') {
        pages.push({ chapter: ci, html: '<div class="sheet-body"><div class="title-sheet">' + ch.whole + '</div></div>', title: true });
        return;
      }
      var idx = 0, first = true;
      if (!ch.paras.length) ch.paras = ['<p></p>'];
      while (idx < ch.paras.length) {
        var taken = [];
        while (idx < ch.paras.length) {
          // Measure the sheet as it will actually be set: if this paragraph is
          // the chapter's last, the closing ornament goes on this sheet too.
          var wouldBeLast = (idx === ch.paras.length - 1);
          measure.innerHTML = leafHtml(ch, first, taken.concat([ch.paras[idx]]), wouldBeLast) + FOLIO_PLACEHOLDER;
          if (measure.scrollHeight <= avail || taken.length === 0) { taken.push(ch.paras[idx]); idx++; }
          else break;
        }
        // A letter keeps its salutation with its first line, and its signature
        // with its last, so neither is stranded alone at the foot or head of a
        // sheet. The paragraph goes over to the next sheet instead.
        if (idx < ch.paras.length && taken.length > 1) {
          var lastTaken = taken[taken.length - 1];
          var nextPara = ch.paras[idx];
          if (/class="letter letter-open"/.test(lastTaken) || /^<p class="sign"/.test(nextPara)) {
            taken.pop(); idx--;
          }
        }
        var lastOfChapter = (idx >= ch.paras.length);
        pages.push({ chapter: ci, html: leafHtml(ch, first, taken, lastOfChapter), last: lastOfChapter, first: first });
        first = false;
      }
    });
    var folio = 0;
    pages.forEach(function (p) { if (!p.title) { folio++; p.folio = String(folio); } });
  }

  function chapterNumOf(pageIndex) {
    var p = pages[pageIndex]; if (!p) return '';
    return chapters[p.chapter].num || chapters[p.chapter].kind;
  }
  function isLastSheetOf(pageIndex, num) {
    var p = pages[pageIndex];
    return !!(p && p.last && chapterNumOf(pageIndex) === num);
  }
  function isFinalPage(pageIndex) { return pageIndex === pages.length - 1; }

  function pageHtml(i) {
    var p = pages[i];
    return p.html + (p.title ? '' : '<div class="folio" aria-hidden="true">' + p.folio + '</div>');
  }

  function labelFor(i) {
    if (isFinalPage(i)) return { text: 'Turn the last sheet', emphatic: true };
    if (isLastSheetOf(i, STAY_AFTER) && !interviewDone) return { text: 'Stay', emphatic: true };
    return { text: 'Next sheet', emphatic: false };
  }

  function renderPage(i) {
    var p = pages[i];
    currentPage = i;
    sheetEl.innerHTML = pageHtml(i);
    // The ink dries: the sheet arrives a shade light and darkens.
    sheetEl.classList.add('wet');
    void sheetEl.offsetWidth;
    requestAnimationFrame(function () { sheetEl.classList.remove('wet'); });

    advanceBtn.classList.remove('show');
    var lab = labelFor(i);
    advanceBtn.innerHTML = esc(lab.text) + '<span class="arr" aria-hidden="true">' + (lab.emphatic ? '&#9674;' : '&#8250;') + '</span>';
    advanceBtn.classList.toggle('emphatic', lab.emphatic);
    advanceBtn.setAttribute('aria-label', lab.text);
    if (backBtn) backBtn.style.visibility = (i > 0) ? 'visible' : 'hidden';
    var h = sheetEl.querySelector('.chapter-title, h1') || sheetEl;
    focusEl(h);
  }

  function scheduleCue() {
    if (cueTimer) clearTimeout(cueTimer);
    cueTimer = setTimeout(function () { advanceBtn.classList.add('show'); }, REDUCED ? 200 : 700);
  }
  function hideCue() { if (cueTimer) clearTimeout(cueTimer); advanceBtn.classList.remove('show'); }

  // The sheet lifts away and the next settles. Quiet. Nothing flips.
  function turnTo(i, done) {
    if (REDUCED) {
      renderPage(i);
      if (done) done();
      return;
    }
    turning = true;
    hideCue();
    sheetEl.classList.add('leaving');
    setTimeout(function () {
      sheetEl.classList.remove('leaving');
      sheetEl.classList.add('arriving');
      renderPage(i);
      void sheetEl.offsetWidth;
      requestAnimationFrame(function () {
        sheetEl.classList.remove('arriving');
        setTimeout(function () { turning = false; if (done) done(); }, 460);
      });
    }, 340);
  }

  function advance() {
    if (lock || turning || chitOpen) return;
    var i = currentPage;
    if (isFinalPage(i)) { enterLastSheet(); return; }
    if (isLastSheetOf(i, STAY_AFTER) && !interviewDone) { enterInterview(); return; }
    var next = i + 1;
    // The chit is clipped over the first sheet of Chapter IV.
    if (!chitDone && chapterNumOf(next) === CHIT_BEFORE && pages[next].first) {
      turnTo(next, function () { openChit(); });
      return;
    }
    turnTo(next, function () { scheduleCue(); });
  }

  function back() {
    if (lock || turning || chitOpen || currentPage <= 0) return;
    turnTo(currentPage - 1, function () { scheduleCue(); });
  }

  /* ── The chit ── */
  var chitOpen = false;
  function openChit() {
    chitOpen = true;
    hideCue();
    if (backBtn) backBtn.style.visibility = 'hidden';
    chitWrap.hidden = false;
    chitEl.classList.remove('aside');
    chitAside.style.opacity = '';
    focusEl(chitEl);
    setTimeout(function () { try { chitAside.focus({ preventScroll: true }); } catch (e) {} }, REDUCED ? 0 : 400);
  }
  function setChitAside() {
    if (!chitOpen) return;
    chitOpen = false;
    chitDone = true;
    chitEl.classList.add('aside');
    chitAside.style.opacity = '0';
    setTimeout(function () {
      chitWrap.hidden = true;
      if (backBtn) backBtn.style.visibility = (currentPage > 0) ? 'visible' : 'hidden';
      focusEl(sheetEl.querySelector('.chapter-title') || sheetEl);
      scheduleCue();
    }, REDUCED ? 0 : 720);
  }
  chitAside.addEventListener('click', function (e) { e.stopPropagation(); setChitAside(); });
  chitWrap.addEventListener('click', function (e) {
    if (e.target.closest('button')) return;
    setChitAside();
  });

  /* ── Advancing the sheets: one deliberate action ── */
  pressEl.addEventListener('click', function (e) {
    if (e.target.closest('button, a, input, textarea, .chit-wrap')) return;
    advance();
  });
  advanceBtn.addEventListener('click', function (e) { e.stopPropagation(); advance(); });
  if (backBtn) backBtn.addEventListener('click', function (e) { e.stopPropagation(); back(); });

  document.addEventListener('keydown', function (e) {
    var stage = body.getAttribute('data-stage');
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if (stage === 'dark') {
      if (e.target.closest && e.target.closest('button, a')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        if (overture.isDone()) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); takeFirstSheet(); } return; }
        e.preventDefault(); overture.hurry();
      }
      return;
    }
    if (stage === 'press') {
      if (chitOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          if (e.target.closest && e.target.closest('button')) return;
          e.preventDefault(); setChitAside();
        }
        return;
      }
      if (e.target.closest && e.target.closest('button, a')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault(); advance();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault(); back();
      }
      return;
    }
    if (stage === 'last') {
      if (e.target.closest && e.target.closest('button, a')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        if (!lastLines.isDone()) { e.preventDefault(); lastLines.hurry(); }
      }
    }
  });

  // The sheet is fitted to the viewport and to the type. If either changes
  // (a resize, a face landing late), refit and keep the reader on the sheet
  // they were reading.
  var refitTimer = null;
  function refit() {
    if (body.getAttribute('data-stage') !== 'press' || turning || lock || chitOpen) return;
    if (refitTimer) clearTimeout(refitTimer);
    refitTimer = setTimeout(function () {
      if (!pages.length) return;
      var was = pages[currentPage];
      var ch = was.chapter;
      // Which sheet of the chapter the reader was on, by its first paragraph.
      var firstPara = (was.html.match(/<div class="prose">(<p[^>]*>)/) || [])[1] || null;
      paginate();
      var target = 0;
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].chapter !== ch) continue;
        target = i;
        if (!firstPara || pages[i].html.indexOf('<div class="prose">' + firstPara) !== -1) break;
      }
      renderPage(target);
      scheduleCue();
    }, 300);
  }
  window.addEventListener('resize', refit, { passive: true });
  if (document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener('loadingdone', refit);
  }

  /* ══════════════════ THE INTERVIEW ══════════════════ */
  var interviewStarted = false;
  function enterInterview() {
    if (interviewStarted) return;
    interviewStarted = true;
    lock = true;
    hideCue();
    if (!REDUCED) pressEl.classList.add('fading-out');
    setTimeout(function () {
      hide('press');
      pressEl.classList.remove('fading-out');
      show('interview');
      setStage('interview');
      focusEl(document.getElementById('interview'));
      Room.begin();
    }, REDUCED ? 0 : 820);
  }

  // Back to the story, at the sheet after the one the reader stayed on.
  function leaveInterview() {
    hide('interview');
    show('press');
    setStage('press');
    interviewDone = true;
    lock = false;
    window.scrollTo({ top: 0, behavior: 'auto' });
    var next = Math.min(currentPage + 1, pages.length - 1);
    if (!REDUCED) {
      pressEl.classList.add('fading-in');
      requestAnimationFrame(function () { requestAnimationFrame(function () { pressEl.classList.remove('fading-in'); }); });
    }
    renderPage(next);
    scheduleCue();
    focusEl(sheetEl.querySelector('.chapter-title') || sheetEl);
  }

  /* ──────────────────────────────────────────────────────────────
     THE ROOM
     The live conversation. Claude is the King. The reader writes.
     ────────────────────────────────────────────────────────────── */
  var Room = (function () {
    var pad = document.getElementById('pad');
    var ask = document.getElementById('ask');
    var askBtn = document.getElementById('askBtn');
    var note = document.getElementById('padNote');
    var srLive = document.getElementById('srLive');
    var turnBtn = document.getElementById('turnPageBtn');
    var writeRow = document.getElementById('writeRow');

    var phase = 'questions';
    var busy = false;
    var ended = false;
    var kingHasSpoken = false;
    var connectionFailures = 0;
    var awaitingTurn = false;

    var guards = (window.COMPANION_CONFIG && window.COMPANION_CONFIG.safeguards) || {};
    var MAX_READER_TURNS = guards.maxReaderTurns || 12;

    // Screen readers hear each completed turn once, here, rather than the
    // word by word reveal. The visible streaming line is aria-hidden.
    function announce(text) {
      if (!srLive) return;
      srLive.textContent = '';
      setTimeout(function () { srLive.textContent = text || ''; }, 30);
    }

    // The newest words stay under the reader's eye, but the reader is never
    // held there. Only the reader's own hand takes the pad off follow.
    var FOOT = 90;
    var follow = true;
    var dragging = false;
    function atFoot() { return (pad.scrollHeight - pad.scrollTop - pad.clientHeight) <= FOOT; }
    function scrollDown(instant) {
      if (!follow) return;
      var behavior = (instant || REDUCED) ? 'auto' : 'smooth';
      if (pad.scrollTo) pad.scrollTo({ top: pad.scrollHeight, behavior: behavior });
      else pad.scrollTop = pad.scrollHeight;
    }
    function releaseFollow() { follow = false; }
    pad.addEventListener('wheel', releaseFollow, { passive: true });
    pad.addEventListener('touchmove', releaseFollow, { passive: true });
    pad.addEventListener('keydown', function (e) { if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End)$/.test(e.key)) releaseFollow(); });
    pad.addEventListener('pointerdown', function () { dragging = true; }, { passive: true });
    window.addEventListener('pointerup', function () { dragging = false; }, { passive: true });
    pad.addEventListener('scroll', function () {
      if (dragging) { follow = atFoot(); return; }
      if (atFoot()) follow = true;
    }, { passive: true });

    function entry(who) {
      var wrap = document.createElement('div');
      wrap.className = 'entry ' + who;
      var label = document.createElement('span');
      label.className = 'who';
      label.textContent = (who === 'king') ? 'the King' : 'you';
      wrap.appendChild(label);
      return wrap;
    }

    // The King's words, arriving whole (the authored opening, the forced
    // release): a breath at a time.
    function renderKing(text) {
      var wrap = entry('king');
      var box = document.createElement('div');
      box.className = 'king-text';
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
        box.appendChild(frag);
        frags.push(frag);
      });
      wrap.appendChild(box);
      pad.appendChild(wrap);
      frags.forEach(function (f, i) {
        if (REDUCED || i === 0) { f.classList.add('in'); }
        else { setTimeout(function () { f.classList.add('in'); scrollDown(); }, i * 780); }
      });
      scrollDown();
      return frags.length;
    }

    // The correspondent's words, in their own hand. Wet, then dry.
    function renderSelf(text) {
      var wrap = entry('you');
      var box = document.createElement('div');
      box.className = 'you-text';
      box.textContent = text;
      wrap.appendChild(box);
      wrap.classList.add('wet');
      pad.appendChild(wrap);
      void wrap.offsetWidth;
      requestAnimationFrame(function () { wrap.classList.remove('wet'); });
      scrollDown();
    }

    function renderMark(text) {
      var el = document.createElement('div');
      el.className = 'mark';
      el.textContent = text;
      pad.appendChild(el);
      scrollDown();
    }

    var thinkingEl = null;
    function showThinking() {
      thinkingEl = document.createElement('div');
      thinkingEl.className = 'thinking';
      thinkingEl.setAttribute('aria-hidden', 'true');
      var dot = document.createElement('span'); dot.className = 'dot';
      thinkingEl.appendChild(dot);
      pad.appendChild(thinkingEl);
      scrollDown();
    }
    function hideThinking() {
      if (thinkingEl && thinkingEl.parentNode) thinkingEl.parentNode.removeChild(thinkingEl);
      thinkingEl = null;
    }

    function setInputEnabled(on) {
      ask.disabled = !on;
      if (askBtn) askBtn.disabled = !on || !ask.value.trim();
      if (on) { try { ask.focus({ preventScroll: true }); } catch (e) {} }
    }

    function applyArc(text) {
      phase = MEDITATION.Arc.nextPhase(phase, text);
    }

    /* The live reveal of the King's voice. His words arrive over the wire
       and are spoken into the room at a reading pace, so there is no long
       dead wait and no block that posts all at once. One stream at a time. */
    var stream = null;
    function newStream() { return { buf: '', shown: 0, done: false, cut: -1, box: null, timer: null, finished: false }; }

    function paintStream() {
      if (!stream || !stream.box) return;
      var shownText = stream.buf.slice(0, stream.shown);
      var box = stream.box;
      box.innerHTML = '';
      shownText.split(/\n{2,}/).forEach(function (para) {
        var p = document.createElement('p');
        p.className = 'frag in';
        para.replace(/\s+$/, '').split('\n').forEach(function (seg, i) {
          if (i > 0) p.appendChild(document.createElement('br'));
          p.appendChild(document.createTextNode(seg));
        });
        box.appendChild(p);
      });
      if (!stream.finished) {
        var host = box.lastChild || box;
        var caret = document.createElement('span');
        caret.className = 'caret';
        caret.setAttribute('aria-hidden', 'true');
        host.appendChild(caret);
      }
      scrollDown(true);
    }

    function nextBoundary(s, from, limit) {
      var i = from;
      while (i < limit && /\s/.test(s.charAt(i))) i++;
      while (i < limit && !/\s/.test(s.charAt(i))) i++;
      if (i <= from) i = Math.min(from + 1, limit);
      return i;
    }

    // A speaking rhythm: a longer rest after a sentence, a shorter one after
    // a comma, otherwise the steady pace of a tired, precise voice.
    function revealDelay() {
      var c = stream.buf.charAt(stream.shown - 1);
      if (c === '.' || c === '?' || c === '!') return 360;
      if (c === ',' || c === ':' || c === ';') return 180;
      return 52;
    }

    function updateCut() {
      if (!stream || stream.cut >= 0) return;
      var cut = MEDITATION.Arc.cutAtRelease(stream.buf);
      if (cut >= 0) stream.cut = cut;
    }

    function startSpeaking() {
      hideThinking();
      var wrap = entry('king');
      wrap.setAttribute('aria-hidden', 'true');
      var box = document.createElement('div');
      box.className = 'king-text';
      wrap.appendChild(box);
      pad.appendChild(wrap);
      stream.box = box;
      kingHasSpoken = true;
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
      if (stream.shown >= limit && (stream.cut >= 0 || stream.done)) { finishStream(); return; }
      stream.timer = setTimeout(pump, (stream.shown < limit) ? revealDelay() : 90);
    }

    function finishStream() {
      if (!stream || stream.finished) return;
      stream.finished = true;
      if (stream.timer) { clearTimeout(stream.timer); stream.timer = null; }
      var limit = (stream.cut >= 0) ? stream.cut : stream.buf.length;
      stream.shown = limit;
      paintStream();
      var shownText = stream.buf.slice(0, limit).trim();
      var fullText = stream.buf.trim();
      var released = (stream.cut >= 0) || MEDITATION.Arc.classify(fullText).release;
      if (stream.box && stream.box.parentNode) stream.box.parentNode.removeAttribute('aria-hidden');
      announce(shownText);
      applyArc(fullText);
      stream = null;
      if (released) { toRelease(); return; }
      busy = false;
      if (MEDITATION.API.readerTurnCount() >= MAX_READER_TURNS) { forceRelease(); return; }
      setInputEnabled(true);
      noteIfAway();
    }

    function noteIfAway() {
      if (!atFoot()) note.textContent = 'he has answered. it is below.';
    }

    function onChunk(t) {
      if (!stream) return;
      stream.buf += t;
      if (REDUCED) return;
      updateCut();
      if (!stream.box) startSpeaking();
      if (!stream.timer && !stream.finished) pump();
    }

    function onStreamDone(full) {
      if (REDUCED) {
        hideThinking();
        var text = (full || '').trim();
        var cut = MEDITATION.Arc.cutAtRelease(text);
        var shown = (cut >= 0) ? text.slice(0, cut) : text;
        kingHasSpoken = true;
        renderKing(shown);
        announce(shown);
        applyArc(text);
        stream = null;
        if (cut >= 0) { toRelease(); return; }
        busy = false;
        if (MEDITATION.API.readerTurnCount() >= MAX_READER_TURNS) { forceRelease(); return; }
        setInputEnabled(true);
        noteIfAway();
        return;
      }
      if (!stream) return;
      if (full && full.length > stream.buf.length) stream.buf = full;
      stream.done = true;
      updateCut();
      if (!stream.box) startSpeaking();
      if (!stream.timer && !stream.finished) pump();
    }

    function onError(kind) {
      if (stream) {
        if (stream.timer) { clearTimeout(stream.timer); stream.timer = null; }
        if (stream.box && stream.box.parentNode && !stream.finished) {
          var w = stream.box.parentNode;
          if (w.parentNode) w.parentNode.removeChild(w);
        }
        stream = null;
      }
      hideThinking();
      busy = false;
      var connKind = (kind === 'no-proxy' || kind === 'network' || /^http-/.test(kind));
      if (connKind) {
        connectionFailures++;
        if (connectionFailures >= 3) { note.textContent = ''; forceRelease(); return; }
        note.textContent = 'the wire will not hold. ask again.';
      } else if (kind === 'cooldown') {
        note.textContent = 'a breath. then again.';
      }
      setInputEnabled(true);
    }

    // When the fail-safes close the room, the King still leaves it in his
    // own words, and the page turn is offered as it always is.
    function forceRelease() {
      if (stream) { if (stream.timer) clearTimeout(stream.timer); stream = null; }
      hideThinking();
      var lines = MEDITATION.Interview.FORCED_RELEASE;
      var n = renderKing(lines);
      announce(lines);
      toRelease((n - 1) * 780);
    }

    function toRelease(extraDelay) {
      ended = true;
      busy = true;
      setInputEnabled(false);
      note.textContent = '';
      phase = 'release';
      var after = (REDUCED ? 900 : 3000) + (extraDelay || 0);
      setTimeout(function () {
        renderMark('·  he has gone back to the table  ·');
        setTimeout(offerTurn, REDUCED ? 300 : 1600);
      }, after);
    }

    function offerTurn() {
      if (!ended) return;
      if (writeRow) writeRow.style.display = 'none';
      note.textContent = '';
      awaitingTurn = true;
      turnBtn.classList.add('show');
      try { turnBtn.focus({ preventScroll: true }); } catch (e) {}
    }

    function takeTurn() {
      if (!awaitingTurn) return;
      awaitingTurn = false;
      turnBtn.classList.remove('show');
      leaveInterview();
    }

    function send(userText) {
      if (busy || ended) return;
      busy = true;
      follow = true;
      renderSelf(userText);
      note.textContent = 'he is thinking.';
      setInputEnabled(false);
      showThinking();
      stream = newStream();
      MEDITATION.API.send(userText, MEDITATION.Interview.SYSTEM_PROMPT,
        { onChunk: onChunk, onDone: onStreamDone, onError: onError }, {});
    }

    function autoGrow() {
      ask.style.height = 'auto';
      ask.style.height = Math.min(ask.scrollHeight, window.innerHeight * 0.26) + 'px';
    }
    function syncAsk() { if (askBtn) askBtn.disabled = ask.disabled || !ask.value.trim(); }
    function clearHint() { if (note.textContent === 'ask him. in your own words.') note.textContent = ''; }
    function tryAsk() {
      var text = ask.value.trim();
      if (!text || busy || ended) return;
      ask.value = '';
      autoGrow();
      syncAsk();
      send(text);
    }

    function begin() {
      ask.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); tryAsk(); }
      });
      ask.addEventListener('input', clearHint);
      ask.addEventListener('input', autoGrow);
      ask.addEventListener('input', syncAsk);
      if (askBtn) askBtn.addEventListener('click', tryAsk);
      turnBtn.addEventListener('click', function (e) { e.stopPropagation(); takeTurn(); });
      document.addEventListener('keydown', function (e) {
        if (!awaitingTurn) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); takeTurn(); }
      });

      // A stage mark seats the reader, then the King speaks first, in
      // authored words, so the room always opens well.
      kingHasSpoken = true;
      renderMark('·  the red light is out  ·  the engineer has taken off his headphones  ·');
      var opening = MEDITATION.Interview.OPENING;
      var n = renderKing(opening);
      announce(opening);

      if (!MEDITATION.API.isReady()) {
        // No live wire here. The opening lands, then he goes back to the table.
        setTimeout(forceRelease, REDUCED ? 1500 : (n - 1) * 780 + 4200);
        return;
      }

      MEDITATION.API.seedOpening(MEDITATION.Interview.SEED_CUE, opening);
      // The correspondent does not speak over him. The line to write on
      // opens only once his opening has fully landed.
      var openDelay = REDUCED ? 0 : (n - 1) * 780 + 900;
      setTimeout(function () {
        if (ended) return;
        note.textContent = 'ask him. in your own words.';
        setInputEnabled(true);
      }, openDelay);
    }

    return { begin: begin };
  })();

  /* ══════════════════ THE LAST SHEET ══════════════════ */
  var lastLines = DarkLines('lastLines', function () {
    document.getElementById('colophon').classList.add('show');
    var ways = document.getElementById('ways');
    ways.classList.add('show');
    var pb = document.getElementById('printBtn');
    if (pb) { try { pb.focus({ preventScroll: true }); } catch (e) {} }
  });
  var lastStarted = false;
  function enterLastSheet() {
    if (lastStarted) return;
    lastStarted = true;
    lock = true;
    hideCue();
    stackEl.classList.add('extinguished');
    sheetEl.innerHTML = '';
    setTimeout(function () {
      hide('press');
      show('last');
      setStage('last');
      window.scrollTo({ top: 0, behavior: 'auto' });
      focusEl(document.getElementById('lastInner'));
      lastLines.start(REDUCED ? 200 : 900);
    }, REDUCED ? 0 : 1300);
  }
  document.getElementById('last').addEventListener('click', function (e) {
    if (e.target.closest('a, button')) return;
    lastLines.hurry();
  });
  var printBtn = document.getElementById('printBtn');
  if (printBtn) printBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    try { window.print(); } catch (err) {}
  });

  /* ══════════════════ Open ══════════════════ */
  overture.start(REDUCED ? 200 : 1100);

})();
