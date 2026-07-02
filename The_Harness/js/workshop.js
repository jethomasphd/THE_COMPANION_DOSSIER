/* ═══════════════════════════════════════════════════════════════
   THE HARNESS — The Workshop
   Where the binding is assembled: choose the minds, give them the
   matter, name the working. This module owns all of the assembly
   UI and hands a finished binding to main.js on "Bind & Enter."

        binding = { name, intent, personas[], matter[] }
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Workshop = (function () {

  var onEnter = null;

  // ── The binding under construction ──
  var binding = {
    name: '',
    intent: '',
    personas: [],   // ordered [{ name, id?, color, title?, epithet?, lens? }]
    matter: []      // [{ title, text }]
  };

  var el = {};

  function cache() {
    el = {
      presetRail:   document.getElementById('preset-rail'),
      pantheonGrid: document.getElementById('pantheon-grid'),
      customName:   document.getElementById('custom-name-input'),
      customAdd:    document.getElementById('custom-name-add'),
      bindingMinds: document.getElementById('binding-minds'),
      mindCount:    document.getElementById('mind-count'),
      matterTitle:  document.getElementById('matter-title-input'),
      matterText:   document.getElementById('matter-text-input'),
      matterFile:   document.getElementById('matter-file-input'),
      matterAdd:    document.getElementById('matter-add-btn'),
      matterList:   document.getElementById('matter-list'),
      matterCount:  document.getElementById('matter-count'),
      workingName:  document.getElementById('working-name-input'),
      intentInput:  document.getElementById('intent-input'),
      enterBtn:     document.getElementById('bind-enter-btn'),
      enterHint:    document.getElementById('bind-enter-hint')
    };
  }


  // ═══════════════════════════════════════════════════════════════
  //  PRESET RAIL
  // ═══════════════════════════════════════════════════════════════

  function renderPresets() {
    if (!el.presetRail) return;
    el.presetRail.innerHTML = '';
    COMPANION.Presets.all().forEach(function (preset) {
      var card = document.createElement('button');
      card.className = 'preset-card';
      card.type = 'button';
      card.setAttribute('data-preset', preset.id);

      var faces = '';
      preset.personas.slice(0, 5).forEach(function (pid) {
        var url = COMPANION.Pantheon.portraitUrl(pid);
        if (url) {
          faces += '<span class="preset-face" style="background-image:url(\'' + url + '\')"></span>';
        }
      });
      if (!faces) faces = '<span class="preset-face preset-face-empty">◇</span>';

      card.innerHTML =
        '<div class="preset-sigil">' + preset.sigil + '</div>' +
        '<div class="preset-name">' + esc(preset.name) + '</div>' +
        '<div class="preset-faces">' + faces + '</div>' +
        '<div class="preset-tagline">' + esc(preset.tagline) + '</div>' +
        '<div class="preset-load">Load this binding &rarr;</div>';

      card.addEventListener('click', function () { loadPreset(preset.id); });
      el.presetRail.appendChild(card);
    });
  }

  function loadPreset(id) {
    var preset = COMPANION.Presets.get(id);
    if (!preset) return;

    binding.name = preset.name === 'The Open Working' ? '' : preset.name;
    binding.intent = preset.intent || '';
    binding.matter = (preset.matter || []).map(function (d) {
      return { title: d.title, text: d.text };
    });
    binding.personas = [];
    (preset.personas || []).forEach(function (pid) {
      var p = COMPANION.Pantheon.get(pid);
      if (p) binding.personas.push(cardFromPantheon(p));
    });

    // reflect into name/intent fields
    if (el.workingName) el.workingName.value = binding.name;
    if (el.intentInput) el.intentInput.value = binding.intent;

    syncAll();
    flashLoaded(id);

    // Scroll the seeker to the binding summary so they see what loaded
    var summary = document.getElementById('binding-summary');
    if (summary && summary.scrollIntoView) summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function flashLoaded(id) {
    document.querySelectorAll('.preset-card').forEach(function (c) {
      c.classList.toggle('loaded', c.getAttribute('data-preset') === id);
    });
  }


  // ═══════════════════════════════════════════════════════════════
  //  PANTHEON GRID
  // ═══════════════════════════════════════════════════════════════

  function renderPantheon() {
    if (!el.pantheonGrid) return;
    el.pantheonGrid.innerHTML = '';

    COMPANION.Pantheon.all().forEach(function (p) {
      var tile = document.createElement('button');
      tile.className = 'pantheon-tile';
      tile.type = 'button';
      tile.setAttribute('data-id', p.id);
      tile.style.setProperty('--tile-color', p.color);

      var url = COMPANION.Pantheon.portraitUrl(p.id);
      tile.innerHTML =
        '<div class="tile-frame"><img class="tile-portrait" alt="' + esc(p.name) + '" src="' + url + '" draggable="false"></div>' +
        '<div class="tile-check">&#10003;</div>' +
        '<div class="tile-meta">' +
          '<span class="tile-name">' + esc(p.name) + '</span>' +
          '<span class="tile-epithet">' + esc(p.epithet) + '</span>' +
        '</div>';

      tile.addEventListener('click', function () { togglePersona(p.id); });
      el.pantheonGrid.appendChild(tile);
    });
  }

  function cardFromPantheon(p) {
    return { name: p.name, id: p.id, color: p.color, title: p.title, epithet: p.epithet, lens: p.lens };
  }

  function indexOfPersona(name) {
    var lower = name.toLowerCase();
    for (var i = 0; i < binding.personas.length; i++) {
      if (binding.personas[i].name.toLowerCase() === lower) return i;
    }
    return -1;
  }

  function togglePersona(id) {
    var p = COMPANION.Pantheon.get(id);
    if (!p) return;
    var idx = indexOfPersona(p.name);
    if (idx !== -1) binding.personas.splice(idx, 1);
    else binding.personas.push(cardFromPantheon(p));
    syncAll();
  }

  function addCustom() {
    if (!el.customName) return;
    var name = el.customName.value.trim();
    if (!name) return;
    if (indexOfPersona(name) !== -1) { el.customName.value = ''; return; }

    // If the typed name matches a pantheon mind, bind the rich card.
    var resolved = COMPANION.Pantheon.resolve(name);
    if (resolved) binding.personas.push(cardFromPantheon(resolved));
    else binding.personas.push({ name: name, color: '#c9a54e' });

    el.customName.value = '';
    syncAll();
  }


  // ═══════════════════════════════════════════════════════════════
  //  THE MATTER
  // ═══════════════════════════════════════════════════════════════

  function addMatter() {
    var text = el.matterText ? el.matterText.value.trim() : '';
    if (!text) return;
    var title = el.matterTitle && el.matterTitle.value.trim()
      ? el.matterTitle.value.trim()
      : ('Document ' + (binding.matter.length + 1));
    binding.matter.push({ title: title, text: text });
    if (el.matterTitle) el.matterTitle.value = '';
    if (el.matterText) el.matterText.value = '';
    syncMatter();
  }

  function removeMatter(i) {
    binding.matter.splice(i, 1);
    syncMatter();
  }

  function handleFiles(fileList) {
    if (!fileList || !fileList.length) return;
    Array.prototype.forEach.call(fileList, function (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var text = String(e.target.result || '').trim();
        if (!text) return;
        var title = file.name.replace(/\.[^.]+$/, '');
        binding.matter.push({ title: title, text: text });
        syncMatter();
      };
      reader.readAsText(file);
    });
  }


  // ═══════════════════════════════════════════════════════════════
  //  SYNC
  // ═══════════════════════════════════════════════════════════════

  function syncAll() { syncPantheon(); syncMinds(); syncMatter(); syncEnter(); }

  function syncPantheon() {
    if (!el.pantheonGrid) return;
    var selected = {};
    binding.personas.forEach(function (p) { if (p.id) selected[p.id] = true; });
    el.pantheonGrid.querySelectorAll('.pantheon-tile').forEach(function (tile) {
      tile.classList.toggle('selected', !!selected[tile.getAttribute('data-id')]);
    });
  }

  function syncMinds() {
    if (!el.bindingMinds) return;
    el.bindingMinds.innerHTML = '';
    if (!binding.personas.length) {
      el.bindingMinds.innerHTML = '<span class="binding-empty">No minds chosen yet. Tap a portrait, or name one below.</span>';
    } else {
      binding.personas.forEach(function (p, i) {
        var chip = document.createElement('span');
        chip.className = 'mind-chip';
        chip.style.borderColor = p.color;
        chip.style.color = p.color;
        var face = '';
        var url = COMPANION.Pantheon.portraitUrl(p.id || p.name);
        if (url) face = '<span class="chip-face" style="background-image:url(\'' + url + '\')"></span>';
        else face = '<span class="chip-face chip-face-empty">' + esc(initials(p.name)) + '</span>';
        chip.innerHTML = face + '<span class="chip-name">' + esc(p.name) + '</span>' +
          '<span class="chip-x" title="Remove">&times;</span>';
        chip.querySelector('.chip-x').addEventListener('click', function () {
          binding.personas.splice(i, 1);
          syncAll();
        });
        el.bindingMinds.appendChild(chip);
      });
    }
    if (el.mindCount) el.mindCount.textContent = String(binding.personas.length);
  }

  function syncMatter() {
    if (!el.matterList) return;
    el.matterList.innerHTML = '';
    if (!binding.matter.length) {
      el.matterList.innerHTML = '<span class="binding-empty">No matter bound. The minds will work from their own knowledge.</span>';
    } else {
      binding.matter.forEach(function (doc, i) {
        var item = document.createElement('div');
        item.className = 'matter-item';
        var words = (doc.text.trim().match(/\S+/g) || []).length;
        item.innerHTML =
          '<div class="matter-item-head">' +
            '<span class="matter-item-title">' + esc(doc.title) + '</span>' +
            '<span class="matter-item-x" title="Remove">&times;</span>' +
          '</div>' +
          '<div class="matter-item-meta">' + words + ' words</div>' +
          '<div class="matter-item-preview">' + esc(doc.text.slice(0, 220)) + (doc.text.length > 220 ? '…' : '') + '</div>';
        item.querySelector('.matter-item-x').addEventListener('click', function () { removeMatter(i); });
        el.matterList.appendChild(item);
      });
    }
    if (el.matterCount) el.matterCount.textContent = String(binding.matter.length);
  }

  function syncEnter() {
    var ready = binding.personas.length >= 1;
    if (el.enterBtn) el.enterBtn.disabled = !ready;
    if (el.enterHint) {
      if (ready) {
        var names = binding.personas.map(function (p) { return p.name; });
        el.enterHint.textContent = names.length === 1
          ? 'One mind waits: ' + names[0] + '.'
          : names.length + ' minds wait in symposium.';
      } else {
        el.enterHint.textContent = 'Choose at least one mind to open the threshold.';
      }
    }
  }


  // ═══════════════════════════════════════════════════════════════
  //  ENTER
  // ═══════════════════════════════════════════════════════════════

  function enter() {
    if (binding.personas.length < 1) return;
    binding.name = el.workingName ? el.workingName.value.trim() : binding.name;
    binding.intent = el.intentInput ? el.intentInput.value.trim() : binding.intent;
    if (!binding.name) {
      binding.name = binding.personas.length === 1
        ? 'A Working with ' + binding.personas[0].name
        : 'A Symposium of ' + binding.personas.length;
    }
    if (onEnter) onEnter(getBinding());
  }

  function getBinding() {
    return {
      name: binding.name,
      intent: binding.intent,
      personas: binding.personas.map(function (p) { return Object.assign({}, p); }),
      matter: binding.matter.map(function (d) { return { title: d.title, text: d.text }; })
    };
  }


  // ── helpers ──

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }
  function initials(name) {
    var parts = String(name || '?').trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }


  // ═══════════════════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════════════════

  function bind() {
    if (el.customAdd) el.customAdd.addEventListener('click', addCustom);
    if (el.customName) el.customName.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); addCustom(); }
    });
    if (el.matterAdd) el.matterAdd.addEventListener('click', addMatter);
    if (el.matterFile) el.matterFile.addEventListener('change', function (e) {
      handleFiles(e.target.files);
      e.target.value = '';
    });
    if (el.workingName) el.workingName.addEventListener('input', function () { binding.name = el.workingName.value; });
    if (el.intentInput) el.intentInput.addEventListener('input', function () { binding.intent = el.intentInput.value; });
    if (el.enterBtn) el.enterBtn.addEventListener('click', enter);
  }

  function init(enterCallback) {
    onEnter = enterCallback;
    cache();
    renderPresets();
    renderPantheon();
    bind();
    syncAll();
  }

  return {
    init: init,
    loadPreset: loadPreset,
    getBinding: getBinding
  };

})();
