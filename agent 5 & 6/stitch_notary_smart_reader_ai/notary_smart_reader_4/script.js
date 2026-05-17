/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

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

/* ===========================
   SCROLL REVEAL
=========================== */
function initReveal() {
  const elements = document.querySelectorAll(
    '.reveal, .reveal-left'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach((el, index) => {
    const siblings = el.parentElement.querySelectorAll('.reveal, .reveal-left');
    const delay = Array.from(siblings).indexOf(el) * 120;
    el.dataset.delay = delay;
    observer.observe(el);
  });
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

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = eased * target;

    el.textContent = decimals > 0
      ? value.toFixed(decimals)
      : Math.floor(value).toString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = decimals > 0
        ? target.toFixed(decimals)
        : target.toString();
    }
  }

  requestAnimationFrame(update);
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
   DEMO WINDOW ANIMATION
=========================== */
function runDemoAnimation() {
  const progressFill = document.getElementById('progress-fill');
  const statusBadge = document.getElementById('status-badge');
  const errorItem = document.getElementById('analysis-error');
  const successItem = document.getElementById('analysis-success');
  const warningItem = document.getElementById('analysis-warning');
  const scanProgress = document.getElementById('scan-progress');

  if (!progressFill) return;

  // Reset
  progressFill.style.width = '0%';
  errorItem.classList.remove('visible');
  successItem.classList.remove('visible');
  warningItem.classList.remove('visible');
  statusBadge.className = 'status-badge processing';
  statusBadge.innerHTML = '<span class="status-dot"></span>Processing';

  // Animate progress bar
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 6 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);

      // Hide scan progress, show status complete
      setTimeout(() => {
        scanProgress.style.opacity = '0';
        statusBadge.className = 'status-badge complete';
        statusBadge.innerHTML = '<span class="status-dot"></span>Complete';
      }, 300);
    }
    progressFill.style.width = progress + '%';
  }, 80);

  // Reveal analysis items progressively
  setTimeout(() => {
    errorItem.classList.add('visible');
    errorItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  }, 1200);

  setTimeout(() => {
    successItem.classList.add('visible');
    successItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  }, 2000);

  setTimeout(() => {
    warningItem.classList.add('visible');
    warningItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  }, 2800);
}

// Run animation when demo comes into view
const demoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runDemoAnimation();
    }
  });
}, { threshold: 0.3 });

const demoWindow = document.querySelector('.demo-window');
if (demoWindow) {
  demoObserver.observe(demoWindow);
}

// Re-run on click
if (demoWindow) {
  demoWindow.addEventListener('click', () => {
    const scanProgress = document.getElementById('scan-progress');
    if (scanProgress) scanProgress.style.opacity = '1';
    runDemoAnimation();
  });

  demoWindow.style.cursor = 'pointer';
  demoWindow.title = 'Click to replay the analysis';
}

/* ===========================
   FORM SUBMISSION
=========================== */
const ctaForm = document.getElementById('cta-form');
const formSuccess = document.getElementById('form-success');

if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = ctaForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
    btn.disabled = true;

    setTimeout(() => {
      ctaForm.style.display = 'none';
      formSuccess.classList.add('visible');
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
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   FEATURE CARDS STAGGER
=========================== */
document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

/* ===========================
   LANG CARDS HOVER PULSE
=========================== */
document.querySelectorAll('.lang-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.transform = 'scale(1.05)';
    pill.style.boxShadow = '0 4px 20px rgba(45,212,191,0.2)';
    pill.style.borderColor = 'rgba(45,212,191,0.4)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = '';
    pill.style.boxShadow = '';
    pill.style.borderColor = '';
  });
});

/* ===========================
   ACTIVE NAV HIGHLIGHT
=========================== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const anchors = document.querySelectorAll('.nav-links a[href^="#"]');

  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 130) {
      current = section.getAttribute('id');
    }
  });

  anchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--text-primary)';
      a.style.fontWeight = '700';
    } else {
      a.style.fontWeight = '';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });