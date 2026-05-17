/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ===========================
   HAMBURGER
=========================== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

/* ===========================
   SCROLL REVEAL
=========================== */
function initReveal() {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = Array.from(
          el.parentElement.querySelectorAll('.reveal')
        );
        const idx = siblings.indexOf(el);
        setTimeout(() => {
          el.classList.add('visible');
        }, Math.min(idx * 110, 440));
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
}

initReveal();

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const decimals = parseInt(el.getAttribute('data-decimal')) || 0;
  const duration = 2200;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = eased * target;

    el.textContent = decimals > 0
      ? value.toFixed(decimals)
      : Math.floor(value).toString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = decimals > 0
        ? target.toFixed(decimals)
        : target.toString();
    }
  }

  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ===========================
   HERO DOC VIEWER ANIMATION
=========================== */
function runDocViewer() {
  const highlight = document.getElementById('dv-highlight');
  const popup = document.getElementById('dv-popup');
  const verified = document.getElementById('dv-verified');

  if (!highlight) return;

  // Reset
  highlight.style.background = 'var(--border)';
  if (popup) popup.classList.remove('show');
  if (verified) verified.classList.remove('show');

  // Step 1: highlight mismatch line
  setTimeout(() => {
    if (highlight) highlight.style.background = 'var(--highlight)';
  }, 800);

  // Step 2: show popup
  setTimeout(() => {
    if (popup) popup.classList.add('show');
  }, 1400);

  // Step 3: show verified badge (after correction implied)
  setTimeout(() => {
    if (verified) verified.classList.add('show');
  }, 3000);
}

const docViewer = document.getElementById('doc-viewer');
if (docViewer) {
  const dvObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runDocViewer();
      }
    });
  }, { threshold: 0.4 });

  dvObs.observe(docViewer);

  docViewer.addEventListener('click', () => runDocViewer());
  docViewer.setAttribute('title', 'Click to replay');
}

/* ===========================
   REPORT WINDOW ANIMATION
=========================== */
function runReport() {
  const prog = document.getElementById('rw-prog');
  const scan = document.getElementById('rw-scan');
  const status = document.getElementById('rw-status');
  const f1 = document.getElementById('rw-f1');
  const f2 = document.getElementById('rw-f2');
  const f3 = document.getElementById('rw-f3');

  if (!prog) return;

  // Reset
  prog.style.transition = 'none';
  prog.style.width = '0%';

  [f1, f2, f3].forEach(f => {
    if (f) f.classList.remove('show');
  });

  if (status) {
    status.className = 'rw-status processing';
    status.innerHTML = '<span class="rw-dot"></span> Processing';
  }

  if (scan) scan.style.opacity = '1';

  requestAnimationFrame(() => {
    prog.style.transition = 'width 0.2s ease';

    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 7 + 3;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (scan) scan.style.opacity = '0';
          if (status) {
            status.className = 'rw-status complete';
            status.innerHTML = '<span class="rw-dot"></span> Complete';
          }
        }, 300);
      }
      prog.style.width = pct + '%';
    }, 80);
  });

  setTimeout(() => { if (f1) f1.classList.add('show'); }, 1100);
  setTimeout(() => { if (f2) f2.classList.add('show'); }, 1900);
  setTimeout(() => { if (f3) f3.classList.add('show'); }, 2700);
}

const reportWin = document.getElementById('report-window');
if (reportWin) {
  const rwObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runReport();
      }
    });
  }, { threshold: 0.3 });

  rwObs.observe(reportWin);

  reportWin.addEventListener('click', () => {
    const scan = document.getElementById('rw-scan');
    if (scan) scan.style.opacity = '1';
    runReport();
  });
}

/* ===========================
   FORM SUBMISSION
=========================== */
const accessForm = document.getElementById('access-form');
const formSuccess = document.getElementById('form-success');

if (accessForm) {
  accessForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = accessForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
    btn.disabled = true;

    setTimeout(() => {
      accessForm.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('visible');
    }, 1500);
  });
}

/* ===========================
   SMOOTH SCROLL
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 74;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   ACTIVE NAV
=========================== */
function updateNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 110) {
      current = s.getAttribute('id');
    }
  });

  links.forEach(a => {
    a.style.color = '';
    a.style.fontWeight = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--primary)';
      a.style.fontWeight = '700';
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });

/* ===========================
   FEATURE CARD STAGGER
=========================== */
document.querySelectorAll('.a-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.sec-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.08) + 's';
});

document.querySelectorAll('.p-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.as-item').forEach((item, i) => {
  item.style.transitionDelay = (i * 0.08) + 's';
});