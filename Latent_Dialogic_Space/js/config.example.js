/* ═══════════════════════════════════════════════════════════════
   LATENT DIALOGIC SPACE — Configuration Template
   Copy to config.js and fill in your values.
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  proxyUrl: '',           // Cloudflare Worker proxy URL (recommended)
  apiKey: '',             // Or direct Anthropic API key
  safeguards: {
    maxMessagesPerSession: 80,
    maxSessionsPerDay: 20,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 180
  }
};
