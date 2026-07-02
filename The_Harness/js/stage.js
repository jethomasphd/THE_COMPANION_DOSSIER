/* ═══════════════════════════════════════════════════════════════
   THE HARNESS — The Portrait Stage
   A generalized gallery. Unlike the fixed chambers, the stage does
   not know its faces in advance — it renders a card for whatever
   mind the seeker summons. Pantheon minds arrive with a portrait;
   minds without a face arrive as a sigil of their initial.

   States per card: idle → arriving → active → (speaking) → released.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Stage = (function () {

  var container = null;
  var galleryEl = null;
  var cards = {};        // name -> { card, portraitImg, ... }
  var initialized = false;

  function init(el) {
    container = el;
    if (!container) return;
    container.innerHTML = '';
    galleryEl = document.createElement('div');
    galleryEl.className = 'portrait-gallery';
    container.appendChild(galleryEl);
    cards = {};
    initialized = true;
    resize();
  }

  function reset() {
    if (galleryEl) galleryEl.innerHTML = '';
    cards = {};
  }

  // Density class so 8 portraits still fit gracefully
  function resize() {
    if (!galleryEl) return;
    var n = Object.keys(cards).length;
    galleryEl.classList.toggle('dense', n >= 5);
    galleryEl.classList.toggle('very-dense', n >= 7);
  }

  function initials(name) {
    var parts = String(name || '?').trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function nameplate(card) {
    var last = card.name.split(' ').slice(-1)[0].toUpperCase().replace(/[.,]/g, '');
    return (card.title ? card.title + ' ' : '') + last;
  }

  // personaCard: { name, id?, color, title?, epithet? }
  function createCard(personaCard) {
    var color = personaCard.color || '#c9a54e';

    var card = document.createElement('div');
    card.className = 'stage-card idle';
    card.setAttribute('data-persona', personaCard.name);
    card.style.setProperty('--card-color', color);

    var frame = document.createElement('div');
    frame.className = 'stage-frame';

    var portraitImg = null;
    var url = COMPANION.Pantheon.portraitUrl(personaCard.id || personaCard.name);
    if (url) {
      portraitImg = document.createElement('img');
      portraitImg.className = 'stage-portrait';
      portraitImg.alt = personaCard.name + ' portrait';
      portraitImg.draggable = false;
      portraitImg.onload = function () { frame.classList.add('loaded'); };
      portraitImg.onerror = function () { frame.classList.add('faceless'); };
      portraitImg.src = url;
      frame.appendChild(portraitImg);
    } else {
      frame.classList.add('faceless');
      var sig = document.createElement('span');
      sig.className = 'stage-initial';
      sig.textContent = initials(personaCard.name);
      frame.appendChild(sig);
    }

    var plate = document.createElement('div');
    plate.className = 'stage-nameplate';
    plate.textContent = nameplate(personaCard);

    var glow = document.createElement('div');
    glow.className = 'stage-glow';

    card.appendChild(glow);
    card.appendChild(frame);
    card.appendChild(plate);

    return { card: card, frame: frame, portraitImg: portraitImg };
  }

  function summon(personaCard) {
    if (!initialized || !personaCard || !personaCard.name) return;
    if (cards[personaCard.name]) { activate(personaCard.name); return; }

    var cardData = createCard(personaCard);
    cards[personaCard.name] = cardData;
    galleryEl.appendChild(cardData.card);
    resize();

    // Force reflow, then animate arrival
    void cardData.card.offsetWidth;
    cardData.card.classList.remove('idle');
    cardData.card.classList.add('arriving');
    setTimeout(function () {
      if (!cards[personaCard.name]) return;
      cardData.card.classList.remove('arriving');
      cardData.card.classList.add('active');
    }, 1100);
  }

  function activate(name) {
    var c = cards[name];
    if (!c) return;
    c.card.classList.remove('idle', 'arriving');
    c.card.classList.add('active');
  }

  function release(name) {
    var c = cards[name];
    if (!c) return;
    c.card.classList.remove('active', 'speaking', 'arriving');
    c.card.classList.add('departing');
    setTimeout(function () {
      if (c.card.parentNode) c.card.parentNode.removeChild(c.card);
      delete cards[name];
      resize();
    }, 700);
  }

  function setSpeaking(name, isSpeaking) {
    var c = cards[name];
    if (!c) return;
    c.card.classList.toggle('speaking', !!isSpeaking);
  }

  function clearSpeaking() {
    Object.keys(cards).forEach(function (k) { cards[k].card.classList.remove('speaking'); });
  }

  return {
    init: init,
    reset: reset,
    summon: summon,
    release: release,
    setSpeaking: setSpeaking,
    clearSpeaking: clearSpeaking
  };

})();
