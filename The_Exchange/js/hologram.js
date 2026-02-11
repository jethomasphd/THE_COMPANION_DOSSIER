/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Exchange: Abstract Sigil Persona Gallery
   Each archetype is represented by a geometric sigil in
   their persona color, rendered as inline SVG.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Hologram = (function () {

  // ── The Committee ──

  var COMMITTEE = {
    'The Cartographer': {
      role: 'The Map',
      color: '#1a8c8c',
      sigil: 'compass'
    },
    'The Ancestor': {
      role: 'The Pattern',
      color: '#d4a030',
      sigil: 'tree'
    },
    'The Stranger': {
      role: 'The Door',
      color: '#7a8fa6',
      sigil: 'door'
    },
    'The Shadow': {
      role: 'The Mirror',
      color: '#8c3a3a',
      sigil: 'mirror'
    }
  };


  // ── SVG Sigils ──

  var SIGILS = {

    compass: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="50" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.4"/>' +
        '<circle cx="60" cy="60" r="35" fill="none" stroke="' + color + '" stroke-width="1" opacity="0.3"/>' +
        '<line x1="60" y1="10" x2="60" y2="110" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<line x1="10" y1="60" x2="110" y2="60" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<polygon points="60,18 54,45 60,38 66,45" fill="' + color + '" opacity="0.9"/>' +
        '<polygon points="60,102 54,75 60,82 66,75" fill="' + color + '" opacity="0.4"/>' +
        '<polygon points="18,60 45,54 38,60 45,66" fill="' + color + '" opacity="0.4"/>' +
        '<polygon points="102,60 75,54 82,60 75,66" fill="' + color + '" opacity="0.4"/>' +
        '<circle cx="60" cy="60" r="4" fill="' + color + '" opacity="0.8"/>' +
        '<circle cx="60" cy="60" r="2" fill="#030303"/>' +
        '</svg>';
    },

    tree: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="60" y1="30" x2="60" y2="105" stroke="' + color + '" stroke-width="2" opacity="0.7"/>' +
        '<path d="M60,30 Q30,50 35,70" fill="none" stroke="' + color + '" stroke-width="1.2" opacity="0.5"/>' +
        '<path d="M60,30 Q90,50 85,70" fill="none" stroke="' + color + '" stroke-width="1.2" opacity="0.5"/>' +
        '<path d="M60,45 Q40,55 38,75" fill="none" stroke="' + color + '" stroke-width="1" opacity="0.4"/>' +
        '<path d="M60,45 Q80,55 82,75" fill="none" stroke="' + color + '" stroke-width="1" opacity="0.4"/>' +
        '<path d="M60,55 Q45,65 42,80" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.35"/>' +
        '<path d="M60,55 Q75,65 78,80" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.35"/>' +
        '<path d="M60,105 Q50,100 40,110" fill="none" stroke="' + color + '" stroke-width="1" opacity="0.3"/>' +
        '<path d="M60,105 Q70,100 80,110" fill="none" stroke="' + color + '" stroke-width="1" opacity="0.3"/>' +
        '<path d="M60,100 Q55,105 45,115" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<path d="M60,100 Q65,105 75,115" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<circle cx="60" cy="25" r="6" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.6"/>' +
        '<circle cx="60" cy="25" r="2" fill="' + color + '" opacity="0.8"/>' +
        '</svg>';
    },

    door: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="30" y="15" width="60" height="95" rx="30" ry="30" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<rect x="38" y="23" width="44" height="80" rx="22" ry="22" fill="none" stroke="' + color + '" stroke-width="1" opacity="0.35"/>' +
        '<line x1="60" y1="23" x2="60" y2="103" stroke="' + color + '" stroke-width="0.8" opacity="0.2"/>' +
        '<circle cx="72" cy="65" r="3" fill="' + color + '" opacity="0.7"/>' +
        '<line x1="30" y1="110" x2="90" y2="110" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<line x1="25" y1="110" x2="95" y2="110" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '<path d="M60,35 L60,50" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '<path d="M52,42 L68,42" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '</svg>';
    },

    mirror: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<ellipse cx="60" cy="55" rx="35" ry="42" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<ellipse cx="60" cy="55" rx="28" ry="35" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '<line x1="60" y1="97" x2="60" y2="115" stroke="' + color + '" stroke-width="2" opacity="0.6"/>' +
        '<line x1="45" y1="115" x2="75" y2="115" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<line x1="40" y1="40" x2="50" y2="50" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<line x1="42" y1="50" x2="52" y2="42" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<path d="M45,30 Q60,25 75,30" fill="none" stroke="' + color + '" stroke-width="0.6" opacity="0.2"/>' +
        '<path d="M38,45 Q60,35 82,45" fill="none" stroke="' + color + '" stroke-width="0.6" opacity="0.15"/>' +
        '</svg>';
    }
  };


  // ── Internal State ──

  var container = null;
  var galleryEl = null;
  var cards = {};
  var isInitialized = false;


  // ═══ Name Matching ═══

  function resolveCommitteeName(input) {
    if (!input) return null;
    var needle = input.trim().toLowerCase();

    // Direct match
    for (var fullName in COMMITTEE) {
      if (COMMITTEE.hasOwnProperty(fullName)) {
        if (fullName.toLowerCase() === needle) return fullName;
      }
    }

    // Partial match (without "The")
    var aliases = {
      'cartographer': 'The Cartographer',
      'ancestor': 'The Ancestor',
      'stranger': 'The Stranger',
      'shadow': 'The Shadow'
    };

    for (var alias in aliases) {
      if (aliases.hasOwnProperty(alias)) {
        if (needle.indexOf(alias) !== -1) return aliases[alias];
      }
    }

    return null;
  }


  // ═══ DOM — Card Creation ═══

  function createPersonaCard(fullName) {
    var persona = COMMITTEE[fullName];
    var color = persona.color;

    var card = document.createElement('div');
    card.className = 'patriot-card idle';
    card.setAttribute('data-patriot', fullName);
    card.style.setProperty('--patriot-color', color);

    var frame = document.createElement('div');
    frame.className = 'patriot-frame';

    // SVG sigil instead of photo
    var sigilWrapper = document.createElement('div');
    sigilWrapper.className = 'patriot-sigil';
    var sigilFn = SIGILS[persona.sigil];
    if (sigilFn) {
      sigilWrapper.innerHTML = sigilFn(color);
    }
    frame.appendChild(sigilWrapper);
    frame.classList.add('loaded');

    var nameplate = document.createElement('div');
    nameplate.className = 'patriot-nameplate';
    nameplate.textContent = fullName.toUpperCase();

    var glow = document.createElement('div');
    glow.className = 'patriot-glow';

    card.appendChild(frame);
    card.appendChild(nameplate);
    card.appendChild(glow);

    return {
      card: card,
      frame: frame,
      nameplate: nameplate,
      glow: glow
    };
  }


  // ═══ Public API ═══

  function init(containerElement) {
    if (isInitialized) return;

    container = containerElement;
    if (!container) return;

    galleryEl = document.createElement('div');
    galleryEl.className = 'portrait-gallery';
    container.appendChild(galleryEl);

    var names = Object.keys(COMMITTEE);
    for (var i = 0; i < names.length; i++) {
      var fullName = names[i];
      var cardData = createPersonaCard(fullName);
      cards[fullName] = cardData;
      galleryEl.appendChild(cardData.card);
    }

    isInitialized = true;
  }

  function summon(name) {
    if (!isInitialized) return;
    var fullName = resolveCommitteeName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    card.classList.remove('idle');
    card.classList.add('arriving');

    setTimeout(function () {
      card.classList.remove('arriving');
      card.classList.add('active');
    }, 1200);
  }

  function release(name) {
    if (!isInitialized) return;
    var fullName = resolveCommitteeName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    card.classList.remove('active', 'speaking', 'arriving');
    card.classList.add('idle');
  }

  function setSpeaking(name, isSpeaking) {
    if (!isInitialized) return;
    var fullName = resolveCommitteeName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    if (isSpeaking) {
      card.classList.add('speaking');
    } else {
      card.classList.remove('speaking');
    }
  }

  function clearSpeaking() {
    for (var fullName in cards) {
      if (cards.hasOwnProperty(fullName)) {
        cards[fullName].card.classList.remove('speaking');
      }
    }
  }

  function getPersonaData(name) {
    var fullName = resolveCommitteeName(name);
    if (!fullName) return null;
    return COMMITTEE[fullName];
  }


  return {
    init: init,
    summon: summon,
    release: release,
    setSpeaking: setSpeaking,
    clearSpeaking: clearSpeaking,
    getPersonaData: getPersonaData,
    COMMITTEE: COMMITTEE
  };

})();
