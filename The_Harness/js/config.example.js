/* ═══════════════════════════════════════════════════════════════
   THE HARNESS — Deployment Configuration (TEMPLATE)

   Copy this file to config.js and configure for your deployment.

   Two modes:
     1. PROXY (recommended): Set proxyUrl to your Cloudflare Worker.
        The API key lives server-side. Nothing secret in the browser.
     2. DIRECT: Set apiKey here. The key is in browser JS (spend-limit it).

   If config.js is absent, The Harness falls back to asking the
   seeker for their own key (the Binding screen).
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  // OPTION 1 — Proxy mode (recommended).
  proxyUrl: '',  // e.g. 'https://companion.yourname.workers.dev'

  // OPTION 2 — Direct mode (if no proxy). Spend-limit this key.
  apiKey: '',

  // Safeguards (enforced client-side when pre-configured).
  safeguards: {
    maxMessagesPerSession: 60,
    maxSessionsPerDay: 20,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 180
  }
};
