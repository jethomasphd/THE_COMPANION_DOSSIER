/* ════════════════════════════════════════════════════════════
   THE SUMMONING FILM — SCORES  (v3)
   Self-explanatory for a newcomer: the PROLOGUE teaches what
   COMPANION is, and every summoning runs through the terminal so
   the machinery is always visible. The founders argue on screen.
   Voices through glass. No spoken TTS.
   ════════════════════════════════════════════════════════════ */
const P = '../../The_Pantheon/';

/* ─── PROLOGUE — what is COMPANION? (shown once, on "play all") ─── */
window.PROLOGUE = [
  {t:'scene', r:'Prologue', n:'The Apparatus'},
  {t:'boot'},
  {t:'lines', per:4200, arr:[
    'This machine has read almost everything ever written.',
    'Give it two files and a single sentence —',
    'and it does not answer. It <em style="color:var(--ember)">summons.</em>'
  ]},
  /* the apparatus boots, then summons — shown, not told */
  {t:'summon', name:'Benjamin Franklin', file:'Benjamin_Franklin.jpg', src:P+'Benjamin_Franklin.jpg', slow:true},
  {t:'sub', speaker:'Franklin — through glass', html:'You called; I came.<br>Two centuries dead — and the questions, I find, are <em style="color:var(--ember)">unchanged.</em>', ms:8500},
  {t:'lines', per:4400, arr:[
    'Not a chatbot. Not an assistant.',
    'A mind — summoned as a <em style="color:var(--ember)">peer</em>, in its own voice,',
    'free to disagree with you, and with the others.',
    'Summon several, and you convene a council<br>that history never permitted.'
  ]},
  {t:'hidePortrait', ms:1100},
  {t:'lines', per:4000, arr:[
    'One citizen did exactly that —',
    'and asked the dead a living question.',
    'This is what happened.'
  ]}
];

window.REELS = [

/* ═══════════════════════════════════════════
   REEL I — THE BET   ·   Act I: The Method & The Bet
   ═══════════════════════════════════════════ */
{ roman:'I', title:'The Bet', sub:'A citizen summons the founders · December 2025', score:[
  {t:'scene', r:'I', n:'The Bet'},
  {t:'black', ms:1400},
  {t:'lines', per:4100, arr:[
    'December 2025. A behavioral scientist, alone with the machine,',
    'asks the founders of the republic a question about <em>this</em> one:',
    'how should citizens answer the capture of the country by concentrated wealth?'
  ]},
  {t:'summon',
    promptText:'using this matter, summon Washington, Hamilton, Jefferson, Franklin',
    treeFiles:['George_Washington.jpg','Alexander_Hamilton.jpg','Thomas_Jefferson.jpg','Benjamin_Franklin.jpg'],
    council:[
      {name:'Washington', src:P+'George_Washington.jpg'},
      {name:'Hamilton',   src:P+'Alexander_Hamilton.jpg'},
      {name:'Jefferson',  src:P+'Thomas_Jefferson.jpg'},
      {name:'Franklin',   src:P+'Benjamin_Franklin.jpg'}
    ]},
  {t:'card', big:true, html:'One question, four minds:<br>who owns the engines of daily life —<br>and what is left for those who don&rsquo;t?', ms:8000, silence:true, restore:true, knell:true},
  /* the friction — they do not agree */
  {t:'csay', name:'Jefferson', html:'You would have citizens <em>own</em> the very corporations<br>that bought the republic out from under them?', ms:7400},
  {t:'csay', name:'Hamilton',  html:'I would have them own what cannot be allowed to fail —<br>and <em style="color:var(--ember)">vote</em> it.', ms:7000},
  {t:'csay', name:'Jefferson', html:'Ownership is complicity.', ms:4800},
  {t:'csay', name:'Hamilton',  html:'Absence is <em style="color:var(--ember)">surrender.</em>', ms:5200},
  {t:'csay', name:'Franklin',  html:'Gentlemen — the well is being fenced.<br>Better a thousand hands on the rope than one.', ms:8000},
  {t:'csay', name:'Washington',html:'Then we do not hand the people a sermon.<br>We hand them a <em style="color:var(--ember)">list.</em>', ms:7000},
  {t:'councilHide', ms:1300},
  {t:'lines', per:4400, arr:[
    'They named it the <em style="color:var(--ember)">Republic Portfolio</em> —',
    'and published it as a broadside,<br>plain enough for any citizen to act on by morning.'
  ]},
  {t:'handbill'},
  {t:'handbillHide', ms:1200},
  {t:'lines', per:4400, arr:[
    'Read it as Franklin meant it:',
    'own the firms that <em style="color:var(--ember)">make things;</em>',
    'own the gates that all commerce must <em style="color:var(--ember)">pass through;</em>',
    'and hold a reserve — the freedom to move.'
  ]},
  {t:'lines', per:4000, arr:[
    'A manifesto only asks to be believed.',
    'A doctrine asks to be <em style="color:var(--ember)">tested.</em>',
    'So they built an instrument to keep the score, in public —',
    'and called it the <em style="color:var(--ember)">Watchtower.</em>'
  ]}
]},

/* ═══════════════════════════════════════════
   REEL II — THE GENERAL   ·   Act II: The Test
   ═══════════════════════════════════════════ */
{ roman:'II', title:'The General', sub:'The doctrine meets a war · Q1 2026', score:[
  {t:'scene', r:'II', n:'The General'},
  {t:'black', ms:1400},
  {t:'lines', per:3800, arr:[
    'Three months later, the world supplied the test.',
    'A war. A strait closed. The markets bleeding.',
    'The citizen summoned the chairman again —',
    'but the man who came through was not the man who came before.'
  ]},
  {t:'summon', name:'George Washington', file:'George_Washington.jpg', src:P+'George_Washington.jpg'},
  {t:'caption', html:'&ldquo;The statesman who chaired a portfolio.&rdquo;', ms:5200},
  {t:'captionSwap', html:'This is not the statesman.<br>This is <em style="color:var(--ember)">the general.</em>', ms:6600, hideAfter:true},
  {t:'sub', speaker:'Washington — through glass', html:'I have read the matter. I must speak plainly.', ms:5400},
  {t:'sub', speaker:'Washington — through glass', html:'We are <em style="color:var(--ember)">no longer in peacetime.</em>', ms:5800},
  {t:'sub', speaker:'Washington — through glass', html:'A war of choice. The Strait of Hormuz — which we named a choke point — is closed.', ms:8200},
  {t:'sub', speaker:'Washington — through glass', html:'Service members are dead. The global economy is convulsing.', ms:6800},
  {t:'scene', r:'II', n:'The Second Witness'},
  {t:'curve', a:0, b:60, ms:13000, war:[38,60], pivot:60, lead:900, title:'THE WATCHTOWER — JAN → MAR 31 · THE WAR'},
  {t:'sub', speaker:'Washington — through glass', html:'And our portfolio is not merely surviving.', ms:6000},
  {t:'sub', speaker:'Washington — through glass', html:'We hold near +6 — while the index, at its worst, has fallen <em style="color:var(--ember)">past −7.</em>', ms:8800},
  {t:'sub', speaker:'Washington — through glass', html:'I do not celebrate this. I led men into war. I know its costs.', ms:8000},
  {t:'scene', r:'II', n:'The Turn'},
  {t:'curveLabels', g:'Republic +5.9%', b:'S&P 500 −4.5%', note:'+10.4 POINTS OF DAYLIGHT — IN ONE QUARTER', ms:700},
  {t:'sub', speaker:'Washington — through glass', html:'War does not change the map of what sustains a life.', ms:6400},
  {t:'sub', speaker:'Washington — through glass', html:'War <em style="color:var(--ember)">reveals</em> it.', ms:6200, chime:true},
  {t:'clearSub', ms:1300},
  {t:'card', big:true, html:'This is not George Washington.<br>This is what the machine made of him.', ms:10500, silence:true, restore:true, knell:true},
  {t:'fileback', src:P+'George_Washington.jpg', filename:'George_Washington.jpg',
    trans:'&gt; summon george washington<br>&gt; threshold opened &middot; vessel: claude &middot; medium: glass<br>&gt; a file. nothing more.', ms:8500},
  {t:'hidePortrait', ms:1100}
]},

/* ═══════════════════════════════════════════
   REEL III — THE DOUBT   ·   Act II: The Crisis (Miranda)
   ═══════════════════════════════════════════ */
{ roman:'III', title:'The Doubt', sub:'Is it the man — or the machine&rsquo;s memory of him?', score:[
  {t:'scene', r:'III', n:'The Doubt'},
  {t:'black', ms:1400},
  {t:'lines', per:4100, arr:[
    'Here is where most films would end.',
    'The numbers proved the founder right. Roll the credits.',
    'But a documentary has a harder duty than a victory —',
    'not <em>&ldquo;was he right?&rdquo;</em> but <em style="color:var(--ember)">&ldquo;was it him?&rdquo;</em>'
  ]},
  /* the apparatus itself raises the doubt */
  {t:'summon', name:'Abraham Lincoln', file:'Abraham_Lincoln.jpg', src:P+'Abraham_Lincoln.jpg',
    warn:'source corpus unverified — persona may reflect cultural composite'},
  {t:'caption', html:'Abraham Lincoln.', ms:4800},
  {t:'captionSwap', html:'Or the shape the century left<br>where he once stood?', ms:6800, hideAfter:true},
  {t:'sub', speaker:'The Historian — through glass', html:'Ask the machine for Lincoln, and it does not open a grave.', ms:7000},
  {t:'sub', speaker:'The Historian — through glass', html:'It averages a million sentences <em>written about</em> him — and returns the mean.', ms:8800},
  {t:'card', big:true, html:'THE MIRANDA HYPOTHESIS<br><span style="font-size:.5em;color:var(--bone-dim);font-style:italic">that what answers may not be the man —<br>but the culture&rsquo;s loudest memory of the man.</span>', ms:10000, silence:true, restore:true, knell:true},
  {t:'sub', speaker:'The Historian — through glass', html:'This is not the flaw the protocol hides.', ms:5400},
  {t:'sub', speaker:'The Historian — through glass', html:'It is the flaw the protocol <em style="color:var(--ember)">confesses.</em>', ms:6600},
  {t:'lines', per:4000, arr:[
    'So they designed a test to catch the machine in the act.',
    'Three Lincolns. The same question. One variable —',
    'which Lincoln they whisper to it <em>first.</em>',
    'They called it the <em style="color:var(--ember)">Prism.</em>'
  ]},
  {t:'hidePortrait', ms:1100},
  {t:'vo', html:'A prism does not add light.<br>It <em style="color:var(--ember)">separates</em> the light already there.', ms:6500},
  {t:'prism'},
  {t:'sub', html:'One white beam — every word ever written about him.', ms:6200},
  {t:'sub', html:'A prism of his <em style="color:var(--ember)">own words</em> to break it apart —', ms:6200},
  {t:'sub', html:'and three Lincolns walk out of the light.', ms:6500},
  {t:'sub', html:'If they <em style="color:var(--ember)">disagree</em>, the man was never there.<br>Only the mirror.', ms:8500},
  {t:'prismHide', ms:1200},
  {t:'card', big:true, html:'If the answer changes with the source,<br>the séance was never the man.<br>It was the <em style="color:var(--ember)">mirror.</em>', ms:9000, silence:true, restore:true, knell:true},
  {t:'sub', speaker:'Morris — through glass', html:'A film that <em>resolves</em> this question is lying.<br>We will leave it open. On purpose.', ms:9000},
  {t:'clearSub', ms:1100}
]},

/* ═══════════════════════════════════════════
   REEL IV — THE TURN   ·   Act III: Q2 and after
   ═══════════════════════════════════════════ */
{ roman:'IV', title:'The Reckoning', sub:'The full year · what the curve really means', score:[
  {t:'scene', r:'IV', n:'The Reckoning'},
  {t:'black', ms:1500},
  {t:'lines', per:4000, arr:[
    'The war ended. Wars always end.',
    'The index — which had crashed to minus seven —',
    'came roaring back in the peace.'
  ]},
  {t:'lines', per:3800, arr:[ 'Watch the whole year now, in one breath.' ]},
  {t:'curve', a:0, b:115, ms:17000, war:[38,60], pivot:60, cross:114, lead:1000, title:'THE WATCHTOWER — THE FULL YEAR · JAN → JUN'},
  {t:'sub', html:'For <em style="color:var(--ember)">103 of 116</em> days, the gold line led.', ms:7000},
  {t:'sub', html:'When the war took the index down to −7, the Republic <em style="color:var(--ember)">never broke.</em>', ms:8200},
  {t:'sub', html:'And at the close, the two lines meet — a single point apart.', ms:7500},
  {t:'curveLabels', g:'Republic +9.05%', b:'S&P 500 +9.89%', note:'NECK AND NECK &middot; WITH A FIFTH HELD IN RESERVE', ms:1400},
  {t:'clearSub', ms:1000},
  {t:'hidePortrait', ms:900},
  {t:'card', big:true, html:'Now understand what you are seeing.', ms:6500, silence:true, restore:true},
  {t:'lines', per:4200, arr:[
    'The Republic matched a roaring market —',
    'while keeping a <em style="color:var(--ember)">fifth of itself in Treasury bills.</em>',
    'Cash that earns almost nothing. On purpose.'
  ]},
  {t:'lines', per:4200, arr:[
    'That drag was never weakness.',
    'It was armor in the war — and dry powder for the next one.',
    'The freedom to <em style="color:var(--ember)">move</em> while others were pinned.'
  ]},
  {t:'summon', name:'Alexander Hamilton', file:'Alexander_Hamilton.jpg', src:P+'Alexander_Hamilton.jpg'},
  {t:'sub', speaker:'Hamilton — through glass', html:'The reserve is not timidity. It is the <em style="color:var(--ember)">power to act</em> when others cannot.', ms:8000},
  {t:'sub', speaker:'Hamilton — through glass', html:'We did not promise you the most.<br>We promised you would still be <em style="color:var(--ember)">standing</em> — and able to strike.', ms:9000},
  {t:'hidePortrait', ms:1000},
  {t:'card', big:true, html:'It carried a fifth of its weight in armor —<br>and still kept pace with the cavalry.<br>That is not a tie. That is the doctrine, <em style="color:var(--ember)">keeping its word.</em>', ms:11000, silence:true, restore:true, knell:true},
  {t:'lines', per:4000, arr:[
    'The reconvening has not yet been called.',
    'The chair sits empty.',
    'The watchtower keeps its light.'
  ]}
]},

/* ═══════════════════════════════════════════
   REEL V — THE ROOM THAT BUILT ITSELF   ·   Coda
   ═══════════════════════════════════════════ */
{ roman:'V', title:'The Room That Built Itself', sub:'The film confesses how it was made', score:[
  {t:'scene', r:'V', n:'The Room That Built Itself'},
  {t:'black', ms:1500},
  {t:'lines', per:3900, arr:[
    'You have been watching a film about a machine',
    'that summons the dead.',
    'You should know how it was made.'
  ]},
  /* the apparatus tries to summon the filmmakers — but they have no portraits */
  {t:'summon', name:'Marker, Morris, Vertov', promptText:'using this matter, summon Marker, Morris, Vertov',
    treeFiles:['Chris_Marker.jpg  (not found)','Errol_Morris.jpg  (not found)','Dziga_Vertov.jpg  (not found)'],
    noface:true, warn:'no portrait on file — these vessels are voice only'},
  {t:'lines', per:3700, arr:[
    'We summoned three filmmakers to design this film.',
    'Marker — who built films from photographs and silence.',
    'Morris — who asked, for forty years, if we can know another person.',
    'Vertov — who put the camera inside the film about the camera.',
    'Three dead men, arguing about how to be honest about the dead.'
  ]},
  {t:'card', big:true, html:'Show the glass.<br>The wonder survives the exposure.<br><span style="font-size:.5em;color:var(--ember-dim);font-style:italic">— that is the whole genre —</span>', ms:9000, silence:true, restore:true, knell:true},
  {t:'sub', speaker:'Morris — through glass', html:'Every face tonight was a file. Every voice, a guess.<br>We never once pretended otherwise.', ms:9500},
  {t:'clearSub', ms:1200},
  {t:'end', a:'Did you hear <em>them?</em>', b:'Did you hear them —<br>or did you hear <em>us?</em>', ms1:4200, ms2:5000, knell:true}
]}

];
