/**
 * LexDraft — Legal Smart Contract Drafter
 * script.js — All JavaScript, zero inline scripts
 * Design: matches light institutional template
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
   STAT COUNTER ANIMATION
═══════════════════════════════════════════ */
function animateCount(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const isFloat  = String(target).includes('.');
  const duration = 1600;
  const steps    = 60;
  let   current  = 0;
  const step     = target / steps;

  const iv = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(iv);
    }
    el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
  }, duration / steps);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

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
const consultForm = document.getElementById('consultForm');
const submitBtn   = document.getElementById('submitBtn');

const validationRules = {
  fullName:     { required: true, minLength: 2 },
  firmName:     { required: true, minLength: 2 },
  workEmail:    { required: true, type: 'email' },
  practiceArea: { required: true },
  firmSize:     { required: true },
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

function setFieldError(id, hasError) {
  const input = document.getElementById(id);
  const err   = document.getElementById(`err-${id}`);
  if (!input) return;
  input.classList.toggle('error', hasError);
  if (err) err.classList.toggle('visible', hasError);
}

if (consultForm) {

  /* Live validation on blur */
  Object.keys(validationRules).forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', () => {
      setFieldError(id, !validateField(id, field.value));
    });
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        setFieldError(id, !validateField(id, field.value));
      }
    });
  });

  consultForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    Object.keys(validationRules).forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      const ok = validateField(id, field.value);
      setFieldError(id, !ok);
      if (!ok) isValid = false;
    });

    if (!isValid) {
      const firstError = consultForm.querySelector('.form-input.error');
      if (firstError) firstError.focus();
      showToast('Please complete all required fields.');
      return;
    }

    submitBtn.textContent = 'Scheduling...';
    submitBtn.disabled    = true;

    setTimeout(() => {
      closeModal();
      showToast('✓ Consultation scheduled. Our legal engineering team will be in touch within 24 hours.');
      consultForm.reset();
      Object.keys(validationRules).forEach((id) => setFieldError(id, false));
      submitBtn.textContent = 'Schedule Consultation →';
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
   PROTO CARDS — KEYBOARD ACCESSIBLE
═══════════════════════════════════════════ */
document.querySelectorAll('.proto-card').forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      openModal();
    }
  });
});

/* ═══════════════════════════════════════════
   AVATAR GROUP — TOOLTIP ON HOVER
═══════════════════════════════════════════ */
document.querySelectorAll('.avatar').forEach((av) => {
  av.setAttribute('tabindex', '0');
  av.setAttribute('role', 'img');
});