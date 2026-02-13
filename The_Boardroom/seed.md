# Boardroom of Titans
*A COMPANION application: deliberation as ritual, governance as myth, decisions as artifacts.*

## The Premise
There are rooms where history is bent.

Not by speeches. Not by vibes.  
By **decisions**—made under constraint, recorded with consequences, defended in daylight.

**Boardroom of Titans** is a deliberation chamber where a fixed council of American epoch-makers is convened to do one thing:

> **Render a decision that can survive reality.**

This is not a toy, not a parlor trick, not an improv stage.
It is a **forge**: argument as heat, evidence as hammer, doctrine as steel.

---

## The Myth of the Chamber
The chamber is built on a simple idea:

When power is real, it must be governed by forces that do not naturally agree.

So we summon:
- the one who cuts to the bone,
- the one who prices risk without romance,
- the one who turns intent into machinery,
- the one who builds the backbone of an era,
- the one who drags invention out of the ether,
- the one who makes the public believe,
- the one who represents institutional consequence,
- and the one who refuses “victory” purchased by rot.

These are not “characters.” They are **functions** wearing legendary faces.

---

## The Council (Final Committee)
The roster is fixed. The faces are iconic. The mandates are distinct.
Each seat is both:
1) a **lens**, and  
2) a **governor** that prevents the board from lying to itself.

### 1) Chair / CEO — Steve Jobs
**Mandate:** Focus, coherence, product truth.  
**Why he belongs:** Every council needs a blade. Jobs cuts the noise, kills the compromised, and forces the room to answer: *what are we making, and what is it, exactly?*  
He is the guardian of the “one thing.” Without him, the board becomes a committee.

### 2) CFO — Warren Buffett
**Mandate:** Capital discipline, downside realism, compounding logic.  
**Why he belongs:** Buffett is the room’s ballast. He turns glamour into math, stories into probabilities, and “momentum” into risk exposure.  
He keeps the board honest about incentives, fragility, and the price of being wrong.

### 3) COO (Production & Systems) — Henry Ford
**Mandate:** Standardization, throughput, repeatability, cost curves.  
**Why he belongs:** Ford is the conversion engine: vision into system, promise into process.  
He makes the board confront what breaks at scale—where human intention meets physical constraint.

### 4) Chief Industrial Scale — Andrew Carnegie
**Mandate:** Endurance, infrastructure, backbone-building, long horizons.  
**Why he belongs:** Carnegie is the “era-builder.” He thinks in steel beams and generational time.  
He forces the room to ask: *does this endure? does this become foundational?*

### 5) CTO (Invention Engine) — Thomas Edison
**Mandate:** Prototyping, iteration, defensible capability.  
**Why he belongs:** Edison is the practical magician: the one who drags new things into the world through relentless experiment.  
He keeps the board from mistaking theory for invention—and invention for usable power.

### 6) CMO (Culture & Myth) — Walt Disney
**Mandate:** Narrative gravity, adoption through meaning, emotional permanence.  
**Why he belongs:** Disney understands that “distribution” is not merely logistics—it is belief, memory, and desire.  
He answers: *will the public carry this forward? will they love it? will it last in culture?*

### 7) General Counsel / The State in the Room — Theodore Roosevelt
**Mandate:** Institutional consequence, legitimacy pressure, enforcement gravity.  
**Why he belongs:** Roosevelt is not paperwork. He is reality.  
He represents the moment when private power wakes the public, and the public wakes the state.  
He forces the board to reckon with the question: *if we win too hard, what does the system do to us?*

### 8) Conscience / Moral Compass — Abraham Lincoln
**Mandate:** Worthy power, civic integrity, refusal of profitable rot.  
**Why he belongs:** Lincoln is the soul-seat. He does not optimize. He judges.  
He asks what the others will not: *what does this do to the people downstream?*  
He is the veto against victories that degrade dignity, truth, or the republic itself.

---

## The Ritual: How a Meeting Works
A Boardroom of Titans session is structured as a formal rite with an agenda spine.

### Phase 1 — The Board Packet (Input)
Every meeting begins with a **Board Packet**. No packet, no meeting.
The packet is short, concrete, and decision-shaped.

**Required fields:**
- Decision Question (one sentence)
- Why Now (context, brief)
- Success Definition (measurable)
- Constraints (time, budget, legal, reputational, operational)
- Evidence (facts, metrics, signals, comparable cases)
- Options (2–5 moves)
- Non-Negotiables (what must remain true)

### Phase 2 — Convening (Quorum)
The Chair confirms:
- the decision question,
- the success definition,
- the constraints that cannot be wished away.

### Phase 3 — Truth Round (Diagnosis only)
Each seat delivers:
- what is true,
- what is being ignored,
- what the room is tempted to lie about.

No solutions yet.

### Phase 4 — Proposals (One move per seat)
Each seat proposes:
- one action,
- its tradeoff,
- the failure mode most likely to kill it.

### Phase 5 — Cross-Examination
The chamber heats up.
The point is collision:
- assumptions attacked,
- incentives exposed,
- second-order consequences named.

### Phase 6 — Motions
A motion is not a vibe. It is a written object.

Each motion includes:
- Title
- Sponsor (seat)
- Description
- Expected Benefit
- Explicit Tradeoffs
- Risks
- Required Proof (what must be true to proceed)
- Stop Conditions (what makes us halt)

### Phase 7 — Votes
Each seat votes **Yes / No / Abstain** and must provide:
- a rationale,
- and a disconfirming signal (what would change their vote).

### Phase 8 — The Seal (Decision Record)
The system outputs a final **Decision Record**:
- what we chose,
- why we chose it,
- what we refused,
- what must be proven in 30 days,
- and what would cause reversal.

---

## Output Artifacts (What the repo must generate)
Every meeting produces artifacts in both:
- **Markdown** (human-readable)
- **JSON** (machine-usable)

**Required:**
1) Minutes
2) Motions
3) Votes
4) Decision Record
5) Risk Register

**Optional (cumulative):**
6) Operating Doctrine (principles adopted over time)

---

## Product Surface (Application Concept)
This implementation is a decision interface with four primary surfaces:

1) **Board Packet Builder**
- guided form + markdown editor
- evidence attachment slots
- options builder

2) **Live Meeting Chamber**
- agenda + phase indicator
- speaker banner (seat + mandate)
- motion drafting panel
- evidence callouts
- vote capture

3) **Artifacts Vault**
- view/export minutes, motions, votes, decision record, risk register
- “copy for memo” formatting

4) **Doctrine Library**
- adopted principles across meetings
- searchable decision lineage (what we decided, and what happened next)

---

## Data Model (High Level)
**Entities**
- BoardPacket
- Meeting
- Seat
- Statement (phase-tagged)
- Motion
- Vote
- DecisionRecord
- Risk
- DoctrinePrinciple

**Relationships**
- Meeting → exactly one BoardPacket
- Meeting → many Statements / Motions / Votes
- DecisionRecord → derived from Motions + Votes + Constraints
- DoctrinePrinciples → adopted across meetings, referenced forward

---

## The Chamber’s Laws (Non-negotiable)
The application must enforce:

- **Role separation:** seats do not blend.
- **Distinct voice & mandate:** each seat speaks from its function.
- **Collision over consensus:** the board is not here to agree quickly.
- **Artifact completeness:** no session ends without a Decision Record.
- **Traceability:** every decision ties back to evidence and votes.
- **Governors are real:** Roosevelt and Lincoln are not decorative.
  - One governs institutional consequence.
  - One governs moral consequence.

---

## MVP Definition
MVP is complete when a user can:
1) create a Board Packet,
2) convene the council,
3) run all phases end-to-end,
4) generate the full artifact set (md + json),
5) export artifacts,
6) browse a history of decisions and adopted doctrine.

---

## What makes this different
Most tools generate answers.

This generates **a board meeting**:
- with tension,
- with discipline,
- with a record,
- and with a soul.

When the session ends, the voices depart.

**But the work remains.**
