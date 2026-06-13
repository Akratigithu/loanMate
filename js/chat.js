// ── LoanMate Chat Engine ─────────────────────────────────────
// Registry: keyed by containerId so multiple instances can coexist
window.chatInstances = window.chatInstances || {};

// Global helper called by inline onclick attrs — routes to the correct instance
function getChatInstance(containerId) {
  return window.chatInstances[containerId] || Object.values(window.chatInstances)[0];
}

class LoanMateChat {
  constructor(containerId) {
    this.containerId = containerId;
    this.step = 'greeting';
    this.sessionData = {};
    this.messageHistory = [];
    this.uploadedDocs = [];
    this.currentDocType = 'aadhaar';
    // Register this instance
    window.chatInstances[containerId] = this;
    // Keep legacy global for backward compat (points to most recent)
    window.currentChatInstance = this;
    this.render();
    setTimeout(() => this.sendBotGreeting(), 600);
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    const cid = this.containerId;
    container.innerHTML = `
      <div class="chat-box" id="${cid}-box">
        <div class="chat-header">
          <div class="chat-agent-info">
            <div class="chat-avatar">🤖</div>
            <div>
              <div class="chat-agent-name">LoanMate AI Assistant</div>
              <div class="chat-agent-status">
                <span class="chat-status-dot"></span>Online · Typically replies instantly
              </div>
            </div>
          </div>
          <div class="chat-ai-badge">✨ AI Powered</div>
        </div>
        <div class="chat-messages" id="${cid}-messages"></div>
        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <button class="chat-upload-btn" onclick="getChatInstance('${cid}').triggerUpload()" title="Upload Document">📎</button>
            <input class="chat-input" id="${cid}-input" placeholder="Type a message or choose an option above..."
              onkeydown="if(event.key==='Enter')getChatInstance('${cid}').sendUserMessage()" />
          </div>
          <button class="chat-send-btn" onclick="getChatInstance('${cid}').sendUserMessage()" title="Send">➤</button>
        </div>
      </div>
    `;
  }

  get messagesEl() { return document.getElementById(`${this.containerId}-messages`); }
  get inputEl() { return document.getElementById(`${this.containerId}-input`); }

  scrollToBottom() {
    const el = this.messagesEl;
    if (el) el.scrollTop = el.scrollHeight;
  }

  addMessage(type, content) {
    const el = this.messagesEl;
    if (!el) return;
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `
      <div class="message-avatar">${type === 'bot' ? '🤖' : '👤'}</div>
      <div class="message-bubble">${content}</div>
    `;
    el.appendChild(div);
    this.scrollToBottom();
    return div;
  }

  addBotMessage(text, chips = [], extra = '') {
    const el = this.messagesEl;
    if (!el) return;
    const div = document.createElement('div');
    div.className = 'message bot';

    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    const cid = this.containerId;
    const chipsHtml = chips.length ? `
      <div class="message-chips">
        ${chips.map(c => `<button class="chip-btn" onclick="getChatInstance('${cid}').chipClick(this, '${c.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', '${this.step}')">${c}</button>`).join('')}
      </div>` : '';

    div.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-bubble">
        ${formattedText}
        ${chipsHtml}
        ${extra}
      </div>
    `;
    el.appendChild(div);
    this.scrollToBottom();
    return div;
  }

  showTyping() {
    const el = this.messagesEl;
    if (!el) return null;
    const div = document.createElement('div');
    div.className = 'message bot';
    div.id = `${this.containerId}-typing`;
    div.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    el.appendChild(div);
    this.scrollToBottom();
    return div;
  }

  removeTyping() {
    const t = document.getElementById(`${this.containerId}-typing`);
    if (t) t.remove();
  }

  async sendBotGreeting() {
    this.showTyping();
    await sleep(900);
    this.removeTyping();
    this.addBotMessage(
      '👋 Hello! I\'m LoanMate, your AI loan assistant. I\'ll help you find the best government loan scheme for your business. Let\'s start — **what type of business do you run?**',
      ['Manufacturing', 'Retail / Trade', 'Service Business', 'Agriculture-linked']
    );
    this.step = 'businessType';
  }

  async chipClick(btn, value, stepAtClick) {
    // Mark chip as selected
    btn.closest('.message-chips').querySelectorAll('.chip-btn').forEach(b => b.disabled = true);
    btn.classList.add('selected');
    // Show user message
    this.addMessage('user', value);
    await this.processUserInput(value, stepAtClick);
  }

  async sendUserMessage() {
    const input = this.inputEl;
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.addMessage('user', text);
    await this.processUserInput(text, this.step);
  }

  async processUserInput(text, step) {
    this.showTyping();
    // Call the API
    const response = await apiPost('/chat/message', {
      message: text,
      step: step,
      sessionData: this.sessionData
    });
    this.removeTyping();

    if (!response) {
      this.addBotMessage('Sorry, I had trouble processing that. Please try again.', ['Start Over', 'Check Eligibility']);
      return;
    }

    // Merge any extracted data
    if (response.data) {
      this.sessionData = { ...this.sessionData, ...response.data };
    }

    this.step = response.nextStep || step;

    // Handle special actions
    if (response.action === 'check_eligibility') {
      await this.runEligibilityCheck();
    } else if (response.action === 'show_extracted') {
      this.addBotMessage(response.message, response.chips || []);
    } else {
      this.addBotMessage(response.message, response.chips || []);
    }

    // After eligibility show upload offer
    if (this.step === 'eligibility') {
      setTimeout(() => {
        this.addBotMessage(
          '📄 Would you like me to **auto-fill your loan application**? Just upload your documents and I\'ll extract the information automatically.',
          ['Upload Documents', 'Fill Manually', 'Skip for Now']
        );
        this.step = 'upload';
      }, 1500);
    }

    // Handle upload prompt
    if (text === 'Upload Documents' || text === 'upload') {
      setTimeout(() => this.showDocumentUploadPrompt(), 300);
    }

    // Handle track status
    if (text === 'Track My Loan' || text === 'Show All Applications') {
      setTimeout(() => this.showLoanStatus(), 300);
    }
  }

  async runEligibilityCheck() {
    const loadingDiv = this.addBotMessage('🔍 Analyzing your eligibility across all government schemes...');
    
    // Animated dots
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      const bubble = loadingDiv?.querySelector('.message-bubble');
      if (bubble) bubble.textContent = '🔍 Analyzing your eligibility' + '.'.repeat(dots);
    }, 400);

    await sleep(2000);
    clearInterval(interval);
    if (loadingDiv) loadingDiv.remove();

    // Call eligibility API
    const userData = {
      businessType: this.sessionData.businessType,
      turnover: this.sessionData.turnover || 1000000,
      cibilScore: this.sessionData.cibil || 720,
      hasAadhaar: this.sessionData.hasAadhaar !== false,
      hasPan: this.sessionData.hasPan !== false,
      hasDefault: this.sessionData.hasDefault || false
    };

    const result = await apiPost('/schemes/eligibility', userData);
    const results = result?.results || this.getFallbackEligibilityResults(userData);

    const eligible = results.filter(r => r.eligible);
    const intro = eligible.length > 0
      ? `✅ Great news! You're eligible for **${eligible.length} scheme${eligible.length > 1 ? 's' : ''}**. Here are your results:`
      : `⚠️ Based on your profile, let me show you your eligibility status:`;

    const cardsHtml = this.buildEligibilityCards(results);
    this.addBotMessage(intro, [], cardsHtml);
    this.step = 'post_eligibility';
  }

  getFallbackEligibilityResults(userData) {
    const schemes = [
      { schemeId:'mudra-shishu', schemeName:'MUDRA Shishu', loanLimit:'Up to ₹50,000', interestRate:'7%-12% p.a.', maxTurnover:500000, minCibil:0 },
      { schemeId:'mudra-kishor', schemeName:'MUDRA Kishor', loanLimit:'₹50,000 – ₹5 Lakh', interestRate:'8%-13% p.a.', maxTurnover:2500000, minCibil:600 },
      { schemeId:'mudra-tarun', schemeName:'MUDRA Tarun', loanLimit:'₹5 Lakh – ₹10 Lakh', interestRate:'9%-14% p.a.', maxTurnover:10000000, minCibil:650 },
      { schemeId:'cgtmse', schemeName:'CGTMSE', loanLimit:'Up to ₹2 Crore', interestRate:'9%-15% p.a.', maxTurnover:1000000000, minCibil:650 }
    ];

    return schemes.map(s => {
      let eligible = true;
      let reasons = [];
      let score = 100;
      if (userData.hasDefault) { eligible = false; reasons.push('Loan default detected'); score -= 40; }
      if (userData.turnover > s.maxTurnover) { eligible = false; reasons.push('Turnover exceeds limit'); score -= 30; }
      if (s.minCibil > 0 && userData.cibilScore < s.minCibil) { eligible = false; reasons.push(`CIBIL ${userData.cibilScore} < ${s.minCibil}`); score -= 25; }
      if (!userData.hasAadhaar || !userData.hasPan) { eligible = false; reasons.push('Aadhaar/PAN required'); score -= 20; }
      return { ...s, eligible, score: Math.max(0, score), reasons };
    });
  }

  buildEligibilityCards(results) {
    return `
      <div class="eligibility-results">
        ${results.map(r => `
          <div class="eligibility-result-card ${r.eligible ? 'eligible' : 'ineligible'}">
            <div class="result-header">
              <span class="result-name">${r.schemeName}</span>
              <span class="result-status ${r.eligible ? 'status-eligible' : 'status-ineligible'}">
                ${r.eligible ? '✓ Eligible' : '✗ Not Eligible'}
              </span>
            </div>
            <div class="result-details">
              <span>${r.loanLimit}</span>
              <span>${r.interestRate}</span>
            </div>
            ${r.reasons?.length ? `<div style="font-size:0.75rem;color:var(--danger);margin-top:4px">${r.reasons.join(', ')}</div>` : ''}
            <div class="result-score-bar">
              <div class="result-score-fill" style="width:${r.score || 0}%;background:${r.eligible ? 'var(--teal-500)' : 'var(--gray-300)'}"></div>
            </div>
          </div>
        `).join('')}
        ${results.some(r => r.eligible) ? `
          <button class="btn-confirm" style="margin-top:6px" onclick="getChatInstance('${this.containerId}').offerApply()">
            Apply for Best Match →
          </button>` : ''}
      </div>
    `;
  }

  offerApply() {
    this.addBotMessage(
      '🏦 Which bank would you like to apply through?',
      ['SBI — Lowest Rates', 'ICICI — Fastest Processing', 'HDFC — Best Digital', 'PNB — Wide Network']
    );
    this.step = 'select_bank';
  }

  showDocumentUploadPrompt() {
    const el = this.messagesEl;
    const cid = this.containerId;
    const div = document.createElement('div');
    div.className = 'message bot';
    div.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-bubble">
        Please select the document type and upload your file:
        <div class="doc-type-grid" style="margin-top:12px">
          <button class="doc-type-btn active" onclick="getChatInstance('${cid}').selectDocType(this,'aadhaar')">🪪 Aadhaar Card</button>
          <button class="doc-type-btn" onclick="getChatInstance('${cid}').selectDocType(this,'pan')">🗒️ PAN Card</button>
          <button class="doc-type-btn" onclick="getChatInstance('${cid}').selectDocType(this,'gst')">📋 GST Certificate</button>
          <button class="doc-type-btn" onclick="getChatInstance('${cid}').selectDocType(this,'bankStatement')">🏦 Bank Statement</button>
        </div>
        <div class="doc-upload-card" onclick="getChatInstance('${cid}').triggerUpload()" style="margin-top:8px">
          <div class="doc-upload-icon">📤</div>
          <div class="doc-upload-text">Click to Upload Document</div>
          <div class="doc-upload-sub">PDF, JPG or PNG · Max 10MB</div>
        </div>
      </div>
    `;
    el.appendChild(div);
    this.scrollToBottom();
    this.currentDocType = 'aadhaar';
  }

  selectDocType(btn, type) {
    btn.closest('.doc-type-grid').querySelectorAll('.doc-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.currentDocType = type;
  }

  triggerUpload() {
    document.getElementById('docFileInput').click();
  }

  async processUploadedFile(file, docType) {
    this.addMessage('user', `📎 Uploaded: ${file.name}`);
    
    // Show upload progress
    const progressDiv = document.createElement('div');
    progressDiv.className = 'message bot';
    progressDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-bubble">
        <div class="upload-progress">
          <div class="upload-progress-header">
            <span class="upload-file-name">${file.name}</span>
            <span class="upload-pct" id="upload-pct">0%</span>
          </div>
          <div class="upload-bar">
            <div class="upload-bar-fill" id="upload-bar-fill" style="width:0%"></div>
          </div>
        </div>
      </div>
    `;
    this.messagesEl.appendChild(progressDiv);
    this.scrollToBottom();

    // Simulate progress
    let pct = 0;
    const prog = setInterval(() => {
      pct += Math.random() * 25;
      if (pct > 95) pct = 95;
      const fill = document.getElementById('upload-bar-fill');
      const pctEl = document.getElementById('upload-pct');
      if (fill) fill.style.width = pct + '%';
      if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    }, 200);

    await sleep(1800);
    clearInterval(prog);
    const fill = document.getElementById('upload-bar-fill');
    const pctEl = document.getElementById('upload-pct');
    if (fill) fill.style.width = '100%';
    if (pctEl) pctEl.textContent = '100%';
    progressDiv.remove();

    // Get extracted data from API
    const extracted = await apiPost('/chat/extract', { documentType: docType || this.currentDocType });
    if (extracted?.extractedData) {
      this.showExtractedData(extracted.extractedData, extracted.documentType);
    }
  }

  showExtractedData(data, docType) {
    const docNames = { aadhaar:'Aadhaar Card', pan:'PAN Card', gst:'GST Certificate', bankStatement:'Bank Statement' };
    const el = this.messagesEl;
    const div = document.createElement('div');
    div.className = 'message bot';
    const fields = Object.entries(data).filter(([k]) => k !== 'confidence');
    div.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-bubble">
        ✅ Successfully extracted from your <strong>${docNames[docType] || docType}</strong>:
        <div class="extracted-data-card" style="margin-top:10px">
          <div class="extracted-header">
            <span class="extracted-header-icon">📄</span>
            <span class="extracted-header-title">${docNames[docType] || docType}</span>
            <span class="extracted-confidence">${data.confidence}% Confidence</span>
          </div>
          <div class="extracted-fields">
            ${fields.map(([k, v]) => `
              <div class="extracted-field">
                <span class="extracted-label">${formatFieldName(k)}</span>
                <span class="extracted-value">${v}</span>
              </div>
            `).join('')}
          </div>
          <div class="extracted-actions">
            <button class="btn-confirm" onclick="getChatInstance('${this.containerId}').confirmExtracted(this)">✓ Confirm & Auto-fill</button>
            <button class="btn-edit-extracted" onclick="getChatInstance('${this.containerId}').editExtracted()">Edit</button>
          </div>
        </div>
      </div>
    `;
    el.appendChild(div);
    this.scrollToBottom();
  }

  async confirmExtracted(btn) {
    btn.textContent = '✓ Confirmed!';
    btn.disabled = true;
    await sleep(300);
    this.uploadedDocs.push(this.currentDocType);
    this.addBotMessage(
      `✅ Information confirmed! Would you like to upload another document, or shall we proceed with the application?`,
      ['Upload Another Document', 'Proceed to Apply', 'Skip & Apply Later']
    );
    this.step = 'post_upload';
    showToast('Document data confirmed and auto-filled!', 'success');
  }

  editExtracted() {
    this.addBotMessage('You can edit the information in the application form. Shall I open the form?',
      ['Yes, Open Form', 'No, Confirm As Is']);
  }

  async showLoanStatus() {
    this.showTyping();
    await sleep(1200);
    this.removeTyping();

    const apps = await apiGet('/applications');
    if (!apps || !apps.length) {
      this.addBotMessage('You have no active applications. Would you like to start a new one?',
        ['Check Eligibility', 'Explore Schemes']);
      return;
    }

    const statusColors = { approved:'var(--success)', 'under-review':'var(--warning)', submitted:'var(--blue-500)', disbursed:'var(--teal-600)' };
    const statusLabels = { approved:'✅ Approved', 'under-review':'⏳ Under Review', submitted:'📝 Submitted', disbursed:'💰 Disbursed' };

    const cardsHtml = `
      <div class="eligibility-results">
        ${apps.map(a => `
          <div class="eligibility-result-card eligible">
            <div class="result-header">
              <span class="result-name">${a.bank}</span>
              <span class="result-status" style="background:transparent;color:${statusColors[a.status]||'#64748b'};padding:0">${statusLabels[a.status] || a.status}</span>
            </div>
            <div class="result-details">
              <span>${a.scheme}</span>
              <span>₹${(a.amount).toLocaleString('en-IN')}</span>
              <span style="font-family:monospace;font-size:0.72rem">${a.id}</span>
            </div>
            <div class="result-score-bar" style="margin-top:6px">
              <div class="result-score-fill" style="width:${a.progress}%;background:linear-gradient(90deg,var(--navy-700),var(--teal-500))"></div>
            </div>
          </div>
        `).join('')}
        <button class="btn-confirm" style="margin-top:6px" onclick="navigate('tracker')">
          View Full Tracker →
        </button>
      </div>
    `;
    this.addBotMessage(`📊 Here are your **${apps.length} active application${apps.length > 1 ? 's' : ''}**:`, [], cardsHtml);
  }
}

// ── Helpers ──────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function formatFieldName(key) {
  const map = {
    name: 'Full Name', dob: 'Date of Birth', address: 'Address',
    aadhaarNumber: 'Aadhaar No.', panNumber: 'PAN No.',
    fatherName: 'Father\'s Name', businessName: 'Business Name',
    gstin: 'GSTIN', state: 'State', registrationDate: 'Reg. Date',
    businessType: 'Business Type', annualTurnover: 'Annual Turnover',
    accountHolder: 'Account Holder', bankName: 'Bank', accountNumber: 'Account No.',
    averageMonthlyBalance: 'Avg. Monthly Balance', monthlyInflow: 'Monthly Inflow',
    gender: 'Gender', creditScore: 'Credit Score'
  };
  return map[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

// ── Public Init ───────────────────────────────────────────────
function initChatWidget(containerId) {
  const el = document.getElementById(containerId);
  if (el && !window.chatInstances[containerId]) {
    new LoanMateChat(containerId);
  } else if (window.chatInstances[containerId]) {
    // Update global pointer when switching to this widget's page
    window.currentChatInstance = window.chatInstances[containerId];
  }
}

function initChatPage() {
  const containerId = 'full-chat-wrapper';
  const el = document.getElementById(containerId);
  if (el && !window.chatInstances[containerId]) {
    new LoanMateChat(containerId);
  } else if (window.chatInstances[containerId]) {
    window.currentChatInstance = window.chatInstances[containerId];
  }
}

// Update the file upload handler to use the active page's chat instance
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  // Find the visible chat instance
  const activeChat = Object.values(window.chatInstances || {}).find(inst => {
    const box = document.getElementById(inst.containerId + '-box');
    return box && box.offsetParent !== null;
  }) || window.currentChatInstance;
  if (activeChat) {
    activeChat.processUploadedFile(file, activeChat.currentDocType || 'aadhaar');
  }
  // Reset input
  event.target.value = '';
}
