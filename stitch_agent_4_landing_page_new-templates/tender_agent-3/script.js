// =============================================
// STRATEGIC_AGENT — script.js
// =============================================

'use strict';

// ---- Selectors ----
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// // =============================================
// // CUSTOM CURSOR
// // =============================================
// (function initCursor() {
//     const cursor = $('#cursor');
//     const trail  = $('#cursorTrail');
//     if (!cursor || !trail) return;

//     let mx = -100, my = -100;
//     let tx = -100, ty = -100;
//     let rafId;

//     document.addEventListener('mousemove', e => {
//         mx = e.clientX;
//         my = e.clientY;
//         cursor.style.left = mx + 'px';
//         cursor.style.top  = my + 'px';
//     });

//     function animTrail() {
//         tx += (mx - tx) * 0.12;
//         ty += (my - ty) * 0.12;
//         trail.style.left = tx + 'px';
//         trail.style.top  = ty + 'px';
//         rafId = requestAnimationFrame(animTrail);
//     }
//     animTrail();

//     // Hover effect on interactive elements
//     document.addEventListener('mouseover', e => {
//         const isInteractive = e.target.closest('a, button, input, .cap-card, .test-card');
//         document.body.classList.toggle('cursor-hover', !!isInteractive);
//     });

//     document.addEventListener('mouseleave', () => {
//         cursor.style.opacity = '0';
//         trail.style.opacity = '0';
//     });
//     document.addEventListener('mouseenter', () => {
//         cursor.style.opacity = '1';
//         trail.style.opacity = '1';
//     });
// })();

// =============================================
// NAVBAR: scroll + active
// =============================================
(function initNavbar() {
    const navbar = $('#navbar');
    const links  = $$('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Active section via IntersectionObserver
    const sections = $$('section[id]');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.id;
                links.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
})();

// =============================================
// HAMBURGER
// =============================================
(function initHamburger() {
    const btn  = $('#hamburger');
    const menu = $('#mobileMenu');
    if (!btn || !menu) return;

    function close() {
        btn.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        const isOpen = menu.classList.contains('open');
        isOpen ? close() : (btn.classList.add('open'), menu.classList.add('open'), document.body.style.overflow = 'hidden');
    });

    $$('.mobile-link').forEach(l => l.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// =============================================
// SMOOTH SCROLL
// =============================================
document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: 'smooth' });
});

// =============================================
// TYPING ANIMATION (hero keyword)
// =============================================
(function initTyping() {
    const el = $('#kwText');
    if (!el) return;

    const text = 'Your team focuses on strategy. The agent handles the grind.';
    let i = 0;
    let started = false;

    function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i++);
            setTimeout(type, 38);
        }
    }

    // Start after page load delay
    setTimeout(() => {
        started = true;
        type();
    }, 1400);
})();

// =============================================
// TERMINAL ANIMATION
// =============================================
(function initTerminal() {
    const lines = [
        '#tcmd1', '#tout1', '#tout2', '#tout3', '#tout4', '#tout5', '#tout6', '#tcursor'
    ];

    let started = false;

    function runTerminal() {
        if (started) return;
        started = true;

        lines.forEach((sel, i) => {
            const el = $(sel);
            if (!el) return;
            setTimeout(() => {
                el.classList.add('show');
            }, i * 350);
        });
    }

    // Trigger when terminal is in view
    const terminal = $('#terminalWindow');
    if (!terminal) return;

    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            runTerminal();
            io.disconnect();
        }
    }, { threshold: 0.3 });

    io.observe(terminal);
})();

// =============================================
// INTERSECTION OBSERVER — reveal
// =============================================
(function initReveal() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el    = entry.target;
            const delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => el.classList.add('visible'), delay);
            io.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const selectors = [
        '.section-header',
        '.cap-card',
        '.stats-bar',
        '.strategy-grid',
        '.proc-step',
        '.test-card',
        '#ctaTitle',
        '#ctaDesc',
    ];

    selectors.forEach(sel => {
        $$(sel).forEach(el => io.observe(el));
    });

    // Section headers use .visible class directly
    $$('.section-header').forEach(el => {
        const io2 = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                entries[0].target.classList.add('visible');
                io2.disconnect();
            }
        }, { threshold: 0.2 });
        io2.observe(el);
    });
})();

// =============================================
// COUNTER ANIMATION
// =============================================
(function initCounters() {
    const counters = $$('.stat-val[data-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            animateCounter(e.target);
            io.unobserve(e.target);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => io.observe(el));

    function animateCounter(el) {
        const target   = parseFloat(el.dataset.target);
        const suffix   = el.dataset.suffix || '';
        const duration = 1800;
        const start    = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const val      = target <= 10
                ? (eased * target).toFixed(0)
                : Math.round(eased * target);
            el.textContent = val + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
})();

// =============================================
// HERO PARALLAX
// =============================================
(function initParallax() {
    const img = $('.hero-bg-img');
    if (!img) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            if (y < window.innerHeight * 1.5) {
                img.style.transform = `scale(1.05) translateY(${y * 0.1}px)`;
            }
            ticking = false;
        });
    }, { passive: true });
})();

// =============================================
// CARD GLITCH HOVER (subtle)
// =============================================
(function initCardGlow() {
    $$('.cap-card, .test-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect  = card.getBoundingClientRect();
            const x     = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
            const y     = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

            card.style.setProperty('--gx', x);
            card.style.setProperty('--gy', y);
        });

        card.addEventListener('mouseleave', () => {
            card.style.removeProperty('--gx');
            card.style.removeProperty('--gy');
        });
    });
})();

// =============================================
// CTA FORM
// =============================================
(function initForm() {
    const form  = $('#ctaForm');
    const input = $('#ctaEmail');
    if (!form || !input) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = input.value.trim();

        if (!isEmail(email)) {
            input.classList.add('error');
            input.focus();
            input.addEventListener('input', () => input.classList.remove('error'), { once: true });
            showToast('ENTER A VALID WORK EMAIL', 'error');
            return;
        }

        const btn = form.querySelector('.btn-cta-submit');
        const orig = btn.innerHTML;
        btn.textContent = 'DEPLOYING...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = orig;
            btn.disabled = false;
            input.value = '';
            showToast('REQUEST RECEIVED — AGENT WILL CONTACT YOU SHORTLY');
        }, 1400);
    });
})();

function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// =============================================
// TOAST
// =============================================
let toastTimer;

function showToast(msg, type = 'success') {
    const toast  = $('#toast');
    const msgEl  = $('#toastMsg');
    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    toast.style.borderColor = type === 'error'
        ? 'rgba(239,68,68,0.4)'
        : 'rgba(34,197,94,0.4)';
    toast.style.color = type === 'error'
        ? 'var(--red)'
        : 'var(--green)';

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

// =============================================
// KEYBOARD ACCESSIBILITY
// =============================================
document.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
});
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// =============================================
// PROCESS STEPS — stagger via IntersectionObserver
// =============================================
(function initProcessSteps() {
    const steps = $$('.proc-step');
    if (!steps.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(() => entry.target.classList.add('visible'), delay);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    steps.forEach(s => io.observe(s));
})();