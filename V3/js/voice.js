/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — Voice Synthesis Engine
   Committee of Patriots Edition

   Per-patriot voice profiles for distinct character voices.
   Web Speech API + optional ElevenLabs for high-fidelity voice.

   Washington: Deep, authoritative, measured, slow.
   Hamilton:   Quick, sharp, intense, passionate.
   Jefferson:  Eloquent, smooth, philosophical.
   Franklin:   Warm, witty, grandfatherly wisdom.
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


  // ── Patriot-specific voice profiles (Web Speech) ──

  var PATRIOT_VOICES = {
    'George Washington':   { pitch: 0.75, rate: 0.75, preferredVoice: 'male', stability: 0.8 },
    'Alexander Hamilton':  { pitch: 0.95, rate: 0.95, preferredVoice: 'male', stability: 0.5 },
    'Thomas Jefferson':    { pitch: 0.9,  rate: 0.82, preferredVoice: 'male', stability: 0.65 },
    'Benjamin Franklin':   { pitch: 0.8,  rate: 0.8,  preferredVoice: 'male', stability: 0.7 }
  };


  // ── ElevenLabs voice IDs per patriot ──

  var PATRIOT_ELEVENLABS = {
    'George Washington':   'VR6AewLTigWG4xSOukaG',  // Arnold - deep, commanding
    'Alexander Hamilton':  'ErXwobaYiN019PkySvjV',  // Antoni - energetic, sharp
    'Thomas Jefferson':    'TxGEqnHWrfWFTfGW9XjX',  // Josh - smooth, measured
    'Benjamin Franklin':   'pNInz6obpgDQGcFmaJgB'   // Adam - warm, elder
  };


  // ── ElevenLabs voice_settings per patriot ──

  var PATRIOT_VOICE_SETTINGS = {
    'George Washington':   { stability: 0.8,  similarity_boost: 0.75, style: 0.3 },
    'Alexander Hamilton':  { stability: 0.4,  similarity_boost: 0.8,  style: 0.6 },
    'Thomas Jefferson':    { stability: 0.65, similarity_boost: 0.75, style: 0.45 },
    'Benjamin Franklin':   { stability: 0.7,  similarity_boost: 0.7,  style: 0.5 }
  };


  // ── Fallback category-based profiles (legacy support) ──

  var VOICE_PROFILES = {
    philosophical: { pitch: 0.9,  rate: 0.82, preferredVoice: 'male' },
    scientific:    { pitch: 1.0,  rate: 0.88, preferredVoice: 'neutral' },
    strategic:     { pitch: 0.85, rate: 0.92, preferredVoice: 'male' },
    creative:      { pitch: 1.05, rate: 0.85, preferredVoice: 'neutral' },
    spiritual:     { pitch: 0.95, rate: 0.78, preferredVoice: 'male' },
    liberatory:    { pitch: 0.9,  rate: 0.88, preferredVoice: 'male' },
    psychological: { pitch: 0.95, rate: 0.85, preferredVoice: 'male' },
    default:       { pitch: 1.0,  rate: 0.88, preferredVoice: 'neutral' }
  };

  // Fallback ElevenLabs voices by category
  var ELEVENLABS_VOICES = {
    philosophical: 'TxGEqnHWrfWFTfGW9XjX',  // Josh
    scientific:    'VR6AewLTigWG4xSOukaG',  // Arnold
    strategic:     'VR6AewLTigWG4xSOukaG',  // Arnold
    creative:      'EXAVITQu4vr4xnSDxMaL',  // Bella
    spiritual:     'TxGEqnHWrfWFTfGW9XjX',  // Josh
    liberatory:    'ErXwobaYiN019PkySvjV',  // Antoni
    psychological: 'ErXwobaYiN019PkySvjV',  // Antoni
    default:       'TxGEqnHWrfWFTfGW9XjX'   // Josh
  };


  // ── Patriot name matching ──
  // Matches a given personaName against known patriots.
  // Supports full names ("George Washington") or last names ("Washington").
  // Returns the full patriot key or null if no match.

  function matchPatriot(personaName) {
    if (!personaName) return null;

    var name = personaName.trim();

    // Direct match
    if (PATRIOT_VOICES[name]) return name;

    // Fuzzy last-name match: compare the input against each patriot's last name
    var lowerName = name.toLowerCase();
    var patriotKeys = Object.keys(PATRIOT_VOICES);

    for (var i = 0; i < patriotKeys.length; i++) {
      var key = patriotKeys[i];
      var parts = key.split(' ');
      var lastName = parts[parts.length - 1].toLowerCase();

      if (lowerName === lastName || lowerName.indexOf(lastName) !== -1) {
        return key;
      }
    }

    // Also try first name match
    for (var j = 0; j < patriotKeys.length; j++) {
      var key2 = patriotKeys[j];
      var parts2 = key2.split(' ');
      var firstName = parts2[0].toLowerCase();

      if (lowerName === firstName) {
        return key2;
      }
    }

    return null;
  }


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
  // Selects a voice based on patriot profile or category profile.

  function selectVoice(preferredVoice) {
    if (!voicesLoaded || availableVoices.length === 0) return null;

    var englishVoices = availableVoices.filter(function (v) {
      return v.lang.startsWith('en');
    });

    if (englishVoices.length === 0) return availableVoices[0];

    var preferMale = (preferredVoice === 'male');

    if (preferMale) {
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


  // ── Resolve voice profile for a given persona ──
  // Returns { profile, voiceId, voiceSettings, patriotKey }

  function resolveVoiceConfig(category, personaName) {
    var patriotKey = null;

    // Handle Symposium or missing persona — default to Washington
    if (!personaName || personaName.toLowerCase() === 'symposium') {
      patriotKey = 'George Washington';
    } else {
      patriotKey = matchPatriot(personaName);
    }

    if (patriotKey) {
      return {
        profile: PATRIOT_VOICES[patriotKey],
        voiceId: PATRIOT_ELEVENLABS[patriotKey],
        voiceSettings: PATRIOT_VOICE_SETTINGS[patriotKey],
        patriotKey: patriotKey
      };
    }

    // Fallback to category-based profiles
    var catProfile = VOICE_PROFILES[category] || VOICE_PROFILES['default'];
    var catVoiceId = ELEVENLABS_VOICES[category] || ELEVENLABS_VOICES['default'];

    return {
      profile: catProfile,
      voiceId: catVoiceId,
      voiceSettings: { stability: 0.6, similarity_boost: 0.75, style: 0.4 },
      patriotKey: null
    };
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
    var config = resolveVoiceConfig(item.category, item.personaName);
    var voiceId = config.voiceId;
    var voiceSettings = config.voiceSettings;
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
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarity_boost,
          style: voiceSettings.style,
          use_speaker_boost: true
        }
      })
    })
    .then(function (response) {
      if (!response.ok) {
        return response.text().then(function (body) {
          console.warn('ElevenLabs error:', body);
          throw new Error('ElevenLabs API error: ' + response.status);
        });
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
        // Autoplay blocked — fall back to Web Speech
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
    var config = resolveVoiceConfig(item.category, item.personaName);
    var profile = config.profile;

    // Chrome kills utterances >~15s. Split into sentences for reliability.
    var sentences = item.text.match(/[^.!?]+[.!?]+/g) || [item.text];

    // Recombine into chunks of ~200 chars max
    var chunks = [];
    var current = '';
    for (var s = 0; s < sentences.length; s++) {
      if (current.length + sentences[s].length > 200 && current.length > 0) {
        chunks.push(current.trim());
        current = '';
      }
      current += sentences[s];
    }
    if (current.trim().length > 0) chunks.push(current.trim());

    if (chunks.length === 0) {
      isSpeaking = false;
      processQueue();
      return;
    }

    if (onSpeakingStart) onSpeakingStart(item.personaName);

    var chunkIndex = 0;

    function speakNextChunk() {
      if (chunkIndex >= chunks.length) {
        isSpeaking = false;
        currentUtterance = null;
        if (onSpeakingEnd) onSpeakingEnd(item.personaName);
        processQueue();
        return;
      }

      var utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      var preferredVoice = profile.preferredVoice || 'neutral';
      var voice = selectVoice(preferredVoice);
      if (voice) utterance.voice = voice;

      utterance.pitch = profile.pitch;
      utterance.rate = profile.rate * rate;
      utterance.volume = 0.85;

      utterance.onend = function () {
        chunkIndex++;
        speakNextChunk();
      };

      utterance.onerror = function () {
        isSpeaking = false;
        currentUtterance = null;
        if (onSpeakingEnd) onSpeakingEnd(item.personaName);
        processQueue();
      };

      currentUtterance = utterance;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }

    speakNextChunk();
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
