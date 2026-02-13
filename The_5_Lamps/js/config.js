/* ═══════════════════════════════════════════════════════════════
   THE FIVE LAMPS — Deployment Configuration

   Proxy mode: API key stays server-side in the Cloudflare Worker.
   Nothing secret in this file.
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
