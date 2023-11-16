const { ipcRenderer } = require('electron');

let isBlinking = false;
let blinkInterval;
let offTimeout;
let isVisible = true;
const led = document.getElementById('led');

function startBlinking() {
    if (isBlinking) return;
    isBlinking = true;
    led.style.display = 'block';
    blinkInterval = setInterval(() => {
        isVisible = !isVisible;
        led.style.opacity = isVisible ? 1 : 0;
    }, 500); // Adjust this value as needed
    offTimeout = setTimeout(stopBlinking, 30 * 60 * 1000); // Stop after 30 minutes
}

function stopBlinking() {
    isBlinking = false;
    clearInterval(blinkInterval);
    clearTimeout(offTimeout);
    led.style.display = 'none';
}

ipcRenderer.on('toggle-led', () => {
    if (isBlinking) {
        stopBlinking();
    } else {
        startBlinking();
    }
});

// Start blinking as soon as the app loads
startBlinking();
