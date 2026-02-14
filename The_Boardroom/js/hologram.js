/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Boardroom: Abstract Sigil Council Gallery
   Each council seat is represented by a geometric sigil in
   their persona color, rendered as inline SVG.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Hologram = (function () {

  var COMMITTEE = {
    'Steve Jobs': {
      role: 'The Chair',
      color: '#c0392b',
      sigil: 'blade'
    },
    'Warren Buffett': {
      role: 'The CFO',
      color: '#2c6e49',
      sigil: 'scales'
    },
    'Henry Ford': {
      role: 'The COO',
      color: '#5d4e37',
      sigil: 'gear'
    },
    'Andrew Carnegie': {
      role: 'The Scale',
      color: '#708090',
      sigil: 'pillar'
    },
    'Thomas Edison': {
      role: 'The CTO',
      color: '#d4a030',
      sigil: 'spark'
    },
    'Walt Disney': {
      role: 'The CMO',
      color: '#4a6fa5',
      sigil: 'star'
    },
    'Theodore Roosevelt': {
      role: 'The Counsel',
      color: '#8b4513',
      sigil: 'shield'
    },
    'Abraham Lincoln': {
      role: 'The Conscience',
      color: '#2f4f4f',
      sigil: 'column'
    }
  };

  var SIGILS = {

    blade: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="60" y1="10" x2="60" y2="95" stroke="' + color + '" stroke-width="2" opacity="0.8"/>' +
        '<polygon points="60,10 52,35 60,30 68,35" fill="' + color + '" opacity="0.9"/>' +
        '<line x1="40" y1="90" x2="80" y2="90" stroke="' + color + '" stroke-width="2.5" opacity="0.7"/>' +
        '<line x1="50" y1="90" x2="50" y2="105" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<line x1="70" y1="90" x2="70" y2="105" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<line x1="45" y1="105" x2="75" y2="105" stroke="' + color + '" stroke-width="1" opacity="0.4"/>' +
        '<line x1="55" y1="30" x2="55" y2="85" stroke="' + color + '" stroke-width="0.5" opacity="0.2"/>' +
        '<line x1="65" y1="30" x2="65" y2="85" stroke="' + color + '" stroke-width="0.5" opacity="0.2"/>' +
        '</svg>';
    },

    scales: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="60" y1="15" x2="60" y2="100" stroke="' + color + '" stroke-width="2" opacity="0.7"/>' +
        '<line x1="25" y1="40" x2="95" y2="40" stroke="' + color + '" stroke-width="1.5" opacity="0.6"/>' +
        '<path d="M25,40 Q25,65 40,65 Q55,65 55,40" fill="none" stroke="' + color + '" stroke-width="1.2" opacity="0.5"/>' +
        '<path d="M65,40 Q65,65 80,65 Q95,65 95,40" fill="none" stroke="' + color + '" stroke-width="1.2" opacity="0.5"/>' +
        '<circle cx="60" cy="15" r="5" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.6"/>' +
        '<circle cx="60" cy="15" r="2" fill="' + color + '" opacity="0.8"/>' +
        '<line x1="50" y1="100" x2="70" y2="100" stroke="' + color + '" stroke-width="2" opacity="0.5"/>' +
        '<line x1="45" y1="105" x2="75" y2="105" stroke="' + color + '" stroke-width="1" opacity="0.3"/>' +
        '</svg>';
    },

    gear: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="30" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<circle cx="60" cy="60" r="18" fill="none" stroke="' + color + '" stroke-width="1" opacity="0.35"/>' +
        '<circle cx="60" cy="60" r="5" fill="' + color + '" opacity="0.6"/>' +
        '<line x1="60" y1="15" x2="60" y2="30" stroke="' + color + '" stroke-width="3" opacity="0.6"/>' +
        '<line x1="60" y1="90" x2="60" y2="105" stroke="' + color + '" stroke-width="3" opacity="0.6"/>' +
        '<line x1="15" y1="60" x2="30" y2="60" stroke="' + color + '" stroke-width="3" opacity="0.6"/>' +
        '<line x1="90" y1="60" x2="105" y2="60" stroke="' + color + '" stroke-width="3" opacity="0.6"/>' +
        '<line x1="28" y1="28" x2="39" y2="39" stroke="' + color + '" stroke-width="2.5" opacity="0.5"/>' +
        '<line x1="81" y1="81" x2="92" y2="92" stroke="' + color + '" stroke-width="2.5" opacity="0.5"/>' +
        '<line x1="92" y1="28" x2="81" y2="39" stroke="' + color + '" stroke-width="2.5" opacity="0.5"/>' +
        '<line x1="28" y1="92" x2="39" y2="81" stroke="' + color + '" stroke-width="2.5" opacity="0.5"/>' +
        '</svg>';
    },

    pillar: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="40" y="25" width="40" height="75" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<line x1="50" y1="25" x2="50" y2="100" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<line x1="60" y1="25" x2="60" y2="100" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<line x1="70" y1="25" x2="70" y2="100" stroke="' + color + '" stroke-width="0.8" opacity="0.25"/>' +
        '<line x1="35" y1="20" x2="85" y2="20" stroke="' + color + '" stroke-width="2" opacity="0.6"/>' +
        '<line x1="32" y1="25" x2="88" y2="25" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<line x1="35" y1="100" x2="85" y2="100" stroke="' + color + '" stroke-width="2" opacity="0.6"/>' +
        '<line x1="32" y1="105" x2="88" y2="105" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<path d="M40,25 Q60,15 80,25" fill="none" stroke="' + color + '" stroke-width="1" opacity="0.35"/>' +
        '</svg>';
    },

    spark: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M65,15 L45,55 L58,55 L40,105" fill="none" stroke="' + color + '" stroke-width="2.5" opacity="0.8" stroke-linejoin="round"/>' +
        '<circle cx="65" cy="15" r="3" fill="' + color + '" opacity="0.9"/>' +
        '<circle cx="40" cy="105" r="2" fill="' + color + '" opacity="0.6"/>' +
        '<line x1="70" y1="30" x2="85" y2="25" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '<line x1="35" y1="75" x2="20" y2="80" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '<circle cx="52" cy="60" r="8" fill="none" stroke="' + color + '" stroke-width="0.6" opacity="0.2"/>' +
        '<circle cx="52" cy="60" r="15" fill="none" stroke="' + color + '" stroke-width="0.4" opacity="0.1"/>' +
        '</svg>';
    },

    star: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<polygon points="60,15 68,45 100,45 74,63 82,95 60,77 38,95 46,63 20,45 52,45" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.6"/>' +
        '<polygon points="60,30 65,48 85,48 69,59 75,80 60,68 45,80 51,59 35,48 55,48" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '<circle cx="60" cy="55" r="4" fill="' + color + '" opacity="0.7"/>' +
        '<circle cx="60" cy="55" r="8" fill="none" stroke="' + color + '" stroke-width="0.5" opacity="0.2"/>' +
        '</svg>';
    },

    shield: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M60,15 L90,30 L90,70 Q90,95 60,110 Q30,95 30,70 L30,30 Z" fill="none" stroke="' + color + '" stroke-width="1.8" opacity="0.6"/>' +
        '<path d="M60,25 L82,37 L82,68 Q82,88 60,100 Q38,88 38,68 L38,37 Z" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '<line x1="60" y1="25" x2="60" y2="100" stroke="' + color + '" stroke-width="0.8" opacity="0.2"/>' +
        '<line x1="38" y1="55" x2="82" y2="55" stroke="' + color + '" stroke-width="0.8" opacity="0.2"/>' +
        '<circle cx="60" cy="55" r="5" fill="' + color + '" opacity="0.5"/>' +
        '</svg>';
    },

    column: function (color) {
      return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="45" y="20" width="30" height="80" fill="none" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<line x1="55" y1="20" x2="55" y2="100" stroke="' + color + '" stroke-width="0.6" opacity="0.2"/>' +
        '<line x1="65" y1="20" x2="65" y2="100" stroke="' + color + '" stroke-width="0.6" opacity="0.2"/>' +
        '<line x1="38" y1="15" x2="82" y2="15" stroke="' + color + '" stroke-width="2" opacity="0.6"/>' +
        '<line x1="35" y1="20" x2="85" y2="20" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<line x1="38" y1="100" x2="82" y2="100" stroke="' + color + '" stroke-width="2" opacity="0.6"/>' +
        '<line x1="35" y1="105" x2="85" y2="105" stroke="' + color + '" stroke-width="1.5" opacity="0.5"/>' +
        '<circle cx="60" cy="60" r="8" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.3"/>' +
        '<circle cx="60" cy="60" r="3" fill="' + color + '" opacity="0.5"/>' +
        '</svg>';
    }
  };

  var container = null;
  var galleryEl = null;
  var cards = {};
  var isInitialized = false;

  function resolveCommitteeName(input) {
    if (!input) return null;
    var needle = input.trim().toLowerCase();

    for (var fullName in COMMITTEE) {
      if (COMMITTEE.hasOwnProperty(fullName)) {
        if (fullName.toLowerCase() === needle) return fullName;
      }
    }

    var aliases = {
      'jobs': 'Steve Jobs',
      'steve': 'Steve Jobs',
      'chair': 'Steve Jobs',
      'buffett': 'Warren Buffett',
      'warren': 'Warren Buffett',
      'cfo': 'Warren Buffett',
      'ford': 'Henry Ford',
      'henry': 'Henry Ford',
      'coo': 'Henry Ford',
      'carnegie': 'Andrew Carnegie',
      'andrew': 'Andrew Carnegie',
      'scale': 'Andrew Carnegie',
      'edison': 'Thomas Edison',
      'thomas': 'Thomas Edison',
      'cto': 'Thomas Edison',
      'disney': 'Walt Disney',
      'walt': 'Walt Disney',
      'cmo': 'Walt Disney',
      'roosevelt': 'Theodore Roosevelt',
      'teddy': 'Theodore Roosevelt',
      'counsel': 'Theodore Roosevelt',
      'lincoln': 'Abraham Lincoln',
      'abe': 'Abraham Lincoln',
      'conscience': 'Abraham Lincoln'
    };

    for (var alias in aliases) {
      if (aliases.hasOwnProperty(alias)) {
        if (needle.indexOf(alias) !== -1) return aliases[alias];
      }
    }

    return null;
  }

  function createPersonaCard(fullName) {
    var persona = COMMITTEE[fullName];
    var color = persona.color;

    var card = document.createElement('div');
    card.className = 'patriot-card idle';
    card.setAttribute('data-patriot', fullName);
    card.style.setProperty('--patriot-color', color);

    var frame = document.createElement('div');
    frame.className = 'patriot-frame';

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
