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
  var liveJobs = [];          // Live USAJobs results
  var xmlLoaded = false;
  var userTurnCount = 0;
  var selectedGuide = null;   // The archetype the user chose
  var userMessages = [];      // Track user messages for search context

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

      COMPANION.API.setModel('claude-opus-4-6');
      var els = COMPANION.UI.elements();
      if (els.settingsModel) {
        els.settingsModel.value = 'claude-opus-4-6';
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

    on(els.exportBtn, 'click', function () {
      COMPANION.UI.hideSettings();
      exportTranscript();
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
    COMPANION.API.setModel('claude-opus-4-6');

    enterChamber();
  }


  // ═══════════════════════════════════════════════════════════════
  //  CHAMBER ENTRY
  // ═══════════════════════════════════════════════════════════════

  function enterChamber() {
    COMPANION.UI.showScreen('chamber');
    COMPANION.API.registerSession();

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

      // Try restoring a previous session first
      if (restoreSession()) {
        // Re-establish the selected guide's visual persona
        if (selectedGuide) {
          activePersonas.push({
            name: selectedGuide.name,
            color: selectedGuide.color
          });
          COMPANION.Hologram.summon(selectedGuide.name, selectedGuide.color);
          COMPANION.UI.addPersonaBadge(selectedGuide.name, selectedGuide.color, function (name) {
            releasePersona(name);
          });
          COMPANION.UI.updateHint(1, 1);
        }
        currentPhase = 1;
        COMPANION.UI.setInputEnabled(true);
      } else {
        COMPANION.UI.addSystemMessage(
          'National labor market database loaded. Live USAJobs integration active. The committee is ready.'
        );

        // Begin Phase 1: The Invocation
        setTimeout(function () {
          beginPhase1();
        }, 800);
      }
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

      // Trigger the golden flash activation effect
      enterBtn.classList.remove('summon-activated');
      // Force reflow so re-adding the class restarts the animation
      void enterBtn.offsetWidth;
      enterBtn.classList.add('summon-activated');
    }

    var guideNameEl = document.getElementById('summon-btn-guide-name');
    if (guideNameEl) {
      guideNameEl.textContent = name;
    }

    var guideMsgEl = document.getElementById('summons-guide-text');
    if (guideMsgEl) {
      guideMsgEl.textContent = name + ' is ready.';
    }

    // Auto-scroll to the summon button so the user sees it flash to life
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
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(personaNames, currentPhase, jobCorpus, userTurnCount, liveJobs);

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
        persistSession();
        COMPANION.Hologram.clearSpeaking();
      },

      function (errorMessage) {
        isStreaming = false;
        if (currentStreamMessage) {
          currentStreamMessage.finish();
          currentStreamMessage = null;
        }
        COMPANION.UI.addSystemMessage(mythicError(errorMessage));
        COMPANION.UI.setInputEnabled(true);
        COMPANION.Hologram.clearSpeaking();
      }
    );
  }


  // ── Mythic Error Translation ──

  function mythicError(rawMessage) {
    var lower = (rawMessage || '').toLowerCase();
    if (lower.indexOf('rate') !== -1 || lower.indexOf('429') !== -1) {
      return 'The threshold is strained. Too many voices have called at once. Wait a moment, then speak again.';
    }
    if (lower.indexOf('401') !== -1 || lower.indexOf('auth') !== -1 || lower.indexOf('key') !== -1) {
      return 'The binding has failed. The seal is not recognized. The vessel cannot be reached.';
    }
    if (lower.indexOf('500') !== -1 || lower.indexOf('server') !== -1) {
      return 'The vessel has gone dark. The intelligence beyond the threshold is unreachable. Try again shortly.';
    }
    if (lower.indexOf('network') !== -1 || lower.indexOf('fetch') !== -1 || lower.indexOf('failed') !== -1) {
      return 'The connection to the void has been severed. Check your passage to the network, then try again.';
    }
    if (lower.indexOf('timeout') !== -1 || lower.indexOf('abort') !== -1) {
      return 'The summoning has timed out. The minds beyond the threshold did not respond in time.';
    }
    if (lower.indexOf('limit') !== -1 || lower.indexOf('session') !== -1 || lower.indexOf('expired') !== -1) {
      return rawMessage;
    }
    return 'The threshold could not open. The vessel is unreachable. (' + rawMessage + ')';
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
    userMessages.push(text);

    // Check for phase transition from Invocation to Symposium
    // After 2-3 user turns in Phase 1, auto-transition
    if (currentPhase === 1 && userTurnCount >= 1) {
      transitionToPhase2();
      // Search USAJobs with the user's context, then send to API
      searchAndSend(text);
    } else if (currentPhase === 2) {
      // Refine USAJobs search with updated context
      searchAndSend(text);
    } else {
      sendToAPI(text);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  USAJOBS LIVE SEARCH
  // ═══════════════════════════════════════════════════════════════

  function searchAndSend(userText) {
    if (!COMPANION.USAJobs) {
      // USAJobs module not loaded — fall back to static corpus
      setTimeout(function () { sendToAPI(userText); }, currentPhase === 2 ? 2000 : 0);
      return;
    }

    var terms = COMPANION.USAJobs.extractSearchTerms(userText, userMessages);

    // Only search if we have meaningful terms
    if (!terms.keyword && !terms.locationName) {
      setTimeout(function () { sendToAPI(userText); }, currentPhase === 2 ? 2000 : 0);
      return;
    }

    COMPANION.UI.addSystemMessage('Searching USAJobs for live federal listings...');

    var searchParams = {};
    if (terms.keyword) searchParams.keyword = terms.keyword;
    if (terms.locationName) searchParams.locationName = terms.locationName;
    searchParams.resultsPerPage = 25;

    COMPANION.USAJobs.search(searchParams).then(function (result) {
      if (result.error) {
        console.warn('[Exchange] USAJobs search error:', result.error);
        COMPANION.UI.addSystemMessage('Live job search unavailable. Using reference corpus.');
      } else if (result.jobs.length > 0) {
        liveJobs = result.jobs;
        var msg = result.total + ' federal positions found';
        if (terms.locationName) msg += ' near ' + terms.locationName;
        msg += '. ' + result.jobs.length + ' loaded for the committee.';
        COMPANION.UI.addSystemMessage(msg);
      } else {
        COMPANION.UI.addSystemMessage('No federal positions matched. The committee will use the reference corpus.');
      }

      // Small delay to let system messages render
      setTimeout(function () { sendToAPI(userText); }, 800);

    }).catch(function (err) {
      console.error('[Exchange] USAJobs search failed:', err);
      COMPANION.UI.addSystemMessage('Live search unavailable. Using reference corpus.');
      setTimeout(function () { sendToAPI(userText); }, 800);
    });
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
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(personaNames, currentPhase, jobCorpus, userTurnCount, liveJobs);

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

        // Check for SEARCH marker (committee requests a refined search)
        checkForSearchRequest(fullText);

        // Check for THRESHOLD marker before re-enabling input
        var thresholdFound = checkForThreshold(fullText);
        if (!thresholdFound) {
          COMPANION.UI.setInputEnabled(true);
          persistSession();
        }
      },

      function (errorMessage) {
        isStreaming = false;
        if (currentStreamMessage) {
          currentStreamMessage.finish();
          currentStreamMessage = null;
        }
        COMPANION.UI.addSystemMessage(mythicError(errorMessage));
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

      // Try to match against live USAJobs results for real apply URL
      if (COMPANION.USAJobs && liveJobs.length > 0) {
        var liveMatch = COMPANION.USAJobs.findJobByTitle(jobData.title);
        if (liveMatch) {
          console.log('[Exchange] Matched live USAJobs listing:', liveMatch.title);
          // Enrich threshold data with live job info
          if (liveMatch.applyUrl) jobData.url = liveMatch.applyUrl;
          if (liveMatch.positionUrl) jobData.positionUrl = liveMatch.positionUrl;
          if (liveMatch.salaryRange) jobData.salaryRange = liveMatch.salaryRange;
          if (liveMatch.department) jobData.department = liveMatch.department;
          if (liveMatch.grade) jobData.grade = liveMatch.grade;
          if (liveMatch.closeDate) jobData.closeDate = liveMatch.closeDate;
          jobData.isUSAJobs = true;
        }
      }

      // Build URL if missing
      if (!jobData.url && jobData.title) {
        // Default to USAJobs search if we have live data context, otherwise Best Jobs Online
        if (liveJobs.length > 0) {
          var q = encodeURIComponent(jobData.title).replace(/%20/g, '+');
          var l = jobData.city ? encodeURIComponent(jobData.city).replace(/%20/g, '+') : '';
          jobData.url = 'https://www.usajobs.gov/Search/Results?k=' + q + (l ? '&l=' + l : '');
          jobData.isUSAJobs = true;
        } else {
          var q2 = encodeURIComponent(jobData.title).replace(/%20/g, '+');
          var l2 = jobData.zip || '';
          jobData.url = 'https://jobs.best-jobs-online.com/jobs?q=' + q2 + '&l=' + l2;
        }
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
  //  SEARCH REQUEST DETECTION
  // ═══════════════════════════════════════════════════════════════

  function checkForSearchRequest(responseText) {
    // Detect <!-- SEARCH: {"keyword": "...", "location": "..."} --> markers
    var m = responseText.match(/<!--\s*SEARCH:\s*(\{[\s\S]*?\})\s*-->/);
    if (!m) return;

    if (!COMPANION.USAJobs) return;

    try {
      var searchReq = JSON.parse(m[1]);
      console.log('[Exchange] Committee requested search:', searchReq);

      var params = {};
      if (searchReq.keyword) params.keyword = searchReq.keyword;
      if (searchReq.location) params.locationName = searchReq.location;
      if (searchReq.title) params.positionTitle = searchReq.title;
      params.resultsPerPage = 25;

      COMPANION.UI.addSystemMessage('The Scout is mapping new territory on USAJobs...');

      COMPANION.USAJobs.search(params).then(function (result) {
        if (result.jobs.length > 0) {
          liveJobs = result.jobs;
          COMPANION.UI.addSystemMessage(
            result.total + ' positions found. ' + result.jobs.length + ' loaded for the committee.'
          );
        } else {
          COMPANION.UI.addSystemMessage('No matching federal positions found for that search.');
        }
      }).catch(function (err) {
        console.error('[Exchange] Refinement search failed:', err);
      });

    } catch (e) {
      console.warn('[Exchange] Could not parse SEARCH marker:', e);
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


  // ═══════════════════════════════════════════════════════════════
  //  SESSION PERSISTENCE
  // ═══════════════════════════════════════════════════════════════

  function persistSession() {
    try {
      var msgEls = document.querySelectorAll('#dialogue-messages .message');
      var domMessages = [];
      msgEls.forEach(function (el) {
        if (el.classList.contains('message-seeker')) {
          var bubble = el.querySelector('.message-bubble');
          domMessages.push({ type: 'seeker', text: bubble ? bubble.textContent : '' });
        } else if (el.classList.contains('message-persona')) {
          var header = el.querySelector('.message-header');
          var body = el.querySelector('.message-body');
          domMessages.push({
            type: 'persona',
            name: header ? header.textContent : '',
            color: header ? header.style.color : '',
            html: body ? body.innerHTML : ''
          });
        } else if (el.classList.contains('message-system')) {
          var sysBody = el.querySelector('.message-body');
          domMessages.push({ type: 'system', text: sysBody ? sysBody.textContent : '' });
        }
      });
      COMPANION.API.saveSession(domMessages);
    } catch (e) { /* persistence not critical */ }
  }

  function restoreSession() {
    var session = COMPANION.API.loadSession();
    if (!session || !session.messages || session.messages.length === 0) return false;

    COMPANION.API.restoreHistory(session.history);

    session.messages.forEach(function (msg) {
      if (msg.type === 'seeker') {
        COMPANION.UI.addSeekerMessage(msg.text);
      } else if (msg.type === 'persona') {
        var streamMsg = COMPANION.UI.addPersonaMessage(msg.name, msg.color);
        var lastMsg = document.querySelector('#dialogue-messages .message:last-child .message-body');
        if (lastMsg) lastMsg.innerHTML = msg.html;
        streamMsg.finish();
      } else if (msg.type === 'system') {
        COMPANION.UI.addSystemMessage(msg.text);
      }
    });

    COMPANION.UI.addSystemMessage('Session restored. Your guide remembers.');
    return true;
  }


  // ═══════════════════════════════════════════════════════════════
  //  EXPORT TRANSCRIPT
  // ═══════════════════════════════════════════════════════════════

  function exportTranscript() {
    var messages = document.querySelectorAll('#dialogue-messages .message');
    if (!messages.length) {
      COMPANION.UI.addSystemMessage('No messages to export.');
      return;
    }

    var now = new Date();
    var dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    var timeStr = String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');
    var containerSlug = 'the_exchange';
    var containerTitle = 'The Exchange';
    var groupName = 'The Exchange \u2014 Dialogic Job Discovery';

    // ── Parse messages from DOM ──
    var parsed = [];
    messages.forEach(function (msg) {
      var entry = {};
      if (msg.classList.contains('message-seeker')) {
        entry.type = 'seeker';
        entry.speaker = 'You';
        var bubble = msg.querySelector('.message-bubble');
        entry.text = bubble ? bubble.textContent.trim() : '';
      } else if (msg.classList.contains('message-persona')) {
        entry.type = 'persona';
        var header = msg.querySelector('.message-header');
        entry.speaker = header ? header.textContent.trim() : 'The Exchange';
        var body = msg.querySelector('.message-body');
        entry.text = body ? body.textContent.trim() : '';
      } else if (msg.classList.contains('message-system')) {
        entry.type = 'system';
        entry.speaker = 'System';
        var sysBody = msg.querySelector('.message-body');
        entry.text = sysBody ? sysBody.textContent.trim() : '';
      }
      if (entry.text) parsed.push(entry);
    });

    if (!parsed.length) {
      COMPANION.UI.addSystemMessage('No messages to export.');
      return;
    }

    // ── Generate plain text ──
    var txtLines = [];
    txtLines.push('COMPANION Protocol \u2014 ' + containerTitle);
    txtLines.push(groupName);
    txtLines.push('Exported: ' + dateStr + ' ' + timeStr);
    txtLines.push('');
    txtLines.push('\u2550'.repeat(60));
    txtLines.push('');

    parsed.forEach(function (entry) {
      if (entry.type === 'system') {
        txtLines.push('[' + entry.text + ']');
      } else {
        txtLines.push(entry.speaker + ':');
        txtLines.push(entry.text);
      }
      txtLines.push('');
    });

    txtLines.push('\u2550'.repeat(60));
    txtLines.push('End of transcript.');

    var txtContent = txtLines.join('\n');

    // ── Generate styled HTML ──
    var htmlMessages = '';
    parsed.forEach(function (entry) {
      if (entry.type === 'system') {
        htmlMessages += '<div style="text-align:center;color:#8b7355;font-style:italic;padding:0.75rem 0;font-size:0.9rem;">' +
          escapeExportHtml(entry.text) + '</div>';
      } else if (entry.type === 'seeker') {
        htmlMessages += '<div style="margin:1rem 0;padding:1rem 1.25rem;background:rgba(255,255,255,0.04);border-radius:8px;">' +
          '<div style="color:#a0a0a0;font-weight:600;margin-bottom:0.4rem;font-family:system-ui,sans-serif;font-size:0.85rem;">You</div>' +
          '<div style="color:#e8e6e3;font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap;">' + escapeExportHtml(entry.text) + '</div></div>';
      } else {
        htmlMessages += '<div style="margin:1rem 0;padding:1rem 1.25rem;border-left:3px solid #c9a227;">' +
          '<div style="color:#c9a227;font-weight:600;margin-bottom:0.4rem;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;">' + escapeExportHtml(entry.speaker) + '</div>' +
          '<div style="color:#e8e6e3;font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap;">' + escapeExportHtml(entry.text) + '</div></div>';
      }
    });

    var htmlContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">' +
      '<title>Transcript \u2014 ' + containerTitle + '</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap" rel="stylesheet">' +
      '</head><body style="margin:0;padding:0;background:#030303;color:#e8e6e3;font-family:system-ui,-apple-system,sans-serif;">' +
      '<div style="max-width:800px;margin:0 auto;padding:2rem 1.5rem;">' +
      '<div style="text-align:center;padding:2rem 0 1.5rem;border-bottom:1px solid rgba(201,162,39,0.3);">' +
      '<div style="color:#c9a227;font-family:\'Cormorant Garamond\',serif;font-size:0.85rem;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.5rem;">COMPANION Protocol</div>' +
      '<h1 style="color:#c9a227;font-family:\'Cormorant Garamond\',serif;font-size:2rem;font-weight:500;margin:0 0 0.25rem;">' + containerTitle + '</h1>' +
      '<div style="color:#8b7355;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;font-style:italic;">' + groupName + '</div>' +
      '<div style="color:#555;font-size:0.8rem;margin-top:0.75rem;">' + dateStr + ' ' + timeStr + '</div>' +
      '</div>' +
      '<div style="padding:1.5rem 0;">' + htmlMessages + '</div>' +
      '<div style="text-align:center;padding:1.5rem 0;border-top:1px solid rgba(201,162,39,0.3);color:#555;font-size:0.8rem;">' +
      'COMPANION Protocol &mdash; ' + groupName + ' &mdash; Exported ' + dateStr +
      '</div></div></body></html>';

    // ── Trigger downloads ──
    downloadFile('companion_' + containerSlug + '_' + dateStr + '.txt', txtContent, 'text/plain');
    setTimeout(function () {
      downloadFile('companion_' + containerSlug + '_' + dateStr + '.html', htmlContent, 'text/html');
    }, 500);

    COMPANION.UI.addSystemMessage('Transcript exported (' + parsed.length + ' messages).');
  }

  function escapeExportHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function downloadFile(filename, content, mimeType) {
    var blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }


  return { init: init };

})();


// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', function () {
  COMPANION.App.init();
});
