/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Harness: Claude API Integration
   Streaming dialogue with Anthropic's Claude API, through the
   shared COMPANION proxy (key server-side) or a BYO key.

   Client-side safeguards: cooldown, per-session message cap,
   daily session cap, session timeout. Mirrors the sibling
   chambers so The Harness runs on the same proxy unchanged.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.API = (function () {

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const API_VERSION = '2023-06-01';
  const MAX_TOKENS = 4096;

  const STORAGE_KEY_API = 'companion_harness_api_key';
  const STORAGE_KEY_MODEL = 'companion_harness_model';
  const STORAGE_KEY_SESSION_COUNT = 'companion_harness_session_count';
  const STORAGE_KEY_SESSION_DATE = 'companion_harness_session_date';
  const STORAGE_KEY_MSG_COUNT = 'companion_harness_msg_count';
  const STORAGE_KEY_SESSION_START = 'companion_harness_session_start';

  // Models permitted by the shared proxy (see proxy/worker.js ALLOWED_MODELS).
  const DEFAULT_MODEL = 'claude-opus-4-6';

  let conversationHistory = [];
  let currentAbortController = null;
  let lastRequestTime = 0;


  // ── Configuration ──

  function getConfig() {
    return (window.COMPANION_CONFIG && typeof window.COMPANION_CONFIG === 'object')
      ? window.COMPANION_CONFIG : null;
  }

  function getSafeguards() {
    var config = getConfig();
    var defaults = {
      maxMessagesPerSession: 60,
      maxSessionsPerDay: 20,
      cooldownSeconds: 3,
      sessionTimeoutMinutes: 180
    };
    if (config && config.safeguards) return Object.assign({}, defaults, config.safeguards);
    return defaults;
  }


  // ── Proxy & Key ──

  function getProxyUrl() {
    var config = getConfig();
    return (config && config.proxyUrl) ? config.proxyUrl.replace(/\/$/, '') : '';
  }
  function useProxy() { return getProxyUrl().length > 0; }
  function getPreConfiguredKey() {
    var config = getConfig();
    return (config && config.apiKey) ? config.apiKey : '';
  }
  function isPreConfigured() { return useProxy() || getPreConfiguredKey().length > 0; }

  function getApiKey() {
    if (useProxy()) return '__PROXY__';
    var preKey = getPreConfiguredKey();
    if (preKey) return preKey;
    return localStorage.getItem(STORAGE_KEY_API) || '';
  }
  function setApiKey(key) { localStorage.setItem(STORAGE_KEY_API, (key || '').trim()); }
  function hasApiKey() { return useProxy() || getApiKey().length > 0; }
  function clearApiKey() { localStorage.removeItem(STORAGE_KEY_API); }


  // ── Model ──

  function getModel() { return localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL; }
  function setModel(model) { if (model) localStorage.setItem(STORAGE_KEY_MODEL, model); }


  // ── Safeguards ──

  function checkCooldown() {
    var guards = getSafeguards();
    var elapsed = (Date.now() - lastRequestTime) / 1000;
    if (lastRequestTime > 0 && elapsed < guards.cooldownSeconds) {
      return { allowed: false, message: 'A moment. Let the words settle before you speak again.' };
    }
    return { allowed: true };
  }

  function checkSessionMessageLimit() {
    var guards = getSafeguards();
    var count = parseInt(sessionStorage.getItem(STORAGE_KEY_MSG_COUNT) || '0', 10);
    if (count >= guards.maxMessagesPerSession) {
      return { allowed: false, message: 'This working has reached its length (' + guards.maxMessagesPerSession + ' exchanges). Begin a new one.' };
    }
    return { allowed: true };
  }

  function checkDailySessionLimit() {
    var guards = getSafeguards();
    var today = new Date().toISOString().slice(0, 10);
    var storedDate = localStorage.getItem(STORAGE_KEY_SESSION_DATE);
    var count = parseInt(localStorage.getItem(STORAGE_KEY_SESSION_COUNT) || '0', 10);
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_KEY_SESSION_DATE, today);
      localStorage.setItem(STORAGE_KEY_SESSION_COUNT, '0');
      return { allowed: true };
    }
    if (count >= guards.maxSessionsPerDay) {
      return { allowed: false, message: 'The threshold has been crossed enough times today. Return tomorrow.' };
    }
    return { allowed: true };
  }

  function checkSessionTimeout() {
    var guards = getSafeguards();
    var start = parseInt(sessionStorage.getItem(STORAGE_KEY_SESSION_START) || '0', 10);
    if (start > 0) {
      var elapsed = (Date.now() - start) / 1000 / 60;
      if (elapsed > guards.sessionTimeoutMinutes) {
        return { allowed: false, message: 'This working has expired. Refresh to open a new threshold.' };
      }
    }
    return { allowed: true };
  }

  function incrementMessageCount() {
    var count = parseInt(sessionStorage.getItem(STORAGE_KEY_MSG_COUNT) || '0', 10);
    sessionStorage.setItem(STORAGE_KEY_MSG_COUNT, String(count + 1));
  }

  function registerSession() {
    if (!sessionStorage.getItem(STORAGE_KEY_SESSION_START)) {
      sessionStorage.setItem(STORAGE_KEY_SESSION_START, String(Date.now()));
    }
    var today = new Date().toISOString().slice(0, 10);
    var storedDate = localStorage.getItem(STORAGE_KEY_SESSION_DATE);
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_KEY_SESSION_DATE, today);
      localStorage.setItem(STORAGE_KEY_SESSION_COUNT, '1');
    } else {
      var count = parseInt(localStorage.getItem(STORAGE_KEY_SESSION_COUNT) || '0', 10);
      localStorage.setItem(STORAGE_KEY_SESSION_COUNT, String(count + 1));
    }
  }

  function runSafeguardChecks() {
    if (!isPreConfigured()) return { allowed: true };
    var checks = [checkCooldown(), checkSessionMessageLimit(), checkDailySessionLimit(), checkSessionTimeout()];
    for (var i = 0; i < checks.length; i++) {
      if (!checks[i].allowed) return checks[i];
    }
    return { allowed: true };
  }


  // ── Conversation history ──

  function addUserMessage(content) { conversationHistory.push({ role: 'user', content: content }); }
  function addAssistantMessage(content) { conversationHistory.push({ role: 'assistant', content: content }); }
  function getHistory() { return conversationHistory.slice(); }
  function restoreHistory(history) { conversationHistory = history || []; }
  function clearHistory() { conversationHistory = []; clearSession(); }

  function trimHistory(maxExchanges) {
    maxExchanges = maxExchanges || 40;
    var maxMessages = maxExchanges * 2;
    if (conversationHistory.length > maxMessages) {
      conversationHistory = conversationHistory.slice(-maxMessages);
    }
  }


  // ── Session persistence ──

  const SESSION_STORAGE_KEY = 'companion_harness_session';
  const SESSION_EXPIRY_MS = 45 * 60 * 1000;

  function saveSession(payload) {
    try {
      var data = Object.assign({ timestamp: Date.now(), history: conversationHistory }, payload || {});
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* storage full or unavailable */ }
  }

  function loadSession() {
    try {
      var raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (Date.now() - data.timestamp > SESSION_EXPIRY_MS) { clearSession(); return null; }
      return data;
    } catch (e) { return null; }
  }

  function clearSession() { localStorage.removeItem(SESSION_STORAGE_KEY); }


  // ── Streaming call ──

  async function sendMessage(userMessage, systemPrompt, onChunk, onDone, onError) {
    var guard = runSafeguardChecks();
    if (!guard.allowed) { onError(guard.message); return; }

    addUserMessage(userMessage);
    trimHistory();

    if (currentAbortController) currentAbortController.abort();
    currentAbortController = new AbortController();

    const isProxy = useProxy();
    const apiKey = getApiKey();
    if (!isProxy && !apiKey) { onError('No key is bound. Provide an Anthropic API key to open the threshold.'); return; }

    const body = {
      model: getModel(),
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: conversationHistory,
      stream: true
    };

    let fullResponse = '';

    try {
      lastRequestTime = Date.now();
      incrementMessageCount();

      const fetchUrl = isProxy ? (getProxyUrl() + '/v1/messages') : API_URL;
      const fetchHeaders = { 'Content-Type': 'application/json', 'anthropic-version': API_VERSION };
      if (!isProxy) {
        fetchHeaders['x-api-key'] = apiKey;
        fetchHeaders['anthropic-dangerous-direct-browser-access'] = 'true';
      }

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify(body),
        signal: currentAbortController.signal
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = 'API request failed: ' + response.status;
        try {
          const errorJson = JSON.parse(errorBody);
          if (errorJson.error && errorJson.error.message) errorMessage = errorJson.error.message;
        } catch (e) { /* use status */ }
        conversationHistory.pop();
        onError(errorMessage);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') continue;
          try {
            const data = JSON.parse(dataStr);
            if (data.type === 'content_block_delta' && data.delta && data.delta.type === 'text_delta') {
              const chunk = data.delta.text;
              fullResponse += chunk;
              onChunk(chunk);
            }
            if (data.type === 'message_stop') break;
            if (data.type === 'error') throw new Error(data.error.message || 'Stream error');
          } catch (parseError) {
            if (parseError.message && !parseError.message.includes('JSON')) throw parseError;
          }
        }
      }

      addAssistantMessage(fullResponse);
      onDone(fullResponse);

    } catch (error) {
      if (error.name === 'AbortError') {
        if (fullResponse) addAssistantMessage(fullResponse);
        onDone(fullResponse);
        return;
      }
      conversationHistory.pop();
      onError(error.message || 'An unexpected error occurred.');
    } finally {
      currentAbortController = null;
    }
  }

  function abort() {
    if (currentAbortController) { currentAbortController.abort(); currentAbortController = null; }
  }


  return {
    getApiKey: getApiKey,
    setApiKey: setApiKey,
    hasApiKey: hasApiKey,
    clearApiKey: clearApiKey,
    isPreConfigured: isPreConfigured,
    getModel: getModel,
    setModel: setModel,
    sendMessage: sendMessage,
    abort: abort,
    getHistory: getHistory,
    clearHistory: clearHistory,
    addUserMessage: addUserMessage,
    addAssistantMessage: addAssistantMessage,
    registerSession: registerSession,
    saveSession: saveSession,
    loadSession: loadSession,
    clearSession: clearSession,
    restoreHistory: restoreHistory
  };

})();
