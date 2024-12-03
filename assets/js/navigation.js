const nav = document.querySelector('nav');
const pageContent = document.querySelector('main');
const footer = document.querySelector('footer');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavClose = document.querySelector('.mobile-nav-close');

function hideContent() {
    nav.classList.add('hidden');
    pageContent.classList.add('content-hidden');
    footer.classList.add('content-hidden');
}

function showContent() {
    nav.classList.remove('hidden');
    pageContent.classList.remove('content-hidden');
    footer.classList.remove('content-hidden');
}

menuToggle.addEventListener('click', () => {
    mobileNav.classList.add('active');
    hideContent();
});

mobileNavClose.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    showContent();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            searchOverlay.classList.remove('active');
            mobileNav.classList.remove('active');
            showContent();
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

