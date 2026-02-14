/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Boardroom: Museum-Quality Portrait Gallery
   Portraits sourced from Wikipedia at high resolution.
   No canvas processing — pure photographic rendering with
   CSS-driven film grain, varnish glaze, and warm color grading.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Hologram = (function () {

  // ── The Eight Seats ──

  var COMMITTEE = {
    'Steve Jobs': {
      role: 'The Chair',
      article: 'Steve_Jobs',
      color: '#c0392b'
    },
    'Warren Buffett': {
      role: 'The CFO',
      article: 'Warren_Buffett',
      color: '#2c6e49'
    },
    'Henry Ford': {
      role: 'The COO',
      article: 'Henry_Ford',
      color: '#5d4e37'
    },
    'Andrew Carnegie': {
      role: 'The Scale',
      article: 'Andrew_Carnegie',
      color: '#708090'
    },
    'Thomas Edison': {
      role: 'The CTO',
      article: 'Thomas_Edison',
      color: '#d4a030'
    },
    'Walt Disney': {
      role: 'The CMO',
      article: 'Walt_Disney',
      color: '#4a6fa5'
    },
    'Theodore Roosevelt': {
      role: 'The Counsel',
      article: 'Theodore_Roosevelt',
      color: '#8b4513'
    },
    'Abraham Lincoln': {
      role: 'The Conscience',
      article: 'Abraham_Lincoln',
      color: '#2f4f4f'
    }
  };


  // ── Internal State ──

  var container = null;
  var galleryEl = null;
  var cards = {};
  var isInitialized = false;


  // ═══════════════════════════════════════════════════════════════
  //  Name Matching — fuzzy on last name + aliases
  // ═══════════════════════════════════════════════════════════════

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

    // Fallback: partial match on full name
    for (var fullName2 in COMMITTEE) {
      if (COMMITTEE.hasOwnProperty(fullName2)) {
        if (fullName2.toLowerCase().indexOf(needle) !== -1) {
          return fullName2;
        }
      }
    }

    return null;
  }


  // ═══════════════════════════════════════════════════════════════
  //  Wikipedia Portrait Fetching — High Resolution
  // ═══════════════════════════════════════════════════════════════

  function fetchPortraitUrl(article) {
    var url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(article);

    return fetch(url)
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .then(function (data) {
        if (!data) return null;

        // Prefer original image for highest quality
        var src = null;
        if (data.originalimage && data.originalimage.source) {
          src = data.originalimage.source;
        } else if (data.thumbnail && data.thumbnail.source) {
          src = data.thumbnail.source;
        }

        if (src) {
          // Request 600px wide for high-quality photorealistic display
          src = src.replace(/\/\d+px-/, '/600px-');
        }
        return src;
      })
      .catch(function () {
        return null;
      });
  }


  // ═══════════════════════════════════════════════════════════════
  //  DOM — Persona Card Creation (Photorealistic)
  // ═══════════════════════════════════════════════════════════════

  function formatNameplate(fullName) {
    var parts = fullName.split(' ');
    var lastName = parts[parts.length - 1].toUpperCase();
    return lastName;
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
  //  Portrait Loading — Direct photorealistic (no canvas)
  // ═══════════════════════════════════════════════════════════════

  function loadPortrait(fullName) {
    var persona = COMMITTEE[fullName];
    var cardData = cards[fullName];
    if (!persona || !cardData) return;

    fetchPortraitUrl(persona.article)
      .then(function (imageUrl) {
        if (!imageUrl) throw new Error('No image URL for ' + fullName);

        cardData.portraitImg.onload = function () {
          cardData.frame.classList.add('loaded');
        };
        cardData.portraitImg.onerror = function () {
          // Try without CORS
          var img2 = new Image();
          img2.className = 'patriot-portrait';
          img2.alt = fullName + ' portrait';
          img2.draggable = false;
          img2.onload = function () {
            cardData.frame.classList.add('loaded');
          };
          img2.src = imageUrl;
          cardData.frame.replaceChild(img2, cardData.portraitImg);
          cardData.portraitImg = img2;
        };
        cardData.portraitImg.crossOrigin = 'anonymous';
        cardData.portraitImg.src = imageUrl;
      })
      .catch(function (err) {
        console.warn('[Hologram] Portrait unavailable for ' + fullName + ':', err.message || err);
      });
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

    var names = Object.keys(COMMITTEE);
    for (var i = 0; i < names.length; i++) {
      var fullName = names[i];
      var cardData = createPersonaCard(fullName);
      cards[fullName] = cardData;
      galleryEl.appendChild(cardData.card);

      // Begin loading portrait immediately
      loadPortrait(fullName);
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
