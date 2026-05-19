/* ═══════════════════════════════════════════
   INTERSECTION OBSERVER — FADE UP
═══════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ═══════════════════════════════════════════
   PROGRESS BAR — HERO VISUAL
═══════════════════════════════════════════ */
window.addEventListener('load', () => {
  const fill = document.getElementById('heroPF');
  const pct  = document.getElementById('heroPct');
  if (!fill || !pct) return;

  setTimeout(() => {
    let val = 0;
    const iv = setInterval(() => {
      val += 1.2;
      fill.style.width = Math.min(val, 87) + '%';
      pct.textContent  = Math.min(Math.round(val), 87) + '%';
      if (val >= 87) clearInterval(iv);
    }, 30);
  }, 900);
});

/* ═══════════════════════════════════════════
   NAVBAR — SCROLL EFFECT
═══════════════════════════════════════════ */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ═══════════════════════════════════════════
   Nav links - Active State
═══════════════════════════════════════════ */
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach(link => {
    link.addEventListener("click", function() {
      // 1. Find the currently active link and remove the active class
      const currentActive = document.querySelector(".nav-links a.active");
      if (currentActive) {
        currentActive.classList.remove("active");
      }

      // 2. Add the active class to the clicked link
      this.classList.add("active");
    });
  });

/* ═══════════════════════════════════════════
   MODAL
═══════════════════════════════════════════ */
const modalOverlay = document.getElementById('modalOverlay');

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ═══════════════════════════════════════════
   FORM SUBMIT
═══════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-form-submit');

    btn.textContent = '✓ Request Sent!';
    btn.style.background = '#4ade80';
    btn.disabled = true;

    setTimeout(() => {
      closeModal();
      btn.textContent = 'Deploy EvaOps →';
      btn.style.background = 'var(--cyan)';
      btn.disabled = false;
      contactForm.reset();
    }, 2600);
  });
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ═══════════════════════════════════════════
   STAT COUNTER ANIMATION
═══════════════════════════════════════════ */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const target = parseFloat(counter.dataset.count);
        const suffix = counter.dataset.suffix || '';
        const prefix = counter.dataset.prefix || '';
        const isFloat = String(target).includes('.');
        let current = 0;
        const step = target / 60;

        const iv = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(iv);
          }
          counter.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
        }, 20);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-strip');
if (statsSection) statObserver.observe(statsSection);

/* ═══════════════════════════════════════════
   BAR CHART — HOVER TITLES
═══════════════════════════════════════════ */
document.querySelectorAll('.bar').forEach((bar, i) => {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  bar.title = months[i] || `Month ${i + 1}`;
});