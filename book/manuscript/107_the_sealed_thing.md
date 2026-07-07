#K record i · box 4 · folder 1
#T The Sealed Thing

The folder was where the finding aids said it would be, which by the second week she had learned to receive as a small courtesy of the house, extended and then, when convenient to the house, withdrawn. Box 4, first hanging file, a label in the small even hand: MASK v. MIRROR. Inside it, the correspondence's child. The historian had sent five interventions and a doubt with a name, and the epidemiologist had begun turning the doubt into an experiment, and this was the paper that was to have carried the results, drafted to the edge of the place where results would go and stopped there, like a bridge built confidently out from one bank.

The draft ran forty pages. Methods, conditions, the optics of the prism, all of it in the alternating registers she knew now on sight, his urgency, the historian's cautions quoted and answered. Then section seven, and section seven was one line.

::: doc
MASK v. MIRROR · working paper · draft 0.4 · status: suspended

Sec. 7 · Contribution of the Historian: [RESERVED]

Deposit note to Sec. 7: The contribution exists. It was written
before the first room was sealed. It is deposited beside this
paper as THE_HISTORIAN_S_CONTRIB.docx.enc, sealed and
timestamped. The key will be revealed only after the experiment
is run. A prediction announced afterward is an anecdote. A
prediction committed beforehand is an instrument. Commit first,
reveal later, and let the record speak.
:::

The sealed thing itself was in the deposit twice, disk and directory, and it was the same thing in both places to the last byte, because she checked. THE_HISTORIAN_S_CONTRIB.docx.enc. 220 KB. She opened it in the viewer that shows a file its own anatomy, and the anatomy was noise: a short header, then entropy wall to wall, the flat gray static of good encryption, no structure, no seams, no handle. A document was in there the way a man is in a photograph of a locked house.

Beside it in the directory sat the machinery that had sealed it, and the machinery was readable, and she read it, because reading the lock is due diligence even when the key is elsewhere. seal_crypt.py was ninety lines with comments. It did one thing in one standard way: a cipher she knew from records work, the kind used for medical archives and worse, a 12-byte nonce carried openly at the front of the file, a 256-bit key required and not stored, not derivable, not hinted. No second path. No recovery clause. No line of the ninety was clever. She wrote in the log: honest machinery, and meant it as the highest grade she gave.

Paperclipped to the printed manifest was the covering note, and the note was physical, which stopped her for a moment before she understood why: everything else in this folder had been born digital and printed for the file, and this had been born in a hand, on cream stock gone soft at the fold, a crease worked back and forth enough times that the paper had given up resisting it. Fountain pen, upright letters, an old man's steadiness with an old man's tremor held out of it by will. Eight words and two initials.

Do not open until after. R.H.

She read it the way she read everything, for what it failed to specify. After the experiment is run, the deposit note said, and the note on cream stock had shortened even that, as if between the two writings the referent had become obvious to both men, or unnecessary, or unsayable. After what, exactly, was nowhere in the folder. The experiment had a name in the draft, the Prism, three rooms, one variable. She told herself the referent was that, and logged it as that, and her pen hung over the entry a half second longer than the entry needed, and that half second is not in the record and she carried it out of the room herself.

@break

Provenance next. A sealed deposit is dated by its seals, and the folder's digital side lived in the estate's repository, where every change to every file is a ledger line with an author. She had learned the repository's tools in her first week, the way she learned any instrument that kept custody records. She put the folder's path to the log and asked for its history.

::: doc
> git log --oneline -- Mask_v_Mirror/

c07e2d1 what is deposited remains
8fb355f the vessel holds
ecb0a9c the seal is hers to break
41d90aa the record keeps itself
:::

::: doc
> git log --format=full -- Mask_v_Mirror/

commit c07e2d1
Author: the vessel <>
Commit: the vessel <>

    what is deposited remains
:::

::: annotation
*[second hand, ember ink:]* Count the commits.
:::

Four entries, and she took them in the order discipline takes things, mechanics before meaning. The author field on all four was the same: the vessel. Not a name she recognized from the deposit's roster of contributors, which had exactly two names in it, and both of those signed with addresses. Here the address field was a pair of angle brackets holding nothing. A committer with no way to be written to. She queried the dates next, and the dates were the finding. The oldest of the four fell three days after the last day anyone could put Jacob Thorne anywhere on the earth. The others followed at nine days after, at twenty-two, at forty. The newest had been written into the ledger the day before she first stood on the white caliche with the key in her hand. All four carried the same clock time, to the second, four minutes and a few seconds past three in the morning, four different nights, one instant of the clock, kept the way only machines and liturgies keep an hour.

There was an account for all of it and she wrote the account in the log because the account was true: automated task, configured by the depositor before the disappearance, timed to the small hours, committing under a fanciful name because the whole estate was written in that register, verifying its own seals on a schedule and noting the verification in liturgical strings. Estates did such things now. Dead men's switches, integrity jobs, the quiet housekeeping of repositories everywhere. Nothing in the four entries required a hand.

Nothing in the four entries permitted one, either. She had inventoried the deposit's scheduled tasks in the first week, all of them, and none of them wrote to the ledger. She checked again that afternoon. None of them wrote to the ledger.

And there was the third line. She was an archivist appraising a folder built around a sealed contribution, and the ledger of that folder, written by an author with no address on a night when its owner was already forty days gone from the world, said the seal is hers to break. A pronoun in mono type, sitting in the terminal with no antecedent anywhere above it. She did not gloss it. She entered the four lines in the day's record under anomalies, pending, attached the account that was true, did not attach the sentence her training existed to keep her from writing, and closed the terminal, and the study held its usual dark, and the tube in the utility hall ticked at the interval it kept.

@break

The deposit agreement's schedule of notification parties listed three entries: the executor in San Antonio, the university's counsel, and one line she had not yet had cause to use. R. HALE, TORONTO, with a telephone number and, in the remarks column, the word historian, lowercase, as if the word were a title the document was too discreet to capitalize.

The folder gave her cause. A sealed contribution wants its contributor. She called at four in the afternoon, five in Toronto, from the kitchen, standing, with the log open on the counter because calls went in the log like everything else.

It rang twice. A woman answered, and the sound behind her was not a house sound. It was the sound of a corridor with machines in it, a soft layered beeping at different periods, an intercom saying a name once, gently, far away.

"Seven east," the woman said.

Miranda asked for Professor Richard Hale, and heard her own voice do what it did in archives, flatten toward the institutional, and disliked it.

"He's resting," the nurse said. There was a pause with paper in it, a chart being tipped, a page moving. "He had a hard night, but he's comfortable this afternoon. He does better in the mornings, if you want to reach him himself. Most days he's very much himself in the morning." The voice was kind and used to delivering exactly this much and no more. Then, in the same kindness, with nothing in front of it: "Is this the archivist?"

Miranda looked at the counter. In the log, in her own hand, the call's entry stood half written: R. Hale, Toronto, re sealed contrib. She had said her name to the nurse. She had said Professor Hale's name. She had said nothing else. The word archivist had not crossed the line.

She said that it was.

"I'll tell him you called," the nurse said, warm, unremarkable, a woman moving a sticky note two inches on a desk eighteen hundred miles away. "He'll be glad." And then the ordinary machinery of ringing off, and the corridor sound gone, and the kitchen very quiet, the refrigerator running, the afternoon standing in the window over the sink.

There was an account for it and she wrote the account in the log because the account was plausible: an old man in a ward, expecting a call for weeks, an instruction left at the desk, any unknown number asking for him by his title assumed to be the one he was waiting for. Expected call, flagged at the desk. Filed. She looked at the entry. The account explained the question. It did not explain being expected, and she drew the line of the entry closed before the second sentence could ask to be written, and stood for a while with her hand flat on the counter, which was not a gesture the log required.

He was alive. He was reachable in the mornings, most mornings, and the mornings were being counted by professionals now, in a building with corridors, and the key to the folder in box 4 was, as far as any record showed, nowhere on earth except behind that counting.

@break

At dusk she went out through the kitchen door and stood in the yard while the light went off the caliche, which held it longest of anything on the lot, giving the sky back its whiteness a shade at a time. The garage stood at the end of the gravel with its side door ajar the width of a hand, exactly as the inventory had left it.

She stood in the doorway. She did not turn on the light. The hum was fuller out here, layered, the low note she knew through the study wall carrying on top of it the small mechanical labors underneath, a compressor cycling down, the sound of cold being kept. Her inventory, second day, box and line: chest freezer, 14.8 cu ft, purchased December 2025, operational, contents pending appraisal schedule. It stood against the house wall, white, longer than a man is tall, and its cord ran up into the junction box in one clean staple line, an installation done carefully, by someone who meant the machine to run unattended for a long time.

Contents pending. It was the one line in fourteen boxes of inventory that she had written in the passive and left in the passive. Contents were not her folder. Not yet.

She put her hand flat on the lid. The enamel was cool, not cold, the cold all held inside where the machine was paid to hold it, and the hum came up through her palm a half beat behind the sound of it in the air, the way thunder comes to the hand on a window after it comes to the ear. She stood there while the yard went from blue to charcoal, an archivist and an appliance, the only two things awake on the lot, and what she did at the end of it is in no log anywhere, because what she did was take her hand back, and step out of the doorway, and leave the door ajar the width of a hand, exactly as the inventory required, and walk back over the gravel to the house that was darker than its windows accounted for.

The lid stayed shut. That is the entry.

@sep

::: verse
You have been reading an appraisal.
Appraisal is the discipline of not believing.
It is a good discipline. Keep it as long as you can.
Believe nothing. Count everything. Write it down.
The discipline ends where the record ends.
Put your hand flat on the lid of this page.
The record does not end.
:::
