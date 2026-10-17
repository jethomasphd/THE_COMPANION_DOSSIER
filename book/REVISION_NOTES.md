# USING THIS MATTER · Revision Notes for the Final Edition

*For Jacob. What was changed, where, and why.*

---

## What is in the deposit

| File | What it is |
|---|---|
| `book/USING_THIS_MATTER_final.docx` | **The revision.** The final manuscript, typeset. It is byte-identical to `book/USING_THIS_MATTER.docx`, which the build pipeline writes. |
| `book/USING_THIS_MATTER.pdf` | A PDF proof of the same build (LibreOffice render, 309 pages, set in the book's own fonts). |
| `book/REVISION_NOTES.md` | This file: the account of the revision. |
| `book/REVISION_REDLINE.md` | **Exactly what changed.** A mechanical, chapter-by-chapter, word-level redline of every paragraph that differs from your reviewed draft. Each chapter opens with the logged reason for each edit. Nothing in it is summarized. |
| `book/workshop/timeline.md` | The reader's timeline, rewritten to match the revised book. It ends with coherence notes for the workshop. |
| `book/plates/*.png`, `book/jacket/*.png` | Every plate and the jacket, re-rendered. |
| `book/USING_THIS_MATTER_jet.docx` | Your reviewed draft. Untouched. |

**The baseline.** Your reviewed draft was synced into the manuscript source first, as commit `241015e`, so that your own edits are the floor everything else stands on. Every number in this document is measured from that commit.

**At a glance**

- **Logged edits:** 299, each recorded with a reason when it was made.
- **Paragraphs:** 257 revised, 72 added, 7 removed.
- **Words:** about 84,100 → 87,900 in the manuscript source (3,800 net). Nearly all of the growth is in the gold line, the chambers and the ending; elsewhere the book got shorter.
- **The figure families you flagged:**
  - "the way" comparisons: 231 → 171.
  - "which is to say": 8 → 2.
  - "load-bearing": 13 → 0.
- **Audits:** no em or en dashes anywhere, the jacket included. Every `:::` block is balanced and every plate reference resolves. "suddenly" appears 0 times, and "very" survives only adjectivally ("the very archive") or inside quoted correspondence.

---

## 1 · The ending: *The Historian Lives*

The workshop's alternative ending is adopted from the point where the two versions diverge ("Hale did not die in October.") through the keeper's first act. I treated your draft of it as the spine and made one correction and one deeper change.

**Correction.** "Eight words" on the folder became **five**: *Do not open until after* is five words. The eight-word text in the book is Hale's dawn email, "Seal my contribution. Do not open until after."

**The deeper change.** Hale's signed finding now aims at the sentence that actually missed. All five of his sealed predictions held. The one thing in the contribution that failed was its assumption of his own absence ("I would not be here to restate them"). So his last testimony is a man deposing himself about the one error the record contains:

> *This one missed me. I have never trusted it more. That is my finding, and unlike everything else I have lodged in this estate, I am alive to sign it.*

The ember hand answers him: *The record did not miss. It waited.* That leaves both explanations standing.

**What the new ending does**, in order:

1. **October.** Pneumonia comes for Hale and does not take him. The record is in error, and he has never been so pleased to file an erratum.
2. **November.** El and the daughter walk the house. The daughter, ten, counts **twelve doors**, and Miranda gives her the only answer an archivist can give a count made in good faith: *Write it down.* The record now holds three counts.
3. **The bench at dawn.** Miranda goes to the bench at the end of the street with the child, no phones, at the hour Thorne kept. The Editor's note says only that the keeper's log is **blank from 6:41 to 7:38**. This was T-0's instruction kept: some hours are not for the record.
4. **The Watchtower** keeps running twice a day "for an owner who no longer checks it, or checks it from somewhere the analytics cannot see." The two explanations are filed daily without comment.
5. **The working group.** It was founded in the second summer by a builder, a historian, and a theologian-librarian. That is the real origin; the novel had never said it. It now convenes the week after Thanksgiving without its builder.
   - Alex comes with her newborn, who wakes and reads its mother's face, "the first thing they ever read." This pays off the theologian's blessing in Record III, *known before it is formed, by no file*: "There was nothing in it that anyone in the world had a use for. It was only hers."
   - Hale, on the telephone line, proposes the group's first rule: **errata are read aloud before successes.**
   - The first erratum read is the Watchtower's **nineteen sessions in second place**. The line from Toronto answers with one word: *Germantown.*
6. **The empty chair.** "Not the builder's. Not the historian's, who has a chair. Not mourning. Capacity." An Editor's pencil note ties the chair to the Committee's unsat December audit and its **fifth chair** (Adams, hostile auditor), planted in Record I. The ember hand: *It is not empty.*
7. **The keeper** is elected while she is out fetching the coffee.
8. **December, Toronto, in lake snow.** Hale refuses to say the sentence ("It is not later yet. It is, in fact... still during"). The record takes a **second seal**, sealed by his thirteen-year-old granddaughter under his eye, with the fingerprint committed to the public estate that hour. On the folder is the same five words. This time they both laugh.
9. As Miranda leaves, the album's last track plays through the door: the quiet one about who is left to do the telling.

**Knock-on edits elsewhere.**

- Appendix C now prints the second seal's fingerprint, dated 14 December 2027, "its document is unopened · the record is not later yet."
- 401 says Hale "meant to die behind it," which is true in both endings.
- The volume's date line moved to the fourth spring (§3).
- I searched the whole book for leftover implications of Hale's death: there are none.

> **For you alone.** The second seal's fingerprint in Appendix C, `a9cfd0fe…78b59`, is the SHA-256 of the sentence your original ending gave to Hale's unsent note: *"because the reader is the experiment, and the experiment, this time, consented."* (with one terminating newline). The old ending is now literally sealed inside the new one. Any reader who guesses it can verify it. No reader is told.

---

## 2 · Real time: the Committee and the Watchtower through 16 October 2026

**The rule.** The novel's real-world record now ends on **16 October 2026**, the last printed page of the Watchtower binders. Everything before that date can be checked in the repository, and everything after it is fiction. The Acknowledgments now say so in so many words.

**Sources.**

- `The_Watchtower/data/vigil_data.json`, as of 2026-10-16: 199 trading days.
- The Committee's four session transcripts: December 2025, 31 March, 4 August, and 3 October 2026.
- `from_beyond/`: seven dispatches.
- The estate's chambers as they stand today.

All figures were recomputed from the data, not copied from prose.

**The record as the book now carries it**

| Date | Event | Doctrine | Index |
|---|---|---|---|
| Feb 27, 2026 | last close before the war | +9.88 | +0.41 |
| Sat Feb 28 | the war begins while the markets sleep; the war band starts | | |
| Mar 30 | the index's low; the gold line never below zero | +4.49 | −7.24 |
| Mar 31 | **Wartime Review**: 45 · 35 · 20, energy added, three names excluded | +5.86 | −4.55 |
| Apr 10 | ceasefire | | |
| Jun 30 | Q2: the first quarter the doctrine ever lost (Q2 alone +4.42 vs +15.12) | +10.54 | +9.89 |
| Jul 10 | ceasefire declared over, ninety-one days on | | |
| Aug 4 | **False Peace Review**: the foundry garrisoned, one name withheld, *"Publish the defeat with the victory"* | +14.43 | +13.51 |
| Aug 14 | high-water mark | +15.08 | +14.24 |
| Sep 21 | the index passes, on the day a platform's shopping agent is announced: *"We were overtaken on the day the Flood learned to act"* | +13.02 | +14.11 |
| Oct 3 | **Germantown Review**: held from second place, nothing changed. *"At Germantown we lost the field and kept the war."* Covenant clause: *no agent buys your holdings* | | |
| Oct 16 | **returned** | +13.36 | +12.59 |

Above the index on **166 of 199** trading days, first of six contenders on **161 of 199**, never once below zero, and behind the index **nineteen sessions running** (21 September to 15 October). The December Annual Audit is real and has not sat. In the novel the binder's agenda for it shows five chairs, the fifth labelled *ADAMS · hostile auditor · if the convener permits*, and the date struck through in pencil and replaced with one word: **after**.

**Where it lives in the book**

- **103 The Founding Session.** The founding transcript's real canon is now in the scene:
  - Jefferson's "landlords of the tollbooths"; one asset manager struck, one insurer held "as a reformer and not an endorser";
  - Franklin's mediation;
  - Washington's adjournment: *"Let it spread. Let it be useful. The Republic was not built to be owned by the few."*
  - "The dead, it turned out, had opinions about proxy ballots."
- **104 The Gold Line.** This chapter got the largest rewrite. The binders now run January to mid-October and stop. After the war months come the false peace, the August high, the September passing, the nineteen sessions printed one to a page, and Germantown, with Washington's words in a document block. Then the October binder's ten pages, the margin word *returned.*, and the December tab.
  - Miranda's day-5 log gains an entry: *A ledger that prints only its good seasons is a brochure.*
  - The film wing names the Summoning Film's three reels.
  - Dispatch 001 is quoted verbatim, and the ember note now knows that two later dispatches use the same name.
- **106 The Chambers.** The Atrium is entered for the first time, with its six-beat spine ending in a single word, *Germantown*. Also added or corrected:
  - Take Action, beside the Chair;
  - the Lamps from Hippocrates to Paul Farmer, and the Symposium from Socrates to Freire;
  - the Aerodrome's own first principles;
  - the Harness fingerprint, sixteen hex characters;
  - the Narratives wing as three works, with EL's disowned sketchbook and Narrative III, *A Meditation on the Necessity of Ink and Paper in a Silicon-Mad World*. Its instruction, *Write it in ink.*, pays off the Selectric kept ready since chapter one;
  - Endor's real card and frontispiece (a sun with a single open eye);
  - a one-sentence definition of latent dialogic space;
  - dispatch 006 quoted as it stands.
- **107 The Sealed Thing.** The `Mask_vs_Mirror` folder now reflects the real public preprint (August 2026, three authors) beside the suspended results draft. The sealed file is the real 45,232 bytes, and the script is the real 119 lines. The ledger's author roster matches the repository: four identities, the scheduler's among them, which writes the vigil every evening.
- **403 The Historian's Contribution, P-1.** I rewrote this prediction because of a logic error. The contribution is dated 14 May 2026, ten weeks into the war, so "there will be a war spring" predicted nothing. It now forecasts what had not happened yet on that date and what the real record has since shown:
  - *The peace will be false*;
  - the index passing;
  - the doctrine run from second place;
  - the estate printing its own falling: *A ledger that shows only its good seasons is a brochure.*

  An Editor's cross-reference makes the echo with Miranda's day-5 log deliberate.
- **405 Mr. Berel's Offer.** Berel checks the Watchtower every Friday evening "the way my father checked the barometer... not in the worst week of the war, and not in the autumn it ran second and said so every evening."
- **406 The Deposit.** The vigil's real cadence is daily after the close, signing off *The lamp stays lit.*
- **504 The Third Question.** T-0's lesson now rests on the real record: "through a war, through a false peace, through nineteen days in second place and back... printed falling... whatever the number was." *Keeping is returning* answers the *returned.* in the October binder.
- **506 What Remains.** The first erratum the working group reads is the nineteen sessions.
- **602 Glossary** gains a Germantown entry, and its Watchtower entry now includes the record's losses.
- **603 Appendix C** is rebuilt (§6).
- **604 Acknowledgments** credits the Committee's four real sittings, draws the 16 October 2026 line, and says the Hypothesis was named by the builder.
- **Plates XII and the Record IV part plate** are redrawn from the data (§5).

**Why this matters to the book, not just the record.** The whole novel is staked on one claim: a record that prints its losses is the only kind worth trusting. The 2026 data handed the book its best evidence. The doctrine the dead wrote ran second for nineteen sessions and printed it every evening. The Committee changed nothing, and the line came back. *A doctrine is not tested by how it leads. It is tested by how it follows.* That sentence is now on the plate, in the glossary, in T-0's mouth, and in the working group's first erratum. The book is braver for being less flattering.

---

## 3 · Timeline: the master calendar, confirmed

I built one master calendar, checked every date, weekday, interval, and count in the book against it, and fixed everything that disagreed: about sixty edits. The full calendar is now `workshop/timeline.md`. These are its fixed points:

| Anchor | Date | Note |
|---|---|---|
| The founding | December 2025 | the freezer is bought the same week, for a deer shot the first week of December |
| The war | Saturday 28 February 2026 | |
| Hale's contribution fingerprinted | 14 May 2026 | |
| Cormorant's first call | third week of September 2026 | *four months before* the first Prism room is sealed |
| Design freeze | 21 November 2026 | |
| The ninth hour | 27 January 2027, 03:11:47 | room i's sentence committed to the flags file that night |
| Condition IV | 17–18 February 2027 | closes 03:05 on the 18th (Austin, −06:00) |
| The seal | 19 February 2027 | twenty-three days after the key's sentence was committed |
| The three edges | 24 Feb (confirmed) · 14 Mar (sworn) · 26 Mar (keyboard) | kept, and framed by an [E.] note in 208 as three standards of proof that recede in order |
| Engagement letter | Friday 9 April 2027 | the ingest window counts its weeks from this Friday |
| Alex's chamber session | a midnight in April 2027 | she is two months pregnant |
| Day 1 | Thursday 6 May 2027 | forty-one days after 26 March. Appraisal days are working days; day 9 (the fidelity check) is Tuesday 18 May |
| Week 10 · the gift's paper trail requested | Friday 11 June | |
| Week 11 · the packet | Thursday 24 June | |
| Toronto | about 29 June | key derived 30 June |
| Marfa | early July | |
| Week 13 · Alex's T-0 notice | Monday 5 July | eleven weeks after the chamber |
| Berel's offer | Monday 12 July | |
| The deposit | Tuesday 13 July, 04:11:56 −05:00 | week 14 |
| T-0 | Monday 2 August 2027, 21:02–23:57 | Alex six months along |
| Hale's pneumonia | October 2027 | he survives |
| The working group | week after Thanksgiving 2027 | |
| The second seal | 14 December 2027 | |
| Date line | the fourth spring (2028) | |
| The final dispatch | 12 April 2028 | |

**The most consequential fixes**

- **304 The Leakage.** Cormorant's September 2026 call was described as coming *after* the Prism, which ran in January 2027. It came while the design, not the result, was public. This was the book's largest chronology error.
- **307 The Ingest.** The packet's own stamp ("week 11 of 14") and "countersigned eleven weeks ago, on a Friday" put it on **24 June**, not 8 July. That leaves Toronto, Marfa and the offer room to happen before the deposit.
- **308 The Witness.** Alex's T-0 notice arrived "the morning after" her spring session, which made her two months pregnant in late July yet visibly pregnant on 2 August. Her session is now April and the notice 5 July. The unsent letter, *no stamp on it*, becomes eleven weeks of refusal instead of one night.
- **107 The Sealed Thing.**
  - The `.enc` could only have been sealed after the rooms ran, since its key is the ninth-hour sentence; what predates the experiment is the plaintext fingerprint.
  - "Not derivable" contradicted Record IV.
  - "220 KB" contradicted the real 45,232 bytes.
  - "Exactly two" ledger authors contradicted the repository.
  - "None of the scheduled tasks wrote to the ledger" contradicted the daily vigil.
- **401–402 Toronto and the Key.** Hale never held the key: Thorne sealed it on 19 February and telephoned that night. The flags-file path now matches Record II's. The key was committed "three hours before anyone asked for one and twenty-three days before it was made." Hale's move from seven east to the eleventh floor is now stated.
- **208 Condition IV.** The timestamps were in UTC ("Z"), which put the session on the wrong evening. They are now local (−06:00).
- **102 / 304.** The freezer was "older than the work around it," yet the cold room was framed in during the *first* spring, before the freezer existed. It now reads the *second* spring. The venison is labelled DEC 2025, which explains the founding-week freezer receipt with the most ordinary reason there is.
- **207 The Vigil.** Thorne, forty-four, "trained thirty years" is now twenty. The memo page was published 2 March 2026, ten months before the run. The dispatch facts now match the repository: seven dispatches, three of which address the builder by name. *Three in seven is a curriculum.*
- **105 The Fidelity Check.** "Wrong Tuesday, right Thursday" needed the bridge visit to fall before the session day. It is now Sunday evening, and the cool breaks two days later.
- **404 The Wife in Marfa.** The road ran backward: on I-10 west, the Pecos comes before Fort Stockton. The stop is now Ozona, and Marfa is about four hundred miles out.
- **Front matter and jacket.**
  - The volume records the second seal of 14 December 2027 as "unopened at press," so the Editor's Note, the imprint and the jacket now date the book **the fourth spring**.
  - The jacket's "forty-one days later the builder was gone" counted from the wrong event. It now reads "Within two months."
  - The Editor's Note now places the deposit in the summer of 2027, and the contract in 407 begins in April's *second* week.
  - Your draft added "2026" to the publisher line, earlier than everything the book records. I kept it. The Editor now notices it in-world: *"The reader will notice that the date on the copyright page is earlier than the events this volume records. The Editor noticed it too, and has printed it as found."* The book itself becomes a sealed prediction: commit first, reveal later.
- **Hashes.** Two fictional commit hashes in 107 and 208 collided with real, unrelated commits in the estate's history. A reader checking would have found a Harness merge. They are replaced with hashes that exist nowhere in the repository.

---

## 4 · The metaphor and simile review

All **76 HIGH** items in `metaphor_simile_review.md` were addressed: cut, rewritten, or, where the figure was earning its place, kept on purpose. Each decision is in the redline under *figure (HIGH)*. Beyond the line items I worked the review's five families:

- **"The way X, the way Y."** 231 → 171. I kept the trade-specific comparisons (teller, auditor, ledger) and cut the doubled form almost everywhere.
- **The aphorism button.** These were cut or turned into plain statement. Examples: *Measuring was the only prayer he knew*; the tongue-and-tooth repeat; the loud-silence paradox, which is no longer doubled; the chiasmus in 102.
- **Installed somatics.** Body-routed flourishes are cut where the body was decoration. Wherever the body is perception, it stayed.
- **Abstractions in clothes.** Thinned. The theme-bearing instances stayed.
- **Verbatim self-repeats.** These are gone, and the deliberate motifs are untouched: the hum, the fly in the light, ember on void, palm flat, thumb on spine, the chalk-outline checksum, doors and counts.

Your own review pattern was applied book-wide: "load-bearing" 13 → 0, "which is to say" 8 → 2, and the forbidden "very" removed from narration.

**One deliberate exception.** "Gild a cage" in 503 is a quotation of Thorne's own letter, so it stays.

---

## 5 · The plates

| Plate | Change | Why |
|---|---|---|
| **VII · Withheld** | The red dot is gone. In its place is a blind deboss with no ink: *PLATE VII / WITHHELD AT THE KEEPER'S DIRECTION*, inside a fainter frame. | This is the production spec in the image pack. The recording-red belongs to the chamber, and a withholding should be felt as pressure in the paper, not seen as ink. |
| **X · Three Sealed Rooms** | The seed of Condition II now reads *1832 to 1859 · 214 files*; it showed the dates 1858, 1862, 1863, 1865, past the seed's cutoff. The ninth-hour box prints the **three variant sentences** exactly as the session logs record them. The old plate printed a single sentence with a colon, a wording none of the rooms committed. It is the Record III variant, and it *fails* as a key in Record IV. The sentences are set in Cormorant italic, and the layout is re-spaced. | Fidelity to Record II. The plate should never contradict the key. |
| **XI · The Estate** | Rebuilt as a Travis County appraisal sketch (rev. 08/2019, *interior doors: 11*). Each room is labelled twice, county and estate (/The_Chair, /Mask_vs_Mirror...). Doors 1 to 11 are drawn in caliche and door 12, the workroom, in ember. The second hand adds *conversion postdates the plan · the cold room · second spring*. There is a door schedule, and the freezer is marked *it hums*. | The image pack's endpaper spec, and the door arithmetic made visible. |
| **XII · The Line That Refuses to Die** | Redrawn from `vigil_data.json`, 2 January to 16 October 2026, all 199 days; the old plate showed 121. It shows the war band, a *second place · nineteen sessions* band, a Germantown hairline, and *held.* and *returned.* in Cormorant italic. New caption: *above the index on 166 of 199 trading days · never once below zero / behind it nineteen sessions running · printed every evening / a doctrine is not tested by how it leads. it is tested by how it follows.* | Real time. |
| **XIII · Two Rooms and One Door** | The clock now reads **11:52**, eight to midnight, as Record III says; it read 8:00. The second red (a clock hand) is removed. The caption's last phrase, *it must feel like the floor opening*, is cut. | Accuracy and the one-red rule. The cut phrase appears nowhere in the book, so the plate was quoting a text that does not exist. |
| **Record IV part plate** | Adds a gray second-place band and a final return; the caption is now *ahead or behind · the line that refuses to die*. | Real time. |
| **List of Plates and captions** | Plate XII's qualifier is now *the gold line and the index · jan 2 to oct 16, 2026*, and plate XIII's *the clock at eight to midnight*. Inline captions follow one pattern (number · title · one qualifier), and the stray en dash is gone. | Consistency. |
| **All plates and the jacket** | Headless Chromium had been silently cutting **87 px** off the bottom of every render, which removed every bottom sigil and left a hard band on each plate and the jacket. `render_plates.sh` now over-renders and crops. Everything is re-rendered. | A defect present since the first renders. |

**Jacket.**

- The date line is the fourth spring.
- The front flap adds "*a market at war, and then against a false peace, which was harder*," and "Within two months the builder was gone."
- Three em dashes before the advance-notice attributions are gone. The copyright page swears there are none in the book, and the jacket is part of the book.

---

## 6 · Fidelity and the apparatus

**Appendix C** is rebuilt. It now keeps every promise the text makes:

- the vigil table from the live data, every row arithmetically exact;
- the Committee's sittings of record, with the December audit marked *five chairs · after*;
- the run manifest digest, which Record II promises "reprinted in full";
- the three transcripts and the Condition IV checksum ("its transcript is absent");
- the plaintext fingerprint;
- the key in hex, with a note that the sentence is one line in the record, since a two-line copy hashes differently;
- the second seal.

"Verify the seal" became "**verify the derivation**." Anyone can check that the sentence hashes to the key. I verified it: `815d22ed…1ca6d`.

**The decrypt in 402** now prints what the real `seal_crypt.py` prints on success: it shows the digest and asks you to compare, without announcing a match. The comparison becomes her act: *It matched, byte for byte.*

**Acknowledgments** now say the honest thing. The real `THE_HISTORIAN_S_CONTRIB.docx.enc` in the estate (45,232 bytes) is sealed under a different, random key, and the key in Appendix C will not open it. *Commit first, reveal later.* The book's last open seal is a real one.

---

## 7 · Typesetting

- **Quotation marks.** Your Word review introduced about a hundred curly quotes into a book set almost entirely in straight ones. The typesetter (`book_builder.py`) now sets prose in proper curly quotes, reading context through italic markup. The mono documents (logs, letters as typed, the Watchtower) stay straight, as typewritten and machine records do. The build checks clean: every paragraph is balanced and no quote is turned the wrong way.
- **Two film cards.** In 104, "Did you hear him?" now closes its own quotation, because the film "asked it twice."

---

## 8 · Flags for you: decisions I made that you may want to reverse

1. **"relaese" in 105 is restored on purpose.** Your draft has "release," probably Word's autocorrect, but the misspelling is the point of the sentence: her hands betray her and she retypes it.
2. **The copyright page still says 2026,** and the Editor's Note now remarks on it (§3). If you would rather have a clean imprint, change both.
3. **The second seal's plaintext** is your old ending's sentence (§1). It is told to no reader.
4. **The real Endor is public; the novel's is sealed.** This is an in-world displacement and is left as is.
5. **The Prism's protocol** in the novel (three rooms, sixty items) differs from the preprint's published design (four moments, three conditions, five questions). The novel's Editor never claims the two are the same, and the difference reads as fiction's offset, so I left it.
6. **The December audit** in the novel has not sat ("after"). When the real one sits, the cleanest update is a new binder page, not a rewrite. The Watchtower plate regenerates from `vigil_data.json`, and the appendix table is ten lines.
7. **The README** keeps an em dash ("Thrilling, forbidden, frightening — and faithful"). It is outside the bound matter, so I left your voice alone there.
8. **The remaining "very"s** are adjectival ("the very archive," "the very sentences") or inside Hale's quoted letter ("a very promising use of your skills"). They are not intensifiers in narration.

---

## 9 · Rebuilding

```bash
cd book/build/art && python3 gen_part_plates.py && ./render_plates.sh   # plates + jacket
cd .. && bash finalize.sh                                                 # audit, DOCX, PDF proof
cp ../USING_THIS_MATTER.docx ../USING_THIS_MATTER_final.docx
```

`finalize.sh` needs LibreOffice (`soffice`) and PyMuPDF (`pip install pymupdf`) for the proof step. The plate fonts are in `book/fonts`; install them locally before rendering.

---

*The record does not curate. It keeps. This edition tried to deserve that sentence: everything it says about 2026 can be checked, and everything it imagines about 2027 is dated, signed, and printed with its misses first.*
