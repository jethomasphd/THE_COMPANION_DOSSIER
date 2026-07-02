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

  function attachCopyAction(msg, getRaw) {
    var actions = document.createElement('div');
    actions.className = 'msg-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'msg-copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var text = getRaw() || '';
      var done = function () {
        btn.textContent = 'Copied ✓';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* unavailable */ }
        ta.remove();
        done();
      }
    });
    actions.appendChild(btn);
    msg.appendChild(actions);
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
    var finished = false;
    return {
      update: function (chunk) {
        rawText += chunk;
        body.innerHTML = renderMarkdownLight(rawText);
        body.appendChild(cursor);
        smartScroll();
      },
      finish: function () {
        if (finished) return;
        finished = true;
        body.innerHTML = renderMarkdownLight(rawText);
        if (rawText.trim()) attachCopyAction(msg, function () { return rawText; });
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

  // A finished persona message restored from a saved session.
  function addPersonaMessageStatic(personaName, color, html) {
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
    body.innerHTML = html || '';
    msg.appendChild(body);
    attachCopyAction(msg, function () { return body.textContent; });
    if (elements.dialogueMessages) elements.dialogueMessages.appendChild(msg);
    return msg;
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
  function setInputText(text) {
    if (elements.userInput) { elements.userInput.value = text || ''; autoResizeInput(); }
  }
  function setInputEnabled(isEnabled) {
    if (elements.userInput) {
      elements.userInput.disabled = !isEnabled;
      if (isEnabled) elements.userInput.focus();
    }
    if (elements.sendBtn) elements.sendBtn.disabled = !isEnabled;
  }

  // While a response streams, the seeker keeps the composer and the
  // send button becomes a stop button (ChatGPT-style).
  function setStreaming(isStreaming) {
    if (elements.sendBtn) {
      elements.sendBtn.classList.toggle('streaming', !!isStreaming);
      elements.sendBtn.disabled = false;
      elements.sendBtn.title = isStreaming ? 'Stop' : 'Send';
      elements.sendBtn.setAttribute('aria-label', isStreaming ? 'Stop the response' : 'Send');
      elements.sendBtn.innerHTML = isStreaming ? '<span class="stop-square"></span>' : '<span>&#10148;</span>';
    }
    if (elements.userInput) elements.userInput.disabled = false;
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

  // Inline markdown on an already HTML-escaped line.
  function renderInline(s) {
    // Speaker labels like **[Socrates]:**
    s = s.replace(/\*\*\[([^\]]+)\]:\*\*/g, '<span class="speaker-header">$1:</span>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/`(.+?)`/g, '<code>$1</code>');
    return s;
  }

  // Light block-level markdown: paragraphs, lists, blockquotes,
  // headings (rendered as bold lines), horizontal rules.
  function renderMarkdownLight(text) {
    if (!text) return '';
    var escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    var out = [];
    var para = [];
    var listType = null; // 'ul' | 'ol'

    function flushPara() {
      if (para.length) { out.push('<p>' + para.join('<br>') + '</p>'); para = []; }
    }
    function flushList() {
      if (listType) { out.push('</' + listType + '>'); listType = null; }
    }
    function openList(type) {
      if (listType !== type) { flushList(); out.push('<' + type + '>'); listType = type; }
    }

    escaped.split('\n').forEach(function (line) {
      var mUl = line.match(/^\s*[-*•]\s+(.+)$/);
      var mOl = line.match(/^\s*\d+[.)]\s+(.+)$/);
      var mBq = line.match(/^&gt;\s?(.*)$/);
      var mH = line.match(/^#{1,4}\s+(.+)$/);
      if (mUl) { flushPara(); openList('ul'); out.push('<li>' + renderInline(mUl[1]) + '</li>'); }
      else if (mOl) { flushPara(); openList('ol'); out.push('<li>' + renderInline(mOl[1]) + '</li>'); }
      else if (mBq) { flushPara(); flushList(); out.push('<blockquote>' + renderInline(mBq[1]) + '</blockquote>'); }
      else if (mH) { flushPara(); flushList(); out.push('<p><strong>' + renderInline(mH[1]) + '</strong></p>'); }
      else if (/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)) { flushPara(); flushList(); out.push('<hr>'); }
      else if (!line.trim()) { flushPara(); flushList(); }
      else { flushList(); para.push(renderInline(line)); }
    });
    flushPara();
    flushList();

    return out.join('').replace(/<\/blockquote><blockquote>/g, '<br>');
  }


  function init() {
    cacheElements();
    if (elements.userInput) elements.userInput.addEventListener('input', autoResizeInput);
    if (elements.dialogueMessages) elements.dialogueMessages.setAttribute('aria-live', 'polite');
    initSmartScroll();
  }


  return {
    init: init,
    elems: elems,
    showScreen: showScreen,
    addSeekerMessage: addSeekerMessage,
    addPersonaMessage: addPersonaMessage,
    addPersonaMessageStatic: addPersonaMessageStatic,
    addSystemMessage: addSystemMessage,
    clearDialogue: clearDialogue,
    addPersonaBadge: addPersonaBadge,
    removePersonaBadge: removePersonaBadge,
    clearPersonaBadges: clearPersonaBadges,
    setWorkingTitle: setWorkingTitle,
    getInputText: getInputText,
    clearInput: clearInput,
    setInputText: setInputText,
    setInputEnabled: setInputEnabled,
    setStreaming: setStreaming,
    updateHint: updateHint,
    toggleSettings: toggleSettings,
    hideSettings: hideSettings,
    escapeHtml: escapeHtml,
    renderMarkdownLight: renderMarkdownLight
  };

})();
