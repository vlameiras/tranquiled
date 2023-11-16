const { app, BrowserWindow, globalShortcut, screen } = require('electron');

const useAllDisplays = true; // Set to false to use only the primary display
let windows = []; // Array to keep track of all windows

function createWindow(display) {
    const { width, height, x, y } = display.bounds;

    let win = new BrowserWindow({
        width: 100,
        height: 100,
        x: x + width - 110,
        y: y + height - 110,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    windows.push(win); // Add the created window to the array
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    if (useAllDisplays) {
        const displays = screen.getAllDisplays();
        displays.forEach(display => createWindow(display));
    } else {
        createWindow(screen.getPrimaryDisplay());
    }

    globalShortcut.register('Ctrl+Shift+L', () => {
        windows.forEach(win => {
            win.webContents.send('toggle-led');
        });
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            if (useAllDisplays) {
                const displays = screen.getAllDisplays();
                displays.forEach(display => createWindow(display));
            } else {
                createWindow(screen.getPrimaryDisplay());
            }
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
