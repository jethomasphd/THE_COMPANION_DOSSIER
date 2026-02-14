/* ═══════════════════════════════════════════════════════════════
   THE BOARDROOM — Claude API Integration
   Handles streaming communication with Anthropic's Claude API
   directly from the browser.

   Supports pre-configured API key via config.js (gitignored)
   with client-side safeguards: rate limiting, session caps,
   daily budget tracking.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.API = (function () {

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const API_VERSION = '2023-06-01';
  const STORAGE_KEY_API = 'the_boardroom_v1_api_key';
  const STORAGE_KEY_MODEL = 'the_boardroom_v1_model';
  const MAX_TOKENS = 4096;

  const STORAGE_KEY_SESSION_COUNT = 'the_boardroom_v1_session_count';
  const STORAGE_KEY_SESSION_DATE = 'the_boardroom_v1_session_date';
  const STORAGE_KEY_MSG_COUNT = 'the_boardroom_v1_msg_count';
  const STORAGE_KEY_SESSION_START = 'the_boardroom_v1_session_start';

  let conversationHistory = [];
  let currentAbortController = null;
  let lastRequestTime = 0;

  function getConfig() {
    return (window.COMPANION_CONFIG && typeof window.COMPANION_CONFIG === 'object')
      ? window.COMPANION_CONFIG
      : null;
  }

  function getSafeguards() {
    var config = getConfig();
    var defaults = {
      maxMessagesPerSession: 80,
      maxSessionsPerDay: 20,
      cooldownSeconds: 3,
      sessionTimeoutMinutes: 180
    };
    if (config && config.safeguards) {
      return Object.assign({}, defaults, config.safeguards);
    }
    return defaults;
  }

  function getProxyUrl() {
    var config = getConfig();
    return (config && config.proxyUrl) ? config.proxyUrl.replace(/\/$/, '') : '';
  }

  function useProxy() {
    return getProxyUrl().length > 0;
  }

  function getPreConfiguredKey() {
    var config = getConfig();
    return (config && config.apiKey) ? config.apiKey : '';
  }

  function isPreConfigured() {
    return useProxy() || getPreConfiguredKey().length > 0;
  }

  function getApiKey() {
    if (useProxy()) return '__PROXY__';
    var preKey = getPreConfiguredKey();
    if (preKey) return preKey;
    return localStorage.getItem(STORAGE_KEY_API) || '';
  }

  function setApiKey(key) {
    localStorage.setItem(STORAGE_KEY_API, key.trim());
  }

  function hasApiKey() {
    return useProxy() || getApiKey().length > 0;
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY_API);
  }

  function getModel() {
    return localStorage.getItem(STORAGE_KEY_MODEL) || 'claude-sonnet-4-20250514';
  }

  function setModel(model) {
    localStorage.setItem(STORAGE_KEY_MODEL, model);
  }

  function checkCooldown() {
    var guards = getSafeguards();
    var now = Date.now();
    var elapsed = (now - lastRequestTime) / 1000;
    if (lastRequestTime > 0 && elapsed < guards.cooldownSeconds) {
      return { allowed: false, message: 'Please wait a moment before sending another message.' };
    }
    return { allowed: true };
  }

  function checkSessionMessageLimit() {
    var guards = getSafeguards();
    var count = parseInt(sessionStorage.getItem(STORAGE_KEY_MSG_COUNT) || '0', 10);
    if (count >= guards.maxMessagesPerSession) {
      return { allowed: false, message: 'This session has reached its message limit (' + guards.maxMessagesPerSession + ' messages). Please start a new session.' };
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
      return { allowed: false, message: 'Daily session limit reached. Please return tomorrow.' };
    }
    return { allowed: true };
  }

  function checkSessionTimeout() {
    var guards = getSafeguards();
    var start = parseInt(sessionStorage.getItem(STORAGE_KEY_SESSION_START) || '0', 10);
    if (start > 0) {
      var elapsed = (Date.now() - start) / 1000 / 60;
      if (elapsed > guards.sessionTimeoutMinutes) {
        return { allowed: false, message: 'This session has expired. Please refresh to start a new session.' };
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

  function addUserMessage(content) {
    conversationHistory.push({ role: 'user', content: content });
  }

  function addAssistantMessage(content) {
    conversationHistory.push({ role: 'assistant', content: content });
  }

  function getHistory() {
    return conversationHistory.slice();
  }

  function clearHistory() {
    conversationHistory = [];
  }

  function trimHistory(maxExchanges) {
    maxExchanges = maxExchanges || 30;
    var maxMessages = maxExchanges * 2;
    if (conversationHistory.length > maxMessages) {
      conversationHistory = conversationHistory.slice(-maxMessages);
    }
  }

  async function sendMessage(userMessage, systemPrompt, onChunk, onDone, onError) {
    var guard = runSafeguardChecks();
    if (!guard.allowed) {
      onError(guard.message);
      return;
    }

    addUserMessage(userMessage);
    trimHistory();

    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    var isProxy = useProxy();
    var apiKey = getApiKey();
    if (!isProxy && !apiKey) {
      onError('No API key configured. Please set your Anthropic API key.');
      return;
    }

    var body = {
      model: getModel(),
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: conversationHistory,
      stream: true
    };

    var fullResponse = '';

    try {
      lastRequestTime = Date.now();
      incrementMessageCount();

      var fetchUrl = isProxy ? (getProxyUrl() + '/v1/messages') : API_URL;
      var fetchHeaders = { 'Content-Type': 'application/json', 'anthropic-version': API_VERSION };
      if (!isProxy) {
        fetchHeaders['x-api-key'] = apiKey;
        fetchHeaders['anthropic-dangerous-direct-browser-access'] = 'true';
      }

      var response = await fetch(fetchUrl, {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify(body),
        signal: currentAbortController.signal
      });

      if (!response.ok) {
        var errorBody = await response.text();
        var errorMessage = 'API request failed: ' + response.status;
        try {
          var errorJson = JSON.parse(errorBody);
          if (errorJson.error && errorJson.error.message) {
            errorMessage = errorJson.error.message;
          }
        } catch (e) {}
        conversationHistory.pop();
        onError(errorMessage);
        return;
      }

      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';

      while (true) {
        var result = await reader.read();
        if (result.done) break;

        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (!line.startsWith('data: ')) continue;
          var dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') continue;

          try {
            var data = JSON.parse(dataStr);
            if (data.type === 'content_block_delta' && data.delta && data.delta.type === 'text_delta') {
              var chunk = data.delta.text;
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
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }
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
    registerSession: registerSession
  };

})();
