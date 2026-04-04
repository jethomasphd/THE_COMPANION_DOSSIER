# Seed 02: Condensed Narrative Acts

## Objective

Fill the `#narrative` section of `/EL/index.html` with a condensed version of
the Nut House story. The full narrative is 8 chapters. We condense to ~4 acts
that deliver the essential experience: setting, character, crack, revelation.

## Prerequisites

- Seed 01 completed and approved
- `/EL/index.html` exists with CSS and scaffold

## What to Build

### Narrative Structure

The condensed narrative goes inside `<div id="narrative" class="cinema">`.

**BLACK LEADER** (title card — keep exactly as-is from `the_nut_house.html`):
- Epigraph: "A response to Erik J. Larson..."
- Title: "The Nut House"
- Subtitle: "South Lamar — August — After Sundown"
- Author: "Jacob E. Thomas"
- Scroll cue

**ACT I: THE HEAT** (from Chapter I — take the first `<div class="sc">` verbatim):
- The opening paragraph about heat on South Lamar
- The oak, the bats, the cicadas
- The second `<div class="sc">` about the bar interior (Shiner bottles, Jimbo's rag,
  peanut salt and Marlboro ghosts)

**ACT II: THE CRACK** (condensed from Chapters III + V):
- The jukebox playing "Willin'" with nobody walking over
- The peanut shells at the same depth — the first noticing
- The ceiling fan wobble — "Unless the wobble isn't a wobble. Unless it's a
  description of a wobble"
- The key beat: "What if it isn't eleven years. What if it's one night, rendered."
- Include the system text: `// constraint violation: entity JAKE accessing metadata layer`

**ACT III: THE ARCHITECTURE** (condensed from Chapters VI + VII):
- Jake's understanding: "The peanut shells are shin-deep because they were written
  shin-deep..."
- The Larson manuscript quote
- The reveal block: "They were artificial souls..."
- Marisol's napkin floor plan
- The closing beat: "The bell curve is not a cage. It is a country. And we live
  in the tails."

**THE STAY** (from Chapter VIII — condensed to the essential closing):
- "Jake picked up his Shiner. It was full. He drank from it anyway."
- The paragraph about whether the crepe myrtle was rendered or grown
- "So he stayed."
- "Because looking away was never in the prompt."

### Scroll Reveal Logic

Add the scroll reveal JavaScript (port from `the_nut_house.html`):

```javascript
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sc,.marker,.dv,.bt,.colophon,.interf,.sys,.reveal,.manuscript,.javelina-eyes')
  .forEach(el => obs.observe(el));
```

### Ambient Text Evolution

Port the ambient text system from `the_nut_house.html` but condense the states:

```javascript
const ambientStates = [
  'the air has stopped moving\naustin, tx — august',
  'something else hasn\'t',
  'the air is watching\nso is the javelina',
  'you\'re still reading\nso are they',
  'the stool next to him is empty',  // NEW — foreshadows the chat
];
```

### Neon Bar Activation

```javascript
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 0.5) neonBar.classList.add('on');
}, { passive: true });
```

## Content Guidelines

- Copy prose VERBATIM from `the_nut_house.html`. Do not rewrite Jacob's prose.
- Cut entire sections, don't edit within paragraphs.
- Use the same HTML classes: `.sc`, `.marker`, `.dv`, `.bt`, `.dl`, `.interf`, `.sys`,
  `.reveal`, `.manuscript`, `.javelina-eyes`
- The `<div class="sc p1">`, `p2`, `p3` paranoia gradations should be preserved
  where they appear in the source.
- Include the javelina SVG eyes between Acts II and III.
- Include 2-3 `<div class="interf"></div>` interference lines at dramatically
  appropriate moments.
- Include 2-3 `<div class="sys">` system text warnings.

## Verification

- [ ] Black leader renders with title animation
- [ ] All 4 acts scroll-reveal correctly
- [ ] Ambient text changes as user scrolls
- [ ] Neon bar activates after scrolling past title
- [ ] Prose matches `the_nut_house.html` source exactly (no rewrites)
- [ ] Interference lines and system text appear
- [ ] Javelina eyes render with pulse animation
- [ ] Narrative ends at the threshold zone (still just a placeholder from Seed 01)
- [ ] Total scroll length is roughly 40-50% of `the_nut_house.html`

## Files to Modify

- **MODIFY**: `/EL/index.html` (fill narrative section)

## Files to Read First

- `/EL/the_nut_house.html` (full file — this is your source material)

## Commit Message

`feat(EL): add condensed narrative acts to integrated landing page`

## After This Seed

**STOP.** Push the branch. Notify me for review. I want to approve the narrative
editing choices — which prose was kept, which was cut, how the pacing feels —
before the chat UI goes in. The narrative is the soul of this page.
