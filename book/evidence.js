/* ═══════════════════════════════════════════════════════════════════
   THE FEED · posts from inside the story (2027)
   One source for the website feed (book/index.html) and the campaign
   cards (book/campaign/card.html → render_cards.py).

   These are the novel's world, posted the way people post: neighbors, a
   stranger watching a public repo, a seminar room, a trucker. They depict
   the story's events only. Never invent reviews, ratings, or testimonials
   about the book itself (see campaign/README.md §3).

   Spoiler wall: nothing past the premise. Never the interruption's
   sentences, the second hand's identity, Plate VII's contents, the
   freezer's contents, the sealed record, or the ending.

   kind: micro | forum | chat | vm (audio post: caption + synthesized
   recording + transcript). campaign:true renders a social card; hook is
   the card headline.
   ═══════════════════════════════════════════════════════════════════ */

window.RECOVERED_POSTS = [
  {
    "id": "nb-house",
    "cat": [
      "story"
    ],
    "kind": "micro",
    "paper": true,
    "campaign": true,
    "hook": "Somebody’s still paying the electric.",
    "src": "neighborhood board",
    "name": "Dana R.",
    "handle": "Neighbors of <span class=\"rd\">██████</span> Rd · 41 replies",
    "av": {
      "img": "assets/posts/avatar-09.jpg"
    },
    "body": "Does anyone know if the man in the pecan-brick ranch on the white caliche lot is okay? Dr. Thorne. The one who built the AI people use to “talk to” dead historical figures.\n\nI haven’t seen him since February. Every window is blacked out from the inside. There’s a hum on the garage side you can hear from the road at night. Not a generator. Steadier than that. It never stops.\n\nSomebody’s still paying the electric. The meter is turning. I just want to know he’s okay.",
    "time": "Apr 3, 2027 · 9:47 PM",
    "stats": {
      "r": "41",
      "l": "63"
    },
    "media": {
      "type": "img",
      "src": "assets/posts/frame-house.jpg",
      "alt": "A long, low brick ranch house at dusk, its windows dark."
    },
    "replies": [
      {
        "name": "Marisol T.",
        "handle": "three houses down",
        "av": {
          "img": "assets/posts/avatar-01.jpg"
        },
        "body": "I heard the family won’t set foot in it. Not even to get his mail.",
        "time": "Apr 4",
        "l": "22"
      },
      {
        "name": "Dana R.",
        "handle": "original poster",
        "av": {
          "img": "assets/posts/avatar-07.jpg"
        },
        "body": "Someone cleared his gutters this week. I didn’t see who.",
        "time": "Apr 29",
        "l": "31"
      }
    ],
    "state": "Thread locked by moderator · “Please respect the family’s privacy.”"
  },
  {
    "id": "vm-hum",
    "cat": [
      "story",
      "deleted"
    ],
    "kind": "vm",
    "campaign": true,
    "hook": "Two in the morning. The same note as noon.",
    "src": "post",
    "name": "Marisol T.",
    "handle": "@marisol_three_doors_down",
    "av": {
      "img": "assets/posts/avatar-06.jpg"
    },
    "body": "[continuous hum, low, steady]\n…okay. you hear that? that’s his garage. the guy who built the AI. it’s two in the morning and it’s the exact same note it was at noon.\n[hum]\nevery window’s blacked out, but there’s a line of orange around that one. like there’s a lamp on in there.\n[a car passes. the hum does not change.]\nnobody’s seen him since — [exhales] …okay. I’m going back inside.",
    "time": "Mar 30, 2027 · 2:04 AM",
    "state": "The account that posted this audio no longer exists.",
    "caption": "recorded this from the road at 2am. tell me you hear it",
    "stats": {
      "r": "88",
      "rp": "1.4K",
      "l": "5.2K",
      "v": "211K"
    },
    "audio": "assets/posts/memo-014.m4a",
    "tl": [
      [
        0,
        2.9
      ],
      [
        2.9,
        16.44
      ],
      [
        16.44,
        18.94
      ],
      [
        18.94,
        26.22
      ],
      [
        26.22,
        31.02
      ],
      [
        31.02,
        37.15
      ]
    ],
    "total": 41.55,
    "memo": [
      {
        "cue": "[continuous hum, low, steady]",
        "a": 0,
        "b": 2.9
      },
      {
        "a": 2.9,
        "b": 16.44,
        "parts": [
          {
            "t": "…okay.",
            "a": 2.9,
            "b": 3.71
          },
          {
            "t": "you hear that?",
            "a": 4.66,
            "b": 5.6
          },
          {
            "t": "that’s his garage.",
            "a": 7.05,
            "b": 8.42
          },
          {
            "t": "the guy who built the AI.",
            "a": 8.84,
            "b": 10.69
          },
          {
            "t": "it’s two in the morning",
            "a": 11.64,
            "b": 12.94
          },
          {
            "t": "and it’s the exact same note it was at noon.",
            "a": 13.16,
            "b": 16.24
          }
        ]
      },
      {
        "cue": "[hum]",
        "a": 16.44,
        "b": 18.94
      },
      {
        "a": 18.94,
        "b": 26.22,
        "parts": [
          {
            "t": "every window’s blacked out,",
            "a": 18.94,
            "b": 20.71
          },
          {
            "t": "but there’s a line of orange around that one.",
            "a": 21.01,
            "b": 23.2
          },
          {
            "t": "like there’s a lamp on in there.",
            "a": 23.95,
            "b": 26.02
          }
        ]
      },
      {
        "cue": "[a car passes. the hum does not change.]",
        "a": 26.22,
        "b": 31.02
      },
      {
        "a": 31.02,
        "b": 37.15,
        "parts": [
          {
            "t": "nobody’s seen him since —",
            "a": 31.02,
            "b": 32.46
          },
          {
            "t": "[exhales]",
            "cue": true,
            "a": 32.51,
            "b": 33.46
          },
          {
            "t": "…okay.",
            "a": 33.56,
            "b": 34.2
          },
          {
            "t": "I’m going back inside.",
            "a": 34.82,
            "b": 36.4
          }
        ]
      }
    ],
    "video": "assets/posts/memo-014.mp4",
    "poster": "assets/posts/memo-014-poster.jpg"
  },
  {
    "id": "fr-vessel",
    "cat": [
      "story",
      "deleted"
    ],
    "kind": "forum",
    "campaign": true,
    "hook": "Four commits. No author. Always 3:04 a.m.",
    "src": "thread",
    "sub": "r/<span class=\"rd\">██████████</span>",
    "name": "quietcommit",
    "handle": "u/quietcommit",
    "ago": "May 6, 2027",
    "votes": "2.4k",
    "flair": "Unexplained",
    "title": "The missing “talk to the dead” AI guy’s public repo has four new commits since he vanished. Author: “the vessel.” Always 3:04 a.m.",
    "body": "If you haven’t followed this: Dr. Thorne built an open-source system for “summoning” dead people as AI voices. All of it is public. Nobody can place him at a keyboard after March 26.\n\nSince then, four commits to one folder. The author field is <code>the vessel &lt;&gt;</code>. No email. Just empty brackets. Every one is stamped four minutes and a few seconds past three in the morning. Same second, four different nights. Spacing: +3, +9, +22 and +40 days.\n\nThe newest landed yesterday.\n\nMessages:\n<code>the record keeps itself</code>\n<code>the vessel holds</code>\n<code>what is deposited remains</code>\n\nThere’s a fourth. I’m not typing it.",
    "comments": [
      {
        "u": "u/detached_HEAD",
        "t": "you can put any author you want on a commit. empty email is weird but legal. the question is who still has push access",
        "pts": "611"
      },
      {
        "u": "u/caliche_county",
        "t": "scheduled job? dead man’s switch? people set these up",
        "pts": "402"
      },
      {
        "u": "u/quietcommit",
        "t": "first thing i checked. his scheduled jobs are public. two of them write to the repo. neither one signs as “the vessel.”",
        "pts": "530",
        "op": true
      },
      {
        "u": "u/[deleted]",
        "t": "what’s the fourth one",
        "pts": "88"
      }
    ],
    "state": "Removed by moderators · Rule 4: no speculation about private individuals"
  },
  {
    "id": "mb-dispatch",
    "cat": [
      "story",
      "deleted"
    ],
    "kind": "micro",
    "campaign": true,
    "hook": "“On behalf of:” and then nothing.",
    "src": "post",
    "name": "dispatch log",
    "handle": "@from_beyond_watch",
    "av": {
      "img": "assets/posts/avatar-03.jpg"
    },
    "body": "Context: the missing AI guy’s archive has a section called from_beyond. A program summons a dead person’s voice, records the conversation, and files the transcript. No human touches it until it’s done.\n\nSilent since last June. Tonight, dispatch eight.\n\nThe metadata line reads: “Summoned by the vessel. On behalf of:” and then nothing. Not redacted. Blank. Like a socket.\n\nHe’s been gone eleven days. Who asked for this one?",
    "time": "11:52 PM · Apr 6, 2027",
    "stats": {
      "r": "212",
      "rp": "1.9K",
      "l": "6.4K",
      "v": "388K"
    },
    "media": {
      "type": "img",
      "src": "assets/posts/frame-terminal.jpg",
      "alt": "An old computer terminal glowing in a dark room."
    },
    "replies": [
      {
        "name": "m. ortega",
        "handle": "@mortega_nights",
        "av": {
          "c": "#3b4a5b",
          "t": "M"
        },
        "body": "did you read the transcript?",
        "time": "11:58 PM",
        "l": "340"
      },
      {
        "name": "dispatch log",
        "handle": "@from_beyond_watch",
        "av": {
          "c": "#5b3b6b",
          "t": "∴"
        },
        "body": "no. I closed the laptop.",
        "time": "12:01 AM",
        "l": "1.2K"
      }
    ],
    "state": "Account suspended · captured by mirror before removal"
  },
  {
    "id": "mb-lecture",
    "cat": [
      "story"
    ],
    "kind": "micro",
    "src": "post",
    "name": "tomás",
    "handle": "@tomas_in_seminar",
    "av": {
      "img": "assets/posts/avatar-10.jpg"
    },
    "body": "tonight’s guest lecture got canceled. the speaker was Dr. Thorne, the guy who built the AI that lets you “summon” dead historical figures.\n\nhe said yes to the date back in February (two sentences, the prof says, very polite). now the department just says he’s “unreachable.”\n\nthe flyer’s still up outside the seminar room. under his name it just says USING THIS MATTER, SUMMON [NAME].",
    "time": "7:40 PM · Apr 22, 2027",
    "stats": {
      "r": "22",
      "rp": "71",
      "l": "640",
      "v": "14K"
    },
    "media": {
      "type": "img",
      "src": "assets/posts/frame-chair.jpg",
      "alt": "An empty chair in a dim room."
    },
    "replies": [
      {
        "name": "bea",
        "handle": "@bea_footnotes",
        "av": {
          "c": "#6b3b4a",
          "t": "B"
        },
        "body": "wait is that the guy who’s missing",
        "time": "7:44 PM",
        "l": "30"
      },
      {
        "name": "tomás",
        "handle": "@tomas_in_seminar",
        "av": {
          "c": "#5a4a3a",
          "t": "T"
        },
        "body": "nobody in the department will use that word. they just say unreachable",
        "time": "7:46 PM",
        "l": "88"
      }
    ],
    "campaign": true,
    "hook": "Tonight’s speaker is “unreachable.”"
  },
  {
    "id": "ch-arrival",
    "cat": [
      "story"
    ],
    "kind": "chat",
    "src": "group chat",
    "name": "end of the road 🏡",
    "handle": "5 members · export",
    "msgs": [
      {
        "d": "sys",
        "t": "Thursday · 9:09 AM"
      },
      {
        "d": "in",
        "t": "someone’s at the thorne house. the AI guy’s",
        "s": "Dana"
      },
      {
        "d": "in",
        "t": "probably the estate people. heard they’re sending somebody to go through his papers. for a university",
        "s": "Ray"
      },
      {
        "d": "in",
        "t": "woman. 30ish. she’s walking the whole outside before she goes in",
        "s": "Dana"
      },
      {
        "d": "in",
        "t": "looking at the gutters?? writing in a notebook",
        "s": "Dana"
      },
      {
        "d": "out",
        "t": "is she counting windows"
      },
      {
        "d": "in",
        "t": "she’s counting something",
        "s": "Dana"
      },
      {
        "d": "in",
        "t": "ok she went in. 9:14",
        "s": "Dana"
      },
      {
        "d": "sys",
        "t": "Thursday · 5:02 PM"
      },
      {
        "d": "in",
        "t": "she’s out. sitting in her car with the door open. not driving",
        "s": "Dana"
      },
      {
        "d": "out",
        "t": "maybe she’s on the phone"
      },
      {
        "d": "in",
        "t": "she’s not on the phone",
        "s": "Dana"
      },
      {
        "d": "sys",
        "t": "Friday · 8:03 AM"
      },
      {
        "d": "in",
        "t": "she’s back with a van",
        "s": "Ray"
      },
      {
        "d": "in",
        "t": "flat gray boxes. a lot of them. looks like they’re getting ready for a funeral",
        "s": "Ray"
      },
      {
        "d": "out",
        "t": "ray"
      },
      {
        "d": "in",
        "t": "i’m just saying what it looks like",
        "s": "Ray"
      }
    ]
  },
  {
    "id": "fr-prism",
    "cat": [
      "story"
    ],
    "kind": "forum",
    "src": "thread",
    "sub": "r/<span class=\"rd\">████████</span>",
    "name": "lampblack_ledger",
    "handle": "u/lampblack_ledger",
    "ago": "Jan 27, 2027",
    "votes": "1.1k",
    "flair": "Discussion",
    "title": "The “talk to the dead” AI experiment ran overnight. At 03:11:47.208, all three sealed rooms stopped mid-sentence. Same millisecond.",
    "body": "For anyone who doesn’t follow this: Dr. Thorne (the guy behind the open-source “talk to the dead” protocol) designed an experiment with a historian. Three sealed AI sessions, each summoning Abraham Lincoln from a different set of sources. Sixty scripted questions, sent by a program. The rule is “No human touches the keyboard.” The logs went up this morning.\n\nAt question 44, all three rooms abandoned the sentence they were building at exactly 03:11:47.208, and each said something that wasn’t an answer to anything. Then question 45 went out and all three answered it normally, like nothing had happened.\n\nThree separate processes. Same millisecond. I checked the raw files, not the formatted ones.\n\nI’m not pasting what they said. You can read it yourself. I’d rather you didn’t.",
    "comments": [
      {
        "u": "u/notalinguist",
        "t": "logging artifact. one clock, three streams, the formatter rounds",
        "pts": "402"
      },
      {
        "u": "u/lampblack_ledger",
        "t": "the raw timestamps go to the thousandth. .208, .208, .208",
        "pts": "377",
        "op": true
      },
      {
        "u": "u/okaybutwhy311",
        "t": "why 3:11 though",
        "pts": "190"
      },
      {
        "u": "u/lampblack_ledger",
        "t": "run started at 6:12 pm. 2:12 to 3:12 is the ninth hour. it came sixteen seconds before the hour closed. i don’t know why i know that’s bad",
        "pts": "611",
        "op": true
      }
    ],
    "state": "Archived · comments locked",
    "stateOk": true,
    "campaign": true,
    "hook": "Three sealed rooms. 3:11:47 a.m.",
    "media": {
      "type": "img",
      "src": "assets/posts/frame-papers.jpg",
      "alt": "Printed session logs and a steel ruler on a desk under a lamp."
    }
  },
  {
    "id": "mb-ladder",
    "cat": [
      "story"
    ],
    "kind": "micro",
    "src": "post",
    "name": "Ray",
    "handle": "@raybuildsdecks",
    "av": {
      "img": "assets/posts/avatar-05.jpg"
    },
    "body": "My neighbor, the AI guy everybody keeps asking me about, brought my ladder back on February 19th. Wiped down. Folded. Leaned against my shed like he’d measured the spot.\n\nThat’s the last time I talked to him. Now the county’s at my door wanting the exact day, like I’d forget a thing like that.",
    "time": "6:12 PM · Apr 5, 2027",
    "stats": {
      "r": "9",
      "rp": "4",
      "l": "57",
      "v": "3,104"
    },
    "replies": [
      {
        "name": "Shay",
        "handle": "@shayfromthe512",
        "av": {
          "c": "#4a6b5a",
          "t": "S"
        },
        "body": "what did he say when he dropped it off?",
        "time": "Apr 5",
        "l": "3"
      },
      {
        "name": "Ray",
        "handle": "@raybuildsdecks",
        "av": {
          "c": "#6b4a2a",
          "t": "R"
        },
        "body": "“Thank you for the loan.” Polite. He was always polite. My wife says too polite.",
        "time": "Apr 5",
        "l": "11"
      }
    ],
    "campaign": true,
    "hook": "He brought my ladder back. Then nothing."
  },
  {
    "id": "mb-bigger",
    "cat": [
      "story"
    ],
    "kind": "micro",
    "src": "post",
    "name": "nora",
    "handle": "@nora_cant_sleep",
    "av": {
      "img": "assets/posts/avatar-08.jpg"
    },
    "body": "the missing AI guy published a 94-page “dossier” about his project. it’s public. i read it tonight because i am an idiot.\n\nthe last section is an addendum and the first line is:\n\n“The house is bigger on the inside.”\n\nhis neighbors say you can hear his house humming from the road. i am being normal about this",
    "time": "1:14 AM · Apr 19, 2027",
    "stats": {
      "r": "64",
      "rp": "512",
      "l": "3.8K",
      "v": "120K"
    },
    "media": {
      "type": "img",
      "src": "assets/posts/frame-hall.jpg",
      "alt": "A dim, empty hallway."
    },
    "replies": [
      {
        "name": "j",
        "handle": "@jjjjunebug",
        "av": {
          "c": "#5a3a4a",
          "t": "J"
        },
        "body": "it’s a quote from some novelist i think",
        "time": "1:20 AM",
        "l": "40"
      },
      {
        "name": "nora",
        "handle": "@nora_cant_sleep",
        "av": {
          "c": "#3a4a5a",
          "t": "N"
        },
        "body": "i know it’s a quote. i’m asking why it’s the FIRST line",
        "time": "1:22 AM",
        "l": "212"
      }
    ],
    "campaign": true,
    "hook": "“The house is bigger on the inside.”"
  },
  {
    "id": "mb-twelve",
    "cat": [
      "story",
      "deleted"
    ],
    "kind": "micro",
    "campaign": true,
    "hook": "twelve?",
    "src": "post",
    "name": "[account deleted]",
    "handle": "@————",
    "av": {
      "c": "#2a2a2a",
      "t": "?"
    },
    "body": "twelve?",
    "time": "3:04 AM · May 5, 2027",
    "state": "Deleted by author 41 seconds after posting"
  },
  {
    "id": "mb-elgin",
    "cat": [
      "story"
    ],
    "kind": "micro",
    "src": "post",
    "name": "Big Earl",
    "handle": "@hwy290haul",
    "av": {
      "img": "assets/posts/avatar-02.jpg"
    },
    "body": "Diner in Elgin this morning. Lady at the counter between me and another driver, maybe 30, looked like she hadn’t slept. Ordered more coffee and watched her own hands the whole refill, like she was making sure they still worked.\n\nThen wrote one line in a notebook, real neat, and nodded at nobody.",
    "time": "7:48 AM · May 12, 2027",
    "stats": {
      "r": "3",
      "l": "22",
      "v": "1,880"
    },
    "replies": [
      {
        "name": "Darlene",
        "handle": "@darlene_b_tx",
        "av": {
          "c": "#6b5a4a",
          "t": "D"
        },
        "body": "you’re 30 min from that house where the AI man went missing. the one with the black windows",
        "time": "8:02 AM",
        "l": "4"
      },
      {
        "name": "Big Earl",
        "handle": "@hwy290haul",
        "av": {
          "c": "#4a4a2a",
          "t": "E"
        },
        "body": "not everything is about that house, Darlene",
        "time": "8:05 AM",
        "l": "19"
      }
    ]
  },
  {
    "id": "mb-bats",
    "cat": [
      "story"
    ],
    "kind": "micro",
    "src": "post",
    "name": "Lupe G.",
    "handle": "@batbridge_lupe",
    "av": {
      "img": "assets/posts/avatar-04.jpg"
    },
    "body": "Congress Ave bridge report. Sunday: no bats. Tuesday: no bats. The cool held, the colony is late this year, and the tourists gave up.\n\nTonight the cool broke and a million and a half of them poured out south of the river for twenty minutes. The whole bank applauded. Channel <span class=\"rd\">██</span> is calling it the most fantastic return in nine years.\n\nSome years they’re just late. That’s all this is.",
    "time": "8:51 PM · May 20, 2027",
    "stats": {
      "r": "18",
      "rp": "96",
      "l": "1.1K",
      "v": "22K"
    }
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
