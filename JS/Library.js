// Script for books and stuff
const bookGrid = document.getElementById('bookGrid');
const statusMsg = document.getElementById('statusMsg');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const reader_Overlay = document.getElementById('reader_Overlay');
const reader_Title = document.getElementById('reader_Title');
const reader_Content = document.getElementById('reader_Content');
const reader_Close = document.getElementById('reader_Close');
const fontSizeRange = document.getElementById('fontSizeRange');

// Load some books when page load
window.addEventListener('load', () => {
    fetchBooks('children');
});

// Search function

//When clicking search button
searchButton.addEventListener('click', () => {
    const search = searchInput.value.trim(); // Deletes space after search
    if (search) fetchBooks(search);
});

// When entering on keyboard
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const search = searchInput.value.trim();
        if (search) fetchBooks(search);
    }
});

// Fetch books from Gutendex API/Library 
// IF NOT FETCHING PROBABLY CORS ERROR[Need wififi & not host locally]
function fetchBooks(search) {
    bookGrid.innerHTML = ''; // Empty the space
    statusMsg.textContent = 'Searching...';

    // Public API, no key
    fetch(`https://gutendex.com/books/?search=${encodeURIComponent(search)}&languages=en`)
        .then(res => res.json())
        .then(data => {
            if (data.results.length === 0) {
                statusMsg.textContent = 'No books found. Try a different search!';
                return;
            }
            statusMsg.textContent = `${data.results.length} books found`;
            data.results.forEach(book => renderBookCard(book));
        })

        // Catching any errors
        .catch(() => {
            statusMsg.textContent = 'Could not load any books. Try again next time.';
        });
}

// Render in a single book card
function renderBookCard(book) {
    const title = book.title || 'Untitled';
    const authors = book.authors.map(a => a.name).join(', ') || 'John Doe';
    const coverUrl = book.formats['image/jpeg'] || null;

    // Finding plain text URL to read to get ze data
    const textUrl = book.formats['text/plain; charset=us-ascii']
        || book.formats['text/plain; charset=utf-8']
        || book.formats['text/plain']
        || null;
    
    // Making new div to store all the books info
    const card = document.createElement('div');
    card.className = 'BookCard';

    const coverHTML = coverUrl
        ? `<img class="BookCover" src="${coverUrl}" alt="${title} cover" loading="lazy">`
        : `<div class="BookCoverPlaceholder">${title}</div>`;

    card.innerHTML = `
        ${coverHTML}
        <div class="BookInfo">
            <p class="BookTitle">${title}</p>
            <p class="BookAuthor">${authors}</p>
            ${textUrl ? `<button class="ReadBtn">Read now →</button>` : `<span class="ReadBtn" style="color:#aaa; cursor:default;">Not available</span>`}
        </div>
    `;

    if (textUrl) {
        card.querySelector('.ReadBtn').addEventListener('click', () => {
            openReader(title, textUrl);
        });
    }

    bookGrid.appendChild(card);
}

// Open reader modal
function openReader(title, textUrl) {
    reader_Title.textContent = title;
    reader_Content.innerHTML = '<p class="reader-loading">Loading book...</p>';
    reader_Overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    fetch(textUrl)
        .then(res => res.text())
        .then(text => {
            // Show the first 20,000 characters so it loads fast
            const preview = text.slice(0, 20000);
            reader_Content.textContent = preview;
            reader_Content.style.fontSize = fontSizeRange.value + 'px';
        })
        .catch(() => {
            reader_Content.innerHTML = '<p class="reader-loading">Could not load this book.</p>';
        });
}

//Close ze reader 
reader_Close.addEventListener('click', closeReader);
reader_Overlay.addEventListener('click', (e) => {
    if (e.target === reader_Overlay){
        closeReader();
}
});

function closeReader() {
    reader_Overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Font size control cause yeah
fontSizeRange.addEventListener('input', () => {
    reader_Content.style.fontSize = fontSizeRange.value + 'px';
});