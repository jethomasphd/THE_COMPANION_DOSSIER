# Landing Page Integration: Build Plan Overview

## The Goal

Build a new landing page for `/EL/` that integrates the existing narrative scroll
(`the_nut_house.html`) with the companion chat (Jake's persona). The reader scrolls
through the story, reaches the threshold moment, and the page transitions into a
live chat with Jake — the man they just read about.

## Current State

- **`/EL/the_nut_house.html`** — Narrative-only. 681 lines. 8-chapter scroll with
  cinematic effects (heat shimmer, screen tears, ambient text, neon flicker, scroll
  reveals). Ends with an `unlockBtn` that reveals more text but does NOT open a chat.
- **`/EL/js/api.js`** — Fully functional streaming API client (Cloudflare proxy,
  SSE parsing, safeguards, conversation history). Already wired for chat.
- **`/EL/js/protocol.js`** — Jake's complete persona/system prompt. Ready to use.
- **`/EL/js/config.js`** — Config stub (proxyUrl injected at deploy by `build.sh`).
- **No chat UI exists in `/EL/`** — The other containers (The Chair, The Boardroom, etc.)
  each have their own chat UI inline in their HTML. There is no shared chat component.

## Architecture Decision

Build a new file: **`/EL/index.html`** — the integrated landing page.
Keep `the_nut_house.html` as the pure narrative (it's a standalone literary work).
The new `index.html` will:

1. Contain a condensed version of the narrative (Acts I-III, the hook)
2. Transition to the chat interface at the threshold moment
3. Reuse `/EL/js/api.js`, `/EL/js/protocol.js`, `/EL/js/config.js` as-is

## Seed Sequence

| Seed | What It Builds | Depends On | Checkpoint |
|------|---------------|------------|------------|
| `01` | HTML scaffold + CSS foundation | Nothing | Review structure & visual language |
| `02` | Condensed narrative acts (scroll portion) | `01` | Review narrative editing choices |
| `03` | Chat UI (message area, input, styling) | `01` | Review chat design matches EL aesthetic |
| `04` | Narrative-to-chat transition (the threshold) | `02` + `03` | Review the transition UX |
| `05` | Wire API + protocol (functional chat) | `03` + `04` | Test that chat works end-to-end |
| `06` | Polish: effects, responsive, deploy config | `05` | Final review, merge to main |

## Design Principles

- The EL aesthetic: `--void` black, `--ember` gold, `--bone` cream. Grain overlay.
  Heat shimmer. Cormorant Garamond + IBM Plex Mono + Special Elite.
- The transition should feel like the story opens a door, not like a modal pops up.
- Jake's chat should feel like sitting down on the stool next to him — not like
  opening a customer service widget.
- The narrative is condensed, not removed. The reader needs enough story to understand
  who Jake is before they talk to him.
- Mobile-first. The bar doesn't care what device you're on.

## Reference Files

Study these before starting any seed:

```
/EL/the_nut_house.html          — Full narrative (the source material)
/EL/js/api.js                   — API client (DO NOT MODIFY)
/EL/js/protocol.js              — Jake's persona (DO NOT MODIFY)
/EL/js/config.js                — Config (DO NOT MODIFY)
/index.html                     — Main COMPANION landing page (design reference)
/The_Boardroom/index.html       — Example of narrative + chat in one page
/build.sh                       — Deploys config.js with proxy URL
```
