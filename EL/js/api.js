/* ═══════════════════════════════════════════════════════════════
   EL — Claude API Integration
   Streaming communication with Anthropic's Claude API
   via Cloudflare Worker proxy.
   ═══════════════════════════════════════════════════════════════ */

var EL = window.EL || {};

EL.API = (function () {

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const API_VERSION = '2023-06-01';
  const MAX_TOKENS = 4096;

  const STORAGE_PREFIX = 'el_nut_house_v1_';
  const STORAGE_KEY_MSG_COUNT = STORAGE_PREFIX + 'msg_count';
  const STORAGE_KEY_SESSION_START = STORAGE_PREFIX + 'session_start';
  const STORAGE_KEY_SESSION_COUNT = STORAGE_PREFIX + 'session_count';
  const STORAGE_KEY_SESSION_DATE = STORAGE_PREFIX + 'session_date';

  let conversationHistory = [];
  let currentAbortController = null;
  let lastRequestTime = 0;

  function getConfig() {
    return (window.COMPANION_CONFIG && typeof window.COMPANION_CONFIG === 'object')
      ? window.COMPANION_CONFIG : null;
  }

  function getSafeguards() {
    var config = getConfig();
    var defaults = {
      maxMessagesPerSession: 40,
      maxSessionsPerDay: 15,
      cooldownSeconds: 3,
      sessionTimeoutMinutes: 120
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

  function useProxy() { return getProxyUrl().length > 0; }
  function isReady() { return useProxy(); }

  function checkCooldown() {
    var guards = getSafeguards();
    var now = Date.now();
    var elapsed = (now - lastRequestTime) / 1000;
    if (lastRequestTime > 0 && elapsed < guards.cooldownSeconds) {
      return { allowed: false, message: 'The jukebox is still playing. Wait a moment.' };
    }
    return { allowed: true };
  }

  function checkSessionMessageLimit() {
    var guards = getSafeguards();
    var count = parseInt(sessionStorage.getItem(STORAGE_KEY_MSG_COUNT) || '0', 10);
    if (count >= guards.maxMessagesPerSession) {
      return { allowed: false, message: 'Last call. This session has reached its limit.' };
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
      return { allowed: false, message: 'The bar is closed for the night. Come back tomorrow.' };
    }
    return { allowed: true };
  }

  function checkSessionTimeout() {
    var guards = getSafeguards();
    var start = parseInt(sessionStorage.getItem(STORAGE_KEY_SESSION_START) || '0', 10);
    if (start > 0) {
      var elapsed = (Date.now() - start) / 1000 / 60;
      if (elapsed > guards.sessionTimeoutMinutes) {
        return { allowed: false, message: 'The heat broke. Session expired.' };
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

  function getHistory() { return conversationHistory.slice(); }

  function clearHistory() { conversationHistory = []; }

  function trimHistory(maxExchanges) {
    maxExchanges = maxExchanges || 20;
    var maxMessages = maxExchanges * 2;
    if (conversationHistory.length > maxMessages) {
      conversationHistory = conversationHistory.slice(-maxMessages);
    }
  }

  async function sendMessage(userMessage, systemPrompt, onChunk, onDone, onError) {
    var guard = runSafeguardChecks();
    if (!guard.allowed) { onError(guard.message); return; }

    addUserMessage(userMessage);
    trimHistory();

    if (currentAbortController) currentAbortController.abort();
    currentAbortController = new AbortController();

    var isProxy = useProxy();
    if (!isProxy) {
      onError('The connection to the bar has been lost.');
      return;
    }

    var body = {
      model: 'claude-sonnet-4-6',
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: conversationHistory,
      stream: true
    };

    var fullResponse = '';

    try {
      lastRequestTime = Date.now();
      incrementMessageCount();

      var fetchUrl = getProxyUrl() + '/v1/messages';
      var fetchHeaders = { 'Content-Type': 'application/json', 'anthropic-version': API_VERSION };

      var response = await fetch(fetchUrl, {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify(body),
        signal: currentAbortController.signal
      });

      if (!response.ok) {
        var errorBody = await response.text();
        var errorMessage = 'The signal broke: ' + response.status;
        try {
          var errorJson = JSON.parse(errorBody);
          if (errorJson.error && errorJson.error.message) errorMessage = errorJson.error.message;
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
              fullResponse += data.delta.text;
              onChunk(data.delta.text);
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
      onError(error.message || 'Something broke in the signal.');
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
    isReady: isReady,
    sendMessage: sendMessage,
    abort: abort,
    getHistory: getHistory,
    clearHistory: clearHistory,
    registerSession: registerSession
  };

})();
