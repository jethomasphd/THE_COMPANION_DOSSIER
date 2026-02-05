/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — Holographic Visualization Engine
   Wikipedia portrait-based holographic rendering system.
   Uses Canvas 2D for image processing and CSS for animation.
   No Three.js dependency.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Hologram = (function () {

  // ── State ──
  var container = null;
  var gallery = null;
  var idleEl = null;
  var personas = {};       // name -> { card, frame, noiseCanvas, noiseCtx, phase }
  var noiseInterval = null;
  var styleInjected = false;
  var isInitialized = false;

  // ── Constants ──
  var IMG_MAX_W = 200;
  var IMG_MAX_H = 300;
  var IMG_DEFAULT_W = 200;
  var IMG_DEFAULT_H = 280;
  var NOISE_INTERVAL_MS = 120;
  var MATERIALIZE_MS = 2500;
  var DEMATERIALIZE_MS = 1500;
  var NOISE_DENSITY = 0.03;

  // Styles are handled by companion.css — no injection needed
  function injectStyles() {}


  // ═══════════════════════════════════════════════════════════════
  //  Utility Functions
  // ═══════════════════════════════════════════════════════════════

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return { r: 201, g: 165, b: 78 }; // fallback gold
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function personaCount() {
    var count = 0;
    for (var key in personas) {
      if (personas.hasOwnProperty(key)) {
        count++;
      }
    }
    return count;
  }


  // ═══════════════════════════════════════════════════════════════
  //  Wikipedia Portrait Fetching
  // ═══════════════════════════════════════════════════════════════

  function fetchPortrait(name) {
    var slug = name.replace(/\s+/g, '_');
    var url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(slug);

    return fetch(url)
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .then(function (data) {
        if (!data) return null;
        // Prefer thumbnail for faster loading, fall back to original
        if (data.thumbnail && data.thumbnail.source) {
          return data.thumbnail.source;
        }
        if (data.originalimage && data.originalimage.source) {
          return data.originalimage.source;
        }
        return null;
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

      img.onload = function () {
        resolve(img);
      };

      img.onerror = function () {
        // Retry without CORS — we may not be able to read pixels,
        // but we'll catch that later and fall back
        var img2 = new Image();
        img2.onload = function () {
          resolve(img2);
        };
        img2.onerror = function () {
          reject(new Error('Failed to load image: ' + url));
        };
        img2.src = url;
      };

      img.src = url;
    });
  }


  // ═══════════════════════════════════════════════════════════════
  //  Image Processing — Sobel Edge Detection & Holographic Tint
  // ═══════════════════════════════════════════════════════════════

  /**
   * Returns the grayscale luminance at (x, y) from an ImageData buffer.
   * Clamps coordinates to image bounds.
   */
  function grayAt(data, width, x, y, height) {
    // Clamp
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= width) x = width - 1;
    if (y >= height) y = height - 1;

    var idx = (y * width + x) * 4;
    var r = data[idx];
    var g = data[idx + 1];
    var b = data[idx + 2];
    // Standard luminance formula
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  /**
   * Processes a loaded image into two holographic layers.
   * Returns { baseDataUrl, edgeDataUrl }
   */
  function processImage(img, color, targetWidth, targetHeight) {
    var rgb = hexToRgb(color);

    // ── Draw source image to canvas ──
    var srcCanvas = document.createElement('canvas');
    srcCanvas.width = targetWidth;
    srcCanvas.height = targetHeight;
    var srcCtx = srcCanvas.getContext('2d');

    // Center the image in the canvas
    var scale = Math.min(targetWidth / img.width, targetHeight / img.height);
    var drawW = img.width * scale;
    var drawH = img.height * scale;
    var offsetX = (targetWidth - drawW) / 2;
    var offsetY = (targetHeight - drawH) / 2;

    srcCtx.fillStyle = '#000000';
    srcCtx.fillRect(0, 0, targetWidth, targetHeight);
    srcCtx.drawImage(img, offsetX, offsetY, drawW, drawH);

    var imageData;
    try {
      imageData = srcCtx.getImageData(0, 0, targetWidth, targetHeight);
    } catch (e) {
      // CORS tainted canvas — return null so caller uses fallback
      return null;
    }
    var srcData = imageData.data;

    // ── Base Layer: desaturated + tinted ──
    var baseCanvas = document.createElement('canvas');
    baseCanvas.width = targetWidth;
    baseCanvas.height = targetHeight;
    var baseCtx = baseCanvas.getContext('2d');
    var baseImageData = baseCtx.createImageData(targetWidth, targetHeight);
    var baseData = baseImageData.data;

    var i, gray;
    for (i = 0; i < srcData.length; i += 4) {
      gray = 0.299 * srcData[i] + 0.587 * srcData[i + 1] + 0.114 * srcData[i + 2];
      baseData[i]     = Math.min(255, gray * 0.4 + rgb.r * 0.15); // R
      baseData[i + 1] = Math.min(255, gray * 0.4 + rgb.g * 0.15); // G
      baseData[i + 2] = Math.min(255, gray * 0.4 + rgb.b * 0.15); // B
      baseData[i + 3] = 180;                                        // A
    }

    baseCtx.putImageData(baseImageData, 0, 0);

    // ── Edge Layer: Sobel filter, colorized ──
    var edgeCanvas = document.createElement('canvas');
    edgeCanvas.width = targetWidth;
    edgeCanvas.height = targetHeight;
    var edgeCtx = edgeCanvas.getContext('2d');
    var edgeImageData = edgeCtx.createImageData(targetWidth, targetHeight);
    var edgeData = edgeImageData.data;

    var x, y, gx, gy, mag, idx;
    var w = targetWidth;
    var h = targetHeight;

    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        // Sobel 3x3 kernels
        // Gx = [-1 0 1; -2 0 2; -1 0 1]
        gx = -grayAt(srcData, w, x - 1, y - 1, h)
             + grayAt(srcData, w, x + 1, y - 1, h)
             - 2 * grayAt(srcData, w, x - 1, y, h)
             + 2 * grayAt(srcData, w, x + 1, y, h)
             - grayAt(srcData, w, x - 1, y + 1, h)
             + grayAt(srcData, w, x + 1, y + 1, h);

        // Gy = [-1 -2 -1; 0 0 0; 1 2 1]
        gy = -grayAt(srcData, w, x - 1, y - 1, h)
             - 2 * grayAt(srcData, w, x, y - 1, h)
             - grayAt(srcData, w, x + 1, y - 1, h)
             + grayAt(srcData, w, x - 1, y + 1, h)
             + 2 * grayAt(srcData, w, x, y + 1, h)
             + grayAt(srcData, w, x + 1, y + 1, h);

        mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));

        idx = (y * w + x) * 4;
        edgeData[idx]     = mag * (rgb.r / 255);
        edgeData[idx + 1] = mag * (rgb.g / 255);
        edgeData[idx + 2] = mag * (rgb.b / 255);
        edgeData[idx + 3] = mag > 20 ? mag * 0.9 : 0;
      }
    }

    edgeCtx.putImageData(edgeImageData, 0, 0);

    return {
      baseDataUrl: baseCanvas.toDataURL(),
      edgeDataUrl: edgeCanvas.toDataURL()
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  Fallback Image — stylized initial letter when no portrait
  // ═══════════════════════════════════════════════════════════════

  function createFallbackImage(name, color, width, height) {
    var rgb = hexToRgb(color);
    var initial = (name && name.length > 0) ? name.charAt(0).toUpperCase() : '?';

    // ── Base fallback ──
    var baseCanvas = document.createElement('canvas');
    baseCanvas.width = width;
    baseCanvas.height = height;
    var baseCtx = baseCanvas.getContext('2d');

    // Dark background
    baseCtx.fillStyle = '#080808';
    baseCtx.fillRect(0, 0, width, height);

    // Large initial letter
    var fontSize = Math.min(width, height) * 0.45;
    baseCtx.font = fontSize + 'px Georgia, "Times New Roman", serif';
    baseCtx.textAlign = 'center';
    baseCtx.textBaseline = 'middle';
    baseCtx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.4)';
    baseCtx.fillText(initial, width / 2, height / 2);

    // Circle stroke
    var radius = Math.min(width, height) * 0.35;
    baseCtx.beginPath();
    baseCtx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    baseCtx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.3)';
    baseCtx.lineWidth = 1.5;
    baseCtx.stroke();

    // ── Edge fallback ──
    var edgeCanvas = document.createElement('canvas');
    edgeCanvas.width = width;
    edgeCanvas.height = height;
    var edgeCtx = edgeCanvas.getContext('2d');

    // Draw the same initial as edge outline
    edgeCtx.font = fontSize + 'px Georgia, "Times New Roman", serif';
    edgeCtx.textAlign = 'center';
    edgeCtx.textBaseline = 'middle';
    edgeCtx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.6)';
    edgeCtx.lineWidth = 1;
    edgeCtx.strokeText(initial, width / 2, height / 2);

    // Circle edge
    edgeCtx.beginPath();
    edgeCtx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    edgeCtx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.5)';
    edgeCtx.lineWidth = 1;
    edgeCtx.stroke();

    // Inner decorative circle
    edgeCtx.beginPath();
    edgeCtx.arc(width / 2, height / 2, radius * 0.85, 0, Math.PI * 2);
    edgeCtx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.2)';
    edgeCtx.lineWidth = 0.5;
    edgeCtx.stroke();

    return {
      baseDataUrl: baseCanvas.toDataURL(),
      edgeDataUrl: edgeCanvas.toDataURL()
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  DOM — Card Creation
  // ═══════════════════════════════════════════════════════════════

  function createCard(name, color) {
    var rgb = hexToRgb(color);
    var safeName = escapeHtml(name);

    // ── Outer card ──
    var card = document.createElement('div');
    card.className = 'hologram-card';
    card.setAttribute('data-persona', name);
    card.style.setProperty('--holo-color', color);
    card.style.setProperty('--holo-r', String(rgb.r));
    card.style.setProperty('--holo-g', String(rgb.g));
    card.style.setProperty('--holo-b', String(rgb.b));

    // ── Frame ──
    var frame = document.createElement('div');
    frame.className = 'hologram-frame loading';

    var baseImg = document.createElement('img');
    baseImg.className = 'hologram-base-img';
    baseImg.alt = '';

    var edgeImg = document.createElement('img');
    edgeImg.className = 'hologram-edge-img';
    edgeImg.alt = '';

    var scanlines = document.createElement('div');
    scanlines.className = 'hologram-scanlines';

    var noiseCanvas = document.createElement('canvas');
    noiseCanvas.className = 'hologram-noise';
    noiseCanvas.width = IMG_DEFAULT_W;
    noiseCanvas.height = IMG_DEFAULT_H;

    var flicker = document.createElement('div');
    flicker.className = 'hologram-flicker';

    frame.appendChild(baseImg);
    frame.appendChild(edgeImg);
    frame.appendChild(scanlines);
    frame.appendChild(noiseCanvas);
    frame.appendChild(flicker);

    // ── Nameplate ──
    var nameplate = document.createElement('div');
    nameplate.className = 'hologram-nameplate';
    nameplate.textContent = name.toUpperCase();

    // ── Base light ──
    var baseLight = document.createElement('div');
    baseLight.className = 'hologram-base-light';

    card.appendChild(frame);
    card.appendChild(nameplate);
    card.appendChild(baseLight);

    return {
      card: card,
      frame: frame,
      baseImg: baseImg,
      edgeImg: edgeImg,
      noiseCanvas: noiseCanvas,
      noiseCtx: noiseCanvas.getContext('2d')
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  Noise Update Loop
  // ═══════════════════════════════════════════════════════════════

  function updateNoise() {
    var key, p, ctx, w, h, imgData, data, total, i, idx;

    for (key in personas) {
      if (!personas.hasOwnProperty(key)) continue;
      p = personas[key];
      if (!p.noiseCtx) continue;

      ctx = p.noiseCtx;
      w = p.noiseCanvas.width;
      h = p.noiseCanvas.height;

      imgData = ctx.createImageData(w, h);
      data = imgData.data;
      total = w * h;

      for (i = 0; i < total; i++) {
        if (Math.random() < NOISE_DENSITY) {
          idx = i * 4;
          data[idx]     = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = Math.floor(Math.random() * 120 + 40);
        }
      }

      ctx.putImageData(imgData, 0, 0);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  Idle State Management
  // ═══════════════════════════════════════════════════════════════

  function showIdle() {
    if (!idleEl) return;
    idleEl.classList.remove('hidden');
  }

  function hideIdle() {
    if (!idleEl) return;
    idleEl.classList.add('hidden');
  }

  function createIdleElement() {
    var el = document.createElement('div');
    el.className = 'hologram-idle';

    var sigil = document.createElement('div');
    sigil.className = 'hologram-idle-sigil';
    sigil.textContent = '\u25C7'; // ◇

    var text = document.createElement('div');
    text.className = 'hologram-idle-text';
    text.textContent = 'Speak the words to summon.';

    el.appendChild(sigil);
    el.appendChild(text);

    return el;
  }


  // ═══════════════════════════════════════════════════════════════
  //  Materialize / Dematerialize Flows
  // ═══════════════════════════════════════════════════════════════

  function materializeCard(persona) {
    var frame = persona.frame;
    var card = persona.card;

    // Remove loading, start materialization
    frame.classList.remove('loading');
    frame.classList.add('materializing');
    card.classList.add('materializing');

    persona.phase = 'materializing';

    setTimeout(function () {
      // Guard: persona may have been released during materialize
      if (!personas[persona.name]) return;

      frame.classList.remove('materializing');
      frame.classList.add('active');
      card.classList.remove('materializing');
      card.classList.add('active');
      persona.phase = 'active';
    }, MATERIALIZE_MS);
  }

  function dematerializeCard(name) {
    var persona = personas[name];
    if (!persona) return;

    var frame = persona.frame;
    var card = persona.card;

    // Clear any existing state classes
    frame.classList.remove('loading', 'materializing', 'active');
    card.classList.remove('materializing', 'active', 'speaking');

    frame.classList.add('dematerializing');
    card.classList.add('dematerializing');
    persona.phase = 'dematerializing';

    setTimeout(function () {
      if (card.parentNode) {
        card.parentNode.removeChild(card);
      }
      delete personas[name];

      // Show idle if gallery is empty
      if (personaCount() === 0) {
        showIdle();
      }
    }, DEMATERIALIZE_MS);
  }


  // ═══════════════════════════════════════════════════════════════
  //  Public API
  // ═══════════════════════════════════════════════════════════════

  /**
   * Initialize the hologram gallery inside the given container element.
   */
  function init(containerElement) {
    if (isInitialized) return;

    container = containerElement;
    if (!container) {
      console.warn('[Hologram] init: no container element provided.');
      return;
    }

    injectStyles();

    // Create gallery wrapper
    gallery = document.createElement('div');
    gallery.className = 'hologram-gallery';
    container.appendChild(gallery);

    // Create idle element
    idleEl = createIdleElement();
    gallery.appendChild(idleEl);

    // Start noise refresh loop
    noiseInterval = setInterval(updateNoise, NOISE_INTERVAL_MS);

    isInitialized = true;
  }

  /**
   * Summon a hologram for the given persona name and color.
   */
  function summon(name, color) {
    if (!isInitialized) return;
    if (personas[name]) return; // already summoned

    color = color || '#C9A54E';

    // Hide idle state on first summon
    hideIdle();

    // 1. Create card in loading state
    var elements = createCard(name, color);
    var card = elements.card;
    var frame = elements.frame;

    var persona = {
      name: name,
      color: color,
      card: card,
      frame: frame,
      baseImg: elements.baseImg,
      edgeImg: elements.edgeImg,
      noiseCanvas: elements.noiseCanvas,
      noiseCtx: elements.noiseCtx,
      phase: 'loading'
    };

    personas[name] = persona;
    gallery.appendChild(card);

    // 2. Fetch portrait async
    fetchPortrait(name).then(function (imageUrl) {
      // Guard: persona may have been released during fetch
      if (!personas[name]) return;

      if (imageUrl) {
        // 3a. Image found — load and process
        loadImage(imageUrl).then(function (img) {
          if (!personas[name]) return;

          // Calculate proportional dimensions
          var w = IMG_DEFAULT_W;
          var h = IMG_DEFAULT_H;
          var aspect = img.width / img.height;
          if (aspect > w / h) {
            h = Math.round(w / aspect);
          } else {
            w = Math.round(h * aspect);
          }
          w = Math.min(w, IMG_MAX_W);
          h = Math.min(h, IMG_MAX_H);

          var result = processImage(img, color, w, h);

          if (result) {
            persona.baseImg.src = result.baseDataUrl;
            persona.edgeImg.src = result.edgeDataUrl;
          } else {
            // Canvas was tainted, use fallback
            var fallback = createFallbackImage(name, color, IMG_DEFAULT_W, IMG_DEFAULT_H);
            persona.baseImg.src = fallback.baseDataUrl;
            persona.edgeImg.src = fallback.edgeDataUrl;
          }

          materializeCard(persona);

        }).catch(function () {
          // Image load failed — use fallback
          if (!personas[name]) return;
          var fallback = createFallbackImage(name, color, IMG_DEFAULT_W, IMG_DEFAULT_H);
          persona.baseImg.src = fallback.baseDataUrl;
          persona.edgeImg.src = fallback.edgeDataUrl;
          materializeCard(persona);
        });

      } else {
        // 3b. No image on Wikipedia — use fallback
        var fallback = createFallbackImage(name, color, IMG_DEFAULT_W, IMG_DEFAULT_H);
        persona.baseImg.src = fallback.baseDataUrl;
        persona.edgeImg.src = fallback.edgeDataUrl;
        materializeCard(persona);
      }
    });
  }

  /**
   * Release (dematerialize) a hologram by persona name.
   */
  function release(name) {
    if (!personas[name]) return;
    dematerializeCard(name);
  }

  /**
   * Release all active personas.
   */
  function releaseAll() {
    var names = [];
    for (var key in personas) {
      if (personas.hasOwnProperty(key)) {
        names.push(key);
      }
    }
    for (var i = 0; i < names.length; i++) {
      dematerializeCard(names[i]);
    }
  }

  /**
   * Toggle speaking state on a persona's hologram card.
   */
  function setSpeaking(name, isSpeaking) {
    var persona = personas[name];
    if (!persona) return;

    if (isSpeaking) {
      persona.card.classList.add('speaking');
    } else {
      persona.card.classList.remove('speaking');
    }
  }

  /**
   * Remove speaking state from all persona hologram cards.
   */
  function clearSpeaking() {
    for (var key in personas) {
      if (personas.hasOwnProperty(key)) {
        personas[key].card.classList.remove('speaking');
      }
    }
  }

  /**
   * Check if a persona is currently summoned (not dematerializing).
   */
  function hasPersona(name) {
    return !!personas[name] && personas[name].phase !== 'dematerializing';
  }

  /**
   * Get list of active persona names.
   */
  function getActivePersonas() {
    var names = [];
    for (var key in personas) {
      if (personas.hasOwnProperty(key) && personas[key].phase !== 'dematerializing') {
        names.push(key);
      }
    }
    return names;
  }

  /**
   * Full cleanup — remove all DOM, stop intervals.
   */
  function destroy() {
    if (noiseInterval) {
      clearInterval(noiseInterval);
      noiseInterval = null;
    }

    // Remove all cards
    for (var key in personas) {
      if (personas.hasOwnProperty(key)) {
        var card = personas[key].card;
        if (card && card.parentNode) {
          card.parentNode.removeChild(card);
        }
      }
    }
    personas = {};

    // Remove gallery
    if (gallery && gallery.parentNode) {
      gallery.parentNode.removeChild(gallery);
    }
    gallery = null;
    idleEl = null;
    container = null;
    isInitialized = false;
  }


  // ── Public API ──
  return {
    init: init,
    summon: summon,
    release: release,
    releaseAll: releaseAll,
    setSpeaking: setSpeaking,
    clearSpeaking: clearSpeaking,
    hasPersona: hasPersona,
    getActivePersonas: getActivePersonas,
    destroy: destroy
  };

})();
