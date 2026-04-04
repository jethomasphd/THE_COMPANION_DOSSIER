# Seed 03: Chat UI

## Objective

Build the chat interface inside `#chat-container`. This is the visual layer only —
no API wiring yet. The chat should render correctly with placeholder/static content
and accept input (but not send it anywhere).

## Prerequisites

- Seed 01 completed (CSS foundation exists)
- Can be built in parallel with Seed 02 (no dependency on narrative content)

## What to Build

### HTML Structure

Inside `<div id="chat-container" class="chat-container">`:

```html
<div id="chat-container" class="chat-container">

  <!-- Bar atmosphere header -->
  <div class="chat-header">
    <div class="chat-header-ambient">
      <span class="chat-header-location">The Nut House — South Lamar</span>
      <span class="chat-header-status" id="chatStatus">the stool is warm</span>
    </div>
  </div>

  <!-- Message area -->
  <div class="chat-messages" id="chatMessages">
    <!-- Messages will be inserted here dynamically -->
    <!-- Example structure for styling reference:
    <div class="msg msg-assistant">
      <div class="msg-content">
        <p>The heat hasn't let up since you sat down. Neither has the jukebox.</p>
      </div>
    </div>
    <div class="msg msg-user">
      <div class="msg-content">
        <p>How long have you been here, Jake?</p>
      </div>
    </div>
    -->
  </div>

  <!-- Input area -->
  <div class="chat-input-area">
    <div class="chat-input-wrap">
      <textarea
        id="chatInput"
        class="chat-input"
        placeholder="Say something to Jake..."
        rows="1"
        maxlength="2000"
        aria-label="Message to Jake"
      ></textarea>
      <button id="chatSend" class="chat-send" aria-label="Send message">
        <span class="chat-send-icon">&rarr;</span>
      </button>
    </div>
    <div class="chat-input-meta">
      <span id="chatGuard" class="chat-guard"></span>
      <span class="chat-input-hint">press enter to send</span>
    </div>
  </div>

</div>
```

### CSS for Chat Components

Add to the existing `<style>` block:

**`.chat-container`**:
- `display: none` by default (shown via JS in Seed 04)
- When visible: `display: flex; flex-direction: column; min-height: 100vh;`
- `background: var(--void)`
- `position: relative`

**`.chat-header`**:
- Fixed or sticky top bar
- `background: var(--void); border-bottom: 1px solid rgba(201,162,39,0.08);`
- `padding: 16px 32px;`
- `font-family: 'IBM Plex Mono', monospace; font-size: 0.55rem;`
- `letter-spacing: 0.12em; text-transform: uppercase;`
- `color: var(--ember-dim);`
- Flexbox: location left, status right

**`.chat-messages`**:
- `flex: 1; overflow-y: auto; padding: 2rem 32px; max-width: 700px; margin: 0 auto; width: 100%;`
- Custom scrollbar: `scrollbar-width: thin; scrollbar-color: var(--ember-dim) var(--void);`
- Scroll to bottom on new messages

**`.msg`**:
- `margin-bottom: 2rem; max-width: 85%;`
- `animation: fadeIn 0.6s ease;`

**`.msg-assistant`**:
- `margin-right: auto;` (left-aligned)
- `.msg-content p`: `font-family: 'Cormorant Garamond', serif; font-size: clamp(1.05rem, 2.2vw, 1.2rem);`
- `font-style: italic; font-weight: 400; color: var(--ember); line-height: 2;`
- `padding-left: 1.4em; border-left: 1px solid var(--ember-dim);`
- This mirrors the `.dl` dialogue style from the narrative — Jake's chat messages
  should look exactly like his dialogue in the story.

**`.msg-user`**:
- `margin-left: auto;` (right-aligned)
- `.msg-content p`: `font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;`
- `color: var(--bone-dim); line-height: 1.8; letter-spacing: 0.02em;`
- `text-align: right;`
- No border, no background — minimal presence. The user is a visitor at the bar.

**`.typing-indicator`**:
- Three dots in ember-dim, pulsing with staggered animation
- `font-family: 'IBM Plex Mono'; font-size: 0.7rem; color: var(--ember-dim);`
- Left-aligned like assistant messages

**`.chat-input-area`**:
- `position: sticky; bottom: 0;`
- `background: linear-gradient(transparent, var(--void) 20%);`
- `padding: 1rem 32px 1.5rem; max-width: 700px; margin: 0 auto; width: 100%;`

**`.chat-input-wrap`**:
- `display: flex; align-items: flex-end; gap: 12px;`
- `border: 1px solid rgba(201,162,39,0.12);`
- `background: rgba(0,0,0,0.6);`
- `transition: border-color 0.3s ease;`
- On focus-within: `border-color: var(--ember-dim);`

**`.chat-input`** (textarea):
- `flex: 1; background: transparent; border: none; outline: none;`
- `color: var(--bone); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;`
- `padding: 14px 16px; resize: none; line-height: 1.6;`
- `max-height: 120px;` (auto-grow up to ~5 lines)
- Placeholder: `color: rgba(212,207,196,0.25);`

**`.chat-send`** (button):
- `background: transparent; border: none; cursor: pointer;`
- `color: var(--ember-dim); padding: 14px 16px;`
- `font-size: 1rem; transition: color 0.3s ease;`
- On hover: `color: var(--ember);`
- Disabled state: `opacity: 0.3; cursor: default;`

**`.chat-input-meta`**:
- `display: flex; justify-content: space-between; padding: 6px 4px 0;`
- `font-family: 'IBM Plex Mono'; font-size: 0.5rem; color: #333;`

**`.chat-guard`** (safeguard messages):
- `color: var(--warn-dim);` when showing limit warnings

### JavaScript (UI only, no API)

Add basic UI interactivity:

```javascript
// Auto-grow textarea
const chatInput = document.getElementById('chatInput');
chatInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Enter to send (shift+enter for newline)
chatInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    // sendMessage() — will be wired in Seed 05
  }
});

// Helper: add message to chat
function appendMessage(role, text) {
  const messages = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = 'msg msg-' + role;
  msg.innerHTML = '<div class="msg-content"><p>' + text + '</p></div>';
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// Helper: show/hide typing indicator
function showTyping() {
  const messages = document.getElementById('chatMessages');
  const indicator = document.createElement('div');
  indicator.className = 'msg msg-assistant typing-indicator';
  indicator.id = 'typingIndicator';
  indicator.innerHTML = '<div class="msg-content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
  messages.appendChild(indicator);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}
```

## Verification

- [ ] Temporarily set `chat-container` to `display: flex` to verify layout
- [ ] Chat header renders with location and status
- [ ] Message area scrolls
- [ ] Add test messages via `appendMessage('assistant', '...')` and `appendMessage('user', '...')`
  to verify both styles render correctly
- [ ] Assistant messages look like Jake's dialogue in the narrative (italic, ember, left border)
- [ ] User messages are minimal and right-aligned
- [ ] Textarea auto-grows on multiline input
- [ ] Enter key triggers (but doesn't send yet)
- [ ] Typing indicator renders with pulsing dots
- [ ] Input area sticks to bottom
- [ ] Responsive: messages and input scale correctly at 600px and below
- [ ] Reset `chat-container` back to `display: none` after testing

## Files to Modify

- **MODIFY**: `/EL/index.html` (add chat HTML + CSS + UI JS)

## Commit Message

`feat(EL): add chat UI components to integrated landing page`

## After This Seed

**STOP.** Push the branch. Notify me for review. I want to see the chat styling
before the transition and API wiring happen. The visual language of the chat needs
to feel like the story continued, not like a widget appeared.
