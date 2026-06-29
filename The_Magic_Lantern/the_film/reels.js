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
    'an oligarchy assembling — quietly, legally, in plain sight.',
    'A few hands closing on what the many depend upon.',
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
  {t:'sub', html:'The question: as a few seize the engines of daily life,<br>what is left for the <em style="color:var(--ember)">many</em> who own none of it?', ms:5600},
  {t:'csay', name:'Jefferson', html:'You would have us <em>bless</em> the looting<br>of the republic we bled to build?', ms:5600},
  {t:'csay', name:'Hamilton',  html:'I would have the people <em style="color:var(--ember)">seize the deed</em> —<br>own what cannot be allowed to fail, and vote it.', ms:5800},
  {t:'csay', name:'Jefferson', html:'A handful of shares changes nothing.', ms:3800},
  {t:'csay', name:'Hamilton',  html:'A <em style="color:var(--ember)">nation</em> of them changes everything.', ms:4200},
  {t:'csay', name:'Franklin',  html:'The well is being fenced. Soon they will charge the many<br>to drink from water <em>they</em> dug.', ms:5800},
  {t:'csay', name:'Washington',html:'Then we hand the people no sermon — but a <em style="color:var(--ember)">list</em>:<br>own the republic back, share by share,<br>in numbers too great to fence.', ms:6400},
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

  /* ── BEFORE THE WAR — peacetime, Jan 1 → Feb 28 ── */
  {t:'lines', per:3600, arr:[
    'First, the weeks before the war.',
    'January into February — the markets calm,<br>the doctrine already at work.'
  ]},
  {t:'curve', a:0, b:38, ms:7000, lead:800, title:'THE WATCHTOWER — JAN 1 → FEB 28 · BEFORE THE WAR',
     axL:'Jan 1', axM:'&middot; peacetime &middot;', axR:'Feb 28'},
  {t:'sub', scrim:true, html:'Even in peace, the lines part.<br>The doctrine climbs near <em style="color:var(--ember)">+10</em>; the index barely stirs.', ms:7000},
  {t:'curveLabels', g:'Republic +9.9%', b:'S&P 500 +0.4%', note:'DAYLIGHT BEFORE A SHOT IS FIRED', ms:1200},
  {t:'clearSub', ms:900},
  {t:'hide', id:'chartLayer', ms:1100},

  /* ── THE WAR — February 28th ── */
  {t:'timeline', at:1, ms:4400},
  {t:'lines', per:3500, arr:[
    'February 28th, 2026. With the talks still open<br>and no authorization from Congress,',
    'a president orders the strike — the enemy&rsquo;s head of state<br>killed in the opening hour.',
    'A war of choice, by one man&rsquo;s word.<br>The Strait of Hormuz slams shut; the markets convulse.'
  ]},
  {t:'summon', name:'George Washington', file:'George_Washington.jpg', src:P+'George_Washington.jpg'},
  {t:'caption', html:'The statesman who chaired a portfolio —', ms:4400},
  {t:'captionSwap', html:'returns now as <em style="color:var(--ember)">the general.</em>', ms:5000, hideAfter:true},
  {t:'sub', speaker:'Washington', html:'I will not litigate this war.<br>I was asked a different question — <em style="color:var(--ember)">who owns what sustains a life.</em>', ms:6800},
  {t:'sub', speaker:'Washington', html:'Watch what the doctrine does, now that the world burns.', ms:5400},

  /* ── THE REMAINING CURVE — the war, Feb 28 → Mar 31 ── */
  {t:'scene', r:'II', n:'The Second Witness'},
  {t:'curve', a:38, b:60, ms:8000, war:[38,60], pivot:60, lead:800, title:'THE WATCHTOWER — FEB 28 → MAR 31 · THE WAR',
     axL:'Feb 28', axM:'the war', axR:'Mar 31'},
  {t:'sub', speaker:'Washington', html:'The shock takes back some ground — but never the lead.<br>We hold near +6, while the index falls <em style="color:var(--ember)">past −7.</em>', ms:6800},
  {t:'curveLabels', g:'Republic +5.9%', b:'S&P 500 −4.5%', note:'+10.4 POINTS OF DAYLIGHT — IN ONE QUARTER', ms:600},
  {t:'sub', speaker:'Washington', html:'War does not change the map of what sustains a life.<br>War <em style="color:var(--ember)">reveals</em> it.', ms:6600, chime:true},
  {t:'clearSub', ms:800},
  {t:'card', big:true, html:'This is not George Washington.<br>This is what the machine made of him.', ms:6800, silence:true, restore:true, knell:true},
  {t:'fileback', src:P+'George_Washington.jpg', filename:'George_Washington.jpg',
    trans:'&gt; summon george washington<br>&gt; vessel: claude · medium: glass<br>&gt; a file. nothing more.', ms:5600},
  {t:'hidePortrait', ms:800}
]},

/* ═══ REEL III — THE RECKONING · the first six months, and the verdict ═══ */
{ roman:'III', title:'The Reckoning', sub:'The first six months · what the doctrine was worth', score:[
  {t:'scene', r:'III', n:'The Reckoning'},
  {t:'timeline', at:2, ms:4600},
  {t:'lines', per:4000, arr:[
    'The war ends. The index, which had crashed to −7,<br>comes roaring back.',
    'Watch all six months now, in one breath.'
  ]},
  {t:'curve', a:0, b:120, ms:10500, war:[38,60], pivot:60, cross:117, lead:1100, title:'THE WATCHTOWER — THE FIRST SIX MONTHS',
     axL:'Jan 2', axM:'Mar 31 &middot; ceasefire', axR:'Jun 26'},
  {t:'sub', scrim:true, html:'For <em style="color:var(--ember)">107 of 121</em> days the gold line led —<br>and never broke when the index fell to −7.', ms:8000},
  {t:'sub', scrim:true, html:'June&rsquo;s melt-up pulled the index level — for a week.<br>Then the tape turned, and the index <em style="color:var(--ember)">buckled.</em>', ms:7000},
  {t:'sub', scrim:true, html:'In the final days the gold line crossed back above it —<br>and <em style="color:var(--ember)">pulled away.</em>', ms:7000},
  {t:'curveLabels', g:'Republic +10.60%', b:'S&P 500 +7.27%', note:'FIRST OF THE FIELD · WITH A FIFTH HELD IN RESERVE', ms:1400},
  {t:'clearSub', ms:1000},
  {t:'sub', scrim:true, html:'It finished ahead of a roaring market — while holding<br>a <em style="color:var(--ember)">fifth of itself in Treasury bills.</em>', ms:7400},
  {t:'sub', scrim:true, html:'That fifth was not drag. It was <em style="color:var(--ember)">armor</em> —<br>and the freedom to move while others were pinned.', ms:7400},
  {t:'clearSub', ms:900},
  {t:'summon', name:'Alexander Hamilton', file:'Alexander_Hamilton.jpg', src:P+'Alexander_Hamilton.jpg'},
  {t:'sub', speaker:'Hamilton', html:'The reserve is not timidity. It is the <em style="color:var(--ember)">power to act</em><br>when others cannot.', ms:7200},
  {t:'hidePortrait', ms:900},
  {t:'card', big:true, html:'A fifth of its weight in armor —<br>and still it finished <em style="color:var(--ember)">first.</em><br>That is the doctrine, <em style="color:var(--ember)">keeping its word.</em>', ms:8200, silence:true, restore:true, knell:true},
  {t:'lines', per:4200, arr:[
    'A citizen asked the dead a question:',
    'who should own the engines of a nation?',
    'The founders answered &mdash; and the answer <em style="color:var(--ember)">held.</em>'
  ]},
  {t:'lines', per:4200, arr:[
    'But six months is only the <em>first</em> reckoning.'
  ]},
  {t:'timeline', at:3, ms:5600},
  {t:'end', a:'With the quarter closed, the founders are<br><em style="color:var(--ember)">summoned once more</em> —<br>to weigh what the doctrine has earned.', b:'The vigil continues &middot; the score kept in public.<br><span style="display:block;margin-top:1.25rem;font-family:var(--tf);font-size:.42em;letter-spacing:.34em;color:var(--ember-dim);text-transform:uppercase;">The Word against the Flood</span>', ms1:6400, ms2:6200, knell:true}
]}

];
