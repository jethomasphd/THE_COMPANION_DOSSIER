/* ═══════════════════════════════════════════════════════════════
   COMMITTEE OF PATRIOTS — Museum-Quality Cinematic Gateway
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

    // Always Opus — Deep Deliberation
    COMPANION.API.setModel('claude-opus-4-20250514');

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

      // Auto-summon the full Committee with staggered arrivals
      setTimeout(function () {
        autoSummonCommittee();
      }, 600);
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
