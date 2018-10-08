const {
    app,
    BrowserWindow
} = require('electron');
const {
    spawn
} = require('child_process');
const {
    ipcMain
} = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let child;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 1024,
        width: 1280,
        icon: path.join(__dirname, 'assets/icons/zenodys-icon-128x128.ico')
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function() {
        fs.writeFile(path.join(__dirname, "engine"), "", function(err) { });
        mainWindow = null;
    });

});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin')
        app.quit();
});

ipcMain.on("showVisualisations", function(event, arg) {
    var newWindow = new BrowserWindow({
        width: 1280,
        height: 1024,
        show: false,
        icon: path.join(__dirname, 'assets/icons/zenodys-icon-128x128.ico'),
        webPreferences: {
            webSecurity: false,
            plugins: true,
            nodeIntegration: false
        }
    });
    newWindow.loadURL("http://localhost:9999/home/index");
    newWindow.show();
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

ipcMain.on("startEngine", function(event, arg) {
    child = spawn(path.join(__dirname, "ZenEngine\\ZenEngine.exe"), {
        cwd: path.join(__dirname, "ZenEngine")
    });

    child.stdout.on('data', (data) => {
        if (isJSON(data.toString())) {
            try {
                var cnt = JSON.parse(data);
                sendToRenderer('onZenEngineCount', cnt.Data);
            }
            catch (e) {
              sendToRenderer('onZenEngineOutput', 'WARNING: unable to parse ' + data.toString());
            }
        } else {
            console.log(data.toString());
            sendToRenderer('onZenEngineOutput', data.toString());
        }
    });

    child.stderr.on('data', (data) => {
        var arg = data != null ? data : '';
        sendToRenderer("onZenEngineError", arg);
    });

    child.on('exit', (code, signal) => {
        sendToRenderer("onZenEngineExit");
    });
});

ipcMain.on("stopEngine", function(event, arg) {
    child.stdin.pause();
    child.kill();
});

function sendToRenderer(topic, arg) {
    if (mainWindow !== null && mainWindow.webContents !== null)
        mainWindow.webContents.send(topic, arg);
}

function isJSON(text) {
    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
        return true;
    else
        return false;
}