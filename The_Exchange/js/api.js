/* ═══════════════════════════════════════════════════════════════
   THE EXCHANGE — Claude API Integration
   Handles streaming communication with Anthropic's Claude API
   directly from the browser.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.API = (function () {

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const API_VERSION = '2023-06-01';
  const STORAGE_KEY_API = 'the_exchange_v1_api_key';
  const STORAGE_KEY_MODEL = 'the_exchange_v1_model';
  const MAX_TOKENS = 4096;

  let conversationHistory = [];
  let currentAbortController = null;


  // ── API Key Management ──

  function getApiKey() {
    return localStorage.getItem(STORAGE_KEY_API) || '';
  }

  function setApiKey(key) {
    localStorage.setItem(STORAGE_KEY_API, key.trim());
  }

  function hasApiKey() {
    return getApiKey().length > 0;
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY_API);
  }


  // ── Model Management ──

  function getModel() {
    return localStorage.getItem(STORAGE_KEY_MODEL) || 'claude-sonnet-4-20250514';
  }

  function setModel(model) {
    localStorage.setItem(STORAGE_KEY_MODEL, model);
  }


  // ── Conversation History ──

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


  // ── Streaming API Call ──

  async function sendMessage(userMessage, systemPrompt, onChunk, onDone, onError) {
    addUserMessage(userMessage);
    trimHistory();

    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    var apiKey = getApiKey();
    if (!apiKey) {
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
      var response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': API_VERSION,
          'anthropic-dangerous-direct-browser-access': 'true'
        },
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
        } catch (e) {
          // Use status code message
        }
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

            if (data.type === 'content_block_delta' &&
                data.delta && data.delta.type === 'text_delta') {
              var chunk = data.delta.text;
              fullResponse += chunk;
              onChunk(chunk);
            }

            if (data.type === 'message_stop') {
              break;
            }

            if (data.type === 'error') {
              throw new Error(data.error.message || 'Stream error');
            }
          } catch (parseError) {
            if (parseError.message && !parseError.message.includes('JSON')) {
              throw parseError;
            }
          }
        }
      }

      addAssistantMessage(fullResponse);
      onDone(fullResponse);

    } catch (error) {
      if (error.name === 'AbortError') {
        if (fullResponse) {
          addAssistantMessage(fullResponse);
        }
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


  // ── Public API ──
  return {
    getApiKey: getApiKey,
    setApiKey: setApiKey,
    hasApiKey: hasApiKey,
    clearApiKey: clearApiKey,
    getModel: getModel,
    setModel: setModel,
    sendMessage: sendMessage,
    abort: abort,
    getHistory: getHistory,
    clearHistory: clearHistory,
    addUserMessage: addUserMessage,
    addAssistantMessage: addAssistantMessage
  };

})();
