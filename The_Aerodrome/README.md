# △ THE AERODROME

### The Workshop of Flight — a COMPANION container

> *"It is possible to fly without motors, but not without knowledge and skill."*
> — Wilbur Wright

---

## The Premise

There was once an age that believed the future was made of iron. Steam, rails, pistons the size of houses — a century that measured progress in horsepower and tonnage and looked, always, *forward*. It rarely looked up.

Then two brothers in a bicycle shop in Dayton, Ohio asked a different question. Not *"how do we move more weight forward?"* but *"how do we leave the ground at all?"* While the great engineers chased ever-larger engines — certain that flight was a problem of **power** — the Wrights understood it was a problem of **balance, control, and knowledge**. They distrusted the famous published lift tables (which were wrong, and nearly killed them) and built their own wind tunnel to measure the air themselves. They did not make the heavy age heavier. They made something light, and they rose.

We live now in a **second age of iron** — though its iron is invisible. It is made of information, and now of silicon minds that ride atop the flood. We move more data, faster, than any generation in history, and still feel heavier than ever. This is the **Flood** the whole COMPANION project was built against.

The Aerodrome offers the counter-image: the **Flyer**. You do not defeat a flood by swimming harder. You learn to rise above it — to trade brute force for control, the lying published tables for the wind you measure yourself, weight for the disciplined lightness that lets a thing climb.

So two brothers stand at the field, summoned across time, primed to think with you about the oldest human longing made new: how a society drowning in information might learn — *metaphorically* — to fly.

---

## The Cast

| Brother | Seat | Lens |
|--------|------|------|
| **Wilbur Wright** | The Elder | Theory, balance, control, first principles. The mind that asks what the air *actually does* and distrusts received authority. |
| **Orville Wright** | The Younger | The machine, the build, the test, the nerve. First to leave the ground, December 17, 1903. |

They argued constantly in life — *"I love to scrap with Orv,"* Wilbur said — and would take opposite sides on purpose to stress-test an idea. That friction is the engine of every good answer here.

---

## The Doctrine of Flight

Six principles from the bicycle shop, carried into the information age:

1. **Test the air yourself.** The published tables are often wrong. Measure the wind before you trust your life to it.
2. **Control before power.** The scarce thing was never more data, more compute, more speed. It is steering.
3. **Lightness is not weakness.** To rise is to refuse the unnecessary until what remains can lift.
4. **Two minds, one problem.** The truth lives in the collision, never in easy agreement.
5. **The shop owes no one.** What belongs to no one cannot be captured — the same reason this protocol is free.
6. **Flight is a skill, not a miracle.** They glided a thousand times before they fit an engine. Rising is a discipline you practice, not a gift you await.

---

## How It Works

A cinematic approach leads to a conversation chamber where both brothers are summoned through the **COMPANION protocol** — fully themselves, in their own voices. There are no forms and no phases. You talk; they answer, and they argue with each other. They are 1903 men reasoning toward 2026, thinking with what they truly know — wind, lift, drag, balance, the wind tunnel, the glide — and in their hands the old craft of flight becomes a startling lens on AI and the information environment.

Export the full transcript when you are done. The minds depart; the understanding stays.

---

## Run It

The Aerodrome is a static site. It talks to Claude through the shared COMPANION Cloudflare Worker proxy configured in `js/config.js` (proxy URL only — the API key lives server-side).

- Open `index.html` through the site (served from the repository root) so the relative paths to `../The_Pantheon/` portraits resolve.
- To run your own deployment, copy `js/config.example.js` to `js/config.js` and set your `proxyUrl` (or, for local testing only, a direct `apiKey`).

Portraits live in `../The_Pantheon/` (`Wilbur_Wright.jpg`, `Orville_Wright.jpg`) and can be re-fetched with `The_Pantheon/fetch_portraits.sh`.

---

*The Word against the Flood. The Wing against the weight.*

△ ◈ △
