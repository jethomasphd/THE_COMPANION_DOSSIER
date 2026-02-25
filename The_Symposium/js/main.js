/* ═══════════════════════════════════════════════════════════════
   THE SYMPOSIUM — Session Orchestrator
   Manages the cinematic intro, inquiry submission,
   eight-phase meeting flow, lesson record detection,
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
    inquiry: null,
    lessonRecord: null,
    introComplete: false,
    meetingStarted: false
  };

  var COUNCIL_COLORS = {
    'Socrates':          '#C0785A',
    'Maria Montessori':  '#4A8C5C',
    'John Dewey':        '#5A7D9A',
    'Jean Piaget':       '#8A6AAF',
    'Horace Mann':       '#3A6B9F',
    'Ada Lovelace':      '#B05080',
    'Paulo Freire':      '#CC6B3A',
    'Lev Vygotsky':      '#3A8B8B'
  };

  var COUNCIL_NAMES = Object.keys(COUNCIL_COLORS);

  // Wikipedia articles for intro portraits
  var COUNCIL_ARTICLES = {
    'Socrates':          'Socrates',
    'Maria Montessori':  'Maria_Montessori',
    'John Dewey':        'John_Dewey',
    'Jean Piaget':       'Jean_Piaget',
    'Horace Mann':       'Horace_Mann',
    'Ada Lovelace':      'Ada_Lovelace',
    'Paulo Freire':      'Paulo_Freire',
    'Lev Vygotsky':      'Lev_Vygotsky'
  };


  // ═══════════════════════════════════════════════════════════════
  //  CINEMATIC INTRO
  // ═══════════════════════════════════════════════════════════════

  function initCinematicIntro() {
    spawnChalkDust();
    loadIntroPortraits();
    runTypewriter();
    initScrollReveals();
    initInquiryForm();
  }


  // ── Chalk Dust Particles ──

  function spawnChalkDust() {
    var field = document.getElementById('ember-field');
    if (!field) return;

    for (var i = 0; i < 40; i++) {
      var mote = document.createElement('div');
      mote.className = 'ember';
      mote.style.left = Math.random() * 100 + '%';
      mote.style.animationDuration = (10 + Math.random() * 18) + 's';
      mote.style.animationDelay = (Math.random() * 12) + 's';
      mote.style.width = (1 + Math.random() * 1.5) + 'px';
      mote.style.height = mote.style.width;
      field.appendChild(mote);
    }
  }


  // ── Intro Portrait Loading ──

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


  // ── Inquiry Form ──

  function initInquiryForm() {
    var submitBtn = document.getElementById('packet-submit');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function () {
      submitInquiry();
    });
  }

  function submitInquiry() {
    var UI = COMPANION.UI;
    var els = UI.elements();

    var challenge = els.packetChallenge ? els.packetChallenge.value.trim() : '';
    var classroom = els.packetClassroom ? els.packetClassroom.value.trim() : '';
    var constraints = els.packetConstraints ? els.packetConstraints.value.trim() : '';
    var tried = els.packetTried ? els.packetTried.value.trim() : '';

    if (!challenge) {
      alert('Please describe the challenge you are facing.');
      return;
    }

    state.inquiry = {
      challenge: challenge,
      classroom: classroom,
      constraints: constraints,
      tried: tried
    };

    // Hide cinematic intro
    var intro = document.getElementById('cinematic-intro');
    if (intro) intro.classList.add('hidden');

    enterChamber();
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

    // Wire input
    wireInput();

    // Wire settings
    wireSettings();

    // Try restoring a previous session first
    if (restoreSession()) {
      // Re-establish visual personas without re-summoning
      COUNCIL_NAMES.forEach(function (name, idx) {
        setTimeout(function () {
          if (COMPANION.Hologram) COMPANION.Hologram.summon(name);
          var color = COUNCIL_COLORS[name];
          UI.addPersonaBadge(name, color, function () {});
          state.activePersonas.push(name);
        }, idx * 300);
      });
      state.phase = 1;
      UI.updatePhase(1);
      UI.updateHint(1);
      UI.setInputEnabled(true);
    } else {
      // Summon all 8 council members
      setTimeout(function () {
        summonCouncil();
      }, 500);

      // Begin Phase 1
      state.phase = 1;
      UI.updatePhase(1);
      UI.updateHint(1);

      // Send Inquiry to the Chair
      setTimeout(function () {
        beginMeeting();
      }, 2500);
    }
  }

  function summonCouncil() {
    var UI = COMPANION.UI;
    var Hologram = COMPANION.Hologram;

    COUNCIL_NAMES.forEach(function (name, idx) {
      setTimeout(function () {
        if (Hologram) Hologram.summon(name);
        var color = COUNCIL_COLORS[name];
        UI.addPersonaBadge(name, color, function () {
          // Dismiss is not typical for Symposium — all seats are permanent
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
    if (els.exportBtn) {
      els.exportBtn.addEventListener('click', function () {
        UI.hideSettings();
        exportTranscript();
      });
    }
  }


  // ── Mythic Error Translation ──

  function mythicError(rawMessage) {
    var lower = (rawMessage || '').toLowerCase();
    if (lower.indexOf('rate') !== -1 || lower.indexOf('429') !== -1) {
      return 'The chamber grows quiet. Too many voices have spoken at once. Wait a moment, then try again.';
    }
    if (lower.indexOf('401') !== -1 || lower.indexOf('auth') !== -1 || lower.indexOf('key') !== -1) {
      return 'The binding has failed. The seal is not recognized. The vessel cannot be reached.';
    }
    if (lower.indexOf('500') !== -1 || lower.indexOf('server') !== -1) {
      return 'The vessel has gone dark. The minds beyond the threshold are unreachable. Try again shortly.';
    }
    if (lower.indexOf('network') !== -1 || lower.indexOf('fetch') !== -1 || lower.indexOf('failed') !== -1) {
      return 'The connection to the Symposium has been severed. Check your passage to the network, then try again.';
    }
    if (lower.indexOf('timeout') !== -1 || lower.indexOf('abort') !== -1) {
      return 'The summoning has timed out. The sages did not respond in time.';
    }
    if (lower.indexOf('limit') !== -1 || lower.indexOf('session') !== -1 || lower.indexOf('expired') !== -1) {
      return rawMessage;
    }
    return 'The threshold could not open. The vessel is unreachable. (' + rawMessage + ')';
  }


  // ═══════════════════════════════════════════════════════════════
  //  MEETING FLOW
  // ═══════════════════════════════════════════════════════════════

  function beginMeeting() {
    var UI = COMPANION.UI;

    // Show the Inquiry as a seeker message
    var inquiryText = 'THE INQUIRY\n\nChallenge: ' + state.inquiry.challenge;
    if (state.inquiry.classroom) inquiryText += '\nClassroom: ' + state.inquiry.classroom;
    if (state.inquiry.constraints) inquiryText += '\nConstraints: ' + state.inquiry.constraints;
    if (state.inquiry.tried) inquiryText += '\nWhat I\'ve Tried: ' + state.inquiry.tried;

    UI.addSeekerMessage(inquiryText);
    UI.setInputEnabled(false);

    state.meetingStarted = true;

    // Send to AI — Phase 1: Socrates receives the Inquiry
    sendToSymposium(inquiryText);
  }


  function handleUserMessage() {
    var UI = COMPANION.UI;
    var text = UI.getInputText();
    if (!text || state.isStreaming) return;

    if (state.phase === 8 && state.lessonRecord) {
      // Meeting is sealed — don't allow further input
      return;
    }

    UI.addSeekerMessage(text);
    UI.clearInput();
    state.userTurnCount++;

    sendToSymposium(text);
  }


  function sendToSymposium(userMessage) {
    var UI = COMPANION.UI;
    var Protocol = COMPANION.Protocol;

    state.isStreaming = true;
    UI.setInputEnabled(false);

    // Build system prompt for current phase
    var systemPrompt = Protocol.buildSystemPrompt(
      state.phase,
      state.userTurnCount,
      state.inquiry
    );

    // Create persona message placeholder — The Symposium speaks as collective
    var msgHandle = UI.addPersonaMessage('The Symposium', '#C0785A');

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

        // Check for Lesson Record (Phase 8)
        var lesson = Protocol.parseLessonRecord(fullResponse);
        if (lesson) {
          handleLessonRecord(lesson);
          return;
        }

        // Auto-advance through phases if the AI marks transitions
        if (state.phase < 8) {
          if (shouldAutoAdvance()) {
            setTimeout(function () {
              autoAdvanceMeeting();
            }, 1500);
          } else {
            UI.setInputEnabled(true);
            persistSession();
            UI.updateHint(state.phase, state.activePersonas.length);
          }
        }
      },

      // onError
      function (error) {
        state.isStreaming = false;
        UI.setInputEnabled(true);
        UI.addSystemMessage(mythicError(error));
      }
    );
  }


  // ── Phase Detection ──

  function detectPhaseTransition(text) {
    var UI = COMPANION.UI;

    var phasePatterns = [
      { regex: /Phase\s+VIII|Phase\s+8|The\s+Bell/i, phase: 8 },
      { regex: /Phase\s+VII|Phase\s+7|The\s+Counsel/i, phase: 7 },
      { regex: /Phase\s+VI|Phase\s+6|The\s+Lesson\s+Plan/i, phase: 6 },
      { regex: /Phase\s+V[^I]|Phase\s+5|The\s+Dialectic/i, phase: 5 },
      { regex: /Phase\s+IV|Phase\s+4|The\s+Approaches/i, phase: 4 },
      { regex: /Phase\s+III|Phase\s+3|The\s+Observation/i, phase: 3 },
      { regex: /Phase\s+II[^I]|Phase\s+2|The\s+Convening/i, phase: 2 }
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
      1: 'The Inquiry',
      2: 'The Convening',
      3: 'The Observation',
      4: 'The Approaches',
      5: 'The Dialectic',
      6: 'The Lesson Plan',
      7: 'The Counsel',
      8: 'The Bell'
    };
    return labels[phase] || 'Unknown';
  }


  // ── Auto-Advance Logic ──

  function shouldAutoAdvance() {
    if (state.phase >= 2 && state.phase <= 4) return true;
    if (state.phase === 6 || state.phase === 7) return true;
    return false;
  }

  function autoAdvanceMeeting() {
    if (state.isStreaming) return;

    var nextPhase = state.phase + 1;
    if (nextPhase > 8) return;

    state.phase = nextPhase;
    COMPANION.UI.updatePhase(state.phase);

    var continuationMessage = 'Continue to Phase ' + nextPhase + ': ' + getPhaseLabel(nextPhase) + '.';

    COMPANION.UI.addSystemMessage('Advancing to Phase ' + nextPhase + '...');

    sendToSymposium(continuationMessage);
  }


  // ── Lesson Record ──

  function handleLessonRecord(lesson) {
    var UI = COMPANION.UI;

    state.phase = 8;
    state.lessonRecord = lesson;
    UI.updatePhase(8);

    // Show lesson card in chat
    UI.addLessonCard(lesson);

    // Disable input — meeting is sealed
    UI.setInputEnabled(false);
    UI.updateHint(8, state.activePersonas.length);

    UI.addSystemMessage('The Bell has sounded. The lesson record is sealed.');
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

    COMPANION.UI.addSystemMessage('Session restored. The Symposium remembers.');
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
    var containerSlug = 'the_symposium';
    var containerTitle = 'The Symposium';
    var groupName = 'The Symposium of Sages';

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
        entry.speaker = header ? header.textContent.trim() : 'The Symposium';
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
        htmlMessages += '<div style="margin:1rem 0;padding:1rem 1.25rem;border-left:3px solid #C0785A;">' +
          '<div style="color:#C0785A;font-weight:600;margin-bottom:0.4rem;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;">' + escapeExportHtml(entry.speaker) + '</div>' +
          '<div style="color:#e8e6e3;font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap;">' + escapeExportHtml(entry.text) + '</div></div>';
      }
    });

    var htmlContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">' +
      '<title>Transcript \u2014 ' + containerTitle + '</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap" rel="stylesheet">' +
      '</head><body style="margin:0;padding:0;background:#030303;color:#e8e6e3;font-family:system-ui,-apple-system,sans-serif;">' +
      '<div style="max-width:800px;margin:0 auto;padding:2rem 1.5rem;">' +
      '<div style="text-align:center;padding:2rem 0 1.5rem;border-bottom:1px solid rgba(192,120,90,0.3);">' +
      '<div style="color:#C0785A;font-family:\'Cormorant Garamond\',serif;font-size:0.85rem;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.5rem;">COMPANION Protocol</div>' +
      '<h1 style="color:#C0785A;font-family:\'Cormorant Garamond\',serif;font-size:2rem;font-weight:500;margin:0 0 0.25rem;">' + containerTitle + '</h1>' +
      '<div style="color:#8b7355;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;font-style:italic;">' + groupName + '</div>' +
      '<div style="color:#555;font-size:0.8rem;margin-top:0.75rem;">' + dateStr + ' ' + timeStr + '</div>' +
      '</div>' +
      '<div style="padding:1.5rem 0;">' + htmlMessages + '</div>' +
      '<div style="text-align:center;padding:1.5rem 0;border-top:1px solid rgba(192,120,90,0.3);color:#555;font-size:0.8rem;">' +
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


  // ═══════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    // Initialize UI
    COMPANION.UI.init();

    // Check for enter button (cinematic flow)
    var enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', function () {
        var wound = document.getElementById('act-wound');
        if (wound) {
          wound.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Start cinematic
    initCinematicIntro();
  }


  // ── Boot ──

  document.addEventListener('DOMContentLoaded', init);

  return {
    state: state,
    submitInquiry: submitInquiry
  };

})();
