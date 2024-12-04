const hamburger = document.querySelector('.hamburger');
const sideNav = document.querySelector('.side-nav2');
const sideNavClose = document.querySelector('.side-nav-close');

// Open side navigation
hamburger.addEventListener('click', () => {
    // Show popup message when hamburger is clicked
    const popupMessage = document.createElement('div');
    popupMessage.className = 'popup-message';
    popupMessage.textContent = 'Menu is under development.';
    
    document.body.appendChild(popupMessage);

    // Automatically hide the popup after 3 seconds
    setTimeout(() => {
        popupMessage.classList.add('fade-out');
        setTimeout(() => popupMessage.remove(), 500); // Remove the element after fade-out
    }, 3000);

    // Optionally, you can open the side navigation here if desired:
    // sideNav.classList.add('open');
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
