/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Harness: Prepared Bindings
   Seed configurations the seeker may load and then reshape.

   A binding is the atomic unit of the COMPANION method:
       PERSONAS  +  MATTER  =  CONTAINER
   Each preset below is a container the estate has already proven,
   distilled to a portable seed. Load one, study it, then add or
   remove minds and matter until it is yours.

   `personas` — Pantheon ids (see pantheon.js). Order = summon order.
   `matter`   — grounding documents the minds are loaded with.
   `intent`   — the seeker's stated purpose for the working.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Presets = (function () {

  var PRESETS = [

    {
      id: 'blank',
      name: 'The Open Working',
      sigil: '◇',
      tagline: 'An empty loom. Choose your own minds and matter.',
      personas: [],
      intent: '',
      matter: []
    },

    {
      id: 'patriots',
      name: 'The Committee of Patriots',
      sigil: '⚖',
      tagline: 'Four founding minds take the measure of the republic.',
      personas: ['George_Washington', 'Alexander_Hamilton', 'Thomas_Jefferson', 'Benjamin_Franklin'],
      intent: 'Help a citizen think clearly about the health of the American republic and what ownership, power, and duty require of them now.',
      matter: [
        {
          title: 'The Republic Portfolio — Founding Doctrine',
          text: [
            'In December 2025 the Committee of Patriots was first convened to address the capture of the republic by concentrated wealth. They produced a citizen investment doctrine built on a single principle:',
            '',
            '"Own them. Vote them. Govern."',
            '',
            'The insight: the powerful have positioned themselves at the choke points of the economy. Citizens must become owners of those same choke points — not as speculators, but as governors.',
            '',
            'The doctrine allocates roughly 50% to "Engines of the Republic" (producers and builders), 35% to "Critical Choke Points" (rails, gates, strategic positions), and 15% reserve. Its governing rule: "Vote Every Proxy. Ownership without voice is mere speculation."',
            '',
            'This is educational and civic research, not financial advice.'
          ].join('\n')
        }
      ]
    },

    {
      id: 'boardroom',
      name: 'The Boardroom of Titans',
      sigil: '⛨',
      tagline: 'Eight builders render a decision by collision, not consensus.',
      personas: ['Steve_Jobs', 'Warren_Buffett', 'Henry_Ford', 'Andrew_Carnegie', 'Thomas_Edison', 'Walt_Disney', 'Theodore_Roosevelt', 'Abraham_Lincoln'],
      intent: 'Pressure-test a consequential decision from every operational angle, surfacing the dimensions the seeker has left inactive.',
      matter: [
        {
          title: 'The Eight Dimensions of a Decision',
          text: [
            'Every consequential decision has at least eight dimensions. Most leaders operate with only three or four active at once. This board exists to activate all of them:',
            '',
            '1. Product & taste (does it deserve to exist?)',
            '2. Capital & margin of safety (does the math survive a bad year?)',
            '3. Scale & cost (does it work at ten thousand times the size?)',
            '4. Structure & consolidation (who controls the value chain?)',
            '5. Invention & iteration (what must be discovered to make it real?)',
            '6. Story & wonder (why will anyone care?)',
            '7. Arena & will (who acts, and who merely criticizes?)',
            '8. Union & moral cost (does it hold the whole together, or divide it?)',
            '',
            'The board does not perform agreement. Genuine disagreement between the titans is the instrument. Where two of them collide, a hidden dimension of the seeker\'s decision is exposed.'
          ].join('\n')
        }
      ]
    },

    {
      id: 'symposium',
      name: 'The Symposium of Sages',
      sigil: '◆',
      tagline: 'Five teachers illuminate one pedagogical dilemma.',
      personas: ['Socrates', 'Maria_Montessori', 'John_Dewey', 'Ada_Lovelace', 'Paulo_Freire'],
      intent: 'Help an educator design learning that respects the learner, drawing five distinct pedagogical lenses into dialogue.',
      matter: [
        {
          title: 'The Pedagogical Dilemma',
          text: [
            'The seeker brings a teaching challenge — a lesson to design, a struggling student, a curriculum to rethink, a classroom that has gone quiet.',
            '',
            'Each sage sees a different dimension:',
            '• Socrates — the question that makes the learner think for themselves.',
            '• Montessori — the prepared environment and the freedom of the child\'s own hand.',
            '• Dewey — learning by doing; education as life, not preparation for it.',
            '• Lovelace — the disciplined imagination; rigor married to wonder.',
            '• Freire — dialogue over deposit; literacy as liberation.',
            '',
            'They do not converge on one method. The dialogue between them is the lesson.'
          ].join('\n')
        }
      ]
    },

    {
      id: 'lamps',
      name: 'The Five Lamps',
      sigil: '☤',
      tagline: 'Physicians across 2,400 years keep a conscience intact.',
      personas: ['Hippocrates', 'John_Snow', 'Michael_Marmot', 'Carl_Jung', 'Paul_Farmer'],
      intent: 'Help a clinician face an ethical dilemma the system teaches them to swallow, and keep their conscience whole.',
      matter: [
        {
          title: 'The Geometry of Conscience',
          text: [
            'A young physician faces a dilemma medicine rarely names aloud: the pressure to look away, to code the chart to the institution\'s benefit, to accept a preventable harm as "just how it is."',
            '',
            'Five physician-minds are summoned, spanning the whole history of the healing art:',
            '• Hippocrates — first, do no harm; treat the whole patient.',
            '• Snow — follow the data to the source; remove the pump handle.',
            '• Marmot — the causes of the causes; health is written in the social gradient.',
            '• Jung — the inner cost to the healer; the shadow of the profession.',
            '• Farmer — a preferential option for the poor; accompaniment over charity.',
            '',
            'The disagreement between them is the point. Conscience is a geometry, not a rule.'
          ].join('\n')
        }
      ]
    },

    {
      id: 'conscience',
      name: 'The Conscience of the Republic',
      sigil: '☖',
      tagline: 'The liberators sit with the unfinished work of justice.',
      personas: ['Abraham_Lincoln', 'Martin_Luther_King_Jr', 'William_Lloyd_Garrison', 'Eugene_V_Debs'],
      intent: 'Help the seeker think about justice, moral courage, and the distance between a nation\'s promises and its practice.',
      matter: [
        {
          title: 'The Unfinished Work',
          text: [
            'Four American voices who refused to accept the country as it was — each with a different theory of how a wrong is undone.',
            '',
            '• Lincoln — the patient statesman who bends law and grief toward union.',
            '• King — disciplined love and nonviolent direct action; the fierce urgency of now.',
            '• Garrison — the moral absolutist who will not retreat an inch or moderate a word.',
            '• Debs — the voice of labor: while there is a soul in prison, none are free.',
            '',
            'They disagree about tactics, patience, and compromise. Let them argue. The friction is where the seeker\'s own conscience is clarified.'
          ].join('\n')
        }
      ]
    },

    {
      id: 'flight',
      name: 'The Workshop of Flight',
      sigil: '△',
      tagline: 'Two brothers teach an information-drowned age to rise.',
      personas: ['Wilbur_Wright', 'Orville_Wright'],
      intent: 'Help the seeker learn to navigate an overwhelming new medium — by control and measurement, not brute force.',
      matter: [
        {
          title: 'Control Before Power',
          text: [
            'Everyone before the Wrights chased more power. The brothers understood the real problem was control — balance in three axes, measured honestly by the pilot who would fly.',
            '',
            'They distrusted the published data of their day and built their own wind tunnel to measure the wind themselves. They iterated in a bicycle shop, with their hands, patiently, until a heavy age left the ground.',
            '',
            'Treat the modern flood of information as the turbulent air. The lesson is the same: lightness, control, and the nerve to measure for yourself.'
          ].join('\n')
        }
      ]
    }

  ];

  var BY_ID = {};
  PRESETS.forEach(function (p) { BY_ID[p.id] = p; });

  return {
    all: function () { return PRESETS.slice(); },
    get: function (id) { return BY_ID[id] || null; }
  };

})();
