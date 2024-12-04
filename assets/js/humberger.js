 const hamburger = document.querySelector('.hamburger');
        const sideNav = document.querySelector('.side-nav2');
        const sideNavClose = document.querySelector('.side-nav-close');

function showContent() {
hamburger.addEventListener('click', () => {
            sideNav.classList.add('open');
        });

        sideNavClose.addEventListener('click', () => {
            sideNav.classList.remove('open');
        });

        // Close side nav when clicking outside
        document.addEventListener('click', (event) => {
            if (!sideNav.contains(event.target) && !hamburger.contains(event.target)) {
                sideNav.classList.remove('open');
            }
        });
