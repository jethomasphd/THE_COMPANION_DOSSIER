(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lines = [
    { id: 'line1', text: 'What if AI didn’t replace you—', speed: 45, pause: 600 },
    { id: 'line2', text: 'but gave you access to minds you could <em>never</em> reach?', speed: 40, pause: 1200 },
    { id: 'line3', text: 'Washington. Einstein. da Vinci. Rockefeller.', speed: 50, pause: 1000 },
    { id: 'line4', text: 'COMPANION', speed: 100, pause: 0 }
  ];
  let introTimer;
  let introFinished = false;
  const proceed = document.getElementById('proceed');
  function finishIntro() {
    introFinished = true;
    window.clearTimeout(introTimer);
    lines.forEach((line) => {
      const element = document.getElementById(line.id);
      element.innerHTML = line.text;
      element.classList.add('typed');
    });
    proceed.classList.add('visible');
  }
  function typeLine(index) {
    if (introFinished) return;
    if (index === lines.length) { introTimer = window.setTimeout(finishIntro, 800); return; }
    const line = lines[index];
    const element = document.getElementById(line.id);
    element.classList.add('typed');
    let position = 0;
    function tick() {
      if (introFinished) return;
      if (position < line.text.length) {
        position = line.text[position] === '<' ? line.text.indexOf('>', position) + 1 : position + 1;
        element.innerHTML = line.text.slice(0, position) + '<span class="cursor" aria-hidden="true"></span>';
        introTimer = window.setTimeout(tick, line.speed);
      } else {
        introTimer = window.setTimeout(() => {
          element.innerHTML = line.text;
          introTimer = window.setTimeout(() => typeLine(index + 1), line.pause);
        }, 300);
      }
    }
    tick();
  }
  lines.forEach((line) => {
    const element = document.getElementById(line.id);
    element.setAttribute('aria-label', element.textContent);
    element.textContent = '';
  });
  if (reducedMotion.matches || (location.hash && location.hash !== '#void')) finishIntro();
  else introTimer = window.setTimeout(() => typeLine(0), 1000);
  document.querySelectorAll('.intro-skip,.skip-link').forEach((link) => link.addEventListener('click', finishIntro));
  reducedMotion.addEventListener('change', (event) => { if (event.matches) finishIntro(); });
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  function closeMenu() { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
  });
  const tabs = Array.from(document.querySelectorAll('[data-example]'));
  const panels = Array.from(document.querySelectorAll('.example-panel'));
  const copyStatus = document.getElementById('copy-status');
  let activeExample = 'decision';
  function activateExample(tab, focus) {
    activeExample = tab.dataset.example;
    tabs.forEach((item) => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
    panels.forEach((panel) => { panel.hidden = panel.id !== 'example-' + activeExample; });
    copyStatus.textContent = '';
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateExample(tab, false));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateExample(tabs[next], true); }
    });
  });
  document.getElementById('copy-example').addEventListener('click', async () => {
    const example = document.querySelector('#example-' + activeExample + ' blockquote');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(example.textContent.trim());
      copyStatus.textContent = 'Copied. Select the named perspectives in The Harness, then paste into the conversation.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(example);
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'Prompt selected. Use your device’s Copy command.';
    }
  });
})();
