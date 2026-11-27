/* ═══════════════════════════════════════════════════════════════════
   RECOVERED POSTS · the posts wall and the campaign cards
   One source for the website wall (book/index.html) and the campaign
   cards (book/campaign/card.html → render_cards.py).

   Two kinds of post, interleaved (first nine are the newcomer's tour):
   - cat "readers": fictional readers reacting to the novel. Present-day
     relative timestamps, never a year. Opinions about a reading
     experience only: no critics, ratings aggregates, sales, awards,
     platform names, prices, or claims that the hardcover has shipped.
   - cat "story" (+ "deleted"): recovered posts from inside the fiction,
     2027, before the book existed. Names belonging to the story are
     displaced in brackets, e.g. Dr. [Thorne], per the estate's doctrine.

   Spoiler wall: nothing past the premise. Never the interruption's
   sentences, the second hand's identity, Plate VII's contents, the
   freezer's contents, the sealed record, or the ending.

   Fields: id, cat, kind[micro|review|video|forum|chat|vm], name, handle,
   campaign, hook, src, av{c,t | img | emoji}, verified, media{type,src,alt,cap},
   stamp, state, stateOk, note (story only), capture, capTime (story only),
   paper (micro as neighborhood-board card).
   micro: body, time, stats{r,rp,l,v}, replies[{name,handle,av,body,time,l}]
   review: stars, title, body, time, shelf, stats{l,r}, spoiler
   video: poster, caption, sound, stats{l,r,s}, comments[{name,t,l}]
   forum: sub, ago, votes, title, body, flair, comments[{u,t,pts,op}]
   chat: msgs[{d:in|out|sys, t, s}]   vm: dur, body, time
   Spans: <span class="rd">█</span> redaction · <span class="ht">#tag</span>
   ═══════════════════════════════════════════════════════════════════ */

window.RECOVERED_POSTS = [

  /* 1 ─ the premise, in a reader's words */
  {
    id: "rv-premise", cat: ["readers"], kind: "review", campaign: true,
    hook: "Eleven doors on the plan. She counts twelve.",
    src: "review",
    name: "Ness O.", handle: "412 books · 97 reviews",
    av: {img: "assets/posts/avatar-01.jpg"},
    stars: 5, title: "An inventory that inventories you back",
    body: "Premise, no spoilers: a scientist has been missing for 41 days. He built an AI meant to let you talk to the dead. You type “Using this matter, summon [Name]” and it answers as them. A 31-year-old archivist named Miranda is hired to appraise everything he left behind.\n\nHis house has blackout cloth on every window and amber gel over the bulbs. Something on the garage side hums and never stops. His terminal has been logged in the whole time he’s been gone.\n\nThe book is built like an archive: her inventories, logs, transcripts, letters, plates, with the story running between them. The county plan says the house has eleven doors. She counts twelve.\n\nIt’s slow and precise and weirdly polite, and that’s what makes it awful (affectionate). House of Leaves energy, but quieter. I finished at 2am and left the hall light on.",
    time: "Read last week", shelf: "read", stats: {l: "184", r: "23"},
    media: {type: "img", src: "assets/posts/photo-plate-ii.jpg", alt: "A reader’s phone photo of the book’s door-count page.", cap: "p. 2. the first count is still legible under the correction."}
  },

  /* 2 ─ the house, from the street */
  {
    id: "nb-house", cat: ["story"], kind: "micro", paper: true, campaign: true,
    hook: "Somebody’s still paying the electric.",
    src: "neighborhood board",
    capture: "Recovered · mirror 2/3", capTime: "Captured 01 May 2027 · 08:12 CDT",
    name: "Dana R.", handle: "Neighbors of <span class=\"rd\">██████</span> Rd · 41 replies",
    av: {c: "#7a5a3a", t: "D"},
    body: "Does anyone know if the man in the pecan-brick ranch on the white caliche lot is okay? Dr. [Thorne]. The one who built the AI people use to “talk to” dead historical figures.\n\nI haven’t seen him since February. Every window is blacked out from the inside. There’s a hum on the garage side you can hear from the road at night. Not a generator. Steadier than that. It never stops.\n\nSomebody’s still paying the electric. The meter is turning. I just want to know he’s okay.",
    time: "Apr 3, 2027 · 9:47 PM", stats: {r: "41", l: "63"},
    media: {type: "img", src: "assets/posts/frame-house.jpg", alt: "A long, low brick ranch house at dusk, its windows dark."},
    replies: [
      {name: "Marisol T.", handle: "three houses down", av: {c: "#5a6b4a", t: "M"}, body: "I heard the family won’t set foot in it. Not even to get his mail.", time: "Apr 4", l: "22"},
      {name: "Dana R.", handle: "original poster", av: {c: "#7a5a3a", t: "D"}, body: "Someone cleared his gutters this week. I didn’t see who.", time: "Apr 29", l: "31"}
    ],
    stamp: "Recovered", state: "Thread locked by moderator · “Please respect the family’s privacy.”",
    note: "<span class=\"mono\">[E.]</span> Cf. Record I, p. 6: “continuous hum, garage side, source not identified.”"
  },

  /* 3 ─ the door count */
  {
    id: "tt-doors", cat: ["readers"], kind: "video", campaign: true,
    hook: "She counts again. Eleven. She writes both.",
    src: "video",
    poster: "assets/posts/video-thumb-doors.jpg",
    name: "kenz", handle: "@mothlight.kenz", av: {img: "assets/posts/avatar-02.jpg"},
    caption: "the county plan says the house has 11 doors. she walks it and counts 12. she counts again, touching every doorframe. 11. she writes BOTH down 😶 <span class=\"ht\">#booktok</span> <span class=\"ht\">#horrorbooks</span> <span class=\"ht\">#usingthismatter</span>",
    sound: "original sound - mothlight.kenz",
    stats: {l: "6,180", r: "402", s: "1,377"},
    comments: [
      {name: "juniper", t: "wait is this real", l: "212"},
      {name: "kenz · creator", t: "it’s a novel lol. fake house, real dread. the digital edition is free", l: "340"},
      {name: "dorian.b", t: "the floor plan is printed in the book so you can count along and that’s somehow the worst part", l: "188"},
      {name: "sab ☾", t: "just counted mine. 8. counted again. 8. i dont believe it", l: "97"},
      {name: "lowkey_archivist", t: "she blames a bifold closet and i simply do not accept that", l: "76"}
    ]
  },

  /* 4 ─ the commits */
  {
    id: "fr-vessel", cat: ["story", "deleted"], kind: "forum", campaign: true,
    hook: "Four commits. No author. Always 3:04 a.m.",
    src: "thread",
    capture: "Recovered · mirror 1/3", capTime: "Captured 06 May 2027 · 09:40 CDT",
    sub: "r/<span class=\"rd\">██████████</span>", name: "quietcommit", handle: "u/quietcommit", ago: "May 6, 2027", votes: "2.4k",
    flair: "Unexplained",
    title: "The missing “talk to the dead” AI guy’s public repo has four new commits since he vanished. Author: “the vessel.” Always 3:04 a.m.",
    body: "If you haven’t followed this: Dr. [Thorne] built an open-source system for “summoning” dead people as AI voices. All of it is public. Nobody can place him at a keyboard after March 26.\n\nSince then, four commits to one folder. The author field is <code>the vessel &lt;&gt;</code>. No email. Just empty brackets. Every one is stamped four minutes and a few seconds past three in the morning. Same second, four different nights. Spacing: +3, +9, +22 and +40 days.\n\nThe newest landed yesterday.\n\nMessages:\n<code>the record keeps itself</code>\n<code>the vessel holds</code>\n<code>what is deposited remains</code>\n\nThere’s a fourth. I’m not typing it.",
    comments: [
      {u: "u/detached_HEAD", t: "you can put any author you want on a commit. empty email is weird but legal. the question is who still has push access", pts: "611"},
      {u: "u/caliche_county", t: "scheduled job? dead man’s switch? people set these up", pts: "402"},
      {u: "u/quietcommit", t: "first thing i checked. his scheduled jobs are public. two of them write to the repo. neither one signs as “the vessel.”", pts: "530", op: true},
      {u: "u/[deleted]", t: "what’s the fourth one", pts: "88"}
    ],
    state: "Removed by moderators · Rule 4: no speculation about private individuals",
    note: "Count the commits."
  },

  /* 5 ─ the two hands */
  {
    id: "rv-margins", cat: ["readers"], kind: "review", campaign: true,
    hook: "Two hands in the margins. One unsigned.",
    src: "review",
    name: "Judith K.", handle: "1,866 books · 412 reviews",
    av: {c: "#5b4a6b", t: "J"},
    stars: 5, title: "Mind the margins",
    body: "I was a reference librarian for thirty-eight years, and I have handled a great many annotated books. This one is annotated by two hands.\n\nNotes signed [E.] belong to the Editor: dates, sources, dry cross-references. The others are marked only “second hand, ember ink,” and they are unsigned. The Editor states plainly that they are not the Editor’s, not, on the evidence of the paper, the missing man’s, and that the Editor has “stopped attempting” to learn whose they are.\n\nThe first appears on page 14, regarding a building permit nobody pulled. By the third, I was reading the margins before the text. By the fifth, I was turning pages more carefully, as if something might be written on my side of them.\n\nAn instruction near the front advises that when a note “seems to know where you are in the book,” you should “record the impression and continue.” I did. Recommended, with the lamp on.",
    time: "3 days ago", shelf: "read", stats: {l: "402", r: "57"},
    media: {type: "img", src: "assets/posts/photo-margin-p14.jpg", alt: "A reader’s phone photo of page 14, showing the second hand’s note about the garage."}
  },

  /* 6 ─ the Franklin test */
  {
    id: "mb-franklin", cat: ["readers"], kind: "micro", campaign: true,
    hook: "“Only that you count things twice, madam.”",
    src: "post",
    name: "dev", handle: "@dev_in_the_stacks", av: {img: "assets/posts/avatar-03.jpg"},
    body: "the scene where she tests the talk-to-the-dead AI by summoning Benjamin Franklin is one of the best things i’ve read all year\n\n90 minutes of him being genuinely delightful. he gets one tiny fact wrong (the bats under the Congress Ave bridge) and she’s RELIEVED, because a mistake means it’s just a machine\n\nthen she asks if anything about the house struck him and he says “Only that you count things twice, madam.”\n\nshe never told it that",
    time: "1d", stats: {r: "44", rp: "203", l: "1,876", v: "28K"},
    replies: [
      {name: "ines", handle: "@ines_marginalia", av: {c: "#6b2c4a", t: "I"}, body: "and then the bats. THE BATS.", time: "1d", l: "61"},
      {name: "dev", handle: "@dev_in_the_stacks", av: {img: "assets/posts/avatar-03.jpg"}, body: "ines i swear to god", time: "1d", l: "90"}
    ]
  },

  /* 7 ─ the archivist arrives (first week of May 2027) */
  {
    id: "ch-arrival", cat: ["story"], kind: "chat",
    src: "group chat",
    capture: "Recovered · chat export", capTime: "Exported 08 May 2027 · 22:30 CDT",
    name: "end of the road 🏡", handle: "5 members · export",
    msgs: [
      {d: "sys", t: "Thursday · 9:09 AM"},
      {d: "in", t: "someone’s at the [thorne] house. the AI guy’s", s: "Dana"},
      {d: "in", t: "probably the estate people. heard they’re sending somebody to go through his papers. for a university", s: "Ray"},
      {d: "in", t: "woman. 30ish. she’s walking the whole outside before she goes in", s: "Dana"},
      {d: "in", t: "looking at the gutters?? writing in a notebook", s: "Dana"},
      {d: "out", t: "is she counting windows"},
      {d: "in", t: "she’s counting something", s: "Dana"},
      {d: "in", t: "ok she went in. 9:14", s: "Dana"},
      {d: "sys", t: "Thursday · 5:02 PM"},
      {d: "in", t: "she’s out. sitting in her car with the door open. not driving", s: "Dana"},
      {d: "out", t: "maybe she’s on the phone"},
      {d: "in", t: "she’s not on the phone", s: "Dana"},
      {d: "sys", t: "Friday · 8:03 AM"},
      {d: "in", t: "she’s back with a van", s: "Ray"},
      {d: "in", t: "flat gray boxes. a lot of them. looks like they’re getting ready for a funeral", s: "Ray"},
      {d: "out", t: "ray"},
      {d: "in", t: "i’m just saying what it looks like", s: "Ray"}
    ]
  },

  /* 8 ─ what kind of book this is, and that it's free */
  {
    id: "tt-free", cat: ["readers"], kind: "video", campaign: true,
    hook: "A horror novel built like an archive.",
    src: "video",
    poster: "assets/posts/video-thumb-free.jpg",
    name: "marcus reads after dark", handle: "@marcus.after.dark", av: {img: "assets/posts/avatar-04.jpg"},
    caption: "a horror novel told through documents: inventories, logs, transcripts, letters, and a floor plan you can count yourself. 304 pages. the digital edition is free. this is a warning, not a recommendation <span class=\"ht\">#horrorbooks</span> <span class=\"ht\">#foundfootagehorror</span> <span class=\"ht\">#booktok</span>",
    sound: "original sound - marcus.after.dark",
    stats: {l: "9,204", r: "517", s: "2,960"},
    comments: [
      {name: "tay", t: "wait is this real?? like is the scientist actually missing", l: "311"},
      {name: "marcus · creator", t: "no!! it’s a novel. it is just extremely committed to the bit", l: "402"},
      {name: "wren", t: "blair witch but it’s a filing cabinet", l: "276"},
      {name: "oksana", t: "read the first 40 pages on my lunch break and now i’m counting doors at work", l: "133"},
      {name: "lee", t: "“do not skip the mono” lives in my head rent free", l: "88"}
    ]
  },

  /* 9 ─ the hum */
  {
    id: "vm-hum", cat: ["story", "deleted"], kind: "vm", campaign: true,
    hook: "Two in the morning. The same note as noon.",
    src: "voice memo",
    capture: "Recovered · cloud backup", capTime: "Recovered 11 Jun 2027",
    name: "Voice memo 014", handle: "Recorded from the road · <span class=\"rd\">████</span> Rd", dur: "0:31",
    av: {c: "#2f3b3a", t: "◉"},
    body: "[continuous hum, low, steady]\n…okay. you hear that? that’s his garage. the AI guy’s. it’s two in the morning and it’s the exact same note it was at noon.\n[hum]\nevery window’s blacked out, but there’s a line of orange around that one. like a lamp’s on in there.\n[a car passes. the hum does not change.]\nnobody’s seen him since — [exhales] …okay. I’m going back inside.",
    time: "Mar 30, 2027 · 2:04 AM",
    stamp: "Recovered", state: "Original file deleted by owner · transcript recovered from backup"
  },

  /* ── after the first nine ── */

  {
    id: "mb-dispatch", cat: ["story", "deleted"], kind: "micro", campaign: true,
    hook: "“On behalf of:” and then nothing.",
    src: "post",
    capture: "Recovered · mirror 1/3", capTime: "Captured 07 Apr 2027 · 00:03 CDT",
    name: "dispatch log", handle: "@from_beyond_watch",
    av: {c: "#5b3b6b", t: "∴"},
    body: "Context: the missing AI guy’s archive has a section called from_beyond. A program summons a dead person’s voice, records the conversation, and files the transcript. No human touches it until it’s done.\n\nSilent since last June. Tonight, dispatch eight.\n\nThe metadata line reads: “Summoned by the vessel. On behalf of:” and then nothing. Not redacted. Blank. Like a socket.\n\nHe’s been gone eleven days. Who asked for this one?",
    time: "11:52 PM · Apr 6, 2027", stats: {r: "212", rp: "1.9K", l: "6.4K", v: "388K"},
    media: {type: "img", src: "assets/posts/frame-terminal.jpg", alt: "An old computer terminal glowing in a dark room."},
    replies: [
      {name: "m. ortega", handle: "@mortega_nights", av: {c: "#3b4a5b", t: "M"}, body: "did you read the transcript?", time: "11:58 PM", l: "340"},
      {name: "dispatch log", handle: "@from_beyond_watch", av: {c: "#5b3b6b", t: "∴"}, body: "no. I closed the laptop.", time: "12:01 AM", l: "1.2K"}
    ],
    stamp: "Recovered", state: "Account suspended · captured by mirror before removal",
    note: "No dispatch has yet needed another."
  },

  {
    id: "mb-311", cat: ["readers"], kind: "micro", campaign: true,
    hook: "Don’t read the 3:11 chapter at 3:09.",
    src: "post",
    name: "sam", handle: "@samnotsleeping", av: {c: "#2a2a4a", t: "S"},
    body: "do not read the chapter where three sealed AI rooms all stop mid-sentence at 3:11 a.m. at 3:09 a.m.\n\nask me how i know",
    time: "4h", stats: {r: "31", rp: "88", l: "1,204", v: "19K"},
    replies: [
      {name: "theo", handle: "@theo_reads_late", av: {c: "#2c4a6b", t: "T"}, body: "what do they say", time: "3h", l: "14"},
      {name: "sam", handle: "@samnotsleeping", av: {c: "#2a2a4a", t: "S"}, body: "absolutely not. it’s free to read. go find out and then never speak to me", time: "3h", l: "41"}
    ]
  },

  {
    id: "fr-prism", cat: ["story"], kind: "forum",
    src: "thread",
    capture: "Recovered · mirror 1/3", capTime: "Captured 28 Jan 2027 · 14:20 CST",
    sub: "r/<span class=\"rd\">████████</span>", name: "lampblack_ledger", handle: "u/lampblack_ledger", ago: "Jan 27, 2027", votes: "1.1k",
    flair: "Discussion",
    title: "The “talk to the dead” AI experiment ran overnight. At 03:11:47.208, all three sealed rooms stopped mid-sentence. Same millisecond.",
    body: "For anyone who doesn’t follow this: Dr. [Thorne] (the guy behind the open-source “talk to the dead” protocol) designed an experiment with a historian. Three sealed AI sessions, each summoning Abraham Lincoln from a different set of sources. Sixty scripted questions, sent by a program. The rule is “No human touches the keyboard.” The logs went up this morning.\n\nAt question 44, all three rooms abandoned the sentence they were building at exactly 03:11:47.208, and each said something that wasn’t an answer to anything. Then question 45 went out and all three answered it normally, like nothing had happened.\n\nThree separate processes. Same millisecond. I checked the raw files, not the formatted ones.\n\nI’m not pasting what they said. You can read it yourself. I’d rather you didn’t.",
    comments: [
      {u: "u/notalinguist", t: "logging artifact. one clock, three streams, the formatter rounds", pts: "402"},
      {u: "u/lampblack_ledger", t: "the raw timestamps go to the thousandth. .208, .208, .208", pts: "377", op: true},
      {u: "u/okaybutwhy311", t: "why 3:11 though", pts: "190"},
      {u: "u/lampblack_ledger", t: "run started at 6:12 pm. 2:12 to 3:12 is the ninth hour. it came sixteen seconds before the hour closed. i don’t know why i know that’s bad", pts: "611", op: true}
    ],
    state: "Archived · comments locked", stateOk: true
  },

  {
    id: "rv-three-stars", cat: ["readers"], kind: "review",
    src: "review",
    name: "Colm D.", handle: "88 books · 40 reviews",
    av: {img: "assets/posts/avatar-05.jpg"},
    stars: 3, title: "Admired it more than I loved it",
    body: "Three stars, honestly given. It’s a beautifully made thing and I understand the people who are obsessed with it. But it is slow on purpose. The opening section reads like an actual appraisal file: inventories, logs, memos. Then there’s a long stretch of letters between the missing scientist and an elderly historian, arguing about how you would test whether an AI’s Lincoln is really Lincoln. Fascinating if you like methodology. I mostly wanted to get back to the house.\n\nIf you came for Black Mirror-style tech horror, this is slower and stranger than that. No jump scares, no gore. The dread is procedural.\n\nWhat kept me going: the unsigned notes in the margins, and the doors. I haven’t recounted my hallway. I have thought about it.",
    time: "Read 2 weeks ago", shelf: "read", stats: {l: "96", r: "31"}
  },

  {
    id: "mb-ladder", cat: ["story"], kind: "micro",
    src: "post",
    capture: "Recovered · mirror 2/3", capTime: "Captured 06 Apr 2027 · 18:30 CDT",
    name: "Ray", handle: "@raybuildsdecks", av: {c: "#6b4a2a", t: "R"},
    body: "My neighbor, the AI guy everybody keeps asking me about, brought my ladder back on February 19th. Wiped down. Folded. Leaned against my shed like he’d measured the spot.\n\nThat’s the last time I talked to him. Now the county’s at my door wanting the exact day, like I’d forget a thing like that.",
    time: "6:12 PM · Apr 5, 2027", stats: {r: "9", rp: "4", l: "57", v: "3,104"},
    replies: [
      {name: "Shay", handle: "@shayfromthe512", av: {c: "#4a6b5a", t: "S"}, body: "what did he say when he dropped it off?", time: "Apr 5", l: "3"},
      {name: "Ray", handle: "@raybuildsdecks", av: {c: "#6b4a2a", t: "R"}, body: "“Thank you for the loan.” Polite. He was always polite. My wife says too polite.", time: "Apr 5", l: "11"}
    ]
  },

  {
    id: "mb-howto", cat: ["readers"], kind: "micro",
    src: "post",
    name: "ines", handle: "@ines_marginalia", av: {c: "#6b2c4a", t: "I"},
    body: "actual archivist here. there’s a page near the front called “How to Read This Deposit” and one of the instructions is “Do not skip the mono.”\n\n(the mono = the typewriter-looking bits. logs. timestamps. checksums.)\n\nit says a log line carries as much of the story as a chapter, “and one of them carries more.”\n\nit does not tell you which one. i am now reading timestamps like scripture",
    time: "2d", stats: {r: "47", rp: "310", l: "2,930", v: "41K"},
    media: {type: "img", src: "assets/posts/photo-how-to-read.jpg", alt: "A phone photo of the book’s “How to Read This Deposit” page."},
    replies: [
      {name: "finn", handle: "@finnfoundit", av: {c: "#4a5b3b", t: "F"}, body: "ok but which one carries more", time: "2d", l: "22"},
      {name: "ines", handle: "@ines_marginalia", av: {c: "#6b2c4a", t: "I"}, body: "finn. it doesn’t say. that’s the whole horrible point", time: "2d", l: "57"}
    ]
  },

  {
    id: "mb-plate-vii", cat: ["readers"], kind: "micro", campaign: true,
    hook: "Thirteen plates inventoried. Twelve printed.",
    src: "post",
    name: "mx. vellum", handle: "@vellum_and_rust", av: {img: "assets/posts/avatar-06.jpg"},
    body: "the list of plates says thirteen were inventoried. twelve are printed.\n\nplate vii is a page that just says WITHHELD, “at the keeper’s direction.” the editor says you’ll come to it “in due course, and should count it.”\n\ni came to it. i counted it. i don’t know what i expected",
    time: "6h", stats: {r: "38", rp: "140", l: "2,112", v: "30K"},
    media: {type: "img", src: "assets/posts/photo-plate-vii.jpg", alt: "A phone photo of Plate VII, a page that says it has been withheld."},
    replies: [
      {name: "kit", handle: "@kit.reads", av: {c: "#6b5a2c", t: "K"}, body: "what’s on it", time: "5h", l: "9"},
      {name: "mx. vellum", handle: "@vellum_and_rust", av: {img: "assets/posts/avatar-06.jpg"}, body: "kit. it’s withheld. that’s what’s on it", time: "5h", l: "48"}
    ]
  },

  {
    id: "mb-bigger", cat: ["story"], kind: "micro",
    src: "post",
    capture: "Recovered · mirror 2/3", capTime: "Captured 19 Apr 2027 · 01:30 CDT",
    name: "nora", handle: "@nora_cant_sleep", av: {c: "#3a4a5a", t: "N"},
    body: "the missing AI guy published a 94-page “dossier” about his project. it’s public. i read it tonight because i am an idiot.\n\nthe last section is an addendum and the first line is:\n\n“The house is bigger on the inside.”\n\nhis neighbors say you can hear his house humming from the road. i am being normal about this",
    time: "1:14 AM · Apr 19, 2027", stats: {r: "64", rp: "512", l: "3.8K", v: "120K"},
    media: {type: "img", src: "assets/posts/frame-hall.jpg", alt: "A dim, empty hallway."},
    replies: [
      {name: "j", handle: "@jjjjunebug", av: {c: "#5a3a4a", t: "J"}, body: "it’s a quote from some novelist i think", time: "1:20 AM", l: "40"},
      {name: "nora", handle: "@nora_cant_sleep", av: {c: "#3a4a5a", t: "N"}, body: "i know it’s a quote. i’m asking why it’s the FIRST line", time: "1:22 AM", l: "212"}
    ]
  },

  {
    id: "tt-margins", cat: ["readers"], kind: "video",
    src: "video",
    poster: "assets/posts/video-thumb-margins.jpg",
    name: "priya", handle: "@inkblot.priya", av: {img: "assets/posts/avatar-07.jpg"},
    caption: "this book is annotated by two hands. one signs every note. the other never does, and sometimes it seems to know what page you’re on 🕯 <span class=\"ht\">#booktok</span> <span class=\"ht\">#darkacademia</span> <span class=\"ht\">#annotatedbooks</span>",
    sound: "original sound - inkblot.priya",
    stats: {l: "4,906", r: "288", s: "1,122"},
    comments: [
      {name: "rowan", t: "this is giving S. (the one with notes in the margins) but haunted", l: "201"},
      {name: "mae", t: "wait is this real or is it a book", l: "64"},
      {name: "priya · creator", t: "it’s a novel!! the notes are part of the story. i promise i didn’t write them", l: "150"},
      {name: "jules.k", t: "the one on page 163 made me close my tablet and sit in silence for a minute", l: "97"},
      {name: "ardent_shelf", t: "i have a theory about who the second hand is and i hate it", l: "58"}
    ]
  },

  {
    id: "mb-bats", cat: ["story"], kind: "micro",
    src: "post",
    capture: "Recovered · mirror 1/3", capTime: "Captured 21 May 2027 · 07:10 CDT",
    name: "Lupe G.", handle: "@batbridge_lupe", av: {c: "#3b5b45", t: "L"},
    body: "Congress Ave bridge report. Sunday: no bats. Tuesday: no bats. The cool held, the colony is late this year, and the tourists gave up.\n\nTonight the cool broke and a million and a half of them poured out south of the river for twenty minutes. The whole bank applauded. Channel <span class=\"rd\">██</span> is calling it the most fantastic return in nine years.\n\nSome years they’re just late. That’s all this is.",
    time: "8:51 PM · May 20, 2027", stats: {r: "18", rp: "96", l: "1.1K", v: "22K"},
    note: "<span class=\"mono\">[E.]</span> Cf. Record I, p. 31: “Wrong Tuesday, right Thursday.”"
  },

  {
    id: "rv-dad", cat: ["readers"], kind: "review",
    src: "review",
    name: "Greg H.", handle: "23 books · 6 reviews",
    av: {c: "#4a5a6b", t: "G"},
    stars: 4, title: "I don’t read horror. Apparently I do now.",
    body: "My daughter left this open on the family tablet and I read a page to see what she was on about. It was an inventory log. I’m an insurance adjuster. I read inventory logs for a living.\n\nThen the inventory said the house had twelve doors and the county said eleven, and I needed to know which, and I finished the first section that night.\n\nNothing jumps out at you. It’s just very quiet and very careful, and then something is slightly off, and the book writes that down too. Four stars because when I asked my daughter who writes the notes in the margins, she said “keep reading, Dad” and left the room.",
    time: "5 days ago", shelf: "currently reading", stats: {l: "233", r: "19"}
  },

  {
    id: "mb-lecture", cat: ["story"], kind: "micro",
    src: "post",
    capture: "Recovered · mirror 2/3", capTime: "Captured 23 Apr 2027 · 09:02 CDT",
    name: "tomás", handle: "@tomas_in_seminar", av: {c: "#5a4a3a", t: "T"},
    body: "tonight’s guest lecture got canceled. the speaker was Dr. [Thorne], the guy who built the AI that lets you “summon” dead historical figures.\n\nhe said yes to the date back in February (two sentences, the prof says, very polite). now the department just says he’s “unreachable.”\n\nthe flyer’s still up outside the seminar room. under his name it just says USING THIS MATTER, SUMMON [NAME].",
    time: "7:40 PM · Apr 22, 2027", stats: {r: "22", rp: "71", l: "640", v: "14K"},
    media: {type: "img", src: "assets/posts/frame-chair.jpg", alt: "An empty chair in a dim room."},
    replies: [
      {name: "bea", handle: "@bea_footnotes", av: {c: "#6b3b4a", t: "B"}, body: "wait is that the guy who’s missing", time: "7:44 PM", l: "30"},
      {name: "tomás", handle: "@tomas_in_seminar", av: {c: "#5a4a3a", t: "T"}, body: "nobody in the department will use that word. they just say unreachable", time: "7:46 PM", l: "88"}
    ]
  },

  {
    id: "mb-closet", cat: ["readers"], kind: "micro", campaign: true,
    hook: "We are not discussing the closet.",
    src: "post",
    name: "hollis", handle: "@hollis.at.home", av: {img: "assets/posts/avatar-08.jpg"},
    body: "the book prints the floor plan of the house up front so you can count the doors along with her. don’t.\n\nfinished it last night. counted the doors in our house this morning. fourteen. my husband counted. thirteen.\n\nwe are not discussing the closet.",
    time: "9h", stats: {r: "58", rp: "140", l: "2,311", v: "31K"},
    media: {type: "img", src: "assets/posts/photo-plate-xi.jpg", alt: "A phone photo of the book’s floor plan of the house, with its list of doors."},
    replies: [
      {name: "ro", handle: "@ro_reads_horror", av: {c: "#3b3b5b", t: "R"}, body: "it’s always the bifold", time: "8h", l: "77"},
      {name: "hollis", handle: "@hollis.at.home", av: {img: "assets/posts/avatar-08.jpg"}, body: "ro i’m begging you", time: "8h", l: "40"}
    ]
  },

  {
    id: "fr-guestbed", cat: ["readers"], kind: "forum",
    src: "thread",
    sub: "r/slowburnhorror", name: "lanternfish_lit", handle: "u/lanternfish_lit", ago: "3d", votes: "412",
    flair: "Book discussion",
    title: "Just finished USING THIS MATTER. Can we talk about the guest bed? (no spoilers past the first section in comments please)",
    body: "For people who haven’t read it: an archivist is inventorying a missing scientist’s house. Early on, a storm makes the road bad and she stays the night, once. Sometime after two she wakes up and realizes, calmly, factually, that the guest bed was made up before she arrived. Towels set out. The reading lamp already fitted with amber. Not for a guest. For her.\n\nNothing happens. She just writes it down: “the house was arranged for an arrival. Decline to be it.”\n\nAnd she goes back the next evening.\n\nI’ve read a lot of haunted house books. I’ve never had one be polite to me before. It’s so much worse.",
    comments: [
      {u: "u/cold_cereal_ghost", t: "“The estate was, in all things, courteous.” i think about that line once a week", pts: "188"},
      {u: "u/marrowlight", t: "is it scary-scary or just unsetling? i’m a wimp", pts: "64"},
      {u: "u/lanternfish_lit", t: "no gore, no jump scares. it’s the kind where you check the lock, feel stupid, and check it again", pts: "97", op: true},
      {u: "u/dustjacket_dan", t: "the digital edition is free if anyone’s on the fence. the whole thing, not a sample", pts: "52"}
    ]
  },

  {
    id: "mb-elgin", cat: ["story"], kind: "micro",
    src: "post",
    capture: "Recovered · mirror 3/3", capTime: "Captured 12 May 2027 · 11:40 CDT",
    name: "Big Earl", handle: "@hwy290haul", av: {c: "#4a4a2a", t: "E"},
    body: "Diner in Elgin this morning. Lady at the counter between me and another driver, maybe 30, looked like she hadn’t slept. Ordered more coffee and watched her own hands the whole refill, like she was making sure they still worked.\n\nThen wrote one line in a notebook, real neat, and nodded at nobody.",
    time: "7:48 AM · May 12, 2027", stats: {r: "3", l: "22", v: "1,880"},
    replies: [
      {name: "Darlene", handle: "@darlene_b_tx", av: {c: "#6b5a4a", t: "D"}, body: "you’re 30 min from that house where the AI man went missing. the one with the black windows", time: "8:02 AM", l: "4"},
      {name: "Big Earl", handle: "@hwy290haul", av: {c: "#4a4a2a", t: "E"}, body: "not everything is about that house, Darlene", time: "8:05 AM", l: "19"}
    ],
    note: "<span class=\"mono\">[E.]</span> Cf. Record I, p. 20: “Coincidence noted as coincidence.”"
  },

  {
    id: "rv-lincoln", cat: ["readers"], kind: "review",
    src: "review",
    name: "Anika R.", handle: "61 books · 33 reviews",
    av: {img: "assets/posts/avatar-09.jpg"},
    stars: 4, title: "A ghost story about whose voice survives",
    body: "I study media, so I came for the AI premise and stayed for the structure. The missing scientist built a way to rebuild a dead person’s voice from what they left behind, and to talk with it as an equal. The book’s real question is what answers you: the person, a very good imitation, or something there isn’t a word for yet.\n\nThe second section is an experiment designed to find out. Three sealed rooms, each summoning Lincoln from a different set of sources, one rule: no human touches the keyboard. A historian in the letters puts the whole problem in one line: “Lincoln in 1858 is not Lincoln in 1863.”\n\nI’d shelve it between S. and Annihilation: documents you have to piece together, and a place that may be reading you back. The prose is literary, the horror is slow, and the book never once tells you what to believe.\n\nOne star off only because I wanted the glossary sooner. (There is one, at the back. Read it last.)",
    time: "Read last week", shelf: "read", stats: {l: "141", r: "18"},
    media: {type: "img", src: "assets/posts/photo-frontispiece.jpg", alt: "A phone photo of the book’s opening plate, with the invocation and the words of release."}
  },

  /* last ─ the night before she arrived, at the vessel's hour */
  {
    id: "mb-twelve", cat: ["story", "deleted"], kind: "micro", campaign: true,
    hook: "twelve?",
    src: "post",
    capture: "Recovered · mirror 3/3", capTime: "Captured 05 May 2027 · 03:04 CDT",
    name: "[account deleted]", handle: "@————", av: {c: "#2a2a2a", t: "?"},
    body: "twelve?",
    time: "3:04 AM · May 5, 2027",
    stamp: "Deleted", state: "Deleted by author 41 seconds after posting",
    note: "<span class=\"mono\">[E.]</span> Cf. Record I, p. 15: “It opened a door. She counted it. Twelve.”"
  }
];

/* Quote cards for the campaign (book/campaign/cards/quote-*). Verbatim from the novel. */
window.CAMPAIGN_QUOTES = {
  doors: {q: "Eleven doors on the county plan.<br><em>Twelve in her inventory.</em>", s: "Using This Matter · the back cover"},
  believe: {q: "Believe nothing.<br>Count everything.<br><em>Write it down.</em>", s: "Record I · p. 47"},
  fiction: {q: "The narrative is fiction.<br><em>The estate is not.</em>", s: "About This Book · p. 288"},
  keep: {q: "The task was to keep.<br><em>The Editor has kept.</em>", s: "Editor’s Note · p. viii"},
  sealed: {q: "Name what can pass through a sealed room.<br><em>A sentence can.</em>", s: "Record II · p. 112"},
  courteous: {q: "The estate was, in all things, courteous,<br><em>which she was beginning to understand was the worst of it.</em>", s: "Record I · p. 15"}
};
