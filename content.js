// ==========================================
// DEX HOVER ENFORCER (Shift + Click)
// ==========================================
document.addEventListener('click', function(event) {
    if (event.shiftKey) {

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const targetElement = event.target;
        const hoverEvents = ['mouseover', 'mouseenter', 'mousemove'];

        hoverEvents.forEach(eventType => {
            const simulatedEvent = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: event.clientX,
                clientY: event.clientY,
                screenX: event.screenX,
                screenY: event.screenY
            });
            targetElement.dispatchEvent(simulatedEvent);
        });

        // Optional visual cue
        const originalOutline = targetElement.style.outline;
        targetElement.style.outline = "2px solid red";
        setTimeout(() => {
            targetElement.style.outline = originalOutline;
        }, 300);

        console.log("DeX Hover Enforcer: Triggered hover on", targetElement);
    }
}, true);
