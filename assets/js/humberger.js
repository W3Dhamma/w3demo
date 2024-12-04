const hamburger = document.querySelector('.hamburger');
const sideNav = document.querySelector('.side-nav2');
const sideNavClose = document.querySelector('.side-nav-close');

// Open side navigation
hamburger.addEventListener('click', () => {
    sideNav.classList.add('open');
});

// Close side navigation
sideNavClose.addEventListener('click', () => {
    sideNav.classList.remove('open');
});

// Close side navigation when clicking outside
document.addEventListener('click', (event) => {
    if (!sideNav.contains(event.target) && !hamburger.contains(event.target)) {
        sideNav.classList.remove('open');
    }
});
