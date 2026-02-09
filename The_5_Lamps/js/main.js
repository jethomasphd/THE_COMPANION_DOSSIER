/* ═══════════════════════════════════════════════════════════════
   THE FIVE LAMPS — Cinematic Gateway
   Orchestrates: cinematic intro, scroll reveals, typewriter,
   ambient audio, SFX, auto-summon sequence, and ward session.
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

  // Lamp colors — five physicians of the Inner Ward
  var LAMP_COLORS = {
    'Hippocrates': '#e8dcc8',
    'John Snow': '#4a8eb8',
    'Michael Marmot': '#5a9a6a',
    'Carl Jung': '#9b5a8a',
    'Paul Farmer': '#c9a227'
  };

  // Wikipedia articles for intro portraits
  var LAMP_ARTICLES = {
    'Hippocrates': 'Hippocrates',
    'John Snow': 'John_Snow',
    'Michael Marmot': 'Michael_Marmot',
    'Carl Jung': 'Carl_Jung',
    'Paul Farmer': 'Paul_Farmer'
  };

  // The order of auto-summoning
  var SUMMON_ORDER = [
    'Hippocrates',
    'John Snow',
    'Michael Marmot',
    'Carl Jung',
    'Paul Farmer'
  ];


  // ── Safe event binding ──
  function on(el, event, handler) {
    if (el) el.addEventListener(event, handler);
  }

  // ── Resolve lamp name ──
  function resolveLampName(name) {
    var lower = name.toLowerCase().trim();
    var lamps = {
      'hippocrates': 'Hippocrates',
      'snow': 'John Snow',
      'john snow': 'John Snow',
      'marmot': 'Michael Marmot',
      'michael marmot': 'Michael Marmot',
      'jung': 'Carl Jung',
      'carl jung': 'Carl Jung',
      'farmer': 'Paul Farmer',
      'paul farmer': 'Paul Farmer'
    };
    return lamps[lower] || name;
  }

  function getLampColor(name) {
    var fullName = resolveLampName(name);
    return LAMP_COLORS[fullName] || '#d4a843';
  }


  // ═══════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    try {
      COMPANION.UI.init();
      bindEvents();

      // Force Sonnet — accessible for students
      COMPANION.API.setModel('claude-sonnet-4-20250514');
      var els = COMPANION.UI.elements();
      if (els.settingsModel) {
        els.settingsModel.value = 'claude-sonnet-4-20250514';
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
      { id: 'typewriter-line-1', text: 'The corridor is dark. A student stands alone.', delay: 0 },
      { id: 'typewriter-line-2', text: 'Five lamps are lit.', delay: 1400 },
      { id: 'typewriter-line-3', text: 'Enter the Inner Ward.', delay: 2200 }
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
      var lampName = reveal.getAttribute('data-lamp');
      var article = LAMP_ARTICLES[lampName];
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

    // Enter button → enter binding or chamber
    on(els.enterBtn, 'click', function () {
      var intro = document.getElementById('cinematic-intro');
      if (intro) intro.classList.add('hidden');

      if (!ambientStarted) {
        startAmbientAudio();
        ambientStarted = true;
      }

      if (COMPANION.API.hasApiKey()) {
        enterChamber();
      } else {
        COMPANION.UI.showScreen('config');
      }
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

    // Always Sonnet — accessible for students
    COMPANION.API.setModel('claude-sonnet-4-20250514');

    enterChamber();
  }


  // ═══════════════════════════════════════════════════════════════
  //  CHAMBER ENTRY — with Auto-Summon Sequence
  // ═══════════════════════════════════════════════════════════════

  function enterChamber() {
    COMPANION.UI.showScreen('chamber');

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

      // Auto-summon the full Ward with staggered arrivals
      setTimeout(function () {
        autoSummonWard();
      }, 600);
    } else {
      COMPANION.UI.setInputEnabled(true);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  AUTO-SUMMON — Light all five lamps on entry
  // ═══════════════════════════════════════════════════════════════

  function autoSummonWard() {
    COMPANION.UI.addSystemMessage('The lamps are being lit... the matter is loaded.');

    var delay = 0;
    var stagger = 800; // ms between each summon

    SUMMON_ORDER.forEach(function (fullName, index) {
      delay = index * stagger;

      setTimeout(function () {
        var color = LAMP_COLORS[fullName];

        // Register in active personas
        activePersonas.push({
          name: fullName,
          color: color,
          category: 'physician'
        });

        // Activate portrait with arrival animation
        COMPANION.Hologram.summon(fullName, color);

        // Add badge
        COMPANION.UI.addPersonaBadge(fullName, color, function (dismissName) {
          releasePersona(dismissName);
          COMPANION.UI.addSystemMessage(dismissName + ' has withdrawn from the Inner Ward.');
        });

        // SFX
        playSummonSFX();

        COMPANION.UI.updateHint(activePersonas.length);

        // After last lamp is lit, send the greeting prompt
        if (index === SUMMON_ORDER.length - 1) {
          setTimeout(function () {
            COMPANION.UI.addSystemMessage('The Five Lamps are lit. The Inner Ward is open.');
            sendGreetingPrompt();
          }, 1200);
        }
      }, delay);
    });
  }


  // ═══════════════════════════════════════════════════════════════
  //  GREETING PROMPT — The Ward introduces itself
  // ═══════════════════════════════════════════════════════════════

  function sendGreetingPrompt() {
    var greetingText = 'The Five Lamps have been lit. You are the physicians of the Inner Ward. ' +
      'A medical student stands before you carrying the weight of a clinical dilemma ' +
      'they cannot resolve alone. ' +
      'Each of you: introduce yourself briefly — your name, what you illuminate, ' +
      'and why you are here. ' +
      'Then tell the student they may present any ethical dilemma from their clinical training. ' +
      'Be yourselves. Be direct. Be brief.';

    isStreaming = true;
    COMPANION.UI.setInputEnabled(false);

    var displayName = 'The Inner Ward';
    var displayColor = '#d4a843';

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
        if (activePersonas.length >= 5) {
          COMPANION.UI.addSystemMessage('All five lamps are already lit.');
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
          COMPANION.UI.addSystemMessage('The Inner Ward is dark. The lamps await.');
        }
        COMPANION.UI.setInputEnabled(true);
        break;

      case 'release_all':
        releaseAllPersonas();
        COMPANION.UI.addSystemMessage('The Inner Ward is closed. The work remains.');
        COMPANION.UI.setInputEnabled(true);
        break;
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  PERSONA SUMMONING
  // ═══════════════════════════════════════════════════════════════

  function summonPersona(name, contextText) {
    var fullName = resolveLampName(name);
    var color = getLampColor(fullName);
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
      COMPANION.UI.addSystemMessage(dismissName + ' has withdrawn from the Inner Ward.');
    });

    COMPANION.UI.updateHint(activePersonas.length);
    COMPANION.UI.addSystemMessage('Summoning ' + fullName + '...');

    sendToAPI(contextText);
  }


  // ═══════════════════════════════════════════════════════════════
  //  PERSONA RELEASE
  // ═══════════════════════════════════════════════════════════════

  function releasePersona(name) {
    var fullName = resolveLampName(name);
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

    var displayName = 'The Inner Ward';
    var displayColor = '#d4a843';

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


  return { init: init };

})();


// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', function () {
  COMPANION.App.init();
});
