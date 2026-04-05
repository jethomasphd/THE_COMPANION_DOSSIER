/* ═══════════════════════════════════════════════════════════════
   OBSERVER — The Room Watches Back
   Ambient data collection for narrative personalization.

   Nothing leaves the browser. Nothing gets a name.
   The text pays attention. That's all.
   ═══════════════════════════════════════════════════════════════ */

var OBSERVER = (function () {

  var STORAGE_PREFIX = 'narratives_v1_';
  var data = {
    // Temporal
    arrivalTime: null,
    arrivalHour: null,
    isNight: false,
    isLateNight: false,
    isDawn: false,
    dayOfWeek: null,

    // Session
    visitCount: 0,
    isReturn: false,
    lastVisitTimestamp: null,
    daysSinceLastVisit: null,
    totalTimeSpentSeconds: 0,

    // Scroll behavior
    scrollDepth: 0,
    maxScrollDepth: 0,
    scrollPauses: [],
    scrollDirection: 'down',
    scrollVelocity: 'deliberate',
    hasScrolledBack: false,

    // Reading patterns
    sectionTimings: {},
    longestPauseSection: null,
    longestPauseDuration: 0,

    // Environment
    viewportWidth: 0,
    viewportHeight: 0,
    isSmallScreen: false,
    isDarkMode: false,
    referrer: '',
    arrivedFromNowhere: false,

    // Engagement
    mouseIdle: false,
    idleDurationSeconds: 0,
    hasInteractedWithChat: false,
    chatMessageCount: 0,
    tabHidden: false,
    tabHiddenCount: 0
  };

  var scrollSamples = [];
  var lastScrollY = 0;
  var lastScrollTime = 0;
  var idleTimer = null;
  var sessionTimer = null;
  var currentSection = null;
  var sectionEntryTime = 0;

  function init() {
    data.arrivalTime = new Date();
    data.arrivalHour = data.arrivalTime.getHours();
    data.isNight = data.arrivalHour >= 21 || data.arrivalHour < 5;
    data.isLateNight = data.arrivalHour >= 0 && data.arrivalHour < 4;
    data.isDawn = data.arrivalHour >= 4 && data.arrivalHour < 6;
    data.dayOfWeek = data.arrivalTime.getDay();

    data.viewportWidth = window.innerWidth;
    data.viewportHeight = window.innerHeight;
    data.isSmallScreen = data.viewportWidth < 600;
    data.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    data.referrer = document.referrer || '';
    data.arrivedFromNowhere = data.referrer === '';

    // Visit tracking
    var storedCount = localStorage.getItem(STORAGE_PREFIX + 'visit_count');
    data.visitCount = storedCount ? parseInt(storedCount, 10) + 1 : 1;
    localStorage.setItem(STORAGE_PREFIX + 'visit_count', String(data.visitCount));

    data.isReturn = data.visitCount > 1;

    var lastVisit = localStorage.getItem(STORAGE_PREFIX + 'last_visit');
    if (lastVisit) {
      data.lastVisitTimestamp = parseInt(lastVisit, 10);
      data.daysSinceLastVisit = Math.floor((Date.now() - data.lastVisitTimestamp) / 86400000);
    }
    localStorage.setItem(STORAGE_PREFIX + 'last_visit', String(Date.now()));

    // Total time tracking
    var storedTime = localStorage.getItem(STORAGE_PREFIX + 'total_time');
    data.totalTimeSpentSeconds = storedTime ? parseInt(storedTime, 10) : 0;

    // Listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousemove', onActivity);
    document.addEventListener('keydown', onActivity);
    document.addEventListener('touchstart', onActivity);
    document.addEventListener('visibilitychange', onVisibility);

    // Session timer — tick every 5 seconds
    sessionTimer = setInterval(function () {
      data.totalTimeSpentSeconds += 5;
      localStorage.setItem(STORAGE_PREFIX + 'total_time', String(data.totalTimeSpentSeconds));
    }, 5000);

    // Start idle tracking
    resetIdleTimer();
  }

  function onScroll() {
    var now = Date.now();
    var y = window.scrollY;
    var maxY = document.body.scrollHeight - window.innerHeight;
    var pct = maxY > 0 ? y / maxY : 0;

    data.scrollDepth = pct;
    if (pct > data.maxScrollDepth) data.maxScrollDepth = pct;

    // Direction
    if (y < lastScrollY && lastScrollY - y > 50) {
      data.hasScrolledBack = true;
      data.scrollDirection = 'up';
    } else if (y > lastScrollY) {
      data.scrollDirection = 'down';
    }

    // Velocity sampling
    if (lastScrollTime > 0) {
      var dt = now - lastScrollTime;
      var dy = Math.abs(y - lastScrollY);
      if (dt > 0) {
        var speed = dy / dt; // px/ms
        scrollSamples.push(speed);
        if (scrollSamples.length > 20) scrollSamples.shift();

        var avg = scrollSamples.reduce(function (a, b) { return a + b; }, 0) / scrollSamples.length;
        if (avg < 0.3) data.scrollVelocity = 'deliberate';
        else if (avg < 0.8) data.scrollVelocity = 'steady';
        else data.scrollVelocity = 'rushing';
      }
    }

    lastScrollY = y;
    lastScrollTime = now;

    // Section timing
    detectCurrentSection();
    resetIdleTimer();
  }

  function detectCurrentSection() {
    var markers = document.querySelectorAll('[data-section]');
    var found = null;
    for (var i = 0; i < markers.length; i++) {
      var rect = markers[i].getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
        found = markers[i].getAttribute('data-section');
      }
    }

    if (found && found !== currentSection) {
      // Record time in previous section
      if (currentSection && sectionEntryTime > 0) {
        var elapsed = (Date.now() - sectionEntryTime) / 1000;
        if (!data.sectionTimings[currentSection]) data.sectionTimings[currentSection] = 0;
        data.sectionTimings[currentSection] += elapsed;

        if (elapsed > data.longestPauseDuration) {
          data.longestPauseDuration = elapsed;
          data.longestPauseSection = currentSection;
        }
      }

      currentSection = found;
      sectionEntryTime = Date.now();
    }
  }

  function onActivity() {
    resetIdleTimer();
    data.mouseIdle = false;
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      data.mouseIdle = true;
      data.idleDurationSeconds = 0;
      // Start counting idle
      var idleCount = setInterval(function () {
        if (!data.mouseIdle) { clearInterval(idleCount); return; }
        data.idleDurationSeconds += 1;
      }, 1000);
    }, 8000);
  }

  function onVisibility() {
    if (document.hidden) {
      data.tabHidden = true;
      data.tabHiddenCount++;
    } else {
      data.tabHidden = false;
    }
  }

  function registerChatMessage() {
    data.hasInteractedWithChat = true;
    data.chatMessageCount++;
  }

  function get() {
    // Finalize current section timing
    detectCurrentSection();
    return Object.assign({}, data);
  }

  // ═══ NARRATIVE INTELLIGENCE ═══
  // The observer interprets its data into narrative fragments
  // that the system messages and ambient text can use.

  function getAmbientHints() {
    var hints = [];
    var d = get();

    // Temporal
    if (d.isLateNight) {
      hints.push('the hour is late where you are');
      hints.push('most people are asleep right now');
    } else if (d.isNight) {
      hints.push('it is dark where you are');
    } else if (d.isDawn) {
      hints.push('you came before the sun');
    }

    // Return visits
    if (d.isReturn) {
      hints.push('you came back');
      if (d.visitCount === 2) hints.push('second visit \u2014 the room remembers');
      else if (d.visitCount > 4) hints.push('visit ' + d.visitCount + ' \u2014 the stool knows your weight');
      if (d.daysSinceLastVisit !== null && d.daysSinceLastVisit > 7) {
        hints.push('it has been ' + d.daysSinceLastVisit + ' days');
      }
    } else {
      hints.push('first time here');
    }

    // Scroll behavior
    if (d.hasScrolledBack) {
      hints.push('you went back \u2014 the text noticed');
    }
    if (d.scrollVelocity === 'deliberate') {
      hints.push('scroll velocity: deliberate');
    } else if (d.scrollVelocity === 'rushing') {
      hints.push('you\'re reading fast \u2014 or not reading');
    }

    // Longest pause
    if (d.longestPauseSection) {
      hints.push('longest pause: ' + d.longestPauseSection);
    }

    // Arrival
    if (d.arrivedFromNowhere) {
      hints.push('you arrived without a door');
    }

    // Small screen
    if (d.isSmallScreen) {
      hints.push('the screen is small \u2014 the walls are closer');
    }

    // Tab hidden
    if (d.tabHiddenCount > 0) {
      hints.push('you looked away ' + d.tabHiddenCount + ' time' + (d.tabHiddenCount > 1 ? 's' : ''));
    }

    return hints;
  }

  function getSystemMessage() {
    var d = get();
    var messages = [];

    if (d.isReturn && d.visitCount === 2) {
      messages.push('// second session detected \u2014 the bar remembers');
    } else if (d.visitCount > 3) {
      messages.push('// session ' + d.visitCount + ' \u2014 the pattern is forming');
    }

    if (d.isLateNight) {
      messages.push('// reader arrived at ' + String(d.arrivalHour).padStart(2, '0') + ':' +
        String(d.arrivalTime.getMinutes()).padStart(2, '0') + ' local time. noted.');
    }

    if (d.scrollVelocity === 'deliberate') {
      messages.push('// scroll velocity: deliberate \u2014 this one is reading');
    }

    if (d.hasScrolledBack) {
      messages.push('// reader scrolled back. the paragraph noticed.');
    }

    if (d.arrivedFromNowhere) {
      messages.push('// referrer: none \u2014 arrived without a door');
    }

    if (d.longestPauseSection && d.longestPauseDuration > 15) {
      messages.push('// ' + Math.round(d.longestPauseDuration) + 's on ' +
        d.longestPauseSection + '. the section is aware.');
    }

    return messages;
  }

  function getChatContext() {
    var d = get();
    var lines = [];

    lines.push('OBSERVER DATA (for Jake\'s awareness \u2014 use sparingly, never quote directly):');

    if (d.isLateNight) lines.push('- It is very late where the reader is (' + d.arrivalHour + ':00 range)');
    else if (d.isNight) lines.push('- It is evening/night where the reader is');
    else if (d.isDawn) lines.push('- The reader arrived at dawn');

    if (d.isReturn) {
      lines.push('- This is visit #' + d.visitCount + ' \u2014 the reader has been here before');
      if (d.daysSinceLastVisit !== null) lines.push('- Days since last visit: ' + d.daysSinceLastVisit);
    } else {
      lines.push('- This is the reader\'s first visit');
    }

    if (d.scrollVelocity === 'deliberate') lines.push('- The reader read the story slowly, deliberately');
    else if (d.scrollVelocity === 'rushing') lines.push('- The reader scrolled through quickly');

    if (d.longestPauseSection) {
      lines.push('- The reader paused longest on: ' + d.longestPauseSection);
    }

    if (d.isSmallScreen) lines.push('- Reading on a small screen (phone)');

    if (d.hasScrolledBack) lines.push('- The reader scrolled back to re-read something');

    lines.push('- Chat messages so far: ' + d.chatMessageCount);

    return lines.join('\n');
  }

  return {
    init: init,
    get: get,
    getAmbientHints: getAmbientHints,
    getSystemMessage: getSystemMessage,
    getChatContext: getChatContext,
    registerChatMessage: registerChatMessage
  };

})();
