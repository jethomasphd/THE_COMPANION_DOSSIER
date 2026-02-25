/* ═══════════════════════════════════════════════════════════════
   THE SYMPOSIUM — UI State Management
   Handles screen transitions, dialogue rendering, persona badges,
   phase indicators, lesson record reveal, and all user-facing state.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.UI = (function () {

  var screens = {};
  var elements = {};

  function cacheElements() {
    screens = {
      void: document.getElementById('void-screen'),
      config: document.getElementById('config-screen'),
      chamber: document.getElementById('chamber-screen')
    };

    elements = {
      enterBtn: document.getElementById('enter-btn'),
      emberField: document.getElementById('ember-field'),
      apiKeyInput: document.getElementById('api-key-input'),
      saveKeyBtn: document.getElementById('save-key-btn'),
      personaBadges: document.getElementById('persona-badges'),
      dialogueMessages: document.getElementById('dialogue-messages'),
      dialogueScroll: document.getElementById('dialogue-scroll'),
      userInput: document.getElementById('user-input'),
      sendBtn: document.getElementById('send-btn'),
      inputHint: document.getElementById('input-hint'),
      phaseIndicator: document.getElementById('phase-indicator'),
      settingsToggle: document.getElementById('settings-toggle'),
      settingsPanel: document.getElementById('settings-panel'),
      settingsModel: document.getElementById('settings-model'),
      exportBtn: document.getElementById('export-btn'),
      releaseAllBtn: document.getElementById('release-all-btn'),
      closeSettings: document.getElementById('close-settings'),
      thresholdScreen: document.getElementById('threshold-screen'),
      packetChallenge: document.getElementById('packet-challenge'),
      packetClassroom: document.getElementById('packet-classroom'),
      packetConstraints: document.getElementById('packet-constraints'),
      packetTried: document.getElementById('packet-tried'),
      packetSubmit: document.getElementById('packet-submit')
    };
  }

  function showScreen(screenName) {
    Object.values(screens).forEach(function (s) {
      if (s) s.classList.remove('active');
    });
    if (screens[screenName]) {
      screens[screenName].classList.add('active');
    }
  }

  function updatePhase(phase) {
    if (!elements.phaseIndicator) return;
    var labels = {
      1: 'Phase I \u2014 The Inquiry',
      2: 'Phase II \u2014 The Convening',
      3: 'Phase III \u2014 The Observation',
      4: 'Phase IV \u2014 The Approaches',
      5: 'Phase V \u2014 The Dialectic',
      6: 'Phase VI \u2014 The Lesson Plan',
      7: 'Phase VII \u2014 The Counsel',
      8: 'Phase VIII \u2014 The Bell'
    };
    elements.phaseIndicator.textContent = labels[phase] || '';
    elements.phaseIndicator.className = 'phase-indicator phase-' + phase;
  }

  function addSeekerMessage(text) {
    if (!elements.dialogueMessages) return null;
    var msg = document.createElement('div');
    msg.className = 'message message-seeker';
    msg.innerHTML = '<div class="message-bubble">' + escapeHtml(text) + '</div>';
    elements.dialogueMessages.appendChild(msg);
    smartScroll();
    return msg;
  }

  function addPersonaMessage(personaName, color) {
    var msg = document.createElement('div');
    msg.className = 'message message-persona';

    var header = document.createElement('div');
    header.className = 'message-header';
    header.style.color = color;
    header.textContent = personaName || 'The Symposium';
    msg.appendChild(header);

    var body = document.createElement('div');
    body.className = 'message-body';
    body.style.borderLeftColor = color;
    msg.appendChild(body);

    var cursor = document.createElement('span');
    cursor.className = 'streaming-cursor';
    body.appendChild(cursor);

    if (elements.dialogueMessages) {
      elements.dialogueMessages.appendChild(msg);
    }
    smartScroll();

    var rawText = '';

    return {
      update: function (chunk) {
        rawText += chunk;
        body.innerHTML = renderMarkdownLight(rawText);
        body.appendChild(cursor);
        smartScroll();
      },
      finish: function () {
        body.innerHTML = renderMarkdownLight(rawText);
        smartScroll();
      },
      getText: function () {
        return rawText;
      },
      setHeader: function (name, clr) {
        header.textContent = name;
        header.style.color = clr;
        body.style.borderLeftColor = clr;
      }
    };
  }

  function addSystemMessage(text) {
    if (!elements.dialogueMessages) return;
    var msg = document.createElement('div');
    msg.className = 'message message-system';
    msg.innerHTML = '<div class="message-body">' + escapeHtml(text) + '</div>';
    elements.dialogueMessages.appendChild(msg);
    smartScroll();
  }

  function addPersonaBadge(name, color, onDismiss) {
    if (!elements.personaBadges) return;
    var badge = document.createElement('div');
    badge.className = 'persona-badge';
    badge.style.color = color;
    badge.style.borderColor = color;
    badge.dataset.persona = name;

    badge.innerHTML = '<span class="badge-name">' + escapeHtml(name) + '</span>' +
                      '<span class="badge-dismiss" title="Dismiss">&times;</span>';

    badge.querySelector('.badge-dismiss').addEventListener('click', function () {
      if (onDismiss) onDismiss(name);
    });

    elements.personaBadges.appendChild(badge);
  }

  function removePersonaBadge(name) {
    if (!elements.personaBadges) return;
    var badge = elements.personaBadges.querySelector('[data-persona="' + name + '"]');
    if (badge) {
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0.8)';
      setTimeout(function () { badge.remove(); }, 300);
    }
  }

  function clearPersonaBadges() {
    if (elements.personaBadges) elements.personaBadges.innerHTML = '';
  }

  function addLessonCard(lessonData) {
    if (!elements.dialogueMessages) return;

    var card = document.createElement('div');
    card.className = 'message threshold-chat-card';

    var html = '';
    html += '<div class="threshold-chat-ornament">&#9671; &#9672; &#9671;</div>';
    html += '<div class="threshold-chat-heading">The Bell \u2014 Lesson Record</div>';
    html += '<div class="threshold-chat-divider-line"></div>';

    html += '<div class="threshold-chat-job">';
    html += '<div class="threshold-chat-job-title">' + escapeHtml(lessonData.approach || 'Approach Determined') + '</div>';
    if (lessonData.rationale) {
      html += '<div class="threshold-chat-job-company">' + escapeHtml(lessonData.rationale) + '</div>';
    }
    if (lessonData.avoided) {
      html += '<div class="threshold-chat-job-location">Avoided: ' + escapeHtml(lessonData.avoided) + '</div>';
    }
    if (lessonData.proof) {
      html += '<div class="threshold-chat-job-salary">Prove in 30 days: ' + escapeHtml(lessonData.proof) + '</div>';
    }
    html += '</div>';

    html += '<div class="threshold-chat-divider-line"></div>';
    html += '<div class="threshold-chat-sigil">&#9830; &#9674; &#9830;</div>';

    card.innerHTML = html;
    elements.dialogueMessages.appendChild(card);
    smartScroll();
  }

  function showThreshold() {
    if (elements.thresholdScreen) {
      elements.thresholdScreen.classList.add('active');
    }
  }

  function hideThreshold() {
    if (elements.thresholdScreen) {
      elements.thresholdScreen.classList.remove('active');
    }
  }

  function getInputText() {
    return elements.userInput ? elements.userInput.value.trim() : '';
  }

  function clearInput() {
    if (elements.userInput) {
      elements.userInput.value = '';
      autoResizeInput();
    }
  }

  function setInputEnabled(isEnabled) {
    if (elements.userInput) {
      elements.userInput.disabled = !isEnabled;
      if (isEnabled) elements.userInput.focus();
    }
    if (elements.sendBtn) {
      elements.sendBtn.disabled = !isEnabled;
    }
  }

  function autoResizeInput() {
    var input = elements.userInput;
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 150) + 'px';
  }

  function updateHint(phase, activeCount) {
    if (!elements.inputHint) return;
    if (phase <= 2) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Socrates is convening. Present your challenge.</span>';
    } else if (phase <= 5) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The Symposium deliberates. Interject if needed.</span>';
    } else if (phase <= 7) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Plans and counsel. The Symposium is converging.</span>';
    } else if (phase === 8) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The Bell has sounded. The lesson record is above.</span>';
    } else if (activeCount === 0) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The Symposium awaits.</span>';
    }
  }

  function toggleSettings() {
    if (elements.settingsPanel) elements.settingsPanel.classList.toggle('hidden');
  }

  function hideSettings() {
    if (elements.settingsPanel) elements.settingsPanel.classList.add('hidden');
  }

  function showLoading(msg) {
    var existing = document.getElementById('symposium-loading');
    if (existing) existing.remove();
    if (!elements.dialogueMessages) return;
    var el = document.createElement('div');
    el.id = 'symposium-loading';
    el.className = 'message message-system loading-indicator';
    el.innerHTML = '<div class="message-body"><span class="loading-dots"></span> ' + escapeHtml(msg || 'Loading...') + '</div>';
    elements.dialogueMessages.appendChild(el);
    smartScroll();
  }

  function hideLoading() {
    var el = document.getElementById('symposium-loading');
    if (el) el.remove();
  }

  var scrollPinned = true;
  var BOTTOM_THRESHOLD = 48;
  var jumpBtn = null;

  function initSmartScroll() {
    if (!elements.dialogueScroll) return;
    jumpBtn = document.getElementById('jump-to-latest');

    elements.dialogueScroll.addEventListener('scroll', function () {
      var el = elements.dialogueScroll;
      var distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      scrollPinned = distFromBottom <= BOTTOM_THRESHOLD;
      if (jumpBtn) {
        if (!scrollPinned) {
          jumpBtn.classList.add('visible');
        } else {
          jumpBtn.classList.remove('visible');
        }
      }
    });

    if (jumpBtn) {
      jumpBtn.addEventListener('click', function () {
        scrollPinned = true;
        scrollToBottom();
        jumpBtn.classList.remove('visible');
      });
    }
  }

  function scrollToBottom() {
    if (!elements.dialogueScroll) return;
    requestAnimationFrame(function () {
      elements.dialogueScroll.scrollTop = elements.dialogueScroll.scrollHeight;
    });
  }

  function smartScroll() {
    if (scrollPinned) {
      scrollToBottom();
    } else if (jumpBtn) {
      jumpBtn.classList.add('visible');
    }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderMarkdownLight(text) {
    if (!text) return '';
    var html = text;
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');
    html = html.replace(/^### (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^## (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^# (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/\*\*\[([^\]]+)\]:\*\*/g, '<span class="speaker-header">$1:</span>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    html = html.replace(/\n\n+/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p>\s*<\/p>/g, '');
    return html;
  }

  function init() {
    cacheElements();
    if (elements.userInput) {
      elements.userInput.placeholder = 'Address the Symposium...';
      elements.userInput.addEventListener('input', autoResizeInput);
    }
    initSmartScroll();
  }

  return {
    init: init,
    showScreen: showScreen,
    updatePhase: updatePhase,
    addSeekerMessage: addSeekerMessage,
    addPersonaMessage: addPersonaMessage,
    addSystemMessage: addSystemMessage,
    addPersonaBadge: addPersonaBadge,
    removePersonaBadge: removePersonaBadge,
    clearPersonaBadges: clearPersonaBadges,
    addLessonCard: addLessonCard,
    showThreshold: showThreshold,
    hideThreshold: hideThreshold,
    getInputText: getInputText,
    clearInput: clearInput,
    setInputEnabled: setInputEnabled,
    updateHint: updateHint,
    toggleSettings: toggleSettings,
    hideSettings: hideSettings,
    showLoading: showLoading,
    hideLoading: hideLoading,
    autoResizeInput: autoResizeInput,
    elements: function () { return elements; }
  };

})();
