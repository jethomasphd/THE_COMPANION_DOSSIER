/* ═══════════════════════════════════════════════════════════════
   THE SYMPOSIUM — Configuration Template
   Copy this file to config.js and fill in your values.
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  // Option A: Use the Cloudflare Worker proxy (recommended)
  proxyUrl: 'https://companion.jethomasphd.workers.dev',
  apiKey: '',

  // Option B: Direct API key (not recommended for production)
  // proxyUrl: '',
  // apiKey: 'sk-ant-...',

  safeguards: {
    maxMessagesPerSession: 80,
    maxSessionsPerDay: 20,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 180
  }
};
