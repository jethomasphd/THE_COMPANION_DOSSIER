/* ═══════════════════════════════════════════════════════════════
   THE FIVE LAMPS — Deployment Configuration (TEMPLATE)

   Copy this file to config.js and configure for your deployment.
   config.js is gitignored and will never be committed.

   Two modes:
     1. PROXY (recommended): Set proxyUrl to your Cloudflare Worker.
        The API key lives server-side. Nothing secret in the browser.
     2. DIRECT: Set apiKey here. Key is in browser JS (spend-limit it).

   If config.js is absent, the container falls back to
   asking the user for their own key (The Binding screen).
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  // OPTION 1 — Proxy mode (recommended).
  proxyUrl: '',  // e.g. 'https://companion.yourname.workers.dev'

  // OPTION 2 — Direct mode (if no proxy).
  apiKey: '',

  // Safeguards
  safeguards: {
    maxMessagesPerSession: 60,
    maxSessionsPerDay: 20,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 180
  }
};
