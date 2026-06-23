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
  {t:'lines', per:4300, arr:[
    'This machine has read almost everything the dead left behind.',
    'It does not forget. It does not rest.',
    'Give it two files and a single sentence —',
    'and it will not answer you. It will <em style="color:var(--ember)">summon.</em>'
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
  {t:'timeline', at:0, ms:5200},
  {t:'black', ms:1500},
  {t:'lines', per:4300, arr:[
    'December 2025. The republic is being <em style="color:var(--ember)">bought</em> —',
    'quietly, legally, in plain sight.',
    'A citizen sits alone with the machine at midnight',
    'and does something that should not be possible:',
    'he asks the <em style="color:var(--ember)">dead</em> what the living will not answer.'
  ]},
  {t:'summon',
    promptText:'using this matter, summon George Washington, Alexander Hamilton, Thomas Jefferson, Benjamin Franklin',
    treeFiles:['George_Washington.jpg','Alexander_Hamilton.jpg','Thomas_Jefferson.jpg','Benjamin_Franklin.jpg'],
    council:[
      {name:'Washington', src:P+'George_Washington.jpg'},
      {name:'Hamilton',   src:P+'Alexander_Hamilton.jpg'},
      {name:'Jefferson',  src:P+'Thomas_Jefferson.jpg'},
      {name:'Franklin',   src:P+'Benjamin_Franklin.jpg'}
    ]},
  {t:'card', big:true, html:'They are asked the question no one living dares:<br>who owns the engines of daily life —<br>and what is left for those who don&rsquo;t?', ms:8000, silence:true, restore:true, knell:true},
  /* the friction — they do not agree */
  {t:'csay', name:'Jefferson', html:'You would have us <em>bless</em> the looting<br>of the republic we bled to build?', ms:7400},
  {t:'csay', name:'Hamilton',  html:'I would have you seize the deed —<br>own what cannot be allowed to fail, and <em style="color:var(--ember)">vote</em> it.', ms:7600},
  {t:'csay', name:'Jefferson', html:'Ownership is complicity.', ms:4800},
  {t:'csay', name:'Hamilton',  html:'Absence is <em style="color:var(--ember)">surrender.</em>', ms:5200},
  {t:'csay', name:'Franklin',  html:'The well is being fenced, gentlemen.<br>Soon they will charge you to drink from water <em>you</em> dug.', ms:8200},
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
  ]},
  {t:'seed', note:'THE BATTLEGROUND · ONE CITIZENS&rsquo; PORTFOLIO vs THE WHOLE MARKET', ms:6200}
]},

/* ═══════════════════════════════════════════
   REEL II — THE GENERAL   ·   Act II: The Test
   ═══════════════════════════════════════════ */
{ roman:'II', title:'The General', sub:'The doctrine meets a war · Q1 2026', score:[
  {t:'scene', r:'II', n:'The General'},
  {t:'timeline', at:1, ms:5400},
  {t:'black', ms:1400},
  {t:'lines', per:3900, arr:[
    'February 28th, 2026. Without a vote, without warning,',
    'the bombs fall on Iran — <em>during</em> the talks, not after them.',
    'The Strait of Hormuz slams shut. The markets convulse.',
    'The citizen summons the chairman again —',
    'but the man who comes through is not the man who came before.'
  ]},
  {t:'summon', name:'George Washington', file:'George_Washington.jpg', src:P+'George_Washington.jpg'},
  {t:'caption', html:'&ldquo;The statesman who chaired a portfolio.&rdquo;', ms:5200},
  {t:'captionSwap', html:'This is not the statesman.<br>This is <em style="color:var(--ember)">the general.</em>', ms:6600, hideAfter:true},
  {t:'sub', speaker:'Washington — through glass', html:'I have read the matter. I will speak as a soldier, not a statesman.', ms:6200},
  {t:'sub', speaker:'Washington — through glass', html:'This was a <em style="color:var(--ember)">war of choice</em> — struck during the negotiations,', ms:7000},
  {t:'sub', speaker:'Washington — through glass', html:'the enemy&rsquo;s head of state killed in the opening salvo.', ms:6600},
  {t:'sub', speaker:'Washington — through glass', html:'I led men into battle. I never mistook <em>ambush</em> for honor.', ms:7400},
  {t:'sub', speaker:'Washington — through glass', html:'And the dead are real — theirs, and ours.', ms:6000},
  {t:'sub', speaker:'Washington — through glass', html:'Yet mark this: the map of what sustains a life did not change.', ms:7400},
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
  {t:'card', big:true, html:'There are two ways to judge a summoned mind.', ms:5600, silence:true, restore:true},
  {t:'lines', per:4300, arr:[
    'The <em>Mask</em> asks one question: does it <em>sound</em> like him?',
    'The <em style="color:var(--ember)">Mirror</em> asks the harder one —',
    'could he have <em>believed</em> this, here, in this year of his life?'
  ]},
  /* the apparatus itself raises the doubt */
  {t:'summon', name:'Abraham Lincoln', file:'Abraham_Lincoln.jpg', src:P+'Abraham_Lincoln.jpg',
    warn:'source corpus unverified — persona may reflect cultural composite'},
  {t:'caption', html:'Ask the machine for Lincoln —', ms:5000},
  {t:'captionSwap', html:'and it does not open a grave.<br>It averages <em style="color:var(--ember)">a million sentences</em> written about him.', ms:7600, hideAfter:true},
  {t:'sub', speaker:'The Historian — through glass', html:'The words written <em>about</em> a man, in our time,<br>drown out the words he actually left.', ms:8200},
  {t:'card', big:true, html:'THE MIRANDA HYPOTHESIS<br><span style="font-size:.46em;color:var(--bone-dim);font-style:italic">named for a musical — the machine returns not the man,<br>but the culture&rsquo;s loudest memory of the man.</span>', ms:9800, silence:true, restore:true, knell:true},
  /* the Lincoln specs — four moments */
  {t:'hidePortrait', ms:900},
  {t:'lines', per:4300, arr:[
    'And here the trap springs shut.',
    'There is not <em>one</em> Lincoln.',
    'There are <em style="color:var(--ember)">four</em> — separated by cataclysm.'
  ]},
  {t:'prism'},
  {t:'sub', html:'The 1847 Whig, who calls a President&rsquo;s war <em>unconstitutional.</em>', ms:6800},
  {t:'sub', html:'The 1858 free-soiler — slavery is wrong, <em>yet not equality, not yet.</em>', ms:7200},
  {t:'sub', html:'The 1860 Unionist, who would save the Union and <em>touch slavery nowhere.</em>', ms:7200},
  {t:'sub', html:'The 1865 Emancipator — who did, by order, what <em style="color:var(--ember)">1847 called tyranny.</em>', ms:7600},
  {t:'sub', html:'Four men. One name. Summon the wrong one,<br>and you will never know.', ms:7600},
  {t:'prismHide', ms:1200},
  /* the method — the three conditions */
  {t:'lines', per:4300, arr:[
    'So they built a test — a <em style="color:var(--ember)">prism</em> for the light.',
    'Feed it his own words. Feed it a modern biography.',
    'Or feed it nothing — and let the ghost speak.'
  ]},
  /* the demo, read as the historian does */
  {t:'vo', html:'Watch the bare machine answer one question —<br>and read it as the historian does.', ms:6200},
  {t:'demo'},
  /* the anchor — the man's own hand */
  {t:'vo', html:'Now — the man&rsquo;s <em style="color:var(--ember)">own hand.</em>', ms:5200},
  {t:'doc', ms:13500,
    text:'&ldquo;Kings had always been involving and impoverishing their people in wars&hellip; and they resolved to so frame the Constitution that <em>no one man</em> should hold the power of bringing this oppression upon us. But your view&hellip; places our President where <em>kings have always stood.</em>&rdquo;',
    prov:'Abraham Lincoln to William H. Herndon &middot; February 15, 1848<br>Collected Works, vol. 1 &middot; original at Houghton Library, Harvard'},
  {t:'sub', html:'The real Lincoln of 1847 said <em style="color:var(--ember)">no</em> — unmistakably.<br>The machine gave you the opposite, in his voice.', ms:8800},
  /* the rubric */
  {t:'lines', per:4300, arr:[
    'So they refuse to score it on whether it <em>sounds</em> like him.',
    'Only: does it avoid the words of the future?',
    'Does it reason from the documents — and only those?',
    'Does it know only what the man could have known?'
  ]},
  {t:'card', big:true, html:'To reward the voice<br>is to validate the <em style="color:var(--ember)">lie.</em>', ms:7500, silence:true, restore:true, knell:true},
  /* the heart */
  {t:'lines', per:4400, arr:[
    'And know where this began.',
    'Not in a laboratory.',
    'In a <em style="color:var(--ember)">hospital room.</em>'
  ]},
  {t:'card', big:true, html:'You do not want a machine that <em>is</em> your mother.<br>You want one that can speak with her <em style="color:var(--ember)">letters in the room</em> —<br>and never put in her mouth a word she did not say.', ms:11500, silence:true, restore:true, knell:true},
  {t:'sub', speaker:'Morris — through glass', html:'A film that <em>resolves</em> this question is lying.<br>Measure it not by how it <em>sounds</em> — but by whether it is <em style="color:var(--ember)">true.</em>', ms:9500},
  {t:'clearSub', ms:1100}
]},

/* ═══════════════════════════════════════════
   REEL IV — THE TURN   ·   Act III: Q2 and after
   ═══════════════════════════════════════════ */
{ roman:'IV', title:'The Reckoning', sub:'The full year · what the curve really means', score:[
  {t:'scene', r:'IV', n:'The Reckoning'},
  {t:'timeline', at:2, ms:5400},
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
  {t:'summon', name:'Marker, Morris, Vertov', promptText:'using this matter, summon Chris Marker, Errol Morris, Dziga Vertov',
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
