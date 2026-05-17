# DeX Productivity Suite Overview

## Purpose
The DeX Productivity Suite is a set of two Chrome Extensions built primarily to improve the web browsing experience on Android devices running Chromium forks (such as Cromite, Kiwi Browser, and Samsung DeX setups).

Due to stability issues in mobile Chromium forks (specifically crashing when a background worker intercepts new tabs during extension initialization), the suite has been split into two separate extensions:
1. **Hover & Docs Fix**: A content-script-only extension that cannot crash the browser on unpack.
2. **New Tab Search**: A dedicated extension providing an auto-focused search page via a keyboard shortcut.

---

## Extension 1: Hover & Docs Fix (`/hover-docs-fix/`)

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

---

## Extension 2: New Tab Search (`/new-tab-feature/`)

### 1. New Tab Auto-Focus Search Bar
**Files:** `background.js`, `newtab.html`, `newtab.css`, `newtab.js`

**How it works:**
Due to security restrictions, extensions cannot programmatically focus the native browser address bar. To solve this, a custom page with a large search bar was created that auto-focuses on load.
- **Shortcut (`Alt+T`)**: Native browser shortcuts (like `Ctrl+T` for a new tab) cannot be reliably overridden by extensions. Instead, the `manifest.json` defines a `chrome.commands` shortcut for `Alt+T`.
- `background.js` listens for the `Alt+T` command and opens the custom `newtab.html` page in a new tab.
- When the user types and hits Enter in `newtab.html`, the script parses the query and navigates to the URL or performs a Google Search.

---

## Known Limitations on Mobile Chromium Forks

### Bookmarks and History APIs
Attempting to implement Bookmarks and History search inside the New Tab page can cause the browser to crash.
- **The Issue:** Mobile forks like Cromite often have incomplete implementations of `chrome.bookmarks` and `chrome.history`. Requesting these permissions in `manifest.json` or invoking the APIs can trigger null pointer exceptions in the native Android app code, immediately crashing the browser upon unpack or execution.
- **Workaround:** Stick to simple URL routing and web searches (as currently implemented) to avoid calling unstable native APIs.
