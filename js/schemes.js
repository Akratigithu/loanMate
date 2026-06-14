// ── LoanMate Schemes & Banks ─────────────────────────────────

let schemesData = null;
let banksData = null;

const TAG_CLASSES = {
  teal: 'tag-teal', blue: 'tag-blue', purple: 'tag-purple', orange: 'tag-orange'
};

const BADGE_COLORS = {
  teal: 'background:rgba(20,184,166,0.12);color:#0d9488',
  red: 'background:rgba(239,68,68,0.1);color:#dc2626',
  orange: 'background:rgba(249,115,22,0.1);color:#f97316',
  blue: 'background:rgba(37,99,235,0.1);color:#2563eb'
};

// ── Load Data ─────────────────────────────────────────────────
async function loadSchemes() {
  if (schemesData) return schemesData;
  const data = await apiGet('/schemes');
  schemesData = data || getFallbackSchemes();
  return schemesData;
}

async function loadBanks() {
  if (banksData) return banksData;
  const data = await apiGet('/schemes/banks');
  banksData = data || getFallbackBanks();
  return banksData;
}

// ── Render Scheme Tabs + Cards ────────────────────────────────
async function initSchemeComponents(tabsId, cardsId) {
  const schemes = await loadSchemes();
  const tabsEl = document.getElementById(tabsId);
  const cardsEl = document.getElementById(cardsId);
  if (!tabsEl || !cardsEl) return;

  // Build tabs
  tabsEl.innerHTML = schemes.map((s, i) => `
    <button class="scheme-tab ${i === 0 ? 'active' : ''}"
      onclick="switchSchemeTab('${tabsId}', '${cardsId}', '${s.id}', this)">
      ${s.name}
    </button>
  `).join('');

  // Build cards
  cardsEl.innerHTML = schemes.map((s, i) => `
    <div class="scheme-card ${i === 0 ? 'active' : ''}" id="${cardsId}-${s.id}">
      <div class="scheme-card-header">
        <div>
          <div class="scheme-name-row">
            <h3 class="scheme-name">${s.name}</h3>
            <span class="scheme-tag ${TAG_CLASSES[s.tagColor] || 'tag-teal'}">${s.tag}</span>
          </div>
          <p class="scheme-desc">${s.description}</p>
        </div>
        <div class="scheme-stats">
          <div>
              <div class="scheme-stat-label">${t('loanLimit')}</div>
            <div class="scheme-stat-value">${s.loanLimit}</div>
          </div>
          <div>
            <div class="scheme-stat-label">${t('interestRate')}</div>
            <div class="scheme-stat-value">${s.interestRate}</div>
          </div>
        </div>
      </div>
      <div class="scheme-card-body">
        <div class="scheme-card-left">
          <div class="eligibility-title">
            <span style="color:var(--teal-500)">ⓘ</span> ${t('eligibilityCriteria')}
          </div>
          <ul class="eligibility-list">
            ${s.eligibility.map(e => `
              <li class="eligibility-item">
                <span class="check-icon">✓</span>
                ${e}
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="scheme-card-right">
          <div class="details-title">${t('loanDetails')}</div>
          <div class="detail-row"><span class="detail-label">${t('collateral')}</span><span class="detail-value">${s.collateral}</span></div>
          <div class="detail-row"><span class="detail-label">${t('eligibleSectors')}</span><span class="detail-value">${s.sectors}</span></div>
          <div class="detail-row"><span class="detail-label">${t('guaranteeBody')}</span><span class="detail-value">${s.guaranteeBody}</span></div>
          <div class="detail-row"><span class="detail-label">${t('repaymentTenure')}</span><span class="detail-value">${s.tenure}</span></div>
        </div>
      </div>
      <div class="scheme-card-footer">
        <button class="btn-scheme-primary" onclick="navigate('chat');showToast(t('startingEligibilityCheck',{name:'${s.name}'}),'info')">
          ${t('checkMyEligibility')}
        </button>
        <button class="btn-scheme-secondary" onclick="navigate('chat')">${t('learnMore')}</button>
      </div>
    </div>
  `).join('');
}

function switchSchemeTab(tabsId, cardsId, schemeId, btn) {
  // Toggle tab buttons
  const tabsEl = document.getElementById(tabsId);
  tabsEl.querySelectorAll('.scheme-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  // Toggle cards
  const cardsEl = document.getElementById(cardsId);
  cardsEl.querySelectorAll('.scheme-card').forEach(c => c.classList.remove('active'));
  const target = document.getElementById(`${cardsId}-${schemeId}`);
  if (target) target.classList.add('active');
}

// ── Render Banks ──────────────────────────────────────────────
async function initBankComponents(gridId, limit = null) {
  const banks = await loadBanks();
  const gridEl = document.getElementById(gridId);
  if (!gridEl) return;

  const displayBanks = limit ? banks.slice(0, limit) : banks;

  gridEl.innerHTML = displayBanks.map(b => `
    <div class="bank-card">
      <div class="bank-card-header">
        <div class="bank-logo" style="background:${b.bgColor}">${b.shortName}</div>
        <div class="bank-info">
          <div class="bank-name">${b.name}</div>
          <div class="bank-rating">⭐ ${b.rating} · ${b.type}</div>
        </div>
        <span class="bank-badge" style="${BADGE_COLORS[b.badgeColor] || BADGE_COLORS.teal}">${b.badge}</span>
      </div>
      <div class="bank-stats-grid">
        <div class="bank-stat-box">
          <div class="bank-stat-label">Min. CIBIL</div>
          <div class="bank-stat-value">${b.minCibil}+</div>
        </div>
        <div class="bank-stat-box">
          <div class="bank-stat-label">Processing</div>
          <div class="bank-stat-value">${b.processingDays}</div>
        </div>
        <div class="bank-stat-box">
          <div class="bank-stat-label">Min. Loan</div>
          <div class="bank-stat-value">${b.minLoan}</div>
        </div>
        <div class="bank-stat-box">
          <div class="bank-stat-label">Max. Loan</div>
          <div class="bank-stat-value">${b.maxLoan}</div>
        </div>
      </div>
      <div class="bank-schemes-label">Available Schemes</div>
      <div class="bank-schemes">
        ${b.schemes.map(s => `<span class="scheme-chip">${s}</span>`).join('')}
      </div>
      <div class="bank-collateral-note">🕐 ${b.collateralNote}</div>
      <div class="bank-card-footer">
        <button class="btn-bank-primary" style="background:${b.bgColor}"
          onclick="navigate('chat');showToast(t('checkingEligibility',{name:'${b.name}'}),'info')">
          ${t('viewCriteria')}
        </button>
        <button class="btn-bank-secondary" onclick="showToast(t('compareComingSoon'),'info')">${t('compare')}</button>
      </div>
    </div>
  `).join('');
}

// ── Page-specific inits ───────────────────────────────────────
async function initSchemesPage() {
  await initSchemeComponents('full-schemes-tabs', 'full-schemes-cards');
}

async function initBanksPage() {
  await initBankComponents('full-banks-grid');
}

// ── Eligibility Check ─────────────────────────────────────────
async function checkEligibility(userData) {
  const result = await apiPost('/schemes/eligibility', userData);
  return result;
}

// ── Fallback Data (offline) ───────────────────────────────────
function getFallbackSchemes() {
  return [
    {
      id: 'mudra-shishu', name: 'MUDRA Shishu', tag: 'No Collateral', tagColor: 'teal',
      description: 'For micro-enterprises starting up',
      loanLimit: 'Up to ₹50,000', interestRate: '7%-12% p.a.',
      collateral: 'No collateral required', sectors: 'All sectors',
      guaranteeBody: 'MUDRA / SIDBI', tenure: '3-7 years',
      eligibility: ['Annual turnover < ₹5 lakhs','Non-farm income-generating activities','No existing default on loans','Valid Aadhaar & PAN'],
      maxTurnover: 500000, minCibil: 0
    },
    {
      id: 'mudra-kishor', name: 'MUDRA Kishor', tag: 'Popular', tagColor: 'blue',
      description: 'For established micro-enterprises',
      loanLimit: '₹50,000 – ₹5 Lakh', interestRate: '8%-13% p.a.',
      collateral: 'Optional for < ₹10L', sectors: 'Manufacturing, Services, Trade',
      guaranteeBody: 'MUDRA / Bank', tenure: '3-7 years',
      eligibility: ['Annual turnover < ₹25 lakhs','Business operational for 6+ months','No existing default on loans','Valid Aadhaar, PAN & GST (optional)'],
      maxTurnover: 2500000, minCibil: 600
    },
    {
      id: 'mudra-tarun', name: 'MUDRA Tarun', tag: 'High Value', tagColor: 'purple',
      description: 'For growing small enterprises',
      loanLimit: '₹5 Lakh – ₹10 Lakh', interestRate: '9%-14% p.a.',
      collateral: 'May be required', sectors: 'All sectors',
      guaranteeBody: 'MUDRA / Bank', tenure: '5-7 years',
      eligibility: ['Annual turnover < ₹1 crore','Business operational for 1+ year','CIBIL score 650+','Valid Aadhaar, PAN & GST'],
      maxTurnover: 10000000, minCibil: 650
    },
    {
      id: 'cgtmse', name: 'CGTMSE', tag: 'No Guarantor', tagColor: 'orange',
      description: 'Credit Guarantee Fund for Micro & Small Enterprises',
      loanLimit: 'Up to ₹2 Crore', interestRate: '9%-15% p.a.',
      collateral: 'No third-party guarantee', sectors: 'Manufacturing & Services',
      guaranteeBody: 'CGTMSE / SIDBI', tenure: '5-10 years',
      eligibility: ['Annual turnover < ₹100 crore','Registered MSE unit','CIBIL score 650+','No NPA in last 2 years'],
      maxTurnover: 1000000000, minCibil: 650
    }
  ];
}

function getFallbackBanks() {
  return [
    { id:'sbi', name:'State Bank of India', shortName:'SBI', badge:'Lowest interest rates', badgeColor:'teal', bgColor:'#1a3a6b', rating:4.5, type:'MSME Lender', minCibil:650, processingDays:'7-15 days', minLoan:'₹50,000', maxLoan:'₹2 Crore', schemes:['MUDRA','CGTMSE','Stand-Up India'], collateralNote:'Collateral: Optional < ₹10L' },
    { id:'pnb', name:'Punjab National Bank', shortName:'PNB', badge:'Widest branch network', badgeColor:'red', bgColor:'#8b1a1a', rating:4.2, type:'MSME Lender', minCibil:660, processingDays:'10-20 days', minLoan:'₹1 Lakh', maxLoan:'₹1 Crore', schemes:['MUDRA','PMEGP'], collateralNote:'Collateral: Required > ₹5L' },
    { id:'icici', name:'ICICI Bank', shortName:'ICICI', badge:'Fastest processing', badgeColor:'orange', bgColor:'#b84c00', rating:4.4, type:'MSME Lender', minCibil:680, processingDays:'5-10 days', minLoan:'₹1 Lakh', maxLoan:'₹2 Crore', schemes:['MUDRA','CGTMSE'], collateralNote:'Collateral: Optional < ₹20L' },
    { id:'hdfc', name:'HDFC Bank', shortName:'HDFC', badge:'Best digital experience', badgeColor:'blue', bgColor:'#00447c', rating:4.3, type:'MSME Lender', minCibil:670, processingDays:'7-12 days', minLoan:'₹2 Lakh', maxLoan:'₹3 Crore', schemes:['MUDRA','CGTMSE','PMEGP'], collateralNote:'Collateral: Optional < ₹15L' }
  ];
}
