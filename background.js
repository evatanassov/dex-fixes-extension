chrome.tabs.onCreated.addListener((tab) => {
    // Check if the newly created tab is a standard New Tab
    if (tab.pendingUrl === "chrome://newtab/" || tab.url === "chrome://newtab/" || tab.url === "") {
        // Redirect it to our custom extension page
        chrome.tabs.update(tab.id, {
            url: chrome.runtime.getURL("newtab.html")
        });
    }
});
