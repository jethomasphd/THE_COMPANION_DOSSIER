/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — UI State Management
   Handles screen transitions, dialogue rendering, persona badges,
   and all user-facing state.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.UI = (function () {

  // ── DOM References ──
  let screens = {};
  let elements = {};

  function cacheElements() {
    screens = {
      void: document.getElementById('void-screen'),
      config: document.getElementById('config-screen'),
      chamber: document.getElementById('chamber-screen')
    };

    elements = {
      // Void
      enterBtn: document.getElementById('enter-btn'),
      voidParticles: document.getElementById('void-particles'),

      // Config
      apiKeyInput: document.getElementById('api-key-input'),
      modelSelect: document.getElementById('model-select'),
      saveKeyBtn: document.getElementById('save-key-btn'),

      // Chamber
      personaBadges: document.getElementById('persona-badges'),
      personaLabels: document.getElementById('persona-labels'),
      dialogueMessages: document.getElementById('dialogue-messages'),
      dialogueScroll: document.getElementById('dialogue-scroll'),
      userInput: document.getElementById('user-input'),
      sendBtn: document.getElementById('send-btn'),
      inputHint: document.getElementById('input-hint'),

      // Controls
      voiceToggle: document.getElementById('voice-toggle'),
      settingsToggle: document.getElementById('settings-toggle'),
      settingsPanel: document.getElementById('settings-panel'),
      settingsModel: document.getElementById('settings-model'),
      settingsVoiceRate: document.getElementById('settings-voice-rate'),
      changeKeyBtn: document.getElementById('change-key-btn'),
      releaseAllBtn: document.getElementById('release-all-btn'),
      closeSettings: document.getElementById('close-settings')
    };
  }


  // ── Screen Transitions ──

  function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (screens[screenName]) {
      screens[screenName].classList.add('active');
    }
  }


  // ── Void Screen Particles ──

  function initVoidParticles() {
    const container = elements.voidParticles;
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'void-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = 40 + Math.random() * 50 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = 6 + Math.random() * 6 + 's';
      container.appendChild(particle);
    }
  }


  // ── Dialogue Management ──

  /**
   * Add a seeker (user) message to the dialogue.
   */
  function addSeekerMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message message-seeker';
    msg.innerHTML = '<div class="message-bubble">' + escapeHtml(text) + '</div>';
    elements.dialogueMessages.appendChild(msg);
    scrollToBottom();
    return msg;
  }

  /**
   * Add a persona message to the dialogue.
   * Returns an object with update() and finish() methods for streaming.
   */
  function addPersonaMessage(personaName, color) {
    const msg = document.createElement('div');
    msg.className = 'message message-persona';

    const header = document.createElement('div');
    header.className = 'message-header';
    header.style.color = color;
    header.textContent = personaName || 'The Chamber';
    msg.appendChild(header);

    const body = document.createElement('div');
    body.className = 'message-body';
    body.style.borderLeftColor = color;
    msg.appendChild(body);

    const cursor = document.createElement('span');
    cursor.className = 'streaming-cursor';
    body.appendChild(cursor);

    elements.dialogueMessages.appendChild(msg);
    scrollToBottom();

    let rawText = '';

    return {
      /**
       * Append streaming text chunk.
       */
      update: function (chunk) {
        rawText += chunk;
        // Render markdown-light
        body.innerHTML = renderMarkdownLight(rawText);
        // Re-add cursor
        body.appendChild(cursor);
        scrollToBottom();
      },

      /**
       * Finalize the message (remove cursor).
       */
      finish: function () {
        body.innerHTML = renderMarkdownLight(rawText);
        scrollToBottom();
      },

      /**
       * Get the raw response text.
       */
      getText: function () {
        return rawText;
      },

      /**
       * Update the header (useful for symposium where speaker changes).
       */
      setHeader: function (name, clr) {
        header.textContent = name;
        header.style.color = clr;
        body.style.borderLeftColor = clr;
      }
    };
  }

  /**
   * Add a system message (italic, centered).
   */
  function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message message-system';
    msg.innerHTML = '<div class="message-body">' + escapeHtml(text) + '</div>';
    elements.dialogueMessages.appendChild(msg);
    scrollToBottom();
  }


  // ── Persona Badges ──

  function addPersonaBadge(name, color, onDismiss) {
    const badge = document.createElement('div');
    badge.className = 'persona-badge';
    badge.style.color = color;
    badge.style.borderColor = color;
    badge.dataset.persona = name;

    badge.innerHTML = '<span class="badge-name">' + escapeHtml(name) + '</span>' +
                      '<span class="badge-dismiss" title="Release">&times;</span>';

    badge.querySelector('.badge-dismiss').addEventListener('click', function () {
      if (onDismiss) onDismiss(name);
    });

    elements.personaBadges.appendChild(badge);

    // Add hologram label
    addPersonaLabel(name, color);
  }

  function removePersonaBadge(name) {
    const badge = elements.personaBadges.querySelector('[data-persona="' + name + '"]');
    if (badge) {
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0.8)';
      setTimeout(function () { badge.remove(); }, 300);
    }

    removePersonaLabel(name);
  }

  function clearPersonaBadges() {
    elements.personaBadges.innerHTML = '';
    elements.personaLabels.innerHTML = '';
  }

  function setPersonaBadgeSpeaking(name, isSpeaking) {
    const badges = elements.personaBadges.querySelectorAll('.persona-badge');
    badges.forEach(function (badge) {
      if (badge.dataset.persona === name) {
        badge.classList.toggle('speaking', isSpeaking);
      } else {
        badge.classList.remove('speaking');
      }
    });
  }


  // ── Hologram Labels ──

  function addPersonaLabel(name, color) {
    const label = document.createElement('div');
    label.className = 'persona-label';
    label.style.color = color;
    label.textContent = name;
    label.dataset.persona = name;
    elements.personaLabels.appendChild(label);

    // Trigger appearance
    requestAnimationFrame(function () {
      label.classList.add('visible');
    });
  }

  function removePersonaLabel(name) {
    const label = elements.personaLabels.querySelector('[data-persona="' + name + '"]');
    if (label) {
      label.classList.remove('visible');
      setTimeout(function () { label.remove(); }, 600);
    }
  }


  // ── Input Management ──

  function getInputText() {
    return elements.userInput.value.trim();
  }

  function clearInput() {
    elements.userInput.value = '';
    autoResizeInput();
  }

  function setInputEnabled(isEnabled) {
    elements.userInput.disabled = !isEnabled;
    elements.sendBtn.disabled = !isEnabled;
    if (isEnabled) {
      elements.userInput.focus();
    }
  }

  function autoResizeInput() {
    const input = elements.userInput;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 150) + 'px';
  }

  function updateHint(activePersonaCount) {
    if (activePersonaCount === 0) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Say <code>Using this matter, summon [Name].</code> to begin.</span>';
    } else if (activePersonaCount === 1) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Speak freely, or <code>Now summon [Name] to join this conversation.</code></span>';
    } else {
      elements.inputHint.innerHTML =
        '<span class="hint-text">Address the symposium. <code>Release [Name]</code> to dismiss a voice.</span>';
    }
  }


  // ── Settings Panel ──

  function toggleSettings() {
    elements.settingsPanel.classList.toggle('hidden');
  }

  function hideSettings() {
    elements.settingsPanel.classList.add('hidden');
  }


  // ── Voice Toggle ──

  function setVoiceToggleState(isActive) {
    elements.voiceToggle.classList.toggle('active', isActive);
  }


  // ── Utilities ──

  function scrollToBottom() {
    requestAnimationFrame(function () {
      elements.dialogueScroll.scrollTop = elements.dialogueScroll.scrollHeight;
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Lightweight markdown renderer for persona responses.
   * Handles: bold, italic, blockquotes, paragraphs, headers, code.
   */
  function renderMarkdownLight(text) {
    if (!text) return '';

    let html = text;

    // Escape HTML entities first
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Restore blockquote markers (we escaped the >)
    html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');

    // Merge adjacent blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^## (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^# (.+)$/gm, '<strong>$1</strong>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Paragraphs (double newline)
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
    initVoidParticles();

    // Auto-resize textarea
    if (elements.userInput) {
      elements.userInput.addEventListener('input', autoResizeInput);
    }
  }


  // ── Public API ──
  return {
    init,
    showScreen,
    addSeekerMessage,
    addPersonaMessage,
    addSystemMessage,
    addPersonaBadge,
    removePersonaBadge,
    clearPersonaBadges,
    setPersonaBadgeSpeaking,
    getInputText,
    clearInput,
    setInputEnabled,
    updateHint,
    toggleSettings,
    hideSettings,
    setVoiceToggleState,
    autoResizeInput,
    elements: function () { return elements; }
  };

})();
