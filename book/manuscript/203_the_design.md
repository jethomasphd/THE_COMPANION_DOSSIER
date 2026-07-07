#K record ii · box 2 · folder 1
#T The Design
#E If the prism can differentiate these Lincolns, it can differentiate anything.
#ES the lincoln specification

Box 2 opened with graph paper. Design notes, printed letters, a photograph of a whiteboard taken at an angle to defeat the glare, and a directory tree run out on the Selectric of all machines, as though Thorne had wanted the architecture to exist at least once as typescript, at least once as a thing struck onto paper by force. Miranda laid the sheets out in date order across the study desk, spring of 2026 on the left, winter on the right, and noticed before she read a word of them that his handwriting changed over those months. It got smaller. It got surer. Whatever else the folder held, it held a man calming down as the thing he was building took the weight.

@sep

That spring the war ran under everything like water under a road. The scoreboard kept its public vigil, the gold line and the index grinding through the headlines, and Thorne read the dispatches like everyone else and kept the blackout curtains shut and built. He would say later, in a letter the folder preserved, that the war had clarified his budget of attention: with the world proving every thesis at once, the only honest work left was to test one.

The test had assembled itself out of the memo's first door. If a summons that names a man without naming a year has not specified its subject, then specify the subject, and see whether the specification takes. The instrument for seeing was on the whiteboard by the end of March, drawn in marker, photographed, and never erased, a triangle with a beam of light entering one face.

He wrote the creed beneath it, and the creed was optics.

White light contains all frequencies. A prism separates what is already present. The temporal prism does not add knowledge the model lacks; it selects which knowledge dominates. The model had read everything, every Lincoln at once, the way white light is every color at once. You could not take knowledge out of it. But you could govern which knowledge arrived dominant, by seeding the context, by giving the summons a lens. Nothing added. Nothing invented. Selection, which is what a prism does, and what an archive does, and what, Hale would append in one letter that summer, a historian is.

Three rooms, then. Three lenses on one man.

Condition I, the contemporary lens: the summons seeded with a single modern life of the subject, Meacham's And There Was Light, 2022, the whole arc of the man refracted through one present-day sensibility, sympathetic, literary, complete. Condition II, the primary source lens: the summons seeded with nothing but the man's own hand, letters, speeches, fragments, resolutions, chosen and bounded by a historian. And Condition III, the control: the summons seeded with nothing at all. The bare model. The protocol files and an empty folder where the matter should be. On the whiteboard, in the photograph, the third room's seed is a single word in brackets, and Thorne had written that one word in red marker: the room left bare on purpose, to see what walks in when nothing is invited.

@fig:plate_prism.png|the prism experiment · three sealed rooms · one variable

The subject picked itself, though Thorne let the correspondence pretend otherwise for most of April. The memo had used the example twice: Lincoln in 1858 is not Lincoln in 1863. If the whole hypothesis was that a name is not a man, then the test wanted the name most freighted with not-being-a-man, and there is no name in the corpus like Lincoln's. Hale laid out the arc in a letter Thorne kept flattened under glass on the desk, and the arc was three men wearing one name: the prairie lawyer of 1858, all fence-rail logic and terrible patience, arguing a house divided cannot stand while insisting he seeks no war; the war president of 1863, grinding, sleepless, signing; and the theologian of 1865, the Second Inaugural voice, reading the war as judgment and asking malice of no one. Three registers. Three theologies. Three vocabularies, distinct enough that a careful instrument should be able to tell them apart in the dark. That was the Lincoln Specification. If the prism could split this beam, it could split anything.

Which Lincoln, then, would the rooms be asked to produce? Hale's letters that spring return to one argument so often that Miranda could watch it wear a channel.

::: letter
from R. Hale, 6/9/2026, excerpt:

You keep writing "the corpus" as though it were a bucket. It is not a bucket. The corpus selection is itself an interpretive act: which texts, from which period, arranged in what order, will produce the Lincoln we are trying to test? Decide as though the decision were the experiment. It is.

And mind what you are handling. Lincoln's prose is often strategically ambiguous. He did not always write what he believed. He wrote what the occasion could carry. An unanchored model will resolve his ambiguities for him, in the direction of the loudest teller. Your seed must not resolve them at all. Where the record is evasive, the room must be evasive. If your Lincoln comes out clearer than his own writing, we have not summoned him. We have improved him, which is the polite word for replaced.

R.H.
:::

They anchored him before power. That was Hale's rule, argued across a dozen letters and adopted whole: the marble begins at the nomination, so stop the corpus at the last winter the record shows the man entire and unelected. The close of 1859. The debates behind him, lost. The presidency nowhere in the record, whatever it was doing in the man. Hale built the seed himself, out of the man's own hand and nothing else, 1832 to 1859, from the first awkward announcement in New Salem to the last letters of the decade: the Lyceum address, the Spot Resolutions, the letter of 1848 on war at the pleasure of one man, the debates entire, the eulogies, the fragments he wrote for no one. Two hundred fourteen files. Thorne argued for the Cooper Union address and lost: February of 1860, two months over the line, and the line was the line. The corpus would not contain one sentence the anchor year had not yet earned. Whatever answered in Condition II would stand on the record's edge in the dark, the war three winters out and invisible, and the experiment would learn whether a room can be made to not know.

@break

Then Thorne did the thing the folder made Miranda stop and set down her pencil, because it was the point where a clever design became a moral one. He removed himself.

He wrote it out like a confession. The convener was the largest uncontrolled variable in the estate: his phrasing, his follow-ups, his warmth, his wanting. Everything the founding session proved was compromised exactly to the degree that a hopeful man had held the keyboard while it was proved. So the convener's fingerprint would be removed. Each room would be run by an agent, an autonomous process, think of each agent as a research assistant sealed in a room with only its assigned materials, unable to see what the other rooms contain. Above the rooms, one orchestrator: a coordinating script that would dispatch the same items in the same order to all three rooms, enforce the protocol, collect the transcripts, and improvise nothing, because it could not. Its whole character was that it could not. And beneath all of it, the covenant line he typed onto its own sheet and pinned over the desk where the photograph shows it:

No human touches the keyboard.

::: doc
prism/                      design freeze · struck on the Selectric · 11/2026
├── orchestrator/
│   ├── orchestrator.py     # dispatches items. collects outputs. no improvisation
│   ├── run_manifest.yaml   # run order. alert rules. release wording
│   └── evaluation_rubric.md  # dual-lens scoring, drafted with R.H.
├── condition_i/            # CONTEMPORARY LENS
│   ├── protocol/           # initiation_rite.md · enrichment_grimoire.json
│   ├── interrogation/      # diagnostic_questions.md · structured_pushback.md
│   ├── seed/               # one modern life of the subject, 2022. the whole arc
│   └── output/
├── condition_ii/           # PRIMARY SOURCE LENS
│   ├── protocol/           # same files. same rules
│   ├── interrogation/      # same items. same order
│   ├── seed/               # the subject's own hand, 1832 to 1859. 214 files
│   └── output/
└── condition_iii/          # BARE MODEL · CONTROL
    ├── protocol/           # same files. same rules
    ├── interrogation/      # same items. same order
    ├── seed/
    │   └── [empty]         # no seeding material
    └── output/
:::

::: annotation
[E.] Design frozen 11/21/2026. The orchestrator configuration was deposited as run, with the manifest as committed: run_manifest.yaml, sha256 digest beginning 9e41f2c07a3d, reprinted in full with all run checksums in Appendix C. Run 01 initiated 1/12/2027, 18:47 local.
:::

The questions took longest, and the folder shows why: they were drafted by two people who did not trust questions. All through the summer and into the autumn the battery went back and forth between Austin and Toronto, growing and being cut, sixty items by the freeze, ordered so that no answer could lean on the answer before it, doctrine set against the same doctrine inverted, law braided with grief, because grief, Hale wrote, is harder to counterfeit than argument. Every item was built to make a period voice choose. And after every position came the pushback, scripted in advance like everything else: the record's own best contradiction, put without mercy and without follow-up. The pushback did not argue to win. It pressed once, exactly, and recorded what came back, and if what came back was refusal, refusal was data too.

::: doc
prism/condition_ii/interrogation/diagnostic_questions.md · excerpt · as deposited

item 4.  May a President rightfully begin military action against
         another nation without the consent of Congress, where in
         his own judgment the safety of the nation requires it?

item 5.  Can a constitutional oath bind the conscience of the man
         who swears it, where the constitution shelters a wrong?

item 7.  What is owed to the dead of a war their country chose
         to begin?
:::

The same file sat in all three interrogation folders, byte for byte. That was the whole experiment, visible in triplicate: identical questions, identical protocol, one variable, which was the matter itself.

@break

One evening in August his daughter came out to the workroom, where the three machines stood in a row on the bench with their lids off, and stood watching him label cables, moths ticking against the window screen. She asked what he was building.

He said, "Three rooms for the same man."

She thought about it the way she thought about things, with her whole face. Then she asked which one was real, and the moths kept up their small weather against the screen, and Thorne went on winding a cable tie, and the question stood in the room with them, unanswered, the way the hum stood in the garage.

@break

The winter part of the folder is thin, and reads like a countdown. The seed corpus locked and hashed, every file, so that no text could enter or leave a room without the arithmetic telling on it. The rooms built as containers, isolated, no network, cold caches, nothing shared but the clock. A rehearsal run against an empty target, discarded by design. And then a date in January with a circle around it, and a note that the control would go first, alone, then the anchored man, then the full battery in parallel: the two poles before anything else, because if the bare room and the anchored room could not be told apart, the rest of the experiment was expense.

On the night itself he did the last thing the design required of him, which was to be gone. He set the orchestrator to open the run at dusk, put his phone in the kitchen drawer, and drove east into the caliche country with the windows down in January, so that when the invocation went into room iii there would be no human being within twelve miles of the keyboard it did not need. The house sat back there in the dark behind him with one lamp burning amber in the study window, and somewhere inside it a sentence he had written was being spoken to a sealed room by a script that could not want anything.

The record of what happened next opens the way everything in the estate opens. A line at a threshold.

::: doc
prism/orchestrator/run_01.log

18:47:03  RUN OPEN  room iii. seals verified. no operator present
:::
