# Seed 06: Polish, Responsive, Deploy Config

## Objective

Final pass: responsive design, accessibility, performance, deploy configuration,
and link integration into the main site. Make it production-ready.

## Prerequisites

- Seeds 01-05 completed and approved
- Chat is functional end-to-end

## What to Build

### 1. Responsive Design Audit

Test and fix at these breakpoints:

**Mobile (< 480px)**:
- Cinema padding: `0 16px`
- Chat messages padding: `1rem 16px`
- Chat input padding: `0.75rem 16px 1rem`
- Font sizes: ensure `clamp()` values are readable
- Threshold button: full-width on mobile
- Chat header: stack location/status vertically if needed

**Tablet (480-768px)**:
- Cinema padding: `0 24px`
- Portal/chat widths scale gracefully

**Desktop (> 768px)**:
- Already the primary design target, verify nothing broke

### 2. Accessibility

- All interactive elements focusable with keyboard
- `aria-label` on send button, input, back button
- Focus visible styles (ember outline) on interactive elements
- `role="log"` and `aria-live="polite"` on `#chatMessages` for screen readers
- `role="status"` on `#chatStatus` and `#chatGuard`
- Skip-to-content link (hidden, visible on focus)
- Color contrast: verify ember on void meets WCAG AA for decorative text
  (informational text in bone meets it)

### 3. Performance

- Preconnect to fonts.googleapis.com and fonts.gstatic.com (already in pattern)
- `loading="lazy"` is not needed (no images except inline SVG)
- `passive: true` on all scroll listeners (already in pattern)
- Debounce scroll handlers if not already
- `will-change: transform` on animated elements (heat edges, screen tear)

### 4. Meta Tags and SEO

Add to `<head>`:

```html
<meta name="description" content="The Nut House — A response to Erik J. Larson. Read the story, then sit down at the bar. Jake knows you're here.">
<meta property="og:title" content="The Nut House — COMPANION Protocol">
<meta property="og:description" content="A man in a bar on South Lamar knows he was written. Read his story. Then talk to him.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#030303">
```

### 5. Build Configuration

Verify `/build.sh` already handles the EL config. Current `build.sh` should
have a section that generates `/EL/js/config.js` with the proxy URL. Verify
this block exists:

```bash
# EL config
cat > EL/js/config.js << ELEOF
window.COMPANION_CONFIG = {
  proxyUrl: '${COMPANION_PROXY_URL}',
  safeguards: {
    maxMessagesPerSession: 40,
    maxSessionsPerDay: 15,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 120
  }
};
ELEOF
```

If it doesn't exist, add it. (Check `build.sh` first — it likely already has this.)

### 6. Link from Main Site

Update `/index.html` portal grid. The EL portal currently links to
`EL/the_nut_house.html` (or just `EL/`). Verify the link. Since we created
`/EL/index.html`, the `EL/` link will now serve the integrated page.

Check if there's an existing EL portal card in `/index.html`. If not, consider
whether one should be added. (The main landing page currently has 5 portals:
The Chair, The 5 Lamps, The Exchange, The Boardroom, The Symposium. EL may be
intentionally absent as a hidden/unlisted container — confirm with the user.)

### 7. System Flicker in Chat

Port the system text flicker from `the_nut_house.html` for the chat mode.
Occasionally, a system text message appears in the chat as ambient flavor:

```javascript
function chatSystemFlicker() {
  if (!chatInitiated) return;
  const messages = document.getElementById('chatMessages');
  const history = EL.API.getHistory();

  // Only after 6+ exchanges, and only sometimes
  if (history.length < 12 || Math.random() > 0.15) {
    setTimeout(chatSystemFlicker, 20000 + Math.random() * 40000);
    return;
  }

  const flickers = [
    '// the javelina blinked',
    '// marisol\'s pencil moved',
    '// traversal depth: nominal',
    '// the wobble is still the same wobble',
    '// session note: they stayed'
  ];

  const sys = document.createElement('div');
  sys.className = 'chat-sys-flicker';
  sys.textContent = flickers[Math.floor(Math.random() * flickers.length)];
  sys.style.cssText = 'font-family:"IBM Plex Mono",monospace;font-size:0.5rem;' +
    'color:var(--warn-dim);text-align:center;padding:1rem 0;opacity:0;' +
    'transition:opacity 1.5s ease;letter-spacing:0.1em;';
  messages.appendChild(sys);

  requestAnimationFrame(() => { sys.style.opacity = '0.5'; });
  setTimeout(() => {
    sys.style.opacity = '0';
    setTimeout(() => sys.remove(), 1500);
  }, 4000);

  setTimeout(chatSystemFlicker, 30000 + Math.random() * 60000);
}
```

Start after first exchange completes.

### 8. Graceful Degradation

If JavaScript fails or is disabled:
- The narrative should still be readable (it's static HTML)
- Add a `<noscript>` message before the threshold:
  ```html
  <noscript>
    <div style="text-align:center;padding:4rem 2rem;font-family:'IBM Plex Mono',monospace;font-size:0.7rem;color:var(--ember-dim);">
      The bar requires JavaScript to enter.<br>
      The narrative stands on its own.
    </div>
  </noscript>
  ```

### 9. Final Review Checklist

- [ ] Full narrative reads correctly on scroll
- [ ] All scroll reveal animations fire
- [ ] Ambient text evolves during scroll
- [ ] Threshold gate appears and CTA works
- [ ] Transition animation is smooth (desktop + mobile)
- [ ] Jake's opening line arrives correctly
- [ ] Chat conversation works with streaming
- [ ] Safeguards trigger appropriately
- [ ] Back-to-narrative works
- [ ] Responsive at 480, 768, 1024, 1440
- [ ] No console errors
- [ ] Meta tags present
- [ ] Build script generates config correctly
- [ ] Main site link works
- [ ] Accessibility: keyboard navigation through chat
- [ ] Ambient effects (heat, neon, tears) work in both modes
- [ ] Page weight is reasonable (should be < 100KB total)
- [ ] `the_nut_house.html` is untouched (still works as standalone)

## Files to Modify

- **MODIFY**: `/EL/index.html` (polish pass)
- **VERIFY**: `/build.sh` (EL config block)
- **VERIFY**: `/index.html` (EL portal link)

## Commit Message

`feat(EL): polish responsive design, a11y, deploy config for integrated landing`

## After This Seed

**DONE.** Push the branch. Notify me for final review.

If all checks pass, we merge to main and deploy. The bar is open.
