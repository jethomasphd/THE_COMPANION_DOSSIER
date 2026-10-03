# The Committee of Patriots — The Sessions

The full, navigable story of the Committee of Patriots: four founders summoned
via the COMPANION Protocol, the **Republic Portfolio** doctrine they produced,
the **Watchtower** that measures it in public, the **wartime review** that
refined it, the **false peace review** that accounted for the first quarter
the index ever won, and the **Germantown review** — the first session ever
convened from second place.

**Start here:** open `index.html` — the Sessions hub. It carries the whole story
in six movements (the Founding → the Instrument → the Wartime Test → the False
Peace → Second Place → the Turn), with the loop embedded as navigation so you
can jump to any movement or read straight down.

---

## Contents

| Path | What it is |
|------|------------|
| `index.html` | **The Sessions hub** — the museum landing that tells the full story and routes to everything below. |
| `handbill/` | **Franklin's Handbill** — the December 2025 Republic Portfolio as a 1775-style broadside. *(Previously the folder's index page; relocated here so the hub can be the front door.)* |
| `Committe_of_Patriots_Innitial_Holdings_Session_2025-12.pdf` | The full founding session transcript: doctrine, methodology, initial portfolio composition. |
| `The_Republic_Portfolio_2025-12.pdf` | The original founding white paper for the doctrine. |
| `backtest_2025-12.py` | Reproducible ten-year backtest script for the doctrine. |
| `Q12026/` | The **Q1 2026 Wartime Review** — the full interactive session, its wartime handbill (`Q12026/handbill/`), and the session PDF. |
| `Q22026/` | The **Q2 2026 False Peace Review** — the quarter the index won, accounted in full: the semiconductor gate (TSM, ASML, INTC), the complete Exclusion List, the new Withheld List (NVDA), its handbill (`Q22026/handbill/`), and the session PDF. |
| `Q32026/` | The **Q3 2026 Germantown Review** (Oct 3, 2026) — the first session held from second place. A holding-by-holding ledger of the decline since August (two-thirds of it the price of money), NVIDIA kept Withheld by a recorded 1–3 vote under a restated Toll Test / Winter Test, the new **Cost Column**, the covenant's third clause, holdings unchanged, its handbill (`Q32026/handbill/`), and the session PDF. |

Future quarterly committee sessions will be added here as they are convened.
The next is the **first Annual Audit**, December 2026.

---

## How to revert this hub

The hub was added without destroying anything: the original December handbill
that used to live at this folder's `index.html` was **moved**, intact, to
`handbill/index.html`. To restore the prior state (bare handbill at the folder
root, no hub):

```bash
git revert <commit-hash>   # restores index.html to the handbill, removes the hub
```

or manually move the handbill back:

```bash
git mv handbill/index.html index.html   # and delete the hub
```

---

> Disclaimer: Educational / civic research only. Not financial advice.
> Backtests are not predictive.
