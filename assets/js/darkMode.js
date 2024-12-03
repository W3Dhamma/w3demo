const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

body.classList.add('dark-mode');
updateDarkModeIcon();

function updateDarkModeIcon() {
    const isDarkMode = body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    updateDarkModeIcon();
});

