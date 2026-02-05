/* ═══════════════════════════════════════════════════════════════
   COMMITTEE OF PATRIOTS — Cinematic Gateway Edition
   Orchestrates: cinematic intro, scroll reveals, typewriter,
   ambient audio, SFX, portrait loading, and chamber session.
   No voice synthesis — ambient/SFX only via Web Audio API.
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

      var els = COMPANION.UI.elements();
      if (els.settingsModel) {
        els.settingsModel.value = COMPANION.API.getModel();
      }
      if (els.modelSelect) {
        els.modelSelect.value = COMPANION.API.getModel();
      }

      COMPANION.UI.updateHint(0);

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
      { id: 'typewriter-line-1', text: 'In December 2025,', delay: 0 },
      { id: 'typewriter-line-2', text: 'four minds were summoned across the boundary of time.', delay: 800 },
      { id: 'typewriter-line-3', text: 'They were not asked.', delay: 2000 },
      { id: 'typewriter-line-4', text: 'They were commanded.', delay: 1200 }
    ];

    var cumulativeDelay = 0;

    lines.forEach(function (lineConfig) {
      cumulativeDelay += lineConfig.delay;
      var startDelay = cumulativeDelay;

      setTimeout(function () {
        typewriteLine(lineConfig.id, lineConfig.text, function () {
          // After last line, show scroll cue
          if (lineConfig.id === 'typewriter-line-4') {
            typewriterComplete = true;
            setTimeout(function () {
              var scrollCue = document.getElementById('scroll-cue');
              if (scrollCue) {
                scrollCue.classList.remove('hidden');
                scrollCue.classList.add('visible');
              }
            }, 1200);
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

    el.classList.add('visible');

    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);

    var charIndex = 0;

    function typeNext() {
      if (charIndex < text.length) {
        // Insert character before cursor
        el.insertBefore(document.createTextNode(text[charIndex]), cursor);
        charIndex++;

        // Vary typing speed slightly for realism
        var delay = 45 + Math.random() * 30;
        // Slower at punctuation
        if (text[charIndex - 1] === ',' || text[charIndex - 1] === '.') {
          delay += 150;
        }
        setTimeout(typeNext, delay);
      } else {
        // Done — remove cursor after brief pause
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
      // Fallback: reveal everything immediately
      var allRevealElements = document.querySelectorAll('.reveal-line, .reveal-group, .portrait-reveal, .ornament-cinematic, .doctrine-ornament, .summons-ornament');
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
      '.reveal-line, .reveal-group, .portrait-reveal, ' +
      '.ornament-cinematic, .doctrine-ornament, .summons-ornament'
    );
    revealTargets.forEach(function (el) {
      introObserver.observe(el);
    });
  }


  // ── Intro Portrait Loading ──
  // Loads Wikipedia portraits into the cinematic intro portrait frames

  function loadIntroPortraits() {
    var portraitReveals = document.querySelectorAll('.portrait-reveal');
    portraitReveals.forEach(function (reveal) {
      var patriotName = reveal.getAttribute('data-patriot');
      var article = PATRIOT_ARTICLES[patriotName];
      if (!article) return;

      var frame = reveal.querySelector('.portrait-frame-cinematic');
      if (!frame) return;

      // Fetch portrait from Wikipedia
      var url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(article);
      fetch(url)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (!data) return null;
          var src = null;
          if (data.thumbnail && data.thumbnail.source) {
            src = data.thumbnail.source;
          } else if (data.originalimage && data.originalimage.source) {
            src = data.originalimage.source;
          }
          if (src) {
            src = src.replace(/\/\d+px-/, '/400px-');
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
          img.src = imgUrl;
          frame.appendChild(img);
        })
        .catch(function () {
          // Portrait failed — the initial letter placeholder remains
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
  //  Deep hearthfire ambience — low drone with LFO modulation
  // ═══════════════════════════════════════════════════════════════

  function startAmbientAudio() {
    if (ambientAudioCtx) return;

    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      ambientAudioCtx = new AudioContext();

      // Low drone — like a fireplace
      var osc1 = ambientAudioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 55; // A1

      var osc2 = ambientAudioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 82.5; // E2

      // LFO — flickering fire modulation
      var lfo = ambientAudioCtx.createOscillator();
      lfo.frequency.value = 0.08;
      var lfoGain = ambientAudioCtx.createGain();
      lfoGain.gain.value = 1.2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      // Master gain
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

      // Fade in slowly
      ambientGain.gain.linearRampToValueAtTime(1, ambientAudioCtx.currentTime + 6);
    } catch (e) {
      // Audio not available
    }
  }


  // ── SFX: Summon Sound ──
  // Short resonant tone burst when a patriot is summoned

  function playSummonSFX() {
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      var ctx = ambientAudioCtx || new AudioContext();

      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 220; // A3

      var gain = ctx.createGain();
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);

      // Quick attack, slow decay
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
      // Hide cinematic intro
      var intro = document.getElementById('cinematic-intro');
      if (intro) intro.classList.add('hidden');

      // Start ambient if not already
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

    if (els.modelSelect) {
      COMPANION.API.setModel(els.modelSelect.value);
    }

    enterChamber();
  }


  // ═══════════════════════════════════════════════════════════════
  //  CHAMBER ENTRY
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
    }

    setTimeout(function () {
      COMPANION.UI.setInputEnabled(true);
    }, 500);
  }


  // ═══════════════════════════════════════════════════════════════
  //  SUMMON EFFECTS
  // ═══════════════════════════════════════════════════════════════

  function triggerSummonEffect() {
    // Screen shake
    var chamber = document.getElementById('chamber-screen');
    if (chamber) {
      chamber.classList.add('summoning');
      setTimeout(function () {
        chamber.classList.remove('summoning');
      }, 600);
    }

    // Golden flash
    var flash = document.createElement('div');
    flash.className = 'summon-flash';
    document.body.appendChild(flash);
    setTimeout(function () {
      flash.remove();
    }, 600);

    // SFX
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

    // Effects
    triggerSummonEffect();

    // Portrait activation
    COMPANION.Hologram.summon(fullName, color);

    // Badge
    COMPANION.UI.addPersonaBadge(fullName, color, function (dismissName) {
      releasePersona(dismissName);
      COMPANION.UI.addSystemMessage(dismissName + ' has withdrawn from the Committee.');
    });

    COMPANION.UI.updateHint(activePersonas.length);
    COMPANION.UI.addSystemMessage('Summoning ' + fullName + '...');

    // Send to API
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

      // onChunk
      function (chunk) {
        currentStreamMessage.update(chunk);

        if (activePersonas.length === 1) {
          COMPANION.Hologram.setSpeaking(activePersonas[0].name, true);
        }
      },

      // onDone
      function (fullText) {
        isStreaming = false;
        currentStreamMessage.finish();
        currentStreamMessage = null;
        COMPANION.UI.setInputEnabled(true);
        COMPANION.Hologram.clearSpeaking();
      },

      // onError
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
