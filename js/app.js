// ── LoanMate App — Core Router & State ──────────────────────
const API_BASE = '/api';
let darkMode = false;
let menuOpen = false;

// ── SPA Router ───────────────────────────────────────────────
function navigate(page) {
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
    showToast('Welcome back! Logged in successfully.', 'success');
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
    showToast('Account created! Welcome to LoanMate.', 'success');
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

// ── DOMContentLoaded ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});
