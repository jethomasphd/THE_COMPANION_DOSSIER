/* ═══════════════════════════════════════════════════════════════
   LATENT DIALOGIC SPACE — UI State Management
   Handles screen transitions, dialogue rendering, persona badges,
   and all user-facing state.
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
      settingsToggle: document.getElementById('settings-toggle'),
      settingsPanel: document.getElementById('settings-panel'),
      settingsModel: document.getElementById('settings-model'),
      exportBtn: document.getElementById('export-btn'),
      releaseAllBtn: document.getElementById('release-all-btn'),
      closeSettings: document.getElementById('close-settings')
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
    header.textContent = personaName || 'The Committee';
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

  function updateHint(activeCount) {
    if (!elements.inputHint) return;
    if (activeCount === 0) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The Architects await.</span>';
    } else {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Ask about the methodology. Challenge it. Bring your own matter.</span>';
    }
  }

  function toggleSettings() {
    if (elements.settingsPanel) elements.settingsPanel.classList.toggle('hidden');
  }

  function hideSettings() {
    if (elements.settingsPanel) elements.settingsPanel.classList.add('hidden');
  }

  // -- Smart Scroll --
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
      elements.userInput.placeholder = 'Ask the Architects...';
      elements.userInput.addEventListener('input', autoResizeInput);
    }
    initSmartScroll();
  }

  return {
    init: init,
    showScreen: showScreen,
    addSeekerMessage: addSeekerMessage,
    addPersonaMessage: addPersonaMessage,
    addSystemMessage: addSystemMessage,
    addPersonaBadge: addPersonaBadge,
    removePersonaBadge: removePersonaBadge,
    clearPersonaBadges: clearPersonaBadges,
    getInputText: getInputText,
    clearInput: clearInput,
    setInputEnabled: setInputEnabled,
    updateHint: updateHint,
    toggleSettings: toggleSettings,
    hideSettings: hideSettings,
    autoResizeInput: autoResizeInput,
    elements: function () { return elements; }
  };

})();
