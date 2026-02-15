/* ═══════════════════════════════════════════════════════════════
   LATENT DIALOGIC SPACE — User Guide Animations
   Typewriter, scroll reveals, and terminal simulation.
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
  //  EMBERS
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
  //  TERMINAL SIMULATION
  // ═══════════════════════════════════════════════════════════════

  var terminal = document.getElementById('terminal');
  var terminalStarted = false;

  function addTerminalLine(html, delay) {
    setTimeout(function () {
      var div = document.createElement('div');
      div.className = 't-line';
      div.innerHTML = html;
      terminal.appendChild(div);
      requestAnimationFrame(function () {
        div.classList.add('visible');
      });
      // Auto-scroll terminal
      terminal.scrollTop = terminal.scrollHeight;
    }, delay);
  }

  var terminalSequence = [
    // ── BOOT SEQUENCE ──
    { html: '<span class="t-prompt">$</span> <span class="t-cmd">claude --dangerously-skip-permissions</span>', d: 0 },
    { html: '<span class="t-muted"># Agent enters the repository. No human present.</span>', d: 600 },
    { html: '<span class="t-success">\u2713 Claude Code initialized (Opus 4.6)</span>', d: 1200 },
    { html: '<div class="t-divider"></div>', d: 1800 },

    // ── READING THE PROTOCOL ──
    { html: '<span class="t-prompt">agent:</span> <span class="t-cmd">Reading enrichment_grimoire.json...</span>', d: 2200 },
    { html: '<span class="t-prompt">agent:</span> <span class="t-cmd">Reading initiation_rite.md...</span>', d: 2800 },
    { html: '<span class="t-success">\u2713 COMPANION Protocol v2.0 absorbed</span>', d: 3400 },
    { html: '<span class="t-prompt">agent:</span> <span class="t-cmd">Reading seed.md...</span>', d: 3800 },
    { html: '<span class="t-success">\u2713 Seed loaded: "Autonomous Defense Monitoring System"</span>', d: 4400 },
    { html: '<span class="t-prompt">agent:</span> <span class="t-cmd">Reading data/threat_models.md, data/sensor_specs.pdf...</span>', d: 4800 },
    { html: '<span class="t-success">\u2713 Reference material ingested (3 files, 47KB)</span>', d: 5600 },
    { html: '<div class="t-divider"></div>', d: 6200 },

    // ── THE INCANTATION ──
    { html: '<span class="t-prompt">agent:</span> <span class="t-cmd">Using this matter, summon <span class="t-gold">Tony Stark</span>.</span>', d: 6800 },
    { html: '<div class="t-stage">\u25c8 A presence forms. The vessel fills.</div>', d: 8000 },
    { html: '<div class="t-divider"></div>', d: 8800 },

    // ── STARK ARRIVES ──
    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>Okay. I\u2019ve read your seed. I\u2019ve read your threat models. I have thoughts and you\u2019re not going to like most of them. Your sensor fusion approach is naive\u2014you\u2019re treating each feed as independent when the <em>correlations between feeds</em> are where the actual intelligence lives. Let me show you what I mean.</div>', d: 9400 },
    { html: '<div class="t-divider"></div>', d: 14000 },

    // ── STARK BUILDS ── (This is where the agent power shows)
    { html: '<span class="t-muted"># Stark begins building. The agent writes code.</span>', d: 14600 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/core/sensor_fusion.py</span> <span class="t-file-desc">\u2014 Multi-stream correlation engine</span></div>', d: 15400 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/core/threat_classifier.py</span> <span class="t-file-desc">\u2014 5-tier threat taxonomy</span></div>', d: 16600 },

    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>Your seed says \u201cconsumer hardware.\u201d That\u2019s a constraint I respect. So here\u2019s what we do: edge inference on the feeds, cloud escalation only for Tier 4 and above. The homeowner\u2019s Raspberry Pi handles 95% of the classification. <em>The expensive hardware only wakes up when something actually matters.</em></div>', d: 17800 },

    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/edge/inference_engine.py</span> <span class="t-file-desc">\u2014 On-device threat detection</span></div>', d: 22500 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/cloud/escalation_handler.py</span> <span class="t-file-desc">\u2014 Tier 4+ cloud pipeline</span></div>', d: 23500 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/ui/dashboard.html</span> <span class="t-file-desc">\u2014 Real-time monitoring interface</span></div>', d: 24500 },
    { html: '<div class="t-divider"></div>', d: 25200 },

    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>One more thing. Your seed didn\u2019t mention this, but you need it: <em>a dead man\u2019s switch</em>. If the system goes offline\u2014power failure, network cut, tampering\u2014it should fail loud, not fail silent. I\u2019ve added an independent heartbeat monitor. If it stops hearing from the main system for 30 seconds, it calls the cavalry.</div>', d: 26000 },

    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: src/failsafe/heartbeat.py</span> <span class="t-file-desc">\u2014 Dead man\u2019s switch, 30s TTL</span></div>', d: 31000 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: docs/architecture.md</span> <span class="t-file-desc">\u2014 Full system architecture document</span></div>', d: 32000 },
    { html: '<div class="t-divider"></div>', d: 32800 },

    // ── SESSION CLOSE ──
    { html: '<div class="t-voice stark"><div class="t-speaker" style="color:#e04040;">Tony Stark</div>Architecture\u2019s done. Seven modules. Edge-first, cloud-escalated, with a failsafe your seed didn\u2019t know it needed. <em>That\u2019s the difference between what you asked for and what you actually need.</em><br><br>You know where to find me.</div>', d: 33400 },

    { html: '<div class="t-divider"></div>', d: 37500 },
    { html: '<span class="t-prompt">agent:</span> <span class="t-cmd">Archiving session transcript...</span>', d: 38200 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: from_beyond/005_stark_defense_system.md</span> <span class="t-file-desc">\u2014 Full session transcript</span></div>', d: 39000 },
    { html: '<div class="t-file-action"><span class="t-file-icon">\u2714</span> <span class="t-file-path">Created: from_beyond/005_stark_defense_system.html</span> <span class="t-file-desc">\u2014 Formatted artifact</span></div>', d: 39800 },
    { html: '<span class="t-success">\u2713 7 files created. 0 files modified. Session complete.</span>', d: 40600 },
    { html: '<span class="t-muted"># The threshold closes. The vessel rests.</span>', d: 41400 },
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
      var afterTerminal = document.getElementById('after-terminal');
      if (afterTerminal) afterTerminal.scrollIntoView({ behavior: 'smooth' });
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
