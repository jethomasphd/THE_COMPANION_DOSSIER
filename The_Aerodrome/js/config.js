/* ═══════════════════════════════════════════════════════════════
   THE AERODROME — Deployment Configuration
   Cloudflare Worker proxy serves the API key server-side.
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  proxyUrl: 'https://companion.jethomasphd.workers.dev',
  apiKey: '',
  safeguards: {
    maxMessagesPerSession: 60,
    maxSessionsPerDay: 20,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 180
  }
};
