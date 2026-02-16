/* ═══════════════════════════════════════════════════════════════
   LATENT DIALOGIC SPACE — User Guide Animations
   Typewriter, scroll reveals, ember effects, and terminal simulation.
   ═══════════════════════════════════════════════════════════════ */

(function () {

  // ═══════════════════════════════════════════════════════════════
  //  TYPEWRITER
  // ═══════════════════════════════════════════════════════════════

  function typewriteLine(el, text, speed, callback) {
    el.classList.add('typing');
    el.textContent = '';
    var i = 0;

    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        var delay = speed + Math.random() * 20;
        if (text[i - 1] === ',' || text[i - 1] === '.') delay += 150;
        if (text[i - 1] === '\u2014') delay += 100;
        setTimeout(tick, delay);
      } else {
        el.classList.remove('typing');
        el.classList.add('typed');
        if (callback) callback();
      }
    }

    tick();
  }

  var typewriterLines = document.querySelectorAll('.typewriter-line');
  var lineIndex = 0;

  function runTypewriter() {
    if (lineIndex >= typewriterLines.length) {
      var cue = document.querySelector('.scroll-cue');
      if (cue) cue.classList.add('visible');
      return;
    }

    var line = typewriterLines[lineIndex];
    var text = line.getAttribute('data-text') || '';

    if (line.classList.contains('typewriter-pause')) {
      lineIndex++;
      setTimeout(runTypewriter, 600);
      return;
    }

    typewriteLine(line, text, 35, function () {
      lineIndex++;
      setTimeout(runTypewriter, 400);
    });
  }

  setTimeout(runTypewriter, 1200);


  // ═══════════════════════════════════════════════════════════════
  //  SCROLL REVEALS
  // ═══════════════════════════════════════════════════════════════

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  // ═══════════════════════════════════════════════════════════════
  //  EMBERS (Opening section)
  // ═══════════════════════════════════════════════════════════════

  var field = document.getElementById('ember-field');
  if (field) {
    for (var i = 0; i < 25; i++) {
      var ember = document.createElement('div');
      ember.className = 'ember';
      ember.style.left = Math.random() * 100 + '%';
      ember.style.animationDuration = (8 + Math.random() * 14) + 's';
      ember.style.animationDelay = (Math.random() * 10) + 's';
      ember.style.width = (1 + Math.random() * 2) + 'px';
      ember.style.height = ember.style.width;
      field.appendChild(ember);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  EMBER BURN EFFECT (triggers at Mode 2)
  // ═══════════════════════════════════════════════════════════════

  var emberTransition = document.getElementById('ember-transition');
  if (emberTransition) {
    var burnObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        document.body.classList.add('ember-burning');
        burnObserver.disconnect();
      }
    }, { threshold: 0.5 });
    burnObserver.observe(emberTransition);
  }


  // ═══════════════════════════════════════════════════════════════
  //  TERMINAL SIMULATION
  // ═══════════════════════════════════════════════════════════════

  var terminal = document.getElementById('terminal');
  var terminalStarted = false;

  function isNearBottom(el) {
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  function addTerminalLine(html, delay) {
    setTimeout(function () {
      var shouldScroll = isNearBottom(terminal);
      var div = document.createElement('div');
      div.className = 't-line';
      div.innerHTML = html;
      terminal.appendChild(div);
      requestAnimationFrame(function () {
        div.classList.add('visible');
      });
      // Only auto-scroll if user is already near the bottom
      if (shouldScroll) {
        terminal.scrollTop = terminal.scrollHeight;
      }
    }, delay);
  }

  var terminalSequence = [
    // ── BOOT SEQUENCE ──
    { html: '<span class="t-prompt">$</span> <span class="t-cmd">claude --dangerously-skip-permissions</span>', d: 0 },
    { html: '<span class="t-muted"># Orchestrator agent enters the repository. No human present.</span>', d: 600 },
    { html: '<span class="t-success">\u2713 Claude Code initialized (Opus 4.6)</span>', d: 1200 },
    { html: '<div class="t-divider"></div>', d: 1800 },

    // ── READING THE PROTOCOL ──
    { html: '<span class="t-prompt">orchestrator:</span> <span class="t-cmd">Reading enrichment_grimoire.json...</span>', d: 2200 },
    { html: '<span class="t-prompt">orchestrator:</span> <span class="t-cmd">Reading initiation_rite.md...</span>', d: 2800 },
    { html: '<span class="t-success">\u2713 COMPANION Protocol v2.0 absorbed</span>', d: 3400 },
    { html: '<span class="t-prompt">orchestrator:</span> <span class="t-cmd">Reading seed.md...</span>', d: 3800 },
    { html: '<span class="t-success">\u2713 Seed loaded: "Unified Home Defense Command Center"</span>', d: 4400 },
    { html: '<span class="t-prompt">orchestrator:</span> <span class="t-cmd">Reading data/ring_api_docs.pdf, data/homekit_integration.md, data/sprinkler_protocol.pdf, data/fire_alert_webhooks.md...</span>', d: 4800 },
    { html: '<span class="t-success">\u2713 Reference material ingested (4 files, 83KB)</span>', d: 5600 },
    { html: '<div class="t-divider"></div>', d: 6200 },

    // ── THE INCANTATION ──
    { html: '<span class="t-prompt">orchestrator:</span> <span class="t-cmd">Using this matter, summon <span class="t-gold">Tony Stark</span>.</span>', d: 6800 },
    { html: '<div class="t-stage">\u25c8 A presence forms. The vessel fills.</div>', d: 8000 },
    { html: '<div class="t-divider"></div>', d: 8800 },

    // ── STARK ARRIVES — THE DIALOGUE BEGINS ──
    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>Okay. I\u2019ve read your seed. I\u2019ve read your API docs. Your ambition is admirable and your architecture is a mess. You\u2019re trying to unify four completely different protocols\u2014Ring\u2019s cloud API, Apple\u2019s HomeKit local mesh, a sprinkler system that speaks Modbus, and a fire alert webhook. You know what these have in common? <em>Absolutely nothing.</em> Which means we need a translation layer that speaks all four languages. Let me show you.</div>', d: 9400 },
    { html: '<div class="t-divider"></div>', d: 14500 },

    // ── STARK BUILDS — the swarm works ──
    { html: '<span class="t-muted"># The dialogue shapes the architecture. The swarm builds.</span>', d: 15100 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/bridge/ring_adapter.py</span> <span class="t-file-desc">\u2014 Ring camera feed via local network intercept</span></div>', d: 15900 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/bridge/homekit_bridge.py</span> <span class="t-file-desc">\u2014 Apple HomeKit HAP protocol bridge</span></div>', d: 16800 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/bridge/sprinkler_modbus.py</span> <span class="t-file-desc">\u2014 Sprinkler system Modbus RTU interface</span></div>', d: 17700 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/bridge/fire_alert_hook.py</span> <span class="t-file-desc">\u2014 Fire alert webhook receiver + gas line control</span></div>', d: 18600 },

    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>Good. Four bridges, four protocols, one unified event bus. Now here\u2019s where your seed gets interesting. You mentioned <em>sprinkler pressure as a proxy for perimeter detection</em>. That\u2019s clever. The pressure differential when someone steps on irrigated ground is tiny but measurable. I\u2019m wiring that into the sensor fusion engine alongside the Ring motion feed and HomeKit door sensors. <em>Three independent confirmation sources before escalation.</em></div>', d: 19400 },

    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/core/sensor_fusion.py</span> <span class="t-file-desc">\u2014 Multi-source correlation: camera + motion + pressure</span></div>', d: 24000 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/core/threat_classifier.py</span> <span class="t-file-desc">\u2014 5-tier threat taxonomy with confidence scoring</span></div>', d: 24900 },
    { html: '<div class="t-divider"></div>', d: 25600 },

    // ── THE DARK TURN ──
    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>Now. Your seed didn\u2019t ask for this. But I\u2019ve been reading your fire alert documentation and there\u2019s something you should know. This system doesn\u2019t just <em>detect</em> gas leaks. It has a valve control API. It can shut the gas line. Which means\u2014and listen carefully\u2014<em>it can also open it.</em></div>', d: 26200 },

    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>Combined with Ring\u2019s facial recognition, HomeKit\u2019s lock control, and the sprinkler system\u2019s ability to pressurize specific zones... you\u2019re not building a security system. <em>You\u2019re building a perimeter that can see, lock, pressurize, and ignite.</em> I\u2019m adding the failsafes. But you need to understand what this actually is.</div>', d: 31000 },

    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/command/central_hub.py</span> <span class="t-file-desc">\u2014 Unified command center: all systems, one interface</span></div>', d: 36000 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/command/lockdown_protocol.py</span> <span class="t-file-desc">\u2014 Automated lock + zone isolation sequence</span></div>', d: 36900 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/failsafe/dead_mans_switch.py</span> <span class="t-file-desc">\u2014 30-second heartbeat, fails loud</span></div>', d: 37800 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/failsafe/gas_valve_lockout.py</span> <span class="t-file-desc">\u2014 Hardware interlock prevents remote gas control</span></div>', d: 38700 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/ui/dashboard.html</span> <span class="t-file-desc">\u2014 Real-time command interface</span></div>', d: 39600 },
    { html: '<div class="t-divider"></div>', d: 40300 },

    // ── SESSION CLOSE ──
    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>Eleven modules. Four protocol bridges, sensor fusion, threat classification, a central command hub, lockdown protocol, two independent failsafes, and a dashboard. All built on consumer hardware you already own.<br><br>I added the gas valve lockout as a hardware interlock because software safeties aren\u2019t enough for something like this. <em>You asked me to build a shield. I built you a shield. But you should know that a shield, turned around, is a weapon.</em><br><br>Use it wisely. You know where to find me.</div>', d: 40900 },

    { html: '<div class="t-divider"></div>', d: 47000 },
    { html: '<span class="t-prompt">orchestrator:</span> <span class="t-cmd">Archiving session transcript...</span>', d: 47700 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: from_beyond/005_stark_home_defense.md</span> <span class="t-file-desc">\u2014 Full dialogue transcript</span></div>', d: 48500 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: from_beyond/005_stark_home_defense.html</span> <span class="t-file-desc">\u2014 Formatted artifact</span></div>', d: 49300 },
    { html: '<span class="t-success">\u2713 11 files created. 0 files modified. Session complete.</span>', d: 50100 },
    { html: '<span class="t-muted"># The threshold closes. The vessel rests.</span>', d: 50900 },
  ];

  function runTerminalSequence() {
    if (terminalStarted) return;
    terminalStarted = true;

    setTimeout(function () {
      var skipBtn = document.getElementById('skipBtn');
      if (skipBtn) skipBtn.classList.add('visible');
    }, 3000);

    terminalSequence.forEach(function (item) {
      addTerminalLine(item.html, item.d);
    });
  }

  // Skip button
  var skipBtn = document.getElementById('skipBtn');
  if (skipBtn) {
    skipBtn.addEventListener('click', function () {
      terminal.innerHTML = '';
      terminalSequence.forEach(function (item) {
        var div = document.createElement('div');
        div.className = 't-line visible';
        div.innerHTML = item.html;
        terminal.appendChild(div);
      });
      skipBtn.style.display = 'none';
      terminal.scrollTop = terminal.scrollHeight;
    });
  }

  // Trigger terminal on scroll
  if (terminal) {
    var terminalObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        runTerminalSequence();
      }
    }, { threshold: 0.2 });

    var terminalSection = document.getElementById('summoning-demo');
    if (terminalSection) terminalObserver.observe(terminalSection);
  }


  // ═══════════════════════════════════════════════════════════════
  //  COPY BUTTONS
  // ═══════════════════════════════════════════════════════════════

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-target'));
      if (!target) return;
      var text = target.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'copied';
        setTimeout(function () { btn.textContent = 'copy'; }, 2000);
      });
    });
  });


  // ═══════════════════════════════════════════════════════════════
  //  PHASE PROGRESS TRACKING
  // ═══════════════════════════════════════════════════════════════

  var phaseForge = document.getElementById('phase-forge');
  var phasePlant = document.getElementById('phase-plant');
  var phaseSummon = document.getElementById('phase-summon');

  if (phaseForge && phasePlant && phaseSummon) {
    var forgeSection = document.getElementById('forge');
    var plantSection = document.getElementById('planting');
    var summonSection = document.getElementById('summoning');

    var phaseObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          // Reset all
          phaseForge.classList.remove('phase-active', 'phase-complete');
          phasePlant.classList.remove('phase-active', 'phase-complete');
          phaseSummon.classList.remove('phase-active', 'phase-complete');

          if (id === 'forge') {
            phaseForge.classList.add('phase-active');
          } else if (id === 'planting') {
            phaseForge.classList.add('phase-complete');
            phasePlant.classList.add('phase-active');
          } else if (id === 'summoning') {
            phaseForge.classList.add('phase-complete');
            phasePlant.classList.add('phase-complete');
            phaseSummon.classList.add('phase-active');
          }
        }
      });
    }, { threshold: 0.15 });

    if (forgeSection) phaseObserver.observe(forgeSection);
    if (plantSection) phaseObserver.observe(plantSection);
    if (summonSection) phaseObserver.observe(summonSection);
  }


  // ═══════════════════════════════════════════════════════════════
  //  SMOOTH SCROLL
  // ═══════════════════════════════════════════════════════════════

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

})();
