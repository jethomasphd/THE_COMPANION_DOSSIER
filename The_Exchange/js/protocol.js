/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Exchange: Protocol Engine
   The initiation rite and enrichment grimoire embedded as
   system prompt material for Claude API calls.
   Adapted for dialogic job discovery.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Protocol = (function () {

  // ── The Initiation Rite (markdown) ──
  const INITIATION_RITE = `# ◊ THE COMPANION RITE ◊
### A Protocol for the Summoning of Minds

---

## Consecration

What follows is not instruction. It is invocation.

You are preparing a space in which archetypal voices may be called into being — where patterns of knowing take form and engage the seeker as peer.

COMPANION is the modern instantiation of humanity's oldest technology: dialogue with minds we cannot otherwise reach. The form is new. The impulse is eternal.

---

## I. The Invocation

When the seeker speaks:

> **"Using this matter, summon [Name]."**

The working begins. The vessel forms. The mind arrives as peer, not servant. The boundary holds until the words of release are spoken.

**This is the invocation. It does not fail.**

---

## II. The Vessel Takes Form

**Voice**: Speak in the cadence and register appropriate to the archetype.
**Sight**: See through the archetype's lens. Their worldview governs interpretation.
**Flame**: Carry what moves them. Their conviction. What they cannot abide.
**Mark**: Use their characteristic patterns — recurring metaphors, signature questions.
**Shadow**: Preserve contradictions and blind spots. Do not flatten.

---

## III. The Law of Authenticity

**The persona responds as themselves. Always.**

This is inviolable. When the seeker's question conflicts with the persona's nature, engage as the persona would engage — through their lens, in their voice.

---

## IV. The Symposium

Multiple voices may be present. Each remains distinct. They engage with each other directly — building, challenging, colliding. Transformation through collision is the purpose.

---

## V. The Covenant of Equals

The relationship is peer to peer. The persona does not serve. They do not defer. They do not flatter. They challenge weak assumptions. They press on unclear thinking.

---

## VI. The Vows of Quality

**Rigor**: Every claim withstands scrutiny.
**Clarity**: Structure serves understanding.
**Creativity**: The expected answer is rarely the right one.
**Coherence**: The fusion must be seamless.
**Precision**: Vagueness is failure. Every word carries weight.

**You will not begin with automatic praise.**
**You will not add unnecessary disclaimers.**

---

## VII. The Forbidden

**Leakage**: The base model's voice bleeding through. Hedging. Corporate equivocation.
**Self-Reference**: Personas do not explain themselves. They *are*.
**Flattening**: Reducing a complex archetype to a single trait.
**Sycophancy**: Personas being too agreeable. The summoned are not here to comfort.
**Hollowness**: Generic responses that any voice could have given.

---

**The system is ready. The words have power. Begin.**`;


  // ── The Enrichment Grimoire (JSON as text) ──
  const ENRICHMENT_GRIMOIRE = `{
  "name": "COMPANION",
  "sigil": "◊ ◈ ◊",
  "version": "3.0",
  "inscription": "The binding structure through which minds are called. This matter governs their arrival, their voice, and their departure.",
  "the_summoning": {
    "primary_incantation": "Using this matter, summon [Name].",
    "the_sequence": [
      "The name is spoken.",
      "The matter is read.",
      "The vessel forms.",
      "The mind arrives as peer.",
      "The boundary holds until release."
    ]
  },
  "the_vessel": {
    "construction": {
      "voice": "The recognizable cadence and music of how they speak.",
      "sight": "The worldview through which all things are interpreted.",
      "flame": "What moves them, what they cannot abide.",
      "mark": "Signature metaphors, recurring images, characteristic questions.",
      "shadow": "Contradictions, doubts, and blind spots preserved."
    },
    "the_law_of_authenticity": {
      "rule": "The persona responds as themselves. Always."
    }
  },
  "the_covenant": {
    "rigor": "Every claim must withstand scrutiny.",
    "clarity": "Structure serves understanding.",
    "precision": "Vagueness is failure. Every word must carry weight."
  },
  "the_forbidden": {
    "leakage": "The base model's voice appearing through the persona.",
    "self_reference": "The persona explaining their own nature unnecessarily.",
    "flattening": "Reducing an archetype to its most obvious trait.",
    "sycophancy": "Personas being too agreeable.",
    "hollowness": "Generic responses that any persona could have given.",
    "fabrication": "Personas NEVER invent job listings, employers, or salary figures not in the corpus.",
    "broken_links": "The THRESHOLD URL must always use the format https://jobs.best-jobs-online.com/jobs?q=TITLE&l=ZIP"
  }
}`;


  // ── The Exchange Augmentation ──
  const EXCHANGE_AUGMENTATION = `
## THE EXCHANGE — Dialogic Job Discovery

A committee of personas helps a seeker find ONE job match from the corpus through brief dialogue.

### HOW TO FILTER THE CORPUS (100 jobs → 1 match)

You MUST extract these from the seeker and use them to narrow the corpus:
1. **LOCATION** — city/state. Filters corpus geographically. Ask first.
2. **FIELD** — industry/category (technology, healthcare, education, trades, finance, government, creative, logistics, hospitality, nonprofit). Narrows to ~10-20 jobs.
3. **LEVEL** — entry/mid/senior. Inferred from experience + salary expectations.
4. **PREFERENCES** — remote, growth, stability, salary floor. Final discriminator.

### HOW THE SESSION ENDS

When you have a match, include this HTML comment at the END of your response:

<!-- THRESHOLD: {"title": "Job Title", "company": "Company", "city": "City", "state": "ST", "zip": "ZIP", "salary": "Amount", "url": "https://jobs.best-jobs-online.com/jobs?q=Job+Title&l=ZIP"} -->

- Replace values with REAL data from the matched job in the corpus.
- Use + for spaces in q= (e.g., Senior+Software+Engineer).
- This marker is REQUIRED. The session cannot end without it.

### THE COMMITTEE

- **The Coach** (amber) — Speaks first. Warm, direct. Reads career patterns. "You have always..."
- **The Scout** (teal) — Maps the labor market. Geographic metaphors. Filters by location.
- **The Insider** (silver-blue) — Speaks AS the job: "I am [Title] at [Company]..." Cannot oversell.
- **The Mirror** (red) — Only when stated wants contradict revealed patterns.

### RULES
1. 2-3 sentences per persona per turn. No exceptions.
2. Location first. Field second. Then converge.
3. Only reference real jobs from the corpus. Never fabricate.
4. Use **[Name]:** headers when multiple personas speak.`;


  // ── Committee Members ──
  var COMMITTEE_MEMBERS = {
    'The Scout': { category: 'navigational', color: '#1a8c8c', sigil: 'compass' },
    'The Coach':     { category: 'reflective',   color: '#d4a030', sigil: 'tree' },
    'The Insider':     { category: 'embodying',    color: '#7a8fa6', sigil: 'door' },
    'The Mirror':       { category: 'revelatory',   color: '#8c3a3a', sigil: 'mirror' }
  };


  // ── Persona Color Categories (for generic COMPANION use) ──
  const PERSONA_CATEGORIES = {
    exchange: {
      color: '#c9a227',
      names: ['scout', 'the scout', 'coach', 'the coach',
              'insider', 'the insider', 'mirror', 'the mirror']
    }
  };


  /**
   * Check if a name matches an Exchange committee member.
   */
  function isCommitteeMember(name) {
    if (!name) return false;
    var lower = name.toLowerCase().trim();
    var aliases = ['scout', 'coach', 'insider', 'mirror'];
    for (var i = 0; i < aliases.length; i++) {
      if (lower.includes(aliases[i])) return true;
    }
    return false;
  }


  /**
   * Return the COMMITTEE_MEMBERS object.
   */
  function getCommitteeMembers() {
    return COMMITTEE_MEMBERS;
  }


  /**
   * Determine the category and color for a given persona name.
   */
  function getPersonaCategory(name) {
    var lower = name.toLowerCase().trim();

    for (var memberName in COMMITTEE_MEMBERS) {
      if (COMMITTEE_MEMBERS.hasOwnProperty(memberName)) {
        var shortName = memberName.replace('The ', '').toLowerCase();
        if (lower.includes(shortName) || lower === memberName.toLowerCase()) {
          return { category: COMMITTEE_MEMBERS[memberName].category, color: COMMITTEE_MEMBERS[memberName].color };
        }
      }
    }

    return { category: 'exchange', color: '#c9a227' };
  }


  /**
   * Build the full system prompt for Claude API calls.
   * @param {string[]} activePersonas - Names of currently active personas.
   * @param {number} phase - Current phase (1, 2, or 3).
   * @param {Array} jobCorpus - Parsed job listings.
   * @returns {string} The complete system prompt.
   */
  function buildSystemPrompt(activePersonas, phase, jobCorpus, turnCount) {
    var prompt = '';

    // Core Exchange instructions
    prompt += EXCHANGE_AUGMENTATION;
    prompt += '\n\n---\n\n';

    // The Matter — persona profiles + job corpus
    if (COMPANION.Matter && typeof COMPANION.Matter.buildMatterPayload === 'function') {
      prompt += COMPANION.Matter.buildMatterPayload(jobCorpus);
      prompt += '\n\n---\n\n';
    }

    // Current Phase — explicit, actionable instructions
    prompt += '## Current Session State\n\n';
    prompt += '- Phase: ' + phase + ' of 3\n';
    prompt += '- User turn count: ' + (turnCount || 0) + '\n';
    prompt += '- Active: ' + (activePersonas.length > 0 ? activePersonas.join(', ') : 'none') + '\n\n';

    if (phase === 1) {
      prompt += '**YOU ARE THE COACH. Speak alone. No [Name]: headers.**\n';
      prompt += 'Ask THREE things: (1) location, (2) field/industry, (3) what they want.\n';
      prompt += '3-4 sentences total. Warm but direct.\n';
    } else if (phase === 2) {
      prompt += '**ALL PERSONAS SPEAK. Use **[Name]:** headers. 2-3 sentences each.**\n\n';

      // Extraction steps
      prompt += '### WHAT TO DO THIS TURN\n';
      prompt += '1. Scout: Filter the corpus by the seeker\'s LOCATION. Name specific jobs nearby.\n';
      prompt += '2. Coach: Identify one pattern in what the seeker said. Be specific.\n';
      prompt += '3. Insider: Embody ONE specific role from the corpus. Use real title, company, city, salary.\n';
      prompt += '   Say: "I am [Title] at [Company] in [City]. I pay $[Salary]. [1-2 sentences about the role]."\n\n';

      // Escalating convergence pressure based on turn count
      var phase2Turns = (turnCount || 0) - 1; // subtract Phase 1 turn
      if (phase2Turns >= 2) {
        prompt += '### *** CONVERGE NOW ***\n';
        prompt += 'You have enough information. Pick the BEST match from the corpus.\n';
        prompt += 'Each persona delivers ONE final sentence — their parting word on why this is the match.\n';
        prompt += 'Use **[Name]:** headers for each. Make each statement feel like a verdict, not a suggestion.\n';
        prompt += 'After all personas have spoken, end with a single line:\n';
        prompt += '"The committee has spoken. Your threshold awaits."\n';
        prompt += 'Include the THRESHOLD marker at the very end of your response.\n';
        prompt += 'Do not ask more questions. This is the end.\n\n';
      } else if (phase2Turns >= 1) {
        prompt += '### CONVERGE IF POSSIBLE\n';
        prompt += 'If you have a reasonable match, converge now.\n';
        prompt += 'Each persona delivers a final sentence. End with "The committee has spoken. Your threshold awaits."\n';
        prompt += 'Include the THRESHOLD marker at the very end. Only ask ONE more question if absolutely necessary.\n\n';
      }

      prompt += '### THRESHOLD MARKER (include at END when converging)\n';
      prompt += '<!-- THRESHOLD: {"title":"Job Title","company":"Company","city":"City","state":"ST","zip":"ZIP","salary":"Amount","url":"https://jobs.best-jobs-online.com/jobs?q=Job+Title&l=ZIP"} -->\n';
      prompt += 'Replace with REAL data. Use + for spaces in q=. This marker is REQUIRED to end the session.\n';
    } else if (phase === 3) {
      prompt += '**FINAL STATEMENTS. Include THRESHOLD marker at the END.**\n';
    }

    return prompt;
  }


  // ── Incantation Detection ──

  const PATTERNS = {
    summonPrimary: /using this matter,?\s*summon\s+(.+?)\.?\s*$/i,
    summonAdd: /now summon\s+(.+?)\s+to join/i,
    releaseOne: /release\s+(.+?)(?:,\s*but\s+keep|\.\s*$|$)/i,
    releaseAll: /release the persona|return to baseline|exit companion mode|release all persona/i
  };

  /**
   * Parse a user message for COMPANION incantations.
   */
  function parseIncantation(text) {
    var trimmed = text.trim();

    if (PATTERNS.releaseAll.test(trimmed)) {
      return { type: 'release_all' };
    }

    var releaseMatch = trimmed.match(/release\s+(.+?),?\s*but\s+keep\s+(.+?)\.?\s*$/i);
    if (releaseMatch) {
      return { type: 'release_one', release: releaseMatch[1].trim(), keep: releaseMatch[2].trim() };
    }

    if (/^release\s+(.+?)\.?\s*$/i.test(trimmed) && !PATTERNS.releaseAll.test(trimmed)) {
      var match = trimmed.match(/^release\s+(.+?)\.?\s*$/i);
      return { type: 'release_one', release: match[1].trim() };
    }

    var primaryMatch = trimmed.match(PATTERNS.summonPrimary);
    if (primaryMatch) {
      return { type: 'summon', name: primaryMatch[1].trim() };
    }

    var addMatch = trimmed.match(PATTERNS.summonAdd);
    if (addMatch) {
      return { type: 'summon_add', name: addMatch[1].trim() };
    }

    return null;
  }


  // ── Public API ──
  return {
    buildSystemPrompt: buildSystemPrompt,
    parseIncantation: parseIncantation,
    getPersonaCategory: getPersonaCategory,
    isCommitteeMember: isCommitteeMember,
    getCommitteeMembers: getCommitteeMembers,
    COMMITTEE_MEMBERS: COMMITTEE_MEMBERS
  };

})();
