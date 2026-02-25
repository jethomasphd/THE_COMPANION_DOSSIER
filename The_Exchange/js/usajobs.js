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
   * Transform USAJobs API response into Exchange job corpus format.
   * Maps federal job data to the same structure as the static corpus.
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
      // Include recent user messages for context
      combined = conversationContext.slice(-4).join(' ') + ' ' + text;
    }

    var lower = combined.toLowerCase();

    // Extract location - look for "in [City]" or "in [City], [State]" or state abbreviations
    var locationName = '';
    var locationPatterns = [
      /(?:in|near|around|from|at|based in|located in|live in|living in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z]{2})?)/g,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/g
    ];

    for (var p = 0; p < locationPatterns.length; p++) {
      var locMatch = combined.match(locationPatterns[p]);
      if (locMatch) {
        locationName = locMatch[locMatch.length - 1]
          .replace(/^(?:in|near|around|from|at|based in|located in|live in|living in)\s+/i, '')
          .trim();
        break;
      }
    }

    // Extract job-related keywords — remove common stop words and location
    var stopWords = /\b(i|me|my|am|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|shall|may|might|can|the|a|an|and|but|or|nor|for|so|yet|to|of|in|on|at|by|with|from|into|through|during|before|after|above|below|between|out|off|over|under|about|against|not|no|this|that|these|those|it|its|him|her|his|she|he|they|them|their|we|us|our|you|your|what|which|who|whom|where|when|how|why|all|each|every|both|few|more|most|some|any|such|than|too|very|just|also|now|here|there|then|if|want|like|looking|look|work|working|find|something|think|know|need|really|been|currently|right|good|great|new|make|get|got|going|job|career|role|position|interested|experience|years|year|ago|done)\b/gi;

    var keywords = combined
      .replace(locationName, '')  // remove location from keyword string
      .replace(/[^\w\s]/g, ' ')  // remove punctuation
      .replace(stopWords, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Take the most relevant terms (first 5-6 words)
    var terms = keywords.split(' ').filter(function (w) {
      return w.length > 2;
    });
    var keyword = terms.slice(0, 6).join(' ');

    return {
      keyword: keyword || '',
      locationName: locationName || ''
    };
  }


  /**
   * Format live job results for the system prompt.
   * Produces a compact text summary matching the static corpus format.
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
      'Prioritize these over the static corpus when they match the seeker\'s interests.',
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
    extractSearchTerms: extractSearchTerms,
    formatForPrompt: formatForPrompt,
    getCachedResults: getCachedResults,
    getSearchCount: getSearchCount,
    findJobById: findJobById,
    findJobByTitle: findJobByTitle
  };

})();
