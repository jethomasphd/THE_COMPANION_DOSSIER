/* ═══════════════════════════════════════════════════════════════
   THE EXCHANGE — Deployment Configuration (TEMPLATE)

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
  // Your Cloudflare Worker URL. Key stays server-side.
  proxyUrl: '',  // e.g. 'https://companion-proxy.yourname.workers.dev'

  // OPTION 2 — Direct mode (if no proxy).
  // Your Anthropic API key. Keep this secret. Set a spend limit.
  apiKey: '',

  // Safeguards — enforced client-side when using a pre-configured key or proxy.
  safeguards: {
    maxMessagesPerSession: 50,    // Hard cap on messages per session
    maxSessionsPerDay: 20,        // Hard cap on new sessions per day (per browser)
    cooldownSeconds: 3,           // Minimum seconds between API calls
    sessionTimeoutMinutes: 120    // Auto-expire session after N minutes
  }
};
