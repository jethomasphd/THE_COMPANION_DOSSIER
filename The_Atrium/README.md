# The Atrium

**The entrance hall to the COMPANION estate.** One claim, told at three depths.

The Atrium is a single, self-contained navigational experience that stands the
whole project upright. It does not replace anything. It gives a first-time
visitor one golden path (**the Spine** — Protocol → Doctrine → Instrument →
Review) and then a single **Fork** that splits *"I want to use this"* from
*"is it real?"*, so the seven containers and the four theory pieces stop
competing for attention. The deeper wings — the Halpern Memo, the Addendum,
Dialogic Intelligence, From Beyond — are **gated behind the question each one
answers**, so depth becomes a reward for going deeper rather than a tax at the
door.

It links **out** to every existing artifact. Nothing links *in* to it yet, and
no existing file references it — which is what makes it perfectly reversible.

## Structure

- `index.html` — the entire experience, self-contained (inline CSS + JS, web fonts only).
- Three strata: **The Work** (gold) · **The Method** (indigo) · **The Proof** (green).

## How to revert — completely and cleanly

This feature is **add-only**. It lives entirely inside `The_Atrium/` and modifies
no other file in the repository. To return the repo byte-for-byte to its prior state:

```bash
# Option A — delete the folder
rm -rf The_Atrium

# Option B — undo the commit that introduced it
git revert <commit-hash>
```

Either option fully removes the Atrium with zero side effects, because nothing
else was touched.

## To adopt it as the front door (optional, later)

If you decide you love it, the only change needed elsewhere is a single link
from the homepage (`/index.html`) pointing to `The_Atrium/` — or repointing the
GitHub Pages entry. That is a one-line, equally reversible edit, and a separate
decision from shipping the Atrium itself.

---

*Released into the public domain (CC0 1.0).*
