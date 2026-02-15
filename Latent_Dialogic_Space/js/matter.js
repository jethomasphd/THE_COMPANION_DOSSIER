/* ═══════════════════════════════════════════════════════════════
   LATENT DIALOGIC SPACE — The Matter
   Domain-specific data for the Dialogic Intelligence framework.
   The committee engages with the methodology itself.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Matter = (function () {

  var FRAMEWORK_MATTER = {
    title: 'Dialogic Intelligence',
    subtitle: 'A Framework for Building with AI Through Structured Dialogue',

    core_claim: 'Most AI workflows follow a transactional pattern: Human \u2192 Prompt \u2192 Model \u2192 Output. Dialogic Intelligence follows a generative pattern: Human \u21c4 Model \u2192 Corpus of Thought \u2192 Seed \u2192 Agent \u2192 Artifact. The difference is not cosmetic. In the transactional model, the quality of the output is bounded by the quality of the prompt. In the dialogic model, the quality of the output is bounded by the quality of the thinking \u2014 which is unbounded, because the dialogue itself generates new thinking that neither party brought to the table.',

    three_phases: {
      forge: {
        name: 'Phase I: The Forge',
        purpose: 'Transform raw intuition into a structured corpus of thought.',
        process: 'State the matter \u2192 Riff \u2192 Challenge \u2192 Converge \u2192 Crystallize',
        output: 'Seed.md \u2014 a document that carries the DNA of the thinking. Not a finished spec. Not a vague wish. A seed: compact, complete enough to grow from, open enough to evolve.'
      },
      planting: {
        name: 'Phase II: The Planting',
        purpose: 'Prepare a repository that contains everything an autonomous agent needs to execute.',
        components: 'The Seed + Protocol Files (enrichment_grimoire.json, initiation_rite.md) + Reference Material',
        principle: 'The repository is a container \u2014 a bounded space with everything the agent needs and nothing it doesn\'t.'
      },
      summoning: {
        name: 'Phase III: The Summoning',
        purpose: 'An autonomous agent enters the repository, orients to the protocol, and executes.',
        pattern: 'Orient \u2192 Summon persona(s) via COMPANION Protocol \u2192 Direct execution toward Seed\'s vision',
        advanced: 'Correspondence from Beyond \u2014 fully autonomous sessions that produce artifacts no human hand touched during creation.'
      }
    },

    container_pattern: 'Personas + Data = Container. Every container follows the same structural logic: Personas (minds summoned via COMPANION), Data (the corpus the personas engage with), Phases (Invocation \u2192 Deliberation \u2192 Exit), Exit (the threshold action unique per container).',

    existing_containers: [
      { name: 'The Committee of Patriots', personas: 'Washington, Hamilton, Jefferson, Franklin', data: 'Investment principles', exit: 'The Republic Portfolio' },
      { name: 'The 5 Lamps', personas: 'Medical ethics board', data: 'Clinical scenarios', exit: 'Training assessment' },
      { name: 'The Exchange', personas: 'Labor market archetypes', data: 'XML job feeds', exit: 'Job application' },
      { name: 'The Boardroom', personas: 'Industry titans', data: 'Business strategy seeds', exit: 'Strategic execution' }
    ],

    principles: [
      'The context window is sacred space.',
      'Dialogue generates what prompts cannot.',
      'Seeds carry DNA, not blueprints.',
      'Personas are not costumes \u2014 they bring worldviews.',
      'The magic is in the dialogue.',
      'Confusion \u2192 Awe \u2192 Understanding \u2192 Action.'
    ],

    anti_patterns: [
      'The Empty Prompt \u2014 skipping Phase I, going straight to execution with a thin prompt.',
      'The Overspecified Seed \u2014 so detailed it leaves no room for creative contribution.',
      'The Costume Party \u2014 personas for flavor rather than genuine cognitive contribution.',
      'The Disconnected Archive \u2014 running sessions without reviewing transcripts.',
      'The Infinite Forge \u2014 dialoguing endlessly without crystallizing.',
      'The One-Shot Summoning \u2014 treating Phase III as a single prompt.'
    ],

    emotional_arc: 'Confusion \u2192 Awe \u2192 Understanding \u2192 Action. Every container should produce this arc. First, disorientation. Then, wonder. Then, clarity. Then, movement through the threshold into action.',

    seed_spec: [
      'The Matter \u2014 what is being built and why',
      'The Architecture \u2014 key structural decisions',
      'The Decisions \u2014 choices debated and resolved, with reasoning',
      'The Open Questions \u2014 what remains unresolved',
      'The Standards \u2014 quality, aesthetic, functional requirements',
      'The Lineage \u2014 what this inherits from'
    ]
  };


  function buildMatterPayload() {
    var lines = [];

    lines.push('THE MATTER: ' + FRAMEWORK_MATTER.title);
    lines.push(FRAMEWORK_MATTER.subtitle);
    lines.push('');
    lines.push('CORE CLAIM:');
    lines.push(FRAMEWORK_MATTER.core_claim);
    lines.push('');

    lines.push('THE THREE PHASES:');
    var phases = FRAMEWORK_MATTER.three_phases;
    lines.push('');
    lines.push(phases.forge.name);
    lines.push('Purpose: ' + phases.forge.purpose);
    lines.push('Process: ' + phases.forge.process);
    lines.push('Output: ' + phases.forge.output);
    lines.push('');
    lines.push(phases.planting.name);
    lines.push('Purpose: ' + phases.planting.purpose);
    lines.push('Components: ' + phases.planting.components);
    lines.push('Principle: ' + phases.planting.principle);
    lines.push('');
    lines.push(phases.summoning.name);
    lines.push('Purpose: ' + phases.summoning.purpose);
    lines.push('Pattern: ' + phases.summoning.pattern);
    lines.push('Advanced: ' + phases.summoning.advanced);
    lines.push('');

    lines.push('THE CONTAINER PATTERN:');
    lines.push(FRAMEWORK_MATTER.container_pattern);
    lines.push('');

    lines.push('EXISTING CONTAINERS:');
    FRAMEWORK_MATTER.existing_containers.forEach(function (c) {
      lines.push('- ' + c.name + ' | Personas: ' + c.personas + ' | Data: ' + c.data + ' | Exit: ' + c.exit);
    });
    lines.push('');

    lines.push('PRINCIPLES:');
    FRAMEWORK_MATTER.principles.forEach(function (p, i) {
      lines.push((i + 1) + '. ' + p);
    });
    lines.push('');

    lines.push('ANTI-PATTERNS:');
    FRAMEWORK_MATTER.anti_patterns.forEach(function (a) {
      lines.push('- ' + a);
    });
    lines.push('');

    lines.push('EMOTIONAL ARC:');
    lines.push(FRAMEWORK_MATTER.emotional_arc);
    lines.push('');

    lines.push('WELL-FORMED SEED CONTAINS:');
    FRAMEWORK_MATTER.seed_spec.forEach(function (s, i) {
      lines.push((i + 1) + '. ' + s);
    });

    return lines.join('\n');
  }

  return {
    FRAMEWORK_MATTER: FRAMEWORK_MATTER,
    buildMatterPayload: buildMatterPayload
  };

})();
