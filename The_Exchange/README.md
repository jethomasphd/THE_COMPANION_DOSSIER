# THE EXCHANGE

### A Dialogic Job Discovery Experience

> *What if finding work meant being found?*

---

## What It Is

THE EXCHANGE is a web application that replaces the traditional job search (scroll, keyword, apply, hear nothing) with a focused conversation. You sit with a committee of four AI personas who help you find one job match through dialogue — not fifty links, one door.

It runs entirely in your browser. No backend, no accounts, no tracking. You bring your own Anthropic API key.

The committee draws on vetted job listings spanning every major industry across the national labor market. When it converges on a match, you're directed to [Best Jobs Online](https://jobs.best-jobs-online.com) to search for real listings.

---

## Quick Start

1. **Open** `index.html` in any modern browser
2. **Read** the landing page, then click **Enter the Exchange**
3. **Paste** your [Anthropic API key](https://console.anthropic.com/) when prompted
4. **Talk** to the committee — they'll ask about your location, background, and what you're looking for
5. **Cross the threshold** — click the exit link when the committee converges on your match

The whole experience takes about 5-7 minutes.

---

## The Committee

Four personas sit with you. Each sees your search differently.

| Persona | Role | What They Do |
|---|---|---|
| **The Coach** | Career pattern reader | Speaks first. Asks where you've been. Sees arcs and themes in your career. |
| **The Scout** | Labor market navigator | Maps the terrain — what's near you, what pays, where the gaps are. |
| **The Insider** | Industry veteran | Knows what the work is really like — the day-to-day, the tradeoffs, what they don't put in the posting. |
| **The Mirror** | Honest contrarian | Appears only when your stated wants don't match your revealed patterns. |

---

## How the Conversation Works

### Phase 1 — The Invocation

The Coach greets you alone. They'll ask:
- Where are you located?
- What's your background?
- What are you looking for?

Answer naturally. One exchange is enough.

### Phase 2 — The Symposium

The Scout and The Insider join. The committee works together:
- The Scout filters by your **location** and describes what's available nearby
- The Coach identifies **patterns** in what you've said
- The Insider gives **honest insider perspective** on what the matching roles are actually like

This takes 1-2 exchanges. The committee moves fast.

### Phase 3 — The Threshold

The committee converges on a match. A card appears in the chat with:
- The matched job title, company, location, and salary
- A direct link to **Best Jobs Online** to search for this role

One click. You land on the application page.

---

## What You Need

- A modern browser (Chrome, Firefox, Safari, Edge)
- An [Anthropic API key](https://console.anthropic.com/) — you'll need a funded account
- The key is stored in your browser's localStorage and never sent anywhere except the Anthropic API

---

## Cost

Each session uses approximately 5-10 API calls to Claude. At typical Sonnet pricing, a full session costs roughly $0.05-0.15. The model can be changed in the settings gear icon.

---

## File Structure

```
The_Exchange/
  index.html              The application (landing page + chat interface)
  exchange_grimoire.json   Persona specifications (reference)
  css/
    companion.css          All styles
  js/
    api.js                 Anthropic API streaming client
    hologram.js            Animated persona visualizations
    main.js                Session orchestrator (phases, threshold detection)
    matter.js              Job corpus + persona profiles
    protocol.js            System prompt assembly
    ui.js                  DOM management, rendering, scroll behavior
```

---

## The Job Corpus

The pilot corpus contains representative US job listings spanning every major industry — technology, healthcare, education, trades, finance, government, creative, logistics, hospitality, and nonprofit. Salaries range from $34,000 to $220,000. Locations span 25+ US cities. All data is in `js/matter.js`.

---

## For Developers

### How the Threshold Works

When the AI committee converges on a match, the LLM outputs a hidden HTML comment:

```
<!-- THRESHOLD: {"title": "...", "company": "...", "city": "...", "state": "...", "zip": "...", "salary": "...", "url": "..."} -->
```

`main.js` detects this marker in the API response, parses the JSON, and adds a threshold card directly to the chat with a link to Best Jobs Online. The marker is stripped from the displayed chat. One click takes the user to the application page.

### Customizing the Corpus

Edit the `JOB_CORPUS` array in `js/matter.js`. Each job object needs: `id`, `title`, `company`, `city`, `state`, `zip`, `salary`, `description`, `category`.

### Changing Personas

Edit `EXCHANGE_AUGMENTATION` in `js/protocol.js` and `PERSONA_PROFILES` in `js/matter.js`.

---

## Part of THE COMPANION DOSSIER

THE EXCHANGE is one instance of the **Personas + Data = Container** pattern from the [COMPANION Protocol](https://github.com/jethomasphd/THE_COMPANION_DOSSIER):

1. **The Committee of Patriots** — founding-era minds + investment principles
2. **The Five Lamps** — physician-minds + clinical ethics
3. **The Exchange** — labor market personas + job corpus

The architecture is general. Different data, different personas, same structure.

---

*The Flood would have you scroll forever. The Exchange asks you to speak once.*

*Jacob E. Thomas, PhD — February 2026*
