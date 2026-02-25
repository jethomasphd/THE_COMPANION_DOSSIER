/* ═══════════════════════════════════════════════════════════════
   COMPANION — API Proxy + Letter Submissions (Cloudflare Worker)

   Routes:
     POST /v1/messages       — Anthropic API proxy (existing)
     GET  /api/usajobs/search — USAJobs API proxy (new)
     POST /api/submit        — Receive Take_Action letter submissions
     GET  /admin             — Admin dashboard (requires ?key=ADMIN_KEY)
     POST /api/status        — Update submission status (requires key)

   Secrets (set via wrangler secret put):
     ANTHROPIC_API_KEY       — Anthropic API key
     ADMIN_KEY               — Protects the admin dashboard
     USAJOBS_API_KEY         — USAJobs API authorization key
     USAJOBS_EMAIL           — Email used as User-Agent for USAJobs API

   KV Namespace:
     SUBMISSIONS             — Stores letter submissions

   Deploy with: npx wrangler deploy
   ═══════════════════════════════════════════════════════════════ */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

const ALLOWED_MODELS = [
  'claude-opus-4-6',
  'claude-sonnet-4-6',
  'claude-haiku-4-5-20251001',
  'claude-sonnet-4-20250514',
  'claude-opus-4-20250514',
  'claude-haiku-3-5-20241022'
];

const MAX_TOKENS_CEILING = 4096;
const MAX_MESSAGES = 80;
const MAX_BODY_BYTES = 200000;


// ── Entry Point ──

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return handlePreflight(request, env);
    }

    // ── Route: Anthropic API Proxy ──
    if (url.pathname === '/v1/messages' && request.method === 'POST') {
      return handleProxy(request, env);
    }

    // ── Route: USAJobs API Proxy ──
    if (url.pathname === '/api/usajobs/search' && request.method === 'GET') {
      return handleUSAJobsSearch(request, url, env);
    }

    // ── Route: Submit letter entry ──
    if (url.pathname === '/api/submit' && request.method === 'POST') {
      return handleSubmit(request, env);
    }

    // ── Route: Admin dashboard ──
    if (url.pathname === '/admin' && request.method === 'GET') {
      return handleAdmin(url, env);
    }

    // ── Route: Update submission status ──
    if (url.pathname === '/api/status' && request.method === 'POST') {
      return handleStatusUpdate(request, url, env);
    }

    // ── Route: Get submission detail ──
    if (url.pathname === '/api/detail' && request.method === 'GET') {
      return handleDetail(url, env);
    }

    return errorResponse(404, 'Not found.');
  }
};


// ═══════════════════════════════════════════════════════════════
// ANTHROPIC PROXY (unchanged logic)
// ═══════════════════════════════════════════════════════════════

async function handleProxy(request, env) {
  const origin = request.headers.get('Origin') || '';
  if (!isAllowedOrigin(origin, env)) {
    return errorResponse(403, 'Origin not allowed.');
  }

  const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse(413, 'Request body too large.');
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return errorResponse(400, 'Invalid JSON.');
  }

  if (!body.model || !ALLOWED_MODELS.includes(body.model)) {
    return errorResponse(400, 'Model not allowed: ' + (body.model || 'none'));
  }

  if (!body.max_tokens || body.max_tokens > MAX_TOKENS_CEILING) {
    body.max_tokens = MAX_TOKENS_CEILING;
  }

  if (body.messages && body.messages.length > MAX_MESSAGES) {
    return errorResponse(400, 'Too many messages (' + body.messages.length + '). Max: ' + MAX_MESSAGES + '.');
  }

  if (!env.ANTHROPIC_API_KEY) {
    return errorResponse(500, 'Proxy misconfigured: no API key.');
  }

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

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, anthropic-version');

    const ct = anthropicResponse.headers.get('Content-Type');
    if (ct) headers.set('Content-Type', ct);

    return new Response(anthropicResponse.body, {
      status: anthropicResponse.status,
      headers: headers
    });
  } catch (fetchError) {
    return errorResponse(502, 'Failed to reach Anthropic API.');
  }
}


// ═══════════════════════════════════════════════════════════════
// USAJOBS API PROXY
// ═══════════════════════════════════════════════════════════════

const USAJOBS_API_URL = 'https://data.usajobs.gov/api/search';

// Allowed USAJobs query parameters (whitelist for security)
const USAJOBS_ALLOWED_PARAMS = [
  'Keyword', 'PositionTitle', 'LocationName', 'RemunerationMinimumAmount',
  'RemunerationMaximumAmount', 'PayGradeLow', 'PayGradeHigh', 'JobCategoryCode',
  'Organization', 'PositionOfferingTypeCode', 'PositionScheduleTypeCode',
  'DatePosted', 'SortField', 'SortDirection', 'Page', 'ResultsPerPage',
  'WhoMayApply', 'Radius', 'Fields', 'HiringPath', 'RemoteIndicator'
];

async function handleUSAJobsSearch(request, url, env) {
  const origin = request.headers.get('Origin') || '';
  if (!isAllowedOrigin(origin, env)) {
    return errorResponse(403, 'Origin not allowed.');
  }

  if (!env.USAJOBS_API_KEY || !env.USAJOBS_EMAIL) {
    return corsJson(origin, 500, { error: 'USAJobs API not configured. Set USAJOBS_API_KEY and USAJOBS_EMAIL secrets.' });
  }

  // Build sanitized query string from allowed parameters only
  const queryParts = [];
  for (const param of USAJOBS_ALLOWED_PARAMS) {
    const value = url.searchParams.get(param);
    if (value !== null && value !== '') {
      queryParts.push(param + '=' + encodeURIComponent(value));
    }
  }

  const usajobsUrl = USAJOBS_API_URL + (queryParts.length > 0 ? '?' + queryParts.join('&') : '');

  try {
    const usajobsResponse = await fetch(usajobsUrl, {
      method: 'GET',
      headers: {
        'Host': 'data.usajobs.gov',
        'User-Agent': env.USAJOBS_EMAIL,
        'Authorization-Key': env.USAJOBS_API_KEY
      }
    });

    if (!usajobsResponse.ok) {
      const errText = await usajobsResponse.text();
      console.error('USAJobs API error:', usajobsResponse.status, errText);
      return corsJson(origin, usajobsResponse.status, {
        error: 'USAJobs API returned ' + usajobsResponse.status
      });
    }

    const data = await usajobsResponse.json();

    // Transform the response to a lighter format for the client
    const result = transformUSAJobsResponse(data);

    return corsJson(origin, 200, result);

  } catch (fetchError) {
    console.error('USAJobs fetch error:', fetchError);
    return corsJson(origin, 502, { error: 'Failed to reach USAJobs API.' });
  }
}

/**
 * Transform raw USAJobs API response into a lighter format.
 * Strips unnecessary fields to reduce payload size.
 */
function transformUSAJobsResponse(data) {
  const searchResult = data.SearchResult || {};
  const items = searchResult.SearchResultItems || [];

  return {
    totalCount: searchResult.SearchResultCountAll || 0,
    returnedCount: searchResult.SearchResultCount || 0,
    items: items.map(function (item) {
      const matched = item.MatchedObjectDescriptor || {};
      const position = matched.PositionLocation || [];
      const remuneration = (matched.PositionRemuneration || [])[0] || {};
      const userArea = matched.UserArea || {};
      const details = userArea.Details || {};

      // Get the first location
      const loc = position[0] || {};

      return {
        positionId: matched.PositionID || '',
        title: matched.PositionTitle || '',
        organizationName: matched.OrganizationName || '',
        departmentName: matched.DepartmentName || '',
        city: loc.CityName || '',
        state: extractState(loc.LocationName || ''),
        zip: loc.PostalCode || '',
        locationName: loc.LocationName || '',
        salaryMin: remuneration.MinimumRange || '',
        salaryMax: remuneration.MaximumRange || '',
        salaryDisplay: (remuneration.MinimumRange && remuneration.MaximumRange)
          ? '$' + Number(remuneration.MinimumRange).toLocaleString('en-US') +
            ' - $' + Number(remuneration.MaximumRange).toLocaleString('en-US') +
            ' ' + (remuneration.RateIntervalCode || 'Per Year')
          : '',
        grade: extractGrade(matched.JobGrade || []),
        schedule: (matched.PositionSchedule || [])[0]?.ScheduleName || '',
        qualificationSummary: matched.QualificationSummary || '',
        jobCategory: ((matched.JobCategory || [])[0] || {}).Name || '',
        applyUrl: (matched.ApplyURI || [])[0] || '',
        positionUrl: matched.PositionURI || '',
        openDate: matched.PublicationStartDate || '',
        closeDate: matched.ApplicationCloseDate || '',
        majorDuties: (details.MajorDuties || []).slice(0, 3)
      };
    })
  };
}

/**
 * Extract state abbreviation from USAJobs location string.
 * e.g. "Denver, Colorado" → "CO"
 */
function extractState(locationName) {
  if (!locationName) return '';
  // USAJobs often returns "City, State" format
  const parts = locationName.split(',');
  if (parts.length >= 2) {
    return parts[parts.length - 1].trim().substring(0, 2).toUpperCase();
  }
  return '';
}

/**
 * Extract grade string from JobGrade array.
 */
function extractGrade(gradeArray) {
  if (!gradeArray || gradeArray.length === 0) return '';
  const g = gradeArray[0] || {};
  if (g.Code && g.Code !== '0') {
    return g.Code;
  }
  return '';
}


// ═══════════════════════════════════════════════════════════════
// LETTER SUBMISSIONS
// ═══════════════════════════════════════════════════════════════

const STATUS_MAP = {
  'self':  'mailed_self',
  'email': 'emailed_self',
  'us':    'needs_mailing'
};

const STATUS_LABELS = {
  'mailed_self':   'Mailed (self)',
  'emailed_self':  'Emailed (self)',
  'needs_mailing': 'Needs mailing',
  'mailed':        'Mailed (by us)'
};

async function handleSubmit(request, env) {
  const origin = request.headers.get('Origin') || '';
  if (!isAllowedOrigin(origin, env)) {
    return errorResponse(403, 'Origin not allowed.');
  }

  if (!env.SUBMISSIONS) {
    return corsJson(origin, 500, { error: 'KV not configured.' });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return corsJson(origin, 400, { error: 'Invalid JSON.' });
  }

  if (!body.name || !body.delivery) {
    return corsJson(origin, 400, { error: 'Missing required fields.' });
  }

  const ts = new Date().toISOString();
  const key = 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const status = STATUS_MAP[body.delivery] || 'needs_mailing';

  const record = {
    name: body.name,
    state: body.state || '',
    stateName: body.stateName || '',
    delivery: body.delivery,
    status: status,
    senators: body.senators || [],
    date: body.date || '',
    email: body.email || '',
    letters: body.letters || [],
    voice: body.voice || '',
    feeling: body.feeling || '',
    extra: body.extra || '',
    ts: ts
  };

  const metadata = {
    name: body.name,
    state: body.state || '',
    delivery: body.delivery,
    status: status,
    ts: ts
  };

  await env.SUBMISSIONS.put(key, JSON.stringify(record), { metadata });

  return corsJson(origin, 200, { ok: true, id: key, status: status });
}


// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════

async function handleAdmin(url, env) {
  const key = url.searchParams.get('key') || '';
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response('Unauthorized. Append ?key=YOUR_ADMIN_KEY to the URL.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  if (!env.SUBMISSIONS) {
    return new Response('KV namespace SUBMISSIONS not bound.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Fetch all submissions (KV list returns keys + metadata)
  let allKeys = [];
  let cursor = null;
  do {
    const opts = { limit: 1000 };
    if (cursor) opts.cursor = cursor;
    const result = await env.SUBMISSIONS.list(opts);
    allKeys = allKeys.concat(result.keys);
    cursor = result.list_complete ? null : result.cursor;
  } while (cursor);

  // Sort newest first
  allKeys.sort(function(a, b) {
    const ta = a.metadata ? a.metadata.ts : a.name;
    const tb = b.metadata ? b.metadata.ts : b.name;
    return ta > tb ? -1 : ta < tb ? 1 : 0;
  });

  // Counts
  const counts = { total: allKeys.length, needs_mailing: 0, mailed_self: 0, emailed_self: 0, mailed: 0 };
  allKeys.forEach(function(k) {
    const s = k.metadata ? k.metadata.status : '';
    if (counts[s] !== undefined) counts[s]++;
  });

  // Build HTML
  const html = renderAdminPage(allKeys, counts, key);

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

async function handleStatusUpdate(request, url, env) {
  const adminKey = url.searchParams.get('key') || '';
  if (!env.ADMIN_KEY || adminKey !== env.ADMIN_KEY) {
    return errorResponse(401, 'Unauthorized.');
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return errorResponse(400, 'Invalid JSON.');
  }

  if (!body.id || !body.status) {
    return errorResponse(400, 'Missing id or status.');
  }

  const existing = await env.SUBMISSIONS.get(body.id, { type: 'json' });
  if (!existing) {
    return errorResponse(404, 'Submission not found.');
  }

  existing.status = body.status;
  const metadata = {
    name: existing.name,
    state: existing.state,
    delivery: existing.delivery,
    status: body.status,
    ts: existing.ts
  };

  await env.SUBMISSIONS.put(body.id, JSON.stringify(existing), { metadata });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}


function renderAdminPage(keys, counts, adminKey) {
  const rows = keys.map(function(k) {
    const m = k.metadata || {};
    const d = m.ts ? new Date(m.ts) : null;
    const dateStr = d ? (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear() : '—';
    const statusClass = m.status === 'needs_mailing' ? 'urgent' : '';
    return '<tr class="'+statusClass+'" data-id="'+esc(k.name)+'">' +
      '<td>'+esc(dateStr)+'</td>' +
      '<td>'+esc(m.name||'—')+'</td>' +
      '<td>'+esc(m.state||'—')+'</td>' +
      '<td>'+esc(deliveryLabel(m.delivery))+'</td>' +
      '<td>' +
        '<select onchange="updateStatus(\''+esc(k.name)+'\',this.value)">' +
          statusOptions(m.status) +
        '</select>' +
      '</td>' +
      '<td><button onclick="viewDetail(\''+esc(k.name)+'\')">View</button></td>' +
    '</tr>';
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Take Action — Admin</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#0a0908;color:#e8e2d4;font-family:'Segoe UI',system-ui,sans-serif;padding:2rem}
  h1{font-size:1.5rem;color:#c9a227;margin-bottom:.3rem}
  .subtitle{color:#999;font-size:.85rem;margin-bottom:1.5rem}
  .counts{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
  .count-card{background:#1a140e;border:1px solid rgba(201,162,39,.15);padding:.8rem 1.2rem;min-width:120px}
  .count-card .num{font-size:1.8rem;font-weight:700;color:#c9a227}
  .count-card .lbl{font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:#999;margin-top:.2rem}
  .count-card.urgent .num{color:#e74c3c}
  table{width:100%;border-collapse:collapse;font-size:.85rem}
  th{text-align:left;padding:.6rem .8rem;border-bottom:2px solid rgba(201,162,39,.2);
    font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:#c9a227}
  td{padding:.6rem .8rem;border-bottom:1px solid rgba(255,255,255,.05)}
  tr.urgent td{background:rgba(231,76,60,.06)}
  tr:hover td{background:rgba(201,162,39,.04)}
  select{background:#1a140e;color:#e8e2d4;border:1px solid rgba(201,162,39,.2);
    padding:.3em .5em;font-size:.8rem;cursor:pointer}
  select:focus{border-color:#c9a227;outline:none}
  button{background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,.25);
    padding:.3em .8em;font-size:.75rem;cursor:pointer;transition:all .2s}
  button:hover{background:rgba(201,162,39,.08);border-color:#c9a227}
  #detail-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:100;
    padding:2rem;overflow-y:auto}
  #detail-overlay.vis{display:block}
  .detail-box{max-width:700px;margin:0 auto;background:#1a140e;border:1px solid rgba(201,162,39,.15);padding:2rem}
  .detail-box h2{color:#c9a227;font-size:1.1rem;margin-bottom:1rem}
  .detail-box pre{white-space:pre-wrap;font-size:.82rem;line-height:1.7;color:#e8e2d4;
    background:rgba(0,0,0,.3);padding:1rem;border:1px solid rgba(201,162,39,.08);margin-bottom:1rem;max-height:50vh;overflow-y:auto}
  .detail-box .meta{font-size:.78rem;color:#999;margin-bottom:.5rem}
  .detail-close{float:right;font-size:1.2rem;cursor:pointer;color:#c9a227;background:none;border:none}
  @media(max-width:700px){
    body{padding:1rem}
    table{font-size:.75rem}
    th,td{padding:.4rem}
  }
</style>
</head>
<body>
<h1>Take Action — Letters</h1>
<p class="subtitle">${counts.total} submission${counts.total===1?'':'s'} collected</p>

<div class="counts">
  <div class="count-card urgent">
    <div class="num">${counts.needs_mailing}</div>
    <div class="lbl">Need mailing</div>
  </div>
  <div class="count-card">
    <div class="num">${counts.mailed}</div>
    <div class="lbl">Mailed by us</div>
  </div>
  <div class="count-card">
    <div class="num">${counts.mailed_self}</div>
    <div class="lbl">Mailed (self)</div>
  </div>
  <div class="count-card">
    <div class="num">${counts.emailed_self}</div>
    <div class="lbl">Emailed (self)</div>
  </div>
</div>

<table>
<thead><tr><th>Date</th><th>Name</th><th>State</th><th>Delivery</th><th>Status</th><th></th></tr></thead>
<tbody>
${rows || '<tr><td colspan="6" style="text-align:center;color:#666;padding:2rem">No submissions yet.</td></tr>'}
</tbody>
</table>

<div id="detail-overlay">
  <div class="detail-box">
    <button class="detail-close" onclick="closeDetail()">&times;</button>
    <h2 id="detail-title"></h2>
    <div id="detail-meta" class="meta"></div>
    <div id="detail-content"></div>
  </div>
</div>

<script>
var ADMIN_KEY = ${JSON.stringify(adminKey)};
var API_BASE = location.origin;

function updateStatus(id, status) {
  fetch(API_BASE + '/api/status?key=' + encodeURIComponent(ADMIN_KEY), {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id: id, status: status})
  }).then(function(r) {
    if (r.ok) location.reload();
    else alert('Failed to update status.');
  });
}

function viewDetail(id) {
  fetch(API_BASE + '/api/detail?key=' + encodeURIComponent(ADMIN_KEY) + '&id=' + encodeURIComponent(id))
    .then(function(r) { return r.json(); })
    .then(function(data) {
      document.getElementById('detail-title').textContent = data.name || 'Submission';
      var meta = (data.stateName || data.state || '') + ' | ' + (data.date || '') + ' | ' + (data.email || 'no email');
      document.getElementById('detail-meta').textContent = meta;
      var content = '';
      if (data.letters && data.letters.length) {
        data.letters.forEach(function(l, i) {
          content += '<pre>' + escHtml(l.body || '') + '</pre>';
        });
      } else {
        content = '<p style="color:#666">No letter content stored.</p>';
      }
      document.getElementById('detail-content').innerHTML = content;
      document.getElementById('detail-overlay').classList.add('vis');
    });
}

function closeDetail() {
  document.getElementById('detail-overlay').classList.remove('vis');
}

function escHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

document.getElementById('detail-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeDetail();
});
</script>
</body>
</html>`;
}

function deliveryLabel(d) {
  return d === 'self' ? 'Self-mail' : d === 'email' ? 'Email' : d === 'us' ? 'Mail for me' : d || '—';
}

function statusOptions(current) {
  var opts = [
    { v: 'mailed_self',   l: 'Mailed (self)' },
    { v: 'emailed_self',  l: 'Emailed (self)' },
    { v: 'needs_mailing', l: 'Needs mailing' },
    { v: 'mailed',        l: 'Mailed (by us)' }
  ];
  return opts.map(function(o) {
    return '<option value="'+o.v+'"'+(o.v===current?' selected':'')+'>'+o.l+'</option>';
  }).join('');
}


// ═══════════════════════════════════════════════════════════════
// DETAIL ENDPOINT (for admin "View" button)
// ═══════════════════════════════════════════════════════════════

async function handleDetail(url, env) {
  const key = url.searchParams.get('key') || '';
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return errorResponse(401, 'Unauthorized.');
  }

  const id = url.searchParams.get('id') || '';
  if (!id) {
    return errorResponse(400, 'Missing id.');
  }

  const data = await env.SUBMISSIONS.get(id, { type: 'json' });
  if (!data) {
    return errorResponse(404, 'Submission not found.');
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}


// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function handlePreflight(request, env) {
  const origin = request.headers.get('Origin') || '';
  if (!isAllowedOrigin(origin, env)) {
    return errorResponse(403, 'Origin not allowed.');
  }

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    { status: status, headers: { 'Content-Type': 'application/json' } }
  );
}

function corsJson(origin, status, data) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
