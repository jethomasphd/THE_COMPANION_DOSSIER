/* ═══════════════════════════════════════════════════════════════
   THE AERODROME — Portrait Gallery
   Two brothers, rendered as museum-quality photographic plates.
   Portraits sourced from The Pantheon (Wikimedia, public domain).
   Falls back to engraved initials if a plate cannot be loaded.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Hologram = (function () {

  // ── The Two Seats ──

  var BROTHERS = {
    'Wilbur Wright': {
      role: 'The Elder',
      article: 'Wilbur_Wright',
      initials: 'W',
      color: '#8FB0C4'
    },
    'Orville Wright': {
      role: 'The Younger',
      article: 'Orville_Wright',
      rev: '2',
      initials: 'O',
      color: '#D89A52'
    }
  };


  // ── Internal State ──

  var container = null;
  var galleryEl = null;
  var cards = {};
  var isInitialized = false;


  // ═══════════════════════════════════════════════════════════════
  //  Name Matching — fuzzy on first name + aliases
  // ═══════════════════════════════════════════════════════════════

  function resolveBrotherName(input) {
    if (!input) return null;
    var needle = input.trim().toLowerCase();

    for (var fullName in BROTHERS) {
      if (BROTHERS.hasOwnProperty(fullName)) {
        if (fullName.toLowerCase() === needle) return fullName;
      }
    }

    var aliases = {
      'wilbur': 'Wilbur Wright',
      'wilbur wright': 'Wilbur Wright',
      'will': 'Wilbur Wright',
      'the elder': 'Wilbur Wright',
      'orville': 'Orville Wright',
      'orville wright': 'Orville Wright',
      'orv': 'Orville Wright',
      'the younger': 'Orville Wright'
    };

    for (var alias in aliases) {
      if (aliases.hasOwnProperty(alias)) {
        if (needle.indexOf(alias) !== -1) return aliases[alias];
      }
    }

    // Fallback: partial match on full name
    for (var fullName2 in BROTHERS) {
      if (BROTHERS.hasOwnProperty(fullName2)) {
        if (fullName2.toLowerCase().indexOf(needle) !== -1) {
          return fullName2;
        }
      }
    }

    return null;
  }


  // ═══════════════════════════════════════════════════════════════
  //  DOM — Persona Card Creation (Photorealistic)
  // ═══════════════════════════════════════════════════════════════

  function formatNameplate(fullName) {
    // Both share the surname Wright — the first name is the identity here.
    return fullName.split(' ')[0].toUpperCase();
  }

  function createPersonaCard(fullName) {
    var persona = BROTHERS[fullName];
    var color = persona.color;

    var card = document.createElement('div');
    card.className = 'patriot-card idle';
    card.setAttribute('data-patriot', fullName);
    card.style.setProperty('--patriot-color', color);

    var frame = document.createElement('div');
    frame.className = 'patriot-frame';

    // Engraved-initials fallback, always present beneath the plate.
    var initials = document.createElement('div');
    initials.className = 'patriot-initials';
    initials.textContent = persona.initials;
    initials.style.color = color;
    frame.appendChild(initials);

    var portraitImg = document.createElement('img');
    portraitImg.className = 'patriot-portrait';
    portraitImg.alt = fullName + ' portrait';
    portraitImg.draggable = false;
    frame.appendChild(portraitImg);

    var nameplate = document.createElement('div');
    nameplate.className = 'patriot-nameplate';
    nameplate.textContent = formatNameplate(fullName);

    var glow = document.createElement('div');
    glow.className = 'patriot-glow';

    card.appendChild(frame);
    card.appendChild(nameplate);
    card.appendChild(glow);

    return {
      card: card,
      frame: frame,
      portraitImg: portraitImg,
      initials: initials,
      nameplate: nameplate,
      glow: glow
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  Portrait Loading — Direct photorealistic (no canvas)
  // ═══════════════════════════════════════════════════════════════

  function loadPortrait(fullName) {
    var persona = BROTHERS[fullName];
    var cardData = cards[fullName];
    if (!persona || !cardData) return;

    cardData.portraitImg.onload = function () {
      cardData.frame.classList.add('loaded');
    };
    cardData.portraitImg.onerror = function () {
      // Keep the engraved initials; hide the broken plate.
      cardData.portraitImg.style.display = 'none';
    };
    cardData.portraitImg.src = '../The_Pantheon/' + persona.article + '.jpg' + (persona.rev ? '?v=' + persona.rev : '');
  }


  // ═══════════════════════════════════════════════════════════════
  //  Public API
  // ═══════════════════════════════════════════════════════════════

  function init(containerElement) {
    if (isInitialized) return;

    container = containerElement;
    if (!container) {
      console.warn('[Hologram] init: no container element provided.');
      return;
    }

    galleryEl = document.createElement('div');
    galleryEl.className = 'portrait-gallery';
    container.appendChild(galleryEl);

    var names = Object.keys(BROTHERS);
    for (var i = 0; i < names.length; i++) {
      var fullName = names[i];
      var cardData = createPersonaCard(fullName);
      cards[fullName] = cardData;
      galleryEl.appendChild(cardData.card);

      loadPortrait(fullName);
    }

    isInitialized = true;
  }

  function summon(name) {
    if (!isInitialized) return;

    var fullName = resolveBrotherName(name);
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

    var fullName = resolveBrotherName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    card.classList.remove('active', 'speaking', 'arriving');
    card.classList.add('idle');
  }

  function setSpeaking(name, isSpeaking) {
    if (!isInitialized) return;

    var fullName = resolveBrotherName(name);
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
    var fullName = resolveBrotherName(name);
    if (!fullName) return null;
    return BROTHERS[fullName];
  }

  return {
    init: init,
    summon: summon,
    release: release,
    setSpeaking: setSpeaking,
    clearSpeaking: clearSpeaking,
    getPersonaData: getPersonaData,
    BROTHERS: BROTHERS
  };

})();
