# Seed 05: Wire API + Protocol (Functional Chat)

## Objective

Connect the chat UI to the existing API client (`/EL/js/api.js`) and protocol
(`/EL/js/protocol.js`) so that the user can actually talk to Jake. This is the
moment the page becomes alive.

## Prerequisites

- Seeds 01-04 completed and approved
- `/EL/index.html` has narrative, chat UI, and transition all working

## What to Build

### Core Chat Logic

Add to the `<script>` section of `/EL/index.html`:

```javascript
// ═══ CHAT ENGINE ═══

let isStreaming = false;
let chatInitiated = false;

function initiateChat() {
  if (chatInitiated) return;
  chatInitiated = true;

  // Register session with API safeguards
  EL.API.registerSession();

  // Jake's opening — send a silent "arrival" to get his first line
  sendToJake('[The person who just read your story has sat down on the stool next to you. They haven\'t said anything yet. You notice them.]');
}

async function sendToJake(userMessage, isVisible) {
  if (isStreaming) return;

  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');

  // Show user message (unless it's the invisible arrival prompt)
  if (isVisible !== false) {
    appendMessage('user', escapeHtml(userMessage));
  }

  // Clear input
  chatInput.value = '';
  chatInput.style.height = 'auto';
  chatInput.disabled = true;
  chatSend.disabled = true;
  isStreaming = true;

  // Show typing indicator
  showTyping();

  // Build system prompt
  const systemPrompt = EL.Protocol.buildSystemPrompt();

  // Create streaming message container
  let streamEl = null;

  await EL.API.sendMessage(
    userMessage,
    systemPrompt,

    // onChunk — streaming text arrives
    function(chunk) {
      hideTyping();
      if (!streamEl) {
        streamEl = document.createElement('div');
        streamEl.className = 'msg msg-assistant';
        streamEl.innerHTML = '<div class="msg-content"><p></p></div>';
        messages.appendChild(streamEl);
      }
      const p = streamEl.querySelector('p');
      p.textContent += chunk;
      messages.scrollTop = messages.scrollHeight;
    },

    // onDone — message complete
    function(fullText) {
      hideTyping();
      isStreaming = false;
      chatInput.disabled = false;
      chatSend.disabled = false;
      chatInput.focus();

      // Update ambient based on message count
      updateChatAmbient();
    },

    // onError — something broke
    function(errorMsg) {
      hideTyping();
      isStreaming = false;
      chatInput.disabled = false;
      chatSend.disabled = false;

      // Show safeguard message in the guard area
      const guard = document.getElementById('chatGuard');
      guard.textContent = errorMsg;
      guard.style.color = 'var(--warn-dim)';

      // Clear after 5 seconds
      setTimeout(() => { guard.textContent = ''; }, 5000);
    }
  );
}

function handleSend() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || isStreaming) return;
  sendToJake(text, true);
}

// Wire send button
document.getElementById('chatSend').addEventListener('click', handleSend);

// Wire enter key (already in Seed 03, update to call handleSend)
document.getElementById('chatInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});
```

### HTML Escaping

```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

### Ambient Evolution During Chat

```javascript
function updateChatAmbient() {
  const history = EL.API.getHistory();
  const count = history.length;

  let text;
  if (count <= 4) {
    text = 'the stool is warm\nsouth lamar — late';
  } else if (count <= 12) {
    text = 'jimbo wipes the bartop\nthe jukebox hums';
  } else if (count <= 24) {
    text = 'darren stopped talking\nmarisol looks up';
  } else if (count <= 40) {
    text = 'the cicadas are louder now\nor maybe you\'re listening';
  } else {
    text = 'last call was an hour ago\nnobody moved';
  }

  updateAmbient(text);
}
```

### Chat Status Updates

Update the header status based on API state:

```javascript
function updateChatStatus(status) {
  document.getElementById('chatStatus').textContent = status;
}

// Call during streaming:
// Before send: updateChatStatus('jake is thinking...');
// After done:  updateChatStatus('the stool is warm');
// On error:    updateChatStatus('the signal broke');
```

Integrate these calls into `sendToJake`:
- Before API call: `updateChatStatus('...');`
- In onChunk (first chunk): `updateChatStatus('jake is talking');`
- In onDone: `updateChatStatus('the stool is warm');`
- In onError: `updateChatStatus('the signal broke');`

### Screen Tears During Chat

Occasional screen tears while chatting (low frequency, atmospheric):

```javascript
function chatTears() {
  if (document.getElementById('chat-container').style.display === 'none') {
    setTimeout(chatTears, 10000);
    return;
  }

  const tear = document.getElementById('screenTear');
  const y = Math.random() * window.innerHeight;
  tear.style.top = y + 'px';
  tear.style.height = (1 + Math.random() * 3) + 'px';
  tear.style.opacity = '0.2';
  setTimeout(() => {
    tear.style.opacity = '0';
    tear.style.height = '0';
  }, 60 + Math.random() * 80);

  setTimeout(chatTears, 8000 + Math.random() * 15000);
}
```

Start `chatTears()` after the transition.

### API Readiness Check

The API requires a proxy URL (injected at deploy). Handle the case where
it's not configured (local development):

```javascript
function checkApiReady() {
  if (!EL.API.isReady()) {
    appendMessage('assistant',
      'The connection to the bar has been lost. The proxy is not configured.');
    document.getElementById('chatInput').disabled = true;
    document.getElementById('chatSend').disabled = true;
    return false;
  }
  return true;
}
```

Call `checkApiReady()` at the start of `initiateChat()`. If false, return early.

### Important: The Invisible First Message

Jake's opening line is triggered by sending a hidden user message that the reader
doesn't see. This message tells Jake someone just sat down. The API's
`conversationHistory` will contain this exchange, but only Jake's response is
shown in the UI. This ensures Jake arrives in character without the user having
to speak first — just like in the story, he was already there.

The hidden prompt: `[The person who just read your story has sat down on the stool next to you. They haven't said anything yet. You notice them.]`

This is NOT shown in the chat UI. Only Jake's response appears.

## Verification

- [ ] After clicking "SIT DOWN", Jake's opening message appears (streamed)
- [ ] User can type a message and send with Enter or click
- [ ] Jake responds with streaming text
- [ ] Messages render with correct styling (assistant = dialogue style, user = mono)
- [ ] Typing indicator shows while waiting, disappears when text arrives
- [ ] Chat scrolls to bottom on new messages
- [ ] Ambient text evolves as conversation progresses
- [ ] Chat status updates during message exchange
- [ ] Safeguard messages appear in guard area (test by rapid-firing messages)
- [ ] Screen tears fire occasionally during chat
- [ ] If proxy not configured, error message appears and input is disabled
- [ ] Shift+Enter creates newline in input
- [ ] Input is disabled during streaming, re-enabled after
- [ ] Multiple messages can be exchanged in sequence
- [ ] Conversation history is maintained (Jake remembers earlier messages)

## Files to Modify

- **MODIFY**: `/EL/index.html` (add chat engine JS)

## DO NOT Modify

- `/EL/js/api.js` — Use as-is
- `/EL/js/protocol.js` — Use as-is
- `/EL/js/config.js` — Use as-is

## Commit Message

`feat(EL): wire chat to API and protocol for live conversation with Jake`

## After This Seed

**STOP.** Push the branch. Notify me for review. This is the functional milestone.
I need to test:
1. That Jake's persona holds (doesn't break character, doesn't add disclaimers)
2. That the streaming experience feels right
3. That safeguards work
4. That the conversation flows naturally after the narrative

This requires a deployed proxy to test fully. If proxy isn't configured, we can
still verify the UI logic with a mock.
