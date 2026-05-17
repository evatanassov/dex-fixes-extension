chrome.commands.onCommand.addListener((command) => {
    if (command === "open_new_tab") {
        chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
    }
});
