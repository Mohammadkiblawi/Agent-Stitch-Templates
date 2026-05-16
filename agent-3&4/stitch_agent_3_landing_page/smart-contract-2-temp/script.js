 tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            inter:   ['Inter', 'sans-serif'],
            grotesk: ['Space Grotesk', 'sans-serif'],
          },
          colors: {
            /*
             * CHANGE: Updated colour palette to match LexDraft dark legal theme.
             * Original: generic dark theme.
             * New: deeper navy/charcoal tones matching the legal aesthetic in img1.
             */
            surface: {
              DEFAULT: '#0d1117',
              card:    '#161b22',
              hover:   '#1c2128',
              border:  '#30363d',
            },
            accent: {
              DEFAULT: '#c9a84c',   /* gold — legal prestige */
              light:   '#e2c06a',
              dim:     'rgba(201,168,76,0.12)',
            }
          },
          letterSpacing: {
            widest2: '0.2em',
          }
        }
      }
    }

    /**
 * LexDraft — Legal Smart Contract Drafter
 * script.js — All JavaScript, zero inline handlers except openModal/closeModal
 * called from HTML onclick (kept for simplicity matching original template).
 *
 * CHANGE LOG:
 * - Toast messages updated to legal product context
 * - Form fields and validation updated for legal agreement form
 * - All UI copy in JS updated to LexDraft brand voice
 */

'use strict';

/* ═══════════════════════════════════════════
   REVEAL ON SCROLL
   (Design unchanged — same intersection observer pattern)
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
   (Design unchanged)
═══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener(
  'scroll',
  () => { navbar.classList.toggle('scrolled', window.scrollY > 30); },
  { passive: true }
);

/* ═══════════════════════════════════════════
   MOBILE MENU TOGGLE
   (Design unchanged)
═══════════════════════════════════════════ */
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav    = document.getElementById('mobileNav');

if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  /* Close on link click */
  mobileNav.querySelectorAll('.mobile-nav-item').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL (offset for fixed navbar)
   (Design unchanged)
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 72; /* navbar height */
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   MODAL
   (Design unchanged — content updated for legal product)
═══════════════════════════════════════════ */
const modalOverlay = document.getElementById('modalOverlay');

/** Open modal — called from HTML onclick */
function openModal() { // eslint-disable-line no-unused-vars
  if (modalOverlay) {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    /* Focus first input for accessibility */
    setTimeout(() => {
      const first = modalOverlay.querySelector('input, select, textarea');
      if (first) first.focus();
    }, 100);
  }
}

/** Close modal — called from HTML onclick */
function closeModal() { // eslint-disable-line no-unused-vars
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* Close on overlay backdrop click */
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

/* Close on Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) {
    closeModal();
  }
});

/* ═══════════════════════════════════════════
   FORM SUBMIT
   CHANGE: Toast/success message updated to legal product context.
═══════════════════════════════════════════ */
const draftForm = document.getElementById('draftForm');
const submitBtn = document.getElementById('submitBtn');

if (draftForm && submitBtn) {
  draftForm.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Basic required-field validation */
    let valid = true;
    draftForm.querySelectorAll('[required]').forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#f87171'; /* red */
        field.addEventListener(
          'input',
          () => { field.style.borderColor = ''; },
          { once: true }
        );
      }
    });

    if (!valid) {
      /*
       * CHANGE: Validation toast updated to legal product tone.
       */
      showToast('⚠️ Please complete all required fields to initialize your draft.');
      return;
    }

    /* Success state */
    /*
     * CHANGE: Submit button copy updated: "Initializing..." for legal product.
     */
    submitBtn.textContent = 'Initializing Draft...';
    submitBtn.disabled    = true;

    setTimeout(() => {
      closeModal();
      /*
       * CHANGE: Success toast updated to legal product context.
       */
      showToast('✓ Draft initialized. Our legal team will contact you within 24 hours.');

      /* Reset */
      submitBtn.textContent = 'Initialize Draft →';
      submitBtn.disabled    = false;
      draftForm.reset();
    }, 2400);
  });
}

/* ═══════════════════════════════════════════
   TOAST NOTIFICATION
   (Design unchanged — messages updated for legal context)
═══════════════════════════════════════════ */
function showToast(message) {
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
  }, 3500);
}

/* ═══════════════════════════════════════════
   HERO CARDS — HOVER INTERACTION
   CHANGE: Added subtle entrance animation stagger for the three feature cards.
═══════════════════════════════════════════ */
document.querySelectorAll('.hero-card').forEach((card, i) => {
  card.style.transitionDelay = `${0.1 + i * 0.1}s`;
});

/* ═══════════════════════════════════════════
   PROCESS CARDS — HOVER LABEL COLOUR
   CHANGE: Accent pulse on step number when card is hovered.
           Adds subtle interactivity without changing design structure.
═══════════════════════════════════════════ */
document.querySelectorAll('.process-card').forEach((card) => {
  const num = card.querySelector('.process-step-num');
  if (!num) return;

  card.addEventListener('mouseenter', () => {
    num.style.background   = 'rgba(201,168,76,0.2)';
    num.style.borderColor  = 'rgba(201,168,76,0.6)';
    num.style.boxShadow    = '0 0 16px rgba(201,168,76,0.2)';
  });

  card.addEventListener('mouseleave', () => {
    num.style.background   = '';
    num.style.borderColor  = '';
    num.style.boxShadow    = '';
  });
});