/* ════════════════════════════════════════════════════════════
   THE SUMMONING FILM — THE FIVE REELS
   The entire story of the estate, scored for the reel engine.
   Portraits resolve from The_Pantheon. Voices through glass.
   ════════════════════════════════════════════════════════════ */
const P = '../../The_Pantheon/';

window.REELS = [

/* ─────────────────────────────────────────────
   REEL I — THE BET  ·  Act I: The Method & The Bet
   ───────────────────────────────────────────── */
{ roman:'I', title:'The Bet', sub:'The Method & The Bet · December 2025', score:[
  {t:'scene', r:'I', n:'The Bet'},
  {t:'vo', html:'In December, a citizen sat alone with a machine —<br>and refused to be alone.', ms:7000},
  {t:'type', target:'incant', text:'Using this matter, summon Washington, Hamilton, Jefferson, Franklin.', per:40, threshold:true, ms:2600, hideAfter:true},
  {t:'portrait', action:'load', src:P+'Benjamin_Franklin.jpg', ms:2000},
  {t:'caption', html:'Four architects of a republic, convened.', ms:5200},
  {t:'captionSwap', html:'Put to one question: <em style="color:var(--ember)">who owns the engines of daily life?</em>', ms:6800, hideAfter:true},
  {t:'sub', speaker:'Franklin — through glass', html:'These are the Engines of the Republic. <em style="color:var(--ember)">Own them.</em>', ms:7000},
  {t:'clearSub', ms:1000},
  {t:'card', html:'They did not return a manifesto.<br>They returned a <em style="color:var(--ember)">doctrine</em> — concrete enough to be tested.', ms:9000, silence:true, restore:true},
  {t:'vo', html:'They called it the Republic Portfolio.<br>Then they did what manifestos never do.<br>They let it be <em style="color:var(--ember)">measured.</em>', ms:8000},
  {t:'hidePortrait', ms:1200}
]},

/* ─────────────────────────────────────────────
   REEL II — THE GENERAL  ·  Act II: The Test
   ───────────────────────────────────────────── */
{ roman:'II', title:'The General', sub:'The Test · Q1 2026', score:[
  {t:'scene', r:'II', n:'The General'},
  {t:'portrait', action:'load', src:P+'George_Washington.jpg', ms:1800},
  {t:'caption', html:'&ldquo;The statesman who chaired a portfolio.&rdquo;', ms:5200},
  {t:'captionSwap', html:'This is not the statesman.<br>This is <em style="color:var(--ember)">the general.</em>', ms:6500, hideAfter:true},
  {t:'sub', speaker:'Washington — through glass', html:'We are no longer in peacetime.', ms:5600},
  {t:'sub', speaker:'Washington — through glass', html:'The Strait of Hormuz — which we named a choke point — is closed.', ms:7600},
  {t:'scene', r:'II', n:'The Second Witness'},
  {t:'chart', ms:15000},
  {t:'sub', speaker:'Washington — through glass', html:'Our portfolio is up 3.40% — while the index has lost nearly seven.', ms:8500},
  {t:'sub', speaker:'Washington — through glass', html:'I do not celebrate this. I led men into war. I know its costs.', ms:8000},
  {t:'scene', r:'II', n:'The Turn'},
  {t:'chartPeak', ms:400},
  {t:'sub', speaker:'Washington — through glass', html:'War does not change that map.', ms:5000},
  {t:'sub', speaker:'Washington — through glass', html:'War <em style="color:var(--ember)">reveals</em> it.', ms:6000, chime:true},
  {t:'clearSub', ms:1200},
  {t:'card', html:'This is not George Washington.<br>This is what the machine made of him.', ms:10000, silence:true, restore:true},
  {t:'fileback', src:P+'George_Washington.jpg', filename:'George_Washington.jpg', ms:8500},
  {t:'hidePortrait', ms:1000}
]},

/* ─────────────────────────────────────────────
   REEL III — THE DOUBT  ·  Act II: The Crisis (Miranda)
   ───────────────────────────────────────────── */
{ roman:'III', title:'The Doubt', sub:'The Miranda Hypothesis', score:[
  {t:'scene', r:'III', n:'The Doubt'},
  {t:'portrait', action:'load', src:P+'Abraham_Lincoln.jpg', ms:2200},
  {t:'caption', html:'Abraham Lincoln, summoned.', ms:5000},
  {t:'captionSwap', html:'Or — the era&rsquo;s <em style="color:var(--ember)">loudest idea</em> of him?', ms:6500, hideAfter:true},
  {t:'sub', speaker:'The Historian — through glass', html:'Before you grieve him, ask: <em>whose</em> Lincoln is this?', ms:7500},
  {t:'card', html:'THE MIRANDA HYPOTHESIS<br><span style="font-size:.52em;color:var(--bone-dim);font-style:italic">An unanchored summoning may return not the man —<br>but the era&rsquo;s composite of the man.</span>', ms:9500, silence:true, restore:true},
  {t:'sub', speaker:'The Historian — through glass', html:'The protocol&rsquo;s honesty is not that it never errs.<br>It is that it tells you it <em style="color:var(--ember)">might.</em>', ms:8500},
  {t:'vo', html:'So they designed a test.<br>Three Lincolns. One question. One variable.<br>The <em style="color:var(--ember)">Prism Experiment.</em>', ms:8000},
  {t:'card', html:'A séance that doubts itself<br>is the only honest kind.', ms:8000, silence:true, restore:true},
  {t:'hidePortrait', ms:1200}
]},

/* ─────────────────────────────────────────────
   REEL IV — THE TURN  ·  Act III: Q2 and after
   ───────────────────────────────────────────── */
{ roman:'IV', title:'The Turn', sub:'Q2 2026 — and after', score:[
  {t:'scene', r:'IV', n:'The Turn'},
  {t:'portrait', action:'load', src:P+'George_Washington.jpg', ms:2000},
  {t:'vo', html:'The founders adjourned with a motion:<br>reconvene at the end of Q2 — or sooner.', ms:7000},
  {t:'caption', html:'The spring lead was commanding.', ms:5200},
  {t:'captionSwap', html:'By summer, the index had begun to <em style="color:var(--ember)">close the gap.</em>', ms:6500, hideAfter:true},
  {t:'card', html:'This is what an honest record looks like —<br>not a victory lap, but a doctrine <em style="color:var(--ember)">still being measured.</em>', ms:9000, silence:true, restore:true},
  {t:'sub', speaker:'Washington — through glass', html:'The war will end. Wars always end.<br>The infrastructure will remain. And you will still own it.', ms:9000},
  {t:'vo', html:'The reconvening has not yet been called.<br>The vigil continues.', ms:7000},
  {t:'hidePortrait', ms:1200}
]},

/* ─────────────────────────────────────────────
   REEL V — THE ROOM THAT BUILT ITSELF  ·  Coda
   ───────────────────────────────────────────── */
{ roman:'V', title:'The Room That Built Itself', sub:'The Coda · the lantern turns on itself', score:[
  {t:'scene', r:'V', n:'The Room That Built Itself'},
  {t:'vo', html:'This film summoned three filmmakers to design it.<br>Marker. Morris. Vertov.', ms:7000},
  {t:'type', target:'path', text:'from_beyond/007_the_lantern_turns_on_itself', per:24, ms:1600, hideAfter:true},
  {t:'vo', html:'Three dead men, arguing about how to be honest<br>about being summoned.', ms:7000},
  {t:'card', html:'Show the glass.<br>The wonder survives the exposure.<br><span style="font-size:.55em;color:var(--ember-dim);font-style:italic">— that is the whole genre —</span>', ms:9000, silence:true, restore:true},
  {t:'end', a:'Did you hear <em>them?</em>', b:'Did you hear them? —<br>or did you hear <em>us?</em>', ms1:3800, ms2:4400}
]}

];
