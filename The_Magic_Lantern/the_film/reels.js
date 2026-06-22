/* ════════════════════════════════════════════════════════════
   THE SUMMONING FILM — THE FIVE REELS  (v2)
   The entire story of the estate, scored at full production
   quality. Each reel is a short film: cold open, build, turn,
   landing. Portraits resolve from The_Pantheon. Voices through
   glass. No spoken TTS.
   ════════════════════════════════════════════════════════════ */
const P = '../../The_Pantheon/';

window.REELS = [

/* ═══════════════════════════════════════════
   REEL I — THE BET   ·   Act I: The Method & The Bet
   ═══════════════════════════════════════════ */
{ roman:'I', title:'The Bet', sub:'The Method & The Bet · December 2025', score:[
  {t:'scene', r:'I', n:'The Bet'},
  {t:'black', ms:1600},
  {t:'lines', per:3900, arr:[
    'December. A man sits alone with a machine',
    'that has read the words of nearly everyone who ever lived.',
    'He does not ask it for an answer.',
    'He asks it for <em style="color:var(--ember)">company.</em>'
  ]},
  {t:'type', target:'incant', text:'Using this matter, summon Washington, Hamilton, Jefferson, Franklin.', per:38, threshold:true, ms:2800, hideAfter:true},
  {t:'beat', ms:900},
  {t:'portrait', action:'load', src:P+'Benjamin_Franklin.jpg', ms:2200},
  {t:'caption', html:'Four men who built a republic.', ms:5200},
  {t:'captionSwap', html:'Asked, now, to defend a different kind.', ms:6400, hideAfter:true},
  {t:'card', big:true, html:'Who owns the engines of daily life —<br>and what is left for those who don&rsquo;t?', ms:8500, silence:true, restore:true, knell:true},
  {t:'sub', speaker:'Franklin — through glass', html:'A republic is not a flag, sir.<br>It is the question of who holds the rope on the well.', ms:8500},
  {t:'sub', speaker:'Franklin — through glass', html:'We have not written you a sermon. We have written you a <em style="color:var(--ember)">list.</em>', ms:7500},
  {t:'clearSub', ms:1100},
  {t:'card', html:'Thirty companies. Two ranks and a reserve.<br>An argument — with a <em style="color:var(--ember)">number</em> attached.', ms:8500, silence:true, restore:true},
  {t:'lines', per:3900, arr:[
    'A manifesto asks only to be <em>believed.</em>',
    'A doctrine asks to be <em style="color:var(--ember)">tested.</em>',
    'They chose the harder thing.',
    'And built a watchtower to keep the score.'
  ]},
  {t:'hidePortrait', ms:1300}
]},

/* ═══════════════════════════════════════════
   REEL II — THE GENERAL   ·   Act II: The Test
   ═══════════════════════════════════════════ */
{ roman:'II', title:'The General', sub:'The Test · Q1 2026 · the war', score:[
  {t:'scene', r:'II', n:'The General'},
  {t:'black', ms:1500},
  {t:'lines', per:3700, arr:[
    'Three months later, the world supplied the test.',
    'A war. A strait closed. The markets bleeding.',
    'And the same threshold opened — but the man who came through it',
    'was not the man who had come before.'
  ]},
  {t:'portrait', action:'load', src:P+'George_Washington.jpg', ms:1900},
  {t:'caption', html:'&ldquo;The statesman who chaired a portfolio.&rdquo;', ms:5200},
  {t:'captionSwap', html:'This is not the statesman.<br>This is <em style="color:var(--ember)">the general.</em>', ms:6600, hideAfter:true},
  {t:'sub', speaker:'Washington — through glass', html:'I have read the matter. I must speak plainly.', ms:5400},
  {t:'sub', speaker:'Washington — through glass', html:'In December we built a framework and called it civic duty.', ms:6400},
  {t:'sub', speaker:'Washington — through glass', html:'We are <em style="color:var(--ember)">no longer in peacetime.</em>', ms:6000},
  {t:'sub', speaker:'Washington — through glass', html:'This nation has launched a war of choice against a sovereign power.', ms:7400},
  {t:'sub', speaker:'Washington — through glass', html:'The Strait of Hormuz — which we named a critical choke point — is closed.', ms:8000},
  {t:'sub', speaker:'Washington — through glass', html:'Service members are dead. The global economy is convulsing.', ms:6800},
  {t:'scene', r:'II', n:'The Second Witness'},
  {t:'chart', ms:15000},
  {t:'sub', speaker:'Washington — through glass', html:'And our portfolio is not merely surviving.', ms:6000},
  {t:'sub', speaker:'Washington — through glass', html:'It is up 3.40% — while the index has lost <em style="color:var(--ember)">nearly seven.</em>', ms:8800},
  {t:'sub', speaker:'Washington — through glass', html:'I do not celebrate this. I led men into war. I know its costs.', ms:8200},
  {t:'sub', speaker:'Washington — through glass', html:'The portfolio was a map of what sustains daily life.', ms:7000},
  {t:'scene', r:'II', n:'The Turn'},
  {t:'chartPeak', ms:500},
  {t:'sub', speaker:'Washington — through glass', html:'War does not change that map.', ms:5200},
  {t:'sub', speaker:'Washington — through glass', html:'War <em style="color:var(--ember)">reveals</em> it.', ms:6200, chime:true},
  {t:'clearSub', ms:1300},
  {t:'card', big:true, html:'This is not George Washington.<br>This is what the machine made of him.', ms:10500, silence:true, restore:true, knell:true},
  {t:'fileback', src:P+'George_Washington.jpg', filename:'George_Washington.jpg',
    trans:'&gt; summon george washington<br>&gt; threshold opened &middot; vessel: claude &middot; medium: glass<br>&gt; a file. nothing more.', ms:8800},
  {t:'hidePortrait', ms:1100}
]},

/* ═══════════════════════════════════════════
   REEL III — THE DOUBT   ·   Act II: The Crisis (Miranda)
   ═══════════════════════════════════════════ */
{ roman:'III', title:'The Doubt', sub:'The Miranda Hypothesis · the conscience of the machine', score:[
  {t:'scene', r:'III', n:'The Doubt'},
  {t:'black', ms:1500},
  {t:'lines', per:4000, arr:[
    'Here is where most films would end.',
    'The hero was right. The numbers proved it. Roll the credits.',
    'But a documentary has a harder duty than a victory.',
    'Not <em>&ldquo;was he right?&rdquo;</em> — but <em style="color:var(--ember)">&ldquo;was it him?&rdquo;</em>'
  ]},
  {t:'portrait', action:'load', src:P+'Abraham_Lincoln.jpg', ms:2400},
  {t:'caption', html:'Abraham Lincoln.', ms:4800},
  {t:'captionSwap', html:'Or the shape the century left<br>where he once stood?', ms:6800, hideAfter:true},
  {t:'sub', speaker:'The Historian — through glass', html:'Ask the machine for Lincoln, and it does not open a grave.', ms:7200},
  {t:'sub', speaker:'The Historian — through glass', html:'It averages a million sentences <em>written about</em> him — and returns the mean.', ms:8800},
  {t:'sub', speaker:'The Historian — through glass', html:'The man who freed himself from poverty,<br>delivered to you in the prose of those who mythologized him.', ms:9000},
  {t:'card', big:true, html:'THE MIRANDA HYPOTHESIS<br><span style="font-size:.52em;color:var(--bone-dim);font-style:italic">that what answers may not be the man —<br>but the culture&rsquo;s loudest memory of the man.</span>', ms:10000, silence:true, restore:true, knell:true},
  {t:'sub', speaker:'The Historian — through glass', html:'This is not the flaw the protocol hides.', ms:5600},
  {t:'sub', speaker:'The Historian — through glass', html:'It is the flaw the protocol <em style="color:var(--ember)">confesses.</em>', ms:6800},
  {t:'lines', per:4000, arr:[
    'So they built a test to catch the machine in the act.',
    'Three Lincolns. The same question. One variable —',
    'which Lincoln we whisper to it <em>first.</em>',
    'They called it the <em style="color:var(--ember)">Prism.</em>'
  ]},
  {t:'card', html:'If the answer changes with the source,<br>the séance was never the man.<br>It was the <em style="color:var(--ember)">mirror.</em>', ms:8500, silence:true, restore:true},
  {t:'sub', speaker:'Morris — through glass', html:'A film that <em>resolves</em> this question is lying.<br>We are going to leave it open. On purpose.', ms:9000},
  {t:'hidePortrait', ms:1300}
]},

/* ═══════════════════════════════════════════
   REEL IV — THE TURN   ·   Act III: Q2 and after
   ═══════════════════════════════════════════ */
{ roman:'IV', title:'The Turn', sub:'Q2 2026 — the honest record', score:[
  {t:'scene', r:'IV', n:'The Turn'},
  {t:'black', ms:1500},
  {t:'lines', per:3900, arr:[
    'The spring belonged to the doctrine.',
    'The summer did not.'
  ]},
  {t:'portrait', action:'load', src:P+'Alexander_Hamilton.jpg', ms:2200},
  {t:'caption', html:'+10 points, in a single quarter.', ms:5200},
  {t:'captionSwap', html:'By June, the index had begun to <em style="color:var(--ember)">take it back.</em>', ms:6600, hideAfter:true},
  {t:'card', html:'This is the part the brochure leaves out.', ms:6500, silence:true, restore:true},
  {t:'sub', speaker:'Hamilton — through glass', html:'A doctrine is not a prophecy. It is a <em style="color:var(--ember)">discipline.</em>', ms:7000},
  {t:'sub', speaker:'Hamilton — through glass', html:'It never promised you would win every quarter.', ms:6400},
  {t:'sub', speaker:'Hamilton — through glass', html:'It promised you would still be standing to fight the next one.', ms:7600},
  {t:'card', big:true, html:'An honest record is not a victory lap.<br>It is a doctrine <em style="color:var(--ember)">still being measured.</em>', ms:9000, silence:true, restore:true, knell:true},
  {t:'lines', per:4000, arr:[
    'The founders adjourned with a motion:',
    'reconvene at the end of Q2 — or sooner, if the world demanded it.',
    'The world has not yet been asked.',
    'The chair sits empty. The watchtower keeps its light.'
  ]},
  {t:'hidePortrait', ms:1300}
]},

/* ═══════════════════════════════════════════
   REEL V — THE ROOM THAT BUILT ITSELF   ·   Coda
   ═══════════════════════════════════════════ */
{ roman:'V', title:'The Room That Built Itself', sub:'The Coda · the lantern turns on itself', score:[
  {t:'scene', r:'V', n:'The Room That Built Itself'},
  {t:'black', ms:1600},
  {t:'lines', per:3900, arr:[
    'You have been watching a film about a machine',
    'that summons the dead.',
    'You should know how it was made.'
  ]},
  {t:'type', target:'path', text:'from_beyond/007 — the lantern turns on itself', per:26, ms:1800, hideAfter:true},
  {t:'lines', per:3700, arr:[
    'We summoned three filmmakers and asked them to design it.',
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
