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
   HERO BUBBLE BUTTONS
=========================== */
const learnMoreBtn = document.getElementById('learn-more-btn');
const skipBtn = document.getElementById('skip-btn');
const aiBubble = document.getElementById('ai-bubble');

if (learnMoreBtn) {
  learnMoreBtn.addEventListener('click', () => {
    learnMoreBtn.textContent = 'Great! Loading memoization lesson…';
    learnMoreBtn.disabled = true;

    setTimeout(() => {
      aiBubble.querySelector('p').textContent =
        'Memoization stores results of expensive function calls. ' +
        'Try adding a cache dictionary to your fibonacci function!';
      learnMoreBtn.textContent = 'Got it!';
      learnMoreBtn.disabled = false;
    }, 1200);
  });
}

if (skipBtn) {
  skipBtn.addEventListener('click', () => {
    aiBubble.style.opacity = '0.5';
    aiBubble.style.transform = 'translateY(4px)';
    setTimeout(() => {
      aiBubble.querySelector('p').textContent =
        'No problem! Keep writing and I\'ll give you feedback as you go.';
      aiBubble.style.opacity = '1';
      aiBubble.style.transform = 'translateY(0)';
    }, 600);
  });
}

/* ===========================
   DEMO EDITOR ANIMATION
=========================== */
function runDemoAnalysis() {
  const prog = document.getElementById('fb-prog');
  const scan = document.getElementById('fb-scan');
  const badge = document.getElementById('demo-badge');
  const f1 = document.getElementById('fb-1');
  const f2 = document.getElementById('fb-2');
  const f3 = document.getElementById('fb-3');

  if (!prog) return;

  // Reset
  prog.style.transition = 'none';
  prog.style.width = '0%';

  [f1, f2, f3].forEach(f => {
    if (f) f.classList.remove('show');
  });

  if (badge) {
    badge.className = 'demo-badge';
    badge.innerHTML = '<span class="demo-dot"></span> AI Analysing';
  }

  if (scan) scan.style.opacity = '1';

  requestAnimationFrame(() => {
    prog.style.transition = 'width 0.2s ease';

    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 8 + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);

        setTimeout(() => {
          if (scan) scan.style.opacity = '0';
          if (badge) {
            badge.className = 'demo-badge complete';
            badge.innerHTML = '<span class="demo-dot"></span> Analysis Complete';
          }
        }, 300);
      }
      prog.style.width = pct + '%';
    }, 75);
  });

  setTimeout(() => { if (f1) f1.classList.add('show'); }, 900);
  setTimeout(() => { if (f2) f2.classList.add('show'); }, 1700);
  setTimeout(() => { if (f3) f3.classList.add('show'); }, 2500);
}

const demoEditor = document.getElementById('demo-editor');

if (demoEditor) {
  const deObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runDemoAnalysis();
      }
    });
  }, { threshold: 0.3 });

  deObs.observe(demoEditor);

  demoEditor.addEventListener('click', () => {
    const scan = document.getElementById('fb-scan');
    if (scan) scan.style.opacity = '1';
    runDemoAnalysis();
  });
}

/* ===========================
   FORM SUBMISSION
=========================== */
const startForm = document.getElementById('start-form');
const formSuccess = document.getElementById('form-success');

if (startForm) {
  startForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = startForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Setting up your curriculum…';
    btn.disabled = true;

    setTimeout(() => {
      startForm.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('visible');
    }, 1800);
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
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   ACTIVE NAV ON SCROLL
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
    a.classList.remove('nav-active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('nav-active');
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });

/* ===========================
   STAGGER DELAYS
=========================== */
document.querySelectorAll('.feat-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.cg-item').forEach((item, i) => {
  item.style.transitionDelay = (i * 0.08) + 's';
});

document.querySelectorAll('.path-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.p-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});