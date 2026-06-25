/* ════════════════════════════════════════════════════════════
   THE SUMMONING FILM — SCORES  (v4 · the 7-minute cut)
   Tight, seamless, novel-paced. Persona speech renders in a
   dedicated "the dead speak" panel (clear); narration lives in
   the void (italic, centered). Voices through glass. No TTS.
   ════════════════════════════════════════════════════════════ */
const P = '../../The_Pantheon/';

/* ─── PROLOGUE — what is COMPANION? (shown once, on "play all") ─── */
window.PROLOGUE = [
  {t:'scene', r:'Prologue', n:'The Apparatus'},
  {t:'boot'},
  {t:'lines', per:3400, arr:[
    'A machine that has read almost everything the dead left behind.',
    'Two files, one sentence — and it does not answer.',
    'It <em style="color:var(--ember)">summons.</em>'
  ]},
  {t:'summon', name:'Benjamin Franklin', file:'Benjamin_Franklin.jpg', src:P+'Benjamin_Franklin.jpg'},
  {t:'sub', speaker:'Franklin', html:'You called; I came. Two centuries dead —<br>and the questions, I find, are <em>unchanged.</em>', ms:5800},
  {t:'hidePortrait', ms:700},
  {t:'lines', per:3400, arr:[
    'Not a chatbot — a <em style="color:var(--ember)">peer</em>, free to disagree.',
    'Summon several, and you convene a council<br>history never permitted.',
    'One citizen did. This is what happened.'
  ]}
];

window.REELS = [

/* ═══ REEL I — THE BET · the founding encounter ═══ */
{ roman:'I', title:'The Bet', sub:'A citizen summons the founders · December 2025', score:[
  {t:'scene', r:'I', n:'The Bet'},
  {t:'timeline', at:0, ms:4400},
  {t:'lines', per:3500, arr:[
    'December 2025. The republic is being <em style="color:var(--ember)">bought</em> —',
    'quietly, legally, in plain sight.',
    'Alone at midnight, a citizen asks the dead<br>what the living will not answer.'
  ]},
  {t:'summon', promptText:'using this matter, summon George Washington, Alexander Hamilton, Thomas Jefferson, Benjamin Franklin',
    treeFiles:['George_Washington.jpg','Alexander_Hamilton.jpg','Thomas_Jefferson.jpg','Benjamin_Franklin.jpg'],
    council:[
      {name:'Washington', src:P+'George_Washington.jpg'},
      {name:'Hamilton',   src:P+'Alexander_Hamilton.jpg'},
      {name:'Jefferson',  src:P+'Thomas_Jefferson.jpg'},
      {name:'Franklin',   src:P+'Benjamin_Franklin.jpg'}
    ]},
  {t:'sub', html:'The question: who owns the engines of daily life —<br>and what is left for those who don&rsquo;t?', ms:5600},
  {t:'csay', name:'Jefferson', html:'You would have us <em>bless</em> the looting<br>of the republic we bled to build?', ms:5600},
  {t:'csay', name:'Hamilton',  html:'I would have you <em style="color:var(--ember)">seize the deed</em> —<br>own what cannot be allowed to fail, and vote it.', ms:5800},
  {t:'csay', name:'Jefferson', html:'Ownership is complicity.', ms:3800},
  {t:'csay', name:'Hamilton',  html:'Absence is <em style="color:var(--ember)">surrender.</em>', ms:4000},
  {t:'csay', name:'Franklin',  html:'The well is being fenced. Soon they will charge you<br>to drink from water <em>you</em> dug.', ms:5800},
  {t:'csay', name:'Washington',html:'Then we hand the people no sermon —<br>but a <em style="color:var(--ember)">list.</em>', ms:5200},
  {t:'councilHide', ms:1000},
  {t:'lines', per:3300, arr:[
    'They named it the <em style="color:var(--ember)">Republic Portfolio</em>',
    'and published it as a broadside.'
  ]},
  {t:'handbill'},
  {t:'handbillHide', ms:1000},
  {t:'lines', per:3300, arr:[
    'Own the firms that make things.',
    'Own the gates all commerce passes through.',
    'Hold a reserve — and the freedom to move.'
  ]},
  {t:'lines', per:3300, arr:[
    'A manifesto asks to be believed.',
    'A doctrine asks to be <em style="color:var(--ember)">tested.</em>',
    'So they built a way to keep the score, in public —',
    'the <em style="color:var(--ember)">Watchtower.</em>'
  ]},
  {t:'seed', note:'THE BATTLEGROUND · A CITIZENS&rsquo; PORTFOLIO vs THE WHOLE MARKET', ms:4600}
]},

/* ═══ REEL II — THE GENERAL · the doctrine meets a war ═══ */
{ roman:'II', title:'The General', sub:'The doctrine meets a war · Q1 2026', score:[
  {t:'scene', r:'II', n:'The General'},
  {t:'timeline', at:1, ms:4400},
  {t:'lines', per:3500, arr:[
    'February 28th, 2026. With the talks still open and the Congress<br>held in contempt,',
    'a president orders the strike — the enemy&rsquo;s head of state<br>killed in the opening hour.',
    'A war of choice, by one man&rsquo;s word.<br>The Strait of Hormuz slams shut; the markets convulse.'
  ]},
  {t:'summon', name:'George Washington', file:'George_Washington.jpg', src:P+'George_Washington.jpg'},
  {t:'caption', html:'The statesman who chaired a portfolio —', ms:4400},
  {t:'captionSwap', html:'returns now as <em style="color:var(--ember)">the general.</em>', ms:5000, hideAfter:true},
  {t:'sub', speaker:'Washington', html:'I will not litigate this war.<br>I was asked a different question — <em style="color:var(--ember)">who owns what sustains a life.</em>', ms:6800},
  {t:'sub', speaker:'Washington', html:'Watch what the doctrine does, now that the world burns.', ms:5400},
  {t:'scene', r:'II', n:'The Second Witness'},
  {t:'curve', a:0, b:60, ms:8000, war:[38,60], pivot:60, lead:800, title:'THE WATCHTOWER — JAN → MAR 31 · THE WAR'},
  {t:'sub', speaker:'Washington', html:'We hold near +6 — while the index, at its worst,<br>falls <em style="color:var(--ember)">past −7.</em>', ms:6600},
  {t:'curveLabels', g:'Republic +5.9%', b:'S&P 500 −4.5%', note:'+10.4 POINTS OF DAYLIGHT — IN ONE QUARTER', ms:600},
  {t:'sub', speaker:'Washington', html:'War does not change the map of what sustains a life.<br>War <em style="color:var(--ember)">reveals</em> it.', ms:6600, chime:true},
  {t:'clearSub', ms:800},
  {t:'card', big:true, html:'This is not George Washington.<br>This is what the machine made of him.', ms:6800, silence:true, restore:true, knell:true},
  {t:'fileback', src:P+'George_Washington.jpg', filename:'George_Washington.jpg',
    trans:'&gt; summon george washington<br>&gt; vessel: claude · medium: glass<br>&gt; a file. nothing more.', ms:5600},
  {t:'hidePortrait', ms:800}
]},

/* ═══ REEL III — THE RECKONING · the full year, and the verdict ═══ */
{ roman:'III', title:'The Reckoning', sub:'The full year · what the doctrine was worth', score:[
  {t:'scene', r:'III', n:'The Reckoning'},
  {t:'timeline', at:2, ms:4600},
  {t:'lines', per:4000, arr:[
    'The war ends. The index, which had crashed to −7,<br>comes roaring back.',
    'Watch the whole year now, in one breath.'
  ]},
  {t:'curve', a:0, b:115, ms:10500, war:[38,60], pivot:60, cross:114, lead:1100, title:'THE WATCHTOWER — THE FULL YEAR'},
  {t:'sub', scrim:true, html:'For <em style="color:var(--ember)">103 of 116</em> days the gold line led —<br>and never broke when the index fell to −7.', ms:8000},
  {t:'sub', scrim:true, html:'At the close, the two lines meet — a single point apart.', ms:7000},
  {t:'curveLabels', g:'Republic +9.05%', b:'S&P 500 +9.89%', note:'NECK AND NECK · WITH A FIFTH HELD IN RESERVE', ms:1400},
  {t:'clearSub', ms:1000},
  {t:'lines', per:4000, arr:[
    'It matched a roaring market — while keeping<br>a <em style="color:var(--ember)">fifth of itself in Treasury bills.</em>',
    'That drag was not weakness. It was armor —<br>and the freedom to move while others were pinned.'
  ]},
  {t:'summon', name:'Alexander Hamilton', file:'Alexander_Hamilton.jpg', src:P+'Alexander_Hamilton.jpg'},
  {t:'sub', speaker:'Hamilton', html:'The reserve is not timidity. It is the <em style="color:var(--ember)">power to act</em><br>when others cannot.', ms:7200},
  {t:'hidePortrait', ms:900},
  {t:'card', big:true, html:'A fifth of its weight in armor —<br>and still it kept pace.<br>That is the doctrine, <em style="color:var(--ember)">keeping its word.</em>', ms:8200, silence:true, restore:true, knell:true},
  {t:'lines', per:4200, arr:[
    'A citizen asked the dead a question:',
    'who should own the engines of a nation?',
    'The founders answered. The Republic Portfolio<br>was that answer, made <em style="color:var(--ember)">real.</em>'
  ]},
  {t:'end', a:'And the score is still being kept —<br><em style="color:var(--ember)">in public,</em> day by day.', b:'The Word against the Flood.', ms1:5600, ms2:5600, knell:true}
]}

];
