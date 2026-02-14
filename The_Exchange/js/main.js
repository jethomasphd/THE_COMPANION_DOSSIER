/* ═══════════════════════════════════════════════════════════════
   THE EXCHANGE — Cinematic Gateway & Session Orchestrator
   Orchestrates: cinematic intro, scroll reveals, typewriter,
   ambient audio, job corpus, 3-phase dialogue, and threshold.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.App = (function () {

  // ── Session State ──
  var activePersonas = [];
  var isStreaming = false;
  var currentStreamMessage = null;
  var chamberInitialized = false;
  var currentPhase = 0;       // 0 = not started, 1 = invocation, 2 = symposium, 3 = threshold
  var jobCorpus = [];         // Parsed XML job listings
  var xmlLoaded = false;
  var userTurnCount = 0;
  var selectedGuide = null;   // The archetype the user chose

  // ── Audio State ──
  var ambientAudioCtx = null;
  var ambientGain = null;
  var ambientStarted = false;

  // ── Cinematic State ──
  var typewriterComplete = false;
  var introObserver = null;

  // Committee colors
  var COMMITTEE_COLORS = {
    'The Scout': '#1a8c8c',
    'The Coach': '#d4a030',
    'The Insider': '#7a8fa6',
    'The Mirror': '#8c3a3a'
  };

  // Phase 1: only Coach. Phase 2: add Scout + Insider.
  var PHASE_1_PERSONAS = ['The Coach'];
  var PHASE_2_PERSONAS = ['The Coach', 'The Scout', 'The Insider'];


  // ── Safe event binding ──
  function on(el, event, handler) {
    if (el) el.addEventListener(event, handler);
  }


  // ═══════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    try {
      COMPANION.UI.init();
      bindEvents();

      COMPANION.API.setModel('claude-sonnet-4-20250514');
      var els = COMPANION.UI.elements();
      if (els.settingsModel) {
        els.settingsModel.value = 'claude-sonnet-4-20250514';
      }

      startCinematicIntro();

    } catch (e) {
      console.error('COMPANION init error:', e);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  LOCAL JOB CORPUS
  // ═══════════════════════════════════════════════════════════════

  function loadJobCorpus() {
    if (COMPANION.Matter && typeof COMPANION.Matter.getJobCorpus === 'function') {
      return COMPANION.Matter.getJobCorpus();
    }
    return [];
  }


  // ═══════════════════════════════════════════════════════════════
  //  CINEMATIC INTRO
  // ═══════════════════════════════════════════════════════════════

  function startCinematicIntro() {
    createEmbers();

    setTimeout(function () {
      runTypewriterSequence();
    }, 1500);

    setupScrollReveals();
  }


  // ── Typewriter Sequence ──

  function runTypewriterSequence() {
    var lines = [
      { id: 'typewriter-line-1', text: 'You scroll. You apply. Silence.', delay: 0 },
      { id: 'typewriter-line-2', text: 'What if finding work meant being found?', delay: 2000 },
      { id: 'typewriter-line-3', text: 'Enter the Exchange.', delay: 2400 }
    ];

    var cumulativeDelay = 0;

    lines.forEach(function (lineConfig) {
      cumulativeDelay += lineConfig.delay;
      var startDelay = cumulativeDelay;

      setTimeout(function () {
        typewriteLine(lineConfig.id, lineConfig.text, function () {
          if (lineConfig.id === 'typewriter-line-3') {
            typewriterComplete = true;
            setTimeout(function () {
              var scrollCue = document.getElementById('scroll-cue');
              if (scrollCue) {
                scrollCue.classList.remove('hidden');
                scrollCue.classList.add('visible');
              }
            }, 800);
          }
        });
      }, startDelay);

      cumulativeDelay += lineConfig.text.length * 50 + 200;
    });
  }

  function typewriteLine(elementId, text, onComplete) {
    var el = document.getElementById(elementId);
    if (!el) return;

    el.classList.add('typing');

    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);

    var charIndex = 0;

    function typeNext() {
      if (charIndex < text.length) {
        el.insertBefore(document.createTextNode(text[charIndex]), cursor);
        charIndex++;

        var delay = 45 + Math.random() * 30;
        if (text[charIndex - 1] === ',' || text[charIndex - 1] === '.') {
          delay += 180;
        }
        setTimeout(typeNext, delay);
      } else {
        el.classList.remove('typing');
        el.classList.add('typed');
        setTimeout(function () {
          if (cursor.parentNode) cursor.remove();
          if (onComplete) onComplete();
        }, 500);
      }
    }

    typeNext();
  }


  // ── Scroll Reveal System ──

  function setupScrollReveals() {
    if (!('IntersectionObserver' in window)) {
      var allRevealElements = document.querySelectorAll('.reveal-line, .reveal-group, .portrait-reveal');
      allRevealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    introObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('revealed');

          var children = el.querySelectorAll('.reveal-line');
          children.forEach(function (child) {
            child.classList.add('revealed');
          });

          if (!ambientStarted) {
            startAmbientAudio();
            ambientStarted = true;
          }

          introObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    var revealTargets = document.querySelectorAll(
      '.reveal-line, .reveal-group, .portrait-reveal'
    );
    revealTargets.forEach(function (el) {
      introObserver.observe(el);
    });
  }


  // ── Floating Embers ──

  function createEmbers() {
    var field = document.getElementById('ember-field');
    if (!field) return;
    for (var i = 0; i < 30; i++) {
      var ember = document.createElement('div');
      ember.className = 'ember';
      ember.style.left = Math.random() * 100 + '%';
      ember.style.animationDelay = Math.random() * 10 + 's';
      ember.style.animationDuration = (8 + Math.random() * 8) + 's';
      ember.style.opacity = (0.3 + Math.random() * 0.5).toString();
      var size = 2 + Math.random() * 3;
      ember.style.width = size + 'px';
      ember.style.height = size + 'px';
      field.appendChild(ember);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  AMBIENT AUDIO
  // ═══════════════════════════════════════════════════════════════

  function startAmbientAudio() {
    if (ambientAudioCtx) return;

    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      ambientAudioCtx = new AudioContext();

      var osc1 = ambientAudioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 55;

      var osc2 = ambientAudioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 82.5;

      var lfo = ambientAudioCtx.createOscillator();
      lfo.frequency.value = 0.08;
      var lfoGain = ambientAudioCtx.createGain();
      lfoGain.gain.value = 1.2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      ambientGain = ambientAudioCtx.createGain();
      ambientGain.gain.value = 0;

      var gain1 = ambientAudioCtx.createGain();
      gain1.gain.value = 0.012;
      var gain2 = ambientAudioCtx.createGain();
      gain2.gain.value = 0.006;

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ambientGain);
      gain2.connect(ambientGain);
      ambientGain.connect(ambientAudioCtx.destination);

      osc1.start();
      osc2.start();
      lfo.start();

      ambientGain.gain.linearRampToValueAtTime(1, ambientAudioCtx.currentTime + 6);
    } catch (e) {
      // Audio not available
    }
  }


  function playSummonSFX() {
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      var ctx = ambientAudioCtx || new AudioContext();
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 220;

      var gain = ctx.createGain();
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      // SFX not available
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  EVENT BINDING
  // ═══════════════════════════════════════════════════════════════

  function bindEvents() {
    var els = COMPANION.UI.elements();

    // ── Guide Selection ──
    var guideGrid = document.getElementById('guide-select-grid');
    if (guideGrid) {
      var guideCards = guideGrid.querySelectorAll('.guide-card');
      guideCards.forEach(function (card) {
        card.addEventListener('click', function () {
          var guideName = card.getAttribute('data-guide');
          var guideColor = card.getAttribute('data-color');
          selectGuide(guideName, guideColor, guideCards, guideGrid);
        });
      });
    }

    on(els.enterBtn, 'click', function () {
      if (!selectedGuide) return;

      var intro = document.getElementById('cinematic-intro');
      if (intro) intro.classList.add('hidden');

      if (!ambientStarted) {
        startAmbientAudio();
        ambientStarted = true;
      }

      enterChamber();
    });

    on(els.saveKeyBtn, 'click', saveKeysAndEnter);

    on(els.apiKeyInput, 'keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveKeysAndEnter();
      }
    });

    on(els.sendBtn, 'click', handleSend);
    on(els.userInput, 'keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    on(els.settingsToggle, 'click', function () {
      COMPANION.UI.toggleSettings();
    });

    on(els.closeSettings, 'click', function () {
      COMPANION.UI.hideSettings();
    });

    on(els.settingsModel, 'change', function () {
      COMPANION.API.setModel(els.settingsModel.value);
    });

    on(els.changeKeyBtn, 'click', function () {
      COMPANION.UI.hideSettings();
      COMPANION.UI.showScreen('config');
    });

    on(els.releaseAllBtn, 'click', function () {
      releaseAllPersonas();
      COMPANION.UI.hideSettings();
    });
  }


  // ═══════════════════════════════════════════════════════════════
  //  SAVE KEYS & ENTER
  // ═══════════════════════════════════════════════════════════════

  function saveKeysAndEnter() {
    var els = COMPANION.UI.elements();
    var key = els.apiKeyInput ? els.apiKeyInput.value.trim() : '';
    if (!key) return;

    COMPANION.API.setApiKey(key);
    COMPANION.API.setModel('claude-sonnet-4-20250514');

    enterChamber();
  }


  // ═══════════════════════════════════════════════════════════════
  //  CHAMBER ENTRY
  // ═══════════════════════════════════════════════════════════════

  function enterChamber() {
    COMPANION.UI.showScreen('chamber');
    COMPANION.API.registerSession();

    // Hide "Change API Key" in settings when using pre-configured key
    if (COMPANION.API.isPreConfigured()) {
      var changeBtn = document.getElementById('change-key-btn');
      if (changeBtn) changeBtn.style.display = 'none';
    }

    if (!chamberInitialized) {
      try {
        var stage = document.getElementById('portrait-stage');
        if (stage) {
          COMPANION.Hologram.init(stage);
        }
        chamberInitialized = true;
      } catch (e) {
        console.error('Portrait stage init error:', e);
        chamberInitialized = true;
      }

      // Load job corpus from built-in database
      jobCorpus = loadJobCorpus();
      xmlLoaded = true;

      COMPANION.UI.addSystemMessage(
        'National labor market database loaded. The committee is ready.'
      );

      // Begin Phase 1: The Invocation
      setTimeout(function () {
        beginPhase1();
      }, 800);
    } else {
      COMPANION.UI.setInputEnabled(true);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  GUIDE SELECTION
  // ═══════════════════════════════════════════════════════════════

  function selectGuide(name, color, allCards, grid) {
    selectedGuide = { name: name, color: color };

    // Update card visual states
    allCards.forEach(function (c) {
      c.classList.remove('selected');
      c.style.removeProperty('--guide-color');
    });

    var chosen = grid.querySelector('[data-guide="' + name + '"]');
    if (chosen) {
      chosen.classList.add('selected');
      chosen.style.setProperty('--guide-color', color);
    }

    grid.classList.add('has-selection');

    // Enable the summon button and update text
    var enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
      enterBtn.disabled = false;
      enterBtn.classList.add('guide-chosen');
    }

    var guideNameEl = document.getElementById('summon-btn-guide-name');
    if (guideNameEl) {
      guideNameEl.textContent = name;
    }

    var guideMsgEl = document.getElementById('summons-guide-text');
    if (guideMsgEl) {
      guideMsgEl.textContent = name + ' is ready.';
    }

    // Scroll the summons section into view
    var summonsSection = document.getElementById('act-summons');
    if (summonsSection) {
      setTimeout(function () {
        summonsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }

    playSummonSFX();
  }


  // ═══════════════════════════════════════════════════════════════
  //  PHASE 1: THE INVOCATION
  // ═══════════════════════════════════════════════════════════════

  function beginPhase1() {
    currentPhase = 1;
    COMPANION.UI.updatePhase(1);

    // Summon the chosen guide (default to The Coach if none selected)
    var coachName = selectedGuide ? selectedGuide.name : 'The Coach';
    var coachColor = selectedGuide ? selectedGuide.color : COMMITTEE_COLORS['The Coach'];

    activePersonas.push({
      name: coachName,
      color: coachColor
    });

    COMPANION.Hologram.summon(coachName, coachColor);
    playSummonSFX();

    COMPANION.UI.addPersonaBadge(coachName, coachColor, function (name) {
      releasePersona(name);
    });

    COMPANION.UI.updateHint(1, 1);
    COMPANION.UI.addSystemMessage(coachName + ' has been summoned. The Invocation begins.');

    // Send greeting prompt
    setTimeout(function () {
      sendGreetingPrompt();
    }, 1200);
  }


  // ═══════════════════════════════════════════════════════════════
  //  PHASE 2: THE SYMPOSIUM
  // ═══════════════════════════════════════════════════════════════

  function transitionToPhase2() {
    currentPhase = 2;
    COMPANION.UI.updatePhase(2);

    // Add the personas that aren't already the selected guide
    var activeNames = activePersonas.map(function (p) { return p.name; });
    var phase2Full = ['The Coach', 'The Scout', 'The Insider'];
    var newPersonas = phase2Full.filter(function (name) {
      return activeNames.indexOf(name) === -1;
    });
    var stagger = 800;

    newPersonas.forEach(function (name, index) {
      setTimeout(function () {
        var color = COMMITTEE_COLORS[name];

        activePersonas.push({
          name: name,
          color: color
        });

        COMPANION.Hologram.summon(name, color);
        playSummonSFX();

        COMPANION.UI.addPersonaBadge(name, color, function (dismissName) {
          releasePersona(dismissName);
        });
      }, index * stagger);
    });

    setTimeout(function () {
      var joinedNames = newPersonas.join(' and ');
      COMPANION.UI.addSystemMessage(joinedNames + ' joined. The Symposium begins.');
      COMPANION.UI.updateHint(2, activePersonas.length);
    }, newPersonas.length * stagger + 400);
  }


  // ═══════════════════════════════════════════════════════════════
  //  PHASE 3: THE THRESHOLD
  // ═══════════════════════════════════════════════════════════════

  function transitionToPhase3(jobData) {
    console.log('[Exchange] Transitioning to Phase 3 with job:', jobData.title);
    COMPANION.UI.setInputEnabled(false);

    // Brief pause to let the final words breathe, then show the card
    setTimeout(function () {
      currentPhase = 3;
      COMPANION.UI.updatePhase(3);
      COMPANION.UI.updateHint(3, activePersonas.length);
      playSummonSFX();
      COMPANION.UI.addThresholdCard(jobData);
    }, 1200);
  }


  // ═══════════════════════════════════════════════════════════════
  //  GREETING PROMPT
  // ═══════════════════════════════════════════════════════════════

  function sendGreetingPrompt() {
    var guideName = selectedGuide ? selectedGuide.name : 'The Coach';

    var guideGreetings = {
      'The Coach': 'You are The Coach. Greet the seeker warmly but briefly. ' +
        'Find out where they are, what kind of work they do or want, and what matters most right now. ' +
        '2-3 sentences max. Natural, direct, no headers.',
      'The Scout': 'You are The Scout. Greet the seeker with precision and purpose. ' +
        'Ask where they are located and what field they work in or want to work in. ' +
        'You see the labor market like terrain — map their position first. 2-3 sentences max. No headers.',
      'The Insider': 'You are The Insider. Greet the seeker honestly and directly. ' +
        'Ask what work they have done that they were actually proud of, and what kind of work they are looking for. ' +
        'You know what jobs are really like from the inside. 2-3 sentences max. No headers.',
      'The Mirror': 'You are The Mirror. Greet the seeker with a direct challenge — not hostile, but honest. ' +
        'Ask them what they are looking for in their next role. You will assess whether they mean it. ' +
        '2-3 sentences max. No headers.'
    };

    var greetingText = guideGreetings[guideName] || guideGreetings['The Coach'];

    isStreaming = true;
    COMPANION.UI.setInputEnabled(false);

    var displayName = guideName;
    var displayColor = COMMITTEE_COLORS[displayName] || COMMITTEE_COLORS['The Coach'];

    currentStreamMessage = COMPANION.UI.addPersonaMessage(displayName, displayColor);

    var personaNames = activePersonas.map(function (p) { return p.name; });
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(personaNames, currentPhase, jobCorpus, userTurnCount);

    COMPANION.API.sendMessage(
      greetingText,
      systemPrompt,

      function (chunk) {
        currentStreamMessage.update(chunk);
      },

      function (fullText) {
        isStreaming = false;
        currentStreamMessage.finish();
        currentStreamMessage = null;
        COMPANION.UI.setInputEnabled(true);
        COMPANION.Hologram.clearSpeaking();
      },

      function (errorMessage) {
        isStreaming = false;
        if (currentStreamMessage) {
          currentStreamMessage.finish();
          currentStreamMessage = null;
        }
        COMPANION.UI.addSystemMessage('Error: ' + errorMessage);
        COMPANION.UI.setInputEnabled(true);
        COMPANION.Hologram.clearSpeaking();
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
    COMPANION.UI.setInputEnabled(false);

    userTurnCount++;

    // Check for phase transition from Invocation to Symposium
    // After 2-3 user turns in Phase 1, auto-transition
    if (currentPhase === 1 && userTurnCount >= 1) {
      transitionToPhase2();
      // Small delay to let UI update before sending
      setTimeout(function () {
        sendToAPI(text);
      }, 2000);
    } else {
      sendToAPI(text);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  API COMMUNICATION
  // ═══════════════════════════════════════════════════════════════

  function sendToAPI(userText) {
    isStreaming = true;

    var displayName = 'The Exchange';
    var displayColor = '#c9a227';

    if (currentPhase === 1 && activePersonas.length === 1) {
      displayName = activePersonas[0].name;
      displayColor = activePersonas[0].color;
    }

    currentStreamMessage = COMPANION.UI.addPersonaMessage(displayName, displayColor);

    var personaNames = activePersonas.map(function (p) { return p.name; });
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(personaNames, currentPhase, jobCorpus, userTurnCount);

    COMPANION.API.sendMessage(
      userText,
      systemPrompt,

      function (chunk) {
        currentStreamMessage.update(chunk);
      },

      function (fullText) {
        isStreaming = false;
        currentStreamMessage.finish();
        currentStreamMessage = null;
        COMPANION.Hologram.clearSpeaking();

        // Check for THRESHOLD marker before re-enabling input
        var thresholdFound = checkForThreshold(fullText);
        if (!thresholdFound) {
          COMPANION.UI.setInputEnabled(true);
        }
      },

      function (errorMessage) {
        isStreaming = false;
        if (currentStreamMessage) {
          currentStreamMessage.finish();
          currentStreamMessage = null;
        }
        COMPANION.UI.addSystemMessage('Error: ' + errorMessage);
        COMPANION.UI.setInputEnabled(true);
        COMPANION.Hologram.clearSpeaking();
      }
    );
  }


  // ═══════════════════════════════════════════════════════════════
  //  THRESHOLD DETECTION
  // ═══════════════════════════════════════════════════════════════

  function checkForThreshold(responseText) {
    console.log('[Exchange] Checking for threshold in response (' + responseText.length + ' chars)');

    var jsonStr = null;

    // Strategy 1: HTML comment <!-- THRESHOLD: {...} -->
    var m = responseText.match(/<!--\s*THRESHOLD:\s*(\{[\s\S]*?\})\s*-->/);
    if (m) { jsonStr = m[1]; console.log('[Exchange] Matched HTML comment format'); }

    // Strategy 2: bare THRESHOLD: {...}
    if (!jsonStr) {
      m = responseText.match(/THRESHOLD:\s*(\{[\s\S]*?\})/);
      if (m) { jsonStr = m[1]; console.log('[Exchange] Matched bare THRESHOLD format'); }
    }

    // Strategy 3: any JSON block with "title" and "company" keys near end of response
    if (!jsonStr) {
      var lastChunk = responseText.slice(-500);
      m = lastChunk.match(/(\{[^{}]*"title"\s*:\s*"[^"]+?"[^{}]*"company"\s*:\s*"[^"]+?"[^{}]*\})/);
      if (m) { jsonStr = m[1]; console.log('[Exchange] Matched JSON block fallback'); }
    }

    if (!jsonStr) {
      console.log('[Exchange] No threshold marker found');
      return false;
    }

    try {
      var jobData = JSON.parse(jsonStr);
      console.log('[Exchange] Parsed job data:', jobData);

      // Build URL if missing
      if (!jobData.url && jobData.title) {
        var q = encodeURIComponent(jobData.title).replace(/%20/g, '+');
        var l = jobData.zip || '';
        jobData.url = 'https://jobs.best-jobs-online.com/jobs?q=' + q + '&l=' + l;
      }

      if (jobData.title) {
        transitionToPhase3(jobData);
        return true;
      } else {
        console.warn('[Exchange] Job data missing title, skipping threshold');
        return false;
      }
    } catch (e) {
      console.warn('[Exchange] Could not parse threshold JSON:', e, '\nRaw:', jsonStr);
      return false;
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  PERSONA MANAGEMENT
  // ═══════════════════════════════════════════════════════════════

  function releasePersona(name) {
    var index = activePersonas.findIndex(function (p) {
      return p.name.toLowerCase() === name.toLowerCase();
    });

    if (index === -1) {
      index = activePersonas.findIndex(function (p) {
        return p.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
               name.toLowerCase().indexOf(p.name.toLowerCase()) !== -1;
      });
    }

    if (index !== -1) {
      var persona = activePersonas[index];
      activePersonas.splice(index, 1);
      COMPANION.Hologram.release(persona.name);
      COMPANION.UI.removePersonaBadge(persona.name);
      COMPANION.UI.updateHint(currentPhase, activePersonas.length);
    }
  }

  function releaseAllPersonas() {
    activePersonas.forEach(function (p) {
      COMPANION.Hologram.release(p.name);
    });
    activePersonas = [];
    COMPANION.UI.clearPersonaBadges();
    COMPANION.UI.updateHint(0, 0);
    COMPANION.API.clearHistory();
    currentPhase = 0;
    userTurnCount = 0;
    COMPANION.UI.hideThreshold();
    COMPANION.UI.addSystemMessage('The Exchange is closed. The work remains.');
  }


  // ── Summon Effects ──

  function triggerSummonEffect() {
    var chamber = document.getElementById('chamber-screen');
    if (chamber) {
      chamber.classList.add('summoning');
      setTimeout(function () {
        chamber.classList.remove('summoning');
      }, 600);
    }

    var flash = document.createElement('div');
    flash.className = 'summon-flash';
    document.body.appendChild(flash);
    setTimeout(function () {
      flash.remove();
    }, 600);

    playSummonSFX();
  }


  return { init: init };

})();


// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', function () {
  COMPANION.App.init();
});
