/* ═══════════════════════════════════════════════════════════════
   LATENT DIALOGIC SPACE — Session Orchestrator
   Manages the cinematic intro, committee summoning,
   dialogue flow, and session state.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.App = (function () {

  // -- Session State --

  var state = {
    userTurnCount: 0,
    activePersonas: [],
    isStreaming: false,
    introComplete: false
  };

  var COMMITTEE_COLORS = {
    'Christopher Alexander': '#7a8b6d',
    'Walt Disney':           '#5c7cba',
    'Joseph Campbell':       '#b85c38'
  };

  var COMMITTEE_NAMES = Object.keys(COMMITTEE_COLORS);

  var COMMITTEE_ARTICLES = {
    'Christopher Alexander': 'Christopher_Alexander',
    'Walt Disney':           'Walt_Disney',
    'Joseph Campbell':       'Joseph_Campbell'
  };


  // ═══════════════════════════════════════════════════════════════
  //  CINEMATIC INTRO
  // ═══════════════════════════════════════════════════════════════

  function initCinematicIntro() {
    spawnEmbers();
    loadIntroPortraits();
    runTypewriter();
    initScrollReveals();
  }


  // -- Embers --

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


  // -- Intro Portrait Loading --

  function loadIntroPortraits() {
    var portraitReveals = document.querySelectorAll('.portrait-reveal[data-member]');
    portraitReveals.forEach(function (reveal) {
      var memberName = reveal.getAttribute('data-member');
      var article = COMMITTEE_ARTICLES[memberName];
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


  // -- Typewriter --

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


  // -- Scroll Reveals --

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


  // ═══════════════════════════════════════════════════════════════
  //  THE CHAMBER
  // ═══════════════════════════════════════════════════════════════

  function enterChamber() {
    var UI = COMPANION.UI;

    var intro = document.getElementById('cinematic-intro');
    if (intro) intro.classList.add('hidden');

    COMPANION.API.registerSession();
    UI.showScreen('chamber');

    var portraitStage = document.getElementById('portrait-stage');
    if (portraitStage && COMPANION.Hologram) {
      COMPANION.Hologram.init(portraitStage);
    }

    wireInput();
    wireSettings();

    // Try restoring a previous session
    if (restoreSession()) {
      COMMITTEE_NAMES.forEach(function (name, idx) {
        setTimeout(function () {
          if (COMPANION.Hologram) COMPANION.Hologram.summon(name);
          var color = COMMITTEE_COLORS[name];
          UI.addPersonaBadge(name, color, function () {});
          state.activePersonas.push(name);
        }, idx * 300);
      });
      UI.updateHint(state.activePersonas.length);
      UI.setInputEnabled(true);
    } else {
      // Summon all three architects
      setTimeout(function () {
        summonCommittee();
      }, 500);

      // Begin opening dialogue
      setTimeout(function () {
        beginSession();
      }, 2500);
    }
  }

  function summonCommittee() {
    var UI = COMPANION.UI;
    var Hologram = COMPANION.Hologram;

    COMMITTEE_NAMES.forEach(function (name, idx) {
      setTimeout(function () {
        if (Hologram) Hologram.summon(name);
        var color = COMMITTEE_COLORS[name];
        UI.addPersonaBadge(name, color, function () {});
        state.activePersonas.push(name);
      }, idx * 400);
    });
  }


  // -- Input Wiring --

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
    if (els.releaseAllBtn) {
      els.releaseAllBtn.addEventListener('click', function () {
        UI.hideSettings();
        COMPANION.API.clearHistory();
        COMPANION.API.clearSession();
        location.reload();
      });
    }
  }


  // -- Mythic Error Translation --

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
  //  SESSION FLOW
  // ═══════════════════════════════════════════════════════════════

  function beginSession() {
    var UI = COMPANION.UI;
    UI.setInputEnabled(false);

    var greetingMessage = 'The Latent Dialogic Space is open. Three architects have been summoned to examine the framework. Introduce yourselves.';

    sendToCommittee(greetingMessage, true);
  }

  function handleUserMessage() {
    var UI = COMPANION.UI;
    var text = UI.getInputText();
    if (!text || state.isStreaming) return;

    UI.addSeekerMessage(text);
    UI.clearInput();
    state.userTurnCount++;

    sendToCommittee(text);
  }

  function sendToCommittee(userMessage, isSystemMessage) {
    var UI = COMPANION.UI;
    var Protocol = COMPANION.Protocol;

    state.isStreaming = true;
    UI.setInputEnabled(false);

    var systemPrompt = Protocol.buildSystemPrompt(
      isSystemMessage ? 0 : state.userTurnCount
    );

    var msgHandle = UI.addPersonaMessage('The Architects', '#c9a227');

    var currentSpeaker = null;

    COMPANION.API.sendMessage(
      userMessage,
      systemPrompt,

      // onChunk
      function (chunk) {
        msgHandle.update(chunk);

        // Detect speaker changes for hologram
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

        UI.setInputEnabled(true);
        UI.updateHint(state.activePersonas.length);
        persistSession();
      },

      // onError
      function (error) {
        state.isStreaming = false;
        UI.setInputEnabled(true);
        UI.addSystemMessage(mythicError(error));
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

    COMPANION.UI.addSystemMessage('Session restored. The Architects remember.');
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
        entry.speaker = header ? header.textContent.trim() : 'The Architects';
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

    // -- Plain text --
    var txtLines = [];
    txtLines.push('COMPANION Protocol \u2014 Latent Dialogic Space');
    txtLines.push('The Architects: Alexander \u00b7 Disney \u00b7 Campbell');
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

    // -- Styled HTML --
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
      '<title>Transcript \u2014 Latent Dialogic Space</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap" rel="stylesheet">' +
      '</head><body style="margin:0;padding:0;background:#030303;color:#e8e6e3;font-family:system-ui,-apple-system,sans-serif;">' +
      '<div style="max-width:800px;margin:0 auto;padding:2rem 1.5rem;">' +
      '<div style="text-align:center;padding:2rem 0 1.5rem;border-bottom:1px solid rgba(201,162,39,0.3);">' +
      '<div style="color:#c9a227;font-family:\'Cormorant Garamond\',serif;font-size:0.85rem;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:0.5rem;">COMPANION Protocol</div>' +
      '<h1 style="color:#c9a227;font-family:\'Cormorant Garamond\',serif;font-size:2rem;font-weight:500;margin:0 0 0.25rem;">Latent Dialogic Space</h1>' +
      '<div style="color:#8b7355;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;font-style:italic;">Alexander \u00b7 Disney \u00b7 Campbell</div>' +
      '<div style="color:#555;font-size:0.8rem;margin-top:0.75rem;">' + dateStr + ' ' + timeStr + '</div>' +
      '</div>' +
      '<div style="padding:1.5rem 0;">' + htmlMessages + '</div>' +
      '<div style="text-align:center;padding:1.5rem 0;border-top:1px solid rgba(201,162,39,0.3);color:#555;font-size:0.8rem;">' +
      'COMPANION Protocol &mdash; Latent Dialogic Space &mdash; Exported ' + dateStr +
      '</div></div></body></html>';

    downloadFile('companion_dialogic_' + dateStr + '.txt', txtContent, 'text/plain');
    setTimeout(function () {
      downloadFile('companion_dialogic_' + dateStr + '.html', htmlContent, 'text/html');
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
    COMPANION.UI.init();

    // Wire enter button from cinematic intro
    var enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', function () {
        enterChamber();
      });
    }

    initCinematicIntro();
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    state: state,
    enterChamber: enterChamber
  };

})();
