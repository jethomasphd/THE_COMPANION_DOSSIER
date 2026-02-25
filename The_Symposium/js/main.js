/* ═══════════════════════════════════════════════════════════════
   THE SYMPOSIUM — Session Orchestrator
   Manages the cinematic intro, inquiry submission,
   five-phase meeting flow, lesson record detection,
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
    'Ada Lovelace':      '#B05080',
    'Paulo Freire':      '#CC6B3A'
  };

  var COUNCIL_NAMES = Object.keys(COUNCIL_COLORS);

  // Wikipedia articles for intro portraits
  var COUNCIL_ARTICLES = {
    'Socrates':          'Socrates',
    'Maria Montessori':  'Maria_Montessori',
    'John Dewey':        'John_Dewey',
    'Ada Lovelace':      'Ada_Lovelace',
    'Paulo Freire':      'Paulo_Freire'
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
      // Summon all 5 council members
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

    if (state.phase === 5 && state.lessonRecord) {
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

        // Check for Lesson Record (Phase 5)
        var lesson = Protocol.parseLessonRecord(fullResponse);
        if (lesson) {
          handleLessonRecord(lesson);
          return;
        }

        // Auto-advance through phases if the AI marks transitions
        if (state.phase < 5) {
          if (shouldAutoAdvance()) {
            setTimeout(function () {
              autoAdvanceMeeting();
            }, 1500);
          } else {
            UI.setInputEnabled(true);
            persistSession();
            UI.updateHint(state.phase, state.activePersonas.length);
          }
        } else {
          // Phase 5 but no lesson record parsed — keep input alive
          // so the user can prompt the AI to deliver The Bell
          UI.setInputEnabled(true);
          persistSession();
          UI.updateHint(state.phase, state.activePersonas.length);
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

    // Only match formal transition markers — e.g. "— Phase 3: The Dialectic —"
    // Casual mentions of phase names must NOT trigger transitions.
    var phasePatterns = [
      { regex: /—\s*Phase\s+(?:V|5)[:\s]/i, phase: 5 },
      { regex: /—\s*Phase\s+(?:IV|4)[:\s]/i, phase: 4 },
      { regex: /—\s*Phase\s+(?:III|3)[:\s]/i, phase: 3 },
      { regex: /—\s*Phase\s+(?:II|2)[:\s]/i, phase: 2 }
    ];

    var highestPhase = state.phase;
    for (var i = 0; i < phasePatterns.length; i++) {
      if (phasePatterns[i].regex.test(text) && phasePatterns[i].phase > highestPhase) {
        highestPhase = phasePatterns[i].phase;
      }
    }

    // Only advance one phase at a time to prevent accidental jumps
    if (highestPhase > state.phase) {
      var nextPhase = state.phase + 1;
      state.phase = nextPhase;
      UI.updatePhase(state.phase);
      UI.addSystemMessage('Phase transition: ' + getPhaseLabel(state.phase));
    }
  }

  function getPhaseLabel(phase) {
    var labels = {
      1: 'The Inquiry',
      2: 'The Observation',
      3: 'The Dialectic',
      4: 'The Lesson Plan',
      5: 'The Bell'
    };
    return labels[phase] || 'Unknown';
  }


  // ── Auto-Advance Logic ──

  function shouldAutoAdvance() {
    // Phase 1: needs user interaction (clarification)
    // Phase 2: auto-advance (observation → dialectic)
    // Phase 3: needs user interaction (dialectic — the heat)
    // Phase 4: auto-advance (lesson plan → bell)
    // Phase 5: final
    if (state.phase === 2 || state.phase === 4) return true;
    return false;
  }

  function autoAdvanceMeeting() {
    if (state.isStreaming) return;

    var nextPhase = state.phase + 1;
    if (nextPhase > 5) return;

    state.phase = nextPhase;
    COMPANION.UI.updatePhase(state.phase);

    var continuationMessage = 'Continue to Phase ' + nextPhase + ': ' + getPhaseLabel(nextPhase) + '.';

    COMPANION.UI.addSystemMessage('Advancing to Phase ' + nextPhase + '...');

    sendToSymposium(continuationMessage);
  }


  // ── Lesson Record ──

  function handleLessonRecord(lesson) {
    var UI = COMPANION.UI;

    state.phase = 5;
    state.lessonRecord = lesson;
    UI.updatePhase(5);

    // Show lesson card in chat
    UI.addLessonCard(lesson);

    // Disable input — meeting is sealed
    UI.setInputEnabled(false);
    UI.updateHint(5, state.activePersonas.length);

    UI.addSystemMessage('The Bell has sounded. The lesson record is sealed.');

    // Auto-export the lesson document
    setTimeout(function () {
      exportLessonDoc(lesson);
    }, 1000);
  }


  // ═══════════════════════════════════════════════════════════════
  //  LESSON DOCUMENT EXPORT (.doc)
  // ═══════════════════════════════════════════════════════════════

  function exportLessonDoc(lesson) {
    var now = new Date();
    var dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');

    var inquiry = state.inquiry || {};

    // Build plans table rows
    var plansHtml = '';
    if (lesson.plans && lesson.plans.length) {
      lesson.plans.forEach(function (plan, i) {
        plansHtml += '<tr>' +
          '<td style="padding:8pt;border:1px solid #bbb;font-weight:bold;width:60pt;">Plan ' + (i + 1) + '</td>' +
          '<td style="padding:8pt;border:1px solid #bbb;">' + esc(plan.action || '') + '</td>' +
          '<td style="padding:8pt;border:1px solid #bbb;width:80pt;">' + esc(plan.owner || '') + '</td>' +
          '<td style="padding:8pt;border:1px solid #bbb;width:80pt;">' + esc(plan.timeline || '') + '</td>' +
          '<td style="padding:8pt;border:1px solid #bbb;">' + esc(plan.success || '') + '</td>' +
          '</tr>';
      });
    }

    // Build dissent section
    var dissentHtml = '';
    if (lesson.dissent && lesson.dissent.length) {
      lesson.dissent.forEach(function (d) {
        dissentHtml += '<p style="margin:4pt 0;"><strong>' + esc(d.seat || '') + ':</strong> ' + esc(d.position || '') + '</p>';
      });
    } else {
      dissentHtml = '<p style="margin:4pt 0;color:#888;"><em>None recorded.</em></p>';
    }

    // Build counsel section
    var counselHtml = '';
    if (lesson.counsel) {
      for (var planName in lesson.counsel) {
        if (lesson.counsel.hasOwnProperty(planName)) {
          counselHtml += '<h3 style="font-size:11pt;color:#8B4513;margin:10pt 0 4pt;">' + esc(planName) + '</h3>';
          var votes = lesson.counsel[planName];
          for (var seat in votes) {
            if (votes.hasOwnProperty(seat)) {
              var v = votes[seat];
              counselHtml += '<p style="margin:2pt 0 2pt 12pt;font-size:10pt;"><strong>' + esc(seat) + ':</strong> ' +
                esc(v.vote || '') + ' &mdash; ' + esc(v.reason || '') + '</p>';
            }
          }
        }
      }
    }

    var htmlContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
      'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
      'xmlns="http://www.w3.org/TR/REC-html40">' +
      '<head><meta charset="UTF-8">' +
      '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->' +
      '<style>' +
      'body{font-family:Cambria,Georgia,serif;font-size:11pt;line-height:1.6;color:#222;margin:0;padding:0.75in 1in;}' +
      'h1{font-size:20pt;color:#8B4513;border-bottom:2pt solid #8B4513;padding-bottom:6pt;margin:0 0 4pt;}' +
      'h2{font-size:13pt;color:#8B4513;margin:16pt 0 6pt;border-bottom:1px solid #ddd;padding-bottom:3pt;}' +
      '.meta{color:#888;font-size:9pt;margin-bottom:16pt;}' +
      '.approach-box{background:#FDF5E6;border-left:4pt solid #8B4513;padding:8pt 12pt;margin:8pt 0;}' +
      'table{border-collapse:collapse;width:100%;margin:8pt 0;}' +
      'th{background:#8B4513;color:white;padding:6pt 8pt;text-align:left;font-size:9pt;}' +
      'td{padding:6pt 8pt;border:1px solid #bbb;font-size:10pt;vertical-align:top;}' +
      '.proof-box{background:#F0F8F0;border:1px solid #4A8C5C;padding:8pt 12pt;margin:8pt 0;}' +
      '.footer{margin-top:20pt;padding-top:10pt;border-top:1px solid #ccc;font-size:8pt;color:#999;text-align:center;}' +
      '</style></head><body>' +

      '<h1>Lesson Record</h1>' +
      '<div class="meta">The Symposium of Sages &mdash; COMPANION Protocol &mdash; ' + dateStr + '</div>' +

      '<h2>The Inquiry</h2>' +
      '<p><strong>Challenge:</strong> ' + esc(inquiry.challenge || '') + '</p>' +
      (inquiry.classroom ? '<p><strong>Classroom:</strong> ' + esc(inquiry.classroom) + '</p>' : '') +
      (inquiry.constraints ? '<p><strong>Constraints:</strong> ' + esc(inquiry.constraints) + '</p>' : '') +
      (inquiry.tried ? '<p><strong>What Was Tried:</strong> ' + esc(inquiry.tried) + '</p>' : '') +

      '<h2>The Approach</h2>' +
      '<div class="approach-box"><strong>' + esc(lesson.approach || '') + '</strong></div>' +
      (lesson.rationale ? '<p>' + esc(lesson.rationale) + '</p>' : '') +

      (plansHtml ? '<h2>Action Plans</h2>' +
        '<table><tr><th>Plan</th><th>Action</th><th>Owner</th><th>Timeline</th><th>Success Criteria</th></tr>' +
        plansHtml + '</table>' : '') +

      '<h2>What Was Avoided</h2>' +
      '<p>' + esc(lesson.avoided || 'Not specified.') + '</p>' +

      '<h2>Dissenting Views</h2>' +
      dissentHtml +

      (counselHtml ? '<h2>Counsel</h2>' + counselHtml : '') +

      '<h2>30-Day Proof Metric</h2>' +
      '<div class="proof-box">' + esc(lesson.proof || 'Not specified.') + '</div>' +

      '<div class="footer">COMPANION Protocol &mdash; The Symposium of Sages &mdash; ' + dateStr + '</div>' +
      '</body></html>';

    downloadFile('lesson_record_' + dateStr + '.doc', htmlContent, 'application/msword');

    COMPANION.UI.addSystemMessage('Lesson record downloaded. Take it to your classroom.');
  }

  function esc(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
