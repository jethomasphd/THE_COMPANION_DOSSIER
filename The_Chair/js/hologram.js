/* ═══════════════════════════════════════════════════════════════
   COMPANION — The Chair: The Committee of Patriots
   Museum-Quality Photorealistic Portrait Gallery
   Portraits sourced from Wikipedia at high resolution.
   No canvas processing — pure photographic rendering with
   CSS-driven film grain, varnish glaze, and warm color grading.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Hologram = (function () {

  // ── The Four Patriots ──

  var PATRIOTS = {
    'George Washington': {
      title: 'Gen.',
      role: 'Presiding',
      article: 'George_Washington',
      color: '#c9a54e'
    },
    'Alexander Hamilton': {
      title: 'Col.',
      role: 'Treasury',
      article: 'Alexander_Hamilton',
      color: '#4a90d9'
    },
    'Thomas Jefferson': {
      title: 'Mr.',
      role: 'Liberty',
      article: 'Thomas_Jefferson',
      color: '#c94e4e'
    },
    'Benjamin Franklin': {
      title: 'Dr.',
      role: 'Wisdom',
      article: 'Benjamin_Franklin',
      color: '#d4b85c'
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

  function resolvePatriotName(input) {
    if (!input) return null;
    var needle = input.trim().toLowerCase();

    for (var fullName in PATRIOTS) {
      if (PATRIOTS.hasOwnProperty(fullName)) {
        if (fullName.toLowerCase() === needle) return fullName;
      }
    }

    for (var fullName2 in PATRIOTS) {
      if (PATRIOTS.hasOwnProperty(fullName2)) {
        var parts = fullName2.split(' ');
        var lastName = parts[parts.length - 1].toLowerCase();
        if (needle === lastName || needle.indexOf(lastName) !== -1 || lastName.indexOf(needle) !== -1) {
          return fullName2;
        }
      }
    }

    for (var fullName3 in PATRIOTS) {
      if (PATRIOTS.hasOwnProperty(fullName3)) {
        if (fullName3.toLowerCase().indexOf(needle) !== -1) {
          return fullName3;
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
  //  DOM — Patriot Card Creation (Photorealistic)
  // ═══════════════════════════════════════════════════════════════

  function formatNameplate(fullName) {
    var patriot = PATRIOTS[fullName];
    if (!patriot) return fullName.toUpperCase();
    var parts = fullName.split(' ');
    var lastName = parts[parts.length - 1].toUpperCase();
    return patriot.title + ' ' + lastName;
  }

  /**
   * Creates the full DOM subtree for a single patriot card.
   * Photorealistic: single <img> with CSS color grading.
   *
   * Structure:
   *   .patriot-card[data-patriot="George Washington"]
   *     .patriot-frame
   *       img.patriot-portrait
   *     .patriot-nameplate
   *     .patriot-glow
   */
  function createPatriotCard(fullName) {
    var patriot = PATRIOTS[fullName];
    var color = patriot.color;

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

  function loadPatriotPortrait(fullName) {
    var patriot = PATRIOTS[fullName];
    var cardData = cards[fullName];
    if (!patriot || !cardData) return;

    fetchPortraitUrl(patriot.article)
      .then(function (imageUrl) {
        if (!imageUrl) throw new Error('No image URL for ' + fullName);

        // Direct image load — no canvas, photorealistic
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
        // Frame stays with no portrait — CSS handles the fallback appearance
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

    var patriotNames = Object.keys(PATRIOTS);
    for (var i = 0; i < patriotNames.length; i++) {
      var fullName = patriotNames[i];
      var cardData = createPatriotCard(fullName);
      cards[fullName] = cardData;
      galleryEl.appendChild(cardData.card);

      // Begin loading portrait immediately
      loadPatriotPortrait(fullName);
    }

    isInitialized = true;
  }

  function summon(name) {
    if (!isInitialized) return;

    var fullName = resolvePatriotName(name);
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

    var fullName = resolvePatriotName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    card.classList.remove('active', 'speaking', 'arriving');
    card.classList.add('idle');
  }

  function setSpeaking(name, isSpeaking) {
    if (!isInitialized) return;

    var fullName = resolvePatriotName(name);
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

  function getPatriotData(name) {
    var fullName = resolvePatriotName(name);
    if (!fullName) return null;
    return PATRIOTS[fullName];
  }


  return {
    init: init,
    summon: summon,
    release: release,
    setSpeaking: setSpeaking,
    clearSpeaking: clearSpeaking,
    getPatriotData: getPatriotData,
    PATRIOTS: PATRIOTS
  };

})();
