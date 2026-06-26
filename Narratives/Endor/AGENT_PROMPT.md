# AGENT BRIEF · ENDOR PROTOCOL

You are building one interactive story inside an existing repository of cinematic stories. The repository already contains other completed stories and a working Cloudflare Worker that proxies the Anthropic Messages API. Your job is to grow a new story, ENDOR PROTOCOL, from its seed, so that it belongs to the same hand as its neighbors and wires a live Claude conversation into its second half.

Read this brief fully before writing code. Then work in the order below.

## 1. Orient before you touch anything

- Read `seed.md` in full. It is the specification and the soul. The prose blocks inside it (the green room, the threshold, the coda) are final and do not change. You render them; you never edit, expand, summarize, or "improve" them.
- Read at least one existing story in this repository end to end: its file structure, its build setup, its routing, its typography, its motion, its color tokens. The new story must feel like a sibling, not a transplant.
- Read the existing Cloudflare Worker and the client code that calls it. You will reuse this backend. Do not write a new one. Learn its request shape, its model configuration, and how it keeps the API key server-side.

Do not begin implementation until you can answer: how do the existing stories ship, and how does a story call the Worker.

## 2. What you are building

A single story with two rooms and one door, exactly as `seed.md` Section IV lays out:

1. An overture (epigraph, the clock at 8:00, an entry prompt).
2. A green room of eight authored beats, fixed prose, advanced one beat at a time, with an analog clock counting down. The reader believes they are a witness.
3. A door: Beat 8 closes the vow, then a long held black.
4. A threshold: the turn. New mono text reveals the reader was never the witness. The door opens for them.
5. A chamber: a live conversation with Claude, where Claude is Alex the interrogator and the reader is the summoned dead man. This is the climax. It has no clock; it breathes, and it concludes when the arc is complete.
6. A coda: the release, what remains, the dedication.

The single design test, from the author, is this: the reader is summoned the way the dead man is summoned, and is asked, by the end, to know it. If, at the door and again at the threshold, a first-time reader does not feel the floor open, the build is not done.

## 3. Honor the fixed prose and the aesthetic

- Render the green-room, threshold, and coda text from `seed.md` verbatim, including every line break and every centered `·  ·  ·` separator.
- Match the type and color system exactly: Cormorant Garamond for prose and display, IBM Plex Mono for interface and the system's voice, background `#030303`, ember gold `#c9a227`, warm bone for prose (never pure white).
- No em dashes anywhere, in prose, UI strings, comments, or the system prompt. Use periods, commas, colons, parentheses.
- Darkness is the design. Light falls only where `seed.md` says it falls. Do not add glows, particles, or decoration to "make it pop." Resist this specifically.
- Motion is slow and sacramental. The door transition is a long held black, not a slide or page-turn. Honor `prefers-reduced-motion` on every animated element, including the chamber's affect field.

## 4. Build the live chamber correctly

This is the climax and the most important part of the build. It is also the technically novel half. Get this right above all else. Follow `seed.md` Sections VII and VIII precisely.

- Reuse the existing Worker. The chamber's client maintains the running `messages` array (the reader's lines as `user`, Alex's as `assistant`) and posts `{ system, messages, max_tokens, model }` to it, with `system` set to the chamber system prompt quoted verbatim in `seed.md` Section VII and `model` set to the repository's configured model. Keep `max_tokens` modest.
- Alex speaks first. Either seed an empty user turn so the model produces the opening operational question, or render the fixed opening line and let the model own everything from the reader's first reply onward.
- The conversation must be good, and it must be able to conclude. It ends when Alex ends it: the client watches for the literal release line `Return to baseline.` and transitions to the coda when it appears. The system prompt is built to reach that release after a real, complete exchange. Add a generous safety-net ceiling (about twenty reader turns) only to guarantee the room can never trap the reader; it should almost never trigger, and it must not be the thing that ends the scene. Do not cut the conversation short, and do not let it run without end.
- The affect field is driven by the known beat of the arc, not by sentiment analysis. Use the envelope in `seed.md` Section VIII. It must read as heat behind a wall, never as an audio visualizer.
- Keep the API key on the server. The client never holds it.

## 5. Guardrails that are load-bearing

The war and the warheads are a fiction that frames a scene about grief and conscience. The system prompt in `seed.md` already instructs Alex never to produce real operational, tactical, or weapons information and to stay in her grief-and-conscience register if a reader pushes there. Preserve that prompt verbatim. Do not soften it, do not add assistant-style hedging to it, and do not let any code path turn the chamber into a vehicle for real-world harmful content.

## 6. Quality bar

- No autoplay audio. If you include the optional fluorescent-buzz ambience, it loads muted, respects reduced-motion and audio preferences, and the piece is devastating in silence without it.
- No browser storage. Hold all session state in memory. A reload returns the reader to the door, summoned again.
- Full accessibility: real text (never images of text), semantic headings per beat, `aria-live` on incoming chamber lines, visible ember focus states, color never the only signal, full keyboard navigation, correct `lang` on the biblical italics.
- Mobile: single-column green room, performant affect field (cap DPR on small screens), chamber input above the keyboard.

## 7. Definition of done

- The story is integrated into the repository the way its neighbors are, builds clean, and shares their structure and aesthetic.
- The green room renders the fixed prose perfectly, advances one beat at a time, and the clock counts down 8 to 1.
- The door and the threshold land. The floor opens.
- The chamber holds a live Claude conversation as Alex that feels real, responds to what the reader actually says, runs the full arc, and reaches its own natural release and the coda after a genuine exchange, no matter what the reader types. It is never cut short, and it never runs without end.
- The covenant in `seed.md` Section XI is satisfied in every particular.

Build the door.
