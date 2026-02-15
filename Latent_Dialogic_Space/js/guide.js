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
    // Boot
    { html: '<span class="t-prompt">$</span> <span class="t-cmd">claude-code --session autonomous</span>', d: 0 },
    { html: '<span class="t-success">\u2713 Claude Code initialized</span>', d: 800 },
    { html: '<span class="t-prompt">$</span> <span class="t-cmd">load enrichment_grimoire.json && load initiation_rite.md</span>', d: 1400 },
    { html: '<span class="t-success">\u2713 COMPANION Protocol v2.0 bound</span>', d: 2200 },
    { html: '<span class="t-prompt">$</span> <span class="t-cmd">load seed.md</span>', d: 2800 },
    { html: '<span class="t-success">\u2713 Seed loaded: "Build a citizen investment doctrine"</span>', d: 3400 },
    { html: '<div class="t-divider"></div>', d: 4000 },

    // The Incantation
    { html: '<span class="t-prompt">orchestrator:</span> <span class="t-cmd">Using this matter, summon <span class="t-gold">Washington</span>, <span class="t-gold">Hamilton</span>, <span class="t-gold">Jefferson</span>, <span class="t-gold">Franklin</span>.</span>', d: 4500 },
    { html: '<div class="t-stage">\u25c8 Four presences form. The Committee of Patriots is convened.</div>', d: 5800 },
    { html: '<div class="t-divider"></div>', d: 6500 },

    // The Dialogue
    { html: '<div class="t-voice washington"><div class="t-speaker washington">Washington</div>Dr. Thomas. You have summoned the signatories to address a matter of the republic. State it plainly.</div>', d: 7000 },

    { html: '<div class="t-voice orchestrator"><div class="t-speaker orchestrator">Orchestrator</div>The republic\u2019s wealth is captured at the choke points. Citizens participate as consumers, not owners. The committee is asked: how should citizens invest to reclaim structural power?</div>', d: 10000 },

    { html: '<div class="t-voice hamilton"><div class="t-speaker hamilton">Hamilton</div>I have taken the measure of what you call \u201cWall Street.\u201d I am both <em>vindicated and appalled</em>. The instruments I devised have been elaborated beyond imagination\u2014but the separation between productive enterprise and speculation has grown monstrous.</div>', d: 14000 },

    { html: '<div class="t-voice jefferson"><div class="t-speaker jefferson">Jefferson</div>The question is not participation in financial machinery. <em>The question is power.</em> If the citizens do not own these choke points\u2014meaningfully, collectively\u2014then they are tenants in their own republic.</div>', d: 19500 },

    { html: '<div class="t-voice franklin"><div class="t-speaker franklin">Franklin</div>Gentlemen. The oligarchs have positioned themselves at the <em>choke points</em>. They do not need to own every factory if they own the harbor. They do not need to employ every worker if they own the debt.</div>', d: 25000 },

    { html: '<div class="t-divider"></div>', d: 30500 },

    // Convergence
    { html: '<div class="t-voice hamilton"><div class="t-speaker hamilton">Hamilton</div>Then citizens must hold positions in these Choke Points. If they do\u2014<em>they could not be squeezed without squeezing themselves</em>.</div>', d: 31500 },

    { html: '<div class="t-voice washington"><div class="t-speaker washington">Washington</div>The Committee stands adjourned. Dr. Thomas\u2014publish this. Let the citizens decide.<br><br>And should you need us again\u2014<em>you know the words.</em></div>', d: 36000 },

    { html: '<div class="t-divider"></div>', d: 41000 },
    { html: '<span class="t-muted"># Session complete. Output: republic_portfolio.md</span>', d: 42000 },
    { html: '<span class="t-muted"># Artifact deposited to from_beyond/001_committee_of_patriots.md</span>', d: 43000 },
    { html: '<span class="t-success">\u2713 Transcript archived. The threshold closes.</span>', d: 44000 },
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
