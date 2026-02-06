/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Chair: Claude API Integration
   Handles streaming communication with Anthropic's Claude API
   directly from the browser.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.API = (function () {

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const API_VERSION = '2023-06-01';
  const STORAGE_KEY_API = 'companion_v3_api_key';
  const STORAGE_KEY_MODEL = 'companion_v3_model';
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
    conversationHistory.push({ role: 'user', content });
  }

  function addAssistantMessage(content) {
    conversationHistory.push({ role: 'assistant', content });
  }

  function getHistory() {
    return [...conversationHistory];
  }

  function clearHistory() {
    conversationHistory = [];
  }

  /**
   * Trim history to keep context window manageable.
   * Keeps the most recent N exchanges.
   */
  function trimHistory(maxExchanges) {
    maxExchanges = maxExchanges || 40;
    const maxMessages = maxExchanges * 2;
    if (conversationHistory.length > maxMessages) {
      conversationHistory = conversationHistory.slice(-maxMessages);
    }
  }


  // ── Streaming API Call ──

  /**
   * Send a message to Claude with streaming response.
   *
   * @param {string} userMessage - The user's message.
   * @param {string} systemPrompt - The full system prompt.
   * @param {function} onChunk - Called with each text chunk as it arrives.
   * @param {function} onDone - Called when the response is complete, with full text.
   * @param {function} onError - Called on error, with error message.
   * @returns {function} Abort function to cancel the request.
   */
  async function sendMessage(userMessage, systemPrompt, onChunk, onDone, onError) {
    // Add user message to history
    addUserMessage(userMessage);
    trimHistory();

    // Create abort controller
    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    const apiKey = getApiKey();
    if (!apiKey) {
      onError('No API key configured. Please set your Anthropic API key.');
      return;
    }

    const body = {
      model: getModel(),
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: conversationHistory,
      stream: true
    };

    let fullResponse = '';

    try {
      const response = await fetch(API_URL, {
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
        const errorBody = await response.text();
        let errorMessage = 'API request failed: ' + response.status;
        try {
          const errorJson = JSON.parse(errorBody);
          if (errorJson.error && errorJson.error.message) {
            errorMessage = errorJson.error.message;
          }
        } catch (e) {
          // Use the status code message
        }
        // Remove the user message we just added since the call failed
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

            if (data.type === 'content_block_delta' &&
                data.delta && data.delta.type === 'text_delta') {
              const chunk = data.delta.text;
              fullResponse += chunk;
              onChunk(chunk);
            }

            if (data.type === 'message_stop') {
              break;
            }

            // Handle errors in the stream
            if (data.type === 'error') {
              throw new Error(data.error.message || 'Stream error');
            }
          } catch (parseError) {
            // Skip unparseable lines (like event: lines)
            if (parseError.message && !parseError.message.includes('JSON')) {
              throw parseError;
            }
          }
        }
      }

      // Add assistant response to history
      addAssistantMessage(fullResponse);
      onDone(fullResponse);

    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled
        if (fullResponse) {
          addAssistantMessage(fullResponse);
        }
        onDone(fullResponse);
        return;
      }
      // Remove user message on error
      conversationHistory.pop();
      onError(error.message || 'An unexpected error occurred.');
    } finally {
      currentAbortController = null;
    }
  }

  /**
   * Abort the current streaming request.
   */
  function abort() {
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }
  }


  // ── Public API ──
  return {
    getApiKey,
    setApiKey,
    hasApiKey,
    clearApiKey,
    getModel,
    setModel,
    sendMessage,
    abort,
    getHistory,
    clearHistory,
    addUserMessage,
    addAssistantMessage
  };

})();
