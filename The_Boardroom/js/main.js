/* ═══════════════════════════════════════════════════════════════
   THE BOARDROOM — Session Orchestrator
   Manages the cinematic intro, board packet submission,
   eight-phase meeting flow, decision record detection,
   and all session state.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.App = (function () {

  // ── Session State ──

  var state = {
    phase: 0,
    userTurnCount: 0,
    activePersonas: [],
    isStreaming: false,
    boardPacket: null,
    decisionRecord: null,
    introComplete: false,
    meetingStarted: false
  };

  var COUNCIL_COLORS = {
    'Steve Jobs':          '#c0392b',
    'Warren Buffett':      '#2c6e49',
    'Henry Ford':          '#5d4e37',
    'Andrew Carnegie':     '#708090',
    'Thomas Edison':       '#d4a030',
    'Walt Disney':         '#4a6fa5',
    'Theodore Roosevelt':  '#8b4513',
    'Abraham Lincoln':     '#2f4f4f'
  };

  var COUNCIL_NAMES = Object.keys(COUNCIL_COLORS);

  // Wikipedia articles for intro portraits
  var COUNCIL_ARTICLES = {
    'Steve Jobs':          'Steve_Jobs',
    'Warren Buffett':      'Warren_Buffett',
    'Henry Ford':          'Henry_Ford',
    'Andrew Carnegie':     'Andrew_Carnegie',
    'Thomas Edison':       'Thomas_Edison',
    'Walt Disney':         'Walt_Disney',
    'Theodore Roosevelt':  'Theodore_Roosevelt',
    'Abraham Lincoln':     'Abraham_Lincoln'
  };


  // ═══════════════════════════════════════════════════════════════
  //  CINEMATIC INTRO
  // ═══════════════════════════════════════════════════════════════

  function initCinematicIntro() {
    spawnEmbers();
    loadIntroPortraits();
    runTypewriter();
    initScrollReveals();
    initBoardPacketForm();
  }


  // ── Embers ──

  function spawnEmbers() {
    var field = document.getElementById('ember-field');
    if (!field) return;

    for (var i = 0; i < 30; i++) {
      var ember = document.createElement('div');
      ember.className = 'ember';
      ember.style.left = Math.random() * 100 + '%';
      ember.style.animationDuration = (8 + Math.random() * 14) + 's';
      ember.style.animationDelay = (Math.random() * 10) + 's';
      ember.style.width = (1 + Math.random() * 2) + 'px';
      ember.style.height = ember.style.width;
      field.appendChild(ember);
    }
  }


  // ── Intro Portrait Loading ──
  // Loads Wikipedia portraits into the cinematic intro portrait frames

  function loadIntroPortraits() {
    var portraitReveals = document.querySelectorAll('.portrait-reveal[data-member]');
    portraitReveals.forEach(function (reveal) {
      var memberName = reveal.getAttribute('data-member');
      var article = COUNCIL_ARTICLES[memberName];
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
          // Initials placeholder remains
        });
    });
  }


  // ── Typewriter ──

  function runTypewriter() {
    var lines = document.querySelectorAll('.typewriter-line');
    if (!lines.length) return;

    var lineIndex = 0;

    function typeLine() {
      if (lineIndex >= lines.length) {
        showScrollCue();
        return;
      }

      var line = lines[lineIndex];
      var text = line.getAttribute('data-text') || '';

      if (line.classList.contains('typewriter-pause')) {
        lineIndex++;
        setTimeout(typeLine, 600);
        return;
      }

      line.classList.add('typing');
      line.textContent = '';

      var charIndex = 0;
      var speed = 35;

      function typeChar() {
        if (charIndex < text.length) {
          line.textContent += text.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, speed + Math.random() * 20);
        } else {
          line.classList.remove('typing');
          line.classList.add('typed');
          lineIndex++;
          setTimeout(typeLine, 400);
        }
      }

      typeChar();
    }

    setTimeout(typeLine, 1200);
  }

  function showScrollCue() {
    var cue = document.querySelector('.scroll-cue');
    if (cue) cue.classList.add('visible');
  }


  // ── Scroll Reveals ──

  function initScrollReveals() {
    var revealElements = document.querySelectorAll('.reveal-line, .portrait-reveal, .reveal-group');
    if (!revealElements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }


  // ── Board Packet Form ──

  function initBoardPacketForm() {
    var submitBtn = document.getElementById('packet-submit');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function () {
      submitBoardPacket();
    });
  }

  function submitBoardPacket() {
    var UI = COMPANION.UI;
    var els = UI.elements();

    var question = els.packetQuestion ? els.packetQuestion.value.trim() : '';
    var context = els.packetContext ? els.packetContext.value.trim() : '';
    var constraints = els.packetConstraints ? els.packetConstraints.value.trim() : '';
    var options = els.packetOptions ? els.packetOptions.value.trim() : '';

    if (!question) {
      alert('Please state your decision question.');
      return;
    }

    state.boardPacket = {
      question: question,
      context: context,
      constraints: constraints,
      options: options
    };

    // Hide cinematic intro
    var intro = document.getElementById('cinematic-intro');
    if (intro) intro.classList.add('hidden');

    // Check API key
    if (COMPANION.API.hasApiKey()) {
      enterChamber();
    } else {
      UI.showScreen('config');
      initBinding();
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  BINDING (API Key)
  // ═══════════════════════════════════════════════════════════════

  function initBinding() {
    var UI = COMPANION.UI;
    var els = UI.elements();

    if (els.saveKeyBtn) {
      els.saveKeyBtn.addEventListener('click', function () {
        var key = els.apiKeyInput ? els.apiKeyInput.value.trim() : '';
        if (!key) return;
        COMPANION.API.setApiKey(key);
        enterChamber();
      });
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  THE CHAMBER
  // ═══════════════════════════════════════════════════════════════

  function enterChamber() {
    var UI = COMPANION.UI;

    COMPANION.API.registerSession();
    UI.showScreen('chamber');

    // Initialize hologram gallery
    var portraitStage = document.getElementById('portrait-stage');
    if (portraitStage && COMPANION.Hologram) {
      COMPANION.Hologram.init(portraitStage);
    }

    // Summon all 8 council members
    setTimeout(function () {
      summonCouncil();
    }, 500);

    // Wire input
    wireInput();

    // Wire settings
    wireSettings();

    // Begin Phase 1
    state.phase = 1;
    UI.updatePhase(1);
    UI.updateHint(1);

    // Send Board Packet to the Chair
    setTimeout(function () {
      beginMeeting();
    }, 2500);
  }

  function summonCouncil() {
    var UI = COMPANION.UI;
    var Hologram = COMPANION.Hologram;

    COUNCIL_NAMES.forEach(function (name, idx) {
      setTimeout(function () {
        if (Hologram) Hologram.summon(name);
        var color = COUNCIL_COLORS[name];
        UI.addPersonaBadge(name, color, function () {
          // Dismiss is not typical for Boardroom — all seats are permanent
        });
        state.activePersonas.push(name);
      }, idx * 300);
    });
  }


  // ── Input Wiring ──

  function wireInput() {
    var UI = COMPANION.UI;
    var els = UI.elements();

    if (els.sendBtn) {
      els.sendBtn.addEventListener('click', function () {
        handleUserMessage();
      });
    }

    if (els.userInput) {
      els.userInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserMessage();
        }
      });
    }
  }

  function wireSettings() {
    var UI = COMPANION.UI;
    var els = UI.elements();

    if (els.settingsToggle) {
      els.settingsToggle.addEventListener('click', function () { UI.toggleSettings(); });
    }
    if (els.closeSettings) {
      els.closeSettings.addEventListener('click', function () { UI.hideSettings(); });
    }
    if (els.settingsModel) {
      els.settingsModel.value = COMPANION.API.getModel();
      els.settingsModel.addEventListener('change', function () {
        COMPANION.API.setModel(els.settingsModel.value);
      });
    }
    if (els.changeKeyBtn) {
      els.changeKeyBtn.addEventListener('click', function () {
        COMPANION.API.clearApiKey();
        UI.showScreen('config');
      });
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  MEETING FLOW
  // ═══════════════════════════════════════════════════════════════

  function beginMeeting() {
    var UI = COMPANION.UI;

    // Show the Board Packet as a seeker message
    var packetText = 'BOARD PACKET\n\nDecision: ' + state.boardPacket.question;
    if (state.boardPacket.context) packetText += '\nContext: ' + state.boardPacket.context;
    if (state.boardPacket.constraints) packetText += '\nConstraints: ' + state.boardPacket.constraints;
    if (state.boardPacket.options) packetText += '\nOptions Considered: ' + state.boardPacket.options;

    UI.addSeekerMessage(packetText);
    UI.setInputEnabled(false);

    state.meetingStarted = true;

    // Send to AI — Phase 1: The Chair receives the Board Packet
    sendToBoard(packetText);
  }


  function handleUserMessage() {
    var UI = COMPANION.UI;
    var text = UI.getInputText();
    if (!text || state.isStreaming) return;

    if (state.phase === 8 && state.decisionRecord) {
      // Meeting is sealed — don't allow further input
      return;
    }

    UI.addSeekerMessage(text);
    UI.clearInput();
    state.userTurnCount++;

    sendToBoard(text);
  }


  function sendToBoard(userMessage) {
    var UI = COMPANION.UI;
    var Protocol = COMPANION.Protocol;

    state.isStreaming = true;
    UI.setInputEnabled(false);

    // Build system prompt for current phase
    var systemPrompt = Protocol.buildSystemPrompt(
      state.phase,
      state.userTurnCount,
      state.boardPacket
    );

    // Create persona message placeholder — The Boardroom speaks as collective
    var color = COUNCIL_COLORS['Steve Jobs']; // Chair color for header
    var msgHandle = UI.addPersonaMessage('The Boardroom', '#c9a227');

    // Track which persona is speaking for hologram highlighting
    var currentSpeaker = null;

    COMPANION.API.sendMessage(
      userMessage,
      systemPrompt,

      // onChunk
      function (chunk) {
        msgHandle.update(chunk);

        // Detect speaker changes for hologram highlighting
        var fullText = msgHandle.getText();
        var speakerMatch = fullText.match(/\*\*\[([^\]]+)\]:\*\*/g);
        if (speakerMatch) {
          var lastSpeaker = speakerMatch[speakerMatch.length - 1];
          var nameMatch = lastSpeaker.match(/\*\*\[([^\]]+)\]:\*\*/);
          if (nameMatch) {
            var newSpeaker = nameMatch[1];
            if (newSpeaker !== currentSpeaker) {
              if (COMPANION.Hologram) {
                COMPANION.Hologram.clearSpeaking();
                COMPANION.Hologram.setSpeaking(newSpeaker, true);
              }
              // Update message header color
              var personaData = COMPANION.Hologram ? COMPANION.Hologram.getPersonaData(newSpeaker) : null;
              if (personaData) {
                msgHandle.setHeader(newSpeaker, personaData.color);
              }
              currentSpeaker = newSpeaker;
            }
          }
        }
      },

      // onDone
      function (fullResponse) {
        msgHandle.finish();
        state.isStreaming = false;

        if (COMPANION.Hologram) {
          COMPANION.Hologram.clearSpeaking();
        }

        // Detect phase transitions in the response
        detectPhaseTransition(fullResponse);

        // Check for Decision Record (Phase 8)
        var decision = Protocol.parseDecisionRecord(fullResponse);
        if (decision) {
          handleDecisionRecord(decision);
          return;
        }

        // Auto-advance through phases if the AI marks transitions
        if (state.phase < 8) {
          // If we're in early phases, auto-send to continue the meeting
          if (shouldAutoAdvance()) {
            setTimeout(function () {
              autoAdvanceMeeting();
            }, 1500);
          } else {
            UI.setInputEnabled(true);
            UI.updateHint(state.phase, state.activePersonas.length);
          }
        }
      },

      // onError
      function (error) {
        state.isStreaming = false;
        UI.setInputEnabled(true);
        UI.addSystemMessage('Error: ' + error);
      }
    );
  }


  // ── Phase Detection ──

  function detectPhaseTransition(text) {
    var UI = COMPANION.UI;

    // Look for phase markers like "— Phase III:" or "Phase IV:"
    var phasePatterns = [
      { regex: /Phase\s+VIII|Phase\s+8|The\s+Seal/i, phase: 8 },
      { regex: /Phase\s+VII|Phase\s+7|Votes/i, phase: 7 },
      { regex: /Phase\s+VI|Phase\s+6|Motions/i, phase: 6 },
      { regex: /Phase\s+V[^I]|Phase\s+5|Cross.?Examination/i, phase: 5 },
      { regex: /Phase\s+IV|Phase\s+4|Proposals/i, phase: 4 },
      { regex: /Phase\s+III|Phase\s+3|Truth\s+Round/i, phase: 3 },
      { regex: /Phase\s+II[^I]|Phase\s+2|Convening/i, phase: 2 }
    ];

    var highestPhase = state.phase;
    for (var i = 0; i < phasePatterns.length; i++) {
      if (phasePatterns[i].regex.test(text) && phasePatterns[i].phase > highestPhase) {
        highestPhase = phasePatterns[i].phase;
      }
    }

    if (highestPhase > state.phase) {
      state.phase = highestPhase;
      UI.updatePhase(state.phase);
      UI.addSystemMessage('Phase transition: ' + getPhaseLabel(state.phase));
    }
  }

  function getPhaseLabel(phase) {
    var labels = {
      1: 'The Board Packet',
      2: 'The Convening',
      3: 'The Truth Round',
      4: 'Proposals',
      5: 'Cross-Examination',
      6: 'Motions',
      7: 'Votes',
      8: 'The Seal'
    };
    return labels[phase] || 'Unknown';
  }


  // ── Auto-Advance Logic ──

  function shouldAutoAdvance() {
    // Auto-advance through phases 2-4 (they don't need user input)
    // Phase 1: needs user confirmation (or auto after Chair speaks)
    // Phase 2-4: can auto-advance
    // Phase 5: needs user interaction (cross-examination)
    // Phase 6-7: can auto-advance
    // Phase 8: final

    if (state.phase >= 2 && state.phase <= 4) return true;
    if (state.phase === 6 || state.phase === 7) return true;
    return false;
  }

  function autoAdvanceMeeting() {
    if (state.isStreaming) return;

    // Advance the phase
    var nextPhase = state.phase + 1;
    if (nextPhase > 8) return;

    state.phase = nextPhase;
    COMPANION.UI.updatePhase(state.phase);

    // Send a continuation prompt
    var continuationMessage = 'Continue to Phase ' + nextPhase + ': ' + getPhaseLabel(nextPhase) + '.';

    COMPANION.UI.addSystemMessage('Advancing to Phase ' + nextPhase + '...');

    sendToBoard(continuationMessage);
  }


  // ── Decision Record ──

  function handleDecisionRecord(decision) {
    var UI = COMPANION.UI;

    state.phase = 8;
    state.decisionRecord = decision;
    UI.updatePhase(8);

    // Show decision card in chat
    UI.addDecisionCard(decision);

    // Disable input — meeting is sealed
    UI.setInputEnabled(false);
    UI.updateHint(8, state.activePersonas.length);

    UI.addSystemMessage('The Seal has been affixed. The decision is recorded.');
  }


  // ═══════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    // Initialize UI
    COMPANION.UI.init();

    // Check if we should skip intro (pre-configured key)
    var isPreConfigured = COMPANION.API.isPreConfigured();

    // Check for enter button (cinematic flow)
    var enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', function () {
        // Scroll past typewriter to the content
        var wound = document.getElementById('act-wound');
        if (wound) {
          wound.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Start cinematic
    initCinematicIntro();

    // If API key exists and board packet will be entered in cinematic,
    // the flow goes: cinematic → packet → chamber
    // The binding screen only appears if no key is configured
  }


  // ── Boot ──

  document.addEventListener('DOMContentLoaded', init);

  return {
    state: state,
    submitBoardPacket: submitBoardPacket
  };

})();
