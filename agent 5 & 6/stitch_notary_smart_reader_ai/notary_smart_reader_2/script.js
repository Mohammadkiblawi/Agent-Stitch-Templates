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

// Close menu clicking outside
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
        }, Math.min(idx * 110, 400));
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
  const duration = 2000;
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
   CONFIDENCE BAR
=========================== */
const confFill = document.getElementById('conf-fill');

if (confFill) {
  const confObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          confFill.style.width = '99.8%';
        }, 500);
        confObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  confObs.observe(confFill.closest('.feature-card'));
}

/* ===========================
   REPORT WINDOW ANIMATION
=========================== */
function runReport() {
  const prog = document.getElementById('rw-prog');
  const scan = document.getElementById('rw-scan');
  const badge = document.getElementById('rw-badge');
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

  if (badge) {
    badge.className = 'rw-badge processing';
    badge.innerHTML = '<span class="rw-badge-dot"></span> Processing';
  }

  if (scan) scan.style.opacity = '1';

  // Animate
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
          if (badge) {
            badge.className = 'rw-badge complete';
            badge.innerHTML = '<span class="rw-badge-dot"></span> Complete';
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
const demoForm = document.getElementById('demo-form');
const formSuccess = document.getElementById('form-success');

if (demoForm) {
  demoForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = demoForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
    btn.disabled = true;

    setTimeout(() => {
      demoForm.style.display = 'none';
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
   FEATURE CARD STAGGER DELAY
=========================== */
document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.08) + 's';
});

document.querySelectorAll('.p-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});