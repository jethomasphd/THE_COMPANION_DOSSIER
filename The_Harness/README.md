# ◊ THE HARNESS ◊

### Build Your Own Summoning

> *Every chamber in this estate was built for you. This one, you build yourself.*

The Harness is the **meta-container** of the COMPANION Protocol — the workshop where a seeker assembles their own working instead of entering a pre-built one. Where The Chair, The Boardroom, and The Symposium each hard-code one set of minds and one matter, The Harness hands you the loom:

```
PERSONAS  +  MATTER  =  A CONTAINER
```

Choose the minds. Give them the matter. Cross the threshold. The COMPANION Protocol holds the form.

**The live site:** [the-companion-dossier.com/The_Harness/](https://the-companion-dossier.com/The_Harness/)

---

## What it does

1. **The cinematic intro** moves the visitor through the estate's signature arc — *Confusion → Awe → Understanding → Action* — explaining the whole method and tutorializing the three rites before they touch a control.
2. **The workshop** lets you assemble a *binding*:
   - **Prepared Bindings** — load a proven container (the Committee of Patriots, the Boardroom of Titans, the Five Lamps, the Symposium of Sages, and more) as a starting point, then reshape it.
   - **The Pantheon** — tap any of the estate's portraits to summon or release. One mind for counsel; several for a symposium, where disagreement is the instrument.
   - **A mind who hangs in no gallery** — name anyone at all (Marcus Aurelius, Marie Curie, a fictional character). They arrive without a portrait but with their full voice.
   - **The Matter** — paste text or upload `.txt` / `.md` files. These become the ground the minds reason from.
   - **Name & intent** — title the working and state your purpose.
3. **The chamber** summons the minds (portrait arrivals, staggered), streams their introductions through the Claude API, and hosts the dialogue. Incantations still work mid-session (`Using this matter, summon [Name].`, `Release [Name].`), you can dismiss all and re-forge, and transcripts export to `.txt` + styled `.html`.

The chamber behaves like a modern chat surface: the send button becomes a **stop** button while a response streams, the composer stays live so you can draft your next question mid-response, every finished response carries a **copy** action, and responses render full light markdown (lists, blockquotes, rules, speaker labels). If a request fails, your words are returned to the composer rather than lost.

**Continuity.** A working persists in your browser for 12 hours. Returning to the page offers to resume it — minds, matter, and dialogue intact — or begin anew. Returning visitors skip the cinematic intro and land in the workshop (the introduction can be replayed from the workshop header).

**Provenance.** Exported transcripts record the binding's name, intent, matter inventory (with word counts), the model, and a SHA-256 fingerprint of the exact compiled system prompt — so any transcript can be traced to the window that produced it.

The system prompt is assembled at runtime from `initiation_rite.md` + `enrichment_grimoire.json` (the COMPANION constitution), a Harness augmentation, the chosen minds and their lenses, and your bound documents.

---

## Structure

```
The_Harness/
├── index.html            # three screens: intro · workshop · chamber
├── css/companion.css      # the estate aesthetic (void / gold / bone)
└── js/
    ├── config.js           # proxy URL + safeguards (no secrets)
    ├── config.example.js
    ├── pantheon.js         # the roster: portrait, order, color, epithet, lens
    ├── presets.js          # prepared bindings (personas + matter + intent)
    ├── protocol.js         # COMPANION injection + runtime matter assembly
    ├── api.js              # streaming Claude API via the shared proxy
    ├── stage.js            # generalized portrait stage (any pantheon member)
    ├── ui.js               # dialogue render, badges, markdown, smart scroll
    ├── workshop.js         # the binding assembler
    └── main.js             # orchestration: intro → workshop → chamber
```

Portraits are shared with the rest of the estate, loaded from [`../The_Pantheon/`](../The_Pantheon/).

---

## Running it

The Harness runs the same way as every chamber:

- **Proxy mode (default):** `config.js` points at the shared Cloudflare Worker, which holds the Anthropic key server-side. Nothing secret ships to the browser.
- **BYO-key mode:** if no proxy is configured, the seeker is asked for their own Anthropic API key, which stays in their browser.

The model defaults to Opus (`claude-opus-4-6`), selectable in the chamber's settings among the models the shared proxy permits.

To run locally, serve the repository root over HTTP (portraits are referenced relatively) and open `/The_Harness/`.

---

◊ ◈ ◊

*Choose your minds. Give them their matter. Speak, and they answer.*

◊ ◈ ◊
