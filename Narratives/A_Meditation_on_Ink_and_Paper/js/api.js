/* ═══════════════════════════════════════════════════════════════
   A MEDITATION ON THE NECESSITY OF INK AND PAPER IN A SILICON-MAD WORLD
   Claude API Integration

   Streaming communication with the Anthropic Messages API by way of
   the repository's existing Cloudflare Worker proxy. The Worker holds
   the key. The client never does.

   This module conforms to the established COMPANION contract used by
   the other narratives: it posts { model, max_tokens, system, messages,
   stream } to proxyUrl + '/v1/messages' and parses the Server-Sent
   Events stream of content_block_delta text.

   No browser storage. All session state (the running messages array)
   is held in memory for the length of one reading. A reload begins
   again at the dark screen.
   ═══════════════════════════════════════════════════════════════ */

var MEDITATION = window.MEDITATION || (window.MEDITATION = {});

MEDITATION.API = (function () {

  var API_VERSION = '2023-06-01';

  // A quarter of an hour with a tired man who listens. Worth the most
  // capable allowlisted model.
  var MODEL = 'claude-opus-4-6';
  // Modest. The King speaks in two to four sentences.
  var MAX_TOKENS = 520;

  // The running conversation. The correspondent's lines are user turns,
  // the King's are assistant turns. Held in memory only.
  var messages = [];
  var currentAbort = null;
  var lastRequestTime = 0;

  function getConfig() {
    return (window.COMPANION_CONFIG && typeof window.COMPANION_CONFIG === 'object')
      ? window.COMPANION_CONFIG : null;
  }

  function getSafeguards() {
    var config = getConfig();
    var defaults = { maxReaderTurns: 12, cooldownSeconds: 0 };
    if (config && config.safeguards) {
      return Object.assign({}, defaults, config.safeguards);
    }
    return defaults;
  }

  function getProxyUrl() {
    var config = getConfig();
    return (config && config.proxyUrl) ? config.proxyUrl.replace(/\/$/, '') : '';
  }

  function isReady() { return getProxyUrl().length > 0; }

  function reset() {
    messages = [];
    lastRequestTime = 0;
    if (currentAbort) { currentAbort.abort(); currentAbort = null; }
  }

  function getMessages() { return messages.slice(); }

  // Number of turns the correspondent has actually taken, not counting
  // the invisible cue that opens the room.
  function readerTurnCount() {
    var n = 0;
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user' && messages[i]._seed !== true) n++;
    }
    return n;
  }

  function pushUser(content, isSeed) {
    var turn = { role: 'user', content: content };
    if (isSeed) turn._seed = true;
    messages.push(turn);
  }

  function pushAssistant(content) {
    messages.push({ role: 'assistant', content: content });
  }

  // Seat an authored opening: a hidden cue (user) then the King's first
  // words (assistant), so the running conversation is well formed and
  // the live model continues from the correspondent's first line.
  function seedOpening(cueText, openingText) {
    messages = [];
    pushUser(cueText, true);
    pushAssistant(openingText);
  }

  // Strip the private _seed flag before the turns leave for the wire.
  function wireMessages() {
    return messages.map(function (m) {
      return { role: m.role, content: m.content };
    });
  }

  /*
    send(userContent, systemPrompt, handlers, options)
      userContent  : the correspondent's line (or the invisible cue)
      systemPrompt : the King's persona, verbatim
      handlers     : { onChunk, onDone, onError }
      options      : { seed: true } marks an invisible opening turn
  */
  async function send(userContent, systemPrompt, handlers, options) {
    handlers = handlers || {};
    options = options || {};
    var onChunk = handlers.onChunk || function () {};
    var onDone = handlers.onDone || function () {};
    var onError = handlers.onError || function () {};

    if (!isReady()) {
      onError('no-proxy');
      return;
    }

    var guards = getSafeguards();
    var elapsed = (Date.now() - lastRequestTime) / 1000;
    if (lastRequestTime > 0 && elapsed < guards.cooldownSeconds) {
      onError('cooldown');
      return;
    }

    pushUser(userContent, options.seed === true);

    if (currentAbort) currentAbort.abort();
    currentAbort = new AbortController();

    var body = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: wireMessages(),
      stream: true
    };

    var full = '';

    try {
      lastRequestTime = Date.now();

      var response = await fetch(getProxyUrl() + '/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': API_VERSION
        },
        body: JSON.stringify(body),
        signal: currentAbort.signal
      });

      if (!response.ok) {
        // Roll the failed turn back out of memory so a retry is clean.
        messages.pop();
        onError('http-' + response.status);
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
          if (line.indexOf('data: ') !== 0) continue;
          var dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') continue;

          try {
            var data = JSON.parse(dataStr);
            if (data.type === 'content_block_delta' && data.delta && data.delta.type === 'text_delta') {
              full += data.delta.text;
              onChunk(data.delta.text);
            }
            if (data.type === 'message_stop') break;
            if (data.type === 'error') {
              throw new Error((data.error && data.error.message) || 'stream-error');
            }
          } catch (parseError) {
            // Ignore partial-JSON fragments; rethrow real stream errors.
            if (parseError.message && parseError.message.indexOf('JSON') === -1) {
              throw parseError;
            }
          }
        }
      }

      pushAssistant(full);
      onDone(full);

    } catch (error) {
      if (error && error.name === 'AbortError') {
        if (full) { pushAssistant(full); onDone(full); }
        return;
      }
      // Roll back the user turn so the conversation stays consistent.
      if (messages.length && messages[messages.length - 1].role === 'user') {
        messages.pop();
      }
      onError('network');
    } finally {
      currentAbort = null;
    }
  }

  function abort() {
    if (currentAbort) { currentAbort.abort(); currentAbort = null; }
  }

  return {
    isReady: isReady,
    send: send,
    seedOpening: seedOpening,
    abort: abort,
    reset: reset,
    getMessages: getMessages,
    readerTurnCount: readerTurnCount
  };

})();
