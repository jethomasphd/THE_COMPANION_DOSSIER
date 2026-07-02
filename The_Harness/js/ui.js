/* ═══════════════════════════════════════════════════════════════
   THE HARNESS — Chamber UI
   Dialogue rendering, persona badges, input state, smart scroll,
   and the light markdown renderer shared across the estate.
   The workshop's own UI lives in workshop.js; this file owns the
   chamber where the summoned minds speak.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.UI = (function () {

  var elements = {};

  function cacheElements() {
    elements = {
      // Binding (BYO key fallback)
      apiKeyInput: document.getElementById('api-key-input'),
      saveKeyBtn: document.getElementById('save-key-btn'),

      // Chamber
      personaBadges: document.getElementById('persona-badges'),
      workingTitle: document.getElementById('working-title'),
      dialogueMessages: document.getElementById('dialogue-messages'),
      dialogueScroll: document.getElementById('dialogue-scroll'),
      userInput: document.getElementById('user-input'),
      sendBtn: document.getElementById('send-btn'),
      inputHint: document.getElementById('input-hint'),
      jumpBtn: document.getElementById('jump-to-latest'),

      // Controls
      settingsToggle: document.getElementById('settings-toggle'),
      settingsPanel: document.getElementById('settings-panel'),
      settingsModel: document.getElementById('settings-model'),
      exportBtn: document.getElementById('export-btn'),
      reworkBtn: document.getElementById('rework-btn'),
      releaseAllBtn: document.getElementById('release-all-btn'),
      closeSettings: document.getElementById('close-settings')
    };
  }

  function elems() { return elements; }


  // ── Screen transitions ──

  function showScreen(name) {
    var ids = { intro: 'cinematic-intro', workshop: 'workshop-screen', chamber: 'chamber-screen' };
    Object.keys(ids).forEach(function (k) {
      var el = document.getElementById(ids[k]);
      if (!el) return;
      if (k === name) { el.classList.remove('hidden'); el.classList.add('active'); }
      else { el.classList.add('hidden'); el.classList.remove('active'); }
    });
    window.scrollTo(0, 0);
  }


  // ── Dialogue ──

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
    header.style.color = color || '#c9a54e';
    header.textContent = personaName || 'The Working';
    msg.appendChild(header);

    var body = document.createElement('div');
    body.className = 'message-body';
    body.style.borderLeftColor = color || '#c9a54e';
    msg.appendChild(body);

    var cursor = document.createElement('span');
    cursor.className = 'streaming-cursor';
    body.appendChild(cursor);

    if (elements.dialogueMessages) elements.dialogueMessages.appendChild(msg);
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
      getText: function () { return rawText; },
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

  function clearDialogue() {
    if (elements.dialogueMessages) elements.dialogueMessages.innerHTML = '';
  }


  // ── Persona badges ──

  function addPersonaBadge(name, color, onDismiss) {
    if (!elements.personaBadges) return;
    if (elements.personaBadges.querySelector('[data-persona="' + cssEscape(name) + '"]')) return;
    var badge = document.createElement('div');
    badge.className = 'persona-badge';
    badge.style.color = color;
    badge.style.borderColor = color;
    badge.dataset.persona = name;
    badge.innerHTML = '<span class="badge-dot"></span><span class="badge-name">' + escapeHtml(name) + '</span>' +
      '<span class="badge-dismiss" title="Release">&times;</span>';
    badge.querySelector('.badge-dismiss').addEventListener('click', function () {
      if (onDismiss) onDismiss(name);
    });
    elements.personaBadges.appendChild(badge);
  }

  function removePersonaBadge(name) {
    if (!elements.personaBadges) return;
    var badge = elements.personaBadges.querySelector('[data-persona="' + cssEscape(name) + '"]');
    if (badge) {
      badge.style.opacity = '0';
      badge.style.transform = 'scale(0.85)';
      setTimeout(function () { badge.remove(); }, 300);
    }
  }

  function clearPersonaBadges() {
    if (elements.personaBadges) elements.personaBadges.innerHTML = '';
  }

  function setWorkingTitle(text) {
    if (elements.workingTitle) elements.workingTitle.textContent = text || 'The Working';
  }


  // ── Input ──

  function getInputText() { return elements.userInput ? elements.userInput.value.trim() : ''; }
  function clearInput() {
    if (elements.userInput) { elements.userInput.value = ''; autoResizeInput(); }
  }
  function setInputEnabled(isEnabled) {
    if (elements.userInput) {
      elements.userInput.disabled = !isEnabled;
      if (isEnabled) elements.userInput.focus();
    }
    if (elements.sendBtn) elements.sendBtn.disabled = !isEnabled;
  }
  function autoResizeInput() {
    var input = elements.userInput;
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 160) + 'px';
  }

  function updateHint(count) {
    if (!elements.inputHint) return;
    var html;
    if (count === 0) {
      html = 'No mind is present. Say <code>Using this matter, summon [Name].</code>';
    } else if (count === 1) {
      html = 'Speak freely — or <code>Now summon [Name] to join.</code> to open a symposium.';
    } else {
      html = 'The symposium is convened. Address them, or <code>Release [Name].</code> to let one withdraw.';
    }
    elements.inputHint.innerHTML = '<span class="hint-text">' + html + '</span>';
  }


  // ── Settings ──

  function toggleSettings() { if (elements.settingsPanel) elements.settingsPanel.classList.toggle('hidden'); }
  function hideSettings() { if (elements.settingsPanel) elements.settingsPanel.classList.add('hidden'); }


  // ── Smart scroll ──

  var scrollPinned = true;
  var BOTTOM_THRESHOLD = 56;

  function initSmartScroll() {
    if (!elements.dialogueScroll) return;
    elements.dialogueScroll.addEventListener('scroll', function () {
      var el = elements.dialogueScroll;
      var dist = el.scrollHeight - el.scrollTop - el.clientHeight;
      scrollPinned = dist <= BOTTOM_THRESHOLD;
      if (elements.jumpBtn) elements.jumpBtn.classList.toggle('visible', !scrollPinned);
    });
    if (elements.jumpBtn) {
      elements.jumpBtn.addEventListener('click', function () {
        scrollPinned = true;
        scrollToBottom();
        elements.jumpBtn.classList.remove('visible');
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
    if (scrollPinned) scrollToBottom();
    else if (elements.jumpBtn) elements.jumpBtn.classList.add('visible');
  }


  // ── Helpers ──

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text == null ? '' : text;
    return div.innerHTML;
  }

  function cssEscape(s) { return String(s).replace(/"/g, '\\"'); }

  function renderMarkdownLight(text) {
    if (!text) return '';
    var html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    html = html.replace(/^### (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^## (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^# (.+)$/gm, '<strong>$1</strong>');

    // Speaker labels like **[Socrates]:**
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
    if (elements.userInput) elements.userInput.addEventListener('input', autoResizeInput);
    initSmartScroll();
  }


  return {
    init: init,
    elems: elems,
    showScreen: showScreen,
    addSeekerMessage: addSeekerMessage,
    addPersonaMessage: addPersonaMessage,
    addSystemMessage: addSystemMessage,
    clearDialogue: clearDialogue,
    addPersonaBadge: addPersonaBadge,
    removePersonaBadge: removePersonaBadge,
    clearPersonaBadges: clearPersonaBadges,
    setWorkingTitle: setWorkingTitle,
    getInputText: getInputText,
    clearInput: clearInput,
    setInputEnabled: setInputEnabled,
    updateHint: updateHint,
    toggleSettings: toggleSettings,
    hideSettings: hideSettings,
    escapeHtml: escapeHtml,
    renderMarkdownLight: renderMarkdownLight
  };

})();
