// =============================================
// STRATEGIC AGENT — script.js
// =============================================

'use strict';

// ---- Utilities ----
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// =============================================
// NAVBAR: scroll shadow + active link
// =============================================
(function initNavbar() {
    const navbar = $('#navbar');
    const navLinks = $$('.nav-link');

    // Scroll shadow
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active section highlighting via IntersectionObserver
    const sections = $$('section[id]');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.id;
                navLinks.forEach(a => {
                    a.classList.toggle('active',
                        a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => io.observe(s));
})();

// =============================================
// HAMBURGER / MOBILE DRAWER
// =============================================
(function initDrawer() {
    const btn     = $('#hamburger');
    const drawer  = $('#mobileDrawer');
    const overlay = $('#drawerOverlay');

    function open() {
        btn.classList.add('open');
        drawer.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        btn.classList.remove('open');
        drawer.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        drawer.classList.contains('open') ? close() : open();
    });

    overlay.addEventListener('click', close);

    $$('.drawer-link').forEach(link => {
        link.addEventListener('click', close);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
    });
})();

// =============================================
// SMOOTH SCROLL for anchor links
// =============================================
document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 68; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
});

// =============================================
// INTERSECTION OBSERVER — reveal animations
// =============================================
(function initReveal() {
    const options = {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const delay = parseInt(el.dataset.delay || '0', 10);

            setTimeout(() => {
                el.classList.add('visible');
            }, delay);

            io.unobserve(el);
        });
    }, options);

    // Elements to watch
    const targets = [
        '#capHeader',
        '#processFlow',
        '#strategyContent',
        '#ctaBox',
        '.arch-card',
        '.tl-item',
    ];

    targets.forEach(sel => {
        $$(sel).forEach(el => io.observe(el));
    });
})();

// =============================================
// COUNTER ANIMATION
// =============================================
(function initCounters() {
    const counters = $$('.metric-val[data-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    counters.forEach(el => io.observe(el));

    function animateCount(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1
                ? 1
                : 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
})();

// =============================================
// HERO IMAGE — subtle parallax
// =============================================
(function initParallax() {
    const img = $('#heroImg');
    if (!img) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight * 1.2) {
                img.style.transform = `translateY(${scrolled * 0.08}px)`;
            }
            ticking = false;
        });
    }, { passive: true });
})();

// =============================================
// CARD 3D tilt on hover
// =============================================
(function initCardTilt() {
    const cards = $$('.arch-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect  = card.getBoundingClientRect();
            const x     = e.clientX - rect.left;
            const y     = e.clientY - rect.top;
            const cx    = rect.width  / 2;
            const cy    = rect.height / 2;
            const rotX  = ((y - cy) / cy) * -4;
            const rotY  = ((x - cx) / cx) *  4;
            card.style.transform = `
                translateY(-3px)
                rotateX(${rotX}deg)
                rotateY(${rotY}deg)
            `;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.35s ease, border-color 0.25s, box-shadow 0.25s';
        });
    });
})();

// =============================================
// CTA FORM SUBMISSION
// =============================================
(function initCTAForm() {
    const form  = $('#ctaForm');
    const input = $('#ctaEmail');
    if (!form || !input) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = input.value.trim();

        if (!isValidEmail(email)) {
            input.classList.add('error');
            input.focus();
            input.addEventListener('input', () => input.classList.remove('error'), { once: true });
            showToast('Please enter a valid work email.', 'error');
            return;
        }

        // Simulate submission
        const btn = form.querySelector('.cta-btn');
        btn.textContent = 'Sending…';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Book a Strategic Consultation';
            btn.disabled = false;
            input.value = '';
            showToast('Request submitted! We\'ll be in touch shortly. ✓');
        }, 1200);
    });
})();

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =============================================
// TOAST
// =============================================
let toastTimer = null;

function showToast(msg, type = 'success') {
    const toast   = $('#toast');
    const msgEl   = $('#toastMsg');
    if (!toast || !msgEl) return;

    msgEl.textContent = msg;

    // Style by type
    toast.style.borderColor = type === 'error'
        ? 'rgba(220,38,38,0.3)'
        : 'var(--gray-200)';

    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// =============================================
// FLOATING TAGS: show on mobile as badges
// =============================================
(function initFloatingTags() {
    // On small screens, float-tags are hidden via CSS.
    // On desktop, they animate via CSS keyframes already.
    // This just ensures they're accessible on resize.
    const checkWidth = () => {
        const tags = $$('.float-tag');
        tags.forEach(t => {
            t.style.display = window.innerWidth < 1025 ? 'none' : '';
        });
    };

    window.addEventListener('resize', checkWidth, { passive: true });
    checkWidth();
})();

// =============================================
// UPLOAD DRAG HINT on hero image
// =============================================
(function initImageInteraction() {
    const wrap = $('.hero-img-wrap');
    if (!wrap) return;

    wrap.addEventListener('mouseenter', () => {
        wrap.style.cursor = 'pointer';
    });

    wrap.addEventListener('click', () => {
        showToast('Book a demo to see the agent in action →');
    });
})();

// =============================================
// KEYBOARD ACCESSIBILITY: focus ring management
// =============================================
document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});