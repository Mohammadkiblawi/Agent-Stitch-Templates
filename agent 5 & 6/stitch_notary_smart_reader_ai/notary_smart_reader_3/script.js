/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===========================
   HAMBURGER MENU
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

/* ===========================
   SCROLL REVEAL
=========================== */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

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
        }, idx * 100);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

initReveal();

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const decimals = parseInt(el.getAttribute('data-decimal')) || 0;
  const duration = 2200;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = eased * target;

    el.textContent = decimals > 0
      ? current.toFixed(decimals)
      : Math.floor(current).toString();

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

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => {
  counterObserver.observe(el);
});

/* ===========================
   CONFIDENCE BAR ANIMATION
=========================== */
const confFill = document.getElementById('conf-fill');

const confObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        confFill.style.width = '99.8%';
      }, 400);
      confObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

if (confFill) {
  confObserver.observe(confFill.closest('.feature-card'));
}

/* ===========================
   CLAUSE TAG PULSE
=========================== */
const clauseTag = document.getElementById('clause-tag');
if (clauseTag) {
  setInterval(() => {
    clauseTag.style.opacity = clauseTag.style.opacity === '0.3' ? '1' : '0.3';
  }, 1200);
}

/* ===========================
   REPORT WINDOW ANIMATION
=========================== */
function runReportAnimation() {
  const fill = document.getElementById('rw-prog-fill');
  const status = document.getElementById('rw-status');
  const progress = document.getElementById('rw-progress');
  const item1 = document.getElementById('rw-item-1');
  const item2 = document.getElementById('rw-item-2');
  const item3 = document.getElementById('rw-item-3');

  if (!fill) return;

  // Reset state
  fill.style.width = '0%';
  fill.style.transition = 'none';

  [item1, item2, item3].forEach(el => {
    if (el) el.classList.remove('visible');
  });

  if (status) {
    status.className = 'rw-status processing';
    status.innerHTML = '<span class="rw-status-dot"></span> Processing';
  }

  if (progress) {
    progress.style.opacity = '1';
  }

  // Force reflow then start animation
  requestAnimationFrame(() => {
    fill.style.transition = 'width 0.25s ease';

    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 7 + 3;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);

        setTimeout(() => {
          if (progress) progress.style.opacity = '0';
          if (status) {
            status.className = 'rw-status complete';
            status.innerHTML = '<span class="rw-status-dot"></span> Complete';
          }
        }, 300);
      }
      fill.style.width = pct + '%';
    }, 90);
  });

  // Reveal findings
  setTimeout(() => { if (item1) item1.classList.add('visible'); }, 1000);
  setTimeout(() => { if (item2) item2.classList.add('visible'); }, 1900);
  setTimeout(() => { if (item3) item3.classList.add('visible'); }, 2700);
}

// Trigger on scroll into view
const reportWindow = document.querySelector('.report-window');
if (reportWindow) {
  const rwObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runReportAnimation();
      }
    });
  }, { threshold: 0.3 });

  rwObserver.observe(reportWindow);

  // Re-run on click
  reportWindow.addEventListener('click', () => {
    if (document.getElementById('rw-progress')) {
      document.getElementById('rw-progress').style.opacity = '1';
    }
    runReportAnimation();
  });

  reportWindow.setAttribute('title', 'Click to replay the analysis');
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
    const original = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
    btn.disabled = true;

    setTimeout(() => {
      demoForm.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('visible');
    }, 1600);
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
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   ACTIVE NAV ON SCROLL
=========================== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  links.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--text-primary)';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });