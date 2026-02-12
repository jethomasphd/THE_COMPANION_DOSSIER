/* ═══════════════════════════════════════════════════════════════
   THE FIVE LAMPS — Deployment Configuration (TEMPLATE)

   Copy this file to config.js and add your live API key.
   config.js is gitignored and will never be committed.

   If config.js is absent, the container falls back to
   asking the user for their own key (The Binding screen).
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  // Your Anthropic API key. Keep this secret.
  apiKey: '',

  // Safeguards — adjust these for your deployment.
  safeguards: {
    maxMessagesPerSession: 60,    // Hard cap on messages per session
    maxSessionsPerDay: 20,        // Hard cap on new sessions per day (per browser)
    cooldownSeconds: 3,           // Minimum seconds between API calls
    sessionTimeoutMinutes: 180    // Auto-expire session after N minutes
  }
};
