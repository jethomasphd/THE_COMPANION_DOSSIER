/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Five Lamps: The Medical Ethics Council
   Museum-Quality Photorealistic Portrait Gallery
   Portraits sourced from Wikipedia at high resolution.
   No canvas processing — pure photographic rendering with
   CSS-driven film grain, varnish glaze, and warm color grading.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Hologram = (function () {

  // ── The Five Lamps ──

  var LAMPS = {
    'Hippocrates': {
      title: '',
      role: 'The Oath',
      article: 'Hippocrates',
      color: '#e8dcc8'
    },
    'John Snow': {
      title: 'Dr.',
      role: 'The Map',
      article: 'John_Snow',
      color: '#4a8eb8'
    },
    'Michael Marmot': {
      title: 'Sir',
      role: 'The Gradient',
      article: 'Michael_Marmot',
      color: '#5a9a6a'
    },
    'Carl Jung': {
      title: 'Dr.',
      role: 'The Shadow',
      article: 'Carl_Jung',
      color: '#9b5a8a'
    },
    'Paul Farmer': {
      title: 'Dr.',
      role: 'The Fight',
      article: 'Paul_Farmer',
      color: '#c9a227'
    }
  };


  // ── Internal State ──

  var container = null;
  var galleryEl = null;
  var cards = {};
  var isInitialized = false;


  // ═══════════════════════════════════════════════════════════════
  //  Name Matching — fuzzy on last name
  // ═══════════════════════════════════════════════════════════════

  function resolveLampName(input) {
    if (!input) return null;
    var needle = input.trim().toLowerCase();

    for (var fullName in LAMPS) {
      if (LAMPS.hasOwnProperty(fullName)) {
        if (fullName.toLowerCase() === needle) return fullName;
      }
    }

    for (var fullName2 in LAMPS) {
      if (LAMPS.hasOwnProperty(fullName2)) {
        var parts = fullName2.split(' ');
        var lastName = parts[parts.length - 1].toLowerCase();
        if (needle === lastName || needle.indexOf(lastName) !== -1 || lastName.indexOf(needle) !== -1) {
          return fullName2;
        }
      }
    }

    for (var fullName3 in LAMPS) {
      if (LAMPS.hasOwnProperty(fullName3)) {
        if (fullName3.toLowerCase().indexOf(needle) !== -1) {
          return fullName3;
        }
      }
    }

    return null;
  }


  // ═══════════════════════════════════════════════════════════════
  //  DOM — Lamp Card Creation (Photorealistic)
  // ═══════════════════════════════════════════════════════════════

  function formatNameplate(fullName) {
    var lamp = LAMPS[fullName];
    if (!lamp) return fullName.toUpperCase();
    var parts = fullName.split(' ');
    var lastName = parts[parts.length - 1].toUpperCase();
    var prefix = lamp.title ? lamp.title + ' ' : '';
    return prefix + lastName;
  }

  /**
   * Creates the full DOM subtree for a single lamp card.
   * Photorealistic: single <img> with CSS color grading.
   *
   * Structure:
   *   .patriot-card[data-patriot="Hippocrates"]
   *     .patriot-frame
   *       img.patriot-portrait
   *     .patriot-nameplate
   *     .patriot-glow
   */
  function createLampCard(fullName) {
    var lamp = LAMPS[fullName];
    var color = lamp.color;

    var card = document.createElement('div');
    card.className = 'patriot-card idle';
    card.setAttribute('data-patriot', fullName);
    card.style.setProperty('--patriot-color', color);

    var frame = document.createElement('div');
    frame.className = 'patriot-frame';

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
      nameplate: nameplate,
      glow: glow
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  Portrait Loading — Direct photorealistic (no canvas processing)
  // ═══════════════════════════════════════════════════════════════

  function loadLampPortrait(fullName) {
    var lamp = LAMPS[fullName];
    var cardData = cards[fullName];
    if (!lamp || !cardData) return;

    cardData.portraitImg.onload = function () {
      cardData.frame.classList.add('loaded');
    };
    cardData.portraitImg.src = '../The_Pantheon/' + lamp.article + '.jpg';
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

    var lampNames = Object.keys(LAMPS);
    for (var i = 0; i < lampNames.length; i++) {
      var fullName = lampNames[i];
      var cardData = createLampCard(fullName);
      cards[fullName] = cardData;
      galleryEl.appendChild(cardData.card);

      // Begin loading portrait immediately
      loadLampPortrait(fullName);
    }

    isInitialized = true;
  }

  function summon(name) {
    if (!isInitialized) return;

    var fullName = resolveLampName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    card.classList.remove('idle');
    card.classList.add('arriving');

    // After arrival animation completes, switch to active
    setTimeout(function () {
      card.classList.remove('arriving');
      card.classList.add('active');
    }, 1200);
  }

  function release(name) {
    if (!isInitialized) return;

    var fullName = resolveLampName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    card.classList.remove('active', 'speaking', 'arriving');
    card.classList.add('idle');
  }

  function setSpeaking(name, isSpeaking) {
    if (!isInitialized) return;

    var fullName = resolveLampName(name);
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

  function getLampData(name) {
    var fullName = resolveLampName(name);
    if (!fullName) return null;
    return LAMPS[fullName];
  }


  return {
    init: init,
    summon: summon,
    release: release,
    setSpeaking: setSpeaking,
    clearSpeaking: clearSpeaking,
    getLampData: getLampData,
    LAMPS: LAMPS
  };

})();
