// ==========================================
// GOOGLE DOCS DESKTOP TEXT SELECTION FIX
// ==========================================

// Force non-touch behaviour
Object.defineProperty(navigator, 'maxTouchPoints', {
    get: () => 0
});

// Remove touch hints if present
if ('ontouchstart' in window) {
    delete window.ontouchstart;
}

console.log("DeX Docs Fix: Desktop text selection enforced.");
