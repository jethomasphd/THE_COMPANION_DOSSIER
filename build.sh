#!/bin/sh
# ═══════════════════════════════════════════════════════════════
# COMPANION — Cloudflare Pages Build Script
#
# Cloudflare Pages runs this at deploy time.
# It generates the config.js files from environment variables
# set in the Cloudflare Pages dashboard.
#
# Required environment variable:
#   COMPANION_PROXY_URL — Your Cloudflare Worker proxy URL
#                         e.g. https://companion.yourname.workers.dev
# ═══════════════════════════════════════════════════════════════

set -e

if [ -z "$COMPANION_PROXY_URL" ]; then
  echo "WARNING: COMPANION_PROXY_URL not set. Containers will use BYO-key mode."
  exit 0
fi

echo "Generating config.js for all containers..."
echo "Proxy URL: $COMPANION_PROXY_URL"

# The Exchange
cat > The_Exchange/js/config.js << JSEOF
window.COMPANION_CONFIG = {
  proxyUrl: '${COMPANION_PROXY_URL}',
  safeguards: {
    maxMessagesPerSession: 50,
    maxSessionsPerDay: 20,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 120
  }
};
JSEOF
echo "  -> The_Exchange/js/config.js"

# The Five Lamps
cat > The_5_Lamps/js/config.js << JSEOF
window.COMPANION_CONFIG = {
  proxyUrl: '${COMPANION_PROXY_URL}',
  safeguards: {
    maxMessagesPerSession: 60,
    maxSessionsPerDay: 20,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 180
  }
};
JSEOF
echo "  -> The_5_Lamps/js/config.js"

# The Chair
cat > The_Chair/js/config.js << JSEOF
window.COMPANION_CONFIG = {
  proxyUrl: '${COMPANION_PROXY_URL}',
  safeguards: {
    maxMessagesPerSession: 60,
    maxSessionsPerDay: 20,
    cooldownSeconds: 3,
    sessionTimeoutMinutes: 180
  }
};
JSEOF
echo "  -> The_Chair/js/config.js"

echo "Done. All containers configured for proxy mode."
