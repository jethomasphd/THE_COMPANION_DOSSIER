/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — Voice Synthesis Engine
   Web Speech API wrapper for reading persona responses aloud
   with voice characteristics matched to persona type.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Voice = (function () {

  let enabled = false;
  let rate = 0.9;
  let currentUtterance = null;
  let voicesLoaded = false;
  let availableVoices = [];
  let onSpeakingStart = null;
  let onSpeakingEnd = null;
  let speechQueue = [];
  let isSpeaking = false;

  // ── Voice profiles per persona category ──
  const VOICE_PROFILES = {
    philosophical: { pitch: 0.9, rate: 0.85, preferredLang: 'en' },
    scientific:    { pitch: 1.0, rate: 0.9,  preferredLang: 'en' },
    strategic:     { pitch: 0.85, rate: 0.95, preferredLang: 'en' },
    creative:      { pitch: 1.05, rate: 0.85, preferredLang: 'en' },
    spiritual:     { pitch: 0.95, rate: 0.8,  preferredLang: 'en' },
    liberatory:    { pitch: 0.9, rate: 0.9,  preferredLang: 'en' },
    psychological: { pitch: 0.95, rate: 0.88, preferredLang: 'en' },
    default:       { pitch: 1.0, rate: 0.9,  preferredLang: 'en' }
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
      // Load voices
      loadVoices();
      // Chrome loads voices asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
    voicesLoaded = availableVoices.length > 0;
  }


  /**
   * Enable or disable voice synthesis.
   */
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


  /**
   * Select the best available voice for a persona category.
   */
  function selectVoice(category) {
    if (!voicesLoaded || availableVoices.length === 0) return null;

    const profile = VOICE_PROFILES[category] || VOICE_PROFILES.default;

    // Prefer English voices
    const englishVoices = availableVoices.filter(v =>
      v.lang.startsWith('en')
    );

    if (englishVoices.length === 0) return availableVoices[0];

    // Try to find a "deeper" voice for certain categories
    const preferDeep = ['philosophical', 'strategic', 'spiritual'].includes(category);

    if (preferDeep) {
      // Prefer male-sounding voices (heuristic: names containing common male voice names)
      const deepVoice = englishVoices.find(v =>
        /daniel|james|david|google uk male|male/i.test(v.name)
      );
      if (deepVoice) return deepVoice;
    }

    // For creative/scientific, any good English voice works
    // Prefer non-default, more natural voices
    const naturalVoice = englishVoices.find(v =>
      /premium|enhanced|natural|neural/i.test(v.name)
    );
    if (naturalVoice) return naturalVoice;

    // Fall back to first English voice
    return englishVoices[0];
  }


  /**
   * Speak text as a given persona.
   * @param {string} text - Text to speak.
   * @param {string} category - Persona category (philosophical, scientific, etc.)
   * @param {string} personaName - Name of the speaking persona.
   */
  function speak(text, category, personaName) {
    if (!enabled || !('speechSynthesis' in window)) return;
    if (!text || text.trim().length === 0) return;

    // Clean text for speech (remove markdown)
    const cleanText = text
      .replace(/\*\*\[.*?\]:\*\*/g, '')  // Remove persona prefixes
      .replace(/\*\*(.*?)\*\*/g, '$1')    // Bold
      .replace(/\*(.*?)\*/g, '$1')         // Italic
      .replace(/#{1,6}\s/g, '')            // Headers
      .replace(/>\s/g, '')                 // Blockquotes
      .replace(/`(.*?)`/g, '$1')           // Code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Links
      .replace(/\n{2,}/g, '. ')            // Paragraph breaks
      .replace(/\n/g, ' ')                 // Line breaks
      .trim();

    if (cleanText.length === 0) return;

    // Queue the speech
    speechQueue.push({ text: cleanText, category, personaName });
    processQueue();
  }

  function processQueue() {
    if (isSpeaking || speechQueue.length === 0) return;

    const item = speechQueue.shift();
    isSpeaking = true;

    const profile = VOICE_PROFILES[item.category] || VOICE_PROFILES.default;
    const utterance = new SpeechSynthesisUtterance(item.text);

    const voice = selectVoice(item.category);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate * rate;  // Combine profile rate with user rate setting
    utterance.volume = 0.85;

    utterance.onstart = function () {
      if (onSpeakingStart) onSpeakingStart(item.personaName);
    };

    utterance.onend = function () {
      isSpeaking = false;
      currentUtterance = null;
      if (onSpeakingEnd) onSpeakingEnd(item.personaName);
      // Process next in queue
      processQueue();
    };

    utterance.onerror = function () {
      isSpeaking = false;
      currentUtterance = null;
      if (onSpeakingEnd) onSpeakingEnd(item.personaName);
      processQueue();
    };

    currentUtterance = utterance;

    // Chrome bug: need to cancel before speaking
    speechSynthesis.cancel();
    setTimeout(function () {
      speechSynthesis.speak(utterance);
    }, 50);
  }


  /**
   * Stop all current and queued speech.
   */
  function stop() {
    speechQueue = [];
    isSpeaking = false;
    currentUtterance = null;
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    if (onSpeakingEnd) onSpeakingEnd(null);
  }


  /**
   * Check if speech synthesis is available in this browser.
   */
  function isAvailable() {
    return 'speechSynthesis' in window;
  }


  // ── Public API ──
  return {
    init,
    speak,
    stop,
    setEnabled,
    isEnabled,
    setRate,
    getRate,
    isAvailable
  };

})();
