/* ═══════════════════════════════════════════════════════════════
   THE CHAIR — UI State Management
   Handles screen transitions, dialogue rendering, persona badges,
   and all user-facing state.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.UI = (function () {

  // ── DOM References ──
  var screens = {};
  var elements = {};

  function cacheElements() {
    screens = {
      void: document.getElementById('void-screen'),
      config: document.getElementById('config-screen'),
      chamber: document.getElementById('chamber-screen')
    };

    elements = {
      // Void
      enterBtn: document.getElementById('enter-btn'),
      emberField: document.getElementById('ember-field'),

      // Binding (Config)
      apiKeyInput: document.getElementById('api-key-input'),
      modelSelect: document.getElementById('model-select'),
      saveKeyBtn: document.getElementById('save-key-btn'),

      // Chamber
      personaBadges: document.getElementById('persona-badges'),
      dialogueMessages: document.getElementById('dialogue-messages'),
      dialogueScroll: document.getElementById('dialogue-scroll'),
      userInput: document.getElementById('user-input'),
      sendBtn: document.getElementById('send-btn'),
      inputHint: document.getElementById('input-hint'),

      // Controls
      settingsToggle: document.getElementById('settings-toggle'),
      settingsPanel: document.getElementById('settings-panel'),
      settingsModel: document.getElementById('settings-model'),
      exportBtn: document.getElementById('export-btn'),
      releaseAllBtn: document.getElementById('release-all-btn'),
      closeSettings: document.getElementById('close-settings')
    };
  }


  // ── Screen Transitions ──

  function showScreen(screenName) {
    Object.values(screens).forEach(function (s) {
      if (s) s.classList.remove('active');
    });
    if (screens[screenName]) {
      screens[screenName].classList.add('active');
    }
  }


  // ── Dialogue Management ──

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


  // ── Persona Badges ──

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

  function setPersonaBadgeSpeaking(name, isSpeaking) {
    if (!elements.personaBadges) return;
    var badges = elements.personaBadges.querySelectorAll('.persona-badge');
    badges.forEach(function (badge) {
      if (badge.dataset.persona === name) {
        badge.classList.toggle('speaking', isSpeaking);
      } else {
        badge.classList.remove('speaking');
      }
    });
  }


  // ── Input Management ──

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

  function updateHint(activePersonaCount) {
    if (!elements.inputHint) return;
    if (activePersonaCount === 0) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Say <code>Using this matter, summon Washington.</code> to convene.</span>';
    } else if (activePersonaCount === 1) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Address the patriot, or <code>Now summon Hamilton to join.</code></span>';
    } else if (activePersonaCount < 4) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Address the Committee. <code>Now summon Jefferson to join.</code> or <code>Release Hamilton.</code></span>';
    } else {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The Committee is convened with the Epstein files. Address them on this matter.</span>';
    }
  }


  // ── Settings Panel ──

  function toggleSettings() {
    if (elements.settingsPanel) elements.settingsPanel.classList.toggle('hidden');
  }

  function hideSettings() {
    if (elements.settingsPanel) elements.settingsPanel.classList.add('hidden');
  }


  // ── Smart Autoscroll ──
  // Only auto-scroll when the user is at/near the bottom.
  // If user scrolls away, freeze position and show "Jump to latest" button.

  var scrollPinned = true;          // true = user is at bottom, auto-scroll active
  var BOTTOM_THRESHOLD = 48;        // px from bottom considered "at bottom"
  var jumpBtn = null;               // cached reference to jump-to-latest button

  function initSmartScroll() {
    if (!elements.dialogueScroll) return;

    jumpBtn = document.getElementById('jump-to-latest');

    elements.dialogueScroll.addEventListener('scroll', function () {
      var el = elements.dialogueScroll;
      var distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      var wasPinned = scrollPinned;
      scrollPinned = distFromBottom <= BOTTOM_THRESHOLD;

      // Show/hide jump button
      if (jumpBtn) {
        if (!scrollPinned) {
          jumpBtn.classList.add('visible');
        } else {
          jumpBtn.classList.remove('visible');
        }
      }
    });

    // Jump-to-latest click handler
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

    // Escape HTML entities first
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Restore blockquote markers
    html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^## (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^# (.+)$/gm, '<strong>$1</strong>');

    // Bold — also detect speaker headers like **[Gen. Washington]:**
    html = html.replace(/\*\*\[([^\]]+)\]:\*\*/g, '<span class="speaker-header">$1:</span>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Paragraphs
    html = html.replace(/\n\n+/g, '</p><p>');

    // Single newlines to <br>
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  }


  // ── Initialization ──

  function init() {
    cacheElements();

    // Auto-resize textarea
    if (elements.userInput) {
      elements.userInput.addEventListener('input', autoResizeInput);
    }

    // Smart autoscroll (after DOM is ready)
    initSmartScroll();
  }


  // ── Public API ──
  return {
    init: init,
    showScreen: showScreen,
    addSeekerMessage: addSeekerMessage,
    addPersonaMessage: addPersonaMessage,
    addSystemMessage: addSystemMessage,
    addPersonaBadge: addPersonaBadge,
    removePersonaBadge: removePersonaBadge,
    clearPersonaBadges: clearPersonaBadges,
    setPersonaBadgeSpeaking: setPersonaBadgeSpeaking,
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
