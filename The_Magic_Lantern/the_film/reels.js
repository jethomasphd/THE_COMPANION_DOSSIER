/* ════════════════════════════════════════════════════════════
   THE SUMMONING FILM — SCORES  (v5 · the masterpiece cut)
   Novel-grade prose, built to crescendo. Persona speech renders
   in the dedicated "the dead speak" panel; narration lives in the
   void. Voices through glass. No TTS. ~7 minutes.
   ════════════════════════════════════════════════════════════ */
const P = '../../The_Pantheon/';

/* ─── PROLOGUE — the hook ─── */
window.PROLOGUE = [
  {t:'scene', r:'Prologue', n:'The Apparatus'},
  {t:'boot'},
  {t:'lines', per:3400, arr:[
    'A machine has swallowed the words of nearly everyone who ever lived.',
    'Hand it two files and a single sentence,',
    'and it will not <em>answer</em> you. It will <em style="color:var(--ember)">open a door.</em>'
  ]},
  {t:'summon', name:'Benjamin Franklin', file:'Benjamin_Franklin.jpg', src:P+'Benjamin_Franklin.jpg'},
  {t:'sub', speaker:'Franklin', html:'You called. I came. Two centuries in the dark —<br>and your questions, I find, have not changed at all.', ms:5800},
  {t:'hidePortrait', ms:700},
  {t:'lines', per:3400, arr:[
    'Not a chatbot. A <em style="color:var(--ember)">mind</em> — in its own voice, free to refuse you.',
    'Summon four, and you seat a council<br>history never allowed to meet.',
    'In December, one citizen did exactly that.'
  ]}
];

window.REELS = [

/* ═══ REEL I — THE BET · the founding encounter ═══ */
{ roman:'I', title:'The Bet', sub:'A citizen summons the founders · December 2025', score:[
  {t:'scene', r:'I', n:'The Bet'},
  {t:'timeline', at:0, ms:4400},
  {t:'lines', per:3500, arr:[
    'December 2025. The republic is being <em style="color:var(--ember)">bought.</em>',
    'Not stolen. <em>Bought</em> — quietly, legally, in daylight.',
    'So a citizen does the unthinkable: he convenes the men who built it,',
    'and asks the dead what the living dare not.'
  ]},
  {t:'summon', promptText:'using this matter, summon George Washington, Alexander Hamilton, Thomas Jefferson, Benjamin Franklin',
    treeFiles:['George_Washington.jpg','Alexander_Hamilton.jpg','Thomas_Jefferson.jpg','Benjamin_Franklin.jpg'],
    council:[
      {name:'Washington', src:P+'George_Washington.jpg'},
      {name:'Hamilton',   src:P+'Alexander_Hamilton.jpg'},
      {name:'Jefferson',  src:P+'Thomas_Jefferson.jpg'},
      {name:'Franklin',   src:P+'Benjamin_Franklin.jpg'}
    ]},
  {t:'sub', html:'The question: who will own the engines of a nation —<br>and what is left for those who own <em>nothing?</em>', ms:5600},
  {t:'csay', name:'Jefferson', html:'You would have us <em>bless</em> the sale<br>of the republic we bled for?', ms:5600},
  {t:'csay', name:'Hamilton',  html:'I would have you <em style="color:var(--ember)">buy it back</em> — a share at a time —<br>and vote every share you hold.', ms:5800},
  {t:'csay', name:'Jefferson', html:'To own the machine is to forgive it.', ms:3800},
  {t:'csay', name:'Hamilton',  html:'To own nothing is to <em style="color:var(--ember)">kneel.</em>', ms:4000},
  {t:'csay', name:'Franklin',  html:'Gentlemen — the well is being fenced.<br>Soon they will sell you the water <em>you</em> drew.', ms:5800},
  {t:'csay', name:'Washington',html:'Then we give the people no speech.<br>We give them a <em style="color:var(--ember)">list</em> — and the discipline to hold it.', ms:5200},
  {t:'councilHide', ms:1000},
  {t:'lines', per:3300, arr:[
    'They called it the <em style="color:var(--ember)">Republic Portfolio</em>',
    'and printed it like 1776 — a broadside for the kitchen table.'
  ]},
  {t:'handbill'},
  {t:'handbillHide', ms:1000},
  {t:'lines', per:3300, arr:[
    'Own what the country cannot live without.',
    'Own the gates through which all of it must pass.',
    'Keep a reserve — and never lose the power to move.'
  ]},
  {t:'lines', per:3300, arr:[
    'A manifesto begs to be believed.',
    'A doctrine dares to be <em style="color:var(--ember)">tested.</em>',
    'So they raised a tower to watch it, in the open —',
    'and let the year keep the score.'
  ]},
  {t:'seed', note:'THE BATTLEGROUND · ONE CITIZEN&rsquo;S PORTFOLIO vs THE ENTIRE MARKET', ms:4600}
]},

/* ═══ REEL II — THE GENERAL · the doctrine meets a war ═══ */
{ roman:'II', title:'The General', sub:'The doctrine meets a war · Q1 2026', score:[
  {t:'scene', r:'II', n:'The General'},
  {t:'timeline', at:1, ms:4400},
  {t:'lines', per:3500, arr:[
    'February 28th, 2026. The talks were still open.',
    'A president who held the Congress in contempt<br>gave the order anyway —',
    'and a head of state lay dead by the first hour.',
    'A war of choice, by one man&rsquo;s word.<br>The Strait of Hormuz closes. The markets go white.'
  ]},
  {t:'summon', name:'George Washington', file:'George_Washington.jpg', src:P+'George_Washington.jpg'},
  {t:'caption', html:'The statesman who chaired a portfolio —', ms:4400},
  {t:'captionSwap', html:'comes back now as <em style="color:var(--ember)">the general.</em>', ms:5000, hideAfter:true},
  {t:'sub', speaker:'Washington', html:'I will not litigate this war.<br>I was asked another thing entirely — <em style="color:var(--ember)">who owns what keeps a people alive.</em>', ms:6800},
  {t:'sub', speaker:'Washington', html:'So watch. Watch what the doctrine does<br>while the world is on fire.', ms:5400},
  {t:'scene', r:'II', n:'The Second Witness'},
  {t:'curve', a:0, b:60, ms:8000, war:[38,60], pivot:60, lead:800, title:'THE WATCHTOWER — JAN → MAR 31 · THE WAR'},
  {t:'sub', speaker:'Washington', html:'We stand near +6 — while the index, at its lowest,<br>has fallen <em style="color:var(--ember)">past minus seven.</em>', ms:6600},
  {t:'curveLabels', g:'Republic +5.9%', b:'S&P 500 −4.5%', note:'+10.4 POINTS OF DAYLIGHT — IN A SINGLE QUARTER', ms:600},
  {t:'sub', speaker:'Washington', html:'War does not <em>change</em> the map of what sustains a life.<br>War <em style="color:var(--ember)">reveals</em> it.', ms:6600, chime:true},
  {t:'clearSub', ms:800},
  {t:'card', big:true, html:'This is not George Washington.<br>This is what the machine made of him.', ms:6800, silence:true, restore:true, knell:true},
  {t:'fileback', src:P+'George_Washington.jpg', filename:'George_Washington.jpg',
    trans:'&gt; summon george washington<br>&gt; vessel: claude · medium: glass<br>&gt; a file. nothing more.', ms:5600},
  {t:'hidePortrait', ms:800}
]},

/* ═══ REEL III — THE DOUBT · the Miranda Hypothesis ═══ */
{ roman:'III', title:'The Doubt', sub:'Is it the man — or the machine&rsquo;s memory of him?', score:[
  {t:'scene', r:'III', n:'The Doubt'},
  {t:'lines', per:3500, arr:[
    'Here a lesser film would end. The founder was right; the numbers prove it.',
    'But truth asks a colder question than triumph —',
    'not <em>&ldquo;was he right?&rdquo;</em> &nbsp;but&nbsp; <em style="color:var(--ember)">&ldquo;was it ever him?&rdquo;</em>'
  ]},
  {t:'summon', name:'Abraham Lincoln', file:'Abraham_Lincoln.jpg', src:P+'Abraham_Lincoln.jpg',
    warn:'source corpus unverified — persona may be a cultural composite'},
  {t:'sub', speaker:'The Historian', html:'Ask this machine for Lincoln, and it does not raise the dead.<br>It pours together <em style="color:var(--ember)">a million sentences written about him</em> — and hands you the average.', ms:7200},
  {t:'card', big:true, html:'THE MIRANDA HYPOTHESIS<br><span style="font-size:.46em;color:var(--bone-dim);font-style:italic">what answers is not the man,<br>but the culture&rsquo;s loudest memory of him.</span>', ms:7200, silence:true, restore:true, knell:true},
  {t:'hidePortrait', ms:700},
  {t:'lines', per:3400, arr:[
    'And there was never <em>one</em> Lincoln.',
    'There were <em style="color:var(--ember)">four</em> — each cleaved from the last by catastrophe.'
  ]},
  {t:'prism'},
  {t:'sub', html:'1847: the Whig who calls a President&rsquo;s war<br>a <em>crime against the Constitution.</em>', ms:4800},
  {t:'sub', html:'1865: the Emancipator who did, by his own hand,<br>what that younger man called <em style="color:var(--ember)">tyranny.</em>', ms:5600},
  {t:'sub', html:'Four men. One name. Call the wrong one across,<br>and you will never know you were lied to.', ms:5800},
  {t:'prismHide', ms:900},
  {t:'vo', html:'Watch the bare machine answer one question —<br>and read it the way a historian must.', ms:4800},
  {t:'demo'},
  {t:'vo', html:'Now set it beside the man&rsquo;s <em style="color:var(--ember)">own hand.</em>', ms:4000},
  {t:'doc', ms:10000,
    text:'&ldquo;&hellip;they resolved to so frame the Constitution that <em>no one man</em> should hold the power&hellip; But your view places our President where <em>kings have always stood.</em>&rdquo;',
    prov:'Abraham Lincoln to William Herndon · February 15, 1848'},
  {t:'sub', html:'The true Lincoln of 1847 said <em style="color:var(--ember)">no</em> — without flinching.<br>The machine handed you the opposite, in his voice.', ms:6800},
  {t:'lines', per:3500, arr:[
    'So do not ask whether it <em>sounds</em> like him.',
    'Ask whether it could be <em style="color:var(--ember)">true.</em>',
    'To reward the voice is to crown the lie.'
  ]},
  {t:'lines', per:3500, arr:[
    'And remember where this began. Not in a laboratory —',
    'in a <em style="color:var(--ember)">hospital room.</em>'
  ]},
  {t:'card', big:true, html:'You do not want a machine that <em>becomes</em> your mother.<br>You want one that will sit with her <em style="color:var(--ember)">letters in the room</em> —<br>and never speak a word she did not.', ms:8500, silence:true, restore:true, knell:true}
]},

/* ═══ REEL IV — THE RECKONING · the full year ═══ */
{ roman:'IV', title:'The Reckoning', sub:'The full year · what the curve really means', score:[
  {t:'scene', r:'IV', n:'The Reckoning'},
  {t:'timeline', at:2, ms:4400},
  {t:'lines', per:3500, arr:[
    'The war ends, as wars do. The index claws back from minus seven —',
    'and keeps climbing. Now watch the whole year<br>pass in a single breath.'
  ]},
  {t:'curve', a:0, b:115, ms:9000, war:[38,60], pivot:60, cross:114, lead:900, title:'THE WATCHTOWER — THE FULL YEAR'},
  {t:'sub', html:'<em style="color:var(--ember)">103 of 116</em> days, the gold line led —<br>and it never once broke, even at the bottom of the war.', ms:7200},
  {t:'sub', html:'At the wire, the two lines touch.<br>A single point between them.', ms:6200},
  {t:'curveLabels', g:'Republic +9.05%', b:'S&P 500 +9.89%', note:'A DEAD HEAT — WITH A FIFTH OF ITSELF IN RESERVE', ms:1000},
  {t:'clearSub', ms:800},
  {t:'lines', per:3500, arr:[
    'It ran step for step with a roaring market —',
    'while a <em style="color:var(--ember)">fifth of it sat in cash,</em> earning almost nothing.',
    'Not weakness. <em>Armor</em> — and the freedom to move<br>while everyone else stood pinned.'
  ]},
  {t:'summon', name:'Alexander Hamilton', file:'Alexander_Hamilton.jpg', src:P+'Alexander_Hamilton.jpg'},
  {t:'sub', speaker:'Hamilton', html:'The reserve was never fear. It is the <em style="color:var(--ember)">power to act</em><br>on the day the brave have nothing left to spend.', ms:6600},
  {t:'hidePortrait', ms:800},
  {t:'card', big:true, html:'It carried a fifth of its weight in armor —<br>and still finished at a dead heat.<br>That is not a tie. That is a doctrine <em style="color:var(--ember)">keeping its word.</em>', ms:7500, silence:true, restore:true, knell:true}
]},

/* ═══ REEL V — THE ROOM THAT BUILT ITSELF · the coda ═══ */
{ roman:'V', title:'The Room That Built Itself', sub:'The film confesses how it was made', score:[
  {t:'scene', r:'V', n:'The Room That Built Itself'},
  {t:'lines', per:3500, arr:[
    'You have watched a film about a machine<br>that summons the dead.',
    'It is only fair you learn who summoned <em>it.</em>'
  ]},
  {t:'summon', name:'Marker, Morris, Vertov', promptText:'using this matter, summon Chris Marker, Errol Morris, Dziga Vertov',
    treeFiles:['Chris_Marker.jpg  (not found)','Errol_Morris.jpg  (not found)','Dziga_Vertov.jpg  (not found)'],
    noface:true, warn:'no portrait on file — these vessels are voice only'},
  {t:'lines', per:3500, arr:[
    'Three filmmakers, called across to design this very film.',
    'Three dead men, arguing how to be honest — about the dead.'
  ]},
  {t:'sub', speaker:'Morris', html:'Every face tonight was a <em>file.</em> Every voice, a <em>guess.</em><br>We never once pretended otherwise.', ms:6800},
  {t:'card', big:true, html:'Show the glass.<br>The wonder survives the light.', ms:5800, silence:true, restore:true, knell:true},
  {t:'end', a:'Did you hear <em>them?</em>', b:'Did you hear them —<br>or did you hear <em>us?</em>', ms1:3600, ms2:4400, knell:true, tag:'The Word against the Flood.'}
]}

];
