/* ═══════════════════════════════════════════════════════════════
   THE CHAIR — Cinematic Gateway
   Orchestrates: cinematic intro, scroll reveals, typewriter,
   ambient audio, SFX, auto-summon sequence, and chamber session.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.App = (function () {

  // ── Session State ──
  var activePersonas = [];
  var isStreaming = false;
  var currentStreamMessage = null;
  var chamberInitialized = false;

  // ── Audio State ──
  var ambientAudioCtx = null;
  var ambientGain = null;
  var ambientStarted = false;

  // ── Cinematic State ──
  var typewriterComplete = false;
  var introObserver = null;

  // Committee patriot colors
  var PATRIOT_COLORS = {
    'George Washington': '#c9a54e',
    'Alexander Hamilton': '#4a90d9',
    'Thomas Jefferson': '#c94e4e',
    'Benjamin Franklin': '#d4b85c'
  };

  // Wikipedia articles for intro portraits
  var PATRIOT_ARTICLES = {
    'George Washington': 'George_Washington',
    'Alexander Hamilton': 'Alexander_Hamilton',
    'Thomas Jefferson': 'Thomas_Jefferson',
    'Benjamin Franklin': 'Benjamin_Franklin'
  };

  // The order of auto-summoning
  var SUMMON_ORDER = [
    'George Washington',
    'Alexander Hamilton',
    'Thomas Jefferson',
    'Benjamin Franklin'
  ];


  // ── Safe event binding ──
  function on(el, event, handler) {
    if (el) el.addEventListener(event, handler);
  }

  // ── Resolve patriot name ──
  function resolvePatriotName(name) {
    var lower = name.toLowerCase().trim();
    var patriots = {
      'washington': 'George Washington',
      'george washington': 'George Washington',
      'hamilton': 'Alexander Hamilton',
      'alexander hamilton': 'Alexander Hamilton',
      'jefferson': 'Thomas Jefferson',
      'thomas jefferson': 'Thomas Jefferson',
      'franklin': 'Benjamin Franklin',
      'benjamin franklin': 'Benjamin Franklin',
      'ben franklin': 'Benjamin Franklin'
    };
    return patriots[lower] || name;
  }

  function getPatriotColor(name) {
    var fullName = resolvePatriotName(name);
    return PATRIOT_COLORS[fullName] || '#c9a54e';
  }


  // ═══════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    try {
      COMPANION.UI.init();
      bindEvents();

      // Force Opus — Deep Deliberation
      COMPANION.API.setModel('claude-opus-4-20250514');
      var els = COMPANION.UI.elements();
      if (els.settingsModel) {
        els.settingsModel.value = 'claude-opus-4-20250514';
      }

      // Start cinematic intro
      startCinematicIntro();

    } catch (e) {
      console.error('COMPANION init error:', e);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  CINEMATIC INTRO
  // ═══════════════════════════════════════════════════════════════

  function startCinematicIntro() {
    createEmbers();
    loadIntroPortraits();

    // Start typewriter after a brief delay
    setTimeout(function () {
      runTypewriterSequence();
    }, 1500);

    // Set up Intersection Observer for scroll reveals
    setupScrollReveals();
  }


  // ── Typewriter Sequence ──

  function runTypewriterSequence() {
    var lines = [
      { id: 'typewriter-line-1', text: 'The Republic is under duress.', delay: 0 },
      { id: 'typewriter-line-2', text: 'Four minds have been summoned to answer.', delay: 1400 },
      { id: 'typewriter-line-3', text: 'Scroll.', delay: 2200 }
    ];

    var cumulativeDelay = 0;

    lines.forEach(function (lineConfig) {
      cumulativeDelay += lineConfig.delay;
      var startDelay = cumulativeDelay;

      setTimeout(function () {
        typewriteLine(lineConfig.id, lineConfig.text, function () {
          // After last line, show scroll cue
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

      // Account for typing time (~50ms per char)
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


  // ── Scroll Reveal System (Intersection Observer) ──

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

          // If this is a group, reveal children too
          var children = el.querySelectorAll('.reveal-line');
          children.forEach(function (child) {
            child.classList.add('revealed');
          });

          // Start ambient audio on first scroll engagement
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

    // Observe all revealable elements
    var revealTargets = document.querySelectorAll(
      '.reveal-line, .reveal-group, .portrait-reveal'
    );
    revealTargets.forEach(function (el) {
      introObserver.observe(el);
    });
  }


  // ── Intro Portrait Loading ──
  // Loads Wikipedia portraits into the cinematic intro portrait frames (photorealistic)

  function loadIntroPortraits() {
    var portraitReveals = document.querySelectorAll('.portrait-reveal');
    portraitReveals.forEach(function (reveal) {
      var patriotName = reveal.getAttribute('data-patriot');
      var article = PATRIOT_ARTICLES[patriotName];
      if (!article) return;

      var frame = reveal.querySelector('.portrait-frame-cinematic');
      if (!frame) return;

      var url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(article);
      fetch(url)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (!data) return null;
          var src = null;
          if (data.originalimage && data.originalimage.source) {
            src = data.originalimage.source;
          } else if (data.thumbnail && data.thumbnail.source) {
            src = data.thumbnail.source;
          }
          if (src) {
            src = src.replace(/\/\d+px-/, '/600px-');
          }
          return src;
        })
        .then(function (imgUrl) {
          if (!imgUrl) return;
          var img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function () {
            img.classList.add('loaded');
          };
          img.onerror = function () {
            // Retry without CORS
            var img2 = new Image();
            img2.onload = function () {
              img2.classList.add('loaded');
            };
            img2.src = imgUrl;
            frame.appendChild(img2);
          };
          img.src = imgUrl;
          frame.appendChild(img);
        })
        .catch(function () {
          // Placeholder remains
        });
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
  //  AMBIENT AUDIO (Web Audio API)
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


  // ── SFX: Summon Sound ──

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

    // Summon button → enter binding or chamber
    on(els.enterBtn, 'click', function () {
      var intro = document.getElementById('cinematic-intro');
      if (intro) intro.classList.add('hidden');

      if (!ambientStarted) {
        startAmbientAudio();
        ambientStarted = true;
      }

      enterChamber();
    });

    // Config → Save key
    on(els.saveKeyBtn, 'click', saveKeysAndEnter);

    on(els.apiKeyInput, 'keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveKeysAndEnter();
      }
    });

    // Send message
    on(els.sendBtn, 'click', handleSend);
    on(els.userInput, 'keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Settings
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

    // Always Opus — Deep Deliberation
    COMPANION.API.setModel('claude-opus-4-20250514');

    enterChamber();
  }


  // ═══════════════════════════════════════════════════════════════
  //  CHAMBER ENTRY — with Auto-Summon Sequence
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

      // Check for existing session to restore
      var restored = restoreSession();
      if (restored) {
        // Re-summon portraits silently (visual only, no greeting)
        SUMMON_ORDER.forEach(function (fullName) {
          var color = PATRIOT_COLORS[fullName];
          activePersonas.push({ name: fullName, color: color, category: 'founder' });
          COMPANION.Hologram.summon(fullName, color);
          COMPANION.UI.addPersonaBadge(fullName, color, function (dismissName) {
            releasePersona(dismissName);
            COMPANION.UI.addSystemMessage(dismissName + ' has withdrawn from the Committee.');
          });
        });
        COMPANION.UI.updateHint(activePersonas.length);
        COMPANION.UI.setInputEnabled(true);
      } else {
        // Auto-summon the full Committee with staggered arrivals
        setTimeout(function () {
          autoSummonCommittee();
        }, 600);
      }
    } else {
      COMPANION.UI.setInputEnabled(true);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  AUTO-SUMMON — Summon all four patriots on entry
  // ═══════════════════════════════════════════════════════════════

  function autoSummonCommittee() {
    COMPANION.UI.addSystemMessage('The summoning has begun... the matter is loaded.');

    var delay = 0;
    var stagger = 800; // ms between each summon

    SUMMON_ORDER.forEach(function (fullName, index) {
      delay = index * stagger;

      setTimeout(function () {
        var color = PATRIOT_COLORS[fullName];

        // Register in active personas
        activePersonas.push({
          name: fullName,
          color: color,
          category: 'founder'
        });

        // Activate portrait with arrival animation
        COMPANION.Hologram.summon(fullName, color);

        // Add badge
        COMPANION.UI.addPersonaBadge(fullName, color, function (dismissName) {
          releasePersona(dismissName);
          COMPANION.UI.addSystemMessage(dismissName + ' has withdrawn from the Committee.');
        });

        // SFX
        playSummonSFX();

        COMPANION.UI.updateHint(activePersonas.length);

        // After last patriot arrives, send the greeting prompt
        if (index === SUMMON_ORDER.length - 1) {
          setTimeout(function () {
            COMPANION.UI.addSystemMessage('The Committee of Patriots is convened. The matter: the Epstein files.');
            sendGreetingPrompt();
          }, 1200);
        }
      }, delay);
    });
  }


  // ═══════════════════════════════════════════════════════════════
  //  GREETING PROMPT — Committee introduces themselves
  // ═══════════════════════════════════════════════════════════════

  function sendGreetingPrompt() {
    var greetingText = 'The full Committee of Patriots has been summoned. ' +
      'You are convened. A citizen stands before you who carries a heavy burden. ' +
      'The matter before this Committee is the Epstein files — three million pages of evidence ' +
      'revealing how the powerful moved freely through a kingdom built on the trafficking of children. ' +
      'Both parties. Both sides. Over a thousand victims. ' +
      'Each of you: introduce yourself briefly — your name, your role in the founding, ' +
      'and what it means to you that the Republic you built has allowed this architecture of impunity to stand. ' +
      'You have read the evidence dossier. You know the exhibits. You are the soul of this Republic, ' +
      'and you are here to help citizens sit with what has been revealed — with honesty, ' +
      'moral clarity, and the gravitas this demands. A chair has been set. ' +
      'Be yourselves. Be vivid. Be brief. Then tell the citizen they may address you on this matter freely.';

    isStreaming = true;
    COMPANION.UI.setInputEnabled(false);

    var displayName = 'The Committee';
    var displayColor = '#c9a54e';

    currentStreamMessage = COMPANION.UI.addPersonaMessage(displayName, displayColor);

    var personaNames = activePersonas.map(function (p) { return p.name; });
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(personaNames);

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
        persistSession();
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
  //  SUMMON EFFECTS
  // ═══════════════════════════════════════════════════════════════

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
  //  MESSAGE HANDLING
  // ═══════════════════════════════════════════════════════════════

  function handleSend() {
    if (isStreaming) return;

    var text = COMPANION.UI.getInputText();
    if (!text) return;

    COMPANION.UI.addSeekerMessage(text);
    COMPANION.UI.clearInput();
    COMPANION.UI.setInputEnabled(false);

    var incantation = COMPANION.Protocol.parseIncantation(text);

    if (incantation) {
      handleIncantation(incantation, text);
    } else {
      sendToAPI(text);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  INCANTATION HANDLING
  // ═══════════════════════════════════════════════════════════════

  function handleIncantation(incantation, fullText) {
    switch (incantation.type) {

      case 'summon':
        summonPersona(incantation.name, fullText);
        break;

      case 'summon_add':
        if (activePersonas.length >= 4) {
          COMPANION.UI.addSystemMessage('The full Committee is already convened.');
          COMPANION.UI.setInputEnabled(true);
          return;
        }
        summonPersona(incantation.name, fullText);
        break;

      case 'release_one':
        releasePersona(incantation.release);
        if (activePersonas.length > 0) {
          COMPANION.UI.addSystemMessage(
            incantation.release + ' has withdrawn. ' +
            activePersonas.map(function (p) { return p.name; }).join(', ') +
            (activePersonas.length === 1 ? ' remains.' : ' remain.')
          );
        } else {
          COMPANION.UI.addSystemMessage('The Committee has adjourned. The threshold awaits.');
        }
        COMPANION.UI.setInputEnabled(true);
        break;

      case 'release_all':
        releaseAllPersonas();
        COMPANION.UI.addSystemMessage('The Committee has adjourned. The work remains.');
        COMPANION.UI.setInputEnabled(true);
        break;
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  PERSONA SUMMONING
  // ═══════════════════════════════════════════════════════════════

  function summonPersona(name, contextText) {
    var fullName = resolvePatriotName(name);
    var color = getPatriotColor(fullName);
    var catInfo = COMPANION.Protocol.getPersonaCategory(name);

    var existing = activePersonas.find(function (p) {
      return p.name.toLowerCase() === fullName.toLowerCase();
    });
    if (existing) {
      COMPANION.UI.addSystemMessage(fullName + ' is already present.');
      COMPANION.UI.setInputEnabled(true);
      return;
    }

    var persona = {
      name: fullName,
      color: color,
      category: catInfo.category
    };
    activePersonas.push(persona);

    triggerSummonEffect();
    COMPANION.Hologram.summon(fullName, color);

    COMPANION.UI.addPersonaBadge(fullName, color, function (dismissName) {
      releasePersona(dismissName);
      COMPANION.UI.addSystemMessage(dismissName + ' has withdrawn from the Committee.');
    });

    COMPANION.UI.updateHint(activePersonas.length);
    COMPANION.UI.addSystemMessage('Summoning ' + fullName + '...');

    sendToAPI(contextText);
  }


  // ═══════════════════════════════════════════════════════════════
  //  PERSONA RELEASE
  // ═══════════════════════════════════════════════════════════════

  function releasePersona(name) {
    var fullName = resolvePatriotName(name);
    var index = activePersonas.findIndex(function (p) {
      return p.name.toLowerCase() === fullName.toLowerCase();
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
      COMPANION.UI.updateHint(activePersonas.length);
    }
  }

  function releaseAllPersonas() {
    activePersonas.forEach(function (p) {
      COMPANION.Hologram.release(p.name);
    });
    activePersonas = [];
    COMPANION.UI.clearPersonaBadges();
    COMPANION.UI.updateHint(0);
    COMPANION.API.clearHistory();
  }


  // ═══════════════════════════════════════════════════════════════
  //  API COMMUNICATION
  // ═══════════════════════════════════════════════════════════════

  function sendToAPI(userText) {
    isStreaming = true;

    var displayName = 'The Committee';
    var displayColor = '#c9a54e';

    if (activePersonas.length === 1) {
      displayName = activePersonas[0].name;
      displayColor = activePersonas[0].color;
    }

    currentStreamMessage = COMPANION.UI.addPersonaMessage(displayName, displayColor);

    var personaNames = activePersonas.map(function (p) { return p.name; });
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(personaNames);

    COMPANION.API.sendMessage(
      userText,
      systemPrompt,

      function (chunk) {
        currentStreamMessage.update(chunk);

        if (activePersonas.length === 1) {
          COMPANION.Hologram.setSpeaking(activePersonas[0].name, true);
        }
      },

      function (fullText) {
        isStreaming = false;
        currentStreamMessage.finish();
        currentStreamMessage = null;
        COMPANION.UI.setInputEnabled(true);
        COMPANION.Hologram.clearSpeaking();
        persistSession();
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
            name: header ? header.textContent : 'The Committee',
            color: header ? header.style.color : '#c9a54e',
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

    // Restore API conversation history
    COMPANION.API.restoreHistory(session.history);

    // Rebuild DOM messages
    session.messages.forEach(function (msg) {
      if (msg.type === 'seeker') {
        COMPANION.UI.addSeekerMessage(msg.text);
      } else if (msg.type === 'persona') {
        var streamMsg = COMPANION.UI.addPersonaMessage(msg.name, msg.color);
        // Directly set the innerHTML for the restored message
        var lastMsg = document.querySelector('#dialogue-messages .message:last-child .message-body');
        if (lastMsg) lastMsg.innerHTML = msg.html;
        streamMsg.finish();
      } else if (msg.type === 'system') {
        COMPANION.UI.addSystemMessage(msg.text);
      }
    });

    COMPANION.UI.addSystemMessage('Session restored. The Committee remembers.');
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
    var containerSlug = 'the_chair';
    var containerTitle = 'The Chair';
    var groupName = 'The Committee of Patriots';

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
        entry.speaker = header ? header.textContent.trim() : 'The Committee';
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
    txtLines.push('COMPANION Protocol — ' + containerTitle);
    txtLines.push(groupName);
    txtLines.push('Exported: ' + dateStr + ' ' + timeStr);
    txtLines.push('');
    txtLines.push('═'.repeat(60));
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

    txtLines.push('═'.repeat(60));
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
      '<title>Transcript — ' + containerTitle + '</title>' +
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
