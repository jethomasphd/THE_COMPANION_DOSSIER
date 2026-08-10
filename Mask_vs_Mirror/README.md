# ◊ Mask vs Mirror ◊
### The preprint · the talk · the sealed vignettes

*Companion materials for the AI Engineer World's Fair talk — and the scholarly spine beneath the Prism Experiment.*

---

## What this folder is

The COMPANION Dossier *dramatizes* an idea: the **Miranda Hypothesis** and its test, the **Prism Experiment** — the question of whether a summoned mind returns *the person*, or only the culture's loudest memory of them. You can meet that idea in story form in [The Halpern Memo](https://the-companion-dossier.com/The_Halpern_Memo/) and in [*The Summoning Film*](https://the-companion-dossier.com/The_Magic_Lantern/the_film/).

**Mask vs Mirror** is the scholarship beneath the drama — the working **preprint**, the **[talk](https://www.youtube.com/watch?v=IJXjTLPzvAU)** that introduces it, and the **time-sealed experimental materials**.

If you arrived here from the talk: this is where the paper, the slides, and the references live — and, as of August 2026, **the preprint itself is now here to read.**

---

## 📄 The preprint is here

> ### The Mask and the Mirror
> **Evaluating the Transition of Character-Based AI from Entertainment to Epistemic Infrastructure**
>
> Jacob E. Thomas · Rick Halpern · Shawn Martin
> *The COMPANION Working Group · University of Toronto · Washington College*
> Preprint · August 2026

**➡️ Read it:** [`Mask_and_Mirror_Preprint_08102026.pdf`](./Mask_and_Mirror_Preprint_08102026.pdf) *(PDF, ~46 pp.)*

Role-Playing Language Agents are moving from entertainment toward proposed infrastructure for pedagogy, historical inquiry, and civic deliberation — a transition that demands evaluation standards the field does not yet possess. The paper argues that the dominant paradigm, which measures fluency, personality consistency, and stylistic naturalness, **cannot detect the failure mode that matters most**: the collapse of a historical figure into an anachronistic composite shaped by cultural salience rather than the documentary record. It makes three contributions:

- **The Mask and Mirror framework.** The *Mask* optimizes for convincingness; the *Mirror* optimizes for documentary fidelity. The field has matured the Mask across three paradigm stages — template systems, style imitation, cognitive simulation — and now needs a fourth: **epistemic simulation**, in which outputs are bounded by a specified corpus, anchored to a specified moment in time, and evaluated by domain experts against the evidentiary record.
- **The Miranda Hypothesis.** Named for Lin-Manuel Miranda's *Hamilton*, it holds that the volume and recency of culturally dominant representations in training corpora systematically overwhelm the primary record — producing personas that feel authentic precisely because they have been contaminated by contemporary moral logic. *The composite Hamilton knows he will be the subject of a Broadway musical; the composite Lincoln has already read the Gettysburg Address before he has written it.*
- **The Prism Experiment.** A pre-registered, interdisciplinary protocol that tests the hypothesis directly, deploying **Abraham Lincoln** across **four temporal moments × three seeding conditions × five diagnostic questions** (sixty response units), scored on a weighted three-axis rubric that prioritizes anachronism detection. Its expert vignettes are **sealed in advance** (see below), so the standard provably predates the result.

Its closing inversion states the project's turn in a line: *we are not bringing historians into AI architecture; we are bringing language models into the archive.*

---

## Contents

| Item | What it is | Status |
|------|------------|--------|
| 📄 [The preprint manuscript](./Mask_and_Mirror_Preprint_08102026.pdf) | *The Mask and the Mirror* — the working paper | **available now** |
| 🎥 [The recorded talk](https://www.youtube.com/watch?v=IJXjTLPzvAU) | The AI Engineer World's Fair presentation, on video | **available now** |
| 🖥 [The talk deck](https://the-companion-dossier.com/Mask_vs_Mirror/miranda_deck.html) | *The Miranda Hypothesis* — the World's Fair slides, as a self-contained web deck | **available now** |
| 📚 [References](./References.docx) | The works cited in the talk and the paper | **available now** |
| 🔒 [The sealed vignettes](./THE_HISTORIAN_S_CONTRIB.docx.enc) | Timestamped, cryptographically sealed experimental stimuli | **sealed — key to follow** |

*The preprint remains a working draft (see the note below). The sealed vignettes stay sealed by design; the key is revealed only after the experiment is run.*

---

## On the preprint — please read this first

This preprint is **very preliminary**, and it lives **here, in this repository, by design.**

It is intentionally made accessible to the **AI Engineer World's Fair** audience and to readers of the Dossier. The paper has now been **submitted to SSRN**; once it posts, the **DOI and formal citation will be made available here as soon as possible.**

Until that formal version posts, please treat the manuscript here accordingly:

- It is a **working draft**, not yet a citable version of record.
- **Expect it to change** — numbers, framing, and language may move before the formal preprint is released.
- In the meantime, the **best citation is the PDF deposited in this repository** (see below). When the SSRN version is live, this page will link to it, and **that** becomes the citable version of record.

Why release a draft at all? Because the talk points to it, and an audience asked to consider an argument deserves to read the actual argument — not take it on faith. Openness is the whole point of this project.

---

## On the sealed vignettes — a commitment device

The Prism Experiment depends on stimulus materials that must demonstrably exist **before** the experiment is run. To make that verifiable rather than merely asserted, the historian's contribution — the four *a priori* vignettes, together with the diagnostic questions and corpus pairings — is deposited here **sealed and timestamped** as [`THE_HISTORIAN_S_CONTRIB.docx.enc`](./THE_HISTORIAN_S_CONTRIB.docx.enc):

- The **timestamp** — the git history together with the file's own cryptographic seal — fixes the contents in advance, on the record. The sealing mechanism (a SHA-256 seal over AES-256-GCM ciphertext) is the utility [`seal_crypt.py`](./seal_crypt.py); the paper specifies the commit-and-reveal construction in §4.4.
- The **contents remain sealed.** The **key will be revealed only after the experiment is conducted** — so no one, including the authors, can later claim the materials were quietly tuned to fit the result.

This is a pre-registration in spirit: **commit first, reveal later, and let the record speak.**

---

## Lineage in this repository

| Where | What it offers |
|-------|----------------|
| [The Dossier (PDF)](../THE_COMPANION_DOSSIER.pdf) | The origin artifact — the full theory and demonstration |
| [The Halpern Memo](https://the-companion-dossier.com/The_Halpern_Memo/) | The in-world, dramatized account of the same hypothesis |
| [The Summoning Film](https://the-companion-dossier.com/The_Magic_Lantern/the_film/) | The origin story, rendered as cinema |
| [The Atrium](https://the-companion-dossier.com/The_Atrium/) | The museum entrance that ties the estate together |

---

## Citation & contact

The paper has been **submitted to SSRN**; its DOI and formal citation will be posted here as soon as they are available. **Until then, the best citation is the PDF deposited in this repository**, alongside the Dossier DOI:

> Thomas, J. E., Halpern, R., & Martin, S. (2026). *The Mask and the Mirror: Evaluating the Transition of Character-Based AI from Entertainment to Epistemic Infrastructure* [Preprint]. The COMPANION Working Group. https://github.com/jethomasphd/THE_COMPANION_DOSSIER/blob/main/Mask_vs_Mirror/Mask_and_Mirror_Preprint_08102026.pdf
>
> Dossier DOI: **https://doi.org/10.5281/zenodo.17967947**

When the SSRN version posts, that becomes the citable version of record and this page will link to it.

Jacob E. Thomas, PhD — jethomasphd@gmail.com

---

*The COMPANION project is released into the public domain (CC0 1.0). Individual deposited files in this folder — the preprint, the slides, the sealed vignettes — may carry their own terms; where a file states otherwise, that file's terms govern.*

<p align="center">◊ ◈ ◊</p>
