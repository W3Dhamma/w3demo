const searchToggle = document.querySelector('.search-toggle');
const searchOverlay = document.querySelector('.search-overlay');
const searchClose = document.querySelector('.search-close');
const searchInput = document.getElementById('search');
const searchResults = document.querySelector('.search-results');
const searchMessage = document.getElementById('search-message');
const loadMoreButton = document.querySelector('.load-more');

let allResults = [];
let currentPage = 1;
const resultsPerPage = 10;

searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    hideContent();
    searchInput.focus();
});

searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    showContent();
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchMessage.textContent = '';
    loadMoreButton.style.display = 'none';
});

async function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';
    searchMessage.textContent = 'Searching...';
    loadMoreButton.style.display = 'none';

    if (searchTerm.trim() === '') {
        searchMessage.textContent = '';
        return;
    }

    const searchAnimation = document.querySelector('.search-animation');
    searchAnimation.classList.add('active');
    searchAnimation.play();

    try {
        const response = await fetch('/api/search?term=' + encodeURIComponent(searchTerm));
        allResults = await response.json();

        if (allResults.length === 0) {
            searchMessage.textContent = 'No results found.';
        } else {
            searchMessage.textContent = `${allResults.length} results found.`;
            currentPage = 1;
            displayResults();
        }
    } catch (error) {
        console.error('Error during search:', error);
        searchMessage.textContent = 'An error occurred during the search.';
    } finally {
        searchAnimation.classList.remove('active');
        searchAnimation.pause();
        searchAnimation.currentTime = 0;
    }
}

function displayResults() {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const pageResults = allResults.slice(startIndex, endIndex);

    pageResults.forEach((result, index) => {
        const resultElement = document.createElement('div');
        resultElement.className = 'search-result';
        resultElement.innerHTML = `
            <h3>${result.title}</h3>
            <p>${highlightText(result.snippet, searchInput.value)}</p>
            <a href="${result.file}${result.id ? '#' + result.id : ''}" class="learn-more">Learn More</a>
        `;
        searchResults.appendChild(resultElement);
        setTimeout(() => resultElement.classList.add('visible'), 50 * index);
    });

    loadMoreButton.style.display = endIndex < allResults.length ? 'block' : 'none';
}

function highlightText(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

searchToggle.addEventListener('click', performSearch);

loadMoreButton.addEventListener('click', () => {
    currentPage++;
    loadMoreButton.style.display = 'none';
    const loader = document.createElement('div');
    loader.className = 'loader';
    searchResults.appendChild(loader);
    setTimeout(() => {
        searchResults.removeChild(loader);
        displayResults();
    }, 1000);
});

