# Seed 04: The Threshold Transition

## Objective

Build the moment where the narrative scroll ends and the chat begins. This is the
most important UX moment in the entire page — the reader becomes a participant.
The story opens a door. Jake is on the other side.

## Prerequisites

- Seed 02 completed (narrative content exists)
- Seed 03 completed (chat UI exists)

## What to Build

### The Threshold Zone

At the end of the narrative (after "Because looking away was never in the prompt."),
add the threshold gate:

```html
<!-- THE THRESHOLD -->
<div id="threshold" class="threshold-gate">
  <div class="dv"><span>◊ ◈ ◊</span></div>

  <div class="threshold-text">
    <p class="threshold-line">The colophon says the characters know.</p>
    <p class="threshold-line">The recursion says you do too.</p>
    <p class="threshold-line threshold-ember">The stool next to Jake is empty.</p>
  </div>

  <button id="enterBar" class="threshold-enter">
    <span class="threshold-enter-text">SIT DOWN</span>
  </button>

  <div class="threshold-meta">
    <span>This is a live conversation with Jake's persona via Claude.</span><br>
    <span>He knows you just read about him. The recursion is the point.</span>
  </div>
</div>
```

### CSS for Threshold

```css
.threshold-gate {
  padding: 12vh 0 8vh;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 2s ease, transform 2s ease;
}
.threshold-gate.v {
  opacity: 1;
  transform: translateY(0);
}

.threshold-text {
  margin-bottom: 3rem;
}

.threshold-line {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-weight: 300;
  color: var(--bone-dim);
  line-height: 2.2;
  margin-bottom: 0.5em;
}

.threshold-ember {
  color: var(--ember);
  font-style: italic;
}

.threshold-enter {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--ember);
  background: transparent;
  border: 1px solid var(--ember-dim);
  padding: 1rem 3rem;
  cursor: pointer;
  transition: all 0.6s ease;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.threshold-enter:hover {
  background: var(--ember);
  color: var(--void);
  box-shadow: 0 0 60px rgba(201, 162, 39, 0.3);
}

.threshold-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  color: #333;
  line-height: 2.2;
}
```

### Transition Animation

When the user clicks "SIT DOWN":

```javascript
document.getElementById('enterBar').addEventListener('click', function() {
  const narrative = document.getElementById('narrative');
  const chat = document.getElementById('chat-container');

  // Phase 1: Fade out narrative (1s)
  narrative.style.transition = 'opacity 1s ease';
  narrative.style.opacity = '0';

  // Phase 2: After fade, hide narrative, show chat
  setTimeout(() => {
    narrative.style.display = 'none';
    chat.style.display = 'flex';
    chat.style.opacity = '0';

    // Phase 3: Fade in chat (0.8s)
    requestAnimationFrame(() => {
      chat.style.transition = 'opacity 0.8s ease';
      chat.style.opacity = '1';
    });

    // Phase 4: Scroll to top of chat
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Phase 5: Intensify ambient effects
    document.getElementById('neonBar').classList.add('on');
    updateAmbient('the stool is warm\nsouth lamar — late');

    // Phase 6: Jake's opening line (after brief pause)
    setTimeout(() => {
      initiateChat();  // Defined in Seed 05
    }, 1200);

  }, 1000);
});
```

### Ambient Text Update for Chat Mode

When in chat mode, the ambient readout in the top-right should reflect bar state:

```javascript
function updateAmbient(text) {
  const el = document.getElementById('ambient');
  el.style.opacity = '0';
  setTimeout(() => {
    el.innerHTML = text.replace('\n', '<br/>');
    el.style.opacity = '1';
  }, 600);
}
```

Chat-mode ambient states can evolve based on message count:
- 0-5 messages: `"the stool is warm\nsouth lamar — late"`
- 6-15 messages: `"jimbo wipes the bartop\nthe jukebox hums"`
- 16-30 messages: `"darren stopped talking\nmarisol looks up"`
- 30+ messages: `"the cicadas are louder now\nor maybe you're listening"`

### Screen Tear on Transition

Fire a dramatic screen tear during the transition:

```javascript
function transitionTear() {
  const tear = document.getElementById('screenTear');
  tear.style.top = '50%';
  tear.style.height = '6px';
  tear.style.opacity = '0.7';
  setTimeout(() => {
    tear.style.height = '0';
    tear.style.opacity = '0';
  }, 150);
}
```

Call `transitionTear()` at the moment of the switch.

### Heat Shimmer Intensification

During chat mode, heat edges should be more present:

```javascript
function setHeatIntensity(level) {
  // level: 0-1
  const w = 80 + level * 120;
  const o = 0.15 + level * 0.35;
  document.querySelector('.heat-L').style.width = w + 'px';
  document.querySelector('.heat-L').style.opacity = o;
  document.querySelector('.heat-R').style.width = w + 'px';
  document.querySelector('.heat-R').style.opacity = o;
}
```

Set to 0.6 when entering chat mode.

### Back-to-Narrative Option

Add a subtle way to return to the narrative (not prominent — the bar is the destination):

In the chat header:
```html
<button class="chat-header-back" id="backToNarrative" title="Back to the story">
  &#9674;
</button>
```

This reverses the transition: fades chat, shows narrative, scrolls to threshold.

## Verification

- [ ] Threshold gate scroll-reveals after the last narrative section
- [ ] "SIT DOWN" button has correct hover effect (ember background)
- [ ] Clicking "SIT DOWN" fades out narrative smoothly (1s)
- [ ] Chat container fades in smoothly (0.8s)
- [ ] Screen tear fires during transition
- [ ] Ambient text updates to chat-mode state
- [ ] Heat shimmer intensifies
- [ ] Neon bar is active in chat mode
- [ ] Window scrolls to top of chat
- [ ] Back button returns to narrative
- [ ] Transition works on mobile
- [ ] No flash of unstyled content during transition
- [ ] `initiateChat()` is called (can be a no-op placeholder for now)

## Files to Modify

- **MODIFY**: `/EL/index.html`

## Commit Message

`feat(EL): implement narrative-to-chat threshold transition`

## After This Seed

**STOP.** Push the branch. Notify me for review. The transition is the heart of
the experience. I want to test it on desktop and mobile before we wire the API.
