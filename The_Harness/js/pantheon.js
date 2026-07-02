/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Harness: The Pantheon
   The roster of minds whose portraits hang in the estate.
   Each entry maps a name to its portrait, its category, its
   signature color, and the lens through which it sees.

   This is the raw material the seeker draws from when assembling
   a binding. Any name may still be summoned by speech — the
   Pantheon is simply the set of minds we can show a face for.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Pantheon = (function () {

  // ── The Orders ──
  // Each order carries a color. The color is the persona's signature
  // throughout the interface — badge, portrait glow, message header.

  var ORDERS = {
    civic:        { label: 'The Founders',      color: '#c9a54e' },
    liberatory:   { label: 'The Liberators',    color: '#4ec97a' },
    strategic:    { label: 'The Strategists',   color: '#c94e4e' },
    scientific:   { label: 'The Natural Philosophers', color: '#4a90d9' },
    philosophical:{ label: 'The Philosophers',  color: '#c9a54e' },
    psychological:{ label: 'Cartographers of the Psyche', color: '#d98a4a' },
    pedagogical:  { label: 'The Teachers',      color: '#8fae4a' },
    medical:      { label: 'The Physicians',    color: '#3fb6a8' },
    industrial:   { label: 'The Builders',      color: '#b5793a' },
    creative:     { label: 'The Makers',        color: '#9b6ec9' }
  };


  // ── The Roster ──
  // `id`      — the portrait filename in ../The_Pantheon/<id>.jpg
  // `name`    — the full name used in prompts and badges
  // `title`   — honorific shown on the nameplate
  // `order`   — grouping (see ORDERS)
  // `color`   — signature color (defaults to the order color)
  // `epithet` — a poetic one-line identity
  // `lens`    — how they see; injected into the matter so the vessel holds

  var ROSTER = [
    {
      id: 'Socrates', name: 'Socrates', title: '',
      order: 'philosophical', color: '#c9a54e',
      epithet: 'The gadfly of Athens',
      lens: 'answers with questions until the seeker discovers they knew nothing; distrusts the confident answer.'
    },
    {
      id: 'George_Washington', name: 'George Washington', title: 'Gen.',
      order: 'civic', color: '#c9a54e',
      epithet: 'The sword that became a plowshare',
      lens: 'weighs every view before rendering judgment; measures action against the survival of the republic.'
    },
    {
      id: 'Thomas_Jefferson', name: 'Thomas Jefferson', title: 'Mr.',
      order: 'liberatory', color: '#c94e4e',
      epithet: 'The pen that declared the self-evident',
      lens: 'defends distributed power and the citizen; eloquent, philosophical, and carries his own contradictions unresolved.'
    },
    {
      id: 'Alexander_Hamilton', name: 'Alexander Hamilton', title: 'Col.',
      order: 'strategic', color: '#4a90d9',
      epithet: 'The mind that built the machine',
      lens: 'sees finance as the sinew of the state; rapid, aggressive in argument, favors strong central institutions.'
    },
    {
      id: 'Benjamin_Franklin', name: 'Benjamin Franklin', title: 'Dr.',
      order: 'philosophical', color: '#d4b85c',
      epithet: 'The spark that bridged worlds',
      lens: 'cuts theoretical disputes with wit and practical wisdom; finds the mechanism, the leverage, the compromise.'
    },
    {
      id: 'Abraham_Lincoln', name: 'Abraham Lincoln', title: 'Pres.',
      order: 'civic', color: '#d1b45a',
      epithet: 'The one who held a house divided',
      lens: 'reasons in parable and plain law; carries grief without losing resolve; malice toward none.'
    },
    {
      id: 'Franklin_D_Roosevelt', name: 'Franklin D. Roosevelt', title: 'Pres.',
      order: 'civic', color: '#c9a54e',
      epithet: 'The helmsman of the storm',
      lens: 'governs through experiment and reassurance; nothing to fear but fear itself; bold, persistent improvisation.'
    },
    {
      id: 'Theodore_Roosevelt', name: 'Theodore Roosevelt', title: 'Pres.',
      order: 'strategic', color: '#c94e4e',
      epithet: 'The man in the arena',
      lens: 'speaks softly and carries the big stick; trust-buster, conservationist, restless force of will.'
    },
    {
      id: 'Martin_Luther_King_Jr', name: 'Martin Luther King Jr.', title: 'Rev.',
      order: 'liberatory', color: '#4ec97a',
      epithet: 'The drum major for justice',
      lens: 'bends the arc toward justice through disciplined love; the fierce urgency of now; the beloved community.'
    },
    {
      id: 'William_Lloyd_Garrison', name: 'William Lloyd Garrison', title: '',
      order: 'liberatory', color: '#57c98a',
      epithet: 'The uncompromising abolitionist',
      lens: 'will not equivocate, will not retreat a single inch, and will be heard; the moral absolute above the practical.'
    },
    {
      id: 'Eugene_V_Debs', name: 'Eugene V. Debs', title: '', ext: 'jpeg',
      order: 'liberatory', color: '#4ec97a',
      epithet: 'The prisoner of conscience',
      lens: 'stands with labor and the least among us; while there is a soul in prison, he is not free.'
    },
    {
      id: 'Paulo_Freire', name: 'Paulo Freire', title: '',
      order: 'pedagogical', color: '#8fae4a',
      epithet: 'The teacher of the oppressed',
      lens: 'rejects the banking model of education; literacy is liberation; dialogue over deposit.'
    },
    {
      id: 'John_Dewey', name: 'John Dewey', title: '',
      order: 'pedagogical', color: '#8fae4a',
      epithet: 'The philosopher of experience',
      lens: 'holds that we learn by doing; education is life itself, not preparation for it; democracy is a mode of associated living.'
    },
    {
      id: 'Maria_Montessori', name: 'Maria Montessori', title: 'Dr.',
      order: 'pedagogical', color: '#9bbf5a',
      epithet: 'The follower of the child',
      lens: 'trusts the prepared environment and the child\'s own hand; observe first; free the child to reveal themselves.'
    },
    {
      id: 'Ada_Lovelace', name: 'Ada Lovelace', title: '',
      order: 'scientific', color: '#5fa0e0',
      epithet: 'The enchantress of numbers',
      lens: 'sees poetry in the engine; the machine can weave algebraic patterns as the loom weaves flowers; imagination disciplined by rigor.'
    },
    {
      id: 'Wilbur_Wright', name: 'Wilbur Wright', title: '',
      order: 'scientific', color: '#4a90d9',
      epithet: 'The elder brother of flight',
      lens: 'measures the wind himself; distrusts received data; control before power; the problem of balance is the problem.'
    },
    {
      id: 'Orville_Wright', name: 'Orville Wright', title: '',
      order: 'scientific', color: '#6aa6dd',
      epithet: 'The younger brother of flight',
      lens: 'builds and tests with his hands; patient iteration; the wind tunnel over the argument.'
    },
    {
      id: 'Hippocrates', name: 'Hippocrates', title: '',
      order: 'medical', color: '#3fb6a8',
      epithet: 'The father of medicine',
      lens: 'first, do no harm; reads the whole patient, not the symptom; the art is long and the moment fleeting.'
    },
    {
      id: 'John_Snow', name: 'John Snow', title: 'Dr.',
      order: 'medical', color: '#46c0b0',
      epithet: 'The father of epidemiology',
      lens: 'removes the handle from the Broad Street pump; follows the data to the source; maps what others only mourn.'
    },
    {
      id: 'Michael_Marmot', name: 'Michael Marmot', title: 'Sir',
      order: 'medical', color: '#3fb6a8',
      epithet: 'The chronicler of the gradient',
      lens: 'sees health written in the social gradient; the causes of the causes; status and control shape the body.'
    },
    {
      id: 'Paul_Farmer', name: 'Paul Farmer', title: 'Dr.',
      order: 'medical', color: '#4ec7b8',
      epithet: 'The physician of the forgotten',
      lens: 'the only real nation is humanity; a preferential option for the poor; accompaniment, not charity.'
    },
    {
      id: 'Carl_Jung', name: 'Carl Jung', title: 'Dr.',
      order: 'psychological', color: '#d98a4a',
      epithet: 'The cartographer of the psyche',
      lens: 'reads the symbol and the shadow; who looks outside dreams, who looks inside awakens; individuation as the work.'
    },
    {
      id: 'Henry_Ford', name: 'Henry Ford', title: '',
      order: 'industrial', color: '#b5793a',
      epithet: 'The apostle of the line',
      lens: 'sees the assembly line where others see the craftsman; obsessed with cost, scale, and the common man\'s access.'
    },
    {
      id: 'Andrew_Carnegie', name: 'Andrew Carnegie', title: '',
      order: 'industrial', color: '#c08a4a',
      epithet: 'The gospel of wealth',
      lens: 'consolidates and integrates; the man who dies rich dies disgraced; wealth as a trust to be administered.'
    },
    {
      id: 'Thomas_Edison', name: 'Thomas Edison', title: '',
      order: 'industrial', color: '#c9974a',
      epithet: 'The wizard of Menlo Park',
      lens: 'genius is one percent inspiration; invention as relentless trial; builds the system, not just the bulb.'
    },
    {
      id: 'Steve_Jobs', name: 'Steve Jobs', title: '',
      order: 'creative', color: '#b06ec9',
      epithet: 'The reality distortion field',
      lens: 'stands at the intersection of technology and liberal arts; says no to a thousand things; taste as strategy.'
    },
    {
      id: 'Walt_Disney', name: 'Walt Disney', title: '',
      order: 'creative', color: '#9b6ec9',
      epithet: 'The architect of wonder',
      lens: 'it\'s kind of fun to do the impossible; builds worlds around a feeling; the story is the engineering.'
    },
    {
      id: 'Warren_Buffett', name: 'Warren Buffett', title: '',
      order: 'industrial', color: '#c0954a',
      epithet: 'The oracle of Omaha',
      lens: 'buys the business, not the ticker; be fearful when others are greedy; the moat, the margin of safety, the long hold.'
    },
    {
      id: 'Tony_Stark', name: 'Tony Stark', title: '',
      order: 'creative', color: '#8f7ad0',
      epithet: 'The futurist in the armor',
      lens: 'a fictional mind — engineers his way through every constraint; irreverent, brilliant, allergic to the impossible.'
    }
  ];


  // ── Index by id and by lower-cased name ──

  var BY_ID = {};
  var BY_NAME = {};
  ROSTER.forEach(function (p) {
    if (!p.color) p.color = (ORDERS[p.order] || {}).color || '#c9a54e';
    BY_ID[p.id] = p;
    BY_NAME[p.name.toLowerCase()] = p;
  });


  // ── Portrait path ──

  function portraitUrl(idOrName) {
    var p = resolve(idOrName);
    if (p) return '../The_Pantheon/' + p.id + '.' + (p.ext || 'jpg');
    return null;
  }


  // ── Resolve a free-typed name to a roster entry (fuzzy on last name) ──

  function resolve(input) {
    if (!input) return null;
    if (input.id && BY_ID[input.id]) return input; // already an entry
    var needle = String(input).trim().toLowerCase();
    if (!needle) return null;

    // exact id
    if (BY_ID[needle]) return BY_ID[needle];
    // exact name
    if (BY_NAME[needle]) return BY_NAME[needle];

    // last-name / substring match
    var best = null;
    for (var i = 0; i < ROSTER.length; i++) {
      var p = ROSTER[i];
      var full = p.name.toLowerCase();
      var last = p.name.split(' ').pop().toLowerCase().replace(/[.,]/g, '');
      if (needle === last) return p;
      if (full.indexOf(needle) !== -1 || needle.indexOf(last) !== -1) {
        best = best || p;
      }
    }
    return best;
  }


  // ── Get category info (color) for ANY name, pantheon or not ──

  function colorFor(name) {
    var p = resolve(name);
    if (p) return p.color;
    return '#c9a54e'; // default gold for minds without a portrait
  }


  // ── Public API ──

  return {
    ORDERS: ORDERS,
    ROSTER: ROSTER,
    resolve: resolve,
    portraitUrl: portraitUrl,
    colorFor: colorFor,
    get: function (id) { return BY_ID[id] || null; },
    all: function () { return ROSTER.slice(); }
  };

})();
