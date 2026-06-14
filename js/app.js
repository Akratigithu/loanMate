// ── LoanMate App — Core Router & State ──────────────────────
const API_BASE = '/api';
let darkMode = false;
let menuOpen = false;
let currentPage = null;
let currentLang = localStorage.getItem('loanmateLang') || 'en';
document.documentElement.lang = currentLang;

const TRANSLATIONS = {
  en: {
    navHome: 'Home',
    navSchemes: 'Schemes',
    navBanks: 'Banks',
    navChat: 'AI Agent',
    navTracker: 'Track Loan',
    languageBtn: 'हिंदी',
    login: 'Log In',
    signup: 'Sign Up',
    heroBadge: 'AI-Powered · Trusted by 12,000+ MSMEs',
    heroTitle: 'AI-powered Loan<br/><span class="accent">Assistant</span> for MSMEs',
    heroSubtitle: 'Check eligibility, auto-fill forms, and track loan status — all conversationally. Get matched to the right government scheme in minutes.',
    heroPrimary: '💬 Get Started Free →',
    heroSecondary: 'Explore Schemes',
    heroTrust1: 'SIDBI Partner',
    heroTrust2: 'RBI Compliant',
    heroTrust3: 'ISO 27001 Certified',
    howTag: 'How It Works',
    howTitle: 'From Chat to Cash in 4 Steps',
    howSubtitle: 'Our AI agent guides you through the entire loan journey — no bank visits needed.',
    step1Title: 'Chat with AI',
    step1Desc: 'Answer a few conversational questions about your business to get started.',
    step2Title: 'Check Eligibility',
    step2Desc: 'AI checks your eligibility across 10+ government schemes instantly.',
    step3Title: 'Auto-fill Forms',
    step3Desc: 'Upload Aadhaar, PAN, GST — AI extracts and fills application forms automatically.',
    step4Title: 'Track Disbursement',
    step4Desc: 'Real-time updates on your loan status from submission to disbursement.',
    schemesTag: 'Loan Schemes',
    schemesTitle: 'Find Your Perfect Scheme',
    schemesSubtitle: 'Government-backed schemes with low interest rates and flexible repayment.',
    schemesButton: 'View All Schemes →',
    banksTag: 'Partner Banks',
    banksTitle: 'Available Banks & Lenders',
    banksSubtitle: 'Choose from top partner banks with competitive rates and fast processing.',
    chatTeaserTag: 'AI Chat Interface',
    chatTeaserTitle: 'Talk to LoanMate AI',
    chatTeaserSubtitle: 'Answer a few few questions and get matched to the best scheme in minutes.',
    trackerTag: 'Loan Status',
    trackerTitle: 'Track Your Loan Status',
    trackerSubtitle: 'Real-time updates on your loan application across all banks.',
    chatPageTag: 'AI Chat Interface',
    chatPageTitle: 'Talk to LoanMate AI',
    chatPageSubtitle: 'I can check eligibility, auto-fill applications, and track your disbursements.',
    loginTitle: 'Welcome back',
    loginSub: 'Sign in to access your loan dashboard',
    loginPhoneLabel: 'Phone Number / Email',
    loginPhonePlaceholder: '+91 9876543210',
    loginPasswordLabel: 'Password',
    loginPasswordPlaceholder: 'Enter your password',
    loginSubmit: 'Sign In',
    loginSignupText: "Don't have an account? ",
    signupTitle: 'Create Account',
    signupSub: 'Join 12,000+ MSMEs using LoanMate',
    signupNameLabel: 'Full Name',
    signupNamePlaceholder: 'Ravi Kumar',
    signupPhoneLabel: 'Phone Number',
    signupPhonePlaceholder: '+91 9876543210',
    signupBusinessLabel: 'Business Name',
    signupBusinessPlaceholder: 'Ravi Enterprises',
    signupPasswordLabel: 'Password',
    signupPasswordPlaceholder: 'Create a strong password',
    signupSubmit: 'Create Account',
    signupLoginText: 'Already have an account? ',
    chatInputPlaceholder: 'Type a message or choose an option above...',
    languageToggleTitle: 'Switch language',
    myApplications: 'MY APPLICATIONS',
    applicationTimeline: 'Application Timeline',
    downloadLetter: 'Download Letter',
    newApplication: '+ New Application',
    askAIAboutThis: '💬 Ask AI About This',
    refreshStatus: 'Refresh status',
    chatAgentName: 'LoanMate AI Assistant',
    chatAgentStatus: 'Online · Typically replies instantly',
    botGreeting: '👋 Hello! I\'m LoanMate, your AI loan assistant. I\'ll help you find the best government loan scheme for your business. Let\'s start — **what type of business do you run?**',
    botGreetingChips: ['Manufacturing', 'Retail / Trade', 'Service Business', 'Agriculture-linked'],
    uploadPrompt: '📄 Would you like me to **auto-fill your loan application**? Just upload your documents and I\'ll extract the information automatically.',
    uploadPromptChips: ['Upload Documents', 'Fill Manually', 'Skip for Now'],
    selectDocumentPrompt: 'Please select the document type and upload your file:',
    docTypeAadhaar: '🪪 Aadhaar Card',
    docTypePan: '🗒️ PAN Card',
    docTypeGst: '📋 GST Certificate',
    docTypeBankStatement: '🏦 Bank Statement',
    uploadCardText: 'Click to Upload Document',
    uploadCardSub: 'PDF, JPG or PNG · Max 10MB',
    confirmExtractedMessage: '✅ Information confirmed! Would you like to upload another document, or shall we proceed with the application?',
    confirmExtractedChips: ['Upload Another Document', 'Proceed to Apply', 'Skip & Apply Later'],
    confirmAndAutoFill: '✓ Confirm & Auto-fill',
    editExtractedQuestion: 'You can edit the information in the application form. Shall I open the form?',
    editExtractedChips: ['Yes, Open Form', 'No, Confirm As Is'],
    editButton: 'Edit',
    noApplications: 'You have no active applications. Would you like to start a new one?',
    noApplicationsChips: ['Check Eligibility', 'Explore Schemes'],
    activeApplications: '📊 Here are your **{{count}} active application{{plural}}**:',
    offerApply: '🏦 Which bank would you like to apply through?',
    offerApplyChips: ['SBI — Lowest Rates', 'ICICI — Fastest Processing', 'HDFC — Best Digital', 'PNB — Wide Network'],
    viewFullTrackerButton: 'View Full Tracker →',
    apiErrorMessage: 'Sorry, I had trouble processing that. Please try again.',
    startOver: 'Start Over',
    checkEligibility: 'Check Eligibility',
    trackMyLoan: 'Track My Loan',
    showAllApplications: 'Show All Applications',
    eligible: '✓ Eligible',
    notEligible: '✗ Not Eligible',
    applyBestMatch: 'Apply for Best Match →',
    loanLimit: 'Loan Limit',
    interestRate: 'Interest Rate',
    eligibilityCriteria: 'Eligibility Criteria',
    loanDetails: 'Loan Details',
    collateral: 'Collateral',
    eligibleSectors: 'Eligible Sectors',
    guaranteeBody: 'Guarantee Body',
    repaymentTenure: 'Repayment Tenure',
    checkMyEligibility: 'Check My Eligibility →',
    learnMore: 'Learn More',
    compareComingSoon: 'Compare feature coming soon!',
    eligibilityAnalysis: 'Analyzing eligibility',
    eligibilityProgressPrefix: 'Checking eligibility',
    documentDataConfirmed: 'Document data confirmed.',
    yesOpenForm: 'Yes, open form',
    noConfirmAsIs: 'No, confirm as is',
    uploadButtonTitle: 'Upload Document',
    sendButtonTitle: 'Send',
    uploadedFileLabel: '📎 Uploaded:',
    openingChatAbout: 'Opening chat to ask about {{id}}...',
    welcomeBackSuccess: 'Welcome back! Logged in successfully.',
    accountCreatedSuccess: 'Account created! Welcome to LoanMate.',
    viewCriteria: 'View Criteria ↗',
    startingEligibilityCheck: 'Starting eligibility check for {{name}}...',
    checkingEligibility: 'Checking eligibility for {{name}}...',
    refreshingApplicationStatus: 'Refreshing application status...',
    statusUpdated: 'Status updated!',
    uploadDocumentTitle: 'Upload Document',
    minCibil: 'Min. CIBIL',
    processing: 'Processing',
    minLoan: 'Min. Loan',
    maxLoan: 'Max. Loan',
    availableSchemes: 'Available Schemes',
    compare: 'Compare',
    loadingApplications: 'Loading applications...',
    refText: 'Ref',
    pendingText: 'Pending',
    statusApproved: 'Approved',
    statusUnderReview: 'Under Review',
    statusSubmitted: 'Submitted',
    statusDisbursed: 'Disbursed'
  },
  hi: {
    navHome: 'मुखपृष्ठ',
    navSchemes: 'योजनाएँ',
    navBanks: 'बैंक',
    navChat: 'AI एजेंट',
    navTracker: 'ऋण ट्रैक करें',
    languageBtn: 'EN',
    login: 'लॉग इन',
    signup: 'साइन अप',
    heroBadge: 'AI-समर्थित · 12,000+ MSMEs द्वारा विश्वसनीय',
    heroTitle: 'AI-संचालित ऋण<br/><span class="accent">सहायक</span> MSMEs के लिए',
    heroSubtitle: 'पात्रता जांचें, फ़ॉर्म ऑटो-फ़िल करें, और ऋण स्थिति ट्रैक करें — पूरी तरह से बातचीत में। कुछ ही मिनटों में सही सरकारी योजना प्राप्त करें।',
    heroPrimary: '💬 मुफ्त शुरू करें →',
    heroSecondary: 'योजनाएँ देखें',
    heroTrust1: 'SIDBI भागीदार',
    heroTrust2: 'RBI अनुपालक',
    heroTrust3: 'ISO 27001 प्रमाणित',
    howTag: 'यह कैसे काम करता है',
    howTitle: 'चैट से नकदी तक 4 चरणों में',
    howSubtitle: 'हमारा AI एजेंट आपको पूरे ऋण यात्रा में मार्गदर्शन करता है — कोई बैंक यात्रा नहीं।',
    step1Title: 'AI से चैट करें',
    step1Desc: 'अपना व्यवसाय साझा करें और शुरू करें।',
    step2Title: 'पात्रता जांचें',
    step2Desc: 'AI 10+ सरकारी योजनाओं में आपकी पात्रता तुरंत जांचता है।',
    step3Title: 'स्वचालित फ़ॉर्म भरें',
    step3Desc: 'Aadhaar, PAN, GST अपलोड करें — AI स्वचालित रूप से जानकारी निकालता है।',
    step4Title: 'वितरण ट्रैक करें',
    step4Desc: 'प्रस्तुति से लेकर वितरण तक आपके ऋण की वास्तविक समय स्थिति।',
    schemesTag: 'ऋण योजनाएँ',
    schemesTitle: 'अपनी सही योजना खोजें',
    schemesSubtitle: 'सरकारी योजनाएँ कम ब्याज दर और लचीला पुनर्भुगतान प्रदान करती हैं।',
    schemesButton: 'सभी योजनाएँ देखें →',
    banksTag: 'भागीदार बैंक',
    banksTitle: 'उपलब्ध बैंक और ऋणदाता',
    banksSubtitle: 'शीर्ष भागीदार बैंकों में चुनें जो प्रतिस्पर्धी दरें और तेज़ प्रक्रिया देते हैं।',
    chatTeaserTag: 'AI चैट इंटरफ़ेस',
    chatTeaserTitle: 'LoanMate AI से बात करें',
    chatTeaserSubtitle: 'कुछ सवालों के जवाब दें और सबसे अच्छी योजना पाएं।',
    trackerTag: 'ऋण स्थिति',
    trackerTitle: 'अपने ऋण की स्थिति ट्रैक करें',
    trackerSubtitle: 'सभी बैंकों में आपके ऋण आवेदन की वास्तविक समय स्थिति।',
    chatPageTag: 'AI चैट इंटरफ़ेस',
    chatPageTitle: 'LoanMate AI से बात करें',
    chatPageSubtitle: 'मैं आपकी पात्रता जांच सकता हूं, आवेदन ऑटो-फ़िल कर सकता हूं, और वितरण ट्रैक कर सकता हूं।',
    loginTitle: 'फिर से स्वागत है',
    loginSub: 'अपने ऋण डैशबोर्ड तक पहुंचने के लिए साइन इन करें',
    loginPhoneLabel: 'फ़ोन नंबर / ईमेल',
    loginPhonePlaceholder: '+91 9876543210',
    loginPasswordLabel: 'पासवर्ड',
    loginPasswordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    loginSubmit: 'साइन इन',
    loginSignupText: 'क्या आपके पास खाता नहीं है? ',
    signupTitle: 'खाता बनाएं',
    signupSub: '12,000+ MSMEs LoanMate का उपयोग कर रहे हैं',
    signupNameLabel: 'पूरा नाम',
    signupNamePlaceholder: 'रवि कुमार',
    signupPhoneLabel: 'फ़ोन नंबर',
    signupPhonePlaceholder: '+91 9876543210',
    signupBusinessLabel: 'व्यवसाय का नाम',
    signupBusinessPlaceholder: 'रवि एंटरप्राइजेज',
    signupPasswordLabel: 'पासवर्ड',
    signupPasswordPlaceholder: 'मजबूत पासवर्ड बनाएं',
    signupSubmit: 'खाता बनाएँ',
    signupLoginText: 'पहले से ही खाता है? ',
    chatInputPlaceholder: 'संदेश टाइप करें या ऊपर से एक विकल्प चुनें...',
    languageToggleTitle: 'भाषा बदलें',
    myApplications: 'मेरे आवेदन',
    applicationTimeline: 'आवेदन समयरेखा',
    downloadLetter: 'पत्र डाउनलोड करें',
    newApplication: '+ नया आवेदन',
    askAIAboutThis: '💬 इसके बारे में AI से पूछें',
    refreshStatus: 'स्थिति रीफ़्रेश करें',
    chatAgentName: 'LoanMate AI सहायक',
    chatAgentStatus: 'ऑनलाइन · आमतौर पर तुरंत जवाब देता है',
    botGreeting: '👋 नमस्ते! मैं LoanMate हूँ, आपका AI लोन सहायक। मैं आपके व्यवसाय के लिए सबसे अच्छी सरकारी लोन योजना खोजने में मदद करूंगा। चलिए शुरू करते हैं — **आप किस प्रकार का व्यवसाय चलाते हैं?**',
    botGreetingChips: ['निर्माण', 'रिटेल / ट्रेड', 'सेवा व्यवसाय', 'कृषि-सम्बन्धित'],
    uploadPrompt: '📄 क्या आप चाहेंगे कि मैं आपका **ऋण आवेदन स्वचालित रूप से भर दूँ**? बस अपने दस्तावेज़ अपलोड करें और मैं जानकारी निकाल लूँगा।',
    uploadPromptChips: ['दस्तावेज़ अपलोड करें', 'मैन्युअल रूप से भरें', 'अभी छोड़ें'],
    openingChatAbout: '{{id}} के बारे में पूछने के लिए चैट खोली जा रही है...',
    selectDocumentPrompt: 'कृपया दस्तावेज़ प्रकार चुनें और अपनी फ़ाइल अपलोड करें:',
    docTypeAadhaar: '🪪 आधार कार्ड',
    docTypePan: '🗒️ PAN कार्ड',
    docTypeGst: '📋 GST प्रमाणपत्र',
    docTypeBankStatement: '🏦 बैंक स्टेटमेंट',
    uploadCardText: 'दस्तावेज़ अपलोड करने के लिए क्लिक करें',
    uploadCardSub: 'PDF, JPG या PNG · अधिकतम 10MB',
    confirmExtractedMessage: '✅ जानकारी की पुष्टि हो गई! क्या आप एक और दस्तावेज़ अपलोड करना चाहेंगे, या क्या हम आवेदन के साथ आगे बढ़ें?',
    confirmExtractedChips: ['एक और दस्तावेज़ अपलोड करें', 'आवेदन करने के लिए आगे बढ़ें', 'बाद में छोड़ें और लागू करें'],
    confirmAndAutoFill: '✓ पुष्टि करें और ऑटो-फ़िल करें',
    editExtractedQuestion: 'आप आवेदन फ़ॉर्म में जानकारी संपादित कर सकते हैं। क्या मैं फॉर्म खोलूं?',
    editExtractedChips: ['हाँ, फॉर्म खोलें', 'नहीं, जैसा है पुष्टि करें'],
    editButton: 'संपादित करें',
    noApplications: 'आपके पास कोई सक्रिय आवेदन नहीं है। क्या आप नया शुरू करना चाहेंगे?',
    noApplicationsChips: ['पात्रता जांचें', 'योजनाएँ देखें'],
    activeApplications: '📊 यहाँ आपके **{{count}} सक्रिय आवेदन** हैं:',
    offerApply: '🏦 आप किस बैंक के माध्यम से आवेदन करना चाहेंगे?',
    offerApplyChips: ['SBI — सबसे कम दरें', 'ICICI — सबसे तेज़ प्रक्रिया', 'HDFC — बेहतरीन डिजिटल', 'PNB — व्यापक नेटवर्क'],
    apiErrorMessage: 'क्षमा करें, मुझे इसे संसाधित करने में समस्या हुई। कृपया पुनः प्रयास करें।',
    startOver: 'शुरू से शुरू करें',
    checkEligibility: 'पात्रता जांचें',
    trackMyLoan: 'मेरा ऋण ट्रैक करें',
    showAllApplications: 'सभी आवेदन दिखाएँ',
    eligible: '✓ पात्र',
    notEligible: '✗ अयोग्य',
    applyBestMatch: 'सर्वश्रेष्ठ मैच के लिए आवेदन करें →',
    loanLimit: 'ऋण सीमा',
    interestRate: 'ब्याज दर',
    eligibilityCriteria: 'पात्रता मापदंड',
    loanDetails: 'ऋण विवरण',
    collateral: 'गिरवी',
    eligibleSectors: 'पात्र क्षेत्र',
    guaranteeBody: 'गैरंटी निकाय',
    repaymentTenure: 'भुगतान अवधि',
    checkMyEligibility: 'मेरी पात्रता जांचें →',
    learnMore: 'और जानें',
    compareComingSoon: 'तुलना सुविधा जल्द आ रही है!',
    eligibilityAnalysis: 'पात्रता का विश्लेषण किया जा रहा है',
    eligibilityProgressPrefix: 'पात्रता जांची जा रही है',
    documentDataConfirmed: 'दस्तावेज़ डेटा की पुष्टि हो गई है।',
    yesOpenForm: 'हाँ, फॉर्म खोलें',
    noConfirmAsIs: 'नहीं, जैसा है पुष्टि करें',
    uploadButtonTitle: 'दस्तावेज़ अपलोड करें',
    sendButtonTitle: 'भेजें',
    uploadedFileLabel: '📎 अपलोड किया गया:',
    welcomeBackSuccess: 'स्वागत है! सफलतापूर्वक लॉग इन हुआ।',
    accountCreatedSuccess: 'खाता बनाया गया! LoanMate में आपका स्वागत है।',
    viewCriteria: 'मानदंड देखें ↗',
    startingEligibilityCheck: '{{name}} के लिए पात्रता जांच शुरू की जा रही है...',
    checkingEligibility: '{{name}} के लिए पात्रा जांची जा रही है...',
    refreshingApplicationStatus: 'आवेदन स्थिति रीफ़्रेश की जा रही है...',
    statusUpdated: 'स्थिति अपडेट हो गई!',
    uploadDocumentTitle: 'दस्तावेज़ अपलोड करें',
    compare: 'तुलना करें',
    loadingApplications: 'आवेदन लोड हो रहे हैं...',
    refText: 'संदर्भ',
    pendingText: 'प्रतीक्षित',
    statusApproved: 'मंज़ूर',
    statusUnderReview: 'समीक्षा के तहत',
    statusSubmitted: 'प्रस्तुत',
    statusDisbursed: 'जारी किया गया',
    viewFullTrackerButton: 'पूर्ण ट्रैकर देखें →',
  }
};

function t(key, vars = {}) {
  const value = TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  if (Array.isArray(value)) return value;
  return String(value).replace(/\{\{\s*(.*?)\s*\}\}/g, (_, name) => vars[name] ?? '');
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('loanmateLang', lang);
  document.documentElement.lang = lang;
  translatePage();
  if (window.currentPage) {
    navigate(window.currentPage);
  }
  if (window.chatInstances) {
    Object.values(window.chatInstances).forEach(instance => instance.updateLanguage && instance.updateLanguage());
  }
}

function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'hi' : 'en');
}

function translatePage() {
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.dataset.i18nKey;
    const value = t(key);
    if (el.dataset.i18nHtml === 'true') {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    el.title = t(key);
  });
  const languageBtn = document.getElementById('languageBtn');
  if (languageBtn) languageBtn.textContent = t('languageBtn');
}

document.addEventListener('DOMContentLoaded', () => {
  translatePage();
  navigate('home');
});

// ── SPA Router ───────────────────────────────────────────────
function navigate(page) {
  window.currentPage = page;
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Special init for pages
  if (page === 'home') initHome();
  if (page === 'schemes') initSchemesPage();
  if (page === 'banks') initBanksPage();
  if (page === 'chat') initChatPage();
  if (page === 'tracker') initTrackerPage();
  // Hide float btn on auth pages
  const floatBtn = document.getElementById('floatChatBtn');
  if (floatBtn) floatBtn.style.display = (page === 'login' || page === 'signup') ? 'none' : 'flex';
  // Close mobile menu
  if (menuOpen) toggleMenu();
}

function setActiveNav(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}

// ── Dark Mode ────────────────────────────────────────────────
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark', darkMode);
  document.getElementById('darkModeBtn').textContent = darkMode ? '☀️' : '🌙';
}

// ── Mobile Menu ──────────────────────────────────────────────
function toggleMenu() {
  menuOpen = !menuOpen;
  const navLinks = document.getElementById('navLinks');
  if (menuOpen) {
    navLinks.style.cssText = `display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:white;padding:16px;border-bottom:1px solid #e2e8f0;z-index:999;gap:4px;box-shadow:0 4px 12px rgba(0,0,0,0.1)`;
  } else {
    navLinks.style.cssText = '';
  }
}

// ── Toast ────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── API Helpers ──────────────────────────────────────────────
async function apiGet(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('API GET error:', path, e);
    return null;
  }
}

async function apiPost(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e) {
    console.error('API POST error:', path, e);
    return null;
  }
}

// ── Auth Handlers ─────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.innerHTML = '<span class="spinner"></span> Signing in...';
  btn.disabled = true;
  setTimeout(() => {
    showToast(t('welcomeBackSuccess') || 'Welcome back! Logged in successfully.', 'success');
    navigate('home');
    btn.innerHTML = 'Sign In';
    btn.disabled = false;
  }, 1500);
}

function handleSignup(e) {
  e.preventDefault();
  const btn = document.getElementById('signupBtn');
  btn.innerHTML = '<span class="spinner"></span> Creating account...';
  btn.disabled = true;
  setTimeout(() => {
    showToast(t('accountCreatedSuccess') || 'Account created! Welcome to LoanMate.', 'success');
    navigate('home');
    btn.innerHTML = 'Create Account';
    btn.disabled = false;
  }, 1800);
}

// ── File Upload Handler ───────────────────────────────────────
let currentDocType = 'aadhaar';
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (window.currentChatInstance) {
    window.currentChatInstance.processUploadedFile(file, currentDocType);
  }
}

// ── Init Home ─────────────────────────────────────────────────
async function initHome() {
  await initSchemeComponents('home-schemes-tabs', 'home-schemes-cards');
  await initBankComponents('home-banks-grid', 2); // show only 2 banks
  if (!window.homeChatInited) {
    window.homeChatInited = true;
    initChatWidget('home-chat-wrapper');
  }
  if (!window.homeTrackerInited) {
    window.homeTrackerInited = true;
    initTrackerWidget('home-tracker');
  }
}

