/**
 * Tender Smart — Sales & Tender Smart Agent
 * script.js — All JavaScript, zero inline scripts
 */

'use strict';

/* ═══════════════════════════════════════════
   REVEAL ON SCROLL
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   NAVBAR — SCROLL EFFECT
═══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener(
  'scroll',
  () => { navbar.classList.toggle('scrolled', window.scrollY > 20); },
  { passive: true }
);

/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav    = document.getElementById('mobileNav');

if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileToggle.classList.toggle('open', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileNav.querySelectorAll('.mobile-nav-item').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('open') && !navbar.contains(e.target)) {
      closeMobileNav();
    }
  });
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  mobileToggle.classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 68;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════
   AGENT STATUS CYCLING
   Cycles through processing states matching the img1 live status
═══════════════════════════════════════════ */
const statusEl = document.getElementById('agentStatusValue');
const statuses = [
  'PROCESSING DOC_X82...',
  'EXTRACTING CLAUSES...',
  'MAPPING REQUIREMENTS...',
  'FLAGGING GAPS...',
  'DRAFTING RESPONSE...',
  'COMPLIANCE CHECK: 97%',
];
let   statusIdx = 0;

if (statusEl) {
  setInterval(() => {
    statusIdx = (statusIdx + 1) % statuses.length;
    statusEl.style.opacity = '0';
    setTimeout(() => {
      statusEl.textContent  = statuses[statusIdx];
      statusEl.style.opacity = '1';
    }, 250);
    statusEl.style.transition = 'opacity 0.25s ease';
  }, 2800);
}

/* ═══════════════════════════════════════════
   DRAFT PROGRESS BAR ANIMATION
═══════════════════════════════════════════ */
const draftFill = document.getElementById('draftFill');
const draftPct  = document.getElementById('draftPct');

const draftObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && draftFill) {
      setTimeout(() => {
        draftFill.style.width = '88%';
        animatePct(draftPct, 0, 88, 1800);
      }, 400);
      draftObserver.disconnect();
    }
  },
  { threshold: 0.4 }
);

const draftCard = document.querySelector('.lc-card-draft');
if (draftCard) draftObserver.observe(draftCard);

function animatePct(el, from, to, duration) {
  if (!el) return;
  const steps = 60;
  const step  = (to - from) / steps;
  let   val   = from;
  const iv    = setInterval(() => {
    val += step;
    if (val >= to) { val = to; clearInterval(iv); }
    el.textContent = Math.round(val) + '%';
  }, duration / steps);
}

/* ═══════════════════════════════════════════
   GAP ALERT — CYCLING MESSAGES
═══════════════════════════════════════════ */
const gapAlertText = document.getElementById('gapAlertText');
const gapMessages  = [
  'ISO 27001 Certification document missing from Appendix 4.',
  'Financial accounts older than 3 years — renewal required.',
  'Health & Safety policy not signed by director.',
  'Public liability insurance below required threshold.',
];
let gapIdx = 0;

if (gapAlertText) {
  setInterval(() => {
    gapIdx = (gapIdx + 1) % gapMessages.length;
    gapAlertText.style.opacity = '0';
    setTimeout(() => {
      gapAlertText.textContent  = gapMessages[gapIdx];
      gapAlertText.style.opacity = '1';
    }, 300);
    gapAlertText.style.transition = 'opacity 0.3s ease';
  }, 4000);
}

/* ═══════════════════════════════════════════
   CHART BARS — ANIMATE ON SCROLL
═══════════════════════════════════════════ */
const chartCard = document.querySelector('.lc-card-chart');
if (chartCard) {
  const chartObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.chart-bar').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.transition = 'height 0.8s ease';
          }, i * 80);
        });
        chartObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  chartObserver.observe(chartCard);
}

/* ═══════════════════════════════════════════
   MODAL
═══════════════════════════════════════════ */
const modalOverlay  = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');

function openModal() {  // eslint-disable-line no-unused-vars
  if (!modalOverlay) return;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const first = modalOverlay.querySelector(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
    );
    if (first) first.focus();
  });
}

function closeModal() {  // eslint-disable-line no-unused-vars
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) {
    closeModal();
  }
});

/* Focus trap */
if (modalOverlay) {
  modalOverlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      modalOverlay.querySelectorAll(
        'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
}

/* ═══════════════════════════════════════════
   FORM VALIDATION & SUBMIT
═══════════════════════════════════════════ */
const agentForm = document.getElementById('agentForm');
const submitBtn = document.getElementById('submitBtn');

const rules = {
  fullName:     { required: true, minLength: 2 },
  company:      { required: true, minLength: 2 },
  workEmail:    { required: true, type: 'email' },
  tenderVolume: { required: true },
  sector:       { required: true },
};

function validateField(id, value) {
  const r = rules[id];
  if (!r) return true;
  if (r.required && !value.trim()) return false;
  if (r.minLength && value.trim().length < r.minLength) return false;
  if (r.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  return true;
}

function setError(id, hasError) {
  const input = document.getElementById(id);
  const err   = document.getElementById(`err-${id}`);
  if (input) input.classList.toggle('error', hasError);
  if (err)   err.classList.toggle('visible', hasError);
}

if (agentForm) {
  Object.keys(rules).forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', () => setError(id, !validateField(id, field.value)));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) setError(id, !validateField(id, field.value));
    });
  });

  agentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(rules).forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      const ok = validateField(id, field.value);
      setError(id, !ok);
      if (!ok) isValid = false;
    });

    if (!isValid) {
      const firstError = agentForm.querySelector('.form-input.error');
      if (firstError) firstError.focus();
      showToast('⚠️ Please complete all required fields.');
      return;
    }

    submitBtn.textContent = 'Deploying Agent...';
    submitBtn.disabled    = true;

    setTimeout(() => {
      closeModal();
      showToast('✓ Agent deployed. Our team will configure your instance within 24 hours.');
      agentForm.reset();
      Object.keys(rules).forEach((id) => setError(id, false));
      submitBtn.textContent = 'Deploy Agent Now →';
      submitBtn.disabled    = false;
    }, 2200);
  });
}

/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
function showToast(message, duration = 4000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className   = 'toast';
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity    = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 420);
  }, duration);
}

/* ═══════════════════════════════════════════
   LIFECYCLE CARDS — KEYBOARD ACCESSIBLE
═══════════════════════════════════════════ */
document.querySelectorAll('.lc-card').forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openModal();
  });
});