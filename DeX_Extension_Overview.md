# DeX Productivity Suite Overview

## Purpose
The DeX Productivity Suite is a Chrome Extension built primarily to improve the web browsing experience on Android devices running Chromium forks (such as Cromite, Kiwi Browser, and Samsung DeX setups).

It solves three specific pain points on mobile browsers:
1. Missing hover states
2. Broken text selection in Google Docs
3. The inability to auto-focus the address bar on new tabs

## Core Features & Architecture

### 1. DeX Hover Enforcer (Shift + Click)
**Files:** `content.js`

**How it works:**
Mobile browsers lack a native "hover" state since touchscreens don't have a cursor. This script listens for a click event where the `Shift` key is held down. When detected, it intercepts the click and dispatches synthetic `mouseover`, `mouseenter`, and `mousemove` events to the target element, effectively tricking the website into displaying its hover state.

### 2. Google Docs Desktop Text Selection Fix
**Files:** `docs_fix.js`, `docs_fix_injector.js`

**How it works:**
Google Docs often forces a touch-optimized UI on mobile devices, which can break standard cursor-based text selection when using a physical keyboard and mouse (like in Samsung DeX).
- `docs_fix.js` overrides `navigator.maxTouchPoints` to return `0` and deletes `window.ontouchstart`.
- `docs_fix_injector.js` dynamically injects this script into the page's "Main World" (the same execution environment as the webpage itself) so that Google Docs' scripts read the modified, non-touch properties.

### 3. New Tab Auto-Focus Search Bar
**Files:** `background.js`, `newtab.html`, `newtab.css`, `newtab.js`

**How it works:**
Due to security restrictions, extensions cannot programmatically focus the native browser address bar.
- `background.js` listens for the creation of new tabs. If the URL is `chrome://newtab/`, it redirects the tab to the extension's custom `newtab.html` page.
- `newtab.html` contains a large search bar that is automatically focused via `newtab.js` the moment the page loads. When the user types and hits Enter, the script parses the query and navigates to the URL or performs a Google Search.

## Known Limitations on Mobile Chromium Forks

### Bookmarks and History APIs
Attempting to implement Bookmarks and History search inside the New Tab page can cause the browser to crash.
- **The Issue:** Mobile forks like Cromite often have incomplete implementations of `chrome.bookmarks` and `chrome.history`. Requesting these permissions in `manifest.json` or invoking the APIs can trigger null pointer exceptions in the native Android app code, immediately crashing the browser upon unpack or execution.
- **Workaround:** Stick to simple URL routing and web searches (as currently implemented) to avoid calling unstable native APIs.

### Manifest V3 `world: "MAIN"`
The `world: "MAIN"` property in `manifest.json` is a recent addition to Chrome for injecting content scripts into the main execution environment.
- **The Issue:** Encountering this property in the manifest will crash some Android Chromium forks during the "Load unpacked" process.
- **Workaround:** Use a standard content script (`docs_fix_injector.js`) to manually append a `<script>` tag to the DOM, achieving the same result without crashing the manifest parser.
