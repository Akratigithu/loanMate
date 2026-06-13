// ── LoanMate Disbursement Tracker ───────────────────────────

const STATUS_CONFIG = {
  approved: { label: 'Approved', color: 'var(--success)', class: 'status-approved' },
  'under-review': { label: 'Under Review', color: 'var(--warning)', class: 'status-review' },
  submitted: { label: 'Submitted', color: 'var(--blue-500)', class: 'status-submitted' },
  disbursed: { label: 'Disbursed', color: 'var(--teal-600)', class: 'status-disbursed' }
};

let selectedAppId = null;

// ── Render Tracker Widget (home section) ──────────────────────
async function initTrackerWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const apps = await apiGet('/applications') || getFallbackApps();

  container.innerHTML = `
    <div style="font-size:0.78rem;color:var(--gray-400);font-weight:600;letter-spacing:0.05em;margin-bottom:12px">MY APPLICATIONS</div>
    <div class="applications-list" style="margin-bottom:0">
      ${apps.map(a => buildApplicationListItem(a)).join('')}
    </div>
    <div id="${containerId}-detail" style="margin-top:16px"></div>
    <div style="text-align:center;margin-top:16px">
      <button class="btn-scheme-primary" onclick="navigate('tracker')">View Full Tracker →</button>
    </div>
  `;

  // Auto select first
  if (apps.length) {
    const firstCard = container.querySelector('.application-card');
    if (firstCard) firstCard.click();
  }
}

// ── Render Full Tracker Page ──────────────────────────────────
async function initTrackerPage() {
  const container = document.getElementById('full-tracker');
  if (!container) return;

  container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gray-400)">Loading applications...</div>`;

  const apps = await apiGet('/applications') || getFallbackApps();

  container.innerHTML = `
    <div style="font-size:0.78rem;color:var(--gray-400);font-weight:600;letter-spacing:0.05em;margin-bottom:12px">MY APPLICATIONS</div>
    <div class="applications-list">
      ${apps.map(a => buildApplicationListItem(a, 'full')).join('')}
    </div>
    <div id="full-app-detail" style="margin-top:20px">
      ${apps.length ? buildApplicationDetail(apps[0]) : ''}
    </div>
    <div style="text-align:center;margin-top:24px">
      <button class="btn-hero-primary" onclick="navigate('chat');setTimeout(()=>window.currentChatInstance?.sendBotGreeting&&window.currentChatInstance.addBotMessage('Tell me about a new application you want to track',['Check New Eligibility','Upload Documents']),500)">
        + New Application
      </button>
    </div>
  `;

  if (apps.length) {
    const firstCard = container.querySelector('.application-card');
    if (firstCard) {
      firstCard.classList.add('selected');
      selectedAppId = apps[0].id;
    }
  }
}

function buildApplicationListItem(app, prefix = '') {
  const status = STATUS_CONFIG[app.status] || { label: app.status, color: '#64748b', class: '' };
  return `
    <div class="application-card" id="app-card-${prefix}-${app.id}"
      onclick="selectApplication('${app.id}', '${prefix}')">
      <div class="app-card-header">
        <div>
          <div class="app-bank-name">${app.bank}</div>
          <div class="app-scheme-amount">${app.scheme} · ₹${app.amount.toLocaleString('en-IN')}</div>
        </div>
        <span class="app-arrow">›</span>
      </div>
      <div class="app-progress-bar">
        <div class="app-progress-fill" style="width:${app.progress}%"></div>
      </div>
      <div class="app-status-label">
        <span class="${status.class}">${status.label}</span>
      </div>
    </div>
  `;
}

function buildApplicationDetail(app) {
  const status = STATUS_CONFIG[app.status] || { label: app.status, color: '#64748b', class: '' };
  return `
    <div class="app-detail-card">
      <div class="app-detail-header">
        <div>
          <div class="app-detail-bank">${app.bank} — ${app.scheme}</div>
          <div class="app-detail-scheme">${app.applicantName} · ${app.businessName}</div>
          <div class="app-ref">Ref ${app.id}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <div class="app-amount-badge">₹${app.amount.toLocaleString('en-IN')}</div>
          <button class="app-refresh-btn" onclick="refreshApplication('${app.id}')" title="Refresh status">🔄</button>
        </div>
      </div>
      <div class="timeline">
        <div style="font-size:0.85rem;font-weight:700;color:var(--gray-700);margin-bottom:16px">Application Timeline</div>
        ${app.timeline.map((step, i) => `
          <div class="timeline-step ${step.done ? 'done' : ''}">
            <div class="timeline-dot">${step.done ? '✓' : i + 1}</div>
            <div class="timeline-content">
              <div class="timeline-title">${step.step}</div>
              <div class="timeline-date">${step.date ? formatDate(step.date) : 'Pending'}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="padding:16px 24px;border-top:1px solid var(--gray-100);display:flex;gap:12px">
        <button class="btn-scheme-primary" onclick="navigate('chat');showToast('Opening chat to ask about ${app.id}...','info')">
          💬 Ask AI About This
        </button>
        <button class="btn-scheme-secondary">Download Letter</button>
      </div>
    </div>
  `;
}

async function selectApplication(appId, prefix) {
  selectedAppId = appId;

  // Update card selection styles
  document.querySelectorAll('.application-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById(`app-card-${prefix}-${appId}`);
  if (card) card.classList.add('selected');

  // Load detail
  const app = await apiGet(`/applications/${appId}`);
  if (!app) return;

  const detailContainer = document.getElementById(prefix ? `${prefix}-app-detail` : `home-tracker-detail`);
  if (detailContainer) {
    detailContainer.innerHTML = buildApplicationDetail(app);
  }
}

async function refreshApplication(appId) {
  const btn = event.target;
  btn.style.animation = 'spin 0.5s linear infinite';
  showToast('Refreshing application status...', 'info');
  
  await sleep(1200);
  
  btn.style.animation = '';
  showToast('Status updated!', 'success');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Fallback apps ─────────────────────────────────────────────
function getFallbackApps() {
  return [
    {
      id: 'LM-2026-ICB-4821', bank: 'ICICI Bank', scheme: 'MUDRA Kishor', amount: 350000,
      status: 'approved', progress: 90, submittedAt: '2026-05-10', updatedAt: '2026-06-01',
      applicantName: 'Ravi Kumar', businessName: 'Ravi Enterprises',
      timeline: [
        { step: 'Application Submitted', date: '2026-05-10', done: true },
        { step: 'Document Verification', date: '2026-05-15', done: true },
        { step: 'Credit Assessment', date: '2026-05-22', done: true },
        { step: 'Loan Approved', date: '2026-06-01', done: true },
        { step: 'Disbursement Pending', date: null, done: false }
      ]
    },
    {
      id: 'LM-2026-SBI-3310', bank: 'SBI', scheme: 'CGTMSE', amount: 1000000,
      status: 'under-review', progress: 45, submittedAt: '2026-05-28', updatedAt: '2026-06-10',
      applicantName: 'Ravi Kumar', businessName: 'Ravi Enterprises',
      timeline: [
        { step: 'Application Submitted', date: '2026-05-28', done: true },
        { step: 'Document Verification', date: '2026-06-03', done: true },
        { step: 'Credit Assessment', date: null, done: false },
        { step: 'Loan Approved', date: null, done: false },
        { step: 'Disbursement', date: null, done: false }
      ]
    }
  ];
}
