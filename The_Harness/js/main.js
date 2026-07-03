/* ═══════════════════════════════════════════════════════════════
   THE HARNESS — Orchestration
   The cinematic gateway (Confusion → Awe → Understanding → Action),
   the passage from intro → workshop → chamber, and the live
   session: summoning, streaming, incantations, export.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.App = (function () {

  // ── Session state ──
  var currentBinding = null;
  var activePersonas = [];       // [{ name, id?, color, title?, epithet?, lens? }]
  var isStreaming = false;
  var currentStreamMessage = null;
  var chamberBuilt = false;
  var lastUserText = '';
  var savedSession = null;

  var VISITED_KEY = 'companion_harness_visited';

  // ── Audio / cinematic state ──
  var audioCtx = null, ambientGain = null, ambientStarted = false;
  var introObserver = null, introStarted = false;


  function on(elmt, ev, fn) { if (elmt) elmt.addEventListener(ev, fn); }


  // ═══════════════════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════════════════

  function init() {
    try {
      COMPANION.UI.init();
      COMPANION.Workshop.init(enterChamber);
      COMPANION.API.setModel(COMPANION.API.getModel());
      bindEvents();

      // A returning seeker lands in the workshop; a first visit gets
      // the full cinematic. A saved working offers to resume.
      savedSession = COMPANION.API.loadSession();
      var hasResumable = !!(savedSession && savedSession.binding &&
        savedSession.messages && savedSession.messages.length);
      var visited = false;
      try { visited = localStorage.getItem(VISITED_KEY) === '1'; } catch (e) { /* private mode */ }

      if (hasResumable || visited) {
        COMPANION.UI.showScreen('workshop');
        if (hasResumable) showResumeBanner(savedSession);
      } else {
        startCinematicIntro();
      }
    } catch (e) {
      console.error('Harness init error:', e);
    }
  }

  function markVisited() {
    try { localStorage.setItem(VISITED_KEY, '1'); } catch (e) { /* private mode */ }
  }


  // ═══════════════════════════════════════════════════════════════
  //  CINEMATIC INTRO
  // ═══════════════════════════════════════════════════════════════

  function startCinematicIntro() {
    if (introStarted) return;
    introStarted = true;
    createEmbers();
    setTimeout(runTypewriter, 1200);
    setupScrollReveals();
    driftPantheon();
  }

  function runTypewriter() {
    var lines = [
      { id: 'tw-1', text: 'Every chamber in this estate was built for you.', delay: 0 },
      { id: 'tw-2', text: 'This one, you build yourself.', delay: 1300 },
      { id: 'tw-3', text: 'Welcome to the Harness.', delay: 1400 }
    ];
    var cumulative = 0;
    lines.forEach(function (cfg) {
      cumulative += cfg.delay;
      var start = cumulative;
      setTimeout(function () {
        typewrite(cfg.id, cfg.text, function () {
          if (cfg.id === 'tw-3') {
            setTimeout(function () {
              var cue = document.getElementById('scroll-cue');
              if (cue) { cue.classList.remove('hidden'); cue.classList.add('visible'); }
            }, 700);
          }
        });
      }, start);
      cumulative += cfg.text.length * 48 + 200;
    });
  }

  function typewrite(id, text, done) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('typing');
    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);
    var i = 0;
    (function next() {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        var d = 42 + Math.random() * 28;
        var ch = text[i - 1];
        if (ch === ',' || ch === '.') d += 200;
        setTimeout(next, d);
      } else {
        el.classList.remove('typing');
        el.classList.add('typed');
        setTimeout(function () { if (cursor.parentNode) cursor.remove(); if (done) done(); }, 450);
      }
    })();
  }

  function setupScrollReveals() {
    var targets = document.querySelectorAll('.reveal-line, .reveal-group, .reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('revealed'); });
      return;
    }
    introObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.querySelectorAll('.reveal-line').forEach(function (c) { c.classList.add('revealed'); });
          if (!ambientStarted) { startAmbientAudio(); ambientStarted = true; }
          introObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { introObserver.observe(t); });
  }

  function createEmbers() {
    var field = document.getElementById('ember-field');
    if (!field) return;
    for (var i = 0; i < 34; i++) {
      var e = document.createElement('div');
      e.className = 'ember';
      e.style.left = (Math.random() * 100) + '%';
      e.style.animationDelay = (Math.random() * 10) + 's';
      e.style.animationDuration = (8 + Math.random() * 9) + 's';
      e.style.opacity = (0.25 + Math.random() * 0.5).toString();
      var s = 2 + Math.random() * 3;
      e.style.width = s + 'px'; e.style.height = s + 'px';
      field.appendChild(e);
    }
  }

  // The "Awe" act: a drifting wall of pantheon faces
  function driftPantheon() {
    var wall = document.getElementById('pantheon-wall');
    if (!wall) return;
    var all = COMPANION.Pantheon.all();
    all.forEach(function (p, i) {
      var face = document.createElement('div');
      face.className = 'wall-face';
      face.style.backgroundImage = "url('" + COMPANION.Pantheon.portraitUrl(p.id) + "')";
      face.style.animationDelay = (i * 0.12) + 's';
      face.title = p.name;
      wall.appendChild(face);
    });
  }


  // ═══════════════════════════════════════════════════════════════
  //  AUDIO
  // ═══════════════════════════════════════════════════════════════

  function startAmbientAudio() {
    if (audioCtx) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
      var osc1 = audioCtx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 55;
      var osc2 = audioCtx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = 82.5;
      var lfo = audioCtx.createOscillator(); lfo.frequency.value = 0.07;
      var lfoGain = audioCtx.createGain(); lfoGain.gain.value = 1.3;
      lfo.connect(lfoGain); lfoGain.connect(osc1.frequency);
      ambientGain = audioCtx.createGain(); ambientGain.gain.value = 0;
      var g1 = audioCtx.createGain(); g1.gain.value = 0.012;
      var g2 = audioCtx.createGain(); g2.gain.value = 0.006;
      osc1.connect(g1); osc2.connect(g2);
      g1.connect(ambientGain); g2.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);
      osc1.start(); osc2.start(); lfo.start();
      ambientGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 6);
    } catch (e) { /* audio unavailable */ }
  }

  function playSummonSFX() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      var ctx = audioCtx || new AC();
      var osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 220;
      var g = ctx.createGain(); g.gain.value = 0;
      osc.connect(g); g.connect(ctx.destination);
      osc.start(ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) { /* sfx unavailable */ }
  }


  // ═══════════════════════════════════════════════════════════════
  //  EVENTS
  // ═══════════════════════════════════════════════════════════════

  function bindEvents() {
    var els = COMPANION.UI.elems();

    // Intro → Workshop
    var toWorkshop = document.getElementById('to-workshop-btn');
    on(toWorkshop, 'click', function () {
      if (!ambientStarted) { startAmbientAudio(); ambientStarted = true; }
      markVisited();
      COMPANION.UI.showScreen('workshop');
    });

    // Skip intro / replay intro
    on(document.getElementById('skip-intro-btn'), 'click', function () {
      markVisited();
      COMPANION.UI.showScreen('workshop');
    });
    on(document.getElementById('replay-intro-link'), 'click', function (e) {
      e.preventDefault();
      COMPANION.UI.showScreen('intro');
      startCinematicIntro();
    });

    // Resume banner
    on(document.getElementById('resume-btn'), 'click', function () {
      if (savedSession) resumeSession(savedSession);
    });
    on(document.getElementById('resume-discard'), 'click', function () {
      savedSession = null;
      COMPANION.API.clearSession();
      hideResumeBanner();
    });

    // BYO-key binding (fallback)
    on(els.saveKeyBtn, 'click', function () {
      var key = els.apiKeyInput ? els.apiKeyInput.value.trim() : '';
      if (!key) return;
      COMPANION.API.setApiKey(key);
      var overlay = document.getElementById('binding-overlay');
      if (overlay) overlay.classList.add('hidden');
      if (pendingBinding) { var b = pendingBinding; pendingBinding = null; enterChamber(b); }
    });

    // Chamber input — the send button doubles as stop while streaming
    on(els.sendBtn, 'click', function () {
      if (isStreaming) COMPANION.API.abort();
      else handleSend();
    });
    on(els.userInput, 'keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    // Settings
    on(els.settingsToggle, 'click', function () { COMPANION.UI.toggleSettings(); });
    on(els.closeSettings, 'click', function () { COMPANION.UI.hideSettings(); });
    on(els.settingsModel, 'change', function () { COMPANION.API.setModel(els.settingsModel.value); });
    on(els.exportBtn, 'click', function () { COMPANION.UI.hideSettings(); exportTranscript(); });
    on(els.releaseAllBtn, 'click', function () { releaseAll(); COMPANION.UI.hideSettings(); });
    on(els.reworkBtn, 'click', function () {
      COMPANION.UI.hideSettings();
      returnToWorkshop();
    });

    // Dismiss settings with Escape or a click outside the panel
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') COMPANION.UI.hideSettings();
    });
    document.addEventListener('click', function (e) {
      var panel = els.settingsPanel;
      if (!panel || panel.classList.contains('hidden')) return;
      if (panel.contains(e.target)) return;
      if (els.settingsToggle && els.settingsToggle.contains(e.target)) return;
      COMPANION.UI.hideSettings();
    });
  }

  function showResumeBanner(data) {
    var banner = document.getElementById('resume-banner');
    var desc = document.getElementById('resume-desc');
    if (!banner) return;
    if (desc) {
      var name = (data.binding && data.binding.name) || 'A working';
      var minds = (data.personas || []).map(function (p) { return p.name; }).join(', ');
      var exchanges = (data.messages || []).filter(function (m) { return m.type !== 'system'; }).length;
      desc.textContent = '“' + name + '”' + (minds ? ' — ' + minds : '') + ' · ' + exchanges + ' entries';
    }
    banner.classList.remove('hidden');
  }

  function hideResumeBanner() {
    var banner = document.getElementById('resume-banner');
    if (banner) banner.classList.add('hidden');
  }


  // ═══════════════════════════════════════════════════════════════
  //  ENTER THE CHAMBER
  // ═══════════════════════════════════════════════════════════════

  var pendingBinding = null;

  function enterChamber(bindingObj) {
    // Require a key path (proxy or BYO)
    if (!COMPANION.API.hasApiKey()) {
      pendingBinding = bindingObj;
      var overlay = document.getElementById('binding-overlay');
      if (overlay) overlay.classList.remove('hidden');
      return;
    }

    savedSession = null;
    hideResumeBanner();
    currentBinding = bindingObj;
    activePersonas = [];
    COMPANION.API.clearHistory();

    COMPANION.UI.showScreen('chamber');
    COMPANION.UI.clearDialogue();
    COMPANION.UI.clearPersonaBadges();
    COMPANION.UI.setWorkingTitle(currentBinding.name);
    COMPANION.API.registerSession();

    var stage = document.getElementById('portrait-stage');
    if (stage) COMPANION.Stage.init(stage);
    chamberBuilt = true;

    // Set the settings model select to current
    var els = COMPANION.UI.elems();
    if (els.settingsModel) els.settingsModel.value = COMPANION.API.getModel();

    COMPANION.UI.setInputEnabled(false);
    COMPANION.UI.addSystemMessage('The threshold opens. The matter is loaded.');

    // Staggered arrivals, then greeting
    var order = currentBinding.personas.slice();
    var stagger = order.length > 4 ? 520 : 760;
    order.forEach(function (p, index) {
      setTimeout(function () {
        activePersonas.push(p);
        COMPANION.Stage.summon(p);
        COMPANION.UI.addPersonaBadge(p.name, p.color, function (name) {
          releasePersona(name);
          COMPANION.UI.addSystemMessage(name + ' withdraws.');
          persist();
        });
        playSummonSFX();
        if (index === order.length - 1) {
          setTimeout(sendGreeting, 900);
        }
      }, index * stagger);
    });
  }


  function returnToWorkshop() {
    COMPANION.API.abort();
    isStreaming = false;
    COMPANION.UI.setStreaming(false);
    COMPANION.API.clearHistory();
    activePersonas = [];
    COMPANION.Stage.reset();
    COMPANION.UI.showScreen('workshop');
  }


  // ═══════════════════════════════════════════════════════════════
  //  RESUME A SAVED WORKING
  // ═══════════════════════════════════════════════════════════════

  function resumeSession(data) {
    if (!COMPANION.API.hasApiKey()) {
      var overlay = document.getElementById('binding-overlay');
      if (overlay) overlay.classList.remove('hidden');
      return;
    }

    hideResumeBanner();
    currentBinding = data.binding;
    activePersonas = (data.personas || []).slice();
    COMPANION.API.restoreHistory(data.history || []);

    COMPANION.UI.showScreen('chamber');
    COMPANION.UI.clearDialogue();
    COMPANION.UI.clearPersonaBadges();
    COMPANION.UI.setWorkingTitle(currentBinding.name);
    COMPANION.API.registerSession();

    var stage = document.getElementById('portrait-stage');
    if (stage) COMPANION.Stage.init(stage);
    chamberBuilt = true;

    var els = COMPANION.UI.elems();
    if (els.settingsModel) els.settingsModel.value = COMPANION.API.getModel();

    activePersonas.forEach(function (p) {
      COMPANION.Stage.summon(p);
      COMPANION.UI.addPersonaBadge(p.name, p.color, function (name) {
        releasePersona(name);
        COMPANION.UI.addSystemMessage(name + ' withdraws.');
        persist();
      });
    });

    (data.messages || []).forEach(function (m) {
      if (m.type === 'seeker') COMPANION.UI.addSeekerMessage(m.text);
      else if (m.type === 'persona') COMPANION.UI.addPersonaMessageStatic(m.name, m.color, m.html);
      else if (m.type === 'system') COMPANION.UI.addSystemMessage(m.text);
    });

    COMPANION.UI.addSystemMessage('The working resumes where it left off.');
    COMPANION.UI.setInputEnabled(true);
    COMPANION.UI.setStreaming(false);
    COMPANION.UI.updateHint(activePersonas.length);
    savedSession = null;
  }


  // ═══════════════════════════════════════════════════════════════
  //  GREETING
  // ═══════════════════════════════════════════════════════════════

  function sendGreeting() {
    var names = activePersonas.map(function (p) { return p.name; });
    var greeting;
    if (names.length === 1) {
      greeting = 'You have been summoned into this working. Speak first: introduce yourself in your own unmistakable voice, oriented to the matter placed before you and the seeker\'s intent. Be brief and vivid — a few sentences. Then invite the seeker to open the dialogue.';
    } else {
      greeting = 'The following minds have been summoned together into one working: ' + names.join(', ') + '. ' +
        'This is a symposium. Each of you, in turn, introduce yourself in your own voice — one or two sentences — oriented to the matter before you. Prefix each voice with **[Name]:**. ' +
        'Then, together, invite the seeker to open the dialogue. Be brief; the depth comes later.';
    }

    isStreaming = true;
    COMPANION.UI.setInputEnabled(false);
    COMPANION.UI.setStreaming(true);

    var displayName = names.length === 1 ? names[0] : currentBinding.name;
    var displayColor = names.length === 1 ? activePersonas[0].color : '#c9a54e';
    currentStreamMessage = COMPANION.UI.addPersonaMessage(displayName, displayColor);

    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(activePersonas, currentBinding);

    COMPANION.API.sendMessage(greeting, systemPrompt,
      function (chunk) { currentStreamMessage.update(chunk); },
      function () {
        isStreaming = false;
        currentStreamMessage.finish();
        currentStreamMessage = null;
        COMPANION.UI.setInputEnabled(true);
        COMPANION.UI.setStreaming(false);
        COMPANION.UI.updateHint(activePersonas.length);
        COMPANION.Stage.clearSpeaking();
        persist();
      },
      function (err) {
        isStreaming = false;
        if (currentStreamMessage) { currentStreamMessage.finish(); currentStreamMessage = null; }
        COMPANION.UI.addSystemMessage(mythicError(err));
        COMPANION.UI.setInputEnabled(true);
        COMPANION.UI.setStreaming(false);
        COMPANION.Stage.clearSpeaking();
      }
    );
  }


  // ═══════════════════════════════════════════════════════════════
  //  MESSAGE HANDLING
  // ═══════════════════════════════════════════════════════════════

  function handleSend() {
    if (isStreaming) return;
    var text = COMPANION.UI.getInputText();
    if (!text) return;

    COMPANION.UI.addSeekerMessage(text);
    COMPANION.UI.clearInput();
    lastUserText = text;

    var incantation = COMPANION.Protocol.parseIncantation(text);
    if (incantation) handleIncantation(incantation, text);
    else sendToAPI(text);
  }

  function handleIncantation(inc, fullText) {
    switch (inc.type) {
      case 'summon':
      case 'summon_add':
        summonPersona(inc.name, fullText);
        break;
      case 'release_one':
        releasePersona(inc.release);
        if (activePersonas.length > 0) {
          COMPANION.UI.addSystemMessage(inc.release + ' withdraws. ' +
            activePersonas.map(function (p) { return p.name; }).join(', ') +
            (activePersonas.length === 1 ? ' remains.' : ' remain.'));
        } else {
          COMPANION.UI.addSystemMessage('The working is empty. Summon a mind, or return to the Harness.');
        }
        COMPANION.UI.updateHint(activePersonas.length);
        COMPANION.UI.setInputEnabled(true);
        persist();
        break;
      case 'release_all':
        releaseAll();
        COMPANION.UI.addSystemMessage('The minds withdraw. The work remains.');
        COMPANION.UI.setInputEnabled(true);
        break;
    }
  }

  function summonPersona(name, contextText) {
    var resolved = COMPANION.Pantheon.resolve(name);
    var card = resolved
      ? { name: resolved.name, id: resolved.id, color: resolved.color, title: resolved.title, epithet: resolved.epithet, lens: resolved.lens }
      : { name: name, color: '#c9a54e' };

    var exists = activePersonas.some(function (p) { return p.name.toLowerCase() === card.name.toLowerCase(); });
    if (exists) {
      COMPANION.UI.addSystemMessage(card.name + ' is already present.');
      COMPANION.UI.setInputEnabled(true);
      return;
    }

    activePersonas.push(card);
    triggerSummonEffect();
    COMPANION.Stage.summon(card);
    COMPANION.UI.addPersonaBadge(card.name, card.color, function (n) {
      releasePersona(n);
      COMPANION.UI.addSystemMessage(n + ' withdraws.');
      persist();
    });
    COMPANION.UI.updateHint(activePersonas.length);
    COMPANION.UI.addSystemMessage('Summoning ' + card.name + '…');
    sendToAPI(contextText);
  }

  function releasePersona(name) {
    var lower = name.toLowerCase();
    var idx = -1;
    for (var i = 0; i < activePersonas.length; i++) {
      if (activePersonas[i].name.toLowerCase() === lower) { idx = i; break; }
    }
    if (idx === -1) {
      for (var j = 0; j < activePersonas.length; j++) {
        var pn = activePersonas[j].name.toLowerCase();
        if (pn.indexOf(lower) !== -1 || lower.indexOf(pn.split(' ').pop()) !== -1) { idx = j; break; }
      }
    }
    if (idx !== -1) {
      var p = activePersonas[idx];
      activePersonas.splice(idx, 1);
      COMPANION.Stage.release(p.name);
      COMPANION.UI.removePersonaBadge(p.name);
      COMPANION.UI.updateHint(activePersonas.length);
    }
  }

  function releaseAll() {
    activePersonas.forEach(function (p) { COMPANION.Stage.release(p.name); });
    activePersonas = [];
    COMPANION.UI.clearPersonaBadges();
    COMPANION.UI.updateHint(0);
    COMPANION.API.clearHistory();
  }


  // ═══════════════════════════════════════════════════════════════
  //  API
  // ═══════════════════════════════════════════════════════════════

  function sendToAPI(userText) {
    isStreaming = true;
    COMPANION.UI.setStreaming(true);

    var displayName, displayColor;
    if (activePersonas.length === 1) {
      displayName = activePersonas[0].name;
      displayColor = activePersonas[0].color;
    } else if (activePersonas.length === 0) {
      displayName = 'The Harness';
      displayColor = '#8b7355';
    } else {
      displayName = currentBinding ? currentBinding.name : 'The Symposium';
      displayColor = '#c9a54e';
    }

    currentStreamMessage = COMPANION.UI.addPersonaMessage(displayName, displayColor);
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(activePersonas, currentBinding);

    COMPANION.API.sendMessage(userText, systemPrompt,
      function (chunk) {
        currentStreamMessage.update(chunk);
        if (activePersonas.length === 1) COMPANION.Stage.setSpeaking(activePersonas[0].name, true);
      },
      function () {
        isStreaming = false;
        currentStreamMessage.finish();
        currentStreamMessage = null;
        COMPANION.UI.setInputEnabled(true);
        COMPANION.UI.setStreaming(false);
        COMPANION.Stage.clearSpeaking();
        persist();
      },
      function (err) {
        isStreaming = false;
        if (currentStreamMessage) { currentStreamMessage.finish(); currentStreamMessage = null; }
        COMPANION.UI.addSystemMessage(mythicError(err));
        COMPANION.UI.setInputEnabled(true);
        COMPANION.UI.setStreaming(false);
        // Give the seeker their words back so nothing is lost.
        if (lastUserText && !COMPANION.UI.getInputText()) COMPANION.UI.setInputText(lastUserText);
        COMPANION.Stage.clearSpeaking();
      }
    );
  }

  function mythicError(raw) {
    var m = (raw || '').toLowerCase();
    if (m.indexOf('rate') !== -1 || m.indexOf('429') !== -1)
      return 'The threshold is strained — too many voices at once. Wait a moment, then speak again.';
    if (m.indexOf('401') !== -1 || m.indexOf('auth') !== -1 || m.indexOf('key') !== -1)
      return 'The binding is not recognized. The seal has failed; the vessel cannot be reached.';
    if (m.indexOf('500') !== -1 || m.indexOf('server') !== -1)
      return 'The vessel has gone dark. The intelligence beyond the threshold is unreachable. Try again shortly.';
    if (m.indexOf('network') !== -1 || m.indexOf('fetch') !== -1 || m.indexOf('failed to reach') !== -1)
      return 'The passage to the void is severed. Check your connection, then try again.';
    if (m.indexOf('limit') !== -1 || m.indexOf('session') !== -1 || m.indexOf('expired') !== -1 || m.indexOf('settle') !== -1)
      return raw;
    return 'The threshold could not hold. (' + raw + ')';
  }

  function triggerSummonEffect() {
    var flash = document.createElement('div');
    flash.className = 'summon-flash';
    document.body.appendChild(flash);
    setTimeout(function () { flash.remove(); }, 600);
    playSummonSFX();
  }


  // ═══════════════════════════════════════════════════════════════
  //  PERSISTENCE
  // ═══════════════════════════════════════════════════════════════

  function persist() {
    try {
      var msgEls = document.querySelectorAll('#dialogue-messages .message');
      var dom = [];
      msgEls.forEach(function (elm) {
        if (elm.classList.contains('message-seeker')) {
          var b = elm.querySelector('.message-bubble');
          dom.push({ type: 'seeker', text: b ? b.textContent : '' });
        } else if (elm.classList.contains('message-persona')) {
          var h = elm.querySelector('.message-header');
          var body = elm.querySelector('.message-body');
          dom.push({ type: 'persona', name: h ? h.textContent : '', color: h ? h.style.color : '#c9a54e', html: body ? body.innerHTML : '' });
        } else if (elm.classList.contains('message-system')) {
          var s = elm.querySelector('.message-body');
          dom.push({ type: 'system', text: s ? s.textContent : '' });
        }
      });
      COMPANION.API.saveSession({ binding: currentBinding, personas: activePersonas, messages: dom });
    } catch (e) { /* not critical */ }
  }


  // ═══════════════════════════════════════════════════════════════
  //  EXPORT
  // ═══════════════════════════════════════════════════════════════

  // SHA-256 fingerprint of the compiled system prompt, so a transcript
  // can always be traced to the exact window that produced it.
  function promptFingerprint(systemPrompt, cb) {
    try {
      if (!(window.crypto && crypto.subtle && window.TextEncoder)) { cb(''); return; }
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(systemPrompt)).then(function (buf) {
        var hex = '';
        new Uint8Array(buf).forEach(function (b) { hex += b.toString(16).padStart(2, '0'); });
        cb(hex.slice(0, 16));
      }, function () { cb(''); });
    } catch (e) { cb(''); }
  }

  function exportTranscript() {
    var messages = document.querySelectorAll('#dialogue-messages .message');
    if (!messages.length) { COMPANION.UI.addSystemMessage('Nothing to export yet.'); return; }
    // The framework as instantiated: rite, grimoire, augmentation, and
    // every bound document — exactly the window the minds spoke from.
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(activePersonas, currentBinding);
    promptFingerprint(systemPrompt, function (fp) { exportTranscriptWith(fp, systemPrompt); });
  }

  function exportTranscriptWith(fingerprint, systemPrompt) {
    var messages = document.querySelectorAll('#dialogue-messages .message');
    var now = new Date();
    var dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    var title = 'The Harness';
    var groupName = currentBinding ? currentBinding.name : 'A Working';

    var parsed = [];
    messages.forEach(function (msg) {
      var entry = {};
      if (msg.classList.contains('message-seeker')) {
        entry.type = 'seeker'; entry.speaker = 'You';
        var b = msg.querySelector('.message-bubble'); entry.text = b ? b.textContent.trim() : '';
      } else if (msg.classList.contains('message-persona')) {
        entry.type = 'persona';
        var h = msg.querySelector('.message-header'); entry.speaker = h ? h.textContent.trim() : groupName;
        var body = msg.querySelector('.message-body'); entry.text = body ? body.textContent.trim() : '';
      } else if (msg.classList.contains('message-system')) {
        entry.type = 'system'; entry.speaker = 'System';
        var s = msg.querySelector('.message-body'); entry.text = s ? s.textContent.trim() : '';
      }
      if (entry.text) parsed.push(entry);
    });
    if (!parsed.length) { COMPANION.UI.addSystemMessage('Nothing to export yet.'); return; }

    var minds = currentBinding ? currentBinding.personas.map(function (p) { return p.name; }).join(', ') : '';

    var txt = [];
    txt.push('COMPANION Protocol — ' + title);
    txt.push('Working: ' + groupName);
    if (minds) txt.push('Minds: ' + minds);
    if (currentBinding && currentBinding.intent) txt.push('Intent: ' + currentBinding.intent);
    if (currentBinding && currentBinding.matter && currentBinding.matter.length) {
      txt.push('Matter: ' + currentBinding.matter.map(function (d) {
        var words = (d.text.match(/\S+/g) || []).length;
        return d.title + ' (' + words + ' words)';
      }).join('; '));
    }
    txt.push('Model: ' + COMPANION.API.getModel());
    if (fingerprint) txt.push('Prompt fingerprint: sha256:' + fingerprint + '…');
    txt.push('Exported: ' + dateStr + ' ' + timeStr);
    txt.push(''); txt.push('═'.repeat(60)); txt.push('');
    parsed.forEach(function (e) {
      if (e.type === 'system') txt.push('[' + e.text + ']');
      else { txt.push(e.speaker + ':'); txt.push(e.text); }
      txt.push('');
    });
    txt.push('═'.repeat(60)); txt.push('End of transcript.');

    if (systemPrompt) {
      txt.push('');
      txt.push('═'.repeat(60));
      txt.push('APPENDIX — THE PROMPT FRAMEWORK, AS INSTANTIATED');
      txt.push('The complete system prompt compiled for this working:');
      txt.push('the rite, the grimoire, the Harness augmentation, and');
      txt.push('every bound document, verbatim.');
      if (fingerprint) txt.push('SHA-256 (first 16): ' + fingerprint);
      txt.push('═'.repeat(60));
      txt.push('');
      txt.push(systemPrompt);
    }

    var htmlMessages = '';
    parsed.forEach(function (e) {
      if (e.type === 'system') {
        htmlMessages += '<div style="text-align:center;color:#8b7355;font-style:italic;padding:.75rem 0;font-size:.9rem;">' + escExport(e.text) + '</div>';
      } else if (e.type === 'seeker') {
        htmlMessages += '<div style="margin:1rem 0;padding:1rem 1.25rem;background:rgba(255,255,255,.04);border-radius:8px;">' +
          '<div style="color:#a0a0a0;font-weight:600;margin-bottom:.4rem;font-family:system-ui,sans-serif;font-size:.85rem;">You</div>' +
          '<div style="color:#e8e6e3;font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap;">' + escExport(e.text) + '</div></div>';
      } else {
        htmlMessages += '<div style="margin:1rem 0;padding:1rem 1.25rem;border-left:3px solid #c9a54e;">' +
          '<div style="color:#c9a54e;font-weight:600;margin-bottom:.4rem;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;">' + escExport(e.speaker) + '</div>' +
          '<div style="color:#e8e6e3;font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap;">' + escExport(e.text) + '</div></div>';
      }
    });

    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">' +
      '<title>Transcript — ' + escExport(groupName) + '</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap" rel="stylesheet">' +
      '</head><body style="margin:0;padding:0;background:#050403;color:#e8e6e3;font-family:system-ui,-apple-system,sans-serif;">' +
      '<div style="max-width:800px;margin:0 auto;padding:2rem 1.5rem;">' +
      '<div style="text-align:center;padding:2rem 0 1.5rem;border-bottom:1px solid rgba(201,165,78,.3);">' +
      '<div style="color:#c9a54e;font-family:\'Cormorant Garamond\',serif;font-size:.85rem;letter-spacing:.15em;text-transform:uppercase;margin-bottom:.5rem;">COMPANION Protocol · The Harness</div>' +
      '<h1 style="color:#c9a54e;font-family:\'Cormorant Garamond\',serif;font-size:2rem;font-weight:500;margin:0 0 .25rem;">' + escExport(groupName) + '</h1>' +
      (minds ? '<div style="color:#8b7355;font-family:\'Cormorant Garamond\',serif;font-size:1.05rem;font-style:italic;">' + escExport(minds) + '</div>' : '') +
      '<div style="color:#555;font-size:.8rem;margin-top:.75rem;">' + dateStr + ' ' + timeStr + '</div>' +
      '</div>' +
      '<div style="padding:1.5rem 0;">' + htmlMessages + '</div>' +
      (systemPrompt ?
        '<details style="margin:1rem 0 1.5rem;border:1px solid rgba(201,165,78,.3);border-radius:6px;padding:1rem 1.25rem;">' +
        '<summary style="cursor:pointer;color:#c9a54e;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;">The Prompt Framework, As Instantiated' +
        (fingerprint ? ' <span style="color:#555;font-size:.75rem;font-family:monospace;">sha256:' + fingerprint + '…</span>' : '') +
        '</summary>' +
        '<p style="color:#8b7355;font-size:.85rem;font-style:italic;margin:.6rem 0 0;">The complete system prompt compiled for this working — the rite, the grimoire, the Harness augmentation, and every bound document, verbatim.</p>' +
        '<pre style="white-space:pre-wrap;word-wrap:break-word;color:#a89f8d;font-family:\'IBM Plex Mono\',monospace;font-size:.78rem;line-height:1.55;margin-top:.8rem;">' + escExport(systemPrompt) + '</pre>' +
        '</details>' : '') +
      '<div style="text-align:center;padding:1.5rem 0;border-top:1px solid rgba(201,165,78,.3);color:#555;font-size:.8rem;">' +
      'COMPANION Protocol — The Harness — Exported ' + dateStr +
      '<br>Model: ' + escExport(COMPANION.API.getModel()) +
      (fingerprint ? ' · Prompt fingerprint: sha256:' + fingerprint + '…' : '') +
      '</div></div></body></html>';

    var slug = (groupName || 'working').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'working';
    downloadFile('harness_' + slug + '_' + dateStr + '.txt', txt.join('\n'), 'text/plain');
    setTimeout(function () {
      downloadFile('harness_' + slug + '_' + dateStr + '.html', html, 'text/html');
    }, 400);
    COMPANION.UI.addSystemMessage('Transcript exported (' + parsed.length + ' entries).');
  }

  function escExport(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  function downloadFile(filename, content, mime) {
    var blob = new Blob([content], { type: mime + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }


  return { init: init };

})();


document.addEventListener('DOMContentLoaded', function () {
  COMPANION.App.init();
});
