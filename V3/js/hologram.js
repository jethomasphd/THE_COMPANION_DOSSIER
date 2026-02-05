/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — The Committee of Patriots
   Four-patriot portrait gallery with colonial engraving effect.
   Portraits sourced from Wikipedia, processed through canvas
   with sepia tint and Sobel edge-detection etching overlay.
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
  var cards = {};          // fullName -> { card, frame, portraitImg, etchingImg, nameplate, glow }
  var isInitialized = false;

  // ── Constants ──

  var PORTRAIT_W = 400;
  var PORTRAIT_H = 560;    // 5:7 ratio


  // ═══════════════════════════════════════════════════════════════
  //  Utility — hex color to {r,g,b}
  // ═══════════════════════════════════════════════════════════════

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 201, g: 165, b: 78 };
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  Name Matching — fuzzy on last name
  // ═══════════════════════════════════════════════════════════════

  function resolvePatriotName(input) {
    if (!input) return null;
    var needle = input.trim().toLowerCase();

    // Exact full-name match first
    for (var fullName in PATRIOTS) {
      if (PATRIOTS.hasOwnProperty(fullName)) {
        if (fullName.toLowerCase() === needle) return fullName;
      }
    }

    // Last-name match
    for (var fullName2 in PATRIOTS) {
      if (PATRIOTS.hasOwnProperty(fullName2)) {
        var parts = fullName2.split(' ');
        var lastName = parts[parts.length - 1].toLowerCase();
        if (needle === lastName || needle.indexOf(lastName) !== -1 || lastName.indexOf(needle) !== -1) {
          return fullName2;
        }
      }
    }

    // Partial match anywhere in full name
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
  //  Wikipedia Portrait Fetching
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
        var src = null;
        if (data.thumbnail && data.thumbnail.source) {
          src = data.thumbnail.source;
        } else if (data.originalimage && data.originalimage.source) {
          src = data.originalimage.source;
        }
        if (src) {
          // Upscale to 400px width for quality
          src = src.replace(/\/\d+px-/, '/400px-');
        }
        return src;
      })
      .catch(function () {
        return null;
      });
  }


  // ═══════════════════════════════════════════════════════════════
  //  Image Loading
  // ═══════════════════════════════════════════════════════════════

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () { resolve(img); };
      img.onerror = function () {
        // Retry without CORS header — canvas may be tainted but
        // we handle that gracefully in processImage
        var img2 = new Image();
        img2.onload = function () { resolve(img2); };
        img2.onerror = function () { reject(new Error('Image load failed: ' + url)); };
        img2.src = url;
      };
      img.src = url;
    });
  }


  // ═══════════════════════════════════════════════════════════════
  //  Image Processing — Sepia Tint + Sobel Etching
  // ═══════════════════════════════════════════════════════════════

  /**
   * Grayscale luminance at pixel (x, y) from raw ImageData buffer.
   * Clamps to image bounds.
   */
  function grayAt(data, w, h, x, y) {
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= w) x = w - 1;
    if (y >= h) y = h - 1;
    var idx = (y * w + x) * 4;
    return 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  /**
   * Process a loaded image into two layers:
   *   1. Sepia/parchment-tinted portrait  (baseDataUrl)
   *   2. Sobel edge-detection etching      (edgeDataUrl)
   *
   * Returns { baseDataUrl, edgeDataUrl } or null on tainted canvas.
   */
  function processImage(img) {
    // ── Draw source to canvas at portrait dimensions ──
    var srcCanvas = document.createElement('canvas');
    srcCanvas.width = PORTRAIT_W;
    srcCanvas.height = PORTRAIT_H;
    var srcCtx = srcCanvas.getContext('2d');

    // Fill black, then draw image centered & scaled to cover
    srcCtx.fillStyle = '#000';
    srcCtx.fillRect(0, 0, PORTRAIT_W, PORTRAIT_H);

    var scale = Math.max(PORTRAIT_W / img.width, PORTRAIT_H / img.height);
    var drawW = img.width * scale;
    var drawH = img.height * scale;
    var offsetX = (PORTRAIT_W - drawW) / 2;
    var offsetY = (PORTRAIT_H - drawH) / 2;
    srcCtx.drawImage(img, offsetX, offsetY, drawW, drawH);

    var imageData;
    try {
      imageData = srcCtx.getImageData(0, 0, PORTRAIT_W, PORTRAIT_H);
    } catch (e) {
      return null; // tainted canvas
    }
    var srcData = imageData.data;
    var w = PORTRAIT_W;
    var h = PORTRAIT_H;

    // ── Layer 1: Sepia / parchment tint ──
    // Desaturate to grayscale then blend with warm tone rgba(201,165,78,0.15)
    var baseCanvas = document.createElement('canvas');
    baseCanvas.width = w;
    baseCanvas.height = h;
    var baseCtx = baseCanvas.getContext('2d');
    var baseImageData = baseCtx.createImageData(w, h);
    var baseData = baseImageData.data;

    var tintR = 201, tintG = 165, tintB = 78;
    var tintAlpha = 0.15;
    var baseAlpha = 1.0 - tintAlpha;

    var i, gray, r, g, b;
    for (i = 0; i < srcData.length; i += 4) {
      gray = 0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2];
      // Blend desaturated gray with warm parchment tint
      r = gray * baseAlpha + tintR * tintAlpha;
      g = gray * baseAlpha + tintG * tintAlpha;
      b = gray * baseAlpha + tintB * tintAlpha;
      baseData[i]     = Math.min(255, Math.round(r));
      baseData[i + 1] = Math.min(255, Math.round(g));
      baseData[i + 2] = Math.min(255, Math.round(b));
      baseData[i + 3] = 200; // medium opacity for the base layer
    }

    baseCtx.putImageData(baseImageData, 0, 0);

    // ── Layer 2: Sobel edge detection — etching / woodcut lines ──
    var edgeCanvas = document.createElement('canvas');
    edgeCanvas.width = w;
    edgeCanvas.height = h;
    var edgeCtx = edgeCanvas.getContext('2d');
    var edgeImageData = edgeCtx.createImageData(w, h);
    var edgeData = edgeImageData.data;

    var x, y, gx, gy, mag, idx;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        // Sobel Gx kernel: [-1 0 1; -2 0 2; -1 0 1]
        gx = -grayAt(srcData, w, h, x - 1, y - 1)
             + grayAt(srcData, w, h, x + 1, y - 1)
             - 2 * grayAt(srcData, w, h, x - 1, y)
             + 2 * grayAt(srcData, w, h, x + 1, y)
             - grayAt(srcData, w, h, x - 1, y + 1)
             + grayAt(srcData, w, h, x + 1, y + 1);

        // Sobel Gy kernel: [-1 -2 -1; 0 0 0; 1 2 1]
        gy = -grayAt(srcData, w, h, x - 1, y - 1)
             - 2 * grayAt(srcData, w, h, x, y - 1)
             - grayAt(srcData, w, h, x + 1, y - 1)
             + grayAt(srcData, w, h, x - 1, y + 1)
             + 2 * grayAt(srcData, w, h, x, y + 1)
             + grayAt(srcData, w, h, x + 1, y + 1);

        mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));

        idx = (y * w + x) * 4;
        // Dark lines on light background for engraving effect — multiply blend
        // Store edge as dark values (inverted) so mix-blend-mode:multiply darkens the base
        edgeData[idx]     = 255 - mag;
        edgeData[idx + 1] = 255 - mag;
        edgeData[idx + 2] = 255 - mag;
        edgeData[idx + 3] = mag > 15 ? 255 : 0;
      }
    }

    edgeCtx.putImageData(edgeImageData, 0, 0);

    return {
      baseDataUrl: baseCanvas.toDataURL(),
      edgeDataUrl: edgeCanvas.toDataURL()
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  Fallback — Stylized initial when Wikipedia image is unavailable
  // ═══════════════════════════════════════════════════════════════

  function createFallbackImage(name, color) {
    var rgb = hexToRgb(color);
    var initial = name ? name.charAt(0).toUpperCase() : '?';
    var w = PORTRAIT_W;
    var h = PORTRAIT_H;

    // Base layer
    var baseCanvas = document.createElement('canvas');
    baseCanvas.width = w;
    baseCanvas.height = h;
    var baseCtx = baseCanvas.getContext('2d');
    baseCtx.fillStyle = '#0a0a08';
    baseCtx.fillRect(0, 0, w, h);

    var fontSize = Math.min(w, h) * 0.45;
    baseCtx.font = fontSize + 'px Georgia, "Times New Roman", serif';
    baseCtx.textAlign = 'center';
    baseCtx.textBaseline = 'middle';
    baseCtx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.35)';
    baseCtx.fillText(initial, w / 2, h / 2);

    var radius = Math.min(w, h) * 0.35;
    baseCtx.beginPath();
    baseCtx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
    baseCtx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.25)';
    baseCtx.lineWidth = 2;
    baseCtx.stroke();

    // Edge layer
    var edgeCanvas = document.createElement('canvas');
    edgeCanvas.width = w;
    edgeCanvas.height = h;
    var edgeCtx = edgeCanvas.getContext('2d');
    edgeCtx.font = fontSize + 'px Georgia, "Times New Roman", serif';
    edgeCtx.textAlign = 'center';
    edgeCtx.textBaseline = 'middle';
    edgeCtx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.5)';
    edgeCtx.lineWidth = 1;
    edgeCtx.strokeText(initial, w / 2, h / 2);

    edgeCtx.beginPath();
    edgeCtx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
    edgeCtx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.4)';
    edgeCtx.lineWidth = 1;
    edgeCtx.stroke();

    return {
      baseDataUrl: baseCanvas.toDataURL(),
      edgeDataUrl: edgeCanvas.toDataURL()
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  DOM — Patriot Card Creation
  // ═══════════════════════════════════════════════════════════════

  /**
   * Extracts the last name from a full patriot name, uppercased.
   * "George Washington" -> "WASHINGTON"
   */
  function formatNameplate(fullName) {
    var patriot = PATRIOTS[fullName];
    if (!patriot) return fullName.toUpperCase();
    var parts = fullName.split(' ');
    var lastName = parts[parts.length - 1].toUpperCase();
    return patriot.title + ' ' + lastName;
  }

  /**
   * Creates the full DOM subtree for a single patriot card.
   *
   * Structure:
   *   .patriot-card[data-patriot="George Washington"]
   *     .patriot-frame
   *       img.patriot-portrait
   *       img.patriot-etching         (mix-blend-mode: multiply)
   *       .patriot-scanlines
   *       .patriot-candlelight
   *     .patriot-nameplate
   *     .patriot-glow
   */
  function createPatriotCard(fullName) {
    var patriot = PATRIOTS[fullName];
    var color = patriot.color;
    var rgb = hexToRgb(color);

    // ── Card wrapper ──
    var card = document.createElement('div');
    card.className = 'patriot-card idle';
    card.setAttribute('data-patriot', fullName);
    card.style.setProperty('--patriot-color', color);
    card.style.setProperty('--patriot-r', String(rgb.r));
    card.style.setProperty('--patriot-g', String(rgb.g));
    card.style.setProperty('--patriot-b', String(rgb.b));

    // ── Frame ──
    var frame = document.createElement('div');
    frame.className = 'patriot-frame';

    var portraitImg = document.createElement('img');
    portraitImg.className = 'patriot-portrait';
    portraitImg.alt = fullName + ' portrait';
    portraitImg.draggable = false;

    var etchingImg = document.createElement('img');
    etchingImg.className = 'patriot-etching';
    etchingImg.alt = '';
    etchingImg.draggable = false;
    etchingImg.style.mixBlendMode = 'multiply';

    var scanlines = document.createElement('div');
    scanlines.className = 'patriot-scanlines';

    var candlelight = document.createElement('div');
    candlelight.className = 'patriot-candlelight';

    frame.appendChild(portraitImg);
    frame.appendChild(etchingImg);
    frame.appendChild(scanlines);
    frame.appendChild(candlelight);

    // ── Nameplate ──
    var nameplate = document.createElement('div');
    nameplate.className = 'patriot-nameplate';
    nameplate.textContent = formatNameplate(fullName);

    // ── Glow ──
    var glow = document.createElement('div');
    glow.className = 'patriot-glow';

    // ── Assemble ──
    card.appendChild(frame);
    card.appendChild(nameplate);
    card.appendChild(glow);

    return {
      card: card,
      frame: frame,
      portraitImg: portraitImg,
      etchingImg: etchingImg,
      nameplate: nameplate,
      glow: glow
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  Portrait Loading Pipeline
  // ═══════════════════════════════════════════════════════════════

  /**
   * Fetch, load, process, and apply portrait imagery for one patriot.
   */
  function loadPatriotPortrait(fullName) {
    var patriot = PATRIOTS[fullName];
    var cardData = cards[fullName];
    if (!patriot || !cardData) return;

    fetchPortraitUrl(patriot.article)
      .then(function (imageUrl) {
        if (!imageUrl) throw new Error('No image URL for ' + fullName);
        return loadImage(imageUrl);
      })
      .then(function (img) {
        var result = processImage(img);
        if (result) {
          cardData.portraitImg.src = result.baseDataUrl;
          cardData.etchingImg.src = result.edgeDataUrl;
        } else {
          // Tainted canvas — use fallback
          var fb = createFallbackImage(fullName, patriot.color);
          cardData.portraitImg.src = fb.baseDataUrl;
          cardData.etchingImg.src = fb.edgeDataUrl;
        }
        cardData.frame.classList.add('loaded');
      })
      .catch(function (err) {
        console.warn('[Hologram] Portrait fallback for ' + fullName + ':', err.message || err);
        var fb = createFallbackImage(fullName, patriot.color);
        cardData.portraitImg.src = fb.baseDataUrl;
        cardData.etchingImg.src = fb.edgeDataUrl;
        cardData.frame.classList.add('loaded');
      });
  }


  // ═══════════════════════════════════════════════════════════════
  //  Public API
  // ═══════════════════════════════════════════════════════════════

  /**
   * Initialize the portrait gallery inside the given container.
   * Creates all four patriot cards immediately; all begin in .idle state.
   */
  function init(containerElement) {
    if (isInitialized) return;

    container = containerElement;
    if (!container) {
      console.warn('[Hologram] init: no container element provided.');
      return;
    }

    // ── Gallery wrapper ──
    galleryEl = document.createElement('div');
    galleryEl.className = 'portrait-gallery';
    container.appendChild(galleryEl);

    // ── Create all four patriot cards ──
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

  /**
   * Summon a patriot — transition from .idle to .active.
   * Accepts fuzzy name matching (last name, partial, case-insensitive).
   */
  function summon(name) {
    if (!isInitialized) return;

    var fullName = resolvePatriotName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    card.classList.remove('idle');
    card.classList.add('active');
  }

  /**
   * Release a patriot — back to .idle state.
   */
  function release(name) {
    if (!isInitialized) return;

    var fullName = resolvePatriotName(name);
    if (!fullName || !cards[fullName]) return;

    var card = cards[fullName].card;
    card.classList.remove('active', 'speaking');
    card.classList.add('idle');
  }

  /**
   * Toggle the .speaking class on a patriot's card.
   */
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

  /**
   * Remove .speaking from all patriot cards.
   */
  function clearSpeaking() {
    for (var fullName in cards) {
      if (cards.hasOwnProperty(fullName)) {
        cards[fullName].card.classList.remove('speaking');
      }
    }
  }

  /**
   * Return the PATRIOTS data entry for a name (fuzzy matched).
   */
  function getPatriotData(name) {
    var fullName = resolvePatriotName(name);
    if (!fullName) return null;
    return PATRIOTS[fullName];
  }


  // ── Public Interface ──

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
