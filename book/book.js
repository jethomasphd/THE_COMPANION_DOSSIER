(() => {
  "use strict";
  const config = window.BOOK_CONFIG || {};
  let amazon = null;
  try {
    const candidate = new URL(config.amazonUrl);
    const allowed = /(^|\.)amazon\.(com|co\.uk|ca|com\.au|de|fr|es|it|nl|co\.jp|in|com\.br|com\.mx|se|pl|com\.be|ie|sg|ae|sa|com\.tr)$/i;
    if (candidate.protocol === "https:" && (allowed.test(candidate.hostname) || candidate.hostname === "amzn.to")) amazon = candidate.href;
  } catch (_) { /* An empty setting is the normal prepublication state. */ }
  if (amazon) {
    const link = document.getElementById("amazon-link");
    link.href = amazon;
    link.hidden = false;
    link.dataset.event = "amazon_click";
    link.dataset.placement = "edition";
    document.getElementById("print-status").hidden = true;
    document.querySelectorAll("[data-print-cta]").forEach(el => {
      el.href = amazon;
      el.innerHTML = 'View the book on Amazon <span aria-hidden="true">↗</span>';
      el.dataset.event = "amazon_click";
      el.dataset.placement = "hero";
    });
    document.querySelectorAll("[data-availability]").forEach(el => el.textContent = "COLOR HARDCOVER · DIGITAL EDITION FREE");
  }
  // Optional first-party integration hook. No network calls, cookies, or storage.
  const query = new URLSearchParams(location.search);
  const campaign = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(key => {
    if (query.has(key)) campaign[key] = query.get(key).slice(0,160);
  });
  function event(name, extra = {}) {
    window.dispatchEvent(new CustomEvent("book:engagement", {detail:{name, ...campaign, ...extra}}));
  }
  document.addEventListener("click", e => {
    const link = e.target.closest("a[data-event]");
    if (link) event(link.dataset.event, {placement:link.dataset.placement});
  });
  const trailer = document.getElementById("book-trailer");
  if (trailer) trailer.addEventListener("play", () => event("trailer_play"), {once:true});
})();
