document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    
    // Automatically focus the input field as soon as the tab opens
    searchInput.focus();

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (!query) return;

            // Simple check to see if the user typed a URL (e.g., example.com)
            const isUrl = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-.\/?%&=]*)?$/i.test(query);

            if (isUrl) {
                // If it's a URL, navigate to it
                let url = query;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                window.location.href = url;
            } else {
                // Otherwise, perform a Google Search
                window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(query);
            }
        }
    });
});
