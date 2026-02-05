/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — Application Orchestration
   Binds all modules together: Protocol, API, Hologram, Voice, UI.
   Manages session state and the ritual flow.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.App = (function () {

  // ── Session State ──
  let activePersonas = [];  // [{ name, color, category }]
  let isStreaming = false;
  let currentStreamMessage = null;


  // ── Initialization ──

  function init() {
    // Initialize UI
    COMPANION.UI.init();

    // Initialize Voice
    COMPANION.Voice.init({
      onSpeakingStart: function (personaName) {
        COMPANION.Hologram.setSpeaking(personaName, true);
        COMPANION.UI.setPersonaBadgeSpeaking(personaName, true);
      },
      onSpeakingEnd: function (personaName) {
        COMPANION.Hologram.clearSpeaking();
        COMPANION.UI.setPersonaBadgeSpeaking(personaName, false);
      }
    });

    // Bind events
    bindEvents();

    // Check if API key already exists
    if (COMPANION.API.hasApiKey()) {
      // Show void screen briefly, then allow entry to chamber
      COMPANION.UI.showScreen('void');
    } else {
      COMPANION.UI.showScreen('void');
    }

    // Set initial model in settings
    var els = COMPANION.UI.elements();
    if (els.settingsModel) {
      els.settingsModel.value = COMPANION.API.getModel();
    }
    if (els.modelSelect) {
      els.modelSelect.value = COMPANION.API.getModel();
    }

    COMPANION.UI.updateHint(0);
  }


  // ── Event Binding ──

  function bindEvents() {
    var els = COMPANION.UI.elements();

    // Void → Enter
    els.enterBtn.addEventListener('click', function () {
      if (COMPANION.API.hasApiKey()) {
        enterChamber();
      } else {
        COMPANION.UI.showScreen('config');
      }
    });

    // Config → Save key
    els.saveKeyBtn.addEventListener('click', function () {
      var key = els.apiKeyInput.value.trim();
      if (!key) return;
      COMPANION.API.setApiKey(key);
      COMPANION.API.setModel(els.modelSelect.value);
      enterChamber();
    });

    // Send message
    els.sendBtn.addEventListener('click', handleSend);
    els.userInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Voice toggle
    els.voiceToggle.addEventListener('click', function () {
      var newState = !COMPANION.Voice.isEnabled();
      COMPANION.Voice.setEnabled(newState);
      COMPANION.UI.setVoiceToggleState(newState);
    });

    // Settings
    els.settingsToggle.addEventListener('click', function () {
      COMPANION.UI.toggleSettings();
    });

    els.closeSettings.addEventListener('click', function () {
      COMPANION.UI.hideSettings();
    });

    els.settingsModel.addEventListener('change', function () {
      COMPANION.API.setModel(els.settingsModel.value);
    });

    els.settingsVoiceRate.addEventListener('input', function () {
      COMPANION.Voice.setRate(parseFloat(els.settingsVoiceRate.value));
    });

    els.changeKeyBtn.addEventListener('click', function () {
      COMPANION.UI.hideSettings();
      COMPANION.UI.showScreen('config');
    });

    els.releaseAllBtn.addEventListener('click', function () {
      releaseAllPersonas();
      COMPANION.UI.hideSettings();
    });
  }


  // ── Chamber Entry ──

  function enterChamber() {
    COMPANION.UI.showScreen('chamber');

    // Initialize hologram renderer
    var holoContainer = document.getElementById('hologram-container');
    COMPANION.Hologram.init(holoContainer);

    // Focus input
    setTimeout(function () {
      COMPANION.UI.setInputEnabled(true);
    }, 500);
  }


  // ── Message Handling ──

  function handleSend() {
    if (isStreaming) return;

    var text = COMPANION.UI.getInputText();
    if (!text) return;

    // Add seeker message to UI
    COMPANION.UI.addSeekerMessage(text);
    COMPANION.UI.clearInput();
    COMPANION.UI.setInputEnabled(false);

    // Check for incantations
    var incantation = COMPANION.Protocol.parseIncantation(text);

    if (incantation) {
      handleIncantation(incantation, text);
    } else {
      // Regular message
      sendToAPI(text);
    }
  }


  // ── Incantation Handling ──

  function handleIncantation(incantation, fullText) {
    switch (incantation.type) {

      case 'summon':
        summonPersona(incantation.name, fullText);
        break;

      case 'summon_add':
        if (activePersonas.length >= 5) {
          COMPANION.UI.addSystemMessage('The symposium cannot hold more than five voices.');
          COMPANION.UI.setInputEnabled(true);
          return;
        }
        summonPersona(incantation.name, fullText);
        break;

      case 'release_one':
        releasePersona(incantation.release);
        if (activePersonas.length > 0) {
          COMPANION.UI.addSystemMessage(
            incantation.release + ' has departed. ' +
            activePersonas.map(function (p) { return p.name; }).join(', ') +
            (activePersonas.length === 1 ? ' remains.' : ' remain.')
          );
        } else {
          COMPANION.UI.addSystemMessage('The chamber is empty. The threshold awaits.');
        }
        COMPANION.UI.setInputEnabled(true);
        break;

      case 'release_all':
        releaseAllPersonas();
        COMPANION.UI.addSystemMessage('All voices have departed. The work remains.');
        COMPANION.UI.setInputEnabled(true);
        break;
    }
  }


  // ── Persona Summoning ──

  function summonPersona(name, contextText) {
    // Determine category and color
    var catInfo = COMPANION.Protocol.getPersonaCategory(name);

    // Check if already summoned
    var existing = activePersonas.find(function (p) {
      return p.name.toLowerCase() === name.toLowerCase();
    });
    if (existing) {
      COMPANION.UI.addSystemMessage(name + ' is already present.');
      COMPANION.UI.setInputEnabled(true);
      return;
    }

    // Add to active personas
    var persona = {
      name: name,
      color: catInfo.color,
      category: catInfo.category
    };
    activePersonas.push(persona);

    // Visual: summon hologram
    COMPANION.Hologram.summon(name, catInfo.color);

    // UI: add badge
    COMPANION.UI.addPersonaBadge(name, catInfo.color, function (dismissName) {
      releasePersona(dismissName);
      COMPANION.UI.addSystemMessage(dismissName + ' has departed.');
    });

    // Update hint
    COMPANION.UI.updateHint(activePersonas.length);

    // System message
    COMPANION.UI.addSystemMessage('Summoning ' + name + '...');

    // Send to API for the persona's arrival response
    sendToAPI(contextText);
  }


  // ── Persona Release ──

  function releasePersona(name) {
    var index = activePersonas.findIndex(function (p) {
      return p.name.toLowerCase() === name.toLowerCase();
    });

    if (index === -1) {
      // Try fuzzy match
      index = activePersonas.findIndex(function (p) {
        return p.name.toLowerCase().includes(name.toLowerCase()) ||
               name.toLowerCase().includes(p.name.toLowerCase());
      });
    }

    if (index !== -1) {
      var persona = activePersonas[index];
      activePersonas.splice(index, 1);
      COMPANION.Hologram.release(persona.name);
      COMPANION.UI.removePersonaBadge(persona.name);
      COMPANION.UI.updateHint(activePersonas.length);
    }

    COMPANION.Voice.stop();
  }

  function releaseAllPersonas() {
    activePersonas.forEach(function (p) {
      COMPANION.Hologram.release(p.name);
    });
    activePersonas = [];
    COMPANION.UI.clearPersonaBadges();
    COMPANION.UI.updateHint(0);
    COMPANION.Voice.stop();
    COMPANION.API.clearHistory();
  }


  // ── API Communication ──

  function sendToAPI(userText) {
    isStreaming = true;

    // Determine which persona name/color to use for the message
    var displayName = 'The Chamber';
    var displayColor = '#c9a54e';

    if (activePersonas.length === 1) {
      displayName = activePersonas[0].name;
      displayColor = activePersonas[0].color;
    } else if (activePersonas.length > 1) {
      displayName = 'Symposium';
      displayColor = '#c9a54e';
    }

    // Create streaming message container
    currentStreamMessage = COMPANION.UI.addPersonaMessage(displayName, displayColor);

    // Build system prompt with active persona names
    var personaNames = activePersonas.map(function (p) { return p.name; });
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(personaNames);

    // Track response for voice
    var responseChunks = [];

    COMPANION.API.sendMessage(
      userText,
      systemPrompt,

      // onChunk
      function (chunk) {
        currentStreamMessage.update(chunk);
        responseChunks.push(chunk);

        // Set speaking hologram for single persona
        if (activePersonas.length === 1) {
          COMPANION.Hologram.setSpeaking(activePersonas[0].name, true);
        }
      },

      // onDone
      function (fullText) {
        isStreaming = false;
        currentStreamMessage.finish();
        currentStreamMessage = null;
        COMPANION.UI.setInputEnabled(true);
        COMPANION.Hologram.clearSpeaking();

        // Voice synthesis
        if (fullText && COMPANION.Voice.isEnabled()) {
          if (activePersonas.length === 1) {
            COMPANION.Voice.speak(
              fullText,
              activePersonas[0].category,
              activePersonas[0].name
            );
          } else if (activePersonas.length > 1) {
            // For symposium, speak the whole thing with default voice
            COMPANION.Voice.speak(fullText, 'philosophical', 'Symposium');
          }
        }
      },

      // onError
      function (errorMessage) {
        isStreaming = false;
        if (currentStreamMessage) {
          currentStreamMessage.finish();
          currentStreamMessage = null;
        }
        COMPANION.UI.addSystemMessage('Error: ' + errorMessage);
        COMPANION.UI.setInputEnabled(true);
        COMPANION.Hologram.clearSpeaking();
      }
    );
  }


  // ── Public API ──
  return {
    init: init
  };

})();


// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', function () {
  COMPANION.App.init();
});
