// ==========================================
// INJECTOR FOR GOOGLE DOCS FIX
// ==========================================

// We use this injector to load the docs_fix.js into the main world.
// Using "world": "MAIN" in manifest.json causes crashes in some mobile Chromium forks like Cromite.
const script = document.createElement('script');
script.src = chrome.runtime.getURL('docs_fix.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);
