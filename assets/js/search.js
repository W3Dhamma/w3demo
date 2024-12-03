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
let htmlFiles = [];

const BASE_URL = 'https://w3dhamma.github.io/w3demo/subject/abhidhamma/';

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

async function discoverHtmlFiles() {
    try {
        // First, try to fetch the directory listing
        const response = await fetch(BASE_URL);
        const html = await response.text();
        
        // Create a temporary element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Find all links that end with .html
        const links = Array.from(doc.querySelectorAll('a'))
            .filter(link => link.href.endsWith('.html'))
            .map(link => {
                // Extract just the filename from the full URL
                const url = new URL(link.href);
                return url.pathname.split('/').pop();
            });

        // Store the discovered files
        htmlFiles = links;
        console.log(`Discovered ${htmlFiles.length} HTML files`);
    } catch (error) {
        console.error('Error discovering HTML files:', error);
        // Fallback to checking sequential numbers if directory listing fails
        htmlFiles = [];
        for(let i = 1; i <= 999; i++) {
            const paddedNumber = i.toString().padStart(4, '0');
            htmlFiles.push(`${paddedNumber}.html`);
        }
    }
}

async function fetchAndSearchFile(filename) {
    try {
        const response = await fetch(`${BASE_URL}${filename}`);
        const html = await response.text();
        return html;
    } catch (error) {
        console.error(`Error fetching ${filename}:`, error);
        return null;
    }
}

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

    try {
        if (htmlFiles.length === 0) {
            await discoverHtmlFiles();
        }

        allResults = [];
        let searchPromises = [];

        // Create a promise for each file
        for (const filename of htmlFiles) {
            searchPromises.push(
                fetchAndSearchFile(filename).then(html => {
                    if (!html) return null;

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const sections = doc.querySelectorAll('section');
                    
                    sections.forEach(section => {
                        const sectionText = section.textContent.toLowerCase();
                        if (sectionText.includes(searchTerm)) {
                            const title = section.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || 
                                        `Section from ${filename}`;
                            const snippet = getSnippet(sectionText, searchTerm);
                            allResults.push({
                                title,
                                snippet,
                                file: filename,
                                id: section.id
                            });
                        }
                    });
                })
            );
        }

        // Wait for all searches to complete
        await Promise.all(searchPromises);

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
    }
}

function getSnippet(text, term) {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + term.length + 50);
    let snippet = text.slice(start, end);
    
    // Add ellipsis if we're not at the start/end of the text
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet;
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
            <a href="${BASE_URL}${result.file}${result.id ? '#' + result.id : ''}" 
               class="learn-more" 
               target="_blank">
                Learn More
            </a>
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

// Initialize file discovery when the script loads
discoverHtmlFiles();

