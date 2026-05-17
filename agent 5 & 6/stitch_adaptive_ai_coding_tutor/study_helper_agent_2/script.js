/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
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
   PROGRESS BAR ANIMATION
=========================== */
const progFill = document.getElementById('prog-fill-1');

if (progFill) {
  const progObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          progFill.style.width = '68%';
        }, 400);
        progObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  progObs.observe(progFill.closest('.feat-card'));
}

/* ===========================
   SPEED RING ANIMATION
=========================== */
const ringProg = document.getElementById('ring-prog');

if (ringProg) {
  const ringObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          // 32 * 2 * PI ≈ 201
          // 4x faster = ~75% of circle
          ringProg.style.strokeDashoffset = '50';
        }, 400);
        ringObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  ringObs.observe(ringProg.closest('.feat-card'));
}

/* ===========================
   CHAT ANIMATION
=========================== */
function runChatAnimation() {
  const userMsg = document.getElementById('chat-user');
  const agentMsg = document.getElementById('chat-agent');
  const agentBubble = agentMsg ? agentMsg.querySelector('.agent-bubble') : null;
  const typing = document.getElementById('chat-typing');

  if (!userMsg) return;

  // Reset
  userMsg.style.opacity = '0';
  userMsg.style.transform = 'translateY(8px)';
  if (agentBubble) {
    agentBubble.classList.remove('show');
  }
  if (typing) {
    typing.style.display = 'none';
    typing.style.opacity = '0';
  }

  // User message appears
  setTimeout(() => {
    userMsg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    userMsg.style.opacity = '1';
    userMsg.style.transform = 'translateY(0)';
  }, 300);

  // Typing indicator appears
  setTimeout(() => {
    if (typing) {
      typing.style.display = 'flex';
      requestAnimationFrame(() => {
        typing.style.transition = 'opacity 0.3s ease';
        typing.style.opacity = '1';
      });
    }
  }, 900);

  // Agent response appears, typing hides
  setTimeout(() => {
    if (typing) {
      typing.style.opacity = '0';
      setTimeout(() => {
        typing.style.display = 'none';
      }, 300);
    }
    if (agentBubble) {
      agentBubble.classList.add('show');
    }
  }, 2400);
}

const chatDemo = document.getElementById('chat-demo');
if (chatDemo) {
  const chatObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runChatAnimation();
      }
    });
  }, { threshold: 0.3 });

  chatObs.observe(chatDemo);

  // Click to replay
  chatDemo.addEventListener('click', runChatAnimation);
  chatDemo.style.cursor = 'pointer';
  chatDemo.setAttribute('title', 'Click to replay');
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
   STAGGER DELAYS
=========================== */
document.querySelectorAll('.feat-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.path-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});

document.querySelectorAll('.p-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.1) + 's';
});