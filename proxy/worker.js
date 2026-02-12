/* ═══════════════════════════════════════════════════════════════
   COMPANION — API Proxy (Cloudflare Worker)

   A thin security layer between the browser and the Anthropic API.
   The API key lives here as a secret — it never reaches the client.

   Enforces:
     - Origin allowlist (only your domains can call this)
     - Model whitelist (only approved models)
     - Token cap (max_tokens hard ceiling)
     - Message count cap (prevents context-stuffing)
     - Per-IP rate limiting (via Cloudflare dashboard rules)

   Deploy with: npx wrangler deploy
   ═══════════════════════════════════════════════════════════════ */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

// Only these models may be requested through the proxy
const ALLOWED_MODELS = [
  'claude-sonnet-4-20250514',
  'claude-opus-4-20250514',
  'claude-haiku-3-5-20241022'
];

// Hard ceilings
const MAX_TOKENS_CEILING = 4096;
const MAX_MESSAGES = 80;
const MAX_BODY_BYTES = 200000; // ~200 KB request body limit


// ── Entry Point ──

export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return handlePreflight(request, env);
    }

    // Only POST /v1/messages
    if (request.method !== 'POST') {
      return errorResponse(405, 'Method not allowed.');
    }

    const url = new URL(request.url);
    if (url.pathname !== '/v1/messages') {
      return errorResponse(404, 'Not found.');
    }

    // Origin check
    const origin = request.headers.get('Origin') || '';
    if (!isAllowedOrigin(origin, env)) {
      return errorResponse(403, 'Origin not allowed.');
    }

    // Body size check (prevents abuse via enormous payloads)
    const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (contentLength > MAX_BODY_BYTES) {
      return errorResponse(413, 'Request body too large.');
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errorResponse(400, 'Invalid JSON.');
    }

    // Validate model
    if (!body.model || !ALLOWED_MODELS.includes(body.model)) {
      return errorResponse(400, 'Model not allowed: ' + (body.model || 'none'));
    }

    // Enforce token ceiling
    if (!body.max_tokens || body.max_tokens > MAX_TOKENS_CEILING) {
      body.max_tokens = MAX_TOKENS_CEILING;
    }

    // Enforce message count
    if (body.messages && body.messages.length > MAX_MESSAGES) {
      return errorResponse(400, 'Too many messages in conversation (' + body.messages.length + '). Maximum: ' + MAX_MESSAGES + '.');
    }

    // Ensure API key is configured
    if (!env.ANTHROPIC_API_KEY) {
      return errorResponse(500, 'Proxy misconfigured: no API key.');
    }

    // Forward to Anthropic (key injected server-side)
    try {
      const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': ANTHROPIC_VERSION
        },
        body: JSON.stringify(body)
      });

      // Build response headers — stream the Anthropic response directly
      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type, anthropic-version');

      // Preserve Anthropic's content type (text/event-stream for streaming)
      const ct = anthropicResponse.headers.get('Content-Type');
      if (ct) headers.set('Content-Type', ct);

      // Pass through the response body as a stream
      return new Response(anthropicResponse.body, {
        status: anthropicResponse.status,
        headers: headers
      });

    } catch (fetchError) {
      return errorResponse(502, 'Failed to reach Anthropic API.');
    }
  }
};


// ── Helpers ──

function handlePreflight(request, env) {
  const origin = request.headers.get('Origin') || '';
  if (!isAllowedOrigin(origin, env)) {
    return errorResponse(403, 'Origin not allowed.');
  }

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, anthropic-version',
      'Access-Control-Max-Age': '86400'
    }
  });
}

function isAllowedOrigin(origin, env) {
  if (!origin) return false;
  const allowedRaw = env.ALLOWED_ORIGINS || '';
  const allowed = allowedRaw.split(',').map(s => s.trim()).filter(Boolean);
  if (allowed.length === 0) return false;
  return allowed.includes(origin);
}

function errorResponse(status, message) {
  return new Response(
    JSON.stringify({ error: { type: 'proxy_error', message: message } }),
    {
      status: status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
