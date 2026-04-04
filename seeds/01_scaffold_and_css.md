# Seed 01: HTML Scaffold + CSS Foundation

## Objective

Create `/EL/index.html` with the complete HTML skeleton and all CSS.
No narrative content yet. No chat logic. Just the bones and the skin.

## What to Build

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta, fonts, inline <style> -->
</head>
<body>
  <!-- Ambient layers (same pattern as the_nut_house.html) -->
  <div class="vignette"></div>
  <div class="heat-L"></div>
  <div class="heat-R"></div>
  <div class="neon-bar" id="neonBar"></div>
  <div class="screen-tear" id="screenTear"></div>
  <div class="ambient" id="ambient"></div>

  <!-- Navigation sigil (top-left, links back to /) -->
  <a href="/" class="sigil-home" title="Return to COMPANION">&#9674;</a>

  <!-- PHASE 1: The Narrative Scroll -->
  <div id="narrative" class="cinema">
    <!-- Acts will go here in Seed 02 -->
    <div class="black-leader"><!-- Title card placeholder --></div>
    <!-- Narrative sections placeholder -->
    <!-- THE THRESHOLD: the moment the story becomes interactive -->
    <div id="threshold" class="threshold-gate">
      <!-- Transition element — Seed 04 -->
    </div>
  </div>

  <!-- PHASE 2: The Chat -->
  <div id="chat-container" class="chat-container">
    <!-- Chat UI will go here in Seed 03 -->
  </div>

  <!-- Scripts -->
  <script src="js/config.js"></script>
  <script src="js/api.js"></script>
  <script src="js/protocol.js"></script>
  <script>
    // Main app logic will go here in Seeds 04-05
  </script>
</body>
</html>
```

### CSS Requirements

Port the following from `the_nut_house.html` exactly:

1. **CSS variables** — All `:root` vars (void, ember, bone, warn, glitch, neon-shiner)
2. **Reset** — `* { margin:0; padding:0; box-sizing:border-box; }`
3. **Grain overlay** — `body::before` with SVG noise texture
4. **Heat edges** — `.heat-L`, `.heat-R` with `heatPulse` animation
5. **Vignette** — `.vignette` radial gradient overlay
6. **Ambient readout** — `.ambient` fixed top-right
7. **Neon bar** — `.neon-bar` with `neonFlicker` animation
8. **Screen tear** — `.screen-tear` glitch element
9. **Cinema container** — `.cinema` max-width 700px centered
10. **All narrative styles** — `.black-leader`, `.marker`, `.sc`, `.dl`, `.bt`, `.dv`, `.interf`, `.sys`, `.reveal`, `.manuscript`, `.javelina-eyes`, `.colophon`
11. **All animations** — `fadeIn`, `pulse`, `heatPulse`, `neonFlicker`, `eyePulse`
12. **Responsive breakpoints** — 600px for cinema narrowing

Add NEW CSS for:

13. **`.sigil-home`** — Fixed top-left, small diamond link, ember-dim color, hover to ember
14. **`.chat-container`** — Hidden by default (`display: none`), full-viewport-height, flex column
15. **`.chat-messages`** — Scrollable message area, flex-grow
16. **`.chat-input-area`** — Fixed bottom bar with input + send button
17. **`.msg`** — Individual message bubble (user vs. assistant styling)
18. **`.msg-user`** — Right-aligned, ember-dim border, bone text
19. **`.msg-assistant`** — Left-aligned, no border, ember-tinted text, Cormorant Garamond
20. **`.typing-indicator`** — Three-dot pulse animation
21. **`.threshold-gate`** — The transition zone (centered, padded, with a CTA)

### Fonts

Same as `the_nut_house.html`:
```
Cormorant Garamond (300,400,500,600 + italics)
IBM Plex Mono (300,400 + italics)
Special Elite
```

### Visual Language for Chat

The chat should NOT look like a typical chat widget. Guidelines:
- Messages from Jake: left-aligned, no bubble background, italic Cormorant Garamond,
  ember color, with a thin left border (same as `.dl` dialogue style from the narrative).
- Messages from the user: right-aligned, bone-dim color, IBM Plex Mono, small font,
  subtle border.
- Input area: dark background, ember border on focus, IBM Plex Mono placeholder text.
- No rounded corners. No shadows. No modern chat-app aesthetics.
- The chat area should feel like the narrative page extended downward into a conversation.

## Verification

- [ ] File exists at `/EL/index.html`
- [ ] Page loads with black void background and grain overlay
- [ ] Heat shimmer edges visible and animated
- [ ] Vignette overlay renders
- [ ] Neon bar element exists (will activate on scroll later)
- [ ] Sigil home link in top-left corner works
- [ ] `#narrative` section visible, `#chat-container` hidden
- [ ] All CSS variables match `the_nut_house.html` values
- [ ] Scripts load without errors (api.js, protocol.js, config.js)
- [ ] Responsive: cinema container narrows below 600px

## Files to Create/Modify

- **CREATE**: `/EL/index.html`

## Files to Read First

- `/EL/the_nut_house.html` (lines 1-257 for CSS, 259-271 for ambient layers)
- `/index.html` (lines 13-28 for CSS variable reference)

## Commit Message

`feat(EL): scaffold integrated landing page with CSS foundation`

## After This Seed

**STOP.** Push the branch. Notify me for review before proceeding to Seed 02.
I want to see the visual foundation before narrative content goes in.
