/* ===========================
   NAVBAR SCROLL EFFECT
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

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
   PARTICLE BACKGROUND
=========================== */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 20 : 45;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.bottom = '-10px';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';

    container.appendChild(particle);
  }
}

createParticles();

/* ===========================
   SCROLL REVEAL
=========================== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.lifecycle-card, .strategy-item, .pricing-card, ' +
    '.stat-item, .section-header, .cta-content, ' +
    '.visual-card, .strategy-content, .footer-brand, .footer-col'
  );

  revealEls.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (index % 4) * 0.1 + 's';
  });

  const leftEls = document.querySelectorAll('.strategy-visual');
  leftEls.forEach(el => el.classList.add('reveal-left'));

  const rightEls = document.querySelectorAll('.strategy-content');
  rightEls.forEach(el => el.classList.add('reveal-right'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

initScrollReveal();

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

animateCounters();

/* ===========================
   FORM SUBMISSION
=========================== */
const ctaForm = document.getElementById('cta-form');
const formSuccess = document.getElementById('form-success');

if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = ctaForm.querySelector('button[type="submit"]');
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    setTimeout(() => {
      ctaForm.style.display = 'none';
      formSuccess.classList.add('visible');
    }, 1500);
  });
}

/* ===========================
   ACTIVE NAV LINK ON SCROLL
=========================== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach(anchor => {
    anchor.classList.remove('active-nav');
    if (anchor.getAttribute('href') === '#' + current) {
      anchor.classList.add('active-nav');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

/* ===========================
   LIFECYCLE CARD HOVER EFFECT
=========================== */
document.querySelectorAll('.lifecycle-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.background = 'linear-gradient(135deg, #071828, #0a2035)';
  });
  card.addEventListener('mouseleave', function () {
    this.style.background = '';
  });
});

/* ===========================
   SMOOTH ANCHOR SCROLL
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
   TYPING EFFECT FOR HERO TAGLINE
=========================== */
function typeEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const text = tagline.textContent;
  tagline.textContent = '';
  tagline.style.visibility = 'visible';

  let i = 0;
  const speed = 80;

  function type() {
    if (i < text.length) {
      tagline.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  setTimeout(type, 1000);
}

typeEffect();