document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const suggestionsList = document.getElementById('suggestions-list');
    let currentSuggestions = [];
    let activeIndex = -1;
    
    // Automatically focus the input field as soon as the tab opens
    searchInput.focus();

    // Fetch and display suggestions on input
    searchInput.addEventListener('input', async (event) => {
        const query = event.target.value.trim();
        if (!query) {
            clearSuggestions();
            return;
        }

        try {
            // Fetch from both APIs
            const [bookmarks, history] = await Promise.all([
                new Promise(resolve => chrome.bookmarks.search({ query: query }, resolve)),
                new Promise(resolve => chrome.history.search({ text: query, maxResults: 10 }, resolve))
            ]);

            // Combine and deduplicate by URL
            const seenUrls = new Set();
            const combined = [];

            // Add bookmarks first (usually higher quality matches)
            if (bookmarks) {
                for (const item of bookmarks) {
                    if (item.url && !seenUrls.has(item.url)) {
                        seenUrls.add(item.url);
                        combined.push(item);
                    }
                }
            }

            // Add history
            if (history) {
                for (const item of history) {
                    if (item.url && !seenUrls.has(item.url)) {
                        seenUrls.add(item.url);
                        combined.push(item);
                    }
                }
            }

            // Limit to top 8 suggestions
            currentSuggestions = combined.slice(0, 8);
            renderSuggestions();
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            // Ignore API errors (e.g. if unsupported on mobile)
        }
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (currentSuggestions.length > 0) {
                activeIndex = (activeIndex + 1) % currentSuggestions.length;
                updateActiveSuggestion();
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (currentSuggestions.length > 0) {
                activeIndex = (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
                updateActiveSuggestion();
            }
        } else if (event.key === 'Enter') {
            event.preventDefault();
            
            // If a suggestion is highlighted, navigate to it
            if (activeIndex >= 0 && activeIndex < currentSuggestions.length) {
                window.location.href = currentSuggestions[activeIndex].url;
                return;
            }

            // Otherwise, normal search or URL navigation
            const query = searchInput.value.trim();
            if (!query) return;

            const isUrl = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-.\/?%&=]*)?$/i.test(query);

            if (isUrl) {
                let url = query;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                window.location.href = url;
            } else {
                window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(query);
            }
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (event) => {
        if (event.target !== searchInput && event.target !== suggestionsList) {
            clearSuggestions();
        }
    });

    function renderSuggestions() {
        suggestionsList.innerHTML = '';
        activeIndex = -1;

        if (currentSuggestions.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }

        currentSuggestions.forEach((item, index) => {
            const li = document.createElement('li');
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'suggestion-title';
            titleSpan.textContent = item.title || item.url;
            
            const urlSpan = document.createElement('span');
            urlSpan.className = 'suggestion-url';
            urlSpan.textContent = item.url;

            li.appendChild(titleSpan);
            li.appendChild(urlSpan);

            li.addEventListener('mousedown', (e) => {
                // Use mousedown instead of click to prevent focus loss before navigation
                e.preventDefault();
                window.location.href = item.url;
            });

            suggestionsList.appendChild(li);
        });

        suggestionsList.style.display = 'block';
    }

    function updateActiveSuggestion() {
        const items = suggestionsList.querySelectorAll('li');
        items.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function clearSuggestions() {
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
        currentSuggestions = [];
        activeIndex = -1;
    }
});
