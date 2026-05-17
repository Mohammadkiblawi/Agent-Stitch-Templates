/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===========================
   HAMBURGER — TOP DOWN MENU
=========================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(!isOpen));
});

// Keyboard support
hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    hamburger.click();
  }
});

// Close on mobile link click
document.querySelectorAll('.mobile-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
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
   TERMINAL STATUS ANIMATION
=========================== */
function runTerminal() {
  const lines = [
    { id: 'ts-1', text: 'status: analyzing logic', color: 'default' },
    { id: 'ts-2', text: 'difficulty: adjusting [-10%]', color: 'accent' },
    { id: 'ts-3', text: 'feedback: ready', color: 'default' }
  ];

  lines.forEach((line, i) => {
    const el = document.getElementById(line.id);
    if (!el) return;

    el.textContent = '';
    if (line.color === 'accent') {
      el.style.color = 'var(--primary)';
    } else {
      el.style.color = '';
    }

    setTimeout(() => {
      let charIdx = 0;
      const interval = setInterval(() => {
        if (charIdx < line.text.length) {
          el.textContent += line.text[charIdx];
          charIdx++;
        } else {
          clearInterval(interval);
        }
      }, 40);
    }, i * 900);
  });
}

const terminalBlock = document.getElementById('terminal-status');
if (terminalBlock) {
  const termObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runTerminal();
      }
    });
  }, { threshold: 0.5 });

  termObs.observe(terminalBlock);
  terminalBlock.addEventListener('click', runTerminal);
  terminalBlock.style.cursor = 'pointer';
  terminalBlock.setAttribute('title', 'Click to replay');
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
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> INITIALIZING...';
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
   ACTIVE NAV ON SCROLL
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
      a.style.color = 'var(--primary)';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ===========================
   STAGGER CARD DELAYS
=========================== */
document.querySelectorAll('.arch-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.path-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.p-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.cib').forEach((item, i) => {
  item.style.transitionDelay = (i * 0.08) + 's';
});