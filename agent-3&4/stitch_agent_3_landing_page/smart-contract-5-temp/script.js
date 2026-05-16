/* ═══════════════════════════════════════════════════════
   EvaOps — Legal Smart Contract Drafter
   script.js  |  Zero inline JS in HTML
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ─── Helpers ─── */
const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

function showToast(msg, dur = 2600) {
  const t = qs('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

function addRipple(e) {
  const btn  = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.5;
  const x    = e.clientX - rect.left  - size / 2;
  const y    = e.clientY - rect.top   - size / 2;
  const r    = document.createElement('span');
  r.className = 'ripple-wave';
  r.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}
qsa('.ripple').forEach(b => b.addEventListener('click', addRipple));

/* ─── Navbar scroll ─── */
const navbar = qs('#navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

/* ─── Mobile menu ─── */
const mobileToggle = qs('#mobileToggle');
const mobileNav    = qs('#mobileNav');

function setMenuOpen(open) {
  mobileToggle.classList.toggle('open', open);
  mobileToggle.setAttribute('aria-expanded', open);
  mobileNav.classList.toggle('open', open);
  mobileNav.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}

mobileToggle.addEventListener('click', () => {
  setMenuOpen(!mobileToggle.classList.contains('open'));
});
qsa('.mobile-nav-item').forEach(link =>
  link.addEventListener('click', () => setMenuOpen(false))
);

/* ─── Active nav link on scroll ─── */
const sections = qsa('section[id], div[id]').filter(el =>
  ['platform','solutions','resources','pricing'].includes(el.id)
);
const navItems = qsa('.nav-item');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(n => n.classList.toggle('active', n.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObs.observe(s));

/* ─── Scroll reveal ─── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

qsa('.reveal').forEach(el => revealObs.observe(el));

/* ─── Animated stats counter ─── */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      qsa('.stat-num', entry.target).forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = qs('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

/* ─── Document progress bar animation ─── */
const PROGRESS_STAGES = [
  { pct: 18,  label: 'Parsing deal brief…'      },
  { pct: 34,  label: 'Mapping legal variables…'  },
  { pct: 55,  label: 'Generating clauses…'       },
  { pct: 72,  label: 'Validating jurisdiction…'  },
  { pct: 88,  label: 'Checking for conflicts…'   },
  { pct: 100, label: 'Draft complete ✓'          },
];
let progIdx = 0;

function tickProgress() {
  const fill  = qs('#docProgressFill');
  const label = qs('#docProgressLabel');
  if (!fill || !label) return;

  const stage = PROGRESS_STAGES[progIdx];
  fill.style.width  = stage.pct + '%';
  label.textContent = stage.label;

  progIdx = (progIdx + 1) % PROGRESS_STAGES.length;

  const delay = progIdx === 0 ? 3000 : 1600;
  setTimeout(tickProgress, delay);
}
setTimeout(tickProgress, 1200);

/* ─── Clause explorer ─── */
const CLAUSE_DATA = {
  nda: [
    'Definition of Confidential Information',
    'Obligations of Receiving Party',
    'Permitted Disclosures',
    'Duration & Termination',
    'Return of Materials',
    'Governing Law',
    'Dispute Resolution',
    'Severability',
  ],
  mna: [
    'Purchase Price & Consideration',
    'Representations & Warranties',
    'Indemnification Provisions',
    'Closing Conditions',
    'Material Adverse Change',
    'Non-Compete Covenants',
    'Escrow Arrangements',
    'Regulatory Approvals',
    'Break-Up Fees',
  ],
  sla: [
    'Service Scope & Deliverables',
    'Performance Metrics (KPIs)',
    'Uptime & Availability',
    'Response & Resolution Times',
    'Service Credits',
    'Exclusions & Limitations',
    'Change Management',
    'Termination Rights',
  ],
  jv: [
    'Purpose & Scope of Venture',
    'Capital Contributions',
    'Profit & Loss Sharing',
    'Management Structure',
    'Decision-Making Rights',
    'Intellectual Property Ownership',
    'Exit Mechanisms',
    'Deadlock Provisions',
  ],
  sha: [
    'Share Classes & Rights',
    'Dividend Policy',
    'Pre-emption Rights',
    'Drag-Along & Tag-Along',
    'Board Composition',
    'Reserved Matters',
    'Anti-Dilution Protection',
    'Transfer Restrictions',
  ],
  emp: [
    'Role & Responsibilities',
    'Compensation & Benefits',
    'Probationary Period',
    'Confidentiality Obligations',
    'Non-Solicitation',
    'Intellectual Property Assignment',
    'Termination & Notice',
    'Dispute Resolution',
  ],
};

function renderClauses(type) {
  const preview = qs('#clausePreview');
  const clauses = CLAUSE_DATA[type] || [];
  preview.innerHTML = `<ul class="clause-list">${
    clauses.map((c, i) => `
      <li class="clause-item" style="animation-delay:${i * 40}ms">
        <span class="clause-item-dot"></span>${c}
      </li>
    `).join('')
  }</ul>`;
}

qsa('.clause-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    qsa('.clause-tab').forEach(t => {
      t.classList.remove('clause-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('clause-tab--active');
    tab.setAttribute('aria-selected', 'true');
    renderClauses(tab.dataset.type);
  });
});

renderClauses('nda');

/* ─── Modal ─── */
const modalOverlay = qs('#modalOverlay');
const modalBox     = qs('.modal-box');
const modalClose   = qs('#modalCloseBtn');
const modalDone    = qs('#modalDoneBtn');
const formView     = qs('#modalFormView');
const successView  = qs('#modalSuccess');
const draftForm    = qs('#draftForm');
const submitBtn    = qs('#submitBtn');

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  formView.style.display = 'block';
  successView.classList.remove('show');
  if (draftForm) draftForm.reset();
  clearAllErrors();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* Wire all "open modal" triggers */
const openTriggers = [
  qs('#clientLoginBtn'),
  qs('#getStartedBtn'),
  qs('#mobileGetStarted'),
  qs('#startDraftingBtn'),
  qs('#initDraftBtn'),
];
openTriggers.forEach(btn => btn && btn.addEventListener('click', (e) => {
  if (btn.classList.contains('ripple')) addRipple(e);
  openModal();
}));

/* Watch demo scrolls to solutions */
const watchDemo = qs('#watchDemoBtn');
if (watchDemo) {
  watchDemo.addEventListener('click', () => {
    qs('#solutions').scrollIntoView({ behavior: 'smooth' });
    showToast('↓ Scrolling to product overview');
  });
}

modalClose.addEventListener('click', closeModal);
if (modalDone) modalDone.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

/* ─── Form validation ─── */
const FIELDS = [
  { id: 'fullName',      errId: 'err-fullName',      test: v => v.trim().length > 1       },
  { id: 'firm',          errId: 'err-firm',          test: v => v.trim().length > 1       },
  { id: 'workEmail',     errId: 'err-workEmail',     test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
  { id: 'agreementType', errId: 'err-agreementType', test: v => v !== ''                  },
  { id: 'jurisdiction',  errId: 'err-jurisdiction',  test: v => v !== ''                  },
];

function showErr(fieldId, errId) {
  qs(`#${fieldId}`)?.classList.add('error');
  const err = qs(`#${errId}`);
  if (err) err.classList.add('show');
}
function clearErr(fieldId, errId) {
  qs(`#${fieldId}`)?.classList.remove('error');
  const err = qs(`#${errId}`);
  if (err) err.classList.remove('show');
}
function clearAllErrors() {
  FIELDS.forEach(({ id, errId }) => clearErr(id, errId));
}

/* Clear on input */
FIELDS.forEach(({ id, errId }) => {
  qs(`#${id}`)?.addEventListener('input', () => clearErr(id, errId));
  qs(`#${id}`)?.addEventListener('change', () => clearErr(id, errId));
});

if (draftForm) {
  draftForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    clearAllErrors();

    FIELDS.forEach(({ id, errId, test }) => {
      const val = qs(`#${id}`)?.value ?? '';
      if (!test(val)) { showErr(id, errId); valid = false; }
    });

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Initializing…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Initialize Draft →';
      formView.style.display = 'none';
      successView.classList.add('show');
    }, 1400);
  });
}
