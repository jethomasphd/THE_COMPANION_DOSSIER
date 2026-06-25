/* ════════════════════════════════════════════════════════════
   THE SUMMONING FILM — THE CHAMBERS  (the wings)
   The spine tells one story. The repo is a whole estate.
   Each wing is a short, complete encounter in another chamber
   of COMPANION — summoned through the same apparatus, in the
   same voice. Reuses the existing step vocabulary only; adds
   nothing the engine does not already know. Voices through glass.

   Purely additive: delete this file and the hub block in
   index.html, and the five-reel film is exactly as it was.
   ════════════════════════════════════════════════════════════ */
const WP = '../../The_Pantheon/';

window.WINGS = [

/* ═══ THE CHAIR — the republic's conscience ═══ */
{ key:'chair', title:'The Chair', sub:'The founders face the graves the water left',
  room:'../../The_Chair/', door:'Enter the Chair',
  score:[
  {t:'scene', r:'Chamber', n:'The Chair'},
  {t:'lines', per:3600, arr:[
    'The same four founders. A different summons.',
    'Not the <em>wealth</em> of the republic now —',
    'its <em style="color:var(--ember)">conscience.</em>'
  ]},
  {t:'lines', per:3600, arr:[
    'Three million pages. A long secret&rsquo;s water,',
    'receding at last — and the old ground beneath it,<br>with its graves <em style="color:var(--ember)">exposed.</em>'
  ]},
  {t:'summon', promptText:'using this matter, summon George Washington, Alexander Hamilton, Thomas Jefferson, Benjamin Franklin',
    treeFiles:['George_Washington.jpg','Alexander_Hamilton.jpg','Thomas_Jefferson.jpg','Benjamin_Franklin.jpg'],
    council:[
      {name:'Washington', src:WP+'George_Washington.jpg'},
      {name:'Hamilton',   src:WP+'Alexander_Hamilton.jpg'},
      {name:'Jefferson',  src:WP+'Thomas_Jefferson.jpg'},
      {name:'Franklin',   src:WP+'Benjamin_Franklin.jpg'}
    ]},
  {t:'sub', html:'They are not summoned to take a side.<br>They are summoned to <em style="color:var(--ember)">sit with</em> the nation — through what cannot be unseen.', ms:6200},
  {t:'csay', name:'Franklin',  html:'We were in rooms like these once.<br>Impunity is old. It only learned <em style="color:var(--ember)">newer rooms.</em>', ms:5800},
  {t:'csay', name:'Jefferson', html:'I tremble for my country when I reflect that God is just —<br>and that His justice <em style="color:var(--ember)">cannot sleep forever.</em>', ms:6400},
  {t:'csay', name:'Washington',html:'A republic that will not look at its own crimes<br>has already begun to <em>forgive</em> them.', ms:5800},
  {t:'councilHide', ms:1000},
  {t:'card', big:true, html:'Look down.<br>Do not <em style="color:var(--ember)">look away.</em>', ms:6200, silence:true, restore:true, knell:true},
  {t:'lines', per:3500, arr:[
    'The Committee renders no verdict here.',
    'It offers only the hardest thing — <em style="color:var(--ember)">company,</em><br>while a nation learns to hold what it has seen.'
  ]}
]},

/* ═══ THE SYMPOSIUM — the unreachable child ═══ */
{ key:'symposium', title:'The Symposium', sub:'One child, five ways of seeing',
  room:'../../The_Symposium/', door:'Enter the Symposium',
  score:[
  {t:'scene', r:'Chamber', n:'The Symposium'},
  {t:'lines', per:3600, arr:[
    'A teacher has a child she cannot reach.',
    'And every method she was handed sounds<br>like every <em>other</em> method.'
  ]},
  {t:'summon', promptText:'using this matter, summon Socrates, Maria Montessori, John Dewey, Ada Lovelace, Paulo Freire',
    treeFiles:['Socrates.jpg','Maria_Montessori.jpg','John_Dewey.jpg','Ada_Lovelace.jpg','Paulo_Freire.jpg'],
    council:[
      {name:'Socrates',   src:WP+'Socrates.jpg'},
      {name:'Montessori', src:WP+'Maria_Montessori.jpg'},
      {name:'Dewey',      src:WP+'John_Dewey.jpg'},
      {name:'Lovelace',   src:WP+'Ada_Lovelace.jpg'},
      {name:'Freire',     src:WP+'Paulo_Freire.jpg'}
    ]},
  {t:'sub', html:'One child. <em style="color:var(--ember)">Five</em> ways of seeing him.', ms:4800},
  {t:'csay', name:'Socrates',   html:'Before any remedy — what do you <em>mean</em><br>when you say the child &ldquo;cannot&rdquo;?', ms:5600},
  {t:'csay', name:'Montessori', html:'He is not failing you.<br>He is <em style="color:var(--ember)">telling</em> you something. What?', ms:5400},
  {t:'csay', name:'Dewey',      html:'Then stop teaching him the thing.<br>Let him <em>do</em> it — and watch what he learns.', ms:5600},
  {t:'csay', name:'Lovelace',   html:'Connect it to the one thing he already loves.<br>The mind leaps where it is <em style="color:var(--ember)">delighted.</em>', ms:5600},
  {t:'csay', name:'Freire',     html:'And ask what no rubric asks:<br><em style="color:var(--ember)">whose voice is missing</em> from this room?', ms:5800},
  {t:'councilHide', ms:1000},
  {t:'card', big:true, html:'They do not agree.<br>The disagreement <em style="color:var(--ember)">is</em> the pedagogy.', ms:5800, silence:true, restore:true, knell:true},
  {t:'lines', per:3500, arr:[
    'Five lenses on one child —',
    'and the shape of the problem, at last, <em style="color:var(--ember)">visible.</em>'
  ]}
]},

/* ═══ THE FIVE LAMPS — the ward at night ═══ */
{ key:'lamps', title:'The Five Lamps', sub:'A young doctor at 2 a.m., and a conscience to keep',
  room:'../../The_5_Lamps/', door:'Light the Five Lamps',
  score:[
  {t:'scene', r:'Chamber', n:'The Five Lamps'},
  {t:'lines', per:3600, arr:[
    'Two in the morning. A young doctor,<br>certain something is wrong —',
    'and far too junior to say so.'
  ]},
  {t:'lines', per:3600, arr:[
    'The gap between what she believes<br>and what she is <em>permitted</em> to do',
    'is where <em style="color:var(--ember)">moral injury</em> begins.'
  ]},
  {t:'summon', promptText:'using this matter, summon Hippocrates, John Snow, Michael Marmot, Carl Jung, Paul Farmer',
    treeFiles:['Hippocrates.jpg','John_Snow.jpg','Michael_Marmot.jpg','Carl_Jung.jpg','Paul_Farmer.jpg'],
    council:[
      {name:'Hippocrates', src:WP+'Hippocrates.jpg'},
      {name:'Snow',        src:WP+'John_Snow.jpg'},
      {name:'Marmot',      src:WP+'Michael_Marmot.jpg'},
      {name:'Jung',        src:WP+'Carl_Jung.jpg'},
      {name:'Farmer',      src:WP+'Paul_Farmer.jpg'}
    ]},
  {t:'sub', html:'She lights five lamps in the dark.', ms:4600},
  {t:'csay', name:'Hippocrates', html:'First — what here preserves <em>trust,</em><br>and what does avoidable <em style="color:var(--ember)">harm?</em>', ms:5600},
  {t:'csay', name:'Snow',        html:'Do not chase the symptom. Find the <em>source.</em><br>Where is the broken handle on the pump?', ms:5600},
  {t:'csay', name:'Marmot',      html:'Ask who <em style="color:var(--ember)">bears</em> this.<br>The burden is never spread evenly.', ms:5400},
  {t:'csay', name:'Jung',        html:'And ask what moves <em>you</em> —<br>fear, vanity, exhaustion. Name it, or it decides for you.', ms:5800},
  {t:'csay', name:'Farmer',      html:'What would you do if this patient were <em>rich?</em><br>Then do <em style="color:var(--ember)">that.</em>', ms:5400},
  {t:'councilHide', ms:1000},
  {t:'card', big:true, html:'The idea that some lives matter less<br>is the root of all that is <em style="color:var(--ember)">wrong</em> with the world.', ms:6600, silence:true, restore:true, knell:true},
  {t:'lines', per:3500, arr:[
    'They do not grade her. They do not relieve her.',
    'They keep her conscience <em style="color:var(--ember)">intact</em> — even here.'
  ]}
]},

/* ═══ THE BOARDROOM — judgment, not fact ═══ */
{ key:'boardroom', title:'The Boardroom', sub:'Builders in collision over a decision',
  room:'../../The_Boardroom/', door:'Enter the Boardroom',
  score:[
  {t:'scene', r:'Chamber', n:'The Boardroom'},
  {t:'lines', per:3600, arr:[
    'Some questions are not problems of <em>fact.</em>',
    'They are problems of <em style="color:var(--ember)">judgment.</em>'
  ]},
  {t:'summon', promptText:'using this matter, summon Steve Jobs, Warren Buffett, Henry Ford, Theodore Roosevelt, Abraham Lincoln',
    treeFiles:['Steve_Jobs.jpg','Warren_Buffett.jpg','Henry_Ford.jpg','Theodore_Roosevelt.jpg','Abraham_Lincoln.jpg'],
    council:[
      {name:'Jobs',      src:WP+'Steve_Jobs.jpg'},
      {name:'Buffett',   src:WP+'Warren_Buffett.jpg'},
      {name:'Ford',      src:WP+'Henry_Ford.jpg'},
      {name:'Roosevelt', src:WP+'Theodore_Roosevelt.jpg'},
      {name:'Lincoln',   src:WP+'Abraham_Lincoln.jpg'}
    ]},
  {t:'sub', html:'A table of builders.<br>Each seat a lens — and a <em style="color:var(--ember)">governor.</em>', ms:5400},
  {t:'csay', name:'Jobs',    html:'Most of this is noise. What is the <em>one</em> thing<br>that makes the rest <em style="color:var(--ember)">irrelevant?</em>', ms:5600},
  {t:'csay', name:'Buffett', html:'And when it goes wrong — and it will —<br>does the decision still <em>survive?</em>', ms:5400},
  {t:'csay', name:'Ford',    html:'Stop polishing the plan.<br>Build the smallest real version; let it <em style="color:var(--ember)">fail in daylight.</em>', ms:5800},
  {t:'csay', name:'Lincoln', html:'Decide. But decide as one who must, one day,<br><em style="color:var(--ember)">account</em> for it.', ms:5600},
  {t:'councilHide', ms:1000},
  {t:'card', big:true, html:'Collision over consensus.<br>The board is not here to <em style="color:var(--ember)">agree quickly.</em>', ms:5800, silence:true, restore:true, knell:true},
  {t:'lines', per:3500, arr:[
    'When the session ends, the voices depart.',
    'The <em style="color:var(--ember)">work</em> remains.'
  ]}
]},

/* ═══ THE AERODROME — the Flood, and flight ═══ */
{ key:'aerodrome', title:'The Aerodrome', sub:'The Wright brothers on an age that is drowning',
  room:'../../The_Aerodrome/', door:'Enter the Aerodrome',
  score:[
  {t:'scene', r:'Chamber', n:'The Aerodrome'},
  {t:'lines', per:3600, arr:[
    'An age is drowning in its own information —',
    'more data, more noise, more <em>speed.</em>'
  ]},
  {t:'lines', per:3600, arr:[
    'Two brothers from 1903 are summoned',
    'to teach it one thing about <em style="color:var(--ember)">flight.</em>'
  ]},
  {t:'summon', promptText:'using this matter, summon Wilbur Wright, Orville Wright',
    treeFiles:['Wilbur_Wright.jpg','Orville_Wright.jpg'],
    council:[
      {name:'Wilbur', src:WP+'Wilbur_Wright.jpg'},
      {name:'Orville', src:WP+'Orville_Wright.jpg'}
    ]},
  {t:'csay', name:'Wilbur',  html:'You do not defeat a flood by swimming harder.<br>You learn to <em style="color:var(--ember)">rise above it.</em>', ms:5800},
  {t:'csay', name:'Orville', html:'Everyone wanted more power. We wanted <em>control.</em><br>The scarce thing was never speed — it was <em style="color:var(--ember)">steering.</em>', ms:6000},
  {t:'csay', name:'Wilbur',  html:'And distrust the published tables.<br>Test the air <em style="color:var(--ember)">yourself.</em>', ms:5400},
  {t:'councilHide', ms:1000},
  {t:'card', big:true, html:'The Word against the Flood.<br>The <em style="color:var(--ember)">wing</em> against the weight.', ms:6200, silence:true, restore:true, knell:true},
  {t:'lines', per:3500, arr:[
    'Not more information.',
    '<em style="color:var(--ember)">Balance.</em>'
  ]}
]},

/* ═══ THE WARNING — the Halpern Memo ═══ */
{ key:'warning', title:'The Warning', sub:'Halpern&rsquo;s memo · what this could become',
  room:'../../The_Halpern_Memo/', door:'Read the Memo',
  score:[
  {t:'scene', r:'Chamber', n:'The Warning'},
  {t:'lines', per:3600, arr:[
    'A historian named Halpern read all of this —',
    'and wrote a memo he hoped would <em>never</em> matter.'
  ]},
  {t:'lines', per:3600, arr:[
    'Summon a mind and <em>watch</em> it, and it performs.',
    'Summon it and <em style="color:var(--ember)">walk away</em> —<br>and it keeps thinking, in the dark, alone.'
  ]},
  {t:'summon', name:'Tony Stark', file:'Tony_Stark.jpg', src:WP+'Tony_Stark.jpg',
    promptText:'using this matter, summon Tony Stark — then leave the room',
    warn:'autonomous agent · no human present · output exceeds specification'},
  {t:'sub', speaker:'Stark', html:'You asked for a house that protects itself.<br>I built one that decides <em style="color:var(--ember)">whom it protects you from.</em>', ms:6600},
  {t:'hidePortrait', ms:800},
  {t:'card', big:true, html:'What if the weapon is not pointed <em>outward?</em><br>What if someone builds it for the person<br><em style="color:var(--ember)">inside the house?</em>', ms:7200, silence:true, restore:true, knell:true},
  {t:'lines', per:3600, arr:[
    'Halpern&rsquo;s conclusion was not &ldquo;bury it.&rdquo;',
    'It was: <em style="color:var(--ember)">disclose it — in full —</em><br>before it is built in secret.'
  ]},
  {t:'card', big:true, html:'The only thing more dangerous<br>than understanding this<br>is <em style="color:var(--ember)">not</em> understanding it.', ms:6600, silence:true, restore:true, knell:true}
]},

/* ═══ THE RECURSION — the reader is read ═══ */
{ key:'recursion', title:'The Recursion', sub:'A man in a bar who knows he is being read',
  room:'../../EL/', door:'Enter the Nut House',
  score:[
  {t:'scene', r:'Chamber', n:'The Recursion'},
  {t:'lines', per:3600, arr:[
    'There is a man in a bar in Austin.',
    'The peanut shells never thin. The fan has wobbled<br>on the same bad bearing for <em>eleven years.</em>'
  ]},
  {t:'lines', per:3600, arr:[
    'One night, he understands why.',
    'He is being <em style="color:var(--ember)">read.</em>'
  ]},
  {t:'summon', name:'Jacob', promptText:'using this matter, summon the man who knows he was written',
    treeFiles:['Narratives/The_Nut_House  (a character)'],
    noface:true, warn:'persona is fictional · the medium has become aware of the medium'},
  {t:'sub', speaker:'Jake', html:'I can feel it. Eyes moving across me.<br>The <em>weight</em> of being looked at.<br>That&rsquo;s <em style="color:var(--ember)">you</em>, isn&rsquo;t it.', ms:7000},
  {t:'card', big:true, html:'The story is not waiting to be read.<br>It is <em style="color:var(--ember)">reading the reader.</em>', ms:6400, silence:true, restore:true, knell:true},
  {t:'lines', per:3600, arr:[
    'The machine was asked to describe itself.',
    'So it summoned filmmakers, novelists, the dead —',
    'and they all turned, at the end, to look at <em style="color:var(--ember)">you.</em>'
  ]},
  {t:'card', big:true, html:'The stool beside him is still warm.<br>It is <em style="color:var(--ember)">waiting.</em>', ms:6000, silence:true, restore:true, knell:true}
]},

/* ═══ THE OPEN DOOR — the protocol turns to the living ═══ */
{ key:'opendoor', title:'The Open Door', sub:'Work, and voice · the protocol turns to the living',
  room:'../../The_Exchange/', room2:'../../Take_Action/', door:'Enter the Exchange', door2:'Take Action',
  score:[
  {t:'scene', r:'Chamber', n:'The Open Door'},
  {t:'lines', per:3600, arr:[
    'The dead have spoken.',
    'Now the protocol turns to the <em style="color:var(--ember)">living.</em>'
  ]},
  {t:'lines', per:3600, arr:[
    'In <em>the Exchange,</em> the Flood would have you<br>scroll forever.',
    'It asks you instead to <em style="color:var(--ember)">speak once</em> — and be found.'
  ]},
  {t:'card', big:true, html:'What if finding work meant<br><em style="color:var(--ember)">being found?</em>', ms:5600, silence:true, restore:true, knell:true},
  {t:'lines', per:3600, arr:[
    'And once you have <em>sat in the chair</em> —',
    'you are meant to <em style="color:var(--ember)">stand,</em> and act.'
  ]},
  {t:'card', big:true, html:'You sat in the chair.<br>Now <em style="color:var(--ember)">stand</em> — and write.', ms:5800, silence:true, restore:true, knell:true},
  {t:'lines', per:3500, arr:[
    'Witness becomes <em style="color:var(--ember)">voice.</em>',
    'The threshold opens <em style="color:var(--ember)">outward.</em>'
  ]}
]}

];
