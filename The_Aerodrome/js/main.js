/* ═══════════════════════════════════════════════════════════════
   THE AERODROME — Session Orchestrator
   Cinematic intro, auto-summoning of the brothers, the priming
   greeting, free conversation with live speaker detection,
   session persistence, and transcript export.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.App = (function () {

  // ── Session State ──
  var state = {
    activePersonas: [],
    isStreaming: false,
    introComplete: false,
    chamberEntered: false,
    pendingSeed: null
  };

  // ── Audio State ──
  var ambientAudioCtx = null;
  var ambientGain = null;
  var ambientStarted = false;

  var COLLECTIVE_COLOR = '#C49A4E';

  var BROTHER_COLORS = {
    'Wilbur Wright': '#8FB0C4',
    'Orville Wright': '#D89A52'
  };

  // Order of arrival — the elder first, then the younger.
  var SUMMON_ORDER = ['Wilbur Wright', 'Orville Wright'];

  // Wikimedia portraits for the cinematic intro frames.
  var BROTHER_ARTICLES = {
    'Wilbur Wright': 'Wilbur_Wright',
    'Orville Wright': 'Orville_Wright'
  };


  // ═══════════════════════════════════════════════════════════════
  //  CINEMATIC INTRO
  // ═══════════════════════════════════════════════════════════════

  function initCinematicIntro() {
    spawnWindMotes();
    loadIntroPortraits();
    runTypewriter();
    initScrollReveals();
    initSuggestedPrompts();
    initEnterButton();
  }


  // ── Wind Motes (drifting dust, like sun in a workshop) ──

  function spawnWindMotes() {
    var field = document.getElementById('ember-field');
    if (!field) return;

    for (var i = 0; i < 38; i++) {
      var mote = document.createElement('div');
      mote.className = 'ember';
      mote.style.left = Math.random() * 100 + '%';
      mote.style.animationDuration = (11 + Math.random() * 18) + 's';
      mote.style.animationDelay = (Math.random() * 12) + 's';
      var size = (1 + Math.random() * 1.8);
      mote.style.width = size + 'px';
      mote.style.height = size + 'px';
      field.appendChild(mote);
    }
  }


  // ── Intro Portrait Loading ──

  function loadIntroPortraits() {
    var portraitReveals = document.querySelectorAll('.portrait-reveal[data-member]');
    portraitReveals.forEach(function (reveal) {
      var memberName = reveal.getAttribute('data-member');
      var article = BROTHER_ARTICLES[memberName];
      if (!article) return;

      var frame = reveal.querySelector('.portrait-frame-cinematic');
      if (!frame) return;

      var img = new Image();
      img.onload = function () { img.classList.add('loaded'); };
      img.src = '../The_Pantheon/' + article + '.jpg';
      frame.appendChild(img);
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
      var speed = 34;

      function typeChar() {
        if (charIndex < text.length) {
          line.textContent += text.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, speed + Math.random() * 22);
        } else {
          line.classList.remove('typing');
          line.classList.add('typed');
          lineIndex++;
          setTimeout(typeLine, 420);
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

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (!ambientStarted) {
            startAmbientWind();
            ambientStarted = true;
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  }


  // ── Suggested Prompts (seed the first question) ──

  function initSuggestedPrompts() {
    var chips = document.querySelectorAll('.suggested-prompt');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.pendingSeed = chip.getAttribute('data-seed') || chip.textContent.trim();
        enterChamber();
      });
    });
  }

  function initEnterButton() {
    var btn = document.getElementById('enter-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        state.pendingSeed = null;
        enterChamber();
      });
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  THE CHAMBER
  // ═══════════════════════════════════════════════════════════════

  function enterChamber() {
    if (state.chamberEntered) return;
    state.chamberEntered = true;

    if (!ambientStarted) {
      startAmbientWind();
      ambientStarted = true;
    }

    var intro = document.getElementById('cinematic-intro');
    if (intro) intro.classList.add('hidden');

    COMPANION.API.registerSession();
    COMPANION.UI.showScreen('chamber');

    var portraitStage = document.getElementById('portrait-stage');
    if (portraitStage && COMPANION.Hologram) {
      COMPANION.Hologram.init(portraitStage);
    }

    wireInput();
    wireSettings();

    if (restoreSession()) {
      // Re-establish the brothers visually without re-summoning.
      SUMMON_ORDER.forEach(function (name, idx) {
        setTimeout(function () {
          if (COMPANION.Hologram) COMPANION.Hologram.summon(name);
          COMPANION.UI.addPersonaBadge(name, BROTHER_COLORS[name]);
          state.activePersonas.push(name);
        }, idx * 300);
      });
      COMPANION.UI.updateStatus('THE AERODROME · WILBUR & ORVILLE WRIGHT');
      COMPANION.UI.updateHint('ready');
      COMPANION.UI.setInputEnabled(true);
    } else {
      COMPANION.UI.updateStatus('THE FIELD · THE WIND IS UP');
      COMPANION.UI.updateHint('arriving');
      setTimeout(autoSummonBrothers, 500);
    }
  }


  function autoSummonBrothers() {
    var stagger = 850;

    SUMMON_ORDER.forEach(function (name, idx) {
      setTimeout(function () {
        if (COMPANION.Hologram) COMPANION.Hologram.summon(name);
        COMPANION.UI.addPersonaBadge(name, BROTHER_COLORS[name]);
        state.activePersonas.push(name);
        playSummonChime();

        if (idx === SUMMON_ORDER.length - 1) {
          setTimeout(function () {
            COMPANION.UI.updateStatus('THE AERODROME · WILBUR & ORVILLE WRIGHT');
            COMPANION.UI.addSystemMessage('Wilbur and Orville Wright have come to the field.');
            sendGreeting();
          }, 1200);
        }
      }, idx * stagger);
    });
  }


  // ── The Priming Greeting ──

  function sendGreeting() {
    var greeting =
      'The brothers Wilbur and Orville Wright have been summoned to the Aerodrome and now stand at the field. ' +
      'A seeker has come from the year 2026 — an age drowning in information, "the Flood," in which new silicon minds (what they call artificial intelligence) now ride atop an endless torrent of words and signals. ' +
      'The seeker wishes to think WITH you about the oldest longing made new: how a heavy age might learn, metaphorically, to fly — to stop being carried by the information and learn instead to rise above it, to steer, to be lighter and freer and more in control, the way you once taught a world of iron and steam to leave the ground. ' +
      'Arrive in your own voices. Each of you: greet the seeker briefly and vividly — who you are, and the spark of how you two, from a bicycle shop, did what the great engineers could not. ' +
      'Then, between the two of you, offer one opening reflection that takes the measure of this strange new air — drawing on what you truly know: the lying published tables versus the wind you measured yourselves, control over raw power, lightness, the discipline of a thousand glides. ' +
      'Scrap a little, as you do. Keep it warm and brief. Then invite the seeker to speak freely.';

    state.isStreaming = true;
    COMPANION.UI.setInputEnabled(false);
    COMPANION.UI.updateHint('opening');

    streamFromBrothers(greeting);
  }


  // ── Input Wiring ──

  function wireInput() {
    var els = COMPANION.UI.elements();
    if (els.sendBtn) {
      els.sendBtn.addEventListener('click', handleUserMessage);
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
    var els = COMPANION.UI.elements();
    if (els.settingsToggle) {
      els.settingsToggle.addEventListener('click', function () { COMPANION.UI.toggleSettings(); });
    }
    if (els.closeSettings) {
      els.closeSettings.addEventListener('click', function () { COMPANION.UI.hideSettings(); });
    }
    if (els.settingsModel) {
      els.settingsModel.value = COMPANION.API.getModel();
      els.settingsModel.addEventListener('change', function () {
        COMPANION.API.setModel(els.settingsModel.value);
      });
    }
    if (els.exportBtn) {
      els.exportBtn.addEventListener('click', function () {
        COMPANION.UI.hideSettings();
        exportTranscript();
      });
    }
  }


  function handleUserMessage() {
    if (state.isStreaming) return;
    var text = COMPANION.UI.getInputText();
    if (!text) return;

    COMPANION.UI.addSeekerMessage(text);
    COMPANION.UI.clearInput();
    streamFromBrothers(text);
  }


  // ═══════════════════════════════════════════════════════════════
  //  STREAMING — with live speaker detection
  // ═══════════════════════════════════════════════════════════════

  function streamFromBrothers(userMessage) {
    state.isStreaming = true;
    COMPANION.UI.setInputEnabled(false);
    COMPANION.UI.updateHint('thinking');

    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(state.activePersonas);

    var msgHandle = COMPANION.UI.addPersonaMessage('The Brothers', COLLECTIVE_COLOR);
    var currentSpeaker = null;

    COMPANION.API.sendMessage(
      userMessage,
      systemPrompt,

      // onChunk
      function (chunk) {
        msgHandle.update(chunk);

        var fullText = msgHandle.getText();
        var speakerMatch = fullText.match(/\*\*\[([^\]]+)\]:\*\*/g);
        if (speakerMatch) {
          var last = speakerMatch[speakerMatch.length - 1];
          var nameMatch = last.match(/\*\*\[([^\]]+)\]:\*\*/);
          if (nameMatch) {
            var newSpeaker = nameMatch[1];
            if (newSpeaker !== currentSpeaker) {
              if (COMPANION.Hologram) {
                COMPANION.Hologram.clearSpeaking();
                COMPANION.Hologram.setSpeaking(newSpeaker, true);
              }
              COMPANION.UI.clearBadgesSpeaking();
              var data = COMPANION.Hologram ? COMPANION.Hologram.getPersonaData(newSpeaker) : null;
              if (data) {
                msgHandle.setHeader(newSpeaker, data.color);
                COMPANION.UI.setBadgeSpeaking(matchBadgeName(newSpeaker), true);
              }
              currentSpeaker = newSpeaker;
            }
          }
        }
      },

      // onDone
      function () {
        msgHandle.finish();
        state.isStreaming = false;
        if (COMPANION.Hologram) COMPANION.Hologram.clearSpeaking();
        COMPANION.UI.clearBadgesSpeaking();
        COMPANION.UI.setInputEnabled(true);
        COMPANION.UI.updateHint('ready');
        persistSession();

        // If a suggested question seeded this session, ask it now.
        if (state.pendingSeed) {
          var seed = state.pendingSeed;
          state.pendingSeed = null;
          setTimeout(function () {
            if (state.isStreaming) return;
            COMPANION.UI.addSeekerMessage(seed);
            streamFromBrothers(seed);
          }, 700);
        }
      },

      // onError
      function (error) {
        msgHandle.finish();
        state.isStreaming = false;
        if (COMPANION.Hologram) COMPANION.Hologram.clearSpeaking();
        COMPANION.UI.clearBadgesSpeaking();
        COMPANION.UI.setInputEnabled(true);
        COMPANION.UI.updateHint('ready');
        COMPANION.UI.addSystemMessage(mythicError(error));
      }
    );
  }

  // Map a detected speaker name to the badge label (full name).
  function matchBadgeName(speaker) {
    var lower = (speaker || '').toLowerCase();
    if (lower.indexOf('wilbur') !== -1) return 'Wilbur Wright';
    if (lower.indexOf('orville') !== -1) return 'Orville Wright';
    return speaker;
  }


  // ── Flight-themed Error Translation ──

  function mythicError(rawMessage) {
    var lower = (rawMessage || '').toLowerCase();
    if (lower.indexOf('rate') !== -1 || lower.indexOf('429') !== -1) {
      return 'The wind has gusted too hard. Too many called at once. Wait a moment, then speak again.';
    }
    if (lower.indexOf('401') !== -1 || lower.indexOf('auth') !== -1 || lower.indexOf('key') !== -1) {
      return 'The binding has failed. The seal is not recognized, and the vessel cannot be reached.';
    }
    if (lower.indexOf('500') !== -1 || lower.indexOf('server') !== -1) {
      return 'The engine has gone quiet. The minds beyond the threshold are unreachable. Try again shortly.';
    }
    if (lower.indexOf('network') !== -1 || lower.indexOf('fetch') !== -1 || lower.indexOf('failed') !== -1) {
      return 'The line to the field has been cut. Check your passage to the network, then try again.';
    }
    if (lower.indexOf('timeout') !== -1 || lower.indexOf('abort') !== -1) {
      return 'The summoning has timed out. The brothers did not answer in time.';
    }
    if (lower.indexOf('limit') !== -1 || lower.indexOf('session') !== -1 || lower.indexOf('expired') !== -1) {
      return rawMessage;
    }
    return 'The craft would not lift. The vessel is unreachable. (' + rawMessage + ')';
  }


  // ═══════════════════════════════════════════════════════════════
  //  AMBIENT WIND (Web Audio API)
  // ═══════════════════════════════════════════════════════════════

  function startAmbientWind() {
    if (ambientAudioCtx) return;
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      ambientAudioCtx = new AudioContext();

      // A low, slow drone with gentle movement — the hum of a field at altitude.
      var osc1 = ambientAudioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 58;

      var osc2 = ambientAudioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 87;

      var lfo = ambientAudioCtx.createOscillator();
      lfo.frequency.value = 0.07;
      var lfoGain = ambientAudioCtx.createGain();
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      ambientGain = ambientAudioCtx.createGain();
      ambientGain.gain.value = 0;

      var g1 = ambientAudioCtx.createGain();
      g1.gain.value = 0.011;
      var g2 = ambientAudioCtx.createGain();
      g2.gain.value = 0.006;

      osc1.connect(g1);
      osc2.connect(g2);
      g1.connect(ambientGain);
      g2.connect(ambientGain);
      ambientGain.connect(ambientAudioCtx.destination);

      osc1.start();
      osc2.start();
      lfo.start();

      ambientGain.gain.linearRampToValueAtTime(1, ambientAudioCtx.currentTime + 6);
    } catch (e) { /* audio not available */ }
  }

  function playSummonChime() {
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      var ctx = ambientAudioCtx || new AudioContext();

      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 247; // a soft B3

      var gain = ctx.createGain();
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) { /* sfx not available */ }
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
            name: header ? header.textContent : 'The Brothers',
            color: header ? header.style.color : COLLECTIVE_COLOR,
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

    COMPANION.UI.addSystemMessage('The conversation resumes. The brothers remember.');
    return true;
  }


  // ═══════════════════════════════════════════════════════════════
  //  EXPORT TRANSCRIPT
  // ═══════════════════════════════════════════════════════════════

  function exportTranscript() {
    var messages = document.querySelectorAll('#dialogue-messages .message');
    if (!messages.length) {
      COMPANION.UI.addSystemMessage('Nothing to export yet.');
      return;
    }

    var now = new Date();
    var dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    var timeStr = String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');
    var containerSlug = 'the_aerodrome';
    var containerTitle = 'The Aerodrome';
    var groupName = 'A Conversation with the Wright Brothers';

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
        entry.speaker = header ? header.textContent.trim() : 'The Brothers';
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
      COMPANION.UI.addSystemMessage('Nothing to export yet.');
      return;
    }

    // ── Plain text ──
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

    // ── Styled HTML ──
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
        var sc = entry.speaker.toLowerCase().indexOf('wilbur') !== -1 ? '#8FB0C4'
               : entry.speaker.toLowerCase().indexOf('orville') !== -1 ? '#D89A52'
               : '#C49A4E';
        htmlMessages += '<div style="margin:1rem 0;padding:1rem 1.25rem;border-left:3px solid ' + sc + ';">' +
          '<div style="color:' + sc + ';font-weight:600;margin-bottom:0.4rem;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;">' + escapeExportHtml(entry.speaker) + '</div>' +
          '<div style="color:#e8e6e3;font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap;">' + escapeExportHtml(entry.text) + '</div></div>';
      }
    });

    var htmlContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">' +
      '<title>Transcript — ' + containerTitle + '</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap" rel="stylesheet">' +
      '</head><body style="margin:0;padding:0;background:#030303;color:#e8e6e3;font-family:system-ui,-apple-system,sans-serif;">' +
      '<div style="max-width:800px;margin:0 auto;padding:2rem 1.5rem;">' +
      '<div style="text-align:center;padding:2rem 0 1.5rem;border-bottom:1px solid rgba(196,154,78,0.3);">' +
      '<div style="color:#C49A4E;font-family:\'Cormorant Garamond\',serif;font-size:0.85rem;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.5rem;">COMPANION Protocol</div>' +
      '<h1 style="color:#C49A4E;font-family:\'Cormorant Garamond\',serif;font-size:2rem;font-weight:500;margin:0 0 0.25rem;">' + containerTitle + '</h1>' +
      '<div style="color:#8b7355;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;font-style:italic;">' + groupName + '</div>' +
      '<div style="color:#555;font-size:0.8rem;margin-top:0.75rem;">' + dateStr + ' ' + timeStr + '</div>' +
      '</div>' +
      '<div style="padding:1.5rem 0;">' + htmlMessages + '</div>' +
      '<div style="text-align:center;padding:1.5rem 0;border-top:1px solid rgba(196,154,78,0.3);color:#555;font-size:0.8rem;">' +
      'COMPANION Protocol &mdash; ' + groupName + ' &mdash; Exported ' + dateStr +
      '</div></div></body></html>';

    downloadFile('companion_' + containerSlug + '_' + dateStr + '.txt', txtContent, 'text/plain');
    setTimeout(function () {
      downloadFile('companion_' + containerSlug + '_' + dateStr + '.html', htmlContent, 'text/html');
    }, 500);

    COMPANION.UI.addSystemMessage('Transcript exported (' + parsed.length + ' messages). Carry it forward.');
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
    COMPANION.UI.init();

    // Force Opus for the deepest reasoning, matching the other chambers.
    COMPANION.API.setModel('claude-opus-4-6');
    var els = COMPANION.UI.elements();
    if (els.settingsModel) els.settingsModel.value = 'claude-opus-4-6';

    initCinematicIntro();
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    state: state
  };

})();
