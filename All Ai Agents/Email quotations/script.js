/* ═══════════════════════════════════════════════
   EvaOps AI — Email Quotation Agent
   script.js  |  All interactivity
   ═══════════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────────
   DATA
─────────────────────────────────────────────── */

const DEMO_EMAILS = [
  {
    text: '"…we are looking for a quotation for 500 units of the Enterprise-X series, delivered to our London hub by Friday."',
    fields: [
      { label: 'Entity',    value: 'Enterprise-X' },
      { label: 'Quantity',  value: '500 Units'    },
      { label: 'Location',  value: 'London Hub'   },
      { label: 'Deadline',  value: 'Dec 22, 2024' },
    ],
    confidence: '99.8%',
    status: 'pending',
  },
  {
    text: '"Please provide pricing for 1,200 kg of Grade-A alloy steel coils — urgent delivery to Hamburg port by end of month."',
    fields: [
      { label: 'Material',  value: 'Grade-A Alloy' },
      { label: 'Quantity',  value: '1,200 kg'       },
      { label: 'Location',  value: 'Hamburg Port'   },
      { label: 'Urgency',   value: 'End of Month'   },
    ],
    confidence: '98.4%',
    status: 'answered',
  },
  {
    text: '"We need a bulk quote for 80 industrial HVAC units for our Riyadh facility — please include installation scope."',
    fields: [
      { label: 'Product',   value: 'HVAC Units'     },
      { label: 'Quantity',  value: '80 Units'        },
      { label: 'Location',  value: 'Riyadh Facility' },
      { label: 'Scope',     value: 'Incl. Install'   },
    ],
    confidence: '97.1%',
    status: 'approval',
  },
];

const KANBAN_DATA = {
  pending: [
    { company: 'Nexus Logistics', subject: 'Quotation for Enterprise-X Series × 500 units', qty: '500 units', time: '2m ago'  },
    { company: 'AlphaFreight GmbH', subject: 'Bulk order inquiry — Grade-A alloy coils', qty: '1,200 kg', time: '14m ago' },
    { company: 'StratoSupply Co.', subject: 'RFQ — industrial HVAC units × 80, Riyadh', qty: '80 units', time: '1h ago'  },
  ],
  answered: [
    { company: 'BridgeTech ME',    subject: 'Follow-up on server rack quote — ref #4421', qty: '24 racks',  time: '3h ago'  },
    { company: 'Nordic Parts AS',  subject: 'Revised quotation request — cooling fans',   qty: '600 units', time: '5h ago'  },
    { company: 'Coastal Imports',  subject: 'Price match request vs competitor quote',    qty: 'N/A',       time: '7h ago'  },
    { company: 'Meridian Corp',    subject: 'Annual contract renewal — cable assemblies', qty: '10,000 m',  time: '1d ago'  },
    { company: 'Apex Fabricators', subject: 'Custom weld frame specifications RFQ',       qty: '15 frames', time: '2d ago'  },
  ],
  approval: [
    { company: 'Gulf Construct',   subject: 'Final pricing — structural steel beams',     qty: '200 T',     time: '4h ago'  },
    { company: 'Sunrise Textiles', subject: 'Bulk yarn order — pending CFO sign-off',     qty: '5,000 kg',  time: '1d ago'  },
  ],
  closed: [
    { company: 'Delta Motors',     subject: 'Engine gasket kits × 300 — FULFILLED',      qty: '300 kits',  time: '2d ago'  },
    { company: 'Orion Chemicals',  subject: 'Solvent drums order closed',                 qty: '50 drums',  time: '3d ago'  },
    { company: 'Summit Networks',  subject: 'Fiber optic bundle — delivered',             qty: '2 km',      time: '4d ago'  },
    { company: 'Helix Medical',    subject: 'Sterile packaging — signed & closed',        qty: '10,000 pcs',time: '5d ago'  },
    { company: 'Terra Agri',       subject: 'Fertiliser quote accepted and shipped',      qty: '18 T',      time: '6d ago'  },
    { company: 'BlueLine Ports',   subject: 'Crane wire rope — fulfilled',                qty: '500 m',     time: '7d ago'  },
    { company: 'Helios Energy',    subject: 'Solar panel brackets — closed',              qty: '320 pcs',   time: '8d ago'  },
    { company: 'Crescent Build',   subject: 'Marble tiles order — delivered',             qty: '800 m²',    time: '9d ago'  },
    { company: 'Pinnacle Labs',    subject: 'Lab consumables — fulfilled',                qty: 'Various',   time: '10d ago' },
    { company: 'Vantage Rail',     subject: 'Track bolts — closed contract',              qty: '5,000 pcs', time: '11d ago' },
    { company: 'Caspian Pipes',    subject: 'Steel pipe quote — shipped',                 qty: '30 T',      time: '12d ago' },
    { company: 'Monarch Textiles', subject: 'Wool bales — contract closed',               qty: '2 T',       time: '13d ago' },
  ],
};

const STATUS_CLASS = {
  pending:  'badge--pending',
  answered: 'badge--answered',
  approval: 'badge--approval',
  closed:   'badge--closed',
};
const STATUS_LABEL = {
  pending:  'Pending Review',
  answered: 'Answer Received',
  approval: 'Awaiting Approval',
  closed:   'Closed',
};

/* ───────────────────────────────────────────────
   UTILITY
─────────────────────────────────────────────── */

function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function showToast(msg, duration = 2400) {
  const toast = qs('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ───────────────────────────────────────────────
   RIPPLE
─────────────────────────────────────────────── */

function createRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.4;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top  - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-circle';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

qsa('.ripple').forEach(btn => btn.addEventListener('click', createRipple));

/* ───────────────────────────────────────────────
   NAV SCROLL
─────────────────────────────────────────────── */

const navbar = qs('#navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ───────────────────────────────────────────────
   MOBILE MENU
─────────────────────────────────────────────── */

const hamburger   = qs('#hamburger-btn');
const mobileDrawer = qs('#mobile-drawer');
const overlay      = qs('#mobile-menu-overlay');

function toggleMenu(open) {
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  mobileDrawer.classList.toggle('open', open);
  mobileDrawer.setAttribute('aria-hidden', !open);
  overlay.style.display = open ? 'block' : 'none';
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('open');
  toggleMenu(!isOpen);
});
overlay.addEventListener('click', () => toggleMenu(false));
qsa('.mobile-nav-link').forEach(link => link.addEventListener('click', () => toggleMenu(false)));

/* ───────────────────────────────────────────────
   SCROLL REVEAL
─────────────────────────────────────────────── */

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

qsa('.reveal').forEach(el => revealObs.observe(el));

/* ───────────────────────────────────────────────
   HERO CARD DEMO — cycling extraction animation
─────────────────────────────────────────────── */

let demoIndex = 0;
let demoTimeout = null;
const CYCLE_INTERVAL = 5000;   // ms between cycles

const emailTextEl    = qs('#email-text');
const processingBar  = qs('#processing-bar');
const processingFill = qs('#processing-fill');
const extractionCard = qs('#extraction-card');
const extractionGrid = qs('#extraction-grid');
const confidenceBadge = qs('#confidence-badge');
const statusLabel    = qs('#status-label');
const statusDot      = qs('.status-dot', extractionCard);
const demoTimerEl    = qs('#demo-timer');

function buildExtractionGrid(fields) {
  extractionGrid.innerHTML = fields.map(f => `
    <div class="extraction-field">
      <div class="field-label">${f.label}</div>
      <div class="field-value">${f.value}</div>
    </div>
  `).join('');
}

function runDemoStep(data) {
  // 1. Fade out email text
  emailTextEl.classList.add('fade');

  setTimeout(() => {
    // 2. Swap email text
    emailTextEl.textContent = data.text;
    emailTextEl.classList.remove('fade');

    // 3. Show processing bar
    processingBar.classList.add('visible');
    processingFill.style.width = '0%';
    extractionCard.style.opacity = '0.3';
    demoTimerEl.textContent = 'Extracting…';

    // Animate fill
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        processingFill.style.width = '100%';
      });
    });

    setTimeout(() => {
      // 4. Show extraction result
      processingBar.classList.remove('visible');
      processingFill.style.width = '0%';
      extractionCard.style.opacity = '1';
      buildExtractionGrid(data.fields);
      confidenceBadge.textContent = `Confidence: ${data.confidence}`;

      // Update status
      statusDot.className = `status-dot status-dot--${data.status}`;
      statusLabel.textContent = STATUS_LABEL[data.status];

      // Reset timer
      demoTimerEl.textContent = '2.4s ago';
    }, 900);

  }, 350);
}

function cycleDemos() {
  demoIndex = (demoIndex + 1) % DEMO_EMAILS.length;
  runDemoStep(DEMO_EMAILS[demoIndex]);
  demoTimeout = setTimeout(cycleDemos, CYCLE_INTERVAL);
}

// Initialise with first demo
buildExtractionGrid(DEMO_EMAILS[0].fields);

// Start cycling after a pause
demoTimeout = setTimeout(cycleDemos, CYCLE_INTERVAL);

// Export button
qs('#export-btn').addEventListener('click', function (e) {
  createRipple(e);
  showToast('✓ Exported to ERP successfully');
  // Briefly animate badge
  confidenceBadge.style.background = 'rgba(0,201,141,.35)';
  setTimeout(() => { confidenceBadge.style.background = ''; }, 800);
});

// Demo / CTA buttons
qs('#hero-demo-btn').addEventListener('click', (e) => {
  createRipple(e);
  showToast('📅 Demo request sent — we\'ll be in touch!');
});
qs('#hero-learn-btn').addEventListener('click', () => {
  document.getElementById('solutions').scrollIntoView({ behavior: 'smooth' });
});
qs('#login-btn').addEventListener('click', () => showToast('🔐 Login coming soon'));
qs('#get-started-btn').addEventListener('click', (e) => {
  createRipple(e);
  showToast('🚀 Redirecting to sign up…');
});

/* ───────────────────────────────────────────────
   KANBAN TABS
─────────────────────────────────────────────── */

const kanbanCards = qs('#kanban-cards');
let activeCategory = 'pending';

function renderKanbanCards(category) {
  const items = KANBAN_DATA[category] || [];
  kanbanCards.innerHTML = items.map((item, i) => `
    <div class="kanban-card" style="animation-delay:${i * 60}ms" tabindex="0" role="button" aria-label="${item.subject}">
      <div class="kanban-card__company">${item.company}</div>
      <div class="kanban-card__subject">${item.subject}</div>
      <div class="kanban-card__meta">
        <span class="kanban-card__qty">${item.qty}</span>
        <span>${item.time}</span>
      </div>
      <span class="kanban-card__badge ${STATUS_CLASS[category]}">${STATUS_LABEL[category]}</span>
    </div>
  `).join('');

  // Card click
  qsa('.kanban-card', kanbanCards).forEach(card => {
    card.addEventListener('click', () => {
      showToast(`📋 Opening: ${card.querySelector('.kanban-card__subject').textContent}`);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
  });
}

qsa('.kanban-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    qsa('.kanban-tab').forEach(t => {
      t.classList.remove('kanban-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('kanban-tab--active');
    tab.setAttribute('aria-selected', 'true');
    activeCategory = tab.dataset.category;
    renderKanbanCards(activeCategory);
  });
});

// Initial render
renderKanbanCards('pending');

/* ───────────────────────────────────────────────
   ACTIVE NAV LINK on scroll
─────────────────────────────────────────────── */

const sections = ['product', 'solutions', 'categories', 'contact'];
const navLinks  = qsa('.nav-link');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const matches = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('nav-link--active', matches);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObs.observe(el);
});

/* ───────────────────────────────────────────────
   MODAL — Book Strategy Call
─────────────────────────────────────────────── */

const modalBackdrop  = qs('#modal-backdrop');
const modalClose     = qs('#modal-close');
const modalDoneBtn   = qs('#modal-done-btn');
const strategyForm   = qs('#strategy-form');
const modalFormView  = qs('#modal-form-view');
const modalSuccess   = qs('#modal-success');
const modalSubmitBtn = qs('#modal-submit-btn');

function openModal() {
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset to form view each time
  modalFormView.style.display = 'block';
  modalSuccess.classList.remove('show');
  strategyForm.reset();
  clearAllErrors();
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// Open triggers — every "Book Strategy Call" button
qsa('.btn-white, [data-modal="strategy"]').forEach(btn => {
  if (btn.textContent.trim().toLowerCase().includes('book strategy')) {
    btn.addEventListener('click', (e) => {
      createRipple(e);
      openModal();
    });
  }
});

// Also wire the footer CTA buttons
document.querySelectorAll('.cta-btns button').forEach(btn => {
  if (btn.textContent.trim().toLowerCase().includes('book strategy')) {
    btn.addEventListener('click', (e) => { createRipple(e); openModal(); });
  }
});

// Close triggers
modalClose.addEventListener('click', closeModal);
modalDoneBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
});

/* ── Validation ── */

function showError(inputId, errorId) {
  const input = qs(`#${inputId}`);
  const err   = qs(`#${errorId}`);
  input.classList.add('error');
  err.classList.add('show');
}
function clearError(inputId, errorId) {
  const input = qs(`#${inputId}`);
  const err   = qs(`#${errorId}`);
  input.classList.remove('error');
  err.classList.remove('show');
}
function clearAllErrors() {
  [
    ['field-fname',   'err-fname'],
    ['field-lname',   'err-lname'],
    ['field-email',   'err-email'],
    ['field-company', 'err-company'],
  ].forEach(([i, e]) => clearError(i, e));
}

// Clear on input
[
  ['field-fname',   'err-fname'],
  ['field-lname',   'err-lname'],
  ['field-email',   'err-email'],
  ['field-company', 'err-company'],
].forEach(([inputId, errorId]) => {
  qs(`#${inputId}`).addEventListener('input', () => clearError(inputId, errorId));
});

strategyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const fname   = qs('#field-fname').value.trim();
  const lname   = qs('#field-lname').value.trim();
  const email   = qs('#field-email').value.trim();
  const company = qs('#field-company').value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  clearAllErrors();

  if (!fname)            { showError('field-fname',   'err-fname');   valid = false; }
  if (!lname)            { showError('field-lname',   'err-lname');   valid = false; }
  if (!emailRe.test(email)) { showError('field-email', 'err-email');  valid = false; }
  if (!company)          { showError('field-company', 'err-company'); valid = false; }

  if (!valid) return;

  // Simulate submission
  modalSubmitBtn.disabled = true;
  modalSubmitBtn.textContent = 'Sending…';

  setTimeout(() => {
    modalSubmitBtn.disabled = false;
    modalSubmitBtn.innerHTML = '<span class="material-symbols-outlined icon-sm">calendar_month</span> Book My Strategy Call';
    modalFormView.style.display = 'none';
    modalSuccess.classList.add('show');
  }, 1200);
});
