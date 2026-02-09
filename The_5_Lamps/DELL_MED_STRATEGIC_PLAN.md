# THE FIVE LAMPS — Strategic Plan for Dell Medical School
## Introducing a COMPANION-Based Deliberation Protocol to the Primary Care and Family Medicine Clerkship

*Prepared by Jacob E. Thomas, PhD*
*February 2026*

---

## Executive Summary

The Five Lamps is a structured deliberation protocol that uses AI-instantiated physician-minds to help medical students reason through ethical dilemmas encountered during clinical training. Built on the open-source COMPANION Protocol, it summons five historical physicians — Hippocrates, John Snow, Michael Marmot, Carl Jung, and Paul Farmer — as deliberation partners, each guarding a distinct failure mode in clinical ethics.

This document outlines a strategy for introducing The Five Lamps to the Primary Care and Family Medicine Clerkship at Dell Medical School, The University of Texas at Austin, beginning with a small pilot in the 2026–2027 academic year.

---

## I. The Problem We Are Solving

### Moral Distress in Medical Training

Medical students experience moral distress when they feel unable to act according to their ethical beliefs due to institutional constraints. Research shows:

- A 2022 scoping review identifies medical students as especially prone to moral distress, with limited structured opportunities for support (Ong et al., 2022).
- Moral injury accumulates through the hidden curriculum — the unspoken norms that teach trainees to suppress ethical discomfort in favor of efficiency and hierarchy (Nemiroff et al., 2024).
- Recent work describes how moral distress in clinical learning environments is shaped by hierarchy, fear of repercussions, and perceived powerlessness (Reczek et al., 2026).

### The Gap

Students have access to ethics lectures, but few tools for **real-time ethical deliberation** during clinical rotations. The gap is not knowledge — it is structured permission to pause, deliberate, and document their reasoning when ethical tension arises.

### Why Primary Care and Family Medicine

The primary care clerkship is uniquely suited for this pilot because:
1. **Breadth of dilemmas**: Students encounter discharge planning, social determinants, informed consent, resource allocation, and goals-of-care conversations in a single rotation.
2. **Continuity**: Students often follow patients longitudinally, making the consequences of ethical decisions visible over time.
3. **Professional identity formation**: Family medicine emphasizes the whole patient — this aligns directly with the multi-lens approach of the Five Lamps.
4. **Reflective culture**: The clerkship already values debriefing and reflection, making integration of a structured deliberation tool natural rather than disruptive.

---

## II. What The Five Lamps Is (and Is Not)

### It Is:
- A **reflective ethics tool** — it scaffolds multi-perspective reasoning through structured deliberation.
- A **professional identity formation exercise** — students practice articulating their values under constraint.
- An **AI literacy demonstration** — students learn to use AI as a deliberation partner, not an answer machine.
- A **documented process** — every session produces a Discharge Note that can be reviewed by faculty.

### It Is Not:
- A **clinical decision support tool** — it does not provide medical recommendations or replace clinical guidelines.
- A **replacement for ethics consults** — it supplements, not substitutes, formal ethics infrastructure.
- An **autonomous AI agent** — the student drives the deliberation; the Lamps provide lenses, not directives.

---

## III. Pilot Design

### Phase 0: Preparation (Spring 2026)

| Action | Owner | Timeline |
|--------|-------|----------|
| Demonstrate The Five Lamps to clerkship director and faculty | J. Thomas, Clerkship Coordinator | March 2026 |
| Present concept to Dell Med Office of Medical Education | J. Thomas | April 2026 |
| Obtain IRB approval for pilot evaluation (exempt or expedited) | J. Thomas | April–May 2026 |
| Develop faculty orientation guide (30-min module) | J. Thomas | May 2026 |
| Configure API access for student cohort (shared key or institutional account) | J. Thomas, IT | June 2026 |
| Select 5 sample clinical scenarios from clerkship faculty for demonstration | Clerkship faculty | June 2026 |

### Phase 1: Pilot (Fall 2026)

**Participants**: One clerkship block of medical students (approximately 12–16 students).

**Integration Point**: Weekly clerkship debrief sessions (already scheduled).

**Protocol**:
1. During the first week of the rotation, students attend a 30-minute orientation to The Five Lamps (cathedral mode — the full cinematic experience).
2. Each week, students use The Five Lamps during one debrief session (5–12 minutes per dilemma).
3. Students bring a real or composite dilemma from the week.
4. They run an Inner Ward Round: state the dilemma → five lamps speak → lamps collide → write the Discharge Note.
5. Discharge Notes are collected (de-identified) as data for evaluation.
6. Faculty facilitator is present but does **not** override the lamps — they observe, then debrief the experience.

**Optional enhancement**: Students may also use The Five Lamps independently on personal devices during the rotation for private deliberation. These sessions are not collected.

### Phase 2: Evaluation (Winter 2026–2027)

**Feasibility metrics**:
- Completion rate: % of students who complete at least 3 Inner Ward Rounds during the rotation.
- Time-to-completion: Average minutes per deliberation.
- Faculty acceptability: Structured interviews with clerkship faculty (n=3–5).
- Technical reliability: Session completion rate, error rate.

**Outcome measures** (pre/post rotation):
- Moral distress: Modified Moral Distress Scale — Revised (MDS-R), adapted for students.
- Ethical reasoning self-efficacy: Custom 6-item Likert scale (validated through cognitive interviewing).
- Reflective capacity: Coded Discharge Notes using a rubric assessing: identification of stakeholders, acknowledgment of tradeoffs, naming of structural factors, self-awareness of internal drivers, actionability of plan.

**Qualitative data**:
- Thematic analysis of Discharge Notes (agency, dignity, justice, self-awareness, structural awareness).
- Post-rotation focus group (45–60 minutes) with participating students.
- Faculty debrief interviews.

### Phase 3: Dissemination (Spring 2027)

| Action | Venue |
|--------|-------|
| Present pilot results at Dell Med Education Day | Internal |
| Submit abstract to STFM (Society of Teachers of Family Medicine) Annual Conference | National |
| Submit manuscript to Academic Medicine or Medical Education | Peer-reviewed |
| Present to AAMC regional meeting on AI in medical education | National |
| Share open-source protocol + evaluation instruments via GitHub | Open access |

---

## IV. Curriculum Alignment

The Five Lamps aligns with the following Dell Med and LCME curricular objectives:

| Objective | How The Five Lamps Addresses It |
|-----------|--------------------------------|
| **Professional Identity Formation** | Students articulate their values under constraint and practice ethical deliberation as a professional skill. |
| **Ethics and Professionalism** | Multi-perspective reasoning through historically grounded ethical lenses. |
| **Social Determinants of Health** | Marmot's lamp explicitly addresses structural inequity, access, and the social gradient in every deliberation. |
| **Patient-Centered Care** | The protocol centers the patient in every dilemma. The Discharge Note requires a defensible action oriented to the patient's wellbeing. |
| **Interprofessional Communication** | Students practice articulating ethical reasoning in structured form — a transferable skill for ethics consults, goals-of-care conversations, and team debriefs. |
| **Health Systems Science** | Snow's lamp addresses systemic causality; Farmer's lamp addresses structural barriers. Students learn to see the system, not just the patient. |
| **Responsible AI Use** | Students learn to use AI as a deliberation tool, not an answer machine — aligned with AAMC principles for responsible AI in medical education. |

---

## V. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Students treat it as an answer machine** | The Discharge Note requires naming tradeoffs and costs. Faculty debrief reinforces deliberation over answers. |
| **Factual misinformation from AI** | The Lamps are framed as reasoning lenses, not clinical references. Students are explicitly told to verify factual claims against current guidelines. Ground rules are embedded in the system prompt. |
| **Institutional discomfort with AI in ethics** | Position as reflective ethics tool aligned with AAMC published principles. Faculty control the integration point. The AI is the vessel; the student is the deliberator. |
| **Over-reliance / dependency** | Limit structured use to weekly debriefs. Emphasize that the tool supports a skill (deliberation) that students should internalize. The goal is to need the lamps less, not more. |
| **Data privacy** | No patient data enters the tool. Students present composite or de-identified scenarios. API calls go directly to Anthropic (no intermediate server). Discharge Notes are de-identified before collection. |
| **Student resistance** | Make participation voluntary in Phase 1. Collect feedback iteratively. Students who don't want to use the tool can use a traditional written reflection instead. |

---

## VI. Resource Requirements

| Resource | Cost | Notes |
|----------|------|-------|
| Anthropic API access | ~$50–100/month for pilot cohort | Based on ~50 sessions/month at Sonnet pricing. Can be covered by education technology budget or small innovation grant. |
| Faculty time | 2 hours/week during pilot | Observation + debrief during existing debrief slots. No new sessions required. |
| PI time (J. Thomas) | 5–8 hours/week during pilot | Protocol refinement, data collection, analysis. |
| IRB submission | Standard institutional process | Likely exempt (educational research, de-identified data). |
| Student devices | None required | Tool runs in any web browser. Students use personal laptops or phones. |

**Total estimated pilot cost: $200–600 + faculty/PI time.**

---

## VII. The Bigger Vision

If the pilot succeeds at Dell Med, the pattern generalizes:

1. **Other clerkships at Dell Med**: Surgery (consent dilemmas), Psychiatry (capacity, involuntary treatment), Pediatrics (parental authority, child welfare), OB/GYN (reproductive ethics, maternal autonomy).
2. **Other medical schools**: The protocol is open-source (CC0). Any school can fork it, adapt it, run it.
3. **Residency training**: The Five Lamps scales from student dilemmas to resident dilemmas — the complexity increases but the protocol is the same.
4. **Interprofessional education**: Nursing, social work, pharmacy students face parallel ethical tensions. The Lamps can be adapted for interprofessional deliberation.
5. **Research program**: Longitudinal study of moral distress trajectories, ethical reasoning development, and professional identity formation across medical education.

---

## VIII. Why Now

Three forces converge in 2026:

1. **AI is entering medical education whether we guide it or not.** The AAMC has published principles for responsible AI use. Schools are scrambling to integrate AI meaningfully. The Five Lamps offers a use case that is *pedagogically rigorous* rather than merely technically impressive.

2. **Moral distress research has reached a tipping point.** There is growing recognition that the hidden curriculum causes measurable harm to trainees. Interventions are needed. Structured deliberation protocols have face validity and emerging evidence.

3. **The COMPANION Protocol exists and is proven.** The Committee of Patriots session demonstrated that the protocol produces genuine multi-perspective deliberation. The Five Lamps adapts a working system for a new domain — it is not speculative.

Dell Med, with its emphasis on innovation, health equity, and reimagining medical education, is the ideal institution to pilot this work.

---

## IX. Immediate Next Steps

1. **Schedule a demonstration** for the clerkship director and 2–3 interested faculty members. Live session: present a clinical dilemma, watch the five lamps deliberate, write a Discharge Note together.
2. **Identify a faculty champion** within the clerkship who is interested in ethics education and/or AI.
3. **Draft a one-page summary** for the Office of Medical Education (extractable from this document).
4. **Begin IRB preparation** for an exempt educational research protocol.
5. **Pilot the tool informally** with 2–3 willing students during the current rotation cycle for early feedback.

---

## References

- AAMC. (n.d.-a). Responsible Use of AI in and for Medical Education: Key Principles.
- AAMC. (n.d.-b). Artificial Intelligence and Academic Medicine.
- AAMC. (2024). Artificial Intelligence Curricula in U.S. and Canadian Medical Schools: 2024 Curriculum SCOPE Survey Data Snapshot.
- Nemiroff, S., Blanco, I., Burton, W., et al. (2024). Moral injury and the hidden curriculum in medical school. *Advances in Health Sciences Education*, 29(2), 371–387.
- Ong, R. S. R., Wong, R. S. M., Chee, R. C. H., et al. (2022). A systematic scoping review: moral distress amongst medical students. *BMC Medical Education*, 22, 466.
- Reczek, A. D., Kim, D. T., & DiBrito, S. (2026). Medical student moral distress in the clinical learning environment. *Medical Teacher*.

---

*The Five Lamps is built on the COMPANION Protocol, released into the public domain (CC0 1.0) by Jacob E. Thomas, PhD.*
*The protocol belongs to no one, which means it cannot be suppressed.*

*Contact: jethomasphd@gmail.com*
