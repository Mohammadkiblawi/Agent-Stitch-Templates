/**
 * LexDraft — Legal Smart Contract Drafter
 * script.js — All JavaScript, zero inline scripts
 */

'use strict';

/* ═══════════════════════════════════════════
   INTERSECTION OBSERVER — REVEAL ON SCROLL
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
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   NAVBAR — SCROLL EFFECT
═══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener(
  'scroll',
  () => { navbar.classList.toggle('scrolled', window.scrollY > 24); },
  { passive: true }
);

/* ═══════════════════════════════════════════
   MOBILE MENU TOGGLE
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

  /* Close mobile nav when a link is clicked */
  mobileNav.querySelectorAll('.mobile-nav-item').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('open') &&
      !navbar.contains(e.target)
    ) {
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
   SMOOTH SCROLL (with navbar offset)
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════
   CONTRACT CARD — SCAN LINE ANIMATION
═══════════════════════════════════════════ */
const scanLine = document.getElementById('scanLine');
if (scanLine) {
  /* Start scanning after page load */
  setTimeout(() => scanLine.classList.add('scanning'), 1200);
}

/* ═══════════════════════════════════════════
   CONTRACT CARD — STATUS BADGE PULSE
═══════════════════════════════════════════ */
const statusBadge = document.getElementById('contractStatus');
const statusCycle = ['STATUS: BINDING', 'STATUS: PROCESSING', 'STATUS: VALIDATED'];
let   statusIdx   = 0;

if (statusBadge) {
  setInterval(() => {
    statusIdx = (statusIdx + 1) % statusCycle.length;
    statusBadge.style.opacity = '0';
    setTimeout(() => {
      statusBadge.textContent = statusCycle[statusIdx];
      statusBadge.style.opacity = '1';
    }, 300);
    statusBadge.style.transition = 'opacity 0.3s ease';
  }, 3000);
}

/* ═══════════════════════════════════════════
   MODAL
═══════════════════════════════════════════ */
const modalOverlay  = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');

/** Called from HTML buttons via onclick — kept global */
function openModal() {     // eslint-disable-line no-unused-vars
  if (!modalOverlay) return;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Accessibility: focus first focusable element */
  requestAnimationFrame(() => {
    const first = modalOverlay.querySelector(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
    );
    if (first) first.focus();
  });
}

/** Called from HTML close button via onclick — kept global */
function closeModal() {    // eslint-disable-line no-unused-vars
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* Close on overlay backdrop click */
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

/* Close button */
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}

/* Close on Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) {
    closeModal();
  }
});

/* Focus trap inside modal */
if (modalOverlay) {
  modalOverlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      modalOverlay.querySelectorAll(
        'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled);

    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* ═══════════════════════════════════════════
   FORM VALIDATION & SUBMIT
═══════════════════════════════════════════ */
const draftForm = document.getElementById('draftForm');
const submitBtn = document.getElementById('submitBtn');

/* Field validation rules */
const validationRules = {
  fullName:      { required: true, minLength: 2 },
  firmName:      { required: true, minLength: 2 },
  workEmail:     { required: true, type: 'email' },
  agreementType: { required: true },
  jurisdiction:  { required: true },
};

function validateField(id, value) {
  const rules = validationRules[id];
  if (!rules) return true;
  if (rules.required && !value.trim()) return false;
  if (rules.minLength && value.trim().length < rules.minLength) return false;
  if (rules.type === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
  return true;
}

function showFieldError(id, show) {
  const input = document.getElementById(id);
  const err   = document.getElementById(`err-${id}`);
  if (!input || !err) return;
  input.classList.toggle('error', show);
  err.classList.toggle('visible', show);
}

/* Live validation on blur */
if (draftForm) {
  Object.keys(validationRules).forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', () => {
      showFieldError(id, !validateField(id, field.value));
    });
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        showFieldError(id, !validateField(id, field.value));
      }
    });
  });

  draftForm.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Validate all fields */
    let isValid = true;
    Object.keys(validationRules).forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      const ok = validateField(id, field.value);
      showFieldError(id, !ok);
      if (!ok) isValid = false;
    });

    if (!isValid) {
      /* Focus first error field */
      const firstError = draftForm.querySelector('.form-input.error');
      if (firstError) firstError.focus();
      showToast('⚠️ Please complete all required fields.');
      return;
    }

    /* Success flow */
    submitBtn.textContent = 'Initializing...';
    submitBtn.disabled    = true;

    /* Simulate async processing */
    setTimeout(() => {
      closeModal();
      showToast('✓ Draft initialized. Our legal team will be in touch within 24 hours.');

      /* Reset form */
      draftForm.reset();
      Object.keys(validationRules).forEach((id) => showFieldError(id, false));
      submitBtn.textContent = 'Initialize Draft →';
      submitBtn.disabled    = false;
    }, 2200);
  });
}

/* ═══════════════════════════════════════════
   TOAST NOTIFICATION
═══════════════════════════════════════════ */
function showToast(message, duration = 3800) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className  = 'toast';
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
   PROCESS CARDS — STAGGER HOVER LABELS
═══════════════════════════════════════════ */
document.querySelectorAll('.process-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.process-step-label')
      ?.style.setProperty('letter-spacing', '0.16em');
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.process-step-label')
      ?.style.setProperty('letter-spacing', '0.12em');
  });
});

/* ═══════════════════════════════════════════
   VALUE TAGS — KEYBOARD ACCESSIBLE
═══════════════════════════════════════════ */
document.querySelectorAll('.value-tag').forEach((tag) => {
  tag.setAttribute('tabindex', '0');
  tag.setAttribute('role', 'article');

  tag.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const label = tag.querySelector('.value-tag-value')?.textContent;
      if (label) showToast(`📋 ${label}`);
    }
  });
});