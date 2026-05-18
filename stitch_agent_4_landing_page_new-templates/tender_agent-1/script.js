// script.js

// ========================
// NAVBAR SCROLL
// ========================
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        scrollTopBtn.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================
// HAMBURGER MENU
// ========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

// ========================
// SMOOTH SCROLL
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ========================
// COUNTER ANIMATION
// ========================
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '%';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}

// ========================
// INTERSECTION OBSERVER
// ========================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

// Feature cards
const featureCards = document.querySelectorAll('.feature-card');
const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
                entry.target.style.animationDelay = '0ms';
            }, delay);
            featureObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

featureCards.forEach(card => featureObserver.observe(card));

// Steps
const steps = document.querySelectorAll('.step');
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 150);
            stepObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

steps.forEach(step => stepObserver.observe(step));

// Counters - hero
const heroCounters = document.querySelectorAll('.stat-number');
const heroCounterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            heroCounterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

heroCounters.forEach(counter => heroCounterObserver.observe(counter));

// Big stats
const bigStats = document.querySelectorAll('.big-stat-number');
const bigStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            bigStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

bigStats.forEach(stat => bigStatsObserver.observe(stat));

// Progress bar in hero card
const progressBar = document.querySelector('.progress-bar');
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.dataset.width;
            entry.target.style.width = width + '%';
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (progressBar) progressObserver.observe(progressBar);

// ========================
// TYPING ANIMATION
// ========================
const typingEl = document.getElementById('typingText');
const phrases = [
    "Our company brings 8+ years of infrastructure development experience, having successfully delivered 23 government projects...",
    "We hold current ISO 9001:2015 certification (Certificate No: QMS-2024-7823), demonstrating our commitment to quality...",
    "Our financial statements for the past 3 fiscal years demonstrate consistent revenue growth and strong liquidity position..."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingActive = false;

function typeText() {
    if (!typingEl || !typingActive) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        typingEl.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeText, 2000);
            return;
        }
    } else {
        typingEl.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }

    const speed = isDeleting ? 30 : 50;
    setTimeout(typeText, speed);
}

// Activate typing when in view
const draftSection = document.querySelector('.draft-preview');
if (draftSection) {
    const draftObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !typingActive) {
                typingActive = true;
                typeText();
            }
        });
    }, { threshold: 0.5 });

    draftObserver.observe(draftSection);
}

// ========================
// CTA FORM SUBMIT
// ========================
function handleCTASubmit() {
    const emailInput = document.getElementById('ctaEmail');
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
        emailInput.style.borderColor = '#EF4444';
        emailInput.style.background = 'rgba(239, 68, 68, 0.08)';
        setTimeout(() => {
            emailInput.style.borderColor = '';
            emailInput.style.background = '';
        }, 2000);
        showToast('Please enter a valid email address', 'error');
        return;
    }

    showToast('🎉 Free trial started! Check your email.');
    emailInput.value = '';
}

// Also handle enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'ctaEmail') {
        handleCTASubmit();
    }
});

// ========================
// TOAST NOTIFICATION
// ========================
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    toastMsg.textContent = msg;

    if (type === 'error') {
        toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        toast.style.color = '#EF4444';
        toast.querySelector('i').style.color = '#EF4444';
    } else {
        toast.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        toast.style.color = '#10B981';
        toast.querySelector('i').style.color = '#10B981';
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ========================
// PARALLAX EFFECT
// ========================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) {
        heroGlow.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ========================
// ACTIVE NAV LINK
// ========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================
// UPLOAD AREA INTERACTION
// ========================
const uploadArea = document.querySelector('.upload-area');
if (uploadArea) {
    uploadArea.addEventListener('click', () => {
        showToast('Upload feature would open file picker here!');
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(124, 58, 237, 0.1)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
        showToast('🎉 Tender document uploaded successfully!');
    });
}

// ========================
// CARD HOVER PARTICLES
// ========================
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = x / rect.width - 0.5;
        const yPercent = y / rect.height - 0.5;

        card.style.transform = `translateY(-5px) rotateX(${yPercent * 5}deg) rotateY(${xPercent * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ========================
// INIT ANIMATIONS
// ========================
document.addEventListener('DOMContentLoaded', () => {
    // Animate compliance score items sequentially
    const scoreItems = document.querySelectorAll('.score-item');
    scoreItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 1500 + i * 200);
    });

    // Animate requirement items
    const reqItems = document.querySelectorAll('.requirement-item');
    reqItems.forEach((item, i) => {
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '1';
        }, 2000 + i * 300);
    });
});