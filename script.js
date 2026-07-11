const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const revealItems = document.querySelectorAll('[data-reveal]');
const sections = document.querySelectorAll('header[id], section[id]');
const projectCards = document.querySelectorAll('.project-card');
const form = document.getElementById('contactForm');
const popup = document.getElementById('successPopup');

const closeMenu = () => {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
};

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const target = document.querySelector(anchor.getAttribute('href'));

        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        closeMenu();
    });
});

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });

    revealItems.forEach((item) => revealObserver.observe(item));

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navAnchors.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach((section) => navObserver.observe(section));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (!prefersReducedMotion) {
    let cursorFrame = null;

    document.addEventListener('pointermove', (event) => {
        if (cursorFrame) return;

        cursorFrame = requestAnimationFrame(() => {
            root.style.setProperty('--cursor-x', `${event.clientX}px`);
            root.style.setProperty('--cursor-y', `${event.clientY}px`);
            cursorFrame = null;
        });
    });

    projectCards.forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) - 0.5;
            const y = ((event.clientY - rect.top) / rect.height) - 0.5;

            card.style.setProperty('--tilt-x', `${y * -8}deg`);
            card.style.setProperty('--tilt-y', `${x * 10}deg`);
            card.classList.add('is-tilting');
        });

        card.addEventListener('pointerleave', () => {
            card.classList.remove('is-tilting');
            card.style.removeProperty('--tilt-x');
            card.style.removeProperty('--tilt-y');
        });
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('input, textarea')) return;

        const slash = document.createElement('span');
        slash.className = 'slash-burst';
        slash.style.left = `${event.clientX}px`;
        slash.style.top = `${event.clientY}px`;
        document.body.appendChild(slash);
        slash.addEventListener('animationend', () => slash.remove(), { once: true });
    });
}

const showPopup = (message, isError = false) => {
    if (!popup) return;

    popup.textContent = message;
    popup.classList.toggle('is-error', isError);
    popup.classList.add('is-visible');

    window.setTimeout(() => {
        popup.classList.remove('is-visible');
    }, 3200);
};

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerHTML : '';

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Enviando</span><i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
        }

        try {
            const response = await fetch('https://formsubmit.co/brendoalmeidalk@gmail.com', {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            showPopup('Mensagem enviada com sucesso.');
            form.reset();
        } catch (error) {
            showPopup('Erro ao enviar. Tente novamente mais tarde.', true);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        }
    });
}
