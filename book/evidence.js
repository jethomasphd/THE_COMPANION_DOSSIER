/* ═══════════════════════════════════════════════════════════════════
   RECOVERED POSTS · exhibits of the fiction
   One source for the website wall (book/index.html) and the campaign
   cards (book/campaign/card.html → render_cards.py).

   Rules (see campaign/README.md §3):
   - In-world voices testify about the story's events, never about the book's
     quality. No reviews, ratings, or blurbs.
   - Every person, handle, and timestamp is invented. Names belonging to the
     story are displaced in brackets, e.g. [Thorne], per the estate's doctrine.
   - Nothing past the premise: no contents of the interruption, the sealed
     record, the identity of the second hand, or the ending.

   Fields: id, cat[house|voices|deposit|deleted], kind[micro|forum|vm|chat],
   paper, capture, capTime, name, handle, av{c,t,blank}, src, body (HTML),
   time, stats{r,rp,l,v}, stars, stamp, stampGold, state, stateOk, note (HTML),
   campaign (render as social card), hook (card headline).
   Spans: <span class="rd">█</span> permanent redaction · rd--peek reveals on hover.
   ═══════════════════════════════════════════════════════════════════ */

window.RECOVERED_POSTS = [
  {
    id: "nb-caliche", cat: ["house"], kind: "micro", paper: true, campaign: true,
    hook: "Somebody’s paying the electric.",
    capture: "Exhibit H-01 · mirror 2/3", capTime: "Captured 09 Mar 2027 · 22:16 CST",
    name: "Dana R.", handle: "Neighbors of <span class=\"rd\">██████</span> Hills · 41 replies", src: "Neighborhood board",
    av: {c: "#7a5a3a", t: "D"},
    body: "Does anyone know the owner of the pecan-brick ranch at the end of the caliche lot off <span class=\"rd\">████████</span> Rd?\n\nBlackout cloth on every window. Truck hasn’t moved in two weeks. There’s a hum on the garage side you can hear from the road at night. Not a generator. Steadier than that.\n\nSomebody’s paying the electric. The meter’s spinning. I just want to know he’s okay.",
    time: "Mar 9, 2027 · 10:02 PM", stats: {r: "41", l: "63"},
    stamp: "Recovered", state: "Thread locked by moderator · “Please respect the family’s privacy.”",
    note: "<span class=\"mono\">[E.]</span> Cf. the appraisal log, day one: “continuous hum, garage side, source not identified.” Record I, p. 6."
  },
  {
    id: "fr-vessel", cat: ["voices", "deleted"], kind: "forum", campaign: true,
    hook: "Always at 3:04 a.m.",
    capture: "Exhibit V-02 · mirror 1/3", capTime: "Captured 06 May 2027 · 09:40 CDT",
    sub: "r/<span class=\"rd\">██████████</span>", handle: "u/quietcommit", ago: "May 6, 2027", votes: "2.4k", comments: "611",
    title: "Commits to a missing man’s public repo, authored by “the vessel,” always at 3:04 a.m.",
    body: "Four commits since late March. No email in the author field — literally <code>the vessel &lt;&gt;</code>. Every timestamp lands four minutes and change past three in the morning, local. Spacing: +3, +9, +22 and +40 days from the date his family’s lawyer uses.\n\nMessages (two of the four):\n<code>the record keeps itself</code>\n<code>the vessel holds</code>\n\nI’d rather not type the other two. Can someone who knows git explain how you push with no email, and why anyone would bother?",
    state: "Removed by moderators · Rule 4: no speculation about private individuals",
    note: "Count the commits."
  },
  {
    id: "vm-hum", cat: ["house", "deleted"], kind: "vm", campaign: true,
    hook: "Two in the morning. Exactly the same as it was at noon.",
    capture: "Exhibit H-03 · cloud backup", capTime: "Recovered 11 Jun 2027",
    name: "Voice memo 014", handle: "Recorded from the sidewalk · <span class=\"rd\">████</span> Ln", src: "Voice memo", dur: "0:31",
    av: {c: "#2f3b3a", t: "◉"},
    body: "[continuous hum, low, steady]\n…okay. You hear that? That’s the garage. It’s two in the morning and it’s exactly the same as it was at noon.\n[hum]\nNo lights except the orange one. There’s always the orange one.\n[a car passes. the hum does not change.]\n…I’m going inside.",
    time: "Mar 30, 2027 · 2:04 AM",
    state: "Original file deleted by owner · transcript recovered from backup",
    note: "The freezer is older than the work around it."
  },
  {
    id: "mb-dispatch", cat: ["voices"], kind: "micro", campaign: true,
    hook: "Summoned by the vessel. On behalf of: ______",
    capture: "Exhibit V-04 · mirror 1/3", capTime: "Captured 07 Apr 2027 · 00:03 CDT",
    name: "dispatch log", handle: "@from_beyond_watch", src: "Microblog",
    av: {c: "#5b3b6b", t: "∴"},
    body: "New dispatch just landed in from_beyond.\n\nMetadata line: “Summoned by the vessel. On behalf of:” — and then nothing. Not redacted. Blank. Like a socket.\n\nThe maintainer hasn’t been seen since March. The orchestrator is supposed to need a human to press go.\n\nWho pressed go?",
    time: "11:52 PM · Apr 6, 2027", stats: {r: "212", rp: "1.9K", l: "6.4K", v: "388K"},
    stamp: "Recovered", state: "Account suspended · captured by mirror before removal",
    note: "No dispatch has yet needed another."
  },
  {
    id: "rv-bats", cat: ["voices"], kind: "micro", campaign: true,
    hook: "Two nights: nothing.",
    capture: "Exhibit V-05 · map listing", capTime: "Captured May 2027",
    name: "Lupe G.", handle: "Local Guide · 212 reviews", src: "Map review", stars: 5,
    av: {c: "#3b5b45", t: "L"},
    body: "<b>Congress Avenue Bridge · bat colony viewing</b>\n\nCame three nights this week. Two nights: nothing. Tourists gave up and left.\n\nTonight a million and a half of them poured out south of the river for twenty minutes and the whole bank applauded. The local station called it the most fantastic return in nine years.\n\nTuesday a man two chairs down kept insisting they’d already come back. They hadn’t. He was very sure.",
    time: "Thursday · May 2027", stats: {l: "Helpful · 88"},
    note: "<span class=\"mono\">[E.]</span> Cf. Record I, p. 31: “Wrong Tuesday, right Thursday.”"
  },
  {
    id: "ch-second-hand", cat: ["deposit"], kind: "chat", campaign: true,
    hook: "Not the Editor. Not [Thorne].",
    capture: "Exhibit D-06 · chat export", capTime: "Exported 14 Apr 2028",
    name: "reading group 🕯", handle: "4 members · export", src: "Group chat",
    msgs: [
      {d: "sys", t: "Thursday · 11:48 PM"},
      {d: "in", t: "ok who wrote the orange notes", s: "ana"},
      {d: "out", t: "not the editor. the editor says so, page viii"},
      {d: "in", t: "not [thorne] either. “on the evidence of the paper”", s: "kel"},
      {d: "in", t: "then who", s: "ana"},
      {d: "out", t: "read page 14. the one about the garage"},
      {d: "in", t: "how does a margin note know about a permit nobody pulled", s: "dev"},
      {d: "in", t: "stop", s: "ana"},
      {d: "sys", t: "ana left the group"}
    ],
    note: "The permit was not sought."
  },
  {
    id: "mb-ladder", cat: ["house"], kind: "micro",
    capture: "Exhibit H-07 · mirror 2/3", capTime: "Captured 28 Mar 2027 · 18:30 CDT",
    name: "Ray", handle: "@raybuildsdecks", src: "Microblog",
    av: {c: "#6b4a2a", t: "R"},
    body: "He brought my ladder back on the nineteenth. Wiped down. Folded. Leaned against the shed like he’d measured the spot.\n\nThat’s the last time I talked to him. Five weeks later the county’s at my door asking which day exactly, like I’d forget a thing like that.",
    time: "6:12 PM · Mar 28, 2027", stats: {r: "9", rp: "4", l: "57", v: "3,104"},
    note: "<span class=\"mono\">[E.]</span> “He had returned a neighbor’s ladder.” “The deposit preserves three edges for Dr. [Thorne], each kept to a different standard of proof.” Record II, p. 109."
  },
  {
    id: "mb-plate-vii", cat: ["deposit"], kind: "micro", campaign: true,
    hook: "The reader should count it.",
    capture: "Exhibit D-08", capTime: "Captured 19 Apr 2028 · 01:22 CDT",
    name: "mx. vellum", handle: "@vellum_and_rust", src: "Microblog",
    av: {c: "#8a3f2c", t: "V"},
    body: "the list of plates at the front says thirteen. the deposit prints twelve. plate vii is a page that just says WITHHELD AT THE KEEPER’S DIRECTION.\n\nthe editor’s note: “the reader will come to it in due course, and should count it.”\n\ni counted it. i don’t know what i expected.",
    time: "1:19 AM · Apr 19, 2028", stats: {r: "301", rp: "2.2K", l: "14K", v: "610K"},
    stamp: "Recovered"
  },
  {
    id: "mb-reader-count", cat: ["deposit"], kind: "micro", campaign: true,
    hook: "me: 11. me again, with my finger: 12.",
    capture: "Exhibit D-09", capTime: "Captured 02 May 2028 · 21:05 CDT",
    name: "Theo", handle: "@theo_reads_late", src: "Microblog",
    av: {c: "#2c4a6b", t: "T"},
    body: "counted the interior doors on the plan at the front of the [Thorne] deposit.\n\nme: 11\nme again, with my finger: 12\nmy partner: 11\n\nit doesn’t tell you which count is right. it keeps all three. we are not discussing it at dinner.",
    time: "9:01 PM · May 2, 2028", stats: {r: "88", rp: "940", l: "7.1K", v: "201K"},
    note: "<span class=\"mono\">[E.]</span> Plate II: “The first count remains legible beneath its correction.” p. 2."
  },
  {
    id: "mb-elgin", cat: ["house"], kind: "micro",
    capture: "Exhibit H-10", capTime: "Captured May 2027",
    name: "Big Earl", handle: "@hwy290haul", src: "Microblog",
    av: {c: "#4a4a2a", t: "E"},
    body: "Diner in Elgin, 6 a.m. Lady two stools down watched her own hands the whole coffee refill like they owed her money. Then wrote one line in a notebook, very neat, and nodded at nobody.\n\nAustin’s getting weird all the way out here now.",
    time: "6:21 AM · May 2027", stats: {r: "3", l: "22", v: "1,880"},
    note: "<span class=\"mono\">[E.]</span> Cf. Record I, p. 20: “Coincidence noted as coincidence.”"
  },
  {
    id: "mb-deposit", cat: ["deposit"], kind: "micro", campaign: true,
    hook: "I have counted the doors in my own apartment twice.",
    capture: "Exhibit D-11", capTime: "Captured 03 Aug 2027 · 16:44 EDT",
    name: "finding aid", handle: "@finding_aid", src: "Microblog", verified: true,
    av: {c: "#5a5a5a", t: "§"},
    body: "Someone has deposited an entire appraisal file into a public, no-rights-reserved estate. Inventories. A running log. Memoranda. Transcripts. A county plan with a door count that doesn’t agree with itself.\n\nAs an archivist, I have notes. As a person, I have read 140 pages since lunch and I have counted the doors in my own apartment twice.",
    time: "4:40 PM · Aug 3, 2027", stats: {r: "1.1K", rp: "8.8K", l: "41K", v: "2.3M"}
  },
  {
    id: "fr-plates", cat: ["deposit"], kind: "forum",
    capture: "Exhibit D-12", capTime: "Captured 30 Apr 2028",
    sub: "r/<span class=\"rd\">████████</span>books", handle: "u/AutoModerator", ago: "pinned", votes: "891", comments: "1,204",
    title: "Plate VII megathread — post your theories here (no scans; there is nothing to scan)",
    body: "Thirteen plates were inventoried. Twelve are printed. VII was withheld by the keeper “without stated reason, as is the keeper’s right,” and the page is bound where it belongs.\n\n• Spoiler-tag anything past Record II.\n• Do not post the Appendix C checksums as “proof.” Of what?\n• Do not try to contact the Editor. The Editor has “stopped attempting to” find the second annotator, and frankly so should you.",
    state: "Pinned · still active", stateOk: true
  },
  {
    id: "mb-howto", cat: ["deposit"], kind: "micro",
    capture: "Exhibit D-13", capTime: "Captured 11 May 2028",
    name: "ines", handle: "@ines_marginalia", src: "Microblog",
    av: {c: "#6b2c4a", t: "I"},
    body: "it opens with one page of instructions and the instructions are “do not skip the mono.”\n\nit says a log line carries as much of the story as a chapter, “and one of them carries more.”\n\ni am now reading timestamps like scripture.",
    time: "10:37 PM · May 11, 2028", stats: {r: "47", rp: "610", l: "5.3K", v: "99K"}
  },
  {
    id: "mb-0311", cat: ["deposit"], kind: "micro",
    capture: "Exhibit D-14", capTime: "Captured 23 May 2028 · 03:14 CDT",
    name: "sam", handle: "@samnotsleeping", src: "Microblog",
    av: {c: "#2a2a4a", t: "S"},
    body: "three nights in a row since i started record ii i have woken up at 3:11. not 3:10. not 3:12.\n\nthe chapter is called “the ninth hour” and i would like to stop being told things.",
    time: "3:13 AM · May 23, 2028", stats: {r: "120", rp: "1K", l: "9.9K", v: "330K"},
    note: "Some entries can only be filed forward."
  },
  {
    id: "mb-twelve", cat: ["deleted", "deposit"], kind: "micro", campaign: true,
    hook: "twelve?",
    capture: "Exhibit X-15 · mirror 3/3", capTime: "Captured 05 May 2028 · 03:04 CDT",
    name: "[account deleted]", handle: "@————", src: "Microblog",
    av: {blank: true},
    body: "twelve?",
    time: "3:04 AM · May 5, 2028",
    stamp: "Deleted", state: "Deleted by author 00:41 after posting",
    note: "<span class=\"mono\">[E.]</span> Plate XI, legend: “Later annotation / door 12.” p. xii."
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
