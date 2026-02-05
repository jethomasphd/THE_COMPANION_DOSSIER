/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — Application Orchestration
   Binds all modules: Protocol, API, Hologram, Voice, UI.
   Manages session state, ambient audio, and ritual flow.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.App = (function () {

  // ── Session State ──
  var activePersonas = [];
  var isStreaming = false;
  var currentStreamMessage = null;
  var chamberInitialized = false;
  var ambientAudioCtx = null;
  var ambientGain = null;

  // ── Safe event binding ──
  function on(el, event, handler) {
    if (el) el.addEventListener(event, handler);
  }


  // ── Initialization ──

  function init() {
    try {
      COMPANION.UI.init();

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

      bindEvents();
      COMPANION.UI.showScreen('void');

      var els = COMPANION.UI.elements();
      if (els.settingsModel) {
        els.settingsModel.value = COMPANION.API.getModel();
      }
      if (els.modelSelect) {
        els.modelSelect.value = COMPANION.API.getModel();
      }

      // Restore ElevenLabs key if present
      if (els.elevenlabsKeyInput && COMPANION.Voice.hasElevenLabsKey()) {
        els.elevenlabsKeyInput.value = COMPANION.Voice.getElevenLabsKey();
      }

      // Auto-enable voice if ElevenLabs key or Web Speech available
      if (COMPANION.Voice.isAvailable()) {
        COMPANION.Voice.setEnabled(true);
        COMPANION.UI.setVoiceToggleState(true);
      }

      COMPANION.UI.updateHint(0);
    } catch (e) {
      console.error('COMPANION init error:', e);
    }
  }


  // ── Event Binding ──

  function bindEvents() {
    var els = COMPANION.UI.elements();

    // Void → Enter
    on(els.enterBtn, 'click', function () {
      if (COMPANION.API.hasApiKey()) {
        enterChamber();
      } else {
        COMPANION.UI.showScreen('config');
      }
    });

    // Config → Save keys
    on(els.saveKeyBtn, 'click', saveKeysAndEnter);

    on(els.apiKeyInput, 'keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveKeysAndEnter();
      }
    });

    // Send message
    on(els.sendBtn, 'click', handleSend);
    on(els.userInput, 'keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Voice toggle
    on(els.voiceToggle, 'click', function () {
      var newState = !COMPANION.Voice.isEnabled();
      COMPANION.Voice.setEnabled(newState);
      COMPANION.UI.setVoiceToggleState(newState);
    });

    // Settings
    on(els.settingsToggle, 'click', function () {
      COMPANION.UI.toggleSettings();
    });

    on(els.closeSettings, 'click', function () {
      COMPANION.UI.hideSettings();
    });

    on(els.settingsModel, 'change', function () {
      COMPANION.API.setModel(els.settingsModel.value);
    });

    on(els.settingsVoiceRate, 'input', function () {
      COMPANION.Voice.setRate(parseFloat(els.settingsVoiceRate.value));
    });

    on(els.changeKeyBtn, 'click', function () {
      COMPANION.UI.hideSettings();
      COMPANION.UI.showScreen('config');
    });

    on(els.releaseAllBtn, 'click', function () {
      releaseAllPersonas();
      COMPANION.UI.hideSettings();
    });
  }


  // ── Save Keys ──

  function saveKeysAndEnter() {
    var els = COMPANION.UI.elements();
    var key = els.apiKeyInput ? els.apiKeyInput.value.trim() : '';
    if (!key) return;

    COMPANION.API.setApiKey(key);

    if (els.modelSelect) {
      COMPANION.API.setModel(els.modelSelect.value);
    }

    // Save ElevenLabs key if provided
    if (els.elevenlabsKeyInput) {
      var elKey = els.elevenlabsKeyInput.value.trim();
      COMPANION.Voice.setElevenLabsKey(elKey);
      if (elKey) {
        COMPANION.Voice.setEnabled(true);
        COMPANION.UI.setVoiceToggleState(true);
      }
    }

    enterChamber();
  }


  // ── Chamber Entry ──

  function enterChamber() {
    COMPANION.UI.showScreen('chamber');

    if (!chamberInitialized) {
      try {
        var holoStage = document.getElementById('hologram-stage');
        if (holoStage) {
          COMPANION.Hologram.init(holoStage);
        }
        chamberInitialized = true;
      } catch (e) {
        console.error('Hologram init error:', e);
        chamberInitialized = true;
      }
    }

    // Start ambient audio on first user interaction
    startAmbientAudio();

    setTimeout(function () {
      COMPANION.UI.setInputEnabled(true);
    }, 500);
  }


  // ── Ambient Audio (Web Audio API) ──

  function startAmbientAudio() {
    if (ambientAudioCtx) return;

    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      ambientAudioCtx = new AudioContext();

      // Low drone
      var osc1 = ambientAudioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 42;

      var osc2 = ambientAudioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 63;

      // LFO modulation
      var lfo = ambientAudioCtx.createOscillator();
      lfo.frequency.value = 0.06;
      var lfoGain = ambientAudioCtx.createGain();
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      // Master gain
      ambientGain = ambientAudioCtx.createGain();
      ambientGain.gain.value = 0;

      var gain1 = ambientAudioCtx.createGain();
      gain1.gain.value = 0.018;
      var gain2 = ambientAudioCtx.createGain();
      gain2.gain.value = 0.008;

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ambientGain);
      gain2.connect(ambientGain);
      ambientGain.connect(ambientAudioCtx.destination);

      osc1.start();
      osc2.start();
      lfo.start();

      // Fade in slowly
      ambientGain.gain.linearRampToValueAtTime(1, ambientAudioCtx.currentTime + 3);
    } catch (e) {
      // Audio not available, that's OK
    }
  }


  // ── Summon Effects ──

  function triggerSummonEffect() {
    // Screen shake
    var chamber = document.getElementById('chamber-screen');
    if (chamber) {
      chamber.classList.add('summoning');
      setTimeout(function () {
        chamber.classList.remove('summoning');
      }, 500);
    }

    // Flash overlay
    var flash = document.createElement('div');
    flash.className = 'summon-flash';
    document.body.appendChild(flash);
    setTimeout(function () {
      flash.remove();
    }, 500);
  }


  // ── Message Handling ──

  function handleSend() {
    if (isStreaming) return;

    var text = COMPANION.UI.getInputText();
    if (!text) return;

    COMPANION.UI.addSeekerMessage(text);
    COMPANION.UI.clearInput();
    COMPANION.UI.setInputEnabled(false);

    var incantation = COMPANION.Protocol.parseIncantation(text);

    if (incantation) {
      handleIncantation(incantation, text);
    } else {
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
    var catInfo = COMPANION.Protocol.getPersonaCategory(name);

    var existing = activePersonas.find(function (p) {
      return p.name.toLowerCase() === name.toLowerCase();
    });
    if (existing) {
      COMPANION.UI.addSystemMessage(name + ' is already present.');
      COMPANION.UI.setInputEnabled(true);
      return;
    }

    var persona = {
      name: name,
      color: catInfo.color,
      category: catInfo.category
    };
    activePersonas.push(persona);

    // Visual effects
    triggerSummonEffect();

    // Hologram
    COMPANION.Hologram.summon(name, catInfo.color);

    // Badge
    COMPANION.UI.addPersonaBadge(name, catInfo.color, function (dismissName) {
      releasePersona(dismissName);
      COMPANION.UI.addSystemMessage(dismissName + ' has departed.');
    });

    COMPANION.UI.updateHint(activePersonas.length);
    COMPANION.UI.addSystemMessage('Summoning ' + name + '...');

    // Send to API
    sendToAPI(contextText);
  }


  // ── Persona Release ──

  function releasePersona(name) {
    var index = activePersonas.findIndex(function (p) {
      return p.name.toLowerCase() === name.toLowerCase();
    });

    if (index === -1) {
      index = activePersonas.findIndex(function (p) {
        return p.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
               name.toLowerCase().indexOf(p.name.toLowerCase()) !== -1;
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

    var displayName = 'The Chamber';
    var displayColor = '#c9a54e';

    if (activePersonas.length === 1) {
      displayName = activePersonas[0].name;
      displayColor = activePersonas[0].color;
    } else if (activePersonas.length > 1) {
      displayName = 'Symposium';
      displayColor = '#c9a54e';
    }

    currentStreamMessage = COMPANION.UI.addPersonaMessage(displayName, displayColor);

    var personaNames = activePersonas.map(function (p) { return p.name; });
    var systemPrompt = COMPANION.Protocol.buildSystemPrompt(personaNames);

    COMPANION.API.sendMessage(
      userText,
      systemPrompt,

      // onChunk
      function (chunk) {
        currentStreamMessage.update(chunk);

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

        if (fullText && COMPANION.Voice.isEnabled()) {
          if (activePersonas.length === 1) {
            COMPANION.Voice.speak(
              fullText,
              activePersonas[0].category,
              activePersonas[0].name
            );
          } else if (activePersonas.length > 1) {
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


  return { init: init };

})();


// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', function () {
  COMPANION.App.init();
});
