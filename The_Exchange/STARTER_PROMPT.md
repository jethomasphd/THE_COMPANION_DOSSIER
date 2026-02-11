# CLAUDE CODE STARTER PROMPT
# Copy this entire block and paste it into a Claude Code session to begin building THE EXCHANGE.

---

## Context

You are building **THE EXCHANGE** — a self-contained web application that fuses the COMPANION Protocol (a framework for LLM-instantiated personas) with XML job feed data to create a dialogic job discovery experience. A user arrives, dialogues with a committee of archetypal personas who have access to real job listings, and exits through a threshold directly into a job application.

THE EXCHANGE is the third container in the "Personas + Data = Container" pattern, following The Committee of Patriots (investment principles) and The 5 Lamps (medical ethics). The architecture should reflect this lineage.

## Your Instructions

Read `README.md` and `exchange_grimoire.json` in this repository. These are your complete specification. The README contains the architecture, file structure, build sequence, technical stack, data flow, and design system. The grimoire contains the persona specifications and protocol adaptations.

**Build in the sequence specified in the README under "Build Sequence":**

### Stage 1: Data Pipeline
Build the Python pipeline (`pipeline/` directory):
1. `parse_xml.py` — Accepts an XML job feed file + a JSON field mapping config → outputs normalized JSON. Must handle multiple XML schemas via configurable field mappings. Use `lxml` for parsing. Handle missing fields gracefully.
2. `enrich_listings.py` — Takes normalized JSON → calls an LLM API (OpenAI GPT-4o-mini by default, configurable) with the enrichment prompt template from `prompts/enrichment_prompt.txt` → appends the enrichment text to each listing.
3. `embed_listings.py` — Takes enriched JSON → calls OpenAI embedding API (`text-embedding-3-small`, 1536 dimensions) → appends embedding vectors to each listing.
4. `build_corpus.py` — Orchestrates all three steps: XML → normalized JSON → enriched → embedded → final `corpus.json`.

Create a sample XML file (`corpus/sample_feed.xml`) with ~20 realistic job listings for testing. Create the corresponding field mapping config.

### Stage 2: Core Dialogue Engine
Build the frontend application (`app/index.html`) as a **single self-contained HTML file** with inline CSS and JS:
1. Load `corpus.json` (the pre-processed job corpus with embeddings)
2. Implement conversation state management (message history, user profile, active phase, active personas)
3. Implement system prompt assembly — dynamically build the system prompt per turn from: grimoire base + active persona specs + phase instructions + user profile summary + candidate pool context
4. Make API calls to the Anthropic Claude API for dialogue (the API key will be entered by the user in a config panel)
5. Render the dialogue with persona-colored message bubbles per the design system

### Stage 3: Matching Engine
Implement in the same `app/index.html`:
1. In-browser cosine similarity function (pure JS, no dependencies)
2. Candidate pool management: initialize from corpus embeddings + user profile vector, re-rank per turn, detect convergence
3. Wire each user dialogue turn to: embed via API → update user profile vector → re-rank pool → feed top candidates into persona context
4. The Stranger persona receives the top candidate listings in its context so it can embody them

### Stage 4: Full Container Integration
1. Implement all three phases (Invocation → Symposium → Threshold) with transitions
2. Multi-persona rendering — each persona gets a distinct color and label per the grimoire
3. The Stranger's dynamic construction (cluster → narrowing → specific listing)
4. The Shadow's conditional activation (divergence detection between stated and revealed preferences)
5. The threshold exit: visual transition, committee final statements, "Cross the Threshold" button linking to the top match's `apply_url`
6. Apply the full design system from the README (dark theme, ember gold accents, Cormorant Garamond, etc.)

## Technical Constraints
- The prototype is a **single self-contained HTML file** — all CSS and JS inline, loadable in a browser with no server
- API keys (Anthropic for dialogue, OpenAI for embeddings) are entered by the user via a configuration panel in the UI
- The pipeline scripts are Python 3, using `lxml`, `openai`, `numpy`, `scipy`
- CDN imports are acceptable for fonts (Google Fonts) and optional libraries
- The corpus JSON is loaded via file input or hardcoded path for the prototype

## Design System (Critical)
Follow the design specifications in the README exactly:
- Background: `#030303` to `#0a0a0a`
- Primary accent: ember gold `#c9a227`
- Text: off-white `#e8e0d0`
- Fonts: Cormorant Garamond (display), IBM Plex Sans (body), IBM Plex Mono (code/data)
- Persona colors: Cartographer `#1a8c8c`, Ancestor `#d4a030`, Stranger `#7a8fa6`, Shadow `#8c3a3a`, User `#e8e0d0`
- Transitions: slow fades, no bounce/jitter
- Sigil motifs: `◊ ◈ ◊`
- This is NOT a corporate product. It is a mystical/ritualistic experience. Design accordingly.

## What Success Looks Like
A user can:
1. Open `index.html` in a browser
2. Enter their API keys
3. Load a `corpus.json` (pre-built via the pipeline from XML feeds)
4. Be greeted by The Ancestor: "Tell me where you've been."
5. Have a multi-turn conversation where personas emerge, engage, and narrow
6. Reach convergence — where The Stranger embodies a specific role
7. See the threshold transition
8. Click "Cross the Threshold" and be taken to the job's actual application URL

Begin with Stage 1. Build each file, test it, then proceed to the next stage.
