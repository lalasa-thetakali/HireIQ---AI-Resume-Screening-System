/* ===== GLOBAL STATE ===== */
const state = {
  files: [],
  parsedResumes: [],
  jobs: [],
  screeningResults: [],
  shortlisted: new Set(),
  weights: { skillMatch: 40, experience: 25, education: 15, keywordDensity: 10, certifications: 10 },
  currentPage: 'dashboard',
  selectedJob: null
};

/* ===== SAMPLE DATA ===== */
const SAMPLE_RESUMES = [
  {
    id: 1, name: 'Arjun Mehta', email: 'arjun.mehta@email.com',
    phone: '+91 98765 43210', location: 'Bangalore, India',
    experience: 4, education: 'B.Tech CS — IIT Bombay',
    skills: ['Python','React','Node.js','PostgreSQL','Docker','AWS','Redis','GraphQL'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
    summary: 'Full-stack engineer with 4 years building scalable web applications.',
    company: 'Flipkart', role: 'Software Engineer II'
  },
  {
    id: 2, name: 'Priya Sharma', email: 'priya.sharma@email.com',
    phone: '+91 87654 32109', location: 'Mumbai, India',
    experience: 6, education: 'M.Tech CS — IIT Delhi',
    skills: ['Python','Machine Learning','TensorFlow','FastAPI','PostgreSQL','Kubernetes','Spark'],
    certifications: ['TensorFlow Developer', 'AWS ML Specialty'],
    summary: 'ML engineer with 6 years in production AI systems and data pipelines.',
    company: 'Zomato', role: 'Senior ML Engineer'
  },
  {
    id: 3, name: 'Rahul Verma', email: 'rahul.v@email.com',
    phone: '+91 76543 21098', location: 'Hyderabad, India',
    experience: 2, education: 'B.Tech IT — NIT Warangal',
    skills: ['JavaScript','React','CSS','HTML','Git','REST APIs'],
    certifications: [],
    summary: 'Frontend developer focused on building accessible, performant web UIs.',
    company: 'TCS', role: 'Software Developer'
  },
  {
    id: 4, name: 'Sneha Krishnan', email: 'sneha.k@email.com',
    phone: '+91 65432 10987', location: 'Chennai, India',
    experience: 5, education: 'B.E. CSE — Anna University',
    skills: ['Python','Django','PostgreSQL','React','Docker','Linux','CI/CD','Redis'],
    certifications: ['Docker Certified Associate'],
    summary: 'Backend-focused engineer with expertise in Python web frameworks.',
    company: 'Infosys', role: 'Technology Analyst'
  },
  {
    id: 5, name: 'Vikram Singh', email: 'vikram.s@email.com',
    phone: '+91 54321 09876', location: 'Delhi, India',
    experience: 8, education: 'MBA + B.Tech — IIM Ahmedabad',
    skills: ['Python','React','Node.js','AWS','Microservices','Kafka','MongoDB','TypeScript'],
    certifications: ['PMP', 'AWS DevOps Professional'],
    summary: 'Senior architect with 8 years across fintech and e-commerce.',
    company: 'Razorpay', role: 'Principal Engineer'
  },
  {
    id: 6, name: 'Meera Nair', email: 'meera.n@email.com',
    phone: '+91 43210 98765', location: 'Pune, India',
    experience: 3, education: 'B.Tech CS — VIT University',
    skills: ['Java','Spring Boot','MySQL','React','Docker','Jenkins','Git'],
    certifications: ['Oracle Java SE'],
    summary: 'Java developer with strong backend skills in Spring Boot microservices.',
    company: 'Wipro', role: 'Software Engineer'
  },
  {
    id: 7, name: 'Karthik Rajan', email: 'karthik.r@email.com',
    phone: '+91 77890 12345', location: 'Chennai, India',
    experience: 6, education: 'M.Tech AI — Anna University',
    skills: ['Python','TensorFlow','PyTorch','Kubernetes','FastAPI','MLflow','Airflow','Spark'],
    certifications: ['Google Cloud Professional ML Engineer','AWS Machine Learning Specialty'],
    summary: 'Senior ML engineer with 6 years building and deploying production AI systems at scale.',
    company: 'Zoho', role: 'Senior ML Engineer'
  },
  {
    id: 8, name: 'Ananya Patel', email: 'ananya.p@email.com',
    phone: '+91 99123 45678', location: 'Ahmedabad, India',
    experience: 2, education: 'B.Tech IT — NIT Surat',
    skills: ['JavaScript','React','Node.js','MongoDB','GraphQL','TypeScript','CSS'],
    certifications: ['MongoDB Developer'],
    summary: 'Front-end focused full stack developer passionate about building beautiful, performant UIs.',
    company: 'Razorpay', role: 'Frontend Engineer'
  }
];

const SAMPLE_JOBS = [
  {
    id: 1, title: 'Senior Full Stack Developer', dept: 'Engineering', level: 'Senior',
    skills: ['Python','React','Node.js','PostgreSQL','Docker','AWS'],
    description: 'We are looking for a Senior Full Stack Developer to join our Engineering team. You will design, develop and maintain scalable web applications using Python, React, and cloud infrastructure.',
    created: '2024-01-15'
  },
  {
    id: 2, title: 'Machine Learning Engineer', dept: 'Data Science', level: 'Mid-Level',
    skills: ['Python','Machine Learning','TensorFlow','PostgreSQL','FastAPI','Kubernetes'],
    description: 'Join our AI team to build and deploy production machine learning models. Experience with TensorFlow and cloud deployment required.',
    created: '2024-01-20'
  }
];

/* ===== INIT ===== */
function init() {
  state.parsedResumes = SAMPLE_RESUMES.map(r => ({...r, scored: false, score: null}));
  state.jobs = [...SAMPLE_JOBS];
  renderJobs();
  renderWeightsSliders();
  renderWeightDistribution();
  updateStats();
  populateJobSelects();
  renderPipelineChart();
  navigate('dashboard', document.querySelector('[data-page=dashboard]'));
}

/* ===== PIPELINE ACTIVITY CHART ===== */
function renderPipelineChart() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const counts = [3, 5, 4, 8, 2, 1, 0];
  const peakIdx = counts.indexOf(Math.max(...counts));
  const total = counts.reduce((a,b) => a+b, 0);
  const max = Math.max(...counts, 1);

  const chart = document.getElementById('pipelineChart');
  if (!chart) return;

  chart.innerHTML = counts.map((c, i) => `
    <div class="pipeline-bar-col">
      <div class="pipeline-bar-track">
        <div class="pipeline-bar-fill ${i === peakIdx ? 'peak' : ''}"
          style="height:${Math.round((c/max)*100)}%"
          title="${days[i]}: ${c} uploads"></div>
      </div>
      <div class="pipeline-bar-label">${days[i]}</div>
    </div>
  `).join('');

  const peakEl = document.getElementById('pipelinePeak');
  const totalEl = document.getElementById('pipelineTotal');
  if (peakEl) peakEl.textContent = 'Peak: ' + days[peakIdx];
  if (totalEl) totalEl.textContent = total;
}

/* ===== NAVIGATION ===== */
const pageTitles = {
  dashboard: ['Dashboard','Overview of all activity'],
  upload: ['Upload Resumes','Add new candidates to your pipeline'],
  jobs: ['Job Descriptions','Manage positions you are hiring for'],
  screening: ['Screen & Rank','AI-powered candidate analysis'],
  candidates: ['All Candidates','Browse your candidate database'],
  shortlisted: ['Shortlisted','Candidates selected for further review'],
  insights: ['Analytics & Insights','Data-driven hiring intelligence'],
  weights: ['Scoring Weights','Configure scoring parameters'],
  bias: ['Bias Detection','Fairness and equity monitoring']
};

function navigate(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  // el may be a nav-item element or the nav-item itself from data-page attribute
  if (el && el.classList) {
    el.classList.add('active');
  } else {
    // find by data-page
    const navEl = document.querySelector('[data-page="'+page+'"]');
    if (navEl) navEl.classList.add('active');
  }
  const meta = pageTitles[page] || [page, ''];
  document.getElementById('topbarTitle').textContent = meta[0];
  document.getElementById('topbarBreadcrumb').textContent = meta[1];
  state.currentPage = page;
  if (page === 'candidates') renderAllCandidates();
  if (page === 'insights' && state.screeningResults.length) renderInsights();
  if (page === 'dashboard') renderDashboardTopCandidates();
  if (page === 'shortlisted') renderShortlistedPage();
}

/* ===== FILE UPLOAD ===== */
function handleDragOver(e) {
  e.preventDefault(); document.getElementById('uploadZone').classList.add('dragover');
}
function handleDragLeave() { document.getElementById('uploadZone').classList.remove('dragover'); }
function handleDrop(e) {
  e.preventDefault(); document.getElementById('uploadZone').classList.remove('dragover');
  handleFileSelect(e.dataTransfer.files);
}
function handleFileSelect(files) {
  Array.from(files).forEach(f => {
    if (!state.files.find(x => x.name === f.name)) {
      state.files.push(f);
    }
  });
  renderFileList();
}
function renderFileList() {
  const list = document.getElementById('fileList');
  const queueEl = document.getElementById('queueCount');
  const statsQueued = document.getElementById('statsQueued');
  if (queueEl) queueEl.textContent = state.files.length;
  if (statsQueued) statsQueued.textContent = state.files.length;
  if (state.files.length === 0) {
    list.style.display = 'none';
    const btn = document.getElementById('processBtn');
    if (btn) btn.disabled = true;
    return;
  }
  list.style.display = 'flex';
  const btn = document.getElementById('processBtn');
  if (btn) btn.disabled = false;
  list.innerHTML = state.files.map((f, i) => `
    <div class="file-item" id="file-${i}">
      <div class="file-icon">${getFileIcon(f.name)}</div>
      <div class="file-info">
        <div class="file-name">${f.name}</div>
        <div class="file-size">${formatSize(f.size)} · ${f.name.split('.').pop().toUpperCase()}</div>
      </div>
      <div class="file-status" id="fstatus-${i}">
        <span class="chip chip-blue">Queued</span>
      </div>
      <button class="file-remove" onclick="removeFile(${i})">✕</button>
    </div>
  `).join('');
}
function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  return { pdf: '📄', docx: '📝', txt: '📋', rtf: '📃' }[ext] || '📁';
}
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}
function removeFile(i) {
  state.files.splice(i, 1);
  renderFileList();
}
function clearFiles() {
  state.files = [];
  renderFileList();
}

async function processFiles() {
  const btn = document.getElementById('processBtn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Processing...';
  let parsed = 0;
  const startTime = Date.now();
  for (let i = 0; i < state.files.length; i++) {
    await new Promise(r => setTimeout(r, 400 + Math.random()*600));
    document.getElementById('fstatus-'+i).innerHTML = '<span class="chip chip-green">✅ Parsed</span>';
    const fakeName = state.files[i].name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    const newResume = generateFakeResume(fakeName, state.parsedResumes.length + 1);
    state.parsedResumes.push(newResume);
    parsed++;
    const parsedEl = document.getElementById('parsedCount');
    if (parsedEl) parsedEl.textContent = parsed;
    const statsParsed = document.getElementById('statsParsed');
    if (statsParsed) statsParsed.textContent = parsed;
    const statsTotal = document.getElementById('statsTotal');
    if (statsTotal) statsTotal.textContent = state.parsedResumes.length;
    const statsQueued = document.getElementById('statsQueued');
    if (statsQueued) statsQueued.textContent = state.files.length - parsed;
  }
  const elapsed = ((Date.now() - startTime) / 1000 / Math.max(parsed,1)).toFixed(1);
  const statsAvg = document.getElementById('statsAvgTime');
  if (statsAvg) statsAvg.textContent = '~' + elapsed + 's';
  btn.innerHTML = '✅ Done!';
  updateStats();
  showToast(`${parsed} resume(s) processed successfully!`, 'success', '✅');
  setTimeout(() => {
    btn.innerHTML = '⚡ Process Files';
    btn.disabled = false;
  }, 2000);
  const uploadBadge = document.getElementById('uploadBadge');
  if (uploadBadge) { uploadBadge.textContent = state.parsedResumes.length; uploadBadge.style.display = ''; }
}

function generateFakeResume(name, id) {
  const skillPools = [
    ['Python','React','Node.js','PostgreSQL','Docker'],
    ['Java','Spring Boot','MySQL','Kubernetes','Jenkins'],
    ['JavaScript','TypeScript','Vue.js','MongoDB','Redis'],
    ['Python','FastAPI','TensorFlow','Scikit-learn','SQL']
  ];
  const pool = skillPools[id % skillPools.length];
  return {
    id, name: name || `Candidate ${id}`,
    email: `candidate${id}@email.com`,
    phone: '+91 99000 ' + String(10000+id).slice(-5),
    location: ['Bangalore','Mumbai','Delhi','Chennai','Hyderabad'][id%5]+', India',
    experience: 1 + (id % 8),
    education: ['B.Tech CS','M.Tech IT','B.E. CSE','MCA'][id%4] + ' — ' + ['BITS Pilani','NIT','VIT','Amity'][id%4],
    skills: pool.slice(0, 3 + (id%3)),
    certifications: id%2===0 ? ['AWS Cloud Practitioner'] : [],
    summary: `Experienced developer with ${1+(id%8)} years in software development.`,
    company: ['Cognizant','HCL','Mindtree','Capgemini'][id%4],
    role: ['Software Developer','Engineer','Analyst','Consultant'][id%4],
    scored: false, score: null
  };
}

/* ===== JOB MANAGEMENT ===== */
function saveJob() {
  const title = document.getElementById('jobTitle').value.trim();
  const dept = document.getElementById('jobDept').value;
  const skills = document.getElementById('jobSkills').value;
  const desc = document.getElementById('jobDesc').value.trim();
  if (!title) { showToast('Please enter a job title', 'error', '❌'); return; }
  const activePill = document.querySelector('#expLevel .select-pill.active');
  const level = activePill ? activePill.textContent : 'Mid-Level';
  const newJob = {
    id: Date.now(), title, dept: dept || 'General', level,
    skills: skills.split(',').map(s => s.trim()).filter(Boolean),
    description: desc, created: new Date().toISOString().split('T')[0]
  };
  state.jobs.push(newJob);
  renderJobs();
  populateJobSelects();
  clearJobForm();
  showToast('Job saved successfully!', 'success', '💼');
  document.getElementById('jobsBadge').textContent = state.jobs.length;
  document.getElementById('jobCount').textContent = state.jobs.length + ' jobs';
}

function clearJobForm() {
  ['jobTitle','jobSkills','jobDesc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('jobDept').value = '';
}

function renderJobs() {
  const cont = document.getElementById('jobsList');
  cont.innerHTML = state.jobs.map(job => `
    <div class="candidate-card" style="--rank-color:var(--accent3)" onclick="selectJobForScreening(${job.id})">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:16px">💼</span>
          <div class="candidate-name">${job.title}</div>
        </div>
        <div class="candidate-meta">
          <span>🏢 ${job.dept}</span>
          <span>📅 ${job.level}</span>
          <span>📆 ${job.created}</span>
        </div>
        <div class="candidate-skills" style="margin-top:8px;">
          ${job.skills.slice(0,4).map(s=>`<span class="skill-tag">${s}</span>`).join('')}
          ${job.skills.length > 4 ? `<span class="skill-tag">+${job.skills.length-4} more</span>` : ''}
        </div>
      </div>
      <button class="btn btn-sm btn-danger" onclick="event.stopPropagation();deleteJob(${job.id})" data-tip="Delete job">🗑️</button>
    </div>
  `).join('');
}

function deleteJob(id) {
  state.jobs = state.jobs.filter(j => j.id !== id);
  renderJobs();
  populateJobSelects();
  document.getElementById('jobsBadge').textContent = state.jobs.length;
  document.getElementById('jobCount').textContent = state.jobs.length + ' jobs';
  showToast('Job deleted', 'info', '🗑️');
}

function selectJobForScreening(id) {
  navigate('screening', document.querySelector('[data-page=screening]'));
  setTimeout(() => {
    document.getElementById('screeningJob').value = id;
    showToast('Job selected for screening', 'info', '✅');
  }, 100);
}

function populateJobSelects() {
  const selects = ['screeningJob', 'candidateFilter'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const cur = el.value;
    el.innerHTML = id === 'screeningJob'
      ? '<option value="">Choose a job to screen for...</option>'
      : '<option value="">All Jobs</option>';
    state.jobs.forEach(j => {
      const opt = document.createElement('option');
      opt.value = j.id; opt.textContent = j.title;
      el.appendChild(opt);
    });
    if (cur) el.value = cur;
  });
}

/* ===== SCORING ENGINE ===== */
function computeScore(resume, job) {
  const w = state.weights;
  const total = Object.values(w).reduce((a,b) => a+b, 0);

  // Skill match (TF-IDF simulation)
  const jSkills = job.skills.map(s => s.toLowerCase());
  const rSkills = resume.skills.map(s => s.toLowerCase());
  const matched = rSkills.filter(s => jSkills.includes(s));
  const partial = rSkills.filter(s => jSkills.some(js => js.includes(s) || s.includes(js)) && !matched.includes(s));
  const skillScore = Math.min(100, (matched.length / Math.max(jSkills.length,1)) * 100 + (partial.length * 10));

  // Experience score
  const expMap = { 'Fresher': 1, 'Mid-Level': 3, 'Senior': 6, 'Lead': 9 };
  const targetExp = expMap[job.level] || 3;
  const expScore = Math.min(100, Math.max(0, 100 - Math.abs(resume.experience - targetExp) * 10));

  // Education score
  const eduKeywords = ['iit','nit','bits','iiit','iim'];
  const eduScore = eduKeywords.some(k => resume.education.toLowerCase().includes(k)) ? 90
    : resume.education.toLowerCase().includes('m.tech') || resume.education.toLowerCase().includes('mba') ? 80
    : 65;

  // Keyword density (simulate cosine similarity with job description)
  const jdWords = job.description.toLowerCase().split(/\s+/);
  const rWords = resume.summary.toLowerCase().split(/\s+/);
  const commonWords = rWords.filter(w => jdWords.includes(w) && w.length > 3);
  const kdScore = Math.min(100, (commonWords.length / Math.max(rWords.length, 1)) * 300);

  // Certifications
  const certScore = Math.min(100, resume.certifications.length * 35);

  const composite =
    (skillScore * w.skillMatch +
     expScore * w.experience +
     eduScore * w.education +
     kdScore * w.keywordDensity +
     certScore * w.certifications) / total;

  return {
    total: Math.round(composite),
    breakdown: {
      skillMatch: Math.round(skillScore),
      experience: Math.round(expScore),
      education: Math.round(eduScore),
      keywordDensity: Math.round(kdScore),
      certifications: Math.round(certScore)
    },
    matchedSkills: matched,
    partialSkills: partial,
    missingSkills: jSkills.filter(s => !rSkills.includes(s))
  };
}

/* ===== SCREENING ===== */
async function runScreening() {
  const jobId = document.getElementById('screeningJob').value;
  if (!jobId) { showToast('Please select a job description', 'error', '⚠️'); return; }
  if (state.parsedResumes.length === 0) { showToast('No resumes found. Please upload resumes first.', 'error', '📄'); return; }

  const job = state.jobs.find(j => j.id == jobId);
  if (!job) return;

  const btn = document.getElementById('runScreenBtn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Screening...';

  const statusEl = document.getElementById('screeningStatus');
  const steps = [
    { icon: '📖', text: 'Parsing resume content...' },
    { icon: '🔤', text: 'Running NLP tokenization...' },
    { icon: '🧮', text: 'Computing TF-IDF vectors...' },
    { icon: '📐', text: 'Calculating cosine similarity...' },
    { icon: '⚖️', text: 'Applying scoring weights...' },
    { icon: '🏆', text: 'Ranking candidates...' }
  ];

  for (let i = 0; i < steps.length; i++) {
    statusEl.innerHTML = `
      <div>
        <div style="font-size:28px;text-align:center;margin-bottom:12px;">${steps[i].icon}</div>
        <div style="text-align:center;color:var(--text2);font-size:13px;margin-bottom:16px;">${steps[i].text}</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${Math.round((i+1)/steps.length*100)}%"></div></div>
        <div style="text-align:right;font-size:11px;color:var(--text3);margin-top:6px;">
          Step ${i+1} of ${steps.length} · ${state.parsedResumes.length} candidates
        </div>
      </div>`;
    await new Promise(r => setTimeout(r, 350));
  }

  // Score all resumes
  const results = state.parsedResumes.map(r => ({
    ...r,
    scored: true,
    scoring: computeScore(r, job),
    jobId: job.id, jobTitle: job.title
  }));
  results.sort((a, b) => b.scoring.total - a.scoring.total);
  state.screeningResults = results;

  statusEl.innerHTML = `
    <div style="text-align:center;padding:12px 0;">
      <div style="font-size:32px;margin-bottom:8px;">✅</div>
      <div style="font-size:15px;font-weight:600;color:var(--green);">Screening Complete!</div>
      <div style="font-size:12px;color:var(--text3);margin-top:4px;">${results.length} candidates ranked</div>
    </div>`;

  btn.innerHTML = '▶ Run AI Screening';
  btn.disabled = false;

  updateStats();
  renderRankedCandidatesWithTopN(results, job);
  document.getElementById('screeningResults').style.display = 'block';
  document.getElementById('screeningResultsSubtitle').textContent = `${results.length} candidates ranked for "${job.title}"`;

  addNotif(`Screening complete: ${results.length} candidates ranked for "${job.title}"`, '🏆');
  showToast(`Screening complete! ${results.length} candidates ranked.`, 'success', '🏆');
  // Update last screening time
  const timeEl = document.getElementById('lastScreeningTime');
  if (timeEl) timeEl.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}

const rankColors = ['#fbbf24','#9898b0','#cd7c54','var(--accent)','var(--accent)'];
const avatarColors = [
  ['#6c63ff','#38bdf8'], ['#f472b6','#fbbf24'], ['#34d399','#38bdf8'],
  ['#f87171','#f472b6'], ['#fbbf24','#34d399'], ['#a78bfa','#6c63ff']
];

// Stores last screening run so pill re-renders always work
let _lastScreeningResults = [];
let _lastScreeningJob = null;

function getSelectedTopN() {
  const activePill = document.querySelector('#shortlistCount .select-pill.active');
  if (!activePill) return null;
  const text = activePill.textContent.trim();
  if (text === 'Top 3') return 3;
  if (text === 'Top 5') return 5;
  if (text === 'Top 10') return 10;
  return null; // All
}

function renderRankedCandidatesWithTopN(results, job) {
  if (results && results.length) _lastScreeningResults = results;
  if (job) _lastScreeningJob = job;
  const allResults = _lastScreeningResults;
  const currentJob = _lastScreeningJob;
  if (!allResults.length) return;
  const n = getSelectedTopN();
  const toShow = (n && n < allResults.length) ? allResults.slice(0, n) : allResults;
  renderRankedCandidates(toShow, currentJob);
  const subtitle = document.getElementById('screeningResultsSubtitle');
  if (subtitle) {
    subtitle.textContent = (n && n < allResults.length)
      ? `Showing Top ${n} of ${allResults.length} candidates for "${currentJob ? currentJob.title : ''}"`
      : `All ${allResults.length} candidates ranked for "${currentJob ? currentJob.title : ''}"`;
  }
}

function togglePill(el, groupId) {
  document.querySelectorAll('#' + groupId + ' .select-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  if (groupId === 'shortlistCount' && _lastScreeningResults.length > 0) {
    renderRankedCandidatesWithTopN(null, null);
  }
}

function renderRankedCandidates(results, job) {
  const cont = document.getElementById('rankedCandidates');
  cont.innerHTML = results.map((r, i) => {
    const rankColor = i === 0 ? '#fbbf24' : i === 1 ? '#9898b0' : i === 2 ? '#cd7c54' : 'var(--text3)';
    const accs = avatarColors[i % avatarColors.length];
    const initials = r.name.split(' ').map(n=>n[0]).join('').slice(0,2);
    const pct = r.scoring.total;
    return `
    <div class="candidate-card" style="--rank-color:${rankColor}" onclick="openCandidateModal(${r.id}, ${job.id})">
      <div class="candidate-rank" style="--rank-color:${rankColor}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1)}</div>
      <div class="candidate-avatar" style="background:linear-gradient(135deg,${accs[0]},${accs[1]});color:white;--acc1:${accs[0]};--acc2:${accs[1]}">
        ${initials}
      </div>
      <div class="candidate-info">
        <div class="candidate-name">${r.name}</div>
        <div class="candidate-meta">
          <span>🏢 ${r.company}</span>
          <span>⏱ ${r.experience}y exp</span>
          <span>📍 ${r.location}</span>
        </div>
        <div class="candidate-skills">
          ${r.scoring.matchedSkills.slice(0,3).map(s=>`<span class="skill-tag">${s}</span>`).join('')}
          ${r.scoring.missingSkills.slice(0,2).map(s=>`<span class="skill-tag missing">✗ ${s}</span>`).join('')}
        </div>
      </div>
      <div class="candidate-score-section">
        <div class="score-circle" style="--pct:${pct};border-color:${rankColor}">
          <div class="score-num" style="color:${rankColor}">${pct}</div>
          <div class="score-pct">/ 100</div>
        </div>
        <div class="score-label">${pct>=80?'🌟 Excellent':pct>=65?'👍 Good':pct>=50?'⚡ Fair':'⚠️ Low'}</div>
      </div>
    </div>`;
  }).join('');
}

/* ===== CANDIDATE MODAL ===== */
function openCandidateModal(resumeId, jobId) {
  const r = state.parsedResumes.find(x => x.id == resumeId) ||
            state.screeningResults.find(x => x.id == resumeId);
  const job = state.jobs.find(j => j.id == jobId);
  if (!r) return;

  // Track which candidate is open
  window._currentModalResumeId = r.id;
  window._currentModalName = r.name;

  const result = state.screeningResults.find(x => x.id == resumeId);
  const scoring = result ? result.scoring : null;
  const initials = r.name.split(' ').map(n=>n[0]).join('').slice(0,2);

  document.getElementById('modalCandidateName').textContent = r.name;
  document.getElementById('modalCandidateMeta').textContent = `${r.role} @ ${r.company} · ${r.experience} years exp`;

  // Update footer buttons
  const shortlistBtn = document.getElementById('modalShortlistBtn');
  const removeBtn = document.getElementById('modalRemoveBtn');
  if (shortlistBtn) {
    const alreadyShortlisted = state.shortlisted && state.shortlisted.has(r.id);
    shortlistBtn.textContent = alreadyShortlisted ? '✅ Shortlisted' : '⭐ Shortlist';
    shortlistBtn.disabled = alreadyShortlisted;
  }
  if (removeBtn) removeBtn.style.display = 'inline-flex';

  const barColors = ['var(--accent)','var(--green)','var(--accent3)','var(--yellow)','var(--pink)'];
  const labels = { skillMatch:'Skill Match', experience:'Experience', education:'Education', keywordDensity:'Keyword Density', certifications:'Certifications' };

  document.getElementById('modalBody').innerHTML = `
    <div style="display:flex;gap:16px;align-items:center;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border)">
      <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,var(--accent),var(--accent3));display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:white;flex-shrink:0">${initials}</div>
      <div style="flex:1">
        <div style="font-family:var(--font-head);font-size:18px;font-weight:700">${r.name}</div>
        <div style="color:var(--text3);font-size:12px">${r.email} · ${r.phone}</div>
        <div style="color:var(--text3);font-size:12px">📍 ${r.location}</div>
      </div>
      ${scoring ? `<div style="text-align:center"><div style="font-family:var(--font-head);font-size:32px;font-weight:800;color:${scoring.total>=80?'var(--green)':scoring.total>=60?'var(--yellow)':'var(--red)'}">${scoring.total}</div><div style="font-size:11px;color:var(--text3)">Match Score</div></div>` : ''}
    </div>

    <div class="grid-2" style="gap:20px;margin-bottom:20px;">
      <div>
        <div style="font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Profile</div>
        <div class="detail-row"><div class="detail-key">Education</div><div class="detail-val">${r.education}</div></div>
        <div class="detail-row"><div class="detail-key">Experience</div><div class="detail-val">${r.experience} years</div></div>
        <div class="detail-row"><div class="detail-key">Company</div><div class="detail-val">${r.company}</div></div>
        <div class="detail-row"><div class="detail-key">Role</div><div class="detail-val">${r.role}</div></div>
        <div class="detail-row" style="border:none"><div class="detail-key">Certifications</div><div class="detail-val">${r.certifications.length || 'None'}</div></div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Summary</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.7;">${r.summary}</div>
        ${r.certifications.length ? `<div style="margin-top:10px;font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Certifications</div>${r.certifications.map(c=>`<span class="chip chip-blue" style="margin:2px 3px 2px 0">${c}</span>`).join('')}` : ''}
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Skills</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${r.skills.map(s => {
          const matched = scoring && scoring.matchedSkills.includes(s.toLowerCase());
          const partial = scoring && scoring.partialSkills.includes(s.toLowerCase());
          return `<span class="skill-tag ${matched?'':''}${partial?'partial':''}" style="${matched?'background:rgba(52,211,153,0.12);color:var(--green);border-color:rgba(52,211,153,0.25);':''}">${matched?'✓ ':''}${s}</span>`;
        }).join('')}
      </div>
      ${scoring && scoring.missingSkills.length ? `
        <div style="margin-top:10px;font-size:12px;color:var(--text3)">Missing required skills:</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
          ${scoring.missingSkills.map(s=>`<span class="skill-tag missing">✗ ${s}</span>`).join('')}
        </div>` : ''}
    </div>

    ${scoring ? `
    <div>
      <div style="font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">Score Breakdown</div>
      <div class="score-breakdown">
        ${Object.entries(scoring.breakdown).map(([k, v], i) => `
          <div class="score-row">
            <div class="score-row-label">${labels[k]||k}</div>
            <div class="score-bar-track"><div class="score-bar-fill" style="width:${v}%;--bar-color:${barColors[i%barColors.length]}"></div></div>
            <div class="score-row-val">${v}</div>
          </div>`).join('')}
      </div>
    </div>

    <div style="margin-top:20px;padding:14px;background:rgba(108,99,255,0.06);border-radius:var(--radius-sm);border:1px solid rgba(108,99,255,0.15);">
      <div style="font-size:12px;font-weight:600;color:var(--accent2);margin-bottom:6px">💡 Skill Gap Recommendations</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.7;">
        ${scoring.missingSkills.length
          ? `To close the skill gap for <b style="color:var(--text)">${job ? job.title : 'this role'}</b>, ${r.name.split(' ')[0]} should upskill in: <b style="color:var(--accent2)">${scoring.missingSkills.slice(0,3).join(', ')}</b>. ${scoring.matchedSkills.length >= 3 ? 'Strong existing skill alignment detected.' : 'Consider candidate for adjacent roles.'}`
          : `${r.name.split(' ')[0]} meets all required skill criteria for this role. Recommend moving to the interview stage.`}
      </div>
    </div>` : ''}
  `;

  document.getElementById('candidateModal').classList.add('open');
}

function closeModal() {
  document.getElementById('candidateModal').classList.remove('open');
}

/* ===== ALL CANDIDATES PAGE ===== */
function renderAllCandidates(filter='', jobId='') {
  const cont = document.getElementById('allCandidates');
  let candidates = state.parsedResumes;
  if (filter) {
    const f = filter.toLowerCase();
    candidates = candidates.filter(c =>
      c.name.toLowerCase().includes(f) ||
      c.skills.some(s => s.toLowerCase().includes(f)) ||
      c.email.toLowerCase().includes(f) ||
      c.company.toLowerCase().includes(f)
    );
  }
  if (!candidates.length) {
    cont.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No results found</div><div class="empty-desc">Try a different search term.</div></div>`;
    return;
  }
  cont.innerHTML = candidates.map((r, i) => {
    const result = state.screeningResults.find(x => x.id === r.id);
    const accs = avatarColors[i % avatarColors.length];
    const initials = r.name.split(' ').map(n=>n[0]).join('').slice(0,2);
    return `
    <div class="candidate-card" style="--rank-color:${accs[0]}" onclick="openCandidateModal(${r.id}, ${result?result.jobId:''})">
      <div class="candidate-avatar" style="background:linear-gradient(135deg,${accs[0]},${accs[1]});color:white;--acc1:${accs[0]};--acc2:${accs[1]}">${initials}</div>
      <div class="candidate-info">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
          <div class="candidate-name">${r.name}</div>
          ${result ? `<span class="chip chip-green" style="font-size:10px">${result.scoring.total}% match</span>` : ''}
        </div>
        <div class="candidate-meta">
          <span>🏢 ${r.company}</span>
          <span>💼 ${r.role}</span>
          <span>⏱ ${r.experience}y</span>
          <span>📍 ${r.location}</span>
        </div>
        <div class="candidate-skills">
          ${r.skills.slice(0,4).map(s=>`<span class="skill-tag">${s}</span>`).join('')}
          ${r.skills.length > 4 ? `<span class="skill-tag">+${r.skills.length-4}</span>` : ''}
        </div>
      </div>
      ${result ? `
      <div style="text-align:right">
        <div style="font-family:var(--font-head);font-size:22px;font-weight:800;color:${result.scoring.total>=80?'var(--green)':result.scoring.total>=60?'var(--yellow)':'var(--red)'}">${result.scoring.total}</div>
        <div style="font-size:10px;color:var(--text3)">Score</div>
      </div>` : '<div style="color:var(--text3);font-size:12px">Not screened</div>'}
    </div>`;
  }).join('');
}

function filterCandidates(val) {
  const v = val !== undefined ? val : document.getElementById('candidateSearch').value;
  renderAllCandidates(v);
}

function sortCandidates(by) {
  if (by === 'score') {
    state.parsedResumes.sort((a,b) => {
      const sa = state.screeningResults.find(x=>x.id===a.id);
      const sb = state.screeningResults.find(x=>x.id===b.id);
      return (sb?.scoring?.total||0) - (sa?.scoring?.total||0);
    });
  } else if (by === 'name') {
    state.parsedResumes.sort((a,b) => a.name.localeCompare(b.name));
  }
  renderAllCandidates(document.getElementById('candidateSearch').value);
}

/* ===== WEIGHTS ===== */
const weightConfig = [
  { key: 'skillMatch', label: 'Skill Match', icon: '🎯', color: '#6c63ff' },
  { key: 'experience', label: 'Experience', icon: '⏱️', color: '#34d399' },
  { key: 'education', label: 'Education', icon: '🎓', color: '#38bdf8' },
  { key: 'keywordDensity', label: 'Keyword Density', icon: '📝', color: '#fbbf24' },
  { key: 'certifications', label: 'Certifications', icon: '📜', color: '#f472b6' }
];

function renderWeightsSliders() {
  document.getElementById('weightsSliders').innerHTML = weightConfig.map(w => `
    <div class="slider-group">
      <div class="slider-header">
        <div class="slider-label">${w.icon} ${w.label}</div>
        <div class="slider-val" id="wval-${w.key}">${state.weights[w.key]}%</div>
      </div>
      <input type="range" class="slider" min="0" max="100" value="${state.weights[w.key]}"
        oninput="updateWeight('${w.key}', this.value)"
        style="accent-color:${w.color}"/>
    </div>
  `).join('');
}

function updateWeight(key, val) {
  state.weights[key] = parseInt(val);
  document.getElementById('wval-'+key).textContent = val + '%';
  renderWeightDistribution();
}

function renderWeightDistribution() {
  const total = Object.values(state.weights).reduce((a,b)=>a+b,0);
  document.getElementById('weightDistribution').innerHTML = `
    <div style="margin-bottom:14px;font-size:12px;color:${total!==100?'var(--red)':'var(--green)'}">
      Total: ${total}% ${total!==100?'⚠️ Should equal 100%':'✅ Balanced'}
    </div>
    ${weightConfig.map(w => `
    <div class="score-row" style="margin-bottom:8px;">
      <div class="score-row-label" style="display:flex;align-items:center;gap:6px;">${w.icon} ${w.label}</div>
      <div class="score-bar-track"><div class="score-bar-fill" style="width:${state.weights[w.key]}%;--bar-color:${w.color}"></div></div>
      <div class="score-row-val">${state.weights[w.key]}%</div>
    </div>`).join('')}`;
}

function applyWeights() {
  const total = Object.values(state.weights).reduce((a,b)=>a+b,0);
  if (total !== 100) {
    showToast(`Weights total ${total}% — must equal 100%`, 'error', '⚠️');
    return;
  }
  showToast('Weights applied! Re-run screening to see updated scores.', 'success', '⚖️');
}

function resetWeights() {
  state.weights = { skillMatch: 40, experience: 25, education: 15, keywordDensity: 10, certifications: 10 };
  renderWeightsSliders();
  renderWeightDistribution();
  showToast('Weights reset to defaults', 'info', '↺');
}

/* ===== INSIGHTS ===== */
function renderInsights() {
  if (!state.screeningResults.length) return;
  const results = state.screeningResults;
  const avg = Math.round(results.reduce((a,r)=>a+r.scoring.total,0)/results.length);
  const top = results.filter(r=>r.scoring.total>=80).length;
  const mid = results.filter(r=>r.scoring.total>=60&&r.scoring.total<80).length;
  const low = results.filter(r=>r.scoring.total<60).length;

  const allSkills = results.flatMap(r=>r.scoring.matchedSkills);
  const skillFreq = {};
  allSkills.forEach(s => skillFreq[s] = (skillFreq[s]||0)+1);
  const topSkills = Object.entries(skillFreq).sort((a,b)=>b[1]-a[1]).slice(0,6);

  const allMissing = results.flatMap(r=>r.scoring.missingSkills);
  const missFreq = {};
  allMissing.forEach(s => missFreq[s] = (missFreq[s]||0)+1);
  const topMissing = Object.entries(missFreq).sort((a,b)=>b[1]-a[1]).slice(0,5);

  document.getElementById('insightsContent').innerHTML = `
    <div class="stats-grid" style="margin-bottom:24px;">
      <div class="stat-card" style="--accent-color:var(--accent2)">
        <div class="stat-glow" style="background:var(--accent2)"></div>
        <div class="stat-icon">📊</div>
        <div class="stat-value">${avg}</div>
        <div class="stat-label">Avg Match Score</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--green)">
        <div class="stat-glow" style="background:var(--green)"></div>
        <div class="stat-icon">🌟</div>
        <div class="stat-value">${top}</div>
        <div class="stat-label">Excellent (80+)</div>
        <div class="stat-change up">↑ ${Math.round(top/results.length*100)}% of pool</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--yellow)">
        <div class="stat-glow" style="background:var(--yellow)"></div>
        <div class="stat-icon">👍</div>
        <div class="stat-value">${mid}</div>
        <div class="stat-label">Good (60–79)</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--red)">
        <div class="stat-glow" style="background:var(--red)"></div>
        <div class="stat-icon">⚠️</div>
        <div class="stat-value">${low}</div>
        <div class="stat-label">Below Threshold</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="section-title" style="margin-bottom:16px">Score Distribution</div>
        <div class="bar-chart" style="height:140px;align-items:flex-end;">
          ${results.map((r,i) => {
            const h = Math.max(10, r.scoring.total);
            const col = r.scoring.total>=80?'var(--green)':r.scoring.total>=60?'var(--yellow)':'var(--red)';
            return `<div class="bar-item">
              <div class="bar-val">${r.scoring.total}</div>
              <div class="bar-fill" style="height:${h}%;--bar-bg:${col};min-height:8px;" onclick="openCandidateModal(${r.id},${r.jobId})"></div>
              <div class="bar-label">${r.name.split(' ')[0]}</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin-bottom:16px">Top Matched Skills</div>
        ${topSkills.map(([skill, count], i) => `
          <div class="score-row" style="margin-bottom:8px;">
            <div class="score-row-label">${skill}</div>
            <div class="score-bar-track"><div class="score-bar-fill" style="width:${Math.round(count/results.length*100)}%;--bar-color:var(--accent)"></div></div>
            <div class="score-row-val">${count}/${results.length}</div>
          </div>`).join('')}
      </div>

      <div class="card">
        <div class="section-title" style="margin-bottom:16px">Most Common Skill Gaps</div>
        ${topMissing.length ? topMissing.map(([skill, count]) => `
          <div class="score-row" style="margin-bottom:8px;">
            <div class="score-row-label" style="color:var(--red)">✗ ${skill}</div>
            <div class="score-bar-track"><div class="score-bar-fill" style="width:${Math.round(count/results.length*100)}%;--bar-color:var(--red)"></div></div>
            <div class="score-row-val">${count}</div>
          </div>`).join('')
          : '<div style="color:var(--text3);font-size:13px;">No significant skill gaps detected</div>'}
      </div>

      <div class="card">
        <div class="section-title" style="margin-bottom:16px">Top 3 Candidates</div>
        ${results.slice(0,3).map((r,i)=>`
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;" onclick="openCandidateModal(${r.id},${r.jobId})">
            <div style="font-size:20px">${i===0?'🥇':i===1?'🥈':'🥉'}</div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;">${r.name}</div>
              <div style="font-size:11px;color:var(--text3);">${r.company} · ${r.experience}y exp</div>
            </div>
            <div style="font-family:var(--font-head);font-size:20px;font-weight:700;color:${r.scoring.total>=80?'var(--green)':'var(--yellow)'}">${r.scoring.total}</div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

/* ===== DASHBOARD ===== */
function renderDashboardTopCandidates() {
  const body = document.getElementById('topCandidatesBody');
  if (!body) return;
  if (!state.screeningResults.length) {
    body.innerHTML = `
      <div class="empty-state" style="padding:40px 20px;">
        <div class="empty-icon" style="font-size:42px;margin-bottom:16px;">🎯</div>
        <div class="empty-title">No candidates ranked yet</div>
        <div class="empty-desc">Upload resumes, add a job description and run<br>screening to see ranked candidates here.</div>
        <button class="btn btn-primary" style="margin-top:18px;" onclick="navigate('upload',document.querySelector('[data-page=upload]'))">Get Started →</button>
      </div>`;
    return;
  }
  const top = state.screeningResults.slice(0, 3);
  const cards = top.map((r, i) => {
    const accs = avatarColors[i % avatarColors.length];
    const initials = r.name.split(' ').map(n=>n[0]).join('').slice(0,2);
    const rankColor = i===0?'#fbbf24':i===1?'#9898b0':'#cd7c54';
    return `<div class="candidate-card" style="--rank-color:${rankColor}" onclick="openCandidateModal(${r.id},${r.jobId})">
      <div class="candidate-rank" style="--rank-color:${rankColor}">${i===0?'🥇':i===1?'🥈':'🥉'}</div>
      <div class="candidate-avatar" style="background:linear-gradient(135deg,${accs[0]},${accs[1]});color:white">${initials}</div>
      <div class="candidate-info">
        <div class="candidate-name">${r.name}</div>
        <div class="candidate-meta"><span>🏢 ${r.company}</span><span>⏱ ${r.experience}y</span></div>
        <div class="candidate-skills">${r.scoring.matchedSkills.slice(0,3).map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>
      </div>
      <div style="font-family:var(--font-head);font-size:26px;font-weight:800;color:${rankColor}">${r.scoring.total}</div>
    </div>`;
  }).join('');
  body.innerHTML = `<div class="candidates-grid">${cards}</div>`;
}

/* ===== STATS ===== */
function updateStats() {
  const total = state.parsedResumes.length;
  const screened = state.screeningResults.length;
  const shortlisted = state.shortlisted ? state.shortlisted.size : 0;
  document.getElementById('stat-resumes').textContent = total;
  document.getElementById('stat-screened').textContent = screened;
  document.getElementById('stat-shortlisted').textContent = shortlisted;
  document.getElementById('stat-jobs').textContent = state.jobs.length;
  const subEl = document.getElementById('stat-resumes-sub');
  if (subEl) subEl.textContent = total > 0 ? '↑ Ready to screen' : '↑ Upload resumes';
  if (total > 0 && screened > 0) {
    document.getElementById('stat-screened-pct').innerHTML = `↑ ${Math.round(screened/total*100)}% screened`;
    document.getElementById('stat-screened-pct').className = 'stat-change up';
  }
  document.getElementById('stat-shortlisted-pct').textContent = shortlisted + ' top matches';
  const jobCountEl = document.getElementById('jobCount');
  if (jobCountEl) jobCountEl.textContent = '↑ Accepting applications';
  // Sync upload stats panel
  const statsTotal = document.getElementById('statsTotal');
  if (statsTotal) statsTotal.textContent = total;
}

/* ===== EXPORT ===== */
function exportCSV() {
  if (!state.screeningResults.length) { showToast('No results to export', 'error', '❌'); return; }
  const rows = [['Rank','Name','Email','Company','Experience','Score','Skill Match','Education','Job']];
  state.screeningResults.forEach((r, i) => {
    rows.push([i+1, r.name, r.email, r.company, r.experience, r.scoring.total, r.scoring.breakdown.skillMatch, r.scoring.breakdown.education, r.jobTitle||'']);
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type: 'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'candidate_rankings.csv'; a.click();
  showToast('CSV exported!', 'success', '📊');
}

function exportResults() {
  showToast('PDF export would open in a real deployment', 'info', '📄');
}

/* ===== GLOBAL SEARCH ===== */
function handleGlobalSearch(val) {
  if (!val) return;
  navigate('candidates', document.querySelector('[data-page=candidates]'));
  setTimeout(() => {
    document.getElementById('candidateSearch').value = val;
    filterCandidates(val);
  }, 100);
}

/* ===== UI HELPERS ===== */
function toggleAccordion(header) {
  const item = header.parentElement;
  item.classList.toggle('open');
}

/* ===== TOAST ===== */
let toastId = 0;
function showToast(msg, type='info', icon='ℹ️') {
  const id = ++toastId;
  const cont = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.id = 'toast-'+id;
  t.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span><span class="toast-close" onclick="dismissToast(${id})">✕</span>`;
  cont.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => dismissToast(id), 4000);
}
function dismissToast(id) {
  const t = document.getElementById('toast-'+id);
  if (!t) return;
  t.classList.remove('show');
  setTimeout(() => t.remove(), 400);
}

/* ===== START ===== */
window.addEventListener('DOMContentLoaded', init);

/* ===== ABOUT MODAL ===== */
function showAboutModal() {
  const m = document.getElementById('aboutModal');
  m.style.display = 'flex';
  requestAnimationFrame(() => m.querySelector('div').style.animation = 'none');
}
function closeAboutModal() {
  document.getElementById('aboutModal').style.display = 'none';
}

/* ===== THEME TOGGLE ===== */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  document.getElementById('themeBtn').textContent = isLight ? '☀️' : '🌙';
  const settingsToggle = document.getElementById('toggle-theme');
  if (settingsToggle) settingsToggle.classList.toggle('on', isLight);
}
function toggleThemeFromSettings(el) {
  el.classList.toggle('on');
  const isLight = el.classList.contains('on');
  document.body.classList.toggle('light-mode', isLight);
  document.getElementById('themeBtn').textContent = isLight ? '☀️' : '🌙';
}

/* ===== NOTIFICATIONS ===== */
const notifications = [];
function addNotif(msg, icon='🔔') {
  notifications.unshift({ msg, icon, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), read: false });
  renderNotifBadge();
}
function renderNotifBadge() {
  const unread = notifications.filter(n => !n.read).length;
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
}
function openNotifPanel() {
  const panel = document.getElementById('notifPanel');
  const isOpen = panel.style.display === 'block';
  panel.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) renderNotifList();
  // close when clicking outside
  if (!isOpen) {
    setTimeout(() => {
      const close = (e) => {
        if (!panel.contains(e.target) && e.target.id !== 'notifBtn') {
          panel.style.display = 'none';
          document.removeEventListener('click', close);
        }
      };
      document.addEventListener('click', close);
    }, 10);
  }
}
function renderNotifList() {
  const list = document.getElementById('notifList');
  if (!notifications.length) {
    list.innerHTML = '<div style="text-align:center;padding:28px;color:var(--text3);font-size:13px;">No notifications yet</div>';
    return;
  }
  list.innerHTML = notifications.map((n,i) => `
    <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 8px;border-radius:8px;${!n.read?'background:rgba(108,99,255,0.06);':''}" onclick="markNotifRead(${i})">
      <span style="font-size:16px;margin-top:1px">${n.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:${n.read?'400':'500'}">${n.msg}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${n.time}</div>
      </div>
      ${!n.read?'<div style="width:7px;height:7px;background:var(--accent);border-radius:50%;margin-top:5px;flex-shrink:0"></div>':''}
    </div>`).join('');
  notifications.forEach(n => n.read = true);
  renderNotifBadge();
}
function markNotifRead(i) { notifications[i].read = true; renderNotifList(); }
function clearNotifs() { notifications.length = 0; renderNotifBadge(); renderNotifList(); }

/* ===== SHORTLIST STATE ===== */
// state.shortlisted is a Set of resume IDs

/* ===== FIX: shortlistCandidate — properly add to shortlist ===== */
function shortlistCandidate() {
  const resumeId = window._currentModalResumeId;
  if (!resumeId) { showToast('No candidate selected', 'error', '❌'); return; }

  if (!state.shortlisted) state.shortlisted = new Set();

  if (state.shortlisted.has(resumeId)) {
    showToast('Already in shortlist!', 'info', '⭐'); return;
  }
  state.shortlisted.add(resumeId);

  // Update button
  const btn = document.getElementById('modalShortlistBtn');
  if (btn) { btn.textContent = '✅ Shortlisted'; btn.disabled = true; }

  updateShortlistBadge();
  renderShortlistedPage();
  updateStats();
  addNotif(`${window._currentModalName || 'Candidate'} added to shortlist`, '⭐');
  showToast('Candidate added to shortlist!', 'success', '⭐');
  setTimeout(closeModal, 800);
}

function removeFromShortlist(resumeId) {
  if (!state.shortlisted) return;
  state.shortlisted.delete(resumeId);
  updateShortlistBadge();
  renderShortlistedPage();
  updateStats();
  if (state.currentPage === 'shortlisted') renderShortlistedPage();
  showToast('Removed from shortlist', 'info', '🗑️');
}

function updateShortlistBadge() {
  const count = state.shortlisted ? state.shortlisted.size : 0;
  const badge = document.getElementById('shortlistBadge');
  if (badge) badge.textContent = count;
  document.getElementById('stat-shortlisted').textContent = count;
  document.getElementById('stat-shortlisted-pct').textContent = count + ' top matches';
}

function renderShortlistedPage() {
  const cont = document.getElementById('shortlistedContent');
  if (!cont) return;
  if (!state.shortlisted || state.shortlisted.size === 0) {
    cont.innerHTML = `<div class="empty-state"><div class="empty-icon">⭐</div><div class="empty-title">No shortlisted candidates yet</div><div class="empty-desc">Run a screening and click ⭐ Shortlist on any candidate to add them here.</div></div>`;
    return;
  }
  const shortlistedResumes = [...state.shortlisted].map(id => {
    return state.parsedResumes.find(r => r.id === id) || state.screeningResults.find(r => r.id === id);
  }).filter(Boolean);

  cont.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <div style="font-size:13px;color:var(--text3)">${shortlistedResumes.length} candidate${shortlistedResumes.length!==1?'s':''} shortlisted</div>
      <button class="btn btn-sm btn-secondary" onclick="exportShortlisted()">📊 Export List</button>
    </div>
    ${shortlistedResumes.map((r,i) => {
      const result = state.screeningResults.find(x => x.id === r.id);
      const accs = avatarColors[i % avatarColors.length];
      const initials = r.name.split(' ').map(n=>n[0]).join('').slice(0,2);
      return `
      <div class="shortlist-card" onclick="openCandidateModal(${r.id}, ${result?result.jobId:''})">
        <span class="shortlist-badge">⭐ SHORTLISTED</span>
        <div class="candidate-avatar" style="background:linear-gradient(135deg,${accs[0]},${accs[1]});color:white;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0">${initials}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:14px;margin-bottom:3px">${r.name}</div>
          <div style="font-size:12px;color:var(--text3);display:flex;gap:12px;flex-wrap:wrap">
            <span>🏢 ${r.company}</span>
            <span>💼 ${r.role}</span>
            <span>⏱ ${r.experience}y exp</span>
          </div>
          <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap">
            ${r.skills.slice(0,5).map(s=>`<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>
        ${result ? `<div style="text-align:center;flex-shrink:0">
          <div style="font-family:var(--font-head);font-size:26px;font-weight:800;color:${result.scoring.total>=80?'var(--green)':result.scoring.total>=60?'var(--yellow)':'var(--red)'}">${result.scoring.total}</div>
          <div style="font-size:10px;color:var(--text3)">Score</div>
        </div>` : ''}
        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation();removeFromShortlist(${r.id})" title="Remove from shortlist" style="flex-shrink:0">🗑️</button>
      </div>`;
    }).join('')}`;
}

function exportShortlisted() {
  if (!state.shortlisted || !state.shortlisted.size) return;
  const rows = [['Name','Company','Role','Experience','Score','Skills']];
  [...state.shortlisted].forEach(id => {
    const r = state.parsedResumes.find(x=>x.id===id) || state.screeningResults.find(x=>x.id===id);
    if (!r) return;
    const result = state.screeningResults.find(x=>x.id===id);
    rows.push([r.name, r.company, r.role, r.experience+'y', result?result.scoring.total:'N/A', r.skills.join('; ')]);
  });
  const csv = rows.map(r=>r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'shortlisted_candidates.csv'; a.click();
  showToast('Shortlist exported!', 'success', '📊');
}

/* ===== FIX: Remove resume from modal ===== */
function removeCurrentResume() {
  const resumeId = window._currentModalResumeId;
  if (!resumeId) return;
  if (!confirm(`Remove this resume permanently?`)) return;
  state.parsedResumes = state.parsedResumes.filter(r => r.id !== resumeId);
  state.screeningResults = state.screeningResults.filter(r => r.id !== resumeId);
  if (state.shortlisted) state.shortlisted.delete(resumeId);
  closeModal();
  updateStats();
  updateShortlistBadge();
  renderAllCandidates();
  renderShortlistedPage();
  document.getElementById('totalResumes').textContent = state.parsedResumes.length;
  document.getElementById('uploadBadge').textContent = state.parsedResumes.length;
  addNotif('A resume was removed from the system', '🗑️');
  showToast('Resume removed', 'info', '🗑️');
}

/* ===== AUTH & LANDING LOGIC ===== */
let currentUser = null;
const demoUsers = [
  { email: 'hr@hireiq.com', password: 'password123', name: 'HR Manager' }
];

function showLanding() {
  document.getElementById('landingScreen').classList.remove('hidden');
  document.getElementById('authScreen').classList.add('hidden');
}

function showAuth(tab) {
  document.getElementById('landingScreen').classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
  switchAuthTab(tab || 'login');
}

function switchAuthTab(tab) {
  document.getElementById('loginTab').classList.toggle('active', tab === 'login');
  document.getElementById('signupTab').classList.toggle('active', tab === 'signup');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
  // Clear and force readonly on signup fields every time the tab is shown
  if (tab === 'signup') {
    const fields = ['signupName', 'signupEmail', 'signupPassword'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = '';
        el.setAttribute('readonly', 'readonly');
      }
    });
    const errEl = document.getElementById('signupError');
    if (errEl) errEl.classList.remove('show');
  }
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  if (!email || !pass) { errEl.textContent = 'Please fill in all fields.'; errEl.classList.add('show'); return; }
  const user = demoUsers.find(u => u.email === email && u.password === pass);
  if (!user) { errEl.textContent = 'Invalid email or password. Try hr@hireiq.com / password123'; errEl.classList.add('show'); return; }
  errEl.classList.remove('show');
  currentUser = user;
  enterApp();
}

function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass = document.getElementById('signupPassword').value;
  const errEl = document.getElementById('signupError');
  if (!name || !email || !pass) { errEl.textContent = 'Please fill in all fields.'; errEl.classList.add('show'); return; }
  if (pass.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; errEl.classList.add('show'); return; }
  const exists = demoUsers.find(u => u.email === email);
  if (exists) { errEl.textContent = 'Email already registered. Please sign in.'; errEl.classList.add('show'); return; }
  errEl.classList.remove('show');
  currentUser = { name, email };
  demoUsers.push({ email, password: pass, name });
  enterApp();
}

function enterApp() {
  const name = currentUser ? currentUser.name : 'HR Manager';
  const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('sidebarName').textContent = name;
  document.getElementById('sidebarAvatar').textContent = initials;
  document.getElementById('pmAvatar').textContent = initials;
  document.getElementById('pmName').textContent = name;
  document.getElementById('pmRole').textContent = currentUser?.email || 'guest@hireiq.com';
  document.getElementById('settingsName').value = name;
  document.getElementById('landingScreen').classList.add('hidden');
  document.getElementById('authScreen').classList.add('hidden');
  renderDashboardTopCandidates();
  addNotif('Welcome to HireIQ! 👋', '🎯');
  showToast('Welcome back, ' + name.split(' ')[0] + '! 👋', 'success', '🎯');
}

function logoutUser() {
  closeProfileModal();
  currentUser = null;
  showLanding();
  showToast('Signed out successfully', 'info', '🚪');
}

/* ===== SIDEBAR TOGGLE ===== */
let sidebarOpen = true;
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const isMobile = window.innerWidth <= 900;
  if (isMobile) {
    const isOpen = sidebar.classList.contains('open');
    sidebar.classList.toggle('open', !isOpen);
    overlay.classList.toggle('show', !isOpen);
  } else {
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('collapsed', !sidebarOpen);
    document.querySelector('.main').style.marginLeft = sidebarOpen ? '220px' : '0';
  }
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

/* ===== PROFILE MODAL ===== */
function openProfileModal() { document.getElementById('profileModal').classList.add('open'); }
function closeProfileModal() { document.getElementById('profileModal').classList.remove('open'); }

/* ===== SETTINGS MODAL ===== */
function openSettingsModal() { document.getElementById('settingsModal').classList.add('open'); }
function closeSettingsModal() { document.getElementById('settingsModal').classList.remove('open'); }
function toggleSetting(el) { el.classList.toggle('on'); showToast('Setting updated', 'success', '✅'); }
function saveName() {
  const name = document.getElementById('settingsName').value.trim();
  if (!name) return;
  const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('sidebarName').textContent = name;
  document.getElementById('sidebarAvatar').textContent = initials;
  document.getElementById('pmAvatar').textContent = initials;
  document.getElementById('pmName').textContent = name;
  if (currentUser) currentUser.name = name;
  showToast('Name updated to "' + name + '"', 'success', '✅');
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeProfileModal(); closeSettingsModal(); closeModal(); closeAboutModal(); }
});
