/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===========================
   HAMBURGER — TOP DOWN SLIDE
=========================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMenu(open) {
  hamburger.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  hamburger.setAttribute('aria-expanded', String(open));
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  toggleMenu(!isOpen);
});

hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    hamburger.click();
  }
});

document.querySelectorAll('.mobile-links a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    toggleMenu(false);
  }
});

/* ===========================
   SCROLL REVEAL
=========================== */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = Array.from(
          el.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right')
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
   AGENT FEEDBACK ANIMATION
=========================== */
function runFeedbackAnimation() {
  const feedback = document.getElementById('afc-feedback');
  const progFill = document.getElementById('afc-prog-fill');

  if (feedback) {
    feedback.classList.remove('show');
    setTimeout(() => {
      feedback.classList.add('show');
    }, 600);
  }

  if (progFill) {
    progFill.style.width = '0%';
    setTimeout(() => {
      progFill.style.width = '78%';
    }, 800);
  }
}

const feedbackCard = document.querySelector('.agent-feedback-card');
if (feedbackCard) {
  const fbObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runFeedbackAnimation();
      }
    });
  }, { threshold: 0.4 });

  fbObs.observe(feedbackCard);
  feedbackCard.addEventListener('click', runFeedbackAnimation);
  feedbackCard.style.cursor = 'pointer';
  feedbackCard.setAttribute('title', 'Click to replay');
}

/* ===========================
   FORM SUBMISSION
=========================== */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Setting up your curriculum…';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
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
   ACTIVE NAV HIGHLIGHT
=========================== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links li a[href^="#"]');
  let current = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 110) {
      current = s.getAttribute('id');
    }
  });

  links.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--neon-orange)';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ===========================
   STAGGER DELAYS
=========================== */
document.querySelectorAll('.smarter-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.path-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.p-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.cp-item').forEach((item, i) => {
  item.style.transitionDelay = (i * 0.08) + 's';
});