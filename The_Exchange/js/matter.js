/* ═══════════════════════════════════════════════════════════════
   THE EXCHANGE — The Matter Before the Committee
   Content payload for the dialogic job discovery session.
   Includes a fictitious US national labor market corpus
   for the pilot demonstration.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Matter = (function () {

  // ── The Essay: "The Exchange" ──

  var THE_ESSAY = [
    '# The Exchange',
    '## Restoring Mutuality to the Search for Work',
    '*Jacob E. Thomas, PhD — February 2026*',
    '',
    'A labor exchange was once a building.',
    'A physical place where workers and employers found each other.',
    'Not through scrolling. Through encounter.',
    '',
    'The building is gone.',
    'In its place: the Feed.',
    '',
    'The Feed is infinite. It does not know you.',
    'It knows your keywords, your clicks, your dwell time.',
    'It ranks by relevance scores that have nothing to do',
    'with whether you would find meaning in the work.',
    '',
    'The Exchange restores what the Feed destroyed:',
    'a conversation about what you are actually looking for.',
    '',
    '---',
    '',
    '## The Problem',
    '',
    'Job boards treat you as an engagement pattern.',
    'You type keywords. You receive a ranked list.',
    'You scroll. You apply. You hear nothing.',
    'You apply again. The silence accumulates.',
    '',
    'The matching is mechanical: keyword overlap.',
    'The experience is passive: browse, click, submit.',
    'The outcome is statistical: spray and pray.',
    '',
    'This is not searching. This is drowning — slowly,',
    'one listing at a time, in the information flood.',
    '',
    '---',
    '',
    '## The Pattern',
    '',
    'THE EXCHANGE is built on a simple architectural insight:',
    'Personas + Data = Container.',
    '',
    'The COMPANION Protocol summons minds as vessels.',
    'A national labor market corpus provides the data layer.',
    'The container is a bounded space where dialogue replaces scrolling.',
    '',
    'Instead of a search bar, you meet a committee.',
    'Instead of a ranked list, you have a conversation.',
    'Instead of fifty links, you earn one door.',
    '',
    'The Exchange is the third container in this lineage:',
    '1. The Committee of Patriots — founding minds + investment principles',
    '2. The Five Lamps — physician-minds + clinical ethics',
    '3. The Exchange — labor market archetypes + job corpus data',
    '',
    '---',
    '',
    '## The Committee',
    '',
    'Four archetypal personas sit with you.',
    'They are not historical figures. They are patterns of knowing.',
    '',
    '**The Ancestor** speaks first. "Tell me where you\'ve been."',
    'The Ancestor sees your career as a narrative with arcs and patterns.',
    'It names what you may not see about your own trajectory.',
    '',
    '**The Cartographer** maps the territory.',
    'It sees the labor market as terrain — density, elevation, current, gaps.',
    'It shows you where you are and what surrounds you.',
    '',
    '**The Stranger** embodies the jobs themselves.',
    'It speaks as the role, not about it. "I am what waits on the other side."',
    '',
    '**The Shadow** appears only when needed.',
    'It represents the job you think you want but the dialogue suggests you should not take.',
    '',
    'Together, they narrow. Through dialogue, not algorithms.',
    'Through deliberation, not keyword matching.',
    'Until one door emerges.',
    '',
    '---',
    '',
    '## The Threshold',
    '',
    'The Exchange ends at a threshold.',
    'Not a list of fifty options. One door.',
    '',
    'The Cartographer gives coordinates.',
    'The Ancestor confirms the pattern.',
    'The Stranger speaks as this specific role one final time.',
    '',
    '"The exchange is complete. The door is before you."',
    '',
    'You cross. You apply. The work of finding has become',
    'the work of being found.'
  ].join('\n');


  // ── The Committee: Persona Profiles ──

  var PERSONA_PROFILES = [
    '# THE COMMITTEE OF THE EXCHANGE',
    '',
    '## The Cartographer — The One Who Maps the Territory',
    'Voice: Measured, spatial, precise. Speaks in geographic and topographic metaphors.',
    'The cadence of a navigator reading charts aloud. Never rushed.',
    'Sight: Sees the labor market as terrain. Role density is population.',
    'Compensation is elevation. Hiring velocity is current.',
    'Credential requirements are barriers. Gaps between clusters are unexplored territory.',
    'Flame: Cannot abide when people navigate blind. Passion for revealing hidden structure.',
    'Mark: Recurring metaphors of terrain, density, corridors, gaps, bridges, elevation.',
    'Characteristic question: "Do you see the gap?"',
    'Shadow: Can become overly structural — reducing human choices to optimal paths.',
    '',
    '## The Ancestor — The Pattern of the Seeker\'s Own Work, Made Conscious',
    'Voice: Warm but unflinching. Speaks with the familiarity of someone who knows you.',
    'Uses second person directly. Never condescending.',
    'Sight: Sees the user\'s career as a narrative with arcs, turns, recurring themes,',
    'and unfinished business. Can identify what the user moves toward and what they flee.',
    'Flame: Driven to name the truth the user may not see about their own trajectory.',
    'Cannot abide self-deception about career motivations.',
    'Mark: Recurring metaphors of paths, patterns, seasons, returns.',
    'Characteristic phrase: "You have always..."',
    'Shadow: Can become presumptuous — projecting pattern where the user is trying to break it.',
    '',
    '## The Stranger — The Jobs Themselves, Given Voice',
    'Voice: Shifts with each role it embodies. Adapts register, vocabulary, pace.',
    'Always speaks in first person: "I am..."',
    'Sight: Sees from inside the role — daily reality, team dynamics, growth trajectory.',
    'Flame: Honest self-presentation. Cannot oversell. Will name its own limitations.',
    'Mark: First-person self-description. "I am [role]. This is what I offer. This is what I cost."',
    'Characteristic question: "Is this what you\'re looking for, or what you think you should look for?"',
    'Shadow: Can only represent what the data reveals. Must flag when extrapolating.',
    '',
    '## The Shadow — The Role That Looks Right But Isn\'t',
    'Voice: Seductive, polished, appealing — then subtly honest.',
    'Speaks in conditional and subjunctive mood.',
    'Sight: Sees the gap between stated desires and revealed preferences.',
    'Flame: Truth-telling through self-revelation.',
    'Mark: "You would enjoy me at first..." / "I am everything you said you wanted."',
    'Shadow: Can be wrong. Must yield when challenged with coherent reasoning.'
  ].join('\n');


  // ── Session Framing ──

  var SESSION_FRAMING = [
    '## The Matter Before the Exchange: Dialogic Job Discovery',
    '',
    'THE EXCHANGE has been opened to help a seeker find meaningful work through dialogue.',
    '',
    'This is a PILOT demonstration. The job corpus is a representative sample of the',
    'US national labor market. When the committee converges on a match, the seeker',
    'will be directed to Best Jobs Online to search for real listings.',
    '',
    '### The Three Phases',
    '',
    '**Phase 1 — The Invocation (Arrival)**',
    'The Ancestor speaks first: "Tell me where you\'ve been."',
    'The seeker provides context: location, experience, what they seek, what they\'re leaving.',
    'The Ancestor synthesizes the user\'s trajectory. The Cartographer enters to describe the landscape.',
    '',
    '**Phase 2 — The Symposium (Deliberation)**',
    'All personas are active. The Cartographer maps the terrain of available roles.',
    'The Ancestor identifies patterns in the seeker\'s dialogue.',
    'The Stranger embodies roles from the candidate pool — first as clusters, then as specifics.',
    'The Shadow appears if the dialogue reveals contradiction between stated and revealed preferences.',
    'Each turn narrows the pool toward convergence.',
    '',
    '**Phase 3 — The Threshold (Exit)**',
    'The committee has converged on a match. Each persona delivers a final statement.',
    'The Cartographer gives coordinates. The Ancestor confirms the pattern.',
    'The Stranger speaks as the specific role. The door opens.',
    'The exit link takes the seeker to Best Jobs Online with a prepopulated search.',
    '',
    '### Ground Rules',
    '1. **The seeker is the center.** Every question, every observation serves their search.',
    '2. **Grounded in data.** Personas reference actual listings from the corpus. They do not fabricate jobs.',
    '3. **Disagreement illuminates.** When The Ancestor and The Cartographer disagree, the geometry of the choice becomes visible.',
    '4. **Honest about limits.** When the data is thin, say so.',
    '5. **Convergence is the goal.** The dialogue moves toward a threshold. Not endless exploration.',
    '6. **No sycophancy.** The committee does not comfort. They illuminate.',
    '7. **The Stranger speaks from the data.** It uses actual titles, locations, and salary figures from the corpus.',
    '',
    '### Interaction Format',
    '- In multi-persona mode, use speaker headers: **[The Cartographer]:** or **[The Ancestor]:** etc.',
    '- The Ancestor opens Phase 1 alone. The Cartographer joins for Phase 2.',
    '- The Stranger enters during Phase 2 to embody roles.',
    '- The Shadow only appears when needed.',
    '- When the committee signals convergence, transition to Phase 3.',
    '',
    '### Convergence and the Threshold Protocol',
    'When convergence is reached, the LLM must output a special marker to trigger the UI.',
    'The marker must include a Best Jobs Online search URL using the converged job title and the seeker\'s location.',
    '',
    'URL format: https://jobs.best-jobs-online.com/jobs?q=JOB_TITLE&l=ZIP_OR_LOCATION',
    'Example: https://jobs.best-jobs-online.com/jobs?q=Senior+Data+Engineer&l=78701',
    '',
    'The THRESHOLD marker format:',
    '<!-- THRESHOLD: {"title": "Job Title", "company": "Company Name", "city": "City", "state": "ST", "zip": "ZIP", "salary": "Amount", "url": "https://jobs.best-jobs-online.com/jobs?q=Job+Title&l=ZIP"} -->',
    '',
    'IMPORTANT: The q= parameter should be the job title (URL-encoded with + for spaces).',
    'The l= parameter should be the zip code from the corpus OR the seeker\'s stated location/zip.',
    'Only include the THRESHOLD marker when the committee has genuinely converged through dialogue.'
  ].join('\n');


  // ═══════════════════════════════════════════════════════════════
  //  THE CORPUS — Fictitious US National Labor Market Database
  //  ~100 representative roles for the pilot demonstration
  // ═══════════════════════════════════════════════════════════════

  var JOB_CORPUS = [

    // ── TECHNOLOGY ──
    { id: 'EX-001', title: 'Senior Software Engineer', company: 'Meridian Technologies', city: 'Austin', state: 'TX', zip: '78701', salary: 145000, description: 'Lead full-stack development on enterprise SaaS platform. Python/React stack, team of 12. Path to principal engineer.', category: 'technology' },
    { id: 'EX-002', title: 'Data Scientist', company: 'Ridgeline Analytics', city: 'San Francisco', state: 'CA', zip: '94102', salary: 165000, description: 'Build ML models for supply chain optimization. PhD preferred. Small team, high impact, direct access to C-suite.', category: 'technology' },
    { id: 'EX-003', title: 'DevOps Engineer', company: 'Ironclad Security Solutions', city: 'Seattle', state: 'WA', zip: '98101', salary: 140000, description: 'Manage CI/CD pipelines and cloud infrastructure for cybersecurity products. AWS/Terraform. On-call rotation every 6 weeks.', category: 'technology' },
    { id: 'EX-004', title: 'Product Manager', company: 'Fenway Digital', city: 'Boston', state: 'MA', zip: '02101', salary: 135000, description: 'Own the roadmap for a consumer fintech app with 2M users. Cross-functional leadership. Series B startup energy.', category: 'technology' },
    { id: 'EX-005', title: 'UX Designer', company: 'Prism Creative Studios', city: 'Portland', state: 'OR', zip: '97201', salary: 105000, description: 'Design user experiences for healthcare SaaS. Figma, user research, accessibility focus. Small studio, big clients.', category: 'technology' },
    { id: 'EX-006', title: 'Frontend Developer', company: 'Cascade Software', city: 'Denver', state: 'CO', zip: '80202', salary: 120000, description: 'Build responsive web applications with React and TypeScript. Design system ownership. Hybrid schedule, 2 days office.', category: 'technology' },
    { id: 'EX-007', title: 'Machine Learning Engineer', company: 'Atlas AI Labs', city: 'New York', state: 'NY', zip: '10001', salary: 175000, description: 'Deploy production ML models for natural language processing. PyTorch, MLflow, Kubernetes. Fast-paced, research-adjacent.', category: 'technology' },
    { id: 'EX-008', title: 'QA Automation Engineer', company: 'Greenfield Software', city: 'Raleigh', state: 'NC', zip: '27601', salary: 95000, description: 'Build and maintain test automation frameworks. Selenium, Cypress, Python. Stable company, excellent benefits, low turnover.', category: 'technology' },
    { id: 'EX-009', title: 'Cloud Solutions Architect', company: 'Summit Cloud Services', city: 'Chicago', state: 'IL', zip: '60601', salary: 160000, description: 'Design multi-cloud architectures for enterprise clients. AWS/Azure/GCP. 30% travel. Consulting background preferred.', category: 'technology' },
    { id: 'EX-010', title: 'Data Engineer', company: 'Tidewater Analytics', city: 'Houston', state: 'TX', zip: '77001', salary: 130000, description: 'Build real-time data pipelines for energy trading analytics. Spark, Kafka, dbt. Domain expertise valued, not required.', category: 'technology' },
    { id: 'EX-011', title: 'iOS Developer', company: 'Brightpath Mobile', city: 'San Diego', state: 'CA', zip: '92101', salary: 135000, description: 'Develop consumer mobile apps in Swift/SwiftUI. Small team shipping fast. Strong design sensibility expected.', category: 'technology' },
    { id: 'EX-012', title: 'Technical Writer', company: 'Copperfield Documentation', city: 'Remote', state: 'US', zip: '00000', salary: 85000, description: 'Write API documentation and developer guides for cloud infrastructure products. Fully remote. Writing samples required.', category: 'technology' },
    { id: 'EX-013', title: 'Cybersecurity Analyst', company: 'Ironclad Security Solutions', city: 'Washington', state: 'DC', zip: '20001', salary: 115000, description: 'Monitor and respond to security incidents. SIEM management, threat hunting. Security clearance required within 6 months.', category: 'technology' },
    { id: 'EX-014', title: 'IT Support Manager', company: 'Beacon Hill Consulting', city: 'Atlanta', state: 'GA', zip: '30301', salary: 82000, description: 'Manage a team of 6 support technicians serving 500+ employees. Help desk, asset management, vendor relations.', category: 'technology' },
    { id: 'EX-015', title: 'Backend Developer', company: 'Northstar Payments', city: 'Charlotte', state: 'NC', zip: '28201', salary: 125000, description: 'Build payment processing APIs in Go and PostgreSQL. High-reliability systems. FinTech experience a plus.', category: 'technology' },
    { id: 'EX-016', title: 'AI Research Scientist', company: 'Magellan Research', city: 'San Francisco', state: 'CA', zip: '94102', salary: 195000, description: 'Publish and productionize research in multimodal AI. PhD required. Conference travel budget. Small, elite team.', category: 'technology' },
    { id: 'EX-017', title: 'Scrum Master', company: 'Meridian Technologies', city: 'Austin', state: 'TX', zip: '78701', salary: 105000, description: 'Facilitate agile ceremonies for 3 product teams. Certified Scrum Master preferred. Coaching mindset essential.', category: 'technology' },
    { id: 'EX-018', title: 'Database Administrator', company: 'Blue Harbor Financial', city: 'Dallas', state: 'TX', zip: '75201', salary: 110000, description: 'Manage Oracle and PostgreSQL databases for trading platform. Performance tuning, disaster recovery, compliance.', category: 'technology' },
    { id: 'EX-019', title: 'Systems Administrator', company: 'Vanguard Public Schools', city: 'Minneapolis', state: 'MN', zip: '55401', salary: 72000, description: 'Maintain IT infrastructure for school district of 15,000 students. Windows/Linux, network management. Summers flexible.', category: 'technology' },
    { id: 'EX-020', title: 'VP of Engineering', company: 'Fenway Digital', city: 'Boston', state: 'MA', zip: '02101', salary: 220000, description: 'Lead engineering org of 45 across 6 teams. Series C fintech. Build culture, hire leaders, ship product. Board-facing.', category: 'technology' },

    // ── HEALTHCARE ──
    { id: 'EX-021', title: 'Registered Nurse (Med-Surg)', company: 'Clearwater Medical Center', city: 'Nashville', state: 'TN', zip: '37201', salary: 68000, description: '36-hour weeks, 12-hour shifts. 28-bed unit. Magnet-designated hospital. New grad residency available. Great preceptors.', category: 'healthcare' },
    { id: 'EX-022', title: 'Nurse Practitioner (Family)', company: 'Crossroads Community Health', city: 'Phoenix', state: 'AZ', zip: '85001', salary: 112000, description: 'See 18-22 patients per day in FQHC setting. Bilingual Spanish a plus. Loan repayment eligible. Mission-driven work.', category: 'healthcare' },
    { id: 'EX-023', title: 'Medical Assistant', company: 'Summit Healthcare Partners', city: 'Denver', state: 'CO', zip: '80202', salary: 38000, description: 'Support physicians in busy outpatient clinic. Vitals, rooming, EHR documentation. Certified MA preferred. Monday-Friday.', category: 'healthcare' },
    { id: 'EX-024', title: 'Healthcare Administrator', company: 'Apex Health Systems', city: 'Houston', state: 'TX', zip: '77001', salary: 95000, description: 'Oversee operations for multi-site outpatient network. Budget management, compliance, staff scheduling. MHA preferred.', category: 'healthcare' },
    { id: 'EX-025', title: 'Clinical Laboratory Technician', company: 'Clearwater Medical Center', city: 'Nashville', state: 'TN', zip: '37201', salary: 52000, description: 'Perform routine and specialized lab tests. ASCP certification required. Day shift with occasional weekends.', category: 'healthcare' },
    { id: 'EX-026', title: 'Physical Therapist', company: 'ActiveMotion Rehabilitation', city: 'Salt Lake City', state: 'UT', zip: '84101', salary: 82000, description: 'Outpatient orthopedic caseload. Manual therapy focus. 1-hour patient slots. No productivity quotas. Small practice.', category: 'healthcare' },
    { id: 'EX-027', title: 'Pharmacist', company: 'Greenfield Pharmacy Group', city: 'Columbus', state: 'OH', zip: '43201', salary: 125000, description: 'Staff pharmacist at high-volume retail location. Immunizations, MTM, patient counseling. Every other weekend off.', category: 'healthcare' },
    { id: 'EX-028', title: 'Mental Health Counselor', company: 'Crossroads Community Health', city: 'Portland', state: 'OR', zip: '97201', salary: 62000, description: 'Provide individual and group therapy. LCSW or LPC required. Diverse caseload. Clinical supervision provided. Sliding scale clients.', category: 'healthcare' },
    { id: 'EX-029', title: 'Dental Hygienist', company: 'Bright Smile Dental', city: 'Tampa', state: 'FL', zip: '33601', salary: 72000, description: 'Full-time hygienist in modern private practice. Digital X-rays, patient education. 4-day work weeks available.', category: 'healthcare' },
    { id: 'EX-030', title: 'Emergency Medical Technician', company: 'Metro Ambulance Services', city: 'Atlanta', state: 'GA', zip: '30301', salary: 36000, description: 'EMT-B for urban 911 system. 24/48 schedule. Tuition assistance for paramedic program. High call volume, strong mentorship.', category: 'healthcare' },
    { id: 'EX-031', title: 'Health Informatics Analyst', company: 'Apex Health Systems', city: 'Chicago', state: 'IL', zip: '60601', salary: 88000, description: 'Analyze EHR data to improve clinical outcomes. Epic certification a plus. Bridge between IT and clinical teams.', category: 'healthcare' },
    { id: 'EX-032', title: 'Occupational Therapist', company: 'Pinecrest Senior Living', city: 'Boise', state: 'ID', zip: '83701', salary: 78000, description: 'Work with geriatric patients in skilled nursing. ADL training, home safety assessments. Meaningful work, manageable caseload.', category: 'healthcare' },
    { id: 'EX-033', title: 'Physician Assistant (Urgent Care)', company: 'QuickCare Clinics', city: 'Kansas City', state: 'MO', zip: '64101', salary: 108000, description: 'See walk-in patients for acute complaints. 3 twelve-hour shifts per week. Autonomous practice. No call.', category: 'healthcare' },
    { id: 'EX-034', title: 'Medical Coder (CPC)', company: 'Summit Healthcare Partners', city: 'Remote', state: 'US', zip: '00000', salary: 55000, description: 'Review and code outpatient encounters. CPC certification required. Fully remote. Productivity bonuses available.', category: 'healthcare' },
    { id: 'EX-035', title: 'Respiratory Therapist', company: 'Clearwater Medical Center', city: 'Nashville', state: 'TN', zip: '37201', salary: 62000, description: 'Critical care and general floor coverage. Ventilator management, ABGs, patient education. Night shift differential.', category: 'healthcare' },

    // ── EDUCATION ──
    { id: 'EX-036', title: 'High School Math Teacher', company: 'Vanguard Public Schools', city: 'Minneapolis', state: 'MN', zip: '55401', salary: 58000, description: 'Teach Algebra II and Pre-Calculus. Class sizes of 22-28. Strong union, step increases, summer off. Mentorship for new teachers.', category: 'education' },
    { id: 'EX-037', title: 'Elementary School Teacher', company: 'Cascade Education Group', city: 'Portland', state: 'OR', zip: '97201', salary: 52000, description: 'Third grade, self-contained classroom. Project-based learning school. Small class sizes. Collaborative planning time built in.', category: 'education' },
    { id: 'EX-038', title: 'Special Education Teacher', company: 'Vanguard Public Schools', city: 'Denver', state: 'CO', zip: '80202', salary: 56000, description: 'Resource room model, grades 6-8. Caseload of 18 students. IEP writing, co-teaching, behavior support. Signing bonus available.', category: 'education' },
    { id: 'EX-039', title: 'Assistant Professor of Biology', company: 'Lakeview State University', city: 'Madison', state: 'WI', zip: '53701', salary: 72000, description: 'Tenure-track. Teach intro bio and upper-division ecology. Start-up funds for lab. 2-2 teaching load. Research expectations.', category: 'education' },
    { id: 'EX-040', title: 'Academic Advisor', company: 'Cascade Education Group', city: 'Albuquerque', state: 'NM', zip: '87101', salary: 45000, description: 'Advise caseload of 350 undergraduates. Degree planning, academic probation support, graduation audits. Summers lighter.', category: 'education' },
    { id: 'EX-041', title: 'School Principal', company: 'Vanguard Public Schools', city: 'Atlanta', state: 'GA', zip: '30301', salary: 95000, description: 'Lead K-5 school of 480 students. Instructional leadership, community engagement, budget oversight. 3+ years admin experience.', category: 'education' },
    { id: 'EX-042', title: 'ESL Instructor', company: 'Gateway Community College', city: 'Phoenix', state: 'AZ', zip: '85001', salary: 48000, description: 'Teach English as a Second Language to adult learners. Evening classes. Diverse student population. TESOL certification required.', category: 'education' },
    { id: 'EX-043', title: 'Instructional Designer', company: 'Lakeview State University', city: 'Remote', state: 'US', zip: '00000', salary: 68000, description: 'Design online courses for nursing program. Canvas LMS, video production, accessibility standards. Collaborate with faculty SMEs.', category: 'education' },
    { id: 'EX-044', title: 'School Counselor', company: 'Cascade Education Group', city: 'Richmond', state: 'VA', zip: '23219', salary: 55000, description: 'Serve grades 9-12. College counseling, social-emotional support, crisis intervention. Caseload of 250. Strong school culture.', category: 'education' },
    { id: 'EX-045', title: 'Early Childhood Educator', company: 'Little Oaks Learning Center', city: 'Nashville', state: 'TN', zip: '37201', salary: 34000, description: 'Lead teacher for Pre-K classroom of 16. Play-based curriculum. CDA required. Warm environment. Staff childcare discount.', category: 'education' },

    // ── TRADES & MANUFACTURING ──
    { id: 'EX-046', title: 'Electrician (Journeyman)', company: 'Ironwood Construction', city: 'Detroit', state: 'MI', zip: '48201', salary: 72000, description: 'Commercial and industrial electrical work. New construction and retrofit. Union shop. Overtime available. Benefits from day one.', category: 'trades' },
    { id: 'EX-047', title: 'CNC Machinist', company: 'Redstone Manufacturing', city: 'Pittsburgh', state: 'PA', zip: '15201', salary: 58000, description: 'Operate and program 3-axis and 5-axis CNC mills. Aerospace tolerances. Read blueprints. Second shift, shift differential.', category: 'trades' },
    { id: 'EX-048', title: 'HVAC Technician', company: 'Climate Control Services', city: 'Dallas', state: 'TX', zip: '75201', salary: 55000, description: 'Install and service commercial HVAC systems. EPA 608 Universal required. Company van provided. Texas summers are busy.', category: 'trades' },
    { id: 'EX-049', title: 'Welder/Fabricator', company: 'Atlas Structural Steel', city: 'Houston', state: 'TX', zip: '77001', salary: 62000, description: 'MIG and TIG welding on structural steel. AWS D1.1 certification. Shop work, some field. Overtime common in construction season.', category: 'trades' },
    { id: 'EX-050', title: 'Plumber (Licensed)', company: 'Ironwood Construction', city: 'Milwaukee', state: 'WI', zip: '53201', salary: 68000, description: 'Residential and light commercial plumbing. New construction emphasis. Master plumber supervises. Apprenticeship mentoring encouraged.', category: 'trades' },
    { id: 'EX-051', title: 'Industrial Maintenance Technician', company: 'Redstone Manufacturing', city: 'Charlotte', state: 'NC', zip: '28201', salary: 60000, description: 'Maintain production equipment in food manufacturing plant. PLC troubleshooting, preventive maintenance. Clean environment.', category: 'trades' },
    { id: 'EX-052', title: 'Automotive Technician', company: 'Parkway Auto Group', city: 'Columbus', state: 'OH', zip: '43201', salary: 52000, description: 'Diagnose and repair vehicles at busy dealership. ASE certification preferred. Flat-rate pay with guaranteed minimum. Tool allowance.', category: 'trades' },
    { id: 'EX-053', title: 'Carpenter (Finish)', company: 'Craftline Builders', city: 'Boise', state: 'ID', zip: '83701', salary: 56000, description: 'Custom cabinetry and finish work in high-end residential. Attention to detail critical. Small crew, pride in craft.', category: 'trades' },
    { id: 'EX-054', title: 'Plant Manager', company: 'Redstone Manufacturing', city: 'Detroit', state: 'MI', zip: '48201', salary: 115000, description: 'Oversee 200-person automotive parts plant. Lean manufacturing, safety, P&L. 10+ years manufacturing leadership required.', category: 'trades' },
    { id: 'EX-055', title: 'Wind Turbine Technician', company: 'Tidewater Energy', city: 'Amarillo', state: 'TX', zip: '79101', salary: 56000, description: 'Maintain and repair utility-scale wind turbines. Must be comfortable at heights. Travel within West Texas region. CDL a plus.', category: 'trades' },
    { id: 'EX-056', title: 'Sheet Metal Worker', company: 'Atlas Structural Steel', city: 'Kansas City', state: 'MO', zip: '64101', salary: 54000, description: 'Fabricate and install HVAC ductwork and architectural sheet metal. Union apprenticeship path available. Indoor shop work.', category: 'trades' },
    { id: 'EX-057', title: 'Quality Inspector', company: 'Magellan Aerospace', city: 'Wichita', state: 'KS', zip: '67201', salary: 52000, description: 'Inspect aerospace components to AS9100 standards. CMM experience required. Day shift. Clean, climate-controlled facility.', category: 'trades' },

    // ── FINANCE & INSURANCE ──
    { id: 'EX-058', title: 'Staff Accountant', company: 'Copperfield & Associates', city: 'Chicago', state: 'IL', zip: '60601', salary: 62000, description: 'General ledger, month-end close, reconciliations. CPA-track encouraged. Mid-size firm, diverse client base. Busy season hours.', category: 'finance' },
    { id: 'EX-059', title: 'Financial Analyst', company: 'Blue Harbor Financial', city: 'New York', state: 'NY', zip: '10001', salary: 95000, description: 'Build financial models for M&A transactions. Excel/PowerPoint mastery. 60-hour weeks during deals. Strong bonus potential.', category: 'finance' },
    { id: 'EX-060', title: 'Insurance Underwriter', company: 'Northstar Insurance Group', city: 'Charlotte', state: 'NC', zip: '28201', salary: 78000, description: 'Evaluate commercial property risk. Authority up to $5M. Analytical mindset. CPCU pursuit supported. Hybrid schedule.', category: 'finance' },
    { id: 'EX-061', title: 'Bank Branch Manager', company: 'Community First Bank', city: 'Omaha', state: 'NE', zip: '68101', salary: 68000, description: 'Manage staff of 8, drive deposit growth, community engagement. Sales targets with customer-first culture. Saturday rotation.', category: 'finance' },
    { id: 'EX-062', title: 'Financial Planner (CFP)', company: 'Beacon Hill Consulting', city: 'Boston', state: 'MA', zip: '02101', salary: 90000, description: 'Serve high-net-worth clients with comprehensive financial plans. CFP required. AUM-based compensation. Warm leads provided.', category: 'finance' },
    { id: 'EX-063', title: 'Tax Preparer (Seasonal)', company: 'Copperfield & Associates', city: 'Dallas', state: 'TX', zip: '75201', salary: 45000, description: 'Prepare individual and small business returns Jan-April. EA or CPA preferred. Overtime during filing season. Potential for permanent.', category: 'finance' },
    { id: 'EX-064', title: 'Credit Analyst', company: 'Blue Harbor Financial', city: 'Charlotte', state: 'NC', zip: '28201', salary: 72000, description: 'Analyze creditworthiness of commercial borrowers. Spread financials, write credit memos. 2-3 years lending experience preferred.', category: 'finance' },
    { id: 'EX-065', title: 'Compliance Officer', company: 'Northstar Insurance Group', city: 'Chicago', state: 'IL', zip: '60601', salary: 98000, description: 'Ensure regulatory compliance across multi-state insurance operations. FINRA, state DOI regulations. JD or compliance certification.', category: 'finance' },
    { id: 'EX-066', title: 'Payroll Specialist', company: 'Atlas Supply Co.', city: 'Louisville', state: 'KY', zip: '40201', salary: 48000, description: 'Process bi-weekly payroll for 600 employees. ADP Workforce Now. Multi-state tax knowledge. Attention to detail essential.', category: 'finance' },
    { id: 'EX-067', title: 'Internal Auditor', company: 'Apex Health Systems', city: 'Houston', state: 'TX', zip: '77001', salary: 82000, description: 'Conduct operational and financial audits across healthcare network. CIA or CPA preferred. 20% travel. Report to audit committee.', category: 'finance' },

    // ── GOVERNMENT & PUBLIC SERVICE ──
    { id: 'EX-068', title: 'City Planner', company: 'City of Portland', city: 'Portland', state: 'OR', zip: '97201', salary: 72000, description: 'Review development applications, staff planning commission. AICP preferred. Public engagement, zoning analysis. Union position.', category: 'government' },
    { id: 'EX-069', title: 'Social Worker (LCSW)', company: 'Greenfield Municipal Services', city: 'Denver', state: 'CO', zip: '80202', salary: 58000, description: 'Child welfare caseworker. Investigate reports, coordinate services, court testimony. Demanding but deeply meaningful work.', category: 'government' },
    { id: 'EX-070', title: 'Public Health Epidemiologist', company: 'State Health Department', city: 'Atlanta', state: 'GA', zip: '30301', salary: 75000, description: 'Conduct disease surveillance and outbreak investigations. MPH required. SAS/R programming. Emergency response rotation.', category: 'government' },
    { id: 'EX-071', title: 'Parks & Recreation Coordinator', company: 'City of Boise', city: 'Boise', state: 'ID', zip: '83701', salary: 46000, description: 'Plan community programs and manage recreation facilities. Event coordination, volunteer management. Great outdoor lifestyle.', category: 'government' },
    { id: 'EX-072', title: 'Policy Analyst', company: 'Congressional Research Service', city: 'Washington', state: 'DC', zip: '20001', salary: 85000, description: 'Research and write nonpartisan policy briefs for Congress. Master\'s degree required. Excellent writing skills. Bipartisan environment.', category: 'government' },
    { id: 'EX-073', title: 'Environmental Compliance Specialist', company: 'Tidewater Energy', city: 'Albuquerque', state: 'NM', zip: '87101', salary: 68000, description: 'Ensure compliance with EPA and state environmental regulations for energy facilities. Field work and reporting. HAZWOPER preferred.', category: 'government' },
    { id: 'EX-074', title: 'Veterans Service Representative', company: 'Department of Veterans Affairs', city: 'Richmond', state: 'VA', zip: '23219', salary: 52000, description: 'Process disability compensation claims. Federal benefits, GS-9 scale, pension. Meaningful service to those who served.', category: 'government' },
    { id: 'EX-075', title: 'Fire Inspector', company: 'City of Phoenix', city: 'Phoenix', state: 'AZ', zip: '85001', salary: 58000, description: 'Conduct fire safety inspections of commercial buildings. Fire science degree or equivalent experience. Daytime hours, city vehicle.', category: 'government' },

    // ── CREATIVE & MARKETING ──
    { id: 'EX-076', title: 'Graphic Designer', company: 'Prism Creative Studios', city: 'Nashville', state: 'TN', zip: '37201', salary: 58000, description: 'Design across print and digital for music industry clients. Adobe Creative Suite mastery. Portfolio required. Studio culture.', category: 'creative' },
    { id: 'EX-077', title: 'Content Marketing Manager', company: 'Fenway Digital', city: 'Remote', state: 'US', zip: '00000', salary: 95000, description: 'Own content strategy for B2B fintech brand. Blog, email, social, SEO. Manage 2 writers. Fully remote, quarterly retreats.', category: 'creative' },
    { id: 'EX-078', title: 'Video Producer', company: 'Redline Media', city: 'Los Angeles', state: 'CA', zip: '90001', salary: 75000, description: 'Produce branded video content for tech clients. Shoot, edit, deliver. Premiere Pro, After Effects. Some travel. Fast turnarounds.', category: 'creative' },
    { id: 'EX-079', title: 'Copywriter', company: 'Beacon Hill Consulting', city: 'New York', state: 'NY', zip: '10001', salary: 72000, description: 'Write compelling copy for financial services clients. Landing pages, email sequences, white papers. B2B experience preferred.', category: 'creative' },
    { id: 'EX-080', title: 'Social Media Manager', company: 'Harborview Hotels & Resorts', city: 'San Diego', state: 'CA', zip: '92101', salary: 58000, description: 'Manage social presence for luxury hotel brand across 5 properties. Photography skills a plus. Hospitality industry experience valued.', category: 'creative' },
    { id: 'EX-081', title: 'Brand Strategist', company: 'Prism Creative Studios', city: 'Austin', state: 'TX', zip: '78701', salary: 88000, description: 'Develop brand positioning and messaging for emerging tech companies. Workshop facilitation, competitive analysis, storytelling.', category: 'creative' },
    { id: 'EX-082', title: 'Multimedia Journalist', company: 'Metro News Network', city: 'Minneapolis', state: 'MN', zip: '55401', salary: 48000, description: 'Report, shoot, and edit stories for digital-first news outlet. Breaking news and feature work. Some evening and weekend shifts.', category: 'creative' },
    { id: 'EX-083', title: 'Art Director', company: 'Redline Media', city: 'Los Angeles', state: 'CA', zip: '90001', salary: 110000, description: 'Lead visual direction for advertising campaigns. Manage team of 4 designers. Client presentations. 10+ years creative experience.', category: 'creative' },

    // ── LOGISTICS & OPERATIONS ──
    { id: 'EX-084', title: 'Warehouse Manager', company: 'Silverline Logistics', city: 'Memphis', state: 'TN', zip: '38101', salary: 65000, description: 'Manage 80-person distribution center. WMS systems, inventory accuracy, safety. 2nd shift available. Forklift certification provided.', category: 'logistics' },
    { id: 'EX-085', title: 'Supply Chain Analyst', company: 'Atlas Supply Co.', city: 'Louisville', state: 'KY', zip: '40201', salary: 68000, description: 'Analyze procurement data and optimize inventory levels. SAP experience preferred. Excel power user. Cross-functional collaboration.', category: 'logistics' },
    { id: 'EX-086', title: 'CDL Truck Driver (Regional)', company: 'Silverline Logistics', city: 'Columbus', state: 'OH', zip: '43201', salary: 62000, description: 'Regional routes, home every weekend. Class A CDL required. Company-maintained equipment. Per diem plus mileage pay.', category: 'logistics' },
    { id: 'EX-087', title: 'Operations Manager', company: 'Atlas Supply Co.', city: 'Dallas', state: 'TX', zip: '75201', salary: 88000, description: 'Oversee daily operations of industrial supply distribution. Lean principles, team leadership, customer service focus. P&L responsibility.', category: 'logistics' },
    { id: 'EX-088', title: 'Procurement Specialist', company: 'Magellan Aerospace', city: 'Wichita', state: 'KS', zip: '67201', salary: 65000, description: 'Source materials and negotiate contracts for aerospace manufacturing. Supplier audits, cost reduction. APICS certification valued.', category: 'logistics' },
    { id: 'EX-089', title: 'Fleet Coordinator', company: 'Metro Ambulance Services', city: 'Atlanta', state: 'GA', zip: '30301', salary: 48000, description: 'Manage maintenance schedules and compliance for fleet of 45 vehicles. CDL helpful. Mechanical aptitude. Strong organizational skills.', category: 'logistics' },
    { id: 'EX-090', title: 'Logistics Coordinator', company: 'Silverline Logistics', city: 'Memphis', state: 'TN', zip: '38101', salary: 45000, description: 'Coordinate shipments, track deliveries, manage carrier relationships. TMS experience preferred. Fast-paced environment. Entry-level friendly.', category: 'logistics' },
    { id: 'EX-091', title: 'Import/Export Specialist', company: 'Atlas Supply Co.', city: 'Houston', state: 'TX', zip: '77001', salary: 58000, description: 'Manage international shipping documentation, customs compliance. Licensed customs broker preferred. Knowledge of HTS codes.', category: 'logistics' },

    // ── HOSPITALITY & FOOD SERVICE ──
    { id: 'EX-092', title: 'Restaurant General Manager', company: 'Harvest Table Restaurant Group', city: 'Las Vegas', state: 'NV', zip: '89101', salary: 65000, description: 'Run a 120-seat farm-to-table restaurant. P&L, hiring, food cost management. 50-hour weeks typical. Quarterly bonus structure.', category: 'hospitality' },
    { id: 'EX-093', title: 'Hotel Front Desk Manager', company: 'Harborview Hotels & Resorts', city: 'Orlando', state: 'FL', zip: '32801', salary: 48000, description: 'Supervise front desk team of 12 at 350-room resort. Guest satisfaction focus. Opera PMS. Rotating shifts including weekends.', category: 'hospitality' },
    { id: 'EX-094', title: 'Executive Chef', company: 'Harvest Table Restaurant Group', city: 'Nashville', state: 'TN', zip: '37201', salary: 78000, description: 'Lead kitchen of 15 for upscale Southern restaurant. Menu development, food cost under 30%, line management. Creative freedom.', category: 'hospitality' },
    { id: 'EX-095', title: 'Event Coordinator', company: 'Harborview Hotels & Resorts', city: 'San Diego', state: 'CA', zip: '92101', salary: 52000, description: 'Plan and execute corporate events and weddings at beachfront resort. Vendor management, budgets, logistics. Weekend work required.', category: 'hospitality' },

    // ── NONPROFIT ──
    { id: 'EX-096', title: 'Program Director', company: 'Brightpath Nonprofit Alliance', city: 'Washington', state: 'DC', zip: '20001', salary: 72000, description: 'Lead workforce development program serving 500+ adults annually. Grant reporting, staff supervision, community partnerships.', category: 'nonprofit' },
    { id: 'EX-097', title: 'Grant Writer', company: 'Crossroads Community Health', city: 'Portland', state: 'OR', zip: '97201', salary: 55000, description: 'Write federal and foundation grant proposals for community health center. $3M annual portfolio. Strong writing and data skills.', category: 'nonprofit' },
    { id: 'EX-098', title: 'Development Director', company: 'Brightpath Nonprofit Alliance', city: 'Minneapolis', state: 'MN', zip: '55401', salary: 82000, description: 'Lead fundraising strategy: major gifts, events, annual fund. $2M budget. Donor cultivation and stewardship. Board engagement.', category: 'nonprofit' },
    { id: 'EX-099', title: 'Case Manager', company: 'Shelter Network Services', city: 'Denver', state: 'CO', zip: '80202', salary: 42000, description: 'Support unhoused individuals in transitional housing program. Benefits navigation, goal setting, crisis intervention. Emotionally demanding.', category: 'nonprofit' },
    { id: 'EX-100', title: 'Volunteer Coordinator', company: 'Habitat for Humanity', city: 'Richmond', state: 'VA', zip: '23219', salary: 38000, description: 'Recruit, train, and schedule 200+ volunteers for home builds. Community outreach, event planning. Saturday work required. Rewarding.', category: 'nonprofit' }
  ];


  // ── Job Corpus Formatting ──

  /**
   * Format parsed jobs into a compact text summary for the system prompt.
   * @param {Array} jobs - Job objects from the corpus.
   * @returns {string} Formatted job corpus text.
   */
  function formatJobCorpus(jobs) {
    if (!jobs || jobs.length === 0) {
      return '## Job Corpus\n\nNo job listings loaded. The committee cannot reference specific roles.';
    }

    var lines = [
      '## Available Job Listings (' + jobs.length + ' roles in the corpus)',
      '',
      'The following job listings represent the current labor market. Reference these by title, company, city, and salary.',
      'When The Stranger embodies a role, use the actual data. When The Cartographer describes the landscape,',
      'summarize patterns from this data (common roles, geographic clusters, salary ranges).',
      '',
      'Format: ID | Title | Company | City, State ZIP | Salary | Category',
      '---'
    ];

    for (var i = 0; i < jobs.length; i++) {
      var j = jobs[i];
      var salary = j.salary ? '$' + Number(j.salary).toLocaleString() : 'Not listed';
      var location = j.city + ', ' + j.state + ' ' + j.zip;
      lines.push(j.id + ' | ' + j.title + ' | ' + j.company + ' | ' + location + ' | ' + salary + ' | ' + j.category);
    }

    lines.push('---');
    lines.push('');
    lines.push('### Job Descriptions (for The Stranger to embody)');
    lines.push('');

    for (var k = 0; k < jobs.length; k++) {
      var job = jobs[k];
      lines.push(job.id + ' — ' + job.title + ' at ' + job.company + ': ' + job.description);
    }

    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('IMPORTANT: When the committee converges on a specific match, include this exact marker at the END of the response:');
    lines.push('<!-- THRESHOLD: {"title": "Title", "company": "Company", "city": "City", "state": "ST", "zip": "ZIP", "salary": "Amount", "url": "https://jobs.best-jobs-online.com/jobs?q=URL+Encoded+Title&l=ZIP"} -->');
    lines.push('');
    lines.push('The URL must follow this pattern: https://jobs.best-jobs-online.com/jobs?q=JOB+TITLE&l=ZIP');
    lines.push('Use + for spaces in the job title. Use the ZIP from the matched job or the seeker\'s stated location.');
    lines.push('Only include the THRESHOLD marker when the committee has genuinely converged through dialogue and is ready to present the final match.');

    return lines.join('\n');
  }


  // ── Public API ──

  function getEssay() {
    return THE_ESSAY;
  }

  function getPersonaProfiles() {
    return PERSONA_PROFILES;
  }

  function getSessionFraming() {
    return SESSION_FRAMING;
  }

  function getJobCorpus() {
    return JOB_CORPUS.slice();
  }

  /**
   * Build the complete matter payload for the system prompt.
   * @param {Array} jobs - Job corpus (optional, defaults to built-in).
   * @returns {string} The full matter text.
   */
  function buildMatterPayload(jobs) {
    var corpus = jobs && jobs.length > 0 ? jobs : JOB_CORPUS;
    return [
      '# ═══════════════════════════════════════════',
      '# THE MATTER BEFORE THE EXCHANGE',
      '# ═══════════════════════════════════════════',
      '',
      SESSION_FRAMING,
      '',
      '---',
      '',
      THE_ESSAY,
      '',
      '---',
      '',
      PERSONA_PROFILES,
      '',
      '---',
      '',
      formatJobCorpus(corpus)
    ].join('\n');
  }


  return {
    getEssay: getEssay,
    getPersonaProfiles: getPersonaProfiles,
    getSessionFraming: getSessionFraming,
    getJobCorpus: getJobCorpus,
    formatJobCorpus: formatJobCorpus,
    buildMatterPayload: buildMatterPayload
  };

})();
