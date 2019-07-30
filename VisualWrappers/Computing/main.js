const electron = require('electron');
const app = (process.type === 'renderer') ? electron.remote.app : electron.app;
const BrowserWindow = (process.type === 'renderer') ? electron.remote.BrowserWindow : electron.BrowserWindow;
const ipcMain = (process.type === 'renderer') ? electron.remote.ipcMain : electron.ipcMain;
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 1024,
        width: 1280,
        icon: path.join(__dirname, 'assets/icons/zenodys-icon-128x128.ico')
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', _ => {
        mainWindow = null
      });

});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin')
        app.quit();
});

ipcMain.on("showDevelopmentTool", function(event, arg) {
    var newWindow = new BrowserWindow({
        width: 1280,
        height: 1024,
        show: false,
        icon: path.join(__dirname, 'assets/icons/zenodys-icon-128x128.ico')
    });
    newWindow.loadURL('file://' + __dirname + '/visual.tool.html');
    newWindow.show();
});