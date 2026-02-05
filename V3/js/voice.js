/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — Voice Synthesis Engine
   Web Speech API + optional ElevenLabs for high-fidelity voice.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Voice = (function () {

  var enabled = false;
  var rate = 0.9;
  var currentUtterance = null;
  var voicesLoaded = false;
  var availableVoices = [];
  var onSpeakingStart = null;
  var onSpeakingEnd = null;
  var speechQueue = [];
  var isSpeaking = false;

  // ElevenLabs state
  var ELEVENLABS_STORAGE_KEY = 'companion_v3_elevenlabs_key';
  var currentAudio = null;

  // ── Voice profiles per persona category ──
  var VOICE_PROFILES = {
    philosophical: { pitch: 0.9, rate: 0.82, preferredGender: 'male' },
    scientific:    { pitch: 1.0, rate: 0.88, preferredGender: 'neutral' },
    strategic:     { pitch: 0.85, rate: 0.92, preferredGender: 'male' },
    creative:      { pitch: 1.05, rate: 0.85, preferredGender: 'neutral' },
    spiritual:     { pitch: 0.95, rate: 0.78, preferredGender: 'male' },
    liberatory:    { pitch: 0.9, rate: 0.88, preferredGender: 'male' },
    psychological: { pitch: 0.95, rate: 0.85, preferredGender: 'male' },
    default:       { pitch: 1.0, rate: 0.88, preferredGender: 'neutral' }
  };

  // ElevenLabs voice IDs mapped to persona categories
  // These are ElevenLabs' premade voices
  var ELEVENLABS_VOICES = {
    philosophical: 'TxGEqnHWrfWFTfGW9XjX',  // Josh - deep, measured
    scientific:    'VR6AewLTigWG4xSOukaG',  // Arnold - clear, authoritative
    strategic:     'VR6AewLTigWG4xSOukaG',  // Arnold - commanding
    creative:      'EXAVITQu4vr4xnSDxMaL',  // Bella - expressive
    spiritual:     'TxGEqnHWrfWFTfGW9XjX',  // Josh - resonant
    liberatory:    'ErXwobaYiN019PkySvjV',  // Antoni - warm, passionate
    psychological: 'ErXwobaYiN019PkySvjV',  // Antoni - thoughtful
    default:       'TxGEqnHWrfWFTfGW9XjX'   // Josh
  };


  /**
   * Initialize the voice engine.
   */
  function init(callbacks) {
    if (callbacks) {
      onSpeakingStart = callbacks.onSpeakingStart || null;
      onSpeakingEnd = callbacks.onSpeakingEnd || null;
    }

    if ('speechSynthesis' in window) {
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
    voicesLoaded = availableVoices.length > 0;
  }


  // ── ElevenLabs Key Management ──

  function getElevenLabsKey() {
    return localStorage.getItem(ELEVENLABS_STORAGE_KEY) || '';
  }

  function setElevenLabsKey(key) {
    localStorage.setItem(ELEVENLABS_STORAGE_KEY, (key || '').trim());
  }

  function hasElevenLabsKey() {
    return getElevenLabsKey().length > 0;
  }


  // ── Enable/Disable ──

  function setEnabled(isEnabled) {
    enabled = isEnabled;
    if (!enabled) {
      stop();
    }
  }

  function isEnabled() {
    return enabled;
  }

  function setRate(newRate) {
    rate = Math.max(0.5, Math.min(1.5, newRate));
  }

  function getRate() {
    return rate;
  }


  // ── Voice Selection (Web Speech) ──

  function selectVoice(category) {
    if (!voicesLoaded || availableVoices.length === 0) return null;

    var profile = VOICE_PROFILES[category] || VOICE_PROFILES['default'];
    var englishVoices = availableVoices.filter(function (v) {
      return v.lang.startsWith('en');
    });

    if (englishVoices.length === 0) return availableVoices[0];

    var preferDeep = (profile.preferredGender === 'male');

    if (preferDeep) {
      var deepVoice = englishVoices.find(function (v) {
        return /daniel|james|david|google uk male|male/i.test(v.name);
      });
      if (deepVoice) return deepVoice;
    }

    // Prefer higher quality voices
    var naturalVoice = englishVoices.find(function (v) {
      return /premium|enhanced|natural|neural/i.test(v.name);
    });
    if (naturalVoice) return naturalVoice;

    return englishVoices[0];
  }


  // ── Clean text for speech ──

  function cleanTextForSpeech(text) {
    return text
      .replace(/\*\*\[.*?\]:\*\*/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/>\s/g, '')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ' ')
      .trim();
  }


  // ── Speak (routes to ElevenLabs or Web Speech) ──

  function speak(text, category, personaName) {
    if (!enabled) return;
    if (!text || text.trim().length === 0) return;

    var cleanText = cleanTextForSpeech(text);
    if (cleanText.length === 0) return;

    // Truncate for ElevenLabs (free tier has char limits)
    var truncated = cleanText.length > 2500 ? cleanText.substring(0, 2500) : cleanText;

    speechQueue.push({
      text: truncated,
      category: category,
      personaName: personaName
    });
    processQueue();
  }

  function processQueue() {
    if (isSpeaking || speechQueue.length === 0) return;

    var item = speechQueue.shift();
    isSpeaking = true;

    if (hasElevenLabsKey()) {
      speakElevenLabs(item);
    } else if ('speechSynthesis' in window) {
      speakWebSpeech(item);
    } else {
      isSpeaking = false;
      processQueue();
    }
  }


  // ── ElevenLabs TTS ──

  function speakElevenLabs(item) {
    var voiceId = ELEVENLABS_VOICES[item.category] || ELEVENLABS_VOICES['default'];
    var apiKey = getElevenLabsKey();

    var url = 'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId;

    if (onSpeakingStart) onSpeakingStart(item.personaName);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: item.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.75,
          style: 0.4,
          use_speaker_boost: true
        }
      })
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('ElevenLabs API error: ' + response.status);
      }
      return response.blob();
    })
    .then(function (blob) {
      var audioUrl = URL.createObjectURL(blob);
      currentAudio = new Audio(audioUrl);
      currentAudio.playbackRate = rate;

      currentAudio.onended = function () {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        isSpeaking = false;
        if (onSpeakingEnd) onSpeakingEnd(item.personaName);
        processQueue();
      };

      currentAudio.onerror = function () {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        isSpeaking = false;
        if (onSpeakingEnd) onSpeakingEnd(item.personaName);
        processQueue();
      };

      currentAudio.play().catch(function () {
        // Autoplay blocked - fall back to Web Speech
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        speakWebSpeech(item);
      });
    })
    .catch(function (err) {
      console.warn('ElevenLabs failed, falling back to Web Speech:', err);
      speakWebSpeech(item);
    });
  }


  // ── Web Speech TTS ──

  function speakWebSpeech(item) {
    var profile = VOICE_PROFILES[item.category] || VOICE_PROFILES['default'];
    var utterance = new SpeechSynthesisUtterance(item.text);

    var voice = selectVoice(item.category);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate * rate;
    utterance.volume = 0.85;

    utterance.onstart = function () {
      if (onSpeakingStart) onSpeakingStart(item.personaName);
    };

    utterance.onend = function () {
      isSpeaking = false;
      currentUtterance = null;
      if (onSpeakingEnd) onSpeakingEnd(item.personaName);
      processQueue();
    };

    utterance.onerror = function () {
      isSpeaking = false;
      currentUtterance = null;
      if (onSpeakingEnd) onSpeakingEnd(item.personaName);
      processQueue();
    };

    currentUtterance = utterance;

    // Chrome bug workaround
    speechSynthesis.cancel();
    setTimeout(function () {
      speechSynthesis.speak(utterance);
    }, 50);
  }


  // ── Stop ──

  function stop() {
    speechQueue = [];
    isSpeaking = false;
    currentUtterance = null;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    if (onSpeakingEnd) onSpeakingEnd(null);
  }


  function isAvailable() {
    return 'speechSynthesis' in window || hasElevenLabsKey();
  }


  // ── Public API ──
  return {
    init: init,
    speak: speak,
    stop: stop,
    setEnabled: setEnabled,
    isEnabled: isEnabled,
    setRate: setRate,
    getRate: getRate,
    isAvailable: isAvailable,
    getElevenLabsKey: getElevenLabsKey,
    setElevenLabsKey: setElevenLabsKey,
    hasElevenLabsKey: hasElevenLabsKey
  };

})();
