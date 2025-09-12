
// Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const mobileMenuButton = document.querySelector('button[aria-label="Mobile menu"]');
const mobileMenu = document.querySelector('#mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Animação do scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.project-card, .skill-card');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Estilo inicial para animação
document.querySelectorAll('.project-card, .skill-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// animação ao rolar a página
window.addEventListener('scroll', animateOnScroll);

// Executar uma vez ao carregar a página
window.addEventListener('load', animateOnScroll);

// Formulário de email e popup de sucesso
const form = document.getElementById('contactForm');
const popup = document.getElementById('successPopup');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch("https://formsubmit.co/brendoalmeidalk@gmail.com", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            // Mostrar popup
            popup.classList.remove('hidden');

            // Ocultar depois de 3 segundos
            setTimeout(() => {
                popup.classList.add('hidden');
            }, 3000);

            form.reset();
        } else {
            alert("Erro ao enviar. Por favor, tente novamente mais tarde.");
        }
    } catch (error) {
        alert("Erro ao conectar. Verifique sua internet.");
    }
});