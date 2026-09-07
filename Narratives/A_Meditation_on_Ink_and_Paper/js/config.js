/* ═══════════════════════════════════════════════════════════════
   A MEDITATION ON THE NECESSITY OF INK AND PAPER IN A SILICON-MAD WORLD
   Deployment Configuration

   Proxy mode. The Anthropic API key lives server-side in the
   Cloudflare Worker. Nothing secret in the browser.

   This file is committed (no secrets, just the worker URL) so it
   deploys with the site. Cloudflare Pages regenerates it at build
   time from COMPANION_PROXY_URL (see build.sh).

   The interview holds no browser storage. The safeguards below are
   enforced in memory only, for the length of one reading. A reload
   returns the reader to the dark screen.
   ═══════════════════════════════════════════════════════════════ */

window.COMPANION_CONFIG = {
  proxyUrl: 'https://companion.jethomasphd.workers.dev',
  safeguards: {
    // A fail-safe, not a clock. The King ends the interview himself in
    // six to nine exchanges, so this should never be the thing that
    // sends him back to the table.
    maxReaderTurns: 12,
    cooldownSeconds: 0
  }
};
