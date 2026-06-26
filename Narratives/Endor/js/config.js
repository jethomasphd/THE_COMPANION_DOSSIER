/* ═══════════════════════════════════════════════════════════════
   ENDOR PROTOCOL · Deployment Configuration

   Proxy mode. The Anthropic API key lives server-side in the
   Cloudflare Worker. Nothing secret in the browser.

   This file is committed (no secrets, just the worker URL) so it
   deploys with the site. Cloudflare Pages regenerates it at build
   time from COMPANION_PROXY_URL (see build.sh).

   ENDOR holds no browser storage. The safeguards below are enforced
   in memory only, for the length of one summoning. A reload returns
   the reader to the door.
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  proxyUrl: 'https://companion.jethomasphd.workers.dev',
  safeguards: {
    // The chamber has no clock. This ceiling is a fail-safe, not a
    // clock: it exists only so the room can never trap the reader if
    // something goes wrong upstream. Alex reaching the release is the
    // real ending, and it comes long before this.
    maxReaderTurns: 20,
    cooldownSeconds: 0
  }
};
