/* ═══════════════════════════════════════════════════════════════
   THE EXCHANGE — USAJobs API Integration
   Real-time federal job search via the USAJobs public API.
   Calls are proxied through the Cloudflare Worker to protect
   the API key and satisfy CORS requirements.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.USAJobs = (function () {

  // ── State ──
  var lastSearchParams = null;
  var cachedResults = [];
  var searchCount = 0;

  // ── Configuration ──
  var RESULTS_PER_PAGE = 25;
  var MAX_RESULTS = 50;


  /**
   * Get the proxy base URL from config.
   * USAJobs requests go through the same Cloudflare Worker proxy.
   */
  function getProxyUrl() {
    var config = window.COMPANION_CONFIG;
    if (config && config.proxyUrl) {
      return config.proxyUrl.replace(/\/$/, '');
    }
    return '';
  }


  /**
   * Search USAJobs via the proxy.
   * @param {Object} params - Search parameters.
   * @param {string} [params.keyword] - Free-text keyword search.
   * @param {string} [params.positionTitle] - Job title filter.
   * @param {string} [params.locationName] - City/state location.
   * @param {number} [params.salaryMin] - Minimum salary.
   * @param {number} [params.salaryMax] - Maximum salary.
   * @param {number} [params.resultsPerPage] - Number of results (max 50).
   * @param {number} [params.page] - Page number.
   * @returns {Promise<Object>} - { jobs: [...], total: N, error: null }
   */
  async function search(params) {
    var proxyUrl = getProxyUrl();
    if (!proxyUrl) {
      return { jobs: [], total: 0, error: 'No proxy configured for USAJobs.' };
    }

    // Build query string
    var queryParts = [];

    if (params.keyword) {
      queryParts.push('Keyword=' + encodeURIComponent(params.keyword));
    }
    if (params.positionTitle) {
      queryParts.push('PositionTitle=' + encodeURIComponent(params.positionTitle));
    }
    if (params.locationName) {
      queryParts.push('LocationName=' + encodeURIComponent(params.locationName));
    }
    if (params.salaryMin) {
      queryParts.push('RemunerationMinimumAmount=' + encodeURIComponent(params.salaryMin));
    }
    if (params.salaryMax) {
      queryParts.push('RemunerationMaximumAmount=' + encodeURIComponent(params.salaryMax));
    }

    var perPage = Math.min(params.resultsPerPage || RESULTS_PER_PAGE, MAX_RESULTS);
    queryParts.push('ResultsPerPage=' + perPage);

    if (params.page && params.page > 1) {
      queryParts.push('Page=' + params.page);
    }

    // Only show jobs open to the public
    queryParts.push('WhoMayApply=public');

    var url = proxyUrl + '/api/usajobs/search?' + queryParts.join('&');

    try {
      var response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        var errorText = await response.text();
        console.error('[USAJobs] Search failed:', response.status, errorText);
        return { jobs: [], total: 0, error: 'USAJobs search failed (' + response.status + ').' };
      }

      var data = await response.json();
      var jobs = transformResults(data);

      // Cache results
      cachedResults = jobs;
      lastSearchParams = params;
      searchCount++;

      return {
        jobs: jobs,
        total: data.totalCount || jobs.length,
        error: null
      };

    } catch (e) {
      console.error('[USAJobs] Search error:', e);
      return { jobs: [], total: 0, error: 'Could not reach USAJobs. ' + e.message };
    }
  }


  /**
   * Transform USAJobs API response into Exchange job format.
   * Maps federal job data to a normalized structure.
   */
  function transformResults(apiResponse) {
    if (!apiResponse || !apiResponse.items || !Array.isArray(apiResponse.items)) {
      return [];
    }

    return apiResponse.items.map(function (item, index) {
      // Parse salary from remuneration data
      var salary = parseSalary(item.salaryMin, item.salaryMax);

      // Build a description from the qualification summary
      var description = item.qualificationSummary || '';
      if (description.length > 300) {
        description = description.substring(0, 297) + '...';
      }

      // Determine category from job series or title
      var category = categorizeJob(item.title, item.departmentName, item.jobCategory);

      return {
        id: 'USAJOBS-' + (item.positionId || index),
        title: item.title || 'Federal Position',
        company: item.organizationName || item.departmentName || 'U.S. Federal Government',
        department: item.departmentName || '',
        city: item.city || '',
        state: item.state || '',
        zip: item.zip || '',
        salary: salary,
        salaryRange: item.salaryDisplay || '',
        description: description,
        category: category,
        grade: item.grade || '',
        schedule: item.schedule || '',
        applyUrl: item.applyUrl || '',
        positionUrl: item.positionUrl || '',
        openDate: item.openDate || '',
        closeDate: item.closeDate || '',
        isUSAJobs: true
      };
    });
  }


  /**
   * Parse salary from min/max values. Returns the midpoint or min.
   */
  function parseSalary(min, max) {
    var minVal = parseFloat(min) || 0;
    var maxVal = parseFloat(max) || 0;

    if (minVal > 0 && maxVal > 0) {
      return Math.round((minVal + maxVal) / 2);
    }
    if (minVal > 0) return Math.round(minVal);
    if (maxVal > 0) return Math.round(maxVal);
    return 0;
  }


  /**
   * Categorize a federal job into Exchange categories based on title/department.
   */
  function categorizeJob(title, department, jobCategory) {
    var text = ((title || '') + ' ' + (department || '') + ' ' + (jobCategory || '')).toLowerCase();

    if (/nurse|medical|health|hospital|clinic|pharm|therap|doctor|physician|dental|mental/.test(text)) {
      return 'healthcare';
    }
    if (/software|engineer|developer|data|cyber|security|information technology|IT specialist|computer/.test(text)) {
      return 'technology';
    }
    if (/teach|professor|education|school|instructor|academic|student/.test(text)) {
      return 'education';
    }
    if (/account|financ|budget|audit|tax|bank|econom/.test(text)) {
      return 'finance';
    }
    if (/mechanic|electrician|maintenance|plumb|weld|construct|hvac|carpenter/.test(text)) {
      return 'trades';
    }
    if (/logistic|supply|transport|warehouse|shipping|fleet/.test(text)) {
      return 'logistics';
    }
    if (/writer|design|creative|media|communicat|public affairs|marketing/.test(text)) {
      return 'creative';
    }
    if (/social work|counsel|program|grant|nonprofit|community/.test(text)) {
      return 'nonprofit';
    }

    return 'government';
  }


  /**
   * Extract search terms from a conversation message.
   * Pulls out location and job-related keywords.
   * @param {string} text - User message text.
   * @param {string[]} [conversationContext] - Previous messages for context.
   * @returns {Object} - { keyword, locationName }
   */
  function extractSearchTerms(text, conversationContext) {
    var combined = text;
    if (conversationContext && conversationContext.length > 0) {
      combined = conversationContext.slice(-4).join(' ') + ' ' + text;
    }

    // ── Extract location (case-insensitive) ──
    var locationName = '';

    // Pattern 1: "City, ST" or "City, State" (e.g. "Denver, CO" or "Austin, Texas")
    var cityStateMatch = combined.match(/([A-Za-z][A-Za-z .]+),\s*([A-Z]{2})\b/);
    if (!cityStateMatch) {
      cityStateMatch = combined.match(/([A-Za-z][A-Za-z .]+),\s*([A-Za-z]{4,})/);
    }
    if (cityStateMatch) {
      locationName = cityStateMatch[0].trim();
    }

    // Pattern 2: preposition + place name (e.g. "in Denver", "near Austin", "from New York")
    if (!locationName) {
      var prepMatch = combined.match(/(?:in|near|around|from|based in|located in|live in|living in|moved to|moving to)\s+([A-Za-z][A-Za-z .]+?)(?:\s*[.,;!?]|\s+(?:and|but|or|i |my |the |doing|looking|work|for|area|region)|\s*$)/i);
      if (prepMatch) {
        locationName = prepMatch[1].trim();
      }
    }

    // Pattern 3: US state names (standalone)
    if (!locationName) {
      var states = /\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b/i;
      var stateMatch = combined.match(states);
      if (stateMatch) {
        locationName = stateMatch[1].trim();
      }
    }

    // ── Extract job-related keywords ──
    // Remove only the most basic stop words; keep domain terms like "work", "engineer", etc.
    var stopWords = /\b(i|im|me|my|am|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|shall|may|might|can|the|a|an|and|but|or|nor|for|so|yet|to|of|in|on|at|by|with|from|into|through|during|before|after|above|below|between|out|off|over|under|about|against|not|no|this|that|these|those|it|its|him|her|his|she|he|they|them|their|we|us|our|you|your|what|which|who|whom|where|when|how|why|all|each|every|both|few|more|most|some|any|such|than|too|very|just|also|now|here|there|then|if|like|find|something|think|know|need|really|currently|right|good|great|new|make|get|got|going|been|ago|done|lot|kind|pretty|much|thing|things|stuff|way|trying|try|looking|want|area|region|moved|moving|live|living|based|located)\b/gi;

    var keywords = combined
      .replace(new RegExp(locationName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ')
      .replace(/[^\w\s-]/g, ' ')
      .replace(stopWords, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Take the most relevant terms (first 4 words — less is better for USAJobs)
    var terms = keywords.split(' ').filter(function (w) {
      return w.length > 2;
    });
    var keyword = terms.slice(0, 4).join(' ');

    return {
      keyword: keyword || '',
      locationName: locationName || ''
    };
  }


  /**
   * Cascading search: tries progressively broader queries until results are found.
   * 1. keyword + location
   * 2. location only (all jobs in that area)
   * 3. keyword only (all matching jobs nationwide)
   * 4. broad search (recent openings, no filters)
   *
   * @param {Object} terms - { keyword, locationName }
   * @param {number} [perPage] - Results per page
   * @returns {Promise<Object>} - { jobs, total, error, searchUsed }
   */
  async function cascadingSearch(terms, perPage) {
    perPage = perPage || 25;

    // Build a list of search strategies, most specific first
    var strategies = [];

    if (terms.keyword && terms.locationName) {
      strategies.push({
        label: 'keyword + location',
        params: { keyword: terms.keyword, locationName: terms.locationName, resultsPerPage: perPage }
      });
    }
    if (terms.locationName) {
      strategies.push({
        label: 'location only',
        params: { locationName: terms.locationName, resultsPerPage: perPage }
      });
    }
    if (terms.keyword) {
      strategies.push({
        label: 'keyword only',
        params: { keyword: terms.keyword, resultsPerPage: perPage }
      });
    }
    // Final fallback: recent postings, public, sorted by date
    strategies.push({
      label: 'recent openings',
      params: { resultsPerPage: perPage }
    });

    for (var i = 0; i < strategies.length; i++) {
      var strategy = strategies[i];
      var result = await search(strategy.params);

      if (result.error) {
        // API-level error — don't retry, just return
        return result;
      }

      if (result.jobs.length > 0) {
        result.searchUsed = strategy.label;
        return result;
      }
    }

    // All strategies exhausted (shouldn't happen since last is unfiltered)
    return { jobs: [], total: 0, error: null, searchUsed: 'none' };
  }


  /**
   * Format live job results for the system prompt.
   * @param {Array} jobs - Transformed USAJobs results.
   * @returns {string} Formatted text for the system prompt.
   */
  function formatForPrompt(jobs) {
    if (!jobs || jobs.length === 0) {
      return '';
    }

    var lines = [
      '## LIVE USAJobs Federal Listings (' + jobs.length + ' current openings)',
      '',
      'These are REAL federal job postings from USAJobs.gov, live right now.',
      'These are the ONLY job listings available. Reference ONLY these when discussing specific roles.',
      'When referencing these jobs, note they are federal positions with benefits.',
      '',
      'Format: ID | Title | Agency | City, State | Salary | Grade | Category',
      '---'
    ];

    for (var i = 0; i < jobs.length; i++) {
      var j = jobs[i];
      var salary = j.salaryRange || (j.salary ? '$' + Number(j.salary).toLocaleString() : 'See posting');
      var location = (j.city || 'Various') + ', ' + (j.state || 'US');
      lines.push(
        j.id + ' | ' + j.title + ' | ' + j.company +
        ' | ' + location + ' | ' + salary +
        ' | ' + (j.grade || 'N/A') + ' | ' + j.category
      );
    }

    lines.push('---');
    lines.push('');
    lines.push('### Job Details (for The Insider to embody)');
    lines.push('');

    for (var k = 0; k < jobs.length; k++) {
      var job = jobs[k];
      var detail = job.id + ' — ' + job.title + ' at ' + job.company;
      if (job.department && job.department !== job.company) {
        detail += ' (' + job.department + ')';
      }
      detail += ': ' + (job.description || 'Federal position. See posting for details.');
      if (job.schedule) detail += ' Schedule: ' + job.schedule + '.';
      if (job.closeDate) detail += ' Closes: ' + job.closeDate + '.';
      if (job.applyUrl) detail += ' Apply: ' + job.applyUrl;
      lines.push(detail);
    }

    return lines.join('\n');
  }


  /**
   * Get cached results from the last search.
   */
  function getCachedResults() {
    return cachedResults.slice();
  }

  /**
   * Get the number of searches performed this session.
   */
  function getSearchCount() {
    return searchCount;
  }

  /**
   * Find a job by ID in the cached results.
   */
  function findJobById(id) {
    for (var i = 0; i < cachedResults.length; i++) {
      if (cachedResults[i].id === id) return cachedResults[i];
    }
    return null;
  }

  /**
   * Find a job by title (fuzzy match) in cached results.
   */
  function findJobByTitle(title) {
    if (!title) return null;
    var lower = title.toLowerCase();
    for (var i = 0; i < cachedResults.length; i++) {
      if (cachedResults[i].title.toLowerCase().indexOf(lower) !== -1 ||
          lower.indexOf(cachedResults[i].title.toLowerCase()) !== -1) {
        return cachedResults[i];
      }
    }
    return null;
  }


  // ── Public API ──
  return {
    search: search,
    cascadingSearch: cascadingSearch,
    extractSearchTerms: extractSearchTerms,
    formatForPrompt: formatForPrompt,
    getCachedResults: getCachedResults,
    getSearchCount: getSearchCount,
    findJobById: findJobById,
    findJobByTitle: findJobByTitle
  };

})();
