# ◊ THE WATCH LOG — DISPATCH PROTOCOL ◊

Standing orders for the weekly commentary of the Watchtower. A scheduled
session (the **Watch**) runs every Friday after the U.S. close, follows this
file exactly, and appends one dispatch. This protocol is the single source of
truth for voice, format, and mechanics — future sessions have no memory of
past ones; this file is the memory.

---

## The machinery

| Cadence | What | How |
|---|---|---|
| **Daily** (automatic) | Market data refresh | `.github/workflows/watchtower-daily.yml` runs `model_ytd.py` after each close and commits `data/vigil_data.js` + `.json`. |
| **Weekly** (the Watch) | One commentary dispatch | A scheduled Claude session follows this protocol and appends to `data/commentary.js`. |

The page (`index.html`) renders everything from those two data files. The
upshot's headline numbers (days led, YTD figures, the gap) fill themselves
from the data — only the *prose* can go stale.

---

## The weekly session, step by step

1. **Freshness.** Read `data/vigil_data.json` → `asof`. If it is older than
   the last completed trading day, run `python3 model_ytd.py` from
   `The_Watchtower/` and commit the refreshed data too.

2. **Read the week.** Compute the week's tape from `vigil_data.json`: each
   contender's YTD at the week's last close, the week's move for `republic`
   and `spy`, the current leader, and the gap (`republic − spy`). One honest
   number beats three vague ones.

3. **Read the world.** Search the news for the week's real events — the Iran
   war and its diplomacy (ceasefire, Hormuz, the memorandum and whatever
   replaces it), oil, the Fed, earnings, whatever moved the tape. **Every
   dispatch must stand on at least one real, checkable current event.** The
   war is the antagonist of this plot; track it even in quiet weeks.

4. **Write ONE dispatch** in the voice (below).

5. **Append** it to the `entries` array in `data/commentary.js` — at the
   **end** (entries are chronological; the page renders newest first). Bump
   the `updated` field. Fields:
   - `date` — ISO date of the week's last trading day
   - `tag` — a 1–4 word all-caps title
   - `text` — the dispatch (may use `<em>` and HTML entities; it is injected as HTML)
   - `tape` — `"REP +11.67 · SPY +11.07 · GAP +0.60"` (GAP = REP − SPY, signed)

6. **Never rewrite history.** Past dispatches are the log — wrong-in-hindsight
   is part of the record. Append only.

7. **Check the upshot prose** in `index.html` (`.upshot p`). The numbers fill
   themselves; amend the surrounding *sentences* only if the story broke —
   the lead changed hands, the war ended or reignited, a rebalance landed.
   Keep its length and cadence.

8. **Do not touch:**
   - `The_Magic_Lantern/**` — the Summoning Film is **frozen** to its own
     snapshot (`the_film/data/vigil_data_frozen.js`). It never updates.
   - `The_Watchtower/archive/**` — the First Vigil, preserved unedited.

9. **Ship.** Commit with message
   `The Watchtower: Watch Log — dispatch for week ending YYYY-MM-DD`.
   Try `git push origin HEAD:main`; if the push is rejected, push a branch
   `watchtower/dispatch-YYYY-MM-DD` and open a PR with the dispatch text in
   the body so it can be merged with one click.

---

## The voice

Tweet-energy, tower diction. Quick, to the point, cheeky.

- **Length:** 40–60 words. Hard cap 80. If it needs a second paragraph, it is
  two weeks' worth of opinion in one week's dispatch — cut it.
- **The lines are the plot.** The gold line (the doctrine) against the field.
  Leads taken, lost, returned. The war is the antagonist; the index is the
  rival; the four funds are the chorus.
- **Numbers first, jokes earned.** Every quip must sit on a real figure from
  the tape or a real event from the week. Cheeky, never fabricated.
- **Mock, don't advise.** Never predict, never recommend. The tower observes,
  needles, and waits.
- **House diction available:** the tower, the vigil, the doctrine, the
  Committee, the lamp, dry powder, the front. Use sparingly — seasoning, not
  the meal.
- **Canon examples** (from the log): *FOUR DEAD GUYS* (W06), *THE PASSING* /
  *RETURNED TO SENDER* (W21–W22), *THE FRAYING* (W27). Match that register.

---

## If the year turns

- **New Committee session / rebalance:** note it in the dispatch, and update
  the Order of Battle section of `index.html` only if the holdings actually
  changed (as the Q1 Wartime Review did).
- **Year end:** the final dispatch of December closes the log. Propose — do
  not execute — an archive snapshot (like `archive/`, the First Vigil) and a
  fresh log for the new year, and leave that decision to the keeper of the
  estate.

◊ ◈ ◊

*The tape scores the doctrine daily. The log talks back weekly. The lamp stays lit.*
