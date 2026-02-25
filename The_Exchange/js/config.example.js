/* ═══════════════════════════════════════════════════════════════
   THE EXCHANGE — Deployment Configuration (TEMPLATE)

   Copy this file to config.js and configure for your deployment.
   config.js is gitignored and will never be committed.

   Two modes:
     1. PROXY (recommended): Set proxyUrl to your Cloudflare Worker.
        The API key lives server-side. Nothing secret in the browser.
        The proxy also handles USAJobs API calls (requires server-side
        USAJOBS_API_KEY and USAJOBS_EMAIL secrets on the worker).
     2. DIRECT: Set apiKey here. Key is in browser JS (spend-limit it).
        Note: USAJobs integration requires proxy mode.

   If config.js is absent, the container falls back to
   asking the user for their own key (The Binding screen).

   USAJobs API Setup:
     1. Request an API key at https://developer.usajobs.gov/APIRequest/Index
     2. Set the key and email as Cloudflare Worker secrets:
        npx wrangler secret put USAJOBS_API_KEY
        npx wrangler secret put USAJOBS_EMAIL
     3. Deploy the worker: npx wrangler deploy
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  // OPTION 1 — Proxy mode (recommended).
  // Your Cloudflare Worker URL. Key stays server-side.
  proxyUrl: '',  // e.g. 'https://companion.yourname.workers.dev'

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
