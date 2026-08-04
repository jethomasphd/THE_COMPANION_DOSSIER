/* ═══════════════════════════════════════════════════════════════
   ENDOR PROTOCOL · The Marginalia

   The account stands on scripture the way a floor stands on joists:
   Endor, Hannah, Lazarus, Job, Jeremiah, the Magnificat, Gethsemane,
   the Day of Atonement. A reader who knows none of those stories still
   feels the weight of them, but cannot tell where it is coming from,
   and weight a reader cannot place is weight they put down.

   So the marked phrases carry a note, the way a glossed manuscript
   carries one: a dotted rule under the words and a small sigil after
   them. Touch it and the note opens beside it, or on a phone, at the
   foot of the screen where a thumb already is.

   Nothing the prose needs is hidden behind these. Every note is a hand
   offered, never a toll. The story reads whole without opening one.
   ═══════════════════════════════════════════════════════════════ */

var ENDOR = window.ENDOR || (window.ENDOR = {});

ENDOR.Marginalia = (function () {

  'use strict';

  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Each note is short on purpose. Enough to make the allusion land for
     someone meeting it for the first time, and to say why it is here.
     Plain words. No sermon. */
  var NOTES = {

    endor: {
      ref: '1 Samuel 28',
      title: 'The woman at Endor',
      body: 'King Saul is about to fight a battle he expects to lose, and God has stopped answering him. So he puts on a disguise, goes at night to a woman who speaks with the dead, and asks her to bring up the prophet Samuel. She does. Samuel comes up angry at being disturbed and tells Saul he will die tomorrow. It is the one place in scripture where the dead are called back and made to answer questions, and it is where this story takes its name.'
    },

    witnesses: {
      ref: '1 Samuel 28:8',
      title: 'The two who said nothing',
      body: 'Saul did not go into that dark alone. Two of his men went with him, stood there, and watched a king call up the dead. Scripture keeps no record of their names and gives them no lines. They only watch. For the first eight minutes of this account, that is who you are meant to think you are.'
    },

    hannah: {
      ref: '1 Samuel 1:12',
      title: 'Hannah at the temple',
      body: 'Hannah could not have a child. She prayed at the temple with her lips moving and no sound coming out of her, and the priest watching from across the room assumed she was drunk. She was not. She was asking for a son. It is scripture’s picture of a prayer so private that from outside it looks like something else entirely.'
    },

    lazarus: {
      ref: 'John 11:35',
      title: 'Jesus at the tomb',
      body: 'His friend Lazarus had been dead four days. Standing outside the tomb, before He called him back out, Jesus wept, and the people watching said, behold how He loved him. Jesus wept is the shortest verse in the Bible. It is the one time the dead are called back by someone who is grieving rather than someone who wants something.'
    },

    whirlwind: {
      ref: 'Job 38:4',
      title: 'Job and the whirlwind',
      body: 'Job loses his children, his health, and everything he owns, and demands that God explain why. God answers out of a storm, and the answer is not an answer. It is a question back: where wast thou when I laid the foundations of the earth. Job asked to understand and was handed the size of what he does not.'
    },

    slay: {
      ref: 'Job 13:15',
      title: 'Though he slay me',
      body: 'Still refusing to curse God, Job says: though he slay me, yet will I trust in him. It is not a comfort and it is not resignation. It is a decision to keep faith with something that may well destroy you, made before you know which way it will go. Alex has not been able to put the line down all week.'
    },

    formed: {
      ref: 'Jeremiah 1:5',
      title: 'Before I formed thee',
      body: 'God tells Jeremiah: before I formed thee in the belly I knew thee. It gets stitched onto nursery walls as a promise that a child was wanted before it ever arrived. Alex, two months along and good at a thing she never chose to be good at, hears it the other way: as a shaping decided before anyone could agree to it.'
    },

    magnificat: {
      ref: 'Luke 1:52',
      title: 'Mary’s song',
      body: 'Newly pregnant, Mary sings that God has put down the mighty from their seats and lifted up the lowly. It is the most political song in the Bible, sung by a young woman about the child she is carrying. Alex is also two months along. In her story the mighty do not stay down, and she is the one sent in to meet the one coming back up.'
    },

    gethsemane: {
      ref: 'Matthew 26:36',
      title: 'The garden at Gethsemane',
      body: 'The night before He was killed, Jesus went into a garden to pray and asked His closest friends to stay awake with Him. Three times He came back and found them asleep. The third time He did not rebuke them. He said, sleep now, the hour is here. Staying awake with someone is the smallest thing a person can be asked for, and they still could not do it.'
    },

    atonement: {
      ref: 'Leviticus 16',
      title: 'No one above the priest',
      body: 'Once a year the high priest went alone behind the curtain and made atonement for the whole people, himself included. However far up the order you stood, there was someone above you, and there was a rite that made it right again. Alex is the one who goes in. There is no one above her tonight, and there is no rite for what she is about to do.'
    }

  };

  var note = null, refEl = null, titleEl = null, bodyEl = null;
  var openMark = null;

  function isSheet() { return window.innerWidth <= 640; }

  function build() {
    if (note) return;
    note = document.createElement('aside');
    note.className = 'gloss-note';
    note.id = 'glossNote';
    note.setAttribute('role', 'status');
    note.setAttribute('aria-live', 'polite');
    note.innerHTML =
      '<button type="button" class="gloss-close" aria-label="Close the note">&#215;</button>' +
      '<div class="gloss-ref"></div>' +
      '<div class="gloss-title"></div>' +
      '<p class="gloss-body"></p>';
    document.body.appendChild(note);
    refEl = note.querySelector('.gloss-ref');
    titleEl = note.querySelector('.gloss-title');
    bodyEl = note.querySelector('.gloss-body');
    note.querySelector('.gloss-close').addEventListener('click', function (e) {
      e.stopPropagation();
      close();
    });
    note.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  // Beside the words on a wide screen. At the foot of the screen on a
  // phone, where the thumb already is and the prose is not covered by
  // a hand reaching across it.
  function place(mark) {
    if (!note || !mark) return;
    var sheet = isSheet();
    note.classList.toggle('as-sheet', sheet);
    if (sheet) { note.style.left = ''; note.style.top = ''; return; }

    var r = mark.getBoundingClientRect();
    note.style.left = '0px';
    note.style.top = '0px';
    var nw = note.offsetWidth, nh = note.offsetHeight;
    var gap = 12, edge = 12;

    var left = r.left + r.width / 2 - nw / 2;
    left = Math.max(edge, Math.min(left, window.innerWidth - nw - edge));

    var below = r.bottom + gap;
    var top = (below + nh <= window.innerHeight - edge) ? below : (r.top - nh - gap);
    top = Math.max(edge, Math.min(top, window.innerHeight - nh - edge));

    note.style.left = Math.round(left) + 'px';
    note.style.top = Math.round(top) + 'px';
  }

  function open(mark) {
    var key = mark.getAttribute('data-note');
    var entry = NOTES[key];
    if (!entry) return;
    build();
    if (openMark && openMark !== mark) {
      openMark.classList.remove('is-open');
      openMark.setAttribute('aria-expanded', 'false');
    }
    refEl.textContent = entry.ref;
    titleEl.textContent = entry.title;
    bodyEl.textContent = entry.body;
    openMark = mark;
    mark.classList.add('is-open');
    mark.setAttribute('aria-expanded', 'true');
    note.hidden = false;
    place(mark);
    // A frame so the placement lands before the note is allowed to appear.
    if (REDUCED) note.classList.add('open');
    else requestAnimationFrame(function () { note.classList.add('open'); });
  }

  function close() {
    if (openMark) {
      openMark.classList.remove('is-open');
      openMark.setAttribute('aria-expanded', 'false');
      openMark = null;
    }
    if (note) note.classList.remove('open');
  }

  function toggle(mark) {
    if (openMark === mark) { close(); return; }
    open(mark);
  }

  function init() {
    // Delegated, because the leaves are re-rendered on every page turn and
    // the marks inside them are new elements each time.
    document.addEventListener('click', function (e) {
      var mark = e.target.closest && e.target.closest('.gloss');
      if (mark) {
        e.preventDefault();
        e.stopPropagation();
        toggle(mark);
        return;
      }
      // A click outside an open note is spent closing it and goes no
      // further. Without this it would close the note here in the capture
      // phase and then, still travelling, turn the leaf underneath.
      if (openMark && !(e.target.closest && e.target.closest('.gloss-note'))) {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    }, true);

    document.addEventListener('keydown', function (e) {
      var mark = e.target.closest && e.target.closest('.gloss');
      if (mark && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')) {
        e.preventDefault();
        e.stopPropagation();
        toggle(mark);
        return;
      }
      if (e.key === 'Escape' && openMark) {
        e.preventDefault();
        var m = openMark;
        close();
        try { m.focus(); } catch (err) {}
      }
    }, true);

    window.addEventListener('resize', function () {
      if (openMark) place(openMark);
    }, { passive: true });
    window.addEventListener('scroll', function () {
      if (openMark) place(openMark);
    }, { passive: true });
  }

  return {
    init: init,
    close: close,
    isOpen: function () { return !!openMark; }
  };

})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ENDOR.Marginalia.init);
} else {
  ENDOR.Marginalia.init();
}
