/* ═══════════════════════════════════════════════════════════════
   THE EXCHANGE — UI State Management
   Handles screen transitions, dialogue rendering, persona badges,
   phase indicators, threshold reveal, and all user-facing state.
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
      saveKeyBtn: document.getElementById('save-key-btn'),

      // Chamber
      personaBadges: document.getElementById('persona-badges'),
      dialogueMessages: document.getElementById('dialogue-messages'),
      dialogueScroll: document.getElementById('dialogue-scroll'),
      userInput: document.getElementById('user-input'),
      sendBtn: document.getElementById('send-btn'),
      inputHint: document.getElementById('input-hint'),
      phaseIndicator: document.getElementById('phase-indicator'),

      // Controls
      settingsToggle: document.getElementById('settings-toggle'),
      settingsPanel: document.getElementById('settings-panel'),
      settingsModel: document.getElementById('settings-model'),
      changeKeyBtn: document.getElementById('change-key-btn'),
      releaseAllBtn: document.getElementById('release-all-btn'),
      closeSettings: document.getElementById('close-settings'),

      // Threshold
      thresholdScreen: document.getElementById('threshold-screen'),
      thresholdTitle: document.getElementById('threshold-job-title'),
      thresholdCompany: document.getElementById('threshold-company'),
      thresholdLocation: document.getElementById('threshold-location'),
      thresholdSalary: document.getElementById('threshold-salary'),
      thresholdBtn: document.getElementById('threshold-btn'),
      thresholdStatements: document.getElementById('threshold-statements')
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


  // ── Phase Indicator ──

  function updatePhase(phase) {
    if (!elements.phaseIndicator) return;
    var labels = {
      1: 'Phase I — The Invocation',
      2: 'Phase II — The Symposium',
      3: 'Phase III — The Threshold'
    };
    elements.phaseIndicator.textContent = labels[phase] || '';
    elements.phaseIndicator.className = 'phase-indicator phase-' + phase;
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
    header.textContent = personaName || 'The Exchange';
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


  // ── In-Chat Threshold Card ──

  function addThresholdCard(jobData, onCross) {
    if (!elements.dialogueMessages) return;

    var card = document.createElement('div');
    card.className = 'message threshold-chat-card';

    var html = '';
    html += '<div class="threshold-chat-ornament">&#9671; &#9672; &#9671;</div>';
    html += '<div class="threshold-chat-heading">The Committee Has Converged</div>';
    html += '<div class="threshold-chat-divider-line"></div>';

    html += '<div class="threshold-chat-job">';
    html += '<div class="threshold-chat-job-title">' + escapeHtml(jobData.title || 'Your Match') + '</div>';
    if (jobData.company) {
      html += '<div class="threshold-chat-job-company">' + escapeHtml(jobData.company) + '</div>';
    }
    var location = [jobData.city, jobData.state].filter(Boolean).join(', ');
    if (location) {
      html += '<div class="threshold-chat-job-location">' + escapeHtml(location) + '</div>';
    }
    if (jobData.salary) {
      html += '<div class="threshold-chat-job-salary">$' + Number(jobData.salary).toLocaleString() + '</div>';
    }
    html += '</div>';

    html += '<div class="threshold-chat-divider-line"></div>';
    html += '<button class="threshold-chat-btn">';
    html += '<span class="threshold-chat-btn-prefix">The threshold awaits.</span>';
    html += '<span class="threshold-chat-btn-main">Cross the Threshold</span>';
    html += '</button>';
    html += '<div class="threshold-chat-sigil">&#9830; &#9674; &#9830;</div>';

    card.innerHTML = html;

    var btn = card.querySelector('.threshold-chat-btn');
    if (btn && onCross) {
      btn.addEventListener('click', onCross);
    }

    elements.dialogueMessages.appendChild(card);
    smartScroll();
  }


  // ── Threshold Reveal (Full-Screen Overlay) ──

  function showThreshold(jobData, statements) {
    console.log('[Exchange UI] showThreshold called:', jobData);
    if (!elements.thresholdScreen) {
      console.error('[Exchange UI] #threshold-screen element not found!');
      return;
    }

    if (elements.thresholdTitle) elements.thresholdTitle.textContent = jobData.title || 'Unknown Role';
    if (elements.thresholdCompany) elements.thresholdCompany.textContent = jobData.company || '';
    if (elements.thresholdLocation) elements.thresholdLocation.textContent = (jobData.city || '') + ', ' + (jobData.state || '');
    if (elements.thresholdSalary) {
      if (jobData.salary) {
        elements.thresholdSalary.textContent = '$' + Number(jobData.salary).toLocaleString();
      } else {
        elements.thresholdSalary.textContent = '';
      }
    }

    if (elements.thresholdBtn && jobData.url) {
      elements.thresholdBtn.href = jobData.url;
      elements.thresholdBtn.target = '_blank';
      elements.thresholdBtn.rel = 'noopener noreferrer';
    }

    if (elements.thresholdStatements && statements) {
      elements.thresholdStatements.innerHTML = renderMarkdownLight(statements);
    }

    // Show threshold as full-screen overlay
    elements.thresholdScreen.classList.add('active');
  }

  function hideThreshold() {
    if (elements.thresholdScreen) {
      elements.thresholdScreen.classList.remove('active');
    }
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

  function updateHint(phase, activeCount) {
    if (!elements.inputHint) return;
    if (phase === 1) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The Coach is listening. Tell them where you\'ve been.</span>';
    } else if (phase === 2) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The Committee deliberates. Share your thoughts, ask questions.</span>';
    } else if (phase === 3) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The committee has spoken. Your threshold awaits above.</span>';
    } else if (activeCount === 0) {
      elements.inputHint.innerHTML =
        '<span class="hint-text">The Exchange awaits.</span>';
    }
  }


  // ── Settings Panel ──

  function toggleSettings() {
    if (elements.settingsPanel) elements.settingsPanel.classList.toggle('hidden');
  }

  function hideSettings() {
    if (elements.settingsPanel) elements.settingsPanel.classList.add('hidden');
  }


  // ── Loading Indicator ──

  function showLoading(msg) {
    var existing = document.getElementById('exchange-loading');
    if (existing) existing.remove();

    if (!elements.dialogueMessages) return;
    var el = document.createElement('div');
    el.id = 'exchange-loading';
    el.className = 'message message-system loading-indicator';
    el.innerHTML = '<div class="message-body"><span class="loading-dots"></span> ' + escapeHtml(msg || 'Loading...') + '</div>';
    elements.dialogueMessages.appendChild(el);
    smartScroll();
  }

  function hideLoading() {
    var el = document.getElementById('exchange-loading');
    if (el) el.remove();
  }


  // ── Smart Autoscroll ──

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


  // ── Markdown / Escaping ──

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderMarkdownLight(text) {
    if (!text) return '';

    var html = text;

    // Strip HTML comments (including THRESHOLD markers) before escaping
    html = html.replace(/<!--[\s\S]*?-->/g, '');

    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Blockquotes
    html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^## (.+)$/gm, '<strong>$1</strong>');
    html = html.replace(/^# (.+)$/gm, '<strong>$1</strong>');

    // Speaker headers: **[The Cartographer]:**
    html = html.replace(/\*\*\[([^\]]+)\]:\*\*/g, '<span class="speaker-header">$1:</span>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Paragraphs
    html = html.replace(/\n\n+/g, '</p><p>');

    // Single newlines
    html = html.replace(/\n/g, '<br>');

    html = '<p>' + html + '</p>';
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  }


  // ── Initialization ──

  function init() {
    cacheElements();

    if (elements.userInput) {
      elements.userInput.placeholder = 'Speak to the Exchange...';
      elements.userInput.addEventListener('input', autoResizeInput);
    }

    initSmartScroll();
  }


  // ── Public API ──
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
    addThresholdCard: addThresholdCard,
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
